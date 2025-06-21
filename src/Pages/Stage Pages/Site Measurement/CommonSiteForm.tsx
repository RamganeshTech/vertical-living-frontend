import React, { memo } from 'react'
import type { SiteDetails } from '../../../types/types'


type CommonSiteFormProps = {
    siteDetails:SiteDetails,
    setSiteDetails:React.Dispatch<React.SetStateAction<SiteDetails>>,
    handleSiteSubmit: ()=> Promise<any>,
    setShowSiteForm:React.Dispatch<React.SetStateAction<boolean>>,
}


const CommonSiteForm:React.FC<CommonSiteFormProps> = ({siteDetails, setSiteDetails, handleSiteSubmit, setShowSiteForm}) => {
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Site Measurements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="">Total Plot Area (sq.ft)</label>
                    <input
                      type="number"
                      placeholder="Total Plot Area (sq.ft)"
                      value={siteDetails.totalPlotAreaSqFt || 0}
                      onChange={(e) => setSiteDetails({ ...siteDetails, totalPlotAreaSqFt: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="">Built-up Area (sq.ft)</label>
                    <input
                      type="number"
                      placeholder="Built-up Area (sq.ft)"
                      value={siteDetails.builtUpAreaSqFt || 0}
                      onChange={(e) => setSiteDetails({ ...siteDetails, builtUpAreaSqFt: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="">Number of Floors</label>
                    <input
                      type="number"
                      placeholder="Number of Floors"
                      value={siteDetails.numberOfFloors || 0}
                      onChange={(e) => setSiteDetails({ ...siteDetails, numberOfFloors: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
    
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={siteDetails.hasSlope ?? false}
                      onChange={(e) => setSiteDetails({ ...siteDetails, hasSlope: e.target.checked })}
                      className="mr-2"
                    />
                    Has Slope
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={siteDetails.roadFacing ?? false}
                      onChange={(e) => setSiteDetails({ ...siteDetails, roadFacing: e.target.checked })}
                      className="mr-2"
                    />
                    Road Facing
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={siteDetails.boundaryWallExists ?? false}
                      onChange={(e) => setSiteDetails({ ...siteDetails, boundaryWallExists: e.target.checked })}
                      className="mr-2"
                    />
                    Boundary Wall Exists
                  </label>
                </div>
                <textarea
                  placeholder="Additional Notes"
                  value={siteDetails.additionalNotes || ""}
                  onChange={(e) => setSiteDetails({ ...siteDetails, additionalNotes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  rows={4}
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowSiteForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSiteSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            </div>
  )
}

export default memo(CommonSiteForm)