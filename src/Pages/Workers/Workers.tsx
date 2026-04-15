// import { useState } from "react"
// import { useOutletContext, useParams } from "react-router-dom"
// import { Button } from "../../components/ui/Button"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
// import { Badge } from "../../components/ui/Badge"
// import { Avatar, AvatarFallback } from "../../components/ui/Avatar"
// import { Input } from "../../components/ui/Input"
// import { Label } from "../../components/ui/Label"
// import { Skeleton } from "../../components/ui/Skeleton"

// import { toast } from "../../utils/toast"
// import type { ProjectDetailsOutlet } from "../../types/types"
// import { useGetWorkersAsStaff, useInviteWorkerByStaff, useRemoveWorkerAsStaff } from "../../apiList/organization_api/orgApi"
// import { useAuthCheck } from "../../Hooks/useAuthCheck"
// import StageGuide from "../../shared/StageGuide"

// export default function Workers() {
//   const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>()
//   const { openMobileSidebar, isMobile } = useOutletContext<ProjectDetailsOutlet>()
//   const [inviteLink, setInviteLink] = useState("")
//   const [copied, setCopied] = useState(false)
//   // const [workerRole, setWorkerRole] = useState("")

//   // Fetch workers data using the provided hook
//   const { data: workers, isLoading: workersLoading } = useGetWorkersAsStaff(projectId || "")

//   // Mutations using the provided hooks
//   const inviteWorker = useInviteWorkerByStaff()
//   const removeWorker = useRemoveWorkerAsStaff()



//   const { role, permission } = useAuthCheck();
//   const canDelete = role === "owner" || permission?.inviteworker?.delete;
//   const canList = role === "owner" || permission?.inviteworker?.list;
//   const canCreate = role === "owner" || permission?.inviteworker?.create;
//   const canEdit = role === "owner" || permission?.inviteworker?.edit;



//   const handleGenerateInviteLink = async () => {
//     // if (!workerRole.trim()) {
//     //   toast({
//     //     title: "Error",
//     //     description: "Please specify the worker role (e.g., Carpenter, Plumber, Electrician)",
//     //     variant: "destructive",
//     //   })
//     //   return
//     // }

//     try {
//       const response = await inviteWorker.mutateAsync({
//         projectId: projectId || "",
//         // specificRole: workerRole,
//         role: "worker",
//         organizationId: organizationId!
//       })
//       setInviteLink(response?.inviteLink || response)
//       toast({
//         title: "Success",
//         description: "Worker invitation link generated successfully",
//       })
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error?.message || "Failed to generate invitation link",
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
//     } catch (_error) {
//       toast({
//         title: "Error",
//         description: "Failed to copy link",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleShareWhatsApp = () => {
//     // We'll use the project name from the page if available, or a generic message
//     const message = `You're invited to work with us Click this link to join: ${inviteLink}`
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, "_blank")
//   }

//   const handleRemoveWorker = async (workerId: string, workerName: string) => {
//     if (window.confirm(`Are you sure you want to remove ${workerName} from this project?`)) {
//       try {
//         await removeWorker.mutateAsync({
//           workerId,
//           orgId: organizationId!,
//           projectId: projectId || "",
//         })
//         toast({
//           title: "Success",
//           description: `${workerName} has been removed from the project`,
//         })
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to remove worker",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const getInitials = (name: string) => {
//     if (!name) return "WK"
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//   }

//   const getWorkerRoleColor = (role: string) => {
//     if (!role) return "bg-purple-100 text-purple-800 border-purple-200"

//     const colors: { [key: string]: string } = {
//       carpenter: "bg-amber-100 text-amber-800 border-amber-200",
//       plumber: "bg-blue-100 text-blue-800 border-blue-200",
//       electrician: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       painter: "bg-green-100 text-green-800 border-green-200",
//       mason: "bg-gray-100 text-gray-800 border-gray-200",
//       welder: "bg-red-100 text-red-800 border-red-200",
//     }
//     return colors[role.toLowerCase()] || "bg-purple-100 text-purple-800 border-purple-200"
//   }

//   return (
//     <div className="max-h-full h-full  sm:overflow-y-hidden custom-scrollbar">
//       {/* Header */}
//       <div className="bg-white ">
//         <div className="max-w-full mx-auto  py-2">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Left Section */}
//             <div className="flex items-center space-x-4 min-w-0 flex-1">
//               {isMobile && (
//                 <button
//                   onClick={openMobileSidebar}
//                   className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
//                   title="Open Menu"
//                 >
//                   <i className="fa-solid fa-bars "></i>
//                 </button>
//               )}

//               <div className="hidden sm:block w-px bg-gray-300 flex-shrink-0" />

//               <div className="flex items-center space-x-3 min-w-0 flex-1">
//                 <div className="min-w-0 flex-1">
//                   <h1 className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
//                     <i className="fas fa-user-plus mr-1"></i>
//                     Invite Workers</h1>
//                 </div>
//               </div>
//             </div>



//             <div className="w-full sm:w-auto flex justify-end sm:block">
//               <StageGuide
//                 organizationId={organizationId!}
//                 stageName="inviteworker"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-full !h-[100%]  overflow-y-auto custom-scrollbar mx-auto p-2">
//         <div className="grid grid-cols-1 h-full lg:grid-cols-3 gap-6 lg:gap-8 w-full ">
//           {/* Invite Section */}
//           <div className="lg:col-span-1 h-fit space-y-6">
//             {/* Invite Workers */}
//             <Card className="bg-white backdrop-blur-sm rounded-2xl shadow-md border-l-4 border-green-600 ">
//               <CardHeader>
//                 <CardTitle className="text-gray-800 flex items-center text-lg">
//                   <i className="fas fa-user-plus mr-2 text-green-600"></i>
//                   Invite Workers
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* <div className="space-y-2">
//                   <Label className="text-gray-700 font-medium">Worker Role/Specialty</Label>
//                   <Input
//                     value={workerRole}
//                     onChange={(e) => setWorkerRole(e.target.value)}
//                     placeholder="e.g., Carpenter, Plumber, Electrician"
//                     className="border-blue-200 focus:border-blue-500 bg-white/80"
//                   />
//                   <p className="text-xs text-gray-500">Specify the type of worker needed for this project</p>
//                 </div> */}

//                 {!inviteLink ? (
//                   <>
//                     {(canCreate || canEdit) && <Button
//                       onClick={handleGenerateInviteLink}
//                       isLoading={inviteWorker.isPending}
//                       className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
//                     >
//                       <i className="fas fa-link mr-2"></i>
//                       {inviteWorker.isPending ? "Generating..." : "Generate Invitation Link"}
//                     </Button>
//                     }
//                   </>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="space-y-2">
//                       <Label className="text-gray-700 font-medium">Invitation Link</Label>
//                       <div className="flex space-x-2">
//                         <Input
//                           value={inviteLink}
//                           readOnly
//                           className="border-green-200 bg-green-50 text-sm flex-1 min-w-0"
//                         />
//                         <Button
//                           onClick={handleCopyLink}
//                           variant="outline"
//                           size="icon"
//                           className="border-green-200 text-green-600 hover:bg-green-50 rounded-xl flex-shrink-0"
//                         >
//                           <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="flex flex-col space-y-2">
//                       <Button
//                         onClick={handleCopyLink}
//                         variant="outline"
//                         className="w-full border-green-200 text-green-600 hover:bg-green-50 rounded-xl"
//                       >
//                         <i className="fas fa-copy mr-2"></i>
//                         Copy Link
//                       </Button>
//                       <Button
//                         onClick={handleShareWhatsApp}
//                         className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
//                       >
//                         <i className="fab fa-whatsapp mr-2"></i>
//                         Share on WhatsApp
//                       </Button>
//                       {(canCreate || canEdit) && <Button
//                         onClick={() => {
//                           setInviteLink("")
//                           // setWorkerRole("")
//                         }}
//                         variant="outline"
//                         className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
//                       >
//                         <i className="fas fa-plus mr-2"></i>
//                         Generate Another
//                       </Button>}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Role Suggestions */}
//             {/* <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-md border-l-4 border-blue-600 ">
//               <CardHeader>
//                 <CardTitle className="text-gray-800 flex items-center text-lg">
//                   <i className="fas fa-tools mr-2 text-blue-600"></i>
//                   Common Worker Roles
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-wrap gap-2">
//                   {["Carpenter", "Plumber", "Electrician", "Painter", "Mason", "Welder", "Roofer"].map((role) => (
//                     <button
//                       key={role}
//                       onClick={() => setWorkerRole(role)}
//                       className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
//                         workerRole === role ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                       }`}
//                     >
//                       {role}
//                     </button>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card> */}
//           </div>

//           {/* Workers List */}
//           {canList && <div className={`lg:col-span-2 sm:max-h-[43%] lg:!max-h-[90%] rounded-2xl border-l-4 border-orange-600  overflow-y-auto custom-scrollbar`}>
//             <Card className="bg-white/70 backdrop-blur-sm border-0  !shadow-none">
//               <CardHeader>
//                 <CardTitle className="text-gray-800 flex items-center justify-between">
//                   <div className="flex items-center">
//                     <i className="fas fa-hard-hat mr-2 text-orange-600"></i>
//                     <span className="text-lg">Project Workers ({workers?.length || 0})</span>
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {workersLoading ? (
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
//                 ) : workers && workers.length > 0 ? (
//                   <div className="space-y-4  ">
//                     {workers.map((worker: any) => (
//                       <div
//                         key={worker._id}
//                         className="flex flex-col shadow-md sm:flex-row sm:items-center sm:justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50/50 transition-all duration-200 gap-4"
//                       >
//                         <div className="flex items-center space-x-4 min-w-0 flex-1">
//                           <Avatar className="w-12 h-12 border-2 border-blue-200 flex-shrink-0">
//                             {/* <AvatarImage src={worker?.avatarUrl || NO_IMAGE} /> */}
//                             <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white font-semibold">
//                               {getInitials(worker?.workerName)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="min-w-0 flex-1">
//                             <h4 className="font-semibold text-gray-800 truncate">
//                               {worker?.workerName || worker?.name}
//                             </h4>
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 gap-1 sm:gap-0">
//                               {worker.email && (
//                                 <div className="flex items-center space-x-1">
//                                   <i className="fas fa-envelope text-xs"></i>
//                                   <span className="truncate">{worker.email}</span>
//                                 </div>
//                               )}
//                               {worker.phoneNo && (
//                                 <div className="flex items-center space-x-1">
//                                   <i className="fas fa-phone text-xs"></i>
//                                   <span>{worker.phoneNo}</span>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="mt-2">
//                               <Badge
//                                 className={`text-xs ${getWorkerRoleColor(worker?.specifiedRole || worker?.role || "worker")}`}
//                               >
//                                 <i className="fas fa-tools mr-1"></i>
//                                 {worker?.specifiedRole || worker?.role || "Worker"}
//                               </Badge>
//                             </div>
//                           </div>
//                         </div>
//                         {canDelete && <Button
//                           onClick={() => handleRemoveWorker(worker._id, worker?.workerName || worker?.name)}
//                           variant="danger"
//                           size="sm"
//                           className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl w-full sm:w-auto"
//                           isLoading={removeWorker.isPending}
//                         >
//                           <i className="fas fa-user-minus mr-1"></i>
//                           Remove
//                         </Button>}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 min-h-[100vh]">
//                     <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <i className="fas fa-hard-hat text-orange-500 text-2xl"></i>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">No Workers Assigned</h3>
//                     <p className="text-gray-600 mb-6 text-sm sm:text-base">
//                       Start building your team by inviting skilled workers to this project
//                     </p>
//                     <div className="flex flex-wrap gap-2 justify-center mb-6">
//                       {/* {["Carpenter", "Plumber", "Electrician", "Painter", "Mason"].map((role) => (
//                          <button
//                            key={role}
//                            onClick={() => setWorkerRole(role)}
//                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
//                          >
//                            {role}
//                          </button>
//                       ))} */}
//                     </div>
//                     {(canCreate || canEdit) && <Button
//                       onClick={() => {
//                         // if (!workerRole) setWorkerRole("Worker")
//                         handleGenerateInviteLink()
//                       }}
//                       className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl"
//                     >
//                       <i className="fas fa-user-plus mr-2"></i>
//                       Invite First Worker
//                     </Button>}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//           }
//         </div>
//       </div>
//     </div>
//   )
// }




import { useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
// import { Badge } from "../../components/ui/Badge"
import { Avatar, AvatarFallback } from "../../components/ui/Avatar"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Skeleton } from "../../components/ui/Skeleton"

import { toast } from "../../utils/toast"
import type { ProjectDetailsOutlet } from "../../types/types"
import { useGetWorkersAsStaff, useInviteWorkerByStaff, useRemoveWorkerAsStaff } from "../../apiList/organization_api/orgApi"
import { useAuthCheck } from "../../Hooks/useAuthCheck"
import StageGuide from "../../shared/StageGuide"

export default function Workers() {
  const { projectId, organizationId } = useParams<{ projectId: string, organizationId: string }>()
  const { openMobileSidebar, isMobile } = useOutletContext<ProjectDetailsOutlet>()
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  const { data: workers, isLoading: workersLoading } = useGetWorkersAsStaff(projectId || "")

  const inviteWorker = useInviteWorkerByStaff()
  const removeWorker = useRemoveWorkerAsStaff()

  const { role, permission } = useAuthCheck();
  const canDelete = role === "owner" || permission?.inviteworker?.delete;
  const canList = role === "owner" || permission?.inviteworker?.list;
  const canCreate = role === "owner" || permission?.inviteworker?.create;
  const canEdit = role === "owner" || permission?.inviteworker?.edit;

  const handleGenerateInviteLink = async () => {
    try {
      const response = await inviteWorker.mutateAsync({
        projectId: projectId || "",
        role: "worker",
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
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const handleShareWhatsApp = () => {
    const message = `You're invited to work with us. Click this link to join: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleRemoveWorker = async (workerId: string, workerName: string) => {
    if (window.confirm(`Are you sure you want to remove ${workerName} from this project?`)) {
      try {
        await removeWorker.mutateAsync({
          workerId,
          orgId: organizationId!,
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

  // const getWorkerRoleColor = () => {
  //   // A clean, unified gray/slate look for all roles to keep the UI professional
  //   return "bg-gray-100 text-gray-700 border-gray-200"
  // }

  return (
    <div className="max-h-full h-full sm:overflow-y-hidden custom-scrollbar bg-brand-surface">
      {/* Header */}
      <div className="bg-brand-main border-b border-ash-light px-4 sm:px-6">
        <div className="max-w-full mx-auto py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left Section */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  // className="mr-1 p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 shadow-sm transition-colors"
                  className="mr-1 p-2 rounded-lg border border-ash-medium bg-brand-surface text-text-muted hover:bg-brand-ash shadow-sm transition-colors"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars text-base"></i>
                </button>
              )}

              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                    <i className="fas fa-hard-hat text-text-muted text-lg"></i>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-text-main truncate leading-tight">
                    Invite Workers
                  </h1>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full sm:w-auto flex justify-end sm:block">
              <StageGuide
                organizationId={organizationId!}
                stageName="inviteworker"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full !h-[calc(100%-80px)] overflow-y-auto custom-scrollbar mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full h-full">
          
          {/* Invite Section (Left) */}
          <div className="lg:col-span-1 h-fit space-y-6">
            <Card className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium overflow-hidden">
              <CardHeader className="border-b border-ash-light pb-4">
                <CardTitle className="text-text-mainflex items-center text-base font-bold">
                  <i className="fas fa-link mr-2 text-text-muted"></i>
                  Generate Link
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-5 space-y-4">
                {!inviteLink ? (
                  <div className="py-2">
                    <p className="text-sm text-text-muted mb-4">Create a unique link to invite a worker to this project workspace.</p>
                    {(canCreate || canEdit) && (
                      <Button
                        variant="dark"
                        onClick={handleGenerateInviteLink}
                        isLoading={inviteWorker.isPending}
                        className="w-full py-2.5"
                      >
                        Generate Invitation Link
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5 py-2">
                    <div>
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Invitation Link</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={inviteLink}
                          readOnly
                          className="bg-brand-ash border border-ash-medium text-text-main flex-1 focus:ring-0 shadow-sm"
                        />
                        <Button
                          variant="dark"
                          onClick={handleCopyLink}
                          className="px-4 shadow-sm"
                        >
                          <i className={`fas ${copied ? "fa-check text-emerald-400" : "fa-copy"}`}></i>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
                      <Button
                        variant="white"
                        onClick={handleShareWhatsApp}
                        // className="w-full justify-center"
                        className="w-full justify-center border-ash-medium text-text-main hover:bg-brand-ash shadow-sm transition-colors"
                      >
                        {/* <i className="fab fa-whatsapp text-emerald-500 text-base mr-2"></i> Share on WhatsApp */}
                        <i className="fab fa-whatsapp text-action-success text-base mr-2"></i> Share on WhatsApp
                      </Button>
                      
                      {(canCreate || canEdit) && (
                        <Button
                          variant="ghost"
                          onClick={() => setInviteLink("")}
                          // className="w-full justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 mt-1"
                          className="w-full justify-center text-text-muted hover:text-text-main hover:bg-brand-ash mt-2 transition-colors"
                        >
                          <i className="fas fa-rotate-right mr-2"></i> Generate Another
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Workers List (Right) */}
          {canList && (
            <div className="lg:col-span-2 sm:max-h-[50%] lg:!max-h-[100%] rounded-xl bg-brand-surface border border-ash-medium shadow-sm overflow-hidden flex flex-col">
             <div className="p-5 border-b border-ash-medium bg-brand-ash flex items-center justify-between">
              <h2 className="text-base font-bold text-text-main flex items-center">
                <i className="fas fa-users-gear mr-2 text-text-muted" /> Project Workers
              </h2>
              <span className="bg-brand-surface border border-ash-medium text-text-main text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {workers?.length || 0}
              </span>
            </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {workersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      // <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl">
                      <div key={i} className="flex items-center space-x-4 p-4 border border-ash-light rounded-xl bg-brand-ash/30">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32 bg-ash-medium" />
                          <Skeleton className="h-3 w-48 bg-ash-medium" />
                        </div>
                        <Skeleton className="h-8 w-20 bg-ash-medium" />
                      </div>
                    ))}
                  </div>
                ) : workers && workers.length > 0 ? (
                  <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {workers.map((worker: any) => (
                      <div
                        key={worker._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-brand-surface border border-ash-medium rounded-xl hover:shadow-md transition-all duration-200 gap-4 group"
                      >
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <Avatar className="w-12 h-12 border border-ash-light flex-shrink-0 shadow-sm">
                            <AvatarFallback className="bg-action-primary text-white font-bold text-sm tracking-wider">
                              {getInitials(worker?.workerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            {/* <h4 className="font-bold text-gray-800 text-sm truncate mb-0.5 group-hover:text-black transition-colors"> */}
                            <h4 className="font-bold text-text-main text-sm truncate mb-1 group-hover:text-action-primary transition-colors">
                              {worker?.workerName || worker?.name}
                            </h4>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                              {worker.email && (
                                <p className="text-[11px] font-bold text-text-muted truncate flex items-center">
                                <i className="fas fa-envelope mr-2 text-ash-dark w-3 text-center"></i>
                                {worker.email}
                              </p>
                              )}
                              {worker.phoneNo && (
                                <p className="text-[11px] font-bold text-text-muted truncate flex items-center">
                                <i className="fas fa-phone-alt mr-2 text-ash-dark w-3 text-center"></i>
                                {worker.phoneNo}
                              </p>
                              )}
                            </div>
                            
                            {/* <Badge className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 ${getWorkerRoleColor()}`}>
                              {worker?.specifiedRole || worker?.role || "Worker"}
                            </Badge> */}
                          </div>
                        </div>
                        
                        {canDelete && (
                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleRemoveWorker(worker._id, worker?.workerName || worker?.name)}
                              variant="ghost"
                              size="sm"
                              // className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg w-full sm:w-auto h-8 px-3 transition-colors"
                              className="text-text-muted hover:text-action-danger border border-transparent rounded-lg w-full sm:w-auto h-8 px-3 transition-colors shadow-sm"
                              isLoading={removeWorker.isPending}
                            >
                              <i className="fas fa-trash-alt sm:mr-1 text-xs"></i>
                              <span className="sm:hidden ml-2 text-xs">Remove</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-ash-medium rounded-xl bg-brand-ash/30 min-h-[300px]">
                  <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <i className="fas fa-user-slash text-2xl text-ash-dark"></i>
                  </div>
                  <h3 className="text-text-main font-bold text-lg mb-1">No workers assigned</h3>
                  <p className="text-text-muted text-sm font-medium mb-6 max-w-sm">
                    Start building your team by generating a link and inviting skilled workers to this project.
                  </p>
                  
                  {(canCreate || canEdit) && (
                    <Button
                      variant="dark"
                      onClick={() => handleGenerateInviteLink()}
                      className="px-6 shadow-sm"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Invite First Worker
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}