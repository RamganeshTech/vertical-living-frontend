// import React, { useState } from "react";
// import { useCreateVehicle,
// useDeleteVehicle,
// useGetVehicles,
// useUpdateVehicle, } from "../../../apiList/Department Api/Logistics Api/logisticsApi";
// import { LogisticsVehicleForm } from "./LogsiticsVehicleForm";
// import { useParams } from "react-router-dom";
// import { Button } from "../../../components/ui/Button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card";
// // import {
// //   useCreateVehicle,
// //   useDeleteVehicle,
// //   useGetVehicles,
// //   useUpdateVehicle,
// // } from "../../hooks/logistics.hooks";
// // import { LogisticsVehicleForm } from "./LogisticsVehicleForm";


// const LogisticsVehicle: React.FC = () => {
//     const {organizationId} = useParams() as {organizationId:string}
//   const { data: vehicles, isLoading, isError } = useGetVehicles(organizationId);
//   const { mutateAsync: createVehicle } = useCreateVehicle();
//   const { mutateAsync: updateVehicle } = useUpdateVehicle();
//   const { mutateAsync: deleteVehicle } = useDeleteVehicle();

//   const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
//   const [showForm, setShowForm] = useState(false);

//   const handleDelete = async (vehicleId: string) => {
//     await deleteVehicle({ vehicleId, organizationId });
//   };

//   return (
//     // <div className="p-6">
//     //   <div className="flex justify-between items-center mb-4">
//     //     <h2 className="text-2xl font-semibold">Logistics Vehicles</h2>
//     //     <button
//     //       className="px-4 py-2 bg-blue-600 text-white rounded shadow"
//     //       onClick={() => {
//     //         setEditingVehicle(null);
//     //         setShowForm(true);
//     //       }}
//     //     >
//     //       <i className="fas fa-plus mr-2" />
//     //       Add Vehicle
//     //     </button>
//     //   </div>

//     //   {isLoading ? (
//     //     <p>Loading vehicles...</p>
//     //   ) : isError ? (
//     //     <p className="text-red-600">Failed to load vehicles.</p>
//     //   ) : (
//     //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     //       {vehicles?.map((v: any) => (
//     //         <div key={v._id} className="border p-4 rounded bg-white shadow">
//     //           <h3 className="text-lg font-bold">{v.vehicleNumber}</h3>
//     //           <p>Type: {v.vehicleType}</p>
//     //           <p>Driver: {v.driver?.name || "N/A"}</p>
//     //           <p>Status: {v.maintenanceStatus}</p>
//     //           <p>Available: {v.isAvailable ? "Yes" : "No"}</p>
//     //           <div className="mt-3 flex gap-2">
//     //             <button
//     //               onClick={() => {
//     //                 setEditingVehicle(v);
//     //                 setShowForm(true);
//     //               }}
//     //               className="px-3 py-1 bg-yellow-500 text-white rounded"
//     //             >
//     //               <i className="fas fa-edit" /> Edit
//     //             </button>
//     //             <button
//     //               onClick={() => handleDelete(v._id)}
//     //               className="px-3 py-1 bg-red-600 text-white rounded"
//     //             >
//     //               <i className="fas fa-trash" /> Delete
//     //             </button>
//     //           </div>
//     //         </div>
//     //       ))}
//     //     </div>
//     //   )}

//     //   {showForm && (
//     //     <LogisticsVehicleForm
//     //       vehicle={editingVehicle}
//     //       organizationId={organizationId}
//     //       onClose={() => setShowForm(false)}
//     //       onSubmit={async (data:any, isEdit:any) => {
//     //         isEdit
//     //           ? await updateVehicle({ vehicleId: data._id, organizationId, payload: data })
//     //           : await createVehicle({ organizationId, payload: data });
//     //         setShowForm(false);
//     //       }}
//     //     />
//     //   )}
//     // </div>


//       <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold text-blue-900">Logistics Vehicles</h2>
//         <Button
//           variant="primary"
//           onClick={() => {
//             setEditingVehicle(null);
//             setShowForm(true);
//           }}
//         >
//           <i className="fas fa-plus mr-2" />
//           Add Vehicle
//         </Button>
//       </div>

//       {isLoading ? (
//         <p className="text-gray-700">Loading vehicles...</p>
//       ) : isError ? (
//         <p className="text-red-600">Failed to load vehicles.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {vehicles?.map((v: any) => (
//             <Card key={v._id}>
//               <CardHeader>
//                 <CardTitle>{v.vehicleNumber}</CardTitle>
//                 <CardDescription>{v.vehicleType}</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-sm text-blue-950">
//                 <p>
//                   <i className="fas fa-user mr-1 text-gray-500" />
//                   Driver: {v.driver?.name || "N/A"}
//                 </p>
//                 <p>
//                   <i className="fas fa-wrench mr-1 text-gray-500" />
//                   Status: {v.maintenanceStatus}
//                 </p>
//                 <p>
//                   <i className="fas fa-check-circle mr-1 text-gray-500" />
//                   Available: {v.isAvailable ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <i className="fas fa-map-marker-alt mr-1 text-gray-500" />
//                   Location: {v.currentLocation?.address || "N/A"}
//                 </p>
//                 <div className="mt-4 flex gap-2 justify-end">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => {
//                       setEditingVehicle(v);
//                       setShowForm(true);
//                     }}
//                   >
//                     <i className="fas fa-edit mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="danger"
//                     onClick={() => handleDelete(v._id)}
//                   >
//                     <i className="fas fa-trash mr-1" />
//                     Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {showForm && (
//         <LogisticsVehicleForm
//           vehicle={editingVehicle}
//           organizationId={organizationId}
//           onClose={() => setShowForm(false)}
//           onSubmit={async (data: any, isEdit: any) => {
//             if (isEdit) {
//               await updateVehicle({
//                 vehicleId: data._id,
//                 organizationId,
//                 payload: data,
//               });
//             } else {
//               await createVehicle({ organizationId, payload: data });
//             }
//             setShowForm(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default LogisticsVehicle;