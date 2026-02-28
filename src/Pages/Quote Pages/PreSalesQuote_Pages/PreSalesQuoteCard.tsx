import React from 'react';
import { dateFormate } from '../../../utils/dateFormator';
import { toast } from '../../../utils/toast';
import { useClonePreSalesQuote, useDeletePreSalesQuote } from '../../../apiList/Quote Api/preSalesQuote_Api/preSalesQuoteApi';
import { Button } from '../../../components/ui/Button';

interface Props {
    data: any;
    index: number;
    onView: () => void;
}

const PreSalesQuoteCard: React.FC<Props> = ({ data, index, onView }) => {


    const deleteMutation = useDeletePreSalesQuote();
    const cloneMutation = useClonePreSalesQuote();



    // --- Delete Handler based on your reference ---
    const handleDelete = async (e: React.MouseEvent, quoteId: string) => {
        e.stopPropagation(); // Prevents navigation to single page

        // if (!window.confirm("Are you sure you want to delete this quote?")) return;

        try {
            await deleteMutation.mutateAsync(quoteId);
            // refetch(); // Note: useDeletePreSalesQuote hook already handles invalidation in its onSuccess
            toast({ title: "Success", description: "Quote deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to delete the quote",
                variant: "destructive"
            });
        }
    };



    const handleClone = async (e: React.MouseEvent, quoteId: string) => {
        e.stopPropagation();

        try {
            await cloneMutation.mutateAsync(quoteId);

            toast({
                title: "Success",
                description: "Quote cloned successfully"
            });

        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to clone the quote",
                variant: "destructive"
            });
        }
    };

    return (
        <div
            onClick={onView}
            className="grid grid-cols-11 border-b-gray-200 gap-4 px-6 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer items-center group"
        >
            <div className="col-span-1 text-center text-gray-400 font-medium text-sm">
                {index + 1}
            </div>

            <div className="col-span-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                    {data.quoteNo || 'QT-0000'}
                </span>
            </div>

            <div className="col-span-2">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 truncate text-sm">
                        {data?.mainQuoteName || 'N/A'}
                    </span>
                    <span className="text-[10px] text-gray-500 italic">
                        Created: {dateFormate(data.createdAt)}
                    </span>
                </div>
            </div>

            <div className="col-span-2 text-center text-sm font-medium text-gray-600">
                {data.carpetArea || 0} sqft
            </div>

            <div className="col-span-2 text-center font-bold text-gray-800 text-sm">
                ₹{data.totalAmount?.toLocaleString('en-IN') || '0'}
            </div>

            {/* <div className="col-span-1 text-center">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(data.status)}`}>
                    {data.status || 'Draft'}
                </span>
            </div> */}

            <div className="col-span-2 text-center flex justify-center gap-6">


                <Button
                    variant="secondary"
                    size="sm"
                    disabled={cloneMutation.isPending}
                    onClick={(e) => handleClone(e, data._id)}
                >
                    {cloneMutation?.isPending ? (
                        <i className="fas fa-circle-notch fa-spin text-xs"></i>
                    ) : (
                        <i className="fas fa-clone text-xs"></i>
                    )}
                </Button>


                <Button
                    variant='danger'

                    // isLoading={deleteMutation.isPending}
                    disabled={deleteMutation.isPending}
                    onClick={(e) => handleDelete(e, data._id)}
                    // className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 group-hover:text-slate-400"
                    size='sm'
                >
                    {deleteMutation?.isPending ? (
                        <i className="fas fa-circle-notch fa-spin text-xs"></i>
                    ) : (
                        <i className="fas fa-trash-alt text-xs"></i>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default PreSalesQuoteCard;