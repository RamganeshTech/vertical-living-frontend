import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import type { CreateInvoicePayload } from './CreateInvoiceAcc';
import { useGetCustomerForDropDown } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';
import { Label } from '../../../../components/ui/Label';
import { formatCurrency } from './../../../../utils/formatCurrency';
import { Card, CardContent } from '../../../../components/ui/Card';
// import { downloadImage } from '../../../../utils/downloadFile';
import { ORDERMATERIAL_UNIT_OPTIONS } from '../../../Stage Pages/Ordering Materials/OrderMaterialOverview';
import { downloadImage } from '../../../../utils/downloadFile';
import { useGetProjects } from '../../../../apiList/projectApi';
import type { AvailableProjetType } from '../../Logistics Pages/LogisticsShipmentForm';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
// import { useSyncInvoiceToAccounts } from '../../../../apiList/Department Api/Accounting Api/invoiceApi';
// import { toast } from '../../../../utils/toast';
// import InfoTooltip from '../../../../components/ui/InfoToolTip';

interface InvoiceItem {
    itemName: string;
    quantity: number;
    unit: string;
    rate: number;
    totalCost: number;
    _id?: string; // Added _id for updates
}

export interface IInvoicePdf {
    type: "image" | "pdf";
    url: string;
    originalName?: string;
    uploadedAt?: Date;
}

interface InvoiceFormData {
    customerId: string;
    customerName: string;
    orderNumber: string;
    accountsReceivable: string;
    salesPerson: string;
    projectId: string | null
    projectName: string | null
    subject: string;
    invoiceDate: string;
    terms: string;
    dueDate: string;
    items: InvoiceItem[];
    discountPercentage: number;
    taxPercentage: number;
    customerNotes: string;
    termsAndConditions: string;
    pdfData?: IInvoicePdf
}

interface InvoiceAccountFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    onSubmit: (data: CreateInvoicePayload) => Promise<void>;
    isSubmitting: boolean;
    organizationId: string;
}

const InvoiceAccountForm: React.FC<InvoiceAccountFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
    organizationId
}) => {
    const navigate = useNavigate();
    // Changed _setCurrentMode to setCurrentMode to allow switching
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'edit'>(initialMode);

    const { data: customerData } = useGetCustomerForDropDown(organizationId);

    const defaultFormData: InvoiceFormData = {
        customerId: '',
        customerName: '',
        projectId: null,
        projectName: null,
        orderNumber: '',
        accountsReceivable: '',
        salesPerson: '',
        subject: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        terms: '',
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
        customerNotes: '',
        termsAndConditions: ''
    };

    const [enableCustomerInput, setEnableCustomerInput] = useState<boolean>(false);
    const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData);

    const [calculatedTotals, setCalculatedTotals] = useState({
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        grandTotal: 0
    });


    // const { mutateAsync: syncAccountsMutation, isPending: syncAccountsLoading } = useSyncInvoiceToAccounts()


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





    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.invoice?.list;
    // const canCreate = role === "owner" || permission?.invoice?.create
    const canEdit = role === "owner" || permission?.invoice?.edit
    // const canDelete = role === "owner" || permission?.invoice?.delete




    // Helper function to parse incoming data
    const parseInitialData = (data: any): InvoiceFormData => {
        return {
            customerId: data.customerId?._id || data?.customerId || null,
            customerName: data.customerName || '',
            orderNumber: data.orderNumber || '',
            projectId: data.projectId || null,
            projectName: data.projectName || null,
            accountsReceivable: data.accountsReceivable || '',
            salesPerson: data.salesPerson || '',
            subject: data.subject || '',
            invoiceDate: data.invoiceDate ? new Date(data.invoiceDate).toISOString().split('T')[0] : '',
            terms: data.terms || '',
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '',
            items: data.items && data.items.length > 0 ? data.items : [{ itemName: '', quantity: 1, unit: "nos", rate: 0, totalCost: 0 }],
            discountPercentage: data.discountPercentage || 0,
            taxPercentage: data.taxPercentage || 0,
            customerNotes: data.customerNotes || '',
            termsAndConditions: data.termsAndConditions || '',
            pdfData: data.pdfData
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
    }, [initialData, initialMode]);

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
    }));


    const { data: projectData } = useGetProjects(organizationId!);
    const projects = projectData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));



    // --- Action Handlers ---

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
            items: [...prev.items, { itemName: '', quantity: 1, unit: "nos", rate: 0, totalCost: 0 }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            const item = { ...newItems[index] };

            if (field === 'itemName') {
                const previousValue = item.itemName;
                item.itemName = value as string;

                const isLastRow = index === prev.items.length - 1;
                const wasEmpty = previousValue.trim() === '';
                const isNowFilled = (value as string).trim() !== '';

                if (isLastRow && wasEmpty && isNowFilled) {
                    newItems.push({ itemName: '', quantity: 1, rate: 0, unit: "nos", totalCost: 0 });
                }
            } else if (field === 'quantity' || field === 'rate') {
                const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
                item[field] = numValue < 0 ? 0 : numValue;
                item.totalCost = item.quantity * item.rate;
            } else if (field === 'unit') {
                item.unit = value as string;
            }

            newItems[index] = item;
            return { ...prev, items: newItems };
        });
    };

    const validateForm = (formData: InvoiceFormData): string[] => {
        const errors: string[] = [];
        if (!formData.customerName.trim()) errors.push('Customer name is required');

        formData.items.forEach((item, index) => {
            if (item.itemName.trim() && item.rate <= 0) {
                errors.push(`Item ${index + 1}: Rate must be greater than 0`);
            }
        });
        return errors;
    };

    const handleCustomerChange = (value: string | null) => {
        const selectedCustomer = customerData?.find((customer: any) => customer._id === value);
        setFormData((prev) => ({
            ...prev,
            customerId: value || "",
            customerName: selectedCustomer?.customerName || ""
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanedItems = formData.items.filter(item => item.itemName.trim() !== '');

        if (cleanedItems.length === 0) {
            alert("Please add at least one item");
            return;
        }

        const dataToValidate = { ...formData, items: cleanedItems };
        const errors = validateForm(dataToValidate);

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const payload: CreateInvoicePayload = {
            ...dataToValidate,
            organizationId: '',
            totalAmount: calculatedTotals.totalAmount,
            discountAmount: calculatedTotals.discountAmount,
            taxAmount: calculatedTotals.taxAmount,
            grandTotal: calculatedTotals.grandTotal
        };

        try {
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
            console.error("Form submission failed");
        }
    };

    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';

    return (
        <div className="max-w-full mx-auto space-y-2">
            {/* Header */}
            {/* <header className="flex justify-between items-center"> */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-4 pt-2 mb-6 flex justify-between items-center">

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
                            {isCreateMode ? 'Create Invoice' : isEditMode ? 'Update Invoice' : 'View Invoice'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isCreateMode ? 'Fill in the details to create a new invoice' :
                                isEditMode ? 'Update the invoice details' :
                                    'Invoice details'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">

                    {/* <div className="flex items-center space-y-1">
                        <Button
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
                        />
                    </div>
 */}



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


                    {/* {(isCreateMode || isEditMode) && (
                        <div className="flex justify-end items-center gap-4">

                            <Button type="button" onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2" disabled={isSubmitting}>
                                {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <>{isCreateMode ? 'Create Bill' : 'Update Bill'}</>}
                            </Button>

                            <Button variant='outline' type="button" onClick={() => {
                                if (isCreateMode) {
                                    navigate(-1)
                                }
                                else {
                                    toggleEdit()
                                }
                            }} className="bg-gray-500 hover:bg-gray-500 text-white px-6 py-2">
                                Cancel</Button>


                        </div>
                    )} */}

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
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2"
                                isLoading={isSubmitting}
                                onClick={handleSubmit}
                            >
                                <><i className={`fas ${isCreateMode ? 'fa-plus' : 'fa-save'} mr-2`}></i> {isCreateMode ? 'Create Invoice' : 'Update Invoice'}</>
                            </Button>
                        </div>
                    )}

                </div>
            </header>

            <form className="space-y-6">
                {/* Invoice Details */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-file-alt mr-2 text-blue-600"></i>
                        Invoice Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1" >
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
                            // disabled={isReadOnly} // Disable in View Mode
                            />
                        </div>

                        <div className="col-span-1">
                            <div className='flex items-center gap-1'>
                                <input
                                    type="checkbox"
                                    className='cursor-pointer'
                                    checked={enableCustomerInput}
                                    id="enableName"
                                    onChange={() => setEnableCustomerInput((p) => (!p))}
                                // disabled={isReadOnly}
                                />
                                <Label htmlFor='enableName' className='cursor-pointer'>
                                    Click to enter name manually
                                </Label>
                            </div>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={(e) => {
                                    if (enableCustomerInput) handleInputChange(e);
                                }}
                                disabled={isReadOnly || !enableCustomerInput}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sales Person</label>
                            <input
                                type="text"
                                name="salesPerson"
                                value={formData.salesPerson}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                            <input
                                type="date"
                                name="invoiceDate"
                                value={formData.invoiceDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

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
                            <Button type="button" onClick={handleAddItem} variant='primary'>
                                <i className="fas fa-plus mr-2"></i>
                                Add Item
                            </Button>
                        )}
                    </div>

                    {formData.items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <i className="fas fa-inbox text-4xl mb-2"></i>
                            <p>No items added yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-14 gap-3 mb-2 px-4 py-3 bg-gray-100 rounded-lg font-semibold text-gray-700 text-sm">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-4 text-center">Item Name <span className="text-red-500">*</span></div>
                                <div className="col-span-2 text-center">Unit</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-center">Rate <span className="text-red-500">*</span></div>
                                <div className="col-span-2 text-center">Total</div>
                                {!isReadOnly && <div className="col-span-1 text-center">Action</div>}
                            </div>

                            <div className="space-y-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-14 gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors items-center">
                                        <div className="col-span-1 text-center text-gray-600 font-medium">{index + 1}</div>

                                        <div className="col-span-4">
                                            <input
                                                type="text"
                                                value={item.itemName}
                                                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
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

                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                disabled={isReadOnly}
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                disabled={isReadOnly}
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                                            />
                                        </div>

                                        <div className="col-span-2 text-center font-semibold text-gray-900">
                                            {formatCurrency(item.totalCost)}
                                        </div>

                                        <div className="col-span-1 text-center">
                                            {!isReadOnly && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    disabled={formData.items.length === 1}
                                                    className="text-red-600 cursor-pointer hover:text-red-800 disabled:text-gray-400 p-2"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Discount, Tax, Totals, etc. (Same structure, just ensuring disabled={isReadOnly} is everywhere) */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-calculator mr-2 text-blue-600"></i>
                        Discount & Tax
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                            <input
                                type="number"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleNumberChange}
                                disabled={isReadOnly}
                                min="0" max="100" step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage (%)</label>
                            <input
                                type="number"
                                name="taxPercentage"
                                value={formData.taxPercentage}
                                onChange={handleNumberChange}
                                disabled={isReadOnly}
                                min="0" max="100" step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Subtotal:</span>
                            <span className="text-xl font-semibold text-gray-900">{formatCurrency(calculatedTotals.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Discount:</span>
                            <span className="text-xl font-semibold text-green-600">-{formatCurrency(calculatedTotals.discountAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Tax:</span>
                            <span className="text-xl font-semibold text-gray-900">{formatCurrency(calculatedTotals.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 bg-blue-100 px-4 rounded-lg">
                            <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                            <span className="text-2xl font-bold text-blue-600">{formatCurrency(calculatedTotals.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Notes */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Notes</label>
                    <textarea
                        name="customerNotes"
                        value={formData.customerNotes}
                        onChange={handleInputChange}
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                </div>

                {/* PDF Section (View Only) */}
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

                {/* Action Buttons */}

            </form>
        </div>
    );
};

export default InvoiceAccountForm;