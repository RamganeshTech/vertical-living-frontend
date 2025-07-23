import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation } from "@tanstack/react-query";

// ✅ API function for assigning staff to a stage by name
export const assignStaffToStageApi = async (
  projectId: string,
  staffId: string,
  stageName: string,
  api: AxiosInstance
) => {
  const res = await api.put(`/assignstafftostage/${projectId}/${staffId}/${stageName}`);
  return res.data;
};


export const useAssignStaffToStage = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "CTO", "staff"];

  return useMutation({
    mutationFn: async ({
      projectId,
      staffId,
      stageName,
    }: {
      projectId: string;
      staffId: string;
      stageName: string;
    }) => {
      if(!role) throw new Error("Not Authorized")
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to Access this api");
      if (!api) throw new Error("API not found");
      return assignStaffToStageApi(projectId, staffId, stageName, api);
    },
  });
};