import type React from "react"
import { useState } from "react"
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom"
import { useGetWardrobeUnitsInfinite } from "../../apiList/ExternalUnit Api/ExternalUnitAPi"
import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren"

// Define categories type
type Category = {
  id: string
  name: string
  path: string
  icon: string
}

// Mock categories - replace with actual data from your API later
const categories: Category[] = [{ id: "1", name: "Wardrobe", path: "wardrobe", icon: "fa-solid fa-door-open" }]

const ExternalMain: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { isMobile, openMobileSidebar } = useOutletContext<OrganizationOutletTypeProps>()

  // Get wardrobe units for display
  const { data } = useGetWardrobeUnitsInfinite("")
  const wardrobeUnits = data?.pages.flatMap((page) => page.items).slice(0, 8) ?? []

  // Determine active category based on current path
  const activeCategory = categories.find((cat) => location.pathname.includes(cat.path))?.name || "All Categories"
  const pathArray = location.pathname.split("/")
  const isChild = pathArray[pathArray.length - 1] !== "externalunits"

  // Check if we're in project details to show add functionality
  const isInProjectDetails = location.pathname.includes("projectdetails")

  if (isChild) {
    return <Outlet />
  }

  return (
    <div className="flex max-h-full overflow-y-auto  bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed" : "relative"}
          ${isMobile && !sidebarOpen ? "translate-x-[-350px] " : "translate-x-0"}
          w-72 !h-[95vh] sm:w-80 bg-white shadow-xl border-r border-blue-200 z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 sm:p-6 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-cyan-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* {isMobile && (
                  <button
                    onClick={openMobileSidebar}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Open Menu"
                  >
                    <i className="fa-solid fa-bars text-white"></i>
                  </button>
                )} */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Categories</h2>
                  <p className="text-blue-100 text-xs sm:text-sm">Browse our products</p>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors lg:hidden"
                >
                  <i className="fa-solid fa-times text-white"></i>
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 sm:p-6">
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`${category.path}`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-200 group
                    ${activeCategory === category.name
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]"
                      : "hover:bg-blue-50 text-slate-700 hover:text-slate-900 hover:shadow-md"
                    }
                  `}
                >
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors
                      ${activeCategory === category.name ? "bg-white/20" : "bg-blue-100 group-hover:bg-blue-200"}
                    `}
                  >
                    <i
                      className={`${category.icon} text-sm sm:text-base ${activeCategory === category.name ? "text-white" : "text-blue-600"
                        }`}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm sm:text-base">{category.name}</span>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-right transition-transform text-xs sm:text-sm ${activeCategory === category.name ? "text-white" : "text-slate-400"
                      } group-hover:translate-x-1`}
                  ></i>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header for External Main */}
        <div className="bg-white border-b border-blue-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left side - Mobile menu + Title */}
              <div className="flex  justify-between items-center w-full">
                <div className="flex  items-center space-x-3 sm:space-x-4">
                  {isMobile && (
                    <button
                      onClick={openMobileSidebar}
                      className="p-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors lg:hidden"
                    >
                      <i className="fa-solid fa-bars text-blue-600"></i>
                    </button>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <i className="fa-solid fa-home text-white text-lg sm:text-xl lg:text-2xl"></i>
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">External Units</h1>
                      <p className="text-slate-600 text-xs sm:text-sm lg:text-base hidden sm:block">
                        Complete home interior collection
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side - Selected Units Link (if in project details) */}
                {isInProjectDetails && (
                  <div className={`${isMobile && "flex gap-2 items-center"}`}>
                    <Link
                      to="../selectedexternalunits"
                      className={`flex items-center space-x-2 sm:space-x-3 ${isMobile ? "px-4 sm:px-6 py-2 sm:py-3" : "p-2"} bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base`}
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <i className="fa-solid fa-check-circle text-white text-xs sm:text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium sm:inline hidden">Selected Units</span>
                      </div>

                      {!isMobile && <i className="fa-solid fa-arrow-right text-xs sm:text-sm"></i>}
                    </Link>

                    <div>
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors lg:hidden"
                      >
                        <i className="fas fa-box text-lg text-blue-600"></i>
                      </button>
                    </div>
                  </div>

                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Full Width */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-auto">
          {/* Featured Products Grid */}
          {wardrobeUnits.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 sm:gap-6">
                {wardrobeUnits.map((unit) => (
                  <div
                    key={unit._id}
                    className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      {unit.image ? (
                        <img
                          src={unit.image.url || "/placeholder.svg"}
                          alt={unit.image.originalName}
                          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <div className="text-center">
                            <i className="fa-solid fa-image text-2xl sm:text-3xl text-blue-400 mb-2"></i>
                            <p className="text-blue-500 text-xs sm:text-sm">No Image</p>
                          </div>
                        </div>
                      )}
                      {/* Price Badge */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-lg">
                        ₹{unit.price.toFixed(2)}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 truncate">
                        {unit.unitName}
                      </h3>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-500 truncate">{unit.unitCode}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ml-2">
                          {unit.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExternalMain
