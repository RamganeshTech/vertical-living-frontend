import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { useGetVendorForDropDown } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';
import { Label } from '../../../../components/ui/Label';
import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
import type { CreateBillPayload, BillItem } from './CreateBillAcc';
import { ORDERMATERIAL_UNIT_OPTIONS } from '../../../Stage Pages/Ordering Materials/OrderMaterialOverview';
import { useDeleteBillImage, useSyncBillToPaymentsSection } from '../../../../apiList/Department Api/Accounting Api/billAccountApi';
import { toast } from '../../../../utils/toast';
import { Card, CardContent } from '../../../../components/ui/Card';
import { downloadImage } from '../../../../utils/downloadFile';
import { Textarea } from '../../../../components/ui/TextArea';
import InfoTooltip from '../../../../components/ui/InfoToolTip';
import { useGetProjects } from '../../../../apiList/projectApi';
import type { AvailableProjetType } from '../../Logistics Pages/LogisticsShipmentForm';

// Internal Form State (Images are strictly NEW FILES)
export interface BillFormData {
    vendorId: string | null;
    vendorName: string;
    billNumber: string;
    accountsPayable: string;
    subject: string;
    dueDate: string;
    projectId: string | null
    projectName: string | null
    billDate: string;
    items: BillItem[];
    discountPercentage: number;
    taxPercentage: number;
    paymentType: string
    advancedAmount: number,
    notes: string;
    images: File[]; // Only for new uploads
}

interface BillAccountFormProps {
    mode: 'create' | 'view' | 'edit';
    initialData?: any;
    organizationId: string;
    isSubmitting: boolean;
    // Parent handles how to send data. 
    // We pass: 1. The Text Payload, 2. The New Files
    onSubmit: (data: Omit<CreateBillPayload, 'images'>, newFiles: File[]) => Promise<void>;
    refetch?: any
    onQuickUpload?: (files: File[]) => Promise<void>;
}

