// // src/components/Department/Accounting/CustomerAccounts/CustomerAccSingle.tsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//     useGetCustomer,
//     useUpdateCustomer,
//     useUpdateCustomerDocument,
//     type UpdateCustomerPayload
// } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
// import { Button } from '../../../../components/ui/Button';
// import { Card } from '../../../../components/ui/Card';
// import { toast } from '../../../../utils/toast';


// const CustomerAccSingle = () => {
//     const { id } = useParams<{ id: string }>() as { id: string };
//     const navigate = useNavigate();

//     const [isEditing, setIsEditing] = useState(false);
//     const [currentStep, setCurrentStep] = useState(0);

//     // Fetch customer data
//     const { data: customer, isLoading, isError, error } = useGetCustomer(id || '');
//     const updateCustomerMutation = useUpdateCustomer();
//     const updateDocumentMutation = useUpdateCustomerDocument();

//     // Form state
//     const [formData, setFormData] = useState<UpdateCustomerPayload>({});
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [errors, setErrors] = useState<Record<string, string>>({});

//     // Update form data when customer data is loaded
//     useEffect(() => {
//         if (customer) {
//             setFormData({
//                 customerType: customer.customerType,
//                 firstName: customer.firstName || '',
//                 lastName: customer.lastName || '',
//                 companyName: customer.companyName || '',
//                 email: customer.email || '',
//                 phone: {
//                     work: customer.phone?.work || '',
//                     mobile: customer.phone?.mobile || ''
//                 },
//                 customerLanguage: customer.customerLanguage || 'English',
//                 pan: customer.pan || '',
//                 currency: customer.currency || 'INR - Indian Rupee',
//                 accountsReceivable: customer.accountsReceivable || '',
//                 openingBalance: customer.openingBalance || 0,
//                 paymentTerms: customer.paymentTerms || 'Due on Receipt',
//                 enablePortal: customer.enablePortal || false
//             });
//         }
//     }, [customer]);

//     // Validation
//     const validateStep = (step: number): boolean => {
//         const newErrors: Record<string, string> = {};

//         if (step === 0) {
//             // if (formData.customerType === 'business') {
//             //     if (!formData.companyName?.trim()) {
//             //         newErrors.companyName = 'Company name is required for business customers';
//             //     }
//             // } else {
//             //     if (!formData.firstName?.trim()) {
//             //         newErrors.firstName = 'First name is required for individual customers';
//             //     }
//             //     if (!formData.lastName?.trim()) {
//             //         newErrors.lastName = 'Last name is required for individual customers';
//             //     }
//             // }


//             if (!formData.firstName?.trim()) {
//                 newErrors.firstName = 'First name is required for individual customers';
//             }


//             if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//                 newErrors.email = 'Invalid email format';
//             }

//             if (formData.phone?.mobile && !/^[0-9]{10,15}$/.test(formData.phone.mobile.replace(/[\s-()]/g, ''))) {
//                 newErrors['phone.mobile'] = 'Invalid mobile number';
//             }

//             if (formData.phone?.work && !/^[0-9]{10,15}$/.test(formData.phone.work.replace(/[\s-()]/g, ''))) {
//                 newErrors['phone.work'] = 'Invalid work number';
//             }
//         }

//         if (step === 1) {
//             if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
//                 newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
//             }

//             if (formData.openingBalance && isNaN(Number(formData.openingBalance))) {
//                 newErrors.openingBalance = 'Opening balance must be a valid number';
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleNext = () => {
//         if (validateStep(currentStep)) {
//             setCurrentStep(prev => prev + 1);
//         }
//     };

//     const handlePrevious = () => {
//         setCurrentStep(prev => prev - 1);
//     };

//     const handleUpdateCustomer = async () => {
//         if (!validateStep(currentStep)) return;

//         try {
//             await updateCustomerMutation.mutateAsync({
//                 customerId: id!,
//                 payload: formData
//             });

//             alert('Customer updated successfully!');
//             setIsEditing(false);
//             setCurrentStep(0);
//             toast({ title: "Success", description: "successfully updated" })
//         } catch (error: any) {
//             toast({
//                 title: "Error", description: error?.response?.data?.message || error?.message ||
//                     "Failed to update", variant: "destructive"
//             })
//         }
//     };

//     const handleUpdateDocuments = async () => {
//         if (selectedFiles.length === 0) {
//             alert('Please select at least one file to upload');
//             return;
//         }

//         try {
//             const formDataToSend = new FormData();
//             selectedFiles.forEach((file) => {
//                 formDataToSend.append('files', file);
//             });

//             await updateDocumentMutation.mutateAsync({
//                 id: id!,
//                 formData: formDataToSend
//             });

//             toast({ title: "Success", description: "successfully updated" })
//             setSelectedFiles([]);
//         } catch (error: any) {
//             toast({
//                 title: "Error", description: error?.response?.data?.message || error?.message ||
//                     "Failed to update", variant: "destructive"
//             })
//         }
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setSelectedFiles(Array.from(e.target.files));
//         }
//     };

//     const removeFile = (index: number) => {
//         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleCancelEdit = () => {
//         setIsEditing(false);
//         setCurrentStep(0);
//         // Reset form data to customer data
//         if (customer) {
//             setFormData({
//                 customerType: customer.customerType,
//                 firstName: customer.firstName || '',
//                 lastName: customer.lastName || '',
//                 companyName: customer.companyName || '',
//                 email: customer.email || '',
//                 phone: {
//                     work: customer.phone?.work || '',
//                     mobile: customer.phone?.mobile || ''
//                 },
//                 customerLanguage: customer.customerLanguage || 'English',
//                 pan: customer.pan || '',
//                 currency: customer.currency || 'INR - Indian Rupee',
//                 accountsReceivable: customer.accountsReceivable || '',
//                 openingBalance: customer.openingBalance || 0,
//                 paymentTerms: customer.paymentTerms || 'Due on Receipt',
//                 enablePortal: customer.enablePortal || false
//             });
//         }
//         setErrors({});
//     };

//     // Steps configuration
//     const steps = [
//         { title: 'Basic Information', icon: 'fa-user' },
//         { title: 'Other Details', icon: 'fa-info-circle' },
//         { title: 'Documents', icon: 'fa-file-upload' }
//     ];

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                 <div className="text-red-600 font-semibold mb-2 text-xl">
//                     ⚠️ Error Occurred
//                 </div>
//                 <p className="text-red-500 mb-4">
//                     {(error as any)?.message || "Failed to load customer"}
//                 </p>
//                 <Button onClick={() => navigate(-1)}>
//                     Go Back
//                 </Button>
//             </div>
//         );
//     }

//     if (!customer) {
//         return (
//             <div className="max-w-xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow text-center">
//                 <div className="text-yellow-600 font-semibold mb-2 text-xl">
//                     Customer Not Found
//                 </div>
//                 <Button onClick={() => navigate(-1)}>
//                     Go Back
//                 </Button>
//             </div>
//         );
//     }

//     const displayName = customer.customerType === 'business'
//         ? customer.companyName
//         : `${customer.firstName} ${customer.lastName}`;

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             {/* Header */}
//             <div className="mb-6">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//                 >
//                     <i className="fas fa-arrow-left mr-2"></i>
//                     Back to Customers
//                 </button>

//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                             <i className={`fas ${customer.customerType === 'business' ? 'fa-building' : 'fa-user'} mr-3 text-blue-600`}></i>
//                             {displayName}
//                         </h1>
//                         <div className="flex items-center gap-3 mt-2">
//                             <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${customer.customerType === 'business'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-green-100 text-green-800'
//                                 }`}>
//                                 {customer.customerType === 'business' ? 'Business' : 'Individual'}
//                             </span>
//                             <span className="text-sm text-gray-500">
//                                 <i className="fas fa-calendar-alt mr-1"></i>
//                                 Created: {new Date(customer.createdAt).toLocaleDateString()}
//                             </span>
//                         </div>
//                     </div>

//                     {!isEditing && (
//                         <Button onClick={() => setIsEditing(true)}>
//                             <i className="fas fa-edit mr-2"></i>
//                             Edit Customer
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             {/* Progress Steps (Only in Edit Mode) */}
//             {isEditing && (
//                 <div className="mb-8">
//                     <div className="flex items-center justify-between">
//                         {steps.map((step, index) => (
//                             <div key={index} className="flex-1 flex items-center">
//                                 <div className="flex flex-col items-center flex-1">
//                                     <div
//                                         className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index <= currentStep
//                                             ? 'bg-blue-600 border-blue-600 text-white'
//                                             : 'bg-white border-gray-300 text-gray-400'
//                                             }`}
//                                     >
//                                         <i className={`fas ${step.icon}`}></i>
//                                     </div>
//                                     <span
//                                         className={`text-xs mt-2 ${index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
//                                             }`}
//                                     >
//                                         {step.title}
//                                     </span>
//                                 </div>
//                                 {index < steps.length - 1 && (
//                                     <div
//                                         className={`flex-1 h-1 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
//                                             }`}
//                                     />
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Content */}
//             <Card>
//                 <div className="p-6">
//                     {/* Step 0: Basic Information */}
//                     {currentStep === 0 && (
//                         <div className="space-y-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                                 <i className="fas fa-user mr-2 text-blue-600"></i>
//                                 Basic Information
//                             </h2>

//                             {/* Customer Type - View/Edit */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Customer Type
//                                 </label>
//                                 {isEditing ? (
//                                     <div className="flex gap-4">
//                                         <label className="flex items-center cursor-pointer">
//                                             <input
//                                                 type="radio"
//                                                 name="customerType"
//                                                 value="business"
//                                                 checked={formData.customerType === 'business'}
//                                                 onChange={(e) => setFormData({ ...formData, customerType: e.target.value as 'business' })}
//                                                 className="mr-2"
//                                             />
//                                             <i className="fas fa-building mr-2 text-blue-600"></i>
//                                             Business
//                                         </label>
//                                         <label className="flex items-center cursor-pointer">
//                                             <input
//                                                 type="radio"
//                                                 name="customerType"
//                                                 value="individual"
//                                                 checked={formData.customerType === 'individual'}
//                                                 onChange={(e) => setFormData({ ...formData, customerType: e.target.value as 'individual' })}
//                                                 className="mr-2"
//                                             />
//                                             <i className="fas fa-user mr-2 text-green-600"></i>
//                                             Individual
//                                         </label>
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-900 flex items-center">
//                                         <i className={`fas ${customer.customerType === 'business' ? 'fa-building' : 'fa-user'} mr-2`}></i>
//                                         {customer.customerType === 'business' ? 'Business' : 'Individual'}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Conditional Fields based on Customer Type */}
//                             {formData.customerType === 'business' ? (
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Company Name <span className="text-red-500">*</span>
//                                     </label>
//                                     {isEditing ? (
//                                         <>
//                                             <input
//                                                 type="text"
//                                                 value={formData.companyName || ""}
//                                                 onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="Enter company name"
//                                             />
//                                             {errors.companyName && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <p className="text-gray-900">{customer.companyName || '-'}</p>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             First Name <span className="text-red-500">*</span>
//                                         </label>
//                                         {isEditing ? (
//                                             <>
//                                                 <input
//                                                     type="text"
//                                                     value={formData.firstName || ""}
//                                                     onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     placeholder="Enter first name"
//                                                 />
//                                                 {errors.firstName && (
//                                                     <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <p className="text-gray-900">{customer.firstName || '-'}</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Last Name <span className="text-red-500">*</span>
//                                         </label>
//                                         {isEditing ? (
//                                             <>
//                                                 <input
//                                                     type="text"
//                                                     value={formData.lastName || ""}
//                                                     onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     placeholder="Enter last name"
//                                                 />
//                                                 {errors.lastName && (
//                                                     <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <p className="text-gray-900">{customer.lastName || '-'}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Email */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-envelope mr-2 text-gray-400"></i>
//                                     Email
//                                 </label>
//                                 {isEditing ? (
//                                     <>
//                                         <input
//                                             type="email"
//                                             value={formData.email || ""}
//                                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="customer@example.com"
//                                         />
//                                         {errors.email && (
//                                             <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-900">{customer.email || '-'}</p>
//                                 )}
//                             </div>

//                             {/* Phone Numbers */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-mobile-alt mr-2 text-gray-400"></i>
//                                         Mobile Number
//                                     </label>
//                                     {isEditing ? (
//                                         <>
//                                             <input
//                                                 type="tel"
//                                                 value={formData.phone?.mobile || ""}
//                                                 onChange={(e) => setFormData({
//                                                     ...formData,
//                                                     phone: { ...formData.phone, mobile: e.target.value }
//                                                 })}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="1234567890"
//                                             />
//                                             {errors['phone.mobile'] && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors['phone.mobile']}</p>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <p className="text-gray-900">{customer.phone?.mobile || '-'}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-phone mr-2 text-gray-400"></i>
//                                         Work Number
//                                     </label>
//                                     {isEditing ? (
//                                         <>
//                                             <input
//                                                 type="tel"
//                                                 value={formData.phone?.work || ""}
//                                                 onChange={(e) => setFormData({
//                                                     ...formData,
//                                                     phone: { ...formData.phone, work: e.target.value }
//                                                 })}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="9876543210"
//                                             />
//                                             {errors['phone.work'] && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors['phone.work']}</p>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <p className="text-gray-900">{customer.phone?.work || '-'}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Customer Language */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-language mr-2 text-gray-400"></i>
//                                     Customer Language
//                                 </label>
//                                 {isEditing ? (
//                                     <select
//                                         value={formData.customerLanguage || ""}
//                                         onChange={(e) => setFormData({ ...formData, customerLanguage: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                         <option value="English">English</option>
//                                         <option value="Hindi">Hindi</option>
//                                         <option value="Tamil">Tamil</option>
//                                         <option value="Telugu">Telugu</option>
//                                         <option value="Malayalam">Malayalam</option>
//                                         <option value="Kannada">Kannada</option>
//                                     </select>
//                                 ) : (
//                                     <p className="text-gray-900">{customer.customerLanguage || '-'}</p>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* Step 1: Other Details */}
//                     {currentStep === 1 && (
//                         <div className="space-y-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                                 <i className="fas fa-info-circle mr-2 text-blue-600"></i>
//                                 Other Details
//                             </h2>

//                             {/* PAN */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-id-card mr-2 text-gray-400"></i>
//                                     PAN Number
//                                 </label>
//                                 {isEditing ? (
//                                     <>
//                                         <input
//                                             type="text"
//                                             value={formData.pan || ""}
//                                             onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="ABCDE1234F"
//                                             maxLength={10}
//                                         />
//                                         {errors.pan && (
//                                             <p className="text-red-500 text-sm mt-1">{errors.pan}</p>
//                                         )}
//                                         <p className="text-xs text-gray-500 mt-1">Format: 5 letters, 4 digits, 1 letter</p>
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-900">{customer.pan || '-'}</p>
//                                 )}
//                             </div>

//                             {/* Currency */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-dollar-sign mr-2 text-gray-400"></i>
//                                     Currency
//                                 </label>
//                                 {isEditing ? (
//                                     <select
//                                         value={formData.currency}
//                                         onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                         <option value="INR - Indian Rupee">INR - Indian Rupee</option>
//                                         <option value="USD - US Dollar">USD - US Dollar</option>
//                                         <option value="EUR - Euro">EUR - Euro</option>
//                                         <option value="GBP - British Pound">GBP - British Pound</option>
//                                         <option value="AED - UAE Dirham">AED - UAE Dirham</option>
//                                     </select>
//                                 ) : (
//                                     <p className="text-gray-900">{customer.currency || '-'}</p>
//                                 )}
//                             </div>

//                             {/* Accounts Receivable */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-receipt mr-2 text-gray-400"></i>
//                                     Accounts Receivable
//                                 </label>
//                                 {isEditing ? (
//                                     <input
//                                         type="text"
//                                         value={formData.accountsReceivable || ""}
//                                         onChange={(e) => setFormData({ ...formData, accountsReceivable: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="Account details"
//                                     />
//                                 ) : (
//                                     <p className="text-gray-900">{customer.accountsReceivable || '-'}</p>
//                                 )}
//                             </div>

