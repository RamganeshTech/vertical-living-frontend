// 🔁 Imports
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck"; 
import useGetRole from './../../Hooks/useGetRole';
import type { AxiosInstance } from "axios";
import axios from "axios";


const allowedRoles = ["owner", "staff", "CTO"]


// ✅ API Functions
export const updateMaterialArrivalShopApi = async (projectId: string, data: any, api: any) => {
  const res = await api.put(`/materialarrivalcheck/${projectId}/shop`, data);
  return res.data;
};

export const updateMaterialArrivalDeliveryApi = async (projectId: string, data: any, api: any) => {
  const res = await api.put(`/materialarrivalcheck/${projectId}/delivery-location`, data);
  return res.data;
};

export const updateMaterialArrivalRoomItemApi = async (
  projectId: string,
  roomKey: string,
  data: FormData,
  api: any
) => {
  const res = await api.put(`/materialarrivalcheck/${projectId}/room/${roomKey}`, data);
  return res.data;
};

export const deleteMaterialArrivalItemApi = async (
  projectId: string,
  roomKey: string,
  itemId: string,
  api: any
) => {
  const res = await api.delete(`/materialarrivalcheck/${projectId}/room/${roomKey}/${itemId}`);
  return res.data;
};

export const getAllMaterialArrivalApi = async (projectId: string, api: any) => {
  const res = await api.get(`/materialarrivalcheck/${projectId}`);
  return res.data.data;
};

export const getMaterialArrivalRoomDetailsApi = async (
  projectId: string,
  roomKey: string,
  api: any
) => {
  const res = await api.get(`/materialarrivalcheck/${projectId}/room/${roomKey}`);
  console.log("data form the get mateiralarrival room details",res.data.data)
  return res.data.data;
};

export const generateMaterialArrivalLinkApi = async (projectId: string, api: any) => {
  const res = await api.post(`/materialarrivalcheck/${projectId}/generate-link`);
  return res.data.data;
};

const getPublicMaterialArrivalApi = async (
  projectId: string,
  token: string,
) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/public/${projectId}/${token}`);
  return res.data.data;
};

// ✅ Custom Hooks

export const useGetMaterialArrivalDetails = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["material-arrival", projectId],
    queryFn: () => getAllMaterialArrivalApi(projectId, api),
    enabled: !!projectId && !!role && allowedRoles.includes(role),
  });
};

export const useGetSingleRoomMaterialArrival = (projectId: string, roomKey: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["material-arrival-room", projectId, roomKey],
    queryFn: () => getMaterialArrivalRoomDetailsApi(projectId, roomKey, api),
    enabled: !!projectId && !!roomKey && !!role && allowedRoles.includes(role),
  });
};

export const useUpdateMaterialArrivalShop = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: string; updates: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      return await updateMaterialArrivalShopApi(projectId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
    },
  });
};

export const useUpdateMaterialArrivalDelivery = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: string; updates: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      return await updateMaterialArrivalDeliveryApi(projectId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
    },
  });
};

export const useUpdateMaterialArrivalRoomItem = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      roomKey,
      formData,
    }: {
      projectId: string;
      roomKey: string;
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      return await updateMaterialArrivalRoomItemApi(projectId, roomKey, formData, api);
    },
    onSuccess: (_, { projectId, roomKey }) => {
      queryClient.invalidateQueries({ queryKey: ["material-arrival-room", projectId, roomKey] });
    },
  });
};

export const useDeleteMaterialArrivalItem = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      roomKey,
      itemId,
    }: {
      projectId: string;
      roomKey: string;
      itemId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      return await deleteMaterialArrivalItemApi(projectId, roomKey, itemId, api);
    },
    onSuccess: (_, { projectId, roomKey }) => {
      queryClient.invalidateQueries({ queryKey: ["material-arrival-room", projectId, roomKey] });
    },
  });
};

export const useGenerateMaterialArrivalLink = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      return await generateMaterialArrivalLinkApi(projectId, api);
    },
  });
};

export const useGetPublicMaterialArrival = (projectId: string, token: string) => {
  return useQuery({
    queryKey: ["material-arrival-public", projectId, token],
    queryFn: async () => {
     return await getPublicMaterialArrivalApi(projectId, token)
    },
    enabled: !!projectId && !!token,
  });
};






// COMMON API 
 const setMaterialArrivalDeadlineApi = async ({
  formId,
 projectId,  deadLine, api }:
  {  projectId: string,
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/orderingmaterial/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completeMaterialArrivalStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/orderingmaterial/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useSetMaterialArrivalDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formId,
     projectId,  deadLine,  }:
     {  projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setMaterialArrivalDeadlineApi({ formId, projectId,  deadLine, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({queryKey: ["ordering-material", vars.formId] });
    },
  });
};

export const useCompleteMaterialArrivalStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeMaterialArrivalStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({queryKey: ["ordering-material", projectId]});
    },
  });
};