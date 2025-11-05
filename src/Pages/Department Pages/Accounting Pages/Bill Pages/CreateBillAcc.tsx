// CreateBillAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useCreateBill } from '../../../../apiList/Department Api/Accounting Api/billAccountApi';
import BillAccountForm from './BillAccForm';

export interface BillItem {
    itemName: string;
    quantity: number;
    rate: number;
    totalCost: number;
}

export interface CreateBillPayload {
    _id?: string,
    organizationId: string;
    vendorId: string;
    vendorName: string;
    billNumber: string;
    accountsPayable: string;
    subject: string;
    dueDate: string;
    billDate: string;
    items: BillItem[];
    totalAmount: number;
    discountPercentage: number;
    discountAmount: number;
    taxPercentage: number;
    taxAmount: number;
    grandTotal: number;
    notes: string;
    createdAt?:string
}

const CreateBillAcc = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const createBillMutation = useCreateBill();

    const handleSubmit = async (data: CreateBillPayload) => {
        try {
            const payload: CreateBillPayload = {
                ...data,
                organizationId: organizationId!,
            };

            await createBillMutation.mutateAsync({ billData: payload });

            toast({ title: "Success", description: "Bill created successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create the Bill",
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto'>
            <BillAccountForm
                mode="create"
                organizationId={organizationId}
                onSubmit={handleSubmit}
                isSubmitting={createBillMutation.isPending}
            />
        </main>
    );
};

export default CreateBillAcc;