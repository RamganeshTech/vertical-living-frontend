import { useState, useEffect } from "react";



import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { useGetProjects } from "../../apiList/projectApi";
import type { AvailableProjetType } from "../Department Pages/Logistics Pages/LogisticsShipmentForm";
import SearchSelectNew from "../../components/ui/SearchSelectNew";


interface SubContractFormProps {
    mode: "create" | "edit";
    organizationId: string
    initialData?: {
        projectId: {
            _id: string,
            projectName: string
        };
        workName: string;
    };
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const SubContractForm = ({ organizationId, mode, initialData, onSubmit, isLoading }: SubContractFormProps) => {
    const [formData, setFormData] = useState({
        projectId: "",
        projectName: "",
        workName: ""
    });

    const { data: projectsData } = useGetProjects(organizationId!);
    const projects = projectsData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));


    const projectOptions = (projectsData || [])?.map((project: AvailableProjetType) => ({
        value: project._id,
        label: project.projectName
    }))

    useEffect(() => {
        if (projects && projects.length > 0 && !formData.projectId) {
            setFormData(p => ({ ...p, projectId: projects[0]._id }));
        }
    }, [projects,]);



    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                projectId: initialData.projectId._id,
                projectName: initialData.projectId.projectName,
                workName: initialData.workName
            });
        }
    }, [initialData]);


    const handleProjectChange = (value: string | null) => {
        const selectedProject = projects?.find((project: any) => project._id === value)
        setFormData((prev) => ({
            ...prev,
            projectId: value || "",
            projectName: selectedProject?.customerName || ""
        }))
    }

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.projectId.trim()) {
            newErrors.projectId = "Project ID is required";
        }
        if (!formData.workName.trim()) {
            newErrors.workName = "Work name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <Card className="w-full max-w-full !shadow-none">
            {/* <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <i className={`fas ${mode === 'create' ? 'fa-plus-circle' : 'fa-edit'} mr-2 text-blue-600`}></i>
                    {mode === 'create' ? 'Create Sub Contract' : 'Edit Sub Contract'}
                </CardTitle>
            </CardHeader> */}
            <CardContent className="">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">

                        <Label>Select project</Label>
                        <SearchSelectNew
                            options={projectOptions}
                            placeholder="Select project"
                            searchPlaceholder="Search projects..."
                            value={formData.projectId || undefined}
                            onValueChange={(value) => handleProjectChange(value)}
                            searchBy="name"
                            displayFormat="simple"
                            className="w-full"
                        />


                        {errors.projectId && (
                            <p className="text-sm text-red-500 mt-1">
                                <i className="fas fa-exclamation-circle mr-1"></i>
                                {errors.projectId}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="workName">
                            <i className="fas fa-briefcase mr-2"></i>
                            Work Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="workName"
                            type="text"
                            placeholder="Enter work name"
                            value={formData.workName}
                            onChange={(e) => handleChange('workName', e.target.value)}
                            className={errors.workName ? 'border-red-500' : ''}
                        />
                        {errors.workName && (
                            <p className="text-sm text-red-500 mt-1">
                                <i className="fas fa-exclamation-circle mr-1"></i>
                                {errors.workName}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline">
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                <>
                                    <i className={`fas ${mode === 'create' ? 'fa-check' : 'fa-save'} mr-2`}></i>
                                    {mode === 'create' ? 'Create Contract' : 'Update Contract'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SubContractForm;