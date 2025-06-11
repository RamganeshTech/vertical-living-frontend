"use client"

import type React from "react"
import type { MaterialItemForm } from "../MaterialList/MaterialList"

interface CreateMaterialItemProps {
  itemForm: MaterialItemForm
  isCreatingItem: boolean
  setItemForm: React.Dispatch<React.SetStateAction<MaterialItemForm>>
  setIsItemModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateItem: () => void
  calculateTotalCost: (unitPrice: number, materialQuantity: number) => number
}

const CreateMaterialItem: React.FC<CreateMaterialItemProps> = ({
  itemForm,
  isCreatingItem,
  setItemForm,
  setIsItemModalOpen,
  handleCreateItem,
  calculateTotalCost,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCreateItem()
  }

  const totalCost = calculateTotalCost(itemForm.unitPrice, itemForm.materialQuantity)

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Material Item</h3>
          <button
            onClick={() => setIsItemModalOpen(false)}
            disabled={isCreatingItem}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="materialName" className="block text-sm font-medium text-gray-700 mb-2">
                Material Name *
              </label>
              <input
                type="text"
                id="materialName"
                value={itemForm.materialName}
                onChange={(e) => setItemForm((prev) => ({ ...prev, materialName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Steel Rebar, Concrete Mix"
                required
                disabled={isCreatingItem}
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <input
                type="text"
                id="unit"
                value={itemForm.unit}
                onChange={(e) => setItemForm((prev) => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., kg, m³, pieces"
                required
                disabled={isCreatingItem}
              />
            </div>

            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price ($) *
              </label>
              <input
                type="number"
                id="unitPrice"
                value={itemForm.unitPrice}
                onChange={(e) => setItemForm((prev) => ({ ...prev, unitPrice: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                disabled={isCreatingItem}
              />
            </div>

            <div>
              <label htmlFor="materialQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                id="materialQuantity"
                value={itemForm.materialQuantity}
                onChange={(e) => setItemForm((prev) => ({ ...prev, materialQuantity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
                required
                disabled={isCreatingItem}
              />
            </div>

            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <input
                type="text"
                id="vendor"
                value={itemForm.vendor}
                onChange={(e) => setItemForm((prev) => ({ ...prev, vendor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Vendor name (optional)"
                disabled={isCreatingItem}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900">
                ${totalCost.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={itemForm.notes}
              onChange={(e) => setItemForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this material (optional)"
              rows={3}
              disabled={isCreatingItem}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsItemModalOpen(false)}
              disabled={isCreatingItem}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isCreatingItem ||
                !itemForm.materialName.trim() ||
                !itemForm.unit.trim() ||
                itemForm.unitPrice <= 0 ||
                itemForm.materialQuantity <= 0
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isCreatingItem ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                "Add Material"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMaterialItem
