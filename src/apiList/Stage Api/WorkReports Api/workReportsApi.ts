import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";

// -------------------- API FUNCTIONS --------------------

// Create Work Report
const createWorkReportApi = async ({
  projectId,
  organizationId,
  payload,
  api,
}: {
  projectId: string;
  organizationId: string;
  payload: any; // replace with proper type if you have it
  api: AxiosInstance;
}) => {
  const { data } = await api.post(
    `/workreports/create/${projectId}/${organizationId}`,
    payload
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Get Work Reports by Project
const getWorkReportsByProjectIdApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/workreports/getreports/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getWorkReportImage  = async ({
  projectId,
  id,
  dailyTaskId,
  // date,
  api,
}: {
  projectId: string;
  id: string;
  dailyTaskId: string;
  // date: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/workreports/workimages/${projectId}/${id}/${dailyTaskId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Delete Work Report
const deleteWorkReportByIdApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/workreports/delete/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// -------------------- HOOKS --------------------

// Create Work Report Hook
export const useCreateWorkReport = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      organizationId,
      payload,
    }: {
      projectId: string;
      organizationId: string;
      payload: any;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await createWorkReportApi({ projectId, organizationId, payload, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["workreports", projectId] });
    },
  });
};

// Get Work Reports Hook
export const useGetWorkReportsByProjectId = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["workreports", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getWorkReportsByProjectIdApi({ projectId, api });
    },
    enabled: !!projectId && !!role,
  });
};

// Delete Work Report Hook
export const useDeleteWorkReportById = () => {
  const allowedRoles = ["owner", "staff", "CTO", ];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id }: { id: string; projectId: string }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteWorkReportByIdApi({ id, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["workreports", projectId] });
    },
  });
};




export const useGetWorkReportImages = (projectId: string, id:string,
  //  date:string,
    dailyTaskId:string) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["workreportimages", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");
      return await getWorkReportImage({ projectId, id, dailyTaskId,  api });
    },
    enabled: !!projectId && !!role,
  });
};