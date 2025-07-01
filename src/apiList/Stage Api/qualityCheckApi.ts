import { type AxiosInstance } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck"; 
import useGetRole from "../../Hooks/useGetRole"; 

// === CREATE ===
 const createQualityCheckItemApi = async (
  projectId: string,
  roomName: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/qualitycheck/${projectId}/${roomName}/item/create`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// === EDIT ===
 const editQualityCheckItemApi = async (
  projectId: string,
  roomName: string,
  itemId: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/qualitycheck/${projectId}/${roomName}/${itemId}/item/edit`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// === DELETE ===
 const deleteQualityCheckItemApi = async (
  projectId: string,
  roomName: string,
  itemId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/qualitycheck/${projectId}/${roomName}/${itemId}/item/delete`);
  if (!data.ok) throw new Error(data.message);
  return data;
};

// === GET ALL ===
 const getQualityCheckupApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/qualitycheck/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// === GET SINGLE ROOM ===
 const getQualityCheckRoomItemsApi = async (
  projectId: string,
  roomName: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/qualitycheck/${projectId}/${roomName}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// === CREATE ===
export const useCreateQualityCheckItem = () => {
  const allowedRoles = ["owner", "CTO", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomName, formData }: { projectId: string; roomName: string; formData: FormData }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if(!api) throw new Error("can't make the call")
      return await createQualityCheckItemApi(projectId, roomName, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkup", projectId] });
    },
  });
};

// === EDIT ===
export const useEditQualityCheckItem = () => {
  const allowedRoles = ["owner", "CTO", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomName,
      itemId,
      formData,
    }: {
      projectId: string;
      roomName: string;
      itemId: string;
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if(!api) throw new Error("can't make the call")

      return await editQualityCheckItemApi(projectId, roomName, itemId, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkup", projectId] });
    },
  });
};

// === DELETE ===
export const useDeleteQualityCheckItem = () => {
  const allowedRoles = ["owner", "CTO", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomName,
      itemId,
    }: {
      projectId: string;
      roomName: string;
      itemId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if(!api) throw new Error("can't make the call")

      return await deleteQualityCheckItemApi(projectId, roomName, itemId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["quality-checkup", projectId] });
    },
  });
};

// === GET ALL ===
export const useGetQualityCheckup = (projectId: string) => {
  const allowedRoles = ["owner", "CTO", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["quality-checkup", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if(!api) throw new Error("can't make the call")

      return await getQualityCheckupApi(projectId, api);
    },
    enabled: !!projectId,
  });
};

// === GET SINGLE ROOM ===
export const useGetQualityCheckRoomItems = (projectId: string, roomName: string) => {
  const allowedRoles = ["owner", "CTO", "staff", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["quality-checku
        p-room", projectId, roomName],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if(!api) throw new Error("can't make the call")

      return await getQualityCheckRoomItemsApi(projectId, roomName, api);
    },
   enabled: !!projectId && !!roomName,
  });
};