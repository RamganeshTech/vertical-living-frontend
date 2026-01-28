// import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
// import { type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import { NO_IMAGE } from "../../../constants/constants";
// import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub";
// import SearchSelect from "../../../components/ui/SearchSelect";

// type Props = {
//   index: number;
//   data: FurnitureBlock;
//   selectedBrand: string | null;
//   selectedInnerBrand: string | null;
//   selectedOuterBrand: string | null;
//   labourCost: number;
//   brandOptions: string[];
//   innerOptions: string[];
//   outerOptions: string[];
//   brandRatesByName: Record<string, { thickness: string; rs: number }[]>;
//   innerLaminateRatesByBrand: Record<string, { thickness: string; rs: number }[]>;
//   outerLaminateRatesByBrand: Record<string, { thickness: string; rs: number }[]>;
//   globalTransportation: number;
//   globalProfitPercent: number;
//   onFurnitureChange: () => any;
//   onProfitOverride: (value: number) => void; // 🆕 Add this
// };

// export type FurnitureQuoteRef = {
//   getUpdatedFurniture: () => FurnitureBlock;
// };

// export const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
//   const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();
//   const matched = list.find((item) =>
//     String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
//   );
//   return matched?.rs !== undefined ? matched.rs : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
// };

// const FurnitureQuoteVariantForm = forwardRef<FurnitureQuoteRef, Props>((props, ref) => {
//   const {
//     data, index, brandOptions, innerOptions, outerOptions,
//     innerLaminateRatesByBrand, outerLaminateRatesByBrand, brandRatesByName, labourCost,
//     selectedBrand, selectedInnerBrand, selectedOuterBrand, onFurnitureChange,
//     globalProfitPercent, onProfitOverride
//   } = props;

//   // Local Selection States
//   const [coreSelectedBrand, setCoreSelectedBrand] = useState<string | null>(selectedBrand);
//   const [coreSelectedInnerBrand, setCoreSelectedInnerBrand] = useState<string | null>(selectedInnerBrand);
//   const [coreSelectedOuterBrand, setCoreSelectedOuterBrand] = useState<string | null>(selectedOuterBrand);

//   // Table Data States
//   const [coreMaterials, setCoreMaterials] = useState<CoreMaterialRow[]>(data?.coreMaterials || []);
//   const [fittings, setFittings] = useState(data?.fittingsAndAccessories || []);
//   const [glues, setGlues] = useState(data?.glues || []);
//   const [nbms, setNbms] = useState(data?.nonBrandMaterials || []);

//   // Parent Sync Refs
//   const prevPlywoodProp = useRef(selectedBrand);
//   const prevInnerProp = useRef(selectedInnerBrand);
//   const prevOuterProp = useRef(selectedOuterBrand);

//   useEffect(() => {
//     if (prevPlywoodProp.current !== selectedBrand) { setCoreSelectedBrand(selectedBrand); prevPlywoodProp.current = selectedBrand; }
//   }, [selectedBrand]);

//   useEffect(() => {
//     if (prevInnerProp.current !== selectedInnerBrand) { setCoreSelectedInnerBrand(selectedInnerBrand); prevInnerProp.current = selectedInnerBrand; }
//   }, [selectedInnerBrand]);

//   useEffect(() => {
//     if (prevOuterProp.current !== selectedOuterBrand) { setCoreSelectedOuterBrand(selectedOuterBrand); prevOuterProp.current = selectedOuterBrand; }
//   }, [selectedOuterBrand]);

//   useEffect(() => {
//     setCoreMaterials(data?.coreMaterials || []);
//     setFittings(data?.fittingsAndAccessories || []);
//     setGlues(data?.glues || []);
//     setNbms(data?.nonBrandMaterials || []);
//   }, [data]);

//   // CALCULATION LOGIC
//   const calculateRowTotal = (row: CoreMaterialRow, allRows: CoreMaterialRow[]): number => {
//     const plyRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : [];
//     const innerRates = coreSelectedInnerBrand ? innerLaminateRatesByBrand[coreSelectedInnerBrand] || [] : [];
//     const outerRates = coreSelectedOuterBrand ? outerLaminateRatesByBrand[coreSelectedOuterBrand] || [] : [];

//     const plyRate = getRateForThickness(row.plywoodNos.thickness, plyRates, "plywood");
//     const innerRate = getRateForThickness(row.innerLaminate?.thickness || 0, innerRates, "laminate");
//     const outerRate = getRateForThickness(row.outerLaminate?.thickness || 0, outerRates, "laminate");

//     const SHEET_SQFT = 32;
//     const plyCost = (row.plywoodNos?.quantity || 0) * plyRate * SHEET_SQFT;
//     const innerCost = (row.innerLaminate?.quantity || 0) * innerRate * SHEET_SQFT;
//     const outerCost = (row.outerLaminate?.quantity || 0) * outerRate * SHEET_SQFT;

//     const baseMaterialCost = plyCost + innerCost + outerCost;
//     const profitOnMaterial = baseMaterialCost * ((row.profitOnMaterial || 0) / 100);

//     const totalRows = allRows.length;
//     const baseRow = allRows[0];
//     const totalLabourCost = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourCost;
//     const labourWithLocalProfit = totalLabourCost * (1 + (baseRow?.profitOnLabour || 0) / 100);
//     const labourPerRow = totalRows > 0 ? labourWithLocalProfit / totalRows : 0;
//     const fabPerRow = totalRows > 0 ? (data.fabricationCost || 0) / totalRows : 0;

//     // const effectiveProfit = (data?.furnitureProfit || 0) > 0 ? data.furnitureProfit : globalProfitPercent;
//     const effectiveProfit = data.furnitureProfit ?? globalProfitPercent;
//     const multiplier = 1 + ((effectiveProfit || 0) / 100);

//     return (baseMaterialCost + profitOnMaterial + labourPerRow + fabPerRow) * multiplier;
//   };

//   const coreTotal = coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row, coreMaterials), 0);
//   // const effectiveProductProfit = (data.furnitureProfit || 0) > 0 ? data.furnitureProfit : globalProfitPercent;
//   const effectiveProductProfit = data.furnitureProfit ?? globalProfitPercent;
//   const multiplier = 1 + ((effectiveProductProfit || 0) / 100);

//   const getSimpleTotal = (row: SimpleItemRow, isGlue = false) => {
//     const base = isGlue ? (row.cost || 0) : (row.quantity || 0) * (row.cost || 0);
//     const profit = base * ((row.profitOnMaterial || 0) / 100);
//     return (base + profit) * multiplier;
//   };

//   const fittingsTotal = fittings.reduce((sum, r) => sum + getSimpleTotal(r), 0);
//   const gluesTotal = glues.reduce((sum, r) => sum + getSimpleTotal(r, true), 0);
//   const nbmsTotal = nbms.reduce((sum, r) => sum + getSimpleTotal(r), 0);
//   const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

//   useImperativeHandle(ref, () => ({
//     getUpdatedFurniture: () => {


//       // 1. Calculate and round row totals for core materials
//       const updatedCore = coreMaterials.map(r => ({
//         ...r,
//         rowTotal: Math.round(calculateRowTotal(r, coreMaterials))
//       }));

//       // 2. Round the major category totals
//       const roundedCoreTotal = Math.round(coreTotal);
//       const roundedFittingsTotal = Math.round(fittingsTotal);
//       const roundedGluesTotal = Math.round(gluesTotal);
//       const roundedNbmsTotal = Math.round(nbmsTotal);
//       const roundedFurnitureTotal = Math.round(furnitureTotal);


//       return {
//         ...data,
//         plywoodBrand: coreSelectedBrand,
//         innerLaminateBrand: coreSelectedInnerBrand,
//         outerLaminateBrand: coreSelectedOuterBrand,
//         furnitureProfit: data.furnitureProfit, // The override value
//         coreMaterials: updatedCore,

//         // Map the totals to match the QuoteFurnitureSchema keys
//         // coreMaterialsTotal: coreTotal,
//         // fittingsAndAccessoriesTotal: fittingsTotal,
//         // gluesTotal: gluesTotal,
//         // nonBrandMaterialsTotal: nbmsTotal,
//         // furnitureTotal: furnitureTotal,


//         coreMaterialsTotal: roundedCoreTotal,
//         fittingsAndAccessoriesTotal: roundedFittingsTotal,
//         gluesTotal: roundedGluesTotal,
//         nonBrandMaterialsTotal: roundedNbmsTotal,
//         furnitureTotal: roundedFurnitureTotal,


//         totals: { core: coreTotal, fittings: fittingsTotal, glues: gluesTotal, nbms: nbmsTotal, furnitureTotal }
//       }
//     }
//   }));

//   useEffect(() => { onFurnitureChange(); }, [coreSelectedBrand, coreSelectedInnerBrand, coreSelectedOuterBrand]);

//   const renderSimpleSection = (title: string, rows: SimpleItemRow[], kind: "Fittings" | "Glues" | "NBMs") => (
//     <div className="mt-6">
//       <h3 className="font-semibold text-md mb-2 text-gray-800">{title} - Total: ₹{Math.round(kind === "Fittings" ? fittingsTotal : kind === "Glues" ? gluesTotal : nbmsTotal).toLocaleString("en-IN")}</h3>
//       <table className="min-w-full text-sm bg-white shadow-sm border border-gray-200">
//         <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//           <tr>
//             <th className="px-6 py-3 border-r">Item Name</th>
//             <th className="px-6 py-3 border-r">Description</th>
//             <th className="px-6 py-3 border-r">Quantity</th>
//             <th className="px-6 py-3 border-r">Cost</th>
//             <th className="px-6 py-3 border-r">Profit %</th>
//             <th className="px-6 py-3">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((item, i) => (
//             <tr key={i} className="border-t hover:bg-gray-50">
//               <td className="p-2 border-r text-center">{item.itemName || "—"}</td>
//               <td className="p-2 border-r text-center">{item.description || "—"}</td>
//               <td className="p-2 border-r text-center">{item.quantity}</td>
//               <td className="p-2 border-r text-center">₹{item.cost}</td>
//               <td className="p-2 border-r text-center">
//                 <input
//                   type="number"
//                   value={item.profitOnMaterial || 0}
//                   onChange={(e) => {
//                     const val = parseFloat(e.target.value) || 0;
//                     if (kind === "Fittings") { const u = [...fittings]; u[i].profitOnMaterial = val; setFittings(u); }
//                     else if (kind === "Glues") { const u = [...glues]; u[i].profitOnMaterial = val; setGlues(u); }
//                     else { const u = [...nbms]; u[i].profitOnMaterial = val; setNbms(u); }
//                     onFurnitureChange();
//                   }}
//                   className="w-16 text-center border border-blue-200 rounded py-1 font-semibold"
//                 />
//               </td>
//               <td className="p-2 text-center font-bold text-green-700">₹{Math.round(getSimpleTotal(item, kind === "Glues")).toLocaleString("en-IN")}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="shadow-lg p-6 my-6 border rounded-xl bg-white">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-blue-700">Product {index + 1}: {data.furnitureName}</h2>
//         <div className="flex items-center gap-6">
//           <section className="flex flex-col items-end">
//             <label className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
//               Product Profit Override (%)
//             </label>
//             <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
//               <input
//                 type="number"
//                 className="w-14 text-right font-black bg-transparent outline-none text-blue-800"
//                 // This 'data.furnitureProfit' comes from parent state, 
//                 // so it updates when Global Profit changes too.
//                 value={data.furnitureProfit ?? ""}
//                 placeholder={globalProfitPercent.toString()}
//                 // ✅ Call the new override handler instead of onFurnitureChange
//                 // onChange={(e) => onProfitOverride(parseFloat(e.target.value) || 0)}
//                 onChange={(e) => {
//                   const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
//                   onProfitOverride(val);
//                 }}
//               />
//               <span className="ml-1 text-blue-600 font-black text-sm">%</span>
//             </div>
//           </section>
//           <div className="text-right">
//             <p className="text-[10px] font-bold text-green-500 uppercase">Grand Product Total</p>
//             <p className="text-2xl font-black text-green-600">₹{Math.round(furnitureTotal).toLocaleString("en-IN")}</p>
//           </div>
//         </div>
//       </div>

//       {/* Brand Selectors */}
//       <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
//         <div><label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Plywood Brand</label>
//           <SearchSelect options={brandOptions} onSelect={setCoreSelectedBrand} selectedValue={coreSelectedBrand || ""} /></div>
//         <div><label className="text-[10px] font-extrabold text-blue-400 uppercase mb-1 block">Inner Laminate Brand</label>
//           <SearchSelect options={innerOptions} onSelect={setCoreSelectedInnerBrand} selectedValue={coreSelectedInnerBrand || ""} /></div>
//         <div><label className="text-[10px] font-extrabold text-orange-400 uppercase mb-1 block">Outer Laminate Brand</label>
//           <SearchSelect options={outerOptions} onSelect={setCoreSelectedOuterBrand} selectedValue={coreSelectedOuterBrand || ""} /></div>
//       </div>


//       {/* --- SELECTED BRANDS RATE SUMMARY --- */}
//       <div className="grid grid-cols-3 gap-6 mb-8">
//         {/* Plywood Rates */}
//         <div className="border border-gray-200 bg-white rounded-lg shadow-sm p-3">
//           <h3 className="text-[11px] font-bold text-gray-500 uppercase mb-2 flex justify-between">
//             Plywood Rates: <span className="text-blue-600">{coreSelectedBrand || "None"}</span>
//           </h3>
//           <div className="max-h-[150px] overflow-y-auto border-t border-gray-100 pt-2">
//             <table className="min-w-full text-[11px]">
//               <tbody>
//                 {(coreSelectedBrand ? brandRatesByName[coreSelectedBrand] : []).map((item, i) => (
//                   <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
//                     <td className="py-1 text-gray-600 font-medium">{item.thickness} mm</td>
//                     <td className="py-1 text-right font-bold text-green-700">₹{item.rs.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Inner Laminate Rates */}
//         <div className="border border-blue-100 bg-white rounded-lg shadow-sm p-3">
//           <h3 className="text-[11px] font-bold text-blue-500 uppercase mb-2 flex justify-between">
//             Inner Rates: <span className="text-blue-700">{coreSelectedInnerBrand || "None"}</span>
//           </h3>
//           <div className="max-h-[150px] overflow-y-auto border-t border-blue-50 pt-2">
//             <table className="min-w-full text-[11px]">
//               <tbody>
//                 {(coreSelectedInnerBrand ? innerLaminateRatesByBrand[coreSelectedInnerBrand] : []).map((item, i) => (
//                   <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30">
//                     <td className="py-1 text-gray-600 font-medium">{item.thickness} mm</td>
//                     <td className="py-1 text-right font-bold text-blue-700">₹{item.rs.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Outer Laminate Rates */}
//         <div className="border border-orange-100 bg-white rounded-lg shadow-sm p-3">
//           <h3 className="text-[11px] font-bold text-orange-500 uppercase mb-2 flex justify-between">
//             Outer Rates: <span className="text-orange-700">{coreSelectedOuterBrand || "None"}</span>
//           </h3>
//           <div className="max-h-[150px] overflow-y-auto border-t border-orange-50 pt-2">
//             <table className="min-w-full text-[11px]">
//               <tbody>
//                 {(coreSelectedOuterBrand ? outerLaminateRatesByBrand[coreSelectedOuterBrand] : []).map((item, i) => (
//                   <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/30">
//                     <td className="py-1 text-gray-600 font-medium">{item.thickness} mm</td>
//                     <td className="py-1 text-right font-bold text-orange-700">₹{item.rs.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Core Materials Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//         <table className="min-w-full text-sm text-center">
//           <thead className="bg-blue-50 text-gray-600 font-bold">
//             <tr>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Image</th>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Item Name</th>
//               <th className="px-4 py-1 border-r border-gray-200" colSpan={2}>Plywood</th>
//               <th className="px-4 py-1 border-r border-gray-200" colSpan={4}>Laminate</th>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Carpenters/Day</th>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Days</th>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Profit % Material</th>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Profit % Labour</th>
//               <th className="px-4 py-3 border-r border-gray-200" rowSpan={2}>Remarks</th>
//               <th className="px-4 py-3" rowSpan={2}>Row Total</th>
//             </tr>
//             <tr className="border-t border-gray-200 bg-blue-50/50">
//               <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Thk</th>
//               <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Qty</th>
//               <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Outer Thk</th>
//               <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Outer Qty</th>
//               <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Inner Thk</th>
//               <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Inner Qty</th>

//             </tr>
//           </thead>
//           <tbody>
//             {coreMaterials.map((row, i) => (
//               <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
//                 {i === 0 && <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-white"><img src={row.imageUrl || NO_IMAGE} className="h-12 mx-auto rounded shadow-sm" /></td>}
//                 <td className="p-2 border-r border-gray-100 font-medium">{row.itemName || "—"}</td>
//                 <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.plywoodNos.thickness}</td>
//                 <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.plywoodNos.quantity}</td>

