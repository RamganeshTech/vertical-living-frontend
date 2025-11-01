// NOT CURRENTLY USED
import { useState } from 'react'
import { useGetOrderPublicDetails } from '../../../apiList/Stage Api/orderMaterialHistoryApi'
import { useParams } from 'react-router-dom'
import { NO_IMAGE } from '../../../constants/constants'

interface OrderSubItem {
  _id: string
  subItemName: string | null
  quantity: number | null
  unit: string | null
}

interface SelectedUnit {
  _id: string
  unitId: string
  category: string
  image: string | null
  customId: string | null
  quantity: number
  unitName: string | null
  singleUnitCost: number
  subItems: OrderSubItem[]
}

interface OrderHistoryData {
  _id: string
  projectId: string
  status: 'pending' | 'completed'
  isEditable: boolean
  assignedTo: string | null
  selectedUnits: SelectedUnit[]
  totalCost: number
  generatedLink: string
}

export default function PublicOrderHistory() {
  const { projectId } = useParams() as {projectId:string}
  const { data, isLoading } = useGetOrderPublicDetails(projectId) as {data:OrderHistoryData, isLoading:boolean, isError:boolean} 
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set())

  const toggleUnit = (unitId: string) => {
    // <CHANGE> Added console log for debugging
    console.log('Toggling unit:', unitId, 'Current expanded:', Array.from(expandedUnits))
    const newExpanded = new Set(expandedUnits)
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId)
    } else {
      newExpanded.add(unitId)
    }
    setExpandedUnits(newExpanded)
  }

  if(isLoading){
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="fas fa-spinner fa-spin text-blue-500 text-2xl mb-4"></i>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  // <CHANGE> Added safety check for data
  if (!data || !data?.selectedUnits) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl mb-4"></i>
          <p className="text-gray-600">No order data found</p>
        </div>
      </div>
    )
  }
  
  const { selectedUnits } = data

  // <CHANGE> Added console log to debug data structure
  // console.log('Order data:', data)
  // console.log('Selected units:', selectedUnits)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Overview</h1>
            <p className="text-gray-600 mt-1">
              {selectedUnits?.length || 0} unit{selectedUnits?.length !== 1 ? 's' : ''} • Status:
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${data?.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                }`}>
                {data.status}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold text-blue-600">₹{data.totalCost?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-3">
        {selectedUnits?.map((unit) => {
          // <CHANGE> Added console log for each unit's subItems
          console.log(`Unit ${unit.unitName} subItems:`, unit.subItems)
          
          return (
            <div key={unit._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Unit Header - Clickable */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleUnit(unit._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Unit Image */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {unit.image ? (
                        <img
                          src={unit.image || NO_IMAGE}
                          alt={unit.unitName || 'Unit'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-cube text-gray-400 text-lg"></i>
                      )}
                    </div>

                    {/* Unit Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {unit.unitName || 'Unnamed Unit'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <i className="fas fa-tag mr-1"></i>
                          {unit.category}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-hashtag mr-1"></i>
                          {unit.customId || 'No ID'}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-cubes mr-1"></i>
                          Qty: {unit.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Cost */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Unit Cost</p>
                      <p className="text-lg font-semibold text-blue-600">₹{unit.singleUnitCost?.toLocaleString() || 0}</p>
                    </div>

                    {/* Sub Items Count */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Sub Items</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {/* <CHANGE> Added safety check for subItems array */}
                        {Array.isArray(unit?.subItems) ? unit?.subItems?.length : 0}
                      </p>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="ml-4">
                      <i className={`fas fa-chevron-${expandedUnits.has(unit._id) ? 'up' : 'down'} text-gray-400 transition-transform duration-200`}></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Items Table - Expandable */}
              {expandedUnits?.has(unit._id) && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {/* <CHANGE> Added better condition check for subItems */}
                  {Array.isArray(unit?.subItems) && unit?.subItems?.length > 0 ? (
                    <div className="p-4">
                      {/* Table Header */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-3 pb-2 border-b border-gray-300">
                        <div className="md:col-span-1 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          #
                        </div>
                        <div className="md:col-span-5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          <i className="fas fa-box mr-2"></i>Sub Item Name
                        </div>
                        <div className="md:col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          <i className="fas fa-calculator mr-2"></i>Quantity
                        </div>
                        <div className="md:col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          <i className="fas fa-ruler mr-2"></i>Unit Type
                        </div>
                      </div>

                      {/* Table Rows */}
                      <div className="space-y-2">
                        {unit?.subItems?.map((subItem, index) => (
                          <div key={subItem._id || index} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3 px-2 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                            <div className="md:col-span-1 flex items-center">
                              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="md:col-span-5 flex items-center">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {subItem.subItemName || 'Unnamed Sub Item'}
                                </p>
                              </div>
                            </div>
                            <div className="md:col-span-3 flex items-center">
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                  {subItem.quantity || 0}
                                </span>
                              </div>
                            </div>
                            <div className="md:col-span-3 flex items-center">
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                {subItem.unit || 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <i className="fas fa-inbox text-gray-300 text-3xl mb-3"></i>
                      <p className="text-gray-500">No sub items found for this unit</p>
                      {/* <CHANGE> Added debug info */}
                      <p className="text-xs text-gray-400 mt-2">
                        Debug: subItems = {JSON.stringify(unit.subItems)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {(!selectedUnits || selectedUnits?.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <i className="fas fa-clipboard-list text-gray-300 text-4xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Units Found</h3>
          <p className="text-gray-600">There are no selected units in this order.</p>
        </div>
      )}
    </div>
  )
}
