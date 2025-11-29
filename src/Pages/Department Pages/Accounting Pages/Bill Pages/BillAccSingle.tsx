// // BillAccSingle.tsx
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from '../../../../utils/toast';
// import type { CreateBillPayload } from './CreateBillAcc';
// import { useGetSingleBill } from '../../../../apiList/Department Api/Accounting Api/billAccountApi';
// import BillAccountForm from './BillAccForm';
// import { useState } from 'react';

// const BillAccSingle = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const { organizationId } = useParams() as { organizationId: string }
//     const { data: bill, isLoading, isError, error } = useGetSingleBill(id || '');


//     const handleUpdate = async (_data: CreateBillPayload) => {
//         try {
//             // TODO: Implement update mutation when backend is ready
//             // await updateBillMutation.mutateAsync({ billId: id!, billData: data });

//             toast({ title: "Success", description: "Bill updated successfully" });
//             navigate(-1);
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || error?.message || "Failed to update the bill",
//                 variant: "destructive"
//             });
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div className="text-center">
//                     <i className="fas fa-spinner fa-spin text-blue-600 text-4xl mb-4"></i>
//                     <p className="text-gray-600">Loading bill...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="max-w-xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                 <div className="text-red-600 font-semibold mb-2 text-2xl">
//                     ⚠️ Error Loading Bill
//                 </div>
//                 <p className="text-red-500 mb-4">
//                     {(error as any)?.message || "Failed to load bill"}
//                 </p>
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <main className='max-h-full overflow-y-auto'>

//             <BillAccountForm
//                 mode="view"
//                 organizationId={organizationId}
//                 initialData={bill}
//                 onSubmit={handleUpdate}
//                 isSubmitting={false} // Update when mutation is implemented
//             />
//         </main>
//     );
// };

// export default BillAccSingle;


import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { useGetSingleBill, useUpdateBill, useUploadBillImages } from '../../../../apiList/Department Api/Accounting Api/billAccountApi';
import BillAccountForm from './BillAccForm';
import type { CreateBillPayload } from './CreateBillAcc';
import { downloadImage } from '../../../../utils/downloadFile';
import MaterialOverviewLoading from '../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
const BillAccSingle = () => {
    const { id } = useParams<{ id: string }>();
    const { organizationId } = useParams() as { organizationId: string }

    // Fetch Bill
    const { data: bill, isLoading, isError, error, refetch } = useGetSingleBill(id || '');

    // Mutations
    const updateBillMutation = useUpdateBill();
    const uploadImagesMutation = useUploadBillImages();

    // Handle Full Update (Edit Mode)
    const handleUpdate = async (data: Omit<CreateBillPayload, 'images'>) => {
        if (!id) return;
        try {
            // 1. Update Data (Text + Existing Images List)
            // This handles changing vendor, items, AND deleting old images if they are missing from data.images
            const res = await updateBillMutation.mutateAsync({
                billId: id!,
                billData: data
            });

            await refetch()
            await downloadImage({ src: res?.pdfData?.url, alt: res?.pdfData?.originalName })

            // // 2. If there are NEW files, upload them using the separate hook
            // if (newFiles.length > 0) {
            //     await uploadImagesMutation.mutateAsync({ 
            //         billId: id!, 
            //         files: newFiles 
            //     });
            // }

            toast({ title: "Success", description: "Bill updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to update",
                variant: "destructive"
            });
        }
    };

    // Handle Quick Image Upload (View Mode)
    const handleQuickUpload = async (files: File[]) => {
        if (!id) return;
        try {
            await uploadImagesMutation.mutateAsync({ billId: id, files });
            refetch()
            toast({ title: "Success", description: "Documents uploaded successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to upload documents",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <MaterialOverviewLoading />;
    if (isError) return <div className="p-10 text-center text-red-500">Error: {(error as any).message}</div>;

    return (
        <main className='max-h-full overflow-y-auto'>
            <BillAccountForm
                mode="view" // Start in View mode
                organizationId={organizationId}
                initialData={bill}
                onSubmit={handleUpdate}
                onQuickUpload={handleQuickUpload}
                refetch={refetch}
                isSubmitting={updateBillMutation.isPending || uploadImagesMutation.isPending}
            />
        </main>
    );
};

export default BillAccSingle;