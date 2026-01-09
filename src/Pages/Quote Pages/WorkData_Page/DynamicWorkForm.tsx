// import React from 'react';
// import { GlassTemplate } from './Templates/GlassTemplate';

// interface DynamicWorkFormProps {
//     templateName: string;
//     initialData: any;
//     onAutoSave: (data: any, total: number) => void;
// }

// // 1. The Component Map
// const TEMPLATE_COMPONENTS: Record<string, React.FC<any>> = {
//     glass: GlassTemplate,
//     // Add more as you build them
// };

// const DynamicWorkForm: React.FC<DynamicWorkFormProps> = ({
//     templateName,
//     initialData,
//     onAutoSave
// }) => {
//     // 2. Select the specific component
//     const SelectedComponent = TEMPLATE_COMPONENTS[templateName?.toLowerCase()];

//     if (!SelectedComponent) {
//         return <div className="p-10 text-center text-gray-400">Template {templateName} not found.</div>;
//     }

//     return (
//         <SelectedComponent
//             initialValues={initialData}
//             onAutoSave={onAutoSave}
//         />
//     );
// };

// export default DynamicWorkForm;




import React, { useState } from 'react';
import { GlassTemplate } from './Templates/GlassTemplate';
import { LabourCostSection, type ILabourData } from './MultiTab_Components_Quote/LabourCostSection';
import { MaterialCostSection, type IMaterialData } from './MultiTab_Components_Quote/MaterialCostSection';
import { GrandSummarySection } from './MultiTab_Components_Quote/GrandSummarySection';
import { useParams } from 'react-router-dom';
// import { Button } from '../../../components/ui/Button';


export interface IDynamicWorkState {
    // Technical specifications from the first tab
    templateSpecs: any;
    // Data for the Labour tab
    labourData: ILabourData;
    // Data for the Material tab
    materialData: IMaterialData;
    // The flat summary used for the final Grand Total and backend storage
    summary: {
        totalArea: number;
        labourCost: number;
        materialCost: number;
        totalTemplateCost: number;
    };
}

interface DynamicWorkFormProps {
    templateName: string;
    initialData: IDynamicWorkState;
    // onAutoSave sends the full state and numeric total to the API
    onAutoSave: (state: IDynamicWorkState, finalTotal: number) => void;
    isSubmitting: boolean;
}


const TEMPLATE_COMPONENTS: Record<string, React.FC<any>> = {
    glass: GlassTemplate,
    // future templates like 'plywood' will go here
};

const DynamicWorkForm: React.FC<DynamicWorkFormProps> = ({ templateName, initialData, onAutoSave, isSubmitting }) => {
    const [activeTab, setActiveTab] = useState<'spec' | 'labour' | 'material' | 'summary'>('spec');


    const { organizationId } = useParams() as { organizationId: string  }
    // Master state nested exactly as requested
    const [state, setState] = useState<IDynamicWorkState>(initialData || {
        templateSpecs: {},
        labourData: {
            noOfLabourers: 0,
            totalArea: 0,
            productivityPerLabour: 0,
            suggestedDays: 0,
            costPerLabour: 0,
            profitPercentage: 0,
            totalLabourCost: 0
        },
        materialData: { totalMaterialCost: 0, items: [] },
        summary: {
            totalArea: 0,
            labourCost: 0,
            materialCost: 0,
            totalTemplateCost: 0
        }
    });



    // Helper to calculate grand total across components
    const calculateGrandTotal = (currentState: any) => {
        return (Number(currentState.labourData?.totalLabourCost) || 0) +
            (Number(currentState.materialData?.totalMaterialCost) || 0);
    };

    // const handleSave = () => {
    //     const grandTotal = (state.labourData.totalLabourCost || 0) + (state.materialData.totalMaterialCost || 0);
    //     onAutoSave(state, grandTotal);
    // };

    // const updateMasterState = (changes: any) => {
    //     setState((prevState: any) => {
    //         const newState = { ...prevState, ...changes };

    //         // Calculate Global Template Cost (Labour + Material)
    //         const totalTemplateCost = (Number(newState.labourData?.totalLabourCost) || 0) +
    //             (Number(newState.materialData?.totalMaterialCost) || 0);

    //         // Sync the Summary Object
    //         newState.summary = {
    //             totalArea: newState.templateSpecs?.totalArea?.totalArea || newState?.summary?.totalArea,
    //             labourCost: newState.labourData?.totalLabourCost || 0,
    //             materialCost: newState.materialData?.totalMaterialCost || 0,
    //             totalTemplateCost: totalTemplateCost
    //         };

    //         // CRITICAL: This triggers your debounced useMutation hook in the parent
    //         onAutoSave(newState, totalTemplateCost);

    //         return newState;
    //     });
    // };


    // Inside DynamicWorkForm.tsx

    const updateMasterState = (changes: any) => {
        setState((prevState: any) => {
            // Create the new state with current changes
            const newState = { ...prevState, ...changes };

            // 1. Resolve the Numeric Area from the Spec Tab
            let numericArea = 0;
            const rawArea = newState.templateSpecs?.totalArea;
            numericArea = typeof rawArea === 'object' ? (Number(rawArea.totalArea) || 0) : (Number(rawArea) || 0);

            // 2. RE-CALCULATE LABOUR based on the new area
            const labourers = Number(newState.labourData?.noOfLabourers) || 0;
            const productivity = Number(newState.labourData?.productivityPerLabour) || 0;
            const costPerDay = Number(newState.labourData?.costPerLabour) || 0;
            const profitPct = Number(newState.labourData?.profitPercentage) || 0;

            // Auto-calculate Suggested Days using the formula from the spec
            let calculatedDays = newState.labourData?.suggestedDays || 0;
            if (numericArea > 0 && labourers > 0 && productivity > 0) {
                calculatedDays = Math.ceil(numericArea / (labourers * productivity));
            }

            const baseLabourCost = labourers * calculatedDays * costPerDay;
            const totalWithProfit = baseLabourCost + (baseLabourCost * (profitPct / 100));

            // Update the labourData object with fresh calculations
            newState.labourData = {
                ...newState.labourData,
                totalArea: numericArea, // Keep this synced
                suggestedDays: calculatedDays,
                totalLabourCost: totalWithProfit
            };

            // 3. Resolve Final Template Totals
            const materialCostVal = Number(newState.materialData?.totalMaterialCost) || 0;
            const finalTotal = totalWithProfit + materialCostVal;

            // 4. Sync Summary for Backend
            newState.summary = {
                totalArea: numericArea,
                labourCost: totalWithProfit,
                materialCost: materialCostVal,
                totalTemplateCost: finalTotal
            };

            // Trigger the parent's debounced API save
            onAutoSave(newState, finalTotal);

            return newState;
        });
    };


    const SelectedSpecTemplate = TEMPLATE_COMPONENTS[templateName?.toLowerCase()];


    if (!SelectedSpecTemplate) return <div>Template Not Found</div>;

    return (
        <div className="flex flex-col h-[700px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* MULTI-TAB NAVIGATION */}

            <header className=' flex gap-2 justify-between items-center px-4'>

                <nav className="flex bg-slate-50 border-b border-slate-200  pt-2 gap-1 shrink-0">
                    {['spec', 'labour', 'material', 'summary'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-t-xl transition-all ${activeTab === tab ? 'bg-white border-x border-t border-slate-200 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab === 'spec' ? `${templateName} Spec` : `${tab} Info`}
                        </button>
                    ))}
                </nav>


                {/* <div className=''>
                    <p className="text-[10px] font-black text-slate-900">
                        Grand Total: ₹{calculateGrandTotal(state).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div> */}

                {/* <div className="">
                    <div className="flex items-center gap-2 pr-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Total Template COST
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[11px] font-black text-blue-600">₹</span>
                            <p className="text-[15px] font-black text-slate-900 tracking-tighter tabular-nums">
                                {calculateGrandTotal(state).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    </div>

                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {isSubmitting ? <> <i className="fas fa-sync-alt mr-1 animate-spin text-blue-400"></i> Syncing  </> : <>Sync</>}
                    </span>
                </div> */}


                <div className="flex items-center gap-4 py-1">
                    {/* COST DISPLAY: Integrated and compact */}
                    <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                            Template Cost
                        </span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-bold text-blue-600">₹</span>
                            <p className="text-[14px] font-black text-slate-900 tracking-tighter tabular-nums">
                                {calculateGrandTotal(state).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    </div>

                    {/* SYNC STATUS: Small, unobtrusive indicator */}
                    <div className="flex items-center min-w-[60px]">
                        <span className="text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 transition-all duration-300">
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-circle-notch animate-spin text-blue-500"></i>
                                    <span className="text-blue-500">Syncing</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle text-emerald-500"></i>
                                    <span className="text-slate-400">Synced</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </header>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-y-auto bg-white">
                {activeTab === 'spec' && (
                    <SelectedSpecTemplate
                        initialValues={state.templateSpecs}
                        // onUpdate={(data: any, area: number) => updateMasterState({ templateData: data, totalArea: area })}
                        onUpdate={(data: any, area: number) => updateMasterState({
                            templateSpecs: { ...data, totalArea: area }
                        })}
                    />
                )}

                {activeTab === 'labour' && (
                    <LabourCostSection
                        templateName={templateName}
                        organizationId={organizationId}
                        totalArea={(state as any).totalArea}
                        initialData={state.labourData}
                        onUpdate={(data: any) => updateMasterState({ labourData: data })}
                    />
                )}

                {activeTab === 'material' && (
                    <MaterialCostSection
                        // initialData={state.materialData}
                        // onUpdate={(data: any) => setState({ ...state, materialData: data })}
                        initialData={state.materialData}
                        onUpdate={(data: any) => updateMasterState({ materialData: data })}
                    />
                )}

                {activeTab === 'summary' && (
                    // <GrandSummarySection
                    //     totalArea={state.totalArea}
                    //     labourTotal={state?.labourData?.totalLabourCost}
                    //     materialTotal={state.materialData?.totalMaterialCost}
                    // />

                    <GrandSummarySection
                        summaryData={state.summary}
                        spec={templateName}
                    />
                )}
            </div>

            {/* UNIFIED SAVE BUTTON AT THE BOTTOM */}
            {/* <footer className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-100">
                    <i className="fas fa-save mr-2"></i> Save All Sections
                </Button>
            </footer>
             */}

            {/* Optional: Status Indicator */}
            {/* <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <i className="fas fa-sync-alt mr-1 animate-spin text-blue-400"></i> Syncing all components...
                </span> */}
            {/* <footer className="p-2 px-4 bg-slate-50 border-t border-slate-100 flex justify-end items-center shrink-0">
                <p className="text-[10px] font-black text-slate-900">
                    Grand Total: ₹{calculateGrandTotal(state).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </footer> */}
        </div>
    );
};

export default DynamicWorkForm;