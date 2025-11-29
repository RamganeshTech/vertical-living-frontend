


// // src/components/Department/Accounting/VendorAccounts/VendorAccountForm.tsx

// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Card } from '../../../../components/ui/Card';
// import { Button } from '../../../../components/ui/Button';
// import type { CreateVendorPayload, UpdateVendorPayload, Vendor } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';

// interface VendorFormProps {
//     mode: 'create' | 'update';
//     initialData?: Vendor | null;
//     onSubmit: (data: any, files?: File[]) => Promise<void>;
//     isSubmitting: boolean;
//     setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>

// }

// const VendorAccountForm: React.FC<VendorFormProps> = ({
//     mode,
//     initialData,
//     onSubmit,
//     isSubmitting,
//     setIsEditing
// }) => {
//     const { organizationId } = useParams()
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState<'main' | 'other' | 'documents'>('main');

//     // Form state - All fields in one state
//     const [formData, setFormData] = useState({
//         // VendorType: (initialData?.VendorType || 'business') as 'business' | 'individual',
//         organizationId: initialData?.organizationId || organizationId,
//         projectId: initialData?.projectId || null,
//         clientId: initialData?.clientId || null,
//         firstName: initialData?.firstName || '',
//         lastName: initialData?.lastName || '',
//         companyName: initialData?.companyName || '',
//         email: initialData?.email || '',
//         phone: {
//             work: initialData?.phone?.work || '',
//             mobile: initialData?.phone?.mobile || ''
//         },
//         vendorLanguage: initialData?.vendorLanguage || 'English',
//         pan: initialData?.pan || '',
//         currency: initialData?.currency || 'INR - Indian Rupee',
//         accountsPayable: initialData?.accountsPayable || '',
//         openingBalance: initialData?.openingBalance || 0,
//         paymentTerms: initialData?.paymentTerms || 'Due on Receipt',
//         location: {
//             address: initialData?.location?.address || '',
//             mapUrl: initialData?.location?.mapUrl || "",
//             latitude: initialData?.location?.latitude ?? 0,
//             longitude: initialData?.location?.longitude ?? 0
//         }
//         // enablePortal: initialData?.enablePortal || false
//     });

//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [errors, setErrors] = useState<Record<string, string>>({});


//     // Validation
//     const validateForm = (): boolean => {
//         const newErrors: Record<string, string> = {};

//         // Only firstName is mandatory
//         if (!formData.firstName?.trim()) {
//             newErrors.firstName = 'First name is required';
//         }

//         // Email validation (if provided)
//         if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = 'Invalid email format';
//         }

//         // // Phone validation (if provided)
//         // if (formData.phone.mobile && !/^[0-9]{10,15}$/.test(formData.phone.mobile.replace(/[\s-()]/g, ''))) {
//         //     newErrors['phone.mobile'] = 'Invalid mobile number';
//         // }

//         // if (formData.phone.work && !/^[0-9]{10,15}$/.test(formData.phone.work.replace(/[\s-()]/g, ''))) {
//         //     newErrors['phone.work'] = 'Invalid work number';
//         // }

//         if (formData.phone.mobile) {
//             const mobileValue = String(formData.phone.mobile).replace(/[\s-()]/g, '');
//             if (!/^[0-9]{10}$/.test(mobileValue)) {
//                 newErrors['phone.mobile'] = 'Mobile number must be exactly 10 digits';
//             }
//         }

//         if (formData.phone.work) {
//             const workValue = String(formData.phone.work).replace(/[\s-()]/g, '');
//             if (!/^[0-9]{10}$/.test(workValue)) {
//                 newErrors['phone.work'] = 'Work number must be exactly 10 digits';
//             }
//         }

//         // PAN validation (if provided)
//         if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
//             newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
//         }

//         // Opening balance validation
//         if (formData.openingBalance && isNaN(Number(formData.openingBalance))) {
//             newErrors.openingBalance = 'Opening balance must be a valid number';
//         }

//         if (formData.location?.mapUrl) {
//             // Regex for standard Google Maps links and Shortened "Share" links
//             const googleMapsRegex = /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/;

//             if (!googleMapsRegex.test(formData.location.mapUrl)) {
//                 newErrors['location.mapUrl'] = 'Please enter a valid Google Maps link (e.g., https://maps.app.goo.gl/...)';
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) {
//             setActiveTab('main'); // Switch to main tab to show errors
//             return;
//         }

//         try {
//             if (mode === 'create') {
//                 await onSubmit(formData as CreateVendorPayload, selectedFiles);
//             } else {
//                 await onSubmit(formData as UpdateVendorPayload);
//             }
//         } catch (error) {
//             console.error('Submit error:', error);
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

//     // Tabs configuration
//     const tabs = [
//         { id: 'main', label: 'Main Information', icon: 'fa-user' },
//         { id: 'other', label: 'Other Details', icon: 'fa-info-circle' },
//         ...(mode === 'create' ? [{ id: 'documents', label: 'Documents', icon: 'fa-file-upload' }] : [])
//     ];

//     return (
//         <div className="max-w-full mx-auto overflow-y-auto max-h-full">
//             {/* Header */}
//             <div className="mb-2 flex items-center gap-3">
//                 <button
//                     // onClick={() => ( mode === "create" ? navigate(-1) : setIsEditing?.(false)) }
//                     type="button"
//                     onClick={() => {
//                         if (mode === "create") {
//                             navigate(-1);
//                         } else {
//                             // console.log("workn cal33333333333333333")
//                             setIsEditing?.(false);
//                         }
//                     }}

//                     className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>


//                     <i className="fas fa-arrow-left"></i>

//                 </button>
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                         <i className={`fas ${mode === 'create' ? 'fa-plus-circle' : 'fa-edit'} mr-3 text-blue-600`}></i>
//                         {mode === 'create' ? 'Create New Vendor' : 'Update Vendor'}
//                     </h1>
//                     <p className="text-gray-600 mt-1 ml-3">
//                         {mode === 'create' ? 'Add a new Vendor to your organization' : 'Update Vendor information'}
//                     </p>
//                 </div>
//             </div>

//             {/* Tabs Navigation */}
//             <div className="mb-2">
//                 <div className="border-b border-gray-200">
//                     <nav className="-mb-px flex space-x-8">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id as any)}
//                                 className={`
//                                     py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
//                                     ${activeTab === tab.id
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }
//                                 `}
//                             >
//                                 <i className={`fas ${tab.icon}`}></i>
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </nav>
//                 </div>
//             </div>

