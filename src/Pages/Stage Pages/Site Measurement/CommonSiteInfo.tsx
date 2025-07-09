import React, { memo } from 'react'
import type { SiteRooms } from '../../../types/types'
import RoomCard from './RoomCard'

type CommonSiteInfoProps = {
   measurementData: any
    // handleSiteSubmit: ()=> Promise<any>,
    setShowRoomForm:React.Dispatch<React.SetStateAction<boolean>>,
    handleEditRoom: (room: SiteRooms)=> void
    handleDeleteRoom:(roomId: string)=> Promise<any>
    setShowSiteForm:React.Dispatch<React.SetStateAction<boolean>>,
    handleDeleteSiteMeasurement:()=> Promise<any>,
    deleteRoomLoading:boolean
}

const CommonSiteInfo:React.FC<CommonSiteInfoProps> = ({measurementData,handleDeleteSiteMeasurement, deleteRoomLoading, setShowSiteForm,setShowRoomForm, handleEditRoom , handleDeleteRoom}) => {
  return (
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
                    deleteRoomLoading={deleteRoomLoading}
                  />
                ))}
              </div>
            }

          </div>}
        </>
  )
}

export default memo(CommonSiteInfo)