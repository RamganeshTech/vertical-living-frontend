import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateQualityCheckItem, useEditQualityCheckItem, useDeleteQualityCheckItem, useGetQualityCheckRoomItems, } from "../../../apiList/Stage Api/qualityCheckApi";
import { Input } from "../../../components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "../../../components/ui/Select";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import RoomDetailsLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";


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
    //  return  <div className="flex-1 flex items-center justify-center">
    //     <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
    //       <div className="text-red-600 font-semibold mb-2">
    //         ⚠️ Error Occurred
    //       </div>
    //       <p className="text-red-500 text-sm mb-4">
    //         {(error as any)?.response?.data?.message || "Failed to load material arrival data"}
    //       </p>
    //       <Button
    //         onClick={() => refetch()}
    //         className="bg-red-600 text-white hover:bg-red-700"
    //       >
    //         Retry
    //       </Button>
    //     </div>
    //   </div>

    return ( // FIXED: Added missing return statement
      <div className="flex-1 flex items-center justify-center p-6 bg-brand-main min-h-screen">
        <div className="max-w-xl w-full p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center">
          <div className="text-action-danger text-3xl mb-3">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="text-text-main text-lg font-bold mb-2">
            Error Occurred
          </div>
          <p className="text-text-muted text-sm mb-5">
            {(error as any)?.response?.data?.message || "Failed to load room quality check data"}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }


  return (
    <div className="w-full h-full bg-brand-main">
      <div className="flex justify-between border-b border-ash-light">

        <h1 className="text-xl font-bold mb-4 text-text-main">Room: {roomName}</h1>
        <Button
          variant="white"
          className="border-ash-medium text-text-main shadow-sm"
          onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/qualitycheck`)}>
          Go Back
        </Button>
      </div>

      {items.length === 0 && !adding ? (
        <>
          {/* Table Headings */}
          <div className="overflow-x-auto bg-brand-surface">
            <div className="min-w-[900px] grid grid-cols-5 gap-2 font-semibold bg-brand-ash text-text-main p-2 rounded">
              <div className="text-center">Work Name</div>
              <div className="text-center">Status</div>
              <div className="text-center">Remarks</div>
              <div className="text-center">Upload</div>
              <div className="text-center">Actions</div>
            </div>
          </div>
          {/* <div className="flex flex-col items-center justify-center p-12 shadow rounded-lg bg-white">
            <i className="fas fa-check-double text-3xl text-blue-400 mb-2"></i>
            <p className="text-blue-600 mb-4 text-sm">No items added yet for this room.</p>
            <Button onClick={() => setAdding(true)} variant="primary">
              <i className="fas fa-plus mr-2"></i> Add Item
            </Button>
          </div> */}

          <div className="flex flex-col items-center justify-center py-16 text-center bg-brand-ash/30">
            <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
              <i className="fas fa-clipboard-check text-2xl text-ash-dark"></i>
            </div>
            <h3 className="text-lg font-bold text-text-main mb-1">No items added yet</h3>
            <p className="text-sm text-text-muted mb-6">Create the first quality check task for this room.</p>
            {canCreate && (
              <Button onClick={() => setAdding(true)} variant="dark" className="shadow-sm px-6">
                <i className="fas fa-plus mr-2"></i> Add First Item
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Sticky Header */}
              {/* <div className="grid grid-cols-5 text-blue-900 gap-2 font-semibold bg-blue-100 p-2 rounded-t"> */}
              <div className="grid grid-cols-5 text-[10px] font-bold text-text-muted rounded-t bg-brand-ash border-b border-ash-medium">
                {/* <div className="text-center">Work Name</div>
                <div className="text-center">Status</div>
                <div className="text-center">Remarks</div>
                <div className="text-center">Upload</div>
                <div className="text-center">Actions</div> */}

                <div className="px-4 py-3 border-r border-ash-light">Work Name</div>
                <div className="px-4 py-3 text-center border-r border-ash-light">Status</div>
                <div className="px-4 py-3 border-r border-ash-light">Remarks</div>
                <div className="px-4 py-3 text-center border-r border-ash-light">Upload</div>
                <div className="px-4 py-3 text-center">Actions</div>
              </div>

              {/* 🧠 Responsive Adaptive Vertical Scroll */}
              <div className="overflow-y-auto relative z-[10] max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] lg:max-h-[45vh] xl:max-h-[77vh]">
                {items.map((item, index) =>
                  editingId === (item as any)._id ? (
                    <div
                      key={(item as any)._id + index}
                      // className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
                      className="grid grid-cols-5 gap-2 px-4 py-2 bg-brand-surface items-center"
                    >
                      <Input
                        value={form.workName}
                        placeholder="Work Name"
                        onChange={(e) =>
                          setForm({ ...form, workName: e.target.value })
                        }
                        className="w-full bg-brand-ash border-ash-medium text-text-main text-sm"
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
                        className="w-full bg-brand-ash border-ash-medium text-text-main text-sm"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setForm({ ...form, file });

                          }}
                          className="text-[10px] w-full file:bg-brand-surface file:border-ash-medium file:text-text-main bg-brand-ash border-ash-medium"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="dark"
                          isLoading={editPending}
                          onClick={() => handleEdit((item as any)._id)}
                          // className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          className="shadow-sm px-4"
                        >
                          <i className="fas fa-save mr-1"></i> Save
                        </Button>
                        <Button
                          variant="white"
                          onClick={resetForm}
                          // className="bg-gray-400 text-white px-3 py-1 rounded"
                          className="border-ash-medium text-text-main shadow-sm px-4"
                        >
                          <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={(item as any)._id + index}
                      className="grid grid-cols-5 gap-2 px-4 py-3 items-center bg-brand-surface hover:bg-brand-ash/50"
                    >
                      <div className="font-bold text-sm text-text-main pr-4 truncate border-r border-ash-light">{item.workName || "N/A"}</div>
                      <div className="text-center text-sm px-4 border-r border-ash-light font-bold">{item.status || "N/A"}</div>
                      {/* <div className="text-center">{item.remarks || "N/A"}</div> */}
                      <div className="text-sm font-medium text-text-muted px-4 truncate border-r border-ash-light">
                          {item.remarks || "-"}
                      </div>

                      {/* <div className="text-center"> */}
                      <div className="text-center px-4 border-r border-ash-light">
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
                            // className="text-blue-600 underline"
                            className="text-xs font-bold text-text-main bg-brand-ash border border-ash-medium px-2 py-1 rounded hover:bg-brand-surface transition-colors"
                          >
                            View PDF
                          </a>
                        ) : (
                          // "No Image"
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted italic">No File</span>
                        )}
                      </div>
                      <div className="flex gap-2 justify-center">
                        {canEdit && <Button
                        variant="white"
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
                          // className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          className="w-8 h-8 p-0 border-ash-medium text-text-main shadow-sm hover:text-action-primary"
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </Button>}
                        {canDelete && <Button
                          variant="ghost"
                          isLoading={deletePending}
                          onClick={() => handleDelete((item as any)._id)}
                          // className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          className="w-8 h-8 p-0 text-text-muted hover:text-action-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-all rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
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
                // <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-white border-b border-gray-200 items-center">
                <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-brand-surface items-center border-t-2 border-ash-medium">
                  <Input
                    placeholder="Work Name"
                    value={form.workName}
                    onChange={(e) =>
                      setForm({ ...form, workName: e.target.value })
                    }
                    className="w-full bg-brand-ash border-ash-medium text-text-main text-sm"
                  />
                  <Select
                    value={form.status}
                    onValueChange={(val) =>
                      setForm({ ...form, status: val })
                    }
                  >
                    {/* <SelectTrigger> */}
                    <SelectTrigger className="bg-brand-ash border-ash-medium text-text-main text-sm">
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
                    className="w-full bg-brand-ash border-ash-medium text-text-main text-sm"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setForm({ ...form, file });
                      }}
                      className="text-[10px] w-full file:bg-brand-surface file:border-ash-medium file:text-text-main bg-brand-ash border-ash-medium"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    {canCreate && <><Button
                    variant="dark"
                      onClick={handleAdd}
                      // className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      className="shadow-sm px-4"
                    >
                      <i className="fas fa-save mr-1"></i> Save
                    </Button>
                      <Button variant="white"
                        onClick={resetForm}
                        // className="bg-gray-400 text-white px-3 py-1 rounded"
                        className="border-ash-medium text-text-main shadow-sm px-4"
                      >
                        <i className="fas fa-times mr-1"></i> Cancel
                      </Button>
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
variant="dark"
                onClick={() => {
                  setAdding(true);
                  setEditingId(null);
                  setForm({ workName: "", status: "pending", remarks: "", file: undefined });
                }}
                className="shadow-sm px-2"
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
          className="fixed inset-0 z-50 bg-brand-main/90 bg-opacity-60 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-brand-surface rounded p-4 max-w-[90vw] max-h-[80vh] shadow-lg"
          >
            {/* <i
              className="fas fa-times absolute top-2 right-3 text-xl text-gray-700 hover:text-red-500 cursor-pointer"
              onClick={() => setPopupImage(null)}
            ></i> */}

            <button
                onClick={() => setPopupImage(null)}
                className="absolute -top-4 -right-4 bg-brand-surface border border-ash-medium text-text-main hover:bg-brand-ash rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all z-10"
            >
                <i className="fas fa-times text-lg"></i>
            </button>
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
