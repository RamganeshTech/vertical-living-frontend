import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import {
    useGetSingleWorkLibrary,
    useUpdateWorkLibrary
} from "../../apiList/workLibrary Api/workLibraryApi";
import { toast } from "../../utils/toast";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

const WorkLibrarySingle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { data: initialData, isLoading, error } = useGetSingleWorkLibrary(id!);
    const updateMutation = useUpdateWorkLibrary();

    const [work, setWork] = useState<any>(null);
    const [deletedSubtaskIds, setDeletedSubtaskIds] = useState<{ taskId: string, subtaskId: string }[]>([]);
    const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);


    useEffect(() => {
        if (initialData) setWork(initialData);
    }, [initialData]);

    const handleWorkChange = (key: string, value: string) => {
        setWork((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleTaskChange = (taskIndex: number, field: string, value: string) => {
        const newTasks = [...work.tasks];
        newTasks[taskIndex][field] = value;
        setWork((prev: any) => ({ ...prev, tasks: newTasks }));
    };

    const handleSubtaskChange = (taskIndex: number, subtaskIndex: number, field: string, value: string) => {
        const newTasks = [...work.tasks];
        newTasks[taskIndex].subtasks[subtaskIndex][field] = value;
        setWork((prev: any) => ({ ...prev, tasks: newTasks }));
    };

    const handleAddTask = () => {
        setWork((prev: any) => ({
            ...prev,
            tasks: [
                ...prev.tasks,
                {
                    title: "",
                    description: "",
                    category: "",
                    subtasks: []
                }
            ]
        }));
    };




    //     const handleDeleteTask = (index: number) => {
    //     const taskToDelete = work.tasks[index];

    //     setWork((prev: any) => ({
    //         ...prev,
    //         tasks: prev.tasks.filter((_: any, i: number) => i !== index),
    //         deletedTaskIds: [
    //             ...(prev.deletedTaskIds || []),
    //             ...(taskToDelete._id ? [taskToDelete._id] : [])
    //         ]
    //     }));
    // };


    const handleDeleteTask = (taskIndex: number) => {
        const taskToDelete = work.tasks[taskIndex];
        if (taskToDelete._id) {
            setDeletedTaskIds(prev => [...prev, taskToDelete._id]);
        }

        const newTasks = [...work.tasks];
        newTasks.splice(taskIndex, 1);
        setWork((prev: any) => ({ ...prev, tasks: newTasks }));
    };

    const handleAddSubtask = (taskIndex: number) => {
        const newTasks = [...work.tasks];
        newTasks[taskIndex].subtasks.push({
            title: "",
            description: "",
            estimatedTimeInMinutes: null
        });
        setWork((prev: any) => ({ ...prev, tasks: newTasks }));
    };

    // const handleDeleteSubtask = (taskIndex: number, subtaskIndex: number) => {
    //     const newTasks = [...work.tasks];
    //     newTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    //     setWork((prev: any) => ({ ...prev, tasks: newTasks }));
    // };

    const handleDeleteSubtask = (taskIndex: number, subtaskIndex: number) => {
        const task = work.tasks[taskIndex];
        const subtask = task.subtasks[subtaskIndex];

        if (subtask._id && task._id) {
            setDeletedSubtaskIds(prev => [
                ...prev,
                { taskId: task._id, subtaskId: subtask._id }
            ]);
        }

        const newTasks = [...work.tasks];
        newTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
        setWork((prev: any) => ({ ...prev, tasks: newTasks }));
    };




    //     const handleSave = async () => {
    //     try {
    //         const updateTasks = [];
    //         const addTasks = [];
    //         const deleteTaskIds = [];

    //         const updateSubtasks = [];
    //         const addSubtasks = [];
    //         const deleteSubtaskIds:any = [];

    //         // Loop over current tasks in state
    //         for (const task of work.tasks) {
    //             if (task._id) {
    //                 // Existing Task
    //                 updateTasks.push({
    //                     _id: task._id,
    //                     title: task.title,
    //                     estimatedTimeInMinutes: Number(task.estimatedTimeInMinutes) || 0,
    //                 });

    //                 const newSubtasks = task.subtasks.filter((st: any) => !st._id);
    //                 const existingSubtasks = task.subtasks.filter((st: any) => st._id);

    //                 if (newSubtasks.length) {
    //                     addSubtasks.push({
    //                         taskId: task._id,
    //                         subtasks: newSubtasks.map((st: any) => ({
    //                             title: st.title,
    //                             estimatedTimeInMinutes: Number(st.estimatedTimeInMinutes) || 0
    //                         }))
    //                     });
    //                 }

    //                 updateSubtasks.push(
    //                     ...existingSubtasks.map((st: any) => ({
    //                         taskId: task._id,
    //                         subtaskId: st._id,
    //                         title: st.title,
    //                         estimatedTimeInMinutes: Number(st.estimatedTimeInMinutes) || 0
    //                     }))
    //                 );
    //             } else {
    //                 // New Task without _id
    //                 addTasks.push({
    //                     title: task.title,
    //                     estimatedTimeInMinutes: Number(task.estimatedTimeInMinutes) || 0,
    //                     subtasks: task.subtasks.map((st: any) => ({
    //                         title: st.title,
    //                         estimatedTimeInMinutes: Number(st.estimatedTimeInMinutes) || 0,
    //                     }))
    //                 });
    //             }
    //         }

    //         // Detect deleted tasks (by comparing original and current)
    //         const originalTaskIds = (initialData?.tasks || []).map((t: any) => t._id);
    //         const currentTaskIds = (work.tasks || []).filter((t: any) => t._id).map((t: any) => t._id);
    //         deleteTaskIds.push(
    //             ...originalTaskIds.filter((id: string) => !currentTaskIds.includes(id))
    //         );

    //         // Detect deleted subtasks for each task
    //         for (const originalTask of (initialData?.tasks || [])) {
    //             const currentTask = work.tasks.find((t: any) => t._id === originalTask._id);
    //             if (!currentTask) continue;

    //             const originalSubtaskIds = (originalTask.subtasks || []).map((st: any) => st._id);
    //             const currentSubtaskIds = (currentTask.subtasks || []).filter((st: any) => st._id).map((st: any) => st._id);

    //             originalSubtaskIds.forEach((subId: string) => {
    //                 if (!currentSubtaskIds.includes(subId)) {
    //                     deleteSubtaskIds.push({
    //                         taskId: originalTask._id,
    //                         subtaskId: subId
    //                     });
    //                 }
    //             });
    //         }

    //         /** 👉 Final Payload */
    //         const payload = {
    //             workName: work?.workName,
    //             description: work?.description,
    //             tags: work?.tags,

    //             addTasks,
    //             deleteTaskIds,
    //             updateTasks,

    //             addSubtasks,
    //             deleteSubtaskIds,
    //             updateSubtasks
    //         };

    //         await updateMutation.mutateAsync({ workId: id!, formData: payload });

    //         toast({ title: "Success", description: "Workflow updated successfully" });

    //         // Optionally refetch or reload
    //         // refetch();

    //     } catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.response?.data?.message || "Failed to update the workflow",
    //             variant: "destructive"
    //         });
    //     }
    // };


    const handleSave = async () => {
        try {
            const updateTasks = [];
            const addTasks = [];

            const updateSubtasks = [];
            const addSubtasks = [];

            for (const task of work.tasks) {
                if (task._id) {
                    // Update existing task
                    updateTasks.push({
                        _id: task._id,
                        title: task.title,
                        estimatedTimeInMinutes: Number(task.estimatedTimeInMinutes) || 0,
                    });

                    const newSubtasks = task.subtasks.filter((s: any) => !s._id);
                    const existingSubtasks = task.subtasks.filter((s: any) => s._id);

                    if (newSubtasks.length) {
                        addSubtasks.push({
                            taskId: task._id,
                            subtasks: newSubtasks.map((sub: any) => ({
                                title: sub.title,
                                estimatedTimeInMinutes: Number(sub.estimatedTimeInMinutes) || 0,
                            }))
                        });
                    }

                    // Update existing subtasks
                    updateSubtasks.push(...existingSubtasks.map((s: any) => ({
                        taskId: task._id,
                        subtaskId: s._id,
                        title: s.title,
                        estimatedTimeInMinutes: Number(s.estimatedTimeInMinutes) || 0
                    })));

                } else {
                    // New task
                    addTasks.push({
                        title: task.title,
                        estimatedTimeInMinutes: Number(task.estimatedTimeInMinutes) || 0,
                        subtasks: task.subtasks.map((sub: any) => ({
                            title: sub.title,
                            estimatedTimeInMinutes: Number(sub.estimatedTimeInMinutes) || 0,
                        }))
                    });
                }
            }

            const payload = {
                workName: work?.workName,
                description: work?.description,
                tags: work?.tags ?? [],

                addTasks,
                deleteTaskIds: deletedTaskIds,
                updateTasks,

                addSubtasks,
                deleteSubtaskIds: deletedSubtaskIds,
                updateSubtasks
            };

            await updateMutation.mutateAsync({
                workId: id!,
                formData: payload
            });

            toast({ title: "Success", description: "Workflow updated successfully" });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to update",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />


    if (!initialData || error) {
        return <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
            <i className="fas fa-note text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-1">No WorkFlow Found</h3>
            {/* <p className="text-sm text-gray-500">
                                Looks like there are no Procurements yet for this project.<br />
                                Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
                            </p> */}
            <p className="text-sm text-gray-500">{(error as any)?.response?.data?.message || error?.message || "something went wrong"}</p>

        </div>
    }

    return (
        <div className="p-2 max-h-full overflow-y-auto mx-auto space-y-10">

            {/* <header className="flex gap-3 justify-start items-center w-full">

                 <div onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                       
                        Work Flow Details
                    </h2>
                   
               
            </header> */}

            <header className="flex items-center justify-between w-full bg-white border-b border-gray-200 px-4 py-3 rounded-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors"
                    >
                        <i className="fas fa-arrow-left text-sm" />
                        <span>Back</span>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Workflow Details</h2>
                </div>
            </header>


            {/* Work Info Section */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Work Name</Label>
                    <Input value={work?.workName || ""} onChange={(e) => handleWorkChange("workName", e.target.value)} />
                </div>
                <div>
                    <Label>Description</Label>
                    <Input value={work?.description || ""} onChange={(e) => handleWorkChange("description", e.target.value)} />
                </div>

            </div>

            {/* Tasks Section */}
            <div className="flex justify-between items-center !mb-3">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <Button onClick={handleAddTask}>
                    <i className="fa-solid fa-plus mr-2" /> Add Task
                </Button>
            </div>

            <div className="space-y-6">
                {work?.tasks.map((task: any, taskIndex: number) => (
                    <Card key={task._id} className="border-l-4 border-blue-600">
                        <CardHeader className="flex flex-row justify-between items-center space-y-0">
                            <CardTitle className="text-lg">Task {taskIndex + 1}</CardTitle>
                            <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteTask(taskIndex)}>
                                <i className="fa-solid fa-trash mr-1" />
                                Delete Task
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <Label>Task Title</Label>
                                    <Input value={task?.title || ""} onChange={(e) => handleTaskChange(taskIndex, "title", e.target.value)} />
                                </div>
                                {/* <div>
                                    <Label>Description</Label>
                                    <Input value={task?.description || ""} onChange={(e) => handleTaskChange(taskIndex, "description", e.target.value)} />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Category</Label>
                                    <Input value={task?.category || ""} onChange={(e) => handleTaskChange(taskIndex, "category", e.target.value)} />
                                </div> */}
                                <div>
                                    <Label>Estimated Time (min)</Label>
                                    <Input
                                        type="number"
                                        value={task?.estimatedTimeInMinutes || 0}
                                        onChange={(e) =>
                                            handleTaskChange(taskIndex, "estimatedTimeInMinutes", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Subtasks */}
                            <div className="flex justify-between items-center mt-4">
                                <h3 className="text-sm font-semibold">Subtasks</h3>
                                <Button onClick={() => handleAddSubtask(taskIndex)}>
                                    <i className="fa-solid fa-circle-plus mr-2" />
                                    Add Subtask
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {task?.subtasks.map((sub: any, subIndex: number) => (
                                    <div
                                        key={sub?._id}
                                        className="flex gap-3 bg-gray-50 p-3 rounded-lg relative"
                                    >
                                        <div className="flex flex-1">
                                            {/* <Label>Title</Label> */}
                                            <Input value={sub?.title || ""} onChange={(e) => handleSubtaskChange(taskIndex, subIndex, "title", e.target.value)} />
                                        </div>
                                        {/* <div>
                                            <Label>Description</Label>
                                            <Input value={sub?.description || ""} onChange={(e) => handleSubtaskChange(taskIndex, subIndex, "description", e.target.value)} />
                                        </div> */}


                                        <Button
                                            size="icon"
                                            className="bg-red-600 hover:bg-red-600 text-white"
                                            onClick={() => handleDeleteSubtask(taskIndex, subIndex)}
                                        >
                                            <i className="fa-solid fa-trash" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk mr-2" /> Save All Changes
                </Button>
            </div>
        </div>
    );
};

export default WorkLibrarySingle;



