import  { useState, useEffect } from "react";
// Adjust these imports to match your project's folder structure
// import { useGetAppConfig, useUpdateMarketingText } from "../hooks/useAppConfigHooks";
import { toast } from "../../../utils/toast";
import { useGetAppConfig, useUpdateMarketingText } from "../../../apiList/marketing_api/theverticalliving_api/theverticalLivingApi";
import { Label } from "recharts";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
// import { Input } from "../components/Input";
// import { Label } from "../components/Label";
// import { Button } from "../components/Button";

const VerticalLivingPdfConfiguration = () => {
    // 1. Hooks
    const { data: configData, isLoading: isConfigLoading } = useGetAppConfig();
    const { mutateAsync: updateMarketingText, isPending: isUpdating } = useUpdateMarketingText();

    // 2. Local State
    const [marketingTexts, setMarketingTexts] = useState([{ text: "" }]);

    // 3. Sync fetched data to local state
    useEffect(() => {
        if (configData?.marketingText && configData.marketingText.length > 0) {
            setMarketingTexts(configData.marketingText);
        }
    }, [configData]);

    // 4. Handlers
    const handleTextChange = (index: number, value: string) => {
        const newTexts = [...marketingTexts];
        newTexts[index].text = value;
        setMarketingTexts(newTexts);
    };

    const handleAddText = () => {
        if (marketingTexts.length < 2) {
            setMarketingTexts([...marketingTexts, { text: "" }]);
        } else {
            toast({ 
                title: "Limit Reached", 
                description: "You can only add a maximum of 2 marketing texts.", 
                variant: "destructive" // Assumes you have a warning/destructive toast variant
            });
        }
    };

    const handleRemoveText = (index: number) => {
        const newTexts = marketingTexts.filter((_, i) => i !== index);
        // Ensure there is always at least one empty input
        setMarketingTexts(newTexts.length === 0 ? [{ text: "" }] : newTexts);
    };

    // Exactly matching your requested async/await toast pattern
    const handleSave = async () => {
        try {
            // Clean empty strings before saving
            const payload = marketingTexts.filter(item => item.text.trim() !== "");
            
            if (payload.length === 0) {
                toast({ title: "Error", description: "Please enter at least one marketing text.", variant: "destructive" });
                return;
            }

            if (!isUpdating) {
                await updateMarketingText(payload);
            }
            
            toast({ title: "Success", description: "PDF Marketing text updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error.message || "Failed to update marketing text",
                variant: "destructive"
            });
        }
    };

    if (isConfigLoading) {
        return (
            <div className="flex justify-center items-center p-12 text-text-soft">
                Loading configuration...
            </div>
        );
    }

    // 5. Render
    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-brand-surface border border-ash-medium rounded-xl shadow-sm overflow-hidden transition-colors hover:bg-brand-surface-hover">
                
                {/* Header Section */}
                <div className="px-6 py-5 border-b border-ash-light">
                    <h2 className="text-lg sm:text-xl font-bold text-text-strong">
                        Vertical Living PDF Configuration
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                        Manage the dynamic marketing text that appears on client quotation PDFs.
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-text-main font-semibold text-base">
                                Marketing Call-to-Action (Max 2 lines)
                            </Label>
                            <span className="text-xs font-medium text-text-soft bg-brand-ash px-2 py-1 rounded-md">
                                {marketingTexts.length} / 2
                            </span>
                        </div>

                        {/* Dynamic Inputs List */}
                        <div className="space-y-3">
                            {marketingTexts.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 w-full">
                                    <div className="flex-1 w-full">
                                        <Input
                                            value={item.text}
                                            onChange={(e) => handleTextChange(index, e.target.value)}
                                            placeholder={`e.g., ${index === 0 ? "Discount up to 50%" : "Free Hettich Hardware Upgrades"}`}
                                            className="w-full bg-brand-main border-ash-medium text-text-main placeholder-text-soft focus:border-action-primary"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveText(index)}
                                        className="mt-0.5 text-text-soft hover:text-action-danger hover:bg-red-50 shrink-0"
                                        title="Remove line"
                                    >
                                        {/* Simple SVG Trash Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Add Button */}
                        {marketingTexts.length < 2 && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddText}
                                className="mt-2 text-action-primary border-ash-dark hover:bg-brand-ash w-full sm:w-auto"
                            >
                                + Add another line
                            </Button>
                        )}
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-4 bg-brand-ash border-t border-ash-light flex items-center justify-end gap-3 rounded-b-xl">
                    <Button 
                        variant="dark" 
                        onClick={handleSave} 
                        isLoading={isUpdating}
                        className="w-full sm:w-auto min-w-[120px]"
                    >
                        Save Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
};


export default VerticalLivingPdfConfiguration