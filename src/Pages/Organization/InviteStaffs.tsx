import React, { useState } from 'react'
import { Skeleton } from '../../components/ui/Skeleton';
// import { Badge } from './../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useGetStaffsByOrganization, useInviteStaffToOrganization, useRemoveStaffFromOrganization } from '../../apiList/orgApi';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import type { OrganizationOutletTypeProps } from './OrganizationChildren';
import { useAuthCheck } from '../../Hooks/useAuthCheck';
import { useCreateCommonUser } from '../../apiList/commonAuthApi';
import { SidePanel } from '../../shared/SidePanel/SidePanel';



const InviteStaffs: React.FC = () => {

  const { organizationId } = useParams()
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()

  const navigate = useNavigate()

  const { role, permission, ownerId } = useAuthCheck();


  const canDelete = role === "owner" || permission?.invitestaff?.delete;
  const canList = role === "owner" || permission?.invitestaff?.list;
  const canCreate = role === "owner" || permission?.invitestaff?.create;
  const canEdit = role === "owner" || permission?.invitestaff?.edit;



  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  // const [specificRoles, setSpecificRoles] = useState<string[]>([])

  // 🔎 search filters
  const [searchName, setSearchName] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [searchPhone, setSearchPhone] = useState("")

  const [isPanelOpen, setIsPanelOpen] = useState(false);


  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    role: 'staff'
  });

  const { data: staffs, isLoading: staffsLoading, error: staffsError, isError: staffIsError } = useGetStaffsByOrganization(organizationId!)

  const createUser = useCreateCommonUser();
  const removeStaff = useRemoveStaffFromOrganization()
  const inviteStaff = useInviteStaffToOrganization()






  const filteredStaffs = staffs?.filter((staff: any) => {
    return (
      (searchName === "" || staff.staffName?.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchEmail === "" || staff.email?.toLowerCase().includes(searchEmail.toLowerCase())) &&
      (searchPhone === "" || staff.phoneNo?.toString().includes(searchPhone))
    )
  })


  // 3. Logic to toggle roles in the array
  // const handleRoleToggle = (role: string) => {
  //   setSpecificRoles((prev) => {
  //     if (prev.includes(role)) {
  //       return prev.filter((r) => r !== role) // Remove if exists
  //     } else {
  //       return [...prev, role] // Add if doesn't exist
  //     }
  //   })
  // }



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
        // specificRole:specificRoles,
      })
      setInviteLink(response?.inviteLink || response)
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




  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the invite token (Mocking the structure your controller expects)
    const inviteData = {
      organizationId,
      role: formData.role,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 Days
      ownerId: ownerId
    };

    const inviteToken = btoa(JSON.stringify(inviteData));

    try {
      await createUser.mutateAsync({
        ...formData,
        invite: inviteToken
      });

      setIsPanelOpen(false);
      setFormData({ name: '', email: '', phoneNo: '', password: '', role: 'staff' });
      toast({ title: "Success", description: "Staff created successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create staff",
        variant: "destructive"
      });
    }
  };



  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  // }


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
    <div className="min-h-full max-h-full overflow-y-auto min-w-full bg-gradient-to-br from-blue-50 to-white gap-6">

      {/* <header> */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-full mx-auto px-2 lg:px-4 py-4">
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
                <h1 className="text-xl sm:text-2xl font-bold text-blue-900">Staff Management</h1>
                <div className="hidden sm:block h-8 w-px bg-gray-300" />
                <div className="bg-blue-100 p-2 rounded-xl">
                  <i className="fas fa-user text-blue-600 text-xl"></i>
                </div>
              </div>


              <section className='flex gap-2 items-center'>

                <div className="text-gray-600 text-sm bg-gray-100 px-3 py-2 rounded-lg">
                  <i className="fas fa-users mr-2"></i>
                  {staffs?.length} {staffs?.length > 1 ? "Members" : "Member"}
                </div>


                {/* Zoho-style Add Icon */}
                <button
                  onClick={() => setIsPanelOpen(true)}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  title="Add New Staff"
                >
                  <i className="fa-solid fa-plus text-lg"></i>
                </button>

              </section>
            </div>
          </div>
        </div>
      </header>



      {/* Reusable Side Panel with the Form */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Quick Create Staff"
      >
        <form onSubmit={handleCreateStaff} className="space-y-5">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              required
              placeholder="Enter staff name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              required type="email"
              placeholder="staff@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              required
              placeholder="e.g. 9876543210"
              value={formData.phoneNo}
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              required type="password"
              placeholder="Set initial password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-4 text-base bg-blue-600 hover:bg-blue-700"
            isLoading={createUser.isPending}
          >
            Register Staff
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Staff will be assigned to the current organization automatically.
          </p>
        </form>
      </SidePanel>

      <div className="w-full flex flex-col  p-4 gap-6 h-full">



        <div className="bg-white w-full max-w-full mx-auto p-6 sm:p-8 rounded-xl shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center gap-2">
              <i className="fas fa-user-plus text-blue-600 text-lg" />
              Invite Staffs
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate an invitation link for your staff.
            </p>
          </div>

          {/* Grid container for form and actions */}
          <div className={`grid grid-cols-1  md:grid-cols-3 md:gap-6 ${inviteLink ? "items-start" : "items-end"}`}>


            {/* Invite Link and Buttons */}
            <div className="md:col-span-2  mt-6 md:mt-0 space-y-3">
              {/* Generate Button or Link UI */}
              {!inviteLink ? (
                <>
                  {(canCreate || canEdit) && <Button
                    onClick={handleGenerateInviteLink}
                    isLoading={inviteStaff.isPending}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <i className="fas fa-link" />
                    Generate Invitation Link
                  </Button>}
                </>
              ) : (
                <div className="space-y-4">
                  {/* Link Display with Copy */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Invitation Link
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={inviteLink}
                        readOnly
                        className="flex-1 text-sm bg-blue-50 border border-blue-200 text-blue-800 rounded-md h-10"
                      />
                      <Button
                        onClick={handleCopyLink}
                        className="h-10 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleShareWhatsApp}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <i className="fab fa-whatsapp" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-copy" />
                      Copy
                    </Button>
                  </div>

                  {/* Regenerate Link Button */}
                  {(canCreate || canEdit) && <Button
                    onClick={handleGenerateInviteLink}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-sync-alt" />
                    Generate New Link
                  </Button>}
                </div>
              )}
            </div>
          </div>
        </div>



        {canList && <div className="bg-white p-6 py-2 w-full !min-h-[65vh] sm:!min-h-[70vh] lg:!min-h-[85vh] rounded-2xl shadow-lg overflow-y-auto max-h-[90%] custom-scrollbar">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
            <i className="fas fa-users mr-2" /> Staff Members ({filteredStaffs?.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <Input
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Input
              placeholder="Search by Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <Input
              placeholder="Search by Phone"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>

          {/* fourth desing */}
          <div className="hidden md:grid grid-cols-3 font-semibold text-gray-700 border-b border-gray-300 pb-3 text-sm uppercase tracking-wide">
            <p className='text-left px-4'>S. No</p>
            <p className='text-left'>Staff Details</p>
            {/* <p className='text-center'>Roles</p> */}
            <p className='text-center'>Action</p>
          </div>

          {filteredStaffs?.map((staff: any, index: number) => (
            <div
              key={staff._id}
              className="grid grid-cols-1 md:grid-cols-3  items-start md:items-center border-b border-gray-200 py-4 px-2 hover:bg-gray-50 transition"
            >
              <div className="text-gray-600 md:text-left px-4 font-medium">{index + 1}</div>

              <div className="space-y-0.5 ">
                <p className="font-semibold text-gray-900 text-base">{staff.staffName}</p>

              </div>



              {canDelete && <div className="mt-2 md:mt-0 md:text-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveStaff(staff._id, staff.staffName)}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md font-semibold text-sm transition"
                >
                  <i className="fas fa-trash-alt"></i>
                  Delete
                </Button>
              </div>}
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default InviteStaffs


// above is original