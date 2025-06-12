import { useState } from "react"
import { Button } from "../../components/ui/Button"
import { useGetMyOrganizations } from "../../apiList/orgApi"
import OrganizationCard from "../../components/OrganizationCard"
import CreateOrganizationModal from "../../components/CreateOrganizationModal"
import { Skeleton } from "../../components/ui/Skeleton"
import { Card, CardContent } from "../../components/ui/Card"

export default function Organization() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data: organizations, isLoading, error } = useGetMyOrganizations()

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Organizations</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </Button>
        </div>
      </div>
    )
  }


  // Calculate stats
  const totalOrganizations = organizations?.length || 0
  const totalStaff = Array.isArray(organizations) ? (organizations?.reduce((sum: number, org: any) => sum + (org.staffCount || 0), 0) || 0): 0
  const avgStaffPerOrg = totalOrganizations > 0 ? Math.round(totalStaff / totalOrganizations) : 0

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div> */}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                Organizations
              </h1>
              <p className="text-blue-600 mt-1 text-sm sm:text-base">Manage your organizations and teams efficiently</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-plus mr-2"></i>
              <span className="hidden sm:inline">Create Organization</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative">
        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> */}
        <div className="mb-8">
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
        </div>

        {/* Organizations Grid */}
        {organizations && organizations?.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-blue-900">Your Organizations ({totalOrganizations})</h2>
              {/* <div className="flex items-center space-x-2 text-sm text-blue-600">
                <i className="fas fa-filter"></i>
                <span className="hidden sm:inline">Filter & Sort</span>
              </div> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {organizations.map((org: any) => (
                <OrganizationCard key={org._id} organization={org} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
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
  )
}


// "use client"

// import { useState } from "react"
// import { Button } from "../../components/ui/Button"
// import { useGetMyOrganizations } from "../../apiList/orgApi"
// import OrganizationCard from "../../components/OrganizationCard"
// import CreateOrganizationModal from "../../components/CreateOrganizationModal"
// import { Skeleton } from "../../components/ui/Skeleton"

// export default function Organization() {
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const { data: organizations, isLoading, error } = useGetMyOrganizations()

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//         {/* Header Skeleton */}
//         <div className="bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div className="space-y-4">
//                 <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl" />
//                 <Skeleton className="h-5 sm:h-6 w-80 sm:w-96 rounded-xl" />
//                 <div className="flex gap-2">
//                   <Skeleton className="h-8 w-20 rounded-full" />
//                   <Skeleton className="h-8 w-24 rounded-full" />
//                 </div>
//               </div>
//               <Skeleton className="h-12 sm:h-14 w-full sm:w-48 rounded-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* Content Skeleton */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
//             {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//               <div key={i} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
//                 <Skeleton className="h-64 w-full rounded-2xl" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="text-center bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-white/20">
//           <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
//             <i className="fas fa-exclamation-triangle text-white text-2xl sm:text-3xl"></i>
//           </div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Something went wrong</h2>
//           <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">{error.message}</p>
//           <Button
//             onClick={() => window.location.reload()}
//             className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl"
//           >
//             <i className="fas fa-redo mr-3"></i>
//             Try Again
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const totalOrganizations = organizations?.length || 0

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Enhanced Header */}
//       <div className="bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
//             <div className="space-y-4">
//               {/* Title Section */}
//               <div className="space-y-2">
//                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
//                   Organizations
//                 </h1>
//                 <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
//                   Manage your organizations and teams efficiently
//                 </p>
//               </div>

//               {/* Stats Badges */}
//               <div className="flex flex-wrap gap-3">
//                 {totalOrganizations > 0 && (
//                   <>
//                     <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
//                       <i className="fas fa-building text-sm"></i>
//                       <span className="font-semibold text-sm">
//                         {totalOrganizations} {totalOrganizations === 1 ? "Organization" : "Organizations"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg">
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                       <span className="font-semibold text-sm">Active</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* CTA Button */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button
//                 onClick={() => setIsCreateModalOpen(true)}
//                 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 rounded-2xl text-lg font-semibold w-full sm:w-auto"
//               >
//                 <i className="fas fa-plus mr-3"></i>
//                 Create Organization
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         {organizations && organizations?.length > 0 ? (
//           <div className="space-y-8 sm:space-y-12">
//             {/* Section Header */}
//             <div className="text-center lg:text-left">
//               <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Organizations</h2>
//               <p className="text-gray-600 text-lg">
//                 {totalOrganizations} {totalOrganizations === 1 ? "organization" : "organizations"} ready to manage
//               </p>
//             </div>

//             {/* Organizations Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
//               {organizations.map((org: any) => (
//                 <div key={org._id} className="group">
//                   <OrganizationCard organization={org} />
//                 </div>
//               ))}
//             </div>

//             {/* Add More Section */}
//             <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-white/20">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
//                   <i className="fas fa-plus text-white text-2xl"></i>
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to expand?</h3>
//                 <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
//                   Create another organization to manage different teams or projects
//                 </p>
//                 <Button
//                   onClick={() => setIsCreateModalOpen(true)}
//                   variant="outline"
//                   className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
//                 >
//                   <i className="fas fa-plus mr-3"></i>
//                   Add Another Organization
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* Enhanced Empty State */
//           <div className="text-center py-16 sm:py-24">
//             <div className="max-w-2xl mx-auto px-4">
//               {/* Hero Icon */}
//               <div className="relative mb-12">
//                 <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 rounded-full flex items-center justify-center mx-auto shadow-2xl">
//                   <i className="fas fa-building text-blue-600 text-4xl sm:text-5xl"></i>
//                 </div>
//                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
//                   <i className="fas fa-sparkles text-white text-lg"></i>
//                 </div>
//               </div>

//               {/* Heading */}
//               <div className="mb-12">
//                 <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
//                   Welcome to Your
//                   <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
//                     Organization Hub
//                   </span>
//                 </h3>
//                 <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
//                   Create your first organization and start building amazing teams
//                 </p>
//               </div>

//               {/* Feature Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
//                 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                     <i className="fas fa-rocket text-white text-lg"></i>
//                   </div>
//                   <h4 className="font-bold text-gray-800 mb-2 text-lg">Quick Setup</h4>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Get started in minutes with our streamlined setup process
//                   </p>
//                 </div>

//                 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
//                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                     <i className="fas fa-users text-white text-lg"></i>
//                   </div>
//                   <h4 className="font-bold text-gray-800 mb-2 text-lg">Team Collaboration</h4>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Invite members and collaborate seamlessly across projects
//                   </p>
//                 </div>

//                 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
//                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                     <i className="fas fa-chart-line text-white text-lg"></i>
//                   </div>
//                   <h4 className="font-bold text-gray-800 mb-2 text-lg">Track Progress</h4>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Monitor team performance and project milestones
//                   </p>
//                 </div>
//               </div>

//               {/* Getting Started Steps */}
//               <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 mb-12 shadow-xl border border-white/20">
//                 <h4 className="text-2xl font-bold text-gray-800 mb-8 text-center">
//                   <i className="fas fa-map-marked-alt mr-3 text-blue-600"></i>
//                   Your Journey Starts Here
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                       <span className="text-2xl font-bold">1</span>
//                     </div>
//                     <h5 className="font-bold text-gray-800 mb-2 text-lg">Create</h5>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       Set up your organization with name, details, and branding
//                     </p>
//                   </div>

//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                       <span className="text-2xl font-bold">2</span>
//                     </div>
//                     <h5 className="font-bold text-gray-800 mb-2 text-lg">Invite</h5>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       Send invitation links to team members and colleagues
//                     </p>
//                   </div>

//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                       <span className="text-2xl font-bold">3</span>
//                     </div>
//                     <h5 className="font-bold text-gray-800 mb-2 text-lg">Collaborate</h5>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       Start managing projects and achieving goals together
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <Button
//                 onClick={() => setIsCreateModalOpen(true)}
//                 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 px-12 py-5 rounded-2xl text-xl font-bold"
//               >
//                 <i className="fas fa-plus mr-4"></i>
//                 Create Your First Organization
//               </Button>

//               {/* Help Text */}
//               <p className="text-gray-500 text-sm mt-8 leading-relaxed">
//                 Need assistance? Check out our{" "}
//                 <button className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors">
//                   documentation
//                 </button>{" "}
//                 or{" "}
//                 <button className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors">
//                   contact support
//                 </button>
//               </p>
//             </div>
//           </div>
//         )}

//         <CreateOrganizationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
//       </div>
//     </div>
//   )
// }

