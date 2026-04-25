import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "../QueryClient/queryClient"
import type { ProjectInput } from "../components/CreateProject"
import { getApiForRole } from "../utils/roleCheck"
import useGetRole from "../Hooks/useGetRole"
import type { AxiosInstance } from "axios"

const createProject = async ({ api, projectData, orgsId }: { api: AxiosInstance, projectData: Record<any, any>, orgsId: string }) => {
    try {
        let { data } = await api.post(`/project/createproject/${orgsId}`, projectData)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}

const getProjects = async ({ orgsId, api }: { orgsId: string, api: AxiosInstance, }) => {
    try {

        let { data } = await api.get(`/project/getprojects/${orgsId}`)
        if (data.ok) {
            return data.data
        }
        return []
    }
    catch (error) {
        throw error
    }
}



export const getAllProjectsApi = async ({
    organizationId,
    page = 1,
    limit = 10,
    projectName,
    status,
    priority,
    startDate,
    endDate,
    isCompleted, // 1. Extract the new parameter
    api,
    isArchived
}: {
    organizationId: string;
    page: number;
    limit: number;
    projectName?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    isCompleted?: boolean; // Type here
    api: any; // AxiosInstance
    isArchived?: boolean
}) => {
    const { data } = await api.get(`/project/v1/getprojects/${organizationId}`, {
        params: {
            page,
            limit,
            projectName,
            status,
            priority,
            startDate,
            endDate,
            isCompleted,
            isArchived
        }
    });
    if (!data.ok) throw new Error(data.message);
    return data;
};

const deleteProject = async (projectId: string, api: AxiosInstance) => {
    try {
        let { data } = await api.delete(`/project/deleteproject/${projectId}`)
        if (data.ok) {
            return data.data
        }
    }
    catch (error) {
        throw error
    }
}

const assignClientProject = async ({ projectId, clientId, api }: { projectId: string, clientId: string, api: AxiosInstance, }) => {
    try {
        let { data } = await api.patch(`/project/assignprojectclient/${projectId}/${clientId}`)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}

const updateProject = async ({ projectId, formData, api }: { projectId: string, api: AxiosInstance, formData: ProjectInput }) => {
    try {
        let { data } = await api.put(`/project/updateproject/${projectId}`, formData)
        if (data.ok) {
            return data
        }
    }
    catch (error) {
        throw error
    }
}


const toggleProjectArchiveApi = async ({
    projectId,
    isArchived,
    api
}: {
    projectId: string;
    isArchived: boolean;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/project/archive/${projectId}`, { isArchived });

    if (!data.ok) throw new Error(data.message);

    return data.data;
};


export const useGetProjects = (orgsId: string) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "worker", "client"];

    return useQuery({
        queryKey: ["project"],
        queryFn: async () => {
            if (!role) throw new Error("Not Allowed");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed");
            if (!api) throw new Error("API not found");
            return await getProjects({ orgsId, api })
        },
        enabled: !!role,
        refetchOnWindowFocus: false,
        retry: false,
    })
}


const allowedProjectRoles = ["owner", "staff", "CTO", "client", "worker"];

export const useGetAllProjects = ({
    organizationId,
    limit = 20,
    projectName,
    status,
    priority,
    startDate,
    endDate,
    isCompleted,
    isArchived
}: {
    organizationId?: string;
    limit?: number;
    projectName?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    isCompleted?: boolean; // Type here
    isArchived?: boolean
}) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        // The queryKey must change whenever a filter changes to trigger a re-fetch
        queryKey: ["projects", organizationId, projectName, status, priority, startDate, endDate, isCompleted, isArchived],

        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedProjectRoles.includes(role)) {
                throw new Error("Not allowed to access projects");
            }
            if (!api) throw new Error("API instance not found");

            return await getAllProjectsApi({
                organizationId: organizationId!,
                page: pageParam as number,
                limit,
                projectName,
                status,
                priority,
                startDate,
                endDate,
                isCompleted,
                isArchived,
                api
            });
        },

        getNextPageParam: (lastPage) => {
            // Mapping to your backend result: data.pagination.currentPage
            const { currentPage, totalPages } = lastPage.data.pagination;
            if (currentPage < totalPages) {
                return currentPage + 1;
            }
            return undefined;
        },

        initialPageParam: 1,

        // Only run the query if we have the necessary IDs and Permissions
        enabled: !!role && allowedProjectRoles.includes(role) && !!organizationId
    });
};

export const useCreateProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({ projectData, orgsId, }: { projectData: Record<string, any>, orgsId: string; }) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await createProject({ api, orgsId, projectData });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}


export const useDeleteProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "CTO"];
    return useMutation({
        mutationFn: async (projectId: string) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await deleteProject(projectId, api)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}

export const useUpdateProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];
    return useMutation({
        mutationFn: async ({ projectId, formData }: { projectId: string, formData: ProjectInput }) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await updateProject({ projectId, formData, api })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}

export const useAssignClientToProject = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    return useMutation({
        mutationFn: async ({ projectId, clientId }: { projectId: string, clientId: string }) => {
            if (!role) throw new Error("Not Authrorized");
            if (!allowedRoles.includes(role)) throw new Error("Not Allowed to make api calls");
            if (!api) throw new Error("API not found");
            return await assignClientProject({ projectId, clientId, api })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] })
        }
    })
}



export const useToggleProjectArchive = () => {
    const allowedRoles = ["owner", "staff", "CTO"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({
            projectId,
            isArchived
        }: {
            projectId: string;
            isArchived: boolean;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to perform this action");
            }

            if (!api) {
                throw new Error("API instance not found for role");
            }

            return await toggleProjectArchiveApi({ projectId, isArchived, api });
        },

        onSuccess: () => {
            // 🔄 refresh project list + single project if needed
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project"] });
        }
    });
};