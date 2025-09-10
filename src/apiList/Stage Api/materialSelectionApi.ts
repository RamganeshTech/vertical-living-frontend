import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";



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


const getSingleRoomDetails = async ({
  projectId,
  roomId,
  packageId,
  // roomType,
  api,
}: {
  projectId: string;
  roomId: string;
  packageId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/materialconfirmation/${projectId}/singleroom/${packageId}/${roomId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// const updatePredefinedRoomFieldApi = async ({
//   projectId,
//   roomId,
//   fieldKey,
//   updates,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   fieldKey: string;
//   updates: {
//     quantity?: number;
//     unit?: string;
//     remarks?: string;
//   };
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/materialconfirmation/${projectId}/predefinedroom/${roomId}/field/${fieldKey}`, updates);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };



// const createCustomRoomApi = async ({
//   projectId,
//   name,
//   api,
// }: {
//   projectId: string;
//   name: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(`/materialconfirmation/${projectId}/customroom`, { name });
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };




const addOrUpdateItems = async ({
  projectId,
  roomId,
  packageId,
  fieldId,
  formData,
  api,
}: {
  projectId: string;
  roomId: string;
  packageId: string;
  formData: any;
  fieldId: string,
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/materialconfirmation/additems/${projectId}/${packageId}/${roomId}/${fieldId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const deleteRoomApi = async ({
  projectId,
  roomId,
  packageId,
  api,
}: {
  projectId: string;
  roomId: string;
  packageId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/materialconfirmation/${projectId}/${packageId}/${roomId}/deleteroom`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



// const addItemToCustomRoomApi = async ({
//   projectId,
//   roomId,
//   item,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   item: {
//     itemKey: string;
//     quantity: number;
//     unit: string;
//     remarks?: string;
//   };
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.post(`/materialconfirmation/${projectId}/customroom/${roomId}/field`, item);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };



// const deleteCustomRoomFieldApi = async ({
//   projectId,
//   roomId,
//   fieldKey,
//   api,
// }: {
//   projectId: string;
//   roomId: string;
//   fieldKey: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.delete(`/materialconfirmation/${projectId}/customroom/${roomId}/field/${fieldKey}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };





// ✅ 8. Upload Files
export const uploadFilesToRoomApi = async ({
  projectId,
  roomId,
  packageId,
  formData,
  api,
}: {
  projectId: string;
  roomId: string;
  packageId: string,
  formData: FormData;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/materialconfirmation/${projectId}/uploads/${packageId}/${roomId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const updateSelectedPackage = async (
  projectId: string,
  selectedPackage: string,
  api: any
) => {
  const res = await api.patch(`/materialconfirmation/updatepackage/${projectId}`, {selectedPackage});
  return res.data;
};


const deleteSubItemApi = async ({
  projectId,
  itemId,
  packageId,
  roomId,
  fieldId,
  api,
}: {
  projectId: string;
  itemId: string;
  packageId: string;
  roomId: string;
  fieldId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/materialconfirmation/deletesubitem/${projectId}/${packageId}/${roomId}/${itemId}/${fieldId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 9. Delete File
export const deleteFileFromRoomApi = async ({
  projectId,
  roomId,
  packageId,
  fileId,
  api,
}: {
  projectId: string;
  roomId: string;
  packageId: string,
  fileId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/materialconfirmation/${projectId}/deleteuploadedfile/${packageId}/${roomId}/${fileId}`);
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




const generatedPublicLink = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/materialconfirmation/generatepdfcomparison/${projectId}`);
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
  packageId,
  // roomType
}: {
  projectId: string;
  roomId: string;
  packageId: string
  // roomType: string;
}) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["material-room", projectId, roomId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance unavailable");
      return await getSingleRoomDetails({ projectId, packageId, roomId, api });
    },
    enabled: !!projectId && !!roomId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};


// export const useUpdateRoomField = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//       fieldKey,
//       updates,
//     }: {
//       projectId: string;
//       roomId: string;
//       fieldKey: string;
//       updates: { quantity?: number; unit?: string; remarks?: string };
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance not available");
//       return await updatePredefinedRoomFieldApi({ projectId, roomId, fieldKey, updates, api });
//     },
//     onSuccess: (_, { projectId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
//     },
//   });
// };



// export const useCreateCustomRoom = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ projectId, name }: { projectId: string; name: string }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance not available");
//       return await createCustomRoomApi({ projectId, name, api });
//     },
//     onSuccess: (_, { projectId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
//     },
//   });
// };



export const useAddOrUpdateMaterialItems = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomId, fieldId, packageId, formData }: { projectId: string; roomId: string, fieldId: string, packageId: string, formData: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await addOrUpdateItems({ projectId, roomId, fieldId, packageId, formData, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};




// ✅ Delete subitem
export const useDeleteSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      itemId,
      roomId,
      packageId,
      fieldId,
    }: {
      projectId: string;
     itemId:string,
     roomId: string,
      packageId:string,
      fieldId:string,
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await deleteSubItemApi({
        projectId,
        itemId,
        packageId,
        roomId,
        fieldId,
        api
      });
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
    mutationFn: async ({ projectId, roomId, packageId }: { projectId: string; roomId: string, packageId: string, }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance not available");
      return await deleteRoomApi({ projectId, roomId, packageId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};

// export const useAddItemToCustomRoom = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//       item,
//     }: {
//       projectId: string;
//       roomId: string;
//       item: { itemKey: string; quantity: number; unit: string; remarks?: string };
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance not available");
//       return await addItemToCustomRoomApi({ projectId, roomId, item, api });
//     },
//     onSuccess: (_, { projectId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
//     },
//   });
// };

// export const useDeleteCustomRoomField = () => {
//   const allowedRoles = ["owner", "staff", "CTO"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       roomId,
//       fieldKey,
//     }: {
//       projectId: string;
//       roomId: string;
//       fieldKey: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
//       if (!api) throw new Error("API instance not available");
//       return await deleteCustomRoomFieldApi({ projectId, roomId, fieldKey, api });
//     },
//     onSuccess: (_, { projectId }) => {
//       queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
//     },
//   });
// };





export const useUploadMaterialSelectionRoomFiles = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      packageId,
      formData,
    }: {
      projectId: string;
      roomId: string;
      packageId: string,
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await uploadFilesToRoomApi({ projectId, roomId, packageId, formData, api });
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
      packageId,
      fileId,
    }: {
      projectId: string;
      roomId: string;
      packageId: string;
      fileId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await deleteFileFromRoomApi({ projectId, roomId, fileId, packageId, api });
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
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};



export const useMaterialArrivalGeneratePdfComparisonLink = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generatedPublicLink({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};





export const useUpdateSelectedPackage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
     selectedPacakge
    }: {
      projectId: string;
      selectedPacakge: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized please login");
      return await updateSelectedPackage(projectId, selectedPacakge, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-confirmation", projectId] });
    },
  });
};