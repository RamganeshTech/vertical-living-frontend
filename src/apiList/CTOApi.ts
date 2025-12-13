import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../QueryClient/queryClient";
import CTOApi from "../apiService/CTOService";


// 1) loginStaff
const loginCTO = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await CTOApi.post("/auth/CTO/login", { email, password });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};
export const useLoginCTO = () => {
    return useMutation({
        mutationFn: loginCTO,
        onSuccess: () => {
            // invalidate or refetch user-profile queries if you have them
            queryClient.invalidateQueries({ queryKey: ["CTOProfile"] });
        },
    });
};

// 2) registerStaff
const registerCTO = async (payload: {
    invite: string;
    email: string;
    password: string;
    phoneNo: string;
    CTOName: string;
}) => {
    const { data } = await CTOApi.post("/auth/CTO/registerCTO", payload);
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useRegisterCTO = () => {
    return useMutation({
        mutationFn: registerCTO,
    });
};

// 3) logoutStaff
const logoutCTO = async () => {
    const { data } = await CTOApi.post("/auth/CTO/logout");
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useLogoutCTO = () => {
    return useMutation({
        mutationFn: logoutCTO,
        onSuccess: () => {
            queryClient.clear(); // or just invalidate all cto-related queries
        },
    });
};







  
const forgotPassworduser = async ({ email }: { email: string}) => {
  try {
    let { data } = await CTOApi.post(`/auth/CTO/forgotpassword`, { email })

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
    let { data } = await CTOApi.post(`/auth/CTO/resetpassword`, { token, password })

    if (data.ok) {
      return data.data
    }
  }
  catch (error) {
    throw error;
  }
}


export const useCTOforgotPasswordUser = () => {
 
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
     
      return await forgotPassworduser({ email })
    }

  })
}


export const useCTOResetPasswordUser = () => {

  return useMutation({
    mutationFn: async ({ token, password }: { token: string, password:string }) => {
    
      return await resetPasswordUser({ token , password })
    }
  })
}