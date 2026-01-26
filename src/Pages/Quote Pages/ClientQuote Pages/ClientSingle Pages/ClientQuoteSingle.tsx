// import React, { createRef, useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// // import { useGetMaterialBrands, useGetMaterialQuoteSingleEntry } from "../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
// import { type FurnitureBlock } from "../../Quote Generate Pages/QuoteGenerate Main/FurnitureForm";
// // import FurnitureQuoteVariantForm, { getRateForThickness, type FurnitureQuoteRef } from "./FurnitureQuoteVariantForm";

// import MaterialOverviewLoading from "../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { toast } from "../../../../utils/toast";
// import { Button } from "../../../../components/ui/Button";
// // import { Card } from "../../../../components/ui/Card";
// // import { useGetSingleLabourCost } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
// import ClientFurnitures, { type FurnitureQuoteRef } from "./ClientFurnitures";
// import { useGetSingleClientQuote, useSendQuoteToPaymentStage } from "../../../../apiList/Quote Api/ClientQuote/clientQuoteApi";
// // import { Input } from "../../../../components/ui/Input";
// import { Label } from './../../../../components/ui/Label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
// import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
// import { useGenerateClientQuotePdf } from "../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
// import { downloadImage } from "../../../../utils/downloadFile";

// export const DEFAULT_LAMINATE_RATE_PER_SQFT = 0;

// const ClientQuoteSingle = () => {
//     const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>() as { organizationId: string; quoteId: string }
//     const navigate = useNavigate()

//     const { role, permission } = useAuthCheck();
//     const canCreate = role === "owner" || permission?.clientquote?.create;
//     const canEdit = role === "owner" || permission?.clientquote?.edit;

//     const { data: quote, isLoading: quoteLoading } = useGetSingleClientQuote(organizationId!, quoteId!);
//     // const { mutateAsync: blurMutate, isPending: blurPending } = useToggleBlurring();
//     // let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
//     // let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
//     // let { data: labourCost = 0 } = useGetSingleLabourCost(organizationId!);

//     // const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
//     const { mutateAsync: sendtoPayment, isPending: paymentPending } = useSendQuoteToPaymentStage()
//     const { mutateAsync: generateQuotePdf, isPending: quotePending } = useGenerateClientQuotePdf()

//     const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [isBlured, setIsBlured] = useState<boolean>(true);
//     const [templateType, setTemplateType] = useState<"type 1" | "type 2" | "type 3">("type 1");

//     const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
//     const [grandTotal, setGrandTotal] = useState(quote?.grandTotal || 0);

//     useEffect(() => {
//         setGrandTotal(quote?.grandTotal);
//     }, [quote])



//     const handleSendToPayment = async () => {
//         try {
//             if (!organizationId || !quoteId || !quote) {
//                 toast({
//                     title: "Missing info",
//                     description: "Please ensure quote and all details are not missing",
//                     variant: "destructive",
//                 });
//                 return;
//             }

//             if (!confirm("Are you sure want to send this quotation to payment?")) return;

//             await sendtoPayment({ organizationId, id: quoteId })
//             toast({ title: "success", description: "Quote Selected and stored in the payment stage" })
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Operation failed",
//             });
//         }
//     }

//     const handleGenerateClientQuotePdf = async () => {
//         try {
//             if (!quote.projectId._id || !quoteId || !templateType) {
//                 toast({
//                     title: "Missing info",
//                     description: "Please ensure brand and all details are selected",
//                     variant: "destructive",
//                 });
//                 return;
//             }

//             const res: any = await generateQuotePdf({
//                 quoteId: quoteId!,
//                 type: templateType,
//                 projectId: quote.projectId._id
//             })
//             // console.log("reso", res)
//             await downloadImage({ src: res.url, alt: res.fileName })
//             toast({ title: "success", description: "pdf generated successfully" })
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || "Operation failed",
//                 variant: "destructive"
//             });
//         }
//     }


//     const handletoggleBlur = async () => {
//         try {
//             // if (!confirm("Are you sure you need to show the stats?")) return;
//             // if (!organizationId || !quoteId) {
//             //     toast({
//             //         title: "Missing info",
//             //         description: "Please ensure quote and all details are not missing",
//             //         variant: "destructive",
//             //     });
//             //     return;
//             // }


//             // await blurMutate({ organizationId, id: quoteId, isBlured: !isBlured })
//             // toast({ title: "success", description: "Blurred Successfully" })
//             // refetch()
//             setIsBlured(p => !p)
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Operation failed",
//             });
//         }
//     }


//     useEffect(() => {
//         if (!quote?.furnitures) return;

