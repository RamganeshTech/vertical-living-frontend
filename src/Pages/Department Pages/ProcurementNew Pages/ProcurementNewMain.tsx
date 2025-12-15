import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import ProcurementCard from "./ProcurementCard";
import { Button } from "../../../components/ui/Button";
import { useGetProjects } from "../../../apiList/projectApi";
import type { AvailableProjetType } from "../Logistics Pages/LogisticsShipmentForm";
import { useDeleteProcurement, useGetProcurementNewDetails } from "../../../apiList/Department Api/Procurement Api/procurementApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
import { toast } from "../../../utils/toast";

import Slider from 'rc-slider';
import "rc-slider/assets/index.css";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";


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




type filtersType = {
    projectId: string;
    projectName: string;
    search: string;
    isSyncWithPaymentsSection: null | boolean;
    isConfirmedRate: boolean;
    fromDate: string;
    toDate: string;
    minAmount: number;
    maxAmount: number;
}

const ProcurementNewMain: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();


    // --- Filter State ---
    const [filters, setFilters] = useState<filtersType>({
        projectId: "",
        projectName: "",
        search: "",
        isSyncWithPaymentsSection: null, // null = all
        isConfirmedRate: false,
        fromDate: "",
        toDate: "",
        minAmount: 0,
        maxAmount: 100000
    });


    const { data } = useGetProjects(organizationId!)
    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))




    const { role, permission } = useAuthCheck();


    const canCreate = role === "owner" || permission?.procurement?.create;
    const canList = role === "owner" || permission?.procurement?.list;


    // --- Debouncing ---
    const debouncedSearch = useDebounce(filters.search, 800);
    const debouncedMinAmount = useDebounce(filters.minAmount, 800);
    const debouncedMaxAmount = useDebounce(filters.maxAmount, 800);
    const debouncedfromDate = useDebounce(filters.fromDate, 800);
    const debouncedtoDate = useDebounce(filters.toDate, 800);

    // --- Construct API Filters (Memoized) ---
    const apiFilters = useMemo(() => ({
        projectId: filters.projectId,
        // fromDept: filters.fromDept,
        isSyncWithPaymentsSection: filters.isSyncWithPaymentsSection,
        isConfirmedRate: filters.isConfirmedRate,
        search: debouncedSearch,
        minAmount: debouncedMinAmount,
        maxAmount: debouncedMaxAmount,
        fromDate: debouncedfromDate,
        toDate: debouncedtoDate,
    }), [
        filters.projectId,
        // filters.fromDept, 
        filters.isSyncWithPaymentsSection,
        filters.isConfirmedRate,
        debouncedSearch,
        debouncedMinAmount,
        debouncedMaxAmount,
        debouncedfromDate,
        debouncedtoDate
    ]);


    // const { data: procurements, isLoading, isError, error, refetch } = useGetProcurementNewDetails(organizationId!, filters);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const {
        data: procurements,
        error, refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useGetProcurementNewDetails(organizationId!, apiFilters);

    const allProcurements = procurements?.pages.flatMap((page) => page.items) || [];


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






    // --- Infinite Scroll Logic ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading more accounting records...');
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);




    const clearFilters = () => {
        setFilters({
            projectId: "",
            projectName: "",
            search: "",
            isSyncWithPaymentsSection: null, // null = all
            isConfirmedRate: false,
            minAmount: 0,
            maxAmount: 1000000,
            fromDate: "",
            toDate: ""
        });
    };


    const isSubPage = location.pathname.includes("sub") || location.pathname.includes("create");

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


              <div className="flex gap-2 items-center">
                  {canCreate && <Button
                    onClick={() => navigate('create')}
                >
                    <i className="fas fa-plus mr-2" />
                    Create
                </Button>}

                <div className="w-full sm:w-auto flex justify-end sm:block">
                    <StageGuide
                        organizationId={organizationId!}
                        stageName="procurement"
                    />
                </div>

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

                    <div className="xl:w-80 flex-shrink-0 max-h-full overflow-y-auto">
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





                            {/* <div>
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
                                        {projects?.map((project: AvailableProjetType) => (
                                            <option key={project._id} value={project._id}>{project.projectName}</option>
                                        ))}
                                    </select>
                                </div> */}


                            {/* Payment Status Toggle Button */}


                            <div className="space-y-3">
                                {/* 1. Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                    <input
                                        type="text"
                                        placeholder="No, Shop Name, Site..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* 2. Project */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                    <select
                                        value={filters.projectId || ''}
                                        onChange={(e) => {
                                            const selected = projects?.find((p: any) => p._id === e.target.value);
                                            setFilters(prev => ({
                                                ...prev,
                                                projectId: e.target.value,
                                                projectName: selected?.projectName || ""
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Projects</option>
                                        {projects?.map((project: any) => (
                                            <option key={project._id} value={project._id}>{project.projectName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 3. Sections */}

                                {/* 4. Date Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 mb-1">From</span>
                                            <input
                                                type="date"
                                                value={filters.fromDate}
                                                onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 mb-1">To</span>
                                            <input
                                                type="date"
                                                value={filters.toDate}
                                                onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Status (Compact Radio Buttons) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                    <div className="grid grid-cols-2 gap-2">

                                        {/* Option 1: Pending (False) */}
                                        <label className={`cursor-pointer flex items-center justify-center px-3 py-2 border rounded-lg transition-all duration-200 ${filters.isSyncWithPaymentsSection === false
                                            ? "bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-200 shadow-sm" // Selected: Light Blue
                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"                  // Default
                                            }`}>
                                            <input
                                                type="radio"
                                                name="payment_status"
                                                className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                checked={filters.isSyncWithPaymentsSection === false}
                                                onChange={() => setFilters(prev => ({ ...prev, isSyncWithPaymentsSection: false }))}
                                            />
                                            <span className="ml-2 text-xs font-semibold">Pending</span>
                                        </label>

                                        {/* Option 2: Sent (True) */}
                                        <label className={`cursor-pointer flex items-center justify-center px-3 py-2 border rounded-lg transition-all duration-200 ${filters.isSyncWithPaymentsSection === true
                                            ? "bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-200 shadow-sm" // Selected: Light Blue
                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"                  // Default
                                            }`}>
                                            <input
                                                type="radio"
                                                name="payment_status"
                                                className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                checked={filters.isSyncWithPaymentsSection === true}
                                                onChange={() => setFilters(prev => ({ ...prev, isSyncWithPaymentsSection: true }))}
                                            />
                                            <span className="ml-2 text-xs font-semibold">Sent</span>
                                        </label>

                                    </div>
                                </div>


                                {/* 5. Amount Range Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Cost Range
                                    </label>
                                    <div className="px-2 mb-3 pt-2">
                                        <Slider
                                            range
                                            min={0}
                                            max={100000} // You can make this dynamic if needed
                                            step={500}
                                            value={[Number(filters.minAmount), Number(filters.maxAmount)]}
                                            onChange={(value) => {
                                                const [min, max] = value as [number, number];
                                                setFilters((f) => ({ ...f, minAmount: min, maxAmount: max }));
                                            }}
                                            trackStyle={[{ backgroundColor: "#3b82f6", height: 6 }]}
                                            handleStyle={[
                                                { borderColor: "#3b82f6", backgroundColor: "#fff", width: 18, height: 18, marginTop: -6, opacity: 1 },
                                                { borderColor: "#3b82f6", backgroundColor: "#fff", width: 18, height: 18, marginTop: -6, opacity: 1 }
                                            ]}
                                            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center gap-2 text-sm">
                                        <div className="bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs font-bold">
                                            ₹{filters.minAmount}
                                        </div>
                                        <div className="bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs font-bold">
                                            ₹{filters.maxAmount}
                                        </div>
                                    </div>



                                    <div className="flex gap-2 items-center mt-3">
                                        <input
                                            type="number"
                                            value={filters.minAmount}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, minAmount: +e.target.value }))
                                            }
                                            placeholder="Min"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                        <input
                                            type="number"
                                            value={filters.maxAmount}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, maxAmount: +e.target.value }))
                                            }
                                            placeholder="Max"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </div>


                                </div>

                            </div>




                            {/* end of filters  */}
                        </div>
                    </div>

                    {canList && <>
                        {allProcurements.length === 0 ? (
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
                            <div
                                ref={scrollContainerRef}
                                className="flex-1 max-h-[100%]  overflow-y-auto">

                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 ">
                                    {allProcurements.map((item: IProcurementNew) => (

                                        <ProcurementCard
                                            key={item._id}
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
                                            createdAt={(item as any)?.createdAt}

                                            // Actions
                                            onView={() => navigate(`sub/${item._id!}`)}
                                            onDelete={() => handleDeleteProcurement({ id: item._id! })}
                                            deletePending={deletePending && variables.id === item._id}
                                        />
                                    ))}
                                </div>



                                {isFetchingNextPage ? (
                                    <div className="flex flex-col items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-2xl"></i>
                                        <span className="text-sm font-medium">Loading more items...</span>
                                    </div>
                                ) : hasNextPage ? (
                                    // Invisible spacer to ensure scroll target exists
                                    <div className="h-4 w-full"></div>
                                ) : (
                                    // Optional: "End of List" message
                                    allProcurements.length > 0 && (
                                        // <p className="text-xs text-center text-gray-400 mt-4">No more items to load</p>
                                        <div className="flex mt-4 justify-center py-6 bg-gray-50 border-t border-gray-100">
                                            <p className="text-gray-400 text-sm font-medium flex items-center">
                                                <i className="fas fa-check-circle mr-2"></i>
                                                All records loaded
                                            </p>
                                        </div>
                                    )
                                )}


                            </div>
                        )}
                    </>}
                </main>
            )
            }
        </div >
    );
};

export default ProcurementNewMain;