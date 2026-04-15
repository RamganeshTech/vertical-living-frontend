import React, { useEffect, useState } from "react";
// import { Label } from "../../../components/ui/Label";

import { useNavigate, useParams } from "react-router-dom";
import RequirementSectionUpload from "./components/RequirementSectionUpload";
import { useDeleteRoomItems, useGetSingleRoomRequirement, useUpdateRequirementRoomItem } from "../../apiList/Stage Api/requirementFormApi";
import { toast } from "../../utils/toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthCheck } from "../../Hooks/useAuthCheck";


type NewItem = { itemName: string; quantity: number; unit: string }
const RoomPage: React.FC = () => {

    const { projectId, roomId } = useParams() as { roomId: string, projectId: string }



    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.clientrequirement?.delete;
    // const canList = role === "owner" || permission?.clientrequirement?.list;
    const canCreate = role === "owner" || permission?.clientrequirement?.create;
    const canEdit = role === "owner" || permission?.clientrequirement?.edit;



    const navigate = useNavigate()
    const { data, isLoading, refetch } = useGetSingleRoomRequirement({ roomId, projectId });
    const { mutateAsync } = useUpdateRequirementRoomItem()
    const { mutateAsync: deleteMutate, isPending: deletePending } = useDeleteRoomItems()

    const [editData, setEditData] = useState<
        Record<string, { id: string; itemName: string; quantity: number; unit: string }>
    >({});


    const [isAdding, setIsAdding] = useState(false);
    const [newItems, setNewItems] = useState<NewItem[]>([
        { itemName: "", quantity: 1, unit: "unit" } // start with 1 row
    ]);

    const UNIT_OPTIONS = ["unit", "sqft", "cm", "mm", "length", "nos"];

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
                    unit: item.unit || "unit",
                }
            })

            setEditData(initialState)
        }
    }, [data])


    // Handle change in any field
    const handleNewItemChange = (index: number, field: "itemName" | "quantity" | "unit", value: string | number) => {
        setNewItems((prev: NewItem[]) => {
            const updated = prev.map((item, i) =>
                i === index ? {
                    ...item,
                    [field]: field === "quantity" ? Number(value) : value,
                    unit: field === "unit" ? String(value) : (item?.unit || "unit"),
                }
                    : item
            );

            // If user typed something in the last row, add a new empty one automatically
            const last = updated[updated.length - 1];
            if (last.itemName.trim() !== "" && !updated.some((i) => i.itemName === "")) {
                updated.push({ itemName: "", quantity: 1, unit: "unit" });
            }

            if (
                updated.length > 1 &&
                last.itemName.trim() === "" &&
                updated[updated.length - 2].itemName.trim() === ""
            ) {
                updated.pop();
            }


            console.log("updated", updated)
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
        console.log("newItems", newItems)
        const validItems = newItems.filter((i) => i.itemName.trim() !== "" && i.quantity > 0 && i.unit !== "");
        console.log(validItems)
        if (validItems.length === 0) {
            return toast({ title: "Error", description: "every row should be filled with Item name, quanitty, and unit", variant: "destructive" });
        }

        try {
            // await Promise.all(
            //     validItems.map((item) =>
            //         mutateAsync({
            //             projectId,
            //             roomId,
            //             itemId: null,
            //             payload: { itemName: item.itemName, quantity: item.quantity, unit: item.unit },
            //         })
            //     )
            // );

            for (const item of validItems) {
                await mutateAsync({
                    projectId,
                    roomId,
                    itemId: null,
                    payload: { itemName: item.itemName, quantity: item.quantity, unit: item.unit },
                });
            }


            toast({ title: "Success", description: "All items saved successfully" });
            setNewItems([{ itemName: "", quantity: 1, unit: "unit" }]); // reset
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
        // console.log("ediData", editData)

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



    // return (
    //     <div className="max-h-full overflow-y-auto bg-slate-50">
    //         {/* Header */}
    //         <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
    //             <div className="w-full px-4 sm:px-6 lg:px-8">
    //                 <div className="flex items-center justify-between py-4">
    //                     <div className="flex items-center space-x-4">
    //                         <button
    //                             onClick={() => navigate(-1)}
    //                             className="flex cursor-pointer items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
    //                         >
    //                             <div className="bg-slate-100 group-hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200">
    //                                 <i className="fas fa-arrow-left text-sm" />
    //                             </div>
    //                             <span className="font-medium">Back to Rooms</span>
    //                         </button>
    //                     </div>

    //                     <div className="flex items-center space-x-3">
    //                         <div className="bg-blue-50 rounded-lg p-2">
    //                             <i className="fas fa-door-open text-blue-600" />
    //                         </div>
    //                         <div>
    //                             <h1 className="text-xl font-bold text-slate-800">{data?.roomName || "Room"}</h1>
    //                             <p className="text-sm text-slate-500">Manage items and requirements</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Main Content */}
    //         <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    //             {/* Room Items Section */}
    //             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    //                 {/* Items Header */}
    //                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
    //                     <div className="flex items-center space-x-3">
    //                         <div className="bg-blue-50 rounded-lg p-2">
    //                             <i className="fas fa-list-ul text-blue-600" />
    //                         </div>
    //                         <div>
    //                             <h2 className="text-xl font-semibold text-slate-800">Room Items</h2>
    //                             <p className="text-sm text-slate-500">Manage quantities and specifications <span>(Click to Edit, Press Enter to save)</span></p>
    //                         </div>
    //                     </div>
    //                 </div>





    //                 {/* Items List */}
    //                 <div className="space-y-4">
    //                     {data?.items?.length === 0 && !isAdding ? (
    //                         <div className="text-center py-16">
    //                             <div className="bg-slate-100 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
    //                                 <i className="fas fa-inbox text-3xl text-slate-400" />
    //                             </div>
    //                             <h3 className="text-xl font-medium text-slate-600 mb-3">No Items Yet</h3>
    //                             <p className="text-slate-500 mb-6 max-w-md mx-auto">
    //                                 Start by adding your first item to this room. You can specify quantities and manage specifications.
    //                             </p>
    //                             {(canCreate || canEdit) && <Button
    //                                 onClick={() => setIsAdding(true)}
    //                                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto"
    //                             >
    //                                 <i className="fas fa-plus text-sm" />
    //                                 <span>Add First Item</span>
    //                             </Button>}
    //                         </div>
    //                     ) : (
    //                         <div className="space-y-3">


    //                             <div className="overflow-x-auto">
    //                                 {/* Header */}
    //                                 <div className="min-w-[600px] grid grid-cols-4 gap-3 px-3 py-2 bg-gray-100 text-sm font-semibold rounded-t-lg">
    //                                     <p className="text-center">Item Name</p>
    //                                     <p className="text-center">Quantity</p>
    //                                     <p className="text-center">Unit</p>
    //                                     <p className="text-center">Action</p>
    //                                 </div>

    //                                 {/* Existing items */}
    //                                 <div className="space-y-2">
    //                                     {data?.items?.map((item: any) => (
    //                                         <div
    //                                             key={item._id}
    //                                             className="min-w-[600px] grid grid-cols-4 gap-3 items-center px-3 py-2 border-b bg-white "
    //                                         >
    //                                             {/* Item Name */}
    //                                             <Input
    //                                                 placeholder="Item name"
    //                                                 value={editData[item._id]?.itemName ?? item.itemName ?? ""}
    //                                                 onChange={(e) => handleEditChange(item._id, "itemName", e.target.value)}
    //                                                 onKeyDown={(e) => {
    //                                                     if (e.key === "Enter") handleSaveEdit(editData[item._id] ?? item);
    //                                                 }}
    //                                                 className="!border-none focus:ring-0 text-center"

    //                                             />

    //                                             {/* Quantity */}
    //                                             <Input
    //                                                 type="number"
    //                                                 placeholder="Qty"
    //                                                 value={editData[item._id]?.quantity ?? item.quantity ?? 0}
    //                                                 onChange={(e) => handleEditChange(item._id, "quantity", e.target.value)}
    //                                                 onKeyDown={(e) => {
    //                                                     if (e.key === "Enter") handleSaveEdit(editData[item._id] ?? item);
    //                                                 }}
    //                                                 className="!border-none focus:ring-0  text-center"

    //                                             />

    //                                             {/* Unit */}
    //                                             <select
    //                                                 value={editData[item._id]?.unit ?? item.unit ?? ""}
    //                                                 onChange={(e) => {
    //                                                     handleEditChange(item._id, "unit", e.target.value);
    //                                                     handleSaveEdit(editData[item._id] ?? item);
    //                                                 }}
    //                                                 className="border px-2 py-1 rounded"
    //                                             >
    //                                                 <option value="">Unit</option>
    //                                                 {UNIT_OPTIONS.map((u) => (
    //                                                     <option key={u} value={u}>
    //                                                         {u}
    //                                                     </option>
    //                                                 ))}
    //                                             </select>

    //                                             {/* Action */}
    //                                             {canDelete && <div className="flex justify-center">
    //                                                 <Button
    //                                                     onClick={() => handleDeleteItem(item._id)}
    //                                                     disabled={deletePending}
    //                                                     className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
    //                                                 >
    //                                                     {deletePending ? "Deleting..." : "Delete"}
    //                                                 </Button>
    //                                             </div>}
    //                                         </div>
    //                                     ))}
    //                                 </div>

    //                                 {/* New Items Section */}
    //                                 {isAdding ? (
    //                                     <div className="space-y-2 mt-4">
    //                                         {newItems?.map((item, idx) => (
    //                                             <div
    //                                                 key={idx}
    //                                                 className="min-w-[600px] grid grid-cols-4 gap-3 items-center  border-b bg-white "
    //                                             >
    //                                                 <Input
    //                                                     placeholder="Item name"
    //                                                     value={item.itemName}
    //                                                     onChange={(e) => handleNewItemChange(idx, "itemName", e.target.value)}
    //                                                     className="!border-none focus:ring-0  text-center"
    //                                                     autoFocus={idx === 0}

    //                                                 />

    //                                                 <Input
    //                                                     type="number"
    //                                                     placeholder="Qty"
    //                                                     value={item.quantity}
    //                                                     onChange={(e) => handleNewItemChange(idx, "quantity", e.target.value)}
    //                                                     className="!border-none focus:ring-0  text-center"
    //                                                 />

    //                                                 <select
    //                                                     value={item.unit}
    //                                                     onChange={(e) => handleNewItemChange(idx, "unit", e.target.value)}
    //                                                     className="border px-2 py-1 rounded"

    //                                                 >
    //                                                     {/* <option value="">Unit</option> */}
    //                                                     {UNIT_OPTIONS.map((u) => (
    //                                                         <option key={u} value={u}>
    //                                                             {u}
    //                                                         </option>
    //                                                     ))}
    //                                                 </select>

    //                                                 <div className="flex justify-center">
    //                                                     <Button
    //                                                         onClick={() => handleRemoveRow(idx)}
    //                                                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mx-auto"
    //                                                     >
    //                                                         Remove
    //                                                     </Button>
    //                                                 </div>
    //                                             </div>
    //                                         ))}

    //                                         <div className="flex justify-end mt-3">
    //                                           {  (canCreate || canEdit) && <Button
    //                                                 onClick={handleSaveAll}
    //                                                 disabled={newItems.every((item) =>
    //                                                     Object.entries(item).every(([k, v]) => k === "itemName" && !v ? false : true)
    //                                                 )}

    //                                                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
    //                                             >
    //                                                 Save All Items
    //                                             </Button>}
    //                                         </div>
    //                                     </div>
    //                                 ) : (
    //                                     <div className="w-full  flex justify-end">
    //                                       {(canCreate || canEdit) &&   <Button
    //                                             onClick={() => {
    //                                                 setIsAdding(true);
    //                                                 setNewItems([{ itemName: "", quantity: 1, unit: "unit" }]);
    //                                             }}
    //                                             className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg  "
    //                                         >
    //                                             + Add Item
    //                                         </Button>}
    //                                     </div>

    //                                 )}
    //                             </div>

    //                         </div>
    //                     )}
    //                 </div>


    //             </div>

    //             {/* File Uploads Section */}
    //             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    //                 <div className="flex items-center space-x-3 mb-6">
    //                     <div className="bg-green-50 rounded-lg p-2">
    //                         <i className="fas fa-cloud-upload-alt text-green-600 text-lg" />
    //                     </div>
    //                     <div>
    //                         <h2 className="text-xl font-semibold text-slate-800">File Uploads</h2>
    //                         <p className="text-sm text-slate-500">Upload requirements and documents</p>
    //                     </div>
    //                 </div>

    //                 <RequirementSectionUpload
    //                     projectId={projectId!}
    //                     sectionName={data?.roomName || ""}
    //                     existingUploads={data?.uploads || []}
    //                     refetch={refetch}
    //                 />
    //             </div>
    //         </div>
    //     </div >
    // );

    return (

        <div className="max-h-full overflow-y-auto bg-brand-surface">
            {/* Header */}
            <div className="bg-brand-surface border-b border-ash-light sticky top-0 z-10 shadow-sm">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                // className="flex cursor-pointer items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 group"
                                className="flex cursor-pointer items-center space-x-2 text-text-muted hover:text-text-main transition-colors duration-200 group"
                            >
                                <div className="bg-brand-surface border border-ash-medium shadow-sm group-hover:bg-brand-ash rounded-lg p-2 transition-colors duration-200 w-8 h-8 flex items-center justify-center">
                                    <i className="fas fa-arrow-left text-sm" />
                                </div>
                                <span className="font-bold text-[12px] uppercase tracking-wider">Back to Rooms</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-brand-ash border border-ash-light rounded-lg w-10 h-10 flex items-center justify-center shadow-sm">
                                <i className="fas fa-door-open text-text-muted text-sm" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-text-main leading-tight">{data?.roomName || "Room"}</h1>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Manage items and requirements</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Room Items Section */}
                <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium p-5 sm:p-6">
                    {/* Items Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-ash-light pb-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-brand-ash border border-ash-light shadow-sm rounded-lg w-10 h-10 flex items-center justify-center">
                                <i className="fa-solid fa-list-ul text-text-muted text-sm" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-text-main">Room Items</h2>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">Manage quantities and specifications <span className="italic text-ash-dark ml-1">(Edit & Press Enter to save)</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4">
                        {data?.items?.length === 0 && !isAdding ? (
                            <div className="text-center py-16 border border-dashed border-ash-medium rounded-xl bg-brand-ash/50">
                                <div className="bg-brand-surface border border-ash-light shadow-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <i className="fas fa-inbox text-2xl text-ash-dark" />
                                </div>
                                <h3 className="text-lg font-bold text-text-main mb-1">No Items Yet</h3>
                                <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                                    Start by adding your first item to this room. You can specify quantities and manage specifications.
                                </p>
                                {(canCreate || canEdit) && (
                                    <Button
                                        variant="dark"
                                        onClick={() => setIsAdding(true)}
                                        className="px-6 shadow-sm mx-auto"
                                    >
                                        <i className="fas fa-plus mr-2" />
                                        Add First Item
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="overflow-x-auto pb-4">
                                    {/* Table Header */}
                                    {/* <div className="min-w-[600px] grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-t-xl text-[11px] font-bold uppercase tracking-wider text-gray-500"> */}
                                    <div className="min-w-[600px] grid grid-cols-4 gap-4 px-4 py-3 bg-brand-ash border border-ash-medium rounded-t-xl text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                        <p className="text-center">Item Name</p>
                                        <p className="text-center">Quantity</p>
                                        <p className="text-center">Unit</p>
                                        <p className="text-center">Action</p>
                                    </div>

                                    {/* Existing items */}
                                    {/* <div className="border-x border-b border-gray-200 rounded-b-xl overflow-hidden"> */}
                                    <div className="border-x border-b border-ash-medium rounded-b-xl overflow-hidden">
                                        {data?.items?.map((item: any) => (
                                            <div
                                                key={item._id}
                                                // className="min-w-[600px] grid grid-cols-4 gap-4 items-center px-4 py-2 border-b last:border-b-0 border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                                                className="min-w-[600px] grid grid-cols-4 gap-4 items-center px-4 py-2 border-b last:border-b-0 border-ash-light bg-brand-surface hover:bg-brand-ash/50 transition-colors"
                                            >
                                                {/* Item Name */}
                                                <Input
                                                    placeholder="Item name"
                                                    value={editData[item._id]?.itemName ?? item.itemName ?? ""}
                                                    onChange={(e) => handleEditChange(item._id, "itemName", e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleSaveEdit(editData[item._id] ?? item);
                                                    }}
                                                    // className="bg-transparent border-0 border-b border-gray-200 rounded-none focus:ring-0 focus:border-gray-500 text-gray-800 px-0 transition-all text-center h-8"
                                                    className="bg-transparent border-0 border-b border-ash-light rounded-none focus:ring-0 focus:border-ash-dark text-text-main font-bold px-0 transition-all text-center h-8 placeholder:text-text-muted"
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
                                                    // className="bg-transparent border-0 border-b border-gray-200 rounded-none focus:ring-0 focus:border-gray-500 text-gray-800 px-0 transition-all text-center h-8"
                                                    className="bg-transparent border-0 border-b border-ash-light rounded-none focus:ring-0 focus:border-ash-dark text-text-main font-mono font-bold px-0 transition-all text-center h-8 placeholder:text-text-muted"
                                                />

                                                {/* Unit */}
                                                <select
                                                    value={editData[item._id]?.unit ?? item.unit ?? ""}
                                                    onChange={(e) => {
                                                        handleEditChange(item._id, "unit", e.target.value);
                                                        handleSaveEdit(editData[item._id] ?? item);
                                                    }}
                                                    // className="bg-transparent border-0 border-b border-gray-200 rounded-none focus:ring-0 focus:border-gray-500 text-gray-800 px-0 transition-all text-center h-8 outline-none cursor-pointer text-sm"
                                                    className="bg-transparent border-0 border-b border-ash-light rounded-none focus:ring-0 focus:border-ash-dark text-text-main font-bold px-0 transition-all text-center h-8 outline-none cursor-pointer text-sm"
                                                >
                                                    <option value="">Unit</option>
                                                    {UNIT_OPTIONS.map((u) => (
                                                        <option key={u} value={u}>{u}</option>
                                                    ))}
                                                </select>

                                                {/* Action */}
                                                {canDelete && (
                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            disabled={deletePending}
                                                            // className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 mx-auto transition-colors"
                                                            className="h-8 w-8 p-0 text-text-muted hover:text-action-danger border border-transparent mx-auto transition-colors shadow-sm"
                                                            title="Delete Item"
                                                        >
                                                            {deletePending ? <i className="fas fa-spinner fa-spin text-sm"></i> : <i className="fa-regular fa-trash-can text-sm"></i>}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* New Items Section */}
                                    {isAdding ? (
                                        // <div className="mt-4 border border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
                                        <div className="mt-4 border border-dashed border-ash-medium rounded-xl overflow-hidden bg-brand-surface">
                                            {newItems?.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    // className="min-w-[600px] grid grid-cols-4 gap-4 items-center px-4 py-3 border-b last:border-b-0 border-gray-100 hover:bg-gray-50/30 transition-colors"
                                                    className="min-w-[600px] grid grid-cols-4 gap-4 items-center px-4 py-3 border-b last:border-b-0 border-ash-light hover:bg-brand-ash/30 transition-colors"
                                                >
                                                    <Input
                                                        placeholder="Item name"
                                                        value={item.itemName}
                                                        onChange={(e) => handleNewItemChange(idx, "itemName", e.target.value)}
                                                        // className="bg-transparent border-0 border-b border-gray-200 !rounded-none focus:ring-0 focus:border-gray-500 text-gray-800 px-0 transition-all text-center h-8"
                                                        className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main font-bold px-0 transition-all text-center h-8 placeholder:text-text-muted"
                                                        autoFocus={idx === 0}
                                                    />

                                                    <Input
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        onChange={(e) => handleNewItemChange(idx, "quantity", e.target.value)}
                                                        // className="bg-transparent border-0 border-b border-gray-200 !rounded-none focus:ring-0 focus:border-gray-500 text-gray-800 px-0 transition-all text-center h-8"
                                                        className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main font-mono font-bold px-0 transition-all text-center h-8 placeholder:text-text-muted"
                                                    />

                                                    <select
                                                        value={item.unit}
                                                        onChange={(e) => handleNewItemChange(idx, "unit", e.target.value)}
                                                        // className="bg-transparent border-0 border-b border-gray-200 !rounded-none focus:ring-0 focus:border-gray-500 text-gray-800 px-0 transition-all text-center h-8 outline-none cursor-pointer text-sm"
                                                        className="bg-transparent border-0 border-b border-ash-light !rounded-none focus:ring-0 focus:border-ash-dark text-text-main font-bold px-0 transition-all text-center h-8 outline-none cursor-pointer text-sm"
                                                    >
                                                        {UNIT_OPTIONS.map((u) => (
                                                            <option key={u} value={u}>{u}</option>
                                                        ))}
                                                    </select>

                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => handleRemoveRow(idx)}
                                                            // className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 mx-auto transition-colors"
                                                            className="h-8 w-8 p-0 text-text-muted hover:text-action-danger hover:bg-red-50 mx-auto transition-colors border border-transparent hover:border-red-200 shadow-sm"
                                                            title="Remove Row"
                                                        >
                                                            <i className="fa-solid fa-xmark text-sm"></i>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-end p-4 bg-brand-ash/50 border-t border-ash-medium">
                                                {(canCreate || canEdit) && (
                                                    <Button
                                                        onClick={handleSaveAll}
                                                        disabled={newItems.every((item) =>
                                                            Object.entries(item).every(([k, v]) => k === "itemName" && !v ? false : true)
                                                        )}
                                                        variant="dark"
                                                        className="px-6 shadow-sm"
                                                        // className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors"
                                                    >
                                                        Save All Items
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full flex justify-end mt-4">
                                            {(canCreate || canEdit) && (
                                                <Button
                                                variant="white"
                                                    onClick={() => {
                                                        setIsAdding(true);
                                                        setNewItems([{ itemName: "", quantity: 1, unit: "unit" }]);
                                                    }}
                                                    // className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 !text-gray-700 px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all"
                                                    className="border-ash-medium text-text-main shadow-sm transition-all px-5"
                                                >
                                                    <i className="fa-solid fa-plus mr-2 text-gray-400"></i> Add Item
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* File Uploads Section */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"> */}
                <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium p-5 sm:p-6">
                   <div className="flex items-center space-x-3 mb-6 border-b border-ash-light pb-4">
                        <div className="bg-brand-ash border border-ash-light rounded-lg w-10 h-10 flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-cloud-arrow-up text-text-muted text-sm" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-main">File Uploads</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted mt-0.5">Upload requirements and documents</p>
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
    )
};

export default RoomPage;