import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "../../../utils/toast";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useGenerateMaterialArrivalLinkNew, useGetAllMaterialArrivalDetailsNew } from "../../../apiList/Stage Api/materialArrivalNewApi";
import { useCompleteMaterialArrivalStage, useSetMaterialArrivalDeadline } from "../../../apiList/Stage Api/materialArrivalApi";
import MaterialArrivalCard from "./MaterialArrivalSingleNew";
// import { Input } from "../../../components/ui/Input";

interface ProjectDetailsOutlet {
  isMobile: boolean;
  openMobileSidebar: () => void;
}

const MaterialArrivalOverviewNew = () => {
  const { projectId, organizationId } = useParams();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const navigate = useNavigate()
  // const isChildRoute = location.pathname.includes("/materialarrivalroom/");
  // const { mutateAsync: bulkToggleMutate, isPending: bullPending } = useBulkToggleAllVerification()
  const { data, isLoading, error, isError, refetch } = useGetAllMaterialArrivalDetailsNew(projectId!)
  const { mutateAsync: generateLink, isPending: linkPending } = useGenerateMaterialArrivalLinkNew()


  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialArrivalDeadline()
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteMaterialArrivalStage()

  if (isLoading) return <MaterialOverviewLoading />;

  const { timer, generatedLink } = data || {};

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ description: 'Completion status updated successfully', title: "Success" });
      navigate('../installation')

    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to update completion status", variant: "destructive" })
    }
  };




  // Calculate statistics
  const totalMaterials = data?.materialArrivalList?.length || 0
  const verifiedMaterials = data?.materialArrivalList?.filter((item: any) => item.isVerified)?.length || 0
  const pendingMaterials = totalMaterials - verifiedMaterials
  const verificationProgress = totalMaterials > 0 ? Math.round((verifiedMaterials / totalMaterials) * 100) : 0

  // console.log("data", data)
  // const handleBulkToggle = async () => {



  //     try {
  //         await bulkToggleMutate({ projectId: projectId!, isVerified });
  //         refetch();
  //         toast({ title: "Success", description: "All items verification toggled" });
  //     } catch (error: any) {
  //         toast({ title: "Error", description: error?.response?.data?.message || error.message || "faied to update", variant:"destructive"});
  //     }
  // };

  return (
    <div className="w-full h-full flex flex-col p-2 ">


      {/* Header Section - Always visible */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 pb-3 ">
        <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <i className="fa-solid fa-receipt mr-2"></i>
          <span className="hidden sm:inline">Material Checking</span>
          <span className="sm:hidden">Material Check</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
          >
            <i className="fa-solid fa-circle-check mr-2"></i>
            Mark as Complete
          </Button>

          <ResetStageButton
            projectId={projectId!}
            stageNumber={9}
            stagePath="materialarrivalcheck"
          />

          {!error && <ShareDocumentWhatsapp
            projectId={projectId!}
            stageNumber="9"
            className="w-full sm:w-fit"
            isStageCompleted={data?.status}
          />}

          <AssignStageStaff
            stageName="MaterialArrivalModel"
            projectId={projectId!}
            organizationId={organizationId!}
            currentAssignedStaff={data?.assignedTo || null}
          />
        </div>
      </div>

      {/* Error Display */}
      {isError && (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
            <div className="text-red-600 font-semibold mb-2">
              ⚠️ Error Occurred
            </div>
            <p className="text-red-500 text-sm mb-4">
              {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Content - Only show if no error */}
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






          {/* Material Section */}
          <section className="w-full  rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Enhanced Header */}



            <div className=" bg-gradient-to-r from-slate-800 to-gray-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12  bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-boxes-stacked text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Material Verification Center</h3>
                    <p className="text-gray-300 text-sm mt-1">Review and verify material arrivals</p>
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
                  <div className="bg-slate-600 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 bg-opacity-30 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-check text-emerald-300 text-lg"></i>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{verifiedMaterials}</div>
                        <div className="text-gray-300 text-sm">Verified</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 bg-opacity-30 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-clock text-amber-300 text-lg"></i>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{pendingMaterials}</div>
                        <div className="text-gray-300 text-sm">Pending</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-chart-line text-indigo-300 text-lg"></i>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{verificationProgress}%</div>
                        <div className="text-gray-300 text-sm">Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {totalMaterials > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>Verification Progress</span>
                    <span>{verificationProgress}% Complete</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${verificationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-5 gap-4 px-6 py-4 font-semibold text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-hashtag text-blue-500"></i>
                      <span>Item Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-calculator text-blue-500"></i>
                      <span>Quantity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-image text-blue-500"></i>
                      <span>Image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-shield-check text-blue-500"></i>
                      <span>Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-cog text-blue-500"></i>
                      <span>Action</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Data Rows */}
                {data?.materialArrivalList?.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {data.materialArrivalList.map((item: any, index: number) => (
                      <MaterialArrivalCard key={item._id} item={item} projectId={projectId!} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-gray-50">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                        <i className="fa-solid fa-box-open text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-3">No Materials Found</h3>
                      <p className="text-gray-500 mb-4">
                        Material data will appear here once available. Check back later or contact your administrator.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <i className="fa-solid fa-info-circle"></i>
                        <span>Materials are automatically synced from your project</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>



          {/* 🔗 Shareable Link */}
          <section className="mt-4">
            <GenerateWhatsappLink
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
  )
}

export default MaterialArrivalOverviewNew;