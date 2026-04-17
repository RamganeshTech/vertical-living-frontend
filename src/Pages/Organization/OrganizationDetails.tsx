// import { useNavigate, useOutletContext, useParams } from "react-router-dom"
// import { Button } from "../../components/ui/Button"
// import { Badge } from "../../components/ui/Badge"
// import { toast } from "../../utils/toast"
// import { Skeleton } from "../../components/ui/Skeleton"
// import { Input } from "../../components/ui/Input"
// import {
//   // useGetStaffsByOrganization,
//   useGetSingleOrganization,
//   useUpdateOrganizationName,
// } from "../../apiList/organization_api/orgApi"
// import { COMPANY_DETAILS, NO_IMAGE, } from "../../constants/constants"
// import { useState } from "react"
// import { useGetAllUsers } from "../../apiList/getAll Users Api/getAllUsersApi"
// import RoleCard from "./RoleCard"
// import type { OrganizationOutletTypeProps } from "./OrganizationChildren"
// import { IssueDiscussionPage } from "../Stage Pages/Issue Discussion Pages/IssueDiscussionPage"

// export default function OrganizationDetails() {
//   const { organizationId } = useParams<{ organizationId: string }>()
//   const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>()

//   const navigate = useNavigate()

//   const [isEditing, setIsEditing] = useState(false)
//   const [editName, setEditName] = useState("")



//   const [showTicketOpr, setShowShowTicketOpr] = useState(true)
//   const [editingPhone, setEditingPhone] = useState(false)
//   const [editingAddress, setEditingAddress] = useState(false)
//   const [tempPhone, setTempPhone] = useState("")
//   const [tempAddress, setTempAddress] = useState("")


//   const handleTicketChange = () => {
//     setShowShowTicketOpr(p => !p)
//   }


//   // Fetch organization and staff data
//   let { data: organization, isLoading: orgLoading, error: orgError } = useGetSingleOrganization(organizationId!)
//   // const { data: staffs, isLoading: staffsLoading } = useGetStaffsByOrganization(organizationId!)

//   if (Array.isArray(organization)) {
//     organization = organization[0]
//   }

//   const updateOrganization = useUpdateOrganizationName()
//   const { data: staffList, isLoading: staffLoading } = useGetAllUsers(organizationId!, "staff");
//   const { data: ctoList, isLoading: ctoLoading } = useGetAllUsers(organizationId!, "CTO");
//   const { data: workerList, isLoading: workerLoading } = useGetAllUsers(organizationId!, "worker");
//   const { data: clientList, isLoading: clientLoading } = useGetAllUsers(organizationId!, "client");



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
//       await updateOrganization.mutateAsync({ updateField: { organizationName: editName }, orgsId: organizationId! })
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

//   const handleStartEdit = () => {
//     setEditName(organization?.organizationName || "")
//     setIsEditing(true)
//   }

//   const handleCancelEdit = () => {
//     setEditName("")
//     setIsEditing(false)
//   }

//   const handleStartEditPhone = () => {
//     setTempPhone(organization?.organizationPhoneNo || "")
//     setEditingPhone(true)
//   }

//   const handleStartEditAddress = () => {
//     setTempAddress(organization?.address || "")
//     setEditingAddress(true)
//   }

//   const handleSavePhone = async () => {
//     if (!tempPhone.trim()) {
//       toast({
//         title: "Error",
//         description: "Phone number cannot be empty",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!/^\d{10}$/.test(tempPhone)) {
//       toast({
//         title: "Error",
//         description: "Phone number should contain 10 digits number",
//         variant: "destructive",
//       })
//       return

//     }

