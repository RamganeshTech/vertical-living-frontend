// // DailySchedulePage.tsx
// import { type FC, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAddDailyTask, useDeleteDailyTask, useGetDailySchedule, useGetProjectWorkers,
//   //  useUpdateDailyScheduleStatus, 
//    useUpdateDailyTask } from "../../../apiList/Stage Api/workScheduleApi";
// import { Button } from "../../../components/ui/Button";
// import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
// import { toast } from "../../../utils/toast";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

// const DailySchedulePage: FC = () => {
//   const { sectionId, projectId, organizationId } = useParams<{ sectionId: string; projectId: string, organizationId: string }>();
//   const navigate = useNavigate()

//   if (!sectionId) return

//   const { data, isLoading, refetch, isError, error } = useGetDailySchedule(projectId!);
//   const { data: workers, isLoading: getWorkersLoading } = useGetProjectWorkers(projectId!);

//   // const { mutateAsync: updateDailyScheduleStatus, isPending: updateDailyStatusPending } = useUpdateDailyScheduleStatus()

//   const addTask = useAddDailyTask();
//   const updateTask = useUpdateDailyTask();
//   const deleteTask = useDeleteDailyTask();

//   const [addingNew, setAddingNew] = useState(false);
//   const [newTask, setNewTask] = useState({
//     taskName: "",
//     description: "",
//     date: "",
//     status: "not_started",
//     assignedTo: ""
//   });


//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [editTask, setEditTask] = useState<any>(null);

//   // const [dailyStatus, setDailyStatus] = useState<"pending" | "submitted">("pending");
//   // const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);


//   // const handleStartEditStatus = () => setIsEditingStatus(true);

//     // const handleUpdateWorkStatus = async () => {
//     //   try {
//     //     if (!projectId || !data?._id) throw new Error("Invalid project or schedule ID");
//     //     await updateDailyScheduleStatus({
//     //       projectId: projectId,
//     //       dailyScheduleId: data._id,
//     //       payload: { status: dailyStatus },
//     //     });

//     //     toast({
//     //       title: "Success",
//     //       description: "Work Schedule status updated successfully.",
//     //     });
//     //     setIsEditingStatus(false)
//     //     refetch();
//     //   } catch (error: any) {
//     //     toast({
//     //       title: "Error",
//     //       description: error?.response?.data?.message || error.message || "Failed to update status.",
//     //       variant: "destructive",
//     //     });
//     //   }
//     // };

//   const handleAdd = async () => {
//     try {
//       if (!newTask.taskName?.trim()) {
//         throw new Error("task Name field is mandatory")
//       }
//       const formData = new FormData();
//       formData.append("taskName", newTask.taskName);
//       formData.append("description", newTask.description);
//       formData.append("date", newTask.date);
//       formData.append("status", newTask.status);
//       formData.append("assignedTo", newTask.assignedTo);

//       await addTask.mutateAsync({ dailyScheduleId: sectionId, formData, projectId, });
//       setAddingNew(false);
//       setNewTask({
//         taskName: "",
//         description: "",
//         date: "",
//         status: "not_started",
//         assignedTo: ""
//       });
//       toast({ title: "Success", description: "Item Saved" });
//       refetch()
//     }
//     catch (error: any) {
//       toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to save" });
//     }

//   };

//   const handleUpdate = async (taskId: string) => {
//     try {
//       if (!editTask.taskName?.trim()) {
//         throw new Error("task Name field is mandatory")
//       }
//       const formData = new FormData();
//       formData.append("taskName", editTask.taskName);
//       formData.append("description", editTask.description);
//       formData.append("date", editTask.date);
//       formData.append("status", editTask.status);
//       formData.append("assignedTo", editTask.assignedTo);
//       await updateTask.mutateAsync({ dailyScheduleId: sectionId, taskId, formData, projectId });
//       setEditIndex(null);
//       setEditTask(null);
//       toast({ title: "Success", description: "Item updated" });
//       refetch()
//     }
//     catch (error: any) {
//       toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
//     }
//   };

//   const handleDelete = async (taskId: string) => {
//     try {
//       await deleteTask.mutateAsync({
//         dailyScheduleId: sectionId!,
//         taskId: taskId,
//         projectId: projectId!
//       })
//       toast({ title: "Deleted", description: "Item removed" });
//       refetch()
//     } catch (err: any) {
//       toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to delete", variant: "destructive" });
//     }
//   };


//   if (isLoading) return <RoomDetailsLoading />;

//   if (isError) {
//     <div className="flex-1 flex items-center justify-center">
//       <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//         <div className="text-red-600 font-semibold mb-2">
//           ⚠️ Error Occurred
//         </div>
//         <p className="text-red-500 text-sm mb-4">
//           {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
//         </p>
//         <Button
//           onClick={() => refetch()}
//           className="bg-red-600 text-white hover:bg-red-700"
//         >
//           Retry
//         </Button>
//       </div>
//     </div>
//   }

//   if (getWorkersLoading) {
//     return <p>getting the worksrs</p>
//   }
//   return (



//     <div className="max-w-full">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-blue-700 mb-4 px-4">🗓️ Daily Tasks</h2>



//    <div className="flex gap-2">

//           <div className="flex gap-2">
//            {/* <div className="flex items-center gap-4">
//               <span className="text-gray-700 font-medium">Status:</span>

//               {isEditingStatus ? (
//                 <>
//                   <Select
//                     value={dailyStatus}
//                     onValueChange={(val) => setDailyStatus(val as "pending" | "submitted")}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" selectedValue={dailyStatus} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {["pending", "submitted"].map((opt) => (
//                         <SelectItem key={opt} value={opt}>
//                           {opt}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Button
//                     size="sm"
//                     variant="primary"
//                     disabled={updateDailyStatusPending}
//                     onClick={handleUpdateWorkStatus}
//                   >
//                     Save
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <span
//                     className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${ data?.status=== "submitted"
//                         ? "bg-green-200 text-green-700"
//                         : "bg-yellow-100 text-yellow-800"
//                       }`}
//                   >
//                     {data?.status}
//                   </span>

//                   <Button size="sm" onClick={handleStartEditStatus}>
//                     <i className="fas fa-pencil"></i>
//                   </Button>
//                 </>
//               )}
//             </div>
//            */}

//           </div>

//           <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/workmainschedule`)}>
//             Go Back
//           </Button>

//         </div>
//         {/* <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/workmainschedule`)}>
//           Go Back
//         </Button> */}
//       </div>

//       {/* Horizontal Scrollable Table Container */}
//       <div className="rounded-lg overflow-x-auto shadow-sm">
//         <div className="min-w-[1100px]">
//           {/* Table Header */}
//           <div className="grid grid-cols-7 bg-blue-100 px-4 py-3 font-semibold text-blue-800 text-center text-sm">
//             <div>S.No</div>
//             <div>Task Name</div>
//             <div>Description</div>
//             <div>Date</div>
//             <div>Status</div>
//             <div>Assigned To</div>
//             <div>Actions</div>
//           </div>

//           {/* Table Rows */}
//           {data?.tasks?.length > 0 ? (
//             data.tasks.map((task: any, idx: number) => (
//               <div
//                 key={task._id}
//                 className="grid grid-cols-7 gap-1 items-center px-4 py-2 text-center hover:bg-blue-50 transition border-b border-[#81838556]"
//               >
//                 <div>{idx + 1}</div>

