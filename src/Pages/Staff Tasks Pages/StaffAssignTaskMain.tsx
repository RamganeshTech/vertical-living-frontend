// // src/components/stafftasks/StaffAssignTaskMain.tsx

// import React, { useState } from 'react';
// import { useCreateStaffTasks } from '../../apiList/StaffTasks Api/staffTaskApi';
// import { useGetProjects } from '../../apiList/projectApi';
// import { useParams } from 'react-router-dom';
// import { useGetAllUsers } from '../../apiList/getAll Users Api/getAllUsersApi';
// import type { AvailableProjetType } from '../Department Pages/Logistics Pages/LogisticsShipmentForm';
// import SearchSelectNew from '../../components/ui/SearchSelectNew';

// interface SubtaskForm {
//   taskName: string;
// }

// interface MainTaskForm {
//   title: string;
//   description: string;
//   due: string;
//   priority: 'low' | 'medium' | 'high';
//   department: 'site' | 'procurement' | 'design' | 'accounts';
//   assigneeId: string;
//     assigneeName: string; // Add this field
//   projectId: string;
//   projectName:string;
//   organizationId: string;
//   dependentTaskId?: string;
//   tasks: SubtaskForm[];
// }

// export const StaffAssignTaskMain: React.FC = () => {
//         const { organizationId } = useParams() as { organizationId: string }

//   const [taskList, setTaskList] = useState<MainTaskForm[]>([
//     {
//       title: '',
//       description: '',
//       due: '',
//       priority: 'medium',
//       department: 'site',
//       assigneeId: '',
//       organizationId: '',
//       projectId: "",
//       tasks: [{ taskName: '' }]
//     }
//   ]);


//       const { data } = useGetProjects(organizationId!)
//       const { data: staffList } = useGetAllUsers(organizationId!, "staff");

//       const staffOptions = (staffList || [])?.map((staff: { _id: string, email: string, staffName: string }) => ({
//           value: staff._id,
//           label: staff.staffName,
//           email: staff.email
//       })) || [];

//       // console.log("data", data)
//       const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))


//   const { mutateAsync: createTasks, isPending } = useCreateStaffTasks();

//   const handleAddMainTask = () => {
//     setTaskList([
//       ...taskList,
//       {
//         title: '',
//         description: '',
//         due: '',
//         priority: 'medium',
//         department: 'site',
//         assigneeId: '',
//         organizationId: '',
//       projectId: "",
//         tasks: [{ taskName: '' }]
//       }
//     ]);
//   };

//   const handleMainChange = (index: number, name: string, value: any) => {
//     const updated:any = [...taskList];
//     updated[index][name as keyof MainTaskForm] = value;
//     setTaskList(updated);
//   };

//   const handleSubChange = (index: number, subIndex: number, value: string) => {
//     const updated = [...taskList];
//     updated[index].tasks[subIndex].taskName = value;
//     setTaskList(updated);
//   };

//   const addSubtask = (mainIndex: number) => {
//     const updated = [...taskList];
//     updated[mainIndex].tasks.push({ taskName: '' });
//     setTaskList(updated);
//   };

//   const handleSubmit = async () => {
//     await createTasks({
//       assigneRole: 'staff',
//       tasks: taskList
//     });
//     alert("Tasks created successfully.");
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-xl font-bold">Assign Staff Tasks</h2>

//       {taskList.map((task, index) => (
//         <div key={index} className="bg-white p-4 rounded shadow space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Title"
//               value={task.title}
//               onChange={(e) => handleMainChange(index, 'title', e.target.value)}
//               className="input input-bordered w-full"
//             />
//             <input
//               type="text"
//               placeholder="Assignee ID"
//               value={task.assigneeId}
//               onChange={(e) => handleMainChange(index, 'assigneeId', e.target.value)}
//               className="input input-bordered w-full"
//             />
//              <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Assignee
//                     </label>


//                     <SearchSelectNew
//                         options={staffOptions}
//                         placeholder="Select assignee"
//                         searchPlaceholder="Search by name..."
//                         value={task.assigneeId || ''}
//                         onValueChange={(value) => {
//                             const selectedAssignee = staffList?.find((staff: any) => staff._id === value);
//                             // setFilters(prev => ({
//                             //     ...prev,
//                             //     assigneeId: value || null,
//                             //     assigneeName: selectedAssignee?.staffName || ""
//                             // }));
//                             handleMainChange(index, 'assigneeId', value)
//                         }}
//                         searchBy="name" // Search by name only
//                         displayFormat="detailed" // Show name and email
//                         className="w-full"
//                     />
//                 </div>


//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Project
//                     </label>

//                     <select
//                         value={task.projectId || ''}
//                         onChange={(e) => {
//                             const selectedProject = projects?.find(
//                                 (p: AvailableProjetType) => p._id === e.target.value
//                             );
//                             if (selectedProject) {
//                                 setFilters(prev => ({
//                                     ...prev,
//                                     projectId: selectedProject._id,
//                                     projectName: selectedProject.projectName, // keep name too
//                                 }));
//                             }
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                         {/* <option value="">All Projects</option> */}
//                         {projects?.map((project: AvailableProjetType) => (
//                             <option key={project._id} value={project._id}>{project.projectName}</option>
//                         ))}
//                     </select>
//                 </div>
//             <textarea
//               placeholder="Description"
//               value={task.description}
//               onChange={(e) => handleMainChange(index, 'description', e.target.value)}
//               className="textarea textarea-bordered col-span-2"
//             />
//             <input
//               type="datetime-local"
//               value={task.due}
//               onChange={(e) => handleMainChange(index, 'due', e.target.value)}
//               className="input input-bordered w-full"
//             />
//             <select
//               value={task.priority}
//               onChange={(e) => handleMainChange(index, 'priority', e.target.value)}
//               className="select select-bordered w-full"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <h4 className="font-semibold mb-2">Subtasks</h4>
//             {task.tasks.map((sub, subIndex) => (
//               <div key={subIndex} className="flex items-center gap-2 mb-2">
//                 <input
//                   type="text"
//                   placeholder={`Subtask #${subIndex + 1}`}
//                   className="input input-sm input-bordered w-full"
//                   value={sub.taskName}
//                   onChange={(e) => handleSubChange(index, subIndex, e.target.value)}
//                 />
//               </div>
//             ))}
//             <button onClick={() => addSubtask(index)} className="btn btn-sm btn-outline">
//               <i className="fa fa-plus mr-1" /> Add Subtask
//             </button>
//           </div>
//         </div>
//       ))}

//       <div className="flex gap-4">
//         <button onClick={handleAddMainTask} className="btn btn-secondary">
//           <i className="fa fa-plus mr-1" /> Add More Task
//         </button>
//         <button onClick={handleSubmit} className="btn btn-primary" disabled={isPending}>
//           <i className="fa fa-paper-plane mr-1" /> Submit All Tasks
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StaffAssignTaskMain;


// SECOND VERSION

// src/components/stafftasks/StaffAssignTaskMain.tsx

// import React, { useState } from 'react';
// import { useCreateStaffTasks } from '../../apiList/StaffTasks Api/staffTaskApi';
// import { useGetProjects } from '../../apiList/projectApi';
// import { useParams } from 'react-router-dom';
// import { useGetAllUsers } from '../../apiList/getAll Users Api/getAllUsersApi';
// import type { AvailableProjetType } from '../Department Pages/Logistics Pages/LogisticsShipmentForm';
// import SearchSelectNew from '../../components/ui/SearchSelectNew';

// interface SubtaskForm {
//   taskName: string;
// }

