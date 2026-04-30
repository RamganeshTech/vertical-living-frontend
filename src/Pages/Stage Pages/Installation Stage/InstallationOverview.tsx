import { Outlet, useLocation, useParams, useOutletContext, useNavigate } from "react-router-dom";
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
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
// import { NO_IMAGE } from './../../../constants/constants';
// import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

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
  const navigate = useNavigate()
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

  const isChildRoute = location.pathname.includes("/installationroom");

  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.installation?.delete;
  // const canList = role === "owner" || permission?.installation?.list;
  const canCreate = role === "owner" || permission?.installation?.create;
  const canEdit = role === "owner" || permission?.installation?.edit;


  const {
    data,
    isLoading,
    isError,
    refetch,
    // error: getAllError,
  } = useGetInstallationDetails(projectId!);

  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteInstallation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetInstallationDeadline();

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ title: "Success", description: "Completion status updated successfully" });
      navigate('../qualitycheck')
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
    <main className="w-full overflow-y-auto h-full bg-brand-surface">
      {/* Header Section – Always Visible */}
      {isChildRoute ? (
        <Outlet />
      ) :
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center"> */}
            <h2 className="text-2xl sm:text-2xl font-bold text-text-main flex items-center">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  // className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              {/* <i className="fas fa-tools mr-2"></i> Installation Overview */}
              <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                <i className="fas fa-tools text-text-muted text-lg"></i>
              </div>
              <span className="leading-tight">Installation Overview</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-end">
              {(canEdit || canCreate) && <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                <Button
                  isLoading={completePending}
                  onClick={handleCompletionStatus}
                  // className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  variant="dark"
                  className="flex-1 sm:flex-none px-6 shadow-sm min-w-max"
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


                {/* {!getAllError && <ShareDocumentWhatsapp
                projectId={projectId!}
                stageNumber="11"
                className="w-full sm:w-fit"
                isStageCompleted={data?.status}
              />} */}

                <AssignStageStaff
                  stageName="InstallationModel"
                  projectId={projectId!}
                  organizationId={organizationId!}
                  currentAssignedStaff={data?.assignedTo || null}
                  className="w-full sm:w-auto"
                />
              </div>
              }

              <div className="w-full sm:w-auto flex justify-end sm:block">
                <StageGuide
                  organizationId={organizationId!}
                  stageName="installation"
                />
              </div>
            </div>
          </div>

          {/* Child Route Check */}
          {isError ? (

            // <div className="max-w-xl mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mt-8">
            //   <div className="text-action-danger text-3xl mb-3">
            //     <i className="fa-solid fa-triangle-exclamation"></i>
            //   </div>
            //   <div className="text-text-main text-lg font-bold mb-2">
            //     Error Occurred
            //   </div>
            //   <p className="text-text-muted text-sm mb-5">
            //     {(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Something went wrong"}
            //   </p>

            //   <Button
            //     isLoading={isLoading}
            //     onClick={() => refetch()}
            //     variant="outline"
            //     className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
            //   >
            //     Retry
            //   </Button>
            // </div>

            <div className="max-w-xl mx-auto p-8 bg-brand-surface border-2 border-ash-medium rounded-xl shadow-sm text-center mt-8">

              {/* Soft, neutral icon wrapper instead of a stark warning */}
              <div className="w-16 h-16 bg-brand-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 border border-ash-medium shadow-sm">
                <i className="fa-solid fa-lock text-text-muted text-2xl"></i>
              </div>

              {/* Professional, non-alarming title */}
              <div className="text-text-strong text-lg font-bold mb-2">
                Stage Not Yet Available
              </div>

              {/* Clear explanation of the business logic */}
              <p className="text-text-muted text-sm mb-6 max-w-md mx-auto leading-relaxed">
                {/* {(getAllError as any)?.response?.data?.message} */}
                This section is currently locked. Please ensure all required steps in the previous stage are fully completed before accessing this information.
              </p>

              {/* Neutral action button */}
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary hover:bg-brand-surface-hover transition-all px-3 shadow-sm"
              >
                <i className="fas fa-sync-alt mr-2 text-text-soft"></i> Refresh
              </Button>

            </div>
          ) : (
            data && (
              <>
                {/* Stage Timer Card */}
                {/* <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
                  <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                    <i className="fa-solid fa-clock text-blue-500 text-lg" />
                    <span>Stage Timings</span>
                  </div> */}


                <Card className="p-5 shadow-none border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
                  <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
                    <i className="fa-regular fa-clock text-ash-dark text-base" />
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


                {/* Installation Images Gallery */}
                {data?.tasks && data?.tasks.length > 0 ? (
                  // <Card className="p-2 mb-6 w-full shadow  bg-white">
                  //   <div className="flex items-center gap-3 text-blue-700 text-lg font-semibold mb-6">
                  //     <i className="fa-solid fa-images text-blue-500 text-xl" />
                  //     <span>Installation Progress Gallery</span>
                  //   </div>


                  <div className="w-full my-3">
                    <div className="flex items-center gap-3 mb-5 border-b border-ash-light pb-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-ash border border-ash-medium flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-images text-text-muted text-sm"></i>
                      </div>
                      <h3 className="text-lg font-bold text-text-main">Installation Progress Gallery</h3>
                    </div>

                    <div className="space-y-8">
                      {data.tasks.map((task: any, taskIndex: number) => {

                        return (
                          // <div key={taskIndex} className="p-3 border-b-1 border-b-gray-300 border-l-4 border-blue-600 rounded-2xl pb-6 last:border-b-0 last:pb-0">
                          <div key={taskIndex} className="border border-ash-medium rounded-xl bg-brand-surface shadow-sm overflow-hidden">

                            {/* Task Header2  */}
                            {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"> */}
                            <div className="bg-brand-ash border-b border-ash-medium p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                {/* <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <i className="fa-solid fa-hammer text-blue-600 text-sm" />
                                </div> */}

                                <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-full flex items-center justify-center shadow-sm shrink-0">
                                  <i className="fa-solid fa-hammer text-text-muted text-sm" />
                                </div>

                                <div>
                                  <h3 className="text-lg font-semibold text-text-main">
                                    {task.workName || `Installation Task ${taskIndex + 1}`}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {/* <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${task.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : task.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : task.status === "inprogress"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                    > */}

                                    <span
                                      className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border shadow-sm ${task.status === "completed" || task.status === "pass"
                                          ? "bg-brand-surface border-action-success/30 text-action-success"
                                          : task.status === "pending"
                                            ? "bg-brand-surface border-yellow-500/30 text-yellow-600"
                                            : task.status === "inprogress"
                                              ? "bg-brand-surface border-action-primary/30 text-action-primary"
                                              : task.status === "submitted"
                                                ? "bg-brand-surface border-purple-500/30 text-purple-600"
                                                : "bg-brand-surface border-ash-medium text-text-muted"
                                        }`}
                                    >
                                      {task.status}
                                    </span>
                                    {/* <span className="text-sm text-gray-500">
                                      {task.images.length} image{task.images.length !== 1 ? "s" : ""}
                                    </span> */}

                                    <span className="text-[11px] font-bold text-text-muted flex items-center gap-1">
                                      <i className="fa-regular fa-image text-ash-dark"></i>
                                      {task.images.length} image{task.images.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>


                              {(canCreate || canEdit) &&
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col gap-1">
                                    {/* <label className="text-xs font-medium text-gray-600">Update Status</label> */}
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Update Status</label>
                                    <Select
                                      onValueChange={(val) =>
                                        handleStatusChange(task._id, val as "submitted" | "pending" | "inprogress")
                                      }
                                      value={task.status || ""}
                                    >
                                      {/* <SelectTrigger className="w-40 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white"> */}
                                      <SelectTrigger className="w-full sm:w-40 rounded-lg border-ash-medium focus:ring-2 focus:ring-ash-medium bg-brand-surface text-text-main shadow-sm h-9">
                                        <SelectValue placeholder="Select status" selectedValue={task.status || ""} />
                                      </SelectTrigger>
                                      <SelectContent className="!min-w-[120px] bg-brand-surface border-ash-medium">
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

                                  {/* {updateTaskStatus.isPending && (
                                  <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                  </div>
                                )} */}

                                  {updateTaskStatus.isPending && updateTaskStatus.variables?.taskId === task._id && (
                                    <div className="flex items-center justify-center shrink-0 mt-4">
                                      <i className="fas fa-circle-notch fa-spin text-text-muted text-lg"></i>
                                    </div>
                                  )}
                                </div>}
                            </div>

                            {/* Image Number Badge */}
                            <h2 className="text-lg text-gray-500 font-semibold my-3 p-3 ">Images</h2>
                            <ImageGalleryExample
                              imageFiles={task?.images}
                              // handleDeleteFile={handleDelete}
                              className="p-3"
                              height={80}
                              minWidth={98}
                              maxWidth={100}
                            />

                            {/* Empty State for Task with No Images */}
                            {task?.images?.length === 0 && (
                              // <div className="text-center py-8 text-gray-500">
                              //   <i className="fa-solid fa-image text-3xl mb-2 opacity-50" />
                              //   <p className="text-sm">No images uploaded for this task yet</p>
                              // </div>

                              <div className="text-center py-8 border border-dashed border-ash-medium rounded-lg bg-brand-ash/30">
                                <div className="w-12 h-12 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                  <i className="fa-solid fa-image text-ash-dark text-lg" />
                                </div>
                                <p className="text-sm font-bold text-text-main">No Images Uploaded</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted mt-1">Images will appear here once added to this task.</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Overall Empty State */}
                    {data.tasks.every((task: any) => !task.images || task.images.length === 0) && (
                      // <div className="text-center py-12 text-gray-500">
                      //   <i className="fa-solid fa-images text-4xl mb-4 opacity-50" />
                      //   <h3 className="text-lg font-medium mb-2">No Installation Images Yet</h3>
                      //   <p className="text-sm">Images will appear here once they are uploaded to installation tasks</p>
                      // </div>

                      <div className="text-center py-16 border border-dashed border-ash-medium rounded-xl bg-brand-ash/50 mt-6">
                        <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <i className="fa-solid fa-images text-ash-dark text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-text-main mb-1">No Installation Images Yet</h3>
                        <p className="text-sm text-text-muted">Images will appear here once they are uploaded to installation tasks.</p>
                      </div>

                    )}
                  </div>
                )
                  :
                  // <div className="text-center py-12 text-gray-500">
                  //   <i className="fa-solid fa-images text-4xl mb-4 opacity-50" />
                  //   <h3 className="text-lg font-medium mb-2">No Installation Images Yet</h3>
                  //   <p className="text-sm">Images will appear here once they are uploaded to installation tasks</p>
                  // </div>

                  <div className="text-center py-20 border border-dashed border-ash-medium rounded-xl bg-brand-ash/50 mt-6">
                    <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <i className="fa-solid fa-clipboard-list text-ash-dark text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-1">No Installation Tasks Found</h3>
                    <p className="text-sm text-text-muted">Tasks created in earlier stages will populate here.</p>
                  </div>
                }
              </>
            )
          )}
        </>
      }
    </main>
  );
}