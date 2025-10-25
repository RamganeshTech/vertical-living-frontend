import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useDeleteModularUnitNew, useGetAllModularUnitsNew } from "../../../apiList/Modular Unit Api/modularUnitNewApi";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { toast } from "../../../utils/toast";
import ModularUnitCardNew from "./ModularUnitCardNew";
import { useDebounce } from "../../../Hooks/useDebounce";

const ModularUnitMainNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams<{ organizationId: string }>();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if on child route
    const isChildRoute =
        location.pathname.includes("/create") || location.pathname.includes("/single");

    // Filter States
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        minPrice: "0",
        maxPrice: "100000",
        sortBy: "createdAt",
        sortOrder: "desc" as "asc" | "desc",
    });

    // Debounced search
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedCategory = useDebounce(filters.category, 500);
    const debouncedMinMrp = useDebounce(filters.minPrice, 800);
    const debouncedMaxMrp = useDebounce(filters.maxPrice, 800);

    //   useEffect(() => {
    //     const timer = setTimeout(() => {
    //       setDebouncedSearch(filters.search);
    //     }, 500);
    //     return () => clearTimeout(timer);
    //   }, [filters.search]);

    // Fetch data with infinite query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAllModularUnitsNew({
        organizationId: organizationId!,
        limit: 20,
        category: debouncedCategory || undefined,
        // minPrice: Number(filters.minPrice) || undefined,
        // maxPrice: Number(filters.maxPrice) !== 100000 ? Number(filters.maxPrice) : undefined,
        minPrice: debouncedMinMrp ? Number(debouncedMinMrp) : undefined,
        maxPrice: debouncedMaxMrp ? Number(debouncedMaxMrp) : undefined,
        search: debouncedSearch || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    });

    const deleteMutation = useDeleteModularUnitNew();

    // Scroll-based infinite loading
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                console.log("📜 Loading more products...");
                fetchNextPage();
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten all pages data
    const allUnits = data?.pages.flatMap((page) => page.units) || [];

    // Count active filters
    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== "" && val !== "createdAt" && val !== "desc" && val !== "0" && val !== "100000"
    ).length;

    // Reset filters
    const clearFilters = () => {
        setFilters({
            search: "",
            category: "",
            minPrice: "0",
            maxPrice: "100000",
            sortBy: "createdAt",
            sortOrder: "desc",
        });
    };

    // Handle delete
    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteMutation.mutateAsync({ unitId: id });
            toast({ title: "Success", description: "Product deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete product",
                variant: "destructive",
            });
        }
    };

    // Handle view
    const handleView = (unitId: string) => {
        navigate(`single/${unitId}`);
    };

    // If on detail view, show only the Outlet
    if (isChildRoute) {
        return <Outlet />;
    }

    return (
        <div className="space-y-4 h-full p-2">
            {/* Header */}
            <header className="flex justify-between items-center p-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-cubes mr-3 text-blue-600"></i>
                        Modular Units
                    </h1>
                    {/* <p className="text-gray-600 mt-1">
                        {data?.pages[0]?.pagination.totalItems || 0} products found
                    </p> */}
                </div>

                <Button onClick={() => navigate("create")}>
                    <i className="fas fa-plus mr-2" />
                    Add Product
                </Button>
            </header>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl sm:min-w-[80%] mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
                        ⚠️ Error Occurred 
                    </div>
                    <p className="text-red-500 mb-4 text-lg sm:text-xl">
                        {(error as any)?.message || "Failed to load products"}
                    </p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">
                        Retry
                    </Button>
                </div>
            ) : (
                <main className="flex gap-2 !max-h-[90%]">
                    {/* Filters Sidebar */}
                    <section className="xl:w-80 flex-shrink-0 !max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i>
                                    Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear All ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-search mr-2"></i>
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Name, serial no..."
                                        value={filters.search}
                                        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                     <input
                                        type="text"
                                        placeholder="Wardrobe, Cabinet..."
                                        value={filters.category}
                                        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Price Range Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                    </label>

                                    {/* Slider */}
                                    <div className="px-2 mb-3">
                                        <Slider
                                            range
                                            min={0}
                                            max={100000}
                                            step={500}
                                            value={[Number(filters.minPrice), Number(filters.maxPrice)]}
                                            onChange={(value) => {
                                                const [min, max] = value as [number, number];
                                                setFilters((f) => ({
                                                    ...f,
                                                    minPrice: String(min),
                                                    maxPrice: String(max),
                                                }));
                                            }}
                                            trackStyle={[{ backgroundColor: "#3b82f6", height: 6 }]}
                                            handleStyle={[
                                                {
                                                    borderColor: "#3b82f6",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6,
                                                },
                                                {
                                                    borderColor: "#3b82f6",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6,
                                                },
                                            ]}
                                            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                                        />
                                    </div>

                                    {/* Display Values */}
                                    <div className="flex justify-between items-center gap-2 text-sm">
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Min</span>
                                            <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                                                ₹{Number(filters.minPrice).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <div className="text-gray-400 mt-5">—</div>
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Max</span>
                                            <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                                                ₹{Number(filters.maxPrice).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manual Input Fields */}
                                    <div className="flex flex-col gap-3 items-center mt-2">
                                        <Input
                                            type="number"
                                            value={filters.minPrice}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, minPrice: e.target.value }))
                                            }
                                            placeholder="Min Price"
                                            className="w-full"
                                        />
                                        <Input
                                            type="number"
                                            value={filters.maxPrice}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                                            }
                                            placeholder="Max Price"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="productName">Product Name</option>
                                        <option value="price">Price</option>
                                        <option value="timeRequired">Time Required</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort Order
                                    </label>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) =>
                                            setFilters((f) => ({ ...f, sortOrder: e.target.value as "asc" | "desc" }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* No Products Fallback */}
                    {allUnits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">
                                No Products Found
                            </h3>
                            <p className="text-sm text-gray-500">
                                {filters.search || filters.category || filters.minPrice !== "0" || filters.maxPrice !== "100000"
                                    ? "Try adjusting your filters to find products."
                                    : "Looks like there are no products yet."}
                                <br />
                                Click on <strong>"Add Product"</strong> to get started 🚀
                            </p>
                        </div>
                    ) : (
                        <div ref={scrollContainerRef} className="flex-1 max-h-[100%] overflow-y-auto">
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                {allUnits.map((unit) => (
                                    <ModularUnitCardNew
                                        key={unit._id}
                                        unit={unit}
                                        onView={() => handleView(unit._id)}
                                        onDelete={() =>
                                            handleDelete(unit._id, unit.productName || "Untitled Product")
                                        }
                                        isDeleting={deleteMutation.isPending}
                                    />
                                ))}
                            </div>

                            {/* Loading indicator at the bottom */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-2xl"></i>
                                        <span className="text-sm font-medium">Loading more products...</span>
                                    </div>
                                </div>
                            )}

                            {/* End of list indicator */}
                            {!hasNextPage && allUnits.length > 0 && (
                                <div className="flex justify-center py-6">
                                    <p className="text-gray-400 text-sm font-medium">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        You've reached the end of the list
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            )}
        </div>
    );
};

export default ModularUnitMainNew;