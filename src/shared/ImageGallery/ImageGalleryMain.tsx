import { useState, useEffect } from "react"

import { NO_IMAGE } from "../../constants/constants"
import { downloadImage } from "../../utils/downloadFile"
import { createPortal } from "react-dom"


// interface ImageFile {
//   _id: string
//   url: string
//   originalName?: string
// }


interface ImageFile {
  _id: string
  url: string
  originalName?: string
  comment?: string
}

interface ImageGalleryProps {
  images: ImageFile[]
  onDownload: (params: { src: string; alt: string }) => Promise<any>
  onDelete?: (fieldId: string) => Promise<any> | undefined
  isDeleting?: boolean
  refetch?: () => void
  minWidth?: number,
  maxWidth?: number,
  className?: string,
  heightClass?: number,


  isComments?: boolean; // enable/disable comment UI
  editingId?: string | null;
  tempComment?: Record<string, string>;
  setEditingId?: (id: string | null) => void;
  setTempComment?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onUpdateComment?: (imageId: string, newComment: string) => void;

}

export function ImageGallery({
  images,
  onDelete,
  onDownload,
  isDeleting = false,
  refetch,
  className = "",
  minWidth = 100,
  maxWidth = 100,
  heightClass = 0,
  isComments,


  editingId,
  tempComment,
  setEditingId,
  setTempComment,
  onUpdateComment,
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);

  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({})

  const handleImageLoad = (imageId: string, naturalWidth: number, naturalHeight: number) => {
    const aspectRatio = naturalHeight / naturalWidth
    const baseWidth = 200 // Base width for calculation
    const calculatedHeight = Math.max(150, Math.min(400, baseWidth * aspectRatio))

    setImageHeights((prev) => ({
      ...prev,
      [imageId]: calculatedHeight,
    }))
  }



  const openPopup = (index: number) => {
    setSelectedImageIndex(index)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedImageIndex(null)
  }

  // const goToPrevious = () => {
  //   if (selectedImageIndex !== null){
  //     if( selectedImageIndex > 0) {
  //     setSelectedImageIndex(selectedImageIndex - 1)
  //   } else if(selectedImageIndex === 0){
  //       setSelectedImageIndex(images.length -1)
  //   }
  // }
  // }

  // const goToNext = () => {
  //   if (selectedImageIndex !== null){
  //     if( selectedImageIndex < images.length - 1) {
  //     setSelectedImageIndex(selectedImageIndex + 1)
  //   }
  //   else if(selectedImageIndex === images.length - 1){
  //       setSelectedImageIndex(0)
  //   }
  // }
  // }



  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + images.length) % images.length
      );
    }
  };




  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex + 1) % images.length
      );
    }
  };

  //   useEffect(() => {
  //   const handleEscape = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") {
  //       closePopup()
  //     }
  //   }

  //   if (isPopupOpen) {
  //     document.addEventListener("keydown", handleEscape)
  //     document.addEventListener("keydown", handleEscape)
  //     document.addEventListener("keydown", handleEscape)
  //     document.body.style.overflow = "hidden"
  //   }



  //   return () => {
  //     document.removeEventListener("keydown", handleEscape)
  //     document.body.style.overflow = "unset"
  //   }
  // }, [isPopupOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      } else if (e.key === "ArrowRight") {
        goToNext(); // 👈 your function to go next
      } else if (e.key === "ArrowLeft") {
        goToPrevious(); // 👈 your function to go previous
      }
    };

    if (isPopupOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isPopupOpen, goToNext, goToPrevious, closePopup]);

  const handleDelete = async (id: string) => {
    if (onDelete) {

      try {

        await onDelete(id)
        if (refetch) {
          await refetch()
        }
        if (images.length <= 1) {
          closePopup()
        } else if (selectedImageIndex !== null && selectedImageIndex >= images.length - 1) {
          setSelectedImageIndex(Math.max(0, images.length - 2))
        }
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  const handleDownload = (image: ImageFile) => {
    onDownload({
      src: image?.url,
      alt: image?.originalName || "image",
    })
  }

  const handleBackgroundClick = () => {
    // if (e.target === e.currentTarget) {
    closePopup()
    // }
  }

  // if (images.length === 0) {
  //   return (
  //     <div className={`text-center py-8 text-gray-500 ${className}`}>
  //       <i className="fas fa-images text-4xl mb-2"></i>
  //       <p>No images to display</p>
  //     </div>
  //   )
  // }

  const currentImage =
    selectedImageIndex !== null && selectedImageIndex >= 0 && selectedImageIndex < images.length
      ? images[selectedImageIndex]
      : null


  // const width = 120

  return (
    <>
      {/* Gallery Grid */}
      {/* <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3  ${className}`}> */}
      {/* <div className={`flex flex-wrap items-center  ${className}`}> */}
      {/* <div
  className={`grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] ${className}`}
  style={{ gridAutoFlow: "dense" }}
> */}
      <div
        className={`gap-1 flex flex-wrap ${className}`}
      // style={{
      //   columnFill: "balance",
      //   columns: "auto",
      //   columnWidth: "150px",
      // }}
      >
        {images.map((image, index) => {
          const height = imageHeights[image._id] || 200
          return (
            <>
              <div
                key={image._id}
                className={`relative cursor-pointer bg-gray-100 overflow-hidden mb-1 break-inside-avoid ${isComments ? "flex flex-col" : ""}`}
                style={{
                  // flex: "1 1 180px",   // each item at least 180px wide, shrink/grow as needed
                  flex: `0 1 ${minWidth}px`,
                  minWidth: `${minWidth}px`,
                  maxWidth: `${maxWidth}px`,
                  height: isComments
                    ? `${(heightClass || height) + 40 }px` // extra space for comment box
                    : `${heightClass || height}px`,

                }}
                onClick={() => openPopup(index)}
              >
                <img
                  src={image?.url || NO_IMAGE}
                  alt={image?.originalName || `Image ${index + 1}`}
                  className={`w-full cursor-pointer ${isComments ? "" : "h-full"} object-cover`}
                  loading="lazy"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                  }}
                />


                {isComments && (
                  <div
                    className="text-xs border-t border-gray-200 bg-gray-50 p-1 h-full border overflow-y-auto custom-scrollbar"
                    // onClick={(e) => e.stopPropagation()} // stop opening popup when editing
                    onMouseEnter={() => setHoveredCommentId(image._id)}
                    onMouseLeave={() => setHoveredCommentId(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                          setEditingId?.(image._id);
                          setTempComment?.((prev) => ({
                            ...prev,
                            [image._id]: image.comment || "",
                          }));
                        }}
                  >
                    {editingId === image._id ? (
                      <input
                        autoFocus
                        value={tempComment?.[image._id] || ""}
                        onChange={(e) =>
                          setTempComment?.((prev) => ({ ...prev, [image._id]: e.target.value }))
                        }
                        onBlur={() => onUpdateComment?.(image._id, tempComment?.[image._id] || "")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onUpdateComment?.(image._id, tempComment?.[image._id] || "");
                          }
                        }}
                        className="w-full border p-1 rounded text-xs"
                      />
                    ) : (
                      <div
                        
                        className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                      >
                        <div className="flex items-start gap-1">
                          <i className="fas fa-comment text-gray-400 mt-0.5" />
                          <p className="whitespace-pre-wrap break-words text-gray-700 text-xs">
                            {image.comment || (
                              <span className="italic text-gray-400">Add a comment</span>
                            )}
                          </p>
                          
                            {hoveredCommentId === (image as any)._id && (
                              <i className="fas fa-pen ml-auto text-gray-400 text-xs mt-1" />
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}


              </div>
              {/* <div
              key={image._id}
              className="relative cursor-pointer bg-gray-100 overflow-hidden mb-1 break-inside-avoid"
              style={{
                // flex: "1 1 180px",   // each item at least 180px wide, shrink/grow as needed
                // flex: "0 1 180px",
                flex: `0 1 ${minWidth}px`,
                minWidth: `${minWidth}px`,
                maxWidth: `${maxWidth}px`,
                // 🚀 don’t grow/shrink
                // width: `${width || 180}px`,     // <- you can add `width` as a prop
                height: `${heightClass || height}px`,
              }}
              // style={{ height: `${heightClass || height}px` }}
              onClick={() => openPopup(index)}
            >
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />

              
            </div>

             <div
              key={image._id}
              className="relative cursor-pointer bg-gray-100 overflow-hidden mb-1 break-inside-avoid"
              style={{
                // flex: "1 1 180px",   // each item at least 180px wide, shrink/grow as needed
                // flex: "0 1 180px",
                flex: `0 1 ${minWidth}px`,
                minWidth: `${minWidth}px`,
                maxWidth: `${maxWidth}px`,
                // 🚀 don’t grow/shrink
                // width: `${width || 180}px`,     // <- you can add `width` as a prop
                height: `${heightClass || height}px`,
              }}
              // style={{ height: `${heightClass || height}px` }}
              onClick={() => openPopup(index)}
            >
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />

              
            </div>

             <div
              key={image._id}
              className="relative cursor-pointer bg-gray-100 overflow-hidden mb-1 break-inside-avoid"
              style={{
                // flex: "1 1 180px",   // each item at least 180px wide, shrink/grow as needed
                // flex: "0 1 180px",
                flex: `0 1 ${minWidth}px`,
                minWidth: `${minWidth}px`,
                maxWidth: `${maxWidth}px`,
                // 🚀 don’t grow/shrink
                // width: `${width || 180}px`,     // <- you can add `width` as a prop
                height: `${heightClass || height}px`,
              }}
              // style={{ height: `${heightClass || height}px` }}
              onClick={() => openPopup(index)}
            >
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />

              
            </div>


             <div
              key={image._id}
              className="relative cursor-pointer bg-gray-100 overflow-hidden mb-1 break-inside-avoid"
              style={{
                // flex: "1 1 180px",   // each item at least 180px wide, shrink/grow as needed
                // flex: "0 1 180px",
                flex: `0 1 ${minWidth}px`,
                minWidth: `${minWidth}px`,
                maxWidth: `${maxWidth}px`,
                // 🚀 don’t grow/shrink
                // width: `${width || 180}px`,     // <- you can add `width` as a prop
                height: `${heightClass || height}px`,
              }}
              // style={{ height: `${heightClass || height}px` }}
              onClick={() => openPopup(index)}
            >
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />
              <img
                src={image?.url || NO_IMAGE}
                alt={image?.originalName || `Image ${index + 1}`}
                className="w-full cursor-pointer h-full object-cover"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                }}
              />

              
            </div> */}

            </>
          )
        })}
      </div >

      {/* Popup Modal */}
      {
        isPopupOpen && currentImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
            onClick={handleBackgroundClick}
            style={{ margin: 0, padding: 0 }}
          >
            <div className="absolute top-6 right-6 z-[10000] flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(currentImage)
                }}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                title="Download"
              >
                <i className="fas fa-download text-lg"></i>
              </button>

              {onDelete && <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(currentImage._id)
                }}
                className="bg-black/50 hover:bg-red-600/70 text-white rounded-full p-3 transition-all duration-200"
                title="Delete"
                disabled={isDeleting}
              >
                <i className={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash-can"} text-lg`}></i>
              </button>}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closePopup()
                }}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                title="Close"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Navigation Arrows */}
            {(
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-[10000] bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
              >
                <i className="fas fa-chevron-left text-2xl"></i>
              </button>
            )}

            {(
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-[10000] bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
              >
                <i className="fas fa-chevron-right text-2xl"></i>
              </button>
            )}

            <div
              className="relative flex items-center justify-center"
              style={{
                width: "70vw",
                height: "70vh",
                maxWidth: "70vw",
                maxHeight: "70vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage?.url || NO_IMAGE}
                alt={currentImage.originalName || `Image ${selectedImageIndex !== null ? selectedImageIndex + 1 : 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* ✅ Show comments only if enabled */}
              {isComments && (
                <div className="absolute bottom-0 w-full bg-black/40 text-white text-xs p-1">
                  {currentImage?.comment || "No comments yet"}
                </div>
              )}

            </div>


            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {selectedImageIndex !== null ? selectedImageIndex + 1 : 1} of {images.length}
            </div>
          </div>, document.body
        )
      }
    </>
  )
}


// Example usage component

export default function ImageGalleryExample({ imageFiles = [], height, refetch, handleDeleteFile,
  className = "", minWidth, maxWidth,

  isComments = false,
  editingId,
  tempComment,
  setEditingId,
  setTempComment,
  onUpdateComment
}:
  {
    isComments?: boolean, height: number, imageFiles: any,
    handleDeleteFile?: (...args: any[]) => any, refetch?: () => Promise<any>, className?: string,
    minWidth?: number, maxWidth?: number,

    editingId?: string | null;
    tempComment?: Record<string, string>;
    setEditingId?: (id: string | null) => void;
    setTempComment?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onUpdateComment?: (imageId: string, newComment: string) => void;

  }) {
  // console.log("imageFiles", imageFiles)
  return (
    // <div className="p-6">
    <>
      {/* <h2 className="text-2xl font-bold mb-6">Image Gallery Example</h2> */}
      <ImageGallery
        images={imageFiles}
        onDelete={handleDeleteFile}
        onDownload={downloadImage}
        refetch={refetch}
        isDeleting={false}
        className={className}
        heightClass={height}
        minWidth={minWidth}
        maxWidth={maxWidth}
        isComments={isComments}


        editingId={editingId}
        tempComment={tempComment}
        setEditingId={setEditingId}
        setTempComment={setTempComment}
        onUpdateComment={onUpdateComment}
      />

    </>
    // </div>
  )
}
