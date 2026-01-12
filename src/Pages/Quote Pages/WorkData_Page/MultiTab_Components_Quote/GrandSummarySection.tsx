

// interface SummaryDataProps {
//     summaryData: {
//         totalArea: number;
//         labourCost: number;
//         materialCost: number;
//         totalTemplateCost: number;
//     }
//     spec?: string
// }


// export const GrandSummarySection: React.FC<SummaryDataProps> = ({ summaryData, spec }) => {
//     // Standardizing data inputs
//     const area = Number(summaryData?.totalArea || 0);
//     const labour = Number(summaryData?.labourCost || 0);
//     const material = Number(summaryData?.materialCost || 0);
//     const total = Number(summaryData?.totalTemplateCost || 0);

//     return (
//         <div className="p-8 space-y-6 animate-in fade-in duration-500">
//             {/* TOP METRICS ROW: Clean, light-bordered cards */}
//             <div className="grid grid-cols-3 gap-6">
//                 <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                         <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Area</p>
//                     </div>
//                     <p className="text-2xl font-black text-slate-900 tracking-tighter">
//                         {area.toFixed(2)}
//                         <span className="text-xs text-slate-400 ml-1 font-bold uppercase">sqft</span>
//                     </p>
//                 </div>

//                 <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                         <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Labour Cost</p>
//                     </div>
//                     <p className="text-2xl font-black text-slate-900 tracking-tighter">
//                         ₹{labour.toLocaleString('en-IN')}
//                     </p>
//                 </div>

//                 <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                         <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Cost</p>
//                     </div>
//                     <p className="text-2xl font-black text-slate-900 tracking-tighter">
//                         ₹{material.toLocaleString('en-IN')}
//                     </p>
//                 </div>
//             </div>

//             {/* FINAL TEMPLATE COST CARD: Balanced Blue Accent Style */}
//             <div className="bg-white rounded-[2rem] p-10 border-2 border-blue-50 shadow-xl shadow-blue-500/5 relative overflow-hidden flex flex-col items-center">
//                 <div className="relative z-10 w-full text-center">
//                     <div className="flex items-center justify-center gap-4 mb-6">
//                         <div className="h-[1px] w-12 bg-slate-100"></div>
//                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
//                             Total {spec} Template Cost
//                         </p>
//                         <div className="h-[1px] w-12 bg-slate-100"></div>
//                     </div>

//                     <div className="flex items-baseline justify-center gap-2">
//                         <span className="text-3xl font-bold text-blue-600">₹</span>
//                         {/* Font size increased slightly to text-6xl for prominence without being overwhelming */}
//                         <h2 className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
//                             {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                         </h2>
//                     </div>

//                     {/* Meta info matching Glass Spec aesthetic */}
//                     {/* <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center gap-12 opacity-50">
//                         <div className="flex items-center gap-2">
//                             <i className="fas fa-check-double text-blue-500 text-xs"></i>
//                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Specs</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <i className="fas fa-calculator text-blue-500 text-xs"></i>
//                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auto-Calculated</span>
//                         </div>
//                     </div> */}
//                 </div>
//             </div>
//         </div>
//     );
// };



interface SummaryDataProps {
    summaryData: {
        totalArea: number;
        labourCost: number;
        materialCost: number;
        totalTemplateCost: number;
    }
    spec?: string
}

export const GrandSummarySection: React.FC<SummaryDataProps> = ({ summaryData, spec }) => {
    const area = Number(summaryData?.totalArea || 0);
    const labour = Number(summaryData?.labourCost || 0);
    const material = Number(summaryData?.materialCost || 0);
    const total = Number(summaryData?.totalTemplateCost || 0);

    // bg-[#f8fafc]
    return (
        <div className="p-8 h-full space-y-8  animate-in fade-in duration-700">
            {/* 1. SECTIONED METRICS: Using light blue backgrounds for contrast */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border-l-4 border-blue-500 p-6 rounded-r-2xl shadow-sm">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Area</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        {area.toFixed(2)}
                        <span className="text-xs text-slate-400 ml-2 font-bold uppercase">sqft</span>
                    </p>
                </div>

                <div className="bg-white border-l-4 border-blue-400 p-6 rounded-r-2xl shadow-sm">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Labour Cost</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        ₹{labour.toLocaleString('en-IN')}
                    </p>
                </div>

                <div className="bg-white border-l-4 border-blue-300 p-6 rounded-r-2xl shadow-sm">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Material Value</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        ₹{material.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {/* 2. GRAND TOTAL CARD: Soft Blue Gradient and Border */}
            <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-[2.5rem] p-12 shadow-xl shadow-blue-500/5 relative overflow-hidden flex flex-col items-center group">
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 w-full text-center">
                    <div className="inline-flex items-center gap-3 bg-blue-100/50 px-4 py-1.5 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest italic">
                            Final {spec} Valuation
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-end border-r border-blue-200 pr-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Consolidated</span>
                            <span className="text-[11px] font-black text-blue-600 uppercase tracking-tighter italic">Grand Total</span>
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-300">₹</span>
                            <h2 className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums italic leading-none">
                                {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                    </div>

                    {/* Metadata indicators matching your technical style */}
                    <div className="mt-12 flex justify-center gap-12 pt-8 border-t border-blue-100/50">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                                <i className="fas fa-microchip text-blue-400 text-[10px]"></i>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Calculated</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                                <i className="fas fa-layer-group text-blue-400 text-[10px]"></i>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Draft</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};