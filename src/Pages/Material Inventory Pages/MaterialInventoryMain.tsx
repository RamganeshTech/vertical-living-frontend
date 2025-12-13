
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
// import { Select } from "../../components/ui/Select";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../../components/ui/DropdownMenu";
import EmptyState from "../../components/ui/EmptyState";
import { toast } from "../../utils/toast";
import { useInfiniteMaterialInventories, useCreateMaterialInventory, useUpdateMaterialInventory, useDeleteMaterialInventory } from "../../apiList/MaterialInventory Api/materialInventoryApi";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { truncate } from "../../utils/dateFormator";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useDebounce } from "../../Hooks/useDebounce";
import { MATINVENTORY_FILTER_OPTIONS } from "./materialInventoryDetails";
import { useGetProjects } from "../../apiList/projectApi";
import type { AvailableProjetType } from "../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useAddToCart, useGetCart, useRemoveCartItem, useUpdateCartItemQuantity } from "../../apiList/MaterialInventory Api/MaterialInventoryCartApi";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import SearchSelectNew from "../../components/ui/SearchSelectNew";
import { Label } from "../../components/ui/Label";
import { useAuthCheck } from "../../Hooks/useAuthCheck";


const MaterialInventoryMain: React.FC = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const navigate = useNavigate()
    // Filters and search state
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    const [type, setType] = useState(""); // For switches/sockets/regulators

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [watt, setWatt] = useState("");
    const [itemCode, setItemCode] = useState("");
    const [minMrp, setMinMrp] = useState("0");
    const [maxMrp, setMaxMrp] = useState("100000");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedProjectId, setSelectedProjectId] = useState("");



    
    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.productinventory?.delete;
    const canEdit = role === "owner" || permission?.productinventory?.edit;
    const canList = role === "owner" || permission?.productinventory?.list;



    // Debounced values - 500ms delay for search, 800ms for price inputs
    const debouncedSearch = useDebounce(search, 500);
    const debouncedMinMrp = useDebounce(minMrp, 800);
    const debouncedMaxMrp = useDebounce(maxMrp, 800);


    // Get projects
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

    // Get cart data
    const { data: cartData, refetch: refetchCart } = useGetCart({
        organizationId,
        projectId: selectedProjectId
    });

    // Cart mutations
    const addToCartMutation = useAddToCart();
    const updateCartQuantityMutation = useUpdateCartItemQuantity();
    const removeFromCartMutation = useRemoveCartItem();


    useEffect(() => {
        setSubcategory("");
        setType("");
    }, [category]);


    // Determine if current category uses variants (switches/sockets/regulators)

    const isLightCategory = category && category.toLowerCase() === "light";
    const isSwitchOrSocketCategory = category && ["switches", "socket"].includes(category.toLowerCase());
    const isRegulatorCategory = category && category.toLowerCase() === "regulator";
    const noCategorySelected = !category || category === "";


    // Show specific filters based on category
    const showTypeFilter = isSwitchOrSocketCategory;
    const showSubcategoryAndModel = isLightCategory || noCategorySelected; // Show when light OR no category

    // Reset irrelevant filters when category changes
    useEffect(() => {
        if (isLightCategory) {
            // Reset type when switching to light category
            setType("");
        } else if (isSwitchOrSocketCategory) {
            // Reset subcategory and model when switching to switch/socket
            setSubcategory("");
            setModel("");
        } else if (isRegulatorCategory) {
            // Reset all category-specific filters for regulator
            setType("");
            setSubcategory("");
            setModel("");
        } else if (noCategorySelected) {
            // Reset type when no category is selected (show subcategory and model)
            setType("");
        }
    }, [category]); // Only run when category changes

    // Build filters based on category
    const filters = useMemo(() => {
        const baseFilters = {
            search: debouncedSearch,
            category,
            minMrp: debouncedMinMrp ? Number(debouncedMinMrp) : undefined,
            maxMrp: debouncedMaxMrp ? Number(debouncedMaxMrp) : undefined,
            brand,
            watt,
            itemCode,
        };

        // Add category-specific filters
        if (isLightCategory || noCategorySelected) {
            // Light or No Category: show subcategory and model
            return {
                ...baseFilters,
                subcategory,
                model,
            };
        } else if (isSwitchOrSocketCategory) {
            // Switch/Socket: show type
            return {
                ...baseFilters,
                type,
            };
        } else if (isRegulatorCategory) {
            // Regulator: no additional type/subcategory/model filters
            return baseFilters;
        }

        return baseFilters;
    }, [
        debouncedSearch,
        category,
        subcategory,
        type,
        model,
        watt,
        itemCode,
        debouncedMinMrp,
        debouncedMaxMrp,
        brand,
        isLightCategory,
        isSwitchOrSocketCategory,
        isRegulatorCategory,
        noCategorySelected
    ]);


    // const isVariantCategory = category && ["switches", "socket", "regulator"].includes(category.toLowerCase());

    // Infinite query
    // const filters = useMemo(() => ({
    //     search: debouncedSearch,
    //     category,
    //     subcategory,
    //     ...(isVariantCategory ? { type } : { subcategory }),
    //     model,
    //     watt,
    //     itemCode,
    //     minMrp: debouncedMinMrp ? Number(debouncedMinMrp) : undefined,
    //     maxMrp: debouncedMaxMrp ? Number(debouncedMaxMrp) : undefined,
    //     brand
    // }), [debouncedSearch, category, subcategory, type, model, watt, itemCode, debouncedMinMrp, brand, debouncedMaxMrp]);



    const {
        data,
        isLoading,
        isError,
        error: queryError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteMaterialInventories(organizationId, filters) as {
        data: { pages: any[]; pageParams: any[] } | undefined;
        isLoading: boolean;
        isError: boolean;
        error: any;
        fetchNextPage: () => void;
        hasNextPage: boolean | undefined;
        isFetchingNextPage: boolean;
        refetch: () => void;
    };



    // Mutations
    const createMutation = useCreateMaterialInventory();
    const updateMutation = useUpdateMaterialInventory();
    const deleteMutation = useDeleteMaterialInventory();



    // Helper function to get display data for an item

    const getDisplayData = (item: any) => {
        const spec = item?.specification || {};

        // Check if this item has variants (switches/sockets/regulators)
        if (spec?.variants && Array.isArray(spec?.variants) && spec?.variants?.length > 0) {
            const firstVariant = spec?.variants[0];
            return {
                image: firstVariant?.image || null,
                mrp: firstVariant?.mrp || 0,
                itemCode: firstVariant?.itemCode || "",
                color: firstVariant.color || "",
                hasVariants: true,
                variants: spec?.variants
            };
        }

        // Light category - direct properties
        return {
            image: spec.imageUrl || spec.image || null,
            mrp: spec.mrp || 0,
            itemCode: spec.itemCode || "",
            color: null,
            hasVariants: false,
            variants: []
        };
    };


    // Helper function to get specification for cart
    const getSpecificationForCart = (item: any): any => {
        // If product has variants, use first variant's data
        if (item?.specification?.variants && item?.specification?.variants?.length > 0) {
            const firstVariant = item?.specification?.variants[0];
            return {
                itemCode: firstVariant?.itemCode,
                mrp: firstVariant?.mrp,
                color: firstVariant?.color,
                // size: firstVariant.size,
                image: firstVariant.images?.[0] || firstVariant.image,
                // Include other variant fields
                ...firstVariant,
                // Also include base product info
                hsn: item?.specification?.HSN || "",
                brand: item?.specification?.brand || "",
                description: item?.specification?.description || "",
                styleType: item?.specification?.styleType || "",
                type: item?.specification?.type || "",
                materialType: item?.specification?.materialType || "",
                category: item?.specification?.category || item?.category || "",
                subcategory: item?.specification?.subcategory || item?.subcategory || "",
                model: item?.specification?.model || item.model || "",
                // name: item?.specification?.name || item.name,
            };
        }
        // Otherwise use product's specification
        return item.specification;
    };



    // Helper function to get itemCode from product
    const getItemCodeFromProduct = (item: any): string => {
        // If product has variants, return first variant's itemCode
        if (item?.specification?.variants && item?.specification?.variants?.length > 0) {
            return item?.specification?.variants[0]?.itemCode;
        }
        // Otherwise return product's itemCode
        return item?.specification?.itemCode || item?.itemCode;
    };


    // CART HANDLERS

    // Helper function to get cart item quantity
    const getCartItemQuantity = (productId: string): number => {
        if (!cartData?.items) return 0;
        const cartItem = cartData.items.find((item: any) => item.productId === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    // Add to Cart Handler
    const handleAddToCart = async (item: any) => {
        if (!selectedProjectId) {
            toast({
                title: "Error",
                description: "Please select a project first",
                variant: "destructive"
            });
            return;
        }

        try {
            const specification = getSpecificationForCart(item);

            await addToCartMutation.mutateAsync({
                organizationId,
                projectId: selectedProjectId,
                productId: item._id,
                quantity: 1,
                specification: specification
            });
            toast({
                title: "Success",
                description: "Item added to cart successfully"
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
    const handleUpdateCartQuantity = async (itemCode: string, newQuantity: number) => {
        if (!cartData?._id) return;

        // If quantity becomes 0, remove the item
        if (newQuantity === 0) {
            try {
                await removeFromCartMutation.mutateAsync({
                    cartId: cartData._id,
                    itemCode,
                    // organizationId,
                    // projectId: selectedProjectId
                });
                toast({
                    title: "Success",
                    description: "Item removed from cart"
                });
                refetchCart();
            } catch (e: any) {
                toast({
                    title: "Error",
                    description: e?.response?.data?.message || "Failed to remove item from cart",
                    variant: "destructive"
                });
            }
            return;
        }

        try {
            await updateCartQuantityMutation.mutateAsync({
                cartId: cartData._id,
                itemCode,
                quantity: newQuantity,
                // organizationId,
                // projectId: selectedProjectId
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


    // Handlers
    const handleAdd = async (specification: any) => {
        try {
            await createMutation.mutateAsync({ organizationId, specification });
            toast({ title: "Added", description: "Material inventory added successfully" });
            setShowAddModal(false);
        } catch (e: any) {
            setError(e.message);
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    const handleEdit = async (id: string, specification: any) => {
        try {
            await updateMutation.mutateAsync({ id, specification });
            toast({ title: "Updated", description: "Material inventory updated successfully" });
            setEditItem(null);
        } catch (e: any) {
            setError(e.message);
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        // if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteMutation.mutateAsync({ id });
            toast({ title: "Deleted", description: "Material inventory deleted" });
        } catch (e: any) {
            setError(e.message);
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    // Infinite scroll
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            console.log("has next page", hasNextPage)
            if (!listRef.current || isFetchingNextPage || !hasNextPage) return;


            const container = listRef.current;
            const { scrollTop, scrollHeight, clientHeight } = container;

            // Trigger when user scrolls to within 300px of bottom
            // if (scrollTop + clientHeight >= scrollHeight - 300) {
            //     console.log('Fetching next page...'); // Debug log
            //     fetchNextPage();
            // }

            if (scrollHeight > clientHeight + 50 && scrollTop + clientHeight >= scrollHeight - 300) {
                console.log('Fetching next page...');
                fetchNextPage();
            }
        };

        const container = listRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [fetchNextPage, isFetchingNextPage, hasNextPage]);





    // SLIDER UTILS

    // const maxPrice = useMemo(() => {
    //     // console.log(maxPrice)
    //     return data?.pages ? data?.pages?.length > 0
    //         ? Math.max(...data?.pages?.map((p: any) => p?.specification?.mrp))
    //         : 100000 : 100000  // Default max if no products are there
    // }, [data]);


    // const minPrice = useMemo(() => 0, [])

    // const handleRangeChange = useCallback((value: number | number[]) => {


    //     if (Array.isArray(value) && value.length === 2) {
    //         const [min, max] = value as [number, number];
    //         setMinMrp(String(min)); // Update your existing state
    //         setMaxMrp(String(max)); // Update your existing state
    //     }
    // }, [maxPrice]);


    // Show loading indicator when values are being debounced
    const isDebouncing = search !== debouncedSearch ||
        minMrp !== debouncedMinMrp ||
        maxMrp !== debouncedMaxMrp;

    const isSubPage = location.pathname.includes("single") || location.pathname.includes("cart");

    if (isSubPage) return <Outlet />; // subpage like /vehicles


    // Render helpers
    // Helper to truncate long text

    // Render a card for each item, dynamic fields
    const renderItem = (item: any) => {
        const spec = item.specification || {};
        const displayData = getDisplayData(item);
        // const img = spec.imageUrl || spec.image || null;

        // Get itemCode for this item (first variant if has variants, else product itemCode)
        const itemCode = getItemCodeFromProduct(item);


        const cartQuantity = getCartItemQuantity(item._id);
        const isInCart = cartQuantity > 0;
        const isUpdatingCart = addToCartMutation.isPending || updateCartQuantityMutation.isPending || removeFromCartMutation.isPending;


        return (
            <Card key={item._id} className="mb-4 shadow-xl border border-gray-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-4">
                        {/* {img && <img src={img} alt="img" className="w-16 h-16 object-cover rounded-lg border border-gray-400" />} */}
                        {displayData.image && (
                            <img
                                src={displayData?.image}
                                alt="img"
                                className="w-16 h-16 object-cover rounded-lg border border-gray-400"
                            />
                        )}
                        <div>
                            <CardTitle className="text-lg font-bold text-blue-900">
                                {truncate(spec?.subcategory || spec.name || spec.model || spec?.category || "Unnamed", 22)}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-1">
                                {spec?.category && <span className="mr-2"><Badge>{spec.category}</Badge></span>}
                                {spec?.model && <span className="mr-2">Model: <span className="font-semibold">{truncate(spec.model, 14)}</span></span>}
                                {displayData.hasVariants && displayData.color && (
                                    <span className="mr-2">
                                        <Badge variant="secondary">{displayData.color}</Badge>
                                    </span>
                                )}
                                {displayData?.itemCode && <span className="mr-2">Code: <span className="font-semibold">{displayData.itemCode}</span></span>}
                                {spec?.itemCode && <span className="mr-2">Code: <span className="font-semibold">{spec.itemCode}</span></span>}
                            </CardDescription>
                        </div>
                    </div>
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><i className="fas fa-ellipsis-v"></i></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Button variant="link" onClick={() => setEditItem(item)}>Edit</Button>
                            <Button variant="link" onClick={() => handleDelete(item._id)}>Delete</Button>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                        {Object.entries(spec).map(([key, value]) => {
                            if (["image", "imageUrl", "_id", "organizationId", "series", "cct", "mrp", "itemCode", "variants"].includes(key)) return null;
                            if (typeof value === "object" || value === undefined || value === null) return null;

                            // This assumes 'key' and 'value' are defined in the surrounding scope (e.g., a map callback)

                            return (
                                key === "description" ? ( // Ternary operator starts here, wrap return values in parentheses
                                    <div key={key} className="bg-gray-50 rounded px-2 py-1 border border-gray-100">
                                        <span className="font-semibold capitalize">{truncate(key, 12)}:</span>
                                        {value as string}
                                    </div>
                                ) : (
                                    // Note: The Fragment <>...</> around a single div is unnecessary here,
                                    // but it doesn't cause a syntax error. It's cleaner to remove it.
                                    <div key={key} className="bg-gray-50 rounded px-2 py-1 border border-gray-100">
                                        <span className="font-semibold capitalize">{truncate(key, 12)}:</span> {truncate(String(value), 18)}
                                    </div>
                                )
                            );
                        })}


                        {/* {spec.mrp && <div className="text-blue-700 font-bold ml-auto text-[16px]">₹{spec.mrp}</div>} */}

                        {displayData.hasVariants && displayData.variants.length > 1 && (
                            <div className="bg-blue-50 rounded px-2 py-1 border border-blue-200">
                                <span className="font-semibold">Variants:</span> {displayData.variants.length} colors available
                            </div>
                        )}

                        {displayData.mrp && (
                            <div className="text-blue-700 font-bold ml-auto text-[16px]">
                                ₹{displayData.mrp}
                            </div>
                        )}


                    </div>

                    <section className="flex justify-between items-center mt-4">

                        <div className="flex justify-end gap-2">
                           {canList && <Button
                                size="sm"
                                variant="primary"
                                onClick={() => navigate(`single/${(item as any)._id}`)}
                            >
                                <i className="fas fa-eye mr-1" />
                                View
                            </Button>}
                            {/* <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditItem(item)}
                            >
                                <i className="fas fa-edit mr-1" />
                                Edit
                            </Button> */}
                           {canDelete && <Button
                                size="sm"
                                isLoading={deleteMutation.isPending}
                                variant="danger"
                                onClick={() => handleDelete(item._id)}
                                className='text-white bg-red-600'
                            >
                                <i className="fas fa-trash mr-1" />
                                Delete
                            </Button>}
                        </div>


                        {/* Add to Cart / Quantity Controls */}
                        <div className="flex gap-2 items-center">
                            {!isInCart ? (
                                <>
                                {canEdit && <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleAddToCart(item)}
                                    isLoading={isUpdatingCart}
                                    disabled={!selectedProjectId || isUpdatingCart}
                                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                                >
                                    <i className="fas fa-cart-plus mr-1" />
                                    Add to Cart
                                </Button>
                            }
                            </>
                            ) : (
                                 <>
                                {canEdit &&
                                <div className="flex items-center gap-2 bg-green-50 rounded-lg p-1 border border-green-200">
                                    <Button
                                        size="sm"
                                        onClick={() => handleUpdateCartQuantity(itemCode, cartQuantity - 1)}
                                        disabled={isUpdatingCart}
                                        variant="danger"

                                        className="w-8 h-8 p-0 bg-red-600 text-white rounded-md shadow-sm"
                                    >
                                        <i className="fas fa-minus text-sm"></i>
                                    </Button>

                                    <span className="w-10 text-center font-bold text-green-700">
                                        {cartQuantity}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="primary"

                                        onClick={() => handleUpdateCartQuantity(itemCode, cartQuantity + 1)}
                                        disabled={isUpdatingCart}
                                        className="w-8 h-8 p-0  rounded-md shadow-sm"
                                    >
                                        <i className="fas fa-plus text-sm"></i>
                                    </Button>
                                </div>
                                }
                                </>
                            )}
                        </div>
                    </section>

                </CardContent>
            </Card>
        );
    };



    // Main render
    return (
        <div className="max-h-full overflow-y-auto bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <i className="fas fa-list mr-3 text-blue-600"></i>
                                Product Inventory List
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Discover the product that you want for you work here
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {/* Debouncing indicator */}
                            {isDebouncing && (
                                <div className="flex items-center gap-2 text-sm text-amber-600">
                                    <i className="fas fa-clock animate-pulse"></i>
                                    <span>Updating results...</span>
                                </div>
                            )}
                            {/* <Button onClick={() => setShowAddModal(true)} variant="primary" className="w-full">Add Material</Button> */}


                            {/* Project Selection */}
                            <div className="w-full sm:w-64">


                                {/* <div className="relative min-w-[250px]"> */}
                                <Label>Select project for the displaying the cart items</Label>
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
                                {/* </div> */}
                            </div>


                           {canList && <Button
                                onClick={() => navigate("cart")}
                                variant="primary"
                                className="relative w-full sm:w-auto"
                            >
                                <i className="fas fa-shopping-cart text-xl"></i>
                                {cartData && cartData.items?.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                        {cartData.items.length}
                                    </span>
                                )}
                            </Button>}


                        </div>



                    </div>
                </div>
            </div>

            <div className="px-2 sm:px-4 lg:px-8 py-6">
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="xl:w-80 w-full flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i>
                                    Filters
                                </h3>
                                {(category || subcategory || model || watt || itemCode || minMrp ||
                                    maxMrp || search || type) && (
                                        <button
                                            onClick={() => { setCategory(""); setType(""); setSubcategory(""); setModel(""); setWatt(""); setItemCode(""); setMaxMrp("100000"); setMinMrp("0"); setSearch(""); }}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    )}
                            </div>
                            <section className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search
                                        {search !== debouncedSearch && (
                                            <span className="ml-2 text-xs text-amber-600">
                                                <i className="fas fa-circle animate-pulse"></i>
                                            </span>
                                        )}
                                    </label>
                                    <Input
                                        placeholder="Search by Brand, Subcategory, Model, ItemCode..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value.trim())}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {MATINVENTORY_FILTER_OPTIONS.categories.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <select
                                        value={brand}
                                        onChange={e => setBrand(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {MATINVENTORY_FILTER_OPTIONS.brand.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>



                                {/* Conditional filter: Subcategory for lights, Type for switches/sockets/regulators */}
                                {/* {!isVariantCategory ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                                            <select
                                                value={subcategory}
                                                onChange={e => setSubcategory(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {MATINVENTORY_FILTER_OPTIONS.subcategories.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                            <select
                                                value={model}
                                                onChange={e => setModel(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {MATINVENTORY_FILTER_OPTIONS.models.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <select
                                            value={type}
                                            onChange={e => setType(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">All Types</option>
                                            {MATINVENTORY_FILTER_OPTIONS.types?.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )} */}


                                {showSubcategoryAndModel && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Subcategory
                                            </label>
                                            <select
                                                value={subcategory}
                                                onChange={e => setSubcategory(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {MATINVENTORY_FILTER_OPTIONS.subcategories.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Model
                                            </label>
                                            <select
                                                value={model}
                                                onChange={e => setModel(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {MATINVENTORY_FILTER_OPTIONS.models.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Show Type only for Switch/Socket Categories */}
                                {showTypeFilter && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={type}
                                            onChange={e => setType(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">All Types</option>
                                            {MATINVENTORY_FILTER_OPTIONS.types?.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Info message for Regulator Category */}
                                {/* {isRegulatorCategory && (
        <div className="col-span-full p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center">
                <i className="fa-solid fa-info-circle mr-2"></i>
                Showing all regulators. Use brand, price range, or search to filter results.
            </p>
        </div>
    )}

    {noCategorySelected && (
        <div className="col-span-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 flex items-center">
                <i className="fa-solid fa-filter mr-2"></i>
                Showing all products. Select a category for more specific filters.
            </p>
        </div>
    )} */}

                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                        {/* {(minMrp !== debouncedMinMrp || maxMrp !== debouncedMaxMrp) && (
                                            <span className="ml-2 text-xs text-amber-600">
                                                <i className="fas fa-circle animate-pulse"></i>
                                            </span>
                                        )} */}
                                    </label>



                                    <div className="px-2 mb-3">
                                        <Slider
                                            range
                                            min={0}
                                            max={100000}
                                            step={500}
                                            value={[Number(minMrp), Number(maxMrp)]} // Use your existing states
                                            onChange={(value) => {
                                                const [min, max] = value as [number, number];
                                                setMinMrp(String(min)); // Update your existing state
                                                setMaxMrp(String(max)); // Update your existing state
                                            }}
                                            trackStyle={[{ backgroundColor: '#3b82f6', height: 6 }]}
                                            handleStyle={[
                                                {
                                                    borderColor: '#3b82f6',
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6
                                                },
                                                {
                                                    borderColor: '#3b82f6',
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6
                                                }
                                            ]}
                                            railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                                        />
                                    </div>

                                    {/* Display Values */}
                                    <div className="flex justify-between items-center gap-2 text-sm">
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Min</span>
                                            <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                                                ₹{Number(minMrp).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div className="text-gray-400 mt-5">—</div>
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Max</span>
                                            <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                                                ₹{Number(maxMrp).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex flex-col gap-3 items-center mt-2">

                                        <Input className="" type="number" value={minMrp} onChange={e => setMinMrp(e.target.value)} />
                                        <Input className="" type="number" value={maxMrp} onChange={e => setMaxMrp(e.target.value)} />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* Main Content */}
                   {canList && <div className="flex-1 !max-h-[95vh] overflow-y-auto custom-scrollbar">
                        <div
                            ref={listRef}
                       >

                            {!selectedProjectId && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-4 flex items-center">
                                    <i className="fas fa-exclamation-triangle mr-3 text-xl"></i>
                                    <div>
                                        <p className="font-semibold">Select a project to add items to cart</p>
                                        <p className="text-sm">Choose a project from the dropdown above to enable cart functionality</p>
                                    </div>
                                </div>
                            )}



                            {/* Error state */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 flex items-center justify-between">
                                    <div><i className="fas fa-exclamation-triangle mr-2"></i>{error}</div>
                                    <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-700"><i className="fas fa-times"></i></button>
                                </div>
                            )}
                            {isError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 flex items-center justify-between">
                                    <div><i className="fas fa-exclamation-triangle mr-2"></i>{queryError?.message || "Failed to load data"}</div>
                                    <button onClick={() => refetch()} className="ml-4 text-red-400 hover:text-red-700"><i className="fas fa-redo"></i></button>
                                </div>
                            )}
                            {/* List/empty/loading state */}
                            <div className="max-h-[110%]  pr-2">
                                {isLoading ? (
                                    // <div className="flex justify-center items-center h-full">
                                    //     <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
                                    // </div>
                                    <MaterialOverviewLoading />
                                ) : !data?.pages?.length || !data.pages[0]?.data?.length ? (
                                    <EmptyState message="No material inventory found." icon="box" color="gray" />
                                ) : (
                                    data.pages.map((page: any) => page.data.map(renderItem))
                                )}
                                {isFetchingNextPage && <div className="flex justify-center py-2">
                                    <i className="fas fa-spinner fa-spin text-lg text-blue-400"></i>
                                </div>}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>


            {/* Add/Edit Modal (simple inline for demo) */}
            {(showAddModal || editItem) && (
                <MaterialInventoryModal
                    initialData={editItem?.specification}
                    onClose={() => { setShowAddModal(false); setEditItem(null); }}
                    onSubmit={async (spec) => {
                        if (editItem) await handleEdit(editItem._id, spec);
                        else await handleAdd(spec);
                    }}
                    isLoading={createMutation.status === "pending" || updateMutation.status === "pending"}
                />
            )}
        </div>
    );
};

// Modal for add/edit (simple, can be replaced with Dialog)
type MaterialInventoryModalProps = {
    initialData?: any;
    onClose: () => void;
    onSubmit: (spec: any) => void;
    isLoading?: boolean;
};
const MaterialInventoryModal: React.FC<MaterialInventoryModalProps> = ({ initialData = {}, onClose, onSubmit, isLoading }) => {
    const [form, setForm] = useState<any>({
        name: initialData.name || "",
        type: initialData.type || "",
        quantity: initialData.quantity || "",
        unit: initialData.unit || "",
        location: initialData.location || "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name) return setError("Name is required");
        setError(null);
        await onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4 relative">
                <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <h2 className="text-xl font-semibold mb-2">{initialData?.name ? "Edit Material" : "Add Material"}</h2>
                <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                <Input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
                <Input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} type="number" />
                <Input name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} />
                <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>Save</Button>
                </div>
            </form>
        </div>
    );
};

export default MaterialInventoryMain;
