// // // MaterialArrivalPublic.tsx
// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "../../../utils/toast";
// import {
//   useGetPublicMaterialArrival,
//   useUpdateMaterialArrivalRoomItem,
//   useDeleteMaterialArrivalItem,
// } from "../../../apiList/Stage Api/materialArrivalApi";
// import { Input } from "../../../components/ui/Input";
// import { Button } from "../../../components/ui/Button";
// import { requiredFieldsByRoomArrival } from "../../../constants/constants";
// import { Footer, Header } from "../Ordering Materials/Old Version/PublicOrderMaterial";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import { Textarea } from "../../../components/ui/TextArea";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// export default function MaterialArrivalPublic() {
//   const { projectId, token } = useParams();
//   const { data, isLoading, isError, error, refetch } = useGetPublicMaterialArrival(projectId!, token!);

//   if (isLoading) return <MaterialOverviewLoading />;
//   if (isError || !data) return <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
//     <div className="text-red-600 font-semibold mb-2">
//       ⚠️ Error Occurred
//     </div>
//     <p className="text-red-500 text-sm mb-4">
//       {(error as any)?.response?.data?.message ||
//         (error as any)?.message ||
//         "Failed to load cost estimation data"}
//     </p>
//     <Button
//       onClick={() => refetch()}
//       className="bg-red-600 text-white px-4 py-2"
//     >
//       Retry
//     </Button>
//   </div>;

//   const rooms = Object.entries(data.materialArrivalList || {});

//   return (
//     <div className="min-h-screen  bg-gray-50  space-y-6">
//       <Header />
//       <main className="flex-1 w-full px-4 py-6 space-y-6 mx-auto sm:max-w-full md:max-w-[95%] lg:max-w-[85%] xl:max-w-[90%]">

//         <h1 className="text-2xl font-semibold">Arrived Materials</h1>

//         {/* Shop + Site */}

//         <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <h2 className="text-lg font-semibold text-blue-700 mb-2">Shop Delivery Details</h2>
//           {isLoading ? (
//             <Skeleton />
//           ) : isError || !data?.shopDetails ? (
//             <p className="text-red-500">Failed to load shop details</p>
//           ) : (
//             <div className="grid sm:grid-cols-2 gap-4 text-sm">
//               {Object.entries(data.shopDetails).map(([key, value]) => (
//                 <div key={key} className="flex flex-col">
//                   <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                   <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
//                     ? value
//                     : typeof value === "boolean"
//                       ? value ? "✔️" : "❌"
//                       : "-"}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Site Details */}
//         <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <h2 className="text-lg font-semibold text-blue-700 mb-2">Site Location Details</h2>
//           {isLoading ? (
//             <Skeleton />
//           ) : isError || !data?.deliveryLocationDetails ? (
//             <p className="text-red-500">Failed to load site details</p>
//           ) : (
//             <div className="grid sm:grid-cols-2 gap-4 text-sm">
//               {Object.entries(data.deliveryLocationDetails).map(([key, value]) => (
//                 <div key={key} className="flex flex-col">
//                   <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                   <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
//                     ? value
//                     : typeof value === "boolean"
//                       ? value ? "✔️" : "❌"
//                       : "-"}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Room Accordions */}
//         <section className="max-w-full mx-auto space-y-4">
//           <h2 className="text-lg font-bold text-blue-800 mb-4">Material Rooms</h2>

//           {rooms.map(([rk, items]) => (
//             <RoomSection
//               key={rk}
//               projectId={projectId!}
//               token={token!}
//               roomKey={rk}
//               items={items as any[]}
//               refetch={refetch}
//             />
//           ))}
//         </section>

//       </main>

//       <Footer />
//     </div>
//   );
// }


// const RoomSection = ({
//   projectId,
//   roomKey,
//   items,
//   refetch,
// }: {
//   projectId: string;
//   token: string;
//   roomKey: string;
//   items: any[];
//   refetch: () => Promise<any>;
// }) => {
//   const updateItem = useUpdateMaterialArrivalRoomItem();
//   const deleteItem = useDeleteMaterialArrivalItem();
//   const [open, setOpen] = useState(false);
//   const [showAdd, setShowAdd] = useState(false);
//   const [newData, setNewData] = useState<any>({});
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [editData, setEditData] = useState<any>({});
//   const [editFile, setEditFile] = useState<File | null>(null);

//   const fields = requiredFieldsByRoomArrival[roomKey];

//   const handleAdd = async () => {
//     try {

//       if (!fields || fields.length === 0) {
//         throw new Error("Invalid room type or no fields defined.");
//       }

//       // Validate: first field must be filled
//       const firstFieldKey = fields[0];
//       const firstFieldValue = newData[firstFieldKey];

//       if (!firstFieldValue || firstFieldValue.toString().trim() === "") {
//         throw new Error(`The field "${firstFieldKey}" is required.`);
//       }

//       // Optionally: you can enforce at least one non-empty field overall
//       const isAllEmpty = Object.values(newData).every(
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

//       const fd = new FormData();
//       fd.append("itemData", JSON.stringify(newData));
//       if (selectedFile) fd.append("upload", selectedFile);
//       await updateItem.mutateAsync({ projectId, roomKey, formData: fd });
//       toast({ title: "Added", description: "New item saved." });
//       setShowAdd(false);
//       setNewData({});
//       setSelectedFile(null);
//       refetch();
//     } catch (e: any) {
//       toast({ title: "Error", description: e.message, variant: "destructive" });
//     }
//   };

//   const handleSave = async () => {
//     try {


//       if (!fields || fields.length === 0) {
//         throw new Error("Invalid room type or no fields defined.");
//       }

//       // Validate: first field must be filled
//       const firstFieldKey = fields[0];
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


//       const fd = new FormData();
//       fd.append("itemData", JSON.stringify(editData));
//       if (editFile) fd.append("upload", editFile);
//       await updateItem.mutateAsync({ projectId, roomKey, formData: fd });
//       toast({ title: "Updated", description: "Item saved." });
//       refetch();
//       setEditIndex(null);
//       setEditData({});
//       setEditFile(null);
//     } catch (e: any) {
//       toast({ title: "Error", description: e.message, variant: "destructive" });
//     }
//   };

//   const handleDelete = async (itemId: string) => {
//     try {
//       await deleteItem.mutateAsync({ projectId, roomKey, itemId });
//       toast({ title: "Deleted", description: "Item removed." });
//       refetch();
//     } catch (e: any) {
//       toast({ title: "Error", description: e.message, variant: "destructive" });
//     }
//   };

//   return (
//     <div className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm">
//       <button
//         className="w-full px-4 py-3 text-left flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-all"
//         onClick={() => setOpen(!open)}
//       >
//         <span className="capitalize font-semibold text-blue-800">{roomKey?.replace(/([A-Z])/g, " $1")}</span>
//         <i className={`fas fa-chevron-${open ? "up" : "down"}`}></i>
//       </button>

//       <div className={`transition-max-h duration-300 ease-out overflow-hidden ${open ? "max-h-[500px] p-4" : "max-h-0 p-0"}`}>
//         {fields && (
//           <div className="overflow-x-auto">
//             <div className="min-w-[1200px] space-y-2">
//               {/* Header */}
//               <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] bg-blue-50 text-xs sm:text-sm font-semibold text-blue-900 border-b border-blue-200 py-2 px-2 rounded-t mb-2">
//                 {fields.map((field) => (
//                   <div key={field} className="text-center capitalize truncate">
//                     {field === "image" ? "Upload" : field === "verifiedByAccountant" ? "Verified" : field}
//                   </div>
//                 ))}
//                 <div className="text-center truncate">Actions</div>
//               </div>

