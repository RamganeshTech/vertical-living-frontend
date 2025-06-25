// File: OrderingMaterialOverview.tsx
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useGetOrderingMaterialStage } from "../../../apiList/Stage Api/orderingMaterialApi"; 
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { toast } from "../../../utils/toast";


const OrderMaterialOverview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetOrderingMaterialStage({ projectId: projectId! });

  if (isLoading) return <Skeleton className="w-full h-40" />;
  if (isError) return (error as Error).message


  console.log(data)

  

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Ordering Material Stage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.rooms?.map((room: any) => (
          <Card
            key={room._id}
            className="cursor-pointer hover:shadow-md transition-all"
          
          >
            <div className="p-4" onClick={() => navigate(`roomdetails/${room._id}`)}>
              <h3 className="text-lg font-bold mb-2">{room.roomName}</h3>
              <p>{room.materials?.length || 0} materials</p>
            </div>
          </Card>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default OrderMaterialOverview;
