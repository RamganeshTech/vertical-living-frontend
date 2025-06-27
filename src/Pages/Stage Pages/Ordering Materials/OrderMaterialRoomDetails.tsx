// // File: OrderMaterialRoomDetails.tsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetSingleOrderingRoom, useUpdateIsOrderedStatus, useUpdateOrderingMaterialItem } from "../../../apiList/Stage Api/orderingMaterialApi";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import { Button } from "../../../components/ui/Button";
// import { toast } from "../../../utils/toast";
// import UploadOrderMaterial from "./UploadOrderMaterial";
// import { useState } from "react";

// interface EditOrderingMaterial {
//   sellerName: string;
//   sellerPhoneNo: string;
//   notes: string;
// }

// const OrderMaterialRoomDetails = () => {
//   const { projectId, roomId } = useParams();
//   const navigate = useNavigate();
//   const { data, isLoading, isError, error } = useGetSingleOrderingRoom({
//     projectId: projectId!,
//     roomId: roomId!
//   });


//   const [editingKey, setEditingKey] = useState<string | null>(null);
//   const [editValues, setEditValues] = useState<EditOrderingMaterial>({
//     sellerName: "",
//     sellerPhoneNo: "",
//     notes: ""
//   });


//   const { mutateAsync: updateIsOrdered, isPending: isOrderedPending } = useUpdateIsOrderedStatus()
//   const { mutateAsync: updateOrderMaterial, isPending: updatePending } = useUpdateOrderingMaterialItem()



//   if (isLoading) return <Skeleton className="w-full h-60" />;
//   if (isError) return <p>(error as Error)</p>


//   const handleUpdateFields = async (materialName: string) => {
//     try {
//       await updateOrderMaterial({ projectId: projectId!, roomId: roomId!, materialName, payload: editValues });
//       setEditingKey(null);
//       toast({ description: "Field updated successfully", title: "Success" });
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update field", variant: "destructive" });
//     }
//   };


//   const handleUpdateIsOrdered = async (materialName: string, isOrdered: boolean) => {
//     try {
//       await updateIsOrdered({ projectId: projectId!, materialName, roomId: roomId!, isOrdered });
//       setEditingKey(null);
//       toast({ description: "Field ordered updated successfully", title: "Success" });
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update field", variant: "destructive" });
//     }
//   };


//   const handleCancelUpdate = async () => {
//     setEditingKey(null);
//     setEditValues({
//       sellerName: "",
//       sellerPhoneNo: "",
//       notes: ""
//     });
//   };

//   return (
//     <div className="p-4">
//       <Button className="mb-4 bg-blue-600 hover:bg-blue-700" onClick={() => navigate(-1)}>
//         ← Back to Rooms
//       </Button>

//       <h2 className="text-2xl font-semibold text-blue-800 mb-4">
//         Room: {data.roomName}
//       </h2>

//       <div className=" max-h-[60vh] border border-blue-200 rounded-lg">
//         <div className="grid grid-cols-9 px-6 py-3 bg-blue-100 text-blue-800 text-sm font-semibold">
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Material Name</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Name</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Phone</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Is Ordered</div>
//           <div className="text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
//         </div>

//         <div className="text-sm text-blue-900 divide-y max-h-[70vh] overflow-y-auto divide-blue-100">
//           {data?.materials?.map((item: any, index: number) => (
//             <div
//               key={index}
//               className="grid grid-cols-9 items-center px-6 py-3 gap-4 hover:bg-gray-50 transition-colors"
//             >
//               <div className="  text-center font-medium">{item?.name}</div>
//               <div className="  text-center">{item.brand ?? "-"}</div>

//               <div className="  text-center">{item.quantity ?? "-"}</div>
//               <div className="  text-center">{item?.unit ?? "-"}</div>