//                             {/* Opening Balance */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-wallet mr-2 text-gray-400"></i>
//                                     Opening Balance
//                                 </label>
//                                 {isEditing ? (
//                                     <>
//                                         <input
//                                             type="number"
//                                             value={formData.openingBalance}
//                                             onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="0.00"
//                                             step="0.01"
//                                         />
//                                         {errors.openingBalance && (
//                                             <p className="text-red-500 text-sm mt-1">{errors.openingBalance}</p>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <p className="text-gray-900">
//                                         {customer.currency?.split('-')[0].trim() || 'INR'} {customer.openingBalance || 0}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Payment Terms */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-calendar-check mr-2 text-gray-400"></i>
//                                     Payment Terms
//                                 </label>
//                                 {isEditing ? (
//                                     <select
//                                         value={formData.paymentTerms}
//                                         onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                         <option value="Due on Receipt">Due on Receipt</option>
//                                         <option value="Net 15">Net 15</option>
//                                         <option value="Net 30">Net 30</option>
//                                         <option value="Net 45">Net 45</option>
//                                         <option value="Net 60">Net 60</option>
//                                     </select>
//                                 ) : (
//                                     <p className="text-gray-900">{customer.paymentTerms || '-'}</p>
//                                 )}
//                             </div>

//                             {/* Enable Portal */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-portal-enter mr-2 text-gray-400"></i>
//                                     Customer Portal Access
//                                 </label>
//                                 {isEditing ? (
//                                     <div className="flex items-center">
//                                         <input
//                                             type="checkbox"
//                                             id="enablePortal"
//                                             checked={formData.enablePortal}
//                                             onChange={(e) => setFormData({ ...formData, enablePortal: e.target.checked })}
//                                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                         />
//                                         <label htmlFor="enablePortal" className="ml-2 text-sm text-gray-700">
//                                             Enable Customer Portal Access
//                                         </label>
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-900">
//                                         {customer.enablePortal ? (
//                                             <span className="text-green-600">
//                                                 <i className="fas fa-check-circle mr-1"></i>
//                                                 Enabled
//                                             </span>
//                                         ) : (
//                                             <span className="text-red-600">
//                                                 <i className="fas fa-times-circle mr-1"></i>
//                                                 Disabled
//                                             </span>
//                                         )}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* Step 2: Documents */}
//                     {currentStep === 2 && (
//                         <div className="space-y-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                                 <i className="fas fa-file-upload mr-2 text-blue-600"></i>
//                                 Documents
//                             </h2>

//                             {/* Existing Documents */}
//                             {customer.documents && customer.documents.length > 0 && (
//                                 <div className="mb-6">
//                                     <h3 className="text-sm font-medium text-gray-700 mb-3">
//                                         Existing Documents ({customer.documents.length})
//                                     </h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {customer.documents.map((doc: any, index: number) => (
//                                             <div
//                                                 key={index}
//                                                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
//                                             >
//                                                 <div className="flex items-center space-x-3">
//                                                     <i className={`fas ${doc.type === 'pdf' ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'} text-2xl`}></i>
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-900">
//                                                             {doc.originalName || 'Document'}
//                                                         </p>
//                                                         <p className="text-xs text-gray-500">
//                                                             {doc.type.toUpperCase()} • {new Date(doc.uploadedAt || '').toLocaleDateString()}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <a
//                                                     href={doc.url}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="text-blue-600 hover:text-blue-800"
//                                                 >
//                                                     <i className="fas fa-external-link-alt"></i>
//                                                 </a>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Upload New Documents */}
//                             {isEditing && (
//                                 <div>
//                                     <h3 className="text-sm font-medium text-gray-700 mb-3">
//                                         Upload New Documents
//                                     </h3>
//                                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
//                                         <input
//                                             type="file"
//                                             multiple
//                                             accept="image/*,.pdf"
//                                             onChange={handleFileChange}
//                                             className="hidden"
//                                             id="file-upload-update"
//                                         />
//                                         <label htmlFor="file-upload-update" className="cursor-pointer">
//                                             <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
//                                             <p className="text-sm text-gray-600 mb-1">
//                                                 Click to upload or drag and drop
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 PDF, PNG, JPG, JPEG (MAX. 10MB per file)
//                                             </p>
//                                         </label>
//                                     </div>

