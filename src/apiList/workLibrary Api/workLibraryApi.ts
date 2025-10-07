

import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";



// ➕ Create Work Library
export const createWorkLibrary = async ({
  formData,
  api,
}: {
  formData: any;
  api: any;
}) => {
  const { data } = await api.post(`/worklib/creatework`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✏️ Update Work Library
export const updateWorkLibrary = async ({
  workId,
  formData,
  api,
}: {
  workId: string;
  formData: any;
  api: any;
}) => {
  const { data } = await api.put(`/worklib/update/${workId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 🔎 Get Single Work Library
export const getSingleWorkLibrary = async ({
  workId,
  api,
}: {
  workId: string;
  api: any;
}) => {
  const { data } = await api.get(`/worklib/getsinglework/${workId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 📃 Get All Work Libraries (by organization)
export const getAllWorkLibraries = async ({
  orgId,
  api,
}: {
  orgId: string;
  api: any;
}) => {
  const { data } = await api.get(`/worklib/getallwork/${orgId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ❌ Delete Work Library
export const deleteWorkLibrary = async ({
  workId,
  api,
}: {
  workId: string;
  api: any;
}) => {
  const { data } = await api.delete(`/worklib/delete/${workId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const allowedRoles = ["owner", "staff", "CTO"];


// 🔁 Create Work Library Hook
export const useCreateWorkLibrary = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ formData }: { formData: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await createWorkLibrary({ formData, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workLibraries"] });
    },
  });
};

// 🔁 Update Work Library Hook
export const useUpdateWorkLibrary = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ workId, formData }: { workId: string; formData: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await updateWorkLibrary({ workId, formData, api });
    },
    onSuccess: (_, { workId }) => {
      queryClient.invalidateQueries({ queryKey: ["workLibrary", workId] });
    },
  });
};

// 🔁 Get Single Work Library Hook
export const useGetSingleWorkLibrary = (workId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["workLibrary", workId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await getSingleWorkLibrary({ workId, api });
    },
    enabled: !!workId,
    retry:false
  });
};

// 🔁 Get All Work Libraries (by orgId)
export const useGetAllWorkLibraries = (orgId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["workLibraries", orgId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await getAllWorkLibraries({ orgId, api });
    },
    enabled: !!orgId,
    retry:false
  });
};

// 🔁 Delete Work Library Hook
export const useDeleteWorkLibrary = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ workId }: { workId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await deleteWorkLibrary({ workId, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workLibraries"] });
    },
  });
};