const BillAccountForm: React.FC<BillAccountFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    onQuickUpload,
    isSubmitting,
    organizationId,
    refetch
}) => {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'edit'>(initialMode);
    const { data: VendorData } = useGetVendorForDropDown(organizationId);
    const deleteImgMutation = useDeleteBillImage()



    const PAYMENTTYPES = [
        "cash on carry",
        "credit based",
        "pay advanced, balance later",
        "post-inspection payment"
    ]

    const handleImageDelete = async (imageId: string) => {
        try {
            await deleteImgMutation.mutateAsync({
                billId: initialData._id!,
                imageId,
            })

            // console.log("upladsImages", uploadedImages)
            refetch?.()
            toast({ title: "Success", description: "deleted successfully" })

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "failed to delete", variant: "destructive" })
        }
    }

    // --- STATE ---
    const defaultFormData: BillFormData = {
        vendorId: null,
        vendorName: '',
        billNumber: '',
        accountsPayable: '',
        subject: '',
        projectId: null,
        projectName: null,
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ itemName: "", rate: 0, quantity: 1, unit: "nos", totalCost: 0 }],
        discountPercentage: 0,
        taxPercentage: 0,
        advancedAmount: 0,
        notes: '',
        paymentType: "cash on carry",
        images: [] // Strictly for NEW files
    };

    const [formData, setFormData] = useState<BillFormData>(defaultFormData);
    const [enableVendorInput, setEnableVendorInput] = useState<boolean>(false);
    const [calculatedTotals, setCalculatedTotals] = useState({
        totalAmount: 0, discountAmount: 0, taxAmount: 0, grandTotal: 0
    });

    const { data: projectData } = useGetProjects(organizationId!);
    const projects = projectData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));


    // --- LOAD DATA ---
    useEffect(() => {
        if (initialData) {
            console.log("initial Data", initialData)
            setFormData({
                vendorId: initialData?.vendorId || null,
                vendorName: initialData?.vendorName || '',
                billNumber: initialData?.billNumber || '',
                accountsPayable: initialData?.accountsPayable || '',
                subject: initialData?.subject || '',
                projectId: initialData?.projectId || null,
                projectName: null,
                billDate: initialData?.billDate ? new Date(initialData?.billDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                dueDate: initialData?.dueDate ? new Date(initialData?.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                items: initialData?.items?.length && initialData?.items || [{ itemName: "", rate: 0, unit: "nos", quantity: 1, totalCost: 0 }],
                discountPercentage: initialData?.discountPercentage || 0,
                taxPercentage: initialData?.taxPercentage || 0,
                paymentType: initialData?.paymentType || "",
                advancedAmount: initialData?.advancedAmount || 0,
                notes: initialData?.notes || '',
                images: [] // Always start empty. We do NOT load existing images here.
            });

            // if (initialMode === "view") setEnableVendorInput(true);
        }
    }, [initialData, initialMode]);



    useEffect(() => {
        if (currentMode === "view") {

            const selectedProject =
                projects?.find((p: any) => p._id === initialData?.projectId) || null;

            setFormData({
                vendorId: initialData?.vendorId || null,
                vendorName: initialData?.vendorName || '',
                billNumber: initialData?.billNumber || '',
                accountsPayable: initialData?.accountsPayable || '',
                subject: initialData?.subject || '',
                projectId: initialData?.projectId || null,
                projectName: selectedProject,
                billDate: initialData?.billDate ? new Date(initialData?.billDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                dueDate: initialData?.dueDate ? new Date(initialData?.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                items: initialData?.items?.length && initialData?.items || [{ itemName: "", rate: 0, unit: "nos", quantity: 1, totalCost: 0 }],
                discountPercentage: initialData?.discountPercentage || 0,
                taxPercentage: initialData?.taxPercentage || 0,
                notes: initialData?.notes || '',
                paymentType: initialData?.paymentType || "",
                advancedAmount: initialData?.advancedAmount || 0,
                images: [] // Always start empty. We do NOT load existing images here.
            });
        }
    }, [currentMode])

    // --- CALCULATIONS ---
    // useEffect(() => {
    //     const totalAmount = formData.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    //     const discountAmount = (totalAmount * formData.discountPercentage) / 100;
    //     const amountAfterDiscount = totalAmount - discountAmount;
    //     const taxAmount = (amountAfterDiscount * formData.taxPercentage) / 100;
    //     const grandTotal = amountAfterDiscount + taxAmount;

    //     setCalculatedTotals({ totalAmount, discountAmount, taxAmount, grandTotal });
    // }, [formData.items, formData.discountPercentage, formData.taxPercentage]);


    useEffect(() => {
        const totalAmount = formData.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
        const discountAmount = (totalAmount * formData.discountPercentage) / 100;
        const amountAfterDiscount = totalAmount - discountAmount;
        const taxAmount = (amountAfterDiscount * formData.taxPercentage) / 100;
        const grandTotalBeforeAdvance = amountAfterDiscount + taxAmount;

        // let grandTotal = grandTotalBeforeAdvance;
        let balancePayable = grandTotalBeforeAdvance;

        if (formData.paymentType === "pay advanced, balance later") {
            console.log("222222222222")
            const advance = formData?.advancedAmount || 0;
            balancePayable = Math.max(0, grandTotalBeforeAdvance - advance); // prevent negative
        }
        else {
            console.log("33333333333")
            // setFormData(p => ({ ...p, advancedAmount: 0 }))
            balancePayable = grandTotalBeforeAdvance; // prevent negative
        }

        setCalculatedTotals({
            totalAmount,
            discountAmount,
            taxAmount,
            grandTotal: balancePayable,
            // balancePayable
        });
    }, [
        formData.items,
        formData.discountPercentage,
        formData.taxPercentage,
        formData.paymentType,
        formData.advancedAmount
    ]);


    // --- HANDLERS ---
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {



        const { name, value } = e.target;

        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };

            // If payment type is changed and NOT "pay advanced, balance later"
            if (name === "paymentType" && value !== "pay advanced, balance later") {
                updatedData.advancedAmount = 0;
            }

            return updatedData;
        });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    // Item Logic
    const handleAddItem = () => setFormData(p => ({ ...p, items: [...p.items, { itemName: '', quantity: 1, unit: "nos", rate: 0, totalCost: 0 }] }));
    const handleRemoveItem = (index: number) => setFormData(p => ({ ...p, items: p.items.filter((_, i) => i !== index) }));
    const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            const item = { ...newItems[index] };
            if (field === 'itemName') {
                const isLast = index === prev.items.length - 1;
                if (isLast && item.itemName === '' && value !== '') newItems.push({ itemName: '', unit: "nos", quantity: 1, rate: 0, totalCost: 0 });
                item.itemName = value as string;
            }
            else if (field === "unit") {
                item.unit = value as string
            }
            else {
                item[field as 'quantity' | 'rate'] = typeof value === 'string' ? parseFloat(value) || 0 : value;
                item.totalCost = item.quantity * item.rate;
            }
            newItems[index] = item;
            return { ...prev, items: newItems };
        });
    };

    const handleVendorChange = (value: string | null) => {
        const v = VendorData?.find((x: any) => x._id === value);
        setFormData(p => ({ ...p, vendorId: value || "", vendorName: v?.vendorName || "" }));
    };

    // --- FILE HANDLERS (NEW FILES ONLY) ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(p => ({ ...p, images: [...p.images, ...Array.from(e.target.files || [])] }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    // --- QUICK UPLOAD (View Mode) ---
    const handleQuickUploadClick = async () => {
        if (formData.images.length > 0 && onQuickUpload) {
            await onQuickUpload(formData.images);
            setFormData(p => ({ ...p, images: [] })); // Clear after upload
        }
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedItems = formData.items.filter(item => item.itemName.trim() !== '');

        const payload = {
            ...formData,
            items: cleanedItems,
            organizationId,
            totalAmount: calculatedTotals.totalAmount,
            discountAmount: calculatedTotals.discountAmount,
            taxAmount: calculatedTotals.taxAmount,
            grandTotal: calculatedTotals.grandTotal,
            // We do NOT include images array here because that's for File objects only
        };

        // Pass payload (text) and newFiles (images) separately
        await onSubmit(payload, formData.images);
        if(currentMode === "edit"){
            setCurrentMode("view")
        }

    };

    // Mode Flags
    const isReadOnly = currentMode === 'view';
    const isCreateMode = currentMode === 'create';
    const isEditMode = currentMode === 'edit';
    const toggleEdit = () => setCurrentMode(p => p === 'view' ? 'edit' : 'view');

    const VendorOptions = (VendorData || [])?.map((v: any) => ({ value: v._id, label: v.vendorName }));


    // const { mutateAsync: syncAccountsMutation, isPending: syncAccountsLoading } = useSyncBillToAccounts()
    const { mutateAsync: syncPaymentsMutation, isPending: syncPaymentsLoading } = useSyncBillToPaymentsSection()

    // const handleSyncToAccounts = async () => {
    //     try {
    //         await syncAccountsMutation({
    //             billId: initialData._id!
    //         });
    //         toast({ title: "Success", description: "Bill sent to Accounts Department" });
    //     } catch (error: any) {
    //         toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
    //     }
    // }

    const handleSyncToPayments = async () => {
        try {
            if (initialData?.isSyncWithPaymentsSection) {
                return toast({ variant: "destructive", title: "Error", description: "already sent to payments section" });
            }
            await syncPaymentsMutation({
                billId: initialData._id!
            });
            refetch?.()
            toast({ title: "Success", description: "Bill sent to Payments Section" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }


    return (
        <div className="max-w-full mx-auto space-y-2">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-4 pt-2 mb-6 flex justify-between items-center">
                {/* <header className="flex  justify-between items-center"> */}
                <div className='flex justify-between items-center gap-2'>
                    <button type="button" onClick={() => navigate(-1)} className='bg-blue-100 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-receipt mr-3 text-blue-600"></i>
                            {isCreateMode ? 'Create Bill' : isEditMode ? 'Update Bill' : 'View Bill'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isCreateMode ? 'Fill in details' : isEditMode ? 'Update details' : 'Bill details'}
                        </p>
                    </div>
                </div>

                <div className='flex gap-2 items-center'>


                    {/* {isReadOnly && <div className="flex items-center space-y-1">
                        <Button
                            variant="primary"
                            isLoading={syncAccountsLoading}
                            onClick={handleSyncToAccounts}
                        >
                            Send To Accounts Dept
                        </Button>

                        <InfoTooltip
                            content="Click the button to send the bill to accounts department"
                            type="info"
                            position="bottom"
                        />
                    </div>} */}

                    {isReadOnly && <div className="flex items-center space-y-1">
                        <Button
                            variant="primary"
                            className={`${initialData?.isSyncWithPaymentsSection ? "!cursor-not-allowed" : ""}`}
                            title={initialData?.isSyncWithPaymentsSection ? "already sent to payment" : ""}
                            isLoading={syncPaymentsLoading}
                            disabled={initialData?.isSyncWithPaymentsSection}
                            onClick={handleSyncToPayments}
                        >
                            Send To Payments Section
                        </Button>

                        <InfoTooltip
                            content="Click the button to send the bill to Payments section"
                            type="info"
                            position="bottom"
                        />
                    </div>}


                    {isReadOnly && (
                        <Button type="button" onClick={toggleEdit} className={isReadOnly ? "bg-blue-600 text-white" : "bg-gray-500 hover:bg-gray-500 text-white"}>
                            <i className="fas fa-edit mr-2"></i>Edit
                        </Button>
                    )}


                    {/* Actions */}
                    {(isCreateMode || isEditMode) && (
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
                    )}




                </div>
                {/* </header> */}
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Details Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Vendor</Label>
                            <SearchSelectNew
                                options={VendorOptions}
                                value={formData.vendorId ? formData.vendorId : ""}
                                onValueChange={handleVendorChange}
                                className="w-full" placeholder="Select Vendor" />
                        </div>
                        <div>
                            <div className='flex items-center gap-1'>
                                <input type="checkbox" id='vendornameinp' checked={enableVendorInput} onChange={() => setEnableVendorInput(p => !p)} disabled={isReadOnly} />
                                <Label className='cursor-pointer' htmlFor='vendornameinp'>Manual Entry</Label>
                            </div>
                            <input
                                type="text"
                                name="vendorName"
                                value={formData.vendorName}
                                onChange={e => { if (enableVendorInput) handleInputChange(e) }}
                                disabled={isReadOnly || !enableVendorInput}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Vendor Name" />
                        </div>
                        <div><Label>Bill Date</Label><input type="date" name="billDate" value={formData.billDate} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><Label>Due Date</Label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} disabled={isReadOnly} className="w-full px-3 py-2 border rounded-lg" /></div>

                        <div>
                            <Label>Project</Label>
                            <select
                                value={formData?.projectId || ''}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Projects</option>
                                {projects?.map((project: any) => (
                                    <option key={project._id} value={project._id}>{project.projectName}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>Payment Type</Label>
                            <select
                                name='paymentType'
                                value={formData?.paymentType || ''}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:cursor-not-allowed"
                            >
                                <option value="">Select Payment Type</option>
                                {PAYMENTTYPES?.map((type: any) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>Advanced Amount</Label>
                            <input
                                type="number"
                                name="advancedAmount"
                                value={formData.advancedAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) return
                                    handleInputChange(e)
                                }
                                }
                                disabled={isReadOnly || formData.paymentType !== "pay advanced, balance later"}
                                className="w-full px-3 py-2 border rounded-lg disabled:cursor-not-allowed"
                                placeholder="Advanced Amount"
                            />
                        </div>

                        <div>
                            <Label>Remarks</Label>
                            <Textarea name="subject" value={formData.subject}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center"><i className="fas fa-list mr-2 text-blue-600"></i> Items <span className="text-red-500 ml-1">*</span></h2>
                        {!isReadOnly && <Button type="button" onClick={handleAddItem} variant='primary'><i className="fas fa-plus mr-2"></i> Add Item</Button>}
                    </div>
                    <div className="overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-14 gap-3 mb-2 px-4 py-3 bg-gray-100 rounded-lg font-semibold text-sm">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4 text-center">Item Name</div>
                            <div className="col-span-2 text-center">Unit</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-center">Rate</div>
                            <div className="col-span-2 text-center">Total</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>
                        {/* Rows */}
                        <div className="space-y-2">
                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-14 gap-3 px-4 py-3 bg-white rounded-lg items-center">
                                    <div className="col-span-1">{index + 1}</div>
                                    <div className="col-span-4 ">
                                        <input value={item.itemName}
                                            onChange={e => handleItemChange(index, 'itemName', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
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

                                    <div className="col-span-2 ">
                                        <input type="number" value={item.quantity}
                                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="col-span-2 ">
                                        <input type="number"
                                            value={item.rate}
                                            onChange={e => handleItemChange(index, 'rate', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                                        /></div>
                                    <div className="col-span-2 text-center">₹{item.totalCost.toFixed(2)}</div>
                                    <div className="col-span-1 text-center">{!isReadOnly && <i className="fas fa-trash text-red-500 cursor-pointer" onClick={() => handleRemoveItem(index)}></i>}</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-blue-50 rounded-lg mt-4 font-semibold">
                            <div className="col-span-9 text-right">Subtotal:</div>
                            <div className="col-span-2 text-right text-blue-600">₹{calculatedTotals.totalAmount.toFixed(2)}</div>
                        </div>
                    </div>
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


                        {formData.paymentType === "pay advanced, balance later" && (
                            <>
                                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                                    <span className="text-gray-700 font-medium">Advance Paid:</span>
                                    <span className="text-xl font-semibold text-green-600">
                                        -₹{(formData.advancedAmount || 0)}
                                    </span>
                                </div>
                            </>
                        )}


                        <div className="flex justify-between items-center py-3 bg-blue-100 px-4 rounded-lg">
                            <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ₹{calculatedTotals.grandTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- DISPLAY EXISTING DOCUMENTS (From InitialData ONLY) --- */}
                {isReadOnly && initialData && initialData.images && initialData.images.length > 0 && (
                    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                            <i className="fas fa-folder-open mr-2 text-blue-500"></i> Existing Documents
                        </h3>

                        {/* Image Gallery */}
                        <div className="mb-6">
                            <ImageGalleryExample
                                handleDeleteFile={(imgId: string) => handleImageDelete(imgId)}
                                imageFiles={initialData.images} height={150} minWidth={150} maxWidth={200} />
                        </div>


                    </section>
                )}

                {/* --- NEW UPLOADS SECTION --- */}
                {isReadOnly && <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex justify-between items-center">
                        <span><i className="fas fa-cloud-upload-alt mr-2 text-blue-500"></i> {isCreateMode ? 'Upload Hot Copy of Bill' : 'Add Hot Copy of Bill'}</span>
                        {isReadOnly && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">View Mode Upload</span>}
                    </h3>

                    {/* Upload Area */}
                    <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 bg-gray-50 flex flex-col items-center justify-center">
                        <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-600">Click to upload files</p>
                    </div>

                    {/* Preview New Files */}
                    {formData.images.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {formData.images.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white border rounded shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'}`}></i>
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                    </div>
                                    <button type="button" onClick={() => removeFile(index)} className="text-red-500 px-2"><i className="fas fa-times"></i></button>
                                </div>
                            ))}

                            {/* Quick Upload Button (View Mode Only) */}
                            {isReadOnly && (
                                <div className="flex justify-end mt-2">
                                    <Button type="button" onClick={handleQuickUploadClick} disabled={isSubmitting} className="">
                                        {isSubmitting ? 'Uploading...' : 'Upload Files Now'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </section>}

                {isReadOnly && initialData?.pdfData ? (
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

                )
                    :
                    <>
                        <div className="shadow-md flex flex-col items-center justify-center min-h-[150px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-file-invoice text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">If No Pdf Found, just click on edit button and update the bill</h3>
                        </div>
                    </>
                }



            </form>
        </div >
    );
};

export default BillAccountForm;