import type { AxiosInstance } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// === 1️⃣ UPLOAD ===
export const uploadProjectDeliveryFilesApi = async (
  projectId: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const { data } = await api.post(`/projectdelivery/${projectId}/upload`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUploadProjectDeliveryFiles = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "CTO", "staff"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: FormData }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API instance missing");
      return await uploadProjectDeliveryFilesApi(projectId, formData, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project-delivery", projectId] });
    },
  });
};

// === 2️⃣ DELETE FILE ===
export const deleteProjectDeliveryFileApi = async (
  projectId: string,
  fileId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/projectdelivery/${projectId}/upload/${fileId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteProjectDeliveryFile = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "CTO", "staff"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, fileId }: { projectId: string; fileId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API instance missing");
      return await deleteProjectDeliveryFileApi(projectId, fileId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project-delivery", projectId] });
    },
  });
};

// === 3️⃣ CLIENT CONFIRM ===
export const updateClientConfirmationApi = async (
  projectId: string,
  confirm: boolean,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/projectdelivery/${projectId}/client-confirmation`, { confirmed:confirm });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateClientConfirmation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["client"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      confirm,
    }: {
      projectId: string;
      confirm: boolean;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API instance missing");
      return await updateClientConfirmationApi(projectId, confirm, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project-delivery", projectId] });
    },
  });
};

// === 4️⃣ OWNER CONFIRM ===
export const updateOwnerConfirmationApi = async (
  projectId: string,
  confirm: boolean,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/projectdelivery/${projectId}/owner-confirmation`, { confirmed:confirm });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateOwnerConfirmation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      confirm,
    }: {
      projectId: string;
      confirm: boolean;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API instance missing");
      return await updateOwnerConfirmationApi(projectId, confirm, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project-delivery", projectId] });
    },
  });
};

// === 5️⃣ GET DETAILS ===
export const getProjectDeliveryDetailsApi = async (
  projectId: string,
  api: AxiosInstance
) => {
  const { data } = await api.get(`/projectdelivery/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useGetProjectDeliveryDetails = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "CTO", "client", "staff"];

  return useQuery({
    queryKey: ["project-delivery", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed.");
      if (!api) throw new Error("API instance missing");
      return await getProjectDeliveryDetailsApi(projectId, api);
    },
    enabled: !!projectId && !!role,
    retry:false,
    refetchOnMount:false
  });
};





// ✅ 10. Set Deadline
 const setprojectDeliveryDeadlineApi = async ({
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
  const { data } = await api.put(`/projectdelivery/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completeprojectDeliveryStageApi = async ({
  projectId,
  organizationId,
  api,
}: {
  projectId: string;
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/projectdelivery/completionstatus/${organizationId}/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useSetprojectDeliveryDeadline = () => {
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
      projectId: string;
      deadLine: string;

    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setprojectDeliveryDeadlineApi({ formId, projectId, deadLine, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-delivery"] });
    },
  });
};

export const useCompleteprojectDelivery = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId , organizationId}: { projectId: string, organizationId:string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeprojectDeliveryStageApi({ projectId, organizationId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project-delivery", projectId] });
       
    },
  });
};

