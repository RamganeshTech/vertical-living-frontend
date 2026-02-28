import { useMutation } from "@tanstack/react-query";
import Api from "../apiService/apiService";


// 2. Types for Unified Auth
export type UserRole = 'owner' | 'staff' | 'worker' | 'CTO' | 'client';

export type CreateUserParams = {
    email: string;
    password: string;
    name: string; // Unified name field
    phoneNo?: string;
    invite: string;
    // role: UserRole; // User must specify role
    // organizationId?: string;
    // ownerId?: string; // Required for staff, worker, CTO
};


// type CreateUserParams = {
//     email: string;
//     password: string;
//     userName: string;
//     phoneNo: string;
// };

type LoginUserParams = {
    email: string;
    password: string;
};


export type ForgotPasswordParams = {
    email: string;
};

export type ResetPasswordParams = {
    token: string;
    password: string;
};



const createCommonUser = async (payload: CreateUserParams) => {
    try {
        // const payload = {
        //     email,
        //     password,
        //     username: userName, // 👈 here we rename it for backend
        //     phoneNo,
        //     role:"owner"
        // };
        let { data } = await Api.post(`/auth/v1/registeruser`, payload)

        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error;
    }
}

const loginCommonUser = async ({ email, password }: LoginUserParams) => {
    try {
        let { data } = await Api.post(`/auth/v1/login`, { email, password })
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error;
    }
}


const forgotCommonPassword = async ({ email }: ForgotPasswordParams) => {
    try {
        // Updated path to include /v1 to match your common route setup
        let { data } = await Api.post(`/auth/v1/forgotpassword`, { email });
        return data;
    } catch (error: any) {
        throw error?.response?.data || error;
    }
};

const resetCommonPassword = async ({ token, password }: ResetPasswordParams) => {
    try {
        // Updated path to include /v1
        let { data } = await Api.post(`/auth/v1/resetpassword`, { token, password });
        return data;
    } catch (error: any) {
        throw error?.response?.data || error;
    }
};




export const useCreateCommonUser = () => {
    return useMutation({
        mutationFn: createCommonUser,
    })
}



export const useLoginCommonUser = () => {
    return useMutation({
        mutationFn: loginCommonUser,
    })
}



export const useForgotCommonPassword = () => {
    return useMutation({
        mutationFn: forgotCommonPassword,
    });
};

export const useResetCommonPassword = () => {
    return useMutation({
        mutationFn: resetCommonPassword,
    });
};