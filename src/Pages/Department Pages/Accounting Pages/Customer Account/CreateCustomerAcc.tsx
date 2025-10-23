// src/components/Department/Accounting/CustomerAccounts/CreateCustomerAcc.tsx

import { useParams } from 'react-router-dom';
import CustomerAccountForm from './CustomerAccountForm';
import { useCreateCustomer, type CreateCustomerPayload } from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import { toast } from '../../../../utils/toast';

const CreateCustomerAcc = () => {
    // const navigate = useNavigate();
    const { organizationId } = useParams();
    const createCustomerMutation = useCreateCustomer();

    const handleSubmit = async (data: CreateCustomerPayload, files?: File[]) => {
        try {
            const payload: CreateCustomerPayload = {
                ...data,
                organizationId: organizationId!,
                files: files || []
            };

            await createCustomerMutation.mutateAsync(payload);

            toast({ title: "Success", description: "successfully created" })
            // navigate(`/organization/${organizationId}/department/accounting/customer`);
        } catch (error: any) {
            toast({
                title: "Error", description: error?.response?.data?.message || error?.message ||
                    "Failed to create the customer", variant: "destructive"
            })
        }
    };

    return (
        <CustomerAccountForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={createCustomerMutation.isPending}
        />
    );
};

export default CreateCustomerAcc;