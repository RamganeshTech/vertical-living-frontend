import { useParams } from 'react-router-dom';
import { toast } from '../../../utils/toast';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { useGetSingleAssignment, useUpdatePartnerPincodeAssignment } from '../../../apiList/pincode_api/pincodeVendorProjectAssignmentApi';
import PincodePartnerProjectform from './PincodeVendorProjectform';

const SinglePincodeVendorProjectAssign = () => {
    const { id } = useParams<{ id: string }>();
    const { data: assignment, isLoading, refetch } = useGetSingleAssignment(id!);
    const updateMutation = useUpdatePartnerPincodeAssignment();

    const handleUpdate = async (data: any) => {
        try {
            await updateMutation.mutateAsync({ 
                id: id!, 
                updateData: { status: data.status, notes: data.notes, projectId: data.projectId, partnerId:data.partnerId } 
            });
            await refetch();
            toast({ title: "Success", description: "Assignment parameters updated" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    return (
        <PincodePartnerProjectform 
            mode="view" 
            initialData={assignment} 
            onSubmit={handleUpdate} 
            isSubmitting={updateMutation.isPending} 
            canEdit={true} 
        />
    );
};

export default SinglePincodeVendorProjectAssign;