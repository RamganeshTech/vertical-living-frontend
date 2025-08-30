// ✅ your role + api utility is assumed:
import { getApiForRole } from "../../utils/roleCheck"; 
import { useQuery, useMutation } from "@tanstack/react-query";
import useGetRole from './../../Hooks/useGetRole';
import type { AxiosInstance } from "axios";


import { queryClient } from "../../QueryClient/queryClient";
import axios from "axios";

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
  return res.data.data;
};



// FOR THE DAILY SCHEDULE API
// Create Work
export const createWorkApi = async (
  projectId: string,
  data: any,
  api: AxiosInstance
) => {
  const res = await api.post(`/worktasks/create/${projectId}`, data);
  return res.data.data;
};

// Update Work
export const updateWorkApi = async (
  projectId: string,
  scheduleId: string,
  data: any,
  api: AxiosInstance
) => {
  console.log("im gettng called update workd api ")
  const res = await api.put(`/worktasks/update/${projectId}/${scheduleId}`, data);
  return res.data.data;
};

// // Delete Work
export const deleteWorkApi = async (
  scheduleId: string,
  taskId: string,
  api: AxiosInstance
) => {
  const res = await api.delete(`/worktasks/${scheduleId}/${taskId}`);
  return res.data.data;
};

const uploadDailyScheduleImagesApi = async (
  scheduleId: string,
  taskId: string,
  date: string,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("date", date); // 👈 include date in body
  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/worktasks/${scheduleId}/task/${taskId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
};


export const deleteDailyScheduleImageApi = async ({
  scheduleId,
  taskId,
  date,
  imageId,
}: {
  scheduleId: string;
  taskId: string;
  date: string;
  imageId: string;
}) => {


  //  console.log("scheduleId", scheduleId)
  //   console.log("taskId", taskId)
  //   console.log("imageId", imageId)
  //   console.log("date", date)


  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/worktasks/${scheduleId}/deleteworkimage/${taskId}/date/${date}/image/${imageId}`
  );
  return data.data;
};


const generateWorkPdfLink = async ({
  projectId,
  formData,
  scheduleId = null,
  api,
}: {
  projectId: string;
  scheduleId: string | null
  formData:any
  api: AxiosInstance;
}) => {
  const { data } = await api.post(`/worktasks/generatePdf/work/${projectId}/${scheduleId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

export const getProjectAssigneDetails = async (projectId: string, api: AxiosInstance) => {
  const res = await api.get(`/worktasks/getprojectassigne/${projectId}`);
  return res.data.data;
};

// ---------- API CALLERS ----------

const createCorrection = async ({
  scheduleId,
  formData,
  api,
}: {
  scheduleId: string;
  formData: any;
  api: AxiosInstance;
}) => {
  const { data } = await api.post(
    `/worktasks/createcorrection/${scheduleId}`,
    formData
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};



const uploadSelectImageManually = async ({
  scheduleId ,
  comparisonId,
  formData,
  api,
}: {
  projectId: string;
  scheduleId: string;
  comparisonId: string | null;
  formData: FormData;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(
    `/worktasks/uploadselectimagemanually/${scheduleId}/${comparisonId}`,
    formData
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const uploadCorrectedImage = async ({
  scheduleId,
  comparisonId,
  formData,
  api,
}: {
  projectId: string;
  scheduleId: string;
  comparisonId: string;
  formData: FormData;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(
    `/worktasks/uploadcorrectedimage/${scheduleId}/${comparisonId}`,
    formData
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const updateSelectedImageComment = async ({
  scheduleId,
  comparisonId,
  selectedImageId,
  formData,
  api,
}: {  
  projectId: string;
  scheduleId: string;
  comparisonId: string;
  selectedImageId: string;
  formData: {comment: string};
  api: AxiosInstance;
}) => {
  const { data } = await api.put(
    `/worktasks/updateSelectimagecomment/${scheduleId}/${comparisonId}/${selectedImageId}`,
    formData
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const deleteSelectImage = async ({
 
  scheduleId,
  comparisonId,
  selectId,
  api,
}: {
  projectId: string;
  scheduleId: string;
  comparisonId: string;
  selectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/worktasks/deleteselectimages/${scheduleId}/${comparisonId}/${selectId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

const deleteCorrectedImage = async ({
 
  scheduleId,
  comparisonId,
  imageId,
  api,
}: {
  projectId: string;
  scheduleId: string;
  comparisonId: string;
  imageId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/worktasks/deletecorrectedimages/${scheduleId}/${comparisonId}/${imageId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// WORK PLAN API(NOT IN USE CURRENTLY)
// export const addWorkPlanApi = async (
//   workScheduleId: string,
//   data: FormData,
//   projectId:string,
//   api: AxiosInstance
// ) => {
//   const res = await api.post(`/worktasks/${projectId}/work-plan/${workScheduleId}`, data);
//   return res.data;
// };

// export const updateWorkPlanApi = async (
//   workScheduleId: string,
//   planId: string,
//   projectId:string,
//   data: FormData,
//   api: AxiosInstance
// ) => {
//   const res = await api.put(`/worktasks/${projectId}/work-plan/${workScheduleId}/${planId}`, data);
//   return res.data;
// };


// export const deleteWorkPlanApi = async (
//   workScheduleId: string,
//   planId: string,
//   projectId: string,
//   api: AxiosInstance
// ) => {
//   const res = await api.delete(`/worktasks/${projectId}/work-plan/${workScheduleId}/${planId}`);
//   return res.data;
// };

// 🗂️ MD APPROVAL
// export interface IMdApprovalPayload {
//   action: "approved" | "rejected" | "pending";
//   // remarks: string;
// }

// export const mdApprovalActionApi = async (
//   mainStageId: string,
//   payload: IMdApprovalPayload,
//   projectId: string,
//   api: AxiosInstance
// ) => {
//   const res = await api.post(`/worktasks/${projectId}/md-approval/${mainStageId}`, payload);
//   return res.data;
// };

// // 🗂️ STATUS
// export interface IStatusPayload {
//   status: "pending" | "completed";
// }

// export const updateDailyScheduleStatusApi = async (
//   dailyScheduleId: string,
//   payload: IStatusPayload,
//   projectId: string,
//   api: AxiosInstance
// ) => {
//   const res = await api.patch(`/worktasks/${projectId}/daily-schedule/${dailyScheduleId}/status`, payload);
//   return res.data;
// };

// export const updateWorkScheduleStatusApi = async (
//   workScheduleId: string,
//   payload: IStatusPayload,
//   projectId: string,
//   api: AxiosInstance
// ) => {
//   const res = await api.patch(`/worktasks/${projectId}/work-schedule/${workScheduleId}/status`, payload);
//   return res.data;
// };




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

// export const useGetWorkSchedule = (projectId: string) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
//   return useQuery({
//     queryKey: ["work-schedule", projectId],
//     queryFn: () => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return getWorkScheduleApi(projectId, api);
//     },
//     enabled: !!projectId,
//         retry:false,
//     refetchOnMount:false
//   });
// };

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




//  BELOW ARE FOR THE DAILY SCHEDULE PAGES
const allowedRoles = ["owner", "staff", "CTO"];

// Create Work Hook
export const useCreateWork = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return createWorkApi(projectId, formData, api);
    },
    onSuccess:(_, {projectId})=>{
      queryClient.invalidateQueries({queryKey: ["daily-schedule", projectId]})
    }
  });
};

// Update Work Hook
export const useUpdateWork = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId, scheduleId, formData }: { projectId: string; scheduleId: string; formData: any }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return updateWorkApi(projectId, scheduleId, formData, api);
    },
    onSuccess:(_, {projectId})=>{
      queryClient.invalidateQueries({queryKey: ["daily-schedule", projectId]})
    }
  });
};

// Delete Work Hook
export const useDeleteWork = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ scheduleId, taskId }: { scheduleId: string; taskId: string, projectId:string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return deleteWorkApi(scheduleId, taskId, api);
    },
    onSuccess: (_, { projectId }) => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["work-schedule", projectId] });
      }
    },
  });
};


export const useUploadDailyScheduleImages = () => {


  
    const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  


  return useMutation({
    mutationFn: async ({
      scheduleId,
      taskId,
      date,
      files,
    }: {
      scheduleId: string;
      taskId: string;
      projectId:string;
      date: string;
      files: File[];
    }) =>{
       if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");

      return await uploadDailyScheduleImagesApi(scheduleId, taskId, date, files)
    },
     onSuccess: (_, { projectId }) => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["work-schedule", projectId] });
      }
    },
  });
};