// interface MainTaskForm {
//   title: string;
//   description: string;
//   due: string;
//   priority: 'low' | 'medium' | 'high';
//   department: 'site' | 'procurement' | 'design' | 'accounts';
//   assigneeId: string;
//   assigneeName: string;
//   projectId: string;
//   projectName: string;
//   organizationId: string;
//   dependentTaskId?: string;
//   tasks: SubtaskForm[];
// }

// export const StaffAssignTaskMain: React.FC = () => {
//   const { organizationId } = useParams() as { organizationId: string }

//   const [taskList, setTaskList] = useState<MainTaskForm[]>([
//     {
//       title: '',
//       description: '',
//       due: '',
//       priority: 'medium',
//       department: 'site',
//       assigneeId: '',
//       assigneeName: '',
//       projectId: "",
//       projectName: "",
//       organizationId: organizationId,
//       tasks: [{ taskName: '' }]
//     }
//   ]);

//   const { data } = useGetProjects(organizationId!)
//   const { data: staffList } = useGetAllUsers(organizationId!, "staff");

//   const staffOptions = (staffList || [])?.map((staff: { _id: string, email: string, staffName: string }) => ({
//     value: staff._id,
//     label: staff.staffName,
//     email: staff.email
//   })) || [];

//   const projectOptions = (data || [])?.map((project: AvailableProjetType) => ({
//     value: project._id,
//     label: project.projectName
//   })) || [];

//   const { mutateAsync: createTasks, isPending } = useCreateStaffTasks();

//   const handleAddMainTask = () => {
//     setTaskList([
//       ...taskList,
//       {
//         title: '',
//         description: '',
//         due: '',
//         priority: 'medium',
//         department: 'site',
//         assigneeId: '',
//         assigneeName: '',
//         projectId: "",
//         projectName: "",
//         organizationId: organizationId,
//         tasks: [{ taskName: '' }]
//       }
//     ]);
//   };

//   // Enhanced handleMainChange to handle multiple fields at once
//   const handleMainChange = (index: number, updates: Partial<MainTaskForm>) => {
//     const updated = [...taskList];
//     updated[index] = {
//       ...updated[index],
//       ...updates
//     };
//     setTaskList(updated);
//   };

//   // Specific handler for assignee changes
//   const handleAssigneeChange = (index: number, value: string | null) => {
//     const selectedAssignee = staffList?.find((staff: any) => staff._id === value);
//     handleMainChange(index, {
//       assigneeId: value || '',
//       assigneeName: selectedAssignee?.staffName || ''
//     });
//   };

//   // Specific handler for project changes
//   const handleProjectChange = (index: number, value: string | null) => {
//     const selectedProject = data?.find((project: AvailableProjetType) => project._id === value);
//     handleMainChange(index, {
//       projectId: value || '',
//       projectName: selectedProject?.projectName || ''
//     });
//   };

//   const handleSubChange = (index: number, subIndex: number, value: string) => {
//     const updated = [...taskList];
//     updated[index].tasks[subIndex].taskName = value;
//     setTaskList(updated);
//   };

//   const addSubtask = (mainIndex: number) => {
//     const updated = [...taskList];
//     updated[mainIndex].tasks.push({ taskName: '' });
//     setTaskList(updated);
//   };

//   const handleSubmit = async () => {
//     await createTasks({
//       assigneRole: 'staff',
//       tasks: taskList
//     });
//     alert("Tasks created successfully.");
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-xl font-bold">Assign Staff Tasks</h2>

//       {taskList.map((task, index) => (
//         <div key={index} className="bg-white p-4 rounded shadow space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Title */}
//             <input
//               type="text"
//               placeholder="Title"
//               value={task.title}
//               onChange={(e) => handleMainChange(index, { title: e.target.value })}
//               className="input input-bordered w-full"
//             />

//             {/* Due Date */}
//             <input
//               type="datetime-local"
//               value={task.due}
//               onChange={(e) => handleMainChange(index, { due: e.target.value })}
//               className="input input-bordered w-full"
//             />

