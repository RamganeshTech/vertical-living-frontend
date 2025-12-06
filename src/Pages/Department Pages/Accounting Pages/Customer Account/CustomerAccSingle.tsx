// src/components/Department/Accounting/CustomerAccounts/CustomerAccSingle.tsx
import { useParams, useNavigate } from 'react-router-dom';

import {
    useGetCustomer,
    useUpdateCustomer,
    useUpdateCustomerDocument,
    type UpdateCustomerPayload
} from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import CustomerAccountForm from './CustomerAccountForm';
import { toast } from '../../../../utils/toast';
import { Button } from '../../../../components/ui/Button';
import MaterialOverviewLoading from '../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

const CustomerAccSingle = () => {
    const { id } = useParams<{ id: string }>() as { id: string };
    const navigate = useNavigate();

    // Fetch customer data
    const { data: customer, isLoading, isError, error, refetch } = useGetCustomer(id);
    const updateCustomerMutation = useUpdateCustomer();
    const updateDocumentMutation = useUpdateCustomerDocument();

    // File upload state for documents tab
    // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleUpdateCustomer = async (data: UpdateCustomerPayload, files?: File[]) => {
        try {
            await updateCustomerMutation.mutateAsync({
                customerId: id,
                payload: data
            });

            if (files && files.length > 0) {
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append('files', file);
                });

                await updateDocumentMutation.mutateAsync({
                    id,
                    formData
                });
            }

            toast({ title: "Success", description: "Customer updated successfully" });
            // setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || 'Failed to update customer' });
            throw error;
        }
    };


    // Loading State
    if (isLoading) {
        return (
            <MaterialOverviewLoading />
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                <div className="text-red-600 font-semibold mb-2 text-xl">
                    ⚠️ Error Occurred
                </div>
                <p className="text-red-500 mb-4">
                    {(error as any)?.message || "Failed to load customer"}
                </p>
                <Button onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );
    }

    // Not Found State
    if (!customer) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow text-center">
                <div className="text-yellow-600 font-semibold mb-2 text-xl">
                    Customer Not Found
                </div>
                <Button onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );
    }

    // If in editing mode, use the CustomerAccountForm component
    return (
    <CustomerAccountForm
        mode="view"
        initialData={customer}
        onSubmit={handleUpdateCustomer}
        isSubmitting={updateCustomerMutation.isPending || updateDocumentMutation.isPending}
    />)

};

export default CustomerAccSingle;