// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Input } from "../../../components/ui/Input";
// import { Label } from "../../../components/ui/Label";
// import { Separator } from "../../../components/ui/Seperator";
// import {
//     useGetSiteMeasurementDetails,
//     useUpdateCommonSiteMeasurementDetails,
//     useUdpateSiteMeasurmentRoomDetails,
//     useDeleteRoomFromMeauserementStage,
//     useUpdateSiteMeasurementCompletionStatus,
//     useUploadRequirementFiles,
//     useCreateMeasurement
// } from './../../../apiList/Stage Api/siteMeasurementApi';
// import type { SiteDetails, SiteRooms } from "../../../types/types";
// import CreateMeasurementPopup from "./CreateRoomMeasurementForm";
// import { Button } from './../../../components/ui/Button';

// const roomOptions = ["LivingHall", "Bedroom", "Kitchen", "wardrobe"];

// const SiteMeasurement = () => {
//     const { projectId } = useParams<{ projectId: string }>();
//     const [showPopup, setShowPopup] = useState(false);

//     const { data, isLoading, error } = useGetSiteMeasurementDetails({ projectId: projectId! });

//     const handleEdit = (roomIndex: number) => {
//         alert(`Edit room #${roomIndex + 1} not implemented yet.`);
//     };

//     const handleDelete = (roomIndex: number) => {
//         alert(`Delete room #${roomIndex + 1} not implemented yet.`);
//     };

//     return (
//         <div className="p-6 space-y-6">
//             <div className="flex justify-between items-center w-full">
//                 <h2 className="text-2xl font-semibold">Site Measurement</h2>
//                 <Button
//                     onClick={() => setShowPopup(true)}
//                     variant="primary"
//                     className="w-15 h-15 !rounded-full"
//                 >
//                     <i className="fa-solid fa-plus text-xl"></i>
//                 </Button>

//             </div>


//             {error && <p className="text-red-500">Error: {error.message}</p>}

//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : !data ? (
//                 <div className="text-center border rounded-md p-10 bg-white shadow-sm">
//                     <i className="fas fa-ruler-combined text-4xl text-blue-500 mb-4"></i>
//                     <p className="text-lg font-medium">No Measurement Data Found</p>
//                     <p className="text-sm text-muted-foreground mb-4">
//                         Create your measurement document to start collecting site data.
//                     </p>
//                     <Button onClick={() => setShowPopup(true)}>+ Create Measurement</Button>
//                 </div>
//             ) : (
//                 // <>
//                 //     <div className="bg-white p-6 rounded shadow-sm">
//                 //         <h3 className="text-lg font-semibold text-blue-600 mb-2">Site Details</h3>
//                 //         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 //             {Object.entries(data.siteDetails).map(([key, val]) => (
//                 //                 <li key={key}>
//                 //                     <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {val?.toString() ?? "N/A"}
//                 //                 </li>
//                 //             ))}
//                 //         </ul>
//                 //     </div>

//                 //     <h3 className="text-lg font-semibold mt-6 mb-2">Rooms</h3>
//                 //     {data.rooms?.length === 0 ? (
//                 //         <div className="text-center text-gray-500 italic">
//                 //             <i className="fas fa-door-open text-xl mr-1"></i>
//                 //             No rooms measured yet.
//                 //         </div>
//                 //     ) : (
//                 //         <ul className="space-y-2">
//                 //             {data.rooms.map((room: SiteRooms, idx: number) => (
//                 //                 <li key={idx} className="border-l-6 shadow-md w-[20%]] border-blue-600  p-4 rounded-lg">
//                 //                     <p><strong>Name:</strong> {room.name}</p>
//                 //                     <p><strong>Length:</strong> {room.length} ft</p>
//                 //                     <p><strong>Breadth:</strong> {room.breadth} ft</p>
//                 //                     <p><strong>Height:</strong> {room.height} ft</p>
//                 //                 </li>
//                 //             ))}
//                 //         </ul>
//                 //     )}
//                 // </>
//                 <>
//                     <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm space-y-6">
//                         <h3 className="text-lg font-semibold text-blue-800 underline">Site Details</h3>
//                         <div className="grid grid-cols-2 gap-4 text-blue-900">
//                             <div><strong>Total Plot Area Sq Ft:</strong> {data.siteDetails.totalPlotAreaSqFt ?? "N/A"}</div>
//                             <div><strong>Built Up Area Sq Ft:</strong> {data.siteDetails.builtUpAreaSqFt ?? "N/A"}</div>
//                             <div><strong>Road Facing:</strong> {String(data.siteDetails.roadFacing)}</div>
//                             <div><strong>Number Of Floors:</strong> {data.siteDetails.numberOfFloors ?? "N/A"}</div>
//                             <div><strong>Has Slope:</strong> {String(data.siteDetails.hasSlope)}</div>
//                             <div><strong>Boundary Wall Exists:</strong> {String(data.siteDetails.boundaryWallExists)}</div>
//                             <div className="col-span-2"><strong>Additional Notes:</strong> {data.siteDetails.additionalNotes || "N/A"}</div>
//                         </div>

//                         <h3 className="text-lg font-semibold text-blue-800 underline">Rooms</h3>
//                         {data.rooms.length === 0 ? (
//                             <div className="text-center text-blue-600">
//                                 <i className="fas fa-door-closed text-3xl mb-2 block" />
//                                 <p className="font-medium">No rooms measured yet.</p>
//                                 <button
//                                     onClick={() => setShowPopup(true)}
//                                     className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
//                                 >
//                                     Create Room
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="grid md:grid-cols-2 gap-4">
//                                 {data.rooms.map((room: any, index: any) => (
//                                     <div key={index} className="bg-white border border-blue-300 p-4 rounded-lg shadow-md">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <h4 className="text-blue-700 font-bold">{room.name}</h4>
//                                             <div className="space-x-2">
//                                                 <button onClick={() => handleEdit(index)} className="text-blue-600 hover:text-blue-800">
//                                                     <i className="fas fa-edit" />
//                                                 </button>
//                                                 <button onClick={() => handleDelete(index)} className="text-red-600 hover:text-red-800">
//                                                     <i className="fas fa-trash" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             {<p><strong>Length:</strong> {room.length} ft</p>}
//                                         </div>
//                                         <div>
//                                             <p><strong>Breadth:</strong> {room.breadth} ft</p>
//                                         </div>
//                                         <div>
//                                             <p><strong>Height:</strong> {room.height} ft</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </>
//             )}

//             <CreateMeasurementPopup
//                 projectId={projectId!}
//                 open={showPopup}
//                 onClose={() => setShowPopup(false)}
//             />
//         </div>
//     );
// };

// export default SiteMeasurement;




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
  useCompletionStatusSiteMeasurement
} from './../../../apiList/Stage Api/siteMeasurementApi';
import { useParams } from 'react-router-dom';

