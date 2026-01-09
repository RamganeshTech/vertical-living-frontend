import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import { useDebounce } from '../../../Hooks/useDebounce';
import { useDeleteTool, useGetAllToolsInfinite } from '../../../apiList/tools_api/toolMasterApi';
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';
import { ToolCard } from './ToolMasterCard';
import { Breadcrumb, type BreadcrumbItem } from '../../Department Pages/Breadcrumb';

// --- CONSTANTS ---
const CATEGORIES = ["Drill", "Saw", "Grinder", "Cutter", "Laser Level", "Other"];
// const CONDITIONS = ["new", "good", "worn", "repair"];
const AVAILABILITY = ["available", "issued", "repair", "missing"];

interface ToolFilters {
    search: string;
    toolCategory: string;
    conditionStatus: string;
    availabilityStatus: string;
    minPrice: string;
    maxPrice: string;
}

const ToolMasterMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams<{ organizationId: string }>();

    const isDetailView = location.pathname.includes('single') || location.pathname.includes('create') || location.pathname.includes('issueotp');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- FILTERS STATE ---
    const [filters, setFilters] = useState<ToolFilters>({
        search: '',
        toolCategory: '',
        conditionStatus: '',
        availabilityStatus: '',
        minPrice: '',
        maxPrice: '',
    });

    const debouncedSearch = useDebounce(filters.search, 700);

    // --- API HOOKS ---
    const {
        data,
        isLoading,
        // isError,
        // error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        // refetch
    } = useGetAllToolsInfinite({
        organizationId,
        ...filters,
        toolName: debouncedSearch // Backend uses toolName for search
    });

    const deleteMutation = useDeleteTool();

    // --- INFINITE SCROLL ---
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

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this tool from the registry?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: "Deleted", description: "Tool removed successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const clearFilters = () => {
        setFilters({ search: '', toolCategory: '', conditionStatus: '', availabilityStatus: '', minPrice: '', maxPrice: '' });
    };

    const activeFiltersCount = Object.values(filters).filter(val => val !== '').length;
    const tools = data?.pages.flatMap(page => page.data) || [];


    const paths: BreadcrumbItem[] = [
        { label: "Tools & Hardware", path: `/organizations/${organizationId}/projects/toolhub` },
        { label: "Tool Master", path: `/organizations/${organizationId}/projects/toolmain` },
    ];

    if (isDetailView) return <Outlet />;

    return (
        <div className="h-full flex flex-col p-2">
            {/* --- UPDATED HEADER STYLE (ACCOUNTING STYLE) --- */}
            <header className="flex border-b border-gray-400 justify-between items-center mb-3 px-1 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-tools mr-3 text-blue-600"></i>
                        Tool Master
                    </h1>
                    {/* <p className="text-gray-600 mt-1 text-sm">
                        Centralized Asset Registry & Handover Tracking for all organization tools
                    </p> */}
                    <Breadcrumb paths={paths} />

                </div>

                <div className="flex gap-2 items-center">

                    {/* <Button
                        variant='primary'
                        onClick={() => navigate('../issueotp')}
                        className="flex items-center gap-2 text-blue-600 border-blue-200"
                    >
                        <i className="fas fa-paper-plane"></i>
                        Issue Asset (Generate OTP)
                    </Button>

                    <Button
                        variant='outline'
                        onClick={() => navigate('../enterotp')}
                        className="flex items-center gap-2 text-blue-600 border-blue-200"
                    >
                        <i className="fas fa-user-check"></i>
                        Verify Handover (Enter OTP)
                    </Button>


                    <Button
                        variant='outline'
                        onClick={() => navigate('../toolhistory')}
                        className="flex items-center gap-2 text-blue-600 border-blue-200"
                    >
                        <i className="fas fa-history"></i>
                        Tool History
                    </Button>


                    <Button
                        variant='secondary'
                        onClick={() => navigate('../toolroom')}
                        className="flex items-center gap-2 text-blue-600 border-blue-200"
                    >
                        <i className="fas fa-warehouse"></i>
                        Tool Rooms
                    </Button> */}

                    <Button
                        onClick={() => navigate('create')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
                    >
                        <i className="fas fa-plus"></i>
                        Create Tool
                    </Button>
                </div>


            </header>



            <main className="flex gap-6 flex-1 overflow-hidden">
                {/* --- FILTERS SIDEBAR (30%) --- */}
                {/* --- UPDATED FILTERS SIDEBAR (30%) --- */}


                {/* --- UPDATED FILTERS SIDEBAR (30%) --- */}
                <aside className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar pb-4">
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col">

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i>
                                Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* 1. Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Tool name, Serial No..."
                                    value={filters.search}
                                    autoFocus
                                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* 2. Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tool Category</label>
                                <select
                                    value={filters.toolCategory}
                                    onChange={(e) => setFilters(f => ({ ...f, toolCategory: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* 3. Availability Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <select
                                    value={filters.availabilityStatus}
                                    onChange={(e) => setFilters(f => ({ ...f, availabilityStatus: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                >
                                    <option value="">All Status</option>
                                    {AVAILABILITY.map(status => (
                                        <option key={status} value={status} className="capitalize">{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Status
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABILITY.map(status => {
                                        const isActive = filters.availabilityStatus === status;
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => setFilters(f => ({ ...f, availabilityStatus: isActive ? '' : status }))}
                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight border transition-all duration-200 ${isActive
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-blue-50/30'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div> */}

                            {/* 4. Value Range (Manual Input Style) */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Value Range (₹)</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                    <span className="text-gray-400">—</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div> */}

                        </div>
                    </div>
                </aside>

                {/* --- LIST AREA (70%) --- */}
                <section className="flex-1 flex flex-col overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto custom-scrollbar pr-2"
                    >
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                            </div>
                        ) : tools.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                                <i className="fas fa-box-open text-5xl mb-4 opacity-20"></i>
                                <p>No tools found matching your criteria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {tools.map(tool => (
                                    <ToolCard
                                        key={tool._id}
                                        tool={tool}
                                        onDelete={() => handleDelete(tool._id)}
                                        onView={() => navigate(`single/${tool._id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {isFetchingNextPage && (
                            <div className="py-4 text-center text-blue-600 font-medium text-sm">
                                <i className="fas fa-circle-notch fa-spin mr-2"></i> Fetching more...
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ToolMasterMain;