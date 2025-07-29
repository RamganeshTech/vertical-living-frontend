// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "../../../../components/ui/Button"
// import {
//     useUploadShortlistedDesigns,
//     useRemoveShortlistedDesign,
//     useAddExistingShortlistedDesigns,
//     useGetShortlistedRoomDesigns,
// } from "../../../../apiList/Stage Api/shortListApi"
// import { toast } from "../../../../utils/toast"
// import { useGetRoomFiles } from "../../../../apiList/Stage Api/sampleDesignApi"
// import { useNavigate, useParams } from "react-router-dom"
// import { NO_IMAGE } from "../../../../constants/constants"
// import { useGetSiteMeasurementDetails } from "../../../../apiList/Stage Api/siteMeasurementApi"
// import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"

// const ShortlistMain = () => {
//     const { projectId } = useParams() as { projectId: string }
//     const [selectedRoom, setSelectedRoom] = useState<string>("Living Room")
//     const [selectedImages, setSelectedImages] = useState<any[]>([])
//     const [previewIndex, setPreviewIndex] = useState<number>(0)
//     const [previewImages, setPreviewImages] = useState<any[]>([])

//     const navigate = useNavigate()

//     const { data: sampleDesign } = useGetRoomFiles(projectId)
//     const uploadMutation = useUploadShortlistedDesigns()
//     const deleteMutation = useRemoveShortlistedDesign()
//     const addExistingMutation = useAddExistingShortlistedDesigns()
//     const {
//         data: shortlistedDesigns,
//         refetch,
//         isLoading: shortlistloading,
//     } = useGetShortlistedRoomDesigns({ projectId, roomName: selectedRoom! })

//     const {data:siteMeasure, isLoading:siteLoading} = useGetSiteMeasurementDetails({projectId})

//     const SampleDesignRooms = sampleDesign?.rooms.map((room: any) => room.roomName)
//     const currentRoom = sampleDesign?.rooms?.find((room: any) => room.roomName === selectedRoom)
//     const images = currentRoom?.files.filter((file: any) => file.type !== "pdf") || []


    

//     // useEffect(() => {
//     //     // CHANGE 1: Handle both cases - when images exist and when they don't
//     //     if (images.length > 0) {
//     //         const isSame =
//     //             previewImages.length === images.length && previewImages.every((img, idx) => img._id === images[idx]._id)
//     //         if (!isSame) {
//     //             setPreviewImages(images)
//     //             setPreviewIndex(0)
//     //         }
//     //     } else {
//     //         // CHANGE 2: Reset preview when no images available
//     //         setPreviewImages([])
//     //         setPreviewIndex(0)
//     //     }
//     // }, [selectedRoom, images])


//     useEffect(() => {
//     if (!siteMeasure || !selectedRoom) {
//         setPreviewImages([]);
//         setPreviewIndex(0);
//         return;
//     }

//     const room = siteMeasure.rooms?.find((r: any) => r.name === selectedRoom);
// // console.log("room form shortlist", room)
//     if (!room || !room.uploads || room.uploads.length === 0) {
//         setPreviewImages([]);
//         setPreviewIndex(0);
//         return;
//     }

//     const imageUploads = room.uploads.filter((upload: any) => upload.type === "image");

//     const isSame =
//         previewImages.length === imageUploads.length &&
//         previewImages.every((img, idx) => img._id === imageUploads[idx]._id);

//     if (!isSame) {
//         setPreviewImages(imageUploads);
//         setPreviewIndex(0);
//     }
// }, [selectedRoom, siteMeasure]);


//     if (shortlistloading  || siteLoading) {
//         return (
//            <MaterialOverviewLoading />
//         )
//     }

//     const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files || !selectedRoom) return
//         const formData = new FormData()
//         Array.from(e.target.files).forEach((file) => formData.append("file", file))
//         try {
//             await uploadMutation.mutateAsync({ projectId, roomName: selectedRoom, formData })
//             toast({ title: "Success", description: "Uploaded successfully" })
//             refetch()
//         } catch (error: any) {
//             toast({
//                 title: "Upload failed",
//                 description: error?.response?.data?.message || "Something went wrong",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleDelete = async (fileId: string) => {
//         try {
//             await deleteMutation.mutateAsync({ projectId, roomName: selectedRoom!, fileId })
//             toast({ title: "Success", description: "Deleted successfully" })
//             refetch()
//         } catch (error: any) {
//             toast({
//                 title: "Delete failed",
//                 description: error?.response?.data?.message || "Failed to delete",
//                 variant: "destructive",
//             })
//         }
//     }

//     const toggleSelectImage = (image: any) => {
//         const exists = selectedImages.find((img) => img._id === image._id)
//         if (exists) {
//             setSelectedImages((prev) => prev.filter((img) => img._id !== image._id))
//         } else {
//             setSelectedImages((prev) => [...prev, image])
//         }
//     }

//     const handleShortlist = async () => {
//         if (!selectedRoom || selectedImages.length === 0) return
//         try {

//             // console.log("selectedImages", selectedImages)

//             await addExistingMutation.mutateAsync({
//                 projectId,
//                 roomName: selectedRoom,
//                 selectedImages,
//             })
//             toast({ title: "Success", description: "Images shortlisted successfully" })
//             setSelectedImages([])
//             refetch()
//         } catch (error: any) {
//             toast({
//                 title: "Failed to shortlist images",
//                 description: error?.response?.data?.message || "Try again later",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handlePrev = () => {
//         if (previewImages.length === 0) return
//         setPreviewIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length)
//     }

//     const handleNext = () => {
//         if (previewImages.length === 0) return
//         setPreviewIndex((prev) => (prev + 1) % previewImages.length)
//     }

//     const shortListedImages = shortlistedDesigns?.shortlistedRooms?.filter((room: any) => room.roomName === selectedRoom)

//     return (
//         <div className="max-h-full overflow-y-auto bg-gray-50 p-2">
//             <div className="max-w-full mx-auto">
//                 {/* Header Section */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-3  mb-6 flex flex-col md:flex-row justify-between md:items-center items-start gap-2 md:gap-0">
//                     <div className="flex gap-2 items-center">

//                         <div onClick={() => navigate(-1)} className="flex bg-gray-200 h-fit  rounded-full items-center gap-2 backdrop-blur-sm px-4 py-2 ">
//                             <i className="fas fa-arrow-left text-sm"></i>
//                             <span className="text-sm hidden sm:inline-block font-medium">Back</span>
//                         </div>
//                         <div>
//                             <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Shortlisting Reference Designs</h1>
//                             <p className="text-gray-600 hidden sm:inline-block text-sm md:text-md">Select and organize your favorite design references for easy access</p>

//                         </div>
//                     </div>

//                     {/* Room Selection */}
//                     <div className="flex flex-col sm:flex-row gap-1 md:gap-4 items-start sm:items-center">
//                         <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Room:</label>
//                         <select
//                             value={selectedRoom}
//                             onChange={(e: any) => setSelectedRoom(e.target.value)}
//                             className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
//                         >
//                             {SampleDesignRooms?.map((roomName: any) => (
//                                 <option key={roomName} value={roomName}>
//                                     {roomName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

               

                

//                 {/* Image Preview Carousel */}
//                 {previewImages.length > 0 ? (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
//                         <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Site Image Preview</h3>

