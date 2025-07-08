// WorkSchedulePage.tsx
import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetWorkSchedule, useAddWorkPlan, useUpdateWorkPlan, useDeleteWorkPlan, useGetProjectWorkers } from "../../../apiList/Stage Api/workScheduleApi";
import type { AddWorkPlanPayload } from "../../../types/types";
import { Button } from "../../../components/ui/Button";

interface WorkPlanItem {
  _id?: string;
  workType: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
  notes: string;
}

const WorkSchedulePage: FC = () => {
  const { sectionId: workScheduleId, projectId, organizationId } = useParams<{ sectionId: string; projectId: string, organizationId: string }>();
  const navigate = useNavigate()

  if (!projectId) return;

  const { data: workSchedule, isLoading } = useGetWorkSchedule(projectId);
  const { data: workers } = useGetProjectWorkers(projectId);

  console.log(workers)
  const addPlan = useAddWorkPlan();
  const updatePlan = useUpdateWorkPlan();
  const deletePlan = useDeleteWorkPlan();

  const [newPlan, setNewPlan] = useState<WorkPlanItem | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<WorkPlanItem | null>(null);

  if (isLoading) return <div className="p-4">Loading...</div>;

  const handleAdd = () => {
    setNewPlan({
      workType: "",
      startDate: "",
      endDate: "",
      assignedTo: "",
      notes: "",
    });
  };

  const handleSaveNew = async () => {
    if (!newPlan) return;
    await addPlan.mutateAsync({
      workScheduleId: workScheduleId,
      formData: newPlan,
      projectId,
    });
    setNewPlan(null);
  };

  const handleSaveEdit = async () => {
    if (!editPlan || !editId) return;
    await updatePlan.mutateAsync({
      workScheduleId: workSchedule._id,
      planId: editId,
      formData: editPlan,
      projectId,
    });
    setEditId(null);
    setEditPlan(null);
  };

  const handleDelete = async (planId: string) => {
    await deletePlan.mutateAsync({
      workScheduleId: workSchedule._id,
      planId,
      projectId,
    });
  };


  { console.log("workSchedule?.plans?.length", workSchedule?.plans) }


  const workSchedules = {
    _id: "6655c2ef1345abcf22ee1200",
    projectId: "PROJECT123",
    plans: [
      {
        _id: "plan1",
        workType: "Electrical Wiring",
        startDate: "2025-07-01",
        endDate: "2025-07-05",
        assignedTo: "worker123",
        upload: {
          type: "pdf",
          url: "https://example.com/wiring-plan.pdf",
          originalName: "WiringPlan.pdf",
          uploadedAt: new Date(),
        },
        notes: "Check conduit layout before final fix."
      },
      {
        _id: "plan2",
        workType: "Plumbing",
        startDate: "2025-07-06",
        endDate: "2025-07-10",
        assignedTo: "worker456",
        upload: {
          type: "image",
          url: "https://example.com/plumbing-diagram.jpg",
          originalName: "PlumbingDiagram.jpg",
          uploadedAt: new Date(),
        },
        notes: "Install pipelines for kitchen & bathrooms."
      },
      {
        _id: "plan3",
        workType: "Interior Painting",
        startDate: "2025-07-11",
        endDate: "2025-07-15",
        assignedTo: "worker789",
        upload: null, // This plan has no upload attached.
        notes: "Use low-VOC paint for bedrooms."
      },
      {
        _id: "plan1",
        workType: "Electrical Wiring",
        startDate: "2025-07-01",
        endDate: "2025-07-05",
        assignedTo: "worker123",
        upload: {
          type: "pdf",
          url: "https://example.com/wiring-plan.pdf",
          originalName: "WiringPlan.pdf",
          uploadedAt: new Date(),
        },
        notes: "Check conduit layout before final fix."
      },
      {
        _id: "plan2",
        workType: "Plumbing",
        startDate: "2025-07-06",
        endDate: "2025-07-10",
        assignedTo: "worker456",
        upload: {
          type: "image",
          url: "https://example.com/plumbing-diagram.jpg",
          originalName: "PlumbingDiagram.jpg",
          uploadedAt: new Date(),
        },
        notes: "Install pipelines for kitchen & bathrooms."
      },
      {
        _id: "plan3",
        workType: "Interior Painting",
        startDate: "2025-07-11",
        endDate: "2025-07-15",
        assignedTo: "worker789",
        upload: null, // This plan has no upload attached.
        notes: "Use low-VOC paint for bedrooms."
      },
      {
        _id: "plan1",
        workType: "Electrical Wiring",
        startDate: "2025-07-01",
        endDate: "2025-07-05",
        assignedTo: "worker123",
        upload: {
          type: "pdf",
          url: "https://example.com/wiring-plan.pdf",
          originalName: "WiringPlan.pdf",
          uploadedAt: new Date(),
        },
        notes: "Check conduit layout before final fix."
      },
      {
        _id: "plan2",
        workType: "Plumbing",
        startDate: "2025-07-06",
        endDate: "2025-07-10",
        assignedTo: "worker456",
        upload: {
          type: "image",
          url: "https://example.com/plumbing-diagram.jpg",
          originalName: "PlumbingDiagram.jpg",
          uploadedAt: new Date(),
        },
        notes: "Install pipelines for kitchen & bathrooms."
      },
      {
        _id: "plan3",
        workType: "Interior Painting",
        startDate: "2025-07-11",
        endDate: "2025-07-15",
        assignedTo: "worker789",
        upload: null, // This plan has no upload attached.
        notes: "Use low-VOC paint for bedrooms."
      }
    ]
  };


  return (
    // <div className="w-full h-full overflow-y-auto">
    //   <h2 className="text-2xl font-bold text-blue-800 mb-6">📋 Work Plans</h2>

    //   {/* Grid Heading (table head) */}
    //   <div className="grid grid-cols-7 gap-3 px-4 py-3 bg-blue-100 text-sm font-semibold text-blue-900 rounded-t-lg shadow-md">
    //     <div className="text-center">S.No</div>
    //     <div className="text-center">Work Type</div>
    //     <div className="text-center">Start Date</div>
    //     <div className="text-center">End Date</div>
    //     <div className="text-center">Assigned To</div>
    //     <div className="text-center">Notes</div>
    //     <div className="text-center">Actions</div>
    //   </div>

    //   <div className="flex flex-col divide-y">
    //     {workSchedule?.plans?.length > 0 ? (
    //       workSchedule.plans.map((plan: WorkPlanItem, idx: number) => (
    //         <div
    //           key={plan._id}
    //           className="grid grid-cols-7 gap-3 px-4 py-3 border-b border-gray-300 items-center bg-white hover:bg-blue-50 transition rounded"
    //         >
    //           {/* Read/Write mode */}
    //           <div className="font-medium text-gray-700 text-center">{idx + 1}</div>

    //           {editId === plan._id ? (
    //             <>
    //               <input
    //                 className="border rounded px-2 py-1 text-sm"
    //                 value={editPlan?.workType}
    //                 onChange={(e) =>
    //                   setEditPlan({ ...editPlan!, workType: e.target.value })
    //                 }
    //               />
    //               <input
    //                 type="date"
    //                 className="border rounded px-2 py-1 text-sm"
    //                 value={editPlan?.startDate}
    //                 onChange={(e) =>
    //                   setEditPlan({ ...editPlan!, startDate: e.target.value })
    //                 }
    //               />
    //               <input
    //                 type="date"
    //                 className="border rounded px-2 py-1 text-sm"
    //                 value={editPlan?.endDate}
    //                 onChange={(e) =>
    //                   setEditPlan({ ...editPlan!, endDate: e.target.value })
    //                 }
    //               />
    //               <select
    //                 className="border rounded px-2 py-1 text-sm"
    //                 value={editPlan?.assignedTo}
    //                 onChange={(e) =>
    //                   setEditPlan({ ...editPlan!, assignedTo: e.target.value })
    //                 }
    //               >
    //                 <option value="">Select</option>
    //                 {workers?.map((w: {_id:string, workerName:string, email:string}) => (
    //                   <option key={w._id} value={w._id}>
    //                     {w.workerName}
    //                   </option>
    //                 ))}
    //               </select>
    //               <input
    //                 className="border rounded px-2 py-1 text-sm"
    //                 value={editPlan?.notes}
    //                 onChange={(e) =>
    //                   setEditPlan({ ...editPlan!, notes: e.target.value })
    //                 }
    //               />

    //               {/* Actions */}
    //               <div className="flex justify-center gap-2">
    //                 <button
    //                   onClick={handleSaveEdit}
    //                   className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
    //                 >
    //                   Save
    //                 </button>
    //                 <button
    //                   onClick={() => {
    //                     setEditId(null);
    //                     setEditPlan(null);
    //                   }}
    //                   className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
    //                 >
    //                   Cancel
    //                 </button>
    //               </div>
    //             </>
    //           ) : (
    //             <>
    //               <div className="text-gray-700 text-center ">{plan.workType}</div>
    //               <div className="text-gray-700 text-center">{plan.startDate}</div>
    //               <div className="text-gray-700 text-center">{plan.endDate}</div>
    //               <div className="text-gray-700 text-center">
    //                 {workers?.find((w: {_id:string, workerName:string, email:string}) => w._id === (plan.assignedTo as any)._id)?.workerName || "-"}
    //               </div>
    //               <div className="text-gray-700 text-center">{plan.notes}</div>
    //               <div className="flex justify-center gap-3 text-sm text-center">
    //                 <button
    //                   onClick={() => {
    //                     setEditId(plan._id!);
    //                     setEditPlan(plan);
    //                   }}
    //                   className="text-blue-600 hover:text-blue-800"
    //                   title="Edit"
    //                 >
    //                   <i className="fas fa-pen" />
    //                 </button>
    //                 <button
    //                   onClick={() => handleDelete(plan._id!)}
    //                   className="text-red-500 hover:text-red-700"
    //                   title="Delete"
    //                 >
    //                   <i className="fas fa-trash" />
    //                 </button>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       ))
    //     ) : (
    //       // Empty state
    //       <>
    //         {!newPlan && (
    //           <div className="mt-6 text-center border border-blue-100 p-8 rounded-lg bg-blue-50">
    //             <p className="text-blue-600 text-sm">No work plans created yet.</p>
    //             <button
    //               onClick={handleAdd}
    //               className="mt-3 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //             >
    //               <i className="fas fa-plus mr-1"></i> Add Work Plan
    //             </button>
    //           </div>
    //         )}
    //       </>
    //     )}

    //     {/* New Row Input */}
    //     {newPlan && (
    //       <div className="grid grid-cols-7 gap-3 px-4 py-3 items-center bg-white ">
    //         <div className="text-center font-medium text-gray-700">
    //           {!workSchedule?.plans?.length ? 1 : workSchedule.plans.length + 1}
    //         </div>
    //         <input
    //           className="border rounded px-2 py-1"
    //           placeholder="Work Type"
    //           value={newPlan.workType}
    //           onChange={(e) =>
    //             setNewPlan({ ...newPlan, workType: e.target.value })
    //           }
    //         />
    //         <input
    //           type="date"
    //           className="border rounded px-2 py-1"
    //           value={newPlan.startDate}
    //           onChange={(e) =>
    //             setNewPlan({ ...newPlan, startDate: e.target.value })
    //           }
    //         />
    //         <input
    //           type="date"
    //           className="border rounded px-2 py-1"
    //           value={newPlan.endDate}
    //           onChange={(e) =>
    //             setNewPlan({ ...newPlan, endDate: e.target.value })
    //           }
    //         />
    //         <select
    //           className="border rounded px-2 py-1"
    //           value={newPlan.assignedTo}
    //           onChange={(e) =>
    //             setNewPlan({ ...newPlan, assignedTo: e.target.value })
    //           }
    //         >
    //           <option value="">Select</option>
    //           {workers?.map((w: {_id:string, workerName:string, email:string}) => (
    //             <option key={w._id} value={w._id}>
    //               {w.workerName}
    //             </option>
    //           ))}
    //         </select>
    //         <input
    //           className="border rounded px-2 py-1"
    //           placeholder="Notes"
    //           value={newPlan.notes}
    //           onChange={(e) =>
    //             setNewPlan({ ...newPlan, notes: e.target.value })
    //           }
    //         />
    //         <div className="flex justify-center gap-2">
    //           <button
    //             onClick={handleSaveNew}
    //             className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
    //           >
    //             Save
    //           </button>
    //           <button
    //             onClick={() => setNewPlan(null)}
    //             className="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {/* Bottom CTA */}
    //   {!newPlan && workSchedule?.plans?.length > 0 && (
    //     <div className="mt-6 text-center">
    //       <button
    //         onClick={handleAdd}
    //         className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //       >
    //         <i className="fas fa-plus mr-1" />
    //         Add Work Plan
    //       </button>
    //     </div>
    //   )}
    // </div>


    <div className="w-full h-full overflow-y-auto">
      <div className="flex justify-between w-full items-center">

        <h2 className="text-2xl font-bold text-blue-800 mb-6 px-4">📋 Work Plans</h2>
        <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/workmainschedule`)}>
          Go Back
        </Button>

      </div>



      {/* Scrollable Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[1024px]">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-3 px-4 py-3 bg-blue-100 text-sm font-semibold text-blue-900 rounded-t-lg shadow-md">
            <div className="text-center">S.No</div>
            <div className="text-center">Work Type</div>
            <div className="text-center">Start Date</div>
            <div className="text-center">End Date</div>
            <div className="text-center">Assigned To</div>
            <div className="text-center">Notes</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col divide-y">
            {workSchedule?.plans?.length > 0 ? (
              workSchedule.plans.map((plan: WorkPlanItem, idx: number) => (
                <div
                  key={plan._id}
                  className="grid grid-cols-7 gap-3 px-4 py-3 border-b items-center bg-white hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-gray-700 text-center">{idx + 1}</div>

                  {editId === plan._id ? (
                    <>
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={editPlan?.workType}
                        onChange={(e) => setEditPlan({ ...editPlan!, workType: e.target.value })}
                      />
                      <input
                        type="date"
                        className="border rounded px-2 py-1 text-sm"
                        value={editPlan?.startDate}
                        onChange={(e) => setEditPlan({ ...editPlan!, startDate: e.target.value })}
                      />
                      <input
                        type="date"
                        className="border rounded px-2 py-1 text-sm"
                        value={editPlan?.endDate}
                        onChange={(e) => setEditPlan({ ...editPlan!, endDate: e.target.value })}
                      />
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={editPlan?.assignedTo}
                        onChange={(e) => setEditPlan({ ...editPlan!, assignedTo: e.target.value })}
                      >
                        <option value="">Select</option>
                        {workers?.map((w: { _id: string, workerName: string, email: string }) => (
                          <option key={w?._id} value={w?._id}>
                            {w.workerName}
                          </option>
                        ))}
                      </select>
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={editPlan?.notes}
                        onChange={(e) => setEditPlan({ ...editPlan!, notes: e.target.value })}
                      />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditPlan(null);
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-700 text-center">{plan.workType}</div>
                      <div className="text-gray-700 text-center">{plan.startDate}</div>
                      <div className="text-gray-700 text-center">{plan.endDate}</div>
                      <div className="text-gray-700 text-center">

                        {workers?.find((w: { _id: string, workerName: string, email: string }) => w._id === (plan.assignedTo as any)?._id)?.workerName || "-"}

                      </div>
                      <div className="text-gray-700 text-center">{plan.notes}</div>
                      <div className="flex justify-center gap-3 text-sm">
                        <button
                          onClick={() => {
                            setEditId(plan._id!);
                            setEditPlan(plan);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <i className="fas fa-pen" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id!)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              !newPlan && (
                <div className="mt-6 text-center border border-blue-100 p-8 rounded-lg bg-blue-50">
                  <p className="text-blue-600 text-sm">No work plans created yet.</p>
                  <button
                    onClick={handleAdd}
                    className="mt-3 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <i className="fas fa-plus mr-1"></i> Add Work Plan
                  </button>
                </div>
              )
            )}

            {/* New Row */}
            {newPlan && (
              <div className="grid grid-cols-7 gap-3 px-4 py-3 items-center bg-white">
                <div className="text-center font-medium text-gray-700">
                  {workSchedule?.plans?.length ? workSchedule.plans.length + 1 : 1}
                </div>
                <input
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Work Type"
                  value={newPlan.workType}
                  onChange={(e) => setNewPlan({ ...newPlan, workType: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={newPlan.endDate}
                  onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                />
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={newPlan.assignedTo}
                  onChange={(e) => setNewPlan({ ...newPlan, assignedTo: e.target.value })}
                >
                  <option value="">Select</option>
                  {workers?.map((w: { _id: string, workerName: string, email: string }) => (
                    <option key={w._id} value={w._id}>
                      {w.workerName}
                    </option>
                  ))}
                </select>
                <input
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Notes"
                  value={newPlan.notes}
                  onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleSaveNew}
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setNewPlan(null)}
                    className="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {!newPlan && workSchedule?.plans?.length > 0 && (
            <div className="mt-5 text-center">
              <button
                onClick={handleAdd}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <i className="fas fa-plus mr-1" />
                Add Work Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  );

};

export default WorkSchedulePage;
