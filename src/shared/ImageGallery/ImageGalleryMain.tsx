"use client"

import { useState, useEffect } from "react"

interface ImageFile {
  _id: string
  url: string
  originalName?: string
}

interface ImageGalleryProps {
  images: ImageFile[]
  onDelete: (id: string) => void
  onDownload: (params: { src: string; alt: string }) => void
  isDeleting?: boolean
  refetch?: () => void
  className?: string
}

export function ImageGallery({
  images,
  onDelete,
  onDownload,
  isDeleting = false,
  refetch,
  className = "",
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup()
      }
    }

    if (isPopupOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isPopupOpen])

  const openPopup = (index: number) => {
    setSelectedImageIndex(index)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedImageIndex(null)
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const handleDelete = async (id: string) => {
    await onDelete(id)
    if (refetch) {
      refetch()
    }
    if (images.length <= 1) {
      closePopup()
    } else if (selectedImageIndex !== null && selectedImageIndex >= images.length - 1) {
      setSelectedImageIndex(Math.max(0, images.length - 2))
    }
  }

  const handleDownload = (image: ImageFile) => {
    onDownload({
      src: image.url,
      alt: image.originalName || "image",
    })
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <i className="fas fa-images text-4xl mb-2"></i>
        <p>No images to display</p>
      </div>
    )
  }

  const currentImage =
    selectedImageIndex !== null && selectedImageIndex >= 0 && selectedImageIndex < images.length
      ? images[selectedImageIndex]
      : null

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-0.5 p-1 ${className}`}>
        {images.map((image, index) => (
          <div
            key={image._id}
            className="relative cursor-pointer bg-gray-100 overflow-hidden aspect-square"
            onClick={() => openPopup(index)}
          >
            <img
              src={image.url || NO_IMAGE}
              alt={image.originalName || `Image ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="absolute top-4 right-4 z-60 flex items-center gap-3">
            <button
              onClick={() => handleDownload(currentImage)}
              className="text-white hover:text-gray-300 transition-colors p-2"
              title="Download"
            >
              <i className="fas fa-download text-xl"></i>
            </button>

            <button
              onClick={() => handleDelete(currentImage._id)}
              className="text-white hover:text-red-400 transition-colors p-2"
              title="Delete"
              disabled={isDeleting}
            >
              <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash-can"} text-xl`}></i>
            </button>

            <button onClick={closePopup} className="text-white hover:text-gray-300 transition-colors p-2" title="Close">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          {/* Navigation Arrows */}
          {selectedImageIndex !== null && selectedImageIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
            >
              <i className="fas fa-chevron-left text-3xl"></i>
            </button>
          )}

          {selectedImageIndex !== null && selectedImageIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
            >
              <i className="fas fa-chevron-right text-3xl"></i>
            </button>
          )}

          {/* Image Container */}
          <div className="relative max-w-[80vw] max-h-[80vh] flex items-center justify-center">
            <img
              src={currentImage.url || NO_IMAGE}
              alt={currentImage.originalName || `Image ${selectedImageIndex !== null ? selectedImageIndex + 1 : 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {selectedImageIndex !== null ? selectedImageIndex + 1 : 1} of {images.length}
          </div>
        </div>
      )}
    </>
  )
}


import { NO_IMAGE } from "../../constants/constants"
import { downloadImage } from "../../utils/downloadFile"

// Example usage component

export default function ImageGalleryExample({imageFiles}:{imageFiles:any}) {
  // Example image data - replace with your actual data
  // const imageFiles = [
  //   {
  //     _id: "1",
  //     url: "/placeholder.svg?height=300&width=300",
  //     originalName: "landscape.jpg",
  //   },
  //   {
  //     _id: "2",
  //     url: "/placeholder.svg?height=300&width=300",
  //     originalName: "city.jpg",
  //   },
  //   {
  //     _id: "3",
  //     url: "/placeholder.svg?height=300&width=300",
  //     originalName: "mountain.jpg",
  //   },
  //   {
  //     _id: "4",
  //     url: "/placeholder.svg?height=300&width=300",
  //     originalName: "ocean.jpg",
  //   },
  // ]

  const handleDeleteFile = (id: string) => {
    console.log("Deleting file with id:", id)
    // Your delete logic here
  }

  const refetchImages = () => {
    console.log("Refetching images...")
    // Your refetch logic here
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Image Gallery Example</h2>
      <ImageGallery
        images={imageFiles}
        onDelete={handleDeleteFile}
        onDownload={downloadImage}
        refetch={refetchImages}
        isDeleting={false}
        className="mb-8"
      />
    </div>
  )
}
