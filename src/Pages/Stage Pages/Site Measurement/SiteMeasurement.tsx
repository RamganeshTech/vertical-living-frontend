// import { useState } from 'react';
// import {
//   useGetSiteMeasurementDetails,
//   useUpdateCommonSiteMeasurementDetails,
//   useUdpateSiteMeasurmentRoomDetails,
//   useDeleteRoomFromMeauserementStage,
//   useUploadRequirementFiles,
//   useCreateMeasurement,
//   useCreateRoomSiteMeasurement,
//   useDeleteSiteMeasurementAndResetTimer,
//   useSetDeadLineSiteMeasurement,
//   useCompletionStatusSiteMeasurement,
//   useDeleteSiteRequriementFile
// } from './../../../apiList/Stage Api/siteMeasurementApi';
// import { useParams } from 'react-router-dom';

// import type { SiteDetails, SiteRooms } from "../../../types/types";
// import { toast } from '../../../utils/toast';
// import { Card } from '../../../components/ui/Card';
// import StageTimerInfo from '../../../shared/StagetimerInfo';
// import RequirementFileUploader from '../../../shared/StageFileUploader';
// import { Button } from '../../../components/ui/Button';
// import CommonSiteInfo from './CommonSiteInfo';
// import SiteRoomInfo from './SiteRoomInfo';
// import CommonSiteForm from './CommonSiteForm';
// import { ResetStageButton } from '../../../shared/ResetStageButton';
// import MaterialOverviewLoading from '../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
// import AssignStageStaff from '../../../shared/AssignStaff';

// const initialSiteDetails: SiteDetails = {
//   totalPlotAreaSqFt: null,
//   builtUpAreaSqFt: null,
//   roadFacing: null,
//   numberOfFloors: null,
//   hasSlope: false,
//   boundaryWallExists: false,
//   additionalNotes: null
// };

// const initialRoomDetails: SiteRooms = {
//   name: null,
//   length: null,
//   breadth: null,
//   height: null,
// };

// function HomeInteriorProject() {
//   const { projectId, organizationId } = useParams()
//   if (!projectId) return

//   const [showSiteForm, setShowSiteForm] = useState<boolean>(false);
//   const [showRoomForm, setShowRoomForm] = useState<boolean>(false);
//   const [siteDetails, setSiteDetails] = useState<SiteDetails>(initialSiteDetails);
//   const [roomDetails, setRoomDetails] = useState<SiteRooms>(initialRoomDetails);
//   const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

//   let { data: measurementData, isLoading, refetch, error: getAllError } = useGetSiteMeasurementDetails({ projectId: projectId! });
//   const createMeasurement = useCreateMeasurement();
//   const createRoom = useCreateRoomSiteMeasurement();
//   const updateSiteDetails = useUpdateCommonSiteMeasurementDetails();
//   const updateRoomDetails = useUdpateSiteMeasurmentRoomDetails();
//   const deleteRoom = useDeleteRoomFromMeauserementStage();
//   const deleteSiteMeasurement = useDeleteSiteMeasurementAndResetTimer();
//   const updateCompletionStatus = useCompletionStatusSiteMeasurement();

//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSiteMeasurement()
//   const { mutateAsync: uploadFilesMutate, isPending: uploadPending } = useUploadRequirementFiles()
//   const { mutateAsync: deleteUploadFile, isPending: deleteUploadPending } = useDeleteSiteRequriementFile()

//   // Handlers

//   const handleSiteSubmit = async () => {
//     try {
//       if (measurementData) {
//         await updateSiteDetails.mutateAsync({ projectId, payload: siteDetails });
//         toast({ description: 'Site details updated successfully', title: "Success" });

//       } else {
//         await createMeasurement.mutateAsync({ projectId, siteDetails });
//         toast({ description: 'Site details updated successfully', title: "Success" });

//       }
//       setShowSiteForm(false);
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to save site details", variant: "destructive" })
//     }
//   };

//   const handleRoomSubmit = async () => {
//     try {
//       const calculatedArea = roomDetails.length && roomDetails.breadth
//         ? (Number(roomDetails.length) * Number(roomDetails.breadth)).toFixed(2)
//         : null;

//       const roomData = {
//         ...roomDetails,
//         area: calculatedArea
//       };

//       if (editingRoomId) {
//         await updateRoomDetails.mutateAsync({
//           projectId,
//           roomId: editingRoomId,
//           room: roomData
//         });
//         toast({ description: 'Room updated successfully', title: "Success" });

//       } else {
//         console.log("roomdata", roomData)
//         await createRoom.mutateAsync({ projectId, room: roomData });
//         toast({ description: 'Room added successfully', title: "Success" });
//       }
//       setShowRoomForm(false);
//       setEditingRoomId(null);
//       setRoomDetails(initialRoomDetails);
//     } catch (error: any) {
//       console.log(error.message)
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "operation failed please try again", variant: "destructive" })


//     }
//   };

//   const handleDeleteRoom = async (roomId: string) => {
//     try {
//       await deleteRoom.mutateAsync({ projectId, roomId });
//       toast({ description: 'Site measurement deleted successfully', title: "Success" });

//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete room", variant: "destructive" })

//     }
//   };

//   const handleDeleteSiteMeasurement = async () => {
//     try {
//       await deleteSiteMeasurement.mutateAsync({ projectId });
//       toast({ description: 'Site measurement deleted successfully', title: "Success" });
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete site measurement", variant: "destructive" })

//     }
//   };

//   const handleCompletionStatus = async () => {
//     try {
//       await updateCompletionStatus.mutateAsync({ projectId });
//       toast({ description: 'Completion status updated successfully', title: "Success" });
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

//     }
//   };


//   const handleEditRoom = (room: SiteRooms) => {
//     setRoomDetails(room);
//     setEditingRoomId((room as any)._id);
//     setShowRoomForm(true);
//   };



//   if (isLoading) {
//     return <MaterialOverviewLoading />
//   }

//   return (
//     <div className="container mx-auto px-2 sm:px-6 lg:px-2 py-2 max-w-full h-full overflow-y-auto">
//       <div className='flex justify-between items-center  mb-8'>
//         <div>
//           <h2 className="text-3xl font-semibold text-blue-600 mb-1 flex items-center">
//             <i className="fa-solid fa-receipt mr-2"></i>Site Measurement
//           </h2>
//           <p className="text-gray-600">Plan your dream home by adding site measurements and room details</p>
//         </div>

//         <div className='flex items-center gap-2 justify-between'>
//           <Button onClick={handleCompletionStatus} className="bg-green-600 mt-2 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
//             <i className="fa-solid fa-circle-check mr-2"></i>
//             Mark as Complete
//           </Button>

//           <ResetStageButton projectId={projectId!} stageNumber={2} stagePath="sitemeasurement" />

//           <AssignStageStaff
//             stageName="SiteMeasurementModel"
//             projectId={projectId}
//                 organizationId={organizationId!}
//             currentAssignedStaff={measurementData?.assignedTo || null}
//           />
//         </div>
//       </div>


//       {getAllError &&
//         <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//           <div className="text-red-600 text-xl font-semibold mb-2">
//             ⚠️ Oops! An Error Occurred
//           </div>
//           <p className="text-red-500 text-sm mb-4">
//             {(getAllError as any)?.response?.data?.message ||
//               (getAllError as any)?.message ||
//               "Failed to load , please try again"}
//           </p>

//           <Button
//             isLoading={isLoading}
//             onClick={() => refetch()}
//             className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
//           >
//             Retry
//           </Button>
//         </div>
//       }

//       <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
//         <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//           <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//           <span>Stage Timings</span>
//         </div>
//         {/* Keep content within this component, it will now handle horizontal layout */}
//         <StageTimerInfo
//           completedAt={measurementData?.timer?.compltedAt}
//           stageName='sitemeasurement'
//           formId={(measurementData as any)?._id}
//           projectId={projectId}
//           deadLine={measurementData?.timer?.deadLine}
//           startedAt={measurementData?.timer?.startedAt}
//           refetchStageMutate={refetch}
//           deadLineMutate={deadLineAsync}
//           isPending={deadLinePending}
//         />
//       </Card>

//       <div className="">
//         <Card className="p-4 shadow border-l-4 border-blue-500 bg-white">
//           <RequirementFileUploader
//             formId={measurementData?._id}
//             existingUploads={measurementData?.uploads}
//             onUploadComplete={refetch}
//             uploadFilesMutate={uploadFilesMutate}
//             uploadPending={uploadPending}
//             projectId={projectId}
//             onDeleteUpload={deleteUploadFile}
//             deleteFilePending={deleteUploadPending}
//           />
//         </Card>
//       </div>

//       {!Object.values(measurementData?.siteDetails)?.some((ele: any) => ele !== null) && !showSiteForm ? (
//         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//           </div>
//           <p className="text-gray-600 mb-4">No Site Details Added</p>
//           <button
//             onClick={() => setShowSiteForm(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Add Site Details
//           </button>
//         </div>
//       )
//         :
//         <CommonSiteInfo measurementData={measurementData} handleDeleteSiteMeasurement={handleDeleteSiteMeasurement}
//           setShowSiteForm={setShowSiteForm} setShowRoomForm={setShowRoomForm} handleEditRoom={handleEditRoom}
//           handleDeleteRoom={handleDeleteRoom} />
//       }

//       {showSiteForm && (
//         <CommonSiteForm siteDetails={siteDetails} setSiteDetails={setSiteDetails}
//           handleSiteSubmit={handleSiteSubmit} setShowSiteForm={setShowSiteForm} />
//       )}

//       {/* Room Form Modal */}
//       {showRoomForm && (
//         <SiteRoomInfo handleRoomSubmit={handleRoomSubmit} setShowRoomForm={setShowRoomForm}
//           roomDetails={roomDetails} setRoomDetails={setRoomDetails} />
//       )}
//     </div>
//   );
// }

// export default HomeInteriorProject;




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
import { useOutletContext, useParams } from 'react-router-dom';

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
};

function HomeInteriorProject() {
  const { projectId, organizationId } = useParams()
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>()
  
  if (!projectId) return

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

  // Handlers
  const handleSiteSubmit = async () => {
    try {
      if (measurementData) {
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
      toast({ title: "Error", description: error?.response?.data?.message || "Operation failed", variant: "destructive" });
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
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 max-w-full h-full w-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-auto">
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
            <i className="fa-solid fa-receipt mr-2"></i> Site Measurement
          </h2>
          <p className="text-gray-600 hidden sm:block text-sm sm:text-base">Plan your dream home</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2  !w-[100%] sm:!w-[50%] justify-start lg:justify-end">
          <Button
            onClick={handleCompletionStatus}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2  w-full sm:w-auto"
          >
            <i className="fa-solid fa-circle-check mr-2"></i> Mark Complete
          </Button>

          <ResetStageButton
            projectId={projectId!}
            stageNumber={2}
            stagePath="sitemeasurement"
            className="sm:!max-w-[20%] w-full"
          />

          <AssignStageStaff
            stageName="SiteMeasurementModel"
            projectId={projectId}
            organizationId={organizationId!}
            currentAssignedStaff={measurementData?.assignedTo || null}
                className="w-full sm:w-auto"

          />
        </div>
      </div>

      {getAllError && (
        <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
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

      <Card className="p-4 mb-4 shadow border-l-4 border-blue-600 bg-white">
        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
          <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
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

      <div className="mb-6">
        <Card className="p-4 shadow border-l-4 border-blue-500 bg-white">
          <RequirementFileUploader
            formId={measurementData?._id}
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

      {!Object.values(measurementData?.siteDetails || {}).some((ele: any) => ele !== null) && !showSiteForm ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No Site Details Added</p>
          <button
            onClick={() => setShowSiteForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Site Details
          </button>
        </div>
      ) : (
        <CommonSiteInfo
          measurementData={measurementData}
          handleDeleteSiteMeasurement={handleDeleteSiteMeasurement}
          setShowSiteForm={setShowSiteForm}
          setShowRoomForm={setShowRoomForm}
          handleEditRoom={handleEditRoom}
          handleDeleteRoom={handleDeleteRoom}
        />
      )}

      {showSiteForm && (
        <CommonSiteForm
          siteDetails={siteDetails}
          setSiteDetails={setSiteDetails}
          handleSiteSubmit={handleSiteSubmit}
          setShowSiteForm={setShowSiteForm}
        />
      )}

      {showRoomForm && (
        <SiteRoomInfo
          handleRoomSubmit={handleRoomSubmit}
          setShowRoomForm={setShowRoomForm}
          roomDetails={roomDetails}
          setRoomDetails={setRoomDetails}
        />
      )}
    </div>
  );
}

export default HomeInteriorProject;