//                 {editIndex === idx ? (
//                   <>
//                     <input
//                       className="border-b px-2 py-1  w-full text-sm text-center"
//                       value={editTask.taskName}
//                       onChange={(e) =>
//                         setEditTask({ ...editTask, taskName: e.target.value })
//                       }
//                     />
//                     <input
//                       className="border-b px-2 py-1  w-full text-sm text-center"
//                       value={editTask.description}
//                       onChange={(e) =>
//                         setEditTask({ ...editTask, description: e.target.value })
//                       }
//                     />
//                     <input
//                       type="date"
//                       className="border-b px-2 py-1  w-full text-sm text-center"
//                       value={editTask.date}
//                       onChange={(e) =>
//                         setEditTask({ ...editTask, date: e.target.value })
//                       }
//                     />
//                     <select
//                       className="border-b px-2 py-1 text-sm text-center w-full"
//                       value={editTask.status}
//                       onChange={(e) =>
//                         setEditTask({ ...editTask, status: e.target.value })
//                       }
//                     >
//                       <option value="not_started">Not Started</option>
//                       <option value="pending">In Progress</option>
//                       <option value="submitted">submitted</option>
//                     </select>
//                     <select
//                       className="border-b px-2 py-1  text-sm text-center w-full"
//                       value={editTask.assignedTo}
//                       onChange={(e) =>
//                         setEditTask({ ...editTask, assignedTo: e.target.value })
//                       }
//                     >
//                       <option value="">Select</option>
//                       {workers?.map((w: { _id: string, workerName: string, email: string }) => (
//                         <option key={w._id} value={w._id}>{w.workerName}</option>
//                       ))}
//                     </select>
//                     <div className="flex justify-center gap-2">
//                       <Button
//                         isLoading={updateTask.isPending}
//                         className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
//                         onClick={() => handleUpdate(task._id)}
//                       >
//                         Save
//                       </Button>
//                       <button
//                         className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded"
//                         onClick={() => {
//                           setEditIndex(null);
//                           setEditTask(null);
//                         }}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div>{task.taskName || "N/A"}</div>
//                     <div>{task.description || "N/A"}</div>
//                     <div>{task.date || "N/A"}</div>
//                     <div className="capitalize">{task?.status?.replace('_', ' ') || "N/A"}</div>
//                     <div>
//                       {
//                         workers?.find((w: { _id: string, workerName: string, email: string }) => w?._id === (task?.assignedTo as any)?._id)?.workerName || "Not Assigned"}
//                     </div>
//                     <div className="flex justify-center gap-2">
//                       <button
//                         className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
//                         onClick={() => {
//                           setEditIndex(idx);
//                           setEditTask(task);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <Button
//                         isLoading={deleteTask.isPending}
//                         // className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
//                         onClick={() => handleDelete(task._id)}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))
//           ) : !addingNew ? (
//             <div className="text-center text-gray-600 py-6">
//               No tasks created yet.
//               <br />
//               <Button
//                 variant="primary"
//                 className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
//                 onClick={() => setAddingNew(true)}
//               >
//                 <i className="fas fa-plus mr-1" />
//                 Add First Task
//               </Button>
//             </div>
//           ) : null}

//           {/* ================================================== */}
//           {/* Add New Task Row */}
//           {addingNew && (
//             <div className="grid grid-cols-7 items-center gap-2 px-4 py-3 text-center bg-white">
//               <div>{!data?.tasks?.length ? 1 : data.tasks.length + 1}</div>
//               <input
//                 className="border-b px-2 py-1  w-full text-sm"
//                 value={newTask.taskName}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, taskName: e.target.value })
//                 }
//               />
//               <input
//                 className="border-b px-2 py-1  w-full text-sm"
//                 value={newTask.description}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, description: e.target.value })
//                 }
//               />
//               <input
//                 type="date"
//                 className="border-b px-2 py-1  w-full text-sm text-center"
//                 value={newTask.date}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, date: e.target.value })
//                 }
//               />
//               <select
//                 className="border-b px-2 py-1  text-sm text-center w-full"
//                 value={newTask.status}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, status: e.target.value })
//                 }
//               >
//                 <option value="not_started">Not Started</option>
//                 <option value="pending">In Progress</option>
//                 <option value="submitted">submitted</option>
//               </select>
//               <select
//                 className="border-b px-2 py-1 text-sm text-center w-full"
//                 value={newTask.assignedTo}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, assignedTo: e.target.value })
//                 }
//               >
//                 <option value="">Select</option>
//                 {workers?.map((w: { _id: string, workerName: string, email: string }) => (
//                   <option key={w?._id} value={w?._id}>{w.workerName}</option>
//                 ))}
//               </select>
//               <div className="flex justify-center gap-2">
//                 <Button
//                   variant="primary"
//                   isLoading={addTask.isPending}
//                   // className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
//                   onClick={handleAdd}
//                 >
//                   Add
//                 </Button>
//                 <Button
//                   variant="secondary"
//                   className=""
//                   onClick={() => setAddingNew(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CTA */}
//       {!addingNew && data?.tasks?.length > 0 && (
//         <div className="text-left mt-6">
//           <Button
//             size="md"
//             variant="primary"
//             // className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
//             onClick={() => setAddingNew(true)}
//           >
//             <i className="fas fa-plus mr-1" />
//             Add Task
//           </Button>
//         </div>
//       )}
//     </div>



//   );
// }

// export default DailySchedulePage;


// THIRD ONE 

// import type React from "react"
// import { useState } from "react"
// import { useParams } from "react-router-dom"
// import {
//   useCreateWork,
//   useUpdateWork,
//   useDeleteWork,
//   useGetDailySchedule,
//   useUploadDailyScheduleImages,
//   useDeleteDailyScheduleImage,
// } from "../../../apiList/Stage Api/workScheduleApi"
// import { toast } from "../../../utils/toast"
// import { Button } from "../../../components/ui/Button"
// import { NO_IMAGE } from "../../../constants/constants"

// interface IUploadFile {
//   fileType: "image" | "pdf"
//   url: string
//   originalName?: string
//   uploadedAt?: Date
// }

// interface IDailyTaskDate {
//   _id?: string
//   date: Date
//   uploads: IUploadFile[]
// }

// interface IDailyTask {
//   _id?: string
//   taskName: string
//   description: string
//   status: "pending" | "submitted" | "approved" | "rejected"
//   assignedTo: string | null
//   dates: IDailyTaskDate[]
// }

// interface TaskFormData {
//   taskName: string
//   description: string
//   assignedTo: string
//   startDate: string
//   endDate: string
// }

// const DailySchedulePage: React.FC = () => {
//   const { projectId } = useParams<{ projectId: string }>()
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [showTaskForm, setShowTaskForm] = useState(false)
//   const [showTaskDetails, setShowTaskDetails] = useState(false)
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
//   const [selectedTask, setSelectedTask] = useState<IDailyTask | null>(null)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
//   const [uploadingImages, setUploadingImages] = useState(false)
//   const [formData, setFormData] = useState<TaskFormData>({
//     taskName: "",
//     description: "",
//     assignedTo: "",
//     startDate: "",
//     endDate: "",
//   })

//   // API hooks
//   const { data: scheduleData, isLoading, error, refetch } = useGetDailySchedule(projectId!)
//   const createWorkMutation = useCreateWork()
//   const updateWorkMutation = useUpdateWork()
//   const deleteWorkMutation = useDeleteWork()
//   const uploadImagesMutation = useUploadDailyScheduleImages()
//   const { mutateAsync: deletefile, isPending: deletefileLoading } = useDeleteDailyScheduleImage()

