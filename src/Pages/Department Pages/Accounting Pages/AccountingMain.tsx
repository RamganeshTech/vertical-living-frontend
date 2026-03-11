


// import React, { useState, useRef, useEffect, useMemo } from 'react';
// import { useNavigate, useParams, useLocation, Outlet } from 'react-router-dom';
// // import { type NavigationSection } from '../../../shared/NavigationDDWithHeading';
// import { Button } from '../../../components/ui/Button';
// import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
// import { useGetProjects } from '../../../apiList/projectApi';
// import type { AvailableProjetType } from '../Logistics Pages/LogisticsShipmentForm';
// import { useGetAccountingAll } from '../../../apiList/Department Api/Accounting Api/accountingApi';
// import AccountingAccList from './AccountingCard';
// import { useDebounce } from '../../../Hooks/useDebounce';
// import Slider from 'rc-slider';
// import "rc-slider/assets/index.css";
// import { useAuthCheck } from '../../../Hooks/useAuthCheck';
// import StageGuide from '../../../shared/StageGuide';

// const AccountingMain: React.FC = () => {
//     const { organizationId } = useParams<{ organizationId: string }>();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const scrollContainerRef = useRef<HTMLDivElement>(null);


//     // Sidebar Filters
//     const [filters, setFilters] = useState({
//         status: '',
//         projectId: '',
//         projectName: '',
//         search: "",
//         fromDept: '',      // Source Type (Bill Acc, Expense Acc)
//         startDate: '',     // Transaction Date From
//         endDate: '',       // Transaction Date To
//         // personName: '',    // Specific Payee Name Search
//         minAmount: 0,
//         maxAmount: 1000000
//     });

//     // --- Fetch Projects ---
//     const { data: projectData } = useGetProjects(organizationId!);
//     const projects = projectData?.map((project: AvailableProjetType) => ({
//         _id: project._id,
//         projectName: project.projectName
//     }));



// const BILLING_RELATED_MODULES = [
//         "billing",
//         "vendor",
//         "customer",
//         "invoice",
//         "expense",
//         "billtemplate",
//         "purchaseorder",
//         "vendorpayment",
//         "salesorder",
//         "retailinvoice",
//     ];


//     const { role, permission } = useAuthCheck();
//     // const canDelete = role === "owner" || permission?.stafftask?.delete;
//     const canList = role === "owner" || permission?.accounts?.list;
//     // const showBilling = role === "owner" || permission?.billing?.create || permission?.billing?.list || permission?.billing?.delete || permission?.billing?.edit;
//     const showPayments = role === "owner" || permission?.payments?.create || permission?.payments?.list || permission?.payments?.delete || permission?.payments?.edit
//      const showBilling = role === "owner" || BILLING_RELATED_MODULES.some(moduleKey => {
//         const modulePerms = permission?.[moduleKey];
        
//         // If no permission object for this module, skip
//         if (!modulePerms) return false;

//         // Check if ANY action (list, create, edit, delete) is true
//         return Object.values(modulePerms).some(val => val === true);
//     });


//     const AVAILABLE_SECTIONS = ["Retail Invoice", "Invoice", "Bill", "Expense"]


//     // --- Debounce Hooks for High-Frequency Inputs ---
//     // We debounce these to prevent API calls on every slider move or keystroke
//     const debouncedMinAmount = useDebounce(filters.minAmount, 800);
//     const debouncedMaxAmount = useDebounce(filters.maxAmount, 800);
//     // const debouncedPersonName = useDebounce(filters.personName, 800);
//     const debouncedSearch = useDebounce(filters.search, 800);
//     const debouncedStartDate = useDebounce(filters.startDate, 800);
//     const debouncedEndDate = useDebounce(filters.endDate, 800);

