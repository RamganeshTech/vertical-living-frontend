import { type AxiosInstance } from "axios";

import { useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

export const getProcurementAllLogs = async ({
  organizationId,
  api,
}: {
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/procurement/${organizationId}`);
  
  if (!data.ok) throw new Error(data.message || "Failed to fetch logs");
  return data.data.activeLog;
};

export const getProcurementLogsFiltered = async ({
  organizationId,
  projectId,
  stageId,
  api,
}: {
  organizationId: string;
  projectId?: string;
  stageId?: string;
  api: AxiosInstance;
}) => {
  // Build query params dynamically
  const params = new URLSearchParams();
  if (projectId) params.append("projectId", projectId);
  if (stageId) params.append("stageId", stageId);

  const { data } = await api.get(`/procurement/${organizationId}/filter?${params.toString()}`);
  if (!data.ok) throw new Error(data.message || "Failed to fetch filtered logs");
  return data.data;
};





export const useGetProcurementAllLogs = (organizationId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["procurementAllLogs", organizationId],
    queryFn: async () => {
      if (!api) throw new Error("API instance missing");
      return await getProcurementAllLogs({ organizationId, api });
    },
    enabled: !!organizationId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetProcurementLogsFiltered = ({
  organizationId,
  projectId,
  stageId,
}: {
  organizationId: string;
  projectId?: string;
  stageId?: string;
}) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["procurementLogsFiltered", organizationId, projectId, stageId],
    queryFn: async () => {
      if (!api) throw new Error("API instance missing");
      return await getProcurementLogsFiltered({ organizationId, projectId, stageId, api });
    },
    enabled: !!organizationId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};