//             {/* Assignee Selection */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Assignee
//               </label>
//               <SearchSelectNew
//                 options={staffOptions}
//                 placeholder="Select assignee"
//                 searchPlaceholder="Search by name..."
//                 value={task.assigneeId || ''}
//                 onValueChange={(value) => handleAssigneeChange(index, value)}
//                 searchBy="name"
//                 displayFormat="detailed"
//                 className="w-full"
//               />
//               {task.assigneeName && (
//                 <div className="mt-2 text-sm text-gray-600">
//                   Selected Assignee: <span className="font-medium">{task.assigneeName}</span>
//                 </div>
//               )}
//             </div>

//             {/* Project Selection */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Project
//               </label>
//               <SearchSelectNew
//                 options={projectOptions}
//                 placeholder="Select project"
//                 searchPlaceholder="Search by project name..."
//                 value={task.projectId || ''}
//                 onValueChange={(value) => handleProjectChange(index, value)}
//                 searchBy="name"
//                 displayFormat="simple"
//                 className="w-full"
//               />
//               {task.projectName && (
//                 <div className="mt-2 text-sm text-gray-600">
//                   Selected Project: <span className="font-medium">{task.projectName}</span>
//                 </div>
//               )}
//             </div>

//             {/* Priority */}
//             <select
//               value={task.priority}
//               onChange={(e) => handleMainChange(index, { priority: e.target.value as 'low' | 'medium' | 'high' })}
//               className="select select-bordered w-full"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>

//             {/* Department */}
//             <select
//               value={task.department}
//               onChange={(e) => handleMainChange(index, { department: e.target.value as 'site' | 'procurement' | 'design' | 'accounts' })}
//               className="select select-bordered w-full"
//             >
//               <option value="site">Site</option>
//               <option value="procurement">Procurement</option>
//               <option value="design">Design</option>
//               <option value="accounts">Accounts</option>
//             </select>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <textarea
//                 placeholder="Description"
//                 value={task.description}
//                 onChange={(e) => handleMainChange(index, { description: e.target.value })}
//                 className="textarea textarea-bordered w-full"
//                 rows={3}
//               />
//             </div>
//           </div>

//           {/* Subtasks Section */}
//           <div className="border-t pt-4">
//             <h4 className="font-semibold mb-2">Subtasks</h4>
//             {task.tasks.map((sub, subIndex) => (
//               <div key={subIndex} className="flex items-center gap-2 mb-2">
//                 <input
//                   type="text"
//                   placeholder={`Subtask #${subIndex + 1}`}
//                   className="input input-sm input-bordered w-full"
//                   value={sub.taskName}
//                   onChange={(e) => handleSubChange(index, subIndex, e.target.value)}
//                 />
//               </div>
//             ))}
//             <button 
//               onClick={() => addSubtask(index)} 
//               className="btn btn-sm btn-outline mt-2"
//             >
//               <i className="fa fa-plus mr-1" /> Add Subtask
//             </button>
//           </div>

//           {/* Display current values for debugging */}
//           <div className="text-xs text-gray-500 border-t pt-2">
//             <div>Assignee: {task.assigneeName} (ID: {task.assigneeId})</div>
//             <div>Project: {task.projectName} (ID: {task.projectId})</div>
//           </div>
//         </div>
//       ))}

//       <div className="flex gap-4">
//         <button onClick={handleAddMainTask} className="btn btn-secondary">
//           <i className="fa fa-plus mr-1" /> Add More Task
//         </button>
//         <button onClick={handleSubmit} className="btn btn-primary" disabled={isPending}>
//           <i className="fa fa-paper-plane mr-1" /> Submit All Tasks
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StaffAssignTaskMain;




// THIRD VERSION

// src/components/stafftasks/StaffAssignTaskMain.tsx

