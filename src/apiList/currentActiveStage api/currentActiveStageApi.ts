import { useQuery } from "@tanstack/react-query";


// api/projectStage/getFirstPendingStageForProject.ts
import axios from "axios";

const getFirstPendingStageForProject = async ({projectId,}: { projectId: string;}) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/currentactivestage/${projectId}/pendingstage`);
    // if (!response.data.ok) return ""
    console.log("respsne", response.data)
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
    });
};
