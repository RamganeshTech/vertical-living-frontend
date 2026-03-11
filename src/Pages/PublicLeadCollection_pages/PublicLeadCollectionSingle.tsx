// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useGetSinglePublicLead } from '../../apiList/publicLeadCollectionApi';
// import { Breadcrumb, type BreadcrumbItem } from '../Department Pages/Breadcrumb';

// const PublicLeadCollectionSingle: React.FC = () => {
//     const { organizationId, id } = useParams<{ organizationId: string; id: string }>();
//     const navigate = useNavigate();

//     const { data: lead, isLoading, error } = useGetSinglePublicLead(id!, organizationId!);

//     if (isLoading) return (
//         <div className="h-screen w-full flex items-center justify-center bg-slate-50">
//             <div className="flex flex-col items-center gap-4">
//                 <i className="fa fa-spinner fa-spin text-3xl text-blue-600"></i>
//                 <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Inquiry...</span>
//             </div>
//         </div>
//     );

//     if (error || !lead) return <div className="p-20 text-center text-red-500 font-bold">Lead details not found.</div>;

//     const paths: BreadcrumbItem[] = [
//         { label: "Lead Collection", path: `/organizations/${organizationId}/lead-collection` },
//         { label: lead.leadNumber, path: "#" },
//     ];

//     return (
//         <div className="min-h-full bg-slate-50/50 p-6 md:p-10 font-inter">
//             {/* Top Navigation Row */}
//             <div className="max-w-full mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//                 <div>
//                     <button 
//                         onClick={() => navigate(-1)}
//                         className="mb-4 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-bold uppercase tracking-widest"
//                     >
//                         <i className="fa fa-chevron-left"></i> Back to All Leads
//                     </button>
//                     <div className="flex items-center gap-4">
//                         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{lead.fullName}</h1>
//                         <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold tracking-tighter shadow-lg shadow-blue-100">
//                             {lead.leadNumber}
//                         </span>
//                     </div>
//                     <Breadcrumb paths={paths} />
//                 </div>

//                 {/* <div className="flex items-center gap-3">
//                     <button className="bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2">
//                         <i className="fa fa-print"></i> Print Report
//                     </button>
//                     <a 
//                         href={`https://wa.me/${lead.mobileNumber}`} 
//                         target="_blank" 
//                         rel="noreferrer"
//                         className="bg-[#25D366] text-white px-6 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-green-100 hover:scale-105 transition-all flex items-center gap-2"
//                     >
//                         <i className="fa fa-whatsapp text-lg"></i> Contact Client
//                     </a>
//                 </div> */}
//             </div>

//             <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

//                 {/* Left Sidebar: Contact Essentials */}
//                 <div className="lg:col-span-4 space-y-6">
//                     <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
//                         <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-blue-600 mb-8 flex items-center">
//                             <i className="fa fa-user-circle mr-2"></i> Contact Details
//                         </h3>
//                         <div className="space-y-6">
//                             <div>
//                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
//                                 <p className="text-md font-bold text-slate-800">{lead.mobileNumber}</p>
//                             </div>
//                             <div>
//                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submission Date</p>
//                                 <p className="text-md font-bold text-slate-800">
//                                     {new Date(lead.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lead Source</p>
//                                 <p className="text-xs font-bold text-slate-600 italic">Project Planner Inquiry Form</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Content: Project Roadmap */}
//                 <div className="lg:col-span-8 space-y-6">
//                     <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
//                         <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-blue-600 mb-12">Project Requirements</h3>

//                         <div className="relative border-l-2 border-slate-50 ml-4 space-y-12">

//                             {/* Roadmap Item 1: Category & Type */}
//                             <div className="relative pl-10">
//                                 <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Project Category</p>
//                                         <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight">
//                                             {lead.projectCategory}
//                                         </span>
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Property Configuration</p>
//                                         <p className="text-sm font-bold text-slate-800">{lead.propertyType}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Roadmap Item 2: Budget & Location */}
//                             <div className="relative pl-10">
//                                 <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Planned Budget</p>
//                                         <p className="text-xl font-bold text-blue-600">{lead.budget}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Site Location</p>
//                                         <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
//                                             <i className="fa fa-map-marker text-red-400"></i> {lead.location}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Roadmap Item 3: Timeline & Service */}
//                             <div className="relative pl-10">
//                                 <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Project Timeline</p>
//                                         <p className="text-sm font-bold text-slate-800 bg-slate-50 inline-block px-3 py-1 rounded-lg">
//                                             {lead.timeline}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Service Requested</p>
//                                         <p className="text-sm font-bold text-slate-800">
//                                             {lead.serviceType}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default PublicLeadCollectionSingle;



import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSinglePublicLead } from '../../apiList/publicLeadCollectionApi';
import { Breadcrumb, type BreadcrumbItem } from '../Department Pages/Breadcrumb';

const PublicLeadCollectionSingle: React.FC = () => {
    const { organizationId, id } = useParams<{ organizationId: string; id: string }>();
    const navigate = useNavigate();

    const { data: lead, isLoading, error } = useGetSinglePublicLead(id!, organizationId!);

    console.log("lead", lead)

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <i className="fas fa-circle-notch fa-spin text-2xl text-blue-600"></i>
                <span className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Loading Inquiry Details...</span>
            </div>
        </div>
    );

    if (error || !lead) return <div className="p-20 text-center text-red-500 font-bold">Lead details not found.</div>;

    const paths: BreadcrumbItem[] = [
        { label: "Lead Collection", path: `/organizations/${organizationId}/projects/publicleadcollection` },
        { label: lead.leadNumber, path: "#" },
    ];

    return (
        <div className="min-h-screen bg-slate-50/30 font-inter flex flex-col">
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
                                <i className="fas fa-id-card-alt mr-3 text-blue-600"></i>
                                {lead.fullName}
                            </h1>
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                                {lead.leadNumber}
                            </span>
                        </div>
                        <div className="mt-1">
                            <Breadcrumb paths={paths} />
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT - Full Width */}
            <main className="p-6 md:p-10 w-full max-w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT SIDEBAR: Contact Essentials */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800"></div>
                            <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 mb-8 flex items-center">
                                <i className="fas fa-info-circle mr-2"></i> Information Stack
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <i className="fas fa-user text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Name</p>
                                        <p className="text-md font-bold text-slate-800">{lead?.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <i className="fas fa-phone-alt text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
                                        <p className="text-md font-bold text-slate-800">{lead.mobileNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                                        <i className="fas fa-calendar-alt text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Received On</p>
                                        <p className="text-md font-bold text-slate-800">
                                            {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                                        <i className="fas fa-globe text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Source Context</p>
                                        <p className="text-xs font-semibold text-slate-500">Inquiry Form</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: Detailed Requirements */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-10 rounded-[30px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 flex items-center">
                                    <i className="fas fa-layer-group mr-2 text-blue-600"></i> Project Parameters
                                </h3>
                                <div className="h-px flex-1 bg-slate-100 mx-6"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">

                                {/* Item 1 */}
                                <div className="flex gap-5">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                                        <i className="fas fa-building text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Project Category</p>
                                        <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider">
                                            {lead.projectCategory}
                                        </span>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="flex gap-5">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <i className="fas fa-home text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Property Config</p>
                                        <p className="text-sm font-bold text-slate-800">{lead.propertyType}</p>
                                    </div>
                                </div>

                                {/* Item 3 */}
                                <div className="flex gap-5">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <i className="fas fa-wallet text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Budget Bracket</p>
                                        <p className="text-xl font-bold text-blue-600 tracking-tight">{lead.budget}</p>
                                    </div>
                                </div>

                                {/* Item 4 */}
                                <div className="flex gap-5">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <i className="fas fa-map-marker-alt text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Site Location</p>
                                        <p className="text-sm font-bold text-slate-800">{lead.location}</p>
                                    </div>
                                </div>

                                {/* Item 5 */}
                                <div className="flex gap-5">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <i className="fas fa-hourglass-half text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Expected Timeline</p>
                                        <p className="text-sm font-bold text-slate-800">{lead.timeline}</p>
                                    </div>
                                </div>

                                {/* Item 6 */}
                                <div className="flex gap-5">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <i className="fas fa-tools text-lg"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Service Model</p>
                                        <p className="text-sm font-bold text-slate-800">{lead.serviceType}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PublicLeadCollectionSingle;