// InvoiceAccSingle.tsx
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceAccountForm from './InvoiceAccountForm';
import type { CreateInvoicePayload } from './CreateInvoiceAcc';
import { toast } from '../../../../utils/toast';
import { useGetSingleInvoice } from '../../../../apiList/Department Api/Accounting Api/invoiceApi';

const InvoiceAccSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const { data: invoice, isLoading, isError, error } = useGetSingleInvoice(id || '');

    const handleUpdate = async (_data: CreateInvoicePayload) => {
        try {
            // TODO: Implement update mutation when backend is ready
            // await updateInvoiceMutation.mutateAsync({ invoiceId: id!, invoiceData: data });

            toast({ title: "Success", description: "Invoice updated successfully" });
            navigate(-1);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to update the invoice",
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl mb-4"></i>
                    <p className="text-gray-600">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 font-semibold mb-2 text-2xl">
                    ⚠️ Error Loading Invoice
                </div>
                <p className="text-red-500 mb-4">
                    {(error as any)?.message || "Failed to load invoice"}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <main className='max-h-full overflow-y-auto'>

            <InvoiceAccountForm
                mode="view"
                organizationId={organizationId}
                initialData={invoice}
                onSubmit={handleUpdate}
                isSubmitting={false} // Update when mutation is implemented
            />
        </main>
    );
};

export default InvoiceAccSingle;