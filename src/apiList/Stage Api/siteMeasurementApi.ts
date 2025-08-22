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
    const { data } = await api.put(`/sitemeasurement/updateroommeasurement/${projectId}/${roomId}`, { room });
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

const deleteSiteMeauserementStage = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sitemeasurement/deletesitemeasurement/${projectId}`,);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const setDeadlineSiteMeasurement = async ({ formId, projectId, deadLine, api }: { formId: string, projectId: string, deadLine: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/sitemeasurement/deadline/${projectId}/${formId}`, { deadLine });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const uploadFiles = async ({ formId, files, api, projectId }: UploadFilePayload & { api: any }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const response = await api.post(`/sitemeasurement/upload/multiple/${projectId}/${formId}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}


const deleteSiteRequriementFileApi = async (
    projectId: string,
    fileId: string,
    api: AxiosInstance
) => {
    const { data } = await api.patch(`/sitemeasurement/${projectId}/deleteuploadedfile/${fileId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const useDeleteSiteRequriementFile = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    const allowedRoles = ["owner", "staff", "CTO", "client"]

    return useMutation({
        mutationFn: async ({ projectId, fileId }: { projectId: string, fileId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role"); return await deleteSiteRequriementFileApi(projectId, fileId, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};

export const useGetSiteMeasurementDetails = ({ projectId }: { projectId: string }) => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)
    return useQuery({
        queryKey: ["siteMeasurement", projectId],
        queryFn: async () => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await getMeasurement({ projectId, api });
        },
        retry: false,
        // refetchOnMount: false,
    })
}


export const useCreateMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, siteDetails, }: { projectId: string, siteDetails: any }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await createmeasurement({ projectId, api, siteDetails, });
        },
       onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};


export const useCreateRoomSiteMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, room, }: { projectId: string, room: object }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await createRoom({ projectId, api, room });
        },
       onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};


export const useUpdateCommonSiteMeasurementDetails = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, payload }: { projectId: string, payload: any }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCommonSiteDetails({ projectId, api, payload });
        },
       onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};


export const useUdpateSiteMeasurmentRoomDetails = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, roomId, room }: { projectId: string, room: any, roomId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await udpateRoomDetails({ projectId, api, roomId, room });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};


export const useCompletionStatusSiteMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCompletionStatus({ projectId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};

export const useDeleteRoomFromMeauserementStage = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, roomId }: { projectId: string, roomId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await deleteRoomFromMeauserementStage({ projectId, api, roomId });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
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
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};

export const useSetDeadLineSiteMeasurement = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId, projectId, deadLine, }: { formId: string, projectId: string, deadLine: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await setDeadlineSiteMeasurement({ formId, deadLine, projectId, api })

        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    })
}

// file upload hook
export const useUploadRequirementFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()
    const api = getApiForRole(role!)


    return useMutation({
        mutationFn: async ({ formId, files, projectId }: {formId:string, files:File[], projectId:string}) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await uploadFiles({ formId, files, projectId, api })
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};



const uploadRoomFiles = async ({ roomId, files, api, projectId }:{roomId:string, files:FormData, projectId:string, api: any }) => {

    const response = await api.post(`/sitemeasurement/uploadroom/${projectId}/${roomId}`, files,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}


const deleteRoomFiles = async ({ roomId, uploadId, api, projectId }:  {roomId:string, uploadId:string, projectId:string, api: any }) => {
    const response = await api.delete(`/sitemeasurement/deleteroom/${projectId}/${roomId}/${uploadId}`);
    return response.data;
}


const updateImageCategoryName = async ({projectId,roomId,uploadId,categoryName,api,}: {projectId: string; roomId: string; uploadId: string; categoryName: string;api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/sitemeasurement/updateimgname/${projectId}/${roomId}/${uploadId}`,
    { categoryName }
  );

  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// file upload hook
export const useUploadRoomSiteFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()
    const api = getApiForRole(role!)


    return useMutation({
        mutationFn: async ({ roomId, files, projectId }: {roomId:string, files:FormData, projectId:string}) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await uploadRoomFiles({ roomId, files, projectId, api })
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};






// file upload hook
export const useDeleteRoomSiteFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()
    const api = getApiForRole(role!)


    return useMutation({
        mutationFn: async ({ roomId, uploadId,  projectId }: {roomId:string, uploadId:string, projectId:string }) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await deleteRoomFiles({ roomId, uploadId, projectId, api })
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
    });
};



export const useUpdateImageCategoryName = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({projectId,roomId,uploadId,categoryName,}: {
      projectId: string;
      roomId: string;
      uploadId: string;
      categoryName: string;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call");

      if (!api) throw new Error("API instance not found for role");

      return await updateImageCategoryName({projectId,roomId,uploadId,categoryName,api,});
    },
    onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        },
  });
};