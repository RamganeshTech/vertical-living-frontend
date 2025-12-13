import type { AxiosInstance } from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// === UPLOAD FILE(S) ===
export const uploadCleaningRoomFilesApi = async (
  projectId: string,
  roomId: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/cleaning/${projectId}/${roomId}/upload`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// === DELETE FILE ===
export const deleteCleaningRoomFileApi = async (
  projectId: string,
  roomId: string,
  fileId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/cleaning/${projectId}/${roomId}/${fileId}/file`);
  if (!data.ok) throw new Error(data.message);
  return data;
};


export const updateRoomNotesApi = async ({
  projectId,
  roomId,
  notes,
  api,
}: {
  projectId: string;
  roomId: string;
  notes: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/cleaning/${projectId}/room/${roomId}/notes`, { notes });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// === UPDATE CLEANING STATUS ===
export const updateCleaningRoomStatusApi = async (
  projectId: string,
  roomId: string,
  completelyCleaned: boolean,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/cleaning/${projectId}/${roomId}/cleaning-status`, {
    completelyCleaned,
  });
  if (!data.ok) throw new Error(data.message);
  return data;
};

// === GET ALL ===
export const getCleaningAndSanitationApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/cleaning/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// === GET SINGLE ROOM ===
export const getSingleCleaningRoomApi = async (
  projectId: string,
  roomId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/cleaning/${projectId}/${roomId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// Allowed roles
const allowedRoles = ["owner", "CTO", "staff"];

// === UPLOAD FILES ===
export const useUploadCleaningRoomFiles = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
const allowedRoles = ["owner", "CTO", "staff", "worker"];


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
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("No API instance available.");
      return await uploadCleaningRoomFilesApi(projectId, roomId, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-and-sanitation", projectId] });
    },
  });
};

// === DELETE FILE ===
export const useDeleteCleaningRoomFile = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();
const allowedRoles = ["owner", "CTO", "staff", "worker"];


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
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("No API instance available.");
      return await deleteCleaningRoomFileApi(projectId, roomId, fileId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-and-sanitation", projectId] });
    },
  });
};


export const useUpdateCleaningStageRoomNotes = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      notes,
    }: {
      projectId: string;
      roomId: string;
      notes: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Missing API instance");
      return await updateRoomNotesApi({ projectId, roomId, notes, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-and-sanitation", projectId] });
    },
  });
};

// === UPDATE CLEANING STATUS ===
export const useUpdateCleaningRoomStatus = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      roomId,
      completelyCleaned,
    }: {
      projectId: string;
      roomId: string;
      completelyCleaned: boolean;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("No API instance available.");
      return await updateCleaningRoomStatusApi(projectId, roomId, completelyCleaned, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-and-sanitation", projectId] });
    },
  });
};

// === GET ALL ===
export const useGetCleaningAndSanitation = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
const allowedRoles = ["owner", "CTO", "staff", "worker"];


  return useQuery({
    queryKey: ["cleaning-and-sanitation", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("No API instance available.");
      return await getCleaningAndSanitationApi(projectId, api);
    },
    enabled: !!projectId,
    retry:false,
    refetchOnMount:false
  });
};

// === GET SINGLE ROOM ===
export const useGetSingleCleaningRoom = (projectId: string, roomId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
const allowedRoles = ["owner", "CTO", "staff", "worker"];

  return useQuery({
    queryKey: ["cleaning-and-sanitation", projectId, roomId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("No API instance available.");
      return await getSingleCleaningRoomApi(projectId, roomId, api);
    },
    enabled: !!projectId && !!roomId,
    retry:false,
    refetchOnMount:false
  });
};









// ✅ 10. Set Deadline
 const setCleaningDeadlineApi = async ({
  formId,
  deadLine,
  projectId,
  api,
}: {
  formId: string;
  deadLine: string;
  projectId:string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/cleaning/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completeCleaningStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/cleaning/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useSetCleaningDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      formId,
      deadLine,
      projectId
    }: {
      formId: string;
      projectId: string
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setCleaningDeadlineApi({ formId, deadLine, projectId, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-and-sanitation"] });
    },
  });
};

export const useCompleteCleaningStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeCleaningStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-and-sanitation", projectId] });
      
    },
  });
};

