
import React, { memo } from 'react'
import type { SiteRooms } from '../../../types/types'
import RoomCard from './RoomCard'
import { useAuthCheck } from '../../../Hooks/useAuthCheck'
import { Button } from '../../../components/ui/Button'

type CommonSiteInfoProps = {
  measurementData: any
  // handleSiteSubmit: ()=> Promise<any>,
  setShowRoomForm: React.Dispatch<React.SetStateAction<boolean>>,
  handleEditRoom: (room: SiteRooms) => void
  handleDeleteRoom: (roomId: string) => Promise<any>
  setShowSiteForm: React.Dispatch<React.SetStateAction<boolean>>,
  handleDeleteSiteMeasurement: () => Promise<any>,
  deleteRoomLoading: boolean
}

const CommonSiteInfo: React.FC<CommonSiteInfoProps> = ({ measurementData, handleDeleteSiteMeasurement, deleteRoomLoading, setShowSiteForm, setShowRoomForm, handleEditRoom, handleDeleteRoom }) => {

  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.sitemeasurement?.delete;
  // const canList = role === "owner" || permission?.sitemeasurement?.list;
  const canCreate = role === "owner" || permission?.sitemeasurement?.create;
  const canEdit = role === "owner" || permission?.sitemeasurement?.edit;

  return (
    <>
      <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium p-6 mb-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-ash-light">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center">
                 <i className="fa-solid fa-map-location-dot text-text-muted"></i>
             </div>
             <div>
                <h2 className="text-base font-bold text-text-main">Site Measurements</h2>
                <p className="text-xs text-text-muted">Plot layout and property specifications</p>
             </div>
          </div>
          
          <div className="flex gap-2">
            {(canEdit) && (
              <Button
                variant="white"
                onClick={() => setShowSiteForm(true)}
                // className="text-gray-500 hover:text-gray-800 hover:bg-gray-50 h-9 px-3"
                className="border-ash-medium text-text-main shadow-sm flex-1 sm:flex-none"
              >
                <i className="fa-regular fa-pen-to-square mr-2"></i> Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                onClick={() => handleDeleteSiteMeasurement()}
                // className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-9 px-3"
                className="text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 shadow-sm flex-1 sm:flex-none transition-all"
              >
                <i className="fa-regular fa-trash-can mr-2"></i> Delete
              </Button>
            )}
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg"> */}
          <div className="p-4 bg-brand-ash border border-ash-light rounded-xl">
            {/* <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Plot Area</span> */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Total Plot Area</span>
            <p className="text-sm font-semibold text-text-main">
              {measurementData.siteDetails.totalPlotAreaSqFt !== null ? `${measurementData.siteDetails.totalPlotAreaSqFt} sq.ft` : "Not mentioned"}
            </p>
          </div>

          {/* <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg"> */}
          <div className="p-4 bg-brand-ash border border-ash-light rounded-xl">

            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Built-up Area</span>
            <p className="text-sm font-semibold text-text-main">
              {measurementData.siteDetails.builtUpAreaSqFt != null ? `${measurementData.siteDetails.builtUpAreaSqFt} sq.ft` : "Not mentioned"}
            </p>
          </div>

          <div className="p-4 bg-brand-ash border border-ash-light rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Road Facing</span>
            <p className="text-sm font-semibold text-text-main">
              {measurementData.siteDetails.roadFacing === true ? "YES" : measurementData.siteDetails.roadFacing === false ? "NO" : "Not mentioned"}
            </p>
          </div>

          <div className="p-4 bg-brand-ash border border-ash-light rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Number of Floors</span>
            <p className="text-sm font-semibold text-text-main">
              {measurementData.siteDetails.numberOfFloors != null ? measurementData.siteDetails.numberOfFloors : "Not mentioned"}
            </p>
          </div>

          <div className="p-4 bg-brand-ash border border-ash-light rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Is having Slope</span>
            <p className="text-sm font-semibold text-text-main">
              {measurementData.siteDetails.hasSlope === true ? "YES" : measurementData.siteDetails.hasSlope === false ? "NO" : "Not mentioned"}
            </p>
          </div>

          <div className="p-4 bg-brand-ash border border-ash-light rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Is Boundary Wall exists</span>
            <p className="text-sm font-semibold text-text-main">
              {measurementData.siteDetails.boundaryWallExists === true ? "YES" : measurementData.siteDetails.boundaryWallExists === false ? "NO" : "Not mentioned"}
            </p>
          </div>

          <div className="p-4 bg-brand-ash border border-ash-light rounded-lg lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Additional Notes</span>
            <p className="text-sm font-medium text-gray-700">
              {measurementData.siteDetails.additionalNotes ? measurementData.siteDetails.additionalNotes : "Not mentioned"}
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      {measurementData.siteDetails.totalPlotAreaSqFt !== null && (
        // <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-ash-light">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center shrink-0 shadow-sm">
                    <i className="fa-solid fa-layer-group text-text-muted text-lg"></i>
                </div>
               <div>
                   <h2 className="text-base font-bold text-text-main leading-tight">Rooms List</h2>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">Manage individual spaces within the site</p>
                </div>
             </div>

            {(canCreate || canEdit) && (
              <Button
                variant="dark"
                onClick={() => setShowRoomForm(true)}
                // className="h-9 px-4"
                className="shadow-sm px-6 w-full sm:w-auto"
              >
                <i className="fa-solid fa-plus mr-2 text-gray-300"></i> Add Room
              </Button>
            )}
          </div>
          
          {/* Rooms list will go here */}
          {measurementData.rooms.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-ash-medium rounded-xl bg-brand-ash/50">
              <div className="w-14 h-14 bg-brand-surface border border-ash-light shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-door-open text-2xl text-ash-dark"></i>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-1">No rooms added yet</h3>
              <p className="text-sm text-text-muted">Click the 'Add Room' button to start building your layout.</p></div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5">
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
          )}
        </div>
      )}
    </>
  )
}

export default memo(CommonSiteInfo)



