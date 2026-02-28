// import React from "react";
// import { Button } from "../../../../components/ui/Button";

// // Types ----------------------------------------
// export type CoreMaterialRow = {
//   itemName: string;
//   plywoodNos: { quantity: number; thickness: number };
//   // laminateNos: { quantity: number; thickness: number };
//   innerLaminate: { quantity: number; thickness: number };
//   outerLaminate: { quantity: number; thickness: number };
//   carpenters: number;
//   days: number;
//   profitOnMaterial: number;
//   profitOnLabour: number;
//   rowTotal: number;
//   remarks: string;
//   imageUrl?: string;
//   previewUrl?: string;
// };

// export type SimpleItemRow = {
//   itemName: string;
//   description: string;
//   quantity: number;
//   cost: number;
//   rowTotal: number;
//   profitOnMaterial?: number
//   wasManuallyEdited?: boolean; // 🆕

// };

// export type FurnitureBlock = {
//   furnitureName: string;
//   coreMaterials: CoreMaterialRow[];
//   fittingsAndAccessories: SimpleItemRow[];
//   glues: SimpleItemRow[];
//   nonBrandMaterials: SimpleItemRow[];
//   totals: {
//     core: number;
//     fittings: number;
//     glues: number;
//     nbms: number;
//     furnitureTotal: number;
//   };
//   plywoodBrand?: string | null,
//   laminateBrand?: string | null,
// };

// type Props = {
//   index: number;
//   data: FurnitureBlock;
//   labourCost: number;
//   updateFurniture?: (updatedFurniture: FurnitureBlock) => void;
//   removeFurniture?: () => void;
//   isEditing?: boolean,
// };

// // Constants ----------------------------------------
// export const RATES = {
//   // labour: 1300,
//   plywood: 1,
//   laminate: 1,
// };

// const emptyCoreMaterial = (): CoreMaterialRow => ({
//   itemName: "",
//   plywoodNos: { quantity: 0, thickness: 0 },
//   laminateNos: { quantity: 0, thickness: 0 },
//   carpenters: 0,
//   days: 0,
//   profitOnMaterial: 0,
//   profitOnLabour: 0,
//   rowTotal: 0,
//   remarks: "",
// });

// const emptySimpleItem = (): SimpleItemRow => ({
//   itemName: "",
//   description: "",
//   quantity: 0,
//   cost: 0,
//   rowTotal: 0,
// });


// export const calculateCoreMaterialCosts = (
//   coreRows: CoreMaterialRow[],
//   labourCost: number
// ): CoreMaterialRow[] => {
//   if (coreRows.length === 0) return [];

//   const totalRows = coreRows.length;

//   const base = coreRows[0];
//   // changed for labour cost
//   // const totalLabour = base.carpenters * base.days * RATES.labour;
//   const totalLabour = base.carpenters * base.days * labourCost;
//   const labourWithProfit = totalLabour * (1 + (base.profitOnLabour || 0) / 100);
//   const labourPerRow = labourWithProfit / totalRows;

//   return coreRows.map((row) => {
//     const plywoodQty = row.plywoodNos?.quantity || 0;
//     const laminateQty = row.laminateNos?.quantity || 0;

//     // Material cost and margin per row
//     const materialCost =
//       (plywoodQty * RATES.plywood + laminateQty * RATES.laminate) *
//       (1 + (row.profitOnMaterial || 0) / 100);

//     // console.log("console.log", materialCost)

//     return {
//       ...row,
//       rowTotal: Math.round(materialCost + labourPerRow),
//     };
//   });
// };

// // Component ----------------------------------------
// const FurnitureForm: React.FC<Props> = ({
//   // index,
//   data,
//   isEditing,
//   labourCost,
//   updateFurniture,
//   removeFurniture,
// }) => {



//   const computeTotals = (fb: FurnitureBlock) => {
//     const totalCore = fb.coreMaterials.reduce((sum, row) => sum + row.rowTotal, 0);
//     const totalFit = fb.fittingsAndAccessories.reduce((sum, row) => sum + row.rowTotal, 0);
//     const totalGlue = fb.glues.reduce((sum, row) => sum + row.rowTotal, 0);
//     const totalNbm = fb.nonBrandMaterials.reduce((sum, row) => sum + row.rowTotal, 0);
//     return {
//       core: totalCore,
//       fittings: totalFit,
//       glues: totalGlue,
//       nbms: totalNbm,
//       furnitureTotal: totalCore + totalFit + totalGlue + totalNbm,
//     };
//   };


//   const handleCoreChange = (rowIndex: number, key: keyof CoreMaterialRow, value: any) => {
//     const updated: any = [...data.coreMaterials];

//     if (key === "imageUrl") {
//       if (isEditing) {
//         // only in edit mode, track new image file
//         updated[rowIndex].newImageFile = value;
//       }
//       updated[rowIndex].imageUrl = value;
//       updated[rowIndex].previewUrl = URL.createObjectURL(value);
//     } else if (key === "plywoodNos" || key === "laminateNos") {
//       updated[rowIndex][key] = {
//         ...(updated[rowIndex][key] || {}),
//         ...value,
//       };
//     } else {
//       updated[rowIndex][key] = value;
//     }

//     const updatedRows = calculateCoreMaterialCosts(updated, labourCost);

//     // 2. NEW LOGIC: Calculate Average Core Cost for Glues
//     // Formula: Total Cost of Core Materials / Number of Core Material Rows
//     const totalCoreCost = updatedRows.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
//     const coreRowCount = updatedRows.length;
//     const avgCoreCost = coreRowCount > 0 ? Math.round(totalCoreCost / coreRowCount) : 0;

//     const inheritedProfit = updatedRows?.[0]?.profitOnMaterial || 0;

//     const applyProfitAndRecalculate = (rows: SimpleItemRow[], isGlue = false): SimpleItemRow[] =>
//       rows.map(item => {

//         const profitOnMaterial = inheritedProfit;
//         // const base = isGlue
//         //   ? item.cost || 0
//         //   : (item.quantity || 0) * (item.cost || 0);
//         const base = isGlue ? avgCoreCost : (item.quantity || 0) * (item.cost || 0);
//         const profit = base * (profitOnMaterial / 100);
//         const rowTotal = Math.round(base + profit);

//         return {
//           ...item,
//           itemName: isGlue ? "Glue" : item.itemName,
//           quantity: isGlue ? 1 : item.quantity,
//           cost: isGlue ? avgCoreCost : item.cost, // Automatically update the cost field for glues
//           profitOnMaterial,
//           rowTotal,
//         };
//       });



//     const updatedFurniture: FurnitureBlock = {
//       ...data,
//       coreMaterials: updatedRows,
//       fittingsAndAccessories: applyProfitAndRecalculate(data.fittingsAndAccessories),      // false = not glue
//       glues: applyProfitAndRecalculate(data.glues, true),                                  // glue = needs special calc
//       nonBrandMaterials: applyProfitAndRecalculate(data.nonBrandMaterials),                // false = not glue
//     };


//     updatedFurniture.totals = computeTotals(updatedFurniture);
//     updateFurniture?.(updatedFurniture);
//   };

//   const syncFurnitureState = (updatedCoreRows: CoreMaterialRow[]) => {
//     // 1. Calculate the new Average Cost
//     const totalCoreCost = updatedCoreRows.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
//     const coreRowCount = updatedCoreRows.length;
//     const avgCoreCost = coreRowCount > 0 ? Math.round(totalCoreCost / coreRowCount) : 0;

//     // 2. Get the inherited profit from the first row
//     const inheritedProfit = updatedCoreRows?.[0]?.profitOnMaterial || 0;

//     // 3. Helper to apply updates to simple sections (Glues, Fittings, etc.)
//     const applyUpdates = (rows: SimpleItemRow[], isGlue = false): SimpleItemRow[] =>
//       rows.map(item => {
//         const currentCost = isGlue ? avgCoreCost : (item.cost || 0);
//         const base = isGlue ? currentCost : (item.quantity || 0) * currentCost;
//         const profit = base * (inheritedProfit / 100);

//         return {
//           ...item,
//           cost: currentCost,
//           profitOnMaterial: inheritedProfit,
//           rowTotal: Math.round(base + profit),
//         };
//       });

//     // 4. Construct the final object
//     const updatedFurniture: FurnitureBlock = {
//       ...data,
//       coreMaterials: updatedCoreRows,
//       fittingsAndAccessories: applyUpdates(data.fittingsAndAccessories),
//       glues: applyUpdates(data.glues, true),
//       nonBrandMaterials: applyUpdates(data.nonBrandMaterials),
//     };

//     updatedFurniture.totals = computeTotals(updatedFurniture);
//     updateFurniture?.(updatedFurniture);
//   };


//   const handleSimpleChange = (
//     kind: "fittingsAndAccessories" | "glues" | "nonBrandMaterials",
//     i: number,
//     key: keyof SimpleItemRow,
//     value: any
//   ) => {
//     const section: any = [...data[kind]];
//     section[i][key] = value;

//     if (kind !== "glues") {
//       const base = (section[i].quantity || 0) * (section[i].cost || 0);
//       const profit = base * ((section[i].profitOnMaterial || 0) / 100);
//       section[i].rowTotal = Math.round(base + profit);
//     } else {
//       const base = section[i].cost || 0;
//       const profit = base * ((section[i].profitOnMaterial || 0) / 100);
//       section[i].rowTotal = Math.round(base + profit);
//     }

//     // if (key === "profitOnMaterial") {
//     //   section[i].wasManuallyEdited = true; // ✅ track override
//     // }

//     // 👉 Automatically add new row on typing in last row
//     const isLastRow = i === section.length - 1;
//     const isTyping = section[i].itemName || section[i].description || section[i].quantity || section[i].cost;

//     if (isLastRow && isTyping) {
//       section.push(emptySimpleItem());
//     }

//     const updatedFurniture: FurnitureBlock = {
//       ...data,
//       [kind]: section,
//     };
//     updatedFurniture.totals = computeTotals(updatedFurniture);
//     updateFurniture && updateFurniture(updatedFurniture);


//   };

//   // Render core material table
//   const renderCoreMaterials = () => (
//     <div className="mt-4">
//       <h3 className="font-semibold text-md mb-2">Core Materials - Total: ₹{data?.totals?.core.toLocaleString("en-IN")}</h3>
//       <div className="overflow-x-auto  rounded-md">
//         <table className="min-w-full text-sm bg-white shadow-sm">


//           <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//             <tr>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Image</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Item Name</th>
//               <th className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Plywood</th>
//               <th className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Laminate</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. of Carpenters / Day</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. of Days</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Profit % Material</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Profit % Labour</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Remarks</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Total</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Actions</th>
//             </tr>
//             <tr>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.coreMaterials.map((row, i) => (
//               <tr key={i}
//                 className="group relative border-none !border-b-1 px-4 py-2 transition-all duration-150 hover:bg-gray-50"
//               >


//                 {i === 0 && (
//                   <td rowSpan={data.coreMaterials.length}>
//                     <input
//                       type="file"
//                       className="w-full px-2 py-3 text-center outline-none"
//                       onChange={(e) => handleCoreChange(0, "imageUrl", e.target.files?.[0])}
//                     />
//                     {row.previewUrl && (
//                       <img src={row.previewUrl} className="h-10 mt-2 mx-auto" />
//                     )}
//                   </td>
//                 )}

//                 <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                   <input
//                     value={row.itemName}
//                     placeholder="TV Unit | Wardrobe"
//                     onChange={(e) => handleCoreChange(i, "itemName", e.target.value)}
//                     className="w-full px-2 py-1 text-center outline-none"
//                   />
//                 </td>
//                 {["plywoodNos", "laminateNos"].map((field) =>
//                   ["quantity", "thickness"].map((sub) => (
//                     <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" key={`${field}-${sub}`}>
//                       <input
//                         type="number"
//                         placeholder={`${sub === "quantity" ? "QTY" : "THK"}`}
//                         value={(row as any)[field][sub] || ""}
//                         onChange={(e) => {
//                           if (Number(e.target.value) >= 0) {

//                             handleCoreChange(i, field as any, {
//                               ...(row as any)[field],
//                               [sub]: Number(e.target.value),
//                             })
//                           }
//                         }
//                         }
//                         className="w-full px-2 py-1 text-center outline-none"
//                       />
//                     </td>
//                   ))
//                 )}
//                 {i === 0 && (
//                   <>
//                     <td
//                       rowSpan={data.coreMaterials.length}
//                       className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                       <input
//                         type="number"
//                         placeholder={`no of carpentors`}
//                         value={row.carpenters || ""}
//                         onChange={(e) =>
//                           handleCoreChange(i, "carpenters", Number(e.target.value))
//                         }
//                         className="w-full px-[2px] py-1 text-center outline-none"
//                       />
//                     </td>
//                     <td
//                       rowSpan={data.coreMaterials.length}
//                       className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                       <input
//                         type="number"
//                         placeholder={`no of days`}
//                         value={row.days || ""}
//                         onChange={(e) =>
//                           handleCoreChange(i, "days", Number(e.target.value))
//                         }
//                         className="w-full px-[2px] py-1 text-center outline-none"
//                       />
//                     </td>
//                   </>
//                 )}
//                 <td className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                   <input
//                     type="number"
//                     placeholder={`profit percent`}
//                     value={row.profitOnMaterial || ""}
//                     onChange={(e) =>
//                       handleCoreChange(i, "profitOnMaterial", Number(e.target.value))
//                     }
//                     className="w-full px-[2px] py-1 text-center outline-none"
//                   />
//                 </td>
//                 {i === 0 && (
//                   <>
//                     <td
//                       rowSpan={data.coreMaterials.length}
//                       className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                       <input
//                         type="number"
//                         placeholder={`profit percent`}
//                         value={row.profitOnLabour || ""}
//                         onChange={(e) =>
//                           handleCoreChange(i, "profitOnLabour", Number(e.target.value))
//                         }
//                         className="w-full px-[2px] py-1 text-center outline-none"
//                       />
//                     </td>
//                   </>)}
//                 <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                   <input
//                     value={row.remarks}
//                     placeholder="remarks"
//                     onChange={(e) =>
//                       handleCoreChange(i, "remarks", e.target.value)
//                     }
//                     className="w-full px-2 py-1 text-center outline-none"
//                   />
//                 </td>
//                 <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">₹{row.rowTotal.toLocaleString("en-IN")}</td>
//                 <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
//                   <Button
//                     variant="danger"
//                     onClick={() => {
//                       // const updated = [...data.coreMaterials];
//                       // updated.splice(i, 1);
//                       // const recalculated = calculateCoreMaterialCosts(updated, labourCost);

//                       // const updatedFurniture: FurnitureBlock = {
//                       //   ...data,
//                       //   coreMaterials: recalculated,
//                       // };
//                       // updatedFurniture.totals = computeTotals(updatedFurniture);
//                       // updateFurniture?.(updatedFurniture);

//                       const updated = [...data.coreMaterials];
//                       updated.splice(i, 1);

//                       // Recalculate core row totals first (for the new count/distribution)
//                       const recalculatedCore = calculateCoreMaterialCosts(updated, labourCost);

//                       // Use our helper to sync the Glues and everything else

//                       syncFurnitureState(recalculatedCore)
//                     }}
//                     className="px-1 text-xs bg-red-600 text-white"
//                   >
//                     Remove
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-2 text-right">
//         <Button
//           onClick={() => {
//             const updated = [...data.coreMaterials, emptyCoreMaterial()];
//             const updatedRows = calculateCoreMaterialCosts(updated, labourCost);

//             const updatedFurniture: FurnitureBlock = {
//               ...data,
//               coreMaterials: updatedRows,
//             };
//             updatedFurniture.totals = computeTotals(updatedFurniture);
//             updateFurniture?.(updatedFurniture);

//           }}
//         >
//           + Add Core Material
//         </Button>
//       </div>
//     </div>
//   );



