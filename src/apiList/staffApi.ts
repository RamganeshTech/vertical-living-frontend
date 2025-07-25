import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../QueryClient/queryClient";
import staffApi from "../apiService/staffApiservice";


// 1) loginStaff
const loginStaff = async ({ email, password }: { email: string; password: string }) => {
  const { data } = await staffApi.post("/auth/staff/login", { email, password });
  if (!data.ok) throw new Error(data.message);
  return data;
};
export const useLoginStaff = () => {
  return useMutation({
    mutationFn: loginStaff,
    onSuccess: () => {
      // invalidate or refetch user-profile queries if you have them
      queryClient.invalidateQueries({ queryKey: ["staffProfile"] });
    },
  });
};

// 2) registerStaff
const registerStaff = async (payload: {
  invite: string;
  email: string;
  password: string;
  phoneNo: string;
  staffName: string;
}) => {
  const { data } = await staffApi.post("/auth/staff/registerstaff", payload);
  if (!data.ok) throw new Error(data.message);
  return data;
};
export const useRegisterStaff = () => {
  return useMutation({
    mutationFn: registerStaff,
  });
};

// 3) logoutStaff
const logoutStaff = async () => {
  const { data } = await staffApi.post("/auth/staff/logout");
  if (!data.ok) throw new Error(data.message);
  return data;
};
export const useLogoutStaff = () => {
  return useMutation({
    mutationFn: logoutStaff,
    onSuccess: () => {
      queryClient.clear(); // or just invalidate all staff-related queries
    },
  });
};








const forgotPassworduser = async ({ email }: { email: string}) => {
  try {
    let { data } = await staffApi.post(`/auth/staff/forgotpassword`, { email })

    if (data.ok) {
      return data.data
    }
  }
  catch (error) {
    throw error;
  }
}

const resetPasswordUser = async ({ token, password }: {
  token: string;
  password: string;
}) => {
  try {
    let { data } = await staffApi.post(`/auth/staff/resetpassword`, { token, password })

    if (data.ok) {
      return data.data
    }
  }
  catch (error) {
    throw error;
  }
}


export const useStaffforgotPasswordUser = () => {
 ;
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
    

      return await forgotPassworduser({ email })
    }

  })
}


export const useStaffResetPasswordUser = () => {

   
  return useMutation({
    mutationFn: async ({ token, password }: { token: string, password:string }) => {
     
      return await resetPasswordUser({ token , password })
    }
  })
}
