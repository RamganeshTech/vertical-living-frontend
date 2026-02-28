import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { toast } from "../../../utils/toast";
import {
    useGetSingleOrderItem, useOrderHistoryGneratePdf,
    useAddOrderingMaterialHistorySubItem,
    useUpdateOrderingMaterialHistorySubItem,
    useDeleteOrderingMaterialHistorySubItem
    // useOrderHistorySendToProcurement
} from "../../../apiList/Stage Api/orderMaterialHistoryApi";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { downloadImage } from "../../../utils/downloadFile";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import { ProcurementPriorityDropdown } from "./ProcurementPriorityDropdown";
import { dateFormate, formatTime } from "../../../utils/dateFormator";
import { useState } from "react";
import { ORDERMATERIAL_UNIT_OPTIONS } from "./OrderMaterialOverview";


const SingleOrderViewPage = () => {
    const { projectId, orderItemId, organizationId } = useParams<{ projectId: string; orderItemId: string, organizationId: string }>();
    const navigate = useNavigate();


    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.ordermaterial?.delete;
    // const canList = role === "owner" || permission?.ordermaterial?.list;
    const canCreate = role === "owner" || permission?.ordermaterial?.create;
    const canEdit = role === "owner" || permission?.ordermaterial?.edit;

    // --- API Hooks ---
    const { data: orderData, isLoading, isError, refetch } = useGetSingleOrderItem(projectId!, orderItemId!);
    const { mutateAsync: generateLink, isPending: generatePending } = useOrderHistoryGneratePdf();

    // const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurement();

    // const handleSendToProcurement = async () => {
    //     try {

    //         await sendToProcurement({ projectId: projectId!, orderItemId: orderItemId!, organizationId: organizationId! });
    //         toast({ description: 'Sent to Procurement', title: "Success" });
    //     } catch (error: any) {
    //         toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
    //     }
    // };


    // --- Handlers ---
    const handleGeneratePdf = async () => {
        try {
            if (!projectId || !orderItemId) return;
            const res = await generateLink({ projectId, organizationId: orderData?.organizationId, orderItemId });
            // console.log("res", res)
            await downloadImage({ src: res?.pdfUrl, alt: "Order Material" })
            toast({ title: "Success", description: "PDF Generated successfully" });
            refetch(); // Refresh data to show the new link
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || err?.message || "Failed to generate PDF",
                variant: "destructive"
            });
        }
    };

    // const handleDownloadPdf = async () => {
    //     try {

    //         await downloadImage({ src: orderData?.pdfLink?.url, alt: orderData?.pdfLink?.pdfName })
    //         toast({ title: "Success", description: "PDF Downloaded successfully" });
    //     }
    //     catch (err: any) {
    //         toast({
    //             title: "Error",
    //             description: err?.response?.data?.message || err?.message || "Failed to generate PDF",
    //             variant: "destructive"
    //         });
    //     }
    // };




    const [editingCell, setEditingCell] = useState<{
        subItemId: string;
        field: 'name' | 'quantity' | 'unit';
    } | null>(null);

    // --- Mutation Hooks ---
    const { mutateAsync: addSubItem, isPending: isAdding, variables: addVariable } = useAddOrderingMaterialHistorySubItem();
    const { mutateAsync: updateSubItem, isPending: isUpdating, variables: updateVariable } = useUpdateOrderingMaterialHistorySubItem();
    const { mutateAsync: deleteSubItem, isPending: isDeleting, variables: deleteVariable } = useDeleteOrderingMaterialHistorySubItem();

    const handleSaveEdit = async (subItemId: string, field: string, value: any) => {
        try {
            // Find the specific item in the subItems array of the current orderData
            const subItem = subItems?.find((s: any) => s._id === subItemId);
            if (!subItem) return;

            // Construct the full object to prevent backend "erasing"
            const payload = {
                projectId: projectId!,
                orderItemId: orderItemId!, // Crucial for your new backend route
                subItemId: subItemId,
                // Use new value for the active field, otherwise keep existing
                subItemName: field === 'name' ? value : subItem.subItemName,
                quantity: field === 'quantity' ? Number(value) : subItem.quantity,
                unit: field === 'unit' ? value : subItem.unit,
            };

            // Only trigger if something actually changed
            if (subItem[field === 'name' ? 'subItemName' : field] === value) {
                setEditingCell(null);
                return;
            }

            await updateSubItem(payload);
            refetch()
            setEditingCell(null);
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error?.response?.data?.message || "Check your connectivity",
                variant: "destructive"
            });
        }
    };

    const onAddNewAt = async (index: number) => {
        try {


            await addSubItem({
                projectId: projectId!,
                orderItemId: orderItemId!,
                subItemName: "", // Default values to be edited
                quantity: 0,
                unit: "",
                index: index + 1 // Add below current row
            });
            refetch()
            toast({ title: "Success", description: "Row Added Successfully" });
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to added", variant: "destructive" });
        }

    };

    const onDelete = async (subId: string) => {
        try {
            await deleteSubItem({ projectId: projectId!, orderItemId: orderItemId!, subItemId: subId });
            refetch()
            toast({ title: "Success", description: "Deleted Successfully" });
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete", variant: "destructive" });
        }


    };



    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2 text-blue-600">
                    <i className="fas fa-spinner fa-spin text-4xl"></i>
                    <p className="font-medium">Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (isError || !orderData) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Failed to load order details.</p>
                    <Button onClick={() => navigate(-1)} className="mt-4" variant="outline">Go Back</Button>
                </div>
            </div>
        );
    }

    const { shopDetails, deliveryLocationDetails, subItems } = orderData;

    return (
        <div className="min-h-full max-h-full overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans pb-24">
            <div className="max-w-full mx-auto space-y-6">

                {/* --- HEADER --- */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <i className="fa-solid fa-file-invoice text-blue-600"></i>
                                Order Details
                            </h1>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                                {/* Order ID Tag */}
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <span className=" text-[10px] font-bold tracking-widest text-gray-800">Order ID:</span>
                                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                        {orderData.orderMaterialNumber || "N/A"}
                                    </span>
                                </p>

                                {/* Separator (only visible on tablet/desktop) */}
                                <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>

                                {/* Date & Time Badge */}
                                <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                                    <i className="far fa-calendar-alt text-[10px] text-blue-500"></i>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-tight">
                                        {dateFormate(orderData.createdAt)} <span className="mx-1 text-blue-300 opacity-50">|</span> {formatTime(orderData.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex gap-2">
                        {orderData.isSyncWithProcurement && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-200">
                                <i className="fas fa-check-circle"></i> Synced with Procurement
                            </span>
                        )}
                        {orderData.isPublicOrder && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
                                <i className="fas fa-globe"></i> Public Order
                            </span>
                        )}

                        {/* {(canCreate || canEdit) && <Button
                            variant="primary"
                            onClick={handleSendToProcurement}
                            disabled={orderData?.isSyncWithProcurement}
                            title={orderData?.isSyncWithProcurement ? "already sent to procurement" : ""}
                            isLoading={isSending}
                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 disabled:cursor-not-allowed"
                        >
                            Send To Procurement
                        </Button>} */}


                        {(canCreate || canEdit) && (
                            <ProcurementPriorityDropdown
                                ele={orderData}
                                projectId={projectId}
                                organizationId={organizationId}
                                refetch={refetch}
                            />
                        )}

                    </div>



                </header>

                {/* --- SECTION 1: SHOP & DELIVERY --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Shop Card */}
                    <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm">
                        <CardContent className="p-5">
                            <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <i className="fas fa-store text-purple-600"></i> Shop Details
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-semibold">{shopDetails?.shopName || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Contact:</span> <span>{shopDetails?.contactPerson || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-mono">{shopDetails?.phoneNumber || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Location:</span> <span className="truncate max-w-[200px]">{shopDetails?.address || "-"}</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Card */}
                    <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm">
                        <CardContent className="p-5">
                            <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <i className="fas fa-truck text-orange-600"></i> Delivery Location
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between"><span className="text-gray-500">Site:</span> <span className="font-semibold">{deliveryLocationDetails?.siteName || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Supervisor:</span> <span>{deliveryLocationDetails?.siteSupervisor || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-mono">{deliveryLocationDetails?.phoneNumber || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Address:</span> <span className="truncate max-w-[200px]">{deliveryLocationDetails?.address || "-"}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                {(orderData?.images && orderData?.images?.length > 0) && <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-image text-blue-600"></i> Images
                    </h3>

                    {orderData?.images?.length > 0 ? <ImageGalleryExample
                        // handleDeleteFile={(imgId: string) => handleImageDelete(imgId)}
                        imageFiles={orderData?.images}
                        height={150}
                        minWidth={150}
                        maxWidth={200} />
                        :
                        <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
                            No Images uploaded yet.
                        </div>
                    }

                </div>}





                {/* --- SECTION 2: SELECTED UNITS (Expanded UI) --- */}
                {/* <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-cubes text-blue-600"></i> Ordered Items
                    </h3>

                    <div className="grid gap-5">
                        
                        <div className="mt-5 pt-0 animate-in fade-in zoom-in-95 duration-200">
                            <div className="relative overflow-hidden rounded-lg border-2 border-blue-100 bg-white">
                               
                                <div className="grid grid-cols-12 gap-0 bg-blue-50/50 border-b border-blue-100 text-xs font-bold text-blue-800 uppercase tracking-wide">
                                    <div className="col-span-2 px-4 py-3 border-r border-blue-100">Ref ID</div>
                                    <div className="col-span-6 px-4 py-3 border-r border-blue-100">Material Name</div>
                                    <div className="col-span-2 px-4 py-3 border-r border-blue-100 text-center">Qty</div>
                                    <div className="col-span-2 px-4 py-3 text-center">Unit</div>
                                </div>

                                {subItems && subItems.length > 0 ? (
                                    subItems.map((sub: any, sIdx: number) => (
                                        <div key={sub._id || sIdx} className="grid grid-cols-12 gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-100 font-mono text-xs text-gray-500 truncate">
                                                {sub.refId || "-"}
                                            </div>
                                            <div className="col-span-6 px-4 py-3 border-r border-gray-100 font-medium">
                                                {sub.subItemName}
                                            </div>
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-100 text-center">
                                                {sub.quantity}
                                            </div>
                                            <div className="col-span-2 px-4 py-3 border-r border-gray-100 text-center">
                                                {sub.unit}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-400 italic text-sm">
                                        No detailed sub-items found for this unit.
                                    </div>
                                )}
                            </div>
                        </div>
                       
                    </div>
                </div> */}


                {/*  NEW VERSION */}

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-cubes text-blue-600"></i> Ordered Items
                    </h3>

                    <div className="relative overflow-hidden rounded-lg border-2 border-blue-100 bg-white">
                        {/* Header */}
                        <div className="grid grid-cols-12 bg-blue-50/50 border-b border-blue-100 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                            <div className="col-span-1 px-4 py-3 border-r border-blue-100">Ref</div>
                            <div className="col-span-5 px-4 py-3 border-r border-blue-100">Material Name</div>
                            <div className="col-span-2 px-4 py-3 border-r border-blue-100 text-center">Qty</div>
                            <div className="col-span-2 px-4 py-3 border-r border-blue-100 text-center">Unit</div>
                            <div className="col-span-2 px-4 py-3 text-center">Actions</div>
                        </div>

                        {/* Rows */}
                        {subItems?.map((sub: any, sIdx: number) => (
                            <div
                                key={sub._id || sIdx}
                                className={`grid grid-cols-12 border-b border-gray-100 transition-colors text-sm items-center ${orderData.isSyncWithProcurement ? 'opacity-80' : 'hover:bg-blue-50/30'}`}
                            >
                                {/* Ref ID */}
                                <div className="col-span-1 px-4 py-2 border-r border-gray-100 font-semibold text-[10px] text-gray-800">
                                    {sub.refId}
                                </div>

                                {/* Material Name */}
                                {/* Material Name */}
                                <div className="col-span-5 px-4 py-2 border-r border-gray-100">
                                    <input
                                        className="w-full bg-transparent border-none outline-none focus:bg-blue-50/50 rounded px-1 font-medium disabled:cursor-not-allowed transition-colors"
                                        defaultValue={sub.subItemName}
                                        disabled={orderData.isSyncWithProcurement || !canEdit}
                                        placeholder="Enter Item Name"
                                        onBlur={(e) => {
                                            const newValue = e.target.value.trim();
                                            // 🔹 Use the common handleSaveEdit instead of onUpdate
                                            if (newValue !== sub.subItemName && newValue !== "") {
                                                handleSaveEdit(sub._id, 'name', newValue);
                                            } else {
                                                e.target.value = sub.subItemName; // Reset if empty or unchanged
                                            }
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="col-span-2 px-4 py-2 border-r border-gray-100 text-center">
                                    <input
                                        type="number"
                                        className="w-full bg-transparent border-none text-center outline-none focus:bg-blue-50/50 rounded px-1 disabled:cursor-not-allowed transition-colors"
                                        defaultValue={sub.quantity}
                                        disabled={orderData.isSyncWithProcurement || !canEdit}
                                        placeholder="Quantity"
                                        onBlur={(e) => {
                                            const newValue = Number(e.target.value);
                                            // 🔹 Use the common handleSaveEdit instead of onUpdate
                                            if (newValue !== sub.quantity && !isNaN(newValue)) {
                                                handleSaveEdit(sub._id, 'quantity', newValue);
                                            } else {
                                                e.target.value = sub.quantity.toString(); // Reset if invalid
                                            }
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                    />
                                </div>

                                {/* Unit (Dropdown already uses handleSaveEdit) */}

                                {/* Unit */}
                                <div className="col-span-2 px-4 py-2 border-r border-gray-100 text-center">


                                    {/* <div className="col-span-3 border-r border-blue-200"> */}
                                    {editingCell?.subItemId === sub._id && editingCell?.field === 'unit' ? (
                                        <div className="p-2 relative z-50">
                                            <select
                                                autoFocus
                                                defaultValue={sub.unit}
                                                onChange={(e) => handleSaveEdit(sub._id, 'unit', e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                className="w-full relative z-[50] px-3 py-2 border border-blue-400 rounded-md outline-none bg-white text-sm shadow-sm"
                                            >
                                                <option value="" disabled>Select unit</option>
                                                {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                    <option key={unitOption} value={unitOption}>
                                                        {unitOption}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div
                                            className="px-4 py-3 cursor-pointer mx-auto hover:bg-blue-50 transition-colors h-full flex items-center"
                                            onClick={() => {
                                                if (!orderData.isSyncWithProcurement && canEdit) {
                                                    setEditingCell({ subItemId: sub._id, field: 'unit' });
                                                }
                                            }}
                                        >
                                            <p className={!sub.unit ? "text-gray-300 italic text-center" : ""}>
                                                {sub.unit || "Set Unit"}
                                            </p>
                                        </div>
                                    )}
                                    {/* </div> */}
                                </div>

                                {/* Actions Column */}
                                <div className="col-span-2 px-2 py-2 flex items-center justify-center gap-2">

                                    {!orderData.isSyncWithProcurement && canCreate && (
                                        <button
                                            onClick={() => onAddNewAt(sIdx)}
                                            className="p-1.5 cursor-pointer text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            title="Add Item Below"
                                        >
                                            {(isAdding && addVariable.index - 1 === sIdx) ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-plus-circle"></i>}
                                        </button>
                                    )}




                                    {!orderData.isSyncWithProcurement && canEdit && (
                                        <button
                                            onClick={() => onDelete(sub._id)}
                                            className="p-1.5 cursor-pointer text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Item"
                                        >
                                            {/* <i className="fas fa-trash-alt"></i> */}
                                            {isDeleting && deleteVariable.subItemId === sub._id ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-trash-alt"></i>}
                                        </button>
                                    )}

                                    {/* 2. Update/Saving Status (Inline) */}
                                    {isUpdating && updateVariable?.subItemId === sub._id && (
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 animate-pulse bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                            <i className="fas fa-circle-notch fa-spin"></i>
                                            <span className="uppercase tracking-tighter">Saving</span>
                                        </div>
                                    )}

                                    {/* {(isUpdating && updateVariable.subItemId === sub._id ) && <p>saving...</p> } */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SECTION 3: PDF ACTIONS (Sticky Bottom) --- */}
                {/* <section className=" bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                        <div className="text-sm text-gray-600">
                            {pdfLink ? (
                                <span className="flex items-center text-green-600 gap-2 font-medium">
                                    <i className="fas fa-check-circle"></i> PDF is ready for this order.
                                </span>
                            ) : (
                                <span className="flex items-center text-orange-600 gap-2 font-medium">
                                    <i className="fas fa-info-circle"></i> PDF not generated yet.
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            {pdfLink ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(pdfLink.url, '_blank')}
                                        className="w-full sm:w-auto"
                                    >
                                        <i className="fas fa-eye mr-2"></i> View PDF
                                    </Button>
                                    <Button
                                        onClick={handleDownloadPdf}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <i className="fas fa-download mr-2"></i> Download
                                    </Button>
                                    {(canEdit || canCreate) && <Button
                                        variant="ghost"
                                        isLoading={generatePending}
                                        onClick={handleGeneratePdf}
                                        className="text-gray-400 hover:text-blue-600"
                                        title="Regenerate PDF"
                                    >
                                        <i className="fas fa-sync-alt"></i>
                                    </Button>}
                                </>
                            ) : (
                                <>
                                    {(canEdit || canCreate) && <Button
                                        onClick={handleGeneratePdf}
                                        isLoading={generatePending}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
                                    >
                                        <i className="fas fa-file-pdf mr-2"></i> Generate & Save PDF
                                    </Button>}
                                </>
                            )}
                        </div>
                    </div>
                </section> */}

                <section className="bg-white border-t border-gray-200 p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {/* Header with Generate Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Order Documents</h3>
                                <p className="text-xs text-gray-500">View and download existing pdf</p>
                            </div>
                            {(canEdit || canCreate) && (
                                <Button
                                    onClick={handleGeneratePdf}
                                    isLoading={generatePending}
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md"
                                >
                                    <i className="fas fa-file-pdf mr-2"></i> Generate New PDF
                                </Button>
                            )}
                        </div>

                        {/* PDF List Container */}
                        <div className="grid gap-3">
                            {orderData?.pdfLink && orderData.pdfLink.length > 0 ? (
                                orderData.pdfLink.map((pdf: any, index: number) => (
                                    <div
                                        key={pdf._id || index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-file-pdf text-lg"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {pdf.pdfName || `Order_Document_${index + 1}.pdf`}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                                    Generated on: {dateFormate(pdf?.uploadedAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => window.open(pdf.url, '_blank')}
                                            // className="text-blue-600 hover:bg-blue-100 h-8 px-3"
                                            >
                                                <i className="fas fa-eye mr-2"></i> View
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"

                                                onClick={() => downloadImage({ src: pdf.url, alt: pdf.pdfName })}
                                            // className="text-gray-600 hover:bg-gray-100 h-8 px-3"
                                            >
                                                <i className="fas fa-download mr-2"></i> Download
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                                    <i className="fas fa-file-import text-gray-300 text-3xl mb-2"></i>
                                    <p className="text-sm text-gray-500">No PDFs have been generated for this order yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SingleOrderViewPage;