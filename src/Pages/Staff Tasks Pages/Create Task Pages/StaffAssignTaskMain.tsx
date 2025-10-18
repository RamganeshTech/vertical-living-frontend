
// src/components/stafftasks/StaffAssignTaskMain.tsx

import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getSuggestedSubtasks, useCreateStaffTasks, useCreateStaffTasksFromWork, useGetAllStaffTasks } from "../../../apiList/StaffTasks Api/staffTaskApi"
import { useGetProjects } from "../../../apiList/projectApi"
import { useGetAllUsers } from "../../../apiList/getAll Users Api/getAllUsersApi"
import type { AvailableProjetType } from "../../Department Pages/Logistics Pages/LogisticsShipmentForm"
import SearchSelectNew from "../../../components/ui/SearchSelectNew"
import { Input } from "../../../components/ui/Input"
import { Label } from "../../../components/ui/Label"
import { Button } from "../../../components/ui/Button"
import { Textarea } from "../../../components/ui/TextArea"
import { toast } from "../../../utils/toast"
import { useQueries } from "@tanstack/react-query"
import useGetRole from "../../../Hooks/useGetRole"
import { getApiForRole } from "../../../utils/roleCheck"
import { formatDateForInput } from "../../../utils/dateFormator"
import DependentTaskList from "./DependentTaskList"
import { useGetAllWorkLibraries } from "../../../apiList/workLibrary Api/workLibraryApi"
import type { ITask, IWorkLibrary } from "../../Work Library Pages/WorkLibraryMain"

const allowedRoles = ["owner", "staff", "CTO"];

export interface SubtaskForm {
    _id?: string
    taskName: string
}



export interface MainTaskForm {
    _id?: string
    title: string
    description: string
    due: string
    priority: "low" | "medium" | "high"
    department: "site" | "procurement" | "design" | "accounts"
    assigneeId: string
    assigneeName: string
    projectId: string
    projectName: string
    organizationId?: string
    dependentTaskId?: string[]
    status: "in_progress" | "queued" | "done" | "paused",
    tasks: SubtaskForm[]
    history?: any[]
    images: File[]
    previewUrls: string[]
}



export type searchSelectOptions = {
    value: string,
    label: string
}


export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    } as T;
}



export const StaffAssignTaskMain: React.FC = () => {

    const { organizationId } = useParams() as { organizationId: string }
    const [enableDependent, setEnableDependent] = useState<boolean>(false)


    const defaultTaskList = {
        images: [],
        previewUrls: [],
        title: "",
        description: "",
        due: formatDateForInput(new Date()), // ✅ properly formatted
        priority: "high" as const,
        department: "site" as const,
        assigneeId: "",
        assigneeName: "",
        projectId: "",
        projectName: "",
        organizationId,
        status: "queued" as const,
        tasks: [{ taskName: "" }]
    }


    const [taskList, setTaskList] = useState<MainTaskForm[]>([defaultTaskList])
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const [selectedWork, setSelectedWork] = useState<string | null>(null);
    const [createdFromWork, setCreatedFromWork] = useState<boolean>(false);

    const { data: tasks } = useGetAllStaffTasks(organizationId)
    const { data: works = [] } = useGetAllWorkLibraries(organizationId);


    // const [debouncedTitles, setDebouncedTitles] = useState<string[]>(taskList?.map(() => ""));
    const [debouncedTitles, setDebouncedTitles] = useState<string[]>(() =>
        taskList.map(() => "")
    );
    // const suggestionQueries = debouncedTitles?.map((title) => useSuggestSubtasks(title));
    const suggestionQueries = useQueries({
        queries: (debouncedTitles ?? []).map((title) => ({
            queryKey: ["suggested-subtasks", title],
            queryFn: async () => {
                if (!title || title.length <= 3) return [];
                if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
                if (!api) throw new Error("Not Authenticated");

                return await getSuggestedSubtasks({ title, api });
            },
            enabled: !!title && title.length > 3 && !!role,
        })),
    });

    useEffect(() => {
        // Sync titles if task count changes
        if (debouncedTitles?.length !== taskList?.length) {
            setDebouncedTitles(taskList.map((task) => task.title || ""));
        }
    }, [taskList.length]);


    useEffect(() => {
        suggestionQueries.forEach((query, index) => {
            const { data, isSuccess } = query;
            const task = taskList[index];

            if (
                isSuccess &&
                data?.length > 0 &&
                task?.title?.trim()?.length > 3 &&
                task.tasks.length === 1 &&
                task.tasks[0]?.taskName.trim() === ""
            ) {
                const updated = [...taskList];

                // Prevent infinite re-setting
                const alreadySet = updated[index].tasks.map(t => t.taskName).join(",") === data.join(",");

                if (!alreadySet) {
                    updated[index].tasks = data.map((name: string) => ({ taskName: name }));
                    setTaskList(updated);
                }
            }
        });
    }, [suggestionQueries.map((q) => q.data).join("|")]); // 👈 Safe & efficient

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

    const workOptions = (works || [])?.map((work: IWorkLibrary) => ({
        label: work.workName,
        value: (work as any)._id,
    }))



    const debounceTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

    const handleDebouncedTitle = (index: number, newTitle: string) => {
        clearTimeout(debounceTimeouts.current[index]);

        debounceTimeouts.current[index] = setTimeout(() => {
            setDebouncedTitles((prev) => {
                const updated = [...prev];
                updated[index] = newTitle;
                return updated;
            });
        }, 800);
    };

    const { mutateAsync: createTasks, isPending } = useCreateStaffTasks()
    const { mutateAsync: createTasksFromWorkMutate, isPending:workPending } = useCreateStaffTasksFromWork()

    const handleAddMainTask = () => {
        setTaskList(prev => {
            const updated = [
                ...prev,
                // {
                //     images: [],
                //     previewUrls: [],
                //     title: "",
                //     description: "",
                //     due: formatDateForInput(new Date()), // ✅ properly formatted
                //     priority: "high" as const,
                //     department: "site" as const,
                //     assigneeId: "",
                //     assigneeName: "",
                //     projectId: "",
                //     projectName: "",
                //     organizationId,
                //     status: "queued" as const,
                //     tasks: [{ taskName: "" }]
                // }
                defaultTaskList
            ];
            setDebouncedTitles(updated.map(task => task.title || ""));
            return updated;
        });
    };

    const handleDeleteMainTask = (index: number) => {
        setTaskList(prev => prev.filter((_, i) => i !== index));
    };


    // old one
    // const handleMainChange = (index: number, updates: Partial<MainTaskForm>) => {
    //     const updated = [...taskList]
    //     updated[index] = { ...updated[index], ...updates }
    //     setTaskList(updated)
    // }


    const handleMainChange = (index: number, updates: Partial<MainTaskForm>) => {
        setTaskList(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
        });
    };


    const handleAssigneeChange = (index: number, value: string | null) => {
        const selectedAssignee = staffList?.find((staff: any) => staff._id === value)
        handleMainChange(index, {
            assigneeId: value || "",
            assigneeName: selectedAssignee?.staffName || ""
        })
    }


    const handleDependentTaskChange = (index: number, value: string[]) => {
        handleMainChange(index, {
            dependentTaskId: value.length > 0 ? value : undefined
        });
    };


    const handleProjectChange = (index: number, value: string | null) => {
        const selectedProject = projectList?.find((project: any) => project._id === value)
        handleMainChange(index, {
            projectId: value || "",
            projectName: selectedProject?.projectName || ""
        })
    }



    const handleWorkChange = (selectedWorkId: string | null) => {
        if (!selectedWorkId) return;

        const selectedWork = works.find((work: any) => work._id === selectedWorkId);

        if (!selectedWork) {
            return toast({ title: "Error", description: "No work Available", variant: "destructive" })
        };

        // Start from current time
        let currentDue = new Date();
        console.log("selected work", selectedWork)

        const generatedTasks: MainTaskForm[] = selectedWork?.tasks.map((task: ITask) => {

            const dueTime = formatDateForInput(new Date(currentDue)); // set current time as due

            const estimatedMinutes = task.estimatedTimeInMinutes || 0;

            // Add estimated minutes to the currentDue for the next task
            currentDue = new Date(currentDue.getTime() + estimatedMinutes * 60000);

            return {
                title: task.title,
                due: dueTime,
                description: "",
                tasks: (task.subtasks || []).map(sub => ({
                    taskName: sub.title
                })),
                images: [],
                previewUrls: [],
                priority: "high" as const,
                department: "site" as const,
                assigneeId: "",
                assigneeName: "",
                projectId: "",
                projectName: "",
                organizationId,
                status: "queued" as const,
            }
        });

        setSelectedWork(selectedWork?.workName || null)
        setTaskList(generatedTasks);
        setCreatedFromWork(true); // <-- Track that it's from the template
    };

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

    const removeSubtask = (mainIndex: number, subIndex: number) => {
        const updated = [...taskList]
        updated[mainIndex].tasks.splice(subIndex, 1)
        setTaskList(updated)
    }

    const handleSubmit = async () => {
        // let updatedTasksList =  taskList.map(task=> ({...task, tasks: tasks.filter((sub:any)=> sub.taskName?.trim())}))

        const updatedTasksList = taskList.map(task => {
            // Filter out empty subtasks
            const cleanedSubtasks = task.tasks
                .filter(sub => sub.taskName?.trim()) // remove empty/whitespace subtasks
                .map(sub => ({ taskName: sub.taskName.trim() })); // trim remaining

            return {
                ...task,
                tasks: cleanedSubtasks.length > 0 ? cleanedSubtasks : [],
            };
        });
        try {
            if (!createdFromWork) {
                await createTasks({
                    assigneRole: "staff",
                    tasks: updatedTasksList
                })
            }
            else {
                await createTasksFromWorkMutate({
                    assigneRole: "staff",
                    tasks: updatedTasksList
                })
            }

            setTaskList([defaultTaskList])
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
            <header className="flex justify-between items-center w-full  sticky z-[999] top-0 bg-white pb-5  border-b-1 border-gray-300 ">

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


                <div className="flex justify-end md:w-[90%]  items-center gap-4">
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
                        isLoading={workPending|| isPending}
                    >
                        <i className="fa fa-paper-plane mr-1" /> Submit All Tasks
                    </Button>


                      <div >
                    <Label>Select Work from work library</Label>
                    <SearchSelectNew
                        options={workOptions}
                        placeholder="Select Work"
                        searchPlaceholder="Search Works..."
                        value={selectedWork || undefined}
                        onValueChange={(value) => handleWorkChange(value)}
                        searchBy="name"
                        displayFormat="simple"
                        className="w-full"
                    />
                </div>
                </div>



              
            </header >

            {
                taskList.map((task, index) => (
                    <div key={index} className="bg-white border rounded-xl shadow-md p-6 space-y-4">

                        <section className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-blue-800">Task #{index + 1}</h3>
                            <Button
                                onClick={() => handleDeleteMainTask(index)}
                                variant="danger"
                                className="text-white bg-red-500 "
                            >
                                <i className="fas fa-trash-alt mr-1"></i> Remove Task
                            </Button>
                        </section>


                        {/* images */}

                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const previews = files.map(file => URL.createObjectURL(file));
                                handleMainChange(index, { images: files, previewUrls: previews });
                            }}
                        // className=""
                        />


                        {task?.previewUrls && <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
                            {task?.previewUrls?.length > 0 && task.previewUrls.map((url, imgIndex) => (
                                <div key={imgIndex} className="w-50 h-50 relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img
                                        src={url}
                                        className="w-full h-full object-cover group-hover:opacity-80 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedImages = [...task.images];
                                            const updatedPreviews = [...task.previewUrls];
                                            updatedImages.splice(imgIndex, 1);
                                            updatedPreviews.splice(imgIndex, 1);
                                            handleMainChange(index, {
                                                images: updatedImages,
                                                previewUrls: updatedPreviews,
                                            });
                                        }}
                                        className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>}

                        <div className="grid sm:grid-cols-2 gap-4">

                            {/* Title */}
                            <div>
                                <Label htmlFor={`title-${index}`}>Task Title</Label>
                                <Input
                                    id={`title-${index}`}
                                    placeholder="Enter task title"
                                    value={task.title}
                                    // onChange={(e) => {
                                    //     const value = e.target.value;
                                    //     handleMainChange(index, { title: value });
                                    //     debounceTitleChange(index, value); // trigger AI fetch
                                    // }}
                                    // handleMainChange(index, {title: e.target.value })
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        handleMainChange(index, { title: newTitle });
                                        handleDebouncedTitle(index, newTitle); // triggers hook
                                    }}

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


                            {/* <div>
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
                            </div> */}

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

                            <div className="col-span-full">
                                <label className="flex gap-2 items-center mt-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={enableDependent}
                                        onChange={() => {
                                            setEnableDependent(p => !p)
                                        }
                                        }
                                    />
                                    <span>Enable Task Dependencies (Select required tasks to be completed first)</span>
                                </label>
                            </div>


                            {
                                enableDependent && <DependentTaskList
                                    allTasks={tasks}
                                    selected={task.dependentTaskId || []}
                                    onChange={(ids) => handleDependentTaskChange(index, ids)}
                                />
                            }
                        </div>

                        {/* Subtasks */}
                        <div className="mt-4 space-y-3">
                            <Label className="text-[12px] text-gray-800">Subtasks</Label>
                            <Label className="text-[12px] text-gray-300"> (subtasks will be assinged automatically based on the task titles, if not assigned please enter the task manually, when you're assigning similar task, the sub tasks will be filled automatically )</Label>

                            {task?.tasks?.length === 0 && <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                                <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                                <h3 className="text-lg font-semibold text-blue-800 mb-1">No Subtasks Found</h3>
                                <p className="text-sm text-gray-500">
                                    Looks like there are no tasks assigned yet <br />
                                    Click on <strong>"Add subtask"</strong> to get started 🚀
                                </p>
                            </div>}
                            {task?.tasks?.map((sub, subIndex) => (
                                <div className="flex gap-2">
                                    <Input
                                        key={subIndex}
                                        value={sub.taskName}
                                        placeholder={`Subtask #${subIndex + 1}`}
                                        onChange={(e) => handleSubChange(index, subIndex, e.target.value)}
                                    />
                                    <Button onClick={() => removeSubtask(index, subIndex)} variant="danger" className="bg-red-600 text-white" size="sm">
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </div>
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
        </div >
    )
}

export default StaffAssignTaskMain