//                 <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.outerLaminate?.thickness || 0}</td>
//                 <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.outerLaminate?.quantity || 0}</td>


//                 <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.innerLaminate?.thickness || 0}</td>
//                 <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.innerLaminate?.quantity || 0}</td>

//                 {i === 0 && <><td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.carpenters}</td>
//                   <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.days}</td></>}
//                 <td className="p-2 border-r border-gray-100">
//                   <input type="number" value={row.profitOnMaterial} onChange={(e) => { const u = [...coreMaterials]; u[i].profitOnMaterial = parseFloat(e.target.value) || 0; setCoreMaterials(u); onFurnitureChange(); }} className="w-16 border border-blue-100 rounded text-center py-1 font-semibold focus:ring-1 focus:ring-blue-400 outline-none" />
//                 </td>
//                 {i === 0 && <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100">
//                   <input type="number" value={row.profitOnLabour} onChange={(e) => { const u = [...coreMaterials]; u[0].profitOnLabour = parseFloat(e.target.value) || 0; setCoreMaterials(u); onFurnitureChange(); }} className="w-16 border border-blue-100 rounded text-center py-1 font-semibold focus:ring-1 focus:ring-blue-400 outline-none" />
//                 </td>}
//                 <td className="p-2 border-r border-gray-100 text-gray-400 text-[11px] italic">{row.remarks || "—"}</td>
//                 <td className="p-2 font-bold text-green-600">₹{Math.round(calculateRowTotal(row, coreMaterials)).toLocaleString("en-IN")}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {renderSimpleSection("Fittings & Accessories", fittings, "Fittings")}
//       {renderSimpleSection("Glues", glues, "Glues")}
//       {renderSimpleSection("Non-Branded Materials", nbms, "NBMs")}
//     </div>
//   );
// });

// export default FurnitureQuoteVariantForm;





//  last option needs to be get saved here 

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import { NO_IMAGE } from "../../../constants/constants";
import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub";
// import SearchSelect from "../../../components/ui/SearchSelect";
import SearchSelectNew from "../../../components/ui/SearchSelectNew";

type Props = {
  index: number;
  data: FurnitureBlock;
  selectedBrand: string | null;
  selectedInnerBrand: string | null;
  selectedOuterBrand: string | null;
  labourCost: number;
  brandOptions: { label: string; value: string }[]; // ✅ Change from string[]
  innerOptions: { label: string; value: string }[]; // ✅ Change from string[]
  outerOptions: { label: string; value: string }[]; // ✅ Change from string[]
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

  // Local Selection States
  const [coreSelectedBrandId, setCoreSelectedBrandId] = useState<string | null>(null);
  const [coreSelectedInnerBrandId, setCoreSelectedInnerBrandId] = useState<string | null>(null);
  const [coreSelectedOuterBrandId, setCoreSelectedOuterBrandId] = useState<string | null>(null);

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

  // // 1. Plywood Sync
  // useEffect(() => {
  //   // Only update from parent prop if the product doesn't have its own ID yet
  //   // OR if the parent prop actually changed to something new
  //   if (selectedBrand) {
  //     const found = brandOptions.find(o => o.label === selectedBrand || o.value === selectedBrand);

  //     // Check if we already have a saved product ID in data
  //     const savedId = data.plywoodBrandId;

  //     if (savedId) {
  //       const savedBrandObj = brandOptions.find(o => o.value === savedId);
  //       setCoreSelectedBrand(savedBrandObj?.label || selectedBrand);
  //       setCoreSelectedBrandId(savedId);
  //     } else {
  //       setCoreSelectedBrand(found?.label || selectedBrand);
  //       setCoreSelectedBrandId(found?.value || null);
  //     }
  //   }
  // }, [selectedBrand, brandOptions, data.plywoodBrandId]); // Watch the saved ID too

  // // 2. Inner Laminate Sync
  // useEffect(() => {
  //   if (selectedInnerBrand) {
  //     const found = innerOptions.find(o => o.label === selectedInnerBrand || o.value === selectedInnerBrand);
  //     const savedId = data.innerLaminateBrandId;

  //     if (savedId) {
  //       const savedBrandObj = innerOptions.find(o => o.value === savedId);
  //       setCoreSelectedInnerBrand(savedBrandObj?.label || selectedInnerBrand);
  //       setCoreSelectedInnerBrandId(savedId);
  //     } else {
  //       setCoreSelectedInnerBrand(found?.label || selectedInnerBrand);
  //       setCoreSelectedInnerBrandId(found?.value || null);
  //     }
  //   }
  // }, [selectedInnerBrand, innerOptions, data.innerLaminateBrandId]);

  // // 3. Outer Laminate Sync
  // useEffect(() => {
  //   if (selectedOuterBrand) {
  //     const found = outerOptions.find(o => o.label === selectedOuterBrand || o.value === selectedOuterBrand);
  //     const savedId = data.outerLaminateBrandId;

  //     if (savedId) {
  //       const savedBrandObj = outerOptions.find(o => o.value === savedId);
  //       setCoreSelectedOuterBrand(savedBrandObj?.label || selectedOuterBrand);
  //       setCoreSelectedOuterBrandId(savedId);
  //     } else {
  //       setCoreSelectedOuterBrand(found?.label || selectedOuterBrand);
  //       setCoreSelectedOuterBrandId(found?.value || null);
  //     }
  //   }
  // }, [selectedOuterBrand, outerOptions, data.outerLaminateBrandId]);


  const isInitialized = useRef(false);
// 1. Unified Plywood Sync
useEffect(() => {
    if (!brandOptions.length) return;

    const savedId = data.plywoodBrandId;
    const globalFound = brandOptions.find(o => o.label === selectedBrand || o.value === selectedBrand);

    if (!isInitialized.current && savedId) {
        // --- HYDRATION: Use the ID saved in the database for THIS product ---
        const savedObj = brandOptions.find(o => o.value === savedId);
        setCoreSelectedBrand(savedObj?.label || null);
        setCoreSelectedBrandId(savedId);
    } 
    else if (isInitialized.current && selectedBrand) {
        // --- SYNC: Only follow global prop AFTER initial load is finished ---
        setCoreSelectedBrand(globalFound?.label || selectedBrand);
        setCoreSelectedBrandId(globalFound?.value || null);
    }
}, [selectedBrand, brandOptions, data.plywoodBrandId]);

// 2. Unified Inner Laminate Sync
useEffect(() => {
    if (!innerOptions.length) return;

    const savedId = data.innerLaminateBrandId;
    const globalFound = innerOptions.find(o => o.label === selectedInnerBrand || o.value === selectedInnerBrand);

    if (!isInitialized.current && savedId) {
        // --- HYDRATION: Use specific product ID ---
        const savedObj = innerOptions.find(o => o.value === savedId);
        setCoreSelectedInnerBrand(savedObj?.label || null);
        setCoreSelectedInnerBrandId(savedId);
    } 
    else if (isInitialized.current && selectedInnerBrand) {
        // --- SYNC: Follow global change ---
        setCoreSelectedInnerBrand(globalFound?.label || selectedInnerBrand);
        setCoreSelectedInnerBrandId(globalFound?.value || null);
    }
}, [selectedInnerBrand, innerOptions, data.innerLaminateBrandId]);

// 3. Unified Outer Laminate Sync
useEffect(() => {
    if (!outerOptions.length) return;

    const savedId = data.outerLaminateBrandId;
    const globalFound = outerOptions.find(o => o.label === selectedOuterBrand || o.value === selectedOuterBrand);

    if (!isInitialized.current && savedId) {
        // --- HYDRATION: Use specific product ID ---
        const savedObj = outerOptions.find(o => o.value === savedId);
        setCoreSelectedOuterBrand(savedObj?.label || null);
        setCoreSelectedOuterBrandId(savedId);
    } 
    else if (isInitialized.current && selectedOuterBrand) {
        // --- SYNC: Follow global change ---
        setCoreSelectedOuterBrand(globalFound?.label || selectedOuterBrand);
        setCoreSelectedOuterBrandId(globalFound?.value || null);
    }
}, [selectedOuterBrand, outerOptions, data.outerLaminateBrandId]);

// --- CRITICAL FIX: Master Initialization Lock ---
useEffect(() => {
    if (brandOptions.length > 0 && innerOptions.length > 0 && outerOptions.length > 0) {
        // We use a small timeout to ensure the "Hydration" effects above 
        // finish processing the database IDs before we allow global overrides.
        const timer = setTimeout(() => {
            isInitialized.current = true;
        }, 300); 
        return () => clearTimeout(timer);
    }
}, [brandOptions.length, innerOptions.length, outerOptions.length]);


  // Update your handle function to catch both pieces of data
  // ✅ FIX: Allow 'val' to be null
  const handleLocalBrandChange = (val: string | null, type: 'plywood' | 'inner' | 'outer') => {
    // If val is null, we reset everything for that category
    if (!val) {
      if (type === 'plywood') {
        setCoreSelectedBrand(null);
        setCoreSelectedBrandId(null);
      } else if (type === 'inner') {
        setCoreSelectedInnerBrand(null);
        setCoreSelectedInnerBrandId(null);
      } else {
        setCoreSelectedOuterBrand(null);
        setCoreSelectedOuterBrandId(null);
      }
      return;
    }

    const options = type === 'plywood' ? brandOptions : type === 'inner' ? innerOptions : outerOptions;
    const selectedObj = options.find(opt => opt.value === val);

    if (type === 'plywood') {
      setCoreSelectedBrand(selectedObj?.label || val);
      setCoreSelectedBrandId(selectedObj?.value || null);
    } else if (type === 'inner') {
      setCoreSelectedInnerBrand(selectedObj?.label || val);
      setCoreSelectedInnerBrandId(selectedObj?.value || null);
    } else {
      setCoreSelectedOuterBrand(selectedObj?.label || val);
      setCoreSelectedOuterBrandId(selectedObj?.value || null);
    }
  };



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



        // 🆕 Brand IDs (New fields for DB)
        plywoodBrandId: coreSelectedBrandId,
        innerLaminateBrandId: coreSelectedInnerBrandId,
        outerLaminateBrandId: coreSelectedOuterBrandId,


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
      {/* <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
        <div><label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Plywood Brand</label>
          <SearchSelect options={brandOptions} onSelect={setCoreSelectedBrand} selectedValue={coreSelectedBrand || ""} /></div>
        <div><label className="text-[10px] font-extrabold text-blue-400 uppercase mb-1 block">Inner Laminate Brand</label>
          <SearchSelect options={innerOptions} onSelect={setCoreSelectedInnerBrand} selectedValue={coreSelectedInnerBrand || ""} /></div>
        <div><label className="text-[10px] font-extrabold text-orange-400 uppercase mb-1 block">Outer Laminate Brand</label>
          <SearchSelect options={outerOptions} onSelect={setCoreSelectedOuterBrand} selectedValue={coreSelectedOuterBrand || ""} /></div>
      </div> */}


      {/* Brand Selectors */}
      <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
        <div>
          <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Plywood Brand</label>
          <SearchSelectNew
            options={brandOptions}
            onValueChange={(val) => handleLocalBrandChange(val, 'plywood')}
            value={coreSelectedBrandId || ""} // Use ID for selection state
          />
        </div>

        <div>
          <label className="text-[10px] font-extrabold text-blue-400 uppercase mb-1 block">Inner Laminate Brand</label>
          <SearchSelectNew
            options={innerOptions}
            onValueChange={(val) => handleLocalBrandChange(val, 'inner')}
            value={coreSelectedInnerBrandId || ""}
          />
        </div>

        <div>
          <label className="text-[10px] font-extrabold text-orange-400 uppercase mb-1 block">Outer Laminate Brand</label>
          <SearchSelectNew
            options={outerOptions}
            onValueChange={(val) => handleLocalBrandChange(val, 'outer')}
            value={coreSelectedOuterBrandId || ""}
          />
        </div>
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
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Thk</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Qty</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Outer Thk</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Outer Qty</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Inner Thk</th>
              <th className="px-2 py-2 text-[10px] uppercase border-r border-gray-200">Inner Qty</th>

            </tr>
          </thead>
          <tbody>
            {coreMaterials.map((row, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                {i === 0 && <td rowSpan={coreMaterials.length} className="p-2 border-r border-gray-100 bg-white"><img src={row.imageUrl || NO_IMAGE} className="h-12 mx-auto rounded shadow-sm" /></td>}
                <td className="p-2 border-r border-gray-100 font-medium">{row.itemName || "—"}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.plywoodNos.thickness}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.plywoodNos.quantity}</td>

                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.outerLaminate?.thickness || 0}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.outerLaminate?.quantity || 0}</td>


                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.innerLaminate?.thickness || 0}</td>
                <td className="p-2 border-r border-gray-100 bg-gray-50 text-gray-500 font-mono">{row.innerLaminate?.quantity || 0}</td>

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