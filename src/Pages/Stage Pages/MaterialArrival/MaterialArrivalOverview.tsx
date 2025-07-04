import { Outlet, useNavigate, useParams } from "react-router-dom";
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

const MaterialArrivalOverview = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
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

    if (isError)
        return (
            <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 text-xl font-semibold mb-2">⚠️ Oops! Error Occurred</div>
                <p className="text-red-500 text-sm mb-4">
                    {(error as any)?.response?.data?.message || "Failed to load data"}
                </p>
                <Button onClick={() => refetch()} className="bg-red-600 text-white hover:bg-red-700">
                    Retry
                </Button>
            </div>
        );
    console.log(data)
    const { shopDetails, deliveryLocationDetails, materialArrivalList, timer, isEditable, generatedLink } = data;
    const roomKeys = Object.keys(materialArrivalList || {});


    console.log("matieral arrival room list", materialArrivalList)

    const handleUpdateShop = async () => {
        try {
            await updateShop({ projectId: projectId!, updates: shopForm });
            toast({ title: "Success", description: "Shop details updated" });
            setEditShop(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "Update failed",
            });
        }
    };

    const handleUpdateDelivery = async () => {
        try {
            await updateDelivery({ projectId: projectId!, updates: deliveryForm });
            toast({ title: "Success", description: "Delivery location updated" });
            setEditDelivery(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "Update failed",
            });
        }
    };

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };

    return (
        <main className="p-2 h-full overflow-y-auto" >
            {!isChildRoute ? (
                <div className="space-y-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center py-3  w-full border-b-2 border-gray-200 ">
                        <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
                            <i className="fa-solid fa-receipt mr-2"></i>Material Checking
                        </h2>
                        <div className="flex gap-2 items-center">
                            <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
                                <i className="fa-solid fa-circle-check mr-2"></i>
                                Mark as Complete
                            </Button>

                            <ResetStageButton projectId={projectId!} stageNumber={9} stagePath="materialarrival" />

                              <AssignStageStaff
            stageName="MaterialArrivalModel"
            projectId={projectId!}
            organizationId={"684a57015e439b678e8f6918"}
            currentAssignedStaff={data?.assignedTo || null}
          />
                        </div>
                    </div>

                    {/* 🕒 Stage Timer */}
                    <section className="mb-4">
                        <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
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
                    </section>

                    {/* 🛍 Shop Details */}
                    <div className="border rounded-lg p-4 shadow-sm relative">
                        <h2 className="text-lg font-bold mb-2 text-blue-700">Shop Details</h2>
                        {editShop ? (
                            <div className="space-y-2">
                                <Input placeholder="Shop Name" value={shopForm.shopName || ""} onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })} />
                                <Input placeholder="Contact Person" value={shopForm.contactPerson || ""} onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })} />
                                <Input placeholder="Phone Number" value={shopForm.phoneNumber || ""} onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })} />
                                <Input placeholder="Address" value={shopForm.address || ""} onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })} />
                                <div className="flex gap-2 mt-2">
                                    <Button onClick={handleUpdateShop}>Save</Button>
                                    <Button variant="outline" onClick={() => setEditShop(false)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p><strong>Shop Name:</strong> {shopDetails?.shopName || "-"}</p>
                                <p><strong>Contact Person:</strong> {shopDetails?.contactPerson || "-"}</p>
                                <p><strong>Phone:</strong> {shopDetails?.phoneNumber || "-"}</p>
                                <p><strong>Address:</strong> {shopDetails?.address || "-"}</p>
                                {isEditable && <button onClick={() => { setShopForm(shopDetails); setEditShop(true); }} className="absolute top-3 right-4 text-blue-600 text-xs underline">Edit</button>}
                            </>
                        )}
                    </div>

                    {/* 🏗 Delivery Location */}
                    <div className="border rounded-lg p-4 shadow-sm relative">
                        <h2 className="text-lg font-bold mb-2 text-blue-700">Delivery Location</h2>
                        {editDelivery ? (
                            <div className="space-y-2">
                                <Input placeholder="Site Name" value={deliveryForm.siteName || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })} />
                                <Input placeholder="Site Supervisor" value={deliveryForm.siteSupervisor || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })} />
                                <Input placeholder="Phone Number" value={deliveryForm.phoneNumber || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })} />
                                <Input placeholder="Address" value={deliveryForm.address || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })} />
                                <div className="flex gap-2 mt-2">
                                    <Button onClick={handleUpdateDelivery}>Save</Button>
                                    <Button variant="outline" onClick={() => setEditDelivery(false)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p><strong>Site Name:</strong> {deliveryLocationDetails?.siteName || "-"}</p>
                                <p><strong>Supervisor:</strong> {deliveryLocationDetails?.siteSupervisor || "-"}</p>
                                <p><strong>Phone:</strong> {deliveryLocationDetails?.phoneNumber || "-"}</p>
                                <p><strong>Address:</strong> {deliveryLocationDetails?.address || "-"}</p>
                                {isEditable && <button onClick={() => { setDeliveryForm(deliveryLocationDetails); setEditDelivery(true); }} className="absolute top-3 right-4 text-blue-600 text-xs underline">Edit</button>}
                            </>
                        )}
                    </div>

                    {/* 🧱 Room Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            ) : (
                <Outlet />
            )}
        </main>
    );
};

export default MaterialArrivalOverview;
