import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "../QueryClient/queryClient"
import type { ProjectInput } from "../components/CreateProject"
import { getApiForRole } from "../utils/roleCheck"
import useGetRole from "../Hooks/useGetRole"
import type { AxiosInstance } from "axios"

const createProject = async ({ api, projectData, orgsId }: { api: AxiosInstance, projectData: Record<any, any>, orgsId: string }) => {
    try {
        let { data } = await api.post(`/project/createproject/${orgsId}`, projectData)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const getProjects = async ({ orgsId, api }: { orgsId: string, api: AxiosInstance, }) => {
    try {

        let { data } = await api.get(`/project/getprojects/${orgsId}`)
        if (data.ok) {
            return data.data
        }
        return []
    }
    catch (error) {
        throw error
    }
}

const deleteProject = async (projectId: string, api: AxiosInstance) => {
    try {
        let { data } = await api.delete(`/project/deleteproject/${projectId}`)
        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error
    }
}

const assignClientProject  = async ({ projectId, clientId, api }: { projectId: string, clientId: string, api: AxiosInstance, }) => {
    try {
        let { data } = await api.patch(`/project/assignprojectclient/${projectId}/${clientId}`)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}

const updateProject = async ({ projectId, formData, api }: { projectId: string, api: AxiosInstance, formData: ProjectInput }) => {
    try {
        let { data } = await api.put(`/project/updateproject/${projectId}`, formData)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


export const useGetProjects = (orgsId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];

    return useQuery({
        queryKey: ["project"],
        queryFn: async () => {
            if (!role) throw new Error("Not Allowed");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed");
            if (!api) throw new Error("API not found");
            return await getProjects({ orgsId, api })
        },
        enabled: !!role,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const useCreateProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({ projectData, orgsId, }: { projectData: Record<string, any>, orgsId: string; }) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await createProject({ api, orgsId, projectData });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}


export const useDeleteProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "CTO"];
    return useMutation({
        mutationFn: async (projectId: string) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await deleteProject(projectId, api)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}

export const useUpdateProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];
    return useMutation({
        mutationFn: async ({ projectId, formData }: { projectId: string, formData: ProjectInput }) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await updateProject({ projectId, formData, api })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}

export const useAssignClientToProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({ projectId, clientId }: { projectId: string, clientId: string}) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await assignClientProject({ projectId, clientId, api })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
} 
