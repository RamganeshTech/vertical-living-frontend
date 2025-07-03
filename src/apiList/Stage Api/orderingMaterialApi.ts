import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import axios from "axios";

const allowedRoles = ["owner", "staff", "CTO"]


// ========== 1. UPDATE SHOP DETAILS ==========
const updateShopDetailsApi = async (
  projectId: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/orderingmaterial/${projectId}/shop`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateShopDetails = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, updates }: {projectId:string, updates:any}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update shop details");
      if (!api) throw new Error("API instance not available");
      return await updateShopDetailsApi(projectId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material", projectId] });
    },
  });
};

// ========== 2. UPDATE DELIVERY LOCATION ==========
const updateDeliveryLocationApi = async (
  projectId: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/orderingmaterial/${projectId}/delivery-location`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateDeliveryLocation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, updates }: {projectId:string, updates:any}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update delivery location");
      if (!api) throw new Error("API instance not available");
      return await updateDeliveryLocationApi(projectId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material", projectId] });
    },
  });
};

// ========== 3. UPDATE ROOM MATERIALS ==========
const updateRoomMaterialsApi = async (
  projectId: string,
  roomKey: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/orderingmaterial/${projectId}/room/${roomKey}`, {items:updates});
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateRoomMaterials = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomKey, updates }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update room materials");
      if (!api) throw new Error("API instance not available");
      return await updateRoomMaterialsApi(projectId, roomKey, updates, api);
    },
    onSuccess: (_, { projectId, roomKey }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material", projectId, roomKey] });
    },
  });
};

// ========== 4. DELETE ROOM MATERIAL ITEM ==========
const deleteRoomMaterialItemApi = async (
  projectId: string,
  roomKey: string,
  itemId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/orderingmaterial/${projectId}/room/${roomKey}/${itemId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteRoomMaterialItem = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomKey, itemId }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to delete item");
      if (!api) throw new Error("API instance not available");
      return await deleteRoomMaterialItemApi(projectId, roomKey, itemId, api);
    },
    onSuccess: (_, { projectId, roomKey }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material", projectId, roomKey] });
    },
  });
};

// ========== 5. GET ALL ORDERING MATERIAL DETAILS ==========
const getAllOrderingMaterialApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/orderingmaterial/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetAllOrderingMaterial = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["ordering-material", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch ordering material");
      if (!api) throw new Error("API not available");
      return await getAllOrderingMaterialApi(projectId, api);
    },
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};

// ========== 6. GET SPECIFIC ROOM MATERIALS ==========
const getRoomDetailsOrderMaterialsApi = async (
  projectId: string,
  roomKey: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/orderingmaterial/${projectId}/room/${roomKey}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetRoomDetailsOrderMaterials = (projectId: string, roomKey: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["ordering-material", projectId, roomKey],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch room materials");
      if (!api) throw new Error("API not available");
      return await getRoomDetailsOrderMaterialsApi(projectId, roomKey, api);
    },
    enabled: !!role && !!projectId && !!roomKey && !!api,
    retry: false,
    refetchOnMount: false,
  });
};


//  Generate Shareable Link
export const generateOrderingMaterialLinkApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/orderingmaterial/${projectId}/generate-link`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

//  Get Public Material Form by token
export const getOrderingMaterialPublicDetailsApi = async (
  projectId: string,
  token: string,
 
) => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orderingmaterial/public/${projectId}/${token}`);
  console.log(data)
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 1️⃣ Generate WhatsApp Share Link Hook

export const useGenerateOrderingMaterialLink = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) {
        throw new Error("Not allowed to generate link");
      }
      if (!api) throw new Error("API instance not found");
      return await generateOrderingMaterialLinkApi(projectId, api);
    },
  });
};

// 2️⃣ Public Token-based GET Hook (no auth role check needed here)
export const useGetOrderingMaterialPublicDetails = (
  projectId: string,
  token: string
) => {

  return useQuery({
    queryKey: ["ordering-material-public", projectId, token],
    queryFn: async () => {
      return await getOrderingMaterialPublicDetailsApi(projectId, token);
    },
    enabled: !!projectId && !!token,
    retry: false,
    refetchOnMount: false,
  });
};




// UPLOAD files
 const uploadorderingmaterialFilesApi = async (
  projectId: string,
  roomId: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/orderingmaterial/${projectId}/uploads/${roomId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// DELETE file
 const deleteorderingmaterialFileApi = async (
  projectId: string,
  roomId: string,
  fileId: string,
  api: AxiosInstance
) => {
  const { data } = await api.patch(`/orderingmaterial/${projectId}/deleteuploadedfile/${roomId}/${fileId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// ✅ 10. Set Deadline
 const setOrderMaterialDeadlineApi = async ({
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
 const completeOrderMaterialStageApi = async ({
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



// =============================
// ✅ React Query Hook Group
// =============================




export const useUploadOrderMaterialFiles = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomId, formData }: any) => {

      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

      if (!api) throw new Error("API instance not found for role");
       return await uploadorderingmaterialFilesApi(projectId, roomId, formData, api);
    },
    onSuccess: (_, { projectId, roomId }) => {
      queryClient.invalidateQueries({  queryKey: ["ordering-material", projectId, roomId]  });
    },
  });
};

export const useDeleteOrderMaterialFile = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomId, fileId }: any) => {

      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

      if (!api) throw new Error("API instance not found for role"); return await deleteorderingmaterialFileApi(projectId, roomId, fileId, api);
    },
    onSuccess: (_, { projectId, roomId }) => {
      queryClient.invalidateQueries({  queryKey: ["ordering-material", projectId, roomId]  });
    },
  });
};



// 


export const useSetOrderingMaterialDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formId,
    projectId,  deadLine,
   }: {  projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setOrderMaterialDeadlineApi({ formId, projectId, deadLine, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({queryKey: ["ordering-material", vars.formId] });
    },
  });
};

export const useCompleteOrderingMaterialStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeOrderMaterialStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({queryKey: ["ordering-material", projectId]});
    },
  });
};