// import { useParams } from "react-router-dom";
// // import { useState } from "react";
// import { COMPANY_DETAILS } from "../../../constants/constants";
// import { useGetOrderPublicDetails } from "../../../apiList/Stage Api/orderMaterialHistoryApi";



// const OrderDetailsTable = ({ data }:{ data:any}) => {
// //   const { data, isLoading, isError } = useGetOrderPublicDetails(projectId);

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center p-8">
// //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //         <span className="ml-2 text-gray-600">Loading...</span>
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
// //         <p className="text-red-600">Error loading order details</p>
// //       </div>
// //     );
// //   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="p-6 bg-white border-b border-gray-200">
//   <div className="flex items-start gap-4">
//     <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//       </svg>
//     </div>
//     <div className="flex-1 min-w-0">
//       <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
//       <p className="text-sm text-gray-600 mt-1">
//         {data?.length || 0} items • Total quantity: {data?.reduce((sum:number, item:any) => sum + (item?.quantity || 0), 0) || 0}
//       </p>
//     </div>
//     {/* <div className="flex-shrink-0 hidden sm:block">
//       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//         Active Order
//       </span>
//     </div> */}
//   </div>
// </div>
//       {/* Horizontal Scroll Container */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[800px]">

//           {/* Table Header */}
//           <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
//             <div className="col-span-1">Image</div>
//             <div className="col-span-1">Item Name</div>
//             <div className="col-span-1">Category</div>
//             <div className="col-span-1">Quantity</div>
//             <div className="col-span-1">Height</div>
//             <div className="col-span-1">Width</div>
//             <div className="col-span-1">Depth</div>
//             <div className="col-span-1">Custom ID</div>
//           </div>

//           {/* Table Body */}
//           <div className="divide-y divide-gray-200">
//             {data?.map((item:any, index:number) => (
//               <div 
//                 key={`${item.customId}-${index}`} 
//                 className="grid grid-cols-8 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
//               >
//                 {/* Item Column */}
//                 <div className="col-span-1 flex items-center">
//                   <div className="flex-shrink-0 h-10 w-10 mr-3">
//                     {item.image && item.image !== "No Image" && item.image !== null ? (
//                       <img
//                         className="h-10 w-10 rounded-lg object-cover border border-gray-200"
//                         src={item.image}
//                         alt={item.unitName}
//                         onError={(e:any) => {
//                           e.target.style.display = 'none';
//                           e.target.nextSibling.style.display = 'flex';
//                         }}
//                       />
//                     ) : null}
//                     <div 
//                       className={`h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 ${
//                         item.image && item.image !== "No Image" && item.image !== null ? 'hidden' : 'flex'
//                       }`}
//                     >
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                     </div>
//                   </div>

//                 </div>


//                 {/* {item name} */}

//                  <div className="min-w-0 flex-1">
//                     <div className="text-sm font-medium text-gray-900 truncate">
//                       {item.unitName === "N/A" ? (
//                         <span className="text-gray-400 italic">No name</span>
//                       ) : (
//                         item.unitName
//                       )}
//                     </div>
//                   </div>

//                 {/* Category Column */}
//                 <div className="col-span-1 flex items-center">
//                   <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     {item.category}
//                   </span>
//                 </div>

//                 {/* Quantity Column */}
//                 <div className="col-span-1 flex items-center">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                     {item.quantity}
//                   </span>
//                 </div>

//                 {/* Height Column */}
//                 <div className="col-span-1 flex items-center text-sm text-gray-900">
//                   {item.height === 0 ? (
//                     <span className="text-gray-400">-</span>
//                   ) : (
//                     item.height
//                   )}
//                 </div>

//                 {/* Width Column */}
//                 <div className="col-span-1 flex items-center text-sm text-gray-900">
//                   {item.width === 0 ? (
//                     <span className="text-gray-400">-</span>
//                   ) : (
//                     item.width
//                   )}
//                 </div>

//                 {/* Depth Column */}
//                 <div className="col-span-1 flex items-center text-sm text-gray-900">
//                   {item.depth === 0 ? (
//                     <span className="text-gray-400">-</span>
//                   ) : (
//                     item.depth
//                   )}
//                 </div>

//                 {/* Custom ID Column */}
//                 <div className="col-span-1 flex items-center text-sm text-gray-500 font-mono">
//                   <span className="truncate">{item.customId}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Empty state */}
//       {data?.length === 0 && (
//         <div className="text-center py-12">
//           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
//           </svg>
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
//           <p className="mt-1 text-sm text-gray-500">No order details available for this project.</p>
//         </div>
//       )}
//     </div>
//   );
// };


// const PublicOrderHistory = () => {
//     const { projectId } = useParams();
//     // const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

//     const { data, isLoading, isError } = useGetOrderPublicDetails(
//         projectId!,

//     );
//     console.log("gelkfjlks;j", data)
//     // const handleToggle = (roomKey: string) => {
//     //     setExpandedRoom(prev => (prev === roomKey ? null : roomKey));
//     // };



