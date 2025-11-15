// components/TicketOperationBadge.tsx
import React, { useEffect,  useState } from 'react';
import { socket } from '../../lib/socket';
import { useGetUnreadTicketCount } from '../../apiList/Stage Api/issueDiscussionApi';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';


interface Props {
    size?: 'small' | 'large';
    organizationId: string
}

export const TicketOperationBadge: React.FC<Props> = React.memo(({ size = 'small', organizationId }) => {
    // const { data: unreadCount, isLoading } = useGetUnreadTicketCount({ organizationId });
    const { data:count, isLoading } = useGetUnreadTicketCount({ organizationId });
    const currentUser = useCurrentSupervisor();

    // console.log('calling 📊 Unread count updated:',);
    // useEffect(() => {
    //     const userId = currentUser?.id;

    //     console.log("userId form ticket notfication", userId)
    //     if (!userId || !socket || !organizationId) return;

   
    //     // socket.on("connect", () => {   
    //     //     socket.emit("join_ticket_discussion", { organizationId });
    //     // });
    //     console.log("gettng inside the ticket notificaiton")
    //     // socket.emit('join_ticket_discussion', { organizationId, userId: userId });


    //     const handleUnread = () => {
    //         //   console.log('calling 📊 Unread count updated:',);
    //     console.log("unreadCount", unreadCount)
    //     // Refetch notifications
    //     // if (unreadCount !== undefined) {
    //         // console.log("ticket unread-count")


    //         // queryClient.invalidateQueries({ queryKey: ["ticket", "unread-count"] });
    //     };



    //     socket.on('unread_ticket_count_update', handleUnread );
    //     console.log("gettng after the ticket notificaiton")

    //     return () => {
    //         socket.off('unread_ticket_count_update', handleUnread);
    //     };
    // }, []);

    const [unreadCount, setUnreadCount] = useState<number>(0);

      useEffect(() => {
        if (typeof count === 'number') {
            setUnreadCount(count);
        }
    }, [count]);



    
    useEffect(() => {
        const userId = currentUser?.id;
        if (!userId || !socket || !organizationId) return;

        // Join ticket discussion room once
        // socket.emit('join_ticket_discussion', { organizationId, userId });

        // Handle real-time unread count updates
        const handleUnread = (payload: { count: number }) => {
            console.log('🔔 unread_ticket_count_update:', payload.count);
            setUnreadCount(payload.count);

            // Optional: Refetch query to ensure backend & hook are in sync
            // refetch();
        };

        socket.on('unread_ticket_count_update', handleUnread);

        return () => {
            socket.off('unread_ticket_count_update', handleUnread);
        };
    }, []);



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

TicketOperationBadge.displayName = 'TicketOperationBadge';