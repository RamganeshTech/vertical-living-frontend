import { useMutation, useQuery } from "@tanstack/react-query";
import {type AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// ----------------- API FUNCTIONS -----------------

const createInventorySubItemApi = async ({
  projectId,
  payload,
  api,
}: {
  projectId: string;
  payload: any;
  api: AxiosInstance;
}) => {
    console.log("paylod from creating", payload )
  const { data } = await api.post(`/inventory/create/${projectId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const updateInventorySubItemApi = async ({
  projectId,
  subItemId,
  payload,
  api,
}: {
  projectId: string;
  subItemId: string;
  payload: any;
  api: AxiosInstance;
}) => {
    console.log("paylod from updating", payload )

  const { data } = await api.put(
    `/inventory/update/${projectId}/${subItemId}`,
    payload
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const deleteInventorySubItemApi = async ({
  projectId,
  subItemId,
  api,
}: {
  projectId: string;
  subItemId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/inventory/delete/${projectId}/${subItemId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const getInventoryDetailsApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/inventory/get/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ----------------- HOOKS -----------------



// ✅ Create subitem
export const useCreateInventorySubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: any;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await createInventorySubItemApi({ projectId, payload, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["inventory", projectId],
      });
    },
  });
};

// ✅ Update subitem
export const useUpdateInventorySubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      subItemId,
      payload,
    }: {
      projectId: string;
      subItemId: string;
      payload: any;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await updateInventorySubItemApi({
        projectId,
        subItemId,
        payload,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["inventory", projectId],
        
      });
    },
  });
};

// ✅ Delete subitem
export const useDeleteInventorySubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      subItemId,
    }: {
      projectId: string;
      subItemId: string;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await deleteInventorySubItemApi({ projectId, subItemId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({queryKey: ["inventory", projectId]});
    },
  });
};

// ✅ Get all inventory details
export const useGetInventoryDetails = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["inventory", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance not found for role");

      return await getInventoryDetailsApi({ projectId, api });
    },
    enabled: !!projectId && !!role,
    retry: false,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
  });
};
