import { useParams } from "react-router-dom";
import { WORKER_WALL_PAINTING_STEPS } from "../../../constants/constants";
import { useState } from "react";
import { useGetWorkerStepDetails,
useUploadWorkerInitialFiles,
useUploadWorkerCorrectionFiles, } from "../../../apiList/WallPainting Api/workerWallPaintingApi";

export default function WorkerWallStepPage() {
  const { projectId, stepNumber } = useParams<{ projectId: string; stepNumber: string }>();

  const [initialFiles, setInitialFiles] = useState<FileList | null>(null);
  const [correctionFiles, setCorrectionFiles] = useState<FileList | null>(null);

  const { data: stepData, isLoading } = useGetWorkerStepDetails(projectId!, stepNumber!);

  const { mutate: uploadInitial } = useUploadWorkerInitialFiles();
  const { mutate: uploadCorrection } = useUploadWorkerCorrectionFiles();

  const step = WORKER_WALL_PAINTING_STEPS.find(
    (s) => s.stepNumber === Number(stepNumber)
  );

  if (isLoading) return <div>Loading step...</div>;
  if (!step) return <div>Step not found</div>;

  const handleInitialUpload = () => {
    if (!initialFiles || initialFiles.length === 0) {
      alert("Please select files for initial upload.");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < initialFiles.length; i++) {
      formData.append("files", initialFiles[i]);
    }
    uploadInitial({
      projectId: projectId!,
      stepId: stepData?.step?._id!,
      formData,
    });
  };

  const handleCorrectionUpload = () => {
    if (!correctionFiles || correctionFiles.length === 0) {
      alert("Please select files for correction upload.");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < correctionFiles.length; i++) {
      formData.append("files", correctionFiles[i]);
    }
    uploadCorrection({
      projectId: projectId!,
      stepId: stepData?.step?._id!,
      formData,
    });
  };

  return (
    <div className="p-4 border mt-4">
      <h3 className="text-lg font-bold mb-2">{step.label}</h3>

      <ul className="mb-4">
        {step.rules.map((rule, idx) => (
          <li key={idx}>✅ {rule}</li>
        ))}
      </ul>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Your Initial Uploads</h4>
        {stepData?.step?.initialUploads?.length ? (
          <div className="flex flex-wrap gap-4">
            {stepData.step.initialUploads.map((file: any, idx: number) => (
              <img key={idx} src={file.url} alt="Initial Upload" className="w-32 h-32 object-cover border" />
            ))}
          </div>
        ) : (
          <p>No initial uploads yet.</p>
        )}

        <label className="block mt-4 mb-2">Upload Initial Files:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setInitialFiles(e.target.files)}
        />
        <button
          onClick={handleInitialUpload}
          className="mt-2 px-4 py-2 bg-blue-600 text-white"
        >
          Upload Initial Files
        </button>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Correction Rounds</h4>
        {stepData?.step?.correctionRounds?.length ? (
          stepData.step.correctionRounds.map((round: any) => (
            <div key={round.roundNumber} className="border p-3 mb-4">
              <p className="font-bold">Round {round.roundNumber}</p>
              <p className="text-sm mb-2">Admin Note: {round.adminNote}</p>
              <div className="flex flex-wrap gap-4 mb-2">
                {round.adminUploads.map((file: any, idx: number) => (
                  <img
                    key={idx}
                    src={file.url}
                    alt="Admin Upload"
                    className="w-32 h-32 object-cover border"
                  />
                ))}
              </div>

              {round.workerCorrectedUploads?.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold">Your Correction Uploads:</p>
                  <div className="flex flex-wrap gap-4">
                    {round.workerCorrectedUploads.map((file: any, idx: number) => (
                      <img
                        key={idx}
                        src={file.url}
                        alt="Worker Correction"
                        className="w-32 h-32 object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No corrections requested yet.</p>
        )}

        {stepData?.step?.correctionRounds?.length ? (
          <div>
            <label className="block mt-4 mb-2">Upload Correction Files:</label>
            <input
              type="file"
              multiple
              onChange={(e) => setCorrectionFiles(e.target.files)}
            />
            <button
              onClick={handleCorrectionUpload}
              className="mt-2 px-4 py-2 bg-blue-600 text-white"
            >
              Upload Correction Files
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}




// bleow is for shing the correction orunds later on chekc it


// <div className="mt-6">
//   <h4 className="font-bold mb-2">Correction Rounds:</h4>
//   {stepData?.step?.correctionRounds?.length ? (
//     stepData.step.correctionRounds.map((round: any, idx: number) => (
//       <div key={idx} className="border p-4 mb-4">
//         <h5 className="font-semibold mb-2">Round {round.roundNumber}</h5>
//         <p className="mb-2">Admin Note: {round.adminNote}</p>

//         <div className="mb-2">
//           <h6 className="font-semibold">Admin Uploads:</h6>
//           {round.adminUploads?.length ? (
//             <div className="grid grid-cols-3 gap-4">
//               {round.adminUploads.map((file: any, i: number) => (
//                 <div key={i} className="border p-2">
//                   {file.type === "image" ? (
//                     <img src={file.url} alt={file.originalName} className="w-full" />
//                   ) : (
//                     <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                       {file.originalName}
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No admin uploads.</p>
//           )}
//         </div>

//         <div>
//           <h6 className="font-semibold">Worker Corrected Uploads:</h6>
//           {round.workerCorrectedUploads?.length ? (
//             <div className="grid grid-cols-3 gap-4">
//               {round.workerCorrectedUploads.map((file: any, i: number) => (
//                 <div key={i} className="border p-2">
//                   {file.type === "image" ? (
//                     <img src={file.url} alt={file.originalName} className="w-full" />
//                   ) : (
//                     <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                       {file.originalName}
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No corrected uploads from worker yet.</p>
//           )}
//         </div>
//       </div>
//     ))
//   ) : (
//     <p>No correction rounds yet.</p>
//   )}
// </div>
