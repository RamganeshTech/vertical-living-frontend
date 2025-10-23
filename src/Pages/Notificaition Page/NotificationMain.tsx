// import { useEffect, useRef } from 'react'
// import { useDeleteNotification, useInfiniteNotifications, useMarkAllNotificationsAsRead,
//     //  useMarkNotificationAsRead 
//     } from '../../apiList/Notificaiton Api/notificationApi';
// import NotificationCard from './NotificationCard';
// import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
// import { socket } from '../../lib/socket'; // ✅ Import your socket
// import { queryClient } from '../../QueryClient/queryClient';
// import { useNavigate } from 'react-router-dom';
// import { Badge } from '../../components/ui/Badge';
// import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';

// const NotificationMain = () => {
//     const navigate = useNavigate()
//     const currentUser = useCurrentSupervisor()

//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//         error
//     } = useInfiniteNotifications(6);
//     // const [_shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

//     // const markAsRead = useMarkNotificationAsRead();
//     const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead()
//     const deleteNotif = useDeleteNotification();

//     const containerRef = useRef<HTMLDivElement>(null);
//     const bottomRef = useRef<HTMLDivElement>(null);

//     // ✅ SOCKET.IO REAL-TIME NOTIFICATIONS
//     useEffect(() => {
//         // Get user ID from your auth (adjust based on your setup)
//         const userId = currentUser?.id // or from context/zustand


//         if (!userId) return;

//         // Join notification room
//         socket.emit('join_notifications', { userId });

//         // ✅ Listen for new notifications
//         const handleNewNotification = (data: any) => {
//             console.log('🔔 New notification received:', data);

//             // Refetch notifications
//             queryClient.invalidateQueries({ queryKey: ["notifications", "infinite"] });
//             // setShouldScrollToBottom(true); // Scroll to bottom when new notification arrives
//             // Optional: Play sound or show toast
//             // new Audio('/notification-sound.mp3').play();
//         };

//         // ✅ Listen for unread count updates
//         const handleUnreadCountUpdate = (data: { count: number }) => {
//             console.log('📊 Unread count updated:', data?.count);
//             queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
//         };

//         // Attach listeners
//         socket.on('new_notification', handleNewNotification);
//         socket.on('unread_count_update', handleUnreadCountUpdate);

//         // Cleanup on unmount
//         return () => {
//             socket.off('new_notification', handleNewNotification);
//             socket.off('unread_count_update', handleUnreadCountUpdate);
//         };
//     }, [queryClient]);


//     // ✅ INTERSECTION OBSERVER FOR LOADING MORE (AT TOP)
//     useEffect(() => {
//     const observer = new IntersectionObserver(
//         (entries) => {
//             if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//                 console.log('📜 Loading more notifications...');
//                 fetchNextPage();
//             }
//         },
//         { 
//             root: null,
//             rootMargin: '100px', // Start loading 100px before reaching the end
//             threshold: 0.1 
//         }
//     );

//     const currentElement = bottomRef.current;
//     if (currentElement) {
//         observer.observe(currentElement);
//     }

//     return () => {
//         if (currentElement) {
//             observer.unobserve(currentElement);
//         }
//     };
// }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


//     useEffect(() => {
//         const handleMarkAsReadHandler = async () => {
//             await markAllAsRead()
//         }
//         handleMarkAsReadHandler()
//     }, [data])

//     const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "https://houseofram.in"

//     // Flatten all pages of notifications
//     // const allNotifications = data?.pages?.flatMap(page => page.notifications) ?? [];
//     // const allNotifications = data?.pages?.flatMap(page => page?.notifications)?.reverse() ?? [];
//     const allNotifications = data?.pages
//     ?.flatMap(page => page?.notifications)
//     ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) 
//     ?? [];
//     // const unreadCount = allNotifications.filter((n) => !n.isRead).length

//     // useEffect(() => {
//     //     if (bottomRef.current && !isLoading) {
//     //         bottomRef.current.scrollIntoView({ behavior: "smooth" })
//     //         setShouldScrollToBottom(false);
//     //     }
//     // }, [allNotifications.length, isLoading])

//     // const handleMarkAsRead = async (notificationId: string) => {
//     //     try {
//     //         await markAsRead.mutateAsync({ notificationId });

//     //     } catch (error) {

//     //     }
//     // };

//     const handleDelete = async (notificationId: string) => {
//         try {
//             await deleteNotif.mutateAsync({ notificationId });
//         }
//         catch (error) {

//         }
//     };

//     if (isLoading) {
//         return (
//             <MaterialOverviewLoading />
//         )
//     }

//     if (isError) {
//         return (
//             <div className="w-full max-w-2xl mx-auto p-4">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
//                     <div className="flex items-center gap-2">
//                         <i className="fas fa-exclamation-circle"></i>
//                         <span>Error loading notifications: {error?.message || "Unknown error"}</span>
//                     </div>
//                 </div>
//             </div>
//         )
//     }


//     return (
//         <div className="w-full min-h-full max-h-full overflow-y-auto bg-white">
//             <div className="max-w-full mx-auto">
//                 <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
//                     <div className="px-4 md:px-6 py-4 flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div onClick={() => navigate(-1)} className="cursor-pointer w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                                 <i className="fas fa-arrow-left text-blue-600 text-lg"></i>
//                             </div>
//                             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                                 <i className="fas fa-bell text-blue-600 text-lg"></i>
//                             </div>
//                             <div>
//                                 <h1 className="text-xl md:text-2xl font-bold text-slate-900">Notifications

