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
import SendToBillSection from "./SendToBillSection";


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
            // <div className="min-h-screen flex items-center justify-center bg-gray-50">
            //     <div className="flex flex-col items-center gap-2 text-blue-600">
            //         <i className="fas fa-spinner fa-spin text-4xl"></i>
            //         <p className="font-medium">Loading Order Details...</p>
            //     </div>
            // </div>

            <div className="min-h-screen flex items-center justify-center bg-brand-main">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                    <i className="fas fa-circle-notch fa-spin text-3xl"></i>
                    <p className="font-bold text-sm uppercase tracking-wider">Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (isError || !orderData) {
        return (
            // <div className="p-8 text-center">
            //     <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
            //         <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
            //         <p>Failed to load order details.</p>
            //         <Button onClick={() => navigate(-1)} className="mt-4" variant="outline">Go Back</Button>
            //     </div>
            // </div>

            <div className="p-8 text-center bg-brand-main min-h-screen">
                <div className="bg-brand-surface border border-action-danger text-action-danger p-6 rounded-xl inline-flex flex-col items-center shadow-sm">
                    <i className="fas fa-triangle-exclamation text-3xl mb-3"></i>
                    <p className="font-bold text-text-main mb-4">Failed to load order details.</p>
                    <Button onClick={() => navigate(-1)} variant="outline" className="border-ash-medium text-text-main hover:bg-brand-ash">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const { shopDetails, deliveryLocationDetails, subItems } = orderData;

    return (
        // <div className="min-h-full max-h-full overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans pb-24">
        <div className="min-h-full max-h-full overflow-y-auto bg-brand-main p-4 sm:p-6 lg:p-8 font-sans pb-24 custom-scrollbar">
            <div className="max-w-full mx-auto space-y-6">

                {/* --- HEADER --- */}
                {/* <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200"> */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-brand-surface p-4 rounded-xl shadow-sm border border-ash-medium">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            // className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            className="w-10 h-10 p-0 shrink-0 border-ash-medium text-text-muted hover:text-text-main shadow-sm"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3"> */}
                            <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3 leading-tight">
                                <i className="fa-solid fa-file-invoice text-brnad-main"></i>
                                Order Details
                            </h1>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                                {/* Order ID Tag */}
                                {/* <p className="text-sm text-gray-500 flex items-center gap-1.5"> */}
                                <div className="text-sm text-text-muted flex items-center gap-2">
                                    <span className=" text-[10px] font-bold tracking-widest text-gray-800">Order ID:</span>
                                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                        {orderData.orderMaterialNumber || "N/A"}
                                    </span>
                                </div>

                                {/* Separator (only visible on tablet/desktop) */}
                                <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>

                                {/* Date & Time Badge */}
                                {/* <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                                    <i className="far fa-calendar-alt text-[10px] text-blue-500"></i>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-tight">
                                        {dateFormate(orderData.createdAt)} <span className="mx-1 text-blue-300 opacity-50">|</span> {formatTime(orderData.createdAt)}
                                    </span>
                                </div> */}

                                <div className="flex items-center gap-2 px-2.5 py-1 bg-brand-ash rounded-md border border-ash-light shadow-sm">
                                    <i className="far fa-calendar-alt text-[10px] text-text-muted"></i>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-text-main uppercase tracking-tight">
                                        {dateFormate(orderData.createdAt)} <span className="mx-1 text-text-muted opacity-50">|</span> {formatTime(orderData.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {/* <div className="flex gap-2"> */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        {orderData.isSyncWithProcurement && (
                            // <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-200">
                            <span className="px-3 py-1.5 bg-brand-surface text-action-success rounded-md text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 border border-action-success/30 shadow-sm">
                                <i className="fas fa-check-circle"></i> Synced with Procurement
                            </span>
                        )}
                        {orderData.isPublicOrder && (
                            // <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
                            <span className="px-3 py-1.5 bg-brand-ash text-text-main rounded-md text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 border border-ash-medium shadow-sm">
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


                        <SendToBillSection 
                        ele={orderData}
                                projectId={projectId}
                                organizationId={organizationId}
                                refetch={refetch} />


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
                    {/* <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm"> */}
                    <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl">
                        <CardContent className="p-5">
                            {/* <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2"> */}
                            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2 border-b border-ash-light pb-3">
                                <i className="fas fa-store text-text-muted"></i> Shop Details
                            </h3>
                            <div className="space-y-2 text-sm text-text-main">
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Name:</span> <span className="font-semibold">{shopDetails?.shopName || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Contact:</span> <span>{shopDetails?.contactPerson || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Phone:</span> <span className="font-mono">{shopDetails?.phoneNumber || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Location:</span> <span className="truncate max-w-[200px]">{shopDetails?.address || "-"}</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Card */}
                    {/* <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm"> */}
                    <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl">
                        <CardContent className="p-5">
                            {/* <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2"> */}
                            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2 border-b border-ash-light pb-3">
                                <i className="fas fa-truck text-text-muted text-sm"></i> Delivery Location
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Site:</span> <span className="font-semibold">{deliveryLocationDetails?.siteName || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Supervisor:</span> <span>{deliveryLocationDetails?.siteSupervisor || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Phone:</span> <span className="font-mono">{deliveryLocationDetails?.phoneNumber || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted font-medium">Address:</span> <span className="truncate max-w-[200px]">{deliveryLocationDetails?.address || "-"}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                {(orderData?.images && orderData?.images?.length > 0) && 
                // <div className="space-y-4">
                //     <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                //         <i className="fas fa-image text-blue-600"></i> Images
                //     </h3>

                <div className="space-y-4 bg-brand-surface p-6 rounded-xl border border-ash-medium shadow-sm">
                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                            <i className="fas fa-images text-text-muted"></i> Attached Images
                        </h3>

                    {orderData?.images?.length > 0 ? <ImageGalleryExample
                        // handleDeleteFile={(imgId: string) => handleImageDelete(imgId)}
                        imageFiles={orderData?.images}
                        height={150}
                        minWidth={150}
                        maxWidth={200} />
                        :
                        <div className="text-text-muted text-sm font-medium bg-brand-ash py-8 rounded-xl text-center border border-dashed border-ash-medium">
                                No Images uploaded yet.
                            </div>
                        
                    }

                </div>}





             

                {/*  NEW VERSION */}

                <div className="space-y-4">
                    {/* <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-cubes text-blue-600"></i> Ordered Items
                    </h3> */}

                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <i className="fas fa-cubes text-text-muted"></i> Ordered Items
                    </h3>

                    {/* <div className="relative overflow-hidden rounded-lg border-2 border-blue-100 bg-white"> */}
                    <div className="relative overflow-hidden rounded-xl border border-ash-medium bg-brand-surface shadow-sm">
                        {/* Header */}
                        <div className="grid grid-cols-12 bg-blue-50/50 border-b border-blue-100 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                            <div className="col-span-1 px-4 py-3 border-r border-ash-light">Ref</div>
                            <div className="col-span-5 px-4 py-3 border-r border-ash-light">Material Name</div>
                            <div className="col-span-2 px-4 py-3 border-r border-ash-light text-center">Qty</div>
                            <div className="col-span-2 px-4 py-3 border-r border-ash-light text-center">Unit</div>
                            <div className="col-span-2 px-4 py-3 text-center">Actions</div>
                        </div>

                        {/* Rows */}
                        {subItems?.map((sub: any, sIdx: number) => (
                            <div
                                key={sub._id || sIdx}
                                // className={`grid grid-cols-12 border-b border-gray-100 transition-colors text-sm items-center ${orderData.isSyncWithProcurement ? 'opacity-80' : 'hover:bg-blue-50/30'}`}
                                className={`grid grid-cols-12 transition-colors text-sm items-center ${orderData.isSyncWithProcurement ? 'opacity-80 bg-brand-ash/30' : 'hover:bg-brand-ash/50'}`}
                            >
                                {/* Ref ID */}
                                {/* <div className="col-span-1 px-4 py-2 border-r border-gray-100 font-semibold text-[10px] text-gray-800"> */}
                                <div className="col-span-1 px-2 py-3 border-r border-ash-light font-mono font-bold text-xs text-text-muted text-center">
                                    {sub.refId}
                                </div>

                                {/* Material Name */}
                                {/* <div className="col-span-5 px-4 py-2 border-r border-gray-100"> */}
                                <div className="col-span-5 px-3 py-2 border-r border-ash-light">
                                    <input
                                        // className="w-full bg-transparent border-none outline-none focus:bg-blue-50/50 rounded px-1 font-medium disabled:cursor-not-allowed transition-colors"
                                        className="w-full bg-transparent border border-transparent outline-none  rounded-md px-2 py-1 font-medium text-text-main disabled:cursor-not-allowed transition-all"
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
                                {/* <div className="col-span-2 px-4 py-2 border-r border-gray-100 text-center"> */}
                                <div className="col-span-2 px-3 py-2 border-r border-ash-light">
                                    <input
                                        type="number"
                                        // className="w-full bg-transparent border-none text-center outline-none focus:bg-blue-50/50 rounded px-1 disabled:cursor-not-allowed transition-colors"
                                        className="w-full bg-transparent border border-transparent text-center outline-none  rounded-md px-2 py-1 font-mono font-bold text-text-main disabled:cursor-not-allowed transition-all"
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
                                {/* <div className="col-span-2 px-4 py-2 border-r border-gray-100 text-center"> */}
                                <div className="col-span-2 px-3 py-2 border-r border-ash-light text-center h-full">


                                    {/* <div className="col-span-3 border-r border-blue-200"> */}
                                    {editingCell?.subItemId === sub._id && editingCell?.field === 'unit' ? (
                                        <div className="p-2 relative z-50">
                                            <select
                                                autoFocus
                                                defaultValue={sub.unit}
                                                onChange={(e) => handleSaveEdit(sub._id, 'unit', e.target.value)}
                                                onBlur={() => setEditingCell(null)}
                                                // className="w-full relative z-[50] px-3 py-2 border border-blue-400 rounded-md outline-none bg-white text-sm shadow-sm"
                                                className="w-full relative z-[50] px-2 py-1 border border-ash-medium rounded-md outline-none bg-brand-surface text-sm text-text-main shadow-sm cursor-pointer"
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
                                            // className="px-4 py-3 cursor-pointer mx-auto hover:bg-blue-50 transition-colors h-full flex items-center"
                                            className="px-2 py-1.5 cursor-pointer rounded-md  transition-colors h-full flex items-center justify-center border border-transparent "
                                            onClick={() => {
                                                if (!orderData.isSyncWithProcurement && canEdit) {
                                                    setEditingCell({ subItemId: sub._id, field: 'unit' });
                                                }
                                            }}
                                        >
                                            {/* <p className={!sub.unit ? "text-gray-300 italic text-center" : ""}>
                                                {sub.unit || "Set Unit"}
                                            </p> */}

                                            <span className={`font-bold ${!sub.unit ? "text-text-muted italic text-[11px] uppercase tracking-wider" : "text-text-main"}`}>
                                                    {sub.unit || "Set Unit"}
                                                </span>
                                        </div>
                                    )}
                                    {/* </div> */}
                                </div>

                                {/* Actions Column */}
                                <div className="col-span-2 px-2 py-2 flex items-center justify-center gap-2">

                                    {!orderData.isSyncWithProcurement && canCreate && (
                                        <button
                                            onClick={() => onAddNewAt(sIdx)}
                                            // className="p-1.5 cursor-pointer text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            className="w-8 h-8 flex items-center justify-center cursor-pointer text-text-muted hover:text-text-main hover:bg-brand-ash border border-transparent hover:border-ash-medium rounded-md transition-all shadow-sm"
                                            title="Add Item Below"
                                        >
                                            {(isAdding && addVariable.index - 1 === sIdx) ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-plus-circle"></i>}
                                        </button>
                                    )}




                                    {!orderData.isSyncWithProcurement && canEdit && (
                                        <button
                                            onClick={() => onDelete(sub._id)}
                                            // className="p-1.5 cursor-pointer text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            className="w-8 h-8 flex items-center justify-center cursor-pointer text-text-muted hover:text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md transition-all shadow-sm"
                                            title="Delete Item"
                                        >
                                            {/* <i className="fas fa-trash-alt"></i> */}
                                            {isDeleting && deleteVariable.subItemId === sub._id ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-trash-alt"></i>}
                                        </button>
                                    )}

                                    {/* 2. Update/Saving Status (Inline) */}
                                    {isUpdating && updateVariable?.subItemId === sub._id && (
                                        // <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 animate-pulse bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                        //     <i className="fas fa-circle-notch fa-spin"></i>
                                        //     <span className="uppercase tracking-tighter">Saving</span>
                                        // </div>

                                        <div className="absolute right-4 flex items-center gap-1.5 text-[10px] font-bold text-text-main bg-brand-surface px-2 py-1 rounded-md border border-ash-medium shadow-sm">
                                                <i className="fas fa-circle-notch fa-spin text-text-muted"></i>
                                                <span className="uppercase tracking-wider">Saving</span>
                                            </div>
                                    )}

                                    {/* {(isUpdating && updateVariable.subItemId === sub._id ) && <p>saving...</p> } */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

               

                {/* <section className="bg-white border-t border-gray-200 p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40"> */}
                <section className="bg-brand-surface border border-ash-medium rounded-xl p-6 shadow-sm mt-8">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {/* Header with Generate Button */}
                        {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4"> */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ash-light pb-4">
                            <div>
                                {/* <h3 className="text-lg font-bold text-gray-800">Order Documents</h3>
                                <p className="text-xs text-gray-500">View and download existing pdf</p> */}
                                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                    <i className="fa-regular fa-file-pdf text-text-muted"></i> Order Documents
                                </h3>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-1">View and download existing PDFs</p>
                            </div>
                            {(canEdit || canCreate) && (
                                <Button
                                    onClick={handleGeneratePdf}
                                    isLoading={generatePending}
                                    // className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md"
                                    variant="dark"
                                    className="w-full sm:w-auto px-6 shadow-sm"
                                >
                                    <i className="fas fa-file-pdf mr-2"></i> Generate New PDF
                                </Button>
                            )}
                        </div>

                        {/* PDF List Container */}
                        {/* <div className="grid gap-3">
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
                        </div> */}.

                        <div className="grid gap-3">
                            {orderData?.pdfLink && orderData.pdfLink.length > 0 ? (
                                orderData.pdfLink.map((pdf: any, index: number) => (
                                    <div
                                        key={pdf._id || index}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-brand-ash rounded-xl border border-ash-light hover:border-ash-medium transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                                <i className="fas fa-file-pdf text-xl text-action-danger"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main leading-tight mb-1">
                                                    {pdf.pdfName || `Order_Document_${index + 1}.pdf`}
                                                </p>
                                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                                                    Generated on: {dateFormate(pdf?.uploadedAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                                            <Button
                                                variant="white"
                                                onClick={() => window.open(pdf.url, '_blank')}
                                                className="flex-1 sm:flex-none border-ash-medium text-text-main shadow-sm"
                                            >
                                                <i className="fas fa-eye sm:mr-2 text-text-muted"></i>
                                                <span className="hidden sm:inline">View</span>
                                            </Button>
                                            <Button
                                                variant="dark"
                                                onClick={() => downloadImage({ src: pdf.url, alt: pdf.pdfName })}
                                                className="flex-1 sm:flex-none shadow-sm px-5"
                                            >
                                                <i className="fas fa-download sm:mr-2"></i>
                                                <span className="hidden sm:inline">Download</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center bg-brand-ash border border-dashed border-ash-medium rounded-xl">
                                    <div className="w-12 h-12 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <i className="fas fa-file-import text-text-muted text-lg"></i>
                                    </div>
                                    <p className="text-sm font-bold text-text-main mb-1">No Documents Found</p>
                                    <p className="text-xs text-text-muted">No PDFs have been generated for this order yet.</p>
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