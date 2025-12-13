// import React, { useState } from "react";
// import { Button } from "../../../components/ui/Button";
// import { NO_IMAGE } from "../../../constants/constants";
// import { useToggleMaterialVerification } from "../../../apiList/Stage Api/materialArrivalNewApi"; // Adjust path
// import { toast } from "../../../utils/toast";
// import { dateFormate } from "../../../utils/dateFormator";

// interface Props {
//     orderGroup: IMaterialOrdered; // Type this properly based on your schema
//     projectId: string;
// }



// export interface IUploadFile {

//   type: "image" | "pdf";
//   url: string;
//   originalName?: string;
//   uploadedAt: string;
// }


// interface IMaterialOrder {
//     _id: string
//   images: IUploadFile[];
//   isVerified: boolean;
//   subItemName: string;
//   refId: string;
//   arrivedQuantity: number;
//   orderedQuantity: number;
//   unit: string;
// }

// export interface IMaterialOrdered {
//   orderMaterialDeptNumber: string;
//   procurementDeptNumber: string;
//   paymentDeptNumber: string;
//   logisticsDeptNumber: string;
//   subItems: IMaterialOrder[]
//   orderedImages: IUploadFile[]
// }

// const MaterialArrivalGroupAccordion: React.FC<Props> = ({ orderGroup, projectId }) => {
//     // Default open if items exist
//     const [isOpen, setIsOpen] = useState(true); 

//     // Calculate Group Stats
//     const totalItems = orderGroup.subItems?.length || 0;
//     const verifiedCount = orderGroup.subItems?.filter((i: any) => i.isVerified).length || 0;
//     const isFullyVerified = totalItems > 0 && totalItems === verifiedCount;

//     return (
//         <div className={`border rounded-xl bg-white shadow-sm transition-all duration-200 overflow-hidden ${isOpen ? 'ring-1 ring-blue-200' : ''}`}>

//             {/* --- Accordion Header --- */}
//             <div 
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//             >
//                 <div className="flex items-center gap-4">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isFullyVerified ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
//                         <i className={`fa-solid ${isFullyVerified ? 'fa-check' : 'fa-box'}`}></i>
//                     </div>
//                     <div>
//                         <h4 className="font-bold text-gray-800 text-sm sm:text-base">
//                             Order #{orderGroup.orderMaterialDeptNumber || "Unknown"}
//                         </h4>
//                         <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
//                             <span><i className="fa-solid fa-list mr-1"></i> {totalItems} Items</span>
//                             <span className={isFullyVerified ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
//                                 <i className={`fa-solid ${isFullyVerified ? 'fa-circle-check' : 'fa-clock'} mr-1`}></i>
//                                 {verifiedCount}/{totalItems} Verified
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="text-gray-400">
//                     <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
//                 </div>
//             </div>

//             {/* --- Accordion Body (Table) --- */}
//             {isOpen && (
//                 <div className="border-t border-gray-100 bg-gray-50/30 p-0 sm:p-4">
//                     <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
//                         <table className="w-full text-sm text-left">
//                             <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-xs">
//                                 <tr>
//                                     <th className="px-4 py-3 min-w-[50px]">#</th>
//                                     <th className="px-4 py-3 min-w-[200px]">Material Name</th>
//                                     <th className="px-4 py-3 text-center">Ordered</th>
//                                     <th className="px-4 py-3 text-center">Arrived</th>
//                                     <th className="px-4 py-3 text-center">Image</th>
//                                     <th className="px-4 py-3 text-center min-w-[140px]">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {orderGroup?.subItems.map((item: any, idx: number) => (
//                                     <SubItemRow 
//                                         key={item._id || idx} 
//                                         item={item} 
//                                         idx={idx} 
//                                         projectId={projectId} 
//                                         orderNumber={orderGroup.orderMaterialDeptNumber}
//                                     />
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MaterialArrivalGroupAccordion;


// // --- Sub Component for Row Logic ---
// const SubItemRow = ({ item, idx, projectId, orderNumber }: { item: IMaterialOrder, idx: number, projectId: string, orderNumber: string }) => {
//     const { mutateAsync: toggleVerification, isPending } = useToggleMaterialVerification();
//     const [showImageModal, setShowImageModal] = useState(false);

//     // Get the latest image if available (Assuming Last uploaded is most relevant)
//     const latestImage = item.images && item.images.length > 0 ? item.images[item.images.length - 1] : null;

