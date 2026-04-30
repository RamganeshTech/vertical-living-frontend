import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
// import { NO_IMAGE } from "../../../constants/constants";
import { useToggleMaterialVerification, useUpdateStaffMaterialArrivalItemQuantity, useUpdateStaffMatArrivalItemImageV1, useDeleteStaffMatArrivalItemImageV1, useSyncMaterialArrivalToAccounts } from "../../../apiList/Stage Api/materialArrivalNewApi"; // Adjust path
import { toast } from "../../../utils/toast";
import { dateFormate } from "../../../utils/dateFormator";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import { createPortal } from "react-dom";



//  working in the single chagnes i havehwflslk;wklfnls sldnflsnfl;sd lsndfl;sjdf;ljdsa ;ldfl;skdl
interface Props {
    orderGroup: IMaterialOrdered;
    projectId: string;
}

export interface IUploadFile {
    type: "image" | "pdf";
    url: string;
    originalName?: string;
    uploadedAt: string;
    _id: string,
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

    const { mutateAsync: syncToAccounts, isPending } = useSyncMaterialArrivalToAccounts();

    // Handle the sync action
    const handleSyncToAccounts = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the accordion from toggling when clicking the button
        // if (orderGroup?.materialArrivalDeptNumber) {
        //     syncToAccounts({
        //         projectId,
        //         payload: { materialArrivalDeptNumber: orderGroup.materialArrivalDeptNumber }
        //     });
        // }

