import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import MobileSidebar from "../../shared/MobileSidebar";
import { LOGIN_ICONS_LOGIN_GROUP, LOGIN_LABELS } from "../../constants/constants";
import { LOCAL_KEY } from "../Stage Pages/Ordering Materials/Public OrderMaterial Page/PublicOrgOrderMaterialSetup";

// Define your paths as an object
const path = {
    ADMIN: `/login`, // Owner login
    CTO: `/login/cto`,
    STAFF: `/login/staff`,
    WORKER: `/login/worker`,
    CLIENT: `/login/client`,
    PUBLICORDERS: `/ordermaterial/setup`,
};


export default function LoginGroup() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 470);

    const openMobileSidebar = () => {
        setIsMobileSidebarOpen(true)
    }


      
    const orgId = localStorage.getItem(LOCAL_KEY)

    if (orgId) {
        path.PUBLICORDERS = `/${JSON.parse(orgId)}/ordermaterial`
    }



    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 470);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // console.log("shallow paths", currentPath)
    // console.log("orgId", orgId)

    return (
        <div className="flex w-full h-full">
            {isMobile ? (
                <MobileSidebar
                    labels={LOGIN_LABELS}
                    path={path}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />
            ) : (
                <Sidebar
                    path={path}
                    labels={LOGIN_LABELS}
                    icons={LOGIN_ICONS_LOGIN_GROUP}
                />
            )
            }

            <main className="flex-1 relative">

                <Outlet context={{ isMobile, openMobileSidebar }} />
            </main>
        </div>
    );
}
