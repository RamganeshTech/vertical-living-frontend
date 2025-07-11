// WorkSchedulePage.tsx
import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetWorkSchedule, useAddWorkPlan, useUpdateWorkPlan, useDeleteWorkPlan, useGetProjectWorkers, useUpdateWorkScheduleStatus } from "../../../apiList/Stage Api/workScheduleApi";
import type { AddWorkPlanPayload } from "../../../types/types";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

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

  const { data: workSchedule, isLoading, refetch, error } = useGetWorkSchedule(projectId);
  const { data: workers } = useGetProjectWorkers(projectId);

  // console.log(workers)
  const { mutateAsync: updateWorkStatus, isPending: updateStatusPending } = useUpdateWorkScheduleStatus()
  const addPlan = useAddWorkPlan();
  const updatePlan = useUpdateWorkPlan();
  const deletePlan = useDeleteWorkPlan();

  const [newPlan, setNewPlan] = useState<WorkPlanItem | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<WorkPlanItem | null>(null);

  const [workStatus, setWorkStatus] = useState<"pending" | "completed">("pending");
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);

  if (isLoading) return <RoomDetailsLoading />

  if (error) {
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

  const handleAdd = () => {
    setNewPlan({
      workType: "",
      startDate: "",
      endDate: "",
      assignedTo: "",
      notes: "",
    });
  };

const handleStartEditStatus = () => setIsEditingStatus(true);

  const handleUpdateWorkStatus = async () => {
    try {
      if (!projectId || !workSchedule?._id) throw new Error("Invalid project or schedule ID");
      await updateWorkStatus({
        projectId: projectId,
        workScheduleId: workSchedule._id,
        payload: { status: workStatus },
      });

      toast({
        title: "Success",
        description: "Work Schedule status updated successfully.",
      });
      setIsEditingStatus(false)
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNew = async () => {
    try {
      if (!newPlan) return;

      if (!newPlan.workType?.trim()) {
        throw new Error("work field is mandatory")
      }
      await addPlan.mutateAsync({
        workScheduleId: workScheduleId,
        formData: newPlan,
        projectId,
      });
      setNewPlan(null);
      toast({ title: "Success", description: "Item Saved" });
      refetch()

    }
    catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to add" });
    }
  }


  const handleSaveEdit = async () => {
    try {
      if (!editPlan || !editId) return;

      if (!editPlan.workType?.trim()) {
        throw new Error("work field is mandatory")
      }

      await updatePlan.mutateAsync({
        workScheduleId: workSchedule._id,
        planId: editId,
        formData: editPlan,
        projectId,
      });
      setEditId(null);
      setEditPlan(null);
      toast({ title: "Success", description: "Item Saved" });
      refetch()
    }
    catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      await deletePlan.mutateAsync({
        workScheduleId: workSchedule._id,
        planId,
        projectId,
      });
      toast({ title: "Success", description: "Item deleted" });
      refetch()

    }
    catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
    }
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
    <div className="w-full h-full overflow-y-auto">
      <div className="flex justify-between w-full items-center">

        <h2 className="text-2xl font-bold text-blue-800 mb-6 px-4">📋 Work Plans</h2>
        <div className="flex gap-2">

          <div className="flex gap-2">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Status:</span>

              {isEditingStatus ? (
                <>
                  <Select
                    value={workStatus}
                    onValueChange={(val) => setWorkStatus(val as "pending" | "completed")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" selectedValue={workStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      {["pending", "completed"].map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="primary"
                    disabled={updateStatusPending}
                    onClick={handleUpdateWorkStatus}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${workSchedule?.status === "completed"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {workSchedule?.status}
                  </span>

                  <Button size="sm" onClick={handleStartEditStatus}>
                    <i className="fas fa-pencil"></i>
                  </Button>
                </>
              )}
            </div>

          </div>

          <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/workmainschedule`)}>
            Go Back
          </Button>

        </div>
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
                  className="grid grid-cols-7 gap-3 px-4 py-3 border-b border-[#5557584a] items-center bg-white hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-gray-700 text-center">{idx + 1}</div>

                  {editId === plan._id ? (
                    <>
                      <input
                        className="border-b px-2 py-1 text-sm"
                        value={editPlan?.workType}
                        onChange={(e) => setEditPlan({ ...editPlan!, workType: e.target.value })}
                      />
                      <input
                        type="date"
                        className="border-b px-2 py-1 text-sm"
                        value={editPlan?.startDate}
                        onChange={(e) => setEditPlan({ ...editPlan!, startDate: e.target.value })}
                      />
                      <input
                        type="date"
                        className="border-b px-2 py-1 text-sm"
                        value={editPlan?.endDate}
                        onChange={(e) => setEditPlan({ ...editPlan!, endDate: e.target.value })}
                      />
                      <select
                        className="border-b px-2 py-1 text-sm"
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
                        className="border-b px-2 py-1 text-sm"
                        value={editPlan?.notes}
                        onChange={(e) => setEditPlan({ ...editPlan!, notes: e.target.value })}
                      />
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="primary"
                          isLoading={updatePlan.isPending}
                          onClick={handleSaveEdit}
                        // className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Save
                        </Button>
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
                      <div className="text-gray-700 text-center">{plan.workType || "N/A"}</div>
                      <div className="text-gray-700 text-center">{plan.startDate || "N/A"}</div>
                      <div className="text-gray-700 text-center">{plan.endDate || "N/A"}</div>
                      <div className="text-gray-700 text-center">

                        {workers?.find((w: { _id: string, workerName: string, email: string }) => w._id === (plan.assignedTo as any)?._id)?.workerName || "Not Assigned"}

                      </div>
                      <div className="text-gray-700 text-center">{plan.notes || "N/A"}</div>
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
                        <Button
                          isLoading={deletePlan.isPending}
                          onClick={() => handleDelete(plan._id!)}
                          // className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <i className="fas fa-trash" />
                        </Button>
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
                  className="border-b px-2 py-1 text-sm"
                  placeholder="Work Type"
                  value={newPlan.workType}
                  onChange={(e) => setNewPlan({ ...newPlan, workType: e.target.value })}
                />
                <input
                  type="date"
                  className="border-b px-2 py-1 text-sm"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="border-b px-2 py-1 text-sm"
                  value={newPlan.endDate}
                  onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                />
                <select
                  className="border-b px-2 py-1 text-sm"
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
                  className="border-b px-2 py-1 text-sm"
                  placeholder="Notes"
                  value={newPlan.notes}
                  onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                />
                <div className="flex justify-center gap-2">
                  <Button
                    variant="primary"
                    isLoading={addPlan.isPending}

                    onClick={handleSaveNew}
                  // className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"

                    onClick={() => setNewPlan(null)}
                  // className="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!newPlan && workSchedule?.plans?.length > 0 && (
            <div className="mt-5 text-left">
              <Button
                size="sm"
                variant="primary"
                onClick={handleAdd}
              // className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <i className="fas fa-plus mr-1" />
                Add Work
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>

  );

};

export default WorkSchedulePage;
