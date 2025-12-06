import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
// ==========================================
// TYPES
// ==========================================

// Common Query Filters for Get All
export interface DesignLabFilters {
    search?: string;
    spaceType?: string;
    difficultyLevel?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// ==========================================
// API FUNCTIONS
// ==========================================

const BASE_URL = "/designlab";

// 1. Create Design Lab
const createDesignLabApi = async ({
    organizationId,
    formData,
    api
}: {
    organizationId: string;
    formData: FormData;
    api: AxiosInstance;
}) => {
    // formData contains 'data', 'fileMapping', and 'files'
    const { data } = await api.post(`${BASE_URL}/create/${organizationId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 2. Get All Design Labs (Paginated)
const getAllDesignLabsApi = async ({
    organizationId,
    pageParam = 1,
    filters,
    api
}: {
    organizationId: string;
    pageParam: number;
    filters: DesignLabFilters;
    api: AxiosInstance;
}) => {
    const params = {
        organizationId,
        page: pageParam,
        limit: 10, // Default limit
        ...filters
    };
    const { data } = await api.get(`${BASE_URL}/getall`, { params });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 3. Get Single Design Lab
const getDesignLabByIdApi = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`${BASE_URL}/getsingle/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 4. Update Design Lab (Text Data)
const updateDesignLabApi = async ({
    id,
    updateData,
    api
}: {
    id: string;
    updateData: any; // Partial<IDesignLab>
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`${BASE_URL}/updatedesign/${id}`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 5. Delete Design Lab
const deleteDesignLabApi = async ({
    id,
    api
}: {
    id: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`${BASE_URL}/deletedesign/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 6. Upload Reference Images
const uploadReferenceImagesApi = async ({
    id,
    formData,
    api
}: {
    id: string;
    formData: FormData;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`${BASE_URL}/upload/${id}/reference-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;

};

// 7. Delete Reference Image
const deleteReferenceImageApi = async ({
    id,
    imageId,
    api
}: {
    id: string;
    imageId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`${BASE_URL}/delete/${id}/reference-images/${imageId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 8. Upload Material Image
const uploadMaterialImageApi = async ({
    id,
    componentId,
    materialId,
    formData,
    api
}: {
    id: string;
    componentId: string;
    materialId: string;
    formData: FormData;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(
        `${BASE_URL}/upload/${id}/components/${componentId}/materials/${materialId}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 9. Delete Material Image
const deleteMaterialImageApi = async ({
    id,
    componentId,
    materialId,
    api
}: {
    id: string;
    componentId: string;
    materialId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(
        `${BASE_URL}/delete/${id}/components/${componentId}/materials/${materialId}/image`
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==========================================
// CUSTOM HOOKS
// ==========================================

const allowedRoles = ["owner", "staff", "CTO"];

// 1. Hook: Create Design Lab
export const useCreateDesignLab = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            organizationId,
            formData
        }: {
            organizationId: string;
            formData: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await createDesignLabApi({ organizationId, formData, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["designLabs", organizationId] });
        }
    });
};

// 2. Hook: Get All Design Labs (Infinite Query)
export const useGetAllDesignLabs = ({
    organizationId,
    filters
}: {
    organizationId: string;
    filters: DesignLabFilters;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["designLabs", organizationId, filters],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            return await getAllDesignLabsApi({
                organizationId,
                pageParam: pageParam as number,
                filters,
                api
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            // Backend returns: { pagination: { hasNextPage, nextPage, ... } }
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
        enabled: !!organizationId && !!role && allowedRoles.includes(role),
    });
};

// 3. Hook: Get Single Design Lab
export const useGetDesignLabById = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["designLab", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getDesignLabByIdApi({ id, api });
        },
        enabled: !!id && !!role && allowedRoles.includes(role),
    });
};

// 4. Hook: Update Design Lab
export const useUpdateDesignLab = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            updateData
        }: {
            id: string;
            updateData: any;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await updateDesignLabApi({ id, updateData, api });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["designLab", id] });
            queryClient.invalidateQueries({ queryKey: ["designLabs"] }); // Refresh list as well
        }
    });
};

// 5. Hook: Delete Design Lab
export const useDeleteDesignLab = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteDesignLabApi({ id, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["designLabs"] });
        }
    });
};

// 6. Hook: Upload Reference Images
export const useUploadReferenceImages = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            formData
        }: {
            id: string;
            formData: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await uploadReferenceImagesApi({ id, formData, api });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["designLab", id] });
        }
    });
};

// 7. Hook: Delete Reference Image
export const useDeleteReferenceImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            imageId
        }: {
            id: string;
            imageId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteReferenceImageApi({ id, imageId, api });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["designLab", id] });
        }
    });
};

// 8. Hook: Upload Material Image
export const useUploadMaterialImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            componentId,
            materialId,
            formData
        }: {
            id: string;
            componentId: string;
            materialId: string;
            formData: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await uploadMaterialImageApi({ id, componentId, materialId, formData, api });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["designLab", id] });
        }
    });
};

// 9. Hook: Delete Material Image
export const useDeleteMaterialImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            componentId,
            materialId
        }: {
            id: string;
            componentId: string;
            materialId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteMaterialImageApi({ id, componentId, materialId, api });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["designLab", id] });
        }
    });
};