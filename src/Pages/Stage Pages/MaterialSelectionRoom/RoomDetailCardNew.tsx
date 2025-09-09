// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetSinglePredefinedRoom } from '../../../apiList/Stage Api/materialSelectionApi';
// import MaterialRoomUploads from "./MaterialRoomUploads";


// const RoomDetailCardNew: React.FC = () => {
//     const { projectId, roomId } = useParams<{ projectId: string; roomId: string }>();
//     const navigate = useNavigate();

//     const { data: room, isLoading, isError, refetch } = useGetSinglePredefinedRoom({
//         projectId: projectId!,
//         roomId: roomId!,
//     });

//     const handleBack = () => {
//         navigate(-1);
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen text-gray-500">
//                 Loading room data...
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen text-red-600">
//                 Failed to load room details
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//             {/* Top Bar */}
//             <div className="flex items-center mb-6">
//                 <button
//                     onClick={handleBack}
//                     className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition"
//                 >
//                     <i className="fa-solid fa-arrow-left"></i>
//                     <span>Navigate Upstream</span>
//                 </button>
//             </div>

//             {/* Room Title */}
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">{room?.name || "Room"}</h1>

//             {/* Items List */}
//             <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {room?.roomFields?.map((item: any) => (
//                     <article
//                         key={item._id}
//                         className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition"
//                     >
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
//                             <i className="fa-solid fa-box text-gray-500 text-xl"></i>
//                         </div>
//                         <p className="text-gray-600">
//                             <span className="font-semibold">Quantity:</span> {item.quantity}
//                         </p>
//                     </article>
//                 ))}
//             </section>


//             <section className="mt-4">
//                 <MaterialRoomUploads
//                     projectId={projectId!}
//                     roomId={roomId!}
//                     initialFiles={room.uploads}
//                     refetch={refetch}
//                 />
//             </section>

//             {/* No Items Fallback */}
//             {(!room?.roomFields || room.roomFields.length === 0) && (
//                 <div className="text-gray-500 text-center py-4">No items in this room.</div>
//             )}
//         </div>
//     );
// }

// export default RoomDetailCardNew

import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAddOrUpdateMaterialItems, useDeleteSubItem, useGetSinglePredefinedRoom } from "../../../apiList/Stage Api/materialSelectionApi"
import MaterialRoomUploads from "./MaterialRoomUploads"
import type { IMaterialRoom, IMaterialSubItems } from "../../../types/types"
import { useEffect, useRef, useState } from "react"
import { toast } from "../../../utils/toast"
import { Button } from "../../../components/ui/Button"


const units = [
  "nos",
  "pieces",
  "litre",
  "kg",
  "mm",
  "cm",
  "meter",
  "feet",
  "inch",
  "sqft",
  "sqmm",
  "packet",
  "roll",
  "sheet"
];

const RoomDetailCardNew: React.FC = () => {
  const { projectId, roomId, packageId } = useParams<{ projectId: string; roomId: string, packageId: string }>() as { projectId: string; roomId: string, packageId: string }
  const navigate = useNavigate()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [editingCell, setEditingCell] = useState<{
    itemIndex: number;
    subItemId: string;
    field: "materialName" | "quantity" | "unit" | "price" | "labourCost";
  } | null>(null);

  const [newMaterialItem, setNewMaterialItem] = useState({
    materialName: "",
    quantity: 1,
    unit: "",
    price: 0,
    labourCost: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);



  const {
    data: room,
    isLoading,
    isError,
    refetch,
  } = useGetSinglePredefinedRoom({
    projectId: projectId!,
    roomId: roomId!,
    packageId: packageId!,
  }) as { data: IMaterialRoom, isLoading: boolean, isError: boolean, refetch: any }

  const { mutateAsync: saveMaterialItem } = useAddOrUpdateMaterialItems();
  const deleteSubItem = useDeleteSubItem();


  const handleDelete = async (itemId: string, fieldId: string) => {
    try {
      await deleteSubItem.mutateAsync({ projectId, itemId, packageId, roomId, fieldId });
      toast({ title: "Success", description: "Item deleted successfully" });
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete item",
        variant: "destructive"
      });
    }
  };


  // ✅ Reusable handler for both update and create cases
  const handleMaterialItemSave = async (itemData: any, fieldId: string, itemId?: string) => {
    const { materialName, unit, ...rest } = itemData;

    if (!materialName.trim() || !unit) {
      return toast({
        title: "Error",
        description: "Material Name and Unit are required",
        variant: "destructive"
      });
    }

    try {
      await saveMaterialItem({
        projectId,
        packageId,
        roomId,
        fieldId: fieldId,
        formData: itemId
          ? { _id: itemId, materialName, unit, ...rest }         // ❗ Update if _id exists
          : { materialName, unit, ...rest },             // ➕ Create if no _id
      });
      setEditingCell(null)

      toast({
        title: itemId ? "Success" : "Added",
        description: itemId
          ? `Material "${materialName}" updated successfully.`
          : `Material "${materialName}" created successfully.`
      });

      // Reset new row input if it's a creation
      // if (!itemId) {
      setNewMaterialItem({
        materialName: "",
        quantity: 1,
        unit: "",
        price: 0,
        labourCost: 0,
      });
      // }
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save material item",
        variant: "destructive"
      });
    }
  };


  const handlePreloadData = ({ mat, fieldName, _id, index }: { mat: IMaterialSubItems, fieldName: "materialName" | "quantity" | "unit" | "price" | "labourCost", _id: string, index: number }) => {


    setEditingCell({
      itemIndex: index,
      subItemId: _id!,
      field: fieldName
    })


    setNewMaterialItem({
      materialName: mat.materialName,
      quantity: mat.quantity,
      unit: mat.unit,
      price: mat.price,
      labourCost: mat.labourCost,
    });
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="max-h-screen overflow-y-auto flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-h-screen overflow-y-auto flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <i className="fa-solid fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load</h2>
          <p className="text-slate-600 mb-4">Unable to retrieve room details</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-refresh mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    )
  }

  const roomItems = room?.roomFields ? Object.values(room.roomFields) : []
  const totalCost = room.totalCost
  // console.log("room", room)
  return (
    <div className="max-h-screen overflow-y-auto bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">


            <div className="flex justify-between items-center gap-2">
              <button
                onClick={handleBack}
                className="flex bg-slate-200 rounded-md px-2 py-1 cursor-pointer items-center gap-2 text-slate-700 hover:text-slate-600 transition-colors"

              >
                <i className="fa-solid fa-arrow-left"></i>
                {/* <span className="font-medium">Return to Overview</span> */}
              </button>

              <div className="flex items-center gap-2 text-blue-500">
                <i className="fa-solid fa-door-open"></i>
                <span className="font-semibold text-blue-600 text-xl sm:text-2xl">{room?.name || "Room Details"}</span>
              </div>
            </div>


            <button
              onClick={handleBack}
              className="flex  rounded-2xl px-2 py-1 cursor-pointer items-center gap-2 text-slate-700 hover:text-slate-600 transition-colors"

            >
              Total Cost: 
              <span className="font-medium">{totalCost}</span>
            </button>


          </div>
        </div>
      </header>

      <main className="p-4">
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-blue-600"></i>
              Room Items & Specifications
            </h2>
          </div>

          {roomItems.length > 0 ? (
            <div className="divide-y divide-slate-200">
              <div className="grid grid-cols-15 gap-4 px-4 py-3 bg-slate-50 text-sm font-medium text-slate-600">
                <div className="col-span-1">#</div>
                <div className="col-span-1">
                  <i className="fa-solid fa-box"></i>
                </div>
                <div className="col-span-7 sm:col-span-8">Item Name</div>
                <div className="col-span-3 sm:col-span-2 text-center">Quantity</div>
                <div className="col-span-3 sm:col-span-2 text-center">Material Items</div>
              </div>

              {roomItems.map((item: any, index: number) => (
                <div key={item._id || index} className="border-b">
                  <div
                    className="grid grid-cols-15 gap-4 px-4 py-4 hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    <div className="col-span-1 flex items-center">
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <i className="fa-solid fa-cube text-blue-600 text-sm"></i>
                      </div>
                    </div>
                    <div className="col-span-7 sm:col-span-8 flex items-center">
                      <span className="font-medium text-slate-800">{item.itemName}</span>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                      <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="col-span-3 sm:col-span-3 flex items-center cursor-pointer transition-all duration-300 hover:bg-gray-200 w-fit px-2 py-2 rounded-md">
                      <span className="font-medium text-slate-800">Create Mateiral Items</span>
                      <i className={`fa-solid transition-transform duration-300 ml-2 ${expandedIndex === index ? "fa-chevron-up" : "fa-chevron-down"}`} />
                    </div>
                  </div>

                  {/* Collapse section */}
                  {expandedIndex === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200 bg-[#faffff] rounded-lg p-4">
                      <div className="mb-4">
                        <div className="flex gap-2 items-center">
                          <i className="fa-solid fa-list text-blue-600"></i>
                          <h4 className="font-semibold text-gray-800">Material Items of {item.itemName}</h4>
                        </div>

                        <p className="text-sm text-gray-500">( Click to edit, save changes by clicking Enter )</p>
                      </div>

                      {/* Headings */}
                      <div className="grid grid-cols-12 bg-gray-100 text-sm font-medium text-gray-700 border-b border-gray-200">
                        <div className="col-span-4 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Material Name</div>
                        <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Quantity</div>
                        <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Unit</div>
                        <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Material Cost </div>
                        <div className="col-span-1 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Labour Cost </div>
                        <div className="col-span-1 px-4 py-3 text-sm font-medium text-gray-700">Action</div>
                      </div>


                      {item?.materialItems?.length === 0 && <>
                        <div className="p-8 text-center bg-white">
                          <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-solid fa-inbox text-slate-400"></i>
                          </div>
                          <h3 className="font-semibold text-slate-700 mb-1">No Items Found</h3>
                          <p className="text-slate-500 text-sm">This room doesn't have any items configured yet.</p>
                        </div>
                      </>}

                      {/* Material Rows */}
                      {item.materialItems.map((mat: any, matIdx: number) => (
                        <div key={mat._id || matIdx} className="grid grid-cols-12 gap-0 border-b border-gray-100 ">
                          {/* Name */}
                          <div className="col-span-4 border-r border-gray-200 bg-white"
                            onClick={() => {
                              handlePreloadData({ mat, _id: mat._id, fieldName: "materialName", index })
                            }
                            }>
                            {editingCell?.subItemId === mat._id && editingCell?.field === "materialName" ? (
                              <input
                                ref={inputRef}
                                value={newMaterialItem.materialName}
                                onChange={(e) => setNewMaterialItem({ ...newMaterialItem, materialName: e.target.value })}

                                onBlur={() => {
                                  if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                              />
                            ) :
                              <div
                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                              >
                                {mat.materialName}
                              </div>
                            }
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 border-r border-gray-200 bg-white"
                            onClick={() => {
                              handlePreloadData({ mat, _id: mat._id, fieldName: "quantity", index })
                            }}
                          >
                            {editingCell?.subItemId === mat._id && editingCell?.field === "quantity" ? (
                              <input
                                type="number"
                                ref={inputRef}
                                onChange={(e) => setNewMaterialItem({ ...newMaterialItem, quantity: +e.target.value })}

                                value={newMaterialItem.quantity}
                                // onBlur={(e) => handleEditSave(mat._id!, "quantity", e.target.value)}
                                // onKeyDown={(e) => {
                                //   if (e.key === "Enter") handleEditSave(mat._id!, "quantity", e.currentTarget.value);
                                //   if (e.key === "Escape") setEditingCell(null);
                                // }}
                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"

                                onBlur={() => {
                                  if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                              />
                            ) :
                              <div
                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                              >
                                {mat.quantity}
                              </div>

                            }
                          </div>

                          {/* Unit */}
                          <div className="col-span-2 border-r border-gray-200 bg-white">
                            {editingCell?.subItemId === mat._id && editingCell?.field === "unit" ? (
                              <select
                                value={newMaterialItem.unit}

                                onChange={async (e) => {
                                  setNewMaterialItem({ ...newMaterialItem, unit: e.target.value })

                                  const updatedRow: any = {
                                    ...newMaterialItem,
                                    unit: e.target.value
                                  };


                                  await handleMaterialItemSave(updatedRow, item._id, mat._id);

                                }}
                                onBlur={() => setEditingCell(null)}
                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                              >
                                <option value="" disabled>Select Unit</option>
                                {units.map(u => (
                                  <option key={u} value={u}>{u}</option>
                                ))}
                              </select>
                            ) : (
                              <div
                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                onClick={() => {
                                  handlePreloadData({ mat, _id: mat._id, fieldName: "unit", index })
                                }}
                              >
                                {mat.unit}
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="col-span-2 border-r border-gray-200 bg-white"
                            onClick={() => {
                              handlePreloadData({ mat, _id: mat._id, fieldName: "price", index })
                            }}                            >
                            {editingCell?.subItemId === mat._id && editingCell?.field === "price" ? (
                              <input
                                type="number"
                                ref={inputRef}
                                value={newMaterialItem.price}
                                onChange={(e) => setNewMaterialItem({ ...newMaterialItem, price: +e.target.value })}

                                onBlur={() => {
                                  if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                              />
                            ) :
                              //  mat.price
                              <div
                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                              >
                                {mat.price}
                              </div>

                            }
                          </div>

                          {/* Labour */}
                          <div className="col-span-1 border-r border-gray-200 bg-white"
                            onClick={() => {
                              handlePreloadData({ mat, _id: mat._id, fieldName: "labourCost", index })
                            }}                            >
                            {editingCell?.subItemId === mat._id && editingCell?.field === "labourCost" ? (
                              <input
                                type="number"
                                ref={inputRef}
                                value={newMaterialItem.labourCost}
                                onChange={(e) => setNewMaterialItem({ ...newMaterialItem, labourCost: +e.target.value })}
                                onBlur={() => {
                                  if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleMaterialItemSave(newMaterialItem, item._id, mat._id);
                                  }
                                }}
                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                              />
                            ) : <div
                              className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                              {mat.labourCost}
                            </div>}
                          </div>

                          <div className="col-span-1 flex justify-center items-center bg-white">
                            <Button
                              variant="danger"
                              isLoading={deleteSubItem.isPending}
                              onClick={() => handleDelete(mat._id, item._id)}
                              className="p-2 bg-red-600 text-white hover:bg-red-50 rounded transition-colors"
                              title="Delete item"
                            >
                              <i className="fa fa-trash text-sm"></i>
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* New Material Creation Row */}
                      <div className="grid grid-cols-12 text-sm gap-0 bg-green-50 border-b border-gray-100">
                        {/* Name */}
                        <div className="col-span-4 border-r border-gray-200"
                        >
                          <input
                            autoFocus
                            ref={inputRef}
                            value={!editingCell ? newMaterialItem.materialName : ""}
                            onChange={(e) => setNewMaterialItem({ ...newMaterialItem, materialName: e.target.value })}
                            placeholder="plywoods, curtains , etc..."
                            onBlur={() => {
                              if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                                handleMaterialItemSave(newMaterialItem, item._id);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleMaterialItemSave(newMaterialItem, item._id);
                              }
                            }}
                            className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 border-r border-gray-200">
                          <input
                            type="number"
                            ref={inputRef}
                            onChange={(e) => setNewMaterialItem({ ...newMaterialItem, quantity: +e.target.value })}
                            value={!editingCell ? newMaterialItem.quantity : 1}
                            // onBlur={(e) => handleEditSave(mat._id!, "quantity", e.target.value)}
                            // onKeyDown={(e) => {
                            //   if (e.key === "Enter") handleEditSave(mat._id!, "quantity", e.currentTarget.value);
                            //   if (e.key === "Escape") setEditingCell(null);
                            // }}
                            className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                          />

                        </div>

                        {/* Unit */}
                        <div className="col-span-2 border-r border-gray-200">
                          <select
                            value={!editingCell ? newMaterialItem.unit : ""}
                            onChange={async (e) => {
                              setNewMaterialItem({ ...newMaterialItem, unit: e.target.value })

                              // const updatedRow: any = {
                              //   ...newMaterialItem,
                              //   unit: e.target.value
                              // };


                              // await handleMaterialItemSave(updatedRow, item._id);

                            }}
                            onBlur={() => setEditingCell(null)}
                            className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                          >
                            <option value="" disabled>Select Unit</option>
                            {units.map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>

                        </div>

                        {/* Price */}
                        <div className="col-span-2 border-r border-gray-200"
                        >
                          <input
                            type="number"
                            ref={inputRef}
                            value={!editingCell ? newMaterialItem.price : 0}
                            onChange={(e) => setNewMaterialItem({ ...newMaterialItem, price: +e.target.value })}
                            // onBlur={() => {
                            //   if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                            //     handleMaterialItemSave(newMaterialItem, item._id);
                            //   }
                            // }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleMaterialItemSave(newMaterialItem, item._id);
                              }
                            }}
                            className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                          />
                        </div>

                        {/* Labour */}
                        <div className="col-span-1 border-r border-gray-200 "
                        >

                          <input
                            type="number"
                            ref={inputRef}
                            value={!editingCell ? newMaterialItem.labourCost : 0}
                            onChange={(e) => setNewMaterialItem({ ...newMaterialItem, labourCost: +e.target.value })}

                            onBlur={() => {
                              if (newMaterialItem.materialName.trim() && newMaterialItem.unit) {
                                handleMaterialItemSave(newMaterialItem, item._id);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleMaterialItemSave(newMaterialItem, item._id);
                              }
                            }}
                            className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                          />
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-inbox text-slate-400"></i>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">No Items Found</h3>
              <p className="text-slate-500 text-sm">This room doesn't have any items configured yet.</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-paperclip text-purple-600"></i>
              Attachments & Documents
            </h2>
          </div>
          <div className="p-4">
            <MaterialRoomUploads
              projectId={projectId!}
              roomId={roomId!}
              packageId={packageId!}
              initialFiles={room?.uploads || []}
              refetch={refetch}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default RoomDetailCardNew


