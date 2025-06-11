import type React from "react"
import type { MaterialListFormType } from "./MaterialList" 

interface CreateMaterialListProps {
  listForm: MaterialListFormType
  isCreatingList: boolean
  setListForm: React.Dispatch<React.SetStateAction<MaterialListFormType>>
  setIsListModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateList: () => void
}

const CreateMaterialList: React.FC<CreateMaterialListProps> = ({
  listForm,
  isCreatingList,
  setListForm,
  setIsListModalOpen,
  handleCreateList,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCreateList()
  }

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create Material List</h3>
          <button
            onClick={() => setIsListModalOpen(false)}
            disabled={isCreatingList}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="materialListName" className="block text-sm font-medium text-gray-700 mb-2">
                Material List Name *
              </label>
              <input
                type="text"
                id="materialListName"
                value={listForm.materialListName}
                onChange={(e) => setListForm((prev) => ({ ...prev, materialListName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter material list name"
                required
                disabled={isCreatingList}
              />
            </div>

            {/* <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                Project ID
              </label>
              <input
                type="text"
                id="projectId"
                value={listForm.projectId}
                onChange={(e) => setListForm((prev) => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
            </div> */}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsListModalOpen(false)}
              disabled={isCreatingList}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingList || !listForm.materialListName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isCreatingList ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                "Create List"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMaterialList
