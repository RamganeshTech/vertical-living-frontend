import React from 'react'
import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { useDeleteQuote } from '../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi'
import { toast } from '../../../../utils/toast'
import type { FurnitureBlock } from './FurnitureForm'
import { dateFormate, formatTime } from './../../../../utils/dateFormator';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck'


type Props = {
    quote: any
    organizationId: string
    setFurnitures: React.Dispatch<React.SetStateAction<FurnitureBlock[]>>
    setIsEditingId: React.Dispatch<React.SetStateAction<string | null>>
    setQuoteType: React.Dispatch<React.SetStateAction<"single" | "residential" | null>>
    setFiltersMain: React.Dispatch<React.SetStateAction<{
        projectId: string;
        projectName: string;
    }>>
    setEditQuoteNo: React.Dispatch<React.SetStateAction<string | null>>
}



const QuoteGenerateCard: React.FC<Props> = ({ quote, organizationId, setFurnitures, setIsEditingId, setQuoteType,  setEditQuoteNo, setFiltersMain }) => {

    const { mutateAsync: deleteQuote, isPending } = useDeleteQuote();

     const { role, permission } = useAuthCheck();
        // const canList = role === "owner" || permission?.internalquote?.list;
        // const canCreate = role === "owner" || permission?.internalquote?.create;
        const canDelete = role === "owner" || permission?.internalquote?.delete;
        // const canEdit = role === "owner" || permission?.internalquote?.edit;
    

    const handleDelete = async (id: string) => {
        try {

            await deleteQuote({
                id: id!,
                organizationId: organizationId!,
            });

            toast({
                title: "Success",
                description: "Items deleted successfully",
            });

            // refetch()
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    };



    return (
        <Card
            className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
        >
            <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                    <div>

                        <div className='my-1'>
                            <h3 className="text-sm font-bold text-blue-700  ">
                                Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
                            </h3>
                            <span className="text-[12px] font-semibold text-gray-500">
                                Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
                            </span>
                        </div>


                        <p className="text-xs text-gray-500 ">
                            Created on: {dateFormate(quote.createdAt)} -  {formatTime(quote.createdAt)}
                        </p>
                    </div>
                    <i className="fas fa-file-alt text-gray-400 text-xl" />
                </div>

                {/* <p className="text-sm text-gray-600 mt-2">
                                    <strong>Grand Total:</strong> ₹{quote.grandTotal.toLocaleString("en-IN")}
                                </p> */}

                <p className="text-sm text-gray-500 italic">
                    <strong>Furnitures: </strong> {quote.furnitures?.length || 0}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                    {/* <Button
                        size="sm"
                        variant="secondary"
                    onClick={() => navigate(`single/${quote._id}`)}
                    >
                        <i className="fas fa-eye mr-1" /> View
                    </Button> */}
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                            const { furnitures} = quote;

                            const parsedFurniture = furnitures.map((f: any) => ({
                                furnitureName: f.furnitureName,
                                coreMaterials: f.coreMaterials.map((cm: any) => ({
                                    itemName: cm?.itemName || "",
                                    plywoodNos: cm?.plywoodNos || { quantity: 0, thickness: 0 },
                                    laminateNos: cm.laminateNos || { quantity: 0, thickness: 0 },
                                    carpenters: cm.carpenters || 0,
                                    days: cm.days || 0,
                                    profitOnMaterial: cm.profitOnMaterial || 0,
                                    profitOnLabour: cm.profitOnLabour || 0,
                                    rowTotal: cm.rowTotal || 0,
                                    remarks: cm.remarks || "",
                                    imageUrl: cm.imageUrl || "", // 🔁 PRESERVE image
                                    previewUrl: cm.imageUrl || "", // 🔁 preview if needed
                                })),
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
                            }));
                            console.log("parsedFurniture", parsedFurniture)
                            setEditQuoteNo(quote?.quoteNo)
                            setFurnitures(parsedFurniture)
                            setIsEditingId(quote._id)
                            setQuoteType(() => {
                                if (quote?.furnitures?.length > 1) {
                                    return "residential"
                                } else {
                                    return "single"
                                }
                            })
                            
                            setFiltersMain({
                                projectId: quote.projectId._id,
                                projectName: quote.projectId.projectName
                            })
                        }}
                    >
                        <i className="fas fa-eye mr-1" /> Edit
                    </Button>
                   {canDelete && <Button
                        size="sm"
                        isLoading={isPending}
                        variant="danger"
                        className="bg-red-600 text-white"
                        onClick={() => handleDelete(quote._id)}
                    >
                        <i className="fas fa-trash mr-1" /> Delete
                    </Button>}

                </div>
            </CardContent>
        </Card>
    )
}

export default QuoteGenerateCard