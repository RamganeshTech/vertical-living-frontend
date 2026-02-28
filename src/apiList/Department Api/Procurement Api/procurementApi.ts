// procurementNew.queries.ts
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios, { type AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { queryClient } from "../../../QueryClient/queryClient";
// import type { IAccountsEntry } from "../Logistics Api/logisticsApi";


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



export const createProcurement = async ({

  payload,
  api,
}: {
  payload: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/department/procurement/create`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const getOrderMaterialfromDeptNumber = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/procurement/getordermaterial/fromdeptnumbers/${projectId}`);
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

// export const getProcurementNewDetailsApi = async ({
//   organizationId,
//   projectId,
//   api,
// }: {
//   organizationId: string;
//   api: AxiosInstance;
//   projectId?: string;
// }) => {
//      const params = new URLSearchParams();
//   if (organizationId) params.append("organizationId", organizationId);
//   if (projectId) params.append("projectId", projectId);
//   const { data } = await api.get(`/department/procurement/getprocurementall?${params.toString()}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };



export interface ProcurementFilters {
  projectId?: string;
  search?: string;
  isSyncWithPaymentsSection?: boolean | null; // null/undefined means "All"
  isConfirmedRate?: boolean | null;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
}

export const getProcurementNewDetailsApi = async ({
  organizationId,
  api,
  pageParam = 1,
  filters
}: {
  organizationId: string;
  api: AxiosInstance;
  pageParam?: number;
  filters?: ProcurementFilters;
}) => {
  const params = new URLSearchParams();

  // Required Params
  params.append("organizationId", organizationId);
  params.append("page", pageParam.toString());
  params.append("limit", "10"); // You can make this dynamic if needed

  // Optional Filters
  if (filters) {
    if (filters.projectId) params.append("projectId", filters.projectId);
    if (filters.search) params.append("search", filters.search);

    // Handle Booleans carefully (exclude if null/undefined)
    if (typeof filters.isSyncWithPaymentsSection === 'boolean') {
      params.append("isSyncWithPaymentsSection", String(filters.isSyncWithPaymentsSection));
    }
    if (typeof filters.isConfirmedRate === 'boolean') {
      params.append("isConfirmedRate", String(filters.isConfirmedRate));
    }

    if (filters.minAmount !== undefined) params.append("minAmount", String(filters.minAmount));
    if (filters.maxAmount !== undefined) params.append("maxAmount", String(filters.maxAmount));

    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
  }

  const { data } = await api.get(`/department/procurement/getprocurementall?${params.toString()}`);

  if (!data.ok) throw new Error(data.message);

  // Return the specific data structure expected by useInfiniteQuery
  return data.data;
};


// procurementNew.queries.ts
export const getSingleProcurementDetailsApi = async ({
  id,
}: {
  id: string;
}) => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/department/procurement/getprocurementsingle/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// not used
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


// const synAccountsFromProcurement = async ({
//   api,
//   organizationId,
//   projectId,
//   fromDept,
//   totalCost,
//   upiId
// }: IAccountsEntry) => {
//   const { data } = await api!.post(`/department/procurement/syncaccounting/${organizationId}/${projectId}`, {totalCost, fromDept, upiId});
//   if(!data.ok) throw new Error(data.message)
//   return data;
// }





const syncPaymentSectiontoProcurement = async ({ id, api }: { id: string; api: AxiosInstance }) => {
  const { data } = await api.post(`/department/procurement/synctopayments/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



export const confirmFinalShopQuoteApi = async ({
  id,
  quoteId,
  api,
}: {
  id: string;
  quoteId: string;
  api: AxiosInstance;
}) => {
  // Matches route: /confirmquote/:id/:quoteId
  const { data } = await api.put(`/department/procurement/confirmquote/${id}/${quoteId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const cancelProcurement = async ({ id, api }: { id: string; api: AxiosInstance }) => {
  const { data } = await api.post(`/department/procurement/cancelautomation/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



// PUBLIC APIS

const generateShareLink = async ({
  orderId,
  api,
}: {
  orderId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/department/procurement/generatetoken/${orderId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const backendPublicBase = `${import.meta.env.VITE_API_URL}/api/department/procurement`

export const getProcurementItemsPublicApi = async ({
  orderId,
  token,
  quoteId
}: {
  orderId: string
  token: string;
  quoteId: string
}) => {
  const { data } = await axios.get(`${backendPublicBase}/public/get?token=${token}&orderId=${orderId}&quoteId=${quoteId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const submitProcurementItemRateByShop = async ({
  orderId,
  token,
  payload,
}: {
  orderId: string
  token: string;
  payload: any;
}) => {
  const { data } = await axios.put(`${backendPublicBase}/public/updaterate?token=${token}&orderId=${orderId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


//  not used
export const updatePublicProcurementItemRateByShop = async ({
  orderId,
  itemId,
  token,
  payload,
}: {
  orderId: string;
  itemId: string;
  token: string;
  payload: any;
}) => {
  const { data } = await axios.put(`${backendPublicBase}/public/item/update?token=${token}&orderId=${orderId}&itemId=${itemId}`, payload);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const updatePublicProcurementItemRateByShopNewVersion = async ({
  orderId,
  itemId,
  token,
  quoteId,
  rate,
}: {
  orderId: string;
  itemId: string;
  token: string;
  quoteId: string;
  rate: any;
}) => {
  const { data } = await axios.put(`${backendPublicBase}/v1/public/item/update?token=${token}&orderId=${orderId}&itemId=${itemId}&quoteId=${quoteId}`, { rate });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


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
    onSuccess: (_, { id }) => {
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
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};




export const useCreateProcurement = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ payload }: { payload: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await createProcurement({ payload, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
    },
  });
};



export const useGetOrderMateiralRefPdfId = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["ordermaterial", "refId", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getOrderMaterialfromDeptNumber({ api, projectId: projectId });
    },
    enabled: !!projectId && !!role && !!api,
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

// export const useGetProcurementNewDetails = (organizationId: string, filters?: any) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["procurement", "details", organizationId, filters],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await getProcurementNewDetailsApi({ organizationId, api, projectId: filters.projectId });
//     },
//     enabled: !!organizationId && !!role && !!api,
//   });
// };



export const useGetProcurementNewDetails = (
  organizationId: string,
  filters: ProcurementFilters
) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useInfiniteQuery({
    // Include all filters in the Query Key so refetch happens automatically when filters change
    queryKey: ["procurement", "infinite", organizationId, filters],

    queryFn: async ({ pageParam = 1 }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");

      return await getProcurementNewDetailsApi({
        organizationId,
        api,
        pageParam, // React Query passes this automatically
        filters
      });
    },

    // Determine the next page number based on backend response
    getNextPageParam: (lastPage) => {
      // lastPage structure matches the backend: { items: [], hasNextPage: boolean, currentPage: number }
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined; // No more pages
    },

    // Initial Page Param
    initialPageParam: 1,

    enabled: !!organizationId && !!role && !!api,
  });
};


export const useGetSingleProcurementDetails = (id: string) => {

  return useQuery({
    queryKey: ["procurement", "single", id],
    queryFn: async () => {

      return await getSingleProcurementDetailsApi({ id });
    },
    enabled: !!id,
    refetchOnMount: true,
    // refetchOnWindowFocus: true,
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
    onSuccess: (_, { id }) => {
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
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generatedProcurementPdfLink({ id, api });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    },
  });
};




export const useDeleteProcurementPdf = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, pdfId }: { id: string, pdfId: string, }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Youre not allowed to delete pdf");
      if (!api) throw new Error("API instance not available");
      return await deleteProcurementPdf(id, pdfId, api);
    },
    onSuccess: (_, { id }) => {
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



// export const useSyncAccountsProcurement = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({ organizationId, projectId, fromDept, totalCost, upiId }: {organizationId:string, projectId:string, fromDept:"logistics" | "procurement" | "hr" | "factory" , totalCost:number, upiId:string | null }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await synAccountsFromProcurement({ organizationId, projectId, fromDept, totalCost, api , upiId});
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['logistics', 'shipments'] })
//     }
//   });
// };






export const useSyncProcurementToPaymentsSection = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API instance not found for role");
      return await syncPaymentSectiontoProcurement({ id, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};



export const useConfirmFinalShopQuote = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, quoteId }: { id: string; quoteId: string }) => {
      // Security & Role Check
      if (!role || !allowedRoles.includes(role)) throw new Error("Access Denied: Unauthorized role");
      if (!api) throw new Error("API instance not found for current role");

      return await confirmFinalShopQuoteApi({ id, quoteId, api });
    },
    onSuccess: (_, { id }) => {
      // Invalidate procurement lists and the specific procurement detail page
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", id] });
    }
  });
};




export const useCancelProcurementAutomation = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API instance not found for role");
      return await cancelProcurement({ id, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};








// public hooks]

export const useProcurementGenerateLink = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generateShareLink({ orderId, api });
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["procurement", "details"] });
      queryClient.invalidateQueries({ queryKey: ["procurement", "single", orderId] });
    },
  });
};




export const useGetProcurementItemsPublic = (token: string, orderId: string, quoteId: string) => {
  return useQuery({
    queryKey: ["procurement", "public", token],
    queryFn: async () => {
      return await getProcurementItemsPublicApi({ token, orderId, quoteId });
    },
    enabled: !!token,
    retry: false,
  });
};



//  not used 
export const usePublicUpdateProcurementRateSubmit = () => {
  return useMutation({
    mutationFn: async ({
      orderId,
      token,
      payload,
    }: {

      orderId: string;
      token: string;
      payload: Array<any>;
    }) => {
      return await submitProcurementItemRateByShop({ token, payload, orderId });
    },
  });
};







export const usePublicUpdateProcurementItemRate = () => {
  return useMutation({
    mutationFn: async ({
      orderId,
      itemId,
      token,
      payload,
    }: {

      orderId: string;
      itemId: string
      token: string;
      payload: Array<any>;
    }) => {
      return await updatePublicProcurementItemRateByShop({ token, payload, orderId, itemId });
    },
  });
};





export const usePublicUpdateProcurementItemRateNewVersion = () => {
  return useMutation({
    mutationFn: async ({
      orderId,
      itemId,
      token,
      quoteId,
      rate,
    }: {

      orderId: string;
      itemId: string
      token: string;
      quoteId: string,
      rate: number;
    }) => {
      return await updatePublicProcurementItemRateByShopNewVersion({ token, rate, orderId, itemId, quoteId });
    },
  });
};
