import { type AxiosInstance } from 'axios';


import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';

// 1. Save Cutlist (Create/Update)
// Uses FormData because it contains room images
export const saveCutlistApi = async ({
    id,
    formData,
    api
}: {
    id?: string;
    formData: FormData;
    api: AxiosInstance;
}) => {
    const url = id ? `/cutlist/save?id=${id}` : `/cutlist/save`;
    // We use .post for both or .put for update as per your router
    const method = id ? 'put' : 'post';
    const { data } = await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 2. Get All Cutlists (Paginated)
export const getAllCutlistsApi = async ({
    organizationId,
    projectId,
    page,
    limit,
    search,
    startDate,
    endDate,
    api
}: {
    organizationId?: string;
    projectId?: string;
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string,
    endDate?: string,
    api: AxiosInstance;
}) => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (projectId) params.append('projectId', projectId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    // Date Range (Backend uses 'deptGeneratedDate')
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);


    const { data } = await api.get(`/cutlist/all?${params.toString()}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

// 3. Get Single Cutlist
export const getSingleCutlistApi = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/cutlist/single/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 4. Delete Cutlist
export const deleteCutlistApi = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/cutlist/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// 1. Save Cutlist (Create/Update)
// Uses FormData because it contains room images
export const generateCutlistPdf = async ({
    id,
    api
}: {
    id?: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/cutlist/generatepdf/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const allowedRoles = ["owner", "staff", "CTO"];

// 1. Hook: Save Cutlist
export const useSaveCutlist = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, formData }: { id?: string; formData: FormData }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await saveCutlistApi({ id, formData, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cutlists"] });
        }
    });
};




// 2. Hook: Get All Cutlists (Infinite Scroll / Pagination)
export const useGetAllCutlists = ({
    organizationId,
    projectId,
    limit = 10,
    search,
    startDate, endDate
}: {
    organizationId?: string;
    projectId?: string;
    startDate?: string,
    endDate?: string,
    limit?: number;
    search?: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["cutlists", "all", organizationId, projectId, limit, search, startDate, endDate],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");

            return await getAllCutlistsApi({
                organizationId,
                projectId,
                page: pageParam,
                limit,
                search,
                startDate, endDate,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            // Assuming backend returns pagination: { page, totalPages }
            if (lastPage.pagination && lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && allowedRoles.includes(role) && !!organizationId
    });
};

// 3. Hook: Get Single Cutlist
export const useGetSingleCutlist = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["cutlists", "single", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await getSingleCutlistApi({ id, api });
        },
        refetchOnWindowFocus:false,
        refetchOnMount: false,
        enabled: !!role && allowedRoles.includes(role) && !!id
    });
};

// 4. Hook: Delete Cutlist
export const useDeleteCutlist = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await deleteCutlistApi({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cutlists"] });
        }
    });
};





// 1. Hook: Save Cutlist
export const useGenerateCutlistPdf = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id }: { id: string; }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await generateCutlistPdf({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cutlists"] });
        }
    });
};