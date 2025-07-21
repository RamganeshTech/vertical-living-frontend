import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



const getMaterialConfirmationByProjectApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/materialconfirmation/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const getSinglePredefinedRoomApi = async ({
  projectId,
  roomId,
  roomType,
  api,
}: {
  projectId: string;
  roomId: string;
    roomType: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/materialconfirmation/${projectId}/predefinedroom/${roomId}/${roomType}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const updatePredefinedRoomFieldApi = async ({
  projectId,
  roomId,
  fieldKey,
  updates,
  api,
}: {
  projectId: string;
  roomId: string;
  fieldKey: string;
  updates: {
    quantity?: number;
    unit?: string;
    remarks?: string;
  };
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/materialconfirmation/${projectId}/predefinedroom/${roomId}/field/${fieldKey}`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const createCustomRoomApi = async ({
  projectId,
  name,
  api,
}: {
  projectId: string;
  name: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/materialconfirmation/${projectId}/customroom`, { name });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const deleteRoomApi = async ({
  projectId,
  roomId,
  api,
}: {
  projectId: string;
  roomId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/materialconfirmation/${projectId}/${roomId}/deleteroom`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const addItemToCustomRoomApi = async ({
  projectId,
  roomId,
  item,
  api,
}: {
  projectId: string;
  roomId: string;
  item: {
    itemKey: string;
    quantity: number;
    unit: string;
    remarks?: string;
  };
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/materialconfirmation/${projectId}/customroom/${roomId}/field`, item);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const deleteCustomRoomFieldApi = async ({
  projectId,
  roomId,
  fieldKey,
  api,
}: {
  projectId: string;
  roomId: string;
  fieldKey: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/materialconfirmation/${projectId}/customroom/${roomId}/field/${fieldKey}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};





// ✅ 8. Upload Files
export const uploadFilesToRoomApi = async ({
  projectId,
  roomId,
  formData,
  api,
}: {
  projectId: string;
  roomId: string;
  formData: FormData;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/materialconfirmation/${projectId}/uploads/${roomId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 9. Delete File
export const deleteFileFromRoomApi = async ({
  projectId,
  roomId,
  fileId,
  api,
}: {
  projectId: string;
  roomId: string;
  fileId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/materialconfirmation/${projectId}/deleteuploadedfile/${roomId}/${fileId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 10. Set Deadline
export const setMaterialDeadlineApi = async ({
  formId,
  projectId, deadLine, api }:
  {
    projectId: string,
    formId: string;
    deadLine: string;
    api: AxiosInstance;
  }) => {
  const { data } = await api.put(`/materialconfirmation/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
export const completeMaterialStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/materialconfirmation/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// --- REACT QUERY HOOKS ---


export const useGetMaterialConfirmationByProject = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["material-confirmation", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await getMaterialConfirmationByProjectApi({ projectId, api });
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useGetSinglePredefinedRoom = ({
  projectId,
  roomId,
  roomType
}: {
  projectId: string;
  roomId: string;
  roomType: string;
}) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["material-room", projectId, roomId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance unavailable");
      return await getSinglePredefinedRoomApi({ projectId, roomId, roomType, api });
    },
    enabled: !!projectId && !!roomId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};


export const useUpdateRoomField = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      fieldKey,
      updates,
    }: {
      projectId: string;
      roomId: string;
      fieldKey: string;
      updates: { quantity?: number; unit?: string; remarks?: string };
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await updatePredefinedRoomFieldApi({ projectId, roomId, fieldKey, updates, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};



export const useCreateCustomRoom = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, name }: { projectId: string; name: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await createCustomRoomApi({ projectId, name, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};




export const useDeleteMaterialSelectionRoom = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomId }: { projectId: string; roomId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await deleteRoomApi({ projectId, roomId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};

export const useAddItemToCustomRoom = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      item,
    }: {
      projectId: string;
      roomId: string;
      item: { itemKey: string; quantity: number; unit: string; remarks?: string };
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await addItemToCustomRoomApi({ projectId, roomId, item, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};

export const useDeleteCustomRoomField = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      fieldKey,
    }: {
      projectId: string;
      roomId: string;
      fieldKey: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await deleteCustomRoomFieldApi({ projectId, roomId, fieldKey, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};





export const useUploadMaterialSelectionRoomFiles = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      formData,
    }: {
      projectId: string;
      roomId: string;
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await uploadFilesToRoomApi({ projectId, roomId, formData, api });
    },
    onSuccess: (_, { projectId, roomId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-room", projectId, roomId] });
    },
  });
};

export const useDeleteMaterialSelectionRoomFile = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      fileId,
    }: {
      projectId: string;
      roomId: string;
      fileId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await deleteFileFromRoomApi({ projectId, roomId, fileId, api });
    },
    onSuccess: (_, { projectId, roomId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-room", projectId, roomId] });
    },
  });
};

export const useSetMaterialDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formId,
      projectId, deadLine }:
      {
        projectId: string,
        formId: string;
        deadLine: string;
      }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await setMaterialDeadlineApi({ formId, projectId, deadLine, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-rooms"] });
    },
  });
};

export const useCompleteMaterialStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await completeMaterialStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-rooms", projectId] });
    },
  });
};
