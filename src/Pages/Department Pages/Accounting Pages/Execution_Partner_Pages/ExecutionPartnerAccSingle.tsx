import { useParams, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
import VendorAccountForm from './ExecutionPartnerAccountForm';
import { toast } from '../../../../utils/toast';
import { useGetExecutionPartner, useUpdateExecutionPartner, useUpdateExecutionPartnerDocument, useUpdateExecutionPartnerShopImages, type UpdateExecutionPartnerPayload } from '../../../../apiList/Department Api/Accounting Api/executionPartnerApi';

const ExpensePartnerAccSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 1. Fetch Data
    const { data: vendor, isLoading, isError, error, refetch } = useGetExecutionPartner(id || '');

    // 2. Mutations
    const updateExecutionPartnerMutation = useUpdateExecutionPartner();
    const updateDocumentMutation = useUpdateExecutionPartnerDocument();
    const updateShopImageMutation = useUpdateExecutionPartnerShopImages();


    // 3. Handle Update Logic
    const handleUpdate = async (data: UpdateExecutionPartnerPayload, files?: File[], shopImages?: File[]) => {
        try {
            if (!id) return;

            // A. Update Vendor Data
            await updateExecutionPartnerMutation.mutateAsync({
                executionpartnerId: id,
                payload: data
            });

            // B. Update Documents (if files are selected)
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

            // B. Update Documents (if files are selected)
            if (shopImages && shopImages.length > 0) {
                const formData = new FormData();
                shopImages.forEach((shopImage) => {
                    formData.append('shopImages', shopImage);
                });

                await updateShopImageMutation.mutateAsync({
                    id,
                    formData
                });
            }

            toast({ title: "Success", description: "Partner data updated successfully" });

            // Refresh data to show new values in View mode
            await refetch();

        } catch (error: any) {
            console.error("Update failed", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to update partern data",
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl mb-4"></i>
                    <p className="text-gray-600">Loading partner details...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600 text-xl mb-2">Error Loading Partner</div>
                <p className="text-gray-500 mb-4">{(error as any)?.message}</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <VendorAccountForm
            mode="view" // Start in View mode
            initialData={vendor}
            onSubmit={handleUpdate}
            isSubmitting={updateExecutionPartnerMutation.isPending || updateDocumentMutation.isPending}
        />
    );
};

export default ExpensePartnerAccSingle;