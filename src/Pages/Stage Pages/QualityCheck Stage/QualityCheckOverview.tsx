// import React from "react";
// import { Link, Outlet, useParams, useLocation } from "react-router-dom";
// import { useGetQualityCheckup, useSetQualityCheckDeadline, useCompleteQualityCheck } from "../../../apiList/Stage Api/qualityCheckApi";
// import { toast } from "../../../utils/toast";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import AssignStageStaff from "../../../shared/AssignStaff";

// export const roomKeys = [
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

// export default function QualityCheckOverview() {
//   const { projectId , organizationId} = useParams();
//   const location = useLocation();

//   if (!projectId) return null;

//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     error: getAllError,
//   } = useGetQualityCheckup(projectId);

//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetQualityCheckDeadline();
//   const { mutateAsync: completionStatus, isPending: completePending } = useCompleteQualityCheck();

//   const handleCompletionStatus = async () => {
//     try {
//       await completionStatus({ projectId: projectId! });
//       toast({
//         description: "Quality Check marked as complete.",
//         title: "Success",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error?.response?.data?.message ||
//           error.message ||
//           "Failed to update completion status",
//         variant: "destructive",
//       });
//     }
//   };

//   const isChildRoute = location.pathname.includes("/qualitycheckroom/");

//   if (isLoading) return <MaterialOverviewLoading />;

//   if (getAllError)
//     return (
//       <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//         <div className="text-red-600 text-xl font-semibold mb-2">
//           ⚠️ Oops! An Error Occurred
//         </div>
//         <p className="text-red-500 text-sm mb-4">
//           {(getAllError as any)?.response?.data?.message ||
//             (getAllError as any)?.message ||
//             "Failed to load , please try again"}
//         </p>

//         <Button
//           isLoading={isLoading}
//           onClick={() => refetch()}
//           className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
//         >
//           Retry
//         </Button>
//       </div>
//     );

//   return (
//     <main className="w-full h-full">
//       {!isChildRoute ? (
//         <div className="p-2">
//           <div className="flex justify-between w-full mb-4">
//             <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
//               <i className="fas fa-check-double mr-2"></i> Quality Check Overview
//             </h2>

//             <div className="flex gap-2 items-center">
//               <Button
//                 isLoading={completePending}
//                 onClick={handleCompletionStatus}
//                 className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
//               >
//                 <i className="fa-solid fa-circle-check mr-2"></i>
//                 Mark as Complete
//               </Button>

//               <ResetStageButton projectId={projectId!} stageNumber={12} stagePath="qualitycheck" />

//               <AssignStageStaff
//                 stageName="QualityCheckupModel"
//                 projectId={projectId!}
//                 organizationId={organizationId!}
//                 currentAssignedStaff={data?.assignedTo || null}
//               />
//             </div>
//           </div>

//           <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
//             <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//               <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//               <span>Stage Timings</span>
//             </div>

//             <StageTimerInfo
//               stageName='qualitycheck'

//               completedAt={data?.timer?.completedAt}
//               projectId={projectId}
//               formId={(data as any)?._id}
//               deadLine={data?.timer?.deadLine}
//               startedAt={data?.timer?.startedAt}
//               refetchStageMutate={refetch}
//               deadLineMutate={deadLineAsync}
//               isPending={deadLinePending}
//             />
//           </Card>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {roomKeys.map((room) => (
//               <Link
//                 key={room}
//                 to={`qualitycheckroom/${room}`}
//                 className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
//               >
//                 <h3 className="text-md font-semibold capitalize text-blue-800">{room}</h3>
//                 <p className="text-xs text-gray-400">
//                   {data?.[room]?.length || 0} works
//                 </p>
//                 <p className="text-xs text-gray-400">Click to view details</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <Outlet />
//       )}
//     </main>
//   );
// }





// import React from "react";
// import { Link, Outlet, useParams, useLocation } from "react-router-dom";
// import {
//   useGetQualityCheckup,
//   useSetQualityCheckDeadline,
//   useCompleteQualityCheck,
// } from "../../../apiList/Stage Api/qualityCheckApi";
// import { toast } from "../../../utils/toast";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import AssignStageStaff from "../../../shared/AssignStaff";