//                                     <Badge className='ml-2'>
//                                         <i className="fa-solid fa-flask mr-2"></i>
//                                         In Development</Badge>
//                                 </h1>

//                                 {/* <p className="text-xs text-slate-500 mt-0.5">
//                                     {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
//                                 </p> */}
//                             </div>
//                         </div>

//                         {/* <nav className="flex items-center gap-2">
//               <a
//                 href={frontendUrl}
//                 className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Go to home"
//               >
//                 <i className="fas fa-home"></i>
//               </a>
//               <a
//                 href={`${frontendUrl}/settings`}
//                 className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Settings"
//               >
//                 <i className="fas fa-cog"></i>
//               </a>
//             </nav> */}
//                     </div>
//                 </div>

//                 {
//                     allNotifications.length === 0 ?

//                         <div className="w-full max-w-2xl mx-auto p-4" >
//                             <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
//                                 <i className="fas fa-bell text-4xl text-slate-300 mb-3 block"></i>
//                                 <p className="text-slate-600 font-medium">No notifications yet</p>
//                                 <p className="text-slate-500 text-sm mt-1">You're all caught up! Check back later for updates.</p>
//                             </div>
//                         </div>
//                         : <div className="p-4 md:p-6">
//                             <div ref={containerRef} className="mb-0 flex justify-center">
//                                 {isFetchingNextPage && (
//                                     <div className="flex items-center gap-2 text-slate-600">
//                                         <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
//                                         <span className="text-xs font-medium">Loading earlier notifications...</span>
//                                     </div>
//                                 )}
//                                 {/* {!hasNextPage && allNotifications.length > 0 && (
//               <p className="text-slate-400 text-xs font-medium">You're at the beginning</p>
//             )} */}
//                             </div>

//                             <div className="space-y-3">
//                                 {allNotifications.map((notification) => (
//                                     <NotificationCard
//                                         key={notification._id}
//                                         notification={notification}
//                                         // onMarkAsRead={handleMarkAsRead}
//                                         onDelete={handleDelete}
//                                         deleteMutation={deleteNotif}
//                                         frontendUrl={frontendUrl}
//                                     />
//                                 ))}
//                             </div>

//                             <div ref={bottomRef} />
//                         </div>
//                         }
//             </div>
//         </div >
//     )
// }

// export default NotificationMain




//  next version


import { useEffect, useRef } from 'react'
import { useDeleteNotification, useInfiniteNotifications, useMarkAllNotificationsAsRead } from '../../apiList/Notificaiton Api/notificationApi';
import NotificationCard from './NotificationCard';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { socket } from '../../lib/socket';
import { queryClient } from '../../QueryClient/queryClient';
import { useNavigate } from 'react-router-dom';
// import { Badge } from '../../components/ui/Badge';
import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';

const NotificationMain = () => {
    const navigate = useNavigate()
    const currentUser = useCurrentSupervisor()

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
    const topObserverRef = useRef<HTMLDivElement>(null);
    const isFirstLoad = useRef(true);
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
            const wasAtBottom = container ? 
                (container.scrollHeight - container.scrollTop - container.clientHeight < 100) : false;
            
            queryClient.invalidateQueries({ queryKey: ["notifications", "infinite"] });
            
            // Auto-scroll to bottom if user was already at bottom
            if (wasAtBottom) {
                setTimeout(() => {
                    container?.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        };

        const handleUnreadCountUpdate = (data: { count: number }) => {
            console.log('📊 Unread count updated:', data?.count);
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
        ?.sort((a, b) => new Date(a.createdAt)?.getTime() - new Date(b.createdAt)?.getTime()) 
        ?? [];

    // ✅ Scroll to bottom on initial load
    useEffect(() => {
        if (isFirstLoad.current && allNotifications.length > 0 && !isLoading) {
            const container = containerRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
                isFirstLoad.current = false;
            }
        }
    }, [allNotifications.length, isLoading]);

    // ✅ INTERSECTION OBSERVER FOR LOADING MORE (AT TOP)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // Check if scrolled to top
            if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading older notifications...');
                
                // Save scroll position before fetching
                previousScrollHeight.current = container.scrollHeight;
                
                fetchNextPage().then(() => {
                    // Restore scroll position after new items are added
                    requestAnimationFrame(() => {
                        const newScrollHeight = container.scrollHeight;
                        const heightDifference = newScrollHeight - previousScrollHeight.current;
                        container.scrollTop = heightDifference;
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

    // const handleMarkAsRead = async (notificationId: string) => {
    //     try {
    //         await markAsRead.mutateAsync({ notificationId });

    //     } catch (error) {

    //     }
    // };

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
                                Notifications
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
                        <div ref={topObserverRef} className="flex justify-center py-2">
                            {isFetchingNextPage && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-medium">Loading earlier notifications...</span>
                                </div>
                            )}
                            {!hasNextPage && allNotifications.length > 0 && (
                                <p className="text-slate-400 text-xs font-medium">Beginning of notifications</p>
                            )}
                        </div>

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

                        {/* Small spacer at bottom for better UX */}
                        {/* <div className="h-4 " /> */}
                    </>
                )}
            </div>
        </div>
    )
}

export default NotificationMain