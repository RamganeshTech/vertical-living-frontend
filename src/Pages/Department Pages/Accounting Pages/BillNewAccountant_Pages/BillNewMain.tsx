import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardDescription, CardContent } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { dateFormate } from '../../../../utils/dateFormator';
import { useDeleteBillNew, useGetAllBillsNew } from '../../../../apiList/Department Api/Accounting Api/billNew_accounting_api/billNewAccountingApi';
import { Button } from '../../../../components/ui/Button';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { Breadcrumb, type BreadcrumbItem } from '../../Breadcrumb';
// import { useDebounce } from '../../../../hooks/useDebounce'; // Ensure this exists

const BillNewMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams<{ organizationId: string }>();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        projectId: '',
        createdFromDate: '',
        createdToDate: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    const debouncedSearch = useDebounce(filters.search, 700);

    // API Hooks
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllBillsNew({
        organizationId: organizationId!,
        projectId: filters.projectId || undefined,
        limit: 12,
        search: debouncedSearch,
        createdFromDate: filters.createdFromDate,
        createdToDate: filters.createdToDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
    });

    const deleteMutation = useDeleteBillNew();

    const bills = data?.pages.flatMap(page => page.data) || [];

    // Infinite Scroll Logic
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleCardClick = (id: string) => {
        navigate(`single/${id}`);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this bill?")) {
            deleteMutation.mutate({ id, organizationId: organizationId! });
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            projectId: '',
            createdFromDate: '',
            createdToDate: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };




    const paths: BreadcrumbItem[] = [
        { label: "Account", path: `/organizations/${organizationId}/projects/accounting` },
        { label: "Design Bill", path: `/organizations/${organizationId}/projects/billnew` },
    ];


    const activeFiltersCount = (filters.search ? 1 : 0) + (filters.projectId ? 1 : 0) + (filters.createdFromDate ? 1 : 0);

    // Render Outlet if navigating to sub-routes
    const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create') || location.pathname.includes('/billtemplate');
    if (isDetailView) return <Outlet />;

    return (
        <div className="h-full flex flex-col bg-gray-50/50 overflow-hidden">

            {/* --- HEADER --- */}
            <header className="flex justify-between items-center bg-white border-b border-gray-200 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file-pdf mr-3 text-blue-600"></i>
                        Bill Designs
                    </h1>
                    <Breadcrumb paths={paths} />

                </div>



                <div className='gap-2 flex items-center'>

                    <Button onClick={() => navigate(`create`)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-plus mr-2"></i> Create Bill
                    </Button>

                    <Button onClick={() => navigate(`billtemplate`)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-file-invoice mr-2"></i> Bill Template
                    </Button>


                </div>

            </header>

            {/* --- CONTENT --- */}
            {isLoading ? (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                    <i className="fas fa-spinner fa-spin mr-2 text-2xl"></i> Loading Bills...
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-red-500 mb-4">{(error as any)?.message || "Failed to load bills."}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white">Retry</Button>
                </div>
            ) : (
                <main className="flex flex-col xl:flex-row flex-1 overflow-hidden">

                    {/* --- LEFT SIDEBAR (FILTERS) --- */}
                    <div className="xl:w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-md font-bold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i> Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search</label>
                                <div className="relative">
                                    <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Customer or Bill #..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Project ID */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project ID</label>
                                <input
                                    type="text"
                                    placeholder="Filter by Project ID"
                                    value={filters.projectId}
                                    onChange={(e) => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                />
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Range</label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                        value={filters.createdFromDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, createdFromDate: e.target.value }))}
                                    />
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                        value={filters.createdToDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, createdToDate: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort By</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                        className="w-full px-2 py-2 border border-gray-300 rounded text-sm outline-none bg-white"
                                    >
                                        <option value="createdAt">Created</option>
                                        <option value="billNumber">Bill #</option>
                                        <option value="customerName">Customer</option>
                                    </select>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                                        className="w-full px-2 py-2 border border-gray-300 rounded text-sm outline-none bg-white"
                                    >
                                        <option value="desc">Newest</option>
                                        <option value="asc">Oldest</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (GRID) --- */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto bg-gray-50/50 p-4"
                    >
                        {bills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-box-open text-4xl text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">No Bills Found</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {filters.search
                                        ? `No matches for "${filters.search}"`
                                        : "Create a new bill to get started."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {bills.map((bill: any) => (
                                        <Card
                                            key={bill._id}
                                            onClick={() => handleCardClick(bill._id)}
                                            className="cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 relative group"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-lg text-gray-800 truncate" title={bill.customerName}>
                                                            {bill.customerName || 'Unknown Customer'}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                                                            {bill.billNumber}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="danger"
                                                        size="icon"
                                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => handleDelete(e, bill._id)}
                                                    >
                                                        <i className="fas fa-trash text-xs"></i>
                                                    </Button>
                                                </div>
                                                <CardDescription className="mt-2 text-xs">
                                                    <i className="far fa-calendar mr-1"></i>
                                                    {dateFormate(bill.createdAt)}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-2 flex-wrap">
                                                    {bill.projectId && (
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            <i className="fas fa-project-diagram mr-1"></i>
                                                            {bill.projectId.projectName || 'Project'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* LOADING INDICATOR */}
                                {isFetchingNextPage && (
                                    <div className="flex justify-center py-8">
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <i className="fas fa-spinner fa-spin text-xl"></i>
                                            <span className="text-sm font-medium">Loading more bills...</span>
                                        </div>
                                    </div>
                                )}

                                {/* END OF LIST */}
                                {!hasNextPage && bills.length > 0 && (
                                    <div className="flex justify-center py-6 text-gray-400 text-xs">
                                        <p>End of list</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};

export default BillNewMain;
