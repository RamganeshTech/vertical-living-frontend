
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";


// -------------------------------
// 🔗 5️⃣ Get full Worker SOP


// -------------------------------
export const getWorkerSOPApi = async (projectId: string, api: AxiosInstance) => {
  const res = await api.get(`/workerwall/${projectId}`);
  return res.data?.data;
};

// -------------------------------
// 🔗 6️⃣ Get single Worker Step
// -------------------------------
export const getWorkerStepDetailsApi = async (
  projectId: string,
  stepId: string,
  api: AxiosInstance
) => {
  const res = await api.get(`/workerwall/${projectId}/step/${stepId}`);
  console.log("res form getsworkerdetialapi",res)
  return res.data;
};

// -------------------------------
// 🔗 7️⃣ Upload Worker Initial Files
// -------------------------------
export const uploadWorkerInitialFilesApi = async (
  projectId: string,
  stepNumber: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const res = await api.post(
    `/workerwall/${projectId}/step/${stepNumber}/initial`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

// -------------------------------
// 🔗 8️⃣ Upload Worker Correction Files
// -------------------------------
export const uploadWorkerCorrectionFilesApi = async (
  projectId: string,
  stepNumber: string,
  correctionRound: string,
  formData: FormData,
  api: AxiosInstance
) => {
  const res = await api.post(
    `/workerwall/${projectId}/step/${stepNumber}/correction/${correctionRound}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};






// -------------------------------
// 5️⃣ useGetWorkerSOP
// -------------------------------
export const useGetWorkerSOP = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["worker", "staff", "owner", "CTO"];
  return useQuery({
    queryKey: ["workerSOP", projectId],
    queryFn: () => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getWorkerSOPApi(projectId, api);
    },
  });
};

// -------------------------------
// 6️⃣ useGetWorkerStepDetails
// -------------------------------
export const useGetWorkerStepDetails = (projectId: string, stepId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["worker", "staff", "owner", "CTO"];
  return useQuery({
    queryKey: ["workerStep", projectId, stepId],
    queryFn: () => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getWorkerStepDetailsApi(projectId, stepId, api);
    },
  });
};

// -------------------------------
// 7️⃣ useUploadWorkerInitialFiles
// -------------------------------
export const useUploadWorkerInitialFiles = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["worker", "staff"];
  return useMutation({
    mutationFn: async ({
      projectId,
      stepNumber,
      formData,
    }: {
      projectId: string;
      stepNumber: string;
      formData: FormData;
    }) => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return uploadWorkerInitialFilesApi(projectId, stepNumber, formData, api);
    },
  });
};

// -------------------------------
// 8️⃣ useUploadWorkerCorrectionFiles
// -------------------------------
export const useUploadWorkerCorrectionFiles = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowed = ["worker", "staff"];
  return useMutation({
    mutationFn: async ({
      projectId,
      stepNumber,
      correctionRound,
      formData,
    }: {
      projectId: string;
      stepNumber: string;
      correctionRound: string;
      formData: FormData;
    }) => {
      if (!role || !allowed.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return uploadWorkerCorrectionFilesApi(projectId, stepNumber, correctionRound, formData, api);
    },
  });
};

