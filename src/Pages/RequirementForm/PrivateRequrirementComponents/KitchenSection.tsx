import React, { useState } from "react";
import type { IKitchenRequirement } from "../../../types/types";
import type { PrivateRequriementFromProp } from "../RequriementForm";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/TextArea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { useParams } from "react-router-dom";
import { useKitchenFormUpdation } from "../../../apiList/Stage Api/requirementFormApi";
import { toast } from "../../../utils/toast";
import RequirementSectionUpload from "../components/RequirementSectionUpload";

const KitchenSection: React.FC<PrivateRequriementFromProp> = ({ data, setVisibleSection, sectionName }) => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState<IKitchenRequirement>({
    layoutType: data?.layoutType || "",
    measurements: data?.measurements || { top: 0, left: 0, right: 0 },
    kitchenPackage: data?.kitchenPackage || "",
    graniteCountertop: data?.graniteCountertop || false,
    numberOfShelves: data?.numberOfShelves || 0,
    notes: data?.notes || "",
  });

  const { mutateAsync, isPending } = useKitchenFormUpdation();

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

    if (["top", "left", "right"].includes(name)) {
      setFormData((prev: any) => ({
        ...prev,
        measurements: {
          ...prev?.measurements, [name]: finalValue,
        },
      }
      ));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  };

  const handleSelectChange = (name: keyof IKitchenRequirement, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!projectId) return;
      await mutateAsync({ projectId, updateData: formData });
      toast({ title: "Success", description: "Kitchen data updated successfully" })
    }
    catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to generate invitation link", variant: "destructive" })
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6 shadow border border-blue-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Kitchen Requirements</h2>
        <button onClick={() => setVisibleSection(null)} className="text-blue-500 text-sm underline">
          <i className="fa-solid fa-arrow-left mr-1"></i><span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Layout Type</Label>
          <Select onValueChange={(val) => handleSelectChange("layoutType", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select layout" selectedValue={formData.layoutType || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select Layout</SelectItem>
              <SelectItem value="L-shaped">L-shaped</SelectItem>
              <SelectItem value="Straight">Straight</SelectItem>
              <SelectItem value="U-shaped">U-shaped</SelectItem>
              <SelectItem value="Parallel">Parallel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Kitchen Package</Label>
          <Select onValueChange={(val) => handleSelectChange("kitchenPackage", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData.kitchenPackage || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select Package</SelectItem>
              <SelectItem value="Essentials">Essentials</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Build Your Own Package">Build Your Own Package</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="graniteCountertop" checked={formData.graniteCountertop ?? undefined} onChange={handleChange} />
          <Label>Granite Countertop</Label>
        </div>

        <div>
          <Label>Number of Shelves</Label>
          <Input type="number" name="numberOfShelves" value={formData.numberOfShelves || ""} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Measurement - Top (in feet)</Label>
          <Input type="number" name="top" value={formData.measurements?.top || 0} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Measurement - Left (in feet)</Label>
          <Input type="number" name="left" value={formData.measurements?.left || 0} onChange={handleChange} min={0} />
        </div>

        <div>
          <Label>Measurement - Right (in feet)</Label>
          <Input type="number" name="right" value={formData.measurements?.right || 0} onChange={handleChange} min={0} />
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



      <RequirementSectionUpload
        projectId={projectId!}
        sectionName={sectionName}
        existingUploads={data?.uploads  || []}
      />

      <div className="pt-4">
        <Button onClick={handleSubmit} isLoading={isPending} className="bg-blue-600 text-white w-full md:w-auto">
          Save Kitchen Requirements
        </Button>
      </div>
    </div>
  );
};

export default KitchenSection;