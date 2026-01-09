import React, { useState, type ChangeEvent } from 'react';
import { toast } from '../../../utils/toast';
import { WORK_TEMPLATE, type TemplateField } from './WorkDataTemplateMain';
// import { WORK_TEMPLATE, type WorkModule, type TemplateField } from './TemplateConfig';

interface DynamicFormProps {
    workType: string; // e.g., "glass"
}

const DynamicWorkTemplate: React.FC<DynamicFormProps> = ({ workType }) => {
    // 1. Find the specific template for the work type
    const activeModule = WORK_TEMPLATE.find(m => m.work === workType);

    // 2. Initialize state dynamically from the template
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        activeModule?.template.forEach(section => {
            section.fields.forEach(field => {
                // Set default values based on type
                initial[field.name] = field.type === 'number' ? 0 : (field.options ? field.options[0] : "");
            });
        });
        return initial;
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSave = () => {
        toast({ description: "Data Saved Successfully", title: "Success" });
        console.log("Final Submission Data:", formData);
    };

    if (!activeModule) return <div>Template not found.</div>;

    // --- Dynamic Calculations (Logic based on field presence) ---
    const height = formData['height'] || 0;
    const width = formData['width'] || 0;
    const panels = formData['panels'] || 0;
    const deduction = formData['deduction'] || 0;
    const panelArea = height * width;
    const totalArea = (panelArea * panels) - deduction;

    return (
        <div className="bg-[#f5f7fa] min-h-screen p-5">
            <div className="max-w-full mx-auto bg-white rounded-lg p-6 md:p-7 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                
                {/* HEADER */}
                <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-3 mb-5">
                    <h2 className="text-xl font-semibold m-0 flex items-center gap-2 uppercase">
                        <i className="fas fa-th-large text-blue-600"></i> {activeModule.work} Work Data Template
                    </h2>
                    {/* <span className="bg-[#e0f2fe] text-[#0369a1] px-[10px] py-1 rounded-[20px] text-xs font-bold">
                        Internal Quote · Draft
                    </span> */}
                </div>

                {/* DYNAMIC SECTIONS */}
                {activeModule.template.map((sec, sIdx) => (
                    <div key={sIdx} className="mb-[22px]">
                        <div className="font-semibold mb-[10px] text-[#1f2937] border-l-4 border-blue-500 pl-3">
                            {sec.section}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[14px]">
                            {sec.fields.map((field: TemplateField) => {
                                const isFullWidth = field.gridSpan === 3 || field.type === 'textarea';
                                
                                return (
                                    <div 
                                        key={field.name} 
                                        className={`flex flex-col gap-1 ${isFullWidth ? 'md:col-span-3 lg:col-span-4' : ''}`}
                                    >
                                        <label className="text-[13px] font-medium text-[#374151]">
                                            {field.label}
                                        </label>

                                        {/* RENDER SELECT */}
                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full p-2 rounded-md border border-[#d1d5db] text-sm bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                            >
                                                {field.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : field.type === 'textarea' ? (
                                            /* RENDER TEXTAREA */
                                            <textarea
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full p-2 rounded-md border border-[#d1d5db] text-sm resize-y outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            /* RENDER INPUT (TEXT/NUMBER) */
                                            <input
                                                name={field.name}
                                                type={field.type}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                readOnly={field.readOnly}
                                                className={`w-full p-2 rounded-md border border-[#d1d5db] text-sm outline-none focus:ring-1 focus:ring-blue-500 ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* CALC + STATUS PANEL (Displays only if dimensions exist in template) */}
                {formData['height'] !== undefined && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                        <div className="md:col-span-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 shadow-inner">
                            <h4 className="mt-0 text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
                                <i className="fas fa-calculator text-blue-500"></i> Auto Calculations
                            </h4>
                            <div className="space-y-2">
                                <div className="text-[13px] flex justify-between border-b border-gray-100 pb-1">
                                    <span>Panel Area:</span> 
                                    <strong className="text-blue-700">{panelArea.toFixed(2)} sqft</strong>
                                </div>
                                <div className="text-[13px] flex justify-between border-b border-gray-100 pb-1">
                                    <span>Total Area:</span> 
                                    <strong className="text-blue-700">{totalArea.toFixed(2)} sqft</strong>
                                </div>
                                <div className="text-[13px] flex justify-between">
                                    <span>Total Panels:</span> 
                                    <strong className="text-blue-700">{panels}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4">
                            <h4 className="mt-0 text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-yellow-500"></i> Feasibility
                            </h4>
                            <div className="space-y-2">
                                <div className="text-[12px] text-[#16a34a] flex items-center gap-2 font-medium">
                                    <i className="fas fa-check-circle"></i> System Feasible
                                </div>
                                {height > 12 && (
                                    <div className="text-[12px] text-orange-600 flex items-center gap-2 font-medium">
                                        <i className="fas fa-exclamation-circle animate-pulse"></i> Critical Height Reached
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-[25px] border-t pt-5">
                    <button onClick={handleSave} className="px-5 py-2 bg-gray-100 text-[#374151] font-bold rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        Save Draft
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 shadow-md transition-all active:scale-95">
                        Save & Create Revision
                    </button>
                    <button className="px-5 py-2 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-700 shadow-md transition-all flex items-center gap-2">
                        <i className="fas fa-plus"></i> Add Next Area
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DynamicWorkTemplate;