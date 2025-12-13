import React, { useEffect, useRef, useState } from "react";
import { downloadImage } from "../../utils/downloadFile";
import { createPortal } from "react-dom";

interface VideoFile {
    _id?: string;
    url: string;
    originalName: string;
    uploadedAt: string;
}

interface VideoGalleryProps {
    videoFiles: VideoFile[];
    handleDeleteFile?: (fileId: string) => any;
    refetch: () => Promise<any>;
    isDeleting?: boolean;

    minWidth: number,
    maxWidth: number,
    className?: string,
    height: number,


}

const VideoGalleryMain: React.FC<VideoGalleryProps> = ({
    videoFiles,
    handleDeleteFile,
    isDeleting,
    className = "",
    minWidth = 100,
    maxWidth = 100,
    height = 0,
}) => {
    const [previewVideo, setPreviewVideo] = useState<{ url: string, index: number } | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({})
    // const handleImageLoad = (imageId: string, naturalWidth: number, naturalHeight: number) => {
    //     const aspectRatio = naturalHeight / naturalWidth
    //     const baseWidth = 200 // Base width for calculation
    //     const calculatedHeight = Math.max(150, Math.min(400, baseWidth * aspectRatio))

    //     setImageHeights((prev) => ({
    //         ...prev,
    //         [imageId]: calculatedHeight,
    //     }))
    // }

    const closePopup = () => setPreviewVideo(null);

    const goToNext = () => {
        if (previewVideo) {
            const nextIndex = (previewVideo.index + 1) % videoFiles.length;
            setPreviewVideo({ url: videoFiles[nextIndex].url, index: nextIndex });
        }
    };

    const goToPrevious = () => {
        if (previewVideo) {
            const prevIndex = (previewVideo.index - 1 + videoFiles.length) % videoFiles.length;
            setPreviewVideo({ url: videoFiles[prevIndex].url, index: prevIndex });
        }
    };


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!previewVideo) return;

            if (previewVideo) {
                videoRef.current?.focus()
            }

            if (e.key === "Escape") {
                closePopup();
            } else if (e.key === "ArrowRight") {
                goToNext();
            } else if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === " ") {
                e.preventDefault(); // prevent page scroll
                if (videoRef.current) {
                    if (videoRef.current.paused) {
                        videoRef.current.play();
                    } else {
                        videoRef.current.pause();
                    }
                }
            }
        };

        if (previewVideo) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [previewVideo, goToNext, goToPrevious]);


    return (
        <div>
            <div className={`gap-1 flex flex-wrap ${className}`}>
                {videoFiles.map((file, idx) => {
                    // const height = imageHeights[(file as any)._id] || 200
                    return (
                        <div
                            key={file._id}
                            // className="relative cursor-pointer group"
                            className="relative cursor-pointer bg-gray-100 overflow-hidden mb-2"
                            style={{
                                // flex: "1 1 180px",   // each item at least 180px wide, shrink/grow as needed
                                flex: `0 1 ${minWidth}px`,
                                minWidth: `${minWidth}px`,
                                maxWidth: `${maxWidth}px`,
                                height: `${height}px`,

                            }}
                            onClick={() => setPreviewVideo({ url: file.url, index: idx })}
                        // onClick={() => setPreviewVideo({ url: file.url, index: idx })}
                        >
                            <video
                                src={file.url}
                                className="w-full h-full object-cover rounded-lg shadow-md"
                                muted
                                playsInline
                                // onLoad={(e) => {
                                //     const img = e.target as HTMLImageElement
                                //     handleImageLoad((file as any)._id, img.naturalWidth, img.naturalHeight)
                                // }}
                            />
                            {/* <span className="block mt-1 text-sm text-center truncate font-medium">
                                {file.originalName}
                            </span> */}
                        </div>
                    )
                })}
            </div>

            {/* Video Preview Modal */}
            {previewVideo && createPortal(
                <div
                    onClick={() => setPreviewVideo(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                >

                    <div className="absolute top-1 right-6 z-[10000] flex items-center gap-4">
                        <div className="flex gap-3 mt-4">
                            <button
                                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    downloadImage({
                                        src: previewVideo.url,
                                        alt: videoFiles[previewVideo.index]?.originalName || "video.mp4",
                                    })
                                }
                                }
                            >
                                <i className="fa-solid fa-download"></i>
                            </button>
                          {handleDeleteFile &&  <button
                                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                                disabled={isDeleting}
                                onClick={(e) => {

                                    e.stopPropagation()
                                    handleDeleteFile((videoFiles[previewVideo.index] as any)._id)
                                    setPreviewVideo(null)
                                }
                                }
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>}

                            {/* Close Button */}
                            <button
                                onClick={() => setPreviewVideo(null)}
                                className=" bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                            >
                                ✕
                            </button>
                        </div>
                    </div>


                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-black rounded-lg shadow-lg max-w-[80%] max-h-[80%] p-4 flex flex-col items-center"
                    >
                        {/* Video Player */}
                        <video
                            src={previewVideo.url}
                            controls
                            autoPlay
                            className="w-[80vw] max-h-[70vh] object-contain rounded-lg"
                        />

                        {/* Action Buttons */}


                        {/* Navigation Arrows */}
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl"
                        >
                            ‹
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl"
                        >
                            ›
                        </button>
                    </div>
                </div>, document.body
            )
            }

        </div>

    )
}

export default VideoGalleryMain;

