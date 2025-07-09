import React from 'react'
import type { RoomName, SiteRooms } from '../../../types/types'
import { PREDEFINED_ROOMS } from '../../../constants/constants'
import { Button } from '../../../components/ui/Button'


type CommonSiteInfoProps = {
  roomDetails: SiteRooms,
  setRoomDetails: React.Dispatch<React.SetStateAction<SiteRooms>>,
  handleRoomSubmit: () => Promise<any>,
  setShowRoomForm: React.Dispatch<React.SetStateAction<boolean>>,
  updateRoomLoading:boolean,
  createRoomLoading:boolean,
  editingRoomId:string | null,
}



const SiteRoomInfo: React.FC<CommonSiteInfoProps> = ({ roomDetails,
  setRoomDetails,
  handleRoomSubmit,
  setShowRoomForm , updateRoomLoading, createRoomLoading, editingRoomId}) => {
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-6">{editingRoomId ? "Edit Room" : "Add New Room"}</h2>
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
          {PREDEFINED_ROOMS.map(roomName => {
            return <option value={roomName}>{roomName}</option>
          })}
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
          <Button
            isLoading={editingRoomId ? updateRoomLoading : createRoomLoading}
            onClick={handleRoomSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
           {editingRoomId ? "Edit Room" : "Add Room"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SiteRoomInfo