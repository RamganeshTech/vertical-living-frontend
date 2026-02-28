import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation, Outlet } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { useDebounce } from '../../../Hooks/useDebounce';
// import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import StageGuide from '../../../shared/StageGuide';
import PreSalesQuoteCard from './PreSalesQuoteCard';
import { useCreatePreSalesQuote, useGetAllPreSalesQuote } from '../../../apiList/Quote Api/preSalesQuote_Api/preSalesQuoteApi';
import CreatePreSalesQuoteModal from './CreatePreSalesQuoteModal';
import { toast } from '../../../utils/toast';
// import PreSalesQuoteCard from './PreSalesQuoteCard';
// import { useGetPreSalesQuotesAll } from '../../../apiList/Quote Api/preSalesQuoteApi'; // Adjust import based on your API file

const PreSalesQuoteMain: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // const { role, permission } = useAuthCheck();


    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFormData, setModalFormData] = useState({ mainQuoteName: "" });


    // const canList = role === "owner" || permission?.presales?.list;

    // Sidebar Filters
    const [filters, setFilters] = useState({
        status: '',
        search: "",
        startDate: '',
        endDate: '',
    });

    // --- Debounce Hooks ---
    const debouncedSearch = useDebounce(filters.search, 800);
    const debouncedStartDate = useDebounce(filters.startDate, 800);
    const debouncedEndDate = useDebounce(filters.endDate, 800);

    // --- Construct Final Filter Object ---
    const apiFilters = useMemo(() => ({
        status: filters.status,
        startDate: debouncedStartDate,
        endDate: debouncedEndDate,
        search: debouncedSearch,
    }), [filters.status, debouncedSearch, debouncedStartDate, debouncedEndDate]);

    // --- Fetch Records (Infinite) ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllPreSalesQuote(organizationId!, apiFilters);

    // --- Create Mutation Hook ---
    const { mutateAsync: createMutation, isPending: isCreating } = useCreatePreSalesQuote();

    const handleCreateSubmit = async () => {
        // Basic validation
        if (!modalFormData.mainQuoteName) {
            toast({ title: "Error", description: "Please enter  quote name", variant: "destructive" });
        }

        try {
            const response = await createMutation({
                organizationId: organizationId,
                mainQuoteName: modalFormData.mainQuoteName,
                // You can add quoteType or other fields here if your modal expanded
                status: "draft"
            });

            // Log for debugging as per your reference
            console.log("response", response);

            // ✅ Navigate using the _id from backend response
            // Using 'single' as the base route
            navigate(`single/${response.data._id}`);


            // Reset and Close
            setIsModalOpen(false);
            setModalFormData({ mainQuoteName: "" });
            // toast({ title: "Error", description: "Please enter  quote name", variant: "destructive" });
        } catch (error: any) {
            // toast.error(error.message || "Failed to create variant quote");
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to create", variant: "destructive" });

        }
    };

    // --- Infinite Scroll Logic ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const activeFiltersCount = [
        filters.status,
        filters.startDate,
        filters.endDate,
    ].filter(Boolean).length + (filters.search ? 1 : 0);

    const clearFilters = () => {
        setFilters({
            status: '',
            search: "",
            startDate: '',
            endDate: '',
        });
    };

    const records = data?.pages.flatMap(page => page.data) || [];

    const isSubPage = location.pathname.includes("single") || location.pathname.includes("create");
    if (isSubPage) return <Outlet />;

    return (
        <div className="p-2 space-y-4 h-full relative">

            {/* Create Popup Modal */}
            {isModalOpen && (
                <CreatePreSalesQuoteModal
                    formData={modalFormData}
                    setFormData={setModalFormData}
                    isEditing={false}
                    setModalOpen={setIsModalOpen}
                    handleSubmit={handleCreateSubmit}
                    isSubmitting={isCreating}
                />
            )}


            <header className="flex justify-between items-center pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file-invoice mr-3 text-blue-600"></i>
                        Pre-Sales Quotations
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Generate and manage initial technical audits and client estimations
                    </p>
                </div>

                <div className="flex gap-2 items-center">
                    <StageGuide organizationId={organizationId!} stageName="presales" />
                    <Button variant='primary' onClick={() => setIsModalOpen(true)}>
                        <i className="fas fa-plus mr-2"></i>
                        Create Quote
                    </Button>
                </div>
            </header>

            {isLoading ? (
                <MaterialOverviewLoading />
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-4 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-red-500 mb-4">{(error as any)?.message || "Failed to load data"}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">Retry</Button>
                </div>
            ) : (
                <main className="flex gap-4 h-[calc(100%-90px)]">
                    {/* --- Filter Sidebar --- */}
                    <div className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i>
                                    Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search Client Name, No"
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="draft">Draft</option>
                                        <option value="sent">Sent to Client</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                </div> */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                    <div className="space-y-2">
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- List View --- */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {records.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 text-center p-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-calculator text-3xl text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">No Quotations Found</h3>
                                <p className="text-sm text-gray-500">Create your first pre-sales audit to see it here.</p>
                            </div>
                        ) : (
                            <div
                                ref={scrollContainerRef}
                                className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
                            >
                                {/* Sticky Header */}
                                <div className="sticky top-0 z-10 bg-white border-b border-blue-200 shadow-sm">
                                    <div className="grid grid-cols-11 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                        <div className="col-span-1 text-center">#</div>
                                        <div className="col-span-2">Quote No</div>
                                        <div className="col-span-2">Quote Name</div>
                                        <div className="col-span-2 text-center">Area (sqft)</div>
                                        <div className="col-span-2 text-center">Amount</div>
                                        {/* <div className="col-span-1 text-center">Status</div> */}
                                        <div className="col-span-2 text-center">Action</div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {records.map((record: any, index: number) => (
                                        <PreSalesQuoteCard
                                            key={record._id}
                                            data={record}
                                            index={index}
                                            onView={() => navigate(`single/${record._id}`)}
                                        />
                                    ))}
                                </div>

                                {isFetchingNextPage && (
                                    <div className="flex justify-center py-6 bg-gray-50">
                                        <i className="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
                                        <span className="text-sm">Loading more...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};

export default PreSalesQuoteMain;