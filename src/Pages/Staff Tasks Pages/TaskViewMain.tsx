import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"
import {
    useSingleStaffTask,
    useUpdateMainTask,
    useUpdateSubTaskName,
    useDeleteSubTask
} from "../../apiList/StaffTasks Api/staffTaskApi"
import SubtaskStatusModal from "./SubtaskStatusModal"
import { dateFormate, formatDateForInput, formatTime } from './../../utils/dateFormator'
import { toast } from "../../utils/toast"
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"
import { Label } from "../../components/ui/Label"
import SearchSelectNew from "../../components/ui/SearchSelectNew"
import { useGetAllUsers } from "../../apiList/getAll Users Api/getAllUsersApi"
import { useGetProjects } from "../../apiList/projectApi"
import type { AvailableProjetType } from "../Department Pages/Logistics Pages/LogisticsShipmentForm"
import useGetRole from "../../Hooks/useGetRole"
import { Textarea } from "../../components/ui/TextArea"
import type { MainTaskForm } from "./Create Task Pages/StaffAssignTaskMain"
import { Badge } from "../../components/ui/Badge"

const statusOptions = ["queued", "in_progress", "paused", "done"]
const priorityOptions = ["low", "medium", "high"]
const departmentOptions = ["site", "procurement", "design", "accounts"]


type DependentTask = {
  _id?: string;
  title?: string;
  due?: string;
  status?: string;
  assigneeId?: {
    staffName?: string;
    _id?:string
  };
};

interface FormData {
  title: string;
  description: string;
  due: string;
  status: string;
  department: string;
  priority: string;
  assigneeId: string;
  assigneeName: string;
  projectId: string;
  projectName: string;
  dependentTaskId: DependentTask[] | undefined | null;   // ✅ array, not undefined
}



export const isBlockedByDependencies = (
    dependentTaskId: any[] | null,
    role: string | null
): boolean => {
    const isStaff = role === "staff";
    const hasDependencies = dependentTaskId && Array.isArray(dependentTaskId) && dependentTaskId?.length > 0;
    const hasIncomplete = dependentTaskId && Array.isArray(dependentTaskId) && dependentTaskId?.some((dep: any) => dep?.status !== "done");

    if (isStaff && hasDependencies && hasIncomplete) {
        toast({
            title: "Not Allowed",
            description: `You cannot update status until all dependent tasks are marked as done`,
            variant: "destructive"
        });
        return true;
    }

    return false;
};


