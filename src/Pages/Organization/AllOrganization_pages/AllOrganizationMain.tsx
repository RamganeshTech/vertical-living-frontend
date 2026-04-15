import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useGetAllOrganizations } from '../../../apiList/organization_api/orgApi';
import { useDebounce } from '../../../Hooks/useDebounce';

// Types
interface OrgFilters {
    search?: string;
    type?: string;
    planType?: string;
    planStatus?: string;
}

interface Organization {
    _id: string;
    organizationName: string;
    type: string;
    email: string;
    organizationPhoneNo: string;
    logoUrl: string;
    planType: string;
    planStatus: string;
    createdAt: string;
}

const AllOrganizationMain = () => {
    const navigate = useNavigate();
    const location = useLocation();


    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState<OrgFilters>({
        search: "",
        type: "",
        planType: "",
        planStatus: "",
    });
    // 1. Get the debounced version of the search string only
    const debouncedSearch = useDebounce(activeFilters.search, 700);

    // 2. Get the debounced value (Do not change the hook)

    // 3. The Fix: Pass the combined object directly. 
    // We MUST include debouncedSearch here so the Hook's QueryKey updates.
    const { data: orgs, isLoading, isError, error } = useGetAllOrganizations({
        ...activeFilters,
        search: debouncedSearch // This overrides the 'fast' search with the 'slow' one
    });

    // // Debounce Search
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setActiveFilters(prev => ({ ...prev, search: searchTerm }));
    //     }, 500);
    //     return () => clearTimeout(timer);
    // }, [searchTerm]);

    // Handle Dropdown Changes
    const handleFilterChange = (key: keyof OrgFilters, value: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [key]: value === "all" ? undefined : value
        }));
    };

    // Clear All Filters
    const clearFilters = () => {
        setSearchTerm("");
        setActiveFilters({});
    };


    const isDetailView = location.pathname.includes('organization-dashboard');

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 470);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 470);
        window.addEventListener('resize', handleResize);
        // if (organizationId) setOrganizationId(organizationId);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isDetailView) {
        return <Outlet context={{
            isMobile,
            isMobileSidebarOpen,
            openMobileSidebar: () => setIsMobileSidebarOpen(true),
            closeMobileSidebar: () => setIsMobileSidebarOpen(false),
        }} />;
    }


    return (
        <main className="h-full max-h-full overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 font-poppins w-full">
            <div className="w-full flex flex-col space-y-6 animate-in fade-in duration-500">

                {/* --- UNIFIED ENTERPRISE CONTROL HEADER --- */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Top Section: Title & Actions */}
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 font-montserrat tracking-tight flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <i className="fa-regular fa-building text-sm"></i>
                                </div>
                                Organizations
                            </h1>
                            <p className="text-slate-500 text-sm mt-2 ml-11">
                                Manage your workspace directory, billing plans, and client profiles.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section: Integrated Filter Toolbar */}
                    <div className="p-4 bg-slate-50/50 flex flex-col xl:flex-row gap-4 items-center justify-between">

                        {/* Search */}
                        <div className="relative w-full xl:max-w-md group">
                            <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm"></i>
                            <input
                                type="text"
                                placeholder="Search by organization name..."
                                // CHANGE 1: Use activeFilters.search instead of searchTerm
                                value={activeFilters.search}
                                // CHANGE 2: Update activeFilters directly
                                onChange={(e) => setActiveFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                            />
                        </div>

                        {/* Filter Controls */}
                        <div className="flex w-full xl:w-auto gap-3 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar items-center">

                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                                <i className="fa-solid fa-chart-pie text-slate-400 text-xs"></i>
                                <select
                                    value={activeFilters.planStatus || "all"}
                                    onChange={(e) => handleFilterChange("planStatus", e.target.value)}
                                    className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none focus:ring-0 py-0.5 pl-1 pr-6"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                                <i className="fa-solid fa-layer-group text-slate-400 text-xs"></i>
                                <select
                                    value={activeFilters.planType || "all"}
                                    onChange={(e) => handleFilterChange("planType", e.target.value)}
                                    className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer border-none focus:ring-0 py-0.5 pl-1 pr-6"
                                >
                                    <option value="all">All Plans</option>
                                    <option value="basic">Basic</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>

                            {(searchTerm || Object.keys(activeFilters).length > 0) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <i className="fa-solid fa-arrow-rotate-left"></i> Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- DATA DISPLAY REMAINS BELOW --- */}
                {/* ... */}
                {/* --- DATA DISPLAY --- */}
                {isError && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 text-sm font-medium">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>{error?.message || "Failed to load organizations. Please refresh the page."}</span>
                    </div>
                )}

                {isLoading ? (
                    // Enterprise Loading Skeletons
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col h-[240px] animate-pulse">
                                <div className="flex gap-4 items-center mb-6">
                                    <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                                        <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                                    <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                                </div>
                                <div className="mt-auto h-9 bg-slate-100 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : (!orgs || orgs.length === 0) ? (
                    // Professional Empty State
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                            <i className="fa-regular fa-building text-2xl text-slate-400"></i>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">No organizations found</h3>
                        <p className="text-slate-500 text-sm mt-1 mb-4 text-center max-w-sm">
                            We couldn't find any workspaces matching your current filters.
                        </p>
                        <button onClick={clearFilters} className="text-blue-600 font-medium hover:underline text-sm">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    // SaaS Fluid Grid Layout (1 col -> 2 cols -> 3 cols -> 4 cols on extra large screens)
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(Array.isArray(orgs) ? orgs : []).map((org: Organization) => (
                            <div
                                key={org._id}
                                className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col group"
                            >
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {org.logoUrl ? (
                                                <img src={org.logoUrl} alt={org.organizationName} className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-lg font-bold border border-slate-200 uppercase">
                                                    {org.organizationName.charAt(0)}
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <h3 className="font-bold text-slate-900 text-sm truncate" title={org.organizationName}>
                                                    {org.organizationName}
                                                </h3>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {org.type || "General Firm"}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Crisp Status Badge */}
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${org.planStatus === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {org.planStatus}
                                        </span>
                                    </div>

                                    {/* Data Grid */}
                                    <div className="grid grid-cols-1 gap-2.5 mt-5">
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <i className="fa-regular fa-envelope text-slate-400 w-4"></i>
                                            <span className="truncate">{org.email || "No email"}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <i className="fa-solid fa-phone text-slate-400 w-4"></i>
                                            <span className="truncate">{org.organizationPhoneNo || "No phone"}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <i className="fa-solid fa-ticket text-slate-400 w-4"></i>
                                            <span className="capitalize">{org.planType ? `${org.planType} Tier` : "Basic Tier"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                                    <button
                                        onClick={() => navigate(`organization-dashboard/${org._id}`)}
                                        className="w-full py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 text-sm shadow-sm"
                                    >
                                        Open Dashboard
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AllOrganizationMain;