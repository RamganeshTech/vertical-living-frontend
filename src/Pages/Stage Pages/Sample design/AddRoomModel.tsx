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
    <div onClick={onClose} className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-lg p-6 w-[80%] sm:w-[60%] lg:w-full max-w-md"> */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-brand-surface rounded-xl w-full max-w-md shadow-2xl border border-ash-medium overflow-hidden p-4"
      >
        {/* <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Room</h2> */}

        <div className="px-6 py-4 border-b border-ash-light bg-brand-surface flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-main flex items-center">
            <i className="fas fa-door-open mr-2 text-text-muted"></i>
            Add New Room
          </h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-action-danger transition-colors"
          >
            <i className="fas fa-xmark"></i>
          </button>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* <label className="block text-gray-700 mb-2">Room Name</label> */}
            <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              // className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              className="w-full px-4 py-2.5 bg-brand-ash border border-ash-medium rounded-lg text-text-main text-sm focus:bg-brand-surface focus:ring-2 focus:ring-ash-medium focus:border-text-muted transition-all outline-none"
              required
            />
          </div>
          {/* <div className="flex justify-end gap-4">
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
          </div> */}

          {/* Footer */}
          <div className="px-6 py-4  border-t border-ash-light flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-text-main hover:text-text-main transition-colors"
            >
              Cancel
            </Button>
            <Button
              isLoading={addPending}
              type="submit"
              variant="dark"
              className="px-5 py-2 bg-action-primary hover:opacity-90 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
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