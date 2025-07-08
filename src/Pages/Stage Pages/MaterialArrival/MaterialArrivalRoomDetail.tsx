// import { useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "../../../utils/toast";
// import {
//   useDeleteMaterialArrivalItem,
//   useGetSingleRoomMaterialArrival,
//   useUpdateMaterialArrivalRoomItem,
// } from "../../../apiList/Stage Api/materialArrivalApi";
// import { Input } from "../../../components/ui/Input";
// import { Button } from "../../../components/ui/Button";
// import { requiredFieldsByRoomArrival } from "../../../constants/constants";
// import { Textarea } from "../../../components/ui/TextArea";

// const MaterialArrivalRoomDetail = () => {
//   const { projectId, roomKey } = useParams();
//   const navigate = useNavigate();

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [editFile, setEditFile] = useState<File | null>(null);
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [editData, setEditData] = useState<any>({});
//   const [newItemData, setNewItemData] = useState<any>({});
//   const [showAddRow, setShowAddRow] = useState(false);
//   const [popupImage, setPopupImage] = useState<string | null>(null);

//   const { data, isLoading, isError } = useGetSingleRoomMaterialArrival(projectId!, roomKey!);
//   const { mutateAsync: updateItem } = useUpdateMaterialArrivalRoomItem();
//   const { mutateAsync: deleteItem } = useDeleteMaterialArrivalItem();

//   if (!roomKey) return;
//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Failed to load room materials</p>;

//   const items = data || [];

//   const handleChange = (field: string, value: string) => {
//     setEditData((prev: any) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     const formData = new FormData();
//     formData.append("itemData", JSON.stringify(editData));
//     if (editFile) formData.append("upload", editFile);

