import { useNavigate } from "react-router-dom";
import { useDeleteMaterialSelectionRoom } from "../../../apiList/Stage Api/materialSelectionApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { memo } from "react";


interface RoomCardProp {
  room: any;
  projectId: string;
  roomType: string;
}

const RoomCard: React.FC<RoomCardProp> = ({
  room,
  projectId,
  roomType,
}) => {
  const navigate = useNavigate();
  const { mutateAsync: deleteRoom, isPending } = useDeleteMaterialSelectionRoom();
  const handleDeleteRoom = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    try {
      if (!confirm("Are you sure you need to delete the room?")) return;
      await deleteRoom({ projectId, roomId: room._id });
      toast({ title: "Success", description: "Room deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete the room",
        variant: "destructive",
      });
    }
  };

  const fieldLength = roomType === "customRoom" ? room.items : room.roomFields
  return (
    <div
      onClick={() =>
        navigate(
          `materialroom/${room._id}/${roomType}`
        )
      }
      className="border-l-4 border-blue-600 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-4 bg-white flex justify-between items-center"
    >
      {/* Left side: Room info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
        <p className="text-sm text-blue-500">
          No of Fields: {Object.keys(fieldLength|| {})?.length}
        </p>
      </div>

      {/* Right side: Actions */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `materialroom/${room._id}/${roomType}`
            );
          }}
          className="text-sm text-blue-600 underline hover:no-underline cursor-pointer"
        >
          View →
        </button>

        <Button
          variant="danger"
          size="sm"
          onClick={handleDeleteRoom}
          disabled={isPending}
          className="flex items-center gap-1 px-2 py-1 text-sm hover:text-white"
        >
          <i className="fas fa-trash" /> Delete
        </Button>
      </div>
    </div>
  );
}

export default memo(RoomCard)