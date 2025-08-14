import {  Outlet, useLocation, useParams, useOutletContext } from "react-router-dom";
import {
  useCompleteInstallation,
  useGetInstallationDetails,
  useSetInstallationDeadline,
  useUpdateInstallationTaskStatus,
} from "../../../apiList/Stage Api/installationWorkApi";
import { toast } from "../../../utils/toast";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { NO_IMAGE } from './../../../constants/constants';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

// Define context type
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

// export const roomKeys = [
//   "LivingRoom",
//   "Bedroom",
//   "Kitchen",
//   "DiningRoom",
//   "Balcony",
//   "FoyerArea",
//   "Terrace",
//   "StudyRoom",
//   "CarParking",
//   "Garden",
//   "StorageRoom",
//   "EntertainmentRoom",
//   "HomeGym",
// ];

export default function InstallationOverview() {
  const { projectId, organizationId } = useParams();
  const location = useLocation();

  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
   const [showImagePreview, setShowImagePreview] = useState(false)
    const [previewImage, setPreviewImage] = useState<string>("")

  const isChildRoute = location.pathname.includes("/installationroom");

  const {
    data,
    isLoading,
    isError,
    refetch,
    error: getAllError,
  } = useGetInstallationDetails(projectId!);

  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteInstallation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetInstallationDeadline();

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ title: "Success", description: "Completion status updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };



  const updateTaskStatus = useUpdateInstallationTaskStatus() // Added status update hook

  const handleStatusChange = async (taskId: string, newStatus: "submitted" | "pending" | "inprogress") => {
    try {
      await updateTaskStatus.mutateAsync({
        projectId: projectId!,
        taskId,
        status: newStatus,
      })
      toast({
        title: "Success",
        description: "Task status updated successfully",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full overflow-y-auto h-full">
      {/* Header Section – Always Visible */}
      {isChildRoute ? (
        <Outlet />
      ) :
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <i className="fas fa-tools mr-2"></i> Installation Overview
            </h2>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
              <Button
                isLoading={completePending}
                onClick={handleCompletionStatus}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <i className="fa-solid fa-circle-check mr-2" />
                Mark Complete
              </Button>

              <ResetStageButton
                projectId={projectId!}
                stageNumber={11}
                stagePath="installation"
                className="w-full sm:w-auto"
              />


              {!getAllError && <ShareDocumentWhatsapp
                projectId={projectId!}
                stageNumber="11"
                className="w-full sm:w-fit"
                isStageCompleted={data?.status}
              />}

              <AssignStageStaff
                stageName="InstallationModel"
                projectId={projectId!}
                organizationId={organizationId!}
                currentAssignedStaff={data?.assignedTo || null}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Child Route Check */}
          {isError ? (
            // Error Block - Only error, no content
            <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
              <div className="text-red-600 text-xl font-semibold mb-2">
                ⚠️ Oops! An Error Occurred
              </div>
              <p className="text-red-500 text-sm mb-4">
                {(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Something went wrong"}
              </p>

              <Button
                isLoading={isLoading}
                onClick={() => refetch()}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Retry
              </Button>
            </div>
          ) : (
            data && (
              <>
                {/* Stage Timer Card */}
                <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
                  <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                    <i className="fa-solid fa-clock text-blue-500 text-lg" />
                    <span>Stage Timings</span>
                  </div>

                  <StageTimerInfo
                    completedAt={data?.timer?.completedAt}
                    stageName="installation"
                    projectId={projectId!}
                    formId={(data as any)?._id}
                    deadLine={data?.timer?.deadLine}
                    startedAt={data?.timer?.startedAt}
                    refetchStageMutate={refetch}
                    deadLineMutate={deadLineAsync}
                    isPending={deadLinePending}
                  />
                </Card>

                {/* Responsive Room List */}
                {/* <div className="sm:max-h-[47vh] lg:max-h-[55vh] xl:max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {roomKeys.map((room) => (
                    <Link
                      key={room}
                      to={`installationroom/${room}`}
                      className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
                    >
                      <h3 className="text-md font-semibold capitalize text-blue-800">{room}</h3>
                      <p className="text-xs text-gray-500">{data?.[room]?.length || 0} work items</p>
                      <p className="text-xs text-gray-400">Tap to view details</p>
                    </Link>
                  ))}
                </div> */}





                {/* Installation Images Gallery */}
                {data?.tasks && data?.tasks.length > 0 ? (
                  <Card className="p-6 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
                    <div className="flex items-center gap-3 text-blue-700 text-lg font-semibold mb-6">
                      <i className="fa-solid fa-images text-blue-500 text-xl" />
                      <span>Installation Progress Gallery</span>
                    </div>

                    <div className="space-y-8">
                      {data.tasks.map((task: any, taskIndex: number) => {

                        return (
                          <div key={taskIndex} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                            {/* Task Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <i className="fa-solid fa-hammer text-blue-600 text-sm" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {task.workName || `Installation Task ${taskIndex + 1}`}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${task.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : task.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : task.status === "inprogress"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                      {task.status}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {task.images.length} image{task.images.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>


                              <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Update Status</label>
                        <Select
                          onValueChange={(val) =>
                            handleStatusChange(task._id, val as "submitted" | "pending" | "inprogress")
                          }
                          value={task.status || ""}
                        >
                          <SelectTrigger className="w-40 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white">
                            <SelectValue placeholder="Select status" selectedValue={task.status || ""} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="inprogress">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                In Progress
                              </div>
                            </SelectItem>
                            <SelectItem value="submitted">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                Submitted
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {updateTaskStatus.isPending && (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                            </div>

                            {/* Images Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                              {task.images.map((image: any, imageIndex: number) => (
                                <div
                                  key={image._id || imageIndex}
                                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                  onClick={() => {setPreviewImage(image?.url)

                                    setShowImagePreview(true)
                                  }
                                  }
                                >
                                  <img
                                    src={image.url || NO_IMAGE}
                                    alt={`${task.workName} - Image ${imageIndex + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    loading="lazy"
                                  />

                                  {/* Hover Overlay */}
                                  {/* <div className="absolute inset-0 bg-black/70 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <div className="bg-white rounded-full p-2 shadow-lg">
                                        <i className="fa-solid fa-expand text-gray-700 text-sm" />
                                      </div>
                                    </div>
                                  </div> */}

                                  {/* Image Number Badge */}
                                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                                    {imageIndex + 1}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Empty State for Task with No Images */}
                            {task.images.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <i className="fa-solid fa-image text-3xl mb-2 opacity-50" />
                                <p className="text-sm">No images uploaded for this task yet</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Overall Empty State */}
                    {data.tasks.every((task: any) => !task.images || task.images.length === 0) && (
                      <div className="text-center py-12 text-gray-500">
                        <i className="fa-solid fa-images text-4xl mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Installation Images Yet</h3>
                        <p className="text-sm">Images will appear here once they are uploaded to installation tasks</p>
                      </div>
                    )}
                  </Card>
                )
              :
                <div className="text-center py-12 text-gray-500">
                        <i className="fa-solid fa-images text-4xl mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Installation Images Yet</h3>
                        <p className="text-sm">Images will appear here once they are uploaded to installation tasks</p>
                      </div>
              
              }



                {showImagePreview && previewImage && (
                  <div
                    onClick={() => setShowImagePreview(false)}
                    className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]"
                  >
                    <div className="relative max-w-4xl max-h-[80%]">
                      <button
                        onClick={() => setShowImagePreview(false)}
                        className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <img
                        src={previewImage || NO_IMAGE}
                        alt={"preveiw image"}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </>
      }
    </main>
  );
}