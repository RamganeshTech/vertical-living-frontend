// ==================== API FUNCTIONS ====================

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

const getAllVendorPayment = async ({
    organizationId,
    vendorId,
    page,
    limit,
    // date,
    vendorPaymentFromDate, vendorPaymentToDate,createdFromDate,createdToDate,
    search,
    sortBy,
    sortOrder,
    api
}: {
    organizationId?: string;
    vendorId?: string;
    page?: number;
    limit?: number;
    // date?: string;
     vendorPaymentFromDate?: string
    vendorPaymentToDate?: string
    createdFromDate?: string
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
    if (vendorPaymentFromDate) params.append('vendorPaymentFromDate', vendorPaymentFromDate);
    if (vendorPaymentToDate) params.append('vendorPaymentToDate', vendorPaymentToDate);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (search) params.append('search', search);

    const { data } = await api.get(`/department/accounting/vendorpayment/getall?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

const createVendorPayment = async ({
    vendorpaymentsData,
    api
}: {
    vendorpaymentsData: any;
    api: AxiosInstance
}) => {
    const { data } = await api.post(`/department/accounting/vendorpayment/create`, vendorpaymentsData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const updateVendorPayment = async ({
    vendorpaymentsData,
    id,
    api
    
}: {
    vendorpaymentsData: any;
    id:string,
    api: AxiosInstance
}) => {
    const { data } = await api.put(`/department/accounting/vendorpayment/update/${id}`, vendorpaymentsData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const syncVendorPaymentToPayment = async ({ id, api }: { id: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/vendorpayment/sendtopayment/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const deleteVendorPayment = async ({
    vendorpaymentsId,
    api
}: {
    vendorpaymentsId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/vendorpayment/delete/${vendorpaymentsId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getSingleVendorPayment = async ({
    vendorpaymentsId,
    api
}: {
    vendorpaymentsId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.get(`/department/accounting/vendorpayment/getsingle/${vendorpaymentsId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// ==================== REACT QUERY HOOKS ====================

// Update the hook to use useInfiniteQuery
export const useGetAllVendorPayments = ({
    organizationId,
    vendorId,
    limit = 10,
    search,
    vendorPaymentFromDate,
    vendorPaymentToDate,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder
}: {
    organizationId?: string;
    vendorId?: string;
    limit?: number;
    search?: string;
    // date?: string
    vendorPaymentFromDate?: string
    vendorPaymentToDate?: string
    createdFromDate?: string
    createdToDate?: string,
    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["VendorPayment", organizationId, vendorId, limit, vendorPaymentFromDate, vendorPaymentToDate, createdFromDate, createdToDate, search, sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllVendorPayment({
                organizationId,
                vendorId,
                page: pageParam,
                limit,
                vendorPaymentFromDate, vendorPaymentToDate, createdFromDate, createdToDate,
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

export const useCreatevendorpayments = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ vendorpaymentsData }: { vendorpaymentsData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createVendorPayment({ vendorpaymentsData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["VendorPayment"] });
        },
    });
};



export const useUpdatevendorpayments = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ vendorpaymentsData, id }: { vendorpaymentsData: any, id:string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await updateVendorPayment({ vendorpaymentsData, id ,api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["VendorPayment"] });
        },
    });
};



export const useDeletevendorpayments = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ vendorpaymentsId }: { vendorpaymentsId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteVendorPayment({ vendorpaymentsId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["VendorPayment"] });
        },
    });
};

export const useGetSinglevendorpayments = (vendorpaymentsId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["vendorpayments", vendorpaymentsId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getSingleVendorPayment({ vendorpaymentsId, api });
        },
        enabled: !!vendorpaymentsId && !!role && allowedRoles.includes(role),
    });
};




export const useSyncVendorPaymentToPaymentsSection = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await syncVendorPaymentToPayment({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["VendorPayment"] });
        },
    });
};
