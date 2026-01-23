import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import {
    // useGeneratePdfModularUnitNew,
    useGetModularUnitByIdNew,
    useUpdateModularUnitNew,
} from "../../../apiList/Modular Unit Api/modularUnitNewApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/TextArea";
import type { ModularFormValues } from "./ModularUnitFormNew";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import { downloadImage } from "../../../utils/downloadFile";

const ModularUnitSingleNew = () => {
    const navigate = useNavigate();
    const { unitId } = useParams<{ unitId: string }>();

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);

    // Image Gallery States
    const [selectedImageType, setSelectedImageType] = useState<"product" | "2d" | "3d">("product");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Hooks
    const { data: unit, isLoading } = useGetModularUnitByIdNew(unitId!)
    const { mutateAsync: updateUnit, isPending: isUpdating } = useUpdateModularUnitNew();
    // const { mutateAsync: generatePdf, isPending: isgenerating } = useGeneratePdfModularUnitNew();

    // 1. Define the dynamic headers state
    const [columns, setColumns] = useState([
        { key: "no", label: "No" },
        { key: "partCode", label: "Part Code" },
        { key: "partName", label: "Part Name" },
        { key: "l", label: "L" },
        { key: "w", label: "W" },
        { key: "t", label: "T" },
        { key: "coreMaterial", label: "Core Material" },
        { key: "externalFinish", label: "External Finish" },
        { key: "internalFinish", label: "Internal Finish" },
        { key: "grain", label: "Grain" }
    ]);


    // Form State
    const [formValues, setFormValues] = useState<ModularFormValues>({
        // productName: "",
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
        parts: []
    });




    // Image States
    const [productImages, setProductImages] = useState<File[]>([]);
    const [images2d, setImages2d] = useState<File[]>([]);
    const [images3d, setImages3d] = useState<File[]>([]);

    const [cutlistDoc, setCutlistDoc] = useState<File[]>([]);


    const [replaceProductImages, setReplaceProductImages] = useState(false);
    const [replace2dImages, setReplace2dImages] = useState(false);
    const [replace3dImages, setReplace3dImages] = useState(false);
    const [replaceCutlistDoc, setReplaceCutlistDoc] = useState(false);


    // Attribute input
    const [attributeInput, setAttributeInput] = useState("");

    // Load unit data
    useEffect(() => {
        if (unit) {
            setFormValues({
                // productName: unit.productName || "",
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
                parts: unit.parts || [],
            });
        }
    }, [unit]);

    useEffect(() => {
        if (unit && unit.parts && unit.parts.length > 0) {
            // Find all keys from the first part object
            const firstPart = unit.parts[0];
            const keys = Object.keys(firstPart).filter(k => k !== '_id');

            const loadedColumns = keys.map(k => ({
                key: k,
                label: k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ')
            }));

            // Ensure "no" is always at the start
            if (!loadedColumns.find(c => c.key === 'no')) {
                loadedColumns.unshift({ key: "no", label: "No" });
            }
            setColumns(loadedColumns);
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
        setReplaceProductImages(false);
    };

    // Handle 2D Images Upload
    const handleImages2dChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages2d(files);
        setReplace2dImages(false);
    };

    // Handle 3D Images Upload
    const handleImages3dChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages3d(files);
        setReplace3dImages(false);
    };



    const handleCutListDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setCutlistDoc(files);
        setReplaceCutlistDoc(false);
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

    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.modularunit?.delete;
    // const canList = role === "owner" || permission?.modularunit?.list;
    // const canCreate = role === "owner" || permission?.modularunit?.create;
    const canEdit = role === "owner" || permission?.modularunit?.edit;


    // Toggle Edit Mode
    const handleToggleEditMode = () => {
        if (isEditMode) {
            // Cancel edit - reset form
            if (unit) {
                setFormValues({
                    // productName: unit.productName || "",
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
                    parts: unit.parts || []
                });
            }
            setProductImages([]);
            setImages2d([]);
            setImages3d([]);
            setCutlistDoc([]);
            setReplaceProductImages(false);
            setReplace2dImages(false);
            setReplace3dImages(false);
            setReplaceCutlistDoc(false)

            // Logic: If we are ENTERING edit mode and there are no parts
            if (isEditMode && formValues.parts.length === 0) {
                setFormValues(prev => ({
                    ...prev,
                    parts: [{
                        no: 1,
                        partCode: "",
                        partName: "",
                        l: 0,
                        w: 0,
                        d: 0,
                        coreMaterial: "",
                        externalFinish: "",
                        internalFinish: "",
                        grain: ""
                    }]
                }));
            }


        }
        setIsEditMode(!isEditMode);
    };

    // Save Changes
    const handleSaveChanges = async () => {
        // Validation
        // if (!formValues.productName.trim()) {
        //     toast({ title: "Error", description: "Product name is required", variant: "destructive" });
        //     return;
        // }

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
            parts: JSON.stringify(formValues.parts), // Add this line

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
                replaceCutlistDoc,
                cutlistDoc
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




    // Save Changes
    // const handleGeneratePdf = async () => {
    //     try {
    //         await generatePdf({
    //             unitId: unitId!,
    //         });
    //         toast({ title: "Success", description: "Pdf Generated successfully!" });
    //     } catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.response?.data?.message || "Failed to generate pdf",
    //             variant: "destructive",
    //         });
    //     }
    // };




    const addPartRow = () => {
        setFormValues((prev) => ({
            ...prev,
            parts: [...prev.parts, {
                no: prev.parts.length + 1, partCode: "", partName: "",
                l: 0, w: 0, t: 0, coreMaterial: "", externalFinish: "",
                internalFinish: "", grain: ""
            }]
        }));
    };


    const removePartRow = (index: number) => {
        setFormValues((prev) => ({
            ...prev,
            parts: prev.parts.filter((_, i) => i !== index)
        }));
    };


    const addFieldGlobally = () => {
        const label = prompt("Enter new field name (e.g., Edge Banding):");
        if (!label) return;
        const key = label.toLowerCase().replace(/\s+/g, '_');

        // Add header
        setColumns(prev => [...prev, { key, label }]);

        // Add empty key to all existing rows in data
        setFormValues(prev => ({
            ...prev,
            parts: prev.parts.map(part => ({ ...part, [key]: "" }))
        }));
    };

    const removeFieldGlobally = (keyToRemove: string) => {
        if (keyToRemove === 'no') return; // Don't allow deleting the index

        // Remove header
        setColumns(prev => prev.filter(col => col.key !== keyToRemove));

        // Delete property from all objects in parts array
        setFormValues(prev => ({
            ...prev,
            parts: prev.parts.map(part => {
                const updatedPart = { ...part };
                delete updatedPart[keyToRemove];
                return updatedPart;
            })
        }));
    };



    const handlePartChange = (index: number, key: string, value: any) => {
        setFormValues((prev) => {
            const updatedParts = [...prev.parts];
            updatedParts[index] = { ...updatedParts[index], [key]: value };
            return { ...prev, parts: updatedParts };
        });
    };





    const handleDownloadPdf = async (file: any) => {
        try {

            await downloadImage({ src: file?.url, alt: file.originalName })
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
        // <div className="h-full max-h-full overflow-hidden bg-gray-50">
        <main className="max-h-full overflow-y-auto flex flex-col  bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
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
                                {unit.category || "Untitled category"}
                            </h1>
                            {unit.serialNo && (
                                <p className="text-sm text-gray-500 font-semibold">Unit No: <span className="text-gray-900">{unit.serialNo}</span></p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {(!isEditMode && canEdit) && (
                            <Button
                                onClick={handleToggleEditMode}
                                className="flex items-center gap-2"
                            >
                                <i className="fas fa-edit" />
                                Edit
                            </Button>
                        )}



                        {/* <Button
                            onClick={handleGeneratePdf}
                            isLoading={isgenerating}
                            className="min-w-[120px]"
                        >
                            Generate Pdf
                        </Button> */}

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
            </header>

            <section className="flex-1  custom-scrollbar p-3">
                <div className="max-w-full !max-h-full  mx-auto p-3">
                    <div className="grid grid-cols-1  lg:grid-cols-4 gap-6">
                        {/* Left Column - Image Gallery */}
                        <section className={`lg:col-span-2 h-[calc(100vh-${isEditMode ? "90px" : "40px"})] overflow-y-auto space-y-6 custom-scrollbar`}>
                            {/* Main Image Display */}
                            <Card>
                                <CardContent className="!p-2">
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
                                        <div className="p-4 border-t">
                                            <div className="grid grid-cols-3 gap-1 h-full max-h-[150px] overflow-y-auto ">
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
                        </section>

                        {/* Right Column - Product Details */}
                        <section className="overflow-y-auto !max-h-[100%] h-[calc(100vh-120px)]  col-span-2  space-y-6 custom-scrollbar ">
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
                                            {/* <div className="space-y-2">
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
                                            </div> */}

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
                                        <section className="flex gap-2  justify-between">
                                            {/* <div>
                                                <p className="text-sm text-gray-500 mb-1">Product Name</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-box text-gray-400" />
                                                    <span className="font-medium capitalize">{unit?.productName || "N/A"}</span>
                                                </div>
                                            </div> */}

                                            {/* View Mode */}
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Category</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-tag text-blue-600" />
                                                    <span className="font-medium capitalize">{unit.category || "N/A"}</span>
                                                </div>
                                            </div>


                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Fabrication Cost</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-hammer text-blue-600" />
                                                    <span className="font-medium capitalize">{unit.fabricationCost?.toLocaleString() || 0}</span>
                                                </div>
                                            </div>


                                            {unit.timeRequired && (<div>
                                                <p className="text-sm text-gray-500 mb-1">Time Required</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-clock text-blue-600" />
                                                    <span className="font-medium capitalize">{unit.timeRequired} days</span>
                                                </div>
                                            </div>
                                            )}

                                            {unit.serialNo && (<div>
                                                <p className="text-sm text-gray-500 mb-1">Unit No:</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-barcode text-blue-600" />
                                                    <span className="font-medium capitalize">{unit.serialNo}</span>
                                                </div>
                                            </div>
                                            )}





                                            {unit.description && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Description</p>
                                                    <p className="text-gray-700">{unit.description}</p>
                                                </div>
                                            )}
                                        </section>
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
                                                            {" "}
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
                                        <i className="fas fa-expand text-blue-600" />
                                        Area & Materials
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {isEditMode ? (
                                        <>

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


                                            <div className="py-2 flex gap-2">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <i className="fas fa-expand" />
                                                    Total Area:
                                                </span>
                                                <span className="font-semibold">{unit.totalAreaSqFt || "N/A"} sq ft</span>
                                            </div>


                                            {/* <div className="py-2">
                                                    <p className="text-sm text-gray-500 mb-1">Total Area: </p>
                                                    <p className="text-gray-700">{unit.materialsNeeded || "N/A"}</p>
                                                </div> */}


                                            <div className="py-2">
                                                <p className="text-sm text-gray-500 mb-1">Materials Needed: </p>
                                                <p className="text-gray-700">{unit.materialsNeeded || "N/A"}</p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>


                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <i className="fas fa-calendar text-gray-600" />
                                        CutList Doc
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-3">

                                    {isEditMode ? (
                                        <>
                                            <div className="">
                                                <Input
                                                    id="cutlistdoc"
                                                    type="file"
                                                    accept="pdf/*"
                                                    multiple
                                                    onChange={handleCutListDocChange}
                                                    className="cursor-pointer text-xs"
                                                />
                                                {cutlistDoc.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        {cutlistDoc.map((file, i) => (
                                                            <p key={i} className="text-xs text-gray-500 truncate">
                                                                <i className="far fa-file-pdf mr-1 text-red-500" />
                                                                {file.name}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>


                                        </>
                                    ) : (
                                        <>
                                            {unit.cutlistDoc && unit.cutlistDoc.length > 0 ? (
                                                <div className="mt-2 space-y-2">
                                                    {unit.cutlistDoc.map((file: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100 group">
                                                            <div className="flex items-center gap-2 flex-1 truncate">
                                                                <i className="far fa-file-pdf text-red-500 text-sm" />
                                                                <span className="text-xs font-medium text-gray-700 truncate">
                                                                    {file.originalName || `Document ${i + 1}`}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-3 ml-4">
                                                                {/* VIEW OPTION: Opens in a new tab */}
                                                                <a
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-700 bg-blue-100 px-3 py-2 rounded-2xl hover:text-blue-800 text-[14px] font-semibold flex items-center gap-1 transition-colors"
                                                                >
                                                                    <i className="fas fa-eye" />
                                                                    View
                                                                </a>

                                                                {/* DOWNLOAD OPTION: Triggers download */}
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={() => handleDownloadPdf(file)}
                                                                    className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                                >
                                                                    Download PDF
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">No documents uploaded</p>
                                            )}
                                        </>
                                    )
                                    }
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








                        </section>
                    </div>
                </div>
            </section>



            {/* Row 2: Full Width Parts Table Section */}
            <section className="w-full">
                <Card className="shadow-sm border-none">
                    <CardHeader className="flex flex-row items-center justify-between bg-white border-b">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-th-list text-blue-600" />
                            Cutlist Details
                        </CardTitle>
                        {isEditMode && (
                            <div className="flex gap-2">
                                <Button type="button" size="sm" variant="outline" onClick={addFieldGlobally}>
                                    <i className="fas fa-columns mr-1" /> Add Field
                                </Button>
                                <Button type="button" size="sm" onClick={addPartRow}>
                                    <i className="fas fa-plus mr-1" /> Add Row
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table
                            // className="w-full text-left border-collapse min-w-[1200px]">
                            className="w-full table-fixed text-left border-collapse min-w-[1200px]">

                            <thead
                                //  className="bg-gray-50 text-[11px] uppercase text-gray-600">
                                className="bg-gray-50 text-[10px] uppercase text-gray-600">

                                <tr>
                                    {columns.map((col, index) => (
                                        <th key={col.key}
                                            //  className="p-3 border font-semibold relative group"
                                            // className="p-2 border-b border-r bg-blue-50 border-blue-100 text-[11px] font-bold uppercase tracking-wider text-blue-700 relative group"
                                            className={`
                                                bg-blue-50
          p-3 border-b border-r border-blue-200 text-[11px] font-bold uppercase tracking-wider text-blue-700 relative group
          ${index === 0 ? "rounded-tl-xl" : ""} 
          ${!isEditMode && index === columns.length - 1 ? "rounded-tr-xl" : ""}
        `}


                                        >
                                            <div className="flex items-center justify-between">
                                                {col.label}
                                                {isEditMode && col.key !== 'no' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFieldGlobally(col.key)}
                                                        className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <i className="fas fa-times-circle" />
                                                    </button>
                                                )}
                                            </div>

                                        </th>
                                    ))}
                                    {isEditMode && <th
                                        // className="p-3 border text-center"
                                        className="p-2 border-b border-blue-100 text-[11px] font-bold uppercase tracking-wider text-blue-700 text-center bg-blue-50"
                                    >Action</th>}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {formValues?.parts?.length > 0 ? (<>
                                    {formValues.parts.map((part, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            //  className="hover:bg-blue-50/20 transition-colors border-b"
                                            className="hover:bg-blue-50/40 transition-colors group"

                                        >
                                            {columns.map((col) => (
                                                <td key={col.key} className="p-0 border border-r border-blue-200">
                                                    {col.key === 'no' ? (
                                                        <div className="text-center font-medium text-gray-500 py-3 bg-gray-50/30">
                                                            {rowIndex + 1}
                                                        </div>
                                                    ) : (

                                                        <div className="relative min-h-[45px] flex items-center">
                                                            {isEditMode ? (
                                                                /* EDIT MODE: Standard Input */
                                                                <input
                                                                    type={['l', 'w', 't'].includes(col.key) ? "number" : "text"}
                                                                    value={part[col.key] ?? ""}
                                                                    onChange={(e) => handlePartChange(rowIndex, col.key, e.target.value)}
                                                                    className="w-full p-3 bg-transparent outline-none transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500 cursor-text text-slate-700"
                                                                />
                                                            ) : (
                                                                /* VIEW MODE: Wrap-enabled Div */
                                                                // <div className="w-full p-3 text-slate-700 font-medium text-xs leading-relaxed break-words whitespace-normal min-w-[80px]">
                                                                //     {part[col.key] || "-"}
                                                                // </div>

                                                                <div className="w-full p-3 text-slate-700 font-medium text-xs leading-relaxed break-words whitespace-normal overflow-hidden">
                                                                    {part[col.key] || "-"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            {isEditMode && (
                                                <td className="p-1 border border-blue-200 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removePartRow(rowIndex)}
                                                        // className="text-gray-400 hover:text-red-500"
                                                        className="p-2  cursor-pointer text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"

                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </>) :
                                    <>
                                        <tr className="hover:bg-blue-50/20 transition-colors border !border-blue-50">
                                            <td
                                                /* Ensure colSpan accounts for the Action column if editing */
                                                colSpan={isEditMode ? columns.length + 1 : columns.length}
                                                className="py-12 text-center align-middle border-b border-l border-r border-blue-200"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <i className="fas fa-file-circle-exclamation text-blue-200 text-2xl" />
                                                    <p className="text-slate-400 font-medium italic">
                                                        No cutlist provided
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
};

export default ModularUnitSingleNew;