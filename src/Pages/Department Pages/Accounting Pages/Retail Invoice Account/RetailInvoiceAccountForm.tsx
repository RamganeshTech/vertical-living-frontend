// RetailInvoiceAccountForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
// import type { CreateInvoicePayload } from './CreateInvoiceAcc';
import { useGetCustomerForDropDown } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';
import { Label } from '../../../../components/ui/Label';
import type { RetailCreateInvoicePayload } from './CreateRetailInvoiceAcc';
import type { IInvoicePdf } from '../Invoice Account/InvoiceAccountForm';
import { useGetProjects } from '../../../../apiList/projectApi';
import type { AvailableProjetType } from '../../Logistics Pages/LogisticsShipmentForm';
import { ORDERMATERIAL_UNIT_OPTIONS } from '../../../Stage Pages/Ordering Materials/OrderMaterialOverview';
import { Card, CardContent } from '../../../../components/ui/Card';
import { downloadImage } from '../../../../utils/downloadFile';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
// import { useSyncRetailInvoiceToAccounts } from '../../../../apiList/Department Api/Accounting Api/retailinvoiceApi';
// import { toast } from '../../../../utils/toast';
// import InfoTooltip from '../../../../components/ui/InfoToolTip';

interface RetailInvoiceItem {
    itemName: string;
    quantity: number;
    rate: number;
    unit: string;
    totalCost: number;
    _id?: string; // Added _id for updates

}

interface RetailInvoiceFormData {
    customerId: string;
    customerName: string;
    salesPerson: string;
    subject: string;
    invoiceDate: string;
    projectId: string | null
    projectName: string | null
    items: RetailInvoiceItem[];
    discountPercentage: number;
    taxPercentage: number;
    pdfData?: IInvoicePdf;
    customerNotes: string
}

interface RetailInvoiceAccountFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    onSubmit: (data: RetailCreateInvoicePayload) => Promise<void>;
    isSubmitting: boolean;
    organizationId: string;
}

