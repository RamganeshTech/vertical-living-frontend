import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetQualityCheckup, useCreateQualityCheckItem, useEditQualityCheckItem, useDeleteQualityCheckItem, } from "../../../apiList/Stage Api/qualityCheckApi";
import { Input } from "../../../components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "../../../components/ui/Select";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";

const dummyQualityCheckRooms: QualityCheckRoom[] = [
  {
    workName: "Electrical Wiring",
    status: "Pending",
    remarks: "Awaiting inspection",
    upload: {
      type: "image",
      url: "https://example.com/uploads/electrical-wiring.jpg",
      originalName: "wiring.jpg",
    },
  },
  {
    workName: "Plumbing",
    status: "Completed",
    remarks: "Checked by supervisor",
    upload: {
      type: "pdf",
      url: "https://example.com/uploads/plumbing-report.pdf",
      originalName: "plumbing-report.pdf",
    },
  },
  {
    workName: "Tile Flooring",
    status: "In Progress",
    remarks: "50% done, minor alignment issue",
    upload: {
      type: "image",
      url: "https://example.com/uploads/tile-flooring.jpg",
      originalName: "tile-flooring.jpg",
    },
  },
  {
    workName: "False Ceiling",
    status: "Pending",
    remarks: "Materials delivered, work yet to start",
    upload: {
      type: "image",
      url: "https://example.com/uploads/false-ceiling.jpg",
      originalName: "false-ceiling.jpg",
    },
  },
  {
    workName: "Wooden Doors",
    status: "Completed",
    remarks: "Installed, polish pending",
    upload: {
      type: "pdf",
      url: "https://example.com/uploads/wooden-doors.pdf",
      originalName: "wooden-doors.pdf",
    },
  },
  {
    workName: "Window Fittings",
    status: "In Progress",
    remarks: "2 windows left for fitting",
    upload: {
      type: "image",
      url: "https://example.com/uploads/window-fittings.jpg",
      originalName: "window-fittings.jpg",
    },
  },
  {
    workName: "Painting",
    status: "Pending",
    remarks: "Paint samples approved",
    upload: {
      type: "image",
      url: "https://example.com/uploads/painting.jpg",
      originalName: "painting.jpg",
    },
  },
  {
    workName: "Modular Kitchen",
    status: "In Progress",
    remarks: "Carcass fitting done",
    upload: {
      type: "pdf",
      url: "https://example.com/uploads/modular-kitchen.pdf",
      originalName: "modular-kitchen.pdf",
    },
  },
  {
    workName: "Wardrobe Assembly",
    status: "Completed",
    remarks: "Final polish done",
    upload: {
      type: "image",
      url: "https://example.com/uploads/wardrobe.jpg",
      originalName: "wardrobe.jpg",
    },
  },
  {
    workName: "Exterior Cladding",
    status: "Pending",
    remarks: "Material supply delayed",
    upload: {
      type: "image",
      url: "https://example.com/uploads/exterior-cladding.jpg",
      originalName: "exterior-cladding.jpg",
    },
  },
];


interface QualityCheckRoom {
  workName: string
  status: string,
  remarks: string,
  upload: {
    type: string,
    url: string,
    originalName: string,
  }
}

