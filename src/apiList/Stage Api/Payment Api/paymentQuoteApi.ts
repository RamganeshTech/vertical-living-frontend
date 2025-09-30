import { useQuery } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";

// GET Payment Schedule
export const getAllPaymentQuotes = async (projectId: string, api: any) => {
  const res = await api.get(`/paymentconfirmation/getallquotes/${projectId}`);
  return res.data.data;
};


export const getSingleQuotePayment = async (projectId: string, id:string, api: any) => {
  const res = await api.get(`/paymentconfirmation/getsinglequotes/${projectId}/${id}`);
  return res.data.data;
};


export const usePaymentAllQuotes = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["payment-quote", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch payment schedule");
      if (!api) throw new Error("API instance missing");
      return await getAllPaymentQuotes(projectId, api);
    },
    enabled: !!projectId && !!role,
     retry:false,
    refetchOnMount:false,
  });
};



export const usePaymentSingleQuotes = (projectId: string, id:string) => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["payment-quote-single", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch payment schedule");
      if (!api) throw new Error("API instance missing");
      return await getSingleQuotePayment(projectId, id, api);
    },
    enabled: !!projectId && !!role,
     retry:false,
    refetchOnMount:false,
  });
};


