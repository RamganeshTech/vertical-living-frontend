import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { toast } from '../../../../utils/toast';
import { Breadcrumb, type BreadcrumbItem } from '../../Breadcrumb';
import { useDeleteSalesOrder, useGetAllSalesOrders } from '../../../../apiList/Department Api/Accounting Api/salesOrderApi';
import SalesOrderAccList from './SalesOrderAccList';

const SalesOrderAccountMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const paths: BreadcrumbItem[] = [
        { label: "Account", path: `/organizations/${organizationId}/projects/accounting` },
        { label: "Bills", path: `/organizations/${organizationId}/projects/billmain` },

        { label: "Sales Order", path: `/organizations/${organizationId}/projects/salesordermain` },
    ];

    // Check if we're on a child route
    const isDetailView = location.pathname.includes('/salessingle') || location.pathname.includes('/create');

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        customerId: '',
        fromSalesOrderDate: "",
toSalesOrderDate: "",
createdFromDate: "",
createdToDate: "",
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.search]);


    // Infinite query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllSalesOrders({
        organizationId: organizationId || '',
        customerId: filters.customerId || undefined,
        limit: 10,
        fromSalesOrderDate: filters.fromSalesOrderDate || undefined,
        toSalesOrderDate: filters.toSalesOrderDate || undefined,
        createdFromDate: filters.createdFromDate || undefined,
        createdToDate: filters.createdToDate || undefined,
        search: debouncedSearch || undefined,
        sortBy: filters.sortBy || undefined,
        sortOrder: filters.sortOrder || undefined,
    });


    const deleteSalesMutation = useDeleteSalesOrder();

    // Intersection observer for infinite scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;

            // Check if scrolled to bottom (with 100px threshold)
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading more orders...');
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    const handleDelete = async (salesId: string) => {
        try {
            await deleteSalesMutation.mutateAsync({ salesId });
            refetch();
            toast({ title: "Success", description: "Order deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to delete the Order",
                variant: "destructive"
            });
        }

    };

    const handleView = (salesId: string) => {
        navigate(`salessingle/${salesId}`);
    };

    // Count active filters
    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 'createdAt' && val !== 'desc'
    ).length;

    const clearFilters = () => {
        setFilters({
            search: '',
            customerId: '',
            fromSalesOrderDate: "",
toSalesOrderDate: "",
createdFromDate: "",
createdToDate: "",
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    // Get all sales from pages
    const salesOrder = data?.pages.flatMap(page => page.data) || [];
    // const totalsales = data?.pages[0]?.pagination?.total || 0;

    // If on detail view, show only the Outlet
    if (isDetailView) {
        return <Outlet />;
    }

    return (
        <div className="space-y-0 h-full">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file-invoice mr-3 text-blue-600"></i>
                        Sales Order
                    </h1>
                    {/* <p className="text-gray-600 mt-1">
                        Manage your organization sales
                    </p> */}
                    <Breadcrumb paths={paths} />

                </div>

                <Button
                    onClick={() => navigate('create')}
                >
                    <i className="fas fa-plus mr-2" />
                    Create Order
                </Button>
            </div>

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
                        {(error as any)?.message || "Failed to load orders"}
                    </p>
                    <Button
                        onClick={() => refetch()}
                        className="bg-red-600 text-white px-4 py-2"
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <main className="flex gap-2 !max-h-[90%]">
                    {/* Filters Sidebar */}
                    <div className="xl:w-80 flex-shrink-0 !max-h-[100%] overflow-y-auto">
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
                                        autoFocus
                                        placeholder="customer name"
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Date Filter */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        Filter by Created At
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.date}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, date: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        Filter by Sales Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.salesOrderDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, salesOrderDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div> */}

  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        From CreatedAt Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.createdFromDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, createdFromDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        To CreatedAt Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.createdToDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, createdToDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        From Sales Order Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.fromSalesOrderDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, fromSalesOrderDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        To Sales Order Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.toSalesOrderDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, toSalesOrderDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                

                                {/* Customer ID Filter */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-user mr-2"></i>
                                        Customer ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter customer ID..."
                                        value={filters.customerId}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, customerId: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div> */}

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, sortBy: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="sale">Sales Date</option>
                                        <option value="grandTotal">Grand Total</option>
                                        <option value="customerName">Customer Name</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort Order
                                    </label>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, sortOrder: e.target.value as 'asc' | 'desc' }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* No orders Fallback */}
                    {salesOrder.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-file-invoice text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Sales Order Found</h3>
                            <p className="text-sm text-gray-500">
                                {filters.search || filters.customerId
                                    ? 'Try adjusting your filters to find orders.'
                                    : 'Looks like there are no orders yet.'}
                                <br />
                                Click on <strong>Create Order</strong> to get started 🚀
                            </p>
                        </div>
                    ) : (

                        <div
                            ref={scrollContainerRef}
                            className="flex-1 !max-h-[100%] overflow-y-auto"
                        >
                            {/* Table Header */}
                            <div className="bg-white rounded-t-xl border border-gray-200 sticky top-0 z-10">
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm">
                                    <div className="col-span-1 text-center">S.No</div>
                                    <div className="col-span-3">Customer Name</div>
                                    <div className="col-span-2">Sales Date</div>
                                    <div className="col-span-2">Created At</div>
                                    <div className="col-span-2">Grand Total</div>
                                    <div className="col-span-1 text-center">Items</div>
                                    <div className="col-span-1 text-center">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-white rounded-b-xl border-x border-b border-gray-200">
                                {salesOrder.map((salesData: any, index: number) => (
                                    <SalesOrderAccList key={salesData._id} salesData={salesData} index={index} handleView={handleView} handleDelete={handleDelete} deleteSalesMutation={deleteSalesMutation} />
                                ))}
                            </div>

                            {/* Loading indicator at the bottom */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-2xl"></i>
                                        <span className="text-sm font-medium">Loading more orders...</span>
                                    </div>
                                </div>
                            )}

                            {/* End of list indicator */}
                            {!hasNextPage && salesOrder.length > 0 && (
                                <div className="flex justify-center py-6">
                                    <p className="text-gray-400 text-sm font-medium">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        You've reached the end of the list
                                    </p>
                                </div>
                            )}

                            {/* Total count */}
                            {/* {salesOrder.length > 0 && (
                                <div className="flex justify-center py-4">
                                    <p className="text-gray-500 text-sm">
                                        Showing {salesOrder.length} of {totalOrders} orders
                                    </p>
                                </div>
                            )} */}
                        </div>
                    )}
                </main>
            )}
        </div>
    );
};

export default SalesOrderAccountMain;