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
    file?: File
  };
}) => {


  try {


    const formData = new FormData();
    if (profileData.name) formData.append("name", profileData.name);
    if (profileData.email) formData.append("email", profileData.email);
    if (profileData.phoneNo) formData.append("phoneNo", profileData.phoneNo);

    // Append the file (Make sure "profileImage" matches your backend Multer key!)
    if (profileData.file) formData.append("profileImage", profileData.file);

    const { data } = await api.put("/profile/update-profile", formData);
    if (data.ok) {
      return data;
    } else {
      throw new Error(data?.message || "Profile update failed.");
    }
  } catch (error) {
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
      file
    }: {
      name?: string;
      email?: string;
      phoneNo?: string;
      file?: File
    }) => {
      if (!role) throw new Error("Not authorized.");
      if (!allowedRoles.includes(role)) throw new Error("Role not allowed.");
      if (!api) throw new Error("API not found.");

      return await updateProfile({ api, profileData: { name, email, phoneNo, file} });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
