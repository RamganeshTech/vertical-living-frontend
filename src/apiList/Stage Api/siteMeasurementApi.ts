import { useMutation, useQuery } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck";
import useGetRole from "../../Hooks/useGetRole";
import type { AxiosInstance } from "axios";
import type { UploadFilePayload } from "./requirementFormApi";
import { queryClient } from "../../QueryClient/queryClient";



const createmeasurement = async ({ projectId, siteDetails, api }: { projectId: string, siteDetails: any, api: AxiosInstance }) => {
    const { data } = await api.post(`/sitemeasurement/createmeasurement/${projectId}`, { siteDetails });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const createRoom = async ({ projectId, room, api }: { projectId: string, room: object, api: AxiosInstance }) => {
    const { data } = await api.post(`/sitemeasurement/createroom/${projectId}`, { room });
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

const udpateRoomDetails = async ({ projectId, api, roomId, room }: { roomId: string, projectId: string, api: AxiosInstance, room: any }) => {
    const { data } = await api.put(`/sitemeasurement/updateroommeasurement/${projectId}/${roomId}`, {room});
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

const deleteSiteMeauserementStage = async ({ projectId, api }: {  projectId: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sitemeasurement/deletesitemeasurement/${projectId}`,);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const setDeadlineSiteMeasurement = async ({ formId, deadLine, api }: { formId: string, deadLine: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sitemeasurement/deadline/${formId}`, { deadLine });
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
        mutationFn: async ({ projectId, siteDetails,}: { projectId: string , siteDetails: any}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await createmeasurement({ projectId, api, siteDetails,  });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};


export const useCreateRoomSiteMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, room,}: { projectId: string , room: object}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await createRoom({ projectId, api, room});
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
        mutationFn: async ({ projectId,roomId, room }: { projectId: string , room: any, roomId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await udpateRoomDetails({ projectId, api, roomId, room });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};


export const useCompletionStatusSiteMeasurement = () => {
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


export const useDeleteSiteMeasurementAndResetTimer = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await deleteSiteMeauserementStage({ projectId, api });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};

export const useSetDeadLineSiteMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId, deadLine }: { formId: string, deadLine: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await setDeadlineSiteMeasurement({ formId, deadLine, api })

        }
    })
}

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
