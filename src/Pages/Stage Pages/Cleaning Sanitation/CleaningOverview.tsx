// import React from "react";
// import { Link, Outlet, useParams, useLocation } from "react-router-dom";

// import { toast } from "../../../utils/toast";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { useGetCleaningAndSanitation, useSetCleaningDeadline, useCompleteCleaningStage } from './../../../apiList/Stage Api/cleaningStageApi';
// import AssignStageStaff from "../../../shared/AssignStaff";

// // same keys you showed:
// export const roomKeys = [
//   "Living Room",
//   "Bedroom",
//   "Kitchen",
//   "Dining Room",
//   "Balcony",
//   "Foyer Area",
//   "Terrace",
//   "Study Room",
//   "Car Parking",
//   "Garden",
//   "Storage Room",
//   "Entertainment Room",
//   "Home Gym",
// ];

// export interface ICleaningUpload {
//   type: "image" | "pdf";
//   url: string;
//   originalName: string;
//   uploadedAt: Date
//   _id: string
// }

// export interface IRoomCleaning {
//   // _id: mongoose.Types.ObjectId;
//   roomName: string;
//   uploads: ICleaningUpload[];
//   completelyCleaned: boolean;
//   notes: string;
// }

// export default function CleaningOverview() {
//   const { projectId , organizationId} = useParams();
//   const location = useLocation();

//   if (!projectId) return null;

//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     error: getAllError,
//   } = useGetCleaningAndSanitation(projectId);

//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetCleaningDeadline();
//   const { mutateAsync: completionStatus, isPending: completePending } = useCompleteCleaningStage();

//   const handleCompletionStatus = async () => {
//     try {
//       await completionStatus({ projectId: projectId! });
//       toast({
//         description: "Cleaning & Sanitation marked as complete.",
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

//   const isChildRoute = location.pathname.includes("/cleaningroom/");

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
//         <div className="p-2">
//           <div className="flex justify-between w-full mb-4">
//             <h2 className="hidden sm:text-xl lg:text-3xl font-semibold text-blue-600 md:flex items-center">
//               <i className="fas fa-broom mr-2"></i> Cleaning & Sanitation Overview
//             </h2>

//             <h2 className="sm:!hidden text-lg font-semibold text-blue-600 md:flex items-center">
//               <i className="fas fa-broom mr-1"></i> Cleaning 
//             </h2>

//             <div className="flex gap-2 items-center">
//               <Button
//                 isLoading={completePending}
//                 onClick={handleCompletionStatus}
//                 className="bg-blue-600 mt-0 h-10 hover:bg-blue-700 text-white w-full sm:w-auto"
//               >
//                 <i className="fa-solid fa-circle-check mr-2"></i>
//                <span className="hidden sm:block">Mark as Completed</span>
//                <span className="sm:hidden">Complete</span>
               
//               </Button>

//               <ResetStageButton projectId={projectId!} stageNumber={13} stagePath="cleaning" />

//               <AssignStageStaff
//                 stageName="CleaningAndSanitationModel"
//                 projectId={projectId!}
//                 organizationId={organizationId!}
//                 currentAssignedStaff={data?.assignedTo || null}
//               />
//             </div>
//           </div>

//           <Card className="p-4 mb-4 w-full border-l-4 border-blue-600 bg-white shadow">
//             <div className="flex items-center gap-3 text-blue-600 text-sm font-medium mb-2">
//               <i className="fa-solid fa-clock text-blue-600 text-lg"></i>
//               <span>Stage Timings</span>
//             </div>

//             <StageTimerInfo
//               stageName='cleaning'
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

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//             {data?.rooms?.map((room: IRoomCleaning & { _id: string }) => (
//               <Link
//                 key={room._id}
//                 to={`cleaningroom/${room._id}`}
//                 className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
//               >
//                 <h3 className="text-md font-semibold capitalize text-blue-800">{room.roomName}</h3>
//                 <p className="text-xs text-gray-400">
//                   {room.uploads?.length || 0} uploads
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {room.completelyCleaned ? "✅ Completely Cleaned" : "❌ Not Cleaned"}
//                 </p>
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

// import { toast } from "../../../utils/toast";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import {
//   useGetCleaningAndSanitation,
//   useSetCleaningDeadline,
//   useCompleteCleaningStage,
// } from "../../../apiList/Stage Api/cleaningStageApi";
// import AssignStageStaff from "../../../shared/AssignStaff";

// export const roomKeys = [
//   "Living Room",
//   "Bedroom",
//   "Kitchen",
//   "Dining Room",
//   "Balcony",
//   "Foyer Area",
//   "Terrace",
//   "Study Room",
//   "Car Parking",
//   "Garden",
//   "Storage Room",
//   "Entertainment Room",
//   "Home Gym",
// ];

// export interface ICleaningUpload {
//   type: "image" | "pdf";
//   url: string;
//   originalName: string;
//   uploadedAt: Date;
//   _id: string;
// }

// export interface IRoomCleaning {
//   roomName: string;
//   uploads: ICleaningUpload[];
//   completelyCleaned: boolean;
//   notes: string;
// }

// export default function CleaningOverview() {
//   const { projectId, organizationId } = useParams();
//   const location = useLocation();

//   if (!projectId) return null;

//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     error: getAllError,
//   } = useGetCleaningAndSanitation(projectId);

//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetCleaningDeadline();
//   const { mutateAsync: completionStatus, isPending: completePending } = useCompleteCleaningStage();

//   const handleCompletionStatus = async () => {
//     try {
//       await completionStatus({ projectId: projectId! });
//       toast({
//         description: "Cleaning & Sanitation marked as complete.",
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

//   const isChildRoute = location.pathname.includes("/cleaningroom/");

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
//           className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
//         >
//           Retry
//         </Button>
//       </div>
//     );

//   return (
//     <main className="w-full h-full max-h-full overflow-y-auto px-1">
//       {!isChildRoute ? (
//         <div className="w-full">
//           {/* ✅ Header */}
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
//             {/* Title */}
//             <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold text-blue-600 flex items-center gap-2">
//               <i className="fas fa-broom" />
//               Cleaning & Sanitation Overview
//             </h2>

//             {/* Toolbar: Buttons stacked on mobile, horizontal on larger screens */}
//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <Button
//                 isLoading={completePending}
//                 onClick={handleCompletionStatus}
//                 className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full"
//               >
//                 <i className="fa-solid fa-circle-check mr-2"></i>
//                 <span className="hidden sm:inline-block">Mark as Completed</span>
//                 <span className="sm:hidden inline-block">Complete</span>
//               </Button>

//            <div className="flex items-center justify-between w-full">
//                <ResetStageButton
//                 projectId={projectId!}
//                 stageNumber={13}
//                 stagePath="cleaning"
//                 className="!w-[45%] sm:!w-full"
//               />

//               <AssignStageStaff
//                 stageName="CleaningAndSanitationModel"
//                 projectId={projectId!}
//                 organizationId={organizationId!}
//                 currentAssignedStaff={data?.assignedTo || null}
//                 className="w-[45%] sm:!w-full"
//               />
//            </div>
//             </div>
//           </div>

//           {/* ✅ Timer Card */}
//           <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">
//             <div className="flex items-center gap-3 text-blue-600 text-sm font-medium mb-2">
//               <i className="fa-solid fa-clock text-lg" />
//               <span>Stage Timings</span>
//             </div>

//             <StageTimerInfo
//               stageName="cleaning"
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

//           {/* ✅ Room Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//             {data?.rooms?.map((room: IRoomCleaning & { _id: string }) => (
//               <Link
//                 key={room._id}
//                 to={`cleaningroom/${room._id}`}
//                 className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white flex flex-col justify-between"
//               >
//                 <div>
//                   <h3 className="text-base md:text-md font-semibold capitalize text-blue-800 mb-1">
//                     {room.roomName}
//                   </h3>
//                   <p className="text-xs text-gray-500">
//                     {room.uploads?.length || 0} uploads
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {room.completelyCleaned
//                       ? "✅ Completely Cleaned"
//                       : "❌ Not Cleaned"}
//                   </p>
//                 </div>
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

import { toast } from "../../../utils/toast";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import {
  useGetCleaningAndSanitation,
  useSetCleaningDeadline,
  useCompleteCleaningStage,
} from "../../../apiList/Stage Api/cleaningStageApi";
import AssignStageStaff from "../../../shared/AssignStaff";
import type { ProjectDetailsOutlet } from "../../../types/types";

export const roomKeys = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Balcony",
  "Foyer Area",
  "Terrace",
  "Study Room",
  "Car Parking",
  "Garden",
  "Storage Room",
  "Entertainment Room",
  "Home Gym",
];