//         const transformed: FurnitureBlock[] = quote.furnitures.map((f: any) => ({
//             furnitureName: f.furnitureName,
//             coreMaterials: f.coreMaterials || [],
//             fittingsAndAccessories: f.fittingsAndAccessories || [],
//             glues: f.glues || [],
//             nonBrandMaterials: f.nonBrandMaterials || [],
//             totals: {
//                 core: f.coreMaterialsTotal || 0,
//                 fittings: f.fittingsAndAccessoriesTotal || 0,
//                 glues: f.gluesTotal || 0,
//                 nbms: f.nonBrandMaterialsTotal || 0,
//                 furnitureTotal: f.furnitureTotal || 0,
//             },
//             // plywoodBrand: selectedBrand,
//             // laminateBrand: selectedLaminateBrand,

//             plywoodBrand: "",
//             laminateBrand: "",
//         }));

//         setFurnitures(transformed);
//     }, [quote]);


//     if (furnitureRefs.current.length !== furnitures.length) {
//         furnitureRefs.current = furnitures.map(
//             (_, i) => furnitureRefs.current[i] ?? React.createRef<FurnitureQuoteRef>()
//         );
//     }

//     useEffect(() => {
//         console.log("furnitureRefs Array", furnitureRefs)
//         furnitureRefs.current = furnitures.map(
//             (_, i) => furnitureRefs.current[i] ?? createRef<FurnitureQuoteRef>()
//         );
//     }, [furnitures]);

//     return (
//         <div className="p-2 max-h-full overflow-y-auto">

//             <header className="bg-white border-b border-gray-200 pb-4 space-y-3">
//                 {/* Top Row - Project Info, Financial Summary, and Generate Button */}
//                 <div className="flex items-center justify-between gap-4">
//                     {/* Left - Project Info */}
//                     <div className="flex items-center gap-3 min-w-0">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="flex cursor-pointer items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors flex-shrink-0"
//                         >
//                             <i className="fas fa-arrow-left text-gray-600 text-sm"></i>
//                         </button>
//                         <div className="min-w-0">
//                             <h1 className="text-lg font-semibold text-gray-900 truncate">
//                                 {quote?.projectId?.projectName || "Project"}
//                             </h1>
//                             <p className="text-md text-gray-500">{quote?.quoteNo ? `Quote: #${quote?.quoteNo}` : ""}</p>
//                         </div>
//                     </div>

//                     <div className="flex gap-2 justify-between  items-center">
//                         <div className="px-4 text-center">
//                             {/* <p className="text-xs text-gray-600">Quote</p> */}
//                             <p className="text-md text-gray-600">Total Cost</p>
//                             <p className="text-md font-bold text-green-600">₹{grandTotal?.toLocaleString("en-in")}</p>
//                         </div>
//                         {(canCreate || canEdit) && <Button onClick={handleSendToPayment} disabled={paymentPending} className="flex-shrink-0 px-4 ">
//                             {paymentPending ? "Sending..." : "Send to Payment"}
//                         </Button>}

//                         {(canCreate || canEdit) && <Button onClick={handleGenerateClientQuotePdf} isLoading={quotePending} className="flex-shrink-0 px-4 ">
//                             Generate Pdf
//                         </Button>}

//                         <div className="flex gap-2 w-fit px-4 justify-center">
//                             {/* <input checked={!isBlured}  type="checkbox" id="blurinput" onClick={handletoggleBlur}
//                                 className="cursor-pointer" /> */}
//                             {/* <Label htmlFor="blurinput" className=" cursor-pointer flex flex-4/2" >Show Stats</Label> */}

//                             {/* <div className="flex items-center space-x-2"> */}
//                             <label className="relative inline-flex items-center cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={isBlured}
//                                     onChange={handletoggleBlur}
//                                     className="sr-only"
//                                     id="blurinput"
//                                 />
//                                 <div
//                                     className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${!isBlured ? "bg-blue-600" : "bg-gray-200"}`}
//                                 >
//                                     <div
//                                         className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${!isBlured ? "translate-x-5" : "translate-x-0"
//                                             } mt-0.5 ml-0.5`}
//                                     ></div>
//                                 </div>
//                             </label>
//                             {/* <label className="text-sm font-medium text-gray-700">This work is required for the project</label> */}
//                             {/* </div> */}
//                             <Label htmlFor="blurinput" className=" cursor-pointer flex flex-4/2" >Show Stats</Label>

//                         </div>

