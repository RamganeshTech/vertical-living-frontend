// CreateInvoiceAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import RetailInvoiceAccountForm from './RetailInvoiceAccountForm';
import { useCreateRetailInvoice } from '../../../../apiList/Department Api/Accounting Api/retailinvoiceApi';

export interface RetailCreateInvoicePayload {
    customerId: string;
    organizationId: string;
    customerName: string;

    salesPerson?: string;
    subject?: string;
    invoiceDate: string;
   
    items: Array<{
        itemName: string;
        quantity: number;
        rate: number;
        totalCost: number;
    }>;
    totalAmount: number;
    discountPercentage?: number;
    discountAmount: number;
    taxPercentage?: number;
    taxAmount: number;
    grandTotal: number;
    
}

const RetailCreateInvoiceAcc = () => {
    const {organizationId } = useParams() as {organizationId:string}
    const createInvoiceMutation = useCreateRetailInvoice();

    const handleSubmit = async (data: RetailCreateInvoicePayload) => {
        try {
            const payload: RetailCreateInvoicePayload = {
                ...data,
                organizationId: organizationId!,
            };

            await createInvoiceMutation.mutateAsync({ invoiceData: payload });

            toast({ title: "Success", description: "Invoice created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create the invoice",
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto'>
            <RetailInvoiceAccountForm
                mode="create"
                organizationId={organizationId}
                onSubmit={handleSubmit}
                isSubmitting={createInvoiceMutation.isPending}
            />
        </main>
    );
};

export default RetailCreateInvoiceAcc;