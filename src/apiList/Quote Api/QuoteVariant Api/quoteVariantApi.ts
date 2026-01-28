import { useMutation, useQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import { getApiForRole } from "../../../utils/roleCheck";
import useGetRole from "../../../Hooks/useGetRole";
import { queryClient } from "../../../QueryClient/queryClient";



export const getMaterialQuoteSingleEntry = async ({
    api,
    organizationId,
    id,
}: {
    api: AxiosInstance;
    organizationId: string;
    id: string,
}) => {
    const { data } = await api.get(`quote/quotegenerate/getquotesingle/${organizationId}/${id}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};



export const getMaterialQuoteEntries = async ({
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
    const { data } = await api.get(`quote/quotegenerate/getquotes/${organizationId}`, {
        params: filters,
    });
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};



export const getPdfQuotes = async ({
    api,
    projectId,
}: {
    api: AxiosInstance;
    projectId: string;

}) => {
    const { data } = await api.get(`quote/quotegenerate/getquotepdf/quote/${projectId}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};



export const deleteQuote = async ({
    api,
    id
}: {
    api: AxiosInstance;
    id: string;
}) => {
    const { data } = await api.delete(`quote/quotegenerate/deletequote/${id}`);
    if (!data.ok) throw new Error(data?.message || "Failed to delete materials");
    return data.data;
};



const generatePdf = async ({ api, quoteId, data }: { api: AxiosInstance, quoteId: string, data: any }) => {
    const res = await api.post(`quote/quotegenerate/generatepdf/${quoteId}/create`, data);
    console.log("res form api", res.data)
    if (!res?.data.ok) throw new Error(res?.data?.message || "Failed to delete materials");
    return res?.data.data;
}


const generateClientPdf = async ({ api, quoteId, type, projectId, isBlurred, quoteType }: { api: AxiosInstance, quoteId: string, type: string, projectId:string , isBlurred:boolean, quoteType:string}) => {
    const res = await api.put(`quote/quotegenerate/clientquote/generatepdf/${projectId}/${quoteId}`, {type, isBlurred, quoteType});
    console.log("res form api", res.data)
    if (!res?.data.ok) throw new Error(res?.data?.message || "Failed to generate pdf");
    return res?.data.data;
}


export const useGetMaterialQuoteSingleEntry = (organizationId: string, id: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["quote-variant-single", organizationId, id],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getMaterialQuoteSingleEntry({ api, organizationId, id })
        },
        enabled: !!organizationId,
    });
};


//  used in btoh intenal quote and in the quote variant
export const useGetMaterialQuoteEntries = (organizationId: string, filters: {
    createdAt?: string;
    projectId?: string;
    quoteNo?: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["quote-material-items", organizationId, filters],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getMaterialQuoteEntries({ api, organizationId, filters })
        },
        enabled: !!organizationId,
    });
};





export const useGetPdfQuotes = (projectId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["quote-pdfs", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getPdfQuotes({ api, projectId })
        },
        enabled: !!projectId,
    });
};


export const getMaterialBrand = async ({
    api,
    organizationId,
    categoryName
}: {
    api: AxiosInstance;
    organizationId: string;
    categoryName: string
}) => {
    const { data } = await api.get(`quote/quotegenerate/getmaterials/${organizationId}/${categoryName}`);
    if (!data.ok) throw new Error(data?.message || "Failed to fetch materials");
    return data.data;
};





export const useGetMaterialBrands = (organizationId: string, categoryName: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["quote-brand", organizationId, categoryName],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");
            console.log("categrouName", categoryName)

            return await getMaterialBrand({ api, organizationId, categoryName })
        },
        enabled: !!organizationId,
    });
};


export const useDeleteQuote = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ id }: { organizationId: string, id: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await deleteQuote({ api, id });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};



export const useGenerateQuotePdf = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, data }: { organizationId: string, quoteId: string, data: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await generatePdf({ api, quoteId, data });
        },
        onSuccess: (_, { organizationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};





export const useGenerateClientQuotePdf = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, projectId, type, isBlurred, quoteType }: {  quoteId: string, projectId: string, type: string , isBlurred:boolean, quoteType:string}) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await generateClientPdf({ api, quoteId, projectId, type, isBlurred, quoteType });
        },
        // onSuccess: (_, { organizationId }) => {
        //     queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        // },
    });
};