//     //     if (isLoading) {
//     //     return (
//     //       <div className="flex items-center justify-center p-8">
//     //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//     //         <span className="ml-2 text-gray-600">Loading...</span>
//     //       </div>
//     //     );
//     //   }

//     //   if (isError) {
//     //     return (
//     //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//     //         <p className="text-red-600">Error loading order details</p>
//     //       </div>
//     //     );
//     //   }





//     return (
//         <div className="min-h-screen  outline-none  w-screen bg-gray-50 text-gray-800 flex flex-col">
//             {/* Header */}

//             <Header />

//             <main className="flex-1 w-full px-4 py-6 space-y-6 mx-auto sm:max-w-screen ">

//                 <h1 className="text-2xl font-semibold">Ordered Materials</h1>

//                 {/* Delivery Details */}
//                 {/* <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <h2 className="text-lg font-semibold text-blue-700 mb-2">Shop Delivery Details</h2>
//                     {isLoading ? (
//                         <Skeleton />
//                     ) : isError || !data?.shopDetails ? (
//                         <p className="text-red-500">Failed to load shop details</p>
//                     ) : (
//                         <div className="grid sm:grid-cols-2 gap-4 text-sm">
//                             {Object.entries(data.shopDetails).map(([key, value]) => (
//                                 <div key={key} className="flex flex-col">
//                                     <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                                     <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
//                                         ? value
//                                         : typeof value === "boolean"
//                                             ? value ? "✔️" : "❌"
//                                             : "-"}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </section> */}

//                 {/* Site Details */}
//                 {/* <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <h2 className="text-lg font-semibold text-blue-700 mb-2">Site Location Details</h2>
//                     {isLoading ? (
//                         <Skeleton />
//                     ) : isError || !data?.deliveryLocationDetails ? (
//                         <p className="text-red-500">Failed to load site details</p>
//                     ) : (
//                         <div className="grid sm:grid-cols-2 gap-4 text-sm">
//                             {Object.entries(data.deliveryLocationDetails).map(([key, value]) => (
//                                 <div key={key} className="flex flex-col">
//                                     <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                                     <span className="text-gray-600"> {typeof value === "string" || typeof value === "number"
//                                         ? value
//                                         : typeof value === "boolean"
//                                             ? value ? "✔️" : "❌"
//                                             : "-"}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </section> */}

//                 {/* Material Lists */}
//                 <section>
//                     <h2 className="text-lg font-bold text-blue-800 mb-4">Material Rooms</h2>

//                     {isLoading ? (
//                         <Skeleton />
//                     ) : isError ? (
//                         <p className="text-red-500">Failed to load material data</p>
//                     ) : (
//                         <>
//                             <main className="flex-1 max-w-screen mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
//                                 <OrderDetailsTable data={data} />
//                             </main>

//                         </>
//                     )}
//                 </section>
//             </main>

//             {/* Footer */}
//             <Footer />
//         </div>
//     );
// };

// const Skeleton = () => (
//     <div className="space-y-2 animate-pulse">
//         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//         <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//         <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//     </div>
// );


// export const Header = () => (
//     <header className="bg-white shadow sticky top-0 z-10">
//         <div className="max-w-full w-full mx-auto flex items-center gap-4 px-4 py-3">
//             <img
//                 src={COMPANY_DETAILS.COMPANY_LOGO}
//                 alt="Logo"
//                 className="w-10 h-10 object-contain"
//             />
//             <h1 className="text-xl font-bold">{COMPANY_DETAILS.COMPANY_NAME}</h1>
//         </div>
//     </header>
// );

// export const Footer = () => (
//     <footer className="bg-gray-100 border-t border-gray-200 py-6 px-6 text-center text-sm text-gray-600">
//         &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}. All rights reserved.
//     </footer>
// );





// export default PublicOrderHistory;




// import  { useState } from 'react'
// import { useGetOrderPublicDetails } from '../../../apiList/Stage Api/orderMaterialHistoryApi'
// import { useParams } from 'react-router-dom'

// interface OrderSubItem {
//   _id: string
//   subItemName: string | null
//   quantity: number | null
//   unit: string | null
// }

// interface SelectedUnit {
//   _id: string
//   unitId: string
//   category: string
//   image: string | null
//   customId: string | null
//   quantity: number
//   unitName: string | null
//   singleUnitCost: number
//   subItems: OrderSubItem[]
// }

// interface OrderHistoryData {
//   _id: string
//   projectId: string
//   status: 'pending' | 'completed'
//   isEditable: boolean
//   assignedTo: string | null
//   selectedUnits: SelectedUnit[]
//   totalCost: number
//   generatedLink: string
// }


// export default function PublicOrderHistory() {
//   const { projectId } = useParams() as {projectId:string}
//   const { data, isLoading } = useGetOrderPublicDetails(projectId) as {data:OrderHistoryData, isLoading:boolean, isError:boolean} 
//   const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set())

//   const toggleUnit = (unitId: string) => {
//     const newExpanded = new Set(expandedUnits)
//     if (newExpanded.has(unitId)) {
//       newExpanded.delete(unitId)
//     } else {
//       newExpanded.add(unitId)
//     }
//     setExpandedUnits(newExpanded)
//   }


//   if(isLoading){
//     return <p>loaidng</p>
//   }
  
//   const { selectedUnits } = data


//   return (
//     <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Order Overview</h1>
//             <p className="text-gray-600 mt-1">
//               {selectedUnits?.length} unit{selectedUnits?.length !== 1 ? 's' : ''} • Status:
//               <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${data?.status === 'completed'
//                   ? 'bg-green-100 text-green-800'
//                   : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                 {data.status}
//               </span>
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total Cost</p>
//             <p className="text-2xl font-bold text-blue-600">₹{data.totalCost?.toLocaleString()}</p>
//           </div>
//         </div>
//       </div>

//       {/* Units List */}
//       <div className="space-y-3">
//         {selectedUnits?.map((unit) => (
//           <div key={unit._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             {/* Unit Header - Clickable */}
//             <div
//               className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
//               onClick={() => toggleUnit(unit._id)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   {/* Unit Image */}
//                   <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
//                     {unit.image ? (
//                       <img
//                         src={unit.image || NO_IMAGE}
//                         alt={unit.unitName || 'Unit'}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <i className="fas fa-cube text-gray-400 text-lg"></i>
//                     )}
//                   </div>

//                   {/* Unit Info */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {unit.unitName || 'Unnamed Unit'}
//                     </h3>
//                     <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
//                       <span className="flex items-center">
//                         <i className="fas fa-tag mr-1"></i>
//                         {unit.category}
//                       </span>
//                       <span className="flex items-center">
//                         <i className="fas fa-hashtag mr-1"></i>
//                         {unit.customId || 'No ID'}
//                       </span>
//                       <span className="flex items-center">
//                         <i className="fas fa-cubes mr-1"></i>
//                         Qty: {unit.quantity}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   {/* Cost */}
//                   <div className="text-right">
//                     <p className="text-sm text-gray-600">Unit Cost</p>
//                     <p className="text-lg font-semibold text-blue-600">₹{unit.singleUnitCost.toLocaleString()}</p>
//                   </div>

//                   {/* Sub Items Count */}
//                   <div className="text-center">
//                     <p className="text-sm text-gray-600">Sub Items</p>
//                     <p className="text-lg font-semibold text-gray-900">{unit.subItems.length}</p>
//                   </div>

//                   {/* Expand/Collapse Icon */}
//                   <div className="ml-4">
//                     <i className={`fas fa-chevron-${expandedUnits.has(unit._id) ? 'up' : 'down'} text-gray-400 transition-transform duration-200`}></i>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Sub Items Table - Expandable */}
//             {expandedUnits.has(unit._id) && (
//               <div className="border-t border-gray-200 bg-gray-50">
//                 {unit.subItems.length > 0 ? (
//                   <div className="p-4">
//                     {/* Table Header */}
//                     <div className="grid grid-cols-12 gap-4 mb-3 pb-2 border-b border-gray-300">
//                       <div className="col-span-1 text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         #
//                       </div>
//                       <div className="col-span-5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         <i className="fas fa-box mr-2"></i>Sub Item Name
//                       </div>
//                       <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         <i className="fas fa-calculator mr-2"></i>Quantity
//                       </div>
//                       <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         <i className="fas fa-ruler mr-2"></i>Unit Type
//                       </div>
//                     </div>

//                     {/* Table Rows */}
//                     <div className="space-y-2">
//                       {unit.subItems.map((subItem, index) => (
//                         <div key={subItem._id} className="grid grid-cols-12 gap-4 py-3 px-2 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
//                           <div className="col-span-1 flex items-center">
//                             <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
//                               {index + 1}
//                             </span>
//                           </div>
//                           <div className="col-span-5 flex items-center">
//                             <div>
//                               <p className="font-medium text-gray-900">
//                                 {subItem.subItemName || 'Unnamed Sub Item'}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="col-span-3 flex items-center">
//                             <div className="flex items-center space-x-2">
//                               <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
//                                 {subItem.quantity || 0}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="col-span-3 flex items-center">
//                             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
//                               {subItem.unit || 'N/A'}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="p-8 text-center">
//                     <i className="fas fa-inbox text-gray-300 text-3xl mb-3"></i>
//                     <p className="text-gray-500">No sub items found for this unit</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {selectedUnits?.length === 0 && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//           <i className="fas fa-clipboard-list text-gray-300 text-4xl mb-4"></i>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Units Found</h3>
//           <p className="text-gray-600">There are no selected units in this order.</p>
//         </div>
//       )}

//       {/* Mobile Responsive Adjustments */}
//       <style>{`
//         @media (max-width: 768px) {
//           .grid-cols-12 {
//             grid-template-columns: repeat(1, minmax(0, 1fr));
//           }
//           .col-span-1, .col-span-3, .col-span-5 {
//             grid-column: span 1 / span 1;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }






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
