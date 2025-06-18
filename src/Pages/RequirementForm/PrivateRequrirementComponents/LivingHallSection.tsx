import React, { useState } from "react";
import type { ILivingHallRequirement } from "../../../types/types"; 
import type { PrivateRequriementFromProp } from "../RequriementForm";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/TextArea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { useParams } from "react-router-dom";
import { useLivingHallFormUpdation } from "../../../apiList/requirementFormApi";
import { toast } from "../../../utils/toast";

const LivingHallSection: React.FC<PrivateRequriementFromProp> = ({ data, isEditable, setVisibleSection }) => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState<ILivingHallRequirement>({
    seatingStyle: data?.seatingStyle || "Sofa Set",
    tvUnitDesignRequired: data?.tvUnitDesignRequired || false,
    falseCeilingRequired: data?.falseCeilingRequired || false,
    wallDecorStyle: data?.wallDecorStyle || "Paint",
    numberOfFans: data?.numberOfFans || 0,
    numberOfLights: data?.numberOfLights || 0,
    livingHallPackage: data?.livingHallPackage || "Essentials",
    notes: data?.notes || "",
  });

  const { mutateAsync, isPending } = useLivingHallFormUpdation();

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

  const handleSelectChange = (name: keyof ILivingHallRequirement, value: string) => {
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
     toast({ title: "Success", description: "Living Hall data updated successfully" })
     }
     catch(error:any){
         toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to generate invitation link", variant: "destructive" })
     }
   };

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 shadow border border-blue-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Living Hall Requirements</h2>
        <button onClick={() => setVisibleSection(null)} className="text-blue-500 text-sm underline">
          <i className="fa-solid fa-arrow-left mr-1"></i>Back to Sections
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Seating Style</Label>
          <Select onValueChange={(val) => handleSelectChange("seatingStyle", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select seating style" selectedValue={formData.seatingStyle || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sofa Set">Sofa Set</SelectItem>
              <SelectItem value="L-Shaped Sofa">L-Shaped Sofa</SelectItem>
              <SelectItem value="Recliner Chairs">Recliner Chairs</SelectItem>
              <SelectItem value="Floor Seating">Floor Seating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Wall Decor Style</Label>
          <Select onValueChange={(val) => handleSelectChange("wallDecorStyle", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select wall decor" selectedValue={formData.wallDecorStyle || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paint">Paint</SelectItem>
              <SelectItem value="Wallpaper">Wallpaper</SelectItem>
              <SelectItem value="Wood Paneling">Wood Paneling</SelectItem>
              <SelectItem value="Stone Cladding">Stone Cladding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of Fans</Label>
          <Input type="number" name="numberOfFans" value={formData.numberOfFans} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Number of Lights</Label>
          <Input type="number" name="numberOfLights" value={formData.numberOfLights} onChange={handleChange} min={0} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="tvUnitDesignRequired" checked={formData.tvUnitDesignRequired} onChange={handleChange} />
          <Label>TV Unit Design Required</Label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="falseCeilingRequired" checked={formData.falseCeilingRequired} onChange={handleChange} />
          <Label>False Ceiling Required</Label>
        </div>

        <div>
          <Label>Package</Label>
          <Select onValueChange={(val) => handleSelectChange("livingHallPackage", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData.livingHallPackage || ""} />
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
          Save Living Hall Requirements
        </Button>
      </div>
    </div>
  );
};

export default LivingHallSection;
