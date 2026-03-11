import { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from '../../Hooks/useDebounce';
import { useGetAllPublicLeads } from '../../apiList/publicLeadCollectionApi';
// import { Button } from '../../components/ui/Button';

const PublicLeadCollectionMain = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();

    const location = useLocation()


    // --- State for Filters ---
    const [filters, setFilters] = useState({
        search: "",
        projectCategory: "",
        startDate: "",
        endDate: "",
    });

    // Debounce hooks for search and dates
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedStartDate = useDebounce(filters.startDate, 500);
    const debouncedEndDate = useDebounce(filters.endDate, 500);

    // Construct stable filter object for the API
    const apiFilters = useMemo(() => ({
        organizationId,
        search: debouncedSearch,
        projectCategory: filters.projectCategory,
        startDate: debouncedStartDate,
        endDate: debouncedEndDate,
    }), [organizationId, debouncedSearch, filters.projectCategory, debouncedStartDate, debouncedEndDate]);

    // Fetch data using the Lead Collection hook
    const { data: leads = [], isLoading, error } = useGetAllPublicLeads(organizationId!, apiFilters);

    const activeFiltersCount = [
        filters.projectCategory,
        filters.startDate,
        filters.endDate,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setFilters({
            search: "",
            projectCategory: "",
            startDate: "",
            endDate: "",
        });
    };

    // const paths: BreadcrumbItem[] = [
    //     { label: "Dashboard", path: `/organizations/${organizationId}/dashboard` },
    //     { label: "Lead Collection", path: `/organizations/${organizationId}/lead-collection` },
    // ];

    if (error) return <div className="p-10 text-center text-red-500 font-bold">Error loading lead data.</div>;


    const isChildRoute = location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;

    return (
        <div className="w-full bg-slate-50/50 h-full p-4 font-inter">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center uppercase tracking-tight">
                        <i className="fa fa-address-book mr-3 text-blue-600"></i>
                        Lead Form
                    </h1>
                    <span className="text-sm text-gray-600">See the list of leads, you got from the lead form</span>
                    {/* <Breadcrumb paths={paths} /> */}
                </div>


                {/* <Button onClick={() => navigate(`/organizations/${organizationId}/projects/publiccostcalculation`)}>
                    <i className="fas fa-calculator mr-2 text-white"></i>
                    Cost Calculation leads
                </Button> */}
            </header>

            <main className="flex gap-6 h-[80vh] flex-col md:flex-row">
                {/* --- Filter Sidebar --- */}
                <div className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar bg-white rounded-[30px] p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filters</h3>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="text-[10px] text-blue-600 font-black uppercase cursor-pointer">Reset</button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Search */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 ml-1">Search Lead</label>
                            <input
                                type="text"
                                placeholder="Name, Phone, ID..."
                                value={filters.search}
                                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                            />
                        </div>

                        {/* Project Category */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 ml-1">Category</label>
                            <select
                                value={filters.projectCategory}
                                onChange={(e) => setFilters(f => ({ ...f, projectCategory: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-medium text-slate-700"
                            >
                                <option value="">All Categories</option>
                                <option value="Residential (Apartment / Villa)">Residential</option>
                                <option value="Commercial (Office / Cafe / Showroom)">Commercial</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 ml-1">Submission Date</label>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase ml-1 mb-1 block">From</span>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold text-slate-600"
                                    />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase ml-1 mb-1 block">To</span>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Table View --- */}
                <div className="flex-1 bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <i className="fa fa-spinner fa-spin text-blue-500 text-2xl" />
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <i className="fa fa-folder-open-o text-2xl text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-bold">No Leads Found</h3>
                            <p className="text-slate-400 text-xs">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto relative custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md">
                                    <tr className="text-[10px] uppercase tracking-[2px] text-slate-400">
                                        <th className="px-8 py-5 font-black">S.No</th>
                                        <th className="px-8 py-5 font-black">Lead ID</th>
                                        <th className="px-8 py-5 font-black">Client Name</th>
                                        <th className="px-8 py-5 font-black">Contact</th>
                                        <th className="px-8 py-5 font-black">Category</th>
                                        <th className="px-8 py-5 font-black">Location</th>
                                        <th className="px-8 py-5 font-black text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {leads.map((lead: any, idx: number) => (
                                        <tr
                                            key={lead._id}
                                            className="hover:bg-slate-50/50 transition-all cursor-pointer group"
                                            onClick={() => navigate(`single/${lead._id}`)}
                                        >
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md tracking-tighter">
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md tracking-tighter">
                                                    {lead.leadNumber}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-black text-slate-900 text-sm">
                                                {lead.fullName}
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-slate-500">
                                                {lead.mobileNumber}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${lead.projectCategory?.includes('Residential')
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-purple-50 text-purple-600'
                                                    }`}>
                                                    {lead.projectCategory?.split(' ')[0]}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-slate-600">
                                                {lead.location}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <button className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                    <i className="fa fa-eye text-[10px]" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PublicLeadCollectionMain;