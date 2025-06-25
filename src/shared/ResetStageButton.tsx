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
}) => {
    const { mutateAsync, isPending, error } = useResetStage();

    const handleReset = async () => {
        try {
            mutateAsync({ projectId, stageNumber, stagePath });
            toast({ description: 'Stage Reset successfully', title: "Success" });

        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error.message || "Failed to Reset the stage", variant: "destructive" })

        }
    };

    return (
        <div className="space-y-1">
            <Button
                onClick={handleReset}
                disabled={isPending || disabled}
                className={`${buttonClass} flex items-center gap-2`}
            >
                <i className={iconClass} />
                {isPending ? "Resetting..." : label}
            </Button>

            {error && (
                <p className="text-sm text-red-500">
                    {(error as Error).message}
                </p>
            )}
        </div>
    );
};
