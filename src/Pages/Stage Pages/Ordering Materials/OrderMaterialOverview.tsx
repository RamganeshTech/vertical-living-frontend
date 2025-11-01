// import { useParams, useOutletContext } from "react-router-dom";
// import { toast } from "../../../utils/toast";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import AssignStageStaff from "../../../shared/AssignStaff";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
// // import { useCompleteOrderingMaterialStage, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline } from "../../../apiList/Stage Api/orderingMaterialApi";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// // import { useGetSelectedModularUnits } from "../../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi";
// import { NO_IMAGE } from "../../../constants/constants";
// import { useAddOrderingMaterialSubItem, useCompleteOrderingMaterialHistoryStage, useDeleteOrderingMaterialSubItem, useGetAllOrderingMaterialHistory, useOrderHistoryGenerateLink, useSetOrderingMaterialHistoryDeadline, useUpdateOrderingMaterialSubItem } from "../../../apiList/Stage Api/orderMaterialHistoryApi";
// import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
// import { useState } from "react";

// interface ProjectDetailsOutlet {
//     isMobile: boolean;
//     openMobileSidebar: () => void;
// }

// const OrderMaterialOverview = () => {
//     const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string };
//     const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
//     const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterialHistory(projectId!);
//     const { mutateAsync: generateLink, isPending: generatePending } = useOrderHistoryGenerateLink()

//     const { mutateAsync: addSubItem } = useAddOrderingMaterialSubItem();
//     const { mutateAsync: deleteSubItem } = useDeleteOrderingMaterialSubItem();
//     const { mutateAsync: updateSubItem } = useUpdateOrderingMaterialSubItem();

//     const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
//     const [newSubItemName, setNewSubItemName] = useState("");
//     const [newSubItemQty, setNewSubItemQty] = useState<number>(1);
//     const [newSubItemUnit, setNewSubItemUnit] = useState("");
//     const [editSubItemId, setEditSubItemId] = useState<string | null>(null);
//     const [editName, setEditName] = useState("");
//     const [editQty, setEditQty] = useState<number>(1);
//     const [editUnit, setEditUnit] = useState("");


//     // const { data: orderedUnits, isLoading: orderedLoading, error } = useGetSelectedModularUnits(projectId!);

//     const selectedUnits = data?.selectedUnits || [];
//     const totalCost = data?.totalCost || 0;
//     const hasUnits = selectedUnits.length > 0;

//     //   const { mutateAsync: updateShop } = useUpdateShopDetails();
//     //   const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();

//     const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialHistoryDeadline()
//     const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialHistoryStage()

//     const handleAddSubItem = async (unitId: string) => {
//         if (!newSubItemName.trim()) return;
//         await addSubItem({
//             projectId,
//             unitId,
//             subItemName: newSubItemName,
//             quantity: newSubItemQty,
//             unit: newSubItemUnit,
//         });
//         setNewSubItemName("");
//         setNewSubItemQty(1);
//         setNewSubItemUnit("");
//     };

//     const handleUpdateSubItem = async (unitId: string) => {
//         if (!editSubItemId) return;
//         await updateSubItem({
//             projectId,
//             unitId,
//             subItemId: editSubItemId,
//             subItemName: editName,
//             quantity: editQty,
//             unit: editUnit,
//         });
//         setEditSubItemId(null);
//         setEditName("");
//         setEditQty(1);
//         setEditUnit("");
//     };

//     const handleDeleteSubItem = async (unitId: string, subItemId: string) => {
//         await deleteSubItem({ projectId, unitId, subItemId });
//     };

//     const handleCompletionStatus = async () => {
//         try {
//             await completionStatus({ projectId: projectId! });
//             toast({ description: 'Completion status updated successfully', title: "Success" });
//         } catch (error: any) {
//             toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
//         }
//     };

//     if (isLoading) return <MaterialOverviewLoading />;

//     // const roomKeys = Object.keys(data?.materialOrderingList || {});
//     // const { shopDetails, deliveryLocationDetails, generatedLink, materialOrderingList } = data || {};
//     // console.log("selectedUnits", selectedUnits)
//     return (
//         <div className="w-full h-full flex flex-col">

//             {/* Header Section - Always visible */}
//             <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//                 <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
//                     {isMobile && (
//                         <button
//                             onClick={openMobileSidebar}
//                             className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
//                             title="Open Menu"
//                         >
//                             <i className="fa-solid fa-bars"></i>
//                         </button>
//                     )}
//                     <i className="fa-solid fa-cart-shopping mr-2"></i>
//                     <span className="hidden sm:inline">Ordering Material</span>
//                     <span className="sm:hidden">Order Material</span>
//                 </h2>

//                 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//                     <Button
//                         isLoading={completePending}
//                         onClick={handleCompletionStatus}
//                         className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
//                     >
//                         <i className="fa-solid fa-circle-check mr-2"></i>
//                         Mark as Complete
//                     </Button>

//                     <ResetStageButton
//                         projectId={projectId!}
//                         stageNumber={8}
//                         stagePath="orderingmaterial"
//                     />


//                     {!getAllError && <ShareDocumentWhatsapp
//                         projectId={projectId!}
//                         stageNumber="8"
//                         className="w-full sm:w-fit"
//                         isStageCompleted={data?.status}
//                     />}

//                     <AssignStageStaff
//                         stageName="OrderMaterialHistoryModel"
//                         projectId={projectId!}
//                         organizationId={organizationId!}
//                         currentAssignedStaff={data?.assignedTo || null}
//                     />
//                 </div>
//             </div>

//             {/* Error Display */}
//             {(isError) && (
//                 <div className="flex-1 flex items-center justify-center">
//                     <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                         <div className="text-red-600 font-semibold mb-2">
//                             ⚠️ Error Occurred
//                         </div>
//                         <p className="text-red-500 text-sm mb-4">
//                             {(getAllError as any)?.response?.data?.message || "Failed to load ordering material"}
//                         </p>
//                         <Button
//                             isLoading={isLoading}
//                             onClick={() => refetch()}
//                             className="bg-red-600 text-white hover:bg-red-700"
//                         >
//                             Retry
//                         </Button>
//                     </div>
//                 </div>
//             )}

//             {/* Main Content - Only show if no error */}
//             {!isError && (
//                 <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
//                     {/* Timer Card */}
//                     <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
//                         <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//                             <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//                             <span>Stage Timings</span>
//                         </div>
//                         <StageTimerInfo
//                             completedAt={data?.timer?.completedAt}
//                             stageName="orderingmaterial"
//                             formId={(data as any)?._id}
//                             projectId={projectId!}
//                             deadLine={data?.timer?.deadLine}
//                             startedAt={data?.timer?.startedAt}
//                             refetchStageMutate={refetch}
//                             deadLineMutate={deadLineAsync}
//                             isPending={deadLinePending}
//                         />
//                     </Card>




//                     {/* {!isError && !error && <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                                 <div className="p-4 border-b border-gray-200 flex justify-between">
//                                     <h2 className="text-lg font-semibold text-blue-600">Order Summary</h2>

//                                     <div>

//                                         <p className="text-lg font-semibold text-blue-600"> <span className="text-black">Total Amount:</span> ₹{totalCost || 0}</p>
//                                     </div>
//                                 </div>

//                                 <div className="p-4">
//                                     {hasUnits ? (
//                                         <>
//                                             <div className="space-y-4">
//                                                 {selectedUnits.map((unit: any, idx: number) => (
//                                                     <div
//                                                         key={unit._id || idx}
//                                                         className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
//                                                     >
//                                                         <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//                                                             <img
//                                                                 src={unit.image || NO_IMAGE}
//                                                                 alt={unit.customId ? `Product image for ${unit.customId}` : 'Product image unavailable'}
//                                                                 className="w-full h-full object-cover"
//                                                             />
//                                                         </div>

//                                                         <div className="flex-1">
//                                                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                                                                 <h3 className="font-medium text-gray-900">
//                                                                     {unit.customId || "N/A"}
//                                                                 </h3>
//                                                                 <div className="text-sm font-semibold text-blue-600">
//                                                                     ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
//                                                                 </div>
//                                                             </div>

//                                                             <div className="mt-1 text-sm text-gray-600">
//                                                                 <span className="font-medium">Category:</span> {unit.category || "N/A"}
//                                                             </div>

//                                                             <div className="mt-2 flex items-center justify-between">
//                                                                 <div className="text-sm text-gray-500">
//                                                                     <span className="font-medium">Qty:</span> {unit.quantity}
//                                                                 </div>
//                                                                 <div className="text-sm text-gray-500">
//                                                                     <span className="font-medium">Unit Price:</span> ₹{unit.singleUnitCost.toFixed(2)}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>

//                                             <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="font-medium text-gray-700">Total Amount:</span>
//                                                     <span className="text-xl font-semibold text-blue-600">₹{totalCost.toFixed(2)}</span>
//                                                 </div>
//                                             </div>
//                                         </>
//                                     ) : (
//                                         <div className="py-8 text-center">
//                                             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     className="h-8 w-8 text-gray-400"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                 >
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth={1.5}
//                                                         d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                             <h3 className="text-lg font-medium text-gray-900 mb-1">No items ordered</h3>
//                                             <p className="text-gray-500">Your order history is currently empty.</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </section>} */}


//                     {!isError && (
//                         <section className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
//                             {/* Modern header with subtle accent */}
//                             <div className="p-6 border-b border-gray-100 relative">
//                                 <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
//                                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
//                                     <div>
//                                         <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
//                                         <p className="text-sm text-gray-500 mt-1">
//                                             {hasUnits ? `${selectedUnits.length} items purchased` : 'No orders yet'}
//                                         </p>
//                                     </div>
//                                     {hasUnits && (
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-500 text-sm">Total:</span>
//                                             <span className="text-xl font-bold text-blue-600">₹{totalCost.toFixed(2)}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="py-2">
//                                 {hasUnits ? (
//                                     <div className="grid gap-5">
//                                         {selectedUnits.map((unit: any, idx: number) => (
//                                             <div
//                                                 key={unit._id || idx}
//                                                 className="group relative p-5 bg-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
//                                             >
//                                                 <div className="flex flex-col md:flex-row gap-5">
//                                                     {/* Product Image */}
//                                                     <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
//                                                         <img
//                                                             src={unit.image || NO_IMAGE}
//                                                             alt={unit.customId || "Product image"}
//                                                             className="w-full h-full object-contain p-3"
//                                                         />
//                                                         <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
//                                                             ×{unit.quantity}
//                                                         </div>
//                                                     </div>

