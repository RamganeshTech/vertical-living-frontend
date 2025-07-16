import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import {
  useGetMaterialList,
  useCreateMaterialList,
  useUpdateMaterialList,
  useDeleteMaterialList,
  useCreateMaterial,
  useUpdateMaterialItem,
  useDeleteMaterialItem,
} from "../../../apiList/materialApi"
import type { MaterialListType } from "../../../types/types"
import ErrorComponent from "../../../components/ErrorComponent"
import MaterialItem from "../MaterialItem/MaterialItem"
import CreateMaterialList from "./CreateMaterialList"
import CreateMaterialItem from "../MaterialItem/CreateMaterialItem"

export interface MaterialListFormType {
  materialListName: string
  projectId: string
}

export interface MaterialItemForm {
  materialName: string
  unit: string
  unitPrice: number
  materialQuantity: number
  vendor: string
  notes: string
}

const MaterialList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

  if (!projectId) return

  // React Query hooks for data fetching
  const {
    data: materialListsResponse,
    isLoading: listsLoading,
    error: listsError,
    refetch: refetchLists,
    isError: isListsError,
    isFetching,
  } = useGetMaterialList({ projectId })

  // Mutations for CRUD operations
  const {
    mutateAsync: createList,
    isError: createListError,
    isPending: isCreatingList,
    error: createListErr,
    reset: resetCreateList,
  } = useCreateMaterialList()

  const {
    mutateAsync: updateList,
    isError: updateListError,
    error: updateListErr,
    isPending: isUpdatingList,
    reset: resetUpdateList,
  } = useUpdateMaterialList()

  const {
    mutateAsync: deleteList,
    isError: deleteListError,
    error: deleteListErr,
    isPending: isDeletingList,
    reset: resetDeleteList,
  } = useDeleteMaterialList()

  const {
    mutateAsync: createItem,
    isError: createItemError,
    error: createItemErr,
    isPending: isCreatingItem,
    reset: resetCreateItem,
  } = useCreateMaterial()

  const {
    mutateAsync: updateItem,
    isError: updateItemError,
    error: updateItemErr,
    isPending: isUpdatingItem,
    reset: resetUpdateItem,
  } = useUpdateMaterialItem()

  const {
    mutateAsync: deleteItem,
    isError: deleteItemError,
    error: deleteItemErr,
    isPending: isDeletingItem,
    reset: resetDeleteItem,
  } = useDeleteMaterialItem()

  // State management for UI interactions
  const [expandedLists, setExpandedLists] = useState<string[]>([])
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [currentListId, setCurrentListId] = useState<string>("")

  // Inline editing states for lists
  const [editingList, setEditingList] = useState<string | null>(null)
  const [editingListData, setEditingListData] = useState<{ materialListName: string; projectId: string } | null>(null)

  // Form states
  const [listForm, setListForm] = useState<MaterialListFormType>({
    materialListName: "",
    projectId: projectId || "",
  })

  const [itemForm, setItemForm] = useState<MaterialItemForm>({
    materialName: "",
    unit: "",
    unitPrice: 0,
    materialQuantity: 0,
    vendor: "",
    notes: "",
  })

  // Extract material lists from response
  let materialLists: MaterialListType[] = materialListsResponse?.data || []

  const toggleListExpansion = (listId: string) => {
    setExpandedLists((prev) => (prev.includes(listId) ? prev.filter((id) => id !== listId) : [...prev, listId]))
  }

  const calculateTotalCost = (unitPrice: number, materialQuantity: number): number => {
    return unitPrice * materialQuantity
  }

  // CRUD Operations for Material Lists
  const handleCreateList = async () => {
    if (!listForm.materialListName.trim()) return

    try {
      await createList({
        projectId: listForm.projectId,
        materialListName: listForm.materialListName,
      })

      // Reset form and close modal
      setListForm({ materialListName: "", projectId: projectId || "" })
      setIsListModalOpen(false)
      resetCreateList()

      // Refetch the lists to get updated data
      await refetchLists()
    } catch (error) {
    }
  }

  // Inline editing functions for lists
  const startEditingList = (list: MaterialListType) => {
    setEditingList(list._id!)
    setEditingListData({
      materialListName: list.materialListName,
      projectId: list.projectId,
    })
  }

  const cancelEditingList = () => {
    setEditingList(null)
    setEditingListData(null)
    resetUpdateList()
  }

  const saveEditingList = async () => {
    if (!editingList || !editingListData || !editingListData.materialListName.trim()) return

    try {
      await updateList({
        projectId: editingListData.projectId,
        materailListId: editingList,
        materialListName: editingListData.materialListName,
      })

      setEditingList(null)
      setEditingListData(null)
      resetUpdateList()

      // Refetch the lists to get updated data
      await refetchLists()
    } catch (error) {
    }
  }


  const handleDeleteList = async (listId: string) => {
    const list = materialLists.find((l) => l._id === listId)
    if (!window.confirm(`Are you sure you want to delete "${list?.materialListName}"?`)) return

    try {
      await deleteList({ projectId, materailListId: listId })

      // Remove from expanded lists
      setExpandedLists((prev) => prev.filter((id) => id !== listId))
      resetDeleteList()

      // Refetch the lists to get updated data
      await refetchLists()
    } catch (error) {
    }
  }

  // CRUD Operations for Material Items
  const handleCreateItem = async () => {
    if (!itemForm.materialName.trim() || !currentListId) return

    const singleMaterialCost = calculateTotalCost(itemForm.unitPrice, itemForm.materialQuantity)

    try {
      await createItem({
        materialListId: currentListId,
        projectId,
        materialData: {
          materialName: itemForm.materialName,
          unit: itemForm.unit,
          unitPrice: itemForm.unitPrice,
          materialQuantity: itemForm.materialQuantity,
          vendor: itemForm.vendor || undefined,
          notes: itemForm.notes || undefined,
          singleMaterialCost,
        },
      })

      // Reset form and close modal
      setItemForm({
        materialName: "",
        unit: "",
        unitPrice: 0,
        materialQuantity: 0,
        vendor: "",
        notes: "",
      })
      setIsItemModalOpen(false)
      resetCreateItem()

      // Refetch the lists to get updated data
      await refetchLists()
    } catch (error) {
    }
  }

  // Modal handlers
  const openCreateListModal = () => {
    setListForm({ materialListName: "", projectId: projectId || "" })
    setIsListModalOpen(true)
    resetCreateList()
  }



  const openItemModal = (listId?: string) => {
    if (listId) {
      setCurrentListId(listId)
    }
    setItemForm({
      materialName: "",
      unit: "",
      unitPrice: 0,
      materialQuantity: 0,
      vendor: "",
      notes: "",
    })
    setIsItemModalOpen(true)
    resetCreateItem()
  }

  const isCurrentlyEditingList = (listId: string) => {
    return editingList === listId
  }

  // Loading and error states
  if (listsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading material lists...</p>
        </div>
      </div>
    )
  }

  if (isListsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorComponent
            message={(listsError as any)?.response?.data?.message || listsError.message || "something went wrong"}
            onClick={refetchLists}
          />
        </div>
      </div>
    )
  }

  if (!projectId) return null

  return (
    <div className="h-full bg-gray-50 p-4">
      <div className="max-w-full mx-auto h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Material Management</h1>
              <p className="text-gray-600 mt-2">Manage your project material resources and estimates</p>
              {isFetching && (
                <div className="flex items-center mt-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Syncing...</span>
                </div>
              )}
            </div>
            <button
              onClick={openCreateListModal}
              disabled={isCreatingList}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {isCreatingList ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              {isCreatingList ? "Creating..." : "Add Material List"}
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {(createListError ||
          updateListError ||
          deleteListError ||
          createItemError ||
          updateItemError ||
          deleteItemError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Operation Failed</h3>
                  <div className="mt-1 text-sm text-red-700">
                    {createListError && <p>Failed to create material list: {createListErr?.message}</p>}
                    {updateListError && <p>Failed to update material list: {updateListErr?.message}</p>}
                    {deleteListError && <p>Failed to delete material list: {deleteListErr?.message}</p>}
                    {createItemError && <p>Failed to create material item: {createItemErr?.message}</p>}
                    {updateItemError && <p>Failed to update material item: {updateItemErr?.message}</p>}
                    {deleteItemError && <p>Failed to delete material item: {deleteItemErr?.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Material Lists */}
       {materialLists.length > 0 && <div className="space-y-4 h-[85%] overflow-y-scroll">
          {materialLists?.map((list: MaterialListType) => {
            const isExpanded = expandedLists.includes(list._id!)
            const isEditingThisList = isCurrentlyEditingList(list._id!)

            return (
              <div key={list._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* List Header */}
                <div className={`border-l-4 border-l-blue-500 p-6 ${isEditingThisList ? "bg-blue-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        {isEditingThisList ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Material List Name</label>
                              <input
                                type="text"
                                value={editingListData?.materialListName || ""}
                                onChange={(e) =>
                                  setEditingListData((prev) =>
                                    prev ? { ...prev, materialListName: e.target.value } : null,
                                  )
                                }
                                className="text-xl font-semibold bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                placeholder="Enter material list name"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{list.materialListName}</h3>
                            <p className="text-gray-600 mt-1">Project ID: {list.projectId}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Created: {new Date((list as any).createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Status: no client assigned</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {isEditingThisList ? (
                          <>
                            <button
                              onClick={saveEditingList}
                              disabled={isUpdatingList}
                              className="p-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Save changes"
                            >
                              {isUpdatingList ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              onClick={cancelEditingList}
                              disabled={isUpdatingList}
                              className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Cancel editing"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              onClick={() => toggleListExpansion(list._id!)}
                              className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              <svg
                                className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => startEditingList(list)}
                              disabled={isUpdatingList}
                              className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Edit list"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteList(list._id!)}
                              disabled={isDeletingList}
                              className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title="Delete list"
                            >
                              {isDeletingList ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && !isEditingThisList && (
                  <div className="px-6 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Material Items</h4>
                      <button
                        onClick={() => openItemModal(list._id)}
                        disabled={isCreatingItem}
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        {isCreatingItem ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                        {isCreatingItem ? "Adding..." : "Add Item"}
                      </button>
                    </div>

                    {/* Material Items Table Component */}
                    <MaterialItem
                      listId={list._id!}
                      calculateTotalCost={calculateTotalCost}
                      isCreatingItem={isCreatingItem}
                      isDeletingItem={isDeletingItem}
                      isUpdatingItem={isUpdatingItem}
                      deleteItem={deleteItem}
                      resetDeleteItem={resetDeleteItem}
                      resetUpdateItem={resetUpdateItem}
                      openItemModal={openItemModal}
                      updateItem={updateItem}
                      refetchLists={refetchLists}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>}

        {/* Empty State */}
        {materialLists.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Material Lists</h3>
            <p className="text-gray-600 mb-6">
              Create your first material list to start managing your project resources
            </p>
            <button
              onClick={openCreateListModal}
              disabled={isCreatingList}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isCreatingList ? "Creating..." : "Create Material List"}
            </button>
          </div>
        )}

        {/* Material List Modal - Only for Creating */}
        {isListModalOpen && (
          <CreateMaterialList
            listForm={listForm}
            isCreatingList={isCreatingList}
            setListForm={setListForm}
            setIsListModalOpen={setIsListModalOpen}
            handleCreateList={handleCreateList}
          />
        )}

        {/* Material Item Modal - Only for Creating */}
        {isItemModalOpen && (
          <CreateMaterialItem
            handleCreateItem={handleCreateItem}
            itemForm={itemForm}
            setIsItemModalOpen={setIsItemModalOpen}
            setItemForm={setItemForm}
            calculateTotalCost={calculateTotalCost}
            isCreatingItem={isCreatingItem}
          />
        )}
      </div>
    </div>
  )
}

export default MaterialList