//     const handleToggle = async () => {
//         try {
//             await toggleVerification({ 
//                 projectId, 
//                 orderNumber, 
//                 subItemId: item._id, 
//                 toggle: !item.isVerified 
//             });
//             toast({ title: "Success", description: "Status updated" });
//         } catch (error: any) {
//             toast({ title: "Error", description: error?.message || "Failed", variant: "destructive" });
//         }
//     };

//     return (
//         <tr className={`hover:bg-blue-50/30 transition-colors ${item.isVerified ? 'bg-green-50/30' : ''}`}>
//             {/* Index */}
//             <td className="px-4 py-3 text-gray-400 font-mono text-xs text-center">{idx + 1}</td>

//             {/* Name */}
//             <td className="px-4 py-3">
//                 <div className="font-medium text-gray-800">{item.subItemName}</div>
//                 {item.refId && <div className="text-xs text-gray-400 font-mono mt-0.5">{item.refId}</div>}
//             </td>

//             {/* Ordered Qty */}
//             <td className="px-4 py-3 text-center">
//                 <span className="font-semibold text-gray-700">{item.orderedQuantity}</span>
//                 <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
//             </td>

//             {/* Arrived Qty */}
//             <td className="px-4 py-3 text-center">
//                 <span className={`font-bold ${item.arrivedQuantity < item.orderedQuantity ? 'text-orange-600' : 'text-green-600'}`}>
//                     {item.arrivedQuantity || 0}
//                 </span>
//             </td>

//             {/* Image Preview */}
//             <td className="px-4 py-3 text-center">
//                 {latestImage ? (
//                     <div 
//                         onClick={() => setShowImageModal(true)}
//                         className="relative w-10 h-10 mx-auto rounded border border-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
//                     >
//                         <img src={latestImage.url} alt="Proof" className="w-full h-full object-cover" />
//                     </div>
//                 ) : (
//                     <div className="w-10 h-10 mx-auto rounded bg-gray-100 flex items-center justify-center text-gray-300">
//                         <i className="fa-solid fa-image-slash"></i>
//                     </div>
//                 )}
//             </td>

//             {/* Action Button */}
//             <td className="px-4 py-3 text-center">
//                 <Button
//                     onClick={handleToggle}
//                     disabled={isPending}
//                     size="sm"
//                     className={`w-full text-xs font-semibold shadow-sm transition-all ${
//                         item.isVerified
//                             ? "bg-white border border-green-200 text-green-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
//                             : "bg-blue-600 text-white hover:bg-blue-700 border border-transparent"
//                     }`}
//                 >
//                     {isPending ? <i className="fa-solid fa-spinner fa-spin"></i> : (
//                         <>
//                             <i className={`fa-solid ${item.isVerified ? "fa-check mr-1" : "fa-check mr-1"}`}></i>
//                             {item.isVerified ? "Verified" : "Verify"}
//                         </>
//                     )}
//                 </Button>
//             </td>

//             {/* --- Image Modal --- */}
//             {showImageModal && latestImage && (
//                 <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowImageModal(false)}>
//                     <div className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
//                         <div className="p-2 flex justify-end bg-black">
//                             <button onClick={() => setShowImageModal(false)} className="text-white hover:text-red-400 p-2">
//                                 <i className="fa-solid fa-times text-xl"></i>
//                             </button>
//                         </div>
//                         <img src={latestImage.url} alt="Full view" className="w-full max-h-[80vh] object-contain bg-gray-900" />
//                         <div className="p-3 bg-white border-t flex justify-between items-center">
//                             <span className="text-sm font-medium text-gray-700">{latestImage.originalName}</span>
//                             <span className="text-xs text-gray-500">{dateFormate(latestImage.uploadedAt)}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </tr>
//     );
// };



import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
// import { NO_IMAGE } from "../../../constants/constants";
import { useToggleMaterialVerification, useUpdateStaffMaterialArrivalItemQuantity, useUpdateStaffMatArrivalItemImage } from "../../../apiList/Stage Api/materialArrivalNewApi"; // Adjust path
import { toast } from "../../../utils/toast";
import { dateFormate } from "../../../utils/dateFormator";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface Props {
    orderGroup: IMaterialOrdered;
    projectId: string;
}

export interface IUploadFile {
    type: "image" | "pdf";
    url: string;
    originalName?: string;
    uploadedAt: string;
}

interface IMaterialOrder {
    _id: string
    images: IUploadFile[];
    isVerified: boolean;
    subItemName: string;
    refId: string;
    arrivedQuantity: number;
    orderedQuantity: number;
    unit: string;
}

export interface IMaterialOrdered {
    orderMaterialDeptNumber: string;
    materialArrivalDeptNumber: string | null
    procurementDeptNumber: string;
    paymentDeptNumber: string;
    logisticsDeptNumber: string;
    subItems: IMaterialOrder[]
    orderedImages: IUploadFile[]
}

const MaterialArrivalGroupAccordion: React.FC<Props> = ({ orderGroup, projectId }) => {
    // Default open if items exist
    const [isOpen, setIsOpen] = useState(true);

    // Calculate Group Stats
    const totalItems = orderGroup.subItems?.length || 0;
    const verifiedCount = orderGroup.subItems?.filter((i: any) => i.isVerified).length || 0;
    const isFullyVerified = totalItems > 0 && totalItems === verifiedCount;

    return (
        <div className={`border border-gray-200 rounded-xl bg-white shadow-sm mb-6 transition-all duration-200 overflow-hidden ${isOpen ? 'ring-1 ring-gray-200' : ''}`}>

            {/* --- Accordion Header --- */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm border ${isFullyVerified ? 'bg-green-50 border-green-200 text-green-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                        <i className={`fa-solid ${isFullyVerified ? 'fa-clipboard-check' : 'fa-clipboard-list'}`}></i>
                    </div>
                    {/* <div>

                       {orderGroup?.materialArrivalDeptNumber && <h4 className="font-bold text-gray-800 text-base">
                           Material Arrival (Order Id): {orderGroup?.materialArrivalDeptNumber}
                        </h4>}
                        <span className="font-bold text-gray-800 text-xs">
                            Ordering Material (Order Id): {orderGroup.orderMaterialDeptNumber || "Unknown"}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>{totalItems} Items</span>
                            <span className="text-gray-300">|</span>
                            <span className={isFullyVerified ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                                {verifiedCount}/{totalItems} Verified
                            </span>
                        </div>
                    </div> */}


                    <div className="flex flex-col">
                        {/* 1. Main Title: Material Arrival ID */}
                        {orderGroup?.materialArrivalDeptNumber && (
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight leading-none">
                                {orderGroup.materialArrivalDeptNumber}
                            </h4>
                        )}

                        {/* 2. Subtitle: Reference to Original Order */}
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-gray-400 font-medium">Order Material (Order Id):</span>
                            <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                {orderGroup.orderMaterialDeptNumber || "Unknown"}
                            </span>
                        </div>

                        {/* 3. Stats Badges */}
                        <div className="flex items-center gap-2 mt-2.5">

                            {/* Total Items Badge */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                                <i className="fa-solid fa-layer-group text-gray-400"></i>
                                {totalItems} Items
                            </span>

                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wide ${isFullyVerified
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-orange-50 border-orange-200 text-orange-700"
                                }`}>
                                <i className={`fa-solid ${isFullyVerified ? 'fa-circle-check' : 'fa-clock'}`}></i>
                                {isFullyVerified ? "All Verified" : `${verifiedCount}/${totalItems} Verified`}
                            </span>
                        </div>
                    </div>


                </div>

                <div className="text-gray-400">
                    <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </div>
            </div>

            {/* --- Accordion Body (Scrollable Table) --- */}
            {isOpen && (
                <div className="bg-white w-full overflow-hidden">
                    {/* Horizontal Scroll Container */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[50px] text-center">
                                        #
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">
                                        Material Name
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[120px]">
                                        Ordered
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[120px]">
                                        Unit
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[120px]">
                                        Arrived
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[150px]">
                                        Image
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[140px]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orderGroup?.subItems.map((item: any, idx: number) => (
                                    <SubItemRow
                                        key={item._id || idx}
                                        item={item}
                                        idx={idx}
                                        projectId={projectId}
                                        orderNumber={orderGroup.orderMaterialDeptNumber}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialArrivalGroupAccordion;


// --- Sub Component for Row Logic ---
const SubItemRow = ({ item, idx, projectId, orderNumber }: { item: IMaterialOrder, idx: number, projectId: string, orderNumber: string }) => {
    const { mutateAsync: toggleVerification, isPending } = useToggleMaterialVerification();
    const { mutateAsync: updateQuantityStaff, } = useUpdateStaffMaterialArrivalItemQuantity()
    const { mutateAsync: uploadImage, isPending: uploadingImage } = useUpdateStaffMatArrivalItemImage()
    const [showImageModal, setShowImageModal] = useState(false);
    const [arrivedQty, setArrivedQty] = useState(item?.arrivedQuantity || 0);



    const { role, permission } = useAuthCheck();


    // const canDelete = role === "owner" || permission?.materialarrival?.delete;
    // const canList = role === "owner" || permission?.materialarrival?.list;
    const canCreate = role === "owner" || permission?.materialarrival?.create;
    const canEdit = role === "owner" || permission?.materialarrival?.edit;



    // Get the latest image if available
    const latestImage = item.images && item.images.length > 0 ? item.images[item.images.length - 1] : null;

    const handleToggle = async () => {
        try {
            await toggleVerification({
                projectId,
                orderNumber,
                subItemId: item._id,
                toggle: !item.isVerified
            });
            toast({ title: "Success", description: "Status updated" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.message || "Failed", variant: "destructive" });
        }
    };

    const debouncedQty = useDebounce(arrivedQty, 500);


    useEffect(() => {

        if (debouncedQty === item.arrivedQuantity) return;

        const handleQtyChange = async () => {

            try {
                await updateQuantityStaff({
                    projectId,
                    orderNumber,
                    subItemId: item._id,
                    arrivedQuantity: debouncedQty
                });
                toast({ title: "Success", description: "Quantity updated" });
            } catch (error: any) {
                toast({ title: "Error", description: error?.message || "Failed", variant: "destructive" });
            }
        }



        handleQtyChange()

    }, [debouncedQty]);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target?.files?.[0];
            if (!file) return;

            // Validate image type
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Invalid file",
                    description: "Only JPEG, PNG, JPG images are allowed",
                    variant: "destructive",
                });
                return;
            }

            const formData = new FormData();
            formData.append("upload", file); // <-- FIELD NAME MUST MATCH BACKEND


            await uploadImage({
                projectId,
                orderNumber,
                subItemId: item._id,
                formData,
            });

            toast({ description: 'Successfully uploaded images', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to upload images", variant: "destructive" })
        }
    };





    return (
        <tr className={`group transition-colors align-middle ${item.isVerified ? 'bg-green-50/40' : 'hover:bg-gray-50'}`}>

            {/* 1. Serial Number */}
            <td className="px-6 py-4 text-center">
                <span className="text-gray-400 font-mono text-sm">{idx + 1}</span>
            </td>

            {/* 2. Material Name */}
            <td className="px-6 py-4 align-middle">
                <div className="flex flex-col justify-center">
                    <span className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                        {item.subItemName}
                    </span>
                    {item.refId && (
                        <span className="text-[11px] text-gray-400 mt-1 font-mono">
                            ID: {item.refId}
                        </span>
                    )}
                </div>
            </td>

            {/* 3. Ordered Quantity */}
            <td className="px-6 py-4 text-center align-middle">
                <div className="inline-flex flex-col items-center justify-center bg-gray-100 rounded px-3 py-1.5 min-w-[70px]">
                    <span className="font-bold text-gray-700 text-sm">{item.orderedQuantity}</span>
                    {/* <span className="text-[10px] uppercase text-gray-500 font-medium">{item.unit}</span> */}
                </div>
            </td>


            <td className="px-6 py-4 text-center align-middle">
                <div className="inline-flex flex-col items-center justify-center bg-gray-100 rounded px-3 py-1.5 min-w-[70px]">
                    {/* <span className="font-bold text-gray-700 text-sm">{item.orderedQuantity}</span> */}
                    <span className="text-[10px] uppercase text-gray-500 font-medium">{item.unit}</span>
                </div>
            </td>


            {/* 4. Arrived Quantity */}
            {/* <td className="px-6 py-4 text-center align-middle">
                <div className={`inline-flex flex-col items-center justify-center rounded px-3 py-1.5 min-w-[70px] border ${item.arrivedQuantity < item.orderedQuantity ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                    <span className={`font-bold text-sm ${item.arrivedQuantity < item.orderedQuantity ? 'text-orange-600' : 'text-green-600'}`}>
                        {item.arrivedQuantity || 0}
                    </span>
                    <span className="text-[10px] uppercase text-gray-400 font-medium">Arrived</span>
                </div>
            </td>
             */}

            <td className="px-6 py-4 text-center align-middle">
                <div
                    className={`
            flex flex-col items-center justify-center rounded px-3 py-1.5 !border-black 
            ${arrivedQty < item.orderedQuantity ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}
        `}
                >
                    <input
                        type="number"
                        value={arrivedQty}
                        disabled={!canCreate && !canEdit}
                        onChange={(e) => setArrivedQty(Number(e.target.value))}
                        className={`
                            disabled:cursor-not-allowed
                w-full text-center font-semibold text-sm rounded-md 
                bg-white outline-none border px-2 py-1 transition
                ${arrivedQty < item.orderedQuantity ? 'text-orange-600 border-orange-300' : 'text-green-600 border-green-300'}
                focus:ring-2 focus:ring-blue-400
            `}
                    />

                    <span className="text-[10px] uppercase text-gray-400 mt-1 font-medium">
                        Arrived
                    </span>
                </div>
            </td>

            {/* 5. Image (Made Bigger) */}
            <td className="px-6 py-4 text-center align-middle">
                {latestImage ? (
                    <>
                        <div
                            onClick={() => setShowImageModal(true)}
                            className="relative h-20 w-28 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:ring-2 hover:ring-blue-400 transition-all bg-white group-hover:scale-105 duration-200"
                        >
                            <img
                                src={latestImage.url}
                                alt="Proof"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                <i className="fa-solid fa-magnifying-glass-plus text-white opacity-0 hover:opacity-100 shadow-lg"></i>
                            </div>
                        </div>
                        {/* HIDDEN FILE INPUT */}
                        {/* CHANGE IMAGE BUTTON + INPUT */}
                        {(canCreate || canEdit) && <label className="mt-2 block text-xs text-blue-600  cursor-pointer text-center hover:bg-blue-200 bg-blue-50 rounded-2xl w-fit mx-auto px-3">
                            Change Image
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>}
                    </>
                ) : (
                    <div
                        onClick={() => document.getElementById(`img-upload-${item._id}`)?.click()}
                        className="h-20 cursor-pointer w-28 mx-auto rounded-lg bg-gray-100 border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400">
                        {!uploadingImage ?
                            <>
                                <i className="fa-regular fa-image text-xl mb-1"></i>
                                <span className="text-[12px]">No Image</span>
                                <span className="text-[10px]">Click to upload</span>
                            </> :

                            <div>
                                <i className="fas fa-spinner animate-spin text-xl mb-1"></i>

                            </div>
                        }

                        {(canCreate || canEdit) &&
                            <input
                                id={`img-upload-${item._id}`}

                                type="file"
                                multiple={false}
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />}

                    </div>
                )}
            </td>

            {/* 6. Action */}
            <td className="px-6 py-4 text-center align-middle">
                {(canCreate || canEdit) && <Button
                    onClick={handleToggle}
                    disabled={isPending}
                    variant="primary"
                    size="sm"
                    className={`w-full py-2 px-4 text-xs font-semibold rounded-md shadow-sm transition-all ${item.isVerified ? "!bg-green-600" : ""} `}
                >
                    {isPending ? <i className="fa-solid fa-spinner fa-spin"></i> : (
                        <div className="flex items-center justify-center gap-2">
                            <i className={`fa-solid ${item.isVerified ? "fa-check-circle" : "fa-shield-halved"}`}></i>
                            <span>{item.isVerified ? "Verified" : "Verify"}</span>
                        </div>
                    )}
                </Button>}
            </td>

            {/* --- Image Modal --- */}
            {showImageModal && latestImage && (
                <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowImageModal(false)}>
                    <div className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button onClick={() => setShowImageModal(false)} className="bg-black/50 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <div className="bg-gray-900 flex items-center justify-center min-h-[400px]">
                            <img src={latestImage.url} alt="Full view" className="max-w-full max-h-[80vh] object-contain" />
                        </div>
                        <div className="p-4 bg-white border-t flex justify-between items-center">
                            <div>
                                <h5 className="font-bold text-gray-800">{item.subItemName}</h5>
                                <p className="text-sm text-gray-500">{latestImage.originalName || "Uploaded Image"}</p>
                            </div>
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                {dateFormate(latestImage.uploadedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </tr>
    );
};