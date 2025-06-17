import React, { memo } from "react";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Separator } from "../../../components/ui/Seperator";
import { Textarea } from "../../../components/ui/TextArea";

const KitchenSectionPublic = ({ formData, setFormData }: any) => {
 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const target = e.target;
  const { name, type, value } = target;

  let finalValue: string | number | boolean = value;

  if (type === "checkbox") {
    finalValue = (target as HTMLInputElement).checked;
  } else if (type === "number") {
    finalValue = parseFloat(value) || "";
  }

  if (["A", "B", "C"].includes(name)) {
    setFormData((prev: any) => ({
      ...prev,
      kitchen: {
        ...prev.kitchen,
        measurements: {
          ...prev.kitchen?.measurements,
          [name]: finalValue,
        },
      },
    }));
  } else {
    setFormData((prev: any) => ({
      ...prev,
      kitchen: {
        ...prev.kitchen,
        [name]: finalValue,
      },
    }));
  }
};


  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      kitchen: {
        ...prev.kitchen,
        [name]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Kitchen Requirements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layout Type */}
        <div>
          <Label>Layout Type</Label>
          <Select
            value={formData?.kitchen?.layoutType || ""}
            onValueChange={(val) => handleSelectChange("layoutType", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L-shaped">L-shaped</SelectItem>
              <SelectItem value="Straight">Straight</SelectItem>
              <SelectItem value="U-shaped">U-shaped</SelectItem>
              <SelectItem value="Parallel">Parallel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kitchen Package */}
        <div>
          <Label>Kitchen Package</Label>
          <Select
            value={formData?.kitchen?.kitchenPackage || ""}
            onValueChange={(val) => handleSelectChange("kitchenPackage", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essentials">Essentials</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Build Your Own Package">
                Build Your Own Package
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Granite Countertop */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="graniteCountertop"
            checked={formData?.kitchen?.graniteCountertop || false}
            onChange={handleChange}
          />
          <Label>Granite Countertop?</Label>
        </div>

        {/* Number of Shelves */}
        <div>
          <Label>Number of Shelves</Label>
          <Input
            type="number"
            name="numberOfShelves"
            value={formData?.kitchen?.numberOfShelves || ""}
            onChange={handleChange}
            placeholder="e.g., 3"
          />
        </div>

        {/* Measurements */}
        <div>
          <Label>Measurement A (ft)</Label>
          <Input
            type="number"
            name="A"
            value={formData?.kitchen?.measurements?.A || ""}
            onChange={handleChange}
            placeholder="Length A"
          />
        </div>
        <div>
          <Label>Measurement B (ft)</Label>
          <Input
            type="number"
            name="B"
            value={formData?.kitchen?.measurements?.B || ""}
            onChange={handleChange}
            placeholder="Length B"
          />
        </div>
        <div>
          <Label>Measurement C (ft)</Label>
          <Input
            type="number"
            name="C"
            value={formData?.kitchen?.measurements?.C || ""}
            onChange={handleChange}
            placeholder="Length C"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <Label>Additional Notes</Label>
          <Textarea
            name="notes"
            value={formData?.kitchen?.notes || ""}
            onChange={handleChange}
            placeholder="Mention any additional kitchen preferences"
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="my-6" />
    </div>
  );
};

export default memo(KitchenSectionPublic);
