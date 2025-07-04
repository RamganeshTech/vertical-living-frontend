import React from "react";
import { useParams } from "react-router-dom";
import {
    useGetPaymentConfirmation,
    useToggleConsentRequired,
    useGenerateConsentLink,
    useSetPaymentConfirmationDeadline,
    useCompletePaymentConfirmation,
} from "../../../apiList/Stage Api/paymenConfirmationApi";
import { toast } from "../../../utils/toast";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
import StageTimerInfo from "../../../shared/StagetimerInfo";



const PaymentConsentSection: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();

    // Stage data
    const { data: confirmationData, isLoading, isError, refetch } = useGetPaymentConfirmation(projectId!);

    // Hooks
    const toggleConsent = useToggleConsentRequired();
    const generateConsentLink = useGenerateConsentLink();
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetPaymentConfirmationDeadline();
    const { mutateAsync: completeStage, isPending: completePending } = useCompletePaymentConfirmation();

    // WhatsApp sharer
    const shareOnWhatsApp = (link: string) => {
        const message = `Please review the payment consent terms and approve:\n\n${link}`;
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encoded}`, "_blank");
    };

    // Toggle consent requirement
    const handleToggleConsent = () => {
        if (!projectId) return;

        toggleConsent.mutate(
            { projectId },
            {
                onSuccess: () =>
                    toast({
                        title: "Success",
                        description: "Consent requirement updated successfully.",
                    }),
                onError: (error: any) =>
                    toast({
                        title: "Error",
                        description:
                            error?.response?.data?.message || error.message || "Failed to update consent requirement.",
                        variant: "destructive",
                    }),
            }
        );
    };

    // Generate & share consent link
    const handleGenerateLink = () => {
        if (!projectId) return;

        generateConsentLink.mutate(
            { projectId },
            {
                onSuccess: (link) => {
                    toast({
                        title: "Success",
                        description: "Consent link generated successfully.",
                    });
                    shareOnWhatsApp(link);
                },
                onError: (error: any) =>
                    toast({
                        title: "Error",
                        description:
                            error?.response?.data?.message || error.message || "Failed to generate consent link.",
                        variant: "destructive",
                    }),
            }
        );
    };

    // Mark stage as complete
    const handleCompletionStatus = async () => {
        try {
            await completeStage({ projectId: projectId! });
            toast({
                title: "Success",
                description: "Payment confirmation marked as complete.",
            });
            refetch();
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || error.message || "Failed to complete the payment stage.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) return <p>Loading Payment Confirmation...</p>;
    if (isError || !confirmationData) return <p>Error fetching payment confirmation</p>;

    const { paymentClientConsent, isConsentRequired, assignedTo, timer, _id: formId } = confirmationData;

    return (
        <div className="space-y-4 w-full h-full overflow-y-auto">

            <div className='w-full flex justify-between'>
                <div className="flex justify-between w-full mb-3">
                    <h2 className="text-3xl font-semibold text-blue-600 mb-3 flex items-center">
                        <i className="fa-solid fa-money-bill-wave mr-2"></i> Client Consent
                    </h2>
                </div>

                {/* Stage Controls */}
                <div className="flex gap-2 items-center">
                    <Button
                        isLoading={completePending}
                        onClick={handleCompletionStatus}
                        className="text-white bg-green-600 hover:bg-green-700 px-4 py-2"
                    >
                        <i className="fa-solid fa-circle-check mr-2"></i>
                        Mark as Complete
                    </Button>

                    <ResetStageButton
                        projectId={projectId!}
                        stageNumber={7}
                        stagePath="paymentconfirmation"
                    />

                    <AssignStageStaff
                        stageName="PaymentConfirmationModel"
                        projectId={projectId!}
                        organizationId={"684a57015e439b678e8f6918"}
                        currentAssignedStaff={assignedTo}
                    />
                </div>
            </div>


             {/* Timer */}
            <Card className="p-4 shadow-sm border-l-4 border-blue-600 bg-white">
                <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                    <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                    <span>Stage Timings</span>
                </div>

                <StageTimerInfo
                    stageName="paymentconfirmation"
                    completedAt={timer?.completedAt}
                    startedAt={timer?.startedAt}
                    formId={formId}
                    projectId={projectId!}
                    deadLine={timer?.deadLine}
                    refetchStageMutate={refetch}
                    deadLineMutate={deadLineAsync}
                    isPending={deadLinePending}
                />
            </Card>

            <Card className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Payment Consent</h2>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700 font-medium">Is Consent Required?</span>
                    <button
                        onClick={handleToggleConsent}
                        className={`px-4 py-2 rounded text-white text-sm ${isConsentRequired ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {isConsentRequired ? "Make Consent Optional" : "Make Consent Required"}
                    </button>
                </div>

                {paymentClientConsent?.agreedAt ? (
                    <div className="border p-3 rounded bg-green-50 text-green-800 text-sm">
                        ✅ Client accepted on{" "}
                        <strong>{new Date(paymentClientConsent.agreedAt).toLocaleString()}</strong> <br />
                        By: {paymentClientConsent.agreedByName} ({paymentClientConsent.agreedByEmail || "N/A"})
                    </div>
                ) : (
                    isConsentRequired && (
                        <div className="mt-3">
                            <p className="text-sm mb-2 text-gray-600">Client has not yet approved. Generate and send the consent link:</p>
                            <button
                                onClick={handleGenerateLink}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                disabled={generateConsentLink.isPending}
                            >
                                {generateConsentLink.isPending ? "Generating..." : "Generate & Share Link via WhatsApp"}
                            </button>
                        </div>
                    )
                )}
            </Card>



           
        </div>
    );
};

export default PaymentConsentSection;