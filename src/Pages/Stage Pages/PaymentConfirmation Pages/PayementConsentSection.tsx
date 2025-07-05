// import React from "react";
// import { useParams } from "react-router-dom";
// import {
//     useGetPaymentConfirmation,
//     useToggleConsentRequired,
//     useGenerateConsentLink,
//     useSetPaymentConfirmationDeadline,
//     useCompletePaymentConfirmation,
// } from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";
// import { toast } from "../../../utils/toast";
// import { Card } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";
// import { ResetStageButton } from "../../../shared/ResetStageButton";
// import AssignStageStaff from "../../../shared/AssignStaff";
// import StageTimerInfo from "../../../shared/StagetimerInfo";



// const PaymentConsentSection: React.FC = () => {
//     const { projectId } = useParams<{ projectId: string }>();

//     // Stage data
//     const { data: confirmationData, isLoading, isError, refetch } = useGetPaymentConfirmation(projectId!);

//     // Hooks
//     const toggleConsent = useToggleConsentRequired();
//     const generateConsentLink = useGenerateConsentLink();

//     // WhatsApp sharer
//     const shareOnWhatsApp = (link: string) => {
//         const message = `Please review the payment consent terms and approve:\n\n${link}`;
//         const encoded = encodeURIComponent(message);
//         window.open(`https://wa.me/?text=${encoded}`, "_blank");
//     };

//     // Toggle consent requirement
//     const handleToggleConsent = () => {
//         if (!projectId) return;

//         toggleConsent.mutate(
//             { projectId },
//             {
//                 onSuccess: () =>
//                     toast({
//                         title: "Success",
//                         description: "Consent requirement updated successfully.",
//                     }),
//                 onError: (error: any) =>
//                     toast({
//                         title: "Error",
//                         description:
//                             error?.response?.data?.message || error.message || "Failed to update consent requirement.",
//                         variant: "destructive",
//                     }),
//             }
//         );
//     };

//     // Generate & share consent link
//     const handleGenerateLink = () => {
//         if (!projectId) return;

//         generateConsentLink.mutate(
//             { projectId },
//             {
//                 onSuccess: (link) => {
//                     toast({
//                         title: "Success",
//                         description: "Consent link generated successfully.",
//                     });
//                     shareOnWhatsApp(link);
//                 },
//                 onError: (error: any) =>
//                     toast({
//                         title: "Error",
//                         description:
//                             error?.response?.data?.message || error.message || "Failed to generate consent link.",
//                         variant: "destructive",
//                     }),
//             }
//         );
//     };

//     if (isLoading) return <p>Loading Payment Confirmation...</p>;
//     if (isError || !confirmationData) return <p>Error fetching payment confirmation</p>;

//     const { paymentClientConsent : {content, agreedByClientId , agreedAt}, isConsentRequired, } = confirmationData;

//     return (
//         <div className="space-y-4 w-full h-full overflow-y-auto">

//             <div className='w-full flex justify-between'>
//                 <div className="flex justify-between w-full mb-3">
//                     <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
//                         <i className="fa-solid fa-form mr-2"></i> Client Consent
//                     </h2>
//                 </div>
//             </div>

//             <Card className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Payment Consent</h2>

//                 <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-700 font-medium">Is Consent Required?</span>
//                     <button
//                         onClick={handleToggleConsent}
//                         className={`px-4 py-2 rounded text-white text-sm ${isConsentRequired ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
//                             }`}
//                     >
//                         {isConsentRequired ? "Make Consent Optional" : "Make Consent Required"}
//                     </button>
//                 </div>

//                 {paymentClientConsent?.agreedAt ? (
//                     <div className="border p-3 rounded bg-green-50 text-green-800 text-sm">
//                         ✅ Client accepted on{" "}
//                         <strong>{new Date(paymentClientConsent.agreedAt).toLocaleString()}</strong> <br />
//                         By: {paymentClientConsent.agreedByName} ({paymentClientConsent.agreedByEmail || "N/A"})
//                     </div>
//                 ) : (
//                     isConsentRequired && (
//                         <div className="mt-3">
//                             <p className="text-sm mb-2 text-gray-600">Client has not yet approved. Generate and send the consent link:</p>
//                             <button
//                                 onClick={handleGenerateLink}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//                                 disabled={generateConsentLink.isPending}
//                             >
//                                 {generateConsentLink.isPending ? "Generating..." : "Generate & Share Link via WhatsApp"}
//                             </button>
//                         </div>
//                     )
//                 )}
//             </Card>
//         </div>
//     );
// };

// export default PaymentConsentSection;


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    useGetPaymentConfirmation,
    useToggleConsentRequired,
    useGenerateConsentLink,
} from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";

import { toast } from "../../../utils/toast";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
// import { Clipboard, Share2 } from 'lucide-react';

// const PaymentConsentSection: React.FC = () => {
//     const { projectId } = useParams<{ projectId: string }>();

//     // 🔽 Get payment confirmation data
//     const {
//         data: confirmationData,
//         isLoading,
//         isError,
//         refetch,
//     } = useGetPaymentConfirmation(projectId!);

