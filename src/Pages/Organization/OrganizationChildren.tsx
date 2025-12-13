// import React, { useEffect, useState } from 'react'
// import { ORGANIZATION_ICONS, ORGANIZATION_LABELS } from '../../constants/constants'
// import Sidebar from '../../shared/Sidebar'
// import { Outlet, useParams } from 'react-router-dom'
// import MobileSidebar from '../../shared/MobileSidebar'
// import { useAuthCheck } from '../../Hooks/useAuthCheck'



// export type OrganizationOutletTypeProps = {
//     isMobile: boolean,
//     isMobileSidebarOpen: boolean;
//     openMobileSidebar: () => void;
//     closeMobileSidebar: () => void;
// }


// interface OrganizationChildrenProps {
//     setOrganizationId: React.Dispatch<React.SetStateAction<string | null>>;
// }


// const OrganizationChildrens: React.FC<OrganizationChildrenProps> = ({ setOrganizationId }) => {

//     const { organizationId } = useParams<{ organizationId: string }>()
//     const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
//     const { role } = useAuthCheck();


//     const path:Record<string, string> = {
//         PROJECTS: `/organizations/${organizationId}/projects`,
//         DETAILS: `/organizations/${organizationId}`,
//         INVITECTO: `/organizations/${organizationId}/invitecto`,
//         INVITESTAFFS: `/organizations/${organizationId}/invitestaff`,
//         ROLESPERMISSIONS: `/organizations/${organizationId}/dashboard`,
//         PLAN: `/organizations/${organizationId}/subscriptionplan`,
//         PROFILE: `/organizations/${organizationId}/userprofile`,
//         MODULAR: `/organizations/${organizationId}/modularunits`,
//         // EXTERNAL: `/organizations/${organizationId}/externalunits`,
//     }


//     let sidebarLabels = { ...ORGANIZATION_LABELS }
//     let sidebarIcons = { ...ORGANIZATION_ICONS }
//     let sidebarPath = { ...path }


//     //   // Remove both first
//     delete sidebarLabels.ROLESPERMISSIONS;
//     delete sidebarIcons.ROLESPERMISSIONS



//     if (role?.toLowerCase() === "owner") {
//         sidebarLabels.ROLESPERMISSIONS = ORGANIZATION_LABELS.ROLESPERMISSIONS
//         sidebarIcons.ROLESPERMISSIONS = ORGANIZATION_ICONS.ROLESPERMISSIONS
//         sidebarPath.ROLESPERMISSIONS = path.ROLESPERMISSIONS
//     }

//     // if(role?.toLowerCase() === "client" || )

//     if (role?.toLowerCase() === "client" || role?.toLowerCase() === "worker") {

//     // These should NOT be visible for client/worker
//     const restrictedKeys = [
//         "INVITECTO",
//         "INVITESTAFFS",
//         "PLAN",
//         "MODULAR",
//         "ROLESPERMISSIONS" // client/worker should not see this
//     ];

//     restrictedKeys.forEach((key) => {
//         delete sidebarLabels[key];
//         delete sidebarIcons[key];
//         delete sidebarPath[key];
//     });
// }

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 470);
//         };

//         window.addEventListener('resize', handleResize);

//         if (organizationId) {
//             setOrganizationId(organizationId)
//         }
//         // Cleanup
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     return (
//         <div className="flex w-full h-full">
//             {/* <Sidebar path={path} labels={ORGANIZATION_LABELS} icons={ORGANIZATION_ICONS} /> */}

//             {isMobile ? (
//                 <MobileSidebar
//                     labels={sidebarLabels}
//                     path={path}
//                     isOpen={isMobileSidebarOpen}
//                     onClose={() => setIsMobileSidebarOpen(false)}
//                 />
//             ) : (
//                 <Sidebar
//                     path={path}
//                     labels={sidebarLabels}
//                     icons={sidebarIcons}
//                 />
//             )}
//             <main className="!w-[100%] h-full">
//                 <Outlet context={{
//                     isMobile,
//                     isMobileSidebarOpen,
//                     openMobileSidebar: () => setIsMobileSidebarOpen(true),
//                     closeMobileSidebar: () => setIsMobileSidebarOpen(false),
//                 }} />
//             </main>
//         </div>
//     )
// }

// export default OrganizationChildrens





import React, { useEffect, useState } from 'react'
import { ORGANIZATION_ICONS, ORGANIZATION_LABELS } from '../../constants/constants'
import Sidebar from '../../shared/Sidebar'
import { Outlet, useParams } from 'react-router-dom'
import MobileSidebar from '../../shared/MobileSidebar'
import { useAuthCheck } from '../../Hooks/useAuthCheck'

// 1. ⭐ MAPPING: Sidebar Keys -> Backend Permission Keys
// (Ensure these keys exist in your DB permissions)
const PERMISSION_MAPPING: Record<string, string> = {
    INVITECTO: "invitecto",
    INVITESTAFFS: "invitestaff",
    MODULAR: "modularunit",
    // PLAN is owner only, so no mapping needed
    // PROJECTS, DETAILS, PROFILE are open to all
};

export type OrganizationOutletTypeProps = {
    isMobile: boolean,
    isMobileSidebarOpen: boolean;
    openMobileSidebar: () => void;
    closeMobileSidebar: () => void;
}

interface OrganizationChildrenProps {
    setOrganizationId: React.Dispatch<React.SetStateAction<string | null>>;
}

const OrganizationChildrens: React.FC<OrganizationChildrenProps> = ({ setOrganizationId }) => {

    const { organizationId } = useParams<{ organizationId: string }>()
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
    
    // Get Auth Info
    const { role, permission } = useAuthCheck();
    const lowerRole = role?.toLowerCase() || "";

    const path: Record<string, string> = {
        PROJECTS: `/organizations/${organizationId}/projects`,
        DETAILS: `/organizations/${organizationId}`, // Organization Dashboard
        INVITECTO: `/organizations/${organizationId}/invitecto`,
        INVITESTAFFS: `/organizations/${organizationId}/invitestaff`,
        ROLESPERMISSIONS: `/organizations/${organizationId}/dashboard`,
        PLAN: `/organizations/${organizationId}/subscriptionplan`,
        PROFILE: `/organizations/${organizationId}/userprofile`,
        MODULAR: `/organizations/${organizationId}/modularunits`,
    }

    // =========================================================
    // 2. ROLE-BASED WHITELIST
    // =========================================================

    const allKeys = Object.keys(ORGANIZATION_LABELS);
    let allowedKeys: string[] = [];

    if (lowerRole === "owner") {
        // Owner sees everything
        allowedKeys = allKeys;
    } 
    else if (lowerRole === "cto" || lowerRole === "staff") {
        // Staff/CTO see everything EXCEPT 'ROLESPERMISSIONS' and 'PLAN'
        // (Unless you want CTO to see Plan, add it back)
        allowedKeys = allKeys.filter(key => 
            key !== "ROLESPERMISSIONS" && 
            key !== "PLAN"
        );
    } 
    else {
        // Worker/Client: Strictly limited
        // allowedKeys = [
        //     "PROJECTS", 
        //     "DETAILS", 
        //     "PROFILE"
        // ];
         allowedKeys = allKeys.filter(key => 
            key !== "ROLESPERMISSIONS" && 
            key !== "PLAN"
        );
    }

    // =========================================================
    // 3. CONSTRUCT INITIAL OBJECTS
    // =========================================================
    
    let sidebarLabels: any = {};
    let sidebarIcons: any = {};
    let sidebarPath: any = {};
  
    allowedKeys.forEach(key => {
        if (ORGANIZATION_LABELS[key] && path[key]) {
            sidebarLabels[key] = ORGANIZATION_LABELS[key];
            sidebarIcons[key] = ORGANIZATION_ICONS[key];
            sidebarPath[key] = path[key];
        }
    });

    // =========================================================
    // 4. ⭐ PERMISSION-BASED HIDING (For Staff/CTO) ⭐
    // =========================================================

    if (lowerRole !== "owner") {
        
        Object.keys(sidebarLabels).forEach((sidebarKey) => {
            
            const backendKey = PERMISSION_MAPPING[sidebarKey];

            if (backendKey) {
                const deptPermissions = permission?.[backendKey];

                // Check for ANY 'true' permission (list, create, etc)
                const hasAccess = deptPermissions && Object.values(deptPermissions).some(val => val === true);

                if (!hasAccess) {
                    delete sidebarLabels[sidebarKey];
                    delete sidebarIcons[sidebarKey];
                    delete sidebarPath[sidebarKey];
                }
            }
        });
    }

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 470);
        window.addEventListener('resize', handleResize);
        if (organizationId) setOrganizationId(organizationId);
        return () => window.removeEventListener('resize', handleResize);
    }, [organizationId, setOrganizationId]);

    return (
        <div className="flex w-full h-full">
            {isMobile ? (
                <MobileSidebar
                    labels={sidebarLabels}
                    path={sidebarPath}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />
            ) : (
                <Sidebar
                    path={sidebarPath}
                    labels={sidebarLabels}
                    icons={sidebarIcons}
                />
            )}
            <main className="!w-[100%] h-full">
                <Outlet context={{
                    isMobile,
                    isMobileSidebarOpen,
                    openMobileSidebar: () => setIsMobileSidebarOpen(true),
                    closeMobileSidebar: () => setIsMobileSidebarOpen(false),
                }} />
            </main>
        </div>
    )
}

export default OrganizationChildrens