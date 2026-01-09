import { useState, type ChangeEvent } from "react";
import { WORK_TEMPLATE, type TemplateField } from "../WorkDataTemplateMain";

interface GlassTemplateProps {
    initialValues?: any;
    // onAutoSave?: (data: any, total: number) => void;
    onUpdate: any,
    isReadOnly?: boolean;
}

export const GlassTemplate: React.FC<GlassTemplateProps> = ({
    initialValues,
    // onAutoSave,
    onUpdate,
    isReadOnly
}) => {
    // 1. Fetch the 'glass' module from your global template configuration
    const activeModule = WORK_TEMPLATE.find(m => m.work === "glass");

    // 2. State initialized from props (initialValues) or defaults
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        activeModule?.template.forEach(section => {
            section.fields.forEach(field => {
                initial[field.name] = initialValues?.[field.name] ??
                    (field.type === 'number' ? 0 : (field.options ? field.options[0] : ""));
            });
        });
        return initial;
    });

    // 3. Technical Calculations specific to Glass Partitioning
    const calculateTotals = (currentData: Record<string, any>) => {
        const h = Number(currentData['height']) || 0;
        const w = Number(currentData['width']) || 0;
        const p = Number(currentData['panels']) || 0;
        const d = Number(currentData['deduction']) || 0;

        const panelArea = h * w;
        const totalArea = (panelArea * p) - d;
        return { panelArea, totalArea, h };
    };

    const { panelArea, totalArea } = calculateTotals(formData);

    // 4. Change Handler with Auto-Save integration
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (isReadOnly) return;
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;

        const updatedData = { ...formData, [name]: val };
        setFormData(updatedData);

        // Trigger parent mutation for Google Docs-style real-time saving
        const totalArea = calculateTotals(updatedData);
        // onAutoSave(updatedData, totals.totalArea);
        onUpdate(updatedData, totalArea);
    };

    if (!activeModule) return <div className="p-10 text-center">Glass Template Configuration Not Found.</div>;

    return (
        <div className="bg-[#f5f7fa] w-full">
            <div className="max-w-full mx-auto bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100">

                {/* HEADER SECTION */}
                {/* <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-4 mb-6">
                    <h2 className="text-xl font-bold m-0 flex items-center gap-3 text-slate-800 uppercase tracking-tighter">
                        <i className="fas fa-border-all text-blue-600"></i> {activeModule.work} Template
                    </h2>
                </div> */}
                    {/* <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase border border-blue-100">
                            Auto-Saving Active
                        </span>
                    </div> */}

                {/* DYNAMIC SECTIONS FROM TEMPLATE */}
                {activeModule.template.map((sec, sIdx) => (
                    <div key={sIdx} className="mb-8 last:mb-0">
                        <div className="font-black mb-4 text-[11px] text-blue-600 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-blue-600 rounded-full"></span>
                            {sec.section}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {sec.fields.map((field: TemplateField) => {
                                const isFullWidth = field.gridSpan === 3 || field.type === 'textarea';

                                return (
                                    <div
                                        key={field.name}
                                        className={`flex flex-col gap-1.5 ${isFullWidth ? 'md:col-span-3 lg:col-span-4' : ''}`}
                                    >
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight px-1">
                                            {field.label}
                                        </label>

                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                disabled={isReadOnly}
                                                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
                                            >
                                                {field.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : field.type === 'textarea' ? (
                                            <textarea
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                disabled={isReadOnly}
                                                rows={2}
                                                className="w-full p-3 rounded-lg border border-gray-200 text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none"
                                            />
                                        ) : (
                                            <input
                                                name={field.name}
                                                type={field.type}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                readOnly={field.readOnly || isReadOnly}
                                                className={`w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all ${field.readOnly ? 'bg-gray-100 italic cursor-not-allowed' : ''}`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* TECHNICAL ANALYSIS & CALCULATION PANEL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 pt-8 border-t border-dashed border-gray-200">
                    {/* Measurement Summary */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-blue-500"></i> Area Summary
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-white pb-2">
                                <span className="text-slate-500">Single Panel Area:</span>
                                <span className="font-bold text-slate-800">{panelArea.toFixed(2)} sqft</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-700 font-bold">Total Net Area:</span>
                                <span className="text-xl font-black text-blue-600">{totalArea.toFixed(2)} sqft</span>
                            </div>
                        </div>
                    </div>

                    {/* Engineering Feasibility */}
                    {/* <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Feasibility Analysis</h4>
                        <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${currentHeight > 12 ? 'bg-red-500' : 'bg-green-500'} shadow-lg`}>
                                <i className={`fas ${currentHeight > 12 ? 'fa-exclamation-triangle' : 'fa-check-double'}`}></i>
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-none">
                                    {currentHeight > 12 ? 'Structural Warning' : 'Installation Safe'}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-tighter">
                                    {currentHeight > 12 
                                        ? 'Height exceeds standard 12ft limit. Review structural beam support.' 
                                        : 'Standard partition parameters met.'}
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

