// import React from 'react'
// import { Button } from '../../components/ui/Button'

// const SubContractComponent = () => {


    

//     return (
//         <div className="px-4 sm:px-6 lg:px-8 py-6">
//             <div className="grid lg:grid-cols-2 gap-6">
//                 {/* Before Work Section */}
//                 <div>
//                     <Card className="shadow-lg border-0">
//                         <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
//                             <CardTitle className="text-lg flex items-center text-white">
//                                 <i className="fas fa-clipboard-check mr-2"></i>
//                                 Before Work Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             <form onSubmit={handleBeforeSubmit} className="space-y-5">
//                                 {/* Worker Name */}
//                                 <div>
//                                     <Label htmlFor="workerName" className="text-sm font-medium text-gray-700">
//                                         Worker Name <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Input
//                                         id="workerName"
//                                         value={beforeWorkData.workerName}
//                                         onChange={(e) => setBeforeWorkData(prev => ({ ...prev, workerName: e.target.value }))}
//                                         placeholder="Enter your full name"
//                                         className={`mt-1 ${errors.workerName ? 'border-red-500' : ''}`}
//                                     />
//                                     {errors.workerName && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.workerName}</p>
//                                     )}
//                                 </div>

//                                 {/* Date Fields */}
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <Label htmlFor="dateOfCommencement" className="text-sm font-medium text-gray-700">
//                                             Start Date <span className="text-red-500">*</span>
//                                         </Label>
//                                         <Input
//                                             id="dateOfCommencement"
//                                             type="date"
//                                             value={beforeWorkData.dateOfCommencement}
//                                             onChange={(e) => setBeforeWorkData(prev => ({ ...prev, dateOfCommencement: e.target.value }))}
//                                             className={`mt-1 ${errors.dateOfCommencement ? 'border-red-500' : ''}`}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="dateOfCompletion" className="text-sm font-medium text-gray-700">
//                                             End Date <span className="text-red-500">*</span>
//                                         </Label>
//                                         <Input
//                                             id="dateOfCompletion"
//                                             type="date"
//                                             value={beforeWorkData.dateOfCompletion}
//                                             onChange={(e) => setBeforeWorkData(prev => ({ ...prev, dateOfCompletion: e.target.value }))}
//                                             className={`mt-1 ${errors.dateOfCompletion ? 'border-red-500' : ''}`}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Cost Section */}
//                                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                                     <h4 className="font-semibold text-gray-800 mb-3 text-sm">Cost Breakdown</h4>

//                                     <div className="grid grid-cols-2 gap-4 mb-3">
//                                         <div>
//                                             <Label htmlFor="labourCost" className="text-sm text-gray-700">
//                                                 Labour Cost <span className="text-red-500">*</span>
//                                             </Label>
//                                             <div className="relative">
//                                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
//                                                 <Input
//                                                     id="labourCost"
//                                                     type="number"
//                                                     value={beforeWorkData.labourCost}
//                                                     onChange={(e) => setBeforeWorkData(prev => ({ ...prev, labourCost: e.target.value }))}
//                                                     placeholder="0"
//                                                     className={`pl-8 mt-1 ${errors.labourCost ? 'border-red-500' : ''}`}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <Label htmlFor="materialCost" className="text-sm text-gray-700">
//                                                 Material Cost <span className="text-red-500">*</span>
//                                             </Label>
//                                             <div className="relative">
//                                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
//                                                 <Input
//                                                     id="materialCost"
//                                                     type="number"
//                                                     value={beforeWorkData.materialCost}
//                                                     onChange={(e) => setBeforeWorkData(prev => ({ ...prev, materialCost: e.target.value }))}
//                                                     placeholder="0"
//                                                     className={`pl-8 mt-1 ${errors.materialCost ? 'border-red-500' : ''}`}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="bg-white rounded-lg p-3 border border-blue-200">
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-gray-600 text-sm">Total Cost</span>
//                                             <div className="text-2xl font-bold text-blue-600">
//                                                 ₹ {calculateTotal().toLocaleString('en-IN')}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* File Upload */}
//                                 <div>
//                                     <Label htmlFor="beforeFiles" className="text-sm font-medium text-gray-700">
//                                         Before Work Photos/Documents
//                                     </Label>
//                                     <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-all">
//                                         <Input
//                                             id="beforeFiles"
//                                             type="file"
//                                             multiple
//                                             accept="image/*,application/pdf"
//                                             onChange={(e) => handleFileChange(e, 'before')}
//                                             className="cursor-pointer"
//                                         />
//                                         {/* {beforeWorkData.files.length > 0 && (
//                         <p className="mt-2 text-sm text-blue-600">
//                           <i className="fas fa-check-circle mr-1"></i>
//                           {beforeWorkData.files.length} file(s) selected
//                         </p>
//                       )} */}
//                                     </div>
//                                 </div>

