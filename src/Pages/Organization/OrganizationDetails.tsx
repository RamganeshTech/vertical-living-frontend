// import { Button } from '../../components/ui/Button'
// import { Badge } from '../../components/ui/Badge'
// import { toast } from '../../utils/toast';
// import { Skeleton } from '../../components/ui/Skeleton';
// import { Card, CardContent, CardHeader, CardTitle } from "./../../components/ui/Card"
// import { Avatar,  AvatarFallback, AvatarImage } from './../../components/ui/Avatar';
// import { useRemoveStaffFromOrganization, useGetStaffsByOrganization, useGetSingleOrganization, useInviteStaffToOrganization, useUpdateOrganizationName, useDeleteOrganization } from './../../apiList/orgApi';

// import {
//   FiArrowLeft as ArrowLeft,
//   FiUsers as Users,
//   FiMapPin as MapPin,
//   FiPhone as Phone,
//   FiMail as Mail,
//   FiUserPlus as UserPlus,
//   FiUserMinus as UserMinus,
//   FiEdit as Edit,
//   FiTrash2 as Trash2,
//   FiCopy as Copy,
//   FiMessageCircle as MessageCircle,
//   FiCheck as Check,
// } from "react-icons/fi"
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import { Input } from '../../components/ui/Input';
// import { Label } from '../../components/ui/Label';
// import { COMPANY_DETAILS } from '../../constants/constants';



// export default function OrganizationDetails() {
//   const { organizationId } = useParams<{ organizationId: string }>()

//   if(!organizationId) return;

//   const [isEditing, setIsEditing] = useState(false)
//   const [editName, setEditName] = useState("")
//   const [inviteLink, setInviteLink] = useState("")
//   const [copied, setCopied] = useState(false)

//   // Fetch organization and staff data
//   const { data: organization, isLoading: orgLoading, error: orgError } = useGetSingleOrganization(organizationId!)
//   const { data: staffs, isLoading: staffsLoading } = useGetStaffsByOrganization(organizationId!)

//   // Mutations
//   const removeStaff = useRemoveStaffFromOrganization()
//   const inviteStaff = useInviteStaffToOrganization()
//   const updateOrganization = useUpdateOrganizationName()
//   const deleteOrganization = useDeleteOrganization()

//   const handleRemoveStaff = async (staffId: string, staffName: string) => {
//     if (window.confirm(`Are you sure you want to remove ${staffName} from this organization?`)) {
//       try {
//         await removeStaff.mutateAsync({
//           staffId,
//           orgId: organizationId!,
//         })
//         toast({
//           title: "Success",
//           description: `${staffName} has been removed from the organization`,
//         })
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to remove staff member",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const handleGenerateInviteLink = async () => {
//     try {
//       const response = await inviteStaff.mutateAsync({
//         organizationId: organizationId!,
//         role: "employee", // Default role
//       })
//       setInviteLink(response.inviteLink || response)
//       toast({
//         title: "Success",
//         description: "Invitation link generated successfully",
//       })
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to generate invitation link",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(inviteLink)
//       setCopied(true)
//       toast({
//         title: "Success",
//         description: "Link copied to clipboard",
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to copy link",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleShareWhatsApp = () => {
//     const message = `You're invited to join ${organization?.organizationName}! Click this link to register: ${inviteLink}`
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, "_blank")
//   }

//   const handleUpdateName = async () => {
//     if (!editName.trim()) {
//       toast({
//         title: "Error",
//         description: "Organization name cannot be empty",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       await updateOrganization.mutateAsync({ organizationName: editName })
//       toast({
//         title: "Success",
//         description: "Organization name updated successfully",
//       })
//       setIsEditing(false)
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update organization name",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteOrganization = async () => {
//     if (
//       window.confirm(
//         `Are you sure you want to delete "${organization?.organizationName}"? This action cannot be undone and will remove all associated staff.`,
//       )
//     ) {
//       try {
//         await deleteOrganization.mutateAsync(organizationId!)
//         toast({
//           title: "Success",
//           description: "Organization deleted successfully",
//         })
//         window.location.href = "/organizations"
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to delete organization",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//   }

