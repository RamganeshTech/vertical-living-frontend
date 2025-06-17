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

const WardrobeSectionPublic = ({ formData, setFormData }: any) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

     const { name, value, type } = e.target;

    let finalValue: string | number | boolean = value;
      if (type === "checkbox") {
    finalValue = (e.target as HTMLInputElement).checked;
  } else if (type === "number") {
      const parsedValue = parseFloat(value);
      finalValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue); // ✅ ensure value >= 0
    }



    setFormData((prev: any) => ({
      ...prev,
      wardrobe: {
        ...prev.wardrobe,
        [name]: finalValue,
      },
    }));

    // const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    // const { name, value, type } = target;
    // const newValue = type === "checkbox" ? (target as HTMLInputElement).checked : value;

    // setFormData((prev: any) => ({
    //   ...prev,
    //   wardrobe: {
    //     ...prev.wardrobe,
    //     [name]: type === "number" ? parseInt(newValue as string) || "" : newValue,
    //   },
    // }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      wardrobe: {
        ...prev.wardrobe,
        [name]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Wardrobe Requirements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wardrobe Type */}
        <div>
          <Label>Wardrobe Type</Label>
          <Select
            // value={formData?.wardrobe?.wardrobeType || ""}
            onValueChange={(val) => handleSelectChange("wardrobeType", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" selectedValue={formData?.wardrobe?.wardrobeType || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sliding">Sliding</SelectItem>
              <SelectItem value="Openable">Openable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Length */}
        <div>
          <Label>Length (ft)</Label>
          <Input
            type="number"
            name="lengthInFeet"
            value={formData?.wardrobe?.lengthInFeet}
            onChange={handleChange}
            placeholder="e.g., 6"
          />
        </div>

        {/* Height */}
        <div>
          <Label>Height (ft)</Label>
          <Input
            type="number"
            name="heightInFeet"
            value={formData?.wardrobe?.heightInFeet}
            onChange={handleChange}
            placeholder="e.g., 8"
          />
        </div>

        {/* Mirror Included */}
        <div className="flex items-center gap-2">
          <input
          id="mirrorIncluded"
            type="checkbox"
            name="mirrorIncluded"
            checked={formData?.wardrobe?.mirrorIncluded || false}
            onChange={handleChange}
          />
          <Label htmlFor="mirrorIncluded">Mirror Included?</Label>
        </div>

        {/* Number of Shelves */}
        <div>
          <Label>Number of Shelves</Label>
          <Input
            type="number"
            name="numberOfShelves"
            value={formData?.wardrobe?.numberOfShelves}
            onChange={handleChange}
            placeholder="e.g., 4"
          />
        </div>

        {/* Number of Drawers */}
        <div>
          <Label>Number of Drawers</Label>
          <Input
            type="number"
            name="numberOfDrawers"
            value={formData?.wardrobe?.numberOfDrawers}
            onChange={handleChange}
            placeholder="e.g., 2"
          />
        </div>

        {/* Package */}
        <div>
          <Label>Wardrobe Package</Label>
          <Select
            // value={formData?.wardrobe?.wardrobePackage || ""}
            onValueChange={(val) => handleSelectChange("wardrobePackage", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData?.wardrobe?.wardrobePackage || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essentials">Essentials</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Build Your Own Package">Build Your Own Package</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <Label>Additional Notes</Label>
          <Textarea
            name="notes"
            value={formData?.wardrobe?.notes || ""}
            onChange={handleChange}
            placeholder="Mention any preferences or requirements"
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="my-6" />
    </div>
  );
};

export default memo(WardrobeSectionPublic);
