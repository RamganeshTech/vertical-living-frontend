// ==================== API FUNCTIONS ====================

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

const getAllRetailInvoices = async ({
    organizationId,
    customerId,
    page,
    limit,
    fromInvoiceDate,
    toInvoiceDate,
    createdFromDate,
    createdToDate,
    search,
    minAmount,
    maxAmount,
    api,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    customerId?: string;
    page?: number;
    limit?: number;

    fromInvoiceDate?: string
    toInvoiceDate?: string
    createdFromDate?: string
    createdToDate?: string,
    search?: string;
    minAmount?: number;
    maxAmount?: number;
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

    const { data } = await api.get(`/department/accounting/retailinvoice/getallinvoice?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

const createRetailInvoice = async ({
    invoiceData,
    api
}: {
    invoiceData: any;
    api: AxiosInstance
}) => {
    const { data } = await api.post(`/department/accounting/retailinvoice/createinvocie`, invoiceData);
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
    const { data } = await api.put(`/department/accounting/retailinvoice/updateinvoice/${invoiceId}`, invoiceData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const deleteRetailInvoice = async ({
    invoiceId,
    api
}: {
    invoiceId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/retailinvoice/deleteinvoice/${invoiceId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getSingleRetailInvoice = async ({
    invoiceId,
    api
}: {
    invoiceId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.get(`/department/accounting/retailinvoice/getsingleinvoice/${invoiceId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};




const syncRetailInvoicetoAcc = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/retailinvoice/synctoaccounts/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==================== REACT QUERY HOOKS ====================

// Update the hook to use useInfiniteQuery
export const useGetRetailAllInvoices = ({
    organizationId,
    customerId,
    limit = 10,
    search,
    fromInvoiceDate,
    minAmount,
                maxAmount,
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
    fromInvoiceDate?: string
    toInvoiceDate?: string
minAmount?: number;
    maxAmount?: number;
    createdFromDate?: string
    createdToDate?: string,
    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["retailinvoices", organizationId, customerId, limit, fromInvoiceDate,
            toInvoiceDate,
            createdFromDate,
            minAmount,
                maxAmount,
            createdToDate, search, sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllRetailInvoices({
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

export const useCreateRetailInvoice = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ invoiceData }: { invoiceData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createRetailInvoice({ invoiceData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["retailinvoices"] });
        },
    });
};




export const useUpdateRetailInvoice = () => {
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
            queryClient.invalidateQueries({ queryKey: ["retailinvoices"] });
        },
    });
};



export const useDeleteRetailInvoice = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ invoiceId }: { invoiceId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteRetailInvoice({ invoiceId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["retailinvoices"] });
        },
    });
};

export const useGetSingleRetailInvoice = (invoiceId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["retailinvoice", invoiceId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSingleRetailInvoice({ invoiceId, api });
        },
        enabled: !!invoiceId && !!role && allowedRoles.includes(role),
    });
};

// currently not in use , it will be sentot the accounts dept once it is created, and updated automatically
export const useSyncRetailInvoiceToAccounts = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await syncRetailInvoicetoAcc({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};