//   // Loading state
//   if (orgLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center space-x-4 mb-8">
//             <Skeleton className="h-10 w-32" />
//             <Skeleton className="h-8 w-px" />
//             <Skeleton className="h-12 w-12 rounded-xl" />
//             <Skeleton className="h-8 w-48" />
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <Skeleton className="h-64 w-full rounded-2xl" />
//             <div className="lg:col-span-2">
//               <Skeleton className="h-96 w-full rounded-2xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Error state
// //   if (orgError || !organization) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
// //         <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <ArrowLeft className="w-8 h-8 text-red-600" />
// //           </div>
// //           <h2 className="text-2xl font-bold text-red-600 mb-2">Organization Not Found</h2>
// //           <p className="text-gray-600 mb-4">
// //             The organization you're looking for doesn't exist or you don't have access to it.
// //           </p>
// //           <Button variant="primary" onClick={() => (window.location.href = "/organizations")}>
// //             Back to Organizations
// //           </Button>
// //         </div>
// //       </div>
// //     )
// //   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
//         <div className="max-w-full mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => (window.location.href = "/organization")}
//                 className="text-blue-600 hover:bg-blue-50 rounded-xl"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back to Organizations
//               </Button>
//               <div className="h-6 w-px bg-gray-300" />
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                   {organization?.logoUrl ? (
//                     <img
//                       src={organization?.logoUrl || COMPANY_DETAILS.COMPANY_LOGO}
//                       alt={organization?.organizationName}
//                       className="w-7 h-7 rounded-lg object-cover"
//                     />
//                   ) : (
//                     // <ArrowLeft className="w-6 h-6 text-white" />
//                     <img
//                       src={COMPANY_DETAILS.COMPANY_LOGO} />
//                   )}
//                 </div>
//                 <div>
//                   {isEditing ? (
//                     <div className="flex items-center space-x-2">
//                       <Input
//                         value={editName}
//                         onChange={(e) => setEditName(e.target.value)}
//                         className="text-xl font-bold"
//                         onKeyPress={(e) => e.key === "Enter" && handleUpdateName()}
//                       />
//                       <Button
//                         size="sm"
//                         variant="primary"
//                         onClick={handleUpdateName}
//                         isLoading={updateOrganization.isPending}
//                       >
//                         Save
//                       </Button>
//                       <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
//                         Cancel
//                       </Button>
//                     </div>
//                   ) : (
//                     <h1 className="text-2xl font-bold text-blue-900">{organization?.organizationName}</h1>
//                   )}
//                   {organization?.type && <Badge className="mt-1">{organization?.type}</Badge>}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setEditName(organization?.organizationName)
//                   setIsEditing(true)
//                 }}
//                 className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
//               >
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit Name
//               </Button>
//               <Button
//                 variant="danger"
//                 onClick={handleDeleteOrganization}
//                 className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Organization Info */}
//           <div className="lg:col-span-1">
//             <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-blue-900 flex items-center">
//                   <ArrowLeft className="w-5 h-5 mr-2" />
//                   Organization Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {organization?.organizationPhoneNo && (
//                   <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
//                     <Phone className="w-5 h-5 text-blue-600" />
//                     <span className="text-gray-700">{organization?.organizationPhoneNo}</span>
//                   </div>
//                 )}
//                 {organization?.address && (
//                   <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
//                     <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
//                     <span className="text-gray-700">{organization?.address}</span>
//                   </div>
//                 )}
//                 <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
//                   <Users className="w-5 h-5 text-blue-600" />
//                   <span className="text-gray-700">{staffs?.length || 0} Staff Members</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Invite Staff */}
//             <Card className="mt-6 bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-blue-900 flex items-center">
//                   <UserPlus className="w-5 h-5 mr-2" />
//                   Invite Staff
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {!inviteLink ? (
//                   <Button
//                     variant="primary"
//                     onClick={handleGenerateInviteLink}
//                     isLoading={inviteStaff.isPending}
//                     className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
//                   >
//                     {inviteStaff.isPending ? "Generating..." : "Generate Invitation Link"}
//                   </Button>
                  
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="space-y-2">
//                       <Label className="text-blue-800">Invitation Link</Label>
//                       <div className="flex space-x-2">
//                         <Input value={inviteLink} readOnly className="border-blue-200 bg-blue-50 text-sm" />
//                         <Button
//                           onClick={handleCopyLink}
//                           variant="outline"
//                           size="icon"
//                           className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
//                         >
//                           {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="flex flex-col space-y-2">
//                       <Button
//                         onClick={handleCopyLink}
//                         variant="outline"
//                         className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
//                       >
//                         <Copy className="w-4 h-4 mr-2" />
//                         Copy Link
//                       </Button>
//                       <Button
//                         onClick={handleShareWhatsApp}
//                         className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
//                       >
//                         <MessageCircle className="w-4 h-4 mr-2" />
//                         Share on WhatsApp
//                       </Button>
//                        <Button
//                     variant="primary"
//                     onClick={handleGenerateInviteLink}
//                     isLoading={inviteStaff.isPending}
//                     className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
//                   >
//                     {inviteStaff.isPending ? "Generating..." : "Generate another"}
//                   </Button>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Staff List */}
//           <div className="lg:col-span-2">
//             <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-blue-900 flex items-center justify-between">
//                   <div className="flex items-center">
//                     <Users className="w-5 h-5 mr-2" />
//                     Staff Members ({staffs?.length || 0})
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {staffsLoading ? (
//                   <div className="space-y-4">
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="flex items-center space-x-4 p-4 border border-blue-100 rounded-xl">
//                         <Skeleton className="w-12 h-12 rounded-full" />
//                         <div className="flex-1 space-y-2">
//                           <Skeleton className="h-4 w-32" />
//                           <Skeleton className="h-3 w-48" />
//                         </div>
//                         <Skeleton className="h-8 w-20" />
//                       </div>
//                     ))}
//                   </div>
//                 ) : staffs && staffs.length > 0 ? (
//                   <div className="space-y-4">
//                     {staffs?.map((staff: any) => (
//                       <div
//                         key={staff._id}
//                         className="flex items-center justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50/50 transition-all duration-200"
//                       >
//                         <div className="flex items-center space-x-4">
//                           <Avatar className="w-12 h-12 border-2 border-blue-200">
//                             <AvatarImage src={staff?.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO} />
//                             <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
//                               {getInitials(staff?.staffName)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <h4 className="font-semibold text-blue-900">{staff?.staffName}</h4>
//                             <div className="flex items-center space-x-4 text-sm text-gray-600">
//                               <div className="flex items-center space-x-1">
//                                 <Mail className="w-3 h-3" />
//                                 <span>{staff.email}</span>
//                               </div>
//                               {staff.phoneNo && (
//                                 <div className="flex items-center space-x-1">
//                                   <Phone className="w-3 h-3" />
//                                   <span>{staff?.phoneNo}</span>
//                                 </div>
//                               )}
//                             </div>
//                             <Badge variant="outline" className="mt-1 text-xs border-blue-200 text-blue-700">
//                               {staff?.role}
//                             </Badge>
//                           </div>
//                         </div>
//                         <Button
//                           onClick={() => handleRemoveStaff(staff?._id, staff?.staffName)}
//                           variant="danger"
//                           size="sm"
//                           className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
//                           isLoading={removeStaff.isPending}
//                         >
//                           <UserMinus className="w-4 h-4 mr-1" />
//                           Remove
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Users className="w-10 h-10 text-blue-500" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-blue-900 mb-2">No Staff Members Yet</h3>
//                     <p className="text-blue-600 mb-4">Invite staff members to start building your team</p>
//                     <Button
//                       onClick={handleGenerateInviteLink}
//                       variant="primary"
//                       className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
//                     >
//                       <UserPlus className="w-4 h-4 mr-2" />
//                       Generate Invite Link
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { toast } from "../../utils/toast"
import { Skeleton } from "../../components/ui/Skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import {
  useRemoveStaffFromOrganization,
  useGetStaffsByOrganization,
  useGetSingleOrganization,
  useInviteStaffToOrganization,
  useUpdateOrganizationName,
} from "../../apiList/orgApi"
import { COMPANY_DETAILS } from "../../constants/constants"
import { useState } from "react"

export default function OrganizationDetails() {
  const { organizationId } = useParams<{ organizationId: string }>()

  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  // Fetch organization and staff data
  const { data: organization, isLoading: orgLoading, error: orgError } = useGetSingleOrganization(organizationId!)
  const { data: staffs, isLoading: staffsLoading } = useGetStaffsByOrganization(organizationId!)



  // Mutations
  const removeStaff = useRemoveStaffFromOrganization()
  const inviteStaff = useInviteStaffToOrganization()
  const updateOrganization = useUpdateOrganizationName()

  const handleRemoveStaff = async (staffId: string, staffName: string) => {
    if (window.confirm(`Are you sure you want to remove ${staffName} from this organization?`)) {
      try {
        await removeStaff.mutateAsync({
          staffId,
          orgId: organizationId!,
        })
        toast({
          title: "Success",
          description: `${staffName} has been removed from the organization`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to remove staff member",
          variant: "destructive",
        })
      }
    }
  }

  const handleGenerateInviteLink = async () => {
    try {
      const response = await inviteStaff.mutateAsync({
        organizationId: organizationId!,
        role: "staff",
      })
      setInviteLink(response.inviteLink || response)
      toast({
        title: "Success",
        description: "Invitation link generated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate invitation link",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const handleShareWhatsApp = () => {
    const message = `You're invited to join ${organization?.organizationName}! Click this link to register: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

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
      await updateOrganization.mutateAsync({ organizationName: editName , orgsId:organizationId!})
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
            onClick={() => (window.location.href = "/organization")}
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
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white bg-blue-100`}>
      {/* Improved Mobile-Responsive Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/organization")}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center text-lg">
                  <i className="fas fa-building mr-2"></i>
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organization?.organizationPhoneNo && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                    <i className="fas fa-phone text-blue-600"></i>
                    <span className="text-gray-700 text-sm sm:text-base">{organization?.organizationPhoneNo}</span>
                  </div>
                )}
                {organization?.address && (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                    <i className="fas fa-map-marker-alt text-blue-600 mt-1"></i>
                    <span className="text-gray-700 text-sm sm:text-base">{organization?.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                  <i className="fas fa-users text-blue-600"></i>
                  <span className="text-gray-700 text-sm sm:text-base">{staffs?.length || 0} Staff Members</span>
                </div>
              </CardContent>
            </Card>

            {/* Invite Staff */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center text-lg">
                  <i className="fas fa-user-plus mr-2"></i>
                  Invite Staff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!inviteLink ? (
                  <Button
                    variant="primary"
                    onClick={handleGenerateInviteLink}
                    isLoading={inviteStaff.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
                  >
                    <i className="fas fa-link mr-2"></i>
                    {inviteStaff.isPending ? "Generating..." : "Generate Invitation Link"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-blue-800 font-medium">Invitation Link</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={inviteLink}
                          readOnly
                          className="border-blue-200 bg-blue-50 text-sm flex-1 min-w-0"
                        />
                        <Button
                          onClick={handleCopyLink}
                          variant="outline"
                          size="icon"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl flex-shrink-0"
                        >
                          <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <i className="fas fa-copy mr-2"></i>
                        Copy Link
                      </Button>
                      <Button
                        onClick={handleShareWhatsApp}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        <i className="fab fa-whatsapp mr-2"></i>
                        Share on WhatsApp
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleGenerateInviteLink}
                        isLoading={inviteStaff.isPending}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        {inviteStaff.isPending ? "Generating..." : "Generate Another"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Staff List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-users mr-2"></i>
                    <span className="text-lg">Staff Members ({staffs?.length || 0})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {staffsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border border-blue-100 rounded-xl">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                ) : staffs && staffs.length > 0 ? (
                  <div className="space-y-4">
                    {staffs?.map((staff: any) => (
                      <div
                        key={staff._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50/50 transition-all duration-200 gap-4"
                      >
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <Avatar className="w-12 h-12 border-2 border-blue-200 flex-shrink-0">
                            <AvatarImage src={staff?.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                              {getInitials(staff?.staffName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-blue-900 truncate">{staff?.staffName}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 gap-1 sm:gap-0">
                              <div className="flex items-center space-x-1">
                                <i className="fas fa-envelope text-xs"></i>
                                <span className="truncate">{staff.email}</span>
                              </div>
                              {staff.phoneNo && (
                                <div className="flex items-center space-x-1">
                                  <i className="fas fa-phone text-xs"></i>
                                  <span>{staff?.phoneNo}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mt-1 text-xs border-blue-200 text-blue-700">
                              {staff?.role}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRemoveStaff(staff?._id, staff?.staffName)}
                          variant="danger"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl w-full sm:w-auto"
                          isLoading={removeStaff.isPending}
                        >
                          <i className="fas fa-user-minus mr-1"></i>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-users text-blue-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">No Staff Members Yet</h3>
                    <p className="text-blue-600 mb-4 text-sm sm:text-base">
                      Invite staff members to start building your team
                    </p>
                    <Button
                      onClick={handleGenerateInviteLink}
                      variant="primary"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Generate Invite Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
