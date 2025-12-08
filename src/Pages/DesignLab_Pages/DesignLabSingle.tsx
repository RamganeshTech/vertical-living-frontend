// import { useParams } from 'react-router-dom';
// import { useGetDesignLabById, useUpdateDesignLab } from '../../apiList/DesignLab_Api/designLabApi';
// import { DesignLabForm, type IDesignLabFormData } from './DesignLabForm';
// import { toast } from '../../utils/toast';
// import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

//  const DesignLabSingle = () => {
//     const { id , organizationId} = useParams<{ id: string, organizationId:string }>();

//     const { data: designData, isLoading, refetch } = useGetDesignLabById(id!);
//     const { mutateAsync: updateDesign, isPending } = useUpdateDesignLab();

//      const handleSubmit = async (formData: IDesignLabFormData) => {
//         try {
//             // 1. Destructure to remove fields we don't want to send in the body
//             // (newRefFiles are for create, _id/createdAt are readonly)
//             const { _id, createdAt, updatedAt, newRefFiles, referenceImages, ...payload } = formData as any;

//             if(!formData.productName || !formData?.productName?.trim()){
//                 toast({title:"Error", description:"Enter the product name", variant:"destructive"})
//                 return
//             }


//             // 2. Filter & Clean Components (CRITICAL STEP)
//             // We must remove empty rows and fix vendorId before sending to backend
//             payload.components = payload.components.map((c: any) => ({
//                 ...c,
//                 materials: c.materials
//                     // Filter: Keep row only if it has a name OR a rate
//                     .filter((m: any) => m.materialName?.trim() || (m.rate !== "" && m.rate !== 0))
//                     // Map: Clean vendorId ("" -> undefined/null)
//                     .map((m: any) => ({
//                         ...m,
//                         vendorId: m.vendorId === "" ? null : m.vendorId, // Set to null or undefined
//                         // Ensure image field exists if backend expects it, even if null
//                         image: m.image || null
//                     }))
//             }));

//               const finalSequence  = formData.sequenceOfOperations
//                 .filter(step => step.description && step.description.trim() !== "") // Remove empty steps
//                 .map((step, index) => ({
//                     ...step,
//                     stepNumber: index + 1 // Re-number correctly (1, 2, 3...)
//                 }));

//             payload.sequenceOfOperations  = finalSequence;

//             // 3. Send Update
//             await updateDesign({ id: id!, updateData: payload });
//             console.log("updatedData", payload)
//             toast({ title: "Success", description: "Design updated successfully" });
//             refetch(); 
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error.message || "Failed to update design", 
//                 variant: "destructive" 
//             });
//         }
//     };

//     if (isLoading) {
//         return <div className="">
//             <MaterialOverviewLoading />
//         </div>;
//     }

//     if (!designData) return <div>Design not found</div>;

//     return (
//         <DesignLabForm 
//             mode="edit" 
//             organizationId={organizationId!}
//             initialData={designData}
//             onSubmit={handleSubmit}
//             isLoading={isPending}
//             onReset={() => refetch()}
//         />
//     );
// };

// export default DesignLabSingle;



import { useParams } from 'react-router-dom';
import { useGetDesignLabById, useUpdateDesignLabNew } from '../../apiList/DesignLab_Api/designLabApi';
import { DesignLabForm, type IDesignLabFormData } from './DesignLabForm'; // Your Form Component
import { toast } from '../../utils/toast';

const UpdateDesignLab = () => {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();

    const { data: designData, isLoading, isError } = useGetDesignLabById(id!);


    // 1. Fetch Existing Data
    // Replace this with your actual useGetDesignLabById hook
    // const { data: designData, isLoading: isFetching, isError } = useQuery({
    //     queryKey: ["designLab", id],
    //     queryFn: async () => {
    //          const res = await axios.get(`/api/v1/design/getdesign/${id}`); // Adjust URL
    //          return res.data.data;
    //     },
    //     enabled: !!id
    // });

    // 2. The Update Mutation
    const { mutateAsync: updateDesign, isPending: isUpdating } = useUpdateDesignLabNew();

    // 3. Handle Submit (The "Batch" Logic)
    const handleSubmit = async (formData: IDesignLabFormData) => {
        try {
            const submissionData = new FormData();
            const fileMapping: any[] = [];
            const newFilesToUpload: File[] = [];

            // --- A. CLEAN COMPONENTS & SEQUENCE ---
            // Filter empty materials/steps just like in Create
            const finalComponents = formData.components.map(comp => ({
                ...comp,
                materials: comp.materials.filter(m =>
                    m.materialName?.trim() || (m.rate !== "" && m.rate !== 0) || m.image || m.tempFile
                )
            }));

            const finalSequence = formData.sequenceOfOperations
                .filter(step => step.description?.trim())
                .map((step, index) => ({ ...step, stepNumber: index + 1 }));


            // --- B. SEPARATE REFERENCE IMAGES ---
            // 1. Existing URLs (Keep them in JSON)
            const existingRefImages = formData.referenceImages.filter(img => !img.url.startsWith('blob:'));

            // 2. New Files (Add to upload queue)
            // Note: In your Form, you store new files in 'newRefFiles'. 
            // We use that array to know what to upload.
            formData.newRefFiles.forEach((file) => {
                newFilesToUpload.push(file);
                fileMapping.push({ target: 'reference' });
            });


            // --- C. PREPARE MATERIAL IMAGES ---
            finalComponents.forEach((comp, compIdx) => {
                comp.materials.forEach((mat, matIdx) => {
                    // Check if there is a pending file (Added via the Form)
                    if (mat.tempFile) {
                        newFilesToUpload.push(mat.tempFile);

                        // Create mapping based on current index (Handles deletions/shifts automatically)
                        fileMapping.push({
                            target: 'material',
                            componentIndex: compIdx,
                            materialIndex: matIdx
                        });

                        // Clear the image field in JSON so backend fills it with the new URL
                        // (and doesn't try to save a blob url)
                        mat.image = null;
                        delete mat.tempFile; // Cleanup
                    }
                });
            });

            // --- D. CONSTRUCT JSON PAYLOAD ---
            const finalPayload = {
                ...formData,
                referenceImages: existingRefImages, // Only send existing URLs
                components: finalComponents,        // Send structured components
                sequenceOfOperations: finalSequence
            };

            // Remove temporary fields not needed by Backend
            delete (finalPayload as any).newRefFiles;
            delete (finalPayload as any)._id; // ID is in URL
            delete (finalPayload as any).createdAt;
            delete (finalPayload as any).updatedAt;
            // delete (finalPayload as any).designCode; // Backend ignores it, but safer to remove

            // --- E. APPEND TO FORM DATA ---
            submissionData.append('data', JSON.stringify(finalPayload));
            submissionData.append('fileMapping', JSON.stringify(fileMapping));

            newFilesToUpload.forEach(file => {
                submissionData.append('files', file);
            });

            // --- F. SEND ---
            await updateDesign({ id: id!, formData: submissionData });

            toast({ title: "Success", description: "Design updated successfully" });
            // navigate(-1); // Go back to view/list

        } catch (error: any) {
            console.error("Update Error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to update design",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading Design...</div>;
    if (isError) return <div className="p-10 text-center text-red-500">Error loading design</div>;

    return (
        <DesignLabForm
            mode="edit"
            organizationId={designData?.organizationId} // Optional depending on your logic
            initialData={designData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
        />
    );
};

export default UpdateDesignLab;