//             {/* Form Content */}
//             <Card>
//                 <div className="p-2">
//                     {/* Main Information Tab */}
//                     {activeTab === 'main' && (
//                         <div className="space-y-3">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                                 <i className="fas fa-user mr-2 text-blue-600"></i>
//                                 Main Information
//                             </h2>

//                             {/* Vendor Type */}
//                             {/* <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Vendor Type
//                                 </label>
//                                 <div className="flex gap-4">
//                                     <label className="flex items-center cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             name="VendorType"
//                                             value="business"
//                                             checked={formData.VendorType === 'business'}
//                                             onChange={(e) => setFormData({ ...formData, VendorType: e.target.value as 'business' })}
//                                             className="mr-2"
//                                         />
//                                         <i className="fas fa-building mr-2 text-blue-600"></i>
//                                         Business
//                                     </label>
//                                     <label className="flex items-center cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             name="VendorType"
//                                             value="individual"
//                                             checked={formData.VendorType === 'individual'}
//                                             onChange={(e) => setFormData({ ...formData, VendorType: e.target.value as 'individual' })}
//                                             className="mr-2"
//                                         />
//                                         <i className="fas fa-user mr-2 text-green-600"></i>
//                                         Individual
//                                     </label>
//                                 </div>
//                             </div> */}

//                             {/* Name Fields - Grid Layout */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         First Name <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.firstName}
//                                         onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="Enter first name"
//                                     />
//                                     {errors.firstName && (
//                                         <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
//                                     )}
//                                 </div>


//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Company Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.companyName}
//                                         onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="Enter company name"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-envelope mr-2 text-gray-400"></i>
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     value={formData.email}
//                                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Vendor@example.com"
//                                 />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                                 )}
//                             </div>

//                             {/* Phone Numbers */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-mobile-alt mr-2 text-gray-400"></i>
//                                         Mobile Number
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         value={formData.phone.mobile}
//                                         onChange={(e) => setFormData({
//                                             ...formData,
//                                             phone: { ...formData.phone, mobile: e.target.value }
//                                         })}
//                                         maxLength={10}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="1234567890"
//                                     />
//                                     {errors['phone.mobile'] && (
//                                         <p className="text-red-500 text-sm mt-1">{errors['phone.mobile']}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-phone mr-2 text-gray-400"></i>
//                                         Work Number
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         value={formData.phone.work}
//                                         onChange={(e) => setFormData({
//                                             ...formData,
//                                             phone: { ...formData.phone, work: e.target.value }
//                                         })}
//                                         maxLength={10}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="9876543210"
//                                     />
//                                     {errors['phone.work'] && (
//                                         <p className="text-red-500 text-sm mt-1">{errors['phone.work']}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Vendor Language */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-language mr-2 text-gray-400"></i>
//                                     Vendor Language
//                                 </label>
//                                 <select
//                                     value={formData.vendorLanguage}
//                                     onChange={(e) => setFormData({ ...formData, vendorLanguage: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 >
//                                     <option value="English">English</option>
//                                     <option value="Hindi">Hindi</option>
//                                     <option value="Tamil">Tamil</option>
//                                     <option value="Telugu">Telugu</option>
//                                     <option value="Malayalam">Malayalam</option>
//                                     <option value="Kannada">Kannada</option>
//                                 </select>
//                             </div>


//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
//                                     Map Location
//                                 </label>

//                                 <input
//                                     type="text" // CHANGED: was 'tel'
//                                     value={formData.location?.mapUrl || ''} // Handle potential null
//                                     onChange={(e) => setFormData({
//                                         ...formData,
//                                         location: { ...formData.location, mapUrl: e.target.value }
//                                     })}
//                                     // REMOVED: maxLength={10} (URLs are much longer than 10 chars)
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
//             ${errors['location.mapUrl'] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
//                                     // placeholder="https://maps.app.goo.gl/..." // CHANGED: example URL
//                                 />

//                                 {/* Show Error Message if Invalid */}
//                                 {errors['location.mapUrl'] && (
//                                     <p className="mt-1 text-xs text-red-500 flex items-center">
//                                         <i className="fas fa-circle-exclamation mr-1"></i>
//                                         {errors['location.mapUrl']}
//                                     </p>
//                                 )}

//                                 {/* Optional: Helper text */}
//                                 {!errors['location.mapUrl'] && (
//                                     <p className="mt-1 text-xs text-gray-400">
//                                         Paste the "Share" link from Google Maps here.
//                                     </p>
//                                 )}
//                             </div>





//                         </div>
//                     )}

//                     {/* Other Details Tab */}
//                     {activeTab === 'other' && (
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
//                                 <input
//                                     type="text"
//                                     value={formData.pan}
//                                     onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="ABCDE1234F"
//                                     maxLength={10}
//                                 />
//                                 {errors.pan && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.pan}</p>
//                                 )}
//                                 <p className="text-xs text-gray-500 mt-1">Format: 5 letters, 4 digits, 1 letter</p>
//                             </div>

