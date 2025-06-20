import React, { useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Separator } from "../../../components/ui/Seperator";
import { useParams } from "react-router-dom";
import { useAddRoom, useCompletionStatusSampleDesign, useDeleteRoomFile, useDeleteRoomSampleDesign, useGetRoomFiles, useSetDeadLineSampleDesign, useUploadRoomFiles } from "../../../apiList/Stage Api/sampleDesignApi";
import CreateRoomPopup from "./CreateRoomForm";
import { toast } from "../../../utils/toast";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { Card } from "../../../components/ui/Card";

interface FileItem {
  type: "image" | "pdf";
  url: string;
  originalName?: string;
  uploadedAt?: string;
}


export interface IFileItem {
  type: "image" | "pdf";
  url: string;
  originalName?: string;
  uploadedAt?: Date;
}

export interface IRoom {
  roomName: string;
  files: IFileItem[];
}

export interface ISampleDesign {
  projectId: string;
  rooms: IRoom[];
  timer: {
    startedAt: Date | null;
    completedAt: Date | null;
    deadLine: Date | null;
  };
  status: "pending" | "completed";
  additionalNotes?: string | null;
  isEditable: boolean;
}

// components/AddRoomModal.tsx
interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomName: string) => Promise<void>;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(roomName);
    setRoomName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



interface FileUploadSectionProps {
  roomName: string;
  files: IFileItem[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
}

// components/FileUploadSection.tsx
const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  roomName,
  files,
  onUpload,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfFiles = files.filter(file => file.type === "pdf");
  const imageFiles = files.filter(file => file.type === "image");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await onUpload(Array.from(e.target.files));
    }
  };

  return (
    <div className="bg-white h-auto rounded-lg p-6">
      {/* File Upload Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label
            htmlFor="fileInput"
            className="cursor-pointer block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500"
          >
            Choose Files No file chosen
          </label>
          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload
        </button>
      </div>

      {/* Files Display Section */}
      <div className="grid h-auto grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Files Section */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <i className="fas fa-file-pdf text-lg" />
            <h3 className="font-medium">PDF Files</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {pdfFiles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No PDF files uploaded</p>
            ) : (
              <div className="space-y-2 ">
                {pdfFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-gray-700 truncate flex-1">
                      {file.originalName || 'Unnamed PDF'}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        download
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Download"
                      >
                        <i className="fas fa-download" />
                      </a>
                      <button
                        onClick={() => onDelete(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Files Section */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <i className="fas fa-images text-lg" />
            <h3 className="font-medium">Image Files</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {imageFiles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No image files uploaded</p>
            ) : (
              <div className="space-y-2">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-gray-700 truncate">
                        {file.originalName || 'Unnamed Image'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View"
                      >
                        {/* <i className="fas fa-eye" /> */}
                      </button>
                      <a
                        href={file.url}
                        download
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Download"
                      >
                        <i className="fas fa-download" />
                      </a>
                      <button
                        onClick={() => onDelete(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const SampleDesignModule: React.FC = () => {


  const { projectId } = useParams()

  if (!projectId) return;



  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const addRoom = useAddRoom();
  const uploadFiles = useUploadRoomFiles();
  const deleteFile = useDeleteRoomFile();
  const { mutateAsync: deleteRoom, isPending: deleteRoomIsPending } = useDeleteRoomSampleDesign();
  const { data: sampleDesign, isLoading, refetch } = useGetRoomFiles(projectId);

  const { mutateAsync: completeStatus, isPending: completePending } = useCompletionStatusSampleDesign()
  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetDeadLineSampleDesign()

  console.log("sampleDesing")

  sampleDesign.rooms[0,1].files=[

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

  const handleCompletionStatus = async () => {
    try {
      if (!completePending) {
        await completeStatus({ projectId });
      }
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

    }
  };

  const handleAddRoom = async (roomName: string) => {
    try {
      await addRoom.mutateAsync({ projectId, roomName });
    } catch (error) {
    }
  };


  const handleDeleteRoom = async (roomId: string) => {
    try {
      if (!completePending) {
        await deleteRoom({ projectId, roomId });
      }
      toast({ description: 'Room secion Deleted successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete the room", variant: "destructive" })

    }
  };

  const handleFileUpload = async (roomName: string, files: File[]) => {
    try {
      await uploadFiles.mutateAsync({ projectId, roomName, files });
    } catch (error) {
    }
  };

  const handleFileDelete = async (roomName: string, fileIndex: number) => {
    try {
      await deleteFile.mutateAsync({ projectId, roomName, fileIndex });
    } catch (error) {
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container h-full overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Sample Design Files</h1>

        <div className="space-x-2">
          <button
            onClick={() => setShowAddRoomModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <i className="fas fa-plus mr-2" />
            Add Room
          </button>

          <Button onClick={handleCompletionStatus} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
            <i className="fa-solid fa-circle-check mr-2"></i>
            Mark as Complete
          </Button>
        </div>
      </div>

      <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
          <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
          <span>Stage Timings</span>
        </div>
        {/* Keep content within this component, it will now handle horizontal layout */}
        <StageTimerInfo
          completedAt={sampleDesign.timer.compltedAt}
          formId={(sampleDesign as any)._id}
          deadLine={sampleDesign.timer.deadLine}
          startedAt={sampleDesign.timer.startedAt}
          refetchStageMutate={refetch}
          deadLineMutate={deadLineAsync}
          isPending={deadLinePending}
        />
      </Card>


      {(!sampleDesign?.rooms || sampleDesign.rooms.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <i className="fas fa-home text-blue-200 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Rooms Added Yet</h2>
          <p className="text-gray-500 mb-4">Start by adding a room to upload design files</p>
          <button
            onClick={() => setShowAddRoomModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <i className="fas fa-plus mr-2" />
            Add Your First Room
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sampleDesign.rooms.map((room: any) => (
            <div key={room.roomName} className="bg-white border-l-4 border-blue-600 rounded-xl shadow-sm p-6">
             
              <div className="w-full flex items-center justify-between ">
                <h2 className="text-2xl font-semibold text-blue-700">
                  <i className="fas fa-door-open mr-2" />
                  {room.roomName}
                </h2>

                <Button onClick={() => handleDeleteRoom(room._id)} variant="danger" className="bg-red-600 text-white w-full sm:w-auto">
                  <i className="fa-solid fa-trash mr-2"></i>
                  delete
                </Button>
              </div>
              
              <FileUploadSection
                roomName={room.roomName}
                files={room.files}
                onUpload={(files: any) => handleFileUpload(room.roomName, files)}
                onDelete={(index: number) => handleFileDelete(room.roomName, index)}
              />
            </div>
          ))}
        </div>
      )}

      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onSubmit={handleAddRoom}
      />



    </div>
  );
};

export default SampleDesignModule;
