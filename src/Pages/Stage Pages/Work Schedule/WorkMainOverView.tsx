// WorkMainOverview.tsx
import type { FC } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { useCompleteWorkSchedule, useGetWorkMainStage, useSetWorkScheduleDeadline } from "../../../apiList/Stage Api/workScheduleApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import AssignStageStaff from "../../../shared/AssignStaff";

const WorkMainOverview: FC = () => {
  const { projectId, organizationId } = useParams<{ projectId: string, organizationId:string }>();
  const { data, isLoading, refetch, error: getAllError } = useGetWorkMainStage(projectId!);
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetWorkScheduleDeadline()
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteWorkSchedule()



  if (isLoading) return <MaterialOverviewLoading />;

  if (getAllError) return <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
    <div className="text-red-600 text-xl font-semibold mb-2">
      ⚠️ Oops! An Error Occurred
    </div>
    <p className="text-red-500 text-sm mb-4">{(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Failed to load , please try again"}</p>

    <Button
      isLoading={isLoading}
      onClick={() => refetch()}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
    >
      Retry
    </Button>
  </div>;


  console.log("data", data)

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

    }
  };


  const isChildRoute = location.pathname.includes("/workschedule") || location.pathname.includes("/dailyschedule")


  console.log("isChildReoutes", isChildRoute)


  return (
    <main className="h-full w-full">
      {!isChildRoute ?
        <div className="p-6 space-y-4">

          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
              <i className="fas fa-digging mr-2"></i> WorkStage overview
            </h2>

            <div className="flex gap-2 items-center ">
              <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
                <i className="fa-solid fa-circle-check mr-2"></i>
                Mark as Complete
              </Button>

              <ResetStageButton projectId={projectId!} stageNumber={10} stagePath="worktasks" />

              <AssignStageStaff
                stageName="WorkMainStageScheduleModel"
                projectId={projectId!}
                organizationId={organizationId!}
                currentAssignedStaff={data?.assignedTo || null}
              />
            </div>
          </div>


          <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
              <span>Stage Timings</span>
            </div>

            <StageTimerInfo
          stageName='worktasks'
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Plans Card */}
            <Link
              to={`workschedule/${data?.workScheduleId}`}
              className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow-md px-6 py-5 flex items-center gap-4"
            >
              <i className="fas fa-list-alt text-blue-600 text-3xl" />
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-1">Work Plans</h3>
                <p className="text-sm text-blue-700">View and manage detailed work plans for this project.</p>
              </div>
            </Link>

            {/* Daily Tasks Card */}
            <Link
              to={`dailyschedule/${data?.dailyScheduleId}`}
              className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow-md px-6 py-5 flex items-center gap-4"
            >
              <i className="fas fa-calendar-check text-blue-600 text-3xl" />
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-1">Daily Tasks</h3>
                <p className="text-sm text-blue-700">View and manage daily tasks and updates.</p>
              </div>
            </Link>
          </div>

          {/* MD Approval Section */}
          <div className="mt-8 rounded-xl border border-blue-200 bg-white shadow-md">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <i className="fas fa-user-shield text-white" />
                MD Approval
              </h2>
            </div>

            <div className="px-6 py-5 space-y-3">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium w-24">Status:</span>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${data?.mdApproval?.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : data?.mdApproval?.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                >
                  {data?.mdApproval?.status || "Not Mentioned"}
                </span>
              </div>

              {/* Remarks */}
              <div className="flex items-start gap-4">
                <span className="text-gray-700 font-medium w-24 mt-1">Remarks:</span>
                <p className="text-sm text-gray-600">
                  {data?.mdApproval?.remarks || "No remarks provided."}
                </p>
              </div>
            </div>
          </div>

        </div> : <Outlet />}
    </main>
  );
};

export default WorkMainOverview;
