

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useGetCTOByOrganization, useInviteCTOToOrganization, useRemoveCTOFromOrganization } from '../../apiList/orgApi'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { toast } from '../../utils/toast'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar'
import { COMPANY_DETAILS } from '../../constants/constants'
import type { OrganizationOutletTypeProps } from './OrganizationChildren'

const InviteCTO: React.FC = () => {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()


  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  const { data: CTOs, isLoading: CTOLoading, error: CTOError, isError: CTOIsError } = useGetCTOByOrganization(organizationId!)
  const removeCTO = useRemoveCTOFromOrganization()
  const inviteCTO = useInviteCTOToOrganization()

  const handleRemoveCTO = async (CTOId: string, CTOName: string) => {
    if (window.confirm(`Are you sure you want to remove ${CTOName} from this organization?`)) {
      try {
        await removeCTO.mutateAsync({ CTOId, orgId: organizationId! })
        toast({ title: "Success", description: `${CTOName} has been removed from the organization` })
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to remove CTO member", variant: "destructive" })
      }
    }
  }

  const handleGenerateInviteLink = async () => {
    try {
      const response = await inviteCTO.mutateAsync({ organizationId: organizationId!, role: "CTO" })
      setInviteLink(response.inviteLink || response)
      toast({ title: "Success", description: "Invitation link generated successfully" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate invitation link", variant: "destructive" })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast({ title: "Success", description: "Link copied to clipboard" })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" })
    }
  }

  const handleShareWhatsApp = () => {
    const message = `You're invited to join in the organization! Click this link to register: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase()

  if (CTOLoading) {
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

  if (CTOError || CTOIsError || !CTOs) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fas fa-building text-blue-600 text-xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Organization Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">You either do not have access or the organization does not exist.</p>
          <Button onClick={() => navigate("/organizations")} className="bg-blue-600 text-white w-full">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Organizations
          </Button>
        </div>
      </div>
    )
  }

  return (
   
     <div className="min-h-full max-h-full overflow-y-auto  min-w-full bg-gradient-to-br from-blue-50 to-white gap-6">

        <header>
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-full mx-auto px-2 sm:px-4 py-4">
             
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 {isMobile &&
                <button
                  onClick={openMobileSidebar}
                  className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
}
                <h1 className="text-xl sm:text-2xl font-bold text-blue-900">CTO Management</h1>
                <div className="hidden sm:block h-8 w-px bg-gray-300" />
                <div className="bg-blue-100 p-2 rounded-xl">
                  <i className="fas fa-user-tie text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="text-gray-600 text-sm bg-gray-100 px-3 py-2 rounded-lg">
                <i className="fas fa-users mr-2"></i>
                {CTOs?.length} {CTOs?.length > 1 ? "Members" : "Member"}
              </div>
            </div>
          </div>
        </div>
      </header>
      
       <div className="w-full flex flex-col md:flex-row p-4 gap-6 h-full">
     {/* invitiation link */}
      <div className="bg-white max-h-full w-full  md:w-1/2  p-6 rounded-2xl shadow-lg space-y-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center">
            <i className="fas fa-user-plus mr-2" /> Invite CTOs
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Invite CTOs to your organization by generating a link.
          </p>

          {!inviteLink ? (
            <Button
              onClick={handleGenerateInviteLink}
              isLoading={inviteCTO.isPending}
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
     
      <div className="bg-white p-6 py-2 w-full  md:w-1/2  rounded-2xl shadow-lg overflow-y-auto  max-h-[90%] custom-scrollbar">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
          <i className="fas fa-users mr-2" /> CTO Members ({CTOs.length})
        </h2>
        {CTOs.length === 0 ? (
          <div className="text-center text-blue-700 p-8">
            <i className="fas fa-user-slash text-3xl mb-2"></i>
            <p>No CTOs have been added yet.</p>
            <p className="text-sm">Generate a link to invite.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {CTOs.map((cto:any) => (
              <div
                key={cto._id}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={cto.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO}
                    />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(cto.CTOName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-blue-900 font-semibold">{cto.CTOName}</h4>
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-envelope mr-1" />
                      {cto.email}
                    </p>
                    {cto.phoneNo && (
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-phone-alt mr-1" />
                        {cto.phoneNo}
                      </p>
                    )}
                    <Badge className="mt-1 text-blue-800 border-blue-300">
                      {cto.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveCTO(cto._id, cto.CTOName)}
                  isLoading={removeCTO.isPending}
                  variant='danger'
                  className=" text-white bg-red-600 border border-red-200 hover:bg-red-700"
                >
                  {/* <i className="fas fa-user-minus mr-1" /> Remove */}
                  <i className="fas fa-trash-can mr-1 text-white" /> 
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

export default InviteCTO


// above is orginal




