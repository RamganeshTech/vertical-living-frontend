import React, { useState } from "react";
import {
  useGetShipments,
} from "../../../apiList/Department Api/Logistics Api/logisticsApi";
import { LogisticsShipmentForm, type AvailableProjetType } from "./LogisticsShipmentForm";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

import { useGetProjects } from "../../../apiList/projectApi";
import ShipmentCard from "./ShipmentCard";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";


export interface ILogisticsVehicle {
  vehicleNumber: string;
  vehicleType: "truck" | "van" | "car" | "bike" | "tempo" | "container";
  driver: {
    name: string;
    phone: string;
    licenseNumber: string;
  };
  driverUpiId: string | null,
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
  // weight: number;
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
  shipmentStatus: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  scheduledDate: string;
  actualPickupTime: string;
  actualDeliveryTime: string;
  // assignedTo?: string;
  notes: string;
  trackingLink: string | null
}


const LogisticsMain: React.FC = () => {
  const { organizationId } = useParams();
  const location = useLocation();


  const [filters, setFilters] = useState({
    status: "",
    projectId: "",
    projectName: "",
    scheduledDate: "",
  });


  const { data: shipments, isLoading, isError, error, refetch } = useGetShipments(organizationId!, filters);

  const { data } = useGetProjects(organizationId!)
  // console.log("data", data)
  const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))


  const [editingShipment, setEditingShipment] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);


  const isSubPage = location.pathname.includes("sub");

  if (isSubPage) return <Outlet />; // subpage like /vehicles


  const activeFiltersCount = Object.values(filters).filter(Boolean).length;



  const clearFilters = () => {
    setFilters({
      status: "",
      projectId: "",
      projectName: "",
      scheduledDate: "",
    });
  };

  return (
    <div className="p-2 space-y-6 h-full">
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-dolly mr-3 text-blue-600"></i>
            Logistics Department
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your material transport
          </p>
        </div>


        {/* <h2 className="text-3xl font-bold text-blue-600">Logistics Department</h2> */}
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
       <MaterialOverviewLoading />
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
        <main className="flex gap-2 h-[90%]">

          <div className="xl:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-filter mr-2 text-blue-600"></i>
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="delivered">Delivered</option>
                    <option value="in_transit">In Transit</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setFilters((f) => ({ ...f, scheduledDate: e.target.value }))}
                    value={filters.scheduledDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                  </label>

                  <select
                    value={filters?.projectId || ''}
                    onChange={(e) => {
                      const selectedProject = projects?.find(
                        (p: AvailableProjetType) => p._id === e.target.value
                      );
                      if (selectedProject) {
                        setFilters(prev => ({
                          ...prev,
                          projectId: selectedProject._id,
                          projectName: selectedProject.projectName, // keep name too
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {/* <option value="">All Projects</option> */}
                    {projects?.map((project: AvailableProjetType) => (
                      <option key={project._id} value={project._id}>{project.projectName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

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
            <div className="flex-1 max-h-[100%] overflow-y-auto">

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 ">
                {shipments.map((s: ILogisticsShipment) => (
                  <>
                    <ShipmentCard key={(s as any)._id} s={s} organizationId={organizationId!} setEditingShipment={setEditingShipment} setShowForm={setShowForm} />
                  </>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {showForm && (
        <LogisticsShipmentForm
          shipment={editingShipment}
          onClose={() => {
            setShowForm(false)
            // refetch()
          }}
          organizationId={organizationId!}

        />
      )}
    </div>
  )
};

export default LogisticsMain;


