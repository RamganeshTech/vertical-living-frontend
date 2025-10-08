import React, { memo, useState } from 'react'
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { Textarea } from "../../components/ui/TextArea";
import type { ISubtask, ITask, IWorkLibrary } from './WorkLibraryMain';
import { useCreateWorkLibrary } from '../../apiList/workLibrary Api/workLibraryApi';
import { toast } from '../../utils/toast';
import { Button } from '../../components/ui/Button';

type Props = {
    dialogOpen: boolean
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    organizationId: string
}


const CreateWorkLib: React.FC<Props> = ({ dialogOpen, setDialogOpen, organizationId }) => {
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
    


        const createMutation = useCreateWorkLibrary();



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

    return (
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
        </div>)
}

export default memo(CreateWorkLib)