import React from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";

import { toast } from "../../../utils/toast";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useGetCleaningAndSanitation, useSetCleaningDeadline, useCompleteCleaningStage } from './../../../apiList/Stage Api/cleaningStageApi';

// same keys you showed:
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
    uploadedAt: Date
    _id:string
}

export interface IRoomCleaning {
    // _id: mongoose.Types.ObjectId;
    roomName: string;
    uploads: ICleaningUpload[];
    completelyCleaned: boolean;
    notes: string;
}

export default function CleaningOverview() {
  const { projectId } = useParams();
  const location = useLocation();

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

  if (getAllError)
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
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
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
        >
          Retry
        </Button>
      </div>
    );

  return (
    <main className="w-full h-full">
      {!isChildRoute ? (
        <div className="p-2">
          <div className="flex justify-between w-full mb-4">
            <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
              <i className="fas fa-broom mr-2"></i> Cleaning & Sanitation Overview
            </h2>

            <div className="flex gap-2 items-center">
              <Button
                isLoading={completePending}
                onClick={handleCompletionStatus}
                className="bg-blue-600 mt-0 h-10 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <i className="fa-solid fa-circle-check mr-2"></i>
                Mark as Complete
              </Button>

              <ResetStageButton projectId={projectId!} stageNumber={13} stagePath="cleaning" />
            </div>
          </div>

          <Card className="p-4 mb-4 w-full border-l-4 border-blue-600 bg-white shadow">
            <div className="flex items-center gap-3 text-blue-600 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-600 text-lg"></i>
              <span>Stage Timings</span>
            </div>

            <StageTimerInfo
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.rooms?.map((room:IRoomCleaning & {_id:string}) => (
              <Link
                key={room._id}
                to={`cleaningroom/${room._id}`}
                className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
              >
                <h3 className="text-md font-semibold capitalize text-blue-800">{room.roomName}</h3>
                <p className="text-xs text-gray-400">
                  {room.uploads?.length || 0} uploads
                </p>
                <p className="text-xs text-gray-400">
                  {room.completelyCleaned ? "✅ Completely Cleaned" : "❌ Not Cleaned"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </main>
  );
}
