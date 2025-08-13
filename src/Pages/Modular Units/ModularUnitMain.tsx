"use client"

import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useGetAllMixedUnits } from "../../apiList/Modular Unit Api/ModularUnitApi"
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs"
import { Button } from "../../components/ui/Button"
import SingleModularUnitCard from "./SingleModularUnitCard"
import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren"
import { useGetSelectedModularUnits } from "../../apiList/Modular Unit Api/Selected Modular Api/selectedModularUnitApi"

type SingleUnitType = {
  _id: string
  name: string
  unitType: string
  unitName:string
  images?: { url: string }[]
  carcassMaterial?: string
  materialCarcass?: string
  price?: number
}

export default function ModularUnitMain() {

  const { isMobile, openMobileSidebar } = useOutletContext<OrganizationOutletTypeProps>()
  const { organizationId, projectId } = useParams() as { organizationId: string, projectId: string }

  const { data, isLoading, isError } = useGetAllMixedUnits(organizationId)
  const { data: selectedModularUnits } = useGetSelectedModularUnits(projectId!)


  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()


  const isProjectDetails = location.pathname.includes("projectdetails")


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  const isChildRoute = location.pathname.includes("add") || location.pathname.includes("category") || location.pathname.includes("selectedunits")

  const filteredCategories = Object.keys(modularUnitFieldConfig).filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      {isChildRoute ? (
        <div className={`${isProjectDetails ? "max-h-full" : "h-screen"}  bg-gradient-to-br from-gray-50 to-blue-50 overflow-y-auto`}>
          <Outlet context={{ isMobile, openMobileSidebar }} />
        </div>
      ) : (
        <div className={`${isProjectDetails ? "max-h-full" : "h-screen"} bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col overflow-hidden `}>
          {/* Header - Fixed */}
          <div className="bg-white shadow-lg border-b z-40 flex-shrink-0">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="flex ">
                    {isMobile &&
                      <button
                        onClick={openMobileSidebar}
                        className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                        title="Open Menu"
                      >
                        <i className="fa-solid fa-bars"></i>
                      </button>
                    }
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                      <i className="fas fa-cube text-white text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl  font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Product Catalog
                    </h1>
                    <p className="text-sm text-gray-500 sm:block hidden">Manage your modular units</p>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="flex sm:none">


                  {/* Desktop Add Button */}
                  {!isProjectDetails ? <Button
                    onClick={() => navigate(`add`)}
                    className="hidden md:flex  sm:px-4 py-2  items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-plus"></i>
                    Add <span className="hidden sm:inline">New Product</span>
                  </Button>
                    :
                    <div className="p-2 relative border-2 border-gray-300 rounded-lg">
                      <div className="w-6 justify-center items-center flex absolute top-[-12px] right-[-10px] h-6 rounded-full bg-gray-200 text-black">
                      <p className="text-gray-600 font-medium">{selectedModularUnits?.selectedUnits?.length}</p>
                      </div>
                      <Link to={`/${organizationId}/projectdetails/${projectId}/modularunits/selectedunits`}><i className="fas fa-shopping-cart text-xl text-blue-600 "></i></Link>
                    </div>
                  }

                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden border-2 border-gray-300  ml-1 cursor-pointer p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-box text-lg text-blue-600"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="flex-1 flex overflow-hidden ">
            <div onClick={() => setIsSidebarOpen(false)} className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 w-full overflow-hidden">
              {/* Mobile Sidebar Overlay */}

              {/* Sidebar - Fixed width with internal scroll */}

              <aside
                className={`
                  fixed md:static inset-y-0 left-0 !z-50 w-80 md:w-72 bg-white md:bg-white/90 md:backdrop-blur-sm
                  transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                  transition-transform duration-300 ease-in-out md:transition-none
                  shadow-2xl md:shadow-lg rounded-r-2xl md:rounded-2xl border-r md:border
                  flex flex-col md:h-full
                `}
              >
                {/* Sidebar Header - Fixed */}
                <div className="flex-shrink-0 p-6 border-b">
                  {/* Mobile header */}
                  <div className="flex items-center justify-between mb-4 md:hidden">
                    <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  {/* Search - Fixed */}
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Categories - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 pt-0">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 sticky top-0 bg-white py-2">
                      <i className="fas fa-layer-group"></i>
                      Product Categories
                    </h3>

                    {/* All Products Option */}
                    <button
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${selectedCategory === ""
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      onClick={() => {
                        setSelectedCategory("")
                        setIsSidebarOpen(false)
                      }}
                    >
                      <i className="fas fa-th-large"></i>
                      <span className="font-medium">All Products</span>
                      <span
                        className={`ml-auto text-xs px-2 py-1 rounded-full ${selectedCategory === "" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {data?.length || 0}
                      </span>
                    </button>

                    {filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${selectedCategory === cat
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        onClick={() => {
                          navigate(`category/${cat}`)
                          setIsSidebarOpen(false)
                        }}
                      >
                        <i className="fas fa-cube"></i>
                        <span className="font-medium capitalize">{cat}</span>
                        <span
                          className={`ml-auto text-xs px-2 py-1 rounded-full ${selectedCategory === cat ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {data?.filter((unit: SingleUnitType) => unit.unitType === cat)?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Add Button - Fixed */}
                <div className="flex-shrink-0 p-2 sm:p-6 border-t md:hidden">
                  <Button
                    onClick={() => {
                      navigate("add")
                      setIsSidebarOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl transition-all shadow-lg"
                  >
                    <i className="fas fa-plus"></i>
                    Add New Product
                  </Button>
                </div>
              </aside>

              {/* Main Content - Scrollable */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Content Header - Fixed */}
                <div className="flex-shrink-0 mb-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:p-6 p-2 px-4 shadow-lg border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 sm:mb-2 mb-1">
                          {selectedCategory ? `${selectedCategory} Products` : "All Products"}
                        </h2>
                        <p className="text-gray-600 flex items-center gap-2">
                          <i className="fas fa-info-circle"></i>
                          {data?.length ? `${data.length} products available` : "No products found"}
                        </p>
                      </div>

                      {/* Sort Options */}
                      {/* <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <i className="fas fa-sort"></i>
                          Sort by:
                        </label>
                        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                          <option>Newest First</option>
                          <option>Price: Low to High</option>
                          <option>Price: High to Low</option>
                          <option>Name A-Z</option>
                        </select>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Products Content - Scrollable */}
                <div className="flex-1 overflow-y-auto ">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading products...</p>
                      </div>
                    </div>
                  ) : isError ? (
                    <div className="text-center py-12">
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                        <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
                        <p className="text-red-600">Failed to load products. Please try again later.</p>
                      </div>
                    </div>
                  ) : data?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 max-w-md mx-auto">
                        <i className="fas fa-cube text-gray-400 text-5xl mb-6"></i>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">No Products Found</h3>
                        <p className="text-gray-600 mb-6">Get started by adding your first product to the catalog.</p>
                        {!isProjectDetails ? <Button
                          onClick={() => navigate("add")}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl transition-all shadow-lg"
                        >
                          <i className="fas fa-plus mr-2"></i>
                          Add Product
                        </Button> 
                        :
                          <Button
                            onClick={() => navigate(`/organizations/${organizationId}/modularunits/add`)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl transition-all shadow-lg"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Add Product
                          </Button>
                        }
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-6 overflow-y-auto">
                        {data?.map((unit: SingleUnitType) => (
                          <>
                            <SingleModularUnitCard key={`${unit._id}-5`} unit={unit} />
                          </>
                        ))}
                      </div>

                      {/* Load More Button */}
                      {/* <div className="text-center py-6">
                        <Button variant="secondary" className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all bg-white rounded-xl shadow-lg hover:shadow-xl">
                          <i className="fas fa-chevron-down mr-2"></i>
                          Load More Products
                        </Button>
                      </div> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
