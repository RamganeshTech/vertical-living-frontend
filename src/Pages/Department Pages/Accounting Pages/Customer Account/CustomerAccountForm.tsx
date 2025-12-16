


// // src/components/Department/Accounting/CustomerAccounts/CustomerAccountForm.tsx

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useUpdateCustomerMainImage, type CreateCustomerPayload, type Customer, type UpdateCustomerPayload } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
// import { Card } from '../../../../components/ui/Card';
// import { Button } from '../../../../components/ui/Button';
// import { toast } from '../../../../utils/toast';
// import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
// import { dateFormate } from '../../../../utils/dateFormator';

// interface CustomerAccountFormProps {
//     mode: 'create' | 'update' | "view";
//     initialData?: Customer | null;
//     onSubmit: (data: any, files?: File[], mainImage?: File) => Promise<void>;
//     isSubmitting: boolean;
//     // setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>

// }

// const CustomerAccountForm: React.FC<CustomerAccountFormProps> = ({
//     mode: initialMode,
//     initialData,
//     onSubmit,
//     isSubmitting,
//     // setIsEditing
// }) => {
//     const { organizationId } = useParams()
//     const navigate = useNavigate();
//     // const [activeTab, setActiveTab] = useState<'main' | 'other' | 'documents'>('main');
//     const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);


//     const [mainImageFile, setMainImageFile] = useState<File | undefined>(undefined);
//     const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.mainImage?.url || null);
//     const [isImageModalOpen, setIsImageModalOpen] = useState(false);


//     // Form state - All fields in one state
//     const [formData, setFormData] = useState({
//         customerType: (initialData?.customerType || 'business') as 'business' | 'individual',
//         organizationId: initialData?.organizationId || organizationId,
//         projectId: initialData?.projectId || null,
//         clientId: initialData?.clientId || null,
//         firstName: initialData?.firstName || '',
//         companyName: initialData?.companyName || '',
//         email: initialData?.email || '',
//         phone: {
//             work: initialData?.phone?.work || '',
//             mobile: initialData?.phone?.mobile || ''
//         },
//         customerLanguage: initialData?.customerLanguage || 'English',
//         pan: initialData?.pan || '',
//         currency: initialData?.currency || 'INR - Indian Rupee',
//         accountsReceivable: initialData?.accountsReceivable || '',
//         openingBalance: initialData?.openingBalance || 0,
//         paymentTerms: initialData?.paymentTerms || 'Due on Receipt',
//         enablePortal: initialData?.enablePortal || false
//     });

//     const updateImageMutation = useUpdateCustomerMainImage()

//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [errors, setErrors] = useState<Record<string, string>>({});

//     useEffect(() => {
//         const handleClose = (e: KeyboardEvent) => {
//             if (e.key === "Escape") {
//                 setIsImageModalOpen(false);
//             }
//         };
//         // CHANGE 'keypress' TO 'keydown'
//         if (isImageModalOpen) {
//             document.addEventListener("keydown", handleClose);
//         }

//         return () => {
//             document.removeEventListener("keydown", handleClose);
//         };
//     }, [isImageModalOpen]);

//     useEffect(() => {
//         return () => {
//             if (mainImagePreview && !mainImagePreview.startsWith('http')) {
//                 URL.revokeObjectURL(mainImagePreview);
//             }
//         };
//     }, [mainImagePreview]);

//     const isReadOnly = currentMode === 'view';

// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             phone: { ...prev.phone, [type]: value }
//         }));
//     };

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

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) {
//             // setActiveTab('main'); // Switch to main tab to show errors
// console.log("error", errors)
//             // toast({title:"Error", description:`Enter proper data for ${validateForm()[0]}`, variant:"destructive"})
//             return;
//         }

//         try {
//             if (initialMode === 'create') {
//                 await onSubmit(formData as CreateCustomerPayload, selectedFiles, mainImageFile);
//             } else {
//                 await onSubmit(formData as UpdateCustomerPayload);
//                 setCurrentMode('view');
//                 setSelectedFiles([]);
//                 setMainImageFile(undefined);
//             }
//         } catch (error) {
//             console.error('Submit error:', error);
//         }
//     };

//     const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];

//             // console.log("111111")
//             // Scenario A: Create Mode -> Just set local state, upload later on Submit
//             if (currentMode === 'create') {
//                 // console.log("2222222222")

//                 setMainImageFile(file);
//                 setMainImagePreview(URL.createObjectURL(file));
//             }
//             // Scenario B: View/Update Mode -> Upload Immediately via separate API
//             else {
//                 if (initialData?._id) {
//                     try {
//                         // Optimistic preview update
//                         setMainImagePreview(URL.createObjectURL(file));

//                         // console.log("3333333333")

//                         // Call the mutation
//                         await updateImageMutation.mutateAsync({
//                             customerId: initialData._id,
//                             file: file
//                         });
//                         // Optional: Toast success
//                         toast({ title: "Successfull", description: "customer Image updated successfully" });
//                     } catch (error) {
//                         console.error("Failed to update image", error);
//                         // Revert preview if failed (optional logic)
//                     }
//                 }
//             }
//         }
//     }

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setSelectedFiles(Array.from(e.target.files));
//         }
//     };

//     const removeFile = (index: number) => {
//         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleEditClick = () => setCurrentMode('update');

//     const handleCancelClick = () => {
//         if (currentMode === 'create') navigate(-1);
//         else {
//             setCurrentMode('view');
//             setSelectedFiles([]);
//             setMainImageFile(undefined);
//             // Reset preview to original data
//             setMainImagePreview((initialData as any)?.mainImage || null);
//         }
//     };



//     // Filter existing documents
//     const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
//     const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];


//     return (
//         <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10">
//             {/* Header */}
//             <div className="mb-6 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className='bg-white hover:bg-gray-100 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md transition-colors'>
//                         <i className="fas fa-arrow-left text-gray-600"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//                             <i className={`fas ${currentMode === 'create' ? 'fa-plus-circle' : 'fa-store'} mr-3 text-blue-600`}></i>
//                             {currentMode === 'create' ? 'Create Customer' : currentMode === 'update' ? 'Update Customer' : 'Customer Details'}
//                         </h1>
//                     </div>
//                 </div>
//                 <div className="flex gap-2">
//                     {currentMode === 'view' && (
//                         <Button onClick={handleEditClick} className="bg-blue-600 text-white shadow-sm">
//                             <i className="fas fa-edit mr-2"></i> Edit Details
//                         </Button>
//                     )}
//                     {currentMode === 'update' && (
//                         <Button onClick={handleCancelClick} variant="outline" className="bg-white">
//                             Cancel Edit
//                         </Button>
//                     )}
//                 </div>
//             </div>

//            {/* --- MAIN IMAGE / SHOP PROFILE SECTION --- */}
//             <div className="flex justify-center mb-8">
//                 <div className="relative group">

//                     {/* Circle Container */}
//                     <div
//                         className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative 
//             ${mainImagePreview ? 'cursor-pointer hover:opacity-90' : ''}`} // Add cursor pointer if image exists
//                         onClick={() => {
//                             // Only open if there is an image to show
//                             if (mainImagePreview) setIsImageModalOpen(true);
//                         }}
//                     >

//                         {/* Loading Spinner Overlay */}
//                         {updateImageMutation.isPending && (
//                             <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
//                                 <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
//                             </div>
//                         )}

//                         {mainImagePreview ? (
//                             <img
//                                 src={mainImagePreview}
//                                 alt="Shop Main"
//                                 className="w-full h-full object-cover"
//                                 title='Click to view full image'
//                             />
//                         ) : (
//                             <i className="fas fa-store text-4xl text-gray-300"></i>
//                         )}
//                     </div>

//                     {/* Upload Button (Pen Icon) */}
//                     <label
//                         htmlFor="mainImageUpload"
//                         className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-105 z-20"
//                         title="Update Shop Image"
//                         onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking edit
//                     >
//                         <i className={`fas ${updateImageMutation.isPending ? 'fa-hourglass-half' : 'fa-pen'} text-sm`}></i>
//                         <input
//                             id="mainImageUpload"
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             disabled={updateImageMutation.isPending}
//                             onChange={handleMainImageChange}
//                         />
//                     </label>
//                 </div>
//             </div>

//             {/* --- IMAGE POPUP MODAL --- */}
//             {isImageModalOpen && mainImagePreview && (
//                 <div
//                     className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
//                     onClick={() => setIsImageModalOpen(false)} // Close when clicking background
//                 >
//                     <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center">

//                         {/* Close Button */}
//                         <button
//                             onClick={() => setIsImageModalOpen(false)}
//                             className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl transition-colors"
//                         >
//                             <i className="fas fa-times"></i>
//                         </button>

//                         {/* Full Size Image */}
//                         <img
//                             src={mainImagePreview}
//                             alt="Shop Full View"
//                             className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-700"
//                             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
//                         />
//                     </div>
//                 </div>
//             )}





//             <Card className="p-6">
//                             <div className="space-y-8">

//                                 {/* --- Section 1: Basic Details --- */}
//                                 <section>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                         <i className="fas fa-info-circle mr-2 text-blue-500"></i> Basic Information
//                                     </h3>

//                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name / First Name <span className="text-red-500">*</span></label>
//                                             <input
//                                                 name="firstName"
//                                                 value={formData.firstName}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 placeholder="Enter Name"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                             {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
//                                             <input
//                                                 name="companyName"
//                                                 value={formData.companyName}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 placeholder="Enter Company Name"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                         </div>
//                                     {/* </div> */}

//                                     {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> */}
//                                         <div className="col-span-1">
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={formData.email}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 placeholder="email@example.com"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                                             <input
//                                                 value={formData.phone.mobile}
//                                                 onChange={(e) => handlePhoneChange('mobile', e.target.value)}
//                                                 disabled={isReadOnly}
//                                                 maxLength={10}
//                                                 placeholder="10 digit mobile"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                             {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
//                                             <input
//                                                 value={formData.phone.work}
//                                                 onChange={(e) => handlePhoneChange('work', e.target.value)}
//                                                 disabled={isReadOnly}
//                                                 maxLength={10}
//                                                 placeholder="Work/Landline"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                         </div>
//                                     {/* </div>
//                                 </section> */}

//                                 {/* --- Section 2: Financial & Location --- */}
//                                 {/* <section>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                         <i className="fas fa-coins mr-2 text-blue-500"></i> Financial & Location
//                                     </h3>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4"> */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
//                                             <input
//                                                 name="pan"
//                                                 value={formData.pan}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 placeholder="ABCDE1234F"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
//                                             <input
//                                                 type="number"
//                                                 name="openingBalance"
//                                                 value={formData.openingBalance}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                             />
//                                         </div>
//                                     {/* </div> */}

//                                     {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"> */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
//                                             <select
//                                                 name="customerLanguage"
//                                                 value={formData.customerLanguage}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
//                                             >
//                                                 {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(l => <option key={l} value={l}>{l}</option>)}
//                                             </select>
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
//                                             <select
//                                                 name="currency"
//                                                 value={formData.currency}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
//                                             >
//                                                 {['INR - Indian Rupee', 'USD - US Dollar', 'EUR - Euro'].map(c => <option key={c} value={c}>{c}</option>)}
//                                             </select>
//                                         </div>
//                                         {/* <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
//                                             <select
//                                                 name="paymentTerms"
//                                                 value={formData.paymentTerms}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
//                                             >
//                                                 {['Due on Receipt', 'Net 15', 'Net 30', 'Net 45'].map(t => <option key={t} value={t}>{t}</option>)}
//                                             </select>
//                                         </div> */}
//                                     </div>

//                                     {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Accounts Payable</label>
//                                             <input
//                                                 name="accountsReceivable"
//                                                 value={formData.accountsReceivable}
//                                                 onChange={handleInputChange}
//                                                 disabled={isReadOnly}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
//                                             />
//                                         </div>
//                                     </div> */}
//                                 </section>


//                                 {/* --- Section 3: Documents Display --- */}
//                                 {(existingImages.length > 0 || existingPdfs.length > 0) && (
//                                     <section>
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                             <i className="fas fa-folder-open mr-2 text-blue-500"></i> Documents
//                                         </h3>

//                                         {/* Images Gallery */}
//                                         {existingImages.length > 0 && (
//                                             <div className="mb-6">
//                                                 <div className="flex items-center gap-2 mb-3">
//                                                     <i className="fas fa-images text-purple-600"></i>
//                                                     <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
//                                                     <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
//                                                         {existingImages.length}
//                                                     </span>
//                                                 </div>
//                                                 <ImageGalleryExample 
//                                                     imageFiles={existingImages}
//                                                     height={150}
//                                                     minWidth={150}
//                                                     maxWidth={200}
//                                                 />
//                                             </div>
//                                         )}

//                                         {/* PDFs List */}
//                                         {existingPdfs.length > 0 && (
//                                             <div>
//                                                 <div className="flex items-center gap-2 mb-3">
//                                                     <i className="fas fa-file-pdf text-red-600"></i>
//                                                     <h4 className="font-semibold text-gray-800 text-sm">PDF Documents</h4>
//                                                     <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
//                                                         {existingPdfs.length}
//                                                     </span>
//                                                 </div>
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                                     {existingPdfs.map((file: any, i: number) => (
//                                                         <div
//                                                             key={i}
//                                                             className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all group"
//                                                         >
//                                                             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl">
//                                                                 <i className="fas fa-file-pdf"></i>
//                                                             </div>
//                                                             <div className="flex-1 min-w-0">
//                                                                 <p className="text-sm font-semibold text-gray-900 truncate">
//                                                                     {file.originalName || `Document ${i + 1}.pdf`}
//                                                                 </p>
//                                                                 <p className="text-xs text-gray-500 mt-1">
//                                                                     <i className="far fa-calendar mr-1"></i>
//                                                                     {dateFormate(file.uploadedAt)}
//                                                                 </p>
//                                                             </div>
//                                                             <a
//                                                                 href={file.url}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm shadow-sm group-hover:shadow-md"
//                                                             >
//                                                                 Open
//                                                             </a>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </section>
//                                 )}

//                                 {/* --- Section 4: Upload New Documents (Edit/Create Mode) --- */}
//                                 {!isReadOnly && (
//                                     <section>
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                             <i className="fas fa-cloud-upload-alt mr-2 text-blue-500"></i>
//                                             {currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'}
//                                         </h3>

//                                         <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center">
//                                             <input
//                                                 type="file"
//                                                 multiple
//                                                 accept="image/*,.pdf"
//                                                 onChange={handleFileChange}
//                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                                             />
//                                             <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
//                                             <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
//                                             <p className="text-xs text-gray-500">PDF, PNG, JPG</p>
//                                         </div>

//                                         {/* New Files Preview */}
//                                         {selectedFiles.length > 0 && (
//                                             <div className="mt-4 space-y-2">
//                                                 {selectedFiles.map((file, index) => (
//                                                     <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
//                                                         <div className="flex items-center gap-2">
//                                                             <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'}`}></i>
//                                                             <span className="text-sm text-gray-700">{file.name}</span>
//                                                             <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                                                         </div>
//                                                         <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 px-2">
//                                                             <i className="fas fa-times"></i>
//                                                         </button>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </section>
//                                 )}

//                                 {/* --- Footer Buttons --- */}
//                                 {!isReadOnly && (
//                                     <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end gap-4">
//                                         <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isSubmitting}>
//                                             Cancel
//                                         </Button>
//                                         <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white min-w-[120px]">
//                                             {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i> Save Details</>}
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//         </div>
//     );
// };

// export default CustomerAccountForm;




import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type CreateCustomerPayload, type Customer, type UpdateCustomerPayload } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
import { dateFormate } from '../../../../utils/dateFormator';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';

// --- UI Helpers (Same as Vendor Form) ---
const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-1 border-b border-gray-100 flex items-center gap-2">
        <i className={`fas ${icon} text-blue-500`}></i> {title}
    </h3>
);

const InputLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

const ModernInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-all ${props.className}`}
    />
);

const ModernSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 bg-white disabled:bg-gray-50 transition-all ${props.className}`}
    >
        {props.children}
    </select>
);

