import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import { SIDEBAR_ICONS, SIDEBAR_LABELS } from "../../constants/constants";
import MobileSidebar from "../../shared/MobileSidebar";
import { useEffect, useState } from "react";

type ProjectType = {
  projectId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
}

const Projects: React.FC<ProjectType> = ({ projectId, setProjectId }) => {

  const { organizationId } = useParams()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 470);

  const path = {
    PROJECTS: `/organizations/${organizationId}/projects`,
    ORGANIZATION: `/organizations/${organizationId}/invitecto`
    // ISSUES: "/issues",
    // COLLABORATION: "/collaboration",
    // TASKS: "/tasks",
    // PHASES: "/phases",
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
          <Sidebar
            path={path}
            labels={SIDEBAR_LABELS}
            icons={SIDEBAR_ICONS}
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
