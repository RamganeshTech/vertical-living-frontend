import { Link, Outlet, useParams, useLocation, useOutletContext, useNavigate } from "react-router-dom";

import { toast } from "../../../utils/toast";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import {
  useGetCleaningAndSanitation,
  useSetCleaningDeadline,
  useCompleteCleaningStage,
} from "../../../apiList/Stage Api/cleaningStageApi";
import AssignStageStaff from "../../../shared/AssignStaff";
import type { ProjectDetailsOutlet } from "../../../types/types";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

export const roomKeys = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Balcony",
  "Foyer Area",
  "Terrace",
  "Study Room",
  "Car Parking",
  "Garden",
  "Storage Room",
  "Entertainment Room",
  "Home Gym",
];

export interface ICleaningUpload {
  type: "image" | "pdf";
  url: string;
  originalName: string;
  uploadedAt: Date;
  _id: string;
}

export interface IRoomCleaning {
  roomName: string;
  uploads: ICleaningUpload[];
  completelyCleaned: boolean;
  notes: string;
}

export default function CleaningOverview() {
  const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string }
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const navigate = useNavigate()

  // if (!) return null;

  const {
    data,
    isLoading,
    isError,
    refetch,
    error: getAllError,
  } = useGetCleaningAndSanitation(projectId);

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetCleaningDeadline();
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteCleaningStage();



  const { role, permission } = useAuthCheck();


  // const canDelete = role === "owner" || permission?.cleaning?.delete;
  // const canList = role === "owner" || permission?.cleaning?.list;
  const canCreate = role === "owner" || permission?.cleaning?.create;
  const canEdit = role === "owner" || permission?.cleaning?.edit;



  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({
        description: "Cleaning & Sanitation marked as complete.",
        title: "Success",
      });
      navigate('../projectdelivery')
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to update completion status",
        variant: "destructive",
      });
    }
  };

  const isChildRoute = location.pathname.includes("/cleaningroom/");

  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full h-full max-h-full overflow-y-auto custom-scrollbar bg-brand-surface">
      {/* ✅ Header Area: Always visible */}
      {isChildRoute ? (
        <Outlet />
      ) :
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-ash-light">
            {/* <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold text-blue-600 flex items-center gap-2"> */}
            <h2 className="text-xl sm:text-2xl font-bold text-text-main flex items-center">
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
              {/* <i className="fas fa-broom" /> */}
              <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                <i className="fas fa-broom text-text-muted text-lg" />
              </div>
              <span className="hidden sm:inline text-2xl"> Cleaning & Sanitation Overview</span>
              <span className="inline sm:hidden text-2xl"> Cleaning Stage</span>
            </h2>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-end mt-2 lg:mt-0">
              {(canCreate || canEdit) && <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  isLoading={completePending}
                  onClick={handleCompletionStatus}
                  // className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full"
                  variant="dark"
                  className="flex-1 sm:flex-none px-6 shadow-sm min-w-max"
                >
                  {/* <i className="fa-solid fa-circle-check mr-2"></i> */}
                  <i className="fa-solid fa-circle-check mr-2 text-action-success"></i>
                  <span className="hidden sm:inline-block">Mark as Completed</span>
                  <span className="inline sm:hidden">Mark as Completed</span>
                </Button>

                <div className="flex items-center justify-between w-full sm:gap-2">
                  <ResetStageButton
                    projectId={projectId!}
                    stageNumber={13}
                    stagePath="cleaning"
                    className="!w-[48%] sm:!w-auto"
                  />


                  {/* {!getAllError && <ShareDocumentWhatsapp
                  projectId={projectId!}
                  stageNumber="13"
                  className="w-full sm:w-fit"
                  isStageCompleted={data?.status}
                />} */}

                  <AssignStageStaff
                    stageName="CleaningAndSanitationModel"
                    projectId={projectId!}
                    organizationId={organizationId!}
                    currentAssignedStaff={data?.assignedTo || null}
                    className="!w-[48%] sm:!w-auto"
                  />


                </div>
              </div>}
              <div className="w-full sm:w-auto flex justify-end sm:block">
                <StageGuide
                  organizationId={organizationId!}
                  stageName="cleaning"
                />
              </div>
            </div>

          </div>

          {/* ✅ Show only child route */}
          {isError ? (
            // // ❗ Error case: show only error component, hide everything else
            // <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
            //   <div className="text-red-600 text-xl font-semibold mb-2">
            //     ⚠️ Oops! An Error Occurred
            //   </div>
            //   <p className="text-red-500 text-sm mb-4">
            //     {(getAllError as any)?.response?.data?.message ||
            //       (getAllError as any)?.message ||
            //       "Failed to load, please try again"}
            //   </p>

            //   <Button
            //     isLoading={isLoading}
            //     onClick={() => refetch()}
            //     className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
            //   >
            //     Retry
            //   </Button>
            // </div>

            // ❗ Error case: show only error component, hide everything else
            <div className="max-w-xl mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mt-8">
              <div className="text-action-danger text-3xl mb-3">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div className="text-text-main text-lg font-bold mb-2">
                Error Occurred
              </div>
              <p className="text-text-muted text-sm mb-5">
                {(getAllError as any)?.response?.data?.message ||
                  (getAllError as any)?.message ||
                  "Failed to load, please try again"}
              </p>

              <Button
                isLoading={isLoading}
                onClick={() => refetch()}
                variant="outline"
                className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* ✅ Timer Card */}
              {/* <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">


                <div className="flex items-center gap-3 text-blue-600 text-sm font-medium mb-2">
                  <i className="fa-solid fa-clock text-lg" />
                  <span>Stage Timings</span>
                </div> */}

              <Card className="p-5 mb-8 shadow-sm border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
                <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
                  <i className="fa-regular fa-clock text-ash-dark text-base" />
                  <span>Stage Timings</span>
                </div>

                <StageTimerInfo
                  stageName="cleaning"
                  completedAt={data?.timer?.completedAt}
                  projectId={projectId}
                  formId={(data as any)?._id}
                  deadLine={data?.timer?.deadLine}
                  startedAt={data?.timer?.startedAt}
                  refetchStageMutate={refetch}
                  deadLineMutate={deadLineAsync}
                  isPending={deadLinePending}
                />
              </Card>

              {/* ✅ Room Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.rooms?.map((room: IRoomCleaning & { _id: string }) => (
                  <Link
                    key={room._id}
                    to={`cleaningroom/${room._id}`}
                    // className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
                    className="bg-brand-surface border border-ash-medium p-5 rounded-xl shadow-sm hover:shadow-md hover:border-text-muted transition-all cursor-pointer flex flex-col group h-full"
                  >
                    {/* <div>
                      <h3 className="text-base md:text-md font-semibold capitalize text-blue-800 mb-1">
                        {room.roomName}
                      </h3>
                      <p className="text-xs text-gray-500">{room.uploads?.length || 0} uploads</p>
                      <p className="text-xs text-gray-500">
                        {room.completelyCleaned ? "✅ Completely Cleaned" : "❌ Not Cleaned"}
                      </p>
                    </div> */}

                    <div className="flex items-start justify-between mb-4">
                          <h3 className="text-base font-bold text-text-main capitalize leading-tight group-hover:text-action-primary transition-colors">
                              {room.roomName}
                          </h3>
                          <div className="w-8 h-8 rounded-full bg-brand-ash border border-ash-light flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-arrow-right text-text-muted text-[10px] -rotate-45 group-hover:rotate-0 transition-transform"></i>
                          </div>
                      </div>
                      
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Images</span>
                            <span className="text-xs font-bold text-text-main bg-brand-ash px-2 py-0.5 rounded border border-ash-light">
                                {room.uploads?.length || 0}
                            </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold shadow-sm ${
                            room.completelyCleaned 
                                ? "bg-action-success/10 border-action-success/30 text-action-success" 
                                : "bg-brand-ash border-ash-medium text-text-muted"
                        }`}>
                            <i className={`fa-solid ${room.completelyCleaned ? "fa-check-circle" : "fa-clock"}`}></i>
                            {room.completelyCleaned ? "Cleaned" : "Not Cleaned"}
                        </div>
                      </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      }
    </main>
  );
}