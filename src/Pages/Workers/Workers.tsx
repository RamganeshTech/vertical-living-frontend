import { useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Avatar, AvatarFallback } from "../../components/ui/Avatar"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Skeleton } from "../../components/ui/Skeleton"

import { toast } from "../../utils/toast" 
import type { ProjectDetailsOutlet } from "../../types/types"
import { useGetWorkersAsStaff, useInviteWorkerByStaff, useRemoveWorkerAsStaff } from "../../apiList/orgApi"

export default function Workers() {
  const { projectId , organizationId} = useParams<{ projectId: string , organizationId: string}>()
  const {openMobileSidebar , isMobile} = useOutletContext<ProjectDetailsOutlet>()
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  // const [workerRole, setWorkerRole] = useState("")

  // Fetch workers data using the provided hook
  const { data: workers, isLoading: workersLoading } = useGetWorkersAsStaff(projectId || "")

  // Mutations using the provided hooks
  const inviteWorker = useInviteWorkerByStaff()
  const removeWorker = useRemoveWorkerAsStaff()

  const handleGenerateInviteLink = async () => {
    // if (!workerRole.trim()) {
    //   toast({
    //     title: "Error",
    //     description: "Please specify the worker role (e.g., Carpenter, Plumber, Electrician)",
    //     variant: "destructive",
    //   })
    //   return
    // }

    try {
      const response = await inviteWorker.mutateAsync({
        projectId: projectId || "",
        // specificRole: workerRole,
        role:"worker",
        organizationId: organizationId!
      })
      setInviteLink(response?.inviteLink || response)
      toast({
        title: "Success",
        description: "Worker invitation link generated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to generate invitation link",
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
    // We'll use the project name from the page if available, or a generic message
    const message = `You're invited to work with us Click this link to join: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleRemoveWorker = async (workerId: string, workerName: string) => {
    if (window.confirm(`Are you sure you want to remove ${workerName} from this project?`)) {
      try {
        await removeWorker.mutateAsync({
          workerId,
          projectId: projectId || "",
        })
        toast({
          title: "Success",
          description: `${workerName} has been removed from the project`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to remove worker",
          variant: "destructive",
        })
      }
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "WK"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getWorkerRoleColor = (role: string) => {
    if (!role) return "bg-purple-100 text-purple-800 border-purple-200"

    const colors: { [key: string]: string } = {
      carpenter: "bg-amber-100 text-amber-800 border-amber-200",
      plumber: "bg-blue-100 text-blue-800 border-blue-200",
      electrician: "bg-yellow-100 text-yellow-800 border-yellow-200",
      painter: "bg-green-100 text-green-800 border-green-200",
      mason: "bg-gray-100 text-gray-800 border-gray-200",
      welder: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[role.toLowerCase()] || "bg-purple-100 text-purple-800 border-purple-200"
  }

  return (
    <div className="max-h-full sm:overflow-y-hidden custom-scrollbar">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-full mx-auto  py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
               {isMobile && (
                  <button
                    onClick={openMobileSidebar}
                    className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    title="Open Menu"
                  >
                    <i className="fa-solid fa-bars "></i>
                  </button>
                )} 

              <div className="hidden sm:block w-px bg-gray-300 flex-shrink-0" />

              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
                      <i className="fas fa-user-plus mr-1"></i>
                    Invite Workers</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full !max-h-[100%] overflow-y-auto custom-scrollbar mx-auto p-2">
        <div className="grid grid-cols-1 max-h-full lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Invite Section */}
          <div className="lg:col-span-1 h-fit space-y-6">
            {/* Invite Workers */}
            <Card className="bg-white backdrop-blur-sm rounded-2xl shadow-md border-l-4 border-green-600 ">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center text-lg">
                  <i className="fas fa-user-plus mr-2 text-green-600"></i>
                  Invite Workers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Worker Role/Specialty</Label>
                  <Input
                    value={workerRole}
                    onChange={(e) => setWorkerRole(e.target.value)}
                    placeholder="e.g., Carpenter, Plumber, Electrician"
                    className="border-blue-200 focus:border-blue-500 bg-white/80"
                  />
                  <p className="text-xs text-gray-500">Specify the type of worker needed for this project</p>
                </div> */}

                {!inviteLink ? (
                  <Button
                    onClick={handleGenerateInviteLink}
                    isLoading={inviteWorker.isPending}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
                  >
                    <i className="fas fa-link mr-2"></i>
                    {inviteWorker.isPending ? "Generating..." : "Generate Invitation Link"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Invitation Link</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={inviteLink}
                          readOnly
                          className="border-green-200 bg-green-50 text-sm flex-1 min-w-0"
                        />
                        <Button
                          onClick={handleCopyLink}
                          variant="outline"
                          size="icon"
                          className="border-green-200 text-green-600 hover:bg-green-50 rounded-xl flex-shrink-0"
                        >
                          <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="w-full border-green-200 text-green-600 hover:bg-green-50 rounded-xl"
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
                        onClick={() => {
                          setInviteLink("")
                          // setWorkerRole("")
                        }}
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Generate Another
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Suggestions */}
            {/* <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-md border-l-4 border-blue-600 ">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center text-lg">
                  <i className="fas fa-tools mr-2 text-blue-600"></i>
                  Common Worker Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Carpenter", "Plumber", "Electrician", "Painter", "Mason", "Welder", "Roofer"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setWorkerRole(role)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        workerRole === role ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Workers List */}
          <div className="lg:col-span-2 sm:max-h-[43%] rounded-2xl border-l-4 border-orange-600  overflow-y-auto shadow-md custom-scrollbar">
            <Card className="bg-white/70 backdrop-blur-sm border-0  shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-hard-hat mr-2 text-orange-600"></i>
                    <span className="text-lg">Project Workers ({workers?.length || 0})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workersLoading ? (
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
                ) : workers && workers.length > 0 ? (
                  <div className="space-y-4">
                    {workers.map((worker: any) => (
                      <div
                        key={worker._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50/50 transition-all duration-200 gap-4"
                      >
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <Avatar className="w-12 h-12 border-2 border-blue-200 flex-shrink-0">
                            {/* <AvatarImage src={worker?.avatarUrl || "/placeholder.svg"} /> */}
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white font-semibold">
                              {getInitials(worker?.workerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {worker?.workerName || worker?.name}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 gap-1 sm:gap-0">
                              {worker.email && (
                                <div className="flex items-center space-x-1">
                                  <i className="fas fa-envelope text-xs"></i>
                                  <span className="truncate">{worker.email}</span>
                                </div>
                              )}
                              {worker.phoneNo && (
                                <div className="flex items-center space-x-1">
                                  <i className="fas fa-phone text-xs"></i>
                                  <span>{worker.phoneNo}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <Badge
                                className={`text-xs ${getWorkerRoleColor(worker?.specifiedRole || worker?.role || "worker")}`}
                              >
                                <i className="fas fa-tools mr-1"></i>
                                {worker?.specifiedRole || worker?.role || "Worker"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRemoveWorker(worker._id, worker?.workerName || worker?.name)}
                          variant="danger"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl w-full sm:w-auto"
                          isLoading={removeWorker.isPending}
                        >
                          <i className="fas fa-user-minus mr-1"></i>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-hard-hat text-orange-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Workers Assigned</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                      Start building your team by inviting skilled workers to this project
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {/* {["Carpenter", "Plumber", "Electrician", "Painter", "Mason"].map((role) => (
                         <button
                           key={role}
                           onClick={() => setWorkerRole(role)}
                           className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                         >
                           {role}
                         </button>
                      ))} */}
                    </div>
                    <Button
                      onClick={() => {
                        // if (!workerRole) setWorkerRole("Worker")
                        handleGenerateInviteLink()
                      }}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Invite First Worker
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