//               {editingKey === item.name ? (
//                 <>
//                   <input
//                     type="text"
//                     className="text-sm border p-1"
//                     value={editValues.sellerName || ""}
//                     onChange={(e) => setEditValues({ ...editValues, sellerName: e.target.value })}
//                   />
//                   <input
//                     type="text"
//                     className="text-sm border p-1"
//                     value={editValues.sellerPhoneNo || ""}
//                     onChange={(e) => setEditValues({ ...editValues, sellerPhoneNo: e.target.value })}
//                   />
//                   <input
//                     type="text"
//                     className="text-sm border p-1"
//                     value={editValues.notes || ""}
//                     onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
//                   />
//                   <div className="text-center">
//                     <span
//                       onClick={() => handleUpdateIsOrdered(item.name, item.isOrdered)}
//                       className={`cursor-pointer px-2 py-1 rounded text-white text-xs ${item.isOrdered ? "bg-green-500" : "bg-red-400"}`}
//                     >
//                       {item.isOrdered ? "Yes" : "No"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       className="bg-green-500 hover:bg-green-600 text-xs"
//                       onClick={() => handleUpdateFields(item.name)}
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       className="bg-red-500 hover:bg-red-600 text-xs"
//                       onClick={handleCancelUpdate}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="text-center">{item.sellerName ?? "-"}</div>
//                   <div className="text-center">{item.sellerPhoneNo ?? "-"}</div>
//                   <div className="text-center">{item.notes ?? "-"}</div>
//                   <div className="text-center">
//                     <span
//                       onClick={() => handleUpdateIsOrdered(item.name, item.isOrdered)}
//                       className={`cursor-pointer px-2 py-1 rounded text-white text-xs ${item.isOrdered ? "bg-green-500" : "bg-red-400"}`}
//                     >
//                       {item.isOrdered ? "Yes" : "No"}
//                     </span>
//                   </div>
//                 </>
//               )}

//               {editingKey !== item.name && (
//                 <div className="text-center">
//                   <Button
//                     className="bg-blue-500 hover:bg-blue-600 text-xs"
//                     onClick={() => {
//                       setEditingKey(item.name);
//                       setEditValues({
//                         sellerName: item.sellerName || "",
//                         sellerPhoneNo: item.sellerPhoneNo || "",
//                         notes: item.notes || ""
//                       });
//                     }}
//                   >
//                    <i className="fas fa-pencil mr-2"></i> Edit
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>


//       <section className="w-full my-2">
//         <div className="text-sm font-medium text-gray-700">
//           {data.additionalNotes || "No notes"}
//         </div>
//       </section>

//       <section className="w-full my-2">
//         <UploadOrderMaterial projectId={projectId!} roomId={roomId!} initialFiles={data.uploads} />
//       </section>
//     </div>
//   );
// };

// export default OrderMaterialRoomDetails;



import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "../../../utils/toast";
import { useGetRoomDetailsOrderMaterials, useUpdateRoomMaterials, useDeleteRoomMaterialItem } from "../../../apiList/Stage Api/orderingMaterialApi";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { predefinedOptionsRooms, requiredFieldsByRoomOrderMaterials } from "../../../constants/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";



