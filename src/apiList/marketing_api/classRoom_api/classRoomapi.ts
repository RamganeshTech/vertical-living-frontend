import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
// Adjust these imports to match your actual file paths
// import { useGetRole } from "../../hooks/useGetRole"; 
// import { getApiForRole } from "../../utils/getApiForRole";

const ALLOWED_ROLES = ["owner", "staff", "CTO"];
const BASE_PATH = "/classroom"; // Assuming your Axios baseURL already includes '/api'

// ==========================================
// TYPES / DTOs
// ==========================================

export interface ModulePayload {
    moduleName: string;
    description?: string;
}

export interface TabPayload {
    title: string;
    order?: number;
}

export interface ContentBlockPayload {
    type: 'paragraph' | 'list' | 'heading' | 'callout';
    text?: string;
    listItems?: string[];
    url?: string;
    order?: number;
}


// ==========================================
// 1. MAIN MODULE API & HOOKS
// ==========================================

// --- CREATE MODULE ---
const createModuleApi = async ({ organizationId, payload, api }: { organizationId: string; payload: ModulePayload; api: AxiosInstance }) => {
    const { data } = await api.post(`${BASE_PATH}/${organizationId}/modules`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useCreateModule = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, payload }: { organizationId: string; payload: ModulePayload }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await createModuleApi({ organizationId, payload, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "modules", organizationId] });
        }
    });
};

// --- GET ALL MODULES ---
const getAllModulesApi = async ({ organizationId, api }: { organizationId: string; api: AxiosInstance }) => {
    const { data } = await api.get(`${BASE_PATH}/${organizationId}/modules`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useGetAllModules = (organizationId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["classroom", "modules", organizationId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await getAllModulesApi({ organizationId, api });
        },
        enabled: !!organizationId && !!role && ALLOWED_ROLES.includes(role) && !!api,
    });
};

// --- GET MODULE BY ID ---
const getModuleByIdApi = async ({ organizationId, moduleId, api }: { organizationId: string; moduleId: string; api: AxiosInstance }) => {
    const { data } = await api.get(`${BASE_PATH}/${organizationId}/modules/${moduleId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useGetModuleById = (organizationId: string, moduleId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["classroom", "module", organizationId, moduleId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await getModuleByIdApi({ organizationId, moduleId, api });
        },
        enabled: !!organizationId && !!moduleId && !!role && ALLOWED_ROLES.includes(role) && !!api,
    });
};

// --- UPDATE MODULE ---
const updateModuleApi = async ({ organizationId, moduleId, payload, api }: { organizationId: string; moduleId: string; payload: Partial<ModulePayload>; api: AxiosInstance }) => {
    const { data } = await api.put(`${BASE_PATH}/${organizationId}/modules/${moduleId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUpdateModule = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId, payload }: { organizationId: string; moduleId: string; payload: Partial<ModulePayload> }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await updateModuleApi({ organizationId, moduleId, payload, api });
        },
        onSuccess: (_, { organizationId, moduleId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "modules", organizationId] });
            queryClient.invalidateQueries({ queryKey: ["classroom", "module", organizationId, moduleId] });
        }
    });
};

// --- DELETE MODULE ---
const deleteModuleApi = async ({ organizationId, moduleId, api }: { organizationId: string; moduleId: string; api: AxiosInstance }) => {
    const { data } = await api.delete(`${BASE_PATH}/${organizationId}/modules/${moduleId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useDeleteModule = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId }: { organizationId: string; moduleId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteModuleApi({ organizationId, moduleId, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "modules", organizationId] });
        }
    });
};


// ==========================================
// 2. TAB API & HOOKS
// ==========================================

// --- CREATE TAB ---
const createTabApi = async ({ organizationId, moduleId, payload, api }: { organizationId: string; moduleId: string; payload: TabPayload; api: AxiosInstance }) => {
    const { data } = await api.post(`${BASE_PATH}/${organizationId}/modules/${moduleId}/tabs`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useCreateTab = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId, payload }: { organizationId: string; moduleId: string; payload: TabPayload }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await createTabApi({ organizationId, moduleId, payload, api });
        },
        onSuccess: (_, { organizationId, moduleId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "module", organizationId, moduleId] });
        }
    });
};

// --- UPDATE TAB ---
const updateTabApi = async ({ organizationId, moduleId, tabId, payload, api }: { organizationId: string; moduleId: string; tabId: string; payload: Partial<TabPayload>; api: AxiosInstance }) => {
    const { data } = await api.put(`${BASE_PATH}/${organizationId}/modules/${moduleId}/tabs/${tabId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUpdateTab = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId, tabId, payload }: { organizationId: string; moduleId: string; tabId: string; payload: Partial<TabPayload> }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await updateTabApi({ organizationId, moduleId, tabId, payload, api });
        },
        onSuccess: (_, { organizationId, moduleId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "module", organizationId, moduleId] });
        }
    });
};

// --- DELETE TAB ---
const deleteTabApi = async ({ organizationId, moduleId, tabId, api }: { organizationId: string; moduleId: string; tabId: string; api: AxiosInstance }) => {
    const { data } = await api.delete(`${BASE_PATH}/${organizationId}/modules/${moduleId}/tabs/${tabId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useDeleteTab = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId, tabId }: { organizationId: string; moduleId: string; tabId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteTabApi({ organizationId, moduleId, tabId, api });
        },
        onSuccess: (_, { organizationId, moduleId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "module", organizationId, moduleId] });
        }
    });
};


// ==========================================
// 3. CONTENT BLOCK API & HOOKS
// ==========================================

// --- CREATE CONTENT BLOCK ---
const createContentBlockApi = async ({ organizationId, moduleId, tabId, payload, api }: { organizationId: string; moduleId: string; tabId: string; payload: ContentBlockPayload; api: AxiosInstance }) => {
    const { data } = await api.post(`${BASE_PATH}/${organizationId}/modules/${moduleId}/tabs/${tabId}/content`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useCreateContentBlock = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId, tabId, payload }: { organizationId: string; moduleId: string; tabId: string; payload: ContentBlockPayload }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await createContentBlockApi({ organizationId, moduleId, tabId, payload, api });
        },
        onSuccess: (_, { organizationId, moduleId }) => {
            // Invalidating the entire module ensures the tab gets its fresh nested content block
            queryClient.invalidateQueries({ queryKey: ["classroom", "module", organizationId, moduleId] });
        }
    });
};

// --- UPDATE CONTENT BLOCK ---
const updateContentBlockApi = async ({ organizationId, moduleId, tabId, contentId, payload, api }: { organizationId: string; moduleId: string; tabId: string; contentId: string; payload: Partial<ContentBlockPayload>; api: AxiosInstance }) => {
    const { data } = await api.put(`${BASE_PATH}/${organizationId}/modules/${moduleId}/tabs/${tabId}/content/${contentId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUpdateContentBlock = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, moduleId, tabId, contentId, payload }: { organizationId: string; moduleId: string; tabId: string; contentId: string; payload: Partial<ContentBlockPayload> }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await updateContentBlockApi({ organizationId, moduleId, tabId, contentId, payload, api });
        },
        onSuccess: (_, { organizationId, moduleId }) => {
            queryClient.invalidateQueries({ queryKey: ["classroom", "module", organizationId, moduleId] });
        }
    });
};