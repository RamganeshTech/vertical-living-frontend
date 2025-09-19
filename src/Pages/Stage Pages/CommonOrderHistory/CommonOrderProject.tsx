// File: /pages/CommonOrderProject.tsx

import { useEffect, useRef, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import {
    Card,
    CardContent,
} from "../../../components/ui/Card"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"

import {
    useAddCommonOrderMaterialSubItem,
    useCommonOrderMaterialGenerateLink,
    // useCompleteCommonOrderMaterialHistoryStage,
    // useCreateCommonUnit,
    useDeleteCommonOrderMaterialPdf,
    useDeleteCommonOrderMaterialSubItem,
    useDeleteCommonUnit,
    useGetSingleCommonOrder,
    useUpdateCommonOrderDeliveryLocation,
    useUpdateCommonOrderMaterialSubItem,
    useUpdateCommonOrderPdfStatus,
    useUpdateCommonOrderShopDetails
} from "../../../apiList/Stage Api/Common OrderMaterialHisotry APi/commonOrderHistoryMaterialApi"
import { toast } from "../../../utils/toast"
import type { OrganizationOutletTypeProps } from "../../Organization/OrganizationChildren"
import { NO_IMAGE } from "../../../constants/constants"
import CreateUnitModel, { type UnitPayload } from "./CreateUnitModel"
import { downloadImage } from "../../../utils/downloadFile"
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"



//  Added predefined unit options for the select dropdown
const UNIT_OPTIONS = [
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



interface SubItem {
    refId: string;
    _id: string;
    subItemName: string;
    quantity: number;
    unit: string;
}

const CommonOrderProject = () => {
    const { id } = useParams<{ id: string }>()
    const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()

    const [showCreateUnitForm, setShowCreateUnitForm] = useState(false)
    // const [unitName, setUnitName] = useState("")
    // const [quantity, setQuantity] = useState(1)
    // const [singleUnitCost, setSingleUnitCost] = useState(0)
    const navigate = useNavigate()
    const [editingUnitId, setEditingUnitId] = useState("")
    const [isUnitEditing, setIsUnitEditing] = useState(false)
    const [editingUnit, setEditingUnit] = useState<UnitPayload & { _id: string } | null>(null)


    const [editDelivery, setEditDelivery] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState<any>({});
    const [editShop, setEditShop] = useState(false);
    const [shopForm, setShopForm] = useState<any>({});



    const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{
        subItemId: string;
        field: 'name' | 'quantity' | 'unit';
    } | null>(null);
    // const [tempValues, setTempValues] = useState<{ [key: string]: any }>({});
    const [newRowData, setNewRowData] = useState<{
        [unitId: string]: {
            name: string;
            quantity: number;
            unit: string;
        }
    }>({});

    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading, error, refetch, isError } = useGetSingleCommonOrder(id!)
    // const { mutateAsync: createUnit, isPending: creatingPending } = useCreateCommonUnit()
    const { mutateAsync: deleteUnit, isPending: deletePending } = useDeleteCommonUnit()
    const { mutateAsync: updateDelivery, isPending: deliveryPending } = useUpdateCommonOrderDeliveryLocation()
    const { mutateAsync: updateShop, isPending: shopPending } = useUpdateCommonOrderShopDetails()
    const { mutateAsync: generateLink, isPending: generatePending } = useCommonOrderMaterialGenerateLink()
    const { mutateAsync: deletePdf, isPending: deletepdfPending } = useDeleteCommonOrderMaterialPdf()
    const { mutateAsync: updateCommonOrderPdfStatus } = useUpdateCommonOrderPdfStatus()

    // const { mutateAsync: completionStatus, isPending: completePending } = useCompleteCommonOrderMaterialHistoryStage()


    const { mutateAsync: addSubItem } = useAddCommonOrderMaterialSubItem();
    const { mutateAsync: deleteSubItem, isPending: deleteItemLoading } = useDeleteCommonOrderMaterialSubItem();
    const { mutateAsync: updateSubItem } = useUpdateCommonOrderMaterialSubItem();


    const handleUnitDelete = async (unitId: string,) => {
        try {
            await deleteUnit({ id: id!, unitId });
            toast({ title: "Success", description: "Item deleted successfully" });
            // refetch()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete item",
                variant: "destructive"
            });
        }
    }


    const handleSaveEdit = async (unitId: string, subItemId: string, field: string, value: any) => {
        try {
            const unit = selectedUnits.find((u: any) => u._id === unitId);
            const subItem = unit?.subItems?.find((s: any) => s._id === subItemId);
            // console.log("subitem", subItem)
            if (!subItem) return;


            const updatedData = {
                id: id!,
                unitId,
                subItemId,
                subItemName: field === 'name' ? value : subItem.subItemName,
                quantity: field === 'quantity' ? (Number(value) ? Number(value) : 1) : subItem.quantity,
                unit: field === 'unit' ? value : subItem.unit,
            };


            console.log("updateddata", updatedData)

            await updateSubItem(updatedData);
            toast({ title: "Success", description: "Item updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update item",
                variant: "destructive"
            });
        }
    };

    // Handle new row creation
    const handleNewRowSave = async (unitId: string, newData: any) => {
        const rowData: any = newData;

        if (!rowData && !rowData?.name.trim()) {
            return toast({
                title: "Error",
                description: "Material Name is mandatory",
                variant: "destructive"
            });
        }

        if (!rowData?.unit?.trim()) {
            return toast({
                title: "Error",
                description: "Unit is mandatory",
                variant: "destructive"
            })
        }

        // if (!rowData || !rowData.name.trim() || !rowData.unit) return;

        console.log("row data", rowData)

        try {
            await addSubItem({
                id: id!,
                unitId,
                subItemName: rowData.name,
                quantity: rowData.quantity ?? 1,
                unit: rowData.unit,
            });

            // Clear the new row data
            setNewRowData(prev => ({
                ...prev,
                [unitId]: { name: '', quantity: 1, unit: '' }
            }));

            toast({ title: "Success", description: "Item created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create item",
                variant: "destructive"
            });
        }
    };

    // Handle delete
    const handleDelete = async (unitId: string, subItemId: string) => {
        try {
            await deleteSubItem({ id: id!, unitId, subItemId });
            toast({ title: "Success", description: "Item deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete item",
                variant: "destructive"
            });
        }
    };



    const handleUpdateDelivery = async () => {
        try {

            if (deliveryForm?.phoneNumber) {
                if (!/^\d{10}$/.test(deliveryForm?.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateDelivery({ id: id!, updates: deliveryForm });
            setEditDelivery(false);
            toast({ title: "Success", description: "Delivery Details Updated" });
            refetch()

        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };


    const handleUpdateShop = async () => {
        try {

            if (shopForm.phoneNumber) {
                if (!/^\d{10}$/.test(shopForm.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateShop({ id: id!, updates: shopForm });
            toast({ title: "Success", description: "Shop Details Updated" });
            setEditShop(false);
            refetch()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };


    // const handleCompletionStatus = async () => {
    //     try {
    //         await completionStatus({ id: id! });
    //         toast({ description: 'Completion status updated successfully', title: "Success" });

    //     } catch (error: any) {
    //         toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
    //     }
    // };

    const handleGenerate = async () => {
        try {
            await generateLink({ id: id! });

            toast({ title: "Success", description: "Pdf Generated successfully" });
            refetch()

        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };



    const handleDeletePdf = async (pdfId: string) => {
        try {

            await deletePdf({ id: id!, pdfId });
            toast({ title: "Success", description: "PDF deleted" });
            setEditShop(false);
            refetch()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete" });
        }
    };


    const handleUpdatePdfStatus = async (pdfId: string, status: string) => {
        try {
            await updateCommonOrderPdfStatus({ id: id!, pdfId, status });

            toast({ title: "Success", description: "Pdf status updated successfully" });
            refetch()

        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to update status", variant: "destructive" });
        }
    };



    const selectedUnits = data?.selectedUnits || [];
    const totalCost = data?.totalCost || 0;
    const hasUnits = selectedUnits.length > 0;

    // Focus input when editing starts
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCell]);


    if (isLoading) return <MaterialOverviewLoading />


    return (
        <div className="max-w-full max-h-full overflow-y-auto mx-auto p-2 space-y-6">


            <div className="flex-shrink-0 flex flex-col sm:flex-row  items-start sm:items-center mb-4 gap-4">
                <div onClick={() => navigate(-1)} className=" cursor-pointer px-2 py-2 rounded-2xl hover:bg-gray-100">
                    <i className="fas fa-arrow-left text-[14px] "></i>
                    <p className="sm:inline hidden ml-2">Back to projects</p>
                </div>
                <h2 className="text-2xl mx-auto sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">



                    {isMobile && (
                        <button
                            onClick={openMobileSidebar}
                            className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                            title="Open Menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <i className="fa-solid fa-cart-shopping mr-2"></i>
                    <span className="hidden sm:inline">Common Ordering Material </span>
                    <span className="sm:hidden">Common Material Ordering</span>
                </h2>


                {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        isLoading={completePending}
                        onClick={handleCompletionStatus}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark as Complete
                    </Button>
                </div> */}
            </div>


            {(isError) && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                        <div className="text-red-600 font-semibold mb-2">
                            ⚠️ Error Occurred
                        </div>
                        <p className="text-red-500 text-sm mb-4">
                            {(error as any)?.response?.data?.message || "Failed to load ordering material"}
                        </p>
                        <Button
                            isLoading={isLoading}
                            onClick={() => refetch()}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}



            {!isError && showCreateUnitForm && (
                <CreateUnitModel
                    mode="create"
                    id={id!}
                    onSuccess={() => {
                        setShowCreateUnitForm(false)
                        // refetch()
                    }}
                    onCancel={() => setShowCreateUnitForm(false)}
                />
            )}



            {!isError && isUnitEditing && (
                <CreateUnitModel
                    mode="edit"
                    id={id!}
                    unitId={editingUnitId}
                    initialData={editingUnit}
                    onSuccess={() => {
                        setEditingUnitId("")
                        setIsUnitEditing(false)
                        // refetch()
                    }}
                    onCancel={() => {
                        setEditingUnit(null)
                        setEditingUnitId("")
                        setIsUnitEditing(false)
                    }}
                />
            )}


            {!isError && (
                <section className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">


                    {/* Shop Details */}
                    <div className="border-l-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                        <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                            <i className="fa-solid fa-store"></i>
                            Shop Details
                        </h2>
                        {editShop ? (
                            <div className="space-y-3">
                                <Input
                                    placeholder="Shop Name"
                                    value={shopForm?.shopName || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Contact Person"
                                    value={shopForm?.contactPerson || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Phone Number"
                                    value={shopForm?.phoneNumber || ""}
                                    type="tel"
                                    maxLength={10}
                                    onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Address"
                                    value={shopForm?.address || ""}
                                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                    <Button onClick={handleUpdateShop}
                                        isLoading={shopPending}
                                        className="w-full sm:w-auto">
                                        <i className="fa-solid fa-save mr-2"></i>Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditShop(false)}
                                        className="w-full sm:w-auto"
                                    >
                                        <i className="fa-solid fa-times mr-2"></i>Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 text-sm sm:text-base">
                                <p><strong>Shop Name:</strong> {data?.shopDetails?.shopName || "-"}</p>
                                <p><strong>Contact Person:</strong> {data?.shopDetails?.contactPerson || "-"}</p>
                                <p><strong>Phone:</strong> {data?.shopDetails?.phoneNumber || "-"}</p>
                                <p><strong>Address:</strong> {data?.shopDetails?.address || "-"}</p>

                                <button
                                    onClick={() => { setShopForm(data?.shopDetails); setEditShop(true); }}
                                    className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                >
                                    <i className="fa-solid fa-edit mr-1"></i>Edit
                                </button>

                            </div>
                        )}
                    </div>

                    <div className="border-l-4 mt-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                        <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                            <i className="fa-solid fa-truck"></i>
                            Delivery Location
                        </h2>
                        {editDelivery ? (
                            <div className="space-y-3">
                                <Input
                                    placeholder="Site Name"
                                    value={deliveryForm?.siteName || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Site Supervisor"
                                    value={deliveryForm?.siteSupervisor || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Phone Number"
                                    type="tel"
                                    maxLength={10}
                                    value={deliveryForm?.phoneNumber || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Address"
                                    value={deliveryForm?.address || ""}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                    <Button onClick={handleUpdateDelivery} isLoading={deliveryPending} className="w-full sm:w-auto">
                                        <i className="fa-solid fa-save mr-2"></i>Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditDelivery(false)}
                                        className="w-full sm:w-auto"
                                    >
                                        <i className="fa-solid fa-times mr-2"></i>Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 text-sm sm:text-base">
                                <p><strong>Site Name:</strong> {data?.deliveryLocationDetails?.siteName || "-"}</p>
                                <p><strong>Supervisor:</strong> {data?.deliveryLocationDetails?.siteSupervisor || "-"}</p>
                                <p><strong>Phone:</strong> {data?.deliveryLocationDetails?.phoneNumber || "-"}</p>
                                <p><strong>Address:</strong> {data?.deliveryLocationDetails?.address || "-"}</p>
                                <button
                                    onClick={() => { setDeliveryForm(data?.deliveryLocationDetails); setEditDelivery(true); }}
                                    className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                >
                                    <i className="fa-solid fa-edit mr-1"></i>Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Modern header with subtle accent */}
                    <div className="p-6 border-b mt-4 border-gray-100 relative">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-600 "></div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                                {/* <p className="text-sm text-gray-500 mt-1">
                                            {hasUnits ? `${selectedUnits.length} items purchased` : 'No orders yet'}
                                        </p> */}
                            </div>

                            <div className="flex gap-3">

                                {!showCreateUnitForm && (
                                    <Button onClick={() => setShowCreateUnitForm(true)} variant="primary">
                                        + Create New Unit
                                    </Button>
                                )}

                                {hasUnits && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">Total:</span>
                                        <span className="text-xl font-bold text-blue-600">₹{totalCost.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-2 overflow-y-auto custom-scrollbar ">
                        {hasUnits ? (
                            <div className="grid gap-5">
                                {selectedUnits.map((unit: any, idx: number) => (
                                    <div
                                        key={unit._id || idx}
                                        className="group relative p-5 bg-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
                                    >
                                        <div className="flex flex-col md:flex-row gap-5">
                                            {/* Product Image */}
                                            <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                                                <img
                                                    src={unit?.image || NO_IMAGE}
                                                    alt={unit.customId || "Product image"}
                                                    className="w-full h-full object-contain p-3"
                                                />
                                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                    ×{unit.quantity}
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
                                                            {unit.unitName}
                                                        </h3>
                                                        <div className="flex gap-2 items-center">
                                                            <Button size="sm" variant="ghost" onClick={() => {
                                                                setEditingUnitId(unit._id)
                                                                setEditingUnit(unit)
                                                                setIsUnitEditing(true)
                                                            }
                                                            }
                                                            >
                                                                Edit
                                                            </Button>

                                                            <Button size="sm" variant="danger"
                                                                isLoading={deletePending}
                                                                onClick={() => handleUnitDelete(unit._id)
                                                                }
                                                                className="text-white bg-red-600"
                                                            >
                                                                delete
                                                            </Button>


                                                            <span className="flex cursor-pointer gap-1 items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"> Total Sub Items : <span className="">{unit?.subItems?.length || 0}</span></span>
                                                            <button
                                                                onClick={() =>
                                                                    setExpandedUnitId(
                                                                        expandedUnitId === unit._id ? null : unit._id
                                                                    )
                                                                }
                                                                className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                            >
                                                                <span className="hidden sm:inline">
                                                                    {expandedUnitId === unit._id ? 'Hide' : 'Show'} Sub Items
                                                                </span>
                                                                <i
                                                                    className={`fa ${expandedUnitId === unit._id
                                                                        ? "fa-chevron-up"
                                                                        : "fa-chevron-down"
                                                                        } transition-transform`}
                                                                ></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                                            {unit.category || "Generic"}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                                                            <p className="font-medium">₹{unit.singleUnitCost.toFixed(2)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Quantity</p>
                                                            <p className="font-medium">{unit.quantity}</p>
                                                        </div>


                                                        {unit?.dimention && <div>
                                                            <p className="text-sm text-gray-500 mb-1">Dimentions</p>
                                                            <p className="font-medium">Height: {unit?.dimention?.height || 0}mm</p>
                                                            <p className="font-medium">depth: {unit?.dimention?.depth || 0}mm</p>
                                                            <p className="font-medium">width: {unit?.dimention?.width || 0}mm</p>
                                                        </div>}

                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-100">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm text-gray-500">Item Total</p>
                                                        <p className="text-lg font-bold text-blue-600">
                                                            ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {expandedUnitId === unit._id && (
                                            <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <i className="fa-solid fa-list text-blue-600"></i>
                                                    <h4 className="font-semibold text-gray-800">Sub Items</h4>
                                                    <span className="text-sm text-gray-500">(Click to edit, changes save by clicking Enter)</span>
                                                </div>

                                                {/* Spreadsheet Header */}
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <div className="grid grid-cols-17 gap-0 bg-gray-100 border-b border-gray-200">
                                                        <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                            Ref ID
                                                        </div>
                                                        <div className="col-span-8 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                            Material Name
                                                        </div>
                                                        <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                            Quantity
                                                        </div>
                                                        <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                            Unit
                                                        </div>
                                                        <div className="col-span-1 px-4 py-3 text-sm font-medium text-gray-700">
                                                            Action
                                                        </div>
                                                    </div>

                                                    {/* Existing Sub Items */}
                                                    {unit.subItems && unit.subItems.length > 0 && unit.subItems.map((sub: SubItem) => (
                                                        <div key={sub._id} className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">
                                                            {/* Item Name Cell */}
                                                            <div className="col-span-3 border-r border-gray-200">

                                                                <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                                    {sub?.refId || "N/A"}
                                                                </div>
                                                            </div>

                                                            <div className="col-span-8 border-r border-gray-200">
                                                                {editingCell?.subItemId === sub._id && editingCell?.field === 'name' ? (
                                                                    <input
                                                                        ref={inputRef}
                                                                        type="text"
                                                                        defaultValue={sub.subItemName}
                                                                        className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                                        onBlur={(e) => {
                                                                            handleSaveEdit(unit._id, sub._id, 'name', e.target.value);
                                                                            setEditingCell(null);
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                const value = (e.target as HTMLInputElement).value;
                                                                                handleSaveEdit(unit._id, sub._id, 'name', value);
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
                                                                        onClick={() => setEditingCell({ subItemId: sub._id, field: 'name' })}
                                                                    >
                                                                        {sub.subItemName}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Quantity Cell */}
                                                            <div className="col-span-2 border-r border-gray-200">
                                                                {editingCell?.subItemId === sub._id && editingCell?.field === 'quantity' ? (
                                                                    <input
                                                                        ref={inputRef}
                                                                        type="number"
                                                                        defaultValue={sub.quantity}
                                                                        min="0"
                                                                        className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                                        onBlur={(e) => {
                                                                            handleSaveEdit(unit._id, sub._id, 'quantity', e.target.value);
                                                                            setEditingCell(null);
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                handleSaveEdit(unit._id, sub._id, 'quantity', e.currentTarget.value);
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
                                                                        onClick={() => setEditingCell({ subItemId: sub._id, field: 'quantity' })}
                                                                    >
                                                                        {sub.quantity}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Unit Cell */}
                                                            <div className="col-span-3 border-r border-gray-200">
                                                                {editingCell?.subItemId === sub._id && editingCell?.field === 'unit' ? (
                                                                    <div className="p-2 relative z-50">
                                                                        <select
                                                                            defaultValue={sub.unit}
                                                                            onChange={(e) => {
                                                                                handleSaveEdit(unit._id, sub._id, 'unit', e.target.value);
                                                                                setEditingCell(null);
                                                                            }}
                                                                            className="w-full relative z-[50] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                        >
                                                                            <option value="" disabled>Selected unit</option>
                                                                            {UNIT_OPTIONS.map((unitOption) => (
                                                                                <option key={unitOption} value={unitOption}>
                                                                                    {unitOption}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                                        onClick={() => setEditingCell({ subItemId: sub._id, field: 'unit' })}
                                                                    >
                                                                        {sub.unit}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Delete Action */}
                                                            <div className="col-span-1 flex items-center justify-center">
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => handleDelete(unit._id, sub._id)}
                                                                    disabled={deleteItemLoading}
                                                                    isLoading={deleteItemLoading}
                                                                    className="p-2 bg-red-600 text-white  hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                                                    title="Delete item"
                                                                >
                                                                    <i className="fa fa-trash text-sm"></i>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* New Row for Adding Items */}
                                                    <div className="grid grid-cols-17 gap-0 bg-green-50 border-b border-gray-100">
                                                        {/* New Item Name */}


                                                        <div className="col-span-3 border-r border-gray-200">

                                                            <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                                Ref Id
                                                            </div>
                                                        </div>


                                                        <div className="col-span-8 border-r border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter matterial name..."
                                                                value={newRowData[unit._id]?.name || ''}
                                                                onChange={(e) => {
                                                                    console.log("e.target name", newRowData)
                                                                    setNewRowData(prev => ({
                                                                        ...prev,
                                                                        [unit._id]: {
                                                                            ...prev[unit._id],
                                                                            name: e.target.value
                                                                        }
                                                                    }));
                                                                }}
                                                                onBlur={() => {
                                                                    if (newRowData[unit._id]?.name?.trim() &&
                                                                        newRowData[unit._id]?.unit) {
                                                                        handleNewRowSave(unit._id, newRowData);
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleNewRowSave(unit._id, newRowData);
                                                                    }
                                                                }}
                                                                className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                                            />
                                                        </div>

                                                        {/* New Quantity */}
                                                        <div className="col-span-2 border-r border-gray-200">
                                                            <input
                                                                type="number"
                                                                placeholder="Qty"
                                                                min="0"
                                                                value={newRowData[unit._id]?.quantity || 1}
                                                                onChange={(e) => {
                                                                    console.log("e.target.value", newRowData)
                                                                    setNewRowData(prev => ({
                                                                        ...prev,
                                                                        [unit._id]: {
                                                                            ...prev[unit._id],
                                                                            quantity: Number(e.target.value) || 1
                                                                        }
                                                                    }));
                                                                }}
                                                                className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                                            />
                                                        </div>

                                                        {/* New Unit */}
                                                        <div className="col-span-3 border-r border-gray-200">
                                                            <div className="p-2">


                                                                <select
                                                                    value={newRowData[unit._id]?.unit || ''}
                                                                    onChange={async (e) => {

                                                                        const updatedRow = {
                                                                            ...newRowData[unit._id],
                                                                            unit: e.target.value
                                                                        };

                                                                        // update state
                                                                        setNewRowData(prev => ({
                                                                            ...prev,
                                                                            [unit._id]: updatedRow
                                                                        }));

                                                                        // setNewRowData(prev => ({
                                                                        //     ...prev,
                                                                        //     [unit._id]: {
                                                                        //         ...prev[unit._id],
                                                                        //         unit: e.target.value
                                                                        //     }
                                                                        // }));


                                                                        await handleNewRowSave(unit._id, updatedRow);

                                                                    }}
                                                                    className="w-full relative z-[50] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                >
                                                                    <option value="">Selected unit</option>
                                                                    {UNIT_OPTIONS.map((unitOption) => (
                                                                        <option key={unitOption} value={unitOption}>
                                                                            {unitOption}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Add Icon */}
                                                        {/* <div onClick={() => {
                            
                            handleNewRowSave(unit._id, newRowData)
                        }} className="col-span-1 cursor-pointer flex items-center justify-center">
                            {addItemLoading && <i className="fas fa-spinner animate-spin mr-2"></i>}
                            <i className="fa fa-plus text-green-600 text-sm"></i>
                        </div> */}
                                                    </div>

                                                    {/* Empty State */}
                                                    {(!unit.subItems || unit.subItems.length === 0) && (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                                                            <p className="text-sm">No sub-items yet. Start typing in the row above to add items.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10 text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Order History</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    Your completed orders will appear here
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}


            {!isError && <section className="mt-4">
                {/* <GenerateWhatsappLink
                            projectId={projectId!} context="order material"
                            stage="ordermaterial"
                            data={data?.generatedLink}
                            isPending={generatePending}
                            generateLink={generateLink} /> */}



                <div className="space-y-4">


                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    Export Order Material
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Generate a PDF document of your order materials
                                </p>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={generatePending}
                                className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                size="lg"
                            >
                                {generatePending ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-file-pdf"></i>
                                        Generate PDF
                                    </>
                                )}
                            </Button>
                        </div>

                        {data?.pdfLink && data?.pdfLink?.length > 0 ?

                            data?.pdfLink?.map((ele: any) => (
                                <Card key={ele._id} className="border-green-200 bg-green-50">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <i className="fas fa-check-circle text-green-600"></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-green-900 mb-1">
                                                        {/* PDF Generated Successfully */}
                                                        {ele.pdfName}
                                                    </h4>
                                                    <span className="text-sm">Pdf Reference Id: {ele.refUniquePdf || "N/A"}</span>
                                                    <p className="text-sm text-green-700">
                                                        Your order material PDF is ready to view or download
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => window.open(ele.url, "_blank")}
                                                    className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                >
                                                    <i className="fas mr-2 fa-external-link-alt"></i>
                                                    View in New Tab
                                                </Button>

                                                <Button
                                                    variant="secondary"
                                                    onClick={() => downloadImage({ src: ele.url, alt: "order material" })}
                                                    className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                >
                                                    Download PDF
                                                </Button>


                                                <div className="relative  min-w-[160px]">
                                                    <label
                                                        htmlFor={`pdf-status-${ele._id}`}
                                                        className="hidden md:block mb-1 text-sm font-medium text-gray-600 absolute top-[-20px]"
                                                    >
                                                        Order Status
                                                    </label>
                                                    <select
                                                        id={`pdf-status-${ele._id}`}
                                                        value={ele.status || "pending"}
                                                        onChange={async (e) => {
                                                            const val = e.target.value;

                                                            await handleUpdatePdfStatus(ele._id, val);
                                                        }}
                                                        className="
                                                                                    w-full h-[45px] px-3 py-2 text-md  bg-white border  rounded-xl shadow 
                                                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                                                    disabled:opacity-50 appearance-none transition ease-in-out
                                                                                    border-blue-300 text-blue-800  hover:border-blue-400
                                                                                    "
                                                    >
                                                        {/* <option disabled value="">Select Status</option> */}
                                                        {["pending", "delivered", "shipped", "ordered", "cancelled"].map((status) => (
                                                            <option key={status} value={status}>
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {/* Custom dropdown chevron icon */}
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                                        <i className="fas fa-chevron-down text-xs"></i>
                                                    </div>
                                                </div>


                                                <Button
                                                    variant="danger"
                                                    isLoading={deletepdfPending}
                                                    onClick={() => handleDeletePdf(ele._id)}
                                                    className="border-red-300 bg-red-600 text-white hover:bg-red-600 hover:border-red-400"
                                                >
                                                    Delete PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                            :
                            <>
                                <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                                    <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No Pdf Found</h3>
                                    <p className="text-sm text-gray-500">
                                        No PDF Generated</p>
                                </div>

                            </>
                        }
                    </div>
                </div>
            </section>}

        </div>
    )
}

export default CommonOrderProject