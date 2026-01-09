import { useParams, useOutletContext, useNavigate, useLocation, Outlet } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
//  Added Select components for unit dropdown
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
// import { useCompleteOrderingMaterialStage, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline } from "../../../apiList/Stage Api/orderingMaterialApi";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { useGetSelectedModularUnits } from "../../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi";
// import { NO_IMAGE } from "../../../constants/constants";
import { useAddOrderingMaterialSubItem, useCompleteOrderingMaterialHistoryStage, useDeleteAllSubItems, useDeleteOrderingMaterialSubItem, useDeleteOrderMaterialImage, useGetAllOrderingMaterialHistory, useOrderHistoryGneratePdf, useOrderHistorySendToProcurement, useOrderHistorySubmitOrder, useSetOrderingMaterialHistoryDeadline, useUpdateDeliveryLocation, useUpdateOrderingMaterialSubItem, useUpdateShopDetails, useUploadOrderingMaterialImages } from "../../../apiList/Stage Api/orderMaterialHistoryApi";
// import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
import { useEffect, useRef, useState } from "react";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { downloadImage } from "../../../utils/downloadFile";
import { useGetShopLib } from "../../../apiList/Stage Api/shopLibDetailApi";
import SearchSelectNew from "../../../components/ui/SearchSelectNew";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";
// import { dateFormate, formatTime } from "../../../utils/dateFormator";


interface ProjectDetailsOutlet {
    isMobile: boolean;
    openMobileSidebar: () => void;
}

//  Added predefined unit options for the select dropdown
export const ORDERMATERIAL_UNIT_OPTIONS = [
    "nos",
    "pieces",
    "litre",
    "dozens",
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
    "sheet",
    "set",
    "coil",
    "pair"
];



interface SubItem {
    refId: string;
    _id: string;
    subItemName: string;
    quantity: number;
    unit: string;
}

