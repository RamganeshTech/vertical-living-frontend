import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import MobileSidebar from "../../shared/MobileSidebar";
import {  LOGIN_ICONS_LOGIN_GROUP, LOGIN_LABELS } from "../../constants/constants";

// Define your paths as an object
const path = {
    ADMIN: `/login`, // Owner login
    CTO: `/login/cto`,
    STAFF: `/login/staff`,
    WORKER: `/login/worker`,
    CLIENT: `/login/client`
};


// Map labels & icons in same order
// const loginKeys = Object.keys(path) as Array<keyof typeof path>;
// const loginIcons = [
//     "fa-user-tie",
//     "fa-user-gear",
//     "fa-users-gear",
//     "fa-hard-hat",
//     "fa-user"
// ];

export default function LoginGroup() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
    
    const openMobileSidebar = ()=>{
        setIsMobileSidebarOpen(true)
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 470);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex w-full h-full">
            {isMobile ? (
                <MobileSidebar
                    labels={LOGIN_LABELS}
                    path={path}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />
            ) :  (
                    <Sidebar
                      path={path}
                      labels={LOGIN_LABELS}
                      icons={LOGIN_ICONS_LOGIN_GROUP}
                    />
                  )
                }

            <main className="flex-1 relative">
               
                <Outlet context={{isMobile, openMobileSidebar}} />
            </main>
        </div>
    );
}
