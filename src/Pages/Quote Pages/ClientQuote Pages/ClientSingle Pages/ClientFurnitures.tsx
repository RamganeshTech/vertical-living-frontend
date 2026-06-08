
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
  isBlurred: boolean;
  templateType?: "type 1" | "type 2" | "type 3"
  onImageClick?: (string: any) => any
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
  templateType,
  onImageClick,
  isBlurred },
  ref
) => {


  useImperativeHandle(ref, () => ({
    getUpdatedFurniture: () => {



      return {

        furnitureName: data.furnitureName, // Original data (with ids etc)

        dimention: data.dimention,
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
        Core Materials (Total: ₹{data?.totals?.core.toLocaleString("en-IN")})
      </h3>

      {/* 🆕 NEAT BRAND SPECIFICATION SECTION */}
      {/* <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex flex-wrap gap-6 items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plywood Brand</span>
          <span className="text-sm font-semibold text-gray-800">{data?.plywoodBrand || "Standard Quality"}</span>
        </div>

        <div className="h-8 w-px bg-gray-300 hidden md:block" />

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Inner Laminate</span>
          <span className="text-sm font-semibold text-gray-800">{data?.innerLaminateBrand || "Standard White"}</span>
        </div>

        <div className="h-8 w-px bg-gray-300 hidden md:block" />

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Outer Laminate</span>
          <span className="text-sm font-semibold text-gray-800">{data?.outerLaminateBrand || "Selected Finish"}</span>
        </div>
      </div> */}


      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full text-sm bg-white shadow-sm">
          <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
            <tr>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium  text-gray-500 uppercase tracking-wider">Image</th>
              {templateType !== "type 3" &&
                <>
                  <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  {templateType !== "type 2" && <>
                    <th colSpan={2} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Plywood</th>
                    <th colSpan={4} className="text-center px-6 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Laminate</th>
                    {/* <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Carpenters / Day</th>
                    <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days</th> */}
                    {/* <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Material</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % Labour</th>
              <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th> */}
                  </>}
                  <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  {templateType !== "type 2" && <th rowSpan={2} className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                </>}
            </tr>
            {/* {templateType !== "type 3" && templateType !== "type 2" && <tr>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Thk</th>
            </tr>} */}

            {templateType !== "type 3" && templateType !== "type 2" && (
              <tr className="bg-blue-50/50">
                <th className="px-2 py-2 text-[10px] uppercase border-r">Qty</th>
                <th className="px-2 py-2 text-[10px] uppercase border-r">Thk</th>
                {/* 🆕 Inner split */}
                <th className="px-2 py-2 text-[10px] uppercase border-r ">Inner Qty</th>
                <th className="px-2 py-2 text-[10px] uppercase border-r ">Inner Thk</th>
                {/* 🆕 Outer split */}
                <th className="px-2 py-2 text-[10px] uppercase border-r">Outer Qty</th>
                <th className="px-2 py-2 text-[10px] uppercase border-r">Outer Thk</th>
              </tr>
            )}
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


                        {/* <td className="text-center border-r-1 p-2">
                          <span className={isBlurred ? "blur-sm select-none" : ""}>

                            {row?.laminateNos?.quantity ?? 0}
                          </span>
                        </td>
                        <td className="text-center border-r-1 p-2">
                          <span className={isBlurred ? "blur-sm select-none" : ""}>
                            {row?.laminateNos?.thickness ?? 0}
                          </span>
                        </td> */}

                        {/* 🆕 Inner Laminate Values */}
                        <td className={`text-center border-r p-2 bg-blue-50/20 font-mono ${isBlurred ? "blur-sm select-none" : ""}`}>
                          {row.innerLaminate?.quantity || 0}
                        </td>
                        <td className={`text-center border-r p-2 bg-blue-50/20 font-mono ${isBlurred ? "blur-sm select-none" : ""}`}>
                          {row.innerLaminate?.thickness || 0}
                        </td>
                        {/* 🆕 Outer Laminate Values */}
                        <td className={`text-center border-r p-2 bg-orange-50/10 font-mono ${isBlurred ? "blur-sm select-none" : ""}`}>
                          {row.outerLaminate?.quantity || 0}
                        </td>
                        <td className={`text-center border-r p-2 bg-orange-50/10 font-mono ${isBlurred ? "blur-sm select-none" : ""}`}>
                          {row.outerLaminate?.thickness || 0}
                        </td>



                        {/* {i === 0 && (<>

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
                        )} */}
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

          <h3 className="font-semibold text-md mb-2 flex items-center gap-2 text-gray-800">{sectionTitle}

            <span>(Total: ₹{sectionTotal(sectionTitle).toLocaleString("en-IN")})</span>
          </h3>
          {(templateType !== "type 3") && (<table className="min-w-full text-sm bg-white shadow-sm">
            <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
              <tr>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
                {/* <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th> */}
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
                  {/* <td className="text-center border p-2">
                    <span className={isBlurred ? "blur-sm select-none" : ""}>

                      {item?.cost || 0}
                    </span>
                  </td> */}

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


  // Inside your ClientFurnitures component, above the renderCoreMaterials() call

  const renderBrandSpecificationTable = () => {
    // 1. Group Fittings & Accessories into a single comma-separated string
    const uniqueFittings = Array.from(new Set(
      data.fittingsAndAccessories
        ?.filter((item) => item.brandName)
        .map((item) => item.brandName)
    )).join(", ");

    // 2. Group Glues/Adhesives into a single comma-separated string
    const uniqueGlues = Array.from(new Set(
      data.glues
        ?.filter((item) => item.brandName)
        .map((item) => item.brandName)
    )).join(", ");

    // 3. Prepare the final display list
    const specs = [
      { category: "Plywood", brand: data.plywoodBrand, desc: "" },
      { category: "Inner Laminate", brand: data.innerLaminateBrand, desc: "" },
      { category: "Outer Laminate", brand: data.outerLaminateBrand, desc: "" },
      { category: "Fittings & Accessories", brand: uniqueFittings, desc: "" },
      { category: "Adhesives/Glues", brand: uniqueGlues, desc: "" },
    ].filter(s => s.brand); // Only show rows that have at least one brand

    if (specs.length === 0) return null;

    return (
      <div className="mt-4 mb-8 overflow-hidden border border-gray-100 rounded-xl shadow-sm bg-white">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest">
            Brand Specifications
          </h4>
        </div>
        <table className="w-full table-fixed divide-y divide-gray-100">
          <thead>
            <tr className="bg-white">
              <th className="w-1/3 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-tighter">Category</th>
              <th className="w-1/3 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-tighter">Brand Standard</th>
              <th className="w-1/3 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-tighter">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {specs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-blue-50/20 transition-all duration-200">
                {/* Category Column */}
                <td className={`${isBlurred ? "" : ""} px-6 py-4 text-sm font-semibold text-gray-700`}>
                  {spec.category}
                </td>

                {/* Brand Column - Comma separated for fittings */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {spec?.brand?.split(", ").map((b, bIdx) => (
                      <span key={bIdx} className={`${isBlurred ? "blur-sm select-none" : ""} inline-block px-3 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase`}>
                        {b}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Description Column - Empty for now */}
                <td className={`${isBlurred ? "blur-sm select-none" : ""} px-6 py-4 text-sm text-gray-400`}>
                  {spec.desc || "---"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };



  const renderNonModularSection = () => {
    const works = data?.works || [];
    if (works.length === 0) return null;

    return (
      <div className="mt-6">
        <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
          <thead className="bg-blue-50 text-blue-800">
            <tr>
              <th className="p-3 border-r border-blue-100 text-left font-semibold">Work Description</th>

              {/* Type 1 & Type 2: Show Total Sqft */}
              {(templateType === "type 1" || templateType === "type 2") && (
                <th className="p-3 border-r border-blue-100 text-center font-semibold">Total Sq.ft</th>
              )}

              {/* Type 1 ONLY: Show Material Rate/Sqft */}
              {templateType === "type 1" && (
                <th className="p-3 border-r border-blue-100 text-center font-semibold">Rate/Sq.ft</th>
              )}

              {/* All Types: Show Final Amount */}
              <th className="p-3 text-right font-semibold">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {works.map((w: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {/* <td className="p-3 border-r border-gray-100 text-gray-700 font-medium"> */}
                <td className={`p-3 border-r border-gray-100 text-gray-700 font-medium ${isBlurred ? "blur-sm" : ""}`}>
                  {w.workName}</td>

                {/* Type 1 & Type 2 */}
                {(templateType === "type 1" || templateType === "type 2") && (
                  // <td className="p-3 border-r border-gray-100 text-center text-gray-600">
                  <td className={`p-3 border-r border-gray-100 text-center text-gray-600 ${isBlurred ? "blur-sm" : ""}`}>
                    {w.totalSqft}</td>
                )}

                {/* Type 1 ONLY */}
                {templateType === "type 1" && (
                  // <td className="p-3 border-r border-gray-100 text-center text-gray-600">
                  <td className={`p-3 border-r border-gray-100 text-center text-gray-600 ${isBlurred ? "blur-sm" : ""}`}>
                    ₹{w.sqftRate}
                  </td>
                )}

                {/* <td className="p-3 text-right font-bold text-gray-800"> */}
                <td className={`p-3 text-right font-bold text-gray-800 ${isBlurred ? "blur-sm" : ""}`}>
                  ₹{w.totalAmount?.toLocaleString("en-IN") || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const isNonModular = data?.typeOfWork === "non-modular";
  return (
    <div className="shadow-md p-4 my-4 border rounded-lg bg-white">
      <div className=" flex justify-between items-center">
        <h2 className="text-xl font-semibold  text-blue-600">
          {/* Product {index + 1}: {data?.furnitureName} */}
          {isNonModular ? "Work" : "Product"} {index + 1}: {data?.furnitureName}

          {isNonModular && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-widest font-bold">
              {data?.typeOfNonModularWork || "Site"} Works
            </span>
          )}
        </h2>

        <div>
          <div className="text-right text-xl font-bold text-green-700">
            {/* Product Total: ₹{furnitureTotal.toLocaleString("en-IN")} */}
            {/* Product Total: ₹{(data?.totals?.furnitureTotal || 0)?.toLocaleString("en-IN")} */}
            {isNonModular ? "Work Total" : "Product Total"}: ₹{(data?.totals?.furnitureTotal || 0)?.toLocaleString("en-IN")}
          </div>
        </div>


      </div>


      {isNonModular ? (
        // ==========================================
        // 🚀 NON-MODULAR: Only show the custom works table
        // ==========================================
        renderNonModularSection()
      ) : (
        // ==========================================
        // 🚀 MODULAR: Show Plywood, Fittings, Glues, etc.
        // ==========================================
        <>

          {(templateType === "type 2" || templateType === "type 3") && <section>
            {/*  here the tbale like things should be shown to you  */}
            {renderBrandSpecificationTable()}
          </section>}

          {renderCoreMaterials()}
          {renderSimpleSection("Fittings & Accessories", data.fittingsAndAccessories)}
          {renderSimpleSection("Glues", data?.glues)}
          {renderSimpleSection("Non-Branded Materials", data?.nonBrandMaterials)}
        </>
      )}
    </div>
  );
}
);
export default ClientFurnitures;


