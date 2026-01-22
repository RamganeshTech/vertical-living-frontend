import React from "react";
import { Button } from "../../../../components/ui/Button";

// Types ----------------------------------------
export type CoreMaterialRow = {
  itemName: string;
  plywoodNos: { quantity: number; thickness: number };
  laminateNos: { quantity: number; thickness: number };
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
  quantity: number;
  cost: number;
  rowTotal: number;
  profitOnMaterial?: number
  wasManuallyEdited?: boolean; // 🆕

};

export type FurnitureBlock = {
  furnitureName: string;
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
  laminateBrand?: string | null,
};

type Props = {
  index: number;
  data: FurnitureBlock;
  labourCost: number;
  updateFurniture?: (updatedFurniture: FurnitureBlock) => void;
  removeFurniture?: () => void;
  isEditing?: boolean,
};

// Constants ----------------------------------------
export const RATES = {
  // labour: 1300,
  plywood: 1,
  laminate: 1,
};

const emptyCoreMaterial = (): CoreMaterialRow => ({
  itemName: "",
  plywoodNos: { quantity: 0, thickness: 0 },
  laminateNos: { quantity: 0, thickness: 0 },
  carpenters: 0,
  days: 0,
  profitOnMaterial: 0,
  profitOnLabour: 0,
  rowTotal: 0,
  remarks: "",
});

const emptySimpleItem = (): SimpleItemRow => ({
  itemName: "",
  description: "",
  quantity: 0,
  cost: 0,
  rowTotal: 0,
});


export const calculateCoreMaterialCosts = (
  coreRows: CoreMaterialRow[],
  labourCost: number
): CoreMaterialRow[] => {
  if (coreRows.length === 0) return [];

  const totalRows = coreRows.length;

  const base = coreRows[0];
  // changed for labour cost
  // const totalLabour = base.carpenters * base.days * RATES.labour;
  const totalLabour = base.carpenters * base.days * labourCost;
  const labourWithProfit = totalLabour * (1 + (base.profitOnLabour || 0) / 100);
  const labourPerRow = labourWithProfit / totalRows;

  return coreRows.map((row) => {
    const plywoodQty = row.plywoodNos?.quantity || 0;
    const laminateQty = row.laminateNos?.quantity || 0;

    // Material cost and margin per row
    const materialCost =
      (plywoodQty * RATES.plywood + laminateQty * RATES.laminate) *
      (1 + (row.profitOnMaterial || 0) / 100);

    // console.log("console.log", materialCost)

    return {
      ...row,
      rowTotal: Math.round(materialCost + labourPerRow),
    };
  });
};

