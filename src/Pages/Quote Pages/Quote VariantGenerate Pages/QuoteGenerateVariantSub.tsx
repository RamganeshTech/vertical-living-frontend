// import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGenerateQuotePdf, useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
// import { type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import FurnitureQuoteVariantForm, { getRateForThickness, type FurnitureQuoteRef } from "./FurnitureQuoteVariantForm";
// import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { toast } from "../../../utils/toast";
// import { Button } from "../../../components/ui/Button";
// // import { downloadImage } from "../../../utils/downloadFile";
// import SearchSelect from "../../../components/ui/SearchSelect";
// import { Card } from "../../../components/ui/Card";
// import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from "../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
// import { useAuthCheck } from "../../../Hooks/useAuthCheck";
// // import { Label } from "../../../components/ui/Label";
// import SearchSelectNew from "../../../components/ui/SearchSelectNew";

// export const DEFAULT_LAMINATE_RATE_PER_SQFT = 0;

// const QuoteGenerateVariantSub = () => {
//     const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>();
//     const navigate = useNavigate()

//     const { data: quote, isLoading: quoteLoading } = useGetMaterialQuoteSingleEntry(organizationId!, quoteId!);
//     let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
//     // let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
//     let { data: innerLaminateBrands } = useGetMaterialBrands(organizationId!, "inner laminate"); // 🆕
//     let { data: outerLaminateBrands } = useGetMaterialBrands(organizationId!, "outer laminate"); // 🆕


//     const [selectedLabourCategory, setSelectedLabourCategory] = useState({
//         categoryId: "",
//         categoryName: ""
//     });

//     let { data: labourCost = 0 } = useGetSingleLabourCost({ organizationId: organizationId!, categoryId: selectedLabourCategory.categoryId });

//     let { data: allLabourCategory = [] } = useGetLabourRateConfigCategories(organizationId!);

//     const allLabourCategoryOptions = (allLabourCategory || []).map((labour: any) => ({
//         value: labour._id,
//         label: labour.name,
//     }))



//     // let { data: labourCost = 0 } = useGetSingleLabourCost({organizationId:organizationId!, categoryId: "djklf"});

//     const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
//     const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);
//     // const [selectedLaminateBrand, setSelectedLaminateBrand] = useState<string | null>(null);
//     const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
//     const [selectedInnerBrand, setSelectedInnerBrand] = useState<string | null>(null);
//     const [selectedOuterBrand, setSelectedOuterBrand] = useState<string | null>(null);

//     const [globalTransportation, setGlobalTransportation] = useState<number>(0);
//     const [globalProfitPercent, setGlobalProfitPercent] = useState<number>(0);

//     useEffect(() => {
//         if (quote) {
//             setGlobalTransportation(quote?.globalTransportation || 0);
//             setGlobalProfitPercent(quote?.globalProfitPercent || 0);
//             setCommonProfitOverride(quote?.commonProfitOverride || 0)

//         }
//     }, [quote]);


//     // 3. Common Materials State
//     const [commonMaterials, setCommonMaterials] = useState<SimpleItemRow[]>([]);

//     const [commonProfitOverride, setCommonProfitOverride] = useState<number>(0);

//     // Initialize Common Materials from Quote data
//     useEffect(() => {
//         if (quote?.commonMaterials) {
//             setCommonMaterials(quote.commonMaterials);
//         }
//     }, [quote]);


//     const { role, permission } = useAuthCheck();
//     const canCreate = role === "owner" || permission?.quotevariant?.create;
//     const canEdit = role === "owner" || permission?.quotevariant?.edit;

//     // Helper to transform brand data (Reuse this logic for all 3 brand types)
//     const transformBrandData = (brands: any[]) => {
//         if (!brands) return {};
//         const brandMap: Record<string, { thickness: string; rs: number }[]> = {};
//         brands.forEach((item: any) => {
//             const d = item?.data || {};
//             const name = (d.Brand ?? d.brand)?.trim();
//             const thickness = String(d["thickness (mm)"] || d.thickness || d.Thickness)?.trim();
//             const rs = parseFloat(d.Rs || d.rs || d.rS);
//             if (name && thickness && rs) {
//                 if (!brandMap[name]) brandMap[name] = [];
//                 brandMap[name].push({ thickness, rs });
//             }
//         });
//         return brandMap;
//     };

//     const plywoodRatesByName = useMemo(() => transformBrandData(materialBrands), [materialBrands]);
//     const innerRatesByName = useMemo(() => transformBrandData(innerLaminateBrands), [innerLaminateBrands]);
//     const outerRatesByName = useMemo(() => transformBrandData(outerLaminateBrands), [outerLaminateBrands]);

//     const plywoodOptions = useMemo(() => Object.keys(plywoodRatesByName), [plywoodRatesByName]);
//     const innerOptions = useMemo(() => Object.keys(innerRatesByName), [innerRatesByName]);
//     const outerOptions = useMemo(() => Object.keys(outerRatesByName), [outerRatesByName]);


//     // Extract all unique brand names from materialBrands data
//     const brandRatesByName: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
//         if (!materialBrands) return {};

//         const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

//         materialBrands.forEach((item: any) => {
//             const data = item?.data || {};
//             const brandRaw = data.Brand ?? data.brand;
//             const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
//             let rsRaw = data.Rs || data.rs;
//             if (
//                 brandRaw &&
//                 thicknessRaw &&
//                 // (typeof rsRaw === "number" || (typeof rsRaw === "string" && !isNaN(Number(rsRaw))))
//                 rsRaw
//             ) {
//                 const brand = String(brandRaw).trim();
//                 const thickness = String(thicknessRaw).trim();
//                 const rs = parseFloat(rsRaw);

//                 if (!brandMap[brand]) brandMap[brand] = [];

//                 brandMap[brand].push({
//                     thickness,
//                     rs,
//                 });
//             }
//         });

//         return brandMap;
//     }, [materialBrands]);

//     // Get clean unique brand names from this mapping
//     const brandOptions = useMemo(() => Object.keys(brandRatesByName), [brandRatesByName]);


//     // START OF LAMINATION
//     // const laminateRatesByBrand: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
//     //     if (!laminateBrands) return {};
//     //     const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

//     //     laminateBrands.forEach((item: any) => {
//     //         const data = item?.data || {};
//     //         const brandRaw = data.Brand ?? data.brand;
//     //         const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
//     //         const rsRaw = data.Rs || data.rs;
//     //         if (brandRaw && thicknessRaw && rsRaw) {
//     //             const brand = String(brandRaw).trim();
//     //             const thickness = String(thicknessRaw).trim();
//     //             const rs = parseFloat(rsRaw);
//     //             if (!brandMap[brand]) brandMap[brand] = [];
//     //             brandMap[brand].push({ thickness, rs });
//     //         }
//     //     });

//     //     return brandMap;
//     // }, [laminateBrands]);

//     // ✅ Brand dropdown options
//     // const laminateBrandOptions = useMemo(() => Object.keys(laminateRatesByBrand), [laminateRatesByBrand]);
//     const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
//     const [grandTotal, setGrandTotal] = useState(0);
//     const [rawCostWithoutProfit, setRawCostWithoutProfit] = useState(0);

//     const handleProductProfitOverride = (index: number, newProfit: number) => {
//         // setFurnitures(prev => {
//         //     const updated = [...prev];
//         //     updated[index] = {
//         //         ...updated[index],
//         //         furnitureProfit: newProfit
//         //     };
//         //     return updated;
//         // });
//         // setTimeout(() => updateGrandTotal(), 0);


//         setFurnitures(prev => {
//             const updated = [...prev];
//             const targetFurniture = updated[index];

//             // ✅ RESET LOGIC: When this product's profit changes, 
//             // wipe all individual row margins for this product only.
//             updated[index] = {
//                 ...targetFurniture,
//                 furnitureProfit: newProfit,
//                 coreMaterials: targetFurniture.coreMaterials.map(r => ({
//                     ...r,
//                     profitOnMaterial: 0,
//                     profitOnLabour: 0
//                 })),
//                 fittingsAndAccessories: targetFurniture.fittingsAndAccessories.map(i => ({
//                     ...i,
//                     profitOnMaterial: 0
//                 })),
//                 nonBrandMaterials: targetFurniture.nonBrandMaterials.map(i => ({
//                     ...i,
//                     profitOnMaterial: 0
//                 }))
//             };
//             return updated;
//         });

//         // Triggers the internal math of the child ref and updates Grand Total
//         setTimeout(() => updateGrandTotal(), 0);
//     };




//     const updateGrandTotal = () => {
//         const updatedFurnitures = furnitureRefs.current
//             .map(ref => ref.current)
//             .filter((ref): ref is FurnitureQuoteRef => ref !== null)
//             .map(ref => ref.getUpdatedFurniture());

//         // console.log("updatedFurnitures", updatedFurnitures)

//         // const total = updatedFurnitures.reduce(
//         //     (sum, f) => sum + f.totals.furnitureTotal,
//         //     0
//         // );

//         // console.log("total", total)

//         // Sum of all furniture product totals
//         const furnitureTotalSum = updatedFurnitures.reduce(
//             (sum, f) => sum + f.totals.furnitureTotal,
//             0
//         );

//         // Sum of all common material totals (which include global profit/transport)
//         const commonTotalSum = commonMaterials.reduce(
//             (sum, item) => sum + (item.rowTotal || 0),
//             0
//         );

//         // const finalTotal = furnitureTotalSum + commonTotalSum;
//         const updatedGrandTotal = Math.round(furnitureTotalSum + commonTotalSum);

//         setGrandTotal(updatedGrandTotal);
//         setRawCostWithoutProfit(calculateCostWithoutProfit()); // 👈 Add this line
//     };

//     const handleLabourCategory = (selectedId: string | null) => {
//         const selectedCategory = allLabourCategoryOptions.find((s: any) => s.value === selectedId);

//         if (selectedCategory) {
//             setSelectedLabourCategory({
//                 categoryId: selectedCategory.value, // This is the _id
//                 categoryName: selectedCategory.label // This is the name
//             });
//         } else {
//             setSelectedLabourCategory({ categoryId: "", categoryName: "" });
//         }
//     };



//     const { profitDifference, profitPercentage } = useMemo(() => {
//         const diff = grandTotal - rawCostWithoutProfit;
//         const percent = rawCostWithoutProfit > 0 ? (diff / rawCostWithoutProfit) * 100 : 0;

//         return {
//             profitDifference: Math.round(diff),
//             profitPercentage: percent,
//         };
//     }, [grandTotal, rawCostWithoutProfit]);


//     const calculateCostWithoutProfit = () => {
//         const updatedFurnitures = furnitureRefs.current
//             .map(ref => ref.current)
//             .filter((ref): ref is FurnitureQuoteRef => ref !== null)
//             .map(ref => ref.getUpdatedFurniture());

//         const SHEET_SQFT = 32;
//         let totalRawCost = 0;

//         updatedFurnitures.forEach(furniture => {
//             // A. Brand Rates Mapping
//             const plyRates = furniture.plywoodBrand ? (brandRatesByName[furniture.plywoodBrand] || []) : [];
//             const innerRates = furniture.innerLaminateBrand ? (innerRatesByName[furniture.innerLaminateBrand] || []) : [];
//             const outerRates = furniture.outerLaminateBrand ? (outerRatesByName[furniture.outerLaminateBrand] || []) : [];

//             // B. Labour Base
//             const coreRows = furniture.coreMaterials;
//             const base = coreRows[0];
//             const totalLabourCost = (base?.carpenters || 0) * (base?.days || 0) * labourCost;
//             const labourPerRow = coreRows.length > 0 ? totalLabourCost / coreRows.length : 0;

//             // C. Fabrication Base
//             const fabPerRow = coreRows.length > 0 ? (furniture.fabricationCost || 0) / coreRows.length : 0;

//             coreRows.forEach(row => {
//                 const plyRate = getRateForThickness(row.plywoodNos.thickness, plyRates, "plywood");
//                 const innerRate = getRateForThickness(row.innerLaminate?.thickness || 0, innerRates, "laminate");
//                 const outerRate = getRateForThickness(row.outerLaminate?.thickness || 0, outerRates, "laminate");

//                 const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
//                 const innerCost = (row.innerLaminate?.quantity || 0) * (innerRate * SHEET_SQFT);
//                 const outerCost = (row.outerLaminate?.quantity || 0) * (outerRate * SHEET_SQFT);

//                 // Raw Cost = Material + Labour + Fabrication (NO profit multiplier)
//                 totalRawCost += plyCost + innerCost + outerCost + labourPerRow + fabPerRow;
//             });

//             // D. Fittings, Glues, NBMs (Base cost only)
//             const getSimpleRowBase = (row: any) => (row.quantity || 0) * (row.cost || 0);
//             totalRawCost += furniture.fittingsAndAccessories.reduce((sum, r) => sum + getSimpleRowBase(r), 0);
//             totalRawCost += furniture.glues.reduce((sum, r) => sum + (r.cost || 0), 0);
//             totalRawCost += furniture.nonBrandMaterials.reduce((sum, r) => sum + getSimpleRowBase(r), 0);
//         });

//         // E. Add Common Materials Base Cost
//         totalRawCost += commonMaterials.reduce((sum, item) => sum + ((item.quantity || 0) * (item.cost || 0)), 0);

//         return Math.round(totalRawCost);
//     };


//     // 2. Handler for common materials profit updates
//     const handleCommonMaterialProfitChange = (i: number, newProfit: number) => {
//         // setCommonMaterials(prev => {
//         //     const updated = [...prev];
//         //     updated[i] = { ...updated[i], profitOnMaterial: newProfit };
//         //     return updated;
//         // });



//         // 1. Get the current transport split (needed for the row total)
//         const furnitureRowsCount = furnitures.reduce((acc, f) => {
//             return acc + f.coreMaterials.length + f.fittingsAndAccessories.length + f.glues.length + f.nonBrandMaterials.length;
//         }, 0);
//         const totalRowsCount = furnitureRowsCount + commonMaterials.length;
//         const transportPerRow = totalRowsCount > 0 ? globalTransportation / totalRowsCount : 0;

//         // 2. Determine which overlay/global profit to use as fallback
//         const effectiveCommonProfit = commonProfitOverride ?? globalProfitPercent;
//         const commonMultiplier = 1 + (effectiveCommonProfit / 100);

//         setCommonMaterials(prev => {
//             const updated = [...prev];
//             const item = updated[i];

//             // 3. Calculate the row's base cost
//             const base = (item.quantity || 0) * (item.cost || 0);

//             // 4. Determine which profit multiplier to use
//             // If the newProfit > 0, use it. Else use the Common/Global fallback.
//             const rowProfitMultiplier = newProfit > 0
//                 ? 1 + (newProfit / 100)
//                 : commonMultiplier;

//             // 5. Update the item with BOTH the new profit AND the new rowTotal
//             updated[i] = {
//                 ...item,
//                 profitOnMaterial: newProfit,
//                 rowTotal: Math.round((base * rowProfitMultiplier) + transportPerRow)
//             };

//             return updated;
//         });

//         // 6. Tell the grand total to update since the sum changed
//         setTimeout(() => updateGrandTotal(), 0);
//     };


//     const rendercommonMaterialsTable = () => (
//         <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
//             <table className="min-w-full text-sm bg-white">
//                 <thead className="bg-blue-50 text-blue-800 font-bold uppercase text-[11px]">
//                     <tr>
//                         {/* <th className="px-6 py-3 border-r border-blue-100">Item Name</th>
//                         <th className="px-6 py-3 border-r border-blue-100">Description</th>
//                         <th className="px-6 py-3 border-r border-blue-100">Quantity</th>
//                         <th className="px-6 py-3 border-r border-blue-100">Cost</th>
//                         <th className="px-6 py-3 border-r border-blue-100 text-blue-600">Profit % (Edit)</th>
//                         <th className="px-6 py-3">Total (incl. Global)</th> */}
//                         <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
//                         <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
//                         <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
//                         <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
//                         <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit %</th>
//                         <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {commonMaterials.map((row, i) => (
//                         <tr key={i} className="border-t border-gray-100 hover:bg-blue-50/20 transition-colors">
//                             {/* READ ONLY FIELDS */}
//                             <td className="p-3 border-r border-gray-100 text-center font-medium text-gray-700">
//                                 {row.itemName || "—"}
//                             </td>
//                             <td className="p-3 border-r border-gray-100 text-center text-gray-500">
//                                 {row.description || "—"}
//                             </td>
//                             <td className="p-3 border-r border-gray-100 text-center  text-gray-500">
//                                 {row.quantity}
//                             </td>
//                             <td className="p-3 border-r border-gray-100 text-center  text-gray-500">
//                                 ₹{row.cost?.toLocaleString("en-IN")}
//                             </td>

//                             {/* EDITABLE PROFIT FIELD */}
//                             <td className="p-3 border-r border-gray-100 text-center ">
//                                 <input
//                                     type="number"
//                                     value={row.profitOnMaterial || 0}
//                                     // onChange={(e) => handleCommonMaterialProfitChange(i, parseFloat(e.target.value) || 0)}
//                                     onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
//                                     onChange={(e) => {
//                                         const val = Math.max(0, parseFloat(e.target.value) || 0);
//                                         handleCommonMaterialProfitChange(i, val);
//                                     }}
//                                     className="w-16 text-center border border-blue-200 rounded py-1 font-semibold  outline-none focus:ring-1 focus:ring-blue-400"
//                                 />
//                             </td>

//                             {/* CALC TOTAL */}
//                             <td className="p-3 text-center font-black text-green-700 bg-green-50/20">
//                                 ₹{row.rowTotal?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );

//     // Inside QuoteGenerateVariantSub.tsx component body

//     useEffect(() => {

//         console.log("is it getting called here ")
//         if (!furnitures.length) return;

//         // A. Calculate Total Row Count across ALL products AND Common Materials
//         const furnitureRowsCount = furnitures.reduce((acc, f) => {
//             return acc + f.coreMaterials.length + f.fittingsAndAccessories.length + f.glues.length + f.nonBrandMaterials.length;
//         }, 0);
//         const totalRowsCount = furnitureRowsCount + commonMaterials.length;

//         // B. Calculate split transportation
//         const transportPerRow = totalRowsCount > 0 ? globalTransportation / totalRowsCount : 0;

//         // 1. Calculate the new Furnitures Array
//         const nextFurnitures = furnitures.map((f) => {
//             if (f.coreMaterials.length === 0) return f;
//             // PRIORITY LOGIC: Update product's local state if Global is changed

//             // const effectiveProfit = globalProfitPercent > 0 ? globalProfitPercent : (f.furnitureProfit || 0);

//             const effectiveProfit = (globalProfitPercent !== null && globalProfitPercent !== undefined)
//                 ? globalProfitPercent
//                 : (f.furnitureProfit ?? 0); // ✅ Use ?? here too


//             return { ...f, furnitureProfit: effectiveProfit };
//         });



//         // 2. Calculate the new Common Materials Array
//         // Use the specific override for common materials
//         const effectiveCommonProfit = commonProfitOverride ?? globalProfitPercent;
//         const commonMultiplier = 1 + (effectiveCommonProfit / 100);


//         // 2. Calculate the new Common Materials Array
//         const nextCommon = commonMaterials.map(item => {
//             const base = (item.quantity || 0) * (item.cost || 0);
//             // ✅ PRIORITY CHECK: If row has local profit, use it. Otherwise use the Overlay.
//             const rowTotal = (item.profitOnMaterial || 0) > 0
//                 ? base * (1 + ((item.profitOnMaterial || 0) / 100))
//                 : base * commonMultiplier;
//             // const localProfit = 1 + ((item.profitOnMaterial || 0) / 100);
//             // const globalMultiplier = 1 + (globalProfitPercent / 100);
//             return {
//                 ...item,
//                 // rowTotal: (base * localProfit * commonMultiplier) + transportPerRow
//                 rowTotal: rowTotal + transportPerRow
//             };
//         });

//         // 3. Update the States
//         setFurnitures(nextFurnitures);
//         setCommonMaterials(nextCommon);

//         // ✅ FIX: Calculate Grand Total using the data we JUST created (nextFurnitures/nextCommon)
//         // instead of waiting for Refs to update.
//         // const furnitureSum = nextFurnitures.reduce((sum, f) => sum + (f.totals?.furnitureTotal || 0), 0);
//         // const commonSum = nextCommon.reduce((sum, item) => sum + (item.rowTotal || 0), 0);

//         // setGrandTotal(furnitureSum + commonSum);

//         setTimeout(() => updateGrandTotal(), 0);

//     }, [globalTransportation, globalProfitPercent, labourCost, commonMaterials.length, commonProfitOverride,]);



//     const handleGenerateQuote = async () => {
//         try {
//             if (!organizationId || !quoteId || !quote || !selectedBrand) {
//                 toast({
//                     title: "Missing info",
//                     description: "Please ensure brand and all details are selected",
//                     variant: "destructive",
//                 });
//                 return;
//             }


//             const updatedFurnitures = furnitureRefs.current
//                 .map(ref => ref.current)
//                 .filter((ref): ref is FurnitureQuoteRef => ref !== null)
//                 .map(ref => ref.getUpdatedFurniture());

//             // const updatedGrandTotal = updatedFurnitures.reduce(
//             //     (sum, f) => sum + f.totals.furnitureTotal,
//             //     0
//             // );


//             // Sum of all furniture product totals
//             const furnitureTotalSum = updatedFurnitures.reduce(
//                 (sum, f) => sum + f.totals.furnitureTotal,
//                 0
//             );


//             // 2. Map common materials and round their individual row totals
//             const roundedCommonMaterials = commonMaterials.map(item => ({
//                 ...item,
//                 rowTotal: Math.round(item.rowTotal || 0)
//             }));


//             // 3. Calculate sum of rounded common materials
//             const commonTotalSum = roundedCommonMaterials.reduce(
//                 (sum, item) => sum + item.rowTotal,
//                 0
//             );

//             // // Sum of all common material totals (which include global profit/transport)
//             // const commonTotalSum = commonMaterials.reduce(
//             //     (sum, item) => sum + (item.rowTotal || 0),
//             //     0
//             // );

//             // const updatedGrandTotal = furnitureTotalSum + commonTotalSum || 0;
//             const updatedGrandTotal = Math.round(furnitureTotalSum + commonTotalSum) || 0;


//             // console.log("fff updatedFurnitures", updatedFurnitures)
//             // const updatedFurnitures = getUpdatedFurnitureWithTotals();
//             // console.log("✅ Submitting Furnitures for Quote", updatedFurnitures);
//             // const updatedGrandTotal = updatedFurnitures.reduce((sum, f: any) => sum + f.furnitureTotal, 0);

//             await generateQuote({
//                 quoteId: quoteId!,
//                 organizationId: organizationId,
//                 data: {
//                     quoteId, // Required for readable reference
//                     organizationId,
//                     projectId: quote.projectId,
//                     brandName: selectedBrand,
//                     // laminateBrand: selectedLaminateBrand, // ✅ Add this line (optional)
//                     // innerLaminateBrand: selectedInnerBrand,
//                     // outerLaminateBrand: selectedOuterBrand,

//                     mainQuoteName: quote.mainQuoteName,
//                     quoteType: quote.quoteType,
//                     // 🆕 ADD THESE: Match your Controller destructuring
//                     innerLaminateBrand: selectedInnerBrand,
//                     outerLaminateBrand: selectedOuterBrand,

//                     commonMaterials: roundedCommonMaterials,
//                     globalTransportation: globalTransportation,
//                     globalProfitPercent: globalProfitPercent,


//                     furnitures: updatedFurnitures,
//                     grandTotal: updatedGrandTotal,
//                     // grandTotal: calculatedVariantGrandTotal,
//                     notes: "Generated with brand variant",
//                 }
//             })
//             // console.log("reso", res)
//             // await downloadImage({ src: res.url, alt: res.fileName })
//             toast({ title: "success", description: "Successfully created, check it in the Quote for clients section" })
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Operation failed",
//                 variant: "destructive"
//             });
//         }
//     }

//     useEffect(() => {
//         if (!quote?.furnitures) return;

//         const transformed: FurnitureBlock[] = quote.furnitures.map((f: any) => ({
//             furnitureName: f.furnitureName,
//             coreMaterials: f.coreMaterials || [],
//             fittingsAndAccessories: f.fittingsAndAccessories || [],
//             glues: f.glues || [],
//             nonBrandMaterials: f.nonBrandMaterials || [],
//             totals: {
//                 core: f.coreMaterialsTotal || 0,
//                 fittings: f.fittingsAndAccessoriesTotal || 0,
//                 glues: f.gluesTotal || 0,
//                 nbms: f.nonBrandMaterialsTotal || 0,
//                 furnitureTotal: f.furnitureTotal || 0,
//             },
//             plywoodBrand: selectedBrand,
//             // laminateBrand: selectedLaminateBrand,
//             innerLaminateBrand: selectedInnerBrand,
//             outerLaminateBrand: selectedOuterBrand
//         }));

//         setFurnitures(transformed);
//     }, [quote]);


//     if (furnitureRefs.current.length !== furnitures.length) {
//         furnitureRefs.current = furnitures.map(
//             (_, i) => furnitureRefs.current[i] ?? React.createRef<FurnitureQuoteRef>()
//         );
//     }

//     useEffect(() => {
//         furnitureRefs.current = furnitures.map(
//             (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
//         );
//     }, [furnitures]);


//     useEffect(() => {
//         if (!selectedBrand && brandOptions?.length > 0) {
//             setSelectedBrand(brandOptions[0]);
//         }
//     }, [brandOptions]);



//     // nnn
//     useEffect(() => {
//         if (selectedLabourCategory.categoryId === "" && allLabourCategoryOptions?.length > 0) {
//             setSelectedLabourCategory({
//                 categoryId: allLabourCategoryOptions[0]?.value,
//                 categoryName: allLabourCategoryOptions[0]?.label
//             });
//         }
//     }, [allLabourCategoryOptions]);



//     // // START OF LAMINATE
//     // useEffect(() => {
//     //     if (!selectedLaminateBrand && laminateBrandOptions?.length > 0) {
//     //         setSelectedLaminateBrand(laminateBrandOptions[0]);
//     //     }
//     // }, [laminateBrandOptions]);



//     //     // Before rendering children, ensure refs are created for each furniture
//     // if (furnitureRefs?.current?.length !== furnitures.length) {
//     //   furnitureRefs.current = furnitures.map(
//     //     (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
//     //   );
//     // }

//     // END OF LAMINATE 

//     return (
//         <div className="p-2 max-h-full overflow-y-auto">

//             <header className="bg-white border-b border-gray-200 pb-4 space-y-3">
//                 {/* Top Row - Project Info, Financial Summary, and Generate Button */}
//                 <div className="flex items-center justify-between gap-4">
//                     {/* Left - Project Info */}
//                     <div className="flex items-center gap-3 min-w-0">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors flex-shrink-0"
//                         >
//                             <i className="fas fa-arrow-left text-gray-600 text-sm"></i>
//                         </button>
//                         <div className="min-w-0">
//                             <h1 className="text-lg font-semibold text-gray-900 truncate">
//                                 {quote?.projectId?.projectName || "Project"}
//                             </h1>
//                             <p className="text-md text-gray-500">{quote?.quoteNo ? `Quote: #${quote?.quoteNo}` : ""}</p>
//                         </div>
//                     </div>

//                     {/* Right - Generate Button */}
//                     {(canCreate || canEdit) && <Button onClick={handleGenerateQuote} disabled={quotePending} className="flex-shrink-0">
//                         {quotePending ? "Generating..." : "Generate Quote for Client"}
//                     </Button>}
//                 </div>

//                 {/* Bottom Row - Brand Selection */}
//                 {/* <div className="flex items-center gap-4">


//                     <div className="flex-1">
//                         <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Laminate Brand:</label>
//                         <SearchSelect
//                             options={laminateBrandOptions}
//                             placeholder="Select Laminate Brand"
//                             searchPlaceholder="Search brands..."
//                             onSelect={setSelectedLaminateBrand}
//                             selectedValue={selectedLaminateBrand || ""}
//                             className="flex-1"
//                         />
//                     </div>
//                 </div> */}


//                 {/* Bottom Row - Three Way Brand Selection */}
//                 <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
//                     <div className="flex-1 min-w-[200px]">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase">Plywood Brand</label>
//                         <SearchSelect
//                             options={brandOptions}
//                             placeholder="Select Plywood"
//                             onSelect={setSelectedBrand}
//                             selectedValue={selectedBrand || ""}
//                         />
//                     </div>

//                     <div className="flex-1 min-w-[200px]">
//                         <label className="text-[10px] font-bold text-blue-600 uppercase">Inner Laminate</label>
//                         <SearchSelect
//                             options={innerOptions}
//                             placeholder="Select Inner Brand"
//                             onSelect={setSelectedInnerBrand} // ✅ Used here
//                             selectedValue={selectedInnerBrand || ""}
//                         />
//                     </div>

//                     <div className="flex-1 min-w-[200px]">
//                         <label className="text-[10px] font-bold text-orange-600 uppercase">Outer Laminate</label>
//                         <SearchSelect
//                             options={outerOptions}
//                             placeholder="Select Outer Brand"
//                             onSelect={setSelectedOuterBrand} // ✅ Used here
//                             selectedValue={selectedOuterBrand || ""}
//                         />
//                     </div>



//                     <div className="flex-1">
//                         <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
//                             Select Salary Category
//                         </label>
//                         <SearchSelectNew
//                             options={allLabourCategoryOptions}
//                             placeholder="Choose Labour Category"
//                             searchPlaceholder="Search by name..."
//                             value={selectedLabourCategory.categoryId}
//                             onValueChange={handleLabourCategory}
//                             // disabled={isReadOnly}
//                             searchBy="name"
//                             displayFormat="detailed"
//                             className="flex-1"
//                         />
//                     </div>



//                 </div>



//                 {/* Mobile Financial Summary - Only visible on smaller screens */}
//                 <div className=" grid grid-cols-4 gap-2">
//                     <Card className="px-2 py-4 border-l-4 border-blue-600">
//                         <div className="text-center">
//                             {/* <p className="text-xs text-gray-600">Cost</p> */}
//                             <p className="text-md text-gray-600">Project Cost {" "} <span className="font-bold">(without profit)</span></p>

//                             <p className="text-md font-bold text-blue-600">₹{rawCostWithoutProfit.toLocaleString("en-IN")}</p>
//                         </div>
//                     </Card>

//                     <Card className="px-2 py-4 border-l-4 border-green-600">
//                         <div className="text-center">
//                             {/* <p className="text-xs text-gray-600">Quote</p> */}
//                             <p className="text-md text-gray-600">Client Quote Amount {" "} <span className="font-bold">(with profit)</span></p>
//                             <p className="text-md font-bold text-green-600">₹{grandTotal.toLocaleString("en-IN")}</p>
//                         </div>
//                     </Card>

//                     <Card className="px-2 py-4 border-l-4 border-violet-600">
//                         <div className="text-center">
//                             <p className="text-md text-gray-600">Profit Amount</p>
//                             <p className="text-md font-bold text-violet-600">₹{profitDifference.toLocaleString("en-IN")}
//                                 {" "}
//                                 <span className="text-black !text-[12px] ml-[5px] font-semibold">
//                                     ({profitPercentage.toFixed(2)}%)
//                                 </span>
//                             </p>


//                         </div>
//                     </Card>

//                     <Card className="px-2 py-4 border-l-4 border-orange-600">
//                         <div className="text-center">
//                             <p className="text-md text-gray-600">Single Labour Cost</p>
//                             <p className="text-md font-bold text-orange-600">₹{labourCost}

//                             </p>


//                         </div>
//                     </Card>
//                 </div>
//             </header >

//             {quoteLoading || loadingBrands ? (
//                 <MaterialOverviewLoading />
//             ) : (
//                 <>
//                     <div className="space-y-6">
//                         {furnitures.map((furniture, index) => (
//                             <FurnitureQuoteVariantForm
//                                 key={index}
//                                 index={index}
//                                 data={furniture}
//                                 labourCost={labourCost}
//                                 ref={furnitureRefs.current[index] as React.RefObject<FurnitureQuoteRef>} // 🔄 Pass the ref down

//                                 // Brand Data & Selection
//                                 brandRatesByName={plywoodRatesByName}
//                                 innerLaminateRatesByBrand={innerRatesByName}
//                                 outerLaminateRatesByBrand={outerRatesByName}

//                                 selectedBrand={selectedBrand}
//                                 selectedInnerBrand={selectedInnerBrand}
//                                 selectedOuterBrand={selectedOuterBrand}

//                                 brandOptions={plywoodOptions}
//                                 innerOptions={innerOptions}
//                                 outerOptions={outerOptions}

//                                 // Pass Global Overhead Info (For Read-Only reference/calculations)
//                                 globalTransportation={globalTransportation}
//                                 globalProfitPercent={globalProfitPercent}

//                                 onFurnitureChange={updateGrandTotal}

//                                 onProfitOverride={(val: number) => handleProductProfitOverride(index, val)} // 🆕 New Prop
//                             />
//                         ))}




//                         {/* 2. COMMON MATERIALS SECTION (VARIANT VIEW) */}
//                         {commonMaterials.length > 0 && (
//                             <div className="mt-10 bg-white border-2 border-dashed border-blue-200 rounded-2xl p-6 shadow-sm">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <div className="flex items-center gap-3">
//                                         <div className="bg-blue-100 p-2 rounded-lg">
//                                             <i className="fas fa-tools text-blue-600 text-xl" />
//                                         </div>
//                                         <div>
//                                             <h2 className="text-xl font-bold text-gray-800">Common Site Materials</h2>
//                                             <p className="text-xs text-gray-500 italic">Quantities are fixed. Only Profit % can be adjusted for variants.</p>
//                                         </div>
//                                     </div>
//                                     {/* <div className="text-right">
//                                         <p className="text-[10px] font-bold text-blue-500 uppercase">Section Total</p>
//                                         <p className="text-2xl font-black text-blue-700">
//                                             ₹{commonMaterials.reduce((s, i) => s + (i.rowTotal || 0), 0).toLocaleString("en-IN")}
//                                         </p>
//                                     </div> */}

//                                     <div className="text-right flex items-center gap-4">
//                                         {/* NEW: Common Profit Override Input */}
//                                         <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
//                                             <label className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
//                                                 Common Profit Overlay
//                                             </label>
//                                             <div className="flex items-center">
//                                                 <input
//                                                     type="number"
//                                                     className="w-12 text-right font-black bg-transparent outline-none text-blue-800"
//                                                     value={commonProfitOverride ?? globalProfitPercent}
//                                                     placeholder="0"
//                                                     onChange={(e) => {
//                                                         const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
//                                                         setCommonProfitOverride(val);

//                                                         // ✅ RESET SECTION: Wipe individual row profits only for Common Materials
//                                                         setCommonMaterials(prev => prev.map(item => ({
//                                                             ...item,
//                                                             profitOnMaterial: 0
//                                                         })));
//                                                     }}
//                                                 />
//                                                 <span className="text-blue-600 font-black ml-1 text-sm">%</span>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <p className="text-[10px] font-bold text-blue-500 uppercase">Section Total</p>
//                                             <p className="text-2xl font-black text-blue-700">
//                                                 ₹{commonMaterials.reduce((s, i) => s + (i.rowTotal || 0), 0).toLocaleString("en-IN")}
//                                             </p>
//                                         </div>
//                                     </div>

//                                 </div>

//                                 {rendercommonMaterialsTable()}
//                             </div>
//                         )}


//                         {/* --- GLOBAL OVERHEAD CONTROLS --- */}
//                         <div className="flex items-center justify-between gap-4 bg-white border border-blue-100 p-4 rounded-xl shadow-sm mt-8">
//                             <div className="flex items-center gap-6">
//                                 {/* READ-ONLY: Global Transport Display */}
//                                 <div className="flex flex-col">
//                                     <label className="text-[10px] font-extrabold text-blue-500 uppercase tracking-tighter">
//                                         Global Transport Cost
//                                     </label>
//                                     <div className="flex items-center">
//                                         <span className="text-gray-400 mr-1 text-sm font-bold">₹</span>
//                                         <span className="font-bold text-gray-800">
//                                             {globalTransportation.toLocaleString("en-IN")}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="h-10 w-px bg-gray-100" />

//                                 {/* EDITABLE: Global Profit Margin Input */}
//                                 <div className="flex flex-col">
//                                     <label className="text-[10px] font-extrabold text-green-500 uppercase tracking-tighter">
//                                         Global Profit Margin (%)
//                                     </label>
//                                     <div className="flex items-center">
//                                         <input
//                                             type="number"
//                                             className="w-16 text-right font-black focus:outline-none text-green-700 bg-green-50 rounded px-2 py-1 border border-green-100"
//                                             value={globalProfitPercent}
//                                             onChange={(e) => {
//                                                 const val = parseFloat(e.target.value) || 0;
//                                                 setGlobalProfitPercent(val);
//                                                 setCommonProfitOverride(val);

//                                                 // ✅ MASTER RESET: Clear all product overrides AND all row-level margins
//                                                 setFurnitures(prev => prev.map(f => ({
//                                                     ...f,
//                                                     furnitureProfit: val, // Sync product level
//                                                     coreMaterials: f.coreMaterials.map(r => ({ ...r, profitOnMaterial: 0, profitOnLabour: 0 })),
//                                                     fittingsAndAccessories: f.fittingsAndAccessories.map(i => ({ ...i, profitOnMaterial: 0 })),
//                                                     glues: f.glues.map(i => ({ ...i, profitOnMaterial: 0 })),
//                                                     nonBrandMaterials: f.nonBrandMaterials.map(i => ({ ...i, profitOnMaterial: 0 }))
//                                                 })));

//                                                 // ✅ RESET COMMON: Wipe individual row profits for common materials
//                                                 setCommonMaterials(prev => prev.map(item => ({ ...item, profitOnMaterial: 0 })));
//                                                 // The useEffect brain will automatically push this 'val' 
//                                                 // into every furniture[index].furnitureProfit
//                                             }}
//                                         />
//                                         <span className="text-green-500 ml-1 font-bold text-sm">%</span>
//                                     </div>
//                                     <p className="text-[9px] text-gray-400 italic">Overrides all product margins</p>
//                                 </div>
//                             </div>

//                             {/* Buttons for Saving/Generating stays here if needed */}
//                         </div>




//                         <section className="mt-10 text-right">
//                             <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
//                                 <p className="text-md font-medium text-gray-700 mb-1">
//                                     Total Estimate
//                                 </p>

//                                 <p className="text-2xl font-bold text-green-700">
//                                     ₹{grandTotal.toLocaleString("en-IN")}
//                                 </p>
//                             </div>
//                         </section>

//                     </div>
//                 </>
//             )}
//         </div >
//     );
// };

// export default QuoteGenerateVariantSub;





//  new wit lst save opiton enbabled 


import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  useGenerateQuotePdf, useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import FurnitureQuoteVariantForm, { getRateForThickness, type FurnitureQuoteRef } from "./FurnitureQuoteVariantForm";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
// import { downloadImage } from "../../../utils/downloadFile";
import { Card } from "../../../components/ui/Card";
import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from "../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
// import { Label } from "../../../components/ui/Label";
import SearchSelectNew from "../../../components/ui/SearchSelectNew";

export const DEFAULT_LAMINATE_RATE_PER_SQFT = 0;

const QuoteGenerateVariantSub = () => {
    const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>();
    const navigate = useNavigate()

    const { data: quote, isLoading: quoteLoading } = useGetMaterialQuoteSingleEntry(organizationId!, quoteId!);
    let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
    // let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
    let { data: innerLaminateBrands } = useGetMaterialBrands(organizationId!, "inner laminate"); // 🆕
    let { data: outerLaminateBrands } = useGetMaterialBrands(organizationId!, "outer laminate"); // 🆕

    // console.log("materialBrands", materialBrands)
    // console.log("innerLaminateBrands", innerLaminateBrands)
    // console.log("outerLaminateBrands", outerLaminateBrands)

    const [selectedLabourCategory, setSelectedLabourCategory] = useState({
        categoryId: "",
        categoryName: ""
    });

    let { data: labourCost = 0 } = useGetSingleLabourCost({ organizationId: organizationId!, categoryId: selectedLabourCategory.categoryId });

    let { data: allLabourCategory = [] } = useGetLabourRateConfigCategories(organizationId!);

    const allLabourCategoryOptions = (allLabourCategory || []).map((labour: any) => ({
        value: labour._id,
        label: labour.name,
    }))



    // let { data: labourCost = 0 } = useGetSingleLabourCost({organizationId:organizationId!, categoryId: "djklf"});

    const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
    const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);
    // const [selectedLaminateBrand, setSelectedLaminateBrand] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedInnerBrand, setSelectedInnerBrand] = useState<string | null>(null);
    const [selectedOuterBrand, setSelectedOuterBrand] = useState<string | null>(null);

    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [selectedInnerBrandId, setSelectedInnerBrandId] = useState<string | null>(null);
    const [selectedOuterBrandId, setSelectedOuterBrandId] = useState<string | null>(null);

    const [globalTransportation, setGlobalTransportation] = useState<number>(0);
    const [globalProfitPercent, setGlobalProfitPercent] = useState<number>(0);


    // const handlePlywoodSelect = (val: string) => {
    //     // val will be the ID because we set it as the 'value' in the options above
    //     const selectedObj = plywoodOptions.find(opt => opt.value === val || opt.label === val);

    //     if (selectedObj) {
    //         setSelectedBrand(selectedObj.label); // Stores "Century" (String)
    //         setSelectedBrandId(selectedObj.value); // Stores "697a..." (Object ID)
    //     } else {
    //         setSelectedBrand(val);
    //         setSelectedBrandId(null);
    //     }
    // };



    // 3. Common Materials State
    const [commonMaterials, setCommonMaterials] = useState<SimpleItemRow[]>([]);

    const [commonProfitOverride, setCommonProfitOverride] = useState<number>(0);



    // old version
    // useEffect(() => {
    //     if (quote) {
    //         setGlobalTransportation(quote?.globalTransportation || 0);
    //         setGlobalProfitPercent(quote?.globalProfitPercent || 0);
    //         setCommonProfitOverride(quote?.commonProfitOverride || 0)

    //     }
    // }, [quote]);


    // // Initialize Common Materials from Quote data
    // useEffect(() => {
    //     if (quote?.commonMaterials) {
    //         setCommonMaterials(quote.commonMaterials);
    //     }
    // }, [quote]);


    // New version
    // ✅ Unified Hydration: Initialize all quote-related state in one pass
    useEffect(() => {
        if (quote) {
            // Initialize Global Overhead Settings
            setGlobalTransportation(quote.globalTransportation || 0);
            setGlobalProfitPercent(quote.globalProfitPercent || 0);
            setCommonProfitOverride(quote.commonProfitOverride || 0);

            // Initialize Common Materials List
            if (quote.commonMaterials) {
                setCommonMaterials(quote.commonMaterials);
            }
        }
    }, [quote]);


    const { role, permission } = useAuthCheck();
    const canCreate = role === "owner" || permission?.quotevariant?.create;
    const canEdit = role === "owner" || permission?.quotevariant?.edit;

    // Helper to transform brand data (Reuse this logic for all 3 brand types)
    const transformBrandData = (brands: any[]) => {
        if (!brands) return {};
        const brandMap: Record<string, { thickness: string; rs: number, id: string }[]> = {};
        brands.forEach((item: any) => {
            const d = item?.data || {};
            const name = (d.Brand ?? d.brand)?.trim();
            const thickness = String(d["thickness (mm)"] || d.thickness || d.Thickness)?.trim();
            const rs = parseFloat(d.Rs || d.rs || d.rS);

            if (name && thickness && rs) {
                if (!brandMap[name]) brandMap[name] = [];
                brandMap[name].push({
                    thickness, rs,

                    id: item._id // ✅ Store the MongoDB ID here
                });
            }
        });
        return brandMap;
    };

    const plywoodRatesByName = useMemo(() => transformBrandData(materialBrands), [materialBrands]);
    const innerRatesByName = useMemo(() => transformBrandData(innerLaminateBrands), [innerLaminateBrands]);
    const outerRatesByName = useMemo(() => transformBrandData(outerLaminateBrands), [outerLaminateBrands]);

    // const plywoodOptions = useMemo(() => Object.keys(plywoodRatesByName), [plywoodRatesByName]);
    // const innerOptions = useMemo(() => Object.keys(innerRatesByName), [innerRatesByName]);
    // const outerOptions = useMemo(() => Object.keys(outerRatesByName), [outerRatesByName]);
    const plywoodOptions = useMemo(() =>
        Object.keys(plywoodRatesByName).map(brandName => ({
            label: brandName,
            value: plywoodRatesByName[brandName][0]?.id || brandName // ✅ Use the ID as the value
        })), [plywoodRatesByName]);


    const innerOptions = useMemo(() =>
        Object.keys(innerRatesByName).map(brandName => ({
            label: brandName,
            value: innerRatesByName[brandName][0]?.id || brandName // ✅ Use the ID as the value
        })), [innerRatesByName]);

    const outerOptions = useMemo(() =>
        Object.keys(outerRatesByName).map(brandName => ({
            label: brandName,
            value: outerRatesByName[brandName][0]?.id || brandName // ✅ Use the ID as the value
        })), [outerRatesByName]);



    // Extract all unique brand names from materialBrands data
    const brandRatesByName: Record<string, { thickness: string; rs: number, id: string }[]> = useMemo(() => {
        if (!materialBrands) return {};

        const brandMap: Record<string, { thickness: string; rs: number, id: string }[]> = {};

        materialBrands.forEach((item: any) => {
            const data = item?.data || {};
            const brandRaw = data.Brand ?? data.brand;
            const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
            let rsRaw = data.Rs || data.rs;
            if (
                brandRaw &&
                thicknessRaw &&
                rsRaw
            ) {
                const brand = String(brandRaw).trim();
                const thickness = String(thicknessRaw).trim();
                const rs = parseFloat(rsRaw);

                if (!brandMap[brand]) brandMap[brand] = [];

                brandMap[brand].push({
                    thickness,
                    rs,
                    id: item._id //
                });
            }
        });

        return brandMap;
    }, [materialBrands]);

    // Get clean unique brand names from this mapping
    // const brandOptions = useMemo(() => Object.keys(brandRatesByName), [brandRatesByName]);
    const brandOptions = useMemo(() => {
        return Object.keys(brandRatesByName).map(brandName => ({
            label: brandName,
            // We use the ID of the first occurrence of this brand as the value
            value: brandRatesByName[brandName][0]?.id || brandName
        }));
    }, [brandRatesByName]);


    // START OF LAMINATION
    // const laminateRatesByBrand: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
    //     if (!laminateBrands) return {};
    //     const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

    //     laminateBrands.forEach((item: any) => {
    //         const data = item?.data || {};
    //         const brandRaw = data.Brand ?? data.brand;
    //         const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
    //         const rsRaw = data.Rs || data.rs;
    //         if (brandRaw && thicknessRaw && rsRaw) {
    //             const brand = String(brandRaw).trim();
    //             const thickness = String(thicknessRaw).trim();
    //             const rs = parseFloat(rsRaw);
    //             if (!brandMap[brand]) brandMap[brand] = [];
    //             brandMap[brand].push({ thickness, rs });
    //         }
    //     });

    //     return brandMap;
    // }, [laminateBrands]);

    // ✅ Brand dropdown options
    // const laminateBrandOptions = useMemo(() => Object.keys(laminateRatesByBrand), [laminateRatesByBrand]);
    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [rawCostWithoutProfit, setRawCostWithoutProfit] = useState(0);

    const handleProductProfitOverride = (index: number, newProfit: number) => {
        // setFurnitures(prev => {
        //     const updated = [...prev];
        //     updated[index] = {
        //         ...updated[index],
        //         furnitureProfit: newProfit
        //     };
        //     return updated;
        // });
        // setTimeout(() => updateGrandTotal(), 0);


        setFurnitures(prev => {
            const updated = [...prev];
            const targetFurniture = updated[index];

            // ✅ RESET LOGIC: When this product's profit changes, 
            // wipe all individual row margins for this product only.
            updated[index] = {
                ...targetFurniture,
                furnitureProfit: newProfit,
                coreMaterials: targetFurniture.coreMaterials.map(r => ({
                    ...r,
                    profitOnMaterial: 0,
                    profitOnLabour: 0
                })),
                fittingsAndAccessories: targetFurniture.fittingsAndAccessories.map(i => ({
                    ...i,
                    profitOnMaterial: 0
                })),
                nonBrandMaterials: targetFurniture.nonBrandMaterials.map(i => ({
                    ...i,
                    profitOnMaterial: 0
                }))
            };
            return updated;
        });

        // Triggers the internal math of the child ref and updates Grand Total
        setTimeout(() => updateGrandTotal(), 0);
    };




    const updateGrandTotal = () => {
        const updatedFurnitures = furnitureRefs.current
            .map(ref => ref.current)
            .filter((ref): ref is FurnitureQuoteRef => ref !== null)
            .map(ref => ref.getUpdatedFurniture());

        // console.log("updatedFurnitures", updatedFurnitures)

        // const total = updatedFurnitures.reduce(
        //     (sum, f) => sum + f.totals.furnitureTotal,
        //     0
        // );

        // console.log("total", total)

        // Sum of all furniture product totals
        const furnitureTotalSum = updatedFurnitures.reduce(
            (sum, f) => sum + f.totals.furnitureTotal,
            0
        );

        // Sum of all common material totals (which include global profit/transport)
        const commonTotalSum = commonMaterials.reduce(
            (sum, item) => sum + (item.rowTotal || 0),
            0
        );

        // const finalTotal = furnitureTotalSum + commonTotalSum;
        const updatedGrandTotal = Math.round(furnitureTotalSum + commonTotalSum);

        setGrandTotal(updatedGrandTotal);
        setRawCostWithoutProfit(calculateCostWithoutProfit()); // 👈 Add this line
    };

    // const handleLabourCategory = (selectedId: string | null) => {
    //     const selectedCategory = allLabourCategoryOptions.find((s: any) => s.value === selectedId);

    //     if (selectedCategory) {
    //         setSelectedLabourCategory({
    //             categoryId: selectedCategory.value, // This is the _id
    //             categoryName: selectedCategory.label // This is the name
    //         });
    //     } else {
    //         setSelectedLabourCategory({ categoryId: "", categoryName: "" });
    //     }
    // };



    const { profitDifference, profitPercentage } = useMemo(() => {
        const diff = grandTotal - rawCostWithoutProfit;
        const percent = rawCostWithoutProfit > 0 ? (diff / rawCostWithoutProfit) * 100 : 0;

        return {
            profitDifference: Math.round(diff),
            profitPercentage: percent,
        };
    }, [grandTotal, rawCostWithoutProfit]);


    const calculateCostWithoutProfit = () => {
        const updatedFurnitures = furnitureRefs.current
            .map(ref => ref.current)
            .filter((ref): ref is FurnitureQuoteRef => ref !== null)
            .map(ref => ref.getUpdatedFurniture());

        const SHEET_SQFT = 32;
        let totalRawCost = 0;

        updatedFurnitures.forEach(furniture => {
            // A. Brand Rates Mapping
            const plyRates = furniture.plywoodBrand ? (brandRatesByName[furniture.plywoodBrand] || []) : [];
            const innerRates = furniture.innerLaminateBrand ? (innerRatesByName[furniture.innerLaminateBrand] || []) : [];
            const outerRates = furniture.outerLaminateBrand ? (outerRatesByName[furniture.outerLaminateBrand] || []) : [];

            // B. Labour Base
            const coreRows = furniture.coreMaterials;
            const base = coreRows[0];
            const totalLabourCost = (base?.carpenters || 0) * (base?.days || 0) * labourCost;
            const labourPerRow = coreRows.length > 0 ? totalLabourCost / coreRows.length : 0;

            // C. Fabrication Base
            const fabPerRow = coreRows.length > 0 ? (furniture.fabricationCost || 0) / coreRows.length : 0;

            coreRows.forEach(row => {
                const plyRate = getRateForThickness(row.plywoodNos.thickness, plyRates, "plywood");
                const innerRate = getRateForThickness(row.innerLaminate?.thickness || 0, innerRates, "laminate");
                const outerRate = getRateForThickness(row.outerLaminate?.thickness || 0, outerRates, "laminate");

                const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
                const innerCost = (row.innerLaminate?.quantity || 0) * (innerRate * SHEET_SQFT);
                const outerCost = (row.outerLaminate?.quantity || 0) * (outerRate * SHEET_SQFT);

                // Raw Cost = Material + Labour + Fabrication (NO profit multiplier)
                totalRawCost += plyCost + innerCost + outerCost + labourPerRow + fabPerRow;
            });

            // D. Fittings, Glues, NBMs (Base cost only)
            const getSimpleRowBase = (row: any) => (row.quantity || 0) * (row.cost || 0);
            totalRawCost += furniture.fittingsAndAccessories.reduce((sum, r) => sum + getSimpleRowBase(r), 0);
            totalRawCost += furniture.glues.reduce((sum, r) => sum + (r.cost || 0), 0);
            totalRawCost += furniture.nonBrandMaterials.reduce((sum, r) => sum + getSimpleRowBase(r), 0);
        });

        // E. Add Common Materials Base Cost
        totalRawCost += commonMaterials.reduce((sum, item) => sum + ((item.quantity || 0) * (item.cost || 0)), 0);

        return Math.round(totalRawCost);
    };


    // 2. Handler for common materials profit updates
    const handleCommonMaterialProfitChange = (i: number, newProfit: number) => {
        // setCommonMaterials(prev => {
        //     const updated = [...prev];
        //     updated[i] = { ...updated[i], profitOnMaterial: newProfit };
        //     return updated;
        // });



        // 1. Get the current transport split (needed for the row total)
        const furnitureRowsCount = furnitures.reduce((acc, f) => {
            return acc + f.coreMaterials.length + f.fittingsAndAccessories.length + f.glues.length + f.nonBrandMaterials.length;
        }, 0);
        const totalRowsCount = furnitureRowsCount + commonMaterials.length;
        const transportPerRow = totalRowsCount > 0 ? globalTransportation / totalRowsCount : 0;

        // 2. Determine which overlay/global profit to use as fallback
        const effectiveCommonProfit = commonProfitOverride ?? globalProfitPercent;
        const commonMultiplier = 1 + (effectiveCommonProfit / 100);

        setCommonMaterials(prev => {
            const updated = [...prev];
            const item = updated[i];

            // 3. Calculate the row's base cost
            const base = (item.quantity || 0) * (item.cost || 0);

            // 4. Determine which profit multiplier to use
            // If the newProfit > 0, use it. Else use the Common/Global fallback.
            const rowProfitMultiplier = newProfit > 0
                ? 1 + (newProfit / 100)
                : commonMultiplier;

            // 5. Update the item with BOTH the new profit AND the new rowTotal
            updated[i] = {
                ...item,
                profitOnMaterial: newProfit,
                rowTotal: Math.round((base * rowProfitMultiplier) + transportPerRow)
            };

            return updated;
        });

        // 6. Tell the grand total to update since the sum changed
        setTimeout(() => updateGrandTotal(), 0);
    };


    const rendercommonMaterialsTable = () => (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm bg-white">
                <thead className="bg-blue-50 text-blue-800 font-bold uppercase text-[11px]">
                    <tr>
                        {/* <th className="px-6 py-3 border-r border-blue-100">Item Name</th>
                        <th className="px-6 py-3 border-r border-blue-100">Description</th>
                        <th className="px-6 py-3 border-r border-blue-100">Quantity</th>
                        <th className="px-6 py-3 border-r border-blue-100">Cost</th>
                        <th className="px-6 py-3 border-r border-blue-100 text-blue-600">Profit % (Edit)</th>
                        <th className="px-6 py-3">Total (incl. Global)</th> */}
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Brand</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit %</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {commonMaterials.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-blue-50/20 transition-colors">
                            {/* READ ONLY FIELDS */}
                            <td className="p-3 border-r border-gray-100 text-center font-medium text-gray-700">
                                {row.itemName || "—"}
                            </td>
                            <td className="p-3 border-r border-gray-100 text-center text-gray-500">
                                {row.description || "—"}
                            </td>
                            <td className="p-3 border-r border-gray-100 text-center text-gray-500">
                                {row.brandName || "—"}
                            </td>
                            <td className="p-3 border-r border-gray-100 text-center  text-gray-500">
                                {row.quantity}
                            </td>
                            <td className="p-3 border-r border-gray-100 text-center  text-gray-500">
                                ₹{row.cost?.toLocaleString("en-IN")}
                            </td>

                            {/* EDITABLE PROFIT FIELD */}
                            <td className="p-3 border-r border-gray-100 text-center ">
                                <input
                                    type="number"
                                    value={row.profitOnMaterial || 0}
                                    // onChange={(e) => handleCommonMaterialProfitChange(i, parseFloat(e.target.value) || 0)}
                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                    onChange={(e) => {
                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                        handleCommonMaterialProfitChange(i, val);
                                    }}
                                    className="w-16 text-center border border-blue-200 rounded py-1 font-semibold  outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </td>

                            {/* CALC TOTAL */}
                            <td className="p-3 text-center font-black text-green-700 bg-green-50/20">
                                ₹{row.rowTotal?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Inside QuoteGenerateVariantSub.tsx component body

    useEffect(() => {

        console.log("is it getting called here ")
        if (!furnitures.length) return;

        // A. Calculate Total Row Count across ALL products AND Common Materials
        const furnitureRowsCount = furnitures.reduce((acc, f) => {
            return acc + f.coreMaterials.length + f.fittingsAndAccessories.length + f.glues.length + f.nonBrandMaterials.length;
        }, 0);
        const totalRowsCount = furnitureRowsCount + commonMaterials.length;

        // B. Calculate split transportation
        const transportPerRow = totalRowsCount > 0 ? globalTransportation / totalRowsCount : 0;

        // 1. Calculate the new Furnitures Array
        const nextFurnitures = furnitures.map((f) => {
            if (f.coreMaterials.length === 0) return f;
            // PRIORITY LOGIC: Update product's local state if Global is changed

            // const effectiveProfit = globalProfitPercent > 0 ? globalProfitPercent : (f.furnitureProfit || 0);

            const effectiveProfit = (globalProfitPercent !== null && globalProfitPercent !== undefined)
                ? globalProfitPercent
                : (f.furnitureProfit ?? 0); // ✅ Use ?? here too


            return { ...f, furnitureProfit: effectiveProfit };
        });



        // 2. Calculate the new Common Materials Array
        // Use the specific override for common materials
        const effectiveCommonProfit = commonProfitOverride ?? globalProfitPercent;
        const commonMultiplier = 1 + (effectiveCommonProfit / 100);


        // 2. Calculate the new Common Materials Array
        const nextCommon = commonMaterials.map(item => {
            const base = (item.quantity || 0) * (item.cost || 0);
            // ✅ PRIORITY CHECK: If row has local profit, use it. Otherwise use the Overlay.
            const rowTotal = (item.profitOnMaterial || 0) > 0
                ? base * (1 + ((item.profitOnMaterial || 0) / 100))
                : base * commonMultiplier;
            // const localProfit = 1 + ((item.profitOnMaterial || 0) / 100);
            // const globalMultiplier = 1 + (globalProfitPercent / 100);
            return {
                ...item,
                // rowTotal: (base * localProfit * commonMultiplier) + transportPerRow
                rowTotal: rowTotal + transportPerRow
            };
        });

        // 3. Update the States
        setFurnitures(nextFurnitures);
        setCommonMaterials(nextCommon);

        // ✅ FIX: Calculate Grand Total using the data we JUST created (nextFurnitures/nextCommon)
        // instead of waiting for Refs to update.
        // const furnitureSum = nextFurnitures.reduce((sum, f) => sum + (f.totals?.furnitureTotal || 0), 0);
        // const commonSum = nextCommon.reduce((sum, item) => sum + (item.rowTotal || 0), 0);

        // setGrandTotal(furnitureSum + commonSum);

        setTimeout(() => updateGrandTotal(), 0);

    }, [globalTransportation, globalProfitPercent, labourCost, commonMaterials.length, commonProfitOverride,]);



    const handleGenerateQuote = async () => {
        try {
            if (!organizationId || !quoteId || !quote || !selectedBrand) {
                toast({
                    title: "Missing info",
                    description: "Please ensure brand and all details are selected",
                    variant: "destructive",
                });
                return;
            }


            const updatedFurnitures = furnitureRefs.current
                .map(ref => ref.current)
                .filter((ref): ref is FurnitureQuoteRef => ref !== null)
                .map(ref => ref.getUpdatedFurniture());

            // const updatedGrandTotal = updatedFurnitures.reduce(
            //     (sum, f) => sum + f.totals.furnitureTotal,
            //     0
            // );


            // Sum of all furniture product totals
            const furnitureTotalSum = updatedFurnitures.reduce(
                (sum, f) => sum + f.totals.furnitureTotal,
                0
            );


            // 2. Map common materials and round their individual row totals
            const roundedCommonMaterials = commonMaterials.map(item => ({
                ...item,
                rowTotal: Math.round(item.rowTotal || 0)
            }));


            // 3. Calculate sum of rounded common materials
            const commonTotalSum = roundedCommonMaterials.reduce(
                (sum, item) => sum + item.rowTotal,
                0
            );

            // // Sum of all common material totals (which include global profit/transport)
            // const commonTotalSum = commonMaterials.reduce(
            //     (sum, item) => sum + (item.rowTotal || 0),
            //     0
            // );

            // const updatedGrandTotal = furnitureTotalSum + commonTotalSum || 0;
            const updatedGrandTotal = Math.round(furnitureTotalSum + commonTotalSum) || 0;


            // console.log("fff updatedFurnitures", updatedFurnitures)
            // const updatedFurnitures = getUpdatedFurnitureWithTotals();
            // console.log("✅ Submitting Furnitures for Quote", updatedFurnitures);
            // const updatedGrandTotal = updatedFurnitures.reduce((sum, f: any) => sum + f.furnitureTotal, 0);

            await generateQuote({
                quoteId: quoteId!,
                organizationId: organizationId,
                data: {
                    quoteId, // Required for readable reference
                    organizationId,
                    projectId: quote?.projectId?._id,
                    brandName: selectedBrand,
                    innerLaminateBrand: selectedInnerBrand,
                    outerLaminateBrand: selectedOuterBrand,
                    // laminateBrand: selectedLaminateBrand, // ✅ Add this line (optional)

                    plywoodBrandId: selectedBrandId,
                    innerLaminateId: selectedInnerBrandId,
                    outerLaminateId: selectedOuterBrandId,

                    mainQuoteName: quote.mainQuoteName,
                    quoteType: quote.quoteType,
                    // 🆕 ADD THESE: Match your Controller destructuring

                    commonMaterials: roundedCommonMaterials,
                    globalTransportation: globalTransportation,
                    globalProfitPercent: globalProfitPercent,


                    furnitures: updatedFurnitures,
                    grandTotal: updatedGrandTotal,
                    // grandTotal: calculatedVariantGrandTotal,
                    notes: "Generated with brand variant",
                }
            })
            // console.log("reso", res)
            // await downloadImage({ src: res.url, alt: res.fileName })
            toast({ title: "success", description: "Successfully created, check it in the Quote for clients section" })
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
                variant: "destructive"
            });
        }
    }




    



    //  old versiion

    // useEffect(() => {
    //     if (!quote?.furnitures) return;

    //     const transformed: FurnitureBlock[] = quote.furnitures.map((f: any) => ({
    //         furnitureName: f.furnitureName,
    //         coreMaterials: f.coreMaterials || [],
    //         fittingsAndAccessories: f.fittingsAndAccessories || [],
    //         glues: f.glues || [],
    //         nonBrandMaterials: f.nonBrandMaterials || [],
    //         totals: {
    //             core: f.coreMaterialsTotal || 0,
    //             fittings: f.fittingsAndAccessoriesTotal || 0,
    //             glues: f.gluesTotal || 0,
    //             nbms: f.nonBrandMaterialsTotal || 0,
    //             furnitureTotal: f.furnitureTotal || 0,
    //         },


    //         // ✅ FIX: Use furniture-specific brand IDs from the DB if they exist
    //         // If not, it will default to null/global state
    //         plywoodBrandId: f?.plywoodBrandId || null,
    //         innerLaminateBrandId: f?.innerLaminateBrandId || null,
    //         outerLaminateBrandId: f?.outerLaminateBrandId || null,


    //         plywoodBrand: selectedBrand,
    //         // laminateBrand: selectedLaminateBrand,
    //         innerLaminateBrand: selectedInnerBrand,
    //         outerLaminateBrand: selectedOuterBrand
    //     }));

    //     setFurnitures(transformed);
    // }, [quote]);


    //  second new versiion
    //     useEffect(() => {
    //     if (!quote?.furnitures || !brandOptions.length) return;

    //     const transformed: FurnitureBlock[] = quote.furnitures.map((f: any) => {
    //         // 1. Lookup Names for this specific furniture's IDs
    //         const specificPlywood = brandOptions.find(opt => opt.value === f.plywoodBrandId);
    //         const specificInner = innerOptions.find(opt => opt.value === f.innerLaminateBrandId);
    //         const specificOuter = outerOptions.find(opt => opt.value === f.outerLaminateBrandId);

    //         return {
    //             furnitureName: f.furnitureName,
    //             coreMaterials: f.coreMaterials || [],
    //             fittingsAndAccessories: f.fittingsAndAccessories || [],
    //             glues: f.glues || [],
    //             nonBrandMaterials: f.nonBrandMaterials || [],
    //             totals: {
    //                 core: f.coreMaterialsTotal || 0,
    //                 fittings: f.fittingsAndAccessoriesTotal || 0,
    //                 glues: f.gluesTotal || 0,
    //                 nbms: f.nonBrandMaterialsTotal || 0,
    //                 furnitureTotal: f.furnitureTotal || 0,
    //             },

    //             // IDs: Use saved product ID or fallback to global ID
    //             plywoodBrandId: f.plywoodBrandId || selectedBrandId,
    //             innerLaminateBrandId: f.innerLaminateBrandId || selectedInnerBrandId,
    //             outerLaminateBrandId: f.outerLaminateBrandId || selectedOuterBrandId,

    //             // Names: Use looked-up name or fallback to global name
    //             plywoodBrand: specificPlywood?.label || selectedBrand,
    //             innerLaminateBrand: specificInner?.label || selectedInnerBrand,
    //             outerLaminateBrand: specificOuter?.label || selectedOuterBrand
    //         };
    //     });

    //     setFurnitures(transformed);

    //     // We add dependencies for options so names load correctly once API data arrives
    // }, [quote, brandOptions, innerOptions, outerOptions, selectedBrand, selectedInnerBrand, selectedOuterBrand]);

    const isInitialMount = useRef(true);


    useEffect(() => {
        // 1. Guard: Ensure data and options are loaded
        if (!quote || !brandOptions.length || !innerOptions.length || !outerOptions.length) return;

        // 2. We only want to run this "Hydration" logic once when the quote loads
        if (isInitialMount.current) {

            // Identify Global Brands from DB (Staying null if not saved)
            const savedPly = brandOptions.find(opt => opt.value === quote.plywoodBrandId) || null;
            const savedInner = innerOptions.find(opt => opt.value === quote.innerLaminateId) || null;
            const savedOuter = outerOptions.find(opt => opt.value === quote.outerLaminateId) || null;

            // Set Global State
            setSelectedBrand(savedPly?.label || null);
            setSelectedBrandId(savedPly?.value || null);
            setSelectedInnerBrand(savedInner?.label || null);
            setSelectedInnerBrandId(savedInner?.value || null);
            setSelectedOuterBrand(savedOuter?.label || null);
            setSelectedOuterBrandId(savedOuter?.value || null);

            // 3. Transform Furniture
            const transformed: FurnitureBlock[] = quote.furnitures.map((f: any) => {
                // Priority: Product ID from DB > Global ID from DB > null
                const fPlyId = f.plywoodBrandId || quote.plywoodBrandId || null;
                const fInnerId = f.innerLaminateBrandId || quote.innerLaminateId || null;
                const fOuterId = f.outerLaminateBrandId || quote.outerLaminateId || null;

                return {
                    ...f,
                    totals: {
                        core: f.coreMaterialsTotal || 0,
                        fittings: f.fittingsAndAccessoriesTotal || 0,
                        glues: f.gluesTotal || 0,
                        nbms: f.nonBrandMaterialsTotal || 0,
                        furnitureTotal: f.furnitureTotal || 0,
                    },
                    plywoodBrandId: fPlyId,
                    innerLaminateBrandId: fInnerId,
                    outerLaminateBrandId: fOuterId,
                    // Lookup labels directly from the brandOptions using the resolved IDs
                    plywoodBrand: brandOptions.find(o => o.value === fPlyId)?.label || null,
                    innerLaminateBrand: innerOptions.find(o => o.value === fInnerId)?.label || null,
                    outerLaminateBrand: outerOptions.find(o => o.value === fOuterId)?.label || null
                };
            });

            setFurnitures(transformed);

            // Sync financial globals
            setGlobalTransportation(quote.globalTransportation || 0);
            setGlobalProfitPercent(quote.globalProfitPercent || 0);
            setCommonProfitOverride(quote.commonProfitOverride || 0);

            isInitialMount.current = false; // ✅ Lock the mount so it doesn't overwrite again
        }
        // Remove selectedBrandId, etc. from dependencies so they don't trigger re-mapping
    }, [quote, brandOptions, innerOptions, outerOptions]);

    if (furnitureRefs.current.length !== furnitures.length) {
        furnitureRefs.current = furnitures.map(
            (_, i) => furnitureRefs.current[i] ?? React.createRef<FurnitureQuoteRef>()
        );
    }

    useEffect(() => {
        furnitureRefs.current = furnitures.map(
            (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
        );
    }, [furnitures]);


    // useEffect(() => {
    //     // 1. Auto-select Plywood
    //     if (!selectedBrandId && brandOptions?.length > 0) {
    //         const first = brandOptions[0];
    //         setSelectedBrand(first.label);   // Set the Name (e.g., "Century")
    //         setSelectedBrandId(first.value); // Set the ID (e.g., "697a...")
    //     }

    //     // 2. Auto-select Inner Laminate
    //     if (!selectedInnerBrandId && innerOptions?.length > 0) {
    //         const first = innerOptions[0];
    //         setSelectedInnerBrand(first.label);
    //         setSelectedInnerBrandId(first.value);
    //     }

    //     // 3. Auto-select Outer Laminate
    //     if (!selectedOuterBrandId && outerOptions?.length > 0) {
    //         const first = outerOptions[0];
    //         setSelectedOuterBrand(first.label);
    //         setSelectedOuterBrandId(first.value);
    //     }
    // }, [brandOptions, innerOptions, outerOptions]);



    // nnn


    useEffect(() => {
        if (selectedLabourCategory.categoryId === "" && allLabourCategoryOptions?.length > 0) {
            setSelectedLabourCategory({
                categoryId: allLabourCategoryOptions[0]?.value,
                categoryName: allLabourCategoryOptions[0]?.label
            });
        }
    }, [allLabourCategoryOptions]);



    // // START OF LAMINATE
    // useEffect(() => {
    //     if (!selectedLaminateBrand && laminateBrandOptions?.length > 0) {
    //         setSelectedLaminateBrand(laminateBrandOptions[0]);
    //     }
    // }, [laminateBrandOptions]);



    //     // Before rendering children, ensure refs are created for each furniture
    // if (furnitureRefs?.current?.length !== furnitures.length) {
    //   furnitureRefs.current = furnitures.map(
    //     (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
    //   );
    // }

    // END OF LAMINATE 

    return (
        <div className="p-2 max-h-full overflow-y-auto">

            <header className="bg-white border-b border-gray-200 pb-4 space-y-3">
                {/* Top Row - Project Info, Financial Summary, and Generate Button */}
                <div className="flex items-center justify-between gap-4">
                    {/* Left - Project Info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors flex-shrink-0"
                        >
                            <i className="fas fa-arrow-left text-gray-600 text-sm"></i>
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-gray-900 truncate">
                                {quote?.projectId?.projectName || "Project"}
                            </h1>
                            <p className="text-md text-gray-500">{quote?.quoteNo ? `Quote: #${quote?.quoteNo}` : ""}</p>
                        </div>
                    </div>


                    {/* <div className="flex gap-2 items-center"> */}


                       

                        {(canCreate || canEdit) && <Button onClick={handleGenerateQuote} isLoading={quotePending} className="flex-shrink-0">
                            Generate Quote for Client
                        </Button>}

                    {/* </div> */}

                    {/* Right - Generate Button */}

                </div>

                {/* Bottom Row - Brand Selection */}
                {/* <div className="flex items-center gap-4">
                    

                    <div className="flex-1">
                        <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Laminate Brand:</label>
                        <SearchSelect
                            options={laminateBrandOptions}
                            placeholder="Select Laminate Brand"
                            searchPlaceholder="Search brands..."
                            onSelect={setSelectedLaminateBrand}
                            selectedValue={selectedLaminateBrand || ""}
                            className="flex-1"
                        />
                    </div>
                </div> */}


                {/* Bottom Row - Three Way Brand Selection */}
                <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">

                    {/* 1. Plywood Brand */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Plywood Brand</label>
                        <SearchSelectNew
                            options={brandOptions} // Now accepts the [{label, value}] array correctly
                            placeholder="Select Plywood"
                            value={selectedBrandId || ""}
                            onValueChange={(val) => {
                                const selectedObj = brandOptions.find(opt => opt.value === val);
                                setSelectedBrand(selectedObj?.label || val); // Name for PDF
                                setSelectedBrandId(selectedObj?.value || null); // ID for DB
                            }}
                        />
                    </div>

                    {/* 2. Inner Laminate */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold text-blue-600 uppercase">Inner Laminate</label>
                        <SearchSelectNew
                            options={innerOptions}
                            placeholder="Select Inner Brand"
                            value={selectedInnerBrandId || ""}
                            onValueChange={(val) => {
                                const selectedObj = innerOptions.find(opt => opt.value === val);
                                setSelectedInnerBrand(selectedObj?.label || val);
                                setSelectedInnerBrandId(selectedObj?.value || null);
                            }}
                        />
                    </div>

                    {/* 3. Outer Laminate */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold text-orange-600 uppercase">Outer Laminate</label>
                        <SearchSelectNew
                            options={outerOptions}
                            placeholder="Select Outer Brand"
                            value={selectedOuterBrandId || ""}
                            onValueChange={(val) => {
                                const selectedObj = outerOptions.find(opt => opt.value === val);
                                setSelectedOuterBrand(selectedObj?.label || val);
                                setSelectedOuterBrandId(selectedObj?.value || null);
                            }}
                        />
                    </div>
                </div>



                {/* Mobile Financial Summary - Only visible on smaller screens */}
                <div className=" grid grid-cols-4 gap-2">
                    <Card className="px-2 py-4 border-l-4 border-blue-600">
                        <div className="text-center">
                            {/* <p className="text-xs text-gray-600">Cost</p> */}
                            <p className="text-md text-gray-600">Project Cost {" "} <span className="font-bold">(without profit)</span></p>

                            <p className="text-md font-bold text-blue-600">₹{rawCostWithoutProfit.toLocaleString("en-IN")}</p>
                        </div>
                    </Card>

                    <Card className="px-2 py-4 border-l-4 border-green-600">
                        <div className="text-center">
                            {/* <p className="text-xs text-gray-600">Quote</p> */}
                            <p className="text-md text-gray-600">Client Quote Amount {" "} <span className="font-bold">(with profit)</span></p>
                            <p className="text-md font-bold text-green-600">₹{grandTotal.toLocaleString("en-IN")}</p>
                        </div>
                    </Card>

                    <Card className="px-2 py-4 border-l-4 border-violet-600">
                        <div className="text-center">
                            <p className="text-md text-gray-600">Profit Amount</p>
                            <p className="text-md font-bold text-violet-600">₹{profitDifference.toLocaleString("en-IN")}
                                {" "}
                                <span className="text-black !text-[12px] ml-[5px] font-semibold">
                                    ({profitPercentage.toFixed(2)}%)
                                </span>
                            </p>


                        </div>
                    </Card>

                    <Card className="px-2 py-4 border-l-4 border-orange-600">
                        <div className="text-center">
                            <p className="text-md text-gray-600">Single Labour Cost</p>
                            <p className="text-md font-bold text-orange-600">₹{labourCost}

                            </p>


                        </div>
                    </Card>
                </div>
            </header >

            {quoteLoading || loadingBrands ? (
                <MaterialOverviewLoading />
            ) : (
                <>
                    <div className="space-y-6">
                        {furnitures.map((furniture, index) => (
                            <FurnitureQuoteVariantForm
                                key={index}
                                index={index}
                                data={furniture}
                                labourCost={labourCost}
                                ref={furnitureRefs.current[index] as React.RefObject<FurnitureQuoteRef>} // 🔄 Pass the ref down

                                // Brand Data & Selection
                                brandRatesByName={plywoodRatesByName}
                                innerLaminateRatesByBrand={innerRatesByName}
                                outerLaminateRatesByBrand={outerRatesByName}



                                selectedBrand={selectedBrand}
                                selectedInnerBrand={selectedInnerBrand}
                                selectedOuterBrand={selectedOuterBrand}

                                brandOptions={plywoodOptions}
                                innerOptions={innerOptions}
                                outerOptions={outerOptions}

                                // Pass Global Overhead Info (For Read-Only reference/calculations)
                                globalTransportation={globalTransportation}
                                globalProfitPercent={globalProfitPercent}

                                onFurnitureChange={updateGrandTotal}

                                onProfitOverride={(val: number) => handleProductProfitOverride(index, val)} // 🆕 New Prop
                            />
                        ))}




                        {/* 2. COMMON MATERIALS SECTION (VARIANT VIEW) */}
                        {commonMaterials.length > 0 && (
                            <div className="mt-10 bg-white border-2 border-dashed border-blue-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <i className="fas fa-tools text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">Common Site Materials</h2>
                                            <p className="text-xs text-gray-500 italic">Quantities are fixed. Only Profit % can be adjusted for variants.</p>
                                        </div>
                                    </div>
                                    {/* <div className="text-right">
                                        <p className="text-[10px] font-bold text-blue-500 uppercase">Section Total</p>
                                        <p className="text-2xl font-black text-blue-700">
                                            ₹{commonMaterials.reduce((s, i) => s + (i.rowTotal || 0), 0).toLocaleString("en-IN")}
                                        </p>
                                    </div> */}

                                    <div className="text-right flex items-center gap-4">
                                        {/* NEW: Common Profit Override Input */}
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
                                            <label className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                                                Common Profit Overlay
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    className="w-12 text-right font-black bg-transparent outline-none text-blue-800"
                                                    value={commonProfitOverride ?? globalProfitPercent}
                                                    placeholder="0"
                                                    onChange={(e) => {
                                                        const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                                        setCommonProfitOverride(val);

                                                        // ✅ RESET SECTION: Wipe individual row profits only for Common Materials
                                                        setCommonMaterials(prev => prev.map(item => ({
                                                            ...item,
                                                            profitOnMaterial: 0
                                                        })));
                                                    }}
                                                />
                                                <span className="text-blue-600 font-black ml-1 text-sm">%</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase">Section Total</p>
                                            <p className="text-2xl font-black text-blue-700">
                                                ₹{commonMaterials.reduce((s, i) => s + (i.rowTotal || 0), 0).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {rendercommonMaterialsTable()}
                            </div>
                        )}


                        {/* --- GLOBAL OVERHEAD CONTROLS --- */}
                        <div className="flex items-center justify-between gap-4 bg-white border border-blue-100 p-4 rounded-xl shadow-sm mt-8">
                            <div className="flex items-center gap-6">
                                {/* READ-ONLY: Global Transport Display */}
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-extrabold text-blue-500 uppercase tracking-tighter">
                                        Global Transport Cost
                                    </label>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-1 text-sm font-bold">₹</span>
                                        <span className="font-bold text-gray-800">
                                            {globalTransportation.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-gray-100" />

                                {/* EDITABLE: Global Profit Margin Input */}
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-extrabold text-green-500 uppercase tracking-tighter">
                                        Global Profit Margin (%)
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            className="w-16 text-right font-black focus:outline-none text-green-700 bg-green-50 rounded px-2 py-1 border border-green-100"
                                            value={globalProfitPercent}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                setGlobalProfitPercent(val);
                                                setCommonProfitOverride(val);

                                                // ✅ MASTER RESET: Clear all product overrides AND all row-level margins
                                                setFurnitures(prev => prev.map(f => ({
                                                    ...f,
                                                    furnitureProfit: val, // Sync product level
                                                    coreMaterials: f.coreMaterials.map(r => ({ ...r, profitOnMaterial: 0, profitOnLabour: 0 })),
                                                    fittingsAndAccessories: f.fittingsAndAccessories.map(i => ({ ...i, profitOnMaterial: 0 })),
                                                    glues: f.glues.map(i => ({ ...i, profitOnMaterial: 0 })),
                                                    nonBrandMaterials: f.nonBrandMaterials.map(i => ({ ...i, profitOnMaterial: 0 }))
                                                })));

                                                // ✅ RESET COMMON: Wipe individual row profits for common materials
                                                setCommonMaterials(prev => prev.map(item => ({ ...item, profitOnMaterial: 0 })));
                                                // The useEffect brain will automatically push this 'val' 
                                                // into every furniture[index].furnitureProfit
                                            }}
                                        />
                                        <span className="text-green-500 ml-1 font-bold text-sm">%</span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 italic">Overrides all product margins</p>
                                </div>
                            </div>

                            {/* Buttons for Saving/Generating stays here if needed */}
                        </div>




                        <section className="mt-10 text-right">
                            <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
                                <p className="text-md font-medium text-gray-700 mb-1">
                                    Total Estimate
                                </p>

                                <p className="text-2xl font-bold text-green-700">
                                    ₹{grandTotal.toLocaleString("en-IN")}
                                </p>
                            </div>
                        </section>

                    </div>
                </>
            )}
        </div >
    );
};

export default QuoteGenerateVariantSub;



