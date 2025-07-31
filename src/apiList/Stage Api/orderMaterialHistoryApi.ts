import type { AxiosInstance } from "axios";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../QueryClient/queryClient";



const getAllOrderHistory = async ({projectId, api}:{projectId:string, api:AxiosInstance})=>{
    const { data } = await api.get(`/orderingmaterial/getalldetails/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
}



export const useGetAllOrderingMaterialHistory = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO" , "worker", "client"]
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["ordering-material-history", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch ordering material");
      if (!api) throw new Error("API not available");
      return await getAllOrderHistory({projectId, api});
    },
    enabled: !!role && !!projectId && !!api,
    retry: false,
    refetchOnMount: false,
  });
};



// ✅ 10. Set Deadline
 const setOrderMaterialDeadlineApi = async ({
  formId,
  projectId,  deadLine, api }:
   {  projectId: string,
  formId: string;
  deadLine: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/orderingmaterial/deadline/${projectId}/${formId}`, { deadLine });
  if (!data.ok) throw new Error(data.message);
  return data.data;
};

// ✅ 11. Complete Stage
 const completeOrderMaterialHistoryStageApi = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: AxiosInstance;
}) => {
  const { data } = await api.put(`/orderingmaterial/completionstatus/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


export const useSetOrderingMaterialHistoryDeadline = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      formId,
    projectId,  deadLine,
   }: {  projectId: string,
      formId: string;
      deadLine: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await setOrderMaterialDeadlineApi({ formId, projectId, deadLine, api });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({queryKey: ["ordering-material-history", vars.projectId] });
    },
  });
};

export const useCompleteOrderingMaterialHistoryStage = () => {
  const allowedRoles = ["owner", "staff", "CTO"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
      if (!api) throw new Error("API instance missing");
      return await completeOrderMaterialHistoryStageApi({ projectId, api });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({queryKey: ["ordering-material-history", projectId]});
    },
  });
};