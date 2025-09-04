import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";


// =============================
// API FUNCTIONS
// =============================

// ✅ Update recycle material manually
const updateRecycleMaterialManuallyApi = async ({
  organizationId,
  projectId,
  api,
}: {
  organizationId: string;
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(
    `/recyclematerial/updaterecyclemanually/${organizationId}/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const updateRecycleMaterialQuantity = async({
  organizationId,
  projectId,
  itemId,
  quantity,
  api}: {
  organizationId: string;
  projectId: string;
  itemId: string;
  quantity:number,
  api: AxiosInstance;
})=>{
  const { data } = await api.patch(
    `/recyclematerial/updatequantity/${organizationId}/${projectId}/${itemId}`, {quantity});
  if (!data.ok) throw new Error(data.message);
  return data.data;
}

// ✅ Get global recycle materials
const getGlobalMaterialsApi = async ({
  organizationId,
  api,
}: {
  organizationId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(
    `/recyclematerial/getglobalmaterials/${organizationId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ Get single project recycle materials
const getProjectMaterialsApi = async ({
  organizationId,
  projectId,
  api,
}: {
  organizationId: string;
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(
    `/recyclematerial/getsingleprojectmaterial/${organizationId}/${projectId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// =============================
// HOOKS
// =============================

// ✅ Hook: Update recycle material manually
export const useUpdateRecycleMaterialManually = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      organizationId,
      projectId,
    }: {
      organizationId: string;
      projectId: string;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await updateRecycleMaterialManuallyApi({
        organizationId,
        projectId,
        api,
      });
    },
    onSuccess: (_, { projectId, organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["recycle-materials", organizationId, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["recycle-materials", "global", organizationId],
      });
    },
  });
};



export const useUpdateRecycleMaterialQuantity = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      organizationId,
      projectId,
      itemId,
      quantity,
    }: {
      organizationId: string;
      projectId: string;
      itemId: string;
      quantity:number
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await updateRecycleMaterialQuantity({
        organizationId,
        projectId,
        quantity,
        itemId,
        api,
      });
    },
    onSuccess: (_, { projectId, organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["recycle-materials", organizationId, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["recycle-materials", "global", organizationId],
      });
    },
  });
};

// ✅ Hook: Get global recycle materials
export const useGetGlobalMaterials = (organizationId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["recycle-materials", "global", organizationId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await getGlobalMaterialsApi({ organizationId, api });
    },
    enabled: !!organizationId && !!api,
  });
};

// ✅ Hook: Get project recycle materials
export const useGetProjectMaterials = (
  organizationId: string,
  projectId: string
) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["recycle-materials", organizationId, projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("Not allowed to make this API call");
      if (!api) throw new Error("API instance not found for role");

      return await getProjectMaterialsApi({ organizationId, projectId, api });
    },
    enabled: !!organizationId && !!projectId && !!api,
  });
};
