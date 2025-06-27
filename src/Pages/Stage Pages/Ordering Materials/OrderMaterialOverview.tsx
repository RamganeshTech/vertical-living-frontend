{// // File: OrderingMaterialOverview.tsx
// import { useParams, useNavigate, Outlet } from "react-router-dom";
// import { useCompleteOrderingMaterialStage, useGetOrderingMaterialStage, useSetOrderingMaterialDeadline } from "../../../apiList/Stage Api/orderingMaterialApi";
// import { Card } from "../../../components/ui/Card";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import { toast } from "../../../utils/toast";
// import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { Button } from "../../../components/ui/Button";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import StageTimerInfo from "../../../shared/StagetimerInfo";


// const OrderMaterialOverview = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const { data, isLoading, isError, error: getAllError, refetch } = useGetOrderingMaterialStage({ projectId: projectId! });


//   const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialDeadline()
//   const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialStage()


//   if (isLoading) return <MaterialOverviewLoading />;
//   if (isError) return <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//     <div className="text-red-600 text-xl font-semibold mb-2">
//       ⚠️ Oops! An Error Occurred
//     </div>
//     <p className="text-red-500 text-sm mb-4">{(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Failed to load , please try again"}</p>

//     <Button
//       isLoading={isLoading}
//       onClick={() => refetch()}
//       className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
//     >
//       Retry
//     </Button>
//   </div>;

//   // console.log(data)

//   const isChildRoute = location.pathname.includes("/ordermaterialroom");

//   const handleCompletionStatus = async () => {
//     try {
//       await completionStatus({ projectId: projectId! });
//       toast({ description: 'Completion status updated successfully', title: "Success" });
//     } catch (error: any) {
//       toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

//     }
//   };


//   return (
//     <div className="p-4">
//       {!isChildRoute ? <>
//         <div className="flex justify-between w-full">
//           <h2 className="text-xl font-semibold mb-4">Ordering Material Stage</h2>
//           <div className="flex gap-2 items-center ">
//             <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
//               <i className="fa-solid fa-circle-check mr-2"></i>
//               Mark as Complete
//             </Button>

//             <ResetStageButton projectId={projectId!} stageNumber={8} stagePath="orderingmaterial" />
//           </div>
//         </div>



//         <section className="mb-4">
//           <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
//             <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
//               <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
//               <span>Stage Timings</span>
//             </div>

//             <StageTimerInfo
//               completedAt={data?.timer?.completedAt}
//               formId={(data as any)?._id}
//               deadLine={data?.timer?.deadLine}
//               startedAt={data?.timer?.startedAt}
//               refetchStageMutate={refetch}
//               deadLineMutate={deadLineAsync}
//               isPending={deadLinePending}
//             />
//           </Card>
//         </section>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {data?.rooms?.map((room: any) => (
//             <div

//               key={room._id}
//               onClick={() => navigate(`ordermaterialroom/${room._id}`)}
//               className="cursor-pointer border-l-6 border-blue-600 shadow-md hover:border-blue-400 transition-all duration-200 rounded-lg p-5 bg-white hover:shadow-lg flex items-center gap-4"

//             >
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-1">{room.roomName}</h3>
//                 <p className="text-sm text-blue-500">No of Fields: {room.materials?.length || 0}</p>
//               </div>

//               <div className="text-sm text-blue-600 font-medium underline hover:no-underline">
//                 View →
//               </div>
//             </div>
//           ))}
//         </div>
//       </>
//         :
//         <Outlet />}
//     </div>
//   );
// };

// export default OrderMaterialOverview;

}



import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useCompleteOrderingMaterialStage, useGenerateOrderingMaterialLink, useGetAllOrderingMaterial, useSetOrderingMaterialDeadline, useUpdateDeliveryLocation, useUpdateShopDetails } from "../../../apiList/Stage Api/orderingMaterialApi";
import GenerateWhatsappLink from "../../../shared/GenerateWhatsappLink";
import { useState } from "react";
import { toast } from "../../../utils/toast";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
import { ResetStageButton } from "../../../shared/ResetStageButton";

const OrderMaterialOverview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const isChildRoute = location.pathname.includes("/ordermaterialroom");

  const [editShop, setEditShop] = useState(false);
  const [editDelivery, setEditDelivery] = useState(false);
  const [shopForm, setShopForm] = useState<any>({});
  const [deliveryForm, setDeliveryForm] = useState<any>({});



  const { data, isLoading, isError, error: getAllError, refetch } = useGetAllOrderingMaterial(projectId!);
  const { mutateAsync: generateLink, isPending: generatePending } = useGenerateOrderingMaterialLink()


  const { mutateAsync: updateShop } = useUpdateShopDetails();
  const { mutateAsync: updateDelivery } = useUpdateDeliveryLocation();

  const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetOrderingMaterialDeadline()
  const { mutateAsync: completionStatus, isPending: completePending } = useCompleteOrderingMaterialStage()


  const handleUpdateShop = async () => {
    try {
      await updateShop({ projectId: projectId!, updates: shopForm });
      toast({ title: "Success", description: "Shop Details Updated" });
      setEditShop(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || "Update failed" });
    }
  };

  const handleUpdateDelivery = async () => {
    try {
      await updateDelivery({ projectId: projectId!, updates: deliveryForm });
      toast({ title: "Success", description: "Delivery Details Updated" });
      setEditDelivery(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || "Update failed" });
    }
  };


  const handleCompletionStatus = async () => {
    try {
      await completionStatus({ projectId: projectId! });
      toast({ description: 'Completion status updated successfully', title: "Success" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to update completion status", variant: "destructive" })

    }
  };

  const roomKeys = Object.keys(data?.materialOrderingList || {});

  if (isLoading) return <MaterialOverviewLoading />;
  if (isError) return <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
    <div className="text-red-600 text-xl font-semibold mb-2">
      ⚠️ Oops! An Error Occurred
    </div>
    <p className="text-red-500 text-sm mb-4">{(getAllError as any)?.response?.data?.message || (getAllError as any)?.message || "Failed to load , please try again"}</p>

    <Button
      isLoading={isLoading}
      onClick={() => refetch()}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
    >
      Retry
    </Button>
  </div>;



  const { shopDetails, deliveryLocationDetails, generatedLink, materialOrderingList, isEditable } = data;

  return (
    <>
      {!isChildRoute ? <><div className="space-y-6 mt-4 h-full overflow-y-auto">
        <div className="flex justify-between w-full">
           <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
               <i className="fa-solid fa-cart-shopping mr-2"></i>Ordering Material 
              </h2>
          <div className="flex gap-2 items-center ">
            <Button isLoading={completePending} onClick={handleCompletionStatus} className="bg-green-600 mt-0 h-10 hover:bg-green-700 text-white w-full sm:w-auto">
              <i className="fa-solid fa-circle-check mr-2"></i>
              Mark as Complete
            </Button>

            <ResetStageButton projectId={projectId!} stageNumber={8} stagePath="orderingmaterial" />
          </div>
        </div>

        <section className="mb-4">
          <Card className="p-4 mb-4 w-full shadow-[1px] border-l-4 border-blue-600 bg-white">
            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
              <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
              <span>Stage Timings</span>
            </div>
            <StageTimerInfo
              completedAt={data?.timer?.completedAt}
              formId={(data as any)?._id}
              deadLine={data?.timer?.deadLine}
              startedAt={data?.timer?.startedAt}
              refetchStageMutate={refetch}
              deadLineMutate={deadLineAsync}
              isPending={deadLinePending}
            />
          </Card>
        </section>

        {/* 🛒 Shop Details */}
        <div className="border rounded-lg p-4 shadow-sm relative">
          <h2 className="text-lg font-bold mb-2 text-blue-700">Shop Details</h2>
          {editShop ? (
            <div className="space-y-2">
              <Input placeholder="Shop Name" value={shopForm.shopName || ""} onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })} />
              <Input placeholder="Contact Person" value={shopForm.contactPerson || ""} onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })} />
              <Input placeholder="Phone Number" value={shopForm.phoneNumber || ""} onChange={(e) => setShopForm({ ...shopForm, phoneNumber: e.target.value })} />
              <Input placeholder="Address" value={shopForm.address || ""} onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })} />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleUpdateShop}>Save</Button>
                <Button variant="outline" onClick={() => setEditShop(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Shop Name:</strong> {shopDetails?.shopName || "-"}</p>
              <p><strong>Contact Person:</strong> {shopDetails?.contactPerson || "-"}</p>
              <p><strong>Phone:</strong> {shopDetails?.phoneNumber || "-"}</p>
              <p><strong>Address:</strong> {shopDetails?.address || "-"}</p>
              {isEditable && <button onClick={() => { setShopForm(shopDetails); setEditShop(true); }} className="absolute top-3 right-4 text-blue-600 text-xs underline">Edit</button>}
            </>
          )}
        </div>

        {/* 📦 Delivery Location */}
        <div className="border rounded-lg p-4 shadow-sm relative">
          <h2 className="text-lg font-bold mb-2 text-blue-700">Delivery Location</h2>
          {editDelivery ? (
            <div className="space-y-2">
              <Input placeholder="Site Name" value={deliveryForm.siteName || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, siteName: e.target.value })} />
              <Input placeholder="Site Supervisor" value={deliveryForm.siteSupervisor || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, siteSupervisor: e.target.value })} />
              <Input placeholder="Phone Number" value={deliveryForm.phoneNumber || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, phoneNumber: e.target.value })} />
              <Input placeholder="Address" value={deliveryForm.address || ""} onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })} />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleUpdateDelivery}>Save</Button>
                <Button variant="outline" onClick={() => setEditDelivery(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Site Name:</strong> {deliveryLocationDetails?.siteName || "-"}</p>
              <p><strong>Supervisor:</strong> {deliveryLocationDetails?.siteSupervisor || "-"}</p>
              <p><strong>Phone:</strong> {deliveryLocationDetails?.phoneNumber || "-"}</p>
              <p><strong>Address:</strong> {deliveryLocationDetails?.address || "-"}</p>
              {isEditable && <button onClick={() => { setDeliveryForm(deliveryLocationDetails); setEditDelivery(true); }} className="absolute top-3 right-4 text-blue-600 text-xs underline">Edit</button>}
            </>
          )}
        </div>

        {/* 🧱 Rooms as Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomKeys.map((roomKey) => {
            const roomItems = materialOrderingList[roomKey] || [];
            return (
              <div
                key={roomKey}
                className="border-l-4 border-blue-600 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white"
                onClick={() => navigate(`ordermaterialroom/${roomKey}`)}

              >
                <h3 className="text-md font-semibold capitalize text-blue-800">{roomKey.replace(/([A-Z])/g, ' $1')}</h3>
                <p className="text-sm text-gray-600">Items: {roomItems.length}</p>
                <p className="text-xs text-gray-400">Click to view details</p>
              </div>
            );
          })}
        </div>

        <section className="mt-4">
          {/* 🔗 Shareable Link */}
          <GenerateWhatsappLink 
          projectId={projectId!} context="order material" 
          stage="ordermaterial"
          data={generatedLink} 
          isPending={generatePending} 
          generateLink={generateLink} />
        </section>
      </div>
      </>
        :
        <Outlet />
      }
    </>
  );
};

export default OrderMaterialOverview;
