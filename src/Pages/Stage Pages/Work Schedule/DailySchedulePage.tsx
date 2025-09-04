// import type React from "react"
// import { useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import {
//   useCreateWork,
//   useUpdateWork,
//   useDeleteWork,
//   useGetDailySchedule,
//   useUploadDailyScheduleImages,
//   useDeleteDailyScheduleImage,
//   useGetProjectWorkers,
// } from "../../../apiList/Stage Api/workScheduleApi"

// import { toast } from "../../../utils/toast"
// import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"

// interface IUploadFile {
//   _id?: string
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
//   assignedToName: string
//   startDate: string
//   endDate: string
// }

// const DailySchedulePage: React.FC = () => {
//   const { projectId } = useParams<{ projectId: string }>()
//   const navigate = useNavigate()
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [showTaskForm, setShowTaskForm] = useState(false)
//   const [showTaskDetails, setShowTaskDetails] = useState(false)
//   // const [showImagePreview, setShowImagePreview] = useState(false)
//   // const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null)
//   // const [selectedDate, setSelectedDate] = useState<Date | null>(null)
//   const [selectedTask, setSelectedTask] = useState<IDailyTask | null>(null)
//   const [isEditMode, setIsEditMode] = useState(false)
//   // const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
//   const [uploadingImages, setUploadingImages] = useState(false)
//   const [formData, setFormData] = useState<TaskFormData>({
//     taskName: "",
//     description: "",
//     assignedTo: "",
//     assignedToName: "",
//     startDate: "",
//     endDate: "",
//   })


//   const [showTaskSelection, setShowTaskSelection] = useState(false)
//   const [tasksForSelectedDate, setTasksForSelectedDate] = useState<any[]>([])


//   // API hooks
//   const { data: scheduleData, isLoading, error, refetch } = useGetDailySchedule(projectId!)
//   const { data: workers, isLoading: workerloading } = useGetProjectWorkers(projectId!)
//   const createWorkMutation = useCreateWork()
//   const updateWorkMutation = useUpdateWork()
//   const deleteWorkMutation = useDeleteWork()
//   const uploadImagesMutation = useUploadDailyScheduleImages()
//   const { mutateAsync: deleteFile } = useDeleteDailyScheduleImage()

//   const handleDeleteFile = async (taskId: string, dateId: string, imageId: string) => {
//     try {
//       await deleteFile({
//         projectId: projectId!,
//         taskId,
//         dateId,
//         imageId,
//       })
//       console.log("Delete file:", { projectId, taskId, dateId, imageId })
//       toast({ title: "Success", description: "deleted successfully" })
//       refetch()
//     } catch (error: any) {
//       console.error("Error deleting file:", error)
//       toast({ title: "Error", description: error?.response?.data?.message || "failed to delete", variant: "destructive" })
//     }
//   }

//   // const handleImageClick = (url: string, name: string) => {
//   //   setPreviewImage({ url, name })
//   //   setShowImagePreview(true)
//   // }

//   // Generate calendar months for 50 years (25 years back, 25 years forward)
//   // const generateCalendarMonths = () => {
//   //   const months = []
//   //   const currentYear = new Date().getFullYear()
//   //   const startYear = currentYear - 25
//   //   const endYear = currentYear + 25

//   //   for (let year = startYear; year <= endYear; year++) {
//   //     for (let month = 0; month < 12; month++) {
//   //       months.push(new Date(year, month, 1))
//   //     }
//   //   }
//   //   return months
//   // }

//   // const calendarMonths = generateCalendarMonths()

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
//     const getTasksForDate = (date: Date) => {
//       if (!scheduleData?.tasks) return []

//       // Use local date string to avoid timezone conversion
//       const dateStr =
//         date.getFullYear() +
//         "-" +
//         String(date.getMonth() + 1).padStart(2, "0") +
//         "-" +
//         String(date.getDate()).padStart(2, "0")

//       const tasksForDate: IDailyTask[] = []

//       scheduleData.tasks.forEach((task: IDailyTask) => {
//         task.dates.forEach((taskDate) => {
//           // Parse the database date string directly without timezone conversion
//           let taskDateStr: string
//           if (typeof taskDate.date === "string") {
//             taskDateStr = (taskDate.date as any).split("T")[0]
//           } else {
//             // If it's already a Date object, convert carefully
//             const dbDate = new Date(taskDate.date)
//             taskDateStr =
//               dbDate.getUTCFullYear() +
//               "-" +
//               String(dbDate.getUTCMonth() + 1).padStart(2, "0") +
//               "-" +
//               String(dbDate.getUTCDate()).padStart(2, "0")
//           }

//           if (taskDateStr === dateStr) {
//             tasksForDate.push(task)
//           }
//         })
//       })

//       return tasksForDate
//     }

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
//         assignedToName: "",
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
//   // const handleDateClick = (date: Date) => {
//   //   // setSelectedDate(date)
//   //   const tasksForDate = getTasksForDate(date)
//   //   if (tasksForDate.length > 0) {
//   //     setSelectedTask(tasksForDate[0]) // Show first task for the date
//   //     setShowTaskDetails(true)
//   //   }
//   //   else {
//   //     toast({ title: "Warning", description: "No tasks in this date", variant: "destructive" })
//   //   }
//   // }


