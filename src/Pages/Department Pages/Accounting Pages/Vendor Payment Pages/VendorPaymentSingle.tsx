// VendorPaymentSingle.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useGetSinglevendorpayments } from '../../../../apiList/Department Api/Accounting Api/vendorPaymentApi';
import type { PayloadVendorPayload } from './CreateVendorPaymentAcc';
import VendorPaymentAccForm from './VendorPaymentAccForm';
import MaterialOverviewLoading from '../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

const VendorPaymentSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const { data: payment, isLoading, isError, error } = useGetSinglevendorpayments(id || '');

    const handleUpdate = async (_data: PayloadVendorPayload) => {
        try {
            // TODO: Implement update mutation when backend is ready
            // await updatepaymentsMutation.mutateAsync({ paymentId: id!, paymentData: data });

            toast({ title: "Success", description: "payments updated successfully" });
            navigate(-1);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to update the payment",
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className='max-h-full overflow-y-auto'>
                <MaterialOverviewLoading />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 font-semibold mb-2 text-2xl">
                    ⚠️ Error Loading payments
                </div>
                <p className="text-red-500 mb-4">
                    {(error as any)?.message || "Failed to load payment order"}
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

            <VendorPaymentAccForm
                mode="view"
                organizationId={organizationId}
                initialData={payment}
                onSubmit={handleUpdate}
                isSubmitting={false} // Update when mutation is implemented
            />
        </main>
    );
};

export default VendorPaymentSingle;