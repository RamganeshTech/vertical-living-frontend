import { useMutation } from "@tanstack/react-query";
import Api from "../apiService/apiService";

type CreateUserParams = {
  email: string;
  password: string;
  username: string;
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


const createUser = async ({email, password, username, phoneNo}: CreateUserParams )=>{
    try{
        let {data} = await Api.post(`/auth/registeruser`, {email, password, username, phoneNo})

        if(data.ok){
            return data.data
        }
    }
    catch(error){
        throw error;
    }
}

const loginUser = async ({email, password}: LoginUserParams)=>{
    try{
        let {data} = await Api.post(`/auth/login`, {email, password})

        if(data.ok){
            return data.data
        }
    }
    catch(error){
        throw error;
    }
}

const logOutUser = async ()=>{
    try{
        let {data} = await Api.post(`/auth/logout`)

        if(data.ok){
            return data.data
        }
    }
    catch(error){
        throw error;
    }
}

const forgotPassworduser = async ({email}: ForgotPasswordParams)=>{
    try{
        let {data} = await Api.post(`/auth/forgotpassword`, {email})

        if(data.ok){
            return data.data
        }
    }
    catch(error){
        throw error;
    }
}

const resetPasswordUser = async ({token, password}: ResetPasswordParams)=>{
    try{
        let {data} = await Api.post(`/auth/resetpassword`, {token, password})

        if(data.ok){
            return data.data
        }
    }
    catch(error){
        throw error;
    }
}

export const useCreateUser = ()=>{
    return useMutation({
    mutationFn:createUser,
})
}



export const useLoginUser = ()=>{
    return useMutation({
    mutationFn:loginUser,
})
}

export const useLogoutUser = ()=>{
    return useMutation({
    mutationFn: logOutUser,
})
}


export const useforgotPasswordUser = ()=>{
    return useMutation({
        mutationFn: forgotPassworduser
    })
}



export const useResetPasswordUser = ()=>{
    return useMutation({
        mutationFn: resetPasswordUser
    })
}