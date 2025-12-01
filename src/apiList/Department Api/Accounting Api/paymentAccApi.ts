import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";
// Adjust these imports based on your actual file structure
// import { useGetRole } from "../../../hooks/useGetRole"; 
// import { getApiForRole } from "../../../utils/roleUtils"; 

// --- Types ---

// --- Types ---
export interface IPaymentFilters {
    organizationId?: string;
    projectId?: string;
    personName?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
    fromSection?: string;
}

interface PaymentResponse {
    success: boolean;
    data: any[]; // Replace 'any' with your actual TS Type for the Payment Object
    pagination: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        nextPage: number | null;
        limit: number;
    };
}

// --- API Functions ---


// --- API Function ---
const getInfinitePaymentsApi = async ({
    api,
    filters,
    pageParam = 1 // Default to page 1
}: {
    api: AxiosInstance;
    filters: IPaymentFilters;
    pageParam: number;
}) => {
    // Merge filters with pagination params
    const { data } = await api.get<PaymentResponse>(`/department/accounting/payments/section/getallpayments`, {
        params: {
            ...filters,
            page: pageParam,
            limit: 10 // You can increase this if you want larger batches
        }
    });

    if (!data.success) throw new Error("Failed to fetch payments");
    return data;
};


const getSinglePaymentApi = async ({
    api,
    id
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.get(`/department/accounting/payments/section/getsinglepayments/${id}`);
    if (!data.success && !data.ok) throw new Error(data.message || "Failed to fetch payment");
    return data.data;
};

const deletePaymentApi = async ({
    api,
    id
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.delete(`/department/accounting/payments/section/deletepayments/${id}`);
    if (!data.success && !data.ok) throw new Error(data.message || "Failed to delete payment");
    return data;
};


const syncPaymenttoAcc = async ({  id, api }: {  id: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/payments/section/syncpaymenttoaccounts/${id}`);
    if (!data.success) throw new Error(data.message);
    return data.data;
};



// --- Hooks ---

/**
 * Hook to get ALL payments with optional filters
*/
export const useInfinitePayments = (filters: IPaymentFilters = {}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        // Key includes filters, so if filters change, the list resets and refetches
        queryKey: ["accounting", "payments", "infinite", filters],

        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");

            return await getInfinitePaymentsApi({ api, filters, pageParam: pageParam as number });
        },

        initialPageParam: 1,

        // Logic to determine the next page number from the backend response
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.nextPage ?? undefined;
        },

        enabled: !!role && !!api,
    });
};

/**
 * Hook to get a SINGLE payment by ID
 */
export const useGetSinglePayment = (id: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["accounting", "payments", "single", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            if (!id) throw new Error("Payment ID is required");

            return await getSinglePaymentApi({ api, id });
        },
        enabled: !!role && !!api && !!id,
    });
};

/**
 * Hook to DELETE a payment
 */
export const useDeletePayment = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await deletePaymentApi({ api, id });
        },
        onSuccess: () => {
            // Invalidate the list to refresh UI after deletion
            queryClient.invalidateQueries({ queryKey: ["accounting", "payments", "all"] });
        }
    });
};



export const useSyncPaymentToAccounts = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({  id }: {  id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await syncPaymenttoAcc({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};