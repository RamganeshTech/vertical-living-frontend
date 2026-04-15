import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import ExecutionPartnerAccountForm from './ExecutionPartnerAccountForm';
import { useCreateExecutionPartner, type CreateExecutionPartnerPayload } from '../../../../apiList/Department Api/Accounting Api/executionPartnerApi';

const CreateExpensePartnerAcc = () => {
    // const navigate = useNavigate();
    const { organizationId } = useParams();
    const createExecutionPartnerMutation = useCreateExecutionPartner();

    const handleSubmit = async (data: CreateExecutionPartnerPayload, files?: File[], shopImages?: File[]) => {
        try {
            const payload: CreateExecutionPartnerPayload = {
                ...data,
                organizationId: organizationId!,
                files: files || [],
                // mainImage: mainImage, // <--- Pass it here
                shopImages: shopImages,
            };

            await createExecutionPartnerMutation.mutateAsync(payload);

            toast({ title: "Success", description: "successfully created" })
        } catch (error: any) {
            toast({
                title: "Error", description: error?.response?.data?.message || error?.message ||
                    "Failed to create the partner", variant: "destructive"
            })
        }
    };

    return (
        <ExecutionPartnerAccountForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={createExecutionPartnerMutation.isPending}
        />
    );
};

export default CreateExpensePartnerAcc;