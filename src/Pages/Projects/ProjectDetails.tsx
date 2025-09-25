import React, { useEffect, useLayoutEffect, useState } from 'react'

import { PROJECTS_ICONS, PROJECTS_LABELS, } from "../../constants/constants";

import Sidebar from '../../shared/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import MobileSidebar from '../../shared/MobileSidebar';


type ProjectType = {
  projectId: string | null,
  organizationId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
  setOrganizationId: React.Dispatch<React.SetStateAction<string | null>>
}

const ProjectDetails: React.FC<ProjectType> = ({ projectId, setProjectId, organizationId, setOrganizationId }) => {

  const location = useLocation()

  // ProjectDetails.tsx (your layout)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
  const [projectName, setProjectName] = useState<string>("Vertical Living");


  useLayoutEffect(() => {
    const pathname = location.pathname.split('/')
    setProjectId(pathname[3])
    setOrganizationId(pathname[1])
  }, [location.pathname])

  // useEffect(() => {
  //   if (!isLoading && currentStagePath) {
  //     // Automatically navigate to the pending stage
  //     navigate(`${currentStagePath}`);
  //   }
  // }, [currentStagePath, isLoading]);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 470);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const path = {
    // LABOURS: projectId ? `/${organizationId}/projectdetails/${projectId}/labourlist` : "",
    // MATERIALS: projectId ? `/${organizationId}/projectdetails/${projectId}/materiallist` : "",
    // TRANSPORTATION: projectId ? `/${organizationId}/projectdetails/${projectId}/transportationlist` : "",
    // DOCUMENTATION: projectId ? `/${organizationId}/projectdetails/${projectId}/document` : "",
    INVENTORY: projectId ? `/${organizationId}/projectdetails/${projectId}/inventory` : "",
    WORKERS: projectId ? `/${organizationId}/projectdetails/${projectId}/workers` : "",
    INVITECLIENT: projectId ? `/${organizationId}/projectdetails/${projectId}/inviteclient` : "",
    PREREQUISTIES: projectId ? `/${organizationId}/projectdetails/${projectId}/prerequisites` : "",
    REQUIREMENTFORM: projectId ? `/${organizationId}/projectdetails/${projectId}/requirementform` : "",
    SITEMEASUREMENT: projectId ? `/${organizationId}/projectdetails/${projectId}/sitemeasurement` : "",
    SAMPLEDESIGN: projectId ? `/${organizationId}/projectdetails/${projectId}/sampledesign` : "",
    WORKSCHEDULE: projectId ? `/${organizationId}/projectdetails/${projectId}/workmainschedule` : "",
    TECHNICALCONSULTANT: projectId ? `/${organizationId}/projectdetails/${projectId}/technicalconsultant` : "",
    // SELECTSTAGE: projectId ? `/${organizationId}/projectdetails/${projectId}/selectstage` : "",
    // EXTERNAL: projectId ? `/${organizationId}/projectdetails/${projectId}/externalunits` : "",
    // MODULARUNIT: projectId ? `/${organizationId}/projectdetails/${projectId}/modularunits` : "",
    // MATERIALSELECTION: projectId ? `/${organizationId}/projectdetails/${projectId}/materialselection` : "",
    // COSTESTIMATION: projectId ? `/${organizationId}/projectdetails/${projectId}/costestimation` : "",
    PAYMENTCONFIRMATION: projectId ? `/${organizationId}/projectdetails/${projectId}/paymentconfirmation` : "",
    QUOTEPDF: projectId ? `/${organizationId}/projectdetails/${projectId}/quotepdf` : "",
    ORDERMATERIALS: projectId ? `/${organizationId}/projectdetails/${projectId}/ordermaterial` : "",
    MATERIALARRIVED: projectId ? `/${organizationId}/projectdetails/${projectId}/materialarrival` : "",
    INSTALLATION: projectId ? `/${organizationId}/projectdetails/${projectId}/installation` : "",
    QUALITYCHECK: projectId ? `/${organizationId}/projectdetails/${projectId}/qualitycheck` : "",
    CLEANINGSANITATION: projectId ? `/${organizationId}/projectdetails/${projectId}/cleaning` : "",
    PROJECTDELIVERY: projectId ? `/${organizationId}/projectdetails/${projectId}/projectdelivery` : "",
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        {/* <Sidebar path={path} labels={PROJECTS_LABELS} icons={PROJECTS_ICONS} /> */}

        {isMobile ? (
          <MobileSidebar
            labels={PROJECTS_LABELS}
            path={path}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        ) : (
          <Sidebar
            path={path}
            labels={PROJECTS_LABELS}
            icons={PROJECTS_ICONS}
            setProjectName={setProjectName}
            projectName={projectName}
          />
        )}

        <main className="!w-[100%] h-full p-2 sm:p-4">
          <Outlet context={{
            projectId, setProjectId,
            isMobile,
            isMobileSidebarOpen,
            openMobileSidebar: () => setIsMobileSidebarOpen(true),
            closeMobileSidebar: () => setIsMobileSidebarOpen(false),
            setProjectName,
            projectName
          }} />
        </main>
      </div>
    </>
  )
}

export default ProjectDetails