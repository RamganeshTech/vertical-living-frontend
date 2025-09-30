import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import { SIDEBAR_ICONS, SIDEBAR_LABELS } from "../../constants/constants";
import MobileSidebar from "../../shared/MobileSidebar";
import { useEffect, useState } from "react";
import useGetRole from "../../Hooks/useGetRole";

type ProjectType = {
  projectId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
}

const Projects: React.FC<ProjectType> = ({ projectId, setProjectId }) => {

  const { organizationId } = useParams()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
  const {role}= useGetRole()

  const path:Record<string, string> = {
    PROJECTS: `/organizations/${organizationId}/projects`,
    ORGANIZATION: `/organizations/${organizationId}/invitecto`,
    SHORTLIST: `/organizations/${organizationId}/projects/shortlistdesign`,
    COMMONORDER: `/organizations/${organizationId}/projects/commonorder`,
    HR: `/organizations/${organizationId}/projects/hr`,
    LOGISTICS: `/organizations/${organizationId}/projects/logistics`,
    PROCUREMENT: `/organizations/${organizationId}/projects/procurement`,
    ACCOUNTING: `/organizations/${organizationId}/projects/accounting`,
    RATECONIG: `/organizations/${organizationId}/projects/rateconfig`,
    RATECONIGSTAFF: `/organizations/${organizationId}/projects/labourrateconfig`,
    INTERNALQUOTE: `/organizations/${organizationId}/projects/internalquote`,
    QUOTEVARIENT: `/organizations/${organizationId}/projects/quotevariant`,
    "QUOTES (CLIENT)": `/organizations/${organizationId}/projects/clientquotes`,
    STAFFTASK: `/organizations/${organizationId}/projects/stafftask`,
    SINGLESTAFFTASK: `/organizations/${organizationId}/projects/associatedstafftask`,
    // PROCUREMENT: `/organizations/${organizationId}/procurement`
    // ISSUES: "/issues",
    // COLLABORATION: "/collaboration",
    // TASKS: "/tasks",
    // PHASES: "/phases",
  }


  
// Clone originals so you don’t mutate the constants
let sidebarLabels = { ...SIDEBAR_LABELS }
let sidebarIcons = { ...SIDEBAR_ICONS }
let sidebarPath = { ...path }

// Remove both first
delete sidebarLabels.STAFFTASK;
delete sidebarIcons.STAFFTASK
delete sidebarPath.STAFFTASK

delete sidebarLabels.SINGLESTAFFTASK
delete sidebarIcons.SINGLESTAFFTASK
delete sidebarPath.SINGLESTAFFTASK

// Now add only the correct one based on role
if (role?.toLowerCase() === "owner" || role?.toLowerCase() === "cto") {
  sidebarLabels.STAFFTASK = SIDEBAR_LABELS.STAFFTASK
  sidebarIcons.STAFFTASK = SIDEBAR_ICONS.STAFFTASK
  sidebarPath.STAFFTASK = path.STAFFTASK
} else if (role?.toLowerCase() === "staff") {
  sidebarLabels.SINGLESTAFFTASK = SIDEBAR_LABELS.SINGLESTAFFTASK
  sidebarIcons.SINGLESTAFFTASK = SIDEBAR_ICONS.SINGLESTAFFTASK
  sidebarPath.SINGLESTAFFTASK = path.SINGLESTAFFTASK
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
    <>
      <div className="flex w-full h-full">
        {/* <Sidebar path={path} labels={SIDEBAR_LABELS} icons={SIDEBAR_ICONS} /> */}

        {isMobile ? (
          <MobileSidebar
            labels={SIDEBAR_LABELS}
            path={path}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        ) : (
          // <Sidebar
          //   path={path}
          //   labels={SIDEBAR_LABELS}
          //   icons={SIDEBAR_ICONS}
          // />

           <Sidebar
            path={sidebarPath}
            labels={sidebarLabels}
            icons={sidebarIcons}
          />
        )}

        <main className="!w-[100%] h-full p-4">
          <Outlet context={{ projectId, setProjectId, organizationId , 
          isMobile,
                    isMobileSidebarOpen,
                    openMobileSidebar: () => setIsMobileSidebarOpen(true),
                    closeMobileSidebar: () => setIsMobileSidebarOpen(false),}} />
        </main>
      </div>
    </>

  );
};

export default Projects;
