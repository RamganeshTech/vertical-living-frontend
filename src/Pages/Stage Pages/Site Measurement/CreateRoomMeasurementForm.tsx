import React, { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { useCreateMeasurement } from "../../../apiList/Stage Api/siteMeasurementApi";
import { Dialog ,  DialogContent, DialogHeader, DialogTitle} from '../../../components/ui/Dialog';

import type { SiteDetails, SiteRooms } from '../../../types/types';

const roomOptions = ["LivingHall", "Bedroom", "Kitchen", "wardrobe"];

const CreateMeasurementPopup = ({ projectId, open, onClose }: {
  projectId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<"site" | "room">("site");
  const [errorMsg, setErrorMsg] = useState("");

  const [siteDetails, setSiteDetails] = useState<SiteDetails>({
    totalPlotAreaSqFt: null,
    builtUpAreaSqFt: null,
    roadFacing: false,
    numberOfFloors: null,
    hasSlope: false,
    boundaryWallExists: false,
    additionalNotes: null,
  });

  const [rooms, setRooms] = useState<SiteRooms[]>([]);
  const [newRoom, setNewRoom] = useState<SiteRooms>({
    name: null,
    length: null,
    breadth: null,
    height: null,
  });

  const createMeasurement = useCreateMeasurement();

  const handleCommonChange = (field: keyof SiteDetails, value: any) => {
    setSiteDetails((prev:any) => ({ ...prev, [field]: value }));
  };

  const handleRoomChange = (field: keyof SiteRooms, value: any) => {
    setNewRoom((prev:any) => ({ ...prev, [field]: value }));
  };

  const validateCommonDetails = (): boolean => {
    for (const [key, val] of Object.entries(siteDetails)) {
      if ((val === null || val === "") && key !== "additionalNotes") {
        setErrorMsg(`Field '${key}' is required.`);
        return false;
      }
      if (typeof val === "number" && val < 0) {
        setErrorMsg(`Field '${key}' must be non-negative.`);
        return false;
      }
    }
    setErrorMsg("");
    return true;
  };

  const validateRoom = (): boolean => {
    const { name, length, breadth, height } = newRoom;
    if (!name || length === null || breadth === null || height === null) {
      setErrorMsg("All fields are required for the room.");
      return false;
    }
    if ([length, breadth, height].some((v) => typeof v === "number" && v < 0)) {
      setErrorMsg("Room dimensions must be non-negative.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleAddRoom = () => {
    if (!validateRoom()) return;
    setRooms((prev) => [...prev, newRoom]);
    setNewRoom({ name: null, length: null, breadth: null, height: null });
  };

  const handleSubmit = () => {
    if (rooms.length === 0) {
      setErrorMsg("Please add at least one room.");
      return;
    }
    createMeasurement.mutate({ projectId, siteDetails }, {
      onSuccess: () => {
        onClose();
        setStep("site");
        setRooms([]);
        setSiteDetails({
          totalPlotAreaSqFt: null,
          builtUpAreaSqFt: null,
          roadFacing: null,
          numberOfFloors: null,
          hasSlope: null,
          boundaryWallExists: null,
          additionalNotes: null,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-2">
        <DialogHeader>
          <DialogTitle>New Site Measurement</DialogTitle>
        </DialogHeader>

        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

        {step === "site" ? (
          <div className="space-y-4">
            {Object.entries(siteDetails).map(([key, val]) => (
              <div key={key}>
                <Label>{key}</Label>
                <Input
                  value={val ?? ""}
                  type={typeof val === "number" ? "number" : "text"}
                  onChange={(e:any) => handleCommonChange(key as keyof SiteDetails, e.target.value)}
                />
              </div>
            ))}
            <Button onClick={() => validateCommonDetails() && setStep("room")}>Next</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Room Name</Label>
            <select
              className="w-full border rounded-md p-2"
              value={newRoom.name ?? ""}
              onChange={(e) => handleRoomChange("name", e.target.value)}
            >
              <option value="">Select Room</option>
              {roomOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <Label>Length</Label>
            <Input
              type="number"
              value={newRoom.length ?? ""}
              onChange={(e) => handleRoomChange("length", parseFloat(e.target.value))}
            />
            <Label>Breadth</Label>
            <Input
              type="number"
              value={newRoom.breadth ?? ""}
              onChange={(e) => handleRoomChange("breadth", parseFloat(e.target.value))}
            />
            <Label>Height</Label>
            <Input
              type="number"
              value={newRoom.height ?? ""}
              onChange={(e) => handleRoomChange("height", parseFloat(e.target.value))}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddRoom}>Add Room</Button>
              <Button onClick={handleSubmit} disabled={createMeasurement.isPending}>
                {createMeasurement.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeasurementPopup;
