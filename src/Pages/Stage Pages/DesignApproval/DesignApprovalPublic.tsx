import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";

// UI Components
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
// import ImageGalleryExample from "../../../shared/ImageGalleryExample";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// Hooks & API
import { useGetPublicDesignApprovals, useSubmitClientFeedback } from "../../../apiList/Stage Api/designApprovalApi";
import { COMPANY_DETAILS } from "../../../constants/constants";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { downloadImage } from "../../../utils/downloadFile";


type DesignTab = "2D" | "3D";

const DesignApprovalPublic: React.FC = () => {
    const { projectId } = useParams() as { projectId: string };

    const [activeTab, setActiveTab] = useState<DesignTab>("2D");
    const [overallComment, setOverallComment] = useState("");
    const [fileFeedbacks, setFileFeedbacks] = useState<Record<string, { comment: string, isSelected: boolean }>>({});

    const { data: designApproval, isLoading, refetch, error } = useGetPublicDesignApprovals(projectId);
    const { mutateAsync: submitFeedback, isPending: submitPending } = useSubmitClientFeedback();

    const activeDesignData = activeTab === "2D" ? designApproval?.design2D : designApproval?.design3D;
    const phases = activeDesignData?.phases || [];
    // const latestPhase = phases.length > 0 ? phases[phases.length - 1] : null;
    // const isPendingReview = latestPhase?.status === "Pending";

    // Reset local form state when switching tabs
    useEffect(() => {
        setOverallComment("");
        setFileFeedbacks({});
    }, [activeTab]);

    const handleFileCommentChange = (fileId: string, text: string) => {
        setFileFeedbacks(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], comment: text, isSelected: prev[fileId]?.isSelected || false }
        }));
    };

    const handleFileSelectionToggle = (fileId: string) => {
        setFileFeedbacks(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], comment: prev[fileId]?.comment || "", isSelected: !prev[fileId]?.isSelected }
        }));
    };

    const handleSubmit = async (action: "Pending" | "Approved" | "Revision_Requested", currentPhaseId: string) => {
        // Format feedbacks object into the array expected by the backend

        // const currentPhase = phases.find((p: any) => p._id === currentPhaseId);
        // if (!currentPhase) return;

        // // 2. ⭐ THE FIX: Only format feedbacks for files that actually belong to THIS phase ⭐
        // const formattedFeedbacks = Object.entries(fileFeedbacks)
        //     .filter(([fileId]) => currentPhase.files.some((f: any) => String(f._id) === fileId))
        //     .map(([fileId, data]) => ({
        //         fileId,
        //         comment: data.comment,
        //         isSelected: data.isSelected
        //     }));


        const currentPhase = phases.find((p: any) => p._id === currentPhaseId);
        if (!currentPhase) return;

        // ⭐ 1. Create a Map to easily merge old and new feedbacks
        const mergedFeedbacksMap = new Map();

        // ⭐ 2. Load all EXISTING feedbacks from the database into the Map
        if (currentPhase.feedbacks && Array.isArray(currentPhase.feedbacks)) {
            currentPhase.feedbacks.forEach((fb: any) => {
                mergedFeedbacksMap.set(String(fb.fileId), {
                    fileId: String(fb.fileId),
                    comment: fb.comment,
                    isSelected: fb.isSelected
                });
            });
        }

        // ⭐ 3. Overwrite or Add the NEW changes the user just made in the UI
        Object.entries(fileFeedbacks).forEach(([fileId, data]) => {
            // Check to make sure this file actually belongs to this phase
            if (currentPhase.files.some((f: any) => String(f._id) === fileId)) {
                mergedFeedbacksMap.set(fileId, {
                    fileId,
                    comment: data.comment,
                    isSelected: data.isSelected
                });
            }
        });

        // Convert the map back to a clean array for the backend
        const finalFeedbacksArray = Array.from(mergedFeedbacksMap.values());

        // Also merge the overall comment (use new typing, fallback to existing DB string)
        const finalOverallComment = overallComment.trim() !== "" 
            ? overallComment 
            : (currentPhase.clientOverallComment || "");

       
        try {
            await submitFeedback({
                projectId,
                designType: activeTab,
                // ⭐ USE THE EXACT PHASE ID PASSED FROM THE CARD ⭐
                phaseId: currentPhaseId,
                payload: {
                    status: action,
                    clientOverallComment: finalOverallComment,
                    feedbacks: finalFeedbacksArray
                }
            });
            toast({ description: `Design ${action.replace("_", " ")} successfully.`, title: "Success" });
            refetch();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || "Failed to submit feedback",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    if (error || !designApproval) {
        return (
            <div className="min-h-screen bg-brand-ash flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center bg-brand-surface border-ash-medium rounded-2xl shadow-lg">
                    <i className="fa-solid fa-link-slash text-action-danger text-4xl mb-4"></i>
                    <h2 className="text-xl font-bold text-text-main mb-2">Link Expired or Invalid</h2>
                    <p className="text-text-muted text-sm">We couldn't find the design files for this link. Please contact your designer for a new link.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden w-full  bg-brand-ash font-sans">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 bg-brand-surface border-b border-ash-medium shadow-sm px-4 sm:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="h-8 object-contain" />
                    <span className="font-bold text-lg text-text-strong hidden sm:block">{COMPANY_DETAILS.COMPANY_NAME}</span>
                </div>
                <div className="text-sm font-bold text-text-muted bg-ash-lighter px-4 py-2 rounded-full border border-ash-light">
                    Client Design Review
                </div>
            </header>

            <main className="max-w-full mx-auto px-4 sm:px-8 py-8">

                {/* ================= TABS ================= */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-brand-surface p-1.5 rounded-xl border border-ash-medium shadow-sm">
                        <button
                            onClick={() => setActiveTab("2D")}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "2D" ? "bg-action-primary text-brand-surface shadow-md" : "text-text-muted hover:text-text-main"
                                }`}
                        >
                            <i className="fa-solid fa-pen-ruler mr-2"></i>2D Layouts
                        </button>
                        <button
                            onClick={() => setActiveTab("3D")}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "3D" ? "bg-action-primary text-brand-surface shadow-md" : "text-text-muted hover:text-text-main"
                                }`}
                        >
                            <i className="fa-solid fa-cube mr-2"></i>3D Visuals
                        </button>
                    </div>
                </div>

                {phases.length === 0 ? (
                    <div className="text-center py-20 bg-brand-surface border border-dashed border-ash-medium rounded-2xl shadow-sm">
                        <i className="fa-solid fa-hourglass-empty text-ash-dark text-4xl mb-4" />
                        <h2 className="text-xl font-bold text-text-main mb-2">Designs in Progress</h2>
                        <p className="text-text-muted max-w-md mx-auto">Your design team is currently working on the {activeTab} phases. Check back soon!</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {phases.map((phase: any, _index: number) => {
                            // const isLatest = index === phases.length - 1;
                            const imageFiles = phase.files?.filter((f: any) => f.type === "image") || [];
                            const pdfFiles = phase.files?.filter((f: any) => f.type === "pdf") || [];
                            // const isActiveReview = isLatest && phase.status === "Pending";

                            return (
                                <div key={phase._id} className="flex flex-col lg:flex-row gap-6 relative">

                                    {/* LEFT SIDE: Media Gallery */}
                                    <Card className={`w-full bg-brand-surface border-ash-medium p-6 rounded-2xl shadow-sm`}>
                                        <div className="flex items-center justify-between border-b border-ash-light pb-4 mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-text-strong">Phase {phase.phaseNumber}</h3>
                                                <p className="text-sm text-text-muted">Uploaded on {new Date(phase.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            {/* {!isActiveReview && (
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${phase.status === "Approved" ? "text-action-success bg-action-success/10 border-action-success/20" : "text-action-danger bg-action-danger/10 border-action-danger/20"
                                                    }`}>
                                                    {phase.status.replace("_", " ")}
                                                </span>
                                            )} */}
                                        </div>

                                        <div className="space-y-8">
                                            {/* IMAGES */}

                                            <div>
                                                <h4 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Design Images</h4>
                                                {imageFiles.length === 0 ? (
                                                    <div className="min-h-[120px] flex items-center justify-center bg-brand-ash rounded-xl border border-dashed border-ash-medium">
                                                        <p className="text-sm text-text-muted italic">No images uploaded for this phase.</p>
                                                    </div>
                                                ) : (
                                                    <ImageGalleryExample
                                                        imageFiles={imageFiles}
                                                        refetch={refetch}
                                                        height={100}
                                                        minWidth={100}
                                                        maxWidth={200}
                                                    // popupWidth="100vw"
                                                    // popupHeight="90vh"
                                                    // overlayBg="bg-black/90"
                                                    // imageClassName="max-w-full max-h-full object-contain"
                                                    />
                                                )}
                                            </div>


                                            {/* PDFS */}
                                            <div>
                                                <h4 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Documents</h4>
                                                {pdfFiles.length === 0 ? (
                                                    <div className="min-h-[80px] flex items-center justify-center bg-brand-ash rounded-xl border border-dashed border-ash-medium">
                                                        <p className="text-sm text-text-muted italic">No documents uploaded for this phase.</p>
                                                    </div>
                                                ) : (
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {pdfFiles.map((file: any, i: number) => (
                                                            <li key={i} className="flex justify-between items-center bg-ash-lighter border border-ash-light p-3 rounded-xl hover:border-ash-medium transition-colors cursor-pointer" onClick={() => downloadImage({ src: file.url, alt: file.originalName || "Document.pdf" })}>
                                                                <div className="flex items-center gap-3 truncate">
                                                                    <div className="w-10 h-10 flex-shrink-0 bg-brand-surface border border-ash-light shadow-sm rounded-lg flex items-center justify-center">
                                                                        <i className="fa-regular fa-file-pdf text-action-danger text-lg"></i>
                                                                    </div>
                                                                    <span className="truncate text-sm font-bold text-text-strong">
                                                                        {file.originalName || "Document.pdf"}
                                                                    </span>
                                                                </div>
                                                                <i className="fa-solid fa-download text-text-muted"></i>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </Card>

                                    {/* RIGHT SIDE: Feedback Form (ONLY visible on the latest pending phase) */}
                                    {(
                                        <div className="w-full lg:w-1/3 flex flex-col gap-4">
                                            <Card className="bg-brand-surface border-ash-medium p-5 rounded-2xl shadow-sm sticky top-24">
                                                <h3 className="text-lg font-bold text-text-strong mb-1">Your Feedback</h3>
                                                <p className="text-xs text-text-muted mb-6 border-b border-ash-light pb-4">Let your designer know your thoughts on Phase {phase.phaseNumber}.</p>

                                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar border-b border-ash-light">
                                                    {(!phase?.files || phase?.files?.length === 0) ? (
                                                        // 🆕 FALLBACK UI: Shown when no files exist yet
                                                        <div className="text-center py-8 bg-brand-ash rounded-xl border border-dashed border-ash-medium">
                                                            <i className="fa-solid fa-folder-open text-ash-dark text-2xl mb-2 opacity-50"></i>
                                                            <p className="text-xs text-text-muted italic">No design files have been uploaded for review yet.</p>
                                                        </div>
                                                    ) : (
                                                        phase.files.map((file: any, i: number) => (
                                                            <div key={file._id} className="bg-ash-lighter p-3 rounded-xl border border-ash-light">
                                                                <div className="flex items-center gap-2 mb-2 truncate">
                                                                    <i className={`text-text-muted text-xs ${file.type === 'pdf' ? 'fa-regular fa-file-pdf' : 'fa-regular fa-image'}`}></i>
                                                                    <span className="text-xs font-bold text-text-main truncate">{file.originalName || `File ${i + 1}`}</span>
                                                                </div>
                                                                <textarea
                                                                    placeholder="Add specific comments..."
                                                                    value={fileFeedbacks[file._id]?.comment || ""}
                                                                    onChange={(e) => handleFileCommentChange(file._id, e.target.value)}
                                                                    className="w-full text-sm p-2 rounded-lg border border-ash-medium bg-brand-surface focus:ring-2 focus:ring-action-primary focus:border-transparent outline-none resize-none h-16"
                                                                />
                                                                {file.type === "image" && (
                                                                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={fileFeedbacks[file._id]?.isSelected || false}
                                                                            onChange={() => handleFileSelectionToggle(file._id)}
                                                                            className="w-4 h-4 rounded border-ash-medium text-action-primary focus:ring-action-primary"
                                                                        />
                                                                        <span className="text-xs font-bold text-text-main">I approve this specific design</span>
                                                                    </label>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <div className="mt-6 pt-4 ">
                                                    <label className="block text-sm font-bold text-text-strong mb-2">Overall Comments</label>
                                                    <textarea
                                                        placeholder="General thoughts on this phase..."
                                                        value={overallComment}
                                                        onChange={(e) => setOverallComment(e.target.value)}
                                                        className="w-full text-sm p-3 rounded-xl border border-ash-medium bg-brand-surface focus:ring-2 focus:ring-action-primary outline-none resize-none h-24 mb-6"
                                                    />

                                                    <div className="flex flex-wrap gap-3 ">


                                                        <Button
                                                            variant="outline"
                                                            className="w-full !border-ash-dark text-text-main  hover:bg-brand-ash rounded-xl text-sm transition-colors"
                                                            isLoading={submitPending}
                                                            // Passing "Pending" keeps the phase active, but still updates the database with their text!
                                                            onClick={() => handleSubmit("Pending", phase._id)}
                                                        >
                                                            <i className="fa-solid fa-floppy-disk mr-2"></i> Save Comments
                                                        </Button>


                                                        <Button
                                                            variant="dark"
                                                            className="w-full text-brand-surface  rounded-xl shadow-sm text-base"
                                                            isLoading={submitPending}
                                                            // onClick={() => handleSubmit("Approved")}
                                                            onClick={() => handleSubmit("Approved", phase._id)}
                                                        >
                                                            <i className="fa-solid fa-check-double mr-2"></i> Approve Phase {phase.phaseNumber}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full !border-ash-dark text-text-main hover:text-text-main rounded-xl text-base transition-colors"
                                                            isLoading={submitPending}
                                                            // onClick={() => handleSubmit("Revision_Requested")}
                                                            onClick={() => handleSubmit("Revision_Requested", phase._id)}
                                                        >
                                                            <i className="fa-solid fa-arrow-rotate-left mr-2"></i> Request Revisions
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    )}

                                    {/* RIGHT SIDE (Read-Only history for older phases) */}
                                    {/* {phase.feedbacks && phase.feedbacks.length > 0 && (
                                        <div className="w-full lg:w-1/3">
                                            <Card className="bg-brand-surface border-ash-medium p-5 rounded-2xl shadow-sm h-full">
                                                <h3 className="text-lg font-bold text-text-strong mb-4">Past Feedback</h3>
                                                {phase.clientOverallComment && (
                                                    <div className="mb-4 bg-ash-lighter p-3 rounded-xl border border-ash-light">
                                                        <span className="text-xs font-bold text-text-muted uppercase">Overall</span>
                                                        <p className="text-sm text-text-main mt-1 italic">"{phase.clientOverallComment}"</p>
                                                    </div>
                                                )}
                                            </Card>
                                        </div>
                                    )} */}

                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DesignApprovalPublic;