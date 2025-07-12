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

// const dummyUploads: ICleaningUpload[] = [
//     {
//         _id: "000c10101",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "livingroom_before.jpg",
//         uploadedAt: new Date("2024-07-01T09:00:00Z"),
//     },
//     {
//         _id: "0001l0101",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "kitchen_before.jpg",
//         uploadedAt: new Date("2024-07-01T09:05:00Z"),
//     },
//     {
//         _id: "0001a0101",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report1.pdf",
//         originalName: "kitchen_checklist.pdf",
//         uploadedAt: new Date("2024-07-01T09:10:00Z"),
//     },
//     {
//         _id: "000101n01",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "bathroom_after.jpg",
//         uploadedAt: new Date("2024-07-01T09:15:00Z"),
//     },
//     {
//         _id: "000101x01",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report2.pdf",
//         originalName: "bathroom_sanitation_report.pdf",
//         uploadedAt: new Date("2024-07-01T09:20:00Z"),
//     },
//     {
//         _id: "000101f01",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "balcony_cleaned.jpg",
//         uploadedAt: new Date("2024-07-01T09:25:00Z"),
//     },
//     {
//         _id: "000101n01",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "foyer_area.jpg",
//         uploadedAt: new Date("2024-07-01T09:30:00Z"),
//     },
//     {
//         _id: "0001010a1",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report3.pdf",
//         originalName: "terrace_inspection.pdf",
//         uploadedAt: new Date("2024-07-01T09:35:00Z"),
//     },
//     {
//         _id: "000101b01",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "study_room.jpg",
//         uploadedAt: new Date("2024-07-01T09:40:00Z"),
//     },
//     {
//         _id: "0001010 1",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report4.pdf",
//         originalName: "studyroom_report.pdf",
//         uploadedAt: new Date("2024-07-01T09:45:00Z"),
//     },
//     {
//         _id: "0001010v1",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "car_parking.jpg",
//         uploadedAt: new Date("2024-07-01T09:50:00Z"),
//     },
//     {
//         _id: "0001010s1",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report5.pdf",
//         originalName: "car_parking_checklist.pdf",
//         uploadedAt: new Date("2024-07-01T09:55:00Z"),
//     },
//     {
//         _id: "0001010d1",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "garden_cleaned.jpg",
//         uploadedAt: new Date("2024-07-01T10:00:00Z"),
//     },
//     {
//         _id: "000101016",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report6.pdf",
//         originalName: "garden_maintenance.pdf",
//         uploadedAt: new Date("2024-07-01T10:05:00Z"),
//     },
//     {
//         _id: "000101015",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "storage_room.jpg",
//         uploadedAt: new Date("2024-07-01T10:10:00Z"),
//     },
//     {
//         _id: "000101014",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report7.pdf",
//         originalName: "storage_room_report.pdf",
//         uploadedAt: new Date("2024-07-01T10:15:00Z"),
//     },
//     {
//         _id: "000101013",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "entertainment_room.jpg",
//         uploadedAt: new Date("2024-07-01T10:20:00Z"),
//     },
//     {
//         _id: "000101012",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report8.pdf",
//         originalName: "entertainment_check.pdf",
//         uploadedAt: new Date("2024-07-01T10:25:00Z"),
//     },
//     {
//         _id: "000101031",
//         type: "image",
//         url: "https://picsum.photos/200",
//         originalName: "home_gym.jpg",
//         uploadedAt: new Date("2024-07-01T10:30:00Z"),
//     },
//     {
//         _id: "000101021",
//         type: "pdf",
//         url: "https://s3.example.com/uploads/cleaning/report9.pdf",
//         originalName: "gym_report.pdf",
//         uploadedAt: new Date("2024-07-01T10:35:00Z"),
//     },
// ];