//     try {
//       await updateOrganization.mutateAsync({
//         orgsId: organizationId!,
//         updateField: { organizationPhoneNo: tempPhone },
//       })
//       toast({
//         title: "Success",
//         description: "Phone number updated successfully",
//       })
//       setEditingPhone(false)
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error?.message || "Failed to update phone number",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSaveAddress = async () => {
//     if (!tempAddress.trim()) {
//       toast({
//         title: "Error",
//         description: "Address cannot be empty",
//         variant: "destructive",
//       })
//       return
//     }

//     if (tempAddress.length > 150) {
//       toast({
//         title: "Error",
//         description: "Address cannot be more than 150 characters",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       await updateOrganization.mutateAsync({
//         orgsId: organizationId!,
//         updateField: { address: tempAddress },
//       })
//       toast({
//         title: "Success",
//         description: "Address updated successfully",
//       })
//       setEditingAddress(false)
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || error?.message || "Failed to update address",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCancelEditPhone = () => {
//     setTempPhone("")
//     setEditingPhone(false)
//   }

//   const handleCancelEditAddress = () => {
//     setTempAddress("")
//     setEditingAddress(false)
//   }

//   // Loading state
//   if (orgLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//         {/* Header Skeleton */}
//         <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
//           <div className="max-w-full   mx-auto px-4 sm:px-6 py-4 sm:py-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-center space-x-3 sm:space-x-4">
//                 <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
//                 <div className="hidden sm:block h-6 w-px bg-gray-300" />
//                 <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
//                 <Skeleton className="h-6 w-32 sm:h-8 sm:w-48" />
//               </div>
//               <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" />
//             </div>
//           </div>
//         </div>

//         {/* Content Skeleton */}
//         <div className="max-w-7xl mx-auto p-4 sm:p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
//   if (orgError || !organization) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-md w-full">
//           <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
//             <i className="fas fa-building text-blue-500 text-2xl"></i>
//           </div>
//           <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Organization Not Found</h2>
//           <p className="text-blue-600 mb-4 text-sm sm:text-base">
//             The organization you're looking for doesn't exist or you don't have access to it.
//           </p>
//           <Button
//             onClick={() => navigate("/organizations")}
//             variant="primary"
//             className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
//           >
//             <i className="fas fa-arrow-left mr-2"></i>
//             Back to Organizations
//           </Button>
//         </div>
//       </div>
//     )
//   }



//   // bg-gradient-to-br from-[#0ae12e] to-[#add8e6] for customized linear gradient output
//   return (
//     <div className="flex w-full h-full ">
//       <div className={`min-h-full w-full max-h-[100vh] overflow-y-auto custom-scrollbar bg-gradient-to-br from-blue-50 via-white bg-blue-100`}>

//         {/* header part */}
//         <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10 w-full">
//           <div className="max-w-full mx-auto px-4 sm:px-6 py-3 flex flex-row sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
//             {/* Left section */}
//             <div className="flex flex-row sm:items-center justify-between  w-full gap-3 sm:gap-4">
//               {/* Back button & divider */}


//               {isMobile ?
//                 <button
//                   onClick={openMobileSidebar}
//                   className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
//                   title="Open Menu"
//                 >
//                   <i className="fa-solid fa-bars"></i>
//                 </button>
//                 :
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => navigate("/organizations")}
//                     className="text-blue-600 hover:bg-blue-50 rounded-xl"
//                   >
//                     <i className="fas fa-arrow-left mr-2"></i>
//                     <span className="hidden md:inline">Back to Organizations</span>
//                     <span className="md:hidden">Back</span>
//                   </Button>
//                   <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
//                 </div>}

//               {/* Logo + name */}
//               <div className="flex items-center gap-3 flex-1 min-w-0">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//                   {organization?.logoUrl ? (
//                     <img
//                       src={organization?.logoUrl || COMPANY_DETAILS.COMPANY_LOGO}
//                       alt={organization?.organizationName}
//                       className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover"
//                     />
//                   ) : (
//                     <img
//                       src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
//                       alt="Company Logo"
//                       className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover"
//                     />
//                   )}
//                 </div>

//                 <div className="min-w-0 flex-1 ">
//                   {isEditing ? (
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                       <Input
//                         value={editName}
//                         onChange={(e) => setEditName(e.target.value)}
//                         onKeyPress={(e) => e.key === "Enter" && handleUpdateName()}
//                         placeholder="Organization name"
//                         className="w-full text-lg sm:text-xl font-bold border-2 border-blue-300 focus:border-blue-500 rounded-xl bg-white/90 backdrop-blur-sm"
//                       />
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="primary"
//                           onClick={handleUpdateName}
//                           isLoading={updateOrganization.isPending}
//                           className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
//                         >
//                           <i className="fas fa-check mr-1"></i> Save
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={handleCancelEdit}
//                           className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
//                         >
//                           <i className="fas fa-times mr-1"></i> Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <h1 className="text-lg sm:text-2xl font-bold text-blue-900 truncate">
//                         {organization?.organizationName || "N/A"}
//                       </h1>
//                       {organization?.type && (
//                         <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">{organization?.type}</Badge>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>




//               {/* Right section */}
//               <div className="flex gap-2 ">
//                 {!isEditing && (
//                   <div className="flex justify-end sm:justify-start  w-fit flex-shrink-0">
//                     <Button
//                       variant="outline"
//                       onClick={handleStartEdit}
//                       className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl bg-white/80 backdrop-blur-sm"
//                     >
//                       <i className="fas fa-edit mr-2"></i>
//                       <span className="hidden sm:inline">Edit Name</span>
//                       <span className="sm:hidden">Edit</span>
//                     </Button>
//                   </div>
//                 )}


//                 <Button
//                   variant="secondary"
//                   onClick={() => navigate("settings")}
//                   className=""
//                 >
//                   <i className="fas fa-gear"></i>

//                 </Button>
//               </div>

//             </div>

//           </div>
//         </div>


//         {/* organiztation details */}
//         <div className="max-w-full mx-auto p-4 sm:p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//             <div className="lg:col-span-3">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Phone Section */}
//                 <div className="p-4 bg-blue-50 rounded-xl shadow-sm h-fit">
//                   {editingPhone ? (
//                     <>
//                       <div className="flex items-center gap-3">
//                         <i className="fas fa-phone text-blue-600" />
//                         <Input
//                           value={tempPhone}
//                           type="tel"
//                           maxLength={10}
//                           onChange={(e) => setTempPhone(e.target.value)}
//                           placeholder="Enter phone number"
//                           className="text-sm border-blue-200 focus:border-blue-500 bg-white flex-1"
//                           onKeyPress={(e) => e.key === "Enter" && handleSavePhone()}
//                         />
//                       </div>
//                       <div className="flex justify-end gap-2 mt-3">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={handleCancelEditPhone}
//                           className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs px-3 py-1"
//                         >
//                           <i className="fas fa-times mr-1"></i> Cancel
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="primary"
//                           onClick={handleSavePhone}
//                           isLoading={updateOrganization.isPending}
//                           className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
//                         >
//                           <i className="fas fa-check mr-1"></i> Save
//                         </Button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center gap-3">
//                         <i className="fas fa-phone text-blue-600" />
//                         <span className="text-gray-700 text-sm sm:text-base">
//                           {organization?.organizationPhoneNo || "N/A"}
//                         </span>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={handleStartEditPhone}
//                         className="text-blue-600 hover:bg-blue-100 p-1 h-auto"
//                       >
//                         <i className="fas fa-edit text-xs"></i>
//                       </Button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Address Section */}
//                 <div className="p-4 bg-blue-50 rounded-xl shadow-sm ">
//                   {editingAddress ? (
//                     <>
//                       <div className="flex items-start gap-3">
//                         <i className="fas fa-map-marker-alt text-blue-600 mt-1" />
//                         <div className="flex-1">
//                           <textarea
//                             value={tempAddress}
//                             onChange={(e) => setTempAddress(e.target.value)}
//                             placeholder="Enter address"
//                             className="w-full text-sm border-2 border-blue-200 focus:border-blue-500 bg-white rounded-lg p-2 resize-none focus:outline-none"
//                             rows={3}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault()
//                                 handleSaveAddress()
//                               }
//                             }}
//                           />
//                           <div className="flex items-center gap-2 mt-1 text-blue-600">
//                             <i className="fa-solid fa-circle-info text-[13px]"></i>
//                             <span className="text-[12px] sm:text-sm">Press Shift + Enter for next line</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-3 flex justify-end gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={handleCancelEditAddress}
//                           className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs px-3 py-1"
//                         >
//                           <i className="fas fa-times mr-1"></i> Cancel
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="primary"
//                           onClick={handleSaveAddress}
//                           isLoading={updateOrganization.isPending}
//                           className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
//                         >
//                           <i className="fas fa-check mr-1"></i> Save
//                         </Button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="flex justify-between items-start gap-3  w-full">
//                       <div className="flex items-start gap-3 ">
//                         <i className="fas fa-map-marker-alt text-blue-600 mt-1" />
//                         <div className="max-w-[90%] overflow-h-auto !max-h-[150px] ">
//                           <span className="text-gray-700 text-sm sm:text-base break-words whitespace-pre-wrap">
//                             {organization?.address || "N/A"}
//                           </span>
//                         </div>

//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={handleStartEditAddress}
//                         className="text-blue-600 hover:bg-blue-100 p-1 h-auto flex-shrink-0"
//                       >
//                         <i className="fas fa-edit text-xs"></i>
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <aside className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
//             {showTicketOpr ? (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <i className="fas fa-ticket-alt text-blue-600 text-lg"></i>
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-800">Ticket Operations</h1>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <i className="fas fa-users text-blue-600 text-lg"></i>
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
//               </div>
//             )}

//             <Button
//               onClick={handleTicketChange}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
//             >
//               <i className={`fas ${showTicketOpr ? 'fa-users' : 'fa-ticket-alt'} text-sm`}></i>
//               Show {showTicketOpr ? "employee list" : "tickets"}
//             </Button>
//           </aside>

//           {showTicketOpr ? (
//             <div className="h-full w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
//               <IssueDiscussionPage showFilters={true} showFullView={false} showHeader={false} />
//             </div>
//           ) : (
//             <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-3  sm:min-h-[65vh] sm:max-h-[100%]">
//               <RoleCard
//                 title="Staffs"
//                 icon="fa-user-tie"
//                 list={staffList}
//                 isLoading={staffLoading}
//               />
//               <RoleCard
//                 title="CTOs"
//                 icon="fa-user-cog"
//                 list={ctoList}
//                 isLoading={ctoLoading}
//               />
//               <RoleCard
//                 title="Workers"
//                 icon="fa-user-hard-hat"
//                 list={workerList}
//                 isLoading={workerLoading}
//               />
//               <RoleCard
//                 title="Clients"
//                 icon="fa-user-friends"
//                 list={clientList}
//                 isLoading={clientLoading}
//               />
//             </div>
//           )}
//         </section>


//       </div>
//     </div>

//   )
// }



import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import type { OrganizationOutletTypeProps } from "./OrganizationChildren";
import { useGetSingleOrganization } from "../../apiList/organization_api/orgApi";
import { useGetOrgArrivalReport, useGetOrgOrderingReport, useGetOrgProjectsReport } from "../../apiList/organization_api/orgReportApi";
import MaterialOverviewLoading from "../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

import { useState } from "react";
import { COMPANY_DETAILS } from "../../constants/constants";
import { OrderStagesBarChart, OrderStagesLineChart, OrderStagesPieChart } from "./Organization_dashboard/OrgOrderMaterialReportView";
import { ArrivalDistributionPie, ArrivalEfficiencyBar } from "./Organization_dashboard/OrgMaterialArrivalReportView";




// ─── Header ───────────────────────────────────────────────────────────────────

const OrganizationHeader = ({ organization, showSettings, isMobile, openMobileSidebar, navigate }: any) => (
  <header className="bg-white border-b border-slate-100 px-2 flex items-center justify-between ">
    <div className="flex items-center gap-3">
      {isMobile && (
        <button onClick={openMobileSidebar} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition">
          <i className="fa-solid fa-bars" />
        </button>
      )}
      {/* <button
        onClick={() => navigate("/organizations")}
        className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
      >
        <i className="fa-solid fa-arrow-left" />
      </button> */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shadow-blue-100">
        <img
          src={organization?.logoUrl || COMPANY_DETAILS.COMPANY_LOGO}
          className="w-full h-full object-contain"
          alt="logo"
        />
      </div>
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{organization?.organizationName}</h1>
        {/* <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Intelligence Dashboard</p> */}
      </div>
    </div>
    {showSettings && <Button variant="outline" size="sm" className="rounded-xl text-slate-600 border-slate-200 text-xs" onClick={() => navigate("settings")}>
      <i className="fas fa-cog mr-1.5" /> Settings
    </Button>}
  </header>
);


const StatCard = ({
  title,
  value,
  icon,
  accent,
  category
}: {
  title: string;
  value: any;
  icon: string;
  accent: string;
  category: string; // New prop for context
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 relative overflow-hidden group hover:border-blue-200 transition-all">
    {/* Subtle Category Indicator on the left edge */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent} opacity-40`} />

    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${accent} flex-shrink-0 shadow-sm`}>
      <i className={`fas ${icon} text-sm`} />
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
          {category}
        </span>
        <p className="text-[11px] font-bold text-slate-500 truncate leading-none mb-1">
          {title}
        </p>
      </div>
      <p className="text-xl font-black text-slate-800 leading-none">
        {value ?? 0}
      </p>
    </div>
  </div>
);
// ─── Section Title ────────────────────────────────────────────────────────────

const SectionTitle = ({ label, count, subLabel }: { label: string; count?: number, subLabel?: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-bold text-slate-700 tracking-wide font-poppins">{label}

      {subLabel && <span className="text-xs ml-1 font-semibold text-slate-600 font-poppins">{subLabel}</span>}
    </h3>
    {count !== undefined && (
      <span className="text-[10px]  font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{count}</span>
    )}
  </div>
);

// ─── Project List ─────────────────────────────────────────────────────────────

const completionColor = (pct: number) => {
  if (pct >= 100) return { bar: "bg-emerald-500", label: "bg-emerald-50 text-emerald-700", text: "Done" };
  if (pct > 0) return { bar: "bg-blue-500", label: "bg-blue-50 text-blue-700", text: "Active" };
  return { bar: "bg-slate-300", label: "bg-slate-100 text-slate-500", text: "Not started" };
};

const ProjectProgressList = ({
  projects,
  activeFilter,
  onFilterChange,
  isLoading,
}: {
  projects: any[];
  activeFilter: string | undefined;
  onFilterChange: (f: string | undefined) => void;
  isLoading: boolean
}) => {
  const chips = [
    { label: "All", value: undefined },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Not Started", value: "not-started" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden h-full">
      <div className="px-5 pt-5 pb-3 border-b border-slate-50">
        <SectionTitle label="Project Progress" count={projects?.length} />
        {/* Filter Chips */}
        <div className="flex gap-2 flex-wrap mt-3">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onFilterChange(chip.value)}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${activeFilter === chip.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-500"
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable list */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <i className="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i>
        </div>
      )
        : <div className="overflow-y-auto divide-y divide-slate-50">
          {projects?.length > 0 ? projects.map((p) => {
            const pct = p.completionPercentage ?? 0;
            const c = completionColor(pct);
            return (
              <div key={p._id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">{p.projectName}</p>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${c.label}`}>{c.text}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${c.bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 w-8 text-right">{pct}%</span>
                </div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <i className="fas fa-folder-open text-3xl mb-2" />
              <p className="text-sm">No projects</p>
            </div>
          )}
        </div>}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

// const CHART_COLORS = ["#2563eb", "#10b981", "#f59e0b"];

const AnalyticsDashboard = ({ ordering, arrival }: any) => {
  const { organizationId } = useParams() as { organizationId: string }

  const [completionFilter, setCompletionFilter] = useState<string | undefined>(undefined);
  const { data: projectsData, isLoading: projectsLoading } = useGetOrgProjectsReport(organizationId!, {
    completion: completionFilter
  });


  const projects = projectsData?.projects ?? [];
  const summary = projectsData?.summary;



  return (
    <div className="space-y-6">

      <div className="space-y-8">

        {/* ── PROJECT PERFORMANCE SECTION ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            <h2 className="text-xs font-black tracking-wide text-slate-600">Project Overview</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard category="Projects" title="Total" value={summary?.totalProjects} icon="fa-building" accent="bg-blue-600" />
            <StatCard category="Projects" title="Completed" value={summary?.completedProjects} icon="fa-circle-check" accent="bg-emerald-500" />
            <StatCard category="Projects" title="In-Progress" value={summary?.inProgressProjects} icon="fa-spinner" accent="bg-blue-400" />
            <StatCard category="Arrival" title="Pending Verify" value={arrival?.pendingVerification} icon="fa-triangle-exclamation" accent="bg-amber-500" />
          </div>
        </section>

        {/* ── LOGISTICS & PROCUREMENT SECTION ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
            <h2 className="text-xs font-black tracking-wide text-slate-600">Ordering & Material Arrival</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard category="Orders" title="Placed" value={ordering?.summary?.totalPlacedCount} icon="fa-box" accent="bg-indigo-600" />
            <StatCard category="Procurement" title="Synced" value={ordering?.procurementStatus?.sent} icon="fa-paper-plane" accent="bg-teal-500" />
            <StatCard category="Material Arrival" title="Arrival Rate" value={`${(arrival?.arrivalEfficiency ?? 0).toFixed(1)}%`} icon="fa-truck" accent="bg-sky-500" />
            <StatCard category="Material Arrival" title="Verify Rate" value={`${(arrival?.verificationRate ?? 0).toFixed(1)}%`} icon="fa-clipboard-check" accent="bg-violet-500" />
          </div>
        </section>

      </div>

      {/* Pie: Order Stages */}


      {/* ── Charts + List Row ── */}
      <div className=" space-y-4">




        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 font-montserrat">Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Independent analysis of material order flows across multiple view types.</p>
        </div>

        {/* Grid rendering all 3 independent charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderStagesPieChart organizationId={organizationId} />
          <OrderStagesBarChart organizationId={organizationId} />
          <OrderStagesLineChart organizationId={organizationId} />
        </div>

        {/* <div className=""> */}
        <div className="flex flex-col gap-y-8 mt-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <ArrivalDistributionPie organizationId={organizationId} />
            <ArrivalEfficiencyBar organizationId={organizationId} />
            {/* <ArrivalTrendLine organizationId={organizationId} /> */}
          </div>

          {/* Projects Section - Added a clear heading and background for separation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Project Details</h3>
            </div>

            <div className="max-h-[420px] xl:max-h-[456px] overflow-y-auto p-5 custom-scrollbar">
              <ProjectProgressList
                projects={projects}
                activeFilter={completionFilter}
                onFilterChange={setCompletionFilter}
                isLoading={projectsLoading}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── Project Completion Summary Bar ── */}
      {summary && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle label="Project's Overall Completion" />
            <span className="text-sm font-bold text-slate-500">
              Avg <span className="text-blue-600">{(summary.avgCompletionRate ?? 0).toFixed(1)}%</span>
            </span>
          </div>
          <div className="flex gap-2 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-700 rounded-l-full"
              style={{ width: `${summary.totalProjects > 0 ? (summary.completedProjects / summary.totalProjects) * 100 : 0}%` }}
            />
            <div
              className="bg-blue-500 h-full transition-all duration-700"
              style={{ width: `${summary.totalProjects > 0 ? (summary.inProgressProjects / summary.totalProjects) * 100 : 0}%` }}
            />
            <div
              className="bg-slate-200 h-full flex-1 transition-all duration-700 rounded-r-full"
            />
          </div>
          <div className="flex gap-6 mt-3">
            {[
              { label: "Completed", value: summary.completedProjects, color: "bg-emerald-500" },
              { label: "In Progress", value: summary.inProgressProjects, color: "bg-blue-500" },
              { label: "Not Started", value: summary.notStartedProjects, color: "bg-slate-200" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                <span className="text-xs font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizationDetails({ organizationId, showSettings }: { organizationId: string, showSettings: boolean }) {
  // const { organizationId } = useParams<{ organizationId: string }>();
  const { openMobileSidebar, isMobile } = useOutletContext<OrganizationOutletTypeProps>();
  const navigate = useNavigate();

  const { data: organization, isLoading: orgLoading } = useGetSingleOrganization(organizationId!);
  const { data: orderingData, isLoading: orderingLoading } = useGetOrgOrderingReport(organizationId!);
  const { data: arrivalData, isLoading: arrivalLoading } = useGetOrgArrivalReport(organizationId!);
  // const { data: projectsData, isLoading: projectsLoading } = useGetOrgProjectsReport(organizationId!);


  if (orgLoading || orderingLoading || arrivalLoading) {
    return <MaterialOverviewLoading />;
  }

  return (
    <div className="flex flex-col w-full h-full max-h-full overflow-y-auto bg-slate-50">
      <OrganizationHeader
        organization={organization}
        isMobile={isMobile}
        openMobileSidebar={openMobileSidebar}
        navigate={navigate}
        showSettings={showSettings}
      />
      <main className="flex-1 overflow-y-auto p-5 lg:p-6">
        <AnalyticsDashboard
          ordering={orderingData}
          arrival={arrivalData}
        // projectsData={projectsData}
        // completionFilter={completionFilter}
        // setCompletionFilter={setCompletionFilter}
        />
      </main>
    </div>
  );
}