import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { useCreateModularUnitNew, useGetModularUnitByIdNew, useUpdateModularUnitNew } from "../../../apiList/Modular Unit Api/modularUnitNewApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/TextArea";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface ModularUnitFormProps {
    mode: "create" | "edit";
    unitId?: string;
}

export interface ModularFormValues {
    productName: string;
    serialNo: string;
    category: string;
    description: string;
    dimention: {
        height: number;
        width: number;
        depth: number;
    };
    totalAreaSqFt: string;
    materialsNeeded: string;
    fabricationCost: string;
    timeRequired: string;
    attributes: string[];
}

const ModularUnitFormNew = ({ mode, unitId }: ModularUnitFormProps) => {
    const navigate = useNavigate();
    const { organizationId } = useParams<{ organizationId: string }>();

    // Hooks
    const { mutate: createUnit, isPending: isCreating } = useCreateModularUnitNew();
    const { mutateAsync: updateUnit, isPending: isUpdating } = useUpdateModularUnitNew();
    const { data: existingUnit, isLoading: isLoadingUnit } = useGetModularUnitByIdNew(
        mode === "edit" && unitId ? unitId : ""
    );


    
    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.modularunit?.delete;
    // const canList = role === "owner" || permission?.modularunit?.list;
    const canCreate = role === "owner" || permission?.modularunit?.create;
    const canEdit = role === "owner" || permission?.modularunit?.edit;



    const defaultValues = {
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
    }
    // Form State
    const [formValues, setFormValues] = useState<ModularFormValues>(defaultValues);

    // Image States
    const [productImages, setProductImages] = useState<File[]>([]);
    const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);

    const [images2d, setImages2d] = useState<File[]>([]);
    const [images2dPreviews, setImages2dPreviews] = useState<string[]>([]);

    const [images3d, setImages3d] = useState<File[]>([]);
    const [images3dPreviews, setImages3dPreviews] = useState<string[]>([]);

    // Replace image flags (for edit mode)
    const [replaceProductImages, setReplaceProductImages] = useState(false);
    const [replace2dImages, setReplace2dImages] = useState(false);
    const [replace3dImages, setReplace3dImages] = useState(false);

    // Attribute input
    const [attributeInput, setAttributeInput] = useState("");

    // Load existing data in edit mode
    useEffect(() => {
        if (mode === "edit" && existingUnit) {
            setFormValues({
                productName: existingUnit.productName || "",
                serialNo: existingUnit.serialNo || "",
                category: existingUnit.category || "",
                description: existingUnit.description || "",
                dimention: {
                    height: existingUnit.dimention?.height || 0,
                    width: existingUnit.dimention?.width || 0,
                    depth: existingUnit.dimention?.depth || 0,
                },
                totalAreaSqFt: existingUnit.totalAreaSqFt?.toString() || "",
                materialsNeeded: existingUnit.materialsNeeded || "",
                fabricationCost: existingUnit.fabricationCost?.toString() || "",
                timeRequired: existingUnit.timeRequired?.toString() || "",
                attributes: existingUnit.attributes || [],
            });

            if (existingUnit.productImages) {
                setProductImagePreviews(existingUnit.productImages.map((img: any) => img.url));
            }
            if (existingUnit["2dImages"]) {
                setImages2dPreviews(existingUnit["2dImages"].map((img: any) => img.url));
            }
            if (existingUnit["3dImages"]) {
                setImages3dPreviews(existingUnit["3dImages"].map((img: any) => img.url));
            }
        }
    }, [mode, existingUnit]);

    // Handle input change
    const handleInputChange = (field: keyof ModularFormValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleDimention = (field: keyof typeof formValues.dimention, value: number) => {
        setFormValues((p) => ({ ...p, dimention: { ...p.dimention, [field]: value } }));
    };

    // Handle Product Images Upload
    const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setProductImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setProductImagePreviews(previews);
        if (mode === "edit") setReplaceProductImages(true);
    };

    // Handle 2D Images Upload
    const handleImages2dChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages2d(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImages2dPreviews(previews);
        if (mode === "edit") setReplace2dImages(true);
    };

    // Handle 3D Images Upload
    const handleImages3dChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages3d(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImages3dPreviews(previews);
        if (mode === "edit") setReplace3dImages(true);
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

    // Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            dimention: {
                height: formValues.dimention.height || undefined,
                width: formValues.dimention.width || undefined,
                depth: formValues.dimention.depth || undefined,
            },
            totalAreaSqFt: formValues.totalAreaSqFt || undefined,
            fabricationCost: formValues.fabricationCost || undefined,
            timeRequired: formValues.timeRequired || undefined,
        };

        try {
            if (mode === "create") {
                await createUnit({
                    organizationId: organizationId!,
                    formValues: submitData,
                    productImages,
                    images2d,
                    images3d,
                });
                toast({ title: "Success", description: "Product created successfully!" });
                setFormValues(defaultValues)
            } else {
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
            }
            // navigate(-1);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || `Failed to ${mode} product`,
                variant: "destructive",
            });
        }
    };

    // Loading state for edit mode
    if (mode === "edit" && isLoadingUnit) {
        return (
            <div className="flex items-center justify-center h-screen">
                <i className="fas fa-spinner fa-spin text-4xl text-gray-400" />
            </div>
        );
    }

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className="min-h-full bg-gray-50 p-6">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
                            <i className="fas fa-arrow-left" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {mode === "create" ? "Create New Product" : "Edit Product"}
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Images Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <i className="fas fa-images text-blue-600" />
                                Product Images
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Product Images */}
                                <div className="space-y-2">
                                    <Label htmlFor="productImages" className="text-sm font-medium">
                                        <i className="fas fa-image mr-1 text-pink-600" />
                                        Product Images
                                    </Label>
                                    <Input
                                        id="productImages"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleProductImagesChange}
                                        className="cursor-pointer text-xs"
                                    />
                                    {productImagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {productImagePreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square rounded overflow-hidden border">
                                                    <img src={preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 2D Images */}
                                <div className="space-y-2">
                                    <Label htmlFor="images2d" className="text-sm font-medium">
                                        <i className="fas fa-draw-polygon mr-1 text-cyan-600" />
                                        2D Images
                                    </Label>
                                    <Input
                                        id="images2d"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImages2dChange}
                                        className="cursor-pointer text-xs"
                                    />
                                    {images2dPreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {images2dPreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square rounded overflow-hidden border border-cyan-200">
                                                    <img src={preview} alt={`2D ${index + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 3D Images */}
                                <div className="space-y-2">
                                    <Label htmlFor="images3d" className="text-sm font-medium">
                                        <i className="fas fa-cube mr-1 text-indigo-600" />
                                        3D Images
                                    </Label>
                                    <Input
                                        id="images3d"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImages3dChange}
                                        className="cursor-pointer text-xs"
                                    />
                                    {images3dPreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {images3dPreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square rounded overflow-hidden border border-indigo-200">
                                                    <img src={preview} alt={`3D ${index + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details & Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <i className="fas fa-info-circle text-blue-600" />
                                Product Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Row 1: Product Name & Fabrication Cost */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="fabricationCost">
                                        Fabrication Cost (₹) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fabricationCost"
                                        type="number"
                                        placeholder="Enter fabrication cost"
                                        value={formValues.fabricationCost}
                                        onChange={(e) => handleInputChange("fabricationCost", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2: Category & Serial Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <SelectItem value="wardrobe">Wardrobe</SelectItem>
                                            <SelectItem value="studyTable">Study Table</SelectItem>
                                            <SelectItem value="bed">Bed</SelectItem>
                                            <SelectItem value="cabinet">Cabinet</SelectItem>
                                            <SelectItem value="shelf">Shelf</SelectItem>
                                            <SelectItem value="drawer">Drawer</SelectItem>
                                        </SelectContent>
                                    </Select> */}
                                    <Input
                                        id="Category"
                                        placeholder="Enter Category"
                                        value={formValues.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                    />
                                </div>

                                {/* <div className="space-y-2">
                                    <Label htmlFor="serialNo">Serial Number</Label>
                                    <Input
                                        id="serialNo"
                                        placeholder="Enter serial number"
                                        value={formValues.serialNo}
                                        onChange={(e) => handleInputChange("serialNo", e.target.value)}
                                    />
                                </div> */}
                            </div>

                            {/* Row 3: Dimensions */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <i className="fas fa-ruler-combined text-purple-600" />
                                    Dimensions (mm)
                                </Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="height" className="text-xs text-gray-600">
                                            Height
                                        </Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            placeholder="H"
                                            value={formValues.dimention.height || ""}
                                            onChange={(e) => handleDimention("height", +e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="width" className="text-xs text-gray-600">
                                            Width
                                        </Label>
                                        <Input
                                            id="width"
                                            type="number"
                                            placeholder="W"
                                            value={formValues.dimention.width || ""}
                                            onChange={(e) => handleDimention("width", +e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="depth" className="text-xs text-gray-600">
                                            Depth
                                        </Label>
                                        <Input
                                            id="depth"
                                            type="number"
                                            placeholder="D"
                                            value={formValues.dimention.depth || ""}
                                            onChange={(e) => handleDimention("depth", +e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 4: Time Required & Total Area */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timeRequired">Time Required (days)</Label>
                                    <Input
                                        id="timeRequired"
                                        type="number"
                                        placeholder="Enter time required"
                                        value={formValues.timeRequired}
                                        onChange={(e) => handleInputChange("timeRequired", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="totalAreaSqFt">Total Area (sq ft)</Label>
                                    <Input
                                        id="totalAreaSqFt"
                                        type="number"
                                        placeholder="Enter total area"
                                        value={formValues.totalAreaSqFt}
                                        onChange={(e) => handleInputChange("totalAreaSqFt", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Row 5: Materials Needed */}
                            <div className="space-y-2">
                                <Label htmlFor="materialsNeeded">Materials Needed</Label>
                                <Textarea
                                    id="materialsNeeded"
                                    placeholder="Enter materials needed"
                                    value={formValues.materialsNeeded}
                                    onChange={(e) => handleInputChange("materialsNeeded", e.target.value)}
                                    rows={2}
                                    className="text-sm"
                                />
                            </div>

                            {/* Row 6: Attributes */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <i className="fas fa-tags text-orange-600" />
                                    Attributes
                                </Label>
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
                                        className="text-sm flex-1"
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

                                {/* Attributes Display */}
                                {formValues.attributes.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
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
                            </div>

                            {/* Row 7: Description (Last) */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter product description"
                                    value={formValues.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    rows={3}
                                    className="text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                  {(canCreate || canEdit) &&  <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-white p-4  rounded-lg shadow-lg">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                        >
                            <i className="fas fa-times mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting} className="min-w-[150px]">
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2" />
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                </>
                            ) : (
                                <>
                                    <i className={`fas ${mode === "create" ? "fa-plus" : "fa-save"} mr-2`} />
                                    {mode === "create" ? "Create Product" : "Update Product"}
                                </>
                            )}
                        </Button>
                    </div>}
                </form>
            </div>
        </div>
    );
};

export default ModularUnitFormNew;