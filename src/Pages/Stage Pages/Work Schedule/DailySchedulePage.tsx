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
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="text-center bg-brand-main border border-ash-medium shadow-sm w-full">
          <i className="fas fa-exclamation-triangle text-4xl text-action-danger mb-4"></i>
          <p className="text-text-main">Oops Something went Wrong...</p>
        </div>
      </div>
    )
  }


  const child = location.pathname.includes("workreport")
  if (child) {
    return <Outlet />
  }

  return (
    <div className="max-h-full overflow-y-auto bg-brand-surface">
      <div className=" mx-auto px-4 py-8">
        <div className="bg-brand-surface rounded-lg shadow-lg p-6">
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                // className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer" 
                className="bg-brand-surface border border-ash-medium hover:bg-brand-ash text-text-muted hover:text-text-main rounded-lg w-10 h-10 flex items-center justify-center transition-colors shadow-sm shrink-0"
                onClick={() => {
                  navigate(-1)
                }}>
                <i className="fas fa-arrow-left mr-1 "></i>
              </button>
              {/* <h1 className="text-3xl font-bold text-gray-800">Work Schedule Calendar</h1> */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-text-muted hidden sm:inline-block"></i>
                  Work Schedule Calendar
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Manage project timeline and tasks</p>
              </div>
            </div>
            <div className="flex gap-2">
              {canCreate && <Button
                variant="dark"
                onClick={() => setShowTaskForm(true)}
                className="flex-1 sm:flex-none shadow-sm px-6"
              >
                <i className="fas fa-plus mr-2"></i> Add Events
              </Button>}


              <Button
                variant="white"
                className="flex-1 sm:flex-none border-ash-medium text-text-main shadow-sm transition-colors"
                onClick={() => navigate(`workreport`)}
              >
                <i className="fas fa-file-lines mr-2"></i> Work Reports
              </Button>

            </div>
          </header>

          {/* <section className="flex justify-between items-center mb-4"> */}
          <section className="flex justify-between items-center mb-4 bg-brand-ash border border-ash-light rounded-xl p-2 shadow-sm">
           <button onClick={() => navigateMonth(-1)} className="w-10 h-10 flex items-center justify-center hover:bg-brand-surface border border-transparent hover:border-ash-medium text-text-muted hover:text-text-main rounded-lg transition-colors shadow-sm">
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="text-base sm:text-lg font-bold text-text-main tracking-wide">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="w-10 h-10 flex items-center justify-center hover:bg-brand-surface border border-transparent hover:border-ash-medium text-text-muted hover:text-text-main rounded-lg transition-colors shadow-sm">
              <i className="fas fa-chevron-right"></i>
            </button>
          </section>

          {/* Calendar Grid */}
          <section className="grid grid-cols-7 gap-1 mb-4 bg-ash-light border border-ash-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              // <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-100">
              <div key={day} className="p-3 text-center font-bold text-[10px] sm:text-xs uppercase tracking-wider text-text-muted bg-brand-ash">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const tasksForDay = getTasksForDate(day.date)
              return (
                <div
                  key={index}
                  // className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                  //   }`}
                  className={`min-h-[100px] sm:min-h-[120px] p-1.5 sm:p-2 transition-colors cursor-pointer ${
                    day.isCurrentMonth ? "bg-brand-surface hover:bg-brand-ash/50" : "bg-brand-ash/30 opacity-60"
                  }`}
                  onClick={() => handleDateClick(day.date)}
                >
                  {/* <div className="font-medium text-sm mb-1">{day.date.getDate()}</div> */}
                  <div className={`font-bold text-xs sm:text-sm mb-1.5 ml-1 ${day.isCurrentMonth ? "text-text-main" : "text-text-muted"}`}>
                    {day.date.getDate()}
                  </div>
                  {tasksForDay.length === 0 ? (
                    // <div className="text-xs text-gray-400 italic">No tasks assigned</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/40 hidden sm:block ml-1">No tasks</div>
                  ) : (
                    <div className="space-y-1">
                      {tasksForDay.slice(0, 2).map((task: any, idx: number) => (
                        <div key={idx} className={`text-[9px] sm:text-[10px] font-bold p-1.5 rounded shadow-sm truncate border border-black/5 ${getStatusColor(task.status)}`}>
                          {task.workDescription || task.room}
                        </div>
                      ))}
                      {tasksForDay.length > 2 && (
                        // <div className="text-xs text-blue-600 font-medium">+{tasksForDay.length - 2} more</div>
                        <div className="text-[9px] sm:text-[10px] font-bold text-action-primary bg-action-primary/10 border border-action-primary/20 px-1.5 py-0.5 rounded w-max">
                          +{tasksForDay.length - 2} more
                        </div>
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
            }} 
            // className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-around z-50"
            className="fixed inset-0 z-[50] bg-brand-main/90 backdrop-blur-sm flex items-center justify-between sm:justify-center p-2 sm:p-4 gap-2"
            >

              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🛑 prevent background click
                  goToPreviousDate();
                }}
                // className="p-2 text-gray-600 bg-gray-50 hover:text-gray-900"
                className="w-10 h-10 shrink-0 bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash rounded-full items-center justify-center transition-colors shadow-lg hidden sm:flex"
              >
                <i className="fas fa-chevron-left"></i>

              </button>
              <div onClick={(e) => e.stopPropagation()} 
              // className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              className="bg-brand-surface border border-ash-medium rounded-xl shadow-2xl p-5 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200 flex-1 sm:flex-none relative"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-ash-light">
                  {/* <h3 className="text-xl font-bold">Tasks for {selectedDate.toLocaleDateString()}</h3> */}
                  <h3 className="text-lg sm:text-xl font-bold text-text-main flex items-center gap-2">
                    <i className="fa-regular fa-calendar-check text-text-muted"></i>
                    Tasks for {selectedDate.toLocaleDateString()}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex sm:hidden gap-1 mr-2 border-r border-ash-light pr-3">
                        <button onClick={goToPreviousDate} className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-main bg-brand-ash rounded border border-ash-light"><i className="fas fa-chevron-left"></i></button>
                        <button onClick={goToNextDate} className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-main bg-brand-ash rounded border border-ash-light"><i className="fas fa-chevron-right"></i></button>
                    </div>
                  <button
                    onClick={() => {
                      setEditingTask(null)
                      setSelectedDate(null)
                      setSelectedTask(null)
                      setShowTaskList(false)
                    }}
                    // className="text-gray-500 hover:text-gray-700"
                    className="w-8 h-8 flex items-center justify-center bg-brand-surface border border-ash-medium text-text-muted hover:text-action-danger hover:bg-red-50 hover:border-red-200 rounded-full transition-colors shadow-sm"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                    </div>
                </div>

                {tasksForSelectedDate.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
                    <i className="fas fa-calendar-times text-4xl text-ash-dark mb-4"></i>
                    <p className="text-text-main font-bold">No tasks assigned for this date</p>
                  </div>
                ) : showTaskList && tasksForSelectedDate.length > 1 ? (
                  <div className="space-y-3">
                    {/* <h4 className="text-lg font-semibold mb-4">Select a task to view details:</h4> */}
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Select a task to view details</h4>
                    {tasksForSelectedDate.map((task, index) => (
                      <div
                        key={index}
                        // className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        className="bg-brand-ash/30 border border-ash-medium rounded-xl p-4 cursor-pointer hover:bg-brand-surface hover:shadow-md hover:border-text-muted transition-all group"
                        onClick={() => {
                          setSelectedTask(task)
                          setShowTaskList(false)
                        }}
                      >
                        {/* <div className="flex justify-between items-center"> */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                           <h5 className="font-bold text-text-main text-base group-hover:text-action-primary transition-colors mb-1.5">{task.workDescription}</h5>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                                <span><i className="fas fa-door-open mr-1"></i> {task.room}</span>
                                <span><i className="fa-regular fa-clock mr-1"></i> {task.startTime} - {task.endTime}</span>
                              </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border border-black/5 ${getStatusColor(task.status)}`}>
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
                        // className="text-blue-600 hover:text-blue-800 mb-4"
                        className="text-[11px] font-bold uppercase tracking-wider text-text-muted hover:text-action-primary flex items-center transition-colors mb-2"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to task list
                      </button>
                    )}

                    {/* <div className="border rounded-lg p-6"> */}
                    <div className="bg-brand-surface border border-ash-medium rounded-xl overflow-hidden shadow-sm">
                      {/* <div className="flex justify-between items-start mb-4"> */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-brand-ash border-b border-ash-medium gap-3">
                        <h4 className="text-lg font-bold text-text-main">{selectedTask.workDescription}</h4>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border border-black/5 ${getStatusColor(selectedTask.status)}`}>
                          {selectedTask.status}
                        </span>
                      </div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 text-sm">
                      <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <i className="fas fa-door-open text-text-muted mt-1 w-4 text-center"></i>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Room/Unit</span>
                              <span className="font-bold text-text-main">{selectedTask.room}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <i className="fa-regular fa-clock text-text-muted mt-1 w-4 text-center"></i>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Time</span>
                              <span className="font-bold text-text-main">{selectedTask.startTime} - {selectedTask.endTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <i className="fas fa-boxes-stacked text-text-muted mt-1 w-4 text-center"></i>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Materials</span>
                              <span className="font-bold text-text-main">{selectedTask.materialsNeeded?.join(", ") || "None"}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <i className="fas fa-users-gear text-text-muted mt-1 w-4 text-center"></i>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Manpower</span>
                              <span className="font-bold text-text-main">{selectedTask.manpower}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 border-t border-ash-light">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                            <i className="fas fa-images"></i> Task Images
                          </h5>
                          {(canCreate || canEdit) && (
                            <label className="bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
                              {uploadImagesMutation.isPending ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
                              Upload
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
                          )}
                        </div>

                        {selectedTask?.uploadedImages && selectedTask?.uploadedImages.length > 0 ? (
                          <div >
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
                                 <div className="text-center py-6 border border-dashed border-ash-medium bg-brand-ash/30 rounded-xl">
                                    <i className="fas fa-images text-2xl text-ash-dark mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No images uploaded for this task</p>
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
                                // <div key={dateKey} className="mb-4">
                                <div key={dateKey} className="mb-4 bg-brand-ash/30 border border-ash-light p-3 rounded-xl">
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
                         <div className="text-center py-6 border border-dashed border-ash-medium bg-brand-ash/30 rounded-xl">
                            <i className="fas fa-image text-2xl text-ash-dark mb-2"></i>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No images uploaded for this task</p>
                          </div>
                        )}
                      </div>

                     <div className="p-5 border-t border-ash-light flex flex-wrap gap-2 justify-end bg-brand-ash/50">
                        {canDelete && (
  <Button
    variant="ghost"
    onClick={() => handleDeleteTask(selectedTask)}
    className="text-text-muted hover:text-text-main hover:bg-brand-ash border border-transparent hover:border-ash-medium transition-colors shadow-sm"
  >
    <i className="fas fa-trash-can mr-2"></i>Delete
  </Button>
)}
                        {(canEdit || canCreate) && (
                          <> 
                            <Button 
                              variant="white" 
                              className="border-ash-medium shadow-sm text-text-main" 
                              onClick={() => handleEnableEditTask((selectedTask as any).scheduleId)}
                            >
                              <i className="fas fa-pen-to-square mr-2"></i>Edit Task
                            </Button>
                            <Button 
                              variant="dark" 
                              className="shadow-sm" 
                              onClick={() => handleCreateReport((selectedTask as any).scheduleId)}
                            >
                              <i className="fas fa-file-invoice mr-2"></i>Create Report
                            </Button>
                          </>
                        )}
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
                // className="p-2 text-gray-600  bg-gray-50 hover:text-gray-900"
                className="w-10 h-10 shrink-0 bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash rounded-full flex items-center justify-center transition-colors shadow-lg  sm:flex"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}



          {showWorkReport && selectedScheduleIdForWr && (
            // <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="fixed inset-0 z-[9999] bg-brand-main/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div
                onClick={() => {
                  setShowWorkReport(false);
                  setSelectedScheduleIdForWr(null);
                }}
                className="absolute inset-0"
              />

              <div
                onClick={(e) => e.stopPropagation()}
                // className="relative z-10 bg-white rounded-lg shadow-lg max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto p-6"
                className="relative z-10 bg-brand-surface rounded-xl shadow-2xl border border-ash-medium max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-ash-light">
                  <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                     <i className="fas fa-file-invoice text-text-muted"></i> Create Work Report
                  </h2>
                  <button
                    // className="text-gray-500 hover:text-red-600 text-xl"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface border border-ash-medium text-text-muted hover:text-action-danger hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
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