export default function QualityCheckRoomDetails() {
  const { roomkey, projectId } = useParams() as { roomkey: string; projectId: string };

  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, isLoading } = useGetQualityCheckup(projectId);
  const { mutateAsync: createItem } = useCreateQualityCheckItem();
  const { mutateAsync: editItem } = useEditQualityCheckItem();
  const { mutateAsync: deleteItem } = useDeleteQualityCheckItem();

  const [form, setForm] = useState({
    workName: "",
    status: "pending",
    remarks: "",
    file: undefined as File | undefined,
  });

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <MaterialOverviewLoading />;

  const items: any[] = data?.[roomkey] || [];

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("workName", form.workName);
      formData.append("status", form.status);
      if (form.remarks) formData.append("remarks", form.remarks);
      if (form.file) formData.append("file", form.file);

      await createItem({ projectId, roomName: roomkey, formData });
      toast({ description: "Created successfully", title: "Success" });
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || error.message || "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (itemId: string) => {
    try {
      if (!editingId) return;
      const formData = new FormData();
      formData.append("itemId", editingId);
      if (form.workName) formData.append("workName", form.workName);
      formData.append("status", form.status);
      if (form.remarks) formData.append("remarks", form.remarks);
      if (form.file) formData.append("file", form.file);

      await editItem(
        { projectId, roomName: roomkey, formData, itemId: itemId },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
      toast({ description: "Edited successfully", title: "Success" });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || error.message || "Failed to edit item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem({ projectId, roomName: roomkey, itemId });
      toast({ description: "Deleted successfully", title: "Success" });
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

  return (
//     <div className="w-full h-full">
//       <h1 className="text-xl font-bold mb-4">Room: {roomkey}</h1>

//       {items.length === 0 && !adding ? (
//         <>
//                     <div className="min-w-[1000px]  overflow-x-auto">

//           <div className="grid grid-cols-5 mb-2 gap-2 font-semibold bg-blue-100 text-blue-900 p-2 rounded">
//             <div className="text-center">Work Name</div>
//             <div className="text-center">Status</div>
//             <div className="text-center">Remarks</div>
//             <div className="text-center">Upload</div>
//             <div className="text-center">Actions</div>
//           </div>
//           <div className="flex flex-col items-center justify-center p-12 shadow rounded-lg bg-white">
//             <i className="fas fa-check-double text-3xl text-blue-400 mb-2"></i>
//             <p className="text-blue-600 mb-4 text-sm">No items added yet for this room.</p>
//             <Button onClick={() => setAdding(true)} variant="primary">
//               <i className="fas fa-plus mr-2"></i> Add Item
//             </Button>
//           </div>
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="grid grid-cols-5 text-blue-900 gap-2 font-semibold bg-blue-100 p-2 rounded">
//             <div className="text-center">Work Name</div>
//             <div className="text-center">Status</div>
//             <div className="text-center">Remarks</div>
//             <div className="text-center">Upload</div>
//             <div className="text-center">Actions</div>
//           </div>

//           <div className="px-4 py-3 items-center max-h-[80%] overflow-y-auto">
//             {dummyQualityCheckRooms?.map((item) =>
//               // {items?.map((item) =>
//               editingId === (item as any)._id ? (
//                 <div
//                   key={(item as any)._id}
//                   className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
//                 >
//                   <Input
//                     value={form.workName}
//                     placeholder="Work Name"
//                     onChange={(e) => setForm({ ...form, workName: e.target.value })}
//                   />
//                   <Select
//                     value={form.status}
//                     onValueChange={(val) => setForm({ ...form, status: val })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue selectedValue={form.status} placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {["pass", "fail", "pending"].map((opt) => (
//                         <SelectItem key={opt} value={opt}>
//                           {opt}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Input
//                     value={form.remarks}
//                     placeholder="Remarks"
//                     onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//                   />
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       setForm({ ...form, file });
//                       if (file) {
//                         const url = URL.createObjectURL(file);
//                         setImagePreview(url);
//                       }
//                     }}
//                   />
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit((item as any)._id)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
//                     >
//                       <i className="fas fa-save mr-1"></i> Save
//                     </button>
//                     <button
//                       onClick={resetForm}
//                       className="bg-gray-400 text-white px-3 py-1 rounded"
//                     >
//                       <i className="fas fa-times mr-1"></i> Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div
//                   key={(item as any)._id}
//                   className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
//                 >
//                   <div className="text-center">{item.workName}</div>
//                   <div className="text-center">{item.status}</div>
//                   <div className="text-center">{item.remarks}</div>
//                   <div className="text-center">
//                     {item.upload?.type === "image" ? (
//                       <img
//                         src={item.upload.url}
//                         alt="Preview"
//                         className="w-10 h-10 object-cover rounded border cursor-pointer mx-auto"
//                         onClick={() => setPopupImage(item.upload.url)}
//                       />
//                     ) : item.upload?.type === "pdf" ? (
//                       <a href={item.upload.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
//                         View PDF
//                       </a>
//                     ) : (
//                       "-"
//                     )}
//                   </div>
//                   <div className="flex gap-2 justify-center">
//                     <button
//                       onClick={() => {
//                         setEditingId((item as any)._id);
//                         setAdding(false);
//                         setForm({
//                           workName: item.workName || "",
//                           status: item.status || "pending",
//                           remarks: item.remarks || "",
//                           file: undefined,
//                         });
//                       }}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                     >
//                       <i className="fas fa-edit mr-1"></i> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete((item as any)._id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
//                     >
//                       <i className="fas fa-trash mr-1"></i> Delete
//                     </button>
//                   </div>
//                 </div>
//               )
//             )}
//           </div>

//           {adding && (
//             <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 items-center bg-white">
//               <Input
//                 placeholder="Work Name"
//                 value={form.workName}
//                 onChange={(e) => setForm({ ...form, workName: e.target.value })}
//               />
//               <Select
//                 value={form.status}
//                 onValueChange={(val) => setForm({ ...form, status: val })}
//               >
//                 <SelectTrigger>
//                   <SelectValue selectedValue={form.status} placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {["pass", "fail", "pending"].map((opt) => (
//                     <SelectItem key={opt} value={opt}>
//                       {opt}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Input
//                 placeholder="Remarks"
//                 value={form.remarks}
//                 onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//               />
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   setForm({ ...form, file });
//                   if (file) {
//                     const url = URL.createObjectURL(file);
//                     setImagePreview(url);
//                   }
//                 }}
//               />
//               <div className="flex gap-2 justify-center">
//                 <button
//                   onClick={handleAdd}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
//                 >
//                   <i className="fas fa-save mr-1"></i> Save
//                 </button>
//                 <button
//                   onClick={resetForm}
//                   className="bg-gray-400 text-white px-3 py-1 rounded"
//                 >
//                   <i className="fas fa-times mr-1"></i> Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//           {!adding && items.length > 0 && (
//             <Button
//               variant="primary"
//               onClick={() => {
//                 setAdding(true);
//                 setEditingId(null);
//                 setForm({ workName: "", status: "pending", remarks: "", file: undefined });
//               }}
//               className="mt-2"
//             >
//               <i className="fas fa-plus mr-2"></i> Add Item
//             </Button>
//           )}
//         </>
//       )}

//       {popupImage && (
//   <div onClick={() => setPopupImage(null)} className="fixed inset-0 z-50 bg-black/70 bg-opacity-60 flex items-center justify-center">
//     <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded p-4 lg:p-8 max-w-[90vw] max-h-[80vh] shadow-lg">
//       <i
//         className="fas fa-times absolute top-2 right-3 text-xl text-gray-700 hover:text-red-500 cursor-pointer"
//         onClick={() => setPopupImage(null)}
//       ></i>
//       <img
//         src={popupImage}
//         alt="Full View"
//         className="max-h-[70vh] w-auto object-contain rounded"
//       />
//     </div>
//   </div>
// )}
//     </div>



  <div className="w-full h-full">
    <h1 className="text-xl font-bold mb-4">Room: {roomkey}</h1>

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
            <div className="overflow-y-auto max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] lg:max-h-[45vh] xl:max-h-[77vh]">
              {dummyQualityCheckRooms.map((item, index) =>
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
                      <button
                        onClick={() => handleEdit((item as any)._id)}
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
                    </div>
                  </div>
                ) : (
                  <div
                    key={(item as any)._id + index}
                    className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-200 items-center bg-white"
                  >
                    <div className="text-center">{item.workName}</div>
                    <div className="text-center">{item.status}</div>
                    <div className="text-center">{item.remarks}</div>
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
                        "-"
                      )}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
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
                      </button>
                      <button
                        onClick={() => handleDelete((item as any)._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        <i className="fas fa-trash mr-1"></i> Delete
                      </button>
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
                  <button
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add New Button */}
        {!adding && items.length > 0 && (
          <div className="mt-4">
            <Button
              variant="primary"
              onClick={() => {
                setAdding(true);
                setEditingId(null);
                setForm({ workName: "", status: "pending", remarks: "", file: undefined });
              }}
            >
              <i className="fas fa-plus mr-2"></i> Add Item
            </Button>
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
