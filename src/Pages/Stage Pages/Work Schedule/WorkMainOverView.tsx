import { Link, Outlet, useParams, useLocation, useOutletContext, useNavigate } from "react-router-dom";
import {
  useCompleteWorkSchedule,
  useGetWorkMainStage,
  // useMdApprovalAction,
  useSetWorkScheduleDeadline,
} from "../../../apiList/Stage Api/workScheduleApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import AssignStageStaff from "../../../shared/AssignStaff";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

const WorkMainOverview = () => {
  const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    refetch,
    error: getAllError,
  } = useGetWorkMainStage(projectId!);

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetWorkScheduleDeadline();
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteWorkSchedule();
  // const {mutateAsync: mdActionAsync, isPending: mdActionPending} = useMdApprovalAction()

  // const [mdActionEdit, setMdActionEdit] = useState<boolean>(false)
  // const [mdActionStatus, setMdActionStatus] = useState<"pending" | "approved" | "rejected">("pending")
  // const handleStartEdit = ()=>{
  //   setMdActionEdit(true)
  // }
  const isChildRoute = location.pathname.includes("/workschedule") || location.pathname.includes("/dailyschedule");



  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({
        description: "Completion status updated successfully.",
        title: "Success",
      });
      navigate('../technicalconsultant')
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update completion.",
        variant: "destructive",
      });
    }
  };



  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.workschedule?.delete;
  // const canList = role === "owner" || permission?.workschedule?.list;
  const canCreate = role === "owner" || permission?.workschedule?.create;
  const canEdit = role === "owner" || permission?.workschedule?.create;


  // const handleMDAction = async () => {
  //   try {
  //     await mdActionAsync({ projectId: projectId! , mainStageId:data?._id,  payload: { action: mdActionStatus },});
  //     toast({
  //       description: "MD Approval updated successfully.",
  //       title: "Success",
  //     });
  //     setMdActionEdit(false)
  //     refetch();
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error?.response?.data?.message || error.message || "Failed to update Approval.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // ✅ Only render <Outlet /> content if it's a child route
  if (isChildRoute) {
    return <main className="w-full h-full">

      <Outlet />
    </main>
  }

  // Loading
  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full h-full bg-brand-surface">
      {/* Header Always Visible */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-ash-light">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-main flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              // className="mr-3 p-2 rounded-md border border-gray-200 hover:bg-gray-100"
              className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
              title="Open menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
          )}
          {/* <i className="fas fa-digging mr-2"></i> Work Schedule Overview */}
          <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
             <i className="fas fa-digging text-text-muted text-lg"></i>
          </div>
          <span className="leading-tight">Work Schedule Overview</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {(canCreate || canEdit) && <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            // className="bg-green-600 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
            variant="dark"
                className="flex-1 sm:flex-none px-6 shadow-sm min-w-max"
          >
            {/* <i className="fa-solid fa-circle-check mr-2" />
            Mark as Complete */}

            <i className="fa-solid fa-circle-check mr-2 text-action-success" />
                <span className="hidden sm:inline">Mark Complete</span>
                <span className="inline sm:hidden">Complete</span>
          </Button>}

          {/* <ResetStageButton
            projectId={projectId!}
            stageNumber={10}
            stagePath="worktasks"
            className="w-full sm:w-auto"
          /> */}

          {(canCreate || canEdit) && <AssignStageStaff
            className="w-full sm:w-auto"
            stageName="WorkMainStageScheduleModel"
            projectId={projectId!}
            organizationId={organizationId!}
            currentAssignedStaff={data?.assignedTo || null}
          />}



          <div className="w-full sm:w-auto flex justify-end sm:block">
            <StageGuide
              organizationId={organizationId!}
              stageName="workschedule"
            />
          </div>
        </div>
      </div>

      {/* ❌ Error Message - Hide other content */}
      {getAllError ? (
        // <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
        //   <div className="text-red-600 text-xl font-semibold mb-2">
        //     ⚠️ An Error Occurred
        //   </div>
        //   <p className="text-red-500 text-sm mb-4">
        //     {(getAllError as any)?.response?.data?.message ||
        //       (getAllError as any)?.message ||
        //       "Couldn't load data."}
        //   </p>
        //   <Button
        //     isLoading={isLoading}
        //     onClick={() => refetch()}
        //     className="bg-red-600 text-white hover:bg-red-700 px-4 py-2"
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
                "Couldn't load data."}
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
        // ✅ Main Stage Content
        <>
          {/* <Card className="p-4 mb-6 w-full border-l-4 border-blue-600 shadow bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg" />
              <span>Stage Timings</span>
            </div> */}

            <Card className="p-5 shadow-sm border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
            <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
              <i className="fa-regular fa-clock text-ash-dark text-base" />
              <span>Stage Timings</span>
            </div>
            <StageTimerInfo
              stageName="worktasks"
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

          {/* MD status */}
          {/* <Card className="p-2 mb-4 border-l-4 border-blue-600 bg-white border shadow-md rounded-xl">
  <div className="text-blue-600 rounded-t flex items-center gap-2 mb-4">
    <i className="fas fa-user-shield" />
    <h2 className="text-lg font-semibold">MD Approval</h2>
  </div>

  <div className="space-y-3">
   <div className="flex flex-wrap items-center gap-2">
      <span className="text-gray-700 font-medium ">Status:</span>
      {mdActionEdit ? (
        <Select
          value={mdActionStatus}
          onValueChange={(val) =>
            setMdActionStatus(val as "pending" | "approved" | "rejected")
          }
        >
          <SelectTrigger>
            <SelectValue
              selectedValue={mdActionStatus}
              placeholder="Select status"
            />
          </SelectTrigger>
          <SelectContent>
            {["pending", "approved", "rejected"].map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            data?.mdApproval?.status === "approved"
              ? "bg-green-200 text-green-700"
              : data?.mdApproval?.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-200 text-red-700"
          }`}
        >
          {data?.mdApproval?.status || "N/A"}
        </span>
      )}
      {mdActionEdit ? (
        <div className="flex gap-2">

        <Button size="sm" variant="primary" isLoading={mdActionPending} onClick={handleMDAction}>
          <i className="fas fa-check"></i>
        </Button>

        <Button size="sm" variant="secondary"  onClick={()=> setMdActionEdit(false)}>
          <i className="fas fa-xmark"></i>
        </Button>
        </div>
      ) : (
        <Button size="md" onClick={handleStartEdit}>
          <i className="fas fa-pencil"></i>
        </Button>
      )}
    </div>
   

    
  </div>
</Card>
    */}

          {/* Grid: Work Plans & Daily Schedule */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              to={`workschedule/${data?.workScheduleId}`}
              className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors shadow-md px-6 py-5 flex items-center gap-4"
            >
              <i className="fas fa-list-alt text-blue-600 text-3xl" />
              <div>
                <h3 className="text-lg font-bold text-blue-800">Work Plans</h3>
                <p className="text-sm text-blue-700">Manage detailed work plans for the project.</p>
              </div>
            </Link> 

            <Link
              to={`dailyschedule/${data?.dailyScheduleId}`}
              className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors shadow-md px-6 py-5 flex items-center gap-4"
            >
              <i className="fas fa-calendar-check text-blue-600 text-3xl" />
              <div>
                <h3 className="text-lg font-bold text-blue-800">Daily Tasks</h3>
                <p className="text-sm text-blue-700">Track daily activities and progress reports.</p>
              </div>
            </Link>
          </div> */}



          <div className="w-full mb-8">
            <Link
              to={`dailyschedule/${data?.dailyScheduleId}`}
              // className="w-full block bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group"
              className="my-4 w-full block bg-brand-surface  border-2 border-ash-medium  rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center justify-between p-6 md:p-8">
                <div className="flex items-center gap-6">
                  {/*  Updated icon styling to match page theme */}
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-brand-ash border border-ash-light rounded-xl flex items-center justify-center shadow-sm group-hover:border-ash-medium transition-colors">
                    <i className="fas fa-calendar-check text-action-primary text-2xl" />
                  </div>

                  <div className="flex-1">
                    {/*  Updated typography and colors for better integration */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-main mb-1.5 group-hover:text-action-primary transition-colors leading-tight">
                      Daily Task Planner
                    </h3>
                    <p className="text-text-muted text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-2xl">
                      Organize and track your daily activities with comprehensive progress reports and task management.
                    </p>

                    {/*  Added feature badges for better visual hierarchy */}
                   <div className="flex flex-wrap gap-2 mt-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-surface border border-ash-medium text-text-main text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        <i className="fas fa-tasks text-action-primary" /> Task Tracking
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-surface border border-ash-medium text-text-main text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        <i className="fas fa-chart-line text-action-success" /> Progress Reports
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-surface border border-ash-medium text-text-main text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        <i className="fas fa-calendar-alt text-purple-500" /> Date Planning
                      </span>
                    </div>
                  </div>
                </div>

                {/*  Added arrow indicator for better UX */}
               <div className="flex-shrink-0 self-end sm:self-auto w-10 h-10 rounded-full bg-brand-ash border border-ash-light flex items-center justify-center group-hover:bg-brand-surface group-hover:border-ash-medium transition-all shadow-sm">
                  <i className="fas fa-arrow-right text-text-muted group-hover:text-action-primary group-hover:translate-x-0.5 transition-all text-sm" />
                </div>
              </div>
            </Link>
          </div>

          {/* MD Approval Details */}
          {/* <Card className="p-2 border-l-4 border-blue-600 bg-white border  shadow-md rounded-xl">
            <div className="text-blue-600 rounded-t flex items-center gap-2 mb-4">
              <i className="fas fa-user-shield" />
              <h2 className="text-lg font-semibold">MD Approval</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium w-28">Status:</span>
               {mdActionEdit ? 
              //  <Select
              //                                    value={mdActionStatus}
              //                                   //  onValueChange={(val) => handleChange(val)}
              //                                  >
              //                                    <SelectTrigger>
              //                                      <SelectValue
              //                                        selectedValue={}
              //                                        placeholder={`Select ${field === "brandName" ? "brand" : "fabric"}`}
              //                                      />
              //                                    </SelectTrigger>
              //                                    <SelectContent>
              //                                      {["pending", "approved", "rejected"].map((opt: string) => (
              //                                        <SelectItem key={opt} value={opt}>
              //                                          {opt}
              //                                        </SelectItem>
              //                                      ))}
              //                                    </SelectContent>
              //                                  </Select>
              <></>
               :<span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    data?.mdApproval?.status === "approved"
                      ? "bg-green-200 text-green-700"
                      : data?.mdApproval?.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {data?.mdApproval?.status || "N/A"}
                </span>}
                <Button size="md" onClick={handleStartEdit}>
                  <i className="fas fa-pencil"></i>
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-gray-700 font-medium w-28">Remarks:</span>
                <p className="text-sm text-gray-600">
                  {data?.mdApproval?.remarks || "No remarks provided"}
                </p>
              </div>
            </div>
          </Card> */}


        </>
      )}
    </main>
  );
};

export default WorkMainOverview;

