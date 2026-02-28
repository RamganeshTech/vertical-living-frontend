
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants";
import {
    useDeleteMaterialArrivalImagePublic,
    useGetPublicMaterialArrivalNew,
    // useUpdateMaterialArrivalItemNew,
    useUpdateMaterialArrivalItemV1,
} from "../../../apiList/Stage Api/materialArrivalNewApi";
import { createPortal } from "react-dom";

// --- Interfaces ---
interface SubItem {
    _id: string;
    subItemName: string;
    refId: string;
    orderedQuantity: number;
    arrivedQuantity: number;
    unit: string;
    images: { url: string; originalName: string, _id: string }[];
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
    // const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew();
    const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemV1();
    const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteMaterialArrivalImagePublic();

    // --- Local State ---
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [images, setImages] = useState<Record<string, File[] | null>>({});
    // const [showImageModal, setShowImageModal] = useState<string | null>(null);

    // Update Modal State to store context
    const [galleryContext, setGalleryContext] = useState<{
        images: { url: string; _id: string, }[];
        index: number;
        orderNumber: string;
        subItemId: string;
    } | null>(null);


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

    // Inside PublicMaterialArrival component
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!galleryContext) return;

            if (e.key === "ArrowRight") {
                setGalleryContext(prev => prev ? ({ ...prev, index: (prev.index + 1) % prev.images.length }) : null);
            } else if (e.key === "ArrowLeft") {
                setGalleryContext(prev => prev ? ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }) : null);
            } else if (e.key === "Escape") {
                setGalleryContext(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [galleryContext]);

    const handleQuantityChange = (id: string, value: string) => {
        const numVal = value === "" ? 0 : parseFloat(value);
        setQuantities((prev) => ({ ...prev, [id]: numVal }));
    };

    const handleFileChange = (id: string, fileList: FileList | null) => {
        // setImages((prev) => ({ ...prev, [id]: file }));
        if (!fileList || fileList.length === 0) return;

        // Convert FileList to a standard Array so we can map/forEach it
        const newFiles = Array.from(fileList);

        setImages((prev) => ({
            ...prev,
            [id]: newFiles // Stores the array of selected files
        }));
    };

    const handleUpdate = async (orderNumber: string, subItemId: string) => {
        const arrivedQuantity = quantities[subItemId];

        const selectedFiles = images[subItemId];

        const formData = new FormData();
        if (arrivedQuantity !== undefined) {
            formData.append("arrivedQuantity", String(arrivedQuantity));
        }
        // if (image) {
        //     formData.append("upload", image);
        // }


        // ✅ Append every file in the array to the "upload" key
        if (selectedFiles && selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                formData.append("upload", file);
            });
        }

        // 3. ✅ FIXED VALIDATION: Check for quantity OR the files array length
        const hasQuantityChange = arrivedQuantity !== undefined;
        const hasImageChange = selectedFiles && selectedFiles.length > 0;

        if (!hasQuantityChange && !hasImageChange) {
            toast({
                title: "No Changes",
                description: "Please enter a quantity or select images.",
                variant: "destructive"
            });
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



    // Inside your PublicMaterialArrival component
    const openGallery = (item: SubItem, orderNumber: string, initialIndex: number) => {
        setGalleryContext({
            images: item.images, // The array of images from the backend
            index: initialIndex,
            orderNumber: orderNumber,
            subItemId: item._id
        });
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
                                                        // const latestImage = item.images?.length > 0 ? item.images[item.images.length - 1].url : null;
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
                                                                {/* <td className="px-4 py-4 align-middle">
                                                                    <div className="flex items-center gap-4">
                                                                        <div
                                                                            className="relative w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 group"
                                                                            onClick={() => {
                                                                                if (item.images?.length > 0) {
                                                                                    setGalleryContext({
                                                                                        images: item.images,
                                                                                        index: item.images.length - 1,
                                                                                        orderNumber: order.orderMaterialDeptNumber,
                                                                                        subItemId: item._id
                                                                                    });
                                                                                }
                                                                            }}
                                                                        >
                                                                            {item.images?.length > 0 ? (
                                                                                <>
                                                                                    <img src={item.images[item.images.length - 1].url} className="w-full h-full object-cover" />
                                                                                    {item.images.length > 1 && (
                                                                                        <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                                                            +{item.images.length - 1}
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                                                    <i className="fa-regular fa-image text-xl"></i>
                                                                                </div>
                                                                            )}
                                                                        </div>

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
                                                                </td> */}



                                                                <td className="px-6 py-4 text-center align-middle">
                                                                    {item.images && item.images.length > 0 ? (
                                                                        <div className="flex flex-col items-center">
                                                                            <div
                                                                                // ✅ Triggers the portal with full context
                                                                                onClick={() => openGallery(item, order.orderMaterialDeptNumber, item.images.length - 1)}
                                                                                className="relative h-20 w-28 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:ring-2 hover:ring-blue-400 transition-all bg-white group-hover:scale-105 duration-200"
                                                                            >
                                                                                {/* Show the last uploaded image */}
                                                                                <img src={item.images[item.images.length - 1].url} alt="Proof" className="w-full h-full object-cover" />

                                                                                {/* --- MULTI-IMAGE BADGE --- */}
                                                                                {item.images.length > 1 && (
                                                                                    <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 backdrop-blur-sm">
                                                                                        <i className="fa-solid fa-images text-[8px]"></i>
                                                                                        +{item.images.length - 1}
                                                                                    </div>
                                                                                )}

                                                                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                                                                    <i className="fa-solid fa-magnifying-glass-plus text-white opacity-0 hover:opacity-100 shadow-lg"></i>
                                                                                </div>
                                                                            </div>

                                                                            {/* ✅ "Add Photo" for items that already have some images */}
                                                                            <label className="mt-2 block text-xs text-blue-600 cursor-pointer text-center hover:bg-blue-100 bg-blue-50 rounded-2xl w-fit mx-auto px-3 border border-blue-200">
                                                                                {isPending ? <i className="fas fa-spinner animate-spin"></i> : "Add Photo"}
                                                                                <input
                                                                                    type="file"
                                                                                    multiple
                                                                                    accept="image/*"
                                                                                    className="hidden"
                                                                                    onChange={(e) => handleFileChange(item._id, e.target.files)}
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                    ) : (
                                                                        /* --- NO IMAGE STATE --- */
                                                                        <div className="flex flex-col items-center">
                                                                            <label
                                                                                htmlFor={`img-upload-${item._id}`}
                                                                                className="h-20 cursor-pointer w-28 mx-auto rounded-lg bg-gray-50 border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                                                                            >
                                                                                {isPending ? (
                                                                                    <i className="fas fa-spinner animate-spin text-xl"></i>
                                                                                ) : (
                                                                                    <>
                                                                                        <i className={`${(images[item._id]?.length ?? 0) > 0 ? "fa-solid fa-circle-check" : "fa-regular fa-image"} text-xl mb-1`}></i>
                                                                                        <span className="text-[10px] font-bold tracking-tight px-2 text-center leading-tight">
                                                                                            {(images[item._id]?.length ?? 0) > 0
                                                                                                ? `${images[item._id]!.length} image${images[item._id]!.length > 1 ? 's' : ''} selected`
                                                                                                : "Tap to Upload"}
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                            </label>
                                                                            <input
                                                                                id={`img-upload-${item._id}`}
                                                                                multiple
                                                                                type="file"
                                                                                className="hidden"
                                                                                accept="image/*"
                                                                                onChange={(e) => handleFileChange(item._id, e.target.files)}
                                                                            />
                                                                        </div>
                                                                    )}
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
            {/* {showImageModal && (
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
            )} */}




            {/* --- Gallery Portal Modal --- */}
            {/* {galleryContext && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setGalleryContext(null)}>

                    <div className="absolute top-6 right-6 flex items-center gap-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const img = galleryContext.images[galleryContext.index];
                                window.open(img.url, '_blank');
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md"
                            title="Download"
                        >
                            <i className="fas fa-download text-lg"></i>
                        </button>

                        <button
                            disabled={isDeleting}
                            onClick={async (e) => {
                                e.stopPropagation();
                                const currentImg = galleryContext.images[galleryContext.index];

                                await deleteImage({
                                    projectId: projectId!,
                                    orderNumber: galleryContext.orderNumber,
                                    subItemId: galleryContext.subItemId,
                                    imageId: currentImg._id
                                });

                                // Close or update index
                                if (galleryContext.images.length <= 1) {
                                    setGalleryContext(null);
                                } else {
                                    setGalleryContext(prev => prev ? ({
                                        ...prev,
                                        images: prev.images.filter(img => img._id !== currentImg._id),
                                        index: Math.max(0, prev.index - 1)
                                    }) : null);
                                }
                            }}
                            className="bg-white/10 hover:bg-red-500/40 text-white rounded-full p-3 backdrop-blur-md"
                        >
                            <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash-can"} text-lg`}></i>
                        </button>

                        <button onClick={() => setGalleryContext(null)} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {galleryContext.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryContext(prev => prev ? ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }) : null);
                                }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md"
                            >
                                <i className="fas fa-chevron-left text-2xl"></i>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryContext(prev => prev ? ({ ...prev, index: (prev.index + 1) % prev.images.length }) : null);
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md"
                            >
                                <i className="fas fa-chevron-right text-2xl"></i>
                            </button>
                        </>
                    )}

                    <div className="w-[85vw] h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img src={galleryContext.images[galleryContext.index].url} className="max-w-full max-h-full object-contain shadow-2xl" />
                    </div>
                </div>,
                document.body
            )} */}



            {galleryContext && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setGalleryContext(null)}>

                    {/* Header Actions */}
                    <div className="absolute top-6 right-6 flex items-center gap-4">
                        {/* <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const img = galleryContext.images[galleryContext.index];
                                window.open(img.url, '_blank');
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-all"
                            title="Download"
                        >
                            <i className="fas fa-download text-lg"></i>
                        </button> */}

                        <button
                            disabled={isDeleting}
                            onClick={async (e) => {

                                try {
                                    e.stopPropagation();
                                    const currentImg = galleryContext.images[galleryContext.index];

                                    await deleteImage({
                                        projectId: projectId!,
                                        orderNumber: galleryContext.orderNumber,
                                        subItemId: galleryContext.subItemId,
                                        imageId: currentImg._id
                                    });

                                    if (galleryContext.images.length <= 1) {
                                        setGalleryContext(null);
                                    } else {
                                        setGalleryContext(prev => prev ? ({
                                            ...prev,
                                            images: prev.images.filter(img => img._id !== currentImg._id),
                                            index: Math.max(0, prev.index - 1)
                                        }) : null);
                                    }


                                    toast({ description: 'Successfully deleted', title: "Success" });
                                } catch (error: any) {
                                    toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete images", variant: "destructive" })
                                }

                            }}
                            className="bg-white/10 hover:bg-red-500/40 text-white rounded-full p-3 backdrop-blur-md transition-all"
                        >
                            <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash-alt"} text-lg`}></i>
                        </button>

                        <button onClick={() => setGalleryContext(null)} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-all">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {galleryContext.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryContext(prev => prev ? ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }) : null);
                                }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all active:scale-95"
                            >
                                <i className="fas fa-chevron-left text-2xl"></i>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryContext(prev => prev ? ({ ...prev, index: (prev.index + 1) % prev.images.length }) : null);
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all active:scale-95"
                            >
                                <i className="fas fa-chevron-right text-2xl"></i>
                            </button>
                        </>
                    )}

                    {/* Image Display */}
                    <div className="w-[85vw] h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={galleryContext.images[galleryContext.index].url}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                            alt="Gallery View"
                        />
                    </div>

                    {/* 🆕 Image Counter & Meta (Added this section) */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div className="text-white text-sm bg-blue-600 px-4 py-1.5 rounded-full font-bold shadow-lg">
                            {galleryContext.index + 1} / {galleryContext.images.length}
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default PublicMaterialArrival;