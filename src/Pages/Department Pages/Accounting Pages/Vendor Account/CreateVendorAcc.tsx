// src/components/Department/Accounting/vendorAccounts/CreatevendorAcc.tsx

import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import VendorAccountForm from './VendorAccountForm';
import { useCreateVendor, type CreateVendorPayload } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';

const CreateVendorAcc = () => {
    // const navigate = useNavigate();
    const { organizationId } = useParams();
    const createVendorMutation = useCreateVendor();

    const handleSubmit = async (data: CreateVendorPayload, files?: File[]) => {
        try {
            const payload: CreateVendorPayload = {
                ...data,
                organizationId: organizationId!,
                files: files || []
            };

            await createVendorMutation.mutateAsync(payload);

            toast({ title: "Success", description: "successfully created" })
        } catch (error: any) {
            toast({
                title: "Error", description: error?.response?.data?.message || error?.message ||
                    "Failed to create the vendor", variant: "destructive"
            })
        }
    };

    return (
        <VendorAccountForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={createVendorMutation.isPending}
        />
    );
};

export default CreateVendorAcc;