import { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { useCreateMaterialRoom } from "../../../apiList/Stage Api/materialSelectionApi"; 
import { toast } from "../../../utils/toast"; 

interface CreateRoomFormProps {
  onClose: () => void;
  projectId: string;
}

const CreateRoomForm = ({ onClose, projectId }: CreateRoomFormProps) => {
  const [roomName, setRoomName] = useState("");
  const { mutateAsync: createRoom, isPending } = useCreateMaterialRoom();

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast({ title:"Error" , description: "Room name is required", variant: "destructive" });
      return;
    }

    try {
      await createRoom({ projectId, roomName });
      toast({ title:"Success" , description: "Room created successfully ✅" });
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to create room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="roomName" className="text-sm text-gray-700">
          Room Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="e.g., Master Bedroom, Kitchen"
          className="mt-1"
        />
      </div>

      <Button
        onClick={handleCreateRoom}
        disabled={isPending}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition rounded-xl"
      >
         Create Room
      </Button>
    </div>
  );
};

export default CreateRoomForm;
