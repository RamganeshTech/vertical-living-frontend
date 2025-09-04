// import React, { useEffect, useState } from "react";
// import type { ILogisticsVehicle } from "./LogisticsMain";

// interface Props {
//     vehicle?: any;
//     organizationId: string;
//     onClose: () => void;
//     onSubmit: (data: any, isEdit: boolean) => void;
// }

// export const LogisticsVehicleForm: React.FC<Props> = ({
//     vehicle,
//     organizationId,
//     onClose,
//     onSubmit,
// }) => {
//     const [formData, setFormData] = useState<ILogisticsVehicle>({
//         vehicleNumber: "",
//         vehicleType: "truck",
//         driverCharge: 0,
//         isAvailable: true,
//         maintenanceStatus: "good",
//         driver: {
//             name: "",
//             phone: "",
//             licenseNumber: "",
//         },
//         currentLocation: {
//             address: "",
//             // coordinates: [0, 0], // [lng, lat]
//         },
//         capacity: {
//             weight: 0, // kg
//             volume: 0 // cubic meters
//         }
//     });

//     useEffect(() => {
//         if (vehicle) {
//             setFormData({ ...formData, ...vehicle });
//         }
//     }, [vehicle]);

//    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     if (name.startsWith("driver.")) {
//       const key = name.split(".")[1];
//       setFormData({
//         ...formData,
//         driver: {
//           ...formData.driver,
//           [key]: value,
//         },
//       });
//     } else if (name.startsWith("capacity.")) {
//       const key = name.split(".")[1];
//       setFormData({
//         ...formData,
//         capacity: {
//           ...formData.capacity,
//           [key]: parseFloat(value),
//         },
//       });
//     } 
//     // else if (name.startsWith("currentLocation.coordinates.")) {
//     //   const index = Number(name.split(".")[2]);
//     //   const newCoords = [...formData.currentLocation.coordinates];
//     //   newCoords[index] = parseFloat(value);
//     //   setFormData({
//     //     ...formData,
//     //     currentLocation: {
//     //       ...formData.currentLocation,
//     //       coordinates: newCoords,
//     //     },
//     //   });
//     // } 
//     else if (name === "currentLocation.address") {
//       setFormData({
//         ...formData,
//         currentLocation: {
//           ...formData.currentLocation,
//           address: value,
//         },
//       });
//     } else if (name === "driverCharge") {
//       setFormData({ ...formData, driverCharge: parseFloat(value) });
//     } else if (name === "isAvailable") {
//       setFormData({ ...formData, isAvailable: value === "true" });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//     return (
//           <div className="fixed inset-0 bg-black/70 bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
//         <h3 className="text-xl font-semibold mb-4">
//           {vehicle ? "Edit Vehicle" : "Add Vehicle"}
//         </h3>

//         <div className="space-y-3">
//           {/* Basic Info */}
//           <input
//             name="vehicleNumber"
//             placeholder="Vehicle Number"
//             className="w-full px-3 py-2 border rounded"
//             value={formData.vehicleNumber}
//             onChange={handleChange}
//           />

//           <select
//             name="vehicleType"
//             className="w-full px-3 py-2 border rounded"
//             value={formData.vehicleType}
//             onChange={handleChange}
//           >
//             <option value="truck">Truck</option>
//             <option value="van">Van</option>
//             <option value="car">Car</option>
//             <option value="bike">Bike</option>
//             <option value="tempo">Tempo</option>
//             <option value="container">Container</option>
//           </select>

//           <input
//             type="number"
//             name="driverCharge"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Driver Charge"
//             value={formData.driverCharge}
//             onChange={handleChange}
//           />

//           {/* Driver Info */}
//           <input
//             name="driver.name"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Driver Name"
//             value={formData.driver.name}
//             onChange={handleChange}
//           />
//           <input
//             name="driver.phone"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Driver Phone"
//             value={formData.driver.phone}
//             onChange={handleChange}
//           />
//           <input
//             name="driver.licenseNumber"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="License Number"
//             value={formData.driver.licenseNumber}
//             onChange={handleChange}
//           />

//           {/* Availability */}
//           <select
//             name="isAvailable"
//             className="w-full px-3 py-2 border rounded"
//             value={formData.isAvailable ? "true" : "false"}
//             onChange={handleChange}
//           >
//             <option value="true">Available</option>
//             <option value="false">Unavailable</option>
//           </select>

//           {/* Maintenance */}
//           <select
//             name="maintenanceStatus"
//             className="w-full px-3 py-2 border rounded"
//             value={formData.maintenanceStatus}
//             onChange={handleChange}
//           >
//             <option value="good">Good</option>
//             <option value="needs_service">Needs Service</option>
//             <option value="in_service">In Service</option>
//             <option value="out_of_order">Out of Order</option>
//           </select>

//           {/* Current Location */}
//           <input
//             name="currentLocation.address"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Current Address"
//             value={formData.currentLocation.address}
//             onChange={handleChange}
//           />
//           {/* <div className="flex gap-2">
//             <input
//               type="number"
//               step="any"
//               name="currentLocation.coordinates.0"
//               className="w-1/2 px-3 py-2 border rounded"
//               placeholder="Longitude"
//               value={formData.currentLocation.coordinates[0]}
//               onChange={handleChange}
//             />
//             <input
//               type="number"
//               step="any"
//               name="currentLocation.coordinates.1"
//               className="w-1/2 px-3 py-2 border rounded"
//               placeholder="Latitude"
//               value={formData.currentLocation.coordinates[1]}
//               onChange={handleChange}
//             />
//           </div> */}

//           {/* Capacity */}
//           <input
//             type="number"
//             name="capacity.weight"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Weight Capacity (kg)"
//             value={formData.capacity.weight}
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             name="capacity.volume"
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Volume Capacity (cbm)"
//             value={formData.capacity.volume}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="flex justify-end gap-2 mt-5">
//           <button
//             onClick={onClose}
//             className="text-gray-700 border px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded"
//             onClick={() => onSubmit(formData, !!vehicle)}
//           >
//             {vehicle ? "Update" : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//     );
// };