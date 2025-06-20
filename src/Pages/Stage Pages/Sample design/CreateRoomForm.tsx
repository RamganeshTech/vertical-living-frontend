import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { useAddRoom } from "../../../apiList/Stage Api/sampleDesignApi";

const CreateRoomPopup: React.FC<{
  open: boolean;
  onClose: () => void;
  onRoomCreated: (roomName: string) => void;
  projectId: string;
}> = ({ open, onClose, onRoomCreated, projectId }) => {
  const [roomName, setRoomName] = useState("");
  const { mutate: addRoom, isPending } = useAddRoom();

  const handleSubmit = () => {
    if (!roomName.trim()) return;
    addRoom({ projectId, roomName }, {
      onSuccess: () => {
        onRoomCreated(roomName);
        setRoomName("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-blue-800">Create New Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Room Name</Label>
            <Input
              placeholder="e.g., Master Bedroom"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            <i className="fas fa-plus mr-2"></i>
            Create Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default CreateRoomPopup;