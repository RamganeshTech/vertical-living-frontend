import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';


export interface IVendorDetails {
    vendorName: string;
    quotedRate: number | string;
    finalQuoteRate: number; // This serves as the 'singleTotal'
    // remarks?: string;
}

export interface ISubletSection {
    id: number;
    description: string;
    area: number | string;
}

export interface ISubLettingData {
    sections: ISubletSection[];
    allSectionTotalArea: number;
    vendorDetails: IVendorDetails;
}


interface SublettingTemplateProps {
    initialData: ISubLettingData;
    // onAutoSave triggers the debounced API call in the parent
    onAutoSave: (data: ISubLettingData, finalTotal: number) => void;
    isReadOnly?: boolean;
    isSubmitting?: boolean;
}


const SublettingTemplate: React.FC<SublettingTemplateProps> = ({ initialData, onAutoSave, isReadOnly, isSubmitting }: any) => {

    const [data, setData] = useState(initialData || {
        sections: [{ sectionName: "Section 1", height: 0, width: 0, totalArea: 0 }],
        vendorDetails: { vendorName: "", worktimeline: 0, sqftRate: 0, finalQuoteRate: 0 },
        allSectionTotalArea: 0
    });

    const calculateTotals = (currentData: any) => {
        const sections = currentData.sections.map((s: any) => ({
            ...s,
            totalArea: (Number(s.height) || 0) * (Number(s.width) || 0)
        }));

        const allSectionTotalArea = sections.reduce((acc: number, curr: any) => acc + curr.totalArea, 0);
        const finalQuoteRate = allSectionTotalArea * (Number(currentData.vendorDetails.sqftRate) || 0);

        return {
            ...currentData,
            sections,
            allSectionTotalArea,
            vendorDetails: { ...currentData.vendorDetails, finalQuoteRate }
        };
    };

    const handleSectionChange = (index: number, field: string, value: any) => {
        if (isReadOnly) return;
        const newSections = [...data.sections];
        newSections[index][field] = value;
        const updated = calculateTotals({ ...data, sections: newSections });
        setData(updated);
        // onAutoSave(updated, updated.vendorDetails.finalQuoteRate);
    };

    const addSection = () => {
        const updated = {
            ...data,
            sections: [...data.sections, { sectionName: `Section ${data.sections.length + 1}`, height: 0, width: 0, totalArea: 0 }]
        };
        setData(updated);
    };

    const removeSection = (index: number) => {
        const newSections = data.sections.filter((_: any, i: number) => i !== index);
        const updated = calculateTotals({ ...data, sections: newSections });
        setData(updated);
        // onAutoSave(updated, updated.vendorDetails.finalQuoteRate);
    };

    // Manual Save Handler
    const handleManualSave = () => {
        onAutoSave(data, data.vendorDetails.finalQuoteRate);
    };

    return (
        <div className="grid grid-cols-12 gap-6 p-1 bg-white rounded-xl animate-in fade-in duration-300">

            {/* LEFT: AREA CALCULATOR (Fixed Height with Internal Scroll) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col border border-slate-200 rounded-xl overflow-hidden h-[600px]">
                {/* <header className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-calculator text-slate-400 text-lg"></i>
                        <h3 className="text-[15px] font-semibold text-slate-900 uppercase tracking-tight">Area Calculator</h3>
                    </div>
                </header> */}

                <header className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                            <i className="fas fa-calculator text-blue-400 text-sm"></i>
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-white uppercase tracking-wider leading-none">Area Calculator</h3>
                            <p className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">Dimension Engineering</p>
                        </div>
                    </div>
                    {/* Optional: Add a small badge for the current section count */}
                    <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-slate-600">
                        {data.sections.length} Sections
                    </span>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-white">
                    {data.sections.map((sec: any, idx: number) => (


                        <div key={idx} className="flex items-end gap-4 group animate-in slide-in-from-left-2 pb-2 border-b border-slate-50 last:border-0">
                            {/* Editable Section Name - Using a darker slate for high contrast without bolding */}
                            <div className="flex-1">
                                <label className="text-[11px] font-medium text-slate-400 mb-1 block uppercase tracking-tight">Section Label</label>
                                <input
                                    className="w-full bg-transparent border-b border-slate-100 hover:border-blue-300 focus:border-blue-500 py-1.5 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-300"
                                    placeholder="e.g., Main Wall"
                                    value={sec.sectionName}
                                    onChange={(e) => handleSectionChange(idx, 'sectionName', e.target.value)}
                                />
                            </div>

                            {/* Measurement Inputs - Subtle background to define the touch area */}
                            <div className="w-28">
                                <label className="text-[11px] font-medium text-slate-400 mb-1 block uppercase tracking-tight text-center">Length (ft)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[14px] text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all text-center font-medium"
                                    value={sec.width || ""}
                                    onChange={(e) => handleSectionChange(idx, 'width', e.target.value)}
                                />
                            </div>

                            <div className="w-28">
                                <label className="text-[11px] font-medium text-slate-400 mb-1 block uppercase tracking-tight text-center">Height (ft)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[14px] text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all text-center font-medium"
                                    value={sec.height || ""}
                                    onChange={(e) => handleSectionChange(idx, 'height', e.target.value)}
                                />
                            </div>

                            {/* Area Result - Using blue color to signify it is a calculated value */}
                            <div className="w-24 text-right px-2">
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mb-2 text-center">Area</p>
                                <p className="text-[15px] font-medium text-blue-600 leading-none py-2 text-center bg-blue-50/30 rounded-lg">
                                    {sec.totalArea.toFixed(2)}
                                </p>
                            </div>

                            {/* Actions - Modern minimal icons */}
                            <button
                                onClick={() => removeSection(idx)}
                                className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all mb-0.5"
                                title="Remove Section"
                            >
                                <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    ))}
                </div>

                <footer className="bg-slate-50 border-t border-slate-100 p-4 shrink-0 flex justify-between items-center">
                    <Button
                        variant="secondary"
                        onClick={addSection}
                        className="h-10 text-[13px] text-slate-600 border-slate-200  shadow-sm"
                    >
                        <i className="fas fa-plus mr-2 text-blue-500"></i>
                        Add Area Section
                    </Button>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[13px] text-slate-500">Total Area:</span>
                        <span className="text-[18px] font-semibold text-slate-900">{data.allSectionTotalArea.toFixed(2)}</span>
                    </div>
                </footer>
            </div>

            {/* RIGHT: VENDOR DETAILS & EXECUTION */}
            <div className="col-span-12 lg:col-span-5 flex flex-col border
             border-slate-200 rounded-xl overflow-y-auto  max-h-[800px] bg-white">


                <header className="bg-slate-800 px-6 py-4 border-b border-slate-700 shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                            <i className="fas fa-user-tie text-blue-400 text-sm"></i>
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-white uppercase tracking-wider leading-none">Vendor Details</h3>
                            <p className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">Contractor & Commercials</p>
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] text-slate-600 ml-1">Vendor Name</label>
                            <input
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                value={data.vendorDetails.vendorName}
                                placeholder="Vendor / Contractor name"
                                onChange={(e) => setData({ ...data, vendorDetails: { ...data.vendorDetails, vendorName: e.target.value } })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] text-slate-600 ml-1">Work Timeline</label>
                            <input
                                type="text"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                value={data.vendorDetails.worktimeline || ""}
                                placeholder="Eg: 7 days from site handover"
                                onChange={(e) => setData({ ...data, vendorDetails: { ...data.vendorDetails, worktimeline: Number(e.target.value) } })}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <label className="text-[13px] text-blue-600 font-medium ml-1 mb-2 block tracking-tight">Rate per sq.ft (₹)</label>
                            <input
                                type="number"
                                className="w-full bg-blue-50/30 border border-blue-100 rounded-xl px-4 py-4 text-[20px] font-medium text-blue-700 outline-none focus:ring-2 focus:ring-blue-200 transition-all shadow-inner placeholder:text-blue-200"
                                value={data.vendorDetails.sqftRate || ""}
                                placeholder="Eg: 120"
                                onChange={(e) => {
                                    const updated = calculateTotals({ ...data, vendorDetails: { ...data.vendorDetails, sqftRate: e.target.value } });
                                    setData(updated);
                                    // onAutoSave(updated, updated.vendorDetails.finalQuoteRate);
                                }}
                            />
                        </div>
                    </div>


                    <div className="mt-3 pt-4 border-t border-slate-100 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[14px]">
                                <span className="text-slate-500">Total Area (sq.ft)</span>
                                <span className="text-slate-900 font-medium">{data.allSectionTotalArea.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <span className="text-slate-500">Rate (₹/sq.ft)</span>
                                <span className="text-slate-900 font-medium">{Number(data.vendorDetails.sqftRate).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[16px] pt-1">
                                <span className="text-slate-900 font-semibold uppercase tracking-tight">Final Quote (₹)</span>
                                <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                                    {data.vendorDetails.finalQuoteRate?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* MANUAL SAVE BUTTON */}
                        <Button
                            onClick={handleManualSave}
                            disabled={isReadOnly}
                            isLoading={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-[15px] font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-save"></i>
                            Save Sublet Quote
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SublettingTemplate;