import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCreateStaffTasks } from "../../apiList/StaffTasks Api/staffTaskApi"
import { useGetProjects } from "../../apiList/projectApi"
import { useGetAllUsers } from "../../apiList/getAll Users Api/getAllUsersApi"
import type { AvailableProjetType } from "../Department Pages/Logistics Pages/LogisticsShipmentForm"
import SearchSelectNew from "../../components/ui/SearchSelectNew"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Button } from "../../components/ui/Button"
import { Textarea } from "../../components/ui/TextArea"
import { toast } from "../../utils/toast"

interface SubtaskForm {
    taskName: string
}

interface MainTaskForm {
    title: string
    description: string
    due: string
    priority: "low" | "medium" | "high"
    department: "site" | "procurement" | "design" | "accounts"
    assigneeId: string
    assigneeName: string
    projectId: string
    projectName: string
    organizationId: string
    dependentTaskId?: string
    status?: string,
    tasks: SubtaskForm[]
}

export const StaffAssignTaskMain: React.FC = () => {
    const { organizationId } = useParams() as { organizationId: string }

    const [taskList, setTaskList] = useState<MainTaskForm[]>([
        {
            title: "",
            description: "",
            due: "",
            priority: "medium",
            department: "site",
            assigneeId: "",
            assigneeName: "",
            projectId: "",
            projectName: "",
            organizationId,
            status: "queued",
            tasks: [{ taskName: "" }]
        }
    ])
    const navigate = useNavigate()
    const { data: projectList } = useGetProjects(organizationId!)
    const { data: staffList } = useGetAllUsers(organizationId!, "staff")

    const staffOptions = (staffList || []).map((staff: { _id: string; email: string; staffName: string }) => ({
        value: staff._id,
        label: staff.staffName,
        email: staff.email
    }))

    const projectOptions = (projectList || []).map((project: AvailableProjetType) => ({
        value: project._id,
        label: project.projectName
    }))

    const { mutateAsync: createTasks, isPending } = useCreateStaffTasks()

    const handleAddMainTask = () => {
        setTaskList([
            ...taskList,
            {
                title: "",
                description: "",
                due: "",
                priority: "medium",
                department: "site",
                assigneeId: "",
                assigneeName: "",
                projectId: "",
                projectName: "",
                organizationId,
                tasks: [{ taskName: "" }]
            }
        ])
    }

    const handleMainChange = (index: number, updates: Partial<MainTaskForm>) => {
        const updated = [...taskList]
        updated[index] = { ...updated[index], ...updates }
        setTaskList(updated)
    }

    const handleAssigneeChange = (index: number, value: string | null) => {
        const selectedAssignee = staffList?.find((staff: any) => staff._id === value)
        handleMainChange(index, {
            assigneeId: value || "",
            assigneeName: selectedAssignee?.staffName || ""
        })
    }

    const handleProjectChange = (index: number, value: string | null) => {
        const selectedProject = projectList?.find((project: any) => project._id === value)
        handleMainChange(index, {
            projectId: value || "",
            projectName: selectedProject?.projectName || ""
        })
    }

    const handleSubChange = (index: number, subIndex: number, value: string) => {
        const updated = [...taskList]
        updated[index].tasks[subIndex].taskName = value
        setTaskList(updated)
    }

    const addSubtask = (mainIndex: number) => {
        const updated = [...taskList]
        updated[mainIndex].tasks.push({ taskName: "" })
        setTaskList(updated)
    }

    const handleSubmit = async () => {
        try {
            await createTasks({
                assigneRole: "staff",
                tasks: taskList
            })
            toast({ description: 'Task Created Successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update completion status",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6 text-blue-900 overflow-y-auto max-h-full">
            <header className="flex justify-between items-center w-full">

                <div className="flex items-center gap-4 w-full">
                    <div onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>


                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-dolly mr-3 text-blue-600"></i>
                        Assign Staff Tasks
                    </h2>
                </div>
            </header >

            {
                taskList.map((task, index) => (
                    <div key={index} className="bg-white border rounded-xl shadow-md p-6 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Title */}
                            <div>
                                <Label htmlFor={`title-${index}`}>Task Title</Label>
                                <Input
                                    id={`title-${index}`}
                                    placeholder="Enter task title"
                                    value={task.title}
                                    onChange={(e) => handleMainChange(index, { title: e.target.value })}
                                />
                            </div>

                            {/* Due Date */}
                            <div>
                                <Label htmlFor={`due-${index}`}>Due Date</Label>
                                <Input
                                    id={`due-${index}`}
                                    type="datetime-local"
                                    value={task.due}
                                    onChange={(e) => handleMainChange(index, { due: e.target.value })}
                                />
                            </div>

                            {/* Assignee Select */}
                            <div >
                                <Label>Select Assignee</Label>
                                <SearchSelectNew
                                    options={staffOptions}
                                    placeholder="Select assignee"
                                    searchPlaceholder="Search by name..."
                                    value={task.assigneeId || undefined}
                                    onValueChange={(value) => handleAssigneeChange(index, value)}
                                    searchBy="name"
                                    displayFormat="detailed"
                                    className="w-full"
                                />
                                {task?.assigneeName && (
                                    <p className="text-sm text-blue-700 mt-1">Assignee: {task?.assigneeName}</p>
                                )}
                            </div>

                            {/* Project Select */}
                            <div >
                                <Label>Select Project</Label>
                                <SearchSelectNew
                                    options={projectOptions}
                                    placeholder="Select project"
                                    searchPlaceholder="Search projects..."
                                    value={task.projectId || undefined}
                                    onValueChange={(value) => handleProjectChange(index, value)}
                                    searchBy="name"
                                    displayFormat="simple"
                                    className="w-full"
                                />
                                {task.projectName && (
                                    <p className="text-sm text-blue-700 mt-1">Project: {task.projectName}</p>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <Label>Priority</Label>
                                <select
                                    value={task.priority}
                                    onChange={(e) => handleMainChange(index, { priority: e.target.value as MainTaskForm["priority"] })}
                                    className="w-full border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Department */}
                            <div>
                                <Label>Department</Label>
                                <select
                                    value={task.department}
                                    onChange={(e) => handleMainChange(index, { department: e.target.value as MainTaskForm["department"] })}
                                    className="w-full border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="site">Site</option>
                                    <option value="procurement">Procurement</option>
                                    <option value="design">Design</option>
                                    <option value="accounts">Accounts</option>
                                </select>
                            </div>


                            <div>
                                <Label>Status</Label>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleMainChange(index, { status: e.target.value as MainTaskForm["status"] })}
                                    className="w-full border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="queued">Queued</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="col-span-full">
                                <Label>Description</Label>
                                <Textarea
                                    rows={3}
                                    placeholder="Enter task description"
                                    value={task.description}
                                    onChange={(e) => handleMainChange(index, { description: e.target.value })}
                                    className="resize-none w-full"
                                />
                            </div>
                        </div>

                        {/* Subtasks */}
                        <div className="mt-4 space-y-3">
                            <Label>Subtasks</Label>
                            {task.tasks.map((sub, subIndex) => (
                                <Input
                                    key={subIndex}
                                    value={sub.taskName}
                                    placeholder={`Subtask #${subIndex + 1}`}
                                    onChange={(e) => handleSubChange(index, subIndex, e.target.value)}
                                />
                            ))}
                            <Button
                                type="button"
                                onClick={() => addSubtask(index)}
                                className="bg-blue-200 hover:bg-blue-300 text-blue-900 mt-2"
                            >
                                <i className="fa fa-plus mr-1" /> Add Subtask
                            </Button>
                        </div>
                    </div>
                ))
            }

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <Button
                    type="button"
                    onClick={handleAddMainTask}
                    variant="secondary"
                    className=""
                >
                    <i className="fa fa-plus mr-1" /> Add More Task
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isPending}
                >
                    <i className="fa fa-paper-plane mr-1" /> Submit All Tasks
                </Button>
            </div>
        </div >
    )
}

export default StaffAssignTaskMain