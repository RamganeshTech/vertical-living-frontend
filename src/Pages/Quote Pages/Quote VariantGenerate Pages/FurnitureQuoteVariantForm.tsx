import React from "react";
import { RATES, type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import { NO_IMAGE } from "../../../constants/constants";
import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";

type Props = {
  index: number;
  data: FurnitureBlock;
  selectedBrandRates: {
    thickness: string;
    rs: number;
  }[];
  // START OF LAMINATE
  selectedLaminateRates: { thickness: string; rs: number }[]; // ✅ new
  selectedBrand: string | null;
  selectedLaminateBrand: string | null;
  // END OF LAMINATE
};

const FurnitureQuoteVariantForm: React.FC<Props> = ({ data, index, selectedBrandRates, selectedLaminateRates, selectedBrand, selectedLaminateBrand }) => {
  console.log("data", data)
  // UNCOMMENT THIS IF YOU REMOVE THE LAMINATE OPTION ONLY 
  // const getRateForThickness = (thickness: number | string): number => {
  //   const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

  //   const matched = selectedBrandRates.find((item) => {
  //     const normalized = String(item.thickness).toLowerCase().replace("mm", "").trim();
  //     return normalized === thicknessStr;
  //   });

  //   return matched?.rs || 0;
  // };

  // START OF LAMINATE
  const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
    const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

    const matched = list.find((item) =>
      String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
    );


    console.log("🔍  rrrr Input thickness:", thicknessStr);
    console.log("📦 rrrr Available rates:", list);
    console.log("✅ rrrr Matched:", matched);


    // return matched?.rs || type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0;
    return (matched?.rs !== undefined)
  ? matched.rs
  : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
  };
  // END OF LAMINATE

  // UNCOMMENT THIS IF YOURE NOT GOING TO USE THE LAMINATE 
  // const calculateRowTotal = (row: CoreMaterialRow) => {
  //   const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates);

  //   // UNCOMMENT THIS AND USE THIS IF YOU REMOVE THE LAMINATION
  //   // const lamiRate = getRateForThickness(row.laminateNos.thickness);

  //   // START OF LAMINATE
  //   const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates);
  //   // END OF LAMINATE

  //   const plyCost = row.plywoodNos.quantity * plyRate * 32;
  //   const lamiCost = row.laminateNos.quantity * lamiRate * 32;
  //   return Math.round(plyCost + lamiCost);
  // };



  const calculateRowTotal = (row: CoreMaterialRow): number => {
    // ✅ If no selectedBrand or selectedLaminateBrand → use prefilled rowTotal
    const noBrandSelected = !selectedBrand && !selectedLaminateBrand;

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
    const labourCost = row.carpenters * row.days * RATES.labour; // ✅ use 2000 base
    console.log("labour cost", labourCost)
    const profitOnLabour = labourCost * (row.profitOnLabour / 100);
    console.log("profiit on labour", profitOnLabour)

    const total = baseMaterialCost + profitOnMaterial + labourCost + profitOnLabour;

    return Math.round(total);
  };


  const calculateSimpleRowTotal = (row: SimpleItemRow) => {
    return row.quantity * row.cost;
  };

  const coreTotal = data.coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row), 0);
  const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
  const gluesTotal = data.glues.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
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
            {(data.coreMaterials.length > 0
              ? data.coreMaterials
              : [defaultEmptyCoreRow()]
            ).map((row, i) => {
              const rowTotal = calculateRowTotal(row);
              return (
                <tr key={i} className="group border">
                  <td className="text-center border-r-1 p-2">{row?.imageUrl ? <img src={row?.imageUrl || NO_IMAGE} className="h-10 mx-auto" /> : <>—</>}</td>
                  <td className="text-center border-r-1 p-2">{row?.itemName || "—"}</td>
                  <td className="text-center border-r-1 p-2">{row?.plywoodNos?.quantity ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.plywoodNos?.thickness ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.laminateNos?.quantity ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.laminateNos?.thickness ?? 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.carpenters || 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.days || 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.profitOnMaterial || 0}</td>
                  <td className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
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

  const renderSimpleSection = (
    sectionTitle: string,
    rows: SimpleItemRow[],
  ) => (
    <div className="mt-4">
      <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}</h3>
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
          {(rows.length > 0 ? rows : [defaultEmptySimpleRow()]).map((item, i) => (
            <tr key={i} className="border-b">
              <td className="text-center border p-2">{item?.itemName || "—"}</td>
              <td className="text-center border p-2">{item?.description || "—"}</td>
              <td className="text-center border p-2">{item?.quantity || 0}</td>
              <td className="text-center border p-2">{item?.cost || 0}</td>
              <td className="text-center border p-2 text-green-700 font-bold">₹{calculateSimpleRowTotal(item).toLocaleString("en-IN")}</td>
              <td className="text-center border p-2">—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const defaultEmptyCoreRow = (): CoreMaterialRow => ({
    itemName: "",
    plywoodNos: { quantity: 0, thickness: 0 },
    laminateNos: { quantity: 0, thickness: 0 },
    carpenters: 0,
    days: 0,
    profitOnMaterial: 0,
    profitOnLabour: 0,
    remarks: "",
    rowTotal: 0,
    imageUrl: undefined,
    previewUrl: "",
  });

  const defaultEmptySimpleRow = (): SimpleItemRow => ({
    itemName: "",
    description: "",
    quantity: 0,
    cost: 0,
    rowTotal: 0,
  });

  return (
    <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
      <div className=" flex justify-between items-center">
        <h2 className="text-xl font-semibold  text-blue-600">
          Furniture {index + 1}: {data.furnitureName}
        </h2>

        <div className="text-right text-xl font-bold text-green-700">
          Furniture Total: ₹{furnitureTotal.toLocaleString("en-IN")}
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