import { type AxiosInstance } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

// -----------------------------
// ✅ RAW API CALLS
// -----------------------------

export const updatePreRequiretyNotes = async ({
  api,
  id,
  section,
  notes,
}: {
  api: AxiosInstance;
  id: string;
  section: string;
  notes: string;
}) => {
  const { data } = await api.patch(`/prerequireties/update/${id}/notes/${section}`, { notes });
  if (data.ok) return data;
  throw new Error(data.message || "Failed to update notes");
};

export const updatePreRequiretyBoolean = async ({
  api,
  id,
  section,
  isRequired,
}: {
  api: AxiosInstance;
  id: string;
  section: string;
  isRequired: boolean;
}) => {
  const { data } = await api.patch(`/prerequireties/update/${id}/boolean/${section}`, { isRequired });
  if (data.ok) return data;
  throw new Error(data.message || "Failed to update boolean");
};

export const getAllPreRequireties = async ({
  api,
  projectId,
}: {
  api: AxiosInstance;
  projectId: string;
}) => {
  const { data } = await api.get(`/prerequireties/getalldetails/${projectId}`);
  if (data.ok) return data;
  throw new Error(data.message || "Failed to get all PreRequireties");
};

export const getSinglePreRequirity = async ({
  api,
  projectId,
  section,
}: {
  api: AxiosInstance;
  projectId: string;
  section: string;
}) => {
  const { data } = await api.get(`/prerequireties/getsingle/${projectId}/${section}`);
  if (data.ok) return data;
  throw new Error(data.message || "Failed to get single PreRequirity");
};

// -----------------------------
// ✅ CUSTOM HOOKS
// -----------------------------

export const useUpdatePreRequiretyNotes = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];

  return useMutation({
    mutationFn: async ({
      id,
      section,
      notes,
    }: {
      id: string;
      section: string;
      notes: string;
    }) => {
      if (!role) throw new Error("Not Authorized");
      if (!allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await updatePreRequiretyNotes({ api, id, section, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["preRequireties"]});
    },
  });
};

export const useUpdatePreRequiretyBoolean = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];

  return useMutation({
    mutationFn: async ({
      id,
      section,
      isRequired,
    }: {
      id: string;
      section: string;
      isRequired: boolean;
    }) => {
      if (!role) throw new Error("Not Authorized");
      if (!allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await updatePreRequiretyBoolean({ api, id, section, isRequired });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["preRequireties"]});
    },
  });
};

export const useGetAllPreRequireties = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];

  return useQuery({
    queryKey: ["preRequireties", projectId],
    queryFn: async () => {
      if (!role) throw new Error("Not Authorized");
      if (!allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await getAllPreRequireties({ api, projectId });
    },
     retry:false,
    refetchOnMount:false
  });
};

export const useGetSinglePreRequirity = ({
  projectId,
  section,
}: {
  projectId: string;
  section: string;
}) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];

  return useQuery({
    queryKey: ["preRequirety", projectId, section],
    queryFn: async () => {
      if (!role) throw new Error("Not Authorized");
      if (!allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await getSinglePreRequirity({ api, projectId, section });
    },
    retry:false,
    refetchOnMount:false
  });
};
