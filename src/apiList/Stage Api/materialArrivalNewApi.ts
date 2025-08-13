import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import axios from "axios";

// PUT /materialarrivalcheck/updateImage/:projectId/:fieldId
export const updateMaterialArrivalItemApi = async (
    projectId: string,
    fieldId: string,
    formData: FormData,
) => {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/updateImage/${projectId}/${fieldId}`, formData);
    return res.data;
};

export const useUpdateMaterialArrivalItemNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            fieldId,
            formData,
        }: {
            projectId: string;
            fieldId: string;
            formData: FormData;
        }) => {
            return await updateMaterialArrivalItemApi(projectId, fieldId, formData);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



// PUT /materialarrivalcheck/updateverification/:projectId/:fieldId
export const toggleMaterialVerificationApi = async (
    projectId: string,
    unitName: string,
    toggle:boolean,
    api: any
) => {
    const res = await api.put(`/materialarrivalcheck/updateverification/${projectId}/${unitName}`, {isVerified:toggle});
    return res.data;
};

export const useToggleMaterialVerification = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({
            projectId,
            unitName,
            toggle
        }: {
            projectId: string;
            unitName: string;
            toggle: boolean;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            return await toggleMaterialVerificationApi(projectId, unitName, toggle, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



// PUT /materialarrivalcheck/verifyall/:projectId
export const bulkToggleAllVerificationApi = async (
    projectId: string,
    api: any
) => {
    const res = await api.put(`/materialarrivalcheck/verifyall/${projectId}`);
    return res.data;
};

export const useBulkToggleAllVerification = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    const allowedRoles = ["owner", "staff", "CTO"]


    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            return await bulkToggleAllVerificationApi(projectId, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



// GET /materialarrivalcheck/getalldetails/:projectId
export const getAllMaterialArrivalDetailsApi = async (
    projectId: string,
    api: any
) => {
    const res = await api.get(`/materialarrivalcheck/getalldetails/${projectId}`);
    return res.data.data;
};

export const useGetAllMaterialArrivalDetailsNew = (projectId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"]

    return useQuery({
        queryKey: ["material-arrival", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            return await getAllMaterialArrivalDetailsApi(projectId, api);
        },
        enabled: !!projectId && !!role,
        retry: false,
        refetchOnMount: false,
    });
};





const generateMaterialArrivalLinkApi = async (projectId: string, api: any) => {
    const res = await api.post(`/materialarrivalcheck/${projectId}/generate-link`);
    return res.data.data;
};

const getPublicMaterialArrivalApi = async (
    projectId: string,
    token: string,
) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/public/${projectId}/${token}`);
    return res.data.data;
};



export const useGenerateMaterialArrivalLinkNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
            return await generateMaterialArrivalLinkApi(projectId, api);
        },
    });
};

export const useGetPublicMaterialArrivalNew = (projectId: string, token: string) => {
    return useQuery({
        queryKey: ["material-arrival-public", projectId, token],
        queryFn: async () => {
            return await getPublicMaterialArrivalApi(projectId, token)
        },
        enabled: !!projectId && !!token,
    });
};