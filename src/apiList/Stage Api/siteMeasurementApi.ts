import { useMutation, useQuery } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck";
import useGetRole from "../../Hooks/useGetRole";
import type { AxiosInstance } from "axios";
import type { UploadFilePayload } from "./requirementFormApi";
import { queryClient } from "../../QueryClient/queryClient";



const createmeasurement = async ({ projectId, siteDetails, rooms, api }: { projectId: string, siteDetails: any, rooms: any, api: AxiosInstance }) => {
    const { data } = await api.post(`/sitemeasurement/createmeasurement/${projectId}`, { siteDetails, rooms });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const getMeasurement = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.get(`/sitemeasurement/getmeasurement/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const updateCommonSiteDetails = async ({ projectId, api, payload }: { projectId: string, api: AxiosInstance, payload: any }) => {
    const { data } = await api.put(`/sitemeasurement/updatecommonmeasurement/${projectId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const udpateRoomDetails = async ({ projectId, api, roomId, payload }: { roomId: string, projectId: string, api: AxiosInstance, payload: any }) => {
    const { data } = await api.put(`/sitemeasurement/updateroommeasurement/${projectId}/${roomId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const updateCompletionStatus = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sitemeasurement/completionstatus/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const deleteRoomFromMeauserementStage = async ({ projectId, roomId, api }: { roomId: string, projectId: string, api: AxiosInstance }) => {
    const { data } = await api.patch(`/sitemeasurement/deleteroom/${projectId}/${roomId}`,);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const uploadFiles = async ({ formId, files, api }: UploadFilePayload & { api: any }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const response = await api.post(`/sitemeasurement/upload/multiple/${formId}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    console.log("reposen", response)
    return response.data;
}

export const useGetSiteMeasurementDetails = ({ projectId }: { projectId: string }) => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)
    return useQuery({
        queryKey: ["siteMeasurement"],
        queryFn: async () => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await getMeasurement({ projectId, api });
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}


export const useCreateMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, siteDetails, rooms }: { projectId: string , siteDetails: any, rooms: any}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await createmeasurement({ projectId, api, siteDetails, rooms });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};


export const useUpdateCommonSiteMeasurementDetails = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, payload}: { projectId: string ,payload: any}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCommonSiteDetails({ projectId, api, payload });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};


export const useUdpateSiteMeasurmentRoomDetails = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId,roomId, payload }: { projectId: string , payload: any, roomId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await udpateRoomDetails({ projectId, api, roomId, payload });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};


export const useUpdateSiteMeasurementCompletionStatus = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId  }: { projectId: string}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCompletionStatus({ projectId, api });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};

export const useDeleteRoomFromMeauserementStage = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, roomId }: { projectId: string , roomId:string}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await deleteRoomFromMeauserementStage({ projectId, api, roomId });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};


// file upload hook
export const useUploadRequirementFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()
    const api = getApiForRole(role!)


    return useMutation({
        mutationFn: async ({ formId, files }: UploadFilePayload) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await uploadFiles({ formId, files, api })
        },
    });
};
