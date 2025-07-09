import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../QueryClient/queryClient";
import staffApi from "../apiService/staffApiservice";


// 1) loginStaff
const loginStaff = async ({ email, password }: { email: string; password: string }) => {
  const { data } = await staffApi.post("/auth/staff/login", { email, password });
  if (!data.ok) throw new Error(data.message);
  return data;
};
export const useLoginStaff = () => {
  return useMutation({
    mutationFn:loginStaff,
    onSuccess: () => {
         // invalidate or refetch user-profile queries if you have them
      queryClient.invalidateQueries({ queryKey: ["staffProfile"] });
    },
  });
};

// 2) registerStaff
const registerStaff = async (payload: {
  invite: string;
  email: string;
  password: string;
  phoneNo: string;
  staffName: string;
}) => {
  const { data } = await staffApi.post("/auth/staff/registerstaff", payload);
  if (!data.ok) throw new Error(data.message);
  return data;
};
export const useRegisterStaff = () => {
  return useMutation({
    mutationFn:registerStaff,
  });
};

// 3) logoutStaff
const logoutStaff = async () => {
  const { data } = await staffApi.post("/auth/staff/logout");
  if (!data.ok) throw new Error(data.message);
  return data;
};
export const useLogoutStaff = () => {
  return useMutation({
    mutationFn:logoutStaff,
    onSuccess: () => {
      queryClient.clear(); // or just invalidate all staff-related queries
    },
  });
};





const inviteWorkerByStaff = async (payload: { projectId: string; specificRole: string , role:string, organizationId:string}) => {
  console.log("payload", payload)
  const { data } = await staffApi.post("/staff/inviteworker", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getWorkersByProjectAsStaff = async (projectId: string) => {
  const { data } = await staffApi.get(`/staff/getworker/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const removeWorkerAsStaff = async ({ workerId, projectId }: { workerId: string; projectId: string }) => {
  const { data } = await staffApi.put(`/staff/removeworker/${workerId}/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useInviteWorkerByStaff = () => useMutation({ mutationFn: inviteWorkerByStaff });

export const useGetWorkersAsStaff = (projectId: string) =>
  useQuery({
    queryKey: ["workers", projectId],
    queryFn: () => getWorkersByProjectAsStaff(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry:false
  });

export const useRemoveWorkerAsStaff = () =>
  useMutation({
    mutationFn: removeWorkerAsStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });