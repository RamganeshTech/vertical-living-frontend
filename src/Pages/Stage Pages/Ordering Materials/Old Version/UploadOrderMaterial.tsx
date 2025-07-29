import React, { useState } from "react";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { useDeleteOrderMaterialFile, useUploadOrderMaterialFiles } from "../../../../apiList/Stage Api/orderingMaterialApi";

interface UploadFile {
  _id: string;
  type: "image" | "pdf";
  url: string;
  originalName: string;
}

interface Props {
  projectId: string;
  roomId: string;
  initialFiles: UploadFile[];
}

const UploadOrderMaterial: React.FC<Props> = ({ projectId, roomId, initialFiles }) => {

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfFiles, setPdfFiles] = useState<UploadFile[]>(initialFiles.filter(f => f.type === "pdf"));
  const [imageFiles, setImageFiles] = useState<UploadFile[]>(initialFiles.filter(f => f.type === "image"));

  const { mutateAsync: uploadFiles, isPending: uploadPending } = useUploadOrderMaterialFiles();
  const { mutateAsync: deleteFile, isPending: deletePending } = useDeleteOrderMaterialFile();


//   initialFiles=existingUploads

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("files", file));

    try {
      const uploaded = await uploadFiles({ projectId, roomId, formData });
      const newPDFs = uploaded.filter((file: UploadFile) => file.type === "pdf");
      const newImages = uploaded.filter((file: UploadFile) => file.type === "image");

      setPdfFiles(prev => [...prev, ...newPDFs]);
      setImageFiles(prev => [...prev, ...newImages]);
      setSelectedFiles([]);
    } catch (err) {
    }
  };

  const handleDelete = async (fileId: string, type: "image" | "pdf") => {
    try {
      await deleteFile({ projectId, roomId, fileId });
      if (type === "pdf") {
        setPdfFiles(prev => prev.filter(file => file._id !== fileId));
      } else {
        setImageFiles(prev => prev.filter(file => file._id !== fileId));
      }
    } catch (err) {
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-700">Uploads</h3>

      <div className="flex gap-4 items-center">
        <Input type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf" />
        <Button onClick={handleUpload} isLoading={uploadPending} className="bg-blue-600 text-white">
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* PDFs */}
        <div>
          <h4 className="font-semibold text-red-700 mb-2">📄 PDF Files</h4>
          <ul className="space-y-2">
            {pdfFiles.map(file => (
              <li key={file._id} className="flex justify-between items-center bg-red-50 p-2 rounded-xl">
                <span className="text-sm">{file.originalName}</span>
                <div className="flex gap-2">
                  <a href={file.url} target="_blank" download className="text-red-600 hover:underline">
                    <i className="fa-solid fa-download"></i>
                  </a>
                  <Button
                    onClick={() => handleDelete(file._id, "pdf")}
                    disabled={deletePending}
                    variant="ghost"
                    className="text-red-500"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </div>
              </li>
            ))}
            {pdfFiles.length === 0 && <p className="text-sm text-gray-500">No PDFs uploaded.</p>}
          </ul>
        </div>

        {/* Images */}
        <div>
          <h4 className="font-semibold text-green-700 mb-2">🖼️ Image Files</h4>
          <ul className="space-y-2 max-h-[180px] overflow-y-auto">
            {imageFiles.map(file => (
              <li key={file._id} className="flex justify-between items-center bg-green-50 p-2 rounded-xl">
                <span className="text-sm truncate">{file.originalName}</span>
                <div className="flex gap-2">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    <i className="fa-solid fa-eye"></i>
                  </a>
                  <a href={file.url} target="_blank" download className="text-green-600 hover:underline">
                    <i className="fa-solid fa-download"></i>
                  </a>
                  <Button
                    onClick={() => handleDelete(file._id, "image")}
                    disabled={deletePending}
                    variant="ghost"
                    className="text-green-600"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </div>
              </li>
            ))}
            {imageFiles.length === 0 && <p className="text-sm text-gray-500">No images uploaded.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadOrderMaterial;
