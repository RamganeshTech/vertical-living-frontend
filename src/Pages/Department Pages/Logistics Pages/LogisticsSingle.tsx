// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGetSinglShipment, useSyncAccountsLogistics } from "../../../apiList/Department Api/Logistics Api/logisticsApi";
// import { Card, CardContent } from "../../../components/ui/Card";
// import { Separator } from "../../../components/ui/Seperator";
// import { Badge } from "../../../components/ui/Badge";
// import { formatDateTimeLocal, LogisticsShipmentForm } from "./LogisticsShipmentForm";
// import { type IShipmentItem } from "./LogisticsMain";
// import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { Button } from "../../../components/ui/Button";
// import { toast } from "../../../utils/toast";

// const InfoRow: React.FC<{ label: string; value?: React.ReactNode; }> = ({ label, value }) => (
//     <div className="text-sm font-medium text-gray-700">
//         <span>{label}:</span>{" "}
//         <span className="text-gray-900">{value || "-"}</span>
//     </div>
// );

// const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
//     <section className="space-y-3">
//         <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-1">{title}</h3>
//         {children}
//     </section>
// );

// const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
//     switch (status) {
//         case "pending":
//             return "secondary";
//         case "assigned":
//             return "outline";
//         case "in_transit":
//             return "default";
//         case "delivered":
//             return "default";
//         case "cancelled":
//             return "secondary";
//         default:
//             return "default";
//     }
// };

// const LogisticsSingle: React.FC = () => {
//     const { id, organizationId } = useParams() as { id: string, organizationId: string };
//     const navigate = useNavigate()
//     const { data: shipment, isLoading, refetch } = useGetSinglShipment(id);
//     const { mutateAsync: syncAccounts, isPending: syncAccountsLoading } = useSyncAccountsLogistics()

//     const [editingShipment, setEditingShipment] = useState<any | null>(null);
//     const [showForm, setShowForm] = useState(false);

//     const handleGenerateAccounts = async () => {
//         try {
//             await syncAccounts({
//                 fromDept: "logistics",
//                 organizationId,
//                 projectId: shipment?.projectId,
//                 upiId: shipment?.vehicleDetails.driverUpiId || null,
//                 totalCost: shipment?.vehicleDetails?.driverCharge
//             });
//             toast({ title: "Success", description: "Details sent to Accounts Department" });
//         } catch (error: any) {
//             toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
//         }
//     }

//     if (isLoading) return <MaterialOverviewLoading />;

//     const vehicle = shipment?.vehicleDetails;

//     if (!shipment) {
//         <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
//             <i className="fas fa-dolly text-5xl text-blue-300 mb-4" />
//             <h3 className="text-lg font-semibold text-blue-800 mb-1">No Logistics Found</h3>
//             {/* <p className="text-sm text-gray-500">
//                                 Looks like there are no Procurements yet for this project.<br />
//                                 Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
//                             </p> */}
//         </div>
//     }


//     return (
//         <div className=" max-h-full overflow-y-auto max-w-full space-y-8">
//             {/* Page Header */}
//             <header className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-4">
//                 <div className="flex gap-2 items-center">
//                     <div onClick={() => navigate(-1)}
//                         className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2 '>
//                         <i className='fas fa-arrow-left'></i>
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                         Shipment: {shipment?.shipmentNumber || "N/A"}
//                     </h1>
//                 </div>

//                 <div className="flex gap-2 items-start ">

//                     <div className="flex flex-col items-start space-y-1">
//                         <Button
//                             variant="primary"
//                             isLoading={syncAccountsLoading}
//                             onClick={handleGenerateAccounts}
//                         >
//                             Send To Accounts Dept
//                         </Button>
//                         <span className="text-xs text-blue-500 mx-auto">
//                             <strong>*</strong> Click the button to send the <br /> details to  accounts dept
//                         </span>
//                     </div>

//                     <Button
//                         size="md"
//                         variant="primary"
//                         onClick={() => {
//                             setEditingShipment(shipment);
//                             setShowForm(true);
//                         }}
//                     >
//                         <i className="fas fa-edit mr-1" />
//                         Edit
//                     </Button>
//                 </div>

//             </header>

//             <Card>
//                 <CardContent className="space-y-8 p-6">

//                     {/* Shipment Info */}
//                     <Section title="Shipment Info">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <InfoRow label="Scheduled Date" value={formatDateTimeLocal(shipment?.scheduledDate)} />
//                             <InfoRow label="Shipment Status" value={
//                                 <Badge variant={getStatusVariant(shipment?.status)}>
//                                     {shipment?.status}
//                                 </Badge>
//                             } />
//                         </div>
//                     </Section>

//                     <Separator />

//                     {/* Vehicle Info */}
//                     <Section title="Vehicle Info">
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                             <InfoRow label="Vehicle Number" value={vehicle?.vehicleNumber} />
//                             <InfoRow label="Vehicle Type" value={vehicle?.vehicleType} />
//                             <InfoRow label="Driver Name" value={vehicle?.driver?.name} />
//                             <InfoRow label="Driver Phone" value={vehicle?.driver?.phone} />
//                             <InfoRow label="License Number" value={vehicle?.driver?.licenseNumber} />
//                             <InfoRow label="Driver Charge" value={`₹ ${vehicle?.driverCharge}`} />
//                             <InfoRow label="Upi Id" value={vehicle?.driverUpiId} />
//                         </div>
//                     </Section>

//                     <Separator />

//                     {/* Origin & Destination */}
//                     <Section title="Origin & Destination">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <div>
//                                 <h4 className="text-blue-600 font-bold mb-1">Origin</h4>
//                                 <InfoRow label="Address" value={shipment?.origin?.address} />
//                                 <InfoRow label="Contact Person" value={shipment?.origin?.contactPerson} />
//                                 <InfoRow label="Contact Phone" value={shipment?.origin?.contactPhone} />
//                             </div>
//                             <div>
//                                 <h4 className="text-green-600 font-bold mb-1">Destination</h4>
//                                 <InfoRow label="Address" value={shipment?.destination?.address} />
//                                 <InfoRow label="Contact Person" value={shipment?.destination?.contactPerson} />
//                                 <InfoRow label="Contact Phone" value={shipment?.destination?.contactPhone} />
//                             </div>
//                         </div>
//                     </Section>

//                     <Separator />

//                     {/* Timing Info */}
//                     <Section title="Timing Schedule">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <InfoRow label="Actual Pickup Time" value={formatDateTimeLocal(shipment?.actualPickupTime)} />
//                             <InfoRow label="Actual Delivery Time" value={formatDateTimeLocal(shipment?.actualDeliveryTime)} />
//                         </div>
//                     </Section>

//                     {/* Shipment Items */}
//                     {shipment?.items?.length > 0 && (
//                         <>
//                             <Separator />
//                             <Section title="Shipment Items">
//                                 <div className="overflow-x-auto border border-gray-200 rounded-lg">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr className="text-sm font-semibold text-gray-700">
//                                                 <th className="px-4 py-2 text-left">Item Name</th>
//                                                 <th className="px-4 py-2 text-left">Quantity</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-100">
//                                             {shipment.items.map((item: IShipmentItem, index: number) => (
//                                                 <tr key={index} className="text-sm text-gray-800">
//                                                     <td className="px-4 py-2">{item?.name}</td>
//                                                     <td className="px-4 py-2">{item?.quantity}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </Section>
//                         </>
//                     )}

//                     {/* Notes */}
//                     {shipment?.notes && (
//                         <>
//                             <Separator />
//                             <Section title="Notes">
//                                 <p className="text-sm text-gray-700">{shipment.notes}</p>
//                             </Section>
//                         </>
//                     )}
//                 </CardContent>
//             </Card>


//             {showForm && (
//                 <LogisticsShipmentForm
//                     shipment={editingShipment}
//                     onClose={() => {
//                         setShowForm(false)
//                         refetch()
//                     }}
//                     organizationId={organizationId!}

//                 />
//             )}
//         </div>
//     );
// };

// export default LogisticsSingle;




// SECOND VERSION

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
import { useLogisticsWebSocket } from "./useLogisticsWebSocket";
import InfoTooltip from "../../../components/ui/InfoToolTip";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
// import { LiveTrackingMap } from "./LiveTrackingMap";
import { LiveTrackingMap } from "./LiveTrackingMap"; // 🚀 NEW COMPONENT
import { useDriverLocationSender } from "./useDriverLocationSender";

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
        case "pickedup":
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
    const navigate = useNavigate();
    const { data: shipment, isLoading, refetch } = useGetSinglShipment(id);
    const { mutateAsync: syncAccounts, isPending: syncAccountsLoading } = useSyncAccountsLogistics();

    const [editingShipment, setEditingShipment] = useState<any | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);

    // Use the new sender hook
    // const { isUpdating } =useDriverLocationSender(id, isSharing);

    const { isUpdating } = useDriverLocationSender(id!, isAttemptingToStart, () => {
        setIsSharing(true);
        setIsAttemptingToStart(false);
        toast({ title: "Tracking Active", description: "Location is now being shared live." });
    });

    const handleToggleSharing = () => {
        if (isSharing) {
            // Stop sharing immediately
            setIsSharing(false);
            setIsAttemptingToStart(false);
        } else {
            // Start the attempt
            setIsAttemptingToStart(true);
        }
    };


    const { role, permission } = useAuthCheck();


    const canEdit = role === "owner" || permission?.logistics?.edit;
    // const canList = role === "owner" || permission?.logistics?.list;




    // 🚀 WebSocket for real-time location updates
     useLogisticsWebSocket({
        organizationId,
        enabled: !!shipment && ["in_transit", "pickedup"].includes(shipment?.shipmentStatus || ""),
        onLocationUpdate: (data) => {
            if (data.shipmentId === id) {
                console.log("📍 Location updated for current shipment:", data);
                refetch(); // Refetch to update UI with latest location
            }
        },
        onTrackingStopped: (data) => {
            if (data.shipmentId === id) {
                toast({
                    title: "Tracking Stopped",
                    description: `Shipment ${data.status === 'delivered' ? 'delivered' : 'cancelled'}`
                });
                refetch();
            }
        }
    });

    

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
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || error?.message || "operation failed"
            });
        }
    };

    const handleCopyLink = () => {
        const subpath = `${organizationId}/logistics/public/${id}`;
        const link = `${import.meta.env.VITE_FRONTEND_URL}/${subpath}`;

        //      const subpath = `${organizationId}/logistics/public/${id}`

        // const link = `${import.meta.env.VITE_FRONTEND_URL}/${subpath}`


        navigator.clipboard.writeText(link);
        setCopied(true);
        toast({ title: "Link Copied", description: "Tracking link copied to clipboard" });
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) return <MaterialOverviewLoading />;

    const vehicle = shipment?.vehicleDetails;

    if (!shipment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                <i className="fas fa-dolly text-5xl text-blue-300 mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-1">No Shipment Found</h3>
            </div>
        );
    }

    // ✅ Check if tracking is active and location data exists
    // const isTrackingActive = ["in_transit", "pickedup"].includes(shipment?.shipmentStatus || "");
    const isTrackingActive = true;
    const hasLocationData = shipment?.currentLocation?.latitude && shipment?.currentLocation?.longitude;


    return (
        <div className="max-h-full overflow-y-auto max-w-full space-y-4">
            {/* Page Header */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-4 pt-2 mb-6 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div
                        onClick={() => navigate(-1)}
                        className='bg-blue-50 hover:bg-slate-300 flex items-center justify-between w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md px-2'
                    >
                        <i className='fas fa-arrow-left'></i>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
                        Shipment: {shipment?.shipmentNumber || "N/A"}
                    </h1>
                </div>

                <div className="flex gap-2 items-start">
                    <div className="flex gap-2 items-center space-y-1">

                        {/* <Button
                            variant={isSharing ? "danger" : "primary"}
                            isLoading={isUpdating}
                            onClick={() => setIsSharing(!isSharing)}
                        >
                            {isSharing ? "Stop Sharing My Location" : "Start Sharing My Location"}
                        </Button> */}

                        <Button
                            // Color only turns Red (danger) AFTER success
                            variant={isSharing ? "danger" : "primary"}

                            // Show loading spinner while waiting for the first success
                            isLoading={isAttemptingToStart || (isSharing && isUpdating)}

                            className="font-bold"
                            onClick={handleToggleSharing}
                        >
                            <i className={`fas ${isSharing ? 'fa-stop-circle' : 'fa-play-circle'} mr-2 text-xl`} />
                            <span>
                                {isAttemptingToStart ? "Connecting GPS..." : isSharing ? "Stop Sharing" : "Start Sharing"}
                            </span>
                        </Button>


                        <Button
                            variant="primary"
                            isLoading={syncAccountsLoading}
                            onClick={handleGenerateAccounts}
                        >
                            Send To Accounts Dept
                        </Button>
                        <InfoTooltip
                            content="Click the button to send the details to accounts department"
                            type="info"
                            position="bottom"
                        />
                        {/* <span className="text-xs text-blue-500 mx-auto">
                            <strong>*</strong> Click the button to send the <br /> details to accounts dept
                        </span> */}
                    </div>

                    {canEdit && <Button
                        size="md"
                        variant="primary"
                        onClick={() => {
                            setEditingShipment(shipment);
                            setShowForm(true);
                        }}
                    >
                        <i className="fas fa-edit mr-1" />
                        Edit
                    </Button>}
                </div>
            </header>

            <section className="flex w-full gap-2">
                <Card className="w-1/2">
                    <CardContent className="space-y-8 p-6">
                        {/* Shipment Info */}
                        <Section title="Shipment Info">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoRow label="Scheduled Date" value={formatDateTimeLocal(shipment?.scheduledDate)} />
                                <InfoRow label="Shipment Status" value={
                                    <Badge variant={getStatusVariant(shipment?.shipmentStatus)}>
                                        {shipment?.shipmentStatus}
                                    </Badge>
                                } />
                                {/* 🚀 NEW: Show Tracking ID if available */}
                                {shipment?.trackingId && (
                                    <InfoRow label="Tracking ID" value={
                                        <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-700">
                                            {shipment.trackingId}
                                        </span>
                                    } />
                                )}
                                {/* 🚀 NEW: Show ETA if available */}
                                {shipment?.eta && (
                                    <InfoRow label="ETA" value={`${shipment.eta} minutes`} />
                                )}
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



                        <>
                            <Separator />
                            <Section title="Tracking Link">
                                <p className="text-sm text-gray-700">{shipment.trackingLink || "No Tracking link provided"}</p>
                            </Section>
                        </>


                        <Separator />
                        <Section title="Live Tracking URL">
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 overflow-hidden">
                                    <p className="text-sm text-blue-600 font-medium truncate">
                                        {import.meta.env.VITE_FRONTEND_URL}/{organizationId}/logistics/public/{id}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant={copied ? "primary" : "outline"}
                                    className="flex-shrink-0 gap-2 h-10"
                                    onClick={handleCopyLink}
                                >
                                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                                    {copied ? "Copied" : "Copy Link"}
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 italic">
                                * Share this URL with the driver to start live GPS tracking.
                            </p>
                        </Section>


                        {/* Notes */}
                        {
                            <>
                                <Separator />
                                <Section title="Notes">
                                    <p className="text-sm text-gray-700">{shipment.notes || "No Notes"}</p>
                                </Section>
                            </>
                        }
                    </CardContent>
                </Card>

                {/* 🚀 LIVE TRACKING SECTION - Show if tracking is active (regardless of location data) */}
                <div className="flex-1 flex-col  w-1/2 gap-2">

                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <i className="fas fa-satellite-dish" />
                            Native Live Tracking
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold leading-6 tracking-widest">Vertical Living Tracking</p>
                    </div>

                    {isTrackingActive ? (
                        <Card className="">
                            <CardContent className="p-6">
                                {/* {hasLocationData && 
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-blue-700">
                                        <i className="fas fa-map-marker-alt mr-2" />
                                        Live Tracking
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        <span className="text-sm font-medium text-gray-600">
                                            {isConnected ? 'Live' : 'Connecting...'}
                                        </span>
                                    </div>
                                </div>} */}

                                {hasLocationData ? (
                                    <>
                                        <LiveTrackingMap
                                            shipment={shipment}
                                            currentLocation={shipment.currentLocation}
                                            locationHistory={shipment.locationHistory || []}
                                            origin={shipment.origin}
                                            destination={shipment.destination}
                                        />

                                        {/* {shipment.lastLocationUpdate && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Last updated: {new Date(shipment.lastLocationUpdate).toLocaleString()}
                                            </p>
                                        )} */}
                                    </>
                                ) : (
                                    // <div className="flex items-center justify-center py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    //     <div>
                                    //         <i className="fas fa-satellite-dish text-5xl text-gray-300 mb-4 animate-pulse" />
                                    //         <h4 className="text-lg font-semibold text-gray-700">Waiting for location data...</h4>
                                    //         <p className="text-sm text-gray-500 mt-2">
                                    //             Driver needs to start the mobile app and share location
                                    //         </p>
                                    //         <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    //             <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    //             <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    //             <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    //         </div>
                                    //     </div>
                                    // </div>

                                    <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                            <i className="fas fa-satellite-dish text-4xl text-blue-400 animate-pulse" />
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800">Waiting for GPS Signal</h4>
                                        <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 mb-6">
                                            The driver hasn't started sharing their location yet. Please share the tracking link with the driver.
                                        </p>

                                        {/* Actionable Link Section */}
                                        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-2">
                                            <code className="text-[10px] text-blue-600 truncate font-mono">
                                                {import.meta.env.VITE_FRONTEND_URL}/{organizationId}/logistics/public/{id}
                                            </code>
                                            <Button size="sm" variant="outline" onClick={handleCopyLink} className="h-8 text-xs gap-1">
                                                <i className="fas fa-copy" /> Copy
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                        : (
                            /* 🚀 PROFESSIONAL FALLBACK: NO DATA RECEIVED YET */
                            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                    <i className="fas fa-satellite-dish text-4xl text-blue-400 animate-pulse" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">Waiting for GPS Signal</h4>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 mb-6">
                                    The driver hasn't started sharing their location yet. Please share the tracking link with the driver.
                                </p>

                                {/* Actionable Link Section */}
                                <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-2">
                                    <code className="text-[10px] text-blue-600 truncate font-mono">
                                        {import.meta.env.VITE_FRONTEND_URL}/{organizationId}/logistics/public/{id}
                                    </code>
                                    <Button size="sm" variant="outline" onClick={handleCopyLink} className="h-8 text-xs gap-1">
                                        <i className="fas fa-copy" /> Copy
                                    </Button>
                                </div>
                            </div>
                        )
                    }


                    <Separator className="my-7" />

                    <div className="flex-1 mt-4">

                        <div className="flex flex-col mb-4">
                            <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                                <i className="fas fa-external-link-alt" />
                                External Application Tracking
                            </h3>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Porter / Rapido / External Link</p>
                        </div>

                        {shipment.trackingLink ?
                            <div>

                                <iframe src={shipment.trackingLink} width="100%" height="600px" />



                            </div>

                            :
                            <>
                                <div className="flex items-center justify-center py-12 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                                    <div>
                                        <i className="fas fa-location text-5xl text-slate-300 mb-4 animate-pulse" />
                                        <h4 className="text-lg font-semibold text-slate-700">Track the Vehicle by pasting the link</h4>
                                        <p className="text-sm text-slate-500 mt-2">
                                            paste the porter or rapido tracking link by clicking edit option
                                        </p>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                                            <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                            <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </>


                        }
                    </div>
                </div>

                {/* <iframe src="https://shorturl.rapido.bike/RAPIDO/jzDvGb" width="100%" height="600px" /> */}
            </section>


            {showForm && (
                <LogisticsShipmentForm
                    shipment={editingShipment}
                    onClose={() => {
                        setShowForm(false);
                        refetch();
                    }}
                    organizationId={organizationId!}
                />
            )}
        </div>
    );
};

export default LogisticsSingle;