export interface ICleaningUpload {
  type: "image" | "pdf";
  url: string;
  originalName: string;
  uploadedAt: Date;
  _id: string;
}

export interface IRoomCleaning {
  roomName: string;
  uploads: ICleaningUpload[];
  completelyCleaned: boolean;
  notes: string;
}

export default function CleaningOverview() {
  const { projectId, organizationId } = useParams();
  const location = useLocation();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();


  if (!projectId) return null;

  const {
    data,
    isLoading,
    isError,
    refetch,
    error: getAllError,
  } = useGetCleaningAndSanitation(projectId);

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetCleaningDeadline();
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteCleaningStage();

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({
        description: "Cleaning & Sanitation marked as complete.",
        title: "Success",
      });
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

  const isChildRoute = location.pathname.includes("/cleaningroom/");

  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <main className="w-full h-full max-h-full overflow-y-auto px-1 py-4">
      {/* ✅ Header Area: Always visible */}
    {isChildRoute ? (
        <Outlet />
      ) : 
      <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold text-blue-600 flex items-center gap-2">
           {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <i className="fas fa-broom" />
         <span className="hidden sm:inline"> Cleaning & Sanitation Overview</span>
         <span className="inline sm:hidden"> Cleaning Stage</span>
        </h2>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full"
          >
            <i className="fa-solid fa-circle-check mr-2"></i>
            <span className="hidden sm:inline-block">Mark as Completed</span>
            <span className="inline sm:hidden">Complete</span>
          </Button>

          <div className="flex items-center justify-between w-full sm:gap-2">
            <ResetStageButton
              projectId={projectId!}
              stageNumber={13}
              stagePath="cleaning"
              className="!w-[48%] sm:!w-auto"
            />

            <AssignStageStaff
              stageName="CleaningAndSanitationModel"
              projectId={projectId!}
              organizationId={organizationId!}
              currentAssignedStaff={data?.assignedTo || null}
              className="!w-[48%] sm:!w-auto"
            />
          </div>
        </div>
      </div>

      {/* ✅ Show only child route */}
      {isError ? (
        // ❗ Error case: show only error component, hide everything else
        <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            ⚠️ Oops! An Error Occurred
          </div>
          <p className="text-red-500 text-sm mb-4">
            {(getAllError as any)?.response?.data?.message ||
              (getAllError as any)?.message ||
              "Failed to load, please try again"}
          </p>

          <Button
            isLoading={isLoading}
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* ✅ Timer Card */}
          <Card className="p-4 mb-6 border-l-4 border-blue-600 bg-white shadow">
            <div className="flex items-center gap-3 text-blue-600 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-lg" />
              <span>Stage Timings</span>
            </div>

            <StageTimerInfo
              stageName="cleaning"
              completedAt={data?.timer?.completedAt}
              projectId={projectId}
              formId={(data as any)?._id}
              deadLine={data?.timer?.deadLine}
              startedAt={data?.timer?.startedAt}
              refetchStageMutate={refetch}
              deadLineMutate={deadLineAsync}
              isPending={deadLinePending}
            />
          </Card>

          {/* ✅ Room Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.rooms?.map((room: IRoomCleaning & { _id: string }) => (
              <Link
                key={room._id}
                to={`cleaningroom/${room._id}`}
                className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
              >
                <div>
                  <h3 className="text-base md:text-md font-semibold capitalize text-blue-800 mb-1">
                    {room.roomName}
                  </h3>
                  <p className="text-xs text-gray-500">{room.uploads?.length || 0} uploads</p>
                  <p className="text-xs text-gray-500">
                    {room.completelyCleaned ? "✅ Completely Cleaned" : "❌ Not Cleaned"}
                  </p>
                </div>
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