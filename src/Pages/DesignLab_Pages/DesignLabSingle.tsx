import { useParams } from 'react-router-dom';
import { useGetDesignLabById, useUpdateDesignLab } from '../../apiList/DesignLab_Api/designLabApi';
import { DesignLabForm, type IDesignLabFormData } from './DesignLabForm';
import { toast } from '../../utils/toast';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
// import { DesignLabForm, IDesignLabFormData } from './DesignLabForm';
// import { useGetDesignLabById, useUpdateDesignLab } from './hooks/useDesignLabHooks';
// import { toast } from '../../components/ui/use-toast';

 const DesignLabSingle = () => {
    const { id , organizationId} = useParams<{ id: string, organizationId:string }>();
    
    const { data: designData, isLoading, refetch } = useGetDesignLabById(id!);
    const { mutateAsync: updateDesign, isPending } = useUpdateDesignLab();

     const handleSubmit = async (formData: IDesignLabFormData) => {
        try {
            // 1. Destructure to remove fields we don't want to send in the body
            // (newRefFiles are for create, _id/createdAt are readonly)
            const { _id, createdAt, updatedAt, newRefFiles, referenceImages, ...payload } = formData as any;
            
            // 2. Filter & Clean Components (CRITICAL STEP)
            // We must remove empty rows and fix vendorId before sending to backend
            payload.components = payload.components.map((c: any) => ({
                ...c,
                materials: c.materials
                    // Filter: Keep row only if it has a name OR a rate
                    .filter((m: any) => m.materialName?.trim() || (m.rate !== "" && m.rate !== 0))
                    // Map: Clean vendorId ("" -> undefined/null)
                    .map((m: any) => ({
                        ...m,
                        vendorId: m.vendorId === "" ? null : m.vendorId, // Set to null or undefined
                        // Ensure image field exists if backend expects it, even if null
                        image: m.image || null
                    }))
            }));

            // 3. Send Update
            await updateDesign({ id: id!, updateData: payload });
            toast({ title: "Success", description: "Design updated successfully" });
            refetch(); 
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error.message || "Failed to update design", 
                variant: "destructive" 
            });
        }
    };

    if (isLoading) {
        return <div className="">
            <MaterialOverviewLoading />
        </div>;
    }

    if (!designData) return <div>Design not found</div>;

    return (
        <DesignLabForm 
            mode="edit" 
            organizationId={organizationId!}
            initialData={designData}
            onSubmit={handleSubmit}
            isLoading={isPending}
            onReset={() => refetch()}
        />
    );
};

export default DesignLabSingle;