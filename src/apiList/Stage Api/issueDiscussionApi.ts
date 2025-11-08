// api/issueDiscussion.api.ts

import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';


import { type AxiosInstance } from 'axios';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';

// 1. Create Issue API
const createIssue = async ({
    organizationId,
    projectId,
    selectStaff,
    selectStaffRole,
    issue,
    responseType,
    isMessageRequired,
    dropdownOptions,
    files,
    api
}: {
    organizationId: string;
    projectId: string;
    selectStaff: string;
    selectStaffRole: string;
    issue: string;
    responseType: 'dropdown' | 'text' | 'file';
    isMessageRequired: boolean;
    dropdownOptions?: string[];
    files?: File[];
    api: AxiosInstance;
}) => {

    const formData = new FormData();

    if (organizationId) {
        formData.append('organizationId', organizationId);
    }

    if (projectId) {
        formData.append('projectId', projectId);
    }


    if (selectStaff) {
        formData.append('selectStaff', selectStaff);
    }


    if (selectStaffRole) {
        formData.append('selectStaffRole', selectStaffRole);
    }

    if (issue) {
        formData.append('issue', issue);
    }


    if (responseType) {
        formData.append('responseType', responseType);
    }


    if (isMessageRequired) {
        formData.append('isMessageRequired', String(isMessageRequired));
    }


    if (dropdownOptions) {
        formData.append('dropdownOptions', JSON.stringify(dropdownOptions));
    }



    if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file));
    }


    // const { data } = await api.post('/issuediscussion/createissue', {
    //     organizationId,
    //     projectId,
    //     selectStaff,
    //     selectStaffRole,
    //     issue,
    //     responseType,
    //     isMessageRequired,
    //     dropdownOptions
    // });

    const { data } = await api.post('/issuediscussion/createissue', formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );


    if (!data.ok) throw new Error(data.message || 'Failed to create issue');
    return data.data;
};

// 2. Provide Solution/Add Response API
const provideSolution = async ({
    projectId,
    convoId,
    responseContent,
    optionalMessage,
    files,
    api
}: {
    projectId: string;
    convoId: string;
    responseContent?: string;
    optionalMessage?: string;
    files?: File[];
    api: AxiosInstance;
}) => {
    const formData = new FormData();

    if (responseContent) {
        formData.append('responseContent', responseContent);
    }

    if (optionalMessage) {
        formData.append('optionalMessage', optionalMessage);
    }

    if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file));
    }

    const { data } = await api.post(
        `/issuediscussion/providesolution/${projectId}/${convoId}`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );

    if (!data.ok) throw new Error(data.message || 'Failed to provide solution');
    return data.data;
};


//  3. Forward the issue to another staff

const forwardIssue = async ({
    projectId,
    convoId,
    forwardToStaff,
    forwardToStaffRole,
    api
}: {
    projectId: string;
    convoId: string;
    forwardToStaff: string;
    forwardToStaffRole: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/issuediscussion/forward/${projectId}/${convoId}`, {
        forwardToStaff,
        forwardToStaffRole
    });

    if (!data.ok) throw new Error(data.error || 'Failed to forward issue');
    return data.data;
};

// 4. Get All Project Discussions API (with pagination for infinite scroll)
const getProjectDiscussions = async ({
    projectId,
    page,
    limit,
    status,
    assignedToMe,
    api
}: {
    projectId: string;
    page: number;
    limit: number;
    status?: 'pending' | 'responded';
    assignedToMe?: boolean;
    api: AxiosInstance;
}) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (status) params.append('status', status);
    if (assignedToMe !== undefined) params.append('assignedToMe', assignedToMe.toString());

    const { data } = await api.get(`/issuediscussion/getall/${projectId}?${params}`);

    if (!data.ok) throw new Error(data.message || 'Failed to fetch discussions');
    return data.data;
};

// 4. Delete Conversation API
const deleteConversation = async ({
    projectId,
    convoId,
    api
}: {
    projectId: string;
    convoId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/issuediscussion/deletemessage/${projectId}/${convoId}`);

    if (!data.ok) throw new Error(data.message || 'Failed to delete conversation');
    return data;
};





// HOOKS

// 1. Hook for Creating Issue
export const useCreateIssue = () => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            organizationId,
            projectId,
            selectStaff,
            selectStaffRole,
            issue,
            responseType,
            isMessageRequired,
            dropdownOptions,
            files
        }: {
            organizationId: string;
            projectId: string;
            selectStaff: string;
            selectStaffRole: string;
            issue: string;
            responseType: 'dropdown' | 'text' | 'file';
            isMessageRequired: boolean;
            dropdownOptions?: string[];
            files?: File[];
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await createIssue({
                organizationId,
                projectId,
                selectStaff,
                selectStaffRole,
                issue,
                responseType,
                isMessageRequired,
                dropdownOptions,
                files,
                api
            });
        },
        onSuccess: (_, variables) => {
            // Invalidate discussions list
            queryClient.invalidateQueries({
                queryKey: ["discussions", variables.projectId]
            });

            // Invalidate user's raised issues
            queryClient.invalidateQueries({
                queryKey: ["user-raised-issues"]
            });
        },
        onError: (error) => {
            console.error("Failed to create issue:", error);
        }
    });
};

// 2. Hook for Providing Solution/Response
export const useProvideSolution = () => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            convoId,
            responseContent,
            optionalMessage,
            files,
            projectId // for cache invalidation
        }: {
            convoId: string;
            responseContent?: string;
            optionalMessage?: string;
            files?: File[];
            projectId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await provideSolution({
                projectId,
                convoId,
                responseContent,
                optionalMessage,
                files,
                api
            });
        },
        onSuccess: (_, variables) => {
            // Invalidate discussions list
            queryClient.invalidateQueries({
                queryKey: ["discussions", variables.projectId]
            });

            // Invalidate user's assigned issues
            queryClient.invalidateQueries({
                queryKey: ["user-assigned-issues"]
            });
        },
        onError: (error) => {
            console.error("Failed to provide solution:", error);
        }
    });
};



//  4 hook forr forwarding rhe iisue


// hooks/useIssueDiscussion.ts

export const useForwardIssue = () => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            convoId,
            forwardToStaff,
            forwardToStaffRole
        }: {
            projectId: string;
            convoId: string;
            forwardToStaff: string;
            forwardToStaffRole: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await forwardIssue({
                projectId,
                convoId,
                forwardToStaff,
                forwardToStaffRole,
                api
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["discussions", variables.projectId]
            });
            queryClient.invalidateQueries({
                queryKey: ["user-assigned-issues"]
            });
        },
        onError: (error) => {
            console.error("Failed to forward issue:", error);
        }
    });
};


// 4. Hook for Getting Project Discussions (Infinite Query)
export const useGetProjectDiscussions = ({
    projectId,
    status,
    assignedToMe,
    limit = 20
}: {
    projectId: string;
    status?: 'pending' | 'responded';
    assignedToMe?: boolean;
    limit?: number;
}) => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["discussions", projectId, status, assignedToMe],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await getProjectDiscussions({
                projectId,
                page: pageParam,
                limit,
                status,
                assignedToMe,
                api
            });
        },
        getNextPageParam: (lastPage) => {
            const totalPages = Math.ceil(lastPage.totalConversations / lastPage.limit);
            if (lastPage.page < totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.page > 1) {
                return firstPage.page - 1;
            }
            return undefined;
        },
        enabled: !!role && allowedRoles.includes(role) && !!projectId,
        initialPageParam: 1,
    });
};

// 4. Hook for Deleting Conversation
export const useDeleteConversation = () => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            convoId,
            projectId // for cache invalidation
        }: {
            convoId: string;
            projectId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await deleteConversation({
                projectId,
                convoId,
                api
            });
        },
        onSuccess: (_, variables) => {
            // Invalidate discussions list
            queryClient.invalidateQueries({
                queryKey: ["discussions", variables.projectId]
            });

            // Show success message
            console.log("Conversation deleted successfully");
        },
        onError: (error) => {
            console.error("Failed to delete conversation:", error);
        }
    });
};

// Additional helper hook for fetching user's assigned issues
export const useGetUserAssignedIssues = ({
    status,
    limit = 20
}: {
    status?: 'pending' | 'responded';
    limit?: number;
} = {}) => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["user-assigned-issues", status],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: limit.toString()
            });

            if (status) params.append('status', status);

            const { data } = await api.get(`/issuediscussion/user/assigned-issues?${params}`);

            if (!data.ok) throw new Error(data.error || 'Failed to fetch assigned issues');
            return data.data;
        },
        getNextPageParam: (lastPage) => {
            const totalPages = Math.ceil(lastPage.totalConversations / lastPage.limit);
            if (lastPage.page < totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.page > 1) {
                return firstPage.page - 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && allowedRoles.includes(role),
    });
};

// Additional helper hook for fetching user's raised issues
export const useGetUserRaisedIssues = ({
    status,
    limit = 20
}: {
    status?: 'pending' | 'responded';
    limit?: number;
} = {}) => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["user-raised-issues", status],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: limit.toString()
            });

            if (status) params.append('status', status);

            const { data } = await api.get(`/issuediscussion/user/raised-issues?${params}`);

            if (!data.ok) throw new Error(data.error || 'Failed to fetch raised issues');
            return data.data;
        },
        getNextPageParam: (lastPage) => {
            const totalPages = Math.ceil(lastPage.totalConversations / lastPage.limit);
            if (lastPage.page < totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.page > 1) {
                return firstPage.page - 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!role && allowedRoles.includes(role),
    });
};