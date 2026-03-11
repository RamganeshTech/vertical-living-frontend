// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useGetSinglePublicCostCalculation } from '../../apiList/publicCostCalculationApi';
// import { Breadcrumb, type BreadcrumbItem } from '../Department Pages/Breadcrumb';

// const PublicCostCalculationSingle: React.FC = () => {
//     const { organizationId, id } = useParams<{ organizationId: string; id: string }>();
//     const navigate = useNavigate();

//     const { data: record, isLoading, error } = useGetSinglePublicCostCalculation(id!, organizationId!);

//     if (isLoading) return (
//         <div className="h-screen w-full flex items-center justify-center bg-slate-50">
//             <div className="flex flex-col items-center gap-4">
//                 <i className="fa fa-spinner fa-spin text-3xl text-blue-500"></i>
//                 <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">Loading Details...</span>
//             </div>
//         </div>
//     );

//     if (error || !record) return <div className="p-20 text-center text-red-500">Failed to load calculation details.</div>;

//     const paths: BreadcrumbItem[] = [
//         { label: "Leads", path: `/organizations/${organizationId}/cost-calculations` },
//         { label: record.name, path: "#" },
//     ];

//     return (
//         <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-inter text-slate-800">
//             {/* Header Area */}
//             <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <button 
//                         onClick={() => navigate(-1)}
//                         className="mb-4 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest"
//                     >
//                         <i className="fa fa-arrow-left"></i> Back to List
//                     </button>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculation Report</h1>
//                     <Breadcrumb paths={paths} />
//                 </div>
//                 {/* <div className="flex gap-3">
//                     {record.quotationPdf && (
//                         <a
//                             href={record.quotationPdf} 
//                             target="_blank" 
//                             rel="noreferrer"
//                             className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
//                         >
//                             <i className="fa fa-file-pdf-o"></i> View PDF
//                         </a>
//                     )}
//                 </div> */}
//             </div>

//             <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

//                 {/* Left Column: Client & Project Info */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
//                         <h3 className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 mb-6">Client Profile</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="text-[9px] font-bold text-slate-400 uppercase">Full Name</label>
//                                 <p className="text-lg font-black text-slate-900">{record.name}</p>
//                             </div>
//                             <div>
//                                 <label className="text-[9px] font-bold text-slate-400 uppercase">Contact Number</label>
//                                 <p className="text-sm font-bold text-slate-700">{record.phone}</p>
//                             </div>
//                             <div>
//                                 <label className="text-[9px] font-bold text-slate-400 uppercase">Project Location</label>
//                                 <p className="text-sm font-bold text-slate-700">{record.location}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-slate-900 p-8 rounded-[35px] text-white shadow-xl">
//                         <h3 className="text-[10px] font-black uppercase tracking-[2px] text-blue-400 mb-6">Valuation Summary</h3>
//                         <div className="space-y-6">
//                             <div className="flex justify-between items-end">
//                                 <div>
//                                     <label className="text-[9px] font-bold text-slate-500 uppercase">Total Estimate</label>
//                                     <p className="text-4xl font-black text-white">₹{record.estimate.toLocaleString('en-IN')}</p>
//                                 </div>
//                             </div>
//                             <div className="pt-6 border-t border-slate-800 space-y-3">
//                                 <div className="flex justify-between text-xs">
//                                     <span className="text-slate-500 font-medium">Home Configuration</span>
//                                     <span className="font-bold">{record.homeType}</span>
//                                 </div>
//                                 <div className="flex justify-between text-xs">
//                                     <span className="text-slate-500 font-medium">Finish Quality</span>
//                                     <span className="font-bold text-blue-400">{record.finish}</span>
//                                 </div>
//                                 <div className="flex justify-between text-xs">
//                                     <span className="text-slate-500 font-medium">Carpet Area</span>
//                                     <span className="font-bold">{record.carpetArea} Sqft</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column: Detailed Config (Rooms & Products) */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm min-h-full">
//                         <div className="flex items-center justify-between mb-8">
//                             <h3 className="text-[10px] font-black uppercase tracking-[2px] text-blue-500">Detailed Configuration</h3>
//                             <span className="bg-slate-50 px-4 py-1 rounded-full text-[10px] font-bold text-slate-400">
//                                 {Object.keys(record.config || {}).length} AREAS DEFINED
//                             </span>
//                         </div>

