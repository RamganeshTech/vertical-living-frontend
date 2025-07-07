// components/material-selection/MaterialRoomOverview.tsx
import { useState } from "react";
import RoomCard from "./RoomCard";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useCompleteMaterialStage, useGetMaterialConfirmationByProject, useSetMaterialDeadline } from "../../../apiList/Stage Api/materialSelectionApi";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Dialog } from "../../../components/ui/Dialog";
import CreateRoomformModel from "./CreateRoomformModel";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "./MaterailSelectionLoadings/MaterialOverviewLoading";
import EmptyState from "../../../components/ui/EmptyState";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";


export default function MaterialRoomOverview() {
    const { projectId, organizationId } = useParams()
    const location = useLocation();
    const { data, isLoading, error: getRoomsError, refetch } = useGetMaterialConfirmationByProject(projectId!);
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialDeadline()
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteMaterialStage()
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (isLoading) return <MaterialOverviewLoading />;

    console.log(data)

    // if (!data?.customRooms?.length && !data?.rooms?.length) return <EmptyState message="No Rooms Available" icon="custom" customIconClass="fas fa-room" color="primary" />;
const isroomsAvailable = !data?.customRooms?.length && !data?.rooms?.length
    if (getRoomsError) return <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">
            ⚠️ Oops! An Error Occurred
        </div>
        <p className="text-red-500 text-sm mb-4">{(getRoomsError as any).response.data.message || (getRoomsError as any)?.message || "Failed to load , please try again"}</p>

        <Button
            isLoading={isLoading}
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
        >
            Retry
        </Button>
    </div>;

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };

    const { rooms, customRooms } = data;
    const totalRooms = (rooms?.length || 0) + (customRooms?.length || 0);


    // Show room list only if not inside a specific room
    const isChildRoute = location.pathname.includes("/materialroom");

    return (
        <>
            <div className="w-full h-full p-2">

                {!isChildRoute ?
                    <>
                        <div className='flex justify-between w-full '>
                            <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
                                <i className="fas fa-box mr-2"></i> Material Selection
                            </h2>

                            <div className="flex gap-2 items-center ">
                                <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
                                    <i className="fa-solid fa-circle-check mr-2"></i>
                                    Mark as Complete
                                </Button>

                                <ResetStageButton projectId={projectId!} stageNumber={5} stagePath="materialconfirmation" />

                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateForm(prev => !prev)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    + Add Custom Room
                                </Button>


                                <AssignStageStaff
                                    stageName="MaterialRoomConfirmationModel"
                                    projectId={projectId!}
                                    organizationId={organizationId!}
                                    currentAssignedStaff={data?.assignedTo || null}
                                />
                            </div>
                        </div>

                        <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
                            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                                <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                                <span>Stage Timings</span>
                            </div>

                            <StageTimerInfo
                                completedAt={data?.timer?.completedAt}
                                stageName="materialconfirmation"
                                projectId={projectId!}
                                formId={(data as any)?._id}
                                deadLine={data?.timer?.deadLine}
                                startedAt={data?.timer?.startedAt}
                                refetchStageMutate={refetch}
                                deadLineMutate={deadLineAsync}
                                isPending={deadLinePending}
                            />
                        </Card>

                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Total Rooms: {totalRooms}</h2>

                        </div>

                        {/* {showCreateRoomForm && <CreateRoomForm projectId={projectId!} onClose={() => setShowCreateForm(false)} />} */}



                        {showCreateForm && <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-700">Create New Room</h2>
                                <CreateRoomformModel onClose={() => setShowCreateForm(false)} projectId={projectId!} />
                            </div>
                        </Dialog>}

                        {!isroomsAvailable && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  h-[70%] py-2 overflow-y-auto custom-scrollbar">
                            {rooms?.map((room: any) => (
                                <RoomCard key={room._id} room={room} projectId={projectId!} />
                            ))}
                            {customRooms?.map((room: any) => (
                                <RoomCard key={room._id} room={room} projectId={projectId!} />
                            ))}
                        </div>}
                    </> :
                    <Outlet />
                }
            </div>
        </>
    );
}
