import { useState } from "react";
import { useGenerateShareableLink } from "../../apiList/SubContract Api/subContractApi";
import { toast } from "../../utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface GenerateSubContractLinkProps {
    subContractId: string;
}

const GenerateSubContractLink = ({ subContractId }: GenerateSubContractLinkProps) => {
    const generateLinkMutation = useGenerateShareableLink();
    const [shareableLink, setShareableLink] = useState<string>("");
    const [copied, setCopied] = useState(false);

    const handleGenerateLink = async () => {
        try {
            const result = await generateLinkMutation.mutateAsync({ subContractId });
            // setShareableLink(result.shareableLink);
            setShareableLink(`${import.meta.env.VITE_FRONTEND_URL}/subcontract/share/${subContractId}?token=${result.shareableLink}`);
            toast({
                title: "Success",
                description: "Shareable link generated successfully"
            });
           
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to generate link",
                variant: "destructive"
            });
        }
    };

    const handleCopyLink = () => {
        if (shareableLink) {
            navigator.clipboard.writeText(shareableLink);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Link copied to clipboard"
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
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

                    {!shareableLink ? (
                        <Button 
                            onClick={handleGenerateLink}
                            isLoading={generateLinkMutation.isPending}
                            className="w-full"
                        >
                            {generateLinkMutation.isPending ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-magic mr-2"></i>
                                    Generate Shareable Link
                                </>
                            )}
                        </Button>
                    ) : (
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
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default GenerateSubContractLink;