import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Textarea } from "../../components/ui/TextArea"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Badge } from "../../components/ui/Badge"
import { Skeleton } from "../../components/ui/Skeleton"
import { Separator } from "../../components/ui/Seperator"
import { toast } from "../../utils/toast"
import {
  useGetSingleStageDocumentation,
  useUploadFilesToStage,
  useDeleteStageFile,
  useUpdateStageDescription,
  type UploadFileType,
  useManuallyGenerateStagePdf,
} from "../../apiList/Documentation Api/documentationApi"
import { downloadImage } from "../../utils/downloadFile"

// Image Modal Component
const ImageModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageName: string
}> = ({ isOpen, onClose, imageUrl, imageName }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full h-full max-w-5xl sm:max-w-xl md:max-w-3xl lg:max-w-5xl max-h-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-image text-blue-600 text-sm"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{imageName}</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 flex-shrink-0 bg-transparent"
            >
              <i className="fa-solid fa-times text-sm"></i>
              <span className="hidden sm:inline">Close</span>
            </Button>
          </div>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gray-100 overflow-hidden">
            <div className="max-w-full max-h-full flex items-center justify-center">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={imageName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600">Click outside the image or press ESC to close</p>
              <Button
                variant="outline"
                onClick={onClose}
                className="h-9 sm:h-10 px-4 sm:px-6 w-full sm:w-auto bg-transparent"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SingleStageDocument: React.FC = () => {
  const { projectId, stageNumber } = useParams() as {projectId:string, stageNumber:string}
  const [description, setDescription] = useState("")
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    imageUrl: string
    imageName: string
  }>({
    isOpen: false,
    imageUrl: "",
    imageName: "",
  })
  const navigate = useNavigate()

  const { data, isLoading } = useGetSingleStageDocumentation({
    projectId: projectId!,
    stageNumber: stageNumber!,
  })

  const uploadMutation = useUploadFilesToStage()
  const deleteMutation = useDeleteStageFile()
  const updateDescMutation = useUpdateStageDescription()
  const {mutateAsync:updateDocManually, isPending:updateDocPending} = useManuallyGenerateStagePdf()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFiles.length) return

    try {
      await uploadMutation.mutateAsync({
        projectId: projectId!,
        stageNumber: stageNumber!,
        files: selectedFiles,
      })

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      })

      setSelectedFiles([])
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to upload files",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteMutation.mutateAsync({
        projectId: projectId!,
        stageNumber: stageNumber!,
        fileId,
      })

      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const handleDescriptionUpdate = async () => {
    try {
      await updateDescMutation.mutateAsync({
        projectId: projectId!,
        stageNumber: stageNumber!,
        description,
      })

      toast({
        title: "Success",
        description: "Description updated successfully",
      })

      setIsEditingDesc(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update description",
        variant: "destructive",
      })
    }
  }


  const handleUpdateDocManually = async ()=>{
    try{
      console.log("gettin isnde 1")
      await updateDocManually({
        projectId,
        stageNumber
      })

       toast({
        title: "Success",
        description: "Document updated successfully",
      })
    }
    catch(error:any){
       toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update document",
        variant: "destructive",
      })
    }
  }

  const openImageModal = (imageUrl: string, imageName: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      imageName,
    })
  }

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: "",
      imageName: "",
    })
  }

  useEffect(() => {
    if (data?.description) setDescription(data.description)
  }, [data?.description])

  const imageFiles = data?.uploadedFiles?.filter((file: UploadFileType) => file.type === "image")
  const pdfFiles = data?.uploadedFiles?.filter((file: UploadFileType) => file.type === "pdf")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <Skeleton className="h-8 sm:h-10 w-20 sm:w-24 mb-4" />
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 mb-4 sm:mb-6" />
              <div className="space-y-3 sm:space-y-4">
                <Skeleton className="h-16 sm:h-20 w-full" />
                <Skeleton className="h-24 sm:h-32 w-full" />
                <Skeleton className="h-24 sm:h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // if (isError) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
  //       <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
  //         <div className="max-w-7xl mx-auto">
  //           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
  //             <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 sm:mb-6 h-10 sm:h-11 px-4 sm:px-6">
  //               <i className="fa-solid fa-arrow-left mr-2"></i>
  //               <span className="hidden sm:inline">Back to Documentation</span>
  //               <span className="sm:hidden">Back</span>
  //             </Button>
  //             <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
  //               <div className="flex items-start gap-3">
  //                 <i className="fa-solid fa-exclamation-triangle text-red-500 text-lg sm:text-xl mt-0.5"></i>
  //                 <div>
  //                   <h3 className="font-semibold text-red-800 text-sm sm:text-base">Error Loading Documentation</h3>
  //                   <p className="text-red-600 text-xs sm:text-sm mt-1">
  //                     Failed to load stage documentation. Please try again later.
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl">
        <div className="w-full ">
          <div className="max-w-full mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-200 sm:p-4 p-2 ">
              <div className="flex flex-row items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 w-fit"
                >
                  <i className="fa-solid fa-arrow-left text-sm"></i>
                  <span className="hidden sm:inline">Back to Documentation</span>
                  <span className="sm:hidden">Back</span>
                </Button>
                {/* <Badge variant="secondary" className="text-xs sm:text-sm px-4 py-1.5 w-fit">
                  Stage {stageNumber}
                </Badge> */}




                <div className="flex flex-col items-center sm:flex-row gap-2">
                  <h3 className="text-sm sm:text-lg font-normal flex items-center gap-1">
                    <i className="fa-solid fa-file-pdf text-red-600" />
                    Document
                  </h3>
                  {data.pdfLink ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={() =>
                          downloadImage({
                            src: data.pdfLink,
                            alt: `Stage-${data.stageNumber}-Documentation.pdf`,
                          })
                        }
                        size="sm"
                        className="text-sm"
                      >
                        <i className="fa-solid fa-download" />

                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(data.pdfLink, "_blank", "noopener,noreferrer")}
                        className="text-sm"
                      >
                        <i className="fa-solid fa-eye" />

                      </Button>


                       <Button
                       isLoading={updateDocPending}
                        variant="outline"
                        size="sm"
                        onClick={handleUpdateDocManually}
                        className="text-sm"
                      >
                        <i className="fa-solid fa-rotate" />
                        <span className="sm:inline hidden "></span>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No PDF available</p>
                  )}

                </div>



              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white  rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-500 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg sm:text-2xl">
                    {stageNumber}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Stage {stageNumber}</h1>
                    <p className="text-white/80 text-sm sm:text-base mt-1">Documentation & Files</p>
                  </div>
                </div>
              </div>

              {/* Price Section - Only for Stage 6 and 7 */}
              {(stageNumber === "6" || stageNumber === "7") && (
                <>
                  <div className=" p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 my-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <i className="fa-solid fa-dollar-sign text-blue-600 text-sm"></i>
                        </div>
                        Stage Price
                      </h3>
                      <Badge
                        variant="default"
                        className="text-xs sm:text-sm px-3 py-1.5 w-fit bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <i className="fa-solid fa-tag mr-1"></i>
                        Pricing Stage
                      </Badge>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <i className="fa-solid fa-money-bill-wave text-blue-600 text-xl sm:text-2xl"></i>
                          </div>
                          <div>
                            <p className="text-sm sm:text-base text-gray-600 mb-1">Stage {stageNumber} Total Amount</p>
                            <p className="text-2xl sm:text-3xl font-bold text-blue-700">
                              ₹{data?.price ? Number(data.price).toLocaleString() : "0.00"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </>
              )}

              <Separator className="my-6 sm:my-8" />

              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Description Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <i className="fa-solid fa-file-text text-blue-600 text-sm"></i>
                      </div>
                      Description
                    </h3>
                    {!isEditingDesc && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingDesc(true)}
                        className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 w-fit"
                      >
                        <i className="fa-solid fa-edit text-xs"></i>
                        <span className="text-xs sm:text-sm">Edit</span>
                      </Button>
                    )}
                  </div>

                  {isEditingDesc ? (
                    <div className="space-y-3 sm:space-y-4">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter stage description..."
                        className="min-h-[100px] sm:min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          onClick={handleDescriptionUpdate}
                          disabled={updateDescMutation.isPending}
                          className="flex items-center justify-center gap-2 h-10 sm:h-11"
                        >
                          <i className="fa-solid fa-save text-sm"></i>
                          {updateDescMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingDesc(false)
                            setDescription(data?.description || "")
                          }}
                          className="h-10 sm:h-11"
                        >
                          <i className="fa-solid fa-times mr-2 text-sm"></i>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {description || "No description provided for this stage."}
                      </p>
                    </div>
                  )}
                </div>

                <Separator className="my-6 sm:my-8" />

                {/* Images Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <i className="fa-solid fa-image text-emerald-600 text-sm"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Images ({imageFiles?.length || 0})
                    </h3>
                  </div>

                  {imageFiles?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                      {imageFiles.map((file: UploadFileType) => (
                        <div
                          key={file._id}
                          className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            <img
                              src={file.url || "/placeholder.svg"}
                              alt={file.originalName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3 sm:p-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate mb-3">
                              {file.originalName}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openImageModal(file.url || "", file.originalName)}
                                className="flex-1 flex items-center justify-center gap-2 h-8 sm:h-9 text-xs sm:text-sm"
                              >
                                <i className="fa-solid fa-eye text-xs"></i>
                                View
                              </Button>
                              <Button
                                size="sm"
                                isLoading={deleteMutation.isPending}
                                variant="danger"
                                onClick={() => handleDeleteFile(file._id!)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 flex items-center justify-center gap-2 h-8 sm:h-9 text-xs sm:text-sm hover:text-white"
                              >
                                <i className="fa-solid fa-trash text-xs"></i>
                                {deleteMutation.isPending ? "..." : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 sm:p-12 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <i className="fa-solid fa-image text-2xl sm:text-3xl text-gray-400"></i>
                      </div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-600 mb-2">No images uploaded</h4>
                      <p className="text-xs sm:text-sm text-gray-500">Upload some images to get started</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6 sm:my-8" />

                {/* PDFs Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <i className="fa-solid fa-file-pdf text-red-600 text-sm"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      PDF Documents ({pdfFiles?.length || 0})
                    </h3>
                  </div>

                  {pdfFiles?.length ? (
                    <div className="space-y-3 sm:space-y-4">
                      {pdfFiles.map((file: UploadFileType) => (
                        <div
                          key={file._id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                <i className="fa-solid fa-file-pdf text-red-600 text-lg sm:text-xl"></i>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                  {file.originalName}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">PDF Document</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 sm:h-9 px-3 sm:px-4 bg-transparent"
                              >
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs sm:text-sm"
                                >
                                  <i className="fa-solid fa-external-link text-xs"></i>
                                  <span className="hidden sm:inline">View</span>
                                </a>
                              </Button>
                              <Button
                                isLoading={deleteMutation.isPending}
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteFile(file._id!)}
                                disabled={deleteMutation.isPending}
                                className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm hover:text-white"
                              >
                                <i className="fa-solid fa-trash text-xs mr-1 sm:mr-2"></i>
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 sm:p-12 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <i className="fa-solid fa-file-pdf text-2xl sm:text-3xl text-gray-400"></i>
                      </div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-600 mb-2">No PDF documents</h4>
                      <p className="text-xs sm:text-sm text-gray-500">Upload some PDF files to get started</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6 sm:my-8" />

                {/* File Upload Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <i className="fa-solid fa-upload text-purple-600 text-sm"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Upload New Files</h3>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors p-6 sm:p-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                          <i className="fa-solid fa-upload text-2xl sm:text-3xl text-blue-600"></i>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Upload Files</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Select images and PDF files to upload to this stage
                        </p>
                      </div>

                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 sm:h-12"
                      />

                      {selectedFiles.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-3">
                            Selected files ({selectedFiles.length}):
                          </p>
                          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-blue-700">
                                <i className="fa-solid fa-file flex-shrink-0"></i>
                                <span className="truncate flex-1">{file.name}</span>
                                <span className="text-blue-500 flex-shrink-0">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        isLoading={uploadMutation.isPending}
                        onClick={handleFileUpload}
                        disabled={!selectedFiles.length || uploadMutation.isPending}
                        className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                      >
                        <i className="fa-solid fa-upload mr-2 text-sm"></i>
                        {uploadMutation.isPending
                          ? "Uploading..."
                          : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}Files`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        imageUrl={imageModal.imageUrl}
        imageName={imageModal.imageName}
      />
    </>
  )
}

export default SingleStageDocument
