// import React, { memo } from 'react'
// import type { SiteDetails } from '../../../types/types'
// import { Button } from '../../../components/ui/Button'


// type CommonSiteFormProps = {
//     siteDetails:SiteDetails,
//     setSiteDetails:React.Dispatch<React.SetStateAction<SiteDetails>>,
//     handleSiteSubmit: ()=> Promise<any>,
//     setShowSiteForm:React.Dispatch<React.SetStateAction<boolean>>,
//     updatePending:boolean
// }


// const CommonSiteForm:React.FC<CommonSiteFormProps> = ({siteDetails, updatePending, setSiteDetails, handleSiteSubmit, setShowSiteForm}) => {
//   return (
//     <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-lg w-full max-w-2xl p-6">
//                 <h2 className="text-2xl font-semibold mb-6">Site Measurements</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label htmlFor="">Total Plot Area (sq.ft)</label>
//                     <input
//                       type="number"
//                       placeholder="Total Plot Area (sq.ft)"
//                       value={siteDetails.totalPlotAreaSqFt || 0}
//                       onChange={(e) => setSiteDetails({ ...siteDetails, totalPlotAreaSqFt: Number(e.target.value) })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="">Built-up Area (sq.ft)</label>
//                     <input
//                       type="number"
//                       placeholder="Built-up Area (sq.ft)"
//                       value={siteDetails.builtUpAreaSqFt || 0}
//                       onChange={(e) => setSiteDetails({ ...siteDetails, builtUpAreaSqFt: Number(e.target.value) })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="">Number of Floors</label>
//                     <input
//                       type="number"
//                       placeholder="Number of Floors"
//                       value={siteDetails.numberOfFloors || 0}
//                       onChange={(e) => setSiteDetails({ ...siteDetails, numberOfFloors: Number(e.target.value) })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
    
//                 </div>
//                 <div className="flex flex-wrap gap-4 mb-4">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={siteDetails.hasSlope ?? false}
//                       onChange={(e) => setSiteDetails({ ...siteDetails, hasSlope: e.target.checked })}
//                       className="mr-2"
//                     />
//                     Has Slope
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={siteDetails.roadFacing ?? false}
//                       onChange={(e) => setSiteDetails({ ...siteDetails, roadFacing: e.target.checked })}
//                       className="mr-2"
//                     />
//                     Road Facing
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={siteDetails.boundaryWallExists ?? false}
//                       onChange={(e) => setSiteDetails({ ...siteDetails, boundaryWallExists: e.target.checked })}
//                       className="mr-2"
//                     />
//                     Boundary Wall Exists
//                   </label>
//                 </div>
//                 <textarea
//                   placeholder="Additional Notes"
//                   value={siteDetails.additionalNotes || ""}
//                   onChange={(e) => setSiteDetails({ ...siteDetails, additionalNotes: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
//                   rows={4}
//                 />
//                 <div className="flex justify-end gap-4">
//                   <Button
//                   variant='secondary'
//                     onClick={() => setShowSiteForm(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                   variant='primary'
//                     onClick={handleSiteSubmit}
//                   isLoading={updatePending}
//                   >
//                     Save Details
//                   </Button>
//                 </div>
//               </div>
//             </div>
//   )
// }

// export default memo(CommonSiteForm)


import React, { memo } from 'react'
import type { SiteDetails } from '../../../types/types'
import { Button } from '../../../components/ui/Button'

type CommonSiteFormProps = {
  siteDetails: SiteDetails,
  setSiteDetails: React.Dispatch<React.SetStateAction<SiteDetails>>,
  handleSiteSubmit: () => Promise<any>,
  setShowSiteForm: React.Dispatch<React.SetStateAction<boolean>>,
  updatePending: boolean
}

const CommonSiteForm: React.FC<CommonSiteFormProps> = ({ siteDetails, updatePending, setSiteDetails, handleSiteSubmit, setShowSiteForm }) => {
  return (
    // <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="fixed inset-0 bg-brand-main/90 backdrop-blur-sm flex items-center justify-center p-4 z-[50]">
      <div className="bg-brand-surface rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-ash-medium">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-ash-medium flex justify-between items-center bg-brand-ash">
          <h2 className="text-lg font-bold text-text-main">Edit Site Measurements</h2>
          <button 
            onClick={() => setShowSiteForm(false)}
            // className="text-gray-400 hover:text-gray-600 transition-colors"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash transition-all shadow-sm"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-1.5">Total Plot Area (sq.ft)</label>
              <input
                type="number"
                placeholder="0"
                value={siteDetails.totalPlotAreaSqFt || ""}
                onChange={(e) => setSiteDetails({ ...siteDetails, totalPlotAreaSqFt: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-mediumfocus:outline-none transition-all text-text-main font-bold text-sm placeholder:text-text-muted placeholder:font-sans placeholder:font-normal shadow-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Built-up Area (sq.ft)</label>
              <input
                type="number"
                placeholder="0"
                value={siteDetails.builtUpAreaSqFt || ""}
                onChange={(e) => setSiteDetails({ ...siteDetails, builtUpAreaSqFt: Number(e.target.value) })}
                // className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none"
                className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-mediumfocus:outline-none transition-all text-text-main font-bold text-sm placeholder:text-text-muted placeholder:font-sans placeholder:font-normal shadow-sm"

              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Number of Floors</label>
              <input
                type="number"
                placeholder="0"
                value={siteDetails.numberOfFloors || ""}
                onChange={(e) => setSiteDetails({ ...siteDetails, numberOfFloors: Number(e.target.value) })}
                // className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none"
                className="w-full px-3 py-2 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-mediumfocus:outline-none transition-all text-text-main font-bold text-sm placeholder:text-text-muted placeholder:font-sans placeholder:font-normal shadow-sm"

              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={siteDetails.hasSlope ?? false}
                onChange={(e) => setSiteDetails({ ...siteDetails, hasSlope: e.target.checked })}
                // className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800 focus:ring-2 mr-2 cursor-pointer transition-all"
                className="w-4 h-4 rounded border-ash-medium focus:ring-2 focus:ring-ash-medium mr-2 cursor-pointer transition-all"
              />
              {/* <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Has Slope</span> */}
              <span className="text-sm font-bold text-text-muted group-hover:text-text-main transition-colors">Has Slope</span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={siteDetails.roadFacing ?? false}
                onChange={(e) => setSiteDetails({ ...siteDetails, roadFacing: e.target.checked })}
                // className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800 focus:ring-2 mr-2 cursor-pointer transition-all"
                className="w-4 h-4 rounded border-ash-medium focus:ring-2 focus:ring-ash-medium mr-2 cursor-pointer transition-all"
              />
              {/* <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Road Facing</span> */}
              <span className="text-sm font-bold text-text-muted group-hover:text-text-main transition-colors">Road Facing</span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={siteDetails.boundaryWallExists ?? false}
                onChange={(e) => setSiteDetails({ ...siteDetails, boundaryWallExists: e.target.checked })}
                // className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800 focus:ring-2 mr-2 cursor-pointer transition-all"
                className="w-4 h-4 rounded border-ash-medium focus:ring-2 focus:ring-ash-medium mr-2 cursor-pointer transition-all"
              />
              {/* <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Boundary Wall Exists</span> */}
              <span className="text-sm font-bold text-text-muted group-hover:text-text-main transition-colors">Boundary Wall Exists</span>
            </label>
          </div>

          <div className="mb-2">
            {/* <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Additional Notes</label> */}
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-1.5">Additional Notes</label>
            <textarea
              placeholder="Enter any additional details here..."
              value={siteDetails.additionalNotes || ""}
              onChange={(e) => setSiteDetails({ ...siteDetails, additionalNotes: e.target.value })}
              // className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all text-gray-800 text-sm outline-none resize-none"
              className="w-full px-3 py-3 bg-brand-surface border border-ash-medium rounded-lg focus:ring-2 focus:ring-ash-medium focus:outline-none transition-all text-text-main text-sm resize-none placeholder:text-text-muted custom-scrollbar shadow-sm"
              rows={4}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-ash border-t border-ash-medium flex justify-end gap-3">
          <Button
            variant="white"
            onClick={() => setShowSiteForm(false)}
            className="px-6 border-ash-medium text-text-main shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleSiteSubmit}
            isLoading={updatePending}
            className="px-8 shadow-sm"
          >
            <i className="fa-solid fa-save mr-2"></i> Save Details
          </Button>
        </div>
        
      </div>
    </div>
  )
}

export default memo(CommonSiteForm)