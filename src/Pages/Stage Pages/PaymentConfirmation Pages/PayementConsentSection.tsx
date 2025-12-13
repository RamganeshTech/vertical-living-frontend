import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetPaymentConfirmation,
    useToggleConsentRequired,
    useGenerateConsentLink,
} from "../../../apiList/Stage Api/Payment Api/paymentConfirmationApi";

import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { dateFormate } from "../../../utils/dateFormator";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";


const PaymentConsentSection: React.FC = () => {
    const { projectId , organizationId} = useParams<{ projectId: string, organizationId:string }>();

    const navigate = useNavigate()
    const { data, isLoading, isError, refetch , error:getAllError} = useGetPaymentConfirmation(projectId!);
    const toggleConsent = useToggleConsentRequired();
    const generateConsent = useGenerateConsentLink();

    
    
      const { role, permission } = useAuthCheck();
      // const canDelete = role === "owner" || permission?.paymentconfirmation?.delete;
      // const canList = role === "owner" || permission?.paymentconfirmation?.list;
      const canCreate = role === "owner" || permission?.paymentconfirmation?.create;
      const canEdit = role === "owner" || permission?.paymentconfirmation?.edit;
    


    // const [link, setLink] = useState<string | null>(null);

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
            await generateConsent.mutateAsync({ projectId: projectId! });
            // setLink(generated);
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

    if (isLoading) return <MaterialOverviewLoading />;
    if (isError || !data) return  <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-6">
              <div className="text-red-600 font-semibold mb-2">
                ⚠️ Error Occurred
              </div>
              <p className="text-red-500 text-sm mb-4">
                {(getAllError as any)?.response?.data?.message || 
                 (getAllError as any)?.message || 
                 "Failed to load cost estimation data"}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-red-600 text-white px-4 py-2"
              >
                Retry
              </Button>
            </div> 

    const {
        isConsentRequired,
        paymentClientConsent: { content, agreedAt, isAgreed, agreementToken, link: consentURL },
    } = data;


  
    return (
        <div className="space-y-6 w-full max-w-full max-h-full sm:overflow-y-auto mx-auto custom-scrollbar">

            {/* ⬆️ Header */}
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg sm:text-2xl  lg:text-3xl font-bold text-blue-700 flex items-center">
                    <i className="hidden sm:block fa-solid fa-handshake-angle mr-[3px] sm:mr-2"></i> Client Consent
                </h2>

              <div className="space-x-1">
                 {(canCreate || canEdit )&& <Button
                  isLoading={toggleConsent.isPending}
                    size="sm"
                    onClick={handleToggleConsent}
                    className={`text-sm text-white px-2 py-2 rounded ${isConsentRequired ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                >
                    {isConsentRequired ?
                        <>
                            <span className="hidden sm:inline">Make Consent Optional</span>
                            <span className="inline sm:hidden">Make Optional</span>
                        </>
                        :
                        <>
                            <span className="hidden sm:inline">Require Client Consent</span>
                            <span className="inline sm:hidden">Make Mandatory</span>
                        </>
                    }
                </Button>}

                <Button variant="primary" onClick={()=> navigate(`/${organizationId}/projectdetails/${projectId}/paymentconfirmation`)}>
                    Back
                </Button>
              </div>
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
                            
                            <span className="mr-2">Client Status:</span>

                            <strong className="mr-2">{isAgreed ? <>Agreed <i className="fa-solid fa-circle-check text-green-600 mr-2" /></> : (isAgreed === null ? "Not Agreed Yet" : <>Not Agreed <i className="fa-solid fa-circle-xmark text-red-600 mr-2" /></>)}</strong>
                            <br />
                            <span>Agreed on: <strong>{dateFormate(agreedAt)}</strong></span>
                        </div>
                    ) : !agreementToken ? (
                        <div className="bg-red-50 p-4 rounded text-red-700 border border-red-200 text-sm">
                            <i className="fa-solid fa-times-circle mr-2" />
                            Client has <strong>Not yet agreed</strong>.<br />
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
                            <>
                            {(canCreate || canEdit )&&<Button
                                isLoading={generateConsent.isPending}
                                onClick={handleGenerate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles mr-2" />
                                Generate Consent Link
                            </Button>}</>
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
