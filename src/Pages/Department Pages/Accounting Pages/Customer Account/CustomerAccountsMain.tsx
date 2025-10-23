// src/components/Department/Accounting/CustomerAccounts/CustomerAccountsMain.tsx

import  { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
import {  useGetAllCustomers, useDeleteCustomer} from '../../../../apiList/Department Api/Accounting Api/customerAccountApi';
import { Button } from '../../../../components/ui/Button';
import { CustomerAccCard } from './CustomerAccCard';
// import { Breadcrumb } from '../../Breadcrumb';

const CustomerAccountsMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if we're on a child route
    const isDetailView = location.pathname.includes('/customersingle') ||  location.pathname.includes('/create');

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        customerType: '' as '' | 'business' | 'individual',
        projectId: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.search]);

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
    } = useGetAllCustomers({
        organizationId: organizationId || '',
        search: debouncedSearch,
        customerType: filters.customerType || undefined,
        projectId: filters.projectId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 7
    });

    const deleteCustomerMutation = useDeleteCustomer();

    // Intersection observer for infinite scroll
     useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            
            // Check if scrolled to bottom (with 100px threshold)
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                console.log('📜 Loading more customers...');
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleDelete = async (customerId: string, customerName: string) => {
        if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
            try {
                await deleteCustomerMutation.mutateAsync(customerId);
                alert('Customer deleted successfully');
            } catch (error: any) {
                alert(error.message || 'Failed to delete customer');
            }
        }
    };

    const handleView = (customerId: string) => {
        navigate(`customersingle/${customerId}`);
    };

    // Count active filters
    const activeFiltersCount = Object.values(filters).filter(
        (val) => val !== '' && val !== 'createdAt' && val !== 'desc'
    ).length;

    const clearFilters = () => {
        setFilters({
            search: '',
            customerType: '',
            projectId: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    // Get all customers from pages
    const customers = data?.pages.flatMap(page => page.data) || [];

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
                        <i className="fas fa-users mr-3 text-blue-600"></i>
                        Customer Accounts
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your business and individual customers
                    </p>
                     {/* <Breadcrumb /> */}
                </div>

                <Button
                    onClick={() => navigate('create')}
                >
                    <i className="fas fa-plus mr-2" />
                    Add Customer
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
                        {(error as any)?.message || "Failed to load customers"}
                    </p>
                    <Button
                        onClick={() => refetch()}
                        className="bg-red-600 text-white px-4 py-2"
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <main className="flex gap-2 !max-h-[90%]">
                    {/* Filters Sidebar */}
                    <div className="xl:w-80 flex-shrink-0">
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
                                        placeholder="Name, email, phone..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Customer Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer Type
                                    </label>
                                    <select
                                        value={filters.customerType}
                                        onChange={(e) => setFilters(f => ({ ...f, customerType: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Types</option>
                                        <option value="business">Business</option>
                                        <option value="individual">Individual</option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="firstName">First Name</option>
                                        <option value="companyName">Company Name</option>
                                        <option value="email">Email</option>
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

                    {/* No Customers Fallback */}
                    {customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
                            <i className="fas fa-user-slash text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Customers Found</h3>
                            <p className="text-sm text-gray-500">
                                {filters.search || filters.customerType
                                    ? 'Try adjusting your filters to find customers.'
                                    : 'Looks like there are no customers yet.'}
                                <br />
                                Click on <strong>"Add Customer"</strong> to get started 🚀
                            </p>
                        </div>
                    ) : (
                      
                         <div 
                            ref={scrollContainerRef}
                            className="flex-1 !max-h-[100%] overflow-y-auto"
                        >
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
                                {customers.map((customer) => (
                                    <CustomerAccCard
                                        key={customer._id}
                                        customer={customer}
                                        onView={() => handleView(customer._id)}
                                        onDelete={() => handleDelete(
                                            customer._id,
                                            customer.customerType === 'business'
                                                ? customer.companyName || 'Customer'
                                                : `${customer.firstName} ${customer.lastName}`
                                        )}
                                        isDeleting={deleteCustomerMutation.isPending}
                                    />
                                ))}
                            </div>

                            {/* Loading indicator at the bottom */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-2xl"></i>
                                        <span className="text-sm font-medium">Loading more customers...</span>
                                    </div>
                                </div>
                            )}

                            {/* End of list indicator */}
                            {!hasNextPage && customers.length > 0 && (
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

export default CustomerAccountsMain;