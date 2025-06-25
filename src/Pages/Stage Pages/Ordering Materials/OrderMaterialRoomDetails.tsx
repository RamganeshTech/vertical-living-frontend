// File: OrderMaterialRoomDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleOrderingRoom } from "../../../apiList/Stage Api/orderingMaterialApi"; 
import { Skeleton } from "../../../components/ui/Skeleton"; 
import { Button } from "../../../components/ui/Button"; 

const OrderMaterialRoomDetails = () => {
  const { projectId, roomId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetSingleOrderingRoom({
    projectId: projectId!,
    roomId: roomId!
  });

  if (isLoading) return <Skeleton className="w-full h-60" />;
  if (isError) return <p>(error as Error)</p>

  return (
    <div className="p-4">
      <Button className="mb-4 bg-blue-600 hover:bg-blue-700" onClick={() => navigate(-1)}>
        ← Back to Rooms
      </Button>

      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        Room: {data.roomName}
      </h2>

      <div className="overflow-x-auto max-h-[60vh] border border-blue-200 rounded-lg">
        <div className="grid grid-cols-8 bg-blue-100 text-blue-800 text-sm font-semibold">
          <div className="p-3 border-b border-blue-200">Material Name</div>
          <div className="p-3 border-b border-blue-200">Brand</div>
          <div className="p-3 border-b border-blue-200">Quantity</div>
          <div className="p-3 border-b border-blue-200">Unit</div>
          <div className="p-3 border-b border-blue-200">Seller Name</div>
          <div className="p-3 border-b border-blue-200">Seller Phone</div>
          <div className="p-3 border-b border-blue-200">Notes</div>
          <div className="p-3 border-b border-blue-200">Is Ordered</div>
        </div>

        <div className="text-sm text-blue-900 divide-y divide-blue-100">
          {data.materials.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-8">
              <div className="p-3">{item.name}</div>
              <div className="p-3">{item.brand ?? "-"}</div>
              <div className="p-3">{item.quantity ?? "-"}</div>
              <div className="p-3">{item.unit ?? "-"}</div>
              <div className="p-3">{item.sellerName ?? "-"}</div>
              <div className="p-3">{item.sellerPhoneNo ?? "-"}</div>
              <div className="p-3">{item.notes ?? "-"}</div>
              <div className="p-3">
                <span className={`px-2 py-1 rounded text-white text-xs ${item.isOrdered ? "bg-green-500" : "bg-red-400"}`}>
                  {item.isOrdered ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderMaterialRoomDetails;
