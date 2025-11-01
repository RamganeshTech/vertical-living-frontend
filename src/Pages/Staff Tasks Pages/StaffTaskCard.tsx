import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { useDeleteMainTask } from '../../apiList/StaffTasks Api/staffTaskApi'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { dateFormate, formatTime } from './../../utils/dateFormator';
// import useGetRole from '../../Hooks/useGetRole'
import { toast } from '../../utils/toast'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import type { MainStaffTaskForm } from './Create Task Pages/StaffAssignTaskMain'

type Props = {
    task: MainStaffTaskForm
}
const StaffTaskCard: React.FC<Props> = ({ task }) => {
    const navigate = useNavigate()
    const { _id: staffId, role } = useSelector((state: RootState) => state.authStore)
    // const { role } = useGetRole()
    const isStaff = role === "staff"

    const { mutateAsync: deleteTask, isPending: deletePending } = useDeleteMainTask()

    const handleDelete = async (taskId: string) => {
        try {
            await deleteTask({ mainTaskId: taskId })
            toast({ description: 'Task Deleted Successfully', title: "Success" })
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete task", variant: "destructive" })
        }
    }

    const isAssociatedStaff = staffId === (task.assigneeId as any)?._id

    const handleView = (taskId: string) => {
        // If the user is a staff member but not associated with this task,
        // do nothing (no navigation)
        if (role === "staff" && !isAssociatedStaff) {
            return;
        } else {
            navigate(`single/${taskId}`)
        }
    }

    const statusOption = (status: string) => {
        // "queued", "in_progress", "paused", "done"
        switch (status) {
            case "queued":
            case "puased":
            case "done":
                return status;
            case "in_progress":
                return "In Progress";

            default:
                return "queued";
        }
    }


    return (
        <Card key={task._id} onClick={() => handleView(task._id!)}
            // className="cursor-pointer p-0 border-l-4 border-blue-600"
            className={`${role !== "staff" || isAssociatedStaff ? "cursor-pointer" : "cursor-not-allowed"} p-0 border-l-4 border-blue-600`}
        >
            <CardHeader>
                <CardTitle>{task?.title.trim() || "No title"}</CardTitle>
                {/* <CardDescription className="text-xs mt-1">{task.description}</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm">
                    <i className="fa-solid fa-calendar-days mr-2 text-blue-600" />
                    {/* Due  const isStaff = role === "staff": {dateFormate(task.due) - `${new Date(task.due).slice(11)}`} */}
                    Due: {task.due ? <>{dateFormate(task.due)} - {formatTime(task?.due)} </> : <>N/A</>}

                </p>
                <p className="text-sm">
                    <i className="fa-solid fa-layer-group mr-2 text-purple-600" />
                    assignee: {(task?.assigneeId as any)?.staffName || "N/A"}
                </p>
                {/* <p className="text-sm capitalize">
                    <i className="fa-solid fa-star mr-2 text-yellow-500" />
                    Priority: {task.priority}
                </p> */}

                <p className="text-sm capitalize">
                    <i className="fa-solid fa-chart-line mr-2 text-yellow-500" />
                    Status: {statusOption(task.status)}
                </p>
                <p className="text-sm capitalize">
                    <i className="fa-solid fa-building mr-2 text-indigo-500" />
                    Department: {task.department}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3 justify-end">
                    {/* <Button
                                            size='sm'
                                                onClick={() => handleView(task._id)}
                                                className=""
                                            >
                                                <i className="fa-solid fa-eye mr-1" />
                                                View
                                            </Button> */}

                    {!isStaff && <Button
                        size='sm'
                        onClick={(e) => {
                            e.stopPropagation()

                            handleDelete(task._id!)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        isLoading={deletePending}
                    >
                        <i className="fa-solid fa-trash mr-1" />
                        Delete
                    </Button>
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default StaffTaskCard