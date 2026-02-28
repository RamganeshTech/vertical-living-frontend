import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';
import { toast } from '../../../../utils/toast';
import { useUpdateSqftInternalQuote } from '../../../../apiList/Quote Api/Internal_Quote_Api/internalquoteApi';
import CreateQuoteModal from './InternalQuote_New_Version/CreateQuoteModal';
import { useGetItemsByMaterialWithLabourRateConfigCategory, useGetMaterialWithLabourRateConfigCategories } from '../../../../apiList/Quote Api/RateConfig Api/rateConfigLabourwithMaterialApi';
import { useDebounce } from '../../../../Hooks/useDebounce';

interface Props {
    data: any;
    id: string;
    organizationId: string;
    projectData: any[]
}

const SqftRateInternalWork: React.FC<Props> = ({ data, id, organizationId, projectData }) => {
    const navigate = useNavigate();


    const { data: allmaterialWithLabour, } = useGetMaterialWithLabourRateConfigCategories(organizationId)
    const firstCategoryId = allmaterialWithLabour?.[0]?._id || null;
    const { data: allworkDetails } = useGetItemsByMaterialWithLabourRateConfigCategory(organizationId, firstCategoryId)

    // Inside SqftRateInternalWork component
    const workLibrary = React.useMemo(() => {
        if (!allworkDetails || !Array.isArray(allworkDetails)) return [];

        return allworkDetails.map((item: any) => ({
            _id: item._id,
            // Mapping 'work type' and 'Rs' from your DB structure
            workType: item.data?.['work type'] || item.categoryName || "Unknown Work",
            rs: Number(item.data?.Rs) || 0,
            categoryId: item.categoryId
        }));
    }, [allworkDetails]);


    const defaultWork = {
        workType: "",
        workId: null,
        sqftRate: 0,
        sections: [],
        totalArea: 0,
        profit: 0,
        totalCost: 0
    }





    // --- STATE MANAGEMENT ---
    // Flattened: We only manage an array of works directly
    const [works, setWorks] = useState<any[]>(() => {
        const existingWorks = data?.sqftRateWork;
        if (existingWorks && existingWorks.length > 0) return existingWorks;
        return [defaultWork];
    });

    const [globalProfit, setGlobalProfit] = useState(data?.globalProfitPercent || 0);
    const [isMainModalOpen, setMainModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        mainQuoteName: data?.mainQuoteName || "",
        quoteCategory: data?.quoteCategory || "",
        quoteType: data?.quoteType || "sqft_rate",
        projectId: data?.projectId?._id || data?.projectId
    });


    // 1. Setup debounced values for state that triggers a save
    const debouncedWorks = useDebounce(works, 500);
    const debouncedGlobalProfit = useDebounce(globalProfit, 500);




    // 2. The Auto-Save Effect
    useEffect(() => {
        // Prevent saving if it's the initial empty state or if still loading
        const validWorks = works.filter((w: any) => w.workId !== null);
        if (validWorks.length === 0) return;

        const triggerAutoSave = async () => {
            // Call handleSave with a 'false' flag to indicate it's a non manual background save
            await handleSave(false);
        };

        triggerAutoSave();

        // This effect runs only when the user stops typing/changing values for 2 seconds
    }, [debouncedWorks, debouncedGlobalProfit]);

    const { mutateAsync: updateQuote, isPending: savePending } = useUpdateSqftInternalQuote();

    // --- LOGIC: Calculations ---
    const calculateTotals = (updatedWorks: any[], profitToApply?: number) => {
        const processed = updatedWorks.map(work => {
            const area = work.sections?.reduce((acc: number, sec: any) => acc + (sec.totalArea || 0), 0) || 0;
            const baseCost = area * (work.sqftRate || 0);
            // Apply global profit if provided, otherwise keep individual
            const currentProfit = profitToApply !== undefined ? profitToApply : (work.profit ?? globalProfit);
            //   const effectiveProfitPercent = (globalProfitPercent !== null && globalProfitPercent !== undefined)
            //     ? globalProfitPercent
            //     : (f.furnitureProfit || 0);

            const totalCost = baseCost + (baseCost * currentProfit / 100);

            return { ...work, totalArea: area, profit: currentProfit, totalCost };
        });
        setWorks(processed);
    };

    // 1. Global Profit Handler
    const handleGlobalProfitChange = (val: number) => {
        setGlobalProfit(val);

        // Spread the global value and explicitly reset all row-level profit to the global value
        const updatedWorks = works.map(work => ({
            ...work,
            profit: val // This clears manual edits and applies the new global
        }));

        calculateTotals(updatedWorks, val);
    };


    // 2. Individual Profit Change (Manual)
    const handleIndividualProfitChange = (wIdx: number, val: number) => {
        const up = [...works];
        up[wIdx].profit = val; // Manually update only this row
        calculateTotals(up); // Recalculate everything
    };


    const handleSave = async (isManualSave: boolean = false) => {

        // Filter out works that don't have a workId selected
        const validWorks = works.filter((w: any) => w.workId !== null)
        const grandTotal = validWorks.reduce((sum, w) => sum + (w.totalCost || 0), 0);

        // const grandTotal = cleanedRooms.reduce((acc, room) =>
        //     acc + room.works.reduce((sum: number, w: any) => sum + w.totalCost, 0), 0);

        try {
            await updateQuote({
                id,
                organizationId,
                projectId: formData.projectId,
                formData: {
                    sqftRateWork: validWorks,
                    grandTotal,
                    globalProfitPercent: globalProfit,
                    notes: "Updated via frontend"
                }
            });
            if (isManualSave) {
                toast({ title: "Success", description: "Quote saved successfully" });
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <div className="max-h-full overflow-y-auto flex flex-col h-full bg-slate-50">
            {/* --- HEADER --- */}
            <header className="bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors">
                            <i className="fas fa-arrow-left" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900">{data?.mainQuoteName}</h1>
                                <button
                                    onClick={() => {
                                        setFormData(() => {
                                            return {
                                                mainQuoteName: data?.mainQuoteName,
                                                quoteCategory: data?.quoteCategory,
                                                quoteType: data?.quoteType,
                                                projectId: data?.projectId
                                            }
                                        })
                                        setMainModalOpen(true)
                                    }
                                    }
                                    className="p-1.5 hidden text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                    <i className="fas fa-edit text-sm" />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Sqft Rate Mode • {data.quoteNo}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        {/* Global Profit Control */}
                        <div className="bg-blue-50/50 border border-blue-100 p-2 px-4 rounded-2xl flex items-center gap-3">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Global Profit</p>
                            <div className="flex items-center bg-white border border-blue-200 rounded-lg px-2 shadow-sm">
                                <input
                                    type="number"
                                    className="w-10 bg-transparent text-center font-black text-blue-700 outline-none h-8"
                                    value={globalProfit}
                                    onChange={(e) => handleGlobalProfitChange(Math.max(0, Number(e.target.value)))}
                                />
                                <span className="text-blue-300 font-bold text-[10px]">%</span>
                            </div>
                        </div>
                        <div className="text-right">


                            <div className="flex items-center justify-end gap-2 mb-1">
                                {savePending ? (
                                    <span className="text-[10px] text-blue-500 animate-pulse font-bold uppercase flex items-center">
                                        <i className="fas fa-sync fa-spin mr-1" /> Syncing...
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center">
                                        <i className="fas fa-check-circle mr-1 text-green-500" /> Saved
                                    </span>
                                )}
                            </div>


                            <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Grand Total Estimate</p>
                            <p className="text-3xl font-black text-green-600 leading-none">
                                {/* ₹{works.reduce((acc, work) => acc + room.works.reduce((sum: number, w: any) => sum + w.totalCost, 0), 0).toLocaleString()} */}
                                ₹{works.reduce((sum, w) => sum + (w.totalCost || 0), 0).toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => handleSave(true)} isLoading={savePending} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 min-w-[140px]">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </header >

            <main className="flex-1 p-8 overflow-visible">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 overflow-visible max-w-[1400px] mx-auto">
                    <div className="overflow-visible">
                        <table className="w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[11px] uppercase font-black text-slate-800 tracking-wider">
                                    <th className="text-left px-4 w-[35%]">Work Type <span className='text-slate-900'>*</span></th>
                                    <th className="text-left px-4">Rate/Sqft</th>
                                    <th className="text-left px-4">Area (Sqft)</th>
                                    <th className="text-left px-4">Profit %</th>
                                    <th className="text-right px-4">Subtotal</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {works.map((work: any, wIdx: number) => (
                                    <tr key={wIdx} className="group relative z-10 hover:z-20">
                                        <td className="px-2 py-1">
                                            <div className="relative min-w-[280px]">
                                                <SearchSelectNew
                                                    // options={workLibrary.map(w => ({ value: w._id, label: w.workType }))}
                                                    options={workLibrary.map(w => ({
                                                        value: w._id,
                                                        label: w.workType
                                                    }))}
                                                    value={work.workId}
                                                    onValueChange={(val) => {
                                                        // 1. Find the selected item from our library
                                                        const selectedItem = workLibrary.find(l => l._id === val);
                                                        const up = [...works];

                                                        // 2. Update the current work row with DB data
                                                        up[wIdx] = {
                                                            ...up[wIdx],
                                                            workId: val,
                                                            workType: selectedItem?.workType || "",
                                                            sqftRate: selectedItem?.rs || 0,
                                                            profit: globalProfit // Use current global profit for new selections
                                                        };

                                                        // 3. AUTO-ADD LOGIC: If this is the last row and user selected a value, 
                                                        // add a fresh empty row immediately.
                                                        if (wIdx === up.length - 1 && val) {
                                                            up.push({ ...defaultWork, profit: globalProfit });
                                                            // up.push({
                                                            //     workType: "",
                                                            //     workId: null,
                                                            //     sqftRate: 0,
                                                            //     sections: [],
                                                            //     totalArea: 0,
                                                            //     profit: 0,
                                                            //     totalCost: 0
                                                            // });
                                                        }

                                                        calculateTotals(up);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-1 font-bold text-slate-600">
                                                <span className="text-[10px] opacity-40">₹</span>
                                                {work.sqftRate}
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            <button
                                                onClick={() => setActiveSection(wIdx)}
                                                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all font-bold text-sm"
                                            >
                                                <i className="fas fa-calculator text-[10px] opacity-50" />
                                                {work.totalArea.toFixed(2)}
                                            </button>
                                        </td>
                                        <td className="px-4 py-1">
                                            <div className="relative w-20">
                                                {/* <Input
                                                    type="number"
                                                    className="h-9 font-bold text-center pr-5"
                                                    value={work.profit}
                                                    placeholder={`${globalProfit}`}
                                                    onChange={(e) => {
                                                        const up = [...works];
                                                        up[wIdx].works[wIdx].profit = Number(e.target.value);
                                                        calculateTotals(up);
                                                    }}
                                                /> */}

                                                <Input
                                                    type="number"
                                                    className="h-9 font-black text-center pr-6 border-slate-200 focus:border-blue-400"
                                                    // value={work.profit}
                                                    value={work.profit !== undefined ? work.profit : ""}
                                                    onChange={(e) => handleIndividualProfitChange(wIdx, Math.max(0, Number(e.target.value)))}
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-1 text-right font-black text-slate-900">
                                            ₹{work.totalCost.toLocaleString("en-in")}
                                        </td>
                                        <td className="px-4 py-1">
                                            <button onClick={() => {
                                                const up = works.filter((_, i) => i !== wIdx);
                                                // Ensure at least one empty row remains
                                                if (up.length === 0) up.push({ workType: "", workId: null, sqftRate: 0, sections: [], totalArea: 0, profit: globalProfit, totalCost: 0 });
                                                setWorks(up);
                                            }} className="text-red-500 cursor-pointer transition-opacity">
                                                <i className="fas fa-trash-alt" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 font-bold border-2 border-dashed border-blue-100 rounded-xl" onClick={() => {
                            setWorks([
                                ...works,
                                {
                                    workType: "",
                                    workId: null,
                                    sqftRate: 0,
                                    sections: [],
                                    totalArea: 0,
                                    profit: undefined, // Set to undefined so it falls back to global profit
                                    totalCost: 0
                                }
                            ]);
                        }}>
                            <i className="fas fa-plus-circle mr-2" /> Add Work
                        </Button>
                    </div>
                </div>
            </main >

            {
                isMainModalOpen && (
                    <CreateQuoteModal
                        isEditing={true}
                        formData={formData}
                        projectsData={projectData}
                        setModalOpen={setMainModalOpen}
                        setFormData={setFormData}
                        handleSubmit={() => setMainModalOpen(false)}
                    />
                )
            }

            {
                activeSection !== null && (
                    <SectionModal
                        work={works[activeSection]}
                        onClose={() => { calculateTotals(works); setActiveSection(null); }}
                        onUpdate={(updatedSections: any) => {
                            const up = [...works];
                            up[activeSection].sections = updatedSections;
                            setWorks(up);
                        }}
                    />
                )
            }
        </div >
    );
};

export default SqftRateInternalWork;

const SectionModal = ({ work, onClose, onUpdate }: any) => {
    const sections = work.sections || [];

    const addRow = () => {
        onUpdate([...sections, { height: 0, width: 0, multiplier: 1, totalArea: 0 }]);
    };


    // 2. DEFAULT ROW LOGIC: If modal opens and sections are empty, add one row immediately
    React.useEffect(() => {
        if (sections.length === 0) {
            onUpdate([{ height: 0, width: 0, multiplier: 1, totalArea: 0 }]);
        }
    }, []); // Runs once on mount

    const updateRow = (idx: number, field: string, value: number) => {
        // const up = [...sections];
        // up[idx][field] = value;
        // up[idx].totalArea = up[idx].height * up[idx].width * (up[idx].multiplier || 1);
        // onUpdate(up);

        const up = [...sections];
        up[idx][field] = value;
        up[idx].totalArea = up[idx].height * up[idx].width * (up[idx].multiplier || 1);

        // AUTO-ADD LOGIC: If user types in the last row, add a new one
        if (idx === up.length - 1 && value > 0) {
            up.push({ height: 0, width: 0, multiplier: 1, totalArea: 0 });
        }

        onUpdate(up);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b flex justify-between items-center bg-blue-600 rounded-t-[2rem]">
                    <div>
                        <h3 className="text-white font-black text-xl leading-none mb-1">Area Measurement</h3>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">{work.workType || "Calculation"}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <i className="fas fa-times text-xl" />
                    </button>
                </div>

                <div className="p-8 overflow-visible">
                    <table className="w-full border-separate border-spacing-y-3">
                        <thead className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="text-left px-2">Height / Length</th>
                                <th className="text-left px-2">Width / Breadth</th>
                                <th className="text-left px-2">Multiplier</th>
                                <th className="text-right px-2">Total Area</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((sec: any, i: number) => (
                                <tr key={i} className="group">
                                    <td className="px-2">
                                        <div className="relative">
                                            <Input type="number" value={sec.height} onChange={(e) => updateRow(i, 'height', Math.max(0, Number(e.target.value)))} className="h-11 w-full font-bold pl-8" />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">H</span>
                                        </div>
                                    </td>
                                    <td className="px-2">
                                        <div className="relative">
                                            <Input type="number" value={sec.width} onChange={(e) => updateRow(i, 'width', Math.max(0, Number(e.target.value)))} className="h-11 w-full font-bold pl-8" />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">W</span>
                                        </div>
                                    </td>
                                    <td className="px-2">
                                        <div className="relative">
                                            <Input type="number" value={sec.multiplier} onChange={(e) => updateRow(i, 'multiplier', Math.max(0, Number(e.target.value)))} className="h-11 w-full font-bold pl-8" />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">X</span>
                                        </div>
                                    </td>
                                    <td className="px-2 text-right">
                                        <span className="text-lg font-black text-blue-600">{sec.totalArea.toFixed(2)}</span>
                                        <span className="text-[10px] font-bold text-slate-300 ml-1">SQFT</span>
                                    </td>
                                    <td className="px-2 text-right">
                                        <button onClick={() => onUpdate(sections.filter((_: any, idx: number) => idx !== i))} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                                            <i className="fas fa-trash-alt" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-6">
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 font-bold px-4" onClick={addRow}>
                            <i className="fas fa-plus mr-2" /> Add Measurement
                        </Button>
                    </div>
                </div>

                <div className="p-8 border-t bg-slate-50 flex justify-between items-center rounded-b-[2rem]">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Total Square Footage</p>
                            <p className="text-2xl font-black text-slate-900 leading-none">
                                {sections.reduce((acc: any, s: any) => acc + s.totalArea, 0).toFixed(2)} <span className="text-sm font-bold text-slate-400">Sqft</span>
                            </p>
                        </div>
                    </div>
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 px-10 h-12 rounded-xl shadow-lg shadow-blue-100 font-bold">
                        Apply & Save
                    </Button>
                </div>
            </div>
        </div>
    );
};