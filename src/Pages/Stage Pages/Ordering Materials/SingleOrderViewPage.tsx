import { useParams, useNavigate } from "react-router-dom";
// import { 
//     useGetSingleOrderItem, 
//     useOrderHistoryGneratePdf 
// } from "../../../apiList/Department Api/Procurement Api/procurementApi"; // Adjust path
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { toast } from "../../../utils/toast";
import { useGetSingleOrderItem, useOrderHistoryGneratePdf, useOrderHistorySendToProcurement } from "../../../apiList/Stage Api/orderMaterialHistoryApi";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { downloadImage } from "../../../utils/downloadFile";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

const SingleOrderViewPage = () => {
    const { projectId, orderItemId, organizationId } = useParams<{ projectId: string; orderItemId: string, organizationId: string }>();
    const navigate = useNavigate();

    // --- State ---
    // const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);




    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.ordermaterial?.delete;
    // const canList = role === "owner" || permission?.ordermaterial?.list;
    const canCreate = role === "owner" || permission?.ordermaterial?.create;
    const canEdit = role === "owner" || permission?.ordermaterial?.edit;

    // --- API Hooks ---
    const { data: orderData, isLoading, isError, refetch } = useGetSingleOrderItem(projectId!, orderItemId!);
    const { mutateAsync: generateLink, isPending: generatePending } = useOrderHistoryGneratePdf();

    const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurement();

    const handleSendToProcurement = async () => {
        try {

            await sendToProcurement({ projectId: projectId!, orderItemId: orderItemId!, organizationId: organizationId! });
            toast({ description: 'Sent to Procurement', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
        }
    };


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

    const handleDownloadPdf = async () => {
        try {

            await downloadImage({ src: orderData?.pdfLink?.url, alt: orderData?.pdfLink?.pdfName })
            toast({ title: "Success", description: "PDF Downloaded successfully" });
        }
        catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || err?.message || "Failed to generate PDF",
                variant: "destructive"
            });
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

    const { shopDetails, deliveryLocationDetails, subItems, pdfLink } = orderData;

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
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <i className="fa-solid fa-file-invoice text-blue-600"></i>
                                Order Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Order Id: <span className="font-mono font-bold text-gray-700">{orderData.orderMaterialNumber || "N/A"}</span>
                            </p>
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

                        {(canCreate || canEdit) && <Button
                            variant="primary"
                            onClick={handleSendToProcurement}
                            disabled={orderData?.isSyncWithProcurement}
                            title={orderData?.isSyncWithProcurement ? "already sent to procurement" : ""}
                            isLoading={isSending}
                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 disabled:cursor-not-allowed"
                        >
                            Send To Procurement
                        </Button>}

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
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-cubes text-blue-600"></i> Ordered Items
                    </h3>

                    <div className="grid gap-5">
                        {/* {selectedUnit.map((unit: any, idx: number) => (
                            <div
                                key={unit._id || idx}
                                className={`group relative p-5 transition-all duration-200 rounded-xl
                                    ${expandedUnitId === unit._id
                                        ? "border-2 border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-white ring-2 ring-blue-100"
                                        : "border border-gray-200 hover:border-blue-400 hover:shadow-md bg-white"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                        <img
                                            src={unit?.image || NO_IMAGE}
                                            alt={unit.unitName}
                                            className="w-full h-full object-contain p-2"
                                        />
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                                            Qty: {unit.quantity}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                <h3 className={`text-lg font-bold ${expandedUnitId === unit._id ? "text-blue-800" : "text-gray-800"}`}>
                                                    {unit.unitName}
                                                </h3>

                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                                                        Material Items: <b>{unit?.subItems?.length || 0}</b>
                                                    </span>
                                                    <button
                                                        onClick={() => setExpandedUnitId(expandedUnitId === unit._id ? null : unit._id)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${expandedUnitId === unit._id
                                                            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                                                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                                                            }`}
                                                    >
                                                        {expandedUnitId === unit._id ? 'Hide Details' : 'View Details'}
                                                        <i className={`fa ${expandedUnitId === unit._id ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                            
                                        </div>
                                    </div>
                                </div>

                                {expandedUnitId === unit._id && ( */}
                        <div className="mt-5 pt-0 animate-in fade-in zoom-in-95 duration-200">
                            <div className="relative overflow-hidden rounded-lg border-2 border-blue-100 bg-white">
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-0 bg-blue-50/50 border-b border-blue-100 text-xs font-bold text-blue-800 uppercase tracking-wide">
                                    <div className="col-span-2 px-4 py-3 border-r border-blue-100">Ref ID</div>
                                    <div className="col-span-6 px-4 py-3 border-r border-blue-100">Material Name</div>
                                    <div className="col-span-2 px-4 py-3 border-r border-blue-100 text-center">Qty</div>
                                    <div className="col-span-2 px-4 py-3 text-center">Unit</div>
                                </div>

                                {/* Rows */}
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
                        {/* )}
                            </div>
                        ))} */}
                    </div>
                </div>

                {/* --- SECTION 3: PDF ACTIONS (Sticky Bottom) --- */}
                <div className=" bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
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
                </div>

            </div>
        </div>
    );
};

export default SingleOrderViewPage;