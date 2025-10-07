import { useState, useEffect, useRef } from "react"
import { NO_IMAGE } from "../../constants/constants"
import { createPortal } from "react-dom"
import { toast } from "../../utils/toast"

interface ImageFile {
    _id: string
    url: string
    originalName?: string
    comment?: string
}

export interface DetectedArea {
    id?: string;
    class: string;
    score: number;
    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    color?: string;
}

interface ImageGalleryProps {
    images: ImageFile[]
    onDownload?: (params: { src: string; alt: string }) => Promise<any>
    onDelete?: (fieldId: string) => Promise<any> | undefined
    isDeleting?: boolean
    refetch?: () => void
    minWidth?: number,
    maxWidth?: number,
    className?: string,
    heightClass?: number,
    showSelectButton?: boolean;
    onToggleSelect?: (image: ImageFile, isSelected: boolean) => void;
    isSelected?: (image: ImageFile) => boolean;
    onImageClick?: (image: ImageFile) => void
    portalId?: string
    setActivePopupType: React.Dispatch<React.SetStateAction<"reference" | "site" | null>>
    activePopupType: "reference" | "site" | null
    controlledType: "reference" | "site";
    selectedSiteImage?: ImageFile,
    showSiteSelectButton?: boolean;
    onSiteImageConfirm?: (e: any, image: ImageFile) => void;
    onPopupOpenChange?: (isOpen: boolean) => void;

    // NEW PROPS FOR MANUAL SELECTION
    selectedMicaImage?: ImageFile | null;
    onDetectionComplete?: (areas: DetectedArea[]) => void;
    applyMicaToDetectedAreas?: boolean;
    onAreasSelected?: (areas: DetectedArea[]) => void; // NEW: Manual area selection
    selectedAreas?: DetectedArea[]; // NEW: Current selected areas
    enableManualSelection?: boolean; // NEW: Enable drawing tools
}

export function ShortListImageMicaGallery({
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
    onImageClick,
    portalId,
    controlledType,
    activePopupType,
    setActivePopupType,
    selectedSiteImage,
    showSiteSelectButton,
    onSiteImageConfirm,
    onPopupOpenChange,

    // NEW PROPS
    selectedMicaImage = null,
    onDetectionComplete,
    applyMicaToDetectedAreas = false,
    onAreasSelected,
    selectedAreas = [],
    enableManualSelection = false
}: ImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({})
    // const [detectedAreas, setDetectedAreas] = useState<DetectedArea[]>([])
    // const [isDetecting, setIsDetecting] = useState(false)
    const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)

    // MANUAL SELECTION STATE
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentArea, setCurrentArea] = useState<DetectedArea | null>(null)
    const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const popupImageRef = useRef<HTMLImageElement>(null)

    const handleImageLoad = (imageId: string, naturalWidth: number, naturalHeight: number) => {
        const aspectRatio = naturalHeight / naturalWidth
        const baseWidth = 200
        const calculatedHeight = Math.max(150, Math.min(400, baseWidth * aspectRatio))

        setImageHeights((prev) => ({
            ...prev,
            [imageId]: calculatedHeight,
        }))
    }

    // MANUAL SELECTION FUNCTIONS
    const startDrawing = (e: React.MouseEvent) => {
        if (!enableManualSelection || controlledType !== 'site') return

        const img = popupImageRef.current
        if (!img) return

        const rect = img.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setIsDrawing(true)
        setStartPoint({ x, y })
        setCurrentArea({
            class: 'custom',
            score: 1.0,
            bbox: { x, y, width: 0, height: 0 },
            color: getRandomColor()
        })
    }

    const updateDrawing = (e: React.MouseEvent) => {
        if (!isDrawing || !startPoint || !currentArea) return

        const img = popupImageRef.current
        if (!img) return

        const rect = img.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        const width = currentX - startPoint.x
        const height = currentY - startPoint.y

        setCurrentArea({
            ...currentArea,
            bbox: {
                x: width < 0 ? currentX : startPoint.x,
                y: height < 0 ? currentY : startPoint.y,
                width: Math.abs(width),
                height: Math.abs(height)
            }
        })
    }

    const finishDrawing = () => {
        if (currentArea && currentArea.bbox.width > 10 && currentArea.bbox.height > 10) {
            const newArea = {
                ...currentArea,
                id: `area-${Date.now()}`
            }

            const updatedAreas = [...selectedAreas, newArea]
            onAreasSelected?.(updatedAreas)
            toast({ title: "Area Added", description: "New area selected successfully" })
        }

        setIsDrawing(false)
        setCurrentArea(null)
        setStartPoint(null)
    }

    const removeArea = (areaId: string) => {
        const updatedAreas = selectedAreas.filter(area => area.id !== areaId)
        onAreasSelected?.(updatedAreas)
    }


    // Function to apply MICA material to selected areas
    // Add this function to apply MICA material to selected areas
// const applyMicaToSelectedAreas = async () => {
//     if (selectedAreas.length === 0) {
//         alert("Please select areas first!");
//         return;
//     }

//     if (!selectedMicaImage) {
//         alert("Please select a MICA material first!");
//         return;
//     }

//     if (!selectedSiteImage) {
//         alert("Please select a site image first!");
//         return;
//     }

//     try {
//         // Apply MICA to each selected area
//         await applyMicaMaterial(selectedSiteImage.url, selectedMicaImage.url, selectedAreas);
        
//         console.log("MICA material applied to", selectedAreas.length, "areas");
//         toast({ title: "Success", description: `MICA applied to ${selectedAreas.length} areas` });
//     } catch (error:any) {
//         console.error('Error applying MICA:', error);
//         toast({ title: "Error", description: error?.message || "Failed to apply MICA material", variant: "destructive" });
//     }
// };

// Enhanced MICA application function
// const applyMicaMaterial = async (siteImageUrl: string, micaImageUrl: string, areas: DetectedArea[]) => {
//     try {
//         const canvas = canvasRef.current;
//         if (!canvas) throw new Error('Canvas not available');

//         const ctx = canvas.getContext('2d');
//         if (!ctx) throw new Error('Canvas context not available');

//         // Load site image
//         const siteImg = new Image();
//         siteImg.crossOrigin = "anonymous";

//         return new Promise((resolve, reject) => {
//             siteImg.onload = () => {
//                 // Set canvas size to match site image
//                 canvas.width = siteImg.width;
//                 canvas.height = siteImg.height;

//                 // Draw original site image
//                 ctx.drawImage(siteImg, 0, 0);

//                 // Load mica material
//                 const micaImg = new Image();
//                 micaImg.crossOrigin = "anonymous";

//                 micaImg.onload = () => {
//                     try {
//                         // Apply mica material to each selected area
//                         areas.forEach(area => {
//                             ctx.save();

//                             // Create clipping path for the selected area
//                             ctx.beginPath();
//                             ctx.rect(area.bbox.x, area.bbox.y, area.bbox.width, area.bbox.height);
//                             ctx.clip();

//                             // Draw mica material pattern in the selected area
//                             const pattern = ctx.createPattern(micaImg, 'repeat');
//                             if (pattern) {
//                                 ctx.fillStyle = pattern;
//                                 ctx.fillRect(area.bbox.x, area.bbox.y, area.bbox.width, area.bbox.height);
//                             }

//                             // Optional: Add border to show applied area
//                             ctx.strokeStyle = '#00ff00';
//                             ctx.lineWidth = 2;
//                             ctx.strokeRect(area.bbox.x, area.bbox.y, area.bbox.width, area.bbox.height);

//                             ctx.restore();
//                         });

//                         // Convert canvas to data URL for display
//                         const processedUrl = canvas.toDataURL('image/jpeg');
//                         setProcessedImageUrl(processedUrl);

//                         resolve(processedUrl);
//                     } catch (error) {
//                         reject(error);
//                     }
//                 };

//                 micaImg.onerror = () => reject(new Error('Failed to load MICA image'));
//                 micaImg.src = micaImageUrl;
//             };

//             siteImg.onerror = () => reject(new Error('Failed to load site image'));
//             siteImg.src = siteImageUrl;
//         });

//     } catch (error) {
//         console.error('Error applying mica:', error);
//         throw error;
//     }
// };

