import { useParams, useNavigate } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { useCreateAssignment } from "../../../apiList/pincode_api/pincodeVendorProjectAssignmentApi";
import PincodePartnerProjectform from "./PincodeVendorProjectform";

const CreatePincodeVendorProjectAssign = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const navigate = useNavigate();
    const createMutation = useCreateAssignment();

    const handleSubmit = async (data: any) => {
        try {
            await createMutation.mutateAsync({ ...data, organizationId });
            toast({ title: "Success", description: "Project legally assigned to partner" });
            navigate(-1);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <PincodePartnerProjectform 
            mode="create" 
            onSubmit={handleSubmit} 
            isSubmitting={createMutation.isPending} 
            canCreate={true} 
        />
    );
};

export default CreatePincodeVendorProjectAssign;