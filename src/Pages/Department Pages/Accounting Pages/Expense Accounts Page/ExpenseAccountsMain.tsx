// src/components/Department/Accounting/ExpenseAccounts/ExpenseAccountsMain.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
// import { useGetAllExpenses, useDeleteExpense } from '../../../../apiList/Department Api/Accounting Api/expenseAccountApi';
import { Button } from '../../../../components/ui/Button';
import { Breadcrumb, type BreadcrumbItem } from '../../Breadcrumb';
// import ExpenseAccList from './ExpenseAccList';
import { toast } from '../../../../utils/toast';
import { useDeleteExpense, useGetAllExpenses } from '../../../../apiList/Department Api/Accounting Api/expenseApi';
import ExpenseList from './ExpenseList';
import Slider from 'rc-slider';
import "rc-slider/assets/index.css";

import { useDebounce } from '../../../../Hooks/useDebounce';

const ExpenseAccountsMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if we're on a child route
    const isDetailView = location.pathname.includes('/expensesingle') ||
        location.pathname.includes('/create')
    const paths: BreadcrumbItem[] = [
        { label: "Account", path: `/organizations/${organizationId}/projects/accounting` },
        { label: "Expenses", path: `/organizations/${organizationId}/projects/expensemain` },
    ];

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        vendorId: '',
        dateOfPaymentToDate: "",
        dateOfPaymentFromDate: "",
        createdFromDate: "",
        createdToDate: "",
        minAmount: 0,
        maxAmount: 100000,
        paidThrough: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    // Debounced search
    // const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    const debouncedMinAmount = useDebounce(filters.minAmount, 800);
    const debouncedMaxAmount = useDebounce(filters.maxAmount, 800);
    const debouncedSearch = useDebounce(filters.search, 500);


    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setDebouncedSearch(filters.search);
    //     }, 500);

    //     return () => clearTimeout(timer);
    // }, [filters.search]);

    // Infinite query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllExpenses({
        organizationId: organizationId || '',
        search: debouncedSearch,
        vendorId: filters.vendorId || undefined,
        dateOfPaymentToDate: filters.dateOfPaymentToDate || undefined,
        dateOfPaymentFromDate: filters.dateOfPaymentFromDate || undefined,
        createdFromDate: filters.createdFromDate || undefined,
        createdToDate: filters.createdToDate || undefined,
        minAmount: debouncedMinAmount ? Number(debouncedMinAmount) : undefined,
        maxAmount: debouncedMaxAmount ? Number(debouncedMaxAmount) : undefined,
        // maxAmount: filters.maxAmount ? filters.maxAmount : undefined,
        paidThrough: filters.paidThrough || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 20
    });

    const deleteExpenseMutation = useDeleteExpense();

    // Intersection observer for infinite scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;

            // Check if scrolled to bottom (with 100px threshold)
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading more expenses...');
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleDelete = async (expenseId: string) => {
        try {
            await deleteExpenseMutation.mutateAsync({
                id: expenseId,
                _organizationId: organizationId || ''
            });
            toast({ title: "Success", description: "Expense deleted successfully" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to delete the expense",
                variant: "destructive"
            });
        }
    };

    const handleView = (expenseId: string) => {
        navigate(`expensesingle/${expenseId}`);
    };

    // const handleEdit = (expenseId: string) => {
    //     navigate(`edit/${expenseId}`);
    // };

    // Count active filters
    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 0 && val !== 100000 && val !== 'createdAt' && val !== 'desc'
    ).length;

    const clearFilters = () => {
        setFilters({
            search: '',
            vendorId: '',
            // startDate: '',
            // endDate: '',
            dateOfPaymentToDate: "",
            dateOfPaymentFromDate: "",
            createdFromDate: "",
            createdToDate: "",
            minAmount: 0,
            maxAmount: 100000,
            paidThrough: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    // Get all expenses from pages
    const expenses = data?.pages.flatMap(page => page.data) || [];

    // Calculate total stats from first page
    // const totalExpenses = data?.pages[0]?.pagination?.total || 0;
    // const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // If on detail view, show only the Outlet
    if (isDetailView) {
        return <Outlet />;
    }

    return (
        <div className="space-y-4 h-full">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-receipt mr-3 text-blue-600"></i>
                        Expense Accounts
                    </h1>
                    <Breadcrumb paths={paths} />
                </div>

                <div className="flex gap-3">
                    {/* <Button
                        onClick={() => navigate('statistics')}
                        variant="outline"
                    >
                        <i className="fas fa-chart-bar mr-2" />
                        Statistics
                    </Button> */}
                    <Button onClick={() => navigate('create')}>
                        <i className="fas fa-plus mr-2" />
                        Add Expense
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            {/* {!isLoading && expenses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
                                <p className="text-3xl font-bold mt-1">{totalExpenses}</p>
                            </div>
                            <i className="fas fa-file-invoice text-4xl text-blue-200 opacity-50"></i>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Amount</p>
                                <p className="text-3xl font-bold mt-1">${totalAmount.toLocaleString()}</p>
                            </div>
                            <i className="fas fa-dollar-sign text-4xl text-green-200 opacity-50"></i>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Average Expense</p>
                                <p className="text-3xl font-bold mt-1">
                                    ${expenses.length > 0 ? (totalAmount / expenses.length).toFixed(2) : '0'}
                                </p>
                            </div>
                            <i className="fas fa-chart-line text-4xl text-purple-200 opacity-50"></i>
                        </div>
                    </div>
                </div>
            )} */}

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
                        {(error as any)?.message || "Failed to load expenses"}
                    </p>
                    <Button
                        onClick={() => refetch()}
                        className="bg-red-600 text-white px-4 py-2"
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <main className="flex gap-2 !max-h-[88%]">
                    {/* Filters Sidebar */}
                    <div className="xl:w-80 flex-shrink-0 !max-h-[90%] overflow-y-auto ">
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
                                {/* Search by Invoice Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-search mr-2"></i>
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search by vendor name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Date Range */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        Date Range
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Start Date"
                                        />
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="End Date"
                                        />
                                    </div>
                                </div> */}

                                {/* Amount Range */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-dollar-sign mr-2"></i>
                                        Amount Range
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            placeholder="Min Amount"
                                            value={filters.minAmount}
                                            onChange={(e) => setFilters(f => ({ ...f, minAmount: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Amount"
                                            value={filters.maxAmount}
                                            onChange={(e) => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div> */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        From CreatedAt Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.createdFromDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, createdFromDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        To CreatedAt Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.createdToDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, createdToDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        From Date of Payment
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.dateOfPaymentFromDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, dateOfPaymentFromDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        To Date of Payment
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.dateOfPaymentToDate}
                                        onChange={(e) => {
                                            setFilters(f => ({ ...f, dateOfPaymentToDate: e.target.value }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount Range
                                    </label>

                                    {/* Slider */}
                                    <div className="px-2 mb-3">
                                        <Slider
                                            range
                                            min={0}
                                            max={100000}
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
                                                },
                                                {
                                                    borderColor: "#3b82f6",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                                                    width: 18,
                                                    height: 18,
                                                    marginTop: -6,
                                                },
                                            ]}
                                            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                                        />
                                    </div>

                                    {/* Display Values */}
                                    <div className="flex justify-between items-center gap-2 text-sm">
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Min</span>
                                            <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                                                ₹{Number(filters.minAmount).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                        <div className="text-gray-400 mt-5">—</div>
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 block mb-1">Max</span>
                                            <div className="bg-blue-50 px-3 py-2 rounded-lg font-semibold text-blue-700 text-center">
                                                ₹{Number(filters.maxAmount).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manual Input Fields */}
                                    <div className="flex gap-3 items-center mt-3">
                                        <input
                                            type="number"
                                            value={filters.minAmount}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, minAmount: +e.target.value }))
                                            }
                                            placeholder="Min Amount"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="500"
                                        />
                                        <input
                                            type="number"
                                            value={filters.maxAmount}
                                            onChange={(e) =>
                                                setFilters((f) => ({ ...f, maxAmount: +e.target.value }))
                                            }
                                            placeholder="Max Amount"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="500"
                                        />
                                    </div>
                                </div>

                                {/* Paid Through */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-credit-card mr-2"></i>
                                        Payment Method
                                    </label>
                                    <select
                                        value={filters.paidThrough}
                                        onChange={(e) => setFilters(f => ({ ...f, paidThrough: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Methods</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="Check">Check</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <i className="fas fa-sort mr-2"></i>
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="dateOfPayment">Payment Date</option>
                                        <option value="amount">Amount</option>
                                        <option value="vendorName">Vendor Name</option>
                                        {/* <option value="invoiceNumber">Invoice Number</option> */}
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort Order
                                    </label>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) => setFilters(f => ({ ...f, sortOrder: e.target.value as 'asc' | 'desc' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* No Expenses Fallback */}
                    {expenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-receipt text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Expenses Found</h3>
                            <p className="text-sm text-gray-500">
                                {activeFiltersCount > 0
                                    ? 'Try adjusting your filters to find expenses.'
                                    : 'Looks like there are no expenses yet.'}
                                <br />
                                Click on <strong>"Add Expense"</strong> to get started 🚀
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 max-h-[100%] overflow-y-auto"
                        >
                            {/* Table Header */}
                            <div className="bg-white rounded-t-xl border border-gray-200 sticky top-0 z-10">
                                <div className="grid grid-cols-16 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm">
                                    <div className="col-span-1 text-center">S.No</div>
                                    <div className="col-span-2 text-center">Invoice #</div>
                                    <div className="col-span-3 text-center">Vendor Name</div>
                                    <div className="col-span-2 text-center">Amount</div>
                                    <div className="col-span-2 text-center">Payment Date</div>
                                    <div className="col-span-2 text-center">Paid Through</div>
                                    <div className="col-span-2 text-center">Created At</div>
                                    <div className="col-span-2 text-center">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-white rounded-b-xl border-x border-b border-gray-200">
                                {expenses.map((expense, index) => (
                                    <ExpenseList
                                        key={expense._id}
                                        expense={expense}
                                        index={index}
                                        onView={() => handleView(expense._id)}
                                        // onEdit={() => handleEdit(expense._id)}
                                        onDelete={(e: any) => {
                                            e.stopPropagation()
                                            handleDelete(expense._id)
                                        }}
                                        isDeleting={deleteExpenseMutation.isPending && deleteExpenseMutation.variables.id === expense._id}
                                    />
                                ))}
                            </div>

                            {/* Loading indicator */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-2xl"></i>
                                        <span className="text-sm font-medium">Loading more expenses...</span>
                                    </div>
                                </div>
                            )}

                            {/* End reached */}
                            {!hasNextPage && expenses.length > 0 && (
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

export default ExpenseAccountsMain;