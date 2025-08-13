

// components/material-selection/MaterialRoomOverview.tsx
// import { useState } from "react";
import RoomCard from "./RoomCard";
import { Outlet, useLocation, useParams, useOutletContext } from "react-router-dom";
import { useCompleteMaterialStage, useGetMaterialConfirmationByProject, useSetMaterialDeadline } from "../../../apiList/Stage Api/materialSelectionApi";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
// import { Dialog } from "../../../components/ui/Dialog";
// import CreateRoomformModel from "./CreateRoomformModel";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "./MaterailSelectionLoadings/MaterialOverviewLoading";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";

// Define context type
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

export default function MaterialRoomOverview() {
    const { projectId, organizationId } = useParams();
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const location = useLocation();
    const { data, isLoading, error: getRoomsError, refetch } = useGetMaterialConfirmationByProject(projectId!);
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialDeadline();
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteMaterialStage();
    // const [showCreateForm, setShowCreateForm] = useState(false);

    if (isLoading) return <MaterialOverviewLoading />;

    // const isroomsAvailable = !data?.customRooms?.length && !data?.rooms?.length;
    // const isroomsAvailable =  !data?.rooms?.length;
    const isChildRoute = location.pathname.includes("/materialroom");
    
    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.response?.data?.message || error.message || "Failed to update completion status", 
                variant: "destructive" 
            });
        }
    };

    // const { rooms, customRooms } = data || {};
    const { rooms } = data || {};
    // const totalRooms = (rooms?.length || 0) + (customRooms?.length || 0);
    const totalRooms = (rooms?.length || 0) 

    return (
        <div className="flex flex-col h-full w-full  py-2">
            {/* Responsive Header with Mobile Sidebar Toggle - Always visible */}

            {isChildRoute ? <Outlet /> : 
            (<>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
                    {isMobile && (
                        <button
                            onClick={openMobileSidebar}
                            className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                            title="Open Menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <i className="fas fa-box mr-2"></i> Material Selection
                </h2>
                
                <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%]  flex flex-col sm:flex-row gap-3 justify-end">
                    <div className="flex flex-wrap  md:flex-nowrap gap-2 justify-end">
                        <Button 
                            isLoading={completePending} 
                            onClick={handleCompletionStatus} 
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
                        >
                            <i className="fa-solid fa-circle-check mr-2"></i>
                            Mark Complete
                        </Button>
                        
                        {/* {!isChildRoute && (
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateForm(true)}
                                className="bg-blue-600 text-white flex-1 sm:flex-initial min-w-max"
                            >
                                + Add Room
                            </Button>
                        )} */}
                    </div>
                    
                    <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
                        <ResetStageButton 
                            projectId={projectId!} 
                            stageNumber={5} 
                            stagePath="materialconfirmation" 
                            className="flex-1 sm:flex-initial min-w-max"
                        />

                        {!getRoomsError && <ShareDocumentWhatsapp
                            projectId={projectId!}
                            stageNumber="5"
                            className="w-full sm:w-fit"
                            isStageCompleted={data?.status}
                        />}
                        
                        <AssignStageStaff
                            stageName="MaterialRoomConfirmationModel"
                            projectId={projectId!}
                            organizationId={organizationId!}
                            currentAssignedStaff={data?.assignedTo || null}
                            className="flex-1 sm:flex-initial min-w-max"
                        />
                    </div>
                </div>
            </div>

            {/* Error Display - Always visible if error exists */}
            {getRoomsError && (
                <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-4">
                    <div className="text-red-600 font-semibold mb-2">
                        ⚠️ Error Occurred
                    </div>
                    <p className="text-red-500 text-sm mb-4">
                        {(getRoomsError as any)?.response?.data?.message || 
                         (getRoomsError as any)?.message || 
                         "Failed to load room data"}
                    </p>
                    <Button
                        onClick={() => refetch()}
                        className="bg-red-600 text-white px-4 py-2"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Content area that takes remaining space */}
            <div className="flex-grow min-h-0 flex flex-col">
                { !getRoomsError && (
                    <>
                        <Card className="p-4 mb-4 w-full shadow border-l-4 border-blue-600 bg-white">
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

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-semibold">Total Rooms: {totalRooms}</h2>
                        </div>
{/* 
                        {showCreateForm && (
                            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                               
                                    <CreateRoomformModel refetch={refetch} onClose={() => setShowCreateForm(false)} projectId={projectId!} />
                            </Dialog>
                        )} */}

                        {/* Scrollable room cards container */}
                        <div className="flex-grow min-h-[100%] py-2 sm:!min-h-0  overflow-y-auto">
                            {/* {!isroomsAvailable ? ( */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {rooms?.map((room: any) => (
                                        <RoomCard roomType="predefinedRoom"  key={room._id} room={room} projectId={projectId!} />
                                    ))}
                                    {/* {customRooms?.map((room: any) => (
                                        <RoomCard roomType="customRoom"  key={room._id} room={room} projectId={projectId!} />
                                    ))} */}
                                </div>
                            {/* ) : (
                                <div className="h-full flex items-center justify-center py-8">
                                    <div className="text-center max-w-md mx-auto">
                                        <i className="fas fa-door-open text-5xl sm:text-6xl text-blue-300 mb-4"></i>
                                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Rooms Added Yet</h2>
                                        <p className="text-gray-500 mb-6">Add rooms to start selecting materials</p>
                                        <button
                                            onClick={() => setShowCreateForm(true)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <i className="fas fa-plus mr-2"></i> Add Your First Room
                                        </button>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </>
                )}
            </div>
            </>
            )
            }
        </div>
    );
}