//                             {/* Currency */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-dollar-sign mr-2 text-gray-400"></i>
//                                     Currency
//                                 </label>
//                                 <select
//                                     value={formData.currency}
//                                     onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 >
//                                     <option value="INR - Indian Rupee">INR - Indian Rupee</option>
//                                     <option value="USD - US Dollar">USD - US Dollar</option>
//                                     <option value="EUR - Euro">EUR - Euro</option>
//                                     <option value="GBP - British Pound">GBP - British Pound</option>
//                                     <option value="AED - UAE Dirham">AED - UAE Dirham</option>
//                                 </select>
//                             </div>

//                             {/* Accounts Receivable */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-receipt mr-2 text-gray-400"></i>
//                                     Accounts Payable
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={formData.accountsPayable}
//                                     onChange={(e) => setFormData({ ...formData, accountsPayable: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Account details"
//                                 />
//                             </div>

//                             {/* Opening Balance */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-wallet mr-2 text-gray-400"></i>
//                                     Opening Balance
//                                 </label>
//                                 <input
//                                     type="number"
//                                     value={formData.openingBalance}
//                                     onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="0.00"
//                                     step="0.01"
//                                 />
//                                 {errors.openingBalance && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.openingBalance}</p>
//                                 )}
//                             </div>

//                             {/* Payment Terms */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-calendar-check mr-2 text-gray-400"></i>
//                                     Payment Terms
//                                 </label>
//                                 <select
//                                     value={formData.paymentTerms}
//                                     onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 >
//                                     <option value="Due on Receipt">Due on Receipt</option>
//                                     <option value="Net 15">Net 15</option>
//                                     <option value="Net 30">Net 30</option>
//                                     <option value="Net 45">Net 45</option>
//                                     <option value="Net 60">Net 60</option>
//                                 </select>
//                             </div>

//                             {/* Enable Portal */}
//                             {/* <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     id="enablePortal"
//                                     checked={formData.enablePortal}
//                                     onChange={(e) => setFormData({ ...formData, enablePortal: e.target.checked })}
//                                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 />
//                                 <label htmlFor="enablePortal" className="ml-2 text-sm font-medium text-gray-700">
//                                     Enable Vendor Portal Access
//                                 </label>
//                             </div> */}
//                         </div>
//                     )}

//                     {/* Documents Tab (Only for Create Mode) */}
//                     {activeTab === 'documents' && mode === 'create' && (
//                         <div className="space-y-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                                 <i className="fas fa-file-upload mr-2 text-blue-600"></i>
//                                 Documents
//                             </h2>

//                             {/* File Upload */}
//                             {/* <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Upload Documents (Optional)
//                                 </label>
//                                 <div className="border-2 border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
//                                     <input
//                                         type="file"
//                                         multiple
//                                         accept="image/*,.pdf"
//                                         onChange={handleFileChange}
//                                         className="hidden"
//                                         id="file-upload"
//                                     />
//                                     <label htmlFor="file-upload" className="cursor-pointer">
//                                         <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></i>
//                                         <p className="text-sm text-gray-600 mb-1">
//                                             Click to upload
//                                         </p>
//                                         <p className="text-xs text-gray-500">
//                                             PDF, PNG, JPG, JPEG (MAX. 10MB per file)
//                                         </p>
//                                     </label>
//                                 </div>
//                             </div> */}


//                             <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer overflow-hidden">
//                                 <input
//                                     type="file"
//                                     multiple
//                                     accept="image/*,.pdf"
//                                     onChange={handleFileChange}
//                                     id="file-upload"
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                                 />

//                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
//                                     <i className="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-3"></i>
//                                     <p className="text-sm text-gray-600 font-medium mb-1">Click to upload</p>
//                                     <p className="text-xs text-gray-500">
//                                         PDF, PNG, JPG, JPEG
//                                     </p>
//                                 </div>
//                             </div>


