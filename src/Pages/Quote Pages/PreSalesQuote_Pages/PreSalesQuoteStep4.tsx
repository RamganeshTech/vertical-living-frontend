// import React from "react";
// import { Button } from "../../../components/ui/Button";
// // import { Button } from "../../../../components/ui/Button";

// // interface PreSalesQuoteStep4Props {
// //     config: any;
// //     PRODUCT_CATALOG: any;
// //     plywoodOptions: any[];
// //     innerOptions: any[];
// //     outerOptions: any[];
// //     globalPlywood: string;
// //     globalInner: string;
// //     globalOuter: string;
// //     updateAllProductsGlobally: (type: 'plywood' | 'inner' | 'outer', opt: any) => void;
// //     updateProductInstance: (roomId: string, rIdx: number, prodId: string, pIdx: number, updates: any) => void;
// //     handleUpdate: () => Promise<void>;
// //     setStep: (step: number) => void;
// //     updatePending: boolean;
// // }

// interface PreSalesQuoteStep4Props {
//     // Data Props
//     config: any;
//     PRODUCT_CATALOG: any; 
//     plywoodOptions: any[];
//     innerOptions: any[];
//     outerOptions: any[];
//     // State Props
//     globalPlywood: string;
//     globalInner: string;
//     globalOuter: string;
//     // Function Props
//     updateAllProductsGlobally: (type: 'plywood' | 'inner' | 'outer', opt: any) => void;
//     updateProductInstance: (roomId: string, rIdx: number, prodId: string, pIdx: number, updates: any) => void;
//     handleUpdate: () => Promise<void>;
//     setStep: (step: number) => void;
//     updatePending: boolean;
// }

// export const PreSalesQuoteStep4: React.FC<PreSalesQuoteStep4Props> = ({
//     config, PRODUCT_CATALOG, plywoodOptions, innerOptions, outerOptions,
//     globalPlywood, globalInner, globalOuter, updateAllProductsGlobally,
//     updateProductInstance, handleUpdate, setStep, updatePending
// }) => {

//     // Helper to get the correct Mfg Rate based on Product Type
//     const getMfgRateForProduct = (prodId: string, itemData: any) => {
//         const productKeyMap: Record<string, string> = {
//             "wardrobe": "Wardrobe",
//             "base_cabinets": "Kitchen",
//             "wall_cabinets": "Kitchen",
//             "pooja_unit": "Pooja Unit",
//             "tv_unit": "TV Unit",
//             "shoe_rack": "Shoe Rack",
//             "loft": "Loft",
//             "vanity_unit": "Vanity Unit"
//         };

//         const specificKey = productKeyMap[prodId.toLowerCase()];
//         // If specific key exists in material data, use it; otherwise use generic mfg cost
//         return Number(itemData?.[specificKey] || itemData?.manufacturCostPerSqft || 0);
//     };

//     return (
//         <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
//             {/* Global Selectors Header... (Keep your existing UI here) */}

//             <div className="space-y-4">
//                 {Object.entries(config).map(([roomId, roomInsts]: any) =>
//                     Object.entries(roomInsts).map(([rIdx, products]: any) =>
//                         Object.entries(products).map(([prodId, instances]: any) =>
//                             Object.entries(instances).map(([pIdx, details]: any) => {

//                                 const unitArea = Number(details.h || 0) * Number(details.w || 0);

//                                 // DYNAMIC CALCULATION: Sum costs based on product type
//                                 const plywoodRate = Number(details.plywoodCost || 0);
//                                 const innerRate = Number(details.innerCost || 0);
//                                 const outerRate = Number(details.outerCost || 0);

//                                 const unitPrice = unitArea * (plywoodRate + innerRate + outerRate);

//                                 return (
//                                     <div key={`${roomId}-${rIdx}-${prodId}-${pIdx}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                                         {/* Row Header with Calculated Price */}
//                                         <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b">
//                                             <div className="flex items-center gap-3">
//                                                 <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded">{roomId}</span>
//                                                 <h4 className="text-sm font-bold text-slate-700 uppercase">
//                                                     {PRODUCT_CATALOG[roomId]?.find((p:any) => p.id === prodId)?.name}
//                                                 </h4>
//                                             </div>
//                                             <div className="flex items-center gap-4">
//                                                 <span className="text-xs font-bold text-slate-500">{unitArea} SQFT</span>
//                                                 <span className="text-xl font-black text-emerald-600">₹{unitPrice.toLocaleString('en-IN')}</span>
//                                             </div>
//                                         </div>

//                                         {/* Material Selection Grid */}
//                                         <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//                                             {[
//                                                 { k: 'plywood', l: 'Plywood', o: plywoodOptions, color: 'indigo' },
//                                                 { k: 'inner', l: 'Inner Laminate', o: innerOptions, color: 'emerald' },
//                                                 { k: 'outer', l: 'Outer Laminate', o: outerOptions, color: 'amber' }
//                                             ].map(m => {
//                                                 const selectedId = details[`${m.k}Id`];
//                                                 return (
//                                                     <div key={m.k} className="flex flex-col gap-2">
//                                                         <label className="text-[9px] font-black uppercase text-slate-500">{m.l}</label>
//                                                         <select
//                                                             className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold"
//                                                             value={selectedId || ""}
//                                                             onChange={(e) => {
//                                                                 const opt = m.o.find((x:any) => x.id === e.target.value);
//                                                                 const isLaminate = m.k !== 'plywood';

//                                                                 // Apply Dynamic Rate Selection Logic
//                                                                 const appliedCost = isLaminate ? 0 : getMfgRateForProduct(prodId, opt?.data);

//                                                                 updateProductInstance(roomId, parseInt(rIdx), prodId, parseInt(pIdx), {
//                                                                     [`${m.k}Id`]: opt?.id,
//                                                                     [`${m.k}Name`]: opt?.data?.brand || opt?.name,
//                                                                     [`${m.k}Cost`]: appliedCost, // Dynamically selected rate
//                                                                     [`${m.k}Thickness`]: opt?.data?.thickness || opt?.thickness,
//                                                                     [`${m.k}Rs`]: opt?.data?.rs || opt?.rs
//                                                                 });
//                                                             }}
//                                                         >
//                                                             <option value="">Select Brand</option>
//                                                             {m.o.map((o:any) => (
//                                                                 <option key={o.id} value={o.id}>{o.name} | {o.thickness}mm</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )
//                     )
//                 )}
//             </div>

//             {/* Footer Actions */}
//             <div className="flex justify-end gap-3 pt-8 border-t">
//                 <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
//                 <Button isLoading={updatePending} onClick={async () => { await handleUpdate(); setStep(5); }}>
//                     Generate Quote <i className="fas fa-chevron-right ml-2 text-[7px]" />
//                 </Button>
//             </div>
//         </div>
//     );
// };





//  SECOND VERSION (LASTLY USED)


// import React, { useMemo } from "react";
// import { Button } from "../../../components/ui/Button";
// // import { calculateMaterialSqft } from "./PreSalesQuoteSingle";

// interface PreSalesQuoteStep4Props {
//     // Data Props
//     config: any;
//     PRODUCT_CATALOG: any;
//     plywoodOptions: any[];
//     innerOptions: any[];
//     outerOptions: any[];
//     // State Props
//     globalPlywood: string;
//     globalInner: string;
//     globalOuter: string;
//     // Function Props
//     updateAllProductsGlobally: (type: 'plywood' | 'inner' | 'outer', opt: any) => void;
//     updateProductInstance: (roomId: string, rIdx: number, prodId: string, pIdx: number, updates: any) => void;
//     handleUpdate: () => Promise<void>;
//     setStep: (step: number) => void;
//     updatePending: boolean;
//     globalProfitPercentage: number
//     setGlobalProfitPercentage: React.Dispatch<React.SetStateAction<number>>

//     groupProfitMargins: Record<string, number>
//     updateGroupMargin: any
// }




// export const PreSalesQuoteStep4: React.FC<PreSalesQuoteStep4Props> = ({
//     config, PRODUCT_CATALOG, plywoodOptions, innerOptions, outerOptions,
//     // globalPlywood, globalInner, globalOuter, updateAllProductsGlobally,
//     updateProductInstance, handleUpdate, setStep, updatePending,

//     globalProfitPercentage, setGlobalProfitPercentage,
//     groupProfitMargins, updateGroupMargin
// }) => {



//     // console.log("plywoodOptions", plywoodOptions)
//     // Helper to get the correct Mfg Rate based on Product Type
//     const getMfgRateForProduct = (prodId: string, roomId: string, itemData: any) => {

//         if (!itemData) return 0;

//         // console.log("itemData", itemData)

//         // 1. Find the product in your catalog using the roomId and prodId
//         const product = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);


//         // console.log("product", product)

//         // 2. Get the pre-defined lowercase label (e.g., "tv unit", "wardrobe")
//         const label = product?.label;

//         if (!label) {
//             // Fallback if no label is defined in catalog
//             // return Number(itemData?.manufacturCostPerSqft || 0);
//             return 0
//         }

//         // 3. Look for a key in the material data that matches the label
//         // We use includes() for flexibility, but since labels are lowercase, we compare lowercase
//         // const foundKey = Object.keys(itemData).find(key =>
//         //     key.toLowerCase().includes(label)
//         // );

//         // Look for a key in material data that matches our label exactly or via inclusion
//         const foundKey = Object.keys(itemData).find(key =>
//             key.toLowerCase() === label.toLowerCase() ||
//             key.toLowerCase().includes(label.toLowerCase())
//         );

//         if (foundKey) {
//             return Number(itemData[foundKey] || 0);
//         }

//         // 4. Final fallback to the general manufacturing cost
//         // return Number(itemData?.manufacturCostPerSqft || 0);
//         return 0;
//     };



//     // Inside PreSalesQuoteStep4 component
//     const groupedUnits = useMemo(() => {
//         const groups: Record<string, any[]> = {};

//         Object.entries(config).forEach(([roomId, roomInsts]: any) => {
//             Object.entries(roomInsts).forEach(([rIdx, products]: any) => {
//                 Object.entries(products).forEach(([prodId, instances]: any) => {
//                     // Get label from catalog
//                     const productDef = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
//                     const groupLabel = productDef?.name || "other";

//                     Object.entries(instances).forEach(([pIdx, details]: any) => {
//                         if (!groups[groupLabel]) groups[groupLabel] = [];
//                         groups[groupLabel].push({
//                             roomId, rIdx: parseInt(rIdx), prodId, pIdx: parseInt(pIdx), details, name: productDef?.name
//                         });
//                     });
//                 });
//             });
//         });
//         return groups;
//     }, [config, PRODUCT_CATALOG]);






//     return (
//         <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">

//             {/*  old one witout the master drop down */}



//             {/* PAGE HEADER */}
//             <div className="text-center mb-8">
//                 <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Technical Mapping & Valuation</h2>
//                 <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Select materials to see live unit pricing</p>
//             </div>


//             {/* GLOBAL PROFIT MARGIN CONTROL */}
//             <div className="bg-slate-900 p-6 rounded-[32px] flex items-center justify-between shadow-xl mb-10 border border-indigo-500/30">
//                 <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
//                         <i className="fas fa-chart-line text-lg" />
//                     </div>
//                     <div>
//                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Valuation</span>
//                         <h3 className="text-white font-bold uppercase tracking-tight">Profit Margin (%)</h3>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-2xl border border-slate-700">
//                     <input
//                         type="number"
//                         value={globalProfitPercentage || ""}
//                         // onChange={(e) => setGlobalProfitPercentage(Math.max(0,Number(e.target.value)))}

//                         onChange={(e) => {
//                             const newVal = Math.max(0, Number(e.target.value));

//                             // 1. Update the Global State
//                             setGlobalProfitPercentage(newVal);

//                             // 2. Loop through every group currently in your state and update them
//                             // This makes sure the "Calculation Engine" sees the same value everywhere
//                             Object.keys(groupProfitMargins).forEach((groupLabel) => {
//                                 updateGroupMargin(groupLabel, newVal);
//                             });
//                         }}

//                         className="w-20 bg-transparent text-white text-center font-black text-xl outline-none"
//                         placeholder="0"
//                     />
//                     <span className="text-indigo-400 font-black text-xl mr-2">%</span>
//                 </div>
//             </div>





//             <div className="space-y-16">
//                 {Object.entries(groupedUnits).map(([label, units]) => {


//                     const currentGroupMargin = groupProfitMargins[label] ?? globalProfitPercentage;

//                     return (
//                         <div key={label} className="bg-white border-blue-600 border-l-8 rounded-[40px] p-8   space-y-6 shadow-sm">

//                             {/* 1. MASTER GROUP SELECTOR SECTION */}
//                             <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-indigo-100 shadow-sm">
//                                 <div>
//                                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{label}</h3>
//                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bulk update all {label}
//                                         {/* {units.length}  */}
//                                         units</p>
//                                 </div>

//                                 <div className="flex items-end gap-4 pb-1">
//                                     {[
//                                         { k: 'plywood', l: 'Plywood', o: plywoodOptions, c: 'indigo' },
//                                         { k: 'inner', l: 'Inner', o: innerOptions, c: 'emerald' },
//                                         { k: 'outer', l: 'Outer', o: outerOptions, c: 'amber' }
//                                     ].map(m => (
//                                         <div key={`master-${label}-${m.k}`} className="flex flex-col gap-1.5 min-w-[200px]">
//                                             <span className={`text-[8px] font-black text-${m.c}-500 uppercase ml-1 tracking-widest`}>
//                                                 Master {m.l}
//                                             </span>
//                                             <select
//                                                 // className={`h-10 px-4  border-none rounded-xl text-[10px] font-bold  outline-none cursor-pointer`}
//                                                 className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 transition-all"
//                                                 onChange={(e) => {
//                                                     const opt = m.o.find(o => o.id === e.target.value);
//                                                     if (!opt) return;

//                                                     units.forEach(u => {
//                                                         // Use dynamic rate for Plywood, flat cost for Laminates
//                                                         const appliedCost = m.k === 'plywood'
//                                                             ? getMfgRateForProduct(u.prodId, u.roomId, opt.data)
//                                                             : Number(opt.cost || 0);

//                                                         updateProductInstance(u.roomId, u.rIdx, u.prodId, u.pIdx, {
//                                                             [`${m.k}Id`]: opt.id,
//                                                             [`${m.k}Name`]: opt.name,
//                                                             [`${m.k}Cost`]: appliedCost,
//                                                             [`${m.k}Thickness`]: opt.thickness,
//                                                             [`${m.k}Rs`]: opt.rs
//                                                         });
//                                                     });
//                                                 }}
//                                             >
//                                                 <option value="" className="text-slate-800">Apply {m.l} to all {label}s...</option>


//                                                 {m.o.map(o => {
//                                                     const rateLabel = m.k === 'plywood'
//                                                         ? ` | ₹${getMfgRateForProduct(units[0].prodId, units[0].roomId, o.data)}/sqft`
//                                                         : "";
//                                                     return (
//                                                         <option key={o.id} value={o.id} className="py-2 text-slate-800">
//                                                             {o.name} | {o.thickness}mm {rateLabel}
//                                                         </option>
//                                                     );
//                                                 })}
//                                             </select>
//                                         </div>
//                                     ))}


//                                     {/* <div className="flex flex-col">
//                                         <span className="text-[8px] font-black text-slate-400 uppercase ml-1">Group Margin</span>
//                                         <div className="flex items-center">
//                                             <input
//                                                 type="number"
//                                                 value={currentGroupMargin || ""}
//                                                 onChange={(e) => updateGroupMargin(label, Number(e.target.value))}
//                                                 className="w-12 bg-transparent text-indigo-600 font-black text-sm border rounded-md outline-none text-right"
//                                             // className="w-20 bg-transparent text-white text-center font-black text-xl outline-none"

//                                             />
//                                             <span className="text-indigo-400 text-xs font-bold ml-1">%</span>
//                                         </div>
//                                     </div> */}


//                                     <div className="flex flex-col gap-1.5 min-w-[10px]">
//                                         <span className="text-[8px] font-black text-indigo-500 uppercase ml-1 tracking-widest">
//                                             Group Margin
//                                         </span>

