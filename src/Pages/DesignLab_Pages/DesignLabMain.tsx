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
// SUB-COMPONENT: Design Lab List Row
// ==========================================
// interface ListProps {
//     design: IDesignLab;
//     index: number;
//     handleView: (id: string) => void;
//     handleDelete: (id: string) => void;
//     deletePending: boolean;
// }

// const DesignLabListRow: React.FC<ListProps> = ({ design, index, handleView, handleDelete, deletePending }) => {
//     return (
//         <div
//             className="grid cursor-pointer grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-[#f9fcff] transition-colors items-center last:border-b-0"
//             onClick={() => handleView(design._id)}
//         >
//             {/* S.No */}
//             <div className="col-span-1 text-center text-gray-600 font-medium">
//                 {index + 1}
//             </div>

//             {/* Product Name & Designer */}
//             <div className="col-span-4">
//                 <div className="flex flex-col">
//                     <span className="font-medium text-gray-900 truncate text-base">
//                         {design.productName}
//                     </span>
//                     <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                         <i className="fas fa-user text-[10px] text-blue-500"></i> {design.designerName}
//                     </span>
//                 </div>
//             </div>

//             {/* Design Code */}
//             <div className="col-span-2">
//                 <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-mono font-bold border border-indigo-100">
//                     {design.designCode}
//                 </span>
//             </div>

//             {/* Space Type & Level */}
//             <div className="col-span-2 text-sm">
//                 <div className="text-gray-800 font-medium">{design.spaceType}</div>
//                 <div className="text-xs text-gray-500 mt-0.5">{design.difficultyLevel}</div>
//             </div>

//             {/* Date */}
//             <div className="col-span-2 text-gray-600 text-sm flex items-center">
//                 <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
//                 {dateFormate(design.designDate)}
//             </div>

//             {/* Actions */}
//             <div className="col-span-1 flex justify-center gap-2">
//                 <Button
//                     variant="ghost" 
//                     size="sm"
//                     onClick={(e: any) => {
//                         e.stopPropagation();
//                         handleDelete(design._id);
//                     }}
//                     disabled={deletePending}
//                     className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
//                     title="Delete Design"
//                 >
//                     {deletePending ? (
//                         <i className="fas fa-spinner fa-spin"></i>
//                     ) : (
//                         <i className="fas fa-trash"></i>
//                     )}
//                 </Button>
//             </div>
//         </div>
//     );
// };





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
        <div className="space-y-0 h-full flex flex-col">

            {/* --- HEADER --- */}
            <header className="flex justify-between items-center shrink-0 mb-4 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-layer-group mr-3 text-blue-600"></i>
                        Design Lab
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your design specifications</p>
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
                        className="flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i>
                        Create Design
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
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-base font-bold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i>
                                Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                >
                                    Clear All ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="space-y-5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Search
                                </label>
                                <div className="relative">
                                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Design name, code..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Space Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Space Type
                                </label>
                                <select
                                    value={filters.spaceType}
                                    onChange={(e) => setFilters(f => ({ ...f, spaceType: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">All Spaces</option>
                                    {SPACE_TYPES.map(space => (
                                        <option key={space} value={space}>{space}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty Level */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Difficulty
                                </label>
                                <select
                                    value={filters.difficultyLevel}
                                    onChange={(e) => setFilters(f => ({ ...f, difficultyLevel: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">All Levels</option>
                                    {DIFFICULTY_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Sort By
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                        className="col-span-2 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="designDate">Design Date</option>
                                        <option value="productName">Name</option>
                                    </select>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) => setFilters(f => ({ ...f, sortOrder: e.target.value as 'asc' | 'desc' }))}
                                        className="col-span-2 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                        <div className="flex-1 flex justify-center items-center bg-white rounded-xl border border-gray-200">
                            <div className="flex flex-col items-center gap-3 text-blue-600">
                                <i className="fas fa-spinner fa-spin text-4xl"></i>
                                <p className="text-sm font-medium">Loading Designs...</p>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="flex-1 flex justify-center items-start pt-10 bg-white rounded-xl border border-gray-200">
                            <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm text-center">
                                <div className="text-red-600 font-bold mb-2 text-xl flex items-center justify-center gap-2">
                                    <i className="fas fa-exclamation-triangle"></i> Error Occurred
                                </div>
                                <p className="text-red-500 mb-6">
                                    {(error as any)?.message || "Failed to load designs. Please try again."}
                                </p>
                                <Button
                                    onClick={() => refetch()}
                                    variant="danger"
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : designLabs.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
                            <div className="bg-blue-50 p-6 rounded-full mb-6">
                                <i className="fas fa-drafting-compass text-5xl text-blue-300"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Designs Found</h3>
                            <p className="text-gray-500 max-w-md mb-8">
                                {filters.search || activeFiltersCount > 0
                                    ? 'We couldn’t find any designs matching your filters. Try adjusting or clearing them.'
                                    : 'Your design library is empty. Start by creating your first design specification.'}
                            </p>
                            {(filters.search || activeFiltersCount > 0) ? (
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            ) : (
                                null
                            )}
                        </div>
                    ) : (
                        // --- DATA TABLE ---
                        // <div
                        //     ref={scrollContainerRef}
                        //     className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
                        // >
                        //     <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                        //         <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-700 text-xs uppercase tracking-wider">
                        //             <div className="col-span-1 text-center">S.No</div>
                        //             <div className="col-span-4">Product / Designer</div>
                        //             <div className="col-span-2">Design Code</div>
                        //             <div className="col-span-2">Type / Level</div>
                        //             <div className="col-span-2">Date</div>
                        //             <div className="col-span-1 text-center">Actions</div>
                        //         </div>
                        //     </div>

                        //     <div className="flex-1">
                        //         {designLabs.map((design, index) => (
                        //             <DesignLabListRow 
                        //                 key={design._id}
                        //                 design={design} 
                        //                 index={index} 
                        //                 handleView={handleView}
                        //                 handleDelete={handleDelete}
                        //                 deletePending={deleteMutation.isPending && deleteMutation.variables === design._id}
                        //             />
                        //         ))}
                        //     </div>

                        //     {/* Footer Loaders/Messages */}
                        //     <div className="py-6 text-center border-t border-gray-100 bg-gray-50/50 mt-auto shrink-0">
                        //         {isFetchingNextPage ? (
                        //             <div className="flex items-center justify-center gap-2 text-blue-600">
                        //                 <i className="fas fa-spinner fa-spin"></i>
                        //                 <span className="text-sm font-medium">Loading more designs...</span>
                        //             </div>
                        //         ) : !hasNextPage ? (
                        //             <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        //                 — End of List —
                        //             </p>
                        //         ) : null}
                        //     </div>
                        // </div>



                        <div
                            ref={scrollContainerRef}
                            className="flex-1 bg-gray-50/50 rounded-xl overflow-y-auto custom-scrollbar flex flex-col p-6" // Added padding and bg color
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
                                    <div className="flex flex-col items-center gap-2 text-blue-600">
                                        <i className="fas fa-circle-notch fa-spin text-xl"></i>
                                        <span className="text-sm font-medium">Loading more designs...</span>
                                    </div>
                                ) : !hasNextPage && designLabs.length > 0 ? (
                                    <div className="flex items-center justify-center gap-2 opacity-50">
                                        <span className="h-px w-12 bg-gray-300"></span>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">End of Collection</p>
                                        <span className="h-px w-12 bg-gray-300"></span>
                                    </div>
                                ) : designLabs.length === 0 && !isFetchingNextPage ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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