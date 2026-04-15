import React, { useMemo } from 'react';
// import { useAuthCheck } from '../Hooks/useAuthCheck';
import TicketOperationIcon from './Ticket Operation Icon/TicketOperationIcon';
import NotificationIcon from './Notifcation/NotificaitonIcon';
import { useCurrentSupervisor } from '../Hooks/useCurrentSupervisor';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
// import { useAuthCheck } from '../../Hooks/useAuthCheck'; // Adjust path
// Import your custom icons here:
// import NotificationIcon from '../../shared/NotificationIcon'; // Adjust path
// import TicketOperationIcon from '../../shared/TicketOperationIcon'; // Adjust path

interface HeaderSidebarProps {
    isMobile: boolean;
    openMobileSidebar: () => void;
    showNotifications?: boolean;
    showTickets?: boolean;
    children?: React.ReactNode;
}

const HeaderSidebar: React.FC<HeaderSidebarProps> = ({
    isMobile,
    openMobileSidebar,
    showNotifications = true, // Defaulting to true, but you can pass false from parent
    showTickets = true,
    children
}) => {
    // const { role } = useAuthCheck(); 
    const currentUser = useCurrentSupervisor()
    const navigate = useNavigate()

    const { organizationId } = useParams();
    // If your hook returns the user's name/email, you can extract it here
    // const { role, user } = useAuthCheck(); 


    // Inside HeaderSidebar component
    const { role } = useSelector((state: RootState) => state.authStore);

    // 1. Grab all profile stores
    const userProfile = useSelector((state: RootState) => state.userProfileStore);
    const staffProfile = useSelector((state: RootState) => state.staffProfileStore);
    const ctoProfile = useSelector((state: RootState) => state.CTOProfileStore);
    const clientProfile = useSelector((state: RootState) => state.clientProfileStore);
    const workerProfile = useSelector((state: RootState) => state.workerProfileStore);

    // 2. Memoize the active profile and display data
    const activeProfile = useMemo(() => {
        switch (role) {
            case "owner": return userProfile;
            case "staff": return staffProfile;
            case "CTO": return ctoProfile;
            case "client": return clientProfile;
            case "worker": return workerProfile;
            default: return null;
        }
    }, [role, userProfile, staffProfile, ctoProfile, clientProfile, workerProfile]);

    // 3. Helper to get the correct name field for the fallback letter
    const getDisplayName = () => {
        // if (!activeProfile) return "U";
        // if ("userName" in activeProfile) return activeProfile.userName;
        // if ("staffName" in activeProfile) return activeProfile.staffName;
        // if ("CTOName" in activeProfile) return activeProfile.CTOName;
        // if ("clientName" in activeProfile) return activeProfile.clientName;
        // if ("workerName" in activeProfile) return activeProfile.workerName;
        // return "U";
        if (!activeProfile) return "U";

        // TypeScript uses these 'in' checks to narrow the type
        if ("userName" in activeProfile && activeProfile.userName) {
            return activeProfile.userName;
        }
        if ("staffName" in activeProfile && activeProfile.staffName) {
            return activeProfile.staffName;
        }
        if ("CTOName" in activeProfile && activeProfile.CTOName) {
            return activeProfile.CTOName;
        }
        if ("clientName" in activeProfile && activeProfile.clientName) {
            return activeProfile.clientName;
        }
        if ("workerName" in activeProfile && activeProfile.workerName) {
            return activeProfile.workerName;
        }

        // Return the name found, or "U" if all were undefined/empty string
        return "U";
    };

    const profilePicUrl = activeProfile?.profileImage; // This will be the string URL from Redux
    const firstLetter = getDisplayName()?.charAt(0)?.toUpperCase();

    return (
        <header className="bg-white border-b border-gray-200 h-10 flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0 w-full">

            {/* LEFT SIDE: Mobile Menu Toggle & Search */}
            <div className="flex items-center">
                {isMobile && (
                    <button
                        onClick={openMobileSidebar}
                        className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                )}

                {/* Global Search Placeholder (Optional) */}

            </div>

            {/* MIDDLE: Page Specific Content (Optional) */}
            <div className="flex-1 flex justify-center">
                {children}
            </div>

            {/* RIGHT SIDE: Tickets, Notifications & User Profile */}
            <div className="flex items-center gap-1">

                {/* 1. Ticket Operations System */}
                {showTickets && (
                    <div className="text-gray-400 hover:text-gray-700 transition-colors flex items-center cursor-pointer">
                        <TicketOperationIcon
                            isExpanded={false}
                            isActive={false}
                        />
                    </div>
                )}

                {/* 2. Notification System */}
                {showNotifications && (
                    <div className="text-gray-400 hover:text-gray-700 transition-colors flex items-center cursor-pointer">
                        <NotificationIcon
                            isExpanded={false}
                            isActive={false}
                        />
                    </div>
                )}

                {/* Subtle Divider Line */}
                <div className="w-px h-4 bg-gray-200 hidden sm:block mx-1"></div>

                {/* 3. Minimalist User Profile */}
                {/* <div onClick={() => navigate(`/organizations/${organizationId}/userprofile`)} className="flex cursor-pointer items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                </div> */}

                {/* 3. Minimalist User Profile */}
                <div
                    onClick={() => navigate(`/organizations/${organizationId}/userprofile`)}
                    className="flex cursor-pointer items-center gap-2"
                >
                    {/* Profile Pic Circle */}
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100 overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                        {profilePicUrl ? (
                            <img
                                title={currentUser?.name}
                                src={profilePicUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                // Fallback if image fails to load
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <span>{firstLetter}</span>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
};

export default HeaderSidebar;