//   const handleDateClick = (date: Date) => {
//     const tasksForDate = getTasksForDate(date)
//     if (tasksForDate.length > 1) {
//       // Multiple tasks - show selection
//       setTasksForSelectedDate(tasksForDate)
//       setShowTaskSelection(true)
//     } else if (tasksForDate.length === 1) {
//       // Single task - show directly
//       setSelectedTask(tasksForDate[0])
//       setShowTaskDetails(true)
//     } else {
//       toast({ title: "Warning", description: "No tasks in this date", variant: "destructive" })
//     }
//   }

//   //  Add function to handle task selection
//   const handleTaskSelect = (task: any) => {
//     setSelectedTask(task)
//     setShowTaskSelection(false)
//     setShowTaskDetails(true)
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

//     const assignedWorker = workers?.find((w: any) => w._id === selectedTask.assignedTo)


//     setFormData({
//       taskName: selectedTask.taskName,
//       description: selectedTask.description,
//       assignedTo: selectedTask.assignedTo || "",
//       assignedToName: assignedWorker?.workerName || "",
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
//     <div className="max-h-full overflow-y-auto bg-gray-50 p-4">
//       {/* Header */}
//       <div className="max-w-full mx-auto mb-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

//           <div className="flex gap-2 items-center ">
//             <button onClick={() => navigate(-1)} className="!text-[16px] cursor-pointer bg-slate-300 rounded-2xl px-2 py-1">
//               <i className="fas fa-arrow-left"></i> back
//             </button>

//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//               <i className="fas fa-calendar-alt mr-3 text-blue-500"></i>
//               Daily Schedule
//             </h1>
//           </div>
//           <button
//             onClick={() => {
//               setIsEditMode(false)
//               setSelectedTask(null)
//               setFormData({
//                 taskName: "",
//                 description: "",
//                 assignedTo: "",
//                 assignedToName: "",
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
//                     {tasksForDate?.slice(0, 1).map((task, taskIndex) => (
//                       <div
//                         key={taskIndex}
//                         className={`text-xs px-2 py-1 rounded truncate ${task.status === "approved"
//                           ? "bg-green-100 text-green-800"
//                           : task.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : task.status === "submitted"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-gray-100 text-gray-800"
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
//           className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
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

//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>


//                   <Select
//                     onValueChange={(workerId: string) => {
//                       const selectedWorker = workers.find((w:any) => w._id === workerId);
//                       setFormData({
//                         ...formData,
//                         assignedTo: workerId,
//                         assignedToName: selectedWorker?.workerName || ""
//                       });
//                     }}
//                   >
//                     <SelectTrigger className="w-40 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white">
//                       <SelectValue placeholder="Assign worker" selectedValue={formData.assignedToName} />
//                     </SelectTrigger>
//                     <SelectContent>

//                       {workerloading ? (
//                         <div className="px-2 ">
//                           <div className="w-5 h-5 rounded-full animate-spin border-t-transparent bg-black border-4"></div>
//                         </div>
//                       ) : (
//                         <>
//                           {Array.isArray(workers) && workers?.length > 0 ? workers?.map((worker: { _id: string, workerName: string, email: string }) => (
//                             <SelectItem key={worker._id} value={worker._id}>
//                               <div className="flex items-center gap-2">
//                                 {worker.workerName}
//                               </div>
//                             </SelectItem>
//                           ))
//                             :
//                             <div className="h-30 text-center text-sm flex justify-center items-center">
//                               No workers registered
//                             </div>
//                           }
//                         </>
//                       )}

//                     </SelectContent>
//                   </Select>
//                 </div> */}


//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>


//                   <select
//                     className="border-b px-2 py-1 text-sm w-[100%]"
//                     value={formData.assignedTo}
//                     onChange={(e) => {
//                       const selectedId = e.target.value;
//                       const selectedWorker = workers.find((w: any) => w._id === selectedId);

//                       setFormData({
//                         ...formData,
//                         assignedTo: selectedId,
//                         assignedToName: selectedWorker ? selectedWorker.workerName : "",
//                       });
//                     }}
//                   >
//                     {workerloading ? (
//                       <option disabled>Loading workers...</option>
//                     ) : (
//                       <>
//                         <option value="">{formData.assignedToName || "Assign worker"}</option>
//                         {Array.isArray(workers) && workers.length > 0 ? (
//                           workers.map((worker: { _id: string; workerName: string; email: string }) => (
//                             <option key={worker._id} value={worker._id}>
//                               {worker.workerName} {worker.email && `(${worker.email})`}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No workers registered</option>
//                         )}
//                       </>
//                     )}
//                   </select>

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
//         </div >
//       )}


//       {showTaskSelection && (
//         <div
//           onClick={() => setShowTaskSelection(false)}
//           className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <i className="fas fa-list text-white text-lg"></i>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-white">Select Task</h3>
//                     <p className="text-blue-100 text-sm">Choose a task to view</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowTaskSelection(false)}
//                   className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//                 >
//                   <i className="fas fa-times text-lg"></i>
//                 </button>
//               </div>
//             </div>

//             {/* Task List */}
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
//               <div className="space-y-3">
//                 {tasksForSelectedDate.map((task, index) => (
//                   <div
//                     key={task._id || index}
//                     onClick={() => handleTaskSelect(task)}
//                     className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                             <i className="fas fa-tasks text-blue-600 text-sm"></i>
//                           </div>
//                           <h4 className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
//                             {task.taskName}
//                           </h4>
//                         </div>
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                           {task.description || "No description provided"}
//                         </p>
//                         <div className="flex items-center justify-between">
//                           <span
//                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${task.status === "submitted"
//                               ? "bg-green-100 text-green-800"
//                               : task.status === "pending"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : task.status === "approved"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                           >
//                             <div
//                               className={`w-1.5 h-1.5 rounded-full mr-1.5 ${task.status === "submitted"
//                                 ? "bg-green-500"
//                                 : task.status === "pending"
//                                   ? "bg-yellow-500"
//                                   : task.status === "approved"
//                                     ? "bg-blue-500"
//                                     : "bg-gray-500"
//                                 }`}
//                             ></div>
//                             {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
//                           </span>
//                           <div className="flex items-center gap-2 text-xs text-gray-500">
//                             <i className="fas fa-calendar-day"></i>
//                             <span>{task.dates?.length || 0} dates</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/*  Keep existing task details modal unchanged */}
//       {
//         showTaskDetails && selectedTask && (
//           <div
//             onClick={() => setShowTaskDetails(false)}
//             className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
//           >
//             <div
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
//             >
//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                       <i className="fas fa-tasks text-white text-lg"></i>
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-white">{selectedTask.taskName}</h3>
//                       <p className="text-blue-100 text-sm">Task Details</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowTaskDetails(false)}
//                     className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//                   >
//                     <i className="fas fa-times text-lg"></i>
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
//                 <div className="space-y-6">
//                   {/* Task Info */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <p className="text-gray-800">{selectedTask.description || "No description provided"}</p>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
//                         <span
//                           className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${selectedTask.status === "submitted"
//                             ? "bg-green-100 text-green-800"
//                             : selectedTask.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : selectedTask.status === "approved"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-gray-100 text-gray-800"
//                             }`}
//                         >
//                           <div
//                             className={`w-2 h-2 rounded-full mr-2 ${selectedTask.status === "submitted"
//                               ? "bg-green-500"
//                               : selectedTask.status === "pending"
//                                 ? "bg-yellow-500"
//                                 : selectedTask.status === "approved"
//                                   ? "bg-blue-500"
//                                   : "bg-gray-500"
//                               }`}
//                           ></div>
//                           {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
//                         </span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule</label>
//                       <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                         {selectedTask.dates.map((dateObj, index) => {
//                           let displayDate: string
//                           if (typeof dateObj.date === "string") {
//                             displayDate = new Date(dateObj.date).toLocaleDateString()
//                           } else {
//                             displayDate = new Date(dateObj.date).toLocaleDateString()
//                           }
//                           displayDate = dateFormate(displayDate)

//                           return (
//                             <div
//                               key={index}
//                               className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
//                             >
//                               <div className="flex items-center gap-2">
//                                 <i className="fas fa-calendar-day text-blue-500 text-sm"></i>
//                                 <span className="text-gray-800 font-medium">{displayDate}</span>
//                               </div>
//                               <div className="flex items-center gap-2 ">
//                                 {dateObj.uploads.filter((u) => u.fileType === "image").length > 0 && (
//                                   <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
//                                     <i className="fas fa-image mr-1"></i>
//                                     {dateObj.uploads.filter((u) => u.fileType === "image").length}
//                                   </span>
//                                 )}
//                                 <label className="cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors">
//                                   <input
//                                     type="file"
//                                     multiple
//                                     accept="image/*"
//                                     className="hidden"
//                                     onChange={(e) => {
//                                       if (e.target.files && selectedTask._id && dateObj._id) {
//                                         handleImageUpload(e.target.files, selectedTask._id, dateObj._id)
//                                       }
//                                     }}
//                                     disabled={uploadingImages}
//                                   />
//                                   <i
//                                     className={`fas ${uploadingImages ? "fa-spinner fa-spin" : "fa-upload"} text-sm text-blue-500`}
//                                   ></i>
//                                 </label>
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Images Section */}
//                   {selectedTask.dates.some((d) => d.uploads.length > 0) && (
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-4">Uploaded Images</label>
//                       <div className="space-y-4">
//                         {selectedTask.dates.map((dateObj, dateIndex) => {
//                           if (dateObj.uploads.length === 0) return null

//                           let displayDate: string
//                           if (typeof dateObj.date === "string") {
//                             displayDate = new Date(dateObj.date).toLocaleDateString()
//                           } else {
//                             displayDate = new Date(dateObj.date).toLocaleDateString()
//                           }
//                           displayDate = dateFormate(displayDate)
//                           const imageFiles = dateObj.uploads.filter(upload => upload.fileType === "image")

//                           return (
//                             <div key={dateIndex} className="bg-gray-50 rounded-lg p-4">
//                               <div className="flex items-center gap-2 mb-3">
//                                 <i className="fas fa-calendar-day text-blue-500"></i>
//                                 <h4 className="font-semibold text-gray-800">{displayDate}</h4>
//                               </div>
//                               {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                                 {dateObj.uploads.map((upload, uploadIndex) => (
//                                   <div key={`${dateIndex}-${uploadIndex}`} className="relative group">
//                                     {upload.fileType === "image" ? (
//                                       <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm border">
//                                         <img
//                                           src={upload.url || NO_IMAGE}
//                                           alt={upload.originalName || "Uploaded image"}
//                                           className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
//                                           onClick={() => handleImageClick(upload.url, upload.originalName || "Image")}
//                                         />
//                                         <Button
//                                           isLoading={deleteFilePending}
//                                           onClick={() => handleDeleteFile(selectedTask._id!, dateObj._id!, upload._id!)}
//                                           className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
//                                         >
//                                           <i className="fas fa-trash text-xs"></i>
//                                         </Button>
//                                       </div>
//                                     ) : (
//                                       <div className="aspect-square bg-white rounded-lg flex items-center justify-center shadow-sm border">
//                                         <i className="fas fa-file-pdf text-3xl text-red-500"></i>
//                                       </div>
//                                     )}
//                                     <p className="text-xs text-gray-600 mt-2 truncate text-center">
//                                       {upload.originalName || "Uploaded file"}
//                                     </p>
//                                   </div>
//                                 ))}
//                               </div> */}

//                               <ImageGalleryExample
//                                 imageFiles={imageFiles}
//                                 handleDeleteFile={(imageId: string) =>
//                                   handleDeleteFile(selectedTask._id!, dateObj._id!, imageId)
//                                 }
//                                 // className="grid grid-cols-3"
//                                 height={80}
//                                 minWidth={98}
//                                 maxWidth={100}
//                               />
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="bg-gray-50 px-6 py-4 flex gap-3">
//                 <button
//                   onClick={handleEditTask}
//                   className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <i className="fas fa-edit"></i>
//                   Edit Task
//                 </button>
//                 <button
//                   onClick={handleDeleteTask}
//                   disabled={deleteWorkMutation.isPending}
//                   className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//                 >
//                   {deleteWorkMutation.isPending ? (
//                     <i className="fas fa-spinner fa-spin"></i>
//                   ) : (
//                     <i className="fas fa-trash"></i>
//                   )}
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }

//       {/* {
//         showImagePreview && previewImage && (
//           <div
//             onClick={() => setShowImagePreview(false)}
//             className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]"
//           >
//             <div className="relative max-w-4xl max-h-full">
//               <button
//                 onClick={() => setShowImagePreview(false)}
//                 className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//               <img
//                 src={previewImage.url || NO_IMAGE}
//                 alt={previewImage.name}
//                 className="max-w-full max-h-full object-contain rounded-lg"
//                 onClick={(e) => e.stopPropagation()}
//               />
//               <div className="absolute -bottom-12 left-0 text-white text-sm">{previewImage.name}</div>
//             </div>
//           </div>
//         )
//       } */}
//     </div >
//   )
// }

// export default DailySchedulePage



// START OF THIRD

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {

  useDeleteWork,
  useGetDailySchedule,
  useUploadDailyScheduleImages, useDeleteDailyScheduleImage
} from "./../../../apiList/Stage Api/workScheduleApi"

import CreateDailyScheduleForm from "./CreateDailyScheduleForm"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/Button"
import { toast } from "../../../utils/toast"
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"
import { socket } from "../../../lib/socket"
import { useCurrentSupervisor } from "../../../Hooks/useCurrentSupervisor"

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}

interface DailyTask {
  _id: string
  datePlanned: string
  room: string
  workDescription: string
  startTime: string
  endTime: string
  materialsNeeded: string[]
  manpower: number
  status: string
  uploadedImages: {
    date: string,
    uploads: {
      _id: string,
      fileType: string,
      url: string,
      originalName: string,
      uploadedAt: string,
    }[]
  }[]
}

interface ScheduleData {
  _id: string
  dailyTasks: DailyTask[]
  projectAssignee: any
}

const DailySchedulePage: React.FC = () => {
  const { projectId , organizationId} = useParams() as { projectId: string , organizationId:string}
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  // const [showTaskImages, setShowTaskImages] = useState(false)
  // const [uploadingImages, setUploadingImages] = useState(false)
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<DailyTask[]>([])
  const [showTaskList, setShowTaskList] = useState(false)
  const navigate = useNavigate()

  const { data: scheduleData, isLoading, error, refetch } = useGetDailySchedule(projectId!)
  const { mutateAsync: deleteWork } = useDeleteWork()
  const uploadImagesMutation = useUploadDailyScheduleImages()
  const deleteImageMutation = useDeleteDailyScheduleImage()


  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      const days: CalendarDay[] = []
      const currentDate = new Date(startDate)

      for (let i = 0; i < 42; i++) {
        days.push({
          date: new Date(currentDate),
          isCurrentMonth: currentDate.getMonth() === month,
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setCalendarDays(days)
    }

    generateCalendarDays()
  }, [currentMonth])

  const goToPreviousDate = useCallback(() => {
    if (!selectedDate) return;
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    handleDateClick(prevDate);
  }, [selectedDate]);

  const goToNextDate = useCallback(() => {
    if (!selectedDate) return;
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    handleDateClick(nextDate);
  }, [selectedDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if (!selectedDate) return;

      if (e.key === "Escape") {
        setSelectedDate(null);
        setSelectedTask(null);
        setShowTaskList(false);
      } else if (e.key === "ArrowRight") {
        goToNextDate(); // 👈 your function to go next
      } else if (e.key === "ArrowLeft") {
        goToPreviousDate(); // 👈 your function to go previous
      }
    };

    // if (showTaskForm) {
    //   document.addEventListener("keydown", handleKeyDown);
    //   document.body.style.overflow = "hidden";
    // }

    // return () => {
    //   document.removeEventListener("keydown", handleKeyDown);
    //   document.body.style.overflow = "unset";
    // };


    // Always attach listener once on mount
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextDate, goToPreviousDate]);


    const currentUser =useCurrentSupervisor()


  // Add this useEffect in your DailySchedulePage component
useEffect(() => {
  if (!socket || !organizationId) return;

  // 1. Task Created
  const handleTaskCreated = (data: {
    taskId: string;
    dailyTasks: any[];
    projectAssignee: any;
    supervisorCheck: any;
    createdBy: string;
    createdByRole: string;
  }) => {
    const { createdBy } = data;
    console.log("workinged created form teh socket 1294")
    // Only refetch if someone else created the task
    if (createdBy !== currentUser?.id) {
      refetch(); // Refetch entire schedule data
      
      toast({
        title: "New Task Created",
        description: `New work schedule created by ${data.createdByRole}`,
      });
    }
  };

  // 2. Task Updated
  const handleTaskUpdated = (data: {
    taskId: string;
    updatedData: {
      dailyTasks: any[];
      projectAssignee: any;
      supervisorCheck: any;
    };
    updatedBy: string;
    updatedByRole: string;
  }) => {
    const { updatedBy } = data;
    
     console.log('🔥 WebSocket Event Received:', data);
  console.log('👤 Current User ID:', currentUser?.id);

    // Only refetch if someone else updated the task
    if (updatedBy !== currentUser?.id) {
       console.log('✅ Refetching data... in weebsocket useEffect');
      refetch(); // Refetch entire schedule data
      
      toast({
        title: "Task Updated",
        description: `Work schedule updated by ${data.updatedByRole}`,
      });
      
      // If the updated task is currently being viewed, refresh it
      if (selectedTask && (selectedTask as any).scheduleId === data.taskId) {
        // Find and update the selected task
        const updatedScheduleData = scheduleData?.find((s: any) => s._id === data.taskId);
        if (updatedScheduleData) {
          const updatedTask = updatedScheduleData.dailyTasks.find((t: any) => t._id === selectedTask._id);
          if (updatedTask) {
            setSelectedTask({...updatedTask, scheduleId: data.taskId});
          }
        }
      }
    }
  };

  // 3. Task Deleted
  const handleTaskDeleted = (data: {
    scheduleId: string;
    taskId: string;
    deletedBy: string;
    deletedByRole: string;
  }) => {
    const {  taskId, deletedBy } = data;
    
    // Only update if someone else deleted the task
    if (deletedBy !== currentUser?.id) {
      refetch(); // Refetch entire schedule data
      
      toast({
        title: "Task Deleted",
        description: `Task deleted by ${data.deletedByRole}`,
      });
      
      // If the deleted task is currently being viewed, close the modal
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(null);
        setSelectedDate(null);
        setShowTaskList(false);
      }
    }
  };

  // 4. Image Uploaded to Task
  const handleImageUploaded = (data: {
    scheduleId: string;
    taskId: string;
    date: string;
    newImages: any[];
    uploadedBy: string;
    uploadedByRole: string;
  }) => {
    const {  taskId, date, newImages, uploadedBy } = data;
    
    // Only update if someone else uploaded images
    if (uploadedBy !== currentUser?.id) {
      // Update selectedTask if it matches
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(prev => {
          if (!prev) return prev;
          
          const updatedImages = [...(prev.uploadedImages || [])];
          const dateObj = new Date(date);
          const existingDateIndex = updatedImages.findIndex(
            (entry) => new Date(entry.date).toDateString() === dateObj.toDateString()
          );

          if (existingDateIndex !== -1) {
            // Add to existing date entry
            updatedImages[existingDateIndex] = {
              ...updatedImages[existingDateIndex],
              uploads: [...updatedImages[existingDateIndex].uploads, ...newImages]
            };
          } else {
            // Create new date entry
            updatedImages.push({
              date: dateObj.toISOString(),
              uploads: newImages
            });
          }

          return { ...prev, uploadedImages: updatedImages };
        });
      }
      
      toast({
        title: "Images Uploaded",
        description: `New images uploaded by ${data.uploadedByRole}`,
      });
    }
  };

  // 5. Image Deleted from Task
  const handleImageDeleted = (data: {
    scheduleId: string;
    taskId: string;
    date: string;
    imageId: string;
    remainingImages: any[];
    deletedBy: string;
    deletedByRole: string;
  }) => {
    const {  taskId, date,  remainingImages, deletedBy } = data;
    
    // Only update if someone else deleted the image
    if (deletedBy !== currentUser?.id) {
      // Update selectedTask if it matches
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(prev => {
          if (!prev) return prev;
          
          const updatedImages = prev.uploadedImages?.map((group) => {
            if (group.date.split("T")[0] === date) {
              return {
                ...group,
                uploads: remainingImages // Use the remaining images from backend
              };
            }
            return group;
          });

          return { ...prev, uploadedImages: updatedImages };
        });
      }
      
      toast({
        title: "Image Deleted",
        description: `Image deleted by ${data.deletedByRole}`,
      });
    }
  };

  // Register all event listeners
  socket.on('workSchedule:task_created', handleTaskCreated);
  socket.on('workSchedule:task_updated', handleTaskUpdated);
  socket.on('workSchedule:task_deleted', handleTaskDeleted);
  socket.on('workSchedule:image_uploaded', handleImageUploaded);
  socket.on('workSchedule:image_deleted', handleImageDeleted);

  
  // Cleanup function
  return () => {
    socket.off('workSchedule:task_created', handleTaskCreated);
    socket.off('workSchedule:task_updated', handleTaskUpdated);
    socket.off('workSchedule:task_deleted', handleTaskDeleted);
    socket.off('workSchedule:image_uploaded', handleImageUploaded);
    socket.off('workSchedule:image_deleted', handleImageDeleted);
  };
}, [organizationId, currentUser?.id, selectedTask, scheduleData, showTaskList]);



useEffect(() => {
  socket.on('workSchedule:task_created', (data) => {
    console.log('🎯 Received task_created:', data);
    toast({title:"success", description:"created task for socket chekcing in the chrom "})
  });
}, []);

// useEffect(() => {
//   if (!socket || !organizationId) return;
// console.log("📡 Sending 'join_project' for project:", organizationId);
//   socket.emit("join_project", { organizationId });
// }, [socket, organizationId]);


  // const getTasksForDate = (date: Date) => {
  //   const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  //   const allTasks = scheduleData.flatMap((doc: any) => doc.dailyTasks || []);


  //   return allTasks.filter((task: any) => {
  //     const taskDateStr =
  //       typeof task.datePlanned === "string"
  //         ? task.datePlanned.split("T")[0]
  //         : new Date(task.datePlanned).toISOString().split("T")[0];
  //     return taskDateStr === dateStr;
  //   });
  // };

  // const handleDateClick = (date: Date) => {
  //   const tasks = getTasksForDate(date)
  //   setSelectedDate(date)
  //   setTasksForSelectedDate(tasks)

  //   if (tasks.length === 1) {
  //     setSelectedTask(tasks[0])
  //     setShowTaskList(false)
  //   } else if (tasks.length > 1) {
  //     setShowTaskList(true)
  //     setSelectedTask(null)
  //   }
  // }

  const formatLocalDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getTasksForDate = (date: Date) => {
    // const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const dateStr = formatLocalDate(date); // Local YYYY-MM-DD


    // scheduleData is the array of DailyTaskSubSchema documents
    return scheduleData.flatMap((doc: any) => {
      const tasks = doc.dailyTasks || [];

      // Map tasks to include the top-level _id of the document
      return tasks
        .filter((task: any) => {
          const taskDateStr =
            typeof task.datePlanned === "string"
              ? task.datePlanned.split("T")[0]
              : new Date(task.datePlanned).toISOString().split("T")[0];
          return taskDateStr === dateStr;
        })
        .map((task: any) => ({
          ...task,
          scheduleId: doc._id, // add top-level document _id
        }));
    });
  };


  const handleDateClick = (date: Date) => {
    const tasks = getTasksForDate(date);
    setSelectedDate(date);
    setTasksForSelectedDate(tasks);

    if (tasks.length === 1) {
      setSelectedTask(tasks[0]); // task now includes scheduleId
      setShowTaskList(false);
    } else if (tasks.length > 1) {
      setShowTaskList(true);
      setSelectedTask(null);
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-200 text-green-800"
      case "in_progress":
        return "bg-yellow-200 text-yellow-800"
      case "planned":
        return "bg-blue-200 text-blue-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }


  const handleEnableEditTask = (scheduleId: string) => {
    // find the parent schedule doc
    // const parentSchedule = scheduleData.find((schedule: any) =>
    //   schedule.dailyTasks.some((day: any) =>
    //     day.dailySubTasks.some((subTask: any) => subTask._id === taskId)
    //   )
    // );


    const doc = scheduleData.find((schedule: any) => schedule._id === scheduleId);

    if (doc) {
      setEditingTask(doc);  // this will now contain the entire document
      setShowTaskForm(true);
    }
  };



  // use thi for updating the tasks
  // const handleEditTask = (id:string) => {
  //   // const scheduleWithTask = scheduleData?.find((s: ScheduleData) => s.dailyTasks.some((t) => t._id === task._id))
  //   const scheduleWithTask = scheduleData.find((schedule:any)=> schedule._id === id)
  //   setEditingTask(scheduleWithTask)
  //   setShowTaskForm(true)
  // }

  const handleDeleteTask = async (task: any) => {
    try {

      await deleteWork({ scheduleId: task.scheduleId, taskId: task._id, projectId: projectId })
      setSelectedDate(null)
      setSelectedTask(null)
      refetch()
      toast({ title: "Success", description: "deleted successfully" })

    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "failed to delete", variant: "destructive" })
    }
  }


  // used to upload image for the dailytask uploads , like worker if they need to upload 
  const handleImageUpload = async (files: File[], task: DailyTask) => {
    if (!selectedDate) return

    try {
      const scheduleId = scheduleData?.find((s: ScheduleData) => s.dailyTasks.some((t) => t._id === task._id))?._id

      if (scheduleId) {
        const uploadedImages = await uploadImagesMutation.mutateAsync({
          scheduleId,
          taskId: task._id,
          date: selectedDate.toISOString().split("T")[0],
          projectId: projectId,
          files,
        })

        refetch()

        setSelectedTask(prev => {
          if (!prev) return prev;

          // check if there is already an entry for this date
          const existingDateGroup = prev.uploadedImages?.find(
            g => new Date(g.date).toDateString() === selectedDate.toDateString()
          );

          if (existingDateGroup) {
            // append newly uploaded files
            existingDateGroup.uploads.push(...uploadedImages.uploads);
            return { ...prev, uploadedImages: [...prev.uploadedImages] };
          } else {
            // add new date entry
            return { ...prev, uploadedImages: [...(prev.uploadedImages || []), uploadedImages] };
          }
        });


        //   const uploads  = uploadedImages; // contains array with _id, url, etc.

        // setSelectedTask((prev: any) => {
        //   if (!prev) return prev;

        //   const updatedImages = [...(prev.uploadedImages || [])];
        //   const existingDateIndex = updatedImages.findIndex(
        //     (entry) =>
        //       new Date(entry.date).toDateString() ===
        //       new Date(selectedDate).toDateString()
        //   );

        //   if (existingDateIndex !== -1) {
        //     // merge into same date entry
        //     updatedImages[existingDateIndex] = {
        //       ...updatedImages[existingDateIndex],
        //       uploads: [
        //         ...updatedImages[existingDateIndex].uploads,
        //         ...uploads, // 👈 now with _id
        //       ],
        //     };
        //   } else {
        //     // create new date entry
        //     updatedImages.push({
        //       date: selectedDate,
        //       uploads,
        //     });
        //   }

        //   return {
        //     ...prev,
        //     uploadedImages: updatedImages,
        //   };
        // });

        toast({ title: "Success", description: "image uploaded successfully" })
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "failed to upload", variant: "destructive" })
    }
  }

  const handleImageDelete = async (imageId: string, task: DailyTask) => {
    try {
      const scheduleId = scheduleData?.find((s: ScheduleData) => s.dailyTasks.some((t) => t._id === task._id))?._id

      if (scheduleId) {
        // console.log("work maing the scuekndlahflsjkkkkkkkkk")

        const uploadedImages = await deleteImageMutation.mutateAsync({
          scheduleId,
          taskId: task._id,
          date: selectedDate?.toISOString().split("T")[0] || "",
          projectId: projectId,
          imageId,
        })

        console.log("upladsImages", uploadedImages)
        refetch()

        //     setSelectedTask(prev => {
        //   if (!prev) return prev;

        //   const updatedImages = prev.uploadedImages?.map(group => {
        //     // console.log("group before merge:", group); // 👈 inspect the current group
        //     if (group.date.split("T")[0] === selectedDate!.toISOString().split("T")[0]) {
        //       // console.log("Replacing uploads with backend:", uploadedImages.uploads);
        //       console.log("group",group)
        //       return {
        //         ...group,
        //         uploads: uploadedImages.uploads, // replace entirely
        //       };
        //     }
        //     return group;
        //   });

        //   console.log("updatedImages after merge:", updatedImages); // final array
        //   return { ...prev, uploadedImages: updatedImages };
        // });

        //  const updatedDateGroup = uploadedImages; // ← Should be { date: "", uploads: [] }

        const currentDate = selectedDate?.toISOString().split("T")[0] || "";
        // ✅ Update selected task without full refetch
        setSelectedTask((prev) => {
          if (!prev) return prev;

          const updatedImages = prev.uploadedImages?.map((group) => {
            if (group.date.split("T")[0] === currentDate) {
              return {
                ...group,
                uploads: group.uploads.filter((img) => img._id !== imageId),
              };
            }
            return group;
          });

          return { ...prev, uploadedImages: updatedImages };
        });

        toast({ title: "Success", description: "deleted successfully" })
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "failed to delete", variant: "destructive" })

    }
  }


  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
          <p className="text-red-600">Error loading schedule data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-full overflow-y-auto bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer" onClick={() => {
              navigate(-1)
            }}>
              <i className="fas fa-arrow-left mr-1 "></i>
              back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Work Schedule Calendar</h1>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add Events
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded">
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-100">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const tasksForDay = getTasksForDate(day.date)
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    }`}
                  onClick={() => handleDateClick(day.date)}
                >
                  <div className="font-medium text-sm mb-1">{day.date.getDate()}</div>
                  {tasksForDay.length === 0 ? (
                    <div className="text-xs text-gray-400 italic">No tasks assigned</div>
                  ) : (
                    <div className="space-y-1">
                      {tasksForDay.slice(0, 2).map((task: any, idx: number) => (
                        <div key={idx} className={`text-xs p-1 rounded truncate ${getStatusColor(task.status)}`}>
                          {task.workDescription || task.room}
                        </div>
                      ))}
                      {tasksForDay.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">+{tasksForDay.length - 2} more</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {selectedDate && (
            <div onClick={() => {
              setEditingTask(null)
              setSelectedDate(null)
              setSelectedTask(null)
              setShowTaskList(false)
            }} className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-around z-50">

              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🛑 prevent background click
                  goToPreviousDate();
                }}
                className="p-2 text-gray-600 bg-gray-50 hover:text-gray-900"
              >
                <i className="fas fa-chevron-left"></i>

              </button>
              <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Tasks for {selectedDate.toLocaleDateString()}</h3>
                  <button
                    onClick={() => {
                      setEditingTask(null)
                      setSelectedDate(null)
                      setSelectedTask(null)
                      setShowTaskList(false)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                {tasksForSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-calendar-times text-4xl mb-4"></i>
                    <p className="text-lg">No tasks assigned for this date</p>
                  </div>
                ) : showTaskList && tasksForSelectedDate.length > 1 ? (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold mb-4">Select a task to view details:</h4>
                    {tasksForSelectedDate.map((task, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedTask(task)
                          setShowTaskList(false)
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold text-lg">{task.workDescription}</h5>
                            <p className="text-gray-600">Room: {task.room}</p>
                            <p className="text-gray-600">
                              Time: {task.startTime} - {task.endTime}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {/* <Button onClick={() => {
                            setEditingTask(task)

                            setShowTaskForm(true);
                          }}>Edit Task</Button> */}
                        </div>
                      </div>
                    ))}


                  </div>
                ) : selectedTask ? (
                  <div className="space-y-6">
                    {tasksForSelectedDate.length > 1 && (
                      <button
                        onClick={() => {
                          setShowTaskList(true)
                          setSelectedTask(null)
                        }}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to task list
                      </button>
                    )}

                    <div className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold">{selectedTask.workDescription}</h4>
                        <span className={`px-3 py-1 rounded text-sm ${getStatusColor(selectedTask.status)}`}>
                          {selectedTask.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-6 text-gray-700 mb-6">
                        <div>
                          <p className="mb-2">
                            <strong>Room/Unit:</strong> {selectedTask.room}
                          </p>
                          <p className="mb-2">
                            <strong>Time:</strong> {selectedTask.startTime} - {selectedTask.endTime}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2">
                            <strong>Materials:</strong> {selectedTask.materialsNeeded?.join(", ") || "None"}
                          </p>
                          <p className="mb-2">
                            <strong>Manpower:</strong> {selectedTask.manpower}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-lg font-semibold">Task Images</h5>
                          <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer transition-colors">
                            {uploadImagesMutation.isPending && <span className="animate-spin fas fa-spinner mr-1"></span>}
                            <i className="fas fa-upload mr-2"></i>
                            Upload Images
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleImageUpload(Array.from(e.target.files), selectedTask)
                                }
                              }}
                            />
                          </label>
                        </div>

                        {selectedTask?.uploadedImages && selectedTask?.uploadedImages.length > 0 ? (
                          <div className="">
                            {/* {selectedTask?.uploadedImages?.map((imgGroup) =>
                              Array.isArray(imgGroup?.uploads) && imgGroup?.uploads?.length > 0 ?
                                // <div className="grid grid-cols-3 gap-4">

                                //    { imgGroup?.uploads.map((file, imgIdx) => (
                                //       <div key={`${groupIdx}-${imgIdx}`} className="relative group">
                                //         <img
                                //           src={file?.url || NO_IMAGE}
                                //           alt={`Task image ${imgIdx + 1}`}
                                //           className="w-full h-32 object-cover rounded-lg border shadow-sm"
                                //         />
                                //         <button
                                //           onClick={() => handleImageDelete(file._id, selectedTask)}
                                //           className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                //         >
                                //           <i className="fas fa-times"></i>
                                //         </button>
                                //       </div>
                                //     ))}
                                //      </div>

                                <ImageGalleryExample
                                  imageFiles={imgGroup?.uploads}
                                  handleDeleteFile={(imgId: string) =>
                                    handleImageDelete(imgId!, selectedTask)
                                  }
                                  refetch={refetch}
                                  height={120}
                                  minWidth={120}
                                  maxWidth={140}
                                />
                                :
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                  <i className="fas fa-images text-3xl mb-2"></i>
                                  <p>No images uploaded for this task main</p>
                                </div>
                            )} */}

{(() => {
  const groups = (selectedTask?.uploadedImages || []).reduce(
    (acc: Record<string, any[]>, imgGroup: any) => {
      if (!Array.isArray(imgGroup?.uploads) || imgGroup.uploads.length === 0) return acc;

      // Normalize dateKey from imgGroup.date -> "YYYY-MM-DD" (fallback to raw value)
      let dateKey = "Unknown Date";
      if (imgGroup?.date) {
        const parsed = new Date(imgGroup.date);
        dateKey = !isNaN(parsed.getTime()) ? parsed.toISOString().split("T")[0] : String(imgGroup.date);
      }

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(...imgGroup.uploads); // merge uploads for same date
      return acc;
    },
    {}
  );

  const dateKeys = Object.keys(groups);
  if (dateKeys.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <i className="fas fa-images text-3xl mb-2" />
        <p>No images uploaded for this task</p>
      </div>
    );
  }

  // // Optional: sort newest-first. Remove or change comparator if you want another order.
  // dateKeys.sort((a, b) => {
  //   const da = new Date(a).getTime();
  //   const db = new Date(b).getTime();
  //   // if either is Invalid Date (NaN), keep original order by falling back to string compare
  //   if (isNaN(da) || isNaN(db)) return a.localeCompare(b);
  //   return db - da;
  // });

  return dateKeys.map((dateKey) => (
    <div key={dateKey} className="mb-4">
      {/* <h3 className="text-sm font-semibold text-gray-600 mb-2">{dateKey}</h3> */}
      <ImageGalleryExample
        imageFiles={groups[dateKey]}
        handleDeleteFile={(imgId: string) => handleImageDelete(imgId!, selectedTask)}
        refetch={refetch}
        height={120}
        minWidth={120}
        maxWidth={140}
      />
    </div>
  ));
})()}


                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <i className="fas fa-images text-3xl mb-2"></i>
                            <p>No images uploaded for this task</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex gap-3 pt-4 border-t">
                        {/* <button
                          onClick={() => handleEditTask(selectedTask)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                          <i className="fas fa-edit mr-2"></i>Edit Task
                        </button> */}
                        <button
                          onClick={() => handleDeleteTask(selectedTask)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                          <i className="fas fa-trash mr-2"></i>Delete Task
                        </button>



                        <Button onClick={() => handleEnableEditTask((selectedTask as any).scheduleId)}>Edit Task</Button>
                      </div>
                    </div>
                  </div>
                ) : tasksForSelectedDate.length === 1 ? (
                  (() => {
                    setSelectedTask(tasksForSelectedDate[0])
                    return null
                  })()
                ) : null}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🛑 prevent background click
                  goToNextDate();
                }}
                className="p-2 text-gray-600  bg-gray-50 hover:text-gray-900"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}

          {showTaskForm && (
            <CreateDailyScheduleForm
              projectId={projectId}
              isOpen={showTaskForm}
              onClose={() => {
                setShowTaskForm(false)
                setEditingTask(null)
              }}
              onSave={() => {
                // console.log("Saving:", data)
                setShowTaskForm(false)
              }}
              refetch={refetch}
              scheduleId={editingTask ? (selectedTask as any).scheduleId : null}
              editData={editingTask}
              onUpdate={() => {

                setSelectedDate(null);
                setSelectedTask(null);
                setShowTaskList(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DailySchedulePage
