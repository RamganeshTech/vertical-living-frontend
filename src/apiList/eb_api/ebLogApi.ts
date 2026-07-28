import { useQuery, useMutation } from '@tanstack/react-query';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';
import { queryClient } from '../../QueryClient/queryClient';
// Adjust your imports based on your actual file structure
// import { queryClient } from '...'; 
// import Api from '...';
// import { useAuthData } from '...';
// import { checkPermission } from '...';
// import type { BaseResponse } from '...';

// Replace with your actual interface based on your Mongoose model
export interface IEBLog {
    _id: string;
    organizationId: string;
    premisesId: any; // Can be string or populated object
    ebLogNo: string;
    date: string;
    time: string;
    meterReading: number;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BaseResponse<T = any> {
    ok: boolean;
    data?: T;
    message?: string
}


// Separate role arrays for Read and Modify operations
const allowedRoles = ["owner", "staff", "cto"]

// ============================
// GET ALL EB LOGS (with filters)
// ============================
export const useGetAllEBLogs = (
    organizationId?: string,
    params?: {
        premisesId?: string;
        fromDate?: string;
        toDate?: string;
        minReading?: string;
        maxReading?: string;
        search?: string;
    }
) => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ['ebLogs', organizationId, params],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, allowe);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.get<BaseResponse<IEBLog[]>>(`/eb/logs/get-all/${organizationId}`, {
                    params, // Axios will automatically format these as query strings
                });

                if (!data.ok) throw new Error(data.message || 'Failed to fetch EB logs');
                return data.data as IEBLog[];
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);

                //  so i the nhnadler in the try catch just ention toast.error(error.message)
            }
        },
        enabled: !!organizationId,
    });
};

