import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSubContract } from "../../../apiList/SubContract Api/subContractNewApi";
import { toast } from "../../../utils/toast";
// import { Breadcrumb } from "../../Department Pages/Breadcrumb";
import SubContractForm, { type SubContractFormData } from "./SubContractForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

const CreateSubContract = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const createMutation = useCreateSubContract();
    // const [createdContractId, setCreatedContractId] = useState<{ contractId: null | string; token: null | string; }>({
    //     contractId: null,
    //     token: null
    // });
    const [copied, setCopied] = useState<boolean>(false)
    const [shareableLink, setShareableLink] = useState<string>("")
    const handleSubmit = async (formData: SubContractFormData) => {
        try {
            const result = await createMutation.mutateAsync({
                organizationId: organizationId!,
                ...formData
            });

            // console.log("result of cretion", result)
            toast({
                title: "Success",
                description: "Sub Contract created successfully"
            });

            console.log("result", result)
            // setCreatedContractId({ contractId: result.formId, token: result.token });
            const link = `${import.meta.env.VITE_FRONTEND_URL}/subcontract/share/${result?.contractId}?token=${result?.token}`
            setShareableLink(link)

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create sub contract",
                variant: "destructive"
            });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Link copied to clipboard"
        });
        setTimeout(() => setCopied(false), 2000);

    };



    return (
        <div className="space-y-6 max-h-full overflow-y-auto bg-brand-surface">
            {/* <div className="flex gap-2"> */}
            <div className="flex items-center gap-4 pb-4 border-b border-ash-light">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-ash-medium bg-brand-surface text-text-muted hover:text-text-main hover:bg-brand-ash transition-all shadow-sm shrink-0"
                    title="Go Back"
                >
                    <i className="fas fa-arrow-left text-sm"></i>
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg  items-center justify-center shadow-sm hidden sm:flex">
                            <i className="fas fa-hard-hat text-action-primary"></i>
                        </div>
                        Create Sub Contract
                    </h1>
                    {/* <Breadcrumb paths={paths} /> */}
                </div>
            </div>

            <div className="max-w-full mx-auto space-y-6">



                <SubContractForm
                    organizationId={organizationId}
                    mode="create"
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                    onCancel={() => navigate(-1)} // Good to add a cancel handler
                />

                {/* Generate Link Component - Only show after contract is created */}
                {shareableLink && (
                    // <GenerateSubContractLink
                    //     subContractId={createdContractId}
                    // />
                    <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="bg-brand-ash/50 border-b border-ash-light py-4 px-5">
                            <CardTitle className="flex items-center text-base font-bold text-text-main">
                                <div className="w-8 h-8 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                                    <i className="fas fa-link text-action-primary text-sm"></i>
                                </div>
                                Shareable Link Generated
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                                    Share this link with workers to submit their information.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={shareableLink}
                                            readOnly
                                            // className="flex-1"
                                            className="w-full bg-brand-surface border-ash-medium text-text-main h-10 px-4 font-mono text-sm focus:ring-1 focus:ring-action-primary/20 transition-all"

                                        />
                                        <Button
                                            onClick={handleCopyLink}
                                            // variant="outline"
                                            variant={copied ? "white" : "dark"}
                                            className={`h-10 px-6 shadow-sm transition-all shrink-0 ${copied ? 'border-action-primary text-action-primary' : ''}`}
                                        >
                                            {copied ? (
                                                <>
                                                    <i className="fas fa-check mr-2"></i>
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-copy mr-2"></i>
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-main bg-brand-ash/50 border border-ash-light px-3 py-2 rounded-lg w-fit">
                                        <i className="fas fa-check-circle text-action-primary"></i>
                                        <span>Link generated and ready to share!</span>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
};

export default CreateSubContract;