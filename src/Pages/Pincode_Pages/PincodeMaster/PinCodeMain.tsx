import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import { useDebounce } from '../../../Hooks/useDebounce';
import { useDeletePincode, useGetAllPincodes } from '../../../apiList/pincode_api/pincodeApi';
import { toast } from '../../../utils/toast';
// import { Breadcrumb } from '../../Department Pages/Breadcrumb';
import { Button } from '../../../components/ui/Button';
import StageGuide from '../../../shared/StageGuide';
import PincodeListRow from './PincodeListRow';
export interface PincodeFormData {
    _id?: string;
    pincode: string;
    areaName: string;
    localityName: string;
    taluk: string;
    district: string | null;
    zone: string | null;
    state: string;
    latitude: number | null;
    longitude: number | null;
    urbanClassification: "Urban" | "Semi-Urban" | "Rural";
    activeStatus: boolean;
    serviceStatus: "Active" | "Restricted" | "Blocked" | "Approval Required";
    serviceMode: "Direct Core" | "Direct Extended" | "Hybrid" | "Partner Managed";
    approvalRequired: boolean;
    minOrderValue: number;
    directMarginPercent: number;
    partnerMarginPercent: number;
    transportFactor: number;
    installFactor: number;
    serviceFactor: number;
    complexityFactor: number;
    riskLevel: "Low" | "Medium" | "High";
    notes: string;
}

const PinCodeMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.pincode?.list;
    const canCreate = role === "owner" || permission?.pincode?.create;

    // const paths = [
    //     { label: "Settings", path: `/organizations/${organizationId}/settings` },
    //     { label: "Pincode Master", path: `/organizations/${organizationId}/pincode` },
    // ];

    // --- Local State ---
    const isDetailView = location.pathname.includes('/single/') || location.pathname.includes('/create');

    // Filter states based on PincodeMasterModel fields [cite: 79-96]
    const [filters, setFilters] = useState({
        search: '',
        startDate: '',
        endDate: '',
        urbanClassification: '',
        serviceStatus: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    const debouncedSearch = useDebounce(filters.search, 700);

    // Infinite query for Pincode Master [cite: 669]
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllPincodes({
        organizationId: organizationId || '',
        limit: 20,
        search: debouncedSearch || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        urbanClassification: filters.urbanClassification || undefined,
        serviceStatus: filters.serviceStatus || undefined,
    });

    const deletePincodeMutation = useDeletePincode();

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
            await deletePincodeMutation.mutateAsync(id);
            refetch();
            toast({ title: "Success", description: "Pincode record deleted" });
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
            startDate: '',
            endDate: '',
            urbanClassification: '',
            serviceStatus: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 'createdAt' && val !== 'desc'
    ).length;

    const pincodes = data?.pages.flatMap(page => page.data) || [];

    if (isDetailView) return <Outlet />;

    return (
        <div className="space-y-0 h-full">
            {/* Header */}
            <header className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-map-marker-alt mr-3 text-blue-600"></i>
                        Pincode Master
                    </h1>
                    {/* <Breadcrumb paths={paths} /> */}
                </div>

                <div className='flex gap-2'>
                    {canCreate && (
                        <Button onClick={() => navigate('create')}>
                            <i className="fas fa-plus mr-2" />
                            Add Pincode
                        </Button>
                    )}
                    <StageGuide organizationId={organizationId!} stageName="pincode" />
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 text-center rounded-lg">
                    <p className="text-red-500 mb-4">{(error as any)?.message}</p>
                    <Button onClick={() => refetch()}>Retry</Button>
                </div>
            ) : (
                <main className="flex gap-2 !max-h-[93%] h-[93%]">
                    {/* Filters Sidebar [cite: 362] */}
                    <div className="xl:w-80 flex-shrink-0 !max-h-[90%] overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i> Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-sm text-blue-600 font-medium">
                                        Clear ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Search Areas</label>
                                    <input
                                        type="text"
                                        placeholder="Pincode, Area, Taluk..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Service Status</label>
                                    <select
                                        value={filters.serviceStatus}
                                        onChange={(e) => setFilters(f => ({ ...f, serviceStatus: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Restricted">Restricted</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Urban Classification</label>
                                    <select
                                        value={filters.urbanClassification}
                                        onChange={(e) => setFilters(f => ({ ...f, urbanClassification: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="">All</option>
                                        <option value="Urban">Urban</option>
                                        <option value="Semi-Urban">Semi-Urban</option>
                                        <option value="Rural">Rural</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                   

                    {/* 2. Modern Grid List View */}
                    {canList && <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Table Header - Sticky */}
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 sticky top-0 z-10">
                            <div className="grid grid-cols-13 gap-4 px-6 py-4 font-bold text-gray-700 text-sm">
                                <div className="col-span-1 text-center">S.No</div>
                                <div className="col-span-2 text-center">Pincode</div>
                                <div className="col-span-3 text-center">Area Name</div>
                                <div className="col-span-2 text-center">City</div>
                                <div className="col-span-2 text-center">Service Mode</div>
                                <div className="col-span-2 text-center">Status</div>
                                <div className="col-span-1 text-center">Actions</div>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto divide-y divide-gray-100"
                        >
                            {pincodes.length === 0 && !isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                    <i className="fas fa-map-marked-alt text-5xl text-blue-200 mb-4" />
                                    <h3 className="text-lg font-semibold text-blue-800">No Pincodes Found</h3>
                                    <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                                </div>
                            ) : (
                                <>
                                    {pincodes.map((item, idx) => (
                                        <PincodeListRow
                                            key={item._id}
                                            pincodeItem={item}
                                            index={idx}
                                            handleView={handleView}
                                            handleDelete={handleDelete}
                                            deletePending={deletePincodeMutation.isPending && deletePincodeMutation.variables === item._id}
                                        />
                                    ))}

                                    {/* Infinite Loading Indicator */}
                                    {isFetchingNextPage && (
                                        <div className="p-8 flex justify-center border-t border-gray-50">
                                            <div className="flex items-center gap-3 text-blue-600 font-semibold">
                                                <i className="fas fa-circle-notch fa-spin text-xl"></i>
                                                <span>Loading more areas...</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* End of List */}
                                    {!hasNextPage && pincodes.length > 0 && (
                                        <div className="p-8 text-center text-gray-400 text-sm font-medium border-t border-gray-50 bg-gray-50/30">
                                            <i className="fas fa-check-circle mr-2"></i>
                                            All Tamil Nadu pincodes loaded
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    }
                </main>
            )}
        </div>
    );
};

export default PinCodeMain;