//                                                     {/* Product Details */}
//                                                     <div className="flex-1 flex flex-col">
//                                                         <div className="flex-1">
//                                                             <div className="flex items-center justify-between">
//                                                                 <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
//                                                                     {unit.unitName} (-) {unit?.customId || "Unspecified Product"}
//                                                                 </h3>
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         setExpandedUnitId(
//                                                                             expandedUnitId === unit._id ? null : unit._id
//                                                                         )
//                                                                     }
//                                                                     className="text-blue-600 hover:underline"
//                                                                 >
//                                                                     <i
//                                                                         className={`fa ${expandedUnitId === unit._id
//                                                                                 ? "fa-chevron-up"
//                                                                                 : "fa-chevron-down"
//                                                                             }`}
//                                                                     ></i>
//                                                                 </button>
//                                                             </div>

//                                                             <div className="flex items-center gap-2 mb-3">
//                                                                 <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
//                                                                     {unit.category || "Generic"}
//                                                                 </span>
//                                                             </div>

//                                                             <div className="grid grid-cols-2 gap-4">
//                                                                 <div>
//                                                                     <p className="text-sm text-gray-500 mb-1">Unit Price</p>
//                                                                     <p className="font-medium">₹{unit.singleUnitCost.toFixed(2)}</p>
//                                                                 </div>
//                                                                 <div>
//                                                                     <p className="text-sm text-gray-500 mb-1">Quantity</p>
//                                                                     <p className="font-medium">{unit.quantity}</p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div className="mt-4 pt-3 border-t border-gray-100">
//                                                             <div className="flex justify-between items-center">
//                                                                 <p className="text-sm text-gray-500">Item Total</p>
//                                                                 <p className="text-lg font-bold text-blue-600">
//                                                                     ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Subitems Dropdown */}
//                                                 {expandedUnitId === unit._id && (
//                                                     <div className="mt-4 border-t pt-3">
//                                                         <h4 className="font-semibold mb-2">Sub Items</h4>

//                                                         {/* List SubItems */}
//                                                         {unit.subItems && unit.subItems.length > 0 ? (
//                                                             unit.subItems.map((sub: any) => (
//                                                                 <div
//                                                                     key={sub._id}
//                                                                     className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-2 gap-2"
//                                                                 >
//                                                                     {editSubItemId === sub._id ? (
//                                                                         <>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 value={editName}
//                                                                                 onChange={(e) => setEditName(e.target.value)}
//                                                                                 className="border p-1 rounded flex-1"
//                                                                             />
//                                                                             <input
//                                                                                 type="number"
//                                                                                 value={editQty}
//                                                                                 onChange={(e) => setEditQty(Number(e.target.value))}
//                                                                                 className="border p-1 rounded w-20"
//                                                                             />
//                                                                             <input
//                                                                                 type="text"
//                                                                                 value={editUnit}
//                                                                                 onChange={(e) => setEditUnit(e.target.value)}
//                                                                                 className="border p-1 rounded w-24"
//                                                                             />
//                                                                             <button
//                                                                                 onClick={() => handleUpdateSubItem(unit._id)}
//                                                                                 className="bg-blue-500 text-white px-3 py-1 rounded"
//                                                                             >
//                                                                                 <i className="fa fa-save"></i>
//                                                                             </button>
//                                                                         </>
//                                                                     ) : (
//                                                                         <>
//                                                                             <span className="flex-1">
//                                                                                 {sub.subItemName} — {sub.quantity} {sub.unit}
//                                                                             </span>
//                                                                             <div className="flex gap-2">
//                                                                                 <button
//                                                                                     onClick={() => {
//                                                                                         setEditSubItemId(sub._id);
//                                                                                         setEditName(sub.subItemName);
//                                                                                         setEditQty(sub.quantity);
//                                                                                         setEditUnit(sub.unit);
//                                                                                     }}
//                                                                                     className="bg-yellow-500 text-white px-3 py-1 rounded"
//                                                                                 >
//                                                                                     <i className="fa fa-pencil"></i>
//                                                                                 </button>
//                                                                                 <button
//                                                                                     onClick={() =>
//                                                                                         handleDeleteSubItem(unit._id, sub._id)
//                                                                                     }
//                                                                                     className="bg-red-500 text-white px-3 py-1 rounded"
//                                                                                 >
//                                                                                     <i className="fa fa-trash"></i>
//                                                                                 </button>
//                                                                             </div>
//                                                                         </>
//                                                                     )}
//                                                                 </div>
//                                                             ))
//                                                         ) : (
//                                                             <p className="text-sm text-gray-500">No sub-items yet.</p>
//                                                         )}

//                                                         {/* Add New SubItem */}
//                                                         <div className="flex flex-col sm:flex-row gap-2 mt-3">
//                                                             <input
//                                                                 type="text"
//                                                                 value={newSubItemName}
//                                                                 onChange={(e) => setNewSubItemName(e.target.value)}
//                                                                 placeholder="Sub Item Name"
//                                                                 className="border p-2 rounded flex-1"
//                                                             />
//                                                             <input
//                                                                 type="number"
//                                                                 value={newSubItemQty}
//                                                                 onChange={(e) => setNewSubItemQty(Number(e.target.value))}
//                                                                 placeholder="Qty"
//                                                                 className="border p-2 rounded w-20"
//                                                             />
//                                                             <input
//                                                                 type="text"
//                                                                 value={newSubItemUnit}
//                                                                 onChange={(e) => setNewSubItemUnit(e.target.value)}
//                                                                 placeholder="Unit"
//                                                                 className="border p-2 rounded w-24"
//                                                             />
//                                                             <button
//                                                                 onClick={() => handleAddSubItem(unit._id)}
//                                                                 className="bg-green-500 text-white px-3 py-2 rounded flex items-center justify-center"
//                                                             >
//                                                                 <i className="fa fa-plus"></i>
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                 <div className="py-23 text-center">
//                                     <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-10 w-10 text-blue-400"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                             strokeWidth="1.5"
//                                         >
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                                         </svg>
//                                     </div>
//                                     <h3 className="text-xl font-bold text-gray-800 mb-2">No Order History</h3>
//                                     <p className="text-gray-500 max-w-md mx-auto mb-6">
//                                         Your completed orders will appear here
//                                     </p>

//                                 </div>
//                                 )}
//                             </div>
//                         </section>
//                     )}



//                     <section className="mt-4">
//                         <GenerateWhatsappLink
//                             projectId={projectId!} context="order material"
//                             stage="ordermaterial"
//                             data={data?.generatedLink}
//                             isPending={generatePending}
//                             generateLink={generateLink} />
//                     </section>
//                 </div>
//             )}


//         </div >
//     )
// }



// export default OrderMaterialOverview;



// SECOND WORK (FULLY WORKING BUT IT IS WITH BUTTONS VERSION)
// import { useParams, useOutletContext } from "react-router-dom";
// import { toast } from "../../../utils/toast";
// import { Button } from "../../../components/ui/Button";
// import { Card } from "../../../components/ui/Card";
// //  Added Select components for unit dropdown
// // import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
// import StageTimerInfo from "../../../shared/StagetimerInfo";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import AssignStageStaff from "../../../shared/AssignStaff";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
// // import { useCompleteOrderingMaterialStage, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline } from "../../../apiList/Stage Api/orderingMaterialApi";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// // import { useGetSelectedModularUnits } from "../../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi";
// import { NO_IMAGE } from "../../../constants/constants";
// import { useAddOrderingMaterialSubItem, useCompleteOrderingMaterialHistoryStage, useDeleteOrderingMaterialSubItem, useGetAllOrderingMaterialHistory, useOrderHistoryGenerateLink, useSetOrderingMaterialHistoryDeadline, useUpdateOrderingMaterialSubItem } from "../../../apiList/Stage Api/orderMaterialHistoryApi";
// import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
// import { useState } from "react";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";

// interface ProjectDetailsOutlet {
//     isMobile: boolean;
//     openMobileSidebar: () => void;
// }

// //  Added predefined unit options for the select dropdown
// const ORDERMATERIAL_OUNIT_OPTIONS = [
//     "nos",
//     "pieces",
//     "litre",
//     "kg",
//     "mm",
//     "cm",
//     "meter",
//     "feet",
//     "inch",
//     "sqft",
//     "sqmm",
//     "packet",
//     "roll",
//     "sheet"
// ];

// const OrderMaterialOverview = () => {
//     const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string };
//     const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
//     const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterialHistory(projectId!);
//     const { mutateAsync: generateLink, isPending: generatePending } = useOrderHistoryGenerateLink()

//     const { mutateAsync: addSubItem, isPending: addItemLoading } = useAddOrderingMaterialSubItem();
//     const { mutateAsync: deleteSubItem, isPending: deleteItemLoading } = useDeleteOrderingMaterialSubItem();
//     const { mutateAsync: updateSubItem, isPending: updateItemLoading } = useUpdateOrderingMaterialSubItem();

//     const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
//     const [newSubItemName, setNewSubItemName] = useState("");
//     const [newSubItemQty, setNewSubItemQty] = useState<number>(1);
//     const [newSubItemUnit, setNewSubItemUnit] = useState("");
//     const [editSubItemId, setEditSubItemId] = useState<string | null>(null);
//     const [editName, setEditName] = useState("");
//     const [editQty, setEditQty] = useState<number>(1);
//     const [editUnit, setEditUnit] = useState("");

//     // ... existing code ...

//     const selectedUnits = data?.selectedUnits || [];
//     const totalCost = data?.totalCost || 0;
//     const hasUnits = selectedUnits.length > 0;

//     //   const { mutateAsync: updateShop } = useUpdateShopDetails();
//     //   const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();

//     const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialHistoryDeadline()
//     const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialHistoryStage()

//     const handleAddSubItem = async (unitId: string) => {
//         try {
//             if (!newSubItemName.trim()) return;
//             await addSubItem({
//                 projectId,
//                 unitId,
//                 subItemName: newSubItemName,
//                 quantity: newSubItemQty,
//                 unit: newSubItemUnit,
//             });
//             setNewSubItemName("");
//             setNewSubItemQty(1);
//             setNewSubItemUnit("");
//             toast({ title: "Success", description: "item created successfully" })
//         }
//         catch (error: any) {
//             toast({ title: "error", description: error?.response?.data?.message || "failed to create item", variant: "destructive" })
//         }
//     };

//     const handleUpdateSubItem = async (unitId: string) => {
//         try {
//             if (!editSubItemId) return;
//             await updateSubItem({
//                 projectId,
//                 unitId,
//                 subItemId: editSubItemId,
//                 subItemName: editName,
//                 quantity: editQty,
//                 unit: editUnit,
//             });
//             setEditSubItemId(null);
//             setEditName("");
//             setEditQty(1);
//             setEditUnit("");
//             toast({ title: "Success", description: "item updated successfully" })
//         }
//         catch (error: any) {
//             toast({ title: "error", description: error?.response?.data?.message || "failed to update item", variant: "destructive" })
//         }
//     };

//     const handleDeleteSubItem = async (unitId: string, subItemId: string) => {
//         try {
//             await deleteSubItem({ projectId, unitId, subItemId });
//             toast({ title: "Success", description: "item deleted successfully" })
//         }
//         catch (error: any) {
//             toast({ title: "error", description: error?.response?.data?.message || "failed to deleted item", variant: "destructive" })
//         }
//     };

//     const handleCompletionStatus = async () => {
//         try {
//             await completionStatus({ projectId: projectId! });
//             toast({ description: 'Completion status updated successfully', title: "Success" });
//         } catch (error: any) {
//             toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
//         }
//     };

//     if (isLoading) return <MaterialOverviewLoading />;

//     // ... existing code ...

//     console.log("ordering matieral ", data)
//     return (
//         <div className="w-full h-full flex flex-col">

//             {/* Header Section - Always visible */}
//             <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//                 <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
//                     {isMobile && (
//                         <button
//                             onClick={openMobileSidebar}
//                             className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
//                             title="Open Menu"
//                         >
//                             <i className="fa-solid fa-bars"></i>
//                         </button>
//                     )}
//                     <i className="fa-solid fa-cart-shopping mr-2"></i>
//                     <span className="hidden sm:inline">Ordering Material</span>
//                     <span className="sm:hidden">Order Material</span>
//                 </h2>

//                 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//                     <Button
//                         isLoading={completePending}
//                         onClick={handleCompletionStatus}
//                         className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
//                     >
//                         <i className="fa-solid fa-circle-check mr-2"></i>
//                         Mark as Complete
//                     </Button>

//                     <ResetStageButton
//                         projectId={projectId!}
//                         stageNumber={8}
//                         stagePath="orderingmaterial"
//                     />


//                     {!getAllError && <ShareDocumentWhatsapp
//                         projectId={projectId!}
//                         stageNumber="8"
//                         className="w-full sm:w-fit"
//                         isStageCompleted={data?.status}
//                     />}

//                     <AssignStageStaff
//                         stageName="OrderMaterialHistoryModel"
//                         projectId={projectId!}
//                         organizationId={organizationId!}
//                         currentAssignedStaff={data?.assignedTo || null}
//                     />
//                 </div>
//             </div>

//             {/* Error Display */}
//             {(isError) && (
//                 <div className="flex-1 flex items-center justify-center">
//                     <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                         <div className="text-red-600 font-semibold mb-2">
//                             ⚠️ Error Occurred
//                         </div>
//                         <p className="text-red-500 text-sm mb-4">
//                             {(getAllError as any)?.response?.data?.message || "Failed to load ordering material"}
//                         </p>
//                         <Button
//                             isLoading={isLoading}
//                             onClick={() => refetch()}
//                             className="bg-red-600 text-white hover:bg-red-700"
//                         >
//                             Retry
//                         </Button>
//                     </div>
//                 </div>
//             )}

//             {/* Main Content - Only show if no error */}
//             {!isError && (
//                 <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
//                     {/* Timer Card */}
//                     <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
//                         <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//                             <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//                             <span>Stage Timings</span>
//                         </div>
//                         <StageTimerInfo
//                             completedAt={data?.timer?.completedAt}
//                             stageName="orderingmaterial"
//                             formId={(data as any)?._id}
//                             projectId={projectId!}
//                             deadLine={data?.timer?.deadLine}
//                             startedAt={data?.timer?.startedAt}
//                             refetchStageMutate={refetch}
//                             deadLineMutate={deadLineAsync}
//                             isPending={deadLinePending}
//                         />
//                     </Card>

//                     {!isError && (
//                         <section className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
//                             {/* Modern header with subtle accent */}
//                             <div className="p-6 border-b border-gray-100 relative">
//                                 <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
//                                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
//                                     <div>
//                                         <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
//                                         {/* <p className="text-sm text-gray-500 mt-1">
//                                             {hasUnits ? `${selectedUnits.length} items purchased` : 'No orders yet'}
//                                         </p> */}
//                                     </div>
//                                     {hasUnits && (
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-500 text-sm">Total:</span>
//                                             <span className="text-xl font-bold text-blue-600">₹{totalCost.toFixed(2)}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="py-2 overflow-y-auto custom-scrollbar ">
//                                 {hasUnits ? (
//                                     <div className="grid gap-5">
//                                         {selectedUnits.map((unit: any, idx: number) => (
//                                             <div
//                                                 key={unit._id || idx}
//                                                 className="group relative p-5 bg-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
//                                             >
//                                                 <div className="flex flex-col md:flex-row gap-5">
//                                                     {/* Product Image */}
//                                                     <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
//                                                         <img
//                                                             src={unit.image || NO_IMAGE}
//                                                             alt={unit.customId || "Product image"}
//                                                             className="w-full h-full object-contain p-3"
//                                                         />
//                                                         <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
//                                                             ×{unit.quantity}
//                                                         </div>
//                                                     </div>

//                                                     {/* Product Details */}
//                                                     <div className="flex-1 flex flex-col">
//                                                         <div className="flex-1">
//                                                             <div className="flex items-center justify-between">
//                                                                 <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
//                                                                     {unit.unitName}
//                                                                 </h3>
//                                                                <div className="flex gap-2 items-center">
//                                                                 <span className="flex cursor-pointer gap-1 items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"> Total Sub Items : <span className="">{unit?.subItems?.length || 0}</span></span>
//                                                                  <button
//                                                                     onClick={() =>
//                                                                         setExpandedUnitId(
//                                                                             expandedUnitId === unit._id ? null : unit._id
//                                                                         )
//                                                                     }
//                                                                     className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
//                                                                 >
//                                                                     <span className="hidden sm:inline">
//                                                                         {expandedUnitId === unit._id ? 'Hide' : 'Show'} Sub Items
//                                                                     </span>
//                                                                     <i
//                                                                         className={`fa ${expandedUnitId === unit._id
//                                                                             ? "fa-chevron-up"
//                                                                             : "fa-chevron-down"
//                                                                             } transition-transform`}
//                                                                     ></i>
//                                                                 </button>
//                                                                </div>
//                                                             </div>

//                                                             <div className="flex items-center gap-2 mb-3">
//                                                                 <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
//                                                                     {unit.category || "Generic"}
//                                                                 </span>
//                                                             </div>

//                                                             <div className="grid grid-cols-2 gap-4">
//                                                                 <div>
//                                                                     <p className="text-sm text-gray-500 mb-1">Unit Price</p>
//                                                                     <p className="font-medium">₹{unit.singleUnitCost.toFixed(2)}</p>
//                                                                 </div>
//                                                                 <div>
//                                                                     <p className="text-sm text-gray-500 mb-1">Quantity</p>
//                                                                     <p className="font-medium">{unit.quantity}</p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div className="mt-4 pt-3 border-t border-gray-100">
//                                                             <div className="flex justify-between items-center">
//                                                                 <p className="text-sm text-gray-500">Item Total</p>
//                                                                 <p className="text-lg font-bold text-blue-600">
//                                                                     ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Subitems Dropdown */}
//                                                 {expandedUnitId === unit._id && (
//                                                     <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
//                                                         <div className="flex items-center gap-2 mb-4">
//                                                             <i className="fa-solid fa-list text-blue-600"></i>
//                                                             <h4 className="font-semibold text-gray-800">Sub Items</h4>
//                                                         </div>

//                                                         {/* List SubItems */}
//                                                         {unit.subItems && unit.subItems.length > 0 ? (
//                                                             <div className="space-y-3 mb-4">
//                                                                 {unit.subItems.map((sub: any) => (
//                                                                     <div
//                                                                         key={sub._id}
//                                                                         className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-3 rounded-lg border border-gray-200 gap-3"
//                                                                     >
//                                                                         {editSubItemId === sub._id ? (
//                                                                             <div className="flex flex-col sm:flex-row gap-2 flex-1">
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     value={editName}
//                                                                                     onChange={(e) => setEditName(e.target.value)}
//                                                                                     placeholder="Item name"
//                                                                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                                                 />
//                                                                                 <input
//                                                                                     type="number"
//                                                                                     value={editQty}
//                                                                                     onChange={(e) => setEditQty(Number(e.target.value))}
//                                                                                     placeholder="Qty"
//                                                                                     className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                                                 />
//                                                                                 {/*  Replaced text input with Select component for edit unit */}
//                                                                                 <div className="relative cursor-pointer z-50">
//                                                                                     <Select
//                                                                                         value={editUnit}
//                                                                                         onValueChange={(value) => setEditUnit(value)}
//                                                                                     >
//                                                                                         <SelectTrigger  className="w-full sm:w-28 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
//                                                                                             <SelectValue placeholder="Unit" selectedValue={editUnit} />
//                                                                                         </SelectTrigger>
//                                                                                         <SelectContent>
//                                                                                             {ORDERMATERIAL_OUNIT_OPTIONS.map((unit) => (
//                                                                                                 <SelectItem key={unit} value={unit}>
//                                                                                                     {unit}
//                                                                                                 </SelectItem>
//                                                                                             ))}
//                                                                                         </SelectContent>
//                                                                                     </Select>
//                                                                                 </div>

//                                                                                 <div className="flex gap-2">
//                                                                                     <Button
//                                                                                         variant="primary"
//                                                                                         isLoading={updateItemLoading}
//                                                                                         onClick={() => handleUpdateSubItem(unit._id)}
//                                                                                         className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1"
//                                                                                     >
//                                                                                         <i className="fa fa-save"></i>
//                                                                                         <span className="hidden sm:inline">Save</span>
//                                                                                     </Button>
//                                                                                     <button
//                                                                                         onClick={() => {
//                                                                                             setEditSubItemId(null);
//                                                                                             setEditName("");
//                                                                                             setEditQty(1);
//                                                                                             setEditUnit("");
//                                                                                         }}
//                                                                                         className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-1"
//                                                                                     >
//                                                                                         <i className="fa fa-times"></i>
//                                                                                         <span className="hidden sm:inline">Cancel</span>
//                                                                                     </button>
//                                                                                 </div>
//                                                                             </div>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <div className="flex-1">
//                                                                                     <div className="flex items-center gap-2">
//                                                                                         <i className="fa-solid fa-cube text-gray-400"></i>
//                                                                                         <span className="font-medium text-gray-800">{sub.subItemName}</span>
//                                                                                     </div>
//                                                                                     <div className="text-sm text-gray-600 mt-1">
//                                                                                         <span className="font-medium">{sub.quantity}</span> {sub.unit}
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <div className="flex gap-2">
//                                                                                     <button
//                                                                                         onClick={() => {
//                                                                                             setEditSubItemId(sub._id);
//                                                                                             setEditName(sub.subItemName);
//                                                                                             setEditQty(sub.quantity);
//                                                                                             setEditUnit(sub.unit);
//                                                                                         }}
//                                                                                         className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
//                                                                                     >
//                                                                                         <i className="fa fa-pencil"></i>
//                                                                                         <span className="hidden sm:inline">Edit</span>
//                                                                                     </button>
//                                                                                     <Button
//                                                                                         isLoading={deleteItemLoading}
//                                                                                         onClick={() =>
//                                                                                             handleDeleteSubItem(unit._id, sub._id)
//                                                                                         }
//                                                                                         className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1"
//                                                                                     >
//                                                                                         <i className="fa fa-trash"></i>
//                                                                                         <span className="hidden sm:inline">Delete</span>
//                                                                                     </Button>
//                                                                                 </div>
//                                                                             </>
//                                                                         )}
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         ) : (
//                                                             <div className="text-center py-6 text-gray-500">
//                                                                 <i className="fa-solid fa-inbox text-2xl mb-2"></i>
//                                                                 <p className="text-sm">No sub-items added yet</p>
//                                                             </div>
//                                                         )}

//                                                         {/* Add New SubItem */}
//                                                         <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
//                                                             <div className="flex items-center gap-2 mb-3">
//                                                                 <i className="fa-solid fa-plus text-green-600"></i>
//                                                                 <h5 className="font-medium text-gray-800">Add New Sub Item</h5>
//                                                             </div>
//                                                             <div className="flex flex-col sm:flex-row gap-3">
//                                                                 <input
//                                                                     type="text"
//                                                                     value={newSubItemName}
//                                                                     onChange={(e) => setNewSubItemName(e.target.value)}
//                                                                     placeholder="Sub Item Name"
//                                                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                                 />
//                                                                 <input
//                                                                     type="number"
//                                                                     value={newSubItemQty}
//                                                                     onChange={(e) => setNewSubItemQty(Number(e.target.value))}
//                                                                     placeholder="Quantity"
//                                                                     min="1"
//                                                                     className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                                 />
//                                                                 {/*  Replaced text input with Select component for new unit */}
//                                                                <div className="relative z-[999] ">
//                                                                  <Select
//                                                                     value={newSubItemUnit}
//                                                                     onValueChange={(value) => setNewSubItemUnit(value)}
//                                                                 >
//                                                                     <SelectTrigger className="w-full sm:w-32 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
//                                                                         <SelectValue placeholder="Select unit" selectedValue={newSubItemUnit} />
//                                                                     </SelectTrigger>
//                                                                     <SelectContent className="max-h-48 overflow-y-auto custom-scrollbar">
//                                                                         {ORDERMATERIAL_OUNIT_OPTIONS.map((unit) => (
//                                                                             <SelectItem key={unit} value={unit}>
//                                                                                 {unit}
//                                                                             </SelectItem>
//                                                                         ))}
//                                                                     </SelectContent>
//                                                                 </Select>
//                                                                </div>
//                                                                 <Button
//                                                                     isLoading={addItemLoading}
//                                                                     onClick={() => handleAddSubItem(unit._id)}
//                                                                     disabled={!newSubItemName.trim() || !newSubItemUnit}
//                                                                     className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
//                                                                 >
//                                                                     <i className="fa fa-plus"></i>
//                                                                     <span className="hidden sm:inline">Add Item</span>
//                                                                 </Button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="py-16 text-center">
//                                         <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-10 w-10 text-blue-400"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                                 strokeWidth="1.5"
//                                             >
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                                             </svg>
//                                         </div>
//                                         <h3 className="text-xl font-bold text-gray-800 mb-2">No Order History</h3>
//                                         <p className="text-gray-500 max-w-md mx-auto mb-6">
//                                             Your completed orders will appear here
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>
//                     )}

//                     <section className="mt-4">
//                         <GenerateWhatsappLink
//                             projectId={projectId!} context="order material"
//                             stage="ordermaterial"
//                             data={data?.generatedLink}
//                             isPending={generatePending}
//                             generateLink={generateLink} />
//                     </section>
//                 </div>
//             )}
//         </div >
//     )
// }

// export default OrderMaterialOverview;



import { useParams, useOutletContext, useNavigate, useLocation, Outlet } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
//  Added Select components for unit dropdown
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
// import { useCompleteOrderingMaterialStage, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline } from "../../../apiList/Stage Api/orderingMaterialApi";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { useGetSelectedModularUnits } from "../../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi";
import { NO_IMAGE } from "../../../constants/constants";
import { useAddOrderingMaterialSubItem, useCompleteOrderingMaterialHistoryStage, useDeleteAllSubItems, useDeleteOrderingMaterialSubItem, useDeleteOrderMaterialPdf, useGetAllOrderingMaterialHistory, useOrderHistoryGenerateLink, useSetOrderingMaterialHistoryDeadline, useUpdateDeliveryLocation, useUpdateOrderingMaterialSubItem, useUpdatePdfStatus, useUpdateShopDetails } from "../../../apiList/Stage Api/orderMaterialHistoryApi";
// import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
import { useEffect, useRef, useState } from "react";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { downloadImage } from "../../../utils/downloadFile";
import { useGetShopLib } from "../../../apiList/Stage Api/shopLibDetailApi";
import SearchSelectNew from "../../../components/ui/SearchSelectNew";


interface ProjectDetailsOutlet {
    isMobile: boolean;
    openMobileSidebar: () => void;
}

//  Added predefined unit options for the select dropdown
export const ORDERMATERIAL_UNIT_OPTIONS = [
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
    "sheet",
    "set",
    "coil",
    "pair"
];



interface SubItem {
    refId: string;
    _id: string;
    subItemName: string;
    quantity: number;
    unit: string;
}

const OrderMaterialOverview = () => {
    const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string };
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const navigate = useNavigate()
    const location = useLocation();


    const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterialHistory(projectId!);
    const { mutateAsync: generateLink, isPending: generatePending } = useOrderHistoryGenerateLink()
    const { mutateAsync: updatePdfStatus } = useUpdatePdfStatus()

    const { mutateAsync: addSubItem } = useAddOrderingMaterialSubItem();
    const { mutateAsync: deleteSubItem, isPending: deleteItemLoading } = useDeleteOrderingMaterialSubItem();
    const { mutateAsync: updateSubItem } = useUpdateOrderingMaterialSubItem();

    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialHistoryDeadline()
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialHistoryStage()

    const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();
    const { mutateAsync: updateShop } = useUpdateShopDetails();

    const { data: shops } = useGetShopLib(organizationId);

    const { mutateAsync: deleteAllSubItems, isPending: deleteAllPending } = useDeleteAllSubItems();
    const { mutateAsync: deletePdf, isPending: deletePdfLoading } = useDeleteOrderMaterialPdf();



    const [editDelivery, setEditDelivery] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState<any>({});
    const [editShop, setEditShop] = useState(false);
    const [shopForm, setShopForm] = useState<any>({});
    const [selectedShop, setSelectedShop] = useState<{
        selectedId: string | null,
        shopName: string | null
    }>({
        selectedId: null,
        shopName: null
    })



    useEffect(() => {
        if (selectedShop.selectedId) {
            const shop = shops?.find((shop: any) => shop._id === selectedShop.selectedId)
            console.log("shop", shop)
            if (shop) {
                setShopForm(shop)
            }
        }
    }, [selectedShop.selectedId, shops])

    const shopLibOptions = (shops || [])?.map((shop: any) => ({
        value: shop._id,
        label: shop.shopName
    }))


    const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{
        subItemId: string;
        field: 'name' | 'quantity' | 'unit';
    } | null>(null);
    // const [tempValues, setTempValues] = useState<{ [key: string]: any }>({});
    const [newRowData, setNewRowData] = useState<{
        [unitId: string]: {
            name: string;
            quantity: number;
            unit: string;
        }
    }>({});

    const inputRef = useRef<HTMLInputElement>(null);

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
            navigate('../materialarrival')

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
        }
    };


    const handleDeleteAllSubItems = async () => {
        try {
            if (!window.confirm("Are you sure need to perform this operation?")) {
                return
            }
            await deleteAllSubItems({ projectId: projectId! });
            toast({ description: 'All Sub Items successfully', title: "Success" });

        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to delete sub items", variant: "destructive" })
        }
    };


    const handleUpdateDelivery = async () => {
        try {

            if (deliveryForm?.phoneNumber) {
                if (!/^\d{10}$/.test(deliveryForm?.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateDelivery({ projectId: projectId!, updates: deliveryForm });
            setEditDelivery(false);
            toast({ title: "Success", description: "Delivery Details Updated" });
            refetch()

        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };


    const handleUpdateShop = async () => {
        try {

            if (shopForm.phoneNumber) {
                if (!/^\d{10}$/.test(shopForm.phoneNumber.trim())) {
                    throw new Error("Phone number should contain exactly 10 digit numbers")
                }
            }

            await updateShop({ projectId: projectId!, updates: shopForm });
            toast({ title: "Success", description: "Shop Details Updated" });
            setEditShop(false);
            refetch()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
        }
    };




    const handleDeletePdf = async (pdfId: string) => {
        try {

            await deletePdf({ projectId: projectId!, pdfId });
            toast({ title: "Success", description: "PDF deleted" });
            setEditShop(false);
            refetch()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "failed to delete" });
        }
    };


    // const selectRef = useRef<HTMLButtonElement>(null);
    const selectedUnits = data?.selectedUnits || [];
    const totalCost = data?.totalCost || 0;
    const hasUnits = selectedUnits.length > 0;

    // Focus input when editing starts
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCell]);

    // Handle auto-save when editing ends
    const handleSaveEdit = async (unitId: string, subItemId: string, field: string, value: any) => {
        try {
            const unit = selectedUnits.find((u: any) => u._id === unitId);
            const subItem = unit?.subItems?.find((s: any) => s._id === subItemId);
            // console.log("subitem", subItem)
            if (!subItem) return;


            const updatedData = {
                projectId,
                unitId,
                subItemId,
                subItemName: field === 'name' ? value : subItem.subItemName,
                quantity: field === 'quantity' ? (Number(value) ? Number(value) : 1) : subItem.quantity,
                unit: field === 'unit' ? value : subItem.unit,
            };

            await updateSubItem(updatedData);
            toast({ title: "Success", description: "Item updated successfully" });
        } catch (error: any) {
            console.log("filed", error)
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update item",
                variant: "destructive"
            });
        }
    };

    // Handle new row creation
    const handleNewRowSave = async (unitId: string, newData: any) => {
        const rowData: any = newData;
        // console.log("row data", rowData)

        if (!rowData && !rowData?.name.trim()) {
            return toast({
                title: "Error",
                description: "Material Name is mandatory",
                variant: "destructive"
            });
        }

        // if (!rowData || !rowData.name.trim() || !rowData.unit) return;

        // console.log("row data", rowData)

        try {
            await addSubItem({
                projectId,
                unitId,
                subItemName: rowData.name,
                quantity: rowData.quantity ?? 1,
                unit: rowData.unit,
            });

            // Clear the new row data
            setNewRowData(prev => ({
                ...prev,
                [unitId]: { name: '', quantity: 1, unit: '' }
            }));

            toast({ title: "Success", description: "Item created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to create item",
                variant: "destructive"
            });
        }
    };

    // Handle delete
    const handleDelete = async (unitId: string, subItemId: string) => {
        try {
            await deleteSubItem({ projectId, unitId, subItemId });
            toast({ title: "Success", description: "Item deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete item",
                variant: "destructive"
            });
        }
    };

    // Initialize new row data for a unit
    // const initializeNewRow = (unitId: string) => {
    //     if (!newRowData[unitId]) {
    //         setNewRowData(prev => ({
    //             ...prev,
    //             [unitId]: { name: '', quantity: 1, unit: '' }
    //         }));
    //     }
    // };



    const handleGenerate = async () => {
        try {
            await generateLink({ projectId, organizationId });

            toast({ title: "Success", description: "Pdf Generated successfully" });
            refetch()

        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };


    const handleUpdatePdfStatus = async (pdfId: string, status: string) => {
        try {
            await updatePdfStatus({ projectId, pdfId, status });

            toast({ title: "Success", description: "Pdf status updated successfully" });
            refetch()

        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to update status", variant: "destructive" });
        }
    };

    const isChild = location.pathname.includes("siteorders") || location.pathname.includes("shoplib");

    if (isChild) {
        return <Outlet />
    }

    if (isLoading) return <MaterialOverviewLoading />;

    // ... existing code ...

    // console.log("ordering matieral ", data)
    return (
        <div className="w-full h-full flex flex-col">

            {/* Header Section - Always visible */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
                    {isMobile && (
                        <button
                            onClick={openMobileSidebar}
                            className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                            title="Open Menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <i className="fa-solid fa-cart-shopping mr-2"></i>
                    <span className="hidden sm:inline">Ordering Material</span>
                    <span className="sm:hidden">Order Material</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        isLoading={completePending}
                        onClick={handleCompletionStatus}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark as Complete
                    </Button>

                    <ResetStageButton
                        projectId={projectId!}
                        stageNumber={8}
                        stagePath="orderingmaterial"
                    />


                    {!getAllError && <ShareDocumentWhatsapp
                        projectId={projectId!}
                        stageNumber="8"
                        className="w-full sm:w-fit"
                        isStageCompleted={data?.status}
                    />}

                    <AssignStageStaff
                        stageName="OrderMaterialHistoryModel"
                        projectId={projectId!}
                        organizationId={organizationId!}
                        currentAssignedStaff={data?.assignedTo || null}
                    />
                </div>
            </div>

            {/* Error Display */}
            {(isError) && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                        <div className="text-red-600 font-semibold mb-2">
                            ⚠️ Error Occurred
                        </div>
                        <p className="text-red-500 text-sm mb-4">
                            {(getAllError as any)?.response?.data?.message || "Failed to load ordering material"}
                        </p>
                        <Button
                            isLoading={isLoading}
                            onClick={() => refetch()}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content - Only show if no error */}
            {!isError && (
                <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
                    {/* Timer Card */}
                    <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
                        <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                            <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                            <span>Stage Timings</span>
                        </div>
                        <StageTimerInfo
                            completedAt={data?.timer?.completedAt}
                            stageName="orderingmaterial"
                            formId={(data as any)?._id}
                            projectId={projectId!}
                            deadLine={data?.timer?.deadLine}
                            startedAt={data?.timer?.startedAt}
                            refetchStageMutate={refetch}
                            deadLineMutate={deadLineAsync}
                            isPending={deadLinePending}
                        />
                    </Card>

                    {!isError && (
                        <section className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">


                            {/* Shop Details */}
                            <section className="border-l-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                                            <i className="fa-solid fa-store"></i>
                                            Shop Details
                                        </h2>
                                    </div>

                                    {!editShop ?  <div className="gap-2 flex">

                                        <Button onClick={() => navigate("shoplib")}>
                                            <i className="fas fa-shop mr-2"></i>
                                            Shop Library
                                        </Button>

                                        <button
                                            onClick={() => { setShopForm(data?.shopDetails); setEditShop(true); }}
                                            // className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                            className=" text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"

                                        >
                                            <i className="fa-solid fa-edit mr-1"></i>Edit
                                        </button>
                                    </div>
                                    :

                                    <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                            <SearchSelectNew
                                                options={shopLibOptions}
                                                placeholder="Select Shop"
                                                searchPlaceholder="Search by shop name..."
                                                value={selectedShop.selectedId || ''}
                                                onValueChange={(value) => {
                                                    const shopFound = shops?.find((s: any) => s._id === value)
                                                    // console.log("sop", shopFound)
                                                    setSelectedShop(({selectedId: shopFound._id, shopName: shopFound.shopName}))
                                                }}
                                                searchBy="name"
                                                displayFormat="detailed"
                                                className="w-full"
                                            />
                                        </div>
                                    }
                                </div>
                                {editShop ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Shop Name"
                                            value={shopForm?.shopName || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Contact Person"
                                            value={shopForm?.contactPerson || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Phone Number"
                                            value={shopForm?.phoneNumber || ""}
                                            type="tel"
                                            maxLength={10}
                                            onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Address"
                                            value={shopForm?.address || ""}
                                            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                                            className="w-full"
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3  justify-end ">
                                            <Button onClick={handleUpdateShop} className="w-full sm:w-auto">
                                                <i className="fa-solid fa-save mr-2"></i>Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditShop(false)}
                                                className="w-full sm:w-auto"
                                            >
                                                <i className="fa-solid fa-times mr-2"></i>Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-sm sm:text-base">
                                        <p><strong>Shop Name:</strong> {data?.shopDetails?.shopName || "-"}</p>
                                        <p><strong>Contact Person:</strong> {data?.shopDetails?.contactPerson || "-"}</p>
                                        <p><strong>Phone:</strong> {data?.shopDetails?.phoneNumber || "-"}</p>
                                        <p><strong>Address:</strong> {data?.shopDetails?.address || "-"}</p>



                                    </div>
                                )}
                            </section>

                            <div className="border-l-4 mt-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
                                <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                                    <i className="fa-solid fa-truck"></i>
                                    Delivery Location
                                </h2>
                                {editDelivery ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Site Name"
                                            value={deliveryForm?.siteName || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Site Supervisor"
                                            value={deliveryForm?.siteSupervisor || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Phone Number"
                                            type="tel"
                                            maxLength={10}
                                            value={deliveryForm?.phoneNumber || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })}
                                            className="w-full"
                                        />
                                        <Input
                                            placeholder="Address"
                                            value={deliveryForm?.address || ""}
                                            onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                                            className="w-full"
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3  justify-end ">
                                            <Button onClick={handleUpdateDelivery} className="w-full sm:w-auto">
                                                <i className="fa-solid fa-save mr-2"></i>Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditDelivery(false)}
                                                className="w-full sm:w-auto"
                                            >
                                                <i className="fa-solid fa-times mr-2"></i>Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-sm sm:text-base">
                                        <p><strong>Site Name:</strong> {data?.deliveryLocationDetails?.siteName || "-"}</p>
                                        <p><strong>Supervisor:</strong> {data?.deliveryLocationDetails?.siteSupervisor || "-"}</p>
                                        <p><strong>Phone:</strong> {data?.deliveryLocationDetails?.phoneNumber || "-"}</p>
                                        <p><strong>Address:</strong> {data?.deliveryLocationDetails?.address || "-"}</p>
                                        <button
                                            onClick={() => { setDeliveryForm(data?.deliveryLocationDetails); setEditDelivery(true); }}
                                            className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
                                        >
                                            <i className="fa-solid fa-edit mr-1"></i>Edit
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Modern header with subtle accent */}
                            <div className="p-6 border-b mt-4 border-gray-100 relative">
                                <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-600 "></div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                                        {/* <p className="text-sm text-gray-500 mt-1">
                                            {hasUnits ? `${selectedUnits.length} items purchased` : 'No orders yet'}
                                        </p> */}
                                    </div>
                                    <div className="flex gap-2">


                                        <Button variant="primary" className=""
                                            onClick={() => navigate('siteorders')}>
                                            <i className="fas fa-box-archive !mr-2"></i>
                                            View Orders from Site
                                        </Button>

                                        <Button variant="danger" className="bg-red-600 text-white"
                                            isLoading={deleteAllPending} onClick={handleDeleteAllSubItems}>
                                            <i className="fas fa-trash !mr-2"></i>
                                            Delete All SubItems
                                        </Button>

                                        {hasUnits && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm">Total:</span>
                                                <span className="text-xl font-bold text-blue-600">₹{totalCost.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="py-2 overflow-y-auto custom-scrollbar ">
                                {hasUnits ? (
                                    <div className="grid gap-5">
                                        {selectedUnits.map((unit: any, idx: number) => (
                                            <div
                                                key={unit._id || idx}
                                                // className={`group relative p-5

                                                //     ${expandedUnitId === unit._id ?
                                                //         'border-blue-600 border-2 shadow-md bg-blue-50' :
                                                //         'border border-blue-500 hover:border-blue-100'
                                                //     }
                                                //     bg-white rounded-xl transition-all shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]`}
                                                className={`group relative p-5 transition-all duration-200
                    ${expandedUnitId === unit._id
                                                        ? "border-2 border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-blue-50 ring-2 ring-blue-200"
                                                        : "border-l-4 border-blue-600 hover:border-blue-600 hover:shadow-md bg-white"
                                                    }
                    rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]`}
                                            >

                                                {/* {expandedUnitId === unit._id && (
                                                    <div className="absolute -top-2 z-[999] -left-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <i className="fa fa-check text-white text-xs"></i>
                                                    </div>
                                                )} */}
                                                <div className="flex flex-col md:flex-row gap-5">
                                                    {/* Product Image */}
                                                    <div className="relative w-full md:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                                                        <img
                                                            src={unit?.image || NO_IMAGE}
                                                            alt={unit.customId || "Product image"}
                                                            className="w-full h-full object-contain p-3"
                                                        />
                                                        <div
                                                            className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                                                        // className={`absolute top-2 right-2 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                                                        // }`}
                                                        >
                                                            ×{unit.quantity}
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 flex flex-col">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3
                                                                    // className="text-lg font-semibold text-gray-800 mb-1.5"
                                                                    className={`text-lg font-semibold mb-1.5 ${expandedUnitId === unit._id ? "text-blue-800" : "text-gray-800"
                                                                        }`}
                                                                >
                                                                    {unit.unitName}
                                                                </h3>
                                                                <div className="flex gap-2 items-center">
                                                                    <span
                                                                        // className="flex cursor-pointer gap-1 items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                                        className={`flex cursor-pointer gap-1 items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${expandedUnitId === unit._id
                                                                            ? "text-blue-700 bg-blue-100 hover:bg-blue-200"
                                                                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                                                            }`}


                                                                    > Total Sub Items : <span className="">{unit?.subItems?.length || 0}</span></span>
                                                                    <button
                                                                        onClick={() =>
                                                                            setExpandedUnitId(
                                                                                expandedUnitId === unit._id ? null : unit._id
                                                                            )
                                                                        }
                                                                        // className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                                        className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${expandedUnitId === unit._id
                                                                            ? "text-white bg-blue-600 hover:bg-blue-700 shadow-md"
                                                                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                                                            }`}
                                                                    >
                                                                        <span className="hidden sm:inline">
                                                                            {/* {expandedUnitId === unit._id ? 'Hide' : 'Show'} Sub Items */}
                                                                            Create Material Items
                                                                        </span>
                                                                        <i
                                                                            className={`fa ${expandedUnitId === unit._id
                                                                                ? "fa-chevron-up"
                                                                                : "fa-chevron-down"
                                                                                } transition-transform`}
                                                                        ></i>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span
                                                                    // className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                                                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${expandedUnitId === unit._id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                                                        }`}
                                                                >
                                                                    {unit.category || "Generic"}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                                                                    <p className="font-medium">₹{unit.singleUnitCost.toFixed(2)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500 mb-1">Quantity</p>
                                                                    <p className="font-medium">{unit.quantity}</p>
                                                                </div>


                                                                {unit?.dimention && <div>
                                                                    <p className="text-sm text-gray-500 mb-1">Dimentions</p>
                                                                    <p className="font-medium">Height: {unit?.dimention?.height || 0}mm</p>
                                                                    <p className="font-medium">depth: {unit?.dimention?.depth || 0}mm</p>
                                                                    <p className="font-medium">width: {unit?.dimention?.width || 0}mm</p>
                                                                </div>}

                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-sm text-gray-500">Item Total</p>
                                                                <p className="text-lg font-bold text-blue-600">
                                                                    ₹{(unit.singleUnitCost * unit.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {expandedUnitId === unit._id && (
                                                    <div
                                                        // className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4"
                                                        className="mt-6 pt-4 border-t-2 border-blue-200 bg-gradient-to-r from-white to-white rounded-lg p-4"

                                                    >
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <i className="fa-solid fa-list text-blue-600"></i>
                                                            <h4 className="font-semibold text-blue-800">Sub Items</h4>
                                                            <span className="text-sm text-gray-500">(Click to edit, changes save by clicking Enter)</span>
                                                        </div>

                                                        {/* Spreadsheet Header */}
                                                        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                                                            <div
                                                                className="grid grid-cols-17 gap-0 bg-gradient-to-r from-blue-100 to-blue-100 border-b-2 border-blue-200"
                                                            >
                                                                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                                    Ref ID
                                                                </div>
                                                                <div className="col-span-8 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                                    Material Name
                                                                </div>
                                                                <div className="col-span-2 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                                    Quantity
                                                                </div>
                                                                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                                                    Unit
                                                                </div>
                                                                <div className="col-span-1 px-4 py-3 text-sm font-medium text-gray-700">
                                                                    Action
                                                                </div>
                                                            </div>

                                                            {/* Existing Sub Items */}
                                                            {unit.subItems && unit.subItems.length > 0 && unit.subItems.map((sub: SubItem) => (
                                                                <div key={sub._id} className="grid grid-cols-17 gap-0 border-b border-gray-100 hover:bg-gray-50">
                                                                    {/* Item Name Cell */}
                                                                    <div className="col-span-3 border-r border-blue-200">

                                                                        <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                                            {sub?.refId || "N/A"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-span-8 border-r border-blue-200">
                                                                        {editingCell?.subItemId === sub._id && editingCell?.field === 'name' ? (
                                                                            <input
                                                                                ref={inputRef}
                                                                                type="text"
                                                                                defaultValue={sub.subItemName}
                                                                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                                                onBlur={(e) => {
                                                                                    handleSaveEdit(unit._id, sub._id, 'name', e.target.value);
                                                                                    setEditingCell(null);
                                                                                }}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        const value = (e.target as HTMLInputElement).value;
                                                                                        handleSaveEdit(unit._id, sub._id, 'name', value);
                                                                                        setEditingCell(null);
                                                                                    }
                                                                                    if (e.key === 'Escape') {
                                                                                        setEditingCell(null);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                                                onClick={() => setEditingCell({ subItemId: sub._id, field: 'name' })}
                                                                            >
                                                                                {sub.subItemName}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {/* Quantity Cell */}
                                                                    <div className="col-span-2 border-r border-blue-200">
                                                                        {editingCell?.subItemId === sub._id && editingCell?.field === 'quantity' ? (
                                                                            <input
                                                                                ref={inputRef}
                                                                                type="number"
                                                                                defaultValue={sub.quantity}
                                                                                min="0"
                                                                                className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                                                                onBlur={(e) => {
                                                                                    handleSaveEdit(unit._id, sub._id, 'quantity', e.target.value);
                                                                                    setEditingCell(null);
                                                                                }}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        handleSaveEdit(unit._id, sub._id, 'quantity', e.currentTarget.value);
                                                                                        setEditingCell(null);
                                                                                    }
                                                                                    if (e.key === 'Escape') {
                                                                                        setEditingCell(null);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                                                onClick={() => setEditingCell({ subItemId: sub._id, field: 'quantity' })}
                                                                            >
                                                                                {sub.quantity}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Unit Cell */}
                                                                    <div className="col-span-3 border-r border-blue-200">
                                                                        {editingCell?.subItemId === sub._id && editingCell?.field === 'unit' ? (
                                                                            <div className="p-2 relative z-50">
                                                                                <select
                                                                                    defaultValue={sub.unit}
                                                                                    onChange={(e) => {
                                                                                        handleSaveEdit(unit._id, sub._id, 'unit', e.target.value);
                                                                                        setEditingCell(null);
                                                                                    }}
                                                                                    className="w-full relative z-[50] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                                >
                                                                                    <option value="" disabled>Selected unit</option>
                                                                                    {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                                                        <option key={unitOption} value={unitOption}>
                                                                                            {unitOption}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                                                                onClick={() => setEditingCell({ subItemId: sub._id, field: 'unit' })}
                                                                            >
                                                                                {sub.unit}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Delete Action */}
                                                                    <div className="col-span-1 flex items-center justify-center">
                                                                        <Button
                                                                            variant="danger"
                                                                            onClick={() => handleDelete(unit._id, sub._id)}
                                                                            disabled={deleteItemLoading}
                                                                            isLoading={deleteItemLoading}
                                                                            className="p-2 bg-red-600 text-white  hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                                                            title="Delete item"
                                                                        >
                                                                            <i className="fa fa-trash text-sm"></i>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* New Row for Adding Items */}
                                                            <div className="grid grid-cols-17 gap-0 bg-green-50 border-b border-gray-100">
                                                                {/* New Item Name */}


                                                                <div className="col-span-3 border-r border-gray-200">

                                                                    <div className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50">
                                                                        Ref Id
                                                                    </div>
                                                                </div>


                                                                <div className="col-span-8 border-r border-gray-200">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter matterial name..."
                                                                        value={newRowData[unit._id]?.name || ''}
                                                                        onChange={(e) => {
                                                                            setNewRowData(prev => ({
                                                                                ...prev,
                                                                                [unit._id]: {
                                                                                    ...prev[unit._id],
                                                                                    name: e.target.value
                                                                                }
                                                                            }));
                                                                        }}
                                                                        onBlur={() => {
                                                                            if (newRowData[unit._id]?.name?.trim() &&
                                                                                newRowData[unit._id]?.unit) {
                                                                                handleNewRowSave(unit._id, newRowData);
                                                                            }
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                handleNewRowSave(unit._id, newRowData);
                                                                            }
                                                                        }}
                                                                        className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                                                    />
                                                                </div>

                                                                {/* New Quantity */}
                                                                <div className="col-span-2 border-r border-gray-200">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Qty"
                                                                        min="0"
                                                                        value={newRowData[unit._id]?.quantity || 1}
                                                                        onChange={(e) => {
                                                                            setNewRowData(prev => ({
                                                                                ...prev,
                                                                                [unit._id]: {
                                                                                    ...prev[unit._id],
                                                                                    quantity: Number(e.target.value) || 1
                                                                                }
                                                                            }));
                                                                        }}
                                                                        className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder-gray-400"
                                                                    />
                                                                </div>

                                                                {/* New Unit */}
                                                                <div className="col-span-3 border-r border-gray-200">
                                                                    <div className="p-2">


                                                                        <select
                                                                            value={newRowData[unit._id]?.unit || ''}
                                                                            onChange={async (e) => {

                                                                                const updatedRow = {
                                                                                    ...newRowData[unit._id],
                                                                                    unit: e.target.value
                                                                                };

                                                                                // update state
                                                                                setNewRowData(prev => ({
                                                                                    ...prev,
                                                                                    [unit._id]: updatedRow
                                                                                }));

                                                                                // setNewRowData(prev => ({
                                                                                //     ...prev,
                                                                                //     [unit._id]: {
                                                                                //         ...prev[unit._id],
                                                                                //         unit: e.target.value
                                                                                //     }
                                                                                // }));


                                                                                await handleNewRowSave(unit._id, updatedRow);

                                                                            }}
                                                                            className="w-full relative z-[50] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                        >
                                                                            <option value="">Selected unit</option>
                                                                            {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                                                <option key={unitOption} value={unitOption}>
                                                                                    {unitOption}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {/* Add Icon */}
                                                                {/* <div onClick={() => {
                                                                   
                                                                    handleNewRowSave(unit._id, newRowData)
                                                                }} className="col-span-1 cursor-pointer flex items-center justify-center">
                                                                    {addItemLoading && <i className="fas fa-spinner animate-spin mr-2"></i>}
                                                                    <i className="fa fa-plus text-green-600 text-sm"></i>
                                                                </div> */}
                                                            </div>

                                                            {/* Empty State */}
                                                            {(!unit.subItems || unit.subItems.length === 0) && (
                                                                <div className="text-center py-8 text-gray-500">
                                                                    <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                                                                    <p className="text-sm">No sub-items yet. Start typing in the row above to add items.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 text-blue-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Order History</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                                            Your completed orders will appear here
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    <section className="mt-4">
                        {/* <GenerateWhatsappLink
                            projectId={projectId!} context="order material"
                            stage="ordermaterial"
                            data={data?.generatedLink}
                            isPending={generatePending}
                            generateLink={generateLink} /> */}


                        <div className="space-y-4">



                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            Export Order Material
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Generate a PDF document of your order materials
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleGenerate}
                                        disabled={generatePending}
                                        className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                        size="lg"
                                    >
                                        {generatePending ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-file-pdf"></i>
                                                Generate PDF
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {data?.generatedLink && data?.generatedLink?.length > 0 ?

                                    data?.generatedLink?.map((ele: any) => (
                                        <Card key={ele._id} className="border-green-200 bg-green-50 ">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <i className="fas fa-check-circle text-green-600"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-green-900 mb-1">
                                                                {/* PDF Generated Successfully */}
                                                                {ele.pdfName}
                                                            </h4>
                                                            <span className="text-sm">Pdf Reference Id: {ele.refUniquePdf || "N/A"}</span>
                                                            <p className="text-sm text-green-700">
                                                                Your order material PDF is ready to view or download
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => window.open(ele.url, "_blank")}
                                                            className="border-green-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                        >
                                                            <i className="fas mr-2 fa-external-link-alt"></i>
                                                            View in New Tab
                                                        </Button>

                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => downloadImage({ src: ele.url, alt: "order material" })}
                                                            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                                        >
                                                            Download PDF
                                                        </Button>


                                                        <div className="relative  min-w-[160px]">
                                                            <label
                                                                htmlFor={`pdf-status-${ele._id}`}
                                                                className="hidden md:block mb-1 text-sm font-medium text-gray-600 absolute top-[-20px]"
                                                            >
                                                                Order Status
                                                            </label>
                                                            <select
                                                                id={`pdf-status-${ele._id}`}
                                                                value={ele.status || "pending"}
                                                                onChange={async (e) => {
                                                                    const val = e.target.value;
                                                                    await handleUpdatePdfStatus(ele._id, val);
                                                                }}
                                                                className="
                                                                                    w-full h-[45px] px-3 py-2 text-md  bg-white border  rounded-xl shadow 
                                                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                                                    disabled:opacity-50 appearance-none transition ease-in-out
                                                                                    border-blue-300 text-blue-800  hover:border-blue-400
                                                                                    "
                                                            >
                                                                {/* <option disabled value="">Select Status</option> */}
                                                                {["pending", "delivered", "shipped", "ordered", "cancelled"].map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            {/* Custom dropdown chevron icon */}
                                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                                                <i className="fas fa-chevron-down text-xs"></i>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            variant="danger"
                                                            isLoading={deletePdfLoading}
                                                            onClick={() => handleDeletePdf(ele._id)}
                                                            className="border-red-300 bg-red-600 text-white hover:bg-red-600 hover:border-red-400"
                                                        >
                                                            Delete PDF
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                    :
                                    <>
                                        <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                                            <i className="fa-solid fa-file-lines text-5xl text-blue-300 mb-4" />
                                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Pdf Found</h3>
                                            <p className="text-sm text-gray-500">
                                                No PDF Generated</p>
                                        </div>
                                    </>
                                }
                            </div>


                            {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Generator</h3>
                                        <p className="text-sm text-gray-600">Generate and manage your order material PDF</p>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleGenerate}
                                            disabled={generatePending}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 min-w-[160px] justify-center"
                                        >
                                            {generatePending ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-file-pdf"></i>
                                                    Generate PDF
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {data?.generatedLink && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <i className="fas fa-check-circle text-green-600"></i>
                                                <span className="text-green-800 font-medium">PDF Ready!</span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => window.open(data.generatedLink, "_blank")}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 font-medium rounded-md transition-colors duration-200"
                                                >
                                                    <i className="fas fa-external-link-alt"></i>
                                                    View PDF
                                                </button>

                                                <button
                                                    onClick={() => downloadImage({ src: data.generatedLink, alt: "order material" })}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200"
                                                >
                                                    <i className="fas fa-download"></i>
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div> */}

                        </div>
                    </section>
                </div>
            )
            }
        </div >
    )
}

export default OrderMaterialOverview;



