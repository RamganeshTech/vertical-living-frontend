// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useGetShipmentByIdPublic } from '../../../apiList/Department Api/Logistics Api/logisticsApi';
// import { useDriverLocationSender } from './useDriverLocationSender'; // The GPS hook we discussed
// import { LiveTrackingMap } from './LiveTrackingMap';
// import { Card, CardContent } from '../../../components/ui/Card';
// import { Button } from '../../../components/ui/Button';
// import { Badge } from '../../../components/ui/Badge';

// const LogisticsPublicSingle: React.FC = () => {
//     const { id, organizationId } = useParams<{ id: string, organizationId: string }>();
//     const { data: shipment, isLoading, refetch } = useGetShipmentByIdPublic(id!); // Calling your public endpoint
//     const [isSharing, setIsSharing] = useState(false);

//     // This hook sends GPS data to your updateDriverLocation controller
//     useDriverLocationSender(id!, isSharing);

//     if (isLoading) return <div className="p-10 text-center">Loading Tracking Session...</div>;

//     return (
//         <div className="min-h-screen bg-slate-50 flex flex-col">
//             {/* Professional Header */}
//             <header className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center">
//                 <div>
//                     <h1 className="text-xl font-bold tracking-tight">VERTICAL LIVING</h1>
//                     <p className="text-xs text-blue-200">Logistics Tracking System</p>
//                 </div>
//                 <Badge className="bg-blue-700 border-none text-white">
//                     {shipment?.shipmentNumber}
//                 </Badge>
//             </header>

//             <main className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
//                 <Card className="border-t-4 border-t-blue-600">
//                     <CardContent className="p-6 text-center space-y-4">
//                         <div className="space-y-1">
//                             <h2 className="text-lg font-bold text-slate-800">Driver Dashboard</h2>
//                             <p className="text-sm text-slate-500">Tap the button below to start sharing your live location with the team.</p>
//                         </div>

//                         <Button 
//                             className={`w-full py-6 text-lg font-bold shadow-lg transition-all ${isSharing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
//                             onClick={() => setIsSharing(!isSharing)}
//                         >
//                             <i className={`fas ${isSharing ? 'fa-stop-circle' : 'fa-play-circle'} mr-2`} />
//                             {isSharing ? "Stop Sharing Location" : "Start Sharing Location"}
//                         </Button>

//                         {isSharing && (
//                             <div className="flex items-center justify-center gap-2 text-green-600 animate-pulse">
//                                 <span className="h-2 w-2 bg-green-600 rounded-full" />
//                                 <span className="text-xs font-bold uppercase tracking-widest">Live Transmitting</span>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {/* Map View for the Driver */}
//                 <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 h-80 relative">
//                     <LiveTrackingMap 
//                         shipment={shipment}
//                         currentLocation={shipment?.currentLocation}
//                         locationHistory={shipment?.locationHistory || []}
//                     />
//                 </div>

//                 {/* Shipment Summary */}
//                 <div className="grid grid-cols-2 gap-3">
//                     <div className="bg-white p-3 rounded-lg border shadow-sm">
//                         <p className="text-[10px] text-slate-400 uppercase font-bold">To Address</p>
//                         <p className="text-sm font-medium truncate">{shipment?.destination?.address || 'N/A'}</p>
//                     </div>
//                     <div className="bg-white p-3 rounded-lg border shadow-sm">
//                         <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
//                         <p className="text-sm font-bold text-blue-700 capitalize">{shipment?.shipmentStatus}</p>
//                     </div>
//                 </div>
//             </main>

//             <footer className="p-4 text-center text-[10px] text-slate-400 uppercase tracking-widest">
//                 Powered by House of Ram Logistics
//             </footer>
//         </div>
//     );
// };

// export default LogisticsPublicSingle;




import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetShipmentByIdPublic } from '../../../apiList/Department Api/Logistics Api/logisticsApi';
import { useDriverLocationSender } from './useDriverLocationSender';
import { LiveTrackingMap } from './LiveTrackingMap';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { COMPANY_DETAILS } from '../../../constants/constants';
import { toast } from '../../../utils/toast';

const LogisticsPublicSingle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: shipment, isLoading, isError } = useGetShipmentByIdPublic(id!);
    const [isSharing, setIsSharing] = useState(false);
    const [isAttemptingToStart, setIsAttemptingToStart] = useState(false);

    /**
      * ✅ The hook stays enabled if we are ATTEMPTING to start OR ALREADY sharing.
      * The callback flips the UI state only after the backend confirms success.
      */
    const { isUpdating } = useDriverLocationSender(id!, isSharing || isAttemptingToStart, () => {
        setIsSharing(true);
        setIsAttemptingToStart(false);
        toast({ title: "Success", description: "GPS Connection Established! Sharing live location." });
    });

    const handleToggleSharing = () => {
        if (isSharing) {
            // Stop sharing immediately
            setIsSharing(false);
            setIsAttemptingToStart(false);
        } else {
            // Trigger the attempt state
            setIsAttemptingToStart(true);
        }
    };
    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (isError || !shipment) return (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-800">Invalid Tracking Session</h1>
            <p className="text-slate-500">This tracking link is no longer active.</p>
        </div>
    );

    const vehicle = shipment?.vehicleDetails;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
            {/* 🚀 HEADER */}
            <header className="sticky top-0 z-[1001] bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <div onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-2 sm:gap-4">
                    {/* Constrained Logo Container */}
                    <div  className="flex-shrink-0  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                            src={COMPANY_DETAILS.COMPANY_LOGO}
                            alt="Vertical Living Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-xl font-black text-slate-900 leading-none tracking-tight">
                            {COMPANY_DETAILS.COMPANY_NAME}
                        </h1>
                        <span className="text-[9px] sm:text-xs text-blue-600 font-bold uppercase tracking-[0.15em]">
                            Logistics Tracking
                        </span>
                    </div>
                </div>

                {/* <Button
                    variant={isSharing ? "danger" : "primary"}
                    size="sm"
                    className="font-bold px-4 py-5 sm:py-2 rounded-full shadow-md"
                    onClick={() => setIsSharing(!isSharing)}
                >
                    <i className={`fas ${isSharing ? 'fa-stop-circle' : 'fa-play-circle'} mr-2`} />
                    <span>{isSharing ? "Stop Sharing" : "Start Sharing"}</span>
                </Button> */}

                <Button
                    // Variant ONLY turns red AFTER sharing is confirmed successful
                    variant={isSharing ? "danger" : "primary"}
                    size="sm"
                    className="font-bold px-6  rounded-full shadow-lg transition-all active:scale-95"
                    // Show loading while attempting to start OR during subsequent API updates
                    isLoading={isAttemptingToStart || (isSharing && isUpdating)}
                    onClick={handleToggleSharing}
                >
                    <i className={`fas ${isSharing ? 'fa-stop-circle' : 'fa-play-circle'} mr-2 text-lg`} />
                    <span className="text-sm sm:text-base">
                        {isAttemptingToStart ? "Connecting GPS..." : isSharing ? "Stop Sharing" : "Start Sharing"}
                    </span>
                </Button>
            </header>

            <main className="flex-1 w-full mx-auto p-4 space-y-4">

                {/* 📋 VEHICLE & DRIVER INFO (DISPLAYED FIRST) */}
                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="bg-slate-900 p-3 text-white">
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">Shipment Details</h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Vehicle Number</span>
                                <span className="text-base font-bold text-slate-800">{vehicle?.vehicleNumber || "—"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Vehicle Type</span>
                                <span className="text-base font-bold text-slate-800 capitalize">{vehicle?.vehicleType || "—"}</span>
                            </div>
                            <div className="flex flex-col border-t border-slate-100 sm:border-none pt-3 sm:pt-0">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Driver Name</span>
                                <span className="text-base font-bold text-slate-800">{vehicle?.driver?.name || "—"}</span>
                            </div>
                            <div className="flex flex-col border-t border-slate-100 sm:border-none pt-3 sm:pt-0">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Driver Phone</span>
                                <span className="text-base font-bold text-slate-800">{vehicle?.driver?.phone || "—"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 🗺️ MAP DISPLAYED SECOND */}
                <Card className="border-none shadow-xl rounded-2xl overflow-hidden h-[450px] sm:h-[600px] relative">
                    <LiveTrackingMap
                        shipment={shipment}
                        currentLocation={shipment.currentLocation}
                        locationHistory={shipment.locationHistory || []}
                    />

                    {/* Status Overlay */}
                    <div className="absolute top-4 right-4 z-[1000]">
                        <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-2 ${isSharing ? 'bg-green-50/90 border-green-200 text-green-700' : 'bg-white/90 border-slate-200 text-slate-600'
                            }`}>
                            <span className={`h-2 w-2 rounded-full ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isSharing ? "GPS Active" : "GPS Inactive"}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Destination Quick-View */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Delivery To</p>
                    <p className="text-sm font-medium text-slate-700">{shipment.destination?.address || "Location not set"}</p>
                </div>

            </main>

            <footer className="p-6 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Powered by House of Ram
                </p>
            </footer>
        </div>
    );
};

export default LogisticsPublicSingle;