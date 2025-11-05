// BillAccountForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { useGetVendorForDropDown } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';
import { Label } from '../../../../components/ui/Label';
import type { BillItem, CreateBillPayload } from './CreateBillAcc';



// interface BillFormData {
//     vendorId: string;
//     vendorName: string;
//     billNumber: string;
//     accountsPayable: string;
//     subject: string;
//     dueDate: string;
//     billDate: string;
//     items: BillItem[];
//     discountPercentage: number;
//     taxPercentage: number;
//     notes: string;
// }


// CAN USE THE OMIT ALSO INSTEAD OF PICK

// export type BillFormData = Omit<
//   CreateBillPayload,
//   | 'organizationId'
//   | 'totalAmount'
//   | 'discountAmount'
//   | 'taxAmount'
//   | 'grandTotal'
//   | 'createdAt'
// >;


export type BillFormData = Pick<
    CreateBillPayload,
    | 'vendorId'
    | 'vendorName'
    | 'billNumber'
    | 'accountsPayable'
    | 'subject'
    | 'dueDate'
    | 'billDate'
    | 'items'
    | 'discountPercentage'
    | 'taxPercentage'
    | 'notes'
>;

interface BillAccountFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: BillFormData;
    onSubmit: (data: CreateBillPayload) => Promise<void>;
    isSubmitting: boolean;
    organizationId: string;
}

const BillAccountForm: React.FC<BillAccountFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
    organizationId
}) => {
    const navigate = useNavigate();
    const [currentMode, _setCurrentMode] = useState<'create' | 'view' | 'edit'>(initialMode);

    const { data: VendorData } = useGetVendorForDropDown(organizationId)

    const defaultFormData: BillFormData = {
        vendorId: '',
        vendorName: '',
        billNumber: '',
        accountsPayable: '',
        subject: '',
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
            {
                itemName: "",
                rate: 0,
                quantity: 1,
                totalCost: 0
            }
        ],
        discountPercentage: 0,
        taxPercentage: 0,
        notes: ''
    };


    const [enableVendorInput, setEnableVendorInput] = useState<boolean>(false)
    const [formData, setFormData] = useState<BillFormData>(defaultFormData);

    const [calculatedTotals, setCalculatedTotals] = useState({
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        grandTotal: 0
    });

    // Load initial data if provided (for view/edit mode)
    useEffect(() => {
        if (initialData) {
            // console.log("inita; data in useeffect", initialData)
            setFormData({
                vendorId: initialData?.vendorId || '',
                vendorName: initialData?.vendorName || '',
                billNumber: initialData.billNumber || '',
                accountsPayable: initialData.accountsPayable || '',
                subject: initialData.subject || '',
                billDate: initialData.billDate
                    ? new Date(initialData.billDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                dueDate: initialData.dueDate
                    ? new Date(initialData.dueDate).toISOString().split('T')[0]
                    : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                items: initialData.items || [
                    {
                        itemName: "",
                        rate: 0,
                        quantity: 1,
                        totalCost: 0
                    }
                ],
                discountPercentage: initialData.discountPercentage || 0,
                taxPercentage: initialData.taxPercentage || 0,
                notes: initialData.notes || ''
            });

            if(initialMode === "view"){
                setEnableVendorInput(true)
            }
        }
    }, [initialData]);


    // Calculate totals whenever items, discount, or tax changes
    useEffect(() => {
        const totalAmount = formData.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
        const discountAmount = (totalAmount * formData.discountPercentage) / 100;
        const amountAfterDiscount = totalAmount - discountAmount;
        const taxAmount = (amountAfterDiscount * formData.taxPercentage) / 100;
        const grandTotal = amountAfterDiscount + taxAmount;

        setCalculatedTotals({
            totalAmount,
            discountAmount,
            taxAmount,
            grandTotal
        });
    }, [formData.items, formData.discountPercentage, formData.taxPercentage]);

    const VendorOptions = (VendorData || [])?.map((Vendor: { _id: string; email: string; vendorName: string }) => ({
        value: Vendor._id,
        label: Vendor.vendorName,
        email: Vendor.email
    }))


    // console.log("vendion", VendorOptions)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        setFormData(prev => ({
            ...prev,
            [name]: numValue < 0 ? 0 : numValue
        }));
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { itemName: '', quantity: 1, rate: 0, totalCost: 0 }]
        }));
    };

    const handleRemoveItem = (index: number) => {

        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            const item = { ...newItems[index] };

            if (field === 'itemName') {
                const previousValue = item.itemName;
                item.itemName = value as string;

                // Auto-add new row only when:
                // 1. It's the last row
                // 2. Previous value was empty
                // 3. New value is not empty
                const isLastRow = index === prev.items.length - 1;
                const wasEmpty = previousValue.trim() === '';
                const isNowFilled = (value as string).trim() !== '';

                if (isLastRow && wasEmpty && isNowFilled) {
                    // Add new row automatically (only once when transitioning from empty to filled)
                    newItems.push({ itemName: '', quantity: 1, rate: 0, totalCost: 0 });
                }
            } else if (field === 'quantity' || field === 'rate') {
                const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
                item[field] = numValue < 0 ? 0 : numValue;
                item.totalCost = item.quantity * item.rate;
            }

            newItems[index] = item;
            return { ...prev, items: newItems };
        });
    };


    const validateForm = (formData: BillFormData): string[] => {
        const errors: string[] = [];

        if (!formData.vendorName.trim()) {
            errors.push('Vendor name is required');
        }

        // if (!formData.VendorId.trim()) {
        //     errors.push('Vendor ID is required');
        // }

        // if (formData.items.length === 0) {
        //     errors.push('At least one item is required');
        // }

        formData.items.forEach((item, index) => {
            if (!item.itemName.trim()) {
                errors.push(`Item ${index + 1}: Item name is required`);
            }
            if (item.rate <= 0) {
                errors.push(`Item ${index + 1}: Rate must be greater than 0`);
            }
        });

        return errors;
    };


    const handleVendorChange = (value: string | null) => {
        const selectedVendor = VendorData?.find((Vendor: any) => Vendor._id === value)
        setFormData((prev) => ({
            ...prev,
            vendorId: value || "",
            vendorName: selectedVendor?.vendorName || ""
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clean empty rows first
        const cleanedItems = formData.items.filter(item =>
            item.itemName.trim() !== ''
        );

        // Update formData with cleaned items
        const dataToValidate = {
            ...formData,
            items: cleanedItems
        };

        const errors = validateForm(dataToValidate);

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const payload: CreateBillPayload = {
            ...dataToValidate,
            organizationId: '', // Will be set in CreateBillAcc component
            totalAmount: calculatedTotals.totalAmount,
            discountAmount: calculatedTotals.discountAmount,
            taxAmount: calculatedTotals.taxAmount,
            grandTotal: calculatedTotals.grandTotal
        };
        // console.log("payload", payload)
        await onSubmit(payload);
        setFormData(defaultFormData)
    };


    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';

    return (
        <div className="max-w-full mx-auto space-y-2">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div className='flex justify-between items-center gap-2'>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>

                        <i className="fas fa-arrow-left"></i>

                    </button>
                    <div>

                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-receipt mr-3 text-blue-600"></i>
                            {isCreateMode ? 'Create Bill' : isEditMode ? 'Update Bill' : 'View Bill'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isCreateMode ? 'Fill in the details to create a new Bill' :
                                isEditMode ? 'Update the Bill details' :
                                    'Bill details'}
                        </p>
                    </div>
                </div>
                {/* <div className="flex gap-2">
                    {currentMode === 'view' && (
                        <Button
                            type="button"
                            onClick={handleEdit}
                            className="bg-blue-600 text-white"
                        >
                            <i className="fas fa-edit mr-2"></i>
                            Edit
                        </Button>
                    )}
                    {currentMode === 'edit' && (
                        <Button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white"
                        >
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                        </Button>
                    )}

                </div> */}
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bill Details */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-file-alt mr-2 text-blue-600"></i>
                        Bill Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Vendor</Label>
                            <SearchSelectNew
                                options={VendorOptions}
                                placeholder="Select Vendor"
                                searchPlaceholder="Search Vendor..."
                                value={formData?.vendorId || undefined}
                                onValueChange={(value) => handleVendorChange(value)}
                                searchBy="name"
                                displayFormat="simple"
                                className="w-full"
                            />
                        </div>


                        <div className=''>
                            <div className='flex items-center gap-1'>
                                <input type="checkbox" className='cursor-pointer' checked={enableVendorInput} id="enableName" onChange={() => setEnableVendorInput((p) => (!p))} />
                                <Label htmlFor='enableName' className='cursor-pointer'>Click the check box to enter the name manually, if not available from the drop down</Label>
                            </div>
                            <input
                                type="text"
                                name="vendorName"
                                value={
                                    enableVendorInput
                                        ? formData?.vendorName // user can edit manually
                                        : "" // show from formData but not editable
                                }
                                onChange={(e) => {
                                    if (enableVendorInput) handleInputChange(e); // only update if manual input is enabled
                                }}
                                disabled={isReadOnly || !enableVendorInput} // only enable if checkbox is checked

                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter Vendor name"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter Remarks"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bill Date
                            </label>
                            <input
                                type="date"
                                name="billDate"
                                value={formData.billDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <i className="fas fa-list mr-2 text-blue-600"></i>
                            Items <span className="text-red-500 ml-1">*</span>
                        </h2>

                        {!isReadOnly && (
                            <Button
                                type="button"
                                onClick={handleAddItem}
                                variant='primary'
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add Item
                            </Button>
                        )}
                    </div>

                     {(formData?.items?.length === 0 && initialMode === "view") ? ( 
                        <div className="text-center py-8 text-gray-500">
                            <i className="fas fa-inbox text-4xl mb-2"></i>
                            <p>No items added yet. Start typing to add items.</p>
                            {/* <Button
                                type="button"
                                onClick={handleAddItem}
                                className="mt-4 bg-blue-600 text-white"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add First Item
                            </Button> */}
                        </div>
                    ) : ( 
                    <div className="overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-3 mb-2 px-4 py-3 bg-gray-100 rounded-lg font-semibold text-gray-700 text-sm">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-4 text-center">Item Name <span className="text-red-500">*</span></div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-center">Rate <span className="text-red-500">*</span></div>
                            <div className="col-span-2 text-center">Total</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>



                        {/* {formData?.items?.length === 0 && initialMode === "view" &&
                            <div className="text-center py-8 text-gray-500">
                                <i className="fas fa-inbox text-4xl mb-2"></i>
                                <p>No items added yet. Start typing to add items.</p>
                                
                            </div>
                        } */}


                        {/* Table Rows */}
                        <div className="space-y-2">
                            {formData.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors items-center"
                                >
                                    {/* Row Number */}
                                    <div className="col-span-1 text-center text-gray-600 font-medium">
                                        {index + 1}
                                    </div>

                                    {/* Item Name */}
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            value={item.itemName}
                                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                            placeholder="Enter item name"
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            disabled={isReadOnly}
                                            min="0"
                                            step="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Rate */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                            disabled={isReadOnly}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-2 text-center font-semibold text-gray-900">
                                        ₹{item.totalCost.toFixed(2)}
                                    </div>

                                    {/* Delete Button */}
                                    <div className="col-span-1 text-center">
                                        {!isReadOnly && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                disabled={formData.items.length === 1}
                                                className="text-red-600 cursor-pointer hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title={formData.items.length === 1 ? "Cannot delete last item" : "Delete item"}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Row */}
                        <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-blue-50 rounded-lg mt-4 font-semibold text-gray-800">
                            <div className="col-span-9 text-right">Subtotal:</div>
                            <div className="col-span-2 text-right text-blue-600 text-lg">
                                ₹{calculatedTotals.totalAmount.toFixed(2)}
                            </div>
                            <div className="col-span-1"></div>
                        </div>
                    </div>
                    )}
                </div>

                {/* Discount and Tax */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-calculator mr-2 text-blue-600"></i>
                        Discount & Tax
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleNumberChange}
                                disabled={isReadOnly}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tax Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="taxPercentage"
                                value={formData.taxPercentage}
                                onChange={handleNumberChange}
                                disabled={isReadOnly}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-receipt mr-2 text-blue-600"></i>
                        Bill Summary
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Subtotal:</span>
                            <span className="text-xl font-semibold text-gray-900">
                                ₹{calculatedTotals.totalAmount.toFixed(2)}
                            </span>
                        </div>
                        {formData.discountPercentage > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-blue-200">
                                <span className="text-gray-700 font-medium">
                                    Discount ({formData.discountPercentage}%):
                                </span>
                                <span className="text-xl font-semibold text-green-600">
                                    -₹{calculatedTotals.discountAmount.toFixed(2)}
                                </span>
                            </div>
                        )}
                        {formData.taxPercentage > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-blue-200">
                                <span className="text-gray-700 font-medium">
                                    Tax ({formData.taxPercentage}%):
                                </span>
                                <span className="text-xl font-semibold text-gray-900">
                                    ₹{calculatedTotals.taxAmount.toFixed(2)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-3 bg-blue-100 px-4 rounded-lg">
                            <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ₹{calculatedTotals.grandTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-comment-alt mr-2 text-blue-600"></i>
                        Additional Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                placeholder="Add any notes for the Vendor..."
                            />
                        </div>

                    </div>
                </div>

                {/* Action Buttons */}
                {!isReadOnly && (
                    <div className="flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 text-white px-6 py-2"
                            disabled={isSubmitting}
                        >
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {isCreateMode ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                <>
                                    <i className={`fas ${isCreateMode ? 'fa-plus' : 'fa-save'} mr-2`}></i>
                                    {isCreateMode ? 'Create Bill' : 'Update Bill'}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BillAccountForm;