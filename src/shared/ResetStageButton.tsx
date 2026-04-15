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
    // buttonClass = "bg-red-600 text-white",
    // buttonClass = "bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all",
    buttonClass = "bg-white border border-gray-200 !text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all",
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
        // <div className={`space-y-1 w-full ${className}`}>
        //     <Button
        //         onClick={handleReset}
        //         variant="danger"
        //         disabled={isPending || disabled}
        //         className={`${buttonClass} flex items-center gap-2 !p-2 w-full`}
        //     >
        //         <i className={iconClass} />
               
        //         <span>{isPending ? "Resetting..." : "Reset Stage"}</span>
        //     </Button>

           
        // </div>

        <div className={`space-y-1 w-full ${className}`}>
            <Button
                onClick={handleReset}
                disabled={isPending || disabled}
                className={`${buttonClass} flex items-center justify-center gap-2 !py-2 !px-4 w-full`}
            >
                <i className={`${iconClass} ${isPending ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">{isPending ? "Resetting..." : "Reset Stage"}</span>
            </Button>
        </div>
    );
};
