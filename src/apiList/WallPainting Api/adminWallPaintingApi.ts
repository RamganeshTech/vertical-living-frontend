
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";


// -------------------------------
// 🔗 1️⃣ Get full Admin SOP

import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

// -------------------------------
export const getAdminSOPApi = async (projectId: string, api: AxiosInstance) => {
  const res = await api.get(`/adminwall/${projectId}`);
  return res.data;
};

// -------------------------------
// 🔗 2️⃣ Get single Admin Step
// -------------------------------
export const getAdminStepDetailsApi = async (
  projectId: string,
  stepId: string,
  api: AxiosInstance
) => {
  const res = await api.get(`/adminwall/${projectId}/step/${stepId}`);
  return res.data;
};

// -------------------------------
// 🔗 3️⃣ Upload Admin Correction Round
// -------------------------------
export const uploadAdminCorrectionRoundApi = async (
  projectId: string,
  stepId: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const res = await api.post(
    `/adminwall/${projectId}/step/${stepId}/correction`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

// -------------------------------
// 🔗 4️⃣ Approve Admin Step
// -------------------------------
export const approveAdminStepApi = async (
  projectId: string,
  stepId: string,
  payload: { status: "approved" | "rejected" },
  api: AxiosInstance
) => {
  const res = await api.patch(`/adminwall/${projectId}/step/${stepId}/approve`, payload);
  return res.data;
};


// -------------------------------------------------
// ✅✅✅ CUSTOM HOOKS SECTION BELOW
// -------------------------------------------------

// -------------------------------
// 1️⃣ useGetAdminSOP
// -------------------------------
export const useGetAdminSOP = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["owner", "staff", "CTO"];
  return useQuery({
    queryKey: ["adminSOP", projectId],
    queryFn: () => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getAdminSOPApi(projectId, api);
    },
  });
};

// -------------------------------
// 2️⃣ useGetAdminStepDetails
// -------------------------------
export const useGetAdminStepDetails = (projectId: string, stepId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["owner", "staff", "CTO"];
  return useQuery({
    queryKey: ["adminStep", projectId, stepId],
    queryFn: () => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getAdminStepDetailsApi(projectId, stepId, api);
    },
  });
};

// -------------------------------
// 3️⃣ useUploadAdminCorrectionRound
// -------------------------------
export const useUploadAdminCorrectionRound = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({
      projectId,
      stepId,
      formData,
    }: {
      projectId: string;
      stepId: string;
      formData: FormData;
    }) => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return uploadAdminCorrectionRoundApi(projectId, stepId, formData, api);
    },
  });
};

// -------------------------------
// 4️⃣ useApproveAdminStep
// -------------------------------
export const useApproveAdminStep = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({
      projectId,
      stepId,
      payload,
    }: {
      projectId: string;
      stepId: string;
      payload: { status: "approved" | "rejected" };
    }) => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return approveAdminStepApi(projectId, stepId, payload, api);
    },
  });
};
