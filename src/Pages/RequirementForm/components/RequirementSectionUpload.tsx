import React, { useState } from "react";
import { useDeleteRequirementSectionFile, useUploadRequirementSectionFiles } from "../../../apiList/Stage Api/requirementFormApi";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { Input } from "../../../components/ui/Input";
import { downloadImage } from "../../../utils/downloadFile";
// import { NO_IMAGE } from "../../../constants/constants";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import VideoGalleryMain from "../../../shared/VideoGallery/VideoGalleryMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

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


  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.clientrequirement?.delete;
  // const canList = role === "owner" || permission?.clientrequirement?.list;
  const canCreate = role === "owner" || permission?.clientrequirement?.create;
  const canEdit = role === "owner" || permission?.clientrequirement?.edit;



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

  const pdfActions = ["eye", "download", ...(canDelete ? ["trash"] : [])];


  return (
    <div className="space-y-4 w-full">
      {/* Upload Button */}
      <div className="flex relative items-center justify-between w-full">
        {(canCreate || canEdit) && <Input
          type="file"
          multiple
          placeholder="select files"
          // className="h-10"
          onChange={handleUpload}
          disabled={isUploading}
          // className={isUploading ? "pr-10 opacity-70 cursor-not-allowed w-full" : ""}
          className={`w-full  border border-ash-medium text-text-main file:bg-brand-surface file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all shadow-sm ${isUploading ? "pr-10 opacity-70 cursor-not-allowed" : ""}`}
        />}

        {isUploading && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <i className="fas fa-circle-notch fa-spin text-text-muted text-lg"></i>
          </div>
        )}
      </div>


      {/* File Previews */}
      {/* <h3 className="text-lg font-semibold mb-4 text-gray-800">PDFs</h3> */}
      <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        <i className="fas fa-file-pdf"></i> PDF Documents
      </h3>


      {pdfFiles.length === 0 && (
        <div className="text-center py-6 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No PDFs uploaded yet.</p>
        </div>
      )
      }
      {pdfFiles?.map((type) => {
        // const files = existingUploads.filter((file) => file.type === type)
        // const isPdf = type === "pdf"

        return (
          <div key={type.url} className="mt-6">
            <div


              className={`relative space-y-4 group flex justify-between items-center px-4 py-3 rounded-lg shadow-sm bg-brand-surface border border-ash-medium`}

            >

              <div className="flex items-center space-x-3 w-[190px] sm:w-3/2 lg:w-full">
                {/* <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg text-red-600"> */}
                <div className="w-10 h-10 bg-brand-ash border border-ash-light flex items-center justify-center rounded-lg shrink-0 shadow-sm">
                  <i className="fas fa-file-pdf text-action-danger text-xl" />
                </div>
                {/* <span className="text-sm font-medium !truncate max-w-[100%] whitespace-wrap">{type.originalName}</span> */}
                <span className="text-sm font-bold text-text-main truncate max-w-[200px] sm:max-w-[300px]">
                  {type.originalName}
                </span>
              </div>
              <div className="flex ">
                {pdfActions.map((action) => (
                  <Button
                    key={action}
                    variant="white"
                    size="sm"
                    onClick={() =>
                      action === "eye"
                        ? window.open(type.url, "_blank")
                        : action === "trash"
                          ? handleDelete(type._id)
                          : downloadImage({ src: type?.url, alt: type?.originalName || "file.pdf" })
                    }
                    disabled={action === "trash" && isDeleting}
                    // className="hover:bg-gray-100 shadow-sm"
                    className="border-ash-medium text-text-main shadow-sm hover:text-action-primary"
                  >
                    {/* <i
                      className={` fas fa-${action} 
                      ${action === "trash"
                        ? "text-red-500"
                        : action === "download"
                          ? "text-blue-500"
                          : "text-gray-600"
                        }`}
                    /> */}

                    <i
                      className={` fas fa-${action} 
                     text-text-main
                        `}
                    />
                  </Button>
                ))}
              </div>

            </div>

          </div>
        )
      })}

      <div className="mt-6 w-full ">
        {/* <h3 className="text-lg font-semibold mb-4 text-gray-800"> Images </h3> */}
        <h3 className="text-[11px] font-bold text-text-muted mb-3 flex items-center gap-2">
            <i className="fas fa-image"></i> Images
        </h3>
        {imageFiles?.length === 0 ? (
         <div className="text-center py-6 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No Images uploaded yet.</p>
          </div>
        ) : <>
          <div className="">
            <ImageGalleryExample
              imageFiles={imageFiles}

              refetch={refetch}
              //  handleDeleteFile={handleDelete}
              height={190}
              minWidth={156}
              maxWidth={100}
              // className="flex-1 flex  flex-wrap w-[100px] border"
              {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
            />
          </div>

        </>
        }
      </div>

      <div className="mt-6 w-full ">
        {/* <h3 className="text-lg font-semibold mb-4 text-gray-800"> Videos </h3> */}
        <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fas fa-video"></i> Videos
        </h3>
        {videoFiles?.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
             <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No Videos uploaded yet.</p>
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
              // handleDeleteFile={handleDelete}
              // /                            {...(canDelete ? { handleDeleteFile:  } : {})}


              isDeleting={isDeleting}
              height={190}
              minWidth={156}
              maxWidth={100}
              {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
            />
          </div>

        </>
        }
      </div>

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-brand-main/90">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-brand-surface rounded-lg shadow-lg max-w-[80%] max-h-[80%] p-2">

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

// return (
// <div className="space-y-6 w-full">
//       {/* Upload Button */}
//       <div className="flex relative items-center justify-between w-full">
//         {(canCreate || canEdit) && (
//           <Input
//             type="file"
//             multiple
//             placeholder="select files"
//             onChange={handleUpload}
//             disabled={isUploading}
//             className={`w-full bg-brand-ash border border-ash-medium text-text-main file:bg-brand-surface file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all shadow-sm ${isUploading ? "pr-10 opacity-70 cursor-not-allowed" : ""}`}
//           />
//         )}

//         {isUploading && (
//           <div className="absolute inset-y-0 right-3 flex items-center">
//             <i className="fas fa-circle-notch fa-spin text-text-muted text-lg"></i>
//           </div>
//         )}
//       </div>

//       {/* File Previews: PDFs */}
//       <div className="w-full">
//         <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
//           <i className="fas fa-file-pdf"></i> PDF Documents
//         </h3>

//         {pdfFiles.length === 0 ? (
//           <div className="text-center py-6 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
//             <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No PDFs uploaded yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {pdfFiles?.map((file) => (
//               <div
//                 key={file.url}
//                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 rounded-xl shadow-sm bg-brand-surface border border-ash-medium hover:bg-brand-ash/50 transition-colors gap-3"
//               >
//                 <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
//                   <div className="w-10 h-10 bg-brand-ash border border-ash-light flex items-center justify-center rounded-lg shrink-0 shadow-sm">
//                     <i className="fas fa-file-pdf text-action-danger text-xl" />
//                   </div>
//                   <span className="text-sm font-bold text-text-main truncate max-w-[200px] sm:max-w-[300px]">
//                     {file.originalName}
//                   </span>
//                 </div>
                
//                 <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
//                   {pdfActions.map((action) => (
//                     <Button
//                       key={action}
//                       variant={action === "trash" ? "ghost" : "white"}
//                       size="sm"
//                       onClick={() =>
//                         action === "eye"
//                           ? window.open(file.url, "_blank")
//                           : action === "trash"
//                             ? handleDelete(file._id)
//                             : downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })
//                       }
//                       disabled={action === "trash" && isDeleting}
//                       className={
//                         action === "trash" 
//                           ? "text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 shadow-sm transition-all" 
//                           : "border-ash-medium text-text-main shadow-sm hover:text-action-primary transition-colors"
//                       }
//                       title={action === "trash" ? "Delete" : action === "eye" ? "View" : "Download"}
//                     >
//                       <i className={`fas fa-${action === "trash" ? "trash-can" : action}`} />
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* File Previews: Images */}
//       <div className="w-full">
//         <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
//           <i className="fas fa-image"></i> Images
//         </h3>
        
//         {imageFiles?.length === 0 ? (
//           <div className="text-center py-6 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
//             <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No Images uploaded yet.</p>
//           </div>
//         ) : (
//           <div className="bg-brand-ash/30 border border-ash-light p-4 rounded-xl">
//             <ImageGalleryExample
//               imageFiles={imageFiles}
//               refetch={refetch}
//               height={120}
//               minWidth={110}
//               maxWidth={140}
//               {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
//             />
//           </div>
//         )}
//       </div>

//       {/* File Previews: Videos */}
//       <div className="w-full">
//         <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
//           <i className="fas fa-video"></i> Videos
//         </h3>
        
//         {videoFiles?.length === 0 ? (
//           <div className="text-center py-6 border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
//              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">No Videos uploaded yet.</p>
//           </div>
//         ) : (
//           <div className="bg-brand-ash/30 border border-ash-light p-4 rounded-xl">
//             <VideoGalleryMain
//               videoFiles={videoFiles}
//               refetch={refetch}
//               isDeleting={isDeleting}
//               height={140}
//               minWidth={160}
//               maxWidth={200}
//               {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
//             />
//           </div>
//         )}
//       </div>

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <div 
//           onClick={() => setPreviewImage(null)} 
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-main/90 backdrop-blur-md p-4"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()} 
//             className="relative bg-brand-surface rounded-xl shadow-2xl border border-ash-medium p-2 max-w-[90vw] max-h-[90vh] animate-in fade-in zoom-in duration-200"
//           >
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute -top-4 -right-4 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all z-10"
//             >
//               <i className="fas fa-times text-lg"></i>
//             </button>
//             <img
//               src={previewImage}
//               alt="preview image"
//               className="max-h-[85vh] w-auto object-contain mx-auto rounded-lg"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//     )
};

export default RequirementSectionUpload;