//               {/* Existing Items */}
//               {items?.length === 0 && !showAdd ? (
//                 <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-md shadow-inner">
//                   <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
//                   <h3 className="text-lg font-semibold text-gray-700">No Items Found</h3>
//                   <p className="text-sm text-gray-500 mb-4">Start by adding your first item to this room.</p>
//                   <Button
//                     onClick={() => setShowAdd(true)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded"
//                   >
//                     <i className="fas fa-plus mr-2"></i> Add One
//                   </Button>
//                 </div>
//               ) : (
//                 items?.map((item, idx) => (
//                   <div key={idx} className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center gap-2 py-2 border-b border-gray-100 hover:bg-gray-50 min-h-[60px]">
//                     {fields.map((f) => {
//                       if (f === "image") {
//                         return editIndex === idx ? (
//                           <Input
//                             key={f}
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setEditFile(e.target.files?.[0] || null)}
//                             className="w-full text-sm"
//                           />
//                         ) : item.upload?.url ? (
//                           <img
//                             src={item.upload.url}
//                             alt=""
//                             className="w-12 h-12 object-cover rounded mx-auto"
//                           />
//                         ) : (
//                           <div className="text-center">No image</div>
//                         );
//                       }
//                       if (f === "verifiedByAccountant") {
//                         return editIndex === idx ? (
//                           <Input
//                             key={f}
//                             type="checkbox"
//                             className="text-center"
//                             checked={!!editData.verifiedByAccountant}
//                             onChange={(e) =>
//                               setEditData((p: any) => ({ ...p, verifiedByAccountant: e.target.checked }))
//                             }
//                           />
//                         ) : item?.verifiedByAccountant ? (
//                           <span className="text-center"><i className="fas fa-check text-green-600 text-lg"></i></span>
//                         ) : (
//                           <span className="text-center"><i className="fas fa-xmark text-red-500 text-lg"></i></span>
//                         );
//                       }
//                       if (f === "remarks") {
//                         return editIndex === idx ? (
//                           <Textarea
//                             key={f}
//                             value={editData[f] || ""}
//                             className="text-center w-full text-sm"
//                             onChange={(e) =>
//                               setEditData((p: any) => ({ ...p, remarks: e.target.value }))
//                             }
//                           />
//                         ) : (
//                           <div className="w-full text-center overflow-x-auto max-h-[70px] overflow-y-auto custom-scrollbar">
//                             {item[f] || "N/A"}
//                           </div>
//                         );
//                       }
//                       return editIndex === idx ? (
//                         <Input
//                           key={f}
//                           value={editData[f] || ""}
//                           onChange={(e) =>
//                             setEditData((p: any) => ({ ...p, [f]: e.target.value }))
//                           }
//                           className="w-full text-sm"
//                         />
//                       ) : (
//                         <div className="text-center truncate">{item[f] ?? "-"}</div>
//                       );
//                     })}
//                     <div className="flex gap-2 justify-center">
//                       {editIndex === idx ? (
//                         <>
//                           <Button size="sm" onClick={handleSave}>
//                             Save
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => setEditIndex(null)}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => {
//                               setEditIndex(idx);
//                               setEditData(item);
//                             }}
//                           >
//                             <i className="fas fa-pen"></i>
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => handleDelete(item._id)}
//                           >
//                             <i className="fas fa-trash text-red-500"></i>
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//               {!showAdd && items.length > 0 && (
//                 <div className="pt-3 text-center">
//                   <Button onClick={() => setShowAdd(true)}>
//                     ➕ Add Item
//                   </Button>
//                 </div>
//               )}
//               {showAdd && (
//                 <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] items-center gap-2 bg-white p-2 rounded mb-4">
//                   {fields.map((f) => {
//                     if (f === "image")
//                       return (
//                         <Input
//                           key={f}
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                           className="border-2 w-full text-sm"
//                         />
//                       );
//                     if (f === "verifiedByAccountant")
//                       return (
//                         <Input
//                           key={f}
//                           type="checkbox"
//                           className="text-center w-full text-sm"
//                           checked={!!newData.verifiedByAccountant}
//                           onChange={(e) =>
//                             setNewData((p: any) => ({ ...p, verifiedByAccountant: e.target.checked }))
//                           }
//                         />
//                       );
//                     return (
//                       <Input
//                         key={f}
//                         placeholder={f}
//                         value={newData[f] || ""}
//                         onChange={(e) =>
//                           setNewData((p: any) => ({ ...p, [f]: e.target.value }))
//                         }
//                         className="w-full text-sm"
//                       />
//                     );
//                   })}
//                   <div className="flex gap-2 justify-center">
//                     <Button size="sm" className="h-10" onClick={handleAdd}>
//                       Add
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="secondary"
//                       onClick={() => setShowAdd(false)}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>

//   );
// };

// import  { useState } from "react";
// import { useParams } from "react-router-dom";

// import { Input } from "../../../components/ui/Input";
// import { Button } from "../../../components/ui/Button";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem
// } from "../../../components/ui/Select";
// import { toast } from "../../../utils/toast";
// import { useGetPublicMaterialArrivalNew, useUpdateMaterialArrivalItemNew } from "../../../apiList/Stage Api/materialArrivalNewApi";

// const PublicMaterialArrival = () => {
//   const { projectId, token } = useParams();
//   const { data, isLoading, isError } = useGetPublicMaterialArrivalNew(projectId!, token!);
//   const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew();

//   const [quantities, setQuantities] = useState<Record<string, number>>({});
//   const [images, setImages] = useState<Record<string, File | null>>({});

//   const handleQuantityChange = (id: string, value: number) => {
//     setQuantities(prev => ({ ...prev, [id]: value }));
//   };

//   const handleFileChange = (id: string, file: File | null) => {
//     setImages(prev => ({ ...prev, [id]: file }));
//   };

//   const handleUpdate = async (fieldId: string) => {
//     const quantity = quantities[fieldId];
//     const image = images[fieldId];

//     const formData = new FormData();
//     formData.append("quantity", String(quantity ?? 0));
//     if (image) formData.append("upload", image);

//     try {
//       await updateItem({ projectId: projectId!, fieldId, formData });
//       toast({ title: "Success", description: "Updated successfully" });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error.message || "Failed to update",
//         variant: "destructive"
//       });
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div className="text-red-500">Failed to load data</div>;

//   return (
//     <div className="overflow-x-auto w-full">
//       <div className="min-w-[700px] w-full">
//         {/* Header */}
//         <div className="grid grid-cols-5 font-semibold bg-blue-100 text-blue-800 px-4 py-2 rounded-t">
//           <div>Custom ID</div>
//           <div>Quantity</div>
//           <div>Image</div>
//           <div>isVerified</div>
//           <div>Action</div>
//         </div>

//         {/* Rows */}
//         {data?.materialArrivalList?.map((item: any) => (
//           <div key={item._id} className="grid grid-cols-5 items-center border-t px-4 py-2 bg-white">
//             {/* Custom ID */}
//             <div className="truncate">{item.customId || "-"}</div>

//             {/* Quantity dropdown */}
//             <div>
//               <Select
                
//                 onValueChange={(value) => handleQuantityChange(item._id, Number(value))}
//               >
//                 <SelectTrigger className="w-[100px]" selectedValue={item.quantity?.toString()}>
//                   <SelectValue placeholder="Qty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[...Array(21).keys()].map((val) => (
//                     <SelectItem key={val} value={val.toString()}>
//                       {val}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Image field */}
//             <div className="flex flex-col gap-1">
//               {item?.image?.url && (
//                 <a
//                   href={item.image.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-500 underline text-sm"
//                 >
//                   View Image
//                 </a>
//               )}
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange(item._id, e.target.files?.[0] || null)}
//               />
//             </div>

//             {/* Verified field */}
//             <div>
//               {item?.isVerified ? (
//                 <span className="text-green-600 font-medium">Yes</span>
//               ) : (
//                 <span className="text-gray-500">No</span>
//               )}
//             </div>

//             {/* Action */}
//             <div>
//               <Button
//                 size="sm"
//                 isLoading={isPending}
//                 onClick={() => handleUpdate(item._id)}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PublicMaterialArrival;






// "use client"

// import { useState } from "react"
// import { useParams } from "react-router-dom"
// import { Input } from "../../../components/ui/Input"
// import { Button } from "../../../components/ui/Button"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select"
// import { toast } from "../../../utils/toast"
// import {
//   useGetPublicMaterialArrivalNew,
//   useUpdateMaterialArrivalItemNew,
// } from "../../../apiList/Stage Api/materialArrivalNewApi"
// import { NO_IMAGE } from "../../../constants/constants"

// const PublicMaterialArrival = () => {
//   const { projectId, token } = useParams()
//   const { data, isLoading, isError } = useGetPublicMaterialArrivalNew(projectId!, token!)
//   const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew()

//   const [quantities, setQuantities] = useState<Record<string, number>>({})
//   const [images, setImages] = useState<Record<string, File | null>>({})
//   const [showImageModal, setShowImageModal] = useState<string | null>(null)

//   const handleQuantityChange = (id: string, value: number) => {
//     setQuantities((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleFileChange = (id: string, file: File | null) => {
//     setImages((prev) => ({ ...prev, [id]: file }))
//   }

//   const handleUpdate = async (fieldId: string) => {
//     const quantity = quantities[fieldId]
//     const image = images[fieldId]
//     const formData = new FormData()
//     formData.append("quantity", String(quantity ?? 0))
//     if (image) formData.append("upload", image)

//     try {
//       await updateItem({ projectId: projectId!, fieldId, formData })
//       toast({ title: "Success", description: "Updated successfully" })
//       // Clear the form after successful update
//       setQuantities((prev) => ({ ...prev, [fieldId]: 0 }))
//       setImages((prev) => ({ ...prev, [fieldId]: null }))
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error.message || "Failed to update",
//         variant: "destructive",
//       })
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading material data...</p>
//         </div>
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
//           <i className="fa-solid fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
//           <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Data</h2>
//           <p className="text-gray-600">Please check your connection and try again.</p>
//         </div>
//       </div>
//     )
//   }


//   const MaterialList = data?.materialArrivalList

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
//           <div className="flex items-center gap-3 mb-2">
//             <i className="fa-solid fa-clipboard-check text-2xl text-blue-600"></i>
//             <h1 className="text-2xl font-bold text-gray-800">Material Arrival Update</h1>
//           </div>
//           <p className="text-gray-600">Update quantities and upload images for material verification</p>
//         </div>

//         {/* Material List */}
//         <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//           <div className="overflow-x-auto">
//             <div className="min-w-[900px]">
//               {/* Header Row */}
//               <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-blue-50 border-b font-semibold text-blue-900">
//                 <div className="flex items-center gap-2">
//                   <i className="fa-solid fa-hashtag text-blue-500"></i>
//                   Custom ID
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <i className="fa-solid fa-calculator text-blue-500"></i>
//                   Quantity
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <i className="fa-solid fa-image text-blue-500"></i>
//                   Image
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <i className="fa-solid fa-shield-check text-blue-500"></i>
//                   Verified
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <i className="fa-solid fa-save text-blue-500"></i>
//                   Action
//                 </div>
//               </div>

