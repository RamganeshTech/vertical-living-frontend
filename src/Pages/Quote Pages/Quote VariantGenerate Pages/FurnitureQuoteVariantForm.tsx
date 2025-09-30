import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { type CoreMaterialRow, type FurnitureBlock, type SimpleItemRow } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import { NO_IMAGE } from "../../../constants/constants";
import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./QuoteGenerateVariantSub ";
import SearchSelect from "../../../components/ui/SearchSelect";

type Props = {
  index: number;
  data: FurnitureBlock;
  selectedBrand: string | null;
  selectedLaminateBrand: string | null;

  labourCost: number

  brandOptions: string[],
  laminateBrandOptions: string[]


  laminateRatesByBrand: Record<string, {
    thickness: string;
    rs: number;
  }[]>

  brandRatesByName: Record<string, {
    thickness: string;
    rs: number;
  }[]>

  onFurnitureChange: () => any
};


export type FurnitureQuoteRef = {
  getUpdatedFurniture: () => FurnitureBlock;
};


export const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
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


const FurnitureQuoteVariantForm = forwardRef<FurnitureQuoteRef, Props>(({
  data, index, brandOptions, laminateBrandOptions, laminateRatesByBrand, brandRatesByName, labourCost,
  selectedBrand, selectedLaminateBrand, onFurnitureChange }, ref) => {


  const [coreSelectedBrand, setCoreSelectedBrand] = useState<string | null>(null);
  const [coreSelectedLaminateBrand, setCoreSelectedLaminateBrand] = useState<string | null>(null);

  const selectedBrandRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : []
  const selectedLaminateRates = coreSelectedLaminateBrand ? laminateRatesByBrand[coreSelectedLaminateBrand] || [] : []

  const prevLaminateProp = useRef(selectedLaminateBrand);
  const prevPlywoodProp = useRef(selectedBrand);

  const [coreMaterials, setCoreMaterials] = useState<CoreMaterialRow[]>(data?.coreMaterials || []);
  const [fittings, setFittings] = useState(data?.fittingsAndAccessories || []);
  const [glues, setGlues] = useState(data?.glues || []);
  const [nbms, setNbms] = useState(data?.nonBrandMaterials || []);

  useEffect(() => {
    setCoreMaterials(data?.coreMaterials || []);
  }, [data?.coreMaterials]);

  useEffect(() => {
    if (prevPlywoodProp.current !== selectedBrand) {
      // ✅ parent changed → update local
      setCoreSelectedBrand(selectedBrand);
      prevPlywoodProp.current = selectedBrand;
    }
  }, [selectedBrand]);



  useEffect(() => {
    if (prevLaminateProp.current !== selectedLaminateBrand) {
      // ✅ parent changed → update local
      setCoreSelectedLaminateBrand(selectedLaminateBrand);
      prevLaminateProp.current = selectedLaminateBrand;
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



  const calculateFurnitureRawCost = () => {
    const SHEET_SQFT = 32;
    // const labourRate = 1300;

    let totalRawCost = 0;

    const selectedPlyRates = coreSelectedBrand ? brandRatesByName[coreSelectedBrand] || [] : [];
    const selectedLamRates = coreSelectedLaminateBrand ? laminateRatesByBrand[coreSelectedLaminateBrand] || [] : [];

    const coreRows = coreMaterials;
    const baseRow = coreRows[0];
    // const totalLabour = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourRate;
    const totalLabour = (baseRow?.carpenters || 0) * (baseRow?.days || 0) * labourCost;
    const labourPerRow = coreRows.length > 0 ? totalLabour / coreRows.length : 0;

    for (const row of coreRows) {
      const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedPlyRates, "plywood");
      const lamRate = getRateForThickness(row.laminateNos.thickness, selectedLamRates, "laminate");

      const plyCost = row.plywoodNos.quantity * SHEET_SQFT * plyRate;
      const lamCost = row.laminateNos.quantity * SHEET_SQFT * lamRate;

      totalRawCost += plyCost + lamCost + labourPerRow;
    }

    const getTotal = (row: SimpleItemRow) => (row.quantity || 0) * (row.cost || 0);
    const getGlueTotal = (row: SimpleItemRow) => row.cost || 0;

    const fittingsTotal = data.fittingsAndAccessories.reduce((acc, r) => acc + getTotal(r), 0);
    const glueTotal = data.glues.reduce((acc, r) => acc + getGlueTotal(r), 0);
    const nbmsTotal = data.nonBrandMaterials.reduce((acc, r) => acc + getTotal(r), 0);

    totalRawCost += fittingsTotal + glueTotal + nbmsTotal;

    return Math.round(totalRawCost);
  };


  // START OF LAMINATE



  const calculateRowTotal = (row: CoreMaterialRow, coreRows: CoreMaterialRow[]): number => {
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
    // changed for labour cost
    // const totalLabourCost = base.carpenters * base.days * RATES.labour;
    const totalLabourCost = base.carpenters * base.days * labourCost;
    const labourWithProfit = totalLabourCost * (1 + (base.profitOnLabour || 0) / 100);
    const labourPerRow = labourWithProfit / totalRows;

    // console.log("totalLabourCost",totalLabourCost)
    // console.log("labourWithProfit",labourWithProfit)
    // console.log("labourPerRow",labourPerRow)


    const total = baseMaterialCost + profitOnMaterial + labourPerRow;
    // console.log("totla", total)

    return Math.round(total);
  };

  // const calculateSimpleRowTotal = (row: SimpleItemRow,) => {
  //   return row.quantity * row.cost;
  // };


  // const calculateGlueRowTotal = (row: SimpleItemRow) => {
  //   return row.cost;
  // };

  const coreTotal = coreMaterials.reduce((sum, row) => sum + calculateRowTotal(row, coreMaterials), 0);
  // const fittingsTotal = data.fittingsAndAccessories.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
  // const gluesTotal = data.glues.reduce((sum, r) => sum + calculateGlueRowTotal(r), 0);
  // const nbmsTotal = data.nonBrandMaterials.reduce((sum, r) => sum + calculateSimpleRowTotal(r), 0);
  const fittingsTotal = fittings.reduce((sum, r) => {
    const base = (r.quantity || 0) * (r.cost || 0);
    const profit = base * ((r.profitOnMaterial || 0) / 100);
    return sum + base + profit;
  }, 0);

  const gluesTotal = glues.reduce((sum, r) => {
    const base = r.cost || 0;
    const profit = base * ((r.profitOnMaterial || 0) / 100);
    return sum + base + profit;
  }, 0);

  const nbmsTotal = nbms.reduce((sum, r) => {
    const base = (r.quantity || 0) * (r.cost || 0);
    const profit = base * ((r.profitOnMaterial || 0) / 100);
    return sum + base + profit;
  }, 0);
  const furnitureTotal = coreTotal + fittingsTotal + gluesTotal + nbmsTotal;

  useImperativeHandle(ref, () => ({
    getUpdatedFurniture: () => {


      const updatedCoreMaterials = coreMaterials.map(row => ({
        ...row,
        rowTotal: calculateRowTotal(row, coreMaterials), // ✅ fresh calc
      }));


      const updatedFittings = [...fittings];
      const updatedGlues = [...glues];
      const updatedNbms = [...nbms];

      // 👇 Totals for calculations ONLY (numbers)
      const fittingsTotalLocal = updatedFittings.reduce((sum, r) => {
        const base = (r.quantity || 0) * (r.cost || 0);
        const profit = base * ((r.profitOnMaterial || 0) / 100);
        return sum + base + profit;
      }, 0);

      const gluesTotalLocal = updatedGlues.reduce((sum, r) => {
        const base = r.cost || 0;
        const profit = base * ((r.profitOnMaterial || 0) / 100);
        return sum + base + profit;
      }, 0);

      const nbmsTotalLocal = updatedNbms.reduce((sum, r) => {
        const base = (r.quantity || 0) * (r.cost || 0);
        const profit = base * ((r.profitOnMaterial || 0) / 100);
        return sum + base + profit;
      }, 0);

      const coreTotalLocal = updatedCoreMaterials.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
      // const fittingsTotalLocal = data.fittingsAndAccessories.reduce((sum, r) => sum + (r.quantity || 0) * (r.cost || 0), 0);
      // const gluesTotalLocal = data.glues.reduce((sum, r) => sum + (r.cost || 0), 0);
      // const nbmsTotalLocal = data.nonBrandMaterials.reduce((sum, r) => sum + (r.quantity || 0) * (r.cost || 0), 0);

      const furnitureTotalLocal = coreTotalLocal + fittingsTotalLocal + gluesTotalLocal + nbmsTotalLocal;

      return {
        furnitureName: data.furnitureName, // Original data (with ids etc)

        plywoodBrand: coreSelectedBrand,
        laminateBrand: coreSelectedLaminateBrand,

        coreMaterials: coreMaterials.map(row => ({
          ...row,
          rowTotal: calculateRowTotal(row, coreMaterials),
        })),
        // fittingsAndAccessories: data.fittingsAndAccessories, // ✅ make sure you track this in child state
        // glues: data.glues,                                   // ✅ child state or empty []
        // nonBrandMaterials: data.nonBrandMaterials,           // ✅ child state or empty []
        fittingsAndAccessories: updatedFittings,
        glues: updatedGlues,
        nonBrandMaterials: updatedNbms,


        // coreMaterialsTotal: coreTotal,
        // fittingsAndAccessoriesTotal: fittingsTotal,
        // gluesTotal,
        // nonBrandMaterialsTotal: nbmsTotal,
        // furnitureTotal,

        // totals: {
        //   core: coreTotal,
        //   fittings: fittingsTotal,
        //   glues: gluesTotal,
        //   nbms: nbmsTotal,
        //   furnitureTotal,
        // },


        coreMaterialsTotal: coreTotalLocal,
        fittingsAndAccessoriesTotal: fittingsTotalLocal,
        gluesTotal: gluesTotalLocal,
        nonBrandMaterialsTotal: nbmsTotalLocal,
        furnitureTotal: furnitureTotalLocal,

        totals: {
          core: coreTotalLocal,
          fittings: fittingsTotalLocal,
          glues: gluesTotalLocal,
          nbms: nbmsTotalLocal,
          furnitureTotal: furnitureTotalLocal,
        },
      }

    }
  }));



  const handleProfitMaterialChange = (rowIndex: number, newProfit: number) => {
    const updated = [...coreMaterials];
    updated[rowIndex] = { ...updated[rowIndex], profitOnMaterial: (newProfit || 0) };
    setCoreMaterials(updated);


    // ✅ ONLY TRIGGER INHERIT IF 0-th ROW IS BEING CHANGED
    if (rowIndex !== 0) {
      onFurnitureChange?.();
      return; // 🚫 Do NOT proceed to sync
    }

    const inheritedProfit = newProfit;

    const recalculateSimpleRows = (
      rows: SimpleItemRow[],
      isGlue: boolean = false
    ): SimpleItemRow[] => {
      return rows.map((item) => {
        // if (item.wasManuallyEdited) return item; // skip manually changed
        const base = isGlue
          ? item.cost || 0
          : (item.quantity || 0) * (item.cost || 0);
        const profit = base * ((inheritedProfit || 0) / 100);
        return {
          ...item,
          profitOnMaterial: inheritedProfit,
          rowTotal: Math.round(base + profit),
        };
      });
    };

    setFittings((prev) => recalculateSimpleRows(prev));
    setGlues((prev) => recalculateSimpleRows(prev, true));
    setNbms((prev) => recalculateSimpleRows(prev));


    onFurnitureChange?.(); // trigger parent recalculation
  };


  const handleProfitLabourChange = (newProfit: number) => {
    if (!coreMaterials[0]) return;
    const updated = [...coreMaterials];
    updated[0] = { ...updated[0], profitOnLabour: (newProfit || 0) };
    setCoreMaterials(updated);
    onFurnitureChange?.(); // trigger parent recalculation
  };


  // const handleProfitChangeInSimpleRow = (section: string, index: number, newProfit: number) => {
  //   if (section === "Fittings & Accessories") {
  //     const updated = [...fittings];
  //     updated[index] = {
  //       ...updated[index],
  //       profitOnMaterial: newProfit || 0,
  //     };
  //     setFittings(updated);
  //   }

  //   if (section === "Glues") {
  //     const updated = [...glues];
  //     updated[index] = {
  //       ...updated[index],
  //       profitOnMaterial: newProfit || 0,
  //     };
  //     setGlues(updated);
  //   }

  //   if (section === "Non-Branded Materials") {
  //     const updated = [...nbms];
  //     updated[index] = {
  //       ...updated[index],
  //       profitOnMaterial: newProfit || 0,
  //     };
  //     setNbms(updated);
  //   }

  //   onFurnitureChange?.();
  // };

  const handleProfitChangeInSimpleRow = (section: string, index: number, newProfit: number) => {
    if (section === "Fittings & Accessories") {
      const updated = [...fittings];
      const base = (updated[index].quantity || 0) * (updated[index].cost || 0);
      const profit = base * ((newProfit || 0) / 100);
      updated[index] = {
        ...updated[index],
        // wasManuallyEdited: true,
        profitOnMaterial: newProfit,
        rowTotal: Math.round(base + profit),
      };
      setFittings(updated);
    }

    if (section === "Glues") {
      const updated = [...glues];
      const base = updated[index].cost || 0;
      const profit = base * ((newProfit || 0) / 100);
      updated[index] = {
        ...updated[index],
        // wasManuallyEdited: true,
        profitOnMaterial: newProfit,
        rowTotal: Math.round(base + profit),
      };
      setGlues(updated);
    }

    if (section === "Non-Branded Materials") {
      const updated = [...nbms];
      const base = (updated[index].quantity || 0) * (updated[index].cost || 0);
      const profit = base * ((newProfit || 0) / 100);
      updated[index] = {
        ...updated[index],
        // wasManuallyEdited: true,
        profitOnMaterial: newProfit,
        rowTotal: Math.round(base + profit),
      };
      setNbms(updated);
    }

    onFurnitureChange?.();
  };


  useEffect(() => {
    onFurnitureChange?.(); // tell parent something changed
  }, [coreSelectedBrand, coreSelectedLaminateBrand, coreMaterials, data.fittingsAndAccessories, data.glues]);

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
            {coreMaterials?.length > 0 && coreMaterials?.map((row, i) => {
              const rowTotal = calculateRowTotal(row, coreMaterials);
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

                  {/* <td className="text-center border-r-1 p-2">{row?.profitOnMaterial || 0}</td> */}

                  <td className="text-center border-r-1 p-2">
                    <input
                      type="number"
                      value={coreMaterials[i].profitOnMaterial}
                      onChange={(e) => handleProfitMaterialChange(i, parseFloat(e.target.value))}
                      className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </td>
                  {/* {i === 0 && (
                    <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.profitOnLabour || 0}</td>
                  )} */}

                  {i === 0 && (
                    <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">
                      <input
                        type="number"
                        value={coreMaterials[0].profitOnLabour}
                        onChange={(e) => handleProfitLabourChange(parseFloat(e.target.value))}
                        className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
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


  const sectionTotal = (sectionTitle: "Fittings & Accessories" | "Glues" | "Non-Branded Materials" | string) => {
    if (sectionTitle === "Fittings & Accessories") {
      // return fittingsTotal
      return Math.round(fittingsTotal)
    }
    else if (sectionTitle === "Glues") {
      // return gluesTotal
      return Math.round(gluesTotal)

    }
    else if (sectionTitle === "Non-Branded Materials") {
      // return nbmsTotal
      return Math.round(nbmsTotal)

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
            <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit On Materials</th>
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
              {/* <td className="text-center border p-2">{item?.profitOnMaterial || 0}</td> */}
              <td className="text-center border p-2">
                <input
                  type="number"
                  value={item.profitOnMaterial || 0}
                  onChange={(e) => handleProfitChangeInSimpleRow(sectionTitle, i, parseFloat(e.target.value))}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </td>
              {/* {sectionTitle === "Fittings & Accessories" || sectionTitle === "Non-Branded Materials" ?
                <td className="text-center border p-2 text-green-700 font-bold">₹{calculateSimpleRowTotal(item).toLocaleString("en-IN")}</td>
                :
                <td className="text-center border p-2 text-green-700 font-bold">₹{calculateGlueRowTotal(item).toLocaleString("en-IN")}</td>
              } */}

              <td className="text-center border p-2 text-green-700 font-bold">
                ₹{(item.rowTotal || 0).toLocaleString("en-IN")}
              </td>
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

        <div>
          <div className="text-right text-xl font-bold text-green-700">
            Product Total: ₹{furnitureTotal.toLocaleString("en-IN")}
          </div>

          <p className="mt-1 text-sm text-gray-600">Raw Cost (no profit)</p>
          <p className="text-lg font-semibold text-blue-700">
            ₹{calculateFurnitureRawCost().toLocaleString("en-IN")}
          </p>
        </div>


      </div>
      <div
      >
        <div className="flex justify-between gap-2">


          <div className="flex-1">
            <label className="font-medium text-gray-700">Select Plwyood Brand:</label>

            <SearchSelect
              options={brandOptions}
              placeholder="-- Choose Plwyood Brand --"
              searchPlaceholder="Search Plywood brands..."
              onSelect={setCoreSelectedBrand}
              selectedValue={coreSelectedBrand || ""}
              className="mt-1"
            />

          </div>

          <div className="flex-1">
            <label className="font-medium text-gray-700">Select Laminate Brand:</label>

            <SearchSelect
              options={laminateBrandOptions}
              placeholder="-- Choose Laminate Brand --"
              searchPlaceholder="Search laminate brands..."
              onSelect={setCoreSelectedLaminateBrand}
              selectedValue={coreSelectedLaminateBrand || ""}
              className="mt-1"
            />


          </div>

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
      {/* {renderSimpleSection("Fittings & Accessories", data?.fittingsAndAccessories)}
      {renderSimpleSection("Glues", data?.glues)}
      {renderSimpleSection("Non-Branded Materials", data?.nonBrandMaterials)} */}

      {renderSimpleSection("Fittings & Accessories", fittings)}
      {renderSimpleSection("Glues", glues)}
      {renderSimpleSection("Non-Branded Materials", nbms)}


    </div>
  );
}
);
export default FurnitureQuoteVariantForm;


