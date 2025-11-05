// ==================== API FUNCTIONS ====================

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

const getAllPurchases = async ({
    organizationId,
    vendorId,
    page,
    limit,
    date,
    search,
    sortBy,
    sortOrder,
    api
}: {
    organizationId?: string;
    vendorId?: string;
    page?: number;
    limit?: number;
    date?: string;
    search?: string;
    api: AxiosInstance,
    sortBy?: string;
    sortOrder?: string;
}) => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (vendorId) params.append('vendorId', vendorId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (date) params.append('date', date);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (search) params.append('search', search);

    const { data } = await api.get(`/department/accounting/purchase/getallpurchase?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

const createPurchases = async ({
    purchaseData,
    api
}: {
    purchaseData: any;
    api: AxiosInstance
}) => {
    const { data } = await api.post(`/department/accounting/purchase/createpurchase`, purchaseData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const deletePurchase = async ({
    purchaseId,
    api
}: {
    purchaseId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/purchase/deletepurchase/${purchaseId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getSinglePurchase = async ({
    purchaseId,
    api
}: {
    purchaseId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.get(`/department/accounting/purchase/getsinglepurchase/${purchaseId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// ==================== REACT QUERY HOOKS ====================

// Update the hook to use useInfiniteQuery
export const useGetAllPurchase = ({
    organizationId,
    vendorId,
    limit = 10,
    search,
    date,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    vendorId?: string;
    limit?: number;
    search?: string;
    date?: string
    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["purchases", organizationId, vendorId, limit, date, search, sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllPurchases({
                organizationId,
                vendorId,
                page: pageParam,
                limit,
                date,
                search,
                sortBy,
                sortOrder,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.pagination.page > 1) {
                return firstPage.pagination.page - 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && allowedRoles.includes(role) && !!organizationId
    });
};

export const useCreatePurchase = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ purchaseData }: { purchaseData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createPurchases({ purchaseData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
        },
    });
};

export const useDeletePurchase = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ purchaseId }: { purchaseId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deletePurchase({ purchaseId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
        },
    });
};

export const useGetSinglePurchase = (purchaseId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["purchase", purchaseId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSinglePurchase({ purchaseId, api });
        },
        enabled: !!purchaseId && !!role && allowedRoles.includes(role),
    });
};