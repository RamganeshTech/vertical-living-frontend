import React, { useState } from 'react'
import { NO_IMAGE } from '../../../constants/constants'
import { Button } from '../../../components/ui/Button'
import { useDeleteRoomSiteFiles, useUpdateImageCategoryName } from '../../../apiList/Stage Api/siteMeasurementApi'
import { useParams } from 'react-router-dom'
import { toast } from '../../../utils/toast'
import { downloadImage } from '../../../utils/downloadFile'
import { useAuthCheck } from '../../../Hooks/useAuthCheck'



interface RoomImageProp {
    setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>
    file: any
    room: any
}

const RoomImage: React.FC<RoomImageProp> = ({ file, setPreviewImage, room }) => {
    const { projectId } = useParams()
    const [isEditing, setIsEditing] = useState(false);
    const [tempCategory, setTempCategory] = useState(file?.categoryName || "");

    const { mutateAsync: deleteFile, isPending: isDeleting } = useDeleteRoomSiteFiles()
    const { mutateAsync: updateCategory, isPending: isUpdatingName } = useUpdateImageCategoryName()



    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.sitemeasurement?.delete;
    // const canList = role === "owner" || permission?.sitemeasurement?.list;
    const canCreate = role === "owner" || permission?.sitemeasurement?.create;
    const canEdit = role === "owner" || permission?.sitemeasurement?.edit;


    const handleDeleteFile = async (uploadId: string) => {
        try {

            await deleteFile({
                roomId: (room as any)._id,
                uploadId,
                projectId: projectId!,
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


    const handleCategoryUpdate = async () => {
        if (!tempCategory || tempCategory === file.categoryName) {
            setIsEditing(false);
            return;
        }
        try {
            await updateCategory({
                uploadId: file._id,
                categoryName: tempCategory,
                roomId: room._id,
                projectId: projectId!,
            });

            toast({
                title: "Updated",
                description: "Image name updated successfully",
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to update name",
                variant: "destructive",
            });
        } finally {
            setIsEditing(false);
        }
    };


    const pdfActions = ["eye", "download", ...(canDelete ? ["trash"] : [])];


    return (
        <div
            key={file._id}
            className="group bg-white transition-all duration-300 hover:z-10"
        >
            {/* Image Container - Clickable for preview */}
            <div
                className="relative w-full overflow-hidden border-4 border-white  transition-all duration-300 cursor-pointer"
                onClick={() => setPreviewImage(file?.url)}
            >
                <div className="aspect-square w-full">
                    <img
                        src={file.url || NO_IMAGE}
                        alt={file.originalName}
                        className="w-full h-full transition-transform duration-300 "
                    />
                </div>

                {/* Desktop Hover Overlay */}
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 items-center justify-center hidden md:flex">
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        {pdfActions.map((action) => (
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
                                className={`rounded-full bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ${action === "trash" ? "hover:bg-red-50" : ""
                                    }`}
                            >
                                <i
                                    className={`w-3 h-3 fas fa-${action} ${action === "trash"
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
                    {pdfActions.map((action) => (
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
                            className={`w-6 h-6 p-0 rounded-full bg-white/90 backdrop-blur-sm border shadow-sm transition-all duration-200 ${action === "trash"
                                ? "border-red-200 hover:border-red-300 hover:bg-red-50"
                                : action === "download"
                                    ? "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <i
                                className={`w-3 h-3 fas fa-${action} ${action === "trash"
                                    ? "text-red-500"
                                    : action === "download"
                                        ? "text-blue-500"
                                        : "text-gray-600"
                                    }`}
                            />
                        </Button>
                    ))}
                </div>




                {/* Category Label / Editor */}

            </div>
            <div onClick={e => e.stopPropagation()} className="my-1 flex items-center justify-between px-1">
                {!isEditing ? (
                    <>
                        <span className="text-sm text-gray-800 truncate max-w-[80%]">
                            {file?.categoryName || 'No category'}
                        </span>
                        {(canEdit || canCreate) && <button
                            className="text-gray-500 cursor-pointer hover:text-blue-600 text-xs"
                            onClick={() => setIsEditing(true)}
                        >
                            <i className="fas fa-pen" />
                        </button>}
                    </>
                ) : (

                    <div className="flex w-full items-center space-x-1">
                        <input
                            value={tempCategory}
                            onChange={(e) => setTempCategory(e.target.value)}
                            className="text-sm border px-1 py-0.5 rounded w-full"
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    handleCategoryUpdate()
                                }
                            }}
                        />
                        <button
                            onClick={handleCategoryUpdate}
                            disabled={isUpdatingName}
                            className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs"
                        >
                            {!isUpdatingName ? <i className="fas fa-check" /> : <i className='fa fa-spinner animate-spin'></i>}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false)
                                setTempCategory(file.categoryName || '')
                            }}
                            className="text-red-500 cursor-pointer hover:text-red-700 text-xs"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoomImage