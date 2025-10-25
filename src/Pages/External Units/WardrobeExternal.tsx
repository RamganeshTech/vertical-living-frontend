import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetWardrobeUnitsInfinite } from "../../apiList/ExternalUnit Api/ExternalUnitAPi"
import { useAddSelectedExternal } from "../../apiList/ExternalUnit Api/selectedExternalApi"

import type { AddSingleExternalUnit, IDimentionRange } from "../../types/types"
import { toast } from "../../utils/toast"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"
import { NO_IMAGE } from "../../constants/constants"

const WardrobeExternal: React.FC = () => {
  const [search, setSearch] = useState("")
  const [selectedUnit, setSelectedUnit] = useState<AddSingleExternalUnit | null>(null)
  const [showDimensionModal, setShowDimensionModal] = useState(false)
  const [dimensions, setDimensions] = useState({
    height: "",
    width: "",
    depth: "",
  })

  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const debouncedSearch = useDebounce(search, 500)

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useGetWardrobeUnitsInfinite(debouncedSearch)

  const { mutateAsync: addSelectedUnit, isPending: isAdding } = useAddSelectedExternal()

  // Debounce hook
  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    React.useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay)
      return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
  }

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allUnits = data?.pages.flatMap((page) => page.items) ?? []

  // Generate dimension options from range
  const generateDimensionOptions = (range: IDimentionRange): number[] => {
    const options: number[] = []
    for (let i = range.start; i <= range.end; i += 20) {
      options.push(i)
    }
    return options
  }

  // // Mock dimension ranges - replace with actual data from your API
  // const dimensionRanges = {
  //   height: { start: 600, end: 800 },
  //   width: { start: 400, end: 600 },
  //   depth: { start: 300, end: 500 },
  // }

  const handleAddToSelected = (unit: any) => {
    const unitWithDimensions: AddSingleExternalUnit = {
      ...unit,
      dimention: unit.dimention,
    }
    setSelectedUnit(unitWithDimensions)
    setDimensions({
      height: unitWithDimensions.dimention.height.start.toString(),
      width: unitWithDimensions.dimention.width.start.toString(),
      depth: unitWithDimensions.dimention.depth.start.toString(),
    })
    setShowDimensionModal(true)
  }

  // const handleDimensionChange = (dimension: string, value: string) => {
  //   // setDimensions((prev) => ({
  //   //   ...prev,
  //   //   [dimension]: value,
  //   // }))

  //   const updated = {
  //     ...dimensions,
  //     [dimension]: value,
  //   };

  //   setDimensions(updated);

  //   // Calculate new price
  //   if (selectedUnit?.price && updated.height && updated.width && updated.depth) {
  //     const height = Number(updated.height); // Assume in mm
  //     const width = Number(updated.width);   // Assume in mm
  //     const depth = Number(updated.depth);   // Assume in mm

  //     // Convert mm to feet: 1 foot = 304.8 mm
  //     const heightFt = height / 304.8;
  //     const widthFt = width / 304.8;
  //     const depthFt = depth / 304.8;

  //     const cubicFeet = heightFt * widthFt * depthFt;

  //     // selectedUnit.price is now per cubic foot
  //     const newPrice = cubicFeet * selectedUnit.price * quantity;
  //     setTotalPrice(Number(Math.ceil(newPrice)));
  //   } else {
  //     setTotalPrice(null);
  //   }
  // }


  useEffect(() => {
    if (
      selectedUnit?.price &&
      dimensions.height &&
      dimensions.width &&
      dimensions.depth &&
      quantity
    ) {
      const recalculated = recalculateTotalPrice({
        height: dimensions.height,
        width: dimensions.width,
        depth: dimensions.depth,
        unitPrice: selectedUnit.price,
        quantity,
      });
      setTotalPrice(recalculated);
    } else {
      setTotalPrice(null);
    }
  }, [dimensions.height, dimensions.width, dimensions.depth, quantity, selectedUnit?.price]);



  const recalculateTotalPrice = ({
    height,
    width,
    depth,
    unitPrice,
    quantity,
  }: {
    height: string;
    width: string;
    depth: string;
    unitPrice: number;
    quantity: number;
  }): number => {
    if (!height || !width || !depth || !unitPrice || !quantity) return 0;

    const h = Number(height);
    const w = Number(width);
    const d = Number(depth);

    const heightFt = h / 304.8;
    const widthFt = w / 304.8;
    const depthFt = d / 304.8;

    const cubicFeet = heightFt * widthFt * depthFt;
    // console.log("cal cubic feet", cubicFeet)
    // const price = cubicFeet * unitPrice * quantity;
    // console.log("cal price before ceilt", price)
    // return Math.floor(price); // No decimals, always rounded up


    const pricePerUnit = Math.ceil(cubicFeet * unitPrice); // ⬅️ round per unit
    const total = pricePerUnit * quantity;

    return total; // no extra rounding
  };


  // const handleDimensionChange = (dimension: string, value: string) => {
  //   const updated = {
  //     ...dimensions,
  //     [dimension]: value,
  //   };

  //   setDimensions(updated);

  //   if (selectedUnit?.price && quantity) {
  //     const recalculated = recalculateTotalPrice({
  //       height: updated.height || "0",
  //       width: updated.width || "0",
  //       depth: updated.depth || "0",
  //       unitPrice: selectedUnit.price,
  //       quantity,
  //     });
  //     setTotalPrice(recalculated);
  //   } else {
  //     setTotalPrice(null);
  //   }
  // };

  const handleDimensionChange = (dimension: string, value: string) => {
    setDimensions((prev) => ({
      ...prev,
      [dimension]: value,
    }));
  };

  const handleConfirmAdd = async () => {
    if (!selectedUnit || !projectId || !dimensions.height || !dimensions.width || !dimensions.depth) return
    if (dimensions.height === "0" || dimensions.width === "0" || dimensions.depth === "0") {
      toast({
        title: "Error",
        description: "dimentions cannot be zero",
        variant: "destructive",
      })
      return
    }

    try {
      const { dimention, _id, ...withoutDimention } = selectedUnit
      const unitToAdd = {
        ...withoutDimention,
        dimention: {
          height: Number(dimensions.height),
          width: Number(dimensions.width),
          depth: Number(dimensions.depth),
        },
        totalPrice,
        quantity,
      }

      await addSelectedUnit({ projectId, selectedUnit: unitToAdd })
      toast({
        title: "Success",
        description: "Unit added to selected items successfully",
      })
      setShowDimensionModal(false)
      setSelectedUnit(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add unit",
        variant: "destructive",
      })
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const isInProjectDetails = location.pathname.includes("projectdetails")

  return (
    <div className="max-h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Enhanced Header with Back Button */}
      <div className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-10">
        <div className="pb-2 px-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left side - Back button + Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="icon"
                className="p-2 lg:p-3 rounded-xl border border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                title="Go back"
              >
                <i className="fa-solid fa-arrow-left text-blue-600"></i>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-door-open text-white text-lg sm:text-xl lg:text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Wardrobe Units</h1>
                  <p className="text-slate-600 text-xs sm:text-sm lg:text-base hidden sm:block">
                    Premium home interior collection
                  </p>
                </div>
              </div>
            </div>
            {/* Right side - Search Bar */}
            <div className="w-full sm:w-auto">
              <div className="relative w-full sm:w-64 lg:w-80">
                <Input
                  type="text"
                  placeholder="Search wardrobe units..."
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
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
          </div>
        </div>
      </div>

      {/* Content Area - Full Width */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading wardrobe units...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 lg:p-8">
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-exclamation-triangle text-red-500 text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-2">Something went wrong</h3>
              <p className="text-red-600 mb-6">{error?.message || "Failed to load wardrobe units"}</p>
              <Button
                onClick={() => refetch()}
                variant="danger"
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <i className="fa-solid fa-refresh mr-2"></i>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && allUnits.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-search text-slate-400 text-2xl lg:text-3xl"></i>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-slate-800 mb-2">No wardrobe units found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search terms or browse all categories</p>
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
        )}

        {/* Units Grid - Full Width */}
        {!isLoading && !isError && allUnits.length > 0 && (
          <div className="w-full min-h-[77vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 sm:gap-6">
              {allUnits.map((unit, index) => (
                <div
                  key={unit._id}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    {unit.image ? (
                      <img
                        src={unit.image.url || NO_IMAGE}
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
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Price Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-slate-600">Category</span>
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {unit.category}
                        </span>
                      </div>
                    </div>

                    {/* Add to Selected Button - Only show if in project details */}
                    {isInProjectDetails && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <Button
                          onClick={() => handleAddToSelected(unit)}
                          variant="primary"
                          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium text-sm"
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Add to Selected
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More Section */}
        {hasNextPage && !isLoading && !isError && (
          <div className="flex justify-center mt-8 lg:mt-12">
            {isFetchingNextPage ? (
              <div className="flex items-center space-x-3 text-slate-600">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-500"></div>
                <span className="font-medium">Loading more products...</span>
              </div>
            ) : (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="primary"
                className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Load More Products
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dimension Selection Modal */}
      {showDimensionModal && selectedUnit && (
        <div className="fixed inset-0  bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">Select Dimensions</h3>
                <button
                  onClick={() => setShowDimensionModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <i className="fa-solid fa-times text-slate-400"></i>
                </button>
              </div>

              {/* Unit Info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">{selectedUnit.unitName}</h4>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="truncate">{selectedUnit.unitCode}</span>
                  <span className="font-semibold text-emerald-600 ml-2">Base Price: ₹{selectedUnit.price.toFixed(2)}</span>
                  <span className="font-semibold text-indigo-600 ml-2">Final Price: ₹{totalPrice}</span>

                  {/* <div className="text-right text-slate-700 font-semibold">
                      Estimated Price: <span className="text-emerald-600">₹{totalPrice}</span>
                    </div>
                 */}
                </div>
              </div>

              {/* Dimension Selectors */}
              <div className="space-y-4 sm:space-y-6">


                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Quantity</Label>
                  <Select
                    value={quantity.toString()}
                    onValueChange={(val) => {
                      setQuantity(Number(val));
                    }}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select quantity" selectedValue={quantity.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => {
                        const option = i + 1;
                        return (
                          <SelectItem key={option} value={option.toString()}>
                            {option}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Height Dropdown */}
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Height (mm)</Label>
                  <Select onValueChange={(val: any) => handleDimensionChange("height", val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select height" selectedValue={dimensions.height} />
                    </SelectTrigger>
                    <SelectContent>
                      {generateDimensionOptions(selectedUnit.dimention.height).map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}mm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Width Dropdown */}
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Width (mm)</Label>
                  <Select onValueChange={(val: any) => handleDimensionChange("width", val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select width" selectedValue={dimensions.width} />
                    </SelectTrigger>
                    <SelectContent>
                      {generateDimensionOptions(selectedUnit.dimention.width).map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}mm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Depth Dropdown */}
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Depth (mm)</Label>
                  <Select onValueChange={(val: any) => handleDimensionChange("depth", val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select depth" selectedValue={dimensions.depth} />
                    </SelectTrigger>
                    <SelectContent>
                      {generateDimensionOptions(selectedUnit.dimention.depth).map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}mm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                <Button
                  onClick={() => setShowDimensionModal(false)}
                  variant="outline"
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAdd}
                  disabled={isAdding || !dimensions.height || !dimensions.width || !dimensions.depth}
                  variant="primary"
                  isLoading={isAdding}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    "Adding..."
                  ) : (
                    <>
                      <i className="fa-solid fa-check mr-2"></i>
                      Add to Selected
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WardrobeExternal
