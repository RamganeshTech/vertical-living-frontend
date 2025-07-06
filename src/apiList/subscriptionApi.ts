import { useMutation } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../Hooks/useGetRole";
import { getApiForRole } from "../utils/roleCheck";
import { queryClient } from "../QueryClient/queryClient";



// ✅ Create a plan change order (choose subscription mode)
export const chooseSubscriptionModeApi = async ({
  newPlanType,
  api,
}: {
  newPlanType: string;
  api: AxiosInstance;
}) => {
  const res = await api.post(`/subscriptionpayment/choosesubscriptionmode`, {
    newPlanType,
  });
  return res.data.data;
};

// ✅ Verify the subscription payment after Razorpay success
export const verifySubscriptionPaymentApi = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  api,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  api: AxiosInstance;
}) => {
  const res = await api.post(`/subscriptionpayment/verify`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return res.data.data;
};




// ✅ Owner only: choose subscription mode
export const useChooseSubscriptionMode = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ newPlanType }: { newPlanType: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await chooseSubscriptionModeApi({ newPlanType, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-subscription"] });
    },
  });
};

// ✅ Verify payment (owner)
export const useVerifySubscriptionPayment = () => {
  const allowedRoles = ["owner"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await verifySubscriptionPaymentApi({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        api,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-subscription"] });
    },
  });
};
