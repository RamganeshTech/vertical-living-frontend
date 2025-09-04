import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useInfiniteQuery, useMutation, useQuery, type InfiniteData } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

// ===============================
// Employee APIs
// ===============================

// Get all employees (with search, filters, pagination)
export const getEmployees = async ({
  organizationId,
  page = 1,
  limit = 10,
  name,
  email,
  phone,
  empRole,
   status,
  department,
  api
}: {
  organizationId: string;
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  phone?: string;
  empRole?: string;
  status?: string;
  department?: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/hr/getallemployee`, {
    params: { organizationId, page, limit, name, email, phone, empRole, department, status }
  });
  if (!data.ok) throw new Error(data.message);
  return data;
};

// Get single employee
export const getSingleEmployee = async ({
  empId,
  api
}: {
  empId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/hr/getsingle/${empId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};





// Update employee
export const createEmployee = async ({
  formData,
  api
}: {
  formData: FormData;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/department/hr/createemployee`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// Update employee
export const updateEmployee = async ({
  empId,
  updates,
  api
}: {
  empId: string;
  updates: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/hr/update/${empId}`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Delete employee
export const deleteEmployee = async ({
  empId,
  api
}: {
  empId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/department/hr/deleteemployee/${empId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Upload employee document
export const uploadEmployeeDocument = async ({
  empId,
  type,
  file,
  api
}: {
  empId: string;
  type: string;
  file: File;
  api: AxiosInstance;
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const { data } = await api.post(`/department/hr/${empId}/uploaddocument`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// Delete employee document
export const deleteEmployeeDocument = async ({
  empId,
  docId,
  api
}: {
  empId: string;
  docId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/department/hr/${empId}/deletedocument/${docId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




// Allowed roles for HR module
const allowedRoles = ["owner", "staff", "CTO"];


export interface EmployeePageResponse {
  ok: boolean;
  data: any[];  // assuming you already have HREmployee interface/model mapped
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


// ===============================
// Queries
// ===============================
export const useGetEmployeesInfinite = (organizationId: string, filters?: any) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useInfiniteQuery<
    EmployeePageResponse,   // Replace with your actual paginated response type
    Error,
    InfiniteData<EmployeePageResponse>,
    [string, string, string?, any?],
    number
  >({
    queryKey: ["hr", "employees", organizationId, { ...filters }],
    enabled: !!organizationId && !!role,
    initialPageParam: 1, // ✅ required
    queryFn: async ({ pageParam = 1 }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");

      return await getEmployees({
        organizationId,
        api,
        pageParam,
        ...filters,
      });
    },
    getNextPageParam: (lastPage:EmployeePageResponse) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};




export const useGetSingleEmployee = (empId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["hr", "employee", empId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleEmployee({ empId, api });
    },
    enabled: !!empId && !!role,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// ===============================
// Mutations
// ===============================


export const useAddEmployeeByHR = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await createEmployee({  formData, api });
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["hr", "employee", empId] });
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
    },
  });
};



export const useUpdateEmployee = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ empId, updates }: { empId: string; updates: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await updateEmployee({ empId, updates, api });
    },
    onSuccess: (_, { empId }) => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employee", empId] });
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ empId }: { empId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteEmployee({ empId, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
    },
  });
};

export const useUploadEmployeeDocument = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ empId, type, file }: { empId: string; type: string; file: File }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await uploadEmployeeDocument({ empId, type, file, api });
    },
    onSuccess: (_, { empId }) => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employee", empId] });
    },
  });
};

export const useDeleteEmployeeDocument = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ empId, docId }: { empId: string; docId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteEmployeeDocument({ empId, docId, api });
    },
    onSuccess: (_, { empId }) => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employee", empId] });
    },
  });
};
