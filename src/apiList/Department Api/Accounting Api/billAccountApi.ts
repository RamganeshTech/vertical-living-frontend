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
    minAmount,
    maxAmount,
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
    minAmount?: number;
    maxAmount?: number;
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
    if (minAmount) params.append('minAmount', minAmount.toString());
    if (maxAmount) params.append('maxAmount', maxAmount.toString());
    if (billFromDate) params.append('billFromDate', billFromDate);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);

    const { data } = await api.get(`/department/accounting/bill/getallbill?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};


// 1. CREATE (Multipart)
const createBillApi = async ({ billData, files, api }: { billData: any; files: File[]; api: AxiosInstance }) => {
    const formData = new FormData();
    const { images, items, ...rest } = billData;

    // Append standard fields
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, String(value));
    });
    // Append Items as JSON
    if (items) formData.append('items', JSON.stringify(items));
    // Append Files
    if (files && files.length > 0) {
        files.forEach((file) => formData.append('files', file));
    }

    const { data } = await api.post(`/department/accounting/bill/createbill`, formData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};
// 2. UPDATE (JSON Only - Updates text & preserves/removes existing images)
const updateBillApi = async ({ billData, billId, api }: { billData: any; billId: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/bill/updatebill/${billId}`, billData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const syncAcctoBill = async ({ billId, api }: { billId: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/bill/synctoaccounts/${billId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const syncPaymentSectiontoBill = async ({ billId, api }: { billId: string; api: AxiosInstance }) => {
    // We send billData as JSON. 
    // Ensure 'billData.images' contains the array of *existing* image objects you want to keep.
    const { data } = await api.post(`/department/accounting/bill/synctopayments/${billId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// 3. UPLOAD FILES ONLY (Multipart)
const uploadImagesOnlyApi = async ({ billId, files, api }: { billId: string; files: File[]; api: AxiosInstance }) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const { data } = await api.post(`/department/accounting/bill/upload-images/${billId}`, formData);
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


const deleteBillImage = async ({
    billId,
    imageId,
    api
}: {
    billId: string;
    imageId: string;
    api: AxiosInstance
}) => {
    const { data } = await api.delete(`/department/accounting/bill/deleteimage/${billId}/${imageId}`);
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
    minAmount,
    maxAmount,
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
    minAmount?: number;
    maxAmount?: number;
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
        queryKey: ["bills", organizationId, vendorId, limit, date, search, sortBy, sortOrder, billToDate, billFromDate, createdFromDate, createdToDate, minAmount,
            maxAmount],
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
                minAmount,
                maxAmount,
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
        mutationFn: async ({ billData, files }: { billData: any, files: File[] }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await createBillApi({ billData, files, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};


export const useUpdateBill = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billData, billId }: { billData: any, billId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await updateBillApi({ billData, billId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};



export const useSyncBillToAccounts = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billId }: { billId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await syncAcctoBill({ billId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};



export const useSyncBillToPaymentsSection = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billId }: { billId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await syncPaymentSectiontoBill({ billId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
};



export const useUploadBillImages = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billId, files }: { billId: string, files: File[] }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await uploadImagesOnlyApi({ billId, files, api });
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



export const useDeleteBillImage = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ billId, imageId }: { billId: string, imageId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteBillImage({ billId, api, imageId });
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