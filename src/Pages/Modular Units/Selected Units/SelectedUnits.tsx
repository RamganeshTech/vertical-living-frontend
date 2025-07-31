import { useParams, useOutletContext, useNavigate } from "react-router-dom"
import { toast } from "../../../utils/toast"


import { Button } from "../../../components/ui/Button"
import { Badge } from "../../../components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useCompleteModularUnitSelection, useDeleteSelectedModularUnit, useGetSelectedModularUnits } from "../../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi"
import type { OrganizationOutletTypeProps } from "../../Organization/OrganizationChildren";
import { NO_IMAGE } from "../../../constants/constants";

interface ISelectedUnit {
  unitId: string
  customId: string
  category: string
  image: string | null
  quantity: number
  singleUnitCost: number
}


export default function SelectedUnits() {
  const { projectId } = useParams()
  const { isMobile, openMobileSidebar } = useOutletContext<OrganizationOutletTypeProps>()
  const navigate = useNavigate()


  // Custom hooks
  const { data: selectedModularUnits, isLoading, error, refetch } = useGetSelectedModularUnits(projectId!)
  const { mutateAsync: deleteUnit, isPending: isDeleting } = useDeleteSelectedModularUnit()
  const { mutateAsync: completeSelection, isPending: isCompleting } = useCompleteModularUnitSelection()

  const handleDeleteUnit = async (unitId: string) => {
    try {
      await deleteUnit({ projectId: projectId!, unitId })
      toast({
        title: "Success",
        description: "Unit removed successfully",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message  || "Failed to delete unit",
        variant: "destructive",
      })
    }
  }

  const handleCompleteSelection = async () => {
    try {
      await completeSelection({ projectId: projectId! })
      toast({
        title: "Success",
        description: "Selection completed successfully",
      })
      // Navigate to next stage or wherever needed
      // navigate(`/${organizationId}/projectdetails/${projectId}/next-stage`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to complete selection",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatCategory = (category: string) => {
    return category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // const getCategoryIcon = (category: string) => {
  //   const iconMap: { [key: string]: string } = {
  //     bedCot: "fas fa-bed",
  //     crockery: "fas fa-utensils",
  //     tv: "fas fa-tv",
  //     wardrobe: "fas fa-tshirt",
  //     studyTable: "fas fa-desk",
  //     kitchenCabinet: "fas fa-kitchen-set",
  //     showcase: "fas fa-display",
  //     falseCeiling: "fas fa-home",
  //     shoeRack: "fas fa-shoe-prints",
  //   }
  //   return iconMap[category] || "fas fa-cube"
  // }


  const selectedUnits = selectedModularUnits?.selectedUnits || []
  const totalCost = selectedModularUnits?.totalCost || 0
  const hasUnits = selectedUnits.length > 0

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Fixed Header */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Selected Units</h1>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-slate-600 mb-4" />
            <p className="text-slate-600 text-lg">Loading selected units...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Fixed Header */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Selected Units</h1>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4" />
            <p className="text-red-600 text-lg mb-4">Failed to load selected units</p>
            <Button onClick={() => refetch()} variant="outline">
              <i className="fas fa-refresh mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Fixed Header with Total and Complete Button */}
      <div className="bg-white w-full shadow-sm border-b border-slate-200 px-4 py-4 flex-shrink-0">
        <div className="flex w-full items-center justify-between flex-wrap gap-4">
          {/* Left side - Menu button and title */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={openMobileSidebar}
                className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                title="Open Menu"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            )}
            <div className="flex gap-2 items-center flex-row-reverse w-70 justify-between sm:flex-row sm:justify-start">
              <div onClick={() => navigate(-1)} className="flex bg-gray-200  rounded-full items-center gap-2 backdrop-blur-sm px-4 py-2 ">
                <i className="fas fa-arrow-left text-sm"></i>
                <span className="text-sm font-medium">Back</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Selected Units</h1>
                <div className="flex items-center space-x-4 mt-1">
                  {!isMobile && <Badge variant="secondary" className="text-xs px-2 py-1 ">
                    <i className="fas fa-cube mr-1" />
                    {selectedUnits.length} {selectedUnits.length === 1 ? "Unit" : "Units"}
                  </Badge>}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Total and Complete button */}
          <div className="flex items-center  justify-between sm:justify-center space-x-4 w-full sm:w-fit">
            <div className="text-left sm:text-right">
              <p className="text-sm text-slate-600">Total Cost</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{formatCurrency(totalCost)}</p>
            </div>
            <Button
              isLoading={isCompleting}
              onClick={handleCompleteSelection}
              disabled={isCompleting || !hasUnits}
              className="px-4 md:px-6 bg-green-600 hover:bg-green-700 text-white"
            >
              {isCompleting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  {isMobile ? "..." : "Completing..."}
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-2" />
                  {isMobile ? "Generate" : "Generate Bill"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-6">
          <div className="max-w-full mx-auto">
            {/* Empty State */}
            {!hasUnits ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                  <i className="fas fa-cube text-3xl text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Units Selected</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  You haven't selected any modular units yet. Start by adding units to your project.
                </p>
              </div>
            ) : (
              <>
                {/* Units Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4">
                  {selectedUnits.map((unit: ISelectedUnit, index: number) => (

                    <Card
                      key={`${unit.unitId}-${index}`}
                      className="hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      {/* Unit Image */}
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={unit.image || NO_IMAGE}
                          alt={formatCategory(unit.category)}
                          className="w-full h-full  "
                        // onError={(e) => {
                        //   const target = e.target as HTMLImageElement
                        //   // target.src = getPlaceholderImage(unit.category)
                        // }}
                        />
                        {/* Delete Button Overlay */}
                        <Button
                          isLoading={isDeleting}
                          onClick={() => handleDeleteUnit(unit.unitId.toString())}
                          disabled={isDeleting}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 shadow-sm"
                        >
                          <i className="fas fa-trash text-sm" />
                        </Button>

                        {/* Category Icon Badge */}
                        {/* <div className="absolute top-2 left-2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <i className={`${getCategoryIcon(unit.category)} text-white text-sm`} />
                        </div> */}
                      </div>

                      {/* Card Content */}
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base md:text-lg font-semibold text-slate-900 truncate">
                              {formatCategory(unit.category)}
                            </CardTitle>
                            <p className="text-xs text-slate-500 truncate"><i className="fas fa-hashtag text-gray-500 text-xs "></i> {unit?.customId}</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Quantity */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <i className="fas fa-shopping-cart text-slate-400 text-xs" />
                              <span className="font-semibold text-slate-900">{unit.quantity}</span>
                            </div>
                          </div>

                          {/* Unit Cost */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Unit Cost:</span>
                            <div className="flex items-center space-x-2">
                              <i className="fas fa-rupee-sign text-slate-400 text-xs" />
                              <span className="font-semibold text-slate-900 text-sm">
                                {formatCurrency(unit.singleUnitCost)}
                              </span>
                            </div>
                          </div>

                          {/* Total Cost */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="text-sm font-medium text-slate-700">Total:</span>
                            <div className="flex items-center space-x-2">
                              <i className="fas fa-calculator text-green-500 text-xs" />
                              <span className="font-bold text-green-600 text-sm">
                                {formatCurrency(unit.quantity * unit.singleUnitCost)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Bottom Actions */}
                {/* <div className="flex items-center justify-center mt-8 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                  <Button onClick={() => refetch()} variant="ghost" disabled={isLoading} className="px-6">
                    <i className="fas fa-refresh mr-2" />
                    Refresh Data
                  </Button>
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {/* {(isDeleting || isCompleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3 mx-4">
            <i className="fas fa-spinner fa-spin text-blue-600 text-xl" />
            <span className="text-slate-700 font-medium">
              {isDeleting ? "Removing unit..." : "Completing selection..."}
            </span>
          </div>
        </div>
      )} */}
    </div>
  )
}