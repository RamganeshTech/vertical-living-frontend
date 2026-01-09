import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import { useDebounce } from '../../../Hooks/useDebounce';
import { useDeleteToolRoom, useGetAllToolRoomsInfinite } from '../../../apiList/tools_api/toolRoomApi';
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';
import ToolRoomList from './ToolRoomList';
import { Breadcrumb, type BreadcrumbItem } from '../../Department Pages/Breadcrumb';

interface ToolRoomFilters {
    search: string;
    location: string;
    isActive: string; // 'all' | 'true' | 'false'
}

const ToolRoomMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams<{ organizationId: string }>();



    // const paths: BreadcrumbItem[] = [
    //     { label: "Tool Master", path: `/organizations/${organizationId}/projects/toolmain` },
    //     { label: "Room", path: `/organizations/${organizationId}/projects/toolroom` },
    // ];




    const paths: BreadcrumbItem[] = [
        { label: "Tools & Hardware", path: `/organizations/${organizationId}/projects/toolhub` },
        { label: "Tool Room", path: `/organizations/${organizationId}/projects/toolroom` },
    ];


    // Detail view check (for /get/:id or /create)
    const isDetailView = location.pathname.includes('single/') || location.pathname.includes('create');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- FILTERS STATE ---
    const [filters, setFilters] = useState<ToolRoomFilters>({
        search: '',
        location: '',
        isActive: 'all',
    });

    const debouncedSearch = useDebounce(filters.search, 700);
    const debouncedLocation = useDebounce(filters.location, 700);

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
    } = useGetAllToolRoomsInfinite({
        organizationId,
        toolRoomName: debouncedSearch,
        location: debouncedLocation,
        isActive: filters.isActive === 'all' ? undefined : filters.isActive
    });

    const deleteMutation = useDeleteToolRoom();

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
        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: "Deleted", description: "Tool room removed successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const clearFilters = () => {
        setFilters({ search: '', location: '', isActive: 'all' });
    };

    const activeFiltersCount = Object.values(filters).filter(val => val !== '' && val !== 'all').length;
    const toolRooms = data?.pages.flatMap(page => page.data) || [];

    if (isDetailView) return <Outlet />;

    return (
        <div className="h-full flex flex-col ">
            {/* --- HEADER --- */}
            {/* <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <i className="fas fa-warehouse text-blue-600"></i> Tool Rooms
                    </h1>
                    <Breadcrumb paths={paths} />

                </div>
                <Button onClick={() => navigate('create')} className="gap-2 bg-blue-600">
                    <i className="fas fa-plus"></i> New Tool Room
                </Button>
            </header> */}

            {/* --- UPDATED HEADER STYLE --- */}
            <header className="flex justify-between items-center px-1 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-warehouse mr-3 text-blue-600"></i>
                        Tool Rooms
                    </h1>
                    {/* <p className="text-gray-600 mt-1 text-sm">
            Manage physical storage locations, operational hours, and assigned storekeepers
        </p> */}
                    <div className="mt-2">
                        <Breadcrumb paths={paths} />
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    {/* Primary Action Button */}
                    <Button
                        onClick={() => navigate('create')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
                    >
                        <i className="fas fa-plus"></i>
                        New Tool Room
                    </Button>
                </div>
            </header>

            <main className="flex gap-6 flex-1 overflow-hidden">
                {/* --- FILTERS SIDEBAR (30%) --- */}
                {/* <aside className="xl:w-80 w-72 shrink-0 h-full overflow-y-auto custom-scrollbar pb-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">

                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <i className="fas fa-sliders-h mr-3 text-blue-600"></i>
                                Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 font-bold uppercase tracking-wider hover:underline"
                                >
                                    Reset ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="space-y-7 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Room Name
                                </label>
                                <div className="relative group">
                                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs group-focus-within:text-blue-500 transition-colors"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Physical Location
                                </label>
                                <div className="relative group">
                                    <i className="fas fa-map-marker-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Area or Site name..."
                                        value={filters.location}
                                        onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Operating Status
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'All', value: 'all' },
                                        { label: 'Active', value: 'true' },
                                        { label: 'Inactive', value: 'false' }
                                    ].map(opt => {
                                        const isActive = filters.isActive === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => setFilters(f => ({ ...f, isActive: opt.value }))}
                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight border transition-all duration-200 ${isActive
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                       
                    </div>
                </aside> */}


                {/* --- MERGED FILTERS SIDEBAR (30%) --- */}
                <aside className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">

                        {/* Header Section */}
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

                            {/* 1. Name/Search Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Room
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={filters.search}
                                    autoFocus
                                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* 2. Location Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Physical Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="Area or Site name..."
                                    value={filters.location}
                                    onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* 3. Operational Status (Select Style) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Operational Status
                                </label>
                                <select
                                    value={filters.isActive}
                                    onChange={(e) => setFilters(f => ({ ...f, isActive: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="true">Active Rooms</option>
                                    <option value="false">Inactive / Closed</option>
                                </select>
                            </div>

                            {/* 4. Time Range Indicator (Visual only, based on your Reference style) */}
                            {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours
                </label>
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold mb-1">
                        <i className="fas fa-clock"></i>
                        <span>System Access</span>
                    </div>
                    <p className="text-[11px] text-blue-600/70 leading-tight">
                        Rooms are only visible for tool issuance during their allowed hours.
                    </p>
                </div>
            </div> */}

                        </div>
                    </div>
                </aside>

                {/* --- LIST AREA (70%) --- */}
                {/* <section className="flex-1 flex flex-col overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto custom-scrollbar pr-2"
                    >
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                            </div>
                        ) : toolRooms.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                                <i className="fas fa-warehouse text-5xl mb-4 opacity-20"></i>
                                <p>No tool rooms found matching your criteria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {toolRooms.map(room => (
                                    <ToolRoomCard
                                        key={room._id}
                                        room={room}
                                        onDelete={() => handleDelete(room._id)}
                                        onView={() => navigate(`get/${room._id}`)}
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
                </section> */}


                {/* --- LIST AREA (70%) --- */}
                <section className="flex-1 flex flex-col overflow-hidden">
                    {isLoading ? (
                        <div className="flex-1 flex justify-center items-center bg-white rounded-xl border border-gray-200">
                            <i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                        </div>
                    ) : toolRooms.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 text-center p-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-warehouse text-3xl text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Tool Rooms Found</h3>
                            <p className="text-sm text-gray-500 max-w-md">
                                {activeFiltersCount > 0
                                    ? "Try adjusting your filters or search query."
                                    : "Create your first tool room to start managing asset storage."}
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
                        >
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-10 bg-white border-b border-blue-100 shadow-sm">
                                <div className="grid grid-cols-13 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-bold text-gray-700 text-[10px] uppercase tracking-wider">
                                    <div className="col-span-1 text-center">#</div>
                                    <div className="col-span-3">Room Name / ID</div>
                                    <div className="col-span-3">Location</div>
                                    <div className="col-span-2">In-Charge</div>
                                    <div className="col-span-2 text-center">Timings</div>
                                    <div className="col-span-1 text-center">Status</div>
                                    <div className="col-span-1 text-center">Action</div>
                                </div>
                            </div>

                            {/* List Items */}
                            <div className="divide-y divide-gray-100">
                                {toolRooms.map((room: any, index: number) => (
                                    <ToolRoomList
                                        key={room._id}
                                        data={room}
                                        index={index}
                                        onView={() => navigate(`single/${room._id}`)}
                                        onDelete={(id: string) => handleDelete(id)}
                                        deletePending={deleteMutation.isPending && (deleteMutation as any).variables.id === room._id}
                                    />
                                ))}
                            </div>

                            {/* Infinite Loaders */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-6 bg-gray-50 border-t">
                                    <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                                        <i className="fas fa-spinner fa-spin"></i> Loading more...
                                    </div>
                                </div>
                            )}

                            {!hasNextPage && toolRooms.length > 0 && (
                                <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center">
                                        <i className="fas fa-check-circle mr-2"></i> All Rooms Loaded
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ToolRoomMain;