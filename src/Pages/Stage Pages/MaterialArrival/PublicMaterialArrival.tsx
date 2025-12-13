// import { useState } from "react"
// import { useParams } from "react-router-dom"
// import { Input } from "../../../components/ui/Input"
// import { Button } from "../../../components/ui/Button"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select"
// import { toast } from "../../../utils/toast"
// import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants"
// import {
//   useGetPublicMaterialArrivalNew,
//   useUpdateMaterialArrivalItemNew,
// } from "../../../apiList/Stage Api/materialArrivalNewApi"

// const PublicMaterialArrival = () => {
//   const { projectId, token } = useParams()
//   // here the data is the materialArrivalList , you dot have to extrac seperatly
//   const { data, isLoading, isError, refetch } = useGetPublicMaterialArrivalNew(projectId!, token!)
//   const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew()

//   const [quantities, setQuantities] = useState<Record<string, number>>({})
//   const [images, setImages] = useState<Record<string, File | null>>({})
//   const [showImageModal, setShowImageModal] = useState<string | null>(null)

//   const handleQuantityChange = (id: string, value: number) => {
//     setQuantities((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleFileChange = (id: string, file: File | null) => {
//     setImages((prev) => ({ ...prev, [id]: file }))
//   }

//   const handleUpdate = async (fieldId: string) => {
//     const quantity = quantities[fieldId]
//     const image = images[fieldId]
//     const formData = new FormData()
//     if (quantity !== undefined) {
//       formData.append("quantity", String(quantity));
//     }
//     // formData.append("quantity", String(quantity ?? 0))
//     if (image) formData.append("upload", image)

//     try {
//       await updateItem({ projectId: projectId!, fieldId, formData })
//       toast({ title: "Success", description: "Updated successfully" })
//       // Clear the form after successful update
//       refetch()
//       setQuantities(() => ({}))
//       setImages((prev) => ({ ...prev, [fieldId]: null }))
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error.message || "Failed to update",
//         variant: "destructive",
//       })
//     }
//   }

//   // Calculate statistics
//   const totalMaterials = data?.materialArrivalList?.length || 0
//   const updatedMaterials =
//     data?.materialArrivalList?.filter((item: any) => item.quantity > 0 || item.image)?.length || 0
//   const pendingMaterials = totalMaterials - updatedMaterials
//   const completionProgress = totalMaterials > 0 ? Math.round((updatedMaterials / totalMaterials) * 100) : 0

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto mb-6"></div>
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold text-gray-800">Loading Material Data</h3>
//             <p className="text-gray-600">Please wait while we fetch your materials...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
//         <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md mx-4">
//           <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
//             <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500"></i>
//           </div>
//           <h2 className="text-2xl font-bold text-red-600 mb-3">Connection Failed</h2>
//           <p className="text-gray-600 mb-4">
//             Unable to load material data. Please check your connection and try again.
//           </p>
//           <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
//             <i className="fa-solid fa-refresh mr-2"></i>
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
//       {/* Header Section */}
//       <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-4">
//             {/* Company Branding */}
//             <div className="flex items-center gap-4">
//               <div className="flex-shrink-0">
//                 <img
//                   src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
//                   alt={`${COMPANY_DETAILS.COMPANY_NAME} Logo`}
//                   className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
//                 />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
//                   {COMPANY_DETAILS.COMPANY_NAME}
//                 </h1>
//                 <p className="text-sm sm:text-base text-gray-600 truncate">Material Arrival Portal</p>
//               </div>
//             </div>

//             {/* Status Badge */}
//             <div className="flex-shrink-0">
//               <div className="bg-gradient-to-r from-slate-600 to-gray-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
//                 <i className="fa-solid fa-clipboard-check mr-2"></i>
//                 <span className="hidden sm:inline">Material Update Portal</span>
//                 <span className="sm:hidden">Portal</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {/* Stats Dashboard */}
//         {totalMaterials > 0 && (
//           <div className="mb-8">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-6 text-white">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold">Material Overview</h2>
//                     <p className="text-gray-300 text-sm mt-1">Track your material update progress</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-3xl font-bold">{totalMaterials}</div>
//                     <div className="text-gray-300 text-sm">Total Items</div>
//                   </div>
//                 </div>

