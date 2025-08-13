import React, { useEffect, useState } from "react";
// import { Label } from "../../../components/ui/Label";

import { useNavigate, useParams } from "react-router-dom";
import RequirementSectionUpload from "./components/RequirementSectionUpload";
import { useDeleteRoomItems, useGetSingleRoomRequirement, useUpdateRequirementRoomItem } from "../../apiList/Stage Api/requirementFormApi";
import { toast } from "../../utils/toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const RoomPage: React.FC = () => {

    const { projectId, roomId } = useParams() as { roomId: string, projectId: string }

    const navigate = useNavigate()
    const { data, isLoading, refetch } = useGetSingleRoomRequirement({ roomId, projectId });
    const { mutateAsync, isPending } = useUpdateRequirementRoomItem()
    const { mutateAsync: deleteMutate, isPending: deletePending } = useDeleteRoomItems()


    const [editData, setEditData] = useState<Record<string, { itemName: string; quantity: number }>>({});
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ itemName: "", quantity: 0 });

    // Initialize editData when room data loads
    useEffect(() => {
        if (data?.items?.length) {
            const initialState: Record<string, { itemName: string; quantity: number }> = {}
            data.items.forEach((item: any) => {
                initialState[item._id] = {
                    itemName: item.itemName || "",
                    quantity: item.quantity || 0,
                }
            })
            setEditData(initialState)
        }
    }, [data, editingId])

    // Handle input changes locally
    const handleChange = (
        itemId: string,
        field: "itemName" | "quantity",
        value: string | number
    ) => {
        setEditData((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: field === "quantity" ? Number(value) : value,
            },
        }));
    };



    const handleSubmit = async (itemId: string | null, isNew = false) => {
        if (!projectId || !roomId) {
            toast({ title: "Error", description: "Missing required data", variant: "destructive" });
            return;
        }



        try {
            let payload;
            if (isNew) {

                if (!newItem.itemName.trim()) {
                    throw new Error("Item Name is required")
                }

                if(newItem.quantity <= 0){
                    throw new Error("Quantity cannot be zero or in negative")
                }

                payload = { itemName: newItem.itemName, quantity: newItem.quantity };
            } else {
                if (!itemId) return;


                if (!editData[itemId].itemName.trim()) {
                    throw new Error("Item Name is required")
                }


                 if(editData[itemId].quantity <= 0){
                    throw new Error("Quantity cannot be zero or in negative")
                }

                payload = {
                    itemName: editData[itemId].itemName,
                    quantity: editData[itemId].quantity,
                };
            }
            await mutateAsync({ projectId, roomId, itemId: isNew ? null : itemId, payload });

            toast({ title: "Success", description: "Room data updated successfully" });
            // refetch()

            if (isNew) {
                setIsAdding(false);
                setNewItem({ itemName: "", quantity: 0 });
            } else {
                setEditingId(null);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || error?.message || "Failed to update room data",
                variant: "destructive",
            });
        }
    };



    const handleDeleteItem = async (itemId: string) => {
        try {

            await deleteMutate({
                projectId,
                roomId,
                itemId,
            })

            toast({ title: "Success", description: "Item Deleted successfully" });
        }
        catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || error?.message || "Failed to update room data",
                variant: "destructive",
            });
        }
    }




    if (isLoading) {
        return (
            <div className="min-h-full  bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading room details...</p>
                </div>
            </div>
        )
    }



    return (
        <div className="max-h-full overflow-y-auto bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
                            >
                                <div className="bg-slate-100 group-hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200">
                                    <i className="fas fa-arrow-left text-sm" />
                                </div>
                                <span className="font-medium">Back to Rooms</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-50 rounded-lg p-2">
                                <i className="fas fa-door-open text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">{data?.roomName || "Room"}</h1>
                                <p className="text-sm text-slate-500">Manage items and requirements</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Room Items Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    {/* Items Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-50 rounded-lg p-2">
                                <i className="fas fa-list-ul text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Room Items</h2>
                                <p className="text-sm text-slate-500">Manage quantities and specifications</p>
                            </div>
                        </div>

                        {/* Add Item Button */}
                        {!isAdding && (
                            <Button
                                onClick={() => setIsAdding(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <i className="fas fa-plus text-sm" />
                                <span>Add Item</span>
                            </Button>
                        )}
                    </div>

                    {/* Add New Item Form */}
                    {isAdding && (
                        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
                            <div className="flex items-center space-x-2 mb-6">
                                <i className="fas fa-plus-circle text-blue-600 text-lg" />
                                <h3 className="text-lg font-medium text-slate-800">Add New Item</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        <i className="fas fa-tag mr-2 text-blue-500" />
                                        Item Name
                                    </label>
                                    <Input
                                        value={newItem.itemName}
                                        onChange={(e) => setNewItem((prev) => ({ ...prev, itemName: e.target.value }))}
                                        placeholder="Wardrobe, ShoeRack ..."
                                        className="w-full h-12 text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        <i className="fas fa-calculator mr-2 text-green-500" />
                                        Quantity
                                    </label>
                                    <Input
                                        type="number"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                        placeholder="0"
                                        className="w-full h-12 text-base"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => handleSubmit(null, true)}
                                    disabled={isPending || !newItem.itemName.trim()}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <i className="fas fa-check text-sm" />
                                    <span>{isPending ? "Saving..." : "Save Item"}</span>
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsAdding(false)
                                        setNewItem({ itemName: "", quantity: 0 })
                                    }}
                                    variant="danger"
                                    className=" bg-red-600 te text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                                >
                                    <i className="fas fa-times text-sm" />
                                    <span>Cancel</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-4">
                        {data?.items?.length === 0 && !isAdding ? (
                            <div className="text-center py-16">
                                <div className="bg-slate-100 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                    <i className="fas fa-inbox text-3xl text-slate-400" />
                                </div>
                                <h3 className="text-xl font-medium text-slate-600 mb-3">No Items Yet</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    Start by adding your first item to this room. You can specify quantities and manage specifications.
                                </p>
                                <Button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto"
                                >
                                    <i className="fas fa-plus text-sm" />
                                    <span>Add First Item</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data?.items?.map((item: any, index: number) => (
                                    <div
                                        key={item._id}
                                        className="border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white"
                                    >
                                        {editingId === item._id ? (
                                            // Edit Mode - List Format
                                            <div className="p-4">
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <i className="fas fa-edit text-blue-600" />
                                                    <h3 className="font-medium text-slate-800">Edit Item #{index + 1}</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                                            <i className="fas fa-tag mr-2 text-blue-500" />
                                                            Item Name
                                                        </label>
                                                        <Input
                                                            value={editData[item._id]?.itemName || ""}
                                                            onChange={(e) => handleChange(item._id, "itemName", e.target.value)}
                                                            className="w-full h-10"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                                            <i className="fas fa-calculator mr-2 text-green-500" />
                                                            Quantity
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            value={editData[item._id]?.quantity || 0}
                                                            onChange={(e) => handleChange(item._id, "quantity", e.target.value)}
                                                            className="w-full h-10"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleSubmit(item._id)}
                                                        disabled={isPending}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                                                    >
                                                        <i className="fas fa-check text-sm" />
                                                        <span>{isPending ? "Saving..." : "Save Changes"}</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => setEditingId(null)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                                                        variant="danger"


                                                    >
                                                        <i className="fas fa-times text-sm" />
                                                        <span>Cancel</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode - List Format
                                            <div className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg border border-blue-200">
                                                            <i className="fas fa-cube text-blue-600" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <h3 className="font-semibold text-slate-800 text-lg truncate">{item.itemName}</h3>
                                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                                                    #{index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                                <span className="flex items-center space-x-1">
                                                                    <i className="fas fa-calculator text-green-500" />
                                                                    <span>Quantity:</span>
                                                                    <span className="font-medium text-slate-800">{item.quantity}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Button
                                                            onClick={() => setEditingId(item._id)}
                                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 border border-blue-200 hover:border-blue-300 ml-4"
                                                        >
                                                            <i className="fas fa-edit text-sm" />
                                                            <span className="hidden sm:inline">Edit</span>
                                                        </Button>


                                                        <Button
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            className="bg-red-600  text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 border border-blue-200 hover:border-blue-300 ml-4"
                                                            isLoading={deletePending}
                                                            variant="danger"
                                                        >
                                                            <i className="fas fa-trash text-sm" />
                                                            <span className="hidden sm:inline">Delete</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* File Uploads Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-green-50 rounded-lg p-2">
                            <i className="fas fa-cloud-upload-alt text-green-600 text-lg" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">File Uploads</h2>
                            <p className="text-sm text-slate-500">Upload requirements and documents</p>
                        </div>
                    </div>

                    <RequirementSectionUpload
                        projectId={projectId!}
                        sectionName={data?.roomName || ""}
                        existingUploads={data?.uploads || []}
                        refetch={refetch}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoomPage;