import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateQualityCheckItem, useEditQualityCheckItem, useDeleteQualityCheckItem, useGetQualityCheckRoomItems, } from "../../../apiList/Stage Api/qualityCheckApi";
import { Input } from "../../../components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "../../../components/ui/Select";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

// const dummyQualityCheckRooms: QualityCheckRoom[] = [
//   {
//     workName: "Electrical Wiring",
//     status: "Pending",
//     remarks: "Awaiting inspection",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/electrical-wiring.jpg",
//       originalName: "wiring.jpg",
//     },
//   },
//   {
//     workName: "Plumbing",
//     status: "Completed",
//     remarks: "Checked by supervisor",
//     upload: {
//       type: "pdf",
//       url: "https://example.com/uploads/plumbing-report.pdf",
//       originalName: "plumbing-report.pdf",
//     },
//   },
//   {
//     workName: "Tile Flooring",
//     status: "In Progress",
//     remarks: "50% done, minor alignment issue",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/tile-flooring.jpg",
//       originalName: "tile-flooring.jpg",
//     },
//   },
//   {
//     workName: "False Ceiling",
//     status: "Pending",
//     remarks: "Materials delivered, work yet to start",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/false-ceiling.jpg",
//       originalName: "false-ceiling.jpg",
//     },
//   },
//   {
//     workName: "Wooden Doors",
//     status: "Completed",
//     remarks: "Installed, polish pending",
//     upload: {
//       type: "pdf",
//       url: "https://example.com/uploads/wooden-doors.pdf",
//       originalName: "wooden-doors.pdf",
//     },
//   },
//   {
//     workName: "Window Fittings",
//     status: "In Progress",
//     remarks: "2 windows left for fitting",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/window-fittings.jpg",
//       originalName: "window-fittings.jpg",
//     },
//   },
//   {
//     workName: "Painting",
//     status: "Pending",
//     remarks: "Paint samples approved",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/painting.jpg",
//       originalName: "painting.jpg",
//     },
//   },
//   {
//     workName: "Modular Kitchen",
//     status: "In Progress",
//     remarks: "Carcass fitting done",
//     upload: {
//       type: "pdf",
//       url: "https://example.com/uploads/modular-kitchen.pdf",
//       originalName: "modular-kitchen.pdf",
//     },
//   },
//   {
//     workName: "Wardrobe Assembly",
//     status: "Completed",
//     remarks: "Final polish done",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/wardrobe.jpg",
//       originalName: "wardrobe.jpg",
//     },
//   },
//   {
//     workName: "Exterior Cladding",
//     status: "Pending",
//     remarks: "Material supply delayed",
//     upload: {
//       type: "image",
//       url: "https://example.com/uploads/exterior-cladding.jpg",
//       originalName: "exterior-cladding.jpg",
//     },
//   },
// ];


// interface QualityCheckRoom {
//   workName: string
//   status: string,
//   remarks: string,
//   upload: {
//     type: string,
//     url: string,
//     originalName: string,
//   }
// }

export default function QualityCheckRoomDetails() {
  const { roomName, projectId, organizationId } = useParams() as { roomName: string; projectId: string, organizationId: string };
  const decodedRoomName = decodeURIComponent(roomName);

  const navigate = useNavigate();

  const [popupImage, setPopupImage] = useState<string | null>(null);



  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.qualitycheck?.delete;
  // const canList = role === "owner" || permission?.qualitycheck?.list;
  const canCreate = role === "owner" || permission?.qualitycheck?.create;
  const canEdit = role === "owner" || permission?.qualitycheck?.edit;


  const { data, isLoading, error, isError, refetch } = useGetQualityCheckRoomItems(projectId, decodedRoomName);
  const { mutateAsync: createItem, isPending: createPending } = useCreateQualityCheckItem();
  const { mutateAsync: editItem, isPending: editPending } = useEditQualityCheckItem();
  const { mutateAsync: deleteItem, isPending: deletePending } = useDeleteQualityCheckItem();

  const [form, setForm] = useState({
    workName: "",
    status: "pending",
    remarks: "",
    file: undefined as File | undefined,
  });

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // if (isLoading) return <MaterialOverviewLoading />;

  const items: any[] = data?.tasks || [];

  const handleAdd = async () => {
    try {

      if (!form.workName.trim()) {
        throw new Error("Work name is mandatory")
      }

      const formData = new FormData();
      formData.append("workName", form.workName);
      formData.append("status", form.status);
      if (form.remarks) formData.append("remarks", form.remarks);
      if (form.file) formData.append("file", form.file);

      await createItem({ projectId, roomName: decodedRoomName, formData });
      toast({ description: "Created successfully", title: "Success" });
      resetForm();
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || error?.message || "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (itemId: string) => {
    try {
      if (!editingId) return;

      if (!form.workName.trim()) {
        throw new Error("Work name is mandatory")
      }

      const formData = new FormData();
      formData.append("itemId", editingId);
      if (form.workName) formData.append("workName", form.workName);
      formData.append("status", form.status);
      if (form.remarks) formData.append("remarks", form.remarks);
      if (form.file) formData.append("file", form.file);

      await editItem(
        { projectId, roomName: decodedRoomName, formData, itemId: itemId },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
      toast({ description: "Edited successfully", title: "Success" });
      refetch()

    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || error?.message || "Failed to edit item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem({ projectId, roomName: decodedRoomName, itemId });
      toast({ description: "Deleted successfully", title: "Success" });
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || error.message || "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setForm({ workName: "", status: "pending", remarks: "", file: undefined });
    setAdding(false);
    setEditingId(null);
  };


  if (isLoading) return <RoomDetailsLoading />;

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
    <div className="w-full h-full">
      <div className="flex justify-between">

        <h1 className="text-xl font-bold mb-4">Room: {roomName}</h1>
        <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/qualitycheck`)}>
          Go Back
        </Button>
      </div>

      {items.length === 0 && !adding ? (
        <>
          {/* Table Headings */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px] grid grid-cols-5 gap-2 font-semibold bg-blue-100 text-blue-900 p-2 rounded">
              <div className="text-center">Work Name</div>
              <div className="text-center">Status</div>
              <div className="text-center">Remarks</div>
              <div className="text-center">Upload</div>
              <div className="text-center">Actions</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-12 shadow rounded-lg bg-white">
            <i className="fas fa-check-double text-3xl text-blue-400 mb-2"></i>
            <p className="text-blue-600 mb-4 text-sm">No items added yet for this room.</p>
            <Button onClick={() => setAdding(true)} variant="primary">
              <i className="fas fa-plus mr-2"></i> Add Item
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Sticky Header */}
              <div className="grid grid-cols-5 text-blue-900 gap-2 font-semibold bg-blue-100 p-2 rounded-t">
                <div className="text-center">Work Name</div>
                <div className="text-center">Status</div>
                <div className="text-center">Remarks</div>
                <div className="text-center">Upload</div>
                <div className="text-center">Actions</div>
              </div>

              {/* 🧠 Responsive Adaptive Vertical Scroll */}
              <div className="overflow-y-auto relative z-[10] max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] lg:max-h-[45vh] xl:max-h-[77vh]">
                {items.map((item, index) =>
                  editingId === (item as any)._id ? (
                    <div
                      key={(item as any)._id + index}
                      className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
                    >
                      <Input
                        value={form.workName}
                        placeholder="Work Name"
                        onChange={(e) =>
                          setForm({ ...form, workName: e.target.value })
                        }
                      />
                      <div className="relative z-50">
                        <Select
                          value={form.status}
                          onValueChange={(val) =>
                            setForm({ ...form, status: val })
                          }
                        >
                          <SelectTrigger selectedValue={form.status}>
                            <SelectValue
                              selectedValue={form.status}
                              placeholder="Select status"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {["pass", "fail", "pending"].map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        value={form.remarks}
                        placeholder="Remarks"
                        onChange={(e) =>
                          setForm({ ...form, remarks: e.target.value })
                        }
                      />
                      <div className="flex flex-col items-center gap-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setForm({ ...form, file });

                          }}
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="primary"
                          isLoading={editPending}
                          onClick={() => handleEdit((item as any)._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          <i className="fas fa-save mr-1"></i> Save
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={resetForm}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={(item as any)._id + index}
                      className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
                    >
                      <div className="text-center">{item.workName || "N/A"}</div>
                      <div className="text-center">{item.status || "N/A"}</div>
                      <div className="text-center">{item.remarks || "N/A"}</div>
                      <div className="text-center">
                        {item.upload?.type === "image" ? (
                          <img
                            src={item.upload.url}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded border cursor-pointer mx-auto"
                            onClick={() => setPopupImage(item.upload.url)}
                          />
                        ) : item.upload?.type === "pdf" ? (
                          <a
                            href={item.upload.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View PDF
                          </a>
                        ) : (
                          "No Image"
                        )}
                      </div>
                      <div className="flex gap-2 justify-center">
                       {canEdit &&  <button
                          onClick={() => {
                            setEditingId((item as any)._id);
                            setAdding(false);
                            setForm({
                              workName: item.workName || "",
                              status: item.status || "pending",
                              remarks: item.remarks || "",
                              file: undefined,
                            });
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </button>}
                       {canDelete && <Button
                          variant="danger"
                          isLoading={deletePending}
                          onClick={() => handleDelete((item as any)._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          <i className="fas fa-trash mr-1"></i> Delete
                        </Button>}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Add Form */}
              {adding && (
                <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-white border-b border-gray-200 items-center">
                  <Input
                    placeholder="Work Name"
                    value={form.workName}
                    onChange={(e) =>
                      setForm({ ...form, workName: e.target.value })
                    }
                  />
                  <Select
                    value={form.status}
                    onValueChange={(val) =>
                      setForm({ ...form, status: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        selectedValue={form.status}
                        placeholder="Select status"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {["pass", "fail", "pending"].map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Remarks"
                    value={form.remarks}
                    onChange={(e) =>
                      setForm({ ...form, remarks: e.target.value })
                    }
                  />
                  <div className="flex flex-col items-center gap-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setForm({ ...form, file });
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                   {canCreate && <><button
                      onClick={handleAdd}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      <i className="fas fa-save mr-1"></i> Save
                    </button>
                    <button
                      onClick={resetForm}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      <i className="fas fa-times mr-1"></i> Cancel
                    </button>
                    </>
}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add New Button */}
          {!adding && items.length > 0 && (
            <div className="mt-4">
              {canCreate && <Button
                isLoading={createPending}
                variant="primary"
                onClick={() => {
                  setAdding(true);
                  setEditingId(null);
                  setForm({ workName: "", status: "pending", remarks: "", file: undefined });
                }}
              >
                <i className="fas fa-plus mr-2"></i> Add Item
              </Button>}
            </div>
          )}
        </>
      )}

      {/* Popup Image Viewer */}
      {popupImage && (
        <div
          onClick={() => setPopupImage(null)}
          className="fixed inset-0 z-50 bg-black/70 bg-opacity-60 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded p-4 max-w-[90vw] max-h-[80vh] shadow-lg"
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
