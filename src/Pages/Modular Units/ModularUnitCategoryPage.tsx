import type React from "react"
import { useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useGetModularUnits } from "../../apiList/Modular Unit Api/ModularUnitApi"
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs"
import SingleModularUnitCard from "./SingleModularUnitCard"
import AddModularUnit from "./AddModularUnit"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren"

export default function ModularUnitCategoryPage() {
  const { isMobile, openMobileSidebar } = useOutletContext<OrganizationOutletTypeProps>()
  const navigate = useNavigate()
  const { unitType, organizationId } = useParams() as { unitType: string; organizationId: string }
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)



  const { data, isLoading, isError } = useGetModularUnits(unitType, organizationId, appliedFilters, appliedSearch)

  const [unitToEdit, setUnitToEdit] = useState(null)

  const filterFields = Object.entries(modularUnitFieldConfig[unitType] || {}).filter(
    ([_, config]) => config.type === "select" || config.type === "checkbox",
  )

  const handleSearch = () => {
    setAppliedSearch(searchQuery)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const activeFiltersCount = Object.values(filters).flat().length

  return (
    <>
      {unitToEdit ? (
        <AddModularUnit unitToEdit={unitToEdit} setUnitToEdit={setUnitToEdit} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-y-auto">
          {/* Compact Category Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between text-white">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  {isMobile &&
                    <button
                      onClick={openMobileSidebar}
                      className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                      title="Open Menu"
                    >
                      <i className="fa-solid fa-bars"></i>
                    </button>
                  }
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                    <i className="fas fa-cube text-xl"></i>
                  </div>
                  <div className="">

                    <h1 className="text-2xl sm:text-3xl font-bold capitalize">{unitType} Collection</h1>
                    <p className="text-blue-100 text-sm">Premium {unitType} products</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <i className="fas fa-box text-sm"></i>
                    <span className="text-sm font-medium">{data?.length || 0} Products</span>
                  </div>

                  <div onClick={() => navigate(`/organizations/${organizationId}/modularunits`)} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <i className="fas fa-arrow-left text-sm"></i>
                    <span className="text-sm font-medium">Back</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
            {/* Search and Filter Controls */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border mb-6 sticky top-4 z-30">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex-1 flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <Input
                      placeholder="Search by name, id, etc."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="pl-10 pr-4 py-2 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>
                  <Button
                    isLoading={isLoading}
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    <i className="fas fa-search mr-1"></i>
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm`}
                  >
                    <i className="fas fa-filter"></i>
                    <span className="hidden sm:inline">Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>
                    )}
                  </Button>
                </div>


              </div>
            </div>

            {/* Filters Overlay Panel */}
            {showFilters && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)}></div>

                {/* Filter Panel */}
                <div className="fixed inset-x-8  sm:top-32 top-13 bottom-4 sm:inset-x-8 md:left-1/2 md:transform md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
                  <div className="flex flex-col h-full">
                    {/* Filter Header */}
                    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <i className="fas fa-sliders-h text-blue-600"></i>
                        Advanced Filters
                      </h3>
                      <div className="flex items-center gap-3">
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="danger"
                            onClick={() => setFilters({})}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            <i className="fas fa-times mr-1"></i>
                            Clear All ({activeFiltersCount})
                          </Button>
                        )}
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                        >
                          <i className="fas fa-times text-lg"></i>
                        </button>
                      </div>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {filterFields.map(([fieldName, config]) => (
                          <div key={fieldName} className="space-y-3">
                            <label className="font-semibold text-gray-700 flex items-center gap-2">
                              <i className="fas fa-tag text-blue-500"></i>
                              {config.label}
                            </label>

                            {config.type === "select" && config.options && (
                              <Select

                                onValueChange={(value) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    [fieldName]: value ? [value] : [],
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500">
                                  <SelectValue placeholder="All"
                                    selectedValue={filters[fieldName]?.[0] || ""}
                                  />


                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">All</SelectItem>
                                  {config.options.map((opt: string) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}

                            {config.type === "checkbox" && config.options && (
                              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                                <div className="space-y-2">
                                  {config.options.map((opt: string) => (
                                    <label
                                      key={opt}
                                      className="flex items-center gap-2 cursor-pointer hover:bg-white rounded p-1 transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={filters[fieldName]?.includes(opt) || false}
                                        onChange={(e) => {
                                          setFilters((prev) => {
                                            const existing = prev[fieldName] || []
                                            return {
                                              ...prev,
                                              [fieldName]: e.target.checked
                                                ? [...existing, opt]
                                                : existing.filter((v) => v !== opt),
                                            }
                                          })
                                        }}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                      <span className="text-gray-700 text-sm">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filter Footer */}
                    <div className="p-6 border-t bg-gray-50">
                      <div className="flex justify-center">
                        <Button
                          isLoading={isLoading}
                          onClick={() => {
                            setAppliedFilters(filters)
                            setShowFilters(false)
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg shadow-lg"
                        >
                          <i className="fas fa-check mr-2"></i>
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                  <i className="fas fa-exclamation-triangle text-red-500 text-2xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
                  <p className="text-red-600">Failed to load products. Please try again later.</p>
                </div>
              </div>
            ) : data?.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-xl p-8 max-w-md mx-auto">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-4">No {unitType} products match your current filters.</p>
                  <Button
                    onClick={() => {
                      setFilters({})
                      setAppliedFilters({})
                      setSearchQuery("")
                      setAppliedSearch("")
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    <i className="fas fa-refresh mr-2"></i>
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data?.map((unit: any) => (
                  <SingleModularUnitCard key={unit._id} unit={unit} onEdit={setUnitToEdit} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
