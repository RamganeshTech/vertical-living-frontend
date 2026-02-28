import ShopMaterialDocumentForm from './ShopMaterialDocumentForm';
import { useUploadMaterialShopFiles } from '../../apiList/shopMaterialDocument_api/shopMaterialDocumentApi';
import { toast } from '../../utils/toast';
import { useGetCategories } from '../../apiList/Quote Api/RateConfig Api/rateConfigApi';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

const ShopMaterialDocumentCreate = () => {
    const { mutateAsync: uploadFiles, isPending } = useUploadMaterialShopFiles();
    const { organizationId } = useParams() as {organizationId:string}

    // 1. Fetch available material categories
    const { data: categoriesData } = useGetCategories(organizationId!);

    // 2. Prepare Category Options for the SearchSelect
    const materialCategoryOptions = useMemo(() => {
        return categoriesData?.map((cat: any) => cat.name) || [];
    }, [categoriesData]);



    const handleSubmit = async (categoryName: string, files: File[]) => {
        try {


            if (!categoryName || !categoryName.trim()) {
                toast({
                    title: "Missing Information",
                    description: "Please enter a Category Name before uploading.",
                    variant: "destructive"
                });
                return; // Stop the execution
            }

            await uploadFiles({ categoryName, organizationId, files });
            toast({ title: "Success", description: "Files uploaded successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Upload failed",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="h-full  pt-6">
            {/* <div className="px-8 mb-6 flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">New Shop Record</h2>
            </div> */}
            <ShopMaterialDocumentForm
                mode="create"
                onSubmit={handleSubmit}
                isSubmitting={isPending}
                materialCategoryOptions={materialCategoryOptions}
            />
        </div>
    );
};

export default ShopMaterialDocumentCreate;