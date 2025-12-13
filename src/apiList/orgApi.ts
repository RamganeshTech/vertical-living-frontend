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
const fetchMyOrganizations = async (api: AxiosInstance) => {
  const { data } = await api.get("/orgs/getorganizations");
  if (!data.ok) return null;
  return data.data;
};


const fetchSingleOrganization = async (organizationId: string, api: AxiosInstance) => {
  const { data } = await api.get(`/orgs/getsingleorganization/${organizationId}`);
  if (!data.ok) return {};
  return data.data;
};


// 3) updateOrganizationName
const updateOrganizationName = async ({
  updateField, orgsId, api
}: {
  updateField: Record<string, string>;
  orgsId: string,
  api: AxiosInstance
}) => {
  const { data } = await api.put(`/orgs/updateorganization/${orgsId}`, updateField);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// 4) deleteOrganization
const deleteOrganization = async (orgId: string, api: AxiosInstance) => {
  const { data } = await api.delete(`/orgs/deleteorganization/${orgId}`);
  if (!data.ok) throw new Error(data.message);
  return data;
};




export const useGetMyOrganizations = () => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);



  return useQuery({
    queryKey: ["myOrgs"],
    queryFn: async () => {
      if (!role) throw new Error("Not Authorized");
      if (!allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await fetchMyOrganizations(api)
    },
    refetchOnWindowFocus: false,
    retry: false
  });
};


export const useGetSingleOrganization = (organizationId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "client", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["myOrgs-single"],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await fetchSingleOrganization(organizationId, api)
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};



export const useCreateOrganization = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async (orgData: {
      organizationName: string;
      type?: string;
      address?: string;
      logoUrl?: string;
      organizationPhoneNo?: string;
    }) => {

      if (!role) throw new Error("Not authorized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await createOrganization(orgData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrgs"] });
      queryClient.invalidateQueries({ queryKey: ["myOrgs-single"] });
    },
  });
};

export const useUpdateOrganizationName = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);


  return useMutation({
    mutationFn: async ({
      updateField, orgsId,
    }: {
      updateField: Record<string, string>;
      orgsId: string,
    }) => {

      if (!role) throw new Error("Not authorized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await updateOrganizationName({ updateField, orgsId, api })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrgs"] });
      queryClient.invalidateQueries({ queryKey: ["myOrgs-single"] });

    },
  });
};

export const useDeleteOrganization = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);


  return useMutation({
    mutationFn: async (orgId: string) => {

      if (!role) throw new Error("Not authorized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")


      return await deleteOrganization(orgId, api)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrgs"] });
      queryClient.invalidateQueries({ queryKey: ["myOrgs-single"] });

    },
  });
};



// STAFFS API BY OWNER
const fetchStaffsByOrganization = async (orgId: string, api: AxiosInstance) => {
  const { data } = await api.get(`/orgs/getstaffsoforganization/${orgId}`);
  if (!data.ok) [];
  return data.data;
};

const inviteStaffToOrganization = async (payload: {
  organizationId: string;
  role: string;
  // specificRole: string[]
}, api: AxiosInstance) => {
  const { data } = await api.post("/orgs/invitestafftoorganization", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data; // invitation link
};

const removeStaffFromOrganization = async ({
  staffId,
  orgId,
  api
}: {
  staffId: string;
  orgId: string;
  api: AxiosInstance
}) => {
  const { data } = await api.patch(
    `/orgs/removestafffromorganziation?staffId=${staffId}&orgId=${orgId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useGetStaffsByOrganization = (orgId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["staffs", orgId],
    queryFn: async () => {
      if (!role) throw new Error("Not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await fetchStaffsByOrganization(orgId, api)
    },
    enabled: !!orgId,
    refetchOnWindowFocus: false,
    retry: false
  });
};


export const useInviteStaffToOrganization = () => {
  const allowedRoles = ["owner", "CTO"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async (payload: {
      organizationId: string;
      role: string;
      // specificRole: string[]
    }) => {

      if (!role) throw new Error("Not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await inviteStaffToOrganization(payload, api)
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["staffs", payload.organizationId] })
    }


  });
};

export const useRemoveStaffFromOrganization = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ staffId, orgId }: { staffId: string, orgId: string }) => {

      if (!role) throw new Error("Not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")


      return await removeStaffFromOrganization({ staffId, orgId, api })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffs", variables.orgId] });
    },
  });
};




// CTO ROUTES

const fetchCTOByOrganization = async (orgId: string, api: AxiosInstance) => {
  const { data } = await api.get(`/orgs/getctooforganization/${orgId}`);
  if (!data.ok) [];
  return data.data;
};

const inviteCTOToOrganization = async (payload: {
  organizationId: string;
  role: string;
}, api: AxiosInstance) => {
  const { data } = await api.post("/orgs/invitectotoorganization", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data; // invitation link
};

const removeCTOFromOrganization = async ({
  CTOId,
  orgId,
  api
}: {
  CTOId: string;
  orgId: string;
  api: AxiosInstance
}) => {
  const { data } = await api.patch(
    `/orgs/removectofromorganziation?CTOId=${CTOId}&orgId=${orgId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useGetCTOByOrganization = (orgId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["CTO", orgId],
    queryFn: async () => {
      if (!role) throw new Error("Not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await fetchCTOByOrganization(orgId, api)
    },
    enabled: !!orgId,
    refetchOnWindowFocus: false,
    retry: false
  });
};


export const useInviteCTOToOrganization = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async (payload: {
      organizationId: string;
      role: string;
    }) => {

      if (!role) throw new Error("Not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await inviteCTOToOrganization(payload, api)
    }

  });
};

export const useRemoveCTOFromOrganization = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ CTOId, orgId }: { CTOId: string, orgId: string }) => {

      if (!role) throw new Error("Not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")


      return await removeCTOFromOrganization({ CTOId, orgId, api })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["CTO", variables.orgId] });
    },
  });
};


