


import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Link, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
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
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

const SampleDesignModule: React.FC = () => {
  const { projectId, organizationId } = useParams() as{projectId:string, organizationId:string};
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()
  const navigate = useNavigate()



  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.sampledesign?.delete;
  // const canList = role === "owner" || permission?.sampledesign?.list;
  const canCreate = role === "owner" || permission?.sampledesign?.create;
  const canEdit = role === "owner" || permission?.sampledesign?.edit;


  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const addRoom = useAddRoom();
  const { mutateAsync: uploadFiles, isPending: uploadPending } = useUploadRoomFiles();
  const deleteFile = useDeleteRoomFile();
  const { mutateAsync: deleteRoom, isPending: deleteRoomIsPending } = useDeleteRoomSampleDesign();
  const { data: sampleDesign, isLoading, refetch, error: getAllError } = useGetRoomFiles(projectId);

  const { mutateAsync: completeStatus, isPending: completePending } = useCompletionStatusSampleDesign();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSampleDesign();

  const handleCompletionStatus = async () => {
    try {
      if (!completePending) {
        await completeStatus({ projectId });
        navigate('../workmainschedule')
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

  const handleFileDelete = async (roomName: string, fileId: string) => {
    try {
      await deleteFile.mutateAsync({ projectId, roomName, fileId });
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

  const isChildRoute = location.pathname.includes("shortlist")
  if (isChildRoute) {
    return <Outlet />
  }

  return (
    // <div className="container mx-auto max-h-full overflow-y-auto max-w-full min-h-full">
    <div className="container mx-auto max-h-full overflow-y-auto max-w-full min-h-full bg-brand-surface ">
      {/* Responsive Header */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-ash-light">
        {/* <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center"> */}
        <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-text-main flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              // className="mr-3 p-2 rounded-md  border-gray-300 hover:bg-gray-100"
              className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          {/* <i className="fa-solid fa-object-group mr-2"></i>Sample Design Files */}
          <i className="fa-solid fa-object-group mr-3 text-ash-dark"></i>Sample Design Files
        </h2>

        <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%] flex flex-col sm:flex-row gap-3 justify-end">
          <div className="flex  flex-wrap md:flex-nowrap gap-2 justify-end">
            {(canCreate || canEdit) && <Button
            variant="white"
              onClick={() => setShowAddRoomModal(true)}
              // className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-initial min-w-max"
              disabled={!!getAllError}
            >
              <i className="fas fa-plus mr-2 text-ash-dark" />
              <span className="">Add room</span>
              {/* <span className="flex sm:hidden">Add room</span> */}
            </Button>}

            {(canCreate || canEdit) && <Button
            variant="dark"
              isLoading={completePending}
              onClick={handleCompletionStatus}
              // className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
              className="flex-1 sm:flex-initial min-w-max"
              disabled={!!getAllError}
            >
              {/* <i className="fa-solid fa-circle-check mr-2"></i> */}
              <i className="fa-regular fa-circle-check mr-2 text-action-success"></i>
              Mark Complete
            </Button>}
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">

            {(canCreate || canEdit) && <ResetStageButton
              projectId={projectId}
              stageNumber={3}
              stagePath="sampledesign"
              className="flex-1 sm:flex-initial min-w-max"
              disabled={!!getAllError}
            />
            }

            {/* {(!getAllError && (canCreate || canEdit)) && <ShareDocumentWhatsapp
              projectId={projectId}
              stageNumber="3"
              className="w-full sm:w-fit"
              isStageCompleted={sampleDesign?.status}
            />} */}

            <AssignStageStaff
              stageName="SampleDesignModel"
              projectId={projectId}
              organizationId={organizationId!}
              currentAssignedStaff={sampleDesign?.assignedTo || null}
              className="flex-1 sm:flex-initial min-w-max"
            />

            <div className="w-full sm:w-auto flex justify-end sm:block">
              <StageGuide
                organizationId={organizationId!}
                stageName="sampledesign"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display - shown but doesn't hide header buttons */}
      {/* {getAllError && (
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
      )} */}

      {getAllError && (
        <div className="max-w-xl mx-auto p-5 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mb-6">
          <div className="text-action-danger text-2xl mb-3">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="text-text-main font-bold mb-2">
            Error Occurred
          </div>
          <p className="text-text-muted text-sm mb-5">
            {(getAllError as any)?.response?.data?.message || "Failed to load data"}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="hover:bg-brand-ash hover:text-action-danger hover:border-action-danger text-text-main border-ash-medium"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Content that should be hidden when error exists */}
      {!getAllError && (
        <>
          {/* Timer Card */}
          {/* <Card className="p-4 mb-6 w-full shadow border-l-4 border-blue-600 bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
              <span>Stage Timings</span>
            </div> */}

            <Card className="p-5 mb-6 w-full shadow-sm border border-ash-medium rounded-xl bg-brand-surface">
            <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
              <i className="fa-regular fa-clock text-ash-dark text-base"></i>
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


          {/* <Card className="mb-6  text-blue-600 border-l-4 border-1 border-blue-600">
            <Link to={`shortlist`}>
              <div className="py-4 ml-2 flex justify-between items-center">
                <p className="text-md sm:text-xl">Sample Reference Designs</p>
                <i className="mr-4 fas fa-arrow-right text-blue-600"></i>
              </div>
            </Link>
          </Card> */}

          



<Link to={`shortlist`} className="block mb-8 m-[2px]"> {/* Added m-[2px] to fix clipping */}
            <Card className="bg-brand-surface border border-ash-medium rounded-xl shadow-sm hover:border-text-muted hover:shadow-md transition-all cursor-pointer group">
              <div className="py-4 px-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center shadow-sm">
                    <i className="fa-regular fa-image text-text-muted"></i>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-text-main">Sample Reference Designs</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-ash group-hover:bg-action-primary transition-colors">
                  <i className="fas fa-arrow-right text-ash-dark group-hover:text-brand-surface transition-colors text-sm"></i>
                </div>
              </div>
            </Card>
          </Link>
         

          {/* Rooms Content */}
          {(!sampleDesign?.rooms || sampleDesign.rooms.length === 0) ? (
            // <div className="text-center py-10 sm:py-16 bg-white rounded-lg shadow-sm">
            <div className="text-center py-12 sm:py-16 bg-brand-surface border border-dashed border-ash-medium rounded-xl shadow-sm">
              <i className="fas fa-home text-ash-dark text-5xl sm:text-6xl mb-4" />
              {/* <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Rooms Added Yet</h2> */}
              <h2 className="text-lg sm:text-xl font-bold text-text-main mb-2">No Rooms Added Yet</h2>
              {/* <p className="text-gray-500 mb-6 max-w-md mx-auto">Start by adding a room to upload design files</p> */}
              <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">Start by adding a room to organize and upload design files.</p>
              {(canCreate || canEdit) && <Button
              variant="dark"
                onClick={() => setShowAddRoomModal(true)}
                // className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-w-[200px]"
                className="px-6"
              >
                {/* <i className="fas fa-plus mr-2" /> */}
                <i className="fas fa-plus mr-2 text-brand-surface" />
                Add Your First Room
              </Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1  gap-6">
              {sampleDesign.rooms.map((room: any) => (
                // <div key={room.roomName} className="bg-white border-l-4 border-blue-600 rounded-xl shadow-sm p-1 sm:p-6 flex flex-col">
                <div key={room.roomName} className="bg-brand-surface border border-ash-medium rounded-xl shadow-sm p-4 sm:p-6 flex flex-col">
                  <div className="flex sm:flex-row items-center justify-between gap-3 mb-4">
                    {/* <h2 className="text-xl font-semibold text-blue-700 truncate"> */}
                    <h2 className="text-lg font-bold text-text-main truncate flex items-center">
                      <i className="fas fa-door-open mr-2" />
                      {room.roomName}
                    </h2>

                    {canDelete && <Button
                      isLoading={deleteRoomIsPending}
                      onClick={() => handleDeleteRoom(room._id)}
                      variant="ghost"
                      // className="bg-red-600 text-white  sm:w-auto mt-2 sm:mt-0"
                      className="h-8 px-3 text-text-muted hover:text-text-main bg-transparent hover:bg-brand-ash border border-transparent hover:border-ash-medium transition-all rounded-lg"
                    >
                      <i className="fa-solid fa-trash mr-2"></i>
                      <span className="hidden sm:inline text-xs ml-2 font-semibold tracking-wide">Delete</span>
                      {/* Delete */}
                    </Button>}
                  </div>

                  <div className="flex-grow">
                    <FileUploadSection
                      files={room.files}
                      onUpload={(files: any) => handleFileUpload(room.roomName, files)}
                      onDelete={(fileId: string) => handleFileDelete(room.roomName, fileId)}
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