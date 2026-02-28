import { useParams } from 'react-router-dom';
// import { useGetMaterialShopDocumentById } from '../../../apiList/materialShopDocument_Api/materialShopDocumentApi';
import ShopMaterialDocumentForm from './ShopMaterialDocumentForm';
import { useGetMaterialShopDocumentByIdV1 } from '../../apiList/shopMaterialDocument_api/shopMaterialDocumentApi';
import { useGetCategories } from '../../apiList/Quote Api/RateConfig Api/rateConfigApi';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';

const ShopMaterialDocumentSingle = () => {
    const { organizationId, catalogueId, id: categoryId } = useParams() as { catalogueId: string, id: string, organizationId: string }
    // const { data: document, isLoading, isError } = useGetMaterialShopDocumentById(id!);
    const { data: document, isLoading } = useGetMaterialShopDocumentByIdV1({ categoryId: categoryId });

    const { data: categories, isLoading: categoryLoading } = useGetCategories(organizationId!);
    const currentCategory = categories?.find((cat: any) => cat._id === categoryId);


    console.log("catalogueId", catalogueId) // catalogue is not used her 


    if (isLoading || categoryLoading) {
        return <MaterialOverviewLoading />
    }

    // if (isError) {
    //     return <div className="p-10 text-center text-red-500">Document not found or access denied.</div>;
    // }

    return (
        <div className="h-full overflow-y-auto">
            {/* <div className="px-8 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-800">Document View</h2>
                </div>
            </div> */}
            <ShopMaterialDocumentForm
                mode="view"
                initialData={document}
                rateConfigCategoryName={currentCategory?.name || "General"}
                categoryId={categoryId}
            />
        </div>
    );
};

export default ShopMaterialDocumentSingle;