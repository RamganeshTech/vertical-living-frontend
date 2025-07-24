import { Outlet, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { toast } from "../../../utils/toast";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

import {
    useGetMaterialArrivalDetails,
    useGenerateMaterialArrivalLink,
    useUpdateMaterialArrivalDelivery,
    useUpdateMaterialArrivalShop,
    useSetMaterialArrivalDeadline,
    useCompleteMaterialArrivalStage
} from "../../../apiList/Stage Api/materialArrivalApi";
import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";

interface ProjectDetailsOutlet {
    isMobile: boolean;
    openMobileSidebar: () => void;
}

const MaterialArrivalOverview = () => {
    const { projectId, organizationId } = useParams();
    const navigate = useNavigate();
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const isChildRoute = location.pathname.includes("/materialarrivalroom/");

    const [editShop, setEditShop] = useState(false);
    const [editDelivery, setEditDelivery] = useState(false);
    const [shopForm, setShopForm] = useState<any>({});
    const [deliveryForm, setDeliveryForm] = useState<any>({});

    const { data, isLoading, isError, error, refetch } = useGetMaterialArrivalDetails(projectId!);
    const { mutateAsync: updateShop } = useUpdateMaterialArrivalShop();
    const { mutateAsync: updateDelivery } = useUpdateMaterialArrivalDelivery();
    const { mutateAsync: generateLink, isPending: linkPending } = useGenerateMaterialArrivalLink();

    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialArrivalDeadline()
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteMaterialArrivalStage()

    if (isLoading) return <MaterialOverviewLoading />;



    const { shopDetails, deliveryLocationDetails, materialArrivalList, timer, generatedLink } = data || {};
    const roomKeys = Object.keys(materialArrivalList || {});

    const handleUpdateShop = async () => {
        try {


            if (shopForm.phoneNumber) {
                if (!/^\d{10}$/.test(shopForm.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateShop({ projectId: projectId!, updates: shopForm });
            toast({ title: "Success", description: "Shop details updated" });
            setEditShop(false);
            refetch()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Update failed",
            });
        }
    };

    const handleUpdateDelivery = async () => {
        try {

            if (deliveryForm.phoneNumber) {
                if (!/^\d{10}$/.test(deliveryForm.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateDelivery({ projectId: projectId!, updates: deliveryForm });
            toast({ title: "Success", description: "Delivery location updated" });
            setEditDelivery(false);
            refetch()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Update failed",
            });
        }
    };

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to update completion status", variant: "destructive" })
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-2 ">
            {isChildRoute ? (
                /* Child Route Content */
                <Outlet />
            ) : (
                /* Parent Component Content */
                <>
                    {/* Header Section - Always visible */}
                    <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 pb-3 ">
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
                            <i className="fa-solid fa-receipt mr-2"></i>
                            <span className="hidden sm:inline">Material Checking</span>
                            <span className="sm:hidden">Material Check</span>
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
                                stageNumber={9}
                                stagePath="materialarrivalcheck"
                            />

                            {!error && <ShareDocumentWhatsapp
                                projectId={projectId!}
                                stageNumber="9"
                                className="w-full sm:w-fit"
                                isStageCompleted={data?.status}
                            />}

                            <AssignStageStaff
                                stageName="MaterialArrivalModel"
                                projectId={projectId!}
                                organizationId={organizationId!}
                                currentAssignedStaff={data?.assignedTo || null}
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {isError && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                                <div className="text-red-600 font-semibold mb-2">
                                    ⚠️ Error Occurred
                                </div>
                                <p className="text-red-500 text-sm mb-4">
                                    {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
                                </p>
                                <Button
                                    onClick={() => refetch()}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Main Content - Only show if no error */}
                    {!isError && (
                        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
                            {/* Timer Card */}
                            <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
                                <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                                    <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                                    <span>Stage Timings</span>
                                </div>
                                <StageTimerInfo
                                    stageName='materialarrivalcheck'
                                    completedAt={timer?.completedAt}
                                    projectId={projectId!}
                                    formId={(data as any)?._id}
                                    deadLine={timer?.deadLine}
                                    startedAt={timer?.startedAt}
                                    refetchStageMutate={refetch}
                                    deadLineMutate={deadLineAsync}
                                    isPending={deadLinePending}
                                />
                            </Card>

                            {/* Shop Details */}
                            <div className="border-l-4 border-blue-600  rounded-lg p-4 shadow-sm relative bg-white">
                                <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                                    <i className="fa-solid fa-store"></i>
                                    Shop Details
                                </h2>
                                {editShop ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Shop Name"
                                            value={shopForm.shopName || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Contact Person"
                                            value={shopForm.contactPerson || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Phone Number"
                                            type="tel"
                                            maxLength={10}
                                            value={shopForm.phoneNumber || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Address"
                                            value={shopForm.address || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                                            className="w-full"
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                            <Button onClick={handleUpdateShop} className="w-full sm:w-auto">
                                                <i className="fa-solid fa-save mr-2"></i>Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditShop(false)}
                                                className="w-full sm:w-auto"
                                            >
                                                <i className="fa-solid fa-times mr-2"></i>Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-sm sm:text-base">
                                        <p><strong>Shop Name:</strong> {shopDetails?.shopName || "-"}</p>
                                        <p><strong>Contact Person:</strong> {shopDetails?.contactPerson || "-"}</p>
                                        <p><strong>Phone:</strong> {shopDetails?.phoneNumber || "-"}</p>
                                        <p><strong>Address:</strong> {shopDetails?.address || "-"}</p>
                                        {data?.status !== "completed" && (
                                            <button
                                                onClick={() => { setShopForm(shopDetails); setEditShop(true); }}
                                                className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                            >
                                                <i className="fa-solid fa-edit mr-1"></i>Edit
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Delivery Location */}
                            <div className="border-l-4 border-blue-600  rounded-lg p-4 shadow-sm relative bg-white">
                                <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                                    <i className="fa-solid fa-truck"></i>
                                    Delivery Location
                                </h2>
                                {editDelivery ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Site Name"
                                            value={deliveryForm.siteName || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Site Supervisor"
                                            value={deliveryForm.siteSupervisor || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Phone Number"
                                            type="tel"
                                            maxLength={10}
                                            value={deliveryForm.phoneNumber || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Address"
                                            value={deliveryForm.address || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                                            className="w-full"
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                            <Button onClick={handleUpdateDelivery} className="w-full sm:w-auto">
                                                <i className="fa-solid fa-save mr-2"></i>Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditDelivery(false)}
                                                className="w-full sm:w-auto"
                                            >
                                                <i className="fa-solid fa-times mr-2"></i>Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-sm sm:text-base">
                                        <p><strong>Site Name:</strong> {deliveryLocationDetails?.siteName || "-"}</p>
                                        <p><strong>Supervisor:</strong> {deliveryLocationDetails?.siteSupervisor || "-"}</p>
                                        <p><strong>Phone:</strong> {deliveryLocationDetails?.phoneNumber || "-"}</p>
                                        <p><strong>Address:</strong> {deliveryLocationDetails?.address || "-"}</p>
                                        {data?.status !== "completed" && (
                                            <button
                                                onClick={() => { setDeliveryForm(deliveryLocationDetails); setEditDelivery(true); }}
                                                className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                            >
                                                <i className="fa-solid fa-edit mr-1"></i>Edit
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Room Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roomKeys.map((roomKey) => {
                                    const roomItems = materialArrivalList[roomKey] || [];
                                    return (
                                        <div
                                            key={roomKey}
                                            className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
                                            onClick={() => navigate(`materialarrivalroom/${roomKey}`)}
                                        >
                                            <h3 className="text-md font-semibold capitalize text-blue-800">
                                                {roomKey.replace(/([A-Z])/g, " $1")}
                                            </h3>
                                            <p className="text-sm text-gray-600">Items: {roomItems.length}</p>
                                            <p className="text-xs text-gray-400">Click to view details</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 🔗 Shareable Link */}
                            <section className="mt-4">
                                <GenerateWhatsappLink
                                    projectId={projectId!}
                                    context="Material"
                                    stage="materialarrival"
                                    data={generatedLink}
                                    isPending={linkPending}
                                    generateLink={generateLink}
                                />
                            </section>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default MaterialArrivalOverview;