import React, { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import ProcurementCard from "./ProcurementCard";
import { Button } from "../../../components/ui/Button";
import { useGetProjects } from "../../../apiList/projectApi";
import type { AvailableProjetType } from "../Logistics Pages/LogisticsShipmentForm";
import { useDeleteProcurement, useGetProcurementNewDetails } from "../../../apiList/Department Api/Procurement Api/procurementApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";


export interface OrderMaterialSiteDetail {
    siteName: String,
    address: String,
    siteSupervisor: String,
    phoneNumber: String,
}

export interface OrderMaterialShopDetails {
    shopName: String,
    address: String,
    upiId: string
    contactPerson: String,
    phoneNumber: String,
}


export interface OrderSubItems {
    subItemName: string,
    refId: string,
    quantity: number,
    unit: string,
    rate: number,
    totalCost: number
}

export interface IProcurementNew {
    _id?: string
    organizationId: string,
    projectId: {
        _id: string,
        projectName: string
    } | null,
    shopDetails: OrderMaterialShopDetails,
    deliveryLocationDetails: OrderMaterialSiteDetail,
    selectedUnits: OrderSubItems[],

    shopQuoteNumber: string,
    fromDeptNumber: string;
    isConfirmedRate: boolean,
    procurementNumber: string;
    fromDeptName: string
    fromDeptModel: string;

    generatedLink?: string
    isSyncWithPaymentsSection: boolean,

    totalCost: number
    refPdfId: string
}



const ProcurementNewMain: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        projectId: "",
        projectName: "",
    });


    const { data } = useGetProjects(organizationId!)
    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))


    const { data: procurements, isLoading, isError, error, refetch } = useGetProcurementNewDetails(organizationId!, filters);
    const { mutateAsync: deleteProcurement, isPending: deletePending, variables } = useDeleteProcurement();

    const handleDeleteProcurement = async ({ id }: { id: string }) => {
        try {
            await deleteProcurement({ id })
            toast({ title: "Success", description: "Deleted Successfully" });
        }
        catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "Failed to delete" });
        }
    }

    // const activeFiltersCount = Object.values(filters).filter(Boolean).length;



    const clearFilters = () => {
        setFilters({
            projectId: "",
            projectName: "",
        });
    };


    const isSubPage = location.pathname.includes("sub");

    if (isSubPage) return <Outlet />; // subpage like /vehicles




    return (
        <div className="p-2 space-y-6 max-w-full h-full ">


            <div className="flex justify-between items-center">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-box-open mr-3 text-blue-600"></i>
                        Procurement Department
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the Projects Material Items
                    </p>
                </div>


                {/* <h2 className="text-3xl font-bold text-blue-600">Logistics Department</h2> */}

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
                <main className="flex gap-2 h-[88%] ">

                    <div className="xl:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i>
                                    Filters
                                </h3>

                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                                >
                                    Clear All
                                </button>

                            </div>

                            <div className="space-y-6">
                                {/* <div>
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
                                </div> */}


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
                    {procurements.length === 0 ? (
                        <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Procurements Found</h3>
                            <p className="text-sm text-gray-500">
                                Looks like there are no Procurements yet for this project.<br />
                                {/* Click on <strong>"Add Shipment"</strong> to get started 🚀 */}
                                Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 max-h-[100%]  overflow-y-auto">

                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 ">
                                {procurements.map((item: IProcurementNew) => (
                                    <>
                                        <ProcurementCard

                                            // key={po._id}
                                            // shopDetails={po.shopDetails}
                                            // siteDetails={po.deliveryLocationDetails}
                                            // totalCost={po.totalCost}
                                            // refPdfId={po.refPdfId}
                                            // onView={() => navigate(`sub/${po._id}`)}
                                            // onDelete={(e:any) => {
                                            //     e.stopPropagation();
                                            //    handleDeleteProcurement({id:po._id!})
                                            // }
                                            // }
                                            // deletePending={deletePending && variables.id === po._id! }

                                            procurementNumber={item?.procurementNumber || item?.refPdfId}
                                            fromDeptName={item?.fromDeptName}
                                            fromDeptNumber={item?.fromDeptNumber}

                                            // Status Logic
                                            isConfirmedRate={item?.isConfirmedRate}
                                            isSyncWithPaymentsSection={item?.isSyncWithPaymentsSection}

                                            // Details
                                            projectName={item?.projectId?.projectName}
                                            shopDetails={item?.shopDetails}

                                            // Stats
                                            itemCount={item?.selectedUnits?.length || 0}
                                            totalCost={item?.totalCost || 0}

                                            // Actions
                                            onView={() => navigate(`sub/${item._id!}`)}
                                            onDelete={() => handleDeleteProcurement({id:item._id!})}
                                            deletePending={deletePending && variables.id === item._id}
                                        />
                                    </>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            )}
        </div>
    );
};

export default ProcurementNewMain;