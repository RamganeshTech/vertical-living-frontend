import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../QueryClient/queryClient";
import CTOApi from "../apiService/CTOService";


// 1) loginStaff
const loginCTO = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await CTOApi.post("/auth/CTO/login", { email, password });
    if (!data.ok) throw new Error(data.message);
    return data;
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