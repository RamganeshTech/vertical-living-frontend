// apis/documentationApis.ts
import { type AxiosInstance } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";



export interface DocumentStage {
  stageNumber: string,
  description: string,
  uploadedFiles: {
    url: string,
    originalName: string
  }[]
}



export interface UploadFileType {
  url: string,
  type: string,
  originalName: string,
  _id?: string
}

// Create or update stage documentation
const createStageDocumentationApi = async (
  projectId: string,
  formData: DocumentStage,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/documentation/${projectId}/create`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Get all documentation details
const getAllStageDocumentationApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/documentation/${projectId}/getalldetails`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Get documentation for a single stage
const getSingleStageDocumentationApi = async (
  projectId: string,
  stageNumber: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/documentation/${projectId}/stage/${stageNumber}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const uploadFilesToStageApi = async (
  projectId: string,
  stageNumber: string,
  files: File[],
  api: AxiosInstance
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await api.post(`/documentation/${projectId}/${stageNumber}/upload`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const deleteStageFileApi = async (
  projectId: string,
  stageNumber: string,
  fileId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/documentation/${projectId}/${stageNumber}/file/${fileId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const updateStageDescriptionApi = async (
  projectId: string,
  stageNumber: string,
  description: string,
  api: AxiosInstance
) => {
  const { data } = await api.patch(
    `/documentation/${projectId}/${stageNumber}/description`,
    { description }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



// Create or update documentation
export const useCreateStageDocumentation = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      formData
    }: {
      projectId: string;
      formData: DocumentStage;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await createStageDocumentationApi(projectId, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["stage-documentation", projectId] });
    },
  });
};

// Get all documentation
export const useGetAllStageDocumentation = (projectId: string) => {
  const allowedRoles = ["owner", "CTO", "staff", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["stage-documentation", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await getAllStageDocumentationApi(projectId, api);
    },
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};

// Get documentation by stage
export const useGetSingleStageDocumentation = (
  {
    projectId,
    stageNumber
  }: {
    projectId: string,
    stageNumber: string
  }
) => {
  const allowedRoles = ["owner", "CTO", "staff", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["stage-documentation", projectId, stageNumber],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await getSingleStageDocumentationApi(projectId, stageNumber, api);
    },
    enabled: !!role && !!projectId && stageNumber !== undefined && !!api,
    retry: false,
    refetchOnMount: false,
  });
};





export const useUploadFilesToStage = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      stageNumber,
      files
    }: {
      projectId: string;
      stageNumber: string;
      files: File[];
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API not found.");
      return await uploadFilesToStageApi(projectId, stageNumber, files, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["stage-documentation", projectId] });
    },
  });
};



export const useDeleteStageFile = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      stageNumber,
      fileId
    }: {
      projectId: string;
      stageNumber: string;
      fileId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API not found.");
      return await deleteStageFileApi(projectId, stageNumber, fileId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["stage-documentation", projectId] });
    },
  });
};



export const useUpdateStageDescription = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      stageNumber,
      description
    }: {
      projectId: string;
      stageNumber: string;
      description: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API not found.");
      return await updateStageDescriptionApi(projectId, stageNumber, description, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["stage-documentation", projectId] });
    },
  });
};








// Get all documentation details
const getClientByProject = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/documentation/getclient/${projectId}/byproject`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Get all clients by project
export const useGetClientByProject = (projectId: string) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["stage-documentation-client", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await getClientByProject(projectId, api);
    },
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};




// Get all documentation details
const getDocMessageForWhatsapp = async (
  projectId: string,
  stageNumber: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/documentation/sharemessage/${projectId}/${stageNumber}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// Get all clients by project
export const useGetDocMessageForWhatsapp = ({ projectId, stageNumber }: { projectId: string, stageNumber: string }) => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["stage-documentation-message", projectId],
    queryFn: async () => {

      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");

      return await getDocMessageForWhatsapp(projectId, stageNumber, api);
    },
    enabled: !!projectId && !!stageNumber,
    retry: false,
    refetchOnMount: false,
  });
};


export const manuallyGenerateStagePdf = async (
  projectId: string,
  stageNumber: string,
  api: AxiosInstance
): Promise<string> => {
  const { data } = await api.put(`/documentation/updatedocument/${projectId}/${stageNumber}`);
  return data.data;
};

export const useManuallyGenerateStagePdf = () => {
  const allowedRoles = ["owner", "CTO", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId, stageNumber }: { projectId: string, stageNumber: string }) => {
    console.log("stageNumber", stageNumber)

      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call.");
      if (!api) throw new Error("API instance not found.");
      return await manuallyGenerateStagePdf(projectId, stageNumber, api);
    },
    onSuccess: (_, { projectId }) => {
      // queryClient.invalidateQueries({ queryKey: ["stage-documentation", projectId, stageNumber] });
      queryClient.invalidateQueries({ queryKey: ["stage-documentation-message", projectId] });
    },
  });
};