//                                         <div className="flex items-center">
//                                             {/* Percentage Icon Overlay */}


//                                             <input
//                                                 type="number"
//                                                 value={currentGroupMargin || ""}
//                                                 onChange={(e) => updateGroupMargin(label, Math.max(0, Number(e.target.value)))}
//                                                 className="w-full h-10 pl-4 text-gray-800 pr-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-500 transition-all shadow-sm hover:bg-slate-50"
//                                                 placeholder="0"
//                                             />

//                                             {/* Unit Label Overlay */}
//                                             <div className="absolute right-3 flex items-center pointer-events-none">
//                                                 <span className="text-[8px] font-black text-indigo-300">PROFIT</span>
//                                             </div>
//                                         </div>
//                                     </div>


//                                 </div>
//                             </section>


//                             {/* LIST OF INDIVIDUAL UNITS IN THIS GROUP */}
//                             <div className="grid grid-cols-1 gap-6">
//                                 {units.map(({ roomId, rIdx, prodId, pIdx, details, name }) => {
//                                     // const materialArea = calculateMaterialSqft(details, prodId);
//                                     // Simple Area = Height * Width
//                                     const materialArea = Number(details.h || 0) * Number(details.w || 0);
//                                     const totalRate = Number(details.plywoodCost || 0)
//                                     //  + Number(details.innerCost || 0) + Number(details.outerCost || 0);

//                                     // const unitPrice = materialArea * totalRate;

//                                     const profitMultiplier = 1 + (currentGroupMargin / 100);
//                                     const unitPrice = (materialArea * totalRate) * profitMultiplier;

//                                     return (
//                                         <div key={`${roomId}-${rIdx}-${prodId}-${pIdx}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                                             {/* Sub-Header for Individual Unit */}
//                                             <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b">
//                                                 <div className="flex items-center gap-3">
//                                                     <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase">{roomId}</span>
//                                                     <h4 className="text-sm font-bold text-slate-700 uppercase">{name}</h4>
//                                                 </div>
//                                                 <div className="flex items-center gap-6">
//                                                     {/* <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
//                                                     {materialArea.toFixed(1)} Material SQFT
//                                                 </span> */}

//                                                     <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
//                                                         <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
//                                                             <i className="fas fa-arrows-alt text-xs" />
//                                                         </div>
//                                                         <div className="flex flex-col">
//                                                             <span className="text-[12px] font-black text-slate-400 uppercase tracking-tighter">Size (FT)</span>
//                                                             <span className="text-xs font-bold text-slate-700 leading-none">
//                                                                 <span className="text-emerald-600">{details.h}H</span>
//                                                                 <span className="mx-1 text-slate-300">×</span>
//                                                                 <span className="text-amber-600">{details.w}W</span>
//                                                             </span>
//                                                         </div>
//                                                     </div>


//                                                     <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
//                                                         <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
//                                                             <i className="fas fa-vector-square text-xs" />
//                                                         </div>
//                                                         <div className="flex flex-col">
//                                                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Area</span>
//                                                             <span className="text-xs font-bold text-slate-700 leading-none">
//                                                                 {Number(details.h || 0) * Number(details.w || 0)} <span className="text-[9px] text-slate-400">SQFT</span>
//                                                             </span>
//                                                         </div>
//                                                     </div>




//                                                     <span className="text-xl font-black text-emerald-600">₹{unitPrice.toLocaleString('en-IN')}</span>
//                                                 </div>
//                                             </div>

//                                             {/* Local Selection Logic */}
//                                             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//                                                 {[
//                                                     { k: 'plywood', l: 'Plywood', o: plywoodOptions, color: 'indigo' },
//                                                     { k: 'inner', l: 'Inner Laminate', o: innerOptions, color: 'emerald' },
//                                                     { k: 'outer', l: 'Outer Laminate', o: outerOptions, color: 'amber' }
//                                                 ].map(m => (
//                                                     <div key={m.k} className="flex flex-col gap-2">
//                                                         <label className="text-[9px] font-black uppercase text-slate-500">{m.l}</label>
//                                                         <select
//                                                             className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold"
//                                                             value={details[`${m.k}Id`] || ""}
//                                                             onChange={(e) => {
//                                                                 const opt = m.o.find((x: any) => x.id === e.target.value);
//                                                                 const isPlywood = m.k === 'plywood';
//                                                                 const appliedCost = isPlywood ? getMfgRateForProduct(prodId, roomId, opt?.data) : Number(opt?.cost || 0);

//                                                                 updateProductInstance(roomId, rIdx, prodId, pIdx, {
//                                                                     [`${m.k}Id`]: opt?.id,
//                                                                     [`${m.k}Name`]: opt?.name,
//                                                                     [`${m.k}Cost`]: appliedCost,
//                                                                     [`${m.k}Thickness`]: opt?.thickness,
//                                                                     [`${m.k}Rs`]: opt?.rs
//                                                                 });
//                                                             }}
//                                                         >
//                                                             <option value="" className="text-slate-800">Select Brand</option>
//                                                             {m.o.map((o: any) => {
//                                                                 const displayRate = m.k === 'plywood' ? getMfgRateForProduct(prodId, roomId, o.data) : null;
//                                                                 return (
//                                                                     <option key={o.id} value={o.id} className="text-slate-800 py-2">
//                                                                         {o.name} | {o.thickness}mm {displayRate !== null ? ` | ₹${displayRate}/sqft` : ''}
//                                                                     </option>
//                                                                 );
//                                                             })}
//                                                         </select>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )
//                 }
//                 )}
//             </div>

