// import { type AxiosInstance } from "axios";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import useGetRole from "../../../Hooks/useGetRole";
// import { getApiForRole } from "../../../utils/roleCheck";
// import { queryClient } from "../../../QueryClient/queryClient";


// const allowedRoles = ["owner", "CTO", "staff"];


// // 🔹 GET all accounting records for an organization
// export const getAccountingAllApi = async ({
//   organizationId,
//   api,
//   filters,
//   search,
// }: {
//   organizationId: string;
//   api: AxiosInstance;
//   search?: string,
//   filters?: { projectId?: string; fromDept?: string; status?: string };
// }) => {
//   const params = new URLSearchParams();
//   if (organizationId) params.append("organizationId", organizationId);
//   if (filters?.projectId) params.append("projectId", filters.projectId);
//   if (filters?.fromDept) params.append("fromDept", filters.fromDept);
//   if (filters?.status) params.append("status", filters.status);
//   if (search) params.append("search", search);

//   const { data } = await api.get(
//     `/department/accounting/getaccountingall?${params.toString()}`
//   );

//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };


// export const getSingleAccountingApi = async ({
//   id,
//   api,
// }: {
//   id: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.get(`/department/accounting/single/${id}`);
//   if (!data.ok) throw new Error(data.message);
//   return data.data;
// };


// // 🔹 UPDATE accounting record
// export const updateAccountingApi = async ({
//   id,
//   payload,
//   api,
// }: {
//   id: string;
//   payload: any;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/department/accounting/update/${id}`, payload);
//   if (!data.ok) throw new Error(data.message);
//   return data.updated;
// };




// // 🔹 UPDATE accounting record
// export const addInstallmentsApi = async ({
//   id,
//   installments,
//   api,
// }: {
//   id: string;
//   installments: any;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.put(`/department/accounting/addinstallments/${id}`, installments);
//   if (!data.ok) throw new Error(data.message);
//   return data.updated;
// };




// // 🔹 DELETE accounting record
// export const deleteAccountingApi = async ({
//   id,
//   api,
// }: {
//   id: string;
//   api: AxiosInstance;
// }) => {
//   const { data } = await api.delete(
//     `/department/accounting/delete/${id}`
//   );
//   if (!data.ok) throw new Error(data.message);
//   return data.deleted;
// };



// export const useGetAccountingAll = (
//   organizationId: string,
//   filters?: { projectId?: string; fromDept?: string; status?: string },
//   search?: string
// ) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["accounting", "all", organizationId, filters, search],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await getAccountingAllApi({ organizationId, api, filters, search });
//     },
//     enabled: !!organizationId && !!role && !!api,
//   });
// };


// // 🔹 React Query hook
// export const useGetSingleAccounting = (id: string) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["accounting", "single"],
//     queryFn: async () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await getSingleAccountingApi({ id, api });
//     },
//     enabled: !!id && !!role && !!api,
//   });
// };


// export const useUpdateAccounting = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await updateAccountingApi({ id, payload, api });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
//       queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });
//     },
//   });
// };




// export const useAddInstallment = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({ id, installments }: { id: string; installments: any }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await addInstallmentsApi({ id, installments, api });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
//       queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });
//     },
//   });
// };





// export const useDeleteAccounting = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       id,
//     }: {
//       id: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance not found for role");
//       return await deleteAccountingApi({ id, api });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["accounting", "all"] });
//     },
//   });
// };





// // PAYMENT API (NOT USED )


// export const createPaymentOrderApi = async ({
//   accountingId,
//   installmentId,
//   api,
// }: {
//   accountingId: string;
//   installmentId: string;
//   api: AxiosInstance;
// }) => {
//   const res = await api.post(`/department/accounting/createorder/${accountingId}/${installmentId}`);
//   return res.data.data;
// };

// export const verifyPaymentApi = async ({
//   accId,
//   installmentId,
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature,
//   api,
// }: {
//   accId: string;
//   installmentId: string;
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
//   api: AxiosInstance;
// }) => {
//   const res = await api.post(`/department/accounting/verifypayment/${accId}/${installmentId}`, {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//   });
//   return res.data.data;
// };



// export const useCreateAccountPaymentOrder = () => {
//   const allowedRoles = ["CTO", "staff", "owner",];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       accountingId,
//       installmentId
//     }: {
//       accountingId: string;
//       installmentId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance missing");
//       return await createPaymentOrderApi({
//         accountingId,
//         installmentId, api
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
//       queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });

//     },
//   });
// };


// export const useVerifyAccountInstallPayment = () => {
//   const allowedRoles = ["CTO", "owner", "staff"];
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({
//       accId,
//       installmentId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     }: {
//       accId: string;
//       installmentId: string;
//       razorpay_order_id: string;
//       razorpay_payment_id: string;
//       razorpay_signature: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance missing");
//       return await verifyPaymentApi({
//         accId,
//         installmentId,
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         api,
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
//       queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });
//     },
//   });
// };





// // NEW PAYMENT API TO PAY TO VENDORS

// export const usePayInstallment = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useMutation({
//     mutationFn: async ({ accountingId, installmentId }: { accountingId: string; installmentId: string }) => {

//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance missing");

//       const { data } = await api.post(`/department/accounting/${accountingId}/installments/${installmentId}/pay`);
//       if (!data.ok) throw new Error(data.message);
//       return data.data;
//     }
//   });
// };

// export const useCheckPayoutStatus = (accountingId: string, installmentId: string) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ["acc-payout-status", accountingId, installmentId],
//     queryFn: async () => {

//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("API instance missing");

//       const { data } = await api.get(`/department/accounting/${accountingId}/installments/${installmentId}/status`);
//       if (!data.ok) throw new Error(data.message);
//       return data.data;
//     },
//     enabled: !!accountingId && !!installmentId,
//     refetchInterval: 5000 // Check every 5 seconds
//   });
// };





import { type AxiosInstance } from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";


const allowedRoles = ["owner", "CTO", "staff"];



export interface AccountingFilters {
  projectId?: string;
  fromDept?: string; // Maps to 'deptRecordFrom'
  status?: string;
  search?: string,
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  personName?: string; // For specific person filter, separate from global search
}

interface AccountingResponse {
  success: boolean;
  ok?: boolean; // Handling legacy response format
  message?: string;
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


// 🔹 GET all accounting records (Infinite Scroll)
export const getAccountingAllApi = async ({
  organizationId,
  api,
  filters,
  pageParam = 1,
}: {
  organizationId: string;
  api: AxiosInstance;
  filters?: AccountingFilters;
  pageParam: number;
}) => {
  
  // Map frontend filters to backend query params
  const params: any = {
    organizationId,
    page: pageParam,
    limit: 20, // Batch size
  };

    // --- 1. Apply Filters ---
  if (filters?.projectId) params.projectId = filters.projectId;
  
  if (filters?.status) params.status = filters.status;

  if (filters?.search) params.search = filters.search;
  // Map Frontend 'fromDept' -> Backend 'deptRecordFrom'
  if (filters?.fromDept) params.deptRecordFrom = filters.fromDept;

  // Date Range (Backend uses 'deptGeneratedDate')
  if (filters?.startDate) params.startDate = filters.startDate;
  if (filters?.endDate) params.endDate = filters.endDate;

  // Amount Range (Backend uses 'amount')
  if (filters?.minAmount !== undefined) params.minAmount = filters.minAmount;
  if (filters?.maxAmount !== undefined) params.maxAmount = filters.maxAmount;

  // Specific Person Filter
  if (filters?.personName) params.personName = filters.personName;

  // --- 2. Apply Global Search ---
  // Maps to 'search' in backend (RegEx on Number, Name, Notes)
  // if (search) params.search = search;


  const { data } = await api.get<AccountingResponse>(
    `/department/accounting/getaccountingall`,
    { params }
  );

  // Handle both 'success' (new controller) and 'ok' (old standard)
  if (!data.ok) throw new Error(data.message || "Failed to fetch records");
  
  return data;
};

// 🔹 GET Single Record
export const getSingleAccountingApi = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/department/accounting/single/${id}`);
  if (!data.success && !data.ok) throw new Error(data.message || "Failed to fetch record");
  return data;
};

// ============================================================================
// HOOKS
// ============================================================================

// 🔹 Infinite Query Hook for Accounting List
export const useGetAccountingAll = (
  organizationId: string,
  filters?: AccountingFilters,
  // search?: string
) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useInfiniteQuery({
    // Unique key: Refetches when any filter/search changes
    queryKey: ["accounting", "infinite", organizationId, filters],
    
    queryFn: async ({ pageParam = 1 }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");

      return await getAccountingAllApi({
        organizationId,
        api,
        filters,
        // search,
        pageParam: pageParam as number,
      });
    },

    initialPageParam: 1,

    // Determine next page based on backend response
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },

    enabled: !!organizationId && !!role && !!api,
  });
};

// 🔹 Single Query Hook (Standard)
export const useGetSingleAccounting = (id: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["accounting", "single", id],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await getSingleAccountingApi({ id, api });
    },
    enabled: !!id && !!role && !!api,
  });
};