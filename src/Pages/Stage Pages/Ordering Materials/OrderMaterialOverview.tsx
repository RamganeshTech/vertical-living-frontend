import {  useParams, useOutletContext } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useCompleteOrderingMaterialStage, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline } from "../../../apiList/Stage Api/orderingMaterialApi";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useGetSelectedModularUnits } from "../../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi";
import { NO_IMAGE } from "../../../constants/constants";

interface ProjectDetailsOutlet {
    isMobile: boolean;
    openMobileSidebar: () => void;
}

const OrderMaterialOverview = () => {
    const { projectId, organizationId } = useParams();
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterial(projectId!);
    // const { mutateAsync: generateLink, isPending: generatePending } = useGenerateOrderingMaterialLink()

    const { data: orderedUnits, isLoading: orderedLoading, error } = useGetSelectedModularUnits(projectId!);

    const selectedUnits = orderedUnits?.selectedUnits || [];
    const totalCost = orderedUnits?.totalCost || 0;
    const hasUnits = selectedUnits.length > 0;

    //   const { mutateAsync: updateShop } = useUpdateShopDetails();
    //   const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();

    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialDeadline()
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialStage()


    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
        }
    };

    if (isLoading || orderedLoading) return <MaterialOverviewLoading />;

    // const roomKeys = Object.keys(data?.materialOrderingList || {});
    // const { shopDetails, deliveryLocationDetails, generatedLink, materialOrderingList } = data || {};
    // console.log("selectedUnits", selectedUnits)
    return (
        <div className="w-full h-full flex flex-col">

            {/* Header Section - Always visible */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
                    {isMobile && (
                        <button
                            onClick={openMobileSidebar}
                            className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                            title="Open Menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <i className="fa-solid fa-cart-shopping mr-2"></i>
                    <span className="hidden sm:inline">Ordering Material</span>
                    <span className="sm:hidden">Order Material</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        isLoading={completePending}
                        onClick={handleCompletionStatus}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark as Complete
                    </Button>

                    <ResetStageButton
                        projectId={projectId!}
                        stageNumber={8}
                        stagePath="orderingmaterial"
                    />


                    {!getAllError && <ShareDocumentWhatsapp
                        projectId={projectId!}
                        stageNumber="8"
                        className="w-full sm:w-fit"
                        isStageCompleted={data?.status}
                    />}

                    <AssignStageStaff
                        stageName="OrderingMaterialModel"
                        projectId={projectId!}
                        organizationId={organizationId!}
                        currentAssignedStaff={data?.assignedTo || null}
                    />
                </div>
            </div>

            {/* Error Display */}
            {(isError || error) && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                        <div className="text-red-600 font-semibold mb-2">
                            ⚠️ Error Occurred
                        </div>
                        <p className="text-red-500 text-sm mb-4">
                            {(getAllError as any)?.response?.data?.message || (error as any)?.response?.data?.message || "Failed to load ordering material"}
                        </p>
                        <Button
                            isLoading={isLoading}
                            onClick={() => refetch()}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content - Only show if no error */}
            {!isError && !error && (
                <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
                    {/* Timer Card */}
                    <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
                        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                            <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                            <span>Stage Timings</span>
                        </div>
                        <StageTimerInfo
                            completedAt={data?.timer?.completedAt}
                            stageName="orderingmaterial"
                            formId={(data as any)?._id}
                            projectId={projectId!}
                            deadLine={data?.timer?.deadLine}
                            startedAt={data?.timer?.startedAt}
                            refetchStageMutate={refetch}
                            deadLineMutate={deadLineAsync}
                            isPending={deadLinePending}
                        />
                    </Card>




                    {/* {!isError && !error && <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200 flex justify-between">
                                    <h2 className="text-lg font-semibold text-blue-600">Order Summary</h2>

                                    <div>
                                        
                                        <p className="text-lg font-semibold text-blue-600"> <span className="text-black">Total Amount:</span> ₹{totalCost || 0}</p>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {hasUnits ? (
                                        <>
                                            <div className="space-y-4">
                                                {selectedUnits.map((unit: any, idx: number) => (
                                                    <div
                                                        key={unit._id || idx}
                                                        className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={unit.image || NO_IMAGE}
                                                                alt={unit.customId ? `Product image for ${unit.customId}` : 'Product image unavailable'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                                <h3 className="font-medium text-gray-900">
                                                                    {unit.customId || "N/A"}
                                                                </h3>
                                                                <div className="text-sm font-semibold text-blue-600">
                                                                    ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
                                                                </div>
                                                            </div>

                                                            <div className="mt-1 text-sm text-gray-600">
                                                                <span className="font-medium">Category:</span> {unit.category || "N/A"}
                                                            </div>

                                                            <div className="mt-2 flex items-center justify-between">
                                                                <div className="text-sm text-gray-500">
                                                                    <span className="font-medium">Qty:</span> {unit.quantity}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    <span className="font-medium">Unit Price:</span> ₹{unit.singleUnitCost.toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Total Amount:</span>
                                                    <span className="text-xl font-semibold text-blue-600">₹{totalCost.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">No items ordered</h3>
                                            <p className="text-gray-500">Your order history is currently empty.</p>
                                        </div>
                                    )}
                                </div>
                            </section>} */}


                    {!isError && !error && (
                        <section className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                            {/* Modern header with subtle accent */}
                            <div className="p-6 border-b border-gray-100 relative">
                                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {hasUnits ? `${selectedUnits.length} items purchased` : 'No orders yet'}
                                        </p>
                                    </div>
                                    {hasUnits && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-sm">Total:</span>
                                            <span className="text-xl font-bold text-blue-600">₹{totalCost.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="py-2">
                                {hasUnits ? (
                                    <div className="grid gap-5">
                                        {selectedUnits.map((unit: any, idx: number) => (
                                            <div
                                                key={unit._id || idx}
                                                className="group relative p-5 bg-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all
              shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
                                            >
                                                <div className="flex flex-col md:flex-row gap-5">
                                                    {/* Product image with floating quantity */}
                                                    <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                                                        <img
                                                            src={unit.image || NO_IMAGE}
                                                            alt={unit.customId || 'Product image'}
                                                            className="w-full h-full object-contain p-3"
                                                        />
                                                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                            ×{unit.quantity}
                                                        </div>
                                                    </div>

                                                    {/* Product details */}
                                                    <div className="flex-1 flex flex-col">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
                                                                {unit.customId || "Unspecified Product"}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                                                    {unit.category || "Generic"}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                                                                    <p className="font-medium">₹{unit.singleUnitCost.toFixed(2)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500 mb-1">Quantity</p>
                                                                    <p className="font-medium">{unit.quantity}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-sm text-gray-500">Item Total</p>
                                                                <p className="text-lg font-bold text-blue-600">
                                                                    ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 text-blue-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Order History</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                                            Your completed orders will appear here
                                        </p>
                                        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                            Start Shopping
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}



                    {/* <section className="mt-4">
                                <GenerateWhatsappLink
                                    projectId={projectId!} context="order material"
                                    stage="ordermaterial"
                                    data={generatedLink}
                                    isPending={generatePending}
                                    generateLink={generateLink} />
                            </section> */}
                </div>
            )}

          
        </div >
    )
}



export default OrderMaterialOverview;