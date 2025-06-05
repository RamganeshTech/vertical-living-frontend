import { useQuery, useMutation } from '@tanstack/react-query';
import Api from '../apiService/apiService';


const createTaskList = async ({ projectId, title, tasks }: { projectId:string, title:string, tasks:any[]}) => {
  try {
    const { data } = await Api.post(`tasklist/createtasklist/${projectId}`, { title, tasks });
    if (data.ok) return data.data;
  } catch (error) {
    throw error;
  }
};



const getTaskList = async (projectId:string) => {
  try {
    const { data } = await Api.get(`tasklist/gettasklist/${projectId}`);
    if (data.ok) return data.data;
  } catch (error) {
    throw error;
  }
};




const createTask = async ({ projectId, taskListId, taskData }:{ projectId:string, taskListId:string, taskData:any}) => {
  try {
    const { data } = await Api.post(`task/createtask/${projectId}/${taskListId}`, taskData);
    if (data.ok) return data.data;
  } catch (error) {
    throw error;
  }
};



// -------------------
// UPDATE TASK
// -------------------
const updateTask = async ({ projectId, taskListId, taskId, taskData }:{ projectId:string, taskListId:string, taskId:string, taskData:any}) => {
  try {
    const { data } = await Api.put(`task/updatetask/${projectId}/${taskListId}/${taskId}`, taskData);
    if (data.ok) return data.data;
  } catch (error) {
    throw error;
  }
};


export const useCreateTaskList = () => {
  return useMutation({
    mutationFn: createTaskList,
  });
};


export const useGetTaskList = (projectId:string) => {
  return useQuery({
    queryKey: ['taskLists', projectId],
    queryFn: () => getTaskList(projectId),
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: updateTask,
  });
};
