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
};

type Props = {
  index: number;
  data: FurnitureBlock;
  updateFurniture?: (updatedFurniture: FurnitureBlock) => void;
  removeFurniture?: () => void;
};

// Constants ----------------------------------------
export const RATES = {
  labour: 2000,
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

// Component ----------------------------------------
const FurnitureForm: React.FC<Props> = ({
  // index,
  data,
  updateFurniture,
  removeFurniture,
}) => {
  // Calculation logic ----------------------------------
  // const calculateCoreRowTotal = (row: CoreMaterialRow) => {
  //   const materialCost =
  //     row.plywoodNos.quantity * RATES.plywood +
  //     row.laminateNos.quantity * RATES.laminate;
  //   const labourCost = row.carpenters * row.days * RATES.labour;

  //   return Math.round(
  //     materialCost * (1 + row.profitOnMaterial / 100) +
  //     labourCost * (1 + row.profitOnLabour / 100)
  //   );
  // };


  const calculateCoreRowTotal = (row: CoreMaterialRow) => {
  const plywoodQty = row.plywoodNos?.quantity || 0;
  const laminateQty = row.laminateNos?.quantity || 0;
  const carpenters = row.carpenters || 0;
  const days = row.days || 0;

  // 🔹 Step 1: Material Cost
  const materialCost = (plywoodQty * RATES.plywood) + (laminateQty * RATES.laminate);

  // 🔹 Step 2: Labour Cost
  const labourCost = carpenters * days * RATES.labour;

  // 🔹 Step 3: Apply profit margins
  const materialWithProfit = materialCost * (1 + (row.profitOnMaterial || 0) / 100);
  const labourWithProfit = labourCost * (1 + (row.profitOnLabour || 0) / 100);

  // 🔹 Step 4: Row total
  return Math.round(materialWithProfit + labourWithProfit);
};

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

  // Handlers ----------------------------------------
  const handleCoreChange = (rowIndex: number, key: keyof CoreMaterialRow, value: any) => {
    const updated: any = [...data.coreMaterials];
    if (key === "imageUrl") {
      updated[rowIndex].imageUrl = value;
      updated[rowIndex].previewUrl = URL.createObjectURL(value);
    } else {
      updated[rowIndex][key] = value;
    }

    updated[rowIndex].rowTotal = calculateCoreRowTotal(updated[rowIndex]);


     // 👉 Automatically add a new row if typing in the last one
  const isLastRow = rowIndex === updated.length - 1;
  const isNotEmpty = Object.values(updated[rowIndex]).some(v => {
    if (typeof v === "object" && v !== null && "quantity" in v) {
      return v.quantity || (v as any).thickness;
    }
    return v !== "" && v !== 0 && v !== null;
  });

  if (isLastRow && isNotEmpty) {
    updated.push(emptyCoreMaterial());
  }

    const updatedFurniture: FurnitureBlock = {
      ...data,
      coreMaterials: updated,
    };
    updatedFurniture.totals = computeTotals(updatedFurniture);
    updateFurniture && updateFurniture(updatedFurniture);
  };

  const handleSimpleChange = (
    kind: "fittingsAndAccessories" | "glues" | "nonBrandMaterials",
    i: number,
    key: keyof SimpleItemRow,
    value: any
  ) => {
    const section: any = [...data[kind]];
    section[i][key] = value;
    section[i].rowTotal = section[i].quantity * section[i].cost;

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
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" >
                  <input
                    type="file"
                    onChange={(e) =>
                      handleCoreChange(i, "imageUrl", e.target.files?.[0])
                    }
                    className="w-full px-2 py-3 text-center outline-none"

                  />
                  {row.previewUrl && (
                    <img src={row.previewUrl} className="h-10 mx-auto mt-1" />
                  )}
                </td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    value={row.itemName}
                    placeholder="TV Unit | Wardrobe"
                    onChange={(e) => handleCoreChange(i, "itemName", e.target.value)}
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                {["plywoodNos", "laminateNos"].map((field) =>
                  ["quantity", "thickness"].map((sub) => (
                    <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" key={`${field}-${sub}`}>
                      <input
                        type="number"
                        value={(row as any)[field][sub]}
                        onChange={(e) =>{
                      if(Number(e.target.value)>=0){

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
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    type="number"
                    value={row.carpenters}
                    onChange={(e) =>
                      handleCoreChange(i, "carpenters", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    type="number"
                    value={row.days}
                    onChange={(e) =>
                      handleCoreChange(i, "days", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    type="number"
                    value={row.profitOnMaterial}
                    onChange={(e) =>
                      handleCoreChange(i, "profitOnMaterial", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    type="number"
                    value={row.profitOnLabour}
                    onChange={(e) =>
                      handleCoreChange(i, "profitOnLabour", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <input
                    value={row.remarks}
                    placeholder="remarks"
                    onChange={(e) =>
                      handleCoreChange(i, "remarks", e.target.value)
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">₹{row.rowTotal.toLocaleString("en-IN")}</td>
                <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                  <Button
                    variant="danger"
                    onClick={() => {
                      const updated = [...data.coreMaterials];
                      updated.splice(i, 1);
                      const updatedFurniture: FurnitureBlock = {
                        ...data,
                        coreMaterials: updated,
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
            const updated = [...data.coreMaterials, emptyCoreMaterial()];
            const updatedFurniture: FurnitureBlock = {
              ...data,
              coreMaterials: updated,
            };
            updatedFurniture.totals = computeTotals(updatedFurniture);
            updateFurniture && updateFurniture(updatedFurniture);
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
              <th  className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th  className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th  className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th  className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th  className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th  className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data[kind].map((row, i) => (
              <tr key={i}
                className="group relative border-none !border-b-1 px-4 !py-2 transition-all duration-150 hover:bg-gray-50"
              >
                <td
                className="p-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" 
                >
                  <input
                    value={row.itemName}
                    placeholder="Item Name"
                    onChange={(e) =>
                      handleSimpleChange(kind, i, "itemName", e.target.value)
                    }
                    className="w-full px-2 py-1 text-center outline-none"

                  />
                </td>
                <td
                className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" 
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
                className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" 
                >
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>{
                      if(Number(e.target.value)>=0){

                        handleSimpleChange(kind, i, "quantity", Number(e.target.value))
                      }}
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td
                className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" 
                >
                  <input
                    type="number"
                    value={row.cost}
                    onChange={(e) =>
                      handleSimpleChange(kind, i, "cost", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 text-center outline-none"
                  />
                </td>
                <td
                className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" 
                >₹{row.rowTotal.toLocaleString("en-IN")}</td>
                <td
                className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900" 
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
          Furniture: {data.furnitureName}
        </h2>
        {removeFurniture && (
          <Button variant="danger" size="sm" onClick={removeFurniture} className="bg-red-600 text-white">
            Remove Furniture
          </Button>
        )}
      </div>

      {renderCoreMaterials()}
      {renderSimpleItemSection("Fittings", "fittingsAndAccessories")}
      {renderSimpleItemSection("Glues", "glues")}
      {renderSimpleItemSection("Non-Branded Materials", "nonBrandMaterials")}

      <div className="mt-6 text-right text-xl text-green-700 font-bold">
        Furniture Total: ₹{data.totals.furnitureTotal.toLocaleString("en-IN")}
      </div>
    </div>
  );
};

export default FurnitureForm;