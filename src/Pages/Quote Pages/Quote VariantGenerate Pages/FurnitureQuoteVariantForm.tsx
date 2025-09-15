// import React from "react";
// import { RATES, type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import { NO_IMAGE } from "../../../constants/constants";
// import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";

// type Props = {
//   index: number;
//   data: FurnitureBlock;
//   selectedBrandRates: {
//     thickness: string;
//     rs: number;
//   }[];
//   selectedLaminateRates: { thickness: string; rs: number }[]; // ✅ new
//   selectedBrand: string | null;
//   selectedLaminateBrand: string | null;
// };

// const FurnitureQuoteVariantForm: React.FC<Props> = ({ data, index, selectedBrandRates, selectedLaminateRates, selectedBrand, selectedLaminateBrand }) => {


//   // START OF LAMINATE
//   const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
//     const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

//     const matched = list.find((item) =>
//       String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
//     );


//     // console.log("🔍  rrrr Input thickness:", thicknessStr);
//     // console.log("📦 rrrr Available rates:", list);
//     // console.log("✅ rrrr Matched:", matched);


//     // return matched?.rs || type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
//     return (matched?.rs !== undefined)
//   ? matched.rs
//   : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
//   };
//   // END OF LAMINATE

//   // UNCOMMENT THIS IF YOURE NOT GOING TO USE THE LAMINATE 
//   // const calculateRowTotal = (row: CoreMaterialRow) => {
//   //   const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates);

//   //   // UNCOMMENT THIS AND USE THIS IF YOU REMOVE THE LAMINATION
//   //   // const lamiRate = getRateForThickness(row.laminateNos.thickness);

//   //   // START OF LAMINATE
//   //   const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates);
//   //   // END OF LAMINATE

//   //   const plyCost = row.plywoodNos.quantity * plyRate * 32;
//   //   const lamiCost = row.laminateNos.quantity * lamiRate * 32;
//   //   return Math.round(plyCost + lamiCost);
//   // };



//   const calculateRowTotal = (row: CoreMaterialRow): number => {
//     // ✅ If no selectedBrand or selectedLaminateBrand → use prefilled rowTotal
//     const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

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
//     console.log("plyCost", plyCost)
//     console.log("lamiCost", lamiCost)
//     const baseMaterialCost = plyCost + lamiCost;
//     console.log("baseMaterialCost", baseMaterialCost)
//     const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
//     console.log("profitOnMaterial", profitOnMaterial)
//     const labourCost = row.carpenters * row.days * RATES.labour; // ✅ use 2000 base
//     console.log("labour cost", labourCost)
//     const profitOnLabour = labourCost * (row.profitOnLabour / 100);
//     console.log("profiit on labour", profitOnLabour)

//     const total = baseMaterialCost + profitOnMaterial + labourCost + profitOnLabour;

//     return Math.round(total);
//   };


//   const calculateSimpleRowTotal = (row: SimpleItemRow) => {
//     return row.quantity * row.cost;
//   };


//   const coreTotal = data.coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row), 0);
//   const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const gluesTotal = data.glues.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const nbmsTotal = data.nonBrandMaterials.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

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
//             {(data.coreMaterials.length > 0
//               ? data.coreMaterials
//               : [defaultEmptyCoreRow()]
//             ).map((row, i) => {
//               const rowTotal = calculateRowTotal(row);
//               return (
//                 <tr key={i} className="group border">
//                   <td className="text-center border-r-1 p-2">{row?.imageUrl ? <img src={row?.imageUrl || NO_IMAGE} className="h-10 mx-auto" /> : <>—</>}</td>
//                   <td className="text-center border-r-1 p-2">{row?.itemName || "—"}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.thickness ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.thickness ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.carpenters || 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.days || 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.profitOnMaterial || 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
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