import type { RoomName, SiteDetails, SiteRooms } from "../../../types/types";
import { toast } from '../../../utils/toast';
import RoomCard from './RoomCard';
import { Card } from '../../../components/ui/Card';
import StageTimerInfo from '../../../shared/StagetimerInfo';
import RequirementFileUploader from '../../../shared/StageFileUploader';
import { Button } from '../../../components/ui/Button';

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
  const { projectId } = useParams()
  if (!projectId) return

  const [showSiteForm, setShowSiteForm] = useState<boolean>(false);
  const [showRoomForm, setShowRoomForm] = useState<boolean>(false);
  const [siteDetails, setSiteDetails] = useState<SiteDetails>(initialSiteDetails);
  const [roomDetails, setRoomDetails] = useState<SiteRooms>(initialRoomDetails);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const { data: measurementData, isLoading, refetch } = useGetSiteMeasurementDetails({ projectId: projectId! });
  const createMeasurement = useCreateMeasurement();
  const createRoom = useCreateRoomSiteMeasurement();
  const updateSiteDetails = useUpdateCommonSiteMeasurementDetails();
  const updateRoomDetails = useUdpateSiteMeasurmentRoomDetails();
  const deleteRoom = useDeleteRoomFromMeauserementStage();
  const deleteSiteMeasurement = useDeleteSiteMeasurementAndResetTimer();
  const updateCompletionStatus = useCompletionStatusSiteMeasurement();

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSiteMeasurement()
  const { mutateAsync: uploadFilesMutate, isPending: uploadPending } = useUploadRequirementFiles()


  // const {mutateAsync:uploadFiles} = useUploadRequirementFiles()

  // Handlers

  const handleSiteSubmit = async () => {
    try {
      if (measurementData) {
        await updateSiteDetails.mutateAsync({ projectId, payload: siteDetails });
        toast({ description: 'Site details updated successfully', title: "Success" });

      } else {
        await createMeasurement.mutateAsync({ projectId, siteDetails });
        toast({ description: 'Site details updated successfully', title: "Success" });

      }
      setShowSiteForm(false);
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to save site details", variant: "destructive" })
    }
  };

  const handleRoomSubmit = async () => {
    try {
      const calculatedArea = roomDetails.length && roomDetails.breadth
        ? (Number(roomDetails.length) * Number(roomDetails.breadth)).toFixed(2)
        : null;

      const roomData = {
        ...roomDetails,
        area: calculatedArea
      };

      if (editingRoomId) {
        await updateRoomDetails.mutateAsync({
          projectId,
          roomId: editingRoomId,
          room: roomData
        });
        toast({ description: 'Room updated successfully', title: "Success" });

      } else {
        console.log("roomdata", roomData)
        await createRoom.mutateAsync({ projectId, room: roomData });
        toast({ description: 'Room added successfully', title: "Success" });
      }
      setShowRoomForm(false);
      setEditingRoomId(null);
      setRoomDetails(initialRoomDetails);
    } catch (error: any) {
      console.log(error.message)
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "operation failed please try again", variant: "destructive" })


    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom.mutateAsync({ projectId, roomId });
      toast({ description: 'Site measurement deleted successfully', title: "Success" });

    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete room", variant: "destructive" })

    }
  };

  const handleDeleteSiteMeasurement = async () => {
    try {
      await deleteSiteMeasurement.mutateAsync({ projectId });
      toast({ description: 'Site measurement deleted successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete site measurement", variant: "destructive" })

    }
  };

  const handleCompletionStatus = async () => {
    try {
      await updateCompletionStatus.mutateAsync({ projectId });
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

    }
  };


  const handleEditRoom = (room: SiteRooms) => {
    setRoomDetails(room);
    setEditingRoomId((room as any)._id);
    setShowRoomForm(true);
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-full h-full overflow-y-scroll">
      <div className='flex justify-between'>
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Home Interior Project</h1>
          <p className="text-gray-600 mb-8">Plan your dream home by adding site measurements and room details</p>
        </div>

        <Button onClick={handleCompletionStatus} className="bg-green-600 mt-2 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
          <i className="fa-solid fa-circle-check mr-2"></i>
          Mark as Complete
        </Button>
      </div>

      <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
          <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
          <span>Stage Timings</span>
        </div>
        {/* Keep content within this component, it will now handle horizontal layout */}
        <StageTimerInfo
          completedAt={measurementData.timer.compltedAt}
          formId={(measurementData as any)._id}
          deadLine={measurementData.timer.deadLine}
          startedAt={measurementData.timer.startedAt}
          refetchStageMutate={refetch}
          deadLineMutate={deadLineAsync}
          isPending={deadLinePending}
        />
      </Card>



      <div className="">
        <Card className="p-4 shadow border-l-4 border-blue-500 bg-white">
          <RequirementFileUploader
            formId={measurementData._id}
            existingUploads={measurementData.uploads}
            onUploadComplete={refetch}
            uploadFilesMutate={uploadFilesMutate}
            uploadPending={uploadPending}
          />
        </Card>
      </div>

      {!Object.values(measurementData.siteDetails).some((ele: any) => ele !== null) && !showSiteForm ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No Site Details Added</p>
          <button
            onClick={() => setShowSiteForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Site Details
          </button>
        </div>
      )
        :
        <>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Site Measurements</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSiteForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDeleteSiteMeasurement()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Plot Area</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.totalPlotAreaSqFt !== null ? `${measurementData.siteDetails.totalPlotAreaSqFt} sq.ft` : "Not mentioned"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Built-up Area</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.builtUpAreaSqFt != null ? `${measurementData.siteDetails.builtUpAreaSqFt} sq.ft` : "Not mentioned"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Road Facing</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.roadFacing === true ? "YES" : measurementData.siteDetails.roadFacing === false ? "NO" : "Not mentioned"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Number of Floors</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.numberOfFloors != null ? measurementData.siteDetails.numberOfFloors : "Not mentioned"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Is having Slope</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.hasSlope === true ? "YES" : measurementData.siteDetails.hasSlope === false ? "NO" : "Not mentioned"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Is Boundary Wall exists</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.boundaryWallExists === true ? "YES" : measurementData.siteDetails.boundaryWallExists === false ? "NO" : "Not mentioned"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Additional Notes</span>
                <p className="text-lg font-semibold text-blue-700">
                  {measurementData.siteDetails.additionalNotes ? measurementData.siteDetails.additionalNotes : "Not mentioned"}
                </p>
              </div>

            </div>
          </div>

          {measurementData.siteDetails.totalPlotAreaSqFt !== null && <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Rooms</h2>
              <button
                onClick={() => setShowRoomForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Room
              </button>
            </div>
            {/* Rooms list will go here */}
            {measurementData.rooms.length === 0 ?
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500">No rooms added yet</p>
              </div>
              :
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {measurementData.rooms.map((room: SiteRooms, index: number) => (
                  <RoomCard
                    key={index}
                    room={room}
                    onEdit={() => handleEditRoom(room)}
                    onDelete={() => handleDeleteRoom((room as any)._id)}
                  />
                ))}
              </div>
            }

          </div>}
        </>



      }

      {showSiteForm && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Site Measurements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="">Total Plot Area (sq.ft)</label>
                <input
                  type="number"
                  placeholder="Total Plot Area (sq.ft)"
                  value={siteDetails.totalPlotAreaSqFt || 0}
                  onChange={(e) => setSiteDetails({ ...siteDetails, totalPlotAreaSqFt: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="">Built-up Area (sq.ft)</label>
                <input
                  type="number"
                  placeholder="Built-up Area (sq.ft)"
                  value={siteDetails.builtUpAreaSqFt || 0}
                  onChange={(e) => setSiteDetails({ ...siteDetails, builtUpAreaSqFt: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="">Number of Floors</label>
                <input
                  type="number"
                  placeholder="Number of Floors"
                  value={siteDetails.numberOfFloors || 0}
                  onChange={(e) => setSiteDetails({ ...siteDetails, numberOfFloors: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={siteDetails.hasSlope ?? false}
                  onChange={(e) => setSiteDetails({ ...siteDetails, hasSlope: e.target.checked })}
                  className="mr-2"
                />
                Has Slope
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={siteDetails.roadFacing ?? false}
                  onChange={(e) => setSiteDetails({ ...siteDetails, roadFacing: e.target.checked })}
                  className="mr-2"
                />
                Road Facing
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={siteDetails.boundaryWallExists ?? false}
                  onChange={(e) => setSiteDetails({ ...siteDetails, boundaryWallExists: e.target.checked })}
                  className="mr-2"
                />
                Boundary Wall Exists
              </label>
            </div>
            <textarea
              placeholder="Additional Notes"
              value={siteDetails.additionalNotes || ""}
              onChange={(e) => setSiteDetails({ ...siteDetails, additionalNotes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSiteForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSiteSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}






      {/* Room Form Modal */}
      {showRoomForm && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Add New Room</h2>
            {/* <input
              type="text"
              placeholder="Room Name"
              value={roomDetails.name || ""}
              onChange={(e) => setRoomDetails({ ...roomDetails, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            /> */}

            <select
              value={roomDetails.name || ''}
              onChange={(e) => setRoomDetails(prev => ({ ...prev, name: e.target.value as RoomName }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            >
              <option value="">Select Room Type</option>
              <option value="LivingHall">Living Hall</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Wardrobe">Wardrobe</option>
            </select>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="">Length (ft)</label>
                <input
                  type="number"
                  placeholder="Length (ft)"
                  value={roomDetails.length || 0}
                  onChange={(e) => setRoomDetails({ ...roomDetails, length: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="">Breadth (ft)</label>
                <input
                  type="number"
                  placeholder="Breadth (ft)"
                  value={roomDetails.breadth || 0}
                  onChange={(e) => setRoomDetails({ ...roomDetails, breadth: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="">Height (ft)</label>
                <input
                  type="number"
                  placeholder="Height (ft)"
                  value={roomDetails.height || 0}
                  onChange={(e) => setRoomDetails({ ...roomDetails, height: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {roomDetails.length && roomDetails.breadth && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-700 font-medium">
                  Calculated Area: {(Number(roomDetails.length) * Number(roomDetails.breadth)).toFixed(2)} sq.ft
                </p>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRoomForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRoomSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomeInteriorProject;
