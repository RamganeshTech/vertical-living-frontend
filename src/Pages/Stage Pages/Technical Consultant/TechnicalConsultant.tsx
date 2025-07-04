import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import { Separator } from "../../../components/ui/Seperator";
import { useAddConsultationMessage, useGetConsultationMessages, useDeleteConsultationMessage, useEditConsultationMessage, useSetDeadLineTechConsultation, useCompletionStatusTechConsultation } from "../../../apiList/Stage Api/technicalConsultationApi";
import useGetRole from './../../../Hooks/useGetRole';
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toast } from "../../../utils/toast";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";

const TechnicalConsultant = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { role, _id: userId } = useGetRole();


    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const [previewImage, setPreviewImage] = useState<string | null>(null);


    let { data: techDoc, isLoading: getMessageLoading, error: getMessageError, isError: getMessageIsError, refetch } = useGetConsultationMessages(projectId!);
    const { mutate: sendMessage, isPending: sendMessagePending } = useAddConsultationMessage();
    const { mutate: deleteMessage, isPending: deletePending } = useDeleteConsultationMessage();
    const { mutate: editMessage, isPending: editPending } = useEditConsultationMessage();

    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineTechConsultation()
    const updateCompletionStatus = useCompletionStatusTechConsultation();


    const handleCompletionStatus = async () => {
        try {
            await updateCompletionStatus.mutateAsync({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

        }
    };


    const handleSend = () => {
        try {
            if (!text && attachments.length === 0) {
                throw new Error("please write anything")
            };

            const formData = new FormData();
            if (text) formData.append("message", text);
            if (role) formData.append("senderRole", role);
            formData.append("sender", userId!);

            attachments.forEach(file => formData.append("attachments", file));

            sendMessage({ projectId: projectId!, formData });
            setText("");
            setAttachments([]);
            toast({ description: "message sent successfully", title: "Success" })
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to send the message", variant: "destructive" })

        }
    };

    const handleDelete = (id: string) => {
        deleteMessage({ projectId: projectId!, messageId: id, senderId: userId! });
    };

    const handleEdit = (id: string, originalText: string) => {
        setEditingId(id);
        setEditText(originalText);
    };
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    const handleEditSubmit = () => {
        if (!editingId || !editText) return;
        editMessage({ projectId: projectId!, messageId: editingId, message: editText, senderId: userId! });
        setEditingId(null);
        setEditText("");
    };



    const attachemnts = [

        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "living-room.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "image",
            url: "https://www.bing.com/images/search?q=images%20good&FORM=IQFRBA&id=86B6D89E9BD96770DEF7716BCF2B25F6EED734FB",
            originalName: "kitchen-view.jpg",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            originalName: "site-layout.pdf",
            uploadedAt: new Date().toISOString(),
        },

    ]


    console.log("messages", techDoc)
    console.log("tech error", getMessageError)
    console.log("tech error boolean", getMessageIsError)

    return (
        <div className="max-w-full h-full  mx-auto p-2">
            <div className='flex justify-between w-full mb-4'>
                <h2 className="text-3xl font-semibold text-blue-600 flex items-center">
                    <i className="fas fa-comments mr-2"></i> Technical Consultation
                </h2>

                <div className='flex items-center gap-2 justify-between'>
                    <Button onClick={handleCompletionStatus} className="bg-green-600 mt-2 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark as Complete
                    </Button>

                    <ResetStageButton projectId={projectId!} stageNumber={4} stagePath="technicalconsultation" />

                    <AssignStageStaff
                        stageName="TechnicalConsultationModel"
                        projectId={projectId!}
                        organizationId={"684a57015e439b678e8f6918"}
                        currentAssignedStaff={techDoc?.assignedTo || null}
                    />
                </div>
            </div>

            <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
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

            <div className="space-y-4 border-2 border-[#0a0a0a18] h-[41%]">
                <div className="flex flex-col-reverse overflow-y-auto h-full px-2 py-1 space-y-reverse space-y-4">
                    {(getMessageIsError || getMessageError) && <div className="text-center flex h-full items-center justify-center py-10">
                        <div>
                            <i className="fas fa-ban text-9xl text-blue-300 mb-4"></i>
                            <p className="text-lg">{(getMessageError as any).response.data.message || (getMessageError as any)?.message || "Failed to load , please try again"}</p>
                            <p className="text-sm"></p>
                        </div>
                    </div>}
                    {getMessageLoading ? (
                        <div className="flex  h-full items-center justify-center py-10">
                            <i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
                            <span className="ml-3 text-blue-600 font-medium">Loading messages...</span>
                        </div>
                    ) : techDoc?.messages.length === 0 ? (
                        <div className="text-center flex h-full items-center justify-center py-10">
                            <div>
                                <i className="fas fa-envelope text-9xl text-blue-300 mb-4"></i>
                                <p className="text-lg">No messages have been posted yet.</p>
                                <p className="text-sm">Start the conversation using the box below.</p>
                            </div>
                        </div>
                    )
                        : (
                            //    <div className="h-full flex flex-col gap-4 overflow-y-scroll">
                            <div className="overflow-y-auto flex flex-col-reverse space-y-reverse space-y-4 ">
                                {techDoc?.messages
                                    ?.slice()
                                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((msg: any) => (
                                        <div key={msg._id} className="bg-blue-50 w-full group px-4 py-1 rounded-lg shadow flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] text-gray-600">{msg.senderRole.toUpperCase()} - {new Date(msg.createdAt).toLocaleString()}</p>
                                                <div className="opacity-0 scale-95 group-hover:opacity-100 transition-all duration-300">
                                                    {(msg.sender === userId || role === "owner" || role === "CTO") && (
                                                        <div className="flex gap-2">
                                                            <Button variant="secondary" onClick={() => handleEdit(msg._id, msg.message)} className="text-blue-600 text-sm">
                                                                <i className="fas fa-edit"></i>
                                                            </Button>
                                                            <Button variant="danger" isLoading={deletePending} onClick={() => handleDelete(msg._id)} className="text-white bg-red-600 text-sm">
                                                                <i className="fas fa-trash"></i>
                                                            </Button>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>

                                            {editingId === msg._id ? (
                                                <div className="flex gap-2 items-center">
                                                    <Input value={editText} onChange={(e) => setEditText(e.target.value)} />
                                                    <Button isLoading={editPending} onClick={handleEditSubmit}>Save</Button>
                                                    <Button variant="danger" className={"border-red-200 hover:bg-red-700 bg-red-600 text-white"} onClick={handleCancelEdit}>cancel</Button>
                                                </div>
                                            ) : (
                                                <p className="text-gray-900 text-sm ">{msg.message}</p>
                                            )}

                                            <div className="flex flex-wrap max-w-[80%] gap-3">
                                                {msg.attachments?.map((att: any, index: number) => (
                                                    // {attachemnts?.map((att: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-2 bg-white border px-3 py-2 rounded shadow-sm">
                                                        <i className={`fas ${att.type === "pdf" ? "fa-file-pdf text-red-500" : "fa-image text-blue-500"}`}></i>
                                                        <span className="text-sm text-gray-700 truncate max-w-[120px]">{att.originalName}</span>

                                                        {att.type === "image" && (
                                                            <button
                                                                onClick={() => setPreviewImage(att.url)}
                                                                className="text-blue-600 hover:underline text-xs"
                                                            >
                                                                View
                                                            </button>
                                                        )}

                                                        <a
                                                            href={att.url}
                                                            download
                                                            className="text-green-600 hover:underline text-xs"
                                                        >
                                                            Download
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        )}
                </div>
            </div>

            {/* <Separator className="my-4" /> */}

            <div className="bg-white p-4 rounded-xl shadow-md">
                <Label htmlFor="message">Your Message</Label>
                <div className="flex gap-2 mb-2 ">
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
                        className=""
                    />
                    <Button isLoading={sendMessagePending} onClick={handleSend}>Send <i className="ml-2 fa-solid fa-paper-plane"></i></Button>
                </div>

                <Label>Attach Files (PDF or Image)</Label>
                <Input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                    className="mb-3"
                />

            </div>

            {previewImage && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-auto">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-red-500 text-xl"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <img src={previewImage} alt="Preview" className="max-h-[80vh] rounded" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicalConsultant;
