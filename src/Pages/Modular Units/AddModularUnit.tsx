import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateModularUnit } from "../../apiList/Modular Unit Api/ModularUnitApi";
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from './../../components/ui/Select';

export default function AddModularUnit() {
    const { organizationId } = useParams() as { organizationId: string }
    // const location = useLocation();
    // const navigate = useNavigate();


    const [unitType, setUnitType] = useState<string>("showcase")
    const config = modularUnitFieldConfig[unitType];
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<File[]>([]);

    const { mutateAsync, isPending } = useCreateModularUnit();

    if (!config) {
        return <p className="text-red-500">Invalid unit type selected.</p>;
    }

    const handleInputChange = (field: string, value: any) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValues.name) {
            alert("Name is required");
            return;
        }
        try {
            await mutateAsync({ organizationId, unitType, formValues, files });
            //   navigate("/modularunits");
        } catch (err: any) {
            alert(err?.message || "Failed to create unit");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Add New {unitType} Unit</h1>


            <div className="mb-4">
                <label className="block mb-1 font-medium">Select Unit Type</label>
                <Select value={unitType} onValueChange={setUnitType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(modularUnitFieldConfig).map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(config).map(([field, settings]) => (
                    <div key={field}>
                        <Label>{settings.label}{settings.required && "*"}</Label>

                        {settings.type === "text" && (
                            <Input
                                value={formValues[field] || ""}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                required={settings.required}
                            />
                        )}

                        {settings.type === "select" && (
                            <Select onValueChange={(val) => handleInputChange(field, val)} value={formValues[field] || ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${settings.label}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {settings.options?.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {settings.type === "checkbox" && (
                            <div className="flex flex-wrap gap-2">
                                {settings.options?.map((option) => (
                                    <label key={option} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formValues[field]?.includes(option) || false}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormValues((prev) => {
                                                    const current = prev[field] || [];
                                                    return {
                                                        ...prev,
                                                        [field]: checked
                                                            ? [...current, option]
                                                            : current.filter((v: string) => v !== option),
                                                    };
                                                });
                                            }}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <div>
                    <Label>Upload Images</Label>
                    <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
                </div>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Create Unit"}
                </Button>
            </form>
        </div>
    );
}
