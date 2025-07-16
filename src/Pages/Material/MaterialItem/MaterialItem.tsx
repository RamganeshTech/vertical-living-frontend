import type React from "react"
import { useState } from "react"
import { useGetMaterials } from "../../../apiList/materialApi"
import type { MaterialItemType } from "../../../types/types"

interface MaterialItemProps {
  listId: string
  calculateTotalCost: (unitPrice: number, materialQuantity: number) => number
  isCreatingItem: boolean
  isDeletingItem: boolean
  isUpdatingItem: boolean
  deleteItem: ({ materialListId, materialId }:{ materialListId: string, materialId:string })=> Promise<any>
  resetDeleteItem: () => void
  resetUpdateItem: () => void
  openItemModal: (listId?: string) => void
  updateItem:({
        materialListId,
        materialId,
        materialItem,
      } : {materialListId:string,materialId:string,materialItem:any})=>  Promise<any>
  refetchLists: () => Promise<any>
}

const MaterialItem: React.FC<MaterialItemProps> = ({
  listId,
  calculateTotalCost,
  isCreatingItem,
  isDeletingItem,
  isUpdatingItem,
  deleteItem,
  resetDeleteItem,
  resetUpdateItem,
  openItemModal,
  updateItem,
  refetchLists,
}) => {
  const {
    data: materialsResponse,
    isLoading: materialsLoading,
    error: materialsError,
  } = useGetMaterials({ materialListId: listId })

  // Inline editing states for items
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingItemData, setEditingItemData] = useState<MaterialItemType | null>(null)




  const materials: MaterialItemType[] = materialsResponse?.data.mergedMaterials || []


  // Calculate total cost for all materials
  const totalMaterialCost = materials.reduce((sum, material) => sum + material.singleMaterialCost, 0)

  // Inline editing functions for items
  const startEditingItem = (material: MaterialItemType) => {
    setEditingItem(material._id!)
    setEditingItemData({
      materialName: material.materialName,
      unit: material.unit,
      unitPrice: material.unitPrice,
      materialQuantity: material.materialQuantity,
      vendor: material.vendor || "",
      notes: material.notes || "",
      singleMaterialCost: material.singleMaterialCost,
    })
  }

  const cancelEditingItem = () => {
    setEditingItem(null)
    setEditingItemData(null)
    resetUpdateItem()
  }

  const saveEditingItem = async () => {
    if (!editingItem || !editingItemData) return

    const updatedMaterial = {
      ...editingItemData,
      singleMaterialCost: calculateTotalCost(editingItemData.unitPrice, editingItemData.materialQuantity),
    }

    try {
      await updateItem({
        materialListId: listId,
        materialId: editingItem,
        materialItem: updatedMaterial,
      })

      setEditingItem(null)
      setEditingItemData(null)
      resetUpdateItem()
      await refetchLists()
    } catch (error) {
    }
  }

  
   const getStatusColor = (totalCost: number) => {
    if (totalCost > 20000) return "bg-red-100 text-red-800"
    if (totalCost > 10000) return "bg-yellow-100 text-yellow-800"
    // return "bg-green-100 text-green-800 text-blue-900"
        return "text-blue-900"
  }

  const handleDeleteItem = async (materialId: string, materialName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${materialName}"?`)) return

    try {
      await deleteItem({ materialListId: listId, materialId })
      resetDeleteItem()
      await refetchLists()
    } catch (error) {
    }
  }

  const isCurrentlyEditingItem = (materialId: string) => {
    return editingItem === materialId
  }

  if (materialsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading materials...</span>
      </div>
    )
  }

  if (materialsError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Failed to load materials: {(materialsError as any)?.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Total Cost Display */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg ">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-900">Total Material Cost:</span>
          <span className={`text-lg font-bold  ${getStatusColor(totalMaterialCost)} `}>${totalMaterialCost.toLocaleString()}</span>
        </div>
      </div>

      {/* Materials Table */}
      {materials.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full  border-2 border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Approval
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material: MaterialItemType) => {
                const isEditingThisItem = isCurrentlyEditingItem(material._id!)

                return (
                  <tr key={material._id} className={isEditingThisItem ? "bg-blue-50" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingThisItem ? (
                        <input
                          type="text"
                          value={editingItemData?.materialName || ""}
                          onChange={(e) =>
                            setEditingItemData((prev) => (prev ? { ...prev, materialName: e.target.value } : null))
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{material.materialName}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingThisItem ? (
                        <input
                          type="text"
                          value={editingItemData?.unit || ""}
                          onChange={(e) =>
                            setEditingItemData((prev) => (prev ? { ...prev, unit: e.target.value } : null))
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{material.unit}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingThisItem ? (
                        <input
                          type="number"
                          value={editingItemData?.unitPrice || 0}
                          onChange={(e) =>
                            setEditingItemData((prev) => (prev ? { ...prev, unitPrice: Number(e.target.value) } : null))
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">${material.unitPrice}/unit</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingThisItem ? (
                        <input
                          type="number"
                          value={editingItemData?.materialQuantity || 0}
                          onChange={(e) =>
                            setEditingItemData((prev) =>
                              prev ? { ...prev, materialQuantity: Number(e.target.value) } : null,
                            )
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{material.materialQuantity}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${material.singleMaterialCost.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingThisItem ? (
                        <input
                          type="text"
                          value={editingItemData?.vendor || ""}
                          onChange={(e) =>
                            setEditingItemData((prev) => (prev ? { ...prev, vendor: e.target.value } : null))
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{material.vendor || "No vendor"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingThisItem ? (
                        <textarea
                          value={editingItemData?.notes || ""}
                          onChange={(e) =>
                            setEditingItemData((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                          }
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{material.notes || "No notes"}</span>
                      )}
                    </td>
                      {/* Client Approval Status */}
                     <td className="px-6 py-4 whitespace-nowrap">
                        {/* <span className="text-sm text-gray-600">{material.clientApproved || "Not assinged"}</span> */}
                         <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${material.clientApproved === "approved"
                            ? "bg-green-100 text-green-800"
                            : material.clientApproved === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {material.clientApproved}
                      </span>
                    </td>
                     {/* Client Approval Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        {/* <span className="text-sm text-gray-600">{material.clientFeedback || "no client assigned"}</span> */}
                         <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                      >
                         <div className="max-w-xs truncate">{material.clientFeedback || "No Feedback yet"}</div>
                      </span>
                    </td>
                    {/* actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {isEditingThisItem ? (
                          <>
                            <button
                              onClick={saveEditingItem}
                              disabled={isUpdatingItem}
                              className="text-green-600 cursor-pointer hover:text-green-900 disabled:opacity-50"
                              title="Save changes"
                            >
                              {isUpdatingItem ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={cancelEditingItem}
                              disabled={isUpdatingItem}
                              className="text-gray-600 cursor-pointer hover:text-gray-900 disabled:opacity-50"
                              title="Cancel editing"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditingItem(material)}
                              disabled={isUpdatingItem}
                              // className="text-blue-600 cursor-pointer hover:text-blue-900 disabled:opacity-50"
                            className="text-blue-600 cursor-pointer  hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"

                              title="Edit material"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(material._id!, material.materialName)}
                              disabled={isDeletingItem}
                              className="text-red-600 cursor-pointer hover:text-red-900 disabled:opacity-50"
                              title="Delete material"
                            >
                              {isDeletingItem ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials</h3>
          <p className="text-gray-600 mb-4">Add materials to this list to start tracking costs</p>
          <button
            onClick={() => openItemModal()}
            disabled={isCreatingItem}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {isCreatingItem ? "Adding..." : "Add First Material"}
          </button>
        </div>
      )}
    </div>
  )
}

export default MaterialItem
