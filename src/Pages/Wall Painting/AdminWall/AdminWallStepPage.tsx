import { useParams } from "react-router-dom";
import { ADMIN_WALL_PAINTING_STEPS } from "../../../constants/constants"; 

import { useState } from "react";
import { useApproveAdminStep, useGetAdminSOP, useGetAdminStepDetails, useUploadAdminCorrectionRound } from "../../../apiList/WallPainting Api/adminWallPaintingApi";

export default function AdminWallStepPage() {
  const { projectId, stepId, stepNumber } = useParams<{ projectId: string; stepNumber: string, stepId: string }>();

  const [note, setNote] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);

  const { mutate: approveStep } = useApproveAdminStep();

  const { mutate: uploadCorrection } = useUploadAdminCorrectionRound();  
  const { data: stepData, isLoading } = useGetAdminStepDetails(projectId!, stepId!);


    const step = ADMIN_WALL_PAINTING_STEPS.find(
    (s) => s.stepNumber === Number(stepNumber)
  );


    const handleSubmit = () => {
    if ((!files || files?.length === 0) || !note) {
      alert("Please select files or write something in notes");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("adminNote", note);

    uploadCorrection({
      projectId:projectId!,
      stepNumber:stepNumber!,
      formData,
    });
  };

  if (!step) return <div>Step not found</div>;
if (isLoading) return <div>Loading step...</div>;

console.log("stepdata form admin",stepData)
  return (
    <div className="p-4 border mt-4">
      <h3 className="text-lg font-bold mb-2">{step.label}</h3>
      <ul className="mb-4">
        {step.rules.map((rule, idx) => (
          <li key={idx}>✅ {rule}</li>
        ))}
      </ul>


{/* dislayt ehworker uploads */}
      <div className="mt-6">
  <h4 className="font-bold mb-2">Worker Initial Uploads:</h4>
  {stepData?.step?.workerInitialUploads?.length ? (
    <div className="grid grid-cols-3 gap-4">
      {stepData?.step?.workerInitialUploads?.map((file: any, idx: number) => {
        console.log(file)
        return (
        <div key={idx} className="border p-2">
          {file.type === "image" ? (
            <img src={file?.url} alt={file?.originalName} className="w-full" />
          ) : (
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {file.originalName}
            </a>
          )}
        </div>
      )
})}
    </div>
  ) : (
    <p>No initial uploads found.</p>
  )}
</div>


      <div>
        <button
          onClick={() =>
            approveStep({
              projectId: projectId!,
              stepId:stepId!,
              payload:{status: "approved"}
            })
          }
          className="px-4 py-2 bg-green-600 text-white mr-2"
        >
          Approve
        </button>
        <button
          onClick={() =>
            approveStep({
              projectId: projectId!,
              stepId: stepId!,
              payload:{status: "approved"}
            })
          }
          className="px-4 py-2 bg-red-600 text-white"
        >
          Reject
        </button>
      </div>

      <div className="mt-4">
        <label className="block mb-2">Add Correction Note</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border w-full p-2"
        ></textarea>

        <label className="block mb-2">Correction Images:</label>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white"
      >
        Submit Correction
      </button>
      </div>
    </div>
  );
}
