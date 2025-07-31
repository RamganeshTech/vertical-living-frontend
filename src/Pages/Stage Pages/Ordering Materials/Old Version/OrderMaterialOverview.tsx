// import { Outlet, useNavigate, useParams, useOutletContext } from "react-router-dom";
// import { useCompleteOrderingMaterialStage, useGenerateOrderingMaterialLink, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline, useUpdateDeliveryLocation, useUpdateShopDetails } from "../../../../apiList/Stage Api/orderingMaterialApi";
// import GenerateWhatsappLink from "../../../../shared/GenerateWhatsappLink";
// import { useState } from "react";
// import { toast } from "../../../../utils/toast";
// import { Input } from "../../../../components/ui/Input";
// import { Button } from "../../../../components/ui/Button";
// import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { Card } from "../../../../components/ui/Card";
// import StageTimerInfo from "../../../../shared/StagetimerInfo";
// import { ResetStageButton } from "../../../../shared/ResetStageButton";
// import AssignStageStaff from "../../../../shared/AssignStaff";
// import ShareDocumentWhatsapp from "../../../../shared/ShareDocumentWhatsapp";

// interface ProjectDetailsOutlet {
//   isMobile: boolean;
//   openMobileSidebar: () => void;
// }

// const OrderMaterialOverview = () => {
//   const { projectId, organizationId } = useParams();
//   const navigate = useNavigate();
//   const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();

//   const isChildRoute = location.pathname.includes("/ordermaterialroom");

//   const [editShop, setEditShop] = useState(false);
//   const [editDelivery, setEditDelivery] = useState(false);
//   const [shopForm, setShopForm] = useState<any>({});
//   const [deliveryForm, setDeliveryForm] = useState<any>({});

//   const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterial(projectId!);
//   const { mutateAsync: generateLink, isPending: generatePending } = useGenerateOrderingMaterialLink()

//   const { mutateAsync: updateShop } = useUpdateShopDetails();
//   const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();

//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialDeadline()
//   const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialStage()

//   const handleUpdateShop = async () => {
//     try {

//       if (shopForm.phoneNumber) {
//         if (!/^\d{10}$/.test(shopForm.phoneNumber.trim())) {
//           throw new Error("Phone number should contain exactly 10 digit numbers")
//         }
//       }

//       await updateShop({ projectId: projectId!, updates: shopForm });
//       toast({ title: "Success", description: "Shop Details Updated" });
//       setEditShop(false);
//       refetch()
//     } catch (error: any) {
//       toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
//     }
//   };

//   const handleUpdateDelivery = async () => {
//     try {

//       if (deliveryForm.phoneNumber) {
//         if (!/^\d{10}$/.test(deliveryForm.phoneNumber.trim())) {
//           throw new Error("Phone number should contain exactly 10 digit numbers")
//         }
//       }

//       await updateDelivery({ projectId: projectId!, updates: deliveryForm });
//       setEditDelivery(false);
//       toast({ title: "Success", description: "Delivery Details Updated" });
//       refetch()

//     } catch (error: any) {
//       toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Update failed" });
//     }
//   };

//   const handleCompletionStatus = async () => {
//     try {
//       await completionStatus({ projectId: projectId! });
//       toast({ description: 'Completion status updated successfully', title: "Success" });
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })
//     }
//   };

//   if (isLoading) return <MaterialOverviewLoading />;

//   const roomKeys = Object.keys(data?.materialOrderingList || {});
//   const { shopDetails, deliveryLocationDetails, generatedLink, materialOrderingList } = data || {};

//   return (
//     <div className="w-full h-full flex flex-col">
//       {isChildRoute ? (
//         /* Child Route Content */
//         <Outlet />
//       ) : (
//         /* Parent Component Content */
//         <>
//           {/* Header Section - Always visible */}
//           <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//             <h2 className="text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 flex items-center">
//               {isMobile && (
//                 <button
//                   onClick={openMobileSidebar}
//                   className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
//                   title="Open Menu"
//                 >
//                   <i className="fa-solid fa-bars"></i>
//                 </button>
//               )}
//               <i className="fa-solid fa-cart-shopping mr-2"></i>
//               <span className="hidden sm:inline">Ordering Material</span>
//               <span className="sm:hidden">Order Material</span>
//             </h2>

