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
  
  const handleNotificationClick = () => {
    navigate(`/${organizationId}/notification`);
  };

  if (isExpanded) {
    // Expanded view (when sidebar is open)
    return (
      <div
        onClick={handleNotificationClick}
        className={`cursor-pointer w-full flex justify-between items-center max-w-[95%] py-4 px-4 ${isActive ? 'bg-[#3a3b45] rounded-xl text-white' : 'rounded-xl hover:bg-[#3a3b45]'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
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
        <i className={`fa-solid fa-bell ${isActive ? 'text-[#4a86f7]' : 'text-[#9ca3af]'}`}></i>
        <NotificationBadge size="small" />
      </div>
    </div>
  );
};

export default NotificationIcon;