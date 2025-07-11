// import React, { type JSX } from "react";
// import { Link, Outlet, useParams } from "react-router-dom";
// import { useCompleteInstallation, useGetInstallationDetails, useSetInstallationDeadline } from "../../../apiList/Stage Api/installationWorkApi"; // your custom hook
// import { toast } from "../../../utils/toast";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import AssignStageStaff from "../../../shared/AssignStaff";

// export const roomKeys = [
//     "LivingRoom",
//     "Bedroom",
//     "Kitchen",
//     "DiningRoom",
//     "Balcony",
//     "FoyerArea",
//     "Terrace",
//     "StudyRoom",
//     "CarParking",
//     "Garden",
//     "StorageRoom",
//     "EntertainmentRoom",
//     "HomeGym",
// ];

// export default function InstallationOverview() {

//     const { projectId, organizationId } = useParams()

//     if (!projectId) return

//     const { data, isLoading, isError, refetch, error: getAllError } = useGetInstallationDetails(projectId);


//     console.log(data)

//     const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetInstallationDeadline()
//     const { mutateAsync: completionStatus, isPending: completePending } = useCompleteInstallation()

//     const handleCompletionStatus = async () => {
//         try {
//             await completionStatus({ projectId: projectId! });
//             toast({ description: 'Completion status updated successfully', title: "Success" });
//         } catch (error: any) {
//             toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

//         }
//     };

//     const isChildRoute = location.pathname.includes("/installationroom")




//     if (isLoading) return <MaterialOverviewLoading />;
//     if (getAllError) return <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//         <div className="text-red-600 text-xl font-semibold mb-2">
//             ⚠️ Oops! An Error Occurred
//         </div>
//         <p className="text-red-500 text-sm mb-4">{(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Failed to load , please try again"}</p>

//         <Button
//             isLoading={isLoading}
//             onClick={() => refetch()}
//             className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
//         >
//             Retry
//         </Button>
//     </div>;


//     return (
//         <main className="w-full h-full">
//             {!isChildRoute ? <div className="p-2">

//                 <div className='flex justify-between w-full mb-4'>
//                     <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
//                         <i className="fas fa-comments mr-2"></i> Installation Overview
//                     </h2>

//                     <div className="flex gap-2 items-center ">
//                         <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
//                             <i className="fa-solid fa-circle-check mr-2"></i>
//                             Mark as Complete
//                         </Button>

//                         <ResetStageButton projectId={projectId!} stageNumber={11} stagePath="installation" />

//                         <AssignStageStaff
//                             stageName="InstallationModel"
//                             projectId={projectId!}
//                             organizationId={organizationId!}
//                             currentAssignedStaff={data?.assignedTo || null}
//                         />
//                     </div>
//                 </div>


//                 <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
//                     <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//                         <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//                         <span>Stage Timings</span>
//                     </div>

//                     <StageTimerInfo
//                         completedAt={data?.timer?.completedAt}
//           stageName='installation'
                        
//                         projectId={projectId}
//                         formId={(data as any)?._id}
//                         deadLine={data?.timer?.deadLine}
//                         startedAt={data?.timer?.startedAt}
//                         refetchStageMutate={refetch}
//                         deadLineMutate={deadLineAsync}
//                         isPending={deadLinePending}
//                     />
//                 </Card>


//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {roomKeys.map((room) => (
//                         <Link
//                             key={room}
//                             to={`installationroom/${room}`}
//                             className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
//                         >
//                             <h3 className="text-md font-semibold capitalize text-blue-800">{room}</h3>
//                             <p className="text-xs text-gray-400">{data[room]?.length || 0} works</p>
//                             <p className="text-xs text-gray-400">Click to view details</p>

//                         </Link>
//                     ))}
//                 </div>


//             </div> : <Outlet />}
//         </main>
//     );
// }






import React from "react";
import { Link, Outlet, useLocation, useParams, useOutletContext } from "react-router-dom";
import {
  useCompleteInstallation,
  useGetInstallationDetails,
  useSetInstallationDeadline,
} from "../../../apiList/Stage Api/installationWorkApi";
import { toast } from "../../../utils/toast";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import AssignStageStaff from "../../../shared/AssignStaff";

// Define context type
type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

export const roomKeys = [
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

export default function InstallationOverview() {
  const { projectId, organizationId } = useParams();
  const location = useLocation();

  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

  const isChildRoute = location.pathname.includes("/installationroom");

  const {
    data,
    isLoading,
    isError,
    refetch,
    error: getAllError,
  } = useGetInstallationDetails(projectId!);

  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteInstallation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetInstallationDeadline();

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ title: "Success", description: "Completion status updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full h-full">
      {/* Header Section – Always Visible */}
      {isChildRoute ? (
        <Outlet />
      ) :
      <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <i className="fas fa-tools mr-2"></i> Installation Overview
        </h2>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <i className="fa-solid fa-circle-check mr-2" />
            Mark Complete
          </Button>

          <ResetStageButton
            projectId={projectId!}
            stageNumber={11}
            stagePath="installation"
            className="w-full sm:w-auto"
          />

          <AssignStageStaff
            stageName="InstallationModel"
            projectId={projectId!}
            organizationId={organizationId!}
            currentAssignedStaff={data?.assignedTo || null}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Child Route Check */}
      { isError ? (
        // Error Block - Only error, no content
        <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            ⚠️ Oops! An Error Occurred
          </div>
          <p className="text-red-500 text-sm mb-4">
            {(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Something went wrong"}
          </p>

          <Button
            isLoading={isLoading}
            onClick={() => refetch()}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </Button>
        </div>
      ) : (
        data && (
          <>
            {/* Stage Timer Card */}
            <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
              <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                <i className="fa-solid fa-clock text-blue-500 text-lg" />
                <span>Stage Timings</span>
              </div>

              <StageTimerInfo
                completedAt={data?.timer?.completedAt}
                stageName="installation"
                projectId={projectId!}
                formId={(data as any)?._id}
                deadLine={data?.timer?.deadLine}
                startedAt={data?.timer?.startedAt}
                refetchStageMutate={refetch}
                deadLineMutate={deadLineAsync}
                isPending={deadLinePending}
              />
            </Card>

            {/* Responsive Room List */}
            <div className="sm:max-h-[47vh] lg:max-h-[55vh] xl:max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {roomKeys.map((room) => (
                <Link
                  key={room}
                  to={`installationroom/${room}`}
                  className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
                >
                  <h3 className="text-md font-semibold capitalize text-blue-800">{room}</h3>
                  <p className="text-xs text-gray-500">{data?.[room]?.length || 0} work items</p>
                  <p className="text-xs text-gray-400">Tap to view details</p>
                </Link>
              ))}
            </div>
          </>
        )
      )}
      </>
}
    </main>
  );
}