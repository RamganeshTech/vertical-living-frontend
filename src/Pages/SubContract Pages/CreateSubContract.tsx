import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSubContract } from "../../apiList/SubContract Api/subContractApi";
import { toast } from "../../utils/toast";
// import { Breadcrumb } from "../Department Pages/Breadcrumb";
import SubContractForm from "./SubContractForm";
import GenerateSubContractLink from "./GenerateSubContractLink";

const CreateSubContract = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string }
    const createMutation = useCreateSubContract();
    const [createdContractId, setCreatedContractId] = useState<string | null>(null);

    const handleSubmit = async (formData: any) => {
        try {
            const result = await createMutation.mutateAsync({
                organizationId: organizationId!,
                projectId: formData.projectId,
                workName: formData.workName
            });

            // console.log("result of cretion", result)
            toast({
                title: "Success",
                description: "Sub Contract created successfully"
            });

            setCreatedContractId(result._id);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to create sub contract",
                variant: "destructive"
            });
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <div onClick={() => navigate(-1)}
                    className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                    <i className='fas fa-arrow-left'></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                    <i className="fas fa-hard-hat mr-3 text-blue-600"></i>
                    Create Sub Contract
                </h1>
                {/* <Breadcrumb paths={paths} /> */}
            </div>

            <div className="max-w-full mx-auto space-y-6">
                {/* Sub Contract Form */}
                <SubContractForm
                    organizationId={organizationId}
                    mode="create"
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                />

                {/* Generate Link Component - Only show after contract is created */}
                {createdContractId && (
                    <GenerateSubContractLink
                        subContractId={createdContractId}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateSubContract;