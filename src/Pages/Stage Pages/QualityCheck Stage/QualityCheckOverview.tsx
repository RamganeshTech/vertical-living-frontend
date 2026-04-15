import { Link, Outlet, useParams, useLocation, useOutletContext, useNavigate } from "react-router-dom";
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
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

// Context type for Outlet
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

// export const QualityCheckRoomKeys = [
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
  const { projectId, organizationId } = useParams() as {projectId:string, organizationId:string}
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const navigate = useNavigate()




  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.qualitycheck?.delete;
  // const canList = role === "owner" || permission?.qualitycheck?.list;
  const canCreate = role === "owner" || permission?.qualitycheck?.create;
  const canEdit = role === "owner" || permission?.qualitycheck?.edit;

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
      navigate('../cleaning')
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

  // console.log("data", data)

  return (
    // <main className="w-full h-full  overflow-y-auto custom-scrollbar">
    <main className="w-full h-full overflow-y-auto custom-scrollbar bg-brand-surface">
      {/* 🔵 Header Details - Always Visible */}
      {isChildRoute ? (
        <Outlet context={{ isMobile, openMobileSidebar }} />
      ) :
        <>

          {/* <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6"> */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-ash-light">
            {/* <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center gap-2"> */}
            <h2 className="text-xl sm:text-3xl font-bold text-text-main flex items-center">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  // className="mr-2 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  className="mr-2 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <i className="fas fa-check-double" />
              Quality Check Overview
            </h2>

            {(canCreate || canEdit) && <>
            <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%] flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                isLoading={completePending}
                onClick={handleCompletionStatus}
                // className="bg-green-600 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
                variant="dark"
                        className="flex-1 sm:flex-none px-6 shadow-sm min-w-max"
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

              {/* {!getAllError && <ShareDocumentWhatsapp
                projectId={projectId!}
                stageNumber="12"
                className="w-full sm:w-fit"
                isStageCompleted={data?.status}
              />} */}

              <AssignStageStaff
                stageName="QualityCheckupModel"
                projectId={projectId!}
                organizationId={organizationId!}
                currentAssignedStaff={data?.assignedTo || null}
                className="w-full sm:w-auto"
              />

            </div>
              



            </>
            }
            <div className="w-full sm:w-auto flex justify-end sm:block">
                <StageGuide
                  organizationId={organizationId!}
                  stageName="qualitycheck"
                />
              </div>
          </div>

          {isError ? (
            // <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
            //   <div className="text-red-600 text-xl font-semibold mb-2">⚠️ Oops! An Error Occurred</div>
            //   <p className="text-red-500 text-sm mb-4">
            //     {(getAllError as any)?.response?.data?.message ||
            //       (getAllError as any)?.message ||
            //       "Failed to load, please try again"}
            //   </p>
            //   <Button
            //     isLoading={isLoading}
            //     onClick={() => refetch()}
            //     className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
            //   >
            //     Retry
            //   </Button>
            // </div>

            <div className="max-w-xl mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mt-8">
              <div className="text-action-danger text-3xl mb-3">
                  <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div className="text-text-main text-lg font-bold mb-2">Error Occurred</div>
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
              {/* 🕒 Stage Timer */}
              {/* <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">
                <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                  <i className="fa-solid fa-clock text-blue-500 text-lg" />
                  <span>Stage Timings</span>
                </div> */}

                <Card className="p-5 mb-8 shadow-none border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
                <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
                  <i className="fa-regular fa-clock text-ash-dark text-base" />
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

              {/* <h3 className="text-xl text-blue-600 font-semibold mb-2">Rooms</h3> */}

              <div className="flex items-center gap-3 mb-5 border-b border-ash-light pb-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-surface border border-ash-medium flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-door-open text-text-muted text-sm"></i>
                  </div>
                  <h3 className="text-lg font-bold text-text-main">Rooms Overview</h3>
              </div>


              {/* 🗂️ Room Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                {data?.rooms?.length > 0 ?
                  data?.rooms?.map((room: { _id: string, roomName: string, tasks: any }) => (
                    <Link
                      key={room._id}
                      to={`qualitycheckroom/${room.roomName?.replace(/([A-Z])/g, " $1").trim()}`}
                      // className="border-l-4 border-blue-600 p-4 rounded-xl bg-white shadow hover:shadow-lg transition cursor-pointer"
                      className="bg-brand-surface border border-ash-medium p-4 rounded-xl shadow-sm hover:shadow-md hover:border-text-muted transition-all cursor-pointer "
                    >
                      {/* <h3 className="text-md font-semibold text-blue-800 capitalize mb-1">
                        {room?.roomName?.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {room?.tasks?.length || 0} works completed
                      </p>
                      <p className="text-xs text-gray-400">Click to view details</p> */}

                      <div className="flex items-start justify-between mb-4">
                            <h3 className="text-base font-bold text-text-main capitalize leading-tight group-hover:text-action-primary transition-colors">
                                {room?.roomName?.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <div className="w-8 h-8 rounded-full bg-brand-ash border border-ash-light flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-arrow-right text-text-muted text-[10px] -rotate-45 group-hover:rotate-0 transition-transform"></i>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <p className="text-sm font-bold text-text-main bg-brand-ash px-3 py-1.5 rounded-lg border border-ash-light w-fit shadow-sm">
                                {room?.tasks?.length || 0} <span className="text-text-muted font-medium">tasks</span>
                            </p>
                        </div>

                    </Link>
                  ))
                  : <>
                    {/* <div className="h-full flex items-center justify-center py-8">
                      <div className="text-center max-w-md mx-auto">
                        <i className="fas fa-door-open text-5xl sm:text-6xl text-blue-300 mb-4"></i>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Rooms Created Yet</h2>
                        <p className="text-gray-500">Add rooms in client requirement stage</p>
                      </div>
                    </div> */}

                    <div className="col-span-full bg-brand-surface border border-dashed border-ash-medium rounded-xl h-full flex flex-col items-center justify-center py-16 shadow-sm">
                    <div className="w-16 h-16 bg-brand-ash border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <i className="fas fa-door-open text-2xl text-ash-dark"></i>
                    </div>
                    <h2 className="text-lg font-bold text-text-main mb-1">No Rooms Found</h2>
                    <p className="text-sm text-text-muted">Add rooms in client requirement stage</p>
                  </div>

                  </>
                }
              </div>


              {/* <section>
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
              </section> */}
            </>
          )}
        </>
      }
    </main >
  );
}