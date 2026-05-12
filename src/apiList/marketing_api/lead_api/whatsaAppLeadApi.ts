import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";


import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";
// Assume you import your useGetRole and getApiForRole hooks here


export const getWhatsAppLeads = async ({
    api,
    pageParam = 1,
    limit = 30, // Defaulting to 30 for the Kanban view
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

    // Make sure this matches your Express route exactly!
    const { data } = await api.get(`/v1/lead/whatsapp/whatsapp/getall?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

export const getWhatsAppLeadById = async ({
    api,
    id
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.get(`/v1/lead/whatsapp/whatsapp/getsingle/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const updateWhatsAppLeadStatus = async ({
    api,
    id,
    status
}: {
    api: AxiosInstance;
    id: string;
    status: string;
}) => {
    const { data } = await api.patch(`/v1/lead/whatsapp/whatsapp/update-status/${id}`, { status });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const allowedRoles = ["owner", "staff", "CTO"];

// Hook 1: Infinite Query for Kanban/Table with Filters
export const useGetWhatsAppLeads = (filters: {
    organizationId: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["whatsappLeads", filters],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getWhatsAppLeads({
                api,
                pageParam,
                limit: filters.limit || 30,
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
        // enabled: !!role && allowedRoles.includes(role) && !!api && !!filters.organizationId,
        enabled: !!filters.organizationId, // Simplified for testing
    });
};

// Hook 2: Get Single Lead Details
export const useGetSingleWhatsAppLead = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);



    return useQuery({
        queryKey: ["whatsappLead", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getWhatsAppLeadById({ api, id });
        },
        // enabled: !!role && allowedRoles.includes(role) && !!api && !!id,
        enabled: !!id,
    });
};

// Hook 3: Mutation to Update Status (Drag and Drop in Kanban)
export const useUpdateWhatsAppLeadStatus = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);



    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await updateWhatsAppLeadStatus({ api, id, status });
        },
        onSuccess: (_, variables) => {
            // Invalidate the list to refresh the Kanban board automatically
            queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });
            // Invalidate the specific lead if someone is viewing the detail page
            queryClient.invalidateQueries({ queryKey: ["whatsappLead", variables.id] });
        }
    });
};