//     // --- Construct Final Filter Object for API ---
//     const apiFilters = useMemo(() => ({
//         status: filters.status,
//         projectId: filters.projectId,
//         fromDept: filters.fromDept,
//         startDate: debouncedStartDate, // <--- Used here
//         endDate: debouncedEndDate,     // <--- Used here
//         minAmount: debouncedMinAmount,
//         maxAmount: debouncedMaxAmount,
//         search: debouncedSearch,
//         // personName: debouncedPersonName
//     }), [filters.status, filters.projectId, filters.fromDept, filters.startDate, filters.endDate, debouncedMinAmount, debouncedMaxAmount, debouncedSearch, debouncedEndDate, debouncedStartDate]);


//     // --- Fetch Accounting Records (Infinite) ---
//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//         error,
//         refetch
//     } = useGetAccountingAll(organizationId!, apiFilters);

//     // --- Infinite Scroll Logic ---
//     useEffect(() => {
//         const container = scrollContainerRef.current;
//         if (!container) return;

//         const handleScroll = () => {
//             const { scrollTop, scrollHeight, clientHeight } = container;
//             if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
//                 console.log('📜 Loading more accounting records...');
//                 fetchNextPage();
//             }
//         };

//         container.addEventListener('scroll', handleScroll);
//         return () => container.removeEventListener('scroll', handleScroll);
//     }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


//     // --- Helpers ---
//     // Count active filters (excluding defaults)
//     const activeFiltersCount = [
//         filters.status,
//         filters.projectId,
//         filters.fromDept,
//         filters.startDate,
//         filters.endDate,
//         // filters.personName
//     ].filter(Boolean).length + (filters.minAmount > 0 || filters.maxAmount < 100000 ? 1 : 0);

//     const clearFilters = () => {
//         setFilters({
//             status: '',
//             projectId: '',
//             projectName: '',
//             search: "",
//             fromDept: '',
//             startDate: '',
//             endDate: '',
//             // personName: '',
//             minAmount: 0,
//             maxAmount: 100000
//         });
//         // setSearchInput("");
//         // setSearchTerm("");
//     };

//     // Flatten Pages for Rendering
//     const records = data?.pages.flatMap(page => page.data) || [];

//     // Sub-page handling
//     const isSubPage = location.pathname.includes("single");
//     if (isSubPage) return <Outlet />;

//     return (
//         <div className="p-2 space-y-4 h-full">

//             {/* Navigation Dropdown */}
//             {/* <NavigationDDWithHeading
//                 isOpen={isDropdownOpen}
//                 onClose={() => setIsDropdownOpen(false)}
//                 heading="Accounts"
//                 sections={navigationItemNew}
//             /> */}

//             {/* --- Header --- */}
//             <header className="flex justify-between items-center pb-2">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                         <i className="fas fa-money-bill-wave mr-3 text-blue-600"></i>
//                         Accounting Department
//                     </h1>
//                     <p className="text-gray-600 mt-1 text-sm">
//                         Manage your project’s financial transactions and accounting records
//                     </p>
//                 </div>

//                 <div className="flex gap-2 items-center">


//                     {showPayments && <Button onClick={() => navigate(`/organizations/${organizationId}/projects/paymentmain`)}>
//                         <i className="fas fa-money-check-alt mr-2 text-white"></i>
//                         Payments
//                     </Button>}

//                     {showBilling && <Button variant='secondary' onClick={() => navigate(`/organizations/${organizationId}/projects/billmain`)}>
//                         <i className="fas fa-receipt mr-2 text-blue-600"></i>
//                         Billing
//                     </Button>
//                     }




//                     <div className="w-full sm:w-auto flex justify-end sm:block">
//                         <StageGuide
//                             organizationId={organizationId!}
//                             stageName="accounts"
//                         />
//                     </div>


//                     {/* <button
//                         onClick={() => setIsDropdownOpen(true)}
//                         className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
//                         title="Quick Navigation"
//                     >
//                         <i className="fas fa-plus text-lg"></i>
//                     </button> */}
//                 </div>
//             </header>

