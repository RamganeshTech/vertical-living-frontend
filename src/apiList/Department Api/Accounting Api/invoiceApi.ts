// ==================== API FUNCTIONS ====================

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

const getAllInvoices = async ({
    organizationId,
    customerId,
    page,
    limit,
    fromInvoiceDate,
    toInvoiceDate,
    createdFromDate,
    minAmount,
    maxAmount,
    createdToDate,
    search,
    sortBy,
    sortOrder,
    api
}: {
    organizationId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
    fromInvoiceDate?: string
    toInvoiceDate?: string
    createdFromDate?: string
    createdToDate?: string,
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    api: AxiosInstance,
    sortBy?: string;
    sortOrder?: string;
}) => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (customerId) params.append('customerId', customerId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (fromInvoiceDate) params.append('fromInvoiceDate', fromInvoiceDate);
    if (toInvoiceDate) params.append('toInvoiceDate', toInvoiceDate);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);
    if (minAmount) params.append('minAmount', minAmount.toString());
    if (maxAmount) params.append('maxAmount', maxAmount.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (search) params.append('search', search);

    const { data } = await api.get(`/department/accounting/invoice/getallinvoice?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

const createInvoice = async ({
    invoiceData,
    api
}: {
    invoiceData: any;
    api: AxiosInstance
}) => {
    const { data } = await api.post(`/department/accounting/invoice/createinvoice`, invoiceData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const updateInvoice = async ({
    invoiceData,
    invoiceId,
    api
}: {
    invoiceData: any;
    invoiceId: any;
    api: AxiosInstance
}) => {
    const { data } = await api.put(`/department/accounting/invoice/updateinvoice/${invoiceId}`, invoiceData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};
const deleteInvoice = async ({
    invoiceId,
    api
}: {
    invoiceId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/invoice/deleteinvoice/${invoiceId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getSingleInvoice = async ({
    invoiceId,
    api
}: {
    invoiceId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.get(`/department/accounting/invoice/getsingleinvoice/${invoiceId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const syncInvoicetoAcc = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/invoice/synctoaccounts/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// ==================== REACT QUERY HOOKS ====================

// Update the hook to use useInfiniteQuery
export const useGetAllInvoices = ({
    organizationId,
    customerId,
    limit = 10,
    search,
    // date,
    minAmount,
    maxAmount,
    fromInvoiceDate,
    toInvoiceDate,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    customerId?: string;
    limit?: number;
    search?: string;
    // date?: string
    minAmount?: number;
    maxAmount?: number;
    fromInvoiceDate?: string
    toInvoiceDate?: string
    createdFromDate?: string
    createdToDate?: string,
    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["invoices", organizationId, customerId, limit, fromInvoiceDate,
            toInvoiceDate,
            createdFromDate,
            createdToDate, search, sortBy, sortOrder, minAmount,
            maxAmount],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllInvoices({
                organizationId,
                customerId,
                page: pageParam,
                limit,
                fromInvoiceDate,
                toInvoiceDate,
                createdFromDate,
                createdToDate,
                minAmount,
                maxAmount,
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

export const useCreateInvoice = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ invoiceData }: { invoiceData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createInvoice({ invoiceData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};



export const useUpdateInvoice = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ invoiceData, invoiceId }: { invoiceData: any, invoiceId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await updateInvoice({ invoiceData, invoiceId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};



export const useDeleteInvoice = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ invoiceId }: { invoiceId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteInvoice({ invoiceId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};

export const useGetSingleInvoice = (invoiceId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["invoice", invoiceId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSingleInvoice({ invoiceId, api });
        },
        enabled: !!invoiceId && !!role && allowedRoles.includes(role),
    });
};



// currently not in use , it will be sentot the accounts dept once it is created, and updated automatically
export const useSyncInvoiceToAccounts = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await syncInvoicetoAcc({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};