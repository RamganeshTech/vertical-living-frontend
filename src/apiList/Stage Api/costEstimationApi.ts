// ---------------- API Functions ----------------

import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from './../../Hooks/useGetRole';
import type { EditLabourType } from "../../Pages/Stage Pages/Cost Estimation/LabourEstimate/LabourEstimateContainer";

// GET entire cost estimation data for a project
export const getCostEstimationByProjectApi = async (projectId: string, api: AxiosInstance) => {
  const { data } = await api.get(`/costestimation/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// GET single room estimation
export const getSingleRoomEstimationApi = async (projectId: string, roomId: string, api: AxiosInstance) => {
  const { data } = await api.get(`/costestimation/${projectId}/room/${roomId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const getLabourEstiamtionApi = async (projectId: string, api: AxiosInstance) => {
  const { data } = await api.get(`/costestimation/${projectId}/labour/getlabour`);
  console.log(data, "data form labour estiamtion")
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// PATCH material estimation
export const updateMaterialEstimationItemApi = async (
  projectId: string,
  materialKey: string,
  updates: {
    areaSqFt: number;
    predefinedRate: number;
    overriddenRate: number | null;
  },
  api: AxiosInstance
) => {
  const { data } = await api.patch(`/costestimation/${projectId}/material/${materialKey}`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// POST labour estimation
export const addLabourEstimationApi = async (
  projectId: string,
  labourData: any,
  api: AxiosInstance
) => {
  console.log("labordata", labourData )
  const { data } = await api.post(`/costestimation/${projectId}/labour`, labourData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// PATCH labour estimation
export const editLabourEstimationApi = async (
  projectId: string,
  labourId: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.patch(`/costestimation/${projectId}/labour/${labourId}`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// DELETE labour estimation
export const deleteLabourEstimationApi = async (
  projectId: string,
  labourId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/costestimation/${projectId}/labour/${labourId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// UPLOAD files
export const uploadCostEstimationFilesApi = async (
  projectId: string,
  roomId: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/costestimation/${projectId}/uploads/${roomId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// DELETE file
export const deleteCostEstimationFileApi = async (
  projectId: string,
  roomId: string,
  fileId: string,
  api: AxiosInstance
) => {
  const { data } = await api.patch(`/costestimation/${projectId}/deleteuploadedfile/${roomId}/${fileId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// ✅ 10. Set Deadline
export const setCostDeadlineApi = async ({
  formId,
  deadLine,
  api,
}: {
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/costestimation/deadline/${formId}`, {deadLine});
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
export const completeCostEstiamtionStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/costestimation/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ---------------- Custom Hooks ----------------

export const useGetCostEstimationByProject = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["cost-estimation", projectId],
    queryFn: () => getCostEstimationByProjectApi(projectId, api!),
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false
  });
};

export const useGetSingleRoomEstimation = (projectId: string, roomId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["cost-estimation", projectId, roomId],
    queryFn: () => getSingleRoomEstimationApi(projectId, roomId, api!),
    enabled: !!role && !!projectId && !!roomId && !!api,
    retry: false,
    refetchOnMount: false
  });
};

export const useUpdateMaterialEstimationItem = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, materialKey, updates }: any) => {
      if (!api) throw new Error("API not available");
      return await updateMaterialEstimationItemApi(projectId, materialKey, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cost-estimation", projectId] });
    },
  });
};

export const useGetLabourEstimation = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"]

  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["labourEstimatation", projectId],
    queryFn: async () => {

      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

      if (!api) throw new Error("API instance not found for role");

      return await getLabourEstiamtionApi(projectId, api!)
    },
    enabled: !!projectId,
    retry: false,
    refetchOnMount: false,
    staleTime: 0,
  });
};

export const useAddLabourEstimation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, labourData }: {projectId:string, labourData:EditLabourType}) => {
      if (!api) throw new Error("API not available");
      return await addLabourEstimationApi(projectId, labourData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["labourEstimatation", projectId] });
    },
  });
};

export const useEditLabourEstimation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, labourId, updates }: { projectId: string, labourId: string, updates: EditLabourType }) => {
      if (!api) throw new Error("API not available");
      return await editLabourEstimationApi(projectId, labourId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cost-estimation", projectId] });
    },
  });
};

export const useDeleteLabourEstimation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, labourId }: any) => {
      if (!api) throw new Error("API not available");
      return await deleteLabourEstimationApi(projectId, labourId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cost-estimation", projectId] });
    },
  });
};

export const useUploadCostEstimationFiles = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomId, formData }: any) => {
      if (!api) throw new Error("API not available");
      return await uploadCostEstimationFilesApi(projectId, roomId, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cost-estimation", projectId] });
    },
  });
};

export const useDeleteCostEstimationFile = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, roomId, fileId }: any) => {
      if (!api) throw new Error("API not available");
      return await deleteCostEstimationFileApi(projectId, roomId, fileId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["cost-estimation", projectId] });
    },
  });
};



// 


export const useSetCostEstimateDeadline = () => {
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
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
      if (!api) throw new Error("API instance missing");
      return await setCostDeadlineApi({ formId, deadLine, api });
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
      return await completeCostEstiamtionStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-rooms", projectId] });
    },
  });
};