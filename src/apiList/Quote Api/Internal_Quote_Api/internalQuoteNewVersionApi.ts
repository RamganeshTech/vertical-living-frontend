import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import type { AxiosInstance } from "axios";
import { queryClient } from "../../../QueryClient/queryClient";

// services/internalQuoteApi.ts


const ALLOWED_ROLES = ["owner", "staff", "CTO"];



/**
 * 1. Create Main Internal Quote
 */
const createInternalQuote = async ({
    organizationId,
    projectId,
    mainQuoteName, quoteCategory,
    api
}: {
    organizationId: string;
    projectId: string;
    mainQuoteName: string, quoteCategory: string,
    api: AxiosInstance;
}) => {
    const { data } = await api.post(
        `/quote/quotegenerate/v1/createquote`,
        {
            organizationId,
            projectId,
            mainQuoteName, quoteCategory,
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

/**
 * 2. Update Main Internal Quote Metadata
 */
const updateInternalQuote = async ({
    projectId,
    id,
    mainQuoteName, quoteCategory,
    api
}: {
    projectId: string;
    id: string;
    mainQuoteName: string, quoteCategory: string,
    api: AxiosInstance;
}) => {
    const { data } = await api.put(
        `/quote/quotegenerate/v1/editquote/${id}`,
        {
            projectId,
            mainQuoteName, quoteCategory,
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const getSingleInternalQuote = async ({
    id,

    api
}: {

    id: string;

    api: AxiosInstance;
}) => {
    const { data } = await api.get(
        `/quote/quotegenerate/v1/getsingle/${id}`,

    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const addOrUpdateWorkItem = async ({
    quoteId,
    payload,
    api
}: {
    quoteId: string;
    payload: { workName: string; workId?: string };
    api: any;
}) => {
    const { data } = await api.post(
        `/quote/quotegenerate/v1/createworkitem/${quoteId}`,
        payload
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const upsertTemplateData = async ({
    quoteId,
    workId,
    payload,
    api
}: {
    quoteId: string;
    workId: string;
    payload: {
        workType: string,
        templateName: string;
        // templateData: any;
        // singleTotal: number;
        // templateId?: string
    };
    api: any;
}) => {
    const { data } = await api.put(
        `/quote/quotegenerate/v1/updatetemplate/${quoteId}/${workId}`,
        payload
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};




const patchTemplateFields = async ({
    quoteId,
    workId,
    templateId,
    payload,
    api
}: {
    quoteId: string;
    workId: string;
    templateId: string;
    payload: { templateData: any; singleTotal: number };
    api: AxiosInstance;
}) => {
    const { data } = await api.put(
        `/quote/quotegenerate/v1/updatetemplatedata/${quoteId}/${workId}/${templateId}`,
        payload
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const updateSubletData = async ({
    quoteId,
    workId,
    subletId,
    subLettingData,
    api
}: {
    quoteId: string;
    workId: string;
    subletId: string,
    subLettingData: any,
    api: AxiosInstance;
}) => {

    const { data } = await api.put(
        `/quote/quotegenerate/v1/updatesubletdata/${quoteId}/${workId}/${subletId}`,
        { subLettingData }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;

};



const renameWorkItem = async ({
    quoteId,
    workId,
    workName,
    api
}: {
    quoteId: string;
    workId: string;
    workName: string
    api: any;
}) => {
    const { data } = await api.put(`/quote/quotegenerate/v1/updateworkname/${quoteId}/${workId}`, { workName });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};





const deleteWork = async ({
    quoteId,
    workId,
    api
}: {
    quoteId: string;
    workId: string;
    api: any;
}) => {
    const { data } = await api.delete(`/quote/quotegenerate/v1/deletework/${quoteId}/${workId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

/**
 * API function for deleting a specific template
 */
const deleteTemplate = async ({
    quoteId,
    workId,
    templateId,
    type,
    api
}: {
    quoteId: string;
    workId: string;
    type: string;
    templateId: string;
    api: any;
}) => {
    const { data } = await api.delete(
        `/quote/quotegenerate/v1/deletetemplatework/${quoteId}/${workId}/${type}/${templateId}`
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const useCreateInternalQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const ALLOWED_ROLES = ["owner", "staff", "CTO"];
    return useMutation({
        mutationFn: async ({ organizationId, projectId, mainQuoteName, quoteCategory }: {
            organizationId: string;
            projectId: string;
            mainQuoteName: string; quoteCategory: string
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");

            return await createInternalQuote({ organizationId, projectId, mainQuoteName, quoteCategory, api });
        },
        onSuccess: (_, { organizationId }) => {
            // Invalidate queries for the list of quotes to refresh the UI
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};

/**
 * Hook: Edit Main Quote Metadata
 */
export const useUpdateInternalQuote = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    return useMutation({
        mutationFn: async ({ projectId, id, mainQuoteName, quoteCategory }: {
            organizationId: string;
            projectId: string;
            id: string;
            mainQuoteName: string; quoteCategory: string
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");

            return await updateInternalQuote({ projectId, id, mainQuoteName, quoteCategory, api });
        },
        onSuccess: (_, { organizationId }) => {
            // Update specific quote query and global list
            queryClient.invalidateQueries({ queryKey: ["quote-material-items", organizationId] });
        },
    });
};





export const useGetSingleInternalQuote = (organizationId: string, id: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["material-items", organizationId, id],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Not allowed to create quotes");
            if (!api) throw new Error("API instance for role not found");

            return await getSingleInternalQuote({ api, id })
        },
        enabled: !!organizationId && !!id,
    });
};




export const useAddWorkItem = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, payload }: {
            quoteId: string;
            payload: { workName: string; workId?: string }
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");
            return await addOrUpdateWorkItem({ quoteId, payload, api });
        },
        onSuccess: (data) => {
            // Refresh the specific quote document to show the new work in the sidebar
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });

        },
    });
};

export const useUpsertTemplateData = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, workId, payload }: {
            quoteId: string;
            workId: string;
            payload: {
                workType: string;
                templateName: string;
                // templateData: any;
                // singleTotal: number;
                // templateId?: string
            }
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");
            return await upsertTemplateData({ quoteId, workId, payload, api });
        },
        onSuccess: (data) => {
            // Invalidate the specific quote to update totals and nested work status
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });
        },
    });
};



export const useUpdateTemplateFields = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async (params: {
            quoteId: string;
            workId: string;
            templateId: string;
            payload: { templateData: any; singleTotal: number }
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API not found");
            return await patchTemplateFields({ ...params, api });
        },
        onSuccess: (data) => {
            // Invalidate the single quote query to refresh totals in the header and sidebar
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });
        }
    });
};


export const useUpdateSubletFields = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, workId, subletId, subLettingData }: {
            quoteId: string;
            workId: string;
            subletId: string;
            subLettingData: any;
        }) => {

            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API not found");
            return await updateSubletData({ quoteId, workId, subletId, subLettingData, api })
        },
        onSuccess: (data) => {
            // Refresh the specific quote to update sidebar prices and grand totals
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });
        }
    });
};


export const useRenameWorkItem = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, workId, workName }: { quoteId: string; workId: string; workName: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");
            return await renameWorkItem({ quoteId, workId, workName, api })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });
        }
    });
};

export const useDeleteWorkItem = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, workId }: { quoteId: string; workId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");
            return await deleteWork({ quoteId, workId, api })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });
        }
    });
};






/**
 * Hook: Delete Specific Template Spec
 */
export const useDeleteTemplate = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ quoteId, workId, templateId, type }: {
            quoteId: string;
            workId: string;
            type: string;
            templateId: string
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) throw new Error("Unauthorized access");
            if (!api) throw new Error("API configuration missing");
            return await deleteTemplate({ quoteId, workId, templateId, api, type });
        },
        onSuccess: (data) => {
            // Refresh the quote query to update totals in sidebar and header
            queryClient.invalidateQueries({ queryKey: ["material-items", data.organizationId, data._id] });
        }
    });
};


