// api/stafftasks/createStaffTasks.ts
import { type AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";


const allowedRoles = ["owner", "staff", "CTO"];

// 1. CREATE TASKS
export const createStaffTasks = async ({
  tasks,
  assigneRole,
  api,
}: {
  tasks: any[];
  assigneRole: string;
  api: AxiosInstance;
}) => {

   const formData = new FormData();

  // Convert task JSON to string
  formData.append("tasks", JSON.stringify(tasks));
  formData.append("assigneRole", assigneRole);

  // Collect and append files (optional)
  // each task may have multiple images
  tasks.forEach((task) => {
    if (task.images && Array.isArray(task.images)) {
      task.images.forEach((file: File) => {
        // ensure file is a File object (from input)
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
    }
  });


  // const { data } = await api.post("/stafftasks/tasks/bulk", {
  //   tasks,
  //   assigneRole,
  // });


    const { data } = await api.post("/stafftasks/tasks/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const createStaffTasksFromWork = async ({
  tasks,
  assigneRole,
  api,
}: {
  tasks: any[];
  assigneRole: string;
  api: AxiosInstance;
}) => {

   const formData = new FormData();

  // Convert task JSON to string
  formData.append("tasks", JSON.stringify(tasks));
  formData.append("assigneRole", assigneRole);

  // Collect and append files (optional)
  // each task may have multiple images
  tasks.forEach((task) => {
    if (task.images && Array.isArray(task.images)) {
      task.images.forEach((file: File) => {
        // ensure file is a File object (from input)
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
    }
  });


  // const { data } = await api.post("/stafftasks/tasks/bulk", {
  //   tasks,
  //   assigneRole,
  // });


    const { data } = await api.post("/stafftasks/tasks/taskfromwork", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const getSuggestedSubtasks = async ({
  title,
  api,
}: {
  title: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/stafftasks/suggest/subtasks?title=${encodeURIComponent(title)}`);
  if (!data.ok) throw new Error(data.message);
  return data.steps; // expected to be: string[]
};

// 2. GET TASKS
export const getAllTasks = async ({
  filters,
  api,
  organizationId
}: {
  filters?: Record<string, string | boolean | null>;
  api: AxiosInstance;
  organizationId:string
}) => {
  const searchParams = new URLSearchParams(filters as any).toString();
  const { data } = await api.get(`/stafftasks/${organizationId}/tasks?${searchParams}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




const getSingleTask = async ({
  id,
  api,
}: {
  id: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.get(`/stafftasks/singletask/${id}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const getAllAssociatedStaffsTask = async ({
  organizationId,
  filters,
  api,
}: {
  organizationId: string;
  filters?: Record<string, string | boolean | null>;
  api: AxiosInstance;
}) => {
  const searchParams = new URLSearchParams(filters as any).toString();
  const { data } = await api.get(`/stafftasks/associatedstaffstask/${organizationId}?${searchParams}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 3. UPDATE MAIN TASK
export const updateMainTask = async ({
  mainTaskId,
  updates,
  api,
}: {
  mainTaskId: string;
  updates: Record<string, any>;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(
    `/stafftasks/tasks/${mainTaskId}`,
    updates
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 4. DELETE MAIN TASK
export const deleteMainTask = async ({
  mainTaskId,
  api,
}: {
  mainTaskId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(`/stafftasks/tasks/${mainTaskId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 5. UPDATE SUB-TASK NAME
export const updateSubTaskName = async ({
  mainTaskId,
  subTaskId,
  taskName,
  api,
}: {
  mainTaskId: string;
  subTaskId: string;
  taskName: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(
    `/stafftasks/tasks/${mainTaskId}/subtasks/${subTaskId}`,
    { taskName }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


// 7. UPDATE SUB TASK COMMENTS
export const updateSubTaskComment = async ({
  mainTaskId,
  subTaskId,
  comment,
  api,
}: {
  mainTaskId: string;
  subTaskId: string;
    comment: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(
    `/stafftasks/tasks/${mainTaskId}/${subTaskId}/updatecomments`,
    {   comment }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 6. DELETE SUB-TASK
export const deleteSubTask = async ({
  mainTaskId,
  subTaskId,
  api,
}: {
  mainTaskId: string;
  subTaskId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.delete(
    `/stafftasks/tasks/${mainTaskId}/subtasks/${subTaskId}`
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// 7. ADD TO HISTORY
export const updateTaskHistory = async ({
  mainTaskId,
  subTaskId,
  status,
  subTask,
  api,
}: {
  mainTaskId: string;
  subTaskId: string;
  status: string;
  subTask: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.patch(
    `/stafftasks/tasks/${mainTaskId}/subtasks/${subTaskId}/history`,
    { status, task: subTask }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};






// 1. Create tasks
export const useCreateStaffTasks = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ tasks, assigneRole }: { tasks: any[]; assigneRole: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await createStaffTasks({ tasks, assigneRole, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks"] });
    }
  });
};


// create task form workopitons

export const useCreateStaffTasksFromWork = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ tasks, assigneRole }: { tasks: any[]; assigneRole: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await createStaffTasksFromWork({ tasks, assigneRole, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks"] });
    }
  });
};


// export const useSuggestSubtasks = (title: string) => {
//   const { role } = useGetRole();
//   const api = getApiForRole(role!);

//   return useQuery({
//     queryKey: ['suggested-subtasks', title],
//     queryFn: async () => {
//       if (!title || title.length <= 3) return [];
//       if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
//       if (!api) throw new Error("Not Authenticated");

//       return await getSuggestedSubtasks({ title, api });
//     },
//     enabled: !!title && title.length > 3 && !!role,
//   });
// };

// 2. Get tasks with filters
export const useGetAllStaffTasks = (organizationId:string, filters?: Record<string, string | boolean | null> ) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["stafftasks", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
       if (!api) throw new Error("Not Authenticated");
      return getAllTasks({ filters, api, organizationId });
    },
    enabled: !!role
  });
};



// 2. Get tasks with filters
export const useSingleStaffTask = (id: string) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["singlestafftasks", id],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
       if (!api) throw new Error("Not Authenticated");
      return getSingleTask({ id, api });
    },
    enabled: !!role
  });
};


export const useGetAssociatedStaffTask = (organizationId:string, filters?: Record<string, string | boolean | null> ) => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useQuery({
    queryKey: ["associatedstafftasks", organizationId, filters],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
       if (!api) throw new Error("Not Authenticated");
      return getAllAssociatedStaffsTask({ filters, api, organizationId });
    },
    enabled: !!role
  });
};

// 3. Update main task
export const useUpdateMainTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ mainTaskId, updates }: { mainTaskId: string; updates: Record<string, any> }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API missing");
      return await updateMainTask({ mainTaskId, updates, api });
    },
    onSuccess: (_, { mainTaskId }) => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks", mainTaskId] });
    }
  });
};



// 4. Delete main task
export const useDeleteMainTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ mainTaskId }: { mainTaskId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await deleteMainTask({ mainTaskId, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks"] });
    }
  });
};

// 5. Update subtask name
export const useUpdateSubTaskName = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ mainTaskId, subTaskId, taskName }: { mainTaskId: string; subTaskId: string; taskName: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await updateSubTaskName({ mainTaskId, subTaskId, taskName, api });
    },
    onSuccess: (_, { mainTaskId }) => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks", mainTaskId] });
    }
  });
};




// 5. update comments sub tasks
export const useUpdateSubTaskComments = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ mainTaskId, subTaskId, comment }: { mainTaskId: string; subTaskId: string; comment: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await updateSubTaskComment({ mainTaskId, subTaskId, comment, api });
    },
    onSuccess: (_, { mainTaskId }) => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks", mainTaskId] });
    }
  });
};


// 6. Delete subtask
export const useDeleteSubTask = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ mainTaskId, subTaskId }: { mainTaskId: string; subTaskId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await deleteSubTask({ mainTaskId, subTaskId, api });
    },
    onSuccess: (_, { mainTaskId }) => {
      queryClient.invalidateQueries({ queryKey: ["stafftasks", mainTaskId] });
    }
  });
};

// 7. Update task history
export const useUpdateTaskHistory = () => {
  const { role } = useGetRole();
  const api = getApiForRole(role!);
  return useMutation({
    mutationFn: async ({ mainTaskId, subTaskId, status, subTask }: { mainTaskId: string; subTaskId: string; status: string, subTask:string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("Not Authenticated");
      return await updateTaskHistory({ mainTaskId, subTaskId, status, subTask, api });
    },
    onSuccess: (_, { mainTaskId }) => {
      queryClient.invalidateQueries({ queryKey: ["singlestafftasks", mainTaskId] });
    }
  });
};