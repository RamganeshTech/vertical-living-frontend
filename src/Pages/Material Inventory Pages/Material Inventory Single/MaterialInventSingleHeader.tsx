import React from 'react'
import { Button } from '../../../components/ui/Button'
import SearchSelectNew from '../../../components/ui/SearchSelectNew'
import { memo } from 'react';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';

type Props = {
    navigate: (num: number) => any,
    data: any,
    editMode: boolean,
    projectOptions: any,
    selectedProjectId: string,
    handleSelectProjectId: (value: string) => any,
    handleCancel: () => any,
    handleSave: any,
    updateMutation: any,
    handleEdit: () => any

}
const MaterialInventSingleHeader: React.FC<Props> = ({ navigate, data, editMode,projectOptions,selectedProjectId,
    handleSelectProjectId, handleCancel,handleSave, updateMutation, handleEdit }) => {

        
            const { role, permission } = useAuthCheck();
            // const canDelete = role === "owner" || permission?.productinventory?.delete;
            // const canCreate = role === "owner" || permission?.productinventory?.create;
            const canEdit = role === "owner" || permission?.productinventory?.edit;
        
        

    return (
        <div>
            <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center justify-between gap-3">
                    <div onClick={() => navigate(-1)}
                        className='bg-white hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'>
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                            {data?.specification?.subcategory || data?.specification?.type || "Material Details"}
                        </h1>
                        <p className="text-gray-600 mt-2">View and manage material inventory information</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!editMode ? (
                        <div className="flex gap-3">

                            <div className="w-full sm:w-64">
                                <SearchSelectNew
                                    options={projectOptions}
                                    placeholder="Select project"
                                    searchPlaceholder="Search projects..."
                                    value={selectedProjectId || undefined}
                                    onValueChange={(value) => handleSelectProjectId(value || "")}
                                    searchBy="name"
                                    displayFormat="simple"
                                    className="w-full"
                                />
                            </div>

                          {canEdit &&  <Button
                                onClick={handleEdit}
                                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg"
                            >
                                <i className="fas fa-edit mr-2"></i>
                                Edit Details
                            </Button>}

                        </div>
                    ) : (
                        <>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="border-2 border-gray-300 hover:bg-gray-50"
                            >
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </header>
        </div>
    )
}

export default memo(MaterialInventSingleHeader)