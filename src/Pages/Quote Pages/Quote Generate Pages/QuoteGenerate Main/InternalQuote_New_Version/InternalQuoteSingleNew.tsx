import { useParams } from 'react-router-dom';
import { useGetSingleInternalQuote, useUpdateInternalQuote } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
// import { toast } from '../../../../../utils/toast';
import MaterialOverviewLoading from '../../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import InternalQuoteForm from './InternalQuoteNewForm';

const InternalQuoteSingleNew = () => {
    // 1. Extract IDs from URL parameters
    const { id:quoteId, organizationId , quoteType} = useParams() as {
        id: string;
        organizationId: string;
        quoteType: string;
    };

    // 2. Fetch the specific Quote Document
    const {
        data: quote,
        isLoading,
        isError,
        error,
        // refetch
    } = useGetSingleInternalQuote(organizationId, quoteId);

    // 3. Mutation for Updating Metadata (Name, Category, Project)
    const updateQuoteMutation = useUpdateInternalQuote();

    /**
     * Handle Update (Triggered when the Form is in 'edit' mode and submitted)
     */

    // const handleUpdate = async (updatedData: any) => {
    //     if (!id) return;
    //     try {
            

    //         await refetch();
    //         toast({ title: "Success", description: "Quote updated successfully" });
    //     } catch (err: any) {
    //         toast({
    //             title: "Update Failed",
    //             description: err.message || "Could not update the quote record",
    //             variant: "destructive"
    //         });
    //     }
    // };

    // 4. Loading and Error States
    if (isLoading) return <MaterialOverviewLoading />;
    if (isError) return (
        <div className="p-10 text-center">
            <i className="fas fa-exclamation-triangle text-red-500 mb-2"></i>
            <p className="text-red-500 font-bold">Error: {(error as any).message}</p>
        </div>
    );

    return (
        <main className="h-full overflow-hidden flex flex-col">
            {/* Reusable Form Component 
                Starts in 'view' mode as per your Accounting module standard
            */}
            <InternalQuoteForm
                mode="view"
                quoteType={quoteType}
                quoteId={quoteId}
                organizationId={organizationId}
                initialData={quote}
                // onSubmit={handleUpdate}
                isSubmitting={updateQuoteMutation.isPending}
            />
        </main>
    );
};

export default InternalQuoteSingleNew;