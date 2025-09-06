import React, { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import type { ILogisticsShipment } from "./LogisticsMain";
import { useGetProjects } from "../../../apiList/projectApi";
import { useCreateShipment, useUpdateShipment } from "../../../apiList/Department Api/Logistics Api/logisticsApi";
import { toast } from "../../../utils/toast";

interface LogisticsShipmentFormProps {
  shipment?: any;
  onClose: () => void; // better typing than `any`
  organizationId: string,
}


export interface AvailableProjetType { _id: string, projectName: string }


export const formatDateTimeLocal = (date: Date | string) => {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};



export const LogisticsShipmentForm: React.FC<LogisticsShipmentFormProps> = ({
  shipment,
  onClose,
  organizationId,

}) => {


  const { mutateAsync: createShipment, isPending: isCreatePending } = useCreateShipment();
  const { mutateAsync: updateShipment, isPending: isUpdatePending } = useUpdateShipment();

  const { data } = useGetProjects(organizationId!)
  // console.log("data", data)
  const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))


  const [projectId, setProjectId] = useState<AvailableProjetType>({
    _id: "",
    projectName: ""
  })
  const [formData, setFormData] = useState<ILogisticsShipment>({
    // shipmentNumber: "",
    // shipmentType: "delivery",
    status: "pending",
    vehicleDetails: {
      vehicleNumber: "",
      vehicleType: "truck",
      driverCharge: 0,
      // isAvailable: true,
      driver: {
        name: "",
        phone: "",
        licenseNumber: "",
      },
      // currentLocation: {
      //   address: "",
      // }
    },
    origin: {
      address: "",
      contactPerson: "",
      contactPhone: "",
    },
    destination: {
      address: "",
      contactPerson: "",
      contactPhone: "",
    },
    items: [{
      name: "",
      quantity: 0
    }],
    scheduledDate: "",
    actualPickupTime: "",
    actualDeliveryTime: "",
    notes: "",
  });

  // useEffect(() => {
  //   if (shipment) {
  //     setFormData({ ...formData, ...shipment });
  //   }
  // }, [shipment]);


  useEffect(() => {
    if (shipment) {
      setFormData({
        ...formData,
        ...shipment,
        scheduledDate: shipment.scheduledDate
          ? formatDateTimeLocal(shipment.scheduledDate)
          : "",
        actualPickupTime: shipment.actualPickupTime
          ? formatDateTimeLocal(shipment.actualPickupTime)
          : "",
        actualDeliveryTime: shipment.actualDeliveryTime
          ? formatDateTimeLocal(shipment.actualDeliveryTime)
          : "",
      });


      setProjectId(() => {

        const selectedProject: AvailableProjetType = projects?.find(
          (p: AvailableProjetType) => p._id === shipment?.projectId
        );

        return {
          _id: shipment.projectId,
          projectName: selectedProject?.projectName
        }
      })
    }
  }, [shipment]);


  useEffect(() => {
    if (!shipment) {
      if (projects && projects.length > 0) {
        console.log("projects", projects)
        setProjectId(() => {
          return {
            _id: projects[0]?._id,
            projectName: projects[0]?.projectName
          }
        })
      }
    }

  }, [data])


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("origin.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        origin: { ...prev.origin, [field]: value },
      }));
    } else if (name.startsWith("destination.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        destination: { ...prev.destination, [field]: value },
      }));
    } else if (name.startsWith("vehicleDetails.driver.")) {
      const field = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          driver: {
            ...prev.vehicleDetails.driver,
            [field]: value,
          },
        },
      }));
    }
    //  else if (name.startsWith("vehicleDetails.currentLocation.")) {
    //   const field = name.split(".")[2];
    //   setFormData((prev) => ({
    //     ...prev,
    //     vehicleDetails: {
    //       ...prev.vehicleDetails,
    //       currentLocation: {
    //         ...prev.vehicleDetails.currentLocation,
    //         [field]: value,
    //       },
    //     },
    //   }));
    // }
    else if (name.startsWith("vehicleDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputValidation = (formData: ILogisticsShipment) => {
    const errors: string[] = [];

    // Phone number: exactly 10 digits
    if (formData?.origin?.contactPhone && !/^\d{10}$/.test(formData?.origin?.contactPhone)) {
      errors.push("Phone number must be exactly 10 digits.");
    }

    if (formData?.destination?.contactPhone && !/^\d{10}$/.test(formData?.destination?.contactPhone)) {
      errors.push("Phone number must be exactly 10 digits.");
    }


    // Example: Name required
    if (!formData?.vehicleDetails?.vehicleNumber?.trim()) {
      errors.push("vehicle number is required.");
    }

    // if (formData?.items?.length === 0) {
    //   errors.push("At least one shipment item is required.");
    // }

    if (formData?.items?.length > 0) {
      formData?.items?.forEach((item, i) => {
        if (!item.name) errors.push(`Item ${i + 1} is missing a name.`);
        if (item.quantity < 0) errors.push(`Item ${i + 1} has invalid quantity.`);
      })
    }
    return errors;
  }

  const handleSubmit = async () => {
    try {
      const errors = handleInputValidation(formData);
      if (errors.length > 0) {
        errors.forEach(err => {
          toast({
            title: "Validation Error",
            description: err,
            variant: "destructive"
          });
        });
        return; // stop save
      }

      if (shipment) {
        await updateShipment({
          shipmentId: shipment._id,
          organizationId,
          projectId: projectId?._id,
          payload: formData,
        })
      } else {
        await createShipment({
          organizationId,
          projectId: projectId._id,
          payload: formData,
          projectName: projectId.projectName
        });
      }
      toast({ title: "success", description: "shipment has generated" })
      onClose()
    }
    catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Operation Failed",
        variant: "destructive"
      });
    }
  }


  const scrollBoxStyles = "max-h-[80vh] overflow-y-auto p-2 sm:p-4 space-y-6";


  return (
    // Inside your modal:
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl p-6 shadow-lg w-[90vw] max-w-[1300px] h-[90vh] flex flex-col">

        <h3 className="text-xl font-bold mb-3">
          {shipment ? "Edit Shipment" : "Create Shipment"}
        </h3>

        {/* Scrollable Form Section */}
        <div className={scrollBoxStyles}>
          {/* Shipment Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-blue-700">Shipment Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <Label>Select Project</Label>

                <select className="w-full px-3 py-2 border rounded-xl" name="projectID" value={projectId._id} onChange={(e) => {
                  const selectedProject = projects?.find(
                    (p: AvailableProjetType) => p._id === e.target.value
                  );
                  if (selectedProject) {
                    setProjectId({
                      _id: selectedProject._id,
                      projectName: selectedProject.projectName,
                    });
                  }
                }}>
                  {projects?.map((project: AvailableProjetType) => (
                    <option key={project._id} value={project._id}>{project.projectName}</option>
                  ))}
                </select>
              </div>


              {/* <div>
                <Label>Shipment Type</Label>
                <select className="w-full px-3 py-2 border rounded-xl" name="shipmentType" value={formData.shipmentType} onChange={handleChange}>
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div> */}
              <div>
                <Label>Status</Label>
                <select className="w-full px-3 py-2 border rounded-xl" name="status" value={formData.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <Label>Scheduled Date</Label>
                <Input type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-green-700">Vehicle Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="vehicleDetails.vehicleNumber" placeholder="Vehicle Number" required value={formData.vehicleDetails.vehicleNumber} onChange={handleChange} />

              <select name="vehicleDetails.vehicleType" value={formData.vehicleDetails.vehicleType} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl">
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="tempo">Tempo</option>
                <option value="container">Container</option>
              </select>

              <Input name="vehicleDetails.driver.name" placeholder="Driver Name" value={formData.vehicleDetails.driver.name} onChange={handleChange} />
              <Input name="vehicleDetails.driver.phone"
                type="tel"
                maxLength={10}
                placeholder="Driver Phone" value={formData.vehicleDetails.driver.phone} onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    handleChange(e)
                  }
                }} />
              <Input name="vehicleDetails.driver.licenseNumber" placeholder="License Number" value={formData.vehicleDetails.driver.licenseNumber} onChange={handleChange} />
              <Input name="vehicleDetails.driverCharge" type="number" placeholder="Driver Charge" value={formData.vehicleDetails.driverCharge}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) >= 0) {
                    handleChange(e); // only update if >= 0
                  }
                }}


              />
              {/* <select name="vehicleDetails.isAvailable" value={formData.vehicleDetails.isAvailable ? "true" : "false"} className="w-full px-3 py-2 border rounded-xl" onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicleDetails: {
                    ...prev.vehicleDetails,
                    isAvailable: e.target.value === "true",
                  },
                }))}>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
              <Input name="vehicleDetails.currentLocation.address" placeholder="Vehicle Address" value={formData.vehicleDetails.currentLocation.address} onChange={handleChange} /> */}
            </div>
          </div>

          {/* Origin & Destination */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-2">Origin & Destination</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>

                <Label>Origin</Label>
                <div className="space-y-2">
                  <Input name="origin.address" placeholder="Address" value={formData.origin.address} onChange={handleChange} />
                  <Input name="origin.contactPerson" placeholder="Contact Person" value={formData.origin.contactPerson} onChange={handleChange} />
                  <Input name="origin.contactPhone" placeholder="Contact Phone"
                    type="tel"
                    maxLength={10}
                    value={formData.origin.contactPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        handleChange(e)
                      }
                    }} />
                </div>
              </div>
              <div>
                <Label>Destination</Label>
                <div className="space-y-2">
                  <Input name="destination.address" placeholder="Address" value={formData.destination.address} onChange={handleChange} />
                  <Input name="destination.contactPerson" placeholder="Contact Person" value={formData.destination.contactPerson} onChange={handleChange} />
                  <Input name="destination.contactPhone" placeholder="Contact Phone"
                    type="tel"
                    maxLength={10}
                    value={formData.destination.contactPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        handleChange(e)
                      }
                    }}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Actual Pickup & Delivery */}
          <div>
            <h4 className="text-lg font-semibold text-indigo-700 mb-2">Timing Schedule</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Actual Pickup Time</Label>
                <Input type="datetime-local" name="actualPickupTime" value={formData.actualPickupTime} onChange={handleChange} />
              </div>
              <div>
                <Label>Actual Delivery Time</Label>
                <Input type="datetime-local" name="actualDeliveryTime" value={formData.actualDeliveryTime} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <textarea name="notes" className="w-full px-3 py-2 border rounded-xl" rows={3} value={formData.notes} onChange={handleChange} />
          </div>

          {/* Items Section */}
          <div>
            <h4 className="text-lg font-semibold text-pink-700 mb-2">Shipment Items</h4>

            <div className="space-y-4">
              {formData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12  items-center gap-2 sm:gap-4"
                >
                  <div className="col-span-6 sm:col-span-5">
                    <Label>Item Name</Label>
                    <Input
                      name={`item-name-${idx}`}
                      value={item.name}
                      placeholder="e.g. Wooden Pallets"
                      // onChange={(e) =>
                      //   setFormData((prev) => {
                      //     const newItems = [...prev.items];
                      //     newItems[idx].name = e.target.value;
                      //     return { ...prev, items: newItems };
                      //   })
                      // }

                      onChange={(e) => {
                        const value = e.target.value;

                        setFormData((prev) => {
                          const newItems = [...prev.items];
                          newItems[idx].name = value;

                          // ✅ Auto-add new empty row if typing in the last one
                          if (idx === newItems.length - 1 && value.trim() !== "") {
                            newItems.push({ name: "", quantity: 0,});
                          }

                          // ✅ Auto-remove empty row if cleared
                          if (value.trim() === "" && idx < newItems.length - 1) {
                            newItems.splice(idx, 1);
                          }

                          return { ...prev, items: newItems };
                        });
                      }}
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-3">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      name={`item-qty-${idx}`}
                      value={item.quantity}
                      placeholder="e.g. 10"
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        if (Number(val) >= 0) {
                          setFormData((prev) => {
                            const newItems = [...prev.items];
                            newItems[idx].quantity = val;
                            return { ...prev, items: newItems };
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex mt-5 place-items-center h-full">
                    <Button
                      variant="danger"
                      size="md"
                      type="button"
                      className="text-white bg-red-600"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== idx),
                        }));
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              ))}

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      items: [...prev.items, { name: "", quantity: 0 }],
                    }))
                  }
                >
                  <i className="fas fa-plus mr-1" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 flex justify-end gap-3 border-t mt-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button isLoading={isUpdatePending || isCreatePending} onClick={() => handleSubmit()}>
            {shipment ? "Update" : "Create"}
          </Button>
        </div>

      </div>
    </div>
  );
};