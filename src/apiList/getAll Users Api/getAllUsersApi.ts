import { useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import type { AxiosInstance } from "axios";

export const getUsersApi  = async (
  organizationId: string,
  role: string,
  api: AxiosInstance
) => {
  const res = await api.get(`/getusers/${organizationId}/${role}`);
  return res.data.data;
};


export const useGetAllUsers = (organizationId: string, roleToFetch: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];

  return useQuery({
    queryKey: ["get-users", organizationId, roleToFetch],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return await getUsersApi(organizationId, roleToFetch, api);
    },
    // enabled: !!organizationId && !!roleToFetch,
    retry:false,
    refetchOnMount:false,
  });
};
