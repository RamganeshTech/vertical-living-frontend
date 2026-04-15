import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import { useDebounce } from '../../../Hooks/useDebounce';
import { toast } from '../../../utils/toast';
import { Button } from '../../../components/ui/Button';
import StageGuide from '../../../shared/StageGuide';
import PincodeProjectAssignmentRow from './PincodeProjectAssignmentRow';
import { useDeleteAssignment, useGetAllAssignments } from '../../../apiList/pincode_api/pincodeVendorProjectAssignmentApi';
import { useGetProjects } from '../../../apiList/projectApi';
import type { AvailableProjetType } from '../../Department Pages/Logistics Pages/LogisticsShipmentForm';
import { useGetExecutionPartnerForDropDown } from '../../../apiList/Department Api/Accounting Api/executionPartnerApi';

const PincodeVendorProjectAssignMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { role, permission } = useAuthCheck();

    // Updated Permission check based on your requirement
    const canList = role === "owner" || permission?.pincodeproject?.list;
    const canCreate = role === "owner" || permission?.pincodeproject?.create;

    // --- Local State ---
    const isDetailView = location.pathname.includes('/single/') || location.pathname.includes('/create');

    const { data: projectData } = useGetProjects(organizationId!)
    const { data: executionPartnerData } = useGetExecutionPartnerForDropDown(organizationId!);


    const projects = projectData?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))

    const executionPartnersOptions = useMemo(() => (executionPartnerData || [])?.map((v: any) => ({ _id: v._id, firstName: v.firstName })), []);

    console.log("vendoropitiions", executionPartnersOptions)

    const [filters, setFilters] = useState({
        search: '',
        status: '', // pending, accepted, rejected, etc.
        sortBy: 'createdAt',
        projectId: "",
        projectName: "",
        vendorId: "",
        vendorName: "",
        sortOrder: 'desc' as 'asc' | 'desc',
        startDate: "",
        endDate: "",
    });

    const debouncedSearch = useDebounce(filters.search, 700);

    const debouncedStartDate = useDebounce(filters.startDate, 800);
    const debouncedEndDate = useDebounce(filters.endDate, 800);

    // Infinite query for Assignments
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllAssignments({
        organizationId: organizationId || '',
        limit: 20,
        search: debouncedSearch || undefined, // Add to hook if needed
        startDate: debouncedStartDate || undefined, // Add to hook if needed
        endDate: debouncedEndDate || undefined, // Add to hook if needed
        status: filters.status || undefined,
        projectId: filters.projectId || undefined,
        vendorId: filters.vendorId || undefined,
    });

    const deleteAssignmentMutation = useDeleteAssignment();

    // Infinite scroll observer
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
            if (!window.confirm("Are you sure you want to remove this assignment?")) return;
            await deleteAssignmentMutation.mutateAsync(id);
            refetch();
            toast({ title: "Success", description: "Project assignment removed" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleView = (id: string) => {
        navigate(`single/${id}`);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            startDate: "",
            endDate: "",
            projectId: "",
            projectName: "",
            vendorId: "",
            vendorName: "",
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 'createdAt' && val !== 'desc'
    ).length;

    const assignments = data?.pages.flatMap(page => page.data) || [];

    if (isDetailView) return <Outlet />;

    return (
        <div className="space-y-0 h-full">
            {/* Header */}
            <header className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file-signature mr-3 text-indigo-600"></i>
                        Partner Project Allocation
                    </h1>
                </div>

                <div className='flex gap-2'>
                    {canCreate && (
                        <Button onClick={() => navigate('create')}>
                            <i className="fas fa-plus mr-2" />
                            Create
                        </Button>
                    )}
                    <StageGuide organizationId={organizationId!} stageName="pincode_assignment" />
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <i className="fas fa-spinner fa-spin text-indigo-600 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 text-center rounded-lg">
                    <p className="text-red-500 mb-4">{(error as any)?.message}</p>
                    <Button onClick={() => refetch()}>Retry</Button>
                </div>
            ) : (
                <main className="flex gap-2 !max-h-[93%] h-[93%]">
                    {/* Filters Sidebar */}
                    <div className="xl:w-80 flex-shrink-0 !max-h-[90%] overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-indigo-600"></i> Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-sm text-indigo-600 font-medium">
                                        Clear ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* <div>
                                    <label className="block text-sm font-medium mb-2">Search Project/Vendor</label>
                                    <input
                                        type="text"
                                        placeholder="Project Name, Vendor Name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div> */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                    <select
                                        value={filters.projectId || ''}
                                        onChange={(e) => {
                                            const selected = projects?.find((p: any) => p._id === e.target.value);
                                            setFilters(prev => ({
                                                ...prev,
                                                projectId: e.target.value,
                                                projectName: selected?.projectName || ""
                                            }));
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendors</label>
                                    <select
                                        value={filters.vendorId || ''}
                                        onChange={(e) => {
                                            const selected = executionPartnersOptions?.find((p: any) => p._id === e.target.value);
                                            setFilters(prev => ({
                                                ...prev,
                                                vendorId: e.target.value,
                                                vendorName: selected?.firstName || ""
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Vendors</option>
                                        {executionPartnersOptions?.map((vendor: any) => (
                                            <option key={vendor._id} value={vendor._id}>{vendor.firstName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Assignment Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        {/* <option value="rejected">Rejected</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option> */}
                                    </select>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, startDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, endDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Table List View */}
                    {canList && (
                        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="flex-shrink-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 sticky top-0 z-10">
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 font-bold text-gray-700 text-sm">
                                    <div className="col-span-1 text-center">S.No</div>
                                    <div className="col-span-3">Project Name</div>
                                    <div className="col-span-3">Partners Company</div>
                                    <div className="col-span-2 text-center">Status</div>
                                    <div className="col-span-2 text-center">Created At</div>
                                    {/* <div className="col-span-2 text-center">Acknowledged At</div> */}
                                    <div className="col-span-1 text-center">Actions</div>
                                </div>
                            </div>

                            <div
                                ref={scrollContainerRef}
                                className="flex-1 overflow-y-auto divide-y divide-gray-100"
                            >
                                {assignments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                        <i className="fas fa-file-invoice text-5xl text-indigo-200 mb-4" />
                                        <h3 className="text-lg font-semibold text-indigo-800">No Assignments Found</h3>
                                        <p className="text-sm text-gray-500">Assign a vendor to a project to get started.</p>
                                    </div>
                                ) : (
                                    <>
                                        {assignments.map((item: any, idx: number) => (
                                            <PincodeProjectAssignmentRow
                                                key={item._id}
                                                item={item}
                                                index={idx}
                                                handleView={handleView}
                                                handleDelete={handleDelete}
                                                deletePending={deleteAssignmentMutation.isPending && deleteAssignmentMutation.variables === item._id}
                                            />
                                        ))}

                                        {isFetchingNextPage && (
                                            <div className="p-8 flex justify-center border-t border-gray-50">
                                                <div className="flex items-center gap-3 text-indigo-600 font-semibold">
                                                    <i className="fas fa-circle-notch fa-spin text-xl"></i>
                                                    <span>Loading more...</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            )}
        </div>
    );
};

export default PincodeVendorProjectAssignMain;