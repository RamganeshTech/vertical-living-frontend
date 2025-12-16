



import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Ensure you have installed rc-slider

// --- Custom Components & Hooks ---
import { Button } from '../../../../components/ui/Button';
import { toast } from '../../../../utils/toast';
import { Breadcrumb, type BreadcrumbItem } from '../../Breadcrumb';
import { useDebounce } from '../../../../Hooks/useDebounce';

// --- API Hooks ---
// import { useDeletePayment, useInfinitePayments } from './hooks/payment.hooks'; // Adjust path
import PaymentAccList from './PaymentAccList'; // We will create this next
import { useDeletePayment, useInfinitePayments } from '../../../../apiList/Department Api/Accounting Api/paymentAccApi';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
import StageGuide from '../../../../shared/StageGuide';

const PaymentAccMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { role, permission } = useAuthCheck();
    // const canDelete = role === "owner" || permission?.payments?.delete;
    const canList = role === "owner" || permission?.payments?.list;
    // const canCreate = role === "owner" || permission?.payments?.create;
    // const canEdit = role === "owner" || permission?.payments?.create;


    // --- Breadcrumbs ---
    const paths: BreadcrumbItem[] = [
        { label: "Account", path: `/organizations/${organizationId}/projects/accounting` },
        { label: "Payments", path: `/organizations/${organizationId}/projects/paymentmain` },
    ];

    // --- Check for Child Routes (Create / Single View) ---
    const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');

    // --- Local State for Filters ---
    const [filters, setFilters] = useState({
        search: '', // Maps to personName
        minAmount: 0,
        maxAmount: 1000000,
        startDate: '', // Payment Date From
        endDate: '',   // Payment Date To
        fromSection: '', // bill, expense, etc.
    });

    // --- Debounce Values to prevent API spam ---
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedMinAmount = useDebounce(filters.minAmount, 800);
    const debouncedMaxAmount = useDebounce(filters.maxAmount, 800);

    // --- Infinite Query Hook ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useInfinitePayments({
        organizationId: organizationId || '',
        personName: debouncedSearch || undefined,
        minAmount: debouncedMinAmount,
        maxAmount: debouncedMaxAmount,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        fromSection: filters.fromSection || undefined,
    });

    const deletePaymentMutation = useDeletePayment();

    // --- Infinite Scroll Logic ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Load more when user is 100px from bottom
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading more payments...');
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // --- Handlers ---
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment record?")) return;

        try {
            await deletePaymentMutation.mutateAsync(id);
            // Note: Invalidation is handled in the hook, but we can force refetch if needed
            // refetch(); 
            toast({ title: "Success", description: "Payment record deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to delete payment",
                variant: "destructive"
            });
        }
    };

    const handleView = (id: string) => {
        navigate(`single/${id}`);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            minAmount: 0,
            maxAmount: 10000000,
            startDate: '',
            endDate: '',
            fromSection: ''
        });
    };

    // Calculate active filters for UI
    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 0 && val !== 100000
    ).length;

    // Flatten Pages for Rendering
    const payments = data?.pages.flatMap(page => page.data) || [];

    // --- Render Child Route if active ---
    if (isDetailView) {
        return <Outlet />;
    }

    return (
        <div className="space-y-0 h-full">
            {/* --- Header --- */}
            <header className="flex justify-between items-center pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-money-check-alt mr-3 text-blue-600"></i>
                        Payments
                    </h1>
                    <Breadcrumb paths={paths} />
                </div>

                {/* <Button onClick={() => navigate('create')}>
                    <i className="fas fa-plus mr-2" />
                    Create Payment
                </Button> */}

                <div className="w-full sm:w-auto flex justify-end sm:block">
                    <StageGuide
                        organizationId={organizationId!}
                        stageName="payments"
                    />
                </div>
            </header>

            {/* --- Loading / Error States --- */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12 h-[60vh]">
                    <i className="fas fa-spinner fa-spin text-blue-600 text-4xl"></i>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-red-500 mb-4 text-lg">{(error as any)?.message || "Failed to load payments"}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">Retry</Button>
                </div>
            ) : (
                <main className="flex gap-4 h-[calc(100%-80px)]">

                    <div className="xl:w-80 lg:w-72 w-64 flex-shrink-0 h-full overflow-y-auto custom-scrollbar">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i>
                                    Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        Clear All ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* 1. Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-search mr-2 text-gray-400"></i>
                                        Search Payee
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Name, Company..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* 2. Amount Range Slider (RC Slider) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        <i className="fas fa-coins mr-2 text-gray-400"></i>
                                        Amount Range
                                    </label>

                                    <div className="px-2 mb-3">
                                        <Slider
                                            range
                                            min={0}
                                            max={1000000}
                                            step={500}
                                            value={[Number(filters.minAmount), Number(filters.maxAmount)]}
                                            onChange={(value) => {
                                                const [min, max] = value as [number, number];
                                                setFilters((f) => ({
                                                    ...f,
                                                    minAmount: min,
                                                    maxAmount: max,
                                                }));
                                            }}
                                            trackStyle={[{ backgroundColor: "#3b82f6", height: 6 }]}
                                            handleStyle={[
                                                {
                                                    borderColor: "#3b82f6",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6,
                                                    opacity: 1
                                                },
                                                {
                                                    borderColor: "#3b82f6",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6,
                                                    opacity: 1
                                                },
                                            ]}
                                            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                                        />
                                    </div>

                                    {/* Display Values */}
                                    <div className="flex justify-between items-center gap-2 text-sm">
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Min</span>
                                            <div className="bg-blue-50 px-2 py-1.5 rounded border border-blue-100 font-semibold text-blue-700 text-center text-xs">
                                                ₹{Number(filters.minAmount).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <div className="text-gray-300">—</div>
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Max</span>
                                            <div className="bg-blue-50 px-2 py-1.5 rounded border border-blue-100 font-semibold text-blue-700 text-center text-xs">
                                                ₹{Number(filters.maxAmount).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manual Input Fields */}
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

                                {/* 3. Date Filters */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                                        Due Date From
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                                        Due Date To
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* 4. Source Section Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-tag mr-2 text-gray-400"></i>
                                        Source Type
                                    </label>
                                    <select
                                        value={filters.fromSection}
                                        onChange={(e) => setFilters(f => ({ ...f, fromSection: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">All Sources</option>
                                        <option value="Bill">Bill</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {canList && <> {payments.length === 0 ? (
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8">
                            <div className="bg-blue-50 p-4 rounded-full mb-4">
                                <i className="fas fa-file-invoice-dollar text-4xl text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Payments Found</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                {filters.search || filters.startDate
                                    ? 'Try adjusting your filters to find payment records.'
                                    : 'No payment records available yet. Start by creating a new payment.'}
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
                        >
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                    <div className="col-span-1 text-center">#</div>
                                    <div className="col-span-3">Payee Name</div>
                                    <div className="col-span-2">Payment No</div>
                                    <div className="col-span-2">Due Date</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                    <div className="col-span-1 text-center">Status</div>
                                    <div className="col-span-1 text-center">Action</div>
                                </div>
                            </div>

                            {/* Table Body - Mapped Components */}
                            <div className="divide-y divide-gray-100">
                                {payments.map((payment: any, index: number) => (
                                    <PaymentAccList
                                        key={payment._id}
                                        payment={payment}
                                        index={index}
                                        handleView={handleView}
                                        handleDelete={handleDelete}
                                        deletePending={deletePaymentMutation.isPending && deletePaymentMutation.variables === payment._id}
                                    />
                                ))}
                            </div>

                            {/* Loading Indicator (Infinite Scroll) */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-xl"></i>
                                        <span className="text-sm font-medium">Loading more payments...</span>
                                    </div>
                                </div>
                            )}

                            {/* End of List */}
                            {!hasNextPage && payments.length > 0 && (
                                <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
                                    <p className="text-gray-400 text-sm font-medium flex items-center">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        All records loaded
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

export default PaymentAccMain;