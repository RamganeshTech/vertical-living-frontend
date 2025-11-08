import React, { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
// import { useGetAccountingAll, useDeleteAccounting } from "../../../apiList/Department Api/Accounting/accounting.queries";
import AccountingCard from "./AccountingCard";
import { useGetAccountingAll } from "../../../apiList/Department Api/Accounting Api/accountingApi";
import { useGetProjects } from "../../../apiList/projectApi";
import type { AvailableProjetType } from "../Logistics Pages/LogisticsShipmentForm";
import { Button } from "../../../components/ui/Button";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import { type NavigationSection } from "../../../shared/NavigationDropDown";
import NavigationDDWithHeading, { type NavigationSection } from "../../../shared/NavigationDDWithHeading";


// interface AvailableProjectType {
//     _id: string;
//     projectName: string;
// }


export interface IAccounting {
    _id?: string;
    transactionNumber: string | null;
    organizationId: string;
    projectId: string;
    transactionType: "quote" | "invoice" | "payment" | "expense" | "refund";
    fromDept: "logistics" | "hr" | "procurement" | "factory" | null;
    totalAmount: {
        amount: number;
        taxAmount: number;
    };
    upiId: string | null
    status: "paid" | "cancelled" | "pending";
    dueDate: string | null;   // use string since dates come as ISO from API
    notes: string;
    paidAt: string | null;
    // createdAt?: string;
    // updatedAt?: string;
}


const AccountingMain: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();

    // Define navigation items
    // const navigationItems: NavigationSection[] = [{
    //     title: "Accounts section",
    //     items: [{
    //         label: 'Customer',
    //         path: `/organizations/${organizationId}/projects/customermain`,
    //         icon: 'fas fa-users text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/customermain`)
    //     },
    //     {
    //         label: 'Invoice',
    //         path: `/organizations/${organizationId}/projects/invoicemain`,
    //         icon: 'fas fa-file-invoice text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/invoicemain`)
    //     },
    //     {
    //         label: 'Retail Invoice',
    //         path: `/organizations/${organizationId}/projects/retailinvoicemain`,
    //         icon: 'fas fa-receipt text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/retailinvoicemain`)
    //     },
    //     {
    //         label: 'Sales Order',
    //         path: `/organizations/${organizationId}/projects/salesordermain`,
    //         icon: 'fas fa-shopping-cart text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/salesordermain`)
    //     },
    //     {
    //         label: 'Vendor',
    //         path: `/organizations/${organizationId}/projects/vendormain`,
    //         icon: 'fas fa-user text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/vendormain`)
    //     },
    //     {
    //         label: 'Expense',
    //         path: `/organizations/${organizationId}/projects/expensemain`,
    //         icon: 'fas fa-money-bill text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/expensemain`)
    //     },

    //     {
    //         label: 'Bills',
    //         path: `/organizations/${organizationId}/projects/billmain`,
    //         icon: 'fas fa-receipt text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/billmain`)
    //     },
    //     {
    //         label: 'Purchase Orders',
    //         path: `/organizations/${organizationId}/projects/purchasemain`,
    //         icon: 'fas fa-wallet text-blue-600',
    //         onClick: () => navigate(`/organizations/${organizationId}/projects/purchasemain`)
    //     },

    //         //     {
    //         //         label: 'Vendor Payments',
    //         //         path: `/organizations/${organizationId}/projects/vendorpaymentmain`,
    //         //         icon: 'fas fa-credit-card text-blue-600',
    //         //         onClick: () => navigate(`/organizations/${organizationId}/projects/vendorpaymentmain`)
    //         //     },
    //     ]
    // }]


    // ddummy version

    const navigationItemNew: NavigationSection[] = [

        {
            title: "Sales Transactions",
            items: [
                {
                    label: 'Invoice',
                    path: `/organizations/${organizationId}/projects/invoicemain`,
                    icon: 'fas fa-file-invoice text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/invoicemain`)
                },
                {
                    label: 'Retail Invoice',
                    path: `/organizations/${organizationId}/projects/retailinvoicemain`,
                    icon: 'fas fa-receipt text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/retailinvoicemain`)
                },
                {
                    label: 'Sales Order',
                    path: `/organizations/${organizationId}/projects/salesordermain`,
                    icon: 'fas fa-shopping-cart text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/salesordermain`)
                },
                {
                    label: 'Purchase Orders',
                    path: `/organizations/${organizationId}/projects/purchasemain`,
                    icon: 'fas fa-wallet text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/purchasemain`)
                },

            ]
        },
        {
            title: "Expense Transactions",
            items: [
                {
                    label: 'Expense',
                    path: `/organizations/${organizationId}/projects/expensemain`,
                    icon: 'fas fa-money-bill text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/expensemain`)
                },

                {
                    label: 'Bills',
                    path: `/organizations/${organizationId}/projects/billmain`,
                    icon: 'fas fa-receipt text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/billmain`)
                },
                {
                    label: 'Vendor Payments',
                    path: `/organizations/${organizationId}/projects/vendorpaymentmain`,
                    icon: 'fas fa-credit-card text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/vendorpaymentmain`)
                },
            ]
        },

        {
            title: "Office Records",
            items: [
                {
                    label: 'Customer',
                    path: `/organizations/${organizationId}/projects/customermain`,
                    icon: 'fas fa-users text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/customermain`)
                },
                {
                    label: 'Vendor',
                    path: `/organizations/${organizationId}/projects/vendormain`,
                    icon: 'fas fa-user text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/vendormain`)
                },
            ]
        }

    ];



    // Add this state for controlling the dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [searchInput, setSearchInput] = useState("");     // user typing
    const [searchTerm, setSearchTerm] = useState<string>(""); // value used for sending to the api

    const [filters, setFilters] = useState<{
        status?: string;
        projectId?: string;
        projectName?: string;
        fromDept?: string;
    }>({});

    const { data } = useGetProjects(organizationId!)
    // console.log("data", data)
    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))

    const { data: records, isLoading, error, isError, refetch } = useGetAccountingAll(organizationId!, filters, searchTerm);

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    const clearFilters = () => {
        setFilters({});
    };

    const isSubPage = location.pathname.includes("single");

    if (isSubPage) return <Outlet />; // subpage like /vehicles



    return (
        <div className="p-2 space-y-6 h-full overflow-y-auto">
            {/* Navigation Dropdown */}
            {/* <NavigationDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                sections={navigationItems}
                    noOfRows={3}
            />
            
            */}

            <NavigationDDWithHeading
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                heading="Accounts"
                // subHeading="Select a module to continue"
                sections={navigationItemNew} />



            <header className="flex justify-between items-center">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-money-bill-wave mr-3 text-blue-600"></i>
                        Accounting Department
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your project’s financial transactions and accounting records                    </p>
                </div>


                <div className="flex gap-2  w-[300px] md:w-[400px]">


                    <button
                        onClick={() => setIsDropdownOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Quick Navigation"
                    >
                        <i className="fas fa-plus text-lg"></i>
                    </button>

                    <input
                        type="text"
                        placeholder="Search By transNo, notes, department"
                        value={searchInput}
                        autoFocus
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearchTerm(searchInput);  // ✅ Only triggers on Enter
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    <Button
                        onClick={() => setSearchTerm(searchInput)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        <i className="fas fa-search"> </i>
                    </Button>
                </div>
            </header>

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
                <main className="flex gap-2 h-[90%]">

                    {/* Filter Sidebar */}
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
                                        className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                                    >
                                        Clear All ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <select
                                        value={filters.fromDept || ''}
                                        onChange={(e) => setFilters((f) => ({ ...f, fromDept: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Departments</option>
                                        <option value="logistics">Logistics</option>
                                        <option value="hr">HR</option>
                                        <option value="procurement">Procurement</option>
                                        <option value="factory">Factory</option>
                                    </select>
                                </div>


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

                    {/* Main Content */}
                    {records?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                            <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">No Bills Found</h3>
                            <p className="text-sm text-gray-500">
                                No Bills Generated Yet.<br />
                                {/* Click on <strong>"Add Shipment"</strong> to get started 🚀 */}
                            </p>
                        </div>)
                        : (
                            <div className="flex-1 max-h-[100%] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {records?.map((record: IAccounting) => (
                                        <AccountingCard
                                            id={record._id!}
                                            key={record._id!}
                                            transactionNumber={record.transactionNumber}
                                            dept={record?.fromDept || ""}
                                            totalAmount={record.totalAmount}
                                            status={record.status}
                                            onView={() => navigate(`single/${record._id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                </main>
            )
            }
        </div >
    );
};

export default AccountingMain;