        try {
            await syncToAccounts({
                projectId,
                payload: { materialArrivalDeptNumber: orderGroup.materialArrivalDeptNumber! }
            });
            toast({ title: "Success", description: "Details sent to Accounts Department" });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || error?.message || "operation failed"
            });
        }
    };


    // Calculate Group Stats
    const totalItems = orderGroup.subItems?.length || 0;
    const verifiedCount = orderGroup.subItems?.filter((i: any) => i.isVerified).length || 0;
    const isFullyVerified = totalItems > 0 && totalItems === verifiedCount;


    return (
        // <div className={`border border-gray-200 rounded-xl bg-white shadow-sm mb-6 transition-all duration-200 overflow-hidden ${isOpen ? 'ring-1 ring-gray-200' : ''}`}>
        <div className={`border rounded-xl shadow-sm mb-6 transition-all duration-200 overflow-hidden bg-brand-surface ${isOpen ? 'border-ash-dark' : 'border-ash-medium'}`}>

            {/* --- Accordion Header --- */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                // className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 cursor-pointer bg-brand-surface hover:bg-brand-ash transition-colors border-b border-ash-light gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm border ${isFullyVerified ? 'bg-brand-surface border-action-success/30 text-action-success' : 'bg-brand-ash border-ash-medium text-text-muted'}`}>
                        <i className={`fa-solid ${isFullyVerified ? 'fa-clipboard-check' : 'fa-clipboard-list'}`}></i>
                    </div>



                    <div className="flex flex-col">
                        {/* 1. Main Title: Material Arrival ID */}
                        <div className="flex items-center gap-3 mb-1.5">
                            {orderGroup?.materialArrivalDeptNumber && (
                                // <h4 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight leading-none">
                                <h4 className="font-bold text-text-main text-lg tracking-tight leading-none mb-1.5 truncate">
                                    {orderGroup.materialArrivalDeptNumber}
                                </h4>
                            )}


                            {/* --- NEW SYNC BUTTON --- */}
                            <Button
                                onClick={handleSyncToAccounts}
                                isLoading={isPending}
                                variant="dark"
                            // className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sync Accounts
                            </Button>
                        </div>

                        {/* 2. Subtitle: Reference to Original Order */}
                        <div className="flex items-center gap-1.5 mt-1">
                            {/* <span className="text-xs text-gray-400 font-medium">Order Material (Order Id):</span> */}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Order Ref:</span>
                            {/* <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100"> */}
                            <span className="text-xs font-mono font-bold text-text-main bg-brand-ash px-2 py-0.5 rounded border border-ash-light">
                                {orderGroup.orderMaterialDeptNumber || "Unknown"}
                            </span>
                        </div>

                        {/* 3. Stats Badges */}
                        <div className="flex items-center gap-2 mt-2.5">

                            {/* Total Items Badge */}
                            {/* <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                                <i className="fa-solid fa-layer-group text-gray-400"></i>
                                {totalItems} Items
                            </span> */}

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-ash border border-ash-light text-[10px] font-bold text-text-main uppercase tracking-wide">
                                <i className="fa-solid fa-layer-group text-text-muted"></i> {totalItems} Items
                            </span>

                            {/* Status Badge */}
                            {/* <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wide ${isFullyVerified
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-orange-50 border-orange-200 text-orange-700"
                                }`}>
                                <i className={`fa-solid ${isFullyVerified ? 'fa-circle-check' : 'fa-clock'}`}></i>
                                {isFullyVerified ? "All Verified" : `${verifiedCount}/${totalItems} Verified`}
                            </span> */}

                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wide ${isFullyVerified ? "bg-brand-surface border-action-success/30 text-action-success" : "bg-brand-ash border-ash-medium text-text-muted"}`}>
                                <i className={`fa-solid ${isFullyVerified ? 'fa-circle-check' : 'fa-clock'}`}></i>
                                {isFullyVerified ? "All Verified" : `${verifiedCount}/${totalItems} Verified`}
                            </span>
                        </div>
                    </div>


                </div>

                {/* <div className="text-gray-400">
                    <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </div> */}

                <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-ash border border-ash-light text-[11px] font-bold text-text-main uppercase tracking-wide shadow-sm">
                        <i className="fa-solid fa-layer-group text-text-muted"></i> {totalItems} Items
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[11px] font-bold uppercase tracking-wide shadow-sm ${isFullyVerified ? "bg-brand-surface border-action-success/30 text-action-success" : "bg-brand-ash border-ash-medium text-text-muted"}`}>
                        <i className={`fa-solid ${isFullyVerified ? 'fa-circle-check' : 'fa-clock'}`}></i>
                        {isFullyVerified ? "All Verified" : `${verifiedCount}/${totalItems} Verified`}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-surface border border-ash-medium shadow-sm ml-2">
                        <i className={`fa-solid fa-chevron-down text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                    </div>
                </div>

            </div>

            {/* --- Accordion Body (Scrollable Table) --- */}
            {isOpen && (
                // <div className="bg-white w-full overflow-hidden">
                <div className="bg-brand-surface w-full overflow-hidden">
                    {/* Horizontal Scroll Container */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            {/* <thead className="bg-gray-50 border-b border-gray-200"> */}
                            <thead className="bg-brand-ash border-b border-ash-medium">
                                <tr>
                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[50px] text-center"> */}
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider w-[50px] text-center border-r border-ash-light">
                                        #
                                    </th>
                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]"> */}
                                    <th className="px-5 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider min-w-[200px] border-r border-ash-light">
                                        Material Name
                                    </th>
                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[120px]"> */}
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center min-w-[100px] border-r border-ash-light">
                                        Ordered
                                    </th>

                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[120px]"> */}
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center min-w-[100px] border-r border-ash-light">
                                        Unit
                                    </th>

                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[120px]"> */}
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center min-w-[120px] border-r border-ash-light">
                                        Arrived
                                    </th>
                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[150px]"> */}
                                    <th className="px-5 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center min-w-[160px] border-r border-ash-light">
                                        Image
                                    </th>
                                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center min-w-[140px]"> */}
                                    <th className="px-5 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center min-w-[140px]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ash-light">
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
    // const { mutateAsync: uploadImage, isPending: uploadingImage } = useUpdateStaffMatArrivalItemImage()
    const { mutateAsync: uploadImage, isPending: uploadingImage } = useUpdateStaffMatArrivalItemImageV1()
    const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteStaffMatArrivalItemImageV1();


    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const [showImageModal, setShowImageModal] = useState(false);
    const [arrivedQty, setArrivedQty] = useState(item?.arrivedQuantity || 0);



    const { role, permission } = useAuthCheck();


    // const canDelete = role === "owner" || permission?.materialarrival?.delete;
    // const canList = role === "owner" || permission?.materialarrival?.list;
    const canCreate = role === "owner" || permission?.materialarrival?.create;
    const canEdit = role === "owner" || permission?.materialarrival?.edit;



    // Get the latest image if available
    // const latestImage = item.images && item.images.length > 0 ? item.images[item.images.length - 1] : null;

    const images = item.images || [];
    const latestImage = images && images.length > 0 ? images[images.length - 1] : null;
    const currentImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;



    // --- Gallery Navigation Logic ---
    const openGallery = (index: number) => {
        setSelectedImageIndex(index);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedImageIndex(null);
    };

    const goToNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        }
    };

    const goToPrevious = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPopupOpen) return;
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "Escape") closePopup();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPopupOpen, selectedImageIndex]);


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
            const files = e.target?.files;
            if (!files || files.length === 0) return;

            // // Validate image type
            // if (!file.type.startsWith("image/")) {
            //     toast({
            //         title: "Invalid file",
            //         description: "Only JPEG, PNG, JPG images are allowed",
            //         variant: "destructive",
            //     });
            //     return;
            // }

            const formData = new FormData();
            // formData.append("upload", file); // <-- FIELD NAME MUST MATCH BACKEND

            // 2. Loop through all selected files and append them
            // IMPORTANT: The key must be "upload" to match your router .array("upload")
            Array.from(files).forEach((file) => {
                // Optional: Internal validation
                if (file.type.startsWith("image/")) {
                    formData.append("upload", file);
                }
            });


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


    const handleDelete = async (imageId: string) => {
        try {

            await deleteImage({
                projectId,
                orderNumber,
                subItemId: item._id,
                imageid: imageId
            });

            // If the deleted image was the last one, close the popup
            if (images.length <= 1) {
                closePopup();
            } else {
                goToPrevious(); // Move to the previous image after deletion
            }
            toast({ description: 'Successfully deleted', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete images", variant: "destructive" })
        }
    };




    return (
        // <tr className={`group transition-colors align-middle ${item.isVerified ? 'bg-green-50/40' : 'hover:bg-gray-50'}`}>
        <tr className={`group transition-colors align-middle ${item.isVerified ? 'bg-brand-ash/40' : 'hover:bg-brand-ash/20 bg-brand-surface'}`}>

            {/* 1. Serial Number */}
            {/* <td className="px-6 py-4 text-center">
                <span className="text-gray-400 font-mono text-sm">{idx + 1}</span>
            </td> */}

            <td className="px-4 py-4 text-center border-r border-ash-light">
                <span className="text-text-muted font-mono font-bold text-xs">{idx + 1}</span>
            </td>

            {/* 2. Material Name */}
            {/* <td className="px-6 py-4 align-middle"> */}
            <td className="px-5 py-4 align-middle border-r border-ash-light">
                <div className="flex flex-col justify-center">
                    {/* <span className="font-semibold text-gray-800 text-sm md:text-base leading-tight"> */}
                    <span className="font-bold text-text-main text-sm leading-tight">
                        {item.subItemName}
                    </span>
                    {item.refId && (
                        // <span className="text-[11px] text-gray-400 mt-1 font-mono">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1 bg-brand-ash w-fit px-1.5 py-0.5 rounded border border-ash-light">
                            ID: {item.refId}
                        </span>
                    )}
                </div>
            </td>

            {/* <td className="px-6 py-4 text-center align-middle">
                <div className="inline-flex flex-col items-center justify-center bg-gray-100 rounded px-3 py-1.5 min-w-[70px]">
                    <span className="font-bold text-gray-700 text-sm">{item.orderedQuantity}</span>
                </div>
            </td>


            <td className="px-6 py-4 text-center align-middle">
                <div className="inline-flex flex-col items-center justify-center bg-gray-100 rounded px-3 py-1.5 min-w-[70px]">
                    <span className="text-[10px] uppercase text-gray-500 font-medium">{item.unit}</span>
                </div>
            </td> */}

            <td className="px-4 py-4 text-center align-middle border-r border-ash-light">
                <div className="inline-flex items-center justify-center bg-brand-ash rounded-md px-4 py-1.5 min-w-[70px] border border-ash-medium shadow-sm">
                    <span className="font-mono font-bold text-text-main text-sm">{item.orderedQuantity}</span>
                </div>
            </td>

            {/* 4. Unit */}
            <td className="px-4 py-4 text-center align-middle border-r border-ash-light">
                <div className="inline-flex items-center justify-center bg-brand-surface rounded-md px-3 py-1.5 min-w-[70px] border border-ash-medium shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{item.unit}</span>
                </div>
            </td>




            {/* <td className="px-6 py-4 text-center align-middle">
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
            </td> */}

            {/* 5. Arrived Qty Input */}
            <td className="px-4 py-4 text-center align-middle border-r border-ash-light">
                <div className={`flex flex-col items-center justify-center rounded-lg px-2 py-1.5 border shadow-sm transition-all ${arrivedQty < item.orderedQuantity ? 'bg-brand-surface border-action-danger text-action-danger' : 'bg-brand-surface border-action-success/30 text-text-main'
                    }`}>
                    <input
                        type="number"
                        value={arrivedQty}
                        disabled={!canCreate && !canEdit}
                        onChange={(e) => setArrivedQty(Number(e.target.value))}
                        className={`w-full text-center font-mono font-bold text-sm rounded-md bg-transparent outline-none py-1 transition-all disabled:cursor-not-allowed`}
                    />
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-70">
                        Arrived
                    </span>
                </div>
            </td>



            {/*  NEW VERSION */}

            {/* <td className="px-6 py-4 text-center align-middle">
                {latestImage ? (
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => openGallery(images.length - 1)}
                            className="relative h-20 w-28 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:ring-2 hover:ring-blue-400 transition-all bg-white group-hover:scale-105 duration-200"
                        >
                            <img src={latestImage.url} alt="Proof" className="w-full h-full object-cover" />
                            {images.length > 1 && (
                                <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 backdrop-blur-sm">
                                    <i className="fa-solid fa-images text-[8px]"></i>
                                    +{images.length - 1}
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                <i className="fa-solid fa-magnifying-glass-plus text-white opacity-0 hover:opacity-100 shadow-lg"></i>
                            </div>
                        </div>

                        {(canCreate || canEdit) && (
                            <label className="mt-2 block text-xs text-blue-600 cursor-pointer text-center hover:bg-blue-100 bg-blue-50 rounded-2xl w-fit mx-auto px-3 border border-blue-200">
                                {uploadingImage ? <i className="fas fa-spinner animate-spin"></i> : "Add Photo"}
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                ) : (
                    <>
                        <label
                            htmlFor={`img-upload-${item._id}`}
                            className="h-20 cursor-pointer w-28 mx-auto rounded-lg bg-gray-50 border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                            {uploadingImage ? (
                                <i className="fas fa-spinner animate-spin text-xl"></i>
                            ) : (
                                <>
                                    <i className="fa-regular fa-image text-xl mb-1"></i>
                                    <span className="text-[10px] font-medium tracking-tight">Tap to Upload</span>
                                </>
                            )}
                        </label>
                        <input id={`img-upload-${item._id}`}
                            multiple
                            type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </>
                )}
            </td> */}

            <td className="px-5 py-4 text-center align-middle border-r border-ash-light">
                {latestImage ? (
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => openGallery(images.length - 1)}
                            className="relative h-16 w-24 mx-auto rounded-lg border border-ash-medium overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:ring-2 hover:ring-text-muted transition-all bg-brand-ash group-hover:scale-105 duration-200"
                        >
                            <img src={latestImage.url} alt="Proof" className="w-full h-full object-cover" />

                            {/* MULTI-IMAGE BADGE */}
                            {images.length > 1 && (
                                <div className="absolute top-1 right-1 bg-brand-main/80 text-text-main text-[9px] px-1.5 py-0.5 rounded border border-ash-medium font-bold flex items-center gap-1 backdrop-blur-sm">
                                    <i className="fa-solid fa-images text-[8px]"></i>
                                    +{images.length - 1}
                                </div>
                            )}

                            <div className="absolute inset-0 bg-brand-main/0 hover:bg-brand-main/30 transition-colors flex items-center justify-center">
                                <i className="fa-solid fa-magnifying-glass-plus text-text-main opacity-0 hover:opacity-100 drop-shadow-md"></i>
                            </div>
                        </div>

                        {(canCreate || canEdit) && (
                            <label className="mt-2.5 block text-[10px] font-bold uppercase tracking-wider text-text-main cursor-pointer text-center hover:bg-brand-ash bg-brand-surface rounded-md w-fit mx-auto px-3 py-1 border border-ash-medium shadow-sm transition-all">
                                {uploadingImage ? <i className="fas fa-circle-notch fa-spin text-text-muted"></i> : "Add Photo"}
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                ) : (
                    <>
                        <label
                            htmlFor={`img-upload-${item._id}`}
                            className="h-16 cursor-pointer w-24 mx-auto rounded-lg bg-brand-ash border border-ash-medium border-dashed flex flex-col items-center justify-center text-text-muted hover:bg-brand-surface hover:border-text-muted transition-all shadow-sm"
                        >
                            {uploadingImage ? (
                                <i className="fas fa-circle-notch fa-spin text-lg"></i>
                            ) : (
                                <>
                                    <i className="fa-regular fa-image text-lg mb-1"></i>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
                                </>
                            )}
                        </label>
                        <input id={`img-upload-${item._id}`} multiple type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </>
                )}
            </td>



            {/* 6. Action */}
            {/* <td className="px-6 py-4 text-center align-middle">
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
            </td> */}

            <td className="px-5 py-4 text-center align-middle">
                {(canCreate || canEdit) && (
                    <Button
                        onClick={handleToggle}
                        disabled={isPending}
                        variant={item.isVerified ? "dark" : "white"}
                        size="sm"
                        className={`w-full py-2 px-3 text-xs shadow-sm transition-all border-ash-medium ${item.isVerified ? "bg-action-success border-action-success hover:bg-action-success/90 text-white" : "text-text-main"}`}
                    >
                        {isPending ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (
                            <div className="flex items-center justify-center gap-1.5">
                                <i className={`fa-solid ${item.isVerified ? "fa-check-circle" : "fa-shield-halved text-text-muted"}`}></i>
                                <span>{item.isVerified ? "Verified" : "Verify"}</span>
                            </div>
                        )}
                    </Button>
                )}
            </td>

            {/* --- Image Modal --- */}
            {showImageModal && latestImage && (
                <div className="fixed inset-0 bg-brand-main/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowImageModal(false)}>
                    <div className="relative max-w-4xl w-full bg-brand-surface border border-ash-medium rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button onClick={() => setShowImageModal(false)}
                                // className="bg-black/50 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                className="bg-brand-surface/80 backdrop-blur-md border border-ash-medium text-text-main hover:bg-action-danger hover:text-white hover:border-action-danger rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-md"
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                        {/* <div className="bg-gray-900 flex items-center justify-center min-h-[400px]"> */}
                        <div className="bg-brand-ash flex items-center justify-center min-h-[400px] border-b border-ash-medium p-4 sm:p-6">
                            <img src={latestImage.url} alt="Full view"
                                // className="max-w-full max-h-[80vh] object-contain" 
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm bg-brand-surface border border-ash-light"
                            />
                        </div>
                        {/* <div className="p-4 bg-white border-t flex justify-between items-center"> */}
                        <div className="p-5 bg-brand-surface flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                {/* <h5 className="font-bold text-gray-800"> */}
                                <h5 className="font-bold text-text-main text-lg leading-tight mb-1">
                                    {item.subItemName}</h5>
                                <p className="text-sm font-bold text-text-muted">{latestImage.originalName || "Uploaded Image"}</p>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-text-main bg-brand-ash border border-ash-medium px-3 py-1.5 rounded-md shadow-sm whitespace-nowrap">
                                <i className="fa-regular fa-calendar mr-1.5 text-text-muted"></i>
                                {dateFormate(latestImage.uploadedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            )}




            {/* --- GALLERY PORTAL MODAL --- */}
            {/* {isPopupOpen && currentImage &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm" onClick={closePopup}>
                        <div className="absolute top-6 right-6 flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete((currentImage)._id); }}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md"
                            >
                               {isDeleting ? <i className="fas fa-spinner animate-spin text-lg"></i>:  <i className="fas fa-trash-alt text-lg"></i>}
                            </button>


                            <button onClick={closePopup} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all active:scale-95"
                                >
                                    <i className="fas fa-chevron-left text-2xl"></i>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all active:scale-95"
                                >
                                    <i className="fas fa-chevron-right text-2xl"></i>
                                </button>
                            </>
                        )}

                        <div className="w-[85vw] h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={currentImage.url}
                                alt="Proof Detail"
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                            />
                        </div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                            <div className="text-white/60 text-[10px] uppercase tracking-widest bg-black/40 px-3 py-1 rounded-md">
                                Uploaded: {new Date(currentImage.uploadedAt).toLocaleDateString()}
                            </div>
                            <div className="text-white text-sm bg-blue-600 px-4 py-1.5 rounded-full font-bold shadow-lg">
                                {selectedImageIndex! + 1} / {images.length}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            } */}

            {isPopupOpen && currentImage &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] bg-brand-main/90 flex items-center justify-center backdrop-blur-md" onClick={closePopup}>

                        {/* Close & Action Header */}
                        <div className="absolute top-6 right-6 flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete((currentImage)._id); }}
                                className="bg-brand-surface border border-action-danger text-action-danger hover:bg-action-danger hover:text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
                            >
                                {isDeleting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-trash-can"></i>}
                            </button>

                            <button onClick={closePopup} className="bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all">
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all active:scale-95"
                                >
                                    <i className="fas fa-chevron-left text-xl pr-0.5"></i>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all active:scale-95"
                                >
                                    <i className="fas fa-chevron-right text-xl pl-0.5"></i>
                                </button>
                            </>
                        )}

                        {/* Image Display */}
                        <div className="w-[85vw] h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={currentImage.url}
                                alt="Proof Detail"
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-xl border border-ash-medium bg-brand-surface"
                            />
                        </div>

                        {/* Image Counter & Meta */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                            <div className="text-text-main text-[10px] font-bold uppercase tracking-widest bg-brand-surface border border-ash-medium px-4 py-1.5 rounded-lg shadow-md">
                                Uploaded: {dateFormate(currentImage.uploadedAt)}
                            </div>
                            <div className="text-text-main text-sm bg-brand-surface border border-ash-medium px-5 py-2 rounded-full font-bold shadow-lg">
                                {selectedImageIndex! + 1} / {images.length}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

        </tr>



    );
};