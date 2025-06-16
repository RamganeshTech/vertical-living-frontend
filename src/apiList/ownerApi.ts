import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../apiService/apiService";
import { queryClient } from "../QueryClient/queryClient";


//  OWNER STAFFS
const getAllStaffsByOwner = async ()=>{
     const { data } = await Api.get(`owner/getallstaff`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


export const useGetStaffsByOwner = () =>
    useQuery({
        queryKey: ["staffs"],
        queryFn: getAllStaffsByOwner,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    })



// OWNER WORKER
const inviteWorkerByOwner = async (payload: { projectId: string; specificRole: string, role: string }) => {
    console.log("payload", payload)
    const { data } = await Api.post("/owner/inviteworker", payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const getWorkersByProjectAsOwner = async (projectId: string) => {
    const { data } = await Api.get(`/owner/getworker/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

const removeWorkerAsOwner = async ({ workerId, projectId }: { workerId: string; projectId: string }) => {
    const { data } = await Api.put(`/owner/removeworker/${workerId}/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const useInviteWorkerByCTO = () => useMutation({ mutationFn: inviteWorkerByOwner });

export const useGetWorkersAsCTO = (projectId: string) =>
    useQuery({
        queryKey: ["workers", projectId],
        queryFn: () => getWorkersByProjectAsOwner(projectId),
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    });

export const useRemoveWorkerAsCTO = () =>
    useMutation({
        mutationFn: removeWorkerAsOwner,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),

    });
