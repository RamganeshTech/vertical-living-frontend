import React from "react";
import { Link, Outlet, useParams, useLocation, useOutletContext } from "react-router-dom";
import {
  useGetQualityCheckup,
  useSetQualityCheckDeadline,
  useCompleteQualityCheck,
} from "../../../apiList/Stage Api/qualityCheckApi";
import { toast } from "../../../utils/toast";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import AssignStageStaff from "../../../shared/AssignStaff";

// Context type for Outlet
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

export const QualityCheckRoomKeys = [
  "LivingRoom",
  "Bedroom",
  "Kitchen",
  "DiningRoom",
  "Balcony",
  "FoyerArea",
  "Terrace",
  "StudyRoom",
  "CarParking",
  "Garden",
  "StorageRoom",
  "EntertainmentRoom",
  "HomeGym",
];

export const wallSectionSop = [
  {
    path: `adminwall`,
    sectionName: "Admin Section"
  },
  {
    path: `workerwall`,
    sectionName: "Worker Section"
  }
]


export default function QualityCheckOverview() {
  const { projectId, organizationId } = useParams();
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

  if (!projectId) return null;

  const {
    data,
    isLoading,
    isError,
    error: getAllError,
    refetch,
  } = useGetQualityCheckup(projectId);

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetQualityCheckDeadline();
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteQualityCheck();

  const isChildRoute = location.pathname.includes("/qualitycheckroom/");

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId });
      toast({ title: "Success", description: "Quality Check marked as complete." });
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

  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full h-full  overflow-y-auto custom-scrollbar">
      {/* 🔵 Header Details - Always Visible */}
      {isChildRoute ? (
        <Outlet context={{isMobile, openMobileSidebar}} />
      ) :
        <>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <i className="fas fa-check-double" />
              Quality Check Overview
            </h2>

            <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%] flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                isLoading={completePending}
                onClick={handleCompletionStatus}
                className="bg-green-600 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <i className="fa-solid fa-circle-check mr-2"></i>
                <span className="hidden sm:inline">Mark as Complete</span>
                <span className="inline sm:hidden">Complete</span>
              </Button>

              <ResetStageButton
                projectId={projectId!}
                stageNumber={12}
                stagePath="qualitycheck"
                className="w-full sm:w-auto"
              />

              <AssignStageStaff
                stageName="QualityCheckupModel"
                projectId={projectId!}
                organizationId={organizationId!}
                currentAssignedStaff={data?.assignedTo || null}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {isError ? (
            <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
              <div className="text-red-600 text-xl font-semibold mb-2">⚠️ Oops! An Error Occurred</div>
              <p className="text-red-500 text-sm mb-4">
                {(getAllError as any)?.response?.data?.message ||
                  (getAllError as any)?.message ||
                  "Failed to load, please try again"}
              </p>
              <Button
                isLoading={isLoading}
                onClick={() => refetch()}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* 🕒 Stage Timer */}
              <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">
                <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                  <i className="fa-solid fa-clock text-blue-500 text-lg" />
                  <span>Stage Timings</span>
                </div>
                <StageTimerInfo
                  stageName="qualitycheck"
                  completedAt={data?.timer?.completedAt}
                  projectId={projectId!}
                  formId={(data as any)?._id}
                  deadLine={data?.timer?.deadLine}
                  startedAt={data?.timer?.startedAt}
                  refetchStageMutate={refetch}
                  deadLineMutate={deadLineAsync}
                  isPending={deadLinePending}
                />
              </Card>

              <h3 className="text-xl text-blue-600 font-semibold mb-2">Rooms</h3>
              {/* 🗂️ Room Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                {QualityCheckRoomKeys.map((room) => (
                  <Link
                    key={room}
                    to={`qualitycheckroom/${room}`}
                    className="border-l-4 border-blue-600 p-4 rounded-xl bg-white shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <h3 className="text-md font-semibold text-blue-800 capitalize mb-1">
                      {room.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {data?.[room]?.length || 0} works completed
                    </p>
                    <p className="text-xs text-gray-400">Click to view details</p>
                  </Link>
                ))}
              </div>


              <section>
                <h3 className="text-xl text-blue-600 font-semibold mb-2">Walls SOP Section</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {wallSectionSop.map((section) => (
                    <Link
                      key={section.sectionName}
                      to={`qualitycheckroom/${section.path}`}
                      className="border-l-4 border-blue-600 p-4 rounded-xl bg-white shadow hover:shadow-lg transition cursor-pointer"
                    >
                      <h3 className="text-md font-semibold text-blue-800 capitalize mb-1">
                        {section.sectionName.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p className="text-xs text-gray-400">Click to view details</p>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      }
    </main>
  );
}