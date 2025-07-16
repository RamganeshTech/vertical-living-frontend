import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "../utils/toast";
import { useStartStageTimer } from "../apiList/Stage Api/timerStage Api/timerStageApi";

interface TimerProps {
    startedAt: string | null;
    completedAt: string | null;
    stageName: "requirementform" | "sitemeasurement" | "sampledesign" |
    "technicalconsultation" | "materialconfirmation" | "costestimation" | "paymentconfirmation" | "orderingmaterial" |
    "materialarrivalcheck" | "worktasks" | "installation" | "qualitycheck" | "cleaning" | "projectdelivery";
    deadLine: string | null;
    formId: string;
    projectId: string;
    deadLineMutate: ({ formId, projectId, deadLine }: { formId: string; projectId: string; deadLine: string }) => Promise<any>;
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

const StageTimerInfo: React.FC<TimerProps> = ({ startedAt, stageName, projectId, completedAt, deadLine, formId, deadLineMutate, isPending, refetchStageMutate }) => {
    const [now, setNow] = useState(new Date());
    const [newDeadline, setNewDeadline] = useState(deadLine ? new Date(deadLine).toISOString().split("T")[0] : "");

    const [editMode, setEditMode] = useState(false);

    const [editStartMode, setEditStartMode] = useState(false);
    const [newStartDate, setNewStartDate] = useState("");

    const { mutateAsync: startTimerMutate, isPending: isStarting } = useStartStageTimer();

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
            const duration = completedDate.getTime() - startedDate.getTime();
            return `✅ Completed in: ${formatDuration(duration)}`;
        }

        if (deadlineDate) {
            const remaining = deadlineDate.getTime() - now.getTime();
            if (remaining <= 0) {
                return (
                    <span className="text-red-600 font-semibold">
                        ⚠️ Deadline has reached
                    </span>
                );
            }
            return `⏳ Remaining: ${formatDuration(remaining)}`;
        }

        const duration = now.getTime() - startedDate.getTime();
        return `🕒 Running: ${formatDuration(duration)}`;
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
            const safeDeadline = newDeadline.length === 10 ? `${newDeadline}T00:00:00` : newDeadline;

            const selectedDate = new Date(safeDeadline);

            if (isNaN(selectedDate.getTime())) {
                return toast({
                    title: "Invalid Date",
                    description: "Please pick a valid date & time",
                    variant: "destructive",
                });
            }

            const now = new Date();
            if (selectedDate < now) {
                return toast({
                    title: "Invalid Date",
                    description: "Deadline cannot be in the past",
                    variant: "destructive",
                });
            }

            await deadLineMutate({ formId, projectId, deadLine: safeDeadline });
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



    const handleSetStartDateTime = async () => {
        try {
            if (!newStartDate) return toast({ title: "Error", description: "Please pick a date" });


            const selectedDate = new Date(newStartDate);

            if (isNaN(selectedDate.getTime())) {
                return toast({
                    title: "Invalid Date",
                    description: "Please provide a valid date & time.",
                    variant: "destructive",
                });
            }

            const now = new Date();
            if (selectedDate < now) {
                return toast({
                    title: "Invalid Date",
                    description: "The started time cannot be in the past.",
                    variant: "destructive",
                });
            }

            await startTimerMutate({
                projectId,
                stageName,
                startedAt: selectedDate.toISOString(),
            });
            await refetchStageMutate();
            toast({ title: "Success", description: "Started time updated" });
            setEditStartMode(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to update started time",
                variant: "destructive",
            });
        }
    };

    return (

        <div className="text-sm w-full text-blue-900 space-y-3">
            <div className="flex w-full justify-between flex-wrap gap-x-6 gap-y-2 items-center">
                {/* ✅ STARTED ON */}
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-play text-blue-500" />
                    <strong>Started On:</strong> {formatDisplayDate(startedDate)}
                    {!editStartMode && (
                        <Button variant="outline" size="sm" onClick={() => setEditStartMode(true)}>
                            <i className="fa-solid fa-pen mr-1" /> Edit
                        </Button>
                    )}
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

            {editStartMode && (
                <div className="flex w-full flex-wrap gap-3 pt-2 items-center">
                    <Input
                        type="datetime-local"
                        value={newStartDate} // reuse same state
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setNewStartDate(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button
                        onClick={handleSetStartDateTime}
                        isLoading={isStarting}
                       variant="primary"
                    >
                        Update StartedAt
                    </Button>
                    <Button onClick={() => setEditStartMode(false)} variant="ghost">
                        Cancel
                    </Button>
                </div>
            )}

            {editMode && (
                <div className="flex w-full flex-wrap gap-3 pt-2 items-center">
                    <Input
                        type="datetime-local"
                        value={newDeadline}
                        min={new Date().toISOString().slice(0, 16)}
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