//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <Button
//                 isLoading={completePending}
//                 onClick={handleCompletionStatus}
//                 className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto whitespace-nowrap"
//               >
//                 <i className="fa-solid fa-circle-check mr-2"></i>
//                 Mark as Complete
//               </Button>

//               <ResetStageButton
//                 projectId={projectId!}
//                 stageNumber={8}
//                 stagePath="orderingmaterial"
//               />


//               {!getAllError && <ShareDocumentWhatsapp
//                 projectId={projectId!}
//                 stageNumber="8"
//                 className="w-full sm:w-fit"
//                 isStageCompleted={data?.status}
//               />}

//               <AssignStageStaff
//                 stageName="OrderingMaterialModel"
//                 projectId={projectId!}
//                 organizationId={organizationId!}
//                 currentAssignedStaff={data?.assignedTo || null}
//               />
//             </div>
//           </div>

//           {/* Error Display */}
//           {isError && (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="max-w-xl p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                 <div className="text-red-600 font-semibold mb-2">
//                   ⚠️ Error Occurred
//                 </div>
//                 <p className="text-red-500 text-sm mb-4">
//                   {(getAllError as any)?.response?.data?.message || "Failed to load ordering material"}
//                 </p>
//                 <Button
//                   isLoading={isLoading}
//                   onClick={() => refetch()}
//                   className="bg-red-600 text-white hover:bg-red-700"
//                 >
//                   Retry
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Main Content - Only show if no error */}
//           {!isError && (
//             <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
//               {/* Timer Card */}
//               <Card className="p-4 w-full shadow border-l-4 border-blue-600 bg-white">
//                 <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//                   <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//                   <span>Stage Timings</span>
//                 </div>
//                 <StageTimerInfo
//                   completedAt={data?.timer?.completedAt}
//                   stageName="orderingmaterial"
//                   formId={(data as any)?._id}
//                   projectId={projectId!}
//                   deadLine={data?.timer?.deadLine}
//                   startedAt={data?.timer?.startedAt}
//                   refetchStageMutate={refetch}
//                   deadLineMutate={deadLineAsync}
//                   isPending={deadLinePending}
//                 />
//               </Card>

//               {/* Shop Details */}
//               <div className="border-l-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
//                 <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
//                   <i className="fa-solid fa-store"></i>
//                   Shop Details
//                 </h2>
//                 {editShop ? (
//                   <div className="space-y-3">
//                     <Input
//                       placeholder="Shop Name"
//                       value={shopForm.shopName || ""}
//                       onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
//                       className="w-full"
//                     />
//                     <Input
//                       placeholder="Contact Person"
//                       value={shopForm.contactPerson || ""}
//                       onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
//                       className="w-full"
//                     />
//                     <Input
//                       placeholder="Phone Number"
//                       value={shopForm.phoneNumber || ""}
//                       type="tel"
//                       maxLength={10}
//                       onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })}
//                       className="w-full"
//                     />
//                     <Input
//                       placeholder="Address"
//                       value={shopForm.address || ""}
//                       onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
//                       className="w-full"
//                     />
//                     <div className="flex flex-col sm:flex-row gap-2 mt-3">
//                       <Button onClick={handleUpdateShop} className="w-full sm:w-auto">
//                         <i className="fa-solid fa-save mr-2"></i>Save
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => setEditShop(false)}
//                         className="w-full sm:w-auto"
//                       >
//                         <i className="fa-solid fa-times mr-2"></i>Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 text-sm sm:text-base">
//                     <p><strong>Shop Name:</strong> {shopDetails?.shopName || "-"}</p>
//                     <p><strong>Contact Person:</strong> {shopDetails?.contactPerson || "-"}</p>
//                     <p><strong>Phone:</strong> {shopDetails?.phoneNumber || "-"}</p>
//                     <p><strong>Address:</strong> {shopDetails?.address || "-"}</p>
//                     {data?.status !== "completed" && (
//                       <button
//                         onClick={() => { setShopForm(shopDetails); setEditShop(true); }}
//                         className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
//                       >
//                         <i className="fa-solid fa-edit mr-1"></i>Edit
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Delivery Location */}
//               <div className="border-l-4 border-blue-600 rounded-lg p-4 shadow-sm relative bg-white">
//                 <h2 className="text-base sm:text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
//                   <i className="fa-solid fa-truck"></i>
//                   Delivery Location
//                 </h2>
//                 {editDelivery ? (
//                   <div className="space-y-3">
//                     <Input
//                       placeholder="Site Name"
//                       value={deliveryForm.siteName || ""}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })}
//                       className="w-full"
//                     />
//                     <Input
//                       placeholder="Site Supervisor"
//                       value={deliveryForm.siteSupervisor || ""}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })}
//                       className="w-full"
//                     />
//                     <Input
//                       placeholder="Phone Number"
//                       type="tel"
//                       maxLength={10}
//                       value={deliveryForm.phoneNumber || ""}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })}
//                       className="w-full"
//                     />
//                     <Input
//                       placeholder="Address"
//                       value={deliveryForm.address || ""}
//                       onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
//                       className="w-full"
//                     />
//                     <div className="flex flex-col sm:flex-row gap-2 mt-3">
//                       <Button onClick={handleUpdateDelivery} className="w-full sm:w-auto">
//                         <i className="fa-solid fa-save mr-2"></i>Save
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => setEditDelivery(false)}
//                         className="w-full sm:w-auto"
//                       >
//                         <i className="fa-solid fa-times mr-2"></i>Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 text-sm sm:text-base">
//                     <p><strong>Site Name:</strong> {deliveryLocationDetails?.siteName || "-"}</p>
//                     <p><strong>Supervisor:</strong> {deliveryLocationDetails?.siteSupervisor || "-"}</p>
//                     <p><strong>Phone:</strong> {deliveryLocationDetails?.phoneNumber || "-"}</p>
//                     <p><strong>Address:</strong> {deliveryLocationDetails?.address || "-"}</p>
//                     {data?.status !== "completed" && (
//                       <button
//                         onClick={() => { setDeliveryForm(deliveryLocationDetails); setEditDelivery(true); }}
//                         className="absolute top-3 right-4 text-blue-600 text-xs sm:text-sm underline hover:text-blue-800"
//                       >
//                         <i className="fa-solid fa-edit mr-1"></i>Edit
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Rooms Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {roomKeys.map((roomKey) => {
//                   const roomItems = materialOrderingList[roomKey] || [];
//                   return (
//                     <div
//                       key={roomKey}
//                       className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white transform hover:scale-[1.02]"
//                       onClick={() => navigate(`ordermaterialroom/${roomKey}`)}
//                     >
//                       <h3 className="text-sm sm:text-base font-semibold capitalize text-blue-800 mb-2 flex items-center gap-2">
//                         <i className="fa-solid fa-door-open"></i>
//                         {roomKey.replace(/([A-Z])/g, ' $1')}
//                       </h3>
//                       <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                         <i className="fa-solid fa-box mr-1"></i>
//                         Items: {roomItems.length}
//                       </p>
//                       <p className="text-xs text-gray-400 flex items-center gap-1">
//                         <i className="fa-solid fa-mouse-pointer"></i>
//                         Click to view details
//                       </p>
//                     </div>
//                   )
//                 })}



//               </div>
//               <section className="mt-4">
//                 {/* 🔗 Shareable Link */}
//                 <GenerateWhatsappLink
//                   projectId={projectId!} context="order material"
//                   stage="ordermaterial"
//                   data={generatedLink}
//                   isPending={generatePending}
//                   generateLink={generateLink} />
//               </section>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }



// export default OrderMaterialOverview;