import { type AxiosInstance } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
// api/selectedModularUnitsNew.api.ts
import { queryClient } from "../../../QueryClient/queryClient";

// ADD SELECTED UNIT
const addSelectedUnitNew = async ({
    projectId,
    quantity,
    singleUnitCost,
    product,
    api
}: {
    projectId: string;
    quantity: number;
    singleUnitCost: number;
    product: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/selectedmodularunitsnew/${projectId}/add`, {
        quantity,
        singleUnitCost,
        product
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// GET SELECTED UNITS BY PROJECT
const getSelectedUnitsByProjectNew = async ({
    projectId,
    api
}: {
    projectId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/selectedmodularunitsnew/get/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// DELETE SELECTED UNIT
const deleteSelectedUnitNew = async ({
    projectId,
    unitId,
    api
}: {
    projectId: string;
    unitId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/selectedmodularunitsnew/delete/${projectId}/${unitId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// COMPLETE MODULAR UNIT SELECTION
const completeModularUnitSelection = async ({
    projectId,
    api
}: {
    projectId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/selectedmodularunitsnew/projects/${projectId}/modular-unit/complete`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// HOOK: ADD SELECTED UNIT
export const useAddSelectedUnitNew = () => {
    const allowedRoles = ["owner", "CTO", "staff"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            quantity,
            singleUnitCost,
            product
        }: {
            projectId: string;
            quantity: number;
            singleUnitCost: number;
            product: any;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("not allowed to make this api call");
            }
            if (!api) throw new Error("API instance not found for role");
            
            return await addSelectedUnitNew({
                projectId,
                quantity,
                singleUnitCost,
                product,
                api
            });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: ["selectedModularUnitsNew", projectId]
            });
        }
    });
};

// HOOK: GET SELECTED UNITS BY PROJECT
export const useGetSelectedUnitsByProjectNew = (projectId: string) => {
    const allowedRoles = ["owner", "CTO", "staff", "client", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["selectedModularUnitsNew", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("not allowed to make this api call");
            }
            if (!api) throw new Error("API instance not found for role");
            
            return await getSelectedUnitsByProjectNew({ projectId, api });
        },
        enabled: !!projectId && !!role && allowedRoles.includes(role)
    });
};

// HOOK: DELETE SELECTED UNIT
export const useDeleteSelectedUnitNew = () => {
    const allowedRoles = ["owner", "CTO", "staff"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            unitId
        }: {
            projectId: string;
            unitId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("not allowed to make this api call");
            }
            if (!api) throw new Error("API instance not found for role");
            
            return await deleteSelectedUnitNew({ projectId, unitId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: ["selectedModularUnitsNew", projectId]
            });
        }
    });
};

// HOOK: COMPLETE MODULAR UNIT SELECTION
export const useCompleteModularUnitSelection = () => {
    const allowedRoles = ["owner", "CTO", "staff"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("not allowed to make this api call");
            }
            if (!api) throw new Error("API instance not found for role");
            
            return await completeModularUnitSelection({ projectId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: ["selectedModularUnitsNew", projectId]
            });
            // You might want to invalidate project queries too
            queryClient.invalidateQueries({
                queryKey: ["projects", projectId]
            });
        }
    });
};