// Component ----------------------------------------
const FurnitureForm: React.FC<Props> = ({
  // index,
  data,
  isEditing,
  labourCost,
  updateFurniture,
  removeFurniture,
}) => {



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
    } else if (key === "plywoodNos" || key === "laminateNos") {
      updated[rowIndex][key] = {
        ...(updated[rowIndex][key] || {}),
        ...value,
      };
    } else {
      updated[rowIndex][key] = value;
    }

    const updatedRows = calculateCoreMaterialCosts(updated, labourCost);

    // 2. NEW LOGIC: Calculate Average Core Cost for Glues
    // Formula: Total Cost of Core Materials / Number of Core Material Rows
    const totalCoreCost = updatedRows.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
    const coreRowCount = updatedRows.length;
    const avgCoreCost = coreRowCount > 0 ? Math.round(totalCoreCost / coreRowCount) : 0;

    const inheritedProfit = updatedRows?.[0]?.profitOnMaterial || 0;

    const applyProfitAndRecalculate = (rows: SimpleItemRow[], isGlue = false): SimpleItemRow[] =>
      rows.map(item => {

        const profitOnMaterial = inheritedProfit;
        // const base = isGlue
        //   ? item.cost || 0
        //   : (item.quantity || 0) * (item.cost || 0);
        const base = isGlue ? avgCoreCost : (item.quantity || 0) * (item.cost || 0);
        const profit = base * (profitOnMaterial / 100);
        const rowTotal = Math.round(base + profit);

        return {
          ...item,
          itemName: isGlue ? "Glue" : item.itemName,
          quantity: isGlue ? 1 : item.quantity,
          cost: isGlue ? avgCoreCost : item.cost, // Automatically update the cost field for glues
          profitOnMaterial,
          rowTotal,
        };
      });



    const updatedFurniture: FurnitureBlock = {
      ...data,
      coreMaterials: updatedRows,
      fittingsAndAccessories: applyProfitAndRecalculate(data.fittingsAndAccessories),      // false = not glue
      glues: applyProfitAndRecalculate(data.glues, true),                                  // glue = needs special calc
      nonBrandMaterials: applyProfitAndRecalculate(data.nonBrandMaterials),                // false = not glue
    };


    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture?.(updatedFurniture);
  };

  const syncFurnitureState = (updatedCoreRows: CoreMaterialRow[]) => {
    // 1. Calculate the new Average Cost
    const totalCoreCost = updatedCoreRows.reduce((sum, row) => sum + (row.rowTotal || 0), 0);
    const coreRowCount = updatedCoreRows.length;
    const avgCoreCost = coreRowCount > 0 ? Math.round(totalCoreCost / coreRowCount) : 0;

    // 2. Get the inherited profit from the first row
    const inheritedProfit = updatedCoreRows?.[0]?.profitOnMaterial || 0;

    // 3. Helper to apply updates to simple sections (Glues, Fittings, etc.)
    const applyUpdates = (rows: SimpleItemRow[], isGlue = false): SimpleItemRow[] =>
      rows.map(item => {
        const currentCost = isGlue ? avgCoreCost : (item.cost || 0);
        const base = isGlue ? currentCost : (item.quantity || 0) * currentCost;
        const profit = base * (inheritedProfit / 100);

        return {
          ...item,
          cost: currentCost,
          profitOnMaterial: inheritedProfit,
          rowTotal: Math.round(base + profit),
        };
      });

    // 4. Construct the final object
    const updatedFurniture: FurnitureBlock = {
      ...data,
      coreMaterials: updatedCoreRows,
      fittingsAndAccessories: applyUpdates(data.fittingsAndAccessories),
      glues: applyUpdates(data.glues, true),
      nonBrandMaterials: applyUpdates(data.nonBrandMaterials),
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
      <h3 className="font-semibold text-md mb-2">Core Materials - Total: ₹{data?.totals.core.toLocaleString("en-IN")}</h3>
      <div className="overflow-x-auto  rounded-md">
        <table className="min-w-full text-sm bg-white shadow-sm">


          <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
            <tr>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Image</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Item Name</th>
              <th className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Plywood</th>
              <th className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Laminate</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. of Carpenters / Day</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>No. of Days</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Profit % Material</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Profit % Labour</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Remarks</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Total</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" rowSpan={2}>Actions</th>
            </tr>
            <tr>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
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
                    {row.previewUrl && (
                      <img src={row.previewUrl} className="h-10 mt-2 mx-auto" />
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
                {["plywoodNos", "laminateNos"].map((field) =>
                  ["quantity", "thickness"].map((sub) => (
                    <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" key={`${field}-${sub}`}>
                      <input
                        type="number"
                        placeholder={`${sub === "quantity" ? "QTY" : "THK"}`}
                        value={(row as any)[field][sub] || ""}
                        onChange={(e) => {
                          if (Number(e.target.value) >= 0) {

                            handleCoreChange(i, field as any, {
                              ...(row as any)[field],
                              [sub]: Number(e.target.value),
                            })
                          }
                        }
                        }
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
                          handleCoreChange(i, "carpenters", Number(e.target.value))
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
                          handleCoreChange(i, "days", Number(e.target.value))
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
                      handleCoreChange(i, "profitOnMaterial", Number(e.target.value))
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
                          handleCoreChange(i, "profitOnLabour", Number(e.target.value))
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
                <td className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">₹{row.rowTotal.toLocaleString("en-IN")}</td>
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
                      const recalculatedCore = calculateCoreMaterialCosts(updated, labourCost);

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
            const updatedRows = calculateCoreMaterialCosts(updated, labourCost);

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
  ) => (
    <div className="mt-6">
      <h3 className="font-semibold text-md mb-2">
        {title} - Total: ₹{(data as any)?.totals[kind === "fittingsAndAccessories" ? "fittings" : kind]?.toLocaleString("en-IN")}
      </h3>
      <div className="overflow-x-auto  rounded-md">
        <table className="min-w-full text-sm bg-white shadow-sm">
          <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
            <tr>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit %</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data[kind].map((row, i) => (
              <tr key={i}
                className="group relative border-none !border-b-1 px-4 !py-2 transition-all duration-150 hover:bg-gray-50"
              >
                <td
                  className="p-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                >
                  <input
                    value={row.itemName || ""}
                    placeholder="Item Name"
                    onChange={(e) =>
                      handleSimpleChange(kind, i, "itemName", e.target.value)
                    }
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
                <td
                  className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                >
                  <input
                    type="number"
                    placeholder="enter quantity"
                    value={row.quantity || ""}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {

                        handleSimpleChange(kind, i, "quantity", Number(e.target.value))
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
                      handleSimpleChange(kind, i, "cost", Number(e.target.value))
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
                      handleSimpleChange(kind, i, "profitOnMaterial", Number(e.target.value))
                    }
                    // className="w-20 text-center  rounded px-2 py-1 text-sm"
                    className="w-full px-2 py-1 text-center outline-none"

                  />
                </td>
                <td
                  className="px-2 border border-gray-200 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900"
                >₹{row.rowTotal.toLocaleString("en-IN")}</td>
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
  );



  return (
    <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">
          Product: {data.furnitureName}
        </h2>
        {removeFurniture && (
          <Button variant="danger" size="sm" onClick={removeFurniture} className="bg-red-600 text-white">
            Remove Product
          </Button>
        )}
      </div>

      {renderCoreMaterials()}
      {renderSimpleItemSection("Fittings", "fittingsAndAccessories")}
      {renderSimpleItemSection("Glues", "glues")}
      {renderSimpleItemSection("Non-Branded Materials", "nonBrandMaterials")}

      <div className="mt-6 text-right text-xl text-green-700 font-bold">
        Product Total: ₹{data.totals.furnitureTotal.toLocaleString("en-IN")}
      </div>
    </div>
  );
};

export default FurnitureForm;