//                 {/* Progress Stats */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//                   <div className=" bg-slate-600 bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-emerald-500 bg-opacity-30 rounded-full flex items-center justify-center">
//                         <i className="fa-solid fa-check text-emerald-300 text-xl"></i>
//                       </div>
//                       <div>
//                         <div className="text-2xl font-bold text-white">{updatedMaterials}</div>
//                         <div className="text-gray-300 text-sm">Updated</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className=" bg-slate-600 bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-amber-500 bg-opacity-30 rounded-full flex items-center justify-center">
//                         <i className="fa-solid fa-clock text-amber-300 text-xl"></i>
//                       </div>
//                       <div>
//                         <div className="text-2xl font-bold text-white">{pendingMaterials}</div>
//                         <div className="text-gray-300 text-sm">Pending</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className=" bg-slate-600 bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center">
//                         <i className="fa-solid fa-chart-line text-indigo-300 text-xl"></i>
//                       </div>
//                       <div>
//                         <div className="text-2xl font-bold text-white">{completionProgress}%</div>
//                         <div className="text-gray-300 text-sm">Complete</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Progress Bar */}
//                 <div>
//                   <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
//                     <span>Update Progress</span>
//                     <span>{completionProgress}% Complete</span>
//                   </div>
//                   <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
//                     <div
//                       className="bg-emerald-400 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
//                       style={{ width: `${completionProgress}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Material List */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
//           {/* Table Header */}
//           <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <i className="fa-solid fa-list-check text-slate-600"></i>
//                   Material Update List
//                 </h3>
//                 <p className="text-gray-600 text-sm mt-1">Update quantities and upload images for verification</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-gray-500">
//                   <span className="font-medium">{totalMaterials}</span> items total
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Responsive Table Container */}
//           <div className="overflow-x-auto">
//             <div className="min-w-[900px]">
//               {/* Column Headers */}
//               <div className="bg-slate-100 border-b border-gray-200">
//                 <div className="grid grid-cols-5 gap-4 px-6 py-4 font-semibold text-slate-700 text-sm">
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-hashtag text-slate-500"></i>
//                     <span>Item ID</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-calculator text-slate-500"></i>
//                     <span>Quantity</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-image text-slate-500"></i>
//                     <span>Image Upload</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-shield-check text-slate-500"></i>
//                     <span>Status</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-save text-slate-500"></i>
//                     <span>Action</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Data Rows */}
//               {data?.materialArrivalList?.map((item: any, index: number) => (
//                 <div
//                   key={item._id}
//                   className={`grid grid-cols-5 gap-4 px-6 py-6 border-b border-gray-100 hover:bg-slate-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"
//                     }`}
//                 >
//                   {/* Custom ID */}
//                   <div className="flex items-center">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-bold shadow-sm">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <span className="font-semibold text-gray-900 block">{item.unitName || "N/A"}</span>
//                         <span className="text-xs text-gray-500">Item #{index + 1}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Quantity Dropdown */}
//                   <div className="flex items-center">
//                     <div className="w-full max-w-[140px] ">
//                       <Select onValueChange={(value) => handleQuantityChange(item._id, Number(value))}>
//                         <SelectTrigger className="w-full border-2 border-gray-200 hover:border-slate-400 focus:border-slate-600 transition-colors">
//                           <SelectValue placeholder={`Current: ${item.quantity || 0}`} selectedValue={quantities[item._id] ? String(quantities[item._id]) : ""} />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-48 overflow-y-auto custom-scrollbar">
//                           {[...Array(21).keys()].map((val) => (
//                             <SelectItem key={val} value={val.toString()}>
//                               {val} {val === 1 ? "item" : "items"}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       {/* {quantities[item._id] !== undefined && (
//                         <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
//                           <i className="fa-solid fa-arrow-right"></i>
//                           New: {quantities[item._id]}
//                         </p>
//                       )} */}
//                     </div>
//                   </div>

