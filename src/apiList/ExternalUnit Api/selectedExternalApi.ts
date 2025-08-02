import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";
import type { SelectedExternalUnits } from "../../types/types";

// ✅ 1. ADD selected unit (POST /:projectId/addtoselected)
export const addSelectedExternalApi = async ({
    api,
    projectId,
    selectedUnit,
}: {
    api: AxiosInstance;
    projectId: string;
    selectedUnit: any;
}) => {
    const { data } = await api.post(`/selectedexternal/${projectId}/addtoselected`, {
        selectedUnit,
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useAddSelectedExternal = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            selectedUnit,
        }: {
            projectId: string;
            selectedUnit: any;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
            if (!api) throw new Error("API not available");
            return await addSelectedExternalApi({ api, projectId, selectedUnit });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["selected-external", projectId] });
        },
    });
};

// ✅ 2. GET selected units (GET /:projectId/getselected)
export const getSelectedExternalApi = async ({
    api,
    projectId,
}: {
    api: AxiosInstance;
    projectId: string;
}) => {
    const { data } = await api.get(`/selectedexternal/${projectId}/getselected`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useGetSelectedExternalUnits = (projectId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["selected-external", projectId],
        queryFn: async (): Promise<SelectedExternalUnits> => {
            if (!api) throw new Error("API not available");
            return await getSelectedExternalApi({ api, projectId });
        },
        enabled: !!projectId,
    });
};

// ✅ 3. DELETE selected unit (DELETE /:projectId/:unitId/deleteselected)
export const deleteSelectedExternalUnitApi = async ({
    api,
    projectId,
    unitId,
}: {
    api: AxiosInstance;
    projectId: string;
    unitId: string;
}) => {
    const { data } = await api.delete(`/selectedexternal/${projectId}/${unitId}/deleteselected`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useDeleteSelectedExternalUnit = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            unitId,
        }: {
            projectId: string;
            unitId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
            if (!api) throw new Error("API not available");
            return await deleteSelectedExternalUnitApi({ api, projectId, unitId });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["selected-external", projectId] });
        },
    });
};




export const updateSelectedExternalStatus = async ({
    projectId,
    api
}: {
    projectId: string;
    api: AxiosInstance
}) => {
    const res = await api.patch(`/selectedexternal/${projectId}/status`);
    return res.data.data;
};




export const useSelectedExternalUnitComplete = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
        }: {
            projectId: string;

        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not authorized");
            if (!api) throw new Error("API not available");
            return await updateSelectedExternalStatus({ api, projectId });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["selected-external", projectId] });
        },
    });
};