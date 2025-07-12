import type React from "react"

import { useParams } from "react-router-dom"
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants"
import { useState } from "react"
import {
  useApproveAdminStep,
  useGetAdminStepDetails,
  useUploadAdminCorrectionRound,
} from "../../../apiList/WallPainting Api/adminWallPaintingApi"
import axios from "axios"
import { downloadImage } from "../../../utils/downloadFile"

export default function AdminWallStepPage() {
  const { projectId, stepId, stepNumber } = useParams<{ projectId: string; stepNumber: string; stepId: string }>()
  const [note, setNote] = useState<string>("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [loadingImages, setLoadingImages] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null)

  const { mutate: approveStep } = useApproveAdminStep()
  const { mutate: uploadCorrection } = useUploadAdminCorrectionRound()
  const { data: stepData, isLoading } = useGetAdminStepDetails(projectId!, stepId!)

  const step = ADMIN_WALL_PAINTING_STEPS.find((s) => s.stepNumber === Number(stepNumber))

  const handleImageLoad = (imageId: string) => {
    setLoadingImages(false)
  }

  const handleImageError = (imageId: string) => {
    setLoadingImages(false)
  }

  const openImagePreview = (url: string, alt: string) => {
    console.log("Opening image preview:", url, alt)
    setPreviewImage({ url, alt })
  }

  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  const handleSubmit = () => {
    if ((!files || files?.length === 0) && !note) {
      alert("Please select files or write something in notes")
      return
    }
    const formData = new FormData()
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
      }
    }

    formData.append("adminNote", note)
    uploadCorrection({
      projectId: projectId!,
      stepNumber: stepNumber!,
      formData,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading step details...</p>
        </div>
      </div>
    )
  }

  if (!step) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Step Not Found</h2>
          <p className="text-blue-600">The requested step could not be found.</p>
        </div>
      </div>
    )
  }

  const ImageWithBlur = ({ src, alt, imageId }: { src: string; alt: string; imageId: string }) => {


    return (
      <div className="relative group cursor-pointer" onClick={() => openImagePreview(src, alt)}>
        {loadingImages && (
          <div className="pointer-events-none absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-400 cursor-pointer"
          onLoadStart={() => setLoadingImages(true)}
          onLoad={() => handleImageLoad(imageId)}
          onError={() => handleImageError(imageId)}

        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadImage({src, alt});
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

  // console.log("stepdata form admin", stepData)

  return (
    <div className="min-h-[80%] bg-gray-50 rounded-xl">
      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-blue-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeImagePreview} />
        </div>
      )}

      <div className="w-full h-full ">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white px-2 py-3 sm:px-6 sm:py-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-2"> {`${stepNumber})`} {" "}{step.label}</h1>
            {/* <p className="text-blue-600">
              Admin Review - Step {stepNumber}
            </p> */}
          </div>

          {/* Content Container with max height and scroll */}
          <div className="sm:max-h-[calc(100vh-150px)] max-h-[calc(100vh-85px)]  overflow-y-auto custom-scrollbar">
            <div className="p-2 sm:px-6 sm:py-3 space-y-8">
              {/* Rules Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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

              {/* Worker Initial Uploads Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">👷</span>
                  Worker latest Uploads
                </h2>

                {stepData?.step?.workerInitialUploads?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {stepData.step.workerInitialUploads.map((file: any, idx: number) => {
                      return (
                        <div key={idx} className="bg-white border border-blue-200 rounded-lg p-3 shadow-sm">
                          {file.type === "image" ? (
                            <ImageWithBlur
                              src={file?.url}
                              alt={file?.originalName || `Upload ${idx + 1}`}
                              imageId={`worker-upload-${idx}`}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 sm:h-40 md:h-48 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                              <div className="text-blue-600 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm text-center px-2 font-medium"
                              >
                                {file.originalName}
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-blue-500">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="font-medium">No initial uploads found.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Review Actions
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      approveStep({
                        projectId: projectId!,
                        stepId: stepId!,
                        payload: { status: "approved" },
                      })
                    }
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <span className="mr-2">✅</span>
                    Approve Step
                  </button>
                  <button
                    onClick={() =>
                      approveStep({
                        projectId: projectId!,
                        stepId: stepId!,
                        payload: { status: "approved" },
                      })
                    }
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <span className="mr-2">❌</span>
                    Reject Step
                  </button>
                </div>
              </div>

              {/* Correction Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  Add Correction
                </h2>

                <div className="space-y-4">
                  {/* Correction Note */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Add Correction Note</label>
                    <textarea
                      rows={4}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Provide detailed feedback and correction instructions..."
                      className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Correction Images:</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                        className="flex-1 text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 file:cursor-pointer border border-blue-200 rounded-lg"
                      />
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Submit Correction
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

