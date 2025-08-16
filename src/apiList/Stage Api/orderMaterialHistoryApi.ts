import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";
import axios from "axios";



const getAllOrderHistory = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
  const { data } = await api.get(`/orderingmaterial/getalldetails/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
}



export const useGetAllOrderingMaterialHistory = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"]
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["ordering-material-history", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch ordering material");
      if (!api) throw new Error("API not available");
      return await getAllOrderHistory({ projectId, api });
    },
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};



// ✅ 10. Set Deadline
const setOrderMaterialDeadlineApi = async ({
  formId,
  projectId, deadLine, api }:
  {
    projectId: string,
    formId: string;
    deadLine: string;
    api: AxiosInstance;
  }) => {
  const { data } = await api.put(`/orderingmaterial/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
const completeOrderMaterialHistoryStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/orderingmaterial/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const updateDeliveryLocationApi = async (
  projectId: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/orderingmaterial/${projectId}/delivery-location`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateDeliveryLocation = () => {
  const allowedRoles = ["owner", "staff", "CTO"]

  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, updates }: {projectId:string, updates:any}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update delivery location");
      if (!api) throw new Error("API instance not available");
      return await updateDeliveryLocationApi(projectId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material", projectId] });
    },
  });
};


export const useSetOrderingMaterialHistoryDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      formId,
      projectId, deadLine,
    }: {
      projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setOrderMaterialDeadlineApi({ formId, projectId, deadLine, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", vars.projectId] });
    },
  });
};

export const useCompleteOrderingMaterialHistoryStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeOrderMaterialHistoryStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", projectId] });
    },
  });
};




const getPublicOrderhsitory = async ({ projectId }: { projectId: string }) => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orderingmaterial/getpublic/${projectId}`);
  console.log("data", data)
  if (!data.ok) throw new Error(data.message);
  return data.data;
}

export const useGetOrderPublicDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["ordering-material-public", projectId],
    queryFn: async () => {
      return await getPublicOrderhsitory({ projectId });
    },
    enabled: !!projectId,
    retry: false,
    refetchOnMount: false,
  });
};



const generatedPublicLink = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/orderingmaterial/generatelink/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useOrderHistoryGenerateLink = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generatedPublicLink({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", projectId] });
    },
  });
};



// SUB ITEMS HOOKS

// ✅ Add SubItem
const addOrderingMaterialSubItemApi = async ({
  projectId,
  unitId,
  subItemName,
  quantity,
  unit,
  api,
}: {
  projectId: string;
  unitId: string;
  subItemName: string;
  quantity: number;
  unit: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(
    `/orderingmaterial/${projectId}/unit/${unitId}/addsubitem`,
    { subItemName, quantity, unit }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useAddOrderingMaterialSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      unitId,
      subItemName,
      quantity,
      unit,
    }: {
      projectId: string;
      unitId: string;
      subItemName: string;
      quantity: number;
      unit: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await addOrderingMaterialSubItemApi({ projectId, unitId, subItemName, quantity, unit, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", vars.projectId] });
    },
  });
};

// ✅ Delete SubItem
const deleteOrderingMaterialSubItemApi = async ({
  projectId,
  unitId,
  subItemId,
  api,
}: {
  projectId: string;
  unitId: string;
  subItemId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/orderingmaterial/${projectId}/unit/${unitId}/deletesubitem/${subItemId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteOrderingMaterialSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      unitId,
      subItemId,
    }: {
      projectId: string;
      unitId: string;
      subItemId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await deleteOrderingMaterialSubItemApi({ projectId, unitId, subItemId, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", vars.projectId] });
    },
  });
};

// ✅ Update SubItem
const updateOrderingMaterialSubItemApi = async ({
  projectId,
  unitId,
  subItemId,
  subItemName,
  quantity,
  unit,
  api,
}: {
  projectId: string;
  unitId: string;
  subItemId: string;
  subItemName?: string;
  quantity?: number;
  unit?: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(
    `/orderingmaterial/${projectId}/unit/${unitId}/updatesubitem/${subItemId}`,
    { subItemName, quantity, unit }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateOrderingMaterialSubItem = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      unitId,
      subItemId,
      subItemName,
      quantity,
      unit,
    }: {
      projectId: string;
      unitId: string;
      subItemId: string;
      subItemName?: string;
      quantity?: number;
      unit?: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await updateOrderingMaterialSubItemApi({
        projectId,
        unitId,
        subItemId,
        subItemName,
        quantity,
        unit,
        api,
      });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", vars.projectId] });
    },
  });
};


// ==========  UPDATE SHOP DETAILS ==========
const updateShopDetailsApi = async (
  projectId: string,
  updates: any,
  api: AxiosInstance
) => {
  const { data } = await api.put(`/orderingmaterial/${projectId}/shop`, updates);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useUpdateShopDetails = () => {
  const allowedRoles = ["owner", "staff", "CTO"];

  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, updates }: {projectId:string, updates:any}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to update shop details");
      if (!api) throw new Error("API instance not available");
      return await updateShopDetailsApi(projectId, updates, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", projectId] });
    },
  });
};



const deleteOrderPdf = async (
  projectId: string,
  pdfId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/orderingmaterial/delete/${projectId}/${pdfId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const useDeleteOrderMaterialPdf = () => {
  const allowedRoles = ["owner", "staff", "CTO"];

  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, pdfId }: {projectId:string, pdfId: string,}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Youre not allowed to delete pdf");
      if (!api) throw new Error("API instance not available");
      return await deleteOrderPdf(projectId, pdfId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["ordering-material-history", projectId] });
    },
  });
};