const OrderMaterialRoomDetails = () => {
  const { projectId, roomKey } = useParams();
  const navigate = useNavigate();


  if (!roomKey) return;

  const [showAddRow, setShowAddRow] = useState(false);
  const [newItemData, setNewItemData] = useState<any>({});

  const [showNewRow, setShowNewRow] = useState(false);


  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const { data, isLoading, isError } = useGetRoomDetailsOrderMaterials(projectId!, roomKey!);
  const { mutateAsync: updateRoom } = useUpdateRoomMaterials();
  const { mutateAsync: deleteItem } = useDeleteRoomMaterialItem();



  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load materials</p>;

  const items = data || [];

  const handleChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = editData;
      console.log("payload", payload)
      await updateRoom({
        projectId: projectId!,
        roomKey,
        updates: [payload],
      });
      toast({ title: "Saved", description: "Item updated." });
      setEditingIndex(null);
      setEditData({});
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed", variant: "destructive" });
    }
  };


  const handleAddNew = async () => {
    try {
      const payload = newItemData;
      console.log("payload", payload)
      await updateRoom({
        projectId: projectId!,
        roomKey,
        updates: [payload],
      });
      toast({ title: "Saved", description: "Item updated." });
      setEditingIndex(null);
      setEditData({});
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed", variant: "destructive" });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem({ projectId: projectId!, roomKey, itemId });
      toast({ title: "Deleted", description: "Item removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed", variant: "destructive" });
    }
  };


  const carpentryDummyData: any = [
    {
      material: "Plywood",
      brandName: "CenturyPly",
      specification: "BWR Grade, 18mm",
      quantity: 15,
      unit: "nos",
      remarks: "Use for base cabinets"
    },
    {
      material: "MDF Board",
      brandName: "Greenpanel",
      specification: "Pre-laminated, 12mm",
      quantity: 10,
      unit: "nos",
      remarks: "For wardrobes inside partition"
    },
    {
      material: "Laminates",
      brandName: "Merino",
      specification: "Glossy finish, 1mm",
      quantity: 20,
      unit: "sheets",
      remarks: "Apply on wardrobe exteriors"
    },
    {
      material: "Edge Banding",
      brandName: "Rehau",
      specification: "0.8mm matching edge band",
      quantity: 50,
      unit: "meters",
      remarks: "Match laminate color"
    },
    {
      material: "Drawer Channels",
      brandName: "Hettich",
      specification: "Soft-close, 18-inch",
      quantity: 6,
      unit: "pairs",
      remarks: "Use for kitchen drawers"
    },
    {
      material: "Handles",
      brandName: "Hafele",
      specification: "Aluminium, 6-inch",
      quantity: 12,
      unit: "pcs",
      remarks: "Matte black finish preferred"
    },
    {
      material: "Wood Screws",
      brandName: "Anchor",
      specification: "Steel, 1.5 inch",
      quantity: 200,
      unit: "pcs",
      remarks: "For panel fixing"
    },
    {
      material: "Fevicol",
      brandName: "Pidilite",
      specification: "MR Grade Adhesive, 5kg",
      quantity: 2,
      unit: "tins",
      remarks: "Use for board bonding"
    },
  ]
  return (
    <div className="mt-4">
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-blue-800 capitalize ">{roomKey}</h2>

        <div className=" py-2 px-6 flex gap-2">
          {/* {!showNewRow && <Button onClick={() => setShowNewRow(() => (true))}> */}
          { <Button onClick={() => setShowNewRow(() => (true))}>
             Add Item
          </Button>}

        <Button variant="primary" className="h-10" onClick={() => navigate(`/projectdetails/${projectId}/ordermaterial`)}>
          Go Back
        </Button>
        </div>
      </div>

      <div className="!min-h-[85vh] rounded-lg ">
        <div className="flex justify-around items-center px-6 py-3 bg-blue-100 text-blue-800 text-sm font-semibold">
          {requiredFieldsByRoomOrderMaterials[roomKey]?.map((field, idx) => (
            <div key={idx} className="text-center text-xs font-medium uppercase tracking-wider">{field}</div>
          ))}
          <div className="text-center text-xs font-medium uppercase tracking-wider">Actions</div>
        </div>

        <div className="text-sm text-blue-900 divide-y  !h-[75vh] overflow-y-auto divide-blue-100">
          {/* {showAddRow && (
            <div className="flex justify-around items-center px-6 py-3 gap-2 bg-blue-50">
              {requiredFieldsByRoomOrderMaterials[roomKey]?.map((field, i) => {
                const isBrandField = field === "brandName" && predefinedOptionsRooms.brandName[roomKey];
                const isFabricField = field === "fabric" && roomKey === "upholsteryCurtains";

                if (isBrandField || isFabricField) {
                  const options = isBrandField
                    ? predefinedOptionsRooms.brandName[roomKey]
                    : predefinedOptionsRooms.fabric[roomKey];

                  return (
                    <div key={i} className="text-center min-w-[120px]">
                      <Select
                        value={newItemData[field] || ""}
                        onValueChange={(val) =>
                          setNewItemData((prev: any) => ({ ...prev, [field]: val }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            selectedValue={newItemData[field]}
                            placeholder={`Select ${field}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((opt: string) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }

                return (
                  <div key={i} className="text-center min-w-[120px]">
                    <Input
                      className="text-xs text-center"
                      placeholder={field}
                      value={newItemData[field] || ""}
                      onChange={(e) =>
                        setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
                      }
                    />
                  </div>
                );
              })}

              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    handleAddNew(); // ⬅ you write this handler
                    setShowAddRow(false);
                  }}
                >
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddRow(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )} */}
          {!showNewRow && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50">
              <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700">No {roomKey.replace(/([A-Z])/g, ' $1')} Items</h3>
              <p className="text-sm text-gray-500 mb-4">Add your first {roomKey.replace(/([A-Z])/g, ' $1').toLowerCase()} item to start tracking</p>
              <button
                onClick={() => setShowNewRow(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium"
              >
                Add {roomKey.replace(/([A-Z])/g, ' $1')} Item
              </button>
            </div>
          )
            :
            <>
              <div>
                {items?.map((item: any, index: number) => (
                  // {carpentryDummyData?.map((item: any, index: number) => (

                  <div
                    key={item._id}
                    className="grid grid-cols-7 px-6  py-3 gap-2 border-b-1 border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {requiredFieldsByRoomOrderMaterials[roomKey].map((field, i) => {
                      const isBrandField = field === "brandName" && predefinedOptionsRooms.brandName[roomKey];
                      const isFabricField = field === "fabric" && roomKey === "upholsteryCurtains";

                      return (
                        <div
                          key={i}
                          className="text-center px-6 py-3 gap-4 hover:bg-gray-50 transition-colors text-sm min-w-[120px]"
                        >
                          {editingIndex === index ? (
                            isBrandField || isFabricField ? (
                              <Select
                                value={editData[field] || ""}
                                onValueChange={(val) => handleChange(field, val)}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    selectedValue={editData[field]}
                                    placeholder={`Select ${field}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {(isBrandField
                                    ? predefinedOptionsRooms.brandName[roomKey]
                                    : predefinedOptionsRooms.fabric[roomKey]
                                  ).map((opt: string) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                className="text-xs"
                                value={editData[field] || ""}
                                onChange={(e) => handleChange(field, e.target.value)}
                              />
                            )
                          ) : (
                            item[field] || "-"
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-center gap-2 items-center">
                      {editingIndex === index ? (
                        <>
                          <Button size="sm" onClick={handleSave}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>Cancel</Button>
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
                ))
                }


                {/* 🆕 Input Row for New Item */}

                {showNewRow && (
                  <div className="flex justify-around items-center px-6 py-3 gap-2 bg-white mt-2">
                    {requiredFieldsByRoomOrderMaterials[roomKey]?.map((field, i) => {
                      const isBrandField = field === "brandName" && predefinedOptionsRooms.brandName[roomKey];
                      const isFabricField = field === "fabric" && roomKey === "upholsteryCurtains";

                      if (isBrandField || isFabricField) {
                        const options = isBrandField
                          ? predefinedOptionsRooms.brandName[roomKey]
                          : predefinedOptionsRooms.fabric[roomKey];

                        return (
                          <div key={i} className="text-center min-w-[120px]">
                            <Select
                              // className={}
                              // value={}
                              onValueChange={(val) =>
                                setNewItemData((prev: any) => ({ ...prev, [field]: val }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  selectedValue={newItemData[field]}
                                  placeholder={`Select ${field}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {options.map((opt: any) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }

                      return (
                        <div key={i} className="text-center min-w-[120px]">
                          <Input
                            className="text-xs text-center"
                            placeholder={field}
                            value={newItemData[field] || ""}
                            onChange={(e) =>
                              setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
                            }
                          />
                        </div>
                      );
                    })}

                    <div className="space-x-2 ">
                      <Button onClick={handleAddNew}>
                        ✅ Add
                      </Button>
                      <Button onClick={() => setShowNewRow(() => (false))}>
                        {/* <i className="fas fa-xmark"></i> */}
                        cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          }

        </div>
      </div>
    </div>
  );
};

export default OrderMaterialRoomDetails;
