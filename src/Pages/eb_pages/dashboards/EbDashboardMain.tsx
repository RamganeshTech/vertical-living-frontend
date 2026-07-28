import React from 'react';
import { EbAnalyticsCards, EbConsumptionChart, EbCostChart, EbRecentLogsList, EbStatCard, EbConsumptionDoughnut } from './components/EbDashboardWidgets';
import { useGetEBBillKpis, useGetEBDashboardOverview, useGetEBPremisesAnalytics } from '../../../apiList/eb_api/ebLogApi';
import { useParams } from 'react-router-dom';
export const EbDashboardMain: React.FC = () => {
    // const { organizationId } = useAuthData();
        const { organizationId } = useParams() as { organizationId: string };


    // 1. Fetch Dashboard Queries
    const { data: overviewData, isLoading: isOverviewLoading } = useGetEBDashboardOverview(organizationId!);
    const { data: billingData, isLoading: isBillingLoading } = useGetEBBillKpis(organizationId!);
    const { data: analyticsData = [], isLoading: isAnalyticsLoading } = useGetEBPremisesAnalytics(organizationId!);

    return (
        <div className="h-full bg-brand-surface p-2 font-[poppins] flex flex-col">
            <div className="max-w-7xl mx-auto space-y-6 w-full flex-1">

                {/* HEADER SECTION */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ash-medium pb-4 shrink-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-text-strong flex items-center gap-3">
                            <i className="fas fa-chart-pie text-text-main"></i>
                            Electricity Dashboard
                        </h1>
                        <p className="text-sm text-text-muted mt-1 font-normal">
                            Monitor campus-wide power consumption and trends.
                        </p>
                    </div>
                </header>

                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                    {/* Usage KPIs */}
                    <EbStatCard
                        title="Yday Usage"
                        value={
                            overviewData?.totalConsumptionYesterday !== undefined 
                                ? `${overviewData.totalConsumptionYesterday.toLocaleString()} kWh` 
                                : '0 kWh'
                        }
                        icon="fas fa-bolt"
                        subtitle="All reported premises"
                        isLoading={isOverviewLoading}
                        valueColor="text-text-main"
                    />
                    
                    <EbStatCard
                        title="Reported"
                        value={
                            overviewData ? `${overviewData.premisesReportedYesterday} / ${overviewData.totalPremises}` : '0 / 0'
                        }
                        icon="fas fa-building"
                        subtitle="Premises logged yday"
                        isLoading={isOverviewLoading}
                        valueColor={
                            overviewData?.premisesReportedYesterday === overviewData?.totalPremises && (overviewData?.totalPremises ?? 0) > 0
                                ? "text-action-success" 
                                : "text-text-strong"
                        }
                    />

                    <EbStatCard
                        title="Recent Logs"
                        value={overviewData?.recentLogs?.length ? `${overviewData.recentLogs.length} logs` : '0 logs'}
                        icon="fas fa-clipboard-check"
                        subtitle="Latest recorded entries"
                        isLoading={isOverviewLoading}
                    />

                    {/* Financial KPIs */}
                    <EbStatCard
                        title="Proj. Bill (Mo)"
                        value={billingData ? `₹${billingData.monthlyProjectedBill.toLocaleString('en-IN')}` : '₹0'}
                        icon="fas fa-file-invoice-dollar"
                        subtitle="Est. total this month"
                        isLoading={isBillingLoading}
                        valueColor="text-text-main"
                    />
                    
                    <EbStatCard
                        title="Daily Cost (Est)"
                        value={billingData ? `₹${billingData.estimatedDailyEBCost.toLocaleString('en-IN')}` : '₹0'}
                        icon="fas fa-calendar-day"
                        subtitle="MTD average cost"
                        isLoading={isBillingLoading}
                        valueColor="text-text-main"
                    />

                    <EbStatCard
                        title="Proj. Units (Mo)"
                        value={billingData ? `${billingData.projectedUnitsThisMonth.toLocaleString('en-IN')} kWh` : '0 kWh'}
                        icon="fas fa-tachometer-alt"
                        subtitle="Est. month-end usage"
                        isLoading={isBillingLoading}
                        valueColor="text-text-main"
                    />
                </div>

              <div className="w-full pt-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Line Chart takes up 2/3 of the space on large screens */}
                    <div className="lg:col-span-2">
                        <EbConsumptionChart />
                    </div>
                    
                    {/* Doughnut Chart takes up 1/3 of the space */}
                    <div className="lg:col-span-1 h-full">
                        <EbConsumptionDoughnut 
                            data={analyticsData} 
                            isLoading={isAnalyticsLoading} 
                        />
                    </div>
                </div>

                {/* ROW 3: COST CHART (Full Width below) */}
                <div className="w-full mt-5">
                    <EbCostChart />
                </div>

                {/* ROW 2: RECENT LOGS (Full Width List) */}
                <div className="w-full">
                    <EbRecentLogsList
                        logs={overviewData?.recentLogs || []}
                        isLoading={isOverviewLoading}
                    />
                </div>

                {/* ROW 3: PREMISES ANALYTICS (Full Width Grid of Cards) */}
                <div className="w-full space-y-3 pt-2">
                    <div className="flex items-center gap-2 px-1">
                        <i className="fas fa-chart-bar text-text-main"></i>
                        <h3 className="text-lg font-semibold text-text-strong">Premises Consumption Analytics</h3>
                    </div>
                    <EbAnalyticsCards
                        data={analyticsData}
                        isLoading={isAnalyticsLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default EbDashboardMain;