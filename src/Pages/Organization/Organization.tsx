import { useEffect, useState } from "react"
import { Button } from "../../components/ui/Button"
import { useGetMyOrganizations } from "../../apiList/orgApi"
import OrganizationCard from "../../components/OrganizationCard"
import CreateOrganizationModal from "../../components/CreateOrganizationModal"
import { Skeleton } from "../../components/ui/Skeleton"
import Sidebar from "../../shared/Sidebar"
import {LOGIN_ICONS_LOGIN_GROUP, LOGIN_LABELS } from "../../constants/constants"
import MobileSidebar from "../../shared/MobileSidebar"
import { useNavigate } from "react-router-dom"


export default function Organization() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 470);
  const navigate = useNavigate()

  let { data: organizations, isLoading, error, refetch } = useGetMyOrganizations()
  // organizations = {}


  const path = {
    ADMIN: `/login`,
    STAFF: `/login/staff`,
    CTO: `/login/cto`,
    WORKER: `/login/worker`,
    CLIENT: `/login/client`
  }


  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 470);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);



 


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>

          {/* Organizations Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error as any) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Organizations</h2>
          <p className="text-gray-600 mb-4">{(error as any)?.response?.data?.message || error?.message || "Something happened try again please"}</p>
        <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700 text-white active:scale-95">
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </Button>
           <Button onClick={() => navigate('/login/staff')} className="bg-blue-600 hover:bg-blue-700 text-white active:scale-95">
            <i className="fas fa-user mr-2"></i>
            Login
          </Button>
        </div>
        </div>
      </div>
    )
  }


  // organizations = []


  return (
    <main className="w-screen h-screen flex flex:1">

      {/* <Sidebar labels={LOGIN_LABELS} path={path} icons={LOGIN_ICONS} /> */}

      {isMobile ? (
        <MobileSidebar
          labels={LOGIN_LABELS}
          path={path}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          path={path}
          labels={LOGIN_LABELS}
          icons={LOGIN_ICONS_LOGIN_GROUP}
        />
      )}

      {/* HEADER */}
      <section className="w-full h-full">
        <div className="max-w-full min-h-[10%] bg-white/90 backdrop-blur-sm border-b border-blue-200">
          <div className="max-w-full mx-auto px-2 sm:px-6 py-3">
            <div className="flex  sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-6">

              {/* Title + Description */}
              <div className="flex flex:1 items-center">
                {isMobile &&
                  <button
                    onClick={openMobileSidebar}
                    className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    title="Open Menu"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </button>
                }
                <div className="flex flex-col gap-1 w-[50vw]">
                  <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">
                    <i className="fas fa-building mr-2 text-blue-600"></i>Organization
                  </h1>
                  <p className="text-sm sm:inline hidden text-blue-500">
                    Manage your organization and teams
                  </p>
                </div>
              </div>

              {/* Stats + Button */}

             { !organizations && <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="primary"
                  className=""
                >
                  <i className="fas fa-plus mr-1.5"></i>
                  <span className="hidden sm:inline">Create Organization</span>
                  <span className="inline sm:hidden">Create</span>
                </Button>

              </div>}
            </div>
          </div>
        </div>

        <div className=" min-h-[calc(100vh-10%)] sm:min-h-[calc(100vh-11%)] bg-gradient-to-br from-blue-50 via-white to-blue-100">
          <div className="max-w-full mx-auto px-4 sm:px-6 py-6 relative">
            {/* Statistics Cards */}
            {/* <div className="mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Organizations</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900">{totalOrganizations}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-building text-white text-lg"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

            {/* Organizations Grid */}
            {organizations ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">Your Organization</h2>
                </div>
                <div className=" xl:!w-[30%] lg:w-[50%] sm:w-[60%] w-[100%]">
                  {/* {organizations.map((org: any) => ( */}
                  <OrganizationCard organization={organizations} />
                  {/* ))} */}
                </div>
              </div>
            ) : (
              <div className="text-center py-2 overflow-y-auto max-h-[calc(100vh-15vh)]">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <i className="fas fa-building text-blue-500 text-4xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">No Organizations Yet</h3>
                  <p className="text-blue-600 mb-6 text-sm sm:text-base">
                    Create your first organization to start managing your teams and projects effectively
                  </p>

                  {/* Getting Started Steps */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 text-left">
                    <h4 className="font-semibold text-blue-900 mb-4 text-center">
                      <i className="fas fa-rocket mr-2"></i>
                      Getting Started
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <p className="text-sm text-gray-700">Create your organization with basic details</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <p className="text-sm text-gray-700">Invite team members to join your organization</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <p className="text-sm text-gray-700">Start managing tasks and projects together</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Create Your First Organization
                  </Button>
                </div>
              </div>
            )}

            <CreateOrganizationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
          </div>
        </div>
      </section>
    </main>
  )
}
