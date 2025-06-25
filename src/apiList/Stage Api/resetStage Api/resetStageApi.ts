// src/api/resetStages/resetStageApi.ts

import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useMutation } from "@tanstack/react-query";

export const resetStageApi = async ({
  projectId,
  stageNumber,
  stagePath,
  api,
}: {
  projectId: string;
  stageNumber: number;
  stagePath: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/reset/stage${stageNumber}/${stagePath}/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data;
};


// src/hooks/stages/useResetStage.ts

export const useResetStage = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["staff", "admin", "CTO"];

  return useMutation({
    mutationFn: async ({
      projectId,
      stageNumber,
      stagePath,
    }: {
      projectId: string;
      stageNumber: number;
      stagePath: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) {
        throw new Error("You are not authorized to reset this stage.");
      }

      if (!api) {
        throw new Error("API instance not available.");
      }

      return await resetStageApi({ projectId, stageNumber, stagePath, api });
    },
  });
};
