import { useParams } from "react-router-dom"
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants"
import { useState } from "react"
import {
  useGetWorkerStepDetails,
  useUploadWorkerInitialFiles,
  useUploadWorkerCorrectionFiles,
} from "../../../apiList/WallPainting Api/workerWallPaintingApi"
import { downloadImage } from "../../../utils/downloadFile"

export default function WorkerWallStepPage() {
  const { projectId, stepId, stepNumber } = useParams<{
    projectId: string
    stepNumber: string
    stepId: string
  }>()

  const [initialFiles, setInitialFiles] = useState<FileList | null>(null)
  const [correctionFiles, setCorrectionFiles] = useState<FileList | null>(null)
  const [loadingImages, setLoadingImages] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null)

  const { data: stepData, isLoading } = useGetWorkerStepDetails(projectId!, stepId!)
  const { mutate: uploadInitial } = useUploadWorkerInitialFiles()
  const { mutate: uploadCorrection } = useUploadWorkerCorrectionFiles()

  const step = WORKER_WALL_PAINTING_STEPS.find((s) => s.stepNumber === Number(stepNumber))

  const handleImageLoad = () => {
    setLoadingImages(false)
  }

  const handleImageError = () => {
    setLoadingImages(false)
  }

  const openImagePreview = (url: string, alt: string) => {
    setPreviewImage({ url, alt })
  }

  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading step details...</p>
        </div>
      </div>
    )
  }

  if (!step) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Step Not Found</h2>
          <p className="text-blue-600">The requested step could not be found.</p>
        </div>
      </div>
    )
  }

  const handleInitialUpload = () => {
    if (!initialFiles || initialFiles.length === 0) {
      alert("Please select files for initial upload.")
      return
    }
    const formData = new FormData()
    for (let i = 0; i < initialFiles.length; i++) {
      formData.append("files", initialFiles[i])
    }
    uploadInitial({
      projectId: projectId!,
      stepNumber: stepNumber!,
      formData,
    })
  }

  const handleCorrectionUpload = (correctionRound: string) => {
    if (!correctionFiles || correctionFiles.length === 0) {
      alert("Please select files for correction upload.")
      return
    }
    const formData = new FormData()
    for (let i = 0; i < correctionFiles.length; i++) {
      formData.append("files", correctionFiles[i])
    }
    uploadCorrection({
      projectId: projectId!,
      stepNumber: stepNumber!,
      correctionRound: correctionRound,
      formData,
    })
  }

  const ImageWithBlur = ({ src, alt }: { src: string; alt: string;  }) => {
    return (
      <div className="relative group cursor-pointer" onClick={() => openImagePreview(src, alt)}>
        {loadingImages && (
          <div className=" pointer-events-none absolute z-20 inset-0 bg-gray-900 animate-pulse rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-400"
          onLoadStart={() => setLoadingImages(true)}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadImage({ src, alt });
          }}
          className="absolute cursor-pointer bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
          title="Download"
        >
          {/* Simple download icon (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 12l4 4m0 0l4-4m-4 4V4" />
          </svg>
        </button>
      </div>
    )
  }


  return (
    <div className="min-h-[80%] bg-gray-50 rounded-xl">
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-blue-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage.url || "/placeholder.svg"}
              alt={previewImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="w-full h-full ">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}

          <div className="bg-white px-2 py-3 sm:px-6 sm:py-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-2"> {`${stepNumber})`} {" "}{step.label}</h1>
            <p className="text-blue-600 hidden">
              Step {stepNumber}
            </p>
          </div>


          {/* Content Container with max height and scroll */}
          <div className="sm:max-h-[calc(100vh-150px)] max-h-[calc(100vh-85px)]  overflow-y-auto custom-scrollbar">
            <div className="p-2 sm:p-6 space-y-8">
              {/* Rules Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Step Requirements
                </h2>
                <ul className="space-y-2">
                  {step.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start text-blue-700">
                      <span className="text-blue-500 mr-3 mt-0.5">✅</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Initial Uploads Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">📤</span>
                  Your Initial Uploads
                </h2>

                {stepData?.data?.initialUploads?.length ? (
                  // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-6">
                  <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="flex gap-4 w-max">
                      {stepData.data.initialUploads.map((file: any, idx: number) => (
                        <>
                          <ImageWithBlur
                            key={idx}
                            src={file?.url || "/placeholder.svg"}
                            alt={`Initial Upload ${idx + 1}`}
                          />

                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-blue-500">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="font-medium">No initial uploads yet.</p>
                  </div>
                )}

                {/* Upload Initial Files */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Upload Initial Files:</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setInitialFiles(e.target.files)}
                      className="flex-1 text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer border border-blue-200 rounded-lg"
                    />
                    <button
                      onClick={handleInitialUpload}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Upload Files
                    </button>
                  </div>
                </div>
              </div>

              {/* Correction Rounds Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🔄</span>
                  Correction Rounds
                </h2>

                {stepData?.data?.correctionRounds?.length ? (
                  <div className="space-y-6">
                    {stepData.data.correctionRounds.map((round: any) => (
                      <div key={round.roundNumber} className="bg-white border border-blue-200 rounded-lg p-2 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-blue-800">Correction Round {round?.roundNumber}</h3>
                          {/* <Badge variant="default">
                            Correction Required
                          </Badge> */}
                        </div>

                        {/* Admin Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            <i className="fas fa-circle-info mr-1 sm:mr-2 "></i>
                            Admin Note:</h4>
                          <p className="text-blue-700">{round.adminNote} </p>
                        </div>

                        {/* Admin Uploads */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-blue-800 mb-3">Admin Reference Images:</h4>
                          {!round?.adminUploads.length ?
                            <div className="text-center py-8 text-blue-500">
                              <div className="text-4xl mb-2">📁</div>
                              <p className="font-medium">No Admin uploads</p>
                            </div>
                            :
                            // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            <div className="max-w-full overflow-x-auto custom-scrollbar">
                              <div className="flex gap-4 w-max">
                                {round?.adminUploads?.map((file: any, idx: number) => (
                                  <>
                                    <ImageWithBlur
                                      key={idx}
                                      src={file.url || "/placeholder.svg"}
                                      alt={`Admin Upload ${idx + 1}`}
                                    />

                                  </>
                                ))}
                              </div>
                            </div>
                          }
                        </div>

                        {/* Worker Correction Uploads */}
                        {round.workerCorrectedUploads?.length > 0 ? (
                          <div className="mb-6 border-t border-gray-200">
                            <h4 className="font-semibold text-blue-800 mb-3">Your Correction Uploads:</h4>
                            {/* <div className="max-w-full overflow-x-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"> */}
                            <div className="max-w-full overflow-x-auto custom-scrollbar">
                              <div className="flex gap-4 w-max">
                                {round.workerCorrectedUploads.map((file: any, idx: number) => (
                                  <>
                                    <ImageWithBlur
                                      key={idx}
                                      src={file.url || "/placeholder.svg"}
                                      alt={`Worker Correction ${idx + 1}`}
                                    />

                                  </>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                          :
                          <div className="text-center py-8 border-t border-gray-200 text-blue-500">
                            <div className="text-4xl mb-2">📁</div>
                            <p className="font-medium">No Worker correction uploads</p>
                          </div>
                        }

                        {/* Upload Correction Files */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <label className="block text-sm font-medium text-blue-700 mb-2">
                            Upload Correction Files:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="file"
                              multiple
                              onChange={(e) => setCorrectionFiles(e.target.files)}
                              className="flex-1 text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 file:cursor-pointer border border-blue-200 rounded-lg"
                            />
                            <button
                              onClick={() => handleCorrectionUpload(round?.roundNumber)}
                              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                              Upload Corrections
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-blue-500">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-medium">No corrections requested yet.</p>
                    <p className="text-sm mt-1">Your work is on track!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
