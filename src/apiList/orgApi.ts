import { useQuery, useMutation } from "@tanstack/react-query";
import Api from "../apiService/apiService";     // your configured axios instance
import { queryClient } from "../QueryClient/queryClient";

// 1) createOrganization
const createOrganization = async (orgData: {
  organizationName: string;
  type?: string;
  address?: string;
  logoUrl?: string;
  organizationPhoneNo?: string;
}) => {
  const { data } = await Api.post("/orgs/createorganziation", orgData);
  if (!data.ok) throw new Error(data.message);
  return data.data;  // returns created org
};


// 2) getMyOrganizations
const fetchMyOrganizations = async () => {
  const { data } = await Api.get("/orgs/getorganizations");
  if (!data.ok) return [];
  return data.data;
};


const fetchSingleOrganization = async (organizationId:string) => {
  const { data } = await Api.get(`/orgs/getsingleorganization/${organizationId}`);
  if (!data.ok) return {};
  return data.data;
};
   

// 3) updateOrganizationName
const updateOrganizationName = async ({
  organizationName, orgsId
}: {
  organizationName: string;
  orgsId:string
}) => {
  const { data } = await Api.put(`/orgs/updateorganization/${orgsId}`, {
    organizationName,
  });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};
 

// 4) deleteOrganization
const deleteOrganization = async (orgId: string) => {
  const { data } = await Api.put(`/orgs/deleteorganization/${orgId}`);
  if (!data.ok) throw new Error(data.message);
  return data;
};
  
// 5) getStaffsByOrganization
const fetchStaffsByOrganization = async (orgId: string) => {
  const { data } = await Api.get(`/orgs/getstaffsoforganization/${orgId}`);
  if (!data.ok) [];
  return data.data;
};

// 6) inviteStaffToOrganization
const inviteStaffToOrganization = async (payload: {
  organizationId: string;
  role: string;
}) => {
  const { data } = await Api.post("/orgs/invitestafftoorganization", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data; // invitation link
};

// 7) removeStaffFromOrganization
const removeStaffFromOrganization = async ({
  staffId,
  orgId,
}: {
  staffId: string;
  orgId: string;
}) => {
  const { data } = await Api.patch(
    `/orgs/removestafffromorganziation?staffId=${staffId}&orgId=${orgId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useGetMyOrganizations = () => {
  return useQuery({
    queryKey: ["myOrgs"],
    queryFn: fetchMyOrganizations,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry:false
  });
};


export const useGetSingleOrganization = (organizationId:string) => {
  return useQuery({
    queryKey: ["myOrgs"],
    queryFn: ()=> fetchSingleOrganization(organizationId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry:false
  });
};


export const useGetStaffsByOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ["staffs", orgId],
    queryFn: () => fetchStaffsByOrganization(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateOrganization = () => {
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrgs"] });
    },
  });
};

export const useUpdateOrganizationName = () => {
  return useMutation({
    mutationFn: updateOrganizationName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrgs"] });
    },
  });
};

export const useDeleteOrganization = () => {
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrgs"] });
    },
  });
};

export const useInviteStaffToOrganization = () => {
  return useMutation({
    mutationFn: inviteStaffToOrganization,
    
  });
};

export const useRemoveStaffFromOrganization = () => {
  return useMutation({
    mutationFn: removeStaffFromOrganization,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffs", variables.orgId] });
    },
  });
};