//   const renderSimpleSection = (
//     sectionTitle: string,
//     rows: SimpleItemRow[],
//   ) => (
//     <div className="mt-4">
//       <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}</h3>
//       <table className="min-w-full text-sm bg-white shadow-sm">
//         <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//           <tr>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {(rows.length > 0 ? rows : [defaultEmptySimpleRow()]).map((item, i) => (
//             <tr key={i} className="border-b">
//               <td className="text-center border p-2">{item?.itemName || "—"}</td>
//               <td className="text-center border p-2">{item?.description || "—"}</td>
//               <td className="text-center border p-2">{item?.quantity || 0}</td>
//               <td className="text-center border p-2">{item?.cost || 0}</td>
//               <td className="text-center border p-2 text-green-700 font-bold">₹{calculateSimpleRowTotal(item).toLocaleString("en-IN")}</td>
//               <td className="text-center border p-2">—</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   const defaultEmptyCoreRow = (): CoreMaterialRow => ({
//     itemName: "",
//     plywoodNos: { quantity: 0, thickness: 0 },
//     laminateNos: { quantity: 0, thickness: 0 },
//     carpenters: 0,
//     days: 0,
//     profitOnMaterial: 0,
//     profitOnLabour: 0,
//     remarks: "",
//     rowTotal: 0,
//     imageUrl: undefined,
//     previewUrl: "",
//   });

//   const defaultEmptySimpleRow = (): SimpleItemRow => ({
//     itemName: "",
//     description: "",
//     quantity: 0,
//     cost: 0,
//     rowTotal: 0,
//   });

//   return (
//     <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
//       <div className=" flex justify-between items-center">
//         <h2 className="text-xl font-semibold  text-blue-600">
//           Product {index + 1}: {data.furnitureName}
//         </h2>

//         <div className="text-right text-xl font-bold text-green-700">
//           Product Total: ₹{furnitureTotal.toLocaleString("en-IN")}
//         </div>
//       </div>

//       {renderCoreMaterials()}
//       {renderSimpleSection("Fittings & Accessories", data.fittingsAndAccessories)}
//       {renderSimpleSection("Glues", data.glues)}
//       {renderSimpleSection("Non-Branded Materials", data.nonBrandMaterials)}


//     </div>
//   );
// };

// export default FurnitureQuoteVariantForm;


import React, { useEffect, useState } from "react";
import {  RATES, type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import { NO_IMAGE } from "../../../constants/constants";
import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";

type Props = {
  index: number;
  data: FurnitureBlock;
  // selectedBrandRates: {
  //   thickness: string;
  //   rs: number;
  // }[];
  // selectedLaminateRates: { thickness: string; rs: number }[]; // ✅ new
  selectedBrand: string | null;
  selectedLaminateBrand: string | null;

  brandOptions:  string[],
  laminateBrandOptions: string[]


  laminateRatesByBrand: Record<string, {
    thickness: string;
    rs: number;
}[]>

brandRatesByName: Record<string, {
    thickness: string;
    rs: number;
}[]>

};

const FurnitureQuoteVariantForm: React.FC<Props> = ({ data, index, brandOptions, laminateBrandOptions, laminateRatesByBrand, brandRatesByName,  selectedBrand, selectedLaminateBrand }) => {

 const selectedBrandRates=selectedBrand ? brandRatesByName[selectedBrand] || [] : []
  const selectedLaminateRates=selectedLaminateBrand ? laminateRatesByBrand[selectedLaminateBrand] || [] : []
                                    
  const [coreSelectedBrand, setCoreSelectedBrand] = useState<string | null>(null);
  const [coreSelectedLaminateBrand, setCoreSelectedLaminateBrand] = useState<string | null>(null); 




  useEffect(() => {
          if (selectedBrand) {
              setCoreSelectedBrand(selectedBrand);
          }
      }, [selectedBrand]);
  
  
  
      // START OF LAMINATE
      useEffect(() => {
          if (selectedLaminateBrand) {
              setCoreSelectedLaminateBrand(selectedLaminateBrand);
          }
      }, [selectedLaminateBrand]);
  

      
  useEffect(() => {
          if (!coreSelectedBrand && brandOptions?.length > 0) {
              setCoreSelectedBrand(brandOptions[0]);
          }
      }, [brandOptions]);
  
  
  
      // START OF LAMINATE
      useEffect(() => {
          if (!coreSelectedLaminateBrand && laminateBrandOptions?.length > 0) {
              setCoreSelectedLaminateBrand(laminateBrandOptions[0]);
          }
      }, [laminateBrandOptions]);
  


  // START OF LAMINATE
  const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
    const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

    const matched = list.find((item) =>
      String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
    );


    // console.log("🔍  rrrr Input thickness:", thicknessStr);
    // console.log("📦 rrrr Available rates:", list);
    // console.log("✅ rrrr Matched:", matched);


    // return matched?.rs || type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
    return (matched?.rs !== undefined)
  ? matched.rs
  : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
  };
 

  const calculateRowTotal = (row: CoreMaterialRow, coreRows:CoreMaterialRow[]): number => {
    // ✅ If no selectedBrand or selectedLaminateBrand → use prefilled rowTotal
    const noBrandSelected = !coreSelectedLaminateBrand && !coreSelectedLaminateBrand;

    if (noBrandSelected) {
      return row.rowTotal || 0;
    }

    // ✅ Otherwise, calculate using selected brand rates
    const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates, "plywood");
    const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates, "laminate");

    console.log("ply Rate", plyRate)
    console.log("lami Rate", lamiRate)

    const SHEET_SQFT = 32;

    const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
    const lamiCost = row.laminateNos.quantity * (lamiRate * SHEET_SQFT);
    console.log("plyCost", plyCost)
    console.log("lamiCost", lamiCost)
    const baseMaterialCost = plyCost + lamiCost;
    console.log("baseMaterialCost", baseMaterialCost)
    const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
    console.log("profitOnMaterial", profitOnMaterial)


    // const labourCost = row.carpenters * row.days * RATES.labour; // ✅ use 2000 base
    // console.log("labour cost", labourCost)
    // const profitOnLabour = labourCost * (row.profitOnLabour / 100);
    // console.log("profiit on labour", profitOnLabour)


    const totalRows = coreRows.length;

    const base = coreRows[0];
    const totalLabourCost = base.carpenters * base.days * RATES.labour;
    const labourWithProfit = totalLabourCost * (1 + (base.profitOnLabour || 0) / 100);
    const labourPerRow = labourWithProfit / totalRows;

    // console.log("totalLabourCost",totalLabourCost)
    // console.log("labourWithProfit",labourWithProfit)
    // console.log("labourPerRow",labourPerRow)


    const total = baseMaterialCost + profitOnMaterial + labourPerRow;
    // console.log("totla", total)

    return Math.round(total);
  };

// const handleCoreChange = (rowIndex: number, key: keyof CoreMaterialRow, value: any) => {
//     const updated: any = [...data.coreMaterials];

//     if (key === "imageUrl") {
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

//     const updatedRows = calculateCoreMaterialCosts(updated);

//     const updatedFurniture: FurnitureBlock = {
//       ...data,
//       coreMaterials: updatedRows,
//     };

//     updatedFurniture.totals = computeTotals(updatedFurniture);
//     updateFurniture?.(updatedFurniture);
//   };



  const calculateSimpleRowTotal = (row: SimpleItemRow, ) => {
    return row.quantity * row.cost;
  };

  
  const calculateGlueRowTotal = (row: SimpleItemRow) => {
    return row.cost;
  };

  const coreTotal = data.coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row, data.coreMaterials), 0);
  const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
  const gluesTotal = data.glues.reduce((sum, r) => sum + calculateGlueRowTotal(r), 0);
  const nbmsTotal = data.nonBrandMaterials.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
  const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

  const renderCoreMaterials = () => (
    <div className="mt-6">
      <h3 className="font-semibold text-md text-gray-800 mb-2">
        Core Materials (Total: ₹{coreTotal.toLocaleString("en-IN")})
      </h3>
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full text-sm bg-white shadow-sm">
          <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
            <tr>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Plywood</th>
              <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Laminate</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Carpenters / Day</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Material</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Labour</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            <tr>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
            </tr>
          </thead>
          <tbody>
            {data?.coreMaterials?.length > 0 && data?.coreMaterials?.map((row, i) => {
              const rowTotal = calculateRowTotal(row, data.coreMaterials);
              return (
                <tr key={i} className="group border">
                    {i === 0 && (
                  <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.imageUrl ? <img src={row?.imageUrl || NO_IMAGE} className="h-10 mx-auto" /> : <>—</>}</td>
                  )}
                  <td className="text-center border-r-1 p-2">{row?.itemName || "—"}</td>
                  <td className="text-center border-r-1 p-2">{row?.plywoodNos?.quantity ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.plywoodNos?.thickness ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.laminateNos?.quantity ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.laminateNos?.thickness ?? 0}</td>
                   {i === 0 && (<>
                   
                  <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.carpenters || 0}</td>
                  <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.days || 0}</td>
                   </>
                  )}
                  
                  <td className="text-center border-r-1 p-2">{row?.profitOnMaterial || 0}</td>
                   {i === 0 && (
                  <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
                  )}

                  <td className="text-center border-r-1 p-2">{row?.remarks || "—"}</td>
                  <td className="text-center border-r-1 p-2 text-green-700 font-bold">₹{rowTotal?.toLocaleString("en-IN")}</td>
                  <td className="text-center border-r-1 p-2">—</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );


  const sectionTotal = (sectionTitle: "Fittings & Accessories" | "Glues" | "Non-Branded Materials" | string)=>{
    if(sectionTitle === "Fittings & Accessories"){
      return fittingsTotal
    }
    else if(sectionTitle === "Glues"){
return gluesTotal
    }
    else if(sectionTitle === "Non-Branded Materials"){
return nbmsTotal
    }
    return 0
  }

  const renderSimpleSection = (
    sectionTitle: string,
    rows: SimpleItemRow[],
  ) => (
    <div className="mt-4">
      <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}

        (Total: ₹{sectionTotal(sectionTitle).toLocaleString("en-IN")})
      </h3>
      <table className="min-w-full text-sm bg-white shadow-sm">
        <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
          <tr>
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 && rows.map((item, i) => (
            <tr key={i} className="border-b">
              <td className="text-center border p-2">{item?.itemName || "—"}</td>
              <td className="text-center border p-2">{item?.description || "—"}</td>
              <td className="text-center border p-2">{item?.quantity || 0}</td>
              <td className="text-center border p-2">{item?.cost || 0}</td>
              {sectionTitle === "Fittings & Accessories" || sectionTitle ===  "Non-Branded Materials" ?
                <td className="text-center border p-2 text-green-700 font-bold">₹{calculateSimpleRowTotal(item).toLocaleString("en-IN")}</td>
              : 
                <td className="text-center border p-2 text-green-700 font-bold">₹{calculateGlueRowTotal(item).toLocaleString("en-IN")}</td>
              }
              <td className="text-center border p-2">—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
      <div className=" flex justify-between items-center">
        <h2 className="text-xl font-semibold  text-blue-600">
          Product {index + 1}: {data.furnitureName}
        </h2>

        <div className="text-right text-xl font-bold text-green-700">
          Product Total: ₹{furnitureTotal.toLocaleString("en-IN")}
        </div>
      </div>
<div>
   <div
                    // className={`border-2 max-w-[40%]`}
                    >
                        <label className="font-medium text-gray-700">Select plywood Brand:</label>
                        <select
                            value={coreSelectedBrand || ""}
                            onChange={(e) => setCoreSelectedBrand(e.target.value)}
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
                        
                    </div>


                        <div
                    // className={`border-2 max-w-[40%]`}
                    >
                        <label className="font-medium text-gray-700">Select Laminate Brand:</label>
                        <select
                            value={coreSelectedLaminateBrand || ""}
                            onChange={(e) => setCoreSelectedLaminateBrand(e.target.value)}
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
                                    {/* <div>
                                no Laminate brand options available , create it in the Rate config
                            </div> */}
                                    <option value="" disabled className="text-gray-400">
                                        No Laminate brand options available. Create it in the Rate config.
                                    </option>
                                </>
                            }
                        </select>
                      
                    </div>


                    <div>
                       {coreSelectedBrand && brandRatesByName[coreSelectedBrand]?.length > 0 && (
                <div className="mt-6 border border-gray-200 bg-white rounded-md shadow-sm p-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Available Thickness & Rates for <span className="text-blue-600">{coreSelectedBrand}</span>
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
                                {brandRatesByName[coreSelectedBrand].map((item, i) => (
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


            {/* START OF LAMINATE */}
            {coreSelectedLaminateBrand && laminateRatesByBrand[coreSelectedLaminateBrand]?.length > 0 && (
                <div className="mt-4 border bg-white rounded-md shadow-sm p-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Laminate Rates for <span className="text-blue-600">{coreSelectedLaminateBrand}</span>
                    </h3>
                    <table className="min-w-full text-sm border">
                        <thead className="bg-blue-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-2 border-r">Thickness</th>
                                <th className="px-4 py-2">Rate (₹/sqft)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {laminateRatesByBrand[coreSelectedLaminateBrand].map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2 border-r font-medium">{item.thickness}</td>
                                    <td className="px-4 py-2 text-green-800 font-bold">₹{item.rs.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
                    </div>
</div>
      {renderCoreMaterials()}
      {renderSimpleSection("Fittings & Accessories", data.fittingsAndAccessories)}
      {renderSimpleSection("Glues", data.glues)}
      {renderSimpleSection("Non-Branded Materials", data.nonBrandMaterials)}


    </div>
  );
};

export default FurnitureQuoteVariantForm;





// // SECOND VERSION

// import React from "react";
// import { RATES, type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import { NO_IMAGE } from "../../../constants/constants";
// import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";
// type Props = {
//   index: number;
//   data: FurnitureBlock;

//   applyPlywoodToAll: boolean;
//   applyLaminateToAll: boolean;

//   selectedBrand: string | null;
//   selectedLaminateBrand: string | null;

//   brandRatesMap: Record<string, { thickness: string; rs: number }[]>;
//   laminateRatesMap: Record<string, { thickness: string; rs: number }[]>;
// };

// const calculateCoreRowTotals = (
//   rows: CoreMaterialRow[],
//   brandRatesMap: Record<string, { thickness: string; rs: number }[]>,
//   laminateRatesMap: Record<string, { thickness: string; rs: number }[]>,
//   plywoodBrand: string | null,
//   laminateBrand: string | null,
//   applyPlywoodToAll: boolean,
//   applyLaminateToAll: boolean
// ): CoreMaterialRow[] => {
//   if (!rows.length) return [];

//   const SHEET_SQFT = 32;
//   const baseRow = rows[0];

//   const totalRows = rows.length;
//   const sharedLabour = baseRow.carpenters * baseRow.days * RATES.labour;
//   const profitOnLabour = sharedLabour * (baseRow.profitOnLabour / 100 || 0);
//   const labourPerRow = (sharedLabour + profitOnLabour) / totalRows;

//   const normalize = (v: any) => String(v).replace(/mm/gi, "").trim().toLowerCase();

//   const getRate = (
//     brand: string | null,
//     thickness: string | number,
//     type: "plywood" | "laminate"
//   ) => {
//     const source = type === "plywood" ? brandRatesMap : laminateRatesMap;
//     if (!brand) return type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;

//     const matched = source[brand]?.find(
//       (rate) => normalize(rate.thickness) === normalize(thickness)
//     );
//     return matched?.rs ?? (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
//   };

//   return rows.map((row) => {
//     const plyBrandToUse = applyPlywoodToAll ? plywoodBrand : row.plywoodBrand;
//     const lamiBrandToUse = applyLaminateToAll ? laminateBrand : row.laminateBrand;

//     const plyRate = getRate(plyBrandToUse ?? "", row.plywoodNos.thickness, "plywood");
//     const lamiRate = getRate(lamiBrandToUse ?? "", row.laminateNos.thickness, "laminate");

//     const plyCost = row.plywoodNos.quantity * plyRate * SHEET_SQFT;
//     const lamiCost = row.laminateNos.quantity * lamiRate * SHEET_SQFT;

//     const materialCost = plyCost + lamiCost;
//     const profitOnMaterial = materialCost * (row.profitOnMaterial / 100 || 0);

//     const rowTotal = Math.round(materialCost + profitOnMaterial + labourPerRow);

//     return {
//       ...row,
//       rowTotal,
//     };
//   });
// };

// const FurnitureQuoteVariantForm: React.FC<Props> = ({ index, data, selectedBrand,
// selectedLaminateBrand,
// applyPlywoodToAll,
// applyLaminateToAll,
// brandRatesMap,
// laminateRatesMap }) => {


//   // START OF LAMINATE
//   const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
//     const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

//     const matched = list.find((item) =>
//       String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
//     );


//     // console.log("🔍  rrrr Input thickness:", thicknessStr);
//     // console.log("📦 rrrr Available rates:", list);
//     // console.log("✅ rrrr Matched:", matched);


//     // return matched?.rs || type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
//     return (matched?.rs !== undefined)
//       ? matched.rs
//       : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
//   };
//   // END OF LAMINATE




//   // const calculateRowTotal = (row: CoreMaterialRow): number => {
//   //   // ✅ If no selectedBrand or selectedLaminateBrand → use prefilled rowTotal
//   //   const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

//   //   if (noBrandSelected) {
//   //     return row.rowTotal || 0;
//   //   }

//   //   // ✅ Otherwise, calculate using selected brand rates
//   //   const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates, "plywood");
//   //   const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates, "laminate");

//   //   console.log("ply Rate", plyRate)
//   //   console.log("lami Rate", lamiRate)

//   //   const SHEET_SQFT = 32;

//   //   const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
//   //   const lamiCost = row.laminateNos.quantity * (lamiRate * SHEET_SQFT);
//   //   console.log("plyCost", plyCost)
//   //   console.log("lamiCost", lamiCost)
//   //   const baseMaterialCost = plyCost + lamiCost;
//   //   console.log("baseMaterialCost", baseMaterialCost)
//   //   const profitOnMaterial = baseMaterialCost * (row.profitOnMaterial / 100);
//   //   console.log("profitOnMaterial", profitOnMaterial)
//   //   const labourCost = row.carpenters * row.days * RATES.labour; // ✅ use 2000 base
//   //   console.log("labour cost", labourCost)
//   //   const profitOnLabour = labourCost * (row.profitOnLabour / 100);
//   //   console.log("profiit on labour", profitOnLabour)

//   //   const total = baseMaterialCost + profitOnMaterial + labourCost + profitOnLabour;

//   //   return Math.round(total);
//   // };


//     const SHEET_SQFT = 32;

//     // const calculateCoreRowTotals = (
//     //   rows: CoreMaterialRow[],
//     //   selectedBrandRates: Record<string, { thickness: string; rs: number }[]>,
//     //   selectedLaminateRates: Record<string, { thickness: string; rs: number }[]>,
//     //   selectedBrand: string | null,
//     //   selectedLaminateBrand: string | null
//     // ): CoreMaterialRow[] => {
//     //   if (rows.length === 0) return [];

//     //   const totalRows = rows.length;

//     //   const baseRow = rows[0]; // first row with shared labour props
//     //   const baseLabour = baseRow.carpenters * baseRow.days * RATES.labour;
//     //   const profitOnLabour = baseLabour * (baseRow.profitOnLabour || 0) / 100;
//     //   const totalLabour = baseLabour + profitOnLabour;
//     //   const labourPerRow = totalLabour / totalRows;

//     //   const normalize = (val: string | number) =>
//     //     String(val).replace(/mm/gi, "").replace(/\s+/g, "").trim().toLowerCase();

//     //   const getRate = (
//     //     list: Record<string, { thickness: string; rs: number }[]>,
//     //     brand: string | null,
//     //     thickness: number | string,
//     //     type: "plywood" | "laminate"
//     //   ): number => {
//     //     if (!brand) return type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
//     //     const thicknessStr = normalize(thickness);
//     //     const rateObj = list[brand]?.find(
//     //       (item) => normalize(item.thickness) === thicknessStr
//     //     );
//     //     return rateObj?.rs ?? (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
//     //   };

//     //   return rows.map((row) => {
//     //     const plyRate = getRate(selectedBrandRates, selectedBrand, row.plywoodNos.thickness, "plywood");
//     //     const lamiRate = getRate(selectedLaminateRates, selectedLaminateBrand, row.laminateNos.thickness, "laminate");

//     //     const plyCost = row.plywoodNos.quantity * plyRate * SHEET_SQFT;
//     //     const lamiCost = row.laminateNos.quantity * lamiRate * SHEET_SQFT;

//     //     const materialCost = plyCost + lamiCost;
//     //     const profitOnMaterial = materialCost * (row.profitOnMaterial || 0) / 100;
//     //     const rowTotal = Math.round(materialCost + profitOnMaterial + labourPerRow);

//     //     return {
//     //       ...row,
//     //       rowTotal,
//     //     };
//     //   });
//     // };
  

//   const calculateSimpleRowTotal = (row: SimpleItemRow) => {
//     return row.quantity * row.cost;
//   };



// const updatedCoreMaterials = calculateCoreRowTotals(
//   data.coreMaterials,
//   brandRatesMap,
//   laminateRatesMap,
//   selectedBrand,
//   selectedLaminateBrand,
//   applyPlywoodToAll,
//   applyLaminateToAll
// );

// const coreTotal = updatedCoreMaterials.reduce((sum, row) => sum + row.rowTotal, 0);
// // ... compute others like fittings, glues, NBMs
//  const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const gluesTotal = data.glues.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const nbmsTotal = data.nonBrandMaterials.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
//   const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

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
//            {updatedCoreMaterials.map((row, i) => {
//              return (
//                 <tr key={i} className="group border">
//                   {i === 0 && (
//                   <td rowSpan={updatedCoreMaterials.length} className="text-center border-r-1 p-2">{row?.imageUrl ? <img src={row?.imageUrl || NO_IMAGE} className="h-10 mx-auto" /> : <>—</>}</td>
//                    )}
//                   <td className="text-center border-r-1 p-2">{row?.itemName || "—"}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.plywoodNos?.thickness ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.quantity ?? 0}</td>
//                   <td className="text-center border-r-1 p-2">{row?.laminateNos?.thickness ?? 0}</td>
//                   {i === 0 && ( <td rowSpan={updatedCoreMaterials.length} className="text-center border-r-1 p-2">{row?.carpenters || 0}</td>
//                   )}
//                  {i === 0 && (  <td rowSpan={updatedCoreMaterials.length} className="text-center border-r-1 p-2">{row?.days || 0}</td>
//                  )}
//                   <td className="text-center border-r-1 p-2">{row?.profitOnMaterial || 0}</td>
//                   {i === 0 && ( <td rowSpan={updatedCoreMaterials.length} className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
//                   )}
//                   <td className="text-center border-r-1 p-2">{row?.remarks || "—"}</td>
//                   <td className="text-center border-r-1 p-2 text-green-700 font-bold">₹{row.rowTotal?.toLocaleString("en-IN")}</td>
//                   <td className="text-center border-r-1 p-2">—</td>
//                 </tr>
//               );
//             }
//           )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderSimpleSection = (
//     sectionTitle: string,
//     rows: SimpleItemRow[],
//   ) => (
//     <div className="mt-4">
//       <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}</h3>
//       <table className="min-w-full text-sm bg-white shadow-sm">
//         <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
//           <tr>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
//             <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {(rows.length > 0 ? rows : [defaultEmptySimpleRow()]).map((item, i) => (
//             <tr key={i} className="border-b">
//               <td className="text-center border p-2">{item?.itemName || "—"}</td>
//               <td className="text-center border p-2">{item?.description || "—"}</td>
//               <td className="text-center border p-2">{item?.quantity || 0}</td>
//               <td className="text-center border p-2">{item?.cost || 0}</td>
//               <td className="text-center border p-2 text-green-700 font-bold">₹{calculateSimpleRowTotal(item).toLocaleString("en-IN")}</td>
//               <td className="text-center border p-2">—</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   const defaultEmptyCoreRow = (): CoreMaterialRow => ({
//     itemName: "",
//     plywoodNos: { quantity: 0, thickness: 0 },
//     laminateNos: { quantity: 0, thickness: 0 },
//     carpenters: 0,
//     days: 0,
//     profitOnMaterial: 0,
//     profitOnLabour: 0,
//     remarks: "",
//     rowTotal: 0,
//     imageUrl: undefined,
//     previewUrl: "",
//   });

//   const defaultEmptySimpleRow = (): SimpleItemRow => ({
//     itemName: "",
//     description: "",
//     quantity: 0,
//     cost: 0,
//     rowTotal: 0,
//   });

//   return (
//     <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
//       <div className=" flex justify-between items-center">
//         <h2 className="text-xl font-semibold  text-blue-600">
//           Product {index + 1}: {data.furnitureName}
//         </h2>

//         <div className="text-right text-xl font-bold text-green-700">
//           Product Total: ₹{furnitureTotal.toLocaleString("en-IN")}
//         </div>
//       </div>

//       {renderCoreMaterials()}
//       {renderSimpleSection("Fittings & Accessories", data.fittingsAndAccessories)}
//       {renderSimpleSection("Glues", data.glues)}
//       {renderSimpleSection("Non-Branded Materials", data.nonBrandMaterials)}


//     </div>
//   );
// };

// export default FurnitureQuoteVariantForm;