export default function CleaningRoomOverview() {
    const { projectId, roomId, organizationId } = useParams() as { projectId: string, roomId: string, organizationId: string };
    const navigate = useNavigate()

    const { data, isLoading, refetch, isError, error } = useGetSingleCleaningRoom(
        projectId as string,
        roomId as string
    );
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
            console.log(error.message)
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
        <div className="flex-1 flex items-center justify-center">
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


    return (
        <div className="w-full h-full max-h-full overflow-y-auto custom-scrollbar-none sm:custom-scrollbar">
            <div className="mb-4 flex justify-between items-center w-full">

                <h2 className="text-md sm:text-2xl font-semibold mb-4 text-blue-700 flex items-center">
                    <i className="fas fa-broom mr-2"></i> {data?.roomName} - Details
                </h2>

                <div className="flex gap-1 items-center">
                    <Button
                        isLoading={updatingStatus}
                        onClick={handleUpdateStatus}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm !p-2 lg:p-4 "
                    >
                        {completelyCleaned ? "Mark as Not Cleaned" : "Mark as Cleaned"}
                    </Button>


                    <Button variant="primary" className="" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/cleaning`)}>
                        Go Back
                    </Button>
                </div>
            </div>

            <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-1 items-center place-content-center">
                <Card className="p-2 border-gray-100 border-2">
                    <div className="w-full justify-between flex items-center">
                        <h3 className="text-md font-semibold  text-blue-700">Notes</h3>
                        {!editing && <Button
                            onClick={() => { setNoteText(data?.notes); setEditing(true) }}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Edit <i className="fas fa-pencil ml-2 "></i>
                        </Button>}
                    </div>

                    {editing ? (
                        <>
                            <Textarea
                                rows={4}
                                className="w-full border rounded p-2"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Enter notes here..."
                            />

                            <div className="mt-2 flex gap-2">
                                <Button
                                    onClick={handleSaveNotes}
                                    disabled={saving}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </Button>

                                <Button
                                    onClick={() => {
                                        setEditing(false);
                                        setNoteText(data?.notes ?? ""); // reset to original
                                    }}
                                    variant="outline"
                                    className="border-gray-400"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative overflow-x-auto overflow-y-auto break-words h-[6rem] max-h-[6rem] leading-5 custom-scrollbar"> {/* ~2 lines height */}
                                <p className="text-gray-700 mb-2 ">
                                    {data?.notes?.trim()
                                        ? data?.notes
                                        : "No notes present."}
                                </p>
                            </div>
                        </>
                    )}
                </Card>

                <Card className="p-2 h-full border-gray-100 border-2">
                    <Label className="block mb-2 font-semibold !text-blue-700">Upload Images or PDFs:</Label>
                    <Input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="border-b w-full"
                    />

                    <Button
                        onClick={handleUpload}
                        isLoading={uploading}
                        className="mt-3 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {uploading ? "Uploading..." : `Upload ${selectedFiles ? selectedFiles.length : ""} file(s)`}
                    </Button>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[95%] sm:h-[65%]">
                {/* Images Section */}
                <Card className="p-2 lg:p-4 max-h-full overflow-y-auto custom-scrollbar border-1 border-[#8485887a]">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Images</h3>
                    {data?.uploads?.filter((f: ICleaningUpload) => f.type === "image").length === 0 ? (
                        <p className="text-gray-400 text-sm">No images uploaded.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {data?.uploads?.
                                filter((f: ICleaningUpload) => f.type === "image")
                                .map((f: ICleaningUpload) => (
                                    <div
                                        key={f.url}
                                        className="relative group rounded overflow-hidden"
                                    >
                                        {/* Image */}
                                        <img
                                            src={f.url}
                                            alt={f.originalName}
                                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* Bottom gradient overlay */}
                                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Delete Button (top-right) */}
                                        <Button
                                        size="sm"
                                        variant="danger"
                                            isLoading={deleting}
                                            onClick={() => handleDelete(f._id)}
                                            disabled={deleting}
                                            className="absolute  top-2 right-2 bg-red-600 text-white border-none rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>

                                        {/* Bottom-right actions */}
                                        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                            size="sm"
                                                variant="primary"
                                                onClick={() => setPopupImage(f.url)}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </Button>
                                            <Button size="sm"
                                                variant="primary"
                                                onClick={() => downloadImage({ src: f?.url, alt: f?.originalName || "file.pdf" })}
                                            >
                                                <i className="fa-solid fa-download"></i>
                                            </Button>

                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>

                {/* PDFs Section */}
                <Card className="p-4 max-h-full overflow-y-auto border-1 border-[#8485887a] custom-scrollbar">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">PDFs</h3>
                    {data.uploads?.filter((f: ICleaningUpload) => f.type === "pdf").length === 0 ? (
                        <p className="text-gray-400 text-sm">No PDFs uploaded.</p>
                    ) : (
                        <ul className="space-y-2">
                            {data?.uploads
                                .filter((f: ICleaningUpload) => f.type === "pdf")
                                .map((f: ICleaningUpload) => (
                                    <li
                                        key={f.url}
                                        className="flex items-center justify-between shadow-md p-2 rounded h-full"
                                    >
                                        <a
                                            href={f.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline truncate max-w-[50%]"
                                        >
                                            {f.originalName}
                                        </a>


                                        <div className="space-x-1">
                                            {/* <a
                                                href={f.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 text-white rounded px-2 py-1 text-xs hover:bg-blue-700"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </a> */}
                                            <Button size="sm"
                                                variant="primary"
                                                onClick={() => downloadImage({ src: f?.url, alt: f?.originalName || "file.pdf" })}
                                            >
                                                <i className="fa-solid fa-download"></i>
                                            </Button>

                                            <Button
                                            size="sm"
                                                isLoading={deleting}
                                                onClick={() => handleDelete(f._id)}
                                                disabled={deleting}
                                                variant="danger"
                                                className="bg-red-600 text-white rounded px-2 py-1 text-xs"
                                            >
                                                <i className="fas fa-trash-can"></i>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    )}
                </Card>
            </div>


            {/* Popup Image Viewer */}
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
        </div>
    );
}