//                         <div className="w-full">
//                             <Select onValueChange={(val: any) => {
//                                 // let type: any = "type 1";
//                                 // if (val === "template 1") {
//                                 //     type = "type 1"
//                                 // }
//                                 // else if (val === "template 2") {
//                                 //     type = "type 2"
//                                 // }
//                                 // else if (val === "template 3") {
//                                 //     type = "type 3"

//                                 // }
//                                 setTemplateType(val)
//                             }}>
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Template Type" selectedValue={templateType} />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {["type 1", "type 2", "type 3"].map((option) => (
//                                         <SelectItem key={option} value={option.toString()}>
//                                             {option}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                 </div>
//             </header>

//             {quoteLoading
//                 ? (
//                     <MaterialOverviewLoading />
//                 ) : (
//                     <>
//                         <div className="space-y-6">
//                             {furnitures.map((furniture, index) => (
//                                 <ClientFurnitures
//                                     key={index}
//                                     index={index}
//                                     data={furniture}
//                                     ref={furnitureRefs.current[index] as React.RefObject<FurnitureQuoteRef>} // 🔄 Pass the ref down
//                                     // labourCost={labourCost}
//                                     // laminateRatesByBrand={laminateRatesByBrand}
//                                     // brandRatesByName={brandRatesByName}
//                                     // selectedBrand={selectedBrand}
//                                     // selectedLaminateBrand={selectedLaminateBrand}
//                                     // brandOptions={brandOptions}
//                                     // laminateBrandOptions={laminateBrandOptions}
//                                     // onFurnitureChange={updateGrandTotal}
//                                     templateType={templateType}
//                                     isBlurred={isBlured}
//                                     onImageClick={setSelectedImage}

//                                 />
//                             ))}

//                             <div className="mt-10 text-right">
//                                 <div className="inline-block bg-green-50 border border-green-200 rounded-md px-6 py-4">
//                                     <p className="text-md font-medium text-gray-700 mb-1">
//                                         Total Estimate
//                                     </p>

//                                     <p className="text-2xl font-bold text-green-700">
//                                         ₹{grandTotal?.toLocaleString("en-in")}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 )}





//             {/* Image Popup Modal */}
//             {selectedImage && (
//                 <div
//                     className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
//                     onClick={() => setSelectedImage(null)}
//                 >
//                     <div className="relative max-w-4xl max-h-[90vh]">
//                         <button
//                             className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
//                             onClick={() => setSelectedImage(null)}
//                         >
//                             <i className="fas fa-times"></i>
//                         </button>
//                         <img
//                             src={selectedImage}
//                             className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain border-4 border-white/10"
//                             alt="Enlarged view"
//                             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
//                         />
//                     </div>
//                 </div>
//             )}


//         </div>
//     );
// };

// export default ClientQuoteSingle;



//  SECOND VERSION


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
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import { useGenerateClientQuotePdf } from "../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { downloadImage } from "../../../../utils/downloadFile";

export const DEFAULT_LAMINATE_RATE_PER_SQFT = 0;

const ClientQuoteSingle = () => {
    const { organizationId, quoteId } = useParams<{ organizationId: string; quoteId: string }>() as { organizationId: string; quoteId: string }
    const navigate = useNavigate()

    const { role, permission } = useAuthCheck();
    const canCreate = role === "owner" || permission?.clientquote?.create;
    const canEdit = role === "owner" || permission?.clientquote?.edit;

    const { data: quote, isLoading: quoteLoading } = useGetSingleClientQuote(organizationId!, quoteId!);
    // const { mutateAsync: blurMutate, isPending: blurPending } = useToggleBlurring();
    // let { data: materialBrands, isLoading: loadingBrands } = useGetMaterialBrands(organizationId!, "plywood");
    // let { data: laminateBrands } = useGetMaterialBrands(organizationId!, "Laminate");
    // let { data: labourCost = 0 } = useGetSingleLabourCost(organizationId!);

    // const { mutateAsync: generateQuote, isPending: quotePending } = useGenerateQuotePdf()
    const { mutateAsync: sendtoPayment, isPending: paymentPending } = useSendQuoteToPaymentStage()
    const { mutateAsync: generateQuotePdf, isPending: quotePending } = useGenerateClientQuotePdf()

    const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isBlured, setIsBlured] = useState<boolean>(true);
    const [templateType, setTemplateType] = useState<"type 1" | "type 2" | "type 3">("type 1");

    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [grandTotal, setGrandTotal] = useState(quote?.grandTotal || 0);

    useEffect(() => {
        setGrandTotal(quote?.grandTotal);
    }, [quote])



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

    const handleGenerateClientQuotePdf = async () => {
        try {
            if (!quote.projectId._id || !quoteId || !templateType) {
                toast({
                    title: "Missing info",
                    description: "Please ensure brand and all details are selected",
                    variant: "destructive",
                });
                return;
            }

            const res: any = await generateQuotePdf({
                quoteId: quoteId!,
                type: templateType,
                projectId: quote.projectId._id
            })
            // console.log("reso", res)
            await downloadImage({ src: res.url, alt: res.fileName })
            toast({ title: "success", description: "pdf generated successfully" })
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Operation failed",
                variant: "destructive"
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

            plywoodBrand: f.plywoodBrand || "",
            innerLaminateBrand: f.innerLaminateBrand || "",
            outerLaminateBrand: f.outerLaminateBrand || "",
            fabricationCost: f.fabricationCost || 0,

            // plywoodBrand: "",
            // laminateBrand: "",
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
                        {(canCreate || canEdit) && <Button onClick={handleSendToPayment} disabled={paymentPending} className="flex-shrink-0 px-4 ">
                            {paymentPending ? "Sending..." : "Send to Payment"}
                        </Button>}

                        {(canCreate || canEdit) && <Button onClick={handleGenerateClientQuotePdf} isLoading={quotePending} className="flex-shrink-0 px-4 ">
                            Generate Pdf
                        </Button>}

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
                            <Select onValueChange={(val: any) => {
                                // let type: any = "type 1";
                                // if (val === "template 1") {
                                //     type = "type 1"
                                // }
                                // else if (val === "template 2") {
                                //     type = "type 2"
                                // }
                                // else if (val === "template 3") {
                                //     type = "type 3"

                                // }
                                setTemplateType(val)
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Template Type" selectedValue={templateType[0].toUpperCase()+templateType.slice(1)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {["type 1", "type 2", "type 3"].map((option) => (
                                        <SelectItem key={option} value={option.toString()}>
                                            {option[0].toUpperCase()+option.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </div>
            </header>

            {quoteLoading
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
                                    templateType={templateType}
                                    isBlurred={isBlured}
                                    onImageClick={setSelectedImage}

                                />
                            ))}


                            {/* --- COMMON MATERIALS SECTION (FOR CLIENT VIEW) --- */}
                            {/* --- COMMON MATERIALS SECTION (REPLICATING SIMPLE SECTION UI) --- */}
                            {templateType !== "type 2" && quote?.commonMaterials?.length > 0 && (
                                <div className="mt-10 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                                    <h3 className="font-semibold text-md mb-2 text-gray-800 flex items-center gap-2">
                                        {/* <i className="fas fa-boxes text-blue-500" /> */}
                                        Common Site Materials
                                        <span className="text-sm  ml-1">
                                            (Total: ₹{quote.commonMaterials.reduce((sum: number, item: any) => sum + (item.rowTotal || 0), 0).toLocaleString("en-IN")})
                                        </span>
                                    </h3>

                                    <div className="overflow-x-auto rounded-md border border-gray-100">
                                        {(templateType !== "type 3") && (<table className="min-w-full text-sm bg-white shadow-sm">
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
                                                {quote.commonMaterials.map((item: any, i: number) => (
                                                    <tr key={i} className="border-b hover:bg-gray-50/50 transition-colors">
                                                        <td className="text-center border p-2">
                                                            <span className={isBlured ? "blur-sm select-none" : ""}>
                                                                {item?.itemName || "—"}
                                                            </span>
                                                        </td>
                                                        <td className="text-center border p-2">
                                                            <span className={isBlured ? "blur-sm select-none" : ""}>
                                                                {item?.description || "—"}
                                                            </span>
                                                        </td>
                                                        <td className="text-center border p-2">
                                                            <span className={isBlured ? "blur-sm select-none" : ""}>
                                                                {item?.quantity || 0}
                                                            </span>
                                                        </td>
                                                        <td className="text-center border p-2">
                                                            <span className={isBlured ? "blur-sm select-none" : ""}>
                                                                ₹{item?.cost?.toLocaleString("en-IN") || 0}
                                                            </span>
                                                        </td>
                                                        <td className="text-center border p-2 text-green-700 font-bold">
                                                            <span className={isBlured ? "blur-sm select-none" : ""}>
                                                                ₹{(item.rowTotal || 0).toLocaleString("en-IN")}
                                                            </span>
                                                        </td>
                                                        <td className="text-center border p-2 text-gray-400">—</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        )}
                                    </div>
                                </div>
                            )}

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


            {/* Image Popup Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <img
                            src={selectedImage}
                            className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain border-4 border-white/10"
                            alt="Enlarged view"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                        />
                    </div>
                </div>
            )}


        </div>
    );
};

export default ClientQuoteSingle;