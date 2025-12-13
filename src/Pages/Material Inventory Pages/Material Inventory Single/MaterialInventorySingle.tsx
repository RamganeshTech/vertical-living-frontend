import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../../components/ui/Card";
// import { Input } from "../../../components/ui/Input";
// import { Label } from "../../../components/ui/Label";
// import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { useGetMaterialInventoryById, useUpdateMaterialInventory } from "../../../apiList/MaterialInventory Api/materialInventoryApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import SearchSelectNew from "../../../components/ui/SearchSelectNew";
import { useGetProjects } from "../../../apiList/projectApi";
import type { AvailableProjetType } from "../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useAddToCart, useGetCart, useRemoveCartItem, useUpdateCartItemQuantity } from "../../../apiList/MaterialInventory Api/MaterialInventoryCartApi";
import MaterialInventSingleHeader from "./MaterialInventSingleHeader";
// import { NO_IMAGE } from "../../../constants/constants";
import MaterialInventSingleMainCompo from "./MaterialInventSingleMainCompo";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

export type Variant = {
    color: string;
    itemCode: string;
    mrp: number;
    image: string;
};

export type MaterialSpecification = {
    itemCode?: string;
    category?: string;
    series?: string;
    subcategory?: string;
    description?: string;
    watt?: string | number;
    image?: string;
    cct?: string;
    mrp?: string | number;
    model?: string;
    brand?: string;
    HSN?: string;
    styleType?: string;
    type?: string;
    materialType?: string;
    variants?: Variant[];
};

type StringLikeKeys<T> = {
    [K in keyof T]: T[K] extends string | number | undefined ? K : never
}[keyof T];


export type EditableFieldKey = StringLikeKeys<MaterialSpecification>;


const MaterialInventorySingle: React.FC = () => {
    const { organizationId, id } = useParams() as { organizationId: string, id: string }

    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<MaterialSpecification>({});
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const { data, isLoading, error: queryError, isError } = useGetMaterialInventoryById(id);
    const { data: cartData, refetch: refetchCart } = useGetCart({
        organizationId,
        projectId: selectedProjectId
    });

    const updateMutation = useUpdateMaterialInventory();

    const addToCartMutation = useAddToCart();
    const updateCartQuantityMutation = useUpdateCartItemQuantity();
    const removeFromCartMutation = useRemoveCartItem();

    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.productinventory?.delete;
    // const canCreate = role === "owner" || permission?.productinventory?.create;
    const canList = role === "owner" || permission?.productinventory?.list;





    // Initialize form with data when data loads
    useEffect(() => {
        if (data?.specification) {
            setForm(data?.specification);
            // If product has variants, select the first one by default
            if (data?.specification?.variants && data?.specification?.variants.length > 0) {
                setSelectedVariant(data.specification.variants[0]);
            }
        }
    }, [data]);



    const { data: projectsData } = useGetProjects(organizationId);
    const projects = projectsData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));

    const projectOptions = useMemo(() => (projectsData || [])?.map((project: AvailableProjetType) => ({
        value: project._id,
        label: project.projectName
    }))
        , [projectsData])

    // Auto-select first project if available
    useEffect(() => {
        if (projects && projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0]._id);
        }
    }, [projects, selectedProjectId]);

    // Initialize form with data when data loads
    useEffect(() => {
        if (data?.specification) {
            setForm(data?.specification);
            // If product has variants, select the first one by default
            if (data?.specification?.variants && data?.specification?.variants.length > 0) {
                setSelectedVariant(data.specification.variants[0]);
            }
        }
    }, [data]);


    const handleEdit = useCallback(() => {
        setEditMode(true);
        if (data?.specification) {
            setForm({ ...data.specification });
        }
    }, [data])

    const handleCancel = useCallback(() => {
        setEditMode(false);
        if (data?.specification) {
            setForm({ ...data.specification });
        }
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectProjectId = useCallback((value: string) => {
        setSelectedProjectId(value || "")
    }, [])


    const handleSave = useCallback(async () => {
        try {
        if (!id || !form) return;

            // console.log("form after updateion", form)
            await updateMutation.mutateAsync({ id, specification: form });
            toast({
                title: "✓ Updated",
                description: "Material inventory updated successfully",
                variant: "default"
            });
            setEditMode(false);
            refetchCart()
        } catch (e: any) {
            toast({
                title: "Error",
                description: e?.response?.data?.message || e?.message || "something has went wrong",
                variant: "destructive"
            });
        }
    }, [id, form, updateMutation, refetchCart])

    const handleVariantSelect = (variant: Variant) => {
        setSelectedVariant(variant);
    };

    // Function to get current display values based on variant selection
    const getDisplayValues = () => {
        if (selectedVariant) {
            return {
                image: selectedVariant.image,
                mrp: selectedVariant.mrp,
                itemCode: selectedVariant.itemCode,
                color: selectedVariant.color
            };
        }
        return {
            image: form?.image,
            mrp: form?.mrp,
            itemCode: form?.itemCode,
            color: null
        };
    };

    // started 
    // // Helper function to get cart item for current product/variant
    // const getCartItem = () => {
    //     if (!cartData?.items) return null;
    //     return cartData.items.find((item: any) => {
    //         if (item.productId === id) {
    //             if (selectedVariant && item.specification?.selectedVariant) {
    //                 return item.specification.selectedVariant.itemCode === selectedVariant.itemCode;
    //             }
    //             return !item.specification?.selectedVariant;
    //         }
    //         return false;
    //     });
    // };

    // // Helper function to get cart item quantity
    // const getCartItemQuantity = (): number => {
    //     const cartItem = getCartItem();
    //     return cartItem ? cartItem.quantity : 0;
    // };


    // // Add to Cart Handler
    // const handleAddToCart = async () => {
    //     if (!selectedProjectId) {
    //         toast({
    //             title: "Error",
    //             description: "Please select a project first",
    //             variant: "destructive"
    //         });
    //         return;
    //     }

    //     // const displayValues = getDisplayValues();
    //     const specification = {
    //         ...form,
    //         selectedVariant: selectedVariant ? {
    //             color: selectedVariant.color,
    //             itemCode: selectedVariant.itemCode,
    //             mrp: selectedVariant.mrp,
    //             image: selectedVariant.image
    //         } : null
    //     };

    //     try {
    //         await addToCartMutation.mutateAsync({
    //             organizationId,
    //             projectId: selectedProjectId,
    //             productId: id,
    //             quantity: 1,
    //             specification
    //         });
    //         toast({
    //             title: "Success",
    //             description: `${form.description} ${selectedVariant ? `(${selectedVariant.color})` : ''} added to cart`
    //         });
    //         refetchCart();
    //     } catch (e: any) {
    //         toast({
    //             title: "Error",
    //             description: e?.response?.data?.message || "Failed to add item to cart",
    //             variant: "destructive"
    //         });
    //     }
    // };


    // const handleUpdateCartQuantity = async (newQuantity: number) => {
    //     if (!cartData?._id) return;

    //     // Find the specific cart item for this product/variant combination

    //     const cartItem = getCartItem();

    //     if (!cartItem) return;

    //     // If quantity becomes 0, remove the item
    //     if (newQuantity === 0) {
    //         try {
    //             await removeFromCartMutation.mutateAsync({
    //                 cartId: cartData._id,
    //                 productId: id,
    //                 variantItemCode: selectedVariant?.itemCode
    //             });
    //             toast({
    //                 title: "Success",
    //                 description: "Item removed from cart"
    //             });
    //             refetchCart();
    //         } catch (e: any) {
    //             toast({
    //                 title: "Error",
    //                 description: e?.response?.data?.message || "Failed to remove item from cart",
    //                 variant: "destructive"
    //             });
    //         }
    //         return;
    //     }

    //     try {
    //         await updateCartQuantityMutation.mutateAsync({
    //             cartId: cartData._id,
    //             productId: selectedProjectId,
    //             quantity: 1,
    //             variantItemCode: selectedVariant?.itemCode
    //         })
    //         refetchCart();
    //     } catch (e: any) {
    //         toast({
    //             title: "Error",
    //             description: e?.response?.data?.message || "Failed to add item to cart",
    //             variant: "destructive"
    //         });
    //     }
    // };


    // // Remove from Cart Handler
    // const handleRemoveFromCart = async () => {
    //     if (!cartData?._id) return;

    //     try {
    //         await removeFromCartMutation.mutateAsync({
    //             cartId: cartData._id,
    //             productId: id,
    //             variantItemCode: selectedVariant?.itemCode
    //         });

    //         toast({
    //             title: "Success",
    //             description: "Item removed from cart",
    //             variant: "default"
    //         });

    //         await refetchCart();
    //     } catch (e: any) {
    //         toast({
    //             title: "Error",
    //             description: e?.response?.data?.message || "Failed to remove item from cart",
    //             variant: "destructive"
    //         });
    //     }
    // };

    // ended



    // Get current itemCode (from variant or base product)
    const getCurrentItemCode = (): string => {
        if (selectedVariant) {
            return selectedVariant.itemCode;
        }
        return form?.itemCode || "";
    };

    // Helper function to get cart item by itemCode
    const getCartItemByItemCode = (itemCode: string) => {
        if (!cartData?.items || !itemCode) return null;
        return cartData.items.find((item: any) => item?.specification?.itemCode === itemCode);
    };

    // Helper function to get cart item quantity by itemCode
    const getCartItemQuantity = (): number => {
        const itemCode = getCurrentItemCode();
        const cartItem = getCartItemByItemCode(itemCode);
        return cartItem ? cartItem?.quantity : 0;
    };

    //  const getCartItemQuantity = (productId: string): number => {
    //     if (!cartData?.items) return 0;
    //     const cartItem = cartData.items.find((item: any) => item.productId === productId);
    //     return cartItem ? cartItem.quantity : 0;
    // };

    // Build specification for cart (with variant data if applicable)
    const buildCartSpecification = () => {
        const baseSpec = {
            ...form,
            // Remove variants array from specification sent to cart
            variants: undefined
        };

        if (selectedVariant) {
            // If variant is selected, override with variant-specific data
            return {
                ...baseSpec,
                itemCode: selectedVariant.itemCode,
                mrp: selectedVariant.mrp,
                color: selectedVariant.color,
                image: selectedVariant.image,
            };
        }

        return baseSpec;
    };

    // Add to Cart Handler
    const handleAddToCart = async () => {
        if (!selectedProjectId) {
            toast({
                title: "Error",
                description: "Please select a project first",
                variant: "destructive"
            });
            return;
        }

        const specification = buildCartSpecification();

        try {
            await addToCartMutation.mutateAsync({
                organizationId,
                projectId: selectedProjectId,
                productId: id,
                quantity: 1,
                specification
            });

            toast({
                title: "Success",
                description: `Added to cart`
            });
            refetchCart();
        } catch (e: any) {
            toast({
                title: "Error",
                description: e?.response?.data?.message || "Failed to add item to cart",
                variant: "destructive"
            });
        }
    };

    // Update Cart Quantity Handler
    const handleUpdateCartQuantity = async (increment: number) => {
        if (!cartData?._id) return;

        const itemCode = getCurrentItemCode();
        const cartItem = getCartItemByItemCode(itemCode);

        if (!cartItem) return;

        const newQuantity = cartItem.quantity + increment;

        // If quantity becomes 0 or less, remove the item
        if (newQuantity <= 0) {
            handleRemoveFromCart();
            return;
        }

        try {
            await updateCartQuantityMutation.mutateAsync({
                cartId: cartData._id,
                itemCode: itemCode,
                quantity: newQuantity
            });

            toast({
                title: "Success",
                description: "Cart updated successfully"
            });
            refetchCart();
        } catch (e: any) {
            toast({
                title: "Error",
                description: e?.response?.data?.message || "Failed to update cart",
                variant: "destructive"
            });
        }
    };

    // Remove from Cart Handler
    const handleRemoveFromCart = async () => {
        if (!cartData?._id) return;

        const itemCode = getCurrentItemCode();

        try {
            await removeFromCartMutation.mutateAsync({
                cartId: cartData._id,
                itemCode: itemCode
            });

            toast({
                title: "Success",
                description: "Item removed from cart",
                variant: "default"
            });

            await refetchCart();
        } catch (e: any) {
            toast({
                title: "Error",
                description: e?.response?.data?.message || "Failed to remove item from cart",
                variant: "destructive"
            });
        }
    };

    const displayValues = getDisplayValues();
    const hasVariants = form?.variants && form?.variants?.length > 0;
    const cartQuantity = getCartItemQuantity();
    const isInCart = cartQuantity > 0;


    // Loading fallback
    if (isLoading) return <MaterialOverviewLoading />;

    if (isError || error || queryError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-white p-6 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-6 shadow-lg max-w-xl w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold">Error Loading Data</h3>
                                <p className="text-sm text-red-600">{error || queryError?.message || "Failed to load data"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-700 transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-white flex items-center justify-center">
                <div className="text-center text-gray-400 py-12">
                    <i className="fas fa-box-open text-6xl mb-4"></i>
                    <p className="text-xl">No data found</p>
                </div>
            </div>
        );
    }

    // Define editable fields based on category
    const getEditableFields = () => {
        const baseFields = [
            { key: "brand", label: "Brand", icon: "fa-trademark", type: "text" },
            { key: "category", label: "Category", icon: "fa-tag", type: "text" },
            { key: "description", label: "Description", icon: "fa-align-left", type: "text" },
        ];

        if (form?.category === "light") {
            return [
                ...baseFields,
                { key: "mrp", label: "MRP", icon: "fa-indian-rupee-sign", type: "number" },
                { key: "subcategory", label: "Sub Category", icon: "fa-tags", type: "text" },
                { key: "model", label: "Model", icon: "fa-cube", type: "text" },
                { key: "watt", label: "Watt", icon: "fa-bolt", type: "number" },
                { key: "itemCode", label: "Item Code", icon: "fa-barcode", type: "text" },
                { key: "cct", label: "CCT", icon: "fa-lightbulb", type: "text" },
                { key: "series", label: "Series", icon: "fa-layer-group", type: "text" },
            ];
        } else {
            return [
                ...baseFields,
                { key: "HSN", label: "HSN", icon: "fa-hashtag", type: "text" },
                { key: "styleType", label: "Style Type", icon: "fa-palette", type: "text" },
                { key: "type", label: "Type", icon: "fa-shapes", type: "text" },
                { key: "materialType", label: "Material Type", icon: "fa-cubes", type: "text" },
            ];
        }
    };

    const editableFields = getEditableFields();


    if(!canList){
        return
    }

    return (
        <div className="max-h-full min-h-full overflow-y-auto bg-gradient-to-br from-violet-50 via-blue-50 to-white p-4">
            <div className="max-w-full mx-auto">
                {/* <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <div onClick={() => navigate(-1)}
                            className='bg-white hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                            <i className='fas fa-arrow-left'></i>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                                {data?.specification?.subcategory || data?.specification?.type || "Material Details"}
                            </h1>
                            <p className="text-gray-600 mt-2">View and manage material inventory information</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {!editMode ? (
                            <div className="flex gap-3">

                                <div className="w-full sm:w-64">
                                    <SearchSelectNew
                                        options={projectOptions}
                                        placeholder="Select project"
                                        searchPlaceholder="Search projects..."
                                        value={selectedProjectId || undefined}
                                        onValueChange={(value) => setSelectedProjectId(value || "")}
                                        searchBy="name"
                                        displayFormat="simple"
                                        className="w-full"
                                    />
                                </div>

                                <Button
                                    onClick={handleEdit}
                                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg"
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    Edit Details
                                </Button>

                            </div>
                        ) : (
                            <>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="border-2 border-gray-300 hover:bg-gray-50"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save mr-2"></i>
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </header> */}
                <MaterialInventSingleHeader
                    navigate={navigate}
                    data={data}
                    editMode={editMode}
                    projectOptions={projectOptions}
                    selectedProjectId={selectedProjectId}
                    handleSelectProjectId={handleSelectProjectId}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    updateMutation={updateMutation}
                    handleEdit={handleEdit} />

                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden border-2 border-violet-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <CardContent className="p-0">
                                {displayValues?.image ? (
                                    <div className="relative group">
                                        <img
                                            src={displayValues.image}
                                            alt={displayValues.itemCode || "Material"}
                                            className="w-full h-auto object-cover rounded-t-xl"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = NO_IMAGE;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-violet-100 to-blue-100 h-80 flex items-center justify-center">
                                        <div className="text-center text-violet-300">
                                            <i className="fas fa-image text-6xl mb-3"></i>
                                            <p className="text-sm">No Image Available</p>
                                        </div>
                                    </div>
                                )}

                                {hasVariants && (
                                    <div className="p-4 bg-white border-b">
                                        <Label className="text-sm text-gray-600 mb-2 block">Select Color Variant</Label>
                                        <div className="flex gap-2 flex-wrap">
                                            {form.variants?.map((variant, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleVariantSelect(variant)}
                                                    className={`px-3 py-2 rounded-lg border-2 transition-all ${selectedVariant?.color === variant.color
                                                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                        : 'border-gray-300 hover:border-violet-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                            style={{
                                                                backgroundColor: variant.color.toLowerCase() === 'white' ? '#ffffff' :
                                                                    variant.color.toLowerCase() === 'gold' ? '#FFD700' :
                                                                        variant.color.toLowerCase() === 'grey' ? '#808080' :
                                                                            variant.color
                                                            }}
                                                        />
                                                        <span className="capitalize text-sm">{variant.color}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 bg-gradient-to-br from-violet-50 to-blue-50">
                                    <div className="space-y-4">
                                        {displayValues.mrp && (
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 mb-3">
                                                    ₹{displayValues.mrp}
                                                    <span className="text-xs font-normal text-gray-500 ml-2">MRP</span>
                                                </p>
                                            </div>
                                        )}
                                        <div className="space-y-2 text-sm">
                                            {form?.category && (
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-gray-500">Category</Label>
                                                    <Badge variant="default">
                                                        {form.category}
                                                    </Badge>
                                                </div>
                                            )}
                                            {displayValues.itemCode && (
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-gray-500">Code</Label>
                                                    <Badge variant="success" className="font-mono">
                                                        {displayValues.itemCode}
                                                    </Badge>
                                                </div>
                                            )}
                                            {displayValues.color && (
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-gray-500">Color</Label>
                                                    <Badge variant="outline" className="capitalize">
                                                        {displayValues.color}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 border-t border-violet-200">
                                            {!isInCart ? (
                                                // Add to Cart Button
                                                <Button
                                                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
                                                    onClick={handleAddToCart}
                                                    disabled={!selectedProjectId}
                                                    isLoading={addToCartMutation.isPending}
                                                >


                                                    <i className="fas fa-shopping-cart mr-2"></i>
                                                    Add to Cart


                                                </Button>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between bg-white rounded-lg p-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateCartQuantity(-1)}
                                                            disabled={updateCartQuantityMutation.isPending || removeFromCartMutation.isPending}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </Button>

                                                        <div className="flex flex-col items-center">
                                                            <span className="text-xs text-gray-500">Quantity</span>
                                                            <span className="font-bold text-lg">{cartQuantity}</span>
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateCartQuantity(1)}
                                                            disabled={updateCartQuantityMutation.isPending}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="w-full bg-red-600 text-white"
                                                        onClick={handleRemoveFromCart}
                                                        isLoading={removeFromCartMutation.isPending}

                                                    >

                                                        <i className="fas fa-trash mr-2"></i>
                                                        Remove from Cart

                                                    </Button>
                                                </div>
                                            )}

                                            {isInCart && (
                                                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                                                    <p className="text-xs text-green-700 text-center">
                                                        <i className="fas fa-check-circle mr-1"></i>
                                                        Item in cart for {projects?.find((p: any) => p._id === selectedProjectId)?.projectName}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                      
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

=                    <div className="lg:col-span-2">
                        <Card className="border-2 border-violet-100 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-violet-50 to-blue-50 border-b-2 border-violet-100">
                                <CardTitle className="text-2xl text-violet-700 flex items-center gap-2">
                                    <i className="fas fa-info-circle"></i>
                                    Specifications
                                </CardTitle>
                                <CardDescription>
                                    {editMode ? "Edit material specifications below" : "Detailed material information"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {editMode ? (
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {editableFields.map((field: any) => (


                                            <div key={field.key} className="space-y-2">
                                                <Label htmlFor={field.key} className="flex items-center gap-2 text-violet-700">
                                                    <i className={`fas ${field.icon} text-sm`}></i>
                                                    {field.label}
                                                </Label>
                                                <Input
                                                    id={field.key}
                                                    name={field.key}
                                                    type={field.type}
                                                    // value={form[field.key as keyof MaterialSpecification] || ""}
                                                    value={form[field.key as keyof EditableFieldKey] || ""}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                    className="transition-all duration-200 hover:border-violet-300"
                                                />
                                            </div>

                                        ))}
                                    </div>
                                ) : (
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {editableFields.map((field) => {
                                            if (field.key === "Variant") return null
                                            const value = form[field?.key as keyof EditableFieldKey];
                                            if (!value) return null;

                                            return (
                                                <div
                                                    key={field.key}
                                                    className="bg-gradient-to-br from-white to-violet-50 p-4 rounded-xl border border-violet-100 hover:shadow-md transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <i className={`fas ${field.icon} text-violet-600`}></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                                {field.label}
                                                            </p>
                                                            <p className="text-gray-900 font-semibold truncate">
                                                                {field.key === "mrp" ? `₹${value}` :
                                                                    field.key === "watt" ? `${value}W` : value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {!editMode && hasVariants && (
                                    <div className="mt-8 pt-6 border-t-2 border-violet-100">
                                        <h3 className="text-lg font-semibold text-violet-700 mb-4 flex items-center gap-2">
                                            <i className="fas fa-palette"></i>
                                            Available Variants
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {form.variants?.map((variant, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVariant?.color === variant.color
                                                        ? 'border-violet-500 bg-violet-50'
                                                        : 'border-gray-200 hover:border-violet-300'
                                                        }`}
                                                    onClick={() => handleVariantSelect(variant)}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                                style={{
                                                                    backgroundColor: variant.color.toLowerCase() === 'white' ? '#ffffff' :
                                                                        variant.color.toLowerCase() === 'gold' ? '#FFD700' :
                                                                            variant.color.toLowerCase() === 'grey' ? '#808080' :
                                                                                variant.color
                                                                }}
                                                            />
                                                            <span className="font-semibold capitalize">{variant.color}</span>
                                                        </div>
                                                        {selectedVariant?.color === variant.color && (
                                                            <i className="fas fa-check-circle text-violet-600"></i>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 font-mono">{variant.itemCode}</p>
                                                    <p className="text-lg font-bold text-gray-900 mt-1">₹{variant.mrp}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!editMode && Object.keys(form).filter(key => key !== 'image' && key !== 'variants').length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <i className="fas fa-inbox text-3xl text-violet-400"></i>
                                        </div>
                                        <p className="text-gray-500">No specifications available</p>
                                        <Button
                                            onClick={handleEdit}
                                            className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Add Specifications
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div> */}



                <MaterialInventSingleMainCompo
                    displayValues={displayValues}
                    form={form}
                    editMode={editMode}
                    selectedVariant={selectedVariant}
                    handleVariantSelect={handleVariantSelect}
                    handleChange={handleChange}
                    handleEdit={handleEdit}
                    editableFields={editableFields}
                    hasVariants={hasVariants}
                    handleAddToCart={handleAddToCart}
                    handleUpdateCartQuantity={handleUpdateCartQuantity}
                    handleRemoveFromCart={handleRemoveFromCart}
                    cartQuantity={cartQuantity}
                    isInCart={isInCart}
                    selectedProjectId={selectedProjectId}
                    addToCartMutation={addToCartMutation}
                    updateCartQuantityMutation={updateCartQuantityMutation}
                    removeFromCartMutation={removeFromCartMutation}
                    projects={projects}
                />

                {/* Footer Actions - Mobile Only */}
                {editMode && (
                    <div className="mt-8 lg:hidden">
                        <div className="bg-white border-2 border-violet-100 rounded-xl p-4 shadow-xl">
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    isLoading={updateMutation.isPending}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                >

                                    <i className="fas fa-save mr-2"></i>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialInventorySingle;