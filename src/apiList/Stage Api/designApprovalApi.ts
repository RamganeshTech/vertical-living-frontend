import axios, { type AxiosInstance } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getApiForRole } from "../../utils/roleCheck"; 
import useGetRole from '../../Hooks/useGetRole';
import { queryClient } from "../../QueryClient/queryClient";



// ==========================================
// 1. UPLOAD DESIGN FILES (PROTECTED)
// ==========================================
const uploadDesignFiles = async ({
    projectId,
    designType,
    phaseId,
    formData,
    api
}: {
    projectId: string;
    designType: string;
    phaseId?: string; // Optional: If empty, it creates a new design doc
    formData: FormData;
    api: AxiosInstance;
}) => {
    const url = phaseId 
        ? `/designapproval/${projectId}/${designType}/upload?phaseId=${phaseId}` 
        : `/designapproval/${projectId}/${designType}/upload`;

    const { data } = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useUploadDesignFiles = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            designType,
            phaseId,
            formData
        }: {
            projectId: string;
            designType: string;
            phaseId?: string;
            formData: FormData;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            return await uploadDesignFiles({ projectId, designType, phaseId, formData, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["designApprovals", projectId] });
        }
    });
};

// ==========================================
// 2. GET DESIGN APPROVALS (PROTECTED)
// ==========================================
const getDesignApprovals = async ({
    projectId,
    api
}: {
    projectId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/designapproval/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useGetDesignApprovals = (projectId: string) => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["designApprovals", projectId],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            return await getDesignApprovals({ projectId, api });
        },
        enabled: !!projectId && !!role && allowedRoles.includes(role),
        retry:false
    });
};

// ==========================================
// 3. START NEXT PHASE (PROTECTED)
// ==========================================
const startNextPhase = async ({
    projectId,
    designType,
    api
}: {
    projectId: string;
    designType: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/designapproval/${projectId}/${designType}/next-phase`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useStartNextPhase = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            designType
        }: {
            projectId: string;
            designType: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            return await startNextPhase({ projectId, designType, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["designApprovals", projectId] });
        }
    });
};

// ==========================================
// 4. DELETE ENTIRE PHASE (PROTECTED)
// ==========================================
const deletePhase = async ({
    projectId,
    designType,
    phaseId,
    api
}: {
    projectId: string;
    designType: string;
    phaseId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/designapproval/${projectId}/${designType}/phases/${phaseId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useDeletePhase = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            designType,
            phaseId
        }: {
            projectId: string;
            designType: string;
            phaseId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            return await deletePhase({ projectId, designType, phaseId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["designApprovals", projectId] });
        }
    });
};

// ==========================================
// 5. DELETE SINGLE FILE (PROTECTED)
// ==========================================
const deleteSingleFile = async ({
    projectId,
    designType,
    phaseId,
    fileId,
    api
}: {
    projectId: string;
    designType: string;
    phaseId: string;
    fileId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/designapproval/${projectId}/${designType}/phases/${phaseId}/files/${fileId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useDeleteSingleFile = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            designType,
            phaseId,
            fileId
        }: {
            projectId: string;
            designType: string;
            phaseId: string;
            fileId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            return await deleteSingleFile({ projectId, designType, phaseId, fileId, api });
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ["designApprovals", projectId] });
        }
    });
};




const updateCompletionStatus = async ({ projectId, api }: { projectId: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/designapproval/completionstatus/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


export const useCompletionStatusDesignApproval= () => {
    const allowedRoles = ["owner", "staff", "CTO", "client"]
    const { role } = useGetRole()

    const api = getApiForRole(role!)

    return useMutation({
        mutationFn: async ({ projectId  }: { projectId: string}) => {

            if (!role || !allowedRoles.includes(role)) throw new Error("not allowed to make this api call");

            if (!api) throw new Error("API instance not found for role");

            return await updateCompletionStatus({ projectId, api });
        },
        onSuccess: (_m, {projectId})=>{
            queryClient.invalidateQueries({ queryKey: ["designApprovals", projectId] });

        }
    });
};


const setDeadlineSampleDesign = async ({ projectId,  deadLine, api }: {  projectId: string, deadLine: string, api: AxiosInstance }) => {
    const { data } = await api.put(`/designapproval/deadline/${projectId}`, { deadLine });
    if (!data.ok) throw new Error(data.message);
    return data.data;
}


export const useSetDeadLineDesignApproval= () => {
    const allowedRoles = ["owner", "staff", "CTO"]
    const { role } = useGetRole()
    const api = getApiForRole(role!)
    return useMutation({
        mutationFn: async ({  projectId,  deadLine, }: {  projectId: string, deadLine: string }) => {
            if (!role) throw new Error("not authorized")

            if (!allowedRoles.includes(role)) throw new Error('you  dont have the access to make this api')

            if (!api) throw new Error("api is null")

            return await setDeadlineSampleDesign({ projectId, deadLine, api })

        }
    })
}


// =========================================================================
// ========================== PUBLIC ROUTES ================================
// =========================================================================

// ==========================================
// 6. GET DESIGN APPROVALS (PUBLIC - CLIENT SIDE)
// ==========================================
const getPublicDesignApprovals = async ({ projectId }: { projectId: string }) => {
    // Note: If you require a token for the public link, append it here just like your reference form hook
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/designapproval/public/${projectId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useGetPublicDesignApprovals = (projectId: string) => {
    // No role checks! 
    return useQuery({
        queryKey: ["publicDesignApprovals", projectId],
        queryFn: async () => {
            return await getPublicDesignApprovals({ projectId });
        },
        enabled: !!projectId
    });
};

// ==========================================
// 7. SUBMIT CLIENT FEEDBACK (PUBLIC - CLIENT SIDE)
// ==========================================
const submitClientFeedback = async ({ 
    projectId, 
    designType, 
    phaseId, 
    payload 
}: { 
    projectId: string; 
    designType: string; 
    phaseId: string; 
    payload: any 
}) => {
    // Note: If you require a token for the public link, append it here
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/designapproval/${projectId}/${designType}/phases/${phaseId}/feedback`, payload);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

export const useSubmitClientFeedback = () => {
    // No role checks!
    return useMutation({
        mutationFn: async ({ 
            projectId, 
            designType, 
            phaseId, 
            payload 
        }: { 
            projectId: string; 
            designType: string; 
            phaseId: string; 
            payload: any 
        }) => {
            return await submitClientFeedback({ projectId, designType, phaseId, payload });
        },
        onSuccess: (_, { projectId }) => {
            // Invalidate the public query so the client sees their updates immediately
            queryClient.invalidateQueries({ queryKey: ["publicDesignApprovals", projectId] });
        }
    });
};



