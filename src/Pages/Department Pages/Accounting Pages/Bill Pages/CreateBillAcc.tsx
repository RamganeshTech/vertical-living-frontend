// CreateBillAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useCreateBill } from '../../../../apiList/Department Api/Accounting Api/billAccountApi';
import BillAccountForm from './BillAccForm';
import { downloadImage } from '../../../../utils/downloadFile';

export interface BillItem {
    itemName: string;
    unit: string;
    quantity: number;
    rate: number;
    totalCost: number;
}

export interface CreateBillPayload {
    _id?: string,
    organizationId: string;
    vendorId: string | null;
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
    createdAt?: string,
    images: File[]
}

const CreateBillAcc = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const createBillMutation = useCreateBill();

    const handleSubmit = async (data: Omit<CreateBillPayload, 'images'>, newFiles: File[]) => {
        try {
            const payload: Omit<CreateBillPayload, 'images'> = {
                ...data,
                organizationId: organizationId!,
            };

            const res = await createBillMutation.mutateAsync({ billData: payload, files: newFiles });

            await downloadImage({ src: res.pdfData.url, alt: res.pdfData.originalName })

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