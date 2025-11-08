// ==================== API FUNCTIONS ====================

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

const getAllBills = async ({
    organizationId,
    vendorId,
    page,
    limit,
    date,
    billToDate,
    billFromDate,
    createdFromDate,
    createdToDate,
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
    billToDate?: string
    billFromDate?: string
    createdFromDate?: string,
    createdToDate?: string,
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
    if (billToDate) params.append('billToDate', billToDate);
    if (billFromDate) params.append('billFromDate', billFromDate);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);

    const { data } = await api.get(`/department/accounting/bill/getallbill?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

const createBills = async ({
    billData,
    api
}: {
    billData: any;
    api: AxiosInstance
}) => {
    const { data } = await api.post(`/department/accounting/bill/createbill`, billData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const deleteBill = async ({
    billId,
    api
}: {
    billId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/bill/deletebill/${billId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getSingleBill = async ({
    billId,
    api
}: {
    billId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.get(`/department/accounting/bill/getsinglebill/${billId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// ==================== REACT QUERY HOOKS ====================

// Update the hook to use useInfiniteQuery
export const useGetAllBill = ({
    organizationId,
    vendorId,
    limit = 10,
    search,
    date,
    billToDate,
    billFromDate,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    vendorId?: string;
    limit?: number;
    search?: string;
    date?: string
    billToDate?: string
    billFromDate?: string
    createdFromDate?: string
    createdToDate?: string
    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["bills", organizationId, vendorId, limit, date, search, sortBy, sortOrder, billToDate, billFromDate, createdFromDate, createdToDate],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllBills({
                organizationId,
                vendorId,
                page: pageParam,
                limit,
                date,
                billToDate,
                billFromDate,
                createdFromDate,
                createdToDate,
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

export const useCreateBill = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billData }: { billData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createBills({ billData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};

export const useDeleteBill = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billId }: { billId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteBill({ billId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};

export const useGetSingleBill = (billId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["bill", billId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSingleBill({ billId, api });
        },
        enabled: !!billId && !!role && allowedRoles.includes(role),
    });
};