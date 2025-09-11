import { useMutation, useQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import { getApiForRole } from "../../../utils/roleCheck";
import useGetRole from "../../../Hooks/useGetRole";

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
        // onSuccess: (_, { organizationId }) => {
        //   // Optionally invalidate query cache if needed
        //   queryClient.invalidateQueries({ queryKey: ["quotes", organizationId] });
        // },
    });
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


