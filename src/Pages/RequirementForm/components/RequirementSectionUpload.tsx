import React, { useState } from "react";
import { useDeleteRequirementSectionFile, useUploadRequirementSectionFiles } from "../../../apiList/Stage Api/requirementFormApi";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { Input } from "../../../components/ui/Input";
import { downloadImage } from "../../../utils/downloadFile";
// import { NO_IMAGE } from "../../../constants/constants";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import VideoGalleryMain from "../../../shared/VideoGallery/VideoGalleryMain";

interface UploadEntry {
  _id: string;
  url: string;
  originalName: string;
  type: "image" | "pdf" | "video";
  uploadedAt: string;
}

interface RequirementSectionUploadProps {
  projectId: string;
  sectionName: string;
  existingUploads: UploadEntry[];
  refetch: () => Promise<any>;
}

const RequirementSectionUpload: React.FC<RequirementSectionUploadProps> = ({
  projectId,
  sectionName,
  refetch,
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
      refetch()
      toast({ title: "Success", description: "file uploaded successfully" })

    }
    catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to upload", variant: "destructive" })

    }
  };

  const handleDelete = async (fileId: string) => {
    try {

      await deleteFile({ projectId, sectionName, fileId });
      refetch()
      toast({ title: "Success", description: "file deleted successfully" })

    }
    catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete", variant: "destructive" })

    }
  };


  const imageFiles = existingUploads.filter(image => image.type === "image")
  const pdfFiles = existingUploads?.filter(file => file.type === "pdf")
  const videoFiles = existingUploads?.filter(file => file.type === "video")



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
            <div className="animate-spin h-5 w-5 border-t-transparent rounded-full border-2 border-gray-500"></div>
          </div>
        )}
      </div>


      {/* File Previews */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">PDFs</h3>


      {pdfFiles.length === 0 && (
        <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
          No Pdfs uploaded yet.
        </div>
      )
      }
      {pdfFiles?.map((type) => {
        // const files = existingUploads.filter((file) => file.type === type)
        // const isPdf = type === "pdf"

        return (
          <div key={type.url} className="mt-6">
            <div


              className={`relative space-y-4 group flex justify-between items-center px-4 py-3 border rounded-lg shadow-sm bg-white`}

            >

              <div className="flex items-center space-x-3 w-[190px] sm:w-3/2 lg:w-full">
                <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg text-red-600">
                  <i className="fas fa-file-pdf text-xl" />
                </div>
                <span className="text-sm font-medium !truncate max-w-[100%] whitespace-wrap">{type.originalName}</span>
              </div>
              <div className="flex ">
                {["eye", "trash", "download"].map((action) => (
                  <Button
                    key={action}
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      action === "eye"
                        ? window.open(type.url, "_blank")
                        : action === "trash"
                          ? handleDelete(type._id)
                          : downloadImage({ src: type?.url, alt: type?.originalName || "file.pdf" })
                    }
                    disabled={action === "trash" && isDeleting}
                    className="hover:bg-gray-100 shadow-sm"
                  >
                    <i
                      className={` fas fa-${action} ${action === "trash"
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

          </div>
        )
      })}

      <div className="mt-6 w-full ">
        <h3 className="text-lg font-semibold mb-4 text-gray-800"> Images </h3>
        {imageFiles?.length === 0 ? (
          <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
            No Images uploaded yet.
          </div>
        ) : <>
          <div className="">
            <ImageGalleryExample
              imageFiles={imageFiles} refetch={refetch} handleDeleteFile={handleDelete}
              height={190}
              minWidth={156}
              maxWidth={100}
            // className="flex-1 flex  flex-wrap w-[100px] border"
            />
          </div>

        </>
        }
      </div>

      <div className="mt-6 w-full ">
        <h3 className="text-lg font-semibold mb-4 text-gray-800"> Videos </h3>
        {videoFiles?.length === 0 ? (
          <div className="text-gray-500 text-sm italic bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-200">
            No Videos uploaded yet.
          </div>
        ) : <>
          <div className="">
            {/* <ImageGalleryExample
              imageFiles={videoFiles} refetch={refetch} handleDeleteFile={handleDelete}
              height={190}
              minWidth={156}
              maxWidth={100}
            // className="flex-1 flex  flex-wrap w-[100px] border"
            /> */}


            <VideoGalleryMain
              videoFiles={videoFiles}
              refetch={refetch}
              handleDeleteFile={handleDelete}
              isDeleting={isDeleting}
              height={190}
              minWidth={156}
              maxWidth={100}
            />
          </div>

        </>
        }
      </div>

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-black/70 rounded-lg shadow-lg max-w-[80%] max-h-[80%] p-2">

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
