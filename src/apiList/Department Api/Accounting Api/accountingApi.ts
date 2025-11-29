import { type AxiosInstance } from "axios";
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
  if (organizationId) params.append("organizationId", organizationId);
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




// 🔹 UPDATE accounting record
export const addInstallmentsApi = async ({
  id,
  installments,
  api,
}: {
  id: string;
  installments: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/department/accounting/addinstallments/${id}`, installments);
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
      queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });
    },
  });
};




export const useAddInstallment = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ id, installments }: { id: string; installments: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found for role");
      return await addInstallmentsApi({ id, installments, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });
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
      return await deleteAccountingApi({ id, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "all"] });
    },
  });
};





// PAYMENT API (NOT USED )


export const createPaymentOrderApi = async ({
  accountingId,
  installmentId,
  api,
}: {
  accountingId: string;
  installmentId: string;
  api: AxiosInstance;
}) => {
  const res = await api.post(`/department/accounting/createorder/${accountingId}/${installmentId}`);
  return res.data.data;
};

export const verifyPaymentApi = async ({
  accId,
  installmentId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  api,
}: {
  accId: string;
  installmentId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  api: AxiosInstance;
}) => {
  const res = await api.post(`/department/accounting/verifypayment/${accId}/${installmentId}`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return res.data.data;
};



export const useCreateAccountPaymentOrder = () => {
  const allowedRoles = ["CTO", "staff", "owner",];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      accountingId,
      installmentId
    }: {
      accountingId: string;
      installmentId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await createPaymentOrderApi({
        accountingId,
        installmentId, api
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });

    },
  });
};


export const useVerifyAccountInstallPayment = () => {
  const allowedRoles = ["CTO", "owner", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      accId,
      installmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: {
      accId: string;
      installmentId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await verifyPaymentApi({
        accId,
        installmentId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        api,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "all"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["accounting", "single"] });
    },
  });
};





// NEW PAYMENT API TO PAY TO VENDORS

export const usePayInstallment = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ accountingId, installmentId }: { accountingId: string; installmentId: string }) => {

      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");

      const { data } = await api.post(`/department/accounting/${accountingId}/installments/${installmentId}/pay`);
      if (!data.ok) throw new Error(data.message);
      return data.data;
    }
  });
};

export const useCheckPayoutStatus = (accountingId: string, installmentId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["acc-payout-status", accountingId, installmentId],
    queryFn: async () => {

      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");

      const { data } = await api.get(`/department/accounting/${accountingId}/installments/${installmentId}/status`);
      if (!data.ok) throw new Error(data.message);
      return data.data;
    },
    enabled: !!accountingId && !!installmentId,
    refetchInterval: 5000 // Check every 5 seconds
  });
};