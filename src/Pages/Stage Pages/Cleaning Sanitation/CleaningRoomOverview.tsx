import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetSingleCleaningRoom,
    useUploadCleaningRoomFiles,
    useDeleteCleaningRoomFile,
    useUpdateCleaningRoomStatus,
    useUpdateCleaningStageRoomNotes,
} from "../../../apiList/Stage Api/cleaningStageApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import type { ICleaningUpload } from "./CleaningOverview";
import { Textarea } from "../../../components/ui/TextArea";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { downloadImage } from "../../../utils/downloadFile";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

export default function CleaningRoomOverview() {
    const { projectId, roomId, organizationId } = useParams() as { projectId: string, roomId: string, organizationId: string };
    const navigate = useNavigate()

    const { data, isLoading, refetch, isError, error } = useGetSingleCleaningRoom(
        projectId as string,
        roomId as string
    );



    const { role, permission } = useAuthCheck();


    const canDelete = role === "owner" || permission?.cleaning?.delete;
    // const canList = role === "owner" || permission?.cleaning?.list;
    const canCreate = role === "owner" || permission?.cleaning?.create;
    const canEdit = role === "owner" || permission?.cleaning?.edit;


    const [popupImage, setPopupImage] = useState<string | null>(null);

    const { mutateAsync: uploadFiles, isPending: uploading } = useUploadCleaningRoomFiles();
    const { mutateAsync: deleteFile, isPending: deleting } = useDeleteCleaningRoomFile();
    const { mutateAsync: updateStatus, isPending: updatingStatus } = useUpdateCleaningRoomStatus();
    const { mutateAsync: updateNotes, isPending: saving } = useUpdateCleaningStageRoomNotes()

    const [completelyCleaned, setCompletelyCleaned] = useState<boolean>(data?.completelyCleaned || false);

    const [noteText, setNoteText] = useState(data?.notes || "");
    const [editing, setEditing] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setSelectedFiles(e.target.files);
        }
    };


    const handleUpload = async () => {
        try {
            if (!selectedFiles) {
                throw new Error("select the files before uploading")
            };

            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append("files", selectedFiles[i]);
            }


            await uploadFiles({ projectId, roomId, formData });
            toast({ title: "Success", description: "Files uploaded successfully." });
            setSelectedFiles(null); // clear selection
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            await deleteFile({ projectId: projectId!, roomId: roomId!, fileId });
            toast({ title: "Deleted", description: "File deleted successfully." });
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error.message,
                variant: "destructive",
            });
        }
    };


    const handleSaveNotes = async () => {
        try {
            if (!noteText.trim()) {
                throw new Error("please enter some notes")
            }
            await updateNotes({ projectId, roomId, notes: noteText });
            toast({ title: "Notes updated!", description: "Room notes saved." });
            setEditing(false)
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to update", variant: "destructive" });
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await updateStatus({
                projectId: projectId!,
                roomId: roomId!,
                completelyCleaned: !completelyCleaned,
            });
            toast({
                title: "Updated",
                description: `Marked as ${!completelyCleaned ? "completely cleaned" : "not cleaned"}.`,
            });
            setCompletelyCleaned(!completelyCleaned);
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error.message,
                variant: "destructive",
            });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    if (isError) {
        <div className="flex-1 flex items-center justify-center bg-brand-surface">
            <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 font-semibold mb-2">
                    ⚠️ Error Occurred
                </div>
                <p className="text-red-500 text-sm mb-4">
                    {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
                </p>
                <Button
                    onClick={() => refetch()}
                    className="bg-red-600 text-white hover:bg-red-700"
                >
                    Retry
                </Button>
            </div>
        </div>
    }

    const imageFiles = (data?.uploads || [])?.filter((file: any) => file.type === "image")

    return (
        <div className="w-full h-full max-h-full overflow-y-auto custom-scrollbar-none sm:custom-scrollbar bg-brand-surface">
            <div className="mb-4 flex justify-between items-center w-full border-b border-ash-light">

                {/* <h2 className="text-md sm:text-2xl font-semibold mb-4 text-blue-700 flex items-center">
                    <i className="fas fa-broom mr-2"></i> {data?.roomName} - Details
                </h2> */}

                <h2 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm">
                        <i className="fas fa-broom text-text-muted text-lg"></i>
                    </div>
                    <span className="capitalize">{data?.roomName} - Details</span>
                </h2>

                <div className="flex gap-1 items-center">
                    {(canCreate || canEdit) && <Button
                        isLoading={updatingStatus}
                        onClick={handleUpdateStatus}
                        // className="bg-blue-600 hover:bg-blue-700 text-white text-sm !p-2 lg:p-4 "
                        variant={completelyCleaned ? "outline" : "dark"}
                        className={`shadow-sm flex-1 sm:flex-none px-5 transition-all ${completelyCleaned ? "border-ash-medium text-text-main hover:bg-brand-ash" : ""}`}
                    >
                        {completelyCleaned ? "Mark as Not Cleaned" : "Mark as Cleaned"}
                    </Button>
                    }

                    <Button variant="white"
                        // className="" 
                        className="shadow-sm border-ash-medium text-text-main flex-1 sm:flex-none px-5"
                        onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/cleaning`)}>
                        <i className="fa-solid fa-arrow-left sm:mr-2"></i>
                        Go Back
                    </Button>
                </div>
            </div>

            <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-1 items-center place-content-center">
                <Card className="p-2 bg-brand-surface border-2 border-ash-medium">
                    <div className="w-full justify-between flex items-center border-b border-ash-light">
                        {/* <h3 className="text-md font-semibold  text-blue-700">Notes</h3> */}
                        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                            <i className="fa-regular fa-clipboard text-text-muted"></i>
                            Notes
                        </h3>
                        {(!editing && (canCreate || canEdit)) && <Button
                            onClick={() => { setNoteText(data?.notes); setEditing(true) }}
                            // className="bg-blue-600 text-white hover:bg-blue-700"
                            className="border-ash-medium text-text-main shadow-sm"
                            variant="white"
                        >
                            {/* Edit <i className="fas fa-pencil ml-2 "></i> */}
                            <i className="fas fa-pencil sm:mr-2"></i>
                            <span className="hidden sm:inline">Edit</span>
                        </Button>}
                    </div>

                    {editing ? (
                        <>
                            <Textarea
                                rows={4}
                                // className="w-full border rounded p-2"
                                className="w-full bg-brand-ash border-ash-medium text-text-main focus:ring-ash-medium placeholder:text-text-muted rounded-lg p-3 resize-none custom-scrollbar"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Enter notes here..."
                            />

                            <div className="mt-2 flex gap-2">


                                <Button
                                    onClick={() => {
                                        setEditing(false);
                                        setNoteText(data?.notes ?? ""); // reset to original
                                    }}
                                    variant="outline"
                                    className="border-ash-medium text-text-main hover:bg-brand-ash shadow-sm"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    onClick={handleSaveNotes}
                                    isLoading={saving}
                                    // className="bg-blue-600 text-white hover:bg-blue-700"
                                    variant="dark"
                                    className="shadow-sm px-6"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative overflow-x-auto overflow-y-auto break-words h-[6rem] max-h-[6rem] leading-5 custom-scrollbar"> {/* ~2 lines height */}
                                {/* <p className="text-gray-700 mb-2 "> */}
                                <p className={`text-sm ${data?.notes?.trim() ? "text-text-main font-medium" : "text-text-muted italic"}`}>                                    {data?.notes?.trim()
                                    ? data?.notes
                                    : "No notes present."}
                                </p>
                            </div>
                        </>
                    )}
                </Card>

                {(canCreate || canEdit) && 
                // <Card className="p-2 h-full border-gray-100 border-2">
                //     <Label className="block mb-2 font-semibold !text-blue-700">Upload Images or PDFs:</Label>
                <Card className="p-5 bg-brand-surface border border-ash-medium rounded-xl shadow-sm flex flex-col justify-center">
                        <Label className="mb-4 font-bold text-text-main flex items-center gap-2">
                            <i className="fa-solid fa-cloud-arrow-up text-text-muted"></i>
                            Upload Images or PDFs
                        </Label>
                    <Input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        // className="border-b w-full"
                        className="w-full bg-brand-ash border border-ash-medium text-text-main file:bg-brand-surface file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all"
                    />

                    <Button
                        onClick={handleUpload}
                        isLoading={uploading}
                        // className="mt-3 bg-blue-600 text-white hover:bg-blue-700"
                        variant="dark"
                            className="mt-5 shadow-sm w-full sm:w-auto self-end px-6"
                    >
                        {uploading ? "Uploading..." : `Upload ${selectedFiles ? selectedFiles.length : ""} file(s)`}
                    </Button>
                </Card>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[95%] sm:h-[65%]">
               
                {/* <Card className="p-2 lg:p-4 max-h-full overflow-y-auto custom-scrollbar border-1 border-[#8485887a]">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Images</h3>
                    {data?.uploads?.filter((f: ICleaningUpload) => f.type === "image").length === 0 ? (
                        <p className="text-gray-400 text-sm">No images uploaded.</p>
                    ) : (

                        <ImageGalleryExample
                            imageFiles={imageFiles}
                            {...(canDelete ? { handleDeleteFile: handleDelete } : {})}
                            // className="grid grid-cols-3"
                            height={80}
                            minWidth={98}
                            maxWidth={100}
                        />
                    )}
                </Card> */}


                <Card className="p-4 bg-brand-surface border-2 border-ash-medium rounded-xl shadow-sm min-h-[300px] max-h-[400px] flex flex-col">
                    <h3 className="text-base font-bold text-text-main mb-4 pb-3 border-b border-ash-light flex items-center gap-2">
                        <i className="fas fa-image text-text-muted"></i>
                        Images
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                        {imageFiles.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center border border-dashed border-ash-medium rounded-xl bg-brand-ash/50 py-10">
                                <i className="fa-regular fa-image text-3xl text-ash-dark mb-2"></i>
                                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">No images uploaded.</p>
                            </div>
                        ) : (
                            <ImageGalleryExample
                                imageFiles={imageFiles}
                                {...(canDelete ? {handleDeleteFile:handleDelete} : {} ) }
                                height={80}
                                minWidth={98}
                                maxWidth={100}
                            />
                        )}
                    </div>
                </Card>


                {/* PDFs Section */}
                {/* <Card className="p-4 max-h-full overflow-y-auto border-1 border-[#8485887a] custom-scrollbar"> */}
                <Card className="p-4 bg-brand-surface border-2 border-ash-medium rounded-xl shadow-sm min-h-[300px] max-h-[400px] flex flex-col">
                    {/* <h3 className="text-lg font-semibold mb-3 text-blue-700">PDFs</h3> */}

                    <h3 className="text-base font-bold text-text-main mb-4 pb-3 border-b border-ash-light flex items-center gap-2">
                        <i className="fas fa-file-pdf text-text-muted"></i>
                        PDF Documents
                    </h3>

                    {data.uploads?.filter((f: ICleaningUpload) => f.type === "pdf").length === 0 ? (
                        // <p className="text-gray-400 text-sm">No PDFs uploaded.</p>
                        <div className="h-full flex flex-col items-center justify-center border border-dashed border-ash-medium rounded-xl bg-brand-ash/50 py-10">
                                <i className="fa-solid fa-file-import text-3xl text-ash-dark mb-2"></i>
                                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">No PDFs uploaded.</p>
                            </div>
                    ) : (
                        <ul className="space-y-2">
                            {data?.uploads
                                .filter((f: ICleaningUpload) => f.type === "pdf")
                                .map((f: ICleaningUpload) => (
                                    <li
                                        key={f.url}
                                        // className="flex items-center justify-between shadow-md p-2 rounded h-full"
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-brand-ash border border-ash-light p-3 rounded-lg shadow-sm gap-3"   
                                    >
                                        <a
                                            href={f.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            // className="text-blue-600 underline truncate max-w-[50%]"
                                            className="flex items-center gap-2 text-text-main font-bold text-sm hover:text-action-primary transition-colors truncate max-w-full sm:max-w-[60%]"
                                        >
                                            {/* {f.originalName} */}
                                            <i className="fa-solid fa-file-pdf text-action-danger"></i>
                                                <span className="truncate">{f.originalName}</span>
                                        </a>


                                        <div className="space-x-1">
                                            
                                            <Button size="sm"
                                                // variant="primary"
                                                variant="white"
                                                    className="border-ash-medium text-text-main shadow-sm"
                                                onClick={() => downloadImage({ src: f?.url, alt: f?.originalName || "file.pdf" })}
                                            >
                                                <i className="fa-solid fa-download"></i>
                                            </Button>

                                            {canDelete && <Button
                                                size="sm"
                                                isLoading={deleting}
                                                onClick={() => handleDelete(f._id)}
                                                disabled={deleting}
                                                // variant="danger"
                                                // className="bg-red-600 text-white rounded px-2 py-1 text-xs"
                                                variant="ghost"
                                                        className="text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                                            >
                                                <i className="fas fa-trash-can"></i>
                                            </Button>}
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    )}
                </Card>
            </div>


            {/* Popup Image Viewer */}
            {/* {popupImage && (
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
            )} */}

            {popupImage && (
                <div
                    onClick={() => setPopupImage(null)}
                    className="fixed inset-0 z-[9999] bg-brand-main/90 flex items-center justify-center p-4 backdrop-blur-md"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-brand-surface rounded-xl p-2 max-w-[90vw] max-h-[90vh] shadow-2xl border border-ash-medium animate-in fade-in zoom-in duration-200"
                    >
                        <button
                            onClick={() => setPopupImage(null)}
                            className="absolute -top-4 -right-4 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all z-10"
                        >
                            <i className="fas fa-times text-lg"></i>
                        </button>
                        <img
                            src={popupImage}
                            alt="Full View"
                            className="max-h-[85vh] w-auto object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
