// import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
// import { useGetProjectConfig, useUpdateProjectConfig } from "../../apiList/projectConfigApi";
// import { toast } from "../../utils/toast";
// // Adjust these imports based on your file structure
// // import { useGetProjectConfig, useUpdateProjectConfig } from "../hooks/useProjectConfig"; 
// // import { toast } from "../utils/toast"; // Assuming you have a toast utility

// interface PresentationFormData {
//     materials: string;
//     fabricationCost: string;
//     howWeWork: string;
//     paymentProcess: string;
// }

// const ProjectConfiguration: React.FC = () => {
//     // API Hooks
//     const { data: configData } = useGetProjectConfig();
//     const { mutateAsync: updateConfig, isPending: isUpdating } = useUpdateProjectConfig();

//     // Local State
//     const [formData, setFormData] = useState<PresentationFormData>({
//         materials: "",
//         fabricationCost: "",
//         howWeWork: "",
//         paymentProcess: "",
//     });
//     const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

//     // Populate form when data arrives
//     useEffect(() => {
//         if (configData?.presentationDetails) {
//             setFormData({
//                 materials: configData.presentationDetails.materials?.join(", ") || "",
//                 fabricationCost: configData.presentationDetails.fabricationCost || "",
//                 howWeWork: configData.presentationDetails.howWeWork || "",
//                 paymentProcess: configData.presentationDetails.paymentProcess || "",
//             });
//         }
//     }, [configData]);

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setSelectedVideos(Array.from(e.target.files));
//         }
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();

//         try {
//             const submitData = new FormData();

//             // Append Videos
//             selectedVideos.forEach((file) => {
//                 submitData.append("videos", file);
//             });

//             // Format Presentation Details
//             const presentationDetails = {
//                 materials: formData.materials.split(",").map(m => m.trim()).filter(Boolean),
//                 fabricationCost: formData.fabricationCost,
//                 howWeWork: formData.howWeWork,
//                 paymentProcess: formData.paymentProcess,
//             };

//             submitData.append("presentationDetails", JSON.stringify(presentationDetails));

//             await updateConfig(submitData);
//             setSelectedVideos([]); // Reset file input after successful upload
//             toast({ title: "Success", description: "Project configuration updated successfully." });
//         } catch (error: any) {
//             toast({ title: "Error", description: error.message || "Failed to update configuration.", variant: "destructive" });
//         }
//     };

//     // if (isFetching) {
//     //     return (
//     //         <div className="flex items-center justify-center min-h-[400px] text-action-primary">
//     //             <i className="fa-solid fa-circle-notch fa-spin text-3xl"></i>
//     //         </div>
//     //     );
//     // }

//     return (
//         <div className="bg-brand-surface min-h-full font-roboto p-2">
//             {/* Header Section */}
//             <div className="max-w-full mx-auto mb-8">
//                 <h1 className="text-xl font-medium text-text-strong mb-1">Project Configuration</h1>
//                 <p className="text-sm text-text-muted">
//                     Manage your Projects default presentation materials, workflows, and introduction videos.
//                 </p>
//             </div>

//             <div className="max-w-full mx-auto">
//                 <form onSubmit={handleSubmit} className="space-y-6">

//                     {/* Section 1: Video Upload */}
//                     <div className="bg-brand-surface border border-ash-light rounded-xl p-6 shadow-sm">
//                         <h2 className="text-base font-medium text-text-strong flex items-center gap-2 mb-4 border-b border-ash-light pb-3">
//                             <i className="fa-solid fa-video text-text-soft"></i> 
//                             Introductory Video
//                         </h2>

//                         <div className="border-2 border-dashed border-ash-medium bg-brand-ash rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-brand-surface-hover">
//                             <i className="fa-solid fa-cloud-arrow-up text-action-primary text-3xl mb-3"></i>
//                             <p className="text-sm text-text-main font-medium mb-1">Click to upload or drag and drop</p>
//                             <p className="text-xs text-text-muted mb-4">MP4, WebM or OGG (max. 50MB)</p>

//                             <input
//                                 type="file"
//                                 id="video-upload"
//                                 accept="video/*"
//                                 multiple
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                             />
//                             <label 
//                                 htmlFor="video-upload" 
//                                 className="cursor-pointer bg-brand-surface border border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary px-4 py-2 rounded-md text-sm transition-all"
//                             >
//                                 Browse Files
//                             </label>
//                         </div>

