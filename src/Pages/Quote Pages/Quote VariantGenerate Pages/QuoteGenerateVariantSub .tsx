import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGenerateQuotePdf, useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { RATES, type FurnitureBlock } from "../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
import FurnitureQuoteVariantForm, { getRateForThickness, type FurnitureQuoteRef } from "./FurnitureQuoteVariantForm";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { downloadImage } from "../../../utils/downloadFile";
import SearchSelect from "../../../components/ui/SearchSelect";
import { Card } from "../../../components/ui/Card";

export const DEFAULT_LAMINATE_RATE_PER_SQFT = 10;

const QuoteGenerateVariantSub = () => {
    const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>();
    const navigate = useNavigate()

    const { data: quote, isLoading: quoteLoading } = useGetMaterialQuoteSingleEntry(organizationId!, quoteId!);
    let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
    let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");

    const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
    const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedLaminateBrand, setSelectedLaminateBrand] = useState<string | null>(null);



    // materialBrands = []
    // laminateBrands = []
    // console.log("quote", quote)
    // console.log("materialBrands", materialBrands)

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
    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [rawCostWithoutProfit, setRawCostWithoutProfit] = useState(0);

    const updateGrandTotal = () => {
        const updatedFurnitures = furnitureRefs.current
            .map(ref => ref.current)
            .filter((ref): ref is FurnitureQuoteRef => ref !== null)
            .map(ref => ref.getUpdatedFurniture());

        console.log("updatedFurnitures", updatedFurnitures)

        const total = updatedFurnitures.reduce(
            (sum, f) => sum + f.totals.furnitureTotal,
            0
        );
        console.log("total", total)
        setGrandTotal(total);
        setRawCostWithoutProfit(calculateCostWithoutProfit()); // 👈 Add this line
    };

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
            // Core materials
            const selectedBrandRates = furniture.plywoodBrand ? (brandRatesByName[furniture.plywoodBrand] || []) : [];
            const selectedLaminateRates = furniture.laminateBrand ? (laminateRatesByBrand[furniture.laminateBrand] || []) : [];

            // labour info is based on the first core row
            const coreRows = furniture.coreMaterials;
            const base = coreRows[0];
            const totalLabourCost = (base?.carpenters || 0) * (base?.days || 0) * RATES.labour;
            const labourPerRow = coreRows.length > 0 ? totalLabourCost / coreRows.length : 0;

            coreRows.forEach(row => {
                const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates, "plywood");
                const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates, "laminate");

                const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
                const lamiCost = row.laminateNos.quantity * (lamiRate * SHEET_SQFT);
                const baseMaterialCost = plyCost + lamiCost;

                totalRawCost += baseMaterialCost + labourPerRow; // ❌ No profit added
            });

            // Fittings, Glues, NBMs
            const getSimpleRowTotal = (row: any) => row.quantity * row.cost;
            const fittingsTotal = furniture.fittingsAndAccessories.reduce((sum, r) => sum + getSimpleRowTotal(r), 0);
            const gluesTotal = furniture.glues.reduce((sum, r) => sum + (r.cost || 0), 0);
            const nbmsTotal = furniture.nonBrandMaterials.reduce((sum, r) => sum + getSimpleRowTotal(r), 0);

            totalRawCost += fittingsTotal + gluesTotal + nbmsTotal;
        });

        return Math.round(totalRawCost);
    };





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

            // console.log("fff Furnitures", furnitures)
            // console.log("fff furnitureRefs", furnitureRefs)

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
            // console.log("fff updatedFurnitures", updatedFurnitures)
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

    // console.log("furnitureRefs", furnitureRefs)

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

    return (
        <div className="p-2 max-h-full overflow-y-auto">
            {/* <header className="flex justify-between items-center mb-6">
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

                    <div className="text-right mr-6">
                        <p className="text-md text-gray-600">Project Cost <br /><span className="font-bold">(without profit)</span></p>
                        <p className="text-xl font-semibold text-blue-600">
                            ₹{rawCostWithoutProfit.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <p className="text-right text-green-700">
                        <p className="text-md text-gray-600">Client Quote Amount <br /><span className="font-bold">(with profit)</span></p>
                        <p className="text-xl font-semibold text-blue-600">
                            ₹{grandTotal.toLocaleString("en-IN")}
                        </p>
                    </p>


                    <p className="text-right text-green-700">
                        <p className="text-md text-gray-600"> Extra Profit</p>
                        <p className="text-xl font-semibold text-blue-600">
                            ₹{profitDifference.toLocaleString("en-IN")}
                                <br />
                             <span className="text-blue-700 !text-[12px] font-semibold">
                            {profitPercentage.toFixed(2)}%
                        </span>
                        </p>
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
                    </div>

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
                    </div>

                </div>
            </header> */}


            {/* <div className="h-[200px] border w-full">

            </div> */}


            {/* <header className="bg-white mb-6 border-b pb-4">
  <div className="flex flex-wrap items-start justify-between gap-6 xl:gap-10 px-2">

    <div className="flex items-start gap-3 min-w-[220px]">
      <div
        onClick={() => navigate(-1)}
        className="bg-slate-50 hover:bg-slate-300 flex items-center justify-center w-8 h-8 border border-gray-300 text-sm cursor-pointer rounded-md"
        title="Go back"
      >
        <i className="fas fa-arrow-left"></i>
      </div>

      <div className="text-sm leading-tight">
        <p className="text-gray-500 font-semibold">
          Project Name:{" "}
          <span className="text-black">{quote?.projectId?.projectName || "Project"}</span>
        </p>
        <p className="text-gray-500 font-semibold">
          Quote:{" "}
          <span className="text-black">#{quote?.quoteNo || "-"}</span>
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-start gap-6 text-right">
      <div>
        <p className="text-sm text-gray-600 font-medium">
          Project Cost <br />
          <span className="font-bold">(without profit)</span>
        </p>
        <p className="text-xl font-semibold text-blue-600">
          ₹{rawCostWithoutProfit.toLocaleString("en-IN")}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600 font-medium">
          Client Quote Amount <br />
          <span className="font-bold">(with profit)</span>
        </p>
        <p className="text-xl font-semibold text-blue-600">
          ₹{grandTotal.toLocaleString("en-IN")}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600 font-medium">Extra Profit</p>
        <p className="text-xl font-semibold text-blue-600">
          ₹{profitDifference.toLocaleString("en-IN")}
        </p>
        <span className="text-blue-700 text-xs font-medium">
          ({profitPercentage.toFixed(2)}%)
        </span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4 justify-end">

      <div>
        <Button isLoading={quotePending} onClick={handleGenerateQuote}>
          Generate Quote
        </Button>
      </div>

      <div className="flex flex-col min-w-[200px]">
        <label className="font-medium text-sm text-gray-700 mb-1">
          Select Common Plywood Brand:
        </label>
        <SearchSelect
          options={brandOptions}
          placeholder="-- Choose Plywood Brand --"
          searchPlaceholder="Search Plywood brands..."
          onSelect={setSelectedBrand}
          selectedValue={selectedBrand || ""}
          className=""
        />
      </div>

      <div className="flex flex-col min-w-[200px]">
        <label className="font-medium text-sm text-gray-700 mb-1">
          Select Common Laminate Brand:
        </label>
        <SearchSelect
          options={laminateBrandOptions}
          placeholder="-- Choose Laminate Brand --"
          searchPlaceholder="Search laminate brands..."
          onSelect={setSelectedLaminateBrand}
          selectedValue={selectedLaminateBrand || ""}
          className=""
        />
      </div>
    </div>
  </div>
</header> */}


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
                            <p className="text-md text-gray-500">Quote: #{quote?.quoteNo || "-"}</p>
                        </div>
                    </div>

                    {/* Right - Generate Button */}
                    <Button onClick={handleGenerateQuote} disabled={quotePending} className="flex-shrink-0">
                        {quotePending ? "Generating..." : "Generate Quote"}
                    </Button>
                </div>

                {/* Bottom Row - Brand Selection */}
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Plywood Brand:</label>
                            <SearchSelect
                                options={brandOptions}
                                placeholder="Select Plywood Brand"
                                searchPlaceholder="Search brands..."
                                onSelect={setSelectedBrand}
                                selectedValue={selectedBrand || ""}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
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
                    </div>
                </div>

                {/* Mobile Financial Summary - Only visible on smaller screens */}
                <div className=" grid grid-cols-3 gap-2">
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
                </div>
            </header>

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

                                <p className="text-2xl font-bold text-green-700">
                                    ₹{grandTotal.toLocaleString("en-IN")}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default QuoteGenerateVariantSub;