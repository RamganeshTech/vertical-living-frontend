// import { useState } from 'react';
// import { Outlet, useNavigate, useParams } from 'react-router-dom';
// import { useGetDefaultTemplate } from '../../../../apiList/Department Api/Accounting Api/billNew_accounting_api/billNewAccountingApi';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/Card';
// import { Badge } from '../../../../components/ui/Badge';
// import { dateFormate } from '../../../../utils/dateFormator';

// export const TemplateBillMain = () => {
//     const navigate = useNavigate();
//     const { organizationId } = useParams<{ organizationId: string }>();

//     // Filters
//     const [searchTerm, setSearchTerm] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');

//     // Fetch Data
//     const { data: defaultTemplates, isLoading, isError } = useGetDefaultTemplate({
//         organizationId: organizationId!
//     });

//     // Mocking array logic (replace with useGetAllTemplates if available)



//     console.log("defaultTemplates", defaultTemplates)
//     // Filter Logic
//     const filteredTemplates = defaultTemplates?.filter((tpl: any) => {
//         const matchesName = tpl.templateName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

//         let matchesDate = true;
//         if (startDate && endDate && tpl.createdAt) {
//             const tplDate = new Date(tpl.createdAt);
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             // simple day comparison logic
//             matchesDate = tplDate >= start && tplDate <= end;
//         }

//         return matchesName && matchesDate;
//     });

//     const handleCardClick = (id: string) => {
//         navigate(`single/${id}`);
//     };



//     const isDetailView = location.pathname.includes('/single') ||
//         location.pathname.includes('/create')

//     if (isDetailView) {
//         return <Outlet />;
//     }



//     if (isLoading) return <div className="p-10 text-center"><i className="fa-solid fa-spinner fa-spin mr-2"></i>Loading Templates...</div>;
//     if (isError) return <div className="p-10 text-center text-red-500">Error loading templates</div>;

//     return (
//         <div className="p-2 space-y-6 bg-gray-50 max-h-full overflow-y-auto">

//             {/* HEADER & FILTERS */}
//             <div className="flex w-full justify-between items-center md:items-center gap-4">
//                 <div >
//                     <h1 className="text-2xl font-bold text-gray-800">Bill Templates</h1>
//                     <p className="text-gray-500">Manage and customize your billing layouts</p>
//                 </div>


//                 <div
//                     onClick={() => navigate(`create`)}
//                     className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-gray-100 transition-colors text-gray-500 min-h-[200px]"
//                 >
//                     <i className="fa-solid fa-plus text-4xl mb-2"></i>
//                     <span className="font-medium">Create New Template</span>
//                 </div>

//             </div>

//             <Card className="p-4">
//                 <div className="flex flex-col md:flex-row gap-4 items-end">
//                     <div className="w-full md:w-1/3">
//                         <label className="text-xs text-gray-500 mb-1 block">Search Template</label>
//                         <div className="relative">
//                             {/* FontAwesome Icon */}
//                             <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400 text-xs"></i>
//                             <input
//                                 type="text"
//                                 placeholder="Search by name..."
//                                 className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="w-full md:w-1/4">
//                         <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
//                         <input
//                             type="date"
//                             className="w-full px-3 py-2 border rounded-md text-sm outline-none"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                         />
//                     </div>
//                     <div className="w-full md:w-1/4">
//                         <label className="text-xs text-gray-500 mb-1 block">End Date</label>
//                         <input
//                             type="date"
//                             className="w-full px-3 py-2 border rounded-md text-sm outline-none"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                         />
//                     </div>
//                 </div>
//             </Card>

//             {/* TEMPLATE GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredTemplates?.map((template: any) => (
//                     <Card
//                         key={template._id}
//                         onClick={() => handleCardClick(template._id)}
//                         className="cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500"
//                     >
//                         <CardHeader>
//                             <div className="flex justify-between items-start">
//                                 <CardTitle>{template.templateName}</CardTitle>
//                                 {template.isDefault && <Badge variant="success">Default</Badge>}
//                             </div>
//                             <CardDescription>
//                                 {/* Custom Date Util */}
//                                 Created: {dateFormate(template.createdAt)}
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="flex gap-2 flex-wrap">
//                                 <Badge variant="secondary">
//                                     <i className="fa-solid fa-layer-group mr-1"></i>
//                                     {template.layout?.length || 0} Sections
//                                 </Badge>
//                                 <Badge variant="outline">A4 Format</Badge>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}

//             </div>
//         </div>
//     );
// };





// SECOND VERSION
// import { useState } from 'react';
// import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
// import { useGetAllTemplates  } from '../../../../apiList/Department Api/Accounting Api/billNew_accounting_api/billNewAccountingApi';
// import { Button } from '../../../../components/ui/Button';
// import { Badge } from '../../../../components/ui/Badge';
// import { dateFormate } from '../../../../utils/dateFormator';
// import { useDebounce } from '../../../../Hooks/useDebounce';

// // --- MINI PREVIEW COMPONENT ---
// // This renders a tiny version of the A4 page structure inside the card
// const TemplateMiniPreview = ({ components }: { components: any[] }) => {
//     return (
//         <div className="w-full relative bg-white border border-gray-200 shadow-inner rounded overflow-hidden" style={{ paddingTop: '141.4%' }}> 
//             {/* Aspect Ratio for A4 (1 : 1.414) */}
//             <div className="absolute inset-0 p-2">
//                 {components.slice(0, 10).map((comp, i) => {
//                     // Calculate percentage positions based on A4 pixel size (794 x 1123)
//                     const left = (comp.x / 794) * 100;
//                     const top = (comp.y / 1123) * 100;
//                     const width = comp.style?.width ? (comp.style.width / 794) * 100 : 20;
//                     const height = comp.style?.height && comp.style.height !== 'auto' ? (comp.style.height / 1123) * 100 : 2;

//                     let bgClass = 'bg-gray-200';
//                     if (comp.type === 'image') bgClass = 'bg-blue-100 border border-blue-200';
//                     if (comp.type === 'table') bgClass = 'bg-green-50 border border-green-200 grid place-items-center';
//                     if (comp.type === 'text' && comp.style?.fontSize > 16) bgClass = 'bg-gray-800'; // Titles

//                     return (
//                         <div 
//                             key={i}
//                             className={`absolute rounded-sm ${bgClass}`}
//                             style={{
//                                 left: `${left}%`,
//                                 top: `${top}%`,
//                                 width: `${width}%`,
//                                 height: `${Math.max(height, 2)}%`, // Min height for visibility
//                                 opacity: 0.7
//                             }}
//                         >
//                             {comp.type === 'table' && <i className="fas fa-table text-[6px] text-green-400"></i>}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export const TemplateBillMain = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { organizationId } = useParams<{ organizationId: string }>();

//     // Filters
//     const [searchInput, setSearchInput] = useState('');
//     const [searchTerm, setSearchTerm] = useState(''); // Triggered on enter/click
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');

//     // Fetch Data
//     const { data: defaultTemplates, isLoading, isError, refetch } = useGetDefaultTemplate({
//         organizationId: organizationId!
//     });

//     // Filter Logic
//     const filteredTemplates = defaultTemplates?.filter((tpl: any) => {
//         const matchesName = tpl.templateName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

//         let matchesDate = true;
//         if (startDate && endDate && tpl.createdAt) {
//             const tplDate = new Date(tpl.createdAt);
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             matchesDate = tplDate >= start && tplDate <= end;
//         }

//         return matchesName && matchesDate;
//     });

//     const activeFiltersCount = (searchTerm ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0);

//     const clearFilters = () => {
//         setSearchInput('');
//         setSearchTerm('');
//         setStartDate('');
//         setEndDate('');
//     };

//     const handleCardClick = (id: string) => {
//         navigate(`single/${id}`);
//     };

//     // If viewing details/create, render Outlet
//     const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');
//     if (isDetailView) return <Outlet />;

//     return (
//         <div className="p-2 space-y-6 h-full overflow-y-auto bg-gray-50/50">

//             {/* --- HEADER --- */}
//             <header className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                         <i className="fas fa-file-invoice mr-3 text-blue-600"></i>
//                         Template Builder
//                     </h1>
//                     <p className="text-gray-600 mt-1">
//                         Design and manage your billing layouts
//                     </p>
//                 </div>

//                 <div className="flex gap-2 w-[300px] md:w-[400px]">
//                     {/* Create Button */}
//                     <button
//                         onClick={() => navigate(`create`)}
//                         className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
//                         title="Create New Template"
//                     >
//                         <i className="fas fa-plus text-lg"></i>
//                     </button>

//                     {/* Header Search */}
//                     <input
//                         type="text"
//                         placeholder="Search Templates..."
//                         value={searchInput}
//                         onChange={(e) => setSearchInput(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter") setSearchTerm(searchInput);
//                         }}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                     />

//                     <Button
//                         onClick={() => setSearchTerm(searchInput)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
//                     >
//                         <i className="fas fa-search"></i>
//                     </Button>
//                 </div>
//             </header>

//             {/* --- CONTENT AREA --- */}
//             {isLoading ? (
//                 <div className="flex h-64 items-center justify-center text-gray-500">
//                     <i className="fa-solid fa-spinner fa-spin mr-2 text-2xl"></i> Loading Templates...
//                 </div>
//             ) : isError ? (
//                 <div className="max-w-xl mx-auto mt-4 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
//                     <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
//                     <p className="text-red-500 mb-4">Failed to load templates.</p>
//                     <Button onClick={() => refetch()} className="bg-red-600 text-white">Retry</Button>
//                 </div>
//             ) : (
//                 <main className="flex flex-col xl:flex-row gap-6 h-[90%]">

//                     {/* --- LEFT SIDEBAR (FILTERS) --- */}
//                     <div className="xl:w-80 flex-shrink-0">
//                         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-0">
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
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//                                     <input
//                                         type="date"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//                                     <input
//                                         type="date"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                         value={endDate}
//                                         onChange={(e) => setEndDate(e.target.value)}
//                                     />
//                                 </div>

//                                 <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
//                                     <p className="text-xs text-blue-800">
//                                         <i className="fas fa-info-circle mr-1"></i>
//                                         Templates created here are available when generating new bills for customers.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* --- RIGHT GRID (CARDS) --- */}
//                     {filteredTemplates?.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl border border-dashed border-gray-300 text-center p-6">
//                             <i className="fas fa-folder-open text-5xl text-gray-300 mb-4" />
//                             <h3 className="text-lg font-semibold text-gray-700 mb-1">No Templates Found</h3>
//                             <p className="text-sm text-gray-500">
//                                 Create a new template to get started.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="flex-1">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10">
//                                 {filteredTemplates?.map((template: any) => (
//                                     <div
//                                         key={template._id}
//                                         onClick={() => handleCardClick(template._id)}
//                                         className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
//                                     >
//                                         {/* CARD PREVIEW AREA */}
//                                         <div className="p-4 bg-gray-50 border-b border-gray-100 group-hover:bg-blue-50/30 transition-colors">
//                                             <div className="w-3/4 mx-auto shadow-lg transform group-hover:scale-105 transition-transform duration-300">
//                                                 {/* Pass components to generate mini-map */}
//                                                 <TemplateMiniPreview components={template.layout?.[0]?.components || []} />
//                                             </div>
//                                         </div>

//                                         {/* CARD FOOTER INFO */}
//                                         <div className="p-4 flex flex-col gap-2">
//                                             <div className="flex justify-between items-start">
//                                                 <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                                                     {template.templateName}
//                                                 </h4>
//                                                 {template.isDefault && (
//                                                     <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Default</Badge>
//                                                 )}
//                                             </div>

//                                             <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
//                                                 <span className="flex items-center gap-1">
//                                                     <i className="far fa-calendar"></i>
//                                                     {dateFormate(template.createdAt)}
//                                                 </span>
//                                                 <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
//                                                     <i className="fas fa-layer-group"></i>
//                                                     {template.layout?.[0]?.components?.length || 0} blocks
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </main>
//             )}
//         </div>
//     );
// };



import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetAllTemplates } from '../../../../apiList/Department Api/Accounting Api/billNew_accounting_api/billNewAccountingApi';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { dateFormate } from '../../../../utils/dateFormator';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { Breadcrumb, type BreadcrumbItem } from '../../Breadcrumb';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
import StageGuide from '../../../../shared/StageGuide';
// import { useDebounce } from '../../../../hooks/useDebounce'; // Assuming you have this hook

// --- MINI PREVIEW COMPONENT ---
const TemplateMiniPreview = ({ components }: { components: any[] }) => {
    return (
        <div className="w-full relative bg-white border border-gray-200 shadow-inner rounded overflow-hidden" style={{ paddingTop: '141.4%' }}>
            {/* Aspect Ratio for A4 (1 : 1.414) */}
            <div className="absolute inset-0 p-2">
                {components.slice(0, 10).map((comp, i) => {
                    const left = (comp.x / 794) * 100;
                    const top = (comp.y / 1123) * 100;
                    const width = comp.style?.width ? (comp.style.width / 794) * 100 : 20;
                    const height = comp.style?.height && comp.style.height !== 'auto' ? (comp.style.height / 1123) * 100 : 2;

                    let bgClass = 'bg-gray-200';
                    if (comp.type === 'image') bgClass = 'bg-blue-100 border border-blue-200';
                    if (comp.type === 'table') bgClass = 'bg-green-50 border border-green-200 grid place-items-center';
                    if (comp.type === 'text' && comp.style?.fontSize > 16) bgClass = 'bg-gray-800';

                    return (
                        <div
                            key={i}
                            className={`absolute rounded-sm ${bgClass}`}
                            style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: `${width}%`,
                                height: `${Math.max(height, 2)}%`,
                                opacity: 0.7
                            }}
                        >
                            {comp.type === 'table' && <i className="fas fa-table text-[6px] text-green-400"></i>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TemplateBillMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams<{ organizationId: string }>();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        createdFromDate: '',
        createdToDate: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    // Debounced Search to prevent too many API calls
    const debouncedSearch = useDebounce(filters.search, 700);


    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.billtemplate?.list;
    const canCreate = role === "owner" || permission?.billtemplate?.create
    // const canEdit = role === "owner" || permission?.billtemplate?.edit
    // const canDelete = role === "owner" || permission?.billtemplate?.delete



    // --- USE INFINITE QUERY ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetAllTemplates({
        organizationId: organizationId!,
        limit: 12, // Grid layout usually fits 3 or 4, 12 is a good multiple
        search: debouncedSearch,
        createdFromDate: filters.createdFromDate,
        createdToDate: filters.createdToDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
    });

    // Flatten Pages into a single array of templates
    const templates = data?.pages.flatMap(page => page.data) || [];

    // --- INFINITE SCROLL OBSERVER ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Load more when within 100px of bottom
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Helpers
    const activeFiltersCount = (filters.search ? 1 : 0) + (filters.createdFromDate ? 1 : 0) + (filters.createdToDate ? 1 : 0);

    const clearFilters = () => {
        setFilters({
            search: '',
            createdFromDate: '',
            createdToDate: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const handleCardClick = (id: string) => {
        navigate(`single/${id}`);
    };




    const paths: BreadcrumbItem[] = [
        { label: "Account", path: `/organizations/${organizationId}/projects/accounting` },
        { label: "Design Bill", path: `/organizations/${organizationId}/projects/billnew` },
        { label: "Bill Templates", path: `/organizations/${organizationId}/projects/billnew/billtemplate` },
    ];


    // Render children (Create/Edit/Single View) if route matches
    const isDetailView = location.pathname.includes('/single') || location.pathname.includes('/create');
    if (isDetailView) return <Outlet />;

    return (
        <div className="space-y-0 h-full flex flex-col bg-gray-50/50">

            {/* --- HEADER --- */}
            <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">

                <div className="flex gap-2 items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-file-invoice mr-3 text-blue-600"></i>
                            Bill Templates
                        </h1>
                        <Breadcrumb paths={paths} />
                    </div>

                    {/* <p className="text-xs text-gray-500 mt-1">Design billing layouts</p> */}
                </div>

                <section className='flex gap-2 items-center'>

                    {canCreate && <div className="flex gap-2">
                        <Button onClick={() => navigate(`create`)}>
                            <i className="fas fa-plus mr-2"></i> Create Template
                        </Button>
                    </div>}

                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="billtemplate"
                        />
                    </div>
                </section>
            </header>

            {/* --- LOADING / ERROR --- */}
            {isLoading ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                    <i className="fa-solid fa-spinner fa-spin mr-2 text-2xl"></i> Loading Templates...
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg shadow text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-red-500 mb-4">{(error as any)?.message || "Failed to load templates."}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white">Retry</Button>
                </div>
            ) : (
                <main className="flex flex-col xl:flex-row gap-0 flex-1 overflow-hidden">

                    {/* --- LEFT SIDEBAR (FILTERS) --- */}
                    <div className="xl:w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-md font-bold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i> Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search</label>
                                <div className="relative">
                                    <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                                    <input
                                        type="text"
                                        placeholder="Template name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Range</label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                        value={filters.createdFromDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, createdFromDate: e.target.value }))}
                                    />
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                                        value={filters.createdToDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, createdToDate: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Sorting */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none bg-white"
                                >
                                    <option value="createdAt">Created Date</option>
                                    <option value="templateName">Name</option>
                                    <option value="updatedAt">Last Updated</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order</label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none bg-white"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (GRID) --- */}
                    {canList && <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto bg-gray-50/50 p-4"
                    >
                        {templates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-folder-open text-4xl text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">No Templates Found</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {filters.search
                                        ? `No matches for "${filters.search}"`
                                        : "Create a new template to get started."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {templates.map((template: any) => (
                                        <div
                                            key={template._id}
                                            onClick={() => handleCardClick(template._id)}
                                            className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                                        >
                                            {/* CARD PREVIEW AREA */}
                                            <div className="p-4 bg-gray-50 border-b border-gray-100 group-hover:bg-blue-50/30 transition-colors">
                                                <div className="w-3/4 mx-auto shadow-lg transform group-hover:scale-105 transition-transform duration-300 bg-white">
                                                    {/* Mini Preview */}
                                                    <TemplateMiniPreview components={template.layout?.[0]?.components || []} />
                                                </div>
                                            </div>

                                            {/* CARD FOOTER INFO */}
                                            <div className="p-4 flex flex-col gap-2">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors text-sm">
                                                        {template.templateName}
                                                    </h4>
                                                    {template.isDefault && (
                                                        <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Default</Badge>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <i className="far fa-calendar"></i>
                                                        {dateFormate(template.createdAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        <i className="fas fa-layer-group"></i>
                                                        {template.layout?.[0]?.components?.length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* LOADING INDICATOR */}
                                {isFetchingNextPage && (
                                    <div className="flex justify-center py-8">
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <i className="fas fa-spinner fa-spin text-xl"></i>
                                            <span className="text-sm font-medium">Loading more templates...</span>
                                        </div>
                                    </div>
                                )}

                                {/* END OF LIST */}
                                {!hasNextPage && templates.length > 0 && (
                                    <div className="flex justify-center py-6 text-gray-400 text-xs">
                                        <p>End of list</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>}
                </main>
            )}
        </div>
    );
};


export default TemplateBillMain