//                         <div className="space-y-8">
//                             {Object.entries(record.config || {}).map(([roomKey, roomData]: [string, any]) => (
//                                 <div key={roomKey} className="group">
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm">
//                                             {roomData.roomIndex + 1}
//                                         </div>
//                                         <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{roomData.roomName}</h4>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
//                                         {Object.entries(roomData.products || {}).map(([prodKey, prod]: [string, any]) => (
//                                             <div key={prodKey} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md hover:border-blue-100 transition-all">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500">
//                                                         <i className={`fa ${prod.id === 'grand_tv' ? 'fa-television' : 'fa-columns'}`}></i>
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-[11px] font-black text-slate-900 uppercase leading-none mb-1">{prod.name}</p>
//                                                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">ID: {prod.customId}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <p className="text-[10px] font-black text-blue-600 uppercase">{prod.h}' × {prod.w}'</p>
//                                                     <p className="text-[8px] text-slate-300 font-bold uppercase italic">Surface Area</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default PublicCostCalculationSingle;



import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSinglePublicCostCalculation } from '../../apiList/publicCostCalculationApi';
import { Breadcrumb, type BreadcrumbItem } from '../Department Pages/Breadcrumb';

const PublicCostCalculationSingle: React.FC = () => {
    const { organizationId, id } = useParams<{ organizationId: string; id: string }>();
    const navigate = useNavigate();

    const { data: record, isLoading, error } = useGetSinglePublicCostCalculation(id!, organizationId!);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <i className="fas fa-circle-notch fa-spin text-2xl text-blue-600"></i>
                <span className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Retrieving Calculation Data...</span>
            </div>
        </div>
    );

    if (error || !record) return <div className="p-20 text-center text-red-500 font-bold">Calculation details not found.</div>;

    const paths: BreadcrumbItem[] = [
        { label: "Cost Calculations", path: `/organizations/${organizationId}/projects/publiccostcalculation` },
        { label: record.name, path: "#" },
    ];

    return (
        <div className="h-full max-h-full overflow-y-auto bg-slate-50/30 font-inter flex flex-col">
            {/* FIXED HEADER */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-4 pt-4 px-6 md:px-10 flex justify-between items-center shadow-sm">
                <div className='flex items-center gap-4'>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className='bg-slate-50 hover:bg-slate-100 flex items-center justify-center w-10 h-10 border border-slate-200 text-slate-600 cursor-pointer rounded-xl transition-all'
                    >
                        <i className="fas fa-arrow-left text-sm"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center uppercase">
                                <i className="fas fa-calculator mr-3 text-blue-600"></i>
                                Calculation Report
                            </h1>
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                                {record.name}
                            </span>
                        </div>
                        <div className="mt-1">
                            <Breadcrumb paths={paths} />
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="p-6 md:p-10 w-full max-w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Summary & Client Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Client Card */}
                        <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 mb-8 flex items-center">
                                <i className="fas fa-user-circle mr-2 text-blue-600"></i> Client Profile
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                                    <p className="text-md font-bold text-slate-800">{record.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Number</p>
                                    <p className="text-md font-bold text-slate-800">{record.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                    <p className="text-md font-bold text-slate-800">{record.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="bg-slate-900 p-8 rounded-[30px] text-white shadow-xl">
                            <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-blue-400 mb-8">Financial Overview</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Final Estimate</p>
                                    <p className="text-4xl font-bold text-white tracking-tight">₹{record.estimate.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="pt-6 border-t border-slate-800 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase">Quality Finish</span>
                                        <span className="text-xs font-bold text-blue-400 uppercase">{record.finish}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase">Carpet Area</span>
                                        <span className="text-xs font-bold text-slate-200">{record.carpetArea} SQFT</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase">Home Type</span>
                                        <span className="text-xs font-bold text-slate-200">{record.homeType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Configuration Details */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 md:p-10 rounded-[30px] border border-slate-200 shadow-sm transition-all hover:shadow-md min-h-full">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 flex items-center">
                                    <i className="fas fa-layer-group mr-2 text-blue-600"></i> Area-Wise Configuration
                                </h3>
                                <div className="h-px flex-1 bg-slate-100 mx-6"></div>
                                <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {Object.keys(record.config || {}).length} Total Areas
                                </span>
                            </div>

                            <div className="space-y-12">
                                {Object.entries(record.config || {}).map(([roomKey, roomData]: [string, any]) => (
                                    <div key={roomKey} className="relative">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                                {roomData.roomIndex + 1}
                                            </div>
                                            <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">{roomData.roomName}</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-14">
                                            {Object.entries(roomData.products || {}).map(([prodKey, prod]: [string, any]) => (
                                                <div key={prodKey} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors shadow-sm">
                                                            <i className={`fas ${prod.id === 'grand_tv' ? 'fa-tv' : 'fa-columns'} text-lg`}></i>
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-bold text-slate-900 uppercase leading-none mb-1.5 tracking-tight">{prod.name}</p>
                                                            {/* <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Instance: {prod.customId}</p> */}
                                                        </div>
                                                    </div>
                                                    <div className="text-right border-l border-slate-200 pl-4">
                                                        <p className="text-[11px] font-bold text-blue-600 tracking-tighter uppercase">{prod.h}' × {prod.w}'</p>
                                                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter italic">Dim.</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PublicCostCalculationSingle;