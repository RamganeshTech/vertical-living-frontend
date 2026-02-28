import { type AxiosInstance } from "axios";
import { useMutation, useQuery, useInfiniteQuery,  } from "@tanstack/react-query";

import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";


// 1. Create Tool (Multipart/FormData)
export const createToolApi = async (formData: FormData, api: AxiosInstance) => {
    const { data } = await api.post(`/toolmaster/create`, formData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const createToolApiV1 = async (formData: FormData, api: AxiosInstance) => {
    const { data } = await api.post(`/toolmaster/v1/create`, formData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 2. Update Tool Content (JSON)
export const updateToolContentApi = async ({ id, updateData, api }: { id: string; updateData: any; api: AxiosInstance }) => {
    const { data } = await api.patch(`/toolmaster/updatecontent/${id}`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 3. Update Tool Images (Multipart/FormData)
export const updateToolImagesApi = async ({ id, formData, api }: { id: string; formData: FormData; api: AxiosInstance }) => {
    const { data } = await api.patch(`/toolmaster/updateimages/${id}`, formData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 4. Get All Tools (Infinite Scroll)
export const getAllToolsApi = async ({ 
    params, 
    api 
}: { 
    params: any; 
    api: AxiosInstance 
}) => {
    const { data } = await api.get(`/toolmaster/getall`, { params });
    if (!data.ok) throw new Error(data.message);
    return data; // Returns { data: [...], total, totalPages, currentPage }
};

// 5. Get Tool By ID
export const getToolByIdApi = async (id: string, api: AxiosInstance) => {
    const { data } = await api.get(`/toolmaster/get/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 6. Delete Tool
export const deleteToolApi = async (id: string, api: AxiosInstance) => {
    const { data } = await api.delete(`/toolmaster/delete/${id}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};


// 2. Update Warranty Files
export const updateToolWarrantyApi = async (id: string, formData: FormData, api: AxiosInstance) => {
    const { data } = await api.patch(`/toolmaster/updatewarrantyfiles/${id}`, formData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 3. Delete Tool Image
export const deleteToolImageApi = async (toolId: string, fileId: string, api: AxiosInstance) => {
    const { data } = await api.delete(`/toolmaster/tools/${toolId}/tool-image/${fileId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// 4. Delete Warranty File
export const deleteWarrantyFileApi = async (toolId: string, fileId: string, api: AxiosInstance) => {
    const { data } = await api.delete(`/toolmaster/tools/${toolId}/warranty-file/${fileId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const allowedRoles = ["owner", "staff", "CTO"];


// 1. Hook: Create Tool
export const useCreateTool = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (formData: FormData) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await createToolApi(formData, api!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
        }
    });
};


// 1. Hook: Create Tool new version
export const useCreateToolV1 = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (formData: FormData) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await createToolApi(formData, api);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
        }
    });
};

// 2. Hook: Update Tool Content
export const useUpdateToolContent = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, updateData }: { id: string; updateData: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await updateToolContentApi({ id, updateData, api: api! });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
            queryClient.invalidateQueries({ queryKey: ["toolmaster", id] });
        }
    });
};

// 3. Hook: Update Tool Images
export const useUpdateToolImages = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await updateToolImagesApi({ id, formData, api: api! });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster", id] });
        }
    });
};

// 4. Hook: Get All Tools (Infinite Query)
export const useGetAllToolsInfinite = (filters: any) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["toolmaster", "all", filters],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await getAllToolsApi({ 
                params: { ...filters, page: pageParam, limit: 10 }, 
                api: api! 
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && !!api
    });
};

// 5. Hook: Get Tool By ID
export const useGetToolById = (id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["toolmaster", id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await getToolByIdApi(id, api!);
        },
        enabled: !!id && !!role && !!api
    });
};

// 6. Hook: Delete Tool
export const useDeleteTool = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (id: string) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");

            return await deleteToolApi(id, api!);
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster", id] });
        }
    });
};



export const useUpdateToolWarrantyFiles = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await updateToolWarrantyApi(id, formData, api);
        },
        onSuccess: (_, {id}) => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster", id] });
        }
    });
};

// 3. Hook: Delete Tool Image
export const useDeleteToolImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ toolId, fileId }: { toolId: string, fileId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await deleteToolImageApi(toolId, fileId, api);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
        }
    });
};

// 4. Hook: Delete Warranty File
export const useDeleteWarrantyFile = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ toolId, fileId }: { toolId: string, fileId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            if (!api) throw new Error("API instance not found for role");
            return await deleteWarrantyFileApi(toolId, fileId, api);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["toolmaster"] });
        }
    });
};