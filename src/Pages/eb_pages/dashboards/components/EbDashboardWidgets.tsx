


import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TableContainer, TBody, Td, Th, THead, Tr } from "../../../../components/ui/TableLayout";
import { Card } from '../../../../components/ui/Card';
import { formatTime12Hour } from '../../../../utils/dateFormator';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';
import { useGetEBBillKpis, useGetEbPremisesCharge, useGetPremisesEBConsumptionChart, type IEBLog, type IEBPremisesAnalytics } from '../../../../apiList/eb_api/ebLogApi';

// ==========================================
// WIDGET 1: KPI Stat Card
// ==========================================
interface EbStatCardProps {
    title: string;
    value: string | number;
    icon: string;
    subtitle?: string;
    isLoading?: boolean;
    valueColor?: string;
}

export const EbStatCard: React.FC<EbStatCardProps> = ({ title, value, icon, subtitle, isLoading, valueColor = "text-text-main" }) => (
    <Card className="bg-brand-surface border border-ash-medium p-3.5 flex flex-col justify-between shadow-sm h-full hover:border-ash-dark transition-colors group rounded-xl">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider line-clamp-1 mr-2" title={title}>
                {title}
            </h3>
            <div className="w-7 h-7 rounded bg-brand-surface-hover border border-ash-light flex items-center justify-center text-text-main group-hover:bg-brand-surface-hover/20 transition-colors shrink-0">
                <i className={`${icon} text-[12px]`}></i>
            </div>
        </div>
        <div>
            {isLoading ? (
                <div className="h-6 w-16 bg-ash-light animate-pulse rounded"></div>
            ) : (
                <p className={`text-[17px] font-bold ${valueColor} truncate`} title={String(value)}>
                    {value}
                </p>
            )}
            {subtitle && (
                <p className="text-[10px] text-text-text-muted mt-0.5 font-medium truncate" title={subtitle}>
                    {subtitle}
                </p>
            )}
        </div>
    </Card>
);

// ==========================================
// WIDGET 2: Premises Analytics Cards (unchanged)
// ==========================================
interface EbAnalyticsCardsProps {
    data: IEBPremisesAnalytics[];
    isLoading: boolean;
}

