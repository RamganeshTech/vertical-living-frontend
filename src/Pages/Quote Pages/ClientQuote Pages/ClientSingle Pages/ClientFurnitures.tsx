import {
  forwardRef, useImperativeHandle,
  // useEffect, useImperativeHandle, useRef, useState
} from "react";
import { type FurnitureBlock, type SimpleItemRow } from "../../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import { NO_IMAGE } from "../../../../constants/constants";
// import SearchSelect from "../../../../components/ui/SearchSelect";
import { DEFAULT_LAMINATE_RATE_PER_SQFT } from "./ClientQuoteSingle";

type Props = {
  index: number;
  data: FurnitureBlock;
  // labourCost: number

  // selectedBrand: string | null;
  // selectedLaminateBrand: string | null;

  // brandOptions: string[],
  // laminateBrandOptions: string[]


  // laminateRatesByBrand: Record<string, {
  //   thickness: string;
  //   rs: number;
  // }[]>

  // brandRatesByName: Record<string, {
  //   thickness: string;
  //   rs: number;
  // }[]>

  isBlurred: boolean;
  templateType?: "type 1" | "type 2" | "type 3"
  onImageClick?: (string:any) => any
  // onFurnitureChange: () => any
};


export type FurnitureQuoteRef = {
  getUpdatedFurniture: () => FurnitureBlock;
};


export const getRateForThickness = (thickness: number | string, list: { thickness: string; rs: number }[], type: "laminate" | "plywood") => {
  const thicknessStr = String(thickness).toLowerCase().replace("mm", "").trim();

  const matched = list.find((item) =>
    String(item.thickness).toLowerCase().replace("mm", "").trim() === thicknessStr
  );



  return (matched?.rs !== undefined)
    ? matched.rs
    : (type === "laminate" ? DEFAULT_LAMINATE_RATE_PER_SQFT : 0);
};


const ClientFurnitures = forwardRef<FurnitureQuoteRef, Props>(({
  data, index,
  // brandOptions, laminateBrandOptions, laminateRatesByBrand, brandRatesByName, 

  // labourCost,
  // selectedBrand, selectedLaminateBrand, 
  // onFurnitureChange, 
  templateType,
  onImageClick,
  isBlurred },
  ref
) => {


  useImperativeHandle(ref, () => ({
    getUpdatedFurniture: () => {


    
      return {
    
        furnitureName: data.furnitureName, // Original data (with ids etc)

        plywoodBrand: "",
        laminateBrand: "",

        coreMaterials: data?.coreMaterials,

        fittingsAndAccessories: data?.fittingsAndAccessories,
        glues: data?.glues,
        nonBrandMaterials: data?.nonBrandMaterials,


        coreMaterialsTotal: data.totals.core,
        fittingsAndAccessoriesTotal: data.totals.fittings,
        gluesTotal: data.totals.glues,
        nonBrandMaterialsTotal: data.totals.nbms,
        furnitureTotal: data.totals.furnitureTotal,

        totals: {
          core: data.totals.core,
          fittings: data.totals.fittings,
          glues: data.totals.glues,
          nbms: data.totals.nbms,
          furnitureTotal: data.totals.furnitureTotal,
        },
      }

    }
  }));

  const renderCoreMaterials = () => (
    <div className="mt-6">
      <h3 className="font-semibold text-md text-gray-800 mb-2">
        {/* Core Materials (Total: ₹{coreTotal.toLocaleString("en-IN")}) */}
        Core Materials (Total: ₹{data?.totals?.core.toLocaleString("en-IN")})
      </h3>
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full text-sm bg-white shadow-sm">
          <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
            <tr>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              {templateType !== "type 3" &&
                <>
                  <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  {templateType !== "type 2" && <>
                    <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Plywood</th>
                    <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Laminate</th>
                    <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Carpenters / Day</th>
                    <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days</th>
                    {/* <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Material</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Labour</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th> */}
                  </>}
                  <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  {templateType !== "type 2" && <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                </>}
            </tr>
            {templateType !== "type 3" && templateType !== "type 2" && <tr>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
            </tr>}
          </thead>
          <tbody>
            {/* {coreMaterials?.length > 0 && coreMaterials?.map((row, i) => { */}
            {data?.coreMaterials?.length > 0 && data?.coreMaterials?.map((row, i) => {
              // const rowTotal = calculateRowTotal(row, coreMaterials);
              return (
                <tr key={i} className="group border">
                  {i === 0 && (
                    <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">{row?.imageUrl ?
                       <img src={row?.imageUrl || NO_IMAGE}
                       onClick={() => onImageClick?.(row.imageUrl)}
                       className="h-10 mx-auto cursor-pointer" />
                        : <>—</>}</td>
                  )}
                  {templateType !== "type 3" && (
                    <>
                      <td className="text-center border-r-1 p-2">
                        <span className={isBlurred ? "blur-sm select-none" : ""}>
                          {row?.itemName || "—"}
                        </span>

                      </td>
                      {templateType !== "type 2" && <>
                        <td className="text-center border-r-1 p-2">
                          <span className={isBlurred ? "blur-sm select-none" : ""}>
                            {row?.plywoodNos?.quantity ?? 0}
                          </span>

                        </td>
                        <td className="text-center border-r-1 p-2">
                          <span className={isBlurred ? "blur-sm select-none" : ""}>
                            {row?.plywoodNos?.thickness ?? 0}
                          </span>

                        </td>
                        <td className="text-center border-r-1 p-2">
                          <span className={isBlurred ? "blur-sm select-none" : ""}>

                            {row?.laminateNos?.quantity ?? 0}
                          </span>

                        </td>
                        <td className="text-center border-r-1 p-2">
                          <span className={isBlurred ? "blur-sm select-none" : ""}>
                            {row?.laminateNos?.thickness ?? 0}
                          </span>

                        </td>
                        {i === 0 && (<>

                          <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">
                            <span className={isBlurred ? "blur-sm select-none" : ""}>
                              {row?.carpenters || 0}
                            </span>

                          </td>
                          <td rowSpan={data?.coreMaterials?.length} className="text-center border-r-1 p-2">
                            <span className={isBlurred ? "blur-sm select-none" : ""}>
                              {row?.days || 0}
                            </span>

                          </td>
                        </>
                        )}
                      </>}
                      <td className="text-center border-r-1 p-2 text-green-700 font-bold">
                        <span className={isBlurred ? "blur-sm select-none" : ""}>
                          {/* ₹{rowTotal?.toLocaleString("en-IN")} */}
                          ₹{row?.rowTotal?.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {templateType !== "type 2" && <td className="text-center border-r-1 p-2">
                        <span className={isBlurred ? "blur-sm select-none" : ""}>
                          —
                        </span>
                      </td>
                      }
                    </>
                  )}
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
      return Math.round(data?.totals?.fittings)
    }
    else if (sectionTitle === "Glues") {
      return Math.round(data?.totals?.glues)

    }
    else if (sectionTitle === "Non-Branded Materials") {
      return Math.round(data?.totals?.nbms)

    }
    return 0
  }

  const renderSimpleSection = (
    sectionTitle: string,
    rows: SimpleItemRow[],
    // sectionKey: "fittings" | "glues" | "nbms",
  ) => {

    return (
      // <div className="mt-4">
      // <div className={`mt-4 ${isSectionBlurred ? "blur-sm" : ""}`}>
      <>
        {templateType !== "type 2" && <div className={`mt-4`}>

          <h3 className="font-semibold text-md mb-2 text-gray-800">{sectionTitle}

            (Total: ₹{sectionTotal(sectionTitle).toLocaleString("en-IN")})
          </h3>
          {(templateType !== "type 3") && (<table className="min-w-full text-sm bg-white shadow-sm">
            <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
              <tr>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
                {/* <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit On Materials</th> */}
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 && rows.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="text-center border p-2">
                    <span className={isBlurred ? "blur-sm select-none" : ""}>

                      {item?.itemName || "—"}
                    </span>

                  </td>
                  <td className="text-center border p-2">
                    <span className={isBlurred ? "blur-sm select-none" : ""}>
                      {item?.description || "—"}
                    </span>

                  </td>
                  <td className="text-center border p-2">
                    <span className={isBlurred ? "blur-sm select-none" : ""}>

                      {item?.quantity || 0}
                    </span>

                  </td>
                  <td className="text-center border p-2">
                    <span className={isBlurred ? "blur-sm select-none" : ""}>

                      {item?.cost || 0}
                    </span>
                  </td>
                 
                  <td className="text-center border p-2 text-green-700 font-bold">
                    <span className={isBlurred ? "blur-sm select-none" : ""}>
                      ₹{(item.rowTotal || 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="text-center border p-2">—</td>
                </tr>
              ))}

            </tbody>
          </table>
          )}
        </div>}
      </>
    )
  }

  return (
    <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
      <div className=" flex justify-between items-center">
        <h2 className="text-xl font-semibold  text-blue-600">
          Product {index + 1}: {data?.furnitureName}
        </h2>

        <div>
          <div className="text-right text-xl font-bold text-green-700">
            {/* Product Total: ₹{furnitureTotal.toLocaleString("en-IN")} */}
            Product Total: ₹{(data?.totals?.furnitureTotal || 0)?.toLocaleString("en-IN")}
          </div>
        </div>


      </div>
   
      {renderCoreMaterials()}
      {renderSimpleSection("Fittings & Accessories", data.fittingsAndAccessories)}
      {renderSimpleSection("Glues", data?.glues)}
      {renderSimpleSection("Non-Branded Materials", data?.nonBrandMaterials)}



    </div>
  );
}
);
export default ClientFurnitures;


