import React from 'react';

interface Props {
    data: any; // The quote data containing sqftRateWork
    isBlured?: boolean; // Toggle for blur functionality
}

const SqftRateClientQuote: React.FC<Props> = ({ data, isBlured }) => {
    const works = data?.sqftRateWork || [];

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8">
                {/* Work Table */}
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-[10px] uppercase font-black text-slate-400 tracking-[0.15em]">
                            <th className="text-left px-6 pb-2">Work Type</th>
                            <th className="text-right px-6 pb-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {works.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="py-20 text-center text-slate-400 font-bold italic">
                                    No items listed in this quote.
                                </td>
                            </tr>
                        ) : (
                            works.map((work: any, index: number) => (
                                <tr 
                                    key={index} 
                                    className="bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl overflow-hidden"
                                >
                                    <td className="px-6 py-5 rounded-l-2xl">
                                        <div className={`transition-all duration-500 ${isBlured ? 'blur-sm select-none' : ''}`}>
                                            <p className="font-bold text-slate-800 text-lg leading-tight">
                                                {work.workType || "General Work"}
                                            </p>
                                            {/* Note: We hide details like sqft rate and area for the client, just showing the label */}
                                            {/* <p className="text-[10px] text-slate-400 uppercase font-black mt-1">
                                                Professional Installation & Materials
                                            </p> */}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right rounded-r-2xl border-l border-white/50">
                                        <div className={`transition-all duration-500 ${isBlured ? 'blur-sm select-none' : ''}`}>
                                            <p className="text-xl font-black text-slate-900">
                                                ₹{(work.totalCost || 0).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Footer Totals */}
                {/* <footer className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                    <div className="bg-slate-900 p-6 px-10 rounded-[2rem] shadow-xl shadow-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">
                            Final Estimated Quote
                        </p>
                        <div className={`transition-all duration-500 ${isBlured ? 'blur-md select-none' : ''}`}>
                            <p className="text-4xl font-black text-white leading-none">
                                ₹{(data?.grandTotal || 0).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                </footer> */}


                {/* Integrated Footer Totals */}
                <footer className="mt-6 flex justify-end">
                    <div className="w-full max-w-md border-t-2 border-dashed border-slate-400 pt-6 px-6 flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
                                Total Estimate
                            </p>
                            {/* <p className="text-xs text-slate-500 font-medium">Inclusive of materials & labor</p> */}
                        </div>
                        
                        <div className={`transition-all duration-500 ${isBlured ? 'blur-md select-none' : ''}`}>
                            <p className="text-4xl font-black text-blue-600 tracking-tight">
                                ₹{(data?.grandTotal || 0).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>


        </div>
    );
};

export default SqftRateClientQuote;