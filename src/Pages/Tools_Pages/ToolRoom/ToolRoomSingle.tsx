import { useParams } from 'react-router-dom';
import { useGetToolRoomById, useUpdateToolRoom } from '../../../apiList/tools_api/toolRoomApi';
import { toast } from '../../../utils/toast';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import ToolRoomForm from './ToolRoomForm';

const ToolRoomSingle = () => {
    const { id, organizationId } = useParams() as { id: string, organizationId: string };

    const { data: room, isLoading, isError, error, refetch } = useGetToolRoomById(id);
    const updateRoomMutation = useUpdateToolRoom();

    const handleUpdate = async (data: any) => {
        try {
            await updateRoomMutation.mutateAsync({ id, updateData: data });
            await refetch();
            toast({ title: "Success", description: "Tool Room updated" });
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;
    if (isError) return <div className="p-10 text-center text-red-500">Error: {(error as any).message}</div>;

    return (
        <main className='max-h-full overflow-y-auto p-2'>
            <ToolRoomForm
                mode="view"
                initialData={room}
                organizationId={organizationId}
                onSubmit={handleUpdate}
                refetch={refetch}
                isSubmitting={updateRoomMutation.isPending}
            />
        </main>
    );
};

export default ToolRoomSingle;