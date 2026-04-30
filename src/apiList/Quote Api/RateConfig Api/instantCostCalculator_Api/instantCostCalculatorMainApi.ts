// Hooks/useInstantCostMainHooks.ts
import { useQuery, useMutation } from "@tanstack/react-query";


import { type AxiosInstance } from "axios";
import useGetRole from "../../../../Hooks/useGetRole";
import { getApiForRole } from "../../../../utils/roleCheck";
import { queryClient } from "../../../../QueryClient/queryClient";

const allowedRoles = ["owner", "CTO", "staff"];

// --- API Calls ---
export const getInstantCostMain = async (api: AxiosInstance, organizationId: string) => {
    const { data } = await api.get(`/quote/instantcostcalculator-main/getsingle/${organizationId}`);
    return data.data; // Returns the config object or null
};

export const upsertInstantCostMain = async (api: AxiosInstance, payload: any) => {
    const { data } = await api.post(`/quote/instantcostcalculator-main/upsert`, payload);
     if (!data.ok) throw new Error(data.message);
    return data;
};

// --- Hooks ---
export const useGetInstantCostMain = (organizationId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["instantCostMain", organizationId],
        // queryFn: () => getInstantCostMain(api, organizationId),
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
            if (!api) throw new Error("API instance not found for role");
            return await getInstantCostMain(api, organizationId)
        },
        enabled: !!organizationId && !!api,
    });
};

export const useUpsertInstantCostMain = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
         mutationFn: async (payload: any) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await upsertInstantCostMain(api, payload);
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["instantCostMain", variables.organizationId] });
        },
    });
};