import React, { useState } from "react";
import { useCreateUser, useLoginUser } from "../../apiList/userApi";
import { handleLoginValidation, handleRegistrationValidation } from "../../utils/validation";
import ErrorComponent from "../../components/ErrorComponent";
import { Link } from "react-router-dom";
import CustomAlert from "../../components/CustomAlert";

export interface loginType {
    email: string;
    password: string;
}

export interface RegistrationType extends loginType {
    userName: string
    phoneNo: string
}

const LoginPage = () => {
    const [formData, setFormData] = useState<loginType>({ email: "", password: "" });
    const [registerData, setRegisterData] = useState<RegistrationType>({ email: "", password: "", userName: "", phoneNo: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [showRegistrationForm, setShowRegistrationForm] = useState<boolean>(false);

    const [toast, setToast] = useState<string | null>(null)



    const { mutateAsync: loginUser, isPending, isError, error, reset } = useLoginUser();
    const { mutate: registerUser, isPending: registerPending, isError: registerIsError, error: registerError, reset: registerReset } = useCreateUser();

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
                console.log(data)
                console.log("form data", formData)
                setToast((data as any).message )
            }
        }
        catch (error) {
            console.log("login error form catch error", error)
        }
    };


    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setRegisterErrors({});

            const validationErrors = handleRegistrationValidation(registerData);
            setRegisterErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0 && !isPending) {
                registerUser(registerData, {
                    onSuccess:(data)=>{
                        setToast(data.message)
                    }
                });
                console.log("registerUser", registerData)
            }
        }
        catch (error) {
            console.log("login error form catch error", error)
        }
    };


    if(isError){
        console.log("login error", error)
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            {toast && <CustomAlert onClose={()=> setToast(null)} message={toast} type="success" />}

            {!isPending && isError && <ErrorComponent
                message={(error as any)?.response?.data?.message || error?.message || "Something went wrong"}
                onClick={() => reset()} />}

            {!registerPending && registerIsError && <ErrorComponent
                message={(registerError as any)?.response?.data?.message || registerError?.message || "Something went wrong"}
                onClick={() => registerReset()} />}

            {!showRegistrationForm ? <div className="w-full max-w-lg rounded-2xl p-1 shadow-lg">
                <div className="bg-white rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Login to Your Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                autoFocus
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[50%] cursor-pointer text-gray-500"
                            >
                                {showPassword ?
                                    <i className="fa-solid fa-lock h-5 w-5"></i> :
                                    <i className="fa-solid fa-unlock h-5 w-5"></i>
                                }
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* <div className="flex justify-between text-sm text-gray-600">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" /> Remember me
                            </label>
                            <Link to="#" className="text-blue-500 hover:underline">Forgot password?</Link>
                        </div> */}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-[80%] cursor-pointer block mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        >
                            {isPending ? <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full mx-auto"></div> : "Login"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don’t have an account?{" "}
                        <Link to="#" onClick={() => setShowRegistrationForm(true)} className="text-blue-500 hover:underline">Register</Link>
                    </p>
                </div>
            </div>
                :
                <div className="w-full max-w-lg rounded-2xl p-1 shadow-lg">
                    <div className="bg-white rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            Register Your Account
                        </h2>
                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                autoFocus
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {registerErrors.email && <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>}
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[50%] cursor-pointer text-gray-500"
                                >
                                    {showPassword ?
                                        <i className="fa-solid fa-lock h-5 w-5"></i> :
                                        <i className="fa-solid fa-unlock h-5 w-5"></i>
                                    }
                                </div>
                                {registerErrors.password && <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    value={registerData.userName}
                                    onChange={handleRegisterChange}
                                    placeholder="Arun Kumar"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {registerErrors?.userName && <p className="text-red-500 text-sm mt-1">{registerErrors?.userName}</p>}
                            </div>

                             <div>
                                <label htmlFor="phoneNo" className="block mb-1 text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNo"
                                    name="phoneNo"
                                    type="tel"
                                    value={registerData.phoneNo}
                                    onChange={handleRegisterChange}
                                    placeholder="9867453456"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {registerErrors?.phoneNo && <p className="text-red-500 text-sm mt-1">{registerErrors?.phoneNo}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={registerPending}
                                className="w-[80%] block cursor-pointer mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                            >
                                {registerPending ? <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full mx-auto"></div> : "Register"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already a user?{" "}
                            <Link to="#" onClick={() => setShowRegistrationForm(false)} className="text-blue-500 hover:underline">Login</Link>
                        </p>
                    </div>
                </div>}
        </div>
    );
};

export default LoginPage;
