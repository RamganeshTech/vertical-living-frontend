import React from "react";
// import { useGetCostEstimationByProject,  } from 
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useGetCostEstimationByProject, useGetSingleRoomEstimation, useUpdateMaterialEstimationItem, useAddLabourEstimation, useEditLabourEstimation, useDeleteLabourEstimation, useUploadCostEstimationFiles, useDeleteCostEstimationFile, useSetCostEstimateDeadline, useCompleteCostEstimate } from "../../../apiList/Stage Api/costEstimationApi";
import CostEstimateRoomCard from "./CostEstimateRoomCard";
import { useCompleteMaterialStage } from "../../../apiList/Stage Api/materialSelectionApi";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { toast } from "../../../utils/toast";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import LabourEstimateContainer from "./LabourEstimate/LabourEstimateContainer";
import SummaryCostEstimation from "./SummaryCostEstimation";
import AssignStageStaff from "../../../shared/AssignStaff";

export const CostEstimationContainer = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isLoading, isError, error: getAllError, refetch } = useGetCostEstimationByProject(projectId!);
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetCostEstimateDeadline()
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteCostEstimate()

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


  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
    }
  };



  const isChildRoute = location.pathname.includes("/roomdetails");


  return (
    <div className="h-full w-full">
      {!isChildRoute ?
        <>
          <div className='h-full overflow-y-scroll'>
            <div className="flex justify-between w-full mb-3">
              <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
                <i className="fa-solid fa-money-bill-1-wave mr-2"></i> Cost Estimation
              </h2>

              <div className="flex gap-2 items-center ">
                <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  Mark as Complete
                </Button>

                <ResetStageButton projectId={projectId!} stageNumber={6} stagePath="costestimation" />

                <AssignStageStaff
                  stageName="CostEstimationModel"
                  projectId={projectId!}
                  organizationId={"684a57015e439b678e8f6918"}
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
                completedAt={data?.timer?.completedAt}
                stageName='costestimation'

                formId={(data as any)?._id}
                projectId={projectId!}
                deadLine={data?.timer?.deadLine}
                startedAt={data?.timer?.startedAt}
                refetchStageMutate={refetch}
                deadLineMutate={deadLineAsync}
                isPending={deadLinePending}
              />
            </Card>


            <section>
              <div className="flex w-full items-center justify-between  mb-4">
                <h3 className="text-xl font-bold text-gray-800">Material Cost Estimation</h3>


                <Button className="bg-blue-600 cursor-pointer rounded-lg p-5" onClick={() => navigate(`/projectdetails/${projectId}/costestimation/roomdetails/labour`)}>
                  Labour Cost Estimation <i className="ml-2 fa-solid fa-arrow-up-right-from-square"></i>
                </Button>





              </div>
              <div className="p-2 grid grid-cols-3 gap-4 ">
                {data.materialEstimation.map((item: any) => (
                  <CostEstimateRoomCard key={item.key} room={item} projectId={projectId!} />
                ))}

              </div>
            </section>

            {!isLoading && !isError && data && <SummaryCostEstimation data={data} />}
          </div>
        </>
        :
        <>
          <Outlet />
        </>
      }

    </div>
  );
};
