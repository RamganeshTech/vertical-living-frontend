import React, { useRef, useState } from "react";
import { useDeleteReferenceDesign, useGetReferenceDesigns, useUploadReferenceDesigns } from "../../../../apiList/Stage Api/shortlistReferenceDesignApi";
import { toast } from "../../../../utils/toast";
import ImageGalleryExample from "../../../../shared/ImageGallery/ImageGalleryMain";
import { useParams } from "react-router-dom";
import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
// import TagInput from "../../../../shared/TagInput";
import SmartTagInput from "../../../../shared/SmartTagInput";
import { fetchSuggestions } from "../ShortList/ShortListMain";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import StageGuide from "../../../../shared/StageGuide";


const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ShortListReferenceDesignMain() {
    //   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { organizationId } = useParams() as { organizationId: string }




    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    // 1. Separate State for Searching
    const [searchTags, setSearchTags] = useState<string[]>([]);


    const { data: imageData, refetch, isFetching } = useGetReferenceDesigns({
        organizationId,
        // search: searchTags.join(","),
        search: searchTags.length > 0 ? searchTags.join(",") : "",
    });




    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.referencedesign?.delete;
    const canList = role === "owner" || permission?.referencedesign?.list;
    const canCreate = role === "owner" || permission?.referencedesign?.create;
    const canEdit = role === "owner" || permission?.referencedesign?.create;


    const { mutateAsync: uploadImages, isPending: uploadPending } = useUploadReferenceDesigns();
    const { mutateAsync: deleteImage, } = useDeleteReferenceDesign();



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validImages = files.filter((file) => allowedImageTypes.includes(file.type));

        if (validImages.length === 0) {
            toast({ title: "Error", description: "Please select valid image files (JPG, JPEG, PNG, WEBP)", variant: "destructive" });
            return;
        }

        // setSelectedFiles(validImages);
        handleUpload(validImages);
    };

    const handleUpload = async (files: File[]) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file); // assuming your multer/express handler uses `images` as the field
            });

            formData.append("tags", JSON.stringify(tags));

            await uploadImages({ organizationId, formData });
            toast({ title: "Success", description: "Image(s) uploaded successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to upload images", variant: "destructive" });
        }
    };

    const handleDelete = async (imageId: string) => {
        try {
            await deleteImage({ organizationId, imageId });
            toast({ title: "Success", description: "Image deleted" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to upload images", variant: "destructive" });

        }
    };



    // ✅ Drag handlers
    // const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setIsDragging(true);
    // };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Needed to allow drop
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        await handleUpload(files);
    };


    return (
        <div className="w-full max-h-full mx-auto p-2 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    <i className="fa-solid fa-object-group text-2xl text-blue-600 mr-2"></i>
                    Reference Designs
                </h1>



                <div className="w-full sm:w-auto flex justify-end sm:block">
                    <StageGuide
                        organizationId={organizationId!}
                        stageName="referencedesign"
                    />
                </div>
            </div>


            <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Categories</label>
                {/* <TagInput
                    tags={tags}
                    setState={setTags}
                /> */}

                <SmartTagInput
                    tags={tags}
                    setState={setTags}
                    // suggestionFetcher={fetchSuggestions}
                    suggestionFetcher={(q) => fetchSuggestions({ query: q, organizationId })}

                />

            </div>


            {(canCreate || canEdit) && <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {isDragging
                            ? "Drop files here..."
                            : "Drag and drop image files here or "}
                        <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
                            {uploadPending ? <>Loading <i className="fas fa-spinner ml-2 animate-spin"></i></> : "Upload reference images, and can be used to compare in the projects"}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        // className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-2">
                            <p className="text-lg font-medium">Drag & drop plan/reference images here or</p>
                            <Button variant="outline">Browse</Button>
                            <p className="text-sm text-gray-500">Accepted: JPG/PNG/WebP • Images auto-saved locally</p>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </CardContent>
            </Card>}

            {/* Image Gallery */}
            {canList && <div className="mt-5">

                {/* <h1 className="text-2xl font-semibold text-gray-700 mb-3">Images</h1> */}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-700 mb-3">Images Gallery</h1>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Filter gallery by tags</label>
                        <div className="max-w-md">
                            <SmartTagInput
                                tags={searchTags}
                                setState={setSearchTags}
                                // suggestionFetcher={fetchSuggestions}
                                suggestionFetcher={(q) => fetchSuggestions({ query: q, organizationId })}

                            />
                        </div>
                    </div>

                    {searchTags.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchTags([])}
                            className="text-red-500 hover:text-red-700"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                {isFetching ? (
                    <div className="text-center text-gray-600">
                        <MaterialOverviewLoading />
                    </div>
                ) : (
                    imageData?.referenceImages.length ?
                        <ImageGalleryExample
                            imageFiles={imageData?.referenceImages || []}
                            refetch={refetch}
                            height={190}
                            // minWidth={156}
                            minWidth={193}
                            maxWidth={200}
                            showTags={true}
                            {...(canDelete ? { handleDeleteFile: handleDelete } : {})}

                        // handleDeleteFile={handleDelete}
                        />
                        : <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                            <i className="fas fa-image text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Images Found</h3>
                            <p className="text-sm text-gray-500">
                                Please upload images
                            </p>
                        </div>

                )}
            </div>}

        </div>
    );
}