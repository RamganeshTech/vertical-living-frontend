import React from 'react'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useDeleteQuote } from '../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi'
import { toast } from '../../../utils/toast'
import { useNavigate } from 'react-router-dom'
import { dateFormate, formatTime } from '../../../utils/dateFormator'
import { useAuthCheck } from '../../../Hooks/useAuthCheck'


type Props = {
    quote: any
    organizationId: string
}
const QuoteVarientCard: React.FC<Props> = ({ quote, organizationId }) => {
    const navigate = useNavigate();

     const { role, permission } = useAuthCheck();
        const canList = role === "owner" || permission?.quotevariant?.list;
        // const canCreate = role === "owner" || permission?.quotevariant?.create;
        const canDelete = role === "owner" || permission?.quotevariant?.delete;
        const canEdit = role === "owner" || permission?.quotevariant?.edit;
    

    const { mutateAsync: deleteQuote, isPending } = useDeleteQuote();

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
                            <h3 className="text-base font-bold text-blue-700 leading-[8px] ">
                                Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
                            </h3>
                            <span className="text-[12px] font-semibold text-gray-500">
                                Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
                            </span>
                        </div>


                        <p className="text-xs text-gray-500 ">
                            {/* Created on: {new Date(quote.createdAt).toLocaleString()} */}
                            Created on: {dateFormate(quote.createdAt)} - {formatTime(quote.createdAt)}
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
                  {(canList || canEdit ) &&   <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`single/${quote._id}`)}
                    >
                        <i className="fas fa-eye mr-1" /> View
                    </Button>}
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

export default QuoteVarientCard