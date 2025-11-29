import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AxiosInstance } from 'axios';
import { getApiForRole } from '../../../../utils/roleCheck';
import useGetRole from '../../../../Hooks/useGetRole';

const BASE_URL = '/department/accounting/billpdf';

// ==========================================
// TEMPLATE APIS
// ==========================================

// 1. Seed Default Template
export const seedDefaultTemplateApi = async ({
    organizationId,
    api
}: {
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`${BASE_URL}/template/seed-default/${organizationId}`);
    return data;
};

// 2. Get all Template
const getAllTemplatesApi = async ({
    organizationId,
    page,
    limit,
    search,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder,
    api
}: {
    organizationId: string;
    page?: number;
    limit?: number;
    search?: string;
    createdFromDate?: string;
    createdToDate?: string;
    sortBy?: string;
    sortOrder?: string;
    api: AxiosInstance;
}) => {
    const params = new URLSearchParams();
    params.append('organizationId', organizationId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const { data } = await api.get(`${BASE_URL}/template/all?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

// 3. Get Specific Template
export const getTemplateByIdApi = async ({
    id,
    organizationId,
    api
}: {
    id: string;
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`${BASE_URL}/template/${id}/${organizationId}`);
    return data.data; 
};

// 4. Create Custom Template
export const createNewTemplateApi = async ({
    organizationId,
    templateName,
    layout,
    api
}: any) => {
    const formData = new FormData();
    formData.append('organizationId', organizationId);
    formData.append('templateName', templateName);

    const filesToUpload: File[] = [];

    // FIX: Map over the ORIGINAL layout, do NOT use JSON.parse(JSON.stringify()) here.
    const layoutToSend = layout.map((section: any) => ({
        ...section, // Copy section properties
        components: section.components.map((comp: any) => {
            // Create a shallow copy of component to avoid mutating UI state
            const newComp = { ...comp };

            // Check if the first value is a File object
            if (newComp.type === 'image' && 
                newComp.value && 
                newComp.value[0] instanceof File) {
                
                // 1. Add File to array
                filesToUpload.push(newComp.value[0]);
                
                // 2. Replace value with Placeholder
                newComp.value = [`__FILE_${filesToUpload.length - 1}__`];
            }
            
            return newComp;
        })
    }));

    // Now we can stringify the result which contains placeholders
    formData.append('layout', JSON.stringify(layoutToSend));

    // Append the actual files
    filesToUpload.forEach((file) => {
        formData.append('files', file);
    });

    const { data } = await api.post(`${BASE_URL}/template`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

// 5. Update Template Layout
export const updateTemplateLayoutApi = async ({
    id,
    organizationId,
    layout,
    templateName,
    api
}: any) => {
    const formData = new FormData();
    formData.append('organizationId', organizationId);
    if (templateName) formData.append('templateName', templateName);

    const filesToUpload: File[] = [];

    // FIX: Same fix here. Iterate original layout.
    const layoutToSend = layout.map((section: any) => ({
        ...section,
        components: section.components.map((comp: any) => {
            const newComp = { ...comp };

            // Check if it is a NEW File (instanceof File). 
            // Existing S3 URLs (strings) will be skipped here and preserved.
            if (newComp.type === 'image' && 
                newComp.value && 
                newComp.value[0] instanceof File) {
                
                filesToUpload.push(newComp.value[0]);
                newComp.value = [`__FILE_${filesToUpload.length - 1}__`];
            }
            
            return newComp;
        })
    }));

    formData.append('layout', JSON.stringify(layoutToSend));
    filesToUpload.forEach((file) => {
        formData.append('files', file);
    });

    const { data } = await api.put(`${BASE_URL}/template/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};


// ==========================================
// BILL (INVOICE) APIS
// ==========================================

// // 6. Create Bill
// export const createBillNewApi = async ({
//     organizationId,
//     projectId,
//     customerName,
//     templateId,
//     initialValues, // Optional: For pre-filling data
//     layout, // Optional: If modifying immediately
//     api
// }: {
//     organizationId: string;
//     projectId?: string | null;
//     customerName?: string;
//     templateId?: string | null;
//     initialValues?: Record<string, any>;
//     layout?: any[];
//     api: AxiosInstance;
// }) => {
//     const { data } = await api.post(`${BASE_URL}/bill`, {
//         organizationId,
//         projectId,
//         customerName,
//         templateId,
//         initialValues,
//         layout
//     });
//     return data;
// };

// // 7. Update Bill
// export const updateBillNewApi = async ({
//     id,
//     organizationId,
//     layout,
//     customerName,
//     projectId,
//     billNumber,
//     api
// }: {
//     id: string;
//     organizationId: string;
//     layout: any[];
//     customerName?: string;
//     projectId?: string | null;
//     billNumber?: string;
//     api: AxiosInstance;
// }) => {
//     const { data } = await api.put(`${BASE_URL}/bill/${id}`, {
//         organizationId,
//         layout,
//         customerName,
//         projectId,
//         billNumber
//     });
//     return data;
// };

// CREATE
export const createBillNewApi = async ({
    organizationId,
    projectId,
    customerName,
    templateId,
    layout, 
    api
}: any) => {
    const formData = new FormData();
    formData.append('organizationId', organizationId);
    if(projectId) formData.append('projectId', projectId);
    if(customerName) formData.append('customerName', customerName);
    if(templateId) formData.append('templateId', templateId);

    // --- HANDLE FILES IN LAYOUT ---
    const filesToUpload: File[] = [];
    
    // Deep copy layout to modify it without affecting UI state
    const layoutToSend = JSON.parse(JSON.stringify(layout)).map((section: any) => {
        section.components = section.components.map((comp: any) => {
            if (comp.type === 'image' && comp.value[0] instanceof File) {
                // 1. Push file to array
                filesToUpload.push(comp.value[0]);
                // 2. Replace with placeholder tag
                comp.value = [`__FILE_${filesToUpload.length - 1}__`]; 
            }
            return comp;
        });
        return section;
    });

    // Append JSON
    formData.append('layout', JSON.stringify(layoutToSend));

    // Append Files
    filesToUpload.forEach((file) => {
        formData.append('files', file);
    });

    const { data } = await api.post(`${BASE_URL}/bill`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

// UPDATE (Similar logic)
export const updateBillNewApi = async ({ id, organizationId, layout, customerName, projectId, billNumber, api }: any) => {
    const formData = new FormData();
    formData.append('organizationId', organizationId);
    if(customerName) formData.append('customerName', customerName);
    if(projectId) formData.append('projectId', projectId);
    if(billNumber) formData.append('billNumber', billNumber);

    const filesToUpload: File[] = [];
    
    // RE-PROCESSING LOGIC FOR SAFETY (Avoid JSON.parse breaking File objects)
    const cleanLayout = layout.map((section: any) => ({
        ...section,
        components: section.components.map((comp: any) => {
            if (comp.type === 'image' && typeof comp.value[0] !== 'string') {
                filesToUpload.push(comp.value[0]); // Assumes it's a File object
                return { ...comp, value: [`__FILE_${filesToUpload.length - 1}__`] };
            }
            return comp;
        })
    }));

    formData.append('layout', JSON.stringify(cleanLayout));
    filesToUpload.forEach(f => formData.append('files', f));

    const { data } = await api.put(`${BASE_URL}/bill/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};


export const getAllBillsNewApi = async ({
    organizationId,
    projectId,
    page,
    limit,
    search,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder,
    api
}: {
    organizationId: string;
    projectId?: string;
    page?: number;
    limit?: number;
    search?: string;
    createdFromDate?: string;
    createdToDate?: string;
    sortBy?: string;
    sortOrder?: string;
    api: AxiosInstance;
}) => {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (createdFromDate) params.append('createdFromDate', createdFromDate);
    if (createdToDate) params.append('createdToDate', createdToDate);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    // Note: Route changed to /bill/all/:organizationId based on standard REST practice 
    // or keep your existing route structure but append query params
    const { data } = await api.get(`${BASE_URL}/billall/${organizationId}?${params.toString()}`);
    return data;
};


// 9. Get Single Bill
export const getBillNewByIdApi = async ({
    id,
    // organizationId, // Note: Your route definitions only had :id, but check backend if orgId is needed
    api
}: {
    id: string;
    // organizationId: string; 
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`${BASE_URL}/bill/${id}`);
    return data.data;
};

// 10. Delete Bill
export const deleteBillNewApi = async ({
    id,
    organizationId,
    api
}: {
    id: string;
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`${BASE_URL}/bill/delete/${id}/${organizationId}`);
    return data;
};





// Shared consts
const ALLOWED_ROLES = ["owner", "staff", "CTO", "client"];

// ==========================================
// TEMPLATE HOOKS
// ==========================================

export const useSeedDefaultTemplate = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId }: { organizationId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await seedDefaultTemplateApi({ organizationId, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["billnew", "templates", organizationId] });
        }
    });
};

export const useGetAllTemplates = ({
    organizationId,
    limit = 10,
    search,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder
}: {
    organizationId: string;
    limit?: number;
    search?: string;
    createdFromDate?: string;
    createdToDate?: string;
    sortBy?: string;
    sortOrder?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO",]; // Adjust roles
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["billnew", "templates", organizationId, limit, search, createdFromDate, createdToDate, sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");

            return await getAllTemplatesApi({
                organizationId,
                page: pageParam,
                limit,
                search,
                createdFromDate,
                createdToDate,
                sortBy,
                sortOrder,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.hasNextPage) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && !!organizationId
    });
};

export const useGetTemplateById = ({ id, organizationId }: { id: string; organizationId: string }) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["billnew", "template", id, organizationId],

        queryFn: async () => {
            if (!role) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");

            return await getTemplateByIdApi({ id, organizationId, api });
        },
        enabled: !!id && !!organizationId && !!role
    });
};

export const useCreateNewTemplate = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { organizationId: string; templateName: string; layout: any[] }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await createNewTemplateApi({ ...payload, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["billnew", "templates", organizationId] });
        }
    });
};

export const useUpdateTemplateLayout = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { id: string; organizationId: string; layout: any[]; templateName?: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await updateTemplateLayoutApi({ ...payload, api });
        },
        onSuccess: (_, { id, organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["billnew", "templates", organizationId] });
            queryClient.invalidateQueries({ queryKey: ["billnew", "template", id] });
        }
    });
};

// ==========================================
// BILL HOOKS
// ==========================================

export const useCreateBillNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            organizationId: string;
            projectId?: string | null;
            customerName?: string;
            templateId?: string | null;
            initialValues?: any;
            layout?: any[];
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await createBillNewApi({ ...payload, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["billnew", "bills", organizationId] });
        }
    });
};

export const useUpdateBillNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            id: string;
            organizationId: string;
            layout: any[];
            customerName?: string;
            projectId?: string | null;
            billNumber?: string;
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await updateBillNewApi({ ...payload, api });
        },
        onSuccess: (_, { id, organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["billnew", "bills", organizationId] });
            queryClient.invalidateQueries({ queryKey: ["billnew", "bill", id] });
        }
    });
};


// --- INFINITE QUERY HOOK ---
export const useGetAllBillsNew = ({
    organizationId,
    projectId,
    limit = 10,
    search,
    createdFromDate,
    createdToDate,
    sortBy,
    sortOrder
}: {
    organizationId: string;
    projectId?: string;
    limit?: number;
    search?: string;
    createdFromDate?: string;
    createdToDate?: string;
    sortBy?: string;
    sortOrder?: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["billnew", "bills", organizationId, projectId, limit, search, createdFromDate, createdToDate, sortBy, sortOrder],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await getAllBillsNewApi({
                organizationId,
                projectId,
                page: pageParam,
                limit,
                search,
                createdFromDate,
                createdToDate,
                sortBy,
                sortOrder,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.hasNextPage) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!organizationId && !!role
    });
};

export const useGetBillNewById = ({ id }: { id: string }) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["billnew", "bill", id],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await getBillNewByIdApi({ id, api });
        },
        enabled: !!id && !!role
    });
};

export const useDeleteBillNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, organizationId }: { id: string; organizationId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API not found");
            return await deleteBillNewApi({ id, organizationId, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["billnew", "bills", organizationId] });
        }
    });
};