//     // 🔁 Mutations
//     const toggleConsent = useToggleConsentRequired();
//     const generateConsentLink = useGenerateConsentLink();

//     // 📦 State
//     const [generatedLink, setGeneratedLink] = useState<string | null>(null);

//     const shareOnWhatsApp = (link: string) => {
//         const message = `Please review the payment consent terms and approve:\n\n${link}`;
//         const encoded = encodeURIComponent(message);
//         window.open(`https://wa.me/?text=${encoded}`, "_blank");
//     };

//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText(text);
//         toast({
//             title: "Copied",
//             description: "Link copied to clipboard.",
//         });
//     };

//     const handleToggleConsent = async () => {
//         try {
//             await toggleConsent.mutateAsync({ projectId: projectId! });
//             toast({ title: "Success", description: "Consent requirement updated." });
//             refetch();
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || error.message || "Failed to toggle consent.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleGenerateLink = async () => {
//         try {
//             const link = await generateConsentLink.mutateAsync({ projectId: projectId! });
//             setGeneratedLink(link);

//             toast({
//                 title: "Success",
//                 description: "Link generated successfully.",
//             });
//         } catch (error: any) {
//             toast({
//                 title: "Error",
//                 description: error?.response?.data?.message || error.message || "Failed to generate link.",
//                 variant: "destructive",
//             });
//         }
//     };

//     if (isLoading) return <p>Loading consent data...</p>;
//     if (isError || !confirmationData) return <p>Error loading data.</p>;

//     const {
//         isConsentRequired,
//         paymentClientConsent: {
//             agreedAt,
//             agreedByClientId,
//             agreementToken
//         }
//     } = confirmationData;

//     return (
//         <div className="space-y-5 px-4 py-6 max-w-4xl mx-auto">

//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <h2 className="text-3xl font-bold text-blue-700 flex items-center">
//                     📝 Payment Consent
//                 </h2>

//                 <Button
//                     onClick={handleToggleConsent}
//                     className={`text-white ${isConsentRequired ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
//                 >
//                     {isConsentRequired ? "Make Consent Optional" : "Require Client Consent"}
//                 </Button>
//             </div>

//             {/* Consent Status */}
//             <Card className="bg-blue-50 border-l-4 border-blue-700 shadow-sm p-4">
//                 <h3 className="text-blue-800 font-semibold text-lg mb-2">Consent Status</h3>

//                 {agreedAt ? (
//                     <div className="text-green-800 bg-green-50 border border-green-200 rounded p-3 text-sm">
//                         ✅ Client has <strong>agreed</strong> to the terms.
//                         <br />
//                         <strong>Client ID:</strong> {agreedByClientId ?? "N/A"}
//                         <br />
//                         <strong>Agreed At:</strong> {new Date(agreedAt).toLocaleString()}
//                     </div>
//                 ) : agreementToken ? (
//                     <div className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
//                         ⏳ Awaiting client confirmation...
//                         <br />
//                         Link already generated below.
//                     </div>
//                 ) : (
//                     <div className="text-gray-700 text-sm">
//                         ❌ Consent not yet given and no link generated.
//                     </div>
//                 )}
//             </Card>

//             {/* Generate Link */}
//             {isConsentRequired && !agreedAt && (
//                 <Card className="p-4 bg-white border shadow-sm">
//                     <h3 className="font-semibold text-blue-700 mb-3 text-lg">Generate Consent Link</h3>

//                     {!agreementToken && !generatedLink && (
//                         <Button
//                             onClick={handleGenerateLink}
//                             isLoading={generateConsentLink.isPending}
//                             className="bg-blue-600 hover:bg-blue-700 text-white"
//                         >
//                             <i className="fa-solid fa-link mr-2"></i>
//                             Generate Consent Link
//                         </Button>
//                     )}

