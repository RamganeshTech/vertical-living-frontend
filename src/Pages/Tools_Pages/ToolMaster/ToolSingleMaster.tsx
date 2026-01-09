import { useParams } from 'react-router-dom';
import { useGetToolById, useUpdateToolContent, useUpdateToolImages } from '../../../apiList/tools_api/toolMasterApi';
import { toast } from '../../../utils/toast';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import ToolMasterForm from './ToolMasterForm';
import ToolHistoryTimeline from '../ToolHistory/ToolHistoryTimeline';

const ToolSingleMaster = () => {
    const { id, organizationId } = useParams() as { id: string, organizationId: string };

    const { data: tool, isLoading, isError, error, refetch } = useGetToolById(id);
    const updateContentMutation = useUpdateToolContent();
    const updateImagesMutation = useUpdateToolImages();

    const handleUpdate = async (data: any, newFiles: File[]) => {
        try {
            // 1. Update Text Content
            await updateContentMutation.mutateAsync({ id, updateData: data });

            // 2. If new images were added during edit
            if (newFiles.length > 0) {
                const imgFormData = new FormData();
                newFiles.forEach(file => imgFormData.append('files', file));
                await updateImagesMutation.mutateAsync({ id, formData: imgFormData });
            }

            await refetch();
            toast({ title: "Success", description: "Tool details updated" });
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        }
    };


    const handleQuickUploadClick = async (newFiles: File[]) => {
        try {

            const imgFormData = new FormData();
            newFiles.forEach(file => imgFormData.append('files', file));
            await updateImagesMutation.mutateAsync({ id, formData: imgFormData });
            await refetch();
            toast({ title: "Success", description: "images updloaded" });
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        }
    }


    if (isLoading) return <MaterialOverviewLoading />;
    if (isError) return <div className="p-10 text-center text-red-500">Error: {(error as any).message}</div>;

    return (
        <main className='max-h-full space-y-2 overflow-y-auto p-2 !bg-white/20'>
            <ToolMasterForm
                mode="view"
                initialData={tool}
                organizationId={organizationId}
                onSubmit={handleUpdate}
                refetch={refetch}
                onQuickUpload={handleQuickUploadClick}
                isSubmitting={updateContentMutation.isPending || updateImagesMutation.isPending}
            />

            <ToolHistoryTimeline toolId={id} organizationId={organizationId} />

        </main>
    );
};

export default ToolSingleMaster;