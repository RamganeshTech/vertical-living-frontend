// import React, { useState, useEffect } from "react";
// import { useSearchParams, useParams } from "react-router-dom";

// import axios from "axios";
// import { useAcceptClientConsent, useGetPaymentConfirmation } from "../../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
// import { toast } from "../../../../utils/toast";
// import { Button } from "../../../../components/ui/Button";
// import { COMPANY_DETAILS } from "../../../../constants/constants";

// const PublicClientConsentForm: React.FC = () => {
//     const { projectId, token } = useParams<{ projectId: string; token: string }>();
//     // const [searchParams] = useSearchParams();
//     // const clientId = searchParams.get("clientId");

//     const [content, setContent] = useState<string>("");
//     const [isAccepted, setIsAccepted] = useState(false);
//     const [loading, setLoading] = useState(true);

//     const { mutateAsync: acceptConsent, isPending } = useAcceptClientConsent();
//     //  const {
//     //     data,
//     //     isLoading,
//     //     isError: getAllError,
//     //     refetch,
//     //   } = useGetPaymentConfirmation(projectId!);

//     //   const {paymentClientConsent} = data
//     const fetchConsentContent = async () => {
//         try {
//             const { data } = await axios.get(
//                 `${import.meta.env.VITE_API_URL}/api/paymentconfirmation/getpaymentconfirmation/${projectId}`
//             );

//             console.log("dataajfhlshalsadh", data)
//             setContent(data?.data?.paymentClientConsent?.content || "");
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || "Unable to fetch consent form.",
//                 variant: "destructive",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         if (!projectId || !token) return;
//         console.log(isAccepted, "isacepted staget")
//         try {
//             await acceptConsent({ projectId, token });
//             toast({
//                 title: "Thank you!",
//                 description: "Your consent has been submitted successfully.",
//             });
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || "Submission failed.",
//                 variant: "destructive",
//             });
//         }
//     };

//     useEffect(() => {
//         fetchConsentContent();
//     }, []);

//     return (
//         <div className="min-h-screen flex flex-col items-center bg-gray-50  pb-10 py-0">
//             {/* Header with logo & name */}
//             <header className="w-full border-b p-4 bg-white border-black/70 max-w-full mb-6 flex flex-col sm:flex-row 
//             items-center sm:justify-between sm:text-left text-center">
//                 <div className="flex items-center gap-3 mb-4 sm:mb-0">
//                     <img
//                         src={COMPANY_DETAILS.COMPANY_LOGO}
//                         alt="Company Logo"
//                         className="h-12 w-12 rounded-full shadow-lg object-contain"
//                     />
//                     <div>
//                         <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">{COMPANY_DETAILS.COMPANY_NAME}</h1>
//                         <p className="text-sm text-gray-500">
//                             Payment Consent Form
//                         </p>
//                     </div>
//                 </div>
//             </header>

//             {/* Consent Content */}
//             <div className="w-full max-w-3xl bg-white rounded-lg border shadow-md overflow-hidden">
//                 <div className="p-5 max-h-[500px] custom-scrollbar overflow-y-auto border-b">
//                     {loading ? (
//                         <p className="text-gray-600">Loading form content...</p>
//                     ) : content ? (
//                         <div
//                             className="prose prose-sm sm:prose max-w-none"
//                             dangerouslySetInnerHTML={{ __html: content }}
//                         />
//                     ) : (
//                         <p className="text-red-500 text-sm">Content not found.</p>
//                     )}
//                 </div>

//                 {/* Checkbox + Submit */}
//                 <div className="px-5 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer select-none">
//                         <input
//                             type="checkbox"
//                             onChange={(e) => setIsAccepted(e.target.checked)}
//                             checked={isAccepted}
//                             className="mt-1 w-4 h-4 accent-blue-600"
//                         />
//                         I confirm that I have read, understood, and accept the above terms.
//                     </label>

//                     <Button
//                         disabled={!isAccepted}
//                         isLoading={isPending}
//                         onClick={handleSubmit}
//                         className={`px-6 py-2 text-white ${!isAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
//                     >
//                         <i className="fa-solid fa-circle-check mr-2"></i>
//                         Submit Consent
//                     </Button>
//                 </div>
//             </div>


//             {/* Footer */}
//             <footer className="mt-10 w-full text-center text-sm text-gray-500 border-t border-black/70">
//                 <div className="mb-1 font-medium text-gray-600">
//                     &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}
//                 </div>
//                 <div className="text-xs">
//                     All rights reserved. For queries, contact our team.
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default PublicClientConsentForm;




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAcceptClientConsent } from "../../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { COMPANY_DETAILS } from "../../../../constants/constants";
import MaterialOverviewLoading from "../../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

const PublicClientConsentForm: React.FC = () => {
    const { projectId, token } = useParams<{ projectId: string; token: string }>();

    const [content, setContent] = useState<string>("");
    const [isAccepted, setIsAccepted] = useState(false);
    const [loading, setLoading] = useState(true);

    const { mutateAsync: acceptConsent, isPending, isError, error:getAllError } = useAcceptClientConsent();


    if (isError) return  <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
              <div className="text-red-600 font-semibold mb-2">
                ⚠️ Error Occurred
              </div>
              <p className="text-red-500 text-sm mb-4">
                {(getAllError as any)?.response?.data?.message || 
                 (getAllError as any)?.message || 
                 "Failed to load cost estimation data"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2"
              >
                Retry
              </Button>
            </div> 

    const fetchConsentContent = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/paymentconfirmation/getpaymentconfirmation/${projectId}`
            );
            setContent(data?.data?.paymentClientConsent?.content || "");
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
        <div className="min-h-screen flex flex-col items-center bg-gray-50 pb-10 ">
            {/* Header */}
            <header className="w-full max-w-full mx-auto border-b border-gray-200 bg-white px-4 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap justify-start border-black md:justify-start text-center md:text-left">
                    <img
                        src={COMPANY_DETAILS.COMPANY_LOGO}
                        alt="Company Logo"
                        className="h-14 w-14 rounded-md object-cover   border-gray-300"
                    />
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-700 leading-tight">
                            {COMPANY_DETAILS.COMPANY_NAME}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium">
                            Secure Payment Consent Form
                        </p>
                    </div>
                </div>

            </header>


            {/* Consent Content */}
            <div className="w-full bg-white p-4 max-w-3xl rounded-lg overflow-hidden">
                <div className="p-5 bg-white max-h-[500px] rounded-md border-2 border-[#4e51543a] custom-scrollbar  overflow-y-auto ">
                    {loading ? (
                        <p className="text-gray-600">Loading form content...</p>
                    ) : content ? (
                        <div
                            className="prose prose-sm sm:prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <p className="text-red-500 text-sm">Content not found.</p>
                    )}
                </div>

                {/* Checkbox + Submit */}
                <div className="px-5 py-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            onChange={(e) => setIsAccepted(e.target.checked)}
                            checked={isAccepted}
                            className="mt-1 w-4 h-4 accent-blue-600"
                        />
                        I confirm that I have read, understood, and accept the above terms.
                    </label>

                    <Button
                        disabled={!isAccepted}
                        isLoading={isPending}
                        onClick={handleSubmit}
                        className={`px-6 py-2 text-white ${!isAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Submit Consent
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-10 w-full text-center text-sm text-gray-500 border-t border-black/70 px-4">
                <div className="mb-1 font-medium text-gray-600">
                    &copy; {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}
                </div>
                <div className="text-xs">All rights reserved. For queries, contact our team.</div>
            </footer>
        </div>
    );
};

export default PublicClientConsentForm;
