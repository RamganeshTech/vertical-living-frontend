


import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useOutletContext, useParams } from "react-router-dom";
import { useAddRoom, useCompletionStatusSampleDesign, useDeleteRoomFile, useDeleteRoomSampleDesign, useGetRoomFiles, useSetDeadLineSampleDesign, useUploadRoomFiles } from "../../../apiList/Stage Api/sampleDesignApi";
import { toast } from "../../../utils/toast";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";
import AddRoomModel from "./AddRoomModel";
import FileUploadSection from "./FileUploadSection";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import type { ProjectDetailsOutlet } from "../../../types/types";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

const SampleDesignModule: React.FC = () => {
  const { projectId, organizationId } = useParams();
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()

  if (!projectId) return null;

  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const addRoom = useAddRoom();
  const {mutateAsync:uploadFiles, isPending:uploadPending} = useUploadRoomFiles();
  const deleteFile = useDeleteRoomFile();
  const { mutateAsync: deleteRoom, isPending: deleteRoomIsPending } = useDeleteRoomSampleDesign();
  const { data: sampleDesign, isLoading, refetch, error: getAllError } = useGetRoomFiles(projectId);

  const { mutateAsync: completeStatus, isPending: completePending } = useCompletionStatusSampleDesign();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSampleDesign();

  const handleCompletionStatus = async () => {
    try {
      if (!completePending) {
        await completeStatus({ projectId });
      }
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to update completion status", 
        variant: "destructive" 
      });
    }
  };

  const handleAddRoom = async (roomName: string) => {
    try {
      await addRoom.mutateAsync({ projectId, roomName });
      toast({ description: 'Room Created successfully', title: "Success" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to create room status", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      if (!completePending) {
        await deleteRoom({ projectId, roomId });
      }
      toast({ description: 'Room section Deleted successfully', title: "Success" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to delete the room", 
        variant: "destructive" 
      });
    }
  };

  const handleFileUpload = async (roomName: string, files: File[]) => {
    try {

       await uploadFiles({ projectId, roomName, files });
      toast({ description: 'File uploaded successfully', title: "Success" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || " Failed to upload the files", 
        variant: "destructive"
      });
    }
  };

  const handleFileDelete = async (roomName: string, fileIndex: number) => {
    try {
      await deleteFile.mutateAsync({ projectId, roomName, fileIndex });
      toast({ description: 'File deleted successfully', title: "Success" });
      refetch();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to delete the files", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) return <MaterialOverviewLoading />

  return (
    <div className="container mx-auto  max-w-full min-h-full">
      {/* Responsive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
             {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md  border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
          <i className="fa-solid fa-object-group mr-2"></i>Sample Design Files
        </h2>
        
        <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%] flex flex-col sm:flex-row gap-3 justify-end">
          <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
            <Button
              onClick={() => setShowAddRoomModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-initial min-w-max"
              disabled={!!getAllError}
            >
              <i className="fas fa-plus mr-2" />
             <span className="">Add room</span>
             {/* <span className="flex sm:hidden">Add room</span> */}
            </Button>
            
            <Button 
            isLoading={completePending}
              onClick={handleCompletionStatus} 
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
              disabled={!!getAllError}
            >
              <i className="fa-solid fa-circle-check mr-2"></i>
              Mark Complete
            </Button>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
            <ResetStageButton 
              projectId={projectId} 
              stageNumber={3} 
              stagePath="sampledesign" 
              className="flex-1 sm:flex-initial min-w-max"
              disabled={!!getAllError}
            />
            
            <AssignStageStaff
              stageName="SampleDesignModel"
              projectId={projectId}
              organizationId={organizationId!}
              currentAssignedStaff={sampleDesign?.assignedTo || null}
              className="flex-1 sm:flex-initial min-w-max"
            />
          </div>
        </div>
      </div>

      {/* Error Display - shown but doesn't hide header buttons */}
      {getAllError && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
          <div className="text-red-600 font-semibold mb-2">
            ⚠️ Error Occurred
          </div>
          <p className="text-red-500 text-sm mb-4">
            {(getAllError as any)?.response?.data?.message || "Failed to load data"}
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Content that should be hidden when error exists */}
      {!getAllError && (
        <>
          {/* Timer Card */}
          <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
              <span>Stage Timings</span>
            </div>
            <StageTimerInfo
              stageName='sampledesign'
              completedAt={sampleDesign?.timer?.compltedAt}
              formId={(sampleDesign as any)?._id}
              projectId={projectId}
              deadLine={sampleDesign?.timer?.deadLine}
              startedAt={sampleDesign?.timer?.startedAt}
              refetchStageMutate={refetch}
              deadLineMutate={deadLineAsync}
              isPending={deadLinePending}
            />
          </Card>

          {/* Rooms Content */}
          {(!sampleDesign?.rooms || sampleDesign.rooms.length === 0) ? (
            <div className="text-center py-10 sm:py-16 bg-white rounded-lg shadow-sm">
              <i className="fas fa-home text-blue-200 text-5xl sm:text-6xl mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Rooms Added Yet</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Start by adding a room to upload design files</p>
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-w-[200px]"
              >
                <i className="fas fa-plus mr-2" />
                Add Your First Room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:max-h-[60vh] md:max-h-[47vh] lg:max-h-[55vh] xl:max-h-[65vh] overflow-y-auto custom-scrollbar gap-6">
              {sampleDesign.rooms.map((room: any) => (
                <div key={room.roomName} className="bg-white border-l-4 border-blue-600 rounded-xl shadow-sm p-1 sm:p-6 flex flex-col">
                  <div className="flex sm:flex-row items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-semibold text-blue-700 truncate">
                      <i className="fas fa-door-open mr-2" />
                      {room.roomName}
                    </h2>

                    <Button 
                      isLoading={deleteRoomIsPending} 
                      onClick={() => handleDeleteRoom(room._id)} 
                      variant="danger" 
                      className="bg-red-600 text-white  sm:w-auto mt-2 sm:mt-0"
                    >
                      <i className="fa-solid fa-trash mr-2"></i>
                      Delete
                    </Button>
                  </div>

                  <div className="flex-grow">
                    <FileUploadSection
                      files={room.files}
                      onUpload={(files: any) => handleFileUpload(room.roomName, files)}
                      onDelete={(index: number) => handleFileDelete(room.roomName, index)}
                      uploadPending={uploadPending}
                      deletePending={deleteFile.isPending}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddRoomModel
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onSubmit={handleAddRoom}
        addPending={addRoom.isPending}
      />
    </div>
  );
};

export default SampleDesignModule;