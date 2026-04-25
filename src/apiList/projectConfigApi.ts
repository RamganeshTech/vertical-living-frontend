import { type AxiosInstance } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../Hooks/useGetRole"; // Adjust path if needed
import { getApiForRole } from "../utils/roleCheck"; // Adjust path if needed

// ==========================================
// 1. API Fetch/Mutation Functions
// ==========================================

export const fetchProjectConfigData = async ({
    organizationId,
    api
}: {
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/project-config/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const uploadConfigVideosData = async ({
    organizationId,
    formData,
    api
}: {
    organizationId: string;
    formData: FormData;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/project-config/${organizationId}/videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const uploadConfigImagesData = async ({
    organizationId,
    formData,
    api
}: {
    organizationId: string;
    formData: FormData;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/project-config/${organizationId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const updateTermsAndConditionsData = async ({
    organizationId,
    termsAndCondition,
    api
}: {
    organizationId: string;
    termsAndCondition: string;
    api: AxiosInstance;
}) => {
    // Sending as standard JSON, not FormData
    const { data } = await api.put(`/project-config/${organizationId}/terms`, { termsAndCondition });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const deleteConfigVideoData = async ({
    organizationId,
    videoId,
    api
}: {
    organizationId: string;
    videoId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/project-config/${organizationId}/videos/${videoId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const deleteConfigImageData = async ({
    organizationId,
    imageId,
    api
}: {
    organizationId: string;
    imageId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/project-config/${organizationId}/images/${imageId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ==========================================
// 2. React Query Hooks
// ==========================================

export const useGetProjectConfig = (organizationId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"]; 
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        // Include org ID in the query key for proper caching
        queryKey: ["projectConfig", organizationId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            if (!organizationId) throw new Error("Organization ID is required");
            
            return await fetchProjectConfigData({ organizationId, api });
        },
        enabled: !!role && !!api && !!organizationId && allowedRoles.includes(role),
        staleTime: 5 * 60 * 1000 
    });
};

export const useUploadConfigVideos = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, formData }: { organizationId: string; formData: FormData }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await uploadConfigVideosData({ organizationId, formData, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["projectConfig", organizationId] });
        }
    });
};

export const useUploadConfigImages = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, formData }: { organizationId: string; formData: FormData }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await uploadConfigImagesData({ organizationId, formData, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["projectConfig", organizationId] });
        }
    });
};

export const useUpdateTermsAndConditions = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, termsAndCondition }: { organizationId: string; termsAndCondition: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await updateTermsAndConditionsData({ organizationId, termsAndCondition, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["projectConfig", organizationId] });
        }
    });
};




export const useDeleteConfigVideo = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, videoId }: { organizationId: string; videoId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteConfigVideoData({ organizationId, videoId, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["projectConfig", organizationId] });
        }
    });
};

export const useDeleteConfigImage = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, imageId }: { organizationId: string; imageId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");

            return await deleteConfigImageData({ organizationId, imageId, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["projectConfig", organizationId] });
        }
    });
};