//   // Generate calendar months for 50 years (25 years back, 25 years forward)
//   const generateCalendarMonths = () => {
//     const months = []
//     const currentYear = new Date().getFullYear()
//     const startYear = currentYear - 25
//     const endYear = currentYear + 25

//     for (let year = startYear; year <= endYear; year++) {
//       for (let month = 0; month < 12; month++) {
//         months.push(new Date(year, month, 1))
//       }
//     }
//     return months
//   }

//   const calendarMonths = generateCalendarMonths()


//   const handleDeleteFile = async (taskId: string, dateId: string, imageId: string) => {
//     try {
//       await deletefile({
//         projectId: projectId!,
//         taskId,
//         dateId,
//         imageId,
//       })

//       toast({ title: "Success", description: "deleted succesfully" })
//     }
//     catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || "failed to delete" })

//     }
//   }

//   // Get days in month
//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear()
//     const month = date.getMonth()
//     const firstDay = new Date(year, month, 1)
//     const lastDay = new Date(year, month + 1, 0)
//     const daysInMonth = lastDay.getDate()
//     const startingDayOfWeek = firstDay.getDay()

//     const days = []

//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null)
//     }

//     // Add all days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push(new Date(year, month, day))
//     }

//     return days
//   }

//   // Get tasks for a specific date
//   const getTasksForDate = (date: Date) => {
//     if (!scheduleData?.tasks) return []

//     // Use local date string to avoid timezone conversion
//     const dateStr =
//       date.getFullYear() +
//       "-" +
//       String(date.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(date.getDate()).padStart(2, "0")

//     const tasksForDate: IDailyTask[] = []

//     scheduleData.tasks.forEach((task: IDailyTask) => {
//       task.dates.forEach((taskDate) => {
//         // Parse the database date string directly without timezone conversion
//         let taskDateStr: string
//         if (typeof taskDate.date === "string") {
//           taskDateStr = (taskDate.date as any).split("T")[0]
//         } else {
//           // If it's already a Date object, convert carefully
//           const dbDate = new Date(taskDate.date)
//           taskDateStr =
//             dbDate.getUTCFullYear() +
//             "-" +
//             String(dbDate.getUTCMonth() + 1).padStart(2, "0") +
//             "-" +
//             String(dbDate.getUTCDate()).padStart(2, "0")
//         }

//         if (taskDateStr === dateStr) {
//           tasksForDate.push(task)
//         }
//       })
//     })

//     return tasksForDate
//   }

//   const getImagesForDate = (date: Date) => {
//     if (!scheduleData?.tasks) return []

//     const dateStr =
//       date.getFullYear() +
//       "-" +
//       String(date.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(date.getDate()).padStart(2, "0")

//     const imagesForDate: { image: IUploadFile; taskName: string; dateId: string }[] = []

//     scheduleData.tasks.forEach((task: IDailyTask) => {
//       task.dates.forEach((taskDate) => {
//         let taskDateStr: string
//         if (typeof taskDate.date === "string") {
//           taskDateStr = (taskDate.date as any).split("T")[0]
//         } else {
//           const dbDate = new Date(taskDate.date)
//           taskDateStr =
//             dbDate.getUTCFullYear() +
//             "-" +
//             String(dbDate.getUTCMonth() + 1).padStart(2, "0") +
//             "-" +
//             String(dbDate.getUTCDate()).padStart(2, "0")
//         }

//         if (taskDateStr === dateStr && taskDate.uploads.length > 0) {
//           taskDate.uploads.forEach((upload) => {
//             if (upload.fileType === "image") {
//               imagesForDate.push({
//                 image: upload,
//                 taskName: task.taskName,
//                 dateId: taskDate._id || "",
//               })
//             }
//           })
//         }
//       })
//     })

//     return imagesForDate
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!projectId) return

//     try {
//       const dates = []
//       const startDate = new Date(formData.startDate + "T00:00:00.000Z")
//       const endDate = formData.endDate ? new Date(formData.endDate + "T00:00:00.000Z") : startDate

//       // Generate date range using UTC dates
//       const currentDate = new Date(startDate)
//       while (currentDate <= endDate) {
//         dates.push({ date: currentDate.toISOString() })
//         currentDate.setUTCDate(currentDate.getUTCDate() + 1)
//       }

//       const payload = {
//         taskName: formData.taskName,
//         description: formData.description,
//         assignedTo: formData.assignedTo || null,
//         dates,
//       }

//       if (isEditMode && selectedTask?._id) {
//         await updateWorkMutation.mutateAsync({
//           projectId,
//           taskId: selectedTask._id,
//           formData: payload,
//         })
//       } else {
//         await createWorkMutation.mutateAsync({
//           projectId,
//           formData: payload,
//         })
//       }

//       // Reset form and close modal
//       setFormData({
//         taskName: "",
//         description: "",
//         assignedTo: "",
//         startDate: "",
//         endDate: "",
//       })
//       setShowTaskForm(false)
//       setIsEditMode(false)
//       setSelectedTask(null)
//       refetch()
//     } catch (error) {
//       console.error("Error saving task:", error)
//     }
//   }

//   const handleImageUpload = async (files: FileList, taskId: string, dateId: string) => {
//     if (!projectId || !files.length) return

//     try {
//       setUploadingImages(true)
//       const fileArray = Array.from(files)

//       await uploadImagesMutation.mutateAsync({
//         projectId,
//         taskId,
//         dateId,
//         files: fileArray,
//       })

//       refetch()
//     } catch (error) {
//       console.error("Error uploading images:", error)
//     } finally {
//       setUploadingImages(false)
//     }
//   }

//   // Handle date click
//   const handleDateClick = (date: Date) => {
//     setSelectedDate(date)
//     const tasksForDate = getTasksForDate(date)
//     if (tasksForDate.length > 0) {
//       setSelectedTask(tasksForDate[0]) // Show first task for the date
//       setShowTaskDetails(true)
//     }
//   }

//   // Handle edit task
//   const handleEditTask = () => {
//     if (!selectedTask) return

//     const firstDate = selectedTask.dates[0]?.date
//     const lastDate = selectedTask.dates[selectedTask.dates.length - 1]?.date

//     // Parse dates without timezone conversion
//     let startDateStr = ""
//     let endDateStr = ""

//     if (firstDate) {
//       if (typeof firstDate === "string") {
//         startDateStr = (firstDate as any).split("T")[0]
//       } else {
//         const date = new Date(firstDate)
//         startDateStr =
//           date.getUTCFullYear() +
//           "-" +
//           String(date.getUTCMonth() + 1).padStart(2, "0") +
//           "-" +
//           String(date.getUTCDate()).padStart(2, "0")
//       }
//     }

//     if (lastDate && selectedTask.dates.length > 1) {
//       if (typeof lastDate === "string") {
//         endDateStr = (lastDate as any).split("T")[0]
//       } else {
//         const date = new Date(lastDate)
//         endDateStr =
//           date.getUTCFullYear() +
//           "-" +
//           String(date.getUTCMonth() + 1).padStart(2, "0") +
//           "-" +
//           String(date.getUTCDate()).padStart(2, "0")
//       }
//     }

//     setFormData({
//       taskName: selectedTask.taskName,
//       description: selectedTask.description,
//       assignedTo: selectedTask.assignedTo || "",
//       startDate: startDateStr,
//       endDate: endDateStr,
//     })

//     setIsEditMode(true)
//     setShowTaskDetails(false)
//     setShowTaskForm(true)
//   }

//   // Handle delete task
//   const handleDeleteTask = async () => {
//     if (!selectedTask?._id || !projectId) return

//     try {
//       await deleteWorkMutation.mutateAsync({
//         projectId,
//         taskId: selectedTask._id,
//       })
//       setShowTaskDetails(false)
//       setSelectedTask(null)
//       refetch()
//     } catch (error) {
//       console.error("Error deleting task:", error)
//     }
//   }

//   // Navigate to specific month
//   const navigateToMonth = (monthsToAdd: number) => {
//     const newDate = new Date(currentDate)
//     newDate.setMonth(newDate.getMonth() + monthsToAdd)
//     setCurrentDate(newDate)
//   }

//   const dateFormate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
//           <p className="text-gray-600">Loading schedule...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center text-red-600">
//           <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
//           <p>Error loading schedule. Please try again.</p>
//           <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             <i className="fas fa-calendar-alt mr-3 text-blue-500"></i>
//             Daily Schedule
//           </h1>
//           <button
//             onClick={() => {
//               setIsEditMode(false)
//               setSelectedTask(null)
//               setFormData({
//                 taskName: "",
//                 description: "",
//                 assignedTo: "",
//                 startDate: "",
//                 endDate: "",
//               })
//               setShowTaskForm(true)
//             }}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
//           >
//             <i className="fas fa-plus"></i>
//             Add Task
//           </button>
//         </div>
//       </div>

//       {/* Calendar Navigation */}
//       <div className="max-w-7xl mx-auto mb-6">
//         <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
//           <button onClick={() => navigateToMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <i className="fas fa-chevron-left text-gray-600"></i>
//           </button>

//           <h2 className="text-xl font-semibold text-gray-800">
//             {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
//           </h2>

//           <button onClick={() => navigateToMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <i className="fas fa-chevron-right text-gray-600"></i>
//           </button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {/* Days of week header */}
//           <div className="grid grid-cols-7 bg-gray-100">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//               <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
//                 {day}
//               </div>
//             ))}
//           </div>

//           {/* Calendar days */}
//           <div className="grid grid-cols-7">
//             {getDaysInMonth(currentDate).map((date, index) => {
//               if (!date) {
//                 return <div key={index} className="h-24 sm:h-32 border border-gray-200"></div>
//               }

//               const tasksForDate = getTasksForDate(date)
//               const imagesForDate = getImagesForDate(date)
//               const isToday = date.toDateString() === new Date().toDateString()

//               return (
//                 <div
//                   key={date.toISOString()}
//                   onClick={() => handleDateClick(date)}
//                   className={`h-24 sm:h-32 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? "bg-blue-50 border-blue-300" : ""
//                     }`}
//                 >
//                   <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
//                     {date.getDate()}
//                   </div>

//                   {/* Task indicators */}
//                   <div className="space-y-1">
//                     {tasksForDate.slice(0, 1).map((task, taskIndex) => (
//                       <div
//                         key={taskIndex}
//                         className={`text-xs px-2 py-1 rounded truncate ${task.status === "submitted"
//                           ? "bg-green-100 text-green-800"
//                           : task.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-gray-100 text-gray-800"
//                           }`}
//                       >
//                         {task.taskName}
//                       </div>
//                     ))}

//                     {imagesForDate.length > 0 && (
//                       <div className="flex items-center gap-1">
//                         <i className="fas fa-image text-xs text-blue-500"></i>
//                         <span className="text-xs text-blue-600">{imagesForDate.length}</span>
//                       </div>
//                     )}

//                     {tasksForDate.length > 1 && (
//                       <div className="text-xs text-gray-500">+{tasksForDate.length - 1} more</div>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Task Form Modal */}
//       {showTaskForm && (
//         <div
//           onClick={() => {
//             setShowTaskForm(false)
//             setIsEditMode(false)
//             setSelectedTask(null)
//           }}
//           className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
//           >
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">{isEditMode ? "Edit Task" : "Add New Task"}</h3>
//                 <button
//                   onClick={() => {
//                     setShowTaskForm(false)
//                     setIsEditMode(false)
//                     setSelectedTask(null)
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <i className="fas fa-times text-xl"></i>
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.taskName}
//                     onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter task name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter task description"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
//                   <input
//                     type="text"
//                     value={formData.assignedTo}
//                     onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter assignee ID"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
//                   <input
//                     type="date"
//                     required
//                     value={formData.startDate}
//                     onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
//                   <input
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                     min={formData.startDate}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Leave empty for single day task</p>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="submit"
//                     disabled={createWorkMutation.isPending || updateWorkMutation.isPending}
//                     className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {createWorkMutation.isPending || updateWorkMutation.isPending ? (
//                       <>
//                         <i className="fas fa-spinner fa-spin mr-2"></i>
//                         {isEditMode ? "Updating..." : "Creating..."}
//                       </>
//                     ) : (
//                       <>
//                         <i className={`fas ${isEditMode ? "fa-save" : "fa-plus"} mr-2`}></i>
//                         {isEditMode ? "Update Task" : "Create Task"}
//                       </>
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowTaskForm(false)
//                       setIsEditMode(false)
//                       setSelectedTask(null)
//                     }}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Task Details Modal */}
//       {showTaskDetails && selectedTask && (
//         <div
//           onClick={() => setShowTaskDetails(false)}
//           className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
//           >
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
//                 <button onClick={() => setShowTaskDetails(false)} className="text-gray-400 hover:text-gray-600">
//                   <i className="fas fa-times text-xl"></i>
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
//                   <p className="text-gray-900 font-medium">{selectedTask.taskName}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <p className="text-gray-900">{selectedTask.description || "No description"}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedTask.status === "submitted"
//                       ? "bg-green-100 text-green-800"
//                       : selectedTask.status === "pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : selectedTask.status === "approved"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                   >
//                     {selectedTask.status.replace("_", " ").toUpperCase()}
//                   </span>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
//                   <div className="space-y-1">
//                     {selectedTask.dates.map((dateObj, index) => {
//                       let displayDate: string
//                       console.log("date object", dateObj)
//                       if (typeof dateObj.date === "string") {
//                         console.log("date gettng inside")
//                         // displayDate = new Date(dateObj.date + "T12:00:00.000Z").toLocaleDateString()
//                         displayDate = new Date(dateObj.date).toLocaleDateString()
//                         console.log(" date display date", displayDate)
//                       } else {
//                         displayDate = new Date(dateObj.date).toLocaleDateString()
//                       }
//                       displayDate = dateFormate(displayDate)
//                       return (
//                         <div key={index} className="flex items-center justify-between">
//                           <p className="text-gray-900 text-sm">{displayDate}</p>
//                           <div className="flex items-center gap-2">
//                             {dateObj.uploads.filter((u) => u.fileType === "image").length > 0 && (
//                               <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
//                                 <i className="fas fa-image mr-1"></i>
//                                 {dateObj.uploads.filter((u) => u.fileType === "image").length}
//                               </span>
//                             )}
//                             <label className="cursor-pointer">
//                               <input
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                   if (e.target.files && selectedTask._id && dateObj._id) {
//                                     handleImageUpload(e.target.files, selectedTask._id, dateObj._id)
//                                   }
//                                 }}
//                                 disabled={uploadingImages}
//                               />
//                               <i
//                                 className={`fas fa-upload text-sm text-gray-500 hover:text-blue-500 ${uploadingImages ? "fa-spinner fa-spin" : ""}`}
//                               ></i>
//                             </label>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>

//                 {selectedTask.dates.some((d) => d.uploads.length > 0) && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Uploads by Date</label>
//                     <div className="space-y-3">
//                       {selectedTask.dates.map((dateObj, dateIndex) => {
//                         if (dateObj.uploads.length === 0) return null

//                         let displayDate: string
//                         if (typeof dateObj.date === "string") {
//                           displayDate = new Date(dateObj.date).toLocaleDateString()
//                         } else {
//                           displayDate = new Date(dateObj.date).toLocaleDateString()
//                         }
//                         displayDate = dateFormate(displayDate)

//                         return (
//                           <div key={dateIndex} className="border rounded-lg p-3">
//                             <h4 className="text-sm font-medium text-gray-800 mb-2">{displayDate}</h4>
//                             <div className="grid grid-cols-2 gap-2">
//                               {dateObj.uploads.map((upload, uploadIndex) => (
//                                 <div key={`${dateIndex}-${uploadIndex}`} className="relative">
//                                   {upload.fileType === "image" ? (
//                                     <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
//                                       <Button variant="danger" className="bg-red-600 text-white hover:bg-red-600" onClick={() => handleDeleteFile(selectedTask._id!, dateObj._id!, (upload as any)._id)}>
//                                         <i className="fas fa-trash"></i>
//                                       </Button>
//                                       <img
//                                         src={upload.url || NO_IMAGE}
//                                         alt={upload.originalName || "Uploaded image"}
//                                         className="w-full h-full object-cover cursor-pointer hover:opacity-80"
//                                         onClick={() => window.open(upload.url, "_blank")}
//                                       />
//                                     </div>
//                                   ) : (
//                                     <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
//                                       <i className="fas fa-file-pdf text-2xl text-red-500"></i>
//                                     </div>
//                                   )}
//                                   <p className="text-xs text-gray-600 mt-1 truncate">
//                                     {upload.originalName || "Uploaded file"}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-3 pt-6">
//                 <button
//                   onClick={handleEditTask}
//                   className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   <i className="fas fa-edit mr-2"></i>
//                   Edit Task
//                 </button>
//                 <button
//                   onClick={handleDeleteTask}
//                   disabled={deleteWorkMutation.isPending}
//                   className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   {deleteWorkMutation.isPending ? (
//                     <i className="fas fa-spinner fa-spin"></i>
//                   ) : (
//                     <i className="fas fa-trash"></i>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default DailySchedulePage


import type React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useCreateWork,
  useUpdateWork,
  useDeleteWork,
  useGetDailySchedule,
  useUploadDailyScheduleImages,
  useDeleteDailyScheduleImage,
  useGetProjectWorkers,
} from "../../../apiList/Stage Api/workScheduleApi"
import { NO_IMAGE } from "../../../constants/constants"
import { Button } from "../../../components/ui/Button"
import { toast } from "../../../utils/toast"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select"

