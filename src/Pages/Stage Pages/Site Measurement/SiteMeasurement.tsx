// HomeInteriorProject.tsx
import { useState } from 'react';
import {
  useGetSiteMeasurementDetails,
  useUpdateCommonSiteMeasurementDetails,
  useUdpateSiteMeasurmentRoomDetails,
  useDeleteRoomFromMeauserementStage,
  useUploadRequirementFiles,
  useCreateMeasurement,
  useCreateRoomSiteMeasurement,
  useDeleteSiteMeasurementAndResetTimer,
  useSetDeadLineSiteMeasurement,
  useCompletionStatusSiteMeasurement,
  useDeleteSiteRequriementFile
} from './../../../apiList/Stage Api/siteMeasurementApi';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import type { ProjectDetailsOutlet, SiteDetails, SiteRooms } from "../../../types/types";
import { toast } from '../../../utils/toast';
import { Card } from '../../../components/ui/Card';
import StageTimerInfo from '../../../shared/StagetimerInfo';
import RequirementFileUploader from '../../../shared/StageFileUploader';
import { Button } from '../../../components/ui/Button';
import CommonSiteInfo from './CommonSiteInfo';
import SiteRoomInfo from './SiteRoomInfo';
import CommonSiteForm from './CommonSiteForm';
import { ResetStageButton } from '../../../shared/ResetStageButton';
import MaterialOverviewLoading from '../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import AssignStageStaff from '../../../shared/AssignStaff';
// import ShareDocumentWhatsapp from '../../../shared/ShareDocumentWhatsapp';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import StageGuide from '../../../shared/StageGuide';

const initialSiteDetails: SiteDetails = {
  totalPlotAreaSqFt: null,
  builtUpAreaSqFt: null,
  roadFacing: null,
  numberOfFloors: null,
  hasSlope: false,
  boundaryWallExists: false,
  additionalNotes: null
};

const initialRoomDetails: SiteRooms = {
  name: null,
  length: null,
  breadth: null,
  height: null,
  uploads: []
};

function HomeInteriorProject() {
  const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string }
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()

  // if (!projectId) return
  const navigate = useNavigate()

  const [showSiteForm, setShowSiteForm] = useState<boolean>(false);
  const [showRoomForm, setShowRoomForm] = useState<boolean>(false);
  const [siteDetails, setSiteDetails] = useState<SiteDetails>(initialSiteDetails);
  const [roomDetails, setRoomDetails] = useState<SiteRooms>(initialRoomDetails);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  let { data: measurementData, isLoading, refetch, error: getAllError } = useGetSiteMeasurementDetails({ projectId: projectId! });
  const createMeasurement = useCreateMeasurement();
  const createRoom = useCreateRoomSiteMeasurement();
  const updateSiteDetails = useUpdateCommonSiteMeasurementDetails();
  const updateRoomDetails = useUdpateSiteMeasurmentRoomDetails();
  const deleteRoom = useDeleteRoomFromMeauserementStage();
  const deleteSiteMeasurement = useDeleteSiteMeasurementAndResetTimer();
  const updateCompletionStatus = useCompletionStatusSiteMeasurement();

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSiteMeasurement()
  const { mutateAsync: uploadFilesMutate, isPending: uploadPending } = useUploadRequirementFiles()
  const { mutateAsync: deleteUploadFile, isPending: deleteUploadPending } = useDeleteSiteRequriementFile()


  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.sitemeasurement?.delete;
  // const canList = role === "owner" || permission?.sitemeasurement?.list;
  const canCreate = role === "owner" || permission?.sitemeasurement?.create;
  const canEdit = role === "owner" || permission?.sitemeasurement?.edit;




  // Handlers
  const handleSiteSubmit = async () => {
    try {
      const isCreated = Object.values(measurementData.siteDetails).some(value => typeof value === "number")
      if (isCreated) {
        await updateSiteDetails.mutateAsync({ projectId, payload: siteDetails });
      } else {
        await createMeasurement.mutateAsync({ projectId, siteDetails });
      }
      setShowSiteForm(false);
      toast({ description: 'Site details updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to save site details", variant: "destructive" })
    }
  };

  const handleRoomSubmit = async () => {
    try {

      if (!roomDetails.name) throw new Error("please select the name")

      const calculatedArea = roomDetails.length && roomDetails.breadth
        ? (Number(roomDetails.length) * Number(roomDetails.breadth)).toFixed(2)
        : null;

      const roomData = { ...roomDetails, area: calculatedArea };

      if (editingRoomId) {
        await updateRoomDetails.mutateAsync({
          projectId,
          roomId: editingRoomId,
          room: roomData
        });
      } else {
        await createRoom.mutateAsync({ projectId, room: roomData });
      }
      setShowRoomForm(false);
      setEditingRoomId(null);
      setRoomDetails(initialRoomDetails);
      toast({ description: editingRoomId ? 'Room updated' : 'Room added', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Operation failed", variant: "destructive" });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom.mutateAsync({ projectId, roomId });
      toast({ description: 'Room deleted', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Delete failed", variant: "destructive" });
    }
  };

  const handleDeleteSiteMeasurement = async () => {
    try {
      await deleteSiteMeasurement.mutateAsync({ projectId });
      toast({ description: 'Site measurement deleted', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Delete failed", variant: "destructive" });
    }
  };

  const handleCompletionStatus = async () => {
    try {
      await updateCompletionStatus.mutateAsync({ projectId });
      toast({ description: 'Completion updated', title: "Success" });
      navigate(`../sampledesign`)
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Update failed", variant: "destructive" });
    }
  };

  const handleEditRoom = (room: SiteRooms) => {
    setRoomDetails(room);
    setEditingRoomId((room as any)?._id);
    setShowRoomForm(true);
  };

  if (isLoading) return <MaterialOverviewLoading />;

  return (
    <div className="container mx-auto px-2 py-2 bg-brand-surface max-w-full h-full w-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-ash-light">
        <div className="w-full sm:w-auto">
          {/* <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center"> */}
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main flex items-center">
            {isMobile && (
              <button
                onClick={openMobileSidebar}
                // className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
                title="Open Menu"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            )}
            {/* <i className="fa-solid fa-receipt mr-2"></i> Site Measurement */}
            <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
              <i className="fa-solid fa-ruler-combined text-text-muted text-lg"></i>
            </div>
            <span className="leading-tight">Site Measurement</span>
          </h2>
          {/* <p className="text-gray-600 hidden sm:block text-sm sm:text-base">Plan your dream home</p> */}
          <p className="text-sm sm:text-base font-bold tracking-wider text-text-muted mt-2 hidden sm:block">Plan your dream home</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2  !w-[100%] sm:!w-[50%] lg:!w-[60%] justify-start lg:justify-end">
          {(canCreate || canEdit) && <Button
            isLoading={updateCompletionStatus.isPending}
            onClick={handleCompletionStatus}
            variant='dark'
          // className="bg-green-600 hover:bg-green-700 text-white px-4 py-2  w-full sm:w-auto"
          >
            {/* <i className="fa-solid fa-circle-check mr-2"></i>  */}
            <i className="fa-solid fa-circle-check mr-2 text-action-success"></i>
            Mark Complete
          </Button>}

          {(canCreate || canEdit) && <ResetStageButton
            projectId={projectId!}
            stageNumber={2}
            stagePath="sitemeasurement"
            className="sm:!max-w-[20%] w-full"
          />}

          {/* {!getAllError && <ShareDocumentWhatsapp
            projectId={projectId}
            stageNumber="2"
            className="w-full sm:w-fit"
            isStageCompleted={measurementData?.status}
          />} */}

          <AssignStageStaff
            stageName="SiteMeasurementModel"
            projectId={projectId}
            organizationId={organizationId!}
            currentAssignedStaff={measurementData?.assignedTo || null}
            className="w-full sm:w-auto"

          />

          <div className="w-full sm:w-auto flex justify-end sm:block">
            <StageGuide
              organizationId={organizationId!}
              stageName="sitemeasurement"
            />
          </div>
        </div>
      </div>

      {getAllError && (


        // <div className="max-w-xl mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mt-8">
        //   <div className="text-action-danger text-3xl mb-3">
        //     <i className="fa-solid fa-triangle-exclamation"></i>
        //   </div>
        //   <div className="text-text-main text-lg font-bold mb-2">Error Occurred</div>
        //   <p className="text-text-muted text-sm mb-5">
        //     {(getAllError as any)?.response?.data?.message || "Failed to load site measurement data"}
        //   </p>
        //   <Button
        //     isLoading={isLoading}
        //     onClick={() => refetch()}
        //     variant="outline"
        //     className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
        //   >
        //     Retry
        //   </Button>
        // </div>

        <div className="max-w-xl mx-auto p-8 bg-brand-surface border-2 border-ash-medium rounded-xl shadow-sm text-center mt-8">

          {/* Soft, neutral icon wrapper instead of a stark warning */}
          <div className="w-16 h-16 bg-brand-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 border border-ash-medium shadow-sm">
            <i className="fa-solid fa-lock text-text-muted text-2xl"></i>
          </div>

          {/* Professional, non-alarming title */}
          <div className="text-text-strong text-lg font-bold mb-2">
            Stage Not Yet Available
          </div>

          {/* Clear explanation of the business logic */}
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto leading-relaxed">
            {/* {(getAllError as any)?.response?.data?.message} */}
            This section is currently locked. Please ensure all required steps in the previous stage are fully completed before accessing this information.
          </p>

          {/* Neutral action button */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary hover:bg-brand-surface-hover transition-all px-3 shadow-sm"
          >
            <i className="fas fa-sync-alt mr-2 text-text-soft"></i> Refresh
          </Button>

        </div>
      )}

      {!getAllError &&
        // <Card className="p-4 mb-4 shadow border-l-4 border-blue-600 bg-white">
        //   <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
        //     <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
        //     <span>Stage Timings</span>
        //   </div>

        <Card className="p-4 shadow-sm border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
          <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
            <i className="fa-regular fa-clock text-ash-dark text-base"></i>
            <span>Stage Timings</span>
          </div>
          <StageTimerInfo
            completedAt={measurementData?.timer?.compltedAt}
            stageName='sitemeasurement'
            formId={(measurementData as any)?._id}
            projectId={projectId}
            deadLine={measurementData?.timer?.deadLine}
            startedAt={measurementData?.timer?.startedAt}
            refetchStageMutate={refetch}
            deadLineMutate={deadLineAsync}
            isPending={deadLinePending}
          />
        </Card>
      }
      {!getAllError && <div className="my-6">
        {/* <Card className="p-4 shadow border-l-4 border-blue-500 bg-white"> */}
        {/* <Card className="p-5 w-full bg-white shadow-sm border border-gray-200 rounded-xl"> */}
        <Card className="p-4 w-full bg-brand-surface shadow-sm border-2 border-ash-medium rounded-xl">
          <RequirementFileUploader
            enableUpload={canEdit || canCreate}
            autoUpload={true}
            formId={measurementData?._id}
            refetch={refetch}
            existingUploads={measurementData?.uploads}
            onUploadComplete={refetch}
            uploadFilesMutate={uploadFilesMutate}
            uploadPending={uploadPending}
            projectId={projectId}
            onDeleteUpload={deleteUploadFile}
            deleteFilePending={deleteUploadPending}
          />
        </Card>
      </div>
      }
      {!getAllError &&
        <>
          {!Object.values(measurementData?.siteDetails || {}).some((ele: any) => ele !== null) && !showSiteForm ? (
            // <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-10 text-center mb-6">
            <div className="bg-brand-surface rounded-xl shadow-sm border-1 border-dashed border-ash-medium p-10 text-center">
              {/* <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div> */}

              <div className="w-16 h-16 bg-brand-ash border border-ash-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fa-solid fa-file-contract text-2xl text-ash-dark"></i>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">No Site Details Added</h3>
              <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">Start by configuring the primary details and layout of the site.</p>

              {(canEdit || canCreate) && (
                <Button
                  onClick={() => setShowSiteForm(true)}
                  variant="dark"
                  className="px-5 py-2.5"
                >
                  <i className="fa-solid fa-plus mr-2"></i> Add Site Details
                </Button>
              )}
            </div>
          ) : (
            <CommonSiteInfo   // this has teh room cards also 
              measurementData={measurementData}
              handleDeleteSiteMeasurement={handleDeleteSiteMeasurement}
              setShowSiteForm={setShowSiteForm}
              setShowRoomForm={setShowRoomForm}
              handleEditRoom={handleEditRoom}
              handleDeleteRoom={handleDeleteRoom}
              deleteRoomLoading={deleteRoom.isPending}
            />
          )}

          {showSiteForm && (
            <CommonSiteForm
              siteDetails={siteDetails}
              setSiteDetails={setSiteDetails}
              handleSiteSubmit={handleSiteSubmit}
              setShowSiteForm={setShowSiteForm}
              updatePending={updateSiteDetails.isPending}
            />
          )}

          {showRoomForm && (
            <SiteRoomInfo
              handleRoomSubmit={handleRoomSubmit}
              setShowRoomForm={setShowRoomForm}
              roomDetails={roomDetails}
              setRoomDetails={setRoomDetails}
              updateRoomLoading={updateRoomDetails.isPending}
              createRoomLoading={createRoom.isPending}
              editingRoomId={editingRoomId}
            />
          )}
        </>
      }
    </div>
  );
}

export default HomeInteriorProject;