//                         {selectedVideos.length > 0 && (
//                             <div className="mt-4 flex flex-col gap-2">
//                                 {selectedVideos.map((file, idx) => (
//                                     <div key={idx} className="flex items-center justify-between bg-brand-ash border border-ash-light p-3 rounded-md">
//                                         <div className="flex items-center gap-3 text-sm text-text-main">
//                                             <i className="fa-solid fa-file-video text-action-primary"></i>
//                                             <span className="truncate max-w-[200px] sm:max-w-md">{file.name}</span>
//                                         </div>
//                                         <button 
//                                             type="button" 
//                                             onClick={() => setSelectedVideos(p => p.filter((_, i) => i !== idx))}
//                                             className="text-text-soft hover:text-action-danger transition-colors"
//                                         >
//                                             <i className="fa-solid fa-trash"></i>
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {/* Show existing videos if any */}
//                         {configData?.videos && configData.videos.length > 0 && selectedVideos.length === 0 && (
//                             <div className="mt-4 pt-4 border-t border-ash-light text-sm text-text-muted">
//                                 <p className="mb-2"><i className="fa-solid fa-check-circle text-action-success mr-1"></i> Currently active videos:</p>
//                                 <ul className="list-disc pl-5 space-y-1">
//                                     {configData.videos.map((vid: any, i: number) => (
//                                         <li key={i}>{vid.originalName || "Uploaded Video"}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>

//                     {/* Section 2: Presentation Details */}
//                     <div className="bg-brand-surface border border-ash-light rounded-xl p-6 shadow-sm">
//                         <h2 className="text-base font-medium text-text-strong flex items-center gap-2 mb-4 border-b border-ash-light pb-3">
//                             <i className="fa-solid fa-file-lines text-text-soft"></i> 
//                             Presentation Details
//                         </h2>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="col-span-1 md:col-span-2">
//                                 <label className="block text-sm text-text-muted mb-1.5">Materials Used (Comma separated)</label>
//                                 <input
//                                     name="materials"
//                                     value={formData.materials}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g. BWP Plywood, Teak Wood, HDHMR"
//                                     className="w-full bg-brand-surface border border-ash-medium text-text-main rounded-md px-3 py-2 text-sm outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm text-text-muted mb-1.5">Fabrication Cost Estimation</label>
//                                 <input
//                                     name="fabricationCost"
//                                     value={formData.fabricationCost}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g. Calculated per sq.ft based on material"
//                                     className="w-full bg-brand-surface border border-ash-medium text-text-main rounded-md px-3 py-2 text-sm outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm text-text-muted mb-1.5">Payment Process</label>
//                                 <input
//                                     name="paymentProcess"
//                                     value={formData.paymentProcess}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g. 10% Advance, 40% Design, 50% Handover"
//                                     className="w-full bg-brand-surface border border-ash-medium text-text-main rounded-md px-3 py-2 text-sm outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
//                                 />
//                             </div>

//                             <div className="col-span-1 md:col-span-2">
//                                 <label className="block text-sm text-text-muted mb-1.5">How We Work (Process Outline)</label>
//                                 <textarea
//                                     name="howWeWork"
//                                     value={formData.howWeWork}
//                                     onChange={handleInputChange}
//                                     rows={3}
//                                     placeholder="Describe your standard operational procedure..."
//                                     className="w-full bg-brand-surface border border-ash-medium text-text-main rounded-md px-3 py-2 text-sm outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all resize-none"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end pt-2">
//                         <button
//                             type="submit"
//                             disabled={isUpdating}
//                             className="bg-action-primary hover:bg-action-primary-hover text-white px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//                         >
//                             {isUpdating ? (
//                                 <>
//                                     <i className="fa-solid fa-circle-notch fa-spin"></i> Saving...
//                                 </>
//                             ) : (
//                                 <>
//                                     <i className="fa-solid fa-floppy-disk"></i> Save Configuration
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ProjectConfiguration;


import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Ensure you have this installed/imported
import {
    useGetProjectConfig,
    useUploadConfigVideos,
    useUploadConfigImages,
    useUpdateTermsAndConditions,
    useDeleteConfigVideo,
    useDeleteConfigImage
} from "../../apiList/projectConfigApi"; // Adjust path as needed
import { toast } from "../../utils/toast";
import VideoGalleryMain from "../../shared/VideoGallery/VideoGalleryMain";
import ImageGalleryExample from "../../shared/ImageGallery/ImageGalleryMain";

// Adjust these imports to where your gallery components live
// import ImageGalleryExample from "../../components/ImageGalleryExample"; 
// import VideoGalleryMain from "../../components/VideoGalleryMain";

const ProjectConfiguration: React.FC = () => {
    // Extract organizationId from the route
    const { organizationId } = useParams<{ organizationId: string }>();

    const navigate = useNavigate();
    // API Hooks
    const { data: configData, refetch, isFetching } = useGetProjectConfig(organizationId!);
    const { mutateAsync: uploadVideos, isPending: isUploadingVideos } = useUploadConfigVideos();
    const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadConfigImages();
    const { mutateAsync: updateTerms, isPending: isUpdatingTerms } = useUpdateTermsAndConditions();

    const { mutateAsync: deleteVideo } = useDeleteConfigVideo();
    const { mutateAsync: deleteImage } = useDeleteConfigImage();

    // Local State
    const [termsText, setTermsText] = useState("");
    const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    // Populate form when data arrives
    useEffect(() => {
        if (configData?.termsAndCondition) {
            setTermsText(configData.termsAndCondition);
        }
    }, [configData]);

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedVideos(Array.from(e.target.files));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!organizationId) return;

        try {
            let hasUpdates = false;

            // 1. Process Video Uploads
            if (selectedVideos.length > 0) {
                const videoData = new FormData();
                selectedVideos.forEach((file) => videoData.append("videos", file));
                await uploadVideos({ organizationId, formData: videoData });
                setSelectedVideos([]); // Reset
                hasUpdates = true;
            }

            // 2. Process Image Uploads
            if (selectedImages.length > 0) {
                const imageData = new FormData();
                selectedImages.forEach((file) => imageData.append("images", file));
                await uploadImages({ organizationId, formData: imageData });
                setSelectedImages([]); // Reset
                hasUpdates = true;
            }

            // 3. Process Terms update (only if it changed)
            if (termsText !== configData?.termsAndCondition) {
                await updateTerms({ organizationId, termsAndCondition: termsText });
                hasUpdates = true;
            }

            if (hasUpdates) {
                toast({ title: "Success", description: "Project configuration updated successfully." });
                refetch(); // Instantly refresh the galleries
            } else {
                toast({ title: "Info", description: "No changes to save." });
            }

        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to update configuration.", variant: "destructive" });
        }
    };

    // Create the handler functions:
    const handleVideoDelete = async (videoId: string) => {
        await deleteVideo({ organizationId: organizationId!, videoId });
        toast({ title: "Success", description: "Video deleted" });
    };

    const handleImageDelete = async (imageId: string) => {
        await deleteImage({ organizationId: organizationId!, imageId });
        toast({ title: "Success", description: "Image deleted" });
    };

    const isUpdating = isUploadingVideos || isUploadingImages || isUpdatingTerms;

    // Existing files mapped from the backend
    const imageFiles = configData?.images || [];
    const videoFiles = configData?.videos || [];

    if (isFetching && !configData) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-action-primary">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl"></i>
            </div>
        );
    }

    return (
        <div className="bg-brand-surface min-h-full font-roboto p-2">
            {/* Header Section */}
            {/* <div className="max-w-full mx-auto mb-8 border-b border-ash-light pb-4">
                <h1 className="text-2xl font-bold text-text-strong mb-1">Project Configuration</h1>
                <p className="text-sm text-text-muted">
                    Manage your Project's introductory videos, gallery images, and standard terms and conditions.
                </p>
            </div> */}


            <div className="max-w-full mx-auto mb-8 border-b border-ash-light pb-4 flex items-center gap-3">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)} // Goes back to the previous page
                    className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer bg-ash-medium border-2 border-ash-medium text-text-main hover:text-action-primary hover:border-ash-dark hover:shadow-md transition-all flex-shrink-0 shadow-sm"
                    aria-label="Go back"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>

                {/* Text Block */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-text-strong mb-1">
                        Project Configuration
                    </h1>
                    <p className="text-sm text-text-muted leading-tight">
                        Manage your Project's introductory videos, gallery images, and standard terms and conditions.
                    </p>
                </div>

            </div>
            <div className="max-w-full mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Introductory Videos */}
                    <div className="bg-brand-surface border border-ash-light rounded-xl p-6 shadow-sm">
                        <h2 className="text-base font-medium text-text-strong flex items-center gap-2 mb-4 border-b border-ash-light pb-3">
                            <i className="fa-solid fa-video text-text-soft"></i>
                            Introductory Videos
                        </h2>

                        {/* Video Dropzone */}
                        <div className="border-2 border-dashed border-ash-medium bg-brand-ash rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors hover:bg-brand-surface-hover mb-6">
                            <i className="fa-solid fa-cloud-arrow-up text-action-primary text-2xl mb-2"></i>
                            <p className="text-sm text-text-main font-medium mb-1">Upload New Videos</p>
                            <p className="text-xs text-text-muted mb-4">MP4, WebM or OGG</p>

                            <input
                                type="file"
                                id="video-upload"
                                accept="video/*"
                                multiple
                                onChange={handleVideoChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="video-upload"
                                className="cursor-pointer bg-brand-surface border border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary px-4 py-2 rounded-md text-sm transition-all shadow-sm"
                            >
                                Browse Files
                            </label>

                            {selectedVideos.length > 0 && (
                                <div className="mt-4 text-sm text-action-primary font-medium">
                                    {selectedVideos.length} video(s) selected for upload
                                </div>
                            )}
                        </div>

                        {/* Video Gallery */}
                        {videoFiles.length > 0 && (
                            <div className="mt-2">
                                <h3 className="text-sm font-medium text-text-muted mb-3">Existing Videos</h3>
                                <VideoGalleryMain
                                    videoFiles={videoFiles}
                                    refetch={refetch}
                                    height={190}
                                    minWidth={156}
                                    maxWidth={100}
                                    // Intentionally omitting delete per instructions
                                    handleDeleteFile={handleVideoDelete} // <-- Pass it here now
                                />
                            </div>
                        )}
                    </div>

                    {/* Section 2: Reference Images */}
                    <div className="bg-brand-surface border border-ash-light rounded-xl p-6 shadow-sm">
                        <h2 className="text-base font-medium text-text-strong flex items-center gap-2 mb-4 border-b border-ash-light pb-3">
                            <i className="fa-solid fa-images text-text-soft"></i>
                            Gallery Images
                        </h2>

                        {/* Image Dropzone */}
                        <div className="border-2 border-dashed border-ash-medium bg-brand-ash rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors hover:bg-brand-surface-hover mb-6">
                            <i className="fa-solid fa-cloud-arrow-up text-action-primary text-2xl mb-2"></i>
                            <p className="text-sm text-text-main font-medium mb-1">Upload New Images</p>
                            <p className="text-xs text-text-muted mb-4">PNG, JPG, or WEBP</p>

                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer bg-brand-surface border border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary px-4 py-2 rounded-md text-sm transition-all shadow-sm"
                            >
                                Browse Files
                            </label>

                            {selectedImages.length > 0 && (
                                <div className="mt-4 text-sm text-action-primary font-medium">
                                    {selectedImages.length} image(s) selected for upload
                                </div>
                            )}
                        </div>

                        {/* Image Gallery */}
                        {imageFiles.length > 0 && (
                            <div className="mt-2">
                                <h3 className="text-sm font-medium text-text-muted mb-3">Existing Images</h3>
                                <ImageGalleryExample
                                    imageFiles={imageFiles}
                                    refetch={refetch}
                                    height={190}
                                    minWidth={156}
                                    maxWidth={100}
                                    // Intentionally omitting delete per instructions
                                    handleDeleteFile={handleImageDelete} // <-- Pass it here now
                                />
                            </div>
                        )}
                    </div>

                    {/* Section 3: Terms and Conditions */}
                    {/* <div className="bg-brand-surface border border-ash-light rounded-xl p-6 shadow-sm">
                        <h2 className="text-base font-medium text-text-strong flex items-center gap-2 mb-4 border-b border-ash-light pb-3">
                            <i className="fa-solid fa-scale-balanced text-text-soft"></i> 
                            Terms and Conditions
                        </h2>
                        
                        <div className="w-full">
                            <label className="block text-sm text-text-muted mb-2">Organization-wide Terms</label>
                            <textarea
                                name="termsAndCondition"
                                value={termsText}
                                onChange={(e) => setTermsText(e.target.value)}
                                rows={8}
                                placeholder="Enter your standard terms, conditions, and payment procedures here..."
                                className="w-full bg-brand-ash border border-ash-medium text-text-main rounded-md px-4 py-3 text-sm outline-none focus:border-action-primary focus:bg-brand-surface transition-all resize-y shadow-inner"
                            />
                        </div>
                    </div> */}

                    {/* Actions */}
                    <div className="flex justify-end pt-2 sticky bottom-6 z-10">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-action-primary hover:bg-action-primary-hover text-white px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isUpdating ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin"></i> Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk"></i> Save Configurations
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectConfiguration;