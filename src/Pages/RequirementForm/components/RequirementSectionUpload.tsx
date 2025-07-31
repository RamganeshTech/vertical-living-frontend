import React, { useState } from "react";
import { useDeleteRequirementSectionFile, useUploadRequirementSectionFiles } from "../../../apiList/Stage Api/requirementFormApi";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { Input } from "../../../components/ui/Input";
import { downloadImage } from "../../../utils/downloadFile";
import { NO_IMAGE } from "../../../constants/constants";

interface UploadEntry {
    _id: string;
    url: string;
    originalName: string;
    type: "image" | "pdf";
    uploadedAt: string;
}

interface RequirementSectionUploadProps {
    projectId: string;
    sectionName: string;
    existingUploads: UploadEntry[];
    // onRefresh?: () => void;
}

const RequirementSectionUpload: React.FC<RequirementSectionUploadProps> = ({
    projectId,
    sectionName,
    existingUploads,
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadRequirementSectionFiles();
    const { mutateAsync: deleteFile, isPending: isDeleting } = useDeleteRequirementSectionFile();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = event.target.files;
            if (!files || files.length === 0) return;

            const formData = new FormData();
            for (const file of Array.from(files)) {
                formData.append("file", file);
            }

            await uploadFiles({ projectId, sectionName, files: formData });
            toast({ title: "Success", description: "file uploaded successfully" })

        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to upload", variant: "destructive" })

        }
    };

    const handleDelete = async (fileId: string) => {
        try {

            await deleteFile({ projectId, sectionName, fileId });
            toast({ title: "Success", description: "file deleted successfully" })

        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete", variant: "destructive" })

        }
    };



   

    return (
        <div className="space-y-4 w-full">
            {/* Upload Button */}
            <div className="flex relative items-center justify-between w-full">
                <Input
                    type="file"
                    multiple
                    placeholder="select files"
                    // className="h-10"
                    onChange={handleUpload}
                    disabled={isUploading}
                    className={isUploading ? "pr-10 opacity-70 cursor-not-allowed w-full" : ""}
                />
                {isUploading && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        {/* <svg
                            className="animate-spin h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                            />
                        </svg> */}
                        <div className="animate-spin h-5 w-5 border-t-transparent rounded-full border-2 border-gray-500"></div>
                    </div>
                )}
            </div>

           


             {/* File Previews */}
      {["pdf", "image"].map((type) => {
        const files = existingUploads.filter((file) => file.type === type)
        const isPdf = type === "pdf"

        return (
          <div key={type} className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{isPdf ? "PDFs" : "Images"}</h3>
            {files.length === 0 ? (
              <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
                No {isPdf ? "PDFs" : "Images"} uploaded yet.
              </div>
            ) : (
              <div
                className={
                  isPdf
                    ? "space-y-4"
                    : "grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-3  bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                }
              >
                {files.map((file) => (
                  <div
                    key={file._id}
                    className={`relative group ${
                      isPdf
                        ? "flex justify-between items-center px-4 py-3 border rounded-lg shadow-sm bg-white"
                        : `transition-all duration-300 hover:scale-105 hover:z-10`
                    }`}
                    
                  >
                    {isPdf ? (
                      <>
                        <div className="flex items-center space-x-3 w-[190px] sm:w-3/2 lg:w-full">
                          <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg text-red-600">
                            <i className="fas fa-file-pdf text-xl" />
                          </div>
                          <span className="text-sm font-medium !truncate max-w-[100%] whitespace-wrap">{file.originalName}</span>
                        </div>
                        <div className="flex ">
                          {["eye", "trash", "download"].map((action) => (
                            <Button
                              key={action}
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                action === "eye"
                                  ? window.open(file.url, "_blank")
                                  : action === "trash"
                                    ? handleDelete(file._id)
                                    : downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })
                              }
                              disabled={action === "trash" && isDeleting}
                              className="hover:bg-gray-100 shadow-sm"
                            >
                              <i
                                className={` fas fa-${action} ${
                                  action === "trash"
                                    ? "text-red-500"
                                    : action === "download"
                                      ? "text-blue-500"
                                      : "text-gray-600"
                                }`}
                              />
                            </Button>
                          ))}
                        </div>
                      </>
                    ) : (
                       <>
                        {/* Image Container - Clickable for preview */}
                        <div
                          className="relative w-full bg-white rounded-lg shadow-md  border-4 border-white group-hover:shadow-xl transition-all duration-300 cursor-pointer"
                          onClick={() => setPreviewImage(file?.url)}
                        >
                          <div className="h-[100px] min-w-fit sm:w-full">
                            <img
                              src={file.url || NO_IMAGE}
                              alt={file.originalName}
                              className="!w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>

                          {/* Desktop Hover Overlay */}
                          <div className="absolute inset-6 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 items-center justify-center hidden sm:flex">
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-8 group-hover:translate-y-8">
                              {["eye", "trash", "download"].map((action) => (
                                <Button
                                  key={action}
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    action === "eye"
                                      ? setPreviewImage(file?.url)
                                      : action === "trash"
                                        ? handleDelete(file._id)
                                        : downloadImage({ src: file?.url, alt: file?.originalName || "image" })
                                  }}
                                  disabled={action === "trash" && isDeleting}
                                  className={`rounded-full bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 ${
                                    action === "trash" ? "hover:bg-red-50" : ""
                                  }`}
                                >
                                  <i
                                    className={` fas fa-${action} ${
                                      action === "trash"
                                        ? "text-red-500"
                                        : action === "download"
                                          ? "text-blue-500"
                                          : "text-gray-600"
                                    }`}
                                  />
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Mobile Action Buttons - Inside Image at Top Right */}
                          <div className="absolute top-2 right-[2px] flex flex-col space-y-1 sm:hidden">
                            {["eye", "trash", "download"].map((action) => (
                              <Button
                                key={action}
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  action === "eye"
                                    ? setPreviewImage(file?.url)
                                    : action === "trash"
                                      ? handleDelete(file._id)
                                      : downloadImage({ src: file?.url, alt: file?.originalName || "image" })
                                }}
                                disabled={action === "trash" && isDeleting}
                                className={` rounded-full bg-white/90 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                                  action === "trash"
                                    ? "border-red-200 hover:border-red-300 hover:bg-red-50"
                                    : action === "download"
                                      ? "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <i
                                  className={`w-3 h-3 fas fa-${action} ${
                                    action === "trash"
                                      ? "text-red-500"
                                      : action === "download"
                                        ? "text-blue-500"
                                        : "text-gray-600"
                                  }`}
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

            {previewImage && (
                <div onClick={() => setPreviewImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div onClick={(e)=> e.stopPropagation()} className="relative bg-black/70 rounded-lg shadow-lg max-w-[80%] max-h-[80%] p-2">
                       
                        <img
                            src={previewImage}
                            alt={"preview image"}
                            className="w-[80vw] max-h-[70vh] object-cpntain mx-auto"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default RequirementSectionUpload;
