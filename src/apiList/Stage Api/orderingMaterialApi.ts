import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

const getOrderingMaterialStage = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.get(`/orderingmaterial/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const getSingleRoom = async ({ projectId, roomId, api }: { projectId: string, roomId: string, api: AxiosInstance }) => {
    const { data } = await api.get(`/orderingmaterial/${projectId}/room/${roomId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const updateMaterialItem = async ({
    projectId,
    roomId,
    materialName,
    payload,
    api,
}: {
    projectId: string,
    roomId: string,
    materialName: string,
    payload: {
        sellerName?: string;
        sellerPhoneNo?: string;
        notes?: string;
    },
    api: AxiosInstance
}) => {
    const { data } = await api.patch(`/orderingmaterial/${projectId}/room/${roomId}/material/${materialName}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const updateIsOrderedStatus = async ({
    projectId,
    roomId,
    materialName,
    isOrdered,
    api,
}: {
    projectId: string,
    roomId: string,
    materialName: string,
    isOrdered: boolean,
    api: AxiosInstance
}) => {
    const { data } = await api.patch(`/orderingmaterial/${projectId}/room/${roomId}/material/${materialName}/ordered`, { isOrdered });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


// =============================
// ✅ React Query Hook Group
// =============================
export const useGetOrderingMaterialStage = ({ projectId }: { projectId: string }) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["ordering-material-stage", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await getOrderingMaterialStage({ projectId, api });
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        enabled: !!projectId && !!role && allowedRoles.includes(role)
    });
}

export const useGetSingleOrderingRoom = ({ projectId, roomId }: { projectId: string, roomId: string }) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["ordering-room", projectId, roomId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await getSingleRoom({ projectId, roomId, api });
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        enabled: !!projectId && !!roomId && !!role && allowedRoles.includes(role)
    });
}

export const useUpdateMaterialItem = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            roomId,
            materialName,
            payload,
        }: {
            projectId: string,
            roomId: string,
            materialName: string,
            payload: {
                sellerName?: string;
                sellerPhoneNo?: string;
                notes?: string;
            }
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await updateMaterialItem({ projectId, roomId, materialName, payload, api });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["ordering-room", vars.projectId, vars.roomId] });
            queryClient.invalidateQueries({ queryKey: ["ordering-material-stage", vars.projectId] });
        }
    });
}

export const useUpdateIsOrderedStatus = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            roomId,
            materialName,
            isOrdered
        }: {
            projectId: string;
            roomId: string;
            materialName: string;
            isOrdered: boolean;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance not found for role");
            return await updateIsOrderedStatus({ projectId, roomId, materialName, isOrdered, api });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["ordering-room", vars.projectId, vars.roomId] });
            queryClient.invalidateQueries({ queryKey: ["ordering-material-stage", vars.projectId] });
        }
    });
}

