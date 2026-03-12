// import  { useState, useRef, useEffect } from 'react';
// import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
// import { useAuthCheck } from '../../../Hooks/useAuthCheck';
// import { useDebounce } from '../../../Hooks/useDebounce';
// import { useDeleteMapping, useGetAllMappings } from '../../../apiList/pincode_api/pincodeMappingApi';
// // import { Breadcrumb } from '../../Department Pages/Breadcrumb';
// import { Button } from '../../../components/ui/Button';
// import PincodeVendorMappingList from './PincodeVendorMappingList';


export interface IVendorPincodeMapping {
    _id: string;
    organizationId: string;
    vendorId: {
        _id: string;
        companyName: string;
        vendorCategory: string;
    };
    pincodeId: {
        _id: string;
        pincode: string;
        areaName: string;
        state: string;
    };
    vendorRole: "Primary" | "Secondary" | "Backup";
    serviceMode: "Direct" | "Hybrid" | "Partner";
    priorityRank: number;
    minOrderValue: number;
    maxProjectValue: number;
    rateMultiplier: number;
    travelRule: string;
    serviceVisitRule: string;
    siteVisitSlaDays: number;
    installSlaDays: number;
    complaintSlaHours: number;
    premiumJobAllowed: boolean;
    repairJobAllowed: boolean;
    activeStatus: boolean;
    notes: string | null;
    createdAt: string;
}


// const PincodeVendorMappingMain = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { organizationId } = useParams();
//     const scrollContainerRef = useRef<HTMLDivElement>(null);

//     const { role, permission } = useAuthCheck();
//     const canList = role === "owner" || permission?.pincodeMapping?.list;
//     const canCreate = role === "owner" || permission?.pincodeMapping?.create;

//     const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');

//     const [filters, setFilters] = useState({
//         search: '',
//         vendorRole: '',
//         serviceMode: '',
//         sortBy: 'priorityRank',
//         sortOrder: 'asc' as 'asc' | 'desc',
//     });

//     const debouncedSearch = useDebounce(filters.search, 700);

//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//         error,
//         refetch
//     } = useGetAllMappings({
//         organizationId: organizationId || '',
//         vendorRole: filters.vendorRole || undefined,
//         serviceMode: filters.serviceMode || undefined,
//         limit: 15,
//         search: debouncedSearch || undefined,
//     });

//     const deleteMappingMutation = useDeleteMapping();

//     useEffect(() => {
//         const container = scrollContainerRef.current;
//         if (!container) return;
//         const handleScroll = () => {
//             const { scrollTop, scrollHeight, clientHeight } = container;
//             if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
//                 fetchNextPage();
//             }
//         };
//         container.addEventListener('scroll', handleScroll);
//         return () => container.removeEventListener('scroll', handleScroll);
//     }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteMappingMutation.mutateAsync(id);
//             refetch();
//         } catch (err: any) {
//             console.error(err);
//         }
//     };

//     const handleView = (id: string) => navigate(`single/${id}`);

//     const mappings = data?.pages.flatMap(page => page.data) || [];

//     if (isDetailView) return <Outlet />;

//     return (
//         <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
//             <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-40">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//                         <i className="fas fa-network-wired mr-3 text-blue-600"></i>
//                         Vendor Coverage Mapping
//                     </h1>
//                     {/* <Breadcrumb paths={[{ label: "Pincode Master", path: ".." }, { label: "Vendor Mapping", path: "." }]} /> */}
//                 </div>
//                 <div className="flex gap-2">
//                     {canCreate && (
//                         <Button onClick={() => navigate('create')} className="bg-blue-600 text-white font-bold px-6 rounded-xl shadow-lg shadow-blue-100">
//                             <i className="fas fa-plus mr-2" /> Map New Vendor
//                         </Button>
//                     )}
//                 </div>
//             </header>



//             {isLoading ? (
//                 <div className="flex justify-center items-center py-12">
//                     <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
//                 </div>
//             ) : isError ? (
//                 <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 text-center rounded-lg">
//                     <p className="text-red-500 mb-4">{(error as any)?.message}</p>
//                     <Button onClick={() => refetch()}>Retry</Button>
//                 </div>
//             ) : (

//             <main className="flex-1 flex gap-2 overflow-hidden p-2">
//                 {/* Modern Filters Sidebar [cite: 681-683] */}
//                 <div className="xl:w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-y-auto">
//                     <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
//                         <i className="fas fa-filter mr-2 text-blue-500"></i> Operational Filters
//                     </h3>
//                     <div className="space-y-6">
//                         <div>
//                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Search [cite: 363-366]</label>
//                             <input type="text" className="w-full pro-input" placeholder="Vendor or Pincode..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
//                         </div>
//                         <div>
//                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vendor Role [cite: 289]</label>
//                             <select className="w-full pro-select" value={filters.vendorRole} onChange={e => setFilters({...filters, vendorRole: e.target.value})}>
//                                 <option value="">All Roles</option>
//                                 <option value="Primary">Primary Vendors</option>
//                                 <option value="Secondary">Secondary Vendors</option>
//                                 <option value="Backup">Backup Support</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Modern List View */}
//                {canList && <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className="flex-shrink-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100 grid grid-cols-13 gap-4 px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-wider text-center">
//                         <div className="col-span-1">S.No</div>
//                         <div className="col-span-3 text-left">Vendor Details [cite: 287]</div>
//                         <div className="col-span-2">Pincode [cite: 286]</div>
//                         <div className="col-span-2">Role & Mode [cite: 288-289]</div>
//                         <div className="col-span-2">Commercials [cite: 296-298]</div>
//                         <div className="col-span-2">SLAs (Days) </div>
//                         <div className="col-span-1">Actions</div>
//                     </div>

//                     <div ref={scrollContainerRef} className="flex-1 overflow-y-auto divide-y divide-gray-50">
//                         {mappings.map((mapping:any, idx:number) => (
//                             <PincodeVendorMappingList 
//                                 key={mapping._id} 
//                                 mapping={mapping} 
//                                 index={idx} 
//                                 handleView={handleView} 
//                                 handleDelete={handleDelete} 
//                                 deletePending={deleteMappingMutation.isPending && deleteMappingMutation.variables === mapping._id}
//                             />
//                         ))}
//                         {isFetchingNextPage && <div className="p-8 text-center"><i className="fas fa-spinner fa-spin text-blue-600"></i></div>}
//                     </div>
//                 </div>}
//             </main>
//             )}
//         </div>
//     );
// };

// export default PincodeVendorMappingMain;



import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
// import { useDebounce } from '../../../Hooks/useDebounce';
import { useDeleteMapping, useGetAllMappings } from '../../../apiList/pincode_api/pincodeMappingApi';
import { Button } from '../../../components/ui/Button';
import PincodeVendorMappingList from './PincodeVendorMappingList';
import StageGuide from '../../../shared/StageGuide';

const PincodeVendorMappingMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.pincodeMapping?.list;
    const canCreate = role === "owner" || permission?.pincodeMapping?.create;

    const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');

    // 1. Unified Filter State
    const [filters, setFilters] = useState({
        search: '',
        vendorRole: '',
        serviceMode: '',
        sortBy: 'priorityRank',
        sortOrder: 'asc' as 'asc' | 'desc',
    });

    // const debouncedSearch = useDebounce(filters.search, 700);

    // 2. Updated Hook Call with debounced search
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllMappings({
        organizationId: organizationId || '',
        vendorRole: filters.vendorRole || undefined,
        serviceMode: filters.serviceMode || undefined,
        limit: 15,
        // search: debouncedSearch || undefined,
    });

    const deleteMappingMutation = useDeleteMapping();

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
            await deleteMappingMutation.mutateAsync(id);
            refetch();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleView = (id: string) => navigate(`single/${id}`);

    const clearFilters = () => {
        setFilters({
            search: '',
            vendorRole: '',
            serviceMode: '',
            sortBy: 'priorityRank',
            sortOrder: 'asc',
        });
    };

    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 'priorityRank' && val !== 'asc'
    ).length;

    const mappings = data?.pages.flatMap(page => page.data) || [];

    if (isDetailView) return <Outlet />;

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* Standardized Header */}
            <header className="flex-shrink-0 bg-white px-6 py-4 flex justify-between items-center  z-40">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-network-wired mr-3 text-blue-600"></i>
                        Pincode & Vendor Mapping
                    </h1>
                    {/* <p className="text-gray-500 text-xs mt-1 font-medium italic">
                        Settings &bull; Pincode Master &bull; Vendor Mapping
                    </p> */}
                </div>
                <div className="flex gap-2">
                    {canCreate && (
                        <Button onClick={() => navigate('create')} className="bg-blue-600 text-white font-bold px-6 rounded-xl shadow-lg shadow-blue-100 transition-all hover:bg-blue-700">
                            <i className="fas fa-plus mr-2" /> Map New Vendor
                        </Button>
                    )}
                    <StageGuide organizationId={organizationId!} stageName="pincode" />
                </div>
            </header>

            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <i className="fas fa-circle-notch fa-spin text-blue-600 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 text-center rounded-2xl border border-red-100 shadow-sm">
                    <p className="text-red-500 font-bold mb-4">{(error as any)?.message || "Failed to load mappings"}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white">Retry Connection</Button>
                </div>
            ) : (
                <main className="flex-1 flex gap-2 overflow-hidden p-3 h-[90%]">
                    {/* Clean Modern Filters Sidebar */}
                    <div className="xl:w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-500"></i> Operational Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="text-xs text-blue-600 font-bold underline decoration-2">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="space-y-8">
                            {/* <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Search Logic</label>
                                <input
                                    type="text"
                                    className="w-full pro-input-modern"
                                    placeholder="Vendor name or pincode..."
                                    value={filters.search}
                                    onChange={e => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div> */}

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vendor Role</label>
                                <select
                                    className="w-full pro-select-modern"
                                    value={filters.vendorRole}
                                    onChange={e => setFilters({ ...filters, vendorRole: e.target.value })}
                                >
                                    <option value="">All Roles</option>
                                    <option value="Primary">Primary Vendors</option>
                                    <option value="Secondary">Secondary Vendors</option>
                                    <option value="Backup">Backup Support</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Service Mode</label>
                                <select
                                    className="w-full pro-select-modern"
                                    value={filters.serviceMode}
                                    onChange={e => setFilters({ ...filters, serviceMode: e.target.value })}
                                >
                                    <option value="">All Modes</option>
                                    <option value="Direct">Direct Core</option>
                                    <option value="Hybrid">Hybrid Controlled</option>
                                    <option value="Partner">Partner Managed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Standardized List View Container */}
                    {canList && <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-200 grid grid-cols-13 gap-4 px-6 py-4 font-bold text-gray-600 text-[11px] uppercase tracking-widest text-center">
                                <div className="col-span-1">S.No</div>
                                <div className="col-span-3 text-left pl-4">Business Identity</div>
                                <div className="col-span-2 text-left">Contact Person</div>
                                <div className="col-span-2">Vendor Category</div>
                                <div className="col-span-2">Service Area</div>
                                <div className="col-span-2">Regional District</div>
                                <div className="col-span-1 text-right pr-4">Actions</div>
                        </div>

                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                            {mappings.length === 0 ? (
                                <div className="p-20 text-center space-y-4">
                                    <i className="fas fa-map-marked-alt text-6xl text-gray-100"></i>
                                    <p className="text-gray-400 font-bold tracking-tight">No active vendor mappings found for these filters</p>
                                </div>
                            ) : (
                                <>
                                    {mappings.map((mapping: any, idx: number) => (
                                        <PincodeVendorMappingList
                                            key={mapping._id}
                                            mapping={mapping}
                                            index={idx}
                                            handleView={handleView}
                                            handleDelete={handleDelete}
                                            deletePending={deleteMappingMutation.isPending && deleteMappingMutation.variables === mapping._id}
                                        />
                                    ))}
                                    {isFetchingNextPage && (
                                        <div className="p-10 text-center text-blue-600">
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            <span className="text-xs font-bold uppercase tracking-widest">Fetching more coverage...</span>
                                        </div>
                                    )}
                                    {!hasNextPage && mappings.length > 0 && (
                                        <div className="p-8 text-center border-t border-gray-50 bg-gray-50/30">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                                All regional mappings fully loaded
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>}
                </main>
            )}

            <style>{`
                .pro-input-modern {
                    width: 100%;
                    padding: 0.85rem 1.25rem;
                    background: #fff;
                    border: 2.5px solid #f1f5f9;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #1e293b;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .pro-input-modern:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.08);
                }
                .pro-select-modern {
                    appearance: none;
                    width: 100%;
                    padding: 0.85rem 1.25rem;
                    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1.25rem center;
                    border: 2.5px solid #f1f5f9;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #1e293b;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .pro-select-modern:focus {
                    outline: none;
                    border-color: #3b82f6;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};

export default PincodeVendorMappingMain;