interface IUploadFile {
  _id?: string
  fileType: "image" | "pdf"
  url: string
  originalName?: string
  uploadedAt?: Date
}

interface IDailyTaskDate {
  _id?: string
  date: Date
  uploads: IUploadFile[]
}

interface IDailyTask {
  _id?: string
  taskName: string
  description: string
  status: "pending" | "submitted" | "approved" | "rejected"
  assignedTo: string | null
  dates: IDailyTaskDate[]
}

interface TaskFormData {
  taskName: string
  description: string
  assignedTo: string
  assignedToName: string
  startDate: string
  endDate: string
}

const DailySchedulePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null)
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTask, setSelectedTask] = useState<IDailyTask | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  // const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    taskName: "",
    description: "",
    assignedTo: "",
    assignedToName: "",
    startDate: "",
    endDate: "",
  })


  const [showTaskSelection, setShowTaskSelection] = useState(false)
const [tasksForSelectedDate, setTasksForSelectedDate] = useState<any[]>([])


  // API hooks
  const { data: scheduleData, isLoading, error, refetch } = useGetDailySchedule(projectId!)
  const { data: workers, isLoading: workerloading } = useGetProjectWorkers(projectId!)
  const createWorkMutation = useCreateWork()
  const updateWorkMutation = useUpdateWork()
  const deleteWorkMutation = useDeleteWork()
  const uploadImagesMutation = useUploadDailyScheduleImages()
  const { mutateAsync: deleteFile, isPending: deleteFilePending } = useDeleteDailyScheduleImage()

  const handleDeleteFile = async (taskId: string, dateId: string, imageId: string) => {
    try {
      await deleteFile({
        projectId: projectId!,
        taskId,
        dateId,
        imageId,
      })
      console.log("Delete file:", { projectId, taskId, dateId, imageId })
      toast({ title: "Success", description: "deleted successfully" })
      refetch()
    } catch (error: any) {
      console.error("Error deleting file:", error)
      toast({ title: "Error", description: error?.response?.data?.message || "failed to delete" })
    }
  }

  const handleImageClick = (url: string, name: string) => {
    setPreviewImage({ url, name })
    setShowImagePreview(true)
  }

  // Generate calendar months for 50 years (25 years back, 25 years forward)
  // const generateCalendarMonths = () => {
  //   const months = []
  //   const currentYear = new Date().getFullYear()
  //   const startYear = currentYear - 25
  //   const endYear = currentYear + 25

  //   for (let year = startYear; year <= endYear; year++) {
  //     for (let month = 0; month < 12; month++) {
  //       months.push(new Date(year, month, 1))
  //     }
  //   }
  //   return months
  // }

  // const calendarMonths = generateCalendarMonths()

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    if (!scheduleData?.tasks) return []

    // Use local date string to avoid timezone conversion
    const dateStr =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")

    const tasksForDate: IDailyTask[] = []

    scheduleData.tasks.forEach((task: IDailyTask) => {
      task.dates.forEach((taskDate) => {
        // Parse the database date string directly without timezone conversion
        let taskDateStr: string
        if (typeof taskDate.date === "string") {
          taskDateStr = (taskDate.date as any).split("T")[0]
        } else {
          // If it's already a Date object, convert carefully
          const dbDate = new Date(taskDate.date)
          taskDateStr =
            dbDate.getUTCFullYear() +
            "-" +
            String(dbDate.getUTCMonth() + 1).padStart(2, "0") +
            "-" +
            String(dbDate.getUTCDate()).padStart(2, "0")
        }

        if (taskDateStr === dateStr) {
          tasksForDate.push(task)
        }
      })
    })

    return tasksForDate
  }

  const getImagesForDate = (date: Date) => {
    if (!scheduleData?.tasks) return []

    const dateStr =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")

    const imagesForDate: { image: IUploadFile; taskName: string; dateId: string }[] = []

    scheduleData.tasks.forEach((task: IDailyTask) => {
      task.dates.forEach((taskDate) => {
        let taskDateStr: string
        if (typeof taskDate.date === "string") {
          taskDateStr = (taskDate.date as any).split("T")[0]
        } else {
          const dbDate = new Date(taskDate.date)
          taskDateStr =
            dbDate.getUTCFullYear() +
            "-" +
            String(dbDate.getUTCMonth() + 1).padStart(2, "0") +
            "-" +
            String(dbDate.getUTCDate()).padStart(2, "0")
        }

        if (taskDateStr === dateStr && taskDate.uploads.length > 0) {
          taskDate.uploads.forEach((upload) => {
            if (upload.fileType === "image") {
              imagesForDate.push({
                image: upload,
                taskName: task.taskName,
                dateId: taskDate._id || "",
              })
            }
          })
        }
      })
    })

    return imagesForDate
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectId) return

    try {
      const dates = []
      const startDate = new Date(formData.startDate + "T00:00:00.000Z")
      const endDate = formData.endDate ? new Date(formData.endDate + "T00:00:00.000Z") : startDate

      // Generate date range using UTC dates
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        dates.push({ date: currentDate.toISOString() })
        currentDate.setUTCDate(currentDate.getUTCDate() + 1)
      }

      const payload = {
        taskName: formData.taskName,
        description: formData.description,
        assignedTo: formData.assignedTo || null,
        dates,
      }

      if (isEditMode && selectedTask?._id) {
        await updateWorkMutation.mutateAsync({
          projectId,
          taskId: selectedTask._id,
          formData: payload,
        })
      } else {
        await createWorkMutation.mutateAsync({
          projectId,
          formData: payload,
        })
      }

      // Reset form and close modal
      setFormData({
        taskName: "",
        description: "",
        assignedTo: "",
        assignedToName: "",
        startDate: "",
        endDate: "",
      })
      setShowTaskForm(false)
      setIsEditMode(false)
      setSelectedTask(null)
      refetch()
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleImageUpload = async (files: FileList, taskId: string, dateId: string) => {
    if (!projectId || !files.length) return

    try {
      setUploadingImages(true)
      const fileArray = Array.from(files)

      await uploadImagesMutation.mutateAsync({
        projectId,
        taskId,
        dateId,
        files: fileArray,
      })

      refetch()
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setUploadingImages(false)
    }
  }

  // Handle date click
  // const handleDateClick = (date: Date) => {
  //   // setSelectedDate(date)
  //   const tasksForDate = getTasksForDate(date)
  //   if (tasksForDate.length > 0) {
  //     setSelectedTask(tasksForDate[0]) // Show first task for the date
  //     setShowTaskDetails(true)
  //   }
  //   else {
  //     toast({ title: "Warning", description: "No tasks in this date", variant: "destructive" })
  //   }
  // }


  const handleDateClick = (date: Date) => {
  const tasksForDate = getTasksForDate(date)
  if (tasksForDate.length > 1) {
    // Multiple tasks - show selection
    setTasksForSelectedDate(tasksForDate)
    setShowTaskSelection(true)
  } else if (tasksForDate.length === 1) {
    // Single task - show directly
    setSelectedTask(tasksForDate[0])
    setShowTaskDetails(true)
  } else {
    toast({ title: "Warning", description: "No tasks in this date", variant: "destructive" })
  }
}

//  Add function to handle task selection
const handleTaskSelect = (task: any) => {
  setSelectedTask(task)
  setShowTaskSelection(false)
  setShowTaskDetails(true)
}

  // Handle edit task
  const handleEditTask = () => {
    if (!selectedTask) return

    const firstDate = selectedTask.dates[0]?.date
    const lastDate = selectedTask.dates[selectedTask.dates.length - 1]?.date

    // Parse dates without timezone conversion
    let startDateStr = ""
    let endDateStr = ""

    if (firstDate) {
      if (typeof firstDate === "string") {
        startDateStr = (firstDate as any).split("T")[0]
      } else {
        const date = new Date(firstDate)
        startDateStr =
          date.getUTCFullYear() +
          "-" +
          String(date.getUTCMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getUTCDate()).padStart(2, "0")
      }
    }

    if (lastDate && selectedTask.dates.length > 1) {
      if (typeof lastDate === "string") {
        endDateStr = (lastDate as any).split("T")[0]
      } else {
        const date = new Date(lastDate)
        endDateStr =
          date.getUTCFullYear() +
          "-" +
          String(date.getUTCMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getUTCDate()).padStart(2, "0")
      }
    }

    const assignedWorker = workers?.find((w: any) => w._id === selectedTask.assignedTo)


    setFormData({
      taskName: selectedTask.taskName,
      description: selectedTask.description,
      assignedTo: selectedTask.assignedTo || "",
      assignedToName: assignedWorker?.workerName || "",
      startDate: startDateStr,
      endDate: endDateStr,
    })

    setIsEditMode(true)
    setShowTaskDetails(false)
    setShowTaskForm(true)
  }

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!selectedTask?._id || !projectId) return

    try {
      await deleteWorkMutation.mutateAsync({
        projectId,
        taskId: selectedTask._id,
      })
      setShowTaskDetails(false)
      setSelectedTask(null)
      refetch()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  // Navigate to specific month
  const navigateToMonth = (monthsToAdd: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + monthsToAdd)
    setCurrentDate(newDate)
  }

  const dateFormate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
          <p>Error loading schedule. Please try again.</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-full overflow-y-auto bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-full mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div className="flex gap-2 items-center ">
            <button onClick={() => navigate(-1)} className="!text-[16px] cursor-pointer bg-slate-300 rounded-2xl px-2 py-1">
              <i className="fas fa-arrow-left"></i> back
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              <i className="fas fa-calendar-alt mr-3 text-blue-500"></i>
              Daily Schedule
            </h1>
          </div>
          <button
            onClick={() => {
              setIsEditMode(false)
              setSelectedTask(null)
              setFormData({
                taskName: "",
                description: "",
                assignedTo: "",
                assignedToName: "",
                startDate: "",
                endDate: "",
              })
              setShowTaskForm(true)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Add Task
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <button onClick={() => navigateToMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>

          <button onClick={() => navigateToMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 bg-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {getDaysInMonth(currentDate).map((date, index) => {
              if (!date) {
                return <div key={index} className="h-24 sm:h-32 border border-gray-200"></div>
              }

              const tasksForDate = getTasksForDate(date)
              const imagesForDate = getImagesForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`h-24 sm:h-32 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? "bg-blue-50 border-blue-300" : ""
                    }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
                    {date.getDate()}
                  </div>

                  {/* Task indicators */}
                  <div className="space-y-1">
                    {tasksForDate?.slice(0, 1).map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className={`text-xs px-2 py-1 rounded truncate ${task.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : task.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {task.taskName}
                      </div>
                    ))}

                    {imagesForDate.length > 0 && (
                      <div className="flex items-center gap-1">
                        <i className="fas fa-image text-xs text-blue-500"></i>
                        <span className="text-xs text-blue-600">{imagesForDate.length}</span>
                      </div>
                    )}

                    {tasksForDate.length > 1 && (
                      <div className="text-xs text-gray-500">+{tasksForDate.length - 1} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div
          onClick={() => {
            setShowTaskForm(false)
            setIsEditMode(false)
            setSelectedTask(null)
          }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{isEditMode ? "Edit Task" : "Add New Task"}</h3>
                <button
                  onClick={() => {
                    setShowTaskForm(false)
                    setIsEditMode(false)
                    setSelectedTask(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.taskName}
                    onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  

                  <Select
                    onValueChange={(workerId: string) => {
                      const selectedWorker = workers.find((w:any) => w._id === workerId);
                      setFormData({
                        ...formData,
                        assignedTo: workerId,
                        assignedToName: selectedWorker?.workerName || ""
                      });
                    }}
                  >
                    <SelectTrigger className="w-40 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white">
                      <SelectValue placeholder="Assign worker" selectedValue={formData.assignedToName} />
                    </SelectTrigger>
                    <SelectContent>

                      {workerloading ? (
                        <div className="px-2 ">
                          <div className="w-5 h-5 rounded-full animate-spin border-t-transparent bg-black border-4"></div>
                        </div>
                      ) : (
                        <>
                          {Array.isArray(workers) && workers?.length > 0 ? workers?.map((worker: { _id: string, workerName: string, email: string }) => (
                            <SelectItem key={worker._id} value={worker._id}>
                              <div className="flex items-center gap-2">
                                {worker.workerName}
                              </div>
                            </SelectItem>
                          ))
                            :
                            <div className="h-30 text-center text-sm flex justify-center items-center">
                              No workers registered
                            </div>
                          }
                        </>
                      )}

                    </SelectContent>
                  </Select>
                </div> */}


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                 

                  <select
                    className="border-b px-2 py-1 text-sm w-[100%]"
                    value={formData.assignedTo}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedWorker = workers.find((w:any) => w._id === selectedId);

                      setFormData({
                        ...formData,
                        assignedTo: selectedId,
                        assignedToName: selectedWorker ? selectedWorker.workerName : "",
                      });
                    }}
                  >
                    {workerloading ? (
                      <option disabled>Loading workers...</option>
                    ) : (
                      <>
                        <option value="">{formData.assignedToName ||"Assign worker"}</option>
                        {Array.isArray(workers) && workers.length > 0 ? (
                          workers.map((worker: { _id: string; workerName: string; email: string }) => (
                            <option key={worker._id} value={worker._id}>
                              {worker.workerName} {worker.email && `(${worker.email})`}
                            </option>
                          ))
                        ) : (
                          <option disabled>No workers registered</option>
                        )}
                      </>
                    )}
                  </select>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for single day task</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createWorkMutation.isPending || updateWorkMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {createWorkMutation.isPending || updateWorkMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${isEditMode ? "fa-save" : "fa-plus"} mr-2`}></i>
                        {isEditMode ? "Update Task" : "Create Task"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false)
                      setIsEditMode(false)
                      setSelectedTask(null)
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div >
      )}

      {
      
        // showTaskDetails && selectedTask && (
        //   <div
        //     onClick={() => setShowTaskDetails(false)}
        //     className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        //   >
        //     <div
        //       onClick={(e) => e.stopPropagation()}
        //       className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        //     >
        //       {/* Header */}
        //       <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        //         <div className="flex justify-between items-center">
        //           <div className="flex items-center gap-3">
        //             <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        //               <i className="fas fa-tasks text-white text-lg"></i>
        //             </div>
        //             <div>
        //               <h3 className="text-xl font-bold text-white">{selectedTask.taskName}</h3>
        //               <p className="text-blue-100 text-sm">Task Details</p>
        //             </div>
        //           </div>
        //           <button
        //             onClick={() => setShowTaskDetails(false)}
        //             className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
        //           >
        //             <i className="fas fa-times text-lg"></i>
        //           </button>
        //         </div>
        //       </div>

        //       {/* Content */}
        //       <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        //         <div className="space-y-6">
        //           {/* Task Info */}
        //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        //             <div className="space-y-4">
        //               <div>
        //                 <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        //                 <div className="bg-gray-50 rounded-lg p-4">
        //                   <p className="text-gray-800">{selectedTask.description || "No description provided"}</p>
        //                 </div>
        //               </div>

        //               <div>
        //                 <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
        //                 <span
        //                   className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${selectedTask.status === "submitted"
        //                     ? "bg-green-100 text-green-800"
        //                     : selectedTask.status === "pending"
        //                       ? "bg-yellow-100 text-yellow-800"
        //                       : selectedTask.status === "approved"
        //                         ? "bg-blue-100 text-blue-800"
        //                         : "bg-gray-100 text-gray-800"
        //                     }`}
        //                 >
        //                   <div
        //                     className={`w-2 h-2 rounded-full mr-2 ${selectedTask.status === "submitted"
        //                       ? "bg-green-500"
        //                       : selectedTask.status === "pending"
        //                         ? "bg-yellow-500"
        //                         : selectedTask.status === "approved"
        //                           ? "bg-blue-500"
        //                           : "bg-gray-500"
        //                       }`}
        //                   ></div>
        //                   {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
        //                 </span>
        //               </div>
        //             </div>

        //             <div>
        //               <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule</label>
        //               <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        //                 {selectedTask.dates.map((dateObj, index) => {
        //                   let displayDate: string
        //                   if (typeof dateObj.date === "string") {
        //                     displayDate = new Date(dateObj.date).toLocaleDateString()
        //                   } else {
        //                     displayDate = new Date(dateObj.date).toLocaleDateString()
        //                   }
        //                   displayDate = dateFormate(displayDate)

        //                   return (
        //                     <div
        //                       key={index}
        //                       className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
        //                     >
        //                       <div className="flex items-center gap-2">
        //                         <i className="fas fa-calendar-day text-blue-500 text-sm"></i>
        //                         <span className="text-gray-800 font-medium">{displayDate}</span>
        //                       </div>
        //                       <div className="flex items-center gap-2 ">
        //                         {dateObj.uploads.filter((u) => u.fileType === "image").length > 0 && (
        //                           <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
        //                             <i className="fas fa-image mr-1"></i>
        //                             {dateObj.uploads.filter((u) => u.fileType === "image").length}
        //                           </span>
        //                         )}
        //                         <label className="cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors">
        //                           <input
        //                             type="file"
        //                             multiple
        //                             accept="image/*"
        //                             className="hidden"
        //                             onChange={(e) => {
        //                               if (e.target.files && selectedTask._id && dateObj._id) {
        //                                 handleImageUpload(e.target.files, selectedTask._id, dateObj._id)
        //                               }
        //                             }}
        //                             disabled={uploadingImages}
        //                           />
        //                           <i
        //                             className={`fas ${uploadingImages ? "fa-spinner fa-spin" : "fa-upload"} text-sm text-blue-500`}
        //                           ></i>
        //                         </label>
        //                       </div>
        //                     </div>
        //                   )
        //                 })}
        //               </div>
        //             </div>
        //           </div>

        //           {/* Images Section */}
        //           {selectedTask.dates.some((d) => d.uploads.length > 0) && (
        //             <div>
        //               <label className="block text-sm font-semibold text-gray-700 mb-4">Uploaded Images</label>
        //               <div className="space-y-4">
        //                 {selectedTask.dates.map((dateObj, dateIndex) => {
        //                   if (dateObj.uploads.length === 0) return null

        //                   let displayDate: string
        //                   if (typeof dateObj.date === "string") {
        //                     displayDate = new Date(dateObj.date).toLocaleDateString()
        //                   } else {
        //                     displayDate = new Date(dateObj.date).toLocaleDateString()
        //                   }
        //                   displayDate = dateFormate(displayDate)

        //                   return (
        //                     <div key={dateIndex} className="bg-gray-50 rounded-lg p-4">
        //                       <div className="flex items-center gap-2 mb-3">
        //                         <i className="fas fa-calendar-day text-blue-500"></i>
        //                         <h4 className="font-semibold text-gray-800">{displayDate}</h4>
        //                       </div>
        //                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        //                         {dateObj.uploads.map((upload, uploadIndex) => (
        //                           <div key={`${dateIndex}-${uploadIndex}`} className="relative group">
        //                             {upload.fileType === "image" ? (
        //                               <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm border">
        //                                 <img
        //                                   src={upload.url || NO_IMAGE}
        //                                   alt={upload.originalName || "Uploaded image"}
        //                                   className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
        //                                   onClick={() => handleImageClick(upload.url, upload.originalName || "Image")}
        //                                 />
        //                                 {/* Delete button */}
        //                                 <Button
        //                                   isLoading={deleteFilePending}
        //                                   onClick={() => handleDeleteFile(selectedTask._id!, dateObj._id!, upload._id!)}
        //                                   className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
        //                                 >
        //                                   <i className="fas fa-trash text-xs"></i>
        //                                 </Button>
        //                                 {/* View button */}
        //                                 {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        //                                 <button
        //                                   onClick={() => handleImageClick(upload.url, upload.originalName || "Image")}
        //                                   className="text-white hover:text-blue-200"
        //                                 >
        //                                   <i className="fas fa-expand text-lg"></i>
        //                                 </button>
        //                               </div> */}
        //                               </div>
        //                             ) : (
        //                               <div className="aspect-square bg-white rounded-lg flex items-center justify-center shadow-sm border">
        //                                 <i className="fas fa-file-pdf text-3xl text-red-500"></i>
        //                               </div>
        //                             )}
        //                             <p className="text-xs text-gray-600 mt-2 truncate text-center">
        //                               {upload.originalName || "Uploaded file"}
        //                             </p>
        //                           </div>
        //                         ))}
        //                       </div>
        //                     </div>
        //                   )
        //                 })}
        //               </div>
        //             </div>
        //           )}
        //         </div>
        //       </div>

        //       {/* Footer */}
        //       <div className="bg-gray-50 px-6 py-4 flex gap-3">
        //         <button
        //           onClick={handleEditTask}
        //           className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        //         >
        //           <i className="fas fa-edit"></i>
        //           Edit Task
        //         </button>
        //         <button
        //           onClick={handleDeleteTask}
        //           disabled={deleteWorkMutation.isPending}
        //           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        //         >
        //           {deleteWorkMutation.isPending ? (
        //             <i className="fas fa-spinner fa-spin"></i>
        //           ) : (
        //             <i className="fas fa-trash"></i>
        //           )}
        //           Delete
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // )
      }



       {showTaskSelection && (
        <div
          onClick={() => setShowTaskSelection(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-list text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Select Task</h3>
                    <p className="text-blue-100 text-sm">Choose a task to view</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTaskSelection(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3">
                {tasksForSelectedDate.map((task, index) => (
                  <div
                    key={task._id || index}
                    onClick={() => handleTaskSelect(task)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <i className="fas fa-tasks text-blue-600 text-sm"></i>
                          </div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                            {task.taskName}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description || "No description provided"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              task.status === "submitted"
                                ? "bg-green-100 text-green-800"
                                : task.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.status === "approved"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                task.status === "submitted"
                                  ? "bg-green-500"
                                  : task.status === "pending"
                                  ? "bg-yellow-500"
                                  : task.status === "approved"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <i className="fas fa-calendar-day"></i>
                            <span>{task.dates?.length || 0} dates</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  Keep existing task details modal unchanged */}
      {
        showTaskDetails && selectedTask && (
          <div
            onClick={() => setShowTaskDetails(false)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-tasks text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedTask.taskName}</h3>
                      <p className="text-blue-100 text-sm">Task Details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTaskDetails(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <i className="fas fa-times text-lg"></i>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Task Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800">{selectedTask.description || "No description provided"}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${selectedTask.status === "submitted"
                            ? "bg-green-100 text-green-800"
                            : selectedTask.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedTask.status === "approved"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${selectedTask.status === "submitted"
                              ? "bg-green-500"
                              : selectedTask.status === "pending"
                                ? "bg-yellow-500"
                                : selectedTask.status === "approved"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                              }`}
                          ></div>
                          {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule</label>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {selectedTask.dates.map((dateObj, index) => {
                          let displayDate: string
                          if (typeof dateObj.date === "string") {
                            displayDate = new Date(dateObj.date).toLocaleDateString()
                          } else {
                            displayDate = new Date(dateObj.date).toLocaleDateString()
                          }
                          displayDate = dateFormate(displayDate)

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <i className="fas fa-calendar-day text-blue-500 text-sm"></i>
                                <span className="text-gray-800 font-medium">{displayDate}</span>
                              </div>
                              <div className="flex items-center gap-2 ">
                                {dateObj.uploads.filter((u) => u.fileType === "image").length > 0 && (
                                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    <i className="fas fa-image mr-1"></i>
                                    {dateObj.uploads.filter((u) => u.fileType === "image").length}
                                  </span>
                                )}
                                <label className="cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && selectedTask._id && dateObj._id) {
                                        handleImageUpload(e.target.files, selectedTask._id, dateObj._id)
                                      }
                                    }}
                                    disabled={uploadingImages}
                                  />
                                  <i
                                    className={`fas ${uploadingImages ? "fa-spinner fa-spin" : "fa-upload"} text-sm text-blue-500`}
                                  ></i>
                                </label>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Images Section */}
                  {selectedTask.dates.some((d) => d.uploads.length > 0) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">Uploaded Images</label>
                      <div className="space-y-4">
                        {selectedTask.dates.map((dateObj, dateIndex) => {
                          if (dateObj.uploads.length === 0) return null

                          let displayDate: string
                          if (typeof dateObj.date === "string") {
                            displayDate = new Date(dateObj.date).toLocaleDateString()
                          } else {
                            displayDate = new Date(dateObj.date).toLocaleDateString()
                          }
                          displayDate = dateFormate(displayDate)

                          return (
                            <div key={dateIndex} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <i className="fas fa-calendar-day text-blue-500"></i>
                                <h4 className="font-semibold text-gray-800">{displayDate}</h4>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {dateObj.uploads.map((upload, uploadIndex) => (
                                  <div key={`${dateIndex}-${uploadIndex}`} className="relative group">
                                    {upload.fileType === "image" ? (
                                      <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm border">
                                        <img
                                          src={upload.url || NO_IMAGE}
                                          alt={upload.originalName || "Uploaded image"}
                                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                          onClick={() => handleImageClick(upload.url, upload.originalName || "Image")}
                                        />
                                        {/* Delete button */}
                                        <Button
                                          isLoading={deleteFilePending}
                                          onClick={() => handleDeleteFile(selectedTask._id!, dateObj._id!, upload._id!)}
                                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                                        >
                                          <i className="fas fa-trash text-xs"></i>
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="aspect-square bg-white rounded-lg flex items-center justify-center shadow-sm border">
                                        <i className="fas fa-file-pdf text-3xl text-red-500"></i>
                                      </div>
                                    )}
                                    <p className="text-xs text-gray-600 mt-2 truncate text-center">
                                      {upload.originalName || "Uploaded file"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={handleEditTask}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  Edit Task
                </button>
                <button
                  onClick={handleDeleteTask}
                  disabled={deleteWorkMutation.isPending}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {deleteWorkMutation.isPending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-trash"></i>
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showImagePreview && previewImage && (
          <div
            onClick={() => setShowImagePreview(false)}
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]"
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
              >
                <i className="fas fa-times"></i>
              </button>
              <img
                src={previewImage.url || NO_IMAGE}
                alt={previewImage.name}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute -bottom-12 left-0 text-white text-sm">{previewImage.name}</div>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default DailySchedulePage
