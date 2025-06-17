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

const BedroomSectionPublic = ({ formData, setFormData }: any) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

   const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const newValue = type === "checkbox" ? (target as HTMLInputElement).checked : value;

    setFormData((prev: any) => ({
      ...prev,
      bedroom: {
        ...prev.bedroom,
        [name]: type === "number" ? parseInt(newValue as string) || "" : newValue,
      },
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      bedroom: {
        ...prev.bedroom,
        [name]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Bedroom Requirements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Number of Bedrooms */}
        <div>
          <Label>Number of Bedrooms</Label>
          <Input
            type="number"
            name="numberOfBedrooms"
            value={formData?.bedroom?.numberOfBedrooms || ""}
            onChange={handleChange}
            placeholder="e.g., 2"
          />
        </div>

        {/* Bed Type */}
        <div>
          <Label>Bed Type</Label>
          <Select
            value={formData?.bedroom?.bedType || ""}
            onValueChange={(val) => handleSelectChange("bedType", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bed type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Double">Double</SelectItem>
              <SelectItem value="Queen">Queen</SelectItem>
              <SelectItem value="King">King</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wardrobe Included */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="wardrobeIncluded"
            checked={formData?.bedroom?.wardrobeIncluded || false}
            onChange={handleChange}
          />
          <Label>Wardrobe Included?</Label>
        </div>

        {/* False Ceiling Required */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="falseCeilingRequired"
            checked={formData?.bedroom?.falseCeilingRequired || false}
            onChange={handleChange}
          />
          <Label>False Ceiling Required?</Label>
        </div>

        {/* TV Unit Required */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="tvUnitRequired"
            checked={formData?.bedroom?.tvUnitRequired || false}
            onChange={handleChange}
          />
          <Label>TV Unit Required?</Label>
        </div>

        {/* Study Table Required */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="studyTableRequired"
            checked={formData?.bedroom?.studyTableRequired || false}
            onChange={handleChange}
          />
          <Label>Study Table Required?</Label>
        </div>

        {/* Bedroom Package */}
        <div>
          <Label>Bedroom Package</Label>
          <Select
            value={formData?.bedroom?.bedroomPackage || ""}
            onValueChange={(val) => handleSelectChange("bedroomPackage", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essentials">Essentials</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Build Your Own Package">Build Your Own Package</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <Label>Additional Notes</Label>
          <Textarea
            name="notes"
            value={formData?.bedroom?.notes || ""}
            onChange={handleChange}
            placeholder="Add any specific requirements or comments"
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="my-6" />
    </div>
  );
};

export default memo(BedroomSectionPublic);
