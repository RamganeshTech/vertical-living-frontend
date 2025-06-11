import { memo, useState } from "react"
import { useGetLabourItems } from "../../../apiList/labourApi"
import type { LabourItemType } from "../../../types/types"


type LabourItemProp = {
  listId:string,
  updateItem:({labourListId, labourItemId, labourItem}:{labourListId:string, labourItemId:string, labourItem:any})=> Promise<any>,
  deleteItem: ({labourListId, labourItemId}: {labourListId:string, labourItemId:string})=> Promise<any>,
  isDeletingItem:boolean,
  isUpdatingItem:boolean,
  isCreatingItem: boolean,
  resetDeleteItem:()=> void,
  resetUpdateItem: ()=> void,
  refetchLists: () => Promise<any>,
  calculateTotalCost:(numberOfPeople: number, estimatedHours: number, hourlyRate: number) => number
  openItemModal: (listId?:string)=> void
}

 const LabourItem: React.FC<LabourItemProp> = ({ listId, isCreatingItem, updateItem, deleteItem, refetchLists, calculateTotalCost, openItemModal, isDeletingItem, isUpdatingItem, resetDeleteItem, resetUpdateItem }) => {
    const {
      data: labourItemsResponse,
      isLoading: itemsLoading,
      error: itemsError,
      isError: isItemsError,
    } = useGetLabourItems({ labourListId: listId })

    
        const [editingItem, setEditingItem] = useState<{ listId: string; itemId: string } | null>(null)
      const [editingItemData, setEditingItemData] = useState<LabourItemType | null>(null)
    

      const handleDeleteItem = async (itemId: string, listId: string) => {
    if (!window.confirm("Are you sure you want to delete this labour item?")) return

    try {
      await deleteItem({
        labourListId: listId,
        labourItemId: itemId,
      })

      resetDeleteItem()

      // Refetch the lists to get updated data
      await refetchLists()
    } catch (error) {
      console.error("Failed to delete labour item:", error)
    }
  }

    // Inline editing functions for items
  const startEditingItem = (item: LabourItemType, listId: string) => {
    setEditingItem({ listId, itemId: item._id! })
    setEditingItemData({ ...item })
  }

  const cancelEditingItem = () => {
    setEditingItem(null)
    setEditingItemData(null)
    resetUpdateItem()
  }

  const saveEditingItem = async () => {
    if (!editingItem || !editingItemData) return

    const totalCost = calculateTotalCost(
      editingItemData.numberOfPeople,
      editingItemData.estimatedHours,
      editingItemData.hourlyRate,
    )

    try {
      await updateItem({
        labourListId: editingItem.listId,
        labourItemId: editingItemData._id!,
        labourItem: {
          role: editingItemData.role,
          numberOfPeople: editingItemData.numberOfPeople,
          estimatedHours: editingItemData.estimatedHours,
          hourlyRate: editingItemData.hourlyRate,
          totalCost,
          notes: editingItemData.notes,
        }
      })

      setEditingItem(null)
      setEditingItemData(null)
      resetUpdateItem()

      // Refetch the lists to get updated data
      await refetchLists()
    } catch (error) {
      console.error("Failed to update labour item:", error)
    }
  }

    const isCurrentlyEditingItem = (listId: string, itemId: string) => {
    return editingItem?.listId === listId && editingItem?.itemId === itemId
  }

   const getStatusColor = (totalCost: number) => {
    if (totalCost > 20000) return "bg-red-100 text-red-800"
    if (totalCost > 10000) return "bg-yellow-100 text-yellow-800"
    // return "bg-green-100 text-green-800 text-blue-900"
        return "text-blue-900"
  }


    if (itemsLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading labour items...</p>
        </div>
      )
    }

    if (isItemsError) {
      return (
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <p className="text-red-600">Failed to load labour items</p>
          <p className="text-sm text-red-500 mt-1">{itemsError?.message}</p>
        </div>
      )
    }

    const labourItems = labourItemsResponse?.data?.mergedMaterials || []
    const totalCost = labourItemsResponse?.data?.totalLabourCost || 0

    if (labourItems.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Labour Items</h3>
          <p className="text-gray-600 mb-4">Add your first labour item to start tracking costs</p>
          <button
            onClick={() => openItemModal(listId)}
            disabled={isCreatingItem}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {isCreatingItem ? "Adding..." : "Add Labour Item"}
          </button>
        </div>
      )
    }

    return (
      <div>
        {/* Total Cost Summary */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">Total Labour Cost:</span>
            <span className={`text-lg font-bold  ${getStatusColor(totalCost)}`}>${totalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  People
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client FeedBack
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {labourItems.map((item: LabourItemType) => {
                const isEditing = isCurrentlyEditingItem(listId, item._id!)

                return (
                  <tr key={item._id} className={`${isEditing ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={editingItemData?.role || ""}
                            onChange={(e) =>
                              setEditingItemData((prev) => (prev ? { ...prev, role: e.target.value } : null))
                            }
                            className="text-sm font-medium text-gray-900 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{item.role}</div>
                        </div>
                      )}
                    </td>

                    {/* Number of People */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          value={editingItemData?.numberOfPeople || 1}
                          onChange={(e) =>
                            setEditingItemData((prev) =>
                              prev ? { ...prev, numberOfPeople: Number.parseInt(e.target.value) || 1 } : null,
                            )
                          }
                          className="w-16 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        item.numberOfPeople
                      )}
                    </td>

                    {/* Estimated Hours */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={editingItemData?.estimatedHours || 0}
                            onChange={(e) =>
                              setEditingItemData((prev) =>
                                prev ? { ...prev, estimatedHours: Number.parseFloat(e.target.value) || 0 } : null,
                              )
                            }
                            className="w-20 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-1">h</span>
                        </div>
                      ) : (
                        `${item.estimatedHours}h`
                      )}
                    </td>

                    {/* Hourly Rate */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="mr-1">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editingItemData?.hourlyRate || 0}
                            onChange={(e) =>
                              setEditingItemData((prev) =>
                                prev ? { ...prev, hourlyRate: Number.parseFloat(e.target.value) || 0 } : null,
                              )
                            }
                            className="w-20 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-1">/hr</span>
                        </div>
                      ) : (
                        `$${item.hourlyRate}/hr`
                      )}
                    </td>

                    {/* Total Cost */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {isEditing && editingItemData
                          ? `$${calculateTotalCost(
                            editingItemData.numberOfPeople,
                            editingItemData.estimatedHours,
                            editingItemData.hourlyRate,
                          ).toLocaleString()}`
                          : `$${item.totalCost.toLocaleString()}`}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {isEditing ? (
                        <textarea
                          value={editingItemData?.notes || ""}
                          onChange={(e) =>
                            setEditingItemData((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                          }
                          className="max-w-lg bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={4}
                          cols={9}
                          placeholder="Notes..."
                        />
                      ) : (
                        <div className="max-w-xs truncate">{item.notes || "No notes"}</div>
                      )}
                    </td>

                    {/* Client Approval Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.clientApproved === "approved"
                            ? "bg-green-100 text-green-800"
                            : item.clientApproved === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {item.clientApproved}
                      </span>
                    </td>

                    {/* Client Approval Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                      >
                         <div className="max-w-xs truncate">{item.clientFeedback || "No Feedback yet"}</div>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={saveEditingItem}
                            disabled={isUpdatingItem}
                            className="text-green-600 cursor-pointer  hover:text-green-900 p-1 rounded bg-green-50 hover:bg-green-100 transition-colors duration-200 disabled:opacity-50"
                            title="Save changes"
                          >
                            {isUpdatingItem ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={cancelEditingItem}
                            disabled={isUpdatingItem}
                            className="text-gray-600 cursor-pointer  hover:text-gray-900 p-1 rounded bg-gray-50 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
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
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditingItem(item, listId)}
                            disabled={isUpdatingItem}
                            className="text-blue-600 cursor-pointer  hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
                            title="Edit item"
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
                            onClick={() => handleDeleteItem(item._id!, listId)}
                            disabled={isDeletingItem}
                            className="text-red-600 cursor-pointer  hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                            title="Delete item"
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
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }


  export default memo(LabourItem)