

// components/material-selection/MaterialRoomOverview.tsx
// import { useState } from "react";
import RoomCard from "./RoomCard";
import { Outlet, useLocation, useParams, useOutletContext, useNavigate } from "react-router-dom";
import { useCompleteMaterialStage, useGetMaterialConfirmationByProject, useMaterialArrivalGeneratePdfComparisonLink, useSetMaterialDeadline, useUpdateSelectedPackage } from "../../../apiList/Stage Api/materialSelectionApi";
import { Card } from "../../../components/ui/Card";
import StageTimerInfo from "../../../shared/StagetimerInfo";
// import { Dialog } from "../../../components/ui/Dialog";
// import CreateRoomformModel from "./CreateRoomformModel";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "./MaterailSelectionLoadings/MaterialOverviewLoading";
import { ResetStageButton } from "../../../shared/ResetStageButton";
import AssignStageStaff from "../../../shared/AssignStaff";
// import ShareDocumentWhatsapp from "../../../shared/ShareDocumentWhatsapp";
import { useEffect, useState } from "react";
import type { IPackage } from "../../../types/types";
import { downloadImage } from "../../../utils/downloadFile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

// Define context type
type ProjectDetailsOutlet = {
    isMobile: boolean;
    openMobileSidebar: () => void;
};

type packageLevelType = "economy" | "premium" | "luxury"

const packageLevel = ["economy", "premium", "luxury"]

export default function MaterialRoomOverview() {
    const { projectId, organizationId } = useParams();
    const { isMobile, openMobileSidebar } = useOutletContext<ProjectDetailsOutlet>();
    const location = useLocation();
    const navigate = useNavigate()
    const [selectedPackage, setSelectedPackage] = useState<{ level: string; id: string } | null>(null);
    // const [clientSelectPackage, setClientSelectPackage] = useState<packageLevelType>("economy")

    // Find the selected package

    const { data, isLoading, error: getRoomsError, refetch } = useGetMaterialConfirmationByProject(projectId!);
    const { mutateAsync: deadLineAsync, isPending: deadLinePending } = useSetMaterialDeadline();
    const { mutateAsync: completionStatus, isPending: completePending } = useCompleteMaterialStage();
    const { mutateAsync: generateLink, isPending: generatePending } = useMaterialArrivalGeneratePdfComparisonLink()
    const { mutateAsync: updatePackage } = useUpdateSelectedPackage()

    // const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (!selectedPackage && data?.package?.length) {
            const economyPackage = data?.package?.find((pkg: IPackage) => pkg?.level === "economy");
            if (economyPackage) {
                setSelectedPackage({ level: economyPackage.level, id: economyPackage._id });
            }
        }
    }, [data, selectedPackage]);

    const selectedPkgObj = data?.package?.find((p: IPackage) => p._id === selectedPackage?.id);
    const rooms = selectedPkgObj?.rooms || [];

    
    const handlePackageSelectChage = async (val:packageLevelType ) => {
        // setClientSelectPackage(val)
console.log("value", val)
        try {
            await updatePackage({
                projectId: projectId!,
                selectedPacakge: val
            })
            toast({ description: 'Package updated successfully', title: "Success" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error.message || "Failed to update Package level",
                variant: "destructive"
            });
        }

    }
    if (isLoading) return <MaterialOverviewLoading />;

    // const isroomsAvailable = !data?.customRooms?.length && !data?.rooms?.length;
    // const isroomsAvailable =  !data?.rooms?.length;
    const isChildRoute = location.pathname.includes("/materialroom");

    const handleCompletionStatus = async () => {
        try {
            await completionStatus({ projectId: projectId! });
            toast({ description: 'Completion status updated successfully', title: "Success" });
            navigate('../costestimation')
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error.message || "Failed to update completion status",
                variant: "destructive"
            });
        }
    };



    const handleGenerate = async () => {
        try {
            const data = await generateLink({ projectId: projectId! });


            downloadImage({ src: data?.url as string, alt: "home-material-selection" })

            toast({ title: "Success", description: "Pdf Generated successfully" });
            refetch()

        } catch (err: any) {
            toast({ title: "Error", description: err?.response?.data?.message || err?.message || "Failed to generate link", variant: "destructive" });
        }
    };

    // // const { rooms, customRooms } = data || {};
    // const { rooms } = data || {};
    // // const totalRooms = (rooms?.length || 0) + (customRooms?.length || 0);
    // const totalRooms = (rooms?.length || 0)

    return (
        <div className="flex flex-col h-full w-full  py-2">
            {/* Responsive Header with Mobile Sidebar Toggle - Always visible */}

            {isChildRoute ? <Outlet /> :
                (<>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 flex items-center">
                            {isMobile && (
                                <button
                                    onClick={openMobileSidebar}
                                    className="mr-3 p-2 rounded-md border-gray-300 hover:bg-gray-100"
                                    title="Open Menu"
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            )}
                            <i className="fas fa-box mr-2"></i> Material Selection
                        </h2>

                        <div className="!w-[100%] sm:!w-[100%] lg:!w-[50%] xl:!w-[65%]  flex flex-col sm:flex-row gap-3 justify-end">
                            <div className="flex flex-wrap  md:flex-nowrap gap-2 justify-end">
                                <Button
                                    isLoading={completePending}
                                    onClick={handleCompletionStatus}
                                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial min-w-max"
                                >
                                    <i className="fa-solid fa-circle-check mr-2"></i>
                                    Mark Complete
                                </Button>

                                {/* {!isChildRoute && (
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateForm(true)}
                                className="bg-blue-600 text-white flex-1 sm:flex-initial min-w-max"
                            >
                                + Add Room
                            </Button>
                        )} */}
                            </div>

                            <div className="flex flex-wrap md:flex-nowrap gap-2 justify-end">
                                <ResetStageButton
                                    projectId={projectId!}
                                    stageNumber={5}
                                    stagePath="materialconfirmation"
                                    className="flex-1 sm:flex-initial min-w-max"
                                />

                                {/* {!getRoomsError && <ShareDocumentWhatsapp
                                    projectId={projectId!}
                                    stageNumber="5"
                                    className="w-full sm:w-fit"
                                    isStageCompleted={data?.status}
                                />} */}

                                <AssignStageStaff
                                    stageName="MaterialRoomConfirmationModel"
                                    projectId={projectId!}
                                    organizationId={organizationId!}
                                    currentAssignedStaff={data?.assignedTo || null}
                                    className="flex-1 sm:flex-initial min-w-max"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Display - Always visible if error exists */}
                    {getRoomsError && (
                        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center mb-4">
                            <div className="text-red-600 font-semibold mb-2">
                                ⚠️ Error Occurred
                            </div>
                            <p className="text-red-500 text-sm mb-4">
                                {(getRoomsError as any)?.response?.data?.message ||
                                    (getRoomsError as any)?.message ||
                                    "Failed to load room data"}
                            </p>
                            <Button
                                onClick={() => refetch()}
                                className="bg-red-600 text-white px-4 py-2"
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {/* Content area that takes remaining space */}
                    <div className="flex-grow min-h-0 flex flex-col">
                        {!getRoomsError && (
                            <>
                                <Card className="p-4 mb-4 w-full shadow border-l-4 border-blue-600 bg-white">
                                    <div className="flex items-center gap-3 text-blue-700 text-sm font-medium mb-2">
                                        <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                                        <span>Stage Timings</span>
                                    </div>
                                    <StageTimerInfo
                                        completedAt={data?.timer?.completedAt}
                                        stageName="materialconfirmation"
                                        projectId={projectId!}
                                        formId={(data as any)?._id}
                                        deadLine={data?.timer?.deadLine}
                                        startedAt={data?.timer?.startedAt}
                                        refetchStageMutate={refetch}
                                        deadLineMutate={deadLineAsync}
                                        isPending={deadLinePending}
                                    />
                                </Card>


                                {/* <div className="flex justify-between items-center gap-4 mb-4">
                                    <div className="flex gap-4   items-center">
                                        {data?.package?.map((pkg: IPackage) => (
                                            <div
                                                key={pkg._id}
                                                onClick={() => setSelectedPackage({ level: pkg.level, id: pkg._id! })}
                                                className={`cursor-pointer px-4 py-2 border-2 rounded-lg font-semibold
                                                    ${selectedPackage?.id === pkg._id
                                                        ? "border-blue-500 text-blue-600 bg-blue-50"
                                                        : "border-gray-300 text-gray-600"}
                                                            `}
                                            >
                                                {pkg.level.charAt(0).toUpperCase() + pkg.level.slice(1)}
                                            </div>
                                        ))}
                                    </div>


                                    <div>
                                        <Button isLoading={generatePending} onClick={handleGenerate}>
                                            Generate Comparison PDF
                                        </Button>
                                    </div>
                                </div> */}


                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                    {/* Package Cards */}
                                    <div className="flex flex-wrap gap-3">
                                        {data?.package?.map((pkg: IPackage) => {
                                            const isSelected = selectedPackage?.id === pkg._id;

                                            const packageConfig = {
                                                economy: {
                                                    bgUnselected: "bg-green-100",
                                                    textUnselected: "text-green-800",
                                                    bgSelected: "bg-green-600",
                                                    textSelected: "text-white",
                                                    borderSelected: "border-green-700"
                                                },
                                                premium: {
                                                    bgUnselected: "bg-amber-100",
                                                    textUnselected: "text-amber-800",
                                                    bgSelected: "bg-amber-500",
                                                    textSelected: "text-white",
                                                    borderSelected: "border-amber-600"
                                                },
                                                luxury: {
                                                    bgUnselected: "bg-violet-100",
                                                    textUnselected: "text-violet-800",
                                                    bgSelected: "bg-violet-600",
                                                    textSelected: "text-white",
                                                    borderSelected: "border-violet-700"
                                                }
                                            };

                                            const config = packageConfig[pkg.level as "economy" | "premium" | "luxury"];

                                            return (
                                                <div
                                                    key={pkg._id}
                                                    onClick={() => setSelectedPackage({ level: pkg.level, id: pkg._id! })}
                                                    className={`
            min-w-[120px] px-5 py-3 rounded-md text-sm font-semibold text-center capitalize
            border-2 cursor-pointer select-none transition-all duration-200 shadow-sm
            ${isSelected
                                                            ? `${config.bgSelected} ${config.textSelected} ${config.borderSelected} border`
                                                            : `${config.bgUnselected} ${config.textUnselected} border-transparent hover:brightness-95`
                                                        }
          `}
                                                >
                                                    <i className="fa-solid fa-box-open mr-2" />
                                                    {pkg.level}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Generate Button */}
                                    <div className="flex gap-2 items-center">

                                        <Select 
                                        value={data?.packageSelected || "economy"}
                                        onValueChange={(value) => handlePackageSelectChage(value as packageLevelType)}>
                                            <SelectTrigger className="w-full border-2 border-gray-200 hover:border-slate-400 focus:border-slate-600 transition-colors">
                                                <SelectValue placeholder={`${data?.packageSelected}`}  />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-48 overflow-y-auto custom-scrollbar">
                                                {packageLevel.map((val) => (
                                                    <SelectItem key={val} value={val}>
                                                        {val}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>


                                        <Button
                                            isLoading={generatePending}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md transition"
                                            onClick={handleGenerate}
                                        >
                                            <i className="fas fa-file-pdf mr-2"></i>
                                            {generatePending ? "Generating..." : "Generate Comparison PDF"}
                                        </Button>
                                    </div>
                                </div>

                                {/* <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold">Total Rooms: {totalRooms}</h2>
                                </div> */}

                                {/* 
                        {showCreateForm && (
                            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                                    <CreateRoomformModel refetch={refetch} onClose={() => setShowCreateForm(false)} projectId={projectId!} />
                            </Dialog>
                        )} */}

                                <h1 className="text-lg text-gray-600 font-bold">Rooms  {selectedPackage ? `for ${selectedPackage!?.level[0].toUpperCase() + selectedPackage!?.level.slice(1)}` : ""} </h1>
                                {/* Scrollable room cards container */}
                                <div className="flex-grow min-h-[100%] py-2 sm:!min-h-0  overflow-y-auto">
                                    {/* {!isroomsAvailable ? ( */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {rooms?.map((room: any) => (
                                            <RoomCard roomType="predefinedRoom"
                                                packageId={selectedPackage?.id || null}
                                                key={room._id} room={room} projectId={projectId!} />
                                        ))}
                                        {/* {customRooms?.map((room: any) => (
                                        <RoomCard roomType="customRoom"  key={room._id} room={room} projectId={projectId!} />
                                    ))} */}
                                    </div>

                                    {rooms?.length === 0 && <div className="h-full flex items-center justify-center py-8">
                                        <div className="text-center max-w-md mx-auto">
                                            <i className="fas fa-door-open text-5xl sm:text-6xl text-blue-300 mb-4"></i>
                                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Rooms Created Yet</h2>
                                            <p className="text-gray-500">Add rooms in client requirement stage and complete the stage</p>
                                        </div>
                                    </div>}
                                </div>
                            </>
                        )}
                    </div>
                </>
                )
            }
        </div>
    );
}