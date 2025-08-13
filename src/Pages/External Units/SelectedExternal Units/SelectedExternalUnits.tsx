import { useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { toast } from "../../../utils/toast"
import {
    useDeleteSelectedExternalUnit,
    useGetSelectedExternalUnits,
    useSelectedExternalUnitComplete,
} from "../../../apiList/ExternalUnit Api/selectedExternalApi"
import type { DisplaySingleExternalUnit } from "../../../types/types"

const SelectedExternalUnits = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    const { data, isLoading, isError } = useGetSelectedExternalUnits(projectId!)
    const selectedUnits = data?.selectedUnits || []
    // console.log("data", selectedUnits)
    const { mutateAsync: deleteUnitAsync, isPending: isDeleting } = useDeleteSelectedExternalUnit()
    const { mutateAsync: completeStatus, isPending: updateStatusPending } = useSelectedExternalUnitComplete()

    const filteredUnits = useMemo(() => {

        if (!selectedUnits || !selectedUnits?.length) return []
        return selectedUnits?.filter(
            (unit: DisplaySingleExternalUnit) =>
                unit?.unitName?.toLowerCase().includes(search.toLowerCase()) ||
                unit?.unitCode?.toLowerCase().includes(search.toLowerCase()) ||
                unit?.category?.toLowerCase().includes(search.toLowerCase()),
        )
    }, [selectedUnits, search])




    const handleDelete = async (unitId: string) => {
        try {
            await deleteUnitAsync({ unitId, projectId: projectId! })
            toast({
                title: "Success",
                description: "Unit deleted successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete unit",
                variant: "destructive",
            })
        }
    }


    const handleCompleteStatus = async () => {
        try {
            await completeStatus({ projectId: projectId! })
            toast({
                title: "Success",
                description: "Stage Completed successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to Complete unit",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading selected units...</p>
                </div>
            </div>
        )
    }

    if (isError || !selectedUnits) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Failed to load selected units</h3>
                        <p className="text-red-600">Please try refreshing the page</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-h-full rounded-2xl overflow-y-auto custom-scrollbar bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Header */}
            <div className="bg-white border rounded-2xl rounded-b-none border-b-none border-blue-200 shadow-sm sticky top-0 z-10">
                <div className="p-2 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div onClick={() => navigate(-1)} className=" cursor-pointer rounded-2xl px-4 py-2 bg-blue-500 text-white">
                                <i className="fas fa-arrow-left mr-1"></i>
                                Back
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">

                                <i className="fa-solid fa-check-circle text-white text-lg sm:text-xl lg:text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Selected Units</h1>
                                <p className="text-slate-600 text-xs sm:text-sm lg:text-base hidden sm:block">
                                    {filteredUnits.length} units selected for this project
                                </p>
                            </div>
                        </div>


                        <div className="flex gap-2 items-center">
                            <Button variant="primary" onClick={handleCompleteStatus} isLoading={updateStatusPending}>
                                <i className="fas fa-notebook"></i> Generate Bill
                            </Button>


                            <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-blue-200 shadow-sm">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                                    <i className="fa-solid fa-rupee-sign text-white text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Total Project Cost</p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
                                        ₹{(data?.totalCost || 0).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative w-full sm:max-w-md">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by unit name, code, or category..."
                            className="pl-10 pr-10 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {filteredUnits.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-solid fa-inbox text-slate-400 text-2xl lg:text-3xl"></i>
                            </div>
                            <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-2">
                                {search ? "No matching units found" : "No units selected yet"}
                            </h3>
                            <p className="text-slate-600 mb-6">
                                {search ? "Try adjusting your search terms" : "Start by browsing and adding units from the catalog"}
                            </p>
                            {search && (
                                <Button
                                    onClick={() => setSearch("")}
                                    variant="primary"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <i className="fa-solid fa-times mr-2"></i>
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Units Grid */
                    <div className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 sm:gap-6">
                            {filteredUnits.map((unit: DisplaySingleExternalUnit) => (
                                <div
                                    key={unit._id}
                                    className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden">
                                        {unit.image ? (
                                            <img
                                                src={unit.image.url || "/placeholder.svg"}
                                                alt={unit.image.originalName}
                                                className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <i className="fa-solid fa-image text-3xl sm:text-4xl text-blue-400 mb-2"></i>
                                                    <p className="text-blue-500 text-xs sm:text-sm">No Image</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                                            <Button
                                                onClick={() => handleDelete(unit._id!)}
                                                disabled={isDeleting}
                                                variant="danger"
                                                size="icon"
                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete unit"
                                            >
                                                <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
                                            </Button>
                                        </div>

                                        {/* Price Badge */}
                                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                                            ₹{unit.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 sm:p-6">
                                        <div className="mb-4">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {unit.unitName}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 mb-3">
                                                <i className="fa-solid fa-hashtag"></i>
                                                <span className="truncate">{unit.unitCode}</span>
                                            </div>
                                        </div>

                                        {/* Unit Details */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs sm:text-sm text-slate-600">Category</span>
                                                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {unit.category}
                                                </span>
                                            </div>


                                             <div className="flex items-center justify-between">
                                                <span className="text-xs sm:text-sm text-slate-600">Quantity</span>
                                                <span className="px-2 sm:px-3 py-1  text-slate-700 rounded-full text-xs font-medium">
                                                    {unit.quantity}
                                                </span>
                                            </div>

                                            {/* Dimensions */}
                                            {unit?.dimention && (
                                                <div className="pt-3 border-t border-slate-200">
                                                    <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Dimensions</h4>
                                                    <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs">
                                                        <div className="text-center p-1 sm:p-2 bg-slate-50 rounded">
                                                            <div className="font-medium text-slate-800">H</div>
                                                            <div className="text-slate-600">{unit.dimention.height}mm</div>
                                                        </div>
                                                        <div className="text-center p-1 sm:p-2 bg-slate-50 rounded">
                                                            <div className="font-medium text-slate-800">W</div>
                                                            <div className="text-slate-600">{unit.dimention.width}mm</div>
                                                        </div>
                                                        <div className="text-center p-1 sm:p-2 bg-slate-50 rounded">
                                                            <div className="font-medium text-slate-800">D</div>
                                                            <div className="text-slate-600">{unit.dimention.depth}mm</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Image Details */}
                                            {unit?.totalPrice > 0 && (
                                                <div className="pt-3 border-t border-slate-200">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-1">
                                                        <span className="truncate">Total Price: ₹{unit?.totalPrice}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SelectedExternalUnits




// "use client"

// import { useState, useMemo } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Input } from "../../../components/ui/Input"
// import { Button } from "../../../components/ui/Button"
// import { toast } from "../../../utils/toast"
// import {
//   useDeleteSelectedExternalUnit,
//   useGetSelectedExternalUnits,
// } from "../../../apiList/ExternalUnit Api/selectedExternalApi"
// import type { DisplaySingleExternalUnit } from "../../../types/types"

// const SelectedExternalUnits = () => {
//   const { projectId } = useParams<{ projectId: string }>()
//   const [search, setSearch] = useState("")
//   const navigate = useNavigate()
//   const [updateStatusPending, setUpdateStatusPending] = useState(false)

//   const { data, isLoading, isError } = useGetSelectedExternalUnits(projectId!)
//  const selectedUnits = data?.selectedUnits || []
//   const { mutateAsync: deleteUnitAsync, isPending: isDeleting } = useDeleteSelectedExternalUnit()

//   const filteredUnits = useMemo(() => {
//     if (!selectedUnits) return []
//     return selectedUnits.filter(
//       (unit: DisplaySingleExternalUnit) =>
//         unit?.unitName?.toLowerCase().includes(search.toLowerCase()) ||
//         unit?.unitCode?.toLowerCase().includes(search.toLowerCase()) ||
//         unit?.category?.toLowerCase().includes(search.toLowerCase()),
//     )
//   }, [selectedUnits, search])

//   const handleDelete = async (unitId: string) => {
//     try {
//       await deleteUnitAsync({ unitId, projectId: projectId! })
//       toast({
//         title: "Success",
//         description: "Unit deleted successfully",
//       })
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.message || "Failed to delete unit",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCompleteStatus = async () => {
//     setUpdateStatusPending(true)
//     // Simulate an API call to update status
//     setTimeout(() => {
//       setUpdateStatusPending(false)
//       toast({
//         title: "Success",
//         description: "Status updated successfully",
//       })
//     }, 2000)
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
//           <p className="text-slate-600 font-medium">Loading selected units...</p>
//         </div>
//       </div>
//     )
//   }

//   if (isError || !selectedUnits) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Failed to load selected units</h3>
//             <p className="text-red-600">Please try refreshing the page</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
//       {/* Header */}
//       <div className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-10">
//         <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col gap-4">
//             {/* Top Row - Back button and Title */}
//             <div className="flex items-center space-x-3 sm:space-x-4">
//               <Button
//                 onClick={() => navigate(-1)}
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-slate-300 hover:bg-slate-50 transition-all duration-200 rounded-xl"
//               >
//                 <i className="fa-solid fa-arrow-left text-slate-600"></i>
//                 <span className="hidden sm:inline text-slate-700 font-medium">Back</span>
//               </Button>

//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
//                   <i className="fa-solid fa-check-circle text-white text-lg sm:text-xl lg:text-2xl"></i>
//                 </div>
//                 <div>
//                   <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Selected Units</h1>
//                   <p className="text-slate-600 text-xs sm:text-sm lg:text-base">
//                     {filteredUnits.length} units selected for this project
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Row - Total Cost and Generate Bill */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
//               {/* Total Cost Card */}
//               <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-blue-200 shadow-sm">
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
//                   <i className="fa-solid fa-rupee-sign text-white text-sm"></i>
//                 </div>
//                 <div>
//                   <p className="text-xs sm:text-sm text-slate-600 font-medium">Total Project Cost</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
//                     ₹{(data?.totalCost || 0).toLocaleString("en-IN")}
//                   </p>
//                 </div>
//               </div>

//               {/* Generate Bill Button */}
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
//                 <Button
//                   variant="primary"
//                   onClick={handleCompleteStatus}
//                   isLoading={updateStatusPending}
//                   className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium"
//                   disabled={filteredUnits.length === 0}
//                 >
//                   <i className="fa-solid fa-file-invoice text-sm sm:text-base"></i>
//                   <span className="text-sm sm:text-base">Generate Bill</span>
//                 </Button>

//                 {/* Units Count Badge */}
//                 <div className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 sm:min-w-[100px]">
//                   <div className="text-center">
//                     <p className="text-xs text-slate-500">Units</p>
//                     <p className="text-sm font-semibold">{filteredUnits.length}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative w-full sm:max-w-md">
//             <Input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by unit name, code, or category..."
//               className="pl-10 pr-10 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 <i className="fa-solid fa-times"></i>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Empty State */}
//         {filteredUnits.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
//             <div className="text-center">
//               <div className="w-16 h-16 lg:w-24 lg:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <i className="fa-solid fa-inbox text-slate-400 text-2xl lg:text-3xl"></i>
//               </div>
//               <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-2">
//                 {search ? "No matching units found" : "No units selected yet"}
//               </h3>
//               <p className="text-slate-600 mb-6">
//                 {search ? "Try adjusting your search terms" : "Start by browsing and adding units from the catalog"}
//               </p>
//               {search && (
//                 <Button
//                   onClick={() => setSearch("")}
//                   variant="primary"
//                   className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
//                 >
//                   <i className="fa-solid fa-times mr-2"></i>
//                   Clear Search
//                 </Button>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* Units Grid */
//           <div className="w-full">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 sm:gap-6">
//               {filteredUnits.map((unit: DisplaySingleExternalUnit) => (
//                 <div
//                   key={unit._id}
//                   className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   {/* Image Container */}
//                   <div className="relative overflow-hidden">
//                     {unit.image ? (
//                       <img
//                         src={unit.image.url || "/placeholder.svg"}
//                         alt={unit.image.originalName}
//                         className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
//                         <div className="text-center">
//                           <i className="fa-solid fa-image text-3xl sm:text-4xl text-blue-400 mb-2"></i>
//                           <p className="text-blue-500 text-xs sm:text-sm">No Image</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Delete Button */}
//                     <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
//                       <Button
//                         onClick={() => handleDelete(unit._id!)}
//                         disabled={isDeleting}
//                         variant="danger"
//                         size="icon"
//                         className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Delete unit"
//                       >
//                         <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
//                       </Button>
//                     </div>

//                     {/* Price Badge */}
//                     <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
//                       ₹{unit.price.toFixed(2)}
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-4 sm:p-6">
//                     <div className="mb-4">
//                       <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
//                         {unit.unitName}
//                       </h3>
//                       <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 mb-3">
//                         <i className="fa-solid fa-barcode"></i>
//                         <span className="truncate">{unit.unitCode}</span>
//                       </div>
//                     </div>

//                     {/* Unit Details */}
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs sm:text-sm text-slate-600">Category</span>
//                         <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                           {unit.category}
//                         </span>
//                       </div>

//                       {/* Dimensions */}
//                       {unit.dimention && (
//                         <div className="pt-3 border-t border-slate-200">
//                           <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Dimensions</h4>
//                           <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs">
//                             <div className="text-center p-1 sm:p-2 bg-slate-50 rounded">
//                               <div className="font-medium text-slate-800">H</div>
//                               <div className="text-slate-600">{unit.dimention.height}mm</div>
//                             </div>
//                             <div className="text-center p-1 sm:p-2 bg-slate-50 rounded">
//                               <div className="font-medium text-slate-800">W</div>
//                               <div className="text-slate-600">{unit.dimention.width}mm</div>
//                             </div>
//                             <div className="text-center p-1 sm:p-2 bg-slate-50 rounded">
//                               <div className="font-medium text-slate-800">D</div>
//                               <div className="text-slate-600">{unit.dimention.depth}mm</div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Image Details */}
//                       {unit.image && (
//                         <div className="pt-3 border-t border-slate-200">
//                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-1">
//                             <span className="truncate">Original: {unit.image.originalName}</span>
//                             <span className="text-right sm:text-left">
//                               {new Date(unit.image.uploadedAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SelectedExternalUnits