// export const roomKeys = [
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

// export default function QualityCheckOverview() {
//   const { projectId, organizationId } = useParams();
//   const location = useLocation();

//   if (!projectId) return null;

//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     error: getAllError,
//   } = useGetQualityCheckup(projectId);

//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetQualityCheckDeadline();
//   const { mutateAsync: completionStatus, isPending: completePending } = useCompleteQualityCheck();

//   const handleCompletionStatus = async () => {
//     try {
//       await completionStatus({ projectId: projectId! });
//       toast({
//         description: "Quality Check marked as complete.",
//         title: "Success",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error?.response?.data?.message ||
//           error.message ||
//           "Failed to update completion status",
//         variant: "destructive",
//       });
//     }
//   };

//   const isChildRoute = location.pathname.includes("/qualitycheckroom/");

//   if (isLoading) return <MaterialOverviewLoading />;

//   if (getAllError)
//     return (
//       <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//         <div className="text-red-600 text-xl font-semibold mb-2">
//           ⚠️ Oops! An Error Occurred
//         </div>
//         <p className="text-red-500 text-sm mb-4">
//           {(getAllError as any)?.response?.data?.message ||
//             (getAllError as any)?.message ||
//             "Failed to load, please try again"}
//         </p>

//         <Button
//           isLoading={isLoading}
//           onClick={() => refetch()}
//           className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
//         >
//           Retry
//         </Button>
//       </div>
//     );

//   return (
//     <main className="w-full h-full max-h-full overflow-y-auto">
//       {!isChildRoute ? (
//         <div className="p-2 sm:p-4 w-full">
//           {/* ✨ Header Block */}
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//             <h2 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-blue-600 flex items-center gap-2">
//               <i className="fas fa-check-double" />
//               Quality Check Overview
//             </h2>

//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <Button
//                 isLoading={completePending}
//                 onClick={handleCompletionStatus}
//                 className="bg-green-600 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
//               >
//                 <i className="fa-solid fa-circle-check mr-2"></i>
//                 <span className="hidden sm:inline">Mark as Complete</span>
//                 <span className="inline sm:hidden">Complete</span>
//               </Button>

//               <ResetStageButton
//                 projectId={projectId!}
//                 stageNumber={12}
//                 stagePath="qualitycheck"
//               />

//               <AssignStageStaff
//                 stageName="QualityCheckupModel"
//                 projectId={projectId!}
//                 organizationId={organizationId!}
//                 currentAssignedStaff={data?.assignedTo || null}
//                 className="w-full"
//               />
//             </div>
//           </div>

//           {/* ⏱ Stage Timer Info */}
//           <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">
//             <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//               <i className="fa-solid fa-clock text-blue-500 text-lg" />
//               <span>Stage Timings</span>
//             </div>

//             <StageTimerInfo
//               stageName="qualitycheck"
//               completedAt={data?.timer?.completedAt}
//               projectId={projectId}
//               formId={(data as any)?._id}
//               deadLine={data?.timer?.deadLine}
//               startedAt={data?.timer?.startedAt}
//               refetchStageMutate={refetch}
//               deadLineMutate={deadLineAsync}
//               isPending={deadLinePending}
//             />
//           </Card>

//           {/* 🧱 Room Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
//             {roomKeys.map((room) => (
//               <Link
//                 key={room}
//                 to={`qualitycheckroom/${room}`}
//                 className="border-l-4 border-blue-600 p-4 rounded-xl shadow bg-white hover:shadow-md transition cursor-pointer"
//               >
//                 <h3 className="text-base md:text-md font-semibold text-blue-800 capitalize mb-1">
//                   {room.replace(/([A-Z])/g, " $1").trim()}
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   {data?.[room]?.length || 0} works completed
//                 </p>
//                 <p className="text-xs text-gray-400">Click to view details</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <Outlet />
//       )}
//     </main>
//   );
// }






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
    <main className="w-full h-full py-4">
      {/* 🔵 Header Details - Always Visible */}
     {isChildRoute ? (
        <Outlet />
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

          {/* 🗂️ Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
            {roomKeys.map((room) => (
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
        </>
      )}
      </>
      }
    </main>
  );
}