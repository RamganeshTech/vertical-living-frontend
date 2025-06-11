import React from 'react'
import type { ListFormType } from './LabourList'

type CreateLabourListProp = {
  listForm : ListFormType,
  setListForm:React.Dispatch<React.SetStateAction<ListFormType>>,
  setIsListModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
  handleCreateList:()=> void,
  isCreatingList:boolean
}

const CreateLabourList:React.FC<CreateLabourListProp> = ({listForm, setListForm, handleCreateList,  isCreatingList, setIsListModalOpen}) => {
  return (
      <div className="fixed inset-0  bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Labour List</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labour List Name</label>
                    <input
                      type="text"
                      value={listForm.labourListName}
                      onChange={(e) => setListForm((prev) => ({ ...prev, labourListName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter labour list name"
                      disabled={isCreatingList}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsListModalOpen(false)}
                    disabled={isCreatingList}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateList}
                    disabled={isCreatingList || !listForm.labourListName.trim()}
                    className="px-4 cursor-pointer py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    {isCreatingList && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {isCreatingList ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}

export default CreateLabourList