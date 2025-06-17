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
       const parsedValue = parseFloat(value);
    finalValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue); // ✅ ensure value >= 0
   }

  if (["top", "left", "right"].includes(name)) {
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
            // value={formData?.kitchen?.layoutType || ""}
            onValueChange={(val) => handleSelectChange("layoutType", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" selectedValue={formData?.kitchen?.layoutType || ""} />
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
            // value={formData?.kitchen?.kitchenPackage || ""}
            onValueChange={(val) => handleSelectChange("kitchenPackage", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData?.kitchen?.kitchenPackage || ""} />
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

      

        {/* Number of Shelves */}
        <div>
          <Label>Number of Shelves</Label>
          <Input
            type="number"
            name="numberOfShelves"
            value={formData?.kitchen?.numberOfShelves}
            onChange={handleChange}
            placeholder="e.g., 3"
          />
        </div>

        {/* Measurements */}
        <div>
          <Label>Measurement Top (ft)</Label>
          <Input
            type="number"
            name="top"
            value={formData?.kitchen?.measurements?.top ?? 0}
            onChange={handleChange}
            placeholder="Length Top"
          />
        </div>
        <div>
          <Label>Measurement Left (ft)</Label>
          <Input
            type="number"
            name="left"
            value={formData?.kitchen?.measurements?.left}
            onChange={handleChange}
            placeholder="Length Left"
          />
        </div>
        <div>
          <Label>Measurement Right (ft)</Label>
          <Input
            type="number"
            name="right"
            value={formData?.kitchen?.measurements?.right}
            onChange={handleChange}
            placeholder="Length right"
          />
        </div>

          {/* Granite Countertop */}
        <div className="flex  items-center">
          <input
          id="graniteCountertop"
            type="checkbox"
            name="graniteCountertop"
            checked={formData?.kitchen?.graniteCountertop || false}
            onChange={handleChange}
            className="!w-[10%]"
          />
          <Label htmlFor="graniteCountertop">Granite Countertop?</Label>
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
