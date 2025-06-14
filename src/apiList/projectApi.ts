import { useMutation, useQuery } from "@tanstack/react-query"
import Api from "../apiService/apiService"
import { queryClient } from "../QueryClient/queryClient"
import type { ProjectInput } from "../components/CreateProject"
import { getApiForRole } from "../utils/roleCheck"
import useGetRole from "../Hooks/useGetRole"
import workerApi from "../apiService/workerApiService"

const createProject = async ({api , projectData, orgsId }: {api:typeof Api, projectData: Record<any, any>, orgsId: string }) => {
    try {
        let { data } = await api.post(`/project/createproject/${orgsId}`, projectData)
        console.log("create project", data)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const getProjects = async ({ role, orgsId }: { role: string | null, orgsId: string }) => {
    try {

        if (!role) return []

        let api = getApiForRole(role)

        if (!api || api === workerApi) return [];

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

const deleteProject = async (projectId: string) => {
    try {
        let { data } = await Api.delete(`/project/deleteproject/${projectId}`)
        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error
    }
}

const assignClientProject = async ({ projectId, clientId }: { projectId: string, clientId: string }) => {
    try {
        let { data } = await Api.patch(`/project/assignprojectclient/${projectId}/${clientId}`)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}

const updateProject = async ({ projectId, formData }: { projectId: string, formData: ProjectInput }) => {
    try {
        let { data } = await Api.put(`/project/updateproject/${projectId}`, formData)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


export const useGetProjects = (orgsId: string) => {
    const { role } = useGetRole()
    return useQuery({
        queryKey: ["project"],
        queryFn: () => getProjects({ role, orgsId }),
        enabled: !!role,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 10
    })
}

export const useCreateProject = () => {
    const { role } = useGetRole()
    return useMutation({
        mutationFn: async ({projectData,orgsId,}: {projectData: Record<string, any>, orgsId: string;}) => {
            let api;
          
            if(role === "staff" || role === "owner"){
                api = getApiForRole(role);
            }
            else{
                throw new Error("not allowed to create project")
            }

            if (!api) {
                throw new Error("No API configured for this role");
            }

            return await createProject({ api, orgsId, projectData });
            // console.log("crareted project with is", projectData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}


export const useDeleteProject = () => {
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}

export const useUpdateProject = () => {
    return useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}

export const useAssignClientToProject = () => {
    return useMutation({
        mutationFn: assignClientProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
} 