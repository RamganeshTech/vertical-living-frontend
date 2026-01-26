import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useAuthCheck } from '../../Hooks/useAuthCheck';
import { useDebounce } from '../../Hooks/useDebounce';
import { useDeleteCutlist, useGetAllCutlists } from '../../apiList/cutlist_Api/cutlistApi';
import { toast } from '../../utils/toast';
import { Button } from '../../components/ui/Button';
import { useGetProjects } from '../../apiList/projectApi';
import type { AvailableProjetType } from '../Department Pages/Logistics Pages/LogisticsShipmentForm';

const CutlistMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auth & Permissions
    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.cutlist?.list;
    const canCreate = role === "owner" || permission?.cutlist?.create;

    // Check if we're on a child route (Detail or Create view)
    const isDetailView = location.pathname.includes('/cutlistsingle') || location.pathname.includes('/create');

    const { data: projectData } = useGetProjects(organizationId!);
    const projects = projectData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        projectId: '',
        projectName: '',
        startDate: '',     // Transaction Date From
        endDate: '',       // Transaction Date To
    });

    const debouncedSearch = useDebounce(filters.search, 700);
    const debouncedStartDate = useDebounce(filters.startDate, 800);
    const debouncedEndDate = useDebounce(filters.endDate, 800);


    // Infinite query for Cutlists
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllCutlists({
        organizationId: organizationId || '',
        projectId: filters.projectId || undefined,
        limit: 20,
        startDate: debouncedStartDate, // <--- Used here
        endDate: debouncedEndDate,
        search: debouncedSearch
    });

    const deleteMutation = useDeleteCutlist();

    // Infinite Scroll Implementation
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
            toast({ title: "Success", description: "Cutlist removed successfully" });
            refetch();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Failed to delete cutlist",
                variant: "destructive"
            });
        }
    };

    const handleView = (id: string) => {
        navigate(`cutlistsingle/${id}`);
    };

    const clearFilters = () => {
        setFilters({
            search: '', projectId: '',
            projectName: "",
            startDate: '',     // Transaction Date From
            endDate: '',       // Transaction Date To
        });
    };

    const cutlists = data?.pages.flatMap(page => page.data) || [];
    const activeFiltersCount = Object.values(filters).filter(val => val !== '').length;

    if (isDetailView) return <Outlet />;

    return (
        <div className="space-y-4 h-full p-2">
            {/* Header Section */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-th-list mr-3 text-blue-600"></i>
                        Cutlist Management
                    </h1>
                </div>

                <div className="flex gap-2">
                    {canCreate && (
                        <Button onClick={() => navigate('create')}>
                            <i className="fas fa-plus mr-2" />
                            Create New Cutlist
                        </Button>
                    )}
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-500 text-lg">{(error as any)?.message || "Failed to load cutlists"}</p>
                    <Button onClick={() => refetch()} className="mt-4">Retry</Button>
                </div>
            ) : (
                <main className="flex gap-4 h-[calc(100vh-150px)]">
                    {/* Filters Sidebar */}
                    <aside className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm p-6 border border-gray-100 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i> Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800">
                                    Clear All ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search Cutlists</label>
                                <input
                                    type="text"
                                    placeholder="Cutlist #, Client Name..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                <select
                                    value={filters?.projectId || ''}
                                    onChange={(e) => {
                                        const selected = projects?.find((p: any) => p._id === e.target.value);
                                        if (selected) {
                                            setFilters(prev => ({
                                                ...prev,
                                                projectId: selected._id,
                                                projectName: selected.projectName,
                                            }));
                                        } else {
                                            setFilters(prev => ({ ...prev, projectId: "", projectName: "" }));
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">All Projects</option>
                                    {projects?.map((project: any) => (
                                        <option key={project._id} value={project._id}>{project.projectName}</option>
                                    ))}
                                </select>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">From</span>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">To</span>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>


                    </aside>

                    {/* Data Table Section */}
                    <section className="flex-1 flex flex-col min-w-0">
                        {cutlists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border border-dashed border-gray-300">
                                <i className="fas fa-clipboard-list text-5xl text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-500">No Cutlists Found</h3>
                            </div>
                        ) : (
                            <div ref={scrollContainerRef} className="overflow-y-auto rounded-xl border border-gray-200 bg-white">
                                {/* <div className="sticky top-0 z-20 bg-blue-50 grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-700 text-sm"> */}
                                    <div className="sticky top-0 z-20 bg-blue-50 grid grid-cols-11 gap-4 px-6 py-4 font-semibold text-gray-700 text-sm border-b border-gray-200">
                                        <div className="col-span-1">S.No</div>
                                        <div className="col-span-2">Date</div> {/* Added Date Column */}
                                        <div className="col-span-2">Cutlist No</div>
                                        <div className="col-span-2">Project</div> {/* Added Project Column */}
                                        <div className="col-span-2">Client Name</div>
                                        {/* <div className="col-span-2 text-center">Status</div> */}
                                        <div className="col-span-2 text-center">Actions</div>
                                    </div>

                                <div className="divide-y divide-gray-100">
                                    {cutlists.map((cl: any, index: number) => (
                                        <div
                                            key={cl._id?.toString()}
                                            onClick={() => handleView(cl._id!.toString())} // Whole list acts as view
                                            className="grid grid-cols-11 gap-4 px-6 py-4 items-center hover:bg-blue-50/50 cursor-pointer transition-colors text-sm"
                                        >
                                            <div className="col-span-1 text-gray-500">{index + 1}</div>

                                            {/* 1. Date Column (createdAt) */}
                                            <div className="col-span-2 text-gray-600">
                                                {cl.createdAt ? new Date(cl.createdAt).toLocaleDateString('en-GB') : '—'}
                                            </div>

                                            <div className="col-span-2 font-medium text-blue-600">{cl.cutlistNo}</div>

                                            {/* 2. Project Name Column */}
                                            <div className="col-span-2 text-gray-600 truncate" title={cl.projectId?.projectName}>
                                                {cl.projectId?.projectName || '—'}
                                            </div>

                                            <div className="col-span-2 font-medium text-gray-800">{cl.clientName}</div>

                                            {/* <div className="col-span-2 text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cl.isLocked ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {cl.isLocked ? 'Locked' : 'Draft'}
                                                </span>
                                            </div> */}

                                            <div className="col-span-2 flex justify-center gap-4">
                                                {/* Visual eye icon stays for UI clarity, but row click handles logic */}
                                                {/* <button className="text-blue-500 hover:text-blue-700">
                                                    <i className="fas fa-eye" />
                                                </button> */}

                                                {!cl.isLocked && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Stops handleView from triggering
                                                            handleDelete(cl._id!.toString());
                                                        }}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-all"
                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isFetchingNextPage && (
                                    <div className="p-4 text-center text-blue-600">
                                        <i className="fas fa-spinner fa-spin mr-2" /> Loading more...
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </main>
            )}
        </div>
    );
};

export default CutlistMain;