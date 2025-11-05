// CreatePurchaseAcc.tsx
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useCreatePurchase } from '../../../../apiList/Department Api/Accounting Api/purchaseAccApi';
import PurchaseAccForm from './PurchaseAccForm';

export interface PurchaseItem {
    itemName: string;
    quantity: number;
    rate: number;
    totalCost: number;
}

export interface CreatePurchasePayload {
    _id?: string,
    organizationId: string;
    vendorId: string;
    vendorName: string;
    deliveryAddress: string;
    purchaseOrderNumber: string;
    purchaseDate: string;
    deliveryDate: string;
    items: PurchaseItem[];
    totalAmount: number;
    // discountPercentage: number;
    // discountAmount?: number;
    // taxPercentage: number;
    // taxAmount?: number;
    // grandTotal: number;
    notes: string;
    termsAndConditions?: string
    createdAt?:string
}


export type PayloadPurchase = Omit<CreatePurchasePayload , "purchaseOrderNumber" >

const CreatePurchaseAcc = () => {
    const { organizationId } = useParams() as { organizationId: string }
    const createPurchaseMutation = useCreatePurchase();

    const handleSubmit = async (data:PayloadPurchase ) => {
        try {
            const payload: PayloadPurchase = {
                ...data,
                organizationId: organizationId!,
            };

            await createPurchaseMutation.mutateAsync({ purchaseData: payload });

            
            toast({ title: "Success", description: "Purchase Order created successfully" });
        } catch (error: any) {
            console.log("error", error)
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create the Purchase Order",
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto'>
            <PurchaseAccForm
                mode="create"
                organizationId={organizationId}
                onSubmit={handleSubmit}
                isSubmitting={createPurchaseMutation.isPending}
            />
        </main>
    );
};

export default CreatePurchaseAcc;