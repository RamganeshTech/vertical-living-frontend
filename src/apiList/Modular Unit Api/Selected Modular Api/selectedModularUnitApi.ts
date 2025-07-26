import { type AxiosInstance } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";

// === 1. ADD Selected Modular Unit ===
export const addSelectedModularUnitApi = async (
    payload: {
        projectId: string;
        customId:string,
        image:string
        unitId: string;
        category: string;
        quantity: number;
        singleUnitCost: number;
    },
    api: AxiosInstance
) => {
    const { data } = await api.post("/selectedmodularunits/add", payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// === 2. GET Selected Units By Project ===
export const getSelectedModularUnitsApi = async (
    projectId: string,
    api: AxiosInstance
) => {
    const { data } = await api.get(`/selectedmodularunits/get/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// === 3. DELETE Selected Modular Unit ===
export const deleteSelectedModularUnitApi = async (
    projectId: string,
    unitId: string,
    api: AxiosInstance
) => {
    const { data } = await api.delete(`/selectedmodularunits/delete/${projectId}/${unitId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// === 4. COMPLETE Modular Unit Selection ===
export const completeModularUnitSelectionApi = async (
    projectId: string,
    api: AxiosInstance
) => {
    const { data } = await api.post(`/selectedmodularunits/projects/${projectId}/modular-unit/complete`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};








// === 1. ADD Selected Unit Hook ===
export const useAddSelectedModularUnit = () => {
    const allowedRoles = ["owner", "CTO", "staff"]
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            projectId: string;
            image:string,
            customId:string,
            unitId: string;
            category: string;
            quantity: number;
            singleUnitCost: number;
        }) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await addSelectedModularUnitApi(payload, api);
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({ queryKey: ["selected-modular-units", payload.projectId] });
        },
    });
};

// === 2. GET Selected Units by Project Hook ===
export const useGetSelectedModularUnits = (projectId: string) => {
    const allowedRoles = ["owner", "CTO", "staff", "client", "worker"]
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["selected-modular-units", projectId],
        queryFn: async () => {

            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

           return await getSelectedModularUnitsApi(projectId, api)
        },
        enabled: !!projectId && !!role,
        retry:false,
        refetchOnMount:false
    });
};

// === 3. DELETE Selected Unit Hook ===
export const useDeleteSelectedModularUnit = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "CTO", "staff"]


    return useMutation({
        mutationFn: async (payload: { projectId: string; unitId: string }) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
           
            return await deleteSelectedModularUnitApi(payload.projectId, payload.unitId, api);
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({ queryKey: ["selected-modular-units", payload.projectId] });
            
        },
    });
};

// === 4. COMPLETE Selection Hook ===
export const useCompleteModularUnitSelection = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "CTO", "staff"]

    return useMutation({
        mutationFn: async ({projectId}:{projectId: string}) => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await completeModularUnitSelectionApi(projectId, api);
        },
        onSuccess: (_, projectId) => {
            queryClient.invalidateQueries({ queryKey: ["selected-modular-units", projectId] });
            queryClient.invalidateQueries({ queryKey: ["payment-confirmation", projectId] });
            queryClient.invalidateQueries({ queryKey: ["cost-estimation", projectId] });
            queryClient.invalidateQueries({ queryKey: ["material-room-confirmation", projectId] });
        },
    });
};
