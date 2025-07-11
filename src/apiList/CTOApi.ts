import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../QueryClient/queryClient";
import CTOApi from "../apiService/CTOService";


// 1) loginStaff
const loginCTO = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await CTOApi.post("/auth/CTO/login", { email, password });
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useLoginCTO = () => {
    return useMutation({
        mutationFn: loginCTO,
        onSuccess: () => {
            // invalidate or refetch user-profile queries if you have them
            queryClient.invalidateQueries({ queryKey: ["CTOProfile"] });
        },
    });
};

// 2) registerStaff
const registerCTO = async (payload: {
    invite: string;
    email: string;
    password: string;
    phoneNo: string;
    CTOName: string;
}) => {
    const { data } = await CTOApi.post("/auth/CTO/registerCTO", payload);
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useRegisterCTO = () => {
    return useMutation({
        mutationFn: registerCTO,
    });
};

// 3) logoutStaff
const logoutCTO = async () => {
    const { data } = await CTOApi.post("/auth/CTO/logout");
    if (!data.ok) throw new Error(data.message);
    return data;
};
export const useLogoutCTO = () => {
    return useMutation({
        mutationFn: logoutCTO,
        onSuccess: () => {
            queryClient.clear(); // or just invalidate all cto-related queries
        },
    });
};





// const inviteWorkerByCTO = async (payload: { projectId: string; specificRole: string, role: string }) => {
//     console.log("payload", payload)
//     const { data } = await CTOApi.post("/CTO/inviteworker", payload);
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// };

// const getWorkersByProjectAsCTO = async (projectId: string) => {
//     const { data } = await CTOApi.get(`/CTO/getworker/${projectId}`);
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// };

// const removeWorkerAsCTO = async ({ workerId, projectId }: { workerId: string; projectId: string }) => {
//     const { data } = await CTOApi.put(`/CTO/removeworker/${workerId}/${projectId}`);
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// };

// const getAllStaffsByCTO = async ()=>{
//      const { data } = await CTOApi.get(`/CTO/getallstaff`);
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// }


// export const useInviteWorkerByCTO = () => useMutation({ mutationFn: inviteWorkerByCTO });

// export const useGetWorkersAsCTO = (projectId: string) =>
//     useQuery({
//         queryKey: ["workers", projectId],
//         queryFn: () => getWorkersByProjectAsCTO(projectId),
//         enabled: !!projectId,
//         staleTime: 5 * 60 * 1000,
//         refetchOnWindowFocus: false,
//         retry: false
//     });

// export const useRemoveWorkerAsCTO = () =>
//     useMutation({
//         mutationFn: removeWorkerAsCTO,
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
//     });


// export const useGetStaffsByCTO = () =>
//     useQuery({
//         queryKey: ["staffs"],
//         queryFn: getAllStaffsByCTO,
//         staleTime: 5 * 60 * 1000,
//         refetchOnWindowFocus: false,
//         retry: false
//     })