//                   {/* Image Field */}
//                   <div className="flex items-center gap-3">
//                     {/* Current Image Preview */}
//                     {item?.image?.url && (
//                       <div
//                         className="relative group cursor-pointer flex-shrink-0"
//                         onClick={() => setShowImageModal(item._id)}
//                       >
//                         <div className="w-16 h-16 border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
//                           <img
//                             src={item.image.url || NO_IMAGE}
//                             alt="Current"
//                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
//                           />
//                         </div>
//                         <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-200 flex items-center justify-center">
//                           {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                             <div className="bg-white rounded-full p-2 shadow-lg">
//                               <i className="fa-solid fa-expand text-gray-700 text-sm"></i>
//                             </div>
//                           </div> */}
//                         </div>
//                       </div>
//                     )}

//                     {/* File Upload */}
//                     <div className="flex-1 min-w-0">
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(item._id, e.target.files?.[0] || null)}
//                         className="text-sm border-2 border-gray-200 hover:border-slate-400 focus:border-slate-600 transition-colors"
//                       />
//                       {images[item._id] && (
//                         <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
//                           <i className="fa-solid fa-check-circle"></i>
//                           New image ready to upload
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Verified Status */}
//                   <div className="flex items-center">
//                     <div
//                       className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${item?.isVerified
//                         ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
//                         : "bg-amber-100 text-amber-700 border-2 border-amber-200"
//                         }`}
//                     >
//                       <i className={`fa-solid ${item?.isVerified ? "fa-check-circle" : "fa-clock"} text-sm`}></i>
//                       {item?.isVerified ? "Verified" : "Pending"}
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   <div className="flex items-center">
//                     <Button
//                       size="sm"
//                       onClick={() => handleUpdate(item._id)}
//                       disabled={isPending}
//                       className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
//                     >
//                       {isPending ? (
//                         <i className="fa-solid fa-spinner fa-spin"></i>
//                       ) : (
//                         <i className="fa-solid fa-save"></i>
//                       )}
//                       <span className="hidden sm:inline">Save Changes</span>
//                       <span className="sm:hidden">Save</span>
//                     </Button>
//                   </div>
//                 </div>
//               ))}

//               {/* Empty State */}
//               {!data?.materialArrivalList?.length && (
//                 <div className="p-16 text-center bg-gradient-to-br from-gray-50 to-slate-50">
//                   <div className="max-w-md mx-auto">
//                     <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
//                       <i className="fa-solid fa-box-open text-4xl text-slate-400"></i>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-700 mb-4">No Materials Available</h3>
//                     <p className="text-gray-500 mb-6 leading-relaxed">
//                       Material data will appear here once available. Please check back later or contact your project
//                       administrator for assistance.
//                     </p>
//                     <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-white rounded-lg p-3 shadow-sm">
//                       <i className="fa-solid fa-info-circle"></i>
//                       <span>Materials are automatically synced from your project</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//       {showImageModal && (
//         <div
//           className="fixed inset-0 bg-black/70 bg-opacity-80 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowImageModal(null)}
//         >
//           <div className="relative w-[80vw] h-[80vh] max-w-4xl">
//             <button
//               onClick={() => setShowImageModal(null)}
//               className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-3"
//             >
//               <i className="fa-solid fa-times text-xl"></i>
//             </button>
//             {(() => {
//               const item = data?.materialArrivalList?.find((item: any) => item._id === showImageModal)
//               return item?.image?.url ? (
//                 <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
//                   <img
//                     src={item?.image?.url || NO_IMAGE}
//                     alt={item?.image?.originalName || "Material Image"}
//                     className="w-full h-full object-cover"
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6 rounded-b-2xl">
//                     <p className="text-lg font-semibold">{item?.image?.originalName || "Material Image"}</p>
//                     <p className="text-sm text-gray-300 mt-1">Click outside to close • Item ID: {item.customId}</p>
//                   </div>
//                 </div>
//               ) : null
//             })()}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PublicMaterialArrival





//  SECOND VERSION

// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Input } from "../../../components/ui/Input";
// import { Button } from "../../../components/ui/Button";
// import { toast } from "../../../utils/toast";
// import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants";
// import {
//   useGetPublicMaterialArrivalNew,
//   useUpdateMaterialArrivalItemNew,
// } from "../../../apiList/Stage Api/materialArrivalNewApi";

// // --- Interfaces ---
// interface SubItem {
//     _id: string;
//     subItemName: string;
//     refId: string;
//     orderedQuantity: number;
//     arrivedQuantity: number;
//     unit: string;
//     images: { url: string; originalName: string }[];
//     isVerified: boolean;
// }

// interface OrderGroup {
//     orderMaterialDeptNumber: string;
//     subItems: SubItem[];
// }

// const PublicMaterialArrival = () => {
//   const { projectId, token } = useParams<{ projectId: string; token: string }>();
  
//   // Fetch Data
//   const { data, isLoading, isError, refetch } = useGetPublicMaterialArrivalNew(projectId!, token!);
  
//   // Hooks
//   const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew();

//   // --- Local State for Inputs ---
//   // Key: subItemId -> Value: number
//   const [quantities, setQuantities] = useState<Record<string, number>>({});
  
//   // Key: subItemId -> Value: File
//   const [images, setImages] = useState<Record<string, File | null>>({});
  
//   const [showImageModal, setShowImageModal] = useState<string | null>(null); // Stores URL

//   // --- Handlers ---
//   const handleQuantityChange = (id: string, value: string) => {
//     const numVal = parseInt(value) || 0;
//     setQuantities((prev) => ({ ...prev, [id]: numVal }));
//   };

//   const handleFileChange = (id: string, file: File | null) => {
//     setImages((prev) => ({ ...prev, [id]: file }));
//   };

//   const handleUpdate = async (orderNumber: string, subItemId: string) => {
//     const arrivedQuantity = quantities[subItemId];
//     const image = images[subItemId];

//     // Prepare FormData
//     const formData = new FormData();
//     if (arrivedQuantity !== undefined) {
//       formData.append("arrivedQuantity", String(arrivedQuantity));
//     }
//     if (image) {
//         formData.append("upload", image);
//     }

//     if (arrivedQuantity === undefined && !image) {
//         toast({ title: "No Changes", description: "Please enter a quantity or select an image.", variant: "destructive" });
//         return;
//     }

//     try {
//       await updateItem({ projectId: projectId!, orderNumber, subItemId, formData });
      
//       toast({ title: "Success", description: "Updated successfully" });
      
//       // Cleanup local state for this item
//       setQuantities((prev) => {
//           const newState = { ...prev };
//           delete newState[subItemId];
//           return newState;
//       });
//       setImages((prev) => {
//           const newState = { ...prev };
//           delete newState[subItemId];
//           return newState;
//       });

//       refetch(); // Refresh list
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error.message || "Failed to update",
//         variant: "destructive",
//       });
//     }
//   };

//   // --- Stats Calculation ---
//   const allOrders: OrderGroup[] = data?.materialArrivalList || [];
//   const allSubItems = allOrders.flatMap(o => o.subItems);
  
//   const totalMaterials = allSubItems.length;
//   // Consider "Updated" if arrivedQty > 0 OR images exist
//   const updatedMaterials = allSubItems.filter((item) => item.arrivedQuantity > 0 || (item.images && item.images.length > 0)).length;
//   const completionProgress = totalMaterials > 0 ? Math.round((updatedMaterials / totalMaterials) * 100) : 0;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="flex flex-col items-center gap-3">
//             <i className="fas fa-circle-notch fa-spin text-4xl text-slate-600"></i>
//             <p className="text-gray-500 font-medium">Loading Portal...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-red-50">
//         <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg border border-red-100">
//           <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied or Error</h2>
//           <p className="text-gray-600 mb-4">Unable to load the material portal. The link might be expired or invalid.</p>
//           <Button onClick={() => window.location.reload()} className="bg-slate-800 text-white">Retry</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <img
//                   src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
//                   alt="Logo"
//                   className="w-10 h-10 rounded-full border border-gray-200 object-cover"
//               />
//               <div>
//                 <h1 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-[200px] sm:max-w-md">
//                   {COMPANY_DETAILS.COMPANY_NAME}
//                 </h1>
//                 <p className="text-xs text-gray-500">Site Material Portal</p>
//               </div>
//             </div>
//             <div className="hidden sm:block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
//                 <i className="fa-solid fa-lock mr-1"></i> Secure Link
//             </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
//         {/* Dashboard Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="bg-slate-800 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
//                 <div>
//                     <h2 className="text-2xl font-bold">Arrival Update</h2>
//                     <p className="text-slate-300 text-sm mt-1">Please update quantity & photos for arrived items.</p>
//                 </div>
//                 <div className="text-right">
//                     <div className="text-3xl font-bold text-emerald-400">{completionProgress}%</div>
//                     <div className="text-xs text-slate-400 uppercase tracking-wider">Completed</div>
//                 </div>
//             </div>
//             <div className="p-4 grid grid-cols-2 gap-4 bg-slate-50 border-t border-slate-100">
//                 <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><i className="fa-solid fa-box"></i></div>
//                     <div>
//                         <div className="text-lg font-bold text-gray-800">{totalMaterials}</div>
//                         <div className="text-xs text-gray-500">Total Items</div>
//                     </div>
//                 </div>
//                 <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><i className="fa-solid fa-check"></i></div>
//                     <div>
//                         <div className="text-lg font-bold text-gray-800">{updatedMaterials}</div>
//                         <div className="text-xs text-gray-500">Updated</div>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         {/* Orders List */}
//         <div className="space-y-6">
//             {allOrders.length > 0 ? (
//                 allOrders.map((order, orderIdx) => (
//                     <div key={orderIdx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
//                         {/* Order Header */}
//                         <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
//                             <h3 className="font-bold text-gray-700 flex items-center gap-2">
//                                 <i className="fa-solid fa-clipboard-list text-blue-500"></i>
//                                 Order #{order.orderMaterialDeptNumber}
//                             </h3>
//                             <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">
//                                 {order.subItems.length} Items
//                             </span>
//                         </div>

//                         {/* Items Table / List */}
//                         <div className="divide-y divide-gray-100">
//                             {order.subItems.map((item) => (
//                                 <div key={item._id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
//                                     <div className="flex flex-col gap-4">
                                        
//                                         {/* Item Info Header */}
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <h4 className="font-bold text-gray-800 text-sm sm:text-base">{item.subItemName}</h4>
//                                                 {item.refId && (
//                                                     <span className="text-xs text-gray-400 font-mono block mt-0.5">Ref: {item.refId}</span>
//                                                 )}
//                                             </div>
                                            
//                                             {/* Status Badge */}
//                                             <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
//                                                 item.isVerified 
//                                                 ? "bg-green-50 text-green-700 border-green-200"
//                                                 : "bg-amber-50 text-amber-700 border-amber-200"
//                                             }`}>
//                                                 {item.isVerified ? "Verified" : "Pending"}
//                                             </div>
//                                         </div>

//                                         {/* Inputs Section */}
//                                         <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                            
//                                             {/* 1. Quantity Input */}
//                                             <div className="sm:col-span-3">
//                                                 <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Arrived Qty</label>
//                                                 <div className="flex items-center">
//                                                     <Input
//                                                         type="number"
//                                                         min="0"
//                                                         placeholder={String(item.orderedQuantity)}
//                                                         value={quantities[item._id] ?? item.arrivedQuantity ?? ""}
//                                                         onChange={(e) => handleQuantityChange(item._id, e.target.value)}
//                                                         className="h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                                     />
//                                                     <span className="ml-2 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
//                                                         /{item.orderedQuantity} {item.unit}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             {/* 2. Image Upload */}
//                                             <div className="sm:col-span-6">
//                                                 <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Photo Proof</label>
//                                                 <div className="flex gap-2 items-center">
//                                                     {/* Existing Thumbnail (Last Uploaded) */}
//                                                     {item.images && item.images.length > 0 && (
//                                                         <div 
//                                                             onClick={() => setShowImageModal(item.images[item.images.length - 1].url)}
//                                                             className="w-10 h-10 flex-shrink-0 rounded border border-gray-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400"
//                                                             title="View uploaded image"
//                                                         >
//                                                             <img src={item.images[item.images.length - 1].url} className="w-full h-full object-cover" alt="Proof" />
//                                                         </div>
//                                                     )}
                                                    
