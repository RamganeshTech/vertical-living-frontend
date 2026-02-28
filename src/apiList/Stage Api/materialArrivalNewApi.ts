import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import axios, { type AxiosInstance } from "axios";



// PUT /materialarrivalcheck/updateImage/:projectId/:fieldId
// not used
export const updateMaterialArrivalItemApi = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    formData: FormData,
) => {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/updateImage/${projectId}/${orderNumber}/${subItemId}`, formData);
    return res.data;
};


// PUT /materialarrivalcheck/updateImage/:projectId/:fieldId
export const updateMaterialArrivalItemV1Api = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    formData: FormData
) => {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/updateImage/v1/${projectId}/${orderNumber}/${subItemId}`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
};

export const deleteMaterialArrivalImagePublicApi = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    imageId: string
) => {
    const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/deleteImage/v1/${projectId}/${orderNumber}/${subItemId}/${imageId}`
    );
    return res.data;
};


// PUT /materialarrivalcheck/updateImage/:projectId/:fieldId
export const updateStaffMaterialArrivalItemApi = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    arrivedQuantity: number,
    api: AxiosInstance) => {
    const res = await api.put(`/materialarrivalcheck/updatequantity/${projectId}/${orderNumber}/${subItemId}`, { arrivedQuantity });
    return res.data;
};



// PUT /materialarrivalcheck/updateImage/:projectId/:fieldId
export const uploadMatArrImageByStaff = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    formData: FormData,
    api: AxiosInstance
) => {
    const res = await api.put(`/materialarrivalcheck/uploadimage/staff/${projectId}/${orderNumber}/${subItemId}`, formData);
    return res.data;
};


export const uploadMatArrImageByStaffV1 = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    formData: FormData,
    api: AxiosInstance
) => {
    const res = await api.put(`/materialarrivalcheck/uploadimage/v1/staff/${projectId}/${orderNumber}/${subItemId}`, formData);
    return res.data;
};



export const deleteMatArrImageByStaffV1 = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    imageId:string,
    api: AxiosInstance
) => {
    const res = await api.patch(`/materialarrivalcheck/deleteimage/v1/staff/${projectId}/${orderNumber}/${subItemId}/${imageId}`);
    return res.data;
};




//  not used
export const useUpdateMaterialArrivalItemNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            orderNumber, subItemId,
            formData,
        }: {
            projectId: string;
            orderNumber: string,
            subItemId: string,
            formData: FormData;
        }) => {
            return await updateMaterialArrivalItemApi(projectId, orderNumber, subItemId, formData);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};


//  public hook

export const useUpdateMaterialArrivalItemV1 = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, orderNumber, subItemId, formData }: {
            projectId: string;
            orderNumber: string;
            subItemId: string;
            formData: FormData;
        }) => updateMaterialArrivalItemV1Api(projectId, orderNumber, subItemId, formData),
        
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival-public", projectId] });
        },
    });
};

export const useDeleteMaterialArrivalImagePublic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, orderNumber, subItemId, imageId }: {
            projectId: string;
            orderNumber: string;
            subItemId: string;
            imageId: string;
        }) => deleteMaterialArrivalImagePublicApi(projectId, orderNumber, subItemId, imageId),
        
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival-public", projectId] });
        },
       
    });
};


//  not used 
export const useUpdateStaffMatArrivalItemImage = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "staff", "CTO"]


    return useMutation({
        mutationFn: async ({
            projectId,
            orderNumber, subItemId,
            formData,
        }: {
            projectId: string;
            orderNumber: string,
            subItemId: string,
            formData: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not available");


            return await uploadMatArrImageByStaff(projectId, orderNumber, subItemId, formData, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



export const useUpdateStaffMatArrivalItemImageV1 = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "staff", "CTO"]


    return useMutation({
        mutationFn: async ({
            projectId,
            orderNumber, subItemId,
            formData,
        }: {
            projectId: string;
            orderNumber: string,
            subItemId: string,
            formData: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not available");


            return await uploadMatArrImageByStaffV1(projectId, orderNumber, subItemId, formData, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};






export const useDeleteStaffMatArrivalItemImageV1 = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "staff", "CTO"]


    return useMutation({
        mutationFn: async ({
            projectId,
            orderNumber, subItemId,
            imageid,
        }: {
            projectId: string;
            orderNumber: string,
            subItemId: string,
            imageid: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not available");


            return await deleteMatArrImageByStaffV1(projectId, orderNumber, subItemId, imageid, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



export const useUpdateStaffMaterialArrivalItemQuantity = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({
            projectId,
            orderNumber, subItemId,
            arrivedQuantity,

        }: {
            projectId: string;
            orderNumber: string,
            subItemId: string,
            arrivedQuantity: number;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not available");


            return await updateStaffMaterialArrivalItemApi(projectId, orderNumber, subItemId, arrivedQuantity, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



// PUT /materialarrivalcheck/updateverification/:projectId/:fieldId
export const toggleMaterialVerificationApi = async (
    projectId: string,
    orderNumber: string,
    subItemId: string,
    toggle: boolean,
    api: any
) => {
    const res = await api.put(`/materialarrivalcheck/updateverification/${projectId}/${orderNumber}/${subItemId}`, { isVerified: toggle });
    return res.data;
};

export const useToggleMaterialVerification = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({
            projectId,
            orderNumber, subItemId,
            toggle
        }: {
            projectId: string;
            orderNumber: string,
            subItemId: string,
            toggle: boolean;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not available");

            return await toggleMaterialVerificationApi(projectId, orderNumber, subItemId, toggle, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



// PUT /materialarrivalcheck/verifyall/:projectId
export const bulkToggleAllVerificationApi = async (
    projectId: string,
    api: any
) => {
    const res = await api.put(`/materialarrivalcheck/verifyall/${projectId}`);
    return res.data;
};

//  not used
export const useBulkToggleAllVerification = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    const allowedRoles = ["owner", "staff", "CTO"]


    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not available");

            return await bulkToggleAllVerificationApi(projectId, api);
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};



// GET /materialarrivalcheck/getalldetails/:projectId
export const getAllMaterialArrivalDetailsApi = async (
    projectId: string,
    api: any
) => {
    const res = await api.get(`/materialarrivalcheck/getalldetails/${projectId}`);
    return res.data.data;
};

export const useGetAllMaterialArrivalDetailsNew = (projectId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "worker"]

    return useQuery({
        queryKey: ["material-arrival", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            return await getAllMaterialArrivalDetailsApi(projectId, api);
        },
        enabled: !!projectId && !!role,
        retry: false,
        refetchOnMount: false,
    });
};





const generateMaterialArrivalLinkApi = async (projectId: string, api: any) => {
    const res = await api.post(`/materialarrivalcheck/${projectId}/generate-link`);
    return res.data.data;
};

const getPublicMaterialArrivalApi = async (
    projectId: string,
    token: string,
) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materialarrivalcheck/public/${projectId}/${token}`);
    return res.data.data;
};



export const useGenerateMaterialArrivalLinkNew = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"]

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            return await generateMaterialArrivalLinkApi(projectId, api);
        },
    });
};

export const useGetPublicMaterialArrivalNew = (projectId: string, token: string) => {
    return useQuery({
        queryKey: ["material-arrival-public", projectId, token],
        queryFn: async () => {
            return await getPublicMaterialArrivalApi(projectId, token)
        },
        enabled: !!projectId && !!token,
    });
};












// COMMON API 
const setMaterialArrivalDeadlineApi = async ({
    formId,
    projectId, deadLine, api }:
    {
        projectId: string,
        formId: string;
        deadLine: string;
        api: AxiosInstance;
    }) => {
    const { data } = await api.put(`/materialarrivalcheck/deadline/${projectId}/${formId}`, { deadLine });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// ✅ 11. Complete Stage
const completeMaterialArrivalStageApi = async ({
    projectId,
    api,
}: {
    projectId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/materialarrivalcheck/completionstatus/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useSetMaterialArrivalDeadline = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            formId,
            projectId, deadLine, }:
            {
                projectId: string,
                formId: string;
                deadLine: string;
            }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance missing");
            return await setMaterialArrivalDeadlineApi({ formId, projectId, deadLine, api });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["ordering-material", vars.formId] });
        },
    });
};

export const useCompleteMaterialArrivalStage = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId }: { projectId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");
            if (!api) throw new Error("API instance missing");
            return await completeMaterialArrivalStageApi({ projectId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["material-arrival", projectId] });
        },
    });
};


