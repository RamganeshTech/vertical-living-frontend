import { useEffect, useMemo, useState } from "react";
import { useGetMaterialBrands } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { materialTypeOptions } from "../RateConfig Pages/RateConfigSub";

interface CategoryMaterialGroupProps {
    label: string;
    organizationId: string;
    units: any[];
    innerOptions: any[];
    outerOptions: any[];
    globalProfitPercentage: number;
    groupProfitMargins: Record<string, number>;
    updateGroupMargin: (label: string, value: number) => void;
    updateProductInstance: (roomId: string, rIdx: number, prodId: string, pIdx: number, updates: any) => void;
    transformBrands: (brands: any[]) => any[];
}

const CategoryMaterialGroup: React.FC<CategoryMaterialGroupProps> = ({
    label, organizationId, units, innerOptions, outerOptions,
    globalProfitPercentage, groupProfitMargins, updateGroupMargin,
    updateProductInstance, transformBrands
}) => {
    const [selectedMaterialType, setSelectedMaterialType] = useState("all");
    // ✅ Legal Hook Call: Dynamic Plywood/Category fetch
    const { data: specificMaterialData, isLoading } = useGetMaterialBrands(organizationId, label);

    // const plywoodOptions = useMemo(() => transformBrands(specificMaterialData), [specificMaterialData, transformBrands]);

    // 2. Filter Plywood Options based on selection
    // ADD THIS FORMATTER HELPER
    const formatTypeLabel = (opt: string) => opt.length <= 3 ? opt.toUpperCase() : opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase();

    // UPDATE PLYWOOD OPTIONS Logic
    const allPlywoodOptions = useMemo(() => transformBrands(specificMaterialData), [specificMaterialData, transformBrands]);

    // Master options based on the Master selector
    const masterPlywoodOptions = useMemo(() => {
        if (selectedMaterialType === "all") return allPlywoodOptions;
        return allPlywoodOptions.filter(b => b.materialType?.toLowerCase() === selectedMaterialType.toLowerCase());
    }, [allPlywoodOptions, selectedMaterialType]);


    const currentGroupMargin = groupProfitMargins[label] ?? globalProfitPercentage;

    // 1. Cleaner: Extract only digits from a string part
    const getOnlyDigits = (str: string) => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    };


    // 2. The Matcher: Finds the correct key in the dynamic data object
    const getDynamicRate = (materialData: any, unitH: number, unitW: number) => {
        const fallback = { rate: 0, key: null };
        if (!materialData) return fallback;

        const targetH = Number(unitH);
        const targetW = Number(unitW);

        // Look through all keys in the data object (e.g., "7 x 6", "6 ft h x 7 ft w")
        const foundKey = Object.keys(materialData).find(key => {
            // Split by 'x' to get the two dimension parts
            const parts = key.toLowerCase().split('x');
            if (parts.length !== 2) return false;

            const val1 = getOnlyDigits(parts[0]);
            const val2 = getOnlyDigits(parts[1]);

            if (val1 === null || val2 === null) return false;

            /**
             * FLEXIBLE MATCHING:
             * We check if (val1=H and val2=W) OR (val1=W and val2=H).
             * This handles cases where the user entered "Width x Height" 
             * instead of "Height x Width" in the Rate Config.
             */
            const matchStandard = (val1 === targetH && val2 === targetW);
            const matchFlipped = (val1 === targetW && val2 === targetH);

            return matchStandard || matchFlipped;
        });

        if (!foundKey) return fallback;

        // return foundKey ? Number(materialData[foundKey] || 0) : 0;
        return {
            rate: foundKey ? Number(materialData[foundKey] || 0) : 0,
            key: foundKey || null
        };
    };


    // Inside CategoryMaterialGroup component
    useEffect(() => {
        // Check if the first unit already has a saved plywoodType
        const savedType = units[0]?.details?.plywoodType;
        if (savedType) {
            setSelectedMaterialType(savedType);
        }
    }, [units]); // Runs when units data is loaded



    if (isLoading) return <div className="p-10 text-center animate-pulse text-slate-400">Loading {label} configurations...</div>;

    return (
        <div className="bg-white border-blue-600 border-l-8 rounded-[40px] p-8 space-y-6 shadow-sm">
            {/* 1. MASTER GROUP SELECTOR */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-indigo-100 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{label}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bulk update {label} units</p>
                </div>

                {/* <div className="flex items-end gap-4 pb-1"> */}
                <div className="flex lg:flex-row flex-wrap  items-end gap-4 pb-1 w-full lg:w-auto justify-start md:justify-end">

                    {/* <div className="flex gap-6 items-center"> */}

                    {/* ✅ NEW: Material Type Dropdown for the Group */}
                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <span className="text-[8px] font-black text-amber-500 uppercase ml-1 tracking-widest">Material Type</span>
                        <select
                            value={selectedMaterialType}
                            // onChange={(e) => setSelectedMaterialType(e.target.value)}

                            onChange={(e) => {
                                const newType = e.target.value;
                                setSelectedMaterialType(newType);

                                // Update all units to this type and clear their selected plywood brand
                                units.forEach(u => {

                                    // console.log("u in the gropued units", u)
                                    updateProductInstance(u.roomId, u.rIdx, u.prodId, u.pIdx, {
                                        plywoodType: newType, // Save the type
                                        plywoodId: "",        // Reset brand
                                        plywoodName: "",      // Reset name
                                        plywoodCost: 0        // Reset cost
                                    });
                                });
                            }}

                            className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500"
                        >
                            {materialTypeOptions.map(opt => (
                                <option key={opt} value={opt}>
                                    {formatTypeLabel(opt)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* </div> */}

                    {[
                        { k: 'plywood', l: 'Plywood', o: masterPlywoodOptions, c: 'indigo' },
                        { k: 'inner', l: 'Inner', o: innerOptions, c: 'emerald' },
                        { k: 'outer', l: 'Outer', o: outerOptions, c: 'amber' }
                    ].map(m => {
                        const hasOptions = m.o && m.o.length > 0;

                        return (
                            <div key={`master-${label}-${m.k}`} className="flex flex-col gap-1.5 min-w-[200px] max-w-[200px]">
                                <span className={`text-[8px] font-black text-${m.c}-500 uppercase ml-1 tracking-widest`}>
                                    Master {m.l}
                                </span>
                                <select
                                    className={`h-10 px-4 bg-white border ${!hasOptions ? 'border-amber-200' : 'border-slate-200'} rounded-xl text-[10px] font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500`}
                                    onChange={(e) => {
                                        const opt = m.o.find(o => o.id === e.target.value);
                                        if (!opt) return;

                                        units.forEach(u => {
                                            // const appliedCost = m.k === 'plywood'
                                            //     ? getDynamicRate(opt.data, u.details.h, u.details.w)
                                            //     : Number(opt.cost || 0);

                                            let finalCost = 0;

                                            if (m.k === 'plywood') {
                                                // ✅ Correctly extract the rate from the new object structure
                                                const result = getDynamicRate(opt.data, u.details.h, u.details.w);
                                                finalCost = result.rate;
                                            } else {
                                                // Inner/Outer laminates use the flat cost field
                                                finalCost = Number(opt.cost || 0);
                                            }

                                            updateProductInstance(u.roomId, u.rIdx, u.prodId, u.pIdx, {
                                                [`${m.k}Id`]: opt.id,
                                                [`${m.k}Name`]: opt.name,
                                                [`${m.k}Cost`]: finalCost,
                                                [`${m.k}Thickness`]: opt.thickness,
                                                [`${m.k}Rs`]: opt.rs
                                            });
                                        });
                                    }}
                                    value={selectedMaterialType}
                                >
                                    {hasOptions ? (
                                        <>
                                            <option value="">Apply {m.l} to all {label}s...</option>
                                            {/* {m.o.map(o => {
                                                const displayRate = m.k === 'plywood'
                                                    ? getDynamicRate(o.data, units[0].details.h, units[0].details.w)
                                                    : Number(o.cost || 0);

                                                return (
                                                    <option key={o.id} value={o.id}>
                                                        {o.name} | {o.thickness}mm | ₹{displayRate}/sqft
                                                    </option>
                                                );
                                            })} */}

                                            {m.o.map(o => {
                                                let displayRate = 0;
                                                // let matchedDimText = "";

                                                if (m.k === 'plywood') {
                                                    // Find the EXACT key from your backend data that matches current unit
                                                    // const foundKey = Object.keys(o.data || {}).find(key => {
                                                    //     const dims = extractDimFromKey(key);
                                                    //     return dims && dims.h === Number(units[0].details.h) && dims.w === Number(units[0].details.w);
                                                    // });

                                                    // if (foundKey) {
                                                    //     matchedDimText = ` | Match: ${foundKey}`;
                                                    //     displayRate = Number(o.data[foundKey] || 0);
                                                    // }

                                                    // ✅ We use the helper function here so it follows your matchStandard || matchFlipped logic
                                                    const result = getDynamicRate(o.data, units[0].details.h, units[0].details.w);
                                                    displayRate = result.rate;
                                                    // matchedDimText = result.key ? ` | Match: ${result.key}` : " | No Dim Match";

                                                } else {
                                                    displayRate = Number(o.cost || 0);
                                                }

                                                return (
                                                    <option key={o.id} value={o.id}>
                                                        {o.name} | {o.thickness}mm
                                                        {/* {matchedDimText ? matchedDimText : "| No Dim Match"} | ₹{displayRate}/sqft */}
                                                        {m.k === 'plywood' && (
                                                            <>
                                                                {/* {matchedDimText}  */}
                                                                | ₹{displayRate}/sqft
                                                            </>
                                                        )}
                                                    </option>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        // <>
                                        //     <option value="">Apply {m.l} to all {label}s...</option>
                                        //     {/* This looks like a message inside the dropdown */}
                                        //     <option disabled className="py-4 text-red-500 font-bold">
                                        //         ⚠️ NO {m.l.toUpperCase()} BRANDS CONFIGURED FOR THIS CATEGORY
                                        //     </option>
                                        //     <option disabled className="text-slate-400">
                                        //         (Please add materials in Rate Settings)
                                        //     </option>
                                        // </>

                                        <>
                                            <option value="">Apply {m.l} to all {label}s...</option>
                                            <option disabled>──────────────────────────────</option>
                                            {/* <option disabled>&nbsp;</option> */}
                                            <option disabled className="text-red-600 font-bold">
                                                NO {m.l.toUpperCase()} BRANDS FOUND
                                            </option>
                                            <option disabled className="text-red-600 font-bold">
                                                FOR PRODUCT: {label.toUpperCase()}
                                            </option>
                                            {/* <option disabled>&nbsp;</option> */}
                                            <option disabled className="text-slate-600">
                                                Action Required:
                                            </option>
                                            <option disabled className="text-slate-800">
                                                Please enter rates in your rate configuration (Pre sales) module.
                                            </option>
                                            {/* <option disabled>&nbsp;</option> */}
                                            <option disabled>──────────────────────────────</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        );
                    })}

                    <div className="flex flex-col gap-1.5 min-w-[120px] relative">
                        <span className="text-[8px] font-black text-indigo-500 uppercase ml-1 tracking-widest">Group Margin</span>
                        <input
                            type="number"
                            value={currentGroupMargin || ""}
                            onChange={(e) => updateGroupMargin(label, Math.max(0, Number(e.target.value)))}
                            className="w-full h-10 pl-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-500"
                        />
                        <div className="absolute right-3 bottom-2.5 pointer-events-none">
                            <span className="text-[8px] font-black text-indigo-300">PROFIT</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. INDIVIDUAL UNIT CARDS */}
            <div className="grid grid-cols-1 gap-6">
                {units.map(({ roomId, rIdx, prodId, pIdx, details, name }) => {
                    const materialArea = Number(details.h || 0) * Number(details.w || 0);
                    const totalRate = Number(details.plywoodCost || 0);
                    const profitMultiplier = 1 + (currentGroupMargin / 100);
                    const unitPrice = (materialArea * totalRate) * profitMultiplier;

                    return (
                        <div key={`${roomId}-${pIdx}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b">
                                <div className="flex items-center gap-3">
                                    <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase">{roomId}</span>
                                    <h4 className="text-sm font-bold text-slate-700 uppercase">{name}</h4>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-slate-400 uppercase tracking-tighter">Size</span>
                                        <span className="text-xs font-bold text-slate-700">{details.h}H × {details.w}W (FT)</span>
                                    </div>
                                    <span className="text-xl font-black text-emerald-600">₹{unitPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

                                {/* NEW: Individual Material Type Selector */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-black uppercase text-amber-500">Material Type</label>
                                    <select
                                        className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold "
                                        value={details.plywoodType || selectedMaterialType}
                                        onChange={(e) => {
                                            const newUnitType = e.target.value;
                                            updateProductInstance(roomId, rIdx, prodId, pIdx, {
                                                plywoodType: newUnitType,
                                                plywoodId: "", plywoodName: "", plywoodCost: 0 // Reset brand on type change
                                            });
                                        }}
                                    >
                                        {materialTypeOptions.map(opt => (
                                            <option key={opt} value={opt}>{formatTypeLabel(opt)}</option>
                                        ))}
                                    </select>
                                </div>


                                {[
                                    {
                                        k: 'plywood', l: 'Plywood', o: allPlywoodOptions.filter(b => {
                                            const unitType = details.plywoodType || selectedMaterialType;
                                            return unitType === "all" ? true : b.materialType?.toLowerCase() === unitType.toLowerCase();
                                        })
                                    },
                                    { k: 'inner', l: 'Inner Laminate', o: innerOptions },
                                    { k: 'outer', l: 'Outer Laminate', o: outerOptions }
                                ].map(m => {
                                    // ✅ Check if options exist for this specific material
                                    const hasOptions = m.o && m.o.length > 0;

                                    return (
                                        <div key={m.k} className="flex flex-col gap-2">
                                            <label className="text-[9px] font-black uppercase text-slate-500">{m.l}</label>
                                            <select
                                                className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold"
                                                value={details[`${m.k}Id`] || ""}
                                                onChange={(e) => {
                                                    const opt = m.o.find((x: any) => x.id === e.target.value);
                                                    // const cost = m.k === 'plywood'
                                                    //     ? getDynamicRate(opt?.data, details.h, details.w)
                                                    //     : Number(opt?.cost || 0);


                                                    let finalCost = 0;
                                                    if (m.k === 'plywood') {
                                                        // ✅ Use the helper to handle Standard vs Flipped matching
                                                        const result = getDynamicRate(opt?.data, details.h, details.w);
                                                        finalCost = result.rate;
                                                    } else {
                                                        finalCost = Number(opt?.cost || 0);
                                                    }

                                                    updateProductInstance(roomId, rIdx, prodId, pIdx, {
                                                        [`${m.k}Id`]: opt?.id,
                                                        [`${m.k}Name`]: opt?.name,
                                                        // [`${m.k}Cost`]: cost,
                                                        [`${m.k}Cost`]: finalCost,
                                                        [`${m.k}Thickness`]: opt?.thickness,
                                                        [`${m.k}Rs`]: opt?.rs
                                                    });
                                                }}
                                            >
                                                {/* <option value="">Select Brand</option> */}
                                                {/* {m.o.map((o: any) => {
                                                // Calculate the exact rate for THIS specific unit's dimensions
                                                const unitSpecificRate = m.k === 'plywood'
                                                    ? getDynamicRate(o.data, details.h, details.w)
                                                    : Number(o.cost || 0);

                                                return (
                                                    <option key={o.id} value={o.id}>
                                                        {o.name} | {o.thickness}mm | ₹{unitSpecificRate}/sqft
                                                    </option>
                                                );
                                            })} */}


                                                {hasOptions ? (
                                                    <>
                                                        <option value="">Select Brand</option>
                                                        {m.o.map(o => {
                                                            let displayRate = 0;
                                                            let matchedDimKey = null;

                                                            if (m.k === 'plywood') {
                                                                const result = getDynamicRate(o.data, details.h, details.w);
                                                                displayRate = result.rate;
                                                                matchedDimKey = result.key;
                                                            }

                                                            return (
                                                                <option key={o.id} value={o.id}>
                                                                    {o.name} | {o.thickness}mm
                                                                    {m.k === 'plywood' && (
                                                                        <>
                                                                            {matchedDimKey ? ` | Match: ${matchedDimKey}` : " | No Dimension matched"}
                                                                            | ₹{displayRate}/sqft
                                                                        </>
                                                                    )}
                                                                </option>
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    // ✅ FALLBACK: Show error messages if no brands are found
                                                    // <>
                                                    //     <option value="">Select Brand</option>
                                                    //     <option disabled>──────────────────────────────</option>
                                                    //     <option disabled className="text-red-600 font-bold">NO {m.l.toUpperCase()} BRANDS FOUND</option>
                                                    //     <option disabled className="text-red-600 font-bold text-[9px]">FOR CATEGORY: {label.toUpperCase()}</option>
                                                    //     <option disabled className="text-slate-800">Action Required: Add rates</option>
                                                    //     <option disabled className="text-slate-800">in Pre-Sales Rate Settings.</option>
                                                    //     <option disabled>──────────────────────────────</option>
                                                    // </>

                                                    <>
                                                        <option value="">Apply {m.l} to all {label}s...</option>
                                                        <option disabled>──────────────────────────────</option>
                                                        {/* <option disabled>&nbsp;</option> */}
                                                        <option disabled className="text-red-600 font-bold">
                                                            NO {m.l.toUpperCase()} BRANDS FOUND
                                                        </option>
                                                        <option disabled className="text-red-600 font-bold">
                                                            FOR PRODUCT: {label.toUpperCase()}
                                                        </option>
                                                        {/* <option disabled>&nbsp;</option> */}
                                                        <option disabled className="text-slate-600">
                                                            Action Required:
                                                        </option>
                                                        <option disabled className="text-slate-800">
                                                            Please enter rates in your rate configuration (Pre sales) module.
                                                        </option>
                                                        {/* <option disabled>&nbsp;</option> */}
                                                        <option disabled>──────────────────────────────</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default CategoryMaterialGroup