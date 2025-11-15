import axios, { type AxiosInstance } from "axios";


import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";
import { queryClient } from "../../QueryClient/queryClient";
// ==================== API FUNCTIONS ====================

// Create a new SubContract
const createSubContract = async ({
    api, filesBeforeWork, ...rest

}: {
    api: AxiosInstance;
    organizationId: string;
    projectId: string;
    workName: string;
    dateOfCommencement: string;
    dateOfCompletion: string,
    workerName: string,
    filesBeforeWork?: File[],
    labourCost: number,
    materialCost: number,
}) => {


    const formData = new FormData();

    // Append worker data
    Object.entries(rest).forEach(([key, value]) => {
        formData.append(key, value.toString());
    });

    // Append files if any
    if (filesBeforeWork && filesBeforeWork.length > 0) {
        filesBeforeWork.forEach(file => formData.append("files", file));
    }

    const { data } = await api.post('/subcontract/create', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


const updateSubContract = async ({
    api,
    subContractId,
    workerData,
}: {
    api: AxiosInstance,
    subContractId: string;
    workerData: {
        projectId:string,
        dateOfCommencement: string;
        dateOfCompletion: string;
        workerName: string;
        labourCost: number;
        materialCost: number;
        totalCost: number;
    };
}) => {
    const { data } = await api.put(`/subcontract/update/${subContractId}`, { workerData });
    if (!data.ok) throw new Error(data.message);
    return data.data; // This should have the submissionToeken and the data
};


// Generate shareable link
const generateShareableLink = async ({
    subContractId,
    api
}: {
    subContractId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/subcontract/generate-shareable-link/${subContractId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// Get all SubContracts by organization
const getSubContractsByOrganization = async ({
    params,
    api
}: {
    params:any,
    api: AxiosInstance;
}) => {
   const queryParams = new URLSearchParams();

  // Pagination
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  // Basic Filters
  if (params.status) queryParams.append("status", params.status);
  if (params.projectId) queryParams.append("projectId", params.projectId);
  if (params.search) queryParams.append("search", params.search);

  // Cost Filters
  if (params.labourCostMin) queryParams.append("labourCostMin", params.labourCostMin);
  if (params.labourCostMax) queryParams.append("labourCostMax", params.labourCostMax);

  if (params.materialCostMin) queryParams.append("materialCostMin", params.materialCostMin);
  if (params.materialCostMax) queryParams.append("materialCostMax", params.materialCostMax);

  if (params.totalCostMin) queryParams.append("totalCostMin", params.totalCostMin);
  if (params.totalCostMax) queryParams.append("totalCostMax", params.totalCostMax);

  // Date Filters
  if (params.dateOfCommencementFrom) queryParams.append("dateOfCommencementFrom", params.dateOfCommencementFrom);
  if (params.dateOfCommencementTo) queryParams.append("dateOfCommencementTo", params.dateOfCommencementTo);

  if (params.dateOfCompletionFrom) queryParams.append("dateOfCompletionFrom", params.dateOfCompletionFrom);
  if (params.dateOfCompletionTo) queryParams.append("dateOfCompletionTo", params.dateOfCompletionTo);

    const { data } = await api.get(
        `/subcontract/getall/${params.organizationId}?${queryParams.toString()}`
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// Get single SubContract by ID
const getSubContractById = async ({
    subContractId,
    api
}: {
    subContractId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/subcontract/getsingle/${subContractId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// Update worker status
const updateWorkerStatus = async ({
    subContractId,
    status,
    api
}: {
    subContractId: string;
    status: "pending" | "accepted" | "rejected";
    api: AxiosInstance;
}) => {
    const { data } = await api.put(
        `/subcontract/update-status/${subContractId}`,
        { status }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// Delete SubContract
const deleteSubContract = async ({
    subContractId,
    api
}: {
    subContractId: string;
    api: AxiosInstance;
}) => {

    // if(!subContractId){
    //     throw "subcontract id is not povided "
    // }

    const { data } = await api.delete(`/subcontract/delete/${subContractId}`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};



// const deleteSubContractWork = async ({
//     subContractId,
//     api
// }: {
//     subContractId: string;
//     workId: string;
//     api: AxiosInstance;
// }) => {
//     const { data } = await api.delete(`/subcontract/deletework/${subContractId}`);
//     if (!data.ok) throw new Error(data.message);
//     return data.data;
// };


// Submit worker info (PUBLIC - no auth)



const submitWorkerInfo = async ({
    token,
    subContractId,
    workerData,
    files
}: {
    token: string;
    subContractId: string;
    workerData: {
        dateOfCommencement: string;
        dateOfCompletion: string;
        workerName: string;
        labourCost: number;
        materialCost: number;
        totalCost: number;
        status: "pending" | "accepted" | "rejected";
    };
    files?: File[];
}) => {
    const formData = new FormData();

    // Append worker data
    Object.entries(workerData).forEach(([key, value]) => {
        formData.append(key, value.toString());
    });

    // Append files if any
    if (files && files.length > 0) {
        files.forEach(file => formData.append("files", file));
    }

    const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subcontract/public/submit/${subContractId}?token=${token}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data; // This should have the submissionToeken and the data
};





// Upload after work files (PUBLIC - no auth)
const uploadBeforeWorkFiles = async ({
    subContractId,
    files
}: {
    subContractId: string;
    files: File[];
}) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subcontract/public/upload-before-work/${subContractId}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};


// Upload after work files (PUBLIC - no auth)
const uploadAfterWorkFiles = async ({
    subContractId,
    files
}: {
    subContractId: string;
    files: File[];
}) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subcontract/public/upload-after-work/${subContractId}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

// Get worker submission by token (PUBLIC - no auth)
const getSubContWorkDetails = async ({
    subContractId,
}: {
    subContractId: string;
}) => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/subcontract/public/getsubcontract/basicdetail/${subContractId}`
    );
    if (!data.ok) throw new Error(data.message);
    return data.data;
};





// ==================== HOOKS ====================

const ALLOWED_ROLES = ["owner", "staff", "CTO"];

// Create SubContract Hook
export const useCreateSubContract = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            organizationId,
            projectId,
            workName,
            dateOfCommencement,
            dateOfCompletion,
            workerName,
            filesBeforeWork,
            labourCost,
            materialCost,
        }: {
            organizationId: string;
            projectId: string;
            workName: string;
            dateOfCommencement: string;
            dateOfCompletion: string,
            workerName: string,
            filesBeforeWork?: File[],
            labourCost: number,
            materialCost: number,
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await createSubContract({
                organizationId, projectId, workName, api,
                dateOfCommencement,
                dateOfCompletion,
                workerName,
                filesBeforeWork,
                labourCost,
                materialCost,

            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["subcontracts", "list", variables.organizationId]
            });
        }
    });
};



export const useUpdateSubContract = () => {
      const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            subContractId,
            workerData,
        }: {
            subContractId: string;
            workerData: {
                projectId: string
                dateOfCommencement: string;
                dateOfCompletion: string;
                workerName: string;
                labourCost: number;
                materialCost: number;
                totalCost: number;
            };
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await updateSubContract({ subContractId, workerData , api});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subcontract", "submission"]
            });
        }
    });
};


// Generate Shareable Link Hook
export const useGenerateShareableLink = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ subContractId }: { subContractId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await generateShareableLink({ subContractId, api });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["subcontract", variables.subContractId]
            });
        }
    });
};

// Get All SubContracts by Organization (Infinite Query)
export const useGetSubContractsByOrganization = (params: {
      organizationId: string;
  limit?: number;
  status?: string;
  projectId?: string;
  search?: string;

  labourCostMin?: string;
  labourCostMax?: string;
  
  materialCostMin?: string;
  materialCostMax?: string;

  totalCostMin?: string;
  totalCostMax?: string;

  dateOfCommencementFrom?: string;
  dateOfCommencementTo?: string;
  dateOfCompletionFrom?: string;
  dateOfCompletionTo?: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["subcontracts", "list", params],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await getSubContractsByOrganization({
                params: { ...params, page: pageParam },
                api
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.pagination.currentPage > 1) {
                return firstPage.pagination.currentPage - 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && ALLOWED_ROLES.includes(role) && !!params.organizationId
    });
};

// Get Single SubContract Hook
export const useGetSubContractById = ({
    subContractId,
}: {
    subContractId: string;
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["subcontract", subContractId],
        queryFn: async () => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await getSubContractById({ subContractId, api });
        },
        enabled: !!role && ALLOWED_ROLES.includes(role) && !!subContractId
    });
};

// Update Worker Status Hook
export const useUpdateWorkerStatus = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            subContractId,
            status
        }: {
            subContractId: string;
            status: "pending" | "accepted" | "rejected";
        }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await updateWorkerStatus({ subContractId, status, api });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["subcontract", variables.subContractId]
            });
            queryClient.invalidateQueries({
                queryKey: ["subcontracts", "list"]
            });
        }
    });
};

// Delete SubContract Hook
export const useDeleteSubContract = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ subContractId }: { subContractId: string }) => {
            if (!role || !ALLOWED_ROLES.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");
            return await deleteSubContract({ subContractId, api });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subcontracts", "list"]
            });
        }
    });
};





// // Delete SubContract Hook
// export const useDeleteSubContractWork = () => {
//     const { role } = useGetRole();
//     const api = getApiForRole(role!);

//     return useMutation({
//         mutationFn: async ({ subContractId, workId }: { subContractId: string, workId: string }) => {
//             if (!role || !ALLOWED_ROLES.includes(role)) {
//                 throw new Error("Not allowed to make this API call");
//             }
//             if (!api) throw new Error("API instance not found for role");
//             return await deleteSubContractWork({ subContractId, api, workId });
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["subcontracts", "list"]
//             });
//         }
//     });
// };



// ==================== PUBLIC HOOKS (No Auth Required) ====================

// Submit Worker Info Hook (PUBLIC)
export const useSubmitWorkerInfo = () => {
    return useMutation({
        mutationFn: async ({
            token,
            subContractId,
            workerData,
            files
        }: {
            token: string,
            subContractId: string;
            workerData: {
                dateOfCommencement: string;
                dateOfCompletion: string;
                workerName: string;
                labourCost: number;
                materialCost: number;
                totalCost: number;
                status: "pending" | "accepted" | "rejected";
            };
            files?: File[];
        }) => {
            return await submitWorkerInfo({ subContractId, workerData, files, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subcontract", "submission"]
            });
        }
    });
};



// Upload Before Work Files Hook (PUBLIC)
export const useUploadBeforeWorkFiles = () => {
    return useMutation({
        mutationFn: async ({
            subContractId,
            files,
        }: {
            subContractId: string;
            files: File[];
        }) => {
            return await uploadBeforeWorkFiles({ subContractId, files });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["subcontract", "submission", variables.subContractId]
            });
        }
    });
};


// Upload After Work Files Hook (PUBLIC)
export const useUploadAfterWorkFiles = () => {
    return useMutation({
        mutationFn: async ({
            subContractId,
            files,
        }: {
            subContractId: string;
            files: File[];
        }) => {
            return await uploadAfterWorkFiles({ subContractId, files });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["subcontract", "submission", variables.subContractId]
            });
        }
    });
};

// Get Worker Submission by Token Hook (PUBLIC)
export const useGetPublicSubContWorkDetails = ({
    subContractId,
}: {
    subContractId: string;
}) => {
    return useQuery({
        queryKey: ["subcontract", "submission", subContractId],
        queryFn: async () => {
            return await getSubContWorkDetails({ subContractId });
        },
        enabled: !!subContractId
    });
};