// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Card } from '../../../../components/ui/Card';
// import { Button } from '../../../../components/ui/Button';
// import { useUpdateVendorMainImage, type CreateVendorPayload, type UpdateVendorPayload, type Vendor } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
// import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
// import { dateFormate } from '../../../../utils/dateFormator';

// // Adjust these import paths based on your project structure
// // import ImageGalleryExample from '../../../../components/ui/ImageGalleryExample'; 
// // import { dateFormate } from '../../../../utils/dateFormate'; 

// const categories = [
//     "hardware",
//     "electrical",
//     "plywood_timber",
//     "labour",
//     "logistics",
//     "soft_furnishings",
//     "other",
// ];


// const businessStructures = [
//     "proprietorship",
//     "partnership",
//     "private_limited",
//     "llp",
//     "individual",
// ];



// interface VendorFormProps {
//     mode: 'create' | 'view' | 'update';
//     initialData?: Vendor | null;
//     // Updated onSubmit to accept the mainImage file separately
//     onSubmit: (data: any, files?: File[], shopImages?: File[]) => Promise<void>;
//     isSubmitting: boolean;
// }

// const VendorAccountForm: React.FC<VendorFormProps> = ({
//     mode: initialMode,
//     initialData,
//     onSubmit,
//     isSubmitting,
// }) => {
//     const { organizationId } = useParams();
//     const navigate = useNavigate();

//     // --- State Management ---
//     const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);

//     // Main Image State
//     // const [mainImageFile, setMainImageFile] = useState<File | undefined>(undefined);
//     // const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
//     // const [isImageModalOpen, setIsImageModalOpen] = useState(false);



//     // Form Data State
//     const [formData, setFormData] = useState({
//         organizationId: organizationId,
//         // projectId: initialData?.projectId || null,
//         clientId: initialData?.clientId || null,
//         firstName: '', // lastName removed
//         vendorCategory: "",
//         shopDisplayName: "",
//         shopFullAddress: "",
//         companyName: '',
//         email: '',
//         phone: { work: '', mobile: '' },
//         language: 'English',
//         pan: "",
//         tan: "",
//         gstin: "",
//         msmeNo: "",
//         cin: "",
//         businessStructure: "",

//         bankAccNo: "",
//         accHolderName: "",
//         bankName: "",
//         upiId: "",
//         bankBranch: "",
//         ifscCode: "",

//         mapUrl: "",
//         // currency: 'INR - Indian Rupee',
//         openingBalance: 0,
//         paymentTerms: 'Due on Receipt',
//         location: {
//             latitude: 0,
//             longitude: 0
//         }
//     });

//     // --- Hooks ---
//     // const updateImageMutation = useUpdateVendorMainImage(); // NEW HOOK


//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [selectedShopImages, setSelectedShopImages] = useState<File[]>([]);
//     const [errors, setErrors] = useState<Record<string, string>>({});


//     // useEffect(() => {
//     //     const handleClose = (e: KeyboardEvent) => {
//     //         if (e.key === "Escape") {
//     //             setIsImageModalOpen(false);
//     //         }
//     //     };
//     //     // CHANGE 'keypress' TO 'keydown'
//     //     if (isImageModalOpen) {
//     //         document.addEventListener("keydown", handleClose);
//     //     }

//     //     return () => {
//     //         document.removeEventListener("keydown", handleClose);
//     //     };
//     // }, [isImageModalOpen]);


//     // --- Effects ---
//     // useEffect(() => {
//     //     if (initialData) {
//     //         setFormData({
//     //             organizationId: initialData.organizationId || organizationId,
//     //             // projectId: initialData.projectId || null,
//     //             clientId: initialData.clientId || null,
//     //             firstName: initialData.firstName || '',
//     //             companyName: initialData.companyName || '',
//     //             email: initialData.email || '',
//     //             phone: {
//     //                 work: initialData.phone?.work || '',
//     //                 mobile: initialData.phone?.mobile || ''
//     //             },
//     //             language: initialData.language || 'English',
//     //             pan: initialData.pan || '',
//     //             // currency: initialData.currency || 'INR - Indian Rupee',
//     //             openingBalance: initialData.openingBalance || 0,
//     //             paymentTerms: initialData.paymentTerms || 'Due on Receipt',
//     //             mapUrl: initialData?.mapUrl || "",
//     //             location: {
//     //                 latitude: initialData.location?.latitude ?? 0,
//     //                 longitude: initialData.location?.longitude ?? 0
//     //             }
//     //         });
//     //         // Set Main Image Preview if exists in backend data
//     //         // Assuming initialData.mainImage is a URL string
//     //         if ((initialData).mainImage) {
//     //             setMainImagePreview(initialData.mainImage.url);
//     //         }
//     //     }
//     // }, [initialData, organizationId]);

//     useEffect(() => {
//         if (initialData) {
//             setFormData(prev => ({
//                 ...prev,
//                 organizationId: initialData.organizationId || organizationId,
//                 clientId: initialData.clientId || null,
//                 firstName: initialData.firstName || '',
//                 companyName: initialData.companyName || '',
//                 email: initialData.email || '',
//                 phone: {
//                     work: initialData.phone?.work || '',
//                     mobile: initialData.phone?.mobile || ''
//                 },
//                 language: initialData.language || 'English',
//                 pan: initialData.pan || '',
//                 tan: initialData.tan || '',
//                 gstin: initialData.gstin || '',
//                 msmeNo: initialData.msmeNo || '',
//                 cin: initialData.cin || '',
//                 businessStructure: initialData.businessStructure || '',
//                 bankAccNo: initialData.bankAccNo || '',
//                 accHolderName: initialData.accHolderName || '',
//                 bankName: initialData.bankName || '',
//                 upiId: initialData.upiId || '',
//                 bankBranch: initialData.bankBranch || '',
//                 ifscCode: initialData.ifscCode || '',
//                 mapUrl: initialData.mapUrl || '',
//                 openingBalance: initialData.openingBalance || 0,
//                 paymentTerms: initialData.paymentTerms || 'Due on Receipt',
//                 location: {
//                     latitude: initialData.location?.latitude ?? 0,
//                     longitude: initialData.location?.longitude ?? 0
//                 }
//             }));

//             // // Set main image preview if it exists
//             // if (initialData.mainImage) {
//             //     setMainImagePreview(initialData.mainImage.url);
//             // }
//         }
//     }, [initialData, organizationId]);


//     // Cleanup object URL to prevent memory leaks
//     // useEffect(() => {
//     //     return () => {
//     //         if (mainImagePreview && !mainImagePreview.startsWith('http')) {
//     //             URL.revokeObjectURL(mainImagePreview);
//     //         }
//     //     };
//     // }, [mainImagePreview]);

//     const isReadOnly = currentMode === 'view';

//     // --- Handlers ---

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             phone: { ...prev.phone, [type]: value }
//         }));
//     };

//     const handleLocationChange = (value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             mapUrl: value
//         }));
//     };


//     // Documents Handler
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) setSelectedFiles(Array.from(e.target.files));
//     };

//     const removeFile = (index: number) => {
//         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     };


//     const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) setSelectedShopImages(Array.from(e.target.files));
//     };

//     const removeShopImages = (index: number) => {
//         setSelectedShopImages(prev => prev.filter((_, i) => i !== index));
//     };

//     // // Main Image Handler
//     // const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     if (e.target.files && e.target.files[0]) {
//     //         const file = e.target.files[0];

//     //         // console.log("111111")
//     //         // Scenario A: Create Mode -> Just set local state, upload later on Submit
//     //         if (currentMode === 'create') {
//     //             // console.log("2222222222")

//     //             setMainImageFile(file);
//     //             setMainImagePreview(URL.createObjectURL(file));
//     //         }
//     //         // Scenario B: View/Update Mode -> Upload Immediately via separate API
//     //         else {
//     //             if (initialData?._id) {
//     //                 try {
//     //                     // Optimistic preview update
//     //                     setMainImagePreview(URL.createObjectURL(file));

//     //                     // console.log("3333333333")

//     //                     // Call the mutation
//     //                     await updateImageMutation.mutateAsync({
//     //                         vendorId: initialData._id,
//     //                         file: file
//     //                     });
//     //                     // Optional: Toast success
//     //                     toast({ title: "Successfull", description: "vendor Image updated successfully" });
//     //                 } catch (error) {
//     //                     console.error("Failed to update image", error);
//     //                     // Revert preview if failed (optional logic)
//     //                 }
//     //             }
//     //         }
//     //     }
//     // }



//     const handleEditClick = () => setCurrentMode('update');

//     const handleCancelClick = () => {
//         if (currentMode === 'create') navigate(-1);
//         else {
//             setCurrentMode('view');
//             setSelectedFiles([]);
//             // setMainImageFile(undefined);
//             // setMainImagePreview((initialData as any)?.mainImage || null);
//         }
//     };

//     const validateForm = (): boolean => {
//         const newErrors: Record<string, string> = {};
//         if (!formData.firstName?.trim()) newErrors.firstName = 'First name / Shop Name is required';
//         if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

//         if (formData.phone.mobile) {
//             const val = formData.phone.mobile.replace(/[\s-()]/g, '');
//             if (!/^[0-9]{10}$/.test(val)) newErrors['phone.mobile'] = 'Must be 10 digits';
//         }

//         if (formData?.mapUrl) {
//             const googleMapsRegex = /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/;
//             if (!googleMapsRegex.test(formData.mapUrl)) {
//                 newErrors['location.mapUrl'] = 'Invalid Google Maps link';
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         try {
//             // Pass formData, documents array, and the specific mainImage file
//             if (currentMode === 'create') {
//                 await onSubmit(formData as CreateVendorPayload, selectedFiles, selectedShopImages);
//             } else {
//                 await onSubmit(formData as UpdateVendorPayload, selectedFiles, selectedShopImages);
//                 setCurrentMode('view');
//                 setSelectedFiles([]);
//                 // setMainImageFile(undefined);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // Filter existing documents
//     const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
//     const existingShopImages = initialData?.shopImages?.filter((f: any) => f.type === 'image') || [];
//     const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];

//     return (
//         <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10">
//             {/* --- Header --- */}
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
//                             {currentMode === 'create' ? 'Create Vendor' : currentMode === 'update' ? 'Update Vendor' : 'Vendor Details'}
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

//             {/* --- MAIN IMAGE / SHOP PROFILE SECTION --- */}
//             {/* <div className="flex justify-center mb-8">
//                 <div className="relative group">

//                     <div
//                         className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative 
//             ${mainImagePreview ? 'cursor-pointer hover:opacity-90' : ''}`} // Add cursor pointer if image exists
//                         onClick={() => {
//                             // Only open if there is an image to show
//                             if (mainImagePreview) setIsImageModalOpen(true);
//                         }}
//                     >

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

//             {isImageModalOpen && mainImagePreview && (
//                 <div
//                     className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
//                     onClick={() => setIsImageModalOpen(false)} // Close when clicking background
//                 >
//                     <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center">

//                         <button
//                             onClick={() => setIsImageModalOpen(false)}
//                             className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl transition-colors"
//                         >
//                             <i className="fas fa-times"></i>
//                         </button>

//                         <img
//                             src={mainImagePreview}
//                             alt="Shop Full View"
//                             className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-700"
//                             onClick={(e) => e.stopPropagation()} 
//                         />
//                     </div>
//                 </div>
//             )} 

//             */}


//             <Card className="p-6">
//                 <div className="space-y-8">

//                     {/* --- Section 1: Basic Details --- */}
//                     <section>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                             <i className="fas fa-info-circle mr-2 text-blue-500"></i> Basic Information
//                         </h3>

//                         {/* left side */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name / First Name <span className="text-red-500">*</span></label>
//                                 <input
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                                 {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
//                                 <input
//                                     name="companyName"
//                                     value={formData.companyName}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Company Name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">shopDisplayName</label>
//                                 <input
//                                     name="shopDisplayName"
//                                     value={formData.shopDisplayName}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Shop Name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Category</label>


//                                 <select
//                                     name="vendorCategory"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"

//                                     value={formData.vendorCategory}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="">Select Category...</option>
//                                     {categories.map((cat) => (
//                                         <option key={cat} value={cat}>
//                                             {cat
//                                                 .split("_")
//                                                 .map((word) => word[0].toUpperCase() + word.slice(1))
//                                                 .join(" ")}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>








//                         </div>


//                         {/*  right side  */}
//                         <section>

//                             {/* --- Section 3: Documents Display --- */}
//                             {existingShopImages.length > 0 && (
//                                 <section>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                         <i className="fas fa-folder-open mr-2 text-blue-500"></i> Documents
//                                     </h3>

//                                     {/* Images Gallery */}
//                                     {existingShopImages.length > 0 && (
//                                         <div className="mb-6">
//                                             <div className="flex items-center gap-2 mb-3">
//                                                 <i className="fas fa-images text-purple-600"></i>
//                                                 <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
//                                                 <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
//                                                     {existingShopImages.length}
//                                                 </span>
//                                             </div>
//                                             <ImageGalleryExample
//                                                 imageFiles={existingShopImages}
//                                                 height={150}
//                                                 minWidth={150}
//                                                 maxWidth={200}
//                                             />
//                                         </div>
//                                     )}
//                                 </section>
//                             )}

//                             {/* --- Section 4: Upload New Documents (Edit/Create Mode) --- */}
//                             {!isReadOnly && (
//                                 <section>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                         <i className="fas fa-cloud-upload-alt mr-2 text-blue-500"></i>
//                                         {currentMode === 'create' ? 'Upload shopImages' : 'Add New shop Images'}
//                                     </h3>

//                                     <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center">
//                                         <input
//                                             type="file"
//                                             multiple
//                                             accept="image/*"
//                                             onChange={handleShopImageChange}
//                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                                         />
//                                         <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
//                                         <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
//                                         <p className="text-xs text-gray-500">PNG, JPG</p>
//                                     </div>

//                                     {/* New Files Preview */}
//                                     {selectedShopImages.length > 0 && (
//                                         <div className="mt-4 space-y-2">
//                                             {selectedShopImages.map((file, index) => (
//                                                 <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
//                                                     <div className="flex items-center gap-2">
//                                                         <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'}`}></i>
//                                                         <span className="text-sm text-gray-700">{file.name}</span>
//                                                         <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                                                     </div>
//                                                     <button type="button" onClick={() => removeShopImages(index)} className="text-red-500 hover:text-red-700 px-2">
//                                                         <i className="fas fa-times"></i>
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </section>
//                             )}

//                         </section>


//                     </section>


//                     <section>

//                         <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                             <i className="fas fa-coins mr-2 text-blue-500"></i> Contact and Location
//                         </h3>

//                         {/* left side */}

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">



//                             <div className="col-span-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Shop full address</label>
//                                 <textarea
//                                     name="shopFullAddress"
//                                     value={formData.shopFullAddress}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter the full address of shop"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div className="col-span-1">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="email@example.com"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                                 <input
//                                     value={formData.phone.mobile}
//                                     onChange={(e) => handlePhoneChange('mobile', e.target.value)}
//                                     disabled={isReadOnly}
//                                     maxLength={10}
//                                     placeholder="10 digit mobile"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                                 {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
//                                 <input
//                                     value={formData.phone.work}
//                                     onChange={(e) => handlePhoneChange('work', e.target.value)}
//                                     disabled={isReadOnly}
//                                     maxLength={11} //to support the landline numebr also 
//                                     placeholder="Work/Landline"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />

//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Map Location (Link)
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             value={formData?.mapUrl || ''}
//                                             onChange={(e) => handleLocationChange(e.target.value)}
//                                             disabled={isReadOnly}
//                                             placeholder="https://maps.app.goo.gl/..."
//                                             className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none disabled:bg-gray-50 ${errors['location.mapUrl'] ? 'border-red-500' : 'border-gray-300'}`}
//                                         />
//                                         <i className="fas fa-map-pin absolute left-3 top-3 text-gray-400"></i>
//                                         {formData?.mapUrl && (
//                                             <a href={formData.mapUrl} target="_blank" rel="noreferrer" className="absolute right-2 top-2 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100">
//                                                 Open
//                                             </a>
//                                         )}
//                                     </div>
//                                     {errors['location.mapUrl'] && <p className="text-red-500 text-xs mt-1">{errors['location.mapUrl']}</p>}
//                                 </div>
//                             </div>




//                         </div>

// {/* righ side */}
//                         {/* map should be displayed here */}
//                         <section>
//                             {/* map to be dislayed fromthe link */}
//                         </section>
//                     </section>

//                     {/* --- Section 2: Financial & Location --- */}
//                     <section>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                             <i className="fas fa-coins mr-2 text-blue-500"></i> Tax and Satatutory Details
//                         </h3>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN Number</label>
//                                 <input
//                                     name="gstin"
//                                     value={formData.gstin}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="ABCDE1234F"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
//                                 <input
//                                     name="pan"
//                                     value={formData.pan}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="ABCDE1234F"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">TAN Number</label>
//                                 <input
//                                     name="tan"
//                                     value={formData.tan}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="ABCDE12345E"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">MSME Reg. No
//                                 </label>
//                                 <input
//                                     name="pan"
//                                     value={formData.msmeNo}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="ABCDE1234F"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     CIN (If Pvt Ltd)
//                                 </label>
//                                 <input
//                                     name="cin"
//                                     value={formData.cin}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="U12345MH2023PTC..."
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>


//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Business Structure</label>
//                                 <select
//                                     name="businessStructure"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"

//                                     value={formData.businessStructure}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="">Select Business Structure...</option>
//                                     {businessStructures.map((structure) => (
//                                         <option key={structure} value={structure}>
//                                             {structure
//                                                 .split("_")
//                                                 .map((word) => word[0].toUpperCase() + word.slice(1))
//                                                 .join(" ")}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>



//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">


//                             {/* Bank Account Number */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
//                                 <input
//                                     name="bankAccNo"
//                                     value={formData.bankAccNo}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Bank Account Number"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             {/* Account Holder Name */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
//                                 <input
//                                     name="accHolderName"
//                                     value={formData.accHolderName}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Account Holder Name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             {/* Bank Name */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
//                                 <input
//                                     name="bankName"
//                                     value={formData.bankName}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Bank Name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             {/* UPI ID */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
//                                 <input
//                                     name="upiId"
//                                     value={formData.upiId}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter UPI ID"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             {/* Bank Branch */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Bank Branch</label>
//                                 <input
//                                     name="bankBranch"
//                                     value={formData.bankBranch}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter Bank Branch"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>

//                             {/* IFSC Code */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
//                                 <input
//                                     name="ifscCode"
//                                     value={formData.ifscCode}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     placeholder="Enter IFSC Code"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>


//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
//                                 <select
//                                     name="paymentTerms"
//                                     value={formData.paymentTerms}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
//                                 >
//                                     {['Due on Receipt', 'Net 7 days', 'Net 15 days', 'Net 30 days', '50% Advance'].map(t => <option key={t} value={t}>{t}</option>)}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
//                                 <input
//                                     type="number"
//                                     name="openingBalance"
//                                     value={formData.openingBalance}
//                                     onChange={handleInputChange}
//                                     disabled={isReadOnly}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 disabled:bg-gray-50"
//                                 />
//                             </div>
//                         </div>


//                     </section>

//                     {/* --- Section 3: Documents Display --- */}
//                     {(existingImages.length > 0 || existingPdfs.length > 0) && (
//                         <section>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                 <i className="fas fa-folder-open mr-2 text-blue-500"></i> Documents
//                             </h3>

//                             {/* Images Gallery */}
//                             {existingImages.length > 0 && (
//                                 <div className="mb-6">
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <i className="fas fa-images text-purple-600"></i>
//                                         <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
//                                         <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
//                                             {existingImages.length}
//                                         </span>
//                                     </div>
//                                     <ImageGalleryExample
//                                         imageFiles={existingImages}
//                                         height={150}
//                                         minWidth={150}
//                                         maxWidth={200}
//                                     />
//                                 </div>
//                             )}

//                             {/* PDFs List */}
//                             {existingPdfs.length > 0 && (
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <i className="fas fa-file-pdf text-red-600"></i>
//                                         <h4 className="font-semibold text-gray-800 text-sm">PDF Documents</h4>
//                                         <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
//                                             {existingPdfs.length}
//                                         </span>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                         {existingPdfs.map((file: any, i: number) => (
//                                             <div
//                                                 key={i}
//                                                 className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all group"
//                                             >
//                                                 <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xl">
//                                                     <i className="fas fa-file-pdf"></i>
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-sm font-semibold text-gray-900 truncate">
//                                                         {file.originalName || `Document ${i + 1}.pdf`}
//                                                     </p>
//                                                     <p className="text-xs text-gray-500 mt-1">
//                                                         <i className="far fa-calendar mr-1"></i>
//                                                         {dateFormate(file.uploadedAt)}
//                                                     </p>
//                                                 </div>
//                                                 <a
//                                                     href={file.url}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm shadow-sm group-hover:shadow-md"
//                                                 >
//                                                     Open
//                                                 </a>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </section>
//                     )}

//                     {/* --- Section 4: Upload New Documents (Edit/Create Mode) --- */}
//                     {!isReadOnly && (
//                         <section>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
//                                 <i className="fas fa-cloud-upload-alt mr-2 text-blue-500"></i>
//                                 {currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'}
//                             </h3>

//                             <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center">
//                                 <input
//                                     type="file"
//                                     multiple
//                                     accept="image/*,.pdf"
//                                     onChange={handleFileChange}
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                                 />
//                                 <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
//                                 <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
//                                 <p className="text-xs text-gray-500">PDF, PNG, JPG</p>
//                             </div>

//                             {/* New Files Preview */}
//                             {selectedFiles.length > 0 && (
//                                 <div className="mt-4 space-y-2">
//                                     {selectedFiles.map((file, index) => (
//                                         <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
//                                             <div className="flex items-center gap-2">
//                                                 <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'}`}></i>
//                                                 <span className="text-sm text-gray-700">{file.name}</span>
//                                                 <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                                             </div>
//                                             <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 px-2">
//                                                 <i className="fas fa-times"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </section>
//                     )}

//                     {/* --- Footer Buttons --- */}
//                     {!isReadOnly && (
//                         <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end gap-4">
//                             <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isSubmitting}>
//                                 Cancel
//                             </Button>
//                             <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white min-w-[120px]">
//                                 {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i> Save Details</>}
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default VendorAccountForm;

//  THIRD VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { type CreateVendorPayload, type UpdateVendorPayload, type Vendor } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
import ImageGalleryExample from '../../../../shared/ImageGallery/ImageGalleryMain';
import { dateFormate } from '../../../../utils/dateFormator';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';

// --- UI Helpers ---
const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
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

// --- Constants ---
const CATEGORIES = ["electronics", "hardware", "services", "consumables", "furniture", "others"];
const BUSINESS_STRUCTURES = ["proprietorship", "partnership", "private_limited", "llp", "individual"];

interface VendorFormProps {
    mode: 'create' | 'view';
    initialData?: Vendor;
    onSubmit: (data: any, documents?: File[], shopImages?: File[]) => Promise<void>;
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

    
        const { role, permission } = useAuthCheck();
        // const canList = role === "owner" || permission?.vendor?.list;
        // const canCreate = role === "owner" || permission?.vendor?.create
        const canEdit = role === "owner" || permission?.vendor?.edit
        // const canDelete = role === "owner" || permission?.vendor?.delete
    

    // --- State ---
    const [currentMode, setCurrentMode] = useState<'create' | 'view' | 'update'>(initialMode);
    const isReadOnly = currentMode === 'view';

    const [formData, setFormData] = useState({
        organizationId: organizationId,
        clientId: initialData?.clientId || null,
        firstName: '',
        companyName: '',
        shopDisplayName: "",
        vendorCategory: "",
        shopFullAddress: "",
        email: '',
        phone: { work: '', mobile: '' },
        language: 'English',
        pan: "",
        tan: "",
        gstin: "",
        msmeNo: "",
        cin: "",
        businessStructure: "",
        bankAccNo: "",
        accHolderName: "",
        bankName: "",
        upiId: "",
        bankBranch: "",
        ifscCode: "",
        mapUrl: "",
        openingBalance: 0,
        paymentTerms: 'Due on Receipt',
        location: { latitude: 0, longitude: 0 }
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedShopImages, setSelectedShopImages] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Effects ---
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                organizationId: initialData.organizationId || organizationId,
                clientId: initialData.clientId || null,
                firstName: initialData.firstName || '',
                companyName: initialData.companyName || '',
                shopDisplayName: initialData.shopDisplayName || '',
                vendorCategory: initialData.vendorCategory || '',
                shopFullAddress: initialData.shopFullAddress || '',
                email: initialData.email || '',
                phone: {
                    work: initialData.phone?.work || '',
                    mobile: initialData.phone?.mobile || ''
                },
                language: initialData.language || 'English',
                pan: initialData.pan || '',
                tan: initialData.tan || '',
                gstin: initialData.gstin || '',
                msmeNo: initialData.msmeNo || '',
                cin: initialData.cin || '',
                businessStructure: initialData.businessStructure || '',
                bankAccNo: initialData.bankAccNo || '',
                accHolderName: initialData.accHolderName || '',
                bankName: initialData.bankName || '',
                upiId: initialData.upiId || '',
                bankBranch: initialData.bankBranch || '',
                ifscCode: initialData.ifscCode || '',
                mapUrl: initialData.mapUrl || '',
                openingBalance: initialData.openingBalance || 0,
                paymentTerms: initialData.paymentTerms || 'Due on Receipt',
                location: {
                    latitude: initialData?.location?.latitude || 0,
                    longitude: initialData?.location?.longitude || 0
                }
            }));
        }
    }, [initialData, organizationId]);

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (type: 'mobile' | 'work', value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({ ...prev, phone: { ...prev.phone, [type]: cleanValue } }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedShopImages(Array.from(e.target.files));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName?.trim()) newErrors.firstName = 'Vendor name is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (formData.phone.mobile && formData.phone.mobile.length !== 10) newErrors['phone.mobile'] = 'Must be 10 digits';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (currentMode === 'create') {
            await onSubmit(formData as CreateVendorPayload, selectedFiles, selectedShopImages);
        } else {
            await onSubmit(formData as UpdateVendorPayload, selectedFiles, selectedShopImages);
            setCurrentMode('view');
            setSelectedFiles([]);
            setSelectedShopImages([]);
        }
    };

    // --- Derived Data ---
    const existingImages = initialData?.documents?.filter((f: any) => f.type === 'image') || [];
    const existingPdfs = initialData?.documents?.filter((f: any) => f.type === 'pdf') || [];

    // Combine existing shop images with newly selected ones (as preview URLs) for the Gallery
    const combinedShopImages = [
        ...(initialData?.shopImages?.filter((f: any) => f.type === 'image') || []),
        ...selectedShopImages.map(file => ({
            type: 'image',
            url: URL.createObjectURL(file),
            originalName: file.name
        }))
    ];

    const getMapSrc = () => {
        if (formData.location.latitude && formData.location.longitude) {
            return `https://maps.google.com/maps?q=${formData.location.latitude},${formData.location.longitude}&hl=en&z=14&output=embed`;
        }
        return null;
    };

    return (
        <div className="max-w-full overflow-y-auto mx-auto h-full flex flex-col pb-10 font-sans">
            {/* --- Header --- */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className='bg-white hover:bg-gray-50 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full shadow-sm transition-colors'>
                        <i className="fas fa-arrow-left text-gray-600"></i>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">
                            <i className={`fas ${currentMode === 'create' ? 'fa-plus' : 'fa-store'}`}></i>
                        </span>
                        {currentMode === 'create' ? 'Create Vendor' : 'Vendor Details'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {(currentMode === 'view' && canEdit) && (
                        <Button onClick={() => setCurrentMode('update')} className="bg-blue-600 text-white shadow-sm">
                            <i className="fas fa-edit mr-2"></i> Edit Details
                        </Button>
                    )}
                    {currentMode === 'update' && (
                        <Button onClick={() => { setCurrentMode('view'); setSelectedShopImages([]); setSelectedFiles([]); }} variant="outline" className="bg-white">
                            Cancel Edit
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white hover:bg-green-700">
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i> Save Changes</>}
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-6 shadow-sm border border-gray-100">
                <div className="space-y-8">

                    {/* --- SECTION 1: Basic Info & Shop Images --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left: Form Inputs (60%) */}
                        <div className="lg:col-span-6 space-y-6">
                            <SectionHeader icon="fa-info-circle" title="Basic Information" />

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                                {/* Row 1: Vendor Name & Company Name */}
                                <div>
                                    <InputLabel required>Vendor Name</InputLabel>
                                    <ModernInput
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="E.g. John Doe"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <InputLabel>Company Name</InputLabel>
                                    <ModernInput
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Legal Company Name"
                                    />
                                </div>

                                {/* Row 2: Shop Name & Category */}
                                <div>
                                    <InputLabel>Shop / Display Name</InputLabel>
                                    <ModernInput
                                        name="shopDisplayName"
                                        value={formData.shopDisplayName}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        placeholder="Name on Board"
                                    />
                                </div>
                                <div>
                                    <InputLabel>Vendor Category</InputLabel>
                                    <ModernSelect
                                        name="vendorCategory"
                                        value={formData.vendorCategory}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Select Category...</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </ModernSelect>
                                </div>
                            </div>
                        </div>

                        {/* Right: Shop Images (40%) */}
                        <div className="lg:col-span-6 flex flex-col">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                                    <i className="fas fa-images text-blue-500"></i> Shop Images
                                </h3>
                                {!isReadOnly && (
                                    <div className="relative">
                                        <label className="cursor-pointer inline-flex items-center px-3 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors">
                                            <i className="fas fa-plus mr-1.5"></i> Add Image
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleShopImageChange}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 rounded-lg border
                             border-gray-200  flex flex-col items-center  min-h-[170px]">
                                {combinedShopImages.length > 0 ? (
                                    <div className="w-full max-h-[280px] overflow-y-auto">

                                        <ImageGalleryExample
                                            imageFiles={combinedShopImages}
                                            height={150}
                                            minWidth={150}
                                            maxWidth={200}
                                            className='!p-0 !py-0'
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <i className="fas fa-store-alt text-4xl mb-2 opacity-20"></i>
                                        <p className="text-xs">No shop images uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 2: Contact & Location --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Contact Inputs (60%) */}
                        <div className="lg:col-span-6 space-y-6">
                            <SectionHeader icon="fa-map-marker-alt" title="Contact & Location" />

                            <div>
                                <InputLabel>Shop Full Address</InputLabel>
                                <textarea
                                    name="shopFullAddress"
                                    value={formData.shopFullAddress}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    rows={2}
                                    placeholder="Enter full address including pincode"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 bg-white disabled:bg-gray-50 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
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
                                <div>
                                    <InputLabel>Google Map Link</InputLabel>
                                    <div className="relative">
                                        <ModernInput
                                            value={formData.mapUrl || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                                            disabled={isReadOnly}
                                            placeholder="https://maps.app.goo.gl..."
                                            className="pr-16" // space for button
                                        />
                                        {formData.mapUrl && (
                                            <a
                                                href={formData.mapUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute right-1 top-1 bottom-1 px-2 flex items-center text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                            >
                                                Open
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel>Mobile Number</InputLabel>
                                    <ModernInput
                                        value={formData.phone.mobile}
                                        onChange={(e) => handlePhoneChange('mobile', e.target.value)}
                                        disabled={isReadOnly}
                                        maxLength={10}
                                        placeholder="10 Digit Mobile"
                                    />
                                    {errors['phone.mobile'] && <p className="text-red-500 text-xs mt-1">{errors['phone.mobile']}</p>}
                                </div>
                                <div>
                                    <InputLabel>Work / Landline</InputLabel>
                                    <ModernInput
                                        value={formData.phone.work}
                                        onChange={(e) => handlePhoneChange('work', e.target.value)}
                                        disabled={isReadOnly}
                                        maxLength={12}
                                        placeholder="STD + Number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Map Preview (40%) */}
                        <div className="lg:col-span-6 flex flex-col">
                            <div className="flex items-center mb-4 pb-2 border-b border-gray-100 h-[38px]"> {/* Height matched with header */}
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Map Preview</h3>
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative min-h-[200px]">
                                {getMapSrc() ? (
                                    <iframe
                                        title="map"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        src={getMapSrc()!}
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <i className="fas fa-map-marked-alt text-4xl mb-2 opacity-20"></i>
                                        <p className="text-xs text-center px-6">
                                            {formData.mapUrl ? "Save to generate preview" : "Paste Map URL to see preview"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 3: Tax & Statutory (Dense Grid) --- */}
                    <div>
                        <SectionHeader icon="fa-file-invoice" title="Tax & Statutory Details" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <InputLabel>GSTIN</InputLabel>
                                <ModernInput name="gstin" value={formData.gstin} onChange={handleInputChange} disabled={isReadOnly} placeholder="GSTIN" className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>PAN Number</InputLabel>
                                <ModernInput name="pan" value={formData.pan} onChange={handleInputChange} disabled={isReadOnly} placeholder="PAN" className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>TAN Number</InputLabel>
                                <ModernInput name="tan" value={formData.tan} onChange={handleInputChange} disabled={isReadOnly} placeholder="TAN" className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>MSME No</InputLabel>
                                <ModernInput name="msmeNo" value={formData.msmeNo} onChange={handleInputChange} disabled={isReadOnly} placeholder="Udyam" />
                            </div>
                            <div>
                                <InputLabel>CIN (Pvt Ltd)</InputLabel>
                                <ModernInput name="cin" value={formData.cin} onChange={handleInputChange} disabled={isReadOnly} placeholder="CIN" />
                            </div>
                            <div>
                                <InputLabel>Business Structure</InputLabel>
                                <ModernSelect name="businessStructure" value={formData.businessStructure} onChange={handleInputChange} disabled={isReadOnly}>
                                    <option value="">Select...</option>
                                    {BUSINESS_STRUCTURES.map(s => (
                                        <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>
                                    ))}
                                </ModernSelect>
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 4: Banking (Dense Grid) --- */}
                    {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"> */}
                    <div>
                        <SectionHeader icon="fa-university" title="Banking & Financials" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                                <InputLabel>Bank Name</InputLabel>
                                <ModernInput name="bankName" value={formData.bankName} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <InputLabel>Account Holder</InputLabel>
                                <ModernInput name="accHolderName" value={formData.accHolderName} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>Account Number</InputLabel>
                                <ModernInput name="bankAccNo" value={formData.bankAccNo} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>IFSC Code</InputLabel>
                                <ModernInput name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={isReadOnly} className="uppercase" />
                            </div>
                            <div>
                                <InputLabel>Branch</InputLabel>
                                <ModernInput name="bankBranch" value={formData.bankBranch} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>UPI ID</InputLabel>
                                <ModernInput name="upiId" value={formData.upiId} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                            <div>
                                <InputLabel>Payment Terms</InputLabel>
                                <ModernSelect name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} disabled={isReadOnly}>
                                    {['Due on Receipt', 'Net 7 days', 'Net 15 days', 'Net 30 days', '50% Advance'].map(t => <option key={t} value={t}>{t}</option>)}
                                </ModernSelect>
                            </div>
                            <div>
                                <InputLabel>Opening Balance</InputLabel>
                                <ModernInput type="number" name="openingBalance" value={formData.openingBalance} onChange={handleInputChange} disabled={isReadOnly} />
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 5: Documents (User's Exact UI Logic) --- */}
                    {(existingImages.length > 0 || existingPdfs.length > 0) && (
                        <section>
                            <SectionHeader icon="fa-folder-open" title="Attached Documents" />

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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {existingPdfs.map((file: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100 hover:shadow-sm transition-all">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 text-lg border border-red-100">
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
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                                    Open
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Upload New Documents */}
                    {!isReadOnly && (
                        <section>
                            <SectionHeader icon="fa-cloud-upload-alt" title={currentMode === 'create' ? 'Upload Documents' : 'Add New Documents'} />

                            <div className="relative w-full h-28 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-2"></i>
                                <p className="text-sm text-gray-600 font-medium">Click to upload files</p>
                                <p className="text-[10px] text-gray-400">PDF, PNG, JPG</p>
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

                </div>
            </Card>
        </div>
    );
};

export default VendorAccountForm;