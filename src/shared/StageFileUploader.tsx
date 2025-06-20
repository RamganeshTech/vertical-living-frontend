// components/common/RequirementFileUploader.tsx
import React, { useState } from "react";
import { useUploadRequirementFiles } from "../apiList/Stage Api/requirementFormApi";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../utils/toast";
import { Separator } from "../components/ui/Seperator";

interface UploadSectionProps {
    formId: string;
    existingUploads: {
        type: "image" | "pdf";
        url: string;
        originalName: string;
        uploadedAt: string;
    }[];
    onUploadComplete?: () => void;
    uploadFilesMutate: ({ formId, files }: { formId: string, files: any }) => Promise<any>,
    uploadPending: boolean
}

const RequirementFileUploader: React.FC<UploadSectionProps> = ({ formId, existingUploads = [], onUploadComplete, uploadFilesMutate, uploadPending }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!formId || selectedFiles.length === 0) return;
        try {
            await uploadFilesMutate({ formId, files: selectedFiles });
            toast({ title: "Success", description: "Files uploaded successfully." });
            setSelectedFiles([]);
            onUploadComplete?.();
        } catch (err: any) {
            toast({ title: "Upload Failed", description: err?.response?.data?.message || "Try again later.", variant: "destructive" });
        }
    };



    const handleDownload = async (url: string, filename: string) => {
        try {
            console.log("url", url)
            const res = await fetch(url, { mode: "no-cors" });
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download file");
        }
    };


    existingUploads = [
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
    ];


    const pdfFiles = existingUploads.filter((file) => file.type === "pdf");
    const imageFiles = existingUploads.filter((file) => file.type === "image");

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-700">Uploads</h3>

            <div className="flex gap-4 items-center">
                <Input type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf" />
                <Button onClick={handleUpload} isLoading={uploadPending} className="bg-blue-600 text-white">
                    Upload
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="">
                    <h4 className="font-semibold text-blue-800 mb-2">📄 PDF Files</h4>
                    <ul className="space-y-2">
                        {pdfFiles.map((file, i) => (
                            <li key={i} className="flex justify-between items-center bg-blue-50 p-2 rounded-xl">
                                <span>{file.originalName}</span>
                                <a href={file.url} target="_blank" download className="text-blue-600 underline">
                                    <i className="fa-solid fa-download"></i>
                                </a>
                            </li>
                        ))}
                        {pdfFiles.length === 0 && <p className="text-sm text-gray-500">No PDFs uploaded.</p>}
                    </ul>
                </div>

                {/* <Separator orientation="vertical" /> */}

                <div className="overflow-y-scroll">
                    <h4 className="font-semibold text-blue-800 mb-2">🖼️ Image Files</h4>
                    <ul className="space-y-2 overflow-y-scroll max-h-[150px]">
                        {imageFiles.map((file, i) => (
                            <li key={i} className="flex justify-between items-center bg-green-50 p-2 rounded-xl">
                                <span>{file.originalName}</span>
                                <div className="flex gap-2">
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                                        <i className="fa-solid fa-eye"></i>
                                    </a>
                                    <a href={file.url} target="_blank" download className="text-green-600 underline">
                                        <i className="fa-solid fa-download"></i>
                                    </a>

                                    <Button onClick={() => handleDownload(file.url, file.originalName)} className="text-green-600 text-sm">
                                        <i className="fa-solid fa-download"></i>
                                    </Button>

                                </div>
                            </li>
                        ))}
                        {imageFiles.length === 0 && <p className="text-sm text-gray-500">No images uploaded.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RequirementFileUploader;
