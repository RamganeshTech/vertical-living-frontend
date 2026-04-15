import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSinglePublicCostCalculation } from '../../apiList/publicCostCalculationApi';
import { Breadcrumb, type BreadcrumbItem } from '../Department Pages/Breadcrumb';
import { downloadImage } from '../../utils/downloadFile';
import { toast } from '../../utils/toast';

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
            <main className="px-6 py-3 w-full max-w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Summary & Client Info */}
                    <div className="lg:col-span-4 space-y-3">
                        {/* Client Card */}
                        <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <h3 className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-800 mb-5 flex items-center">
                                <i className="fas fa-user-circle mr-2 text-blue-600"></i> Client Profile
                            </h3>

                            <div className="space-y-4">
                                {/* Full Name stays prominent but with tighter margin */}
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Full Name</p>
                                    <p className="text-sm font-bold text-slate-800 tracking-tight">{record.name}</p>
                                </div>

                                {/* Row layout for Contact and Location to save height */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                                        <p className="text-xs font-semibold text-slate-700">{record.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                        <p className="text-xs font-semibold text-slate-700">{record.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="bg-slate-900 p-6 rounded-[24px] text-white shadow-xl">
                            {/* Header and Estimate grouped closer */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-[1.5px] text-blue-400 mb-2">Financial Overview</h3>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Final Estimate</p>
                                    <p className="text-3xl font-bold text-white tracking-tight">₹{record.estimate.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                                    <p className="text-[8px] text-slate-500 uppercase font-bold leading-none mb-1">Finish Quality</p>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase leading-none">{record.finish}</p>
                                </div>
                            </div>

                            {/* Details list with tighter spacing */}
                            <div className="pt-4 border-t border-slate-800 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-medium uppercase">Carpet Area</span>
                                    <span className="text-[11px] font-bold text-slate-200">{record.carpetArea} SQFT</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-medium uppercase">Home Type</span>
                                    <span className="text-[11px] font-bold text-slate-200">{record.homeType}</span>
                                </div>
                            </div>

                            {/* PDF Actions - Integrated with tighter margins */}
                            {record.quotationPdf?.url && (
                                <div className="mt-6 pt-5 border-t border-slate-800">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            onClick={() => window.open(record.quotationPdf.url, '_blank')}
                                            className="flex cursor-pointer items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all"
                                        >
                                            <i className="fas fa-eye text-blue-400"></i> View
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await downloadImage({ src: record.quotationPdf.url, alt: "vertical living instant quote" })
                                                    toast({ title: "Success", description: "successfully downloaded" });
                                                } catch (err: any) {
                                                    toast({ title: "Error", description: err.response?.data?.message || "Download failed" });
                                                }
                                            }}
                                            className="flex cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg shadow-blue-900/20"
                                        >
                                            <i className="fas fa-download"></i> Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>

                    {/* RIGHT COLUMN: Configuration Details */}
                    <div className="lg:col-span-8 h-full max-h-[560px] overflow-y-auto custom-scrollbar">
                        <div className="bg-white p-6 md:p-8 rounded-[30px] border border-slate-200 shadow-sm min-h-full">

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                                        <i className="fas fa-layer-group text-sm"></i>
                                    </div>
                                    <h3 className="text-[13px] font-bold uppercase tracking-[px] text-slate-800">Room's and Products</h3>
                                </div>
                                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {Object.keys(record.config || {}).length} Rooms
                                </span>
                            </div>

                            <div className="space-y-8 relative">
                                {Object.entries(record.config || {}).map(([roomKey, roomData]: [string, any], idx) => {
                                    // Color array to make icons colorful based on index
                                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500', 'bg-pink-500'];
                                    const colorClass = colors[idx % colors.length];

                                    return (
                                        <div key={roomKey} className="relative">
                                            {/* ROOM HEADER - Compact & Sticky */}
                                            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10 border-b border-slate-50">
                                                <div className={`w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md`}>
                                                    {idx + 1}
                                                </div>
                                                <h4 className="font-bold text-slate-900 uppercase text-[12px] tracking-widest">
                                                    {roomData.roomName}
                                                </h4>
                                            </div>

                                            {/* PRODUCT GRID - Optimized for minimal height */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-0 md:pl-2">
                                                {Object.entries(roomData.products || {}).map(([prodKey, prod]: [string, any]) => (
                                                    <div key={prodKey} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-400  transition-all duration-200">

                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400  group-hover:${colorClass} transition-all duration-300`}>
                                                                <i className={`fas ${prod.id === 'grand_tv' ? 'fa-tv' : 'fa-columns'} text-sm`}></i>
                                                            </div>
                                                            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tight truncate max-w-[120px]">
                                                                {prod.name}
                                                            </p>
                                                        </div>

                                                        {/* DATA ALONE - Horizontal Dimensions */}
                                                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                            <span className="text-[11px] font-bold text-slate-900">
                                                                {prod.h}<span className="text-blue-500 ml-0.5">H</span>
                                                            </span>
                                                            <span className="text-slate-300 text-[10px] font-bold">×</span>
                                                            <span className="text-[11px] font-bold text-slate-900">
                                                                {prod.w}<span className="text-blue-500 ml-0.5">W</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicCostCalculationSingle;