import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';

// frontend/src/api/notification.api.ts

import { type AxiosInstance } from 'axios';
import useGetRole from '../../Hooks/useGetRole';
import { getApiForRole } from '../../utils/roleCheck';
import { queryClient } from '../../QueryClient/queryClient';

// ===== API FUNCTIONS =====

/**
 * Get all notifications for user
 */
export const getAllNotifications = async ({
    page = 1,
    limit = 20,
    api
}: {
    page?: number;
    limit?: number;
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/notification/getAllNotification?page=${page}&limit=${limit}`);
    if (!data.ok) throw new Error(data.message);

    // Return in the format expected by infinite query
    return {
        notifications: data.data.notifications,
        total: data.data.total,
        page: data.data.page,
        totalPages: data.data.totalPages,
        ok: data.ok,
        message: data.message
    };
};
/**
 * Get unread notifications
 */
export const getUnreadNotifications = async ({
    api
}: {
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/notification/unread`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

/**
 * Get unread count
 */
export const getUnreadCount = async ({
    api
}: {
    api: AxiosInstance;
}) => {
    const { data } = await api.get(`/notification/unread-count`);
    if (!data.ok) throw new Error(data.message);
    return data.count;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async ({
    notificationId,
    api
}: {
    notificationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.patch(`/notification/${notificationId}/read`);
    if (!data.ok) throw new Error(data.message);
    return data.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async ({
    api
}: {
    api: AxiosInstance;
}) => {
    const { data } = await api.patch(`/notification/mark-all-read`);
    if (!data.ok) throw new Error(data.message);
    return data;
};

/**
 * Delete notification
 */
export const deleteNotification = async ({
    notificationId,
    api
}: {
    notificationId: string;
    api: AxiosInstance;
}) => {
    const { data } = await api.delete(`/notification/${notificationId}`);
    if (!data.ok) throw new Error(data.message);
    return data;
};



// hooks 


const allowedRoles = ["owner", "staff", "CTO"];



// ===== QUERY HOOKS =====


// ===== TYPES =====
export interface NotificationPageResponse {
    notifications: any[];
    total: number;
    page: number;
    totalPages: number;
    ok: boolean;
    message: string;
}

/**
 * Get all notifications with infinite scroll
 */
export const useInfiniteNotifications = (limit: number = 20) => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    // ✅ REMOVE THE GENERIC TYPES - Let TypeScript infer them
    return useInfiniteQuery({
        queryKey: ["notifications", "infinite", limit],
        enabled: !!role && !!api && allowedRoles.includes(role),
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            
            console.log('🔔 Fetching notifications page:', pageParam);
            return await getAllNotifications({ page: pageParam, limit, api });
        },
        getNextPageParam: (lastPage) => {
            console.log('🔍 Last page received:', lastPage);
            console.log('🔍 Available properties:', Object.keys(lastPage));

            const currentPage = lastPage.page;
            const totalPages = lastPage.totalPages;

            console.log('🔍 Pagination calculation:', {
                currentPage,
                totalPages,
                notificationsCount: lastPage.notifications.length,
                total: lastPage.total,
                condition: `${currentPage} < ${totalPages}`,
                result: currentPage < totalPages
            });

            const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;
            console.log('🔍 Next page will be:', nextPage);

            return nextPage;
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

/**
 * Get unread notifications
 */
export const useGetUnreadNotifications = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["notifications", "unread"],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getUnreadNotifications({ api });
        },
        enabled: !!role && !!api && allowedRoles.includes(role),
        staleTime: 1000 * 60 * 1, // 1 minute
    });
};

/**
 * Get unread count
 */
export const useGetUnreadCount = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await getUnreadCount({ api });
        },
        enabled: !!role && !!api && allowedRoles.includes(role),
    });
};

// ===== MUTATION HOOKS =====

/**
 * Mark notification as read
 */
export const useMarkNotificationAsRead = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ notificationId }: { notificationId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await markNotificationAsRead({ notificationId, api });
        },
        onSuccess: () => {
            // Invalidate all notification queries
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async () => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await markAllNotificationsAsRead({ api });
        },
        onSuccess: () => {
            // Invalidate all notification queries
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
};

/**
 * Delete notification
 */
export const useDeleteNotification = () => {
    const { role } = useGetRole();
    const api = getApiForRole(role!);

    return useMutation({
        mutationFn: async ({ notificationId }: { notificationId: string }) => {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to make this API call");
            if (!api) throw new Error("API instance not found for role");
            return await deleteNotification({ notificationId, api });
        },
        onSuccess: () => {
            // Invalidate all notification queries
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
};
