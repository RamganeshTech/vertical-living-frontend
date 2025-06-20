import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";

const addConsultationMessage = async ({
  projectId,
  formData,
  api
}: {
  projectId: string;
  formData: FormData;
  api: any;
}) => {
  const { data } = await api.post(`/technicalconsultation/createmessage/${projectId}`, formData);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const getConsultationMessages = async ({
  projectId,
  api,
}: {
  projectId: string;
  api: any;
}) => {
  const { data } = await api.get(`/technicalconsultation/getmessages/${projectId}`);
  if (!data.ok) throw new Error(data.message);
  return data.data;
};


const deleteConsultationMessage = async ({
  projectId,
  messageId,
  senderId,
  senderRole,
  api,
}: {
  projectId: string;
  messageId: string;
  senderId: string;
  senderRole: string;
  api: any;
}) => {
  const { data } = await api.delete(
    `/technicalconsultation/deletemessage/${projectId}/${messageId}`,
    { data: { senderId, senderRole } }
  );
  if (!data.ok) throw new Error(data.message);
  return data.message;
};


const editConsultationMessage = async ({
  projectId,
  messageId,
  message,
  senderId,
  senderRole,
  api,
}: {
  projectId: string;
  messageId: string;
  message: string;
  senderId: string;
  senderRole: string;
  api: any;
}) => {
  const { data } = await api.put(
    `/technicalconsultation/editmessage/${projectId}/${messageId}`,
    { message, senderId, senderRole }
  );
  if (!data.ok) throw new Error(data.message);
  return data.data;
};




export const useGetConsultationMessages = (projectId: string) => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useQuery({
    queryKey: ["consultationMessages", projectId],
    queryFn: async () => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await getConsultationMessages({ projectId, api });
    },
    enabled: !!projectId,
    retry:false,
    refetchOnMount:false
  });
};


export const useAddConsultationMessage = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: FormData }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await addConsultationMessage({ projectId, formData, api });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationMessages"] });
    },
  });
};


export const useEditConsultationMessage = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      messageId,
      message,
      senderId,
    }: {
      projectId: string;
      messageId: string;
      message: string;
      senderId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await editConsultationMessage({
        projectId,
        messageId,
        message,
        senderId,
        senderRole: role,
        api,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationMessages"] });
    },
  });
};


export const useDeleteConsultationMessage = () => {
  const allowedRoles = ["owner", "staff", "CTO", "worker"];
  const { role } = useGetRole();
  const api = getApiForRole(role!);

  return useMutation({
    mutationFn: async ({
      projectId,
      messageId,
      senderId,
    }: {
      projectId: string;
      messageId: string;
      senderId: string;
    }) => {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API not found");
      return await deleteConsultationMessage({
        projectId,
        messageId,
        senderId,
        senderRole: role,
        api,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationMessages"] });
    },
  });
};


