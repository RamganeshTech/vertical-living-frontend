import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import {
    useGetModularUnitByIdNew,
    useUpdateModularUnitNew,
} from "../../../apiList/Modular Unit Api/modularUnitNewApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/TextArea";
import type { ModularFormValues } from "./ModularUnitFormNew";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

const ModularUnitSingleNew = () => {
    const navigate = useNavigate();
    const { unitId } = useParams<{ unitId: string }>();

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);

    // Image Gallery States
    const [selectedImageType, setSelectedImageType] = useState<"product" | "2d" | "3d">("product");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Hooks
    const { data: unit, isLoading } = useGetModularUnitByIdNew(unitId!);
    const { mutateAsync: updateUnit, isPending: isUpdating } = useUpdateModularUnitNew();

    // Form State
    const [formValues, setFormValues] = useState<ModularFormValues>({
        productName: "",
        serialNo: "",
        category: "",
        description: "",
        dimention: {
            height: 0,
            width: 0,
            depth: 0,
        },
        totalAreaSqFt: "",
        materialsNeeded: "",
        fabricationCost: "",
        timeRequired: "",
        attributes: [],
    });

    // Image States
    const [productImages, setProductImages] = useState<File[]>([]);
    const [images2d, setImages2d] = useState<File[]>([]);
    const [images3d, setImages3d] = useState<File[]>([]);

    const [replaceProductImages, setReplaceProductImages] = useState(false);
    const [replace2dImages, setReplace2dImages] = useState(false);
    const [replace3dImages, setReplace3dImages] = useState(false);

    // Attribute input
    const [attributeInput, setAttributeInput] = useState("");

    // Load unit data
    useEffect(() => {
        if (unit) {
            setFormValues({
                productName: unit.productName || "",
                serialNo: unit.serialNo || "",
                category: unit.category || "",
                description: unit.description || "",
                dimention: {
                    height: unit.dimention?.height || 0,
                    width: unit.dimention?.width || 0,
                    depth: unit.dimention?.depth || 0,
                },
                totalAreaSqFt: unit.totalAreaSqFt?.toString() || "",
                materialsNeeded: unit.materialsNeeded || "",
                fabricationCost: unit.fabricationCost?.toString() || "",
                timeRequired: unit.timeRequired?.toString() || "",
                attributes: unit.attributes || [],
            });
        }
    }, [unit]);

    // Handle input change
    const handleInputChange = (field: keyof ModularFormValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    // Handle dimension changes
    const handleDimention = (field: keyof typeof formValues.dimention, value: string) => {
        const numValue = Math.max(0, Number(value) || 0);
        setFormValues((p) => ({ ...p, dimention: { ...p.dimention, [field]: numValue } }));
    };

    // Prevent negative input
    const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
            e.preventDefault();
        }
    };

    // Handle positive number input
    const handlePositiveNumberChange = (field: keyof ModularFormValues, value: string) => {
        const positiveValue = value.replace(/-/g, "");
        setFormValues((prev) => ({ ...prev, [field]: positiveValue }));
    };

    // Handle Product Images Upload
    const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setProductImages(files);
        setReplaceProductImages(true);
    };

    // Handle 2D Images Upload
    const handleImages2dChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages2d(files);
        setReplace2dImages(true);
    };

    // Handle 3D Images Upload
    const handleImages3dChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages3d(files);
        setReplace3dImages(true);
    };

    // Add Attribute
    const handleAddAttribute = () => {
        if (attributeInput.trim()) {
            setFormValues((prev) => ({
                ...prev,
                attributes: [...prev.attributes, attributeInput.trim()],
            }));
            setAttributeInput("");
        }
    };

    // Remove Attribute
    const handleRemoveAttribute = (index: number) => {
        setFormValues((prev) => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index),
        }));
    };

    // Toggle Edit Mode
    const handleToggleEditMode = () => {
        if (isEditMode) {
            // Cancel edit - reset form
            if (unit) {
                setFormValues({
                    productName: unit.productName || "",
                    serialNo: unit.serialNo || "",
                    category: unit.category || "",
                    description: unit.description || "",
                    dimention: {
                        height: unit.dimention?.height || 0,
                        width: unit.dimention?.width || 0,
                        depth: unit.dimention?.depth || 0,
                    },
                    totalAreaSqFt: unit.totalAreaSqFt?.toString() || "",
                    materialsNeeded: unit.materialsNeeded || "",
                    fabricationCost: unit.fabricationCost?.toString() || "",
                    timeRequired: unit.timeRequired?.toString() || "",
                    attributes: unit.attributes || [],
                });
            }
            setProductImages([]);
            setImages2d([]);
            setImages3d([]);
            setReplaceProductImages(false);
            setReplace2dImages(false);
            setReplace3dImages(false);
        }
        setIsEditMode(!isEditMode);
    };

    // Save Changes
    const handleSaveChanges = async () => {
        // Validation
        if (!formValues.productName.trim()) {
            toast({ title: "Error", description: "Product name is required", variant: "destructive" });
            return;
        }

        if (!formValues.category) {
            toast({ title: "Error", description: "Category is required", variant: "destructive" });
            return;
        }

        if (!formValues.fabricationCost || Number(formValues.fabricationCost) <= 0) {
            toast({ title: "Error", description: "Valid fabrication cost is required", variant: "destructive" });
            return;
        }

        const submitData = {
            ...formValues,
            // dimention: {
            //     height: formValues.dimention.height || undefined,
            //     width: formValues.dimention.width || undefined,
            //     depth: formValues.dimention.depth || undefined,
            // },
            totalAreaSqFt: formValues.totalAreaSqFt || undefined,
            fabricationCost: formValues.fabricationCost || undefined,
            timeRequired: formValues.timeRequired || undefined,
        };

        try {
            await updateUnit({
                unitId: unitId!,
                formValues: submitData,
                productImages,
                images2d,
                images3d,
                replaceProductImages,
                replace2dImages,
                replace3dImages,
            });

            toast({ title: "Success", description: "Product updated successfully!" });
            setIsEditMode(false);
            setProductImages([]);
            setImages2d([]);
            setImages3d([]);
            setReplaceProductImages(false);
            setReplace2dImages(false);
            setReplace3dImages(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update product",
                variant: "destructive",
            });
        }
    };

    // Get current images based on selected type
    const getCurrentImages = () => {
        if (!unit) return [];

        switch (selectedImageType) {
            case "product":
                return unit.productImages || [];
            case "2d":
                return unit["2dImages"] || [];
            case "3d":
                return unit["3dImages"] || [];
            default:
                return [];
        }
    };

    const currentImages = getCurrentImages();

    // Loading state
    if (isLoading) {
        return (
            <MaterialOverviewLoading />
        );
    }

    if (!unit) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4" />
                    <p className="text-red-500">Product not found</p>
                    <Button onClick={() => navigate(-1)} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-h-full overflow-hidden bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            <i className="fas fa-arrow-left" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {unit.productName || "Untitled Product"}
                            </h1>
                            {unit.serialNo && (
                                <p className="text-sm text-gray-500">Serial: {unit.serialNo}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditMode && (
                            <Button
                                onClick={handleToggleEditMode}
                                className="flex items-center gap-2"
                            >
                                <i className="fas fa-edit" />
                                Edit
                            </Button>
                        )}

                        {isEditMode && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleToggleEditMode}
                                    disabled={isUpdating}
                                >
                                    <i className="fas fa-times mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveChanges}
                                    isLoading={isUpdating}
                                    className="min-w-[120px]"
                                >
                                    {isUpdating ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2" />
                                            Save
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-full !max-h-full mx-auto p-3">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Image Gallery */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Image Display */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="aspect-video bg-gray-100 relative rounded-lg">
                                    {currentImages.length > 0 ? (
                                        <img
                                            src={currentImages[selectedImageIndex]?.url}
                                            alt={`${selectedImageType} image ${selectedImageIndex + 1}`}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center text-gray-400">
                                                <i className="fas fa-image text-6xl mb-4" />
                                                <p>No {selectedImageType} images available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image Type Tabs */}
                                <div className="flex border-b">
                                    <button
                                        onClick={() => {
                                            setSelectedImageType("product");
                                            setSelectedImageIndex(0);
                                        }}
                                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${selectedImageType === "product"
                                            ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <i className="fas fa-images mr-2" />
                                        Product Images ({unit.productImages?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedImageType("2d");
                                            setSelectedImageIndex(0);
                                        }}
                                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${selectedImageType === "2d"
                                            ? "bg-cyan-50 text-cyan-600 border-b-2 border-cyan-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <i className="fas fa-draw-polygon mr-2" />
                                        2D Images ({unit["2dImages"]?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedImageType("3d");
                                            setSelectedImageIndex(0);
                                        }}
                                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${selectedImageType === "3d"
                                            ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <i className="fas fa-cube mr-2" />
                                        3D Images ({unit["3dImages"]?.length || 0})
                                    </button>
                                </div>

                                {/* Thumbnail Navigation */}
                                {currentImages.length > 0 && (
                                    <div className="p-4 border-t h-[200px] ">
                                        <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto ">
                                            {currentImages.map((image: any, index: number) => (
                                                // <>
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className={`aspect-square h-full w-full rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                                // </>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upload New Images (Edit Mode Only) */}
                        {isEditMode && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <i className="fas fa-cloud-upload-alt text-blue-600" />
                                        Upload New Images
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Product Images Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="productImages">Product Images</Label>
                                        <Input
                                            id="productImages"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleProductImagesChange}
                                            className="cursor-pointer"
                                        />
                                        {productImages.length > 0 && (
                                            <p className="text-sm text-green-600">
                                                <i className="fas fa-check-circle mr-1" />
                                                {productImages.length} new image(s) selected
                                            </p>
                                        )}
                                    </div>

                                    {/* 2D Images Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="images2d">2D Design Images</Label>
                                        <Input
                                            id="images2d"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImages2dChange}
                                            className="cursor-pointer"
                                        />
                                        {images2d.length > 0 && (
                                            <p className="text-sm text-green-600">
                                                <i className="fas fa-check-circle mr-1" />
                                                {images2d.length} new image(s) selected
                                            </p>
                                        )}
                                    </div>

                                    {/* 3D Images Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="images3d">3D Render Images</Label>
                                        <Input
                                            id="images3d"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImages3dChange}
                                            className="cursor-pointer"
                                        />
                                        {images3d.length > 0 && (
                                            <p className="text-sm text-green-600">
                                                <i className="fas fa-check-circle mr-1" />
                                                {images3d.length} new image(s) selected
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-xs text-orange-600">
                                        <i className="fas fa-info-circle mr-1" />
                                        Note: Uploading new images will replace existing images of that type
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="overflow-y-auto !max-h-[57%]  col-span-2  space-y-6 custom-scrollbar ">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <i className="fas fa-info-circle text-blue-600" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditMode ? (
                                    <>
                                        {/* Product Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="productName">
                                                Product Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="productName"
                                                placeholder="Enter product name"
                                                value={formValues.productName}
                                                onChange={(e) => handleInputChange("productName", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Serial Number */}
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="serialNo">Serial Number</Label>
                                            <Input
                                                id="serialNo"
                                                placeholder="Enter serial number"
                                                value={formValues.serialNo}
                                                onChange={(e) => handleInputChange("serialNo", e.target.value)}
                                            />
                                        </div> */}

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <Label htmlFor="category">
                                                Category <span className="text-red-500">*</span>
                                            </Label>
                                            {/* <Select
                                                value={formValues.category}
                                                onValueChange={(value) => handleInputChange("category", value)}
                                            >
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Choose Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="wardrobe">
                                                        <span className="capitalize">Wardrobe</span>
                                                    </SelectItem>
                                                    <SelectItem value="studyTable">
                                                        <span className="capitalize">Study Table</span>
                                                    </SelectItem>
                                                    <SelectItem value="bed">
                                                        <span className="capitalize">Bed</span>
                                                    </SelectItem>
                                                    <SelectItem value="cabinet">
                                                        <span className="capitalize">Cabinet</span>
                                                    </SelectItem>
                                                    <SelectItem value="shelf">
                                                        <span className="capitalize">Shelf</span>
                                                    </SelectItem>
                                                    <SelectItem value="drawer">
                                                        <span className="capitalize">Drawer</span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select> */}
                                            <Input
                                                id="Category"
                                                placeholder="Enter Category"
                                                value={formValues.category}
                                                onChange={(e) => handleInputChange("category", e.target.value)}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Enter product description"
                                                value={formValues.description}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                    <div>
                                            <p className="text-sm text-gray-500 mb-1">Product Name</p>
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-box text-gray-400" />
                                                <span className="font-medium capitalize">{unit?.productName || "N/A"}</span>
                                            </div>
                                        </div>

                                        {/* View Mode */}
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Category</p>
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-tag text-gray-400" />
                                                <span className="font-medium capitalize">{unit.category || "N/A"}</span>
                                            </div>
                                        </div>

                                        {unit.description && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                                <p className="text-gray-700">{unit.description}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dimensions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <i className="fas fa-ruler-combined text-purple-600" />
                                    Dimensions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditMode ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="height" className="text-xs">Height (mm)</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                min="0"
                                                placeholder="H"
                                                value={formValues.dimention.height || ""}
                                                onChange={(e) => handleDimention("height", e.target.value)}
                                                onKeyDown={preventNegative}
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="width" className="text-xs">Width (mm)</Label>
                                            <Input
                                                id="width"
                                                type="number"
                                                min="0"
                                                placeholder="W"
                                                value={formValues.dimention.width || ""}
                                                onChange={(e) => handleDimention("width", e.target.value)}
                                                onKeyDown={preventNegative}
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="depth" className="text-xs">Depth (mm)</Label>
                                            <Input
                                                id="depth"
                                                type="number"
                                                min="0"
                                                placeholder="D"
                                                value={formValues.dimention.depth || ""}
                                                onChange={(e) => handleDimention("depth", e.target.value)}
                                                onKeyDown={preventNegative}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className=" rounded-lg p-3">
                                        <div className="flex items-center gap-2 font-semibold text-gray-700">

                                            {unit?.dimention && Object.entries(unit.dimention as Record<string, number>)?.map(([key, value], idx) => (
                                                <Fragment key={idx}>
                                                    <span className="flex items-center gap-0.5">
                                                        <span className="text-[16px] text-gray-500">{key[0].toUpperCase() + key.slice(1)}:</span>
                                                        {value || 0}mm
                                                    </span>
                                                    {idx !== Object.keys(unit.dimention)?.length - 1 && <span className="text-[12px] text-gray-500">,</span>}
                                                </Fragment>
                                            )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pricing & Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <i className="fas fa-indian-rupee-sign text-green-600" />
                                    Pricing & Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditMode ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="fabricationCost">
                                                Fabrication Cost (₹) <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="fabricationCost"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Enter fabrication cost"
                                                value={formValues.fabricationCost}
                                                onChange={(e) => handlePositiveNumberChange("fabricationCost", e.target.value)}
                                                onKeyDown={preventNegative}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timeRequired">Time Required (days)</Label>
                                            <Input
                                                id="timeRequired"
                                                type="number"
                                                min="0"
                                                placeholder="Enter time required"
                                                value={formValues.timeRequired}
                                                onChange={(e) => handlePositiveNumberChange("timeRequired", e.target.value)}
                                                onKeyDown={preventNegative}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="totalAreaSqFt">Total Area (sq ft)</Label>
                                            <Input
                                                id="totalAreaSqFt"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Enter total area"
                                                value={formValues.totalAreaSqFt}
                                                onChange={(e) => handlePositiveNumberChange("totalAreaSqFt", e.target.value)}
                                                onKeyDown={preventNegative}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="materialsNeeded">Materials Needed</Label>
                                            <Textarea
                                                id="materialsNeeded"
                                                placeholder="Enter materials needed"
                                                value={formValues.materialsNeeded}
                                                onChange={(e) => handleInputChange("materialsNeeded", e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* View Mode - Fabrication Cost as Primary */}
                                        <div className="flex items-center justify-between py-2 border-b">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <i className="fas fa-hammer" />
                                                Fabrication Cost
                                            </span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ₹{unit.fabricationCost?.toLocaleString() || 0}
                                            </span>
                                        </div>

                                        {unit.timeRequired && (
                                            <div className="flex items-center justify-between py-2 border-b">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <i className="fas fa-clock" />
                                                    Time Required
                                                </span>
                                                <span className="font-semibold">{unit.timeRequired} days</span>
                                            </div>
                                        )}

                                        {unit.totalAreaSqFt && (
                                            <div className="flex items-center justify-between py-2 border-b">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <i className="fas fa-expand" />
                                                    Total Area
                                                </span>
                                                <span className="font-semibold">{unit.totalAreaSqFt} sq ft</span>
                                            </div>
                                        )}

                                        {unit.materialsNeeded && (
                                            <div className="py-2">
                                                <p className="text-sm text-gray-500 mb-1">Materials Needed</p>
                                                <p className="text-gray-700">{unit.materialsNeeded}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Attributes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <i className="fas fa-tags text-orange-600" />
                                    Attributes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditMode ? (
                                    <>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add attribute (e.g., modern, wooden)"
                                                value={attributeInput}
                                                onChange={(e) => setAttributeInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddAttribute();
                                                    }
                                                }}
                                                className="text-sm"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleAddAttribute}
                                                variant="outline"
                                                size="sm"
                                                className="px-3"
                                            >
                                                <i className="fas fa-plus" />
                                            </Button>
                                        </div>

                                        {formValues.attributes.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {formValues.attributes.map((attr, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center gap-1.5"
                                                    >
                                                        {attr}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttribute(index)}
                                                            className="hover:text-red-600 transition-colors"
                                                        >
                                                            <i className="fas fa-times text-[10px]" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {unit.attributes && unit.attributes.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {unit.attributes.map((attr: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center gap-1"
                                                    >
                                                        <i className="fas fa-star text-[10px]" />
                                                        {attr}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No attributes added</p>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <i className="fas fa-calendar text-gray-600" />
                                    Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {unit.createdAt && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <i className="fas fa-calendar-plus" />
                                            Created At
                                        </span>
                                        <span className="font-medium">
                                            {new Date(unit.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}

                                {unit.updatedAt && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <i className="fas fa-calendar-check" />
                                            Updated At
                                        </span>
                                        <span className="font-medium">
                                            {new Date(unit.updatedAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModularUnitSingleNew;