import { useQuery } from "@tanstack/react-query";


// api/projectStage/getFirstPendingStageForProject.ts
import axios, { type AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

const getFirstPendingStageForProject = async ({projectId,}: { projectId: string;}) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/currentactivestage/${projectId}/pendingstage`);
    // if (!response.data.ok) return ""
    return response.data.redirectTo;
};


export const useGetCurrentActiveStage = (projectId: string) => {

    return useQuery({
        queryKey: ["currentactivestage", projectId],
        queryFn: () =>
            getFirstPendingStageForProject({
                projectId,
            }),
        enabled: !!projectId,
        retry:false,
        refetchOnMount:false
    });
};




export const getProjectDetails = async ({projectId, api}:{projectId: string, api: AxiosInstance}) => {

    const {data} = await api.get(`projectdetails/getprojectdetails/${projectId}`);
    return data.data;
};


export const useGetProjectDetails = (projectId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "CTO", "staff"]

    return useQuery({
        queryKey: ["getprojectdetails", projectId],
        queryFn: async () => {
            if (!role) throw new Error("Not Authorized");
            if (!allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");

            return await getProjectDetails({projectId, api})
        },
        enabled: !!projectId && !!role,
        retry:false,
        // refetchOnMount:true
    });
};
