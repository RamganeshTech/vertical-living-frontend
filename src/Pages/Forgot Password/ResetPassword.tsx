import React, { useState } from 'react'
import { useResetPasswordUser } from '../../apiList/userApi'
import { useWorkerResetPasswordUser } from '../../apiList/workerApi'
import { useClientResetPasswordUser } from '../../apiList/clientApi'
import { useCTOResetPasswordUser } from '../../apiList/CTOApi'
import { useStaffResetPasswordUser } from '../../apiList/staffApi'
import { useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { toast } from '../../utils/toast'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()

    const { role } = useParams()

    const { mutateAsync: staffPassword, isPending: staffPending } = useStaffResetPasswordUser()
    const { mutateAsync: CTOPassword, isPending: CTOPending } = useCTOResetPasswordUser()
    const { mutateAsync: clientPassword, isPending: clientPending } = useClientResetPasswordUser()
    const { mutateAsync: workerPassword, isPending: workerPending } = useWorkerResetPasswordUser()
    const { mutateAsync: userPassword, isPending: userPending } = useResetPasswordUser()



    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const tokenValue = searchParams.get("token")

     const handleLoading = () => {
            return staffPending ||
                CTOPending ||
                clientPending ||
                workerPending ||
                userPending
        }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({ title: "Error", variant:"destructive", description: "Both fields are required." });
            return;
        }

        if (password !== confirmPassword) {
            toast({ title: "Error", variant:"destructive", description: "Passwords do not match." });
            return;
        }

        if (!tokenValue || !role) {
            toast({ title: "Error", variant:"destructive", description: "Invalid reset link." });
            return;
        }

        const body = { password, token: tokenValue };

       

        try {
            switch (role) {
                case "client":
                    await clientPassword(body);
                    break;
                case "CTO":
                    await CTOPassword(body);
                    break;
                case "worker":
                    await workerPassword(body);
                    break;
                case "staff":
                    await staffPassword(body);
                    break;
                case "owner":
                    await userPassword(body);
                    break;
                default:
                    toast({ title: "Error", description: "Unknown role type.", variant:"destructive" });
                    return;
            }

            toast({ title: "Success", description: "Password reset successfully." });
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || "Something went wrong." , variant:"destructive"});
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Reset Your Password</h2>

                <div className="mb-4">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">New Password</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <i className='fas fa-eye-slash text-blue-400 hover:text-blue-600 transition-colors'></i> : <i className='fas fa-eye text-blue-400 hover:text-blue-600 transition-colors'></i>}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <Label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
                            onClick={() => setShowConfirm((prev) => !prev)}
                        >


                         
                            {showConfirm ? <i className='fas fa-eye-slash text-blue-400 hover:text-blue-600 transition-colors'></i> : <i className='fas fa-eye text-blue-400 hover:text-blue-600 transition-colors'></i>}
                        </span>
                    </div>
                </div>

                <Button isLoading={handleLoading()} type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Reset Password
                </Button>
            </form>
        </div>
    );
}

export default ResetPassword