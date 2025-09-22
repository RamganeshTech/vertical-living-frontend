import {type  AxiosInstance } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";


const allowedRoles = ["owner", "CTO", "staff"];


// 🔹 GET all accounting records for an organization
export const getAccountingAllApi = async ({
  organizationId,
  api,
  filters,
  search,
}: {
  organizationId: string;
  api: AxiosInstance;
  search?: string, 
  filters?: { projectId?: string; fromDept?: string; status?: string };
}) => {
  const params = new URLSearchParams();
  if (organizationId) params.append("organizationId",organizationId);
  if (filters?.projectId) params.append("projectId", filters.projectId);
  if (filters?.fromDept) params.append("fromDept", filters.fromDept);
  if (filters?.status) params.append("status", filters.status);
  if (search) params.append("search", search);

  const { data } = await api.get(
    `/department/accounting/getaccountingall?${params.toString()}`
  );

  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const getSingleAccountingApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/accounting/single/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// 🔹 UPDATE accounting record
export const updateAccountingApi = async ({
  id,
  payload,
  api,
}: {
  id: string;
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/accounting/update/${id}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.updated;
};



// 🔹 DELETE accounting record
export const deleteAccountingApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/department/accounting/delete/${id}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.deleted;
};



export const useGetAccountingAll = (
  organizationId: string,
  filters?: { projectId?: string; fromDept?: string; status?: string },
  search?: string
) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["accounting", "all", organizationId, filters, search],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getAccountingAllApi({ organizationId, api, filters, search });
    },
    enabled: !!organizationId && !!role && !!api,
  });
};


// 🔹 React Query hook
export const useGetSingleAccounting = (id: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["accounting", "single"],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleAccountingApi({ id, api });
    },
    enabled: !!id && !!role && !!api,
  });
};


export const useUpdateAccounting = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await updateAccountingApi({ id, payload, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["accounting", "single"]});
    },
  });
};

export const useDeleteAccounting = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await deleteAccountingApi({  id, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "all"] });
    },
  });
};

