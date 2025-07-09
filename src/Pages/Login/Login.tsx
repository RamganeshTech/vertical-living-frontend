import React, { useState } from "react";
import { useCreateUser, useLoginUser } from "../../apiList/userApi";
import { handleLoginValidation, handleRegistrationValidation } from "../../utils/validation";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../../components/CustomAlert";
import { CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { setRole } from "../../features/authSlice";
import { setOwnerProfileData } from "../../features/userSlices";
import { useDispatch } from "react-redux";

export interface loginType {
    email: string;
    password: string;
}

export interface RegistrationType extends loginType {
    userName: string
    phoneNo: string
    confirmPassword: string
}

const LoginPage = () => {
    const [formData, setFormData] = useState<loginType>({ email: "", password: "" });
    const [registerData, setRegisterData] = useState<RegistrationType>({ email: "", password: "", userName: "", phoneNo: "", confirmPassword: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showRegistrationForm, setShowRegistrationForm] = useState<boolean>(false);

    const [toast, setToast] = useState<string | null>(null)



    const { mutateAsync: loginUser, isPending, isError, error, reset } = useLoginUser();
    const { mutateAsync: registerUser, isPending: registerPending, isError: registerIsError, error: registerError, reset: registerReset } = useCreateUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setErrors({});

            const validationErrors = handleLoginValidation(formData);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0 && !isPending) {
                const data = await loginUser(formData);


                if (data.ok) {
                    const userData = data.data;

                    // 1️⃣ Update authSlice
                    dispatch(setRole({
                        _id:userData.userId,
                        role: userData.role,
                        isauthenticated: true
                    }));

                    // 2️⃣ Update userSlice
                    dispatch(setOwnerProfileData({
                        userId: userData.userId, // or userId
                        userName: userData.userName,
                        email: userData.email,
                        phoneNo: userData.phoneNo,
                        role: userData.role,
                        isauthenticated: true
                    }));

                }

                console.log(data)
                console.log("form data", formData)
                setToast((data as any).message)
            }
        }
        catch (error) {
            console.log("login error form catch error", error)
        }
    };


    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setRegisterErrors({});

            const validationErrors = handleRegistrationValidation(registerData);
            setRegisterErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0 && !isPending) {
                const data =  await registerUser(registerData)



                if (data.ok) {
                    const userData = data.data;

                    dispatch(setRole({
                        _id:userData.userId,
                        role: userData.role,
                        isauthenticated: true
                    }));

                    dispatch(setOwnerProfileData({
                        userId: userData.userId, // here it’s userId instead of _id
                        userName: userData.userName,
                        email: userData.email,
                        phoneNo: userData.phoneNo,
                        role: userData.role,
                        isauthenticated: true
                    }));

                    setToast(data.message);
                }
                console.log("registerUser", registerData)
            }
        }
        catch (error) {
            console.log("login error form catch error", error)
        }
    };


    if (isError) {
        console.log("login error", error)
    }

    return (
        // <div className="min-h-screen flex justify-center items-center bg-gray-100">

        //     {toast && <CustomAlert onClose={()=> setToast(null)} message={toast} type="success" />}

        //     {!isPending && isError && <ErrorComponent
        //         message={(error as any)?.response?.data?.message || error?.message || "Something went wrong"}
        //         onClick={() => reset()} />}

        //     {!registerPending && registerIsError && <ErrorComponent
        //         message={(registerError as any)?.response?.data?.message || registerError?.message || "Something went wrong"}
        //         onClick={() => registerReset()} />}

        //     {!showRegistrationForm ? <div className="w-full max-w-lg rounded-2xl p-1 shadow-lg">
        //         <div className="bg-white rounded-2xl p-8">
        //             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        //                 Login to Your Account
        //             </h2>
        //             <form onSubmit={handleSubmit} className="space-y-5">
        //                 <div>
        //                     <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
        //                         Email
        //                     </label>
        //                     <input
        //                         autoFocus
        //                         id="email"
        //                         name="email"
        //                         type="email"
        //                         value={formData.email}
        //                         onChange={handleChange}
        //                         placeholder="you@example.com"
        //                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        //                     />
        //                     {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        //                 </div>

        //                 <div className="relative">
        //                     <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
        //                         Password
        //                     </label>
        //                     <input
        //                         id="password"
        //                         name="password"
        //                         type={showPassword ? "text" : "password"}
        //                         value={formData.password}
        //                         onChange={handleChange}
        //                         placeholder="••••••••"
        //                         className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        //                     />
        //                     <div
        //                         onClick={() => setShowPassword(!showPassword)}
        //                         className="absolute right-3 top-[50%] cursor-pointer text-gray-500"
        //                     >
        //                         {showPassword ?
        //                             <i className="fa-solid fa-lock h-5 w-5"></i> :
        //                             <i className="fa-solid fa-unlock h-5 w-5"></i>
        //                         }
        //                     </div>
        //                     {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        //                 </div>

        //                 {/* <div className="flex justify-between text-sm text-gray-600">
        //                     <label className="flex items-center">
        //                         <input type="checkbox" className="mr-2" /> Remember me
        //                     </label>
        //                     <Link to="#" className="text-blue-500 hover:underline">Forgot password?</Link>
        //                 </div> */}

        //                 <button
        //                     type="submit"
        //                     disabled={isPending}
        //                     className="w-[80%] cursor-pointer block mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        //                 >
        //                     {isPending ? <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full mx-auto"></div> : "Login"}
        //                 </button>
        //             </form>

        //             <p className="text-center text-sm text-gray-600 mt-6">
        //                 Don’t have an account?{" "}
        //                 <Link to="#" onClick={() => setShowRegistrationForm(true)} className="text-blue-500 hover:underline">Register</Link>
        //             </p>
        //         </div>
        //     </div>
        //         :
        //         <div className="w-full max-w-lg rounded-2xl p-1 shadow-lg">
        //             <div className="bg-white rounded-2xl p-8">
        //                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        //                     Register Your Account
        //                 </h2>
        //                 <form onSubmit={handleRegisterSubmit} className="space-y-5">
        //                     <div>
        //                         <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
        //                             Email
        //                         </label>
        //                         <input
        //                         autoFocus
        //                             id="email"
        //                             name="email"
        //                             type="email"
        //                             value={registerData.email}
        //                             onChange={handleRegisterChange}
        //                             placeholder="you@example.com"
        //                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        //                         />
        //                         {registerErrors.email && <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>}
        //                     </div>

        //                     <div className="relative">
        //                         <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
        //                             Password
        //                         </label>
        //                         <input
        //                             id="password"
        //                             name="password"
        //                             type={showPassword ? "text" : "password"}
        //                             value={registerData.password}
        //                             onChange={handleRegisterChange}
        //                             placeholder="••••••••"
        //                             className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        //                         />
        //                         <div
        //                             onClick={() => setShowPassword(!showPassword)}
        //                             className="absolute right-3 top-[50%] cursor-pointer text-gray-500"
        //                         >
        //                             {showPassword ?
        //                                 <i className="fa-solid fa-lock h-5 w-5"></i> :
        //                                 <i className="fa-solid fa-unlock h-5 w-5"></i>
        //                             }
        //                         </div>
        //                         {registerErrors.password && <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>}
        //                     </div>

        //                     <div>
        //                         <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
        //                             Username
        //                         </label>
        //                         <input
        //                             id="userName"
        //                             name="userName"
        //                             type="text"
        //                             value={registerData.userName}
        //                             onChange={handleRegisterChange}
        //                             placeholder="Arun Kumar"
        //                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        //                         />
        //                         {registerErrors?.userName && <p className="text-red-500 text-sm mt-1">{registerErrors?.userName}</p>}
        //                     </div>

        //                      <div>
        //                         <label htmlFor="phoneNo" className="block mb-1 text-sm font-medium text-gray-700">
        //                             Phone Number
        //                         </label>
        //                         <input
        //                             id="phoneNo"
        //                             name="phoneNo"
        //                             type="tel"
        //                             value={registerData.phoneNo}
        //                             onChange={handleRegisterChange}
        //                             placeholder="9867453456"
        //                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        //                         />
        //                         {registerErrors?.phoneNo && <p className="text-red-500 text-sm mt-1">{registerErrors?.phoneNo}</p>}
        //                     </div>

        //                     <button
        //                         type="submit"
        //                         disabled={registerPending}
        //                         className="w-[80%] block cursor-pointer mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        //                     >
        //                         {registerPending ? <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full mx-auto"></div> : "Register"}
        //                     </button>
        //                 </form>

        //                 <p className="text-center text-sm text-gray-600 mt-6">
        //                     Already a user?{" "}
        //                     <Link to="#" onClick={() => setShowRegistrationForm(false)} className="text-blue-500 hover:underline">Login</Link>
        //                 </p>
        //             </div>
        //         </div>}
        // </div>


        <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
            {toast && <CustomAlert onClose={() => setToast(null)} message={toast} type="success" />}
            {!isPending && isError && (
                <ErrorComponent
                    message={(error as any)?.response?.data?.message || error?.message || "Something went wrong"}
                    onClick={() => reset()}
                />
            )}
            {!registerPending && registerIsError && (
                <ErrorComponent
                    message={(registerError as any)?.response?.data?.message || registerError?.message || "Something went wrong"}
                    onClick={() => registerReset()}
                />
            )}

            <Button variant="primary" onClick={() => navigate(-1)} className="!absolute top-[5%] right-[10%]">
                Go Back
            </Button>

            {!showRegistrationForm ? (
                <div className="w-full max-w-md ">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        {/* Icon */}
                        {/* <div className="flex justify-center mb-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <i className="fas fa-user"></i>
                            </div>
                        </div> */}

                        {/* Header */}
                        {/* <div className="text-center mb-4">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Owner Login</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Sign in to access your project Dashboard</p>
                        </div> */}

                        <CardHeader className="text-center pb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <i className="fas fa-user-tie text-white text-2xl"></i>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                                Admin Login
                            </CardTitle>
                            <CardDescription className="text-blue-600 text-base">
                                Sign in to access your organization dashboard
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                            </div>

                            <div>
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
                                        placeholder="Enter your password"
                                        className={`pl-10 pr-12 border-2 transition-all duration-200 ${errors.password ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                            } bg-white/70 backdrop-blur-sm`}
                                        error={errors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <i className="fas fa-eye-slash" />
                                        ) : (
                                            <i className="fas fa-eye" />
                                        )}
                                    </button>
                                </div>
                                {/* {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>} */}
                            </div>




                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                isLoading={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt mr-2"></i>
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-xs sm:text-sm text-gray-600">
                                {"Don't have an account? "}
                                <button
                                    onClick={() => setShowRegistrationForm(true)}
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                >
                                    Register here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
                        {/* Icon */}
                        {/* <div className="flex justify-center mb-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <i className="fas fa-user"></i>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Owner Registration</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Create your owner account to get started</p>
                        </div> */}

                        <CardHeader className="text-center pb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <i className="fas fa-user-tie text-white text-2xl"></i>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                                Admin Registration
                            </CardTitle>
                            <CardDescription className="text-blue-600 text-base">
                                Create your owner account to get started                            </CardDescription>
                        </CardHeader>


                        <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="staffName" className="text-blue-800 font-medium">
                                    Full Name *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-user text-blue-400"></i>
                                    </div>
                                    <Input
                                        id="staffName"
                                        name="staffName"
                                        type="text"
                                        value={registerData.userName}
                                        onChange={handleRegisterChange}
                                        placeholder="Enter your full name"
                                        className={`pl-10 border-2 transition-all duration-200 ${registerErrors.userName ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                            } bg-white/70 backdrop-blur-sm`}
                                        error={registerErrors.userName}
                                    />
                                </div>
                            </div>

                            {/* <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    autoFocus
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                                />
                                {registerErrors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{registerErrors.email}</p>}
                            </div> */}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-blue-800 font-medium">
                                    Email Address *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-envelope text-blue-400"></i>
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        placeholder="Enter your email address"
                                        className={`pl-10 border-2 transition-all duration-200 ${registerErrors.email ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                            } bg-white/70 backdrop-blur-sm`}
                                        error={registerErrors.email}
                                    />
                                </div>
                            </div>

                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNo" className="text-blue-800 font-medium">
                                    Phone Number *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-phone text-blue-400"></i>
                                    </div>
                                    <Input
                                        id="phoneNo"
                                        name="phoneNo"
                                        type="tel"
                                        maxLength={10}
                                        value={registerData.phoneNo}
                                        onChange={handleRegisterChange}
                                        placeholder="Enter your phone number"
                                        className={`pl-10 border-2 transition-all duration-200 ${registerErrors.phoneNo ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                            } bg-white/70 backdrop-blur-sm`}
                                        error={registerErrors.phoneNo}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-blue-800 font-medium">
                                    Password *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-blue-400"></i>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        placeholder="Create a password"
                                        className={`pl-10 pr-12 border-2 transition-all duration-200 ${registerErrors.password ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                                            } bg-white/70 backdrop-blur-sm`}
                                        error={registerErrors.password}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </button>
                                </div>
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-blue-800 font-medium">
                                    Confirm Password *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-blue-400"></i>
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="Confirm your password"
                                        className={`pl-10 pr-12 border-2 transition-all duration-200 ${registerErrors.confirmPassword
                                            ? "border-red-300 focus:border-red-500"
                                            : "border-blue-200 focus:border-blue-500"
                                            } bg-white/70 backdrop-blur-sm`}
                                        error={registerErrors.confirmPassword}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </button>
                                </div>
                            </div>





                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                isLoading={registerPending}
                            >
                                {registerPending ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-check mr-2"></i>
                                        Complete Registration
                                    </>
                                )}
                            </Button>

                        </form>

                        <div className="text-center mt-6">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setShowRegistrationForm(false)}
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