//             {/* --- Content Area --- */}
//             {isLoading ? (
//                 <MaterialOverviewLoading />
//             ) : isError ? (
//                 <div className="max-w-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                     <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
//                     <p className="text-red-500 mb-4 text-lg">{(error as any)?.message || "Failed to load data"}</p>
//                     <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">Retry</Button>
//                 </div>
//             ) : (
//                 <main className="flex gap-4 h-[calc(100%-90px)]">




//                     {/* --- Filter Sidebar --- */}
//                     <div className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar">
//                         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
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
//                                         Clear All
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="space-y-6">

//                                 {/* 1. Status Filter */}
//                                 {/* <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                                     <select
//                                         value={filters.status || ''}
//                                         onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//                                     >
//                                         <option value="">All Status</option>
//                                         <option value="pending">Pending</option>
//                                         <option value="paid">Paid</option>
//                                         <option value="cancelled">Cancelled</option>
//                                     </select>
//                                 </div> */}




//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>

//                                     <input
//                                         type="text"
//                                         placeholder="Search Record No, Name"
//                                         value={filters.search}
//                                         autoFocus
//                                         onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"

//                                     // className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                     />
//                                 </div>

//                                 {/* 2. Department (Source) Filter */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Sections</label>
//                                     <select
//                                         value={filters.fromDept || ''}
//                                         onChange={(e) => setFilters((f) => ({ ...f, fromDept: e.target.value }))}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//                                     >
//                                         <option value="">All Section</option>
//                                         {AVAILABLE_SECTIONS.map(option => {
//                                             return <option value={option}>{option}</option>
//                                         })}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
//                                     <select
//                                         value={filters?.projectId || ''}
//                                         onChange={(e) => {
//                                             const selected = projects?.find((p: any) => p._id === e.target.value);
//                                             if (selected) {
//                                                 setFilters(prev => ({
//                                                     ...prev,
//                                                     projectId: selected._id,
//                                                     projectName: selected.projectName,
//                                                 }));
//                                             } else {
//                                                 setFilters(prev => ({ ...prev, projectId: "", projectName: "" }));
//                                             }
//                                         }}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//                                     >
//                                         <option value="">All Projects</option>
//                                         {projects?.map((project: any) => (
//                                             <option key={project._id} value={project._id}>{project.projectName}</option>
//                                         ))}
//                                     </select>
//                                 </div>



//                                 {/* 5. Date Range Filter */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
//                                     <div className="space-y-2">
//                                         <div>
//                                             <span className="text-xs text-gray-500 mb-1 block">From</span>
//                                             <input
//                                                 type="date"
//                                                 value={filters.startDate}
//                                                 onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                                             />
//                                         </div>
//                                         <div>
//                                             <span className="text-xs text-gray-500 mb-1 block">To</span>
//                                             <input
//                                                 type="date"
//                                                 value={filters.endDate}
//                                                 onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* 6. Amount Range Slider */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Amount Range
//                                     </label>

//                                     {/* Slider */}
//                                     <div className="px-2 mb-3 pt-2">
//                                         <Slider
//                                             range
//                                             min={0}
//                                             max={100000}
//                                             step={500}
//                                             value={[Number(filters.minAmount), Number(filters.maxAmount)]}
//                                             onChange={(value) => {
//                                                 const [min, max] = value as [number, number];
//                                                 setFilters((f) => ({
//                                                     ...f,
//                                                     minAmount: min,
//                                                     maxAmount: max,
//                                                 }));
//                                             }}
//                                             trackStyle={[{ backgroundColor: "#3b82f6", height: 6 }]}
//                                             handleStyle={[
//                                                 {
//                                                     borderColor: "#3b82f6",
//                                                     backgroundColor: "#fff",
//                                                     boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
//                                                     width: 18,
//                                                     height: 18,
//                                                     marginTop: -6,
//                                                     opacity: 1
//                                                 },
//                                                 {
//                                                     borderColor: "#3b82f6",
//                                                     backgroundColor: "#fff",
//                                                     boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
//                                                     width: 18,
//                                                     height: 18,
//                                                     marginTop: -6,
//                                                     opacity: 1
//                                                 },
//                                             ]}
//                                             railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
//                                         />
//                                     </div>

//                                     {/* Display Values */}
//                                     <div className="flex justify-between items-center gap-2 text-sm">
//                                         <div className="flex-1">
//                                             <span className="text-xs text-gray-500 block mb-1">Min</span>
//                                             <div className="bg-blue-50 px-2 py-1.5 rounded border border-blue-100 font-semibold text-blue-700 text-center text-xs">
//                                                 ₹{Number(filters.minAmount).toLocaleString("en-IN")}
//                                             </div>
//                                         </div>
//                                         <div className="text-gray-300">—</div>
//                                         <div className="flex-1">
//                                             <span className="text-xs text-gray-500 block mb-1">Max</span>
//                                             <div className="bg-blue-50 px-2 py-1.5 rounded border border-blue-100 font-semibold text-blue-700 text-center text-xs">
//                                                 ₹{Number(filters.maxAmount).toLocaleString("en-IN")}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Manual Input Fields */}
//                                     <div className="flex gap-2 items-center mt-3">
//                                         <input
//                                             type="number"
//                                             value={filters.minAmount}
//                                             onChange={(e) =>
//                                                 setFilters((f) => ({ ...f, minAmount: +e.target.value }))
//                                             }
//                                             placeholder="Min"
//                                             className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                             min="0"
//                                         />
//                                         <input
//                                             type="number"
//                                             value={filters.maxAmount}
//                                             onChange={(e) =>
//                                                 setFilters((f) => ({ ...f, maxAmount: +e.target.value }))
//                                             }
//                                             placeholder="Max"
//                                             className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                             min="0"
//                                         />
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>

//                     {/* --- List View --- */}
//                     {canList && <> {records.length === 0 ? (
//                         <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 text-center p-6">
//                             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
//                                 <i className="fas fa-file-invoice-dollar text-3xl text-blue-400" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-800 mb-1">No Records Found</h3>
//                             <p className="text-sm text-gray-500 max-w-md">
//                                 {activeFiltersCount > 0
//                                     ? "Try adjusting your filters or search query."
//                                     : "Transactions from Bills, Expenses, and Payments will appear here automatically."}
//                             </p>
//                         </div>
//                     ) : (
//                         <div
//                             ref={scrollContainerRef}
//                             className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
//                         >
//                             {/* Sticky Header */}
//                             <div className="sticky top-0 z-10 bg-white border-b border-blue-200 shadow-sm">
//                                 <div className="grid grid-cols-14 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm uppercase tracking-wider">
//                                     <div className="col-span-1 text-center">#</div>
//                                     <div className="col-span-2">Acc.Rec No</div>
//                                     <div className="col-span-2">Dept.Rec No</div>
//                                     <div className="col-span-3">Vendor/ Customer</div>
//                                     <div className="col-span-2">Date</div>
//                                     <div className="col-span-2 ">Amount</div>
//                                     <div className="col-span-1">Status</div>
//                                     <div className="col-span-1 text-center">Action</div>
//                                 </div>
//                             </div>

//                             {/* List Items */}
//                             <div className="divide-y divide-gray-100">
//                                 {records.map((record: any, index: number) => (
//                                     <AccountingAccList
//                                         key={record._id}
//                                         data={record}
//                                         index={index}
//                                         onView={() => navigate(`single/${record._id}`)}
//                                     />
//                                 ))}
//                             </div>

//                             {/* Loading Indicator */}
//                             {isFetchingNextPage && (
//                                 <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
//                                     <div className="flex items-center gap-2 text-blue-600">
//                                         <i className="fas fa-spinner fa-spin text-xl"></i>
//                                         <span className="text-sm font-medium">Loading more records...</span>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* End of List */}
//                             {!hasNextPage && records.length > 0 && (
//                                 <div className="flex justify-center py-6 bg-gray-50 border-t border-gray-100">
//                                     <p className="text-gray-400 text-sm font-medium flex items-center">
//                                         <i className="fas fa-check-circle mr-2"></i>
//                                         All records loaded
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}</>}
//                 </main>
//             )}
//         </div>
//     );
// };

// export default AccountingMain;



import { useNavigate, useParams } from 'react-router-dom';

const AccountingMain = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();

    const modules = [
        {
            title: "Billing Section",
            desc: "Manage Bills, vendor invoices, Bills, and Expenses.",
            icon: "fa-file-invoice-dollar",
            path: `/organizations/${organizationId}/projects/billmain`,
            // Background tint for the card
            cardTint: "hover:bg-blue-50/30", 
            iconBg: "bg-blue-50 text-blue-600",
            hoverBg: "group-hover:bg-blue-600",
            accentColor: "text-blue-500"
        },
       
        {
            title: "Payment Section",
            desc: "Track online Payment transactions, payment gateway statuses.",
            icon: "fa-credit-card",
            path: `/organizations/${organizationId}/projects/paymentmain`,
            cardTint: "hover:bg-purple-50/30",
            iconBg: "bg-purple-50 text-purple-600",
            hoverBg: "group-hover:bg-purple-600",
            accentColor: "text-purple-500"
        },
         {
            title: "Records Section",
            desc: "View comprehensive ledgers, balance sheets.",
            icon: "fa-book",
            path: `/organizations/${organizationId}/projects/accountingrecords`,
            cardTint: "hover:bg-emerald-50/30",
            iconBg: "bg-emerald-50 text-emerald-600",
            hoverBg: "group-hover:bg-emerald-600",
            accentColor: "text-emerald-500"
        },
    ];

    return (
      <div className="min-h-full bg-white p-4 font-sans overflow-y-auto">
            {/* --- Minimalist Header --- */}
            <header className="flex justify-between items-center pb-8 border-b border-gray-100 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-money-bill-wave mr-3 text-blue-600"></i>
                        Accounting Department 
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm font-medium">
                        Manage your Bills, Payments and Accounting records here
                    </p>
                </div>
            </header>

            {/* --- Ultra-Professional Module Grid --- */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                {modules.map((item, idx) => (
                    <div 
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className={`group relative cursor-pointer bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-md transition-all duration-500 overflow-hidden ${item.cardTint} hover:shadow-2xl hover:-translate-y-3 flex flex-col justify-between h-[420px]`}
                    >
                        {/* 1. Decorative background icon (Watermark) */}
                        <i className={`fas ${item.icon} absolute -right-6 -bottom-6 text-9xl opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700`}></i>

                        {/* 2. Top Right Accent Dot */}
                        <div className="absolute top-0 right-0 p-8">
                           <div className={`w-2 h-2 rounded-full bg-slate-200 group-hover:scale-150 transition-all ${item.hoverBg.replace('group-hover:', '')}`}></div>
                        </div>

                        <div>
                            {/* 3. Icon Wrapper */}
                            <div className={`w-20 h-20 ${item.iconBg} rounded-3xl flex items-center justify-center text-3xl mb-10 transition-all duration-500 ${item.hoverBg} group-hover:text-white group-hover:rotate-[10deg] shadow-sm relative z-10`}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight relative z-10">
                                {item.title}
                            </h2>
                            <p className="text-slate-500 text-base leading-relaxed font-medium relative z-10">
                                {item.desc}
                            </p>
                        </div>

                        {/* 4. Professional Footer Link */}
                        <div className="flex items-center justify-between pt-8 border-t border-slate-100 relative z-10">
                            <span className="text-sm font-black uppercase tracking-tighter text-slate-400 group-hover:text-slate-900 transition-colors">
                                Explore Module
                            </span>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-inner">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default AccountingMain;