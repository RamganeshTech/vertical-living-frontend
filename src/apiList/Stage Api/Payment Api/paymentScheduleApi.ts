import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiForRole } from "../../../utils/roleCheck";
import useGetRole from "../../../Hooks/useGetRole";
import type { AxiosInstance } from "axios";


// ṢTEP 2
// ===============================
// ✅ PAYMENT SCHEDULE API HELPERS
// ===============================

// GET Payment Schedule
export const getPaymentScheduleApi = async (projectId: string, api: any) => {
  const res = await api.get(`/paymentconfirmation/getschedule/${projectId}`);
  return res.data.data;
};


const updatePaymentScheduleDueDateApi = async ({
  projectId,
  dueDate,
  api,
}: {
  projectId: string;
  dueDate: string;
  api: AxiosInstance;
}) => {
  const res = await api.put(`/paymentconfirmation/dueDate/${projectId}`, {
    dueDate,
  });
  return res.data.data;
};

// UPDATE Client Approval Status
export const updateClientApprovalStatusApi = async ({
  projectId,
  status,
  api,
}: {
  projectId: string;
  status: "pending" | "approved" | "rejected";
  api: any;
}) => {
  const res = await api.put(`/paymentconfirmation/clientapprovalstatus/${projectId}`, { status });
  return res.data.data;
};

// UPDATE Client Notes
export const updateClientNotesApi = async ({
  projectId,
  notes,
  api,
}: {
  projectId: string;
  notes: string;
  api: any;
}) => {
  const res = await api.put(`/paymentconfirmation/clientnotes/${projectId}`, { notes });
  return res.data.data;
};

// UPDATE MD Approval Status
export const updateMdApprovalStatusApi = async ({
  projectId,
  status,
  api,
}: {
  projectId: string;
  status: "pending" | "approved" | "rejected";
  api: any;
}) => {
  const res = await api.put(`/paymentconfirmation/mdapprovalstatus/${projectId}`, { status });
  return res.data.data;
};

// UPDATE MD Notes
export const updateMdNotesApi = async ({
  projectId,
  notes,
  api,
}: {
  projectId: string;
  notes: string;
  api: any;
}) => {
  const res = await api.put(`/paymentconfirmation/mdnotes/${projectId}`, { notes });
  return res.data.data;
};

// ===============================
// ✅ PAYMENT SCHEDULE HOOKS
// ===============================


// GET Payment Schedule
export const useGetPaymentSchedule = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["payment-schedule", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch payment schedule");
      if (!api) throw new Error("API instance missing");
      return await getPaymentScheduleApi(projectId, api);
    },
    enabled: !!projectId && !!role,
     retry:false,
    refetchOnMount:false,
  });
};


export const useUpdatePaymentScheduleDueDate = () => {
  const allowedRoles = ["CTO", "owner", "staff", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      dueDate,
    }: {
      projectId: string;
      dueDate: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await updatePaymentScheduleDueDateApi({ projectId, dueDate, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-confirmation", projectId] });
    },
  });
};

// UPDATE Client Approval Status
export const useUpdateClientApprovalStatus = () => {
  const allowedRoles = ["owner", "staff", "CTO", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: "pending" | "approved" | "rejected" }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await updateClientApprovalStatusApi({ projectId, status, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-schedule", projectId] });
    },
  });
};

// UPDATE Client Notes
export const useUpdateClientNotes = () => {
  const allowedRoles = ["owner", "staff", "CTO", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, notes }: { projectId: string; notes: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await updateClientNotesApi({ projectId, notes, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-schedule", projectId] });
    },
  });
};

// UPDATE MD Approval Status
export const useUpdateMdApprovalStatus = () => {
  const allowedRoles = ["owner", "staff", "CTO", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: "pending" | "approved" | "rejected" }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await updateMdApprovalStatusApi({ projectId, status, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-schedule", projectId] });
    },
  });
};

// UPDATE MD Notes
export const useUpdateMdNotes = () => {
  const allowedRoles = ["owner", "staff", "CTO", "client"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, notes }: { projectId: string; notes: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance missing");
      return await updateMdNotesApi({ projectId, notes, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["payment-schedule", projectId] });
    },
  });
};
