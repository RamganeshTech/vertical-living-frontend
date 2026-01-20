import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../../utils/toast';
import { useVerifyToolIssue, useVerifyToolReturn } from '../../../apiList/tools_api/toolOtpApi';
import { Breadcrumb, type BreadcrumbItem } from '../../Department Pages/Breadcrumb';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';

const ToolOtpVerifyMain = () => {
    const { organizationId } = useParams() as { organizationId: string };
    const navigate = useNavigate();

    // --- MODE STATE ---
    // User can toggle between 'issue' (Handover) and 'return' (Collection)
    const [mode, setMode] = useState<'issue' | 'return'>('issue');


    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.toolhardware?.list;
    const canCreate = role === "owner" || permission?.toolhardware?.create;
    const canEdit = role === "owner" || permission?.toolhardware?.edit;
    // const canDelete = role === "owner" || permission?.toolhardware?.delete;


    // --- API HOOKS ---
    const verifyIssueMutation = useVerifyToolIssue();
    const verifyReturnMutation = useVerifyToolReturn();

    // Determine active mutation based on mode
    const activeMutation = mode === 'issue' ? verifyIssueMutation : verifyReturnMutation;

    // --- OTP STATE ---
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


    const paths: BreadcrumbItem[] = [
        { label: "Tools & Hardware", path: `/organizations/${organizationId}/projects/toolhub` },
        { label: "Handover Hub", path: `/organizations/${organizationId}/projects/enterotp` },
    ];

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast({ title: "Incomplete OTP", description: "Please enter all 6 digits", variant: "destructive" });
            return;
        }

        try {
            await activeMutation.mutateAsync({
                otp: otpString,
                organizationId
            });

            toast({
                title: mode === 'issue' ? "Handover Verified" : "Return Verified",
                description: mode === 'issue'
                    ? "Tool assigned to worker successfully."
                    : "Tool returned to store registry successfully."
            });
            navigate(-1);
        } catch (error: any) {
            toast({
                title: "Verification Failed",
                description: error?.response?.data?.message || "Invalid or Expired OTP",
                variant: "destructive"
            });
        }
    };

    return (
        // <div className="min-h-full flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="flex flex-col h-full w-full bg-gray-50/50">

            {/* Mode Switcher */}
            {/* <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8">
                <button 
                    onClick={() => { setMode('issue'); setOtp(['','','','','','']); }}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${mode === 'issue' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Issue Tool
                </button>
                <button 
                    onClick={() => { setMode('return'); setOtp(['','','','','','']); }}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${mode === 'return' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Return Tool
                </button>
            </div> */}


            <header className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full animate-pulse ${mode === 'issue' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                            Verification Protocol
                        </h1>
                        {/* <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Finalize Asset Handover</p> */}
                        <Breadcrumb paths={paths} />

                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Internal Mode Switcher for Verification Only */}
                    <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button
                            onClick={() => { setMode('issue'); setOtp(['', '', '', '', '', '']); }}
                            className={`px-8 py-2.5 cursor-pointer rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'issue' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <i className="fas fa-user-shield"></i> ISSUE VERIFY
                        </button>
                        <button
                            onClick={() => { setMode('return'); setOtp(['', '', '', '', '', '']); }}
                            className={`px-8 py-2.5 cursor-pointer rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'return' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <i className="fas fa-undo-alt"></i> RETURN VERIFY
                        </button>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                    {/* Navigation back to Generation Route */}
                    <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                        <button
                            onClick={() => navigate('../issueotp')}
                            className="px-8 cursor-pointer py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-white"
                        >
                            <i className="fas fa-paper-plane text-blue-500"></i>
                            GENERATE OTP
                            <i className="fas fa-external-link-alt text-[10px] opacity-50"></i>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto mt-6 w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8 transition-all">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${mode === 'issue' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        <i className={`fas ${mode === 'issue' ? 'fa-user-shield' : 'fa-undo-alt'} text-2xl`}></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'issue' ? 'Verify Handover' : 'Verify Return'}
                    </h2>
                    <p className="text-gray-500 text-sm px-4">
                        {mode === 'issue'
                            ? "Enter the 6-digit code sent to the worker to confirm they received the tool."
                            : "Enter the 6-digit code sent to the worker to confirm they returned the tool."}
                    </p>
                </div>

                {/* OTP Input Fields */}
                <div className="flex justify-between gap-2 sm:gap-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl focus:ring-4 outline-none transition-all text-gray-700 ${mode === 'issue'
                                ? 'focus:border-blue-500 focus:ring-blue-100 border-gray-100'
                                : 'focus:border-orange-500 focus:ring-orange-100 border-gray-100'
                                }`}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
               {(canCreate || canEdit) && <div className="space-y-4 pt-4">
                    <Button
                        onClick={handleVerify}
                        disabled={activeMutation.isPending}
                        className={`w-full h-12 text-white rounded-xl font-bold shadow-lg transition-all ${mode === 'issue'
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                            }`}
                    >
                        {activeMutation.isPending ? (
                            <><i className="fas fa-spinner fa-spin mr-2"></i> Processing...</>
                        ) : (
                            mode === 'issue' ? 'Confirm Handover' : 'Confirm Collection'
                        )}
                    </Button>
                    <button onClick={() => navigate(-1)} className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium">
                        Cancel
                    </button>
                </div>}

                {/* Security/Condition Note */}
                <div className={`rounded-xl p-4 flex gap-3 border transition-colors ${mode === 'issue' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                    <i className="fas fa-info-circle mt-1"></i>
                    <p className="text-[11px] leading-tight">
                        {mode === 'issue'
                            ? "Handover verification moves responsibility of the asset to the worker."
                            : "Return verification inspects the tool condition and clears the worker's record."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ToolOtpVerifyMain;