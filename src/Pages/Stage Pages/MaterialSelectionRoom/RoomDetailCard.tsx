import { useState } from "react";
import { useUpdateRoomField,  } from "../../../apiList/Stage Api/materialSelectionApi";
import { useDeleteCustomRoomField } from "../../../apiList/Stage Api/materialSelectionApi";
import { useGetSinglePredefinedRoom } from "../../../apiList/Stage Api/materialSelectionApi";

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";


import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import RoomDetailsLoading from "./MaterailSelectionLoadings/RoomDetailLoading";
import EmptyState from "../../../components/ui/EmptyState";
import MaterialRoomUploads from "./MaterialRoomUploads";

export default function RoomDetailCard() {
    const { projectId, roomId } = useParams()
    const navigate = useNavigate()

    console.log("room is from the matierla rooms", projectId)

    if (!projectId || !roomId) return


    const { data: room, isLoading } = useGetSinglePredefinedRoom({ projectId: projectId!, roomId: roomId! });



    console.log("room form the single romdetail card", room)

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [formData, setFormData] = useState({ quantity: 0, unit: "", remarks: "" });

    const { mutateAsync: updateField, isPending: updatePending } = useUpdateRoomField();
    const { mutateAsync: deleteField, isPending: deletePending } = useDeleteCustomRoomField();

    if (isLoading) return <RoomDetailsLoading />;
    if (!room) return <EmptyState message="Room not found" color="primary" customIconClass="box" icon="custom" />;

    const isCustomRoom = "items" in room;

    const handleEdit = (key: string, field: any) => {
        setEditingKey(key);
        setFormData({
            quantity: field.quantity || 0,
            unit: field.unit || "",
            remarks: field.remarks || "",
        });
    };


    const handleSave = async (key: string) => {
        try {
            await updateField({
                projectId: projectId!,
                roomId: roomId!,
                fieldKey: key,
                updates: formData,
                //   type: isCustomRoom ? "custom" : "predefined",
            });
            setEditingKey(null);
            toast({ description: 'field updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update field", variant: "destructive" })
        }
    };

    const handleDelete = async (key: string) => {
        try {
            if (confirm("Are you sure you want to delete this field?")) {
                await deleteField({ projectId: projectId!, roomId: roomId!, fieldKey: key });
            }
            toast({ description: 'field deleted successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to deleted field", variant: "destructive" })

        }
    };

    const entries = isCustomRoom
        ? room.items.map((item: any) => [item.itemKey, item])
        : Object.entries(room.roomFields);

    return (<>
        <div className="max-w-full h-full border-2 overflow-y-scroll mx-auto mt-0 bg-white shadow rounded p-6">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">{room.name}</h2>
                    <p className="text-gray-500 mb-6">Room Material Items</p>
                </div>

                <Button variant="primary" className="h-10" onClick={() => navigate(-1)}>Go Back</Button>
            </div>

            <section className="border-2 border-gray-100 rounded-lg h-[90%]">
                {/* Header */}
                <div className="grid grid-cols-5 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-3 border-b">
                    <div>Item</div>
                    <div>Quantity</div>
                    <div>Unit</div>
                    <div>Remarks</div>
                    <div>Actions</div>
                </div>

                {/* Scrollable Rows */}
                <div className="max-h-[92%]  overflow-y-auto divide-y divide-gray-200">
                    {entries.map(([key, value]: any) => (
                        <div key={key} className="grid grid-cols-5 items-center px-4 py-3 text-sm hover:bg-gray-50">
                            <div className="font-medium text-gray-700">{key}</div>

                            {editingKey === key ? (
                                <>
                                    <div>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: +e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="primary" isLoading={updatePending} onClick={() => handleSave(key)}>✔</Button>
                                        <Button variant="ghost" onClick={() => setEditingKey(null)}>✖</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>{value.quantity ?? "N/A"}</div>
                                    <div>{value.unit || "N/A"}</div>
                                    <div>{value.remarks || "N/A"}</div>
                                    <div className="flex gap-2">
                                        <Button variant="primary" onClick={() => handleEdit(key, value)}>✎</Button>
                                        {isCustomRoom && (
                                            <Button variant="danger" isLoading={deletePending} onClick={() => handleDelete(key)}>🗑</Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>


            <section className="mt-4">
                <MaterialRoomUploads projectId={projectId!} roomId={roomId!} initialFiles={room.uploads} />
            </section>
        </div>
    </>
    );
}
