// src/components/stages/ResetStageButton.tsx

import React from "react";
import { useResetStage } from "../apiList/Stage Api/resetStage Api/resetStageApi";
import { Button } from "../components/ui/Button";
import { toast } from "../utils/toast";

interface ResetStageButtonProps {
    projectId: string;
    stageNumber: number;
    stagePath: string;
    label?: string;
    className?: string;
    buttonClass?: string;
    iconClass?: string;
    disabled?: boolean;
}

export const ResetStageButton: React.FC<ResetStageButtonProps> = ({
    projectId,
    stageNumber,
    stagePath,
    label = "Reset Stage",
    buttonClass = "bg-red-600 text-white",
    iconClass = "fas fa-rotate-left",
    disabled = false,
    className = ""
}) => {
    const { mutateAsync, isPending } = useResetStage();

    const handleReset = async () => {
        try {
            await mutateAsync({ projectId, stageNumber, stagePath });
            toast({ description: 'Stage Reset successfully', title: "Success" });
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to Reset the stage", variant: "destructive" })

        }
    };

    return (
        <div className={`space-y-1 w-full ${className}`}>
            <Button
                onClick={handleReset}
                variant="danger"
                disabled={isPending || disabled}
                className={`${buttonClass} flex items-center gap-2 !p-2 w-full`}
            >
                <i className={iconClass} />
                {/* <span className="hidden sm:block">{isPending ? "Resetting..." : "Reset Stage"}</span>
                <span className="sm:hidden">Reset</span> */}
                <span>{isPending ? "Resetting..." : "Reset Stage"}</span>
            </Button>

            {/* {error && (
                <p className="text-sm text-red-500">
                    {(error as any)?.response?.data?.message || "failed to reset all stages"}
                </p>
            )} */}
        </div>
    );
};
