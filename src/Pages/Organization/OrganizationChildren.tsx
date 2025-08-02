import React, { useEffect, useState } from 'react'
import { ORGANIZATION_ICONS, ORGANIZATION_LABELS } from '../../constants/constants'
import Sidebar from '../../shared/Sidebar'
import { Outlet, useParams } from 'react-router-dom'
import MobileSidebar from '../../shared/MobileSidebar'



export type OrganizationOutletTypeProps = {
    isMobile: boolean,
    isMobileSidebarOpen: boolean;
    openMobileSidebar: () => void;
    closeMobileSidebar: () => void;
}

const OrganizationChildrens: React.FC = () => {

    const { organizationId } = useParams<{ organizationId: string }>()
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 470);


    const path = {
        PROJECTS: `/organizations/${organizationId}/projects`,
        DETAILS: `/organizations/${organizationId}`,
        INVITECTO: `/organizations/${organizationId}/invitecto`,
        INVITESTAFFS: `/organizations/${organizationId}/invitestaff`,
        PLAN: `/organizations/${organizationId}/subscriptionplan`,
        PROFILE: `/organizations/${organizationId}/userprofile`,
        MODULAR: `/organizations/${organizationId}/modularunits`,
        EXTERNAL: `/organizations/${organizationId}/externalunits`,
    }


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 470);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex w-full h-full">
            {/* <Sidebar path={path} labels={ORGANIZATION_LABELS} icons={ORGANIZATION_ICONS} /> */}

            {isMobile ? (
                <MobileSidebar
                    labels={ORGANIZATION_LABELS}
                    path={path}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />
            ) : (
                <Sidebar
                    path={path}
                    labels={ORGANIZATION_LABELS}
                    icons={ORGANIZATION_ICONS}
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