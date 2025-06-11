"use client"

import { useState } from "react"
import { Button } from "../../components/ui/Button" 
import { useGetMyOrganizations } from "../../apiList/orgApi" 
import OrganizationCard from "../../components/OrganizationCard" 
import CreateOrganizationModal from "../../components/CreateOrganizationModal" 
import { Skeleton } from "../../components/ui/Skeleton" 
import { FiUpload as Upload, } from "react-icons/fi";


export default function Organization() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data: organizations, isLoading, error } = useGetMyOrganizations()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Organizations</h2>
//           <p className="text-gray-600">{error.message}</p>
//         </div>
//       </div>
//     )
//   }

console.log("organization", organizations)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Organizations</h1>
            <p className="text-blue-600 mt-1">Manage your organizations and teams</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </div>

        {organizations && organizations?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org: any) => (
              <OrganizationCard key={org._id} organization={org} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Organizations Yet</h3>
            <p className="text-blue-600 mb-4">Create your first organization to get started</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Organization
            </Button>
          </div>
        )}

        <CreateOrganizationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </div>
    </div>
  )
}
