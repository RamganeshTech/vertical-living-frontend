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
                            <h3 className="text-sm font-bold text-blue-700  ">
                                Quote Name: <span className='text-black'>{quote?.mainQuoteName || "Quote"}</span>
                            </h3>
                            <p className="text-sm font-semibold text-blue-700  ">
                                Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
                            </p>
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




//  SECOND VERSION


// import React from 'react'
// import { Card, CardContent } from '../../../components/ui/Card'
// import { Button } from '../../../components/ui/Button'
// import { useDeleteQuote } from '../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi'
// import { toast } from '../../../utils/toast'
// import { useNavigate } from 'react-router-dom'
// import { dateFormate, formatTime } from '../../../utils/dateFormator'
// import { useAuthCheck } from '../../../Hooks/useAuthCheck'

// type Props = {
//     quote: any
//     organizationId: string
// }

// const QuoteVarientCard: React.FC<Props> = ({ quote, organizationId }) => {
//     const navigate = useNavigate();

//     const { role, permission } = useAuthCheck();
//     const canList = role === "owner" || permission?.quotevariant?.list;
//     const canDelete = role === "owner" || permission?.quotevariant?.delete;
//     const canEdit = role === "owner" || permission?.quotevariant?.edit;

//     const { mutateAsync: deleteQuote, isPending } = useDeleteQuote();

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteQuote({
//                 id: id!,
//                 organizationId: organizationId!,
//             });

//             toast({
//                 title: "Success",
//                 description: "Items deleted successfully",
//             });
//         }
//         catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message ?? "Operation failed",
//             });
//         }
//     };

//     return (
//         <Card
//             className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
//         >
//             <CardContent className="p-4 space-y-2">
//                 <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                         <div className='my-1'>
//                             {/* Main Quote Name as the primary title */}
//                             <h3 className="text-sm font-bold text-blue-700">
//                                 Quote Name: <span className='text-black'>{quote?.mainQuoteName || "Quote"}</span>
//                             </h3>
                            
//                             {/* Project Name clearly displayed below */}
//                             <p className="text-sm font-semibold text-blue-700">
//                                 Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
//                             </p>

//                             {/* Quote Number */}
//                             <span className="text-[12px] font-semibold text-gray-500">
//                                 Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
//                             </span>
//                         </div>

//                         {/* Timestamp */}
//                         <p className="text-xs text-gray-500">
//                             Created on: {dateFormate(quote.createdAt)} - {formatTime(quote.createdAt)}
//                         </p>
//                     </div>
                    
//                     {/* Top right delete button for easy access without absolute positioning */}
//                     {canDelete && (
//                         <button
//                             disabled={isPending}
//                             className="flex items-center justify-center w-8 h-8 rounded-full text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
//                             onClick={() => {
//                                 if (window.confirm("Are you sure you want to delete this quote variant?")) {
//                                     handleDelete(quote._id);
//                                 }
//                             }}
//                             title="Delete Quote"
//                         >
//                             {isPending ? (
//                                 <i className="fas fa-circle-notch fa-spin text-sm" />
//                             ) : (
//                                 <i className="fas fa-trash-alt text-sm" />
//                             )}
//                         </button>
//                     )}
//                 </div>

//                 {/* Furniture count or Square Feet work count logic */}
//                 {quote?.furnitures?.length > 0 ? (
//                     <p className="text-sm text-gray-500 italic">
//                         <strong>Furnitures: </strong> {quote.furnitures?.length || 0}
//                     </p>
//                 ) : (
//                     quote?.sqftRateWork?.length > 0 ? (
//                         <p className="text-sm text-gray-500 italic">
//                             <strong>Works: </strong> {quote?.sqftRateWork?.length || 0}
//                         </p>
//                     ) : <div className='h-6'></div>
//                 )}

//                 {/* Footer Buttons */}
//                 <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
//                     {(canList || canEdit) && (
//                         <Button
//                             size="sm"
//                             variant="secondary"
//                             onClick={() => navigate(`single/${quote._id}/${quote?.quoteType || 'single'}`)}
//                         >
//                             <i className="fas fa-eye mr-1" /> View
//                         </Button>
//                     )}
                    
//                     {/* Optional: Keeping the standard delete button in the footer as well, 
//                         or you can rely solely on the top-right one depending on your preference */}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export default QuoteVarientCard