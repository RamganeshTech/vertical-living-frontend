import React from 'react';
import { useDeleteMaterialShopDocument } from '../../apiList/shopMaterialDocument_api/shopMaterialDocumentApi';
import { toast } from '../../utils/toast';
import { dateFormate } from '../../utils/dateFormator';
import { Button } from '../../components/ui/Button';
// import { dateFormate } from '../../../utils/dateFormator';
// import { toast } from '../../../utils/toast';
// import { Button } from '../../../components/ui/Button';
// import { useDeleteMaterialShopDocument } from '../../../apiList/materialShopDocument_Api/materialShopDocumentApi';

interface Props {
    data: any;
    index: number;
    onView: () => void;
}

const ShopMaterialDocumentCard: React.FC<Props> = ({ data, index, onView }) => {
    const deleteMutation = useDeleteMaterialShopDocument();

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        // if (!window.confirm("Delete this document?")) return;

        try {
            await deleteMutation.mutateAsync(id);
            toast({ title: "Success", description: "Document deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete",
                variant: "destructive"
            });
        }
    };

    return (
        <div
            onClick={onView}
            className="grid grid-cols-10 gap-4 px-6 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer items-center group"
        >
            <div className="col-span-1 text-center text-gray-400 font-medium text-sm">
                {index + 1}
            </div>

            <div className="col-span-3">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 truncate text-sm">
                        {data.categoryName}
                    </span>
                    <span className="text-[11px] text-blue-600 truncate flex items-center mt-1">
                        {/* <i className="fas fa-paperclip mr-1 text-[9px]"></i> */}
                        {/* {data.file?.originalName} */}
                    </span>
                </div>
            </div>

            <div className="col-span-2 text-center">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${data.file?.type === 'pdf' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                    {data?.file?.length || 0}
                </span>
            </div>

            <div className="col-span-2 text-center text-sm text-gray-500 font-medium">
                {dateFormate(data?.createdAt)}
            </div>

            <div className="col-span-2 text-center flex justify-center gap-4">

                <Button
                    variant='danger'
                    size='sm'
                    disabled={deleteMutation.isPending}
                    onClick={(e) => handleDelete(e, data._id)}
                >
                    {deleteMutation.isPending ? (
                        <i className="fas fa-circle-notch fa-spin text-xs"></i>
                    ) : (
                        <i className="fas fa-trash-alt text-xs"></i>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ShopMaterialDocumentCard;