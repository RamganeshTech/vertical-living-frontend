import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import SearchSelectNew from "../../../../components/ui/SearchSelectNew";
// import { getItemsBycategoryNameForAllCategories, getItemsBycategoryNameForFittings } from "../../../../apiList/Quote Api/RateConfig Api/rateConfigApi";
import useGetRole from "../../../../Hooks/useGetRole";
import { getApiForRole } from "../../../../utils/roleCheck";
import { useParams } from "react-router-dom";
import { getMaterialBrand } from "../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";

// Types ----------------------------------------

export type NonModularWorkRow = {
  workName: string;
  totalSqft: number;
  sqftRate: number;
  labourRate: number;
  noofLabours: number  // added newly
  noofDays: number  // added newly
  totalAmount: number;
};

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



  // 🆕 New Non-Modular Fields
  typeOfWork?: "modular" | "non-modular";
  typeOfNonModularWork?: string | null;
  works?: NonModularWorkRow[];

  // but we need to use this in the quotes for clients (the last module only not the previous two)
  included?: string;
  excluded?: string;
  materialsAndBrands?: string;
  engineeringDescription?: string;

};

type Props = {
  index: number;
  data: FurnitureBlock;
  labourCost: number;
  nonModularLabourRates: Record<string, number> // 🚀 Pass Civil/Elec/Plumb Cost Map
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
  nonModularLabourRates,
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


  // const fetchFittingsBrands = async (index: number, itemName: string) => {
  //   if (!itemName) return;
  //   try {

  //     if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
  //     if (!api) throw new Error("API instance not found for role");


  //     const results = await getItemsBycategoryNameForFittings({
  //       api,
  //       organizationId,
  //       categoryName: "Accessories/Hardware",
  //       itemName: itemName
  //     });


  //     // console.log("results", results)



  //     //  OLD VERSION
  //     // const formatted = results.map((item: any) => ({
  //     //   label: item.data?.Brand,

  //     //   value: item?._id ? String(item._id) : "",

  //     //   rate: item.data?.Rs
  //     // }));



  //     //  NEW VERSION
  //     const formatted = results.map((item: any) => {
  //       // Extract brand and image dynamically
  //       const brand = item.data?.Brand || item.data?.brand || item.data.BrandName || "Unknown";
  //       const img = item.data?.image || item.data?.Image || item.data?.img || item.data?.images || item.data?.Images || "";

  //       return {
  //         label: brand,
  //         value: item?._id ? String(item._id) : "",
  //         rate: item.data?.Rs || item.data?.rs || 0,
  //         imageUrl: img // 🆕 Extracted image
  //       };
  //     });

  //     // console.log("formatted", formatted)

  //     setFittingsOptionsMap(prev => ({ ...prev, [index]: formatted }));
  //   } catch (error) {
  //     console.error("Error fetching fitting brands:", error);
  //   }
  // };


  // // 🆕 New fetch function for Non-Branded (Global Search)
  // const fetchAllCategoryItems = async (index: number, itemName: string) => {
  //   if (!itemName) return;
  //   try {
  //     if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
  //     if (!api) throw new Error("API instance not found");

  //     const results = await getItemsBycategoryNameForAllCategories({
  //       api,
  //       organizationId,
  //       itemName: itemName
  //     });

  //     const formatted = results.map((item: any) => {
  //       // ✅ FIX: Prioritize Brand so you see "Hettich" instead of "hinges"
  //       // ✅ This is just the Brand name (e.g., "Hettich")
  //       const brandOnly =
  //         item.data?.Brand ||
  //         item.data?.BrandName ||
  //         item.data?.brand ||
  //         item.data?.brandName ||
  //         item.data?.["Brands light name"] ||
  //         item.data?.["Brand "] ||
  //         item.data?.["Brands "] ||
  //         item.data?.["BRAND NAME"] ||
  //         'Unknown';

  //       const img = item.data?.image || item.data?.Image || item.data?.img || item.data?.images || item.data?.Images || "";


  //       return {
  //         // This will now result in "Hettich (Accessories/Hardware)"
  //         label: `${brandOnly} (${item.categoryName?.trim() || 'No Cat'})`,
  //         value: item?._id ? String(item._id) : "",
  //         rate: item.data?.Rs || item.data?.rs || item?.data?.RS || 0,
  //         brandOnly: brandOnly,
  //         imageUrl: img // 🆕 Extracted image
  //       };
  //     });

  //     setNbmOptionsMap(prev => ({ ...prev, [index]: formatted }));
  //   } catch (error) {
  //     console.error("Error fetching all category items:", error);
  //   }
  // };



  const fetchAllCategoryItems_v2 = async (index: number, itemName: string, isFittings: boolean = false) => {
    if (!itemName) return;
    try {
      if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
      if (!api) throw new Error("API instance not found");

      const results = await getMaterialBrand({
        api,
        organizationId,
        categoryName: itemName
      });


      console.log("results", results)
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
          item.data?.["BRAND NAME"] ||
          item.data?.["Brand Name"] ||

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


      // setNbmOptionsMap(prev => ({ ...prev, [index]: formatted }));

      if (isFittings) {
        setFittingsOptionsMap(prev => ({ ...prev, [index]: formatted }));
      } else {
        setNbmOptionsMap(prev => ({ ...prev, [index]: formatted }));
      }

    } catch (error) {
      console.error("Error fetching all category items:", error);
    }
  };




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

        // ✅ ADD THIS: Trigger fetch for Fittings using the 'true' flag
        if (row.itemName) {
          fetchAllCategoryItems_v2(i, row.itemName, true);
        }
      }
    });


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
          // fetchAllCategoryItems(i, row.itemName);
          fetchAllCategoryItems_v2(i, row.itemName);
        }
      }
    });

    // 4. Update both states
    setFittingsOptionsMap(prev => ({ ...prev, ...initialFittingsMap }));
    setNbmOptionsMap(prev => ({ ...prev, ...initialNbmMap }));

  }, []); // Run once on mount to populate existing data labels
  // }, [data.fittingsAndAccessories, data.nonBrandMaterials]);




  const computeTotals = (fb: FurnitureBlock) => {

    // If it's non-modular, sum up the 'works' array
    if (fb.typeOfWork === "non-modular") {
      const nonModTotal = (fb.works || []).reduce((sum, row) => sum + (row.totalAmount || 0), 0);
      return {
        core: 0,
        fittings: 0,
        glues: 0,
        nbms: 0,
        furnitureTotal: nonModTotal, // Overrides the main total
      };
    }

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


  // const recalculateNonModularTotals = (furnitureState: any) => {
  //   const works = furnitureState.works || [];
  //   const totalRows = works.length;
  //   if (totalRows === 0) return;

  //   // 1. Get Global Labour Values from the parent state (or default to 0)
  //   const noofLabours = Number(furnitureState.noofLabours) || 0;
  //   const noofDays = Number(furnitureState.noofDays) || 0;
  //   const labourRate = Number(furnitureState.labourRate) || 0;

  //   // 2. Calculate Total Labour Cost
  //   const totalLabourCost = noofLabours * noofDays * labourRate;

  //   // 3. Divide evenly among rows
  //   const labourPerRow = totalLabourCost / totalRows;

  //   const profitMultiplier = 1 + (furnitureState.furnitureProfit || 0) / 100;

  //   // 4. Update every row's totalAmount
  //   const updatedWorks = works.map((w: any) => {
  //     const sqft = Number(w.totalSqft) || 0;
  //     const matRate = Number(w.sqftRate) || 0;
  //     const materialCost = sqft * matRate;

  //     return {
  //       ...w,
  //       totalAmount: Math.round((materialCost + labourPerRow) * profitMultiplier)
  //     };
  //   });

  //   const updatedData = { ...furnitureState, works: updatedWorks };
  //   updatedData.totals = computeTotals(updatedData);
  //   updateFurniture?.(updatedData);
  // };

  // const handleGlobalLabourChange = (field: "noofLabours" | "noofDays" | "labourRate", value: number) => {
  //   const updatedFurniture = { ...data, [field]: value };
  //   recalculateNonModularTotals(updatedFurniture);
  // };

  // --- NON-MODULAR LOGIC & RENDERING ---
  const handleNonModularWorkChange = (i: number, key: keyof NonModularWorkRow, value: any) => {
    // 1. Match the UI: If state is empty, initialize it with the default empty row
    const currentWorks = data.works && data.works.length > 0
      ? data.works
      : [{ workName: "", totalSqft: 0, sqftRate: 0, labourRate: 0, noofLabours: 0, totalAmount: 0 }];

    // 2. Deep clone the array so React detects the state change properly
    const updatedWorks: any = currentWorks.map(row => ({ ...row }));

    // 3. Safely update the value
    updatedWorks[i][key] = value;


    // ==========================================
    // 🚀 AUTO-ADD NEW ROW LOGIC
    // ==========================================
    const isLastRow = i === updatedWorks.length - 1;
    // Check if the user is actually typing real data into the last row
    const isTyping = updatedWorks[i].workName || updatedWorks[i].totalSqft || updatedWorks[i].sqftRate;

    if (isLastRow && isTyping) {
      // We push a new row. We only need the base material fields.
      // Labour fields are strictly handled by index 0.
      updatedWorks.push({
        workName: "",
        totalSqft: 0,
        sqftRate: updatedWorks[i].sqftRate || 0, // Smart fallback: copy previous rate
        labourRate: 0,
        noofDays: 0,
        noofLabours: 0,
        totalAmount: 0
      });
    }


    // ==========================================
    // 🚀 RECALCULATE ALL ROWS
    // ==========================================
    // Must recalculate AFTER the push, because totalRows might have changed!

    const totalRows = updatedWorks.length;
    const baseWork = updatedWorks[0] || {};

    const noofLabours = Number(baseWork.noofLabours) || 0;
    const noofDays = Number(baseWork.noofDays) || 0;
    const labRate = Number(baseWork.labourRate) || 0;

    // 2. Calculate Total Labour Cost and divide by number of rows
    const totalLabourCost = noofLabours * noofDays * labRate;
    const labourPerRow = totalRows > 0 ? totalLabourCost / totalRows : 0;
    const profitMultiplier = 1 + (data.furnitureProfit || 0) / 100;

    // 3. Recalculate ALL rows because changing row 0's labour affects everyone
    const fullyUpdatedWorks = updatedWorks.map((w: any) => {
      const sqft = Number(w.totalSqft) || 0;
      const matRate = Number(w.sqftRate) || 0;
      const materialCost = sqft * matRate;

      return {
        ...w,
        totalAmount: Math.round((materialCost + labourPerRow) * profitMultiplier)
      };
    });

    const updatedFurniture = { ...data, works: fullyUpdatedWorks };
    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture?.(updatedFurniture);
  };




  // ✅ Async function to fetch rate and add a new row
  const handleAddNonModularRow = async () => {
    let defaultSqftRate = 0;

    // 🚀 Instantly grab Labour Rate from props!
    const defaultLabourRate = data.typeOfNonModularWork
      ? (nonModularLabourRates[data.typeOfNonModularWork] || 0)
      : 0;

    console.log("nonModularLabourRates", nonModularLabourRates)
    console.log("defaultLabourRate", defaultLabourRate)

    if (data.typeOfNonModularWork) {
      try {
        if (!api) throw new Error("Api instance not found");

        const results = await getMaterialBrand({
          api,
          organizationId,
          categoryName: data.typeOfNonModularWork // e.g., "civil", "electrical"
        });

        if (results && results.length > 0) {
          const firstItem = results[0];
          const fetchedRate = firstItem.data?.Rs || firstItem.data?.rs || firstItem.data?.RS || firstItem.data?.rS || 0;
          defaultSqftRate = parseFloat(fetchedRate);
        }
      } catch (error) {
        console.error(`Failed to fetch default rate for ${data.typeOfNonModularWork}:`, error);

        // Smart Fallback: If network fails, just copy the sqftRate from the previous row!
        const existingWorks = data.works || [];
        if (existingWorks.length > 0) {
          defaultSqftRate = existingWorks[existingWorks.length - 1].sqftRate || 0;
        }
      }
    }

    // Add the new row with the fetched rate
    const updatedWorks = [
      ...(data.works || []),
      { workName: "", totalSqft: 0, sqftRate: defaultSqftRate, noofLabours: 0, noofDays: 0, labourRate: defaultLabourRate, totalAmount: 0 }
    ];

    const updatedFurniture = { ...data, works: updatedWorks };
    updatedFurniture.totals = computeTotals(updatedFurniture);

    if (updateFurniture) {
      updateFurniture(updatedFurniture);
    }
  };


  const renderNonModularSection = () => {
    const emptyRow = { workName: "", totalSqft: 0, sqftRate: 0, labourRate: 0, noofDays: 0, noofLabours: 0, totalAmount: 0 };
    const works = data?.works && data?.works?.length > 0 ? data?.works : [emptyRow];
    return (
      <div className="mt-6">
        <h3 className="font-semibold text-md mb-2 text-indigo-700">
          {data.typeOfNonModularWork?.toUpperCase() || "NON-MODULAR"} WORKS - Total: ₹{data.totals?.furnitureTotal?.toLocaleString("en-IN") || 0}
        </h3>

        {/* 1. Works Table */}
        <div className="overflow-x-auto rounded-md border border-gray-200 mb-6">
          <table className="min-w-full text-sm bg-white">
            <thead className="bg-indigo-50 text-indigo-800">
              <tr>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={8}>Work Description / Name</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Total Sqft</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Material Rate/Sqft</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. Days</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. Labours</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Labour Rate</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Amount</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {works.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 !border-b-1 !border-b-gray-200  transition-all duration-150 last:border-0">
                  <td className="p-2 border-r border-b-0 border-gray-200">
                    <input
                      value={row.workName}
                      onChange={(e) => handleNonModularWorkChange(i, "workName", e.target.value)}
                      placeholder="e.g. Wall Demolition & Rebuild"
                      className="w-full text-center outline-none bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-gray-200">
                    <input
                      type="number"
                      value={row.totalSqft || ""}
                      onChange={(e) => handleNonModularWorkChange(i, "totalSqft", Math.max(0, Number(e.target.value)))}
                      className="w-full text-center outline-none bg-transparent font-bold"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2 border-r border-gray-200">
                    <input
                      type="number"
                      value={row.sqftRate || ""}
                      onChange={(e) => handleNonModularWorkChange(i, "sqftRate", Math.max(0, Number(e.target.value)))}
                      className="w-full text-center outline-none bg-transparent font-bold"
                      placeholder="₹0"
                    />
                  </td>


                  {/* <td className="p-2 border-r border-gray-200">
                    <input
                      type="number"
                      value={row.noofDays || ""}
                      onChange={(e) => handleNonModularWorkChange(i, "noofDays", Math.max(0, Number(e.target.value)))}
                      className="w-full text-center outline-none bg-transparent font-bold"
                      placeholder="0"
                    />
                  </td>

                  
                  <td className="p-2 border-r border-gray-200">
                    <input
                      type="number"
                      value={row.noofLabours || ""}
                      onChange={(e) => handleNonModularWorkChange(i, "noofLabours", Math.max(0, Number(e.target.value)))}
                      className="w-full text-center outline-none bg-transparent font-bold"
                      placeholder="0"
                    />
                  </td>

                  <td className="p-2 border-r border-gray-200">
                    <input
                      type="number"
                      value={row.labourRate || ""}
                      onChange={(e) => handleNonModularWorkChange(i, "labourRate", Math.max(0, Number(e.target.value)))}
                      className="w-full text-center outline-none bg-transparent"
                      placeholder="₹0"
                    />
                  </td> */}


                  {/* ========================================== */}
                  {/* 🚀 GLOBAL LABOUR INPUTS (SPAN ALL ROWS)      */}
                  {/* ========================================== */}
                  {i === 0 && (
                    <>
                      <td rowSpan={works.length} className="px-1 border-r border-gray-200 text-center text-sm">
                        <input
                          type="number"
                          value={row.noofDays || ""}
                          // onChange={(e) => handleGlobalLabourChange("noofDays", Math.max(0, Number(e.target.value)))}
                          onChange={(e) => handleNonModularWorkChange(0, "noofDays", Math.max(0, Number(e.target.value)))}
                          className="w-full text-center outline-none bg-transparent font-bold"
                          placeholder="0"
                        />
                      </td>
                      <td rowSpan={works.length} className="px-1 border-r border-gray-200 text-center text-sm">
                        <input
                          type="number"
                          value={row.noofLabours || ""}
                          // onChange={(e) => handleGlobalLabourChange("noofLabours", Math.max(0, Number(e.target.value)))}
                          onChange={(e) => handleNonModularWorkChange(0, "noofLabours", Math.max(0, Number(e.target.value)))}
                          className="w-full text-center outline-none bg-transparent font-bold"
                          placeholder="0"
                        />
                      </td>
                      <td rowSpan={works.length} className="px-1 border-r border-gray-200 text-center text-sm">
                        <input
                          type="number"
                          value={row.labourRate || ""}
                          // onChange={(e) => handleGlobalLabourChange("labourRate", Math.max(0, Number(e.target.value)))}
                          onChange={(e) => handleNonModularWorkChange(0, "labourRate", Math.max(0, Number(e.target.value)))}
                          className="w-full text-center outline-none bg-transparent font-bold"
                          placeholder="₹0"
                        />
                      </td>
                    </>
                  )}

                  <td className="p-2 border-r border-gray-200 text-center font-bold text-gray-700">
                    ₹{row.totalAmount?.toLocaleString("en-IN")}
                  </td>
                  {/* <td className="p-2 text-center">
                    <Button variant="danger" size="sm" className="px-2 py-1 text-xs" onClick={() => {
                      const updated = [...works];
                      updated.splice(i, 1);
                      const upData = { ...data, works: updated };
                      upData.totals = computeTotals(upData);
                      updateFurniture?.(upData);
                    }}>Remove</Button>
                  </td> */}

                  <td className="p-2 text-center">
                    <Button variant="danger" size="sm" className="px-2 py-1 text-xs" onClick={() => {
                      const updatedWorks = [...works];

                      // If removing the 0th row, we must transfer its labour data to the new 0th row
                      // BEFORE we actually delete it, so the data isn't lost!
                      if (i === 0 && updatedWorks.length > 1) {
                        updatedWorks[1].noofDays = updatedWorks[0].noofDays;
                        updatedWorks[1].noofLabours = updatedWorks[0].noofLabours;
                        updatedWorks[1].labourRate = updatedWorks[0].labourRate;
                      }

                      // Remove the row
                      updatedWorks.splice(i, 1);

                      // Use the centralized handler to recalculate ALL remaining rows
                      // This ensures the new 'totalRows' count is applied!

                      const totalRows = updatedWorks.length;
                      const baseWork = updatedWorks[0] || {};
                      const noofLabours = Number(baseWork.noofLabours) || 0;
                      const noofDays = Number(baseWork.noofDays) || 0;
                      const labRate = Number(baseWork.labourRate) || 0;

                      const totalLabourCost = noofLabours * noofDays * labRate;
                      const labourPerRow = totalRows > 0 ? totalLabourCost / totalRows : 0;
                      const profitMultiplier = 1 + (data.furnitureProfit || 0) / 100;

                      const fullyRecalculatedWorks = updatedWorks.map((w: any) => {
                        const sqft = Number(w.totalSqft) || 0;
                        const matRate = Number(w.sqftRate) || 0;
                        const materialCost = sqft * matRate;
                        return {
                          ...w,
                          totalAmount: Math.round((materialCost + labourPerRow) * profitMultiplier)
                        };
                      });

                      const upData = { ...data, works: fullyRecalculatedWorks };
                      upData.totals = computeTotals(upData);
                      updateFurniture?.(upData);
                    }}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div className="bg-white p-2 text-right border-t">
            <Button size="sm" variant="secondary" onClick={() => {
              const updated = [...works, { workName: "", totalSqft: 0, sqftRate: 0, labourRate: 0, totalAmount: 0 }];
              updateFurniture?.({ ...data, works: updated });
            }}>+ Add Row</Button>
          </div> */}

          <div className="bg-white p-2 text-right border-t">
            <Button size="sm" variant="secondary" onClick={handleAddNonModularRow}>
              + Add Row
            </Button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">What is Included</label>
            <textarea
              className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-400 min-h-[80px]"
              value={data.included || ""}
              onChange={(e) => handleNonModularTextChange("included", e.target.value)}
              placeholder="List included scope..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">What is Excluded</label>
            <textarea
              className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-400 min-h-[80px]"
              value={data.excluded || ""}
              onChange={(e) => handleNonModularTextChange("excluded", e.target.value)}
              placeholder="List exclusions..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Materials & Brands</label>
            <textarea
              className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-400 min-h-[80px]"
              value={data.materialsAndBrands || ""}
              onChange={(e) => handleNonModularTextChange("materialsAndBrands", e.target.value)}
              placeholder="Specify materials used..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Engineering Description</label>
            <textarea
              className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-400 min-h-[80px]"
              value={data.engineeringDescription || ""}
              onChange={(e) => handleNonModularTextChange("engineeringDescription", e.target.value)}
              placeholder="Technical details..."
            />
          </div>
        </div> */}
      </div>
    );
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


    // ✅ NEW: Intercept and recalculate Non-Modular Works instantly
    if (data.typeOfWork === "non-modular") {
      const profitMultiplier = 1 + (profit / 100);

      const updatedWorks = (data.works || []).map(w => {
        // Extract all 5 variables
        const sqft = Number(w.totalSqft) || 0;
        const matRate = Number(w.sqftRate) || 0;
        const noofLabours = Number(w.noofLabours) || 0;
        const labRate = Number(w.labourRate) || 0;
        const noofDays = Number(w.noofDays) || 0;

        // 🆕 UPDATED MATH: Apply days and number of workers
        const materialCost = sqft * matRate;
        const labourCost = noofLabours * labRate * noofDays;

        return {
          ...w,
          totalAmount: Math.round((materialCost + labourCost) * profitMultiplier)
        };
      });

      const updatedFurniture = {
        ...data,
        furnitureProfit: profit,
        fabricationCost: fabCost,
        works: updatedWorks
      };
      updatedFurniture.totals = computeTotals(updatedFurniture);
      updateFurniture?.(updatedFurniture);
      return; // Exit early so it doesn't run the plywood modular logic!
    }

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
    // updateFurniture && updateFurniture(updatedFurniture);
    if (updateFurniture) {
      updateFurniture(updatedFurniture);
    }
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
            {data.coreMaterials?.map((row, i) => (
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

            (data as any)?.totals?.[
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
              {data?.[kind]?.map((row, i) => (
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
                            fetchAllCategoryItems_v2(i, val, true);
                          } else if (kind === "nonBrandMaterials") {
                            // fetchAllCategoryItems(i, val);
                            fetchAllCategoryItems_v2(i, val);
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
                              fetchAllCategoryItems_v2(i, row.itemName, true);
                            }
                            else if (currentKind === "nonBrandMaterials" && (!nbmOptionsMap[i] || nbmOptionsMap[i]?.length <= 1)) {
                              // fetchAllCategoryItems(i, row.itemName);
                              fetchAllCategoryItems_v2(i, row.itemName);
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
                        // updateFurniture && updateFurniture(updatedFurniture);
                        if (updateFurniture) {
                          updateFurniture(updatedFurniture);
                        }
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
              // updateFurniture && updateFurniture(updatedFurniture);
              if (updateFurniture) {
                updateFurniture(updatedFurniture);
              }
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
            <label className="text-xs font-bold text-gray-400 uppercase">
              {/* Product Name: */}
              {data?.typeOfWork === "non-modular" ? "Work Name:" : "Product Name:"}
            </label>
            <input
              value={data.furnitureName}
              onChange={(e) => updateFurniture?.({ ...data, furnitureName: e.target.value })}
              className="text-xl font-semibold text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none bg-transparent"
            />
          </div>

          {data?.typeOfWork !== "non-modular" && (
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
          )}
        </div>

        <div className="flex gap-2 self-start">
          {duplicateFurniture && (
            <Button size="sm" onClick={duplicateFurniture} className="bg-blue-600 text-white">
              {/* Duplicate Product */}
              {data?.typeOfWork === "non-modular" ? "Duplicate Work" : "Duplicate Product"}
            </Button>
          )}
          {removeFurniture && (
            <Button variant="danger" size="sm" onClick={removeFurniture} className="bg-red-600 text-white">
              {/* Remove Product */}
              {data?.typeOfWork === "non-modular" ? "Remove Work" : "Remove Product"}
            </Button>
          )}
        </div>
      </div>

      {/* {renderCoreMaterials()}
      {renderSimpleItemSection("Fittings", "fittingsAndAccessories")}
      {renderSimpleItemSection("Glues", "glues")}
      {renderSimpleItemSection("Non-Branded Materials", "nonBrandMaterials")} */}

      {data?.typeOfWork === "non-modular" ? (
        // ✅ RENDER NON-MODULAR UI
        renderNonModularSection()
      ) : (
        // ✅ RENDER STANDARD MODULAR UI
        <>
          {renderCoreMaterials()}
          {renderSimpleItemSection("Fittings", "fittingsAndAccessories")}
          {renderSimpleItemSection("Glues", "glues")}
          {renderSimpleItemSection("Non-Branded Materials", "nonBrandMaterials")}
        </>
      )}

      {/* <div className="mt-6 text-right text-xl text-green-700 font-bold">
        Product Total: ₹{data.totals.furnitureTotal.toLocaleString("en-IN")}
      </div> */}

      {/* 🆕 Factory Fabrication & Product Profit Section */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t pt-4">

        {/* Factory Fabrication Input */}
        {data?.typeOfWork !== "non-modular" && (
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
        )}

        {/* Product Profit Input */}
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
          <label className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">
            {/* Product Profit Overlay */}
            {data?.typeOfWork === "non-modular" ? "Work Profit Overlay" : "Product Profit Overlay"}
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
          {/* Product Total: ₹{Math.round(data.totals.furnitureTotal).toLocaleString("en-IN")} */}
          {data?.typeOfWork === "non-modular" ? "Work Total:" : "Product Total:"} ₹{Math.round(data?.totals?.furnitureTotal).toLocaleString("en-IN")}
        </div>
      </div>


    </div>
  );
};

export default FurnitureForm;