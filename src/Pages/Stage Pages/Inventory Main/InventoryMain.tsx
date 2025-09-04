
import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useCreateInventorySubItem, useDeleteInventorySubItem, useGetInventoryDetails, useUpdateInventorySubItem } from "../../../apiList/Stage Api/inventoryApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import type { ProjectDetailsOutlet } from "../../../types/types";
import RecycleMaterialProject from "../Recycle Materials/RecycleMaterialProject";

const units = [
    "nos",
    "pieces",
    "litre",
    "kg",
    "mm",
    "cm",
    "meter",
    "feet",
    "inch",
    "sqft",
    "sqmm",
    "packet",
    "roll",
    "sheet"
];

const InventoryMain: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>() as { projectId: string }
    const { data, isLoading, isError, error } = useGetInventoryDetails(projectId!);
    const createSubItem = useCreateInventorySubItem();
    const updateSubItem = useUpdateInventorySubItem();
    const deleteSubItem = useDeleteInventorySubItem();
    const { isMobile, openMobileSidebar, projectName } = useOutletContext<ProjectDetailsOutlet>();


    // console.log("projectName", projectName)
    // const [items, setItems] = useState<any[]>([]);
    const [editingCell, setEditingCell] = useState<{
        subItemId: string;
        field: 'name' | 'totalQuantity' | 'unit';
    } | null>(null);
    const [newRowData, setNewRowData] = useState<{
        name: string;
        totalQuantity: number;
        unit: string;
    }>({ name: '', totalQuantity: 1, unit: '' });

    const inputRef = useRef<HTMLInputElement>(null);

    // useEffect(() => {
    //     if (data) {
    //         setItems(data.subItems || []);
    //     }
    // }, [data]);


    const items: any[] = data?.subItems || []

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCell]);

    const handleSaveEdit = async (subItemId: string, field: string, value: any) => {
        try {

            await updateSubItem.mutateAsync({
                projectId: projectId!,
                subItemId,
                payload: {
                    itemName: field === 'name' ? value : items.find((item) => item._id === subItemId)?.itemName,
                    totalQuantity: field === 'totalQuantity' ? (Number(value) ? Number(value) : 1) : items.find(item => item._id === subItemId)?.totalQuantity,
                    unit: field === 'unit' ? value : items.find((item) => item._id === subItemId)?.unit,
                    note: ""
                }
            });
            toast({ title: "Success", description: "Item updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update item",
                variant: "destructive"
            });
        }
    };

    const handleNewRowSave = async (newData: any) => {
        if (!newData.name.trim() || !newData.unit) {
            return toast({
                title: "Error",
                description: "Material Name and Unit are mandatory",
                variant: "destructive"
            });
        }



        try {
            const { name, ...rest } = newData
            await createSubItem.mutateAsync({ projectId, payload: { ...rest, itemName: name, note: "" } });
            setNewRowData({ name: '', totalQuantity: 1, unit: '' });
            toast({ title: "Success", description: "Item created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create item",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (subItemId: string) => {
        try {
            await deleteSubItem.mutateAsync({ projectId, subItemId });
            toast({ title: "Success", description: "Item deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete item",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <div><MaterialOverviewLoading /></div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="w-full max-h-full overflow-y-auto flex flex-col p-2 min-h-full">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-blue-600 flex items-center">
                        {isMobile && (
                            <button
                                onClick={openMobileSidebar}
                                className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                                title="Open Menu"
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        )}
                        <i className="fa-solid fa-boxes-stacked mr-2"></i>
                        Inventory Items {projectName ? `for ${projectName}` : ""}</h1>
                    <p className="text-gray-400">Manage and track project materials in one place</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <i className="fa-solid fa-list text-blue-600"></i>
                        <h4 className="font-semibold text-gray-800">Material Items</h4>
                        <span className="text-sm text-gray-500">(Click to edit, changes save by clicking Enter)</span>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-17 gap-0 bg-gray-100 border-b border-gray-200">

                            <div className="col-span-8 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                Material Name
                            </div>
                            <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                Total Quantity
                            </div>
                            <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                Remaining Quantity
                            </div>
                            <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                Unit
                            </div>
                            <div className="col-span-1 px-4 py-3 text-sm font-medium text-gray-700">
                                Action
                            </div>
                        </div>

                        {items.map((item) => (
                            <div key={item._id} className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">

                                <div className="col-span-8 border-r border-gray-200">
                                    {editingCell?.subItemId === item._id && editingCell?.field === 'name' ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            defaultValue={item.itemName}
                                            className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                            onBlur={(e) => {
                                                if (newRowData?.name?.trim() && newRowData?.unit) {
                                                    handleSaveEdit(item._id, 'name', e.target.value);
                                                }
                                                setEditingCell(null);
                                            }}
                                            onKeyDown={(e: any) => {
                                                if (e.key === 'Enter') {
                                                    handleSaveEdit(item._id, 'name', e.target.value);
                                                    setEditingCell(null);
                                                }
                                                if (e.key === 'Escape') {
                                                    setEditingCell(null);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setEditingCell({ subItemId: item._id, field: 'name' })}
                                        >
                                            {item.itemName}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2 border-r border-gray-200">
                                    {editingCell?.subItemId === item._id && editingCell?.field === 'totalQuantity' ? (
                                        <input
                                            ref={inputRef}
                                            type="number"
                                            defaultValue={item.totalQuantity}
                                            min="0"
                                            className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                            onBlur={(e) => {
                                                handleSaveEdit(item._id, 'totalQuantity', e.target.value);
                                                setEditingCell(null);
                                            }}
                                            onKeyDown={(e: any) => {
                                                if (e.key === 'Enter') {
                                                    handleSaveEdit(item._id, 'totalQuantity', e.target.value);
                                                    setEditingCell(null);
                                                }
                                                if (e.key === 'Escape') {
                                                    setEditingCell(null);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setEditingCell({ subItemId: item._id, field: 'totalQuantity' })}
                                        >
                                            {item.totalQuantity}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2 border-r border-gray-200">

                                    <div
                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                        onClick={() => setEditingCell({ subItemId: item._id, field: 'totalQuantity' })}
                                    >
                                        {item.remainingQuantity}
                                    </div>

                                </div>
                                <div className="col-span-3 border-r border-gray-200">
                                    {editingCell?.subItemId === item._id && editingCell?.field === 'unit' ? (
                                        <select
                                            defaultValue={item.unit}
                                            onChange={(e) => {
                                                handleSaveEdit(item._id, 'unit', e.target.value);
                                                setEditingCell(null);
                                            }}
                                            className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                        >
                                            <option value="" disabled>Selected unit</option>
                                            {units.map((unitOption) => (
                                                <option key={unitOption} value={unitOption}>
                                                    {unitOption}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div
                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => setEditingCell({ subItemId: item._id, field: 'unit' })}
                                        >
                                            {item.unit}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-1 flex items-center justify-center">
                                    <Button
                                        variant="danger"
                                        isLoading={deleteSubItem.isPending}
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 bg-red-600 text-white hover:bg-red-50 rounded transition-colors"
                                        title="Delete item"
                                    >
                                        <i className="fa fa-trash text-sm"></i>
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="grid grid-cols-17 gap-0 bg-green-50 border-b border-gray-100">

                            <div className="col-span-8 border-r border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Enter material name..."
                                    value={newRowData.name}
                                    onChange={(e) => setNewRowData({ ...newRowData, name: e.target.value })}
                                    onBlur={() => {
                                        if (newRowData.name.trim() && newRowData.unit) {
                                            handleNewRowSave(newRowData);
                                        }
                                        // handleNewRowSave(newRowData)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleNewRowSave(newRowData);
                                        }
                                    }}
                                    className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                />
                            </div>
                            <div className="col-span-2 border-r border-gray-200">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    min="0"
                                    value={newRowData.totalQuantity}
                                    onChange={(e) => setNewRowData({ ...newRowData, totalQuantity: Number(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                />
                            </div>
                            <div className="col-span-2 border-r border-gray-200">
                                <input
                                    type="number"
                                    placeholder="Remaining Quanitity"
                                    disabled
                                    min="0"
                                    value={newRowData.totalQuantity}
                                    // onChange={(e) => setNewRowData({ ...newRowData, totalQuantity: Number(e.target.value) || 1 })}
                                    className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                />
                            </div>
                            <div className="col-span-3 border-r border-gray-200">
                                <select
                                    value={newRowData.unit}
                                    onChange={async (e) => {
                                        setNewRowData({ ...newRowData, unit: e.target.value })

                                        const updatedRow: any = {
                                            ...newRowData,
                                            unit: e.target.value
                                        };

                                        await handleNewRowSave(updatedRow);
                                    }}
                                    // onBlur={() => handleNewRowSave(newRowData)}
                                    className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                >
                                    <option value="" disabled>Selected unit</option>
                                    {units.map((unitOption) => (
                                        <option key={unitOption} value={unitOption}>
                                            {unitOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {items.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                                <p className="text-sm">No sub-items yet. Start typing in the row above to add items.</p>
                            </div>
                        )}
                    </div>
                </div>

                <section className="mt-4">

                    <RecycleMaterialProject />
                </section>
            </div>

        </>
    );
};

export default InventoryMain;