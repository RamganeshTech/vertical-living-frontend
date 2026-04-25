import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useAuthCheck } from '../../Hooks/useAuthCheck';
import { useDebounce } from '../../Hooks/useDebounce';
import { useDeleteCutlist, useGetAllCutlists } from '../../apiList/cutlist_Api/cutlistApi';
import { toast } from '../../utils/toast';
import { Button } from '../../components/ui/Button';
import { useGetProjects } from '../../apiList/projectApi';
import type { AvailableProjetType } from '../Department Pages/Logistics Pages/LogisticsShipmentForm';
import { dateFormate } from '../../utils/dateFormator';

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
        limit: 10,
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
                description: err?.response?.data?.message || err?.message || "Failed to delete cutlist",
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
        <div className="space-y-4 h-full p-2 bg-brand-surface">
            {/* Header Section */}
            <header className="flex justify-between items-center pb-2 border-b border-ash-light">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center">
                        <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center
                         justify-center shadow-sm mr-3">
                            <i className="fas fa-th-list text-text-muted"></i>
                        </div>
                        Cutlist Management
                    </h1>
                </div>

                <div className="flex gap-2">
                    {canCreate && (
                        <Button onClick={() => navigate('create')}
                            variant="dark"
                            className="flex items-center gap-2 shadow-sm h-10 px-4"
                        >
                            <i className="fas fa-plus mr-2" />
                            {/* Create New Cutlist */}
                            <span className="text-xs font-bold">Create New Cutlist</span>
                        </Button>
                    )}
                </div>
            </header>

            {isLoading ? (
                <div className="flex-1 flex justify-center items-center bg-brand-ash/20 rounded-xl border border-ash-light border-dashed">
                    <div className="flex flex-col items-center gap-4">
                        <i className="fas fa-circle-notch fa-spin text-4xl text-action-primary"></i>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted animate-pulse">Loading Cutlists</p>
                    </div>
                </div>
            ) : isError ? (
                // <div className="mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                //     <p className="text-red-500 text-lg">{(error as any)?.message || "Failed to load cutlists"}</p>
                //     <Button onClick={() => refetch()} className="mt-4">Retry</Button>
                // </div>

                <div className="mx-auto mt-4 p-8 bg-brand-surface border border-action-danger/30 rounded-xl shadow-sm text-center max-w-md w-full">
                    <div className="text-action-danger font-bold mb-3 text-lg flex items-center justify-center gap-2 uppercase tracking-tight">
                        <i className="fas fa-exclamation-triangle"></i> Oops, Something went wrong!
                    </div>
                    <p className="text-text-muted text-xs mb-6 font-medium">{(error as any)?.message || "Failed to load cutlists"}</p>
                    <Button onClick={() => refetch()} variant="outline" className="border-ash-dark text-text-main hover:bg-brand-ash px-8 h-9">Retry</Button>
                </div>
            ) : (
                <main className="flex gap-4 h-[calc(100vh-150px)]">
                    {/* Filters Sidebar */}
                    <aside className="w-70 flex-shrink-0 bg-brand-surface/40 rounded-xl shadow-sm p-2 border border-ash-medium overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 border-b border-ash-medium">
                            <h3 className="text-lg font-semibold flex items-center text-text-main">
                                <i className="fas fa-filter mr-2 text-action-primary"></i> Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters}
                                    //  className="text-sm text-blue-600 hover:text-blue-800"
                                    className="text-[10px] text-action-primary hover:text-text-strong font-bold"
                                >
                                    Clear All ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Search Cutlists</label>
                                <input
                                    type="text"
                                    placeholder="Cutlist #, Client Name..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg 
                                    focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 outline-none
                                    placeholder:text-text-soft
                                    "
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Project</label>
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
                                    className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg 
                                    focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 placeholder:text-text-soft"
                                >
                                    <option value="">All Projects</option>
                                    {projects?.map((project: any) => (
                                        <option key={project._id} value={project._id}>{project.projectName}</option>
                                    ))}
                                </select>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Date Range</label>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">From</span>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg 
                                            focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 outline-none text-sm
                                            placeholder:text-text-soft
                                            "
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">To</span>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg 
                                            focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 outline-none text-sm
                                            placeholder:text-text-soft
                                            "
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>


                    </aside>

                    {/* Data Table Section */}
                    <section className="flex-1 flex flex-col min-w-0 bg-brand-surface border border-ash-medium rounded-xl">
                        {cutlists.length === 0 ? (
                            // <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border border-dashed border-gray-300">
                            //     <i className="fas fa-clipboard-list text-5xl text-gray-300 mb-4" />
                            //     <h3 className="text-lg font-medium text-gray-500">No Cutlists Found</h3>
                            // </div>

                            <div className="flex flex-col items-center justify-center h-full bg-brand-ash/10">
                                <div className="w-20 h-20 bg-brand-surface border border-ash-medium rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <i className="fas fa-clipboard-list text-3xl text-text-soft" />
                                </div>
                                <h3 className="text-sm font-bold text-text-strong uppercase tracking-wide">No Cutlists Found</h3>
                                <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">Adjust filters or create a new one.</p>
                            </div>
                        ) : (
                            <div ref={scrollContainerRef} className="overflow-y-auto rounded-xl ">
                                {/* <div className="sticky top-0 z-20 bg-blue-50 grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-text-muted text-sm"> */}
                                <div className="sticky top-0 z-20 bg-brand-ash/80  grid grid-cols-11 gap-4 px-6 py-4 font-semibold text-text-muted text-sm border-b border-ash-medium">
                                    <div className="col-span-1 text-center">S.No</div>
                                    <div className="col-span-2 text-center">Cutlist No</div>
                                    <div className="col-span-2 text-center">Date</div> {/* Added Date Column */}
                                    <div className="col-span-2 text-center">Project</div> {/* Added Project Column */}
                                    <div className="col-span-2 text-center">Client Name</div>
                                    {/* <div className="col-span-2 text-center">Status</div> */}
                                    <div className="col-span-2 text-center">Actions</div>
                                </div>

                                <div className="divide-y divide-ash-light">
                                    {cutlists.map((cl: any, index: number) => (
                                        <div
                                            key={cl._id?.toString()}
                                            onClick={() => handleView(cl._id!.toString())} // Whole list acts as view
                                            className="grid grid-cols-11 gap-4 px-6 py-4 items-center hover:bg-brand-surface-hover cursor-pointer transition-colors text-sm"
                                        >
                                            <div className="col-span-1 text-text-soft text-center">{index + 1}</div>

                                            <div className="col-span-2 font-medium text-action-primary text-center">{cl.cutlistNo}</div>

                                            {/* 1. Date Column (createdAt) */}
                                            <div className="col-span-2 text-text-muted text-center">
                                                {cl.createdAt ? dateFormate(cl.createdAt) : '—'}
                                            </div>


                                            {/* 2. Project Name Column */}
                                            <div className="col-span-2 text-action-primary truncate  text-center" title={cl.projectId?.projectName}>
                                                {cl.projectId?.projectName || '—'}
                                            </div>

                                            <div className="col-span-2 font-medium text-action-primary text-center">{cl.clientName || '—'}</div>

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

                                                { (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Stops handleView from triggering
                                                            handleDelete(cl._id!.toString());
                                                        }}
                                                        // className="text-red-500 cursor-pointer text-center hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-all"
                                                        className="text-action-danger cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border border-transparent hover:border-ash-medium hover:bg-brand-surface hover:shadow-sm hover:scale-110 transition-all"
                                                    >
                                                        {/* {deleteMutation.isPending && deleteMutation.variables. ? <i className="fas fa-spinner animate-spin" /> : <i className="fas fa-trash-alt" />} */}

                                                        {deleteMutation.isPending && deleteMutation.variables === cl._id?.toString()
                                                            ? <i className="fas fa-spinner animate-spin" />
                                                            : <i className="fas fa-trash-alt" />
                                                        }

                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isFetchingNextPage && (
                                    <div className="p-6 text-center text-action-primary flex items-center justify-center gap-2">
                                        <i className="fas fa-circle-notch fa-spin text-sm" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-text-soft">Loading more...</span>
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