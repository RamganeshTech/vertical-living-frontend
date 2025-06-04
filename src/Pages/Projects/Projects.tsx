import { useState } from "react";
import { SIDEBAR_LABELS } from "../../constants/constants";
import CreateProject from "../../components/CreateProject";

type Project = {
  name: string;
  id: string;
  startDate: string;
  endDate: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  tasksLeft: number;
  totalTasks: number;
};

const projects: Project[] = [
  {
    name: "CRM Dashboard",
    id: "P-2025-01",
    startDate: "May 1, 2025",
    endDate: "May 21, 2025",
    priority: "Medium",
    duration: "20 days",
    tasksLeft: 8,
    totalTasks: 12,
  },
  {
    name: "Website Redesign",
    id: "P-2025-02",
    startDate: "Apr 10, 2025",
    endDate: "May 15, 2025",
    priority: "High",
    duration: "35 days",
    tasksLeft: 2,
    totalTasks: 10,
  },
  {
    name: "Website Redesign",
    id: "P-2025-02",
    startDate: "Apr 10, 2025",
    endDate: "May 15, 2025",
    priority: "High",
    duration: "35 days",
    tasksLeft: 2,
    totalTasks: 10,
  },
  {
    name: "Website Redesign",
    id: "P-2025-02",
    startDate: "Apr 10, 2025",
    endDate: "May 15, 2025",
    priority: "High",
    duration: "35 days",
    tasksLeft: 2,
    totalTasks: 10,
  },
  {
    name: "Website Redesign",
    id: "P-2025-02",
    startDate: "Apr 10, 2025",
    endDate: "May 15, 2025",
    priority: "High",
    duration: "35 days",
    tasksLeft: 2,
    totalTasks: 10,
  },
  // {
  //   name: "Website Redesign",
  //   id: "P-2025-02",
  //   startDate: "Apr 10, 2025",
  //   endDate: "May 15, 2025",
  //   priority: "High",
  //   duration: "35 days",
  //   tasksLeft: 2,
  //   totalTasks: 10,
  // },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-500";
    case "Medium":
      return "bg-yellow-100 text-yellow-600";
    case "Low":
      return "bg-green-100 text-green-600";
    default:
      return "";
  }
};

const Projects = () => {
  const [rotated, setRotated] = useState(false);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-[100%] flex flex-col h-full min-h-0 ">
      <div className="flex py-2 justify-between items-center">
        <h2 className="text-3xl font-bold text-[#1f2d3d] flex items-center gap-2">
          <i className="fa-solid fa-diagram-project text-blue-600 text-2xl"></i>
          <p>{SIDEBAR_LABELS.PROJECTS}</p>
        </h2>

        <div
          onClick={() => {
            setRotated(!rotated)
            setShowForm(!showForm)
          }}
          className="bg-blue-600 w-[3.5%] cursor-pointer !h-[40px] flex justify-center items-center rounded-full"
        >
          <i
            className={`fa-solid fa-plus text-white transition-transform duration-300 ${rotated ? "rotate-135" : "rotate-0"
              }`}
          ></i>
        </div>
      </div>

      <div className="h-full flex-1 !overflow-y-scroll   grid md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const completed =
            ((project.totalTasks - project.tasksLeft) / project.totalTasks) *
            100;

          return (
            <div
              key={project.id}
              className="h-[262px] flex flex-col shadow-md rounded-xl overflow-hidden border-l-8 border-blue-600 bg-white"
            >
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xl font-semibold text-[#1f2d3d]">
                    <i className="fa-solid fa-folder-open text-blue-600"></i>
                    {project.name}
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${getPriorityColor(
                      project.priority
                    )}`}
                  >
                    {project.priority} Priority
                  </span>
                </div>

                <div className="text-sm text-gray-700 grid grid-cols-3 sm:grid-cols-2 gap-y-1 sm:gap-y-2 gap-x-4">
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-hashtag text-gray-500" />
                    <strong>ID:</strong> {project.id}
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-calendar-day text-gray-500" />
                    <strong>Start:</strong> {project.startDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-calendar-check text-gray-500" />
                    <strong>End:</strong> {project.endDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-tasks text-gray-500" />
                    <strong>Tasks Left:</strong> {project.tasksLeft} of {project.totalTasks}
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-hourglass-half text-gray-500" />
                    <strong>Duration:</strong> {project.duration}
                  </div>
                </div>



                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Progress
                  </label>
                  <div className="mt-1 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${completed}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-right text-gray-600 mt-1">
                    {Math.round(completed)}% Complete
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-2 text-sm text-blue-600">
                  <button className="hover:underline flex items-center gap-1">
                    <i className="fa-solid fa-eye" />
                    View
                  </button>
                  <button className="hover:underline flex items-center gap-1 text-red-500">
                    <i className="fa-solid fa-trash" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>


       {showForm && (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    {/* <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fadeIn border border-gray-200"> */}
      
      {/* <button
        onClick={() => setShowForm(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
      >
        <i className="fa-solid fa-xmark text-xl"></i>
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <i className="fa-solid fa-folder-plus text-blue-600"></i>
        Create New Project
      </h2> */}

      <CreateProject onClose={()=> setShowForm(false)} />
    {/* </div> */}
  </div>
  )}

    </div>
  );
};

export default Projects;
