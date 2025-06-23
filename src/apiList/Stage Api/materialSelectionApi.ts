import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- API FUNCTIONS ---

// // ✅ 1. Get All Material Rooms
// const getAllMaterialRooms = async (
//   params: { projectId: string; api: AxiosInstance }
// ) => {
//     console.log("calling all mata api")
//   const { projectId, api } = params;
//   const { data } = await api.get(`/materialconfirmation/${projectId}`);
//   console.log("data form api", data)

//   if (!data.ok) throw new Error(data.message);

//   return data.data;
// };

// // ✅ 2. Get Specific Room by ID
// const getMaterialRoomById = async (
//   params: { projectId: string; roomId: string; api: AxiosInstance }
// ) => {
//     console.log("calling all single api by room idingle api")

//   const { projectId, roomId, api } = params;
//   const { data } = await api.get(`/materialconfirmation/${projectId}/room/${roomId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // ✅ 3. Create New Room
// const createMaterialRoom = async (
//   params: { projectId: string; roomName: string; api: AxiosInstance }
// ) => {
//   const { projectId, roomName, api } = params;
//   const { data } = await api.post(`/materialconfirmation/${projectId}/createroom`, { roomName });
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // ✅ 4. Create Modular Work
//  const createModularWorkApi = async ({
//   projectId,
//   roomId,
//   body,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   body: { workName: string; notes?: string; materials?: string[] };
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(`/materialconfirmation/${projectId}/creatematerial/${roomId}`, body);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // ✅ 5. Edit Modular Work
//  const editModularWorkApi = async ({
//   projectId,
//   roomId,
//   workId,
//   body,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   workId: string;
//   body: { workName?: string; notes?: string | null; materials?: string[] };
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/materialconfirmation/${projectId}/editmaterial/${roomId}/${workId}`, body);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // ✅ 6. Delete Modular Work
//  const deleteModularWorkApi = async ({
//   projectId,
//   roomId,
//   workId,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   workId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/materialconfirmation/${projectId}/deletematerial/${roomId}/${workId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };

// // ✅ 7. Delete Room
//  const deleteRoomApi = async ({
//   projectId,
//   roomId,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/materialconfirmation/${projectId}/deleteroom/${roomId}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };




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
  api,
}: {
  projectId: string;
  roomId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/materialconfirmation/${projectId}/predefinedroom/${roomId}`);
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
  deadLine,
  api,
}: {
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/materialconfirmation/deadline/${formId}`, deadLine);
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

// export const useGetAllMaterialRooms = ({projectId}:{projectId: string}) => {
//   const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["material-rooms", projectId],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed");
//       if (!api) throw new Error("API instance not found");
//       return await getAllMaterialRooms({ projectId, api });
//     },
//     enabled: !!projectId,
//     retry: false,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useGetMaterialRoomById = ({projectId, roomId}:{projectId: string, roomId: string}) => {
//   const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["material-room", projectId, roomId],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed");
//       if (!api) throw new Error("API instance not found");
//       return await getMaterialRoomById({ projectId, roomId, api });
//     },
//     enabled: !!projectId && !!roomId,
//     retry: false,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useCreateMaterialRoom = () => {
//   const allowedRoles = ["owner", "staff", "CTO", "client"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ projectId, roomName }: { projectId: string; roomName: string }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("not allowed");
//       if (!api) throw new Error("API instance not found");
//       return await createMaterialRoom({ projectId, roomName, api });
//     },
//     onSuccess: (_, { projectId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-rooms", projectId] });
//     },
//   });
// };

// export const useCreateModularWork = () => {
//   const allowedRoles = ["owner", "staff", "CTO", "client"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//       body,
//     }: {
//       projectId: string;
//       roomId: string;
//       body: { workName: string; notes?: string; materials?: string[] };
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized to create modular work");
//       if (!api) throw new Error("API instance not available for role");
//       return await createModularWorkApi({ projectId, roomId, body, api });
//     },
//     onSuccess: (_, { projectId, roomId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-room", projectId, roomId] });
//     },
//   });
// };

// export const useEditModularWork = () => {
//   const allowedRoles = ["owner", "staff", "CTO", "client"];
//   const { role } = useGetRole();
//   const api = getApiForRole("owner");
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//       workId,
//       body,
//     }: {
//       projectId: string;
//       roomId: string;
//       workId: string;
//       body: { workName?: string; notes?: string | null; materials?: string[] };
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized to edit modular work");
//       if (!api) throw new Error("API instance not available for role");
//       return await editModularWorkApi({ projectId, roomId, workId, body, api });
//     },
//     onSuccess: (_, { projectId, roomId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-room", projectId, roomId] });
//     },
//   });
// };

// export const useDeleteModularWork = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//       workId,
//     }: {
//       projectId: string;
//       roomId: string;
//       workId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized to delete modular work");
//       if (!api) throw new Error("API instance not available for role");
//       return await deleteModularWorkApi({ projectId, roomId, workId, api });
//     },
//     onSuccess: (_, { projectId, roomId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-room", projectId, roomId] });
//     },
//   });
// };

// export const useDeleteMaterialRoom = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//     }: {
//       projectId: string;
//       roomId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized to delete room");
//       if (!api) throw new Error("API instance not available for role");
//       return await deleteRoomApi({ projectId, roomId, api });
//     },
//     onSuccess: (_, { projectId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-rooms", projectId] });
//     },
//   });
// };







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
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSinglePredefinedRoom = ({
  projectId,
  roomId,
}: {
  projectId: string;
  roomId: string;
}) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["material-room", projectId, roomId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance unavailable");
      return await getSinglePredefinedRoomApi({ projectId, roomId, api });
    },
    enabled: !!projectId && !!roomId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
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





export const useUploadRoomFiles = () => {
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

export const useDeleteRoomFile = () => {
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
      deadLine,
    }: {
      formId: string;
      deadLine: string ;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await setMaterialDeadlineApi({ formId, deadLine, api });
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
