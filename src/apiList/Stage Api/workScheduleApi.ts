// ✅ your role + api utility is assumed:
import { getApiForRole } from "../../utils/roleCheck"; 
import { useQuery, useMutation } from "@tanstack/react-query";
import useGetRole from './../../Hooks/useGetRole';
import type { AxiosInstance } from "axios";


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
  console.log("res", res)
  return res.data.data;
};


// 🗂️ ADD ITEM
export const addDailyTaskApi = async (
  dailyScheduleId: string,
  data: FormData,
  projectId:string,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/${projectId}/daily-task/${dailyScheduleId}`, data);
  return res.data;
};

export const addWorkPlanApi = async (
  workScheduleId: string,
  data: FormData,
  projectId:string,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/${projectId}/work-plan/${workScheduleId}`, data);
  return res.data;
};

// 🗂️ UPDATE ITEM
export const updateDailyTaskApi = async (
  dailyScheduleId: string,
  taskId: string,
  projectId:string,
  data: FormData,
  api: AxiosInstance
) => {
  const res = await api.put(`/worktasks/${projectId}/daily-task/${dailyScheduleId}/${taskId}`, data);
  return res.data;
};

export const updateWorkPlanApi = async (
  workScheduleId: string,
  planId: string,
  projectId:string,
  data: FormData,
  api: AxiosInstance
) => {
  const res = await api.put(`/worktasks/${projectId}/work-plan/${workScheduleId}/${planId}`, data);
  return res.data;
};

// 🗂️ DELETE ITEM
export const deleteDailyTaskApi = async (
  dailyScheduleId: string,
  taskId: string,
  projectId: string,
  api: AxiosInstance
) => {
  const res = await api.delete(`/worktasks/${projectId}/daily-task/${dailyScheduleId}/${taskId}`);
  return res.data;
};

export const deleteWorkPlanApi = async (
  workScheduleId: string,
  planId: string,
  projectId: string,
  api: AxiosInstance
) => {
  const res = await api.delete(`/worktasks/${projectId}/work-plan/${workScheduleId}/${planId}`);
  return res.data;
};

// 🗂️ MD APPROVAL
export interface IMdApprovalPayload {
  action: "approved" | "rejected" | "pending";
  // remarks: string;
}

export const mdApprovalActionApi = async (
  mainStageId: string,
  payload: IMdApprovalPayload,
  projectId: string,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/${projectId}/md-approval/${mainStageId}`, payload);
  return res.data;
};

// 🗂️ STATUS
export interface IStatusPayload {
  status: "pending" | "completed";
}

export const updateDailyScheduleStatusApi = async (
  dailyScheduleId: string,
  payload: IStatusPayload,
  projectId: string,
  api: AxiosInstance
) => {
  const res = await api.patch(`/worktasks/${projectId}/daily-schedule/${dailyScheduleId}/status`, payload);
  return res.data;
};

export const updateWorkScheduleStatusApi = async (
  workScheduleId: string,
  payload: IStatusPayload,
  projectId: string,
  api: AxiosInstance
) => {
  const res = await api.patch(`/worktasks/${projectId}/work-schedule/${workScheduleId}/status`, payload);
  return res.data;
};




// CUSTOM HOOKS

// 🗂️ GET
export const useGetWorkMainStage = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  return useQuery({
    queryKey: ["work-main-stage", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getWorkMainStageApi(projectId, api);
    },
    enabled: !!projectId,
        retry:false,
    refetchOnMount:false
  });
};

export const useGetWorkSchedule = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  return useQuery({
    queryKey: ["work-schedule", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getWorkScheduleApi(projectId, api);
    },
    enabled: !!projectId,
        retry:false,
    refetchOnMount:false
  });
};

export const useGetDailySchedule = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  return useQuery({
    queryKey: ["daily-schedule", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getDailyScheduleApi(projectId, api);
    },
    enabled: !!projectId,
        retry:false,
    refetchOnMount:false
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
    retry:false,
    refetchOnMount:false
  });
};


// 🗂️ TASK + PLAN CRUD
export const useAddDailyTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, projectId, formData }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return addDailyTaskApi(dailyScheduleId, formData, projectId, api);
    },
  });
};

export const useAddWorkPlan = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, formData,  projectId }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      console.log("workschlksdflask", workScheduleId)
      return addWorkPlanApi(workScheduleId, formData, projectId, api);
    },
  });
};

export const useUpdateDailyTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, taskId, formData,  projectId, }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateDailyTaskApi(dailyScheduleId, taskId,  projectId, formData, api);
    },
  });
};

export const useUpdateWorkPlan = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, planId, formData,  projectId, }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateWorkPlanApi(workScheduleId, planId,  projectId, formData, api);
    },
  });
};

export const useDeleteDailyTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, taskId ,  projectId,}: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return deleteDailyTaskApi(dailyScheduleId, taskId,  projectId, api);
    },
  });
};

export const useDeleteWorkPlan = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, planId,  projectId, }: any) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return deleteWorkPlanApi(workScheduleId, planId,  projectId, api);
    },
  });
};

// 🗂️ STATUS + MD
export const useMdApprovalAction = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner"];
  return useMutation({
    mutationFn: async ({ mainStageId, payload ,  projectId,}: {payload:IMdApprovalPayload, mainStageId:string, projectId:string}) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return mdApprovalActionApi(mainStageId, payload,  projectId, api);
    },
  });
};


export interface ISubStageStatusPayload {
  status: "pending" | "completed";
}

export const useUpdateDailyScheduleStatus = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ dailyScheduleId, payload,  projectId, }:  {
      dailyScheduleId: string;
      payload: ISubStageStatusPayload;
      projectId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateDailyScheduleStatusApi(dailyScheduleId, payload,  projectId, api);
    },
  });
};

export const useUpdateWorkScheduleStatus = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO"];
  return useMutation({
    mutationFn: async ({ workScheduleId, payload ,  projectId,}: {
      workScheduleId: string;
      payload: ISubStageStatusPayload;
      projectId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateWorkScheduleStatusApi(workScheduleId, payload,  projectId, api);
    },
  });
};








// ✅ 10. Set Deadline
 const setWorkScheduleDeadlineApi = async ({
  formId,
 projectId,  deadLine, api }: 
 {  projectId: string,
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/worktasks/deadline/${projectId}/${formId}`, { deadLine });
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
     projectId,  deadLine }: 
     {  projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setWorkScheduleDeadlineApi({ formId, projectId, deadLine, api });
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