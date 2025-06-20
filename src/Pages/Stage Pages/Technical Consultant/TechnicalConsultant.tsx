import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import { Separator } from "../../../components/ui/Seperator";
import { useAddConsultationMessage, useGetConsultationMessages, useDeleteConsultationMessage, useEditConsultationMessage } from "../../../apiList/Stage Api/technicalConsultationApi";
import useGetRole from './../../../Hooks/useGetRole';
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toast } from "../../../utils/toast";

const TechnicalConsultant = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { role, _id: userId } = useGetRole();

    //   cosnt {} = useSelector((state:RootState)=> state.authStore)

    let { data: techDoc, isLoading: getMessageLoading, error: getMessageError, isError: getMessageIsError } = useGetConsultationMessages(projectId!);
    const { mutate: sendMessage, isPending: sendMessagePending } = useAddConsultationMessage();
    const { mutate: deleteMessage, isPending: deletePending } = useDeleteConsultationMessage();
    const { mutate: editMessage, isPending: editPending } = useEditConsultationMessage();


    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

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

    const handleEditSubmit = () => {
        if (!editingId || !editText) return;
        editMessage({ projectId: projectId!, messageId: editingId, message: editText, senderId: userId! });
        setEditingId(null);
        setEditText("");
    };


    console.log("messages", techDoc)

    return (
        <div className="max-w-full h-full  mx-auto p-2">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
                <i className="fas fa-comments mr-2"></i> Technical Consultation
            </h2>

            <div className="space-y-4 border-2 border-[#0a0a0a18] h-[70%]">
                <div className="flex flex-col-reverse overflow-y-auto h-full px-2 py-4 space-y-reverse space-y-4">
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
                                        <div key={msg._id} className="bg-blue-50 group p-4 rounded-lg shadow flex flex-col">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-sm text-gray-600">{msg.senderRole.toUpperCase()} - {new Date(msg.createdAt).toLocaleString()}</p>
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
                                                </div>
                                            ) : (
                                                <p className="text-gray-900 text-base mb-2">{msg.message}</p>
                                            )}

                                            <div className="flex flex-wrap gap-2">
                                                {msg.attachments.map((att: any, index: number) => (
                                                    <a
                                                        key={index}
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 text-sm underline flex items-center gap-1"
                                                    >
                                                        <i className={`fas ${att.type === "pdf" ? "fa-file-pdf" : "fa-image"}`}></i>
                                                        {att.originalName}
                                                    </a>
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
        </div>
    );
};

export default TechnicalConsultant;