export const TaskViewMain: React.FC = () => {
    const { id, organizationId } = useParams() as { id: string, organizationId: string }
    const { role } = useGetRole()
    const isStaff = role === "staff"

    const navigate = useNavigate()
    const { data: task, isLoading, refetch } = useSingleStaffTask(id) as { data: MainTaskForm, isLoading: boolean, refetch: any }
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        due: "",
        status: "queued",
        department: "site",
        priority: "medium",
        assigneeId: "",
        assigneeName: "",
        projectId: "",
        projectName: "",
        dependentTaskId: undefined
    })

    const [isStatusModalOpen, setStatusModalOpen] = useState(false)

    const { mutateAsync: updateMainTask } = useUpdateMainTask()
    const { mutateAsync: updateSubTask } = useUpdateSubTaskName()
    const { mutateAsync: deleteSubTask } = useDeleteSubTask()

    const { data: projectList } = useGetProjects(organizationId!)
    const { data: staffList } = useGetAllUsers(organizationId!, "staff")

    const projectOptions = (projectList || []).map((project: AvailableProjetType) => ({
        value: project._id,
        label: project.projectName
    }))

    const staffOptions = (staffList || []).map((staff: { _id: string; email: string; staffName: string }) => ({
        value: staff._id,
        label: staff.staffName,
        email: staff.email
    }))

    useEffect(() => {
        if (task) {
            setFormData({
                title: task?.title || "",
                description: task?.description || "",
                due: formatDateForInput(new Date(task?.due)),
                department: task.department,
                priority: task.priority,
                status: task.status,
                assigneeId: (task?.assigneeId as any)?._id || "",
                assigneeName: (task?.assigneeId as any)?.staffName || "",
                projectId: (task?.projectId as any)?._id || "",
                projectName: (task?.projectId as any)?.projectName || "",
                dependentTaskId: (task?.dependentTaskId as any) || undefined
            })
        }
    }, [task])

    const handleMainChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }



    const handleRemoveDependent = (
  i: number,
  dependents: DependentTask[] | undefined | null
) => {
  if (!dependents) return;

  const updated = dependents.filter((_, index) => index !== i);

  setFormData((prev) => ({
    ...prev,
    dependentTaskId: updated.length > 0 ? updated : undefined, // can be null too, if you prefer
  }));
};

    const handleStatuschangeStaff = async (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        let updateData = { ...formData }
        updateData.status = value

        if (isBlockedByDependencies(task?.dependentTaskId!, role)) return;

        try {
            if (!task) return
            await updateMainTask({ mainTaskId: task._id!, updates: updateData })
            refetch()
            toast({ description: 'Updated Successfully', title: "Success" })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update task",
                variant: "destructive"
            })
        }

    }


    const handleAssigneeChange = (value: string | null) => {
        const selectedAssignee = staffList?.find((staff: any) => staff._id === value)
        setFormData((prev) => ({
            ...prev,
            assigneeId: value || "",
            assigneeName: selectedAssignee?.staffName || ""
        }))
    }

    const handleProjectChange = (value: string | null) => {
        const selectedProject = projectList?.find((project: any) => project._id === value)
        setFormData((prev) => ({
            ...prev,
            projectId: value || "",
            projectName: selectedProject?.projectName || ""
        }))
    }

    const handleSaveMain = async () => {
        try {
            if (!task) return
            await updateMainTask({ mainTaskId: task._id!, updates: formData })
            refetch()
            toast({ description: 'Updated Successfully', title: "Success" })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update task",
                variant: "destructive"
            })
        }
    }

    const handleEditSubtask = async (subtaskId: string, newName: string) => {
        try {
            if (!task) return
            await updateSubTask({ mainTaskId: task._id!, subTaskId: subtaskId, taskName: newName })
            toast({ description: 'Updated Successfully', title: "Success" })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update subtask",
                variant: "destructive"
            })
        }
    }

    const handleDeleteSubtask = async (subtaskId: string) => {
        try {
            if (!task) return
            await deleteSubTask({ mainTaskId: task._id!, subTaskId: subtaskId })
            toast({ description: 'Subtask deleted', title: "Success" })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete subtask",
                variant: "destructive"
            })
        }
    }

    if (!isLoading && !task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                <i className="fas fa-clipboard text-5xl text-blue-300 mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-1">No Tasks Found</h3>
                <p className="text-sm text-gray-500">Looks like there are no tasks created yet.</p>
            </div>
        )
    }

    if (isLoading) return <MaterialOverviewLoading />

    return (
        <div className="p-2 overflow-y-auto max-h-full">
            <section className="flex items-start justify-between">
                <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)} className='bg-blue-50 hover:bg-slate-300 flex items-center justify-center w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <h1 className="text-xl sm:text-3xl font-bold text-blue-800">
                        {isStaff ? formData?.title : "View And Edit Task"}
                    </h1>
                </div>

                {isStaff && <div>
                    <Label>Update Status of Task</Label>
                    <Select
                        value={formData.status === "in_progress" ? "In progress" : formData.status}
                        onValueChange={(val) => handleStatuschangeStaff("status", val)}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue selectedValue={formData.status === "in_progress" ? "In progress" : formData.status} placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d === "in_progress" ? "In progress" : d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>}
            </section>



            {formData?.dependentTaskId && Array.isArray(formData?.dependentTaskId) && formData.dependentTaskId.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Dependent Tasks
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.dependentTaskId.map((dep: any, i:number) => (
                            <div
                                key={dep._id}
                                className="p-4 relative border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                            >

                               {!isStaff && <Button size="sm" variant="danger" className="absolute top-[10px] !right-[10px] bg-red-600 text-white" onClick={()=> handleRemoveDependent(i, formData.dependentTaskId)}>
                                    <i className="fas fa-trash-alt"></i>
                                </Button>}
                                {/* Title */}
                                <p className="font-semibold text-gray-900 text-sm mb-1 truncate w-[95%]">
                                    Title: {dep.title || "Untitled Task"}
                                </p>


                                <div className="flex gap-2 items-center mb-2">

                                    {/* Badge: Assignee */}
                                    <div className="flex items-center gap-2 ">
                                        <Badge variant="default" className="">
                                            Assigned to: {dep?.assigneeId?.staffName || "Unassigned"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            dep?.status === "done"
                                                ? "success"
                                                : dep?.status === "queued"
                                                    ? "secondary"
                                                    : dep?.status === "in_progress" || dep?.status === "paused"
                                                        ? "default"
                                                        : "secondary"
                                        } className="">
                                            {dep?.status === "in_progress" ? "In progress" : dep.status || "N/A"}
                                        </Badge>
                                    </div>
                                </div>


                                {/* Due Date */}
                                <div className="text-sm text-gray-700">
                                    Due:{" "}
                                    <span className="font-medium text-gray-800">
                                        {dep.due
                                            ? `${dateFormate(dep.due)} - ${formatTime(dep.due)}`
                                            : "N/A"}
                                    </span>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Card className="mt-4">
                {/* <CardHeader>
          <CardTitle>Task: {task?.title}</CardTitle>
        </CardHeader> */}
                <CardContent className="grid md:grid-cols-2 gap-4">
                    {/* Title */}


                    {!isStaff &&
                        <div>
                            <Label>Task Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => handleMainChange("title", e.target.value)}
                                placeholder="Task Title"
                            />
                        </div>
                    }


                    {/* Due Date */}
                    {isStaff ? (
                        <div>
                            <Label>Due</Label>
                            <p className="text-blue-800 font-medium">{formData?.due ? <>{dateFormate(formData.due)} - {formatTime(formData.due)}</> : "N/A"}</p>
                        </div>
                    ) : (
                        <div>
                            <Label>Due</Label>

                            <Input
                                value={formData.due}
                                onChange={(e) => handleMainChange("due", e.target.value)}
                                type="datetime-local"
                            />
                        </div>

                    )
                    }

                    {/* Project */}
                    {isStaff ? (
                        <div>
                            <Label>Project</Label>
                            <p className="text-blue-800 font-medium">{formData?.projectName || "N/A"}</p>
                        </div>
                    ) : (
                        <div>
                            <Label>Select Project</Label>
                            <SearchSelectNew
                                options={projectOptions}
                                placeholder="Select project"
                                searchPlaceholder="Search projects..."
                                value={formData?.projectId || undefined}
                                onValueChange={(value) => handleProjectChange(value)}
                                searchBy="name"
                                displayFormat="simple"
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* Assignee */}
                    {isStaff ? (
                        <div>
                            <Label>Assignee</Label>
                            <p className="text-blue-800 font-medium">{formData?.assigneeName || "N/A"}</p>
                        </div>
                    ) : (
                        <div>
                            <Label>Select Assignee</Label>
                            <SearchSelectNew
                                options={staffOptions}
                                placeholder="Select assignee"
                                searchPlaceholder="Search by name..."
                                value={formData?.assigneeId || undefined}
                                onValueChange={(value) => handleAssigneeChange(value)}
                                searchBy="name"
                                displayFormat="detailed"
                                className="w-full"
                            />
                        </div>
                    )}

                    {!isStaff && <div>
                        <Label>Status</Label>
                        <Select
                            value={formData.status === "in_progress" ? "In progress" : formData.status}
                            onValueChange={(val) => handleMainChange("status", val)}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue selectedValue={formData.status === "in_progress" ? "In progress" : formData.status} placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d === "in_progress" ? "In progress" : d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>}

                    {/* Priority */}
                    {isStaff ? (
                        <div>
                            <Label>Priority</Label>
                            <p className="text-blue-800 font-medium capitalize">{formData?.priority}</p>
                        </div>
                    ) : (
                        <div>
                            <Label>Priority</Label>
                            <Select
                                value={formData?.priority}
                                onValueChange={(val) => handleMainChange("priority", val)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue selectedValue={formData?.priority} placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}



                    {/* Department */}
                    {isStaff ? (
                        <div>
                            <Label>Department</Label>
                            <p className="text-blue-800 font-medium capitalize">{formData?.department}</p>
                        </div>
                    ) : (
                        <div>
                            <Label>Department</Label>
                            <Select
                                value={formData?.department}
                                onValueChange={(val) => handleMainChange("department", val)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue selectedValue={formData?.department} placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departmentOptions.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {d}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    )}



                    {/* Description */}
                    {isStaff ? (
                        <div className="md:col-span-1 ">
                            <Label>Description</Label>
                            <p className="text-blue-800">{formData?.description || "N/A"}</p>
                        </div>
                    ) : (
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData?.description}
                                onChange={(e) => handleMainChange("description", e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                    )}




                    {/* Save Button */}
                    {!isStaff && (
                        <div className="md:col-span-2 flex justify-end w-full">
                            <Button onClick={handleSaveMain} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">
                                <i className="fa-solid fa-save mr-2"></i> Save Main Task
                            </Button>
                        </div>
                    )}
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
                        isStaff ? (
                            <div key={subtask._id} className="p-3 bg-gray-50 rounded border text-blue-800 font-medium">
                                • {subtask.taskName}
                            </div>
                        ) : (
                            <SubTaskEditor
                                key={subtask._id}
                                subtask={subtask}
                                onSave={(val) => handleEditSubtask(subtask._id, val)}
                                onDelete={() => handleDeleteSubtask(subtask._id)}
                            />
                        )
                    ))}
                </CardContent>
            </Card>

            {/* Status Modal */}
            <SubtaskStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                mainTaskId={task._id!}
                task={task}
                subtasks={(task.tasks as any)}
                history={task.history!}
                role={role}
            />

            {/* Task History */}
            <Card className="mt-6">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Task History</CardTitle>
                    <Button onClick={() => setStatusModalOpen(true)} className="bg-blue-700 text-white mt-2">
                        <i className="fa fa-bolt mr-1" />
                        Update Subtask Status
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                    {(task.history as any).length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-history text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No History Found</h3>
                            <p className="text-sm text-gray-500">Looks like there are no changes made</p>
                        </div>
                    ) : (task.history as any).map((entry: any, i: number) => {
                        const statusColorMap: Record<string, string> = {
                            queued: "bg-gray-200 text-gray-800",
                            in_progress: "bg-blue-100 text-blue-800",
                            paused: "bg-yellow-100 text-yellow-800",
                            done: "bg-green-100 text-green-800",
                            start: "bg-purple-100 text-purple-800"
                        }
                        return (
                            <div key={i} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-md shadow-sm">
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
                                <div className="mt-1 text-xs text-gray-500 pl-1">
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

// SubTaskEditor Component (for Owner use only)
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

export default TaskViewMain