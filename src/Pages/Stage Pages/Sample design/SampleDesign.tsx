import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useParams } from "react-router-dom";
import { useAddRoom, useCompletionStatusSampleDesign, useDeleteRoomFile, useDeleteRoomSampleDesign, useGetRoomFiles, useSetDeadLineSampleDesign, useUploadRoomFiles } from "../../../apiList/Stage Api/sampleDesignApi";
import { toast } from "../../../utils/toast";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";
import AddRoomModel from "./AddRoomModel";
import FileUploadSection from "./FileUploadSection";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";

// Main component
const SampleDesignModule: React.FC = () => {

  const { projectId , organizationId} = useParams()

  if (!projectId) return;

  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const addRoom = useAddRoom();
  const uploadFiles = useUploadRoomFiles();
  const deleteFile = useDeleteRoomFile();
  const { mutateAsync: deleteRoom, isPending:deleteRoomIsPending } = useDeleteRoomSampleDesign();
  const { data: sampleDesign, isLoading, refetch } = useGetRoomFiles(projectId);

  const { mutateAsync: completeStatus, isPending: completePending } = useCompletionStatusSampleDesign()
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSampleDesign()

  console.log("sampleDesing")

  // sampleDesign.rooms[0,1].files=[

  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //         {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //         {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //         {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "living-room.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "image",
  //           url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
  //           originalName: "kitchen-view.jpg",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "pdf",
  //           url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //           originalName: "site-layout.pdf",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "pdf",
  //           url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //           originalName: "site-layout.pdf",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "pdf",
  //           url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //           originalName: "site-layout.pdf",
  //           uploadedAt: new Date().toISOString(),
  //       },
  //       {
  //           type: "pdf",
  //           url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //           originalName: "site-layout.pdf",
  //           uploadedAt: new Date().toISOString(),
  //       },

  // ]

  const handleCompletionStatus = async () => {
    try {
      if (!completePending) {
        await completeStatus({ projectId });
      }
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

    }
  };

  const handleAddRoom = async (roomName: string) => {
    try {
      await addRoom.mutateAsync({ projectId, roomName });
      toast({ description: 'Room Created successfully', title: "Success" });

    } catch (error:any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to create room status", variant: "destructive" })
    }
  };


  const handleDeleteRoom = async (roomId: string) => {
    try {
      if (!completePending) {
        await deleteRoom({ projectId, roomId });
      }
      toast({ description: 'Room secion Deleted successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete the room", variant: "destructive" })

    }
  };

  const handleFileUpload = async (roomName: string, files: File[]) => {
    try {
      await uploadFiles.mutateAsync({ projectId, roomName, files });
      toast({ description: 'File uploaded successfully', title: "Success" });
      refetch()
    } catch (error:any) {
      toast({ title: "Error"
        , description: error?.response?.data?.message || error.message || " Failed to upload the files", variant: "destructive" })

    }
  };

  const handleFileDelete = async (roomName: string, fileIndex: number) => {
    try {
      await deleteFile.mutateAsync({ projectId, roomName, fileIndex });
      toast({ description: 'File deleted successfully', title: "Success" });
      refetch()
    } catch (error:any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete the files", variant: "destructive" })
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container h-full overflow-y-scroll mx-auto max-w-full">
      <div className="flex justify-between items-center mb-8">

         <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
            <i className="fa-solid fa-object-group mr-2"></i>Sample Design Files
          </h2>

        <div className='flex items-center gap-2 justify-between'>
          <button
            onClick={() => setShowAddRoomModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <i className="fas fa-plus mr-2" />
            Add Room
          </button>

          <Button onClick={handleCompletionStatus} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
            <i className="fa-solid fa-circle-check mr-2"></i>
            Mark as Complete
          </Button>

        <ResetStageButton projectId={projectId!} stageNumber={3} stagePath="sampledesign" />

          <AssignStageStaff
                    stageName="SampleDesignModel"
                    projectId={projectId}
                    organizationId={organizationId!}
                    currentAssignedStaff={sampleDesign?.assignedTo || null}
                  />
        </div>
      </div>

      <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
          <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
          <span>Stage Timings</span>
        </div>
        {/* Keep content within this component, it will now handle horizontal layout */}
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


      {(!sampleDesign?.rooms || sampleDesign.rooms.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <i className="fas fa-home text-blue-200 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Rooms Added Yet</h2>
          <p className="text-gray-500 mb-4">Start by adding a room to upload design files</p>
          <button
            onClick={() => setShowAddRoomModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <i className="fas fa-plus mr-2" />
            Add Your First Room
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sampleDesign.rooms.map((room: any) => (
            <div key={room.roomName} className="bg-white border-l-4 border-blue-600 rounded-xl shadow-sm p-6">
             
              <div className="w-full flex items-center justify-between ">
                <h2 className="text-2xl font-semibold text-blue-700">
                  <i className="fas fa-door-open mr-2" />
                  {room.roomName}
                </h2>

                <Button isLoading={deleteRoomIsPending} onClick={() => handleDeleteRoom(room._id)} variant="danger" className="bg-red-600 text-white w-full sm:w-auto">
                  <i className="fa-solid fa-trash mr-2"></i>
                  delete
                </Button>
              </div>
              
              <FileUploadSection
                files={room.files}
                onUpload={(files: any) => handleFileUpload(room.roomName, files)}
                onDelete={(index: number) => handleFileDelete(room.roomName, index)}
                uploadPending={uploadFiles.isPending}
                deletePending={deleteFile.isPending}
              />
            </div>
          ))}
        </div>
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
