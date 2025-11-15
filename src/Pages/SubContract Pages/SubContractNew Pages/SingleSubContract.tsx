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
                    <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select Status" selectedValue={status.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        {["pending", "accepted", "rejected"].map((status) => {
                            return (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            );
                        })}
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

                {/* --- Separate Component for After Work Upload --- */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <i className="fas fa-camera-retro mr-3 text-purple-600"></i>
                            Upload After-Work Pictures
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Once the work is completed, upload pictures here for verification.
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="afterWorkUpload">Select Files</Label>
                            <Input
                                id="afterWorkUpload"
                                type="file"
                                multiple
                                onChange={(e) => setAfterWorkFiles(Array.from(e.target.files || []))}
                            />
                        </div>

                       


                        {subContractData?.filesAfterWork.some((file:SubContractFile) => file.type === "image") && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <i className="fas fa-images text-purple-600"></i>
                                    <h4 className="font-semibold text-gray-800 text-sm">Images</h4>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        {subContractData?.filesAfterWork.filter((f:any) => f.type === "image").length}
                                    </span>
                                </div>
                                <ImageGalleryExample
                                    imageFiles={subContractData?.filesAfterWork?.filter((file: SubContractFile) => file.type === "image")}
                                    height={150}
                                    minWidth={150}
                                    maxWidth={200}
                                />
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={handleAfterUploads} disabled={uploadAfterMutation.isPending || afterWorkFiles.length === 0}>
                                {uploadAfterMutation.isPending ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</>
                                ) : (
                                    <><i className="fas fa-cloud-upload-alt mr-2"></i>Upload Files</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}



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