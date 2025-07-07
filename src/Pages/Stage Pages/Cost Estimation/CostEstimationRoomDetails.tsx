// components/CostEstimation/MaterialRoomDetails.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import EmptyState from "../../../components/ui/EmptyState";
import { useGetSingleRoomEstimation, useUpdateMaterialEstimationItem } from "../../../apiList/Stage Api/costEstimationApi";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import CostEstimateUpload from "./CostEstimateUpload";

export default function CostEstimationRoomDetails() {
  const { projectId, roomId } = useParams();
  const navigate = useNavigate();

  if (!projectId || !roomId) return null;

  const { data: room, isLoading, refetch } = useGetSingleRoomEstimation(projectId, roomId);
  const { mutateAsync: updateMaterialItem, isPending: updatePending } = useUpdateMaterialEstimationItem();


  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    areaSqFt: 0,
    predefinedRate: 0,
    overriddenRate: null as number | null,
  });

  if (isLoading) return <RoomDetailsLoading />;
  if (!room) return <EmptyState message="Room not found" color="primary" customIconClass="box" icon="custom" />;

  const handleEdit = (key: string, field: any) => {
    setEditingKey(key);
    setFormData({
      areaSqFt: field.areaSqFt || 0,
      predefinedRate: field.predefinedRate || 0,
      overriddenRate: field.overriddenRate ?? null,
    });
  };

  const handleSave = async (key: string) => {
    try {
      await updateMaterialItem({ projectId: projectId!, materialKey: key, updates: formData });
      setEditingKey(null);
      toast({ description: "Field updated successfully", title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update field", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-full h-full overflow-y-scroll custom-scrollbar mx-auto mt-0 bg-white shadow rounded p-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h2>
          <p className="text-gray-500 mb-6">Room Material Items</p>
        </div>
        <Button variant="primary" className="h-10" onClick={() => navigate(`/projectdetails/${projectId}/costestimation`)}>
          Go Back
        </Button>
      </div>

      <section className="border border-gray-200 rounded-lg overflow-hidden">

        <section>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">Total Material Cost:</span>
              <span className={`text-lg font-bold  text-blue-900`}>₹{room?.totalCost?.toLocaleString()}</span>
            </div>
          </div>
        </section>
        {/* Table header */}
        <div className="grid grid-cols-6 bg-blue-50 text-sm font-semibold text-gray-600 px-6 py-3 ">
          <div className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item</div>
          <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Area Sq.Ft</div>
          <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Predefined Rate</div>
          <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Overridden Rate</div>
          <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</div>
          <div className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          {room.materials.map((item: any) => (
            <div key={item.key} className={`grid grid-cols-6 items-center px-6 py-4 text-sm ${editingKey === item.key ? "": "hover:bg-[#f7fbff]"}`}>
              <div className="font-medium text-gray-800">{item.key}</div>

              {editingKey === item.key ? (
                <>
                  <div className="text-center">
                    <Input
                      className="text-center"
                      type="number"
                      value={formData.areaSqFt}
                      onChange={(e) =>
                        setFormData({ ...formData, areaSqFt: +e.target.value })
                      }
                    />
                  </div>
                  <div className="text-center">
                    <Input
                      className="text-center"
                      type="number"
                      value={formData.predefinedRate}
                      onChange={(e) =>
                        setFormData({ ...formData, predefinedRate: +e.target.value })
                      }
                    />
                  </div>
                  <div className="text-center">
                    <Input
                      className="text-center"
                      type="number"
                      value={formData.overriddenRate ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          overriddenRate: +e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="text-center text-gray-900 font-semibold">
                    {typeof formData.areaSqFt === "number" &&
                      (typeof formData.predefinedRate === "number" ||
                        typeof formData.overriddenRate === "number")
                      ? "₹" +
                      (
                        formData.areaSqFt *
                        (formData.overriddenRate && formData.overriddenRate > 0
                          ? formData.overriddenRate
                          : formData.predefinedRate ?? 0)
                      ).toLocaleString("en-IN")
                      : "N/A"}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="primary" isLoading={updatePending} onClick={() => handleSave(item.key)}> <i className="fas fa-check"></i> </Button>
                    <Button variant="ghost" onClick={() => setEditingKey(null)}>✖</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-center  text-gray-700">{item.areaSqFt ?? "N/A"}</div>
                  <div className="font-medium text-center text-gray-700">₹{item.predefinedRate?.toLocaleString("en-IN") ?? "N/A"}</div>
                  <div className="font-medium text-center text-gray-700">₹{item.overriddenRate?.toLocaleString("en-IN") ?? "N/A"}</div>
                  <div className="text-center text-black font-semibold">₹{item.totalCost?.toLocaleString("en-IN") ?? "N/A"}</div>
                  <div className="flex justify-center items-center">
                    <Button variant="primary" onClick={() => handleEdit(item.key, item)}>✎</Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>


      <section className="mt-4">
        <CostEstimateUpload projectId={projectId!} roomId={roomId!} initialFiles={room.uploads} refetch={refetch} />
      </section>
    </div>
  );
}
