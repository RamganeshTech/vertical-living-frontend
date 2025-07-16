// components/common/RequirementFileUploader.tsx
import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../utils/toast";
import { downloadImage } from "../utils/downloadFile";

interface UploadSectionProps {
    formId: string;
    existingUploads: {
        type: "image" | "pdf";
        url: string;
        originalName: string;
        uploadedAt: string;
    }[];
    onUploadComplete?: () => void;
    uploadFilesMutate: ({ formId, files, projectId }: { formId: string, projectId: string, files: any }) => Promise<any>,
    uploadPending: boolean
    projectId: string,
    onDeleteUpload?: ({ fileId, projectId }: { fileId: string, projectId: string, }) => Promise<any>,
    deleteFilePending?: boolean
    refetch:()=> Promise<any>
}

const RequirementFileUploader: React.FC<UploadSectionProps> = ({ formId, projectId, refetch, existingUploads = [], onUploadComplete, uploadFilesMutate, uploadPending, onDeleteUpload, deleteFilePending }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [popupImage, setPopupImage] = useState<string | null>(null);



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!formId || selectedFiles.length === 0) return;
        try {
            await uploadFilesMutate({ formId, files: selectedFiles, projectId });
            toast({ title: "Success", description: "Files uploaded successfully." });
            setSelectedFiles([]);
            onUploadComplete?.();
        } catch (err: any) {
            toast({ title: "Upload Failed", description: err?.response?.data?.message || "Try again later.", variant: "destructive" });
        }
    };



    const handleDeleteFile = async (fileId: string) => {
        try {
            await onDeleteUpload?.({ fileId, projectId });
            toast({ title: "Success", description: "Files Deleted successfully." });
            refetch()
        } catch (err: any) {
            toast({ title: "Upload Failed", description: err?.response?.data?.message || "Try again later.", variant: "destructive" });
        }
    };

    const pdfFiles = existingUploads.filter((file) => file.type === "pdf");
    const imageFiles = existingUploads.filter((file) => file.type === "image");

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-700">Uploads</h3>

            <div className="flex gap-4 items-center">
                <Input type="file" multiple onChange={handleFileChange} accept="image/jpeg,image/png,application/pdf" />
                <Button onClick={handleUpload} isLoading={uploadPending} className="bg-blue-600 text-white">
                    Upload
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                    <h4 className="font-semibold text-blue-800 mb-2">📄 PDF Files</h4>
                    <ul className="space-y-2 max-h-[180px]  rounded-lg  border-2 border-[#5e5f612a] max-w-[100%] overflow-x-hidden custom-scrollbar overflow-y-auto ">
                        {pdfFiles.length === 0 && <div className="min-h-[145px]   flex items-center justify-center"><p className="text-sm text-gray-500">No PDFs uploaded.</p></div>}
                        {pdfFiles?.map((file, i) => (

                            <li key={i} className="flex justify-between items-center  bg-blue-50 p-2 rounded-xl">
                                <span className="truncate whitespace-wrap max-w-[100%]">{file.originalName}</span>
                                <div className="flex gap-2 items-center">
                                    {/* <a href={file.url} target="_blank" download className="text-blue-600 underline">
                                        <i className="fa-solid fa-download"></i>
                                    </a> */}

                                    <Button  onClick={() => downloadImage({src:file?.url, alt:file?.originalName || "file.pdf"})} size="sm" className="text-sm">
                                        <i className="fa-solid fa-download"></i>
                                    </Button>

                                    <Button size="sm" isLoading={deleteFilePending} onClick={() => handleDeleteFile((file as any)?._id)} className="text-green-600 text-sm">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </Button>
                                </div>
                            </li>
                        ))}
                        {/* {pdfFiles.length === 0 && <p className="text-sm text-gray-500">No PDFs uploaded.</p>} */}
                    </ul>
                </div>

                {/* <Separator orientation="vertical" /> */}

                <div className="overflow-y-auto">
                    <h4 className="font-semibold text-blue-800 mb-2">🖼️ Image Files</h4>
                    <ul className="space-y-2  max-h-[180px] rounded-lg border-2 border-[#5e5f612a] max-w-[100%] overflow-x-hidden custom-scrollbar overflow-y-auto custom-scrollbar">
                        {imageFiles.length === 0 && <div className="min-h-[145px]  flex items-center justify-center"><p className="text-sm text-gray-500">No Images uploaded.</p></div>}

                        {imageFiles.map((file, i) => (
                            <li key={i} className="flex justify-between items-center bg-green-50 sm:p-2 p-1 rounded-xl">
                                <span className="truncate whitespace-wrap max-w-[100%]">{file.originalName}</span>
                                <div className="flex gap-2 items-center">
                                    {/* <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        <i className="fa-solid fa-eye"></i>
                                    </a> */}

                                    <Button size="sm"
                                        variant="primary"
                                        onClick={() => setPopupImage(file?.url)}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </Button>

                                    <Button size="sm" onClick={() => downloadImage({src:file.url, alt:file.originalName || "file.pdf"})} className="text-sm">
                                        <i className="fa-solid fa-download"></i>
                                    </Button>

                                    <Button size="sm" isLoading={deleteFilePending} onClick={() => handleDeleteFile((file as any)?._id)} className="text-blue-600 text-sm">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </Button>

                                </div>
                            </li>
                        ))}
                        {/* {imageFiles.length === 0 && <p className="text-sm text-gray-500">No images uploaded.</p>} */}
                    </ul>
                </div>
            </div>


            {popupImage && (
                <div
                    onClick={() => setPopupImage(null)}
                    className="fixed inset-0 z-50 p-8 bg-opacity-60 flex items-center justify-center"
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

export default RequirementFileUploader;
