// "use client";
// import React from "react";
// import { useParams } from "react-router-dom";
// import {
//   useGetDailySchedule,
//   useAddDailyTask,
//   useUpdateDailyTask,
//   useDeleteDailyTask,
//   useGetProjectWorkers,
// } from "../../../apiList/Stage Api/workScheduleApi";

// export default function DailySchedulePage() {
//   const { sectionId } = useParams<{ sectionId: string }>();
//   const { data: dailySchedules } = useGetDailySchedule(sectionId!);
//   const { data: workers } = useGetProjectWorkers(sectionId!);

//   const addTask = useAddDailyTask();
//   const updateTask = useUpdateDailyTask();
//   const deleteTask = useDeleteDailyTask();

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Daily Tasks</h2>
//       <div className="max-h-[400px] overflow-y-auto border rounded p-4 space-y-4">
//         {dailySchedules?.[0]?.tasks?.map((task:any) => (
//           <div key={task._id} className="border p-4 rounded shadow">
//             <p className="font-semibold">{task.taskName}</p>
//             <p>Date: {task.date}</p>
//             <p>Description: {task.description}</p>
//             <p>Status: {task.status}</p>
//             <select
//               value={task.assignedTo || ""}
//               onChange={(e) =>
//                 updateTask.mutate({
//                   dailyScheduleId: dailySchedules[0]._id,
//                   taskId: task._id,
//                   updates: { assignedTo: e.target.value },
//                 })
//               }
//               className="border rounded p-2"
//             >
//               <option value="">Select Worker</option>
//               {workers?.map((w:any) => (
//                 <option key={w._id} value={w._id}>{w.name}</option>
//               ))}
//             </select>
//             <button
//               onClick={() =>
//                 deleteTask.mutate({
//                   dailyScheduleId: dailySchedules[0]._id,
//                   taskId: task._id,
//                 })
//               }
//               className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





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
    // <div className="max-w-full p-4">
    //   <h2 className="text-2xl font-semibold mb-4">Daily Tasks</h2>

    //   <div className="flex flex-col border rounded overflow-x-auto">
    //     {/* Headings */}
    //     <div className="grid grid-cols-7 bg-gray-200 p-2 font-semibold">
    //       <div className="text-center">S.No</div>
    //       <div>Task Name</div>
    //       <div>Description</div>
    //       <div>Date</div>
    //       <div>Status</div>
    //       <div>Assigned To</div>
    //       <div>Actions</div>
    //     </div>

    //     {data?.tasks?.length > 0 ? (
    //       data.tasks.map((task:any, idx:number) => (
    //         <div
    //           key={task._id}
    //           className="grid grid-cols-7 border-b p-2 items-center"
    //         >
    //           <div className="text-center">{idx + 1}</div>
    //           {editIndex === idx ? (
    //             <>
    //               <input
    //                 className="border p-1"
    //                 value={editTask.taskName}
    //                 onChange={(e) => setEditTask({ ...editTask, taskName: e.target.value })}
    //               />
    //               <input
    //                 className="border p-1"
    //                 value={editTask.description}
    //                 onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
    //               />
    //               <input
    //                 className="border p-1"
    //                 type="date"
    //                 value={editTask.date}
    //                 onChange={(e) => setEditTask({ ...editTask, date: e.target.value })}
    //               />
    //               <select
    //                 className="border p-1"
    //                 value={editTask.status}
    //                 onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
    //               >
    //                 <option value="not_started">Not Started</option>
    //                 <option value="in_progress">In Progress</option>
    //                 <option value="completed">Completed</option>
    //               </select>
    //               <select
    //                 className="border p-1"
    //                 value={editTask.assignedTo}
    //                 onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
    //               >
    //                 <option value="">Select</option>
    //                 {workers?.map((w:any) => (
    //                   <option key={w._id} value={w._id}>{w.name}</option>
    //                 ))}
    //               </select>
    //               <div className="flex gap-2">
    //                 <button
    //                   className="px-2 py-1 bg-green-500 text-white rounded"
    //                   onClick={() => handleUpdate(task._id)}
    //                 >
    //                   Save
    //                 </button>
    //                 <button
    //                   className="px-2 py-1 bg-gray-400 text-white rounded"
    //                   onClick={() => {
    //                     setEditIndex(null);
    //                     setEditTask(null);
    //                   }}
    //                 >
    //                   Cancel
    //                 </button>
    //               </div>
    //             </>
    //           ) : (
    //             <>
    //               <div>{task.taskName}</div>
    //               <div>{task.description}</div>
    //               <div>{task.date}</div>
    //               <div>{task.status}</div>
    //               <div>{workers?.find((w:any) => w._id === task.assignedTo)?.name || "-"}</div>
    //               <div className="flex gap-2">
    //                 <button
    //                   className="px-2 py-1 bg-blue-500 text-white rounded"
    //                   onClick={() => {
    //                     setEditIndex(idx);
    //                     setEditTask(task);
    //                   }}
    //                 >
    //                   Edit
    //                 </button>
    //                 <button
    //                   className="px-2 py-1 bg-red-500 text-white rounded"
    //                   onClick={() => deleteTask.mutate({ dailyScheduleId: sectionId, taskId: task._id })}
    //                 >
    //                   Delete
    //                 </button>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       ))
    //     ) : (
    //       <div className="p-4 text-center">
    //         No tasks created yet.
    //         <button
    //           className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded"
    //           onClick={() => setAddingNew(true)}
    //         >
    //           Add First Task
    //         </button>
    //       </div>
    //     )}

    //     {addingNew && (
    //       <div className="grid grid-cols-7 border-t p-2 items-center">
    //         <div>
    //            {!data?.tasks?.length ? 1 : data?.tasks?.length + 1}
    //         </div>
    //         <input
    //           className="border p-1"
    //           value={newTask.taskName}
    //           onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
    //         />
    //         <input
    //           className="border p-1"
    //           value={newTask.description}
    //           onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
    //         />
    //         <input
    //           className="border p-1"
    //           type="date"
    //           value={newTask.date}
    //           onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
    //         />
    //         <select
    //           className="border p-1"
    //           value={newTask.status}
    //           onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
    //         >
    //           <option value="not_started">Not Started</option>
    //           <option value="in_progress">In Progress</option>
    //           <option value="completed">Completed</option>
    //         </select>
    //         <select
    //           className="border p-1"
    //           value={newTask.assignedTo}
    //           onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
    //         >
    //           <option value="">Select</option>
    //           {workers?.map((w:any) => (
    //             <option key={w._id} value={w._id}>{w.name}</option>
    //           ))}
    //         </select>
    //         <div className="flex gap-2">
    //           <button
    //             className="px-2 py-1 bg-green-500 text-white rounded"
    //             onClick={handleAdd}
    //           >
    //             Add
    //           </button>
    //           <button
    //             className="px-2 py-1 bg-gray-400 text-white rounded"
    //             onClick={() => setAddingNew(false)}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {!addingNew && data?.tasks?.length > 0 && (
    //     <button
    //       className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    //       onClick={() => setAddingNew(true)}
    //     >
    //       Add Task
    //     </button>
    //   )}
    // </div>


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