const OrderMaterialOverview = () => {
    const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string };
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const navigate = useNavigate()
    const location = useLocation();



    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.ordermaterial?.delete;
    // const canList = role === "owner" || permission?.ordermaterial?.list;
    const canCreate = role === "owner" || permission?.ordermaterial?.create;
    const canEdit = role === "owner" || permission?.ordermaterial?.edit;




    const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterialHistory(projectId!);
    const { mutateAsync: generateLink, isPending: generatePending } = useOrderHistoryGneratePdf()
    // const { mutateAsync: updatePdfStatus } = useUpdatePdfStatus()
    const { mutateAsync: submitOrder, isPending: isSubmitting } = useOrderHistorySubmitOrder()

    const { mutateAsync: addSubItem } = useAddOrderingMaterialSubItem();
    const { mutateAsync: deleteSubItem, isPending: deleteItemLoading } = useDeleteOrderingMaterialSubItem();
    const { mutateAsync: updateSubItem } = useUpdateOrderingMaterialSubItem();
    const { mutateAsync: uploadImages, isPending: imagePending } = useUploadOrderingMaterialImages();
    const deleteImgMutation = useDeleteOrderMaterialImage()

    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialHistoryDeadline()
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialHistoryStage()

    const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();
    const { mutateAsync: updateShop } = useUpdateShopDetails();

    const { data: shops } = useGetShopLib(organizationId);

    const { mutateAsync: deleteAllSubItems, isPending: deleteAllPending } = useDeleteAllSubItems();
    // const { mutateAsync: deletePdf, isPending: deletePdfLoading } = useDeleteOrderMaterialPdf();

    const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurement();


    const [editDelivery, setEditDelivery] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState<any>({});
    const [editShop, setEditShop] = useState(false);
    const [shopForm, setShopForm] = useState<any>({});
    const [selectedShop, setSelectedShop] = useState<{
        selectedId: string | null,
        shopName: string | null
    }>({
        selectedId: null,
        shopName: null
    })



    useEffect(() => {
        if (selectedShop.selectedId) {
            const shop = shops?.find((shop: any) => shop._id === selectedShop.selectedId)
            console.log("shop", shop)
            if (shop) {
                setShopForm(shop)
            }
        }
    }, [selectedShop.selectedId, shops])

    const shopLibOptions = (shops || [])?.map((shop: any) => ({
        value: shop._id,
        label: shop.shopName
    }))


    // const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{
        subItemId: string;
        field: 'name' | 'quantity' | 'unit';
    } | null>(null);
    // const [tempValues, setTempValues] = useState<{ [key: string]: any }>({});
    // const [newRowData, setNewRowData] = useState<{
    //     [unitId: string]: {
    //         name: string;
    //         quantity: number;
    //         unit: string;
    //     }
    // }>({});

    const [newRowData, setNewRowData] = useState<{
        name: string;
        quantity: number;
        unit: string;
    }>({
        name: "",
        quantity: 1,
        unit: "",
    });



    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            // Convert FileList → File[]
            const validImages = Array.from(files).filter((file) =>
                file.type.startsWith("image/")
            );

            if (validImages.length !== files.length) {
                toast({
                    title: "Invalid file type",
                    description: "Only images are allowed (JPG, PNG, etc.)",
                    variant: "destructive",
                });
                return;
            }

            await uploadImages({ files: validImages, projectId });

            toast({ description: 'Successfully uploaded images', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to upload images", variant: "destructive" })
        }
    };

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
            navigate('../materialarrival')

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
        }
    };






    const handleDeleteAllSubItems = async () => {
        try {
            if (!window.confirm("Are you sure need to perform this operation?")) {
                return
            }
            await deleteAllSubItems({ projectId: projectId! });
            toast({ description: 'All Sub Items successfully', title: "Success" });

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete sub items", variant: "destructive" })
        }
    };




    const handleSubmitOrder = async () => {
        try {

            await submitOrder({ projectId: projectId! });
            toast({ description: 'All Sub Items successfully', title: "Success" });

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete sub items", variant: "destructive" })
        }
    };



    const handleSendToProcurement = async (orderItemId: string) => {
        try {
            await sendToProcurement({ projectId: projectId!, orderItemId: orderItemId!, organizationId: organizationId! });
            toast({ description: 'Sent to Procurement', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
        }
    };


    const handleUpdateDelivery = async () => {
        try {

            if (deliveryForm?.phoneNumber) {
                if (!/^\d{10}$/.test(deliveryForm?.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateDelivery({ projectId: projectId!, updates: deliveryForm });
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

            await updateShop({ projectId: projectId!, updates: shopForm });
            toast({ title: "Success", description: "Shop Details Updated" });
            setEditShop(false);
            refetch()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };



    const handleImageDelete = async (imageId: string) => {
        try {
            await deleteImgMutation.mutateAsync({
                projectId,
                imageId,
            })

            // console.log("upladsImages", uploadedImages)
            refetch?.()
            toast({ title: "Success", description: "deleted successfully" })

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "failed to delete", variant: "destructive" })
        }
    }

    // Focus input when editing starts
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCell]);



    const projectCode = projectId
        ?.replace(/[^a-zA-Z0-9]/g, "")
        .slice(-3)
        .toLowerCase();

    const year = new Date().getFullYear();

    // Collect all order numbers
    const orderNumbers = data?.orderedItems
        ?.map((item: any) => item?.orderMaterialNumber)
        ?.filter(Boolean) || [];

    // Extract numeric sequences
    const sequences = orderNumbers.map((num: string) => {
        const seq: any = num.split("-").pop();      // "005"
        return parseInt(seq, 10) || 0;
    });

    // Find maximum
    const maxSequence = sequences.length ? Math.max(...sequences) : 0;

    // Next number
    const nextSequence = (maxSequence + 1).toString().padStart(3, "0");

    // Final ID
    const nextOrderMaterialNumber = data?.currentOrder?.orderMaterialNumber || `ORD-${projectCode}-${year}-${nextSequence}` || null;


    const handleSaveEdit = async (subItemId: string, field: string, value: any) => {
        try {
            // const unit = data.currentOrder.subItems.find((u: any) => u._id === unitId);
            const subItem = data.currentOrder.subItems?.find((s: any) => s._id === subItemId);
            // console.log("subitem", subItem)
            if (!subItem) return;


            const updatedData = {
                projectId,
                subItemId,
                subItemName: field === 'name' ? value : subItem.subItemName,
                quantity: field === 'quantity' ? (Number(value) ? Number(value) : 1) : subItem.quantity,
                unit: field === 'unit' ? value : subItem.unit,
            };

            await updateSubItem(updatedData);
            toast({ title: "Success", description: "Item updated successfully" });
        } catch (error: any) {
            console.log("filed", error)
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update item",
                variant: "destructive"
            });
        }
    };

    // Handle new row creation
    const handleNewRowSave = async (newData: any) => {

        if (!canEdit && !canCreate) return
        const rowData: any = newData;
        // console.log("row data", rowData)

        if (!rowData && !rowData?.name.trim()) {
            return toast({
                title: "Error",
                description: "Material Name is mandatory",
                variant: "destructive"
            });
        }
        try {
            await addSubItem({
                projectId,
                subItemName: rowData.name,
                quantity: rowData.quantity ?? 1,
                unit: rowData.unit,
            });

            // Clear the new row data
            setNewRowData(
                { name: '', quantity: 1, unit: '' }
            );

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
    const handleDelete = async (subItemId: string) => {
        try {
            await deleteSubItem({ projectId, subItemId });
            toast({ title: "Success", description: "Item deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete item",
                variant: "destructive"
            });
        }
    };






    const handleGenerate = async (orderItemId: string) => {
        try {
            const res = await generateLink({ projectId, organizationId, orderItemId });

            await downloadImage({ src: res?.pdfUrl, alt: "Order Material" })
            toast({ title: "Success", description: "Pdf Generated successfully" });
            refetch()
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };




    const handleDownloadPdf = async (orderData: any) => {
        try {

            await downloadImage({ src: orderData?.pdfLink?.url, alt: orderData?.pdfLink?.pdfName })
            toast({ title: "Success", description: "PDF Downloaded successfully" });
        }
        catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || err?.message || "Failed to generate PDF",
                variant: "destructive"
            });
        }
    };





    const isChild = location.pathname.includes("siteorders") || location.pathname.includes("shoplib") || location.pathname.includes("singleorder");

    if (isChild) {
        return <Outlet />
    }

    if (isLoading) return <MaterialOverviewLoading />;

    // ... existing code ...

    // console.log("ordering matieral ", data)
    return (
        <div className="w-full h-full flex flex-col">

            {/* Header Section - Always visible */}
            <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
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
                    <span className="hidden sm:inline">Ordering Material</span>
                    <span className="sm:hidden">Order Material</span>
                </h2>

                <div className="flex gap-2">
                    {(canCreate || canEdit) &&
                        <>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    isLoading={completePending}
                                    onClick={handleCompletionStatus}
                                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
                                >
                                    <i className="fa-solid fa-circle-check mr-2"></i>
                                    Mark as Complete
                                </Button>

                                <ResetStageButton
                                    projectId={projectId!}
                                    stageNumber={8}
                                    stagePath="orderingmaterial"
                                />


                                {!getAllError && <ShareDocumentWhatsapp
                                    projectId={projectId!}
                                    stageNumber="8"
                                    className="w-full sm:w-fit"
                                    isStageCompleted={data?.status}
                                />}

                                <AssignStageStaff
                                    stageName="OrderMaterialHistoryModel"
                                    projectId={projectId!}
                                    organizationId={organizationId!}
                                    currentAssignedStaff={data?.assignedTo || null}
                                />
                            </div>

                        </>
                    }

                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="ordermaterial"
                        />
                    </div>

                </div>
            </header >

            {/* Error Display */}
            {
                (isError) && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                            <div className="text-red-600 font-semibold mb-2">
                                ⚠️ Error Occurred
                            </div>
                            <p className="text-red-500 text-sm mb-4">
                                {(getAllError as any)?.response?.data?.message || "Failed to load ordering material"}
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
                )
            }

            {/* Main Content - Only show if no error */}
            {
                !isError && (
                    <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6 ">
                        {/* Timer Card */}
                        <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
                            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                                <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                                <span>Stage Timings</span>
                            </div>
                            <StageTimerInfo
                                completedAt={data?.timer?.completedAt}
                                stageName="orderingmaterial"
                                formId={(data as any)?._id}
                                projectId={projectId!}
                                deadLine={data?.timer?.deadLine}
                                startedAt={data?.timer?.startedAt}
                                refetchStageMutate={refetch}
                                deadLineMutate={deadLineAsync}
                                isPending={deadLinePending}
                            />
                        </Card>

                        {!isError && (
                            <section className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">


                                {/* Shop Details */}
<div className="flex flex-col md:flex-row gap-4 w-full mb-3">

                                <section className="border-l-4 flex-1 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                                                <i className="fa-solid fa-store"></i>
                                                Shop Details
                                            </h2>
                                        </div>

                                        {!editShop ? <div className="gap-2 flex">

                                            <Button onClick={() => navigate("shoplib")}>
                                                <i className="fas fa-shop mr-2"></i>
                                                Shop Library
                                            </Button>

                                            {(canEdit || canCreate) && <button
                                                onClick={() => { setShopForm(data?.shopDetails); setEditShop(true); }}
                                                // className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                                className=" text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"

                                            >
                                                <i className="fa-solid fa-edit mr-1"></i>Edit
                                            </button>}
                                        </div>
                                            :

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                                <SearchSelectNew
                                                    options={shopLibOptions}
                                                    placeholder="Select Shop"
                                                    searchPlaceholder="Search by shop name..."
                                                    value={selectedShop.selectedId || ''}
                                                    onValueChange={(value) => {
                                                        const shopFound = shops?.find((s: any) => s._id === value)
                                                        // console.log("sop", shopFound)
                                                        setSelectedShop(({ selectedId: shopFound._id, shopName: shopFound.shopName }))
                                                    }}
                                                    searchBy="name"
                                                    displayFormat="detailed"
                                                    className="w-full"
                                                />
                                            </div>
                                        }
                                    </div>
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
                                            <div className="flex flex-col sm:flex-row gap-2 mt-3  justify-end ">
                                                <Button onClick={handleUpdateShop} className="w-full sm:w-auto">
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



                                        </div>
                                    )}
                                </section>

                                <div className="border-l-4 flex-1 mt-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
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
                                            <div className="flex flex-col sm:flex-row gap-2 mt-3  justify-end ">
                                                <Button onClick={handleUpdateDelivery} className="w-full sm:w-auto">
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
                                            {(canEdit || canCreate) && <button
                                                onClick={() => { setDeliveryForm(data?.deliveryLocationDetails); setEditDelivery(true); }}
                                                className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                            >
                                                <i className="fa-solid fa-edit mr-1"></i>Edit
                                            </button>}
                                        </div>
                                    )}
                                </div>
                                </div>


                                <section className="w-full">
                                    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                                            <i className="fas fa-folder-open mr-2 text-blue-500"></i> Images
                                        </h3>



                                        <div className="flex items-center justify-between w-full relative">

                                            {(canEdit || canCreate) && <Input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                placeholder="select files"
                                                // className="h-10"
                                                onChange={handleFileChange}
                                                disabled={imagePending}
                                                className={imagePending ? "pr-10 opacity-70 cursor-not-allowed w-full mb-4" : "mb-4"}
                                            />}

                                            {imagePending && (
                                                <div className="absolute inset-y-0 right-2 flex items-center">
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-gray-500"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image Gallery */}
                                        <div className="mb-6">
                                            {data?.images?.length > 0 ? <ImageGalleryExample
                                                {...(canDelete ? { handleDeleteFile: (imgId: string) => handleImageDelete(imgId) } : {})}

                                                imageFiles={data?.images}
                                                height={150}
                                                minWidth={150}
                                                maxWidth={200} />
                                                :
                                                <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
                                                    No Images uploaded yet.
                                                </div>
                                            }
                                        </div>





                                    </section>


                                </section>

                                {/* Modern header with subtle accent */}
                                {/* <div className="p-6 border-b mt-4 border-gray-100 relative">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-600 "></div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>

                            </div>
                            <div className="flex gap-2">


                                <Button variant="primary" className=""
                                    onClick={() => navigate('siteorders')}>
                                    <i className="fas fa-box-archive !mr-2"></i>
                                    View Public Orders
                                </Button>

                                {canDelete && <Button variant="danger" className="bg-red-600 text-white"
                                    isLoading={deleteAllPending} onClick={handleDeleteAllSubItems}>
                                    <i className="fas fa-trash !mr-2"></i>
                                    Delete All SubItems
                                </Button>}

                               
                            </div>
                        </div>
                    </div> */}





                                {/* Newer version */}

                                <div
                                    className="mt-6 pt-4 border-t-2 border-blue-200 bg-gradient-to-r from-white to-white rounded-lg p-4"

                                >
                                    {/* <div className="mb-3 ">

                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-list text-blue-600"></i>
                                <h4 className="font-semibold text-blue-800 text-xl">Create Material Order</h4>
                                <span className="text-sm text-gray-500">(Click to edit, changes save by clicking Enter)</span>
                            </div>

                            <p className="ml-6 text-sm text-gray-500">Order Id: {" "}
                                <span className="text-lg text-black font-medium">
                                    {nextOrderMaterialNumber}
                                </span>
                            </p>
                        </div> */}

                                    <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b-2 border-blue-600">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
                                                    <i className="fa-solid fa-list text-blue-600"></i>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-2xl tracking-tight">
                                                    Create Material Order
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 ml-10">
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    Instruction
                                                </span>
                                                <p className="text-xs text-gray-500 italic">
                                                    Click cells to edit • Press <span className="font-bold text-gray-700">Enter</span> to save
                                                </p>
                                            </div>
                                        </div>

                                        {/* <div className="flex gap-2 items-center">

                                <div className="mt-4 md:mt-0 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                                    <span className="text-xl font-mono font-black text-blue-700">
                                        {nextOrderMaterialNumber}
                                    </span>
                                </div>

                                  <Button variant="primary" className=""
                                    onClick={() => navigate('siteorders')}>
                                    <i className="fas fa-box-archive !mr-2"></i>
                                    View Public Orders
                                </Button>

                                {canDelete && <Button variant="danger" className="bg-red-600 text-white"
                                    isLoading={deleteAllPending} onClick={handleDeleteAllSubItems}>
                                    <i className="fas fa-trash !mr-2"></i>
                                    Delete All SubItems
                                </Button>}
                            </div> */}

                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Compact Order Identifier */}
                                            <div className="flex items-center self-stretch bg-white rounded-lg border border-gray-200 px-3 py-1 shadow-sm">
                                                <div className="flex flex-col leading-none border-r border-gray-200 pr-3 mr-3">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                                                    <span className="text-sm font-mono font-black text-blue-700 mt-0.5">
                                                        {nextOrderMaterialNumber}
                                                    </span>
                                                </div>

                                                {/* Action Buttons Container */}
                                                <div className="flex items-center gap-1.5">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-8 text-xs px-3 shadow-none"
                                                        onClick={() => navigate('siteorders')}
                                                    >
                                                        <i className="fas fa-box-archive mr-2"></i>
                                                        View Public Orders
                                                    </Button>

                                                    {canDelete && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="h-8 text-xs px-3 bg-red-600 text-white shadow-none"
                                                            isLoading={deleteAllPending}
                                                            onClick={handleDeleteAllSubItems}
                                                        >
                                                            <i className="fas fa-trash mr-2"></i>
                                                            Delete All
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>





                                    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                                        <div
                                            className="grid grid-cols-17 gap-0 bg-gradient-to-r from-blue-100 to-blue-100 border-b-2 border-blue-200"
                                        >
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


                                        {data.currentOrder.subItems && data.currentOrder?.subItems.length > 0 && data.currentOrder.subItems.map((sub: SubItem) => (
                                            <div key={sub._id} className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">

                                                <div className="col-span-3 border-r border-blue-200">

                                                    <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                        {sub?.refId || "N/A"}
                                                    </div>
                                                </div>

                                                <div className="col-span-8 border-r border-blue-200">
                                                    {editingCell?.subItemId === sub._id && editingCell?.field === 'name' ? (
                                                        <input
                                                            ref={inputRef}
                                                            type="text"
                                                            defaultValue={sub.subItemName}
                                                            className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                            onBlur={(e) => {
                                                                handleSaveEdit(sub._id, 'name', e.target.value);
                                                                setEditingCell(null);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    const value = (e.target as HTMLInputElement).value;
                                                                    handleSaveEdit(sub._id, 'name', value);
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
                                                            onClick={() => {
                                                                if (canCreate || canEdit) {
                                                                    setEditingCell({ subItemId: sub._id, field: 'name' })
                                                                }
                                                            }
                                                            }

                                                        >
                                                            {sub.subItemName}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-span-2 border-r border-blue-200">
                                                    {editingCell?.subItemId === sub._id && editingCell?.field === 'quantity' ? (
                                                        <input
                                                            ref={inputRef}
                                                            type="number"
                                                            defaultValue={sub.quantity}
                                                            min="0"
                                                            className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                            onBlur={(e) => {
                                                                handleSaveEdit(sub._id, 'quantity', e.target.value);
                                                                setEditingCell(null);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveEdit(sub._id, 'quantity', e.currentTarget.value);
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
                                                            onClick={() => {
                                                                if (canCreate || canEdit) {
                                                                    setEditingCell({ subItemId: sub._id, field: 'quantity' })
                                                                }

                                                            }
                                                            }
                                                        >
                                                            {sub.quantity}
                                                        </div>
                                                    )}
                                                </div>


                                                <div className="col-span-3 border-r border-blue-200">
                                                    {editingCell?.subItemId === sub._id && editingCell?.field === 'unit' ? (
                                                        <div className="p-2 relative z-50">
                                                            <select
                                                                defaultValue={sub.unit}
                                                                onChange={(e) => {
                                                                    handleSaveEdit(sub._id, 'unit', e.target.value);
                                                                    setEditingCell(null);
                                                                }}
                                                                className="w-full relative z-[50] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                            >
                                                                <option value="" disabled>Selected unit</option>
                                                                {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                                    <option key={unitOption} value={unitOption}>
                                                                        {unitOption}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                            onClick={() => {

                                                                if (canCreate || canEdit) {
                                                                    setEditingCell({ subItemId: sub._id, field: 'unit' })
                                                                }

                                                            }
                                                            }
                                                        >
                                                            {sub.unit}
                                                        </div>
                                                    )}
                                                </div>


                                                {canDelete && <div className="col-span-1 flex items-center justify-center">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDelete(sub._id)}
                                                        disabled={deleteItemLoading}
                                                        isLoading={deleteItemLoading}
                                                        className="p-2 bg-red-600 text-white  hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                                        title="Delete item"
                                                    >
                                                        <i className="fa fa-trash text-sm"></i>
                                                    </Button>
                                                </div>}
                                            </div>
                                        ))}

                                        <div className="grid grid-cols-17 gap-0 bg-green-50 border-b border-gray-100">


                                            <div className="col-span-3 border-r border-gray-200">

                                                <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                    Ref Id
                                                </div>
                                            </div>


                                            <div className="col-span-8 border-r border-gray-200">
                                                <input
                                                    type="text"
                                                    placeholder="Enter matterial name..."
                                                    value={newRowData?.name || ''}
                                                    onChange={(e) => {
                                                        setNewRowData(prev => ({
                                                            ...prev,

                                                            name: e.target.value

                                                        }));
                                                    }}
                                                    onBlur={() => {
                                                        if (newRowData?.name?.trim() && newRowData.quantity && newRowData.unit) {
                                                            handleNewRowSave(newRowData);
                                                        }
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
                                                    value={newRowData?.quantity || 1}
                                                    onChange={(e) => {
                                                        setNewRowData(prev => ({
                                                            ...prev,

                                                            quantity: Number(e.target.value) || 1

                                                        }));
                                                    }}
                                                    className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                                />
                                            </div>

                                            <div className="col-span-3 border-r border-gray-200">
                                                <div className="p-2">


                                                    <select
                                                        value={newRowData?.unit || ''}
                                                        onChange={async (e) => {

                                                            const updatedRow = {
                                                                ...newRowData,
                                                                unit: e.target.value
                                                            };

                                                            // update state
                                                            setNewRowData(prev => ({
                                                                ...prev,
                                                                unit: e.target.value
                                                            }));

                                                            // setNewRowData(prev => ({
                                                            //     ...prev,
                                                            //     [unit._id]: {
                                                            //         ...prev[unit._id],
                                                            //         unit: e.target.value
                                                            //     }
                                                            // }));


                                                            await handleNewRowSave(updatedRow);

                                                        }}
                                                        className="w-full relative z-[50] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                    >
                                                        <option value="">Selected unit</option>
                                                        {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                            <option key={unitOption} value={unitOption}>
                                                                {unitOption}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>


                                        </div>

                                        {(!data.currentOrder.subItems || data.currentOrder?.subItems?.length === 0) && (
                                            <div className="text-center py-8 text-gray-500">
                                                <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                                                <p className="text-sm">No sub-items yet. Start typing in the row above to add items.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/*end of newer  version */}

                                {/* <div className="py-2 overflow-y-auto custom-scrollbar ">
                                {hasUnits ? (
                                    <div className="grid gap-5">
                                        {selectedUnits.map((unit: any, idx: number) => (
                                            <div
                                                key={unit._id || idx}
                                                className={`group relative p-5 transition-all duration-200
                    ${expandedUnitId === unit._id
                                                        ? "border-2 border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-blue-50 ring-2 ring-blue-200"
                                                        : "border-l-4 border-blue-600 hover:border-blue-600 hover:shadow-md bg-white"
                                                    }
                    rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]`}
                                            >

                                                
                                                <div className="flex flex-col md:flex-row gap-5">
                                                    <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                                                        <img
                                                            src={unit?.image || NO_IMAGE}
                                                            alt={unit.customId || "Product image"}
                                                            className="w-full h-full object-contain p-3"
                                                        />
                                                        <div
                                                            className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                                                     
                                                        >
                                                            ×{unit.quantity}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 flex flex-col">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3
                                                                    className={`text-lg font-semibold mb-1.5 ${expandedUnitId === unit._id ? "text-blue-800" : "text-gray-800"
                                                                        }`}
                                                                >
                                                                    {unit.unitName}
                                                                </h3>
                                                                <div className="flex gap-2 items-center">
                                                                    <span
                                                                        className={`flex cursor-pointer gap-1 items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${expandedUnitId === unit._id
                                                                            ? "text-blue-700 bg-blue-100 hover:bg-blue-200"
                                                                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                                                            }`}


                                                                    > Total Sub Items : <span className="">{unit?.subItems?.length || 0}</span></span>
                                                                    <button
                                                                        onClick={() =>
                                                                            setExpandedUnitId(
                                                                                expandedUnitId === unit._id ? null : unit._id
                                                                            )
                                                                        }
                                                                        className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${expandedUnitId === unit._id
                                                                            ? "text-white bg-blue-600 hover:bg-blue-700 shadow-md"
                                                                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                                                            }`}
                                                                    >
                                                                        <span className="hidden sm:inline">
                                                                            Create Material Items
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
                                                                <span
                                                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${expandedUnitId === unit._id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                                                        }`}
                                                                >
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
                                                    <div
                                                        className="mt-6 pt-4 border-t-2 border-blue-200 bg-gradient-to-r from-white to-white rounded-lg p-4"

                                                    >
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <i className="fa-solid fa-list text-blue-600"></i>
                                                            <h4 className="font-semibold text-blue-800">Sub Items</h4>
                                                            <span className="text-sm text-gray-500">(Click to edit, changes save by clicking Enter)</span>
                                                        </div>

                                                        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                                                            <div
                                                                className="grid grid-cols-17 gap-0 bg-gradient-to-r from-blue-100 to-blue-100 border-b-2 border-blue-200"
                                                            >
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

                                                           
                                                            {unit.subItems && unit.subItems.length > 0 && unit.subItems.map((sub: SubItem) => (
                                                                <div key={sub._id} className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">
                                                                   
                                                                    <div className="col-span-3 border-r border-blue-200">

                                                                        <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                                            {sub?.refId || "N/A"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-span-8 border-r border-blue-200">
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
                                                                   
                                                                    <div className="col-span-2 border-r border-blue-200">
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

                                                                   
                                                                    <div className="col-span-3 border-r border-blue-200">
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
                                                                                    {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
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

                                                            <div className="grid grid-cols-17 gap-0 bg-green-50 border-b border-gray-100">


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

                                                                <div className="col-span-2 border-r border-gray-200">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Qty"
                                                                        min="0"
                                                                        value={newRowData[unit._id]?.quantity || 1}
                                                                        onChange={(e) => {
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
                                                                            {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                                                <option key={unitOption} value={unitOption}>
                                                                                    {unitOption}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>


                                                            </div>

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
                            </div> */}
                            </section>
                        )}



                        <section>


                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Orders
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        view your orders
                                    </p>
                                </div>

                                {canCreate && <Button
                                    onClick={handleSubmitOrder}
                                    isLoading={isSubmitting}
                                    className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                    size="lg"
                                >
                                    Submit Order
                                </Button>}
                            </div>




                            {data?.orderedItems && data?.orderedItems?.length > 0 ?

                                <div className="flex flex-col gap-2">

                                    {data?.orderedItems?.map((ele: any) => (
                                        <Card key={ele._id} className="border-green-200 bg-green-50 shadow ">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <i className="fas fa-check-circle text-7reen-600"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-blue-700 ">
                                                                <span className="!text-sm text-gray-600">Order Id: </span> {ele.orderMaterialNumber}
                                                            </h4>
                                                            {/* <span className="text-sm text-gray-500">Created At:</span> <span>{dateFormate(ele.createdAt)} - {formatTime(ele.createdAt)}</span> */}
                                                            <span className="text-sm text-gray-900">Order Material</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => navigate(`singleorder/${ele._id}`)}
                                                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                        >
                                                            <i className="fas mr-2 fa-external-link-alt"></i>
                                                            View
                                                        </Button>




                                                        {(canCreate || canEdit) && <Button
                                                            variant="outline"
                                                            onClick={() => handleGenerate(ele._id)}
                                                            isLoading={generatePending}
                                                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                        >
                                                            Generate Pdf
                                                        </Button>}

                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => handleDownloadPdf(ele)}
                                                            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                        >
                                                            Download PDF
                                                        </Button>


                                                        {(canCreate || canEdit) && <Button
                                                            variant="outline"
                                                            onClick={() => handleSendToProcurement(ele._id)}
                                                            disabled={ele?.isSyncWithProcurement}
                                                            title={ele?.isSyncWithProcurement ? "already sent to procurement" : ""}

                                                            isLoading={isSending}
                                                            className="border-green-300 text-blue-700 disabled:cursor-not-allowed hover:bg-blue-100 hover:border-blue-400"
                                                        >
                                                            Send To Procurement
                                                        </Button>}


                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                :
                                <>
                                    <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                                        <i className="fa-solid fa-box text-5xl text-blue-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-blue-800 mb-1">No Orders Found</h3>
                                        {/* <p className="text-sm text-gray-500">
                                        No PDF Generated</p> */}
                                    </div>
                                </>
                            }




                        </section>

                        {/* <section className="mt-4"> */}
                        {/* <GenerateWhatsappLink
                            projectId={projectId!} context="order material"
                            stage="ordermaterial"
                            data={data?.generatedLink}
                            isPending={generatePending}
                            generateLink={generateLink} /> */}


                        {/* <div className="space-y-4">



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
                                        onClick={handleSubmitOrder}
                                        isLoading={isSubmitting}
                                        className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                        size="lg"
                                    >
                                        Submit Order
                                    </Button>
                                </div>

                                {data?.generatedLink && data?.generatedLink?.length > 0 ?

                                    data?.generatedLink?.map((ele: any) => (
                                        <Card key={ele._id} className="border-green-200 bg-green-50 ">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <i className="fas fa-check-circle text-green-600"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-green-900 mb-1">
                                                                {ele.pdfName}
                                                            </h4>
                                                            <span className="text-sm">Order Id: {ele.refUniquePdf || "N/A"}</span>
                                                            <p className="text-sm text-green-700">
                                                                Your order material PDF is ready to view or download
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
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
                                                                {["pending", "delivered", "shipped", "ordered", "cancelled"].map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                                                <i className="fas fa-chevron-down text-xs"></i>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            variant="danger"
                                                            isLoading={deletePdfLoading}
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
                    </section> */}
                    </div>
                )
            }
        </div >
    )
}

export default OrderMaterialOverview;



