// import React from 'react'
// import type { RoomName, SiteRooms } from '../../../types/types'
// import { PREDEFINED_ROOMS } from '../../../constants/constants'
// import { Button } from '../../../components/ui/Button'


// type CommonSiteInfoProps = {
//   roomDetails: SiteRooms,
//   setRoomDetails: React.Dispatch<React.SetStateAction<SiteRooms>>,
//   handleRoomSubmit: () => Promise<any>,
//   setShowRoomForm: React.Dispatch<React.SetStateAction<boolean>>,
//   updateRoomLoading:boolean,
//   createRoomLoading:boolean,
//   editingRoomId:string | null,
// }



// const SiteRoomInfo: React.FC<CommonSiteInfoProps> = ({ roomDetails,
//   setRoomDetails,
//   handleRoomSubmit,
//   setShowRoomForm , updateRoomLoading, createRoomLoading, editingRoomId}) => {
//   return (
//     <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md p-6">
//         <h2 className="text-2xl font-semibold mb-6">{editingRoomId ? "Edit Room" : "Add New Room"}</h2>
//         {/* <input
//               type="text"
//               placeholder="Room Name"
//               value={roomDetails.name || ""}
//               onChange={(e) => setRoomDetails({ ...roomDetails, name: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
//             /> */}

//         <select
//           value={roomDetails.name || ''}
//           onChange={(e) => setRoomDetails(prev => ({ ...prev, name: e.target.value as RoomName }))}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
//         >
//           <option value="">Select Room Type</option>
//           {PREDEFINED_ROOMS.map(roomName => {
//             return <option value={roomName}>{roomName}</option>
//           })}
//         </select>

//         <div className="grid grid-cols-3 gap-4 mb-4">
//           <div>
//             <label htmlFor="">Length (ft)</label>
//             <input
//               type="number"
//               placeholder="Length (ft)"
//               value={roomDetails.length || 0}
//               onChange={(e) => setRoomDetails({ ...roomDetails, length: Number(e.target.value) })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label htmlFor="">Breadth (ft)</label>
//             <input
//               type="number"
//               placeholder="Breadth (ft)"
//               value={roomDetails.breadth || 0}
//               onChange={(e) => setRoomDetails({ ...roomDetails, breadth: Number(e.target.value) })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label htmlFor="">Height (ft)</label>
//             <input
//               type="number"
//               placeholder="Height (ft)"
//               value={roomDetails.height || 0}
//               onChange={(e) => setRoomDetails({ ...roomDetails, height: Number(e.target.value) })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>
//         {roomDetails.length && roomDetails.breadth && (
//           <div className="bg-blue-50 p-4 rounded-lg mb-4">
//             <p className="text-blue-700 font-medium">
//               Calculated Area: {(Number(roomDetails.length) * Number(roomDetails.breadth)).toFixed(2)} sq.ft
//             </p>
//           </div>
//         )}
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => setShowRoomForm(false)}
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <Button
//             isLoading={editingRoomId ? updateRoomLoading : createRoomLoading}
//             onClick={handleRoomSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//            {editingRoomId ? "Edit Room" : "Add Room"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SiteRoomInfo




import React from 'react'
import type { RoomName, SiteRooms } from '../../../types/types'
import { PREDEFINED_ROOMS } from '../../../constants/constants'
import { Button } from '../../../components/ui/Button'

type CommonSiteInfoProps = {
  roomDetails: SiteRooms,
  setRoomDetails: React.Dispatch<React.SetStateAction<SiteRooms>>,
  handleRoomSubmit: () => Promise<any>,
  setShowRoomForm: React.Dispatch<React.SetStateAction<boolean>>,
  updateRoomLoading: boolean,
  createRoomLoading: boolean,
  editingRoomId: string | null,
}

const SiteRoomInfo: React.FC<CommonSiteInfoProps> = ({ 
  roomDetails,
  setRoomDetails,
  handleRoomSubmit,
  setShowRoomForm, 
  updateRoomLoading, 
  createRoomLoading, 
  editingRoomId
}) => {
  return (
    <div className="fixed inset-0 bg-brand-main/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-brand-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-ash-medium">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-ash-medium flex justify-between items-center bg-brand-ash">
          <h2 className="text-lg font-bold text-text-main">
            {editingRoomId ? "Edit Room" : "Add New Room"}
          </h2>
          <button 
            onClick={() => setShowRoomForm(false)}
            className="bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-1.5">Room Type</label>
            <select
              value={roomDetails.name || ''}
              onChange={(e) => setRoomDetails(prev => ({ ...prev, name: e.target.value as RoomName }))}
              className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-medium focus:outline-none  transition-all text-text-main text-sm outline-none cursor-pointer"
            >
              <option value="">Select Room Type</option>
              {PREDEFINED_ROOMS.map(roomName => {
                return <option key={roomName} value={roomName}>{roomName}</option>
              })}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              {/* <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5 text-center">Length (ft)</label> */}
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1.5 text-center">Length (ft)</label>
              <input
                type="number"
                placeholder="0"
                value={roomDetails.length || ""}
                onChange={(e) => setRoomDetails({ ...roomDetails, length: Number(e.target.value) })}
                // className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none text-center"
                className="w-full p-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-medium focus:outline-none transition-all text-text-main font-mono font-bold text-sm text-center shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5 text-center">Breadth (ft)</label>
              <input
                type="number"
                placeholder="0"
                value={roomDetails.breadth || ""}
                onChange={(e) => setRoomDetails({ ...roomDetails, breadth: Number(e.target.value) })}
                // className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none text-center"
                className="w-full p-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-medium focus:outline-none transition-all text-text-main font-mono font-bold text-sm text-center shadow-sm"

              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5 text-center">Height (ft)</label>
              <input
                type="number"
                placeholder="0"
                value={roomDetails.height || ""}
                onChange={(e) => setRoomDetails({ ...roomDetails, height: Number(e.target.value) })}
                // className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none text-center"
                className="w-full p-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-medium focus:outline-none transition-all text-text-main font-mono font-bold text-sm text-center shadow-sm"

              />
            </div>
          </div>

          {roomDetails.length && roomDetails.breadth ? (
            <div className="bg-brand-ash border border-ash-medium p-3 rounded-lg mb-2 shadow-sm flex justify-between items-center px-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-chart-area"></i> Calculated Area
              </span>
              <span className="text-lg font-black text-text-main">
                {(Number(roomDetails.length) * Number(roomDetails.breadth)).toFixed(2)} <span className="text-xs font-bold text-text-muted">sq.ft</span>
              </span>
              </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-ash border-t border-ash-medium flex justify-end gap-3">
          <Button
            variant='white'
            onClick={() => setShowRoomForm(false)}
            // className="px-5 border border-gray-200 bg-white shadow-sm"
            className="px-6 border-ash-medium text-text-main shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant='dark'
            isLoading={editingRoomId ? updateRoomLoading : createRoomLoading}
            onClick={handleRoomSubmit}
            className="px-6"
          >
            {editingRoomId ? "Save Changes" : "Add Room"}
          </Button>
        </div>

      </div>
    </div>
  )
}

export default SiteRoomInfo