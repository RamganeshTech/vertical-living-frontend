import React from 'react'
import type { ListItemForm } from '../LabourList/LabourList'

type CreateLabourItemProp = {
    itemForm:ListItemForm,
    setItemForm:React.Dispatch<React.SetStateAction<ListItemForm>>,
    isCreatingItem:boolean,
    calculateTotalCost: (numberOfPeople: number, estimatedHours: number, hourlyRate: number)=> number,
    setIsItemModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleCreateItem:()=> void
}

const CreateLabourItem:React.FC<CreateLabourItemProp> = ({itemForm, setItemForm, isCreatingItem, calculateTotalCost, handleCreateItem, setIsItemModalOpen,  }) => {
  return (
 <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Labour Item</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={itemForm.role}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mason, Carpenter, Developer"
                      disabled={isCreatingItem}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                      <input
                        type="number"
                        min="1"
                        value={itemForm.numberOfPeople}
                        onChange={(e) =>
                          setItemForm((prev) => ({ ...prev, numberOfPeople: Number.parseInt(e.target.value) || 1 }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isCreatingItem}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={itemForm.estimatedHours}
                        onChange={(e) =>
                          setItemForm((prev) => ({ ...prev, estimatedHours: Number.parseFloat(e.target.value) || 0 }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isCreatingItem}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemForm.hourlyRate}
                      onChange={(e) =>
                        setItemForm((prev) => ({ ...prev, hourlyRate: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      disabled={isCreatingItem}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      value={itemForm.notes}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Additional notes or requirements"
                      disabled={isCreatingItem}
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <strong>Total Cost Preview:</strong> $
                      {calculateTotalCost(
                        itemForm.numberOfPeople,
                        itemForm.estimatedHours,
                        itemForm.hourlyRate,
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {itemForm.numberOfPeople} people × {itemForm.estimatedHours} hours × ${itemForm.hourlyRate}/hour
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsItemModalOpen(false)}
                    disabled={isCreatingItem}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateItem}
                    disabled={isCreatingItem || !itemForm.role.trim()}
                    className="px-4 cursor-pointer py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    {isCreatingItem && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {isCreatingItem ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}

export default CreateLabourItem