//   const renderSimpleItemSection = (
//     title: string,
//     kind: "fittingsAndAccessories" | "glues" | "nonBrandMaterials"
//   ) => (
//     <div className="mt-6">
//       <h3 className="font-semibold text-md mb-2">
//         {title} - Total: ₹{(data as any)?.totals[kind === "fittingsAndAccessories" ? "fittings" : kind]?.toLocaleString("en-IN")}
//       </h3>
//       <div className="overflow-x-auto  rounded-md">
//         <table className="min-w-full text-sm bg-white shadow-sm">
//           <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//             <tr>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit %</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//               <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data[kind].map((row, i) => (
//               <tr key={i}
//                 className="group relative border-none !border-b-1 px-4 !py-2 transition-all duration-150 hover:bg-gray-50"
//               >
//                 <td
//                   className="p-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
//                 >
//                   <input
//                     value={row.itemName || ""}
//                     placeholder="Item Name"
//                     onChange={(e) =>
//                       handleSimpleChange(kind, i, "itemName", e.target.value)
//                     }
//                     className="w-full px-2 py-1 text-center outline-none"

//                   />
//                 </td>
//                 <td
//                   className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
//                 >
//                   <input
//                     value={row.description}
//                     placeholder="description"
//                     onChange={(e) =>
//                       handleSimpleChange(kind, i, "description", e.target.value)
//                     }
//                     className="w-full px-2 py-1 text-center outline-none"

//                   />
//                 </td>
//                 <td
//                   className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
//                 >
//                   <input
//                     type="number"
//                     placeholder="enter quantity"
//                     value={row.quantity || ""}
//                     onChange={(e) => {
//                       if (Number(e.target.value) >= 0) {

//                         handleSimpleChange(kind, i, "quantity", Number(e.target.value))
//                       }
//                     }
//                     }
//                     className="w-full px-2 py-1 text-center outline-none"
//                   />
//                 </td>
//                 <td
//                   className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
//                 >
//                   <input
//                     type="number"
//                     value={row.cost || ""}
//                     placeholder="enter cost"
//                     onChange={(e) =>
//                       handleSimpleChange(kind, i, "cost", Number(e.target.value))
//                     }
//                     className="w-full px-2 py-1 text-center outline-none"
//                   />
//                 </td>
//                 <td
//                   className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"

//                 >
//                   <input
//                     type="number"
//                     placeholder="enter profit"
//                     value={(row.profitOnMaterial ?? 0) || ""}
//                     onChange={(e) =>
//                       handleSimpleChange(kind, i, "profitOnMaterial", Number(e.target.value))
//                     }
//                     // className="w-20 text-center  rounded px-2 py-1 text-sm"
//                     className="w-full px-2 py-1 text-center outline-none"

//                   />
//                 </td>
//                 <td
//                   className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
//                 >₹{row.rowTotal.toLocaleString("en-IN")}</td>
//                 <td
//                   className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
//                 >
//                   <Button
//                     variant="danger"
//                     onClick={() => {
//                       const updated = [...data[kind]];
//                       updated.splice(i, 1);
//                       const updatedFurniture: FurnitureBlock = {
//                         ...data,
//                         [kind]: updated,
//                       };
//                       updatedFurniture.totals = computeTotals(updatedFurniture);
//                       updateFurniture && updateFurniture(updatedFurniture);
//                     }}
//                     className="px-1 text-xs bg-red-600 text-white"
//                   >
//                     Remove
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-2 text-right">
//         <Button
//           onClick={() => {
//             const updated = [...data[kind], emptySimpleItem()];
//             const updatedFurniture: FurnitureBlock = {
//               ...data,
//               [kind]: updated,
//             };
//             updatedFurniture.totals = computeTotals(updatedFurniture);
//             updateFurniture && updateFurniture(updatedFurniture);
//           }}
//         >
//           + Add {title} Item
//         </Button>
//       </div>
//     </div>
//   );



//   return (
//     <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-xl font-semibold text-gray-700">
//           Product: {data.furnitureName}
//         </h2>
//         {removeFurniture && (
//           <Button variant="danger" size="sm" onClick={removeFurniture} className="bg-red-600 text-white">
//             Remove Product
//           </Button>
//         )}
//       </div>

//       {renderCoreMaterials()}
//       {renderSimpleItemSection("Fittings", "fittingsAndAccessories")}
//       {renderSimpleItemSection("Glues", "glues")}
//       {renderSimpleItemSection("Non-Branded Materials", "nonBrandMaterials")}

//       <div className="mt-6 text-right text-xl text-green-700 font-bold">
//         Product Total: ₹{data.totals.furnitureTotal.toLocaleString("en-IN")}
//       </div>
//     </div>
//   );
// };

// export default FurnitureForm;







import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import SearchSelectNew from "../../../../components/ui/SearchSelectNew";
import { getItemsBycategoryNameForAllCategories, getItemsBycategoryNameForFittings } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import useGetRole from "../../../../Hooks/useGetRole";
import { getApiForRole } from "../../../../utils/roleCheck";
import { useParams } from "react-router-dom";

// Types ----------------------------------------
export type CoreMaterialRow = {
  itemName: string;
  materialUsed: string,
  plywoodNos: { quantity: number; thickness: number };
  // laminateNos: { quantity: number; thickness: number };
  innerLaminate: { quantity: number; thickness: number };
  outerLaminate: { quantity: number; thickness: number };
  carpenters: number;
  days: number;
  profitOnMaterial: number;
  profitOnLabour: number;
  rowTotal: number;
  remarks: string;
  imageUrl?: string;
  previewUrl?: string;
};

export type SimpleItemRow = {
  itemName: string;
  description: string;
  brandName: string,
  brandId: string,
  imageUrl?: string
  quantity: number;
  cost: number;
  rowTotal: number;
  profitOnMaterial?: number
};
// sjdkflsjdflsdflskfls
// kkkkkkkkkkkkkkkkkkkkkkkk
// jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
// jjjjjjjjjjjjjjjjjjjjjjjshsjsjjds
// lsdjfl;ksjf;lsjf;lsajfl;jld;jlj
// s;ldkjfkl;sjf;lsjfl;sj;kl


export type FurnitureBlock = {
  dimention: {
    height: number,
    width: number,
    depth: number,
  },
  scopeOfWork?: string;
  furnitureName: string;
  furnitureProfit?: number; // 🆕 Added for product-specific override
  fabricationCost?: number; // 🆕 Track factory cost for this product
  coreMaterials: CoreMaterialRow[];
  fittingsAndAccessories: SimpleItemRow[];
  glues: SimpleItemRow[];
  nonBrandMaterials: SimpleItemRow[];
  totals: {
    core: number;
    fittings: number;
    glues: number;
    nbms: number;
    furnitureTotal: number;
  };
  plywoodBrand?: string | null,
  // laminateBrand?: string | null,
  innerLaminateBrand?: string | null
  outerLaminateBrand?: string | null

  plywoodBrandId?: string | null
  innerLaminateBrandId?: string | null
  outerLaminateBrandId?: string | null

};

type Props = {
  index: number;
  data: FurnitureBlock;
  labourCost: number;
  duplicateFurniture?: () => void; // Add this
  updateFurniture?: (updatedFurniture: FurnitureBlock) => void;
  removeFurniture?: () => void;
  isEditing?: boolean,
};

// Constants ----------------------------------------
export const RATES = {
  // labour: 1300,
  plywood: 1,
  // laminate: 1,
  innerLaminate: 1, // Change from 'laminate'
  outerLaminate: 1, // Change from 'laminate'
};

const emptyCoreMaterial = (): CoreMaterialRow => ({
  itemName: "",
  materialUsed: "plywood",
  plywoodNos: { quantity: 0, thickness: 0 },
  // laminateNos: { quantity: 0, thickness: 0 },
  innerLaminate: { quantity: 0, thickness: 0 }, // New field
  outerLaminate: { quantity: 0, thickness: 0 }, // New field
  carpenters: 0,
  days: 0,
  profitOnMaterial: 0,
  profitOnLabour: 0,
  rowTotal: 0,
  remarks: "",
});

const emptySimpleItem = (): SimpleItemRow => ({
  itemName: "",
  brandName: "",
  brandId: "",
  description: "",
  quantity: 0,
  cost: 0,
  rowTotal: 0,
});


export const calculateCoreMaterialCosts = (
  coreRows: CoreMaterialRow[],
  labourCost: number,
  furnitureProfit: number = 0,// 🆕 Added parameter
  fabricationCost: number = 0 // 🆕 Added parameter
): CoreMaterialRow[] => {
  if (coreRows.length === 0) return [];

  const totalRows = coreRows.length;

  // Use a helper or logic to get total row count across ALL sections 
  // For the split logic (Core + Fittings + Glue + NBMs)
  // For now, let's assume it's divided by core rows as per your current structure
  const fabPerRow = fabricationCost / totalRows;

  const base = coreRows[0];
  const totalLabour = base.carpenters * base.days * labourCost;
  const labourWithProfit = totalLabour * (1 + (base.profitOnLabour || 0) / 100);
  const labourPerRow = labourWithProfit / totalRows;

  // 🆕 Product profit multiplier
  const productMultiplier = 1 + (furnitureProfit / 100);

  return coreRows.map((row) => {
    // const plywoodQty = row.plywoodNos?.quantity || 0;
    // const laminateQty = row.laminateNos?.quantity || 0;

    // Material cost and margin per row
    // const materialCost =
    //   (plywoodQty * RATES.plywood + laminateQty * RATES.laminate) *
    //   (1 + (row.profitOnMaterial || 0) / 100);



    //  NEW VERSION
    const plywoodQty = row.plywoodNos?.quantity || 0;
    const innerQty = row.innerLaminate?.quantity || 0;
    const outerQty = row.outerLaminate?.quantity || 0;

    // const materialBaseWithLocalProfit =
    //   (plywoodQty * RATES.plywood +
    //     innerQty * RATES.innerLaminate +
    //     outerQty * RATES.outerLaminate) *
    //   (1 + (row.profitOnMaterial || 0) / 100);



    // ✅ FABRICATION is added to base before profit multiplier
    // const finalRowTotal = (materialBaseWithLocalProfit + labourPerRow + fabPerRow) * productMultiplier;


    const materialBase = (plywoodQty * RATES.plywood +
      innerQty * RATES.innerLaminate +
      outerQty * RATES.outerLaminate);

    // ✅ CHECK FOR LOCAL OVERRIDE
    const hasLocalMargin = (row.profitOnMaterial || 0) > 0;

    // If local margin exists, we apply it to material and SKIP the productMultiplier
    const materialWithLocalProfit = materialBase * (1 + (row.profitOnMaterial || 0) / 100);

    // If local margin exists, row total = (Material+Margin) + Labour + Fab
    // If local margin is 0, row total = (Material + Labour + Fab) * productMultiplier
    const finalRowTotal = hasLocalMargin
      ? (materialWithLocalProfit + labourPerRow + fabPerRow)
      : (materialBase + labourPerRow + fabPerRow) * productMultiplier;

    return {
      ...row,
      // rowTotal: Math.round(materialCost + labourPerRow),
      rowTotal: finalRowTotal, // Keep as decimal for accuracy
    };
  });
};

// Component ----------------------------------------
const FurnitureForm: React.FC<Props> = ({
  // index,
  data,
  isEditing,
  labourCost,
  duplicateFurniture,
  updateFurniture,
  removeFurniture,
}) => {

  const { organizationId, } = useParams() as { organizationId: string }

  const [fittingsOptionsMap, setFittingsOptionsMap] = useState<Record<number, any[]>>({});
  const [nbmOptionsMap, setNbmOptionsMap] = useState<Record<number, any[]>>({});
  const debounceTimers = useRef<Record<number, any>>({});


  const { role } = useGetRole();
  const allowedRoles = ["owner", "CTO", "staff"];

  const api = getApiForRole(role!);


  const fetchFittingsBrands = async (index: number, itemName: string) => {
    if (!itemName) return;
    try {

      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
      if (!api) throw new Error("API instance not found for role");


      const results = await getItemsBycategoryNameForFittings({
        api,
        organizationId,
        categoryName: "Accessories/Hardware",
        itemName: itemName
      });


      // console.log("results", results)



      //  OLD VERSION
      // const formatted = results.map((item: any) => ({
      //   label: item.data?.Brand,

      //   value: item?._id ? String(item._id) : "",

      //   rate: item.data?.Rs
      // }));



      //  NEW VERSION
      const formatted = results.map((item: any) => {
        // Extract brand and image dynamically
        const brand = item.data?.Brand || item.data?.brand || item.data.BrandName || "Unknown";
        const img = item.data?.image || item.data?.Image || item.data?.img || item.data?.images || item.data?.Images || "";

        return {
          label: brand,
          value: item?._id ? String(item._id) : "",
          rate: item.data?.Rs || item.data?.rs || 0,
          imageUrl: img // 🆕 Extracted image
        };
      });

      // console.log("formatted", formatted)

      setFittingsOptionsMap(prev => ({ ...prev, [index]: formatted }));
    } catch (error) {
      console.error("Error fetching fitting brands:", error);
    }
  };


  // 🆕 New fetch function for Non-Branded (Global Search)
  const fetchAllCategoryItems = async (index: number, itemName: string) => {
    if (!itemName) return;
    try {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found");

      const results = await getItemsBycategoryNameForAllCategories({
        api,
        organizationId,
        itemName: itemName
      });

      const formatted = results.map((item: any) => {
        // ✅ FIX: Prioritize Brand so you see "Hettich" instead of "hinges"
        // ✅ This is just the Brand name (e.g., "Hettich")
        const brandOnly =
          item.data?.Brand ||
          item.data?.BrandName ||
          item.data?.brand ||
          item.data?.brandName ||
          item.data?.["Brands light name"] ||
          item.data?.["Brand "] ||
          item.data?.["Brands "] ||
          'Unknown';

        const img = item.data?.image || item.data?.Image || item.data?.img || item.data?.images || item.data?.Images || "";


        return {
          // This will now result in "Hettich (Accessories/Hardware)"
          label: `${brandOnly} (${item.categoryName?.trim() || 'No Cat'})`,
          value: item?._id ? String(item._id) : "",
          rate: item.data?.Rs || item.data?.rs || item?.data?.RS || 0,
          brandOnly: brandOnly,
          imageUrl: img // 🆕 Extracted image
        };
      });

      setNbmOptionsMap(prev => ({ ...prev, [index]: formatted }));
    } catch (error) {
      console.error("Error fetching all category items:", error);
    }
  };


  //  OLD VERSION OF USE EFFECT TO GET FITTING BRAND AUTOMATICALLY
  // useEffect(() => {
  //   // Prime the options map with already saved data so labels show up on load
  //   const initialMap: Record<number, any[]> = {};

  //   data.fittingsAndAccessories.forEach((row, i) => {
  //     if (row.brandId && row.brandName) {
  //       initialMap[i] = [{
  //         label: row.brandName,
  //         value: String(row.brandId),
  //         rate: row.cost // Use existing cost as fallback
  //       }];
  //     }
  //   });

  //   setFittingsOptionsMap(prev => ({ ...prev, ...initialMap }));
  // }, []); // Run once on mount



  //  NEW VERSION OF USE EFFECT TO GET FITTING BRAND AND ALL BRANDS AUTOMATICALLY

  useEffect(() => {
    // 1. Setup temporary maps to build the initial state
    const initialFittingsMap: Record<number, any[]> = {};
    const initialNbmMap: Record<number, any[]> = {};

    // 2. Prime Fittings and Accessories
    data.fittingsAndAccessories?.forEach((row, i) => {
      if (row.brandId && row.brandName) {
        initialFittingsMap[i] = [{
          label: row.brandName,
          value: String(row.brandId),
          rate: row.cost,
          imageUrl: row.imageUrl
        }];
      }
    });

    // 3. Prime Non-Branded Materials (🆕 Added this part)
    // We use brandId/brandName here as well since your table row uses those fields to store selection
    // data.nonBrandMaterials?.forEach((row, i) => {
    //   if (row.brandId && row.brandName) {
    //     initialNbmMap[i] = [{
    //       label: row.brandName,
    //       value: String(row.brandId),
    //       rate: row.cost
    //     }];
    //   }
    // });

    // 2. Prime Non-Branded Materials & Trigger Silent Fetch
    data.nonBrandMaterials?.forEach((row, i) => {
      if (row.brandId && row.brandName) {
        // Set the initial label (Brand Name only since Category is missing)
        initialNbmMap[i] = [{
          label: row.brandName,
          value: String(row.brandId),
          brandOnly: row.brandName,
          rate: row.cost,
          imageUrl: row.imageUrl // 🆕 Preserve saved image
        }];

        // ✅ Trigger fetchAllCategoryItems immediately for existing rows
        // This will overwrite initialNbmMap[i] with the "Brand (Category)" label once finished
        if (row.itemName) {
          fetchAllCategoryItems(i, row.itemName);
        }
      }
    });

    // 4. Update both states
    setFittingsOptionsMap(prev => ({ ...prev, ...initialFittingsMap }));
    setNbmOptionsMap(prev => ({ ...prev, ...initialNbmMap }));

  }, []); // Run once on mount to populate existing data labels
  // }, [data.fittingsAndAccessories, data.nonBrandMaterials]);




  const computeTotals = (fb: FurnitureBlock) => {
    const totalCore = fb.coreMaterials.reduce((sum, row) => sum + row.rowTotal, 0);
    const totalFit = fb.fittingsAndAccessories.reduce((sum, row) => sum + row.rowTotal, 0);
    const totalGlue = fb.glues.reduce((sum, row) => sum + row.rowTotal, 0);
    const totalNbm = fb.nonBrandMaterials.reduce((sum, row) => sum + row.rowTotal, 0);
    return {
      core: totalCore,
      fittings: totalFit,
      glues: totalGlue,
      nbms: totalNbm,
      furnitureTotal: totalCore + totalFit + totalGlue + totalNbm,
    };
  };


  const handleCoreChange = (rowIndex: number, key: keyof CoreMaterialRow, value: any) => {
    const updated: any = [...data.coreMaterials];

    if (key === "imageUrl") {
      if (isEditing) {
        // only in edit mode, track new image file
        updated[rowIndex].newImageFile = value;
      }
      updated[rowIndex].imageUrl = value;
      updated[rowIndex].previewUrl = URL.createObjectURL(value);
    }

    // else if (key === "plywoodNos" || key === "laminateNos") {
    //   updated[rowIndex][key] = {
    //     ...(updated[rowIndex][key] || {}),
    //     ...value,
    //   };
    // }


    //  NEW VERSION

    else if (key === "plywoodNos" || key === "innerLaminate" || key === "outerLaminate") {
      updated[rowIndex][key] = {
        ...(updated[rowIndex][key] || {}),
        ...value,
      };
    }


    else {
      updated[rowIndex][key] = value;
    }

    const updatedRows = calculateCoreMaterialCosts(updated, labourCost, data.furnitureProfit || 0);

    // 2. NEW LOGIC: Calculate Average Core Cost for Glues
    // Formula: Total Cost of Core Materials / Number of Core Material Rows
    // const totalCoreCost = updatedRows.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
    // const coreRowCount = updatedRows.length;
    // const avgCoreCost = coreRowCount > 0 ? Math.round(totalCoreCost / coreRowCount) : 0;

    // const inheritedProfit = updatedRows?.[0]?.profitOnMaterial || 0;

    const furnitureProfitMultiplier = 1 + (data.furnitureProfit || 0) / 100;

    // const applyProfitAndRecalculate = (rows: SimpleItemRow[], isGlue = false): SimpleItemRow[] =>
    //   rows.map(item => {

    //     const profitOnMaterial = inheritedProfit;

    //     const base = isGlue ? avgCoreCost : (item.quantity || 0) * (item.cost || 0);
    //     const profit = base * (profitOnMaterial / 100);
    //     const rowTotal = Math.round(base + profit);

    //     return {
    //       ...item,
    //       itemName: isGlue ? "Glue" : item.itemName,
    //       quantity: isGlue ? 1 : item.quantity,
    //       cost: isGlue ? avgCoreCost : item.cost, // Automatically update the cost field for glues
    //       profitOnMaterial,
    //       rowTotal,
    //     };
    //   });



    const applyProfitAndRecalculate = (rows: SimpleItemRow[]): SimpleItemRow[] =>
      rows.map(item => {


        // if (isGlue || item.itemName === "Glue") {
        //   // ✅ GLUE FIX: Use avgCoreCost as-is to avoid double-dipping profit
        //   return {
        //     ...item,
        //     itemName: "Glue",
        //     quantity: 1,
        //     profitOnMaterial: item.profitOnMaterial,
        //     cost: avgCoreCost,
        //     rowTotal: avgCoreCost,
        //   };
        // }

        // ✅ OTHERS FIX: Apply local profit AND the furnitureProfit multiplier
        const base = (item.quantity || 0) * (item.cost || 0);
        // const profit = base * (inheritedProfit / 100);
        const manualMargin = item.profitOnMaterial || 0;
        // const localProfit = base * ((item.profitOnMaterial || 0) / 100);
        // const rowTotal = (base + localProfit) * furnitureProfitMultiplier;

        // ✅ PRIORITY CHECK: If row has its own profit, use only that. 
        // If not, use the product-level overlay multiplier.
        const rowTotal = manualMargin > 0
          ? base * (1 + (manualMargin / 100))
          : base * furnitureProfitMultiplier;

        return {
          ...item,
          // profitOnMaterial: inheritedProfit,
          rowTotal: rowTotal,
        };
      });

    const updatedFurniture: FurnitureBlock = {
      ...data,
      coreMaterials: updatedRows,
      fittingsAndAccessories: applyProfitAndRecalculate(data.fittingsAndAccessories),      // false = not glue
      glues: applyProfitAndRecalculate(data.glues),                                  // glue = needs special calc
      nonBrandMaterials: applyProfitAndRecalculate(data.nonBrandMaterials),                // false = not glue
    };


    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture?.(updatedFurniture);
  };

  const syncFurnitureState = (updatedCoreRows: CoreMaterialRow[]) => {
    // 1. Calculate the new Average Cost
    // const totalCoreCost = updatedCoreRows.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
    // const coreRowCount = updatedCoreRows.length;
    // const avgCoreCost = coreRowCount > 0 ? Math.round(totalCoreCost / coreRowCount) : 0;

    // 2. Get the inherited profit from the first row
    // const inheritedProfit = updatedCoreRows?.[0]?.profitOnMaterial || 0;

    // 2. Define the product multiplier for overlays
    const furnitureProfitMultiplier = 1 + (data.furnitureProfit || 0) / 100;

    // 3. Helper to apply updates to simple sections (Glues, Fittings, etc.)
    // const applyUpdates = (rows: SimpleItemRow[], isGlue = false): SimpleItemRow[] =>
    //   rows.map(item => {
    //     const currentCost = isGlue ? avgCoreCost : (item.cost || 0);
    //     const base = isGlue ? currentCost : (item.quantity || 0) * currentCost;
    //     const profit = base * (inheritedProfit / 100);

    //     return {
    //       ...item,
    //       cost: currentCost,
    //       profitOnMaterial: inheritedProfit,
    //       rowTotal: Math.round(base + profit),
    //     };
    //   });

    // 3. Helper to apply updates without forced inheritance
    const applyUpdates = (rows: SimpleItemRow[]): SimpleItemRow[] =>
      rows.map(item => {
        // if (isGlue || item.itemName === "Glue") {
        //   // ✅ Uses Glue's OWN current profitOnMaterial
        //   // ✅ Uses avgCoreCost directly (already includes furnitureProfit)
        //   return {
        //     ...item,
        //     itemName: "Glue",
        //     quantity: 1,
        //     cost: avgCoreCost,
        //     // Removed inheritedProfit; uses the manual value already in state
        //     profitOnMaterial: item.profitOnMaterial,
        //     rowTotal: avgCoreCost,
        //   };
        // }

        // ✅ For Fittings and Non-Branded: Use their OWN profitOnMaterial
        const base = (item.quantity || 0) * (item.cost || 0);
        // const localProfit = base * ((item.profitOnMaterial || 0) / 100);
        const hasLocalProfit = (item.profitOnMaterial || 0) > 0;

        const rowTotal = hasLocalProfit
          ? base * (1 + ((item.profitOnMaterial || 0) / 100)) // Use ONLY local
          : base * furnitureProfitMultiplier;         // Use Product Overlay

        return {
          ...item,
          // Apply local margin + the product-level profit overlay
          // rowTotal: (base + localProfit) * furnitureProfitMultiplier,
          rowTotal: rowTotal
        };
      });

    // 4. Construct the final object
    const updatedFurniture: FurnitureBlock = {
      ...data,
      coreMaterials: updatedCoreRows,
      fittingsAndAccessories: applyUpdates(data.fittingsAndAccessories),
      glues: applyUpdates(data.glues),
      nonBrandMaterials: applyUpdates(data.nonBrandMaterials),
    };

    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture?.(updatedFurniture);
  };

  const spreadOverheads = (profit: number, fabCost: number, shouldReset: boolean) => {

    // ✅ RESET: When Product Profit changes, clear all individual row margins
    const coreToProcess = shouldReset
      ? data.coreMaterials.map(row => ({ ...row, profitOnMaterial: 0, profitOnLabour: 0 }))
      : data.coreMaterials;

    const fittingsToProcess = shouldReset
      ? data.fittingsAndAccessories.map(item => ({ ...item, profitOnMaterial: 0 }))
      : data.fittingsAndAccessories;

    const gluesToProcess = shouldReset
      ? data.glues.map(item => ({ ...item, profitOnMaterial: 0 }))
      : data.glues;

    const nbmToProcess = shouldReset
      ? data.nonBrandMaterials.map(item => ({ ...item, profitOnMaterial: 0 }))
      : data.nonBrandMaterials;

    // const multiplier = 1 + (profit / 100);

    // 1. Calculate Core with Fabrication split
    const updatedCore = calculateCoreMaterialCosts(coreToProcess, labourCost, profit, fabCost);

    // 2. Determine Avg for Glues
    const totalCore = updatedCore.reduce((sum, r) => sum + r.rowTotal, 0);
    const avgCore = updatedCore.length > 0 ? totalCore / updatedCore.length : 0;

    const updateSimple = (section: SimpleItemRow[], isGlue = false) =>
      section.map(item => {
        if (isGlue || item.itemName === "Glue") return { ...item, cost: avgCore, rowTotal: avgCore };
        // const base = (item.quantity * item.cost) * (1 + (item.profitOnMaterial || 0) / 100);
        // return { ...item, rowTotal: base * multiplier };

        // Since we reset profitOnMaterial to 0 above, this will just use the new multiplier
        const base = (item.quantity * item.cost);
        const manualMargin = item.profitOnMaterial || 0;
        // return { ...item, rowTotal: base * (1 + (profit / 100)) };
        return {
          ...item,
          rowTotal: manualMargin > 0
            ? (base * (1 + manualMargin / 100))
            : (base * (1 + profit / 100))
        };
      });

    const updatedFurniture = {
      ...data,
      furnitureProfit: profit,
      fabricationCost: fabCost,
      coreMaterials: updatedCore,
      fittingsAndAccessories: updateSimple(fittingsToProcess),
      glues: updateSimple(gluesToProcess, true),
      nonBrandMaterials: updateSimple(nbmToProcess),
    };

    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture?.(updatedFurniture);
  };


  const handleSimpleChange = (
    kind: "fittingsAndAccessories" | "glues" | "nonBrandMaterials",
    i: number,
    key: keyof SimpleItemRow,
    value: any
  ) => {
    const section: any = [...data[kind]];
    section[i][key] = value;

    if (kind !== "glues") {
      const base = (section[i].quantity || 0) * (section[i].cost || 0);
      const profit = base * ((section[i].profitOnMaterial || 0) / 100);
      section[i].rowTotal = Math.round(base + profit);
    } else {
      const base = section[i].cost || 0;
      const profit = base * ((section[i].profitOnMaterial || 0) / 100);
      section[i].rowTotal = Math.round(base + profit);
    }

    // if (key === "profitOnMaterial") {
    //   section[i].wasManuallyEdited = true; // ✅ track override
    // }

    // 👉 Automatically add new row on typing in last row
    const isLastRow = i === section.length - 1;
    const isTyping = section[i].itemName || section[i].description || section[i].quantity || section[i].cost;

    if (isLastRow && isTyping) {
      section.push(emptySimpleItem());
    }

    const updatedFurniture: FurnitureBlock = {
      ...data,
      [kind]: section,
    };
    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture && updateFurniture(updatedFurniture);
  };

  // Render core material table
  const renderCoreMaterials = () => (
    <div className="mt-4">
      <h3 className="font-semibold text-md mb-2">Core Materials - Total: ₹{data?.totals?.core.toLocaleString("en-IN")}</h3>
      <div className="overflow-x-auto  rounded-md">
        <table className="min-w-full text-sm bg-white shadow-sm">


          <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
            <tr>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Image</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Item Name</th>
              {/* <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Brand Name</th> */}
              <th className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider border-x border-gray-200" colSpan={2}>Plywood</th>

              <th className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider border-x border-gray-200" colSpan={4}>
                Laminate
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. of Carpenters / Day</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. of Days</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Profit % Material</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Profit % Labour</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Remarks</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Total</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Actions</th>
            </tr>


            <tr className="">
              {/* Plywood Sub-headers */}
              <th className="px-2 py-2 text-[10px] uppercase text-gray-500 border-r border-gray-200">Thk</th>
              <th className="px-2 py-2 text-[10px] uppercase text-gray-500 border-r border-gray-200">Qty</th>



              {/* 🆕 OUTER LAMINATE - Separately Mentioned */}
              <th className="px-2 py-2 text-[10px]  text-gray-500 uppercase border-r border-gray-200">Outer Thk</th>
              <th className="px-2 py-2 text-[10px]  text-gray-500 uppercase border-r border-gray-200">Outer Qty</th>


              {/* 🆕 INNER LAMINATE - Separately Mentioned */}
              <th className="px-2 py-2 text-[10px]  text-gray-500 uppercase border-r border-gray-200">Inner Thk</th>
              <th className="px-2 py-2 text-[10px]  text-gray-500 uppercase border-r border-gray-200">Inner Qty</th>

            </tr>
          </thead>
          <tbody>
            {data.coreMaterials.map((row, i) => (
              <tr key={i}
                className="group relative border-none !border-b-1 px-4 py-2 transition-all duration-150 hover:bg-gray-50"
              >
                {i === 0 && (
                  <td rowSpan={data.coreMaterials.length}>
                    <input
                      type="file"
                      className="w-full px-2 py-3 text-center outline-none"
                      onChange={(e) => handleCoreChange(0, "imageUrl", e.target.files?.[0])}
                    />
                    {/* {row.previewUrl && (
                      <img src={row.previewUrl} className="h-10 mt-2 mx-auto" />
                    )} */}

                    {/* ✅ FIX: Check both previewUrl (local) and imageUrl (S3) */}
                    {(row.previewUrl || row.imageUrl) && (
                      <div className="mt-2 relative group">
                        <img
                          src={row.previewUrl || row.imageUrl}
                          className="h-16 w-16 object-cover mt-2 mx-auto rounded-lg border shadow-sm"
                          alt="Product"
                        />
                        {/* <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                          <i className="fas fa-camera text-white text-xs"></i>
                        </div> */}
                      </div>
                    )}
                  </td>
                )}

                <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    value={row.itemName}
                    placeholder="TV Unit | Wardrobe"
                    onChange={(e) => handleCoreChange(i, "itemName", e.target.value)}
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>

                {/* <td
                  // className="border p-2 text-center italic text-blue-600 bg-blue-50/30"
                  className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"

                >
                  Selected in Next Stage
                </td>
                <td
                  // className="border p-2 text-center font-semibold text-gray-500"
                  className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"


                >
                  Plywood
                </td> */}


                {/*  Replace the map that currently iterates over ["plywoodNos", "laminateNos"] */}
                {["plywoodNos", "outerLaminate", "innerLaminate"].map((field) =>
                  ["thickness", "quantity"].map((sub) => (
                    <td key={`${field}-${sub}`}
                      // className="..."
                      className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"


                    >
                      <input
                        type="number"
                        placeholder={`${sub === "quantity" ? "QTY" : "THK"}`}
                        value={(row as any)[field][sub] || ""}
                        onChange={(e) => {
                          if (Number(e.target.value) >= 0) {
                            handleCoreChange(i, field as any, {
                              ...(row as any)[field],
                              [sub]: Math.max(0, Number(e.target.value)),
                            });
                          }
                        }}
                        className="w-full px-2 py-1 text-center outline-none"
                      />
                    </td>
                  ))
                )}


                {i === 0 && (
                  <>
                    <td
                      rowSpan={data.coreMaterials.length}
                      className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                      <input
                        type="number"
                        placeholder={`no of carpentors`}
                        value={row.carpenters || ""}
                        onChange={(e) =>
                          handleCoreChange(i, "carpenters", Math.max(0, Number(e.target.value)))
                        }
                        className="w-full px-[2px] py-1 text-center outline-none"
                      />
                    </td>
                    <td
                      rowSpan={data.coreMaterials.length}
                      className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                      <input
                        type="number"
                        placeholder={`no of days`}
                        value={row.days || ""}
                        onChange={(e) =>
                          handleCoreChange(i, "days", Math.max(0, Number(e.target.value)))
                        }
                        className="w-full px-[2px] py-1 text-center outline-none"
                      />
                    </td>
                  </>
                )}
                <td className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    type="number"
                    placeholder={`profit percent`}
                    value={row.profitOnMaterial || ""}
                    onChange={(e) =>
                      handleCoreChange(i, "profitOnMaterial", Math.max(0, Number(e.target.value)))
                    }
                    className="w-full px-[2px] py-1 text-center outline-none"
                  />
                </td>
                {i === 0 && (
                  <>
                    <td
                      rowSpan={data.coreMaterials.length}
                      className="px-1 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                      <input
                        type="number"
                        placeholder={`profit percent`}
                        value={row.profitOnLabour || ""}
                        onChange={(e) =>
                          handleCoreChange(i, "profitOnLabour", Math.max(0, Number(e.target.value)))
                        }
                        className="w-full px-[2px] py-1 text-center outline-none"
                      />
                    </td>
                  </>)}
                <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    value={row.remarks}
                    placeholder="remarks"
                    onChange={(e) =>
                      handleCoreChange(i, "remarks", e.target.value)
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  {/* ₹{row.rowTotal.toLocaleString("en-IN")} */}
                  ₹{row.rowTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <Button
                    variant="danger"
                    onClick={() => {
                      // const updated = [...data.coreMaterials];
                      // updated.splice(i, 1);
                      // const recalculated = calculateCoreMaterialCosts(updated, labourCost);

                      // const updatedFurniture: FurnitureBlock = {
                      //   ...data,
                      //   coreMaterials: recalculated,
                      // };
                      // updatedFurniture.totals = computeTotals(updatedFurniture);
                      // updateFurniture?.(updatedFurniture);

                      const updated = [...data.coreMaterials];
                      updated.splice(i, 1);

                      // Recalculate core row totals first (for the new count/distribution)
                      const recalculatedCore = calculateCoreMaterialCosts(updated, labourCost, (data.furnitureProfit || 0));

                      // Use our helper to sync the Glues and everything else

                      syncFurnitureState(recalculatedCore)
                    }}
                    className="px-1 text-xs bg-red-600 text-white"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right">
        <Button
          onClick={() => {
            const updated = [...data.coreMaterials, emptyCoreMaterial()];
            const updatedRows = calculateCoreMaterialCosts(updated, labourCost, (data.furnitureProfit || 0));

            const updatedFurniture: FurnitureBlock = {
              ...data,
              coreMaterials: updatedRows,
            };
            updatedFurniture.totals = computeTotals(updatedFurniture);
            updateFurniture?.(updatedFurniture);

          }}
        >
          + Add Core Material
        </Button>
      </div>
    </div>
  );



  const renderSimpleItemSection = (
    title: string,
    kind: "fittingsAndAccessories" | "glues" | "nonBrandMaterials"
  ) => {
    const isFittings = kind === "fittingsAndAccessories";
    const isNonBranded = kind === "nonBrandMaterials";
    // const isGlues = kind === "glues";


    return (
      <div className="mt-6">
        <h3 className="font-semibold text-md mb-2">
          {title} - Total: ₹{

            (data as any)?.totals[
              // kind === "fittingsAndAccessories" ? "fittings" : kind
              kind === "fittingsAndAccessories"
                ? "fittings"
                : kind === "nonBrandMaterials"
                  ? "nbms" // 👈 Map 'nonBrandMaterials' to the 'nbms' total key
                  : "glues"

            ]?.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })

          }
        </h3>
        {/* <div className="overflow-x-auto  rounded-md">
          <table className="min-w-full text-sm bg-white shadow-sm"> */}

        <div className="overflow-x-auto rounded-md pb-[200px] -mb-[200px]">
          <table className="min-w-full text-sm bg-white shadow-sm border-separate border-spacing-0">
            <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
              <tr>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                {(isFittings || isNonBranded) && <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>}
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit %</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>


            </thead>
            <tbody className="!overflow-visible">
              {data[kind].map((row, i) => (
                <tr key={i}
                  className="group relative border-none !border-b-1 px-4 !py-2 transition-all duration-150 hover:bg-gray-50 hover:z-[100] focus-within:z-[100]"
                >
                  <td
                    className="p-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                  >
                    <input
                      value={row.itemName || ""}
                      placeholder="Item Name"
                      // onChange={(e) =>
                      //   handleSimpleChange(kind, i, "itemName", e.target.value)

                      // }


                      onChange={(e) => {
                        const val = e.target.value;

                        // 1. Immediate UI update for the text
                        handleSimpleChange(kind, i, "itemName", val);

                        // 2. Clear existing timer for this specific row index
                        if (debounceTimers.current[i]) {
                          clearTimeout(debounceTimers.current[i]);
                        }

                        // 3. Set new timer: Call API only after 800ms of no typing
                        debounceTimers.current[i] = setTimeout(() => {
                          // fetchFittingsBrands(i, val);
                          // 🆕 Check 'kind' to decide which function to call
                          if (kind === "fittingsAndAccessories") {
                            fetchFittingsBrands(i, val);
                          } else if (kind === "nonBrandMaterials") {
                            fetchAllCategoryItems(i, val);
                          }
                        }, 600);
                      }}
                      className="w-full px-2 py-1 text-center outline-none"

                    />
                  </td>



                  <td
                    className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                  >
                    <input
                      value={row.description}
                      placeholder="description"
                      onChange={(e) =>
                        handleSimpleChange(kind, i, "description", e.target.value)
                      }
                      className="w-full px-2 py-1 text-center outline-none"

                    />
                  </td>



                  {(isFittings || isNonBranded) && (
                    <td className="p-2 border border-gray-200 min-w-[200px] !static lg:!relative">
                      {/* We use a div inside the TD to create a local "anchor". 
      By making this overflow-visible and the SearchSelect relative/absolute, 
      it will float above other rows.
    */}
                      {/* <div className="relative w-full overflow-visible z-[50]"> */}
                      <div className="relative w-full !overflow-visible z-[70]">
                        <SearchSelectNew
                          // options={fittingsOptionsMap[i] || []}
                          options={kind === "fittingsAndAccessories" ? fittingsOptionsMap[i] : nbmOptionsMap[i] || []}
                          value={row?.brandId || ""}
                          placeholder={row?.itemName ? "Select Brand" : "Type item first"}
                          onFocus={() => {
                            // Cast 'kind' as string or use its full union type to bypass the overlap check
                            const currentKind = kind as string;

                            if (currentKind === "fittingsAndAccessories" && (!fittingsOptionsMap[i] || fittingsOptionsMap[i]?.length <= 1)) {
                              fetchFittingsBrands(i, row.itemName);
                            }
                            else if (currentKind === "nonBrandMaterials" && (!nbmOptionsMap[i] || nbmOptionsMap[i]?.length <= 1)) {
                              fetchAllCategoryItems(i, row.itemName);
                            }
                          }}
                          // This ensures the dropdown menu itself is forced to the front
                          // className="relative z-[100] w-full"
                          className="!overflow-visible relative z-[110]"
                          onValueChange={(val) => {
                            // const options = fittingsOptionsMap[i] || [];

                            const options = kind === "fittingsAndAccessories" ? fittingsOptionsMap[i] : nbmOptionsMap[i] || [];
                            const selected = options.find((opt: any) => String(opt.value) === String(val));
                            if (selected) {
                              handleSimpleChange(kind, i, "brandId" as any, selected?.value);
                              // For fittings, if you haven't added 'brandOnly' there, you can use a fallback
                              const isNBM = kind === "nonBrandMaterials";
                              const nameToStore = isNBM ? (selected?.brandOnly || selected?.label) : selected?.label;

                              console.log("Selected Object:", selected); // 👈 Check if imageUrl exists here
                              console.log("Kind being processed:", kind);   // 👈 Check if it's exactly "nonBrandMaterials"

                              handleSimpleChange(kind, i, "brandName" as any, nameToStore);
                              handleSimpleChange(kind, i, "cost", selected?.rate);
                              // 3. ✅ SAVE IMAGE URL TO DATABASE FIELD
                              handleSimpleChange(kind, i, "imageUrl" as any, selected?.imageUrl || "");
                            }

                          }}
                        />
                      </div>
                    </td>
                  )}


                  <td
                    className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                  >
                    <input
                      type="number"
                      placeholder="enter quantity"
                      value={row.quantity || ""}
                      onChange={(e) => {
                        if (Number(e.target.value) >= 0) {

                          handleSimpleChange(kind, i, "quantity", Math.max(0, Number(e.target.value)))
                        }
                      }
                      }
                      className="w-full px-2 py-1 text-center outline-none"
                    />
                  </td>
                  <td
                    className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                  >
                    <input
                      type="number"
                      value={row.cost || ""}
                      placeholder="enter cost"
                      onChange={(e) =>
                        handleSimpleChange(kind, i, "cost", Math.max(0, Number(e.target.value)))
                      }
                      className="w-full px-2 py-1 text-center outline-none"
                    />
                  </td>
                  <td
                    className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"

                  >
                    <input
                      type="number"
                      placeholder="enter profit"
                      value={(row.profitOnMaterial ?? 0) || ""}
                      onChange={(e) =>
                        handleSimpleChange(kind, i, "profitOnMaterial", Math.max(0, Number(e.target.value)))
                      }
                      // className="w-20 text-center  rounded px-2 py-1 text-sm"
                      className="w-full px-2 py-1 text-center outline-none"

                    />
                  </td>
                  <td
                    className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                  >
                    {/* ₹{row.rowTotal.toLocaleString("en-IN")} */}
                    ₹{row.rowTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                  >
                    <Button
                      variant="danger"
                      onClick={() => {
                        const updated = [...data[kind]];
                        updated.splice(i, 1);
                        const updatedFurniture: FurnitureBlock = {
                          ...data,
                          [kind]: updated,
                        };
                        updatedFurniture.totals = computeTotals(updatedFurniture);
                        updateFurniture && updateFurniture(updatedFurniture);
                      }}
                      className="px-1 text-xs bg-red-600 text-white"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-right">
          <Button
            onClick={() => {
              const updated = [...data[kind], emptySimpleItem()];
              const updatedFurniture: FurnitureBlock = {
                ...data,
                [kind]: updated,
              };
              updatedFurniture.totals = computeTotals(updatedFurniture);
              updateFurniture && updateFurniture(updatedFurniture);
            }}
          >
            + Add {title} Item
          </Button>
        </div>
      </div>
    )
  }



  return (
    <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
      {/* <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">
          Product: {data.furnitureName}
        </h2>
        {removeFurniture && (
          <Button variant="danger" size="sm" onClick={removeFurniture} className="bg-red-600 text-white">
            Remove Product
          </Button>
        )}
      </div> */}

      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Product Name:</label>
            <input
              value={data.furnitureName}
              onChange={(e) => updateFurniture?.({ ...data, furnitureName: e.target.value })}
              className="text-xl font-semibold text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-4 mt-2 p-1.5 bg-gray-50/50 rounded-lg w-fit">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
              Dimensions (ft)
            </label>

            <div className="flex items-center gap-3">
              {/* Height - Blue Theme */}
              <div className="flex items-center bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5">
                <span className="text-[10px] font-bold text-blue-500 mr-1">H</span>
                <input
                  type="number"
                  value={data.dimention?.height || 0}
                  onChange={(e) => updateFurniture?.({
                    ...data,
                    dimention: { ...data.dimention, height: Number(e.target.value) }
                  })}
                  className="w-12 bg-transparent text-sm font-medium text-blue-700 outline-none text-center"
                />
              </div>

              {/* Width - Green Theme */}
              <div className="flex items-center bg-green-50 border border-green-100 rounded-md px-2 py-0.5">
                <span className="text-[10px] font-bold text-green-500 mr-1">W</span>
                <input
                  type="number"
                  value={data.dimention?.width || 0}
                  onChange={(e) => updateFurniture?.({
                    ...data,
                    dimention: { ...data.dimention, width: Number(e.target.value) }
                  })}
                  className="w-12 bg-transparent text-sm font-medium text-green-700 outline-none text-center"
                />
              </div>

              {/* Depth - Purple Theme */}
              <div className="flex items-center bg-purple-50 border border-purple-100 rounded-md px-2 py-0.5">
                <span className="text-[10px] font-bold text-purple-500 mr-1">D</span>
                <input
                  type="number"
                  value={data.dimention?.depth || 0}
                  onChange={(e) => updateFurniture?.({
                    ...data,
                    dimention: { ...data.dimention, depth: Number(e.target.value) }
                  })}
                  className="w-12 bg-transparent text-sm font-medium text-purple-700 outline-none text-center"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 self-start">
          {duplicateFurniture && (
            <Button size="sm" onClick={duplicateFurniture} className="bg-blue-600 text-white">
              Duplicate Product
            </Button>
          )}
          {removeFurniture && (
            <Button variant="danger" size="sm" onClick={removeFurniture} className="bg-red-600 text-white">
              Remove Product
            </Button>
          )}
        </div>
      </div>

      {renderCoreMaterials()}
      {renderSimpleItemSection("Fittings", "fittingsAndAccessories")}
      {renderSimpleItemSection("Glues", "glues")}
      {renderSimpleItemSection("Non-Branded Materials", "nonBrandMaterials")}

      {/* <div className="mt-6 text-right text-xl text-green-700 font-bold">
        Product Total: ₹{data.totals.furnitureTotal.toLocaleString("en-IN")}
      </div> */}

      {/* 🆕 Factory Fabrication & Product Profit Section */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t pt-4">

        {/* Factory Fabrication Input */}
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 shadow-sm">
          <label className="text-[11px] font-bold text-orange-600 uppercase tracking-tight">
            Fabrication Cost
          </label>
          <div className="flex items-center">
            <span className="text-orange-600 mr-1 text-sm">₹</span>
            <input
              type="number"
              className="w-20 text-right font-bold bg-transparent outline-none text-orange-800"
              value={data.fabricationCost ?? ""}
              placeholder="0"
              onChange={(e) => spreadOverheads(data.furnitureProfit || 0, Math.max(0, Number(e.target.value)), false)}
            />
          </div>
        </div>

        {/* Product Profit Input */}
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
          <label className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">
            Product Profit Overlay
          </label>
          <div className="flex items-center">
            <input
              type="number"
              className="w-12 text-right font-bold bg-transparent outline-none text-blue-800"
              value={data.furnitureProfit ?? ""}
              placeholder="0"
              onChange={(e) => spreadOverheads(Math.max(0, Number(e.target.value)), data.fabricationCost || 0, true)}
            />
            <span className="text-blue-600 font-bold ml-1 text-sm">%</span>
          </div>
        </div>

        <div className="text-right text-xl text-green-700 font-bold ml-4">
          Product Total: ₹{Math.round(data.totals.furnitureTotal).toLocaleString("en-IN")}
        </div>
      </div>


    </div>
  );
};

export default FurnitureForm;