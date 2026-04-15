import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { toast } from '../../../utils/toast';
import { useAcceptAssignment, useGetPublicAssignment } from '../../../apiList/pincode_api/pincodeVendorProjectAssignmentApi';
import { COMPANY_DETAILS, NO_IMAGE } from '../../../constants/constants';

const PincodeVendorPublicAcknowledgement = () => {
    const { id } = useParams();
    const [isChecked, setIsChecked] = useState(false);

    const { data, isLoading, isError, refetch } = useGetPublicAssignment(id!);
    const acceptMutation = useAcceptAssignment();

    const handleAccept = async () => {
        if (!isChecked) return;
        try {
            await acceptMutation.mutateAsync({ id: id! });
            toast({ title: "Success", description: "Project Accepted Successfully" });
            refetch();
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <i className="fas fa-circle-notch fa-spin text-4xl text-indigo-600"></i>
                <p className="font-bold text-slate-600 animate-pulse">Fetching Agreement Details...</p>
            </div>
        </div>
    );

    if (isError || !data) return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
            <Card className="max-w-md p-10 rounded-[2rem] shadow-xl border-none space-y-4 bg-white">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto">
                    <i className="fas fa-link-slash"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Link Invalid</h2>
                <p className="text-slate-500">The assignment link you are trying to access is either expired or incorrect.</p>
            </Card>
        </div>
    );

    const isAlreadyAccepted = data.acknowledgeStatus === "accepted";

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-indigo-50/30 flex flex-col font-sans">
            {/* Branded Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 sticky top-0 z-40">
                <div className="w-full px-4 sm:px-8 lg:px-12 py-4">
                    <div className="flex items-center justify-between max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="flex-shrink-0">
                                <img
                                    src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
                                    alt="Logo"
                                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-indigo-400 shadow-md shadow-indigo-100"
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 truncate leading-tight">
                                    {COMPANY_DETAILS.COMPANY_NAME}
                                </h1>
                                <p className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest truncate">
                                    Project Acknowledgment Portal
                                </p>
                            </div>
                        </div>
                        {/* <div className="hidden sm:block">
                            <Badge variant="outline" className="bg-indigo-600 text-white border-none shadow-md px-4 py-1.5 font-bold">
                                Secure Digital Signature
                            </Badge>
                        </div> */}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex justify-center">
                <div className="w-full max-w-[1000px] space-y-6 sm:space-y-8">

                    <Card className="p-6 sm:p-10 rounded-[2.5rem] shadow-xl bg-white border-none ring-1 ring-indigo-50 space-y-8">
                        <div className="border-b border-slate-100 pb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">Legal Handshake Agreement</h2>
                                <p className="text-slate-500 text-sm mt-1">Formal engagement for project execution and services.</p>
                            </div>

                        </div>

                        {/* Responsive Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6 sm:p-8 rounded-[2rem] border border-indigo-100 shadow-inner">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Project Assignment</label>
                                <p className="text-lg sm:text-xl font-bold text-slate-800">{data.projectId?.projectName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Vendor Organization</label>
                                <p className="text-lg sm:text-xl font-bold text-slate-800">{data.vendorId?.companyName}</p>
                            </div>
                        </div>

                        {/* Terms Container */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">
                                    <i className="fas fa-file-contract"></i>
                                </div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Terms of Service & Schedule</label>
                            </div>
                            <div className="w-full p-6 bg-slate-900 rounded-[2rem] border-4 border-slate-800 font-mono text-[11px] sm:text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto text-indigo-50 shadow-2xl shadow-indigo-100/50">
                                {data.termsAndConditions}
                            </div>
                        </div>

                        {isAlreadyAccepted ? (
                            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-[2.5rem] text-center space-y-4 shadow-lg shadow-emerald-100">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto shadow-md">
                                    <i className="fas fa-check"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900">Project Accepted</h3>
                                    <p className="text-emerald-700 text-sm font-medium mt-1">This agreement was digitally signed and verified on</p>
                                    <div className="mt-4 inline-block bg-white px-6 py-2 rounded-full text-emerald-800 font-bold text-sm shadow-sm border border-emerald-100">
                                        {new Date(data.acknowledgedAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 pt-4 flex flex-col items-center">
                                <label className={`flex items-start gap-4 cursor-pointer group p-6 rounded-[2rem] transition-all border-2 w-full ${isChecked ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-indigo-100'}`}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                        className="w-6 h-6 mt-0.5 rounded-lg accent-indigo-600 cursor-pointer shadow-sm flex-shrink-0"
                                    />
                                    <span className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                                        I, authorized representative of <span className="text-indigo-700 underline">{data.vendorId?.companyName}</span>, confirm that I have read, understood, and accept the terms and conditions outlined above.
                                    </span>
                                </label>

                                <Button
                                    onClick={handleAccept}
                                    disabled={!isChecked || acceptMutation.isPending}
                                    className={`w-full sm:w-80 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base transition-all transform active:scale-[0.98] shadow-xl
                                        ${isChecked
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    {acceptMutation.isPending ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <i className="fas fa-circle-notch fa-spin"></i>
                                            <span>SIGNING...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            {/* <i className="fas fa-signature"></i> */}
                                            <span>I Accept the  Terms and Conditions</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </main>

            <footer className="py-8 text-center border-t border-indigo-100 bg-white/50 backdrop-blur">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}
                </p>
            </footer>
        </div>
    );
};

export default PincodeVendorPublicAcknowledgement;