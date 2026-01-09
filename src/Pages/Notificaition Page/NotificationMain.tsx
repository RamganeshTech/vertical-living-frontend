import { useEffect, useRef } from 'react'
import { useDeleteNotification, useInfiniteNotifications, useMarkAllNotificationsAsRead } from '../../apiList/Notificaiton Api/notificationApi';
import NotificationCard from './NotificationCard';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { socket } from '../../lib/socket';
import { queryClient } from '../../QueryClient/queryClient';
import { useNavigate } from 'react-router-dom';
// import { Badge } from '../../components/ui/Badge';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const NotificationMain = () => {
    const navigate = useNavigate()
    const currentUser = useCurrentSupervisor()
    const user = useSelector((state:RootState) => state.authStore )

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteNotifications(20);

    // const markAsRead = useMarkNotificationAsRead();

    const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead()
    const deleteNotif = useDeleteNotification();

    const containerRef = useRef<HTMLDivElement>(null);
    const bottomObserverRef = useRef<HTMLDivElement>(null);
    // const isFirstLoad = useRef(true);
    const previousScrollHeight = useRef(0);

    // ✅ SOCKET.IO REAL-TIME NOTIFICATIONS
    useEffect(() => {
        const userId = currentUser?.id
        if (!userId) return;

        socket.emit('join_notifications', { userId });

        const handleNewNotification = (data: any) => {
            console.log('🔔 New notification received:', data);

            // Save current scroll position
            const container = containerRef.current;
            // const wasAtBottom = container ? 
            //     (container.scrollHeight - container.scrollTop - container.clientHeight < 100) : false;

            queryClient.invalidateQueries({ queryKey: ["notifications", "infinite"] });

            // Auto-scroll to bottom if user was already at bottom
            // if (wasAtBottom) {
            setTimeout(() => {
                container?.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
            // }
        };

        const handleUnreadCountUpdate = () => {
            // console.log('📊 Unread count updated:', data?.count);
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        };

        socket.on('new_notification', handleNewNotification);
        socket.on('unread_count_update', handleUnreadCountUpdate);

        return () => {
            socket.off('new_notification', handleNewNotification);
            socket.off('unread_count_update', handleUnreadCountUpdate);
        };
    }, [currentUser?.id]);

    // ✅ Process and sort notifications
    const allNotifications = data?.pages
        ?.flatMap(page => page?.notifications)
        ?.sort((a, b) => new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime())
        ?? [];


        console.log("data.pages.", data?.pages)

   
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // Check if scrolled near bottom (to load older notifications)
            const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

            if (nearBottom && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading older notifications...');

                previousScrollHeight.current = container.scrollHeight;

                fetchNextPage().then(() => {
                    requestAnimationFrame(() => {
                        const newScrollHeight = container.scrollHeight;
                        const heightDifference = newScrollHeight - previousScrollHeight.current;
                        container.scrollTop = container.scrollTop + heightDifference;
                    });
                });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    // ✅ Mark all as read
    useEffect(() => {
        const handleMarkAsReadHandler = async () => {
            await markAllAsRead()
        }
        if (data) {
            handleMarkAsReadHandler()
        }
    }, [data, markAllAsRead])

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "https://houseofram.in"


    const handleDelete = async (notificationId: string) => {
        try {
            await deleteNotif.mutateAsync({ notificationId });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (isLoading) {
        return <MaterialOverviewLoading />
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

    return (
        <div className="w-full max-h-full overflow-y-auto flex flex-col bg-white">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 flex-shrink-0">
                <div className="px-4 md:px-6 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div onClick={() => navigate(-1)} className="cursor-pointer w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-arrow-left text-blue-600 text-lg"></i>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-bell text-blue-600 text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                                Notifications {user?.userName ? `for (${user?.userName})` : ""}
                                {/* <Badge className='ml-2'>
                                    <i className="fa-solid fa-flask mr-2"></i>
                                    In Development
                                </Badge> */}
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6"
                style={{ scrollBehavior: 'auto' }}
            >
                {allNotifications.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                            <i className="fas fa-bell text-4xl text-slate-300 mb-3 block"></i>
                            <p className="text-slate-600 font-medium">No notifications yet</p>
                            <p className="text-slate-500 text-sm mt-1">You're all caught up! Check back later for updates.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Loading indicator at the top */}


                        {/* Notifications */}
                        <div className="space-y-3">
                            {allNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                    onDelete={handleDelete}
                                    deleteMutation={deleteNotif}
                                    frontendUrl={frontendUrl}
                                />
                            ))}
                        </div>

                        <div ref={bottomObserverRef} className="flex justify-center py-2">
                            {isFetchingNextPage && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-medium">Loading earlier notifications...</span>
                                </div>
                            )}
                            {!hasNextPage && allNotifications.length > 0 && (
                                <p className="text-slate-400 text-xs font-medium">You’ve reached the end</p>
                            )}
                        </div>

                     
                    </>
                )}
            </div>
        </div>
    )
}

export default NotificationMain