import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";

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

export default function ProjectDeliveryPanel() {
    const { projectId } = useParams() as { projectId: string };

    const {
        data,
        isLoading,
        refetch,
    } = useGetProjectDeliveryDetails(projectId);

    const { mutateAsync: uploadFilesAsync, isPending: uploadPending } = useUploadProjectDeliveryFiles();
    const { mutateAsync: deleteFileAsync } = useDeleteProjectDeliveryFile();
    const { mutateAsync: clientConfirmAsync } = useUpdateClientConfirmation();
    const { mutateAsync: ownerConfirmAsync } = useUpdateOwnerConfirmation();
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetprojectDeliveryDeadline();
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteprojectDelivery();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const files = data?.uploads || [];
    let pdfFiles = files.filter((file: any) => file.type === "pdf");
    let imageFiles = files.filter((file: any) => file.type === "image");




    pdfFiles = [
        {
            _id: "pdf1",
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "project-overview.pdf",
            uploadedAt: new Date("2024-07-01T10:30:00Z"),
        },
        {
            _id: "pdf2",
            type: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            originalName: "specifications.pdf",
            uploadedAt: new Date("2024-07-02T10:00:00Z"),
        },
        {
            _id: "pdf3",
            type: "pdf",
            url: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
            originalName: "client-brief.pdf",
            uploadedAt: new Date("2024-07-03T11:45:00Z"),
        },
        {
            _id: "pdf2",
            type: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            originalName: "specifications.pdf",
            uploadedAt: new Date("2024-07-02T10:00:00Z"),
        },
          {
            _id: "pdf2",
            type: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            originalName: "specifications.pdf",
            uploadedAt: new Date("2024-07-02T10:00:00Z"),
        },
        {
            _id: "pdf3",
            type: "pdf",
            url: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
            originalName: "client-brief.pdf",
            uploadedAt: new Date("2024-07-03T11:45:00Z"),
        },
        {
            _id: "pdf2",
            type: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            originalName: "specifications.pdf",
            uploadedAt: new Date("2024-07-02T10:00:00Z"),
        },

    ];


    imageFiles = [
        {
            _id: "img1",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Living+Room",
            originalName: "living-room.jpg",
            uploadedAt: new Date("2024-07-01T11:00:00Z"),
        },
        {
            _id: "img2",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Kitchen",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date("2024-07-02T09:20:00Z"),
        },
        {
            _id: "img3",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Elevation",
            originalName: "front-elevation.png",
            uploadedAt: new Date("2024-07-03T08:45:00Z"),
        },
        {
            _id: "img2",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Kitchen",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date("2024-07-02T09:20:00Z"),
        },
        {
            _id: "img2",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Kitchen",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date("2024-07-02T09:20:00Z"),
        },
        {
            _id: "img3",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Elevation",
            originalName: "front-elevation.png",
            uploadedAt: new Date("2024-07-03T08:45:00Z"),
        },
        {
            _id: "img2",
            type: "image",
            url: "https://via.placeholder.com/300x200.png?text=Kitchen",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date("2024-07-02T09:20:00Z"),
        },
    ];

    // === Upload logic ===
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        if (!selectedFiles.length) {
            toast({
                title: "Error",
                description: "Please select files to upload.",
                variant: "destructive",
            });
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        try {
            await uploadFilesAsync({ projectId, formData });
            toast({ title: "Success", description: "Files uploaded successfully." });
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || error.message || "Failed to upload files",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            await deleteFileAsync({ projectId, fileId });
            toast({ title: "Success", description: "File deleted successfully." });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || error.message || "Failed to delete file",
                variant: "destructive",
            });
        }
    };

    const handleConfirm = async (type: "client" | "owner") => {
        try {
            const confirmFn = type === "client" ? clientConfirmAsync : ownerConfirmAsync;
            await confirmFn({ projectId, confirm: !data?.[`${type}Confirmation`] });

            toast({
                title: "Success",
                description: `${type === "client" ? "Client" : "Owner"} confirmation updated.`,
            });

            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || error.message || "Failed to update confirmation",
                variant: "destructive",
            });
        }
    };

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId });
            toast({
                title: "Success",
                description: "Project Delivery marked as complete.",
            });

            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to update completion status",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full max-h-full overflow-auto custom-scrollbar  bg-white flex flex-col gap-8">


            <div className="flex justify-between items-center">


                <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
                    <i className="fas fa-handshake mr-2"></i> Project Delivery
                </h2>

                <div className="flex gap-2 items-center">
                    <Button
                        isLoading={completePending}
                        onClick={handleCompletionStatus}
                        className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto"
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark as Complete
                    </Button>
                    <AssignStageStaff
                        stageName="ProjectDeliveryModel"
                        projectId={projectId}
                        organizationId={"684a57015e439b678e8f6918"}
                        currentAssignedStaff={data?.assignedTo || null}
                    />
                </div>
            </div>

            {/* Stage Timer Info */}
            <Card className="p-4 border-l-[4px] border-blue-600 bg-white shadow w-full">
                <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                    <i className="fa-solid fa-clock text-blue-500 text-lg" />
                    <span>Stage Timings</span>
                </div>

                <StageTimerInfo
                    completedAt={data?.timer?.completedAt}
                    stageName="projectdelivery"
                    projectId={projectId}
                    formId={(data as any)?._id}
                    deadLine={data?.timer?.deadLine}
                    startedAt={data?.timer?.startedAt}
                    refetchStageMutate={refetch}
                    deadLineMutate={deadLineAsync}
                    isPending={deadLinePending}
                />
            </Card>

            {/* File Upload & Collections */}
            <Card className="p-6 border-2 border-blue-200 shadow w-full flex flex-col gap-6">
                <div>
                    <h2 className="text-lg font-bold text-blue-800 mb-3">
                        <i className="fas fa-paperclip mr-2 text-blue-600" />
                        Upload Files
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input
                            multiple
                            type="file"
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                            accept=".pdf,image/*"
                            className="w-full md:w-[300px] border border-blue-300 px-3 py-2 rounded text-sm"
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

                {/* All PDFs and Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[250px] overflow-y-auto scrollbar-thin">
                    {/* PDFs */}
                    <div>
                        <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <i className="fas fa-file-pdf" />
                            PDF Files
                        </h3>
                        {pdfFiles.length === 0 ? (
                            <p className="text-sm font-medium text-gray-500 bg-blue-50 p-4 rounded text-center">
                                No PDF files uploaded.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {pdfFiles.map((file: any) => (
                                    <li
                                        key={file._id}
                                        className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded"
                                    >
                                        <span className="truncate text-sm">{file.originalName}</span>
                                        <div className="flex gap-3 items-center text-blue-600">
                                            <a href={file.url} download><i className="fas fa-download" /></a>
                                            <button onClick={() => handleDelete(file._id)} className="text-red-600">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <i className="fas fa-image" />
                            Image Files
                        </h3>
                        {imageFiles.length === 0 ? (
                            <p className="text-sm font-medium text-gray-500 bg-blue-50 p-4 rounded text-center">
                                No images uploaded.
                            </p>
                        ) : (
                            <ul className="space-y-2 overflow-y-auto">
                                {imageFiles.map((file: any) => (
                                    <li
                                        key={file._id}
                                        className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded"
                                    >
                                        <span className="truncate text-sm">{file.originalName}</span>
                                        <div className="flex gap-3 text-blue-600 items-center">
                                            <a href={file.url} target="_blank"><i className="fas fa-eye" /></a>
                                            <a href={file.url} download><i className="fas fa-download" /></a>
                                            <button onClick={() => handleDelete(file._id)} className="text-red-600">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Card>

            {/* Confirmation and Completion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    onClick={() => handleConfirm("client")}
                    className={`w-full ${data?.clientConfirmation ? "bg-green-600" : "bg-blue-600"} text-white`}
                >
                    <i className="fas fa-check mr-2" /> Client Confirm
                </Button>

                <Button
                    onClick={() => handleConfirm("owner")}
                    className={`w-full ${data?.ownerConfirmation ? "bg-green-600" : "bg-blue-600"} text-white`}
                >
                    <i className="fas fa-user-shield mr-2" /> Owner Confirm
                </Button>


                <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 flex items-center gap-3 text-sm text-blue-800">
                    <i className="fas fa-user-check text-blue-600 text-base" />
                    <p className="font-medium">
                        Client Confirmed At: {" "}
                        <span className="font-semibold text-blue-900">
                            {data?.clientAcceptedAt
                                ? new Date(data.clientAcceptedAt).toLocaleDateString()
                                : "Not Confirmed Yet"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}