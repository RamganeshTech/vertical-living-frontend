import { type AxiosInstance } from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../Hooks/useGetRole";
import { getApiForRole } from "../utils/roleCheck";


export const saveRazorpay = async ({
    organizationId,
    payload,
    api
}: {
    organizationId: string;
    payload: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/razorpay/${organizationId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const getRazorpay = async ({
    organizationId,
    api
}: {
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/razorpay/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const deleteRazorpay = async ({
    organizationId,
    api
}: {
    organizationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/razorpay/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.message;
};


// ------------------ CREATE / UPDATE ------------------
export const useSaveRazorpay = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId, payload }: { organizationId: string; payload: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await saveRazorpay({ organizationId, payload, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["razorpay", organizationId] });
        }
    });
};

// ------------------ GET ------------------
export const useGetRazorpay = (organizationId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["razorpay", organizationId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getRazorpay({ organizationId, api });
        },
        enabled: !!organizationId
    });
};

// ------------------ DELETE ------------------
export const useDeleteRazorpay = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ organizationId }: { organizationId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteRazorpay({ organizationId, api });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["razorpay", organizationId] });
        }
    });
};

