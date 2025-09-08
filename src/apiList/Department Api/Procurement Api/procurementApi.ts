// procurementNew.queries.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";
import type { IAccountsEntry } from "../Logistics Api/logisticsApi";


// ---------------------- API FUNCTIONS ----------------------

export const updateProcurementShopDetailsApi = async ({
  id,
  payload,
  api,
}: {
  id: string;
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/procurement/updateshop/${id}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const updateProcurementDeliveryLocationApi = async ({
  id,
  payload,
  api,
}: {
  id: string;
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/procurement/updatedelivery/${id}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const deleteProcurementApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/department/procurement/deleteprocurement/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const getProcurementNewDetailsApi = async ({
  organizationId,
  projectId,
  api,
}: {
  organizationId: string;
  api: AxiosInstance;
  projectId?: string;
}) => {
     const params = new URLSearchParams();
  if (organizationId) params.append("organizationId", organizationId);
  if (projectId) params.append("projectId", projectId);
  const { data } = await api.get(`/department/procurement/getprocurementall?${params.toString()}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// procurementNew.queries.ts
export const getSingleProcurementDetailsApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/procurement/getprocurementsingle/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const updateProcurementTotalCostApi = async ({
  id,
  payload,
  api,
}: {
  id: string;
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/procurement/updatetotalcost/${id}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const generatedProcurementPdfLink = async ({
 id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(`/department/procurement/generatepdf/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




const deleteProcurementPdf = async (
  id: string,
  pdfId: string,
  api: AxiosInstance
) => {
  const { data } = await api.delete(`/department/procurement/deletepdf/${id}/${pdfId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const syncLogisticsDept = async ( id: string, api: AxiosInstance)=>{
  const { data } = await api.post(`/department/procurement/synclogistics/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
}


const synAccountsFromProcurement = async ({
  api,
  organizationId,
  projectId,
  fromDept,
  totalCost,
  upiId
}: IAccountsEntry) => {
  const { data } = await api!.post(`/department/procurement/syncaccounting/${organizationId}/${projectId}`, {totalCost, fromDept, upiId});
  if(!data.ok) throw new Error(data.message)
  return data;
}

// ---------------------- HOOKS ----------------------
const allowedRoles = ["owner", "CTO", "staff"];

export const useUpdateProcurementShopDetails = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await updateProcurementShopDetailsApi({ id, payload, api });
    },
     onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};

export const useUpdateProcurementDeliveryLocation = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await updateProcurementDeliveryLocationApi({ id, payload, api });
    },
    onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};

export const useDeleteProcurement = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await deleteProcurementApi({ id, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
    },
  });
};

export const useGetProcurementNewDetails = (organizationId: string, filters?: any) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["procurement", "details", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getProcurementNewDetailsApi({ organizationId, api, projectId: filters.projectId });
    },
    enabled: !!organizationId && !!role && !!api,
  });
};


export const useGetSingleProcurementDetails = (id: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["procurement", "single", id],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleProcurementDetailsApi({ id, api });
    },
    enabled: !!id && !!role && !!api,
  });
};


export const useUpdateProcurementTotalCost = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await updateProcurementTotalCostApi({ id, payload, api });
    },
     onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};





export const useProcurementGeneratePdf = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id}: { id: string}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generatedProcurementPdfLink({ id, api });
    },
    onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};








export const useDeleteProcurementPdf = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, pdfId }: {id:string, pdfId: string,}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Youre not allowed to delete pdf");
      if (!api) throw new Error("API instance not available");
      return await deleteProcurementPdf(id, pdfId, api);
    },
     onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};



export const useSyncLogistics = ()=>{
    const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, }: {id:string,}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Youre not allowed to delete pdf");
      if (!api) throw new Error("API instance not available");
      return await syncLogisticsDept(id, api);
    },
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] });
    },
  });
}



export const useSyncAccountsProcurement = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ organizationId, projectId, fromDept, totalCost, upiId }: {organizationId:string, projectId:string, fromDept:"logistics" | "procurement" | "hr" | "factory" , totalCost:number, upiId:string | null }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await synAccountsFromProcurement({ organizationId, projectId, fromDept, totalCost, api , upiId});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] })
    }
  });
};

