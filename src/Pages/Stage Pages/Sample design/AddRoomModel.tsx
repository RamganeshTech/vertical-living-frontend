import { useState } from "react";
import { Button } from "../../../components/ui/Button";

interface AddRoomModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomName: string) => Promise<void>;
  addPending:boolean
}

const AddRoomModel: React.FC<AddRoomModelProps> = ({ isOpen, onClose, onSubmit, addPending }) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(roomName);
    setRoomName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <Button
            isLoading={addPending}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Room
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddRoomModel;