import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// Import the new unified hook
// import { useResetCommonPassword } from '../../apiList/userApi' 
import { Button } from '../../components/ui/Button'
import { Label } from '../../components/ui/Label'
import { Input } from '../../components/ui/Input'
import { toast } from '../../utils/toast'
import { useResetCommonPassword } from '../../apiList/commonAuthApi'

const CommonResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const tokenValue = searchParams.get("token")

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Unified hook replaces all role-specific reset hooks
    const { mutateAsync: resetPassword, isPending } = useResetCommonPassword()

    // Escape key listener for better UX (optional)
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if(e.key === "Escape") navigate('/login') };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({ title: "Error", variant: "destructive", description: "Both fields are required." });
            return;
        }

        if (password !== confirmPassword) {
            toast({ title: "Error", variant: "destructive", description: "Passwords do not match." });
            return;
        }

        if (!tokenValue) {
            toast({ title: "Error", variant: "destructive", description: "Invalid or expired reset token." });
            return;
        }

        try {
            // Unified API identifies the user model via the unique token
            const res = await resetPassword({ token: tokenValue, password });

            if (res.ok) {
                toast({ title: "Success", description: "Password updated successfully. You can now login." });
                navigate("/login");
            }
        } catch (err: any) {
            toast({ 
                title: "Reset Failed", 
                description: err?.message || "Something went wrong.", 
                variant: "destructive" 
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-lock-open text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
                    <p className="text-gray-500 text-sm">Please choose a strong password</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label className="mb-1.5 block text-sm font-semibold text-gray-700">New Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1.5 block text-sm font-semibold text-gray-700">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                <Button 
                    isLoading={isPending} 
                    type="submit" 
                    className="w-full mt-8 bg-blue-600 text-white hover:bg-blue-700 py-6 rounded-xl font-bold"
                >
                    Update Password
                </Button>
            </form>
        </div>
    );
}

export default CommonResetPassword;