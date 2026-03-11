import { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useGetAllPublicCostCalculations } from '../../apiList/publicCostCalculatorApi'; // Your new hook
// import { Breadcrumb, type BreadcrumbItem } from '../Department Pages/Breadcrumb';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDebounce } from '../../Hooks/useDebounce';
import { useGetAllPublicCostCalculations } from '../../apiList/publicCostCalculationApi';
import { dateFormate } from './../../utils/dateFormator';

const PublicCostCalculationMain = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();

    const location = useLocation()


    // --- State for Filters ---
    const [filters, setFilters] = useState({
        search: "",
        finish: "", // Standard, Premium, Luxury
        startDate: "",
        endDate: "",
        minAmount: 0,
        maxAmount: 2000000,
    });

    // Debounce hooks
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedMinAmount = useDebounce(filters.minAmount, 500);
    const debouncedMaxAmount = useDebounce(filters.maxAmount, 500);

    const apiFilters = useMemo(() => ({
        organizationId,
        search: debouncedSearch,
        finish: filters.finish,
        startDate: filters.startDate,
        endDate: filters.endDate,
        minAmount: debouncedMinAmount,
        maxAmount: debouncedMaxAmount,
    }), [organizationId, debouncedSearch, filters.finish, filters.startDate, filters.endDate, debouncedMinAmount, debouncedMaxAmount]);

    // Fetch data
    const { data: records = [], isLoading, error } = useGetAllPublicCostCalculations(organizationId!, apiFilters);

    const activeFiltersCount = [
        filters.finish,
        filters.startDate,
        filters.endDate,
    ].filter(Boolean).length + (filters.minAmount > 0 || filters.maxAmount < 2000000 ? 1 : 0);

    const clearFilters = () => {
        setFilters({
            search: "",
            finish: "",
            startDate: "",
            endDate: "",
            minAmount: 0,
            maxAmount: 2000000,
        });
    };

    // const paths: BreadcrumbItem[] = [
    //     { label: "Lead Collection", path: `/organizations/${organizationId}/projects/publicleadcollection` },
    //     { label: "Cost Calculation Leads", path: `/organizations/${organizationId}/projects/publiccostcalculation` },
    // ];

    const isChildRoute = location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;

    if (error) return <div className="p-10 text-center text-red-500">Error loading calculations.</div>;


    return (
        <div className="w-full bg-gray-50/30 h-full">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center uppercase tracking-tight">
                        <i className="fa fa-calculator mr-3 text-blue-600"></i>
                        Calculation Leads
                    </h1>
                    {/* <span className='text-gray-600 text-sm ml-7'>you can see the list of people's who have used our instant calculator in our site</span> */}
                    {/* <Breadcrumb paths={paths} /> */}
                </div>
            </header>

            <main className="flex gap-6 h-[88vh] flex-col md:flex-row">
                {/* --- Filter Sidebar --- */}
                <div className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Filters</h3>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="text-xs text-blue-600 font-bold cursor-pointer">Clear</button>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Search Client</label>
                            <input
                                type="text"
                                placeholder="Name or Phone..."
                                value={filters.search}
                                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#ffc000] outline-none text-sm font-medium"
                            />
                        </div>


                        {/* 2. Date Range Filter (ADDED) */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Date Range</label>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 block mb-1">From</span>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#ffc000] outline-none text-xs font-medium"
                                    />
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1 block mb-1">To</span>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#ffc000] outline-none text-xs font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Finish Type</label>
                            <select
                                value={filters.finish}
                                onChange={(e) => setFilters(f => ({ ...f, finish: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none text-sm font-medium"
                            >
                                <option value="">All Finishes</option>
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Budget Range (Estimate)</label>
                            <div className="px-2 pt-4">
                                <Slider
                                    range
                                    min={0}
                                    max={2000000}
                                    value={[filters.minAmount, filters.maxAmount]}
                                    onChange={(val: any) => setFilters(f => ({ ...f, minAmount: val[0], maxAmount: val[1] }))}
                                    trackStyle={[{ backgroundColor: "#155dfc" }]}
                                    handleStyle={[{ borderColor: "#155dfc" }, { borderColor: "#155dfc" }]}
                                />
                                <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-500">
                                    <span>₹{(filters.minAmount / 100000).toFixed(1)}L</span>
                                    <span>₹{(filters.maxAmount / 100000).toFixed(1)}L</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Table View --- */}
                <div className="flex-1 bg-white rounded-[35px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center"><i className="fa fa-spinner fa-spin text-[#ffc000] text-2xl" /></div>
                    ) : (
                        <div className="flex-1 overflow-auto relative custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-gray-50">
                                    <tr className="text-[10px] uppercase tracking-[2px] text-gray-400">
                                        <th className="px-8 py-5 font-bold">S.No</th>
                                        <th className="px-8 py-5 font-bold">Date</th>
                                        <th className="px-8 py-5 font-bold">Client Details</th>
                                        <th className="px-8 py-5 font-bold">Property</th>
                                        <th className="px-8 py-5 font-bold text-center">Finish</th>
                                        <th className="px-8 py-5 font-bold text-right">Estimate</th>
                                        <th className="px-8 py-5 font-bold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {records.map((item: any, idx:number) => (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-gray-50/50 transition-all cursor-pointer group"
                                            onClick={() => navigate(`single/${item._id}`)} // Navigate to child detail route
                                        >
                                            <td className="px-8 py-5 text-xs font-bold text-gray-400">
                                                {idx+1}
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-gray-400">
                                                {/* {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} */}
                                                {dateFormate(item.createdAt)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                                                <div className="text-[11px] text-gray-400 font-medium">{item.phone}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-xs font-bold text-gray-700">{item.homeType}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{item.location}</div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${item.finish === 'Luxury' ? 'bg-purple-50 text-purple-600' :
                                                    item.finish === 'Premium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {item.finish}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-bold text-[#1a1a1a]">
                                                ₹{item.estimate.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <button className="w-8 h-8 rounded-xl bg-gray-100 cursor-pointer">
                                                    <i className="fa fa-chevron-right text-[10px]" />
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

export default PublicCostCalculationMain;