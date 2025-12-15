import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet, useParams } from "react-router-dom";
import { useDeleteSubContract, useGetSubContractsByOrganization } from "../../../apiList/SubContract Api/subContractNewApi";
import { toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import SubContractCard from "./SubContractCard";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Input } from "../../../components/ui/Input";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";

interface FilterState {
  search: string;
  status: string;
  projectId: string;
  workerName: string;
  dateOfCommencementFrom: string;
  dateOfCommencementTo: string;
  dateOfCompletionFrom: string;
  dateOfCompletionTo: string;
  labourCostMin: string;
  labourCostMax: string;
  materialCostMin: string;
  materialCostMax: string;
  totalCostMin: string;
  totalCostMax: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}



export interface SubContractFile {
  type: "image" | "pdf";
  url: string;
  originalName: string;
  uploadedAt: Date;
}


export interface SubContractSingleData {
  _id?: string
  projectId: {
    _id: string,
    projectName: string
  };
  workerName: string;
  workName: string;
  dateOfCommencement: string;
  dateOfCompletion: string;
  totalCost: number
  labourCost: number;
  materialCost: number;
  filesBeforeWork: SubContractFile[]
  filesAfterWork: SubContractFile[]
  workOrderCreatedBy: any
  status: string
}

const SubContractMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { organizationId } = useParams() as { organizationId: string }


  const { role, permission } = useAuthCheck();
  const canList = role === "owner" || permission?.subcontract?.list;
  const canCreate = role === "owner" || permission?.subcontract?.create;



  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    projectId: "",
    workerName: "",
    dateOfCommencementFrom: "",
    dateOfCommencementTo: "",
    dateOfCompletionFrom: "",
    dateOfCompletionTo: "",
    labourCostMin: "0",
    labourCostMax: "100000",
    materialCostMin: "0",
    materialCostMax: "100000",
    totalCostMin: "0",
    totalCostMax: "100000",
    sortBy: "createdAt",
    sortOrder: "desc"
  });


  const debouncedSearch = useDebounce(filters.search, 500);
  // const debouncedLabourCostMin = useDebounce(filters.labourCostMin, 800);
  // const debouncedLabourCostMax = useDebounce(filters.labourCostMax, 800);
  // const debouncedMaterialCostMin = useDebounce(filters.materialCostMin, 800);
  // const debouncedMaterialCostMax = useDebounce(filters.materialCostMax, 800);

  // const debouncedTotalCostMin = useDebounce(filters.totalCostMin, 800);
  // const debouncedTotalCostMax = useDebounce(filters.totalCostMax, 800);




  const costFilters = [
    {
      title: "Labour Cost",
      minKey: "labourCostMin",
      maxKey: "labourCostMax",
    },
    {
      title: "Material Cost",
      minKey: "materialCostMin",
      maxKey: "materialCostMax",
    },
    {
      title: "Total Cost",
      minKey: "totalCostMin",
      maxKey: "totalCostMax",
    }
  ] as const;


  const debounced = {
    labourCostMin: useDebounce(filters.labourCostMin, 500),
    labourCostMax: useDebounce(filters.labourCostMax, 500),
    materialCostMin: useDebounce(filters.materialCostMin, 500),
    materialCostMax: useDebounce(filters.materialCostMax, 500),
    totalCostMin: useDebounce(filters.totalCostMin, 500),
    totalCostMax: useDebounce(filters.totalCostMax, 500),
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useGetSubContractsByOrganization({
    organizationId: organizationId || "",
    status: filters.status,
    projectId: filters.projectId,
    search: debouncedSearch || undefined,

    labourCostMin: filters.labourCostMin,
    labourCostMax: filters.labourCostMax,

    materialCostMin: filters.materialCostMin,
    materialCostMax: filters.materialCostMax,

    totalCostMin: filters.totalCostMin,
    totalCostMax: filters.totalCostMax,

    dateOfCommencementFrom: filters.dateOfCommencementFrom,
    dateOfCommencementTo: filters.dateOfCommencementTo,

    dateOfCompletionFrom: filters.dateOfCompletionFrom,
    dateOfCompletionTo: filters.dateOfCompletionTo,



    limit: 10
  });

  const deleteSubContractMutation = useDeleteSubContract();
  // const deleteSubContractWorkMutation = useDeleteSubContractWork();

  // const paths = [
  //   { label: "Home", path: "/" },
  //   { label: "Sub Contracts", path: "/subcontracts" }
  // ];

  // Calculate active filters count
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== "";
  }).length;

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      projectId: "",
      workerName: "",
      dateOfCommencementFrom: "",
      dateOfCommencementTo: "",
      dateOfCompletionFrom: "",
      dateOfCompletionTo: "",
      labourCostMin: "0",
      labourCostMax: "100000",
      materialCostMin: "0",
      materialCostMax: "100000",
      totalCostMin: "0",
      totalCostMax: "100000",
      sortBy: "createdAt",
      sortOrder: "desc"
    });
  };

  // Scroll handler for infinite loading
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleDelete = async (subContractId: string) => {
    try {
      await deleteSubContractMutation.mutateAsync({ subContractId });
      refetch();
      toast({ title: "Success", description: "Sub Contract deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to delete sub contract",
        variant: "destructive"
      });
    }
  };



  // SLIDER UTILS

  // const maxPrice = useMemo(() => {
  //     // console.log(maxPrice)
  //     return data?.pages ? data?.pages?.length > 0
  //         ? Math.max(...data?.pages?.map((p: any) => p?.specification?.mrp))
  //         : 100000 : 100000  // Default max if no products are there
  // }, [data]);


  // const minPrice = useMemo(() => 0, [])

  // const handleRangeChange = useCallback((value: number | number[]) => {


  //     if (Array.isArray(value) && value.length === 2) {
  //         const [min, max] = value as [number, number];
  //         setMinMrp(String(min)); // Update your existing state
  //         setMaxMrp(String(max)); // Update your existing state
  //     }
  // }, [maxPrice]);
  // Debounced values - 500ms delay for search, 800ms for price inputs

  // Show loading indicator when values are being debounced
  // const isDebouncing = search !== debouncedSearch ||
  //   minMrp !== debouncedMinMrp ||
  //   maxMrp !== debouncedMaxMrp || 






  const allSubContracts = data?.pages.flatMap(page => page.subContracts) || [];


  const isDetailView = location.pathname.includes('/create') || location.pathname.includes('/single');

  if (isDetailView) {
    return <Outlet />;
  }

  return (
    <div className="space-y-0 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-hard-hat mr-3 text-blue-600"></i>
            Sub Contracts
          </h1>
          {/* <Breadcrumb paths={paths} /> */}
        </div>

        <div className='flex gap-3 items-center'>

          {canCreate && <Button onClick={() => navigate('create')}>
            <i className="fas fa-plus mr-2" />
            Create Sub Contract
          </Button>}


          <div className="w-full sm:w-auto flex justify-end sm:block">
            <StageGuide
              organizationId={organizationId!}
              stageName="subcontract"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
        </div>
      ) : isError ? (
        <div className="max-w-xl sm:min-w-[80%] mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
          <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
            ⚠️ Error Occurred
          </div>
          <p className="text-red-500 mb-4 text-lg sm:text-xl">
            {(error as any)?.message || "Failed to load sub contracts"}
          </p>
          <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">
            Retry
          </Button>
        </div>
      ) : (
        <main className="flex gap-2 !max-h-[90%]">
          {/* Filters Sidebar */}
          <div className="xl:w-80 flex-shrink-0 !max-h-[100%] overflow-y-auto">
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
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-search mr-2"></i>
                    Search
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Work name, worker name..."
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-flag mr-2"></i>
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Worker Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-user mr-2"></i>
                    Worker Name
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by worker name..."
                    value={filters.workerName}
                    onChange={(e) => setFilters(f => ({ ...f, workerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Commencement Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-calendar-check mr-2"></i>
                    Commencement From
                  </label>
                  <input
                    type="date"
                    value={filters.dateOfCommencementFrom}
                    onChange={(e) => setFilters(f => ({ ...f, dateOfCommencementFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-calendar-check mr-2"></i>
                    Commencement To
                  </label>
                  <input
                    type="date"
                    value={filters.dateOfCommencementTo}
                    onChange={(e) => setFilters(f => ({ ...f, dateOfCommencementTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Labour Cost Range */}


                {/* <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>


                  <div className="px-2 mb-3">
                    <Slider
                      range
                      min={0}
                      max={100000}
                      step={500}
                      value={[Number(filters.labourCostMin), Number(filters.labourCostMax)]} // Use your existing states
                      onChange={(value) => {
                        const [min, max] = value as [number, number];
                        setFilters(p=> ({...p, labourCostMin:String(min), labourCostMax: String(max)})); // Update your existing state
                      }}
                      trackStyle={[{ backgroundColor: '#3b82f6', height: 6 }]}
                      handleStyle={[
                        {
                          borderColor: '#3b82f6',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                          width: 18,
                          height: 18,
                          marginTop: -6
                        },
                        {
                          borderColor: '#3b82f6',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                          width: 18,
                          height: 18,
                          marginTop: -6
                        }
                      ]}
                      railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2 text-sm">
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 block mb-1">Min</span>
                      <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                        ₹{Number(filters.labourCostMin).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-gray-400 mt-5">—</div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 block mb-1">Max</span>
                      <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                        ₹{Number(filters.labourCostMax).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>


                  <div className="flex flex-col gap-3 items-center mt-2">

                    <Input className="" type="number" value={filters.labourCostMin} onChange={e => setFilters(p=> ({...p, labourCostMin:String(e.target.value)}))} />
                    <Input className="" type="number" value={filters.labourCostMax} onChange={e => setFilters(p=> ({...p, labourCostMax:String(e.target.value)}))} />
                  </div>
                </div> */}



                {costFilters.map(({ title, minKey, maxKey }) => {
                  const minValue = Number(filters[minKey]);
                  const maxValue = Number(filters[maxKey]);

                  const debouncedMin = debounced[minKey];
                  const debouncedMax = debounced[maxKey];

                  return (
                    <div key={minKey} className="mb-6">

                      {/* Title */}
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {title} Range
                        {(minValue !== Number(debouncedMin) || maxValue !== Number(debouncedMax)) && (
                          <span className="ml-2 text-xs text-amber-600">
                            <i className="fas fa-circle animate-pulse"></i>
                          </span>
                        )}
                      </label>

                      {/* Slider */}
                      <div className="px-2 mb-3">
                        <Slider
                          range
                          min={0}
                          max={100000}
                          step={500}
                          value={[minValue, maxValue]}
                          onChange={(value) => {
                            const [min, max] = value as [number, number];
                            setFilters((p) => ({
                              ...p,
                              [minKey]: String(min),
                              [maxKey]: String(max)
                            }));
                          }}
                          trackStyle={[{ backgroundColor: '#3b82f6', height: 6 }]}
                          railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                          handleStyle={[
                            {
                              borderColor: '#3b82f6',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                              width: 18,
                              height: 18,
                              marginTop: -6
                            },
                            {
                              borderColor: '#3b82f6',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
                              width: 18,
                              height: 18,
                              marginTop: -6
                            }
                          ]}
                        />
                      </div>

                      {/* Min/Max Display */}
                      <div className="flex justify-between items-center gap-2 text-sm">
                        <div className="flex-1">
                          <span className="text-xs text-gray-500 block mb-1">Min</span>
                          <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                            ₹{Number(minValue).toLocaleString("en-IN")}
                          </div>
                        </div>

                        <div className="text-gray-400 mt-5">—</div>

                        <div className="flex-1">
                          <span className="text-xs text-gray-500 block mb-1">Max</span>
                          <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                            ₹{Number(maxValue).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      {/* Input fields */}
                      <div className="flex flex-col gap-3 items-center mt-2">
                        <Input
                          type="number"
                          value={filters[minKey]}
                          onChange={(e) =>
                            setFilters((p) => ({ ...p, [minKey]: e.target.value }))
                          }
                        />
                        <Input
                          type="number"
                          value={filters[maxKey]}
                          onChange={(e) =>
                            setFilters((p) => ({ ...p, [maxKey]: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  );
                })}


                {/* Sort Options */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="dateOfCommencement">Commencement Date</option>
                    <option value="dateOfCompletion">Completion Date</option>
                    <option value="totalCost">Total Cost</option>
                    <option value="workerName">Worker Name</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters(f => ({ ...f, sortOrder: e.target.value as 'asc' | 'desc' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div> */}


              </div>
            </div>
          </div>

          {canList && <>{allSubContracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
              <i className="fas fa-hard-hat text-5xl text-blue-300 mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-1">No Sub Contracts Found</h3>
              <p className="text-sm text-gray-500">
                {filters.search || activeFiltersCount > 0
                  ? 'Try adjusting your filters to find sub contracts.'
                  : 'Looks like there are no sub contracts yet.'}
                <br />
                Click on <strong>"Create Sub Contract"</strong> to get started 🚀
              </p>
            </div>
          ) : (
            <div ref={scrollContainerRef} className="flex-1 !max-h-[100%] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {allSubContracts.map((entry: SubContractSingleData, index) => (
                  <SubContractCard
                    key={entry._id}
                    data={entry}
                    index={index}
                    onView={() => navigate(`single/${entry._id}`)}
                    onDelete={() => handleDelete(entry._id!)}
                    isDeleting={deleteSubContractMutation.isPending && deleteSubContractMutation.variables.subContractId === entry._id}
                  />
                ))}
              </div>

              {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-2 text-blue-600">
                    <i className="fas fa-spinner fa-spin text-2xl"></i>
                    <span className="text-sm font-medium">Loading more...</span>
                  </div>
                </div>
              )}

              {!hasNextPage && allSubContracts.length > 0 && (
                <div className="flex justify-center py-6">
                  <p className="text-gray-400 text-sm font-medium">
                    <i className="fas fa-check-circle mr-2"></i>
                    You've reached the end of the list
                  </p>
                </div>
              )}
            </div>
          )}

          </>}
        </main>
      )}
    </div>
  );
};

export default SubContractMain;