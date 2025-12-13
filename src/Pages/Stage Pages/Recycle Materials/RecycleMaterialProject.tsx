import { useParams } from "react-router-dom";
import {
    useGetProjectMaterials,
    useUpdateRecycleMaterialManually,
    useUpdateRecycleMaterialQuantity,
} from "../../../apiList/Stage Api/recycleMaterialApi"; // ← update this path as needed
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { useState } from "react";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

const RecycleMaterialProject = () => {
    const { projectId, organizationId } = useParams() as { projectId: string, organizationId: string };
    const { data, isLoading, error, refetch } = useGetProjectMaterials(organizationId, projectId);
    const { mutateAsync: updateSyncMaterial, isPending } = useUpdateRecycleMaterialManually();
    const { mutateAsync: updateMaterialQuantity } = useUpdateRecycleMaterialQuantity();


    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.inventory?.delete;
    // const canList = role === "owner" || permission?.inventory?.list;
    const canCreate = role === "owner" || permission?.inventory?.create;
    const canEdit = role === "owner" || permission?.inventory?.edit;


    const [editingId, setEditingId] = useState<string | null>(null);
    // const [editQuantity, setEditQuantity] = useState<number>(0);

    const handleEdit = (id: string) => {
        if (canCreate || canEdit) {
            setEditingId(id);
        }
        // setEditQuantity(currentQty);
    };

    const handleSyncMaterial = async () => {
        try {

                await updateSyncMaterial({
                    organizationId,
                    projectId,
                });
                toast({
                    title: "Success",
                    description: `Sync successfull.`,
                });
            
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to update material",
                variant: "destructive",
            });
        }
    };


    const handleEditQuantity = async (itemId: string, qty: number) => {
        try {
            await updateMaterialQuantity({
                organizationId,
                projectId,
                itemId,
                quantity: qty
            });
            toast({
                title: "Success",
                description: `Updated successfully.`,
            });
            //   setEditIndex(null);
            //   setEditValue("");
        }
        catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to update material",
                variant: "destructive",
            });
        }
    }


    console.log("daata", data)


    if (error) {
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
            <div className="text-red-600 font-semibold mb-2">
                ⚠️ Error Occurred
            </div>
            <p className="text-red-500 text-sm mb-4">
                {(error as any)?.response?.data?.message || "Failed to load data"}
            </p>
            <Button
                onClick={() => refetch()}
                className="bg-red-600 text-white px-4 py-2"
            >
                Retry
            </Button>
        </div>
    }

    return (
        <div className="max-w-full w-full mx-auto bg-white border border-blue-200 rounded-lg shadow-sm px-6 py-5">
            <div className="flex justify-between items-center mb-6 ">
                <h2 className="text-xl font-bold text-blue-700  flex items-center gap-2">
                    <i className="fas fa-recycle text-blue-600"></i>
                    Project Recycled Materials
                </h2>


              {(canCreate || canEdit )&&  <Button isLoading={isPending} onClick={handleSyncMaterial}>
                    Sync Recycle Materiasl
                </Button>}
            </div>
            {isLoading ? (
                <p className="text-gray-500"><MaterialOverviewLoading /></p>
            ) : data === null || data?.subItems?.length == 0 ? (
                <div className="h-30  flex justify-center items-center">
                    <p className="text-gray-500">No recycled materials found for this project.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-2 gap-0 bg-gray-100 border-b border-gray-200">
                        <div className=" px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Material Name</div>
                        <div className=" px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Remaining Quantity</div>
                        {/* <div className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">Unit</div> */}
                        {/* <div className="text-center">Actions</div> */}
                    </div>

                    {data?.subItems?.map((item: any) => (
                        <div
                            key={item._id}
                            className="grid grid-cols-2 gap-0 border-b border-gray-100 hover:bg-gray-50"
                        >
                            <div className="border-r border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors">{item.itemName}</div>

                            {/* <div className="border-r border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors">
                               
                                <span>{item.remainingQuantity}</span>

                            </div> */}

                            <div className=" border-r border-gray-200">
                                {editingId === item._id ? (
                                    <input
                                        type="number"
                                        defaultValue={item.remainingQuantity}
                                        min="0"
                                        autoFocus
                                        className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                        onBlur={(e) => {
                                            handleEditQuantity(item._id, +e.target.value);
                                            setEditingId(null);
                                        }}
                                        onKeyDown={(e: any) => {
                                            if (e.key === 'Enter') {
                                                handleEditQuantity(item._id, +e.target.value);
                                                setEditingId(null);
                                            }
                                            if (e.key === 'Escape') {
                                                setEditingId(null);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                        onClick={() => handleEdit(item._id)}
                                    >
                                        {item.remainingQuantity}
                                    </div>
                                )}
                            </div>

                            {/* <div className="border-r border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors">{item.unit || "N/A"}</div> */}

                            {/* ACTION BUTTON */}
                            {/* <div className="flex justify-center gap-2">
                {editIndex === idx ? (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isPending}
                      className="px-3 py-1 text-xs"
                      onClick={() => handleSave(item)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 text-xs"
                      onClick={() => {
                        setEditIndex(null);
                        setEditValue("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-xs"
                    onClick={() => handleEdit(idx, item.remainingQuantity)}
                  >
                    Edit
                  </Button>
                )}
              </div> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecycleMaterialProject;