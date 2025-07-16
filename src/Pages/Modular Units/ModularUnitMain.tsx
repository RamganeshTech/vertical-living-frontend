// "use client";

// import React, { useState } from "react";
// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { useGetAllMixedUnits, useGetModularUnits } from "../../apiList/Modular Unit Api/ModularUnitApi";
// import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs";
// import { Button } from "../../components/ui/Button";
// import { Card } from "../../components/ui/Card";
// import { Select, SelectTrigger, SelectValue } from "../../components/ui/Select";

// const unitTypes = Object.keys(modularUnitFieldConfig);

// export default function ModularUnitMain() {
//     const { organizationId } = useParams() as { organizationId: string }

//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//     const navigate = useNavigate();
//     const locaiton = useLocation()

//     // const { data, isLoading, isError } = useGetModularUnits(selectedType);
//      const { data, isLoading, isError } = useGetAllMixedUnits(organizationId)

//       const allUnits: any[] = [];
//   if (data) {
//     Object.entries(data).forEach(([section, units]) => {
//       (units as any[]).forEach((unit) => {
//         allUnits.push({ ...unit, section });
//       });
//     });
//   }

//   const filteredUnits = selectedCategory
//     ? allUnits.filter((u) => u.section === selectedCategory)
//     : allUnits;

//     const isChildRoute = location.pathname.includes("add")

//     return (
//         <>
//             {isChildRoute ?
//                 <>
//                     <Outlet />
//                 </>
//                 : 
//                  <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-6">
//       {/* Sidebar */}
//       <aside className="w-full md:w-64 border-r pr-4">
//         <h2 className="text-lg font-semibold mb-4">Sections</h2>
//         <ul className="space-y-2">
//           {Object.keys(modularUnitFieldConfig).map((cat) => (
//             <li
//               key={cat}
//               className={`cursor-pointer px-3 py-2 rounded ${
//                 selectedCategory === cat
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={() => setSelectedCategory(cat)}
//             >
//               {cat}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-semibold">
//             {selectedCategory ? `${selectedCategory} Units` : "Select a Section"}
//           </h1>
//           <Button onClick={() => navigate("/modularunits/add")}>
//             + Add New
//           </Button>
//         </div>

//         {!selectedCategory ? (
//           <p className="text-gray-500">Please select a section to view units.</p>
//         ) : isLoading ? (
//           <p>Loading units...</p>
//         ) : isError ? (
//           <p className="text-red-500">Failed to load units.</p>
//         ) : data?.length === 0 ? (
//           <p className="text-gray-500">No units found for this section.</p>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {data?.map((unit: any) => (
//               <div
//                 key={unit._id}
//                 className="border p-4 rounded shadow hover:shadow-md transition"
//               >
//                 <h2 className="text-lg font-semibold mb-2">
//                   {unit.name || "Unnamed Unit"}
//                 </h2>
//                 <p className="text-sm text-gray-500 mb-1">ID: {unit._id}</p>
//                 {unit.images?.length ? (
//                   <img
//                     src={unit.images[0].url}
//                     alt={unit.name}
//                     className="w-full h-32 object-cover rounded"
//                   />
//                 ) : (
//                   <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
//                     No Image
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//             }
//         </>

//     );
// }
