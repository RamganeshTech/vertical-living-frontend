import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { useGetOrgOrderingReport, useGetOrgOrderingTrend } from '../../../apiList/organization_api/orgReportApi';
import { getDateRange } from './orgsUtils';


export const ChartFilterHeader = ({ 
    title, timeRange, setTimeRange, customStart, setCustomStart, customEnd, setCustomEnd 
}: any) => {
    
    const rangeOptions = [
        { label: 'All', value: 'all_time' },
        { label: '30D', value: 'last_30_days' },
        { label: 'Month', value: 'last_month' },
        { label: 'Year', value: 'this_year' },
        { label: 'Custom', value: 'custom' },
    ];

    return (
        <div className="flex flex-col gap-3 mb-6">
            {/* Row 1: Title and Main Pills */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-montserrat whitespace-nowrap">
                        {title}
                    </h3>
                </div>

                {/* Compact Segmented Control */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
                    {rangeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setTimeRange(option.value)}
                            className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                                timeRange === option.value
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 2: Custom Date Inputs (Only shows if Custom is selected) */}
            {timeRange === 'custom' && (
                <div className="flex items-center justify-end animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 rounded-lg px-2 py-1.5">
                        <i className="fa-regular fa-calendar-range text-blue-500 text-[10px]"></i>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-transparent text-[10px] font-bold text-blue-700 outline-none w-24"
                        />
                        <span className="text-blue-300 text-[10px]">—</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-transparent text-[10px] font-bold text-blue-700 outline-none w-24"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


// Updated Palette: High Contrast & Professional
const LINE_COLORS = {
    sent: '#10b981',    // Royal Blue
    created: '#3B82F6', // Golden Amber (Warning State) - No Red
    drafts: '#F59E0B'   // Vibrant Emerald (Neutral/Initial State)
};

const CHART_COLORS = [LINE_COLORS.sent, LINE_COLORS.created, LINE_COLORS.drafts];
// const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4'];

// const LINE_COLORS = {
//     sent: '#3B82F6',    // Blue
//     pending: '#8B5CF6', // Amber
//     drafts: '#06B6D4'   // Slate
// };

export const OrderStagesPieChart = ({ organizationId }: { organizationId: string }) => {
    const [timeRange, setTimeRange] = useState("all_time");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    //   const dateFilters = getDateRange(timeRange, customStart, customEnd);

    // FIX: Wrap the date calculation in useMemo
    const dateFilters = useMemo(() =>
        getDateRange(timeRange, customStart, customEnd),
        [timeRange, customStart, customEnd]
    );


    const { data: ordering, isLoading } = useGetOrgOrderingReport(organizationId, dateFilters);

    const pieData = [
        { name: "Sent", value: ordering?.procurementStatus?.sent || 0 },
        { name: "Created", value: ordering?.procurementStatus?.pending || 0 },
        { name: "Drafts", value: ordering?.summary?.notYetPlacedCount || 0 },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <ChartFilterHeader
                title="Order Material"
                timeRange={timeRange} setTimeRange={setTimeRange}
                customStart={customStart} setCustomStart={setCustomStart}
                customEnd={customEnd} setCustomEnd={setCustomEnd}
            />

            {isLoading ? (
                <div className="h-56 flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i></div>
            ) : (
                <>
                    <div className="h-56 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                                    {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                        {pieData.map((item, i) => (
                            <div key={item.name} className="text-center">
                                <p className="text-xl font-black text-slate-800">{item.value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: CHART_COLORS[i] }}>{item.name}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};



export const OrderStagesBarChart = ({ organizationId }: { organizationId: string }) => {
    const [timeRange, setTimeRange] = useState("all_time");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    //   const dateFilters = getDateRange(timeRange, customStart, customEnd);
    // 2. FIX: Memoize the filters object
    const dateFilters = useMemo(() => {
        return getDateRange(timeRange, customStart, customEnd);
    }, [timeRange, customStart, customEnd]); // Only recreates object if these 3 change
    const { data: ordering, isLoading } = useGetOrgOrderingReport(organizationId, dateFilters);

    const barData = [
        { name: "Sent", value: ordering?.procurementStatus?.sent || 0 },
        { name: "Created", value: ordering?.procurementStatus?.pending || 0 },
        { name: "Drafts", value: ordering?.summary?.notYetPlacedCount || 0 },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <ChartFilterHeader
                title="Order Material (Bar)"
                timeRange={timeRange} setTimeRange={setTimeRange}
                customStart={customStart} setCustomStart={setCustomStart}
                customEnd={customEnd} setCustomEnd={setCustomEnd}
            />

            {isLoading ? (
                <div className="h-64 flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i></div>
            ) : (
                <div className="h-64 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {barData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};



export const OrderStagesLineChart = ({ organizationId }: { organizationId: string }) => {
    const [timeRange, setTimeRange] = useState("all_time");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const dateFilters = useMemo(() => {
        return getDateRange(timeRange, customStart, customEnd);
    }, [timeRange, customStart, customEnd]);

    // Use the NEW trend hook here
    const { data: trendData, isLoading } = useGetOrgOrderingTrend(organizationId, dateFilters);

    // console.log("trndData", trendData)

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <ChartFilterHeader
                title="Order Material (Timeline)"
                timeRange={timeRange} setTimeRange={setTimeRange}
                customStart={customStart} setCustomStart={setCustomStart}
                customEnd={customEnd} setCustomEnd={setCustomEnd}
            />

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i>
                </div>
            ) : (
                <div className="h-64 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={Array.isArray(trendData) ? trendData : []}
                            margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

                            {/* The X-Axis Fix: Formatting the "2025-04" string */}
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748B' }}
                                tickFormatter={(val) => {
                                    if (!val) return '';
                                    // Converts "2025-04" to a Date object, then formats to "Apr '25"
                                    const [year, month] = val.split('-');
                                    const d = new Date(parseInt(year), parseInt(month) - 1);
                                    return d.toLocaleDateString('en-US', { month: 'short' }) + " '" + year.substring(2);
                                }}
                            />

                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                labelFormatter={(label) => {
                                    // Format Tooltip Header
                                    const [year, month] = label.split('-');
                                    const d = new Date(parseInt(year), parseInt(month) - 1);
                                    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: '600' }} />

                            {/* Your 3 Lines */}
                            <Line type="monotone" dataKey="sent" name="Sent" stroke={LINE_COLORS.sent} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="pending" name="Created" stroke={LINE_COLORS.created} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="drafts" name="Drafts" stroke={LINE_COLORS.drafts} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};