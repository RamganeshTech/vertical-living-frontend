import { Button } from "../../../components/ui/Button";
import type { SiteRooms } from "../../../types/types";

interface RoomCardProps {
  room: SiteRooms;
  onEdit: (room: SiteRooms) => void;
  onDelete: () => void;
  deleteRoomLoading:boolean
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete , deleteRoomLoading}) => {
  const area = room.length && room.breadth ? (room.length * room.breadth).toFixed(2) : null;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-blue-700">{room.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(room)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <Button
          isLoading={deleteRoomLoading}
            onClick={onDelete}
            variant="ghost"
            className="!text-red-600 hover:text-red-800 bg-white shadow-none hover:!bg-none"
          >
            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg> */}
              <i className="fas fa-trash-can"></i>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Length</p>
          <p className="font-semibold text-gray-800">{room.length || 0} ft</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Breadth</p>
          <p className="font-semibold text-gray-800">{room.breadth || 0} ft</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Height</p>
          <p className="font-semibold text-gray-800">{room.height || 0} ft</p>
        </div>
      </div>

      {area && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700 font-medium text-center">
            Total Area: {area} sq.ft
          </p>
        </div>
      )}
    </div>
  );
};


export default RoomCard