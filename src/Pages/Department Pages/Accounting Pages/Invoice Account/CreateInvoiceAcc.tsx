// CreateInvoiceAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useCreateInvoice } from '../../../../apiList/Department Api/Accounting Api/invoiceApi';
import InvoiceAccountForm from './InvoiceAccountForm';

export interface CreateInvoicePayload {
    _id?:string,
    customerId: string;
    organizationId: string;
    customerName: string;
    orderNumber?: string;
    accountsReceivable?: string;
    salesPerson?: string;
    subject?: string;
    invoiceDate: string;
    terms?: string;
    dueDate?: string;
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
    customerNotes?: string;
    termsAndConditions?: string;
}

const CreateInvoiceAcc = () => {
    const {organizationId } = useParams() as {organizationId:string}
    const createInvoiceMutation = useCreateInvoice();

    const handleSubmit = async (data: CreateInvoicePayload) => {
        try {
            const payload: CreateInvoicePayload = {
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
            <InvoiceAccountForm
                mode="create"
                organizationId={organizationId}
                onSubmit={handleSubmit}
                isSubmitting={createInvoiceMutation.isPending}
            />
        </main>
    );
};

export default CreateInvoiceAcc;