import { useMutation } from "@tanstack/react-query";
import workerApi from "../apiService/workerApiService";

// ============ WORKER AUTH FUNCTIONS ============

const loginWorker = async (payload: { email: string; password: string,}) => {
  const { data } = await workerApi.post("/auth/worker/login", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const registerWorker = async ({
  invite,
  payload
}: {
  invite: string;
  payload: {
    email: string;
    password: string;
    phoneNo: string;
    workerName: string;
  };
}
) => {
  const { data } = await workerApi.post(`/auth/worker/registerworker?invite=${invite}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const logoutWorker = async () => {
  const { data } = await workerApi.post("/auth/worker/logout");
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// ============ HOOK EXPORTS ============

export const useLoginWorker = () =>
  useMutation({
    mutationFn: loginWorker,
  });

export const useRegisterWorker = () =>
  useMutation({
    mutationFn: registerWorker,
  });

export const useLogoutWorker = () =>
  useMutation({
    mutationFn: logoutWorker,
  });






  
const forgotPassworduser = async ({ email }: { email: string,  }) => {
  try {
    let { data } = await workerApi.post(`/auth/worker/forgotpassword`, { email })

    if (data.ok) {
      return data.data
    }
  }
  catch (error) {
    throw error;
  }
}

const resetPasswordUser = async ({ token, password,  }: {
  token: string;
  password: string;
}) => {
  try {
    let { data } = await workerApi.post(`/auth/worker/resetpassword`, { token, password })

    if (data.ok) {
      return data.data
    }
  }
  catch (error) {
    throw error;
  }
}


export const useWorkerforgotPasswordUser = () => {
 
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
     
      return await forgotPassworduser({ email })
    }

  })
}


export const useWorkerResetPasswordUser = () => {

  
  return useMutation({
    mutationFn: async ({ token, password }: { token: string, password:string }) => {
     
      return await resetPasswordUser({ token , password })
    }
  })
}
