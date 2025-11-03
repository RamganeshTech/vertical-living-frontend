


// src/components/Department/Accounting/CustomerAccounts/CustomerAccountForm.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreateCustomerPayload, Customer, UpdateCustomerPayload } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';

interface CustomerAccountFormProps {
    mode: 'create' | 'update';
    initialData?: Customer | null;
    onSubmit: (data: any, files?: File[]) => Promise<void>;
    isSubmitting: boolean;
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>

}

const CustomerAccountForm: React.FC<CustomerAccountFormProps> = ({
    mode,
    initialData,
    onSubmit,
    isSubmitting,
    setIsEditing
}) => {
    const { organizationId } = useParams()
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'main' | 'other' | 'documents'>('main');

    // Form state - All fields in one state
    const [formData, setFormData] = useState({
        customerType: (initialData?.customerType || 'business') as 'business' | 'individual',
        organizationId: initialData?.organizationId || organizationId,
        projectId: initialData?.projectId || null,
        clientId: initialData?.clientId || null,
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        companyName: initialData?.companyName || '',
        email: initialData?.email || '',
        phone: {
            work: initialData?.phone?.work || '',
            mobile: initialData?.phone?.mobile || ''
        },
        customerLanguage: initialData?.customerLanguage || 'English',
        pan: initialData?.pan || '',
        currency: initialData?.currency || 'INR - Indian Rupee',
        accountsReceivable: initialData?.accountsReceivable || '',
        openingBalance: initialData?.openingBalance || 0,
        paymentTerms: initialData?.paymentTerms || 'Due on Receipt',
        enablePortal: initialData?.enablePortal || false
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Only firstName is mandatory
        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Email validation (if provided)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // // Phone validation (if provided)
        // if (formData.phone.mobile && !/^[0-9]{10,15}$/.test(formData.phone.mobile.replace(/[\s-()]/g, ''))) {
        //     newErrors['phone.mobile'] = 'Invalid mobile number';
        // }

        // if (formData.phone.work && !/^[0-9]{10,15}$/.test(formData.phone.work.replace(/[\s-()]/g, ''))) {
        //     newErrors['phone.work'] = 'Invalid work number';
        // }

        if (formData.phone.mobile) {
            const mobileValue = String(formData.phone.mobile).replace(/[\s-()]/g, '');
            if (!/^[0-9]{10}$/.test(mobileValue)) {
                newErrors['phone.mobile'] = 'Mobile number must be exactly 10 digits';
            }
        }

        if (formData.phone.work) {
            const workValue = String(formData.phone.work).replace(/[\s-()]/g, '');
            if (!/^[0-9]{10}$/.test(workValue)) {
                newErrors['phone.work'] = 'Work number must be exactly 10 digits';
            }
        }

        // PAN validation (if provided)
        if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
        }

        // Opening balance validation
        if (formData.openingBalance && isNaN(Number(formData.openingBalance))) {
            newErrors.openingBalance = 'Opening balance must be a valid number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setActiveTab('main'); // Switch to main tab to show errors
            return;
        }

        try {
            if (mode === 'create') {
                await onSubmit(formData as CreateCustomerPayload, selectedFiles);
            } else {
                await onSubmit(formData as UpdateCustomerPayload);
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Tabs configuration
    const tabs = [
        { id: 'main', label: 'Main Information', icon: 'fa-user' },
        { id: 'other', label: 'Other Details', icon: 'fa-info-circle' },
        ...(mode === 'create' ? [{ id: 'documents', label: 'Documents', icon: 'fa-file-upload' }] : [])
    ];

    return (
        <div className="max-w-full mx-auto overflow-y-auto max-h-full">
            {/* Header */}
            <div className="mb-2 flex items-center gap-3">
                <button
                    // onClick={() => ( mode === "create" ? navigate(-1) : setIsEditing?.(false)) }
                    type="button"
                    onClick={() => {
                        if (mode === "create") {
                            navigate(-1);
                        } else {
                            // console.log("workn cal33333333333333333")
                            setIsEditing?.(false);
                        }
                    }}

                    className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>


                    <i className="fas fa-arrow-left"></i>

                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className={`fas ${mode === 'create' ? 'fa-plus-circle' : 'fa-edit'} mr-3 text-blue-600`}></i>
                        {mode === 'create' ? 'Create New Customer' : 'Update Customer'}
                    </h1>
                    <p className="text-gray-600 mt-1 ml-3">
                        {mode === 'create' ? 'Add a new customer to your organization' : 'Update customer information'}
                    </p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-2">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                                    ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <i className={`fas ${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Form Content */}
            <Card>
                <div className="p-2">
                    {/* Main Information Tab */}
                    {activeTab === 'main' && (
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <i className="fas fa-user mr-2 text-blue-600"></i>
                                Main Information
                            </h2>

                            {/* Customer Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Type
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="customerType"
                                            value="business"
                                            checked={formData.customerType === 'business'}
                                            onChange={(e) => setFormData({ ...formData, customerType: e.target.value as 'business' })}
                                            className="mr-2"
                                        />
                                        <i className="fas fa-building mr-2 text-blue-600"></i>
                                        Business
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="customerType"
                                            value="individual"
                                            checked={formData.customerType === 'individual'}
                                            onChange={(e) => setFormData({ ...formData, customerType: e.target.value as 'individual' })}
                                            className="mr-2"
                                        />
                                        <i className="fas fa-user mr-2 text-green-600"></i>
                                        Individual
                                    </label>
                                </div>
                            </div>

                            {/* Name Fields - Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter first name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter last name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-envelope mr-2 text-gray-400"></i>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="customer@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Numbers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-mobile-alt mr-2 text-gray-400"></i>
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone.mobile}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            phone: { ...formData.phone, mobile: e.target.value }
                                        })}
                                        maxLength={10}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="1234567890"
                                    />
                                    {errors['phone.mobile'] && (
                                        <p className="text-red-500 text-sm mt-1">{errors['phone.mobile']}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-phone mr-2 text-gray-400"></i>
                                        Work Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone.work}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            phone: { ...formData.phone, work: e.target.value }
                                        })}
                                        maxLength={10}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="9876543210"
                                    />
                                    {errors['phone.work'] && (
                                        <p className="text-red-500 text-sm mt-1">{errors['phone.work']}</p>
                                    )}
                                </div>
                            </div>

                            {/* Customer Language */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-language mr-2 text-gray-400"></i>
                                    Customer Language
                                </label>
                                <select
                                    value={formData.customerLanguage}
                                    onChange={(e) => setFormData({ ...formData, customerLanguage: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Telugu">Telugu</option>
                                    <option value="Malayalam">Malayalam</option>
                                    <option value="Kannada">Kannada</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Other Details Tab */}
                    {activeTab === 'other' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                                Other Details
                            </h2>

                            {/* PAN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-id-card mr-2 text-gray-400"></i>
                                    PAN Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.pan}
                                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="ABCDE1234F"
                                    maxLength={10}
                                />
                                {errors.pan && (
                                    <p className="text-red-500 text-sm mt-1">{errors.pan}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Format: 5 letters, 4 digits, 1 letter</p>
                            </div>

                            {/* Currency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-dollar-sign mr-2 text-gray-400"></i>
                                    Currency
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                                    <option value="USD - US Dollar">USD - US Dollar</option>
                                    <option value="EUR - Euro">EUR - Euro</option>
                                    <option value="GBP - British Pound">GBP - British Pound</option>
                                    <option value="AED - UAE Dirham">AED - UAE Dirham</option>
                                </select>
                            </div>

                            {/* Accounts Receivable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-receipt mr-2 text-gray-400"></i>
                                    Accounts Receivable
                                </label>
                                <input
                                    type="text"
                                    value={formData.accountsReceivable}
                                    onChange={(e) => setFormData({ ...formData, accountsReceivable: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Account details"
                                />
                            </div>

                            {/* Opening Balance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-wallet mr-2 text-gray-400"></i>
                                    Opening Balance
                                </label>
                                <input
                                    type="number"
                                    value={formData.openingBalance}
                                    onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                                {errors.openingBalance && (
                                    <p className="text-red-500 text-sm mt-1">{errors.openingBalance}</p>
                                )}
                            </div>

                            {/* Payment Terms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-calendar-check mr-2 text-gray-400"></i>
                                    Payment Terms
                                </label>
                                <select
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Due on Receipt">Due on Receipt</option>
                                    <option value="Net 15">Net 15</option>
                                    <option value="Net 30">Net 30</option>
                                    <option value="Net 45">Net 45</option>
                                    <option value="Net 60">Net 60</option>
                                </select>
                            </div>

                            {/* Enable Portal */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="enablePortal"
                                    checked={formData.enablePortal}
                                    onChange={(e) => setFormData({ ...formData, enablePortal: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="enablePortal" className="ml-2 text-sm font-medium text-gray-700">
                                    Enable Customer Portal Access
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Documents Tab (Only for Create Mode) */}
                    {activeTab === 'documents' && mode === 'create' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <i className="fas fa-file-upload mr-2 text-blue-600"></i>
                                Documents
                            </h2>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Documents (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></i>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Click to upload
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, PNG, JPG, JPEG (MAX. 10MB per file)
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {/* Selected Files List */}
                            {selectedFiles.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Selected Files ({selectedFiles.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'} text-xl`}></i>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedFiles.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <i className="fas fa-folder-open text-4xl mb-3 block"></i>
                                    <p>No documents selected</p>
                                    <p className="text-xs mt-1">You can add documents later if needed</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons - Always visible at bottom */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => (mode === "create" ? navigate(-1) : setIsEditing?.(false))}

                            disabled={isSubmitting}
                        >
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                        </Button>

                        <div className="flex gap-3">
                            {/* Tab Navigation Buttons */}
                            {activeTab !== 'main' && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const currentIndex = tabs.findIndex(t => t.id === activeTab);
                                        if (currentIndex > 0) {
                                            setActiveTab(tabs[currentIndex - 1].id as any);
                                        }
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Previous
                                </Button>
                            )}

                            {activeTab !== tabs[tabs.length - 1].id && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const currentIndex = tabs.findIndex(t => t.id === activeTab);
                                        if (currentIndex < tabs.length - 1) {
                                            setActiveTab(tabs[currentIndex + 1].id as any);
                                        }
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Next
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </Button>
                            )}

                            {/* Submit Button - Always visible */}
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check mr-2"></i>
                                        {mode === 'create' ? 'Create Customer' : 'Update Customer'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CustomerAccountForm;