//                             {/* Selected Files List */}
//                             {selectedFiles.length > 0 && (
//                                 <div>
//                                     <h3 className="text-sm font-medium text-gray-700 mb-3">
//                                         Selected Files ({selectedFiles.length})
//                                     </h3>
//                                     <div className="space-y-2">
//                                         {selectedFiles.map((file, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
//                                             >
//                                                 <div className="flex items-center space-x-3">
//                                                     <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'} text-xl`}></i>
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-900">{file.name}</p>
//                                                         <p className="text-xs text-gray-500">
//                                                             {(file.size / 1024 / 1024).toFixed(2)} MB
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeFile(index)}
//                                                     className="text-red-500 hover:text-red-700"
//                                                 >
//                                                     <i className="fas fa-times"></i>
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {selectedFiles.length === 0 && (
//                                 <div className="text-center py-8 text-gray-500">
//                                     <i className="fas fa-folder-open text-4xl mb-3 block"></i>
//                                     <p>No documents selected</p>
//                                     <p className="text-xs mt-1">You can add documents later if needed</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Action Buttons - Always visible at bottom */}
//                     <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => (mode === "create" ? navigate(-1) : setIsEditing?.(false))}

//                             disabled={isSubmitting}
//                         >
//                             <i className="fas fa-times mr-2"></i>
//                             Cancel
//                         </Button>

//                         <div className="flex gap-3">
//                             {/* Tab Navigation Buttons */}
//                             {activeTab !== 'main' && (
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => {
//                                         const currentIndex = tabs.findIndex(t => t.id === activeTab);
//                                         if (currentIndex > 0) {
//                                             setActiveTab(tabs[currentIndex - 1].id as any);
//                                         }
//                                     }}
//                                     disabled={isSubmitting}
//                                 >
//                                     <i className="fas fa-arrow-left mr-2"></i>
//                                     Previous
//                                 </Button>
//                             )}

//                             {activeTab !== tabs[tabs.length - 1].id && (
//                                 <Button
//                                     type="button"
//                                     onClick={() => {
//                                         const currentIndex = tabs.findIndex(t => t.id === activeTab);
//                                         if (currentIndex < tabs.length - 1) {
//                                             setActiveTab(tabs[currentIndex + 1].id as any);
//                                         }
//                                     }}
//                                     disabled={isSubmitting}
//                                 >
//                                     Next
//                                     <i className="fas fa-arrow-right ml-2"></i>
//                                 </Button>
//                             )}

//                             {/* Submit Button - Always visible */}
//                             <Button
//                                 type="button"
//                                 onClick={handleSubmit}
//                                 disabled={isSubmitting}
//                                 className="bg-blue-600 hover:bg-blue-700"
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <i className="fas fa-spinner fa-spin mr-2"></i>
//                                         {mode === 'create' ? 'Creating...' : 'Updating...'}
//                                     </>
//                                 ) : (
//                                     <>
//                                         <i className="fas fa-check mr-2"></i>
//                                         {mode === 'create' ? 'Create Vendor' : 'Update Vendor'}
//                                     </>
//                                 )}
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default VendorAccountForm;



// SECOND VERSION

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Card } from '../../../../components/ui/Card';
// import { Button } from '../../../../components/ui/Button';
// import type { CreateVendorPayload, UpdateVendorPayload, Vendor } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';

// interface VendorFormProps {
//     mode: 'create' | 'view' | 'update'; // Added 'view'
//     initialData?: Vendor | null;
//     onSubmit: (data: any, files?: File[]) => Promise<void>;
//     isSubmitting: boolean;
//     setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>; // Optional now
// }

// const VendorAccountForm: React.FC<VendorFormProps> = ({
//     mode: initialMode,
//     initialData,
//     onSubmit,
//     isSubmitting,
// }) => {
//     const { organizationId } = useParams();
//     const navigate = useNavigate();

//     // Internal State for Mode Switching (View <-> Update)
//     const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);
//     const [activeTab, setActiveTab] = useState<'main' | 'other' | 'documents'>('main');

//     // Default Data Structure
//     const defaultData = {
//         organizationId: organizationId,
//         projectId: initialData?.projectId || null,
//         clientId: initialData?.clientId ||  null,
//         firstName: '',
//         companyName: '',
//         email: '',
//         phone: { work: '', mobile: '' },
//         vendorLanguage: 'English',
//         pan: '',
//         currency: 'INR - Indian Rupee',
//         accountsPayable: '',
//         openingBalance: 0,
//         paymentTerms: 'Due on Receipt',
//         location: {
//             address: '',
//             mapUrl: "",
//             latitude: 0,
//             longitude: 0
//         }
//     };




//     const [formData, setFormData] = useState(defaultData);
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [errors, setErrors] = useState<Record<string, string>>({});

//     // Load Initial Data
//     useEffect(() => {
//         if (initialData) {
//             setFormData({
//                 organizationId: initialData.organizationId || organizationId,
//                 projectId: initialData?.projectId || null,
//                 clientId: initialData.clientId || null,
//                 firstName: initialData.firstName || '',
//                 companyName: initialData.companyName || '',
//                 email: initialData.email || '',
//                 phone: {
//                     work: initialData.phone?.work || '',
//                     mobile: initialData.phone?.mobile || ''
//                 },
//                 vendorLanguage: initialData.vendorLanguage || 'English',
//                 pan: initialData.pan || '',
//                 currency: initialData.currency || 'INR - Indian Rupee',
//                 accountsPayable: initialData.accountsPayable || '',
//                 openingBalance: initialData.openingBalance || 0,
//                 paymentTerms: initialData.paymentTerms || 'Due on Receipt',
//                 location: {
//                     address: initialData.location?.address || '',
//                     mapUrl: initialData.location?.mapUrl || "",
//                     latitude: initialData.location?.latitude ?? 0,
//                     longitude: initialData.location?.longitude ?? 0
//                 }
//             });
//         }
//     }, [initialData, organizationId]);

//     // Helper to check if we are in read-only mode
//     const isReadOnly = currentMode === 'view';

//     // --- Validation ---
//     const validateForm = (): boolean => {
//         const newErrors: Record<string, string> = {};

//         if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
//         if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

//         if (formData.phone.mobile) {
//             const mobileValue = String(formData.phone.mobile).replace(/[\s-()]/g, '');
//             if (!/^[0-9]{10}$/.test(mobileValue)) newErrors['phone.mobile'] = 'Mobile number must be exactly 10 digits';
//         }
//         if (formData.phone.work) {
//             const workValue = String(formData.phone.work).replace(/[\s-()]/g, '');
//             if (!/^[0-9]{10}$/.test(workValue)) newErrors['phone.work'] = 'Work number must be exactly 10 digits';
//         }
//         if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = 'Invalid PAN format';
//         if (formData.openingBalance && isNaN(Number(formData.openingBalance))) newErrors.openingBalance = 'Invalid number';

//         if (formData.location?.mapUrl) {
//             const googleMapsRegex = /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/;
//             if (!googleMapsRegex.test(formData.location.mapUrl)) {
//                 newErrors['location.mapUrl'] = 'Please enter a valid Google Maps link';
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // --- Handlers ---

//     const handleEditClick = () => {
//         setCurrentMode('update');
//     };

//     const handleCancelClick = () => {
//         if (currentMode === 'create') {
//             navigate(-1);
//         } else {
//             // Revert to view mode and reset data
//             setCurrentMode('view');
//             if (initialData) {
//                 // Re-trigger effect or manually reset
//                 setFormData(prev => ({ ...prev })); // Trigger re-render, effect will handle data reset
//             }
//         }
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) {
//             setActiveTab('main'); 
//             return;
//         }

//         try {
//             if (currentMode === 'create') {
//                 await onSubmit(formData as CreateVendorPayload, selectedFiles);
//                 // Usually redirect handled by parent or navigate here
//             } else {
//                 await onSubmit(formData as UpdateVendorPayload, selectedFiles);
//                 // On success, switch back to view
//                 setCurrentMode('view');
//                 setSelectedFiles([]); // Clear uploaded files
//             }
//         } catch (error) {
//             console.error('Submit error:', error);
//         }
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) setSelectedFiles(Array.from(e.target.files));
//     };
//     const removeFile = (index: number) => {
//         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     // Tabs Config
//     const tabs = [
//         { id: 'main', label: 'Main Information', icon: 'fa-user' },
//         { id: 'other', label: 'Other Details', icon: 'fa-info-circle' },
//         { id: 'documents', label: 'Documents', icon: 'fa-file-upload' } // Show documents tab in all modes
//     ];

//     return (
//         <div className="max-w-full mx-auto h-full flex flex-col">
//             {/* Header */}
//             <div className="mb-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <button
//                         type="button"
//                         onClick={() => navigate(-1)}
//                         className='bg-white hover:bg-gray-100 flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-600 rounded-md transition-colors'>
//                         <i className="fas fa-arrow-left"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//                             <i className={`fas ${currentMode === 'create' ? 'fa-plus-circle' : 'fa-user-tie'} mr-3 text-blue-600`}></i>
//                             {currentMode === 'create' ? 'Create New Vendor' : currentMode === 'update' ? 'Update Vendor' : 'Vendor Details'}
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-0.5 ml-9">
//                             {currentMode === 'create' ? 'Add a new vendor' : currentMode === 'update' ? 'Edit vendor information' : 'View vendor information'}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Top Action Buttons */}
//                 <div className="flex gap-2">
//                     {currentMode === 'view' && (
//                         <Button onClick={handleEditClick} className="bg-blue-600 text-white shadow-sm">
//                             <i className="fas fa-edit mr-2"></i> Edit Vendor
//                         </Button>
//                     )}
//                     {currentMode === 'update' && (
//                          <Button onClick={handleCancelClick} variant="outline" className="bg-white">
//                             <i className="fas fa-times mr-2"></i> Cancel Edit
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             {/* Tabs Navigation */}
//             <div className="bg-white border-b border-gray-200 mb-4 sticky top-0 z-10">
//                 <nav className="flex space-x-8 px-4">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id as any)}
//                             className={`
//                                 py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
//                                 ${activeTab === tab.id
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }
//                             `}
//                         >
//                             <i className={`fas ${tab.icon}`}></i>
//                             {tab.label}
//                         </button>
//                     ))}
//                 </nav>
//             </div>

