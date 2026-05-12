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
        //    return <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
        //         <div className="text-red-600 font-semibold mb-2">
        //             ⚠️ Error Occurred
        //         </div>
        //         <p className="text-red-500 text-sm mb-4">
        //             {(error as any)?.response?.data?.message || "Failed to load data"}
        //         </p>
        //         <Button
        //             onClick={() => refetch()}
        //             className="bg-red-600 text-white px-4 py-2"
        //         >
        //             Retry
        //         </Button>
        //     </div>

        return ( // Fixed missing return statement!
            <div className="w-full bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center p-6 mt-8">
                <div className="text-action-danger text-2xl mb-3">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="text-text-main text-lg font-bold mb-2">
                    Error Occurred
                </div>
                <p className="text-text-muted text-sm mb-5">
                    {(error as any)?.response?.data?.message || "Failed to load recycled materials"}
                </p>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all px-6 shadow-sm"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        // <div className="max-w-full w-full mx-auto bg-white border border-blue-200 rounded-lg shadow-sm px-6 py-5">
        <div className="w-full bg-brand-surface border border-ash-medium rounded-xl shadow-sm p-5 sm:p-6">

            {/* <div className="flex justify-between items-center mb-6 "> */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-ash-light pb-4">
                {/* <h2 className="text-xl font-bold text-blue-700  flex items-center gap-2">
                    <i className="fas fa-recycle text-blue-600"></i>
                    Project Recycled Materials
                </h2> */}

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-ash border border-ash-light flex items-center justify-center shadow-sm">
                        <i className="fas fa-recycle text-text-muted text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-main leading-tight">
                            Project Recycled Materials
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Track leftover stock</p>
                    </div>
                </div>


                {(canCreate || canEdit) && <Button isLoading={isPending} onClick={handleSyncMaterial}
                    variant="dark"
                    className="w-full sm:w-auto shadow-sm px-5"
                >
                    <i className="fas fa-rotate text-text-muted mr-2"></i>
                    Sync Recycle Materiasl
                </Button>}
            </div>
            {isLoading ? (
                <p className="py-10"><MaterialOverviewLoading /></p>
            ) : data === null || data?.subItems?.length == 0 ? (
                // <div className="h-30  flex justify-center items-center">
                //     <p className="text-gray-500">No recycled materials found for this project.</p>
                // </div>
                <div className="flex flex-col items-center justify-center py-12 text-center bg-brand-ash/50 border border-dashed border-ash-medium rounded-xl">
                    <div className="w-14 h-14 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <i className="fa-solid fa-leaf text-2xl text-ash-dark"></i>
                    </div>
                    <p className="text-sm font-bold text-text-main mb-1">No recycled materials</p>
                    <p className="text-xs font-medium text-text-muted">There are no recycled materials recorded for this project yet.</p>
                </div>
            ) : (
                    <div className="bg-brand-surface rounded-xl border border-ash-medium overflow-x-auto shadow-sm">
                    <div className="grid grid-cols-12 bg-brand-ash border-b border-ash-medium text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        <div className="col-span-8 px-4 py-3 border-r border-ash-light">Material Name</div>
                        <div className="col-span-4 px-4 py-3 border-r border-ash-light text-center">Remaining Quantity</div>
                    </div>

<div className="divide-y divide-ash-light">
                    {data?.subItems?.map((item: any) => (
                        <div
                            key={item._id}
                            // className="grid grid-cols-2 gap-0 border-b border-gray-100 hover:bg-gray-50"
                            className="grid grid-cols-12 items-center text-sm hover:bg-brand-ash/50 transition-colors group"
                        >
                            {/* <div className="border-r border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors"> */}
                            <div className="col-span-8 border-r border-ash-light px-4 py-3 font-medium text-text-main">
                                {item.itemName}</div>

                            {/* <div className="border-r border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors">
                               
                                <span>{item.remainingQuantity}</span>

                            </div> */}

                            {/* <div className=" border-r border-gray-200"> */}
                            <div className="col-span-4 border-r border-ash-light p-1">
                                {editingId === item._id ? (
                                    <input
                                        type="number"
                                        defaultValue={item.remainingQuantity}
                                        min="0"
                                        autoFocus
                                        // className="w-full px-4 py-3 border-none outline-none focus:bg-blue-50"
                                        className="w-full px-3 py-2 text-center bg-brand-surface border border-ash-medium rounded-md outline-none font-bold text-text-main shadow-sm focus:ring-2 focus:ring-ash-medium"
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
                                        // className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                        className="px-2 py-2 text-center cursor-pointer rounded-md hover:bg-brand-surface border border-transparent hover:border-ash-medium transition-colors text-text-main font-bold flex items-center justify-center h-full"
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
                </div>
            )
            }
        </div>
    );
};

export default RecycleMaterialProject;
