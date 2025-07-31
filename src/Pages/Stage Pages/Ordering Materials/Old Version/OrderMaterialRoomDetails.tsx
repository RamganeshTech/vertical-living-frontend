// import { useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "../../../../utils/toast";
// import { useGetRoomDetailsOrderMaterials, useUpdateRoomMaterials, useDeleteRoomMaterialItem, useAddRoomMaterialItem } from "../../../../apiList/Stage Api/orderingMaterialApi";
// import { Input } from "../../../../components/ui/Input";
// import { Button } from "../../../../components/ui/Button";
// import { brandNamesByRoomKey, predefinedOptionsRooms, requiredFieldsByRoomOrderMaterials } from "../../../../constants/constants";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
// import RoomDetailsLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/RoomDetailLoading";
// import { useBrandsByCategory } from "../../../../apiList/Util Api/utilApi";

// // const carpentryDummyData: any = [
// //   {
// //     material: "Plywood",
// //     brandName: "CenturyPly",
// //     specification: "BWR Grade, 18mm",
// //     quantity: 15,
// //     unit: "nos",
// //     remarks: "Use for base cabinets"
// //   },
// //   {
// //     material: "MDF Board",
// //     brandName: "Greenpanel",
// //     specification: "Pre-laminated, 12mm",
// //     quantity: 10,
// //     unit: "nos",
// //     remarks: "For wardrobes inside partition"
// //   },
// //   {
// //     material: "Laminates",
// //     brandName: "Merino",
// //     specification: "Glossy finish, 1mm",
// //     quantity: 20,
// //     unit: "sheets",
// //     remarks: "Apply on wardrobe exteriors"
// //   },
// //   {
// //     material: "Edge Banding",
// //     brandName: "Rehau",
// //     specification: "0.8mm matching edge band",
// //     quantity: 50,
// //     unit: "meters",
// //     remarks: "Match laminate color"
// //   },
// //   {
// //     material: "Drawer Channels",
// //     brandName: "Hettich",
// //     specification: "Soft-close, 18-inch",
// //     quantity: 6,
// //     unit: "pairs",
// //     remarks: "Use for kitchen drawers"
// //   },
// //   {
// //     material: "Handles",
// //     brandName: "Hafele",
// //     specification: "Aluminium, 6-inch",
// //     quantity: 12,
// //     unit: "pcs",
// //     remarks: "Matte black finish preferred"
// //   },
// //   {
// //     material: "Wood Screws",
// //     brandName: "Anchor",
// //     specification: "Steel, 1.5 inch",
// //     quantity: 200,
// //     unit: "pcs",
// //     remarks: "For panel fixing"
// //   },
// //   {
// //     material: "Fevicol",
// //     brandName: "Pidilite",
// //     specification: "MR Grade Adhesive, 5kg",
// //     quantity: 2,
// //     unit: "tins",
// //     remarks: "Use for board bonding"
// //   },
// // ]

// const OrderMaterialRoomDetails = () => {
//   const { projectId, roomKey, organizationId } = useParams();
//   const navigate = useNavigate();


//   if (!roomKey) return;

//   const [newItemData, setNewItemData] = useState<any>({});

//   const [showNewRow, setShowNewRow] = useState(false);


//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [editData, setEditData] = useState<any>({});

//   const { data, isLoading, isError, refetch, error } = useGetRoomDetailsOrderMaterials(projectId!, roomKey!);

//   const { mutateAsync: addRoom, isPending: addPending } = useAddRoomMaterialItem();
//   const { mutateAsync: updateRoom, isPending: updatePending } = useUpdateRoomMaterials();
//   const { mutateAsync: deleteItem, isPending: deletePending } = useDeleteRoomMaterialItem();


//   // ai routes electricalFittings, ceramicSanitaryware, upholsteryCurtains, falseCeilingMaterials
//   const { data: brands } = useBrandsByCategory(roomKey);

//   if (isLoading) return <RoomDetailsLoading />;
//   if (isError) return <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//     <div className="text-red-600 font-semibold mb-2">
//       ⚠️ Error Occurred
//     </div>
//     <p className="text-red-500 text-sm mb-4">
//       {(error as any)?.response?.data?.message || "Failed to load data"}
//     </p>
//     <Button
//       onClick={() => refetch()}
//       className="bg-red-600 text-white px-4 py-2"
//     >
//       Retry
//     </Button>
//   </div>;

//   const items = data || [];

//   const handleChange = (field: string, value: any) => {
//     setEditData((prev: any) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async (itemId: string) => {
//     try {

//       // Get required fields for the room type
//       const requiredFields = requiredFieldsByRoomOrderMaterials[roomKey];

//       if (!requiredFields || requiredFields.length === 0) {
//         throw new Error("Invalid room type or no fields defined.");
//       }

//       // Validate: first field must be filled
//       const firstFieldKey = requiredFields[0];
//       const firstFieldValue = editData[firstFieldKey];

//       if (!firstFieldValue || firstFieldValue.toString().trim() === "") {
//         throw new Error(`The field "${firstFieldKey}" is required.`);
//       }

//       // Optionally: you can enforce at least one non-empty field overall
//       const isAllEmpty = Object.values(editData).every(
//         (val) => !val || val.toString().trim() === ""
//       );

//       if (isAllEmpty) {
//         throw new Error("At least one field must be filled.");
//       }


//       const payload = editData;
//       await updateRoom({
//         itemId,
//         projectId: projectId!,
//         roomKey,
//         updates: [payload],
//       });
//       toast({ title: "Success", description: "Item updated." });
//       setEditingIndex(null);
//       setEditData({});
//       setShowNewRow(false)
//       refetch()
//     } catch (err: any) {
//       toast({ title: "Error", description: err?.message || "Failed", variant: "destructive" });
//     }
//   };


//   const handleAddNew = async () => {
//     try {


//       // Get required fields for the room type
//       const requiredFields = requiredFieldsByRoomOrderMaterials[roomKey];

//       if (!requiredFields || requiredFields.length === 0) {
//         throw new Error("Invalid room type or no fields defined.");
//       }

//       // Validate: first field must be filled
//       const firstFieldKey = requiredFields[0];
//       const firstFieldValue = newItemData[firstFieldKey];

//       if (!firstFieldValue || firstFieldValue.toString().trim() === "") {
//         throw new Error(`The field "${firstFieldKey}" is required.`);
//       }

//       // Optionally: you can enforce at least one non-empty field overall
//       const isAllEmpty = Object.values(newItemData).every(
//         (val) => !val || val.toString().trim() === ""
//       );

//       if (isAllEmpty) {
//         throw new Error("At least one field must be filled.");
//       }

//       const firstFieldExists = items?.some(
//         (item: any) =>
//           item[firstFieldKey]?.toString().trim().toLowerCase() ===
//           firstFieldValue.toString().trim().toLowerCase()
//       );

//       if (firstFieldExists) {
//         throw new Error(`"${firstFieldValue}" already exists. Please use a unique value.`);
//       }

//       const payload = newItemData;
//       await addRoom({
//         projectId: projectId!,
//         roomKey,
//         newItem: payload,
//       });
//       toast({ title: "Success", description: "Item added." });
//       setNewItemData({})
//       setShowNewRow(false)
//       refetch()
//     } catch (err: any) {
//       toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed", variant: "destructive" });
//     }
//   };

//   const handleDelete = async (itemId: string) => {
//     try {
//       await deleteItem({ projectId: projectId!, roomKey, itemId });
//       toast({ title: "Deleted", description: "Item removed" });
//       refetch()

//     } catch (err: any) {
//       toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to delete", variant: "destructive" });
//     }
//   };



//   return (
//     <div className="w-full h-full">
//       <div className="w-full flex justify-between items-center mb-2">
//         <h2 className="text-xl font-bold text-blue-800 capitalize ">{roomKey}</h2>

//         <div className=" px-6 flex gap-2">
//           {/* {!showNewRow && <Button onClick={() => setShowNewRow(() => (true))}> */}
//           {<Button onClick={() => setShowNewRow(() => (true))}>
//             Add Item
//           </Button>}

//           <Button variant="primary" className="h-10" onClick={() => navigate(`/${organizationId}/projectdetails/${projectId}/ordermaterial`)}>
//             Go Back
//           </Button>
//         </div>
//       </div>

//       <div className="w-full !min-h-[85vh] rounded-lg ">
//         <div className="overflow-x-auto custom-scrollbar min-w-full flex-grow min-h-0">
//           {/* <div className="min-w-[700px] w-full flex flex-col border-2 border-gray-100 rounded-lg"> */}

//           <div
//             className=" w-full flex flex-col border-2 border-gray-100 rounded-lg"
//             style={{
//               minWidth: `${(requiredFieldsByRoomOrderMaterials[roomKey]?.length + 1) * 190
//                 }px`,
//             }}
//           >


//             {/* <div className="flex justify-around items-center px-6 py-3 bg-blue-100 text-blue-800 text-sm font-semibold">
//               {requiredFieldsByRoomOrderMaterials[roomKey]?.map((field, idx) => (
//                 <div key={idx} className="text-center text-xs font-medium uppercase tracking-wider">{field}</div>
//               ))}
//               <div className="text-center text-xs font-medium uppercase tracking-wider">Actions</div>
//             </div> */}


//             <div
//               className={`grid items-center px-6 py-3 bg-blue-100 text-blue-800 text-sm font-semibold`}
//               style={{
//                 gridTemplateColumns: `repeat(${requiredFieldsByRoomOrderMaterials[roomKey].length + 1
//                   }, minmax(120px, 1fr))`,
//               }}
//             >
//               {requiredFieldsByRoomOrderMaterials[roomKey]?.map((field, idx) => (
//                 <div
//                   key={idx}
//                   className="text-center text-xs font-medium uppercase tracking-wider"
//                 >
//                   {field}
//                 </div>
//               ))}
//               <div className="text-center text-xs font-medium uppercase tracking-wider">Actions</div>
//             </div>


//             <div className="text-sm text-blue-900 divide-y  !h-[75vh] overflow-y-auto divide-blue-100">
//               {!showNewRow && items.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50">
//                   <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
//                   <h3 className="text-lg font-semibold text-gray-700">No {roomKey.replace(/([A-Z])/g, ' $1')} Items</h3>
//                   <p className="text-sm text-gray-500 mb-4">Add your first {roomKey.replace(/([A-Z])/g, ' $1').toLowerCase()} item to start tracking</p>
//                   <button
//                     onClick={() => setShowNewRow(true)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium"
//                   >
//                     Add {roomKey.replace(/([A-Z])/g, ' $1')} Item
//                   </button>
//                 </div>
//               )
//                 :
//                 <>
//                   <div>
//                     {items?.map((item: any, index: number) => (
//                       // {carpentryDummyData?.map((item: any, index: number) => (

//                       // <div
//                       //   key={item._id}
//                       //   className="grid grid-cols-7 border text-center px-6  py-3 gap-2 border-b-1 border-gray-200 hover:bg-gray-50 transition-colors"
//                       // >

//                       <div
//                         key={item._id}
//                         className={`grid border text-center px-6 py-3 gap-2 border-b border-gray-200 hover:bg-gray-50 transition-colors`}
//                         style={{
//                           gridTemplateColumns: `repeat(${requiredFieldsByRoomOrderMaterials[roomKey].length + 1
//                             }, minmax(120px, 1fr))`,
//                         }}
//                       >
//                         {requiredFieldsByRoomOrderMaterials[roomKey].map((field, i) => {
//                           const isBrandField = field === "brandName" && predefinedOptionsRooms.brandName[roomKey];
//                           const isFabricField = field === "fabric" && roomKey === "upholsteryCurtains";

//                           return (
//                             <div
//                               key={i}
//                               className="text-center px-6 py-3 gap-4 hover:bg-gray-50 transition-colors text-sm min-w-[120px]"
//                             >
//                               {editingIndex === index ? (
//                                 isBrandField || isFabricField ? (
//                                   <Select
//                                     value={editData[field] || ""}
//                                     onValueChange={(val) => handleChange(field, val)}
//                                   >
//                                     <SelectTrigger>
//                                       <SelectValue
//                                         selectedValue={editData[field]}
//                                         placeholder={`Select ${field === "brandName" ? "brand" : "fabric"}`}
//                                       />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       {/* {(isBrandField
//                                         // ? predefinedOptionsRooms.brandName[roomKey]
//                                         ? brandNamesByRoomKey[roomKey]
//                                         : predefinedOptionsRooms.fabric[roomKey]
//                                       ).map((opt: string) => (
//                                         <SelectItem key={opt} value={opt}>
//                                           {opt}
//                                         </SelectItem>
//                                       ))} */}


//                                       {brands?.map((brand: string) => (
//                                         <SelectItem key={brand} value={brand}>
//                                           {brand}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 ) : (
//                                   <Input
//                                     className="text-xs"
//                                     value={editData[field] || ""}
//                                     onChange={(e) => handleChange(field, e.target.value)}
//                                   />
//                                 )
//                               ) : (
//                                 item[field] || "-"
//                               )}
//                             </div>
//                           );
//                         })}
//                         <div className="flex justify-center gap-2 items-center">
//                           {editingIndex === index ? (
//                             <>
//                               <Button size="sm" isLoading={updatePending} onClick={() => handleSave(item._id)}><i className="fas fa-check"></i></Button>
//                               <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}><i className="fas fa-xmark text-red-600"></i></Button>
//                             </>
//                           ) : (
//                             <>
//                               <Button variant="primary">
//                                 <i
//                                   className="fas fa-pen"
//                                   onClick={() => {
//                                     setEditData(item);
//                                     setEditingIndex(index);
//                                   }}
//                                 />
//                               </Button>
//                               <Button isLoading={deletePending} variant="ghost">
//                                 <i
//                                   className="fas fa-trash text-red-500 cursor-pointer"
//                                   onClick={() => handleDelete(item._id)}
//                                 />
//                               </Button>

//                             </>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                     }


//                     {/* 🆕 Input Row for New Item */}

//                     {showNewRow && (
//                       // <div className="flex justify-around items-center px-6 py-3 gap-2 bg-white mt-2">
//                       <div
//                         className={`grid items-center px-6 py-3 gap-2 bg-white mt-2`}
//                         style={{
//                           gridTemplateColumns: `repeat(${requiredFieldsByRoomOrderMaterials[roomKey].length + 1
//                             }, minmax(120px, 1fr))`,
//                         }}
//                       >
//                         {requiredFieldsByRoomOrderMaterials[roomKey]?.map((field, i) => {
//                           const isBrandField = field === "brandName" && predefinedOptionsRooms.brandName[roomKey];
//                           const isFabricField = field === "fabric" && roomKey === "upholsteryCurtains";

//                           if (isBrandField || isFabricField) {
//                             const options = isBrandField
//                               // ? predefinedOptionsRooms.brandName[roomKey]
//                               ? brandNamesByRoomKey[roomKey]
//                               : predefinedOptionsRooms.fabric[roomKey];

//                             return (
//                               <div key={i} className="text-center min-w-[120px]">
//                                 <Select
//                                   // className={}
//                                   // value={}
//                                   onValueChange={(val) =>
//                                     setNewItemData((prev: any) => ({ ...prev, [field]: val }))
//                                   }
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue
//                                       selectedValue={newItemData[field]}
//                                       placeholder={`Select ${field === "brandName" ? "brand" : "fabric"}`}
//                                     />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {options.map((opt: any) => (
//                                       <SelectItem key={opt} value={opt}>
//                                         {opt}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             );
//                           }

//                           return (
//                             <div key={i} className="text-center min-w-[120px]">
//                               <Input
//                                 className="text-xs text-center"
//                                 placeholder={field}
//                                 value={newItemData[field] || ""}
//                                 onChange={(e) =>
//                                   setNewItemData((prev: any) => ({ ...prev, [field]: e.target.value }))
//                                 }
//                               />
//                             </div>
//                           );
//                         })}

//                         <div className="flex justify-center gap-2">
//                           <Button isLoading={addPending} onClick={handleAddNew}>
//                             <i className="fas fa-check"></i>
//                           </Button>
//                           <Button onClick={() => setShowNewRow(() => (false))}>
//                             {/* <i className="fas fa-xmark"></i> */}
//                             <i className="fas fa-xmark"></i>
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               }

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderMaterialRoomDetails;
