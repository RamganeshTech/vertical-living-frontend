import { useParams } from 'react-router-dom';
import { useGetSingleMapping, useUpdateMapping } from '../../../apiList/pincode_api/pincodeMappingApi';
import { toast } from '../../../utils/toast';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import PincodeVendorMappingForm from './PincodeVendorMappingForm';
// import { toast } from '../../utils/toast';
// import { useGetSingleMapping, useUpdateMapping } from '../../apiList/pincode_api/pincodeVendorMappingApi';
// import PincodeVendorMappingForm from './PincodeVendorMappingForm';
// import MaterialOverviewLoading from '../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

const PincodeVendorMappingSingle = () => {
    const { id } = useParams<{ id: string }>();
    const { data: mapping, isLoading, refetch } = useGetSingleMapping(id!);
    const updateMutation = useUpdateMapping();

    const handleUpdate = async (data: any) => {
        try {
            await updateMutation.mutateAsync({ id: id!, mappingData: data });
            await refetch();
            toast({ title: "Success", description: "Mapping parameters updated" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;

    return (
        <PincodeVendorMappingForm 
            mode="view" 
            initialData={mapping} 
            onSubmit={handleUpdate} 
            isSubmitting={updateMutation.isPending} 
            canEdit={true} 
        />
    );
};

export default PincodeVendorMappingSingle;