import React, { useState } from "react";
import type { IWardrobeRequirement } from "../../../types/types"; 
import type { PrivateRequriementFromProp } from "../RequriementForm";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/TextArea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { useParams } from "react-router-dom";
import { useWardrobeFormUpdation } from "../../../apiList/Stage Api/requirementFormApi";
import { toast } from "../../../utils/toast";

const WardrobeSection: React.FC<PrivateRequriementFromProp> = ({ data, isEditable, setVisibleSection }) => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState<IWardrobeRequirement>({
    wardrobeType: data?.wardrobeType || "Sliding",
    lengthInFeet: data?.lengthInFeet || 0,
    heightInFeet: data?.heightInFeet || 0,
    mirrorIncluded: data?.mirrorIncluded || false,
    wardrobePackage: data?.wardrobePackage || "Essentials",
    numberOfShelves: data?.numberOfShelves || 0,
    numberOfDrawers: data?.numberOfDrawers || 0,
    notes: data?.notes || "",
  });

  const { mutateAsync, isPending } = useWardrobeFormUpdation();

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
  

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, type, value, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

  const handleSelectChange = (name: keyof IWardrobeRequirement, value: string) => {
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
     toast({ title: "Success", description: "Wardrobe data updated successfully" })
     }
     catch(error:any){
         toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to generate invitation link", variant: "destructive" })
     }
   };

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 shadow border border-blue-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Wardrobe Requirements</h2>
        <button onClick={() => setVisibleSection(null)} className="text-blue-500 text-sm underline">
          <i className="fa-solid fa-arrow-left mr-1"></i>Back to Sections
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Wardrobe Type</Label>
          <Select onValueChange={(val) => handleSelectChange("wardrobeType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select wardrobe type" selectedValue={formData.wardrobeType || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sliding">Sliding</SelectItem>
              <SelectItem value="Openable">Openable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Length (in feet)</Label>
          <Input type="number" name="lengthInFeet" value={formData.lengthInFeet || 0} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Height (in feet)</Label>
          <Input type="number" name="heightInFeet" value={formData.heightInFeet || 0} onChange={handleChange} min={0} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="mirrorIncluded" checked={formData.mirrorIncluded} onChange={handleChange} />
          <Label>Mirror Included</Label>
        </div>

        <div>
          <Label>Number of Shelves</Label>
          <Input type="number" name="numberOfShelves" value={formData.numberOfShelves || 0} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Number of Drawers</Label>
          <Input type="number" name="numberOfDrawers" value={formData.numberOfDrawers || 0} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Package</Label>
          <Select onValueChange={(val) => handleSelectChange("wardrobePackage", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData.wardrobePackage || ""} />
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
          Save Wardrobe Requirements
        </Button>
      </div>
    </div>
  );
};

export default WardrobeSection;
