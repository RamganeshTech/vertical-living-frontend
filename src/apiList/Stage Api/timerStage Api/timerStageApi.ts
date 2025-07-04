import { type AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";

/**
 * POST /api/starttimer/start/:stageName/:projectId
 */
export const startStageTimerApi = async ({
  stageName,
  projectId,
  api,
  startedAt, // optional — for when you want to send a specific date-time
}: {
  stageName: string;
  projectId: string;
  api: AxiosInstance;
  startedAt?: string; // ISO string, optional
}) => {
  const body = startedAt ? { startedAt } : {};
  const { data } = await api.post(`/starttimer/start/${stageName}/${projectId}`, body);

  if (!data.ok) throw new Error(data.message);
  return data.data; // or return full data if you prefer
};




export const useStartStageTimer = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stageName,
      projectId,
      startedAt, // optional
    }: {
      stageName: string;
      projectId: string;
      startedAt?: string; // send if user picks date-time
    }) => {
      if (!role || !allowedRoles.includes(role)) {
        throw new Error("Not allowed to start timer.");
      }
      if (!api) {
        throw new Error("API instance missing.");
      }

      return await startStageTimerApi({ stageName, projectId, api, startedAt });
    },

    onSuccess: (_, vars) => {
      // Optionally invalidate stage details if you have them in the cache
      queryClient.invalidateQueries({ queryKey: ["stage", vars.stageName, vars.projectId] });
    },
  });
};
