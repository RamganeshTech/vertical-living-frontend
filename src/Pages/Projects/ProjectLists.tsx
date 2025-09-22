import { Fragment, useCallback, useState } from "react";
import { SIDEBAR_LABELS } from "../../constants/constants";
import CreateProject, { type ProjectInput } from "../../components/CreateProject";
import SingleProject from "../../shared/SingleProject";
import { useGetProjects } from "../../apiList/projectApi";
import type { IProject } from "../../types/types";
import { mapProjectToProjectInput } from "../../utils/editProjectRequiredFields";
import ProjectCardLoading from "../../LoadingUI/ProjectCartLoading";
import { useOutletContext, useParams } from "react-router-dom";
import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Button } from "../../components/ui/Button";


const ProjectLists = () => {

  const { organizationId } = useParams()
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()
  const { role } = useSelector((state: RootState) => state.authStore)
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditing, setisEditing] = useState<boolean>(false);

  const [editForm, setEditForm] = useState<ProjectInput>({
    projectName: "",
    description: "",
    duration: 0,
    // category:"",
    tags: [],
    startDate: new Date(),
    endDate: null,
    dueDate: null,
    priority: "none",
    status: "Active",
  });
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  let { data: getProjects, refetch, isPending, error, isLoading } = useGetProjects(organizationId!)

  const allowedRoles = ["owner", "CTO", "staff"]
  
  const handleEdit = useCallback((project: IProject, id: string) => {
    const projectInput = mapProjectToProjectInput(project);
    setEditForm(projectInput);
    setEditProjectId(id)
    setisEditing(true);
    setShowForm(true);

  }, []);

  const handleClose = useCallback(() => {
    setShowForm(false);
    setisEditing(false);
  }, []);

  const handleEditProject = useCallback((project: IProject, id: string) => {
    handleEdit(project, id);
  }, [handleEdit]);

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((n) => {
      return (
        <ProjectCardLoading key={n} />
      )
    })}
  </div>




  // getProjects = []
  return (
    <div className="w-[100%] flex flex-col h-full min-h-0 ">

      <header className="flex justify-between items-center">
        <div className="flex ">
          {isMobile &&
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border-none border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          }
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2d3d] flex items-center gap-2">
            <i className="fa-solid fa-diagram-project text-blue-600 text-2xl"></i>
            <p>{SIDEBAR_LABELS.PROJECTS}</p>
          </h2>
        </div>

        {allowedRoles.includes(role!) && <div
          onClick={() => {
            setShowForm(!showForm)
          }}
          className="bg-blue-600  cursor-pointer !h-[40px] !w-[40px] flex justify-center items-center rounded-full"
        >
          <i
            className={`fa-solid fa-plus text-white transition-transform duration-300 ${showForm ? "rotate-135" : "rotate-0"
              }`}
          ></i>
        </div>}

        
      </header>
      <hr className="my-2 border-b-1 border-gray-300" />

      {!error && !isPending && (getProjects?.length ?? 0) === 0 && <div className="flex h-full flex-col items-center justify-center w-full py-16 text-center text-gray-500">
        <div className="text-6xl mb-4">
          📂
        </div>
        <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
        <p className="text-sm text-gray-400 mb-4 max-w-md">
          Looks like you haven’t added any projects yet. Click the “+” button to get started and create your first project.
        </p>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
          Create New Project
        </button>
      </div>
      }



      {error && (
        <div className="max-w-xl sm:min-w-[80%]  mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
          <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
            ⚠️ Error Occurred
          </div>
          <p className="text-red-500  mb-4 text-lg sm:text-xl">
            {(error as any)?.response?.data?.message || "Failed to load the projects"}
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2"
          >
            Retry
          </Button>
        </div>
      )}


      {!error && <div className="h-full flex-1 !overflow-y-auto custom-scrollbar grid md:grid-cols-2 gap-6">

        {isPending && [...Array(6)].map((_, i) => <Fragment key={i}><ProjectCardLoading /></Fragment>)}

        {!isPending && getProjects?.length > 0 && getProjects?.map((project: IProject & { _id: string }, index: number) => {

          return (
            <>
              <div
                key={(project as any)._id}
                className="h-[256px] sm:!h-[270px] md:!h-[330px] lg:!h-[282px] flex flex-col shadow-md rounded-xl overflow-hidden border-l-8 border-blue-600 bg-white"
              >
                <SingleProject refetch={refetch} onEdit={handleEditProject} index={index} project={project} organizationId={organizationId!} />
              </div>
            </>
          );
        })}
      </div>}

      {showForm && (
        <div onClick={handleClose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <CreateProject onClose={handleClose} refetch={refetch} setShowForm={setShowForm} organizationId={organizationId!} isEditing={isEditing} setEditForm={setEditForm} editForm={editForm} editProjectId={editProjectId} />
        </div>
      )}

    </div>
  )
}

export default ProjectLists