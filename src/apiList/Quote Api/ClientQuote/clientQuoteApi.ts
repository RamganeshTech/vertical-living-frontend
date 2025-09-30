import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getAllClientQuotes = async ({
    api,
    organizationId,
    filters,
}: {
    api: AxiosInstance;
    organizationId: string;
    filters: {
        createdAt?: string;
        projectId?: string;
        quoteNo?: string;
    };
}) => {
    const { data } = await api.get(`quote/quotegenerate/getallquotevarients/${organizationId}`, {
        params: filters,
    });
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};


export const getSingleClientQuote = async ({
    api,
    organizationId,
    id,
}: {
    api: AxiosInstance;
    organizationId: string;
    id: string,
}) => {
    const { data } = await api.get(`quote/quotegenerate/getsingleclientquote/${organizationId}/${id}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};



export const sendToPaymentStage = async ({
    api,
    organizationId,
    id,
}: {
    api: AxiosInstance;
    organizationId: string;
    id: string,
}) => {
    const { data } = await api.put(`quote/quotegenerate/storetopaymentstage/${organizationId}/${id}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};




export const toggleBlur = async ({
    api,
    organizationId,
    isBlured,
    id,
}: {
    api: AxiosInstance;
    organizationId: string;
    isBlured:boolean,
    id: string,
}) => {
    const { data } = await api.patch(`quote/quotegenerate/toggleblur/${organizationId}/${id}`, {isBlured});
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};

export const useGetAllClientQuotes = (organizationId: string, filters: {
    createdAt?: string;
    projectId?: string;
    quoteNo?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["clientquote", organizationId, filters],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getAllClientQuotes({ api, organizationId, filters })
        },
        enabled: !!organizationId,
    });
};




export const useGetSingleClientQuote = (organizationId: string, id: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["clientquote-single", organizationId, id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getSingleClientQuote({ api, organizationId, id })
        },
        enabled: !!organizationId,
    });
};




export const useSendQuoteToPaymentStage = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, id }: { organizationId: string, id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await sendToPaymentStage({ api, organizationId, id })
        },
    });
};




export const useToggleBlurring = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, id, isBlured }: { organizationId: string, id: string, isBlured:boolean }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await toggleBlur({ api, organizationId, id, isBlured })
        },
    });
};
