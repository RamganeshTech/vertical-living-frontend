import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";

// --- API functions ---

const createMaterialInventory = async ({ organizationId, specification, api }: { organizationId: string, specification: any, api: AxiosInstance }) => {
  const { data } = await api.post(`/materialinventory?organizationId=${organizationId}`, specification);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const updateMaterialInventory = async ({ id, specification, api }: { id: string, specification: any, api: AxiosInstance }) => {
  const { data } = await api.put(`/materialinventory/${id}/updatematerial`, { specification });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const deleteMaterialInventory = async ({ id, api }: { id: string, api: AxiosInstance }) => {
  const { data } = await api.delete(`/materialinventory/${id}/deletematerial`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getMaterialInventoryById = async ({ id, api }: { id: string, api: AxiosInstance }) => {
  const { data } = await api.get(`/materialinventory/${id}/getsingle`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getMaterialInventories = async ({ organizationId, pageParam = 1, filters = {}, api }: { organizationId: string, pageParam?: number, filters?: any, api: AxiosInstance }) => {
  const params = new URLSearchParams({ organizationId, page: String(pageParam), ...filters });
  const { data } = await api.get(`/materialinventory/getallmaterial?${params.toString()}`);
  if (!data.ok) throw new Error(data.message);
  return data;
};

// --- React Query hooks ---

const allowedRoles = ["owner", "staff", "CTO"];

export const useCreateMaterialInventory = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ organizationId, specification }: { organizationId: string, specification: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await createMaterialInventory({ organizationId, specification, api });
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ["materialinventory", organizationId] });
    }
  });
};

export const useUpdateMaterialInventory = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ id, specification }: { id: string, specification: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await updateMaterialInventory({ id, specification, api });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["materialinventory", id] });
    }
  });
};

export const useDeleteMaterialInventory = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await deleteMaterialInventory({ id, api });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["materialinventory", id] });
    }
  });
};

export const useGetMaterialInventoryById = (id: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["materialinventory", id],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await getMaterialInventoryById({ id, api });
    },
    enabled: !!id && !!role,
    retry: false,
    refetchOnWindowFocus: false,
  })

};

export interface MaterialInventoryPageResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  ok: boolean;
  message: string;
}

export const useInfiniteMaterialInventories = (organizationId: string, filters: any = {}) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useInfiniteQuery<
    MaterialInventoryPageResponse,
    Error,
    MaterialInventoryPageResponse,
    [string, string, any?],
    number
  >({
    queryKey: ["materialinventory", organizationId, filters],
    enabled: !!organizationId && !!role,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");
      return await getMaterialInventories({ organizationId, pageParam, filters, api });
    },
    // getNextPageParam: (lastPage) => {
    //   return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    // },
   
    getNextPageParam: (lastPage) => {
      console.log('🔍 Last page received:', lastPage);
      console.log('🔍 Available properties:', Object.keys(lastPage));

      const currentPage = lastPage.page;
      const totalPages = lastPage.totalPages;

      console.log('🔍 Pagination calculation:', {
        currentPage,
        totalPages,
        condition: `${currentPage} < ${totalPages}`,
        result: currentPage < totalPages
      });

      const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;
      console.log('🔍 Next page will be:', nextPage);

      return nextPage;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};