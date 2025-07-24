import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";

const addRoomToProject = async ({
    projectId,
    roomName,
    api
}: {
    projectId: string;
    roomName: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/sampledesign/${projectId}/rooms`, { roomName });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const uploadRoomFiles = async ({
    projectId,
    roomName,
    files,
    api
}: {
    projectId: string;
    roomName: string;
    files: File[];
    api: AxiosInstance;
}) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const { data } = await api.post(`/sampledesign/${projectId}/rooms/${roomName}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return data.data;
};



const getRoomFiles = async ({
    projectId,
    api
}: {
    projectId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/sampledesign/${projectId}/rooms`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const deleteRoomFile = async ({
    projectId,
    roomName,
    fileIndex,
    api
}: {
    projectId: string;
    roomName: string;
    fileIndex: number;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/sampledesign/${projectId}/rooms/${roomName}/delete/${fileIndex}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const deleteRoom = async ({ projectId, api, roomId }: { projectId: string,  roomId: string, api: AxiosInstance }) => {
    const { data } = await api.delete(`/sampledesign/${projectId}/${roomId}/deleteroom`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const updateCompletionStatus = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sampledesign/completionstatus/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const setDeadlineSampleDesign = async ({ formId,projectId,  deadLine, api }: {  projectId: string, formId: string, deadLine: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sampledesign/deadline/${projectId}/${formId}`, { deadLine });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


export const useAddRoom = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            roomName
        }: {
            projectId: string;
            roomName: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await addRoomToProject({ projectId, roomName, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sampledesign", "rooms"] });
        }
    });
};




export const useUploadRoomFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            roomName,
            files
        }: {
            projectId: string;
            roomName: string;
            files: File[];
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await uploadRoomFiles({ projectId, roomName, files, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sampledesign", "roomfiles"] });
        }
    });
};



export const useGetRoomFiles = (projectId: string) => {
    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["sampledesign", "roomfiles", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await getRoomFiles({ projectId, api });
        },
        // enabled: !!projectId && !!role,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    });
};

export const useDeleteRoomFile = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            roomName,
            fileIndex
        }: {
            projectId: string;
            roomName: string;
            fileIndex: number;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteRoomFile({ projectId, roomName, fileIndex, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sampledesign", "roomfiles"] });
        }
    });
};



export const useDeleteRoomSampleDesign = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId, roomId
        }: {
            projectId: string;
            roomId:string
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteRoom({ projectId , roomId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sampledesign", "roomfiles"] });
        }
    });
};



export const useCompletionStatusSampleDesign= () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId  }: { projectId: string}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCompletionStatus({ projectId, api });
        },
        onSuccess: (_m, {projectId})=>{
            queryClient.invalidateQueries({queryKey:["sampledesign", "roomfiles", projectId]})
        }
    });
};



export const useSetDeadLineSampleDesign= () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId, projectId,  deadLine, }: {  projectId: string, formId: string, deadLine: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await setDeadlineSampleDesign({ formId, projectId, deadLine, api })

        }
    })
}