import { useMutation } from "@tanstack/react-query";
import { getApiForRole } from "../utils/roleCheck";
import useGetRole from "../Hooks/useGetRole";
import type { AxiosInstance } from "axios";
import clientApi from "../apiService/clientService";

// below api is used for submitting the form details form the form link submitted through whatsapp to the client 
const createPublicFromSubmission = async({ projectId ,payload, token}: { projectId: string, payload:any, token:string})=>{
     const { data } = await clientApi.post(`/requirementform/createrequirement/${projectId}?token=${token}`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data; //it has the link
}


const generateRequirementFormLink = async ({ projectId, api }: { projectId: string, api: any }) => {
    const { data } = await api.post(`/requirementform/formsharelink/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data; //it has the link
};

const lockUpdationOfForm = async ({ formId, api }: { formId: string, api: AxiosInstance }) => {
    const { data } = await api.patch(`/requirementform/lockupdation/${formId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const formCompletion = async ({ formId, api }: { formId: string, api: AxiosInstance }) => {
    const { data } = await api.patch(`/requirementform/formcompleted/${formId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


//updation part of the requriement form

const kitchenRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
    const { data } = await api.put(`/requirementform/${projectId}/updatekitchen`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const bedroomRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
    const { data } = await api.put(`/requirementform/${projectId}/updatebedroom`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const wardrobeRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
    const { data } = await api.put(`/requirementform/${projectId}/updatewardrobe`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}

const livingHallRequriementFormUpdation = async ({ projectId, api, updateData }: { projectId: string, api: AxiosInstance, updateData: any }) => {
    const { data } = await api.put(`/requirementform/${projectId}/updatelivinghall`, updateData);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


export const useCreateFormSubmission = ()=>{
    return useMutation({
        mutationFn: createPublicFromSubmission
    })
}

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
    });
};


export const useLockUpdationOfForm = () => {
    const allowedRoles = ["owner", "staff", "CTO"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ formId }: { formId: string }) => {
            if (!role) throw new Error("not authorized")
            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')
            if (!api) throw new Error("api is null")

            return await lockUpdationOfForm({ formId, api })
        }
    })

}


export const useFormCompletion = () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ formId }: { formId: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await formCompletion({ formId, api })

        }
    })
}

//updation part of the requriement form of custom hooks

export const useKitchenFormUpdation = () => {
    const allowedRoles = ["client"]

    const { role } = useGetRole()
    
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await kitchenRequriementFormUpdation({ projectId, api, updateData })

        }
    })
}

export const useBedroomFormUpdation = () => {
    const allowedRoles = ["client"]

    const { role } = useGetRole()

    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await bedroomRequriementFormUpdation({ projectId, api, updateData })

        }
    })
}

export const useWardrobeFormUpdation = () => {
    const allowedRoles = ["client"]

    const { role } = useGetRole()
    
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await wardrobeRequriementFormUpdation({ projectId, api, updateData })

        }
    })
}

export const useLivingHallFormUpdation = () => {
    const allowedRoles = ["client"]

    const { role } = useGetRole()
    
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({ projectId, updateData }: { projectId: string, updateData: any }) => {

            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await livingHallRequriementFormUpdation({ projectId, api, updateData })

        }
    })
}
