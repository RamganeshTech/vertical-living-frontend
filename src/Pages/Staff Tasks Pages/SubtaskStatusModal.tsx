// import React from "react";

// import { useUpdateTaskHistory } from "../../apiList/StaffTasks Api/staffTaskApi";
// import { Dialog, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
// import { Button } from "../../components/ui/Button";

// interface TaskHistory {
//   subTask: string | null;
//   status: string;
//   changedAt: string;
// }

// interface Subtask {
//   _id: string;
//   taskName: string;
// }

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   mainTaskId: string;
//   subtasks: Subtask[];
//   history: TaskHistory[];
// }

// const SubtaskStatusModal: React.FC<Props> = ({ isOpen, onClose, mainTaskId, subtasks, history }) => {
//   const { mutate: updateStatus, isPending } = useUpdateTaskHistory();

//   const getLatestStatus = (subTaskId: string) => {
//     const subHistories = history
//       .filter((h: any) => h.subTask === subTaskId)
//       .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

//     return {
//       status: subHistories[0]?.status || "queued",
//       changedAt: subHistories[0]?.changedAt
//         ? new Date(subHistories[0].changedAt).toLocaleString()
//         : "N/A",
//     };
//   };

//   const updateSubtaskStatus = (subTaskId: string, status: string, taskName: string) => {
//     updateStatus({
//       mainTaskId,
//       subTaskId,
//       status,
//       subTask: taskName
//     });
//   };

//   return (
//     <Dialog open={isOpen}  className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 bg-black/50">
//         <DialogHeader className="bg-white w-full max-w-3xl rounded-xl p-6 shadow">
//           <DialogTitle className="text-xl font-bold text-blue-900 mb-4">
//             Manage Subtask Status
//           </DialogTitle>
//           </DialogHeader>

//           <div className="divide-y">
//             {subtasks.map((sub) => {
//               const { status, changedAt } = getLatestStatus(sub._id);

//               return (
//                 <div key={sub._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-800">{sub.taskName}</h4>
//                     <p className="text-xs text-gray-500">
//                       Status: <span className="capitalize font-bold">{status}</span> | Last update: {changedAt}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={() => updateSubtaskStatus(sub._id, "in_progress", sub.taskName)}
//                       className="bg-blue-600 text-white"
//                     >
//                       <i className="fa fa-play mr-1" /> Start
//                     </Button>
//                     <Button
//                       onClick={() => updateSubtaskStatus(sub._id, "paused", sub.taskName)}
//                       className="bg-yellow-500 text-white"
//                     >
//                       <i className="fa fa-pause mr-1" /> Pause
//                     </Button>
//                     <Button
//                       onClick={() => updateSubtaskStatus(sub._id, "done", sub.taskName)}
//                       className="bg-green-600 text-white"
//                     >
//                       <i className="fa fa-check mr-1" /> Done
//                     </Button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="text-right mt-4">
//             <Button onClick={onClose} className="bg-gray-300 text-blue-900 hover:bg-gray-400">
//               Close
//             </Button>
//           </div>
//         </Dialog>
//       </div>
//     </Dialog>
//   );
// };

// export default SubtaskStatusModal;




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
    history: TaskHistory[]
}

const SubtaskStatusModal: React.FC<Props> = ({
    isOpen,
    onClose,
    mainTaskId,
    subtasks,
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
                                            disabled={isPending}
                                        >
                                            <i className="fa fa-play mr-1" /> Start
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateSubtaskStatus(sub._id, "paused", sub.taskName)
                                            }
                                            className="bg-yellow-500 text-white"
                                            disabled={isPending}
                                        >
                                            <i className="fa fa-pause mr-1" /> Pause
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateSubtaskStatus(sub._id, "done", sub.taskName)
                                            }
                                            className="bg-green-600 text-white"
                                            disabled={isPending}
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