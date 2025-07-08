import React from 'react'
import { useNavigate } from 'react-router-dom';

interface CostEstimateRoomCardProps{
  room: {
    _id: string;
    name: string;
    materials: any[];
  };
  projectId: string;
  organizationId: string;
}

const CostEstimateRoomCard:React.FC<CostEstimateRoomCardProps> = ({room,projectId, organizationId})  => {
   const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/${organizationId}/projectdetails/${projectId}/costestimation/roomdetails/${room._id}`)
      }
      className="cursor-pointer border-l-6 border-blue-600 shadow-md hover:border-blue-400 transition-all duration-200 rounded-lg p-5 bg-white hover:shadow-lg flex items-center gap-4"
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{room.name}</h3>
        <p className="text-sm text-blue-500">No of Fields: {room.materials?.length || 0}</p>
      </div>

      <div className="text-sm text-blue-600 font-medium underline hover:no-underline">
        View →
      </div>
    </div>
  );
}

export default CostEstimateRoomCard