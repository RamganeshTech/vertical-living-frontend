import { useMutation, useQuery } from "@tanstack/react-query"
import Api from "../apiService/apiService"
import { queryClient } from "../QueryClient/queryClient"
import type { ProjectInput } from "../components/CreateProject"

const createProject = async (projectData: Record<any, any>) => {
    try {
        let { data } = await Api.post(`/project/createproject`, projectData)
        console.log("create project", data)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const getProjects = async () => {
    try {
        let { data } = await Api.get(`/project/getprojects`)
        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error
    }
}

const deleteProject = async (projectId:string)=>{
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

const assignClientProject = async ({projectId, clientId}:{projectId:string, clientId:string})=>{
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

const updateProject = async ({projectId, formData}:{projectId:string, formData:ProjectInput})=>{
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

export const useGetProjects = ()=>{
    return useQuery({
    queryKey:["project"],
    queryFn: getProjects,
    refetchOnWindowFocus:false,
    retry:false,
    staleTime: 1000 * 60 * 10
})
}

export const useCreateProject = ()=>{
    return useMutation({
    mutationFn:createProject,
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['project']})
    }
})
} 


export const useDeleteProject = ()=>{
    return useMutation({
    mutationFn:deleteProject,
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['project']})
    }
})
} 

export const useUpdateProject = ()=>{
    return useMutation({
    mutationFn:updateProject,
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['project']})
    }
})
} 

export const useAssignClientToProject = ()=>{
    return useMutation({
    mutationFn:assignClientProject,
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['project']})
    }
})
} 