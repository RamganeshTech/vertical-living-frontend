import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateModularUnit, useUpdateModularUnit } from "../../apiList/Modular Unit Api/ModularUnitApi";
import { modularUnitFieldConfig } from "../../utils/Modular Units/fieldConfigs";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from './../../components/ui/Select';
import { toast } from "../../utils/toast";


type AddModularUnitProps = {
    unitToEdit?: any;
};

const disallowedKeysForEdit = [
  "_id",
  "organizationId",
  "customId",
  "images",
  "createdAt",
  "updatedAt",
  "__v",
];

export default function AddModularUnit({ unitToEdit }: AddModularUnitProps) {
    const { organizationId } = useParams() as { organizationId: string }

    // const [unitType, setUnitType] = useState<string>("showcase")
    const [category, setCategory] = useState<string>(unitToEdit?.category || "showcase");

    console.log("unitType",unitToEdit)
    const config = modularUnitFieldConfig[category];
    // const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [formValues, setFormValues] = useState<Record<string, any>>(unitToEdit || {});
    const [files, setFiles] = useState<File[]>([]);

    const { mutateAsync: createUnit, isPending: isCreating } = useCreateModularUnit();
    const { mutateAsync: updateUnit, isPending: isUpdating } = useUpdateModularUnit();

    // useEffect(() => {
    //     if (unitToEdit) {
    //         setFormValues(unitToEdit);
    //         setUnitType(unitToEdit.unitType);
    //     }
    // }, [unitToEdit]);

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

    
const sanitizeFormValues = (data: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !disallowedKeysForEdit.includes(key))
  );
};


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!formValues.name) {
                throw new Error("Name is required");
            }

            if (!formValues.price || formValues.price < 0) {
                throw new Error("Enter valid price");
            }
            
            // setFormValues(p => ({ ...p, category: category }))
                const updatedFormValues = { ...formValues, category };


            if (unitToEdit) {
                      const sanitized = sanitizeFormValues(updatedFormValues);

                await updateUnit({
                    unitId: unitToEdit._id,
                    formValues: sanitized,
                    unitType: category,
                    files,
                });
                toast({ title: "Success", description: "Product updated successfully" });
            } else {
                await createUnit({ organizationId, unitType: category, formValues:updatedFormValues, files });
                toast({ title: "Success", description: "Product added successfully" });
            }

            // await mutateAsync({ organizationId, unitType, formValues, files });
            //   navigate("/modularunits");
            // toast({ title: "Success", description: "Product Added Successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "operation failed", variant: "destructive" })

        }
    };


    const handleUnitChange = (val: string) => {
        setCategory(val)
        setFormValues({})
        setFiles([])
    }

    return (
        <div className="p-6 max-w-full mx-auto overflow-y-auto max-h-full">


            <div className="mb-4 flex justify-between">
                <h1 className="text-xl font-semibold mb-4">
                    {unitToEdit ? "Edit" : "Add New"} {category} Unit
                </h1>
                {/* <div className=" flex  items-center gap-4 ">
                    <label className="block mb-1 font-medium">Select Unit Type</label>
                    <Select value={unitType} onValueChange={(val) => handleUnitChange(val)}>
                        <SelectTrigger className="min-w-[150px]">
                            <SelectValue placeholder="Choose Unit Type" selectedValue={unitType} />
                        </SelectTrigger>
                        <SelectContent className="min-w-[150px]">
                            {Object.keys(modularUnitFieldConfig).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div> */}
                {!unitToEdit && (
                    <div className="flex items-center gap-4">
                        <label className="font-medium">Select Unit Type</label>
                        <Select value={category} onValueChange={handleUnitChange}>
                            <SelectTrigger className="min-w-[150px]">
                                <SelectValue placeholder="Choose Unit Type" selectedValue={category} />
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
                )}
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
                <section className="grid grid-cols-3 gap-2">
                    {Object.entries(config).map(([field, settings]) => {

                        if (settings.label === "Budget Range" || settings.label === "Price Range") {
                            return null;
                        }

                        return <div key={field}>
                            <Label>{settings.label}{settings.required && "*"}</Label>

                            {settings.type === "text" && (
                                <Input
                                    value={formValues[field] || ""}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    required={settings.required}
                                />
                            )}

                            {settings.type === "number" && (
                                <Input
                                    value={formValues[field] || ""}
                                    onChange={(e) => handleInputChange(field, +e.target.value)}
                                    required={settings.required}
                                />
                            )}

                            {settings.type === "select" && (
                                <Select onValueChange={(val) => handleInputChange(field, val)} value={formValues[field] || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select ${settings.label}`} selectedValue={formValues[field]} />
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
                    }
                    )}


                    <div>
                        <Label>Upload Images</Label>
                        <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
                    </div>
                </section>
                {/* <Button type="submit" className="mx-auto !block" disabled={isCreating}>
                    {isCreating ? "Saving..." : "Create Unit"}
                </Button> */}
                <Button type="submit" className="mx-auto block" disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating ? "Saving..." : unitToEdit ? "Update Unit" : "Create Unit"}
                </Button>
            </form>
        </div>
    );
}


