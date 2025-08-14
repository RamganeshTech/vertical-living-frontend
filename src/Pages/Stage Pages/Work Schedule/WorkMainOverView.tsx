import { Link, Outlet, useParams, useLocation, useOutletContext } from "react-router-dom";
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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

const WorkMainOverview = () => {
  const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

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
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update completion.",
        variant: "destructive",
      });
    }
  };


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
   return  <main className="w-full h-full">

        <Outlet />
     </main>
  }

  // Loading
  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full h-full">
      {/* Header Always Visible */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border border-gray-200 hover:bg-gray-100"
              title="Open menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
          )}
          <i className="fas fa-digging mr-2"></i> Work Schedule Overview
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            className="bg-green-600 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <i className="fa-solid fa-circle-check mr-2" />
            Mark as Complete
          </Button>

          {/* <ResetStageButton
            projectId={projectId!}
            stageNumber={10}
            stagePath="worktasks"
            className="w-full sm:w-auto"
          /> */}

          <AssignStageStaff
            className="w-full sm:w-auto"
            stageName="WorkMainStageScheduleModel"
            projectId={projectId!}
            organizationId={organizationId!}
            currentAssignedStaff={data?.assignedTo || null}
          />
        </div>
      </div>

      {/* ❌ Error Message - Hide other content */}
      {getAllError ? (
        <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            ⚠️ An Error Occurred
          </div>
          <p className="text-red-500 text-sm mb-4">
            {(getAllError as any)?.response?.data?.message ||
              (getAllError as any)?.message ||
              "Couldn't load data."}
          </p>
          <Button
            isLoading={isLoading}
            onClick={() => refetch()}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2"
          >
            Retry
          </Button>
        </div>
      ) : (
        // ✅ Main Stage Content
        <>
          <Card className="p-4 mb-6 w-full border-l-4 border-blue-600 shadow bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* <Link
              to={`workschedule/${data?.workScheduleId}`}
              className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors shadow-md px-6 py-5 flex items-center gap-4"
            >
              <i className="fas fa-list-alt text-blue-600 text-3xl" />
              <div>
                <h3 className="text-lg font-bold text-blue-800">Work Plans</h3>
                <p className="text-sm text-blue-700">Manage detailed work plans for the project.</p>
              </div>
            </Link> */}

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

