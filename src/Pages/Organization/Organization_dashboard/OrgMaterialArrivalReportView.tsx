
import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { getDateRange } from './orgsUtils';
import { ChartFilterHeader } from './OrgOrderMaterialReportView';
import { useGetOrgArrivalReport, useGetOrgArrivalTrend } from '../../../apiList/organization_api/orgReportApi';


// const ARRIVAL_COLORS = { arrived: '#2563EB', verified: '#10B981', pending: '#F59E0B' };
const ARRIVAL_COLORS = { 
    verified: '#10B981', // Emerald
    arrived: '#F59E0B'   // Amber
};


export const ArrivalDistributionPie = ({ organizationId }: { organizationId: string }) => {
    const [timeRange, setTimeRange] = useState("all_time");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const dateFilters = useMemo(() => 
        getDateRange(timeRange, customStart, customEnd), 
    [timeRange, customStart, customEnd]);

    const { data: arrival, isLoading } = useGetOrgArrivalReport(organizationId, dateFilters);

    // FIX: Map the same metrics as the Bar Chart
    const pieData = useMemo(() => [
        { name: "Arrival", value: parseFloat((arrival?.arrivalEfficiency || 0).toFixed(1)) },
        { name: "Verification", value: parseFloat((arrival?.verificationRate || 0).toFixed(1)) }
    ], [arrival]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <ChartFilterHeader 
                title="Arrival vs Verification (%)" 
                timeRange={timeRange} setTimeRange={setTimeRange}
                customStart={customStart} setCustomStart={setCustomStart}
                customEnd={customEnd} setCustomEnd={setCustomEnd}
            />
            
            {isLoading ? (
                <div className="h-56 flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i>
                </div>
            ) : (
                <>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={8} 
                                    dataKey="value" 
                                    stroke="none"
                                >
                                    {/* Using Blue for Arrival and Green for Verification to match Bar Chart */}
                                    <Cell fill="#3B82F6" /> 
                                    <Cell fill="#10B981" />
                                </Pie>
                                <Tooltip formatter={(val) => `${val}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Synchronized Legend Footer */}
                    <div className="flex justify-around mt-4 border-t border-slate-50 pt-4">
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-800">{arrival?.arrivalEfficiency?.toFixed(1)}%</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase">Arrival Rate</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-800">{arrival?.verificationRate?.toFixed(1)}%</p>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Verified Rate</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const ArrivalEfficiencyBar = ({ organizationId }: { organizationId: string }) => {
    const [timeRange, setTimeRange] = useState("all_time");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const dateFilters = useMemo(() => 
        getDateRange(timeRange, customStart, customEnd), 
    [timeRange, customStart, customEnd]);

    const { data: arrival, isLoading } = useGetOrgArrivalReport(organizationId, dateFilters);

    const barData = useMemo(() => [
        { 
            name: "Efficiency", 
            Arrival: parseFloat((arrival?.arrivalEfficiency || 0).toFixed(1)), 
            Verification: parseFloat((arrival?.verificationRate || 0).toFixed(1)) 
        }
    ], [arrival]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <ChartFilterHeader 
                title="Intake Efficiency (%)" 
                timeRange={timeRange} setTimeRange={setTimeRange}
                customStart={customStart} setCustomStart={setCustomStart}
                customEnd={customEnd} setCustomEnd={setCustomEnd}
            />

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i>
                    </div>
            ) : (
                <>
                <div className="h-52 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} barGap={12}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                            <Tooltip cursor={{ fill: "#F8FAFC" }} formatter={(val) => `${val}%`} />
                            <Legend verticalAlign="top" align="right" iconType="circle" />
                            <Bar dataKey="Arrival" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="Verification" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                    {/* Synchronized Progress Bars Below Chart */}
                    <div className="mt-4 space-y-4">
                        <div className="pt-2 border-t border-slate-50">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                <span className="text-blue-600">Arrival Efficiency</span>
                                <span className="text-slate-700">{arrival?.arrivalEfficiency?.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-blue-50 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${arrival?.arrivalEfficiency}%` }} />
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                <span className="text-emerald-600">Verification Rate</span>
                                <span className="text-slate-700">{arrival?.verificationRate?.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-emerald-50 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${arrival?.verificationRate}%` }} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


export const ArrivalTrendLine = ({ organizationId }: { organizationId: string }) => {
    const [timeRange, setTimeRange] = useState("all_time");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const dateFilters = useMemo(() => getDateRange(timeRange, customStart, customEnd), [timeRange, customStart, customEnd]);
    const { data: trendData } = useGetOrgArrivalTrend(organizationId, dateFilters);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <ChartFilterHeader title="Intake Timeline" timeRange={timeRange} setTimeRange={setTimeRange} customStart={customStart} setCustomStart={setCustomStart} customEnd={customEnd} setCustomEnd={setCustomEnd} />
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickFormatter={(val) => val.split('-')[1]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <Tooltip />
                        <Line type="monotone" dataKey="arrived" name="Arrived Qty" stroke={ARRIVAL_COLORS.arrived} strokeWidth={3} dot={{r: 4}} />
                        <Line type="monotone" dataKey="verified" name="Verified Items" stroke={ARRIVAL_COLORS.verified} strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};