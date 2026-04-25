// src/pages/SubContract/SingleSubContract.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

// --- Import your hooks and components ---
// Note: These are placeholders. Replace with your actual API hooks.
import { useGetSubContractById, useUpdateWorkerStatus } from "../../../apiList/SubContract Api/subContractNewApi";
import SubContractForm from "./SubContractForm";
import { Label } from "../../../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";

const SingleSubContract = () => {
    const navigate = useNavigate();
    const { organizationId, subContractId } = useParams() as { organizationId: string; subContractId: string };

    // --- State for the "After Work" file upload section ---
    // const [afterWorkFiles, setAfterWorkFiles] = useState<File[]>([]);

    // --- API Hooks ---
    const { data: subContractData, isLoading: isFetching, isError, refetch } = useGetSubContractById({ subContractId });
    const [copied, setCopied] = useState<boolean>(false)
    const [shareableLink, setShareableLink] = useState<string>("")
    const [status, setStatus] = useState<"pending" | "accepted" | "rejected">(subContractData?.status || "pending")


    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.subcontract?.list;



    useEffect(() => {
        if (subContractData) {
            const link = `${import.meta.env.VITE_FRONTEND_URL}/subcontract/share/${subContractData._id}?token=${subContractData.token}`
            setShareableLink(link)


            if (subContractData?.status) {
                setStatus(subContractData.status);
            }


        }


    }, [subContractData])




    const handleCopyLink = () => {

        navigator.clipboard.writeText(shareableLink);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Link copied to clipboard"
        });
        setTimeout(() => setCopied(false), 2000);

    };


    const { mutateAsync: updateStatusMutation, } = useUpdateWorkerStatus()




    const statusConfig = {
        pending: {
            triggerClass: "bg-yellow-50 border-yellow-300 text-yellow-700",
            valueClass: "text-yellow-700 font-medium",
            itemClass: "text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium",
            dotColor: "bg-yellow-500",
            label: "Pending"
        },
        accepted: {
            triggerClass: "!bg-green-50 border-green-300 text-green-700",
            valueClass: "text-green-700 font-medium",
            itemClass: "text-green-700 hover:bg-green-50 hover:text-green-800 font-medium",
            dotColor: "bg-green-500",
            label: "Accepted"
        },
        rejected: {
            triggerClass: "!bg-red-50 border-red-300 text-red-700",
            valueClass: "text-red-700 font-medium",
            itemClass: "text-red-700 hover:bg-red-50 hover:text-red-800 font-medium",
            dotColor: "bg-red-500",
            label: "Rejected"
        }
    };



    const handleUpdateStatus = async (status: "pending" | "accepted" | "rejected") => {
        try {
            await updateStatusMutation({
                subContractId,
                status: status,
            })


            refetch()
            toast({
                title: "Success",
                description: "status successfully"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to upload files",
                variant: "destructive"
            });
        }
    };


    // --- Render Logic ---

    if (isFetching) {
        return <div>Loading subcontract details...</div>;
    }

    if (isError || !subContractData) {
        return <div>Error loading data. Please try again.</div>;
    }




    if (!canList) {
        return
    }
    return (
        <div className="space-y-6 max-h-full overflow-y-auto bg-brand-surface">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3 pb-4 border-b border-ash-light">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg border border-ash-medium bg-brand-surface text-text-muted hover:text-text-main hover:bg-brand-ash transition-all shadow-sm shrink-0"
                        title="Go Back"
                    >
                        <i className="fas fa-arrow-left text-sm"></i>
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg items-center justify-center shadow-sm hidden sm:flex">
                                <i className="fas fa-file-contract text-action-primary"></i>
                            </div>
                            Sub Contract Details
                        </h1>
                        <p className="text-[10px] font-bold tracking-wider text-text-muted mt-1.5">View and manage contract status</p>
                    </div>
                </div>

                {/* Status Dropdown */}
                <div className="w-full sm:w-48 shrink-0">
                    <Label className="text-[9px] font-bold tracking-wider text-text-muted mb-1 block">Contract Status</Label>
                    <Select
                        value={status}
                        onValueChange={(val: string) => handleUpdateStatus(val as "pending" | "accepted" | "rejected")}
                    >
                        <SelectTrigger className={`w-full h-10 shadow-sm ${statusConfig[status].triggerClass}`}>
                            <SelectValue
                                placeholder="Select Status"
                                selectedValue={status.toString()}
                                className={statusConfig[status].valueClass}
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-brand-surface border-ash-medium shadow-md">
                            {(["pending", "accepted", "rejected"] as const).map((statusOption) => (
                                <SelectItem
                                    key={statusOption}
                                    value={statusOption}
                                    className={`cursor-pointer hover:bg-brand-ash ${statusConfig[statusOption].itemClass}`}
                                >
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                        <span className={`w-2 h-2 rounded-full ${statusConfig[statusOption].dotColor}`}></span>
                                        {statusConfig[statusOption].label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="max-w-full mx-auto space-y-8">
                {/* --- Main Details Form (View/Edit) --- */}
                <SubContractForm
                    organizationId={organizationId}
                    mode="view" // Start in view mode
                    initialData={subContractData}
                    refetch={refetch}
                />


                {shareableLink &&
                    // <div className="space-y-4">
                    //     <Label>Form Link</Label>
                    //     <div className="flex flex-col sm:flex-row items-center gap-2">
                    //         <Input
                    //             value={shareableLink}
                    //             readOnly
                    //             className="bg-blue-50 text-blue-800 flex-1"
                    //         />
                    //         <Button
                    //             onClick={handleCopyLink}
                    //             className="w-full sm:w-auto"
                    //         >
                    //             <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                    //         </Button>
                    //     </div>
                    // </div>

                    <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden mt-6 animate-in fade-in duration-300">
                        <CardHeader className="bg-brand-ash/50 border-b border-ash-light py-4 px-5">
                            <CardTitle className="text-sm font-bold text-text-main flex items-center gap-2">
                                <i className="fas fa-link text-action-primary"></i> Sub Contract Form Link
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">
                                Share this link with workers to submit their information.
                            </p>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="relative flex-1">
                                    <Input
                                        value={shareableLink}
                                        readOnly
                                        className="w-full bg-brand-surface border-ash-medium text-text-main h-10 px-4 font-mono text-sm focus:ring-1 focus:ring-action-primary/20 transition-all"
                                    />
                                </div>
                                <Button
                                    onClick={handleCopyLink}
                                    variant={copied ? "white" : "dark"}
                                    className={`h-10 px-6 shadow-sm transition-all shrink-0 ${copied ? 'border-action-primary text-action-primary' : ''}`}
                                >
                                    {copied ? (
                                        <><i className="fas fa-check mr-2"></i> Copied!</>
                                    ) : (
                                        <><i className="fas fa-copy mr-2"></i> Copy Link</>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                }
            </div>
        </div>
    );
};

export default SingleSubContract;