import { useMemo, useRef, useState } from "react";
import { useUpdateProfile } from "../../apiList/Stage Api/profile Edit Api/profileEditApi";
import { Button } from "../../components/ui/Button";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren";
import { toast } from "../../utils/toast";

// import *each* profile slice actions
import { setOwnerProfileData } from "../../features/userSlices";
import { setClientProfileData } from "../../features/clientSlice";
import { setCTOProfileData } from "../../features/CTOSlice";
import { setStaffProfileData } from "../../features/staffSlices";
import { setWorkerProfileData } from "../../features/workerSlice";
// import RazorpayConfig from "../RazorPay Config/RazorPayConfig";

// type ProfileUnion =
//     | RootState["userProfileStore"]
//     | RootState["staffProfileStore"]
//     | RootState["CTOProfileStore"]
//     | RootState["workerProfileStore"]
//     | RootState["clientProfileStore"];

const roleConfig = {
  owner: {
    label: "Owner",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    // icon: "👑",
    icon: <i className="fas fa-crown text-[11px]"></i>,
  },
  staff: {
    label: "Staff",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    // icon: "👥",
    icon: <i className="fas fa-users text-[11px]"></i>,
  },
  CTO: {
    label: "CTO",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    // icon: "🚀",
    icon: <i className="fas fa-microchip text-[11px]"></i>,
  },
  client: {
    label: "Client",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    // icon: "🤝",
    icon: <i className="fas fa-handshake text-[11px]"></i>,
  },
  worker: {
    label: "Worker",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    // icon: "⚡",
    icon: <i className="fas fa-hammer text-[11px]"></i>,
  },
}

export default function ProfileDetails() {
  const { openMobileSidebar, isMobile } =
    useOutletContext<OrganizationOutletTypeProps>();

  const navigate = useNavigate()

  // Inside ProfileDetails, above the selectors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Get role
  const { role, _id } = useSelector((state: RootState) => state.authStore);
  const dispatch = useDispatch()
  // 1. Call all selectors at the top level (Rules of Hooks)
  const userProfile = useSelector((state: RootState) => state.userProfileStore);
  const staffProfile = useSelector((state: RootState) => state.staffProfileStore);
  const ctoProfile = useSelector((state: RootState) => state.CTOProfileStore);
  const clientProfile = useSelector((state: RootState) => state.clientProfileStore);
  const workerProfile = useSelector((state: RootState) => state.workerProfileStore);

  // 2. Use a standard object or switch to pick the data based on role
  const profile = useMemo(() => {
    switch (role) {
      case "owner": return userProfile;
      case "staff": return staffProfile;
      case "CTO": return ctoProfile;
      case "client": return clientProfile;
      case "worker": return workerProfile;
      default: return null;
    }
  }, [role, userProfile, staffProfile, ctoProfile, clientProfile, workerProfile]);

  const getProfileName = () => {
    if (!profile) return "-";
    if ("userName" in profile) return profile.userName;
    if ("staffName" in profile) return profile.staffName;
    if ("CTOName" in profile) return profile.CTOName;
    if ("clientName" in profile) return profile.clientName;
    if ("workerName" in profile) return profile.workerName;
    return "-";
  };




  const [form, setForm] = useState({
    name: getProfileName(),
    email: profile?.email || "",
    phoneNo: profile?.phoneNo || "",
  });

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleSave = async () => {
    try {
      const data = await updateProfile({
        name: form.name,
        email: form.email,
        phoneNo: form.phoneNo,
        file: selectedImage || undefined, // Pass the file here
      })
      toast({ title: "Success", description: "Completion status updated successfully" });


      console.log("data", data)
      const payload = {
        email: form.email,
        phoneNo: form.phoneNo,
        role: role,
        isauthenticated: true,
        profileImage: data?.data?.profileImage?.url || null
      };

      switch (role) {
        case "owner":
          dispatch(
            setOwnerProfileData({
              ...payload,
              userId: data.data._id,
              userName: form.name,
            }),
          );
          break;
        case "staff":
          dispatch(
            setStaffProfileData({
              ...payload,
              staffId: data.data._id,
              staffName: form.name,
            }),
          );
          break;
        case "CTO":
          dispatch(
            setCTOProfileData({
              ...payload,
              CTOId: data.data._id,
              CTOName: form.name,
            }),
          );
          break;
        case "client":
          dispatch(
            setClientProfileData({
              ...payload,
              clientId: data.data._id,
              clientName: form.name,
            }),
          );
          break;
        case "worker":
          dispatch(
            setWorkerProfileData({
              ...payload,
              workerId: data.data._id,
              workerName: form.name,
            }),
          );
          break;
        default:
          throw new Error("Unknown role");
      }

      setIsEditing(false)
      setSelectedImage(null); // Clear selection after success
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to update profile data",
        variant: "destructive",
      });
    }
  }


  const handleCancel = () => {
    setForm({
      name: getProfileName(),
      // email: "",
      // phoneNo: "",

      email: profile?.email || "",
      phoneNo: profile?.phoneNo || "",
    })
    setSelectedImage(null); // Clear the preview if user cancels
    setIsEditing(false)
  }


  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.worker
  // const firstLetter = getProfileName().charAt(0).toUpperCase();

  // Determine what image to show (Preview new selection OR existing DB image)
  // const displayImageSrc = selectedImage && URL.createObjectURL(selectedImage)
  const displayImageSrc = useMemo(() => {
    // 1. If user just picked a new file, show that preview first
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }

    // 2. Otherwise, show the image from the profile (Redux/DB)
    // Check if profileImage exists and has a url
    return profile?.profileImage || null;
  }, [selectedImage, profile]);

  const getDisplayName = getProfileName();
  const firstLetter = getDisplayName && getDisplayName !== "-"
    ? getDisplayName.charAt(0).toUpperCase()
    : "U"; // Default to 'U' for User if no name exists

  return (
    // <div className="max-h-screen overflow-y-auto bg-gray-50">
    //   {/* Header - Made Responsive */}
    //   <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
    //     <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
    //           {isMobile && (
    //             <button
    //               onClick={openMobileSidebar}
    //               className="p-2 rounded-lg border border-gray-700 hover:bg-gray-300 transition-colors lg:hidden flex-shrink-0"
    //               title="Open Menu"
    //             >
    //               <i className="w-4 h-4 sm:w-5 sm:h-5 fas fa-bars !text-gray-600" />
    //             </button>
    //           )}

    //           <div className="flex items-center gap-2 sm:gap-3 min-w-0">
    //             <div onClick={() => navigate(-1)} className="p-1.5 cursor-pointer sm:p-2 bg-gray-100 rounded-lg">
    //               <i className="w-5 h-5 sm:w-6 sm:h-6 fas fa-arrow-left text-gray-600" />
    //             </div>
    //             <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg flex-shrink-0">
    //               <i className="w-5 h-5 sm:w-6 sm:h-6 fas fa-user text-gray-600" />
    //             </div>
    //             <div className="min-w-0">
    //               <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">My Profile</h1>
    //               <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage your personal information</p>
    //             </div>
    //           </div>
    //         </div>
    //         {!isEditing && (
    //           <Button
    //             onClick={() => setIsEditing(true)}
    //             className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex-shrink-0"
    //           >
    //             <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-pen" />
    //             <span className="hidden sm:inline">Edit Profile</span>
    //             <span className="sm:hidden">Edit</span>
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //   </header>

    //   {/* Main Content - Made Responsive */}
    //   <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
    //     <div className="max-w-4xl mx-auto">
    //       {/* Profile Card - Made Responsive */}
    //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">




    //         {/* Profile Card Wrapper */}

    //         {/* FIX: This is the missing Blue Header Container */}
    //         <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-6 sm:py-8 text-white">
    //           <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row">

    //             {/* Avatar Section */}
    //             <div className="relative w-fit group">
    //               {displayImageSrc ? (
    //                 <img
    //                   src={displayImageSrc}
    //                   alt="Profile"
    //                   onClick={() => !isEditing && setIsModalOpen(true)}
    //                   className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white/30 shadow-lg ${!isEditing ? "cursor-pointer" : ""}`}
    //                 />
    //               ) : (
    //                 <div
    //                   className={`w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-2 border-white/30 shadow-lg flex-shrink-0 ${!isEditing ? "cursor-pointer" : ""}`}
    //                   onClick={() => !isEditing && setIsModalOpen(true)}
    //                 >
    //                   {firstLetter}
    //                 </div>
    //               )}

    //               <input
    //                 type="file"
    //                 hidden
    //                 ref={fileInputRef}
    //                 accept="image/*"
    //                 onChange={(e) => {
    //                   if (e.target.files && e.target.files[0]) {
    //                     setSelectedImage(e.target.files[0]);
    //                   }
    //                 }}
    //               />

    //               {/* Pencil Icon */}
    //               {isEditing && (
    //                 <button
    //                   onClick={() => fileInputRef.current?.click()}
    //                   className="absolute bottom-0 right-0 bg-white text-blue-600 w-8 h-8 flex items-center justify-center rounded-full shadow-xl hover:bg-gray-100 transition-all border border-gray-200 z-10"
    //                 >
    //                   <i className="fas fa-pencil-alt text-xs" />
    //                 </button>
    //               )}
    //             </div>

    //             {/* Profile Info */}
    //             <div className="text-center md:text-left flex-1 min-w-0">
    //               <h2 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
    //                 {getDisplayName}
    //               </h2>
    //               <div className="flex items-center justify-center md:justify-start gap-2 mb-2 flex-wrap">
    //                 <span className="text-lg sm:text-xl">{currentRole.icon}</span>
    //                 <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-white/90 text-gray-800 border border-white/30">
    //                   {currentRole.label}
    //                 </span>
    //               </div>
    //               <p className="text-white/70 text-xs break-all font-mono">ID: {_id}</p>
    //             </div>

    //           </div>
    //         </div> {/* End of Blue Header */}



    //         {/* Profile Form - Made Responsive */}
    //         <div className="p-4 sm:p-6 md:p-8">
    //           {isEditing && (
    //             <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
    //               <div className="flex items-center gap-2 text-blue-800">
    //                 <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-pencil" />
    //                 <span className="font-medium text-sm sm:text-base">Edit Mode</span>
    //               </div>
    //               <p className="text-blue-700 text-xs sm:text-sm mt-1">
    //                 Make your changes and click save when you're done.
    //               </p>
    //             </div>
    //           )}

    //           {/* Form Grid - Made Responsive */}
    //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    //             {/* Name Field - Made Responsive */}
    //             <div className="lg:col-span-2">
    //               <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
    //                 <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-user inline mr-2" />
    //                 Full Name
    //               </label>
    //               <input
    //                 type="text"
    //                 name="name"
    //                 value={form.name}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //                 className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${isEditing
    //                   ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
    //                   : "border-gray-200 bg-gray-50 text-gray-700"
    //                   } disabled:cursor-not-allowed`}
    //                 placeholder="Enter your full name"
    //               />
    //             </div>

    //             {/* Email Field - Made Responsive */}
    //             <div>
    //               <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
    //                 <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-envelope inline mr-2" />
    //                 Email Address
    //               </label>
    //               <input
    //                 type="email"
    //                 name="email"
    //                 value={form.email}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //                 className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${isEditing
    //                   ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
    //                   : "border-gray-200 bg-gray-50 text-gray-700"
    //                   } disabled:cursor-not-allowed`}
    //                 placeholder="Enter your email address"
    //               />
    //             </div>

    //             {/* Phone Field - Made Responsive */}
    //             <div>
    //               <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
    //                 <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-phone inline mr-2" />
    //                 Phone Number
    //               </label>
    //               <input
    //                 type="tel"
    //                 name="phoneNo"
    //                 value={form.phoneNo}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //                 className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${isEditing
    //                   ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
    //                   : "border-gray-200 bg-gray-50 text-gray-700"
    //                   } disabled:cursor-not-allowed`}
    //                 placeholder="Enter your phone number"
    //               />
    //             </div>
    //           </div>

    //           {/* Action Buttons - Made Responsive */}
    //           {isEditing && (
    //             <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
    //               <Button
    //                 isLoading={isPending}
    //                 onClick={handleSave}
    //                 disabled={isPending}
    //                 className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base order-1 sm:order-none"
    //               >
    //                 <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-save" />
    //                 Save Changes
    //               </Button>
    //               <button
    //                 onClick={handleCancel}
    //                 disabled={isPending}
    //                 className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base order-2 sm:order-none"
    //               >
    //                 Cancel
    //               </button>
    //             </div>
    //           )}
    //         </div>
    //       </div>

    //       {/* Account Summary Card - Made Responsive */}
    //       <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
    //         <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
    //           <i className="w-4 h-4 sm:w-5 sm:h-5 fas fa-shield text-gray-600" />
    //           <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Summary</h3>
    //         </div>
    //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    //           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center py-2">
    //             <span className="text-gray-600 font-medium text-sm sm:text-base">User ID:</span>
    //             <span className="text-gray-900 font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded break-all">
    //               {_id || "N/A"}
    //             </span>
    //           </div>
    //           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center py-2">
    //             <span className="text-gray-600 font-medium text-sm sm:text-base">Role:</span>
    //             <span
    //               className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${currentRole.color} w-fit`}
    //             >
    //               {currentRole.icon} {currentRole.label}
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>



    //   {/* Full-Screen Image Modal */}
    //   {isModalOpen && displayImageSrc && (
    //     <div
    //       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    //       onClick={() => setIsModalOpen(false)}
    //     >
    //       <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
    //         <img
    //           src={displayImageSrc}
    //           alt="Profile Full Size"
    //           className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
    //         />
    //         <button
    //           className="absolute -top-12 right-0 text-white p-2"
    //           onClick={() => setIsModalOpen(false)}
    //         >
    //           <i className="fas fa-times text-2xl" />
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>

    // SECOND VERSION
    // <div className="max-h-screen overflow-y-auto bg-brand-surface custom-scrollbar">

    //   {/* Header - Made Responsive */}
    //   <header className="bg-brand-surface border-b border-ash-light sticky top-0 z-10 shadow-sm">
    //     <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
    //           {isMobile && (
    //             <button
    //               onClick={openMobileSidebar}
    //               className="p-2 rounded-lg border border-ash-medium bg-brand-surface hover:bg-brand-ash transition-colors lg:hidden flex-shrink-0"
    //               title="Open Menu"
    //             >
    //               <i className="w-4 h-4 sm:w-5 sm:h-5 fas fa-bars text-text-muted" />
    //             </button>
    //           )}

    //           <div className="flex items-center gap-2 sm:gap-3 min-w-0">
    //             <button
    //               onClick={() => navigate(-1)}
    //               className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-brand-ash border border-ash-medium rounded-lg text-text-muted hover:text-text-main hover:border-ash-dark transition-all cursor-pointer shrink-0"
    //             >
    //               <i className="fas fa-arrow-left text-xs sm:text-sm" />
    //             </button>
    //             <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center flex-shrink-0">
    //               <i className="fas fa-user text-action-primary text-xs sm:text-sm" />
    //             </div>
    //             <div className="min-w-0 flex flex-col justify-center">
    //               <h1 className="text-lg sm:text-xl font-bold text-text-main truncate leading-none">My Profile</h1>
    //               <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted hidden sm:block mt-1">Manage personal info</p>
    //             </div>
    //           </div>
    //         </div>

    //         {!isEditing && (
    //           <Button
    //             onClick={() => setIsEditing(true)}
    //             variant="dark"
    //             className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4 shadow-sm flex-shrink-0"
    //           >
    //             <i className="fas fa-pen text-xs" />
    //             <span className="hidden sm:inline text-sm">Edit Profile</span>
    //             <span className="sm:hidden text-xs">Edit</span>
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //   </header>

    //   {/* Main Content - Made Responsive */}
    //   <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
    //     <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-24">

    //       {/* Profile Card Wrapper */}
    //       <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium overflow-hidden">

    //         {/* Profile Hero Header */}
    //         {/* Profile Hero Header - Centered & Light */}
    //         <div className="bg-brand-surface px-4 sm:px-6 py-8 sm:py-10 border-b border-ash-light flex flex-col items-center justify-center text-center">

    //           {/* Avatar Section */}
    //           <div className="relative w-fit group mb-5">
    //             {displayImageSrc ? (
    //               <img
    //                 src={displayImageSrc}
    //                 alt="Profile"
    //                 onClick={() => !isEditing && setIsModalOpen(true)}
    //                 className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-brand-ash shadow-sm ${!isEditing ? "cursor-pointer hover:border-ash-medium transition-all" : ""}`}
    //               />
    //             ) : (
    //               <div
    //                 className={`w-24 h-24 sm:w-28 sm:h-28 bg-brand-ash rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-text-muted border-4 border-brand-surface shadow-sm flex-shrink-0 ${!isEditing ? "cursor-pointer hover:bg-ash-medium transition-all" : ""}`}
    //                 onClick={() => !isEditing && setIsModalOpen(true)}
    //               >
    //                 {firstLetter}
    //               </div>
    //             )}

    //             <input
    //               type="file"
    //               hidden
    //               ref={fileInputRef}
    //               accept="image/*"
    //               onChange={(e) => {
    //                 if (e.target.files && e.target.files[0]) {
    //                   setSelectedImage(e.target.files[0]);
    //                 }
    //               }}
    //             />

    //             {/* Pencil Icon */}
    //             {isEditing && (
    //               <button
    //                 onClick={() => fileInputRef.current?.click()}
    //                 className="absolute bottom-1 right-1 bg-brand-surface text-text-main w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-brand-ash transition-all border border-ash-medium z-10"
    //               >
    //                 <i className="fas fa-camera text-xs" />
    //               </button>
    //             )}
    //           </div>

    //           {/* Profile Info */}
    //           <div className="flex flex-col items-center w-full min-w-0">
    //             <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 break-words text-text-strong">
    //               {getDisplayName}
    //             </h2>
    //             <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
    //               <span className="text-lg sm:text-xl">{currentRole.icon}</span>
    //               <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-ash text-text-main border border-ash-medium shadow-sm">
    //                 {currentRole.label}
    //               </span>
    //             </div>
    //             <p className="text-text-muted text-[10px] uppercase tracking-widest break-all font-mono bg-brand-surface border border-ash-light px-3 py-1 rounded-md">
    //               ID: {_id}
    //             </p>
    //           </div>

    //         </div>
    //         {/* Profile Form */}
    //         <div className="p-4 sm:p-6 md:p-8">
    //           {isEditing && (
    //             <div className="mb-4 sm:mb-6 p-4 bg-brand-ash/50 border border-ash-medium rounded-lg flex gap-3 items-start animate-in fade-in duration-300">
    //               <i className="fas fa-info-circle text-action-primary mt-0.5" />
    //               <div>
    //                 <span className="font-bold text-sm text-text-main block mb-0.5">Edit Mode Active</span>
    //                 <p className="text-text-muted text-xs">
    //                   Make your changes to the fields below and click save when you're done.
    //                 </p>
    //               </div>
    //             </div>
    //           )}

    //           {/* Form Grid */}
    //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

    //             {/* Name Field */}
    //             <div className="lg:col-span-2">
    //               <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
    //                 <i className="fas fa-user text-action-primary mr-1.5" /> Full Name
    //               </label>
    //               <input
    //                 type="text"
    //                 name="name"
    //                 value={form.name}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //                 className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 text-sm font-medium ${isEditing
    //                   ? "border-ash-dark focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 bg-brand-surface text-text-main shadow-sm"
    //                   : "border-ash-medium bg-brand-ash text-text-muted"
    //                   } disabled:cursor-not-allowed`}
    //                 placeholder="Enter your full name"
    //               />
    //             </div>

    //             {/* Email Field */}
    //             <div>
    //               <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
    //                 <i className="fas fa-envelope text-action-primary mr-1.5" /> Email Address
    //               </label>
    //               <input
    //                 type="email"
    //                 name="email"
    //                 value={form.email}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //                 className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 text-sm font-medium ${isEditing
    //                   ? "border-ash-dark focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 bg-brand-surface text-text-main shadow-sm"
    //                   : "border-ash-medium bg-brand-ash text-text-muted"
    //                   } disabled:cursor-not-allowed`}
    //                 placeholder="Enter your email address"
    //               />
    //             </div>

    //             {/* Phone Field */}
    //             <div>
    //               <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
    //                 <i className="fas fa-phone text-action-primary mr-1.5" /> Phone Number
    //               </label>
    //               <input
    //                 type="tel"
    //                 name="phoneNo"
    //                 value={form.phoneNo}
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //                 className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 text-sm font-medium ${isEditing
    //                   ? "border-ash-dark focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 bg-brand-surface text-text-main shadow-sm"
    //                   : "border-ash-medium bg-brand-ash text-text-muted"
    //                   } disabled:cursor-not-allowed`}
    //                 placeholder="Enter your phone number"
    //               />
    //             </div>
    //           </div>

    //           {/* Action Buttons */}
    //           {isEditing && (
    //             <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-ash-light">
    //               <Button
    //                 isLoading={isPending}
    //                 onClick={handleSave}
    //                 disabled={isPending}
    //                 variant="dark"
    //                 className="h-10 px-6 font-medium text-sm sm:text-base order-1 sm:order-none w-full sm:w-auto shadow-sm"
    //               >
    //                 <i className="fas fa-save mr-2" /> Save Changes
    //               </Button>
    //               <Button
    //                 onClick={handleCancel}
    //                 disabled={isPending}
    //                 variant="outline"
    //                 className="h-10 px-6 font-medium text-sm sm:text-base order-2 sm:order-none w-full sm:w-auto border-ash-dark text-text-main hover:bg-brand-ash"
    //               >
    //                 Cancel
    //               </Button>
    //             </div>
    //           )}
    //         </div>
    //       </div>

    //       {/* Account Summary Card */}
    //       <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium p-4 sm:p-6">
    //         <div className="flex items-center gap-2 mb-4 border-b border-ash-light pb-3">
    //           <i className="fas fa-shield-alt text-action-primary" />
    //           <h3 className="text-sm font-bold text-text-main uppercase tracking-wide">Account Summary</h3>
    //         </div>
    //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    //           <div className="flex flex-col gap-1">
    //             <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">User ID</span>
    //             <span className="text-text-main font-mono text-sm bg-brand-ash border border-ash-medium px-3 py-1.5 rounded-md break-all shadow-inner">
    //               {_id || "N/A"}
    //             </span>
    //           </div>
    //           <div className="flex flex-col gap-1">
    //             <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Role Permissions</span>
    //             <span className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-ash border border-ash-medium text-text-main w-fit flex items-center gap-2">
    //               {currentRole.icon} {currentRole.label}
    //             </span>
    //           </div>
    //         </div>
    //       </div>

    //     </div>
    //   </div>

    //   {/* Full-Screen Image Modal */}
    //   {isModalOpen && displayImageSrc && (
    //     <div
    //       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    //       onClick={() => setIsModalOpen(false)}
    //     >
    //       <div className="relative max-w-4xl max-h-[90vh] animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
    //         <img
    //           src={displayImageSrc}
    //           alt="Profile Full Size"
    //           className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-white/10"
    //         />
    //         <button
    //           className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 transition-colors"
    //           onClick={() => setIsModalOpen(false)}
    //         >
    //           <i className="fas fa-times text-3xl drop-shadow-md" />
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>


    //  THIRD VERSION

    <div className="max-h-screen overflow-y-auto bg-brand-surface custom-scrollbar">

      {/* Header - Compact */}
      <header className="bg-brand-surface border-b border-ash-light sticky top-0 z-10 shadow-sm">
        <div className="px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="p-1.5 rounded-md border border-ash-medium bg-brand-surface hover:bg-brand-ash transition-colors lg:hidden flex-shrink-0"
                >
                  <i className="w-4 h-4 fas fa-bars text-text-muted flex items-center justify-center" />
                </button>
              )}

              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-8 h-8 bg-brand-ash border border-ash-medium rounded-md text-text-muted hover:text-text-main hover:border-ash-dark transition-all cursor-pointer shrink-0"
                >
                  <i className="fas fa-arrow-left text-xs" />
                </button>
                <div className="w-8 h-8 bg-brand-ash border border-ash-medium rounded-md flex items-center justify-center shrink-0">
                  <i className="fas fa-user text-action-primary text-xs" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-text-main truncate leading-tight">My Profile</h1>
                </div>
              </div>
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="dark"
                className="flex items-center gap-2 h-8 px-4 shadow-sm shrink-0"
              >
                <i className="fas fa-pen text-[10px]" />
                <span className="hidden sm:inline text-xs font-bold">Edit Profile</span>
                <span className="sm:hidden text-xs font-bold">Edit</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Compact Single Card Layout */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">

          {/* Unified Profile Card */}
          <div className="bg-brand-surface rounded-xl shadow-sm border border-ash-medium overflow-hidden flex flex-col md:flex-row">

            {/* Left Sidebar: Avatar & Identity (Compact) */}
            <div className="bg-brand-ash/30 p-6 border-b md:border-b-0 md:border-r border-ash-light flex flex-col items-center justify-center text-center md:w-64 shrink-0">

              <div className="relative w-fit group mb-4">
                {displayImageSrc ? (
                  <img
                    src={displayImageSrc}
                    alt="Profile"
                    onClick={() => !isEditing && setIsModalOpen(true)}
                    className={`w-24 h-24 rounded-full object-cover border-4 border-brand-surface shadow-sm ${!isEditing ? "cursor-pointer hover:border-ash-medium transition-all" : ""}`}
                  />
                ) : (
                  <div
                    className={`w-24 h-24 bg-brand-surface rounded-full flex items-center justify-center text-3xl font-bold text-text-muted border-4 border-brand-surface shadow-sm shrink-0 ${!isEditing ? "cursor-pointer hover:bg-ash-medium transition-all" : ""}`}
                    onClick={() => !isEditing && setIsModalOpen(true)}
                  >
                    {firstLetter}
                  </div>
                )}

                <input
                  type="file" hidden ref={fileInputRef} accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setSelectedImage(e.target.files[0]);
                  }}
                />

                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-brand-surface text-text-main w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-brand-ash transition-all border border-ash-medium z-10"
                  >
                    <i className="fas fa-camera text-xs" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-text-strong break-words">
                {getDisplayName}
              </h2>
              {/* <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">
                Team Member
              </p> */}
            </div>

            {/* Right Area: Form & Read-Only Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">

              {isEditing && (
                <div className="mb-5 p-3 bg-brand-ash/50 border border-ash-medium rounded-lg flex gap-2 items-center animate-in fade-in duration-300">
                  <i className="fas fa-info-circle text-action-primary" />
                  <span className="font-bold text-xs text-text-main">Edit Mode Active. Update your details below.</span>
                </div>
              )}

              {/* Dense Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Full Name (Spans full width) */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    <i className="fas fa-user text-action-primary mr-1.5" /> Full Name
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} disabled={!isEditing}
                    className={`w-full px-3 h-9 border rounded-md transition-all text-sm font-medium ${isEditing
                      ? "border-ash-dark focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 bg-brand-surface text-text-main shadow-sm"
                      : "border-ash-medium bg-brand-ash/50 text-text-muted"
                      } disabled:cursor-not-allowed`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    <i className="fas fa-envelope text-action-primary mr-1.5" /> Email Address
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing}
                    className={`w-full px-3 h-9 border rounded-md transition-all text-sm font-medium ${isEditing
                      ? "border-ash-dark focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 bg-brand-surface text-text-main shadow-sm"
                      : "border-ash-medium bg-brand-ash/50 text-text-muted"
                      } disabled:cursor-not-allowed`}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    <i className="fas fa-phone text-action-primary mr-1.5" /> Phone Number
                  </label>
                  <input
                    type="tel" name="phoneNo" value={form.phoneNo} onChange={handleChange} disabled={!isEditing}
                    className={`w-full px-3 h-9 border rounded-md transition-all text-sm font-medium ${isEditing
                      ? "border-ash-dark focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 bg-brand-surface text-text-main shadow-sm"
                      : "border-ash-medium bg-brand-ash/50 text-text-muted"
                      } disabled:cursor-not-allowed`}
                    placeholder="Enter your phone"
                  />
                </div>

                {/* Divider for Read-Only Account Data */}
                <div className="sm:col-span-2 my-1 border-t border-ash-light"></div>

                {/* Role (Read-Only) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    <i className="fas fa-shield-alt text-text-muted mr-1.5" /> Role
                  </label>
                  <div className="w-full px-3 h-9 border border-ash-medium bg-brand-ash rounded-md flex items-center gap-2 cursor-not-allowed">
                    <span className="text-text-muted">{currentRole.icon}</span>
                    <span className="text-xs font-bold tracking-wider text-text-main">{currentRole.label}</span>
                  </div>
                </div>

                {/* User ID (Read-Only) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    <i className="fas fa-id-badge text-text-muted mr-1.5" /> User ID
                  </label>
                  <div className="w-full px-3 h-9 border border-ash-medium bg-brand-ash rounded-md flex items-center cursor-not-allowed">
                    <span className="text-sm font-mono text-text-muted truncate w-full" title={_id || ""}>{_id || "N/A"}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-ash-light justify-end">
                  <Button
                    onClick={handleCancel} disabled={isPending} variant="outline"
                    className="h-9 px-5 font-bold text-xs order-2 sm:order-none w-full sm:w-auto border-ash-dark text-text-main hover:bg-brand-ash"
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isPending} onClick={handleSave} disabled={isPending} variant="dark"
                    className="h-9 px-5 font-bold text-xs order-1 sm:order-none w-full sm:w-auto shadow-sm"
                  >
                    <i className="fas fa-save mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Full-Screen Image Modal */}
      {isModalOpen && displayImageSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <img
              src={displayImageSrc}
              alt="Profile Full Size"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-white/10"
            />
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <i className="fas fa-times text-3xl drop-shadow-md" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
