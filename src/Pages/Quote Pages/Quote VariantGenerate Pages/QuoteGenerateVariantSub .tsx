// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGenerateQuotePdf, useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
// import { RATES, type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import FurnitureQuoteVariantForm from "./FurnitureQuoteVariantForm";
// import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { toast } from "../../../utils/toast";
// import { Button } from "../../../components/ui/Button";
// import { downloadImage } from "../../../utils/downloadFile";

// export const DEFAULT_LAMINATE_RATE_PER_SQFT = 10;

// const QuoteGenerateVariantSub = () => {
//     const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>();
//     const navigate = useNavigate()

//     const { data: quote, isLoading: quoteLoading } = useGetMaterialQuoteSingleEntry(organizationId!, quoteId!);
//     let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
//     // START OF LAMINATION
//     let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
//     // console.log("laminateBrands", laminateBrands)
//     // END OF LAMINATION

//     const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
//     // materialBrands = []
//     // laminateBrands = []
//     // console.log("quote", quote)
//     // console.log("materialBrands", materialBrands)

//     const [selectedBrand, setSelectedBrand] = useState<string | null>(null);



//     // ✅ START OF LAMINATE
//     const [selectedLaminateBrand, setSelectedLaminateBrand] = useState<string | null>(null);
//     // END OF LAMINATE

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
//     const laminateRatesByBrand: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
//         if (!laminateBrands) return {};
//         const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

//         laminateBrands.forEach((item: any) => {
//             const data = item?.data || {};
//             const brandRaw = data.Brand ?? data.brand;
//             const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
//             const rsRaw = data.Rs || data.rs;
//             if (brandRaw && thicknessRaw && rsRaw) {
//                 const brand = String(brandRaw).trim();
//                 const thickness = String(thicknessRaw).trim();
//                 const rs = parseFloat(rsRaw);
//                 if (!brandMap[brand]) brandMap[brand] = [];
//                 brandMap[brand].push({ thickness, rs });
//             }
//         });

//         return brandMap;
//     }, [laminateBrands]);

//     // ✅ Brand dropdown options
//     const laminateBrandOptions = useMemo(() => Object.keys(laminateRatesByBrand), [laminateRatesByBrand]);

//     // END OF LAMINATION

//     const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);


//     const getRateForThickness = (thickness: number | string): number => {
//         if (!selectedBrand) return 0; // 💡 prevent null error
//         const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

//         const matched = (brandRatesByName[selectedBrand])?.find((item) => {
//             const normalized = String(item.thickness).toLowerCase().replace("mm", "").trim();
//             return normalized === thicknessStr;
//         });

//         //          console.log("🔍  rrrr Input thickness:", thicknessStr);
//         //   console.log("📦 rrrr Available rates:", brandRatesByName[selectedBrand]);
//         //   console.log("✅ rrrr Matched:", matched);

//         return matched?.rs || 0;
//     };


//     // START OF LAMINATE 

//     // ✅ 💡 Modular & safe: Get rate for laminate
//     const getLaminateRate = (thickness: number | string): number => {


//         if (!selectedLaminateBrand) return DEFAULT_LAMINATE_RATE_PER_SQFT;

//         const normalize = (val: string | number) =>
//             String(val).replace(/mm/gi, "").replace(/\s+/g, "").trim().toLowerCase();

//         const thicknessStr = normalize(thickness);

//         const matched = laminateRatesByBrand[selectedLaminateBrand]?.find((item) => {
//             const itemThk = normalize(item.thickness);
//             return itemThk === thicknessStr;
//         });

//         //   console.log("🔍 rrrrrr Input thickness:", thicknessStr);
//         //   console.log("📦 rrrrrr Available rates:", laminateRatesByBrand[selectedLaminateBrand]);
//         //   console.log("✅ rrrrrr Matched:", matched);

//         //   if (!matched) {
//         //     toast({
//         //       title: "Missing Laminate Rate",
//         //       description: `Rate not found for thickness "${thickness}" in brand "${selectedLaminateBrand}". Using default ₹${DEFAULT_LAMINATE_RATE_PER_SQFT}.`,
//         //       variant: "destructive",
//         //     });
//         //   }

//         return matched?.rs ?? DEFAULT_LAMINATE_RATE_PER_SQFT;
//     };

//     // END OF LAMINATE 

//     const calculatedVariantGrandTotal = useMemo(() => {
//         if (furnitures.length === 0) return 0;

//         const SHEET_SQFT = 32;

//         const calculateFurnitureTotal = (furniture: FurnitureBlock) => {
//             const coreTotal = furniture.coreMaterials.reduce((sum, row) => {
//                 const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

//                 if (noBrandSelected) {
//                     // ✅ Use the existing base rowTotal entered by user
//                     return sum + (row.rowTotal || 0);
//                 } else {
//                     // ✅ Recalculate only if brand(s) selected

//                     const plyRate = getRateForThickness(row.plywoodNos.thickness); // from selectedBrand

//                     const lamiRate = getLaminateRate(row.laminateNos.thickness);   // from selectedLaminateBrand
//                     // console.log("rrrrr plyRate", plyRate)
//                     // console.log("rrrrr laminateRate", lamiRate)
//                     const plywoodCost = row.plywoodNos?.quantity * plyRate * SHEET_SQFT;
//                     const laminateCost = row.laminateNos?.quantity * lamiRate * SHEET_SQFT;
//                     const materialCost = plywoodCost + laminateCost;

//                     const profitOnMaterial = materialCost * (row.profitOnMaterial / 100);

//                     const labourCost = row.carpenters * row.days * RATES.labour; // ✅ base labour cost
//                     const profitOnLabour = labourCost * (row.profitOnLabour / 100);
//                     // console.log("prfotonlabour", profitOnLabour)
//                     // console.log("prfotonlabour", profitOnMaterial)

//                     const total = materialCost + profitOnMaterial + labourCost + profitOnLabour;

//                     return sum + Math.round(total);
//                 }
//             }, 0);

//             const fittings = furniture.fittingsAndAccessories.reduce((sum, row) => sum + (row.quantity * row.cost), 0);
//             const glues = furniture.glues.reduce((sum, row) => sum + (row.quantity * row.cost), 0);
//             const nbms = furniture.nonBrandMaterials.reduce((sum, row) => sum + (row.quantity * row.cost), 0);

//             return Math.round(coreTotal + fittings + glues + nbms);
//         };

//         const grandTotal = furnitures.reduce(
//             (total, furniture) => total + calculateFurnitureTotal(furniture),
//             0
//         );

//         return grandTotal;
//     }, [furnitures, selectedBrand, selectedLaminateBrand]);



//     const getUpdatedFurnitureWithTotals = (): FurnitureBlock[] => {

//         return furnitures.map((furniture) => {
//             const coreMaterials = furniture.coreMaterials || [];

//             const calculateRowTotal = (row: CoreMaterialRow) => {
//                 const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

//                 if (noBrandSelected) {
//                     return row.rowTotal || 0;
//                 }

//                 // ✅ Get brand-specific rates
//                 const plyRate = getRateForThickness(row.plywoodNos.thickness);        // from selectedBrand
//                 const lamiRate = getLaminateRate(row.laminateNos.thickness);          // from selectedLaminateBrand

//                 const SHEET_SQFT = 32;

//                 const plyCost = row.plywoodNos.quantity * plyRate * SHEET_SQFT;
//                 const lamiCost = row.laminateNos.quantity * lamiRate * SHEET_SQFT;
//                 const baseMaterialCost = plyCost + lamiCost;

//                 const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
//                 const labourCost = row.carpenters * row.days * RATES.labour;
//                 const profitOnLabour = labourCost * (row.profitOnLabour / 100);

//                 const total = baseMaterialCost + profitOnMaterial + labourCost + profitOnLabour;

//                 return Math.round(total); // ✅ Final updated rowTotal
//             };


//             const calculateSimpleRowTotal = (row: SimpleItemRow) =>
//                 row.quantity * row.cost;

//             const updatedCoreMaterials = coreMaterials.map((row) => ({
//                 ...row,
//                 rowTotal: calculateRowTotal(row),
//             }));

//             const fittingsTotal = furniture.fittingsAndAccessories.reduce((sum, itm) => sum + calculateSimpleRowTotal(itm), 0);
//             const gluesTotal = furniture.glues.reduce((sum, itm) => sum + calculateSimpleRowTotal(itm), 0);
//             const nbmsTotal = furniture.nonBrandMaterials.reduce((sum, itm) => sum + calculateSimpleRowTotal(itm), 0);
//             const coreTotal = updatedCoreMaterials.reduce((sum, row) => sum + row.rowTotal, 0);

//             const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

//             return {
//                 ...furniture,
//                 coreMaterials: updatedCoreMaterials,
//                 coreMaterialsTotal: coreTotal,
//                 fittingsAndAccessoriesTotal: fittingsTotal,
//                 gluesTotal,
//                 nonBrandMaterialsTotal: nbmsTotal,
//                 furnitureTotal,
//                 totals: {
//                     core: coreTotal,
//                     fittings: fittingsTotal,
//                     glues: gluesTotal,
//                     nbms: nbmsTotal,
//                     furnitureTotal,
//                 },
//             };
//         });
//     };



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

//             const updatedFurnitures = getUpdatedFurnitureWithTotals();
//             // console.log("✅ Submitting Furnitures for Quote", updatedFurnitures);
//             const updatedGrandTotal = updatedFurnitures.reduce((sum, f: any) => sum + f.furnitureTotal, 0);

//             const res: any = await generateQuote({
//                 quoteId: quoteId!,
//                 organizationId: organizationId,
//                 data: {
//                     quoteId, // Required for readable reference
//                     organizationId,
//                     projectId: quote.projectId,
//                     brandName: selectedBrand,
//                     laminateBrand: selectedLaminateBrand, // ✅ Add this line (optional)
//                     furnitures: updatedFurnitures,
//                     grandTotal: updatedGrandTotal,
//                     // grandTotal: calculatedVariantGrandTotal,
//                     notes: "Generated with brand variant",

//                 }
//             })
//             // console.log("reso", res)
//             downloadImage({ src: res.url, alt: res.fileName })
//             toast({ title: "success", description: "scuesssfully vrated" })
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Operation failed",
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
//         }));

//         setFurnitures(transformed);
//     }, [quote]);


//     useEffect(() => {
//         if (!selectedBrand && brandOptions?.length > 0) {
//             setSelectedBrand(brandOptions[0]);
//         }
//     }, [brandOptions]);



//     // START OF LAMINATE
//     useEffect(() => {
//         if (!selectedLaminateBrand && laminateBrandOptions?.length > 0) {
//             setSelectedLaminateBrand(laminateBrandOptions[0]);
//         }
//     }, [laminateBrandOptions]);

//     // END OF LAMINATE 

//     return (
//         <div className="p-2 max-h-full overflow-y-auto">
//             <header className="flex justify-between items-center mb-6">
//                 <div className="flex gap-2 items-center">
//                     <div onClick={() => navigate(-1)}
//                         className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
//                         <i className='fas fa-arrow-left'></i></div>
//                     <div>

//                         <h1 className="text-md font-bold text-gray-500">Project Name: <strong className="text-black">{quote?.projectId?.projectName || "Project"}</strong></h1>
//                         <h1 className="text-md font-bold text-gray-500">Quote:  <strong className="text-black">#{quote?.quoteNo || "View"}</strong></h1>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 justify-end ">
//                     <div>
//                         <Button isLoading={quotePending} onClick={() => { handleGenerateQuote() }}>Generate Quote</Button>
//                     </div>
//                     <div
//                     // className={`border-2 max-w-[40%]`}
//                     >
//                         <label className="font-medium text-gray-700">Select plywood Brand:</label>
//                         <select
//                             value={selectedBrand || ""}
//                             onChange={(e) => setSelectedBrand(e.target.value)}
//                             className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
//                         >
//                             <option value="">-- Choose Brand --</option>
//                             {brandOptions.length > 0 ?
//                                 <>
//                                     {brandOptions.map((brand) => (
//                                         <option key={brand} value={brand}>
//                                             {brand}
//                                         </option>
//                                     ))}
//                                 </>
//                                 : <>
//                                     <option value="" disabled className="text-gray-400">
//                                         No Playwood brand options available. Create it in the Rate config section.
//                                     </option>
//                                 </>
//                             }
//                         </select>

//                     </div>

//                     {/* START OF LAMINATE */}
//                     <div
//                     // className={`border-2 max-w-[40%]`}
//                     >
//                         <label className="font-medium text-gray-700">Select Laminate Brand:</label>
//                         <select
//                             value={selectedLaminateBrand || ""}
//                             onChange={(e) => setSelectedLaminateBrand(e.target.value)}
//                             className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
//                         >
//                             <option value="">-- Choose Laminate Brand --</option>
//                             {laminateBrandOptions.length > 0 ?
//                                 <>
//                                     {laminateBrandOptions.map((brand) => (
//                                         <option key={brand} value={brand}>
//                                             {brand}
//                                         </option>
//                                     ))}
//                                 </>
//                                 : <>
//                                     {/* <div>
//                                 no Laminate brand options available , create it in the Rate config
//                             </div> */}
//                                     <option value="" disabled className="text-gray-400">
//                                         No Laminate brand options available. Create it in the Rate config.
//                                     </option>
//                                 </>
//                             }
//                         </select>

//                     </div>
//                     {/* END OF LAMINATE */}

//                 </div>
//             </header>


//             {selectedBrand && brandRatesByName[selectedBrand]?.length > 0 && (
//                 <div className="mt-6 border border-gray-200 bg-white rounded-md shadow-sm p-4">
//                     <h3 className="text-md font-semibold text-gray-800 mb-2">
//                         Available Thickness & Rates for <span className="text-blue-600">{selectedBrand}</span>
//                     </h3>

//                     <div className="overflow-x-auto">
//                         <table className="min-w-full text-sm text-left border border-gray-100">
//                             <thead className="bg-blue-50 text-xs text-gray-600 uppercase tracking-wider">
//                                 <tr>
//                                     <th className="px-4 py-2 border-r">Thickness</th>
//                                     <th className="px-4 py-2">Rate (₹/sqft)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {brandRatesByName[selectedBrand].map((item, i) => (
//                                     <tr key={i} className="border-t border-gray-100">
//                                         <td className="px-4 py-2 border-r text-gray-700 font-medium">
//                                             {item.thickness}
//                                         </td>
//                                         <td className="px-4 py-2 text-green-800 font-bold">
//                                             ₹{item.rs.toFixed(2)}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}


//             {/* START OF LAMINATE */}
//             {selectedLaminateBrand && laminateRatesByBrand[selectedLaminateBrand]?.length > 0 && (
//                 <div className="mt-4 border bg-white rounded-md shadow-sm p-4">
//                     <h3 className="text-md font-semibold text-gray-800 mb-2">
//                         Laminate Rates for <span className="text-blue-600">{selectedLaminateBrand}</span>
//                     </h3>
//                     <table className="min-w-full text-sm border">
//                         <thead className="bg-blue-50 text-xs text-gray-600 uppercase">
//                             <tr>
//                                 <th className="px-4 py-2 border-r">Thickness</th>
//                                 <th className="px-4 py-2">Rate (₹/sqft)</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {laminateRatesByBrand[selectedLaminateBrand].map((item, idx) => (
//                                 <tr key={idx} className="border-t">
//                                     <td className="px-4 py-2 border-r font-medium">{item.thickness}</td>
//                                     <td className="px-4 py-2 text-green-800 font-bold">₹{item.rs.toFixed(2)}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//             {/* END OF LAMINATE */}

//             {quoteLoading || loadingBrands ? (
//                 <MaterialOverviewLoading />
//             ) : (
//                 <>
//                     {/* {selectedBrand ? ( */}
//                     <>
//                         <div className="space-y-6">
//                             {furnitures.map((furniture, index) => (
//                                 <FurnitureQuoteVariantForm
//                                     key={index}
//                                     index={index}
//                                     data={furniture}
//                                     selectedBrandRates={selectedBrand ? brandRatesByName[selectedBrand] || [] : []}
//                                     selectedLaminateRates={selectedLaminateBrand ? laminateRatesByBrand[selectedLaminateBrand] || [] : []}
//                                     selectedBrand={selectedBrand}
//                                     selectedLaminateBrand={selectedLaminateBrand}

//                                 />
//                             ))}

//                             <div className="mt-10 text-right">
//                                 <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
//                                     <p className="text-sm font-medium text-gray-700 mb-1">
//                                         Total Estimate {selectedBrand ? `(Based on ${selectedBrand})` : ""}
//                                     </p>
//                                     <p className="text-2xl font-bold text-green-700">
//                                         ₹{calculatedVariantGrandTotal.toLocaleString("en-IN")}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                     {/* ) : 
//                     (
//                         <div className="flex flex-col items-center justify-center py-16 text-center bg-white border rounded-md shadow-sm mt-6">
//                             <i className="fas fa-cubes text-blue-300 text-6xl mb-4" />

//                             <h2 className="text-xl font-semibold text-blue-700">
//                                 No Brand Selected
//                             </h2>

//                             <p className="text-sm text-gray-500 mt-2 max-w-md">
//                                 Please <strong className="text-gray-600">select a brand</strong>  from the dropdown above to view quote details, pricing, and breakdown.
//                             </p>
//                         </div>
//                     )
//                     } */}

//                 </>
//             )}
//         </div>
//     );
// };

// export default QuoteGenerateVariantSub;






import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGenerateQuotePdf, useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { type FurnitureBlock } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import FurnitureQuoteVariantForm, { type FurnitureQuoteRef } from "./FurnitureQuoteVariantForm";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { downloadImage } from "../../../utils/downloadFile";
import SearchSelect from "../../../components/ui/SearchSelect";

export const DEFAULT_LAMINATE_RATE_PER_SQFT = 10;

const QuoteGenerateVariantSub = () => {
    const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>();
    const navigate = useNavigate()

    const { data: quote, isLoading: quoteLoading } = useGetMaterialQuoteSingleEntry(organizationId!, quoteId!);
    let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
    // START OF LAMINATION
    let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
    // console.log("laminateBrands", laminateBrands)
    // END OF LAMINATION

    const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
    // materialBrands = []
    // laminateBrands = []
    // console.log("quote", quote)
    // console.log("materialBrands", materialBrands)
    // Add at the top of your component
    const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);




    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);



    // ✅ START OF LAMINATE
    const [selectedLaminateBrand, setSelectedLaminateBrand] = useState<string | null>(null);
    // END OF LAMINATE

    // Extract all unique brand names from materialBrands data
    const brandRatesByName: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
        if (!materialBrands) return {};

        const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

        materialBrands.forEach((item: any) => {
            const data = item?.data || {};
            const brandRaw = data.Brand ?? data.brand;
            const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
            let rsRaw = data.Rs || data.rs;
            if (
                brandRaw &&
                thicknessRaw &&
                // (typeof rsRaw === "number" || (typeof rsRaw === "string" && !isNaN(Number(rsRaw))))
                rsRaw
            ) {
                const brand = String(brandRaw).trim();
                const thickness = String(thicknessRaw).trim();
                const rs = parseFloat(rsRaw);

                if (!brandMap[brand]) brandMap[brand] = [];

                brandMap[brand].push({
                    thickness,
                    rs,
                });
            }
        });

        return brandMap;
    }, [materialBrands]);

    // Get clean unique brand names from this mapping
    const brandOptions = useMemo(() => Object.keys(brandRatesByName), [brandRatesByName]);


    // START OF LAMINATION
    const laminateRatesByBrand: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
        if (!laminateBrands) return {};
        const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

        laminateBrands.forEach((item: any) => {
            const data = item?.data || {};
            const brandRaw = data.Brand ?? data.brand;
            const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
            const rsRaw = data.Rs || data.rs;
            if (brandRaw && thicknessRaw && rsRaw) {
                const brand = String(brandRaw).trim();
                const thickness = String(thicknessRaw).trim();
                const rs = parseFloat(rsRaw);
                if (!brandMap[brand]) brandMap[brand] = [];
                brandMap[brand].push({ thickness, rs });
            }
        });

        return brandMap;
    }, [laminateBrands]);

    // ✅ Brand dropdown options
    const laminateBrandOptions = useMemo(() => Object.keys(laminateRatesByBrand), [laminateRatesByBrand]);

    // END OF LAMINATION

    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);

    const [grandTotal, setGrandTotal] = useState(0);

    const updateGrandTotal = () => {
        const updatedFurnitures = furnitureRefs.current
            .map(ref => ref.current)
            .filter((ref): ref is FurnitureQuoteRef => ref !== null)
            .map(ref => ref.getUpdatedFurniture());

        const total = updatedFurnitures.reduce(
            (sum, f) => sum + f.totals.furnitureTotal,
            0
        );

        setGrandTotal(total);
    };


    // const getRateForThickness = (thickness: number | string): number => {
    //     if (!selectedBrand) return 0; // 💡 prevent null error
    //     const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

    //     const matched = (brandRatesByName[selectedBrand])?.find((item) => {
    //         const normalized = String(item.thickness).toLowerCase().replace("mm", "").trim();
    //         return normalized === thicknessStr;
    //     });

    //     //          console.log("🔍  rrrr Input thickness:", thicknessStr);
    //     //   console.log("📦 rrrr Available rates:", brandRatesByName[selectedBrand]);
    //     //   console.log("✅ rrrr Matched:", matched);

    //     return matched?.rs || 0;
    // };


    // // ✅ 💡 Modular & safe: Get rate for laminate
    // const getLaminateRate = (thickness: number | string): number => {


    //     if (!selectedLaminateBrand) return DEFAULT_LAMINATE_RATE_PER_SQFT;

    //     const normalize = (val: string | number) =>
    //         String(val).replace(/mm/gi, "").replace(/\s+/g, "").trim().toLowerCase();

    //     const thicknessStr = normalize(thickness);

    //     const matched = laminateRatesByBrand[selectedLaminateBrand]?.find((item) => {
    //         const itemThk = normalize(item.thickness);
    //         return itemThk === thicknessStr;
    //     });

    //     //   console.log("🔍 rrrrrr Input thickness:", thicknessStr);
    //     //   console.log("📦 rrrrrr Available rates:", laminateRatesByBrand[selectedLaminateBrand]);
    //     //   console.log("✅ rrrrrr Matched:", matched);

    //     //   if (!matched) {
    //     //     toast({
    //     //       title: "Missing Laminate Rate",
    //     //       description: `Rate not found for thickness "${thickness}" in brand "${selectedLaminateBrand}". Using default ₹${DEFAULT_LAMINATE_RATE_PER_SQFT}.`,
    //     //       variant: "destructive",
    //     //     });
    //     //   }

    //     return matched?.rs ?? DEFAULT_LAMINATE_RATE_PER_SQFT;
    // };


    // const calculatedVariantGrandTotal = useMemo(() => {
    //     if (furnitures.length === 0) return 0;

    //     const SHEET_SQFT = 32;

    //     const calculateFurnitureTotal = (furniture: FurnitureBlock) => {
    //         const coreTotal = furniture.coreMaterials.reduce((sum, row) => {
    //             const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

    //             if (noBrandSelected) {
    //                 // ✅ Use the existing base rowTotal entered by user
    //                 return sum + (row.rowTotal || 0);
    //             } else {
    //                 // ✅ Recalculate only if brand(s) selected

    //                 const plyRate = getRateForThickness(row.plywoodNos.thickness); // from selectedBrand

    //                 const lamiRate = getLaminateRate(row.laminateNos.thickness);   // from selectedLaminateBrand
    //                 // console.log("rrrrr plyRate", plyRate)
    //                 // console.log("rrrrr laminateRate", lamiRate)
    //                 const plywoodCost = row.plywoodNos?.quantity * plyRate * SHEET_SQFT;
    //                 const laminateCost = row.laminateNos?.quantity * lamiRate * SHEET_SQFT;
    //                 const materialCost = plywoodCost + laminateCost;

    //                 const profitOnMaterial = materialCost * (row.profitOnMaterial / 100);

    //                 // const labourCost = row.carpenters * row.days * RATES.labour; // ✅ base labour cost
    //                 // const profitOnLabour = labourCost * (row.profitOnLabour / 100);
    //                 const totalRows = furniture.coreMaterials.length;

    //                 const base = furniture.coreMaterials[0];
    //                 const totalLabourCost = base.carpenters * base.days * RATES.labour;
    //                 const labourWithProfit = totalLabourCost * (1 + (base.profitOnLabour || 0) / 100);
    //                 const labourPerRow = labourWithProfit / totalRows;

    //                 // console.log("prfotonlabour", profitOnLabour)
    //                 // console.log("prfotonlabour", profitOnMaterial)

    //                 const total = materialCost + profitOnMaterial + labourPerRow;

    //                 return sum + Math.round(total);
    //             }
    //         }, 0);

    //         const fittings = furniture.fittingsAndAccessories.reduce((sum, row) => sum + (row.quantity * row.cost), 0);
    //         const glues = furniture.glues.reduce((sum, row) => sum + row.cost, 0);
    //         const nbms = furniture.nonBrandMaterials.reduce((sum, row) => sum + (row.quantity * row.cost), 0);

    //         return Math.round(coreTotal + fittings + glues + nbms);
    //     };

    //     const grandTotal = furnitures.reduce(
    //         (total, furniture) => total + calculateFurnitureTotal(furniture),
    //         0
    //     );

    //     return grandTotal;
    // }, [furnitures, selectedBrand, selectedLaminateBrand]);



    // const getUpdatedFurnitureWithTotals = (): FurnitureBlock[] => {

    //     return furnitures.map((furniture) => {
    //         const coreMaterials = furniture.coreMaterials || [];

    //         const calculateRowTotal = (row: CoreMaterialRow) => {
    //             const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

    //             if (noBrandSelected) {
    //                 return row.rowTotal || 0;
    //             }

    //             // ✅ Get brand-specific rates
    //             const plyRate = getRateForThickness(row.plywoodNos.thickness);        // from selectedBrand
    //             const lamiRate = getLaminateRate(row.laminateNos.thickness);          // from selectedLaminateBrand

    //             const SHEET_SQFT = 32;

    //             const plyCost = row.plywoodNos.quantity * plyRate * SHEET_SQFT;
    //             const lamiCost = row.laminateNos.quantity * lamiRate * SHEET_SQFT;
    //             const baseMaterialCost = plyCost + lamiCost;

    //             const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
    //             const labourCost = row.carpenters * row.days * RATES.labour;
    //             const profitOnLabour = labourCost * (row.profitOnLabour / 100);

    //             const total = baseMaterialCost + profitOnMaterial + labourCost + profitOnLabour;

    //             return Math.round(total); // ✅ Final updated rowTotal
    //         };


    //         const calculateSimpleRowTotal = (row: SimpleItemRow) =>
    //             row.quantity * row.cost;

    //         const updatedCoreMaterials = coreMaterials.map((row) => ({
    //             ...row,
    //             rowTotal: calculateRowTotal(row),
    //         }));

    //         const fittingsTotal = furniture.fittingsAndAccessories.reduce((sum, itm) => sum + calculateSimpleRowTotal(itm), 0);
    //         const gluesTotal = furniture.glues.reduce((sum, itm) => sum + calculateSimpleRowTotal(itm), 0);
    //         const nbmsTotal = furniture.nonBrandMaterials.reduce((sum, itm) => sum + calculateSimpleRowTotal(itm), 0);
    //         const coreTotal = updatedCoreMaterials.reduce((sum, row) => sum + row.rowTotal, 0);

    //         const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

    //         return {
    //             ...furniture,
    //             coreMaterials: updatedCoreMaterials,
    //             coreMaterialsTotal: coreTotal,
    //             fittingsAndAccessoriesTotal: fittingsTotal,
    //             gluesTotal,
    //             nonBrandMaterialsTotal: nbmsTotal,
    //             furnitureTotal,
    //             totals: {
    //                 core: coreTotal,
    //                 fittings: fittingsTotal,
    //                 glues: gluesTotal,
    //                 nbms: nbmsTotal,
    //                 furnitureTotal,
    //             },
    //         };
    //     });
    // };

    // const calculatedVariantGrandTotal = () => {
    //     if (furnitureRefs.current.length !== furnitures.length) {
    //         furnitureRefs.current = furnitures.map(
    //             (_, i) => furnitureRefs.current[i] ?? React.createRef<FurnitureQuoteRef>()
    //         );
    //     }

    //     const updatedFurnitures = furnitureRefs.current
    //         .map(ref => ref.current)
    //         .filter((ref): ref is FurnitureQuoteRef => ref !== null)
    //         .map(ref => ref.getUpdatedFurniture());


    //     return updatedFurnitures.reduce((total, furniture) => {
    //         const SHEET_SQFT = 32;

    //         const coreTotal = furniture.coreMaterials.reduce((sum, row) => {
    //             const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

    //             if (noBrandSelected) {
    //                 return sum + (row.rowTotal || 0);
    //             } else {
    //                 const plyRate = getRateForThickness(row.plywoodNos.thickness);
    //                 const lamiRate = getLaminateRate(row.laminateNos.thickness);
    //                 const plywoodCost = row.plywoodNos.quantity * plyRate * SHEET_SQFT;
    //                 const laminateCost = row.laminateNos.quantity * lamiRate * SHEET_SQFT;
    //                 const materialCost = plywoodCost + laminateCost;
    //                 const profitOnMaterial = materialCost * (row.profitOnMaterial / 100);

    //                 const totalRows = furniture.coreMaterials.length;
    //                 const base = furniture.coreMaterials[0];
    //                 const totalLabourCost = base.carpenters * base.days * RATES.labour;
    //                 const labourWithProfit = totalLabourCost * (1 + (base.profitOnLabour || 0) / 100);
    //                 const labourPerRow = labourWithProfit / totalRows;

    //                 return sum + Math.round(materialCost + profitOnMaterial + labourPerRow);
    //             }
    //         }, 0);

    //         const fittings = furniture.fittingsAndAccessories.reduce((sum, row) => sum + (row.quantity * row.cost), 0);
    //         const glues = furniture.glues.reduce((sum, row) => sum + row.cost, 0);
    //         const nbms = furniture.nonBrandMaterials.reduce((sum, row) => sum + (row.quantity * row.cost), 0);

    //         return total + Math.round(coreTotal + fittings + glues + nbms);
    //     }, 0);
    // }




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

            console.log("fff Furnitures", furnitures)
            console.log("fff furnitureRefs", furnitureRefs)

            // const updatedFurnitures = furnitureRefs.current
            //     .map((ref) => ref.current?.getUpdatedFurniture())
            //     .filter((furniture): furniture is FurnitureBlock => furniture !== undefined);
            const updatedFurnitures = furnitureRefs.current
                .map(ref => ref.current)
                .filter((ref): ref is FurnitureQuoteRef => ref !== null)
                .map(ref => ref.getUpdatedFurniture());

            const updatedGrandTotal = updatedFurnitures.reduce(
                (sum, f) => sum + f.totals.furnitureTotal,
                0
            );
            console.log("fff updatedFurnitures", updatedFurnitures)
            // const updatedFurnitures = getUpdatedFurnitureWithTotals();
            // console.log("✅ Submitting Furnitures for Quote", updatedFurnitures);
            // const updatedGrandTotal = updatedFurnitures.reduce((sum, f: any) => sum + f.furnitureTotal, 0);

            const res: any = await generateQuote({
                quoteId: quoteId!,
                organizationId: organizationId,
                data: {
                    quoteId, // Required for readable reference
                    organizationId,
                    projectId: quote.projectId,
                    brandName: selectedBrand,
                    laminateBrand: selectedLaminateBrand, // ✅ Add this line (optional)
                    furnitures: updatedFurnitures,
                    grandTotal: updatedGrandTotal,
                    // grandTotal: calculatedVariantGrandTotal,
                    notes: "Generated with brand variant",

                }
            })
            // console.log("reso", res)
            downloadImage({ src: res.url, alt: res.fileName })
            toast({ title: "success", description: "scuesssfully vrated" })
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    }


    // useEffect(() => {
    //     furnitureRefs.current = furnitures.map(() =>
    //         React.createRef<FurnitureQuoteRef>()
    //     );
    // }, [furnitures.length]);


    useEffect(() => {
        if (!quote?.furnitures) return;

        const transformed: FurnitureBlock[] = quote.furnitures.map((f: any) => ({
            furnitureName: f.furnitureName,
            coreMaterials: f.coreMaterials || [],
            fittingsAndAccessories: f.fittingsAndAccessories || [],
            glues: f.glues || [],
            nonBrandMaterials: f.nonBrandMaterials || [],
            totals: {
                core: f.coreMaterialsTotal || 0,
                fittings: f.fittingsAndAccessoriesTotal || 0,
                glues: f.gluesTotal || 0,
                nbms: f.nonBrandMaterialsTotal || 0,
                furnitureTotal: f.furnitureTotal || 0,
            },
            plywoodBrand: selectedBrand,
            laminateBrand: selectedLaminateBrand,
        }));

        setFurnitures(transformed);
    }, [quote]);


    if (furnitureRefs.current.length !== furnitures.length) {
        furnitureRefs.current = furnitures.map(
            (_, i) => furnitureRefs.current[i] ?? React.createRef<FurnitureQuoteRef>()
        );
    }

    useEffect(() => {
        console.log("furnitureRefs Array", furnitureRefs)
        furnitureRefs.current = furnitures.map(
            (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
        );
    }, [furnitures]);





    console.log("furnitureRefs", furnitureRefs)

    useEffect(() => {
        if (!selectedBrand && brandOptions?.length > 0) {
            setSelectedBrand(brandOptions[0]);
        }
    }, [brandOptions]);



    // START OF LAMINATE
    useEffect(() => {
        if (!selectedLaminateBrand && laminateBrandOptions?.length > 0) {
            setSelectedLaminateBrand(laminateBrandOptions[0]);
        }
    }, [laminateBrandOptions]);





    //     // Before rendering children, ensure refs are created for each furniture
    // if (furnitureRefs?.current?.length !== furnitures.length) {
    //   furnitureRefs.current = furnitures.map(
    //     (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
    //   );
    // }

    // END OF LAMINATE 


    //     const handleSelect = (option: { label: string; value: string }) => {
    //     console.log('Selected:', option);
    //   };

    //   const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

    //  const handleSelect = (option: SelectOption | null) => {
    //     setSelectedOption(option);
    //     console.log('Selected:', option);
    //   };


    return (
        <div className="p-2 max-h-full overflow-y-auto">
            <header className="flex justify-between items-center mb-6">
                <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)}
                        className='bg-slate-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i></div>
                    <div>

                        <h1 className="text-md font-bold text-gray-500">Project Name: <strong className="text-black">{quote?.projectId?.projectName || "Project"}</strong></h1>
                        <h1 className="text-md font-bold text-gray-500">Quote:  <strong className="text-black">#{quote?.quoteNo || "View"}</strong></h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-end ">

                    <p className="text-2xl font-bold text-green-700">
                        ₹{grandTotal.toLocaleString("en-IN")}
                    </p>

                    <div>
                        <Button isLoading={quotePending} onClick={() => { handleGenerateQuote() }}>Generate Quote</Button>
                    </div>


                    <div className="max-w-[40%]">
                        <label className="font-medium text-gray-700">Select Common Plwyood Brand:</label>

                        <SearchSelect
                            options={brandOptions}
                            placeholder="-- Choose Plwyood Brand --"
                            searchPlaceholder="Search Plywood brands..."
                            onSelect={setSelectedBrand}
                            selectedValue={selectedBrand || ""}
                            className="mt-1"
                        />

                        {/* {brandOptions.length === 0 && (
                            <div className="text-gray-500 text-sm mt-1">
                                No Plywood brand options available. Create it in the Rate config.
                            </div>
                        )} */}

                    </div>

                    {/* <div
                    >
                        <label className="font-medium text-gray-700">Select Common plywood Brand:</label>
                        <select
                            value={selectedBrand || ""}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
                        >
                            <option value="">-- Choose Brand --</option>
                            {brandOptions.length > 0 ?
                                <>
                                    {brandOptions.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </>
                                : <>
                                    <option value="" disabled className="text-gray-400">
                                        No Playwood brand options available. Create it in the Rate config section.
                                    </option>
                                </>
                            }
                        </select>
                       
                    </div> */}

                    {/* <div
                    >
                        <label className="font-medium text-gray-700">Select Common Laminate Brand:</label>
                        <select
                            value={selectedLaminateBrand || ""}
                            onChange={(e) => setSelectedLaminateBrand(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded text-sm w-full"
                        >
                            <option value="">-- Choose Laminate Brand --</option>
                            {laminateBrandOptions.length > 0 ?
                                <>
                                    {laminateBrandOptions.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </>
                                : <>
                                  
                                    <option value="" disabled className="text-gray-400">
                                        No Laminate brand options available. Create it in the Rate config.
                                    </option>
                                </>
                            }
                        </select>
                      
                    </div> */}

                    <div className="max-w-[40%]">
                        <label className="font-medium text-gray-700">Select Common Laminate Brand:</label>

                        <SearchSelect
                            options={laminateBrandOptions}
                            placeholder="-- Choose Laminate Brand --"
                            searchPlaceholder="Search laminate brands..."
                            onSelect={setSelectedLaminateBrand}
                            selectedValue={selectedLaminateBrand || ""}
                            className="mt-1"
                        />

                        {/* {laminateBrandOptions.length === 0 && (
                            <div className="text-gray-500 text-sm mt-1">
                                No Laminate brand options available. Create it in the Rate config.
                            </div>
                        )} */}

                    </div>



                    {/* <div className="flex justify-center items-center h-screen bg-gray-100">
                        <SelectSearch options={options} onSelect={handleSelect} />
                    </div>


                    <div className="flex justify-center items-center h-screen bg-gray-100">
                        <SearchSelect
                            options={options}
                            placeholder="Select a fruit..."
                            searchPlaceholder="Search fruits..."
                            onSelect={handleSelect}
                            selectedValue={selectedOption?.value}
                            className="mb-4"
                        />
                    </div> */}

                </div>
            </header>


            {/* {selectedBrand && brandRatesByName[selectedBrand]?.length > 0 && (
                <div className="mt-6 border border-gray-200 bg-white rounded-md shadow-sm p-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Available Thickness & Rates for <span className="text-blue-600">{selectedBrand}</span>
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border border-gray-100">
                            <thead className="bg-blue-50 text-xs text-gray-600 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-2 border-r">Thickness</th>
                                    <th className="px-4 py-2">Rate (₹/sqft)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brandRatesByName[selectedBrand].map((item, i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="px-4 py-2 border-r text-gray-700 font-medium">
                                            {item.thickness}
                                        </td>
                                        <td className="px-4 py-2 text-green-800 font-bold">
                                            ₹{item.rs.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {selectedLaminateBrand && laminateRatesByBrand[selectedLaminateBrand]?.length > 0 && (
                <div className="mt-4 border bg-white rounded-md shadow-sm p-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Laminate Rates for <span className="text-blue-600">{selectedLaminateBrand}</span>
                    </h3>
                    <table className="min-w-full text-sm border">
                        <thead className="bg-blue-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-2 border-r">Thickness</th>
                                <th className="px-4 py-2">Rate (₹/sqft)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {laminateRatesByBrand[selectedLaminateBrand].map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2 border-r font-medium">{item.thickness}</td>
                                    <td className="px-4 py-2 text-green-800 font-bold">₹{item.rs.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )} */}

            {quoteLoading || loadingBrands ? (
                <MaterialOverviewLoading />
            ) : (
                <>
                    {/* {selectedBrand ? ( */}
                    <>
                        <div className="space-y-6">
                            {furnitures.map((furniture, index) => (
                                <FurnitureQuoteVariantForm
                                    key={index}
                                    index={index}
                                    data={furniture}
                                    ref={furnitureRefs.current[index] as React.RefObject<FurnitureQuoteRef>} // 🔄 Pass the ref down
                                    // selectedBrandRates={selectedBrand ? brandRatesByName[selectedBrand] || [] : []}
                                    // selectedLaminateRates={selectedLaminateBrand ? laminateRatesByBrand[selectedLaminateBrand] || [] : []}
                                    laminateRatesByBrand={laminateRatesByBrand}
                                    brandRatesByName={brandRatesByName}
                                    selectedBrand={selectedBrand}
                                    selectedLaminateBrand={selectedLaminateBrand}
                                    brandOptions={brandOptions}
                                    laminateBrandOptions={laminateBrandOptions}
                                    onFurnitureChange={updateGrandTotal}
                                />
                            ))}

                            <div className="mt-10 text-right">
                                <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
                                    <p className="text-md font-medium text-gray-700 mb-1">
                                        Total Estimate
                                    </p>
                                    {/* <p className="text-2xl font-bold text-green-700">
                                        ₹{calculatedVariantGrandTotal().toLocaleString("en-IN")}
                                    </p> */}

                                    <p className="text-2xl font-bold text-green-700">
                                        ₹{grandTotal.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                    {/* ) : 
                    (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border rounded-md shadow-sm mt-6">
                            <i className="fas fa-cubes text-blue-300 text-6xl mb-4" />

                            <h2 className="text-xl font-semibold text-blue-700">
                                No Brand Selected
                            </h2>

                            <p className="text-sm text-gray-500 mt-2 max-w-md">
                                Please <strong className="text-gray-600">select a brand</strong>  from the dropdown above to view quote details, pricing, and breakdown.
                            </p>
                        </div>
                    )
                    } */}

                </>
            )}
        </div>
    );
};

export default QuoteGenerateVariantSub;

