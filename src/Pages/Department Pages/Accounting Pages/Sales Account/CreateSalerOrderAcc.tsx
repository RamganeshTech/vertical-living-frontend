// CreateSalesOrderAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import SalesOrderAccountForm from './SalesOrderAccountForm';
import { useCreateSalesOrder } from '../../../../apiList/Department Api/Accounting Api/salesOrderApi';

export interface CreateSalesOrderPayload {
    customerId: string;
    organizationId: string;
    customerName: string;
    expectedShipmentDate: string
    salesOrderDate: string
    salesPerson?: string;
    subject?: string;

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

const CreateSalesOrderAcc = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const createSalesMutation = useCreateSalesOrder();

    const handleSubmit = async (data: CreateSalesOrderPayload) => {
        try {
            const payload: CreateSalesOrderPayload = {
                ...data,
                organizationId: organizationId!,
            };

            await createSalesMutation.mutateAsync({ salesData: payload });

            toast({ title: "Success", description: "Order created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create the order",
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto'>
            <SalesOrderAccountForm
                mode="create"
                organizationId={organizationId}
                onSubmit={handleSubmit}
                isSubmitting={createSalesMutation.isPending}
            />
        </main>
    );
};

export default CreateSalesOrderAcc;