const applyMicaToSelectedAreas = async () => {
    if (selectedAreas.length === 0) {
        alert("Please select areas first!");
        return;
    }

    if (!selectedMicaImage) {
        alert("Please select a MICA material first!");
        return;
    }

    if (!selectedSiteImage) {
        alert("Please select a site image first!");
        return;
    }

    try {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not available');

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        // Get the site image element that's already loaded in DOM
        const siteImgElement = popupImageRef.current;
        if (!siteImgElement) throw new Error('Site image not found');

        // Find MICA image in the DOM or create from data
        let micaImgElement: HTMLImageElement | null = null;
        
        // Try to find MICA image in the gallery
        const micaImageInGallery = document.querySelector(`img[src="${selectedMicaImage.url}"]`) as HTMLImageElement;
        if (micaImageInGallery) {
            micaImgElement = micaImageInGallery;
        } else {
            // Create new image if not found in DOM
            micaImgElement = new Image();
            micaImgElement.src = selectedMicaImage.url;
        }

        // Wait for MICA image to load if needed
        await new Promise((resolve, reject) => {
            if (micaImgElement!.complete) {
                resolve(true);
            } else {
                micaImgElement!.onload = () => resolve(true);
                micaImgElement!.onerror = () => reject(new Error('MICA image failed to load'));
            }
        });

        // Set canvas size to match site image
        canvas.width = siteImgElement.naturalWidth;
        canvas.height = siteImgElement.naturalHeight;

        // Draw original site image
        ctx.drawImage(siteImgElement, 0, 0);

        // Apply mica material to each selected area
        selectedAreas.forEach(area => {
            ctx.save();

            // Create clipping path for the selected area
            ctx.beginPath();
            ctx.rect(area.bbox.x, area.bbox.y, area.bbox.width, area.bbox.height);
            ctx.clip();

            // Draw mica material pattern in the selected area
            const pattern = ctx.createPattern(micaImgElement!, 'repeat');
            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(area.bbox.x, area.bbox.y, area.bbox.width, area.bbox.height);
            }

            // Optional: Add border to show applied area
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(area.bbox.x, area.bbox.y, area.bbox.width, area.bbox.height);

            ctx.restore();
        });

        // Convert canvas to data URL for display
        const processedUrl = canvas.toDataURL('image/jpeg');
        setProcessedImageUrl(processedUrl);

        console.log("MICA material applied to", selectedAreas.length, "areas");
        toast({ title: "Success", description: `MICA applied to ${selectedAreas.length} areas` });

    } catch (error: any) {
        console.error('Error applying MICA:', error);
        toast({ title: "Error", description: error?.message || "Failed to apply MICA material", variant: "destructive" });
    }
};

// Function to clear all selections
const clearAllSelections = () => {
    onAreasSelected?.([]);
    toast({ title: "Cleared", description: "All areas cleared" });
};



// Function to download processed image
// const downloadProcessedImage = () => {
//     if (!processedImageUrl) {
//         alert("No processed image available!");
//         return;
//     }
    
//     downloadImage(processedImageUrl, `mica-applied-${Date.now()}.jpg`);
// };
    
    const getRandomColor = () => {
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    // Existing detection functions (keep them for now)
    useEffect(() => {
        if (controlledType === 'site' && selectedSiteImage && applyMicaToDetectedAreas) {
            detectObjects(selectedSiteImage.url);
        }
    }, [selectedSiteImage, controlledType, applyMicaToDetectedAreas])

    const detectObjects = async (imageUrl: string) => {
        // setIsDetecting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/detection/detect-areas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });

            if (!response.ok) throw new Error('Detection failed');
            const result = await response.json();
            const areas = result.detectedAreas || [];
            // setDetectedAreas(areas);
            onDetectionComplete?.(areas);

            if (areas.length === 0) {
                toast({ title: "Info", description: "No objects detected in this image" });
            } else {
                toast({ title: "Success", description: `Detected ${areas.length} objects` });
            }
        } catch (error: any) {
            console.error('Detection error:', error);
            toast({ title: "Error", description: "Failed to detect objects", variant: "destructive" });
        } 
        // finally {
        //     // setIsDetecting(false);
        // }
    };

    const openPopup = (index: number) => {
        setSelectedImageIndex(index)
        setIsPopupOpen(true)
        onPopupOpenChange?.(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false)
        setSelectedImageIndex(null)
        onPopupOpenChange?.(false);
    }

    const goToPrevious = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
        }
    };

    const goToNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        }
    };

    useEffect(() => {
        if (!isPopupOpen || controlledType !== activePopupType) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closePopup();
            } else if (e.key === "ArrowRight") {
                goToNext();
            } else if (e.key === "ArrowLeft") {
                goToPrevious();
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
        onDownload?.({
            src: image?.url,
            alt: image?.originalName || "image",
        })
    }

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closePopup()
        }
    }

    const currentImage = selectedImageIndex !== null && selectedImageIndex >= 0 && selectedImageIndex < images.length
        ? images[selectedImageIndex]
        : null

    // const getPopupImageUrl = () => {
    //     if (controlledType === 'site' && processedImageUrl && currentImage?._id === selectedSiteImage?._id) {
    //         return processedImageUrl;
    //     }
    //     return currentImage?.url || NO_IMAGE;
    // }


    // Enhanced getPopupImageUrl function
const getPopupImageUrl = () => {
    // Show processed image if available and we're viewing the selected site image
    if (controlledType === 'site' && processedImageUrl && currentImage?._id === selectedSiteImage?._id) {
        return processedImageUrl;
    }
    return currentImage?.url || NO_IMAGE;
};

    return (
        <>
            <div className={`gap-1 flex flex-wrap ${className}`}>
                {images?.map((image, index) => {
                    const height = imageHeights[image._id] || 200
                    return (
                        <div
                            key={image._id}
                            className={`relative cursor-pointer bg-gray-100 mb-1 break-inside-avoid border-2 transition-all ${controlledType === 'site' && selectedSiteImage?._id === image._id
                                    ? 'border-blue-500 border-2'
                                    : 'border-transparent'
                                }`}
                            style={{
                                flex: `0 1 ${minWidth}px`,
                                minWidth: `${minWidth}px`,
                                maxWidth: `${maxWidth}px`,
                                height: `${heightClass || height}px`,
                            }}
                            onClick={() => {
                                openPopup(index)
                                onImageClick?.(image);
                                setActivePopupType(controlledType);
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

                            {/* Show selected areas count */}
                            {enableManualSelection && controlledType === 'site' && selectedSiteImage?._id === image._id && selectedAreas.length > 0 && (
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    {selectedAreas.length} areas
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Enhanced Popup with Manual Selection */}
            {isPopupOpen && currentImage &&
                createPortal(
                    <div
                        className="absolute inset-0 bg-black/90 text-white p-4 z-50 flex items-center justify-center"
                        onClick={handleBackgroundClick}
                        style={{ margin: 0, padding: 0, zIndex: 1000 }}
                    >
                        <div className="absolute top-6 right-6 z-[10000] flex items-center gap-4">
                            {/* Manual Selection Toggle */}
                            {enableManualSelection && controlledType === 'site' && (
                                <div className="bg-black/70 rounded-full px-3 py-2">
                                    <span className="text-sm mr-2">🎯</span>
                                    <span className="text-sm">{selectedAreas.length} areas</span>
                                </div>
                            )}

                            {/* Add these buttons to the popup controls */}
{enableManualSelection && controlledType === 'site' && selectedAreas.length > 0 && (
    <>
        <button
            onClick={(e) => {
                e.stopPropagation();
                applyMicaToSelectedAreas();
            }}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 transition-all duration-200"
            title="Apply MICA to selected areas"
            disabled={!selectedMicaImage}
        >
            <i className="fas fa-paint-roller text-lg"></i>
        </button>

        <button
            onClick={(e) => {
                e.stopPropagation();
                clearAllSelections();
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-3 transition-all duration-200"
            title="Clear all selections"
        >
            <i className="fas fa-broom text-lg"></i>
        </button>
    </>
)}

{/* {processedImageUrl && (
    <button
        onClick={(e) => {
            e.stopPropagation();
            downloadProcessedImage();
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 transition-all duration-200"
        title="Download processed image"
    >
        <i className="fas fa-file-download text-lg"></i>
    </button>
)} */}

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

                            {showSelectButton && onToggleSelect && currentImage && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const selected = isSelected?.(currentImage) ?? false;
                                        onToggleSelect(currentImage, !selected);
                                    }}
                                    className={`${isSelected?.(currentImage) ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-full p-3 transition-all duration-200`}
                                    title={isSelected?.(currentImage) ? "Unselect this image" : "Select this image"}
                                >
                                    <i className={`fas ${isSelected?.(currentImage) ? "fa-xmark" : "fa-check"} text-lg`}></i>
                                </button>
                            )}

                            {showSiteSelectButton && (
                                <button
                                    onClick={(e) => onSiteImageConfirm?.(e, currentImage)}
                                    className={`${selectedSiteImage?._id === currentImage._id
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        } text-white rounded-full p-3 transition-all duration-200`}
                                    title={selectedSiteImage?._id === currentImage._id ? "Unselect this site image" : "Select this site image"}
                                >
                                    <i className={`fas ${selectedSiteImage?._id === currentImage._id ? "fa-xmark" : "fa-check"} text-lg`}></i>
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
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToPrevious()
                            }}
                            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-[10000] bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                        >
                            <i className="fas fa-chevron-left text-2xl"></i>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToNext()
                            }}
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-[10000] bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                        >
                            <i className="fas fa-chevron-right text-2xl"></i>
                        </button>

                        {/* Image Container with Manual Selection */}
                        <div
                            className="relative flex items-center justify-center"
                            style={{
                                width: "70vw",
                                height: "70vh",
                                maxWidth: "70vw",
                                maxHeight: "70vh",
                            }}
                        >
                            <img
                                ref={popupImageRef}
                                src={getPopupImageUrl()}
                                alt={currentImage.originalName || `Image ${selectedImageIndex !== null ? selectedImageIndex + 1 : 1}`}
                                className="max-w-full max-h-full object-contain cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={updateDrawing}
                                onMouseUp={finishDrawing}
                                onMouseLeave={finishDrawing}
                            />

                            {/* Current Drawing Area */}
                            {currentArea && (
                                <div
                                    className="absolute border-2 border-dashed border-yellow-400 bg-yellow-400/20"
                                    style={{
                                        left: `${currentArea.bbox.x}px`,
                                        top: `${currentArea.bbox.y}px`,
                                        width: `${currentArea.bbox.width}px`,
                                        height: `${currentArea.bbox.height}px`,
                                    }}
                                >
                                    <span className="absolute -top-6 left-0 text-xs bg-yellow-400 text-black px-1 rounded">
                                        New Area
                                    </span>
                                </div>
                            )}

                            {/* Selected Areas Overlay */}
                            {enableManualSelection && controlledType === 'site' && selectedAreas.map((area, idx) => (
                                <div
                                    key={area.id || idx}
                                    className="absolute border-2 border-dashed cursor-pointer group"
                                    style={{
                                        left: `${area.bbox.x}px`,
                                        top: `${area.bbox.y}px`,
                                        width: `${area.bbox.width}px`,
                                        height: `${area.bbox.height}px`,
                                        borderColor: area.color || '#3B82F6',
                                        backgroundColor: `${area.color || '#3B82F6'}20`
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeArea(area.id!)
                                    }}
                                >
                                    <span className="absolute -top-6 left-0 text-xs bg-black/70 text-white px-1 rounded group-hover:bg-red-500">
                                        {area.class} ×
                                    </span>
                                </div>
                            ))}

                            {/* Instructions */}
                            {enableManualSelection && controlledType === 'site' && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                    🖱️ Click & drag to select areas • Click areas to remove
                                </div>
                            )}
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {selectedImageIndex !== null ? selectedImageIndex + 1 : 1} of {images.length}
                        </div>
                    </div>,
                    document.getElementById(portalId!)!
                )
            }

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
    )
}


// so now we need to make sure that the user should able to select in this poupitself all the tools that is required for selcting the image should be in the poup itself , and for the selected objects the mica should be applied in that objects so we dont need to
// 