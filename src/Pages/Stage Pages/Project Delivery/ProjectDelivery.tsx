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
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";

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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId });
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

  let pdfFiles = (data?.uploads || []).filter((file: any) => file.type === "pdf");
  let imageFiles = (data?.uploads || []).filter((file: any) => file.type === "image");

  if (isLoading) return <MaterialOverviewLoading />

  // pdfFiles = [
  //   {
  //     _id: "pdf1",
  //     type: "pdf",
  //     url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //     originalName: "project-overview.pdf",
  //     uploadedAt: new Date("2024-07-01T10:30:00Z"),
  //   },
  //   {
  //     _id: "pdf2",
  //     type: "pdf",
  //     url: "https://www.africau.edu/images/default/sample.pdf",
  //     originalName: "specifications.pdf",
  //     uploadedAt: new Date("2024-07-02T10:00:00Z"),
  //   },
  //   {
  //     _id: "pdf3",
  //     type: "pdf",
  //     url: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
  //     originalName: "client-brief.pdf",
  //     uploadedAt: new Date("2024-07-03T11:45:00Z"),
  //   },
  //   {
  //     _id: "pdf2",
  //     type: "pdf",
  //     url: "https://www.africau.edu/images/default/sample.pdf",
  //     originalName: "specifications.pdf",
  //     uploadedAt: new Date("2024-07-02T10:00:00Z"),
  //   },
  //   {
  //     _id: "pdf2",
  //     type: "pdf",
  //     url: "https://www.africau.edu/images/default/sample.pdf",
  //     originalName: "specifications.pdf",
  //     uploadedAt: new Date("2024-07-02T10:00:00Z"),
  //   },
  //   {
  //     _id: "pdf3",
  //     type: "pdf",
  //     url: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
  //     originalName: "client-brief.pdf",
  //     uploadedAt: new Date("2024-07-03T11:45:00Z"),
  //   },
  //   {
  //     _id: "pdf2",
  //     type: "pdf",
  //     url: "https://www.africau.edu/images/default/sample.pdf",
  //     originalName: "specifications.pdf",
  //     uploadedAt: new Date("2024-07-02T10:00:00Z"),
  //   },

  // ];


  // imageFiles = [
  //   {
  //     _id: "img1",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Living+Room",
  //     originalName: "living-room.jpg",
  //     uploadedAt: new Date("2024-07-01T11:00:00Z"),
  //   },
  //   {
  //     _id: "img2",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Kitchen",
  //     originalName: "kitchen-view.jpg",
  //     uploadedAt: new Date("2024-07-02T09:20:00Z"),
  //   },
  //   {
  //     _id: "img3",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Elevation",
  //     originalName: "front-elevation.png",
  //     uploadedAt: new Date("2024-07-03T08:45:00Z"),
  //   },
  //   {
  //     _id: "img2",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Kitchen",
  //     originalName: "kitchen-view.jpg",
  //     uploadedAt: new Date("2024-07-02T09:20:00Z"),
  //   },
  //   {
  //     _id: "img2",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Kitchen",
  //     originalName: "kitchen-view.jpg",
  //     uploadedAt: new Date("2024-07-02T09:20:00Z"),
  //   },
  //   {
  //     _id: "img3",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Elevation",
  //     originalName: "front-elevation.png",
  //     uploadedAt: new Date("2024-07-03T08:45:00Z"),
  //   },
  //   {
  //     _id: "img2",
  //     type: "image",
  //     url: "https://via.placeholder.com/300x200.png?text=Kitchen",
  //     originalName: "kitchen-view.jpg",
  //     uploadedAt: new Date("2024-07-02T09:20:00Z"),
  //   },
  // ];


  return (
    <div className="w-full sm:min-h-full sm:overflow-y-auto space-y-6 py-1 sm:py-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-4pb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
          {isMobile && (
            <button
              onClick={openMobileSidebar}
              className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              title="Open Menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
          )}
          <i className="fas fa-handshake mr-2" />
          Project Delivery
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            isLoading={completePending}
            onClick={handleCompletionStatus}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <i className="fa-solid fa-circle-check mr-2" />
            Mark as Complete
          </Button>


          {!fetchError && <ShareDocumentWhatsapp
            projectId={projectId!}
            stageNumber="14"
            className="w-full sm:w-fit"
            isStageCompleted={data?.status}
          />}

          <AssignStageStaff
            projectId={projectId}
            organizationId={organizationId}
            stageName="ProjectDeliveryModel"
            currentAssignedStaff={data?.assignedTo || null}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* If error, show only above header and handle block */}
      {fetchError ? (
        <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-lg shadow p-6 text-center">
          <div className="text-red-600 text-xl font-bold mb-2">⚠️ Error Loading Data</div>
          <p className="text-sm text-red-500 mb-4">
            {(fetchError as any)?.response?.data?.message ||
              (fetchError as any)?.message ||
              "Something went wrong while fetching project delivery details."}
          </p>
          <Button
            onClick={() => refetch()}
            isLoading={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Stage Timer */}
          <Card className="p-4 border-l-[4px] border-blue-600 shadow w-full">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg" />
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
          <Card className="p-6 border-2 border-blue-200 shadow w-full flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-3">
                <i className="fas fa-paperclip mr-2 text-blue-600" />
                Upload Files
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <input
                  multiple
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,image/*"
                  className="w-full sm:w-[300px] border border-blue-300 px-3 py-2 rounded text-sm"
                />

                <Button
                  onClick={handleUpload}
                  isLoading={uploadPending}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Upload Files
                </Button>
              </div>
            </div>

            {/* Uploaded Files (PDF & Images) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 📑 PDF Files */}
              <div className="min-h-[220px] sm:max-h-[150px] sm:min-h-[150px]  lg:min-h-[220px] overflow-y-auto custom-scrollbar">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-file-pdf" />
                  PDF Files
                </h3>
                {pdfFiles.length === 0 ? (
                  <div className="h-[85%] shadow rounded bg-blue-50 flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-500 px-4 text-center">
                      No PDF files uploaded.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {pdfFiles.map((file: any) => (
                      <li
                        key={file._id}
                        className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded"
                      >
                        <span className="truncate text-sm">{file.originalName}</span>
                        <div className="flex gap-3 items-center text-blue-600">
                          <Button size="sm"
                            variant="primary"
                            onClick={() => downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })}
                          >
                            <i className="fa-solid fa-download"></i>
                          </Button>

                          <Button
                            size="sm"
                            isLoading={variables?.fileId === file._id && deletePending}
                            onClick={() => handleDelete(file._id)}
                            className="text-red-600"
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 🖼️ Image Files */}
              <div className=" min-h-[220px] sm:max-h-[150px]  sm:min-h-[150px] lg:min-h-[220px] overflow-y-auto custom-scrollbar">
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
                  <ul className="space-y-2">
                    {imageFiles.map((file: any) => (
                      <li
                        key={file._id}
                        className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded"
                      >
                        <span className="truncate text-sm">{file.originalName}</span>
                        <div className="flex gap-3 items-center text-blue-600">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setPopupImage(file?.url)}
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button size="sm"
                            variant="primary"
                            onClick={() => downloadImage({ src: file?.url, alt: file?.originalName || "file.pdf" })}
                          >
                            <i className="fa-solid fa-download"></i>
                          </Button>

                          <Button
                            size="sm"
                            isLoading={variables?.fileId === file._id && deletePending}
                            onClick={() => handleDelete(file._id)}
                            className="text-red-600"
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>

          {/* ✅ Confirm Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <Button
              onClick={() => handleConfirm("client")}
              className={`w-full ${data?.clientConfirmation ? "bg-blue-600" : "bg-red-600"} text-white`}
            >
              <i className={`fas ${data?.clientConfirmation ? "fa-check" : "fa-xmark"} mr-2`} /> {data?.clientConfirmation ? "Client Confirmed" : "Client not confirmed"}
            </Button>

            <Button
              onClick={() => handleConfirm("owner")}
              className={`w-full ${data?.ownerConfirmation ? "bg-blue-600" : "bg-red-600"} text-white`}
            >
              <i className={`fas ${data?.ownerConfirmation ? "fa-check" : "fa-xmark"} mr-2`} /> {data?.ownerConfirmation ? "Owner Confirmed" : "Owner not confirmed"}
            </Button>

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
          </div>

          {popupImage && (
            <div
              onClick={() => setPopupImage(null)}
              className="fixed inset-0 z-50 bg-black/70 bg-opacity-60 flex items-center justify-center"
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

        </>
      )}
    </div>
  );
}