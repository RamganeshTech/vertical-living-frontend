import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import type { SiteRooms } from "../../../types/types";
import { useDeleteRoomSiteFiles, useUploadRoomSiteFiles } from "../../../apiList/Stage Api/siteMeasurementApi";
import { toast } from "../../../utils/toast";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { downloadImage } from "../../../utils/downloadFile";
import { NO_IMAGE } from "../../../constants/constants";

interface RoomCardProps {
  room: SiteRooms;
  onEdit: (room: SiteRooms) => void;
  onDelete: () => void;
  deleteRoomLoading:boolean
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete , deleteRoomLoading}) => {

  const {projectId} = useParams()
  const area = room.length && room.breadth ? (room.length * room.breadth).toFixed(2) : null;
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const uploads = room?.uploads || []
console.log("uploads", room.uploads)
const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadRoomSiteFiles()
  const { mutateAsync: deleteFile, isPending: isDeleting } = useDeleteRoomSiteFiles()


    
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
        projectId:projectId!,
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

  const handleDeleteFile = async (uploadId: string) => {
    try {
      await deleteFile({
        roomId: (room as any)._id,
        uploadId,
        projectId:projectId!,
      })

      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete",
        variant: "destructive",
      })
    }
  }



  return (
    <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-blue-700">{room.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(room)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <Button
          isLoading={deleteRoomLoading}
            onClick={onDelete}
            variant="ghost"
            className="!text-red-600 hover:text-red-800 bg-white shadow-none hover:!bg-none"
          >
            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg> */}
              <i className="fas fa-trash-can"></i>
          </Button>
        </div>
      </div>






      {/* File Upload Section */}
      <div className="space-y-4 w-full">
        {/* Upload Button */}
        <div className="flex items-center justify-between w-full relative">
          <Input
            type="file"
            multiple
            accept="image/*"
            placeholder="Select images"
            onChange={handleUpload}
            disabled={isUploading}
            className={isUploading ? "pr-10 opacity-70 cursor-not-allowed w-full" : ""}
          />
          {isUploading && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Images Display */}
        <div className="my-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Room Images</h4>
          {uploads.length === 0 ? (
            <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
              No images uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              {uploads.map((file) => (
                <div
                  key={file._id}
                  className="group transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  {/* Image Container - Clickable for preview */}
                  <div
                    className="relative w-full bg-white rounded-lg shadow-md overflow-hidden border-4 border-white group-hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setPreviewImage(file?.url)}
                  >
                    <div className="aspect-square w-full">
                      <img
                        src={file.url || NO_IMAGE}
                        alt={file.originalName}
                        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Desktop Hover Overlay */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 items-center justify-center hidden md:flex">
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                         {["eye", "trash", "download"].map((action) => (
                          <Button
                            key={action}
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              action === "eye"
                                ? setPreviewImage(file?.url)
                                : action === "trash"
                                  ? handleDeleteFile(file._id)
                                  : downloadImage({ src: file?.url, alt: file?.originalName || "image" })
                            }}
                            disabled={action === "trash" && isDeleting}
                            className={`rounded-full bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ${
                              action === "trash" ? "hover:bg-red-50" : ""
                            }`}
                          >
                            <i
                              className={`w-3 h-3 fas fa-${action} ${
                                action === "trash"
                                  ? "text-red-500"
                                  : action === "download"
                                    ? "text-blue-500"
                                    : "text-gray-600"
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Action Buttons - Inside Image at Top Right */}
                          <div className="absolute top-2 right-[2px] flex flex-col space-y-1 sm:hidden">
                      {["eye", "trash", "download"].map((action) => (
                        <Button
                          key={action}
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            action === "eye"
                              ? setPreviewImage(file?.url)
                              : action === "trash"
                                ? handleDeleteFile(file._id)
                                : downloadImage({ src: file?.url, alt: file?.originalName || "image" })
                          }}
                          disabled={action === "trash" && isDeleting}
                          className={`w-6 h-6 p-0 rounded-full bg-white/90 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                            action === "trash"
                              ? "border-red-200 hover:border-red-300 hover:bg-red-50"
                              : action === "download"
                                ? "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <i
                            className={`w-3 h-3 fas fa-${action} ${
                              action === "trash"
                                ? "text-red-500"
                                : action === "download"
                                  ? "text-blue-500"
                                  : "text-gray-600"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Length</p>
          <p className="font-semibold text-gray-800">{room.length || 0} ft</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Breadth</p>
          <p className="font-semibold text-gray-800">{room.breadth || 0} ft</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Height</p>
          <p className="font-semibold text-gray-800">{room.height || 0} ft</p>
        </div>
      </div>

      {area && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700 font-medium text-center">
            Total Area: {area} sq.ft
          </p>
        </div>
      )}





      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl shadow-2xl max-w-[90%] max-h-[90%] p-2 overflow-hidden"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <i className="fas fa-times text-sm" />
            </button>
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};


export default RoomCard