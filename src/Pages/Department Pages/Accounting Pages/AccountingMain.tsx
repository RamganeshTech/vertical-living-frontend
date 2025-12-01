// import React, { useState } from "react";
// import { Outlet, useNavigate, useParams } from "react-router-dom";
// // import { useGetAccountingAll, useDeleteAccounting } from "../../../apiList/Department Api/Accounting/accounting.queries";
// import AccountingCard from "./AccountingCard";
// import { useGetAccountingAll } from "../../../apiList/Department Api/Accounting Api/accountingApi";
// import { useGetProjects } from "../../../apiList/projectApi";
// import type { AvailableProjetType } from "../Logistics Pages/LogisticsShipmentForm";
// import { Button } from "../../../components/ui/Button";
// import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// // import { type NavigationSection } from "../../../shared/NavigationDropDown";
// import NavigationDDWithHeading, { type NavigationSection } from "../../../shared/NavigationDDWithHeading";




// export interface IInstallmentAcc {
//     _id?: string;
//     amount: number;
//     dueDate: string;
//     status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';
//     orderId?: string;        // Razorpay fund_account_id
//     paymentId?: string;      // Razorpay payout_id
//     transactionId?: string;  // UTR number
//     paidAt?: string;
//     failureReason?: string;
//     fees?: number;
//     tax?: number;
// }

// export interface IAccounting {
//     _id?: string;
//     transactionNumber: string | null;
//     organizationId: string;
//     projectId: string;
//     transactionType: "quote" | "invoice" | "payment" | "expense" | "refund";
//     fromDept: "logistics" | "hr" | "procurement" | "factory" | null;
//     totalAmount: {
//         amount: number;
//         taxAmount: number;
//     };
//     upiId: string | null
//     status: "paid" | "cancelled" | "pending";
//     dueDate: string | null;   // use string since dates come as ISO from API
//     notes: string;
//     paidAt: string | null;
//     installMents?: IInstallmentAcc[]
//     // createdAt?: string;
//     // updatedAt?: string;
// }


// const AccountingMain: React.FC = () => {
//     const { organizationId } = useParams<{ organizationId: string }>();
//     const navigate = useNavigate();




//     const navigationItemNew: NavigationSection[] = [

//         {
//             title: "Sales Transactions",
//             items: [
//                 {
//                     label: 'Invoice',
//                     path: `/organizations/${organizationId}/projects/invoicemain`,
//                     icon: 'fas fa-file-invoice text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/invoicemain`)
//                 },
//                 {
//                     label: 'Retail Invoice',
//                     path: `/organizations/${organizationId}/projects/retailinvoicemain`,
//                     icon: 'fas fa-receipt text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/retailinvoicemain`)
//                 },
//                 {
//                     label: 'Sales Order',
//                     path: `/organizations/${organizationId}/projects/salesordermain`,
//                     icon: 'fas fa-shopping-cart text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/salesordermain`)
//                 },
//                 {
//                     label: 'Purchase Orders',
//                     path: `/organizations/${organizationId}/projects/purchasemain`,
//                     icon: 'fas fa-wallet text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/purchasemain`)
//                 },

//             ]
//         },
//         {
//             title: "Expense Transactions",
//             items: [
//                 {
//                     label: 'Expense',
//                     path: `/organizations/${organizationId}/projects/expensemain`,
//                     icon: 'fas fa-money-bill text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/expensemain`)
//                 },

//                 {
//                     label: 'Bills',
//                     path: `/organizations/${organizationId}/projects/billmain`,
//                     icon: 'fas fa-receipt text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/billmain`)
//                 },

//                 {
//                     label: 'Design Bills',
//                     path: `/organizations/${organizationId}/projects/billnew`,
//                     icon: 'fas fa-file-pdf text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/billnew`)
//                 },


//                 // {
//                 //     label: 'Bill New',
//                 //     path: `/organizations/${organizationId}/projects/billnew`,
//                 //     icon: 'fas fa-receipt text-blue-600',
//                 //     onClick: () => navigate(`/organizations/${organizationId}/projects/billnew`)
//                 // },

//                  {
//                     label: 'Payments Accounts',
//                     path: `/organizations/${organizationId}/projects/paymentmain`,
//                     icon: 'fas fa-receipt text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/paymentmain`)
//                 },


//                 {
//                     label: 'Vendor Payments',
//                     path: `/organizations/${organizationId}/projects/vendorpaymentmain`,
//                     icon: 'fas fa-credit-card text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/vendorpaymentmain`)
//                 },
//             ]
//         },