// client routes
const inviteClient = async ({ projectId, api, organizationId }: { projectId: string, organizationId: string, api: AxiosInstance }) => {
  const { data } = await api.post('orgs/inviteclienttoproject', { projectId, organizationId })
  if (!data.ok) throw new Error(data.message);
  return data.data;
}

export const useInviteClientToProject = () => {
  const allowedRoles = ["owner", "CTO"]

  const { role } = useGetRole()

  const api = getApiForRole(role!)

  return useMutation({
    mutationFn: async ({ projectId, organizationId }: { projectId: string, organizationId: string }) => {
      if (!role) throw new Error("not authrized")

      if (!allowedRoles.includes(role)) throw new Error("youre not allowed to access this api")

      if (!api) throw new Error("api is null")

      return await inviteClient({ projectId, api, organizationId })
    }
  })
}





const fetchClientByOrgsAndProject = async (orgId: string, projectId: string) => {
  const { data } = await Api.get(`/orgs/getclientsofproject/${orgId}/${projectId}`);
  if (!data.ok) [];
  return data.data;
};

export const useGetClientByOrgsAndProject = (orgId: string, projectId: string) => {

  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();

  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["CTO", orgId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await fetchClientByOrgsAndProject(orgId, projectId)
    },
    enabled: !!orgId,
    refetchOnWindowFocus: false,
    retry: false
  });
};







// WORKER INVITATION

