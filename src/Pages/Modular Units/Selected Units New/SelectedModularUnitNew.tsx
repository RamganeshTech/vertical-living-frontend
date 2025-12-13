// SelectedModularUnitsNew.tsx
import { useParams, useOutletContext, useNavigate } from "react-router-dom"
import { toast } from "../../../utils/toast"
import { Button } from "../../../components/ui/Button"
import { Badge } from "../../../components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import {
    useGetSelectedUnitsByProjectNew,
    useDeleteSelectedUnitNew,
    useAddSelectedUnitNew,
    useGeneratePdfModularUnits
} from "../../../apiList/Modular Unit Api/Selected Modular Api copy New/selectedModularUnitNewApi"
import type { OrganizationOutletTypeProps } from "../../Organization/OrganizationChildren";
import { NO_IMAGE } from "../../../constants/constants";
import { useState } from "react";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { downloadImage } from "../../../utils/downloadFile";
import { dateFormate, formatTime } from './../../../utils/dateFormator';
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface IModularUnitUpload {
    type: "image" | "pdf";
    url: string | null;
    originalName: string;
    uploadedAt: Date | string;
}

interface IDimension {
    depth?: number;
    width?: number;
    height?: number;
}

export interface ISelectedUnit {
    _id?: string;
    productId: string;
    productName: string;
    attributes: string[];
    serialNo: string;
    dimention: IDimension;
    description: string | null;
    totalAreaSqFt: number | null;
    materialsNeeded: string | null;
    fabricationCost: number;
    timeRequired: number | null;
    // price: number | null;
    productImages: IModularUnitUpload[];
    "2dImages": IModularUnitUpload[];
    "3dImages": IModularUnitUpload[];
    category: string | null;
    quantity: number;
    singleUnitCost: number;
}

export interface ISelectedModularUnit {
    _id?: string;
    projectId: string;
    selectedUnits: ISelectedUnit[];
    pdfList: IModularUnitUpload[]
    totalCost: number;
    status: "pending" | "completed";
}

export default function SelectedModularUnitsNew() {
    const { projectId } = useParams()
    const { isMobile, openMobileSidebar } = useOutletContext<OrganizationOutletTypeProps>()
    const navigate = useNavigate()
    const [updatingUnitId, setUpdatingUnitId] = useState<string | null>(null)

    // Custom hooks
    const { data: selectedModularUnits, isLoading, error, refetch } = useGetSelectedUnitsByProjectNew(projectId!) as {
        data: ISelectedModularUnit;
        isLoading: boolean;
        error: unknown;
        refetch: () => void;
    }
    const { mutateAsync: deleteUnit, isPending: isDeleting, variables } = useDeleteSelectedUnitNew()
    const { mutateAsync: generatePdf, isPending: isCompleting } = useGeneratePdfModularUnits()
    const { mutateAsync: updateUnit, isPending: isUpdating } = useAddSelectedUnitNew()

      const { role, permission } = useAuthCheck();
        const canDelete = role === "owner" || permission?.modularunit?.delete;
        // const canList = role === "owner" || permission?.modularunit?.list;
        // const canCreate = role === "owner" || permission?.modularunit?.create;
        const canEdit = role === "owner" || permission?.modularunit?.edit;
    

    const handleDeleteUnit = async (unitId: string) => {
        try {
            await deleteUnit({ projectId: projectId!, unitId })
            toast({
                title: "Success",
                description: "Unit removed successfully",
            })
            // refetch()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete unit",
                variant: "destructive",
            })
        }
    }

    const handleQuantityChange = async (unit: ISelectedUnit, newQuantity: number) => {
        // if (newQuantity < 0) return;

        setUpdatingUnitId(unit.productId)

        try {
            // Create product object from unit
            const product = {
                _id: unit.productId,
                productName: unit.productName,
                attributes: unit.attributes,
                serialNo: unit.serialNo,
                dimention: unit.dimention,
                description: unit.description,
                totalAreaSqFt: unit.totalAreaSqFt,
                materialsNeeded: unit.materialsNeeded,
                fabricationCost: unit.fabricationCost,
                timeRequired: unit.timeRequired,
                // price: unit.price,
                productImages: unit.productImages,
                "2dImages": unit["2dImages"],
                "3dImages": unit["3dImages"],
                category: unit.category,
            }

            await updateUnit({
                projectId: projectId!,
                quantity: newQuantity,
                singleUnitCost: unit.singleUnitCost,
                product
            })

            toast({
                title: "Success",
                description: "Quantity updated successfully",
            })
            refetch()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update quantity",
                variant: "destructive",
            })
        } finally {
            setUpdatingUnitId(null)
        }
    }

    const handleGeneratePdf = async () => {
        try {
            const res = await generatePdf({ projectId: projectId! })

            await downloadImage({ src: res?.pdfData?.url, alt: res?.pdfData?.originalName || "modular unit pdf" })
            toast({
                title: "Success",
                description: "Pdf Generated successfully",
            })
            // Navigate to next stage or wherever needed
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to complete selection",
                variant: "destructive",
            })
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount)
    }

    const formatCategory = (category: string | null) => {
        if (category === null) return "";
        return category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim()
    }

    const getMainImage = (unit: ISelectedUnit): string => {
        if (unit.productImages && unit.productImages.length > 0 && unit.productImages[0].url) {
            return unit.productImages[0].url;
        }
        if (unit["2dImages"] && unit["2dImages"].length > 0 && unit["2dImages"][0].url) {
            return unit["2dImages"][0].url;
        }
        if (unit["3dImages"] && unit["3dImages"].length > 0 && unit["3dImages"][0].url) {
            return unit["3dImages"][0].url;
        }
        return NO_IMAGE;
    }

    const selectedUnits = selectedModularUnits?.selectedUnits || []
    const totalCost = selectedModularUnits?.totalCost || 0
    const hasUnits = selectedUnits?.length > 0
    // const isCompleted = selectedModularUnits?.status === "completed"

    if (isLoading) {
        return (
            <div className="max-h-full overflow-y-auto flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Fixed Header */}
                <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {isMobile && (
                                <button
                                    onClick={openMobileSidebar}
                                    className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                                    title="Open Menu"
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            )}
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Selected Units</h1>
                        </div>
                    </div>
                </div>

                {/* Loading Content */}
                <MaterialOverviewLoading />
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Fixed Header */}
                <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {isMobile && (
                                <button
                                    onClick={openMobileSidebar}
                                    className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                                    title="Open Menu"
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            )}
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Selected Units</h1>
                        </div>
                    </div>
                </div>

                {/* Error Content */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4" />
                        <p className="text-red-600 text-lg mb-4">Failed to load selected units</p>
                        <Button onClick={() => refetch()} variant="outline">
                            <i className="fas fa-refresh mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Fixed Header with Total and Complete Button */}
            <header className="bg-white w-full shadow-sm border-b border-slate-200 px-4 py-4 flex-shrink-0">
                <div className="flex w-full items-center justify-between flex-wrap gap-4">
                    {/* Left side - Menu button and title */}
                    <div className="flex items-center">
                        {isMobile && (
                            <button
                                onClick={openMobileSidebar}
                                className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                                title="Open Menu"
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        )}
                        <div className="flex gap-2 items-center flex-row-reverse w-70 justify-between sm:flex-row sm:justify-start">
                            <div onClick={() => navigate(-1)} className="flex bg-gray-200 cursor-pointer rounded-full items-center gap-2 backdrop-blur-sm px-4 py-2">
                                <i className="fas fa-arrow-left text-sm"></i>
                                <span className="text-sm font-medium">Back</span>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Selected Units</h1>
                                <div className="flex items-center space-x-4 mt-1">
                                    {!isMobile && (
                                        <>
                                            <Badge variant="secondary" className="text-xs px-2 py-1">
                                                <i className="fas fa-cube mr-1" />
                                                {selectedUnits.length} {selectedUnits.length === 1 ? "Unit" : "Units"}
                                            </Badge>
                                            {/* {isCompleted && (
                                                <Badge variant="default" className="text-xs px-2 py-1 bg-green-500">
                                                    <i className="fas fa-check-circle mr-1" />
                                                    Completed
                                                </Badge>
                                            )} */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Total and Complete button */}
                    <div className="flex items-center justify-between sm:justify-center space-x-4 w-full sm:w-fit">
                        <div className="text-left sm:text-right">
                            <p className="text-sm text-slate-600">Total Cost</p>
                            <p className="text-xl md:text-2xl font-bold text-green-600">{formatCurrency(totalCost)}</p>
                        </div>
                        <Button
                            isLoading={isCompleting}
                            onClick={handleGeneratePdf}
                            disabled={isCompleting || !hasUnits}
                            className="px-4 md:px-6 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
                        >
                            <i className="fas fa-check-circle mr-2" />
                            {isMobile ? "Generate" : "Generate PDf"}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1  ">
                <div className="p-4 md:p-6">
                    <div className="max-w-full  mx-auto">
                        {/* Empty State */}
                        {!hasUnits ? (
                            <div className="h-full min-h-[60vh] text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                                    <i className="fas fa-shopping-cart text-6xl text-slate-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Units Selected</h3>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    You haven't added any modular units in cart yet.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Units Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4">
                                    {selectedUnits.map((unit: ISelectedUnit, index: number) => (
                                        <Card
                                            key={`${unit.productId}-${index}`}
                                            className="hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                        >
                                            {/* Unit Image */}
                                            <div className="relative h-48 bg-gray-100">
                                                <img
                                                    src={getMainImage(unit)}
                                                    alt={unit.productName || formatCategory(unit.category)}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Delete Button Overlay */}
                                               {(canDelete || canEdit)  && <Button
                                                    onClick={() => handleDeleteUnit(unit._id!)}
                                                    isLoading={isDeleting && variables.unitId === unit._id}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 shadow-sm"
                                                >
                                                    <i className="fas fa-trash text-sm" />
                                                </Button>}

                                                {/* Category Badge */}
                                                {unit.category && (
                                                    <Badge className="absolute bottom-2 left-2 bg-white/90 text-slate-700">
                                                        {formatCategory(unit.category)}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Card Content */}
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <CardTitle className="text-base md:text-lg font-semibold text-slate-900 truncate">
                                                            {unit.productName || formatCategory(unit.category)}
                                                        </CardTitle>
                                                        {unit.serialNo && (
                                                            <p className="text-xs text-slate-500 truncate">
                                                                <i className="fas fa-hashtag text-gray-500 text-xs"></i> {unit.serialNo}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <div className="space-y-3">
                                                    {/* Description */}
                                                    {unit.description && (
                                                        <div className="pb-2 border-b border-slate-100">
                                                            <p className="text-xs text-slate-600 line-clamp-2">{unit.description}</p>
                                                        </div>
                                                    )}

                                                    {/* Attributes */}
                                                    {unit.attributes && unit.attributes.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {unit.attributes.slice(0, 3).map((attr, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs px-2 py-0">
                                                                    {attr}
                                                                </Badge>
                                                            ))}
                                                            {unit.attributes.length > 3 && (
                                                                <Badge variant="outline" className="text-xs px-2 py-0">
                                                                    +{unit.attributes.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Dimensions */}
                                                    {unit.dimention && (unit.dimention.depth || unit.dimention.width || unit.dimention.height) && (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-600">Dimensions:</span>
                                                            <span className="font-medium text-slate-900">
                                                                {unit.dimention.height && `${unit.dimention.height}H`}
                                                                {unit.dimention.width && ` × ${unit.dimention.width}W`}
                                                                {unit.dimention.depth && ` × ${unit.dimention.depth}D`}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Total Area */}
                                                    {unit.totalAreaSqFt && (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-600">Area:</span>
                                                            <span className="font-medium text-slate-900">{unit.totalAreaSqFt} sq.ft</span>
                                                        </div>
                                                    )}

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                                        <span className="text-sm text-slate-600">Quantity:</span>
                                                        <div className="flex items-center space-x-2">

                                                           {canEdit && <Button
                                                                onClick={() => handleQuantityChange(unit, unit.quantity - 1)}
                                                                disabled={unit.quantity <= 0 || isUpdating || updatingUnitId === unit.productId}
                                                                isLoading={isUpdating}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 w-7 p-0"
                                                            >
                                                                <i className="fas fa-minus text-xs"></i>
                                                            </Button>}
                                                            <span className="font-semibold text-slate-900 min-w-[30px] text-center">
                                                                {updatingUnitId === unit.productId ? (
                                                                    <i className="fas fa-spinner fa-spin text-sm"></i>
                                                                ) : (
                                                                    unit.quantity
                                                                )}
                                                            </span>
                                                          {canEdit &&  <Button
                                                                onClick={() => handleQuantityChange(unit, unit.quantity + 1)}
                                                                disabled={isUpdating || updatingUnitId === unit.productId}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 w-7 p-0"
                                                            >
                                                                <i className="fas fa-plus text-xs"></i>
                                                            </Button>}

                                                        </div>
                                                    </div>

                                                    {/* Unit Cost */}
                                                    {unit.fabricationCost && unit.fabricationCost > 0 && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600">Unit Cost:</span>
                                                            <div className="flex items-center space-x-2">
                                                                <i className="fas fa-rupee-sign text-slate-400 text-xs" />
                                                                <span className="font-semibold text-slate-900 text-sm">
                                                                    {/* {formatCurrency(unit.singleUnitCost)} */}
                                                                    {formatCurrency(unit.fabricationCost)}

                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Fabrication Cost */}
                                                    {/* {unit.fabricationCost && unit.fabricationCost > 0 && (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-600">Fabrication:</span>
                                                            <span className="font-medium text-slate-700">
                                                                {formatCurrency(unit.fabricationCost)}
                                                            </span>
                                                        </div>
                                                    )} */}

                                                    {/* Time Required */}
                                                    {unit.timeRequired && unit.timeRequired > 0 && (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-600">Time:</span>
                                                            <span className="font-medium text-slate-700">
                                                                <i className="fas fa-clock mr-1"></i>
                                                                {unit.timeRequired} days
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Total Cost */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                                        <span className="text-sm font-medium text-slate-700">Total:</span>
                                                        <div className="flex items-center space-x-2">
                                                            <i className="fas fa-calculator text-green-500 text-xs" />
                                                            <span className="font-bold text-green-600 text-sm">
                                                                {formatCurrency(unit.singleUnitCost)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Summary Section */}
                                {hasUnits && (
                                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                            <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
                                            Order Summary
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-600 mb-1">Total Units</p>
                                                <p className="text-2xl font-bold text-blue-700">{selectedUnits.length}</p>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg">
                                                <p className="text-sm text-purple-600 mb-1">Total Quantity</p>
                                                <p className="text-2xl font-bold text-purple-700">
                                                    {selectedUnits.reduce((acc: number, unit: ISelectedUnit) => acc + unit.quantity, 0)}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <p className="text-sm text-green-600 mb-1">Total Cost</p>
                                                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalCost)}</p>
                                            </div>
                                        </div>

                                        {/* Materials Summary */}
                                        {selectedUnits.some((unit: ISelectedUnit) => unit.materialsNeeded) && (
                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                                                    <i className="fas fa-tools mr-2"></i>
                                                    Materials Needed
                                                </h4>
                                                <div className="space-y-1">
                                                    {selectedUnits
                                                        .filter((unit: ISelectedUnit) => unit.materialsNeeded)
                                                        .map((unit: ISelectedUnit, idx: number) => (
                                                            <div key={idx} className="text-xs text-slate-600">
                                                                <span className="font-medium">{unit.productName}:</span> {unit.materialsNeeded}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Total Fabrication Time */}
                                        {selectedUnits.some((unit: ISelectedUnit) => unit.timeRequired) && (
                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        <i className="fas fa-calendar-alt mr-2"></i>
                                                        Estimated Total Time:
                                                    </span>
                                                    <span className="text-lg font-bold text-slate-900">
                                                        {selectedUnits.reduce((acc: number, unit: ISelectedUnit) => acc + (unit.timeRequired || 0), 0)} days
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>


            <div className="space-y-6 px-3">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Export Order Material
                        </h3>
                        <p className="text-sm text-gray-600">
                            Generate a PDF document of your order materials
                        </p>
                    </div>

                    {/* <Button
                        onClick={handleGeneratePdf}
                        isLoading={isCompleting}
                        className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                        <i className="fas fa-file-pdf"></i>
                        Generate PDF
                    </Button> */}
                </div>

                {selectedModularUnits?.pdfList && selectedModularUnits?.pdfList?.length > 0 ?

                    selectedModularUnits?.pdfList?.map((ele: IModularUnitUpload) => (
                        <Card key={(ele as any)._id} className="border-green-200 bg-green-50 ">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-check-circle text-green-600"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-900 mb-1">
                                                {/* PDF Generated Successfully */}
                                                {ele.originalName}
                                            </h4>
                                            <span className="text-sm">Created At: {`${dateFormate(ele.uploadedAt as string)} - ${formatTime(ele.uploadedAt)}` || "N/A"}</span>
                                            <p className="text-sm text-green-700">
                                                Your order material PDF is ready to view or download
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(ele.url!, "_blank")}
                                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                        >
                                            <i className="fas mr-2 fa-external-link-alt"></i>
                                            View in New Tab
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            onClick={() => downloadImage({ src: ele.url!, alt: "order material" })}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                        >
                                            Download PDF
                                        </Button>


                                        {/* <div className="relative  min-w-[160px]">
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
                                                        </div> */}

                                        {/* <Button
                                                            variant="danger"
                                                            isLoading={deletePdfLoading}
                                                            onClick={() => handleDeletePdf(ele._id)}
                                                            className="border-red-300 bg-red-600 text-white hover:bg-red-600 hover:border-red-400"
                                                        >
                                                            Delete PDF
                                                        </Button> */}
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
    )
}