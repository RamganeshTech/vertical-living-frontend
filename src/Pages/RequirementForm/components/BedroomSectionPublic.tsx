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
import { Button } from "../../../components/ui/Button";

const BedroomSectionPublic = ({ formData, setFormData }: any) => {
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
      bedroom: {
        ...prev.bedroom,
        [name]: finalValue,
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


  const handleResetBedroom = () => {
    setFormData((prev: any) => ({
      ...prev,
      bedroom: {
        numberOfBedrooms: null,
        bedType: null,
        wardrobeIncluded: null,
        falseCeilingRequired: null,
        tvUnitRequired: null,
        studyTableRequired: null,
        bedroomPackage: null,
        notes: null,
      }, // or {} if you prefer to use empty object instead of null
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Bedroom Requirements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
        {/* Number of Bedrooms */}
        <div>
          <Label>Number of Bedrooms</Label>
          <Input
            type="number"
            name="numberOfBedrooms"
            value={formData?.bedroom?.numberOfBedrooms}
            onChange={handleChange}
            placeholder="e.g., 2"
          />
        </div>

        {/* Bed Type */}
        <div>
          <Label>Bed Type</Label>
          <Select
            onValueChange={(val) => handleSelectChange("bedType", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bed type" selectedValue={formData?.bedroom?.bedType || ""} />
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
            id="wardrobeIncluded"
            checked={formData?.bedroom?.wardrobeIncluded || false}
            onChange={handleChange}
          />
          <Label htmlFor="wardrobeIncluded">Wardrobe Included?</Label>
        </div>

        {/* False Ceiling Required */}
        <div className="flex items-center gap-2">
          <input
            id="falseCeilingRequired"
            type="checkbox"
            name="falseCeilingRequired"
            checked={formData?.bedroom?.falseCeilingRequired || false}
            onChange={handleChange}
          />
          <Label htmlFor="falseCeilingRequired">False Ceiling Required?</Label>
        </div>

        {/* TV Unit Required */}
        <div className="flex items-center gap-2">
          <input
            id="tvUnitRequired"
            type="checkbox"
            name="tvUnitRequired"
            checked={formData?.bedroom?.tvUnitRequired || false}
            onChange={handleChange}
          />
          <Label htmlFor="tvUnitRequired">TV Unit Required?</Label>
        </div>

        {/* Study Table Required */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="studyTableRequired"
            id="studyTableRequired"
            checked={formData?.bedroom?.studyTableRequired || false}
            onChange={handleChange}
          />
          <Label htmlFor="studyTableRequired">Study Table Required?</Label>
        </div>

        {/* Bedroom Package */}
        <div>
          <Label>Bedroom Package</Label>
          <Select
            // value={formData?.bedroom?.bedroomPackage || ""}
            onValueChange={(val) => handleSelectChange("bedroomPackage", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData?.bedroom?.bedroomPackage || ""} />
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

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={handleResetBedroom}
        >
          <i className="fa-solid fa-rotate-left mr-2"></i> Reset Bedroom Section
        </Button>
      </div>

      {/* <Separator className="my-6" /> */}
    </div>
  );
};

export default memo(BedroomSectionPublic);
