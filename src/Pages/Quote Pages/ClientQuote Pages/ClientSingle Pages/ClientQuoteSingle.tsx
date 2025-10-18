import React, { createRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { type FurnitureBlock } from "../../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// import FurnitureQuoteVariantForm, { getRateForThickness, type FurnitureQuoteRef } from "./FurnitureQuoteVariantForm";

import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
// import { Card } from "../../../../components/ui/Card";
// import { useGetSingleLabourCost } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
import ClientFurnitures, { type FurnitureQuoteRef } from "./ClientFurnitures";
import { useGetSingleClientQuote, useSendQuoteToPaymentStage } from "../../../../apiList/Quote Api/ClientQuote/clientQuoteApi";
// import { Input } from "../../../../components/ui/Input";
import { Label } from './../../../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";

export const DEFAULT_LAMINATE_RATE_PER_SQFT = 10;

const ClientQuoteSingle = () => {
    const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>() as { organizationId: string; quoteId: string }
    const navigate = useNavigate()

    const { data: quote, isLoading: quoteLoading } = useGetSingleClientQuote(organizationId!, quoteId!);
    // const { mutateAsync: blurMutate, isPending: blurPending } = useToggleBlurring();
    // let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
    // let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
    // let { data: labourCost = 0 } = useGetSingleLabourCost(organizationId!);

    // const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
    const { mutateAsync: sendtoPayment, isPending: paymentPending } = useSendQuoteToPaymentStage()
    const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);

    // const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    // const [selectedLaminateBrand, setSelectedLaminateBrand] = useState<string | null>(null);

    // const [isBlured, setIsBlured] = useState<boolean>(quote?.isBlured || false);
    const [isBlured, setIsBlured] = useState<boolean>(true);
    const [templateType, setTemplateType] = useState<"type 1" | "type 2" | "type 3">("type 1");


    // Extract all unique brand names from materialBrands data
    // const brandRatesByName: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
    //     if (!materialBrands) return {};

    //     const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

    //     materialBrands.forEach((item: any) => {
    //         const data = item?.data || {};
    //         const brandRaw = data.Brand ?? data.brand;
    //         const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
    //         let rsRaw = data.Rs || data.rs;
    //         if (
    //             brandRaw &&
    //             thicknessRaw &&
    //             // (typeof rsRaw === "number" || (typeof rsRaw === "string" && !isNaN(Number(rsRaw))))
    //             rsRaw
    //         ) {
    //             const brand = String(brandRaw).trim();
    //             const thickness = String(thicknessRaw).trim();
    //             const rs = parseFloat(rsRaw);

    //             if (!brandMap[brand]) brandMap[brand] = [];

    //             brandMap[brand].push({
    //                 thickness,
    //                 rs,
    //             });
    //         }
    //     });

    //     return brandMap;
    // }, [materialBrands]);

    // // Get clean unique brand names from this mapping
    // const brandOptions = useMemo(() => Object.keys(brandRatesByName), [brandRatesByName]);


    // // START OF LAMINATION
    // const laminateRatesByBrand: Record<string, { thickness: string; rs: number }[]> = useMemo(() => {
    //     if (!laminateBrands) return {};
    //     const brandMap: Record<string, { thickness: string; rs: number }[]> = {};

    //     laminateBrands.forEach((item: any) => {
    //         const data = item?.data || {};
    //         const brandRaw = data.Brand ?? data.brand;
    //         const thicknessRaw = data["thickness (mm)"] || data.thickness || data.Thickness;
    //         const rsRaw = data.Rs || data.rs;
    //         if (brandRaw && thicknessRaw && rsRaw) {
    //             const brand = String(brandRaw).trim();
    //             const thickness = String(thicknessRaw).trim();
    //             const rs = parseFloat(rsRaw);
    //             if (!brandMap[brand]) brandMap[brand] = [];
    //             brandMap[brand].push({ thickness, rs });
    //         }
    //     });

    //     return brandMap;
    // }, [laminateBrands]);

    // // ✅ Brand dropdown options
    // const laminateBrandOptions = useMemo(() => Object.keys(laminateRatesByBrand), [laminateRatesByBrand]);

    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [grandTotal, setGrandTotal] = useState(quote?.grandTotal || 0);
    // const [rawCostWithoutProfit, setRawCostWithoutProfit] = useState(0);

    // const updateGrandTotal = () => {
    //     const updatedFurnitures = furnitureRefs.current
    //         .map(ref => ref.current)
    //         .filter((ref): ref is FurnitureQuoteRef => ref !== null)
    //         .map(ref => ref.getUpdatedFurniture());

    //     console.log("updatedFurnitures", updatedFurnitures)

    //     const total = updatedFurnitures.reduce(
    //         (sum, f) => sum + f.totals.furnitureTotal,
    //         0
    //     );

    //     console.log("total", total)
    //     setGrandTotal(total);
    //     // setRawCostWithoutProfit(calculateCostWithoutProfit()); // 👈 Add this line
    // };


    useEffect(() => {
        setGrandTotal(quote?.grandTotal);
    }, [quote])

    // const { profitDifference, profitPercentage } = useMemo(() => {
    //     const diff = grandTotal - rawCostWithoutProfit;
    //     const percent = rawCostWithoutProfit > 0 ? (diff / rawCostWithoutProfit) * 100 : 0;

    //     return {
    //         profitDifference: Math.round(diff),
    //         profitPercentage: percent,
    //     };
    // }, [grandTotal, rawCostWithoutProfit]);


    // const calculateCostWithoutProfit = () => {
    //     const updatedFurnitures = furnitureRefs.current
    //         .map(ref => ref.current)
    //         .filter((ref): ref is FurnitureQuoteRef => ref !== null)
    //         .map(ref => ref.getUpdatedFurniture());

    //     const SHEET_SQFT = 32;
    //     let totalRawCost = 0;

    //     updatedFurnitures.forEach(furniture => {
    //         // Core materials
    //         const selectedBrandRates = furniture.plywoodBrand ? (brandRatesByName[furniture.plywoodBrand] || []) : [];
    //         const selectedLaminateRates = furniture.laminateBrand ? (laminateRatesByBrand[furniture.laminateBrand] || []) : [];

    //         // labour info is based on the first core row
    //         const coreRows = furniture.coreMaterials;
    //         const base = coreRows[0];
    //         // changed for labour cost
    //         // const totalLabourCost = (base?.carpenters || 0) * (base?.days || 0) * RATES.labour;
    //         const totalLabourCost = (base?.carpenters || 0) * (base?.days || 0) * labourCost;
    //         const labourPerRow = coreRows.length > 0 ? totalLabourCost / coreRows.length : 0;

    //         coreRows.forEach(row => {
    //             const plyRate = getRateForThickness(row.plywoodNos.thickness, selectedBrandRates, "plywood");
    //             const lamiRate = getRateForThickness(row.laminateNos.thickness, selectedLaminateRates, "laminate");

    //             const plyCost = row.plywoodNos.quantity * (plyRate * SHEET_SQFT);
    //             const lamiCost = row.laminateNos.quantity * (lamiRate * SHEET_SQFT);
    //             const baseMaterialCost = plyCost + lamiCost;

    //             totalRawCost += baseMaterialCost + labourPerRow; // ❌ No profit added
    //         });

    //         // Fittings, Glues, NBMs
    //         const getSimpleRowTotal = (row: any) => row.quantity * row.cost;
    //         const fittingsTotal = furniture.fittingsAndAccessories.reduce((sum, r) => sum + getSimpleRowTotal(r), 0);
    //         const gluesTotal = furniture.glues.reduce((sum, r) => sum + (r.cost || 0), 0);
    //         const nbmsTotal = furniture.nonBrandMaterials.reduce((sum, r) => sum + getSimpleRowTotal(r), 0);


    //         // 🔁 Fittings, Glues, NBMs — need to REMOVE profitOnMaterial (if any)

    //         // const getBaseCostWithoutProfit = (quantity: number, cost: number, profit: number = 0) => {
    //         //     const gross = quantity * cost;
    //         //     return gross / (1 + (profit / 100));
    //         // };

    //         // const getBaseGlueCostWithoutProfit = (cost: number, profit: number = 0) => {
    //         //     return cost / (1 + profit / 100);
    //         // };

    //         // const fittingsTotal = (furniture.fittingsAndAccessories || []).reduce((sum, item) =>
    //         //     sum + getBaseCostWithoutProfit(item.quantity || 0, item.cost || 0, item.profitOnMaterial || 0),
    //         //     0
    //         // );

    //         // const gluesTotal = (furniture.glues || []).reduce((sum, item) =>
    //         //     sum + getBaseGlueCostWithoutProfit(item.cost || 0, item.profitOnMaterial || 0),
    //         //     0
    //         // );

    //         // const nbmsTotal = (furniture.nonBrandMaterials || []).reduce((sum, item) =>
    //         //     sum + getBaseCostWithoutProfit(item.quantity || 0, item.cost || 0, item.profitOnMaterial || 0),
    //         //     0
    //         // );

    //         totalRawCost += fittingsTotal + gluesTotal + nbmsTotal;
    //     });

    //     return Math.round(totalRawCost);
    // };





    // const handleGenerateQuote = async () => {
    //     try {
    //         if (!organizationId || !quoteId || !quote || !selectedBrand) {
    //             toast({
    //                 title: "Missing info",
    //                 description: "Please ensure brand and all details are selected",
    //                 variant: "destructive",
    //             });
    //             return;
    //         }

    //         const updatedFurnitures = furnitureRefs.current
    //             .map(ref => ref.current)
    //             .filter((ref): ref is FurnitureQuoteRef => ref !== null)
    //             .map(ref => ref.getUpdatedFurniture());

    //         const updatedGrandTotal = updatedFurnitures.reduce(
    //             (sum, f) => sum + f.totals.furnitureTotal,
    //             0
    //         );

    //         const res: any = await generateQuote({
    //             quoteId: quoteId!,
    //             organizationId: organizationId,
    //             data: {
    //                 quoteId, // Required for readable reference
    //                 organizationId,
    //                 projectId: quote.projectId,
    //                 brandName: selectedBrand,
    //                 laminateBrand: selectedLaminateBrand, // ✅ Add this line (optional)
    //                 furnitures: updatedFurnitures,
    //                 grandTotal: updatedGrandTotal,
    //                 // grandTotal: calculatedVariantGrandTotal,
    //                 notes: "Generated with brand variant",

    //             }
    //         })
    //         // console.log("reso", res)
    //         downloadImage({ src: res.url, alt: res.fileName })
    //         toast({ title: "success", description: "scuesssfully vrated" })
    //     }
    //     catch (error: any) {
    //         toast({
    //             title: "Error",
    //             description: error?.response?.data?.message ?? "Operation failed",
    //         });
    //     }
    // }


    const handleSendToPayment = async () => {
        try {
            if (!organizationId || !quoteId || !quote) {
                toast({
                    title: "Missing info",
                    description: "Please ensure quote and all details are not missing",
                    variant: "destructive",
                });
                return;
            }

            if (!confirm("Are you sure want to send this quotation to payment?")) return;

            await sendtoPayment({ organizationId, id: quoteId })
            toast({ title: "success", description: "Quote Selected and stored in the payment stage" })
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    }


    const handletoggleBlur = async () => {
        try {
            // if (!confirm("Are you sure you need to show the stats?")) return;
            // if (!organizationId || !quoteId) {
            //     toast({
            //         title: "Missing info",
            //         description: "Please ensure quote and all details are not missing",
            //         variant: "destructive",
            //     });
            //     return;
            // }


            // await blurMutate({ organizationId, id: quoteId, isBlured: !isBlured })
            // toast({ title: "success", description: "Blurred Successfully" })
            // refetch()
            setIsBlured(p => !p)
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
            // plywoodBrand: selectedBrand,
            // laminateBrand: selectedLaminateBrand,

            plywoodBrand: "",
            laminateBrand: "",
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

    // useEffect(() => {
    //     if (!selectedBrand && brandOptions?.length > 0) {
    //         setSelectedBrand(brandOptions[0]);
    //     }
    // }, [brandOptions]);



    // // START OF LAMINATE
    // useEffect(() => {
    //     if (!selectedLaminateBrand && laminateBrandOptions?.length > 0) {
    //         setSelectedLaminateBrand(laminateBrandOptions[0]);
    //     }
    // }, [laminateBrandOptions]);





    return (
        <div className="p-2 max-h-full overflow-y-auto">

            <header className="bg-white border-b border-gray-200 pb-4 space-y-3">
                {/* Top Row - Project Info, Financial Summary, and Generate Button */}
                <div className="flex items-center justify-between gap-4">
                    {/* Left - Project Info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex cursor-pointer items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors flex-shrink-0"
                        >
                            <i className="fas fa-arrow-left text-gray-600 text-sm"></i>
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-gray-900 truncate">
                                {quote?.projectId?.projectName || "Project"}
                            </h1>
                            <p className="text-md text-gray-500">{quote?.quoteNo ? `Quote: #${quote?.quoteNo}` : ""}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-between  items-center">
                        <div className="px-4 text-center">
                            {/* <p className="text-xs text-gray-600">Quote</p> */}
                            <p className="text-md text-gray-600">Total Cost</p>
                            <p className="text-md font-bold text-green-600">₹{grandTotal?.toLocaleString("en-in")}</p>
                        </div>
                        <Button onClick={handleSendToPayment} disabled={paymentPending} className="flex-shrink-0 px-4 ">
                            {paymentPending ? "Sending..." : "Select Quote"}
                        </Button>

                        <div className="flex gap-2 w-fit px-4 justify-center">
                            {/* <input checked={!isBlured}  type="checkbox" id="blurinput" onClick={handletoggleBlur}
                                className="cursor-pointer" /> */}
                            {/* <Label htmlFor="blurinput" className=" cursor-pointer flex flex-4/2" >Show Stats</Label> */}

                            {/* <div className="flex items-center space-x-2"> */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isBlured}
                                    onChange={handletoggleBlur}
                                    className="sr-only"
                                    id="blurinput"
                                />
                                <div
                                    className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${!isBlured ? "bg-blue-600" : "bg-gray-200"}`}
                                >
                                    <div
                                        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${!isBlured ? "translate-x-5" : "translate-x-0"
                                            } mt-0.5 ml-0.5`}
                                    ></div>
                                </div>
                            </label>
                            {/* <label className="text-sm font-medium text-gray-700">This work is required for the project</label> */}
                            {/* </div> */}
                            <Label htmlFor="blurinput" className=" cursor-pointer flex flex-4/2" >Show Stats</Label>

                        </div>

                        <div className="w-full">
                            <Select onValueChange={(val: any) => setTemplateType(val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Template Type" selectedValue={templateType} />
                                </SelectTrigger>
                                <SelectContent>
                                    {["type 1", "type 2", "type 3"].map((option) => (
                                        <SelectItem key={option} value={option.toString()}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </div>

                {/* Bottom Row - Brand Selection */}
                {/* <div className="flex items-center gap-4">
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
                </div> */}

                {/* Mobile Financial Summary - Only visible on smaller screens */}
                <div className=" grid grid-cols-4 gap-2">
                    {/* <Card className="px-2 py-4 border-l-4 border-blue-600">
                        <div className="text-center">
                            <p className="text-md text-gray-600">Project Cost {" "} <span className="font-bold">(without profit)</span></p>

                            <p className="text-md font-bold text-blue-600">₹{rawCostWithoutProfit.toLocaleString("en-IN")}</p>
                        </div>
                    </Card> */}

                    {/* <Card className="px-2 py-4 border-l-4 border-green-600">
                        <div className="text-center">
                            <p className="text-md text-gray-600">Total Cost</p>
                            <p className="text-md font-bold text-green-600">₹{grandTotal?.toLocaleString("en-in")}</p>
                        </div>
                    </Card> */}

                    {/* <Card className="px-2 py-4 border-l-4 border-violet-600">
                        <div className="text-center">
                            <p className="text-md text-gray-600">Profit Amount</p>
                            <p className="text-md font-bold text-violet-600">₹{profitDifference.toLocaleString("en-IN")}
                                {" "}
                                <span className="text-black !text-[12px] ml-[5px] font-semibold">
                                    ({profitPercentage.toFixed(2)}%)
                                </span>
                            </p>


                        </div>
                    </Card> */}

                    {/* <Card className="px-2 py-4 border-l-4 border-orange-600">
                        <div className="text-center">
                            <p className="text-md text-gray-600">Single Labour Cost</p>
                            <p className="text-md font-bold text-orange-600">₹{labourCost}
                            </p>
                        </div>
                    </Card> */}
                </div>
            </header>

            {quoteLoading
                //  ||  loadingBrands
                ? (
                    <MaterialOverviewLoading />
                ) : (
                    <>
                        <div className="space-y-6">
                            {furnitures.map((furniture, index) => (
                                <ClientFurnitures
                                    key={index}
                                    index={index}
                                    data={furniture}
                                    ref={furnitureRefs.current[index] as React.RefObject<FurnitureQuoteRef>} // 🔄 Pass the ref down
                                    // labourCost={labourCost}
                                    // laminateRatesByBrand={laminateRatesByBrand}
                                    // brandRatesByName={brandRatesByName}
                                    // selectedBrand={selectedBrand}
                                    // selectedLaminateBrand={selectedLaminateBrand}
                                    // brandOptions={brandOptions}
                                    // laminateBrandOptions={laminateBrandOptions}
                                    // onFurnitureChange={updateGrandTotal}
                                    templateType={templateType}
                                    isBlurred={isBlured}

                                />
                            ))}

                            <div className="mt-10 text-right">
                                <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
                                    <p className="text-md font-medium text-gray-700 mb-1">
                                        Total Estimate
                                    </p>

                                    <p className="text-2xl font-bold text-green-700">
                                        ₹{grandTotal?.toLocaleString("en-in")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
};

export default ClientQuoteSingle;