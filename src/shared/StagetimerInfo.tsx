import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../utils/toast";

interface TimerProps {
    startedAt: string | null;
    completedAt: string | null;
    deadLine: string | null;
    formId: string;
    deadLineMutate: ({ formId, deadLine }: { formId: string; deadLine: string }) => Promise<any>;
    refetchStageMutate: () => Promise<any>
    isPending: boolean;
}

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const StageTimerInfo: React.FC<TimerProps> = ({ startedAt, completedAt, deadLine, formId, deadLineMutate, isPending, refetchStageMutate }) => {
    const [now, setNow] = useState(new Date());
    const [newDeadline, setNewDeadline] = useState(deadLine ? new Date(deadLine).toISOString().split("T")[0] : "");

    const [editMode, setEditMode] = useState(false);

    console.log("completed date form teech", completedAt)
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const startedDate = startedAt ? new Date(startedAt) : null;
    const completedDate = completedAt ? new Date(completedAt) : null;
    const deadlineDate = deadLine ? new Date(deadLine) : null;

    const showTimer = () => {
        if (!startedDate) return "Not started yet";

        if (startedDate && completedDate) {
            // const duration = completedDate.getTime() - startedDate.getTime();
            const duration = completedDate.getTime() - startedDate.getTime();
            return `⏱ Completed in: ${formatDuration(duration)}`;
        }


        const current = deadlineDate ? deadlineDate : now;
        const duration = current.getTime() - startedDate.getTime();
        return deadlineDate
            ? `⏳ Remaining: ${formatDuration(deadlineDate.getTime() - now.getTime())}`
            : `🕒 created: ${formatDuration(duration)} ago`;
    };

    const formatDisplayDate = (date: Date | null) => {
        if (!date) return "Not Available";
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const handleSetDeadline = async () => {
        try {
            if (!formId || !newDeadline) return;
            await deadLineMutate({ formId, deadLine: newDeadline });
            refetchStageMutate()
            setEditMode(false);

            toast({ title: "Success", description: "Deadline updated successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update deadline",
                variant: "destructive",
            });
        }
    };

    return (

        <div className="text-sm w-full text-blue-900 space-y-3">
            <div className="flex w-full justify-between flex-wrap gap-x-6 gap-y-2 items-center">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-play text-blue-500" />
                    <strong>Started On:</strong> {formatDisplayDate(startedDate)}
                </div>
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-flag-checkered text-green-500" />
                    <strong>Completed On:</strong> {formatDisplayDate(completedDate)}
                </div>
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-calendar text-purple-600" />
                    <strong>Deadline:</strong> {formatDisplayDate(deadlineDate)}
                    {!editMode && (
                        <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                            <i className="fa-solid fa-pen mr-1" /> Edit
                        </Button>
                    )}
                </div>
            </div>

            <div className="font-semibold text-blue-700">{showTimer()}</div>

            {editMode && (
                <div className="flex w-full flex-wrap gap-3 pt-2 items-center">
                    <Input
                        type="date"
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button onClick={handleSetDeadline} isLoading={isPending} className="bg-blue-600 text-white">
                        Update Deadline
                    </Button>
                    <Button onClick={() => setEditMode(false)} variant="ghost">
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
};

export default StageTimerInfo;
