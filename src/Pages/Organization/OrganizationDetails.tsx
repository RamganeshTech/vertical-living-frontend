import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { toast } from "../../utils/toast"
import { Skeleton } from "../../components/ui/Skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import {
  // useGetStaffsByOrganization,
  useGetSingleOrganization,
  useUpdateOrganizationName,
} from "../../apiList/orgApi"
import { COMPANY_DETAILS, } from "../../constants/constants"
import { useState } from "react"

export default function OrganizationDetails() {
  const { organizationId } = useParams<{ organizationId: string }>()

  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")


  const [editingPhone, setEditingPhone] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [tempPhone, setTempPhone] = useState("")
  const [tempAddress, setTempAddress] = useState("")


  // Fetch organization and staff data
  let { data: organization, isLoading: orgLoading, error: orgError } = useGetSingleOrganization(organizationId!)
  // const { data: staffs, isLoading: staffsLoading } = useGetStaffsByOrganization(organizationId!)

  if (Array.isArray(organization)) {
    organization = organization[0]
  }
  console.log(organization, "isArray:", Array.isArray(organization))

  const updateOrganization = useUpdateOrganizationName()


  const handleUpdateName = async () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Organization name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      await updateOrganization.mutateAsync({ updateField: { organizationName: editName }, orgsId: organizationId! })
      toast({
        title: "Success",
        description: "Organization name updated successfully",
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization name",
        variant: "destructive",
      })
    }
  }

  const handleStartEdit = () => {
    setEditName(organization?.organizationName || "")
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditName("")
    setIsEditing(false)
  }

  const handleStartEditPhone = () => {
    setTempPhone(organization?.organizationPhoneNo || "")
    setEditingPhone(true)
  }

  const handleStartEditAddress = () => {
    setTempAddress(organization?.address || "")
    setEditingAddress(true)
  }

  const handleSavePhone = async () => {
    if (!tempPhone.trim()) {
      toast({
        title: "Error",
        description: "Phone number cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      await updateOrganization.mutateAsync({
        orgsId: organizationId!,
        updateField: { organizationPhoneNo: tempPhone },
      })
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      })
      setEditingPhone(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update phone number",
        variant: "destructive",
      })
    }
  }

  const handleSaveAddress = async () => {
    if (!tempAddress.trim()) {
      toast({
        title: "Error",
        description: "Address cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      await updateOrganization.mutateAsync({
        orgsId: organizationId!,
        updateField: { address: tempAddress },
      })
      toast({
        title: "Success",
        description: "Address updated successfully",
      })
      setEditingAddress(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      })
    }
  }

  const handleCancelEditPhone = () => {
    setTempPhone("")
    setEditingPhone(false)
  }

  const handleCancelEditAddress = () => {
    setTempAddress("")
    setEditingAddress(false)
  }

  // Loading state
  if (orgLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-7xl   mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
                <div className="hidden sm:block h-6 w-px bg-gray-300" />
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
                <Skeleton className="h-6 w-32 sm:h-8 sm:w-48" />
              </div>
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (orgError || !organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-building text-blue-500 text-2xl"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Organization Not Found</h2>
          <p className="text-blue-600 mb-4 text-sm sm:text-base">
            The organization you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button
            onClick={() => navigate("/organizations")}
            variant="primary"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Organizations
          </Button>
        </div>
      </div>
    )
  }



  // bg-gradient-to-br from-[#0ae12e] to-[#add8e6] for customized linear gradient output
  return (
    <div className="flex w-full h-full">
      <div className={`min-h-full bg-gradient-to-br from-blue-50 via-white bg-blue-100`}>
      
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-full mx-auto px-4 sm:px-6 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Section */}
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/organizations")}
                  className="text-blue-600 hover:bg-blue-50 rounded-xl flex-shrink-0"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  <span className="hidden sm:inline">Back to Organizations</span>
                  <span className="sm:hidden">Back</span>
                </Button>

                <div className="hidden sm:block h-6 w-px bg-gray-300 flex-shrink-0" />

                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    {organization?.logoUrl ? (
                      <img
                        src={organization?.logoUrl || COMPANY_DETAILS.COMPANY_LOGO}
                        alt={organization?.organizationName}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover"
                      />
                    ) : (
                      <img
                        src={COMPANY_DETAILS.COMPANY_LOGO || "/placeholder.svg"}
                        alt="Company Logo"
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-lg sm:text-xl font-bold border-2 border-blue-300 focus:border-blue-500 rounded-xl bg-white/90 backdrop-blur-sm"
                            onKeyPress={(e) => e.key === "Enter" && handleUpdateName()}
                            placeholder="Organization name"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleUpdateName}
                            isLoading={updateOrganization.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                          >
                            <i className="fas fa-check mr-1"></i>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                          >
                            <i className="fas fa-times mr-1"></i>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-lg sm:text-2xl font-bold text-blue-900 truncate">
                          {organization?.organizationName || "N/A"}
                        </h1>
                        {organization?.type && (
                          <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">{organization?.type}</Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Edit Button */}
              {!isEditing && (
                <div className="flex justify-end sm:justify-start">
                  <Button
                    variant="outline"
                    onClick={handleStartEdit}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl bg-white/80 backdrop-blur-sm"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    <span className="hidden sm:inline">Edit Name</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="max-w-full mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center text-lg">
                    <i className="fas fa-building mr-2"></i>
                    Organization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {
                    <div className="p-3 bg-blue-50 rounded-xl">
                      {editingPhone ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <i className="fas fa-phone text-blue-600"></i>
                            <div className="flex-1">
                              <Input
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                                placeholder="Enter phone number"
                                className="text-sm border-blue-200 focus:border-blue-500 bg-white"
                                onKeyPress={(e) => e.key === "Enter" && handleSavePhone()}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEditPhone}
                              className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs px-3 py-1"
                            >
                              <i className="fas fa-times mr-1"></i>
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={handleSavePhone}
                              isLoading={updateOrganization.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                            >
                              <i className="fas fa-check mr-1"></i>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <i className="fas fa-phone text-blue-600"></i>
                            <span className="text-gray-700 text-sm sm:text-base">
                              {organization?.organizationPhoneNo || "N/A"}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleStartEditPhone}
                            className=" text-blue-600 hover:bg-blue-100 p-1 h-auto"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                  {
                    <div className="p-3 bg-blue-50 rounded-xl">
                      {editingAddress ? (
                        <div className="space-y-3 ">
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-map-marker-alt text-blue-600 mt-1"></i>
                            <div className="flex-1">
                              <textarea
                                value={tempAddress}
                                onChange={(e) => setTempAddress(e.target.value)}
                                placeholder="Enter address"
                                className="w-full text-sm border-2 border-blue-200 focus:border-blue-500 bg-white rounded-lg p-2 resize-none focus:outline-none"
                                rows={3}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSaveAddress()
                                  }
                                }}
                              />
                              <div className="flex items-center gap-[5px] text-blue-600">
                                <i className="fa-solid fa-circle-info"></i>
                                <span className=" sm:text-sm text-[12px]">Press shift + enter for next Line</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEditAddress}
                              className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs px-3 py-1"
                            >
                              <i className="fas fa-times mr-1"></i>
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={handleSaveAddress}
                              isLoading={updateOrganization.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                            >
                              <i className="fas fa-check mr-1"></i>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between group">
                          <div className="flex items-start space-x-3 space-y-14">
                            <i className="fas fa-map-marker-alt text-blue-600 mt-1"></i>
                            <span className="text-gray-700 text-sm sm:text-base flex-1 break-words whitespace-normal">{organization?.address || "N/A"}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleStartEditAddress}
                            className="text-blue-600 hover:bg-blue-100 p-1 h-auto flex-shrink-0"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                  {/* <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                    <i className="fas fa-users text-blue-600"></i>
                    <span className="text-gray-700 text-sm sm:text-base">{staffs?.length || 0} Staff Members</span>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
 
  )
}
