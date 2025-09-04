import React, { useState } from "react";
import {
  useDeleteShipment,
  useGetShipments,
} from "../../../apiList/Department Api/Logistics Api/logisticsApi";
import { LogisticsShipmentForm } from "./LogisticsShipmentForm";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card";
import { toast } from "../../../utils/toast";


export interface ILogisticsVehicle {
  vehicleNumber: string;
  vehicleType: "truck" | "van" | "car" | "bike" | "tempo" | "container";
  driver: {
    name: string;
    phone: string;
    licenseNumber: string;
  };
  // isAvailable: boolean;
  // currentLocation: {
  //   address: string;
  //   // coordinates: number[]; // [lng, lat]
  // };
  driverCharge: number,
}


export interface IShipmentItem {
  name: string;
  quantity: number;
  weight: number;
  description: string;
}

export interface ILogisticsShipment {
  shipmentNumber?: string;
  projectId?: string;
  // vehicleId?: Types.ObjectId;
  vehicleDetails: ILogisticsVehicle,
  // shipmentType: "delivery" | "pickup" | "transfer";
  origin: {
    address: string;
    contactPerson: string;
    contactPhone: string;
    // coordinates: number[];
  };
  destination: {
    address: string;
    contactPerson: string;
    contactPhone: string;
    // coordinates: number[];
  };
  items: IShipmentItem[];
  status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  scheduledDate: string;
  actualPickupTime: string;
  actualDeliveryTime: string;
  // assignedTo?: string;
  notes: string;
}


const LogisticsMain: React.FC = () => {
  const { organizationId } = useParams();
  // const location = useLocation();

  // const isSubPage = location.pathname.includes("/vehicles");


  const { data: shipments, isLoading, isError, error, refetch } = useGetShipments(organizationId!);

  const { mutateAsync: deleteShipment, isPending } = useDeleteShipment();

  const [editingShipment, setEditingShipment] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (shipmentId: string) => {
    try {
      await deleteShipment({ shipmentId, organizationId: organizationId! });
      toast({ title: "success", description: "Deleted Successfully" })
refetch()
    }
    catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete",
        variant: "destructive"
      });
    }
  };

  // if (isSubPage) return <Outlet />; // subpage like /vehicles
  return (
    <div className="p-2 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-600">Logistics Department</h2>
        <Button
          onClick={() => {
            setEditingShipment(null);
            setShowForm(true);
          }}
        >
          <i className="fas fa-plus mr-2" />
          Add Shipment
        </Button>
      </div>

      {isLoading ? (
        <p>Loading shipments...</p>
      ) : isError ? (
        <div className="max-w-xl sm:min-w-[80%]  mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
          <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
            ⚠️ Error Occurred
          </div>
          <p className="text-red-500  mb-4 text-lg sm:text-xl">
            {(error as any)?.response?.data?.message || "Failed to load data"}
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* No Shipments Fallback */}
          {shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
              <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-1">No Shipments Found</h3>
              <p className="text-sm text-gray-500">
                Looks like there are no logistics shipments yet for this project.<br />
                Click on <strong>"Add Shipment"</strong> to get started 🚀
              </p>
            </div>
          ) : (
            // Responsive Grid of Shipment Cards
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {shipments.map((s: any) => (
                <Card key={s._id} className="border-l-4 border-blue-600">
                  <CardHeader>
                    <CardTitle>{s.shipmentNumber || "Untitled Shipment"}</CardTitle>
                    <CardDescription className="capitalize">{s.shipmentType}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-blue-950">
                    <p>
                      <i className="fas fa-stream mr-1 text-gray-500" />
                      <span className="font-medium text-gray-700">Status:</span> {s.status}
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
                        variant="outline"
                        onClick={() => {
                          setEditingShipment(s);
                          setShowForm(true);
                        }}
                      >
                        <i className="fas fa-edit mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        isLoading={isPending}
                        variant="danger"
                        onClick={() => handleDelete(s._id)}
                      >
                        <i className="fas fa-trash mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <LogisticsShipmentForm
          shipment={editingShipment}
          onClose={() => {
            setShowForm(false)
            refetch()
          }}
          organizationId={organizationId!}

        />
      )}
    </div>
  )
};

export default LogisticsMain;