// ============================
// GET EB LOG BY ID
// ============================
export const useGetEBLogById = (organizationId?: string, logId?: string) => {
    // const { currentRole } = useAuthData();

    const { role } = useGetRole();
    const api = getApiForRole(role!);


    return useQuery({
        queryKey: ['ebLog', organizationId, logId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, allowe);

                // Fixed the double slash '//get/' from your routes to a single slash here

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");

                const { data } = await api.get<BaseResponse<IEBLog>>(`/eb/logs/get/${organizationId}/${logId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to fetch EB log');
                return data.data as IEBLog;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId && !!logId,
    });
};

// ============================
// CREATE EB LOG
// ============================
export const useCreateEBLog = () => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            organizationId,
            payload
        }: {
            organizationId: string;
            payload: { premisesId: string; date: string; time: string; meterReading: number; note?: string }
        }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);


                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");

                const { data } = await api.post<BaseResponse<IEBLog>>(`/eb/logs/create/${organizationId}`, payload);

                if (!data.ok) throw new Error(data.message || 'Failed to create EB log');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ebLogs', variables.organizationId] });
        },
    });
};

// ============================
// UPDATE EB LOG
// ============================
export const useUpdateEBLog = () => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            organizationId,
            logId,
            payload
        }: {
            organizationId: string;
            logId: string;
            payload: { date?: string; time?: string; meterReading?: number; note?: string }
        }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);


                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");

                const { data } = await api.put<BaseResponse<IEBLog>>(`/eb/logs/update/${organizationId}/${logId}`, payload);

                if (!data.ok) throw new Error(data.message || 'Failed to update EB log');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ebLogs', variables.organizationId] });
            queryClient.invalidateQueries({ queryKey: ['ebLog', variables.organizationId, variables.logId] });
        },
    });
};

// ============================
// DELETE EB LOG
// ============================
export const useDeleteEBLog = () => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, logId }: { organizationId: string; logId: string }) => {
            try {
                // checkPermission(currentRole, MODIFY_ROLES);


                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");

                const { data } = await api.delete<BaseResponse<null>>(`/eb/logs/delete/${organizationId}/${logId}`);

                if (!data.ok) throw new Error(data.message || 'Failed to delete EB log');
                return data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ebLogs', variables.organizationId] });
            // Optionally invalidate the specific log if needed, though it's deleted
            queryClient.removeQueries({ queryKey: ['ebLog', variables.organizationId, variables.logId] });
        },
    });
};



// ============================
// TYPE DEFINITIONS
// ============================

export interface IEBDashboardOverview {
    totalConsumptionYesterday: number;
    premisesReportedYesterday: number;
    totalPremises: number;
    recentLogs: any[]; // Replace 'any' with 'IEBLog' if you have it imported
}

export interface IEBPremisesAnalytics {
    premisesId: string;
    premisesName: string;
    yesterdayConsumption: number | null;
    avg30DayConsumption: number | null;
    projectedThisMonthConsumption: number | null;
    totalConsumption: number | null;
}



// ============================
// DASHBOARD OVERVIEW HOOK
// ============================
export const useGetEBDashboardOverview = (organizationId?: string) => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ['ebDashboardOverview', organizationId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, allowe);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.get<BaseResponse<IEBDashboardOverview>>(
                    `/eb/logs/analytics/${organizationId}/dashboard`
                );

                if (!data.ok) throw new Error(data.message || 'Failed to fetch EB dashboard overview');
                return data.data as IEBDashboardOverview;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId,
        // Optional: you can set staleTime if you don't want it refetching constantly on window focus
        // since the backend caches it for 10 minutes anyway
        // staleTime: 5 * 60 * 1000, 
    });
};

// ============================
// PREMISES ANALYTICS HOOK
// ============================
export const useGetEBPremisesAnalytics = (organizationId?: string) => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ['ebPremisesAnalytics', organizationId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, allowe);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.get<BaseResponse<IEBPremisesAnalytics[]>>(
                    `/eb/logs/analytics/${organizationId}/premises`
                );

                if (!data.ok) throw new Error(data.message || 'Failed to fetch premises analytics');
                return data.data as IEBPremisesAnalytics[];
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId,
    });
};





export interface ISeriesPoint {
    label: string;
    kwUsed: number | null;
    cost?: number | null; // <-- Added this field
}

export interface IChartPremises {
    premisesId: string;
    premisesName: string;
    series: ISeriesPoint[];
}

export interface IEBConsumptionChartData {
    period: string;
    granularity: "day" | "month";
    rangeStart: string;
    rangeEnd: string;
    premises: IChartPremises[];
}

// ============================
// PREMISES ANALYTICS HOOK (LINE CHART)
// ============================
export const useGetPremisesEBConsumptionChart = (
    organizationId?: string,
    params?: { period?: string; fromDate?: string; toDate?: string }
) => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        // 1. Include params in the queryKey so it refetches when the period/dates change
        queryKey: ['ebConsumptionChart', organizationId, params],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, allowe);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                // 2. Pass the params to Axios so they are sent in the URL query string
                const { data } = await api.get<BaseResponse<IEBConsumptionChartData>>(
                    `/eb/logs/analytics/${organizationId}/line-chart/consumption`,
                    { params }
                );

                if (!data.ok) throw new Error(data.message || 'Failed to fetch chart data');
                return data.data as IEBConsumptionChartData;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId,
    });
};





// Add to your existing interfaces
export interface IEBBillKpis {
    monthlyProjectedBill: number;
    projectedUnitsThisMonth: number;
    estimatedDailyEBCost: number;
}

// ============================
// BILLING KPIs HOOK
// ============================
export const useGetEBBillKpis = (organizationId?: string) => {
    // const { currentRole } = useAuthData();


    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ['ebBillKpis', organizationId],
        queryFn: async () => {
            try {
                // checkPermission(currentRole, allowe);

                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");


                const { data } = await api.get<BaseResponse<IEBBillKpis>>(
                    `/eb/logs/analytics/${organizationId}/bill/kpi`
                );

                if (!data.ok) throw new Error(data.message || 'Failed to fetch billing KPIs');
                return data.data as IEBBillKpis;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId,
    });
};



export interface IEBPremiseCharge {
    view: string,
    rangeStart: string,
    rangeEnd: string,
    series: { label: string; value: number }[]; // Typed the series based on standard Recharts expectations
    selectedRangeTotalCost: number
    currentYearTotalCost: number
}

interface UseGetEbPremisesChargeProps {
    organizationId: string;
    premisesId: string;
    view: 'monthly' | 'yearly';
    year?: string;
    fromYear?: string;
    toYear?: string;
}

export const useGetEbPremisesCharge = ({ 
    organizationId, 
    premisesId, 
    view, 
    year, 
    fromYear, 
    toYear 
}: UseGetEbPremisesChargeProps) => {
    const { role } = useGetRole(); // Adjust based on your actual auth hooks
    const api = getApiForRole(role!);

    return useQuery({
        // Add filters to queryKey so it refetches when they change
        queryKey: ['ebBillKpis', organizationId, premisesId, view, year, fromYear, toYear],
        queryFn: async () => {
            try {
                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
                if (!api) throw new Error("API instance not found for role");

                // Construct query params
                const params = new URLSearchParams();
                params.append('view', view);
                if (view === 'monthly' && year) params.append('year', year);
                if (view === 'yearly' && fromYear && toYear) {
                    params.append('fromYear', fromYear);
                    params.append('toYear', toYear);
                }

                const { data } = await api.get<BaseResponse<IEBPremiseCharge>>(
                    `/eb/logs/analytics/${organizationId}/${premisesId}/charge?${params.toString()}`
                );

                if (!data.ok) throw new Error(data.message || 'Failed to fetch billing KPIs');
                return data.data as IEBPremiseCharge;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                throw new Error(errorMessage);
            }
        },
        enabled: !!organizationId && !!premisesId,
    });
};