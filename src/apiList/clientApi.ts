import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../QueryClient/queryClient";
import clientApi from "../apiService/clientService";

// 1) loginclient
const loginClient = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await clientApi.post("/auth/client/login", { email, password });
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useLoginClient = () => {
    return useMutation({
        mutationFn: loginClient,
        onSuccess: () => {
            // invalidate or refetch user-profile queries if you have them
            queryClient.invalidateQueries({ queryKey: ["clientprofile"] });
        },
    });
};

// 2) registerclient
const registerClient = async ({ token, payload }: { token: string, payload: { email: string, password: string, phoneNo: string, clientName: string } }) => {
    const { data } = await clientApi.post(`/auth/client/registerclient?invite=${token}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useRegisterClient = () => {
    return useMutation({
        mutationFn: registerClient,
    });
};

// 3) logoutclient
const logoutClient = async () => {
    const { data } = await clientApi.post("/auth/client/logout");
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useLogoutClient = () => {
    return useMutation({
        mutationFn: logoutClient,
        onSuccess: () => {
            queryClient.clear(); // or just invalidate all client-related queries
        },
    });
};


// 2) update client
const updateClient = async ({ payload }: { payload: { phoneNo: string, clientName: string, location: string } }) => {
    const { data } = await clientApi.post(`/auth/client/updateclientinfo`, payload);
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useUpdateClient = () => {
    return useMutation({
        mutationFn: updateClient,
    });
};


