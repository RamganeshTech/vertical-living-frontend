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
        organizationId: string;
    clientId: string | null;

    // Basic
    firstName: string | null;
    companyName: string | null;
    shopDisplayName: string | null;
    vendorCategory: string | null;
    language: string | null;

    // Contact
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };
    shopFullAddress?: string | null;

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

export interface UpdateVendorPayload {
   firstName?: string | null;
    companyName?: string | null;
    shopDisplayName?: string | null;
    vendorCategory?: string | null;
    language?: string | null;

    email?: string | null;
    phone?: {
        work?: string | null;
        mobile?: string | null;
    };

    shopFullAddress?: string | null;
    
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

export interface GetVendorsParams {
    page?: number;
    limit?: number;
    organizationId?: string;
    projectId?: string;
    firstName?: string;
    lastName?: string;
    createdFromDate?: string
    createdToDate?: string,
    // VendorType?: "business" | "individual";
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface Vendor {
    _id: string;
    organizationId: string;
    clientId: string | null;

    // Basic Details
    firstName: string | null;
    companyName: string | null;
    shopDisplayName: string | null;
    vendorCategory: string | null;
    language: string | null; // Renamed from language to match backend

    // Contact
    email: string | null;
    phone: {
        work: string | null;
        mobile: string | null;
    };
    shopFullAddress?: string | null;

    // Location (mapUrl is at root now)
    mapUrl?: string | null; 
    location?: {
        latitude: number | null;
        longitude: number | null;
    };

    // Media (using IVendorFile helper)
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

    const { data } = await api.post('/department/accounting/vendor/createvendor', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const updateVendorMainImage = async ({
    vendorId,
    file,
    api
}: {
    vendorId: string;
    file: File;
    api: AxiosInstance;
}) => {
    const formData = new FormData();
    formData.append('mainImage', file);

    const { data } = await api.put(
        `/department/accounting/vendor/update-main-image/${vendorId}`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );

    if (!data.ok) throw new Error(data.message);
    return data.data; // Should return { mainImage: "url..." }
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



export const updateVendorDocument = async ({ api, formData, id }: { api: AxiosInstance, id: string, formData: FormData }) => {
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




export const updateVendorShopImages = async ({ api, formData, id }: { api: AxiosInstance, id: string, formData: FormData }) => {
    const response = await api.put(`/department/accounting/vendor/updatevendor/${id}/shopimages`,
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
        }
    });
};


//  update the main image alone


export const useUpdateVendorMainImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ vendorId, file }: { vendorId: string; file: File }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) {
                throw new Error("API instance not found for role");
            }
            return await updateVendorMainImage({ vendorId, file, api });
        },
        onSuccess: (_, variables) => {
            // Invalidate specific vendor query so the UI updates instantly
            queryClient.invalidateQueries({
                queryKey: ["vendors", "list"] // Adjust based on your query keys
            });
            // If you have a single vendor query key:
            queryClient.invalidateQueries({
                queryKey: ["vendors", variables.vendorId]
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
        queryKey: ["vendors", "list", params.organizationId, params.search, params.sortBy, params.sortOrder, params.createdFromDate, params.createdToDate],
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
        mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
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



export const useUpdateVendorShopImages = () => {
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
            return await updateVendorShopImages({ id, formData, api });
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