//                                 {/* Display Existing Before Work Files */}
//                                 {submission?.filesBeforeWork && submission.filesBeforeWork.length > 0 && (
//                                     <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
//                                         {/* Images Section */}
//                                         {submission.filesBeforeWork.some((file: SubContractFile) => file.type === "image") && (
//                                             <div>
//                                                 <div className="flex items-center gap-2 mb-3">
//                                                     <i className="fas fa-images text-blue-600"></i>
//                                                     <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
//                                                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                                                         {submission.filesBeforeWork.filter((f: SubContractFile) => f.type === "image").length}
//                                                     </span>
//                                                 </div>


//                                                 <ImageGalleryExample
//                                                     imageFiles={submission.filesBeforeWork.filter((file: SubContractFile) => file.type === "image")}
//                                                     height={150}
//                                                     minWidth={150}
//                                                     maxWidth={200}
//                                                 />

//                                             </div>
//                                         )}

//                                         {/* PDFs Section */}
//                                         {submission.filesBeforeWork.some((file: SubContractFile) => file.type === "pdf") && (
//                                             <div>

//                                                 <div className="space-y-2">
//                                                     {submission.filesBeforeWork.some((file: SubContractFile) => file.type === "pdf") && (
//                                                         <div>
//                                                             <div className="flex items-center gap-2 mb-3">
//                                                                 <i className="fas fa-file-pdf text-red-600"></i>
//                                                                 <h4 className="font-semibold text-gray-800 text-sm">Documents</h4>
//                                                                 <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
//                                                                     {submission.filesBeforeWork.filter((f: SubContractFile) => f.type === "pdf").length}
//                                                                 </span>
//                                                             </div>
//                                                             <div className="grid grid-cols-1 gap-3">
//                                                                 {submission.filesBeforeWork
//                                                                     .filter((file: SubContractFile) => file.type === "pdf")
//                                                                     .map((file: SubContractFile, i: number) => (
//                                                                         <div
//                                                                             key={i}
//                                                                             className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all group"
//                                                                         >
//                                                                             <div
//                                                                                 className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
//                                                                             >
//                                                                                 <i className="fas fa-file-pdf text-red-600 text-2xl"></i>
//                                                                             </div>
//                                                                             <div className="flex-1 min-w-0">
//                                                                                 <p className="text-sm font-semibold text-gray-900 truncate">
//                                                                                     {file.originalName || `Document ${i + 1}.pdf`}
//                                                                                 </p>
//                                                                                 <p className="text-xs text-gray-500 mt-1">
//                                                                                     <i className="far fa-calendar mr-1"></i>
//                                                                                     {dateFormate(file.uploadedAt)}
//                                                                                 </p>
//                                                                             </div>
//                                                                             <a
//                                                                                 href={file.url}
//                                                                                 target="_blank"
//                                                                                 rel="noopener noreferrer"
//                                                                                 className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm group-hover:shadow-md"
//                                                                                 title="Open in new tab"
//                                                                             >
//                                                                                 <i className="fas fa-external-link-alt mr-1"></i>
//                                                                                 Open
//                                                                             </a>
//                                                                         </div>
//                                                                     ))
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     )}


