import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "../../../utils/toast";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

import AssignStageStaff from "../../../shared/AssignStaff";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import {
  useGenerateMaterialArrivalLinkNew,
  useGetAllMaterialArrivalDetailsNew,
  useCompleteMaterialArrivalStage,
  useSetMaterialArrivalDeadline
} from "../../../apiList/Stage Api/materialArrivalNewApi"; // Adjust path
import MaterialArrivalGroupAccordion from "./MaterialArrivalGroupAccordion";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

// import  from "./MaterialArrivalGroupAccordion"; // New Component

interface ProjectDetailsOutlet {
  isMobile: boolean;
  openMobileSidebar: () => void;
}

const MaterialArrivalOverviewNew = () => {
  const { projectId, organizationId } = useParams();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const navigate = useNavigate();

  // --- API Hooks ---
  const { data, isLoading, error, isError, refetch } = useGetAllMaterialArrivalDetailsNew(projectId!);
  const { mutateAsync: generateLink, isPending: linkPending } = useGenerateMaterialArrivalLinkNew();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialArrivalDeadline();
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteMaterialArrivalStage();






  const { role, permission } = useAuthCheck();


  // const canDelete = role === "owner" || permission?.materialarrival?.delete;
  // const canList = role === "owner" || permission?.materialarrival?.list;
  const canCreate = role === "owner" || permission?.materialarrival?.create;
  const canEdit = role === "owner" || permission?.materialarrival?.edit;


  if (isLoading) return <MaterialOverviewLoading />;

  const { timer, generatedLink, materialArrivalList } = data || {};

  console.log("materialArrivalList", materialArrivalList)


  // --- Handlers ---
  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ description: 'Completion status updated successfully', title: "Success" });
      navigate('../installation');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  // --- Statistics Logic (Updated for Nested Structure) ---
  const allSubItems = materialArrivalList?.flatMap((order: any) => order.subItems || []) || [];
  const totalMaterials = allSubItems.length;
  const verifiedMaterials = allSubItems.filter((item: any) => item.isVerified).length;
  const pendingMaterials = totalMaterials - verifiedMaterials;
  const verificationProgress = totalMaterials > 0 ? Math.round((verifiedMaterials / totalMaterials) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col p-2">

      {/* Header Section */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 pb-3">
        <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
          {isMobile && (
            <button onClick={openMobileSidebar} className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100">
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <i className="fa-solid fa-receipt mr-2"></i>
          <span className="hidden sm:inline">Material Checking</span>
          <span className="sm:hidden">Material Check</span>
        </h2>

        {(canCreate || canEdit) &&

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              isLoading={completePending}
              onClick={handleCompletionStatus}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
            >
              <i className="fa-solid fa-circle-check mr-2"></i>
              Mark as Complete
            </Button>

            <ResetStageButton projectId={projectId!} stageNumber={9} stagePath="materialarrivalcheck" />

            {/* {!error && (
              <ShareDocumentWhatsapp
                projectId={projectId!}
                stageNumber="9"
                className="w-full sm:w-fit"
                isStageCompleted={data?.status}
              />
            )} */}

            <AssignStageStaff
              stageName="MaterialArrivalModel"
              projectId={projectId!}
              organizationId={organizationId!}
              currentAssignedStaff={data?.assignedTo || null}
            />
           

          </div>}

           <div className="w-full sm:w-auto flex justify-end sm:block">
              <StageGuide
                organizationId={organizationId!}
                stageName="materialarrival"
              />
            </div>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
            <div className="text-red-600 font-semibold mb-2">⚠️ Error Occurred</div>
            <p className="text-red-500 text-sm mb-4">
              {(error as any)?.response?.data?.message || "Failed to load data"}
            </p>
            <Button onClick={() => refetch()} className="bg-red-600 text-white hover:bg-red-700">Retry</Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isError && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">

          {/* Timer Card */}
          <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
              <span>Stage Timings</span>
            </div>
            <StageTimerInfo
              stageName='materialarrivalcheck'
              completedAt={timer?.completedAt}
              projectId={projectId!}
              formId={(data as any)?._id}
              deadLine={timer?.deadLine}
              startedAt={timer?.startedAt}
              refetchStageMutate={refetch}
              deadLineMutate={deadLineAsync}
              isPending={deadLinePending}
            />
          </Card>

          {/* Stats Header */}
          <section className="w-full rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-opacity-10 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-boxes-stacked text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Material Verification Center</h3>
                    <p className="text-gray-300 text-sm mt-1">Review arrival status per order</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{totalMaterials}</div>
                  <div className="text-gray-300 text-sm">Total Items</div>
                </div>
              </div>

              {/* Progress Stats */}
              {totalMaterials > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{verifiedMaterials}</div>
                      <div className="text-xs text-gray-300">Verified</div>
                    </div>
                  </div>
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{pendingMaterials}</div>
                      <div className="text-xs text-gray-300">Pending</div>
                    </div>
                  </div>
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                      <i className="fa-solid fa-chart-pie"></i>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{verificationProgress}%</div>
                      <div className="text-xs text-gray-300">Complete</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion List */}
            <div className="p-4 bg-gray-50">
              {materialArrivalList && materialArrivalList?.length > 0 ? (
                <div className="space-y-4">
                  {materialArrivalList?.map((orderGroup: any, index: number) => (
                    <MaterialArrivalGroupAccordion
                      key={index}
                      orderGroup={orderGroup}
                      projectId={projectId!}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <i className="fa-solid fa-box-open text-4xl mb-3 opacity-50"></i>
                  <p>No material orders synced yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Share Link */}
          <section className="mt-4">
            <GenerateWhatsappLink
              enableCreate={canCreate || canEdit}
              projectId={projectId!}
              context="Material"
              stage="materialarrival"
              data={generatedLink}
              isPending={linkPending}
              generateLink={generateLink}
            />
          </section>

        </div>
      )}
    </div>
  );
};

export default MaterialArrivalOverviewNew;