//                         <div className="flex flex-col lg:flex-row items-center justify-center  gap-6">
//                             {/* Main Image - First on small screens */}
//                             <div className="p-2 flex-shrink-0 order-1 lg:order-2 ">
//                                 <div className="w-80 h-60 md:w-96 md:h-72 lg:w-[500px] lg:h-[350px] border-4 border-blue-500 rounded-xl shadow-lg overflow-hidden bg-gray-100">
//                                     <img
//                                         src={previewImages[previewIndex]?.url || NO_IMAGE}
//                                         className="object-cover w-full h-full"
//                                         alt="Selected"
//                                     />
//                                 </div>
//                                 <div className="text-center mt-3">
//                                     <p className="text-sm font-medium text-gray-700 truncate max-w-[500px]">
//                                         {previewImages[previewIndex]?.categoryName}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         {previewIndex + 1} of {previewImages.length}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Navigation Section - Second row on small screens, sides on large screens */}
//                             <div className="flex lg:contents gap-6 order-2">
//                                 {/* Previous Image Thumbnail */}
//                                 <div className="flex-shrink-0 lg:order-1">
//                                     <div className="text-center">
//                                         <div
//                                             className="w-20 h-20 md:w-24 md:h-24 cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200"
//                                             onClick={handlePrev}
//                                         >
//                                             <img
//                                                 src={
//                                                     previewImages[(previewIndex - 1 + previewImages.length) % previewImages.length]?.url ||
//                                                     NO_IMAGE ||
//                                                     NO_IMAGE
//                                                 }
//                                                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
//                                                 alt="Previous"
//                                             />
//                                         </div>
//                                         <p className="text-xs text-gray-500 mt-2 font-medium">Previous</p>
//                                         {/* Previous Button Below Image */}
//                                         <Button
//                                             onClick={handlePrev}
//                                             className="mt-2 flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-xs"
//                                         >
//                                             <i className="fas fa-chevron-left"></i>
//                                             Prev
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 {/* Next Image Thumbnail */}
//                                 <div className="flex-shrink-0 lg:order-3">
//                                     <div className="text-center">
//                                         <div
//                                             className="w-20 h-20 md:w-24 md:h-24 cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200"
//                                             onClick={handleNext}
//                                         >
//                                             <img
//                                                 src={previewImages[(previewIndex + 1) % previewImages.length]?.url || NO_IMAGE}
//                                                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
//                                                 alt="Next"
//                                             />
//                                         </div>
//                                         <p className="text-xs text-gray-500 mt-2 font-medium">Next</p>
//                                         {/* Next Button Below Image */}
//                                         <Button
//                                             onClick={handleNext}
//                                             className="mt-2 flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-xs"
//                                         >
//                                             Next
//                                             <i className="fas fa-chevron-right"></i>
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>)
//                     :
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center my-4">
//                         <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                             <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                 />
//                             </svg>
//                         </div>
//                         <p className="text-gray-500 text-lg mb-2">
//                             No Previews Available
//                         </p>
//                     </div>
//                 }


//                 {/* Image Grid */}
//                 {selectedRoom && images.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
//                         <div className="mb-4">
//                              <div className="flex items-center justify-between ">
//                             <h2 className="text-xl font-semibold text-gray-900">Available Designs - {selectedRoom}</h2>
//                             <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{images.length} images</span>
//                         </div>
//                             <span className="text-sm text-gray-500">select the images for shortlisting</span>
//                         </div>
                       

//                         {/* Available Designs - SIZE_CONTROL_AVAILABLE_DESIGNS */}
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
//                             {images.map((img: any) => (
//                                 <div
//                                     key={img._id}
//                                     className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedImages.find((i) => i._id === img._id)
//                                         ? "ring-4 ring-green-500 border-green-500"
//                                         : "border-gray-200 hover:border-blue-300"
//                                         }`}
//                                     onClick={() => toggleSelectImage(img)}
//                                 >
//                                     <div className=" relative">
//                                         <img
//                                             src={img?.url || NO_IMAGE}
//                                             alt={img?.originalName}
//                                             className="w-50 h-50 object-cover transition-transform duration-200 group-hover:scale-105"
//                                         />

//                                         {/* Selection Indicator */}
//                                         {selectedImages.find((i) => i._id === img._id) && (
//                                             <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                                                 <i className="fas fa-check text-white text-sm"></i>
//                                             </div>
//                                         )}

//                                         {/* Hover Overlay - SIMPLIFIED */}
//                                         <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"></div>
//                                     </div>

//                                     {/* Image Name */}
//                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
//                                         <p className="text-white text-xs truncate font-medium">{img?.originalName}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}



// {/* No Room Selected State */}
//                 {!selectedRoom && (
//                     <div className="bg-white rounded-lg shadow-sm border  border-gray-300p-8 text-center">
//                         <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                 />
//                             </svg>
//                         </div>
//                         <p className="text-gray-500 text-lg">Please select a room to view or upload designs.</p>
//                     </div>
//                 )}

//                 {/* Empty State for Selected Room */}
//                 {selectedRoom && images.length === 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border  border-gray-300 p-8 text-center my-4">
//                         <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                             <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                 />
//                             </svg>
//                         </div>
//                         <p className="text-gray-500 text-lg mb-2">
//                             No designs uploaded yet for <strong>{selectedRoom}</strong>
//                         </p>
//                         <p className="text-gray-400 text-sm">Upload some sample desings and start comparing</p>
//                     </div>
//                 )}


//                 {/* Selected Images for Shortlisting */}
//                 {selectedImages.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-xl font-semibold text-gray-900">Selected for Shortlisting</h3>
//                             <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
//                                 {selectedImages.length} selected
//                             </span>
//                         </div>

//                         <div className="flex gap-4 overflow-x-auto  pb-2 mb-4">
//                             {selectedImages.map((img) => (
//                                 <div key={img._id} className="relative">
//                                     <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg  border-2 border-gray-300 shadow-md cursor-pointer">
//                                         <img
//                                             src={img.url || NO_IMAGE}
//                                             alt={img.originalName}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>

//                                     {/* Remove Button */}
//                                     <button
//                                         onClick={() => toggleSelectImage(img)}
//                                         className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
//                                     >
//                                         <i className="fas fa-times text-white text-xs"></i>
//                                     </button>

//                                     {/* <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                     <i className="fas fa-check text-white text-xs"></i>
//                   </div> */}
//                                 </div>
//                             ))}
//                         </div>

//                         <Button
//                             className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer"
//                             onClick={handleShortlist}
//                         >
//                             {addExistingMutation.isPending && <span className="inline-block  animate-spin w-5 h-5 border-t-transparent border-2 border-white rounded-full "></span>}
//                             <i className="fas fa-star"></i>

//                             Update ShortList Image
//                         </Button>
//                     </div>
//                 )}


                 

//                 {/* Previously Shortlisted Designs */}
//                 {shortlistedDesigns?.shortlistedRooms?.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
//                         <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                             Existing Shortlisted Designs for <span className="text-blue-600">{selectedRoom}</span>
//                         </h2>

//                         {/* Previously Shortlisted Designs - SIZE_CONTROL_SHORTLISTED_DESIGNS */}
//                         {shortListedImages.length > 0 ? <> {shortListedImages?.map((room: any) => (
//                             <div key={room.roomName}>
//                                 {/* Previously Shortlisted Designs - SIZE_CONTROL_SHORTLISTED_DESIGNS */}
//                                 {room.designs && room.designs.length > 0 ? (
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
//                                         {room.designs.map((design: any) => (
//                                             <div
//                                                 key={design._id}
//                                                 className="group relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
//                                             >
//                                                 <div className="aspect-square relative">
//                                                     <img
//                                                         src={design.url || NO_IMAGE}
//                                                         alt={design.originalName}
//                                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                                                     />

//                                                     {/* Delete Button */}
//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation()
//                                                             handleDelete(design._id)
//                                                         }}
//                                                         className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all duration-200 shadow-lg cursor-pointer"
//                                                     >
//                                                         <i className="fas fa-trash text-xs"></i>
//                                                     </button>

//                                                     {/* Shortlisted Badge */}
//                                                     <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                                                         <i className="fas fa-star text-xs"></i>
//                                                         Shortlisted
//                                                     </div>
//                                                 </div>

//                                                 {/* Image Name */}
//                                                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
//                                                     <p className="text-white text-xs truncate font-medium">{design.originalName}</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-12">
//                                         <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                                             <i className="fas fa-star text-2xl text-gray-400"></i>
//                                         </div>
//                                         <p className="text-gray-500 text-lg">No previously shortlisted designs for this room.</p>
//                                         <p className="text-gray-400 text-sm mt-1">
//                                             Start selecting images above to create your shortlist
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                         </>
//                             :
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center my-4">
//                                 <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <p className="text-gray-500 text-lg mb-2">
//                                     No Shortlisted Images Available
//                                 </p>
//                             </div>
//                         }
//                     </div>
//                 )}

//                 {/* Upload Button - Always Available */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mt-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Designs for shortlisting</h3>

//                     <div className="text-center ">
//                         <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
//                             {uploadMutation.isPending && <span className="inline-block  animate-spin w-5 h-5 border-t-transparent border-2 border-white rounded-full "></span>}

//                             <i className="fas fa-upload"></i>
//                             Upload Images for {selectedRoom}
//                             <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
//                         </label>
//                         {/* <p className="text-gray-500 text-sm mt-2">
//                 Select multiple images to upload</p> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ShortlistMain




"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../../components/ui/Button"
import {
  useUploadShortlistedDesigns,
  useRemoveShortlistedDesign,
  useAddExistingShortlistedDesigns,
  useGetShortlistedRoomDesigns,
} from "../../../../apiList/Stage Api/shortListApi"
import { toast } from "../../../../utils/toast"
import { useGetRoomFiles } from "../../../../apiList/Stage Api/sampleDesignApi"
import { useNavigate, useParams } from "react-router-dom"
import { NO_IMAGE } from "../../../../constants/constants"
import { useGetSiteMeasurementDetails } from "../../../../apiList/Stage Api/siteMeasurementApi"
import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading"

const ShortlistMain = () => {
  const { projectId } = useParams() as { projectId: string }
  const [selectedRoom, setSelectedRoom] = useState<string>("Living Room")
  const [selectedImages, setSelectedImages] = useState<any[]>([])
  const [previewIndex, setPreviewIndex] = useState<number>(0)
  const [previewImages, setPreviewImages] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const navigate = useNavigate()

  const { data: sampleDesign } = useGetRoomFiles(projectId)
  const uploadMutation = useUploadShortlistedDesigns()
  const deleteMutation = useRemoveShortlistedDesign()
  const addExistingMutation = useAddExistingShortlistedDesigns()
  const {
    data: shortlistedDesigns,
    refetch,
    isLoading: shortlistloading,
  } = useGetShortlistedRoomDesigns({ projectId, roomName: selectedRoom! })

  const { data: siteMeasure, isLoading: siteLoading } = useGetSiteMeasurementDetails({ projectId })

  const SampleDesignRooms = sampleDesign?.rooms.map((room: any) => room.roomName)
  const currentRoom = sampleDesign?.rooms?.find((room: any) => room.roomName === selectedRoom)
  const images = currentRoom?.files.filter((file: any) => file.type !== "pdf") || []

  // Get categories from site measurement for the selected room
  const getCurrentRoomCategories = () => {
    if (!siteMeasure || !selectedRoom) return []
    const room = siteMeasure.rooms?.find((r: any) => r.name === selectedRoom)
    return room?.uploads?.map((upload: any) => upload.categoryName).filter(Boolean) || []
  }

  const categories = getCurrentRoomCategories()

  useEffect(() => {
    if (!siteMeasure || !selectedRoom) {
      setPreviewImages([])
      setPreviewIndex(0)
      return
    }
    const room = siteMeasure.rooms?.find((r: any) => r.name === selectedRoom)

    if (!room || !room.uploads || room.uploads.length === 0) {
      setPreviewImages([])
      setPreviewIndex(0)
      return
    }

    const imageUploads = room.uploads.filter((upload: any) => upload.type === "image")
    const isSame =
      previewImages.length === imageUploads.length &&
      previewImages.every((img, idx) => img._id === imageUploads[idx]._id)

    if (!isSame) {
      setPreviewImages(imageUploads)
      setPreviewIndex(0)
    }
  }, [selectedRoom, siteMeasure])

  // Reset selected category when room changes
  useEffect(() => {
    setSelectedCategory("")
    setSelectedImages([])
  }, [selectedRoom])

  if (shortlistloading || siteLoading) {
    return <MaterialOverviewLoading />
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryName: string) => {
    if (!e.target.files || !selectedRoom || !categoryName) return
    const formData = new FormData()
    Array.from(e.target.files).forEach((file) => formData.append("file", file))
    try {
      await uploadMutation.mutateAsync({
        projectId,
        roomName: selectedRoom,
        categoryName,
        formData,
      })
      toast({ title: "Success", description: "Uploaded successfully" })
      refetch()
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (fileId: string, categoryName: string) => {
    try {
        console.log("selectedroom", selectedRoom)
      await deleteMutation.mutateAsync({
        projectId,
        roomName: selectedRoom!,
        categoryName,
        fileId,
      })
      toast({ title: "Success", description: "Deleted successfully" })
      refetch()
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || "Failed to delete",
        variant: "destructive",
      })
    }
  }

  const toggleSelectImage = (image: any) => {
    const exists = selectedImages.find((img) => img._id === image._id)
    if (exists) {
      setSelectedImages((prev) => prev.filter((img) => img._id !== image._id))
    } else {
      setSelectedImages((prev) => [...prev, image])
    }
  }

  const handleShortlist = async (categoryName: string) => {
    if (!selectedRoom || selectedImages.length === 0 || !categoryName) return
    try {
      await addExistingMutation.mutateAsync({
        projectId,
        roomName: selectedRoom,
        categoryName,
        selectedImages,
      })
      toast({ title: "Success", description: "Images shortlisted successfully" })
      setSelectedImages([])
      refetch()
    } catch (error: any) {
      toast({
        title: "Failed to shortlist images",
        description: error?.response?.data?.message || "Try again later",
        variant: "destructive",
      })
    }
  }

  const handlePrev = () => {
    if (previewImages.length === 0) return
    setPreviewIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length)
  }

  const handleNext = () => {
    if (previewImages.length === 0) return
    setPreviewIndex((prev) => (prev + 1) % previewImages.length)
  }

  // Get shortlisted designs for current room
  const getCurrentRoomShortlistedDesigns = () => {
    console.log("shorltistdeisngs.shorlistedroom" , shortlistedDesigns?.shortlistedRooms )
    if (!shortlistedDesigns?.shortlistedRooms) return []
    console.log(selectedRoom,"shorltistl room seleced")
    const room = shortlistedDesigns.shortlistedRooms.find((room: any) => room.roomName === selectedRoom)
    return room?.categories || []
  }

  const shortlistedCategories = getCurrentRoomShortlistedDesigns()

  console.log("categores", shortlistedCategories)

  return (
    <div className="max-h-full overflow-y-auto bg-gray-50 p-2">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-3 mb-6 flex flex-col md:flex-row justify-between md:items-center items-start gap-2 md:gap-0">
          <div className="flex gap-2 items-center">
            <div
              onClick={() => navigate(-1)}
              className="flex bg-gray-200 h-fit rounded-full items-center gap-2 backdrop-blur-sm px-4 py-2 cursor-pointer"
            >
              <i className="fas fa-arrow-left text-sm"></i>
              <span className="text-sm hidden sm:inline-block font-medium">Back</span>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Shortlisting Reference Designs</h1>
              <p className="text-gray-600 hidden sm:inline-block text-sm md:text-md">
                Select and organize your favorite design references for easy access
              </p>
            </div>
          </div>
          {/* Room Selection */}
          <div className="flex flex-col sm:flex-row gap-1 md:gap-4 items-start sm:items-center">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Room:</label>
            <select
              value={selectedRoom}
              onChange={(e: any) => setSelectedRoom(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              {SampleDesignRooms?.map((roomName: any) => (
                <option key={roomName} value={roomName}>
                  {roomName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Preview Carousel */}
        {previewImages.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Site Image Preview</h3>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
              {/* Main Image - First on small screens */}
              <div className="p-2 flex-shrink-0 order-1 lg:order-2">
                <div className="w-80 h-60 md:w-96 md:h-72 lg:w-[500px] lg:h-[350px] border-4 border-blue-500 rounded-xl shadow-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewImages[previewIndex]?.url || NO_IMAGE}
                    className="object-cover w-full h-full"
                    alt="Selected"
                  />
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[500px]">
                    {previewImages[previewIndex]?.categoryName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {previewIndex + 1} of {previewImages.length}
                  </p>
                </div>
              </div>
              {/* Navigation Section */}
              <div className="flex lg:contents gap-6 order-2">
                {/* Previous Image Thumbnail */}
                <div className="flex-shrink-0 lg:order-1">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200"
                      onClick={handlePrev}
                    >
                      <img
                        src={
                          previewImages[(previewIndex - 1 + previewImages.length) % previewImages.length]?.url ||
                          NO_IMAGE ||
                          "/placeholder.svg"
                        }
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                        alt="Previous"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Previous</p>
                    <Button
                      onClick={handlePrev}
                      className="mt-2 flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-xs"
                    >
                      <i className="fas fa-chevron-left"></i>
                      Prev
                    </Button>
                  </div>
                </div>
                {/* Next Image Thumbnail */}
                <div className="flex-shrink-0 lg:order-3">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200"
                      onClick={handleNext}
                    >
                      <img
                        src={previewImages[(previewIndex + 1) % previewImages.length]?.url || NO_IMAGE}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                        alt="Next"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Next</p>
                    <Button
                      onClick={handleNext}
                      className="mt-2 flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-xs"
                    >
                      Next
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center my-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">No Previews Available</p>
          </div>
        )}

        {/* Available Images for Selection */}
        {selectedRoom && images.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Available Designs - {selectedRoom}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{images.length} images</span>
              </div>
              <span className="text-sm text-gray-500">Select images for shortlisting</span>
            </div>

            {/* Available Designs - SIZE_CONTROL_AVAILABLE_DESIGNS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
              {images.map((img: any) => (
                <div
                  key={img._id}
                  className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedImages.find((i) => i._id === img._id)
                      ? "ring-4 ring-green-500 border-green-500"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => toggleSelectImage(img)}
                >
                  <div className="relative">
                    <img
                      src={img?.url || NO_IMAGE}
                      alt={img?.originalName}
                      className="w-50 h-50 object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Selection Indicator */}
                    {selectedImages.find((i) => i._id === img._id) && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-white text-sm"></i>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"></div>
                  </div>
                  {/* Image Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <p className="text-white text-xs truncate font-medium">{img?.originalName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Selected Room */}
        {selectedRoom && images.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center my-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">
              No designs uploaded yet for <strong>{selectedRoom}</strong>
            </p>
            <p className="text-gray-400 text-sm">Upload some sample designs and start comparing</p>
          </div>
        )}

        {/* Category Selection and Shortlisting */}
        {selectedImages.length > 0 && categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Selected for Shortlisting</h3>
              <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                {selectedImages.length} selected
              </span>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Choose a category</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 mb-4">
              {selectedImages.map((img) => (
                <div key={img._id} className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-gray-300 shadow-md cursor-pointer">
                    <img src={img.url || NO_IMAGE} alt={img.originalName} className="w-full h-full object-cover" />
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleSelectImage(img)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
                  >
                    <i className="fas fa-times text-white text-xs"></i>
                  </button>
                </div>
              ))}
            </div>

            <Button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer disabled:opacity-50"
              onClick={() => handleShortlist(selectedCategory)}
              disabled={!selectedCategory || addExistingMutation.isPending}
            >
              {addExistingMutation.isPending && (
                <span className="inline-block animate-spin w-5 h-5 border-t-transparent border-2 border-white rounded-full"></span>
              )}
              <i className="fas fa-star"></i>
              Add to {selectedCategory || "Category"}
            </Button>
          </div>
        )}

        {/* Category-wise Shortlisted Designs */}
        {shortlistedCategories.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Shortlisted Designs for <span className="text-blue-600">{selectedRoom}</span>
            </h2>

            {shortlistedCategories.map((category: any) => (
              <div key={category.categoryName} className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-folder text-blue-500"></i>
                    {category?.categoryName || "Uncategorized"}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {category.designs?.length || 0} images
                  </span>
                </div>

                {category.designs && category.designs.length > 0 ? (
                  <>
                    {/* Category Designs - SIZE_CONTROL_CATEGORY_DESIGNS */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4">
                      {category.designs.map((design: any) => (
                        <div
                          key={design._id}
                          className="group relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="aspect-square relative">
                            <img
                              src={design.url || NO_IMAGE}
                              alt={design.originalName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(design._id, category.categoryName)
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all duration-200 shadow-lg cursor-pointer"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                            {/* Shortlisted Badge */}
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <i className="fas fa-star text-xs"></i>
                              Shortlisted
                            </div>
                          </div>
                          {/* Image Name */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                            <p className="text-white text-xs truncate font-medium">{design.originalName}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Button for this Category */}
                    <div className="border-t pt-4">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                        {uploadMutation.isPending && (
                          <span className="inline-block animate-spin w-4 h-4 border-t-transparent border-2 border-white rounded-full"></span>
                        )}
                        <i className="fas fa-upload"></i>
                        Upload to {category.categoryName}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUpload(e, category.categoryName)}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-images text-2xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No designs in {category.categoryName}</p>
                    <p className="text-gray-400 text-sm mb-4">Upload some images to get started</p>

                    {/* Upload Button for Empty Category */}
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                      {uploadMutation.isPending && (
                        <span className="inline-block animate-spin w-4 h-4 border-t-transparent border-2 border-white rounded-full"></span>
                      )}
                      <i className="fas fa-upload"></i>
                      Upload to {category.categoryName}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e, category.categoryName)}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Categories Available */}
        {categories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center my-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="fas fa-folder-open text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 text-lg mb-2">No Categories Available</p>
            <p className="text-gray-400 text-sm">Categories will appear based on your site measurements</p>
          </div>
        )}

        {/* No Shortlisted Designs */}
        {shortlistedCategories.length === 0 && categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center my-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="fas fa-star text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 text-lg mb-2">No Shortlisted Images Available</p>
            <p className="text-gray-400 text-sm">Start selecting images above to create your shortlist</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShortlistMain
