import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSinglShipment, useSyncAccountsLogistics } from "../../../apiList/Department Api/Logistics Api/logisticsApi";
import { Card, CardContent } from "../../../components/ui/Card";
import { Separator } from "../../../components/ui/Seperator";
import { Badge } from "../../../components/ui/Badge";
import { formatDateTimeLocal, LogisticsShipmentForm } from "./LogisticsShipmentForm";
import { type IShipmentItem } from "./LogisticsMain";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";

const InfoRow: React.FC<{ label: string; value?: React.ReactNode; }> = ({ label, value }) => (
    <div className="text-sm font-medium text-gray-700">
        <span>{label}:</span>{" "}
        <span className="text-gray-900">{value || "-"}</span>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="space-y-3">
        <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-1">{title}</h3>
        {children}
    </section>
);

const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
        case "pending":
            return "secondary";
        case "assigned":
            return "outline";
        case "in_transit":
            return "default";
        case "delivered":
            return "default";
        case "cancelled":
            return "secondary";
        default:
            return "default";
    }
};

const LogisticsSingle: React.FC = () => {
    const { id, organizationId } = useParams() as { id: string, organizationId: string };
    const navigate = useNavigate()
    const { data: shipment, isLoading, refetch } = useGetSinglShipment(id);
    const { mutateAsync: syncAccounts, isPending: syncAccountsLoading } = useSyncAccountsLogistics()

    const [editingShipment, setEditingShipment] = useState<any | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleGenerateAccounts = async () => {
        try {
            await syncAccounts({
                fromDept: "logistics",
                organizationId,
                projectId: shipment?.projectId,
                upiId: shipment?.vehicleDetails.driverUpiId || null,
                totalCost: shipment?.vehicleDetails?.driverCharge
            });
            toast({ title: "Success", description: "Details sent to Accounts Department" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }

    if (isLoading) return <MaterialOverviewLoading />;

    const vehicle = shipment?.vehicleDetails;

    if (!shipment) {
        <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
            <i className="fas fa-dolly text-5xl text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Logistics Found</h3>
            {/* <p className="text-sm text-gray-500">
                                Looks like there are no Procurements yet for this project.<br />
                                Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
                            </p> */}
        </div>
    }


    return (
        <div className=" max-h-full overflow-y-auto max-w-full space-y-8">
            {/* Page Header */}
            <header className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-4">
                <div className="flex gap-2 items-center">
                    <div onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
                        Shipment: {shipment?.shipmentNumber || "N/A"}
                    </h1>
                </div>

                <div className="flex gap-2 items-start ">

                    <div className="flex flex-col items-start space-y-1">
                        <Button
                            variant="primary"
                            isLoading={syncAccountsLoading}
                            onClick={handleGenerateAccounts}
                        >
                            Send To Accounts Dept
                        </Button>
                        <span className="text-xs text-blue-500 mx-auto">
                            <strong>*</strong> Click the button to send the <br /> details to  accounts dept
                        </span>
                    </div>

                    <Button
                        size="md"
                        variant="primary"
                        onClick={() => {
                            setEditingShipment(shipment);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-edit mr-1" />
                        Edit
                    </Button>
                </div>

            </header>

            <Card>
                <CardContent className="space-y-8 p-6">

                    {/* Shipment Info */}
                    <Section title="Shipment Info">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow label="Scheduled Date" value={formatDateTimeLocal(shipment?.scheduledDate)} />
                            <InfoRow label="Shipment Status" value={
                                <Badge variant={getStatusVariant(shipment?.status)}>
                                    {shipment?.status}
                                </Badge>
                            } />
                        </div>
                    </Section>

                    <Separator />

                    {/* Vehicle Info */}
                    <Section title="Vehicle Info">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoRow label="Vehicle Number" value={vehicle?.vehicleNumber} />
                            <InfoRow label="Vehicle Type" value={vehicle?.vehicleType} />
                            <InfoRow label="Driver Name" value={vehicle?.driver?.name} />
                            <InfoRow label="Driver Phone" value={vehicle?.driver?.phone} />
                            <InfoRow label="License Number" value={vehicle?.driver?.licenseNumber} />
                            <InfoRow label="Driver Charge" value={`₹ ${vehicle?.driverCharge}`} />
                            <InfoRow label="Upi Id" value={vehicle?.driverUpiId} />
                        </div>
                    </Section>

                    <Separator />

                    {/* Origin & Destination */}
                    <Section title="Origin & Destination">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-blue-600 font-bold mb-1">Origin</h4>
                                <InfoRow label="Address" value={shipment?.origin?.address} />
                                <InfoRow label="Contact Person" value={shipment?.origin?.contactPerson} />
                                <InfoRow label="Contact Phone" value={shipment?.origin?.contactPhone} />
                            </div>
                            <div>
                                <h4 className="text-green-600 font-bold mb-1">Destination</h4>
                                <InfoRow label="Address" value={shipment?.destination?.address} />
                                <InfoRow label="Contact Person" value={shipment?.destination?.contactPerson} />
                                <InfoRow label="Contact Phone" value={shipment?.destination?.contactPhone} />
                            </div>
                        </div>
                    </Section>

                    <Separator />

                    {/* Timing Info */}
                    <Section title="Timing Schedule">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow label="Actual Pickup Time" value={formatDateTimeLocal(shipment?.actualPickupTime)} />
                            <InfoRow label="Actual Delivery Time" value={formatDateTimeLocal(shipment?.actualDeliveryTime)} />
                        </div>
                    </Section>

                    {/* Shipment Items */}
                    {shipment?.items?.length > 0 && (
                        <>
                            <Separator />
                            <Section title="Shipment Items">
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr className="text-sm font-semibold text-gray-700">
                                                <th className="px-4 py-2 text-left">Item Name</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {shipment.items.map((item: IShipmentItem, index: number) => (
                                                <tr key={index} className="text-sm text-gray-800">
                                                    <td className="px-4 py-2">{item?.name}</td>
                                                    <td className="px-4 py-2">{item?.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Section>
                        </>
                    )}

                    {/* Notes */}
                    {shipment?.notes && (
                        <>
                            <Separator />
                            <Section title="Notes">
                                <p className="text-sm text-gray-700">{shipment.notes}</p>
                            </Section>
                        </>
                    )}
                </CardContent>
            </Card>


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
    );
};

export default LogisticsSingle;