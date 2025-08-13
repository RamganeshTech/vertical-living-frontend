// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetSinglePredefinedRoom } from '../../../apiList/Stage Api/materialSelectionApi';
// import MaterialRoomUploads from "./MaterialRoomUploads";


// const RoomDetailCardNew: React.FC = () => {
//     const { projectId, roomId } = useParams<{ projectId: string; roomId: string }>();
//     const navigate = useNavigate();

//     const { data: room, isLoading, isError, refetch } = useGetSinglePredefinedRoom({
//         projectId: projectId!,
//         roomId: roomId!,
//     });

//     const handleBack = () => {
//         navigate(-1);
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen text-gray-500">
//                 Loading room data...
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen text-red-600">
//                 Failed to load room details
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//             {/* Top Bar */}
//             <div className="flex items-center mb-6">
//                 <button
//                     onClick={handleBack}
//                     className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition"
//                 >
//                     <i className="fa-solid fa-arrow-left"></i>
//                     <span>Navigate Upstream</span>
//                 </button>
//             </div>

//             {/* Room Title */}
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">{room?.name || "Room"}</h1>

//             {/* Items List */}
//             <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {room?.roomFields?.map((item: any) => (
//                     <article
//                         key={item._id}
//                         className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition"
//                     >
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
//                             <i className="fa-solid fa-box text-gray-500 text-xl"></i>
//                         </div>
//                         <p className="text-gray-600">
//                             <span className="font-semibold">Quantity:</span> {item.quantity}
//                         </p>
//                     </article>
//                 ))}
//             </section>


//             <section className="mt-4">
//                 <MaterialRoomUploads
//                     projectId={projectId!}
//                     roomId={roomId!}
//                     initialFiles={room.uploads}
//                     refetch={refetch}
//                 />
//             </section>

//             {/* No Items Fallback */}
//             {(!room?.roomFields || room.roomFields.length === 0) && (
//                 <div className="text-gray-500 text-center py-4">No items in this room.</div>
//             )}
//         </div>
//     );
// }

// export default RoomDetailCardNew

"use client"

import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGetSinglePredefinedRoom } from "../../../apiList/Stage Api/materialSelectionApi"
import MaterialRoomUploads from "./MaterialRoomUploads"

const RoomDetailCardNew: React.FC = () => {
  const { projectId, roomId } = useParams<{ projectId: string; roomId: string }>()
  const navigate = useNavigate()

  const {
    data: room,
    isLoading,
    isError,
    refetch,
  } = useGetSinglePredefinedRoom({
    projectId: projectId!,
    roomId: roomId!,
  })

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="max-h-screen overflow-y-auto flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-h-screen overflow-y-auto flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <i className="fa-solid fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load</h2>
          <p className="text-slate-600 mb-4">Unable to retrieve room details</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-refresh mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    )
  }

  const roomItems = room?.roomFields ? Object.values(room.roomFields) : []
console.log("room", room)
  return (
    <div className="max-h-screen overflow-y-auto bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
           
            <div className="flex items-center gap-2 text-blue-500">
              <i className="fa-solid fa-door-open"></i>
              <span className="font-semibold text-blue-600 text-xl sm:text-2xl">{room?.name || "Room Details"}</span>
            </div>


             <button
              onClick={handleBack}
              className="flex bg-slate-200 rounded-2xl px-2 py-1 cursor-pointer items-center gap-2 text-slate-700 hover:text-slate-600 transition-colors"
              
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span className="font-medium">Return to Overview</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4">
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-blue-600"></i>
              Room Items & Specifications
            </h2>
          </div>

          {roomItems.length > 0 ? (
            <div className="divide-y divide-slate-200">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-sm font-medium text-slate-600">
                <div className="col-span-1">#</div>
                <div className="col-span-1">
                  <i className="fa-solid fa-box"></i>
                </div>
                <div className="col-span-7 sm:col-span-8">Item Name</div>
                <div className="col-span-3 sm:col-span-2 text-center">Quantity</div>
              </div>

              {roomItems.map((item: any, index: number) => (
                <div
                  key={item._id || index}
                  className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-1 flex items-center">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <i className="fa-solid fa-cube text-blue-600 text-sm"></i>
                    </div>
                  </div>
                  <div className="col-span-7 sm:col-span-8 flex items-center">
                    <span className="font-medium text-slate-800">{item.itemName}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                    <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-inbox text-slate-400"></i>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">No Items Found</h3>
              <p className="text-slate-500 text-sm">This room doesn't have any items configured yet.</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-paperclip text-purple-600"></i>
              Attachments & Documents
            </h2>
          </div>
          <div className="p-4">
            <MaterialRoomUploads
              projectId={projectId!}
              roomId={roomId!}
              initialFiles={room?.uploads || []}
              refetch={refetch}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default RoomDetailCardNew
