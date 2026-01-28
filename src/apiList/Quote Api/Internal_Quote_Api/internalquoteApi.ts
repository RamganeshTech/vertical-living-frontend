import { useMutation, useQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import { getApiForRole } from "../../../utils/roleCheck";
import useGetRole from "../../../Hooks/useGetRole";
import { queryClient } from "../../../QueryClient/queryClient";

interface CreateQuotePayload {
    organizationId: string;
    projectId: string;
    formData: FormData;
}

interface UseCreateMaterialQuoteParams {
    organizationId: string;
    projectId: string;
    formData: FormData;
}




/**
 * 1. Create Main Internal Quote
 */
const createInternalMainQuote = async ({
    organizationId,
    projectId,
    mainQuoteName, quoteCategory,
    quoteType,
    api
}: {
    organizationId: string;
    projectId: string;
    quoteType: string,
    mainQuoteName: string, quoteCategory: string,
    api: AxiosInstance;
}) => {
    const { data } = await api.post(
        `/quote/quotegenerate/createmainquote`,
        {
            organizationId,
            projectId,
            mainQuoteName, quoteCategory,
            quoteType
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const updateInternalMainQuote = async ({
    id,
    projectId,
    mainQuoteName, quoteCategory,
    quoteType,
    api
}: {
    id: string;
    projectId: string;
    mainQuoteName: string,
    quoteCategory: string,
    quoteType: string,
    api: AxiosInstance;
}) => {
    const { data } = await api.put(
        `/quote/quotegenerate/updatemainquote/${id}`,
        {
            projectId,
            quoteType,
            mainQuoteName, quoteCategory,
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


export const createMaterialQuote = async ({
    api,
    organizationId,
    projectId,
    formData
}: CreateQuotePayload & { api: AxiosInstance }) => {
    const { data } = await api.post(`/quote/quotegenerate/createquote/${organizationId}/${projectId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    if (!data.ok) throw new Error(data.message || "Failed to create quote.");
    return data.data;
};



export const editMaterialQuote = async ({
    api,
    organizationId,
    id,
    projectId,
    formData
}: CreateQuotePayload & { api: AxiosInstance, id: string }) => {
    const res = await api.put(`/quote/quotegenerate/editquote/${organizationId}/${projectId}/${id}`, formData);

    if (!res.data.ok) throw new Error(res.data.message || "Failed to create quote.");
    return res.data.data;
};



export const updateSqftRateInternalQuote = async ({
    api,
    organizationId,
    id,
    formData
}: {
    api: AxiosInstance,
    organizationId?: string,
    formData: any, id: string
}) => {
    console.log("slkdfkl", "3873"+organizationId+"sdljfls")
    const res = await api.put(`/quote/quotegenerate/sqftrate/update/${id}`, formData);

    if (!res.data.ok) throw new Error(res.data.message || "Failed to create quote.");
    return res.data.data;
};


export const copyInternalQuote = async ({
    api,
    id,

}: { api: AxiosInstance, id: string }) => {
    const res = await api.put(`/quote/quotegenerate/copyquote/${id}`);

    if (!res.data.ok) throw new Error(res.data.message || "Failed to create quote.");
    return res.data.data;
};



export const getMaterialItemsByCategory = async ({
    api,
    organizationId,
    category,
}: {
    api: AxiosInstance;
    organizationId: string;
    category: string;
}) => {
    const { data } = await api.get(`/materials/${organizationId}/${category}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};



export const getSingleQuoteResidentialVersion = async ({
    api,
    id,
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.get(`/quote/quotegenerate/getsinglequote/${id}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};







export const useCreateInternalMainQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const ALLOWED_ROLES = ["owner", "staff", "CTO"];
    return useMutation({
        mutationFn: async ({ organizationId, projectId, mainQuoteName, quoteCategory, quoteType }: {
            organizationId: string;
            projectId: string;
            mainQuoteName: string; quoteCategory: string, quoteType: string
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");

            return await createInternalMainQuote({ organizationId, quoteType, projectId, mainQuoteName, quoteCategory, api });
        },
        onSuccess: (_, { organizationId }) => {
            // Invalidate queries for the list of quotes to refresh the UI
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};





export const useUpdateInternalMainQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const ALLOWED_ROLES = ["owner", "staff", "CTO"];
    return useMutation({
        mutationFn: async ({ organizationId, id, projectId, mainQuoteName, quoteType, quoteCategory }: {
            organizationId: string;
            id: string;
            projectId: string;
            mainQuoteName: string; quoteCategory: string,
            quoteType: string; 
        }) => {
            console.log("organizationId", "671763hdfhs"+organizationId.slice(5) + "sld;kjsdl")

            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");

            return await updateInternalMainQuote({ id, projectId, mainQuoteName, quoteCategory, quoteType, api });
        },
        onSuccess: (_, organizationId) => {
            // Invalidate queries for the list of quotes to refresh the UI
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
            // queryClient.invalidateQueries({ queryKey: ["material-items", organizationId, id],  });
        },
    });
};




export const useCreateMaterialQuote = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, projectId, formData }: UseCreateMaterialQuoteParams) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await createMaterialQuote({ api, organizationId, projectId, formData });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};


export const useEditMaterialQuote = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, projectId, formData, id }: {
            organizationId: string,
            projectId: string,
            formData: any, id: string
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await editMaterialQuote({ api, organizationId, projectId, formData, id });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};





export const useUpdateSqftInternalQuote = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ organizationId, formData, id }: {
            organizationId: string,
            projectId: string,
            formData: any, id: string
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await updateSqftRateInternalQuote({ api, organizationId, formData, id });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};







export const useGetMaterialItems = (organizationId: string, category: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["material-items", organizationId, category],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getMaterialItemsByCategory({ api, organizationId, category })
        },
        enabled: !!organizationId && !!category,
    });
};




export const useGetSingleInternalResidentialVersion = ({ organizationId, id }: { organizationId: string, id: string }) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["material-item", organizationId, id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getSingleQuoteResidentialVersion({ api, id })
        },
        enabled: !!organizationId && !!id,
    });
};








export const useCopyInternalQuote = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id }: { organizationId: string, id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await copyInternalQuote({ api, id });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};

