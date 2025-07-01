
import React from "react";
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
import { Button } from "../../../components/ui/Button";

interface LivingHallSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const LivingHallSectionPublic: React.FC<LivingHallSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let finalValue: string | number | boolean = value;
    
    if (type === "number") {
      const parsedValue = parseFloat(value);
      finalValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue); // ✅ ensure value >= 0
    }


    setFormData((prev: any) => ({
      ...prev,
      livingHall: {
        ...prev.livingHall,
        [name]: finalValue,
      },
    }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      livingHall: {
        ...prev.livingHall,
        [name]: value,
      },
    }));
  };



  
  const handleResetBedroom = () => {
    setFormData((prev: any) => ({
      ...prev,
      livingHall: {
    seatingStyle: null,
    tvUnitDesignRequired: null,
    falseCeilingRequired: null,
    wallDecorStyle: null,
    numberOfFans: null,
    numberOfLights: null,
    livingHallPackage: null,
    notes: null,
  }, // or {} if you prefer to use empty object instead of null
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Living Hall Requirements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seating Style */}
        <div>
          <Label>Seating Style</Label>
          <Select
            // value={formData.livingHall.seatingStyle || ""}
            onValueChange={(val) => handleSelectChange("seatingStyle", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select seating style" selectedValue={formData.livingHall.seatingStyle || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sofa Set">Sofa Set</SelectItem>
              <SelectItem value="L-Shaped Sofa">L-Shaped Sofa</SelectItem>
              <SelectItem value="Recliner Chairs">Recliner Chairs</SelectItem>
              <SelectItem value="Floor Seating">Floor Seating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TV Unit Design */}
        <div>
          <Label>TV Unit Design Required</Label>
          <Select
            // value={
            //   formData.livingHall.tvUnitDesignRequired === true
            //     ? "Yes"
            //     : formData.livingHall.tvUnitDesignRequired === false
            //     ? "No"
            //     : ""
            // }
            onValueChange={(val) =>
              handleSelectChange("tvUnitDesignRequired", val === "Yes")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" selectedValue={formData.livingHall.tvUnitDesignRequired === true
                ? "Yes"
                : formData.livingHall.tvUnitDesignRequired === false
                  ? "No"
                  : ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* False Ceiling */}
        <div>
          <Label>False Ceiling Required</Label>
          <Select
            // value={
            //   formData.livingHall.falseCeilingRequired === true
            //     ? "Yes"
            //     : formData.livingHall.falseCeilingRequired === false
            //     ? "No"
            //     : ""
            // }
            onValueChange={(val) =>
              handleSelectChange("falseCeilingRequired", val === "Yes")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option"
                selectedValue={
                  formData.livingHall.falseCeilingRequired === true
                    ? "Yes"
                    : formData.livingHall.falseCeilingRequired === false
                      ? "No"
                      : ""
                } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wall Decor Style */}
        <div>
          <Label>Wall Decor Style</Label>
          <Select
            // value={formData.livingHall.wallDecorStyle || ""}
            onValueChange={(val) => handleSelectChange("wallDecorStyle", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select wall decor" selectedValue={formData.livingHall.wallDecorStyle || ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paint">Paint</SelectItem>
              <SelectItem value="Wallpaper">Wallpaper</SelectItem>
              <SelectItem value="Wood Paneling">Wood Paneling</SelectItem>
              <SelectItem value="Stone Cladding">Stone Cladding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of Fans */}
        <div>
          <Label>Number of Fans</Label>
          <Input
            name="numberOfFans"
            type="number"
            value={formData.livingHall.numberOfFans}
            onChange={handleInputChange}
            placeholder="e.g., 2"
          />
        </div>

        {/* Number of Lights */}
        <div>
          <Label>Number of Lights</Label>
          <Input
            name="numberOfLights"
            type="number"
            value={formData.livingHall.numberOfLights}
            onChange={handleInputChange}
            placeholder="e.g., 6"
          />
        </div>

        {/* Living Hall Package */}
        <div>
          <Label>Living Hall Package</Label>
          <Select
            // value={formData.livingHall.livingHallPackage || ""}
            onValueChange={(val) => handleSelectChange("livingHallPackage", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select package" selectedValue={formData.livingHall.livingHallPackage || ""} />
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
          <Input
            name="notes"
            value={formData.livingHall.notes || ""}
            onChange={handleInputChange}
            placeholder="Any special preferences or notes"
          />
        </div>
      </div>


       <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleResetBedroom}
              >
                <i className="fa-solid fa-rotate-left mr-2"></i> Reset LivingHall Section
              </Button>
            </div>

      {/* <Separator className="my-6" /> */}
    </div>
  );
};

export default LivingHallSectionPublic;
