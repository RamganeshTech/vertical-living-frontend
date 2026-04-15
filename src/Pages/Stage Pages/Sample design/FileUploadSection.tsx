import { useRef, useState } from "react";
import type { IFileItem } from "../../../types/types";
import { Button } from "../../../components/ui/Button";
import { downloadImage } from "../../../utils/downloadFile";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

interface FileUploadSectionProps {

    files: IFileItem[];
    onUpload: (files: File[]) => Promise<void>;
    onDelete: (fileId: string) => Promise<any>;
    uploadPending: boolean,
    deletePending: boolean,
}

// components/FileUploadSection.tsx
const FileUploadSection: React.FC<FileUploadSectionProps> = ({
    files,
    onUpload,
    onDelete,
    uploadPending,
    deletePending,
}) => {


    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.sampledesign?.delete;
    // const canList = role === "owner" || permission?.sampledesign?.list;
    const canCreate = role === "owner" || permission?.sampledesign?.create;
    const canEdit = role === "owner" || permission?.sampledesign?.edit;



    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const pdfFiles = files.filter(file => file.type === "pdf");
    const imageFiles = files.filter(file => file.type === "image");
    const [popupImage, setPopupImage] = useState<string | null>(null);

    {/* origianl version */ }
    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files?.length) {
    //         await onUpload(Array.from(e.target.files));
    //     }
    // };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setSelectedFiles(Array.from(e.target.files)); // ✅ Store selected files
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        // try {
        await onUpload(selectedFiles); // ✅ Upload only on button click
        // setSelectedFiles([]); // Optional: clear files after upload
        // toast({ description: 'File uploaded successfully', title: "Success" });

        // } catch (error: any) {
        //     toast({ title: "Error", description: error?.response?.data?.message || error.message || " Failed to upload the files", variant: "destructive" })
        // }
    };


    return (
        // <div className="bg-white h-auto rounded-lg p-2 sm:p-6">
        <div className="bg-brand-surface h-auto rounded-xl">
            {/* File Upload Section */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-full space-x-2">
                    {/* <label
                        htmlFor="fileInput"
                        className="cursor-pointer block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500"
                    >
                        Choose Files No file chosen
                    </label> */}
                    {(canCreate || canEdit) && <>
                        <input
                            id="fileInput"
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,image/*"
                            multiple
                            // className="mb-1 sm:mb-0 w-[55%] sm:w-[80%] h-full py-2 border-1 px-2 rounded-lg"

                            className="w-fullsm:mb-0 w-[55%] sm:w-[80%] py-2 px-3 border border-ash-medium bg-brand-ash rounded-lg text-sm text-text-main focus:ring-0 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-surface file:text-text-main hover:file:bg-ash-light cursor-pointer shadow-sm transition-all"
                            onChange={handleFileChange}

                        />

                        <Button
                            variant="white"
                            onClick={() => fileInputRef.current?.click()}
                            // className=""
                            className="hidden shrink-0 border-ash-medium"
                        >
                            <span className="hidden sm:block"> Select Files</span>
                            <span className="block sm:hidden"> Select</span>
                        </Button>
                        <Button
                            isLoading={uploadPending}
                            onClick={handleUpload}
                            className={`px-2 sm:px-4 py-2`}
                            variant="dark"
                        >
                            upload
                        </Button>
                    </>}
                </div>



            </div>

            {/* Files Display Section */}
            <div className="grid h-auto grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Files Section */}
                {/* <div className="border rounded-lg p-4"> */}
                <div className="border border-ash-medium bg-brand-surface rounded-xl p-5 shadow-sm">
                    {/* <div className="flex items-center gap-2 mb-4 text-blue-700"> */}
                    <div className="flex items-center gap-3 mb-5 border-b border-ash-light pb-3">
                        {/* <i className="fas fa-file-pdf text-lg" />
                        <h3 className="font-medium">PDF Files</h3> */}
                        <div className="w-8 h-8 rounded bg-brand-ash border border-ash-light flex items-center justify-center">
                            <i className="fas fa-file-pdf text-text-muted text-sm" />
                        </div>
                        <h3 className="font-bold text-text-main text-base">PDF Documents</h3>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar max-w-[100%] overflow-x-hidden">
                        {pdfFiles.length === 0 ? (
                            // <p className="text-gray-500 text-center py-4">No PDF files uploaded</p>
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-brand-ash rounded-lg border border-dashed border-ash-medium">
                                <i className="fas fa-file-invoice text-2xl text-ash-dark mb-2"></i>
                                <p className="text-text-muted text-sm font-medium">No PDF files uploaded</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-w-[100%]">
                                {pdfFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        // className="flex items-center max-w-full justify-between py-2 px-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                        className="flex items-center justify-between py-2.5 px-3.5 bg-brand-ash border border-ash-light rounded-lg hover:border-ash-medium transition-all group"
                                    >
                                        {/* <span className="text-gray-700 truncate whitespace-wrap max-w-[100%] flex-1 "> */}
                                        {/* <span className="text-text-main text-sm font-medium truncate flex-1 pr-4">
                                            {file.originalName || 'Unnamed PDF'}
                                        </span> */}

                                        <div className="flex items-center gap-3 flex-1 min-w-0">
      {/* PDF Icon added to the left */}
      <div className="shrink-0">
        <i className="fa-solid fa-file-pdf text-text-muted group-hover:text-action-danger transition-colors text-lg"></i>
      </div>
      
      <span className="text-text-main text-sm font-medium truncate pr-4">
        {file.originalName || 'Unnamed PDF'}
      </span>
    </div>

                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })} size="sm"

                                                // className="text-sm">
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-text-muted hover:text-text-main hover:!bg-brand-surface border border-transparent hover:border-ash-medium shadow-sm"
                                            >
                                                <i className="fa-solid fa-download"></i>
                                            </Button>

                                            {canDelete && <Button
                                                size="sm"
                                                isLoading={deletePending}
                                                onClick={() => onDelete((file as any)._id)}
                                                title="Delete"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-text-muted hover:text-action-danger hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm"
                                            >
                                                <i className="fas fa-trash" />
                                            </Button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Files Section */}
                {/* <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                        <i className="fas fa-images text-lg" />
                        <h3 className="font-medium">Image Files</h3>
                    </div> */}

                <div className="border border-ash-medium bg-brand-surface rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-5 border-b border-ash-light pb-3">
                        <div className="w-8 h-8 rounded bg-brand-ash border border-ash-light flex items-center justify-center">
                            <i className="fas fa-images text-text-muted text-sm" />
                        </div>
                        <h3 className="font-bold text-text-main text-base">Image Gallery</h3>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar max-w-[100%] overflow-x-hidden">
                        {imageFiles.length === 0 ? (
                            // <p className="text-gray-500 text-center py-4">No image files uploaded</p>
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-brand-ash rounded-lg border border-dashed border-ash-medium">
                                <i className="fas fa-image text-2xl text-ash-dark mb-2"></i>
                                <p className="text-text-muted text-sm font-medium">No images uploaded</p>
                            </div>
                        ) : (
                            <div className="bg-brand-ash p-3 rounded-lg border border-ash-light">
                                <ImageGalleryExample
                                    imageFiles={imageFiles}

                                    {...(canDelete ? { handleDeleteFile: onDelete } : {})}
                                    // className="grid grid-cols-3"
                                    height={80}
                                    minWidth={98}
                                    maxWidth={100}
                                />
                            </div>
                        )}



                    </div>
                </div>
            </div>


            {popupImage && (
                <div
                    onClick={() => setPopupImage(null)}
                    className="fixed inset-0 bg-black/70 z-50 p-8 bg-opacity-60 flex items-center justify-center"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded py-8 px-4 max-w-[90vw] max-h-[80vh] shadow-lg"
                    >
                        <i
                            className="fas fa-times absolute top-2 right-3 text-xl text-gray-700 hover:text-red-500 cursor-pointer"
                            onClick={() => setPopupImage(null)}
                        ></i>
                        <img
                            src={popupImage}
                            alt="Full View"
                            className="max-h-[70vh] w-auto object-contain rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};



export default FileUploadSection