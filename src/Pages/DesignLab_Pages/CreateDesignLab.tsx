import { useParams } from 'react-router-dom';
import { useCreateDesignLab } from '../../apiList/DesignLab_Api/designLabApi';
import { DesignLabForm, type IDesignLabFormData } from './DesignLabForm';
import { toast } from '../../utils/toast';

const CreateDesignLab = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const { mutateAsync: createDesign, isPending } = useCreateDesignLab();

    const handleSubmit = async (formData: IDesignLabFormData) => {
        try {
            const submissionData = new FormData();


            if(!formData.productName || !formData?.productName?.trim()){
                toast({title:"Error", description:"Enter the product name", variant:"destructive"})
                return
            }

           const fileMapping: any[] = [];

            const finalComponents = formData.components.map(comp => {
                const validMaterials = comp.materials.filter(m => m.materialName?.trim() || (m.rate !== "" && m.rate !== 0) || m.image);
                return {
                    ...comp,
                    materials: validMaterials
                };
            });

            // --- 2. CLEAN & FILTER SEQUENCE OF OPERATIONS ---
            const finalSequence = formData.sequenceOfOperations
                .filter(step => step.description && step.description.trim() !== "") // Remove empty steps
                .map((step, index) => ({
                    ...step,
                    stepNumber: index + 1 // Re-number correctly (1, 2, 3...)
                }));

            // Update Payload with filtered components (cleaning vendorId)
            const finalPayload = {
                ...formData,
                organizationId,
                sequenceOfOperations: finalSequence,
                referenceImages: [],
                components: finalComponents.map(c => ({
                    ...c,
                    materials: c.materials.map(m => ({
                        ...m,
                        vendorId: m.vendorId === "" ? undefined : m.vendorId
                    }))
                }))
            };

            // Ref Images
            formData.newRefFiles.forEach((file) => {
                submissionData.append('files', file);
                fileMapping.push({ target: 'reference' });
            });

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

            await createDesign({ organizationId: organizationId!, formData: submissionData });
            toast({ title: "Success", description: "Design created successfully" });
            // navigate(`/design-lab/${organizationId}`); // Adjust redirect
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                // description: error.message || "Failed to create design",
                description: error?.response?.data?.message || "Failed to update design",

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