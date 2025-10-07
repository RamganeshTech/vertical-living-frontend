import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCreateWorkLibrary, useDeleteWorkLibrary, useGetAllWorkLibraries } from "../../apiList/workLibrary Api/workLibraryApi";
import useGetRole from "../../Hooks/useGetRole";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { toast } from "../../utils/toast";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Textarea } from "../../components/ui/TextArea";


// Subtask Interface
export interface ISubtask {
    title: string;
    //   description?: string;
}

// Task Interface
export interface ITask {
    title: string;
    // description: string | null;
    //   category: string | null;
    subtasks: ISubtask[];
    estimatedTimeInMinutes: number;

}

// WorkLibrary Interface
export interface IWorkLibrary {
    organizationId?: string
    workName: string;
    description: string | null;
    tags?: string[] | null;
    tasks: ITask[];
}



const WorkLibraryMain = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const { role } = useGetRole();
    const navigate = useNavigate()
    const [dialogOpen, setDialogOpen] = useState(false)

    const [form, setForm] = useState<IWorkLibrary>({
        workName: "",
        description: "",
        tags: [],
        tasks: [{
            title: "",
            description: "",
            estimatedTimeInMinutes: 0,
            subtasks: [{ title: "" }]
        }] as any[]
    });

    const { data: works = [], isLoading, error } = useGetAllWorkLibraries(organizationId!);
    const createMutation = useCreateWorkLibrary();
    const deleteMutation = useDeleteWorkLibrary();



    // ------- Task/Subtask Form Handlers ---------

    // const handleTaskChange = (taskIndex: number, key: string, value: string) => {
    //     const updatedTasks: any = [...form.tasks];
    //     updatedTasks[taskIndex][key] = value;
    //     setForm(prev => ({ ...prev, tasks: updatedTasks }));
    // };

    // const handleSubtaskChange = (taskIndex: number, subIndex: number, key: string, value: any) => {
    //     const updatedTasks: any = [...form.tasks];
    //     updatedTasks[taskIndex].subtasks[subIndex][key] = value;
    //     setForm(prev => ({ ...prev, tasks: updatedTasks }));
    // };

    // const handleAddTask = () => {
    //     const newTask: ITask = {
    //         title: "",
    //         // description: "",
    //         subtasks: [],
    //         estimatedTimeInMinutes: 0

    //     };

    //     setForm(prev => ({
    //         ...prev,
    //         tasks: [...prev.tasks, newTask]
    //     }));
    // };

    // const handleDeleteTask = (taskIndex: number) => {
    //     const updatedTasks = [...form.tasks];
    //     updatedTasks.splice(taskIndex, 1);
    //     setForm(prev => ({ ...prev, tasks: updatedTasks }));
    // };





    // const handleAddSubtask = (taskIndex: number) => {
    //     const newSubtask: ISubtask = {
    //         title: "",
    //     };

    //     const updatedTasks = [...form.tasks];
    //     updatedTasks[taskIndex].subtasks = updatedTasks[taskIndex].subtasks || [];
    //     updatedTasks[taskIndex].subtasks.push(newSubtask);

    //     setForm(prev => ({ ...prev, tasks: updatedTasks }));
    // };


    // const handleDeleteSubtask = (taskIndex: number, subIndex: number) => {
    //     const updatedTasks = [...form.tasks];
    //     updatedTasks[taskIndex].subtasks.splice(subIndex, 1);
    //     setForm(prev => ({ ...prev, tasks: updatedTasks }));
    // };



    //     const normalizeTasks = (tasks: ITask[]) => {
    //     const t = [...tasks]

    //     // If no tasks, keep as-is (we won't inject here to respect default state)
    //     if (t.length === 0) return t

    //     const isEmpty = (task: ITask) => (task?.title || "").trim() === ""

    //     // Make sure there's at most one trailing empty task
    //     while (t.length > 1 && isEmpty(t[t.length - 1]) && isEmpty(t[t.length - 2])) {
    //       t.pop()
    //     }

    //     // If the last task is non-empty, auto-append one empty task for smooth typing
    //     if (!isEmpty(t[t.length - 1])) {
    //       t.push({
    //         title: "",
    //         estimatedTimeInMinutes: 0,
    //         subtasks: [],
    //       })
    //     }

    //     // If all tasks are empty and there are multiple, keep just one
    //     const hasNonEmpty = t.some((task) => !isEmpty(task))
    //     if (!hasNonEmpty && t.length > 1) {
    //       return [t[0]]
    //     }

    //     return t
    //   }

    //   // Ensure there's at most one trailing empty subtask per task and add one when last becomes non-empty.
    //   const normalizeSubtasks = (subtasks: ISubtask[] | undefined) => {
    //     const s: ISubtask[] = Array.isArray(subtasks) ? [...subtasks] : []

    //     const isEmpty = (sub?: ISubtask) => (sub?.title ?? "").trim() === ""

    //     // If no subtasks, do nothing unless the caller created one. Keep strictly caller-driven to respect defaults.
    //     if (s.length === 0) return s

    //     // Trim multiple trailing empties
    //     while (s.length > 1 && isEmpty(s[s.length - 1]) && isEmpty(s[s.length - 2])) {
    //       s.pop()
    //     }

    //     // If last subtask is non-empty, auto-append one empty
    //     if (!isEmpty(s[s.length - 1])) {
    //       s.push({ title: "" })
    //     }

    //     // If all subtasks are empty and there are multiple, keep just one
    //     const hasNonEmpty = s.some((sub) => !isEmpty(sub))
    //     if (!hasNonEmpty && s.length > 1) {
    //       return [s[0]]
    //     }

    //     return s
    //   }


    const normalizeTasks = (tasks: ITask[], forceAppendEmpty = false) => {
        const t = [...tasks]
        const isEmpty = (task: ITask) => (task?.title || "").trim() === ""

        if (t.length === 0) return t

        // Trim duplicate empty tasks
        while (t.length > 1 && isEmpty(t[t.length - 1]) && isEmpty(t[t.length - 2])) {
            t.pop()
        }

        // Append empty row only if last is filled OR force flag is set
        if (forceAppendEmpty || (!isEmpty(t[t.length - 1]) && !forceAppendEmpty)) {
            t.push({
                title: "",
                estimatedTimeInMinutes: 0,
                subtasks: [],
            })
        }

        // Collapse to single if all empty
        const hasNonEmpty = t.some((task) => !isEmpty(task))
        if (!hasNonEmpty && t.length > 1) return [t[0]]

        return t
    }

    // const normalizeSubtasks = (subtasks: ISubtask[] = [], forceAppendEmpty = false) => {
    //     const s = [...subtasks]
    //     const isEmpty = (sub: ISubtask) => (sub?.title || "").trim() === ""

    //     if (s.length === 0) return s

    //     // Trim duplicate empty subtasks
    //     while (s.length > 1 && isEmpty(s[s.length - 1]) && isEmpty(s[s.length - 2])) {
    //         s.pop()
    //     }

    //     // Append empty if last is filled or forced
    //     if (forceAppendEmpty || (!isEmpty(s[s.length - 1]) && !forceAppendEmpty)) {
    //         s.push({ title: "" })
    //     }

    //     // Collapse to single if all empty
    //     const hasNonEmpty = s.some((sub) => !isEmpty(sub))
    //     if (!hasNonEmpty && s.length > 1) return [s[0]]

    //     return s
    // }


    const normalizeSubtasks = (subtasks: ISubtask[] | undefined) => {
        const s: ISubtask[] = Array.isArray(subtasks) ? [...subtasks] : []

        const isEmpty = (sub?: ISubtask) => (sub?.title ?? "").trim() === ""

        // If no subtasks, do nothing unless the caller created one. Keep strictly caller-driven to respect defaults.
        if (s.length === 0) return s

        // Trim multiple trailing empties
        while (s.length > 1 && isEmpty(s[s.length - 1]) && isEmpty(s[s.length - 2])) {
          s.pop()
        }

        // If last subtask is non-empty, auto-append one empty
        if (!isEmpty(s[s.length - 1])) {
          s.push({ title: "" })
        }

        // If all subtasks are empty and there are multiple, keep just one
        const hasNonEmpty = s.some((sub) => !isEmpty(sub))
        if (!hasNonEmpty && s.length > 1) {
          return [s[0]]
        }

        return s
      }


    const handleTaskChange = (taskIndex: number, key: keyof ITask, value: any) => {
        const updatedTasks: ITask[] = [...form.tasks]
        const task = { ...updatedTasks[taskIndex] }

        // Apply change
        // Note: maintain types; don't mutate API expectations
        if (key === "estimatedTimeInMinutes") {
            // Keep behavior consistent with current code: pass raw value through
            // Convert only if you need strictly numeric locally:
            // value = Number(value) || 0
        }
        ; (task as any)[key] = value

        // Normalize subtasks only if we changed a subtask field elsewhere; here we keep task-level logic
        updatedTasks[taskIndex] = task

        // Auto-manage tasks trailing empty row based on title typing
        const normalized = normalizeTasks(updatedTasks)
        setForm((prev) => ({ ...prev, tasks: normalized }))
    }

    const handleAddTask = () => {
        const newTask: ITask = {
            title: "",
            estimatedTimeInMinutes: 0,
            subtasks: [],
        }
        const next = [...form.tasks, newTask]
        setForm((prev) => ({ ...prev, tasks: normalizeTasks(next, true) }))
    }

    // const handleDeleteTask = (taskIndex: number) => {
    //     const updatedTasks = [...form.tasks]
    //     updatedTasks.splice(taskIndex, 1)
    //     setForm((prev) => ({ ...prev, tasks: normalizeTasks(updatedTasks) }))
    // }


    const handleDeleteTask = (taskIndex: number) => {
        setForm((prev) => {
            const tasks = prev.tasks.filter((_, i) => i !== taskIndex);
            return { ...prev, tasks };
        });
    };



    const handleSubtaskChange = (taskIndex: number, subIndex: number, key: keyof ISubtask, value: any) => {
        const updatedTasks: ITask[] = [...form.tasks]
        const task = { ...updatedTasks[taskIndex] }

        // Ensure subtasks array exists safely without changing defaults globally
        const subtasks: ISubtask[] = Array.isArray(task.subtasks) ? [...task.subtasks] : []

        // Guard for dynamic empty rows
        if (!subtasks[subIndex]) {
            subtasks[subIndex] = { title: "" }
        }
        ; (subtasks[subIndex] as any)[key] = value

        // Normalize after change: auto-append/remove trailing empty
        task.subtasks = normalizeSubtasks(subtasks)
        updatedTasks[taskIndex] = task

        setForm((prev) => ({ ...prev, tasks: updatedTasks }))
    }

    const handleAddSubtask = (taskIndex: number) => {
        const updatedTasks: ITask[] = [...form.tasks]
        const task = { ...updatedTasks[taskIndex] }
        const subtasks: ISubtask[] = Array.isArray(task.subtasks) ? [...task.subtasks] : []
        subtasks.push({ title: "" })
        task.subtasks = normalizeSubtasks(subtasks)
        updatedTasks[taskIndex] = task
        setForm((prev) => ({ ...prev, tasks: updatedTasks }))
    }

    // const handleDeleteSubtask = (taskIndex: number, subIndex: number) => {
    //     const updatedTasks = [...form.tasks]
    //     const task = { ...updatedTasks[taskIndex] }
    //     const subtasks: ISubtask[] = Array.isArray(task.subtasks) ? [...task.subtasks] : []
    //     subtasks.splice(subIndex, 1)
    //     task.subtasks = normalizeSubtasks(subtasks)
    //     updatedTasks[taskIndex] = task
    //     setForm((prev) => ({ ...prev, tasks: updatedTasks }))
    // }


    const handleDeleteSubtask = (taskIndex: number, subIndex: number) => {
        setForm((prev) => {
            const tasks = [...prev.tasks];
            const task = { ...tasks[taskIndex] };

            if (Array.isArray(task.subtasks)) {
                task.subtasks = task.subtasks.filter((_, i) => i !== subIndex);
            }

            tasks[taskIndex] = task;

            return { ...prev, tasks };
        });
    };




    const handleCreateWork = async () => {
        try {
            // const formData = {
            //     workName: form.workName,
            //     description: form.description,
            //     tags: form.tags || [],
            //     organizationId: organizationId,
            //     tasks: form.tasks.map(task => ({
            //         title: task.title,
            //         // description: task.description || "",
            //         estimatedTimeInMinutes: task.estimatedTimeInMinutes || 0,
            //         subtasks: task.subtasks?.map(sub => ({
            //             title: sub.title,
            //         })) || []
            //     }))
            // };


            const cleanedTasks = form.tasks
                .filter(task => task.title.trim() !== "") // remove empty tasks
                .map(task => ({
                    title: task.title.trim(),
                    estimatedTimeInMinutes: Number(task.estimatedTimeInMinutes) || 0,
                    subtasks: (task.subtasks || [])
                        .filter(sub => sub.title.trim() !== "") // remove empty subtasks
                        .map(sub => ({ title: sub.title.trim() })),
                }))

            const formData = {
                workName: form.workName.trim(),
                description: form.description || "",
                tags: form.tags || [],
                organizationId,
                tasks: cleanedTasks,
            }

            await createMutation.mutateAsync({ formData })

            setDialogOpen(false)
            setForm({ workName: "", description: "", tags: [], tasks: [] })
            toast({ description: 'Work Flow created successfully', title: "Success" });
            //   refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create the work flow",
                variant: "destructive"
            });
        }
    }

    const handleDelete = async (workId: string) => {
        try {
            await deleteMutation.mutateAsync({ workId })
            toast({ description: 'Work Flow deleted successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete the work flow",
                variant: "destructive"
            });
        }
    }

    const isChild = location.pathname.includes("single")

    if (isChild) {
        return <Outlet />
    }

    if (isLoading) return <MaterialOverviewLoading />

    return (
        <div className="p-2 max-h-full overflow-y-auto">
            {/* Header */}

            <header className="flex justify-between items-center w-full">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-code-fork mr-3 text-blue-600"></i>
                        Work Library SOP
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage your work flows
                    </p>
                </div>
                <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-blue-600 flex items-center "
                >
                    <i className="fas fa-plus mr-1 text-white"></i>
                    Add Work
                </Button>
            </header>


            {error &&
                <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                    <i className="fas fa-note text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No WorkFlows Found</h3>
                    <p className="text-sm text-gray-500">
                        Looks like there are no work flow created yet.<br />
                        you can click <strong> add work </strong> to get started 🚀
                    </p>
                    <p className="text-sm text-gray-500">{(error as any)?.response?.data?.message || (error as any)?.message || "something went wrong"}</p>
                </div>
            }


            {/* {dialogOpen && <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Work Libraries</h2>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Work Library</DialogTitle>
                        </DialogHeader>

                        <div className="p-6 pt-0 space-y-5 max-h-[70vh] overflow-auto">
                            <div>
                                <Label>Work Name</Label>
                                <Input name="workName" value={form.workName} onChange={(e) => setForm({ ...form, workName: e.target.value })} />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input name="description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>



                            <div className="flex justify-between items-center">
                                <h3 className="text-md font-semibold">Tasks</h3>
                                <Button size="sm" onClick={handleAddTask}>
                                    <i className="fa-solid fa-plus mr-1" /> Add Task
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {form.tasks.map((task, taskIndex) => (
                                    <div key={taskIndex} className="p-4 bg-gray-100 rounded-lg space-y-3 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label>Task Title</Label>
                                                <Input value={task.title} onChange={(e) => handleTaskChange(taskIndex, "title", e.target.value)} />
                                            </div>
                                           


                                            <div>
                                                <Label>Estimated (min)</Label>
                                                <Input
                                                    type="number"
                                                    value={task.estimatedTimeInMinutes}
                                                    onChange={(e) =>
                                                        handleTaskChange(taskIndex, "estimatedTimeInMinutes", e.target.value)
                                                    }
                                                />
                                            </div>


                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    className="bg-red-600 text-white hover:bg-red-700"
                                                    onClick={() => handleDeleteTask(taskIndex)}
                                                >
                                                    <i className="fa-solid fa-trash mr-1" />
                                                    Delete Task
                                                </Button>
                                            </div>


                                           
                                        </div>

                                        
                                        <div className="flex justify-between items-center mt-4">
                                            <h4 className="text-sm font-semibold">Subtasks</h4>
                                            <Button size="sm" onClick={() => handleAddSubtask(taskIndex)}>
                                                <i className="fa-solid fa-circle-plus mr-1" /> Add Subtask
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {task?.subtasks?.map((subtask: any, subIndex: number) => (
                                                <div key={subIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded relative">
                                                    <div>
                                                        <Input
                                                            value={subtask.title}
                                                            onChange={(e) => handleSubtaskChange(taskIndex, subIndex, "title", e.target.value)}
                                                        />
                                                    </div>
                                                   

                                                    <button
                                                        className="absolute top-2 right-2 text-red-600"
                                                        onClick={() => handleDeleteSubtask(taskIndex, subIndex)}
                                                    >
                                                        <i className="fa-solid fa-trash" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>


                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCreateWork}>
                                <i className="fa-solid fa-floppy-disk mr-2" />
                                Create Work
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>} */}


            <>
                {dialogOpen && (
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold">Work Libraries</h2>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent className="w-[95vw] max-w-3xl p-0">
                                <DialogHeader className="px-6 pt-6 pb-2">
                                    <DialogTitle className="text-lg font-semibold">Add New Work Library</DialogTitle>
                                </DialogHeader>

                                <div className="px-6 pb-6 space-y-5 max-h-[70vh] overflow-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="mb-1 block">Work Name</Label>
                                            <Input
                                                name="workName"
                                                value={form.workName}
                                                onChange={(e) => setForm({ ...form, workName: e.target.value })}
                                                placeholder="Enter the Work Name"
                                                aria-label="Work Name"
                                            />
                                        </div>

                                        <div>
                                            <Label className="mb-1 block">Description</Label>
                                            <Textarea
                                                name="description"
                                                value={form?.description || ""}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                placeholder="Brief description"
                                                aria-label="Description"
                                            />
                                        </div>
                                    </div>

                                    {/* Tags intentionally omitted. Keep tags as [] in state. */}

                                    <div className="flex items-center justify-between">
                                        <h3 className="text-md font-semibold">Tasks</h3>
                                        <Button size="sm" onClick={handleAddTask} className="flex items-center gap-1">
                                            <i className="fa-solid fa-plus" aria-hidden="true" />
                                            <span className="sr-only">Add Task</span>
                                            <span aria-hidden="true">Add Task</span>
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {form.tasks.map((task, taskIndex) => (
                                            <div key={taskIndex} className="p-4 bg-gray-100 rounded-lg space-y-3 relative">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="md:col-span-2">
                                                        <Label className="mb-1 block">Task Title</Label>
                                                        <Input
                                                            value={task.title}
                                                            onChange={(e) => handleTaskChange(taskIndex, "title", e.target.value)}
                                                            placeholder="e.g. Plywood ,installation"
                                                            aria-label={`Task ${taskIndex + 1} Title`}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-1 block">Estimated (min)</Label>
                                                        <Input
                                                            type="number"
                                                            value={task.estimatedTimeInMinutes}
                                                            onChange={(e) => handleTaskChange(taskIndex, "estimatedTimeInMinutes", e.target.value)}
                                                            placeholder="0"
                                                            inputMode="numeric"
                                                            aria-label={`Task ${taskIndex + 1} Estimated Time in Minutes`}
                                                        />
                                                    </div>

                                                    <div className="flex items-end justify-end">
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                                                            onClick={() => handleDeleteTask(taskIndex)}
                                                        >
                                                            <i className="fa-solid fa-trash" aria-hidden="true" />
                                                            <span className="sr-only">Delete Task</span>
                                                            <span aria-hidden="true">Delete</span>
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Subtasks */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <h4 className="text-sm font-semibold">Subtasks</h4>
                                                    {task.subtasks.length === 0 && <Button
                                                        size="sm"
                                                        onClick={() => handleAddSubtask(taskIndex)}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <i className="fa-solid fa-circle-plus" aria-hidden="true" />
                                                        <span className="sr-only">Add Subtask</span>
                                                        <span aria-hidden="true">Add Subtask</span>
                                                    </Button>}
                                                </div>

                                                <div className="space-y-3">
                                                    {task?.subtasks?.map((subtask, subIndex) => (
                                                        <div
                                                            key={subIndex}
                                                            className="flex  gap-3 bg-white p-3 rounded relative"
                                                        >
                                                            <div className="w-full">
                                                                <Input
                                                                    value={subtask.title}
                                                                    onChange={(e) => handleSubtaskChange(taskIndex, subIndex, "title", e.target.value)}
                                                                    placeholder="Subtask title"
                                                                    aria-label={`Task ${taskIndex + 1} Subtask ${subIndex + 1} Title`}
                                                                />
                                                            </div>

                                                            <Button
                                                                variant="danger"
                                                                type="button"
                                                                className=" text-white bg-red-600"
                                                                onClick={() => handleDeleteSubtask(taskIndex, subIndex)}
                                                                aria-label={`Delete subtask ${subIndex + 1} from task ${taskIndex + 1}`}
                                                                title="Delete Subtask"
                                                            >
                                                                <i className="fa-solid fa-trash" aria-hidden="true" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <DialogFooter className="px-6 pb-6">
                                    <Button onClick={handleCreateWork} className="flex items-center gap-2">
                                        <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
                                        <span>Create Work</span>
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </>

            {isLoading ? (
                <p><MaterialOverviewLoading /></p>
            ) : !error && works?.length === 0 ? (
                <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                    <i className="fas fa-note text-5xl text-blue-300 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">No WorkFlows Found</h3>
                    <p className="text-sm text-gray-500">
                        Looks like there are no work flow created yet.<br />
                        you can click <strong> add work </strong> to get started 🚀
                    </p>
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-3 lg:grid-cols-4 gap-4">
                    {works.map((work: any) => (
                        <Card key={work._id} className="p-0 border-l-4 border-blue-600">
                            <CardHeader>
                                <CardTitle>{work?.workName || "No title"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm">
                                    <i className="fa-solid fa-file-lines mr-2 text-blue-600" />
                                    Description: {work.description || "N/A"}
                                </p>
                                {/* <p className="text-sm">
                                    <i className="fa-solid fa-tags mr-2 text-green-600" />
                                    Tags: {work.tags?.join(", ") || "None"}
                                </p> */}
                                <p className="text-sm">
                                    <i className="fa-solid fa-list-check mr-2 text-purple-600" />{" "}
                                    Total Tasks: {work.tasks?.length || 0}
                                </p>

                                <div className="flex gap-2 mt-3 justify-end">
                                    <Button
                                        size="sm"
                                        onClick={() => navigate(`single/${work._id}`)}
                                    >
                                        <i className="fa-solid fa-eye mr-1" />
                                        View
                                    </Button>
                                    {role !== "staff" && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleDelete(work._id)}
                                            isLoading={deleteMutation.isPending}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <i className="fa-solid fa-trash mr-1" />
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkLibraryMain;