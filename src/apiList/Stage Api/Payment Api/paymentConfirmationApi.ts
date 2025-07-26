import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../../Hooks/useGetRole";
import { getApiForRole } from "../../../utils/roleCheck";
import type { AxiosInstance } from "axios";



// GET
export const getPaymentConfirmationApi = async (projectId: string, api: any) => {
  const res = await api.get(`/paymentconfirmation/getpaymentconfirmation/${projectId}`);
  return res.data.data;
};

// TOGGLE
export const toggleConsentRequiredApi = async (projectId: string, api: any) => {
  const res = await api.put(`/paymentconfirmation/toggleconsent/${projectId}`);
  return res.data.data;
};

// GENERATE LINK
export const generateConsentLinkApi = async (projectId: string, api: any) => {
  const res = await api.post(`/paymentconfirmation/generatepayementconsentlink/${projectId}`);
  return res.data.data;
};

// ACCEPT CONSENT
export const acceptClientConsentApi = async (
  { projectId, token , api}: { projectId: string; token: string; api: AxiosInstance },
) => {
  const res = await api.post(`/paymentconfirmation/acceptconsent/${projectId}/${token}`);
  return res.data.data;
};


// ✅ GET full Payment Confirmation
export const useGetPaymentConfirmation = (projectId: string) => {
  const allowedRoles = ["CTO", "owner", "staff", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    enabled: !!projectId && !!role,
    queryKey: ["payment-confirmation", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await getPaymentConfirmationApi(projectId, api);
    },
    retry:false,
    refetchOnMount:false,
  });
};

// ✅ TOGGLE consent required
export const useToggleConsentRequired = () => {
  const allowedRoles = ["CTO", "owner", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await toggleConsentRequiredApi(projectId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-confirmation", projectId] });
    },
  });
};

// ✅ GENERATE consent link
export const useGenerateConsentLink = () => {
  const allowedRoles = ["CTO", "owner", "staff"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await generateConsentLinkApi(projectId, api);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-confirmation", projectId] });
    },
  });
};

// ✅ ACCEPT consent
export const useAcceptClientConsent = () => {
  const allowedRoles = ["CTO", "owner", "staff", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      token,
      // clientId,
    }: {
      projectId: string;
      token: string;
      // clientId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await acceptClientConsentApi({ projectId, token, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-confirmation", projectId] });
    },
  });
};


// ✅ 10. Set Deadline
 const setPaymentConfirmationDeadlineApi = async ({
  formId,
 projectId,  deadLine, api }:
  {  projectId: string,
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/paymentconfirmation/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completePaymentConfirmationStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/paymentconfirmation/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useSetPaymentConfirmationDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formId,
     projectId,  deadLine }: 
     {  projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setPaymentConfirmationDeadlineApi({ formId, projectId,deadLine, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-confirmation"] });
    },
  });
};

export const useCompletePaymentConfirmation = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completePaymentConfirmationStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-confirmation", projectId] });
      
    },
  });
};


