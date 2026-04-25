
import React, { useRef, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams, useLocation } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import type { ProjectDetailsOutlet } from "../../../types/types";

// UI Components
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import StageGuide from "../../../shared/StageGuide";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import ImageGalleryExample from "../../../shared/ImageGalleryExample"; // Ensure path is correct

// API Hooks
import {
    useGetDesignApprovals,
    useCompletionStatusDesignApproval,
    useSetDeadLineDesignApproval,
    useStartNextPhase,
    useUploadDesignFiles,
    useDeleteSingleFile
} from "../../../apiList/Stage Api/designApprovalApi";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { downloadImage } from "../../../utils/downloadFile";
import { dateFormate } from "../../../utils/dateFormator";

type DesignTab = "2D" | "3D";

const DesignApprovalMain: React.FC = () => {
    const { projectId, organizationId } = useParams() as { projectId: string; organizationId: string };
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const navigate = useNavigate();
    const location = useLocation();

    const { role, permission } = useAuthCheck();
    const canDelete = role === "owner" || permission?.designapproval?.delete;
    const canCreate = role === "owner" || permission?.designapproval?.create;
    const canEdit = role === "owner" || permission?.designapproval?.edit;

    // UI State
    const [activeTab, setActiveTab] = useState<DesignTab>("2D");

    // File Input Refs for each phase upload
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    // API Hooks
    const { data: designApproval, isLoading, refetch, error: getAllError } = useGetDesignApprovals(projectId);
    const { mutateAsync: completeStatus, isPending: completePending } = useCompletionStatusDesignApproval();
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineDesignApproval();
    const { mutateAsync: startNextPhase, isPending: nextPhasePending } = useStartNextPhase();
    const { mutateAsync: uploadFiles, isPending: uploadPending } = useUploadDesignFiles();
    const { mutateAsync: deleteFile, isPending: deleteFilePending } = useDeleteSingleFile();

    const handleCompletionStatus = async () => {
        try {
            if (!completePending) {
                await completeStatus({ projectId });
                navigate('../workmainschedule');
            }
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update completion status",
                variant: "destructive"
            });
        }
    };

    const handleStartNextPhase = async () => {
        try {
            await startNextPhase({ projectId, designType: activeTab });
            toast({ description: `${activeTab} Phase started successfully`, title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || `Failed to start next ${activeTab} phase`,
                variant: "destructive"
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, phaseId: string) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });

        try {
            await uploadFiles({ projectId, designType: activeTab, phaseId, formData });
            toast({ description: 'Files uploaded successfully', title: "Success" });
            // Reset input
            if (fileInputRefs.current[phaseId]) {
                fileInputRefs.current[phaseId]!.value = '';
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to upload files",
                variant: "destructive"
            });
        }
    };

    const handleDeleteFile = async (phaseId: string, fileId: string) => {
        try {
            await deleteFile({ projectId, designType: activeTab, phaseId, fileId });
            toast({ description: 'File deleted successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete file",
                variant: "destructive"
            });
        }
    };




    // Add this right below handleStartNextPhase...

    // Generate the public link dynamically based on the current domain
    const publicLink = `${window.location.origin}/${organizationId}/design-approval/public/${projectId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicLink);
        toast({ description: 'Client link copied to clipboard!', title: "Success" });
    };

    const handleWhatsAppShare = () => {
        const message = `Hello! Please review and approve the design files for your project here: ${publicLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (isLoading) return <MaterialOverviewLoading />;

    const isChildRoute = location.pathname.includes("reference");
    if (isChildRoute) return <Outlet />;

    const activeDesignData = activeTab === "2D" ? designApproval?.design2D : designApproval?.design3D;
    const phases = activeDesignData?.phases || [];

    return (
        <div className="container mx-auto max-h-full overflow-y-auto max-w-full min-h-full bg-brand-surface">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-ash-light pb-4">
                <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-text-main flex items-center">
                    {isMobile && (
                        <button
                            onClick={openMobileSidebar}
                            className="mr-3 p-2 rounded-lg border border-ash-medium hover:bg-brand-ash text-text-muted shadow-sm transition-colors"
                            title="Open Menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <i className="fa-solid fa-layer-group mr-3 text-ash-dark"></i>Design Approvals
                </h2>

                <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%] flex flex-col sm:flex-row gap-3 justify-end">
                    {/* <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
                        {(canCreate || canEdit) && (
                            <Button
                                variant="dark"
                                isLoading={completePending}
                                onClick={handleCompletionStatus}
                                className="flex-1 sm:flex-initial min-w-max"
                                disabled={!!getAllError || designApproval?.isFullyApproved}
                            >
                                <i className="fa-regular fa-circle-check mr-2 text-action-success"></i>
                                {designApproval?.isFullyApproved ? "Completed" : "Mark Complete"}
                            </Button>
                        )}
                    </div> */}

                    <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end items-center">

                        {/* 🆕 NEW SHARE BUTTONS */}
                        <div className="flex bg-brand-ash p-1 rounded-lg border border-ash-light shadow-sm mr-2">
                            <button
                                onClick={handleCopyLink}
                                className="px-3 py-1.5 rounded-md hover:bg-brand-surface text-text-muted hover:text-action-primary transition-all"
                                title="Copy Public Link"
                            >
                                <i className="fa-solid fa-link"></i>
                            </button>
                            <button
                                onClick={handleWhatsAppShare}
                                className="px-3 py-1.5 rounded-md hover:bg-brand-surface text-text-muted hover:text-[#25D366] transition-all"
                                title="Share via WhatsApp"
                            >
                                <i className="fa-brands fa-whatsapp text-lg"></i>
                            </button>
                        </div>

                        {/* EXISTING MARK COMPLETE BUTTON */}
                        {(canCreate || canEdit) && (
                            <Button
                                variant="dark"
                                isLoading={completePending}
                                onClick={handleCompletionStatus}
                                className="flex-1 sm:flex-initial min-w-max"
                                disabled={!!getAllError || designApproval?.isFullyApproved}
                            >
                                <i className="fa-regular fa-circle-check mr-2 text-action-success"></i>
                                {designApproval?.isFullyApproved ? "Completed" : "Mark Complete"}
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
                        {(canCreate || canEdit) && (
                            <ResetStageButton
                                projectId={projectId}
                                stageNumber={4}
                                stagePath="designapproval"
                                className="flex-1 sm:flex-initial min-w-max"
                                disabled={!!getAllError}
                            />
                        )}
                        <AssignStageStaff
                            stageName="DesignApprovalModel"
                            projectId={projectId}
                            organizationId={organizationId!}
                            currentAssignedStaff={designApproval?.assignedTo || null}
                            className="flex-1 sm:flex-initial min-w-max"
                        />
                        <div className="w-full sm:w-auto flex justify-end sm:block">
                            <StageGuide organizationId={organizationId!} stageName="designapproval" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <>
                <Card className="p-5 mb-6 w-full shadow-sm border border-ash-medium rounded-xl bg-brand-surface">
                    <div className="flex items-center gap-2 text-text-main text-sm font-bold mb-4 uppercase tracking-wide border-b border-ash-light pb-3">
                        <i className="fa-regular fa-clock text-ash-dark text-base"></i>
                        <span>Stage Timings</span>
                    </div>
                    <StageTimerInfo
                        stageName="designapproval"
                        completedAt={designApproval?.timer?.completedAt}
                        formId={(designApproval as any)?._id}
                        projectId={projectId}
                        deadLine={designApproval?.timer?.deadLine}
                        startedAt={designApproval?.timer?.startedAt}
                        refetchStageMutate={refetch}
                        deadLineMutate={deadLineAsync}
                        isPending={deadLinePending}
                    />
                </Card>

                {/* {getAllError ? (
                    // SHOW ERROR ONLY IN THE CONTENT AREA
                    <div className="max-w-xl mx-auto p-5 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mb-6 mt-8">
                        <div className="text-action-danger text-2xl mb-3">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div className="text-text-main font-bold mb-2">Something went wrong</div>
                        <p className="text-text-muted text-sm mb-5">
                            {(getAllError as any)?.response?.data?.message || "Failed to load design phases. Please try again."}
                        </p>
                        <Button onClick={() => refetch()} variant="outline" className="hover:bg-brand-ash hover:text-action-danger hover:border-action-danger text-text-main border-ash-medium">
                            <i className="fa-solid fa-rotate-right mr-2"></i>Retry
                        </Button>
                    </div>
                ) : (
                    <> */}
                {/* 2D / 3D CHIP TOGGLE */}
                < div className="flex justify-center mb-8">
                    <div className="inline-flex bg-brand-ash p-1 rounded-xl border border-ash-light shadow-sm">
                        <button
                            onClick={() => setActiveTab("2D")}
                            className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "2D" ? "bg-brand-surface text-action-primary shadow-sm" : "text-text-muted hover:text-text-main"
                                }`}
                        >
                            <i className="fa-solid fa-pen-ruler mr-2"></i>2D Designs
                        </button>
                        <button
                            onClick={() => setActiveTab("3D")}
                            className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "3D" ? "bg-brand-surface text-action-primary shadow-sm" : "text-text-muted hover:text-text-main"
                                }`}
                        >
                            <i className="fa-solid fa-cube mr-2"></i>3D Designs
                        </button>
                    </div>
                </div>

                {/* PHASE LIST CONTENT */}
                {phases.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 bg-brand-surface border border-dashed border-ash-medium rounded-xl shadow-sm">
                        <i className={`fa-solid ${activeTab === "2D" ? "fa-pen-ruler" : "fa-cube"} text-ash-dark text-5xl mb-4`} />
                        <h2 className="text-lg sm:text-xl font-bold text-text-main mb-2">No {activeTab} Phases Yet</h2>
                        <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                            Start by initiating Phase 1 to upload {activeTab} design files for client review.
                        </p>
                        {(canCreate || canEdit) && (
                            <Button variant="dark" onClick={handleStartNextPhase} isLoading={nextPhasePending} className="px-6">
                                <i className="fas fa-play mr-2 text-brand-surface" />
                                Start Phase 1
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 px-4">
                        {phases.map((phase: any, index: number) => {
                            const isLatestPhase = index === phases.length - 1;
                            const pdfFiles = phase.files?.filter((file: any) => file.type === "pdf") || [];
                            const imageFiles = phase.files?.filter((file: any) => file.type === "image") || [];
                            const isApproved = phase.status === "Approved";

                            const statusColors = {
                                Pending: "text-action-warning bg-action-warning/10 border-action-warning/20",
                                Approved: "text-action-success bg-action-success/10 border-action-success/20",
                                Revision_Requested: "text-action-danger bg-action-danger/10 border-action-danger/20",
                            };
                            const currentStatusColor = statusColors[phase.status as keyof typeof statusColors] || statusColors.Pending;

                            return (
                                // <Card key={phase._id} className="bg-brand-surface border border-ash-medium rounded-xl shadow-sm p-4 sm:p-6">
                                //     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-ash-light pb-4">

                                //         <div className="flex items-center gap-3">
                                //             <div className="w-10 h-10 rounded-lg bg-brand-ash flex items-center justify-center border border-ash-light">
                                //                 <span className="font-bold text-text-main text-lg">{phase.phaseNumber}</span>
                                //             </div>
                                //             <div>
                                //                 <h3 className="text-lg font-bold text-text-main">Phase {phase.phaseNumber}</h3>
                                //                 <p className="text-xs text-text-muted">Started: {new Date(phase.createdAt).toLocaleDateString()}</p>
                                //             </div>
                                //         </div>

                                //         <div className="flex flex-wrap items-center gap-3">
                                //             <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center ${currentStatusColor}`}>
                                //                 <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                //                 {phase.status.replace("_", " ")}
                                //             </div>

                                //             {(canCreate || canEdit) && !isApproved && (
                                //                 <div>
                                //                     <input
                                //                         type="file"
                                //                         multiple
                                //                         className="hidden"
                                //                         //    ref={(el) => (fileInputRefs.current[phase._id] = el)}
                                //                         ref={(el) => { fileInputRefs.current[phase._id] = el; }}
                                //                         onChange={(e) => handleFileUpload(e, phase._id)}
                                //                     />
                                //                     <Button
                                //                         size="sm"
                                //                         variant="outline"
                                //                         isLoading={uploadPending}
                                //                         onClick={() => fileInputRefs.current[phase._id]?.click()}
                                //                         className="text-text-main border-ash-medium hover:bg-brand-ash"
                                //                     >
                                //                         <i className="fa-solid fa-upload mr-2"></i>Upload Files
                                //                     </Button>
                                //                 </div>
                                //             )}


                                //             {isLatestPhase && (canCreate || canEdit) && (
                                //                 <Button
                                //                     size="sm"
                                //                     variant="dark"
                                //                     onClick={handleStartNextPhase}
                                //                     isLoading={nextPhasePending}
                                //                 >
                                //                     Start Phase {phase.phaseNumber + 1}
                                //                 </Button>
                                //             )}
                                //         </div>
                                //     </div>

                                //     {phase.clientOverallComment && (
                                //         <div className="mb-6 p-4 rounded-lg bg-brand-ash border border-ash-light">
                                //             <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                                //                 <i className="fa-solid fa-comment-dots mr-2 text-action-primary"></i>Client Feedback
                                //             </h4>
                                //             <p className="text-sm text-text-muted italic">"{phase.clientOverallComment}"</p>
                                //         </div>
                                //     )}

                                //     <div className="space-y-6">

                                //         <div>
                                //             <h4 className="text-sm font-bold text-text-main mb-3">Images</h4>
                                //             {imageFiles.length === 0 ? (
                                //                 <div className="min-h-[120px] flex items-center justify-center bg-brand-ash rounded-lg border border-dashed border-ash-medium">
                                //                     <p className="text-sm text-text-muted">No Images uploaded.</p>
                                //                 </div>
                                //             ) : (
                                //                 <ImageGalleryExample
                                //                     imageFiles={imageFiles}
                                //                     refetch={refetch}
                                //                     height={80}
                                //                     minWidth={98}
                                //                     maxWidth={100}
                                //                     {...(canDelete && !isApproved ? { handleDeleteFile: (fileId: string) => handleDeleteFile(phase._id, fileId) } : {})}
                                //                 />
                                //             )}
                                //         </div>


                                //         <div>
                                //             <h4 className="text-sm font-bold text-text-main mb-3">Documents (PDF)</h4>
                                //             {pdfFiles.length === 0 ? (
                                //                 <div className="min-h-[80px] flex items-center justify-center bg-brand-ash rounded-lg border border-dashed border-ash-medium">
                                //                     <p className="text-sm text-text-muted">No PDFs uploaded.</p>
                                //                 </div>
                                //             ) : (
                                //                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                //                     {pdfFiles.map((file: any, i: number) => (
                                //                         <li key={i} className="flex justify-between items-center bg-brand-surface border border-ash-medium p-2.5 rounded-lg shadow-sm hover:border-ash-dark transition-colors">
                                //                             <div className="flex items-center gap-3 truncate mr-2">
                                //                                 <div className="w-8 h-8 flex-shrink-0 bg-brand-ash border border-ash-light rounded flex items-center justify-center">
                                //                                     <i className="fa-regular fa-file-pdf text-action-danger text-sm"></i>
                                //                                 </div>
                                //                                 <span className="truncate text-xs font-bold text-text-main tracking-tight">
                                //                                     {file.originalName || "Document.pdf"}
                                //                                 </span>
                                //                             </div>
                                //                             <div className="flex gap-2 items-center flex-shrink-0">
                                //                                 <Button
                                //                                     onClick={() => downloadImage({ src: file.url, alt: file.originalName || "file.pdf" })}
                                //                                     size="sm"
                                //                                     className="text-sm bg-transparent !text-text-muted hover:!text-text-main hover:bg-brand-ash border border-transparent"
                                //                                 >
                                //                                     <i className="fa-solid fa-download"></i>
                                //                                 </Button>

                                //                                 {canDelete && !isApproved && (
                                //                                     <Button
                                //                                         size="sm"
                                //                                         isLoading={deleteFilePending}
                                //                                         onClick={() => handleDeleteFile(phase._id, file._id)}
                                //                                         className="text-sm bg-transparent !text-text-muted hover:!text-action-danger hover:!bg-action-danger/10 border border-transparent"
                                //                                     >
                                //                                         <i className="fa-solid fa-trash-can"></i>
                                //                                     </Button>
                                //                                 )}
                                //                             </div>
                                //                         </li>
                                //                     ))}
                                //                 </ul>
                                //             )}
                                //         </div>
                                //     </div>

                                // </Card>
                                <Card key={phase._id} className="bg-brand-surface border-2 border-ash-light rounded-xl shadow-sm p-6">

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-ash-light pb-4">

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-brand-ash flex items-center justify-center border border-ash-light">
                                                <span className="font-bold text-text-main text-lg">{phase.phaseNumber}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-text-main">Phase {phase.phaseNumber}</h3>
                                                <p className="text-xs text-text-muted">Started: {dateFormate(new Date(phase.createdAt))}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center ${currentStatusColor}`}>
                                                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                                {phase.status.replace("_", " ")}
                                            </div>

                                            {(canCreate || canEdit) && !isApproved && (
                                                <div>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        //    ref={(el) => (fileInputRefs.current[phase._id] = el)}
                                                        ref={(el) => { fileInputRefs.current[phase._id] = el; }}
                                                        onChange={(e) => handleFileUpload(e, phase._id)}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        isLoading={uploadPending}
                                                        onClick={() => fileInputRefs.current[phase._id]?.click()}
                                                        className="text-text-main border-ash-medium hover:bg-brand-ash"
                                                    >
                                                        <i className="fa-solid fa-upload mr-2"></i>Upload Files
                                                    </Button>
                                                </div>
                                            )}


                                            {isLatestPhase && (canCreate || canEdit) && (
                                                <Button
                                                    size="sm"
                                                    variant="dark"
                                                    onClick={handleStartNextPhase}
                                                    isLoading={nextPhasePending}
                                                >
                                                    Start Phase {phase.phaseNumber + 1}
                                                </Button>
                                            )}
                                        </div>
                                    </div>



                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* ================= LEFT COLUMN: UPLOADED MEDIA ================= */}


                                        <div className="lg:col-span-1 space-y-6 border-2 border-ash-light px-2">

                                            {/* ================= IMAGES SECTION ================= */}
                                            <div>
                                                <h4 className="text-sm font-bold text-text-main mb-3">Images</h4>
                                                {imageFiles.length === 0 ? (
                                                    <div className="min-h-[120px] flex items-center justify-center bg-brand-ash rounded-lg border border-dashed border-ash-medium">
                                                        <p className="text-sm text-text-muted">No Images uploaded.</p>
                                                    </div>
                                                ) : (
                                                    <ImageGalleryExample
                                                        imageFiles={imageFiles}
                                                        refetch={refetch}
                                                        height={80}
                                                        minWidth={98}
                                                        maxWidth={100}
                                                        {...(canDelete && !isApproved ? { handleDeleteFile: (fileId: string) => handleDeleteFile(phase._id, fileId) } : {})}
                                                    />
                                                )}
                                            </div>

                                            {/* ================= PDFS SECTION ================= */}
                                            <div>
                                                <h4 className="text-sm font-bold text-text-main mb-3">Documents (PDF)</h4>
                                                {pdfFiles.length === 0 ? (
                                                    <div className="min-h-[80px] flex items-center justify-center bg-brand-ash rounded-lg border border-dashed border-ash-medium">
                                                        <p className="text-sm text-text-muted">No PDFs uploaded.</p>
                                                    </div>
                                                ) : (
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {pdfFiles.map((file: any, i: number) => (
                                                            <li key={i} className="flex justify-between items-center bg-brand-surface border border-ash-medium p-2.5 rounded-lg shadow-sm hover:border-ash-dark transition-colors">
                                                                <div className="flex items-center gap-3 truncate mr-2">
                                                                    <div className="w-8 h-8 flex-shrink-0 bg-brand-ash border border-ash-light rounded flex items-center justify-center">
                                                                        <i className="fa-regular fa-file-pdf text-action-danger text-sm"></i>
                                                                    </div>
                                                                    <span className="truncate text-xs font-bold text-text-main tracking-tight">
                                                                        {file.originalName || "Document.pdf"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2 items-center flex-shrink-0">
                                                                    <Button
                                                                        onClick={() => downloadImage({ src: file.url, alt: file.originalName || "file.pdf" })}
                                                                        size="sm"
                                                                        className="text-sm bg-transparent !text-text-muted hover:!text-text-main hover:bg-brand-ash border border-transparent"
                                                                    >
                                                                        <i className="fa-solid fa-download"></i>
                                                                    </Button>

                                                                    {canDelete && !isApproved && (
                                                                        <Button
                                                                            size="sm"
                                                                            isLoading={deleteFilePending}
                                                                            onClick={() => handleDeleteFile(phase._id, file._id)}
                                                                            className="text-sm bg-transparent !text-text-muted hover:!text-action-danger hover:!bg-action-danger/10 border border-transparent"
                                                                        >
                                                                            <i className="fa-solid fa-trash-can"></i>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        {/* ================= RIGHT COLUMN: CLIENT FILE FEEDBACK ================= */}
                                        <div className="lg:col-span-1 bg-brand-surface p-4 rounded-xl border-2 border-ash-light h-full max-h-[500px] flex flex-col">
                                            <h4 className="text-sm font-bold text-text-main mb-3 border-b border-ash-medium pb-2 flex items-center">
                                                <i className="fa-solid fa-list-check mr-2 text-action-primary"></i>
                                                Specific File Feedback
                                            </h4>

                                            <div className="overflow-y-auto custom-scrollbar pr-1 flex-grow space-y-3">
                                                {(!phase.feedbacks || phase.feedbacks.length === 0 || !phase.feedbacks.some((fb: any) => fb.comment || fb.isSelected)) ? (
                                                    <div className="text-center py-8">
                                                        <p className="text-xs text-text-muted italic">No specific file comments yet.</p>
                                                    </div>
                                                ) : (
                                                    phase.feedbacks.map((fb: any, i: number) => {
                                                        // Skip rendering if they didn't write a comment and didn't select it
                                                        if (!fb.comment && !fb.isSelected) return null;

                                                        // Find the matching file to get its name and type
                                                        const file = phase.files?.find((f: any) => f._id === fb.fileId);

                                                        return (
                                                            <div key={i} className="bg-brand-surface p-3 rounded-lg border border-ash-medium shadow-sm">
                                                                <p className="text-xs font-bold text-text-strong truncate mb-2" title={file?.originalName}>
                                                                    <i className={`mr-1.5 ${file?.type === 'pdf' ? 'fa-regular fa-file-pdf text-action-danger' : 'fa-regular fa-image text-action-primary'}`}></i>
                                                                    {file?.originalName || 'Unknown File'}
                                                                </p>

                                                                {fb.isSelected && (
                                                                    <span className="inline-flex items-center px-2 py-1 bg-action-success/10 text-action-success border border-action-success/20 rounded text-[10px] font-bold mb-2 uppercase tracking-wide">
                                                                        <i className="fa-solid fa-check mr-1.5"></i> Client Approved
                                                                    </span>
                                                                )}

                                                                {fb.comment && (
                                                                    <div className="text-xs text-text-muted bg-brand-ash p-2.5 rounded border border-ash-light leading-relaxed">
                                                                        <i className="fa-solid fa-quote-left text-ash-dark mr-1.5 opacity-50"></i>
                                                                        {fb.comment}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </Card>
                            );
                        })}





                    </div >
                )}
            </>
        </div >
    );
};

export default DesignApprovalMain;