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
    console.log("staffId", staffId)
  const res = await api.put(`/assignstafftostage/${projectId}/${staffId}/${stageName}`);
  return res.data;
};


export const useAssignStaffToStage = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "CTO"];

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
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return assignStaffToStageApi(projectId, staffId, stageName, api);
    },
  });
};