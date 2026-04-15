// src/ExecutionPartnerAccounts.api.ts

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
export interface CreateExecutionPartnerPayload {
    organizationId: string;

    // Basic
    firstName: string | null;
    companyName: string | null;
    category: string | null;
    language: string | null;

    // Contact
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };
    address?: string | null;

    // Location
    mapUrl?: string | null;
    location?: {
        latitude?: number | null; // Optional, backend calculates from mapUrl
        longitude?: number | null;
    };

    // Statutory
    pan?: string | null;
    tan?: string | null;
    gstin?: string | null;
    msmeNo?: string | null;
    cin?: string | null;
    businessStructure?: string | null;

    // Banking
    bankAccNo?: string | null;
    accHolderName?: string | null;
    bankName?: string | null;
    upiId?: string | null;
    bankBranch?: string | null;
    ifscCode?: string | null;

    // Financials
    // currency?: string;
    openingBalance?: number;
    paymentTerms?: string;

    // File Uploads (Raw Files)
    mainImage?: File;       // Single file
    shopImages?: File[];    // Array of files
    files?: File[];
}

export interface UpdateExecutionPartnerPayload {
    firstName?: string | null;
    companyName?: string | null;
    category?: string | null;
    language?: string | null;

    email?: string | null;
    phone?: {
        work?: string | null;
        mobile?: string | null;
    };

    address?: string | null;

    // Updating mapUrl triggers lat/lng update on backend
    mapUrl?: string | null;
    location?: {
        latitude?: number | null;
        longitude?: number | null;
    };

    // Statutory
    pan?: string | null;
    tan?: string | null;
    gstin?: string | null;
    msmeNo?: string | null;
    cin?: string | null;
    businessStructure?: string | null;

    // Banking
    bankAccNo?: string | null;
    accHolderName?: string | null;
    bankName?: string | null;
    upiId?: string | null;
    bankBranch?: string | null;
    ifscCode?: string | null;

    // Financials
    // currency?: string;
    openingBalance?: number;
    paymentTerms?: string;
}

export interface GetExecutionPartnersParams {
    page?: number;
    limit?: number;
    organizationId?: string;
    projectId?: string;
    firstName?: string;
    lastName?: string;
    createdFromDate?: string
    createdToDate?: string,
    // ExecutionPartnerType?: "business" | "individual";
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ExecutionPartner {
    _id: string;
    organizationId: string;
    clientId: string | null;

    // Basic Details
    firstName: string | null;
    companyName: string | null;
    category: string | null;
    language: string | null; // Renamed from language to match backend

    // Contact
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };
    address?: string | null;

    // Location (mapUrl is at root now)
    mapUrl?: string | null;
    location?: {
        latitude: number | null;
        longitude: number | null;
    };

    // Media (using IExecutionPartnerFile helper)
    mainImage?: {
        type: "image" | "pdf";
        url: string;
        originalName?: string;
        uploadedAt?: string,
    } | null;
    shopImages?: {
        type: "image";
        url: string;
        originalName?: string;
        uploadedAt?: string,
    }[];
    documents?: {
        type: "image" | "pdf";
        url: string;
        originalName?: string;
        uploadedAt?: string,
    }[];

    // Statutory Details
    pan?: string | null;
    tan?: string | null;
    gstin?: string | null;
    msmeNo?: string | null;
    cin?: string | null;
    businessStructure?: string | null;

     nextAvailableDate: Date
    maxSimultaneousSites: number
    averageDelayDays: number
    crewSize: number
    escalationLoad: number
    repeatDefectRate: number

    // Banking Details
    bankAccNo?: string | null;
    accHolderName?: string | null;
    bankName?: string | null;
    upiId?: string | null;
    bankBranch?: string | null;
    ifscCode?: string | null;

    // Financials
    // currency?: string;
    openingBalance?: number;
    paymentTerms?: string;
    works?: string[]

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

export interface GetExecutionPartnersResponse {
    ok: boolean;
    message: string;
    data: ExecutionPartner[];
    pagination: PaginationMeta;
    filters: {
        organizationId: string | null;
        // ExecutionPartnerType: string | null;
        firstName: string | null;
        lastName: string | null;
        search: string | null;
    };
}

export interface SingleExecutionPartnerResponse {
    ok: boolean;
    message: string;
    data: ExecutionPartner;
}

// API Functions

/**
 * Create a new ExecutionPartner
 */
export const createExecutionPartner = async ({
    payload,
    api
}: {
    payload: CreateExecutionPartnerPayload;
    api: AxiosInstance;
}) => {
    // Always send as FormData
    const formData = new FormData();

    // Extract files from payload
    const { files, phone, shopImages, location, ...restPayload } = payload;

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

    // 4. Append location (Stringified) <--- ADD THIS
    if (location) {
        formData.append('location', JSON.stringify(location));
    }


    // if (mainImage) {
    //     formData.append('mainImage', mainImage);
    // }


    // Append files if present
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append('files', file);
        });
    }

    if (shopImages && shopImages.length > 0) {
        shopImages.forEach((file) => {
            formData.append('shopImages', file);
        });
    }

    const { data } = await api.post('/department/accounting/execution-partner/createexecutionpartner', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const quickCreateExecutionPartner = async ({
    organizationId, firstName,
    companyName,
    shopDisplayName,
    executionpartnerCategory, email, phone, shopFullAddress,
    api
}: {
    organizationId: string; firstName?: string | null;
    companyName?: string | null;
    shopDisplayName?: string | null;
    executionpartnerCategory?: string | null; email: string,
    phone?: {
        work?: string | null;
        mobile?: string | null;
    };
    shopFullAddress: string
    api: AxiosInstance;
}) => {
    // Always send as FormData


    const { data } = await api.post('/department/accounting/execution-partner/quick/createexecutionpartner', {
        organizationId, firstName,
        companyName,
        shopDisplayName,
        executionpartnerCategory, email, phone, shopFullAddress,
    });

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const updateExecutionPartnerMainImage = async ({
    executionpartnerId,
    file,
    api
}: {
    executionpartnerId: string;
    file: File;
    api: AxiosInstance;
}) => {
    const formData = new FormData();
    formData.append('mainImage', file);

    const { data } = await api.put(
        `/department/accounting/execution-partner/update-main-image/${executionpartnerId}`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );

    if (!data.ok) throw new Error(data.message);
    return data.data; // Should return { mainImage: "url..." }
};




/**
 * Get all ExecutionPartners with pagination and filters
 */
export const getAllExecutionPartners = async ({
    params,
    api
}: {
    params: GetExecutionPartnersParams;
    api: AxiosInstance;
}) => {
    const { data } = await api.get('/department/accounting/execution-partner/getallexecutionpartner', { params });
    if (!data.ok) throw new Error(data.message);
    return data;
};

/**
 * Get single ExecutionPartner by ID
 */
export const getExecutionPartnerById = async ({
    ExecutionPartnerId,
    api
}: {
    ExecutionPartnerId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/department/accounting/execution-partner/singleexecutionpartner/${ExecutionPartnerId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const getAllCustomeforDD = async ({
    organizationId,
    priority,
    api
}: {
    organizationId: string;
    priority?: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/department/accounting/execution-partner/getallexecutionpartner-drop-down/${organizationId}`, {
        params: { priority }
    });
    if (!data.ok) throw new Error(data.message);

    return data.data;
};

/**
 * Update ExecutionPartner
 */
export const updateExecutionPartner = async ({
    executionpartnerId,
    payload,
    api
}: {
    executionpartnerId: string;
    payload: UpdateExecutionPartnerPayload;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/department/accounting/execution-partner/updateexecutionpartner/${executionpartnerId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const updateExecutionPartnerDocument = async ({ api, formData, id }: { api: AxiosInstance, id: string, formData: FormData }) => {
    const response = await api.put(`/department/accounting/execution-partner/updateexecutionpartner/${id}/document`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};




export const updateExecutionPartnerShopImages = async ({ api, formData, id }: { api: AxiosInstance, id: string, formData: FormData }) => {
    const response = await api.put(`/department/accounting/execution-partner/updateexecutionpartner/${id}/shopimages`,
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
 * Delete ExecutionPartner
 */
export const deleteExecutionPartner = async ({
    ExecutionPartnerId,
    api
}: {
    ExecutionPartnerId: string;
    api: AxiosInstance;
}): Promise<void> => {
    const { data } = await api.delete(`/department/accounting/execution-partner/deleteexecutionpartner/${ExecutionPartnerId}`);
    if (!data.ok) throw new Error(data.message);
};




// src/hooks/useExecutionPartnerAccounts.ts


// Allowed roles for ExecutionPartner operations
const ALLOWED_ROLES = ["owner", "staff", "CTO"];

/**
 * Hook to create a new ExecutionPartner
 */
export const useCreateExecutionPartner = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (payload: CreateExecutionPartnerPayload) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await createExecutionPartner({ payload, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate all ExecutionPartner queries for this organization
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", "list", variables.organizationId]
            });
        }
    });
};




export const useQuickCreateExecutionPartner = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({organizationId, email, firstName, companyName, shopFullAddress, shopDisplayName, executionpartnerCategory, phone,}:{organizationId: string; firstName?: string | null;
    companyName?: string | null;
    shopDisplayName?: string | null;
    executionpartnerCategory?: string | null; 
    email: string;
    phone?: {
        work?: string | null;
        mobile?: string | null;
    };
    shopFullAddress: string
    api: AxiosInstance;}) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await quickCreateExecutionPartner({ organizationId, email, firstName, companyName, shopFullAddress, shopDisplayName, executionpartnerCategory, phone, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate all ExecutionPartner queries for this organization
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", "list", variables.organizationId],
            });

            queryClient.invalidateQueries({
                queryKey: ["allexecutionpartnersname", variables.organizationId],
            });
        }
    });
};



//  update the main image alone


export const useUpdateExecutionPartnerMainImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ executionpartnerId, file }: { executionpartnerId: string; file: File }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateExecutionPartnerMainImage({ executionpartnerId, file, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate specific executionpartner query so the UI updates instantly
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", "list"] // Adjust based on your query keys
            });
            // If you have a single executionpartner query key:
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", variables.executionpartnerId]
            });
        }
    });
};


/**
 * Hook to get all ExecutionPartners with infinite scrolling
 */
export const useGetAllExecutionPartners = (params: Omit<GetExecutionPartnersParams, 'page'>) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["executionpartners", "list", params.organizationId, params.search, params.sortBy, params.sortOrder, params.createdFromDate, params.createdToDate],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllExecutionPartners({
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
 * Hook to get single ExecutionPartner by ID
 */
export const useGetExecutionPartner = (ExecutionPartnerId: string, enabled: boolean = true) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["executionpartners", "single", ExecutionPartnerId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getExecutionPartnerById({ ExecutionPartnerId, api });
        },
        enabled: enabled && !!role && ALLOWED_ROLES.includes(role) && !!ExecutionPartnerId
    });
};



export const useGetExecutionPartnerForDropDown = (organizationId: string, enabled: boolean = true, priority?: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["allexecutionpartnersname", organizationId, priority],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await getAllCustomeforDD({ organizationId, priority, api });
        },
        enabled: enabled && !!role && ALLOWED_ROLES.includes(role) && !!organizationId
    });
};



/**
 * Hook to update ExecutionPartner
 */
export const useUpdateExecutionPartner = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            executionpartnerId,
            payload
        }: {
            executionpartnerId: string;
            payload: UpdateExecutionPartnerPayload;
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateExecutionPartner({ executionpartnerId, payload, api });
        },
        onSuccess: (variables) => {
            // Invalidate single ExecutionPartner query
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", "single", variables.executionpartnerId]
            });
            // Invalidate all ExecutionPartner list queries
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", "list"]
            });
        }
    });
};


// hook to update the cusotmer docuemetn


export const useUpdateExecutionPartnerDocument = () => {
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
            return await updateExecutionPartnerDocument({ id, formData, api });
        },
    });
};



export const useUpdateExecutionPartnerShopImages = () => {
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
            return await updateExecutionPartnerShopImages({ id, formData, api });
        },
    });
};

/**
 * Hook to delete ExecutionPartner
 */
export const useDeleteExecutionPartner = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (ExecutionPartnerId: string) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await deleteExecutionPartner({ ExecutionPartnerId, api });
        },
        onSuccess: () => {
            // Invalidate all ExecutionPartner list queries
            queryClient.invalidateQueries({
                queryKey: ["executionpartners", "list"]
            });
        }
    });
};