//             {/* Content Area */}
//             <Card className="flex-1 overflow-visible">
//                 <div className="p-6">

//                     {/* --- MAIN TAB --- */}
//                     {activeTab === 'main' && (
//                         <div className="space-y-6 animate-fadeIn">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
//                                     <input
//                                         type="text"
//                                         value={formData.firstName}
//                                         onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                         placeholder="Enter first name"
//                                     />
//                                     {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
//                                 </div>
//                                 {/* <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                                     <input
//                                         type="text"
//                                         value={formData.lastName}
//                                         onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                         placeholder="Enter last name"
//                                     />
//                                 </div> */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
//                                     <input
//                                         type="text"
//                                         value={formData.companyName}
//                                         onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                         placeholder="Enter company name"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                                 <input
//                                     type="email"
//                                     value={formData.email}
//                                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                     disabled={isReadOnly}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     placeholder="vendor@example.com"
//                                 />
//                                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
//                                     <input
//                                         type="text"
//                                         value={formData.phone.mobile}
//                                         onChange={(e) => setFormData({ ...formData, phone: { ...formData.phone, mobile: e.target.value } })}
//                                         disabled={isReadOnly}
//                                         maxLength={10}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     />
//                                     {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Work Number</label>
//                                     <input
//                                         type="text"
//                                         value={formData.phone.work}
//                                         onChange={(e) => setFormData({ ...formData, phone: { ...formData.phone, work: e.target.value } })}
//                                         disabled={isReadOnly}
//                                         maxLength={10}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     />
//                                     {errors['phone.work'] && <p className="text-red-500 text-xs mt-1">{errors['phone.work']}</p>}
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Language</label>
//                                 <select
//                                     value={formData.vendorLanguage}
//                                     onChange={(e) => setFormData({ ...formData, vendorLanguage: e.target.value })}
//                                     disabled={isReadOnly}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                 >
//                                     {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(lang => (
//                                         <option key={lang} value={lang}>{lang}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Location / Map Link */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-map-marker-alt mr-2 text-red-500"></i> Map Location Link
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="text" 
//                                         value={formData.location?.mapUrl || ''}
//                                         onChange={(e) => setFormData({
//                                             ...formData,
//                                             location: { ...formData.location, mapUrl: e.target.value }
//                                         })}
//                                         disabled={isReadOnly}
//                                         className={`w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500
//                                             ${errors['location.mapUrl'] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
//                                         placeholder="https://maps.app.goo.gl/..."
//                                     />
//                                     <i className="fas fa-link absolute left-3 top-3 text-gray-400"></i>

//                                     {/* Open Link Button (Visible if link exists) */}
//                                     {formData.location?.mapUrl && (
//                                         <a 
//                                             href={formData.location.mapUrl} 
//                                             target="_blank" 
//                                             rel="noreferrer"
//                                             className="absolute right-2 top-2 text-xs bg-gray-100 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded border border-gray-200"
//                                         >
//                                             <i className="fas fa-external-link-alt mr-1"></i> Open
//                                         </a>
//                                     )}
//                                 </div>
//                                 {errors['location.mapUrl'] && (
//                                     <p className="mt-1 text-xs text-red-500">{errors['location.mapUrl']}</p>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* --- OTHER DETAILS TAB --- */}
//                     {activeTab === 'other' && (
//                         <div className="space-y-6 animate-fadeIn">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
//                                     <input
//                                         type="text"
//                                         value={formData.pan}
//                                         onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                         placeholder="ABCDE1234F"
//                                         maxLength={10}
//                                     />
//                                     {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//                                     <select
//                                         value={formData.currency}
//                                         onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     >
//                                         {['INR - Indian Rupee', 'USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'AED - UAE Dirham'].map(curr => (
//                                             <option key={curr} value={curr}>{curr}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Accounts Payable</label>
//                                     <input
//                                         type="text"
//                                         value={formData.accountsPayable}
//                                         onChange={(e) => setFormData({ ...formData, accountsPayable: e.target.value })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance</label>
//                                     <input
//                                         type="number"
//                                         value={formData.openingBalance}
//                                         onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     />
//                                     {errors.openingBalance && <p className="text-red-500 text-xs mt-1">{errors.openingBalance}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
//                                     <select
//                                         value={formData.paymentTerms}
//                                         onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
//                                         disabled={isReadOnly}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
//                                     >
//                                         {['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60'].map(term => (
//                                             <option key={term} value={term}>{term}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* --- DOCUMENTS TAB --- */}
//                     {activeTab === 'documents' && (
//                         <div className="space-y-6 animate-fadeIn">

//                             {/* 1. Existing Documents (View/Update Mode) */}
//                             {initialData?.documents && initialData.documents.length > 0 && (
//                                 <div className="mb-6">
//                                     <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Documents</h3>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         {initialData.documents.map((doc: any, idx: number) => (
//                                             <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
//                                                 <div className="flex items-center gap-3 overflow-hidden">
//                                                     <i className="fas fa-file-alt text-blue-500 text-xl"></i>
//                                                     <div className="truncate">
//                                                         <p className="text-sm font-medium text-gray-800 truncate">{doc.originalName || `Document ${idx + 1}`}</p>
//                                                     </div>
//                                                 </div>
//                                                 <a 
//                                                     href={doc.url} 
//                                                     target="_blank" 
//                                                     rel="noreferrer"
//                                                     className="text-xs bg-white hover:bg-gray-100 border px-2 py-1 rounded text-blue-600"
//                                                 >
//                                                     View
//                                                 </a>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* 2. Upload New Documents (Create/Update Mode only) */}
//                             {!isReadOnly && (
//                                 <div className="mt-4">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         {currentMode === 'create' ? 'Upload Documents' : 'Add More Documents'}
//                                     </label>

//                                     <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
//                                         <input
//                                             type="file"
//                                             multiple
//                                             accept="image/*,.pdf"
//                                             onChange={handleFileChange}
//                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                                         />
//                                         <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
//                                             <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
//                                             <p className="text-sm text-gray-600 font-medium">Click to upload new files</p>
//                                             <p className="text-xs text-gray-500">PDF, JPG, PNG</p>
//                                         </div>
//                                     </div>

//                                     {/* New Files Preview */}
//                                     {selectedFiles.length > 0 && (
//                                         <div className="mt-4 space-y-2">
//                                             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ready to Upload</p>
//                                             {selectedFiles.map((file, index) => (
//                                                 <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
//                                                     <div className="flex items-center gap-2">
//                                                         <i className="fas fa-file text-gray-400"></i>
//                                                         <span className="text-sm text-gray-700">{file.name}</span>
//                                                         <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                                                     </div>
//                                                     <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 px-2">
//                                                         <i className="fas fa-times"></i>
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {isReadOnly && (!initialData?.documents || initialData.documents.length === 0) && (
//                                 <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
//                                     <i className="fas fa-folder-open text-3xl mb-2"></i>
//                                     <p className="text-sm">No documents uploaded.</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Bottom Action Buttons */}
//                     {!isReadOnly && (
//                         <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={handleCancelClick}
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </Button>

//                             <Button
//                                 type="button"
//                                 onClick={handleSubmit}
//                                 disabled={isSubmitting}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
//                             >
//                                 {isSubmitting ? (
//                                     <><i className="fas fa-spinner fa-spin mr-2"></i> Saving...</>
//                                 ) : (
//                                     <><i className="fas fa-save mr-2"></i> Save Changes</>
//                                 )}
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default VendorAccountForm;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { useUpdateVendorMainImage, type CreateVendorPayload, type UpdateVendorPayload, type Vendor } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
import { dateFormate } from '../../../../utils/dateFormator';
import { toast } from '../../../../utils/toast';

// Adjust these import paths based on your project structure
// import ImageGalleryExample from '../../../../components/ui/ImageGalleryExample'; 
// import { dateFormate } from '../../../../utils/dateFormate'; 

interface VendorFormProps {
    mode: 'create' | 'view' | 'update';
    initialData?: Vendor | null;
    // Updated onSubmit to accept the mainImage file separately
    onSubmit: (data: any, files?: File[], mainImage?: File) => Promise<void>;
    isSubmitting: boolean;
}

const VendorAccountForm: React.FC<VendorFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
}) => {
    const { organizationId } = useParams();
    const navigate = useNavigate();

    // --- State Management ---
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);

    // Main Image State
    const [mainImageFile, setMainImageFile] = useState<File | undefined>(undefined);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        organizationId: organizationId,
        projectId: initialData?.projectId || null,
        clientId: initialData?.clientId || null,
        firstName: '', // lastName removed
        companyName: '',
        email: '',
        phone: { work: '', mobile: '' },
        vendorLanguage: 'English',
        pan: '',
        currency: 'INR - Indian Rupee',
        accountsPayable: '',
        openingBalance: 0,
        paymentTerms: 'Due on Receipt',
        location: {
            address: '',
            mapUrl: "",
            latitude: 0,
            longitude: 0
        }
    });

    // --- Hooks ---
    const updateImageMutation = useUpdateVendorMainImage(); // NEW HOOK


    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        const handleClose = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsImageModalOpen(false);
            }
        };
        // CHANGE 'keypress' TO 'keydown'
        if (isImageModalOpen) {
            document.addEventListener("keydown", handleClose);
        }

        return () => {
            document.removeEventListener("keydown", handleClose);
        };
    }, [isImageModalOpen]);


    // --- Effects ---
    useEffect(() => {
        if (initialData) {
            setFormData({
                organizationId: initialData.organizationId || organizationId,
                projectId: initialData.projectId || null,
                clientId: initialData.clientId || null,
                firstName: initialData.firstName || '',
                companyName: initialData.companyName || '',
                email: initialData.email || '',
                phone: {
                    work: initialData.phone?.work || '',
                    mobile: initialData.phone?.mobile || ''
                },
                vendorLanguage: initialData.vendorLanguage || 'English',
                pan: initialData.pan || '',
                currency: initialData.currency || 'INR - Indian Rupee',
                accountsPayable: initialData.accountsPayable || '',
                openingBalance: initialData.openingBalance || 0,
                paymentTerms: initialData.paymentTerms || 'Due on Receipt',
                location: {
                    address: initialData.location?.address || '',
                    mapUrl: initialData.location?.mapUrl || "",
                    latitude: initialData.location?.latitude ?? 0,
                    longitude: initialData.location?.longitude ?? 0
                }
            });
            // Set Main Image Preview if exists in backend data
            // Assuming initialData.mainImage is a URL string
            if ((initialData).mainImage) {
                setMainImagePreview(initialData.mainImage.url);
            }
        }
    }, [initialData, organizationId]);

    // Cleanup object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (mainImagePreview && !mainImagePreview.startsWith('http')) {
                URL.revokeObjectURL(mainImagePreview);
            }
        };
    }, [mainImagePreview]);

    const isReadOnly = currentMode === 'view';

    // --- Handlers ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
        setFormData(prev => ({
            ...prev,
            phone: { ...prev.phone, [type]: value }
        }));
    };

    const handleLocationChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, mapUrl: value }
        }));
    };


    // Documents Handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Main Image Handler
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // console.log("111111")
            // Scenario A: Create Mode -> Just set local state, upload later on Submit
            if (currentMode === 'create') {
                // console.log("2222222222")

                setMainImageFile(file);
                setMainImagePreview(URL.createObjectURL(file));
            }
            // Scenario B: View/Update Mode -> Upload Immediately via separate API
            else {
                if (initialData?._id) {
                    try {
                        // Optimistic preview update
                        setMainImagePreview(URL.createObjectURL(file));

                        // console.log("3333333333")

                        // Call the mutation
                        await updateImageMutation.mutateAsync({
                            vendorId: initialData._id,
                            file: file
                        });
                        // Optional: Toast success
                        toast({ title: "Successfull", description: "vendor Image updated successfully" });
                    } catch (error) {
                        console.error("Failed to update image", error);
                        // Revert preview if failed (optional logic)
                    }
                }
            }
        }
    }



    const handleEditClick = () => setCurrentMode('update');

    const handleCancelClick = () => {
        if (currentMode === 'create') navigate(-1);
        else {
            setCurrentMode('view');
            setSelectedFiles([]);
            setMainImageFile(undefined);
            // Reset preview to original data
            setMainImagePreview((initialData as any)?.mainImage || null);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name / Shop Name is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (formData.phone.mobile) {
            const val = formData.phone.mobile.replace(/[\s-()]/g, '');
            if (!/^[0-9]{10}$/.test(val)) newErrors['phone.mobile'] = 'Must be 10 digits';
        }

        if (formData.location?.mapUrl) {
            const googleMapsRegex = /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/;
            if (!googleMapsRegex.test(formData.location.mapUrl)) {
                newErrors['location.mapUrl'] = 'Invalid Google Maps link';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Pass formData, documents array, and the specific mainImage file
            if (currentMode === 'create') {
                await onSubmit(formData as CreateVendorPayload, selectedFiles, mainImageFile);
            } else {
                await onSubmit(formData as UpdateVendorPayload, selectedFiles, mainImageFile);
                setCurrentMode('view');
                setSelectedFiles([]);
                setMainImageFile(undefined);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Filter existing documents
    const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
    const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];

    return (
        <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10">
            {/* --- Header --- */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className='bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md transition-colors'>
                        <i className="fas fa-arrow-left text-gray-600"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <i className={`fas ${currentMode === 'create' ? 'fa-plus-circle' : 'fa-store'} mr-3 text-blue-600`}></i>
                            {currentMode === 'create' ? 'Create Vendor' : currentMode === 'update' ? 'Update Vendor' : 'Vendor Details'}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    {currentMode === 'view' && (
                        <Button onClick={handleEditClick} className="bg-blue-600 text-white shadow-sm">
                            <i className="fas fa-edit mr-2"></i> Edit Details
                        </Button>
                    )}
                    {currentMode === 'update' && (
                        <Button onClick={handleCancelClick} variant="outline" className="bg-white">
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </div>

            {/* --- MAIN IMAGE / SHOP PROFILE SECTION --- */}
            <div className="flex justify-center mb-8">
                <div className="relative group">

                    {/* Circle Container */}
                    <div
                        className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative 
            ${mainImagePreview ? 'cursor-pointer hover:opacity-90' : ''}`} // Add cursor pointer if image exists
                        onClick={() => {
                            // Only open if there is an image to show
                            if (mainImagePreview) setIsImageModalOpen(true);
                        }}
                    >

                        {/* Loading Spinner Overlay */}
                        {updateImageMutation.isPending && (
                            <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
                            </div>
                        )}

                        {mainImagePreview ? (
                            <img
                                src={mainImagePreview}
                                alt="Shop Main"
                                className="w-full h-full object-cover"
                                title='Click to view full image'
                            />
                        ) : (
                            <i className="fas fa-store text-4xl text-gray-300"></i>
                        )}
                    </div>

                    {/* Upload Button (Pen Icon) */}
                    <label
                        htmlFor="mainImageUpload"
                        className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-105 z-20"
                        title="Update Shop Image"
                        onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking edit
                    >
                        <i className={`fas ${updateImageMutation.isPending ? 'fa-hourglass-half' : 'fa-pen'} text-sm`}></i>
                        <input
                            id="mainImageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={updateImageMutation.isPending}
                            onChange={handleMainImageChange}
                        />
                    </label>
                </div>
            </div>

            {/* --- IMAGE POPUP MODAL --- */}
            {isImageModalOpen && mainImagePreview && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setIsImageModalOpen(false)} // Close when clicking background
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        {/* Full Size Image */}
                        <img
                            src={mainImagePreview}
                            alt="Shop Full View"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-700"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                        />
                    </div>
                </div>
            )}


            <Card className="p-6">
                <div className="space-y-8">

                    {/* --- Section 1: Basic Details --- */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                            <i className="fas fa-info-circle mr-2 text-blue-500"></i> Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name / First Name <span className="text-red-500">*</span></label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="Enter Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="Enter Company Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="email@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    value={formData.phone.mobile}
                                    onChange={(e) => handlePhoneChange('mobile', e.target.value)}
                                    disabled={isReadOnly}
                                    maxLength={10}
                                    placeholder="10 digit mobile"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                                {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
                                <input
                                    value={formData.phone.work}
                                    onChange={(e) => handlePhoneChange('work', e.target.value)}
                                    disabled={isReadOnly}
                                    maxLength={10}
                                    placeholder="Work/Landline"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </section>

                    {/* --- Section 2: Financial & Location --- */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                            <i className="fas fa-coins mr-2 text-blue-500"></i> Financial & Location
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                <input
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="ABCDE1234F"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                                <input
                                    type="number"
                                    name="openingBalance"
                                    value={formData.openingBalance}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <select
                                    name="vendorLanguage"
                                    value={formData.vendorLanguage}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                                >
                                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                                >
                                    {['INR - Indian Rupee', 'USD - US Dollar', 'EUR - Euro'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                                <select
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                                >
                                    {['Due on Receipt', 'Net 15', 'Net 30', 'Net 45'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Accounts Payable</label>
                                <input
                                    name="accountsPayable"
                                    value={formData.accountsPayable}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Map Location (Link)
                                </label>
                                <div className="relative">
                                    <input
                                        value={formData.location?.mapUrl || ''}
                                        onChange={(e) => handleLocationChange(e.target.value)}
                                        disabled={isReadOnly}
                                        placeholder="https://maps.app.goo.gl/..."
                                        className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none disabled:bg-gray-50 ${errors['location.mapUrl'] ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <i className="fas fa-map-pin absolute left-3 top-3 text-gray-400"></i>
                                    {formData.location?.mapUrl && (
                                        <a href={formData.location.mapUrl} target="_blank" rel="noreferrer" className="absolute right-2 top-2 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                            Open
                                        </a>
                                    )}
                                </div>
                                {errors['location.mapUrl'] && <p className="text-red-500 text-xs mt-1">{errors['location.mapUrl']}</p>}
                            </div>
                        </div>
                    </section>

                    {/* --- Section 3: Documents Display --- */}
                    {(existingImages.length > 0 || existingPdfs.length > 0) && (
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                                <i className="fas fa-folder-open mr-2 text-blue-500"></i> Documents
                            </h3>

                            {/* Images Gallery */}
                            {existingImages.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-images text-purple-600"></i>
                                        <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                            {existingImages.length}
                                        </span>
                                    </div>
                                    <ImageGalleryExample
                                        imageFiles={existingImages}
                                        height={150}
                                        minWidth={150}
                                        maxWidth={200}
                                    />
                                </div>
                            )}

                            {/* PDFs List */}
                            {existingPdfs.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-file-pdf text-red-600"></i>
                                        <h4 className="font-semibold text-gray-800 text-sm">PDF Documents</h4>
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                            {existingPdfs.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {existingPdfs.map((file: any, i: number) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl">
                                                    <i className="fas fa-file-pdf"></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {file.originalName || `Document ${i + 1}.pdf`}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        <i className="far fa-calendar mr-1"></i>
                                                        {dateFormate(file.uploadedAt)}
                                                    </p>
                                                </div>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm shadow-sm group-hover:shadow-md"
                                                >
                                                    Open
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* --- Section 4: Upload New Documents (Edit/Create Mode) --- */}
                    {!isReadOnly && (
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                                <i className="fas fa-cloud-upload-alt mr-2 text-blue-500"></i>
                                {currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'}
                            </h3>

                            <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG</p>
                            </div>

                            {/* New Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'}`}></i>
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 px-2">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* --- Footer Buttons --- */}
                    {!isReadOnly && (
                        <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white min-w-[120px]">
                                {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i> Save Details</>}
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default VendorAccountForm;