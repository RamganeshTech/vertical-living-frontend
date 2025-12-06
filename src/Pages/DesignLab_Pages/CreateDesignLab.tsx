import { useNavigate, useParams } from 'react-router-dom';
import { useCreateDesignLab } from '../../apiList/DesignLab_Api/designLabApi';
import { DesignLabForm, type IDesignLabFormData } from './DesignLabForm';
import { toast } from '../../utils/toast';
// import { DesignLabForm, IDesignLabFormData } from './DesignLabForm';
// import { useCreateDesignLab } from './hooks/useDesignLabHooks'; // Adjust path
// import { toast } from '../../components/ui/use-toast';

const CreateDesignLab = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams<{ organizationId: string }>();
    const { mutateAsync: createDesign, isPending } = useCreateDesignLab();

    const handleSubmit = async (formData: IDesignLabFormData) => {
         const submissionData = new FormData();

        // --- 1. CLEAN & FILTER DATA ---
        // const filteredComponents = formData.components.map(comp => ({
        //     ...comp,
        //     materials: comp.materials
        //         // Filter Step: Keep only if materialName OR rate exists (ignore default unit)
        //         .filter(m => m.materialName?.trim() || (m.rate !== "" && m.rate !== 0))
        //         // Map Step: Clean vendorId to avoid BSON error
        //         .map(m => ({
        //             ...m,
        //             // If vendorId is an empty string, set to undefined so Mongoose ignores it or treats as null
        //             vendorId: m.vendorId === "" ? undefined : m.vendorId
        //         }))
        // }));
        
        // const dataPayload = {
        //     ...formData,
        //     components: filteredComponents,
        //     organizationId,
        // };
        
        // 2. File Mapping Logic (No changes needed here, just ensuring we map correctly)
        const fileMapping: any[] = [];
        
        // Ref Images
        formData.newRefFiles.forEach((file) => {
            submissionData.append('files', file);
            fileMapping.push({ target: 'reference' });
        });

        // Material Images
        // IMPORTANT: We must iterate over the original formData to find files, 
        // BUT we need to match the index of the *filtered* list if we are filtering above.
        // However, filtering changes indices. 
        // BETTER APPROACH: Filter formData.components first, then iterate that filtered list for both dataPayload AND fileMapping.
        
        // Let's redo the logic to be safe:
        
        // A. Create a deep copy of components that we will actually send
        const finalComponents = formData.components.map(comp => {
            const validMaterials = comp.materials.filter(m => m.materialName?.trim() || (m.rate !== "" && m.rate !== 0));
            return {
                ...comp,
                materials: validMaterials
            };
        });

        // Update Payload with filtered components (cleaning vendorId)
        const finalPayload = {
            ...formData,
            organizationId,
            components: finalComponents.map(c => ({
                ...c,
                materials: c.materials.map(m => ({
                    ...m,
                    vendorId: m.vendorId === "" ? undefined : m.vendorId
                }))
            }))
        };

        // B. Iterate over the FINAL filtered lists to generate file mappings
        finalComponents.forEach((comp, compIdx) => {
            comp.materials.forEach((mat, matIdx) => {
                if (mat.tempFile) {
                    submissionData.append('files', mat.tempFile);
                    fileMapping.push({ 
                        target: 'material', 
                        componentIndex: compIdx, 
                        materialIndex: matIdx 
                    });
                }
            });
        });

        submissionData.append('data', JSON.stringify(finalPayload));
        submissionData.append('fileMapping', JSON.stringify(fileMapping));
        submissionData.append('organizationId', organizationId!);

        try {
            await createDesign({ organizationId: organizationId!, formData: submissionData });
            toast({ title: "Success", description: "Design created successfully" });
            navigate(`/design-lab/${organizationId}`); // Adjust redirect
        } catch (error: any) {
            console.error(error);
            toast({ 
                title: "Error", 
                description: error.message || "Failed to create design", 
                variant: "destructive" 
            });
        }
    };

    return (
        <DesignLabForm
            mode="create" 
            organizationId={organizationId!} 
            onSubmit={handleSubmit} 
            isLoading={isPending}
        />
    );
};


export default CreateDesignLab;