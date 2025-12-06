// src/customerAccounts.api.ts

import { type AxiosInstance } from 'axios';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
} from '@tanstack/react-query';
import useGetRole from '../../../Hooks/useGetRole';
import { getApiForRole } from '../../../utils/roleCheck';
import { queryClient } from '../../../QueryClient/queryClient';

// Types
export interface CreateCustomerPayload {
    // customerType: "business" | "individual";
    organizationId: string;
    // projectId: string;
    clientId: string;
  // Basic
    firstName: string | null;
    companyName: string | null;
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };

    // Statutory
    language: string | null;
    pan?: string | null;
    tan?: string | null;
    gstin?: string | null;
    currency?: string;

    // Banking
    bankAccNo?: string | null;
    accHolderName?: string | null;
    bankName?: string | null;
    bankBranch?: string | null;
    ifscCode?: string | null;

    // Files (Raw Files for Upload)
    mainImage?: File; 
    files?: File[]; 
}

export interface UpdateCustomerPayload {
    firstName?: string | null;
    companyName?: string | null;
    email?: string | null;
    phone?: {
        work?: string | null;
        mobile?: string | null;
    };

    // Statutory
    language?: string | null;
    pan?: string | null;
    tan?: string | null;
    gstin?: string | null;
    currency?: string;

    // Banking
    bankAccNo?: string | null;
    accHolderName?: string | null;
    bankName?: string | null;
    bankBranch?: string | null;
    ifscCode?: string | null;
    documents?: Array<{
        type: "image" | "pdf";
        url: string;
        originalName?: string;
    }>;

}

export interface GetCustomersParams {
    page?: number;
    limit?: number;
    organizationId?: string;
    projectId?: string;
    firstName?: string;
    lastName?: string;
    search?: string;
    createdFromDate?: string
    createdToDate?: string,
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ICustomerFile {
    _id?: string;
    type: "image" | "pdf";
    url: string;
    originalName?: string;
    uploadedAt?: string;
}

export interface Customer {
    _id: string;
    customerType: "business" | "individual";
    organizationId: string;
    projectId: string;
    clientId: string;
     firstName: string | null;
    companyName: string | null;
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };

    // Statutory Details
    language?: string | null; // Renamed from customerLanguage to match Schema
    pan?: string | null;
    tan?: string | null;
    gstin?: string | null;
    currency?: string;

    // Banking Details
    bankAccNo?: string | null;
    accHolderName?: string | null;
    bankName?: string | null;
    bankBranch?: string | null;
    ifscCode?: string | null;

    // Media
    mainImage?: ICustomerFile | null;
    documents?: ICustomerFile[];

    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface GetCustomersResponse {
    ok: boolean;
    message: string;
    data: Customer[];
    pagination: PaginationMeta;
    filters: {
        organizationId: string | null;
        customerType: string | null;
        firstName: string | null;
        lastName: string | null;
        search: string | null;
    };
}

export interface SingleCustomerResponse {
    ok: boolean;
    message: string;
    data: Customer;
}

// API Functions

/**
 * Create a new customer
 */
export const createCustomer = async ({
    payload,
    api
}: {
    payload: CreateCustomerPayload;
    api: AxiosInstance;
}) => {
    // Always send as FormData
    const formData = new FormData();

    // Extract files from payload
    const { files, phone, ...restPayload } = payload;

    // Append all string/number fields
    Object.entries(restPayload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    // Append phone object as JSON string
    if (phone) {
        formData.append('phone', JSON.stringify(phone));
    }

    //  if (mainImage) {
    //     formData.append('mainImage', mainImage);
    // }

    // Append files if present
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append('files', file);
        });
    }

    const { data } = await api.post('/department/accounting/customer/createcustomer', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

/**
 * Get all customers with pagination and filters
 */
export const getAllCustomers = async ({
    params,
    api
}: {
    params: GetCustomersParams;
    api: AxiosInstance;
}) => {
    const { data } = await api.get('/department/accounting/customer/getallcustomer', { params });
    if (!data.ok) throw new Error(data.message);
    return data;
};

/**
 * Get single customer by ID
 */
export const getCustomerById = async ({
    customerId,
    api
}: {
    customerId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/department/accounting/customer/singlecustomer/${customerId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const getAllCustomeforDD = async ({
    organizationId,
    api
}: {
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/department/accounting/customer/getallcustomername/${organizationId}`);
    if (!data.ok) throw new Error(data.message);

    return data.data;
};

/**
 * Update customer
 */
export const updateCustomer = async ({
    customerId,
    payload,
    api
}: {
    customerId: string;
    payload: UpdateCustomerPayload;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/department/accounting/customer/updatecustomer/${customerId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};




export const updateCustomerMainImage = async ({
    customerId,
    file,
    api
}: {
    customerId: string;
    file: File;
    api: AxiosInstance;
}) => {
    const formData = new FormData();
    formData.append('mainImage', file);

    const { data } = await api.put(
        `/department/accounting/customer/update-main-image/${customerId}`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );

    if (!data.ok) throw new Error(data.message);
    return data.data; // Should return { mainImage: "url..." }
};




export const updateCustomerDocument = async ({ api, formData, id }: { api: AxiosInstance, id: string, formData: FormData }) => {
    const response = await api.put(`/department/accounting/customer/updatecustomer/${id}/document`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

/**
 * Delete customer
 */
export const deleteCustomer = async ({
    customerId,
    api
}: {
    customerId: string;
    api: AxiosInstance;
}): Promise<void> => {
    const { data } = await api.delete(`/department/accounting/customer/deletecustomer/${customerId}`);
    if (!data.ok) throw new Error(data.message);
};




// src/hooks/useCustomerAccounts.ts


// Allowed roles for customer operations
const ALLOWED_ROLES = ["owner", "staff", "CTO"];

/**
 * Hook to create a new customer
 */
export const useCreateCustomer = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (payload: CreateCustomerPayload) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await createCustomer({ payload, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate all customer queries for this organization
            queryClient.invalidateQueries({
                queryKey: ["customers", "list", variables.organizationId]
            });
          
        }
    });
};

/**
 * Hook to get all customers with infinite scrolling
 */
export const useGetAllCustomers = (params: Omit<GetCustomersParams, 'page'>) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["customers", "list", params.organizationId, params.projectId, params.search, params.sortBy, params.sortOrder, params.createdFromDate, params.createdToDate],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllCustomers({
                params: { ...params, page: pageParam },
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.hasNextPage) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.pagination.hasPrevPage) {
                return firstPage.pagination.currentPage - 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && ALLOWED_ROLES.includes(role) && !!params.organizationId
    });
};

/**
 * Hook to get single customer by ID
 */
export const useGetCustomer = (customerId: string, enabled: boolean = true) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["customers", "single", customerId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getCustomerById({ customerId, api });
        },
        enabled: enabled && !!role && ALLOWED_ROLES.includes(role) && !!customerId
    });
};



export const useGetCustomerForDropDown = (organizationId: string, enabled: boolean = true) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["allcustomersname", organizationId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllCustomeforDD({ organizationId, api });
        },
        enabled: enabled && !!role && ALLOWED_ROLES.includes(role) && !!organizationId
    });
};



/**
 * Hook to update customer
 */
export const useUpdateCustomer = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            customerId,
            payload
        }: {
            customerId: string;
            payload: UpdateCustomerPayload;
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateCustomer({ customerId, payload, api });
        },
        onSuccess: (variables) => {
            // Invalidate single customer query
            queryClient.invalidateQueries({
                queryKey: ["customers", "single", variables.customerId]
            });
            // Invalidate all customer list queries
            queryClient.invalidateQueries({
                queryKey: ["customers", "list"]
            });
        }
    });
};


// hook to update the cusotmer docuemetn


export const useUpdateCustomerDocument = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateCustomerDocument({ id, formData, api });
        },
    });
};


export const useUpdateCustomerMainImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ customerId, file }: { customerId: string; file: File }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateCustomerMainImage({ customerId, file, api });
        },
        onSuccess: (_, variables) => {
           queryClient.invalidateQueries({
                queryKey: ["customers", "single", variables.customerId]
            });
            // Invalidate all customer list queries
            queryClient.invalidateQueries({
                queryKey: ["customers", "list"]
            });
        }
    });
};


/**
 * Hook to delete customer
 */
export const useDeleteCustomer = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (customerId: string) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await deleteCustomer({ customerId, api });
        },
        onSuccess: () => {
            // Invalidate all customer list queries
            queryClient.invalidateQueries({
                queryKey: ["customers", "list"]
            });
        }
    });
};
