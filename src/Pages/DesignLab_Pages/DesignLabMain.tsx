import { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate, useLocation, Outlet } from 'react-router-dom';
// import { dateFormate } from '../../utils/dateFormator';
import { useDebounce } from '../../Hooks/useDebounce';
import { useDeleteDesignLab, useGetAllDesignLabs } from '../../apiList/DesignLab_Api/designLabApi';
import { Button } from '../../components/ui/Button';
import { toast } from '../../utils/toast';
import { DesignLabCard } from './DesignLabCard';
import { useAuthCheck } from '../../Hooks/useAuthCheck';
import StageGuide from '../../shared/StageGuide';
// Assuming these are your custom UI components based on description
// import { Button } from '../../components/ui/button'; 
// import { toast } from '../../components/ui/use-toast'; 

export interface IUpload {
    type: "image" | "pdf";
    url: string;
    originalName?: string;
    uploadedAt?: Date;
}


// --- TYPES ---
export interface IDesignLab {
    _id: string;
    designCode: string;
    productName: string;
    designerName: string;
    spaceType: string;
    referenceImages: IUpload[]
    difficultyLevel: string;
    status: string;
    designDate: string;
    createdAt: string;
}



interface FilterState {
    search: string;
    spaceType: string;
    difficultyLevel: string;
    status: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

// --- CONSTANTS ---
const SPACE_TYPES = ["Bedroom", "Living Room", "Kitchen", "Bathroom", "Foyer", "Commercial"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Factory Pro"];
const STATUSES = ["draft", "published", "archived"];



// ==========================================
// MAIN COMPONENT
// ==========================================
const DesignLabMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useOutletContext<{ organizationId: string }>();

    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.design?.list;
    const canCreate = role === "owner" || permission?.design?.create;


    const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- FILTERS STATE ---
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        spaceType: '',
        difficultyLevel: '',
        status: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    // Use custom debounce hook
    const debouncedSearch = useDebounce(filters.search, 700);

    // --- API HOOKS ---
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useGetAllDesignLabs({
        organizationId,
        filters: { ...filters, search: debouncedSearch }
    });

    const deleteMutation = useDeleteDesignLab();

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

    // --- HANDLERS ---
    const handleDelete = async (id: string) => {
        // if (!window.confirm("Are you sure you want to delete this design? This cannot be undone.")) return;

        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: "Success", description: "Design deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to delete design",
                variant: "destructive"
            });
        }
    };

    const handleView = (id: string) => {
        navigate(`single/${id}`);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            spaceType: '',
            difficultyLevel: '',
            status: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    // Count active filters
    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 'createdAt' && val !== 'desc'
    ).length;

    // Flatten data
    const designLabs = data?.pages.flatMap(page => page.designLabs) || [];

    // If on detail view, show Outlet
    if (isDetailView) {
        return <Outlet />;
    }

    return (
        <div className="space-y-0 h-full flex flex-col bg-brand-surface">

            {/* --- HEADER --- */}
            <header className="flex justify-between items-center shrink-0 mb-4 px-1 border-b border-ash-light">
                <div className='flex items-center '>
                    <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                        <i className="fas fa-drafting-compass text-action-primary"></i>
                    </div>
                    <div>

                        <h1 className="text-xl sm:text-2xl font-bold text-text-strong flex items-center">
                            Design Lab
                        </h1>
                        {/* <p className="text-gray-500 text-sm mt-1">Manage your design specifications</p> */}
                        <p className="text-text-muted text-[10px] font-bold tracking-wider ">Manage your design specifications</p>

                    </div>
                </div>

                <div className='flex gap-3 items-center'>
                    {/* <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => 
                    >
                        <i className="fas fa-bars"></i> Menu
                    </Button> */}


                    {canCreate && <Button
                        onClick={() => navigate(`create`)}
                        // className="flex items-center gap-2"
                        variant="dark"
                        className="flex items-center gap-2 shadow-sm h-10 px-4"
                    >
                        {/* <i className="fas fa-plus"></i>
                        Create Design */}
                        <i className="fas fa-plus text-xs"></i>
                        <span className="text-xs font-bold uppercase tracking-wider">Create Design</span>
                    </Button>}




                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="design"
                        />
                    </div>

                </div>
            </header>

            {/* --- MAIN CONTENT AREA (Split View) --- */}
            <main className="flex gap-4 flex-1 overflow-hidden">

                {/* --- FILTERS SIDEBAR (Always Visible) --- */}
                <div className="w-72 flex-shrink-0 h-full overflow-y-auto custom-scrollbar pb-4">
                    <div className="bg-brand-ash/40 rounded-xl shadow-sm p-5 border border-ash-medium h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6 shrink-0 border-b border-ash-medium">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-main flex items-center">
                                <i className="fas fa-filter mr-2 text-action-primary"></i>
                                Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    // className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                    className="text-[10px] text-action-primary hover:text-text-strong font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    Clear All ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="space-y-5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                            {/* Search */}
                            <div>
                                {/* <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"> */}
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">
                                    Search
                                </label>
                                <div className="relative">
                                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-soft text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Design name, code..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        // className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        className="w-full pl-9 h-10 bg-brand-surface border border-ash-medium rounded-lg text-xs font-medium text-text-main focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 outline-none transition-all placeholder:text-text-soft"
                                    />
                                </div>
                            </div>

                            {/* Space Type */}
                            <div>
                                {/* <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"> */}
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">

                                    Space Type
                                </label>
                                <select
                                    value={filters.spaceType}
                                    onChange={(e) => setFilters(f => ({ ...f, spaceType: e.target.value }))}
                                    // className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    className="w-full h-10 px-3 bg-brand-surface 
                                    border border-ash-medium rounded-lg text-xs font-bold text-text-main 
                                    focus:border-action-primary outline-none  cursor-pointer"
                                >
                                    <option value="">All Spaces</option>
                                    {SPACE_TYPES.map(space => (
                                        <option key={space} value={space}>{space}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty Level */}
                            <div>
                                {/* <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"> */}
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">

                                    Difficulty
                                </label>
                                <select
                                    value={filters.difficultyLevel}
                                    onChange={(e) => setFilters(f => ({ ...f, difficultyLevel: e.target.value }))}
                                    // className="w-full px-3 py-2 bg-gray-50 
                                    // border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    className="w-full h-10 px-3 bg-brand-surface 
                                    border border-ash-medium rounded-lg text-xs font-bold text-text-main 
                                    focus:border-action-primary outline-none  cursor-pointer"
                                >
                                    <option value="">All Levels</option>
                                    {DIFFICULTY_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                {/* <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"> */}
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">

                                    Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                                    // className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    className="w-full h-10 px-3 bg-brand-surface 
                                    border border-ash-medium rounded-lg text-xs font-bold text-text-main 
                                    focus:border-action-primary outline-none  cursor-pointer"
                                >
                                    <option value="">All Statuses</option>
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                {/* <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"> */}
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">

                                    Sort By
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                        // className="col-span-2 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        className=" col-span-2  w-full h-10 px-3 bg-brand-surface 
                                    border border-ash-medium rounded-lg text-xs font-bold text-text-main 
                                    focus:border-action-primary outline-none  cursor-pointer"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="designDate">Design Date</option>
                                        <option value="productName">Name</option>
                                    </select>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) => setFilters(f => ({ ...f, sortOrder: e.target.value as 'asc' | 'desc' }))}
                                        // className="col-span-2 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        className=" col-span-2  w-full h-10 px-3 bg-brand-surface 
                                    border border-ash-medium rounded-lg text-xs font-bold text-text-main 
                                    focus:border-action-primary outline-none  cursor-pointer"
                                    >
                                        <option value="desc">Newest First</option>
                                        <option value="asc">Oldest First</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- LIST AREA (Conditional Rendering) --- */}
                {canList && <div className="flex-1 h-full overflow-hidden flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex justify-center items-center bg-brand-ash/20 rounded-xl border border-ash-light border-dashed">
                            <div className="flex flex-col items-center gap-4">
                                <i className="fas fa-circle-notch fa-spin text-4xl text-action-primary"></i>
                                <p className="text-[10px] font-bold tracking-[0.2em] text-text-muted animate-pulse">Loading Collection</p>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="flex-1 flex justify-center items-start pt-10">
                            <div className="max-w-md w-full p-8 bg-brand-surface border border-action-danger/30 rounded-xl shadow-sm text-center">
                                <div className="text-action-danger font-bold mb-3 text-lg flex items-center justify-center gap-2 uppercase tracking-tight">
                                    <i className="fas fa-exclamation-circle"></i> Sync Error
                                </div>
                                <p className="text-text-muted text-xs mb-8 font-medium">
                                    {(error as any)?.message || "The design database couldn't be reached."}
                                </p>
                                <Button onClick={() => refetch()} variant="outline" className="border-ash-dark text-text-main hover:bg-brand-ash px-8 h-10">
                                    Retry Connection
                                </Button>
                            </div>
                        </div>
                    ) : designLabs.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-brand-ash/20 rounded-xl border border-ash-light border-dashed p-10 text-center shadow-sm">
                            <div className="bg-brand-surface border border-ash-medium p-6 rounded-full mb-6">
                                <i className="fas fa-drafting-compass text-3xl text-text-soft"></i>
                            </div>
                            <h3 className="text-xl font-bold text-text-strong mb-2">No Designs Found</h3>
                            <p className="text-text-muted max-w-md mb-8">
                                {filters.search || activeFiltersCount > 0
                                    ? 'We couldn’t find any designs matching your filters. Try adjusting or clearing them.'
                                    : 'Your design library is empty. Start by creating your first design specification.'}
                            </p>
                            {(filters.search || activeFiltersCount > 0) ? (
                                // <button
                                //     onClick={clearFilters}
                                //     className="text-blue-600 font-medium hover:underline"
                                // >
                                //     Clear all filters
                                // </button>
                                <button onClick={clearFilters} 
                                className="text-action-primary hover:bg-brand-ash rounded-lg p-2 text-xs font-bold tracking-widest cursor-pointer">
                                    Reset Filters
                                </button>
                            ) : (
                                null
                            )}
                        </div>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            // className="flex-1 bg-gray-50/50 rounded-xl overflow-y-auto custom-scrollbar flex flex-col p-6" // Added padding and bg color
                            className="flex-1 bg-brand-ash/20 rounded-xl overflow-y-auto custom-scrollbar flex flex-col p-6 border border-ash-light"
                        >
                            {/* Grid Container */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                                {designLabs.map((design) => (
                                    <DesignLabCard
                                        key={design._id}
                                        // index={idx}
                                        design={design}
                                        handleView={handleView}
                                        handleDelete={handleDelete}
                                        deletePending={deleteMutation.isPending && deleteMutation.variables === design._id}
                                    />
                                ))}
                            </div>

                            {/* Footer Loaders/Messages */}
                            <div className="py-8 text-center mt-auto shrink-0">
                                {isFetchingNextPage ? (
                                    // <div className="flex flex-col items-center gap-2 text-blue-600">
                                    //     <i className="fas fa-circle-notch fa-spin text-xl"></i>
                                    //     <span className="text-sm font-medium">Loading more designs...</span>
                                    // </div>

                                    <div className="flex flex-col items-center gap-3">
                                            <i className="fas fa-spinner fa-spin text-xl text-action-primary"></i>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-text-soft">Retrieving More</span>
                                        </div>
                                ) : !hasNextPage && designLabs.length > 0 ? (
                                    // <div className="flex items-center justify-center gap-2 opacity-50">
                                    //     <span className="h-px w-12 bg-gray-300"></span>
                                    //     <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">End of Collection</p>
                                    //     <span className="h-px w-12 bg-gray-300"></span>
                                    // </div>
                                    <div className="flex items-center justify-center gap-4 opacity-40">
                                            <span className="h-px w-16 bg-ash-dark"></span>
                                            <p className="text-[9px] text-text-soft font-bold uppercase tracking-[0.2em]">End of Archive</p>
                                            <span className="h-px w-16 bg-ash-dark"></span>
                                        </div>
                                ) : designLabs.length === 0 && !isFetchingNextPage ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                                        <div className="w-16 h-16 bg-brand-main rounded-full flex items-center justify-center mb-4">
                                            <i className="fas fa-layer-group text-2xl"></i>
                                        </div>
                                        <p>No designs found</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>}
            </main>
        </div>
    );
};

export default DesignLabMain;