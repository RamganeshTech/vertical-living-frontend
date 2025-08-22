import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck";
import useGetRole from "../../Hooks/useGetRole";
import type { AxiosInstance } from "axios";
import { queryClient } from "../../QueryClient/queryClient";

export interface UploadFilePayload {
    formId: string;
    files: File[];
    projectId: string;
}

// below api is used for submitting the form details form the form link submitted through whatsapp to the client 
const createPublicFromSubmission = async ({ projectId, payload, token, api }: { projectId: string, payload: any, token: string, api: AxiosInstance }) => {
    const { data } = await api.post(`/requirementform/createrequirement/${projectId}?token=${token}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


// const getRequrimentformDetails = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
//     const { data } = await api.get(`/requirementform/getrequirementform/${projectId}`);
//     if (!data.ok) throw new Error(data.message);
//     return data.data;

// }

export const createRoomApi = async ({
    projectId,
    payload,
    api,
}: {
    projectId: string;
    payload: any;
    api: AxiosInstance;
}) => {
    const { data } = await api.post(`/requirementform/createRoom/${projectId}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data;
};


export const deleteRoomApi = async ({
    projectId,
    roomId,
    api,
}: {
    projectId: string;
    roomId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/requirementform/deleteroom/${projectId}/${roomId}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

export const updateRoomItemApi = async ({
    projectId,
    roomId,
    itemId,
    payload,
    api,
}: {
    projectId: string;
    roomId: string;
    itemId: string | null;
    payload: { itemName: string; quantity: number };
    api: AxiosInstance;
}) => {
    const { data } = await api.put(
        `/requirementform/updateroomitem/${projectId}/${roomId}/${itemId}`,
        payload
    );
    if (!data.ok) throw new Error(data.message);
    return data;
};


export const deleteRoomItemApi = async ({
    projectId,
    roomId,
    itemId,
   
    api,
}: {
    projectId: string;
    roomId: string;
    itemId: string | null;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(
        `/requirementform/deleteitem/${projectId}/${roomId}/${itemId}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};


export const getAllInfoApi = async ({
    projectId,
    api,
}: {
    projectId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/requirementform/getrequirementform/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data?.data;
};

export const getSingleRoomApi = async ({
    projectId,
    roomId,
    api,
}: {
    projectId: string;
    roomId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(
        `/requirementform/getroomwise/${projectId}/${roomId}`
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



const generateRequirementFormLink = async ({ projectId, api }: { projectId: string, api: any }) => {
    const { data } = await api.post(`/requirementform/formsharelink/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data; //it has the link
};

const lockUpdationOfForm = async ({ formId, projectId, api }: { formId: string, projectId: string, api: AxiosInstance }) => {

    const { data } = await api.patch(`/requirementform/lockupdation/${projectId}/${formId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const formCompletion = async ({ formId, projectId, api }: { formId: string, projectId: string, api: AxiosInstance }) => {
    const { data } = await api.patch(`/requirementform/formcompleted/${projectId}/${formId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const setDeadlineFormRequirement = async ({ formId, projectId, deadLine, api }: { projectId: string, formId: string, deadLine: string, api: AxiosInstance }) => {
    const { data } = await api.patch(`/requirementform/deadline/${projectId}/${formId}`, { deadLine });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


const deleteFormRequirements = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.delete(`/requirementform/deleteform/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const uploadRequirementFiles = async ({ formId, projectId, files, api }: UploadFilePayload & { api: any }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const response = await api.post(`/requirementform/upload/multiple/${projectId}/${formId}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}


// DELETE file
const deleteRequirementUploadFileApi = async (
    projectId: string,
    fileId: string,
    api: AxiosInstance
) => {
    const { data } = await api.patch(`/requirementform/${projectId}/deleteuploadedfile/${fileId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const useDeleteRequirementUploadFile = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({ projectId, fileId }: { projectId: string, fileId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role"); return await deleteRequirementUploadFileApi(projectId, fileId, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};

//updation part of the requriement form

// const kitchenRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
//     const { data } = await api.put(`/requirementform/${projectId}/updatekitchen`, { kitchen: updateData });
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// }

// const bedroomRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
//     const { data } = await api.put(`/requirementform/${projectId}/updatebedroom`, { bedroom: updateData });
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// }

// const wardrobeRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
//     const { data } = await api.put(`/requirementform/${projectId}/updatewardrobe`, { wardrobe: updateData });
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// }

// const livingHallRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
//     const { data } = await api.put(`/requirementform/${projectId}/updatelivinghall`, { livingHall: updateData });
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// }


export const useCreateFormSubmission = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId, payload, token }: { projectId: string, payload: any, token: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await createPublicFromSubmission({ projectId, payload, token, api })
        },
        onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    })

}

// export const useGetFormRequriemetn = ({ projectId }: { projectId: string }) => {
//     const allowedRoles = ["owner", "staff", "CTO", "client"]

//     const { role } = useGetRole()

//     const api = getApiForRole(role!)
//     return useQuery({
//         queryKey: ["requirementForm"],
//         queryFn: async () => {

//             if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

//             if (!api) throw new Error("API instance not found for role");

//             return await getRequrimentformDetails({ projectId, api });
//         },
//         retry: false,
//         refetchOnWindowFocus: false,
//     })
// }


export const useDeleteRequriementForm = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await deleteFormRequirements({ projectId, api });
        },
         onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};

export const useGenerateShareableLink = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await generateRequirementFormLink({ projectId, api });
        },
         onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};


export const useLockUpdationOfForm = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ formId, projectId }: { formId: string, projectId: string }) => {
            if (!role) throw new Error("not authorized")
            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')
            if (!api) throw new Error("api is null")

            return await lockUpdationOfForm({ formId, projectId, api })
        },
         onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    })

}


export const useFormCompletion = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId, projectId }: { formId: string, projectId: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await formCompletion({ formId, projectId, api })

        },
        onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm"] })
            queryClient.invalidateQueries({ queryKey: ["siteMeasurement", projectId] });
        }
    })
}

export const useSetDeadLineFormRequirement = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId, deadLine, projectId }: { formId: string, projectId: string, deadLine: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you dont have the access to make this api')

            if (!api) throw new Error("api is not available")

            return await setDeadlineFormRequirement({ formId, deadLine, projectId, api })

        },
         onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    })
}



export const useUploadRequirementFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]

    const { role } = useGetRole()
    const api = getApiForRole(role!)


    return useMutation({
        mutationFn: async ({ formId, files, projectId }: UploadFilePayload) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await uploadRequirementFiles({ formId, projectId, files, api })
        },
         onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};




//updation part of the requriement form of custom hooks

// export const useKitchenFormUpdation = () => {
//     const allowedRoles = ["client", "owner", "staff"]

//     const { role } = useGetRole()

//     const api = getApiForRole(role!)
//     return useMutation({
//         mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

//             if (!role) throw new Error("not authorized")

//             if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

//             if (!api) throw new Error("api is null")

//             return await kitchenRequriementFormUpdation({ projectId, api, updateData })

//         }
//     })
// }

// export const useBedroomFormUpdation = () => {
//     const allowedRoles = ["client", "owner", "staff"]

//     const { role } = useGetRole()

//     const api = getApiForRole(role!)
//     return useMutation({
//         mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

//             if (!role) throw new Error("not authorized")

//             if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

//             if (!api) throw new Error("api is null")

//             return await bedroomRequriementFormUpdation({ projectId, api, updateData })

//         }
//     })
// }

// export const useWardrobeFormUpdation = () => {
//     const allowedRoles = ["client", "owner", "staff"]

//     const { role } = useGetRole()

//     const api = getApiForRole(role!)
//     return useMutation({
//         mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

//             if (!role) throw new Error("not authorized")

//             if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

//             if (!api) throw new Error("api is null")

//             return await wardrobeRequriementFormUpdation({ projectId, api, updateData })

//         }
//     })
// }

// export const useLivingHallFormUpdation = () => {
//     const allowedRoles = ["client", "owner", "staff"]

//     const { role } = useGetRole()

//     const api = getApiForRole(role!)
//     return useMutation({
//         mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

//             if (!role) throw new Error("not authorized")

//             if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

//             if (!api) throw new Error("api is null")

//             return await livingHallRequriementFormUpdation({ projectId, api, updateData })

//         }
//     })
// }




export const useCreateRoom = () => {
    const allowedRoles = ["owner", "staff", "CTO",];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, payload }: { projectId: string; payload: any }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await createRoomApi({ projectId, payload, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};



export const useDeleteRoomRequirement = () => {
    const allowedRoles = ["owner", "staff", "CTO",];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, roomId }: { projectId: string; roomId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await deleteRoomApi({ projectId, roomId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};

export const useUpdateRequirementRoomItem = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            roomId,
            itemId,
            payload,
        }: {
            projectId: string;
            roomId: string;
            itemId: string | null;
            payload: any;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await updateRoomItemApi({ projectId, roomId, itemId, payload, api });
        },
        onSuccess: (_, { projectId, roomId }) => {
            queryClient.invalidateQueries({ queryKey: ["requirementFormRoom", projectId, roomId] });
        },
    });
};


export const useDeleteRoomItems = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            roomId,
            itemId,
            
        }: {
            projectId: string;
            roomId: string;
            itemId: string | null;
           
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await deleteRoomItemApi({ projectId, roomId, itemId, api });
        },
        onSuccess: (_, { projectId, roomId }) => {
            queryClient.invalidateQueries({ queryKey: ["requirementFormRoom", projectId, roomId] });
        },
    });
};



export const useGetAllRequirementInfo = ({ projectId }: { projectId: string }) => {
    const allowedRoles = ["owner", "staff", "CTO", "client",];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["requirementForm", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await getAllInfoApi({ projectId, api });
        },
        retry: false,
        // refetchOnWindowFocus: false,
    });
};

export const useGetSingleRoomRequirement = ({
    projectId,
    roomId,
}: {
    projectId: string;
    roomId: string;
}) => {
    const allowedRoles = ["owner", "staff", "CTO", "client"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["requirementFormRoom", projectId, roomId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");
            return await getSingleRoomApi({ projectId, roomId, api });
        },
        enabled: !!projectId && !!roomId,
        retry: false,
        // refetchOnWindowFocus: false,
    });
};

// UPLOAD FILE CORRESPONDING TO SECITON



const uploadRequirementSectionFilesApi = async (
    projectId: string,
    sectionName: string,
    files: FormData,
    api: AxiosInstance
) => {
    const { data } = await api.post(
        `/requirementform/${projectId}/${sectionName}/upload`,
        files,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUploadRequirementSectionFiles = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    const allowedRoles = ["owner", "staff", "CTO", "client"];

    return useMutation({
        mutationFn: async ({
            projectId,
            sectionName,
            files,
        }: {
            projectId: string;
            sectionName: string;
            files: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("You are not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await uploadRequirementSectionFilesApi(
                projectId,
                sectionName,
                files,
                api
            );
        },
        onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};







const deleteRequirementSectionFileApi = async (
    projectId: string,
    sectionName: string,
    fileId: string,
    api: AxiosInstance
) => {
    const { data } = await api.delete(`/requirementform/${projectId}/${sectionName}/${fileId}/deletefile`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



export const useDeleteRequirementSectionFile = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({
            projectId,
            sectionName,
            fileId,
        }: {
            projectId: string;
            sectionName: string;
            fileId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("You are not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await deleteRequirementSectionFileApi(
                projectId,
                sectionName,
                fileId,
                api
            );
        },
        onSuccess: (_, {projectId}) => {
            queryClient.invalidateQueries({ queryKey: ["requirementForm", projectId] });
        },
    });
};