//     try {
//       await updateItem({ projectId: projectId!, roomKey: roomKey!, formData });
//       toast({ title: "Success", description: "Item updated successfully" });
//       setEditingIndex(null);
//       setEditData({});
//       setEditFile(null);
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message || err.message || "Failed to update",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAddNew = async () => {
//     const formData = new FormData();
//     formData.append("itemData", JSON.stringify(newItemData));
//     if (selectedFile) formData.append("upload", selectedFile);

//     try {
//       await updateItem({ projectId: projectId!, roomKey: roomKey!, formData });
//       toast({ title: "Success", description: "Item added successfully" });
//       setShowAddRow(false);
//       setNewItemData({});
//       setSelectedFile(null);
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message || err.message || "Failed to add item",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async (itemId: string) => {
//     try {
//       await deleteItem({ projectId: projectId!, roomKey: roomKey!, itemId });
//       toast({ title: "Deleted", description: "Item removed" });
//     } catch (err: any) {
//       toast({ title: "Error", description: err?.message || "Failed", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <div className="w-full flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-blue-800 capitalize">
//           <span className="text-black font-semibold">Section:</span> {roomKey}
//         </h2>
//         <Button variant="primary" className="h-10" onClick={() => navigate(`/projectdetails/${projectId}/materialarrival`)}>
//           Go Back
//         </Button>
//       </div>

//       <div className="rounded-lg w-full">
//         <div className="hidden lg:grid grid-cols-9 gap-2 px-4 py-3 bg-blue-100 text-blue-800 text-sm font-semibold">
//           {requiredFieldsByRoomArrival[roomKey]?.map((field, idx) => (
//             <div key={idx} className="text-center text-xs uppercase tracking-wider">
//               {field === "verifiedByAccountant" ? "Verified" : field}
//             </div>
//           ))}
//           <div className="text-center text-xs uppercase">Actions</div>
//         </div>

//         <div className="divide-y divide-blue-100 max-h-[70vh] overflow-y-auto">
//           {!showAddRow && items.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50 rounded">
//               <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
//               <h3 className="text-lg font-semibold text-gray-700">No {roomKey} Items</h3>
//               <p className="text-sm text-gray-500 mb-4">Add your first {roomKey} item</p>
//               <button
//                 onClick={() => setShowAddRow(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium"
//               >
//                 Add Item
//               </button>
//             </div>
//           ) : (
//             items.map((item: any, index: number) => (
//               <div key={item._id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 px-4 py-3 items-center border-b">
//                 {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
//                   if (field === "image") {
//                     return (
//                       <div key={i} className="flex justify-center items-center">
//                         {editingIndex === index ? (
//                           <Input
//                             type="file"
//                             accept="image/*"
//                             className="text-xs"
//                             onChange={(e) => setEditFile(e.target.files?.[0] || null)}
//                           />
//                         ) : item?.upload?.url ? (
//                           <div
//                             className="w-10 h-10 cursor-pointer"
//                             onClick={() => setPopupImage(item.upload.url)}
//                           >
//                             <img
//                               src={item.upload.url}
//                               alt="Preview"
//                               className="rounded object-cover w-full h-full border shadow"
//                             />
//                           </div>
//                         ) : (
//                           <span className="text-xs text-gray-500">No Image</span>
//                         )}
//                       </div>
//                     );
//                   }

//                   if (field === "verifiedByAccountant") {
//                     return (
//                       <div key={i} className="text-center">
//                         {editingIndex === index ? (
//                           <input
//                             type="checkbox"
//                             checked={!!editData[field]}
//                             onChange={(e) =>
//                               setEditData((prev: any) => ({ ...prev, [field]: e.target.checked }))
//                             }
//                           />
//                         ) : item[field] ? (
//                           <i className="fas fa-check text-blue-600 text-lg" />
//                         ) : (
//                           <i className="fas fa-xmark text-red-500 text-lg" />
//                         )}
//                       </div>
//                     );
//                   }

//                   if (field === "remarks") {
//                     return editingIndex === index ? (
//                       <div className="text-center">
//                         <Textarea
//                           value={editData[field] || ""}
//                           className="text-sm"
//                           onChange={(e) =>
//                             setEditData((p: any) => ({ ...p, remarks: e.target.value }))
//                           }
//                         />
//                       </div>
//                     ) : (
//                       <div className="text-sm text-center max-h-[70px] cursor-grab  px-2 overflow-auto  custom-scrollbar max-w-[150px] whitespace-nowrap">
//                         {item[field]}
//                       </div>
//                     );
//                   }

//                   return (
//                     <div key={i} className="text-sm text-center px-2 max-w-[140px] overflow-auto whitespace-nowrap">
//                       {editingIndex === index ? (
//                         <Input
//                           className="text-xs w-full"
//                           value={editData[field] || ""}
//                           onChange={(e) => handleChange(field, e.target.value)}
//                         />
//                       ) : (
//                         item[field] || "-"
//                       )}
//                     </div>
//                   );
//                 })}

//                 <div className="flex justify-center gap-3 text-lg">
//                   {editingIndex === index ? (
//                     <>
//                       <Button size="sm" onClick={handleSave}>Save</Button>
//                       <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>Cancel</Button>
//                     </>
//                   ) : (
//                     <>
//                       <i
//                         className="fas fa-pen text-blue-600 hover:text-blue-800 cursor-pointer"
//                         onClick={() => {
//                           setEditData(item);
//                           setEditingIndex(index);
//                         }}
//                       />
//                       <i
//                         className="fas fa-trash text-red-500 hover:text-red-600 cursor-pointer"
//                         onClick={() => handleDelete(item._id)}
//                       />
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}

//           {showAddRow && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 px-4 py-3 bg-blue-50">
//               {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
//                 if (field === "image") {
//                   return (
//                     <input
//                       key={i}
//                       type="file"
//                       accept="image/*"
//                       className="text-xs w-full"
//                       onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                     />
//                   );
//                 }
//                 if (field === "verified") {
//                   return (
//                     <input
//                       key={i}
//                       type="checkbox"
//                       checked={!!newItemData[field]}
//                       onChange={(e) =>
//                         setNewItemData((prev: any) => ({ ...prev, [field]: e.target.checked }))
//                       }
//                     />
//                   );
//                 }
//                 return (
//                   <Input
//                     key={i}
//                     className="text-xs text-center w-full"
//                     placeholder={field}
//                     value={newItemData[field] || ""}
//                     onChange={(e) =>
//                       setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
//                     }
//                   />
//                 );
//               })}
//               <div className="flex justify-center gap-2">
//                 <Button size="sm" onClick={handleAddNew}>Add</Button>
//                 <Button size="sm" variant="ghost" onClick={() => setShowAddRow(false)}>Cancel</Button>
//               </div>
//             </div>
//           )}

//           {items?.length !== 0 && !showAddRow && (
//             <div className="py-4 px-6">
//               <Button onClick={() => setShowAddRow(true)}>Add Item</Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🔍 POPUP VIEWER */}
//       {popupImage && (
//         <div onClick={()=> setPopupImage(null)} className="fixed inset-0 bg-black/70 bg-opacity-60 z-50 flex items-center justify-center">
//           <div onClick={(e)=> e.stopPropagation } className="relative bg-white rounded p-8 shadow-lg max-w-[90vw] max-h-[80vh]">
//             <i
//               className="fas fa-times absolute top-2 right-3 text-2xl cursor-pointer text-gray-700 hover:text-red-500"
//               onClick={() => setPopupImage(null)}
//             ></i>
//             <img
//               src={popupImage}
//               alt="Full View"
//               className="max-h-[70vh] max-w-full object-contain rounded"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MaterialArrivalRoomDetail;




import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "../../../utils/toast";
import {
  useDeleteMaterialArrivalItem,
  useGetSingleRoomMaterialArrival,
  useUpdateMaterialArrivalRoomItem
} from "../../../apiList/Stage Api/materialArrivalApi";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { requiredFieldsByRoomArrival } from "../../../constants/constants";
import { Textarea } from "../../../components/ui/TextArea";

const MaterialArrivalRoomDetail = () => {
  const { projectId, roomKey, organizationId } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newItemData, setNewItemData] = useState<any>({});
  const [showAddRow, setShowAddRow] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetSingleRoomMaterialArrival(projectId!, roomKey!);
  const { mutateAsync: updateItem } = useUpdateMaterialArrivalRoomItem();
  const { mutateAsync: deleteItem } = useDeleteMaterialArrivalItem();

  if (!roomKey) return;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load room materials</p>;

  const items = data || [];

  const handleChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("itemData", JSON.stringify(editData));
    if (editFile) formData.append("upload", editFile);

    try {
      await updateItem({ projectId: projectId!, roomKey: roomKey!, formData });
      toast({ title: "Success", description: "Item updated successfully" });
      setEditingIndex(null);
      setEditData({});
      setEditFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to update",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = async () => {
    const formData = new FormData();
    formData.append("itemData", JSON.stringify(newItemData));
    if (selectedFile) formData.append("upload", selectedFile);

    try {
      await updateItem({ projectId: projectId!, roomKey: roomKey!, formData });
      toast({ title: "Success", description: "Item added successfully" });
      setShowAddRow(false);
      setNewItemData({});
      setSelectedFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem({ projectId: projectId!, roomKey: roomKey!, itemId });
      toast({ title: "Deleted", description: "Item removed" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-800 capitalize">
          <span className="text-black font-semibold">Section:</span> {roomKey}
        </h2>
        <Button
          variant="primary"
          className="h-10"
          onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/materialarrival`)}
        >
          Go Back
        </Button>
      </div>

      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto roundex-lg mt-2">
        {/* Table Content Container with fixed min width */}
        <div className="min-w-[1000px]">
          {/* Table Headings */}
          <div className="grid grid-cols-9 gap-2 bg-blue-100 text-blue-800 text-xs font-semibold uppercase px-4 py-2">
            {requiredFieldsByRoomArrival[roomKey]?.map((field, idx) => (
              <div key={idx} className="text-center">{field === "verifiedByAccountant" ? "Verified" : field}</div>
            ))}
            <div className="text-center">Actions</div>
          </div>

          {/* Table Rows */}
          {items?.map((item: any, index: number) => (
            <div
              key={item._id}
              className="grid grid-cols-9 gap-2 px-4 py-2 border-b items-center hover:bg-gray-50"
            >
              {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
                if (field === "image") {
                  return (
                    <div key={i} className="flex justify-center items-center">
                      {editingIndex === index ? (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                          className="text-xs"
                        />
                      ) : item?.upload?.url ? (
                        <div
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => setPopupImage(item.upload.url)}
                        >
                          <img
                            src={item.upload.url}
                            alt="Preview"
                            className="w-full h-full object-cover rounded border shadow"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                      )}
                    </div>
                  );
                }

                if (field === "verifiedByAccountant") {
                  return (
                    <div key={i} className="text-center">
                      {editingIndex === index ? (
                        <input
                          type="checkbox"
                          checked={!!editData[field]}
                          onChange={(e) =>
                            setEditData((prev: any) => ({
                              ...prev,
                              [field]: e.target.checked
                            }))
                          }
                        />
                      ) : item[field] ? (
                        <i className="fas fa-check text-blue-600 text-lg" />
                      ) : (
                        <i className="fas fa-times text-red-500 text-lg" />
                      )}
                    </div>
                  );
                }

                if (field === "remarks") {
                  return editingIndex === index ? (
                    <Textarea
                      key={field}
                      value={editData[field] || ""}
                      className="text-sm"
                      onChange={(e) =>
                        setEditData((p: any) => ({ ...p, remarks: e.target.value }))
                      }
                    />
                  ) : (
                    <div className="text-sm text-center px-2 overflow-x-auto max-w-[150px] custom-scrollbar whitespace-nowrap">
                      {item[field]}
                    </div>
                  );
                }

                return (
                  <div key={i} className="text-sm text-center px-2 max-w-[140px] overflow-auto whitespace-nowrap">
                    {editingIndex === index ? (
                      <Input
                        className="text-xs w-full"
                        value={editData[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                      />
                    ) : (
                      item[field] || "-"
                    )}
                  </div>
                );
              })}

              <div className="flex justify-center gap-2 text-lg">
                {editingIndex === index ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <i
                      className="fas fa-pen text-blue-600 cursor-pointer"
                      onClick={() => {
                        setEditData(item);
                        setEditingIndex(index);
                      }}
                    />
                    <i
                      className="fas fa-trash text-red-500 cursor-pointer"
                      onClick={() => handleDelete(item._id)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Add New Row */}
          {showAddRow && (
            <div className="grid grid-cols-9 gap-2 px-4 py-2 border-t bg-blue-50 items-center">
              {requiredFieldsByRoomArrival[roomKey]?.map((field, i) => {
                if (field === "image") {
                  return (
                    <input
                      key={i}
                      type="file"
                      accept="image/*"
                      className="text-xs w-full"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  );
                }
                if (field === "verified") {
                  return (
                    <input
                      key={i}
                      type="checkbox"
                      checked={!!newItemData[field]}
                      onChange={(e) =>
                        setNewItemData((prev: any) => ({ ...prev, [field]: e.target.checked }))
                      }
                    />
                  );
                }
                return (
                  <Input
                    key={i}
                    className="text-xs text-center w-full"
                    placeholder={field}
                    value={newItemData[field] || ""}
                    onChange={(e) =>
                      setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
                    }
                  />
                );
              })}
              <div className="flex justify-center gap-2">
                <Button size="sm" onClick={handleAddNew}>
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddRow(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!showAddRow && (
            <div className="py-4 px-4">
              <Button onClick={() => setShowAddRow(true)}>Add Item</Button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Image Viewer */}
      {popupImage && (
        <div onClick={()=> setPopupImage(null)} className="fixed inset-0 bg-black/70 bg-opacity-60 z-50 flex items-center justify-center">
          <div onClick={(e)=> e.stopPropagation }  className="relative bg-white rounded p-4 sm:p-8 shadow-lg max-w-[90vw] max-h-[80vh]">
            <i
              className="fas fa-times absolute top-2 right-3 text-2xl cursor-pointer text-gray-700 hover:text-red-500"
              onClick={() => setPopupImage(null)}
            ></i>
            <img
              src={popupImage}
              alt="Full View"
              className="max-h-[70vh] max-w-full object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialArrivalRoomDetail;