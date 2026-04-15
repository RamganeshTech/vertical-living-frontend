import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAcceptClientConsent } from "../../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { COMPANY_DETAILS } from "../../../../constants/constants";

const PublicClientConsentForm: React.FC = () => {
    const { projectId, token } = useParams<{ projectId: string; token: string }>();

    const [content, setContent] = useState<string>("");
    const [isAccepted, setIsAccepted] = useState(false);
    const [loading, setLoading] = useState(true);

    const { mutateAsync: acceptConsent, isPending, isError, error: getAllError } = useAcceptClientConsent();




    const fetchConsentContent = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/paymentconfirmation/getconsentcontent/${projectId}/${token}`
            );
            setContent(data?.data || "");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Unable to fetch consent form.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!projectId || !token) return;
        try {
            await acceptConsent({ projectId, token });
            toast({
                title: "Thank you!",
                description: "Your consent has been submitted successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Submission failed.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchConsentContent();
    }, []);


    return (
        // <div className=" w-full min-h-screen flex flex-col items-center bg-gray-50 pb-10 ">
        <div className="w-full min-h-screen flex flex-col items-center bg-brand-main pb-10">
            {/* Header */}
            {/* <header className="w-full max-w-full mx-auto border-b border-gray-200 bg-white px-4 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"> */}
            <header className="w-full max-w-full mx-auto border-b border-ash-medium bg-brand-surface px-6 py-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
                {/* <div className="flex items-center gap-4 flex-wrap justify-start border-black md:justify-start text-center md:text-left"> */}
                <div className="flex items-center gap-4 flex-wrap justify-start text-center md:text-left">
                    <img
                        src={COMPANY_DETAILS.COMPANY_LOGO}
                        alt="Company Logo"
                        // className="h-14 w-14 rounded-md object-cover   border-gray-300"
                        className="h-12 w-12 rounded-lg object-cover border border-ash-light shadow-sm bg-brand-ash"
                    />
                    {/* <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-700 leading-tight">
                            {COMPANY_DETAILS.COMPANY_NAME}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium">
                            Secure Payment Consent Form
                        </p>
                    </div>
                     */}

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-text-main leading-tight">
                            {COMPANY_DETAILS.COMPANY_NAME}
                        </h1>
                        <p className="text-[11px] sm:text-xs text-text-muted font-bold tracking-wider uppercase mt-1">
                            Secure Payment Consent Form
                        </p>
                    </div>
                </div>

            </header>


            {/* {isError && <div className="min-w-md my-4 mx-auto p-4 bg-slate-50 border border-slate-200 rounded-lg shadow text-center mb-6">
                <div className="text-slate-600 font-semibold mb-2">
                    ⚠️ Error Occured
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    {(getAllError as any)?.response?.data?.message ||
                        (getAllError as any)?.message ||
                        "Failed to load cost estimation data"}
                </p>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2"
                >
                    Retry
                </Button>
            </div>
            } */}


            {isError && (
                <div className="w-full max-w-md my-4 mx-auto p-6 bg-brand-surface border border-action-danger rounded-xl shadow-sm text-center mb-6">
                    <div className="text-action-danger text-2xl mb-3">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div className="text-text-main text-lg font-bold mb-2">
                        Error Occurred
                    </div>
                    <p className="text-text-muted text-sm mb-5">
                        {(getAllError as any)?.response?.data?.message ||
                            (getAllError as any)?.message ||
                            "Failed to load consent form data"}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="border-ash-medium text-text-main hover:text-action-danger hover:border-action-danger hover:bg-brand-ash transition-all"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Consent Content */}
            {!isError && <><div className="w-full bg-white p-4 max-w-3xl rounded-lg overflow-hidden">
                {/* <div className="p-5 bg-white max-h-[500px] rounded-md border-2 border-[#4e51543a] custom-scrollbar  overflow-y-auto "> */}
                {/* <div className="w-full bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden flex flex-col">
                    {loading ? (
                        <p className="text-gray-600">Loading form content...</p>
                    ) : content ? (
                        <div
                            className="prose prose-sm sm:prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <p className="text-slate-500 text-sm">Content not found.</p>
                    )}
                </div> */}

                <div className="p-6 sm:p-8 bg-brand-ash border-b border-ash-light max-h-[60vh] custom-scrollbar overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-text-muted mb-4"></i>
                            <p className="text-text-muted font-bold text-sm uppercase tracking-wider">Loading document...</p>
                        </div>
                    ) : content ? (
                        <div
                            className="prose prose-sm sm:prose max-w-none text-text-main prose-headings:text-text-main prose-a:text-text-main"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <i className="fa-regular fa-file-lines text-4xl text-text-muted mb-4"></i>
                            <p className="text-text-muted text-sm font-medium">Content not found.</p>
                        </div>
                    )}
                </div>


                {/* Checkbox + Submit */}
                {/* <div className="px-5 py-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> */}
                <div className="px-6 py-5 bg-brand-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    {/* <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            onChange={(e) => setIsAccepted(e.target.checked)}
                            checked={isAccepted}
                            className="mt-1 w-4 h-4 accent-blue-600"
                        />
                        I confirm that I have read, understood, and accept the above terms.
                    </label> */}

                    <label className="flex items-start gap-3 text-sm font-medium text-text-main cursor-pointer select-none group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                            <input
                                type="checkbox"
                                onChange={(e) => setIsAccepted(e.target.checked)}
                                checked={isAccepted}
                                className="peer appearance-none w-5 h-5 border-2 border-ash-medium bg-brand-surface rounded-[4px] checked:bg-text-main checked:border-text-main transition-all cursor-pointer"
                            />
                            <i className="fa-solid fa-check absolute text-brand-surface text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                        </div>
                        <span className="group-hover:text-text-muted transition-colors leading-snug pt-0.5">
                            I confirm that I have read, understood, and accept the above terms.
                        </span>
                    </label>

                    <Button
                        disabled={!isAccepted}
                        isLoading={isPending}
                        onClick={handleSubmit}
                        // className={`px-6 py-2 text-white ${!isAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        variant="dark"
                        className={`px-6 py-2.5 shrink-0 transition-all ${!isAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 shadow-sm'}`}
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Submit Consent
                    </Button>
                </div>
            </div>

                {/* Footer */}
                {/* <footer className="mt-10 w-full text-center text-sm text-gray-500 border-t border-black/70 px-4">
                <div className="mb-1 font-medium text-gray-600">
                    &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}
                </div>
                <div className="text-xs">All rights reserved. For queries, contact our team.</div>
            </footer> */}


                <footer className="mt-10 w-full text-center pb-4">
                    <div className="mb-1 text-sm font-bold text-text-main">
                        &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}
                    </div>
                    <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
                        All rights reserved. For queries, contact our team.
                    </div>
                </footer>
            </>}
        </div>
    );
};

export default PublicClientConsentForm;
