// DailySchedulePage.tsx
import { type FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddDailyTask, useDeleteDailyTask, useGetDailySchedule, useGetProjectWorkers, useUpdateDailyScheduleStatus, useUpdateDailyTask } from "../../../apiList/Stage Api/workScheduleApi";
import type { AddDailyTaskPayload } from "../../../types/types";
import { Button } from "../../../components/ui/Button";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import { toast } from "../../../utils/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

const DailySchedulePage: FC = () => {
  const { sectionId, projectId, organizationId } = useParams<{ sectionId: string; projectId: string, organizationId: string }>();
  const navigate = useNavigate()

  if (!sectionId) return

  const { data, isLoading, refetch, isError, error } = useGetDailySchedule(projectId!);
  const { data: workers, isLoading: getWorkersLoading } = useGetProjectWorkers(projectId!);

  const { mutateAsync: updateDailyScheduleStatus, isPending: updateDailyStatusPending } = useUpdateDailyScheduleStatus()

  const addTask = useAddDailyTask();
  const updateTask = useUpdateDailyTask();
  const deleteTask = useDeleteDailyTask();

  const [addingNew, setAddingNew] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: "",
    description: "",
    date: "",
    status: "not_started",
    assignedTo: ""
  });


  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<any>(null);

  const [dailyStatus, setDailyStatus] = useState<"pending" | "completed">("pending");
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);


  const handleStartEditStatus = () => setIsEditingStatus(true);
  
    const handleUpdateWorkStatus = async () => {
      try {
        if (!projectId || !data?._id) throw new Error("Invalid project or schedule ID");
        await updateDailyScheduleStatus({
          projectId: projectId,
          dailyScheduleId: data._id,
          payload: { status: dailyStatus },
        });
  
        toast({
          title: "Success",
          description: "Work Schedule status updated successfully.",
        });
        setIsEditingStatus(false)
        refetch();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.response?.data?.message || error.message || "Failed to update status.",
          variant: "destructive",
        });
      }
    };

  const handleAdd = async () => {
    try {
      if (!newTask.taskName?.trim()) {
        throw new Error("task Name field is mandatory")
      }
      // console.log("newTask", newTask)
      const formData = new FormData();
      formData.append("taskName", newTask.taskName);
      formData.append("description", newTask.description);
      formData.append("date", newTask.date);
      formData.append("status", newTask.status);
      formData.append("assignedTo", newTask.assignedTo);
      //     for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      // console.log("create formData", formData)
      await addTask.mutateAsync({ dailyScheduleId: sectionId, formData, projectId, });
      setAddingNew(false);
      setNewTask({
        taskName: "",
        description: "",
        date: "",
        status: "not_started",
        assignedTo: ""
      });
      toast({ title: "Success", description: "Item Saved" });
      refetch()
    }
    catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to save" });
    }

  };

  const handleUpdate = async (taskId: string) => {
    try {
      if (!editTask.taskName?.trim()) {
        throw new Error("task Name field is mandatory")
      }
      const formData = new FormData();
      formData.append("taskName", editTask.taskName);
      formData.append("description", editTask.description);
      formData.append("date", editTask.date);
      formData.append("status", editTask.status);
      formData.append("assignedTo", editTask.assignedTo);
      await updateTask.mutateAsync({ dailyScheduleId: sectionId, taskId, formData, projectId });
      setEditIndex(null);
      setEditTask(null);
      toast({ title: "Success", description: "Item updated" });
      refetch()
    }
    catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync({
        dailyScheduleId: sectionId!,
        taskId: taskId,
        projectId: projectId!
      })
      toast({ title: "Deleted", description: "Item removed" });
      refetch()
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to delete", variant: "destructive" });
    }
  };


  if (isLoading) return <RoomDetailsLoading />;

  if (isError) {
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
        <div className="text-red-600 font-semibold mb-2">
          ⚠️ Error Occurred
        </div>
        <p className="text-red-500 text-sm mb-4">
          {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
        </p>
        <Button
          onClick={() => refetch()}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    </div>
  }

  if (getWorkersLoading) {
    return <p>getting the worksrs</p>
  }
  return (

  

    <div className="max-w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 px-4">🗓️ Daily Tasks</h2>



   <div className="flex gap-2">

          <div className="flex gap-2">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Status:</span>

              {isEditingStatus ? (
                <>
                  <Select
                    value={dailyStatus}
                    onValueChange={(val) => setDailyStatus(val as "pending" | "completed")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" selectedValue={dailyStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      {["pending", "completed"].map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="primary"
                    disabled={updateDailyStatusPending}
                    onClick={handleUpdateWorkStatus}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${ data?.status=== "completed"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {data?.status}
                  </span>

                  <Button size="sm" onClick={handleStartEditStatus}>
                    <i className="fas fa-pencil"></i>
                  </Button>
                </>
              )}
            </div>

          </div>

          <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/workmainschedule`)}>
            Go Back
          </Button>

        </div>
        {/* <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/workmainschedule`)}>
          Go Back
        </Button> */}
      </div>

      {/* Horizontal Scrollable Table Container */}
      <div className="rounded-lg overflow-x-auto shadow-sm">
        <div className="min-w-[1100px]">
          {/* Table Header */}
          <div className="grid grid-cols-7 bg-blue-100 px-4 py-3 font-semibold text-blue-800 text-center text-sm">
            <div>S.No</div>
            <div>Task Name</div>
            <div>Description</div>
            <div>Date</div>
            <div>Status</div>
            <div>Assigned To</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {data?.tasks?.length > 0 ? (
            data.tasks.map((task: any, idx: number) => (
              <div
                key={task._id}
                className="grid grid-cols-7 gap-1 items-center px-4 py-2 text-center hover:bg-blue-50 transition border-b border-[#81838556]"
              >
                <div>{idx + 1}</div>

                {editIndex === idx ? (
                  <>
                    <input
                      className="border-b px-2 py-1  w-full text-sm text-center"
                      value={editTask.taskName}
                      onChange={(e) =>
                        setEditTask({ ...editTask, taskName: e.target.value })
                      }
                    />
                    <input
                      className="border-b px-2 py-1  w-full text-sm text-center"
                      value={editTask.description}
                      onChange={(e) =>
                        setEditTask({ ...editTask, description: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      className="border-b px-2 py-1  w-full text-sm text-center"
                      value={editTask.date}
                      onChange={(e) =>
                        setEditTask({ ...editTask, date: e.target.value })
                      }
                    />
                    <select
                      className="border-b px-2 py-1 text-sm text-center w-full"
                      value={editTask.status}
                      onChange={(e) =>
                        setEditTask({ ...editTask, status: e.target.value })
                      }
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      className="border-b px-2 py-1  text-sm text-center w-full"
                      value={editTask.assignedTo}
                      onChange={(e) =>
                        setEditTask({ ...editTask, assignedTo: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {workers?.map((w: { _id: string, workerName: string, email: string }) => (
                        <option key={w._id} value={w._id}>{w.workerName}</option>
                      ))}
                    </select>
                    <div className="flex justify-center gap-2">
                      <Button
                        isLoading={updateTask.isPending}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                        onClick={() => handleUpdate(task._id)}
                      >
                        Save
                      </Button>
                      <button
                        className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded"
                        onClick={() => {
                          setEditIndex(null);
                          setEditTask(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{task.taskName || "N/A"}</div>
                    <div>{task.description || "N/A"}</div>
                    <div>{task.date || "N/A"}</div>
                    <div className="capitalize">{task?.status?.replace('_', ' ') || "N/A"}</div>
                    <div>
                      {
                        workers?.find((w: { _id: string, workerName: string, email: string }) => w?._id === (task?.assignedTo as any)?._id)?.workerName || "Not Assigned"}
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                        onClick={() => {
                          setEditIndex(idx);
                          setEditTask(task);
                        }}
                      >
                        Edit
                      </button>
                      <Button
                        isLoading={deleteTask.isPending}
                        // className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : !addingNew ? (
            <div className="text-center text-gray-600 py-6">
              No tasks created yet.
              <br />
              <Button
                variant="primary"
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                onClick={() => setAddingNew(true)}
              >
                <i className="fas fa-plus mr-1" />
                Add First Task
              </Button>
            </div>
          ) : null}

          {/* ================================================== */}
          {/* Add New Task Row */}
          {addingNew && (
            <div className="grid grid-cols-7 items-center gap-2 px-4 py-3 text-center bg-white">
              <div>{!data?.tasks?.length ? 1 : data.tasks.length + 1}</div>
              <input
                className="border-b px-2 py-1  w-full text-sm"
                value={newTask.taskName}
                onChange={(e) =>
                  setNewTask({ ...newTask, taskName: e.target.value })
                }
              />
              <input
                className="border-b px-2 py-1  w-full text-sm"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <input
                type="date"
                className="border-b px-2 py-1  w-full text-sm text-center"
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
              />
              <select
                className="border-b px-2 py-1  text-sm text-center w-full"
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="border-b px-2 py-1 text-sm text-center w-full"
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              >
                <option value="">Select</option>
                {workers?.map((w: { _id: string, workerName: string, email: string }) => (
                  <option key={w?._id} value={w?._id}>{w.workerName}</option>
                ))}
              </select>
              <div className="flex justify-center gap-2">
                <Button
                  variant="primary"
                  isLoading={addTask.isPending}
                  // className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                  onClick={handleAdd}
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  className=""
                  onClick={() => setAddingNew(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      {!addingNew && data?.tasks?.length > 0 && (
        <div className="text-left mt-6">
          <Button
            size="md"
            variant="primary"
            // className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            onClick={() => setAddingNew(true)}
          >
            <i className="fas fa-plus mr-1" />
            Add Task
          </Button>
        </div>
      )}
    </div>



  );
}

export default DailySchedulePage;
