import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../apiService/apiService"
import type { MaterialItemType } from './../types/types';
import { queryClient } from "../QueryClient/queryClient";

const createMaterial = async ({ materialData, projectId, materialListId }: { materialData: MaterialItemType, projectId: string, materialListId: string }) => {
    try {
        let { data } = await Api.post(`/material/creatematerial/${projectId}?materialListId=${materialListId}`, materialData)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const createMaterialList = async ({ materialListName, projectId }: { materialListName: string, projectId: string }) => {
    try {
        let { data } = await Api.post(`/material/createmateriallist/${projectId}`, {materialListName})
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const getMaterialList = async ({ projectId }: { projectId: string }) => {
    try {
        let { data } = await Api.get(`/material/getmateriallist/${projectId}`)
        if (data.ok) {
            return data
        }
        return []
    }
    catch (error) {
        throw error
    }
}


const getMaterials = async ({ materialListId }: { materialListId: string }) => {
    try {
        let { data } = await Api.get(`/material/getmaterial/${materialListId}`)
        if (data.ok) {
            return data
        }
        return []
    }
    catch (error) {
        throw error
    }
}



const updateMaterialList = async ({ projectId, materailListId, materialListName }: { projectId: string, materailListId: string, materialListName: string }) => {
    try {
        let { data } = await Api.put(`/material/updatemateraillist/${projectId}/${materailListId}`, { materialListName })
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const updateMaterialItem = async ({ materialListId, materialId, materialItem }: { materialListId: string, materialId: string, materialItem: MaterialItemType }) => {
    try {
        let { data } = await Api.put(`/material/updatematerialitem/${materialListId}/${materialId}`, materialItem)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}



const deleteMaterialList = async ({ projectId, materailListId }: { projectId: string, materailListId: string }) => {
    try {
        let { data } = await Api.delete(`/material/deletemateriallist/${projectId}/${materailListId}`)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const deleteMaterialItem = async ({ materialListId, materialId }: { materialListId: string, materialId: string, }) => {
    try {
        let { data } = await Api.delete(`/material/deletematerial/${materialListId}/${materialId}`)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


export const useGetMaterials = ({ materialListId }: { materialListId: string }) => {
    return useQuery({
        queryKey: ["materialItem", materialListId],
        queryFn: () => getMaterials({ materialListId }),
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false
    })
}

export const useGetMaterialList = ({ projectId }: { projectId: string }) => {
    return useQuery({
        queryKey: ["materialList", projectId],
        queryFn: () => getMaterialList({ projectId }),
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false
    })
}


export const useCreateMaterialList = () => {
    return useMutation({
        mutationFn: createMaterialList,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["materialList", variables.projectId]
            })
        }
    })
}


export const useCreateMaterial = () => {
    return useMutation({
        mutationFn: createMaterial,
         onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["materialItem", variables.materialListId]
            })
        }
    })
}


export const useUpdateMaterialList = () => {
    return useMutation({
        mutationFn: updateMaterialList,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["materialList", variables.projectId]
            })
        }
    })
}

export const useUpdateMaterialItem = () => {
    return useMutation({
        mutationFn: updateMaterialItem,
         onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["materialItem", variables.materialListId]
            })
        }
    })
}


export const useDeleteMaterialItem = () => {
    return useMutation({
        mutationFn: deleteMaterialItem,
         onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["materialItem", variables.materialListId]
            })
        }
    })
}

export const useDeleteMaterialList = () => {
    return useMutation({
        mutationFn: deleteMaterialList,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["materialList", variables.projectId]
            })
        }
    })
}