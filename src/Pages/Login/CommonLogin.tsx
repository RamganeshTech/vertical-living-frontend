import React, { useEffect, useState } from "react";
// import { useLoginCommonUser } from "../../apiList/userApi"; // Ensure this matches your hook file path
import { handleLoginValidation } from "../../utils/validation";
// import { Link, useNavigate } from "react-router-dom";
// import { CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
// import { Input } from "../../components/ui/Input";
// import { Label } from "../../components/ui/Label";
// import { Button } from "../../components/ui/Button";
import { setRole } from "../../features/authSlice";
// import illustationimg from "../../assets/welcomeimg.svg"



import { useDispatch } from "react-redux";
import { toast } from './../../utils/toast';
import { useLoginCommonUser } from "../../apiList/commonAuthApi";

import { setOwnerProfileData } from "../../features/userSlices";
import { setStaffProfileData } from "../../features/staffSlices";
import { setCTOProfileData } from "../../features/CTOSlice";
import { setWorkerProfileData } from "../../features/workerSlice";
import { setClientProfileData } from "../../features/clientSlice";
import { COMPANY_DETAILS } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

export interface LoginType {
    email: string;
    password: string;
}

const CommonLogin = () => {
    const [formData, setFormData] = useState<LoginType>({ email: "", password: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 470);


    const dispatch = useDispatch();
    const navigate = useNavigate();



    // Using the unified login hook
    const { mutateAsync: loginUser, isPending } = useLoginCommonUser();


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 470);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setErrors({});
            const validationErrors = handleLoginValidation(formData);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const response = await loginUser(formData);

            if (response.ok) {
                const userData = response?.data; // This is the data object from your backend
                const role = userData?.role;

                // 1️⃣ Update authSlice with unified data
                dispatch(setRole({
                    _id: userData?.userId || userData?.staffId || userData?.workerId || userData?.CTOId || userData?.clientId,
                    role: userData?.role,
                    isauthenticated: true,
                    userName: userData?.userName || userData?.staffName || userData?.workerName || userData?.CTOName || userData?.clientName,
                    permission: userData?.permission || {},
                    isGuideRequired: userData?.isGuideRequired,
                    ownerId: userData.ownerId,
                    organizationId: userData?.organizationId,
                    profileImage: userData?.profileImage?.url

                }));

                // 2️⃣ Role-Specific Dispatches to update individual Slices
                switch (role) {
                    case 'owner':
                        dispatch(setOwnerProfileData({
                            userId: userData.userId,
                            userName: userData.userName,
                            email: userData.email,
                            phoneNo: userData.phoneNo,
                            role: userData.role,
                            isauthenticated: true,
                            isGuideRequired: userData.isGuideRequired,
                            ownerId: userData?.ownerId,
                            profileImage: userData.profileImage?.url
                        }));
                        break;

                    case 'staff':
                        dispatch(setStaffProfileData({
                            staffId: userData.staffId,
                            staffName: userData.staffName,
                            email: userData.email,
                            phoneNo: userData.phoneNo,
                            role: userData.role,
                            isauthenticated: true,
                            permission: userData.permission || {},
                            isGuideRequired: userData.isGuideRequired,
                            ownerId: userData?.ownerId,
                            profileImage: userData.profileImage?.url


                        }));
                        break;

                    case 'CTO':
                        dispatch(setCTOProfileData({
                            CTOId: userData.CTOId,
                            CTOName: userData.CTOName,
                            email: userData.email,
                            phoneNo: userData.phoneNo,
                            role: userData.role,
                            isauthenticated: true,
                            permission: userData.permission || {},
                            isGuideRequired: userData.isGuideRequired,
                            ownerId: userData?.ownerId,
                            profileImage: userData.profileImage?.url



                        }));
                        break;

                    case 'worker':
                        dispatch(setWorkerProfileData({
                            workerId: userData.workerId || userData._id,
                            workerName: userData.workerName,
                            email: userData.email,
                            phoneNo: userData.phoneNo,
                            role: userData.role,
                            isauthenticated: true,
                            permission: userData.permission || {},
                            isGuideRequired: userData.isGuideRequired,
                            ownerId: userData?.ownerId,
                            profileImage: userData.profileImage?.url



                        }));
                        break;

                    case 'client':
                        dispatch(setClientProfileData({
                            clientId: userData.clientId,
                            clientName: userData.clientName,
                            email: userData.email,
                            phoneNo: userData.phoneNo,
                            role: userData.role,
                            isauthenticated: true,
                            permission: userData.permission || {},
                            isGuideRequired: userData.isGuideRequired,
                            ownerId: userData?.ownerId,
                            profileImage: userData.profileImage?.url



                        }));
                        break;

                    default:
                        console.warn("Unknown role detected:", role);
                }

                toast({ title: "Success", description: "Login successful" });

                // Redirect based on role or a default page
                navigate(`/organizations/${userData.organizationId}`);
            }
        }
        catch (error: any) {
            toast({
                title: "Login Failed",
                description: error?.response?.data?.message || "Invalid credentials. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        // <div className="w-full max-w-md mx-auto">
        // OLD VERSION
        // <div className="min-h-screen overflow-y-auto relative bg-gradient-to-br from-blue-50 p-4 via-white to-blue-100 flex items-center justify-center">
        //     <div className="bg-white p-6 rounded-2xl w-full max-w-md  shadow-xl border border-gray-100">
        //         <CardHeader className="text-center pb-6">
        //             <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        //                 <i className="fas fa-shield-halved text-white text-2xl"></i>
        //             </div>
        //             <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
        //                 Login
        //             </CardTitle>
        //             <CardDescription className="text-blue-600 text-base mt-2">
        //                 Sign in to access your organization dashboard
        //             </CardDescription>
        //         </CardHeader>

        //         <form onSubmit={handleSubmit} className="space-y-5">
        //             {/* Email Field */}
        //             <div className="space-y-2">
        //                 <Label htmlFor="email" className="text-blue-800 font-medium">
        //                     Email Address
        //                 </Label>
        //                 <div className="relative">
        //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        //                         <i className="fas fa-envelope text-blue-400"></i>
        //                     </div>
        //                     <Input
        //                         id="email"
        //                         name="email"
        //                         type="email"
        //                         value={formData.email}
        //                         onChange={handleChange}
        //                         placeholder="Enter your email address"
        //                         className={`pl-10 border-2 transition-all duration-200 ${errors.email ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
        //                             } bg-white/70 backdrop-blur-sm`}
        //                         error={errors.email}
        //                     />
        //                 </div>
        //                 {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
        //             </div>

        //             {/* Password Field */}
        //             <div className="space-y-2">
        //                 <Label htmlFor="password" className="text-blue-800 font-medium">
        //                     Password
        //                 </Label>
        //                 <div className="relative">
        //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        //                         <i className="fas fa-lock text-blue-400"></i>
        //                     </div>
        //                     <Input
        //                         id="password"
        //                         name="password"
        //                         type={showPassword ? "text" : "password"}
        //                         value={formData.password}
        //                         onChange={handleChange}
        //                         placeholder="••••••••"
        //                         className={`pl-10 pr-12 border-2 transition-all duration-200 ${errors.password ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
        //                             } bg-white/70 backdrop-blur-sm`}
        //                         error={errors.password}

        //                     />
        //                     <button
        //                         type="button"
        //                         onClick={() => setShowPassword(!showPassword)}
        //                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        //                     >
        //                         <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
        //                     </button>
        //                 </div>
        //                 {/* {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>} */}
        //             </div>

        //             <div className="text-right">
        //                 <Link
        //                     to="/common/forgotpassword"
        //                     className="text-blue-600 text-sm font-medium hover:underline"
        //                 >
        //                     Forgot Password?
        //                 </Link>
        //             </div>

        //             <Button
        //                 type="submit"
        //                 disabled={isPending}
        //                 className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.01]"
        //             >
        //                 {isPending ? (
        //                     <span className="flex items-center gap-2">
        //                         <i className="fas fa-spinner fa-spin"></i> Authenticating...
        //                     </span>
        //                 ) : (
        //                     <span className="flex items-center gap-2">
        //                         <i className="fas fa-sign-in-alt"></i> Sign In
        //                     </span>
        //                 )}
        //             </Button>
        //         </form>

        //         {/* <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        //             <p className="text-sm text-gray-500 italic">
        //                 Authorized access only. All activities are logged.
        //             </p>
        //         </div> */}
        //     </div>
        // </div>

        //  2nd VERSION

        // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-white px-4">

        //     {/* Main Container */}
        //     <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        //         {/* LEFT SIDE (Light Illustration Section) */}
        //         {/* LEFT SIDE (Branding + Illustration) */}
        //         {/* <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-white to-blue-50 px-8 py-8 border-r border-gray-100"> */}
        //         {/* <div className="hidden md:flex flex-col justify-between px-8 py-8 border-r border-gray-100 bg-[linear-gradient(to_bottom,white_0%,white_50%,#eff6ff_50%,#eff6ff_100%)]"> */}
        //         <div className="hidden md:flex flex-col justify-between px-8 py-8 border-r border-gray-100 bg-[linear-gradient(to_bottom,white_0%,#eff6ff_50%,#eff6ff_100%)]">

        //             {/* TOP: Branding */}
        //             <div className="flex items-center gap-3">
        //                 <img
        //                     src={COMPANY_DETAILS.COMPANY_LOGO}
        //                     alt="logo"
        //                     className="w-10 h-10 rounded-lg object-cover shadow-sm"
        //                 />
        //                 <h1 className="text-base font-semibold text-gray-800 tracking-tight">
        //                     {COMPANY_DETAILS.COMPANY_NAME}
        //                 </h1>
        //             </div>

        //             {/* CENTER: Illustration + Login Context */}
        //             <div className="flex flex-col items-center text-center mt-6">

        //                 <img
        //                     src={illustationimg}
        //                     alt="illustration"
        //                     className="w-56 h-auto object-contain"
        //                 />

        //                 <h2 className="text-lg font-semibold text-gray-800 mt-5">
        //                     Secure Access to Your Workspace
        //                 </h2>

        //                 <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
        //                     Sign in to continue and manage your workspace securely with role-based access.
        //                 </p>
        //             </div>

        //             {/* BOTTOM: Minimal Trust Line */}
        //             <div className="text-xs text-gray-400 text-center mt-6">
        //                 Protected • Role-based access
        //             </div>
        //         </div>


        //         {/* RIGHT SIDE (Form Section) */}
        //         <div className="flex items-center justify-center p-8 sm:p-10">

        //             <div className="w-full max-w-sm">

        //                 {/* Header */}
        //                 <div className="mb-8">
        //                     <h2 className="text-2xl font-bold text-gray-800">
        //                         Welcome back
        //                     </h2>
        //                     <p className="text-gray-500 text-sm mt-1">
        //                         Please login to your account
        //                     </p>
        //                 </div>

        //                 {/* Form */}
        //                 <form onSubmit={handleSubmit} className="space-y-5">

        //                     {/* Email */}
        //                     <div>
        //                         <label className="text-sm font-medium text-gray-700">
        //                             Email
        //                         </label>

        //                         <div className="relative mt-1">
        //                             <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

        //                             <input
        //                                 type="email"
        //                                 name="email"
        //                                 value={formData.email}
        //                                 onChange={handleChange}
        //                                 placeholder="Enter your email"
        //                                 className={`w-full pl-10 pr-3 py-3 rounded-xl border text-sm focus:outline-none transition 
        //                         ${errors.email
        //                                         ? "border-red-400 focus:ring-2 focus:ring-red-100"
        //                                         : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        //                                     }`}
        //                             />
        //                         </div>
        //                     </div>

        //                     {/* Password */}
        //                     <div>
        //                         <label className="text-sm font-medium text-gray-700">
        //                             Password
        //                         </label>

        //                         <div className="relative mt-1">
        //                             <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

        //                             <input
        //                                 type={showPassword ? "text" : "password"}
        //                                 name="password"
        //                                 value={formData.password}
        //                                 onChange={handleChange}
        //                                 placeholder="••••••••"
        //                                 className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none transition 
        //                         ${errors.password
        //                                         ? "border-red-400 focus:ring-2 focus:ring-red-100"
        //                                         : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        //                                     }`}
        //                             />

        //                             <button
        //                                 type="button"
        //                                 onClick={() => setShowPassword(!showPassword)}
        //                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        //                             >
        //                                 <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
        //                             </button>
        //                         </div>
        //                     </div>

        //                     {/* Forgot Password */}
        //                     <div className="flex justify-end">
        //                         <a
        //                             href="/common/forgotpassword"
        //                             className="text-sm text-blue-600 hover:underline"
        //                         >
        //                             Forgot Password?
        //                         </a>
        //                     </div>

        //                     {/* Button */}
        //                     <button
        //                         type="submit"
        //                         disabled={isPending}
        //                         className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        //                     >
        //                         {isPending ? (
        //                             <span className="flex items-center justify-center gap-2">
        //                                 <i className="fas fa-spinner fa-spin"></i>
        //                                 Logging in...
        //                             </span>
        //                         ) : (
        //                             "Login"
        //                         )}
        //                     </button>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>


        //  3RD VERSION

        <main className="min-h-screen w-full relative flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 px-4 py-8 font-poppins overflow-hidden">

            {/* Background Ambient Glows */}
            <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* MOBILE ONLY HEADER: Visible only on small screens (< 768px) */}
            {isMobile && <header className=" absolute top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 px-5 py-3.5 flex items-center justify-between z-50 shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3" onClick={() => navigate('/home')}>
                    <img
                        src={COMPANY_DETAILS.COMPANY_LOGO}
                        alt="logo"
                        className="w-8 h-8 rounded-md object-cover shadow-sm"
                    />
                    <h1 className="text-base font-bold text-gray-900 tracking-tight font-montserrat">
                        {COMPANY_DETAILS.COMPANY_NAME}
                    </h1>
                </div>

                <button
                    onClick={() => "/home"}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer"
                    aria-label="Go back"
                >
                    <i className="fa-solid fa-house text-sm"></i>
                </button>
            </header>}
            {/* Main Container */}
            <div className={`relative z-10 w-full max-w-[900px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden grid md:grid-cols-2 border border-gray-100 min-h-[550px] ${isMobile ? "mt-10" : ""}  animate-in fade-in slide-in-from-bottom-6 duration-700`}>

                {/* LEFT SIDE: Clean Professional Illustration Area (Hidden on Mobile) */}
                <section className="hidden md:flex flex-col flex-1 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 border-r border-indigo-100/50 p-10 justify-between relative overflow-hidden">

                    {/* Subtle decorative blurs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
                    </div>

                    {/* TOP: Branding */}
                    <div className="relative z-10 flex items-center gap-3">
                        <img
                            src={COMPANY_DETAILS.COMPANY_LOGO}
                            alt="logo"
                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                        />
                        {/* <h1 className="text-lg font-bold text-gray-800 tracking-tight font-montserrat"> */}
                        <h1 className="font-poppins font-bold text-gray-800 text-lg">

                            {COMPANY_DETAILS.COMPANY_NAME}
                        </h1>
                    </div>

                    {/* CENTER: Context & Custom SVG */}
                    <div className="relative z-10 mt-6">
                        <h2 className="text-2xl font-semibold text-gray-900 font-montserrat leading-snug mb-3">
                            Secure Workspace Access
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-8">
                            Sign in to manage your projects, coordinate staff tasks, and review client approvals.
                        </p>

                        {/* CRM Dashboard SVG Illustration */}
                        <div className="w-full flex justify-center">
                            {/* SVG representing a Secure User Access Portal */}
                            <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto drop-shadow-xl transition-all duration-500 hover:-translate-y-1">

                                {/* Connection Lines (Abstract Background) */}
                                <path d="M60 120 L100 80 M60 120 L100 160 M260 120 L220 80 M260 120 L220 160" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="60" cy="120" r="4" fill="#C7D2FE" />
                                <circle cx="260" cy="120" r="4" fill="#C7D2FE" />

                                {/* Outer Glass Container */}
                                <rect x="80" y="40" width="160" height="180" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1" />
                                <rect x="80" y="40" width="160" height="40" rx="16" fill="#F8FAFC" stroke="#E5E7EB" strokeWidth="1" />
                                {/* Mock Browser Dots */}
                                <circle cx="100" cy="60" r="3" fill="#CBD5E1" />
                                <circle cx="112" cy="60" r="3" fill="#CBD5E1" />

                                {/* Central User Avatar */}
                                <circle cx="160" cy="115" r="30" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
                                <path d="M160 125 C145 125, 135 135, 135 145 H185 C185 135, 175 125, 160 125 Z" fill="#A5B4FC" />
                                <circle cx="160" cy="110" r="10" fill="#A5B4FC" />

                                {/* Input Field Placeholders */}
                                <rect x="100" y="155" width="120" height="10" rx="5" fill="#EEF2FF" />
                                <rect x="100" y="175" width="100" height="10" rx="5" fill="#F3F4F6" />

                                {/* Security Shield and Unlocked Icon */}
                                <path d="M160 15 C140 25, 130 35, 130 50 V70 L160 85 L190 70 V50 C190 35, 180 25, 160 15 Z" fill="#6366F1" stroke="white" strokeWidth="2" />
                                {/* Checkmark inside shield */}
                                <path d="M152 52 L158 58 L168 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                                {/* Floating "Access Granted" element */}
                                <rect x="210" y="190" width="70" height="20" rx="10" fill="#34D399" fillOpacity="0.1" stroke="#34D399" strokeWidth="1" />
                                <circle cx="222" cy="200" r="4" fill="#34D399" />
                                <rect x="232" y="198" width="35" height="4" rx="2" fill="#34D399" />

                            </svg>
                        </div>
                    </div>
                </section>

                {/* RIGHT SIDE: Clean Login Section */}
                <section className="flex items-center justify-center p-8 sm:p-12 bg-white relative z-20">
                    <div className="w-full max-w-sm">

                        {/* Header Text */}
                        <div className="mb-8 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 font-montserrat">
                                Welcome back
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Please login to your account
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email Input */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'} rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-sm font-poppins text-gray-800 shadow-sm`}
                                    />
                                </div>
                                {/* Dynamic Error Display */}
                                {errors.email && (
                                    <span className="text-xs text-red-500 font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <a href="/common/forgotpassword"
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <i className="fa-solid fa-lock"></i>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-10 py-2.5 bg-white border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'} rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-sm font-poppins text-gray-800 shadow-sm`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                    </button>
                                </div>
                                {/* Dynamic Error Display */}
                                {errors.password && (
                                    <span className="text-xs text-red-500 font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-400 flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    {isPending ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Login to Workspace
                                            <i className="fa-solid fa-arrow-right text-xs"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Registration Redirect */}
                        <div className="mt-8 text-center bg-gray-50 py-3 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-600">
                                New here? <a href="/organizations-registration" className="text-indigo-600 font-semibold hover:underline transition-all">Register your Firm</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CommonLogin;