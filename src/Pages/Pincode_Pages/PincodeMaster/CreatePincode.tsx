import { useParams } from "react-router-dom";
import { useCreatePincode } from "../../../apiList/pincode_api/pincodeApi";
import type { PincodeFormData } from "./PinCodeMain";
import { toast } from "../../../utils/toast";
import PincodeForm from "./PincodeForm";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

const CreatePincode = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const createMutation = useCreatePincode();
    const { role, permission } = useAuthCheck();

    const canCreate = role === "owner" || permission?.pincode?.create;

    const handleSubmit = async (data: PincodeFormData) => {
        try {
            await createMutation.mutateAsync({ ...data, organizationId });
            toast({ title: "Success", description: "Regional rules established" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return <PincodeForm mode="create" onSubmit={handleSubmit} isSubmitting={createMutation.isPending} canCreate={canCreate} />;
};

export default CreatePincode
