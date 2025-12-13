import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import type { ILogisticsShipment } from './LogisticsMain';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../../utils/toast';
import { useDeleteShipment } from '../../../apiList/Department Api/Logistics Api/logisticsApi';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';


interface ShipmentCardProps {
  s: ILogisticsShipment;
  organizationId: string
  setEditingShipment: React.Dispatch<any>
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}


const ShipmentCard: React.FC<ShipmentCardProps> = ({ s, organizationId, setEditingShipment, setShowForm }) => {
  const navigate = useNavigate()

  const { mutateAsync: deleteShipment, isPending } = useDeleteShipment();
  const { role, permission } = useAuthCheck();

  const canDelete = role === "owner" || permission?.logistics?.delete;
  const canEdit = role === "owner" || permission?.logistics?.edit;


  const handleDelete = async (shipmentId: string) => {
    try {
      await deleteShipment({ shipmentId, organizationId: organizationId! });
      toast({ title: "success", description: "Deleted Successfully" })
      //   refetch()
    }
    catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-l-4 border-blue-600">
      <CardHeader>
        <CardTitle>{s.shipmentNumber || "Untitled Shipment"}</CardTitle>
        {/* <CardDescription className="capitalize">{s.shipmentType}</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-blue-950">
        <p>
          <i className="fas fa-stream mr-1 text-gray-500" />
          <span className="font-medium text-gray-700">Status:</span> {s.shipmentStatus}
        </p>
        <p>
          <i className="fas fa-truck mr-1 text-gray-500" />
          <span className="font-medium text-gray-700">Vehicle:</span> {s.vehicleDetails?.vehicleNumber || "N/A"}
        </p>
        <p>
          <i className="fas fa-map-marker-alt mr-1 text-gray-500" />
          <span className="font-medium text-gray-700">From:</span> {s.origin?.address || "-"}
        </p>
        <p>
          <i className="fas fa-location-arrow mr-1 text-gray-500" />
          <span className="font-medium text-gray-700">To:</span> {s.destination?.address || "-"}
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`sub/${(s as any)._id}`)}
          >
            <i className="fas fa-eye mr-1" />
            View
          </Button>
         {canEdit && <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditingShipment(s);
              setShowForm(true);
            }}
          >
            <i className="fas fa-edit mr-1" />
            Edit
          </Button>}
          {canDelete && <Button
            size="sm"
            isLoading={isPending}
            variant="danger"
            onClick={() => handleDelete((s as any)._id)}
            className='text-white bg-red-600'
          >
            <i className="fas fa-trash mr-1" />
            Delete
          </Button>}
        </div>
      </CardContent>
    </Card>
  )
}

export default ShipmentCard