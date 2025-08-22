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
    const { mutateAsync } = useUpdateRequirementRoomItem()
    const { mutateAsync: deleteMutate, isPending: deletePending } = useDeleteRoomItems()


    // const [editData, setEditData] = useState<Record<string, { itemName: string; quantity: number }>>({});
    // const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<
        Record<string, { id: string; itemName: string; quantity: number; unit: string }>
    >({});


    const [isAdding, setIsAdding] = useState(false);
    // const [newItem, setNewItem] = useState({ itemName: "", quantity: 0 });
    const [newItems, setNewItems] = useState<
        { itemName: string; quantity: number; unit: string }[]
    >([
        { itemName: "", quantity: 1, unit: "" } // start with 1 row
    ]);

    const UNIT_OPTIONS = ["sqft", "cm", "mm", "length", "nos"];

    // Initialize editData when room data loads
    useEffect(() => {
        if (data?.items?.length) {
            const initialState: Record<
                string,
                { id: string; itemName: string; quantity: number; unit: string }
            > = {}

            data.items.forEach((item: any) => {
                initialState[item._id] = {
                    id: item._id,
                    itemName: item.itemName || "",
                    quantity: item.quantity || 0,
                    unit: item.unit || "mm",
                }
            })

            setEditData(initialState)
        }
    }, [data])

    // Handle input changes locally
    // OLD WAY
    // const handleChange = (
    //     itemId: string,
    //     field: "itemName" | "quantity",
    //     value: string | number
    // ) => {
    //     setEditData((prev) => ({
    //         ...prev,
    //         [itemId]: {
    //             ...prev[itemId],
    //             [field]: field === "quantity" ? Number(value) : value,
    //         },
    //     }));
    // };


    // OLD WAY

    // const handleSubmit = async (itemId: string | null, isNew = false) => {
    //     if (!projectId || !roomId) {
    //         toast({ title: "Error", description: "Missing required data", variant: "destructive" });
    //         return;
    //     }
    //     try {
    //         let payload;
    //         if (isNew) {

    //             if (!newItem.itemName.trim()) {
    //                 throw new Error("Item Name is required")
    //             }

    //             if (newItem.quantity <= 0) {
    //                 throw new Error("Quantity cannot be zero or in negative")
    //             }

    //             payload = { itemName: newItem.itemName, quantity: newItem.quantity };
    //         } else {
    //             if (!itemId) return;


    //             if (!editData[itemId].itemName.trim()) {
    //                 throw new Error("Item Name is required")
    //             }


    //             if (editData[itemId].quantity <= 0) {
    //                 throw new Error("Quantity cannot be zero or in negative")
    //             }

    //             payload = {
    //                 itemName: editData[itemId].itemName,
    //                 quantity: editData[itemId].quantity,
    //             };
    //         }
    //         await mutateAsync({ projectId, roomId, itemId: isNew ? null : itemId, payload });

    //         toast({ title: "Success", description: "Room data updated successfully" });
    //         // refetch()

    //         if (isNew) {
    //             setIsAdding(false);
    //             setNewItem({ itemName: "", quantity: 0 });
    //         } else {
    //             setEditingId(null);
    //         }
    //     } catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description:
    //                 error?.response?.data?.message || error?.message || "Failed to update room data",
    //             variant: "destructive",
    //         });
    //     }
    // };


    // Handle change in any field
    const handleNewItemChange = (index: number, field: "itemName" | "quantity" | "unit", value: string | number) => {
        setNewItems((prev) => {
            const updated = prev.map((item, i) =>
                i === index ? { ...item, [field]: field === "quantity" ? Number(value) : value } : item
            );

            // If user typed something in the last row, add a new empty one automatically
            const last = updated[updated.length - 1];
            if (last.itemName.trim() !== "" && !updated.some((i) => i.itemName === "")) {
                updated.push({ itemName: "", quantity: 1, unit: "" });
            }

            if (
                updated.length > 1 &&
                last.itemName.trim() === "" &&
                updated[updated.length - 2].itemName.trim() === ""
            ) {
                updated.pop();
            }

            return updated;
        });
    };

    const handleEditChange = (id: string, field: "itemName" | "quantity" | "unit", value: string | number) => {
        setEditData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: field === "quantity" ? Number(value) : value,
            },
        }));
    };

    // Remove a row
    const handleRemoveRow = (index: number) => {
        setNewItems((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (newItems.length === 0) {
            setIsAdding(false)
        }
    }, [newItems])



    // Save all rows
    const handleSaveAll = async () => {
        const validItems = newItems.filter((i) => i.itemName.trim() !== "" && i.quantity > 0 && i.unit !== "");
        console.log(validItems)
        if (validItems.length === 0) {
            return toast({ title: "Error", description: "every row should be filled with Item name, quanitty, and unit", variant: "destructive" });
        }

        try {
            await Promise.all(
                validItems.map((item) =>
                    mutateAsync({
                        projectId,
                        roomId,
                        itemId: null,
                        payload: { itemName: item.itemName, quantity: item.quantity, unit: item.unit },
                    })
                )
            );

            toast({ title: "Success", description: "All items saved successfully" });
            setNewItems([{ itemName: "", quantity: 1, unit: "" }]); // reset
            setIsAdding(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to save items",
                variant: "destructive",
            });
        }
    };


    // For editing an existing single row
    const handleSaveEdit = async (editData: {
        id: string;
        itemName: string;
        quantity: number;
        unit: string;
    }) => {
        console.log("ediData", editData)

        if (!editData.itemName.trim() || editData.quantity <= 0 || !editData.unit) {
            return toast({
                title: "Error",
                description: "Please fill all fields correctly",
                variant: "destructive",
            });
        }


        try {
            await mutateAsync({
                projectId,
                roomId,
                itemId: editData.id, // existing item id for update
                payload: {
                    itemName: editData.itemName,
                    quantity: editData.quantity,
                    unit: editData.unit,
                },
            });

            toast({ title: "Success", description: "Item updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update item",
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
                                className="flex cursor-pointer items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
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
                                <p className="text-sm text-slate-500">Manage quantities and specifications <span>(Click to Edit, Press Enter to save)</span></p>
                            </div>
                        </div>

                        {/* Add Item Button */}
                        {/* {!isAdding && (
                            <Button
                                onClick={() => setIsAdding(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <i className="fas fa-plus text-sm" />
                                <span>Add Item</span>
                            </Button>
                        )} */}
                    </div>

                    {/* Add New Item Form */}
                    {/*{isAdding && (
                        // <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
                        //     <div className="flex items-center space-x-2 mb-6">
                        //         <i className="fas fa-plus-circle text-blue-600 text-lg" />
                        //         <h3 className="text-lg font-medium text-slate-800">Add New Item</h3>
                        //     </div>

                        //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        //         <div>
                        //             <label className="block text-sm font-medium text-slate-700 mb-3">
                        //                 <i className="fas fa-tag mr-2 text-blue-500" />
                        //                 Item Name
                        //             </label>
                        //             <Input
                        //                 value={newItem.itemName}
                        //                 onChange={(e) => setNewItem((prev) => ({ ...prev, itemName: e.target.value }))}
                        //                 placeholder="Wardrobe, ShoeRack ..."
                        //                 className="w-full h-12 text-base"
                        //             />
                        //         </div>
                        //         <div>
                        //             <label className="block text-sm font-medium text-slate-700 mb-3">
                        //                 <i className="fas fa-calculator mr-2 text-green-500" />
                        //                 Quantity
                        //             </label>
                        //             <Input
                        //                 type="number"
                        //                 value={newItem.quantity}
                        //                 onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                        //                 placeholder="0"
                        //                 className="w-full h-12 text-base"
                        //             />
                        //         </div>
                        //     </div>

                        //     <div className="flex flex-col sm:flex-row gap-3">
                        //         <Button
                        //             onClick={() => handleSubmit(null, true)}
                        //             disabled={isPending || !newItem.itemName.trim()}
                        //             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
                        //         >
                        //             <i className="fas fa-check text-sm" />
                        //             <span>{isPending ? "Saving..." : "Save Item"}</span>
                        //         </Button>
                        //         <Button
                        //             onClick={() => {
                        //                 setIsAdding(false)
                        //                 setNewItem({ itemName: "", quantity: 0 })
                        //             }}
                        //             variant="danger"
                        //             className=" bg-red-600 te text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                        //         >
                        //             <i className="fas fa-times text-sm" />
                        //             <span>Cancel</span>
                        //         </Button>
                        //     </div>
                        // </div>
                    )} */}





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
                                {/*data?.items?.map((item: any) => (
                                    // <>
                                         
                                            // <div
                                            //     key={item._id}
                                            //     className="border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white"
                                            // >
                                            //      {editingId === item._id ? ( 
                                            // <div className="p-4">
                                            //     <div className="flex items-center space-x-2 mb-4">
                                            //         <i className="fas fa-edit text-blue-600" />
                                            //         <h3 className="font-medium text-slate-800">Edit Item #{index + 1}</h3>
                                            //     </div>

                                            //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            //         <div>
                                            //             <label className="block text-sm font-medium text-slate-700 mb-2">
                                            //                 <i className="fas fa-tag mr-2 text-blue-500" />
                                            //                 Item Name
                                            //             </label>
                                            //             <Input
                                            //                 value={editData[item._id]?.itemName || ""}
                                            //                 onChange={(e) => handleChange(item._id, "itemName", e.target.value)}
                                            //                 className="w-full h-10"
                                            //             />
                                            //         </div>
                                            //         <div>
                                            //             <label className="block text-sm font-medium text-slate-700 mb-2">
                                            //                 <i className="fas fa-calculator mr-2 text-green-500" />
                                            //                 Quantity
                                            //             </label>
                                            //             <Input
                                            //                 type="number"
                                            //                 value={editData[item._id]?.quantity || 0}
                                            //                 onChange={(e) => handleChange(item._id, "quantity", e.target.value)}
                                            //                 className="w-full h-10"
                                            //             />
                                            //         </div>
                                            //     </div>

                                            //     <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                                            //         <Button
                                            //             onClick={() => handleSubmit(item._id)}
                                            //             disabled={isPending}
                                            //             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                                            //         >
                                            //             <i className="fas fa-check text-sm" />
                                            //             <span>{isPending ? "Saving..." : "Save Changes"}</span>
                                            //         </Button>
                                            //         <Button
                                            //             onClick={() => setEditingId(null)}
                                            //             className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                                            //             variant="danger"


                                            //         >
                                            //             <i className="fas fa-times text-sm" />
                                            //             <span>Cancel</span>
                                            //         </Button>
                                            //     </div>
                                            // </div>
                                            //     ) : (
                                            //      <div className="p-4">
                                            //          <div className="flex items-center justify-between">
                                            //              <div className="flex items-center space-x-4 flex-1">
                                            //                  <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg border border-blue-200">
                                            //                      <i className="fas fa-cube text-blue-600" />
                                            //                  </div>

                                            //                  <div className="flex-1 min-w-0">
                                            //                      <div className="flex items-center space-x-3 mb-1">
                                            //                          <h3 className="font-semibold text-slate-800 text-lg truncate">{item.itemName}</h3>
                                            //                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                            //                              #{index + 1}
                                            //                          </span>
                                            //                      </div>
                                            //                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                                            //                          <span className="flex items-center space-x-1">
                                            //                              <i className="fas fa-calculator text-green-500" />
                                            //                              <span>Quantity:</span>
                                            //                              <span className="font-medium text-slate-800">{item.quantity}</span>
                                            //                          </span>
                                            //                      </div>
                                            //                  </div>
                                            //              </div>

                                            //              <div>
                                            //                  <Button
                                            //                      onClick={() => setEditingId(item._id)}
                                            //                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 border border-blue-200 hover:border-blue-300 ml-4"
                                            //                  >
                                            //                      <i className="fas fa-edit text-sm" />
                                            //                      <span className="hidden sm:inline">Edit</span>
                                            //                  </Button>


                                            //                  <Button
                                            //                      onClick={() => handleDeleteItem(item._id)}
                                            //                      className="bg-red-600  text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 border border-blue-200 hover:border-blue-300 ml-4"
                                            //                      isLoading={deletePending}
                                            //                      variant="danger"
                                            //                  >
                                            //                      <i className="fas fa-trash text-sm" />
                                            //                      <span className="hidden sm:inline">Delete</span>
                                            //                  </Button>
                                            //              </div>
                                            //          </div>
                                            //      </div>
                                            //  )}

                                            //  }
                                            // </div>
                                        //}

                                        // <div
                                        //     key={item._id}
                                        //     className="flex items-center gap-3  p-3 rounded-lg bg-white"
                                        // >


                                        //     <Input
                                        //         placeholder="Item name"
                                        //         value={editData[item._id]?.itemName ?? item.itemName ?? ""}
                                        //         onChange={(e) => handleEditChange(item._id, "itemName", e.target.value)}
                                        //         onKeyDown={(e) => {
                                        //             if (e.key === "Enter") {
                                        //                 handleSaveEdit(editData[item._id] ?? item);
                                        //             }
                                        //         }}
                                        //         className="flex-1"
                                        //     />

                                        //     <Input
                                        //         type="number"
                                        //         placeholder="Qty"
                                        //         value={editData[item._id]?.quantity ?? item.quantity ?? 0}
                                        //         onChange={(e) => handleEditChange(item._id, "quantity", e.target.value)}
                                        //         onKeyDown={(e) => {
                                        //             if (e.key === "Enter") {
                                        //                 handleSaveEdit(
                                        //                     editData[item._id] ?? item
                                        //                 );
                                        //             }
                                        //         }}
                                        //         className="w-24"
                                        //     />

                                        //     <select
                                        //         value={editData[item._id]?.unit ?? item.unit ?? ""}
                                        //         onChange={(e) => {
                                        //             handleEditChange(item._id, "unit", e.target.value)
                                        //             handleSaveEdit(
                                        //                 editData[item._id] ?? item
                                        //             );
                                        //         }}
                                               
                                //                 className="border px-2 py-1 rounded"
                                //             >
                                //                 <option value="">Unit</option>
                                //                 {UNIT_OPTIONS.map((u) => (
                                //                     <option key={u} value={u}>
                                //                         {u}
                                //                     </option>
                                //                 ))}
                                //             </select>

                                //             <Button
                                //                 onClick={() => handleDeleteItem(item._id)}
                                //                 disabled={deletePending}
                                //                 className="bg-red-600 hover:bg-red-700 text-white"
                                //             >
                                //                 {deletePending ? "Deleting..." : "Delete"}
                                //             </Button>


                                //         </div>
                                //     </>
                                // ))}
                                /*}



                                <div className="overflow-x-auto">
                                    {/* Header */}
                                <div className="min-w-[600px] grid grid-cols-4 gap-3 px-3 py-2 bg-gray-100 text-sm font-semibold rounded-t-lg">
                                    <p className="text-center">Item Name</p>
                                    <p className="text-center">Quantity</p>
                                    <p className="text-center">Unit</p>
                                    <p className="text-center">Action</p>
                                </div>

                                {/* Existing items */}
                                <div className="space-y-2">
                                    {data?.items?.map((item: any) => (
                                        <div
                                            key={item._id}
                                            className="min-w-[600px] grid grid-cols-4 gap-3 items-center px-3 py-2 border-b bg-white "
                                        >
                                            {/* Item Name */}
                                            <Input
                                                placeholder="Item name"
                                                value={editData[item._id]?.itemName ?? item.itemName ?? ""}
                                                onChange={(e) => handleEditChange(item._id, "itemName", e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleSaveEdit(editData[item._id] ?? item);
                                                }}
                                                className="!border-none focus:ring-0 text-center"

                                            />

                                            {/* Quantity */}
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                value={editData[item._id]?.quantity ?? item.quantity ?? 0}
                                                onChange={(e) => handleEditChange(item._id, "quantity", e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleSaveEdit(editData[item._id] ?? item);
                                                }}
                                                className="!border-none focus:ring-0  text-center"

                                            />

                                            {/* Unit */}
                                            <select
                                                value={editData[item._id]?.unit ?? item.unit ?? ""}
                                                onChange={(e) => {
                                                    handleEditChange(item._id, "unit", e.target.value);
                                                    handleSaveEdit(editData[item._id] ?? item);
                                                }}
                                                className="border px-2 py-1 rounded"
                                            >
                                                <option value="">Unit</option>
                                                {UNIT_OPTIONS.map((u) => (
                                                    <option key={u} value={u}>
                                                        {u}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Action */}
                                            <div className="flex justify-center">
                                                <Button
                                                    onClick={() => handleDeleteItem(item._id)}
                                                    disabled={deletePending}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                                                >
                                                    {deletePending ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* New Items Section */}
                                {isAdding ? (
                                    <div className="space-y-2 mt-4">
                                        {newItems?.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="min-w-[600px] grid grid-cols-4 gap-3 items-center  border-b bg-white "
                                            >
                                                <Input
                                                    placeholder="Item name"
                                                    value={item.itemName}
                                                    onChange={(e) => handleNewItemChange(idx, "itemName", e.target.value)}
                                                    className="!border-none focus:ring-0  text-center"
                                                    autoFocus={idx===0}

                                                />

                                                <Input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={(e) => handleNewItemChange(idx, "quantity", e.target.value)}
                                                    className="!border-none focus:ring-0  text-center"
                                                />

                                                <select
                                                    value={item.unit}
                                                    onChange={(e) => handleNewItemChange(idx, "unit", e.target.value)}
                                                    className="border px-2 py-1 rounded"

                                                >
                                                    <option value="">Unit</option>
                                                    {UNIT_OPTIONS.map((u) => (
                                                        <option key={u} value={u}>
                                                            {u}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="flex justify-center">
                                                    <Button
                                                        onClick={() => handleRemoveRow(idx)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mx-auto"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end mt-3">
                                            <Button
                                                onClick={handleSaveAll}
                                                disabled={newItems.every((item) =>
                                                    Object.entries(item).every(([k, v]) => k === "itemName" && !v ? false : true)
                                                )}

                                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                                            >
                                                Save All Items
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full  flex justify-end">
                                        <Button
                                            onClick={() => {
                                                setIsAdding(true);
                                                setNewItems([{ itemName: "", quantity: 1, unit: "" }]);
                                            }}
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg  "
                                        >
                                            + Add Item
                                        </Button>
                                    </div>

                                )}
                            </div>

                            // </div>
                        )}
                    </div>

                    {/* Add New Item Form */}

                    {/* {!isAdding ?
                        <Button
                            onClick={() => {
                                setIsAdding(true)

                                setNewItems([{ itemName: "", quantity: 1, unit: "" }])
                            }
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <i className="fas fa-plus text-sm" />
                            <span>Add Item</span>
                        </Button>
                        :
                        <div className="space-y-3">
                            {newItems?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3  p-3 rounded-lg bg-white">
                                    <Input
                                        placeholder="Item name"
                                        value={item.itemName}
                                        onChange={(e) => handleNewItemChange(idx, "itemName", e.target.value)}
                                        className="flex-1"
                                    />

                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) => handleNewItemChange(idx, "quantity", e.target.value)}
                                        className="w-24"
                                    />

                                    <select
                                        value={item.unit}
                                        onChange={(e) => handleNewItemChange(idx, "unit", e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="">Unit</option>
                                        {UNIT_OPTIONS.map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>

                                    <Button
                                        onClick={() => handleRemoveRow(idx)}
                                        variant="danger"
                                        className="bg-red-500 text-white"
                                    >
                                        remove
                                    </Button>
                                </div>
                            ))}

                            <Button
                                onClick={handleSaveAll}
                                disabled={newItems.every(item => Object.values(item).every(item => !item))}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                            >
                                Save All Items
                            </Button>
                        </div>
                        } */}

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
        </div >
    );
};

export default RoomPage;