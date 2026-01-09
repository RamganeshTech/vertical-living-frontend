import { type AxiosInstance } from "axios";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// --- ISSUE FLOW ---



export const getToolsWithoutPagination = async (api: AxiosInstance, organizationId: string) => {
    const { data } = await api.get(`/tool/getalltool/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const getToolRoomWithoutPagination = async (api: AxiosInstance, organizationId: string) => {
    const { data } = await api.get(`/tool/getalltoolroom/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// 1. Generate OTP for Issuing a Tool
export const initiateToolIssueApi = async (issueData: any, api: AxiosInstance) => {
    const { data } = await api.post(`/tool/issue/generateotp`, issueData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 2. Verify OTP to finalize Issuing
export const verifyToolIssueApi = async (verifyData: { otp: string; organizationId: string }, api: AxiosInstance) => {
    const { data } = await api.patch(`/tool/issue/enterotp`, verifyData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const resendOtpInitiateToolIssueApi = async (issueData: any, api: AxiosInstance) => {
    const { data } = await api.post(`/tool/issue/resendotp`, issueData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// --- RETURN FLOW ---



// 3. Generate OTP for Returning a Tool
export const initiateToolReturnApi = async (returnData: any, api: AxiosInstance) => {
    const { data } = await api.post(`/tool/return/generateotp`, returnData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 4. Verify OTP to finalize Return
export const verifyToolReturnApi = async (verifyData: { otp: string; organizationId: string }, api: AxiosInstance) => {
    const { data } = await api.patch(`/tool/return/enterotp`, verifyData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const resendOtpInitiateToolReturnApi = async (issueData: any, api: AxiosInstance) => {
    const { data } = await api.post(`/tool/return/resendotp`, issueData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const adminRoles = ["owner", "staff", "CTO"];
const allInvolvedRoles = ["owner", "staff", "CTO", "worker"];

// --- ISSUE HOOKS ---


export const useGetAllToolsforDD = (organizationId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["toolmaster", "withoutpagination", organizationId],
        queryFn: async () => {
            if (!role || !adminRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await getToolsWithoutPagination(api, organizationId);
        },
        enabled: !!organizationId
    });
};




export const useGetAllToolRoomforDD = (organizationId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["toolroom", "withoutpagination", organizationId],
        queryFn: async () => {
            if (!role || !adminRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await getToolRoomWithoutPagination(api, organizationId);
        },
        enabled: !!organizationId
    });
};



export const useInitiateToolIssue = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (issueData: any) => {
            if (!role || !adminRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await initiateToolIssueApi(issueData, api);
        }
    });
};

export const useVerifyToolIssue = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (verifyData: { otp: string; organizationId: string }) => {
            if (!role || !allInvolvedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await verifyToolIssueApi(verifyData, api);
        },
        onSuccess: () => {
            // Invalidate Tool Master to show tool is now 'issued'
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
        }
    });
};

// --- RETURN HOOKS ---

export const useInitiateToolReturn = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (returnData: any) => {
            if (!role || !adminRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await initiateToolReturnApi(returnData, api);
        }
    });
};

export const useVerifyToolReturn = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (verifyData: { otp: string; organizationId: string }) => {
            if (!role || !allInvolvedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await verifyToolReturnApi(verifyData, api);
        },
        onSuccess: () => {
            // Invalidate Tool Master to show tool is now 'available' or 'repair'
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
        }
    });
};



export const useResendOtpInitiateToolIssue = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (issueData: any) => {
            if (!role || !adminRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await resendOtpInitiateToolIssueApi(issueData, api);
        }
    });
};


export const useResendOtpInitiateToolreturn = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (issueData: any) => {
            if (!role || !adminRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await resendOtpInitiateToolReturnApi(issueData, api);
        }
    });
};







//  log

export const getToolTimelineHistoryApi = async ({
    toolId,
    params,
    api
}: {
    toolId: string;
    params: any;
    api: AxiosInstance
}) => {
    // Note: The route is /tool/history/:toolId, and app.use is /api/tool
    const { data } = await api.get(`/tool/history/${toolId}`, { params });
    if (!data.ok) throw new Error(data.message);

    /** * Backend returns: 
     * { ok: true, count: number, data: [...events], pagination: { total, pages, currentPage } } 
     */
    return data;
};


export const useGetToolHistoryInfinite = (toolId: string, filters: any) => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        // toolId is part of the key so it refetches if you switch tools
        queryKey: ["tool", "history", toolId, filters],
        queryFn: async ({ pageParam = 1 }) => {
            // Requirement check 1: Roles
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("not allowed to make this api call");
            }
            // Requirement check 2: API Instance
            if (!api) {
                throw new Error("API instance not found for role");
            }

            return await getToolTimelineHistoryApi({
                toolId,
                params: { ...filters, page: pageParam, limit: 10 },
                api
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            // Updated to match the backend aggregation pagination response
            const { currentPage, totalPages } = lastPage.pagination || {};

            if (currentPage < totalPages) {
                return currentPage + 1;
            }
            return undefined;
        },
        enabled: !!role && !!api && !!toolId
    });
};