const RetailInvoiceAccountForm: React.FC<RetailInvoiceAccountFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
    organizationId
}) => {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'edit'>(initialMode);

    const { data: customerData } = useGetCustomerForDropDown(organizationId)

    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.retailinvoice?.list;
    // const canCreate = role === "owner" || permission?.retailinvoice?.create
    const canEdit = role === "owner" || permission?.retailinvoice?.edit
    // const canDelete = role === "owner" || permission?.retailinvoice?.delete



    const defaultFormData = {
        customerId: '',
        customerName: '',
        salesPerson: '',
        projectId: null,
        projectName: null,
        subject: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{
            itemName: "",
            rate: 0,
            unit: "nos",
            quantity: 1,
            totalCost: 0
        }],
        discountPercentage: 0,
        taxPercentage: 0,
        customerNotes: "",
    }

    const [enableCustomerInput, setEnableCustomerInput] = useState<boolean>(false)
    const [formData, setFormData] = useState<RetailInvoiceFormData>(defaultFormData);

    const [calculatedTotals, setCalculatedTotals] = useState({
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        grandTotal: 0
    });
    // const { mutateAsync: syncAccountsMutation, isPending: syncAccountsLoading } = useSyncRetailInvoiceToAccounts()

    // const handleSyncToAccounts = async () => {
    //     try {
    //         await syncAccountsMutation({
    //             id: initialData._id!
    //         });
    //         toast({ title: "Success", description: "Invoice sent to Accounts Department" });
    //     } catch (error: any) {
    //         toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
    //     }
    // }


    const parseInitialData = (initialData: any): RetailInvoiceFormData => {
        return {
            customerId: initialData.customerId || null,
            customerName: initialData.customerName || '',
            projectId: initialData.projectId || null,
            projectName: initialData.projectName || null,
            salesPerson: initialData.salesPerson || '',
            subject: initialData.subject || '',
            invoiceDate: initialData.invoiceDate ? new Date(initialData.invoiceDate).toISOString().split('T')[0] : '',
            items: initialData.items || [],
            discountPercentage: initialData.discountPercentage || 0,
            taxPercentage: initialData.taxPercentage || 0,
            pdfData: initialData.pdfData,
            customerNotes: initialData?.customerNotes || '',
        };
    };
    // Load initial data if provided (for view/edit mode)
    useEffect(() => {
        if (initialData) {
            setFormData(parseInitialData(initialData));
            // If coming from Single page, ensure mode is view initially if not specified otherwise
            if (initialMode === 'view') {
                setCurrentMode('view');
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

    const customerOptions = (customerData || [])?.map((customer: { _id: string; email: string; customerName: string }) => ({
        value: customer._id,
        label: customer.customerName,
        email: customer.email
    }))

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const { data: projectData } = useGetProjects(organizationId!);
    const projects = projectData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));


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
            items: [...prev.items, { itemName: '', quantity: 1, unit: "nos", rate: 0, totalCost: 0 }]
        }));
    };

    const handleRemoveItem = (index: number) => {

        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };


    const handleEdit = () => {
        setCurrentMode('edit');
    };

    const handleCancelEdit = () => {
        // 1. Revert mode
        setCurrentMode('view');
        // 2. Reset data to original
        if (initialData) {
            setFormData(parseInitialData(initialData));
        }
    };



    const handleItemChange = (index: number, field: keyof RetailInvoiceItem, value: string | number) => {
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
                    newItems.push({ itemName: '', quantity: 1, unit: "nos", rate: 0, totalCost: 0 });
                }
            } else if (field === 'quantity' || field === 'rate') {
                const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
                item[field] = numValue < 0 ? 0 : numValue;
                item.totalCost = item.quantity * item.rate;
            }
            else if (field === 'unit') {
                item.unit = value as string;
            }

            newItems[index] = item;
            return { ...prev, items: newItems };
        });
    };


    const validateForm = (formData: RetailInvoiceFormData): string[] => {
        const errors: string[] = [];

        if (!formData.customerName.trim()) {
            errors.push('Customer name is required');
        }

        // if (!formData.customerId.trim()) {
        //     errors.push('Customer ID is required');
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


    const handleCustomerChange = (value: string | null) => {
        const selectedCustomer = customerData?.find((customer: any) => customer._id === value)
        setFormData((prev) => ({
            ...prev,
            customerId: value || "",
            customerName: selectedCustomer?.customerName || ""
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clean empty rows first
        const cleanedItems = formData.items.filter(item =>
            item.itemName.trim() !== ''
        );

        // if (cleanedItems.length === 0) {
        //     alert("Please add at least one item");
        //     return;
        // }

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

        const payload: RetailCreateInvoicePayload = {
            ...dataToValidate,
            organizationId: '', // Will be set in CreateInvoiceAcc component
            totalAmount: calculatedTotals.totalAmount,
            discountAmount: calculatedTotals.discountAmount,
            taxAmount: calculatedTotals.taxAmount,
            grandTotal: calculatedTotals.grandTotal
        };
        // console.log("payload", payload)
        // await onSubmit(payload);

        try {
            console.log("gettig caled ")
            await onSubmit(payload);

            // If this was an update (edit mode), switch back to view mode on success
            if (currentMode === 'edit') {
                setCurrentMode('view');
            }

            // If it was create mode, reset form
            if (currentMode === 'create') {
                setFormData(defaultFormData);
            }
        } catch (error) {
            // Error handled in parent, but we keep the form in edit mode so user can fix it
            console.error("Form submission failed", error);
        }
    };

    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';

    return (
        <div className="max-w-full mx-auto space-y-2">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-4 pt-2 mb-6 flex justify-between items-center">
                {/* <header className="flex justify-between items-center"> */}
                <div className='flex justify-between items-center gap-2'>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>

                        <i className="fas fa-arrow-left"></i>

                    </button>
                    <div>

                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-file-invoice mr-3 text-blue-600"></i>
                            {isCreateMode ? 'Create Retail Invoice' : isEditMode ? 'Update Retail Invoice' : 'View Retail Invoice'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isCreateMode ? 'Fill in the details to create a new invoice' :
                                isEditMode ? 'Update the Retail invoice details' :
                                    'Retail Invoice details'}
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
                        </div>  */}



                <div className="flex items-center space-y-1">
                    {/* <Button
                            variant="primary"
                            isLoading={syncAccountsLoading}
                            onClick={handleSyncToAccounts}
                        >
                            Send To Accounts Dept
                        </Button>

                        <InfoTooltip
                            content="Click the button to send the payment to accounts department"
                            type="info"
                            position="bottom"
                        /> */}


                    {(currentMode === 'view' && canEdit) && (
                        <Button
                            type="button"
                            onClick={handleEdit}
                            className="bg-blue-600 text-white"
                        >
                            <i className="fas fa-edit mr-2"></i>
                            Edit
                        </Button>
                    )}

                    {!isReadOnly && (
                        <div className="flex justify-end gap-4 pt-6">
                            <Button
                                type="button"
                                variant='secondary'
                                onClick={isEditMode ? handleCancelEdit : () => navigate(-1)}
                                className="px-6 py-2"
                                disabled={isSubmitting}
                            >
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white px-6 py-2"
                                isLoading={isSubmitting}

                            >

                                <><i className={`fas ${isCreateMode ? 'fa-plus' : 'fa-save'} mr-2`}></i> {isCreateMode ? 'Create Invoice' : 'Update Invoice'}</>
                            </Button>
                        </div>
                    )}

                </div>
            </header>

            <form className="space-y-6">
                {/* Customer Information */}
                {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-user mr-2 text-blue-600"></i>
                        Customer Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <Label>Customer</Label>
                            <SearchSelectNew
                                options={customerOptions}
                                placeholder="Select Customer"
                                searchPlaceholder="Search Customer..."
                                value={formData?.customerId || undefined}
                                onValueChange={(value) => handleCustomerChange(value)}
                                searchBy="name"
                                displayFormat="simple"
                                className="w-full"
                            />
                        </div>


                        <div className=''>
                            <div>
                                <input type="checkbox" checked={enableCustomerInput} id="enableName" onChange={() => setEnableCustomerInput((p) => (!p))} />
                                <Label htmlFor='enableName'>click the check box to enter the name manually, if not available from the drop down</Label>

                            </div>
                            <input
                                type="text"
                                name="customerName"
                                value={
                                    enableCustomerInput
                                        ? formData.customerName // user can edit manually
                                        :  "" // show from formData but not editable
                                }
                                onChange={(e) => {
                                    if (enableCustomerInput) handleInputChange(e); // only update if manual input is enabled
                                }}
                                disabled={isReadOnly || !enableCustomerInput} // only enable if checkbox is checked

                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter customer name"
                            />
                        </div>
                    </div>
                </div> */}

                {/* Invoice Details */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-file-alt mr-2 text-blue-600"></i>
                        Invoice Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order Number
                            </label>
                            <input
                                type="text"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter order number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Accounts Receivable
                            </label>
                            <input
                                type="text"
                                name="accountsReceivable"
                                value={formData.accountsReceivable}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter accounts receivable"
                            />
                        </div> */}

                        <div>
                            <Label>Customer</Label>
                            <SearchSelectNew
                                options={customerOptions}
                                placeholder="Select Customer"
                                searchPlaceholder="Search Customer..."
                                value={formData?.customerId || undefined}
                                onValueChange={(value) => handleCustomerChange(value)}
                                searchBy="name"
                                displayFormat="simple"
                                className="w-full"
                            />
                        </div>


                        <div className=''>
                            <div className='flex items-center gap-1'>
                                <input type="checkbox" className='cursor-pointer' checked={enableCustomerInput} id="enableName" onChange={() => setEnableCustomerInput((p) => (!p))} />
                                <Label htmlFor='enableName' className='cursor-pointer'>Click the check box to enter the name manually, if not available from the drop down</Label>
                            </div>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={(e) => {
                                    if (enableCustomerInput) handleInputChange(e); // only update if manual input is enabled
                                }}
                                disabled={isReadOnly || !enableCustomerInput} // only enable if checkbox is checked

                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sales Person
                            </label>
                            <input
                                type="text"
                                name="salesPerson"
                                value={formData.salesPerson}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter sales person name"
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
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                name="invoiceDate"
                                value={formData.invoiceDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        {/* <div>
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
                        </div> */}
                        {/* <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Terms
                            </label>
                            <input
                                type="text"
                                name="terms"
                                value={formData.terms}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Payment terms (e.g., Net 30)"
                            />
                        </div> */}


                        <div>
                            <Label>Project</Label>
                            <select
                                value={formData?.projectId || ''}
                                disabled={isReadOnly}
                                onChange={(e) => {
                                    const selected = projects?.find((p: any) => p._id === e.target.value);
                                    if (selected) {
                                        setFormData(prev => ({
                                            ...prev,
                                            projectId: selected._id,
                                            projectName: selected.projectName,
                                        }));
                                    } else {
                                        setFormData(prev => ({ ...prev, projectId: null, projectName: null }));
                                    }
                                }}
                                className=" disabled:bg-gray-100 disabled:cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Projects</option>
                                {projects?.map((project: any) => (
                                    <option key={project._id} value={project._id}>{project.projectName}</option>
                                ))}
                            </select>
                        </div>


                    </div>
                </div>

                {/* Items Section */}


                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <i className="fas fa-list mr-2 text-blue-600"></i>
                            Invoice Items <span className="text-red-500 ml-1">*</span>
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

                    {formData.items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <i className="fas fa-inbox text-4xl mb-2"></i>
                            <p>No items added yet</p>
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
                            <div className="grid grid-cols-14 gap-3 mb-2 px-4 py-3 bg-gray-100 rounded-lg font-semibold text-gray-700 text-sm">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-4 text-center">Item Name <span className="text-red-500">*</span></div>
                                <div className="col-span-2 text-center">Unit</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-center">Rate <span className="text-red-500">*</span></div>
                                <div className="col-span-2 text-center">Total</div>
                                {!isReadOnly && <div className="col-span-1 text-center">Action</div>}
                            </div>

                            {/* Table Rows */}
                            <div className="space-y-2">
                                {formData.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-14 gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors items-center"
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

                                        <div className="col-span-2">
                                            <select
                                                value={item.unit}
                                                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-gray-100"
                                            >
                                                {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                    <option key={unitOption} value={unitOption}>{unitOption}</option>
                                                ))}
                                            </select>
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
                        Invoice Summary
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
                {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-comment-alt mr-2 text-blue-600"></i>
                        Additional Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Notes
                            </label>
                            <textarea
                                name="customerNotes"
                                value={formData.customerNotes}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                placeholder="Add any notes for the customer..."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Terms and Conditions
                            </label>
                            <textarea
                                name="termsAndConditions"
                                value={formData.termsAndConditions}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                placeholder="Add terms and conditions..."
                            />
                        </div>
                    </div>

                    
                </div> */}


                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Notes</label>
                    <textarea
                        name="customerNotes"
                        value={formData?.customerNotes}
                        onChange={handleInputChange}
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                </div>



                {initialData?.pdfData && (
                    <>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    Invoice Pdf
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Generate a PDF document for the invoice
                                </p>
                            </div>
                        </div>

                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                                        <div>
                                            <h4 className="font-semibold text-green-900">{initialData.pdfData.originalName}</h4>
                                            <p className="text-sm text-green-700">Invoice PDF is ready</p>
                                        </div>
                                    </div>
                                    <div className='gap-2 flex items-center'>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.open(initialData.pdfData.url, "_blank")}
                                            className=""
                                        >
                                            View PDF
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => downloadImage({ src: initialData.pdfData.url, alt: initialData.pdfData.originalName })}
                                            className=""
                                        >
                                            download PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>

                )}
            </form>
        </div>
    );
};

export default RetailInvoiceAccountForm;