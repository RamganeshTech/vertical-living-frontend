import React, { memo, useMemo } from 'react'
import { statusColors, type ProjectInput } from '../components/CreateProject'
import type { IProject } from '../types/types';
import { dateFormate } from '../utils/dateFormator';
import { Link } from 'react-router-dom';

type SingleProjectProp = {
    project: IProject,
    onEdit: (project: IProject, id:string) => void;
    index: number
}

const SingleProject: React.FC<SingleProjectProp> = ({  project, onEdit, index }) => {

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-500";
            case "medium":
                return "bg-yellow-100 text-yellow-600";
            case "low":
                return "bg-green-100 text-green-600";
            default:
                return "bg-white shadow-sm";
        }
    };

    const startDate = useMemo(()=> project.projectInformation?.startDate
  ? dateFormate(project.projectInformation.startDate)
  : null, []);

  const endDate = useMemo(()=> project.projectInformation?.endDate
  ? dateFormate(project.projectInformation.endDate)
  : null, []);

  const dueDate = useMemo(()=> project.projectInformation?.dueDate
  ? dateFormate(project.projectInformation.dueDate)
  : null, []);


    return (
        <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xl font-semibold text-[#1f2d3d]">
                    
                    <i className="fa-solid fa-folder-open text-blue-600"></i>
                    {project.projectName}
                </div>
                <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${getPriorityColor(
                        project.projectInformation.priority
                    )}`}
                >
                    {project.projectInformation.priority} priority
                </span>
            </div>

            <div className="text-sm text-gray-700 grid grid-cols-3 sm:grid-cols-2 gap-y-1 sm:gap-y-2 gap-x-4">
                {/* <div className="flex items-center gap-1">
                    <i className="fa-solid fa-hashtag text-gray-500" />
                    <strong>ID:</strong> {index}
                </div> */}
                <div className="flex items-center gap-1">
                    <i className="fa-solid fa-calendar-day text-gray-500" />
                    <strong>Start:</strong> {startDate ? startDate : "N/A"}

                </div>
                <div className="flex items-center gap-1">
                    <i className="fa-solid fa-calendar-check text-gray-500" />
                    <strong>End:</strong> {endDate ? endDate : "N/A"}
                </div>
                <div className="flex items-center gap-1">
                    <i className="fa-solid fa-calendar-check text-gray-500" />
                    <strong>Due:</strong> {dueDate ? dueDate : "N/A"}
                </div>
                {/* <div className="flex items-center gap-1">
                    <i className="fa-solid fa-tasks text-gray-500" />
                    <strong>Tasks Left:</strong> {project.tasksLeft} of {project.totalTasks}
                  </div> */}
                <div className="flex items-center gap-1">
                    <i className="fa-solid fa-hourglass-half text-gray-500" />
                    <strong>Duration: {project.projectInformation.duration} days</strong>
                </div>
                 <div className={`flex items-center gap-1`}>
                    <i className="fa-solid fa-hourglass-half text-gray-500" />
                    <strong>Status: <span className={`${statusColors[project.projectInformation.status]} !bg-transparent`}>{project.projectInformation.status}</span> </strong>
                </div>
            </div>



            <div>
                <label className="text-sm font-medium text-gray-600">
                    Progress
                </label>
                <div className="mt-1 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600"
                        style={{ width: `${project.completionPercentage}%` }}
                    ></div>
                </div>
                <div className="text-sm text-right text-gray-600 mt-1">
                    {project.completionPercentage}% Complete
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-2 text-sm text-blue-600">
                <Link to={`/projects/${(project as any)._id}/labourlist`} className="hover:underline cursor-pointer flex items-center gap-1">
                    <i className="fa-solid fa-eye" />
                    View
                </Link>
                <button className="hover:underline cursor-pointer flex items-center gap-1 text-red-500">
                    <i className="fa-solid fa-trash" />
                    Delete
                </button>
                <button onClick={() => onEdit(project, (project as any)._id)} className="hover:underline cursor-pointer flex items-center gap-1 text-amber-500">
                    <i className="fa-solid fa-pencil" />
                    edit
                </button>
            </div>
        </div>
    )
}

export default memo(SingleProject)