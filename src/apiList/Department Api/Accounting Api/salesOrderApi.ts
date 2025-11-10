// ==================== API FUNCTIONS ====================

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

const getAllSalesOrder = async ({
    organizationId,
    customerId,
    page,
    limit,
    fromSalesOrderDate,
    toSalesOrderDate,
    createdFromDate,
    createdToDate,
    search,
    api,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
    fromSalesOrderDate?: string
    toSalesOrderDate?: string
    createdFromDate?: string
    createdToDate?: string,

    search?: string;
    api: AxiosInstance;
    sortBy?: string;
    sortOrder?: string;
}) => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (customerId) params.append('customerId', customerId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (fromSalesOrderDate) params.append('fromSalesOrderDate', fromSalesOrderDate);
    if (toSalesOrderDate) params.append('toSalesOrderDate', toSalesOrderDate);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);
    if (search) params.append('search', search);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (sortBy) params.append('sortBy', sortBy);



    const { data } = await api.get(`/department/accounting/salesorder/getallorder?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

const createSalesOrder = async ({
    salesData,
    api
}: {
    salesData: any;
    api: AxiosInstance
}) => {
    const { data } = await api.post(`/department/accounting/salesorder/createorder`, salesData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const deleteSalesOrder = async ({
    salesId,
    api
}: {
    salesId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/salesorder/deleteorder/${salesId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getSingleSalesOrder = async ({
    salesId,
    api
}: {
    salesId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.get(`/department/accounting/salesorder/getsingleorder/${salesId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// ==================== REACT QUERY HOOKS ====================

// Update the hook to use useInfiniteQuery
export const useGetAllSalesOrders = ({
    organizationId,
    customerId,
    limit = 10,
    search,
    fromSalesOrderDate,
    toSalesOrderDate,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    customerId?: string;
    limit?: number;
    search?: string;
    fromSalesOrderDate?: string
    toSalesOrderDate?: string
    createdFromDate?: string
    createdToDate?: string,

    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["salesorder", organizationId, customerId, limit, search , sortBy, sortOrder, fromSalesOrderDate, toSalesOrderDate, createdFromDate, createdToDate],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllSalesOrder({
                organizationId,
                customerId,
                page: pageParam,
                limit,
                fromSalesOrderDate,
                toSalesOrderDate,
                createdFromDate,
                createdToDate,
                search,
                api,
                sortBy,
                sortOrder
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

export const useCreateSalesOrder = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ salesData }: { salesData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createSalesOrder({ salesData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salesorder"] });
        },
    });
};

export const useDeleteSalesOrder = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ salesId }: { salesId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteSalesOrder({ salesId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salesorder"] });
        },
    });
};

export const useGetSingleSalesOrder = (salesId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["salesordersingle", salesId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSingleSalesOrder({ salesId, api });
        },
        enabled: !!salesId && !!role && allowedRoles.includes(role),
    });
};