//                                     {/* Selected Files List */}
//                                     {selectedFiles.length > 0 && (
//                                         <div className="mt-4">
//                                             <h4 className="text-sm font-medium text-gray-700 mb-2">
//                                                 New Files to Upload ({selectedFiles.length})
//                                             </h4>
//                                             <div className="space-y-2">
//                                                 {selectedFiles.map((file, index) => (
//                                                     <div
//                                                         key={index}
//                                                         className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
//                                                     >
//                                                         <div className="flex items-center space-x-3">
//                                                             <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'} text-xl`}></i>
//                                                             <div>
//                                                                 <p className="text-sm font-medium text-gray-900">{file.name}</p>
//                                                                 <p className="text-xs text-gray-500">
//                                                                     {(file.size / 1024 / 1024).toFixed(2)} MB
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => removeFile(index)}
//                                                             className="text-red-500 hover:text-red-700"
//                                                         >
//                                                             <i className="fas fa-times"></i>
//                                                         </button>
//                                                     </div>
//                                                 ))}
//                                             </div>

//                                             {/* Upload Documents Button */}
//                                             <Button
//                                                 onClick={handleUpdateDocuments}
//                                                 disabled={updateDocumentMutation.isPending}
//                                                 className="mt-4 w-full"
//                                             >
//                                                 {updateDocumentMutation.isPending ? (
//                                                     <>
//                                                         <i className="fas fa-spinner fa-spin mr-2"></i>
//                                                         Uploading Documents...
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <i className="fas fa-upload mr-2"></i>
//                                                         Upload Documents
//                                                     </>
//                                                 )}
//                                             </Button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {/* No Documents Message */}
//                             {(!customer.documents || customer.documents.length === 0) && !isEditing && (
//                                 <div className="text-center py-8 text-gray-500">
//                                     <i className="fas fa-folder-open text-4xl mb-3"></i>
//                                     <p>No documents uploaded yet</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//                         {isEditing ? (
//                             <>
//                                 {/* Edit Mode Buttons */}
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={currentStep === 0 ? handleCancelEdit : handlePrevious}
//                                     disabled={updateCustomerMutation.isPending}
//                                 >
//                                     <i className="fas fa-arrow-left mr-2"></i>
//                                     {currentStep === 0 ? 'Cancel' : 'Previous'}
//                                 </Button>

//                                 {currentStep < 2 ? (
//                                     <Button
//                                         type="button"
//                                         onClick={handleNext}
//                                         disabled={updateCustomerMutation.isPending}
//                                     >
//                                         Next
//                                         <i className="fas fa-arrow-right ml-2"></i>
//                                     </Button>
//                                 ) : (
//                                     <Button
//                                         type="button"
//                                         onClick={handleUpdateCustomer}
//                                         disabled={updateCustomerMutation.isPending}
//                                     >
//                                         {updateCustomerMutation.isPending ? (
//                                             <>
//                                                 <i className="fas fa-spinner fa-spin mr-2"></i>
//                                                 Updating...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <i className="fas fa-save mr-2"></i>
//                                                 Save Changes
//                                             </>
//                                         )}
//                                     </Button>
//                                 )}
//                             </>
//                         ) : (
//                             <>
//                                 {/* View Mode Buttons */}
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={currentStep === 0 ? () => navigate(-1) : handlePrevious}
//                                 >
//                                     <i className="fas fa-arrow-left mr-2"></i>
//                                     {currentStep === 0 ? 'Back to List' : 'Previous'}
//                                 </Button>

//                                 {currentStep < 2 && (
//                                     <Button
//                                         type="button"
//                                         onClick={handleNext}
//                                     >
//                                         Next
//                                         <i className="fas fa-arrow-right ml-2"></i>
//                                     </Button>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default CustomerAccSingle;



// src/components/Department/Accounting/CustomerAccounts/CustomerAccSingle.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { Card } from '../../../UI/Card';
// import { Button } from '../../../UI/Button';
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
                                            Click to upload or drag and drop
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