//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 <Button
//                                     type="submit"
//                                     className="w-full bg-blue-600 hover:bg-blue-700"
//                                     disabled={submitMutation.isPending}
//                                 >
//                                     {submitMutation.isPending ? (
//                                         <>
//                                             <i className="fas fa-spinner fa-spin mr-2"></i>
//                                             Submitting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className="fas fa-paper-plane mr-2"></i>
//                                             Submit Before Work Information
//                                         </>
//                                     )}
//                                 </Button>
//                             </form>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* After Work Section */}
//                 <div>
//                     <Card className="shadow-lg border-0">
//                         <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
//                             <CardTitle className="text-lg flex items-center text-white">
//                                 <i className="fas fa-images mr-2"></i>
//                                 After Work Documentation
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                             {/* Display Existing After Work Files */}
//                             {submission?.filesAfterWork && submission.filesAfterWork.length > 0 && (
//                                 <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
//                                     {/* Images Section */}
//                                     {submission.filesAfterWork.some((file: SubContractFile) => file.type === "image") && (
//                                         <div>
//                                             <div className="flex items-center gap-2 mb-3">
//                                                 <i className="fas fa-images text-blue-600"></i>
//                                                 <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
//                                                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                                                     {submission.filesAfterWork.filter((f: SubContractFile) => f.type === "image").length}
//                                                 </span>
//                                             </div>
//                                             <ImageGalleryExample
//                                                 imageFiles={submission.filesAfterWork.filter((file: SubContractFile) => file.type === "image")}
//                                                 height={150}
//                                                 minWidth={150}
//                                                 maxWidth={200}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* PDFs Section */}
//                                     {submission.filesAfterWork.some((file: SubContractFile) => file.type === "pdf") && (
//                                         <div>

//                                             <div className="space-y-2">
//                                                 {submission.filesAfterWork.some((file: SubContractFile) => file.type === "pdf") && (
//                                                     <div>
//                                                         <div className="flex items-center gap-2 mb-3">
//                                                             <i className="fas fa-file-pdf text-red-600"></i>
//                                                             <h4 className="font-semibold text-gray-800 text-sm">Documents</h4>
//                                                             <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
//                                                                 {submission.filesAfterWork.filter((f: SubContractFile) => f.type === "pdf").length}
//                                                             </span>
//                                                         </div>
//                                                         <div className="grid grid-cols-1 gap-3">
//                                                             {submission.filesAfterWork
//                                                                 .filter((file: SubContractFile) => file.type === "pdf")
//                                                                 .map((file: SubContractFile, i: number) => (
//                                                                     <div
//                                                                         key={i}
//                                                                         className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-2 rounded-lg border border-red-200 hover:shadow-md transition-all group"
//                                                                     >
//                                                                         <div
//                                                                             className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
//                                                                         >
//                                                                             <i className="fas fa-file-pdf text-red-600 text-2xl"></i>
//                                                                         </div>
//                                                                         <div className="flex-1 min-w-0">
//                                                                             <p className="text-sm font-semibold text-gray-900 truncate">
//                                                                                 {file.originalName || `Document ${i + 1}.pdf`}
//                                                                             </p>
//                                                                             <p className="text-xs text-gray-500 mt-1">
//                                                                                 <i className="far fa-calendar mr-1"></i>
//                                                                                 {dateFormate(file.uploadedAt)}
//                                                                             </p>
//                                                                         </div>
//                                                                         <a
//                                                                             href={file.url}
//                                                                             target="_blank"
//                                                                             rel="noopener noreferrer"
//                                                                             className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm group-hover:shadow-md"
//                                                                             title="Open in new tab"
//                                                                         >
//                                                                             <i className="fas fa-external-link-alt mr-1"></i>
//                                                                             Open
//                                                                         </a>
//                                                                     </div>
//                                                                 ))
//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}


//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SubContractComponent