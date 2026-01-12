import { useParams } from 'react-router-dom';
import { useCreateInternalQuote } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
// import { toast } from '../../../../../utils/toast';
import InternalQuoteForm from './InternalQuoteNewForm';

 const CreateInternalQuoteNew = () => {
    const { organizationId } = useParams() as { organizationId: string;  };
    // const navigate = useNavigate();
    const createMutation = useCreateInternalQuote();

    
      

    // const handleSubmit = async (formData: any) => {
    //     try {
    //         // const res = await createMutation.mutateAsync({
    //         //     organizationId,
    //         //     ...formData
    //         // });


    //         toast({ title: "Success", description: "Quote Created" });
    //         // navigate(`../single/${res._id}`);
    //     } catch (error: any) {
    //         toast({ title: "Error", description: error.message, variant: "destructive" });
    //     }
    // };

    return (
        <InternalQuoteForm 
            mode="create"
            organizationId={organizationId}
            // onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
        />
    );
};

export default CreateInternalQuoteNew