// src/components/Department/Accounting/CustomerAccounts/CustomerAccSingle.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    useGetCustomer,
    useUpdateCustomer,
    useUpdateCustomerDocument,
    type UpdateCustomerPayload
} from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import CustomerAccountForm from './CustomerAccountForm';
import { toast } from '../../../../utils/toast';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { dateFormate } from '../../../../utils/dateFormator';
import MaterialOverviewLoading from '../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

const CustomerAccSingle = () => {
    const { id } = useParams<{ id: string }>() as { id: string };
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'main' | 'other' | 'documents'>('main');

    // Fetch customer data
    const { data: customer, isLoading, isError, error, refetch } = useGetCustomer(id);
    const updateCustomerMutation = useUpdateCustomer();
    const updateDocumentMutation = useUpdateCustomerDocument();

    // File upload state for documents tab
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleUpdateCustomer = async (data: UpdateCustomerPayload) => {
        try {
            await updateCustomerMutation.mutateAsync({
                customerId: id,
                payload: data
            });

            toast({ title: "Success", description: "Customer updated successfully" });
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || 'Failed to update customer' });
            throw error;
        }
    };

    const handleUpdateDocuments = async () => {
        if (selectedFiles.length === 0) {
            toast({ title: "Warning", description: "Please select at least one file to upload" });
            return;
        }

        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });

            await updateDocumentMutation.mutateAsync({
                id,
                formData
            });

            toast({ title: "Success", description: "Documents uploaded successfully" });
            setSelectedFiles([]);
            refetch();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || 'Failed to upload documents' });
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


    // Loading State
    if (isLoading) {
        return (
            <MaterialOverviewLoading />
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 font-semibold mb-2 text-xl">
                    ⚠️ Error Occurred
                </div>
                <p className="text-red-500 mb-4">
                    {(error as any)?.message || "Failed to load customer"}
                </p>
                <Button onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );
    }

    // Not Found State
    if (!customer) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow text-center">
                <div className="text-yellow-600 font-semibold mb-2 text-xl">
                    Customer Not Found
                </div>
                <Button onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );
    }

    // Tabs configuration
    const tabs = [
        { id: 'main', label: 'Main Information', icon: 'fa-user' },
        { id: 'other', label: 'Other Details', icon: 'fa-info-circle' },
        { id: 'documents', label: 'Documents', icon: 'fa-file-upload' }
    ];

    // If in editing mode, use the CustomerAccountForm component
    if (isEditing) {
        return (
            <CustomerAccountForm
                mode="update"
                initialData={customer}
                setIsEditing={setIsEditing}
                onSubmit={handleUpdateCustomer}
                isSubmitting={updateCustomerMutation.isPending}
            />
        );
    }

    // View Mode
    return (
        <div className="max-w-full mx-auto max-h-full overflow-y-auto">
            {/* Header */}
            <div className="mb-2 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                    <i className="fas fa-arrow-left"></i>
                </button>

                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className={`fas ${customer.customerType === 'business' ? 'fa-building' : 'fa-user'} mr-3 text-blue-600`}></i>
                            {/* {displayName} */}
                            {customer.firstName}
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                customer.customerType === 'business'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {customer.customerType === 'business' ? 'Business' : 'Individual'}
                            </span>
                            <span className="text-sm text-gray-500">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                {/* Created: {dateFormate(new Date(customer.createdAt).toLocaleDateString())} */}
                                Created: {dateFormate(customer.createdAt)}
                            </span>
                        </div>
                    </div>

                    <Button onClick={() => setIsEditing(true)}>
                        <i className="fas fa-edit mr-2"></i>
                        Edit Customer
                    </Button>
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
                                    py-4 px-1 cursor-pointer border-b-2 font-medium text-sm flex items-center gap-2
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

            {/* Content */}
            <Card>
                <div className="p-6">
                    {/* Main Information Tab */}
                    {activeTab === 'main' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <i className="fas fa-user mr-2 text-blue-600"></i>
                                Main Information
                            </h2>

                            {/* Customer Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Type
                                </label>
                                <p className="text-gray-900 flex items-center">
                                    <i className={`fas ${customer.customerType === 'business' ? 'fa-building' : 'fa-user'} mr-2 text-blue-600`}></i>
                                    {customer.customerType === 'business' ? 'Business' : 'Individual'}
                                </p>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <p className="text-gray-900">{customer.firstName || '-'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <p className="text-gray-900">{customer.lastName || '-'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <p className="text-gray-900">{customer.companyName || '-'}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-envelope mr-2 text-gray-400"></i>
                                    Email
                                </label>
                                <p className="text-gray-900">{customer.email || '-'}</p>
                            </div>

                            {/* Phone Numbers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-mobile-alt mr-2 text-gray-400"></i>
                                        Mobile Number
                                    </label>
                                    <p className="text-gray-900">{customer.phone?.mobile || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-phone mr-2 text-gray-400"></i>
                                        Work Number
                                    </label>
                                    <p className="text-gray-900">{customer.phone?.work || '-'}</p>
                                </div>
                            </div>

                            {/* Customer Language */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-language mr-2 text-gray-400"></i>
                                    Customer Language
                                </label>
                                <p className="text-gray-900">{customer.customerLanguage || '-'}</p>
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
                                <p className="text-gray-900">{customer.pan || '-'}</p>
                            </div>

                            {/* Currency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-dollar-sign mr-2 text-gray-400"></i>
                                    Currency
                                </label>
                                <p className="text-gray-900">{customer.currency || '-'}</p>
                            </div>

                            {/* Accounts Receivable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-receipt mr-2 text-gray-400"></i>
                                    Accounts Receivable
                                </label>
                                <p className="text-gray-900">{customer.accountsReceivable || '-'}</p>
                            </div>

                            {/* Opening Balance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-wallet mr-2 text-gray-400"></i>
                                    Opening Balance
                                </label>
                                <p className="text-gray-900">
                                    {customer.currency?.split('-')[0].trim() || 'INR'} {customer.openingBalance || 0}
                                </p>
                            </div>

                            {/* Payment Terms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-calendar-check mr-2 text-gray-400"></i>
                                    Payment Terms
                                </label>
                                <p className="text-gray-900">{customer.paymentTerms || '-'}</p>
                            </div>

                            {/* Enable Portal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-portal-enter mr-2 text-gray-400"></i>
                                    Customer Portal Access
                                </label>
                                <p className="text-gray-900">
                                    {customer.enablePortal ? (
                                        <span className="text-green-600">
                                            <i className="fas fa-check-circle mr-1"></i>
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="text-red-600">
                                            <i className="fas fa-times-circle mr-1"></i>
                                            Disabled
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                                      {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-file-upload mr-2 text-blue-600"></i>
                                    Documents
                                </h2>
                            </div>

                            {/* Existing Documents */}
                            {customer.documents && customer.documents.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Uploaded Documents ({customer.documents.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {customer.documents.map((doc:any, index:number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <i className={`fas ${doc.type === 'pdf' ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'} text-2xl`}></i>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {doc.originalName || 'Document'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {doc.type.toUpperCase()} • {dateFormate(doc?.uploadedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <i className="fas fa-external-link-alt"></i>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload New Documents Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Upload New Documents
                                </h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload-view"
                                    />
                                    <label htmlFor="file-upload-view" className="cursor-pointer">
                                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></i>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Click to upload
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, PNG, JPG, JPEG (MAX. 10MB per file)
                                        </p>
                                    </label>
                                </div>

                                {/* Selected Files List */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            New Files to Upload ({selectedFiles.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
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

                                        {/* Upload Documents Button */}
                                        <Button
                                            onClick={handleUpdateDocuments}
                                            disabled={updateDocumentMutation.isPending}
                                            className="mt-4 w-full"
                                        >
                                            {updateDocumentMutation.isPending ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                                    Uploading Documents...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-upload mr-2"></i>
                                                    Upload Documents
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* No Documents Message */}
                            {(!customer.documents || customer.documents.length === 0) && selectedFiles.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <i className="fas fa-folder-open text-4xl mb-3 block"></i>
                                    <p>No documents uploaded yet</p>
                                    <p className="text-xs mt-1">Upload documents using the form above</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CustomerAccSingle;