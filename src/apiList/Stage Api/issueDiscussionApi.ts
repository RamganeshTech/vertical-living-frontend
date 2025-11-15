// api/issueDiscussion.api.ts

import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';


import { type AxiosInstance } from 'axios';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';
import { queryClient } from '../../QueryClient/queryClient';
import type { IssueDiscussionFilters } from '../../Pages/Stage Pages/Issue Discussion Pages/IssueDiscussionPage';

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
    organizationId,
    convoId,
    responseContent,
    optionalMessage,
    files,
    api
}: {
    organizationId: string;
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
        `/issuediscussion/providesolution/${organizationId}/${convoId}`,
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
    organizationId,
    convoId,
    forwardToStaff,
    forwardToStaffRole,
    api
}: {
    organizationId: string;
    convoId: string;
    forwardToStaff: string;
    forwardToStaffRole: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.put(`/issuediscussion/forward/${organizationId}/${convoId}`, {
        forwardToStaff,
        forwardToStaffRole
    });

    if (!data.ok) throw new Error(data.error || 'Failed to forward issue');
    return data.data;
};

// 4. Get All Project Discussions API (with pagination for infinite scroll)
const getProjectDiscussions = async ({
    organizationId,
    page,
    limit,
    filters,
    api
}: {
    organizationId: string;
    page: number;
    limit: number;
    // status?: 'pending' | 'responded';
    // assignedToMe?: boolean;
    api: AxiosInstance;
    filters: IssueDiscussionFilters
}) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (filters.search) params.append("search", filters.search.trim());
    if (filters.projectId) params.append("projectId", filters.projectId);
    if (filters.myTickets) params.append("myTickets", "true");
    if (filters.notResponded) params.append("notResponded", "true");
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);


    const { data } = await api.get(`/issuediscussion/getall/${organizationId}?${params.toString()}`);

    if (!data.ok) throw new Error(data.message || 'Failed to fetch discussions');
    return data.data;
};

// 4. Delete Conversation API
const deleteConversation = async ({
    organizationId,
    convoId,
    api
}: {
    organizationId: string;
    convoId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/issuediscussion/deletemessage/${organizationId}/${convoId}`);

    if (!data.ok) throw new Error(data.message || 'Failed to delete conversation');
    return data;
};


// 5. to get the notificaiton for unread things 
export const getUnreadCount = async ({
    api,
    organizationId,
}: {
    api: AxiosInstance;
    organizationId: string,
}) => {
    const { data } = await api.get(`/issuediscussion/unread-count/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
    return data.count;
};



export const markAllTicketsAsRead = async ({
    api,
    organizationId,

}: {
    api: AxiosInstance;
    organizationId: string;
}) => {
    const { data } = await api.patch(`/issuediscussion/mark-all-read/${organizationId}`);
    if (!data.ok) throw new Error(data.message);
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
            organizationId // for cache invalidation
        }: {
            convoId: string;
            responseContent?: string;
            optionalMessage?: string;
            files?: File[];
            organizationId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await provideSolution({
                organizationId,
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
                queryKey: ["discussions", variables.organizationId]
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
            organizationId,
            convoId,
            forwardToStaff,
            forwardToStaffRole
        }: {
            organizationId: string;
            convoId: string;
            forwardToStaff: string;
            forwardToStaffRole: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await forwardIssue({
                organizationId,
                convoId,
                forwardToStaff,
                forwardToStaffRole,
                api
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["discussions", variables.organizationId]
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
    organizationId,
    // status,
    // assignedToMe,
    limit = 20,
    filters,
}: {
    organizationId: string;
    // status?: 'pending' | 'responded';
    // assignedToMe?: boolean;
    limit?: number;
    filters: IssueDiscussionFilters
}) => {
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useInfiniteQuery({
        queryKey: ["discussions", organizationId, filters],
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await getProjectDiscussions({
                organizationId,
                page: pageParam,
                limit,
                // status,
                // assignedToMe,
                filters,
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
        enabled: !!role && allowedRoles.includes(role) && !!organizationId,
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
            organizationId // for cache invalidation
        }: {
            convoId: string;
            organizationId: string;
        }) => {
            if (!role || !allowedRoles.includes(role)) {
                throw new Error("Not allowed to make this API call");
            }
            if (!api) throw new Error("API instance not found for role");

            return await deleteConversation({
                organizationId,
                convoId,
                api
            });
        },
        onSuccess: (_, variables) => {
            // Invalidate discussions list
            queryClient.invalidateQueries({
                queryKey: ["discussions", variables.organizationId]
            });

            // Show success message
            console.log("Conversation deleted successfully");
        },
        onError: (error) => {
            console.error("Failed to delete conversation:", error);
        }
    });
};




export const useGetUnreadTicketCount = ({ organizationId }: { organizationId: string }) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO", "worker"];

    return useQuery({
        queryKey: ["ticket", "unread-count"],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getUnreadCount({ api, organizationId });
        },
        enabled: !!role && !!api && allowedRoles.includes(role),
    });
};

/*
 * Mark all tickets as read
 */
export const useMarkAllTicketAsRead = ({ organizationId }: { organizationId: string }) => {
    const { role } = useGetRole();
    const allowedRoles = ["owner", "staff", "CTO", "worker"];
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await markAllTicketsAsRead({ api, organizationId });
        },
        onSuccess: () => {
            // Invalidate all notification queries
            // queryClient.invalidateQueries({ queryKey: ["ticket"] });
            queryClient.invalidateQueries({ queryKey: ["ticket", "unread-count"] });

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