import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import { SIDEBAR_ICONS, SIDEBAR_LABELS } from "../../constants/constants";

type ProjectType = {
  projectId: string | null,
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>
}

const Projects: React.FC<ProjectType> = ({ projectId, setProjectId }) => {

  const { organizationId } = useParams()

  const path = {
    PROJECTS: `/organizations/${organizationId}/projects`,
    ISSUES: "/issues",
    COLLABORATION: "/collaboration",
    TASKS: "/tasks",
    PHASES: "/phases",
  }

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar path={path} labels={SIDEBAR_LABELS} icons={SIDEBAR_ICONS} />
        <main className="!w-[100%] h-full p-4">
          <Outlet context={{ projectId, setProjectId , organizationId}} />
        </main>
      </div>
    </>

  );
};

export default Projects;
