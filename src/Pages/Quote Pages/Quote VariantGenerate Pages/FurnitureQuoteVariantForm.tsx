// import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
// import { type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import { NO_IMAGE } from "../../../constants/constants";
// import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";
// import SearchSelect from "../../../components/ui/SearchSelect";

// type Props = {
//   index: number;
//   data: FurnitureBlock;
//   selectedBrand: string | null;
//   selectedLaminateBrand: string | null;

//   labourCost: number

//   brandOptions: string[],
//   laminateBrandOptions: string[]


//   laminateRatesByBrand: Record<string, {
//     thickness: string;
//     rs: number;
//   }[]>

//   brandRatesByName: Record<string, {
//     thickness: string;
//     rs: number;
//   }[]>

//   onFurnitureChange: () => any
// };


// export type FurnitureQuoteRef = {
//   getUpdatedFurniture: () => FurnitureBlock;
// };


// export const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
//   const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

//   const matched = list.find((item) =>
//     String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
//   );

//   // return matched?.rs || type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
//   return (matched?.rs !== undefined)
//     ? matched.rs
//     : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
// };


// const FurnitureQuoteVariantForm = forwardRef<FurnitureQuoteRef, Props>(({
//   data, index, brandOptions, laminateBrandOptions, laminateRatesByBrand, brandRatesByName, labourCost,
//   selectedBrand, selectedLaminateBrand, onFurnitureChange }, ref) => {


//   const [coreSelectedBrand, setCoreSelectedBrand] = useState<string | null>(null);
//   const [coreSelectedLaminateBrand, setCoreSelectedLaminateBrand] = useState<string | null>(null);

//   const selectedBrandRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : []
//   const selectedLaminateRates = coreSelectedLaminateBrand ? laminateRatesByBrand[coreSelectedLaminateBrand] || [] : []

//   const prevLaminateProp = useRef(selectedLaminateBrand);
//   const prevPlywoodProp = useRef(selectedBrand);

//   const [coreMaterials, setCoreMaterials] = useState<CoreMaterialRow[]>(data?.coreMaterials || []);
//   const [fittings, setFittings] = useState(data?.fittingsAndAccessories || []);
//   const [glues, setGlues] = useState(data?.glues || []);
//   const [nbms, setNbms] = useState(data?.nonBrandMaterials || []);

//   useEffect(() => {
//     setCoreMaterials(data?.coreMaterials || []);
//   }, [data?.coreMaterials]);

//   useEffect(() => {
//     if (prevPlywoodProp.current !== selectedBrand) {
//       // ✅ parent changed → update local
//       setCoreSelectedBrand(selectedBrand);
//       prevPlywoodProp.current = selectedBrand;
//     }
//   }, [selectedBrand]);



//   useEffect(() => {
//     if (prevLaminateProp.current !== selectedLaminateBrand) {
//       // ✅ parent changed → update local
//       setCoreSelectedLaminateBrand(selectedLaminateBrand);
//       prevLaminateProp.current = selectedLaminateBrand;
//     }
//   }, [selectedLaminateBrand]);

//   useEffect(() => {
//     if (!coreSelectedBrand && brandOptions?.length > 0) {
//       setCoreSelectedBrand(brandOptions[0]);
//     }
//   }, [brandOptions]);



//   // START OF LAMINATE
//   useEffect(() => {
//     if (!coreSelectedLaminateBrand && laminateBrandOptions?.length > 0) {
//       setCoreSelectedLaminateBrand(laminateBrandOptions[0]);
//     }
//   }, [laminateBrandOptions]);



//   const calculateFurnitureRawCost = () => {
//     const SHEET_SQFT = 32;
//     // const labourRate = 1300;

//     let totalRawCost = 0;

//     const selectedPlyRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : [];
//     const selectedLamRates = coreSelectedLaminateBrand ? laminateRatesByBrand[coreSelectedLaminateBrand] || [] : [];

//     const coreRows = coreMaterials;
//     const baseRow = coreRows[0];
//     // const totalLabour = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourRate;
//     const totalLabour = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourCost;
//     const labourPerRow = coreRows.length > 0 ? totalLabour / coreRows.length : 0;

//     for (const row of coreRows) {
//       const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedPlyRates, "plywood");
//       const lamRate = getRateForThickness(row.laminateNos.thickness, selectedLamRates, "laminate");

//       const plyCost = row.plywoodNos.quantity * SHEET_SQFT * plyRate;
//       const lamCost = row.laminateNos.quantity * SHEET_SQFT * lamRate;

//       totalRawCost += plyCost + lamCost + labourPerRow;
//     }

//     const getTotal = (row: SimpleItemRow) => (row.quantity || 0) * (row.cost || 0);
//     const getGlueTotal = (row: SimpleItemRow) => row.cost || 0;

//     const fittingsTotal = data.fittingsAndAccessories.reduce((acc, r) => acc + getTotal(r), 0);
//     const glueTotal = data.glues.reduce((acc, r) => acc + getGlueTotal(r), 0);
//     const nbmsTotal = data.nonBrandMaterials.reduce((acc, r) => acc + getTotal(r), 0);

//     totalRawCost += fittingsTotal + glueTotal + nbmsTotal;

//     return Math.round(totalRawCost);
//   };


//   // START OF LAMINATE



//   const calculateRowTotal = (row: CoreMaterialRow, coreRows: CoreMaterialRow[]): number => {
//     // ✅ If no selectedBrand or selectedLaminateBrand → use prefilled rowTotal
//     const noBrandSelected = !coreSelectedLaminateBrand && !coreSelectedLaminateBrand;

//     if (noBrandSelected) {
//       return row.rowTotal || 0;
//     }

//     // ✅ Otherwise, calculate using selected brand rates
//     const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates, "plywood");
//     const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates, "laminate");

//     console.log("ply Rate", plyRate)
//     console.log("lami Rate", lamiRate)

//     const SHEET_SQFT = 32;

//     const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
//     const lamiCost = row.laminateNos.quantity * (lamiRate * SHEET_SQFT);
//     // console.log("plyCost", plyCost)
//     // console.log("lamiCost", lamiCost)
//     const baseMaterialCost = plyCost + lamiCost;
//     // console.log("baseMaterialCost", baseMaterialCost)
//     const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
//     // console.log("profitOnMaterial", profitOnMaterial)


//     const totalRows = coreRows.length;

//     const base = coreRows[0];
//     // changed for labour cost
//     // const totalLabourCost = base.carpenters * base.days * RATES.labour;
//     const totalLabourCost = base.carpenters * base.days * labourCost;
//     const labourWithProfit = totalLabourCost * (1 + (base.profitOnLabour || 0) / 100);
//     const labourPerRow = labourWithProfit / totalRows;

//     const total = baseMaterialCost + profitOnMaterial + labourPerRow;
//     // console.log("totla", total)

//     return Math.round(total);
//   };

//   const coreTotal = coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row, coreMaterials), 0);
//   // const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   // const gluesTotal = data.glues.reduce((sum, r) => sum + calculateGlueRowTotal(r), 0);
//   // const nbmsTotal = data.nonBrandMaterials.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const fittingsTotal = fittings.reduce((sum, r) => {
//     const base = (r.quantity || 0) * (r.cost || 0);
//     const profit = base * ((r.profitOnMaterial || 0) / 100);
//     return sum + base + profit;
//   }, 0);

//   const gluesTotal = glues.reduce((sum, r) => {
//     const base = r.cost || 0;
//     const profit = base * ((r.profitOnMaterial || 0) / 100);
//     return sum + base + profit;
//   }, 0);

//   const nbmsTotal = nbms.reduce((sum, r) => {
//     const base = (r.quantity || 0) * (r.cost || 0);
//     const profit = base * ((r.profitOnMaterial || 0) / 100);
//     return sum + base + profit;
//   }, 0);
//   const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

//   useImperativeHandle(ref, () => ({
//     getUpdatedFurniture: () => {


//       const updatedCoreMaterials = coreMaterials.map(row => ({
//         ...row,
//         rowTotal: calculateRowTotal(row, coreMaterials), // ✅ fresh calc
//       }));


//       const updatedFittings = [...fittings];
//       const updatedGlues = [...glues];
//       const updatedNbms = [...nbms];

//       // 👇 Totals for calculations ONLY (numbers)
//       const fittingsTotalLocal = updatedFittings.reduce((sum, r) => {
//         const base = (r.quantity || 0) * (r.cost || 0);
//         const profit = base * ((r.profitOnMaterial || 0) / 100);
//         return sum + base + profit;
//       }, 0);

//       const gluesTotalLocal = updatedGlues.reduce((sum, r) => {
//         const base = r.cost || 0;
//         const profit = base * ((r.profitOnMaterial || 0) / 100);
//         return sum + base + profit;
//       }, 0);

//       const nbmsTotalLocal = updatedNbms.reduce((sum, r) => {
//         const base = (r.quantity || 0) * (r.cost || 0);
//         const profit = base * ((r.profitOnMaterial || 0) / 100);
//         return sum + base + profit;
//       }, 0);

//       const coreTotalLocal = updatedCoreMaterials.reduce((sum, row) => sum + (row.rowTotal || 0), 0);

//       const furnitureTotalLocal = coreTotalLocal + fittingsTotalLocal + gluesTotalLocal + nbmsTotalLocal;

//       return {
//         furnitureName: data.furnitureName, // Original data (with ids etc)

//         plywoodBrand: coreSelectedBrand,
//         laminateBrand: coreSelectedLaminateBrand,

//         coreMaterials: coreMaterials.map(row => ({
//           ...row,
//           rowTotal: calculateRowTotal(row, coreMaterials),
//         })),

//         fittingsAndAccessories: updatedFittings,
//         glues: updatedGlues,
//         nonBrandMaterials: updatedNbms,




//         coreMaterialsTotal: coreTotalLocal,
//         fittingsAndAccessoriesTotal: fittingsTotalLocal,
//         gluesTotal: gluesTotalLocal,
//         nonBrandMaterialsTotal: nbmsTotalLocal,
//         furnitureTotal: furnitureTotalLocal,

//         totals: {
//           core: coreTotalLocal,
//           fittings: fittingsTotalLocal,
//           glues: gluesTotalLocal,
//           nbms: nbmsTotalLocal,
//           furnitureTotal: furnitureTotalLocal,
//         },
//       }

//     }
//   }));



//   const handleProfitMaterialChange = (rowIndex: number, newProfit: number) => {
//     const updated = [...coreMaterials];
//     updated[rowIndex] = { ...updated[rowIndex], profitOnMaterial: (newProfit || 0) };
//     setCoreMaterials(updated);


//     // ✅ ONLY TRIGGER INHERIT IF 0-th ROW IS BEING CHANGED
//     if (rowIndex !== 0) {
//       onFurnitureChange?.();
//       return; // 🚫 Do NOT proceed to sync
//     }

//     const inheritedProfit = newProfit;

//     const recalculateSimpleRows = (
//       rows: SimpleItemRow[],
//       isGlue: boolean = false
//     ): SimpleItemRow[] => {
//       return rows.map((item) => {
//         // if (item.wasManuallyEdited) return item; // skip manually changed
//         const base = isGlue
//           ? item.cost || 0
//           : (item.quantity || 0) * (item.cost || 0);
//         const profit = base * ((inheritedProfit || 0) / 100);
//         return {
//           ...item,
//           profitOnMaterial: inheritedProfit,
//           rowTotal: Math.round(base + profit),
//         };
//       });
//     };

//     setFittings((prev) => recalculateSimpleRows(prev));
//     setGlues((prev) => recalculateSimpleRows(prev, true));
//     setNbms((prev) => recalculateSimpleRows(prev));


//     onFurnitureChange?.(); // trigger parent recalculation
//   };


//   const handleProfitLabourChange = (newProfit: number) => {
//     if (!coreMaterials[0]) return;
//     const updated = [...coreMaterials];
//     updated[0] = { ...updated[0], profitOnLabour: (newProfit || 0) };
//     setCoreMaterials(updated);
//     onFurnitureChange?.(); // trigger parent recalculation
//   };


//   const handleProfitChangeInSimpleRow = (section: string, index: number, newProfit: number) => {
//     if (section === "Fittings & Accessories") {
//       const updated = [...fittings];
//       const base = (updated[index].quantity || 0) * (updated[index].cost || 0);
//       const profit = base * ((newProfit || 0) / 100);
//       updated[index] = {
//         ...updated[index],
//         // wasManuallyEdited: true,
//         profitOnMaterial: newProfit,
//         rowTotal: Math.round(base + profit),
//       };
//       setFittings(updated);
//     }

//     if (section === "Glues") {
//       const updated = [...glues];
//       const base = updated[index].cost || 0;
//       const profit = base * ((newProfit || 0) / 100);
//       updated[index] = {
//         ...updated[index],
//         // wasManuallyEdited: true,
//         profitOnMaterial: newProfit,
//         rowTotal: Math.round(base + profit),
//       };
//       setGlues(updated);
//     }

//     if (section === "Non-Branded Materials") {
//       const updated = [...nbms];
//       const base = (updated[index].quantity || 0) * (updated[index].cost || 0);
//       const profit = base * ((newProfit || 0) / 100);
//       updated[index] = {
//         ...updated[index],
//         // wasManuallyEdited: true,
//         profitOnMaterial: newProfit,
//         rowTotal: Math.round(base + profit),
//       };
//       setNbms(updated);
//     }

//     onFurnitureChange?.();
//   };


//   useEffect(() => {
//     onFurnitureChange?.(); // tell parent something changed
//   }, [coreSelectedBrand, coreSelectedLaminateBrand, coreMaterials, data.fittingsAndAccessories, data.glues]);

//   const renderCoreMaterials = () => (
//     <div className="mt-6">
//       <h3 className="font-semibold text-md text-gray-800 mb-2">
//         Core Materials (Total: ₹{coreTotal.toLocaleString("en-IN")})
//       </h3>
//       <div className="overflow-x-auto rounded-md">
//         <table className="min-w-full text-sm bg-white shadow-sm">
//           <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//             <tr>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//               <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Plywood</th>
//               <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Laminate</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Carpenters / Day</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Material</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Labour</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//             <tr>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
//             </tr>
//           </thead>
//           <tbody>
//             {coreMaterials?.length > 0 && coreMaterials?.map((row, i) => {
//               const rowTotal = calculateRowTotal(row, coreMaterials);
//               return (
//                 <tr key={i} className="group border">
//                   {i === 0 && (
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.imageUrl ? <img src={row?.imageUrl || NO_IMAGE} className="h-10 mx-auto" /> : <>—</>}</td>
//                   )}
//                   <td className="text-center border-r-1 p-2">{row?.itemName || "—"}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.thickness ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.thickness ?? 0}</td>
//                   {i === 0 && (<>

//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.carpenters || 0}</td>
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.days || 0}</td>
//                   </>
//                   )}


//                   <td className="text-center border-r-1 p-2">
//                     <input
//                       type="number"
//                       value={coreMaterials[i].profitOnMaterial}
//                       onChange={(e) => handleProfitMaterialChange(i, parseFloat(e.target.value))}
//                       className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
//                     />
//                   </td>
//                   {/* {i === 0 && (
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
//                   )} */}

//                   {i === 0 && (
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">
//                       <input
//                         type="number"
//                         value={coreMaterials[0].profitOnLabour}
//                         onChange={(e) => handleProfitLabourChange(parseFloat(e.target.value))}
//                         className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
//                       />
//                     </td>
//                   )}

//                   <td className="text-center border-r-1 p-2">{row?.remarks || "—"}</td>
//                   <td className="text-center border-r-1 p-2 text-green-700 font-bold">₹{rowTotal?.toLocaleString("en-IN")}</td>
//                   <td className="text-center border-r-1 p-2">—</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );


//   const sectionTotal = (sectionTitle: "Fittings & Accessories" | "Glues" | "Non-Branded Materials" | string) => {
//     if (sectionTitle === "Fittings & Accessories") {
//       // return fittingsTotal
//       return Math.round(fittingsTotal)
//     }
//     else if (sectionTitle === "Glues") {
//       // return gluesTotal
//       return Math.round(gluesTotal)

//     }
//     else if (sectionTitle === "Non-Branded Materials") {
//       // return nbmsTotal
//       return Math.round(nbmsTotal)

//     }
//     return 0
//   }

//   const renderSimpleSection = (
//     sectionTitle: string,
//     rows: SimpleItemRow[],
//   ) => (
//     <div className="mt-4">
//       <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}

//         (Total: ₹{sectionTotal(sectionTitle).toLocaleString("en-IN")})
//       </h3>
//       <table className="min-w-full text-sm bg-white shadow-sm">
//         <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//           <tr>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit On Materials</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.length > 0 && rows.map((item, i) => (
//             <tr key={i} className="border-b">
//               <td className="text-center border p-2">{item?.itemName || "—"}</td>
//               <td className="text-center border p-2">{item?.description || "—"}</td>
//               <td className="text-center border p-2">{item?.quantity || 0}</td>
//               <td className="text-center border p-2">{item?.cost || 0}</td>
//               {/* <td className="text-center border p-2">{item?.profitOnMaterial || 0}</td> */}
//               <td className="text-center border p-2">
//                 <input
//                   type="number"
//                   value={item.profitOnMaterial || 0}
//                   onChange={(e) => handleProfitChangeInSimpleRow(sectionTitle, i, parseFloat(e.target.value))}
//                   className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
//                 />
//               </td>


//               <td className="text-center border p-2 text-green-700 font-bold">
//                 ₹{(item.rowTotal || 0).toLocaleString("en-IN")}
//               </td>
//               <td className="text-center border p-2">—</td>
//             </tr>
//           ))}

//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
//       <div className=" flex justify-between items-center">
//         <h2 className="text-xl font-semibold  text-blue-600">
//           Product {index + 1}: {data.furnitureName}
//         </h2>

//         <div>
//           <div className="text-right text-xl font-bold text-green-700">
//             Product Total: ₹{furnitureTotal.toLocaleString("en-IN")}
//           </div>

//           <p className="mt-1 text-sm text-gray-600">Raw Cost (no profit)</p>
//           <p className="text-lg font-semibold text-blue-700">
//             ₹{calculateFurnitureRawCost().toLocaleString("en-IN")}
//           </p>
//         </div>


//       </div>
//       <div
//       >
//         <div className="flex justify-between gap-2">


//           <div className="flex-1">
//             <label className="font-medium text-gray-700">Select Plwyood Brand:</label>

//             <SearchSelect
//               options={brandOptions}
//               placeholder="-- Choose Plwyood Brand --"
//               searchPlaceholder="Search Plywood brands..."
//               onSelect={setCoreSelectedBrand}
//               selectedValue={coreSelectedBrand || ""}
//               className="mt-1"
//             />

//           </div>

//           <div className="flex-1">
//             <label className="font-medium text-gray-700">Select Laminate Brand:</label>

//             <SearchSelect
//               options={laminateBrandOptions}
//               placeholder="-- Choose Laminate Brand --"
//               searchPlaceholder="Search laminate brands..."
//               onSelect={setCoreSelectedLaminateBrand}
//               selectedValue={coreSelectedLaminateBrand || ""}
//               className="mt-1"
//             />


//           </div>

//         </div>




//         <div>
//           {coreSelectedBrand && brandRatesByName[coreSelectedBrand]?.length > 0 && (
//             <div className="mt-6 border border-gray-200 bg-white rounded-md shadow-sm p-4">
//               <h3 className="text-md font-semibold text-gray-800 mb-2">
//                 Available Thickness & Rates for <span className="text-blue-600">{coreSelectedBrand}</span>
//               </h3>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border border-gray-100">
//                   <thead className="bg-blue-50 text-xs text-gray-600 uppercase tracking-wider">
//                     <tr>
//                       <th className="px-4 py-2 border-r">Thickness</th>
//                       <th className="px-4 py-2">Rate (₹/sqft)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {brandRatesByName[coreSelectedBrand].map((item, i) => (
//                       <tr key={i} className="border-t border-gray-100">
//                         <td className="px-4 py-2 border-r text-gray-700 font-medium">
//                           {item.thickness}
//                         </td>
//                         <td className="px-4 py-2 text-green-800 font-bold">
//                           ₹{item.rs.toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}


//           {/* START OF LAMINATE */}
//           {coreSelectedLaminateBrand && laminateRatesByBrand[coreSelectedLaminateBrand]?.length > 0 && (
//             <div className="mt-4 border bg-white rounded-md shadow-sm p-4">
//               <h3 className="text-md font-semibold text-gray-800 mb-2">
//                 Laminate Rates for <span className="text-blue-600">{coreSelectedLaminateBrand}</span>
//               </h3>
//               <table className="min-w-full text-sm border">
//                 <thead className="bg-blue-50 text-xs text-gray-600 uppercase">
//                   <tr>
//                     <th className="px-4 py-2 border-r">Thickness</th>
//                     <th className="px-4 py-2">Rate (₹/sqft)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {laminateRatesByBrand[coreSelectedLaminateBrand].map((item, idx) => (
//                     <tr key={idx} className="border-t">
//                       <td className="px-4 py-2 border-r font-medium">{item.thickness}</td>
//                       <td className="px-4 py-2 text-green-800 font-bold">₹{item.rs.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//       {renderCoreMaterials()}

//       {renderSimpleSection("Fittings & Accessories", fittings)}
//       {renderSimpleSection("Glues", glues)}
//       {renderSimpleSection("Non-Branded Materials", nbms)}


//     </div>
//   );
// }
// );
// export default FurnitureQuoteVariantForm;





//  SECOND VERSION

// import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
// import { type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import { NO_IMAGE } from "../../../constants/constants";
// import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";
// import SearchSelect from "../../../components/ui/SearchSelect";

// type Props = {
//   index: number;
//   data: FurnitureBlock;
//   selectedBrand: string | null;
//   selectedLaminateBrand: string | null;

//   labourCost: number

//   brandOptions: string[],
//   laminateBrandOptions: string[]


//   laminateRatesByBrand: Record<string, {
//     thickness: string;
//     rs: number;
//   }[]>

//   brandRatesByName: Record<string, {
//     thickness: string;
//     rs: number;
//   }[]>

//   onFurnitureChange: () => any
// };


// export type FurnitureQuoteRef = {
//   getUpdatedFurniture: () => FurnitureBlock;
// };


// export const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
//   const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

//   const matched = list.find((item) =>
//     String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
//   );

//   // return matched?.rs || type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
//   return (matched?.rs !== undefined)
//     ? matched.rs
//     : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
// };


// const FurnitureQuoteVariantForm = forwardRef<FurnitureQuoteRef, Props>(({
//   data, index, brandOptions, laminateBrandOptions, laminateRatesByBrand, brandRatesByName, labourCost,
//   selectedBrand, selectedLaminateBrand, onFurnitureChange }, ref) => {


//   const [coreSelectedBrand, setCoreSelectedBrand] = useState<string | null>(null);
//   const [coreSelectedLaminateBrand, setCoreSelectedLaminateBrand] = useState<string | null>(null);

//   const selectedBrandRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : []
//   const selectedLaminateRates = coreSelectedLaminateBrand ? laminateRatesByBrand[coreSelectedLaminateBrand] || [] : []

//   const prevLaminateProp = useRef(selectedLaminateBrand);
//   const prevPlywoodProp = useRef(selectedBrand);

//   const [coreMaterials, setCoreMaterials] = useState<CoreMaterialRow[]>(data?.coreMaterials || []);
//   const [fittings, setFittings] = useState(data?.fittingsAndAccessories || []);
//   const [glues, setGlues] = useState(data?.glues || []);
//   const [nbms, setNbms] = useState(data?.nonBrandMaterials || []);

//   useEffect(() => {
//     setCoreMaterials(data?.coreMaterials || []);
//   }, [data?.coreMaterials]);

//   useEffect(() => {
//     if (prevPlywoodProp.current !== selectedBrand) {
//       // ✅ parent changed → update local
//       setCoreSelectedBrand(selectedBrand);
//       prevPlywoodProp.current = selectedBrand;
//     }
//   }, [selectedBrand]);



//   useEffect(() => {
//     if (prevLaminateProp.current !== selectedLaminateBrand) {
//       // ✅ parent changed → update local
//       setCoreSelectedLaminateBrand(selectedLaminateBrand);
//       prevLaminateProp.current = selectedLaminateBrand;
//     }
//   }, [selectedLaminateBrand]);

//   useEffect(() => {
//     if (!coreSelectedBrand && brandOptions?.length > 0) {
//       setCoreSelectedBrand(brandOptions[0]);
//     }
//   }, [brandOptions]);



//   // START OF LAMINATE
//   useEffect(() => {
//     if (!coreSelectedLaminateBrand && laminateBrandOptions?.length > 0) {
//       setCoreSelectedLaminateBrand(laminateBrandOptions[0]);
//     }
//   }, [laminateBrandOptions]);



//   const calculateFurnitureRawCost = () => {
//     const SHEET_SQFT = 32;
//     // const labourRate = 1300;

//     let totalRawCost = 0;

//     const selectedPlyRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : [];
//     const selectedLamRates = coreSelectedLaminateBrand ? laminateRatesByBrand[coreSelectedLaminateBrand] || [] : [];

//     const coreRows = coreMaterials;
//     const baseRow = coreRows[0];
//     // const totalLabour = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourRate;
//     const totalLabour = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourCost;
//     const labourPerRow = coreRows.length > 0 ? totalLabour / coreRows.length : 0;

//     for (const row of coreRows) {
//       const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedPlyRates, "plywood");
//       const lamRate = getRateForThickness(row.laminateNos.thickness, selectedLamRates, "laminate");

//       const plyCost = row.plywoodNos.quantity * SHEET_SQFT * plyRate;
//       const lamCost = row.laminateNos.quantity * SHEET_SQFT * lamRate;

//       totalRawCost += plyCost + lamCost + labourPerRow;
//     }

//     const getTotal = (row: SimpleItemRow) => (row.quantity || 0) * (row.cost || 0);
//     const getGlueTotal = (row: SimpleItemRow) => row.cost || 0;

//     const fittingsTotal = data.fittingsAndAccessories.reduce((acc, r) => acc + getTotal(r), 0);
//     const glueTotal = data.glues.reduce((acc, r) => acc + getGlueTotal(r), 0);
//     const nbmsTotal = data.nonBrandMaterials.reduce((acc, r) => acc + getTotal(r), 0);

//     totalRawCost += fittingsTotal + glueTotal + nbmsTotal;

//     return Math.round(totalRawCost);
//   };


//   // START OF LAMINATE



//   const calculateRowTotal = (row: CoreMaterialRow, coreRows: CoreMaterialRow[]): number => {
//     // ✅ If no selectedBrand or selectedLaminateBrand → use prefilled rowTotal
//     const noBrandSelected = !coreSelectedLaminateBrand && !coreSelectedLaminateBrand;

//     if (noBrandSelected) {
//       return row.rowTotal || 0;
//     }

//     // ✅ Otherwise, calculate using selected brand rates
//     const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates, "plywood");
//     const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates, "laminate");

//     console.log("ply Rate", plyRate)
//     console.log("lami Rate", lamiRate)

//     const SHEET_SQFT = 32;

//     const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
//     const lamiCost = row.laminateNos.quantity * (lamiRate * SHEET_SQFT);
//     // console.log("plyCost", plyCost)
//     // console.log("lamiCost", lamiCost)
//     const baseMaterialCost = plyCost + lamiCost;
//     // console.log("baseMaterialCost", baseMaterialCost)
//     const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
//     // console.log("profitOnMaterial", profitOnMaterial)


//     const totalRows = coreRows.length;

//     const base = coreRows[0];
//     // changed for labour cost
//     // const totalLabourCost = base.carpenters * base.days * RATES.labour;
//     const totalLabourCost = base.carpenters * base.days * labourCost;
//     const labourWithProfit = totalLabourCost * (1 + (base.profitOnLabour || 0) / 100);
//     const labourPerRow = labourWithProfit / totalRows;

//     const total = baseMaterialCost + profitOnMaterial + labourPerRow;
//     // console.log("totla", total)

//     return Math.round(total);
//   };

//   const coreTotal = coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row, coreMaterials), 0);
//   // const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   // const gluesTotal = data.glues.reduce((sum, r) => sum + calculateGlueRowTotal(r), 0);
//   // const nbmsTotal = data.nonBrandMaterials.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const fittingsTotal = fittings.reduce((sum, r) => {
//     const base = (r.quantity || 0) * (r.cost || 0);
//     const profit = base * ((r.profitOnMaterial || 0) / 100);
//     return sum + base + profit;
//   }, 0);

//   const gluesTotal = glues.reduce((sum, r) => {
//     const base = r.cost || 0;
//     const profit = base * ((r.profitOnMaterial || 0) / 100);
//     return sum + base + profit;
//   }, 0);

//   const nbmsTotal = nbms.reduce((sum, r) => {
//     const base = (r.quantity || 0) * (r.cost || 0);
//     const profit = base * ((r.profitOnMaterial || 0) / 100);
//     return sum + base + profit;
//   }, 0);
//   const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

//   useImperativeHandle(ref, () => ({
//     getUpdatedFurniture: () => {


//       const updatedCoreMaterials = coreMaterials.map(row => ({
//         ...row,
//         rowTotal: calculateRowTotal(row, coreMaterials), // ✅ fresh calc
//       }));


//       const updatedFittings = [...fittings];
//       const updatedGlues = [...glues];
//       const updatedNbms = [...nbms];

//       // 👇 Totals for calculations ONLY (numbers)
//       const fittingsTotalLocal = updatedFittings.reduce((sum, r) => {
//         const base = (r.quantity || 0) * (r.cost || 0);
//         const profit = base * ((r.profitOnMaterial || 0) / 100);
//         return sum + base + profit;
//       }, 0);

//       const gluesTotalLocal = updatedGlues.reduce((sum, r) => {
//         const base = r.cost || 0;
//         const profit = base * ((r.profitOnMaterial || 0) / 100);
//         return sum + base + profit;
//       }, 0);

//       const nbmsTotalLocal = updatedNbms.reduce((sum, r) => {
//         const base = (r.quantity || 0) * (r.cost || 0);
//         const profit = base * ((r.profitOnMaterial || 0) / 100);
//         return sum + base + profit;
//       }, 0);

//       const coreTotalLocal = updatedCoreMaterials.reduce((sum, row) => sum + (row.rowTotal || 0), 0);

//       const furnitureTotalLocal = coreTotalLocal + fittingsTotalLocal + gluesTotalLocal + nbmsTotalLocal;

//       return {
//         furnitureName: data.furnitureName, // Original data (with ids etc)

//         plywoodBrand: coreSelectedBrand,
//         laminateBrand: coreSelectedLaminateBrand,

//         coreMaterials: coreMaterials.map(row => ({
//           ...row,
//           rowTotal: calculateRowTotal(row, coreMaterials),
//         })),

//         fittingsAndAccessories: updatedFittings,
//         glues: updatedGlues,
//         nonBrandMaterials: updatedNbms,




//         coreMaterialsTotal: coreTotalLocal,
//         fittingsAndAccessoriesTotal: fittingsTotalLocal,
//         gluesTotal: gluesTotalLocal,
//         nonBrandMaterialsTotal: nbmsTotalLocal,
//         furnitureTotal: furnitureTotalLocal,

//         totals: {
//           core: coreTotalLocal,
//           fittings: fittingsTotalLocal,
//           glues: gluesTotalLocal,
//           nbms: nbmsTotalLocal,
//           furnitureTotal: furnitureTotalLocal,
//         },
//       }

//     }
//   }));



//   const handleProfitMaterialChange = (rowIndex: number, newProfit: number) => {
//     const updated = [...coreMaterials];
//     updated[rowIndex] = { ...updated[rowIndex], profitOnMaterial: (newProfit || 0) };
//     setCoreMaterials(updated);


//     // ✅ ONLY TRIGGER INHERIT IF 0-th ROW IS BEING CHANGED
//     if (rowIndex !== 0) {
//       onFurnitureChange?.();
//       return; // 🚫 Do NOT proceed to sync
//     }

//     const inheritedProfit = newProfit;

//     const recalculateSimpleRows = (
//       rows: SimpleItemRow[],
//       isGlue: boolean = false
//     ): SimpleItemRow[] => {
//       return rows.map((item) => {
//         // if (item.wasManuallyEdited) return item; // skip manually changed
//         const base = isGlue
//           ? item.cost || 0
//           : (item.quantity || 0) * (item.cost || 0);
//         const profit = base * ((inheritedProfit || 0) / 100);
//         return {
//           ...item,
//           profitOnMaterial: inheritedProfit,
//           rowTotal: Math.round(base + profit),
//         };
//       });
//     };

//     setFittings((prev) => recalculateSimpleRows(prev));
//     setGlues((prev) => recalculateSimpleRows(prev, true));
//     setNbms((prev) => recalculateSimpleRows(prev));


//     onFurnitureChange?.(); // trigger parent recalculation
//   };


//   const handleProfitLabourChange = (newProfit: number) => {
//     if (!coreMaterials[0]) return;
//     const updated = [...coreMaterials];
//     updated[0] = { ...updated[0], profitOnLabour: (newProfit || 0) };
//     setCoreMaterials(updated);
//     onFurnitureChange?.(); // trigger parent recalculation
//   };


//   const handleProfitChangeInSimpleRow = (section: string, index: number, newProfit: number) => {
//     if (section === "Fittings & Accessories") {
//       const updated = [...fittings];
//       const base = (updated[index].quantity || 0) * (updated[index].cost || 0);
//       const profit = base * ((newProfit || 0) / 100);
//       updated[index] = {
//         ...updated[index],
//         // wasManuallyEdited: true,
//         profitOnMaterial: newProfit,
//         rowTotal: Math.round(base + profit),
//       };
//       setFittings(updated);
//     }

//     if (section === "Glues") {
//       const updated = [...glues];
//       const base = updated[index].cost || 0;
//       const profit = base * ((newProfit || 0) / 100);
//       updated[index] = {
//         ...updated[index],
//         // wasManuallyEdited: true,
//         profitOnMaterial: newProfit,
//         rowTotal: Math.round(base + profit),
//       };
//       setGlues(updated);
//     }

//     if (section === "Non-Branded Materials") {
//       const updated = [...nbms];
//       const base = (updated[index].quantity || 0) * (updated[index].cost || 0);
//       const profit = base * ((newProfit || 0) / 100);
//       updated[index] = {
//         ...updated[index],
//         // wasManuallyEdited: true,
//         profitOnMaterial: newProfit,
//         rowTotal: Math.round(base + profit),
//       };
//       setNbms(updated);
//     }

//     onFurnitureChange?.();
//   };


//   useEffect(() => {
//     onFurnitureChange?.(); // tell parent something changed
//   }, [coreSelectedBrand, coreSelectedLaminateBrand, coreMaterials, data.fittingsAndAccessories, data.glues]);

//   const renderCoreMaterials = () => (
//     <div className="mt-6">
//       <h3 className="font-semibold text-md text-gray-800 mb-2">
//         Core Materials (Total: ₹{coreTotal.toLocaleString("en-IN")})
//       </h3>
//       <div className="overflow-x-auto rounded-md">
//         <table className="min-w-full text-sm bg-white shadow-sm">
//           <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//             <tr>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//               <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Plywood</th>
//               <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Laminate</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Carpenters / Day</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Material</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Labour</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//               <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//             <tr>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
//               <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
//             </tr>
//           </thead>
//           <tbody>
//             {coreMaterials?.length > 0 && coreMaterials?.map((row, i) => {
//               const rowTotal = calculateRowTotal(row, coreMaterials);
//               return (
//                 <tr key={i} className="group border">
//                   {i === 0 && (
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.imageUrl ? <img src={row?.imageUrl || NO_IMAGE} className="h-10 mx-auto" /> : <>—</>}</td>
//                   )}
//                   <td className="text-center border-r-1 p-2">{row?.itemName || "—"}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.thickness ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.thickness ?? 0}</td>
//                   {i === 0 && (<>

//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.carpenters || 0}</td>
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.days || 0}</td>
//                   </>
//                   )}

//                   {/* <td className="text-center border-r-1 p-2">{row?.profitOnMaterial || 0}</td> */}

//                   <td className="text-center border-r-1 p-2">
//                     <input
//                       type="number"
//                       value={coreMaterials[i].profitOnMaterial}
//                       onChange={(e) => handleProfitMaterialChange(i, parseFloat(e.target.value))}
//                       className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
//                     />
//                   </td>
//                   {/* {i === 0 && (
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
//                   )} */}

//                   {i === 0 && (
//                     <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">
//                       <input
//                         type="number"
//                         value={coreMaterials[0].profitOnLabour}
//                         onChange={(e) => handleProfitLabourChange(parseFloat(e.target.value))}
//                         className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
//                       />
//                     </td>
//                   )}

//                   <td className="text-center border-r-1 p-2">{row?.remarks || "—"}</td>
//                   <td className="text-center border-r-1 p-2 text-green-700 font-bold">₹{rowTotal?.toLocaleString("en-IN")}</td>
//                   <td className="text-center border-r-1 p-2">—</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );


//   const sectionTotal = (sectionTitle: "Fittings & Accessories" | "Glues" | "Non-Branded Materials" | string) => {
//     if (sectionTitle === "Fittings & Accessories") {
//       // return fittingsTotal
//       return Math.round(fittingsTotal)
//     }
//     else if (sectionTitle === "Glues") {
//       // return gluesTotal
//       return Math.round(gluesTotal)

//     }
//     else if (sectionTitle === "Non-Branded Materials") {
//       // return nbmsTotal
//       return Math.round(nbmsTotal)

//     }
//     return 0
//   }

//   const renderSimpleSection = (
//     sectionTitle: string,
//     rows: SimpleItemRow[],
//   ) => (
//     <div className="mt-4">
//       <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}

//         (Total: ₹{sectionTotal(sectionTitle).toLocaleString("en-IN")})
//       </h3>
//       <table className="min-w-full text-sm bg-white shadow-sm">
//         <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//           <tr>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit On Materials</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.length > 0 && rows.map((item, i) => (
//             <tr key={i} className="border-b">
//               <td className="text-center border p-2">{item?.itemName || "—"}</td>
//               <td className="text-center border p-2">{item?.description || "—"}</td>
//               <td className="text-center border p-2">{item?.quantity || 0}</td>
//               <td className="text-center border p-2">{item?.cost || 0}</td>
//               {/* <td className="text-center border p-2">{item?.profitOnMaterial || 0}</td> */}
//               <td className="text-center border p-2">
//                 <input
//                   type="number"
//                   value={item.profitOnMaterial || 0}
//                   onChange={(e) => handleProfitChangeInSimpleRow(sectionTitle, i, parseFloat(e.target.value))}
//                   className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
//                 />
//               </td>


//               <td className="text-center border p-2 text-green-700 font-bold">
//                 ₹{(item.rowTotal || 0).toLocaleString("en-IN")}
//               </td>
//               <td className="text-center border p-2">—</td>
//             </tr>
//           ))}

//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
//       <div className=" flex justify-between items-center">
//         <h2 className="text-xl font-semibold  text-blue-600">
//           Product {index + 1}: {data.furnitureName}
//         </h2>

//         <div>
//           <div className="text-right text-xl font-bold text-green-700">
//             Product Total: ₹{furnitureTotal.toLocaleString("en-IN")}
//           </div>

//           <p className="mt-1 text-sm text-gray-600">Raw Cost (no profit)</p>
//           <p className="text-lg font-semibold text-blue-700">
//             ₹{calculateFurnitureRawCost().toLocaleString("en-IN")}
//           </p>
//         </div>


//       </div>
//       <div
//       >
//         <div className="flex justify-between gap-2">


//           <div className="flex-1">
//             <label className="font-medium text-gray-700">Select Plwyood Brand:</label>

//             <SearchSelect
//               options={brandOptions}
//               placeholder="-- Choose Plwyood Brand --"
//               searchPlaceholder="Search Plywood brands..."
//               onSelect={setCoreSelectedBrand}
//               selectedValue={coreSelectedBrand || ""}
//               className="mt-1"
//             />

//           </div>

//           <div className="flex-1">
//             <label className="font-medium text-gray-700">Select Laminate Brand:</label>

//             <SearchSelect
//               options={laminateBrandOptions}
//               placeholder="-- Choose Laminate Brand --"
//               searchPlaceholder="Search laminate brands..."
//               onSelect={setCoreSelectedLaminateBrand}
//               selectedValue={coreSelectedLaminateBrand || ""}
//               className="mt-1"
//             />


//           </div>

//         </div>




//         <div>
//           {coreSelectedBrand && brandRatesByName[coreSelectedBrand]?.length > 0 && (
//             <div className="mt-6 border border-gray-200 bg-white rounded-md shadow-sm p-4">
//               <h3 className="text-md font-semibold text-gray-800 mb-2">
//                 Available Thickness & Rates for <span className="text-blue-600">{coreSelectedBrand}</span>
//               </h3>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border border-gray-100">
//                   <thead className="bg-blue-50 text-xs text-gray-600 uppercase tracking-wider">
//                     <tr>
//                       <th className="px-4 py-2 border-r">Thickness</th>
//                       <th className="px-4 py-2">Rate (₹/sqft)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {brandRatesByName[coreSelectedBrand].map((item, i) => (
//                       <tr key={i} className="border-t border-gray-100">
//                         <td className="px-4 py-2 border-r text-gray-700 font-medium">
//                           {item.thickness}
//                         </td>
//                         <td className="px-4 py-2 text-green-800 font-bold">
//                           ₹{item.rs.toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}


//           {/* START OF LAMINATE */}
//           {coreSelectedLaminateBrand && laminateRatesByBrand[coreSelectedLaminateBrand]?.length > 0 && (
//             <div className="mt-4 border bg-white rounded-md shadow-sm p-4">
//               <h3 className="text-md font-semibold text-gray-800 mb-2">
//                 Laminate Rates for <span className="text-blue-600">{coreSelectedLaminateBrand}</span>
//               </h3>
//               <table className="min-w-full text-sm border">
//                 <thead className="bg-blue-50 text-xs text-gray-600 uppercase">
//                   <tr>
//                     <th className="px-4 py-2 border-r">Thickness</th>
//                     <th className="px-4 py-2">Rate (₹/sqft)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {laminateRatesByBrand[coreSelectedLaminateBrand].map((item, idx) => (
//                     <tr key={idx} className="border-t">
//                       <td className="px-4 py-2 border-r font-medium">{item.thickness}</td>
//                       <td className="px-4 py-2 text-green-800 font-bold">₹{item.rs.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//       {renderCoreMaterials()}

//       {renderSimpleSection("Fittings & Accessories", fittings)}
//       {renderSimpleSection("Glues", glues)}
//       {renderSimpleSection("Non-Branded Materials", nbms)}


//     </div>
//   );
// }
// );
// export default FurnitureQuoteVariantForm;




//  THIRD VERSION
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import { NO_IMAGE } from "../../../constants/constants";
import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub";
import SearchSelect from "../../../components/ui/SearchSelect";

type Props = {
  index: number;
  data: FurnitureBlock;
  selectedBrand: string | null;
  selectedInnerBrand: string | null;
  selectedOuterBrand: string | null;
  labourCost: number;
  brandOptions: string[];
  innerOptions: string[];
  outerOptions: string[];
  brandRatesByName: Record<string, { thickness: string; rs: number }[]>;
  innerLaminateRatesByBrand: Record<string, { thickness: string; rs: number }[]>;
  outerLaminateRatesByBrand: Record<string, { thickness: string; rs: number }[]>;
  globalTransportation: number;
  globalProfitPercent: number;
  onFurnitureChange: () => any;
  onProfitOverride: (value: number) => void; // 🆕 Add this
};

export type FurnitureQuoteRef = {
  getUpdatedFurniture: () => FurnitureBlock;
};

export const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
  const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();
  const matched = list.find((item) =>
    String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
  );
  return matched?.rs !== undefined ? matched.rs : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
};

const FurnitureQuoteVariantForm = forwardRef<FurnitureQuoteRef, Props>((props, ref) => {
  const {
    data, index, brandOptions, innerOptions, outerOptions,
    innerLaminateRatesByBrand, outerLaminateRatesByBrand, brandRatesByName, labourCost,
    selectedBrand, selectedInnerBrand, selectedOuterBrand, onFurnitureChange,
    globalProfitPercent, onProfitOverride
  } = props;

  // Local Selection States
  const [coreSelectedBrand, setCoreSelectedBrand] = useState<string | null>(selectedBrand);
  const [coreSelectedInnerBrand, setCoreSelectedInnerBrand] = useState<string | null>(selectedInnerBrand);
  const [coreSelectedOuterBrand, setCoreSelectedOuterBrand] = useState<string | null>(selectedOuterBrand);

  // Table Data States
  const [coreMaterials, setCoreMaterials] = useState<CoreMaterialRow[]>(data?.coreMaterials || []);
  const [fittings, setFittings] = useState(data?.fittingsAndAccessories || []);
  const [glues, setGlues] = useState(data?.glues || []);
  const [nbms, setNbms] = useState(data?.nonBrandMaterials || []);

  // Parent Sync Refs
  const prevPlywoodProp = useRef(selectedBrand);
  const prevInnerProp = useRef(selectedInnerBrand);
  const prevOuterProp = useRef(selectedOuterBrand);

  useEffect(() => {
    if (prevPlywoodProp.current !== selectedBrand) { setCoreSelectedBrand(selectedBrand); prevPlywoodProp.current = selectedBrand; }
  }, [selectedBrand]);

  useEffect(() => {
    if (prevInnerProp.current !== selectedInnerBrand) { setCoreSelectedInnerBrand(selectedInnerBrand); prevInnerProp.current = selectedInnerBrand; }
  }, [selectedInnerBrand]);

  useEffect(() => {
    if (prevOuterProp.current !== selectedOuterBrand) { setCoreSelectedOuterBrand(selectedOuterBrand); prevOuterProp.current = selectedOuterBrand; }
  }, [selectedOuterBrand]);

  useEffect(() => {
    setCoreMaterials(data?.coreMaterials || []);
    setFittings(data?.fittingsAndAccessories || []);
    setGlues(data?.glues || []);
    setNbms(data?.nonBrandMaterials || []);
  }, [data]);

  // CALCULATION LOGIC
  const calculateRowTotal = (row: CoreMaterialRow, allRows: CoreMaterialRow[]): number => {
    const plyRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : [];
    const innerRates = coreSelectedInnerBrand ? innerLaminateRatesByBrand[coreSelectedInnerBrand] || [] : [];
    const outerRates = coreSelectedOuterBrand ? outerLaminateRatesByBrand[coreSelectedOuterBrand] || [] : [];

    const plyRate = getRateForThickness(row.plywoodNos.thickness, plyRates, "plywood");
    const innerRate = getRateForThickness(row.innerLaminate?.thickness || 0, innerRates, "laminate");
    const outerRate = getRateForThickness(row.outerLaminate?.thickness || 0, outerRates, "laminate");

    const SHEET_SQFT = 32;
    const plyCost = (row.plywoodNos?.quantity || 0) * plyRate * SHEET_SQFT;
    const innerCost = (row.innerLaminate?.quantity || 0) * innerRate * SHEET_SQFT;
    const outerCost = (row.outerLaminate?.quantity || 0) * outerRate * SHEET_SQFT;

    const baseMaterialCost = plyCost + innerCost + outerCost;
    const profitOnMaterial = baseMaterialCost * ((row.profitOnMaterial || 0) / 100);

    const totalRows = allRows.length;
    const baseRow = allRows[0];
    const totalLabourCost = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourCost;
    const labourWithLocalProfit = totalLabourCost * (1 + (baseRow?.profitOnLabour || 0) / 100);
    const labourPerRow = totalRows > 0 ? labourWithLocalProfit / totalRows : 0;
    const fabPerRow = totalRows > 0 ? (data.fabricationCost || 0) / totalRows : 0;

    // const effectiveProfit = (data?.furnitureProfit || 0) > 0 ? data.furnitureProfit : globalProfitPercent;
    const effectiveProfit = data.furnitureProfit ?? globalProfitPercent;
    const multiplier = 1 + ((effectiveProfit || 0) / 100);

    return (baseMaterialCost + profitOnMaterial + labourPerRow + fabPerRow) * multiplier;
  };

  const coreTotal = coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row, coreMaterials), 0);
  // const effectiveProductProfit = (data.furnitureProfit || 0) > 0 ? data.furnitureProfit : globalProfitPercent;
  const effectiveProductProfit = data.furnitureProfit ?? globalProfitPercent;
  const multiplier = 1 + ((effectiveProductProfit || 0) / 100);

  const getSimpleTotal = (row: SimpleItemRow, isGlue = false) => {
    const base = isGlue ? (row.cost || 0) : (row.quantity || 0) * (row.cost || 0);
    const profit = base * ((row.profitOnMaterial || 0) / 100);
    return (base + profit) * multiplier;
  };

  const fittingsTotal = fittings.reduce((sum, r) => sum + getSimpleTotal(r), 0);
  const gluesTotal = glues.reduce((sum, r) => sum + getSimpleTotal(r, true), 0);
  const nbmsTotal = nbms.reduce((sum, r) => sum + getSimpleTotal(r), 0);
  const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

  useImperativeHandle(ref, () => ({
    getUpdatedFurniture: () => {


      // 1. Calculate and round row totals for core materials
      const updatedCore = coreMaterials.map(r => ({
        ...r,
        rowTotal: Math.round(calculateRowTotal(r, coreMaterials))
      }));

      // 2. Round the major category totals
      const roundedCoreTotal = Math.round(coreTotal);
      const roundedFittingsTotal = Math.round(fittingsTotal);
      const roundedGluesTotal = Math.round(gluesTotal);
      const roundedNbmsTotal = Math.round(nbmsTotal);
      const roundedFurnitureTotal = Math.round(furnitureTotal);


      return {
        ...data,
        plywoodBrand: coreSelectedBrand,
        innerLaminateBrand: coreSelectedInnerBrand,
        outerLaminateBrand: coreSelectedOuterBrand,
        furnitureProfit: data.furnitureProfit, // The override value
        coreMaterials: updatedCore,

        // Map the totals to match the QuoteFurnitureSchema keys
        // coreMaterialsTotal: coreTotal,
        // fittingsAndAccessoriesTotal: fittingsTotal,
        // gluesTotal: gluesTotal,
        // nonBrandMaterialsTotal: nbmsTotal,
        // furnitureTotal: furnitureTotal,


        coreMaterialsTotal: roundedCoreTotal,
        fittingsAndAccessoriesTotal: roundedFittingsTotal,
        gluesTotal: roundedGluesTotal,
        nonBrandMaterialsTotal: roundedNbmsTotal,
        furnitureTotal: roundedFurnitureTotal,


        totals: { core: coreTotal, fittings: fittingsTotal, glues: gluesTotal, nbms: nbmsTotal, furnitureTotal }
      }
    }
  }));

  useEffect(() => { onFurnitureChange(); }, [coreSelectedBrand, coreSelectedInnerBrand, coreSelectedOuterBrand]);

  const renderSimpleSection = (title: string, rows: SimpleItemRow[], kind: "Fittings" | "Glues" | "NBMs") => (
    <div className="mt-6">
      <h3 className="font-semibold text-md mb-2 text-gray-800">{title} - Total: ₹{Math.round(kind === "Fittings" ? fittingsTotal : kind === "Glues" ? gluesTotal : nbmsTotal).toLocaleString("en-IN")}</h3>
      <table className="min-w-full text-sm bg-white shadow-sm border border-gray-200">
        <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
          <tr>
            <th className="px-6 py-3 border-r">Item Name</th>
            <th className="px-6 py-3 border-r">Description</th>
            <th className="px-6 py-3 border-r">Quantity</th>
            <th className="px-6 py-3 border-r">Cost</th>
            <th className="px-6 py-3 border-r">Profit %</th>
            <th className="px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="p-2 border-r text-center">{item.itemName || "—"}</td>
              <td className="p-2 border-r text-center">{item.description || "—"}</td>
              <td className="p-2 border-r text-center">{item.quantity}</td>
              <td className="p-2 border-r text-center">₹{item.cost}</td>
              <td className="p-2 border-r text-center">
                <input
                  type="number"
                  value={item.profitOnMaterial || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (kind === "Fittings") { const u = [...fittings]; u[i].profitOnMaterial = val; setFittings(u); }
                    else if (kind === "Glues") { const u = [...glues]; u[i].profitOnMaterial = val; setGlues(u); }
                    else { const u = [...nbms]; u[i].profitOnMaterial = val; setNbms(u); }
                    onFurnitureChange();
                  }}
                  className="w-16 text-center border border-blue-200 rounded py-1 font-semibold"
                />
              </td>
              <td className="p-2 text-center font-bold text-green-700">₹{Math.round(getSimpleTotal(item, kind === "Glues")).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="shadow-lg p-6 my-6 border rounded-xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Product {index + 1}: {data.furnitureName}</h2>
        <div className="flex items-center gap-6">
          <section className="flex flex-col items-end">
            <label className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
              Product Profit Override (%)
            </label>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
              <input
                type="number"
                className="w-14 text-right font-black bg-transparent outline-none text-blue-800"
                // This 'data.furnitureProfit' comes from parent state, 
                // so it updates when Global Profit changes too.
                value={data.furnitureProfit ?? ""}
                placeholder={globalProfitPercent.toString()}
                // ✅ Call the new override handler instead of onFurnitureChange
                // onChange={(e) => onProfitOverride(parseFloat(e.target.value) || 0)}
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                  onProfitOverride(val);
                }}
              />
              <span className="ml-1 text-blue-600 font-black text-sm">%</span>
            </div>
          </section>
          <div className="text-right">
            <p className="text-[10px] font-bold text-green-500 uppercase">Grand Product Total</p>
            <p className="text-2xl font-black text-green-600">₹{Math.round(furnitureTotal).toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Brand Selectors */}
      <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
        <div><label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Plywood Brand</label>
          <SearchSelect options={brandOptions} onSelect={setCoreSelectedBrand} selectedValue={coreSelectedBrand || ""} /></div>
        <div><label className="text-[10px] font-extrabold text-blue-400 uppercase mb-1 block">Inner Laminate Brand</label>
          <SearchSelect options={innerOptions} onSelect={setCoreSelectedInnerBrand} selectedValue={coreSelectedInnerBrand || ""} /></div>
        <div><label className="text-[10px] font-extrabold text-orange-400 uppercase mb-1 block">Outer Laminate Brand</label>
          <SearchSelect options={outerOptions} onSelect={setCoreSelectedOuterBrand} selectedValue={coreSelectedOuterBrand || ""} /></div>
      </div>


      {/* --- SELECTED BRANDS RATE SUMMARY --- */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Plywood Rates */}
        <div className="border border-gray-200 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase mb-2 flex justify-between">
            Plywood Rates: <span className="text-blue-600">{coreSelectedBrand || "None"}</span>
          </h3>
          <div className="max-h-[150px] overflow-y-auto border-t border-gray-100 pt-2">
            <table className="min-w-full text-[11px]">
              <tbody>
                {(coreSelectedBrand ? brandRatesByName[coreSelectedBrand] : []).map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-1 text-gray-600 font-medium">{item.thickness} mm</td>
                    <td className="py-1 text-right font-bold text-green-700">₹{item.rs.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inner Laminate Rates */}
        <div className="border border-blue-100 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-[11px] font-bold text-blue-500 uppercase mb-2 flex justify-between">
            Inner Rates: <span className="text-blue-700">{coreSelectedInnerBrand || "None"}</span>
          </h3>
          <div className="max-h-[150px] overflow-y-auto border-t border-blue-50 pt-2">
            <table className="min-w-full text-[11px]">
              <tbody>
                {(coreSelectedInnerBrand ? innerLaminateRatesByBrand[coreSelectedInnerBrand] : []).map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30">
                    <td className="py-1 text-gray-600 font-medium">{item.thickness} mm</td>
                    <td className="py-1 text-right font-bold text-blue-700">₹{item.rs.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outer Laminate Rates */}
        <div className="border border-orange-100 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-[11px] font-bold text-orange-500 uppercase mb-2 flex justify-between">
            Outer Rates: <span className="text-orange-700">{coreSelectedOuterBrand || "None"}</span>
          </h3>
          <div className="max-h-[150px] overflow-y-auto border-t border-orange-50 pt-2">
            <table className="min-w-full text-[11px]">
              <tbody>
                {(coreSelectedOuterBrand ? outerLaminateRatesByBrand[coreSelectedOuterBrand] : []).map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/30">
                    <td className="py-1 text-gray-600 font-medium">{item.thickness} mm</td>
                    <td className="py-1 text-right font-bold text-orange-700">₹{item.rs.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Core Materials Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-blue-50 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Image</th>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Item Name</th>
              <th className="px-4 py-1 border-r border-gray-200" colSpan={2}>Plywood</th>
              <th className="px-4 py-1 border-r border-gray-200" colSpan={4}>Laminate</th>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Carpenters/Day</th>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Days</th>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Profit % Material</th>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Profit % Labour</th>
              <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Remarks</th>
              <th className="px-4 py-3" rowSpan={2}>Row Total</th>
            </tr>
            <tr className="border-t border-gray-200 bg-blue-50/50">
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Qty</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Thk</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Inner Qty</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Inner Thk</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Outer Qty</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Outer Thk</th>
            </tr>
          </thead>
          <tbody>
            {coreMaterials.map((row, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                {i === 0 && <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-white"><img src={row.imageUrl || NO_IMAGE} className="h-12 mx-auto rounded shadow-sm" /></td>}
                <td className="p-2 border-r border-gray-100 font-medium">{row.itemName || "—"}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.plywoodNos.quantity}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.plywoodNos.thickness}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.innerLaminate?.quantity || 0}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.innerLaminate?.thickness || 0}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.outerLaminate?.quantity || 0}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.outerLaminate?.thickness || 0}</td>
                {i === 0 && <><td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.carpenters}</td>
                  <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.days}</td></>}
                <td className="p-2 border-r border-gray-100">
                  <input type="number" value={row.profitOnMaterial} onChange={(e) => { const u = [...coreMaterials]; u[i].profitOnMaterial = parseFloat(e.target.value) || 0; setCoreMaterials(u); onFurnitureChange(); }} className="w-16 border border-blue-100 rounded text-center py-1 font-semibold focus:ring-1 focus:ring-blue-400 outline-none" />
                </td>
                {i === 0 && <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100">
                  <input type="number" value={row.profitOnLabour} onChange={(e) => { const u = [...coreMaterials]; u[0].profitOnLabour = parseFloat(e.target.value) || 0; setCoreMaterials(u); onFurnitureChange(); }} className="w-16 border border-blue-100 rounded text-center py-1 font-semibold focus:ring-1 focus:ring-blue-400 outline-none" />
                </td>}
                <td className="p-2 border-r border-gray-100 text-gray-400 text-[11px] italic">{row.remarks || "—"}</td>
                <td className="p-2 font-bold text-green-600">₹{Math.round(calculateRowTotal(row, coreMaterials)).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderSimpleSection("Fittings & Accessories", fittings, "Fittings")}
      {renderSimpleSection("Glues", glues, "Glues")}
      {renderSimpleSection("Non-Branded Materials", nbms, "NBMs")}
    </div>
  );
});

export default FurnitureQuoteVariantForm;