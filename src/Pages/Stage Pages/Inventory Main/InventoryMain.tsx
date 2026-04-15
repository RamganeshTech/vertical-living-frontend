
import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useCreateInventorySubItem, useDeleteInventorySubItem, useGetInventoryDetails, useUpdateInventorySubItem } from "../../../apiList/Stage Api/inventoryApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import type { ProjectDetailsOutlet } from "../../../types/types";
import RecycleMaterialProject from "../Recycle Materials/RecycleMaterialProject";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import { ORDERMATERIAL_UNIT_OPTIONS } from "../Ordering Materials/OrderMaterialOverview";
import StageGuide from "../../../shared/StageGuide";

const InventoryMain: React.FC = () => {
    const { projectId, organizationId } = useParams<{ projectId: string }>() as { projectId: string, organizationId: string }
    const { data, isLoading, isError, error } = useGetInventoryDetails(projectId!);
    const createSubItem = useCreateInventorySubItem();
    const updateSubItem = useUpdateInventorySubItem();
    const deleteSubItem = useDeleteInventorySubItem();
    const { isMobile, openMobileSidebar, projectName } = useOutletContext<ProjectDetailsOutlet>();


    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.inventory?.delete;
    // const canList = role === "owner" || permission?.inventory?.list;
    const canCreate = role === "owner" || permission?.inventory?.create;
    const canEdit = role === "owner" || permission?.inventory?.edit;

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
        if (!canCreate || !canEdit) {
            toast({ description: "you dont have the permission to edit or create", variant: "destructive", title: "Error" })
            return
        }

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
    // if (isError) return <div>Error: {error.message}</div>;
    if (isError) {
        return <div className="p-8 text-center bg-brand-main min-h-screen">
            <div className="bg-brand-surface border border-action-danger text-action-danger p-6 rounded-xl inline-flex flex-col items-center shadow-sm">
                <i className="fas fa-triangle-exclamation text-3xl mb-3"></i>
                <p className="font-bold text-text-main mb-2">Error Occurred</p>
                <p className="text-sm text-text-muted">{error?.message}</p>
            </div>
        </div>
    }

    return (
        <>
            <div className="w-full max-h-full overflow-y-auto flex flex-col p-2 min-h-full bg-brand-main">
                {/* <div className="flex justify-between items-center"> */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-ash-light gap-4">
                    <div >
                        {/* <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-blue-600 flex items-center"> */}
                        <h1 className="text-xl sm:text-3xl font-bold text-text-main flex items-center gap-3">
                            {isMobile && (
                                <button
                                    onClick={openMobileSidebar}
                                    // className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                                    className="p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
                                    title="Open Menu"
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            )}
                            {/* <i className="fa-solid fa-boxes-stacked mr-2"></i>
                            Inventory Items {projectName ? `for ${projectName}` : ""} */}
                            <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm">
                                <i className="fa-solid fa-boxes-stacked text-text-muted text-lg"></i>
                            </div>
                            <span className="leading-tight">Inventory Items {projectName ? `for ${projectName}` : ""}</span>
                        </h1>
                        {/* <p className="text-gray-400">Manage and track project materials in one place</p> */}
                        <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-2">Manage and track project materials in one place</p>

                    </div>

                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="inventory"
                        />
                    </div>
                </div>

                {/* <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4"> */}
                <div className="bg-brand-surface rounded-xl border border-ash-medium shadow-sm mt-6 pt-4">
                    {/* <div className="flex items-center gap-2 mb-4">
                        <i className="fa-solid fa-list text-blue-600"></i>
                        <h4 className="font-semibold text-gray-800">Material Items</h4>
                        <span className="text-sm text-gray-500">(Click to edit, changes save by clicking Enter)</span>
                    </div> */}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5 border-b border-ash-light pb-4">
                        <div className="w-8 h-8 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-list-check text-text-muted text-sm"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main">Material Items</h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Click cells to edit • Press Enter to save</span>
                        </div>
                    </div>

                    {/* <div className="bg-white rounded-lg border border-gray-200 overflow-hidden"> */}
                    <div className="bg-brand-surface rounded-xl border border-ash-medium overflow-hidden shadow-sm">

                        {/* <div className="grid grid-cols-17 gap-0 bg-gray-100 border-b border-gray-200"> */}
                        <div className="grid grid-cols-17 bg-brand-ash border-b border-ash-medium text-[10px] font-bold text-text-muted uppercase tracking-wider">

                            {/* <div className="col-span-8 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
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
                            </div> */}

                            <div className="col-span-8 px-4 py-3 border-r border-ash-light">Material Name</div>
                            <div className="col-span-2 px-4 py-3 border-r border-ash-light text-center">Total Qty</div>
                            <div className="col-span-2 px-4 py-3 border-r border-ash-light text-center">Remaining</div>
                            <div className="col-span-3 px-4 py-3 border-r border-ash-light text-center">Unit</div>
                            <div className="col-span-1 px-4 py-3 text-center">Action</div>
                        </div>

                        <div className="divide-y divide-ash-light">
                            {items.map((item) => (
                                // <div key={item._id} className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">
                                <div key={item._id} className="grid grid-cols-12 items-center text-sm transition-colors hover:bg-brand-ash/50 group">

                                    {/* <div className="col-span-8 border-r border-gray-200"> */}
                                    <div className="col-span-8 border-r border-ash-light p-1">
                                        {editingCell?.subItemId === item._id && editingCell?.field === 'name' ? (
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                defaultValue={item.itemName}
                                                // className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-md outline-none text-text-main shadow-sm focus:ring-2 focus:ring-ash-medium font-medium"
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
                                                // className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                className="px-3 py-2 cursor-pointer hover:bg-brand-surface border border-transparent hover:border-ash-medium rounded-md transition-colors text-text-main font-medium flex items-center h-full"
                                                onClick={() => {
                                                    if (canEdit || canCreate) {
                                                        setEditingCell({ subItemId: item._id, field: 'name' })
                                                    }
                                                }
                                                }
                                            >
                                                {item.itemName}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-2 border-r border-ash-light">
                                        {editingCell?.subItemId === item._id && editingCell?.field === 'totalQuantity' ? (
                                            <input
                                                ref={inputRef}
                                                type="number"
                                                defaultValue={item.totalQuantity}
                                                min="0"
                                                // className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                className="w-full px-2 py-2 text-center bg-brand-surface border border-ash-medium rounded-md outline-none text-mono font-bold text-text-main shadow-sm focus:ring-2 focus:ring-ash-medium"
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
                                                // className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                className="px-2 py-2 text-center cursor-pointer hover:bg-brand-surface border border-transparent hover:border-ash-medium rounded-md transition-colors text-text-main font-mono font-bold flex items-center justify-center h-full"
                                                onClick={() => {
                                                    if (canEdit || canCreate) {

                                                        setEditingCell({ subItemId: item._id, field: 'totalQuantity' })
                                                    }
                                                }
                                                }
                                            >
                                                {item.totalQuantity}
                                            </div>
                                        )}
                                    </div>
                                    {/* <div className="col-span-2 border-r border-gray-200"> */}
                                    <div className="col-span-2 border-r border-ash-light p-1">

                                        <div
                                            // className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                            className="px-2 py-2 text-center cursor-pointer hover:bg-brand-surface border border-transparent hover:border-ash-medium rounded-md transition-colors text-text-main font-mono font-bold flex items-center justify-center h-full"
                                            onClick={() => setEditingCell({ subItemId: item._id, field: 'totalQuantity' })}
                                        >
                                            {item.remainingQuantity}
                                        </div>

                                    </div>
                                    {/* <div className="col-span-3 border-r border-gray-200"> */}
                                    <div className="col-span-3 border-r border-ash-light p-1">
                                        {editingCell?.subItemId === item._id && editingCell?.field === 'unit' ? (
                                            <select
                                                defaultValue={item.unit}
                                                onChange={(e) => {
                                                    handleSaveEdit(item._id, 'unit', e.target.value);
                                                    setEditingCell(null);
                                                }}
                                                // className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                className="w-full relative z-[50] px-2 py-1.5 border border-ash-medium rounded-md outline-none bg-brand-surface text-xs font-bold text-text-main shadow-sm cursor-pointer focus:ring-2 focus:ring-ash-medium"
                                            >
                                                <option value="" disabled>Selected unit</option>
                                                {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                    <option key={unitOption} value={unitOption}>
                                                        {unitOption}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div
                                                // className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                className="px-2 py-2 text-center cursor-pointer hover:bg-brand-surface border border-transparent hover:border-ash-medium rounded-md transition-colors text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center justify-center h-full"
                                                onClick={() => {
                                                    if (canEdit || canCreate) {

                                                        setEditingCell({ subItemId: item._id, field: 'unit' })
                                                    }
                                                }
                                                }
                                            >
                                                {item.unit}
                                            </div>
                                        )}
                                    </div>
                                    {/* <div className="col-span-1 flex items-center justify-center"> */}
                                    <div className="col-span-1 flex items-center justify-center p-1 relative">
                                        {canDelete && <Button
                                            variant="ghost"
                                            isLoading={deleteSubItem.isPending}
                                            onClick={() => handleDelete(item._id)}
                                            // className="p-2 bg-red-600 text-white hover:bg-red-50 rounded transition-colors"
                                            className=" p-0 text-text-muted hover:text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-all rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                                            title="Delete item"
                                        >
                                            <i className="fa fa-trash text-sm"></i>
                                        </Button>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-17 gap-0 bg-brand-surface border-t-2 border-ash-medium hover:bg-brand-ash/30 transition-colors items-center text-sm">

                            <div className="col-span-8 border-r border-ash-light">
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
                                    // className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                    className="w-full px-3 py-2 bg-transparent border border-transparent rounded-md outline-none focus:bg-brand-ash focus:border-ash-medium font-medium text-text-main placeholder:text-text-muted transition-all"
                                />
                            </div>
                            <div className="col-span-2 border-r border-ash-light">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    min="0"
                                    value={newRowData.totalQuantity}
                                    onChange={(e) => setNewRowData({ ...newRowData, totalQuantity: Number(e.target.value) || 0 })}
                                    // className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                    className="w-full px-2 py-2 bg-transparent border border-transparent rounded-md text-center outline-none focus:bg-brand-ash focus:border-ash-medium font-mono font-bold text-text-main placeholder:text-text-muted transition-all"
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
                            <div className="col-span-3 border-r border-ash-light p-1 flex items-center justify-center">
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
                                    // className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                    className="w-full relative z-[50] px-2 py-1.5 border border-ash-medium rounded-md focus:outline-none focus:border-text-muted bg-brand-surface text-xs font-bold text-text-main shadow-sm cursor-pointer"
                                >
                                    <option value="" disabled>Selected unit</option>
                                    {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                        <option key={unitOption} value={unitOption}>
                                            {unitOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {items.length === 0 && (
                            // <div className="text-center py-8 text-gray-500">
                            //     <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                            //     <p className="text-sm">No sub-items yet. Start typing in the row above to add items.</p>
                            // </div>
                            <div className="text-center py-10 bg-brand-surface">
                            <div className="w-12 h-12 bg-brand-ash border border-ash-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <i className="fa-solid fa-inbox text-text-muted text-lg"></i>
                            </div>
                            <p className="text-sm font-bold text-text-main mb-1">No sub-items yet</p>
                            <p className="text-xs text-text-muted">Start typing in the row above to add items.</p>
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