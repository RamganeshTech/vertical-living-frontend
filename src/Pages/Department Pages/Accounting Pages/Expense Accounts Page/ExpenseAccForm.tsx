import React, { useEffect, useState } from "react";
import { useCreateExpense, useGetExpenseById, useUpdateExpense } from "../../../../apiList/Department Api/Accounting Api/expenseApi";
import { toast } from "../../../../utils/toast";
import { useGetVendorForDropDown } from "../../../../apiList/Department Api/Accounting Api/vendorAccApi";
import { Label } from "../../../../components/ui/Label";
import SearchSelectNew from "../../../../components/ui/SearchSelectNew";
import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { useNavigate } from "react-router-dom";

export type ExpenseFormMode = "create" | "edit" | "view";

export interface ExpenseFormData {
    vendorId: string;
    vendorName: string;
    amount: number;
    dateOfPayment: Date;
    paidThrough: string;
    notes?: string;
}


interface ExpenseFormProps {
    mode: ExpenseFormMode;
    organizationId: string;
    expenseId?: string;
    onSuccess?: () => void;
    onEdit?: () => void;
    isEditing?: boolean;
    onCancel?: () => void;
}

const ExpenseAccForm: React.FC<ExpenseFormProps> = ({
    mode,
    organizationId,
    expenseId,
    onSuccess,
    onCancel,
    onEdit,
    isEditing
}) => {
    // Hooks
    const createExpense = useCreateExpense();

    const updateExpense = useUpdateExpense();

    // const navigate = useNavigate()
    const [enableVendorInput, setEnableVendorInput] = useState<boolean>(false)


    const { data: existingExpense, isLoading: isLoadingExpense } = useGetExpenseById(
        expenseId || "",
        mode !== "create" && !!expenseId
    );

    const { data: vendorData } = useGetVendorForDropDown(organizationId)


    const vendorOption = (vendorData || [])?.map((vendor: { _id: string; email: string; vendorName: string }) => ({
        value: vendor._id,
        label: vendor.vendorName,
        email: vendor.email
    }))


    // Form state
    const [formData, setFormData] = useState<ExpenseFormData>({
        vendorId: "",
        vendorName: "",
        amount: 0,
        dateOfPayment: new Date(),
        paidThrough: "",
        notes: ""
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

    // Populate form for edit/view mode
    useEffect(() => {
        if (existingExpense && (mode === "edit" || mode === "view")) {
            setFormData({
                vendorId: existingExpense.vendorId,
                vendorName: existingExpense.vendorName,
                amount: existingExpense.amount,
                dateOfPayment: new Date(existingExpense.dateOfPayment),
                paidThrough: existingExpense.paidThrough,
                notes: existingExpense.notes || ""
            });
        }
    }, [existingExpense, mode]);

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

        // if (!formData.vendorId.trim()) {
        //     newErrors.vendorId = "Vendor is required";
        // }
        if (!formData.vendorName.trim()) {
            newErrors.vendorName = "Vendor name is required";
        }
        if (formData.amount <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }
        // if (!formData.paidThrough.trim()) {
        //     newErrors.paidThrough = "Payment method is required";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "amount" ? parseFloat(value) || 0 : value
        }));
        // Clear error for this field
        if (errors[name as keyof ExpenseFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            dateOfPayment: new Date(e.target.value)
        }));
    };


    const handleVendorChange = (value: string | null) => {
        const selectedVendor = vendorData?.find((vendor: any) => vendor._id === value)
        setFormData((prev) => ({
            ...prev,
            vendorId: value || "",
            vendorName: selectedVendor?.vendorName || ""
        }))
    }


    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "view") return;

        if (!validateForm()) {
            toast({ title: "Error", description: "Please fix the errors in the form" , variant:"destructive"});
            return;
        }

        try {
            if (mode === "create") {
                await createExpense.mutateAsync({
                    organizationId,
                    ...formData
                });

                toast({ title: "Success", description: "Expense created successfully!" });
                onSuccess?.();
            } else if (mode === "edit" && expenseId) {
                await updateExpense.mutateAsync({
                    id: expenseId,
                    ...formData,
                    vendorId: (formData.vendorId as any)._id,
                });

                toast({ title: "Success", description: "Expense updated successfully!" });
                onSuccess?.();
            }
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to submit expense" , variant:"destructive"});
        }
    };

    // Loading state
    if (mode !== "create" && isLoadingExpense) {
        return (
            <MaterialOverviewLoading />
        );
    }

    const isViewMode = mode === "view";
    const isSubmitting = createExpense.isPending || updateExpense.isPending;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <header className="border-b pb-4 flex justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex gap-2">
                        <div onClick={onCancel}
                            className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                            <i className='fas fa-arrow-left'></i>
                        </div>
                        {mode === "create" && "Create New Expense"}
                        {mode === "edit" && "Edit Expense"}
                        {mode === "view" && "Expense Details"}
                    </h2>
                    {mode === "view" && existingExpense && (
                        <p className="text-sm text-gray-500 mt-1">
                            Invoice: {existingExpense?.invoiceNumber}
                        </p>
                    )}
                </div>

                <button
                type="button"
                    onClick={onEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                                            transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isEditing ? "Cancel" : "Edit"} Expense
                </button>
            </header>

            {/* Vendor ID */}
            <div>
                <Label>Vendor</Label>
                <SearchSelectNew
                    options={vendorOption}
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
                            ? formData.vendorName // user can edit manually
                            : "" // show from formData but not editable
                    }
                    onChange={(e) => {
                        if (enableVendorInput) handleChange(e); // only update if manual input is enabled
                    }}
                    disabled={!enableVendorInput} // only enable if checkbox is checked

                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter customer name"
                />
            </div>

            {/* Vendor Name */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.vendorName ? "border-red-500" : "border-gray-300"}
                        ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter vendor name"
                />
                {errors.vendorName && (
                    <p className="mt-1 text-sm text-red-500">{errors.vendorName}</p>
                )}
            </div> */}

            {/* Amount */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-2.5 text-gray-500">₹</span>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={isViewMode}
                        step="1"
                        min="0"
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                            ${errors.amount ? "border-red-500" : "border-gray-300"}
                            ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="0.00"
                    />
                </div>
                {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                )}
            </div>

            {/* Date of Payment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Payment
                </label>
                <input
                    type="date"
                    value={formData.dateOfPayment.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    disabled={isViewMode}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${isViewMode ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
                />
            </div>

            {/* Paid Through */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paid Through
                    {/* <span className="text-red-500">*</span> */}
                </label>
                <select
                    name="paidThrough"
                    value={formData.paidThrough}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${errors.paidThrough ? "border-red-500" : "border-gray-300"}
                        ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Check">Check</option>
                    <option value="UPI">UPI</option>
                    <option value="Other">Other</option>
                </select>
                {errors.paidThrough && (
                    <p className="mt-1 text-sm text-red-500">{errors.paidThrough}</p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isViewMode}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                        ${isViewMode ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
                    placeholder="Add any additional notes..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
                {!isViewMode && (
                <div className="w-full flex justify-between space-x-3 ">

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1  bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {mode === "create" ? "Creating..." : "Updating..."}
                            </span>
                        ) : (
                            mode === "create" ? "Create Expense" : "Update Expense"
                        )}
                    </button>

                    
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex-1  bg-gray-200 text-gray-700 py-2 px-4 rounded-lg 
                        hover:bg-gray-300 transition-colors"
                >
                    {isViewMode ? "Close" : "Cancel"}
                </button>

                </div>

                )}

            </div>
        </form>
    );
};

export default ExpenseAccForm;