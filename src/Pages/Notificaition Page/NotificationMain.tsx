import { useEffect, useRef, useState } from 'react'
import { useDeleteNotification, useInfiniteNotifications, useMarkNotificationAsRead } from '../../apiList/Notificaiton Api/notificationApi';
import NotificationCard from './NotificationCard';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { socket } from '../../lib/socket'; // ✅ Import your socket
import { queryClient } from '../../QueryClient/queryClient';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';

const NotificationMain = () => {
    const navigate = useNavigate()
    const currentUser = useCurrentSupervisor()

    const {
        data,
        fetchNextPage,
        hasPreviousPage,
        isFetchingPreviousPage,
        isLoading,
        isError,
        error
    } = useInfiniteNotifications(20);
    const [_shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

    const markAsRead = useMarkNotificationAsRead();
    const deleteNotif = useDeleteNotification();
    const containerRef = useRef<HTMLDivElement>(null);
    // const observerTarget = useRef<HTMLDivElement>(null);
    const topObserverRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null)




    // ✅ SOCKET.IO REAL-TIME NOTIFICATIONS
    useEffect(() => {
        // Get user ID from your auth (adjust based on your setup)
        const userId = currentUser?.id // or from context/zustand


        if (!userId) return;

        // Join notification room
        socket.emit('join_notifications', { userId });

        // ✅ Listen for new notifications
        const handleNewNotification = (data: any) => {
            console.log('🔔 New notification received:', data);

            // Refetch notifications
            queryClient.invalidateQueries({ queryKey: ["notifications", "infinite"] });
            setShouldScrollToBottom(true); // Scroll to bottom when new notification arrives
            // Optional: Play sound or show toast
            // new Audio('/notification-sound.mp3').play();
        };

        // ✅ Listen for unread count updates
        const handleUnreadCountUpdate = (data: { count: number }) => {
            console.log('📊 Unread count updated:', data?.count);
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        };

        // Attach listeners
        socket.on('new_notification', handleNewNotification);
        socket.on('unread_count_update', handleUnreadCountUpdate);

        // Cleanup on unmount
        return () => {
            socket.off('new_notification', handleNewNotification);
            socket.off('unread_count_update', handleUnreadCountUpdate);
        };
    }, [queryClient]);

    // Auto-load more when scrolling to bottom
    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         entries => {
    //             if (entries[0].isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
    //                 fetchNextPage();
    //             }
    //         },
    //         { threshold: 1 }
    //     );

    //     if (observerTarget.current) {
    //         observer.observe(observerTarget.current);
    //     }

    //     return () => {
    //         if (observerTarget.current) {
    //             observer.unobserve(observerTarget.current);
    //         }
    //     };
    // }, [hasPreviousPage, isFetchingPreviousPage, fetchNextPage]);

    // ✅ INTERSECTION OBSERVER FOR LOADING MORE (AT TOP)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
                    console.log('📜 Loading older notifications...');

                    // Save current scroll position
                    const container = containerRef.current;
                    const scrollHeightBefore = container?.scrollHeight || 0;
                    const scrollTopBefore = container?.scrollTop || 0;

                    fetchNextPage().then(() => {
                        // Restore scroll position after loading
                        setTimeout(() => {
                            if (container) {
                                const scrollHeightAfter = container.scrollHeight;
                                const heightDifference = scrollHeightAfter - scrollHeightBefore;
                                container.scrollTop = scrollTopBefore + heightDifference;
                            }
                        }, 100);
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (topObserverRef.current) {
            observer.observe(topObserverRef.current);
        }

        return () => {
            if (topObserverRef.current) {
                observer.unobserve(topObserverRef.current);
            }
        };
    }, [hasPreviousPage, isFetchingPreviousPage, fetchNextPage]);

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "https://houseofram.in"

    // Flatten all pages of notifications
    // const allNotifications = data?.pages?.flatMap(page => page.notifications) ?? [];
    const allNotifications = data?.pages?.flatMap(page => page?.notifications)?.reverse() ?? [];
    // const unreadCount = allNotifications.filter((n) => !n.isRead).length

    useEffect(() => {
        if (bottomRef.current && !isLoading) {
            bottomRef.current.scrollIntoView({ behavior: "auto" })
            setShouldScrollToBottom(false);
        }
    }, [allNotifications.length, isLoading])

    const handleMarkAsRead = (notificationId: string) => {
        markAsRead.mutate({ notificationId });
    };

    const handleDelete = (notificationId: string) => {
        deleteNotif.mutate({ notificationId });
    };

    if (isLoading) {
        return (
            <MaterialOverviewLoading />
        )
    }

    if (isError) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>Error loading notifications: {error?.message || "Unknown error"}</span>
                    </div>
                </div>
            </div>
        )
    }

    // if (allNotifications?.length === 0) {
    //     return (
    //         <div className="w-full max-w-2xl mx-auto p-4">
    //             <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
    //                 <i className="fas fa-bell text-4xl text-slate-300 mb-3 block"></i>
    //                 <p className="text-slate-600 font-medium">No notifications yet</p>
    //                 <p className="text-slate-500 text-sm mt-1">You're all caught up! Check back later for updates.</p>
    //             </div>
    //         </div>
    //     )
    // }

    return (


        <div className="w-full min-h-full max-h-full overflow-y-auto bg-white">
            <div className="max-w-full mx-auto">
                <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
                    <div className="px-4 md:px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div onClick={() => navigate(-1)} className="cursor-pointer w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-arrow-left text-blue-600 text-lg"></i>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-bell text-blue-600 text-lg"></i>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Notifications

                                    <Badge className='ml-2'>
                                        <i className="fa-solid fa-flask mr-2"></i>
                                        In Development</Badge>
                                </h1>

                                {/* <p className="text-xs text-slate-500 mt-0.5">
                                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                                </p> */}
                            </div>
                        </div>

                        {/* <nav className="flex items-center gap-2">
              <a
                href={frontendUrl}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Go to home"
              >
                <i className="fas fa-home"></i>
              </a>
              <a
                href={`${frontendUrl}/settings`}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Settings"
              >
                <i className="fas fa-cog"></i>
              </a>
            </nav> */}
                    </div>
                </div>

                {
                    allNotifications.length === 0 ?

                        <div className="w-full max-w-2xl mx-auto p-4" >
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                                <i className="fas fa-bell text-4xl text-slate-300 mb-3 block"></i>
                                <p className="text-slate-600 font-medium">No notifications yet</p>
                                <p className="text-slate-500 text-sm mt-1">You're all caught up! Check back later for updates.</p>
                            </div>
                        </div>
                        : <div className="p-4 md:p-6">
                            <div ref={containerRef} className="mb-0 flex justify-center">
                                {isFetchingPreviousPage && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-medium">Loading earlier notifications...</span>
                                    </div>
                                )}
                                {/* {!hasPreviousPage && allNotifications.length > 0 && (
              <p className="text-slate-400 text-xs font-medium">You're at the beginning</p>
            )} */}
                            </div>

                            <div className="space-y-3">
                                {allNotifications.map((notification) => (
                                    <NotificationCard
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                        frontendUrl={frontendUrl}
                                    />
                                ))}
                            </div>

                            <div ref={bottomRef} />
                        </div>}
            </div>
        </div >
    )
}

export default NotificationMain