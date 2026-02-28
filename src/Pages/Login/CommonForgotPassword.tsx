import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Import the new unified hook
// import { useForgotCommonPassword } from '../../apiList/userApi' 
import { Button } from '../../components/ui/Button'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { toast } from '../../utils/toast'
import { useForgotCommonPassword } from '../../apiList/commonAuthApi'

const CommonForgotPassword = () => {
    const navigate = useNavigate()
    const [emailInput, setEmailInput] = useState<string>("");

    // Single hook replaces staffPassword, CTOPassword, workerPassword, etc.
    const { mutateAsync: forgotPassword, isPending } = useForgotCommonPassword()

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailInput.trim()) {
            toast({ title: 'Error', variant: "destructive", description: 'Please enter your email address.' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            toast({ title: 'Error', variant: "destructive", description: 'Please enter a valid email address.' });
            return;
        }

        try {
            // Unified API handles finding the correct model (Owner/Staff/etc) via email
            const res = await forgotPassword({ email: emailInput });

            if (res.ok) {
                toast({ title: "Success", description: "Reset link sent successfully. Please check your inbox." });
            }
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Failed to process request. Please try again later.", 
                variant: "destructive" 
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10 relative">
            <div className="absolute top-4 left-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-md border border-gray-300 bg-white/70 backdrop-blur-md hover:bg-white transition-all">
                    <i className="fas fa-arrow-left text-gray-600"></i>
                </button>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border-0 overflow-hidden">
                    <div className="text-center p-8 pb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i className="fas fa-unlock-alt text-white text-2xl"></i>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                            Forgot Password
                        </h2>
                        <p className="text-blue-600 text-sm mt-2">
                            Enter your email to receive a recovery link
                        </p>
                    </div>

                    <div className="px-8 pb-8 space-y-6">
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-blue-800 font-medium">Your Email</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-envelope text-blue-400"></i>
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="Enter your Registered Mail Address"
                                        className="pl-10 border-2 border-blue-200 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                                isLoading={isPending}
                            >
                                <i className="fas fa-paper-plane mr-2"></i> Send Reset Link
                            </Button>
                        </form>

                        <div className="text-center pt-4 border-t border-blue-100">
                            <Link to="/login/common" className="text-sm text-blue-600 font-medium hover:underline">
                                <i className="fas fa-arrow-left mr-1"></i> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommonForgotPassword;