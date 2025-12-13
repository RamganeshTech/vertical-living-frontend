import React, { useEffect, useLayoutEffect, useState } from 'react'

import { PROJECTS_ICONS, PROJECTS_LABELS, } from "../../constants/constants";

import Sidebar from '../../shared/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import MobileSidebar from '../../shared/MobileSidebar';
import { useAuthCheck } from '../../Hooks/useAuthCheck';


type ProjectType = {
  projectId: string | null,
  organizationId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
  setOrganizationId: React.Dispatch<React.SetStateAction<string | null>>
}

// These values MUST match the 'PROJECT_STAGES' array in StaffPermissionsSingle.tsx
const PERMISSION_MAPPING: Record<string, string> = {
  INVENTORY: "inventory",
  WORKERS: "inviteworker",         // Changed from 'projectworkers' to match Admin
  INVITECLIENT: "inviteclient",
  PREREQUISTIES: "prerequisites",
  REQUIREMENTFORM: "clientrequirement", // Changed from 'requirementform' to match Admin
  SITEMEASUREMENT: "sitemeasurement",
  SAMPLEDESIGN: "sampledesign",
  WORKSCHEDULE: "workschedule",
  TECHNICALCONSULTANT: "technicalconsultant",
  PAYMENTCONFIRMATION: "paymentconfirmation",
  MODULARUNIT: "modularunit",
  ORDERMATERIALS: "ordermaterial",
  MATERIALARRIVED: "materialarrival",
  INSTALLATION: "installation",
  QUALITYCHECK: "qualitycheck",
  CLEANINGSANITATION: "cleaning",
  PROJECTDELIVERY: "projectdelivery"
};
const ProjectDetails: React.FC<ProjectType> = ({ projectId, setProjectId, organizationId, setOrganizationId }) => {

  const location = useLocation()
  const { role, permission } = useAuthCheck();
  const lowerRole = role?.toLowerCase() || "";

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

  const path: Record<string, string> = {
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
    MODULARUNIT: projectId ? `/${organizationId}/projectdetails/${projectId}/modularunitsnew` : "",
    ORDERMATERIALS: projectId ? `/${organizationId}/projectdetails/${projectId}/ordermaterial` : "",
    MATERIALARRIVED: projectId ? `/${organizationId}/projectdetails/${projectId}/materialarrival` : "",
    INSTALLATION: projectId ? `/${organizationId}/projectdetails/${projectId}/installation` : "",
    QUALITYCHECK: projectId ? `/${organizationId}/projectdetails/${projectId}/qualitycheck` : "",
    CLEANINGSANITATION: projectId ? `/${organizationId}/projectdetails/${projectId}/cleaning` : "",
    PROJECTDELIVERY: projectId ? `/${organizationId}/projectdetails/${projectId}/projectdelivery` : "",
  };

  //   // =========================================================
  //   // 4. CONSTRUCT INITIAL OBJECTS
  //   // =========================================================


  const allKeys = Object.keys(PROJECTS_LABELS);
  let allowedKeys: string[] = [];

  // if (lowerRole === "client") {
  //   // Client Whitelist
  //   allowedKeys = [
  //     "REQUIREMENTFORM",
  //     "SITEMEASUREMENT",
  //     "PAYMENTCONFIRMATION",
  //     "PROJECTDELIVERY"
  //   ];
  // }
  // else if (lowerRole === "worker") {
  //   // Worker Whitelist
  //   allowedKeys = [
  //     "WORKSCHEDULE",
  //     "TECHNICALCONSULTANT",
  //     "ORDERMATERIALS",
  //     "MATERIALARRIVED",
  //     "INSTALLATION",
  //     "QUALITYCHECK",
  //     "CLEANINGSANITATION",
  //   ];
  // }
  // else {
  //   // Owner, CTO, Staff start with everything
  //   // (We will filter Staff by permissions in the next step)
  //   allowedKeys = allKeys;
  // }

  allowedKeys = allKeys
  
  let sidebarLabels: any = {};
  let sidebarIcons: any = {};
  let sidebarPath: any = {};

  allowedKeys.forEach(key => {
    // Safety check if key exists in constants
    if (PROJECTS_LABELS[key] && path[key]) {
      sidebarLabels[key] = PROJECTS_LABELS[key];
      sidebarIcons[key] = PROJECTS_ICONS[key];
      sidebarPath[key] = path[key];
    }
  });

  // =========================================================
  // 5. ⭐ PERMISSION-BASED HIDING (The Database Check) ⭐
  // =========================================================

  // If NOT owner, remove items if they lack DB permissions
  if (lowerRole !== "owner") {

    Object.keys(sidebarLabels).forEach((sidebarKey) => {

      const backendKey = PERMISSION_MAPPING[sidebarKey];

      if (backendKey) {
        const deptPermissions = permission?.[backendKey];

        // Check if user has AT LEAST ONE permission set to true
        const hasAccess = deptPermissions && Object.values(deptPermissions).some(val => val === true);

        // If no access, hard delete from the sidebar
        if (!hasAccess) {
          delete sidebarLabels[sidebarKey];
          delete sidebarIcons[sidebarKey];
          delete sidebarPath[sidebarKey];
        }
      }
    });
  }

  //  START OF OLD VERION
  // let sidebarLabels = { ...PROJECTS_LABELS };
  // let sidebarIcons = { ...PROJECTS_ICONS };
  // let sidebarPath = { ...path };


  // if (role?.toLowerCase() === "client") {
  //   const allowedKeys = [
  //     "REQUIREMENTFORM",
  //     "SITEMEASUREMENT",
  //     "PAYMENTCONFIRMATION",
  //     "PROJECTDELIVERY"
  //   ];

  //   Object.keys(sidebarLabels).forEach((key) => {
  //     if (!allowedKeys.includes(key)) {
  //       delete sidebarLabels[key];
  //       delete sidebarIcons[key];
  //       delete sidebarPath[key];
  //     }
  //   });
  // }


  // if (role?.toLowerCase() === "worker") {
  //   const allowedKeys = [
  //     "WORKSCHEDULE",
  //     "TECHNICALCONSULTANT",
  //     "ORDERMATERIALS",
  //     "MATERIALARRIVED",
  //     "INSTALLATION",
  //     "QUALITYCHECK",
  //     "CLEANINGSANITATION",
  //   ];

  //   Object.keys(sidebarLabels).forEach((key) => {
  //     if (!allowedKeys.includes(key)) {
  //       delete sidebarLabels[key];
  //       delete sidebarIcons[key];
  //       delete sidebarPath[key];
  //     }
  //   });
  // }

  // =========================================================
  // 4. CONSTRUCT INITIAL OBJECTS
  // =========================================================




  return (
    <>
      <div className="flex w-screen h-screen">
        {/* <Sidebar path={path} labels={PROJECTS_LABELS} icons={PROJECTS_ICONS} /> */}

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