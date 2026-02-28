import React, { useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import {
    useAddConsultationMessage, useGetConsultationMessages,
    // useDeleteConsultationMessage, 
    useEditConsultationMessage, useSetDeadLineTechConsultation, useCompletionStatusTechConsultation
} from "../../../apiList/Stage Api/technicalConsultationApi";
import useGetRole from './../../../Hooks/useGetRole';
import { toast } from "../../../utils/toast";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { downloadImage } from "../../../utils/downloadFile";
import type { IConsultationMessage, ITechnicalConsultation } from "../../../types/types";
import { Badge } from "../../../components/ui/Badge";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";
// import { useGetStageSelection } from "../../../apiList/Modular Unit Api/Stage Selection Api/stageSelectionApi";

// Define context type
type ProjectDetailsOutlet = {
    isMobile: boolean;
    openMobileSidebar: () => void;
};

const TechnicalConsultant: React.FC = () => {
    const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>();
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const { _id: userId } = useGetRole();
    const navigate = useNavigate()

    // const { data: stageSelectionData, isLoading: selectStagePending } = useGetStageSelection(projectId!)

    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.technicalconsultant?.delete;
    // const canList = role === "owner" || permission?.technicalconsultant?.list;
    const canCreate = role === "owner" || permission?.technicalconsultant?.create;
    const canEdit = role === "owner" || permission?.technicalconsultant?.edit;

    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    let { data, isLoading: getMessageLoading, error: getMessageError, isError: getMessageIsError, refetch } = useGetConsultationMessages(projectId!);
    const techDoc = data as ITechnicalConsultation;
    const { mutateAsync: sendMessage, isPending: sendMessagePending } = useAddConsultationMessage();
    // const { mutateAsync: deleteMessage, isPending: deletePending } = useDeleteConsultationMessage();
    const { mutateAsync: editMessage, isPending: editPending } = useEditConsultationMessage();

    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineTechConsultation()
    const updateCompletionStatus = useCompletionStatusTechConsultation();

    const handleCompletionStatus = async () => {
        try {
            await updateCompletionStatus.mutateAsync({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });

            // if (!selectStagePending) {
            //     if (!stageSelectionData.mode) {
            //         navigate('../selectstage')
            //     }
            //     else if (stageSelectionData && stageSelectionData.mode === "Manual Flow") {
            //         navigate('../materialselection')

            //     } else if (stageSelectionData && stageSelectionData?.mode === "Modular Units") {
            //         navigate('../modularunits')
            //     }
            // } else {
            //     alert("Please navigate to next stage manually , you havet selected the stage yet")
            // }

            navigate('../paymentconfirmation')
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
        }
    };

    const handleSend = async () => {
        try {
            if (!text && attachments.length === 0) {
                throw new Error("please write anything")
            };

            const formData = new FormData();
            if (text) formData.append("message", text);
            if (role) formData.append("senderRole", role);
            formData.append("sender", userId!);
            attachments.forEach(file => formData.append("attachments", file));

            await sendMessage({ projectId: projectId!, formData });
            setText("");
            setAttachments([]);
            toast({ description: "message sent successfully", title: "Success" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to send the message", variant: "destructive" })
        }
    };

    // const handleDelete = async (id: string) => {
    //     await deleteMessage({ projectId: projectId!, messageId: id, senderId: userId! });
    // };

    const handleEdit = (id: string, originalText: string) => {
        setEditingId(id);
        setEditText(originalText);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    const handleEditSubmit = async () => {
        try {
            if (!editingId || !editText) {
                throw new Error("please write anything")
            };
            await editMessage({ projectId: projectId!, messageId: editingId, message: editText, senderId: userId! });
            setEditingId(null);
            setEditText("");
            toast({ description: "message edited successfully", title: "Success" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to edit the message", variant: "destructive" })
        }
    };



    if (getMessageLoading) return <MaterialOverviewLoading />

    // console.log("techDoc", techDoc)


    const getName = (role: string, sender: any) => {
        if (role === "owner") {
            return sender.username
        }
        if (role === "staff") {
            return sender.staffName

        }
        if (role === "worker") {
            return sender.workerName
        }

        if (role == "CTO") {
            return sender.CTOName
        }
    }


    return (
        <div className="container mx-auto  max-w-full max-h-full">
            {/* Responsive Header with Mobile Sidebar Toggle */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
                <h2 className="text-xl sm:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
                    {isMobile && (
                        <button
                            onClick={openMobileSidebar}
                            className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                            title="Open Menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <i className="fas fa-comments mr-2"></i> Technical Consultation
                </h2>

                <div className="w-full lg:w-[60%]  flex flex-col sm:flex-row gap-3 justify-end">
                    {/* <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end"> */}
                    {(canCreate || canEdit) && <Button
                        isLoading={updateCompletionStatus.isPending}
                        onClick={handleCompletionStatus}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark Complete
                    </Button>}
                    {/* </div> */}

                    <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
                        {(canCreate || canEdit) && <ResetStageButton
                            projectId={projectId!}
                            stageNumber={4}
                            stagePath="technicalconsultation"
                            className="flex-1 sm:flex-initial min-w-max"
                        />}

                        {/* {(!getMessageError && (canCreate || canEdit)) && <ShareDocumentWhatsapp
                            projectId={projectId!}
                            stageNumber="4"
                            className="w-full sm:w-fit"
                            isStageCompleted={techDoc?.status}
                        />} */}

                        {(canCreate || canEdit) && <AssignStageStaff
                            stageName="TechnicalConsultationModel"
                            projectId={projectId!}
                            organizationId={organizationId!}
                            currentAssignedStaff={techDoc?.assignedTo || null}
                            className="flex-1 sm:flex-initial min-w-max"
                        />}

                        <div className="w-full sm:w-auto flex justify-end sm:block">
                            <StageGuide
                                organizationId={organizationId!}
                                stageName="technicalconsultant"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Timer Card */}
            <Card className="p-4 mb-3 w-full shadow border-l-4 border-blue-600 bg-white">
                <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                    <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                    <span>Stage Timings</span>
                </div>
                <StageTimerInfo
                    stageName='technicalconsultation'
                    completedAt={techDoc?.timer?.completedAt}
                    projectId={projectId!}
                    formId={(techDoc as any)?._id}
                    deadLine={techDoc?.timer?.deadLine}
                    startedAt={techDoc?.timer?.startedAt}
                    refetchStageMutate={refetch}
                    deadLineMutate={deadLineAsync}
                    isPending={deadLinePending}
                />
            </Card>

            {/* Messages Section */}
            <div className=" flex flex-col bg-white rounded-xl p-2 shadow-md border custom-scrollbar min-h-[200px] sm:min-h-[170px] md:min-h-[190px] lg:min-h-[340px] border-gray-200 mb-2 flex-grow max-h-[70vh] sm:!max-h-[30vh] md:!max-h-[30vh] lg:!max-h-[42vh] xl:!max-h-[49vh] overflow-y-auto ">
                <div className="flex flex-col-reverse overflow-y-auto custom-scrollbar  flex-grow p-2  md:!max-h-full space-y-reverse space-y-4">
                    {(getMessageIsError || getMessageError) && (
                        <div className="flex h-full items-center justify-center py-10">
                            <div className="text-center">
                                <i className="fas fa-ban text-6xl text-blue-300 mb-4"></i>
                                <p className="text-lg text-gray-700">
                                    {(getMessageError as any)?.response?.data?.message ||
                                        (getMessageError as any)?.message ||
                                        "Failed to load messages, please try again"}
                                </p>
                                <Button
                                    onClick={() => refetch()}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <i className="fas fa-redo mr-2"></i> Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {getMessageLoading ? (
                        <div className="flex h-full items-center justify-center py-10">
                            <i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
                            <span className="ml-3 text-blue-600 font-medium">Loading messages...</span>
                        </div>
                    ) : techDoc?.messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center py-10">
                            <div className="text-center">
                                <i className="fas fa-envelope text-6xl text-blue-300 mb-4"></i>
                                <p className="text-lg text-gray-700">No messages have been posted yet.</p>
                                <p className="text-sm text-gray-500">Start the conversation using the box below.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex flex-col-reverse space-y-reverse space-y-4">
                            {techDoc?.messages
                                ?.slice()
                                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((msg: IConsultationMessage) => {
                                    // console.log("messge", msg)
                                    return (
                                        <div key={(msg)._id} className="bg-blue-50 w-full group px-4 py-[5px] rounded-lg shadow flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs sm:text-[10px] text-gray-600">
                                                    {getName(msg.senderRole, msg.sender) || msg?.senderRole?.toUpperCase() || "User"} - {new Date(msg.createdAt).toLocaleString()}

                                                    {msg.isEdited && <Badge className="sm:ml-2 my-1 sm:my-0"> <p className="hidden sm:inline-block">message is  {" "} </p> &nbsp; edited by {msg.senderRole}</Badge>}
                                                </p>
                                                <div className="opacity-0 scale-95 group-hover:opacity-100 transition-all duration-300">
                                                    {(msg.sender._id === userId || role === "owner" || role === "CTO") && (
                                                        <div className="flex gap-2">
                                                            {canEdit && <Button variant="secondary" onClick={() => handleEdit(msg._id, msg.message)} className="text-blue-600 text-sm">
                                                                <i className="fas fa-edit"></i>
                                                            </Button>}
                                                            {/* <Button variant="danger" isLoading={deletePending} onClick={() => handleDelete(msg._id)} className="text-white bg-red-600 text-sm">
                                                            <i className="fas fa-trash"></i>
                                                        </Button> */}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {editingId === msg._id ? (
                                                <div className="flex flex-col sm:flex-row gap-2 items-center mt-2">
                                                    <Input
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="flex-grow"
                                                    />
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <Button isLoading={editPending} onClick={handleEditSubmit} className="w-full sm:w-auto">Save</Button>
                                                        <Button variant="danger" className="w-full sm:w-auto border-red-200 hover:bg-red-700 bg-red-600 text-white" onClick={handleCancelEdit}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-900 text-sm">{msg.message}</p>
                                            )}

                                            <div className="flex flex-wrap gap-3 mt-3">
                                                {msg.attachments?.map((att: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-2 bg-white border px-3 py-2 rounded shadow-sm w-full max-w-[280px]">
                                                        <i className={`fas ${att.type === "pdf" ? "fa-file-pdf text-red-500" : "fa-image text-blue-500"}`}></i>
                                                        <span className="text-xs sm:text-sm text-gray-700 truncate flex-grow min-w-0">
                                                            {att.originalName}
                                                        </span>

                                                        {att.type === "image" && (


                                                            <Button size="sm"
                                                                variant="primary"
                                                                onClick={() => {
                                                                    setPreviewImage(att.url);
                                                                    setImageLoading(true);
                                                                }}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </Button>
                                                        )}

                                                        <Button onClick={() => downloadImage({ src: att?.url, alt: att?.originalName || "file.pdf" })} size="sm" className="text-sm">
                                                            <i className="fa-solid fa-download"></i>
                                                        </Button>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )}
                </div>
            </div>

            {/* Message Input Area */}
            {(canCreate || canEdit) && <div className="bg-white px-4 py-2 rounded-xl shadow-md">
                <Label htmlFor="message">Your Message</Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <Input
                        id="message"
                        placeholder="Write something..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend()
                            }
                        }}
                        className="flex-grow"
                    />
                    <Button
                        isLoading={sendMessagePending}
                        onClick={handleSend}
                        className="w-full sm:w-auto"
                    >
                        Send <i className="ml-2 fa-solid fa-paper-plane"></i>
                    </Button>
                </div>

                {(canCreate || canEdit) && <>  <Label>Attach Files (PDF or Image)</Label>
                    <Input
                        type="file"
                        multiple
                        accept=".pdf,image/*"
                        onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                        className=""
                    />
                </>
                }
            </div>}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    onClick={() => setPreviewImage(null)}
                    className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-2 sm:p-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-auto relative"
                    >
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-red-500 text-xl"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="relative min-w-80 ">
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                                    <i className="fas fa-spinner fa-spin text-3xl text-gray-600"></i>
                                </div>
                            )}

                            <img
                                src={previewImage}
                                onLoad={() => setImageLoading(false)}
                                loading="lazy"
                                alt="Preview"
                                className={`max-h-[80vh] rounded transition duration-500 ${imageLoading ? 'blur-sm scale-105' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicalConsultant;