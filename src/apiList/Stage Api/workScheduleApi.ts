// ✅ your role + api utility is assumed:
import { getApiForRole } from "../../utils/roleCheck"; 
import { useQuery, useMutation } from "@tanstack/react-query";
import useGetRole from './../../Hooks/useGetRole';
import type { AxiosInstance } from "axios";



import type {
  IWorkMainStageSchedule,
  IWorkSchedule,
  IDailySchedule,
  IWorkPlan,
  IDailyTask,
} from '../../types/types'
import { queryClient } from "../../QueryClient/queryClient";

// 🗂️ GET APIs
export const getWorkMainStageApi = async (projectId: string, api: AxiosInstance)=> {
  const res = await api.get(`/worktasks/getworktaksmain/${projectId}`);
  return res.data.data;
};

export const getWorkScheduleApi = async (projectId: string, api: AxiosInstance) => {
  const res = await api.get(`/worktasks/getworkschedule/${projectId}`);
  return res.data.data;
};

export const getDailyScheduleApi = async (projectId: string, api: AxiosInstance) => {
  const res = await api.get(`/worktasks/getdailyschedule/${projectId}`);
  return res.data.data;
};

export interface IProjectWorker {
  _id: string;
  name: string;
  [key: string]: any;
}

export const getProjectWorkersApi = async (projectId: string, api: AxiosInstance) => {
  const res = await api.get(`/worktasks/${projectId}/getworkers`);
  return res.data;
};


// 🗂️ ADD ITEM
export const addDailyTaskApi = async (
  dailyScheduleId: string,
  data: FormData,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/daily-task/${dailyScheduleId}`, data);
  return res.data;
};

export const addWorkPlanApi = async (
  workScheduleId: string,
  data: FormData,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/work-plan/${workScheduleId}`, data);
  return res.data;
};

// 🗂️ UPDATE ITEM
export const updateDailyTaskApi = async (
  dailyScheduleId: string,
  taskId: string,
  data: FormData,
  api: AxiosInstance
) => {
  const res = await api.put(`/worktasks/daily-task/${dailyScheduleId}/${taskId}`, data);
  return res.data;
};

export const updateWorkPlanApi = async (
  workScheduleId: string,
  planId: string,
  data: FormData,
  api: AxiosInstance
) => {
  const res = await api.put(`/worktasks/work-plan/${workScheduleId}/${planId}`, data);
  return res.data;
};

// 🗂️ DELETE ITEM
export const deleteDailyTaskApi = async (
  dailyScheduleId: string,
  taskId: string,
  api: AxiosInstance
) => {
  const res = await api.delete(`/worktasks/daily-task/${dailyScheduleId}/${taskId}`);
  return res.data;
};

export const deleteWorkPlanApi = async (
  workScheduleId: string,
  planId: string,
  api: AxiosInstance
) => {
  const res = await api.delete(`/worktasks/work-plan/${workScheduleId}/${planId}`);
  return res.data;
};

// 🗂️ MD APPROVAL
export interface IMdApprovalPayload {
  action: "approved" | "rejected";
  remarks: string;
}

export const mdApprovalActionApi = async (
  mainStageId: string,
  payload: IMdApprovalPayload,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/md-approval/${mainStageId}`, payload);
  return res.data;
};

// 🗂️ STATUS
export interface IStatusPayload {
  status: "pending" | "completed";
}

export const updateDailyScheduleStatusApi = async (
  dailyScheduleId: string,
  payload: IStatusPayload,
  api: AxiosInstance
) => {
  const res = await api.patch(`/worktasks/daily-schedule/${dailyScheduleId}/status`, payload);
  return res.data;
};

export const updateWorkScheduleStatusApi = async (
  workScheduleId: string,
  payload: IStatusPayload,
  api: AxiosInstance
) => {
  const res = await api.patch(`/worktasks/work-schedule/${workScheduleId}/status`, payload);
  return res.data;
};




// CUSTOM HOOKS

// 🗂️ GET
export const useGetWorkMainStage = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useQuery({
    queryKey: ["work-main-stage", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getWorkMainStageApi(projectId, api);
    },
    enabled: !!projectId,
  });
};

export const useGetWorkSchedule = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useQuery({
    queryKey: ["work-schedule", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getWorkScheduleApi(projectId, api);
    },
    enabled: !!projectId,
  });
};

export const useGetDailySchedule = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useQuery({
    queryKey: ["daily-schedule", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getDailyScheduleApi(projectId, api);
    },
    enabled: !!projectId,
  });
};

export const useGetProjectWorkers = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useQuery({
    queryKey: ["project-workers", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getProjectWorkersApi(projectId, api);
    },
    enabled: !!projectId,
  });
};


// 🗂️ TASK + PLAN CRUD
export const useAddDailyTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, formData }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return addDailyTaskApi(dailyScheduleId, formData, api);
    },
  });
};

export const useAddWorkPlan = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, formData }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      console.log("workschlksdflask", workScheduleId)
      return addWorkPlanApi(workScheduleId, formData, api);
    },
  });
};

export const useUpdateDailyTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, taskId, formData }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateDailyTaskApi(dailyScheduleId, taskId, formData, api);
    },
  });
};

export const useUpdateWorkPlan = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, planId, formData }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateWorkPlanApi(workScheduleId, planId, formData, api);
    },
  });
};

export const useDeleteDailyTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, taskId }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return deleteDailyTaskApi(dailyScheduleId, taskId, api);
    },
  });
};

export const useDeleteWorkPlan = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, planId }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return deleteWorkPlanApi(workScheduleId, planId, api);
    },
  });
};

// 🗂️ STATUS + MD
export const useMdApprovalAction = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "CTO"];
  return useMutation({
    mutationFn: async ({ mainStageId, payload }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return mdApprovalActionApi(mainStageId, payload, api);
    },
  });
};

export const useUpdateDailyScheduleStatus = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, payload }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateDailyScheduleStatusApi(dailyScheduleId, payload, api);
    },
  });
};

export const useUpdateWorkScheduleStatus = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, payload }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateWorkScheduleStatusApi(workScheduleId, payload, api);
    },
  });
};








// ✅ 10. Set Deadline
 const setWorkScheduleDeadlineApi = async ({
  formId,
  deadLine,
  api,
}: {
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/worktasks/deadline/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completeWorkScheduleStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/worktasks/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useSetWorkScheduleDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      formId,
      deadLine,
    }: {
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setWorkScheduleDeadlineApi({ formId, deadLine, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-rooms"] });
    },
  });
};

export const useCompleteWorkSchedule = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeWorkScheduleStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["material-rooms", projectId] });
    },
  });
};