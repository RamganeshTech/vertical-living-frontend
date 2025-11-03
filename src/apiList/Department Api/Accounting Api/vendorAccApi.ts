// src/VendorAccounts.api.ts

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
export interface CreateVendorPayload {
    // VendorType: "business" | "individual";
    organizationId: string;
    projectId: string;
    clientId: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };
    vendorLanguage: string | null;
    pan?: string | null;
    currency?: string;
    accountsPayable?: string | null;
    openingBalance?: number;
    paymentTerms?: string;
    // enablePortal?: boolean;
    files?: File[]; // Add files to payload
}

export interface UpdateVendorPayload {
    // VendorType?: "business" | "individual";
    firstName?: string | null;
    lastName?: string | null;
    companyName?: string | null;
    email?: string | null;
    phone?: {
        work?: string | null;
        mobile?: string | null;
    };
    VendorLanguage?: string | null;
    pan?: string | null;
    currency?: string;
    accountsPayable?: string | null;
    openingBalance?: number;
    paymentTerms?: string;
    // enablePortal?: boolean;
    documents?: Array<{
        type: "image" | "pdf";
        url: string;
        originalName?: string;
    }>;
}

export interface GetVendorsParams {
    page?: number;
    limit?: number;
    organizationId?: string;
    projectId?: string;
    firstName?: string;
    lastName?: string;
    // VendorType?: "business" | "individual";
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Vendor {
    _id: string;
    // VendorType: "business" | "individual";
    organizationId: string;
    projectId: string;
    clientId: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };
    vendorLanguage?: string | null;
    pan?: string | null;
    currency?: string;
    accountsPayable?: string | null;
    openingBalance?: number;
    paymentTerms?: string;
    // enablePortal?: boolean;
    documents?: Array<{
        type: "image" | "pdf";
        url: string;
        originalName?: string;
        uploadedAt?: Date;
    }>;
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

export interface GetVendorsResponse {
    ok: boolean;
    message: string;
    data: Vendor[];
    pagination: PaginationMeta;
    filters: {
        organizationId: string | null;
        // VendorType: string | null;
        firstName: string | null;
        lastName: string | null;
        search: string | null;
    };
}

export interface SingleVendorResponse {
    ok: boolean;
    message: string;
    data: Vendor;
}

// API Functions

/**
 * Create a new Vendor
 */
export const createVendor = async ({
    payload,
    api
}: {
    payload: CreateVendorPayload;
    api: AxiosInstance;
})=> {
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

    // Append files if present
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append('files', file);
        });
    }

    const { data } = await api.post('/department/accounting/vendor/createvendor', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

/**
 * Get all Vendors with pagination and filters
 */
export const getAllVendors = async ({
    params,
    api
}: {
    params: GetVendorsParams;
    api: AxiosInstance;
}) => {
    const { data } = await api.get('/department/accounting/vendor/getallvendor', { params });
    if (!data.ok) throw new Error(data.message);
    return data;
};

/**
 * Get single Vendor by ID
 */
export const getVendorById = async ({
    VendorId,
    api
}: {
    VendorId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/department/accounting/vendor/singlevendor/${VendorId}`);
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
    const { data } = await api.get(`/department/accounting/vendor/getallvendorname/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    
    return data.data;
};

/**
 * Update Vendor
 */
export const updateVendor = async ({
    vendorId,
    payload,
    api
}: {
    vendorId: string;
    payload: UpdateVendorPayload;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/department/accounting/vendor/updatevendor/${vendorId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const updateVendorDocument = async ({api,formData, id}:{api:AxiosInstance, id: string, formData: FormData}) => {
  const response = await api.put(`/department/accounting/vendor/updatevendor/${id}/document`,
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
 * Delete Vendor
 */
export const deleteVendor = async ({
    VendorId,
    api
}: {
    VendorId: string;
    api: AxiosInstance;
}): Promise<void> => {
    const { data } = await api.delete(`/department/accounting/vendor/deletevendor/${VendorId}`);
    if (!data.ok) throw new Error(data.message);
};




// src/hooks/useVendorAccounts.ts


// Allowed roles for Vendor operations
const ALLOWED_ROLES = ["owner", "staff", "CTO"];

/**
 * Hook to create a new Vendor
 */
export const useCreateVendor = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (payload: CreateVendorPayload) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await createVendor({ payload, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate all Vendor queries for this organization
            queryClient.invalidateQueries({ 
                queryKey: ["vendors", "list", variables.organizationId] 
            });
            queryClient.invalidateQueries({ 
                queryKey: ["vendors", "list", variables.organizationId, variables.projectId] 
            });
        }
    });
};

/**
 * Hook to get all Vendors with infinite scrolling
 */
export const useGetAllVendors = (params: Omit<GetVendorsParams, 'page'>) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["vendors", "list", params.organizationId,   params.search, params.sortBy, params.sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllVendors({ 
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
 * Hook to get single Vendor by ID
 */
export const useGetVendor = (VendorId: string, enabled: boolean = true) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["vendors", "single", VendorId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getVendorById({ VendorId, api });
        },
        enabled: enabled && !!role && ALLOWED_ROLES.includes(role) && !!VendorId
    });
};



export const useGetVendorForDropDown = (organizationId: string, enabled: boolean = true) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["allvendorsname", organizationId],
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
 * Hook to update Vendor
 */
export const useUpdateVendor = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ 
            vendorId, 
            payload 
        }: { 
            vendorId: string; 
            payload: UpdateVendorPayload;
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateVendor({ vendorId, payload, api });
        },
        onSuccess: (variables) => {
            // Invalidate single Vendor query
            queryClient.invalidateQueries({ 
                queryKey: ["vendors", "single", variables.vendorId] 
            });
            // Invalidate all Vendor list queries
            queryClient.invalidateQueries({ 
                queryKey: ["vendors", "list"] 
            });
        }
    });
};


// hook to update the cusotmer docuemetn


export const useUpdateVendorDocument = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

   return useMutation({
        mutationFn: async ({ id, formData }: {id:string, formData:FormData}) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateVendorDocument({ id, formData, api });
        },
    });
};

/**
 * Hook to delete Vendor
 */
export const useDeleteVendor = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (VendorId: string) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await deleteVendor({ VendorId, api });
        },
        onSuccess: () => {
            // Invalidate all Vendor list queries
            queryClient.invalidateQueries({ 
                queryKey: ["vendors", "list"] 
            });
        }
    });
};
