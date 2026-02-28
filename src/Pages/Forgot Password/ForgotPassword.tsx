import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStaffforgotPasswordUser } from '../../apiList/staffApi'
import { useforgotPasswordUser } from '../../apiList/userApi'
import { useWorkerforgotPasswordUser } from '../../apiList/workerApi'
import { useClientforgotPasswordUser } from '../../apiList/clientApi'
import { useCTOforgotPasswordUser } from '../../apiList/CTOApi'
import { Button } from '../../components/ui/Button'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { toast } from '../../utils/toast'


const ForgotPassword = () => {

    let navigate = useNavigate()
    const { role } = useParams()

    const { mutateAsync: staffPassword, isPending: staffPending } = useStaffforgotPasswordUser()
    const { mutateAsync: CTOPassword, isPending: CTOPending } = useCTOforgotPasswordUser()
    const { mutateAsync: clientPassword, isPending: clientPending } = useClientforgotPasswordUser()
    const { mutateAsync: workerPassword, isPending: workerPending } = useWorkerforgotPasswordUser()
    const { mutateAsync: userPassword, isPending: userPending } = useforgotPasswordUser() //"owner"


    const [emailInput, setEmailInput] = useState<string>("");




    const handleLoading = () => {
        return staffPending ||
            CTOPending ||
            clientPending ||
            workerPending ||
            userPending
    }

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailInput.trim()) {
            toast({ title: 'Error', variant:"destructive", description: 'Please enter your email address.' });
            return;
        }

        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput)) {
                toast({ title: 'Error', variant:"destructive", description: 'Please enter a valid email address.' });
                return;
            }

            const payload = { email: emailInput };

            switch (role) {
                case 'staff':
                    await staffPassword(payload);
                    break;
                case 'CTO':
                    await CTOPassword(payload);
                    break;
                case 'client':
                    await clientPassword(payload);
                    break;
                case 'worker':
                    await workerPassword(payload);
                    break;
                case 'owner':
                    await userPassword(payload);
                    break;
                default:
                    throw new Error('Invalid user role.');
            }



            toast({ title: "Success", description: "email notification sent succesffuly" })
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "please try again later" , variant:"destructive"})

        }

    };



    // Handle reset password logic here



    // return (
    //     <div className={`${style.container}`}>




    //         <div className={`${style.card}`}>
    //             {/* <h1 className={`${style.title}`}>BMB Fashion</h1> */}
    //             <h2 className={`${style.subtitle}`}>Forgot Password</h2>
    //             <p className={`${style.description}`}>
    //                 we'll send you a link to reset your password to this email.
    //             </p>
    //             <form onSubmit={handleForgotPasswordSubmit}>
    //                 <div className={`${style.inputGroup}`}>
    //                     <Label htmlFor="email" >Your Email</Label>
    //                     <Input type="email" id="email" placeholder="arun@gmail.com" value={emailInput} 

    //                      onChange={(e) => setEmailInput(e.target.value)}
    //                     />
    //                 </div>
    //                 {/* <Button variant='contained' type="submit" className={`${style.button}`}>Send Reset Link</Button> */}
    //                 <Button variant='primary' isLoading={emailLoading} type="submit" className={`${style.button}`}>
    //                     Send Reset Link
    //                 </Button>
    //             </form>
    //             <div className={`${style.backToLogin}`}>
    //                 <Link to="/login" className={`${style.link}`}>Back to Login</Link>
    //             </div>
    //         </div>

    //     </div>
    // )


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10 relative">
            {/* Optional Mobile Menu Icon */}
            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-md border border-gray-300 bg-white/70 backdrop-blur-md hover:bg-white"
                    title="Back"
                >
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
                            We'll send you a link to reset your password
                        </p>
                    </div>

                    <div className="px-8 pb-8 space-y-6">
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-blue-800 font-medium">
                                    Your Email
                                </Label>
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                isLoading={handleLoading()}
                            >

                                <>
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    Send Reset Link
                                </>
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="text-center pt-4 border-t border-blue-100">
                            <Link to="/login" className="text-sm text-blue-600 font-medium hover:underline">
                                <i className="fas fa-arrow-left mr-1"></i>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ForgotPassword