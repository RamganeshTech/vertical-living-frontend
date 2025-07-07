import { useRef, useState } from "react";
import type { IFileItem } from "../../../types/types";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";

interface FileUploadSectionProps {

    files: IFileItem[];
    onUpload: (files: File[]) => Promise<void>;
    onDelete: (index: number) => Promise<void>;
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const pdfFiles = files.filter(file => file.type === "pdf");
    const imageFiles = files.filter(file => file.type === "image");

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

        try {
            await onUpload(selectedFiles); // ✅ Upload only on button click
            // setSelectedFiles([]); // Optional: clear files after upload
            toast({ description: 'File uploaded successfully', title: "Success" });

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || " Failed to upload the files", variant: "destructive" })
        }
    };

    return (
        <div className="bg-white h-auto rounded-lg p-6">
            {/* File Upload Section */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-full space-x-2">
                    {/* <label
                        htmlFor="fileInput"
                        className="cursor-pointer block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500"
                    >
                        Choose Files No file chosen
                    </label> */}
                    <input
                        id="fileInput"
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,image/*"
                        multiple
                        className=" w-[80%] h-full py-2 border-1 px-2 rounded-lg"
                        onChange={handleFileChange}

                    />

                    <Button
                        variant="primary"
                        onClick={() => fileInputRef.current?.click()}
                        className=""
                    >
                        Select Files
                    </Button>
                    <Button
                        isLoading={uploadPending}
                        onClick={handleUpload}
                        className={`px-6 py-2 rounded-lg`}
                        variant="primary"
                    >
                        upload
                    </Button>
                </div>


                {/* Optional: Show selected file names */}
                {/* {selectedFiles.length > 0 && (
                    <ul className="mt-4 text-sm text-gray-700">
                        {selectedFiles.map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                        ))}
                    </ul>
                )} */}

                {/* origianl version */}
                {/* <Button
                    isLoading={uploadPending}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Upload
                </Button> */}
            </div>

            {/* Files Display Section */}
            <div className="grid h-auto grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Files Section */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                        <i className="fas fa-file-pdf text-lg" />
                        <h3 className="font-medium">PDF Files</h3>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar max-w-[100%] overflow-x-hidden">
                        {pdfFiles.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No PDF files uploaded</p>
                        ) : (
                            <div className="space-y-2 max-w-[100%]">
                                {pdfFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center max-w-full justify-between py-2 px-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <span className="text-gray-700 truncate whitespace-wrap max-w-[100%] flex-1 ">
                                            {file.originalName || 'Unnamed PDF'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={file.url}
                                                download
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Download"
                                            >
                                                <i className="fas fa-download" />
                                            </a>
                                            <Button
                                                isLoading={deletePending}
                                                onClick={() => onDelete(index)}
                                                // className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Files Section */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                        <i className="fas fa-images text-lg" />
                        <h3 className="font-medium">Image Files</h3>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar max-w-[100%] overflow-x-hidden">
                        {imageFiles.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No image files uploaded</p>
                        ) : (
                            <div className="space-y-2 max-w-[100%] ">
                                {imageFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center max-w-full justify-between py-2 px-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        {/* <div className="flex items-center gap-2 flex-1"> */}
                                            <span className="text-gray-700 truncate whitespace-wrap max-w-[80%] ">
                                                {file.originalName || 'Unnamed Image'}
                                            </span>
                                        {/* </div> */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => window.open(file.url, '_blank')}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="View"
                                            >
                                                {/* <i className="fas fa-eye" /> */}
                                            </button>
                                            <a
                                                href={file.url}
                                                download
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Download"
                                            >
                                                <i className="fas fa-download" />
                                            </a>
                                            <Button
                                                isLoading={deletePending}
                                                onClick={() => onDelete(index)}
                                                // className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default FileUploadSection