//                     {(generatedLink || agreementToken) && (
//                         <div className="mt-4 space-y-3">
//                             <div className="bg-gray-100 rounded p-2 text-sm flex items-center justify-between border">
//                                 <span className="truncate">{generatedLink || `https://yourdomain.com/consent/${agreementToken}`}</span>
//                                 <div className="flex gap-2 ml-3">
//                                     <Button
//                                         variant="outline"
//                                         onClick={() =>
//                                             copyToClipboard(generatedLink || `https://yourdomain.com/consent/${agreementToken}`)
//                                         }
//                                         className="px-2 h-8"
//                                     >
//                                        <i className="fas fa-task"></i>
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         onClick={() =>
//                                             shareOnWhatsApp(generatedLink || `https://yourdomain.com/consent/${agreementToken}`)
//                                         }
//                                         className="px-2 h-8"
//                                     >
//                                        <i className="fas fa-task"></i>

//                                     </Button>
//                                 </div>
//                             </div>
//                             <p className="text-xs text-gray-500">You can copy or share this link via WhatsApp.</p>
//                         </div>
//                     )}
//                 </Card>
//             )}
//         </div>
//     );
// };

// export default PaymentConsentSection;


const PaymentConsentSection: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();

    const { data, isLoading, isError, refetch } = useGetPaymentConfirmation(projectId!);
    const toggleConsent = useToggleConsentRequired();
    const generateConsent = useGenerateConsentLink();

    const [link, setLink] = useState<string | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied", description: "Link copied to clipboard." });
    };

    const shareOnWhatsapp = (text: string) => {
        const message = `Please review and approve the payment consent:\n\n${text}`;
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encoded}`, "_blank");
    };

    const handleToggleConsent = async () => {
        try {
            await toggleConsent.mutateAsync({ projectId: projectId! });
            toast({ title: "Success", description: "Consent requirement updated." });
            refetch();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || err.message,
                variant: "destructive",
            });
        }
    };

    const handleGenerate = async () => {
        try {
            const generated = await generateConsent.mutateAsync({ projectId: projectId! });
            setLink(generated);
            toast({ title: "Success", description: "Consent link generated." });
            refetch();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.response?.data?.message || err.message,
                variant: "destructive",
            });
        }
    };

    if (isLoading) return <p>Loading consent details...</p>;
    if (isError || !data) return <p>Something went wrong.</p>;

    const {
        isConsentRequired,
        paymentClientConsent: { content, agreedAt, isAgreed, agreementToken, link:consentURL },
    } = data;


    console.log("agreement", agreementToken, consentURL)
    console.log(consentURL === "", "coentsent URL")
    return (
        <div className="space-y-6 w-full max-w-full max-h-full mx-auto">

            {/* ⬆️ Header */}
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-3xl font-bold text-blue-700 flex items-center">
                    <i className="fa-solid fa-handshake-angle mr-2"></i> Client Consent
                </h2>

                <Button
                    size="sm"
                    onClick={handleToggleConsent}
                    className={`text-sm text-white px-4 py-2 rounded ${isConsentRequired ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                >
                    {isConsentRequired ? "Make Consent Optional" : "Require Client Consent"}
                </Button>
            </div>

            {/* ✅ Consent Status */}
            <div className="rounded-lg shadow border border-blue-200 overflow-hidden">
                <div className="bg-blue-50 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-blue-700 text-lg">
                        <i className="fa-solid fa-circle-info" />
                        Consent Status
                    </div>
                </div>

                <div className="p-4">
                    {agreedAt ? (
                        <div className="bg-green-50 p-4 rounded text-green-800 text-sm border border-green-200 shadow-sm">
                            <i className="fa-solid fa-circle-check text-green-600 mr-2" />
                            <strong className="mr-2">Client Agreed</strong>

                            <span className="mr-2">{isAgreed ? "Agreed" : (isAgreed === null ? "Not Agreed Yet" : "Not Agreed") }</span>
                            {/* <br /> */}
                            <span>Agreed At: {new Date(agreedAt).toLocaleString()}</span>
                        </div>
                    ) : !agreementToken ? (
                        <div className="bg-red-50 p-4 rounded text-red-700 border border-red-200 text-sm">
                            <i className="fa-solid fa-times-circle mr-2" />
                            Client has <strong>not yet agreed</strong>.<br />
                            No consent link generated.
                        </div>
                    ) : (
                        <div className="bg-yellow-50 p-4 rounded text-yellow-800 border border-yellow-200 text-sm">
                            <i className="fa-solid fa-hourglass-half mr-2" />
                            Consent link was generated, waiting for client to approve.
                        </div>
                    )}
                </div>
            </div>

            {/* 🔗 Consent Link */}
            {isConsentRequired && !agreedAt && (
                <div className="rounded-lg shadow border border-blue-200 overflow-hidden">
                    <div className="bg-blue-50 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-blue-700 text-lg">
                            <i className="fa-solid fa-link" />
                            Consent Link
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        {!agreementToken && !consentURL ? (
                            <Button
                                isLoading={generateConsent.isPending}
                                onClick={handleGenerate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles mr-2" />
                                Generate Consent Link
                            </Button>
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-100">
                                    <span className="text-sm truncate">{consentURL}</span>
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 text-sm"
                                            onClick={() => copyToClipboard(consentURL!)}
                                        >
                                            <i className="fa-regular fa-copy mr-1" />
                                            Copy
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 text-sm"
                                            onClick={() => shareOnWhatsapp(consentURL!)}
                                        >
                                            <i className="fa-brands fa-whatsapp mr-1" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Share this link with the client to collect consent.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 📄 Consent Terms/Content */}
            <div className={`rounded-lg shadow border border-gray-200 max-h-70 overflow-y-auto custom-scrollbar ${agreedAt ? "!max-h-[480px]" : ""} `}>
                <div className="bg-gray-100 px-5 py-3 text-gray-700 font-medium text-lg flex items-center gap-2">
                    <i className="fa-solid fa-file-contract" />
                    Consent Form Content
                </div>

                {/* <div className="p-4 text-sm text-gray-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
          {content || "No content defined for this consent form by staff."}
        </div> */}


                <div
                    className="prose prose-sm sm:prose base p-5"
                    style={{ fontFamily: "Segoe UI, sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: content || "<p>No content available.</p>" }}
                />
            </div>
        </div>
    );
};

export default PaymentConsentSection;
