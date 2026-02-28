import React from 'react'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
// import { useDeleteQuote } from '../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi'
// import { toast } from '../../../utils/toast'
import { useNavigate } from 'react-router-dom'
import { dateFormate, formatTime } from './../../../utils/dateFormator';
import { useDeleteClientQuote } from '../../../apiList/Quote Api/ClientQuote/clientQuoteApi';
import { toast } from '../../../utils/toast';
// import { useAuthCheck } from '../../../Hooks/useAuthCheck';

type Props = {
    quote: any
    organizationId?: string
    canDelete: boolean
}
const QuoteClientCard: React.FC<Props> = ({ quote, canDelete }) => {
    const navigate = useNavigate();

    const { mutateAsync: deleteQuote, isPending } = useDeleteClientQuote()




    // const { mutateAsync: deleteQuote, isPending } = useDeleteQuote();

    const handleDelete = async (id: string) => {
        try {

            await deleteQuote({
                id: id!,
            });

            toast({
                title: "Success",
                description: "Items deleted successfully",
            });

            // refetch()
        }
        catch (error: any) {
            console.log("error", error)
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    };



    // return (
    //     <Card
    //         className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
    //     >
    //         <CardContent className="p-4 space-y-2">
    //             <div className="flex items-start justify-between">
    //                 <div>

    //                     <div className='my-1'>
    //                         <h3 className="text-sm font-bold text-blue-700  ">
    //                             Quote Name: <span className='text-black'>{quote?.mainQuoteName || "Quote"}</span>
    //                         </h3>
    //                         <h3 className="text-sm font-bold text-blue-700 ">
    //                             Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
    //                         </h3>
    //                         <span className="text-[12px] font-semibold text-gray-500">
    //                             Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
    //                         </span>

    //                         <p className="text-[12px] font-semibold text-gray-500">
    //                             Internal Quote No : <span className='text-black'>{quote?.quoteId?.quoteNo || "N/A"}</span>
    //                         </p>
    //                     </div>


    //                     <p className="text-xs text-gray-500 ">
    //                         Created on: {dateFormate(quote.createdAt)} - {formatTime(quote.createdAt)}
    //                     </p>
    //                 </div>
    //                 <i className="fas fa-file-alt text-gray-400 text-xl" />
    //             </div>

    //             {/* <p className="text-sm text-gray-600 mt-2">
    //                                 <strong>Grand Total:</strong> ₹{quote.grandTotal.toLocaleString("en-IN")}
    //                             </p> */}

    //             <p className="text-sm text-gray-500 italic">
    //                 <strong>Furnitures: </strong> {quote.furnitures?.length || 0}
    //             </p>

    //             <div className="flex justify-end gap-2 pt-2">
    //                 <Button
    //                     size="sm"
    //                     variant="secondary"
    //                     onClick={() => navigate(`single/${quote._id}/${quote?.quoteType}`)}
    //                 >
    //                     <i className="fas fa-eye mr-1" /> View
    //                 </Button>
    //                 {canDelete && <Button
    //                     size="sm"
    //                     isLoading={isPending}
    //                     variant="danger"
    //                     className="bg-red-600 text-white"
    //                     onClick={() => handleDelete(quote._id)}
    //                 >
    //                     <i className="fas fa-trash mr-1" /> Delete
    //                 </Button>}

    //             </div>
    //         </CardContent>
    //     </Card>
    // )


    // return (
    //     <Card className="w-full border-l-4 border-blue-600 shadow-sm bg-white hover:shadow-md transition-all duration-200">
    //         <CardContent className="p-5">
    //             {/* Header Section */}
    //             <div className="flex justify-between items-start mb-4">
    //                 <div className="space-y-1">
    //                     <div className="flex items-center gap-2">
    //                         <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
    //                             {quote?.quoteType || "Standard"}
    //                         </span>
    //                         <h3 className="text-base font-bold text-gray-900 leading-tight">
    //                             {quote?.mainQuoteName || "Unnamed Quote"}
    //                         </h3>
    //                     </div>
    //                     <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
    //                         <i className="fas fa-project-diagram text-xs" />
    //                         {quote?.projectId?.projectName || "No Project Assigned"}
    //                     </p>
    //                 </div>
    //                 <div className="text-right">
    //                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Quote No</p>
    //                     <p className="text-sm font-black text-gray-800">{quote.quoteNo || "N/A"}</p>
    //                 </div>
    //             </div>

    //             {/* Info Grid */}
    //             <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 mb-4">
    //                 <div>
    //                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Internal Ref</p>
    //                     <p className="text-xs font-semibold text-gray-700">{quote?.quoteId?.quoteNo || "N/A"}</p>
    //                 </div>
    //                 <div className="text-right">
    //                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Items</p>
    //                     <p className="text-xs font-semibold text-gray-700">
    //                         <i className="fas fa-couch mr-1 text-blue-400" />
    //                         {quote.furnitures?.length || 0} Products
    //                     </p>
    //                 </div>
    //             </div>

    //             {/* Footer Section */}
    //             <div className="flex items-center justify-between">
    //                 <div className="flex flex-col">
    //                     <span className="text-[10px] text-gray-400 font-medium">Created On</span>
    //                     <span className="text-[11px] text-gray-600 font-semibold">
    //                         {dateFormate(quote.createdAt)} <span className="text-gray-300 mx-1">|</span> {formatTime(quote.createdAt)}
    //                     </span>
    //                 </div>

    //                 <div className="flex gap-2">
    //                     <Button
    //                         size="sm"
    //                         variant="secondary"
    //                         className="h-8 px-3 text-xs font-bold"
    //                         onClick={() => navigate(`single/${quote._id}/${quote?.quoteType}`)}
    //                     >
    //                         <i className="fas fa-eye mr-1.5" /> View
    //                     </Button>

    //                     {canDelete && (
    //                         <Button
    //                             size="sm"
    //                             isLoading={isPending}
    //                             variant="danger"
    //                             className="h-8 px-3 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-none transition-colors"
    //                             onClick={() => handleDelete(quote._id)}
    //                         >
    //                             <i className="fas fa-trash mr-1.5" /> Delete
    //                         </Button>
    //                     )}
    //                 </div>
    //             </div>
    //         </CardContent>
    //     </Card>
    // )

    return (
        <Card className="w-full border-l-4 border-blue-600 shadow-sm bg-white hover:shadow-md transition-all">
            <CardContent className="p-4">
                {/* Header: Name and Quote No */}
                {/* <div className="flex justify-between items-start mb-3">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            {quote?.quoteType && <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                {quote?.quoteType}
                            </span>}
                            <h3 className="text-sm font-bold text-gray-900">
                                {quote?.mainQuoteName || "Unnamed Quote"}
                            </h3>
                        </div>
                        <p className="text-[12px] font-medium text-blue-600 flex items-center gap-1">
                            <i className="fas fa-project-diagram text-[10px]" />
                            {quote?.projectId?.projectName || "No Project"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Quote No</p>
                        <p className="text-xs font-black text-gray-800">{quote.quoteNo || "N/A"}</p>
                    </div>
                </div> */}

                <div className="flex justify-between items-start mb-3 gap-4">
                    {/* Left Section: Type, Name, and Project */}
                    {/* flex-1 and min-w-0 are crucial to allow internal text to wrap/truncate */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            {quote?.quoteType && (
                                <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                                    {quote?.quoteType}
                                </span>
                            )}
                            {/* Using leading-tight to keep the lines close when it wraps */}
                            <h3 className="text-sm font-bold text-gray-900 break-words leading-tight">
                                {quote?.mainQuoteName || "Unnamed Quote"}
                            </h3>
                        </div>
                        <p className="text-[12px] font-medium text-blue-600 flex items-center gap-1 truncate">
                            <i className="fas fa-project-diagram text-[10px]" />
                            <span className="truncate">{quote?.projectId?.projectName || "No Project"}</span>
                        </p>
                    </div>

                    {/* Right Section: Quote No */}
                    {/* flex-shrink-0 prevents this div from getting squeezed */}
                    <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Quote No</p>
                        <p className="text-xs font-black text-gray-800 whitespace-nowrap">{quote.quoteNo || "N/A"}</p>
                    </div>
                </div>

                {/* Info Section: IDs and Items */}
                <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50 mb-3">
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Internal Quote No</p>
                        <p className="text-[11px] font-semibold text-gray-700">{quote?.quoteId?.quoteNo || "N/A"}</p>
                    </div>
                    {/* <div className="text-right">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Products</p>
                        <p className="text-[11px] font-semibold text-gray-700">
                            <i className="fas fa-couch mr-1 text-blue-400 text-[10px]" />
                            {quote.furnitures?.length || 0} Items
                        </p>
                    </div> */}

                    <div className="text-right">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Created</p>
                        <p className="text-[10px] text-gray-600 font-semibold mt-1">
                            {dateFormate(quote.createdAt)}
                            <span className="text-gray-300 mx-0.5">|</span>
                            {formatTime(quote.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Footer: Date and Buttons */}
                <div className="flex items-center justify-end">
                    {/* <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase leading-none">Created</span>
                        <span className="text-[10px] text-gray-600 font-semibold mt-1">
                            {dateFormate(quote.createdAt)} <span className="text-gray-300 mx-0.5">|</span> {formatTime(quote.createdAt)}
                        </span>
                    </div> */}

                    <div className="flex gap-1.5">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 px-2.5 text-[11px] font-bold"
                            onClick={() => navigate(`single/${quote._id}/${quote?.quoteType}`)}
                        >
                            <i className="fas fa-eye mr-1" /> View
                        </Button>

                        {canDelete && (
                            <Button
                                size="sm"
                                isLoading={isPending}
                                variant="danger"
                                className="h-7 px-2.5 text-[11px] font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-none transition-colors"
                                onClick={() => handleDelete(quote._id)}
                            >
                                <i className="fas fa-trash mr-1" /> Delete
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuoteClientCard