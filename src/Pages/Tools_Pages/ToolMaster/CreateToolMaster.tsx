import { useParams } from 'react-router-dom';
import { useCreateTool } from '../../../apiList/tools_api/toolMasterApi';
import { toast } from '../../../utils/toast';
import ToolMasterForm from './ToolMasterForm';
// import { toast } from '../../../../utils/toast';
// import { useCreateTool } from '../../../../apiList/ToolMaster_Api/toolMasterApi';
// import ToolForm from './ToolForm';

const CreateToolMaster = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const createToolMutation = useCreateTool();

    const handleSubmit = async (data: any, files: File[]) => {
        try {
            const formData = new FormData();
            // Append text fields
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            formData.append('organizationId', organizationId);

            // Append images
            files.forEach(file => formData.append('files', file));

            await createToolMutation.mutateAsync(formData);
            toast({ title: "Success", description: "Tool registered successfully" });
            // navigate(-1);
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error?.response?.data?.message || error?.message,
                variant: "destructive"
            });
        }
    };

    return (
        <main className='max-h-full overflow-y-auto p-2'>
            <ToolMasterForm 
                mode="create" 
                organizationId={organizationId} 
                onSubmit={handleSubmit}
                isSubmitting={createToolMutation.isPending}
            />
        </main>
    );
};

export default CreateToolMaster;