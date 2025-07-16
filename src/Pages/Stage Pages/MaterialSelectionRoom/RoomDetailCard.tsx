import { useState } from "react";
import { useUpdateRoomField } from "../../../apiList/Stage Api/materialSelectionApi";
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
    const { projectId, roomId } = useParams();
    const navigate = useNavigate();

    if (!projectId || !roomId) return null;

    const { data: room, isLoading, refetch } = useGetSinglePredefinedRoom({ projectId, roomId });
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [formData, setFormData] = useState({ quantity: 0, unit: "", remarks: "" });

    const { mutateAsync: updateField, isPending: updatePending } = useUpdateRoomField();
    const { mutateAsync: deleteField, isPending: deletePending } = useDeleteCustomRoomField();

    if (isLoading) return <RoomDetailsLoading />;
    if (!room) return <EmptyState message="Room not found" color="primary" customIconClass="box" icon="custom" />;

    const isCustomRoom = "items" in room;
    const entries = isCustomRoom
        ? room.items.map((item: any) => [item.itemKey, item])
        : Object.entries(room.roomFields);

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
                projectId,
                roomId,
                fieldKey: key,
                updates: formData,
            });
            setEditingKey(null);
            toast({ description: 'Field updated successfully', title: "Success" });
            refetch()
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.response?.data?.message || error.message || "Failed to update field", 
                variant: "destructive" 
            });
        }
    };

    const handleDelete = async (key: string) => {
        try {
            if (confirm("Are you sure you want to delete this field?")) {
                await deleteField({ projectId, roomId, fieldKey: key });
            }
            toast({ description: 'Field deleted successfully', title: "Success" });
            refetch()
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.response?.data?.message || error.message || "Failed to delete field", 
                variant: "destructive" 
            });
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-y-auto custom-scrollbar" >
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600">{room.name}</h2>
                    <p className="text-gray-500 text-sm sm:text-base">Room Material Items</p>
                </div>
                <Button 
                    variant="primary" 
                    className="h-10 text-sm sm:text-base"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
            </div>

            {/* Table Container */}
<section className="w-full min-h-[100%] flex flex-col">
      <div className="overflow-x-auto min-w-full flex-grow min-h-0">
    <div className="min-w-[700px] w-full flex flex-col border-2 border-gray-100 rounded-lg">

            {/* <div className="w-max min-w-[10px] flex-grow  min-h-[100%] flex flex-col border-2 border-gray-100 rounded-lg"> */}
                {/* Table Header - Sticky top */}
                <div className="rounded-md grid grid-cols-5 bg-gray-100 text-sm font-semibold text-gray-700 px-2 sm:px-4 py-3 sticky top-0 z-10">
                    <div className="truncate text-center">Item</div>
                    <div className="truncate text-center">Quantity</div>
                    <div className="truncate text-center">Unit</div>
                    <div className="truncate text-center">Remarks</div>
                    <div className="truncate text-center">Actions</div>
                </div>

                {/* Table Body - Scrollable */}
                <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar">
                    {entries.map(([key, value]: any) => (
                        <div 
                            key={key} 
                            className="grid text-center mx-auto grid-cols-5 items-center px-2 sm:px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                            <div className="font-medium text-gray-700 truncate pr-2">{key}</div>

                            {editingKey === key ? (
                                <>
                                    <div>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: +e.target.value })}
                                            className="w-full text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                            className="w-full text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-1 sm:gap-2 mx-auto">
                                        <Button 
                                            variant="primary" 
                                            isLoading={updatePending} 
                                            onClick={() => handleSave(key)}
                                            className="text-xs sm:text-sm p-1 sm:p-2"
                                        >
                                            <i className="fas fa-check"></i>
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => setEditingKey(null)}
                                            className="text-xs sm:text-sm p-1 sm:p-2"
                                        >
                                            <i className="fas fa-xmark"></i>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="truncate pr-2">{value.quantity ?? "N/A"}</div>
                                    <div className="truncate pr-2">{value.unit || "N/A"}</div>
                                    <div className="max-h-[70px] overflow-y-auto custom-scrollbar cursor-grab pr-2">
                                        {value.remarks || "N/A"}
                                    </div>
                                    <div className="flex gap-1 sm:gap-2 mx-auto">
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleEdit(key, value)}
                                            className="text-xs sm:text-sm p-1 sm:p-2"
                                        >
                                            <i className="fas fa-pencil "></i>
                                        </Button>
                                        {isCustomRoom && (
                                            <Button 
                                                variant="danger" 
                                                isLoading={deletePending} 
                                                onClick={() => handleDelete(key)}
                                                className="text-xs sm:text-sm p-1 sm:p-2"
                                            >
                                                <i className="fas fa-trash-can"></i>
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            </div>
            </section>


            <section className="mt-4">
                <MaterialRoomUploads 
                    projectId={projectId} 
                    roomId={roomId} 
                    initialFiles={room.uploads} 
                    refetch={refetch} 
                />
            </section>
        </div>
    );
}