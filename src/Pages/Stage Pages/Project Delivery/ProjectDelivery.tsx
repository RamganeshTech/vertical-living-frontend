import React, { useRef, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  useUploadProjectDeliveryFiles,
  useDeleteProjectDeliveryFile,
  useGetProjectDeliveryDetails,
  useUpdateClientConfirmation,
  useUpdateOwnerConfirmation,
  useSetprojectDeliveryDeadline,
  useCompleteprojectDelivery,
} from "../../../apiList/Stage Api/projectDeliveryApi";

import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import AssignStageStaff from "../../../shared/AssignStaff";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { downloadImage } from "../../../utils/downloadFile";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

type ProjectDetailsOutlet = {
  isMobile: boolean;
  openMobileSidebar: () => void;
};

export default function ProjectDeliveryPanel() {
  const { projectId, organizationId } = useParams() as { projectId: string; organizationId: string }
  const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetProjectDeliveryDetails(projectId);

  const { mutateAsync: uploadFilesAsync, isPending: uploadPending } = useUploadProjectDeliveryFiles();
  const { mutateAsync: deleteFileAsync, isPending: deletePending, variables } = useDeleteProjectDeliveryFile();
  const { mutateAsync: clientConfirmAsync } = useUpdateClientConfirmation();
  const { mutateAsync: ownerConfirmAsync } = useUpdateOwnerConfirmation();
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetprojectDeliveryDeadline();
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteprojectDelivery();


  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.projectdelivery?.delete;
  // const canList = role === "owner" || permission?.projectdelivery?.list;
  const canCreate = role === "owner" || permission?.projectdelivery?.create;
  const canEdit = role === "owner" || permission?.projectdelivery?.edit;


  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId, organizationId });
      toast({ description: "Project Delivery marked as complete.", title: "Success" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast({
        title: "Error",
        description: "Please select at least one file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadFilesAsync({ projectId, formData });
      toast({ title: "Success", description: "Files uploaded successfully." });
      refetch();
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Upload failed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFileAsync({ projectId, fileId });
      toast({ title: "Success", description: "File deleted." });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Deletion failed",
        variant: "destructive",
      });
    }
  };

  const handleConfirm = async (type: "client" | "owner") => {
    const confirmFn = type === "client" ? clientConfirmAsync : ownerConfirmAsync;
    try {
      await confirmFn({ projectId, confirm: !data?.[`${type}Confirmation`] });
      toast({ title: "Success", description: `${type === "client" ? "Client" : "Owner"} confirmation updated.` });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update confirmation",
        variant: "destructive",
      });
    }
  };

  let pdfFiles = (data?.uploads || [])?.filter((file: any) => file.type === "pdf");
  let imageFiles = (data?.uploads || [])?.filter((file: any) => file.type === "image");

  if (isLoading) return <MaterialOverviewLoading />

  return (
    // <div className="w-full sm:min-h-full sm:overflow-y-auto space-y-6 py-1 sm:py-0">
    <div className="w-full sm:min-h-full sm:overflow-y-auto bg-brand-surface space-y-6 py-1 sm:py-0">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-4pb-4"> */}
      <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-5 mb-8 pb-4 border-b border-ash-light">
        {/* <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center"> */}
        <h2 className="text-xl sm:text-3xl font-bold text-text-main flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              // className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
          )}
          {/* <i className="fas fa-handshake mr-2" /> */}
          <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
            <i className="fas fa-handshake text-text-muted text-lg" />
          </div>
          Project Delivery
        </h2>

        <section className="flex gap-2 items-center">  
        {(canCreate || canEdit) && 
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            // className="bg-green-600 hover:bg-green-700 text-white"
            variant="dark"
            className="flex-1 sm:flex-initial min-w-max px-6 shadow-sm"
          >
            <i className="fa-solid fa-circle-check mr-2 text-action-success" />
            Mark as Complete
          </Button>


          {/* {!fetchError && <ShareDocumentWhatsapp
            projectId={projectId!}
            stageNumber="14"
            className="w-full sm:w-fit"
            isStageCompleted={data?.status}
          />} */}

          <AssignStageStaff
            projectId={projectId}
            organizationId={organizationId}
            stageName="ProjectDeliveryModel"
            currentAssignedStaff={data?.assignedTo || null}
            className="w-full sm:w-auto"
          />
        </div>}

          <div className="w-full sm:w-auto flex justify-end sm:block">
            <StageGuide
              organizationId={organizationId!}
              stageName="projectdelivery"
            />
          </div>
        </section>
      </div>

      {/* If error, show only above header and handle block */}
      {fetchError ? (


        // <div className="max-w-xl mx-auto bg-brand-surface border border-action-danger rounded-xl shadow-sm p-6 text-center mt-8">
        //   <div className="text-action-danger text-3xl font-bold mb-3">
        //     <i className="fa-solid fa-triangle-exclamation"></i>
        //   </div>
        //   <div className="text-text-main text-lg font-bold mb-2">Error Loading Data</div>
        //   <p className="text-sm text-text-muted mb-5">
        //     {(fetchError as any)?.response?.data?.message ||
        //       (fetchError as any)?.message ||
        //       "Something went wrong while fetching project delivery details."}
        //   </p>
        //   <Button
        //     onClick={() => refetch()}
        //     isLoading={isLoading}
        //     variant="outline"
        //     className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
        //   >
        //     Retry
        //   </Button>
        // </div>

        <div className="max-w-xl mx-auto p-8 bg-brand-surface border-2 border-ash-medium rounded-xl shadow-sm text-center mt-8">

          {/* Soft, neutral icon wrapper instead of a stark warning */}
          <div className="w-16 h-16 bg-brand-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 border border-ash-medium shadow-sm">
            <i className="fa-solid fa-lock text-text-muted text-2xl"></i>
          </div>

          {/* Professional, non-alarming title */}
          <div className="text-text-strong text-lg font-bold mb-2">
            Stage Not Yet Available
          </div>

          {/* Clear explanation of the business logic */}
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto leading-relaxed">
            {/* {(getAllError as any)?.response?.data?.message} */}
            This section is currently locked. Please ensure all required steps in the previous stage are fully completed before accessing this information.
          </p>

          {/* Neutral action button */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-ash-medium text-text-main hover:text-action-primary hover:border-action-primary hover:bg-brand-surface-hover transition-all px-3 shadow-sm"
          >
            <i className="fas fa-sync-alt mr-2 text-text-soft"></i> Refresh
          </Button>

        </div>

      ) : (
        <>
          {/* Stage Timer */}
          {/* <Card className="p-4 border-l-[4px] border-blue-600 shadow w-full">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg" />
              <span>Stage Timings</span>
            </div> */}
          <Card className="p-5 shadow-none border-2 border-ash-medium rounded-xl bg-brand-surface w-full">
            <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
              <i className="fa-regular fa-clock text-ash-dark text-base" />
              <span>Stage Timings</span>
            </div>

            <StageTimerInfo
              completedAt={data?.timer?.completedAt}
              stageName="projectdelivery"
              projectId={projectId}
              formId={data?._id}
              deadLine={data?.timer?.deadLine}
              startedAt={data?.timer?.startedAt}
              refetchStageMutate={refetch}
              deadLineMutate={deadLineAsync}
              isPending={deadLinePending}
            />
          </Card>

          {/* 🧾 File Upload */}
          {/* <Card className="p-6 border-2 border-blue-200 shadow w-full flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-3">
                <i className="fas fa-paperclip mr-2 text-blue-600" />
                Upload Files
              </h2> */}


          <Card className="p-5 sm:p-6 border-2 border-ash-medium bg-brand-surface shadow-sm w-full flex flex-col gap-6 rounded-xl">
            <div className="border-b border-ash-light pb-5">
              <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <i className="fas fa-paperclip text-text-muted" />
                Upload Delivery Files
              </h2>


              {(canCreate || canEdit) && <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <input
                  multiple
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,image/*"
                  // className="w-full sm:w-[300px] border border-blue-300 px-3 py-2 rounded text-sm"
                  className="w-full sm:w-[350px] border border-ash-medium bg-brand-ash text-text-main file:bg-brand-surface file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all"
                />

                <Button
                  onClick={handleUpload}
                  isLoading={uploadPending}
                  // className="bg-blue-600 text-white hover:bg-blue-700"
                  variant="dark"
                  className="shadow-sm px-6"
                >
                  <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                  Upload Files
                </Button>
              </div>}
            </div>

            {/* Uploaded Files (PDF & Images) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 📑 PDF Files */}
              {/* <div className="min-h-[220px] sm:max-h-[150px] sm:min-h-[150px] border-2 border-[#0a0a0a18] px-2 rounded-xl lg:min-h-[280px]  overflow-y-auto custom-scrollbar"> */}
              <div className="min-h-[220px] lg:min-h-[280px] border border-ash-medium bg-brand-ash p-4 rounded-xl overflow-y-auto custom-scrollbar flex flex-col">
                {/* <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-file-pdf" />
                  PDF Files
                </h3> */}

                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                  <i className="fas fa-file-pdf text-text-muted" />
                  PDF Files
                </h3>
                {pdfFiles.length === 0 ? (
                  // <div className="h-[85%] shadow rounded bg-blue-50 flex items-center justify-center">
                  //   <p className="text-sm font-medium text-gray-500 px-4 text-center">
                  //     No PDF files uploaded.
                  //   </p>
                  // </div>

                  <div className="flex-1 border border-dashed border-ash-medium rounded-xl bg-brand-surface flex items-center justify-center p-6 text-center">
                    <div>
                      <i className="fa-solid fa-file-import text-text-muted text-2xl mb-2"></i>
                      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        No PDF files uploaded.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {pdfFiles.map((file: any) => (
                      <li
                        key={file._id}
                        // className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded"
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-surface border border-ash-medium p-3 rounded-lg shadow-sm gap-3"
                      >
                        {/* <span className="truncate text-sm">{file.originalName}</span> */}
                        <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                          <i className="fa-solid fa-file-pdf text-action-danger text-lg shrink-0"></i>
                          <span className="truncate text-sm font-bold text-text-main">{file.originalName}</span>
                        </div>
                        {/* <div className="flex gap-3 items-center text-blue-600"> */}
                        <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
                          <Button size="sm"
                            // variant="primary"
                            // onClick={() => downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })}
                            variant="white"
                            onClick={() => downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })}
                            className="border-ash-medium text-text-main shadow-sm"
                          >
                            <i className="fa-solid fa-download"></i>
                          </Button>

                          {canDelete && <Button
                            size="sm"
                            isLoading={variables?.fileId === file._id && deletePending}
                            onClick={() => handleDelete(file._id)}
                            variant="ghost"
                            // className="text-red-600"
                            className="text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                          >
                            <i className="fas fa-trash" />
                          </Button>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 🖼️ Image Files */}
              {/* <div className=" min-h-[220px] sm:max-h-[150px]  sm:min-h-[150px]  border-2 border-[#0a0a0a18] px-2 rounded-xl lg:min-h-[280px] overflow-y-auto custom-scrollbar">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-image" />
                  Image Files
                </h3>
                {imageFiles.length === 0 ? (
                  <div className="h-[85%] shadow rounded bg-blue-50 flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-500 px-4 text-center">
                      No images uploaded.
                    </p>
                  </div>
                ) : (
                  <ImageGalleryExample
                    imageFiles={imageFiles}
                    {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
                    height={80}
                    minWidth={98}
                    maxWidth={100}
                  />
                )}
              </div> */}

              <div className="min-h-[220px] lg:min-h-[280px] border border-ash-medium bg-brand-ash p-4 rounded-xl overflow-y-auto custom-scrollbar flex flex-col">
                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                  <i className="fas fa-image text-text-muted" />
                  Image Files
                </h3>
                {imageFiles.length === 0 ? (
                  <div className="flex-1 border border-dashed border-ash-medium rounded-xl bg-brand-surface flex items-center justify-center p-6 text-center">
                    <div>
                      <i className="fa-solid fa-images text-text-muted text-2xl mb-2"></i>
                      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        No image files uploaded.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-brand-surface border border-ash-medium p-4 rounded-xl shadow-sm">
                    <ImageGalleryExample
                      imageFiles={imageFiles}
                      {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
                      height={80}
                      minWidth={98}
                      maxWidth={100}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* ✅ Confirm Buttons */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {(canCreate || canEdit) && <Button
              onClick={() => handleConfirm("client")}
              className={`w-full ${data?.clientConfirmation ? "bg-blue-600" : "bg-red-600"} text-white`}
            >
              <i className={`fas ${data?.clientConfirmation ? "fa-check" : "fa-xmark"} mr-2`} /> {data?.clientConfirmation ? "Client Confirmed" : "Client not confirmed"}
            </Button>}

            {(canCreate || canEdit) && <Button
              onClick={() => handleConfirm("owner")}
              className={`w-full ${data?.ownerConfirmation ? "bg-blue-600" : "bg-red-600"} text-white`}
            >
              <i className={`fas ${data?.ownerConfirmation ? "fa-check" : "fa-xmark"} mr-2`} /> {data?.ownerConfirmation ? "Owner Confirmed" : "Owner not confirmed"}
            </Button>}

            <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3 flex items-center gap-3 text-sm text-blue-800">
              <i className="fas fa-user-check text-blue-600 text-base" />
              <p className="font-medium">
                Client Confirmed At:{" "}
                <span className="font-semibold text-blue-900">
                  {data?.clientAcceptedAt
                    ? new Date(data.clientAcceptedAt).toLocaleDateString()
                    : "Not Confirmed Yet"}
                </span>
              </p>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {(canCreate || canEdit) && (
              <Button
                onClick={() => handleConfirm("client")}
                variant={data?.clientConfirmation ? "dark" : "outline"}
                className={`w-full py-3.5 shadow-sm transition-all ${data?.clientConfirmation
                  ? "bg-action-success border-action-success hover:bg-action-success/90"
                  : "border-ash-medium text-text-main hover:bg-brand-ash"
                  }`}
              >
                <i className={`fas ${data?.clientConfirmation ? "fa-check" : "fa-shield-halved"} mr-2`} />
                {data?.clientConfirmation ? "Client Confirmed" : "Awaiting Client Confirm"}
              </Button>
            )}

            {(canCreate || canEdit) && (
              <Button
                onClick={() => handleConfirm("owner")}
                variant={data?.ownerConfirmation ? "dark" : "outline"}
                className={`w-full py-3.5 shadow-sm transition-all ${data?.ownerConfirmation
                  ? "bg-action-success border-action-success hover:bg-action-success/90"
                  : "border-ash-medium text-text-main hover:bg-brand-ash"
                  }`}
              >
                <i className={`fas ${data?.ownerConfirmation ? "fa-check" : "fa-shield-halved"} mr-2`} />
                {data?.ownerConfirmation ? "Owner Confirmed" : "Awaiting Owner Confirm"}
              </Button>
            )}

            <div className="bg-brand-surface border border-ash-medium rounded-xl px-5 py-3.5 flex flex-col justify-center shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-user-check text-text-muted" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Client Confirmed At
                </p>
              </div>
              <p className="font-bold text-text-main pl-6">
                {data?.clientAcceptedAt
                  ? new Date(data.clientAcceptedAt).toLocaleString()
                  : "Not Confirmed Yet"}
              </p>
            </div>

          </div>

          {popupImage && (
            <div
              onClick={() => setPopupImage(null)}
              // className="fixed inset-0 z-50 bg-black/70 bg-opacity-60 flex items-center justify-center"
              className="fixed inset-0 z-[9999] bg-brand-main/90 flex items-center justify-center p-4 backdrop-blur-md"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                // className="relative bg-white rounded py-8 px-4 max-w-[90vw] max-h-[80vh] shadow-lg"
                className="relative bg-brand-surface rounded-xl p-2 max-w-[90vw] max-h-[90vh] shadow-2xl border border-ash-medium animate-in fade-in zoom-in duration-200"              >
                <button
                  onClick={() => setPopupImage(null)}
                  className="absolute -top-4 -right-4 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
                <img
                  src={popupImage}
                  alt="Full View"
                  className="max-h-[70vh] w-auto object-contain rounded"
                />
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}