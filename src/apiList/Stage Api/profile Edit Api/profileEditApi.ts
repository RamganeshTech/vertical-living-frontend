import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

export const updateProfile = async ({
  api,
  profileData,
}: {
  api: AxiosInstance;
  profileData: {
    name?: string;
    email?: string;
    phoneNo?: string;
  };
}) => {
  try {
    const { data } = await api.put("/profile/update-profile", profileData);
    if (data.ok) {
      return data;
    } else {
      throw new Error(data?.message || "Profile update failed.");
    }
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
};





export const useUpdateProfile = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  const allowedRoles = ["owner", "client", "staff", "CTO", "worker"];

  return useMutation({
    mutationFn: async ({
      name,
      email,
      phoneNo,
    }: {
      name?: string;
      email?: string;
      phoneNo?: string;
    }) => {
      if (!role) throw new Error("Not authorized.");
      if (!allowedRoles.includes(role)) throw new Error("Role not allowed.");
      if (!api) throw new Error("API not found.");

      return await updateProfile({ api, profileData: { name, email, phoneNo } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
