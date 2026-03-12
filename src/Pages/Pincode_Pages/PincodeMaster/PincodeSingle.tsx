
import { useParams } from "react-router-dom";
import { useGetSinglePincode, useUpdatePincode } from "../../../apiList/pincode_api/pincodeApi";
import type { PincodeFormData } from "./PinCodeMain";
import { toast } from "../../../utils/toast";
import PincodeForm from "./PincodeForm";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";


const PincodeSingle = () => {
    const { id } = useParams<{ id: string }>();
    const { data: pincode, isLoading, refetch } = useGetSinglePincode(id!);
    const updateMutation = useUpdatePincode();
    const { role, permission } = useAuthCheck();


    const canEdit = role === "owner" || permission?.pincode?.edit;


    const handleUpdate = async (data: PincodeFormData) => {
        try {
            await updateMutation.mutateAsync({ id: id!, pincodeData: data });
            await refetch();
            toast({ title: "Success", description: "Pincode updated successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    return (
        <PincodeForm
            mode="view"
            initialData={pincode}
            onSubmit={handleUpdate}
            isSubmitting={updateMutation.isPending}
            canEdit={canEdit}
        />
    );
};

export default PincodeSingle
