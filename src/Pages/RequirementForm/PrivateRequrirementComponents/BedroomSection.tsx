import React, { useState } from "react";
import type { IBedroomRequirement } from "../../../types/types"; 
import type { PrivateRequriementFromProp } from "../RequriementForm";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/TextArea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { useParams } from "react-router-dom";
import { useBedroomFormUpdation } from "../../../apiList/Stage Api/requirementFormApi";
import { toast } from "../../../utils/toast";

const BedroomSection: React.FC<PrivateRequriementFromProp> = ({ data, isEditable, setVisibleSection }) => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState<IBedroomRequirement>({
    numberOfBedrooms: data?.numberOfBedrooms || 1,
    bedType: data?.bedType || "Queen",
    wardrobeIncluded: data?.wardrobeIncluded || false,
    falseCeilingRequired: data?.falseCeilingRequired || false,
    tvUnitRequired: data?.tvUnitRequired || false,
    studyTableRequired: data?.studyTableRequired || false,
    bedroomPackage: data?.bedroomPackage || "Essentials",
    notes: data?.notes || "",
  });

  const { mutateAsync, isPending} = useBedroomFormUpdation();

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const target = e.target;
    const { name, type, value } = target;
  
    let finalValue: string | number | boolean = value;
  
    if (type === "checkbox") {
      finalValue = (target as HTMLInputElement).checked;
    } else if (type === "number") {
         const parsedValue = parseFloat(value);
      finalValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue); // ✅ ensure value >= 0
     }
      setFormData((prev: any) => ({
        ...prev,
          [name]: finalValue,
      }));
    };

  const handleSelectChange = (name: keyof IBedroomRequirement, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try{
    if (!projectId) return;
    const data = await mutateAsync({ projectId, updateData: formData });
    console.log(data)
    toast({ title: "Success", description: "bedroom data updated successfully" })
    }
    catch(error:any){
        toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to generate invitation link", variant: "destructive" })
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 shadow border border-blue-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Bedroom Requirements</h2>
        <button onClick={() => setVisibleSection(null)} className="text-blue-500 text-sm underline">
          <i className="fa-solid fa-arrow-left mr-1"></i>Back to Sections
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Number of Bedrooms</Label>
          <Input type="number" name="numberOfBedrooms" value={formData.numberOfBedrooms ?? ""} onChange={handleChange} min={1} />
        </div>

        <div>
          <Label>Bed Type</Label>
          <Select onValueChange={(val) => handleSelectChange("bedType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select bed type" selectedValue={formData.bedType || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Double">Double</SelectItem>
              <SelectItem value="Queen">Queen</SelectItem>
              <SelectItem value="King">King</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="wardrobeIncluded" checked={formData.wardrobeIncluded ?? undefined} onChange={handleChange} />
          <Label>Wardrobe Included</Label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="falseCeilingRequired" checked={formData.falseCeilingRequired ?? undefined} onChange={handleChange} />
          <Label>False Ceiling Required</Label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="tvUnitRequired" checked={formData.tvUnitRequired ?? undefined} onChange={handleChange} />
          <Label>TV Unit Required</Label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="studyTableRequired" checked={formData.studyTableRequired ?? undefined} onChange={handleChange} />
          <Label>Study Table Required</Label>
        </div>

        <div>
          <Label>Package</Label>
          <Select onValueChange={(val) => handleSelectChange("bedroomPackage", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData.bedroomPackage || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essentials">Essentials</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Build Your Own Package">Build Your Own Package</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Additional Notes</Label>
          <Textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            placeholder="Add any specific requirements or comments"
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSubmit} isLoading={isPending} className="bg-blue-600 text-white w-full md:w-auto">
          Save Bedroom Requirements
        </Button>
      </div>
    </div>
  );
};

export default BedroomSection;
