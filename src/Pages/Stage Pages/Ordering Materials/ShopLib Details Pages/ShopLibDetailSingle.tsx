// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetShopLib, useUpdateShopLib } from "../../../../apiList/Stage Api/shopLibDetailApi";
// import { toast } from "../../../../utils/toast";
// import { Button } from "../../../../components/ui/Button";
// import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
// import SmartTagInput from "../../../../shared/SmartTagInput";
// import type { ShopFormData } from "./ShopLibDetailsMain";
// // import SmartTagInput from "../../../../components/SmartTagInput"; // Assuming the path

// const ShopDetailSingle: React.FC = () => {
//     const { shopId } = useParams<{ shopId: string }>();
//     const { organizationId } = useParams() as { organizationId: string }

//     const navigate = useNavigate();
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [formData, setFormData] = useState<ShopFormData>({
//         shopName: "",
//         address: "",
//         contactPerson: "",
//         phoneNumber: "",
//         priority: [],
//     });

//     const { data: shops, isLoading, error } = useGetShopLib(organizationId);
//     const updateShopMutation = useUpdateShopLib();




//     const { role, permission } = useAuthCheck();
//     // const canDelete = role === "owner" || permission?.ordermaterial?.delete;
//     // const canList = role === "owner" || permission?.ordermaterial?.list;
//     // const canCreate = role === "owner" || permission?.ordermaterial?.create;
//     const canEdit = role === "owner" || permission?.ordermaterial?.edit;





//     // Find the current shop
//     const currentShop = shops?.find((shop: any) => shop._id === shopId);

//     useEffect(() => {
//         if (currentShop) {
//             setFormData({
//                 shopName: currentShop.shopName || "",
//                 address: currentShop.address || "",
//                 contactPerson: currentShop.contactPerson || "",
//                 phoneNumber: currentShop.phoneNumber || "",
//                 priority: currentShop.priority || []
//             });
//         }
//     }, [currentShop]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };


//     // Handler for SmartTagInput
//     const handleSetTags = (newTags: string[] | ((prev: string[]) => string[])) => {
//         setFormData(prev => ({
//             ...prev,
//             priority: typeof newTags === 'function' ? newTags(prev.priority) : newTags
//         }));
//     };

//     const handleUpdateShop = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             if (!formData.shopName.trim()) {
//                 toast({
//                     title: "Validation Error",
//                     description: "Shop name is required",
//                     variant: "destructive"
//                 });
//                 return;
//             }

//             const updateData = {
//                 id: shopId!,
//                 shopData: {
//                     shopName: formData.shopName,
//                     address: formData.address,
//                     contactPerson: formData.contactPerson,
//                     phoneNumber: formData.phoneNumber,
//                     priority: formData.priority,
//                 }
//             };

//             await updateShopMutation.mutateAsync(updateData);

//             toast({
//                 title: "Success",
//                 description: "Shop updated successfully"
//             });

//             setIsEditMode(false);
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || "Failed to update shop",
//                 variant: "destructive"
//             });
//         }
//     };

//     // const handleUpdateField = async (field: string, value: string) => {
//     //     try {
//     //         if (!currentShop) return;

//     //         const updatedData = {
//     //             id: shopId!,
//     //             shopData: {
//     //                 shopName: field === 'shopName' ? value : currentShop.shopName,
//     //                 address: field === 'address' ? value : currentShop.address,
//     //                 contactPerson: field === 'contactPerson' ? value : currentShop.contactPerson,
//     //                 phoneNumber: field === 'phoneNumber' ? value : currentShop.phoneNumber,
//     //             }
//     //         };

//     //         await updateShopMutation.mutateAsync(updatedData);

//     //         toast({
//     //             title: "Success",
//     //             description: `${field} updated successfully`
//     //         });
//     //     } catch (error: any) {
//     //         toast({
//     //             title: "Error",
//     //             description: error?.response?.data?.message || `Failed to update ${field}`,
//     //             variant: "destructive"
//     //         });
//     //     }
//     // };


//     const handleCopyDetails = async () => {
//         try {
//             const details = `Shop: ${currentShop.shopName}\nAddress: ${currentShop.address || 'N/A'}\nContact: ${currentShop.contactPerson || 'N/A'}\nPhone: ${currentShop.phoneNumber || 'N/A'}`;
//             await navigator.clipboard.writeText(details);

//             toast({
//                 title: "Success",
//                 description: "Shop details copied to clipboard"
//             });
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: "Failed to copy details",
//                 variant: "destructive"
//             });
//         }
//     };


//     const handleNavigateBack = () => {
//         try {
//             navigate(-1);
//         } catch (error) {
//             toast({
//                 title: "Error",
//                 description: "Failed to navigate back",
//                 variant: "destructive"
//             });
//         }
//     };


//     const handleCancel = () => {
//         if (currentShop) {
//             setFormData({
//                 shopName: currentShop.shopName || "",
//                 address: currentShop.address || "",
//                 contactPerson: currentShop.contactPerson || "",
//                 phoneNumber: currentShop.phoneNumber || "",
//                 priority: currentShop.priority || []
//             });
//         }
//         setIsEditMode(false);
//     };

//     // Loading State
//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="text-center">
//                     <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
//                     <p className="text-gray-600">Loading shop details...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Error State
//     if (error || !currentShop) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="text-center">
//                     <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
//                     <p className="text-gray-600 mb-4">
//                         {error ? "Failed to load shop details" : "Shop not found"}
//                     </p>
//                     <button
//                         onClick={handleNavigateBack}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <i className="fas fa-arrow-left text-gray-600"></i>
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-full  bg-gray-50 p-2">
//             <div className="max-w-full mx-auto">
//                 {/* Header */}
//                 <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={handleNavigateBack}
//                                 className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <i className="fas fa-arrow-left text-gray-600"></i>
//                             </button>
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-800">
//                                     {isEditMode ? "Edit Shop Details" : "Shop Details"}
//                                 </h1>
//                                 <p className="text-gray-600 mt-1">
//                                     {isEditMode ? "Update shop information" : "View and manage shop information"}
//                                 </p>
//                             </div>
//                         </div>

//                         {!isEditMode && (
//                             <button
//                                 onClick={() => setIsEditMode(true)}
//                                 className="px-4 cursor-pointer py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
//                             >
//                                 <i className="fas fa-edit"></i>
//                                 <span>Edit Shop</span>
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* Shop Details Card */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     {!isEditMode ? (
//                         // View Mode
//                         <div className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-sm text-gray-500 block mb-1">
//                                             <i className="fas fa-store mr-2"></i>
//                                             Shop Name
//                                         </label>
//                                         <p className="text-lg font-medium text-gray-800">
//                                             {currentShop.shopName || "-"}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="text-sm text-gray-500 block mb-1">
//                                             <i className="fas fa-user mr-2"></i>
//                                             Contact Person
//                                         </label>
//                                         <p className="text-lg text-gray-800">
//                                             {currentShop.contactPerson || "-"}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-sm text-gray-500 block mb-1">
//                                             <i className="fas fa-phone mr-2"></i>
//                                             Phone Number
//                                         </label>
//                                         <p className="text-lg text-gray-800">
//                                             {currentShop.phoneNumber || "-"}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="text-sm text-gray-500 block mb-1">
//                                             <i className="fas fa-map-marker-alt mr-2"></i>
//                                             Address
//                                         </label>
//                                         <p className="text-lg text-gray-800">
//                                             {currentShop.address || "-"}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>



//                             {/* Display Priority Tags in View Mode */}
//                             <div className="pt-4 border-t">
//                                 <label className="text-sm text-gray-500 block mb-2"><i className="fas fa-tags mr-2"></i>Priority Tags</label>
//                                 <div className="flex flex-wrap gap-2">
//                                     {currentShop.priority && currentShop.priority.length > 0 ? (
//                                         currentShop.priority.map((tag: string, index: number) => (
//                                             <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 uppercase">
//                                                 {tag}
//                                             </span>
//                                         ))
//                                     ) : (
//                                         <span className="text-gray-400 italic text-sm">No tags assigned</span>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Additional Info */}
//                             {/* <div className="pt-6 border-t">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
//                                     <div>
//                                         <i className="fas fa-calendar-alt mr-2"></i>
//                                         Created: {new Date(currentShop.createdAt).toLocaleDateString()}
//                                     </div>
//                                     <div>
//                                         <i className="fas fa-clock mr-2"></i>
//                                         Last Updated: {new Date(currentShop.updatedAt).toLocaleDateString()}
//                                     </div>
//                                 </div>
//                             </div> */}
//                         </div>
//                     ) : (
//                         // Edit Mode
//                         <form onSubmit={handleUpdateShop} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-store mr-2"></i>
//                                         Shop Name *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="shopName"
//                                         value={formData.shopName}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-phone mr-2"></i>
//                                         Phone Number
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         maxLength={10}
//                                         name="phoneNumber"
//                                         value={formData.phoneNumber}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-user mr-2"></i>
//                                         Contact Person
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="contactPerson"
//                                         value={formData.contactPerson}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         <i className="fas fa-map-marker-alt mr-2"></i>
//                                         Address
//                                     </label>
//                                     <textarea
//                                         name="address"
//                                         value={formData.address}
//                                         onChange={handleInputChange}
//                                         rows={3}
//                                         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>


//                             {/* Integrated SmartTagInput */}
//                             <div className="pt-4 border-t">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <i className="fas fa-tags mr-2 text-blue-500"></i>Priority Automation Tags
//                                     <span className="text-[10px] text-gray-400 ml-2">(Type and hit Enter to add. Use tags like 'high', 'electrical', etc.)</span>
//                                 </label>
//                                 <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
//                                     <SmartTagInput
//                                         tags={formData.priority}
//                                         setState={handleSetTags}
//                                         // suggestionFetcher={async () => ['high', 'electrical', 'plumbing', 'general', 'urgent']}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex gap-4 pt-6 border-t">
//                                 <button
//                                     type="button"
//                                     onClick={handleCancel}
//                                     className="flex-1 px-4 cursor-pointer py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                     <i className="fas fa-times mr-2"></i>
//                                     Cancel
//                                 </button>
//                                 <Button
//                                     type="submit"
//                                     disabled={updateShopMutation.isPending}
//                                     className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
//                                 >
//                                     {updateShopMutation.isPending ? (
//                                         <>
//                                             <i className="fas fa-spinner fa-spin"></i>
//                                             <span>Updating...</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className="fas fa-save"></i>
//                                             <span>Save Changes</span>
//                                         </>
//                                     )}
//                                 </Button>
//                             </div>
//                         </form>
//                     )}
//                 </div>

//                 {/* Quick Actions Card */}
//                 {!isEditMode && (
//                     <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//                         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                             <i className="fas fa-bolt mr-2 text-yellow-500"></i>
//                             Quick Actions
//                         </h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {canEdit && <button
//                                 onClick={() => setIsEditMode(true)}
//                                 className="p-4 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
//                             >
//                                 <i className="fas fa-edit text-blue-500 text-xl mb-2"></i>
//                                 <p className="font-medium text-gray-800">Edit Details</p>
//                                 <p className="text-sm text-gray-500">Update shop information</p>
//                             </button>}

//                             <button
//                                 onClick={handleCopyDetails}
//                                 className="p-4 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
//                             >
//                                 <i className="fas fa-copy text-green-500 text-xl mb-2"></i>
//                                 <p className="font-medium text-gray-800">Copy Details</p>
//                                 <p className="text-sm text-gray-500">Copy to clipboard</p>
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ShopDetailSingle;




//  THIRD VERSION
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import { useGetVendor } from "../../../../apiList/Department Api/Accounting Api/vendorAccApi";
// Corrected import path
import ImageGalleryExample from "../../../../shared/ImageGallery/ImageGalleryMain";

const ShopDetailSingle: React.FC = () => {
    const { shopId: vendorId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const { role, permission } = useAuthCheck();
    const canEdit = role === "owner" || permission?.ordermaterial?.edit;

    const { data: vendor, isLoading, error } = useGetVendor(vendorId!, !!vendorId);



    /**
     * Escape Key Functionality
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsImageModalOpen(false);
            }
        };

        if (isImageModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Optional: Prevent background scrolling when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isImageModalOpen]);


    const handleNavigateBack = () => navigate(-1);

    if (isLoading) return <div className="h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i></div>;
    if (error || !vendor) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Shop data not found.</div>;

    const shopImages = vendor.shopImages || [];
    // const mainImageUrl = vendor.mainImage ? (typeof vendor.mainImage === 'string' ? vendor.mainImage : URL.createObjectURL(vendor.mainImage)) : null;

    // 1. Logic for Main Image URL
    const mainImageUrl = vendor.mainImage
        ? (typeof vendor.mainImage === 'string'
            ? vendor.mainImage
            : vendor?.mainImage?.url // Use the .url property from the object
                ? vendor?.mainImage?.url
                : URL.createObjectURL(vendor.mainImage as any)) // Fallback for local File uploads
        : null;


    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b px-6 py-3 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <button onClick={handleNavigateBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <i className="fas fa-arrow-left text-gray-600"></i>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{vendor.shopDisplayName}</h1>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                            {vendor.vendorCategory || "General Shop"}
                        </span>
                    </div>
                </div>
                {canEdit && (
                    <Button onClick={() => navigate(`/vendors/edit/${vendorId}`)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4">
                        <i className="fas fa-edit mr-2"></i> Edit Details
                    </Button>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 space-y-6 overflow-y-auto">

                {/* Top Section: Profile & Contact Details Side-by-Side */}
                <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                    {/* Main Image (Round Profile Style) */}
                    <div className="flex flex-col items-center">
                        <div
                            className="relative cursor-pointer group"
                            onClick={() => mainImageUrl && setIsImageModalOpen(true)}
                        >
                            <div className="w-40 h-40 rounded-full border-[6px] border-gray-50 shadow-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 transition-all group-hover:ring-blue-400 group-hover:scale-[1.02]">
                                {mainImageUrl ? (
                                    <img src={mainImageUrl} alt="Shop Main" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="fas fa-store text-5xl"></i>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-search-plus text-white text-xl"></i>
                            </div>
                        </div>
                        <p className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Main Shop Image</p>
                    </div>

                    {/* Contact Details (High Importance) */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                        <DetailCard icon="user-tie" label="Vendor / Owner Name" value={vendor.firstName} />
                        <DetailCard icon="mobile-button" label="Contact Number" value={vendor.phone?.mobile} />
                        <DetailCard icon="envelope-open-text" label="Email Address" value={vendor.email} />
                        <DetailCard icon="map-location-dot" label="Shop Address" value={vendor.shopFullAddress} />
                    </div>
                </div>

                {/* Bottom Section: Prominent Shop Gallery */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                            <i className="fas fa-camera-retro text-purple-500"></i>
                            Prominent Shop Gallery
                        </h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {shopImages.length} Photos Available
                        </span>
                    </div>

                    <div className="min-h-[200px]">
                        {shopImages.length > 0 ? (
                            <ImageGalleryExample
                                imageFiles={shopImages}
                                height={220} // Increased height for prominence
                                minWidth={220}
                                maxWidth={300}
                                className='!p-0 !gap-1'
                            />
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <i className="fas fa-images text-4xl text-gray-200 mb-2"></i>
                                <p className="text-gray-400 text-sm">No additional gallery photos uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* View Main Image Modal */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[999] flex items-center justify-center p-6 backdrop-blur-md"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <button className="absolute top-8 right-8 text-white text-3xl transition-transform hover:scale-125">
                        <i className="fas fa-times"></i>
                    </button>
                    <img
                        src={mainImageUrl!}
                        className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white/10 animate-in fade-in zoom-in duration-300"
                        alt="Shop Preview"
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Compact Detail Card for High Prominence
 */
const DetailCard = ({ icon, label, value }: { icon: string, label: string, value?: string | null }) => (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <i className={`fas fa-${icon} text-blue-600 text-sm`}></i>
        </div>
        <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm text-gray-800 font-bold break-words">{value || <span className="text-gray-300 font-normal">N/A</span>}</p>
        </div>
    </div>
);

export default ShopDetailSingle;