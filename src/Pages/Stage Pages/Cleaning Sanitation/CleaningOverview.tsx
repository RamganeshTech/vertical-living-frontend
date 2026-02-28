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
  const { projectId, organizationId } = useParams();
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const navigate = useNavigate()

  if (!projectId) return null;

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
    <main className="w-full h-full max-h-full overflow-y-auto custom-scrollbar">
      {/* ✅ Header Area: Always visible */}
      {isChildRoute ? (
        <Outlet />
      ) :
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold text-blue-600 flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <i className="fas fa-broom" />
              <span className="hidden sm:inline text-2xl"> Cleaning & Sanitation Overview</span>
              <span className="inline sm:hidden text-2xl"> Cleaning Stage</span>
            </h2>

            {/* Toolbar */}
            {(canCreate || canEdit) &&  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                isLoading={completePending}
                onClick={handleCompletionStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full"
              >
                <i className="fa-solid fa-circle-check mr-2"></i>
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

          {/* ✅ Show only child route */}
          {isError ? (
            // ❗ Error case: show only error component, hide everything else
            <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
              <div className="text-red-600 text-xl font-semibold mb-2">
                ⚠️ Oops! An Error Occurred
              </div>
              <p className="text-red-500 text-sm mb-4">
                {(getAllError as any)?.response?.data?.message ||
                  (getAllError as any)?.message ||
                  "Failed to load, please try again"}
              </p>

              <Button
                isLoading={isLoading}
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* ✅ Timer Card */}
              <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">
                <div className="flex items-center gap-3 text-blue-600 text-sm font-medium mb-2">
                  <i className="fa-solid fa-clock text-lg" />
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
                    className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
                  >
                    <div>
                      <h3 className="text-base md:text-md font-semibold capitalize text-blue-800 mb-1">
                        {room.roomName}
                      </h3>
                      <p className="text-xs text-gray-500">{room.uploads?.length || 0} uploads</p>
                      <p className="text-xs text-gray-500">
                        {room.completelyCleaned ? "✅ Completely Cleaned" : "❌ Not Cleaned"}
                      </p>
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