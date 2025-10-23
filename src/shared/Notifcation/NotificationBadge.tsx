// components/NotificationBadge.tsx
import React, { useEffect, useCallback } from 'react';
import { useGetUnreadCount } from '../../apiList/Notificaiton Api/notificationApi';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';
import { queryClient } from '../../QueryClient/queryClient';
import { socket } from '../../lib/socket';


interface NotificationBadgeProps {
    size?: 'small' | 'large';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = React.memo(({ size = 'small' }) => {
    const { data: unreadCount, isLoading } = useGetUnreadCount();
    const currentUser = useCurrentSupervisor();

    const handlegetUnreadCount = useCallback(() => {
        console.log('calling 📊 Unread count updated:',);
        // Refetch notifications
        if (unreadCount !== undefined) {
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        }
    }, [])

    useEffect(() => {
        const userId = currentUser?.id;
        if (!userId) return;

        socket.emit('join_notifications', { userId });
        socket.on('unread_count_update', handlegetUnreadCount);

        return () => {
            socket.off('unread_count_update', handlegetUnreadCount);
        };
    }, [currentUser?.id, handlegetUnreadCount]);

    const showBadge = !isLoading && typeof unreadCount === 'number' && unreadCount > 0;

    if (!showBadge) return null;

    if (size === 'large') {
        return (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
            </span>
        );
    }

    return (
        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
        </span>
    );
});

NotificationBadge.displayName = 'NotificationBadge';