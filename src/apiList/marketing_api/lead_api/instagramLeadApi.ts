import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";

import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";
// Assume you import your useGetRole and getApiForRole hooks here


export const getInstagramLeads = async ({
    api,
    pageParam = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    organizationId
}: {
    api: AxiosInstance;
    pageParam?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    organizationId: string;
}) => {
    const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
        organizationId
    });

    if (status) params.append("status", status);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const { data } = await api.get(`/v1/lead/getall?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

export const getInstagramLeadById = async ({
    api,
    id
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.get(`/v1/lead/getsingle/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const updateInstagramLeadStatus = async ({
    api,
    id,
    status
}: {
    api: AxiosInstance;
    id: string;
    status: string;
}) => {
    const { data } = await api.patch(`/v1/lead/update-status/${id}`, { status });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};




export const getInstagramLeadsByMeta = async ({
    api,
    organizationId
}: {
    api: AxiosInstance;
    organizationId: string;
}) => {
    const params = new URLSearchParams({
        organizationId
    });

    const { data } = await api.get(`/v1/lead/getall-by-meta?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data?.data;
};

export const getInstagramLeadByIdByMeta = async ({
    api,
    id
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.get(`/v1/lead/getsingle-by-meta/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const allowedRoles = ["owner", "staff", "CTO"];

// Hook 1: Infinite Query for Kanban/Table with Filters
export const useGetInstagramLeads = (filters: {
    organizationId: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["instagramLeads", filters],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getInstagramLeads({
                api,
                pageParam,
                limit: filters.limit || 10,
                status: filters.status,
                startDate: filters.startDate,
                endDate: filters.endDate,
                organizationId: filters.organizationId
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: !!role && allowedRoles.includes(role) && !!api && !!filters.organizationId,
    });
};

// Hook 2: Get Single Lead Details
export const useGetSingleInstagramLead = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instagramLead", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getInstagramLeadById({ api, id });
        },
        enabled: !!role && allowedRoles.includes(role) && !!api && !!id,
    });
};

// Hook 3: Mutation to Update Status (Drag and Drop in Kanban)
export const useUpdateInstagramLeadStatus = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await updateInstagramLeadStatus({ api, id, status });
        },
        onSuccess: (_, variables) => {
            // Invalidate the list to refresh the Kanban board
            queryClient.invalidateQueries({ queryKey: ["instagramLeads"] });
            // Invalidate the specific lead if it's currently open
            queryClient.invalidateQueries({ queryKey: ["instagramLead", variables.id] });
        }
    });
};







// OFFICIAL meta api


// Hook 1: Infinite Query for Kanban/Table with Filters
export const useGetInstagramLeadsByMeta = (filters: {
    organizationId: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instagramLeads-meta", filters],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getInstagramLeadsByMeta({
                api,
               
                organizationId: filters.organizationId
            });
        },
        enabled: !!role && allowedRoles.includes(role) && !!api && !!filters.organizationId,
    });
};

// Hook 2: Get Single Lead Details
export const useGetSingleInstagramLeadByMeta = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instagramLead-meta", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getInstagramLeadByIdByMeta({ api, id });
        },
        enabled: !!role && allowedRoles.includes(role) && !!api && !!id,
    });
};
