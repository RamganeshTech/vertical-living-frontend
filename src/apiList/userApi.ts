import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../apiService/apiService";
import { queryClient } from "../QueryClient/queryClient";

type CreateUserParams = {
    email: string;
    password: string;
    userName: string;
    phoneNo: string;
};

type LoginUserParams = {
    email: string;
    password: string;
};

type ForgotPasswordParams = {
    email: string;
};

type ResetPasswordParams = {
    token: string;
    password: string;
};


const createUser = async ({ email, password, userName, phoneNo }: CreateUserParams) => {
    try {
        const payload = {
            email,
            password,
            username: userName, // 👈 here we rename it for backend
            phoneNo
        };
        let { data } = await Api.post(`/auth/registeruser`, payload)

        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error;
    }
}

const loginUser = async ({ email, password }: LoginUserParams) => {
    try {
        let { data } = await Api.post(`/auth/login`, { email, password })
        console.log("data from login user", data)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error;
    }
}

const logOutUser = async () => {
    try {
        let { data } = await Api.post(`/auth/logout`)

        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error;
    }
}

const forgotPassworduser = async ({ email }: ForgotPasswordParams) => {
    try {
        let { data } = await Api.post(`/auth/forgotpassword`, { email })

        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error;
    }
}

const resetPasswordUser = async ({ token, password }: ResetPasswordParams) => {
    try {
        let { data } = await Api.post(`/auth/resetpassword`, { token, password })

        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error;
    }
}



const inviteWorkerByOwner = async (payload: { projectId: string; specifiedRole: string }) => {
  const { data } = await Api.post("/owner/inviteworker", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getWorkersByProjectAsOwner = async (projectId: string) => {
  const { data } = await Api.get(`/owner/getworker/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const removeWorkerAsOwner = async ({ workerId, projectId }: { workerId: string; projectId: string }) => {
  const { data } = await Api.put(`/owner/removeworker/${workerId}/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useCreateUser = () => {
    return useMutation({
        mutationFn: createUser,
    })
}



export const useLoginUser = () => {
    return useMutation({
        mutationFn: loginUser,
    })
}

export const useLogoutUser = () => {
    return useMutation({
        mutationFn: logOutUser,
    })
}


export const useforgotPasswordUser = () => {
    return useMutation({
        mutationFn: forgotPassworduser
    })
}



export const useResetPasswordUser = () => {
    return useMutation({
        mutationFn: resetPasswordUser
    })
}



export const useInviteWorkerByOwner = () => useMutation({ mutationFn: inviteWorkerByOwner });

export const useGetWorkersAsOwner = (projectId: string) =>
  useQuery({
    queryKey: ["workers", projectId],
    queryFn: () => getWorkersByProjectAsOwner(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useRemoveWorkerAsOwner = () =>
  useMutation({
    mutationFn: removeWorkerAsOwner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });
