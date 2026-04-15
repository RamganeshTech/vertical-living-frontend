// import { useState } from "react";
// import { Button } from "../../../components/ui/Button";
// import type { SiteRooms } from "../../../types/types";
// import { useUploadRoomSiteFiles } from "../../../apiList/Stage Api/siteMeasurementApi";
// import { toast } from "../../../utils/toast";
// import { useParams } from "react-router-dom";
// import { Input } from "../../../components/ui/Input";

// import RoomImage from "./RoomImage";
// import { NO_IMAGE } from "../../../constants/constants";
// import { useAuthCheck } from "../../../Hooks/useAuthCheck";

// interface RoomCardProps {
//   room: SiteRooms;
//   onEdit: (room: SiteRooms) => void;
//   onDelete: () => void;
//   deleteRoomLoading: boolean
// }

// const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete, deleteRoomLoading }) => {

//   const { projectId } = useParams()
//   const [previewImage, setPreviewImage] = useState<string | null>(null)


//   const { role, permission } = useAuthCheck();
//   const canDelete = role === "owner" || permission?.sitemeasurement?.delete;
//   // const canList = role === "owner" || permission?.sitemeasurement?.list;
//   const canCreate = role === "owner" || permission?.sitemeasurement?.create;
//   const canEdit = role === "owner" || permission?.sitemeasurement?.edit;


//   const uploads = room?.uploads || []
//   const area = room.length && room.breadth ? (room.length * room.breadth).toFixed(2) : null;


//   // console.log("uploads", room.uploads)
//   const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadRoomSiteFiles()


//   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     try {
//       const files = event.target.files
//       if (!files || files.length === 0) return

//       // Filter only image files
//       const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

//       if (imageFiles.length === 0) {
//         toast({
//           title: "Error",
//           description: "Please select only image files",
//           variant: "destructive",
//         })
//         return
//       }

//       if (imageFiles.length !== files.length) {
//         toast({
//           title: "Warning",
//           description: "Only image files were uploaded. PDFs were skipped.",
//           variant: "destructive",
//         })
//       }

//       const formData = new FormData()
//       imageFiles.forEach((file) => formData.append("file", file))

//       await uploadFiles({
//         roomId: (room as any)._id,
//         files: formData,
//         projectId: projectId!,
//       })

//       toast({
//         title: "Success",
//         description: "Images uploaded successfully",
//       })

//       // Clear the input
//       event.target.value = ""
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Failed to upload",
//         variant: "destructive",
//       })
//     }
//   }





//   return (
//     <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 mb-4">
//       <div className="flex justify-between items-start mb-4">
//         <h3 className="text-xl font-semibold text-blue-700">{room.name}</h3>
//         <div className="flex gap-2">
//           {canEdit && <button
//             onClick={() => onEdit(room)}
//             className="text-blue-600 hover:text-blue-800"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//           </button>}
//           {canDelete && <Button
//             isLoading={deleteRoomLoading}
//             onClick={onDelete}
//             variant="ghost"
//             className="!text-red-600 hover:text-red-800 bg-white shadow-none hover:!bg-none"
//           >
//             {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg> */}
//             <i className="fas fa-trash-can"></i>
//           </Button>}
//         </div>
//       </div>






//       {/* File Upload Section */}
//       <div className="space-y-4 w-full">
//         {/* Upload Button */}
//         {(canCreate || canEdit) && <div className="flex items-center justify-between w-full relative">
//           <Input
//             type="file"
//             multiple
//             accept="image/*"
//             placeholder="Select images"
//             onChange={handleUpload}
//             disabled={isUploading}
//             className={isUploading ? "pr-10 opacity-70 cursor-not-allowed w-full" : ""}
//           />
//           {isUploading && (
//             <div className="absolute inset-y-0 right-2 flex items-center">
//               <svg
//                 className="animate-spin h-5 w-5 text-gray-500"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
//                 />
//               </svg>
//             </div>
//           )}
//         </div>}

//         {/* Images Display */}
//         <div className="my-6">
//           <h4 className="text-lg font-semibold mb-4 text-gray-800">Room Images</h4>
//           {uploads.length === 0 ? (
//             <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
//               No images uploaded yet.
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
//               {uploads.map((file) => (
//                 <RoomImage room={room} setPreviewImage={setPreviewImage} file={file} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <div className="text-center p-3 bg-gray-50 rounded-lg">
//           <p className="text-sm text-gray-600">Length</p>
//           <p className="font-semibold text-gray-800">{room.length || 0} ft</p>
//         </div>
//         <div className="text-center p-3 bg-gray-50 rounded-lg">
//           <p className="text-sm text-gray-600">Breadth</p>
//           <p className="font-semibold text-gray-800">{room.breadth || 0} ft</p>
//         </div>
//         <div className="text-center p-3 bg-gray-50 rounded-lg">
//           <p className="text-sm text-gray-600">Height</p>
//           <p className="font-semibold text-gray-800">{room.height || 0} ft</p>
//         </div>
//       </div>

//       {area && (
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <p className="text-blue-700 font-medium text-center">
//             Total Area: {area} sq.ft
//           </p>
//         </div>
//       )}





//       {/* Image Preview Modal */}
//       {previewImage && (
//         <div
//           onClick={() => setPreviewImage(null)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="relative bg-white rounded-xl shadow-2xl max-w-[90%] max-h-[90%] p-2 overflow-hidden"
//           >
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute top-4 right-4 z-10 w-8 h-8 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
//             >
//               <i className="fas fa-times text-sm" />
//             </button>
//             <img
//               src={previewImage || NO_IMAGE}
//               alt="Preview"
//               className="w-full max-h-[80vh] object-contain mx-auto rounded-lg"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default RoomCard


import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import type { SiteRooms } from "../../../types/types";
import { useUploadRoomSiteFiles } from "../../../apiList/Stage Api/siteMeasurementApi";
import { toast } from "../../../utils/toast";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";

import RoomImage from "./RoomImage";
import { NO_IMAGE } from "../../../constants/constants";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface RoomCardProps {
  room: SiteRooms;
  onEdit: (room: SiteRooms) => void;
  onDelete: () => void;
  deleteRoomLoading: boolean
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete, deleteRoomLoading }) => {
  const { projectId } = useParams()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.sitemeasurement?.delete;
  const canCreate = role === "owner" || permission?.sitemeasurement?.create;
  const canEdit = role === "owner" || permission?.sitemeasurement?.edit;

  const uploads = room?.uploads || []
  const area = room.length && room.breadth ? (room.length * room.breadth).toFixed(2) : null;

  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadRoomSiteFiles()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files
      if (!files || files.length === 0) return

      // Filter only image files
      const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) {
        toast({
          title: "Error",
          description: "Please select only image files",
          variant: "destructive",
        })
        return
      }

      if (imageFiles.length !== files.length) {
        toast({
          title: "Warning",
          description: "Only image files were uploaded. PDFs were skipped.",
          variant: "destructive",
        })
      }

      const formData = new FormData()
      imageFiles.forEach((file) => formData.append("file", file))

      await uploadFiles({
        roomId: (room as any)._id,
        files: formData,
        projectId: projectId!,
      })

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      })

      // Clear the input
      event.target.value = ""
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to upload",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium p-4 sm:p-5 mb-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-ash-light">
        <h3 className="text-base font-bold text-text-main flex items-center">
          {/* <i className="fa-solid fa-door-open text-gray-400 mr-2.5"></i>
          {room.name} */}

          <div className="w-8 h-8 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center shadow-sm shrink-0">
            <i className="fa-solid fa-door-open text-text-muted text-sm"></i>
          </div>
          <span className="truncate">{room.name}</span>
        </h3>
        <div className="flex gap-1.5">
          {canEdit && (
            <Button
              variant="white"
              onClick={() => onEdit(room)}
              // className="h-8 w-8 p-0 text-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              className="h-8 w-8 p-0 border-ash-medium text-text-muted hover:text-action-primary shadow-sm"
              title="Edit Room"
            >
              <i className="fa-regular fa-pen-to-square text-sm"></i>
            </Button>
          )}
          {canDelete && (
            <Button
              isLoading={deleteRoomLoading}
              onClick={onDelete}
              variant="ghost"
              // className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              className="h-8 w-8 p-0 text-text-muted hover:text-action-danger  border border-transparent  shadow-sm transition-all"
              title="Delete Room"
            >
              {deleteRoomLoading ? <i className="fas fa-spinner fa-spin text-sm"></i> : <i className="fa-regular fa-trash-can text-sm"></i>}
            </Button>
          )}
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-brand-ash border border-ash-light rounded-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Length</span>
          <p className="font-semibold text-text-main text-sm">{room.length || 0} ft</p>
        </div>
        <div className="text-center p-3 bg-brand-ash border border-ash-light rounded-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Breadth</span>
          <p className="font-semibold text-text-main text-sm">{room.breadth || 0} ft</p>
        </div>
        <div className="text-center p-3 bg-brand-ash border border-ash-light rounded-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Height</span>
          <p className="font-semibold text-text-main text-sm">{room.height || 0} ft</p>
        </div>
      </div>

      {/* Total Area Pill */}
      {area && (
        <div className="bg-brand-ash border border-ash-medium p-3 rounded-lg mb-6 shadow-sm flex justify-between items-center px-4">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-chart-area"></i> Total Area
          </span>
          <span className="text-lg font-black text-text-main">{area} <span className="text-xs font-bold text-text-muted">sq.ft</span></span>
        </div>
      )}

      {/* File Upload Section */}
      <div className="space-y-4 w-full">
        {(canCreate || canEdit) && (
          <div className="w-full relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-2">Upload Images</span>
            <Input
              type="file"
              multiple
              accept="image/*"
              placeholder="Select images"
              onChange={handleUpload}
              disabled={isUploading}
              // className={`w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm shadow-sm focus:ring-0 ${isUploading ? "pr-10 opacity-70 cursor-not-allowed" : ""}`}
              className={`w-full bg-brand-ash border border-ash-medium text-text-main file:bg-brand-surface file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all shadow-sm ${isUploading ? "pr-10 opacity-70 cursor-not-allowed" : ""}`}
            />
            {isUploading && (
              <div className="absolute inset-y-0 right-3 flex items-center top-[24px]">
                <i className="fas fa-circle-notch fa-spin text-text-muted"></i>
              </div>
            )}
          </div>
        )}

        {/* Images Display */}
        <div className="mt-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
            <i className="fa-regular fa-images"></i> Room Images
          </h4>
          {uploads.length === 0 ? (
            <div className="text-text-muted text-xs font-bold uppercase tracking-wider bg-brand-ash/30 p-6 rounded-xl text-center border border-dashed border-ash-medium">
              No images uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3 bg-brand-ash/50 border border-ash-light rounded-xl">
              {uploads.map((file, idx) => (
                <RoomImage key={idx} room={room} setPreviewImage={setPreviewImage} file={file} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {/* {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl shadow-2xl max-w-[90%] max-h-[90%] p-2 overflow-hidden border border-gray-200"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
            <img
              src={previewImage || NO_IMAGE}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )} */}

      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[9999] bg-brand-main/90 flex items-center justify-center backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-brand-surface rounded-xl p-2 max-w-[90%] max-h-[90%] shadow-2xl border border-ash-medium animate-in fade-in zoom-in duration-200"
          >
            <button
              onClick={() => setPreviewImage(null)}
              // className="absolute -top-4 -right-4 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all z-10"
              className="absolute top-4 right-4 z-10  bg-brand-surface border border-ash-medium text-text-main rounded-full w-10 h-10  flex items-center justify-center transition-all duration-200 backdrop-blur-md"

            >
              <i className="fas fa-times text-lg"></i>
            </button>
            <img
              src={previewImage || NO_IMAGE}
              alt="Preview"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;