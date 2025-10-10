
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



const MaterialInventoryMain: React.FC = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const navigate = useNavigate()
    // Filters and search state
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [model, setModel] = useState("");
    const [watt, setWatt] = useState("");
    const [itemCode, setItemCode] = useState("");
    const [minMrp, setMinMrp] = useState("0");
    const [maxMrp, setMaxMrp] = useState("100000");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Infinite query
    const filters = useMemo(() => ({
        search,
        category,
        subcategory,
        model,
        watt,
        itemCode,
        minMrp: minMrp ? Number(minMrp): undefined,
        maxMrp: maxMrp ? Number(maxMrp): undefined,
    }), [search, category, subcategory, model, watt, itemCode,  minMrp,
        maxMrp]);
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
    // React.useEffect(() => {
    //     const handleScroll = () => {
    //         if (!listRef.current || isFetchingNextPage || !hasNextPage) return;
    //         const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    //         if (scrollTop + clientHeight >= scrollHeight - 100) {
    //             fetchNextPage();
    //         }
    //     };
    //     const ref = listRef.current;
    //     if (ref) ref.addEventListener("scroll", handleScroll);
    //     return () => { if (ref) ref.removeEventListener("scroll", handleScroll); };
    // }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (!listRef.current || isFetchingNextPage || !hasNextPage) return;
            
            const container = listRef.current;
            const { scrollTop, scrollHeight, clientHeight } = container;
            
            // Trigger when user scrolls to within 200px of bottom
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                console.log('Fetching next page...'); // Debug log
                fetchNextPage();
            }
        };

        const container = listRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

    // Render helpers
    // Helper to truncate long text

    // Render a card for each item, dynamic fields
    const renderItem = (item: any) => {
        const spec = item.specification || {};
        const img = spec.imageUrl || spec.image || null;
        return (
            <Card key={item._id} className="mb-4 shadow-xl border border-gray-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-4">
                        {img && <img src={img} alt="img" className="w-16 h-16 object-cover rounded-lg border border-gray-400" />}
                        <div>
                            <CardTitle className="text-lg font-bold text-blue-900">
                                {truncate(spec.subcategory || spec.name || spec.model || "Unnamed", 22)}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-1">
                                {spec.category && <span className="mr-2"><Badge>{spec.category}</Badge></span>}
                                {spec.model && <span className="mr-2">Model: <span className="font-semibold">{truncate(spec.model, 14)}</span></span>}
                                {spec.itemCode && <span className="mr-2">Code: <span className="font-semibold">{spec.itemCode}</span></span>}
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
                            if (["image", "imageUrl", "_id", "organizationId", "series", "cct", "mrp", "itemCode"].includes(key)) return null;
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
                        {spec.mrp && <div className="text-blue-700 font-bold ml-auto text-[16px]">₹{spec.mrp}</div>}
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`single/${(item as any)._id}`)}
                        >
                            <i className="fas fa-eye mr-1" />
                            View
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                           onClick={() => setEditItem(item)}
                        >
                            <i className="fas fa-edit mr-1" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            isLoading={deleteMutation.isPending}
                            variant="danger"
                            onClick={() => handleDelete(item._id)}
                            className='text-white bg-red-600'
                        >
                            <i className="fas fa-trash mr-1" />
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };


    const isSubPage = location.pathname.includes("single");

    if (isSubPage) return <Outlet />; // subpage like /vehicles



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

                        <div>

                            {/* <Button onClick={() => setShowAddModal(true)} variant="primary" className="w-full">Add Material</Button> */}
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
                                {(category || subcategory || model || watt || itemCode ||  minMrp ||
        maxMrp || search) && (
                                    <button
                                        onClick={() => { setCategory(""); setSubcategory(""); setModel(""); setWatt(""); setItemCode(""); setMaxMrp("100000"); setMinMrp("0"); setSearch(""); }}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                    <Input
                                        placeholder="Search by Item Code, Subcategory, Model..."
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
                                        <option value="">All Categories</option>
                                        <option value="light">Light</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                                    <select
                                        value={subcategory}
                                        onChange={e => setSubcategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Subcategories</option>
                                        <option value="Downlights">Downlights</option>
                                        <option value="COB Downlights">COB Downlights</option>
                                        <option value="Designer Lights">Designer Lights</option>
                                        <option value="Panels">Panels</option>
                                        <option value="Battens-Tubes">Battens-Tubes</option>
                                        <option value="Magnetic Lights">Magnetic Lights</option>
                                        <option value="Retail Lights">Retail Lights</option>
                                        <option value="Industrial Lights">Industrial Lights</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                    <select
                                        value={model}
                                        onChange={e => setModel(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Models</option>
                                        <option value="ENSAVE PLUS">ENSAVE PLUS</option>
                                        <option value="AREVA PRIME">AREVA PRIME</option>
                                        <option value="NERO SURFACE">NERO SURFACE</option>
                                        <option value="LUCENT">LUCENT</option>
                                        <option value="LUCENT SQUARE">LUCENT SQUARE</option>
                                        <option value="2 IN 1 STANDALONE">2 IN 1 STANDALONE</option>
                                        <option value="ERIS FIXED (LOW BORDER DEEP RECESSED)">ERIS FIXED (LOW BORDER DEEP RECESSED)</option>
                                        <option value="ESTUS SWIVEL">ESTUS SWIVEL</option>
                                        <option value="ERIS SWIVEL">ERIS SWIVEL</option>
                                        <option value="ERIS REFLECTO">ERIS REFLECTO</option>
                                        <option value="ERIS FIXED">ERIS FIXED</option>
                                        <option value="EMINA">EMINA</option>
                                        <option value="EMINA TILTABLE">EMINA TILTABLE</option>
                                        <option value="DIMAS">DIMAS</option>
                                        <option value="GLIDE">GLIDE</option>
                                        <option value="ERIS SURFACE ROUND">ERIS SURFACE ROUND</option>
                                        <option value="EPITO">EPITO</option>
                                        <option value="EMPHA">EMPHA</option>
                                        <option value="RENE">RENE</option>
                                        <option value="CYNO">CYNO</option>
                                        <option value="ULTIMA SLIM">ULTIMA SLIM</option>
                                        <option value="ACCESSORIES FOR ULTIMA SLIM">ACCESSORIES FOR ULTIMA SLIM</option>
                                        <option value="ULTIMA ULTRA SLIM 1x4">ULTIMA ULTRA SLIM 1x4</option>
                                        <option value="ULTIMA ULTRA SLIM 1x1">ULTIMA ULTRA SLIM 1x1</option>
                                        <option value="ULTIMA ULTRA PRO (2x2)">ULTIMA ULTRA PRO (2x2)</option>
                                        <option value="ULTIMA MULTI-COLOUR">ULTIMA MULTI-COLOUR</option>
                                        <option value="GLAZE">GLAZE</option>
                                        <option value="GLAZE ULTRA ALUMINIUM">GLAZE ULTRA ALUMINIUM</option>
                                        <option value="KUBIK SMART">KUBIK SMART</option>
                                        <option value="KUBIK ULTRA">KUBIK ULTRA</option>
                                        <option value="T8 RETRO">T8 RETRO</option>
                                        <option value="T8 RETRO ACCESSSORIES">T8 RETRO ACCESSSORIES</option>
                                        <option value="PRIDE">PRIDE</option>
                                        <option value="ORELLI SLIM">ORELLI SLIM</option>
                                        <option value="ORELLI SLIM HANGING">ORELLI SLIM HANGING</option>
                                        <option value="INSTARAY SLIM LINEAR WITH LENS">INSTARAY SLIM LINEAR WITH LENS</option>
                                        <option value="INSTARAY SLIM LINEAR">INSTARAY SLIM LINEAR</option>
                                        <option value="INSTARAY ROUND SLIM">INSTARAY ROUND SLIM</option>
                                        <option value="INSTARAY SLIM LINEAR DIFFUSED">INSTARAY SLIM LINEAR DIFFUSED</option>
                                        <option value="INSTARAY SLIM TILTABLE & DIFFUSED">INSTARAY SLIM TILTABLE & DIFFUSED</option>
                                        <option value="MAGNETIC TRACK LIGHT ACCESSORIES">MAGNETIC TRACK LIGHT ACCESSORIES</option>
                                        <option value="MULTIBLE ZOOM LIGHT">MULTIBLE ZOOM LIGHT</option>
                                        <option value="TRACK LIGHT WHITE">TRACK LIGHT WHITE</option>
                                        <option value="TRACK LIGHT BLACK">TRACK LIGHT BLACK</option>
                                        <option value="TRACK LIGHT ACCESSORIES">TRACK LIGHT ACCESSORIES</option>
                                        <option value="IP20 STRIP LIGHT (24V DC)">IP20 STRIP LIGHT (24V DC)</option>
                                        <option value="IP65 STRIP LIGHT (24V DC)">IP65 STRIP LIGHT (24V DC)</option>
                                        <option value="COB STRIP LIGHT">COB STRIP LIGHT</option>
                                        <option value="POWER SUPPLY FOR IP20 STRIP LIGHT">POWER SUPPLY FOR IP20 STRIP LIGHT</option>
                                        <option value="POWER SUPPLY FOR IP65 STRIP LIGHT">POWER SUPPLY FOR IP65 STRIP LIGHT</option>
                                        <option value="BULK HEAD">BULK HEAD</option>
                                        <option value="PIT LIGHT">PIT LIGHT</option>
                                        <option value="WELL GLASS">WELL GLASS</option>
                                        <option value="HIGHBAY (>100 Lm/W)">HIGHBAY (&gt;100 Lm/W)</option>
                                        <option value="ULTRALITE HIGHBAY (>130 Lm/W)">ULTRALITE HIGHBAY (&gt;130 Lm/W)</option>
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Watt</label>
                                    <select
                                        value={watt}
                                        onChange={e => setWatt(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Watt</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Code</label>
                                    <select
                                        value={itemCode}
                                        onChange={e => setItemCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Item Codes</option>
                                    </select>
                                </div> */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">MRP</label>
                                   <Input className="" type="number" value={minMrp} onChange={e => setMinMrp(e.target.value)} />
                                   <Input className=""  type="number" value={maxMrp} onChange={e => setMaxMrp(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1  !max-h-[80vh] overflow-y-auto custom-scrollbar">
                          <div 
                            ref={listRef}
                            className="h-full overflow-y-auto custom-scrollbar pr-2"
                        >
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
                        <div  className="max-h-[100%]  pr-2">
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
                    </div>
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
