import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {

  useDeleteWork,
  useGetDailySchedule,
  useUploadDailyScheduleImages, useDeleteDailyScheduleImage
} from "./../../../apiList/Stage Api/workScheduleApi"

import CreateDailyScheduleForm from "./CreateDailyScheduleForm"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/Button"
import { toast } from "../../../utils/toast"
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain"
import { socket } from "../../../lib/socket"
import { useCurrentSupervisor } from "../../../Hooks/useCurrentSupervisor"
import CreateWorkReport from "./CreateWorkReport"
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"
import { useAuthCheck } from "../../../Hooks/useAuthCheck"

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
  const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string }
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
  const [showWorkReport, setShowWorkReport] = useState(false)
  const [selectedScheduleIdForWr, setSelectedScheduleIdForWr] = useState<string | null>(null);

  const navigate = useNavigate()

  const { data: scheduleData, isLoading, error, refetch } = useGetDailySchedule(projectId!)
  const { mutateAsync: deleteWork } = useDeleteWork()
  const uploadImagesMutation = useUploadDailyScheduleImages()
  const deleteImageMutation = useDeleteDailyScheduleImage()



  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.workschedule?.delete;
  // const canList = role === "owner" || permission?.workschedule?.list;
  const canCreate = role === "owner" || permission?.workschedule?.create;
  const canEdit = role === "owner" || permission?.workschedule?.create;



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


  const currentUser = useCurrentSupervisor()


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
              setSelectedTask({ ...updatedTask, scheduleId: data.taskId });
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
      const { taskId, deletedBy } = data;

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
      const { taskId, date, newImages, uploadedBy } = data;

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
      const { taskId, date, remainingImages, deletedBy } = data;

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


  const handleCreateReport = (scheduleId: string) => {
    setSelectedScheduleIdForWr(scheduleId);
    setShowWorkReport(true);
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

        await deleteImageMutation.mutateAsync({
          scheduleId,
          taskId: task._id,
          date: selectedDate?.toISOString().split("T")[0] || "",
          projectId: projectId,
          imageId,
        })

        // console.log("upladsImages", uploadedImages)
        refetch()


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
      <MaterialOverviewLoading />
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


  const child = location.pathname.includes("workreport")
  if (child) {
    return <Outlet />
  }

  return (
    <div className="max-h-full overflow-y-auto bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <header className="flex justify-between items-center mb-6">
            <button className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer" onClick={() => {
              navigate(-1)
            }}>
              <i className="fas fa-arrow-left mr-1 "></i>
              back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Work Schedule Calendar</h1>
            <div className="flex gap-2">
             {canCreate && <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Events
              </button>}


              <button className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer" onClick={() => {
                navigate(`workreport`)
              }}>
                <i className="fas fas-file-lines mr-1 "></i>
                Work Report Lists
              </button>

            </div>
          </header>

          <section className="flex justify-between items-center mb-4">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded">
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded">
              <i className="fas fa-chevron-right"></i>
            </button>
          </section>

          {/* Calendar Grid */}
          <section className="grid grid-cols-7 gap-1 mb-4">
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
          </section>


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
                          {(canCreate || canEdit) && <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer transition-colors">
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
                          </label>}
                        </div>

                        {selectedTask?.uploadedImages && selectedTask?.uploadedImages.length > 0 ? (
                          <div className="">
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
                                    {...(canDelete ? { handleDeleteFile: (imgId: string) => handleImageDelete(imgId!, selectedTask) } : {})}

                                    // handleDeleteFile={(imgId: string) => handleImageDelete(imgId!, selectedTask)}
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
                        {canDelete && <button
                          onClick={() => handleDeleteTask(selectedTask)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                          <i className="fas fa-trash mr-2"></i>Delete Task
                        </button>}



                       {(canEdit || canCreate) && <> <Button onClick={() => handleEnableEditTask((selectedTask as any).scheduleId)}>Edit Task</Button>
                        <Button onClick={() => handleCreateReport((selectedTask as any).scheduleId)}>Create Report</Button></>}
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



          {showWorkReport && selectedScheduleIdForWr && (
            <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div
                onClick={() => {
                  setShowWorkReport(false);
                  setSelectedScheduleIdForWr(null);
                }}
                className="absolute inset-0"
              />

              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 bg-white rounded-lg shadow-lg max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-700">Create Work Report</h2>
                  <button
                    className="text-gray-500 hover:text-red-600 text-xl"
                    onClick={() => {
                      setShowWorkReport(false);
                      setSelectedScheduleIdForWr(null);
                    }}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>

                <CreateWorkReport
                  dailyScheduleId={selectedScheduleIdForWr}
                  key={selectedScheduleIdForWr} // will re-initialize on reopen
                  date={selectedTask?.datePlanned!}
                  dailyTaskId={selectedTask?._id!}
                />
              </div>
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
              scheduleId={editingTask ? (selectedTask as any)?.scheduleId : null}
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
