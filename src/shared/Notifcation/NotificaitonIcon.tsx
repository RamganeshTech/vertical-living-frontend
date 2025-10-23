// components/NotificationIcon.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useGetUnreadCount } from '../../apiList/Notificaiton Api/notificationApi';
// import { queryClient } from '../../QueryClient/queryClient';
// import { useCurrentSupervisor } from '../../Hooks/useCurrentSupervisor';
// import { socket } from '../../lib/socket';
import { NotificationBadge } from './NotificationBadge';

interface NotificationIconProps {
  isExpanded?: boolean;
  isActive?: boolean;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  isExpanded = false,
  isActive = false
}) => {
  const navigate = useNavigate();
  const { organizationId } = useParams();
  // const { data: unreadCount, isLoading } = useGetUnreadCount();
  //   const currentUser = useCurrentSupervisor()


  // ✅ SOCKET.IO REAL-TIME NOTIFICATIONS
  // useEffect(() => {
  //     // Get user ID from your auth (adjust based on your setup)
  //     const userId = currentUser?.id // or from context/zustand


  //     if (!userId) return;

  //     // Join notification room
  //     socket.emit('join_notifications', { userId });

  //     // ✅ Listen for new notifications
  //     const handlegetUnreadCount = () => {
  //         console.log('calling 📊 Unread count updated:',);
  //         // Refetch notifications
  //         queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });

  //     };

  //     socket.on('unread_count_update', handlegetUnreadCount);

  //     // Cleanup on unmount
  //     return () => {
  //         socket.off('unread_count_update', handlegetUnreadCount);
  //     };
  // }, [queryClient]);




  const handleNotificationClick = () => {
    // Navigate to the notification page with proper path

    navigate(`/${organizationId}/notification`);
  };

  //   const showBadge = !isLoading && unreadCount && unreadCount > 0;
  // Fixed condition - explicitly check for number greater than 0
  // const showBadge = !isLoading && typeof unreadCount === 'number' && unreadCount > 0;


  if (isExpanded) {
    // Expanded view (when sidebar is open)
    return (
      <div
        onClick={handleNotificationClick}
        className={`cursor-pointer flex justify-between items-center max-w-[95%] py-4 px-4 ${isActive ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* <i className={`fa-solid fa-bell text-lg ${isActive ? 'text-[#4a86f7]' : 'text-[#9ca3af]'}`}></i> */}
            {/* {showBadge && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount  > 99 ? '99+' : unreadCount}
              </span>
            )} */}
            <i className={`fa-solid fa-bell text-lg ${isActive ? 'text-[#4a86f7]' : 'text-[#9ca3af]'}`}></i>
            <NotificationBadge size="large" />

          </div>
          <span className='text-lg'>Notifications</span>
        </div>
        <span><i className="fa-solid fa-chevron-right"></i></span>
      </div>
    );
  }

  // Collapsed view (when sidebar is closed)
  return (
    <div
      onClick={handleNotificationClick}
      className={`cursor-pointer flex justify-center items-center py-4 px-4 ${isActive ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
        }`}
    >
      <div className="relative">
        {/* <i className={`fa-solid fa-bell ${isActive ? 'text-[#4a86f7]' : 'text-[#9ca3af]'}`}></i> */}
        {/* {showBadge && (
          <span className="absolute  -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )} */}
        <i className={`fa-solid fa-bell ${isActive ? 'text-[#4a86f7]' : 'text-[#9ca3af]'}`}></i>
        <NotificationBadge size="small" />
      </div>
    </div>
  );
};

export default NotificationIcon;