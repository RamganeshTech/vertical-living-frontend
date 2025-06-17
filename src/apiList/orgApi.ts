import { useQuery, useMutation } from "@tanstack/react-query";
import Api from "../apiService/apiService";     // your configured axios instance
import { queryClient } from "../QueryClient/queryClient";
import { getApiForRole } from "../utils/roleCheck";
import useGetRole from "../Hooks/useGetRole";
import type { AxiosInstance } from "axios";

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
  console.log("from single orgs api", data)
  return data.data;
};
   

// 3) updateOrganizationName
const updateOrganizationName = async ({
  updateField, orgsId
}: {
  updateField: Record<string, string>;
  orgsId:string
}) => {
  const { data } = await Api.put(`/orgs/updateorganization/${orgsId}`, updateField);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};
 

// 4) deleteOrganization
const deleteOrganization = async (orgId: string) => {
  const { data } = await Api.put(`/orgs/deleteorganization/${orgId}`);
  if (!data.ok) throw new Error(data.message);
  return data;
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
    retry:false,
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



// STAFFS API BY OWNER
const fetchStaffsByOrganization = async (orgId: string) => {
  const { data } = await Api.get(`/orgs/getstaffsoforganization/${orgId}`);
  if (!data.ok) [];
  return data.data;
};

const inviteStaffToOrganization = async (payload: {
  organizationId: string;
  role: string;
}) => {
  const { data } = await Api.post("/orgs/invitestafftoorganization", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data; // invitation link
};

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


export const useGetStaffsByOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ["staffs", orgId],
    queryFn: () => fetchStaffsByOrganization(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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




// CTO ROUTES

const fetchCTOByOrganization = async (orgId: string) => {
  const { data } = await Api.get(`/orgs/getctooforganization/${orgId}`);
  if (!data.ok) [];
  return data.data;
};

const inviteCTOToOrganization = async (payload: {
  organizationId: string;
  role: string;
}) => {
  const { data } = await Api.post("/orgs/invitectotoorganization", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data; // invitation link
};

const removeCTOFromOrganization = async ({
  CTOId,
  orgId,
}: {
  CTOId: string;
  orgId: string;
}) => {
  const { data } = await Api.patch(
    `/orgs/removectofromorganziation?CTOId=${CTOId}&orgId=${orgId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useGetCTOByOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ["CTO", orgId],
    queryFn: () => fetchCTOByOrganization(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};


export const useInviteCTOToOrganization = () => {
  return useMutation({
    mutationFn: inviteCTOToOrganization,
    
  });
};

export const useRemoveCTOFromOrganization = () => {
  return useMutation({
    mutationFn: removeCTOFromOrganization,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["CTO", variables.orgId] });
    },
  });
};


// client routes
const inviteClient = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.post('orgs/inviteclienttoproject', { projectId })
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

export const useInviteClientToProject = () => {
    const allowedRoles = ["owner", "CTO"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role) throw new Error("not authrized")

            if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

            if (!api) throw new Error("api is null")

            return await inviteClient({ projectId, api })
        }
    })
}