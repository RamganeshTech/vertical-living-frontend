

// CreateVendorPaymentAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useCreatevendorpayments } from '../../../../apiList/Department Api/Accounting Api/vendorPaymentApi';
import VendorPaymentAccForm from './VendorPaymentAccForm';

export interface VendorPaymentItem {
    date: string;
    billAmount: number;
    amountDue: number;
    paymentMadeOn: string | null;
}

export interface CreateVendorPaymentPayload {
    _id?: string,
    organizationId: string;
    vendorId: string
    vendorName: string;
    paymentNumber: string,
    paymentDate: string,
    paymentMode: string,
    paidThrough: string,
    items: VendorPaymentItem[]
    totalAmount: number
    totalDueAmount: number
    notes: string
    createdAt?: string
}


export type PayloadVendorPayload = Omit<CreateVendorPaymentPayload, "paymentNumber">

const CreateVendorPaymentAcc = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const createVendorPayMutation = useCreatevendorpayments();

    const handleSubmit = async (data: PayloadVendorPayload) => {
        try {
            const payload: PayloadVendorPayload = {
                ...data,
                organizationId: organizationId!,
            };

            await createVendorPayMutation.mutateAsync({ vendorpaymentsData: payload });


            toast({ title: "Success", description: "VendorPayment order created successfully" });
        } catch (error: any) {
            console.log("error", error)
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create the VendorPayment order",
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto'>
            <VendorPaymentAccForm
                mode="create"
                organizationId={organizationId}
                onSubmit={handleSubmit}
                isSubmitting={createVendorPayMutation.isPending}
            />
        </main>
    );
};

export default CreateVendorPaymentAcc;