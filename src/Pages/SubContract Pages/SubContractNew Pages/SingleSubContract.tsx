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
        <div className="space-y-6 max-h-full overflow-y-auto">
            <div className="flex justify-between gap-2 items-center">
                <div className="flex gap-2 items-center">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <i className='fas fa-arrow-left'></i>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Sub Contract Details
                    </h1>
                </div>

                <Select
                    value={status}
                    onValueChange={(val: string) => {
                        handleUpdateStatus(val as "pending" | "accepted" | "rejected")
                    }}
                >
                    <SelectTrigger className={`w-full ${statusConfig[status].triggerClass}`}>
                        <SelectValue
                            placeholder="Select Status"
                            selectedValue={status.toString()}
                            className={statusConfig[status].valueClass}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {(["pending", "accepted", "rejected"] as const).map((statusOption) => (
                            <SelectItem
                                key={statusOption}
                                value={statusOption}
                                className={statusConfig[statusOption].itemClass}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${statusConfig[statusOption].dotColor}`}></span>
                                    {statusConfig[statusOption].label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


            </div>

            <div className="max-w-full mx-auto space-y-8">
                {/* --- Main Details Form (View/Edit) --- */}
                <SubContractForm
                    organizationId={organizationId}
                    mode="view" // Start in view mode
                    initialData={subContractData}
                    refetch={refetch}
                />


                {shareableLink && <div className="space-y-4">
                    <Label>Form Link</Label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Input
                            value={shareableLink}
                            readOnly
                            className="bg-blue-50 text-blue-800 flex-1"
                        />
                        <Button
                            onClick={handleCopyLink}
                            className="w-full sm:w-auto"
                        >
                            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                        </Button>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default SingleSubContract;