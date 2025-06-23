import { useState } from "react";
import { useUpdateRoomField } from "../../../apiList/Stage Api/materialSelectionApi";
import { useDeleteCustomRoomField } from "../../../apiList/Stage Api/materialSelectionApi";
import { useGetSinglePredefinedRoom } from "../../../apiList/Stage Api/materialSelectionApi";

import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Separator } from "../../../components/ui/Seperator";

import { useNavigate, useParams } from "react-router-dom";

export default function RoomDetailCard() {
    const { projectId, roomId } = useParams()
    const navigate = useNavigate()

    console.log("room is from the matierla rooms", projectId)

    if (!projectId || !roomId) return


    const { data: room, isLoading } = useGetSinglePredefinedRoom({ projectId: projectId!, roomId: roomId! });

    console.log("room form the single romdetail card", room)

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [formData, setFormData] = useState({ quantity: 0, unit: "", remarks: "" });

    const { mutateAsync: updateField } = useUpdateRoomField();
    const { mutateAsync: deleteField } = useDeleteCustomRoomField();

    if (isLoading) return <p>Loading room details...</p>;
    if (!room) return <p>Room not found</p>;

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
        await updateField({
            projectId: projectId!,
            roomId: roomId!,
            fieldKey: key,
            updates: formData,
            //   type: isCustomRoom ? "custom" : "predefined",
        });
        setEditingKey(null);
    };

    const handleDelete = async (key: string) => {
        if (confirm("Are you sure you want to delete this field?")) {
            await deleteField({ projectId: projectId!, roomId: roomId!, fieldKey: key });
        }
    };

    const entries = isCustomRoom
        ? room.items.map((item: any) => [item.itemKey, item])
        : Object.entries(room.roomFields);

    return (<>
        <div className="max-w-full h-full mx-auto mt-0 bg-white shadow rounded p-6">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h2>
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
                                        <Button variant="primary" onClick={() => handleSave(key)}>✔</Button>
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
                                            <Button variant="danger" onClick={() => handleDelete(key)}>🗑</Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </>
    );
}
