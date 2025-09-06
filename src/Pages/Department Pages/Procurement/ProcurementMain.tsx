// // import React from "react";
// // import { useParams } from "react-router-dom";
// // import { useGetProcurementAllLogs } from "../../apiList/procurement Api/procurementApi";

// // const ProcurementMain:React.FC = ()=> {
// //   const { organizationId } = useParams<{ organizationId: string }>();
// //   const { data: logsData, isLoading, isError, error } = useGetProcurementAllLogs(organizationId!);

  
// // console.log("logsdata",logsData)
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
// //       <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
// //         Procurement Logs for Organization: <span className="text-indigo-600">{organizationId}</span>
// //       </h1>

// //       {isLoading && (
// //         <div className="text-center text-gray-500 py-8">
// //           <i className="fas fa-spinner fa-spin mr-2"></i> Loading logs...
// //         </div>
// //       )}

// //       {isError && (
// //         <div className="text-center text-red-600 font-medium py-8">
// //           Error: {(error as Error)?.message || "Failed to load logs"}
// //         </div>
// //       )}

// //       {!isLoading && !isError && (!logsData || logsData.length === 0) && (
// //         <div className="text-center text-gray-400 py-8">No logs found for this organization.</div>
// //       )}

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {logsData?.map((log: any, index: number) => (
// //           <div
// //             key={index}
// //             className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
// //           >
// //             <div className="flex items-center mb-3">
// //               <i className="fas fa-tasks text-indigo-500 text-xl mr-3"></i>
// //               <h2 className="font-semibold text-lg text-gray-700 truncate">
// //                 {log.description || "No description"}
// //               </h2>
// //             </div>

// //             <div className="space-y-2 text-gray-600 text-sm">
// //               <div>
// //                 <i className="fas fa-calendar-alt mr-2 text-indigo-400"></i>
// //                 <strong>Action:</strong> {log.actionType}
// //               </div>
// //               <div>
// //                 <i className="fas fa-project-diagram mr-2 text-indigo-400"></i>
// //                 <strong>Project ID:</strong>{" "}
// //                 {log.projectId ? log.projectId : <span className="italic text-gray-400">N/A</span>}
// //               </div>
// //               <div>
// //                 <i className="fas fa-layer-group mr-2 text-indigo-400"></i>
// //                 <strong>Stage:</strong>{" "}
// //                 {log.stageModel
// //                   ? `${log.stageModel} (${log.stageId || "unknown"})`
// //                   : <span className="italic text-gray-400">N/A</span>}
// //               </div>
// //               <div>
// //                 <i className="fas fa-user mr-2 text-indigo-400"></i>
// //                 <strong>User:</strong>{" "}
// //                 {log.userType
// //                   ? `${log.userType} (${log.userId || "unknown"})`
// //                   : <span className="italic text-gray-400">System / Unknown</span>}
// //               </div>
// //               <div>
// //                 <i className="fas fa-user-tag mr-2 text-indigo-400"></i>
// //                 <strong>User Role:</strong> {log.userRole || <span className="italic text-gray-400">N/A</span>}
// //               </div>

// //               {/* Optionally display small snippet of newData */}
// //               {log.newData && (
// //                 <div className="mt-3 bg-gray-100 p-2 rounded text-xs text-gray-500 max-h-32 overflow-auto whitespace-pre-wrap font-mono">
// //                   <strong>New Data:</strong>{" "}
// //                   {typeof log.newData === "object"
// //                     ? JSON.stringify(log.newData, null, 2).slice(0, 300) + (JSON.stringify(log.newData).length > 300 ? "..." : "")
// //                     : String(log.newData)}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// // export default ProcurementMain

// import { useState, useMemo } from "react"
// import { useParams } from "react-router-dom"
// import { useGetProcurementAllLogs, useGetProcurementLogsFiltered } from "../../../apiList/procurement Api/procurementApi"

// // Mock organization ID - replace with actual value from your app context

// interface LogEntry {
//   _id: string
//   projectId?: string
//   userId: string
//   userType: string
//   stageId?: string
//   stageModel?: string
//   userRole?: string
//   actionType: string
//   description: string
//   newData: any
//   createdAt: string
// }

// export default function ProcurementLogs() {

//   const { organizationId } = useParams<{ organizationId: string }>();


//   const [filters, setFilters] = useState({
//     projectId: "",
//     stageId: "",
//     actionType: "",
//     userType: "",
//     searchTerm: "",
//   })
//   const [showFilters, setShowFilters] = useState(false)

//   // Use filtered query if any filters are applied, otherwise use all logs
//   const hasFilters = filters.projectId || filters.stageId

//   const allLogsQuery = useGetProcurementAllLogs(organizationId!)
//   const filteredLogsQuery = useGetProcurementLogsFiltered({
//     organizationId: organizationId!,
//     projectId: filters.projectId || undefined,
//     stageId: filters.stageId || undefined,
//   })

//   const activeQuery = hasFilters ? filteredLogsQuery : allLogsQuery
//   const logs: LogEntry[] = activeQuery.data || []

//   // Client-side filtering for additional filters
//   const filteredLogs = useMemo(() => {
//     return logs.filter((log) => {
//       const matchesActionType = !filters.actionType || log.actionType === filters.actionType
//       const matchesUserType = !filters.userType || log.userType === filters.userType
//       const matchesSearch =
//         !filters.searchTerm ||
//         log.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
//         log.actionType.toLowerCase().includes(filters.searchTerm.toLowerCase())

//       return matchesActionType && matchesUserType && matchesSearch
//     })
//   }, [logs, filters])

//   const handleFilterChange = (key: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [key]: value }))
//   }

//   const clearFilters = () => {
//     setFilters({
//       projectId: "",
//       stageId: "",
//       actionType: "",
//       userType: "",
//       searchTerm: "",
//     })
//   }

//   const getActionIcon = (actionType: string) => {
//     switch (actionType.toLowerCase()) {
//       case "create":
//         return "fas fa-plus-circle text-green-500"
//       case "update":
//         return "fas fa-edit text-blue-500"
//       case "delete":
//         return "fas fa-trash text-red-500"
//       case "upload":
//         return "fas fa-upload text-purple-500"
//       case "assign":
//         return "fas fa-user-plus text-orange-500"
//       default:
//         return "fas fa-info-circle text-gray-500"
//     }
//   }

//   const getUserTypeIcon = (userType: string) => {
//     switch (userType) {
//       case "UserModel":
//         return "fas fa-user"
//       case "StaffModel":
//         return "fas fa-user-tie"
//       case "WorkerModel":
//         return "fas fa-hard-hat"
//       case "ClientModel":
//         return "fas fa-handshake"
//       case "CTOModel":
//         return "fas fa-crown"
//       default:
//         return "fas fa-user"
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   if (activeQuery.isLoading) {
//     return (
//       <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-8">
//         <div className="w-full bg-white rounded-lg shadow-sm">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
//             </div>
//           </div>
//           <div className="p-6 space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="flex space-x-4 animate-pulse">
//                 <div className="w-12 h-12 bg-gray-200 rounded"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (activeQuery.isError) {
//     return (
//       <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-8">
//         <div className="w-full bg-white rounded-lg shadow-sm p-8 text-center">
//           <div className="mb-4">
//             <i className="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Logs</h3>
//           <p className="text-gray-600 mb-4">
//             {activeQuery.error?.message || "An error occurred while fetching the logs."}
//           </p>
//           <button
//             onClick={() => activeQuery.refetch()}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <i className="fas fa-redo mr-2"></i>
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-8">
//       <div className="w-full bg-white rounded-lg shadow-sm">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//             <div className="flex items-center space-x-3">
//               <i className="fas fa-clipboard-list text-blue-600 text-2xl"></i>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Procurement Logs</h1>
//                 <p className="text-gray-600">Track all procurement activities and changes</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-sm text-gray-500">
//                 {filteredLogs.length} {filteredLogs.length === 1 ? "entry" : "entries"}
//               </span>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
//                   showFilters
//                     ? "bg-blue-50 border-blue-200 text-blue-700"
//                     : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <i className="fas fa-filter mr-2"></i>
//                 Filters
//               </button>
//               <button
//                 onClick={() => activeQuery.refetch()}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <i className="fas fa-sync-alt mr-2"></i>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         {showFilters && (
//           <div className="p-6 bg-gray-50 border-b border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//                 <div className="relative">
//                   <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//                   <input
//                     type="text"
//                     placeholder="Search logs..."
//                     value={filters.searchTerm}
//                     onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
//                 <input
//                   type="text"
//                   placeholder="Filter by project..."
//                   value={filters.projectId}
//                   onChange={(e) => handleFilterChange("projectId", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Stage ID</label>
//                 <input
//                   type="text"
//                   placeholder="Filter by stage..."
//                   value={filters.stageId}
//                   onChange={(e) => handleFilterChange("stageId", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
//                 <select
//                   value={filters.actionType}
//                   onChange={(e) => handleFilterChange("actionType", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Actions</option>
//                   <option value="create">Create</option>
//                   <option value="update">Update</option>
//                   <option value="delete">Delete</option>
//                   <option value="upload">Upload</option>
//                   <option value="assign">Assign</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
//                 <select
//                   value={filters.userType}
//                   onChange={(e) => handleFilterChange("userType", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Users</option>
//                   <option value="UserModel">User</option>
//                   <option value="StaffModel">Staff</option>
//                   <option value="WorkerModel">Worker</option>
//                   <option value="ClientModel">Client</option>
//                   <option value="CTOModel">CTO</option>
//                 </select>
//               </div>
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={clearFilters}
//                 className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
//               >
//                 <i className="fas fa-times mr-1"></i>
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Logs Content */}
//         <div className="p-6">
//           {filteredLogs.length === 0 ? (
//             <div className="text-center py-12">
//               <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
//               <p className="text-gray-600">
//                 {logs.length === 0
//                   ? "No procurement logs have been recorded yet."
//                   : "No logs match your current filters. Try adjusting your search criteria."}
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table View */}
//               <div className="hidden lg:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">Stage</th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredLogs.map((log) => (
//                       <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                         <td className="py-4 px-4">
//                           <div className="flex items-center space-x-3">
//                             <i className={getActionIcon(log.actionType)}></i>
//                             <span className="font-medium capitalize">{log.actionType}</span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center space-x-3">
//                             <i className={`${getUserTypeIcon(log?.userType)} text-gray-600`}></i>
//                             <div>
//                               <div className="font-medium text-gray-900">{log?.userType?.replace("Model", "")}</div>
//                               {log.userRole && <div className="text-sm text-gray-500">{log?.userRole}</div>}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="max-w-xs">
//                             <p className="text-gray-900 truncate" title={log.description}>
//                               {log.description || "No description"}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           {log.projectId ? (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                               <i className="fas fa-project-diagram mr-1"></i>
//                               {log.projectId.slice(-6)}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="py-4 px-4">
//                           {log.stageId ? (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               <i className="fas fa-layer-group mr-1"></i>
//                               {log.stageId.slice(-6)}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="py-4 px-4 text-sm text-gray-600">{formatDate(log.createdAt)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Card View */}
//               <div className="lg:hidden space-y-4">
//                 {filteredLogs.map((log) => (
//                   <div key={log._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <i className={getActionIcon(log.actionType)}></i>
//                         <div>
//                           <h3 className="font-semibold text-gray-900 capitalize">{log.actionType}</h3>
//                           <p className="text-sm text-gray-600">{formatDate(log.createdAt)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <i className={`${getUserTypeIcon(log.userType)} text-gray-600`}></i>
//                         <span className="text-sm font-medium text-gray-700">{log?.userType?.replace("Model", "")}</span>
//                       </div>
//                     </div>

//                     <p className="text-gray-900 mb-3">{log.description || "No description"}</p>

//                     <div className="flex flex-wrap gap-2">
//                       {log.projectId && (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           <i className="fas fa-project-diagram mr-1"></i>
//                           Project: {log.projectId.slice(-6)}
//                         </span>
//                       )}
//                       {log.stageId && (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           <i className="fas fa-layer-group mr-1"></i>
//                           Stage: {log.stageId.slice(-6)}
//                         </span>
//                       )}
//                       {log.userRole && (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                           <i className="fas fa-user-tag mr-1"></i>
//                           {log.userRole}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
