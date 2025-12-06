import { useParams, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
import VendorAccountForm from './VendorAccountForm';
import { toast } from '../../../../utils/toast';    
import { 
    useGetVendor, 
    useUpdateVendor, 
    useUpdateVendorDocument, 
    useUpdateVendorShopImages
} from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';
import type { UpdateVendorPayload, } from '../../../../apiList/Department Api/Accounting Api/vendorAccApi';

const VendorAccSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // 1. Fetch Data
    const { data: vendor, isLoading, isError, error, refetch } = useGetVendor(id || '');
    
    // 2. Mutations
    const updateVendorMutation = useUpdateVendor();
    const updateDocumentMutation = useUpdateVendorDocument();
    const updateShopImageMutation = useUpdateVendorShopImages();

    // 3. Handle Update Logic
    const handleUpdate = async (data: UpdateVendorPayload, files?: File[],  shopImages?: File[]) => {
        try {
            if (!id) return;

            // A. Update Vendor Data
            await updateVendorMutation.mutateAsync({
                vendorId: id,
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

            toast({ title: "Success", description: "Vendor updated successfully" });
            
            // Refresh data to show new values in View mode
            await refetch();

        } catch (error: any) {
            console.error("Update failed", error);
            toast({ 
                title: "Error", 
                description: error?.response?.data?.message || error?.message || "Failed to update vendor",
                variant: "destructive" 
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl mb-4"></i>
                    <p className="text-gray-600">Loading vendor details...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600 text-xl mb-2">Error Loading Vendor</div>
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
            isSubmitting={updateVendorMutation.isPending || updateDocumentMutation.isPending}
        />
    );
};

export default VendorAccSingle;