// DailySchedulePage.tsx
import { type FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useAddDailyTask, useDeleteDailyTask, useGetDailySchedule, useGetProjectWorkers, useUpdateDailyTask } from "../../../apiList/Stage Api/workScheduleApi";
import type { AddDailyTaskPayload } from "../../../types/types";

const DailySchedulePage: FC = () => {
  const { sectionId, projectId } = useParams<{ sectionId: string; projectId: string }>();

  if(!sectionId) return

 const { data, isLoading } = useGetDailySchedule(projectId!);
  const { data: workers } = useGetProjectWorkers(data?.projectId || "");
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

  const handleAdd = () => {
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
    addTask.mutate({ dailyScheduleId: sectionId, formData });
    setAddingNew(false);
    setNewTask({
      taskName: "",
      description: "",
      date: "",
      status: "not_started",
      assignedTo: ""
    });
  };

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<any>(null);

  const handleUpdate = (taskId: string) => {
    const formData = new FormData();
    formData.append("taskName", editTask.taskName);
    formData.append("description", editTask.description);
    formData.append("date", editTask.date);
    formData.append("status", editTask.status);
    formData.append("assignedTo", editTask.assignedTo);
    updateTask.mutate({ dailyScheduleId: sectionId, taskId, formData });
    setEditIndex(null);
    setEditTask(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-full">
  <h2 className="text-2xl font-bold text-blue-700 mb-4 ">🗓️ Daily Tasks</h2>

  <div className=" rounded-lg overflow-x-auto shadow-sm">
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
          className="grid grid-cols-7 items-center px-4 py-2  text-center hover:bg-blue-50 transition"
        >
          <div>{idx + 1}</div>

          {editIndex === idx ? (
            <>
              <input
                className="border px-2 py-1 rounded w-full text-sm text-center"
                value={editTask.taskName}
                onChange={(e) => setEditTask({ ...editTask, taskName: e.target.value })}
              />
              <input
                className="border px-2 py-1 rounded w-full text-sm text-center"
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              />
              <input
                type="date"
                className="border px-2 py-1 rounded w-full text-sm text-center"
                value={editTask.date}
                onChange={(e) => setEditTask({ ...editTask, date: e.target.value })}
              />
              <select
                className="border px-2 py-1 rounded text-sm text-center w-full"
                value={editTask.status}
                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="border px-2 py-1 rounded text-sm text-center w-full"
                value={editTask.assignedTo}
                onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
              >
                <option value="">Select</option>
                {workers?.map((w: any) => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
              <div className="flex justify-center gap-2">
                <button
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                  onClick={() => handleUpdate(task._id)}
                >
                  Save
                </button>
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
              <div>{task.taskName}</div>
              <div>{task.description}</div>
              <div>{task.date}</div>
              <div className="capitalize">{task.status.replace('_', ' ')}</div>
              <div>{workers?.find((w: any) => w._id === task.assignedTo)?.name || "-"}</div>
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
                <button
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                  onClick={() => deleteTask.mutate({ dailyScheduleId: sectionId, taskId: task._id })}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))
    ) : !addingNew ? (
      <div className="text-center text-gray-600 py-6">
        No tasks created yet.
        <br />
        <button
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          onClick={() => setAddingNew(true)}
        >
          ➕ Add First Task
        </button>
      </div>
    ) : null}

    {/* Add New Task Row */}
    {addingNew && (
      <div className="grid grid-cols-7 items-center px-4 py-3 border-t text-center bg-white">
        <div>{!data?.tasks?.length ? 1 : data.tasks.length + 1}</div>
        <input
          className="border px-2 py-1 rounded w-full text-sm"
          value={newTask.taskName}
          onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
        />
        <input
          className="border px-2 py-1 rounded w-full text-sm"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded w-full text-sm text-center"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
        />
        <select
          className="border px-2 py-1 rounded text-sm text-center w-full"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="border px-2 py-1 rounded text-sm text-center w-full"
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        >
          <option value="">Select</option>
          {workers?.map((w: any) => (
            <option key={w._id} value={w._id}>{w.name}</option>
          ))}
        </select>
        <div className="flex justify-center gap-2">
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded"
            onClick={() => setAddingNew(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Add Task CTA Button (only show if not already adding) */}
  {!addingNew && data?.tasks?.length > 0 && (
    <div className="text-center mt-6">
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        onClick={() => setAddingNew(true)}
      >
        ➕ Add Task
      </button>
    </div>
  )}
</div>
  );
}

export default DailySchedulePage;