//             {/* Footer Actions */}
//             <div className="flex justify-end gap-3 pt-8 border-t">
//                 <Button variant="secondary" className="px-8 h-12" onClick={() => setStep(3)}>Back</Button>
//                 <Button className="px-12 h-12 bg-indigo-600 shadow-xl" isLoading={updatePending} onClick={async () => { await handleUpdate(); setStep(5); }}>
//                     Generate Quote <i className="fas fa-chevron-right ml-2 text-[7px]" />
//                 </Button>
//             </div>
//         </div>
//     );
// };



//  THIRD VERSION



import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useGetMaterialBrands } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { useParams } from "react-router-dom";
import CategoryMaterialGroup from "./CategoryMaterialGroup";
// import { calculateMaterialSqft } from "./PreSalesQuoteSingle";

interface PreSalesQuoteStep4Props {
    // Data Props
    config: any;
    PRODUCT_CATALOG: any;
    plywoodOptions: any[];
    innerOptions: any[];
    outerOptions: any[];
    // State Props
    globalPlywood: string;
    globalInner: string;
    globalOuter: string;
    // Function Props
    updateAllProductsGlobally: (type: 'plywood' | 'inner' | 'outer', opt: any) => void;
    updateProductInstance: (roomId: string, rIdx: number, prodId: string, pIdx: number, updates: any) => void;
    handleUpdate: () => Promise<void>;
    setStep: (step: number) => void;
    updatePending: boolean;
    globalProfitPercentage: number
    setGlobalProfitPercentage: React.Dispatch<React.SetStateAction<number>>

    groupProfitMargins: Record<string, number>
    updateGroupMargin: any
}


// --- NEW REGEX HELPER ---
// Extracts numbers around the "x". Works for "6 ft h x 7 ft w", "6x7", "6ft x 7ft"
export const extractDimFromKey = (key: string) => {
    const parts = key.toLowerCase().split('x');
    if (parts.length !== 2) return null;

    const extract = (str: string) => {
        const match = str.match(/\d+/); // Finds the first number in the string
        return match ? parseInt(match[0]) : null;
    };

    return { h: extract(parts[0]), w: extract(parts[1]) };
};


export const PreSalesQuoteStep4: React.FC<PreSalesQuoteStep4Props> = ({
    config, PRODUCT_CATALOG,
    // plywoodOptions, 
    // innerOptions, outerOptions,

    updateProductInstance, handleUpdate, setStep, updatePending,

    globalProfitPercentage, setGlobalProfitPercentage,
    groupProfitMargins, updateGroupMargin
}) => {


    const { organizationId } = useParams()


    const [loadingTextIndex, setLoadingTextIndex] = useState(0);

    const loadingMessages = [
        "Initializing Production AI...",
        "Scanning room configurations...",
        "Fetching material specifications...",
        "Redefining 'What's Included'...",
        "Calculating engineering tolerances...",
        "Synthesizing Plywood brand data...",
        "Integrating technical exclusions...",
        "Optimizing structural narratives...",
        "Finalizing high-end disclaimer...",
        "Calibrating material square footage...",
        "Generating execution scope...",
        "Generating professional quote view..."
    ];

    useEffect(() => {
        let interval: any;
        if (updatePending) {
            // Start from 0 when the button is first clicked
            setLoadingTextIndex(0);

            interval = setInterval(() => {
                // setLoadingTextIndex((prev: any) => (prev + 1) % loadingMessages.length);
                setLoadingTextIndex((prev: number) => {
                    const nextIndex = prev + 1;

                    // If we reach the end of the list
                    if (nextIndex >= loadingMessages.length) {
                        return 2; // ✅ Skip first two and restart from the 3rd message
                    }

                    return nextIndex;
                });
            }, 4500); // Changes text every 2.5 seconds
        } else {
            setLoadingTextIndex(0);
        }
        return () => clearInterval(interval);
    }, [updatePending]);


    // 1. DYNAMIC CATEGORY FETCHING
    // Fetch Laminates (These are usually static categories)
    const { data: innerLaminateBrands } = useGetMaterialBrands(organizationId!, "inner laminate");
    const { data: outerLaminateBrands } = useGetMaterialBrands(organizationId!, "outer laminate");

    // Helper to transform brands for the UI
    const transformBrands = (brands: any[]) => (brands || []).map(b => ({
        id: b._id,
        name: (b.data?.Brand || b.data?.brand || "Generic"),
        // thickness: b.data?.thickness || 0,
        thickness: b.data?.["thickness (mm)"] || b.data?.thickness || b.data?.Thickness || 0,
        materialType: b?.materialType || "all", // ✅ Added this
        rs: parseFloat(b.data?.Rs || b.data?.rs || 0),
        data: b.data // Keep full data for dimension matching
    }));

    const innerOptions = useMemo(() => transformBrands(innerLaminateBrands), [innerLaminateBrands]);
    const outerOptions = useMemo(() => transformBrands(outerLaminateBrands), [outerLaminateBrands]);

    // 2. GROUPING & DYNAMIC PLYWOOD DATA
    const groupedUnits = useMemo(() => {
        const groups: Record<string, any[]> = {};
        Object.entries(config).forEach(([roomId, roomInsts]: any) => {
            Object.entries(roomInsts).forEach(([rIdx, products]: any) => {
                Object.entries(products).forEach(([prodId, instances]: any) => {
                    const productDef = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
                    const groupLabel = productDef?.label || "other"; // e.g. "wardrobe"

                    Object.entries(instances).forEach(([pIdx, details]: any) => {
                        if (!groups[groupLabel]) groups[groupLabel] = [];
                        groups[groupLabel].push({
                            roomId, rIdx: parseInt(rIdx), prodId, pIdx: parseInt(pIdx), details, name: productDef?.name
                        });
                    });
                });
            });
        });
        return groups;
    }, [config, PRODUCT_CATALOG]);

    // // --- NEW: FETCH PLYWOOD BY PRODUCT CATEGORY ---
    // // This creates a map of options for each label (e.g. { "wardrobe": [...] })
    // const groupPlywoodOptions = useMemo(() => {
    //     const optionsMap: Record<string, any[]> = {};
    //     Object.keys(groupedUnits).forEach(label => {
    //         // Here you would call useGetMaterialBrands(organizationId, label)
    //         // For now, assume we have a way to fetch these or they are passed down
    //     });
    //     return optionsMap;
    // }, [groupedUnits]);



    // 3. THE CALCULATION ENGINE (With Regex) (not used in new version also in old version also you can remove it safely)
    // const getMfgRateForProduct = (prodId: string, roomId: string, materialData: any, unitH: number, unitW: number) => {
    //     if (!materialData) return 0;

    //     // Look for keys like "7 ft h x 6 ft w"
    //     const foundKey = Object.keys(materialData).find(key => {
    //         const dims = extractDimFromKey(key);
    //         if (!dims) return false;
    //         // Match the unit's H and W against the key's H and W
    //         return dims.h === unitH && dims.w === unitW;
    //     });

    //     if (foundKey) return Number(materialData[foundKey] || 0);

    //     // Fallback: Check for a key named after the product category
    //     const product = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
    //     const labelKey = Object.keys(materialData).find(k => k.toLowerCase() === product?.label?.toLowerCase());

    //     return labelKey ? Number(materialData[labelKey]) : 0;
    // };


    // console.log("plywoodOptions", plywoodOptions)
    // Helper to get the correct Mfg Rate based on Product Type
    // const getMfgRateForProduct = (prodId: string, roomId: string, itemData: any) => {

    //     if (!itemData) return 0;
    //     // 1. Find the product in your catalog using the roomId and prodId
    //     const product = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
    //     // 2. Get the pre-defined lowercase label (e.g., "tv unit", "wardrobe")
    //     const label = product?.label;

    //     if (!label) {
    //         // Fallback if no label is defined in catalog
    //         // return Number(itemData?.manufacturCostPerSqft || 0);
    //         return 0
    //     }

    //     // Look for a key in material data that matches our label exactly or via inclusion
    //     const foundKey = Object.keys(itemData).find(key =>
    //         key.toLowerCase() === label.toLowerCase() ||
    //         key.toLowerCase().includes(label.toLowerCase())
    //     );

    //     if (foundKey) {
    //         return Number(itemData[foundKey] || 0);
    //     }

    //     // 4. Final fallback to the general manufacturing cost
    //     // return Number(itemData?.manufacturCostPerSqft || 0);
    //     return 0;
    // };




    // Inside PreSalesQuoteStep4 component
    // OLD VERSION OF GROUPED UNITS
    // const groupedUnits = useMemo(() => {
    //     const groups: Record<string, any[]> = {};

    //     Object.entries(config).forEach(([roomId, roomInsts]: any) => {
    //         Object.entries(roomInsts).forEach(([rIdx, products]: any) => {
    //             Object.entries(products).forEach(([prodId, instances]: any) => {
    //                 // Get label from catalog
    //                 const productDef = PRODUCT_CATALOG[roomId]?.find((p: any) => p.id === prodId);
    //                 const groupLabel = productDef?.name || "other";

    //                 Object.entries(instances).forEach(([pIdx, details]: any) => {
    //                     if (!groups[groupLabel]) groups[groupLabel] = [];
    //                     groups[groupLabel].push({
    //                         roomId, rIdx: parseInt(rIdx), prodId, pIdx: parseInt(pIdx), details, name: productDef?.name
    //                     });
    //                 });
    //             });
    //         });
    //     });
    //     return groups;
    // }, [config, PRODUCT_CATALOG]);






    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">

            {/*  old one witout the master drop down */}



            {/* PAGE HEADER */}
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Technical Mapping & Valuation</h2>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Select materials to see live unit pricing</p>
            </div>


            {/* GLOBAL PROFIT MARGIN CONTROL */}
            <div className="bg-slate-900 p-6 rounded-[32px] flex items-center justify-between shadow-xl mb-10 border border-indigo-500/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                        <i className="fas fa-chart-line text-lg" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Valuation</span>
                        <h3 className="text-white font-bold uppercase tracking-tight">Profit Margin (%)</h3>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-2xl border border-slate-700">
                    <input
                        type="number"
                        value={globalProfitPercentage || ""}
                        // onChange={(e) => setGlobalProfitPercentage(Math.max(0,Number(e.target.value)))}

                        onChange={(e) => {
                            const newVal = Math.max(0, Number(e.target.value));

                            // 1. Update the Global State
                            setGlobalProfitPercentage(newVal);

                            // 2. Loop through every group currently in your state and update them
                            // This makes sure the "Calculation Engine" sees the same value everywhere
                            Object.keys(groupProfitMargins).forEach((groupLabel) => {
                                updateGroupMargin(groupLabel, newVal);
                            });
                        }}

                        className="w-20 bg-transparent text-white text-center font-black text-xl outline-none"
                        placeholder="0"
                    />
                    <span className="text-indigo-400 font-black text-xl mr-2">%</span>
                </div>
            </div>





            <div className="space-y-16">
                {Object.entries(groupedUnits).map(([label, units]) => {


                    // const currentGroupMargin = groupProfitMargins[label] ?? globalProfitPercentage;

                    // return (
                    //     <div key={label} className="bg-white border-blue-600 border-l-8 rounded-[40px] p-8   space-y-6 shadow-sm">

                    //         {/* 1. MASTER GROUP SELECTOR SECTION */}
                    //         <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-indigo-100 shadow-sm">
                    //             <div>
                    //                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{label}</h3>
                    //                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bulk update all {label}
                    //                     {/* {units.length}  */}
                    //                     units</p>
                    //             </div>

                    //             <div className="flex items-end gap-4 pb-1">
                    //                 {[
                    //                     { k: 'plywood', l: 'Plywood', o: plywoodOptions, c: 'indigo' },
                    //                     { k: 'inner', l: 'Inner', o: innerOptions, c: 'emerald' },
                    //                     { k: 'outer', l: 'Outer', o: outerOptions, c: 'amber' }
                    //                 ].map(m => (
                    //                     <div key={`master-${label}-${m.k}`} className="flex flex-col gap-1.5 min-w-[200px]">
                    //                         <span className={`text-[8px] font-black text-${m.c}-500 uppercase ml-1 tracking-widest`}>
                    //                             Master {m.l}
                    //                         </span>
                    //                         <select
                    //                             // className={`h-10 px-4  border-none rounded-xl text-[10px] font-bold  outline-none cursor-pointer`}
                    //                             className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 transition-all"
                    //                             onChange={(e) => {
                    //                                 const opt = m.o.find(o => o.id === e.target.value);
                    //                                 if (!opt) return;

                    //                                 units.forEach(u => {
                    //                                     // Use dynamic rate for Plywood, flat cost for Laminates
                    //                                     const appliedCost = m.k === 'plywood'
                    //                                         ? getMfgRateForProduct(u.prodId, u.roomId, opt.data)
                    //                                         : Number(opt.cost || 0);

                    //                                     updateProductInstance(u.roomId, u.rIdx, u.prodId, u.pIdx, {
                    //                                         [`${m.k}Id`]: opt.id,
                    //                                         [`${m.k}Name`]: opt.name,
                    //                                         [`${m.k}Cost`]: appliedCost,
                    //                                         [`${m.k}Thickness`]: opt.thickness,
                    //                                         [`${m.k}Rs`]: opt.rs
                    //                                     });
                    //                                 });
                    //                             }}
                    //                         >
                    //                             <option value="" className="text-slate-800">Apply {m.l} to all {label}s...</option>


                    //                             {m.o.map(o => {
                    //                                 const rateLabel = m.k === 'plywood'
                    //                                     ? ` | ₹${getMfgRateForProduct(units[0].prodId, units[0].roomId, o.data)}/sqft`
                    //                                     : "";
                    //                                 return (
                    //                                     <option key={o.id} value={o.id} className="py-2 text-slate-800">
                    //                                         {o.name} | {o.thickness}mm {rateLabel}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </select>
                    //                     </div>
                    //                 ))}





                    //                 <div className="flex flex-col gap-1.5 min-w-[10px]">
                    //                     <span className="text-[8px] font-black text-indigo-500 uppercase ml-1 tracking-widest">
                    //                         Group Margin
                    //                     </span>

                    //                     <div className="flex items-center">
                    //                         {/* Percentage Icon Overlay */}


                    //                         <input
                    //                             type="number"
                    //                             value={currentGroupMargin || ""}
                    //                             onChange={(e) => updateGroupMargin(label, Math.max(0, Number(e.target.value)))}
                    //                             className="w-full h-10 pl-4 text-gray-800 pr-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-500 transition-all shadow-sm hover:bg-slate-50"
                    //                             placeholder="0"
                    //                         />

                    //                         {/* Unit Label Overlay */}
                    //                         <div className="absolute right-3 flex items-center pointer-events-none">
                    //                             <span className="text-[8px] font-black text-indigo-300">PROFIT</span>
                    //                         </div>
                    //                     </div>
                    //                 </div>


                    //             </div>
                    //         </section>


                    //         {/* LIST OF INDIVIDUAL UNITS IN THIS GROUP */}
                    //         <div className="grid grid-cols-1 gap-6">
                    //             {units.map(({ roomId, rIdx, prodId, pIdx, details, name }) => {
                    //                 // const materialArea = calculateMaterialSqft(details, prodId);
                    //                 // Simple Area = Height * Width
                    //                 const materialArea = Number(details.h || 0) * Number(details.w || 0);
                    //                 const totalRate = Number(details.plywoodCost || 0)
                    //                 //  + Number(details.innerCost || 0) + Number(details.outerCost || 0);

                    //                 // const unitPrice = materialArea * totalRate;

                    //                 const profitMultiplier = 1 + (currentGroupMargin / 100);
                    //                 const unitPrice = (materialArea * totalRate) * profitMultiplier;

                    //                 return (
                    //                     <div key={`${roomId}-${rIdx}-${prodId}-${pIdx}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    //                         {/* Sub-Header for Individual Unit */}
                    //                         <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b">
                    //                             <div className="flex items-center gap-3">
                    //                                 <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase">{roomId}</span>
                    //                                 <h4 className="text-sm font-bold text-slate-700 uppercase">{name}</h4>
                    //                             </div>
                    //                             <div className="flex items-center gap-6">
                    //                                 {/* <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    //                                 {materialArea.toFixed(1)} Material SQFT
                    //                             </span> */}

                    //                                 <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    //                                     <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    //                                         <i className="fas fa-arrows-alt text-xs" />
                    //                                     </div>
                    //                                     <div className="flex flex-col">
                    //                                         <span className="text-[12px] font-black text-slate-400 uppercase tracking-tighter">Size (FT)</span>
                    //                                         <span className="text-xs font-bold text-slate-700 leading-none">
                    //                                             <span className="text-emerald-600">{details.h}H</span>
                    //                                             <span className="mx-1 text-slate-300">×</span>
                    //                                             <span className="text-amber-600">{details.w}W</span>
                    //                                         </span>
                    //                                     </div>
                    //                                 </div>


                    //                                 <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    //                                     <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    //                                         <i className="fas fa-vector-square text-xs" />
                    //                                     </div>
                    //                                     <div className="flex flex-col">
                    //                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Area</span>
                    //                                         <span className="text-xs font-bold text-slate-700 leading-none">
                    //                                             {Number(details.h || 0) * Number(details.w || 0)} <span className="text-[9px] text-slate-400">SQFT</span>
                    //                                         </span>
                    //                                     </div>
                    //                                 </div>




                    //                                 <span className="text-xl font-black text-emerald-600">₹{unitPrice.toLocaleString('en-IN')}</span>
                    //                             </div>
                    //                         </div>

                    //                         {/* Local Selection Logic */}
                    //                         <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    //                             {[
                    //                                 { k: 'plywood', l: 'Plywood', o: plywoodOptions, color: 'indigo' },
                    //                                 { k: 'inner', l: 'Inner Laminate', o: innerOptions, color: 'emerald' },
                    //                                 { k: 'outer', l: 'Outer Laminate', o: outerOptions, color: 'amber' }
                    //                             ].map(m => (
                    //                                 <div key={m.k} className="flex flex-col gap-2">
                    //                                     <label className="text-[9px] font-black uppercase text-slate-500">{m.l}</label>
                    //                                     <select
                    //                                         className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold"
                    //                                         value={details[`${m.k}Id`] || ""}
                    //                                         onChange={(e) => {
                    //                                             const opt = m.o.find((x: any) => x.id === e.target.value);
                    //                                             const isPlywood = m.k === 'plywood';
                    //                                             const appliedCost = isPlywood ? getMfgRateForProduct(prodId, roomId, opt?.data) : Number(opt?.cost || 0);

                    //                                             updateProductInstance(roomId, rIdx, prodId, pIdx, {
                    //                                                 [`${m.k}Id`]: opt?.id,
                    //                                                 [`${m.k}Name`]: opt?.name,
                    //                                                 [`${m.k}Cost`]: appliedCost,
                    //                                                 [`${m.k}Thickness`]: opt?.thickness,
                    //                                                 [`${m.k}Rs`]: opt?.rs
                    //                                             });
                    //                                         }}
                    //                                     >
                    //                                         <option value="" className="text-slate-800">Select Brand</option>
                    //                                         {m.o.map((o: any) => {
                    //                                             const displayRate = m.k === 'plywood' ? getMfgRateForProduct(prodId, roomId, o.data) : null;
                    //                                             return (
                    //                                                 <option key={o.id} value={o.id} className="text-slate-800 py-2">
                    //                                                     {o.name} | {o.thickness}mm {displayRate !== null ? ` | ₹${displayRate}/sqft` : ''}
                    //                                                 </option>
                    //                                             );
                    //                                         })}
                    //                                     </select>
                    //                                 </div>
                    //                             ))}
                    //                         </div>
                    //                     </div>
                    //                 );
                    //             })}
                    //         </div>
                    //     </div>
                    // )

                    return <CategoryMaterialGroup
                        key={label}
                        label={label}
                        organizationId={organizationId!}
                        units={units}
                        innerOptions={innerOptions}
                        outerOptions={outerOptions}
                        globalProfitPercentage={globalProfitPercentage}
                        groupProfitMargins={groupProfitMargins}
                        updateGroupMargin={updateGroupMargin}
                        updateProductInstance={updateProductInstance}
                        transformBrands={transformBrands}
                    />
                }
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-8 border-t">
                <Button variant="secondary" className="px-8 h-12" onClick={() => setStep(3)}>Back</Button>
                {/* <Button className="px-12 h-12 bg-indigo-600 shadow-xl" isLoading={updatePending} onClick={async () => { await handleUpdate(); }}>
                    Generate Quote <i className="fas fa-chevron-right ml-2 text-[7px]" />
                </Button> */}

                <Button
                    className="px-12 h-12 bg-indigo-600 shadow-xl min-w-[320px] relative overflow-hidden transition-all duration-500"
                    isLoading={updatePending}
                    disabled={updatePending}
                    onClick={async () => { await handleUpdate(); }}
                >
                    {updatePending ? (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <span className="text-[11px] font-bold uppercase tracking-widest animate-pulse italic">
                                {loadingMessages[loadingTextIndex]}
                            </span>
                        </div>
                    ) : (
                        <>
                            Generate Quote <i className="fas fa-chevron-right ml-2 text-[7px]" />
                        </>
                    )}

                    {/* Subtle Loading Progress Bar Glow at the bottom */}
                    {updatePending && (
                        <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-progress-glow" style={{ width: '100%' }} />
                    )}
                </Button>
            </div>
        </div>
    );
};