export const EbAnalyticsCards: React.FC<EbAnalyticsCardsProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="py-16 flex flex-col items-center justify-center bg-surface border border-ash-medium rounded-xl shadow-sm">
                <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
                <p className="text-sm font-medium text-text-muted">Loading analytics...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="py-16 text-center bg-surface border border-ash-medium rounded-xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-brand-surface border border-ash-medium flex items-center justify-center mx-auto mb-3 text-text-muted text-2xl">
                    <i className="fas fa-chart-line"></i>
                </div>
                <p className="text-sm font-medium text-text-strong">No analytics data available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.map((item) => (
                <Card
                    key={item.premisesId}
                    className="bg-surface border border-ash-medium shadow-sm hover:shadow-md hover:border-primary-soft hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden rounded-xl"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-action-primary opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    <div className="p-4 pt-5 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-action-primary-soft/20 flex items-center justify-center text-text-main shrink-0">
                                <i className="fas fa-bolt text-lg"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-strong text-[15px] truncate max-w-[180px]" title={item.premisesName}>
                                    {item.premisesName}
                                </h4>
                                <p className="text-[11px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">
                                    Energy Analytics
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 pt-0 flex-1 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-brand-surface border border-border-soft rounded-lg p-3 flex flex-col justify-center group-hover:border-primary-soft/40 transition-colors">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <i className="fas fa-calendar-day text-text-main-soft"></i> Yesterday
                                </span>
                                <span className="font-mono text-[16px] font-bold text-text-strong">
                                    {item.yesterdayConsumption !== null ? (
                                        <>
                                            {item.yesterdayConsumption} <span className="text-[11px] text-text-muted font-sans font-medium">kWh</span>
                                        </>
                                    ) : (
                                        <span className="text-[13px] text-text-muted italic font-sans font-normal">N/A</span>
                                    )}
                                </span>
                            </div>

                            <div className="bg-brand-surface border border-border-soft rounded-lg p-3 flex flex-col justify-center group-hover:border-primary-soft/40 transition-colors">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <i className="fas fa-chart-line text-text-main-soft"></i> 30-Day Avg
                                </span>
                                <span className="font-mono text-[16px] font-bold text-text-strong">
                                    {item.avg30DayConsumption !== null ? (
                                        <>
                                            {item.avg30DayConsumption} <span className="text-[11px] text-text-muted font-sans font-medium">kWh/d</span>
                                        </>
                                    ) : (
                                        <span className="text-[13px] text-text-muted italic font-sans font-normal">N/A</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto bg-action-primary-soft/10 border border-primary-soft/20 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-action-primary-soft/30 flex items-center justify-center text-text-main">
                                    <i className="fas fa-bullseye text-[10px]"></i>
                                </div>
                                <span className="text-[12px] font-bold text-text-main">Proj. Month</span>
                            </div>
                            <span className="font-mono text-[16px] font-bold text-text-main">
                                {item.projectedThisMonthConsumption !== null ? (
                                    <>
                                        {item.projectedThisMonthConsumption} <span className="text-[10px] text-text-main/70 font-sans font-semibold">kWh</span>
                                    </>
                                ) : (
                                    <span className="text-[12px] text-text-main/60 italic font-sans font-normal">N/A</span>
                                )}
                            </span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

// ==========================================
// WIDGET 3: Recent Activity List (unchanged)
// ==========================================
interface EbRecentLogsProps {
    logs: IEBLog[];
    isLoading: boolean;
}

export const EbRecentLogsList: React.FC<EbRecentLogsProps> = ({ logs, isLoading }) => (
    <div className="bg-surface border border-ash-medium rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-ash-medium flex justify-between items-center">
            <div className="flex items-center gap-2">
                <i className="fas fa-history text-text-main text-sm"></i>
                <h3 className="text-[15px] font-semibold text-text-strong">Recent Log Entries</h3>
            </div>
            <span className="text-[11px] font-medium text-text-muted uppercase bg-brand-surface px-2 py-1 rounded border border-ash-medium shadow-sm">
                Latest 10 Records
            </span>
        </div>

        <TableContainer className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <THead className="sticky top-0 z-10 after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b after:border-ash-medium">
                <tr>
                    <Th className="font-semibold text-[12px]">Log No</Th>
                    <Th className="font-semibold text-[12px]">Premises</Th>
                    <Th className="font-semibold text-[12px]">Date</Th>
                    <Th className="font-semibold text-[12px]">Time</Th>
                    <Th className="font-semibold text-[12px]">Reading (kWh)</Th>
                </tr>
            </THead>
            <TBody>
                {isLoading ? (
                    <tr>
                        <td colSpan={5} className="py-16 text-center">
                            <i className="fas fa-circle-notch fa-spin text-text-main text-xl"></i>
                            <p className="text-xs font-medium text-text-muted mt-2">Loading recent logs...</p>
                        </td>
                    </tr>
                ) : logs.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-brand-surface border border-ash-medium flex items-center justify-center mx-auto mb-3 text-text-muted text-lg shadow-sm">
                                <i className="fas fa-clipboard-list"></i>
                            </div>
                            <p className="text-sm font-medium text-text-strong">No recent logs found.</p>
                        </td>
                    </tr>
                ) : (
                    logs.map((log: any) => (
                        <Tr key={log._id} className="border-b border-border-soft last:border-0 group">
                            <Td>
                                <span className="font-mono text-[12px] font-medium text-text-muted bg-brand-surface border border-border-soft px-1.5 py-0.5 rounded group-hover:border-ash-medium transition-colors">
                                    #{log.ebLogNo}
                                </span>
                            </Td>

                            <Td>
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-building text-text-main text-xs opacity-70"></i>
                                    <span className="text-[13px] font-medium text-text-strong">
                                        {log.premisesId?.premisesName || 'Unknown Premises'}
                                    </span>
                                </div>
                            </Td>

                            <Td>
                                <div className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
                                    <i className="far fa-calendar-alt opacity-70"></i>
                                    {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                            </Td>

                            <Td>
                                <div className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
                                    <i className="far fa-clock opacity-70"></i>
                                    {formatTime12Hour(log.time)}
                                </div>
                            </Td>

                            <Td>
                                <span className="font-mono text-[14px] font-bold text-text-strong">
                                    {Number(log.meterReading).toLocaleString()}
                                    <span className="text-[11px] font-sans font-medium text-text-muted ml-1">kWh</span>
                                </span>
                            </Td>
                        </Tr>
                    ))
                )}
            </TBody>
        </TableContainer>
    </div>
);

// ==========================================
// WIDGET 4: EB Consumption Line Chart (recharts)
// ==========================================
const CHART_COLORS = ["#4b5563", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899"];

export const EbConsumptionChart: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();

    const [period, setPeriod] = useState<string>("month");
    const [customDates, setCustomDates] = useState({
        fromDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
    });

    const { data, isLoading } = useGetPremisesEBConsumptionChart(organizationId!, {
        period,
        ...(period === 'custom' ? customDates : {})
    });

    // Transform per-premises series into recharts' row-per-label shape:
    // [{ label: 'Jan', 'Premises A': 120, 'Premises B': 80 }, ...]
    const chartData = useMemo(() => {
        if (!data || !data.premises || data.premises.length === 0) return [];

        const labels = data.premises[0].series.map(s => s.label);

        return labels.map((label, i) => {
            const point: Record<string, string | number | null> = { label };
            data.premises.forEach(p => {
                point[p.premisesName] = p.series[i]?.kwUsed ?? null;
            });
            return point;
        });
    }, [data]);

    return (
        <div className="bg-brand-surface border border-ash-medium rounded-xl shadow-sm overflow-hidden flex flex-col w-full">
            <div className="p-4 border-b border-ash-medium bg-brand-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <i className="fas fa-chart-area text-text-main text-sm"></i>
                    <h3 className="text-[15px] font-semibold text-text-strong">Consumption Over Time</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex bg-brand-surface border border-ash-medium rounded-lg p-0.5 shadow-sm overflow-x-auto w-full sm:w-auto">
                        {['today', 'week', 'month', 'year', 'custom'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 text-[12px] font-medium rounded-md capitalize whitespace-nowrap transition-colors ${period === p
                                        ? 'bg-action-primary text-white shadow-sm'
                                        : 'text-text-muted hover:text-text-strong hover:bg-brand-main'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    {period === 'custom' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200">
                            <input
                                type="date"
                                value={customDates.fromDate}
                                onChange={(e) => setCustomDates({ ...customDates, fromDate: e.target.value })}
                                className="px-2 py-1.5 rounded-md border border-ash-medium bg-brand-surface text-[12px] text-text-strong focus:border-primary-soft focus:outline-none"
                            />
                            <span className="text-text-muted text-xs">to</span>
                            <input
                                type="date"
                                value={customDates.toDate}
                                onChange={(e) => setCustomDates({ ...customDates, toDate: e.target.value })}
                                className="px-2 py-1.5 rounded-md border border-ash-medium bg-brand-surface text-[12px] text-text-strong focus:border-primary-soft focus:outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 h-[350px] w-full relative">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
                        <p className="text-sm text-text-muted font-medium">Rendering chart...</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-surface border border-ash-medium flex items-center justify-center mb-3 text-text-muted text-lg shadow-sm">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <p className="text-sm font-medium text-text-strong">No data available for this period.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b6b6b' }} axisLine={{ stroke: '#dbdbdb' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#6b6b6b' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#dbdbdb', borderRadius: 8, fontSize: 12 }}
                                labelStyle={{ color: '#1a1a1a', fontWeight: 'bold' }}
                                // formatter={(value: number, name: string) => [`${value} kWh`, name]}
                                formatter={(value, name) => [`${Number(value)} kWh`, name]}

                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                            {data?.premises.map((p, index) => (
                                <Line
                                    key={p.premisesName}
                                    type="monotone"
                                    dataKey={p.premisesName}
                                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

// ==========================================
// EB Cost Line Chart (recharts)
// ==========================================
export const EbCostChart: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();

    const [period, setPeriod] = useState<string>("month");
    const [customDates, setCustomDates] = useState({
        fromDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
    });

    const { data, isLoading } = useGetPremisesEBConsumptionChart(organizationId!, {
        period,
        ...(period === 'custom' ? customDates : {})
    });

    const chartData = useMemo(() => {
        if (!data || !data.premises || data.premises.length === 0) return [];

        const labels = data.premises[0].series.map(s => s.label);

        return labels.map((label, i) => {
            const point: Record<string, string | number | null> = { label };
            data.premises.forEach(p => {
                point[p.premisesName] = p.series[i]?.cost ?? null;
            });
            return point;
        });
    }, [data]);

    return (
        <div className="bg-surface border border-ash-medium rounded-xl shadow-sm overflow-hidden flex flex-col w-full">
            <div className="p-4 border-b border-ash-medium bg-brand-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <i className="fas fa-file-invoice-dollar text-text-main text-sm"></i>
                    <h3 className="text-[15px] font-semibold text-text-strong">Estimated Billing Cost Over Time</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex bg-brand-surface border border-ash-medium rounded-lg p-0.5 shadow-sm overflow-x-auto w-full sm:w-auto">
                        {['today', 'week', 'month', 'year', 'custom'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 text-[12px] font-medium rounded-md capitalize whitespace-nowrap transition-colors ${period === p
                                        ? 'bg-action-primary text-white shadow-sm'
                                        : 'text-text-muted hover:text-text-strong hover:bg-brand-main'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    {period === 'custom' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200">
                            <input
                                type="date"
                                value={customDates.fromDate}
                                onChange={(e) => setCustomDates({ ...customDates, fromDate: e.target.value })}
                                className="px-2 py-1.5 rounded-md border border-ash-medium bg-brand-surface text-[12px] text-text-strong focus:border-primary-soft focus:outline-none"
                            />
                            <span className="text-text-muted text-xs">to</span>
                            <input
                                type="date"
                                value={customDates.toDate}
                                onChange={(e) => setCustomDates({ ...customDates, toDate: e.target.value })}
                                className="px-2 py-1.5 rounded-md border border-ash-medium bg-brand-surface text-[12px] text-text-strong focus:border-primary-soft focus:outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 h-[350px] w-full relative">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
                        <p className="text-sm text-text-muted font-medium">Rendering cost chart...</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-surface border border-ash-medium flex items-center justify-center mb-3 text-text-muted text-lg shadow-sm">
                            <i className="fas fa-rupee-sign"></i>
                        </div>
                        <p className="text-sm font-medium text-text-strong">No cost data available for this period.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b6b6b' }} axisLine={{ stroke: '#dbdbdb' }} tickLine={false} />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#6b6b6b' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#dbdbdb', borderRadius: 8, fontSize: 12 }}
                                labelStyle={{ color: '#1a1a1a', fontWeight: 'bold' }}
                                // formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name]}
                                formatter={(value, name) => [`₹${Number(value).toLocaleString('en-IN')}`, name]}

                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                            {data?.premises.map((p, index) => (
                                <Line
                                    key={p.premisesName}
                                    type="monotone"
                                    dataKey={p.premisesName}
                                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

// ==========================================
// WIDGET 5: Billing & Cost KPIs
// ==========================================
export const EbBillingKpis: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const { data, isLoading } = useGetEBBillKpis(organizationId!);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <EbStatCard
                title="Monthly Projected Bill"
                value={data ? `₹${data.monthlyProjectedBill.toLocaleString('en-IN')}` : '₹0'}
                icon="fas fa-file-invoice-dollar"
                subtitle="Estimated total for this month"
                isLoading={isLoading}
                valueColor="text-text-main"
            />

            <EbStatCard
                title="Estimated Daily Cost"
                value={data ? `₹${data.estimatedDailyEBCost.toLocaleString('en-IN')}` : '₹0'}
                icon="fas fa-calendar-day"
                subtitle="Average cost per day (MTD)"
                isLoading={isLoading}
                valueColor="text-text-main"
            />

            <EbStatCard
                title="Projected Monthly Units"
                value={data ? `${data.projectedUnitsThisMonth.toLocaleString('en-IN')} kWh` : '0 kWh'}
                icon="fas fa-tachometer-alt"
                subtitle="Estimated usage by month-end"
                isLoading={isLoading}
                valueColor="text-text-main"
            />
        </div>
    );
};

// ==========================================
// WIDGET 6: Total Consumption Donut Chart (recharts)
// // ==========================================
// interface EbConsumptionDoughnutProps {
//     data: IEBPremisesAnalytics[];
//     isLoading: boolean;
// }

// const DOUGH_CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#4b5563"];

// export const EbConsumptionDoughnut: React.FC<EbConsumptionDoughnutProps> = ({ data, isLoading }) => {

//     const chartData = useMemo(() => {
//         if (!data || data.length === 0) return [];
//         return data.map((p, index) => ({
//             name: p.premisesName,
//             value: p.totalConsumption || 0,
//             color: DOUGH_CHART_COLORS[index % DOUGH_CHART_COLORS.length],
//         }));
//     }, [data]);

//     const totalSum = useMemo(() => {
//         if (!data) return 0;
//         return data.reduce((sum, item) => sum + (item.totalConsumption || 0), 0);
//     }, [data]);

//     return (
//         <div className="bg-surface border border-ash-medium rounded-xl shadow-sm overflow-hidden flex flex-col h-full w-full">
//             <div className="p-4 border-b border-ash-medium bg-brand-surface flex items-center justify-between gap-4">
//                 <div className="flex items-center gap-2">
//                     <i className="fas fa-chart-pie text-text-main text-sm"></i>
//                     <h3 className="text-[15px] font-semibold text-text-strong">Total Consumption Share</h3>
//                 </div>
//             </div>

//             <div className="p-4 relative flex-1 flex flex-col items-center justify-center min-h-[300px]">
//                 {isLoading ? (
//                     <div className="w-full h-full flex flex-col items-center justify-center">
//                         <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
//                         <p className="text-sm text-text-muted font-medium">Loading distribution...</p>
//                     </div>
//                 ) : chartData.length === 0 || totalSum === 0 ? (
//                     <div className="w-full h-full flex flex-col items-center justify-center">
//                         <div className="w-12 h-12 rounded-full bg-brand-surface border border-ash-medium flex items-center justify-center mb-3 text-text-muted text-lg shadow-sm">
//                             <i className="fas fa-chart-pie"></i>
//                         </div>
//                         <p className="text-sm font-medium text-text-strong">No consumption data to display.</p>
//                     </div>
//                 ) : (
//                     <div className="w-full h-full relative flex items-center justify-center">
//                         <div className="w-full h-full max-w-[400px]">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={chartData}
//                                         dataKey="value"
//                                         nameKey="name"
//                                         innerRadius="72%"
//                                         outerRadius="100%"
//                                         paddingAngle={1}
//                                         stroke="none"
//                                     >
//                                         {chartData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.color} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip
//                                         contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#dbdbdb', borderRadius: 8, fontSize: 13 }}
//                                         // formatter={(value: number, name: string) => [`${value.toLocaleString('en-IN')} kWh`, name]}
//                                         formatter={(value, name) => [`${Number(value).toLocaleString('en-IN')} kWh`, name]}
//                                     />
//                                     <Legend
//                                         layout="vertical"
//                                         align="right"
//                                         verticalAlign="middle"
//                                         iconType="circle"
//                                         wrapperStyle={{ fontSize: 12, color: '#6b6b6b' }}
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>

//                         {/* Center Text overlay (still works — the chart is just a div under it) */}
//                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[120px]">
//                             <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Total Usage</span>
//                             <span className="text-lg font-bold text-text-strong">
//                                 {totalSum.toLocaleString('en-IN')} <span className="text-[11px] font-sans font-medium text-text-muted">kWh</span>
//                             </span>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };


interface EbConsumptionDoughnutProps {
    data: IEBPremisesAnalytics[];
    isLoading: boolean;
}

const DOUGH_CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#4b5563"];

export const EbConsumptionDoughnut: React.FC<EbConsumptionDoughnutProps> = ({ data, isLoading }) => {

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map((p, index) => ({
            name: p.premisesName,
            value: p.totalConsumption || 0,
            color: DOUGH_CHART_COLORS[index % DOUGH_CHART_COLORS.length],
        }));
    }, [data]);

    const totalSum = useMemo(() => {
        if (!data) return 0;
        return data.reduce((sum, item) => sum + (item.totalConsumption || 0), 0);
    }, [data]);

    return (
        <div className="bg-surface border border-ash-medium rounded-xl shadow-sm overflow-hidden flex flex-col h-full w-full">
            {/* Header */}
            <div className="p-4 border-b border-ash-medium bg-brand-surface flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2">
                    <i className="fas fa-chart-pie text-text-main text-sm"></i>
                    <h3 className="text-[15px] font-semibold text-text-strong">Total Consumption Share</h3>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 relative flex-1 flex flex-col min-h-[350px]">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center flex-1">
                        <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
                        <p className="text-sm text-text-muted font-medium">Loading distribution...</p>
                    </div>
                ) : chartData.length === 0 || totalSum === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center flex-1">
                        <div className="w-12 h-12 rounded-full bg-brand-surface border border-ash-medium flex items-center justify-center mb-3 text-text-muted text-lg shadow-sm">
                            <i className="fas fa-chart-pie"></i>
                        </div>
                        <p className="text-sm font-medium text-text-strong">No consumption data to display.</p>
                    </div>
                ) : (
                    // Forced Vertical Layout: Chart strictly on top, Legend strictly below
                    <div className="w-full h-full flex flex-col items-center justify-start flex-1 gap-6">
                        
                        {/* 1. Fixed-size Chart Container (Top) */}
                        <div className="relative w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] flex-shrink-0 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="70%"
                                        outerRadius="100%"
                                        paddingAngle={2}
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#e5e5e5', borderRadius: 8, fontSize: 13 }}
                                        formatter={(value, name) => [`${Number(value).toLocaleString('en-IN')} kWh`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
                                    Total Usage
                                </span>
                                <span className="text-xl font-bold text-text-strong text-center leading-tight">
                                    {totalSum.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                                    <span className="block text-[11px] font-sans font-medium text-text-muted mt-0.5">kWh</span>
                                </span>
                            </div>
                        </div>

                        {/* 2. Custom Scrollable List (Below) */}
                        <div className="flex flex-col w-full flex-1 min-h-[150px] max-h-[220px] overflow-y-auto custom-scrollbar pr-2 gap-1 border-t border-ash-medium pt-4">
                            {chartData.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:bg-brand-surface hover:border-ash-medium transition-colors gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span 
                                            className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-[13px] font-medium text-text-main truncate" title={item.name}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-[13px] font-bold text-text-strong whitespace-nowrap pl-2">
                                        {item.value.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-text-muted">kWh</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


interface EBPremisesCostBarChartProps {
    organizationId: string;
    premisesId: string;
}

export const EBPremisesCostBarChart: React.FC<EBPremisesCostBarChartProps> = ({
    organizationId,
    premisesId,
}) => {
    // --- Filter States ---
    const currentYear = new Date().getFullYear().toString();
    const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
    const [year, setYear] = useState<string>(currentYear);
    const [fromYear, setFromYear] = useState<string>((parseInt(currentYear) - 4).toString());
    const [toYear, setToYear] = useState<string>(currentYear);

    // --- Data Fetching ---
    const { data, isLoading, isError, error } = useGetEbPremisesCharge({
        organizationId,
        premisesId,
        view,
        year,
        fromYear,
        toYear,
    });

    // Generate Year Options for Dropdowns
    const yearOptions = useMemo(() => {
        const years = [];
        const thisYear = new Date().getFullYear();
        for (let i = thisYear; i >= thisYear - 10; i--) {
            years.push(i.toString());
        }
        return years;
    }, []);

    // --- Custom Tooltip for Premium UI ---
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Safely handle null values from the API response
            const costValue = payload[0].value || 0;

            return (
                <div
                    className="p-3 rounded-lg shadow-md border"
                    style={{
                        backgroundColor: 'var(--bg-brand-surface)',
                        borderColor: 'var(--border-ash-medium)'
                    }}
                >
                    <p style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold mb-1 uppercase tracking-wide">
                        {label}
                    </p>
                    <p style={{ color: 'var(--text-strong)' }} className="text-sm font-bold">
                        ₹ {costValue.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className="rounded-xl shadow-sm border p-4 sm:p-6 flex flex-col w-full h-full"
            style={{
                backgroundColor: 'var(--bg-brand-surface)',
                borderColor: 'var(--border-ash-light)'
            }}
        >
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 style={{ color: 'var(--text-strong)' }} className="text-base font-semibold">
                        Electricity Cost Summary
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                        Monitor premises billing history
                    </p>

                    {/* NEW: total for the selected year, monthly view only */}
                    {view === 'monthly' && !isLoading && !isError && (
                        <p style={{ color: 'var(--text-strong)' }} className="text-sm font-semibold mt-2">
                            Total for {year}: ₹{(data?.selectedRangeTotalCost ?? 0).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Controls Container */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">

                    {/* View Toggle */}
                    <div
                        className="flex p-0.5 rounded-lg border"
                        style={{ backgroundColor: 'var(--bg-ash)', borderColor: 'var(--border-ash-medium)' }}
                    >
                        <button
                            onClick={() => setView('monthly')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'monthly' ? 'shadow-sm' : ''
                                }`}
                            style={{
                                backgroundColor: view === 'monthly' ? 'var(--bg-surface)' : 'transparent',
                                color: view === 'monthly' ? 'var(--text-strong)' : 'var(--text-muted)',
                            }}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setView('yearly')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'yearly' ? 'shadow-sm' : ''
                                }`}
                            style={{
                                backgroundColor: view === 'yearly' ? 'var(--bg-surface)' : 'transparent',
                                color: view === 'yearly' ? 'var(--text-strong)' : 'var(--text-muted)',
                            }}
                        >
                            Yearly
                        </button>
                    </div>

                    {/* Date Selectors based on View */}
                    <div className="flex items-center gap-2">
                        {view === 'monthly' ? (
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer"
                                style={{
                                    backgroundColor: 'var(--bg-surface)',
                                    color: 'var(--text-main)',
                                    borderColor: 'var(--border-ash-medium)'
                                }}
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-1">
                                <select
                                    value={fromYear}
                                    onChange={(e) => setFromYear(e.target.value)}
                                    className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer"
                                    style={{
                                        backgroundColor: 'var(--bg-surface)',
                                        color: 'var(--text-main)',
                                        borderColor: 'var(--border-ash-medium)'
                                    }}
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <span style={{ color: 'var(--text-muted)' }} className="text-xs">-</span>
                                <select
                                    value={toYear}
                                    onChange={(e) => setToYear(e.target.value)}
                                    className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer"
                                    style={{
                                        backgroundColor: 'var(--bg-surface)',
                                        color: 'var(--text-main)',
                                        borderColor: 'var(--border-ash-medium)'
                                    }}
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            {/* <div className="w-full flex-1 min-h-[300px]"> */}
            <div className="w-full" style={{ height: '300px' }}>

                {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <i className="fas fa-circle-notch fa-spin text-text-main text-2xl mb-3"></i>
                        <p className="text-sm text-text-muted font-medium">Loading distribution...</p>
                    </div>
                ) : isError ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <span style={{ color: 'var(--action-danger)' }} className="text-sm">
                            {error?.message || 'Failed to load data.'}
                        </span>
                    </div>
                ) : data?.series?.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center border border-dashed rounded-lg" style={{ borderColor: 'var(--border-ash-medium)' }}>
                        <span style={{ color: 'var(--text-muted)' }} className="text-sm">No data available for selected period.</span>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data?.series || []}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="var(--border-ash-medium)"
                            />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                            />
                            <Tooltip cursor={{ fill: 'var(--bg-ash-dark)', opacity: 0.2 }} content={<CustomTooltip />} />

                            {/* Changed dataKey to "cost" to match the API response */}
                            <Bar
                                dataKey="cost"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            >
                                {data?.series?.map((_entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill="var(--action-danger)"
                                        className="hover:opacity-90 transition-opacity duration-300"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};