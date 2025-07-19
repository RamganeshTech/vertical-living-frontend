
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";

export const getStageSelectionApi = async ({projectId, api}:{projectId: string, api: AxiosInstance}) => {

    const res = await api.get(`/selectedstage/getselectedstage/${projectId}`);
    return res.data.data;
};

export const upsertStageSelectionApi = async ({projectId,
mode,
api}:{
    projectId: string,
    mode: "Modular Units" | "Manual Flow",
    api: AxiosInstance
}
) => {
    const res = await api.post(`/selectedstage/updateselectedstage/${projectId}`, {
        mode,
    });
    return res.data.data;
};





export const useGetStageSelection = (projectId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "CTO", "staff"]

    return useQuery({
        queryKey: ["stage-selection", projectId],
        queryFn: async () => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getStageSelectionApi({projectId, api})
        },
        enabled: !!projectId && !!role,
        retry:false,
        refetchOnMount:false
    });
};

export const useUpsertStageSelection = () => {
    const queryClient = useQueryClient();
    const { role } = useGetRole();
    const allowedRoles = ["owner", "CTO", "staff"]
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({projectId, mode}:{projectId:string, mode: "Modular Units" | "Manual Flow"}) => {

            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await upsertStageSelectionApi({projectId, mode, api})
    },
    onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["stage-selection", projectId] });
        },
    });
};
