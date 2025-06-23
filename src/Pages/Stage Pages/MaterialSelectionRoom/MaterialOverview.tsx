// components/material-selection/MaterialRoomOverview.tsx
import { useState } from "react";
import CreateCustomRoomForm from "./CreateCustomRoomForm";
import RoomCard from "./RoomCard";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useGetMaterialConfirmationByProject, useSetMaterialDeadline } from "../../../apiList/Stage Api/materialSelectionApi";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";


export default function MaterialRoomOverview() {
    const { projectId } = useParams()
    const location = useLocation();
    const { data, isLoading, error, refetch } = useGetMaterialConfirmationByProject(projectId!);
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialDeadline()
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No data found.</p>;
    if (error) return <p>error occured</p>;

    const { rooms, customRooms } = data;
    const totalRooms = (rooms?.length || 0) + (customRooms?.length || 0);


    // Show room list only if not inside a specific room
    const isChildRoute = location.pathname.includes("/materialroom");

    return (
        <>
             <div className="w-full h-full p-2">

               {!isChildRoute ? 
               <><div className='flex justify-between w-full'>
                    <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
                        <i className="fas fa-box mr-2"></i> Material Selection
                    </h2>

                    <button
                        onClick={() => setShowCreateForm(prev => !prev)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add Custom Room
                    </button>
                </div>

                <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
                    <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                        <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                        <span>Stage Timings</span>
                    </div>

                    <StageTimerInfo
                        completedAt={data?.timer?.completedAt}
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

                {showCreateForm && <CreateCustomRoomForm projectId={projectId!} />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  h-[72%] overflow-y-scroll">
                    {rooms?.map((room: any) => (
                        <RoomCard key={room._id} room={room}  projectId={projectId!} />
                    ))}
                    {customRooms?.map((room: any) => (
                        <RoomCard key={room._id} room={room}  projectId={projectId!} />
                    ))}
                </div>
                </>:
                 <Outlet />
            }
            </div>  
        </>
    );
}
