import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "../../components/ui/Button"


import { Input } from "../../components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/Select"
import {
    useSingleStaffTask, useUpdateMainTask,
    useUpdateSubTaskName,
    useDeleteSubTask
} from "../../apiList/StaffTasks Api/staffTaskApi"
import SubtaskStatusModal from "./SubtaskStatusModal"
import { dateFormate } from './../../utils/dateFormator';
import { toast } from "../../utils/toast"
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"

// const statusOptions = ["queued", "in_progress", "paused", "done"]
const priorityOptions = ["low", "medium", "high"]
const departmentOptions = ["site", "procurement", "design", "accounts"]

export const TaskViewMain: React.FC = () => {
    const { id } = useParams() as { id: string }
    const { data: task, isLoading, refetch } = useSingleStaffTask(id)
    const navigate = useNavigate()
    //   const task = allTasks?.find((t:any) => t._id === taskId)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due: "",
        department: "",
        priority: "medium"
    })
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const { mutateAsync: updateMainTask } = useUpdateMainTask()
    const { mutateAsync: updateSubTask } = useUpdateSubTaskName()
    const { mutateAsync: deleteSubTask } = useDeleteSubTask()

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                due: task.due?.slice(0, 16), // for datetime-local input
                department: task.department,
                priority: task.priority
            })
        }
    }, [task])

    const handleMainChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveMain = async () => {
        try {

            if (!task) return
            await updateMainTask({ mainTaskId: task._id, updates: formData })
            refetch()
            toast({ description: 'Updated Successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update completion status",
                variant: "destructive"
            });

        }
    }


    const handleEditSubtask = async (subtaskId: string, newName: string) => {
        try {
            if (!task) return
            await updateSubTask({ mainTaskId: task._id, subTaskId: subtaskId, taskName: newName })
            toast({ description: 'Updated Successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update completion status",
                variant: "destructive"
            });

        }

    }

    const handleDeleteSubtask = async (subtaskId: string) => {
        try {
            if (!task) return
            await deleteSubTask({ mainTaskId: task._id, subTaskId: subtaskId })
            toast({ description: 'Updated Successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update completion status",
                variant: "destructive"
            });

        }

    }

    if (!task) {
        return <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
            <i className="fas fa-clipboard text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Tasks Found</h3>
            <p className="text-sm text-gray-500">
                Looks like there are no tasks created yet <br />
                {/* Click on <strong>"Add task"</strong> to get started 🚀 */}
            </p>
        </div>
    }


    if (isLoading) {
        return <MaterialOverviewLoading />
    }

    return (
        <div className="p-2 overflow-y-auto max-h-full">
            <section className="flex items-start justify-between">
                <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <h1 className="text-xl sm:text-3xl font-bold text-blue-800">
                        View And Edit Task
                    </h1>
                </div>
            </section>
            <Card>
                <CardHeader>
                    <CardTitle>Task: {task?.title}</CardTitle>
                    {/* <CardDescription className="text-sm mt-1 text-gray-700">
            
          </CardDescription> */}
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <Input
                        value={formData.title}
                        onChange={(e) => handleMainChange("title", e.target.value)}
                        placeholder="Task Title"

                    />
                    <Input
                        value={formData.due}
                        onChange={(e) => handleMainChange("due", e.target.value)}
                        type="datetime-local"
                    />
                    <Select
                        value={formData.priority}
                        onValueChange={(val) => handleMainChange("priority", val)}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue selectedValue={formData.priority} placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {priorityOptions.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={formData.department}
                        onValueChange={(val) => handleMainChange("department", val)}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue selectedValue={formData.department} placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departmentOptions.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="md:col-span-2">
                        <Input
                            value={formData.description}
                            onChange={(e) => handleMainChange("description", e.target.value)}
                            placeholder="Description"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end w-full">
                        <Button onClick={handleSaveMain} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">
                            <i className="fa-solid fa-save mr-2"></i> Save Main Task
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Subtasks */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Subtasks</CardTitle>
                    <CardDescription>{task.tasks?.length || 0} subtasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {task.tasks.map((subtask: any) => (
                        <SubTaskEditor
                            key={subtask._id}
                            subtask={subtask}
                            onSave={(val) => handleEditSubtask(subtask._id, val)}
                            onDelete={() => handleDeleteSubtask(subtask._id)}
                        />
                    ))}
                </CardContent>
            </Card>



            <SubtaskStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                mainTaskId={task._id}
                subtasks={task.tasks}
                history={task.history}
            />

            <Card className="mt-6">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Task History</CardTitle>


                    <Button
                        onClick={() => setStatusModalOpen(true)}
                        className="bg-blue-700 text-white mt-2"
                    >
                        <i className="fa fa-bolt mr-1" />
                        Update Subtask Status
                    </Button>

                </CardHeader>
                {/* <CardContent className="space-y-2 text-sm text-gray-700">
    {task.history.length === 0 && <p>No history recorded.</p>}
    {task.history.map((entry: any, i: number) => (
      <div key={i} className="flex gap-4 items-center justify-between text-sm border-b pb-1 pt-1">
        <div>
          <p>
            <strong>Status:</strong> {entry?.status}
            {entry.subTask ? (
              <> (<span className="text-blue-700">{entry?.subTask}</span>)</>
            ) : null}
          </p>
          <p className="text-xs text-gray-500">
            Changed by: {entry?.changedBy?.staffName} |{" "}
            {new Date(entry?.changedAt).toLocaleString()}
          </p>
        </div>
      </div>
    ))}
  </CardContent> */}


                <CardContent className="space-y-3 text-sm text-gray-700">
                    {task.history.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                            <i className="fas fa-history text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No History Found</h3>
                            <p className="text-sm text-gray-500">
                                Looks like there are no changes made <br />
                                {/* Click on <strong>"Add task"</strong> to get started 🚀 */}
                            </p>
                        </div>
                    )}

                    {task.history.map((entry: any, i: number) => {
                        const statusColorMap: Record<string, string> = {
                            queued: "bg-gray-200 text-gray-800",
                            in_progress: "bg-blue-100 text-blue-800",
                            paused: "bg-yellow-100 text-yellow-800",
                            done: "bg-green-100 text-green-800",
                            start: "bg-purple-100 text-purple-800"
                        }

                        return (
                            <div
                                key={i}
                                className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-md shadow-sm"
                            >
                                {/* Status & Subtask Name */}
                                <div className="flex items-center flex-wrap gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColorMap[entry.status] || "bg-gray-100 text-gray-700"}`}>
                                        {entry.status.replace("_", " ").toUpperCase()}
                                    </span>

                                    {entry.subTask && (
                                        <span className="text-sm text-blue-600 font-medium italic">
                                            {entry.subTask}
                                        </span>
                                    )}
                                </div>

                                {/* Metadata */}
                                <div className="mt-1 text-xs text-gray-500 pl-1">
                                    {/* Future: Display user name here if available */}
                                    Changed on: {dateFormate(new Date(entry?.changedAt).toLocaleString())} - {new Date(entry?.changedAt).toLocaleString().slice(11)}
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}

// 🧩 Editable Subtask Component
const SubTaskEditor: React.FC<{
    subtask: { _id: string; taskName: string }
    onSave: (value: string) => void
    onDelete: () => void
}> = ({ subtask, onSave, onDelete }) => {
    const [name, setName] = useState(subtask.taskName)
    return (
        <div className="flex items-center gap-2">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
            />
            <div className="flex gap-2">
                <Button onClick={() => onSave(name)} className="bg-green-600 text-white hover:bg-green-700">
                    <i className="fa-solid fa-check mr-1" /> Save
                </Button>
                <Button onClick={onDelete} className="bg-red-600 text-white hover:bg-red-700">
                    <i className="fa-solid fa-trash mr-1" /> Delete
                </Button>
            </div>
        </div>
    )
}

export default TaskViewMain;