//               {/* Data Rows */}
//               {MaterialList?.map((item: any, index: number) => (
//                 <div
//                   key={item._id}
//                   className={`grid grid-cols-5 gap-4 px-6 py-4 border-b hover:bg-gray-50 transition-colors duration-200 ${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-25"
//                   }`}
//                 >
//                   {/* Custom ID */}
//                   <div className="flex items-center">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
//                         {index + 1}
//                       </div>
//                       <span className="font-medium text-gray-800">{item.customId || "-"}</span>
//                     </div>
//                   </div>

//                   {/* Quantity Dropdown */}
//                   <div className="flex items-center">
//                     <Select onValueChange={(value) => handleQuantityChange(item._id, Number(value))}>
//                       <SelectTrigger className="w-full max-w-[120px]">
//                         <SelectValue placeholder={`Current: ${item.quantity || 0}`} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {[...Array(21).keys()].map((val) => (
//                           <SelectItem key={val} value={val.toString()}>
//                             {val}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Image Field */}
//                   <div className="flex items-center gap-3">
//                     {/* Current Image */}
//                     {item?.image?.url && (
//                       <div className="relative group cursor-pointer" onClick={() => setShowImageModal(item._id)}>
//                         <div className="w-12 h-12 border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
//                           <img
//                             src={item.image.url || NO_IMAGE}
//                             alt="Current"
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                           />
//                         </div>
//                         <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
//                           <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                             <i className="fa-solid fa-expand text-white text-xs"></i>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* File Upload */}
//                     <div className="flex-1">
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(item._id, e.target.files?.[0] || null)}
//                         className="text-sm"
//                       />
//                       {images[item._id] && (
//                         <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                           <i className="fa-solid fa-check"></i>
//                           New image selected
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Verified Status */}
//                   <div className="flex items-center">
//                     <div
//                       className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
//                         item?.isVerified
//                           ? "bg-green-100 text-green-700 border border-green-200"
//                           : "bg-gray-100 text-gray-600 border border-gray-200"
//                       }`}
//                     >
//                       <i className={`fa-solid ${item?.isVerified ? "fa-check-circle" : "fa-clock"} text-xs`}></i>
//                       {item?.isVerified ? "Yes" : "No"}
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   <div className="flex items-center">
//                     <Button
//                       size="sm"
//                       onClick={() => handleUpdate(item._id)}
//                       disabled={isPending}
//                       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
//                     >
//                       {isPending ? (
//                         <i className="fa-solid fa-spinner fa-spin"></i>
//                       ) : (
//                         <i className="fa-solid fa-save"></i>
//                       )}
//                       Save
//                     </Button>
//                   </div>
//                 </div>
//               ))}

//               {/* Empty State */}
//               {!data?.materialArrivalList?.length && (
//                 <div className="p-12 text-center">
//                   <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                     <i className="fa-solid fa-box-open text-3xl text-gray-400"></i>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-600 mb-2">No Materials Found</h3>
//                   <p className="text-gray-500">Material data will appear here once available</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//      {showImageModal && (
//         <div
//           className="fixed inset-0 bg-black/70 bg-opacity-75 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowImageModal(null)}
//         >
//           <div className="relative w-[80vw] h-[80vh] max-w-4xl">
//             <button
//               onClick={() => setShowImageModal(null)}
//               className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
//             >
//               <i className="fa-solid fa-times text-2xl"></i>
//             </button>
//             {(() => {
//               const item = data?.materialArrivalList?.find((item: any) => item._id === showImageModal)
//               return item?.image?.url ? (
//                 <div className="w-full h-full">
//                   <img
//                     src={item.image.url || NO_IMAGE}
//                     alt={item.image.originalName || "Material Image"}
//                     className="w-full h-full object-contain rounded-lg shadow-2xl"
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
//                     <p className="text-sm font-medium">{item.image.originalName || "Material Image"}</p>
//                     <p className="text-xs text-gray-300">Click outside to close</p>
//                   </div>
//                 </div>
//               ) : null
//             })()}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PublicMaterialArrival






"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select"
import { toast } from "../../../utils/toast"
import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants"
import {
  useGetPublicMaterialArrivalNew,
  useUpdateMaterialArrivalItemNew,
} from "../../../apiList/Stage Api/materialArrivalNewApi"

const PublicMaterialArrival = () => {
  const { projectId, token } = useParams()
  const { data, isLoading, isError } = useGetPublicMaterialArrivalNew(projectId!, token!)
  const { mutateAsync: updateItem, isPending } = useUpdateMaterialArrivalItemNew()

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [images, setImages] = useState<Record<string, File | null>>({})
  const [showImageModal, setShowImageModal] = useState<string | null>(null)

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (id: string, file: File | null) => {
    setImages((prev) => ({ ...prev, [id]: file }))
  }

  const handleUpdate = async (fieldId: string) => {
    const quantity = quantities[fieldId]
    const image = images[fieldId]
    const formData = new FormData()
    formData.append("quantity", String(quantity ?? 0))
    if (image) formData.append("upload", image)

    try {
      await updateItem({ projectId: projectId!, fieldId, formData })
      toast({ title: "Success", description: "Updated successfully" })
      // Clear the form after successful update
      setQuantities((prev) => ({ ...prev, [fieldId]: 0 }))
      setImages((prev) => ({ ...prev, [fieldId]: null }))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update",
        variant: "destructive",
      })
    }
  }

  // Calculate statistics
  const totalMaterials = data?.materialArrivalList?.length || 0
  const updatedMaterials =
    data?.materialArrivalList?.filter((item: any) => item.quantity > 0 || item.image)?.length || 0
  const pendingMaterials = totalMaterials - updatedMaterials
  const completionProgress = totalMaterials > 0 ? Math.round((updatedMaterials / totalMaterials) * 100) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto mb-6"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Loading Material Data</h3>
            <p className="text-gray-600">Please wait while we fetch your materials...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md mx-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Connection Failed</h2>
          <p className="text-gray-600 mb-4">
            Unable to load material data. Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
            <i className="fa-solid fa-refresh mr-2"></i>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Company Branding */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
                  alt={`${COMPANY_DETAILS.COMPANY_NAME} Logo`}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {COMPANY_DETAILS.COMPANY_NAME}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">Material Arrival Portal</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-slate-600 to-gray-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                <i className="fa-solid fa-clipboard-check mr-2"></i>
                <span className="hidden sm:inline">Material Update Portal</span>
                <span className="sm:hidden">Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Dashboard */}
        {totalMaterials > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Material Overview</h2>
                    <p className="text-gray-300 text-sm mt-1">Track your material update progress</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{totalMaterials}</div>
                    <div className="text-gray-300 text-sm">Total Items</div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className=" bg-slate-600 bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 bg-opacity-30 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-check text-emerald-300 text-xl"></i>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{updatedMaterials}</div>
                        <div className="text-gray-300 text-sm">Updated</div>
                      </div>
                    </div>
                  </div>

                  <div className=" bg-slate-600 bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-500 bg-opacity-30 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-clock text-amber-300 text-xl"></i>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{pendingMaterials}</div>
                        <div className="text-gray-300 text-sm">Pending</div>
                      </div>
                    </div>
                  </div>

                  <div className=" bg-slate-600 bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-chart-line text-indigo-300 text-xl"></i>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{completionProgress}%</div>
                        <div className="text-gray-300 text-sm">Complete</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>Update Progress</span>
                    <span>{completionProgress}% Complete</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                    <div
                      className="bg-emerald-400 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                      style={{ width: `${completionProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Material List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-slate-600"></i>
                  Material Update List
                </h3>
                <p className="text-gray-600 text-sm mt-1">Update quantities and upload images for verification</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{totalMaterials}</span> items total
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Column Headers */}
              <div className="bg-slate-100 border-b border-gray-200">
                <div className="grid grid-cols-5 gap-4 px-6 py-4 font-semibold text-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-hashtag text-slate-500"></i>
                    <span>Item ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-calculator text-slate-500"></i>
                    <span>Quantity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-image text-slate-500"></i>
                    <span>Image Upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-shield-check text-slate-500"></i>
                    <span>Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-save text-slate-500"></i>
                    <span>Action</span>
                  </div>
                </div>
              </div>

              {/* Data Rows */}
              {data?.materialArrivalList?.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className={`grid grid-cols-5 gap-4 px-6 py-6 border-b border-gray-100 hover:bg-slate-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  {/* Custom ID */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-bold shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">{item.customId || "-"}</span>
                        <span className="text-xs text-gray-500">Item #{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Dropdown */}
                  <div className="flex items-center">
                    <div className="w-full max-w-[140px]">
                      <Select onValueChange={(value) => handleQuantityChange(item._id, Number(value))}>
                        <SelectTrigger className="w-full border-2 border-gray-200 hover:border-slate-400 focus:border-slate-600 transition-colors">
                          <SelectValue placeholder={`Current: ${item.quantity || 0}`} />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {[...Array(21).keys()].map((val) => (
                            <SelectItem key={val} value={val.toString()}>
                              {val} {val === 1 ? "item" : "items"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {quantities[item._id] !== undefined && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                          <i className="fa-solid fa-arrow-right"></i>
                          New: {quantities[item._id]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Image Field */}
                  <div className="flex items-center gap-3">
                    {/* Current Image Preview */}
                    {item?.image?.url && (
                      <div
                        className="relative group cursor-pointer flex-shrink-0"
                        onClick={() => setShowImageModal(item._id)}
                      >
                        <div className="w-16 h-16 border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
                          <img
                            src={item.image.url || NO_IMAGE}
                            alt="Current"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-200 flex items-center justify-center">
                          {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                              <i className="fa-solid fa-expand text-gray-700 text-sm"></i>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    )}

                    {/* File Upload */}
                    <div className="flex-1 min-w-0">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(item._id, e.target.files?.[0] || null)}
                        className="text-sm border-2 border-gray-200 hover:border-slate-400 focus:border-slate-600 transition-colors"
                      />
                      {images[item._id] && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                          <i className="fa-solid fa-check-circle"></i>
                          New image ready to upload
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Verified Status */}
                  <div className="flex items-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                        item?.isVerified
                          ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-2 border-amber-200"
                      }`}
                    >
                      <i className={`fa-solid ${item?.isVerified ? "fa-check-circle" : "fa-clock"} text-sm`}></i>
                      {item?.isVerified ? "Verified" : "Pending"}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(item._id)}
                      disabled={isPending}
                      className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      {isPending ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-save"></i>
                      )}
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </Button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!data?.materialArrivalList?.length && (
                <div className="p-16 text-center bg-gradient-to-br from-gray-50 to-slate-50">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
                      <i className="fa-solid fa-box-open text-4xl text-slate-400"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">No Materials Available</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                      Material data will appear here once available. Please check back later or contact your project
                      administrator for assistance.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-white rounded-lg p-3 shadow-sm">
                      <i className="fa-solid fa-info-circle"></i>
                      <span>Materials are automatically synced from your project</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/70 bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(null)}
        >
          <div className="relative w-[80vw] h-[80vh] max-w-4xl">
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-3"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
            {(() => {
              const item = data?.materialArrivalList?.find((item: any) => item._id === showImageModal)
              return item?.image?.url ? (
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={item.image.url || NO_IMAGE}
                    alt={item.image.originalName || "Material Image"}
                    className="w-full h-full object-cover"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6 rounded-b-2xl">
                    <p className="text-lg font-semibold">{item.image.originalName || "Material Image"}</p>
                    <p className="text-sm text-gray-300 mt-1">Click outside to close • Item ID: {item.customId}</p>
                  </div>
                </div>
              ) : null
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicMaterialArrival
