import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import type { AxiosInstance } from "axios";
import { queryClient } from "../../../QueryClient/queryClient";

const allowedRoles = ["owner", "CTO", "staff"];

export interface PreSalesFilters {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}

interface PreSalesResponse {
    ok: boolean;
    message?: string;
    data: any[];
    page: number;
    hasMore: boolean;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

// 🔹 GET All Pre-Sales Quotes
export const getAllPreSalesQuote = async ({
    organizationId,
    api,
    filters,
    pageParam = 1,
}: {
    organizationId: string;
    api: AxiosInstance;
    filters?: PreSalesFilters;
    pageParam: number;
}) => {
    const params: any = {
        organizationId,
        page: pageParam,
        limit: 20,
        search: filters?.search,
        status: filters?.status,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
    };

    const { data } = await api.get<PreSalesResponse>(`/quote/presales/getall`, { params });
    if (!data.ok) throw new Error(data.message || "Failed to fetch quotes");
    return data;
};

// 🔹 GET Single Quote
export const getSinglePreSalesQuote = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.get(`/quote/presales/single/${id}`);
    if (!data.ok) throw new Error(data.message || "Failed to fetch quote");
    return data.data;
};

// 🔹 CREATE Initial Quote
export const createPreSalesQuote = async ({ payload, api }: { payload: any; api: AxiosInstance }) => {
    const { data } = await api.post(`/quote/presales/createmainquote`, payload);
    if (!data.ok) throw new Error(data.message || "Failed to create quote");
    return data;
};

// 🔹 UPDATE Quote Configuration
export const updatePreSalesQuote = async ({ id, payload, api }: { id: string; payload: any; api: AxiosInstance }) => {
    const { data } = await api.put(`/quote/presales/update/${id}`, payload);
    if (!data.ok) throw new Error(data.message || "Failed to update quote");
    return data;
};



const updatePreSalesQuote4 = async ({ api, id, formData }: { api: AxiosInstance, id: string, formData: any }) => {
    const res = await api.put(`/quote/presales/update/quotepdfdetails/${id}`, formData);
    // console.log("res form api", res.data)
    if (!res?.data.ok) throw new Error(res?.data?.message || "Failed to delete materials");
    return res?.data.data;
}


// 🔹 DELETE Quote
export const deletePreSalesQuote = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.delete(`/quote/presales/delete/${id}`);
    if (!data.ok) throw new Error(data.message || "Failed to delete quote");
    return data;
};


// 🔹 DELETE Quote
export const clonePreSalesQuote = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    const { data } = await api.put(`/quote/presales/clone/${id}`);
    if (!data.ok) throw new Error(data.message || "Failed to delete quote");
    return data;
};


export const updateMainPreSalesQuote = async ({ id, api, mainQuoteName }: { id: string; api: AxiosInstance, mainQuoteName:string }) => {
    const { data } = await api.put(`/quote/presales/updatemainquote/${id}`, {mainQuoteName});
    if (!data.ok) throw new Error(data.message || "Failed to delete quote");
    return data;
};




// ============================================================================
// HOOKS
// ============================================================================

// 1️⃣ Hook: List View (Infinite Scroll)
export const useGetAllPreSalesQuote = (organizationId: string, filters?: PreSalesFilters) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["presales", "infinite", organizationId, filters],
        queryFn: async ({ pageParam = 1 }) => {
            //   if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");
            return await getAllPreSalesQuote({ organizationId, api: api!, filters, pageParam: pageParam as number });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
        enabled: !!organizationId && !!role && !!api,
    });
};

// 2️⃣ Hook: Single Details
export const useGetSinglePreSalesQuote = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["presales", "single", id],
        queryFn: async () => {
            // if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");
            return await getSinglePreSalesQuote({ id, api: api! });
        },
        enabled: !!id && !!role && !!api,
    });
};


// 3️⃣ Hook: Create Quote
export const useCreatePreSalesQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            // ✅ Security & API Check
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await createPreSalesQuote({ payload, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["presales", "infinite"] });
        },
    });
};

// 4️⃣ Hook: Update Quote
export const useUpdatePreSalesQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            // ✅ Security & API Check
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update quotes");
            if (!api) throw new Error("API instance for role not found");

            return await updatePreSalesQuote({ id, payload, api });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["presales", "single", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["presales", "infinite"] });
        },
    });
};

// 5️⃣ Hook: Delete Quote
export const useDeletePreSalesQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            // ✅ Security & API Check
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to delete quotes");
            if (!api) throw new Error("API instance for role not found");

            return await deletePreSalesQuote({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["presales", "infinite"] });
        },
    });
};



// 5️⃣ Hook: Delete Quote
export const useClonePreSalesQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            // ✅ Security & API Check
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to delete quotes");
            if (!api) throw new Error("API instance for role not found");

            return await clonePreSalesQuote({ id, api });
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["presales", "single", id] });
            queryClient.invalidateQueries({ queryKey: ["presales", "infinite"] });
        },
    });
};



export const useUpdateMainPreSalesQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({id, mainQuoteName}:{id: string, mainQuoteName: string}) => {
            // ✅ Security & API Check
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to delete quotes");
            if (!api) throw new Error("API instance for role not found");

            return await updateMainPreSalesQuote({ id, api, mainQuoteName });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["presales", "infinite"] });
        },
    });
};




export const useUpdatePreSalesQuote4Alone = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, formData }: { id: string, formData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await updatePreSalesQuote4({ api, id, formData })
        },
        onSuccess: (_, {id}) => {
            queryClient.invalidateQueries({ queryKey: ["presales", "single", id] })
        }
    });
};