interface CustomerAccountFormProps {
    mode: 'create' | 'update' | "view";
    initialData?: Customer | null;
    onSubmit: (data: any, files?: File[], mainImage?: File) => Promise<void>;
    isSubmitting: boolean;
}

const CustomerAccountForm: React.FC<CustomerAccountFormProps> = ({
    mode: initialMode,
    initialData,
    onSubmit,
    isSubmitting,
}) => {
    const { organizationId } = useParams()
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);
    const isReadOnly = currentMode === 'view';

    // --- Main Image State (Commented out functionality as requested) ---
    /*
    const [mainImageFile, setMainImageFile] = useState<File | undefined>(undefined);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.mainImage?.url || null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const updateImageMutation = useUpdateCustomerMainImage(); 
    */




    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.customer?.list;
    // const canCreate = role === "owner" || permission?.customer?.create
    const canEdit = role === "owner" || permission?.customer?.edit
    // const canDelete = role === "owner" || permission?.customer?.delete


    // --- Form State ---
    const [formData, setFormData] = useState({
        organizationId: initialData?.organizationId || organizationId,
        projectId: initialData?.projectId || null,
        clientId: initialData?.clientId || null,

        // Basic
        firstName: '',
        companyName: '',
        email: '',
        phone: { work: '', mobile: '' },

        // Statutory
        language: 'English',
        currency: 'INR - Indian Rupee',
        pan: '',
        tan: '',
        gstin: '',

        // Banking
        bankAccNo: '',
        accHolderName: '',
        bankName: '',
        bankBranch: '',
        ifscCode: ''
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Initialize Data ---
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                organizationId: initialData.organizationId || organizationId,
                clientId: initialData.clientId || null,
                firstName: initialData.firstName || '',
                companyName: initialData.companyName || '',
                email: initialData.email || '',
                phone: {
                    work: initialData.phone?.work || '',
                    mobile: initialData.phone?.mobile || ''
                },
                language: initialData.language || 'English',
                currency: initialData.currency || 'INR - Indian Rupee',
                pan: initialData.pan || '',
                tan: initialData.tan || '',
                gstin: initialData.gstin || '',
                bankAccNo: initialData.bankAccNo || '',
                accHolderName: initialData.accHolderName || '',
                bankName: initialData.bankName || '',
                bankBranch: initialData.bankBranch || '',
                ifscCode: initialData.ifscCode || ''
            }));
        }
    }, [initialData, organizationId]);


    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
        // Allow only numbers
        const cleanValue = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({
            ...prev,
            phone: { ...prev.phone, [type]: cleanValue }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancelClick = () => {
        if (currentMode === 'create') navigate(-1);
        else {
            setCurrentMode('view');
            setSelectedFiles([]);
        }
    };

    // --- Validation ---
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (formData.phone.mobile && formData.phone.mobile.length !== 10) {
            newErrors['phone.mobile'] = 'Mobile number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (initialMode === 'create') {
                // Pass undefined for mainImage as requested to remove functionality
                await onSubmit(formData as CreateCustomerPayload, selectedFiles);
            } else {
                await onSubmit(formData as UpdateCustomerPayload, selectedFiles);
                setCurrentMode('view');
                setSelectedFiles([]);
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    // --- Document Filters ---
    const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
    const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];

    return (
        <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10 font-sans">

            {/* --- Header --- */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className='bg-white hover:bg-gray-50 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full shadow-sm transition-colors'>
                        <i className="fas fa-arrow-left text-gray-600"></i>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">
                            <i className={`fas ${currentMode === 'create' ? 'fa-user-plus' : 'fa-user-tie'}`}></i>
                        </span>
                        {currentMode === 'create' ? 'Create Customer' : 'Customer Details'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {(currentMode === 'view' && canEdit) && (
                        <Button onClick={() => setCurrentMode('update')} className="bg-blue-600 text-white shadow-sm">
                            <i className="fas fa-edit mr-2"></i> Edit Details
                        </Button>
                    )}
                    {currentMode === 'update' && (
                        <Button onClick={handleCancelClick} variant="outline" className="bg-white">
                            Cancel Edit
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="">
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <span className="flex items-center">
                                <i className="fas fa-save mr-2"></i> Save Changes
                            </span>}
                        </Button>
                    )}
                </div>
            </div>

            {/* --- MAIN IMAGE SECTION (Commented Out as Requested) --- */}
            {/* 
            <div className="flex justify-center mb-8">
                <div className="relative group">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                         {mainImagePreview ? (
                            <img src={mainImagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <i className="fas fa-user text-4xl text-gray-300"></i>
                        )}
                    </div>
                </div>
            </div> 
            */}

            <Card className="p-6 shadow-sm border border-gray-100">
                <div className="space-y-6">

                    {/* --- Section 1: Basic Information --- */}
                    <div>
                        <SectionHeader icon="fa-info-circle" title="Basic Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-2">
                                <InputLabel required>Customer Name</InputLabel>
                                <ModernInput
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="Full Name"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Company Name</InputLabel>
                                <ModernInput
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="Company"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Email Address</InputLabel>
                                <ModernInput
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Mobile Number</InputLabel>
                                <ModernInput
                                    value={formData.phone.mobile}
                                    onChange={(e) => handlePhoneChange('mobile', e.target.value)}
                                    disabled={isReadOnly}
                                    maxLength={10}
                                    placeholder="10 digits"
                                />
                                {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Work Phone</InputLabel>
                                <ModernInput
                                    value={formData.phone.work}
                                    onChange={(e) => handlePhoneChange('work', e.target.value)}
                                    disabled={isReadOnly}
                                    maxLength={12}
                                    placeholder="Landline / Alt"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 2: Statutory & Settings --- */}
                    <div>
                        <SectionHeader icon="fa-file-invoice" title="Statutory & Settings" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div>
                                <InputLabel>PAN Number</InputLabel>
                                <ModernInput
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="PAN"
                                    className="uppercase"
                                />
                            </div>
                            <div>
                                <InputLabel>TAN Number</InputLabel>
                                <ModernInput
                                    name="tan"
                                    value={formData.tan}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="TAN"
                                    className="uppercase"
                                />
                            </div>
                            <div>
                                <InputLabel>GSTIN</InputLabel>
                                <ModernInput
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    placeholder="GSTIN"
                                    className="uppercase"
                                />
                            </div>
                            <div>
                                <InputLabel>Language</InputLabel>
                                <ModernSelect
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                >
                                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(l => <option key={l} value={l}>{l}</option>)}
                                </ModernSelect>
                            </div>
                            <div>
                                <InputLabel>Currency</InputLabel>
                                <ModernSelect
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                >
                                    {['INR - Indian Rupee', 'USD - US Dollar', 'EUR - Euro'].map(c => <option key={c} value={c}>{c}</option>)}
                                </ModernSelect>
                            </div>
                        </div>
                    </div>

                    {/* --- Section 3: Banking Details --- */}
                    {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"> */}
                    <div >
                        <SectionHeader icon="fa-university" title="Banking Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-1">
                                <InputLabel>Bank Name</InputLabel>
                                <ModernInput
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Branch</InputLabel>
                                <ModernInput
                                    name="bankBranch"
                                    value={formData.bankBranch}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Account Number</InputLabel>
                                <ModernInput
                                    name="bankAccNo"
                                    value={formData.bankAccNo}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>IFSC Code</InputLabel>
                                <ModernInput
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="uppercase"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <InputLabel>Account Holder</InputLabel>
                                <ModernInput
                                    name="accHolderName"
                                    value={formData.accHolderName}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 4: Documents --- */}
                    {(existingImages.length > 0 || existingPdfs.length > 0) && (
                        <section>
                            <SectionHeader icon="fa-folder-open" title="Attached Documents" />

                            {/* Images Gallery */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-images text-purple-600"></i>
                                        <h4 className="font-semibold text-gray-800 text-xs uppercase">Images</h4>
                                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded-full">
                                            {existingImages.length}
                                        </span>
                                    </div>
                                    <ImageGalleryExample
                                        imageFiles={existingImages}
                                        height={120}
                                        minWidth={120}
                                        maxWidth={180}
                                    />
                                </div>
                            )}

                            {/* PDFs List */}
                            {existingPdfs.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-file-pdf text-red-600"></i>
                                        <h4 className="font-semibold text-gray-800 text-xs uppercase">PDF Documents</h4>
                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded-full">
                                            {existingPdfs.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {existingPdfs.map((file: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-red-50 p-2 rounded border border-red-100 hover:shadow-sm transition-all">
                                                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-red-500 border border-red-100">
                                                    <i className="fas fa-file-pdf"></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-gray-900 truncate">
                                                        {file.originalName || `Document ${i + 1}.pdf`}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {dateFormate(file.uploadedAt)}
                                                    </p>
                                                </div>
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 px-1">
                                                    Open
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* --- Upload New Documents --- */}
                    {!isReadOnly && (
                        <section>
                            <SectionHeader icon="fa-cloud-upload-alt" title={currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'} />

                            <div className="relative w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-1"></i>
                                <p className="text-xs text-gray-600 font-medium">Click to upload files</p>
                                <p className="text-[10px] text-gray-400">PDF, PNG, JPG</p>
                            </div>

                            {/* New Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
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

                </div>
            </Card>
        </div>
    );
};

export default CustomerAccountForm;