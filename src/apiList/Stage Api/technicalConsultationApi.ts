import { useMutation, useQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";
import type { UploadFilePayload } from "./requirementFormApi";
import type { AxiosInstance } from "axios";
import type { ITechnicalConsultation } from "../../types/types";

const addConsultationMessage = async ({
  projectId,
  formData,
  api
}: {
  projectId: string;
  formData: FormData;
  api: any;
}) => {
  for (const [k, v] of formData.entries()) {
  console.log("form data", k, v);
}

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
  console.log("data form the message", data)
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


// deadline and completion
const setDeadlineTechnicalConsult = async ({ formId, projectId,  deadLine, api }: {  projectId: string,formId: string, deadLine: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/technicalconsultation/deadline/${projectId}/${formId}`, { deadLine });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const updateCompletionStatus = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/technicalconsultation/completionstatus/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

// file upload api


const uploadFiles = async ({ formId, files, projectId, api }: UploadFilePayload & { api: any }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const response = await api.post(`/technicalconsultation/upload/multiple/${projectId}/${formId}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    console.log("reposen", response)
    return response.data;
}


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
    refetchOnMount:false,
    refetchOnWindowFocus:false,
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


// file upload hook
export const useUploadRequirementFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()
    const api = getApiForRole(role!)


    return useMutation({
        mutationFn: async ({ formId, files, projectId }: UploadFilePayload) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await uploadFiles({ formId, projectId, files, api })
        },
        onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["consultationMessages"] });

        }
    });
};





export const useCompletionStatusTechConsultation  = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId  }: { projectId: string}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCompletionStatus({ projectId, api });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["siteMeasurement"]})
        }
    });
};

export const useSetDeadLineTechConsultation = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId,projectId,  deadLine }: {  projectId: string,formId: string, deadLine: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await setDeadlineTechnicalConsult({ formId, projectId, deadLine, api })

        }
    })
}