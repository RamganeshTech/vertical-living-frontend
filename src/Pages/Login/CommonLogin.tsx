import React, { useState } from "react";
// import { useLoginCommonUser } from "../../apiList/userApi"; // Ensure this matches your hook file path
import { handleLoginValidation } from "../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import { CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { setRole } from "../../features/authSlice";



import { useDispatch } from "react-redux";
import { toast } from './../../utils/toast';
import { useLoginCommonUser } from "../../apiList/commonAuthApi";

import { setOwnerProfileData } from "../../features/userSlices";
import { setStaffProfileData } from "../../features/staffSlices";
import { setCTOProfileData } from "../../features/CTOSlice";
import { setWorkerProfileData } from "../../features/workerSlice";
import { setClientProfileData } from "../../features/clientSlice";

export interface LoginType {
    email: string;
    password: string;
}

const CommonLogin = () => {
    const [formData, setFormData] = useState<LoginType>({ email: "", password: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Using the unified login hook
    const { mutateAsync: loginUser, isPending } = useLoginCommonUser();

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
                    ownerId: userData.ownerId
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
                            ownerId: userData?.ownerId

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
                            ownerId: userData?.ownerId

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
                            ownerId: userData?.ownerId

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
                            ownerId: userData?.ownerId

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
                            ownerId: userData?.ownerId

                        }));
                        break;

                    default:
                        console.warn("Unknown role detected:", role);
                }

                toast({ title: "Success", description: "Login successful" });

                // Redirect based on role or a default page
                navigate('/organizations');
            }
        }
        catch (error: any) {
            toast({
                title: "Login Failed",
                description: error?.message || "Invalid credentials. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        // <div className="w-full max-w-md mx-auto">
        <div className="min-h-screen overflow-y-auto relative bg-gradient-to-br from-blue-50 p-4 via-white to-blue-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md  shadow-xl border border-gray-100">
                <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <i className="fas fa-shield-halved text-white text-2xl"></i>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                        Login
                    </CardTitle>
                    <CardDescription className="text-blue-600 text-base mt-2">
                        Sign in to access your organization dashboard
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-blue-800 font-medium">
                            Email Address
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-envelope text-blue-400"></i>
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                className={`pl-10 border-2 transition-all duration-200 ${errors.email ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                    } bg-white/70 backdrop-blur-sm`}
                                error={errors.email}
                            />
                        </div>
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-blue-800 font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-lock text-blue-400"></i>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`pl-10 pr-12 border-2 transition-all duration-200 ${errors.password ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                    } bg-white/70 backdrop-blur-sm`}
                                error={errors.password}

                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                            </button>
                        </div>
                        {/* {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>} */}
                    </div>

                    <div className="text-right">
                        <Link
                            to="/common/forgotpassword"
                            className="text-blue-600 text-sm font-medium hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.01]"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <i className="fas fa-spinner fa-spin"></i> Authenticating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <i className="fas fa-sign-in-alt"></i> Sign In
                            </span>
                        )}
                    </Button>
                </form>

                {/* <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 italic">
                        Authorized access only. All activities are logged.
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default CommonLogin;