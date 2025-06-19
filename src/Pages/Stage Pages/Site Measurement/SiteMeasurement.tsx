import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Separator } from "../../../components/ui/Seperator";
import {
    useGetSiteMeasurementDetails,
    useUpdateCommonSiteMeasurementDetails,
    useUdpateSiteMeasurmentRoomDetails,
    useDeleteRoomFromMeauserementStage,
    useUpdateSiteMeasurementCompletionStatus,
    useUploadRequirementFiles,
    useCreateMeasurement
} from './../../../apiList/Stage Api/siteMeasurementApi';
import type { SiteDetails, SiteRooms } from "../../../types/types";
import CreateMeasurementPopup from "../CreateRoomMeasurementForm";
import { Button } from './../../../components/ui/Button';

const roomOptions = ["LivingHall", "Bedroom", "Kitchen", "wardrobe"];

const SiteMeasurement = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [showPopup, setShowPopup] = useState(false);

    const { data, isLoading, error } = useGetSiteMeasurementDetails({ projectId: projectId! });

    const handleEdit = (roomIndex: number) => {
        alert(`Edit room #${roomIndex + 1} not implemented yet.`);
    };

    const handleDelete = (roomIndex: number) => {
        alert(`Delete room #${roomIndex + 1} not implemented yet.`);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-semibold">Site Measurement</h2>
                <Button
                    onClick={() => setShowPopup(true)}
                    variant="primary"
                    className="w-15 h-15 !rounded-full"
                >
                    <i className="fa-solid fa-plus text-xl"></i>
                </Button>

            </div>


            {error && <p className="text-red-500">Error: {error.message}</p>}

            {isLoading ? (
                <p>Loading...</p>
            ) : !data ? (
                <div className="text-center border rounded-md p-10 bg-white shadow-sm">
                    <i className="fas fa-ruler-combined text-4xl text-blue-500 mb-4"></i>
                    <p className="text-lg font-medium">No Measurement Data Found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Create your measurement document to start collecting site data.
                    </p>
                    <Button onClick={() => setShowPopup(true)}>+ Create Measurement</Button>
                </div>
            ) : (
                // <>
                //     <div className="bg-white p-6 rounded shadow-sm">
                //         <h3 className="text-lg font-semibold text-blue-600 mb-2">Site Details</h3>
                //         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                //             {Object.entries(data.siteDetails).map(([key, val]) => (
                //                 <li key={key}>
                //                     <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {val?.toString() ?? "N/A"}
                //                 </li>
                //             ))}
                //         </ul>
                //     </div>

                //     <h3 className="text-lg font-semibold mt-6 mb-2">Rooms</h3>
                //     {data.rooms?.length === 0 ? (
                //         <div className="text-center text-gray-500 italic">
                //             <i className="fas fa-door-open text-xl mr-1"></i>
                //             No rooms measured yet.
                //         </div>
                //     ) : (
                //         <ul className="space-y-2">
                //             {data.rooms.map((room: SiteRooms, idx: number) => (
                //                 <li key={idx} className="border-l-6 shadow-md w-[20%]] border-blue-600  p-4 rounded-lg">
                //                     <p><strong>Name:</strong> {room.name}</p>
                //                     <p><strong>Length:</strong> {room.length} ft</p>
                //                     <p><strong>Breadth:</strong> {room.breadth} ft</p>
                //                     <p><strong>Height:</strong> {room.height} ft</p>
                //                 </li>
                //             ))}
                //         </ul>
                //     )}
                // </>
                <>
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold text-blue-800 underline">Site Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-blue-900">
                            <div><strong>Total Plot Area Sq Ft:</strong> {data.siteDetails.totalPlotAreaSqFt ?? "N/A"}</div>
                            <div><strong>Built Up Area Sq Ft:</strong> {data.siteDetails.builtUpAreaSqFt ?? "N/A"}</div>
                            <div><strong>Road Facing:</strong> {String(data.siteDetails.roadFacing)}</div>
                            <div><strong>Number Of Floors:</strong> {data.siteDetails.numberOfFloors ?? "N/A"}</div>
                            <div><strong>Has Slope:</strong> {String(data.siteDetails.hasSlope)}</div>
                            <div><strong>Boundary Wall Exists:</strong> {String(data.siteDetails.boundaryWallExists)}</div>
                            <div className="col-span-2"><strong>Additional Notes:</strong> {data.siteDetails.additionalNotes || "N/A"}</div>
                        </div>

                        <h3 className="text-lg font-semibold text-blue-800 underline">Rooms</h3>
                        {data.rooms.length === 0 ? (
                            <div className="text-center text-blue-600">
                                <i className="fas fa-door-closed text-3xl mb-2 block" />
                                <p className="font-medium">No rooms measured yet.</p>
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    Create Room
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.rooms.map((room: any, index: any) => (
                                    <div key={index} className="bg-white border border-blue-300 p-4 rounded-lg shadow-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-blue-700 font-bold">{room.name}</h4>
                                            <div className="space-x-2">
                                                <button onClick={() => handleEdit(index)} className="text-blue-600 hover:text-blue-800">
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button onClick={() => handleDelete(index)} className="text-red-600 hover:text-red-800">
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            {<p><strong>Length:</strong> {room.length} ft</p>}
                                        </div>
                                        <div>
                                            <p><strong>Breadth:</strong> {room.breadth} ft</p>
                                        </div>
                                        <div>
                                            <p><strong>Height:</strong> {room.height} ft</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <CreateMeasurementPopup
                projectId={projectId!}
                open={showPopup}
                onClose={() => setShowPopup(false)}
            />
        </div>
    );
};

export default SiteMeasurement;
