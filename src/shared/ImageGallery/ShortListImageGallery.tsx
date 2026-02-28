import { useState, useEffect } from "react"

import { NO_IMAGE } from "../../constants/constants"
import { downloadImage } from "../../utils/downloadFile"
import { createPortal } from "react-dom"


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
    showSelectButton?: boolean; // new
    onToggleSelect?: (image: ImageFile, isSelected: boolean) => void; // new
    isSelected?: (image: ImageFile) => boolean; // new
    onImageClick?: (image: ImageFile) => void // ✅ ✅ ADD THIS
    portalId?: string
    setActivePopupType: React.Dispatch<React.SetStateAction<"reference" | "site" | null>>
    activePopupType: "reference" | "site" | null
    controlledType: "reference" | "site"; // 👈 this must be set per usage

    selectedSiteImage?: ImageFile,
    showSiteSelectButton?: boolean;
    onSiteImageConfirm?: (e: any, image: ImageFile) => void;
    onPopupOpenChange?: (isOpen: boolean) => void;
}

export function ShortListImageGallerySub({
    images,
    onDelete,
    onDownload,
    isDeleting = false,
    refetch,
    className = "",
    minWidth = 100,
    maxWidth = 100,
    heightClass = 0,
    showSelectButton,
    onToggleSelect,
    isSelected,
    onImageClick, // <-- ✅ add this
    portalId,
    controlledType,
    activePopupType,
    setActivePopupType,
    selectedSiteImage,
    showSiteSelectButton,
    onSiteImageConfirm,
    onPopupOpenChange


}: ImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

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
        onPopupOpenChange?.(true); // 👈 Notify parent

    }

    const closePopup = () => {
        setIsPopupOpen(false)
        setSelectedImageIndex(null)
        onPopupOpenChange?.(false); // 👈 Notify parent

    }

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


    useEffect(() => {

        if (!isPopupOpen || controlledType !== activePopupType) return;

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


    const currentImage =
        selectedImageIndex !== null && selectedImageIndex >= 0 && selectedImageIndex < images.length
            ? images[selectedImageIndex]
            : null


    // const width = 120

    return (
        <>

            <div
                className={`gap-1 flex flex-wrap ${className}`}
            >
                {images?.map((image, index) => {
                    const height = imageHeights[image._id] || 200
                    return (
                        <>
                            <div
                                key={image._id}
                                className={`relative cursor-pointer bg-gray-100  mb-1 break-inside-avoid `}
                                style={{
                                    flex: `0 1 ${minWidth}px`,
                                    minWidth: `${minWidth}px`,
                                    maxWidth: `${maxWidth}px`,
                                    height: `${heightClass || height}px`,

                                }}
                                onClick={() => {
                                    openPopup(index)
                                    onImageClick?.(image); // ✅ trigger site image selection
                                    setActivePopupType("reference");
                                }}
                            >
                                <img
                                    src={image?.url || NO_IMAGE}
                                    alt={image?.originalName || `Image ${index + 1}`}
                                    className={`w-full cursor-pointer h-full object-cover`}
                                    loading="lazy"
                                    onLoad={(e) => {
                                        const img = e.target as HTMLImageElement
                                        handleImageLoad(image._id, img.naturalWidth, img.naturalHeight)
                                    }}
                                />
                            </div>
                        </>
                    )
                })}
            </div >

            {/* Popup Modal */}
            {
                isPopupOpen && currentImage &&
                createPortal(
                    <div
                        // className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
                        // className="fixed w-1/2 h-[80vh]  bg-black/80 rounded-lg shadow-xl overflow-hidden text-white border-2"
                        className="absolute inset-0 bg-black/90 text-white p-4 z-50 flex items-center justify-center"
                        onClick={handleBackgroundClick}
                        // style={{ }}
                        style={{ margin: 0, padding: 0, zIndex: 1000 }}
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

                            {/* ✅ SELECT / UNSELECT Button */}
                            {/* {showSelectButton && onToggleSelect && currentImage && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const selected = isSelected?.(currentImage) ?? false;
                                        onToggleSelect(currentImage, !selected);
                                    }}
                                    className={`bg-${isSelected?.(currentImage) ? "red" : "green"}-600 cursor-pointer hover:bg-${isSelected?.(currentImage) ? "red" : "green"}-700 text-white rounded-full p-1 transition-all duration-200`}
                                    title={isSelected?.(currentImage) ? "Unselect this image" : "Select this image"}
                                >
                                    <i className={`fas ${isSelected?.(currentImage) ? "fa-xmark" : "fa-check"} text-lg`}></i>
                                   
                                </button>
                            )} */}

                            {showSelectButton && onToggleSelect && currentImage && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const selected = isSelected?.(currentImage) ?? false;
                                        onToggleSelect(currentImage, !selected);
                                    }}
                                    className={`
      flex items-center gap-2 px-5 py-2 cursor-pointer rounded-md 
      transition-all duration-300 ease-in-out border backdrop-blur-md
      ${isSelected?.(currentImage)
                                            ? "bg-red-500/90 border-red-400 text-white shadow-lg shadow-red-900/30"
                                            : "bg-green-600 border-white/20 text-white hover:bg-green-600/80 hover:border-green-400"
                                        }
    `}
                                    title={isSelected?.(currentImage) ? "Unselect this image" : "Select this image"}
                                >
                                    <div className="flex items-center justify-center">
                                        <i className={`fas ${isSelected?.(currentImage) ? "fa-circle-minus" : "fa-circle-plus"
                                            } text-sm`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest">
                                        {isSelected?.(currentImage) ? "Unselect" : "Select"}
                                    </span>
                                </button>
                            )}


                            {/* {showSiteSelectButton && (
                                <button
                                    onClick={(e) => onSiteImageConfirm?.(e, currentImage)}
                                    className={`${selectedSiteImage?._id === currentImage._id
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        } text-white rounded-full p-1 cursor-pointer transition-all duration-200`}
                                    title={
                                        selectedSiteImage?._id === currentImage._id
                                            ? "Unselect this site image"
                                            : "Select this site image"
                                    }
                                >
                                    <i
                                        className={`fas ${selectedSiteImage?._id === currentImage._id
                                            ? "fa-xmark"
                                            : "fa-check"
                                            } text-lg`}
                                    ></i>
                                </button>
                            )} */}


                            {showSiteSelectButton && (
                                <button
                                    onClick={(e) => onSiteImageConfirm?.(e, currentImage)}
                                    
                                    className={`
      flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md 
      transition-all duration-300 ease-in-out border backdrop-blur-sm
      ${selectedSiteImage?._id === currentImage._id
                                            ? "bg-red-500/90 border-red-400 text-white shadow-lg shadow-red-900/20"
                                            : "bg-green-600 border-white/20 text-white hover:bg-green-600/80 hover:border-green-400"
                                        }
    `}
                                    title={selectedSiteImage?._id === currentImage._id ? "Unselect this image" : "Select this image"}
                                >
                                    <div className="relative flex items-center justify-center">
                                        {/* Icon with a subtle pulse if selected */}
                                        <i className={`fas ${selectedSiteImage?._id === currentImage._id ? "fa-circle-xmark" : "fa-circle-plus"
                                            } text-sm`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">
                                        {selectedSiteImage?._id === currentImage._id ? "Unselect" : "Select"}
                                    </span>
                                </button>
                            )}

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
                            onClick={(e) => {
                                e.stopPropagation()
                                setActivePopupType(controlledType)
                            }
                            }
                        >
                            <img
                                src={currentImage?.url || NO_IMAGE}
                                alt={currentImage.originalName || `Image ${selectedImageIndex !== null ? selectedImageIndex + 1 : 1}`}
                                className="max-w-full max-h-full object-contain"
                            />



                        </div>


                        {/* Image Counter */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {selectedImageIndex !== null ? selectedImageIndex + 1 : 1} of {images.length}
                        </div>
                    </div>
                    // , document.body
                    , document.getElementById(portalId!)!
                )
            }
        </>
    )
}



export default function ShortListImageGallery({ imageFiles = [], height, refetch, handleDeleteFile,
    className = "", minWidth, maxWidth,
    isSelected, onToggleSelect, showSelectButton, onImageClick, portalId,
    setActivePopupType,
    activePopupType,
    controlledType,
    showSiteSelectButton,
    onSiteImageConfirm,
    selecteSiteImage,
    onPopupOpenChange
}:
    {
        height: number,
        imageFiles: any,
        handleDeleteFile?: (...args: any[]) => any,
        refetch?: () => Promise<any>,
        className?: string,
        minWidth?: number,
        maxWidth?: number,
        showSelectButton?: boolean; // new
        onToggleSelect?: (image: ImageFile, isSelected: boolean) => void; // new
        isSelected?: (image: ImageFile) => boolean; // new
        onImageClick?: (image: ImageFile) => void // ✅ ✅ ADD THIS
        portalId: string,
        setActivePopupType: React.Dispatch<React.SetStateAction<"reference" | "site" | null>>
        activePopupType: "reference" | "site" | null
        controlledType: "reference" | "site"; // 👈 this must be set per usage
        selecteSiteImage?: ImageFile;
        showSiteSelectButton?: boolean;
        onSiteImageConfirm?: (e: any, image: ImageFile) => void;
        onPopupOpenChange?: (isOpen: boolean) => void;

    }) {
    return (
        <>
            <ShortListImageGallerySub
                images={imageFiles}
                onDelete={handleDeleteFile}
                onDownload={downloadImage}
                refetch={refetch}
                isDeleting={false}
                className={className}
                heightClass={height}
                minWidth={minWidth}
                maxWidth={maxWidth}
                showSelectButton={showSelectButton}
                onToggleSelect={onToggleSelect}
                isSelected={isSelected}
                onImageClick={onImageClick}
                portalId={portalId}
                setActivePopupType={setActivePopupType}
                activePopupType={activePopupType}
                controlledType={controlledType}
                selectedSiteImage={selecteSiteImage}
                showSiteSelectButton={showSiteSelectButton}
                onSiteImageConfirm={onSiteImageConfirm}
                onPopupOpenChange={onPopupOpenChange}
            />

        </>
    )
}
