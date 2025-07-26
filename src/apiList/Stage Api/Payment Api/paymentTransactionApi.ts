// 📂 src/api/payment/paymentTransaction.api.ts

import {type  AxiosInstance } from "axios";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../QueryClient/queryClient";

export const createPaymentOrderApi = async ({
  projectId,
  clientId,
  api,
}: {
  projectId: string;
  clientId: string;
  api: AxiosInstance;
}) => {
  const res = await api.post(`/paymentconfirmation/createorder/${projectId}`, {
    clientId,
  });
  return res.data.data;
};

export const verifyPaymentApi = async ({
  projectId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  api,
}: {
  projectId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  api: AxiosInstance;
}) => {
  const res = await api.post(`/paymentconfirmation/verifypayment/${projectId}`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return res.data.data;
};



export const getPaymentTransactionApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const res = await api.get(`/paymentconfirmation/gettransaction/${projectId}`);
  return res.data.data;
};







//  hooks 



export const useCreatePaymentOrder = () => {
  const allowedRoles = ["client", "staff", "owner", ];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      clientId,
    }: {
      projectId: string;
      clientId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await createPaymentOrderApi({ projectId, clientId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["payment-confirmation", projectId],
      });
    },
  });
};


export const useVerifyPayment = () => {
  const allowedRoles = ["client", "owner", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: {
      projectId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await verifyPaymentApi({
        projectId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["payment-confirmation", projectId],
      });
    },
  });
};

export const useGetPaymentTransaction = (projectId: string) => {
  const allowedRoles = ["client", "staff", "owner", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["payment-confirmation", projectId, "transaction"],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await getPaymentTransactionApi({ projectId, api });
    },
    enabled: !!projectId && !!api && !!role,
     retry:false,
    refetchOnMount:false,
  });
};
