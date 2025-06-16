import React, { useState } from 'react'
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from './../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useGetStaffsByOrganization, useInviteStaffToOrganization, useRemoveStaffFromOrganization } from '../../apiList/orgApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { COMPANY_DETAILS } from '../../constants/constants';

const InviteStaffs:React.FC = () => {

  const { organizationId } = useParams()

  const navigate = useNavigate()

  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  const { data: staffs, isLoading: staffsLoading, error:staffsError, isError: staffIsError } = useGetStaffsByOrganization(organizationId!)


  const removeStaff = useRemoveStaffFromOrganization()
  const inviteStaff = useInviteStaffToOrganization()

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
    const message = `You're invited to join in the organization! Click this link to register: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }



  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  
  // Loading state
  if (staffsLoading) {
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
  if (staffsError || staffIsError || !staffs) {
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

  return (
    // <div>
    //   <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
    //     <CardHeader>
    //       <CardTitle className="text-blue-900 flex items-center text-lg">
    //         <i className="fas fa-user-plus mr-2"></i>
    //         Invite Staff
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent className="space-y-4">
    //       {!inviteLink ? (
    //         <Button
    //           variant="primary"
    //           onClick={handleGenerateInviteLink}
    //           isLoading={inviteStaff.isPending}
    //           className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
    //         >
    //           <i className="fas fa-link mr-2"></i>
    //           {inviteStaff.isPending ? "Generating..." : "Generate Invitation Link"}
    //         </Button>
    //       ) : (
    //         <div className="space-y-3">
    //           <div className="space-y-2">
    //             <Label className="text-blue-800 font-medium">Invitation Link</Label>
    //             <div className="flex space-x-2">
    //               <Input
    //                 value={inviteLink}
    //                 readOnly
    //                 className="border-blue-200 bg-blue-50 text-sm flex-1 min-w-0"
    //               />
    //               <Button
    //                 onClick={handleCopyLink}
    //                 variant="outline"
    //                 size="icon"
    //                 className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl flex-shrink-0"
    //               >
    //                 <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
    //               </Button>
    //             </div>
    //           </div>
    //           <div className="flex flex-col space-y-2">
    //             <Button
    //               onClick={handleCopyLink}
    //               variant="outline"
    //               className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
    //             >
    //               <i className="fas fa-copy mr-2"></i>
    //               Copy Link
    //             </Button>
    //             <Button
    //               onClick={handleShareWhatsApp}
    //               className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
    //             >
    //               <i className="fab fa-whatsapp mr-2"></i>
    //               Share on WhatsApp
    //             </Button>
    //             <Button
    //               variant="primary"
    //               onClick={handleGenerateInviteLink}
    //               isLoading={inviteStaff.isPending}
    //               className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl"
    //             >
    //               <i className="fas fa-plus mr-2"></i>
    //               {inviteStaff.isPending ? "Generating..." : "Generate Another"}
    //             </Button>
    //           </div>
    //         </div>
    //       )}
    //     </CardContent>
    //   </Card>

    //   <div className="lg:col-span-2">
    //     <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
    //       <CardHeader>
    //         <CardTitle className="text-blue-900 flex items-center justify-between">
    //           <div className="flex items-center">
    //             <i className="fas fa-users mr-2"></i>
    //             <span className="text-lg">Staff Members ({staffs?.length || 0})</span>
    //           </div>
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         {staffsLoading ? (
    //           <div className="space-y-4">
    //             {[1, 2, 3].map((i) => (
    //               <div key={i} className="flex items-center space-x-4 p-4 border border-blue-100 rounded-xl">
    //                 <Skeleton className="w-12 h-12 rounded-full" />
    //                 <div className="flex-1 space-y-2">
    //                   <Skeleton className="h-4 w-32" />
    //                   <Skeleton className="h-3 w-48" />
    //                 </div>
    //                 <Skeleton className="h-8 w-20" />
    //               </div>
    //             ))}
    //           </div>
    //         ) : staffs && staffs.length > 0 ? (
    //           <div className="space-y-4">
    //             {staffs?.map((staff: any) => (
    //               <div
    //                 key={staff._id}
    //                 className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50/50 transition-all duration-200 gap-4"
    //               >
    //                 <div className="flex items-center space-x-4 min-w-0 flex-1">
    //                   <Avatar className="w-12 h-12 border-2 border-blue-200 flex-shrink-0">
    //                     <AvatarImage src={staff?.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO} />
    //                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
    //                       {getInitials(staff?.staffName)}
    //                     </AvatarFallback>
    //                   </Avatar>
    //                   <div className="min-w-0 flex-1">
    //                     <h4 className="font-semibold text-blue-900 truncate">{staff?.staffName}</h4>
    //                     <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 gap-1 sm:gap-0">
    //                       <div className="flex items-center space-x-1">
    //                         <i className="fas fa-envelope text-xs"></i>
    //                         <span className="truncate">{staff.email}</span>
    //                       </div>
    //                       {staff.phoneNo && (
    //                         <div className="flex items-center space-x-1">
    //                           <i className="fas fa-phone text-xs"></i>
    //                           <span>{staff?.phoneNo}</span>
    //                         </div>
    //                       )}
    //                     </div>
    //                     <Badge variant="outline" className="mt-1 text-xs border-blue-200 text-blue-700">
    //                       {staff?.role}
    //                     </Badge>
    //                   </div>
    //                 </div>
    //                 <Button
    //                   onClick={() => handleRemoveStaff(staff?._id, staff?.staffName)}
    //                   variant="danger"
    //                   size="sm"
    //                   className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl w-full sm:w-auto"
    //                   isLoading={removeStaff.isPending}
    //                 >
    //                   <i className="fas fa-user-minus mr-1"></i>
    //                   Remove
    //                 </Button>
    //               </div>
    //             ))}
    //           </div>
    //         ) : (
    //           <div className="text-center py-12">
    //             <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
    //               <i className="fas fa-users text-blue-500 text-2xl"></i>
    //             </div>
    //             <h3 className="text-lg font-semibold text-blue-900 mb-2">No Staff Members Yet</h3>
    //             <p className="text-blue-600 mb-4 text-sm sm:text-base">
    //               Invite staff members to start building your team
    //             </p>
    //             <Button
    //               onClick={handleGenerateInviteLink}
    //               variant="primary"
    //               className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
    //             >
    //               <i className="fas fa-user-plus mr-2"></i>
    //               Generate Invite Link
    //             </Button>
    //           </div>
    //         )}
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>


     <div className="min-h-full min-w-full flex bg-gradient-to-br from-blue-50 to-white gap-6 p-6">
          
           <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
         {/* invitiation link */}
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center">
                <i className="fas fa-user-plus mr-2" /> Invite Staffs
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Invite Staffs to your organization by generating a link.
              </p>
    
              {!inviteLink ? (
                <Button
                  onClick={handleGenerateInviteLink}
                  isLoading={inviteStaff.isPending}
                  className="w-full bg-blue-600 text-white py-3"
                >
                  <i className="fas fa-link mr-2" /> Generate Invitation Link
                </Button>
              ) : (
                <div className="space-y-4">
                  <Label>Invitation Link</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="bg-blue-50 text-blue-800 flex-1"
                    />
                    <Button onClick={handleCopyLink}>
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleShareWhatsApp}
                      className="w-full bg-green-600 text-white"
                    >
                      <i className="fab fa-whatsapp mr-2" /> Share on WhatsApp
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      className="w-full border border-blue-400 text-blue-700"
                    >
                      <i className="fas fa-copy mr-2" /> Copy
                    </Button>
                  </div>
                  <Button
                    onClick={handleGenerateInviteLink}
                    className="w-full bg-purple-600 text-white"
                  >
                    <i className="fas fa-sync-alt mr-2" /> Generate New Link
                  </Button>
                </div>
              )}
            </div>
          </div>
    
         {/*invited memebers */}
         
          <div className="bg-white p-6 rounded-2xl shadow-lg overflow-y-auto max-h-full">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
              <i className="fas fa-users mr-2" /> Staff Members ({staffs.length})
            </h2>
            {staffs.length === 0 ? (
              <div className="text-center text-blue-700 p-8">
                <i className="fas fa-user-slash text-3xl mb-2"></i>
                <p>No Staffs have been added yet.</p>
                <p className="text-sm">Generate a link to invite.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {staffs.map((staff:any) => (
                  <div
                    key={staff._id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={staff.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getInitials(staff.staffName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-blue-900 font-semibold">{staff.staffName}</h4>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-envelope mr-1" />
                          {staff.email}
                        </p>
                        {staff.phoneNo && (
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-phone-alt mr-1" />
                            {staff.phoneNo}
                          </p>
                        )}
                        <Badge className="mt-1 text-blue-800 border-blue-300">
                          {staff.role}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveStaff(staff._id, staff.staffName)}
                      isLoading={inviteStaff.isPending}
                      className="text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      <i className="fas fa-user-minus mr-1" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
  )
}

export default InviteStaffs