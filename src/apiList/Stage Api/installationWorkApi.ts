import { type AxiosInstance } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck"; 
import useGetRole from '../../Hooks/useGetRole';
import { queryClient } from "../../QueryClient/queryClient";

 const createInstallationItemApi = async (
    projectId: string,
    roomName: string,
 formData: FormData,
  api: AxiosInstance
) => {
    console.log("formData", formData)
  const { data } = await api.post(`/installation/${projectId}/${roomName}/item/create`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

 const editInstallationItemApi = async (
    projectId: string,
    roomName: string,
  formData: FormData,

  api: AxiosInstance
) => {
  const { data } = await api.put(`/installation/${projectId}/${roomName}/item/edit`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

 const deleteInstallationItemApi = async (
  payload: {
    projectId: string;
    roomName: string;
    itemId: string;
  },
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/installation/item/delete`, {
    data: payload,
  });
  if (!data.ok) throw new Error(data.message);
  return data.message;
};

 const getInstallationDetailsApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/installation/${projectId}/getalldetail`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

 const getInstallationRoomDetailsApi = async (
  projectId: string,
  roomName: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/installation/${projectId}/getroomdetail/${roomName}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};





export  const useCreateInstallationItem = () => {
  const allowedRoles = ["CTO", "owner", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({projectId, roomName,formData}: {projectId:string, roomName:string, formData:any}) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await createInstallationItemApi(projectId, roomName,formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["installation-details", projectId] });
    },
  });
};

export const useEditInstallationItem = () => {
  const allowedRoles = ["CTO", "owner", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({projectId, roomName,formData}: {projectId:string, roomName:string,formData:any}) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await editInstallationItemApi(projectId, roomName, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["installation-details", projectId] });
    },
  });
};

export const useDeleteInstallationItem = () => {
  const allowedRoles = ["CTO", "owner", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await deleteInstallationItemApi(payload, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["installation-details", projectId] });
    },
  });
};

export const useGetInstallationDetails = (projectId: string) => {
  const allowedRoles = ["CTO", "owner", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["installation-details", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await getInstallationDetailsApi(projectId, api);
    },
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};

export const useGetInstallationRoomDetails = (projectId: string, roomName: string) => {
  const allowedRoles = ["CTO", "owner", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["installation-room-details", projectId, roomName],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await getInstallationRoomDetailsApi(projectId, roomName, api);
    },
    enabled: !!role && !!projectId && !!roomName && !!api,
    retry: false,
    refetchOnMount: false,
  });
};






// ✅ 10. Set Deadline
 const setInstallationDeadlineApi = async ({
  formId,
 projectId,  deadLine, api }:
  {  projectId: string,
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/installation/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completeInstallationStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/installation/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useSetInstallationDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      formId,
      projectId,  deadLine }: {  projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setInstallationDeadlineApi({ formId, projectId, deadLine, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installation-details"] });
    },
  });
};

export const useCompleteInstallation = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeInstallationStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["installation-details", projectId] });
    },
  });
};