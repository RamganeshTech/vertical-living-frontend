import { useParams } from 'react-router-dom';
import { toast } from '../../utils/toast';
// import { useSaveCutlist } from '../../apiList/CutlistApi'; // Path to your hooks
import CutlistForm from './CutlistForm';
import { useSaveCutlist } from '../../apiList/cutlist_Api/cutlistApi';
// import { ICutlist } from '../../types/cutlist';

const CreateCutlist = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const saveMutation = useSaveCutlist();

    const handleSubmit = async (data: any, roomsWithFiles: any[], summaryData: any) => {
        try {
            const formData = new FormData();
            
            // Append header info
            formData.append('organizationId', organizationId);
            formData.append('clientName', data.clientName || '');
            formData.append('location', data.location || '');
            formData.append('projectId', data.projectId || null);
            formData.append('quoteNo', data.selectedQuoteNo || null);
            formData.append('quoteId', data.selectedQuoteId || null);
            formData.append('versionNo', data.versionNo || '1.0');
            formData.append('summary', JSON.stringify(summaryData));

            // Map rooms and extract files
            const roomsData = roomsWithFiles.map((room, index) => {
                if (room.backSideLaminateImage?.file) {
                    formData.append(`rooms[${index}].backSideLaminateImage`, room.backSideLaminateImage.file);
                }
                if (room.frontSideLaminateImage?.file) {
                    formData.append(`rooms[${index}].frontSideLaminateImage`, room.frontSideLaminateImage.file);
                }
                
                // Remove file objects from JSON to keep payload clean
                const { backSideLaminateImage, frontSideLaminateImage, ...rest } = room;
                return {
                    ...rest,
                    // Preserve existing URLs if any
                    backSideLaminateImage: backSideLaminateImage?.url || null,
                    frontSideLaminateImage: frontSideLaminateImage?.url || null,
                };
            });

            formData.append('rooms', JSON.stringify(roomsData));

            await saveMutation.mutateAsync({ formData });
            toast({ title: "Success", description: "Cutlist created successfully" });
            // navigate(-1);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "Failed to create Cutlist",
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto p-4'>
            <CutlistForm 
                mode="create" 
                organizationId={organizationId} 
                onSubmit={handleSubmit}
                isSubmitting={saveMutation.isPending}
            />
        </main>
    );
};

export default CreateCutlist;