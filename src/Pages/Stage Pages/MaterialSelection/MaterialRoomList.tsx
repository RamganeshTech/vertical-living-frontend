// MaterialRoomList.tsx
import React, { useState } from "react";
import { Button } from "../../../components/ui/Button"; 
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllMaterialRooms } from "../../../apiList/Stage Api/materialSelectionApi"; 
import CreateRoomForm from "./CreateRoomformModel"; 
import useGetRole from './../../../Hooks/useGetRole';
import { Card } from "../../../components/ui/Card";
import { Dialog } from "../../../components/ui/Dialog";

const MaterialRoomList:React.FC = () => {
  const { projectId } = useParams();
  const { role } = useGetRole();
  const navigate = useNavigate();
    const [showCreateRoomForm, setShowCreateRoomForm] = useState<boolean>(false)

  const { data: rooms, isLoading, isError, error } = useGetAllMaterialRooms({ projectId: projectId! });

  if (isLoading) return <div className="text-blue-600 text-center py-10">Loading rooms...</div>;
  if (isError) return <div className="text-red-600 text-center py-10">{(error as any)?.response?.data?.message || error.message}</div>;

  return (
    <div className="p-4 sm:p-6">
                <div className="flex w-full items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-blue-800 mb-4">Material Room Selection</h1>


                    <Button onClick={() => setShowCreateRoomForm(true)} className="bg-blue-600 !rounded-full h-16 w-16">
                        <i className="text-white text-2xl fas fa-plus" />
                    </Button>
                </div>


                {rooms?.length === 0 &&
                    <div className="flex border-2 border-[#0a00a018] flex-col items-center justify-center py-20 gap-4 text-center">
                        <i className="text-blue-500 text-4xl fas fa-plus" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            No rooms available yet
                        </h2>
                        <p className="text-gray-600 text-sm max-w-md">
                            You haven’t added any rooms yet for this project. Start by adding your first room now.
                        </p>
                        {(role === "owner" || role === "staff" || role === "CTO" || role === "client") && (
                            <Button
                                className="mt-4 bg-blue-600 text-white hover:bg-blue-700 transition"
                                onClick={() => setShowCreateRoomForm(true)}
                            >
                                <i className="fas fa-plus-circle mr-2"></i> Create Room
                            </Button>
                        )}
                    </div>
                }




                {showCreateRoomForm && <Dialog open={showCreateRoomForm} onOpenChange={setShowCreateRoomForm}>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">Create New Room</h2>
                        <CreateRoomForm onClose={() => setShowCreateRoomForm(false)} projectId={projectId!} />
                    </div>
                </Dialog>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room: any) => (
                        <Card key={room._id} className="p-4 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm">
                            <div className="mb-3">
                                <h2 className="text-lg font-semibold text-blue-800">{room.roomName}</h2>
                                <p className="text-sm text-gray-500">Modular Works: {room.modularWorks.length}</p>
                                <p className="text-sm text-gray-500">Uploads: {room.uploads.length}</p>
                            </div>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => navigate(`materialroom?roomId=${room._id}`)}
                            >
                                View Room Details
                            </Button>
                        </Card>
                    ))}
                </div>

                
            </div>
  );
};

export default MaterialRoomList;
