// src/pages/PaymentPages/QuotePaymentChild.tsx

import { useNavigate, useParams } from "react-router-dom";
// import { usePaymentSingleQuotes } from "../../../apiList/Quote Api/ClientQuote/paymentQuoteApi";
import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { usePaymentSingleQuotes } from "../../../../apiList/Stage Api/Payment Api/paymentQuoteApi";
import { Button } from "../../../../components/ui/Button";
import ClientFurnitures from "../../../Quote Pages/ClientQuote Pages/ClientSingle Pages/ClientFurnitures";
import { useEffect, useRef, useState } from "react";
import type { FurnitureQuoteRef } from "../../../Quote Pages/Quote VariantGenerate Pages/FurnitureQuoteVariantForm";
import type { FurnitureBlock } from "../../../Quote Pages/Quote Generate Pages/QuoteGenerate Main/FurnitureForm";


const QuotePaymentChild = () => {
    const { projectId, id } = useParams<{ projectId: string; id: string }>() as { projectId: string; id: string }
    const navigate = useNavigate()

    let { data, isLoading, isError, error, refetch } = usePaymentSingleQuotes(projectId!, id!);
    const quote = data?.quoteId; // safe to use

    const furnitureRefs = useRef<Array<React.RefObject<FurnitureQuoteRef | null>>>([]);
    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [grandTotal, setGrandTotal] = useState(quote?.grandTotal || 0);


    useEffect(() => {
        if (quote?.grandTotal) {
            setGrandTotal(quote.grandTotal);
        }
    }, [quote?.grandTotal]);




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


    if (isLoading) return <MaterialOverviewLoading />;


    if (isError) return (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
            <div className="text-red-600 font-semibold mb-2">
                ⚠️ Error Occurred
            </div>
            <p className="text-red-500 text-sm mb-4">
                {(error as any)?.response?.data?.message ||
                    (error as any)?.message ||
                    "Failed to load payment confirmation data"}
            </p>
            <Button
                onClick={() => refetch()}
                className="bg-red-600 text-white px-4 py-2"
            >
                Retry
            </Button>
        </div>
    );

    console.log("quotes", quote)

    return (
        <div className="mt-2 max-h-full overflow-y-auto">

            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <h1 className="text-2xl text-blue-600 font-semibold">Quote Details - {quote?.quoteNo}</h1>

                </div>

                <div className="px-4 text-center flex gap-2 text-[20px]">
                    {/* <p className="text-xs text-gray-600">Quote</p> */}
                    <p className="text-md text-gray-600">Total Cost</p>
                    <p className="text-md font-bold text-green-600">₹{grandTotal?.toLocaleString("en-in")}</p>
                </div>
            </div>


            <div>

                {furnitures?.map((item: any, i: number) => {
                    return (
                        <ClientFurnitures
                            key={item._id}
                            data={item}
                            index={i}
                            isBlurred={false}
                            ref={furnitureRefs.current[i] as React.RefObject<FurnitureQuoteRef>}
                        />
                    )
                })}


            </div>



        </div>
    );
};

export default QuotePaymentChild;