const inviteWorkerByStaff = async ({ payload, api }: { payload: { projectId: string; role: string, organizationId: string }, api: AxiosInstance }) => {
  const { data } = await api.post("orgs/inviteworker", payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getWorkersByProjectAsStaff = async (projectId: string, api: AxiosInstance) => {
  const { data } = await api.get(`orgs/getworker/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const removeWorkerAsStaff = async ({ workerId, orgId, projectId, api }: { orgId: string, workerId: string; projectId: string, api: AxiosInstance }) => {
  const { data } = await api.put(`orgs/removeworker/${orgId}/${workerId}/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const useInviteWorkerByStaff = () => {
  const allowedRoles = ["owner", "staff", "CTO"]

  const { role } = useGetRole()
  const api = getApiForRole(role!)
  return useMutation({
    mutationFn: async (payload: { projectId: string; role: string, organizationId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

      if (!api) throw new Error("API instance not found for role");

      return await inviteWorkerByStaff({ api, payload })
    }
  })
}

export const useGetWorkersAsStaff = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"]

  const { role } = useGetRole()
  const api = getApiForRole(role!)

  return useQuery({
    queryKey: ["workers", projectId],
    queryFn: async () => {

      if (!role || !allowedRoles.includes(role)) throw new Error("Not Allowed to Make this api Call");

      if (!api) throw new Error("API instance not found for role");

      return await getWorkersByProjectAsStaff(projectId, api)
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
    retry: false
  })
}

export const useRemoveWorkerAsStaff = () => {
  const allowedRoles = ["owner", "staff", "CTO"]

  const { role } = useGetRole()
  const api = getApiForRole(role!)

  return useMutation({
    mutationFn: async ({ workerId, orgId, projectId }: { workerId: string; orgId: string, projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

      if (!api) throw new Error("API instance not found for role");

      return await removeWorkerAsStaff({ workerId, orgId, projectId, api })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  })
}





// ROLES AND PERMISSIONS



// Types for the Payloads
interface RegisterUserPayload {
  email: string;
  password?: string;
  staffName?: string;
  clientName?: string;
  workerName?: string;
  CTOName?: string;
  phoneNo?: string;
  permissions?: any; // The permissions object/map
}


// 1. Register User API
export const registerUserApi = async ({
  api,
  organizationId,
  roleToCreate,
  payload
}: {
  api: AxiosInstance;
  organizationId: string;
  roleToCreate: string; // e.g. 'staff', 'worker', 'client'
  payload: RegisterUserPayload;
}) => {
  // POST /api/orgs/registeruser/:organizationId/:role
  const { data } = await api.post(`orgs/registeruser/${organizationId}/${roleToCreate}`, payload);
  if (!data.ok) throw new Error(data.message || "Failed to register");
  return data;
};

// 2. Update Permissions API
export const updatePermissionsApi = async ({
  api,
  userId,
  permission
}: {
  api: AxiosInstance;
  userId: string;
  permission: any
}) => {
  // PUT /api/orgs/updatepermission/:userId
  const { data } = await api.put(`orgs/updatepermission/${userId}`, { permission });
  if (!data.ok) throw new Error(data.message || "Failed to update permissions");
  return data;
};

// 3. Get All Users API
export const getAllUsersApi = async ({
  api,
  organizationId
}: {
  api: AxiosInstance;
  organizationId: string
}) => {
  // GET /api/orgs/getalluser/:organizationId
  const { data } = await api.get(`orgs/getalluser/${organizationId}`);
  if (!data.ok) throw new Error(data.message || "Failed to fetch users");
  return data.data; // Assumes your backend returns { data: [...] }
};


const getSingleUsersApi = async ({
  userId,
  api
}: {
  api: AxiosInstance;
  userId: string
}) => {
  const { data } = await api.get(`orgs/getsingleuser/${userId}`);
  if (!data.ok) throw new Error(data.message || "Failed to fetch users");
  return data.data; // Assumes your backend returns { data: [...] }

}

// 4. Delete User API
export const deleteUserApi = async ({
  api,
  userId
}: {
  api: AxiosInstance;
  userId: string
}) => {
  // DELETE /api/orgs/deleteuser/:userId
  const { data } = await api.delete(`orgs/deleteuser/${userId}`);
  if (!data.ok) throw new Error(data.message || "Failed to delete user");
  return data;
};






// Allowed roles for these admin actions
// Based on your routes: multiRoleAuthMiddleware("owner")
const ADMIN_ROLES = ["owner"];

// ==========================================
// 1. Hook: Register User
// ==========================================
export const useRegisterUser = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      organizationId,
      roleToCreate,
      payload
    }: {
      organizationId: string;
      roleToCreate: string;
      payload: any
    }) => {
      if (!role || !ADMIN_ROLES.includes(role)) {
        throw new Error("You are not authorized to perform this action");
      }
      if (!api) throw new Error("API instance not found for role");

      return await registerUserApi({ api, organizationId, roleToCreate, payload });
    },
    onSuccess: (_, variables) => {
      // Refresh the user list for this organization
      queryClient.invalidateQueries({ queryKey: ['orgUsers', variables.organizationId] });
    }
  });
};

// ==========================================
// 2. Hook: Update Permissions
// ==========================================
export const useUpdateUserPermissions = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      userId,
      permission,
    }: {
      userId: string;
      permission: any;
    }) => {
      if (!role || !ADMIN_ROLES.includes(role)) {
        throw new Error("You are not authorized to update permissions");
      }
      if (!api) throw new Error("API instance not found");

      return await updatePermissionsApi({ api, userId, permission });
    },
    onSuccess: (_, variables) => {
      // Refresh list to show updated permissions
      queryClient.invalidateQueries({ queryKey: ['orgUsers', "single", variables.userId] });
    }
  });
};

// ==========================================
// 3. Hook: Get All Users (Query)
// ==========================================
export const useGetAllUsers = (organizationId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ['orgUsers', organizationId],
    queryFn: async () => {
      if (!role || !ADMIN_ROLES.includes(role)) {
        throw new Error("You are not authorized to view users");
      }
      if (!api) throw new Error("API instance not found");

      return await getAllUsersApi({ api, organizationId });
    },
    enabled: !!organizationId && !!role && ADMIN_ROLES.includes(role), // Only run if auth checks pass
  });
};


export const useGetSingleUserForRoles = (userId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ['orgUsers', "single", userId],
    queryFn: async () => {
      if (!role || !ADMIN_ROLES.includes(role)) {
        throw new Error("You are not authorized to view users");
      }
      if (!api) throw new Error("API instance not found");

      return await getSingleUsersApi({ api, userId });
    },
    enabled: !!userId && !!role && ADMIN_ROLES.includes(role), // Only run if auth checks pass
  });
};


// ==========================================
// 4. Hook: Delete User
// ==========================================
export const useDeleteUser = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      userId,
      organizationId // Needed for invalidation
    }: {
      userId: string;
      organizationId: string;
    }) => {
      console.log(organizationId)
      if (!role || !ADMIN_ROLES.includes(role)) {
        throw new Error("You are not authorized to delete users");
      }
      if (!api) throw new Error("API instance not found");

      return await deleteUserApi({ api, userId });
    },
    onSuccess: (_, variables) => {
      // Refresh list to remove the deleted user
      queryClient.invalidateQueries({ queryKey: ['orgUsers', variables.organizationId] });
    }
  });
};