import { useState } from "react";
import { useUpdateProfile } from "../../apiList/Stage Api/profile Edit Api/profileEditApi";
import { Button } from "../../components/ui/Button";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useOutletContext } from "react-router-dom";
import type { OrganizationOutletTypeProps } from "../Organization/OrganizationChildren";
import { toast } from "../../utils/toast";

// import *each* profile slice actions
import { setOwnerProfileData } from "../../features/userSlices";
import { setClientProfileData } from "../../features/clientSlice";
import { setCTOProfileData } from "../../features/CTOSlice";
import { setStaffProfileData } from "../../features/staffSlices";
import { setWorkerProfileData } from "../../features/workerSlice";
import RazorpayConfig from "../RazorPay Config/RazorPayConfig";


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
    icon: "👑",
  },
  staff: {
    label: "Staff",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "👥",
  },
  CTO: {
    label: "CTO",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🚀",
  },
  client: {
    label: "Client",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🤝",
  },
  worker: {
    label: "Worker",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "⚡",
  },
}

export default function ProfileDetails() {
  const { openMobileSidebar, isMobile } =
    useOutletContext<OrganizationOutletTypeProps>();

  // Get role
  const { role, _id } = useSelector((state: RootState) => state.authStore);
  const dispatch = useDispatch()
  // Get correct slice by role
  const profile =
    role === "owner"
      ? useSelector((state: RootState) => state.userProfileStore)
      : role === "staff"
        ? useSelector((state: RootState) => state.staffProfileStore)
        : role === "CTO"
          ? useSelector((state: RootState) => state.CTOProfileStore)
          : role === "client"
            ? useSelector((state: RootState) => state.clientProfileStore)
            : role === "worker"
              ? useSelector((state: RootState) => state.workerProfileStore)
              : null;

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
      })
      toast({ title: "Success", description: "Completion status updated successfully" });


      const payload = {
        email: form.email,
        phoneNo: form.phoneNo,
        role: role,
        isauthenticated: true,
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
      email: "",
      phoneNo: "",
    })
    setIsEditing(false)
  }


  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.worker
  const firstLetter = getProfileName().charAt(0).toUpperCase();

  return (
    <div className="max-h-screen overflow-y-auto bg-gray-50">
      {/* Header - Made Responsive */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="p-2 rounded-lg border border-gray-700 hover:bg-gray-300 transition-colors lg:hidden flex-shrink-0"
                  title="Open Menu"
                >
                  <i className="w-4 h-4 sm:w-5 sm:h-5 fas fa-bars !text-gray-600" />
                </button>
              )}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg flex-shrink-0">
                  <i className="w-5 h-5 sm:w-6 sm:h-6 fas fa-user text-gray-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">My Profile</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage your personal information</p>
                </div>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex-shrink-0"
              >
                <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-pen" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Made Responsive */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card - Made Responsive */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Header - Made Responsive */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-6 sm:py-8 text-white">
              <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row">
                {/* Avatar - Responsive Size */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-2 sm:border-3 border-white/30 shadow-lg flex-shrink-0">
                  {firstLetter}
                </div>
                {/* Profile Info - Made Responsive */}
                <div className="text-center md:text-left flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 break-words">{getProfileName()}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2 flex-wrap">
                    <span className="text-lg sm:text-xl">{currentRole.icon}</span>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/90 text-gray-800 border border-white/30">
                      {currentRole.label}
                    </span>
                    {/* {currentRole.icon} 
                    <Badge>{" "} {currentRole.label}</Badge> */}
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm break-all">ID: {_id}</p>
                </div>
              </div>
            </div>

            {/* Profile Form - Made Responsive */}
            <div className="p-4 sm:p-6 md:p-8">
              {isEditing && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-pencil" />
                    <span className="font-medium text-sm sm:text-base">Edit Mode</span>
                  </div>
                  <p className="text-blue-700 text-xs sm:text-sm mt-1">
                    Make your changes and click save when you're done.
                  </p>
                </div>
              )}

              {/* Form Grid - Made Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Name Field - Made Responsive */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-user inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${isEditing
                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                      } disabled:cursor-not-allowed`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field - Made Responsive */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-envelope inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${isEditing
                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                      } disabled:cursor-not-allowed`}
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Field - Made Responsive */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-phone inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={form.phoneNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${isEditing
                        ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                      } disabled:cursor-not-allowed`}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Action Buttons - Made Responsive */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <Button
                    isLoading={isPending}
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base order-1 sm:order-none"
                  >
                    <i className="w-3 h-3 sm:w-4 sm:h-4 fas fa-save" />
                    Save Changes
                  </Button>
                  <button
                    onClick={handleCancel}
                    disabled={isPending}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base order-2 sm:order-none"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Summary Card - Made Responsive */}
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <i className="w-4 h-4 sm:w-5 sm:h-5 fas fa-shield text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Summary</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center py-2">
                <span className="text-gray-600 font-medium text-sm sm:text-base">User ID:</span>
                <span className="text-gray-900 font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded break-all">
                  {_id || "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center py-2">
                <span className="text-gray-600 font-medium text-sm sm:text-base">Role:</span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${currentRole.color} w-fit`}
                >
                  {currentRole.icon} {currentRole.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {role && ["owner", "CTO", "staff"].includes(role) && <RazorpayConfig />}
    </div>
  );
}