//                                                     {/* File Input */}
//                                                     <Input 
//                                                         type="file" 
//                                                         accept="image/*"
//                                                         onChange={(e) => handleFileChange(item._id, e.target.files?.[0] || null)}
//                                                         className="h-10 text-xs border-gray-300 cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                                     />
//                                                 </div>
//                                             </div>

//                                             {/* 3. Action Button */}
//                                             <div className="sm:col-span-3">
//                                                 <Button 
//                                                     onClick={() => handleUpdate(order.orderMaterialDeptNumber, item._id)}
//                                                     disabled={isPending}
//                                                     className="w-full h-10 bg-slate-800 hover:bg-slate-900 text-white shadow-md text-xs font-bold uppercase tracking-wide"
//                                                 >
//                                                     {isPending ? <i className="fas fa-spinner fa-spin"></i> : "Update"}
//                                                 </Button>
//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="text-center py-12 text-gray-400">
//                     <i className="fa-solid fa-box-open text-4xl mb-3 opacity-50"></i>
//                     <p>No material orders found.</p>
//                 </div>
//             )}
//         </div>

//       </div>

//       {/* Full Screen Image Modal */}
//       {showImageModal && (
//         <div 
//             className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//             onClick={() => setShowImageModal(null)}
//         >
//             <div className="relative max-w-4xl w-full max-h-[90vh]">
//                 <button 
//                     onClick={() => setShowImageModal(null)}
//                     className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
//                 >
//                     <i className="fa-solid fa-times text-2xl"></i>
//                 </button>
//                 <img 
//                     src={showImageModal} 
//                     alt="Proof Full View" 
//                     className="w-full h-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-black"
//                     onClick={(e) => e.stopPropagation()} 
//                 />
//             </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default PublicMaterialArrival;


// //  third version


import { useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants";
import {
  useGetPublicMaterialArrivalNew,
  useUpdateMaterialArrivalItemNew,
} from "../../../apiList/Stage Api/materialArrivalNewApi";

// --- Interfaces ---
interface SubItem {
    _id: string;
    subItemName: string;
    refId: string;
    orderedQuantity: number;
    arrivedQuantity: number;
    unit: string;
    images: { url: string; originalName: string }[];
    isVerified: boolean;
}

interface OrderGroup {
    orderMaterialDeptNumber: string;
    subItems: SubItem[];
}

const PublicMaterialArrival = () => {
  const { projectId, token } = useParams<{ projectId: string; token: string }>();
  
  // Fetch Data
  const { data, isLoading, isError, refetch } = useGetPublicMaterialArrivalNew(projectId!, token!);
  
  // Hooks
  const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew();

  // --- Local State ---
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [images, setImages] = useState<Record<string, File | null>>({});
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  
  // Accordion State (Array of open Order Numbers)
  const [openOrders, setOpenOrders] = useState<string[]>([]);

  // --- Handlers ---
  const toggleOrder = (orderId: string) => {
    setOpenOrders(prev => 
        prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // Initialize open orders when data loads (optional: open all by default)
  if (data && openOrders.length === 0 && data.materialArrivalList?.length > 0) {
      // Uncomment to open all by default:
      setOpenOrders(data.materialArrivalList.map((o: any) => o.orderMaterialDeptNumber));
  }

  const handleQuantityChange = (id: string, value: string) => {
    const numVal = value === "" ? 0 : parseFloat(value);
    setQuantities((prev) => ({ ...prev, [id]: numVal }));
  };

  const handleFileChange = (id: string, file: File | null) => {
    setImages((prev) => ({ ...prev, [id]: file }));
  };

  const handleUpdate = async (orderNumber: string, subItemId: string) => {
    const arrivedQuantity = quantities[subItemId];
    const image = images[subItemId];

    const formData = new FormData();
    if (arrivedQuantity !== undefined) {
      formData.append("arrivedQuantity", String(arrivedQuantity));
    }
    if (image) {
        formData.append("upload", image);
    }

    if (arrivedQuantity === undefined && !image) {
        toast({ title: "No Changes", description: "Please enter a quantity or select an image.", variant: "destructive" });
        return;
    }

    try {
      await updateItem({ projectId: projectId!, orderNumber, subItemId, formData });
      
      toast({ title: "Success", description: "Updated successfully" });
      
      // Cleanup local state
      setQuantities((prev) => {
          const newState = { ...prev };
          delete newState[subItemId];
          return newState;
      });
      setImages((prev) => {
          const newState = { ...prev };
          delete newState[subItemId];
          return newState;
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update",
        variant: "destructive",
      });
    }
  };

  // --- Stats ---
  const allOrders: OrderGroup[] = data?.materialArrivalList || [];
  const allSubItems = allOrders.flatMap(o => o.subItems);
  const totalMaterials = allSubItems.length;
  const updatedMaterials = allSubItems.filter((item) => item.arrivedQuantity > 0 || (item.images && item.images.length > 0)).length;
  const completionProgress = totalMaterials > 0 ? Math.round((updatedMaterials / totalMaterials) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <i className="fas fa-circle-notch fa-spin text-4xl text-blue-600"></i>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-600">
        <div className="text-center">
            <i className="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
            <h2 className="text-xl font-bold">Unable to load portal</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                  src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
                  alt="Logo"
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {COMPANY_DETAILS.COMPANY_NAME}
                </h1>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Material Arrival Portal</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
                <i className="fa-solid fa-check-circle"></i>
                {completionProgress}% Complete
            </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <div className="w-full px-2 sm:px-6 py-6 space-y-6">
        
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs uppercase font-bold">Total Items</div>
                <div className="text-2xl font-bold text-gray-800">{totalMaterials}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs uppercase font-bold">Updated</div>
                <div className="text-2xl font-bold text-blue-600">{updatedMaterials}</div>
            </div>
            <div className="col-span-2 bg-slate-800 p-4 rounded-lg shadow-sm text-white flex items-center justify-between">
                <div>
                    <div className="text-slate-400 text-xs uppercase font-bold">Overall Progress</div>
                    <div className="text-xl font-bold">{completionProgress}% Done</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-600 flex items-center justify-center text-xs font-bold">
                    {completionProgress}
                </div>
            </div>
        </div>

        {/* --- ORDERS LIST (Accordions) --- */}
        <div className="space-y-4">
            {allOrders.map((order) => {
                const isExpanded = openOrders.includes(order.orderMaterialDeptNumber);
                const itemCount = order.subItems.length;
                const verifiedCount = order.subItems.filter(i => i.isVerified).length;

                return (
                    <div key={order.orderMaterialDeptNumber} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Accordion Header */}
                        <div 
                            onClick={() => toggleOrder(order.orderMaterialDeptNumber)}
                            className="bg-white hover:bg-gray-50 cursor-pointer px-4 py-4 flex items-center justify-between transition-colors border-b border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm ${isExpanded ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <i className="fa-solid fa-box-open"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-base">Order #{order.orderMaterialDeptNumber}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                        <span>{itemCount} Items</span>
                                        <span className={verifiedCount === itemCount ? "text-green-600 font-bold" : "text-orange-500"}>
                                            {verifiedCount}/{itemCount} Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                        </div>

                        {/* Accordion Body (Scrollable Table) */}
                        {isExpanded && (
                            <div className="border-t border-gray-200 bg-gray-50/50">
                                {/* The "Notion-style" horizontal scroll container */}
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full min-w-[1000px] text-left border-collapse">
                                        <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 w-[250px]">Material Details</th>
                                                <th className="px-4 py-3 w-[100px] text-center">Ordered</th>
                                                <th className="px-4 py-3 w-[80px] text-center">Unit</th>
                                                <th className="px-4 py-3 w-[150px]">Arrived Qty</th>
                                                <th className="px-4 py-3 w-[250px]">Photo Evidence</th>
                                                <th className="px-4 py-3 w-[120px] text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {order.subItems.map((item) => {
                                                const latestImage = item.images?.length > 0 ? item.images[item.images.length - 1].url : null;
                                                const isDraft = quantities[item._id] !== undefined || images[item._id] !== undefined;

                                                return (
                                                    <tr key={item._id} className="hover:bg-blue-50/20 transition-colors">
                                                        
                                                        {/* 1. Details */}
                                                        <td className="px-6 py-4 align-middle">
                                                            <div className="font-bold text-gray-800 text-sm">{item.subItemName}</div>
                                                            {item.refId && (
                                                                <div className="text-xs text-gray-400 font-mono mt-1">{item.refId}</div>
                                                            )}
                                                            {item.isVerified && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded border border-green-200">
                                                                    VERIFIED
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* 2. Ordered */}
                                                        <td className="px-4 py-4 text-center align-middle">
                                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                                                                {item.orderedQuantity}
                                                            </span>
                                                        </td>

                                                        {/* 3. Unit */}
                                                        <td className="px-4 py-4 text-center align-middle">
                                                            <span className="text-xs font-bold text-gray-500 uppercase bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                                                                {item.unit}
                                                            </span>
                                                        </td>

                                                        {/* 4. Arrived Input */}
                                                        <td className="px-4 py-4 align-middle">
                                                            <div className="relative">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder={String(item.arrivedQuantity || 0)}
                                                                    value={quantities[item._id] ?? item.arrivedQuantity ?? ""}
                                                                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                                                    className="w-full font-bold text-center border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                                />
                                                                {item.arrivedQuantity > 0 && quantities[item._id] === undefined && (
                                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                                                                        <i className="fa-solid fa-check"></i>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* 5. Image Upload & Preview */}
                                                        <td className="px-4 py-4 align-middle">
                                                            <div className="flex items-center gap-4">
                                                                {/* Large Preview */}
                                                                <div 
                                                                    className="relative w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 group"
                                                                    onClick={() => latestImage && setShowImageModal(latestImage)}
                                                                >
                                                                    {latestImage ? (
                                                                        <>
                                                                            <img src={latestImage} alt="Proof" className="w-full h-full object-cover" />
                                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                                                <i className="fa-solid fa-magnifying-glass text-white opacity-0 group-hover:opacity-100"></i>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                                            <i className="fa-regular fa-image text-xl"></i>
                                                                            <span className="text-[10px] mt-1">No Img</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Upload Input */}
                                                                <div className="flex-1">
                                                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors w-full justify-center">
                                                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                                                        {images[item._id] ? "Change File" : "Upload"}
                                                                        <input 
                                                                            type="file" 
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={(e) => handleFileChange(item._id, e.target.files?.[0] || null)}
                                                                        />
                                                                    </label>
                                                                    {images[item._id] && (
                                                                        <div className="text-[10px] text-green-600 mt-1 truncate max-w-[120px]">
                                                                            <i className="fa-solid fa-check mr-1"></i>
                                                                            {images[item._id]?.name}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* 6. Action */}
                                                        <td className="px-4 py-4 text-center align-middle">
                                                            <Button
                                                                size="sm"
                                                                variant="primary"
                                                                disabled={isPending || !isDraft}
                                                                onClick={() => handleUpdate(order.orderMaterialDeptNumber, item._id)}
                                                                className={`w-full text-xs font-bold shadow-sm`}
                                                            >
                                                                {isPending ? <i className="fas fa-spinner fa-spin"></i> : "Update"}
                                                            </Button>
                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

      </div>

      {/* --- Full Screen Modal --- */}
      {showImageModal && (
        <div 
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowImageModal(null)}
        >
            <div className="relative w-full max-w-4xl max-h-[90vh]">
                <button 
                    onClick={() => setShowImageModal(null)}
                    className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors p-2"
                >
                    <i className="fa-solid fa-xmark text-3xl"></i>
                </button>
                <img 
                    src={showImageModal} 
                    alt="Proof Full View" 
                    className="w-full h-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-black"
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
      )}

    </div>
  );
};

export default PublicMaterialArrival;