import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet, useParams } from "react-router-dom";
import { useDeleteSubContract,  useGetSubContractsByOrganization } from "../../apiList/SubContract Api/subContractApi";
import { toast } from "../../utils/toast";
import { Button } from "../../components/ui/Button";
import SubContractCard from "./SubContractCard";



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
  filesBeforeWork:  SubContractFile[]
  filesAfterWork:  SubContractFile[]
  workOrderCreatedBy: any 
  status: string
}

const SubContractMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { organizationId } = useParams() as { organizationId: string }
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    projectId: "",
    workerName: "",
    dateOfCommencementFrom: "",
    dateOfCommencementTo: "",
    dateOfCompletionFrom: "",
    dateOfCompletionTo: "",
    labourCostMin: "",
    labourCostMax: "",
    materialCostMin: "",
    materialCostMax: "",
    totalCostMin: "",
    totalCostMax: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

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
    limit: 10
  });

  const deleteSubContractMutation = useDeleteSubContract();

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
      labourCostMin: "",
      labourCostMax: "",
      materialCostMin: "",
      materialCostMax: "",
      totalCostMin: "",
      totalCostMax: "",
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


  // Flatten all sub contracts and create individual entries for each worker
  const allSubContracts = data?.pages.flatMap(page => page.subContracts) || [];
  const workerEntries = allSubContracts.flatMap(contract =>
    contract.workerInfo.map((worker: any) => ({
      ...worker,
      subContractId: contract._id,
      organizationId: contract.organizationId,
      projectId: contract.projectId,
      workName: contract.workName,
      workOrderCreatedBy: contract.workOrderCreatedBy,
      shareableLink: contract.shrableLink,
      createdAt: contract.createdAt
    }))
  );

  // Apply local filters
  const filteredEntries = workerEntries.filter(entry => {
    if (filters.search && !entry.workerName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !entry.workName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && entry.status !== filters.status) return false;
    if (filters.workerName && !entry.workerName.toLowerCase().includes(filters.workerName.toLowerCase())) {
      return false;
    }
    // Add more filter conditions as needed
    return true;
  });

  const isDetailView = location.pathname.includes('/create') || location.pathname.includes('/edit');

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

        <Button onClick={() => navigate('create')}>
          <i className="fas fa-plus mr-2" />
          Create Sub Contract
        </Button>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-rupee-sign mr-2"></i>
                    Min Labour Cost
                  </label>
                  <input
                    type="number"
                    placeholder="Minimum amount..."
                    value={filters.labourCostMin}
                    onChange={(e) => setFilters(f => ({ ...f, labourCostMin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-rupee-sign mr-2"></i>
                    Max Labour Cost
                  </label>
                  <input
                    type="number"
                    placeholder="Maximum amount..."
                    value={filters.labourCostMax}
                    onChange={(e) => setFilters(f => ({ ...f, labourCostMax: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sort Options */}
                <div>
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
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {filteredEntries.length === 0 ? (
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
                {filteredEntries.map((entry, index) => (
                  <SubContractCard
                    key={`${entry.subContractId}-${entry._id}-${index}`}
                    data={entry}
                    index={index}
                    onDelete={() => handleDelete(entry.subContractId)}
                    // onDeleteSub={() => handleDeleteWork(entry.subContractId, entry.workId)}
                  />
                ))}
              </div>

              {/* Loading indicator */}
              {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-2 text-blue-600">
                    <i className="fas fa-spinner fa-spin text-2xl"></i>
                    <span className="text-sm font-medium">Loading more...</span>
                  </div>
                </div>
              )}

              {/* End of list */}
              {!hasNextPage && filteredEntries.length > 0 && (
                <div className="flex justify-center py-6">
                  <p className="text-gray-400 text-sm font-medium">
                    <i className="fas fa-check-circle mr-2"></i>
                    You've reached the end of the list
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default SubContractMain;