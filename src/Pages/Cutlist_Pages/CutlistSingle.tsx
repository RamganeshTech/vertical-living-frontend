import { useParams } from 'react-router-dom';
import { toast } from '../../utils/toast';
// import { useGetSingleCutlist, useSaveCutlist } from '../../apiList/CutlistApi';
import CutlistForm from './CutlistForm';
import { useGenerateCutlistPdf, useGetSingleCutlist, useSaveCutlist } from '../../apiList/cutlist_Api/cutlistApi';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { downloadImage } from '../../utils/downloadFile';
// import MaterialOverviewLoading from '../Loading/MaterialOverviewLoading';

const CutlistSingle = () => {
    const { id, organizationId } = useParams() as { id: string, organizationId: string };
    const { data: cutlist, isLoading, isError, error, refetch } = useGetSingleCutlist(id);
    const saveMutation = useSaveCutlist();
    const generatePdf = useGenerateCutlistPdf()

    // MIRROR THE 3-ARGUMENT SIGNATURE FROM CREATE
    const handleUpdate = async (headerData: any, roomsWithFiles: any[], summaryData: any) => {
        try {
            const formData = new FormData();
            
            // 1. Append Header Information
            formData.append('organizationId', organizationId);
            formData.append('clientName', headerData.clientName || '');
            formData.append('location', headerData.location || '');
            formData.append('projectId', headerData.projectId || ""); 
            formData.append('quoteNo', headerData.selectedQuoteNo || '');
            formData.append('quoteId', headerData.selectedQuoteId || "");
            formData.append('versionNo', headerData.versionNo || '1.0');
            
            // 2. Append Summary Data
            formData.append('summary', JSON.stringify(summaryData));

            // 3. Process Rooms and extract new Files
            const roomsData = roomsWithFiles.map((room, index) => {
                // Handle new File uploads via field keys the backend expects
                if (room.backSideLaminateImage?.file) {
                    formData.append(`rooms[${index}].backSideLaminateImage`, room.backSideLaminateImage.file);
                }
                if (room.frontSideLaminateImage?.file) {
                    formData.append(`rooms[${index}].frontSideLaminateImage`, room.frontSideLaminateImage.file);
                }
                
                // Destructure to separate file objects from metadata
                const { backSideLaminateImage, frontSideLaminateImage, ...rest } = room;
                
                return {
                    ...rest,
                    // If no new file, preserve the existing image object/URL from DB
                    backSideLaminateImage: backSideLaminateImage?.file ? null : backSideLaminateImage,
                    frontSideLaminateImage: frontSideLaminateImage?.file ? null : frontSideLaminateImage,
                };
            });

            // 4. Append processed Rooms JSON
            formData.append('rooms', JSON.stringify(roomsData));

            // 5. Trigger Mutation with the Cutlist ID in the query/params
            await saveMutation.mutateAsync({ id, formData });
            
            await refetch();
            toast({ title: "Success", description: "Cutlist updated successfully" });
        } catch (err: any) {
            toast({ 
                title: "Error", 
                description: err?.response?.data?.message || err.message || "Update failed", 
                variant: "destructive" 
            });
        }
    };

    
        const handleGenerate = async () => {
            try {
                const res = await generatePdf.mutateAsync({ id });
    
                await downloadImage({ src: res?.pdfUrl, alt: "Cutlist Generation" })
                toast({ title: "Success", description: "Pdf Generated successfully" });
                // refetch()
            } catch (err: any) {
                toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
            }
        };


    if (isLoading) return <MaterialOverviewLoading />;
    if (isError) return <div className="p-10 text-center text-red-500">Error: {(error as any).message}</div>;

    return (
        <main className='max-h-full h-full overflow-y-auto '>
            <CutlistForm 
                mode="view" 
                initialData={cutlist} 
                organizationId={organizationId}
                onSubmit={handleUpdate}
                isSubmitting={saveMutation.isPending}
                isGeneratingPdf={generatePdf.isPending }
                refetch={refetch}
                handleGenerate={handleGenerate}
            />
        </main>
    );
};

export default CutlistSingle;