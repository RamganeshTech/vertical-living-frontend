import { useParams } from "react-router-dom";
// import { useCreateMapping } from "../../apiList/pincode_api/pincodeVendorMappingApi";
// import { toast } from "../../utils/toast";
import PincodeVendorMappingForm from "./PincodeVendorMappingForm";
import { useCreateMapping } from "../../../apiList/pincode_api/pincodeMappingApi";
import { toast } from "../../../utils/toast";

const CreatePincodeVendorMapping = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const createMutation = useCreateMapping();

    const handleSubmit = async (data: any) => {
        try {
            await createMutation.mutateAsync({ ...data, organizationId });
            toast({ title: "Success", description: "Vendor-Pincode mapping established" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <PincodeVendorMappingForm 
            mode="create" 
            onSubmit={handleSubmit} 
            isSubmitting={createMutation.isPending} 
            canCreate={true} 
        />
    );
};

export default CreatePincodeVendorMapping;