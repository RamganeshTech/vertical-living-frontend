import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { useGetProjects } from "../../../apiList/projectApi";
import type { AvailableProjetType } from "../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import SearchSelectNew from "../../../components/ui/SearchSelectNew";
// import type { SubContractSingleData } from "../SubContractMain";
import type { SubContractFile, SubContractSingleData } from "./SubContractMain";
import ImageGalleryExample from "../../../shared/ImageGallery/ImageGalleryMain";
import { toast } from "../../../utils/toast";
import { useUpdateSubContract, useUploadAfterWorkFiles, useUploadBeforeWorkFiles } from "../../../apiList/SubContract Api/subContractNewApi";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";

// --- PROPS & INTERFACES ---

interface SubContractFormProps {
    mode: "create" | "edit" | "view";
    organizationId: string;
    initialData?: SubContractSingleData;
    onSubmit?: (data: any) => void;
    isLoading?: boolean;
    onCancel?: () => void;
    refetch?: () => void;
}


export interface SubContractFormData {
    projectId: string;
    projectName: string;
    workerName: string;
    workName: string;
    dateOfCommencement: string;
    dateOfCompletion: string;
    totalCost: number;
    labourCost: number;
    materialCost: number;
    filesBeforeWork: (File)[];
    filesAfterWork: (File)[];
}

// --- HELPER COMPONENT FOR IMAGE PREVIEWS ---


// --- MAIN FORM COMPONENT ---

const SubContractForm = ({ organizationId, mode, initialData, onSubmit, isLoading, onCancel, refetch }: SubContractFormProps) => {
    const [isEditing, setIsEditing] = useState(mode === 'create');

    const [formData, setFormData] = useState<SubContractFormData>({
        projectId: "", projectName: "", workerName: "", workName: "", dateOfCommencement: "",
        dateOfCompletion: "", labourCost: 0, materialCost: 0, totalCost: 0,
        filesBeforeWork: [], filesAfterWork: [],
    });



    // const [updateFormData, setUpdateFormData] = useState<updateFormSubContract>({
    //     projectId: "", projectName: "", workerName: "", workName: "", dateOfCommencement: "",
    //     dateOfCompletion: "", labourCost: 0, materialCost: 0, totalCost: 0
    // });



    const { role, permission } = useAuthCheck();
    const canEdit = role === "owner" || permission?.subcontract?.edit;




    const [errors, setErrors] = useState<any>({});

    // --- DATA FETCHING & INITIALIZATION ---

    const { data: projectsData } = useGetProjects(organizationId!);

    const projectOptions = (projectsData || [])?.map((project: AvailableProjetType) => ({
        value: project._id, label: project.projectName
    }));

    const resetFormToInitial = useCallback(() => {
        if (mode !== 'create' && initialData) {
            setFormData({
                projectId: initialData.projectId?._id || "",
                projectName: initialData.projectId?.projectName || "",
                workName: initialData.workName || "",
                workerName: initialData.workerName || "",
                dateOfCommencement: initialData.dateOfCommencement ? new Date(initialData.dateOfCommencement).toISOString().split('T')[0] : "",
                dateOfCompletion: initialData.dateOfCompletion ? new Date(initialData.dateOfCompletion).toISOString().split('T')[0] : "",
                labourCost: initialData.labourCost || 0,
                materialCost: initialData.materialCost || 0,
                totalCost: initialData.totalCost || 0,
                // filesBeforeWork: initialData.filesBeforeWork?.map((f: SubContractFile) => f.url) || [],
                filesBeforeWork: [],
                // filesAfterWork: initialData.filesAfterWork?.map((f: SubContractFile) => f.url) || [],
                filesAfterWork: [],
            });
        }
    }, [initialData, mode]);

    useEffect(() => {
        resetFormToInitial();
    }, [resetFormToInitial]);



    const [beforeWorkFiles, setBeforeWorkFiles] = useState<File[]>([]);
    const [afterWorkFiles, setAfterWorkFiles] = useState<File[]>([]);


    const uploadBeforeMutation = useUploadBeforeWorkFiles();
    const uploadAfterMutation = useUploadAfterWorkFiles();

    const { mutateAsync: updateMutatation, isPending: updatePending } = useUpdateSubContract()




    // Handles the separate "Upload After Work Files" action
    const handleAfterUploads = async () => {
        try {
            if (afterWorkFiles.length === 0) {
                toast({ title: "No files selected", description: "Please select at least one file to upload.", variant: "destructive" });
                return;
            }

            await uploadAfterMutation.mutateAsync({
                subContractId: (initialData as any)?._id!,
                files: afterWorkFiles,
            });
            refetch?.()
            toast({ title: "Success", description: "After-work files uploaded successfully." });
            setAfterWorkFiles([]); // Clear selection after successful upload
            // Optionally, refetch the main data to show new images: queryClient.invalidateQueries(...)
        } catch (error: any) {
            toast({
                title: "Upload Error",
                description: error?.response?.data?.message || error?.message || "Failed to upload files.",
                variant: "destructive",
            });
        }
    };


    const handleBeforeUploads = async () => {
        try {
            if (beforeWorkFiles.length === 0) {
                toast({
                    title: "Error",
                    description: "Please upload at least one file",
                    variant: "destructive"
                });
                return;
            }

            await uploadBeforeMutation.mutateAsync({
                subContractId: (initialData as any)?._id!,
                files: beforeWorkFiles,
            });

            refetch?.()

            toast({
                title: "Success",
                description: "Before work files uploaded successfully"
            });
            setBeforeWorkFiles([])
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to upload files",
                variant: "destructive"
            });
        }
    };


    const handleUpdateSubmit = async (e: any) => {
        try {
            e.preventDefault()
            await updateMutatation({
                subContractId: (initialData as any)?._id!,
                workerData: formData,
            });

            refetch?.()
            setIsEditing(false)

            toast({
                title: "Success",
                description: "Updated successfully"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to upload files",
                variant: "destructive"
            });
        }
    };






    // --- FORM HANDLERS ---

    const handleProjectChange = (value: string | null) => {
        const selectedProject = projectOptions?.find((p: any) => p.value === value);
        setFormData(prev => ({ ...prev, projectId: value || "", projectName: selectedProject?.label || "" }));
    };

    // const handleChange = (field: keyof SubContractFormData, value: string | number) => {
    //     setFormData(prev => ({ ...prev, [field]: value }));

    //     if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: "" }));
    // };


    const handleChange = (field: keyof SubContractFormData, value: string | number) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            if (field === "labourCost" || field === "materialCost") {
                const labour = Number(updated.labourCost) || 0;
                const material = Number(updated.materialCost) || 0;
                updated.totalCost = labour + material;
            }

            return updated;
        });

        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: "" }));
        }
    };


    const handleFileChange = (field: 'filesBeforeWork' | 'filesAfterWork', newFiles: File[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as any[]).filter(f => typeof f === 'string'), ...newFiles]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        setFormData({
            projectId: "", projectName: "", workerName: "", workName: "", dateOfCommencement: "",
            dateOfCompletion: "", labourCost: 0, materialCost: 0, totalCost: 0,
            filesBeforeWork: [], filesAfterWork: [],
        })
        // After submission in 'view' mode, we switch back to not editing
        if (mode === 'view') setIsEditing(false);
    };

    const handleCancel = () => {
        if (mode === 'view') {
            setIsEditing(false);
            resetFormToInitial(); // Discard changes
        } else if (onCancel) {
            onCancel(); // For create mode to navigate back
        }
    };

    const fields = [
        { name: "workerName", label: "Worker Name", type: "text" },
        { name: "workName", label: "Work Name", type: "text" },
        { name: "dateOfCommencement", label: "Date of Commencement", type: "date" },
        { name: "dateOfCompletion", label: "Date of Completion", type: "date" },
        { name: "labourCost", label: "Labour Cost", type: "number" },
        { name: "materialCost", label: "Material Cost", type: "number" },
        { name: "totalCost", label: "Total Cost", type: "number" },
    ];

    return (
        <Card className="w-full max-w-full !shadow-none bg-brand-surface border-0">
            <CardContent className="p-6">
                <form onSubmit={
                    mode === "create" ?
                        handleSubmit
                        : handleUpdateSubmit
                }>
                    <div>
                        {(mode === 'view' && !isEditing && canEdit) && (
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-ash-light">
                                <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                                    <i className="fas fa-file-signature text-text-muted"></i>
                                    Contract Details
                                </h2>
                                <Button type="button" variant="white" onClick={() => setIsEditing(true)}
                                    className="border-ash-medium shadow-sm text-text-main hover:text-action-primary">
                                    <i className="fas fa-edit mr-2" />
                                    Edit Details
                                </Button>
                            </div>
                        )}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:col-span-2 gap-x-8 gap-y-6 bg-brand-surface">
                        <div className="space-y-2">
                            {/* <Label>Project</Label> */}
                            <Label className=" font-bold text-text-muted">Project</Label>
                            {isEditing ? (
                                <SearchSelectNew options={projectOptions} value={formData.projectId || undefined} onValueChange={handleProjectChange} placeholder="Select a project..." />
                            ) : (
                                // <p className="text-gray-800 font-medium p-2 bg-gray-50 rounded-md min-h-[40px] flex items-center">{formData.projectName || "N/A"}</p>
                                <p className="text-text-main text-sm font-bold p-2 bg-brand-ash border border-ash-medium rounded-lg min-h-[40px] flex items-center shadow-sm">
                                    {formData.projectName || "N/A"}
                                </p>
                            )}
                        </div>

                        {fields.map(({ name, label, type }) => {
                            const key = name as keyof Omit<SubContractFormData, "filesBeforeWork" | "filesAfterWork">; // 🔥 FIX HERE
                            const isTotal = name === "totalCost";

                            return (
                                <div className="space-y-2" key={name}>
                                    <Label htmlFor={name}>{label}</Label>

                                    {isEditing ? (
                                        isTotal ? (
                                            // 👉 READ-ONLY DISPLAY FOR TOTAL COST
                                            // <p className="p-2 bg-gray-100 text-gray-900 rounded-md font-semibold">
                                            //     {formData?.totalCost ?? 0}
                                            // </p>
                                            <p className="p-2 bg-brand-ash/50 border border-ash-light text-text-main text-sm rounded-lg font-bold flex items-center">
                                                <i className="fas fa-rupee-sign mr-1 text-text-muted text-[10px]"></i> {formData?.totalCost ?? 0}
                                            </p>
                                        ) : (
                                            // 👉 NORMAL INPUT FOR ALL OTHER FIELDS
                                            <Input
                                                id={name}
                                                type={type}
                                                value={formData[key] as any}
                                                onChange={(e) =>
                                                    handleChange(
                                                        name as keyof SubContractFormData,
                                                        e.target.value
                                                    )
                                                }
                                                // className={errors[name] ? "border-red-500" : ""}
                                                className={`bg-brand-surface border-ash-medium text-text-main focus:ring-2 focus:ring-ash-medium shadow-sm transition-all  ${errors[name] ? "border-action-danger ring-1 ring-action-danger" : ""}`}
                                            />
                                        )
                                    ) : (
                                        // 👉 VIEW MODE
                                        <p className="text-text-main font-medium p-2 bg-brand-ash border border-ash-medium rounded-md min-h-[40px] flex items-center">
                                            {(() => {
                                                const value = formData[key];

                                                if (name.includes("date") && typeof value === "string") {
                                                    return new Date(value).toLocaleDateString();
                                                }

                                                if (Array.isArray(value)) {
                                                    return value.map((f) => (f as File).name).join(", ") || "No files";
                                                }

                                                return value || "N/A";
                                            })()}
                                        </p>
                                    )}
                                </div>
                            )
                        })}

                        {mode === "create" && <div className="space-y-2 md:col-span-2 lg:col-span-3 pt-4 border-t border-ash-light">
                            <Label htmlFor="filesBeforeWork" className="text-[10px] font-bold  text-text-muted">Files Before Work</Label>

                            {isEditing && (
                                <Input id="filesBeforeWork" type="file" multiple onChange={(e) => handleFileChange('filesBeforeWork', Array.from(e.target.files || []))}
                                    className="w-full bg-brand-ash border border-ash-medium text-text-main file:bg-brand-surface file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1.5 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all shadow-sm"
                                />
                            )}

                        </div>}


                        {isEditing && mode === "view" && (
                            // <div className="flex justify-end gap-4 pt-8 mt-4">
                            //     <Button type="button" variant="outline" onClick={handleCancel}>
                            //         <i className="fas fa-times mr-2"></i>
                            //         Cancel
                            //     </Button>
                            //     <Button type="submit" isLoading={isLoading || updatePending}>
                            //         {isLoading ? (
                            //             <><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>
                            //         ) : (
                            //             <><i className={`fas fa-save mr-2`}></i>Save Changes</>
                            //         )}
                            //     </Button>
                            // </div>

                            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-ash-light">
                                <Button type="button" variant="white" onClick={handleCancel} className="border-ash-medium text-text-main shadow-sm">
                                    <i className="fas fa-times mr-2"></i> Cancel
                                </Button>
                                <Button type="submit" variant="dark" isLoading={isLoading || updatePending} className="shadow-sm px-4">
                                    {isLoading ? (
                                        <><i className="fas fa-circle-notch fa-spin mr-2"></i>Saving...</>
                                    ) : (
                                        <><i className={`fas fa-save mr-2`}></i>Save Changes</>
                                    )}
                                </Button>
                            </div>
                        )}


                        {mode !== "create" &&
                            <>
                                <Card className="col-span-3 !shadow-xs bg-brand-surface border border-ash-medium">
                                    <CardHeader className="bg-brand-ash/50 border-b border-ash-light pb-4">
                                        <CardTitle className="flex items-center text-base font-bold text-text-main">
                                            <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm mr-3">
                                                <i className="fas fa-camera-retro text-indigo-500 text-sm"></i>
                                            </div>
                                            Before-Work Progress Pictures
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-xs font-medium text-text-muted">
                                            Document the initial site condition before starting work.
                                        </p>
                                        <div className="space-y-2">
                                            <Label htmlFor="afterWorkUpload">Select Files</Label>
                                            <Input
                                                id="beforeFiles"
                                                type="file"
                                                multiple
                                                onChange={(e) => setBeforeWorkFiles(Array.from(e.target.files || []))}
                                                className="w-full bg-brand-surface border-ash-medium text-text-main file:bg-brand-ash file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all shadow-sm"
                                            />
                                        </div>

                                        {/* Preview for the new files to be uploaded */}
                                        {/* {beforeWorkFiles.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {beforeWorkFiles.map((file, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`upload-preview ${index}`}
                                                        className="w-full h-full object-cover rounded-md border"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )} */}


                                        {initialData?.filesBeforeWork.some((file: SubContractFile) => file.type === "image") && (
                                            <div className="mb-6 border-t border-ash-light">
                                                <div className="flex items-center gap-2 mb-3">
                                                    {/* <i className="fas fa-images text-purple-600"></i>
                                                    <h4 className="font-semibold text-gray-800 text-sm">Images</h4> */}

                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                                                        <i className="fas fa-images text-text-main"></i> Uploaded Images
                                                    </h4>

                                                    <span className="text-[10px] font-bold bg-indigo-100 text-text-main px-2 py-0.5 rounded-full border border-ash-light">
                                                        {initialData?.filesBeforeWork.filter((f: any) => f.type === "image").length}
                                                    </span>
                                                </div>
                                                <ImageGalleryExample
                                                    imageFiles={initialData?.filesBeforeWork?.filter((file: SubContractFile) => file.type === "image")}
                                                    height={150}
                                                    minWidth={150}
                                                    maxWidth={200}
                                                />
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <Button onClick={handleBeforeUploads}
                                                isLoading={uploadBeforeMutation.isPending}
                                                disabled={uploadBeforeMutation.isPending || beforeWorkFiles.length === 0}
                                                variant="dark"
                                                className="w-full sm:w-auto shadow-sm shrink-0"
                                            >
                                                {uploadBeforeMutation.isPending ? (
                                                    <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</>
                                                ) : (
                                                    <><i className="fas fa-cloud-upload-alt mr-2"></i>Upload Files</>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>



                                {/* --- Separate Component for After Work Upload --- */}
                                {/* <Card className="col-span-3 !shadow-xs">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-lg">
                                            <i className="fas fa-camera-retro mr-3 text-purple-600"></i>
                                            Upload After-Work Pictures
                                        </CardTitle>
                                    </CardHeader> */}

                                <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden">
                                    <CardHeader className="bg-brand-ash/50 border-b border-ash-light pb-4">
                                        <CardTitle className="flex items-center text-base font-bold text-text-main">
                                            <div className="w-8 h-8 rounded bg-brand-main/50 border border-ash-light flex items-center justify-center shrink-0 shadow-sm mr-3">
                                                <i className="fas fa-camera text-text-muted text-sm"></i>
                                            </div>
                                            After-Work Completion Pictures
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
                                                className="w-full bg-brand-surface border-ash-medium text-text-main file:bg-brand-ash file:text-text-main file:border-ash-medium file:rounded-md file:px-3 file:py-1 file:mr-3 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ash-medium transition-all shadow-sm"
                                            />
                                        </div>

                                        {/* Preview for the new files to be uploaded */}
                                        {/* {afterWorkFiles.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {afterWorkFiles.map((file, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`upload-preview ${index}`}
                                            className="w-full h-full object-cover rounded-md border"
                                        />
                                    </div>
                                ))}
                            </div>
                        )} */}


                                        {initialData?.filesAfterWork.some((file: SubContractFile) => file.type === "image") && (
                                            <div className="mb-6 border-t border-ash-light">
                                                <div className="flex items-center gap-2 mb-3">
                                                    {/* <i className="fas fa-images text-purple-600"></i>
                                                    <h4 className="font-semibold text-gray-800 text-sm">Images</h4> */}

                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                                                        <i className="fas fa-images text-text-main"></i> Uploaded Images
                                                    </h4>

                                                    <span className="text-[10px] font-bold bg-indigo-100 text-text-main px-2 py-0.5 rounded-full border border-ash-light">
                                                        {initialData?.filesBeforeWork.filter((f: any) => f.type === "image").length}
                                                    </span>
                                                </div>
                                                <ImageGalleryExample
                                                    imageFiles={initialData?.filesAfterWork?.filter((file: SubContractFile) => file.type === "image")}
                                                    height={150}
                                                    minWidth={150}
                                                    maxWidth={200}
                                                />
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <Button onClick={handleAfterUploads}
                                                isLoading={uploadAfterMutation.isPending}
                                                disabled={uploadAfterMutation.isPending || afterWorkFiles.length === 0}
                                                variant="dark"
                                                className="w-full sm:w-auto shadow-sm shrink-0"
                                            >
                                                {uploadAfterMutation.isPending ? (
                                                    <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</>
                                                ) : (
                                                    <><i className="fas fa-cloud-upload-alt mr-2"></i>Upload Files</>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        }


                    </div>

                    {isEditing && mode === "create" && (
                        // <div className="flex justify-end gap-4 pt-8 mt-4 ">
                        //     {mode !== "create" && 
                        //     <Button type="button" variant="outline" onClick={handleCancel}>
                        //         <i className="fas fa-times mr-2"></i>
                        //         Cancel
                        //     </Button>}
                        //     <Button type="submit" isLoading={isLoading || updatePending}>
                        //         {isLoading ? (
                        //             <><i className="fas fa-spinner fa-spin mr-2"></i>{mode === 'create' ? 'Creating...' : 'Saving...'}</>
                        //         ) : (
                        //             <><i className={`fas ${mode === 'create' ? 'fa-check' : 'fa-save'} mr-2`}></i>{mode === 'create' ? 'Create Contract' : 'Save Changes'}</>
                        //         )}
                        //     </Button>
                        // </div>

                        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-ash-light">
                            <Button type="button" variant="white" onClick={handleCancel} className="border-ash-medium text-text-main shadow-sm">
                                <i className="fas fa-times mr-2"></i> Cancel
                            </Button>
                            <Button type="submit" variant="dark" isLoading={isLoading || updatePending} className="shadow-sm px-8">
                                <i className={`fas fa-check mr-2`}></i>Create Contract
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default SubContractForm;