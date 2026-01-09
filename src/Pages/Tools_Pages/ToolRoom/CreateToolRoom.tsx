import { useParams, useNavigate } from 'react-router-dom';
import { useCreateToolRoom } from '../../../apiList/tools_api/toolRoomApi';
import { toast } from '../../../utils/toast';
import ToolRoomForm from './ToolRoomForm';
// import ToolRoomForm from './ToolRoomForm';

const CreateToolRoom = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const navigate = useNavigate();
    const createRoomMutation = useCreateToolRoom();

    const handleSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                organizationId
            };

            await createRoomMutation.mutateAsync(payload);
            toast({ title: "Success", description: "Tool Room established successfully" });
            navigate(-1);
        } catch (error: any) {
            toast({
                title: "Creation Failed",
                description: error?.response?.data?.message || error?.message,
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto p-2'>
            <ToolRoomForm 
                mode="create" 
                organizationId={organizationId} 
                onSubmit={handleSubmit}
                isSubmitting={createRoomMutation.isPending}
            />
        </main>
    );
};

export default CreateToolRoom;