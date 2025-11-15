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
        <div className="space-y-6 max-h-full overflow-y-auto">
            <div className="flex gap-2">
                <div onClick={() => navigate(-1)}
                    className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                    <i className='fas fa-arrow-left'></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                    <i className="fas fa-hard-hat mr-3 text-blue-600"></i>
                    Create Sub Contract
                </h1>
                {/* <Breadcrumb paths={paths} /> */}
            </div>

            <div className="max-w-full mx-auto space-y-6">
                {/* Sub Contract Form */}
                {/* <SubContractForm
                    organizationId={organizationId}
                    mode="create"
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                /> */}

              
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <i className="fas fa-link mr-2 text-blue-600"></i>
                                Generate Shareable Link
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Generate a shareable link for workers to submit their information for this sub contract.
                                </p>


                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={shareableLink}
                                            readOnly
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleCopyLink}
                                            variant="outline"
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
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <i className="fas fa-check-circle"></i>
                                        <span>Link generated successfully! Share this with workers.</span>
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