// newly created dlete ai for contrllers 
export const useDeleteDailyScheduleImage = () => {

    const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  


  return useMutation({
    mutationFn: async ({scheduleId,taskId,date,imageId,}: 
      {scheduleId: string;taskId: string; projectId: string;date: string;imageId: string;})=> {
         if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");

      return await deleteDailyScheduleImageApi({scheduleId, taskId, date, imageId})
    },
    onSuccess:(_, {projectId})=>{
      queryClient.invalidateQueries({queryKey: ["daily-schedule", projectId]})
    }
  });
};




export const useGeneratePdfWorkSchedule = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId , formData, scheduleId= null}: { projectId: string, formData:any, scheduleId?:string | null }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await generateWorkPdfLink({ projectId, formData, scheduleId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};



export const useGetProjectAssigneDetail = (projectId: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];
  return useQuery({
    queryKey: ["projectassigne", projectId],
    queryFn: () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
      if (!api) throw new Error("API not found");
      return getProjectAssigneDetails(projectId, api);
    },
    enabled: !!projectId,
        retry:false,
    refetchOnMount:false
  });
};




// ---------- REACT QUERY HOOKS ----------

export const useCreateCorrection = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      scheduleId,
      formData,
    }: {
      projectId: string;
      scheduleId: string;
      formData: any;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await createCorrection({ scheduleId, formData, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};

export const useUploadSelectImageManaully = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      scheduleId,
      comparisonId,
      formData,
    }: {
      projectId: string;
      scheduleId: string;
      comparisonId: string | null;
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await uploadSelectImageManually({
        projectId,
        scheduleId,
        comparisonId,
        formData,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};

export const useUploadCorrectedImage = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      scheduleId,
      comparisonId,
      formData,
    }: {
      projectId: string;
      scheduleId: string;
      comparisonId: string;
      formData: FormData;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await uploadCorrectedImage({
        projectId,
        scheduleId,
        comparisonId,
        formData,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};

export const useUpdateSelectedImageComment = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      scheduleId,
      comparisonId,
      selectedImageId,
      data,
    }: {
      projectId: string;
      scheduleId: string;
      comparisonId: string;
      selectedImageId: string;
      data: {comment: string};
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await updateSelectedImageComment({
        projectId,
        scheduleId,
        comparisonId,
        selectedImageId,
        formData: data,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};

export const useDeleteCorrectedImage = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      scheduleId,
      comparisonId,
      imageId,
    }: {
      projectId: string;
      scheduleId: string;
      comparisonId: string;
      imageId: string;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await deleteCorrectedImage({
        projectId,
        scheduleId,
        comparisonId,
        imageId,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};


export const useDeleteSelectedImage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      scheduleId,
      comparisonId,
      selectId,
    }: {
      projectId: string;
      scheduleId: string;
      comparisonId: string;
      selectId: string;
    }) => {
      if (!role || !allowedRoles.includes(role))
        throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await deleteSelectImage({
        projectId,
        scheduleId,
        comparisonId,
        selectId,
        api,
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-schedule", projectId] });
    },
  });
};


// export const useAddWorkPlan = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ workScheduleId, formData,  projectId }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return addWorkPlanApi(workScheduleId, formData, projectId, api);
//     },
//   });
// };

// export const useUpdateDailyTask = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ dailyScheduleId, taskId, formData,  projectId, }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return updateDailyTaskApi(dailyScheduleId, taskId,  projectId, formData, api);
//     },
//   });
// };

// export const useUpdateWorkPlan = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ workScheduleId, planId, formData,  projectId, }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return updateWorkPlanApi(workScheduleId, planId,  projectId, formData, api);
//     },
//   });
// };

// export const useDeleteDailyTask = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ dailyScheduleId, taskId ,  projectId,}: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return deleteDailyTaskApi(dailyScheduleId, taskId,  projectId, api);
//     },
//   });
// };

// export const useDeleteWorkPlan = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ workScheduleId, planId,  projectId, }: any) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return deleteWorkPlanApi(workScheduleId, planId,  projectId, api);
//     },
//   });
// };

// // 🗂️ STATUS + MD
// export const useMdApprovalAction = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner"];
//   return useMutation({
//     mutationFn: async ({ mainStageId, payload ,  projectId,}: {payload:IMdApprovalPayload, mainStageId:string, projectId:string}) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return mdApprovalActionApi(mainStageId, payload,  projectId, api);
//     },
//   });
// };


// export interface ISubStageStatusPayload {
//   status: "pending" | "completed";
// }

// export const useUpdateDailyScheduleStatus = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ dailyScheduleId, payload,  projectId, }:  {
//       dailyScheduleId: string;
//       payload: ISubStageStatusPayload;
//       projectId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return updateDailyScheduleStatusApi(dailyScheduleId, payload,  projectId, api);
//     },
//   });
// };

// export const useUpdateWorkScheduleStatus = () => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);
//   const allowedRoles = ["owner", "staff", "CTO"];
//   return useMutation({
//     mutationFn: async ({ workScheduleId, payload ,  projectId,}: {
//       workScheduleId: string;
//       payload: ISubStageStatusPayload;
//       projectId: string;
//     }) => {
//       if (!role || !allowedRoles.includes(role)) throw new Error("Unauthorized");
//       if (!api) throw new Error("API not found");
//       return updateWorkScheduleStatusApi(workScheduleId, payload,  projectId, api);
//     },
//   });
// };








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
  // api,
}: {
  projectId: string;
  // api: AxiosInstance;
}) => {
  console.log("im gettng called complete workd api ")

  const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/worktasks/completionstatus/${projectId}`);
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
    onSuccess: (_, {projectId}) => {
      queryClient.invalidateQueries({ queryKey: ["work-main-stage", projectId] });
    },
  });
};

export const useCompleteWorkSchedule = () => {
  // const allowedRoles = ["owner", "staff", "CTO"];
  // const { role } = useGetRole();
  // const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      // if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      // if (!api) throw new Error("API instance missing");
      return await completeWorkScheduleStageApi({ projectId });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({  queryKey: ["work-main-stage", projectId] });
         

    },
  });
};