import React from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../../components/ui/Dialog"

import { Button } from "../../components/ui/Button"
import { useUpdateTaskHistory } from "../../apiList/StaffTasks Api/staffTaskApi"
import { toast } from "../../utils/toast"
import { isBlockedByDependencies, type SingleMainTaskForm } from "./TaskViewMain"

interface TaskHistory {
    subTask: string | null
    status: string
    changedAt: string
}

interface Subtask {
    _id: string
    taskName: string
}

interface Props {
    isOpen: boolean
    onClose: () => void
    mainTaskId: string
    subtasks: Subtask[]
    task: SingleMainTaskForm
    history: TaskHistory[]
    role: string | null
}

const SubtaskStatusModal: React.FC<Props> = ({
    isOpen,
    onClose,
    task,
    mainTaskId,
    subtasks,
    role
    // history
}) => {
    const { mutateAsync: updateStatus, isPending } = useUpdateTaskHistory()

    // const getLatestStatus = (subTaskId: string) => {
    //     const subHistories = history
    //         .filter((h: any) => h.subTask === subTaskId)
    //         .sort(
    //             (a, b) =>
    //                 new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    //         )

    //     return {
    //         status: subHistories[0]?.status || "queued",
    //         changedAt: subHistories[0]?.changedAt
    //             ? new Date(subHistories[0].changedAt).toLocaleString()
    //             : "N/A"
    //     }
    // }

    const updateSubtaskStatus = async (
        subTaskId: string,
        status: string,
        taskName: string
    ) => {
        try {

            if (isBlockedByDependencies(task?.dependentTaskId!, role)) return;
            await updateStatus({
                mainTaskId,
                subTaskId,
                status,
                subTask: taskName
            })
            toast({ description: 'Updated Successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update completion status",
                variant: "destructive"
            });

        }
    }

        return (
            <div className="px-2 bg-white ">

            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Subtask Status</DialogTitle>
                        <DialogDescription>
                            Update status of each subtask and log changes.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="divide-y divide-gray-200 px-5">
                        {subtasks.map((sub) => {
                            // const { status, changedAt } = getLatestStatus(sub._id)

                            return (
                                <div
                                    key={sub._id}
                                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800">
                                            {sub?.taskName || "-"}
                                        </h4>
                                        {/* <p className="text-xs text-gray-500">
                                            Status:{" "}
                                            <span className="capitalize font-bold">{status}</span> | Last update: {changedAt}
                                        </p> */}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() =>
                                                updateSubtaskStatus(sub._id, "start", sub.taskName)
                                            }
                                            className="bg-blue-600 text-white"
                                            isLoading={isPending}
                                        >
                                            <i className="fa fa-play mr-1" /> Start
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateSubtaskStatus(sub._id, "paused", sub.taskName)
                                            }
                                            className="bg-yellow-500 text-white"
                                            isLoading={isPending}
                                        >
                                            <i className="fa fa-pause mr-1" /> Pause
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateSubtaskStatus(sub._id, "done", sub.taskName)
                                            }
                                            className="bg-green-600 text-white"
                                            isLoading={isPending}
                                        >
                                            <i className="fa fa-check mr-1" /> Done
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            variant="secondary"
                            className=""
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>

        )
    }

    export default SubtaskStatusModal