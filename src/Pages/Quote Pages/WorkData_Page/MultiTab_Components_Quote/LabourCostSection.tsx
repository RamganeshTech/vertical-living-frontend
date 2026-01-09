import { useEffect, useState } from 'react';
import { useGetSingleLabourCostByCategoryName } from '../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi';


export interface ILabourData {
    noOfLabourers: number | string;
    totalArea: number | string;
    productivityPerLabour: number | string;
    suggestedDays: number | string;
    costPerLabour: number | string;
    profitPercentage: number | string;
    totalLabourCost: number; // This is the calculated final value
}


interface LabourCostSectionProps {
    // totalArea comes from the parent's state (usually from the Spec tab)
    organizationId: string,

    templateName: string,
    totalArea: number | Object;
    // initialData is the current labourData object from the parent's master state
    initialData: ILabourData;
    // onUpdate is the callback that triggers updateMasterState in the parent
    onUpdate: (data: any) => void;
}

export const LabourCostSection: React.FC<LabourCostSectionProps> = ({ organizationId, templateName, totalArea, initialData, onUpdate }) => {
    // 1. ENSURE totalArea is a number (it might be coming as an object {totalArea: X})
    console.log("totalArea", totalArea)
    // let sanitizedArea = typeof totalArea === 'object' ? Number(totalArea.totalArea) || 0 : Number(totalArea) || 0;
    const getInitialArea = () => {
        // const value = typeof totalArea === 'object' ? (totalArea as any)?.totalArea : totalArea;
        const value = totalArea;
        return Number(value) || 0;
    };


    const { data: salary = 0, } = useGetSingleLabourCostByCategoryName({ organizationId, categoryName: templateName })

    console.log("salary", salary)

    const [labourData, setLabourData] = useState<ILabourData>(initialData || {
        noOfLabourers: 0,
        productivityPerLabour: 0,
        suggestedDays: 0,
        totalArea: getInitialArea(),
        costPerLabour: salary,
        profitPercentage: 0,
        totalLabourCost: 0
    });


    // const [labourData, setLabourData] = useState<ILabourData>(initialData);



    // useEffect(() => {
    //     const specArea = getInitialArea();
    //     if (specArea > 0 && (labourData.totalArea === 0 || !labourData.totalArea)) {
    //         setLabourData((prev: any) => ({ ...prev, totalArea: specArea }));
    //     }
    // }, [totalArea]);

    // useEffect(() => {
    //     const area = Number(labourData.totalArea) || 0;
    //     const labourers = Number(labourData.noOfLabourers) || 0;
    //     const productivity = Number(labourData.productivityPerLabour) || 0;
    //     const costPerDay = Number(labourData.costPerLabour) || 0;
    //     const profitPct = Number(labourData.profitPercentage) || 0;

    //     // Auto-calculate Suggested Days based on Formula: Area / (Lab * Prod)
    //     let calculatedDays = labourData.suggestedDays;
    //     if (area > 0 && labourers > 0 && productivity > 0) {
    //         calculatedDays = Math.ceil(area / (labourers * productivity));
    //     }

    //     const baseLabourCost = labourers * calculatedDays * costPerDay;
    //     const totalWithProfit = baseLabourCost + (baseLabourCost * (profitPct / 100)) || 0;

    //     const updated = {
    //         ...labourData,
    //         suggestedDays: calculatedDays,
    //         totalLabourCost: totalWithProfit
    //     };

    //     // Prevent infinite loop by checking if values actually changed
    //     if (JSON.stringify(updated) !== JSON.stringify(labourData)) {
    //         setLabourData(updated);
    //         onUpdate(updated);
    //     }
    // }, [labourData.totalArea, labourData.noOfLabourers, labourData.productivityPerLabour, labourData.costPerLabour, labourData.profitPercentage]);


    useEffect(() => {
        // Sync local state whenever the parent sends new calculated data
        if (initialData) {
            setLabourData(initialData);
        }
    }, [initialData]);


    useEffect(() => {
        const currentVal = Number(labourData.costPerLabour);

        // Only auto-trigger if we have a salary and current input is effectively 0
        if (salary && (currentVal === 0 || !labourData.costPerLabour)) {
            const updated = {
                ...labourData,
                costPerLabour: salary
            };

            // We update local state first
            setLabourData(updated);

            // Use your standard parent call
            onUpdate(updated);
        }
        // We only watch salary so it doesn't fight the user's typing later
    }, [salary]);

    // 2. Manual Sync Function
    const handleSyncSalary = () => {
        if (salary) {
            const updated = {
                ...labourData,
                costPerLabour: salary
            };

            // Update local state
            setLabourData(updated);

            // Use your standard parent call
            onUpdate(updated);
        }
    };

    // useEffect(() => {
    //     // Only update if salary exists and the current cost is still 0/empty
    //     const currentCost = Number(labourData.costPerLabour);
    //     if (salary && (!currentCost || labourData.costPerLabour === 0)) {
    //         const updated = { 
    //             ...labourData, 
    //             costPerLabour: salary 
    //         };
    //         setLabourData(updated);

    //         // Crucial: Update the parent orchestrator so the calculation runs
    //         onUpdate({ labourData: { costPerLabour: salary } });
    //     }
    // }, [salary, initialData]); // Triggers when the API returns the 2000


    const handleInputChange = (field: string, value: string) => {
        // console.log("suggesteddays", field)
        // const updated = { ...labourData, [field]: value };
        // setLabourData(updated);

        // // Send the raw input to the parent; the parent's updateMasterState 
        // // will handle the math for totalLabourCost
        // onUpdate(updated);


        const numericValue = parseFloat(value);

        // If the user enters a negative number, force it to 0 or leave empty if they are deleting
        let sanitizedValue = value;
        if (numericValue < 0) {
            sanitizedValue = "0";
        }

        // 2. Update local state for the UI
        const updated = { ...labourData, [field]: sanitizedValue };
        setLabourData(updated);

        // 3. Send to parent
        // Note: We send ONLY the changed field to help the parent identify manual overrides
        onUpdate(updated);

    };

    return (
        <div className="p-8 space-y-4 animate-in fade-in duration-500">

            {/* Capacity & Output */}
            <div className="space-y-6 grid grid-cols-2 w-full  gap-x-12 gap-y-0">
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">No. of Labourers / Day</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none transition-all font-medium text-slate-700"
                        value={labourData.noOfLabourers || 0}
                        onChange={e => handleInputChange('noOfLabourers', e.target.value)}
                    />
                </div>

                {/* <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Cost per Labour / Day (₹)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-700"
                        value={labourData.costPerLabour}
                        onChange={e => handleInputChange('costPerLabour', e.target.value)}
                    />
                </div> */}


                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Cost per Labour / Day (₹)
                        </label>

                        {/* SYNC BUTTON: Appears only if data differs from standard */}
                        {salary && Number(labourData.costPerLabour) !== salary && (
                            <button
                                onClick={handleSyncSalary}
                                className="flex cursor-pointer items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-tighter hover:bg-blue-50 px-2 py-1 rounded-md transition-all"
                            >
                                <i className="fas fa-sync-alt"></i>
                                Sync {templateName} worker salary (₹{salary})
                            </button>
                        )}
                    </div>

                    <input
                        type="number"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-700"
                        value={labourData.costPerLabour}
                        onChange={e => handleInputChange('costPerLabour', e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Total Area (sq.ft)</label>
                    <input
                        type="number"
                        className="w-full cursor-not-allowed p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none"
                        // Ensure value is a number for display, fallback to empty string for clean typing
                        disabled={true}
                        value={labourData.totalArea || 0}
                        onChange={e => setLabourData({ ...labourData, totalArea: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Productivity (sq.ft / labour / day)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-700"
                        value={labourData.productivityPerLabour || 0}
                        onChange={e => handleInputChange('productivityPerLabour', e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Suggested Days</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-blue-600 outline-none"
                        value={labourData.suggestedDays || 0}
                        onChange={e => handleInputChange('suggestedDays', e.target.value)}

                    />
                </div>

                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Profit %</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-700"
                        value={labourData.profitPercentage || 0}
                        onChange={e => handleInputChange('profitPercentage', e.target.value)}
                    />
                </div>
            </div>

            {/* Total Display Card */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white flex justify-between items-center shadow-xl border border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <i className="fas fa-hammer text-blue-400"></i>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Final Calculation</p>
                        <span className="text-sm font-bold uppercase text-white tracking-widest">Total Labour Cost</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black tracking-tighter italic">₹{labourData.totalLabourCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
};