//         {
//             title: "Office Records",
//             items: [
//                 {
//                     label: 'Customer',
//                     path: `/organizations/${organizationId}/projects/customermain`,
//                     icon: 'fas fa-users text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/customermain`)
//                 },
//                 {
//                     label: 'Vendor',
//                     path: `/organizations/${organizationId}/projects/vendormain`,
//                     icon: 'fas fa-user text-blue-600',
//                     onClick: () => navigate(`/organizations/${organizationId}/projects/vendormain`)
//                 },
//             ]
//         }

//     ];



//     // Add this state for controlling the dropdown
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     const [searchInput, setSearchInput] = useState("");     // user typing
//     const [searchTerm, setSearchTerm] = useState<string>(""); // value used for sending to the api

//     const [filters, setFilters] = useState<{
//         status?: string;
//         projectId?: string;
//         projectName?: string;
//         fromDept?: string;
//     }>({});

//     const { data } = useGetProjects(organizationId!)
//     // console.log("data", data)
//     const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))

//     const { data: records, isLoading, error, isError, refetch } = useGetAccountingAll(organizationId!, filters, searchTerm);

//     const activeFiltersCount = Object.values(filters).filter(Boolean).length;

//     const clearFilters = () => {
//         setFilters({});
//     };

//     const isSubPage = location.pathname.includes("single");

//     if (isSubPage) return <Outlet />; // subpage like /vehicles



//     return (
//         <div className="p-2 space-y-6 h-full overflow-y-auto">
//             {/* Navigation Dropdown */}
//             {/* <NavigationDropdown
//                 isOpen={isDropdownOpen}
//                 onClose={() => setIsDropdownOpen(false)}
//                 sections={navigationItems}
//                     noOfRows={3}
//             />

//             */}

//             <NavigationDDWithHeading
//                 isOpen={isDropdownOpen}
//                 onClose={() => setIsDropdownOpen(false)}
//                 heading="Accounts"
//                 // subHeading="Select a module to continue"
//                 sections={navigationItemNew} />



//             <header className="flex justify-between items-center">

//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                         <i className="fas fa-money-bill-wave mr-3 text-blue-600"></i>
//                         Accounting Department
//                     </h1>
//                     <p className="text-gray-600 mt-1">
//                         Manage your project’s financial transactions and accounting records                    </p>
//                 </div>


//                 <div className="flex gap-2  w-[300px] md:w-[400px]">


//                     <button
//                         onClick={() => setIsDropdownOpen(true)}
//                         className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
//                         title="Quick Navigation"
//                     >
//                         <i className="fas fa-plus text-lg"></i>
//                     </button>

//                     <input
//                         type="text"
//                         placeholder="Search By transNo, notes, department"
//                         value={searchInput}
//                         autoFocus
//                         onChange={(e) => setSearchInput(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                                 setSearchTerm(searchInput);  // ✅ Only triggers on Enter
//                             }
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                     />

//                     <Button
//                         onClick={() => setSearchTerm(searchInput)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded"
//                     >
//                         <i className="fas fa-search"> </i>
//                     </Button>
//                 </div>
//             </header>

//             {isLoading ? (
//                 <MaterialOverviewLoading />
//             ) : isError ? (
//                 <div className="max-w-xl sm:min-w-[80%]  mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                     <div className="text-red-600 font-semibold mb-2 text-xl sm:text-3xl">
//                         ⚠️ Error Occurred
//                     </div>
//                     <p className="text-red-500  mb-4 text-lg sm:text-xl">
//                         {(error as any)?.response?.data?.message || "Failed to load data"}
//                     </p>
//                     <Button
//                         onClick={() => refetch()}
//                         className="bg-red-600 text-white px-4 py-2"
//                     >
//                         Retry
//                     </Button>
//                 </div>
//             ) : (
//                 <main className="flex gap-2 h-[90%]">

//                     {/* Filter Sidebar */}
//                     <div className="xl:w-80 flex-shrink-0">
//                         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                             <div className="flex items-center justify-between mb-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                                     <i className="fas fa-filter mr-2 text-blue-600"></i>
//                                     Filters
//                                 </h3>
//                                 {activeFiltersCount > 0 && (
//                                     <button
//                                         onClick={clearFilters}
//                                         className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
//                                     >
//                                         Clear All ({activeFiltersCount})
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                                     <select
//                                         value={filters.status || ''}
//                                         onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">All Status</option>
//                                         <option value="pending">Pending</option>
//                                         <option value="paid">Paid</option>
//                                         <option value="cancelled">Cancelled</option>
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                                     <select
//                                         value={filters.fromDept || ''}
//                                         onChange={(e) => setFilters((f) => ({ ...f, fromDept: e.target.value }))}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">All Departments</option>
//                                         <option value="logistics">Logistics</option>
//                                         <option value="hr">HR</option>
//                                         <option value="procurement">Procurement</option>
//                                         <option value="factory">Factory</option>
//                                     </select>
//                                 </div>


//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Select Project
//                                     </label>

//                                     <select
//                                         value={filters?.projectId || ''}
//                                         onChange={(e) => {
//                                             const selectedProject = projects?.find(
//                                                 (p: AvailableProjetType) => p._id === e.target.value
//                                             );
//                                             if (selectedProject) {
//                                                 setFilters(prev => ({
//                                                     ...prev,
//                                                     projectId: selectedProject._id,
//                                                     projectName: selectedProject.projectName, // keep name too
//                                                 }));
//                                             }
//                                         }}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     >
//                                         {/* <option value="">All Projects</option> */}
//                                         {projects?.map((project: AvailableProjetType) => (
//                                             <option key={project._id} value={project._id}>{project.projectName}</option>
//                                         ))}
//                                     </select>
//                                 </div>


//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     {records?.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
//                             <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
//                             <h3 className="text-lg font-semibold text-blue-800 mb-1">No Bills Found</h3>
//                             <p className="text-sm text-gray-500">
//                                 No Bills Generated Yet.<br />
//                                 {/* Click on <strong>"Add Shipment"</strong> to get started 🚀 */}
//                             </p>
//                         </div>)
//                         : (
//                             <div className="flex-1 max-h-[100%] overflow-y-auto">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {records?.map((record: IAccounting) => (
//                                         <AccountingCard
//                                             id={record._id!}
//                                             key={record._id!}
//                                             transactionNumber={record.transactionNumber}
//                                             dept={record?.fromDept || ""}
//                                             totalAmount={record.totalAmount}
//                                             status={record.status}
//                                             onView={() => navigate(`single/${record._id}`)}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                 </main>
//             )
//             }
//         </div >
//     );
// };

// export default AccountingMain;






import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Outlet } from 'react-router-dom';
import NavigationDDWithHeading, { type NavigationSection } from '../../../shared/NavigationDDWithHeading';
import { Button } from '../../../components/ui/Button';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { useGetProjects } from '../../../apiList/projectApi';
import type { AvailableProjetType } from '../Logistics Pages/LogisticsShipmentForm';
import { useGetAccountingAll } from '../../../apiList/Department Api/Accounting Api/accountingApi';
import AccountingAccList from './AccountingCard';

// // --- Components ---
// import { Button } from '../../../../components/ui/Button'; // Adjust path
// import NavigationDDWithHeading from '../../../../components/ui/NavigationDDWithHeading'; // Adjust path
// import AccountingAccList from './AccountingAccList'; // We will create this component next
// import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading'; // Adjust path
// import { useGetProjects } from '../../../../apiList/Project Api/projectApi'; // Adjust path

// // --- Hooks ---
// import { useGetAccountingAll } from './hooks/accounting.hooks'; // Use the new Infinite Hook

// // --- Types ---
// import { NavigationSection } from '../../../../components/ui/NavigationDDWithHeading';
// import { AvailableProjetType } from '../../../../types/projectTypes'; // Adjust if needed

const AccountingMain: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- Navigation Items (Preserved) ---

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
                    label: 'Design Bills',
                    path: `/organizations/${organizationId}/projects/billnew`,
                    icon: 'fas fa-file-pdf text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/billnew`)
                },


                // {
                //     label: 'Bill New',
                //     path: `/organizations/${organizationId}/projects/billnew`,
                //     icon: 'fas fa-receipt text-blue-600',
                //     onClick: () => navigate(`/organizations/${organizationId}/projects/billnew`)
                // },

                {
                    label: 'Payments Accounts',
                    path: `/organizations/${organizationId}/projects/paymentmain`,
                    icon: 'fas fa-receipt text-blue-600',
                    onClick: () => navigate(`/organizations/${organizationId}/projects/paymentmain`)
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

    // --- Local State ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [filters, setFilters] = useState<{
        status?: string;
        projectId?: string;
        projectName?: string;
        fromDept?: string; // Maps to deptRecordFrom (Bill Acc, etc.)
    }>({});

    // --- Fetch Projects ---
    const { data: projectData } = useGetProjects(organizationId!);
    const projects = projectData?.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    }));

    // --- Fetch Accounting Records (Infinite) ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAccountingAll(organizationId!, filters, searchTerm);

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


    // --- Helpers ---
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    const clearFilters = () => {
        setFilters({});
        setSearchInput("");
        setSearchTerm("");
    };

    // Flatten Pages for Rendering
    const records = data?.pages.flatMap(page => page.data) || [];

    // Sub-page handling
    const isSubPage = location.pathname.includes("single");
    if (isSubPage) return <Outlet />;

    return (
        <div className="p-2 space-y-4 h-full">

            {/* Navigation Dropdown */}
            <NavigationDDWithHeading
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                heading="Accounts"
                sections={navigationItemNew}
            />

            {/* --- Header --- */}
            <header className="flex justify-between items-center pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-money-bill-wave mr-3 text-blue-600"></i>
                        Accounting Department
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Manage your project’s financial transactions and accounting records
                    </p>
                </div>

                <div className="flex gap-2 w-[300px] md:w-[400px]">
                    <button
                        onClick={() => setIsDropdownOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Quick Navigation"
                    >
                        <i className="fas fa-plus text-lg"></i>
                    </button>

                    <input
                        type="text"
                        placeholder="Search Payee, Record No..."
                        value={searchInput}
                        autoFocus
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") setSearchTerm(searchInput);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <Button
                        onClick={() => setSearchTerm(searchInput)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        <i className="fas fa-search"></i>
                    </Button>
                </div>
            </header>

            {/* --- Content Area --- */}
            {isLoading ? (
                <MaterialOverviewLoading />
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-red-500 mb-4 text-lg">{(error as any)?.message || "Failed to load data"}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">Retry</Button>
                </div>
            ) : (
                <main className="flex gap-4 h-[calc(100%-90px)]">

                    {/* --- Filter Sidebar --- */}
                    <div className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 h-full">
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
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-5">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {/* Department (Source) Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
                                    <select
                                        value={filters.fromDept || ''}
                                        onChange={(e) => setFilters((f) => ({ ...f, fromDept: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Sources</option>
                                        <option value="Bill Acc">Bill Accounts</option>
                                        <option value="Expense Acc">Expense Accounts</option>
                                        <option value="SubContract Acc">SubContract Accounts</option>
                                    </select>
                                </div>

                                {/* Project Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                    <select
                                        value={filters?.projectId || ''}
                                        onChange={(e) => {
                                            const selected = projects?.find((p: any) => p._id === e.target.value);
                                            if (selected) {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    projectId: selected._id,
                                                    projectName: selected.projectName,
                                                }));
                                            } else {
                                                setFilters(prev => ({ ...prev, projectId: undefined, projectName: undefined }));
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Projects</option>
                                        {projects?.map((project: any) => (
                                            <option key={project._id} value={project._id}>{project.projectName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- List View --- */}
                    {records.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 text-center p-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-file-invoice-dollar text-3xl text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Records Found</h3>
                            <p className="text-sm text-gray-500 max-w-md">
                                {searchTerm || activeFiltersCount > 0
                                    ? "Try adjusting your filters or search query."
                                    : "Transactions from Bills, Expenses, and Payments will appear here automatically."}
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
                        >
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-10 bg-white border-b border-blue-200 shadow-sm">
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                    <div className="col-span-1 text-center">#</div>
                                    <div className="col-span-2">Rec No</div>
                                    <div className="col-span-3">Payee / Source</div>
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                    <div className="col-span-1 text-center">Status</div>
                                    <div className="col-span-1 text-center">Action</div>
                                </div>
                            </div>

                            {/* List Items */}
                            <div className="divide-y divide-gray-100">
                                {records.map((record: any, index: number) => (
                                    <AccountingAccList
                                        key={record._id}
                                        data={record}
                                        index={index}
                                        onView={() => navigate(`single/${record._id}`)}
                                    />
                                ))}
                            </div>

                            {/* Loading Indicator */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <i className="fas fa-spinner fa-spin text-xl"></i>
                                        <span className="text-sm font-medium">Loading more records...</span>
                                    </div>
                                </div>
                            )}

                            {/* End of List */}
                            {!hasNextPage && records.length > 0 && (
                                <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
                                    <p className="text-gray-400 text-sm font-medium flex items-center">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        All records loaded
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

export default AccountingMain;