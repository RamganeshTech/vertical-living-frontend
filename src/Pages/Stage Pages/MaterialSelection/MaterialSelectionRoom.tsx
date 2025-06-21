import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { IMaterialSelectionWork } from "../../../types/types";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { useGetMaterialRoomById, useEditModularWork, useDeleteModularWork, useDeleteMaterialRoom } from './../../../apiList/Stage Api/materialSelectionApi';
import CreateMaterialWorkForm from "./CreateMaterialWorkForm";

const MaterialSelectionRoom: React.FC = () => {
    const { projectId } = useParams();

    const [searchParams] = useSearchParams(); // for query string
    const navigate = useNavigate()

    const roomId = searchParams.get("roomId");
    if (!roomId) return "no room id"

    const { data: room, isLoading, isError, error } = useGetMaterialRoomById({ projectId: projectId!, roomId: roomId! });




    const { mutateAsync: editWork } = useEditModularWork();
    const { mutateAsync: deleteWork } = useDeleteModularWork();
    const { mutateAsync: deleteRoom } = useDeleteMaterialRoom();


    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [editedWork, setEditedWork] = React.useState<IMaterialSelectionWork>({ workName: "", notes: "", materials: [] });


    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (isError) return <div className="text-center text-red-600 py-10">{(error as any)?.response?.data?.message || (error as any)?.message || "no room got deteced"}</div>;


    const handleEdit = async (index: number) => {
        const workId = room.modularWorks[index]._id;
        await editWork({ projectId: projectId!, roomId: roomId!, workId, body: editedWork });
        setEditingIndex(null);
    };

    const handleDelete = async (index: number) => {
        const workId = room.modularWorks[index]._id;
        await deleteWork({ projectId: projectId!, roomId: roomId!, workId });
    };

    const handleRoomDelete = async () => {
        await deleteRoom({ projectId: projectId!, roomId: roomId! });
    };


    if (!room) {
        return <div>
            ro room available
        </div>
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex justify-between items-center gap-2">
                    <Button onClick={() => navigate(-1)}>go back<i className="ml-2 fas fa-arrow-left"></i></Button>
                    <h1 className="text-2xl font-semibold text-blue-700">Room: {room?.roomName}</h1>
                </div>
                <Button variant="danger" onClick={handleRoomDelete}>Delete Room</Button>
            </div>

            {/* Add Modular Work */}
            <CreateMaterialWorkForm projectId={projectId!} roomId={roomId!} />

            {/* Work List */}
            <div className="grid gap-4 md:grid-cols-2">
                {room?.modularWorks?.map((work: any, index: number) => (
                    <Card key={index} className="bg-white shadow-md">
                        <CardContent className="space-y-2 py-4">
                            {editingIndex === index ? (
                                <>
                                    <Input
                                        value={editedWork.workName}
                                        onChange={(e) => setEditedWork({ ...editedWork, workName: e.target.value })}
                                    />
                                    <Input
                                        value={editedWork.notes || ""}
                                        onChange={(e) => setEditedWork({ ...editedWork, notes: e.target.value })}
                                    />
                                    <Input
                                        value={editedWork.materials[0] || ""}
                                        onChange={(e) => setEditedWork({ ...editedWork, materials: [e.target.value] })}
                                    />
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleEdit(index)}>Save</Button>
                                        <Button variant="secondary" onClick={() => setEditingIndex(null)}>Cancel</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-blue-800">{work.workName}</h3>
                                    <p className="text-sm text-gray-600">{work.notes || "No notes"}</p>
                                    <ul className="text-sm text-gray-800 list-disc ml-4">
                                        {work.materials.map((mat: any, idx: number) => (
                                            <li key={idx}>{mat}</li>
                                        ))}
                                    </ul>
                                    <div className="flex gap-2 pt-2">
                                        <Button variant="link" onClick={() => {
                                            setEditingIndex(index);
                                            setEditedWork(work);
                                        }}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MaterialSelectionRoom;
