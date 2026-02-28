import React, { useState, useEffect, useMemo } from 'react';
import SearchSelectNew from '../../components/ui/SearchSelectNew';
import { useGetMaterialBrands } from '../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi';
import { useParams } from 'react-router-dom';

const WardrobeCalculator = () => {
    const [useBrandLibrary, setUseBrandLibrary] = useState(false);
    const { organizationId } = useParams() as { organizationId: string }
    const [values, setValues] = useState({
        length: 0,
        height: 0,
        depth: 0,
        rate: 0,
        plywoodId: '',
        plywoodCost: 0,
        innerId: '',
        innerCost: 0,
        outerId: '',
        outerCost: 0
    });

    const [results, setResults] = useState({ billable: 0, internal: 0, totalPrice: 0 });

    const { data: materialBrands } = useGetMaterialBrands(organizationId!, "plywood");
    const { data: innerLaminateBrands } = useGetMaterialBrands(organizationId!, "inner laminate");
    const { data: outerLaminateBrands } = useGetMaterialBrands(organizationId!, "outer laminate");


    // Transform Brands for SearchSelectNew
    const transformBrands = (brands: any[]) => (brands || []).map(b => ({
        value: b._id,
        label: `${b.data?.Brand || "Generic"} | ${b.data?.["thickness (mm)"] || 0}mm | ₹${b.data?.manufacturCostPerSqft || 0}/sqft`,
        cost: parseFloat(b.data?.manufacturCostPerSqft || 0)
    }));

    const plywoodOptions = useMemo(() => transformBrands(materialBrands), [materialBrands]);
    const innerOptions = useMemo(() => transformBrands(innerLaminateBrands), [innerLaminateBrands]);
    const outerOptions = useMemo(() => transformBrands(outerLaminateBrands), [outerLaminateBrands]);

    useEffect(() => {
        const billable = values.length * values.height;
        const internal = billable + (2 * values.depth * values.height);

        // Logic: Use brand total if toggled, otherwise use manual rate
        const effectiveRate = useBrandLibrary
            ? (values.plywoodCost + values.innerCost + values.outerCost)
            : values.rate;

        const price = billable * effectiveRate;
        setResults({ billable, internal, totalPrice: price });
    }, [values, useBrandLibrary]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value === "" ? 0 : Math.max(0, parseFloat(value))
        });
    };

    const labelStyle = "text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1 block";
    const inputStyle = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-semibold";

    return (
        <div className="h-full flex items-center justify-center bg-gray-50/50 p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Dimensions Section */}
                <div className="p-6 border-b border-gray-50 bg-gray-50/20">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelStyle}>Length (ft)</label>
                            <input type="number" name="length" value={values.length || ""} onChange={handleInput} className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>Height (ft)</label>
                            <input type="number" name="height" value={values.height || ""} onChange={handleInput} className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>Depth (ft)</label>
                            <input type="number" name="depth" value={values.depth || ""} onChange={handleInput} className={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Pricing Method Toggle */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white">
                    <span className="text-sm font-bold text-gray-700">Pricing Method</span>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setUseBrandLibrary(false)}
                            className={`px-4 py-1.5 cursor-pointer rounded-lg text-xs font-bold transition-all ${!useBrandLibrary ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >Manual Rate</button>
                        <button
                            onClick={() => setUseBrandLibrary(true)}
                            className={`px-4 py-1.5 cursor-pointer rounded-lg text-xs font-bold transition-all ${useBrandLibrary ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >Select Brands</button>
                    </div>
                </div>

                {/* Conditional Pricing Input */}
                <div className="p-6">
                    {!useBrandLibrary ? (
                        <div className="w-full">
                            <label className={`${labelStyle} text-green-600`}>Manual Rate per Sqft (₹)</label>
                            <input type="number" name="rate" value={values.rate || ""} onChange={handleInput} className={`${inputStyle} text-green-700 bg-green-50/30 border-green-100 font-bold`} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { k: 'plywood', l: 'Plywood', o: plywoodOptions, c: 'indigo' },
                                { k: 'inner', l: 'Inner Laminate', o: innerOptions, c: 'emerald' },
                                { k: 'outer', l: 'Outer Laminate', o: outerOptions, c: 'amber' }
                            ].map(m => (
                                <div key={m.k} className="flex flex-col gap-1">
                                    <label className={`text-[9px] font-black uppercase text-${m.c}-600`}>{m.l}</label>
                                    <SearchSelectNew
                                        options={m.o}
                                        value={values[`${m.k}Id` as keyof typeof values] as string}
                                        onValueChange={(val) => {
                                            const opt = m.o.find(x => x.value === val);
                                            setValues(prev => ({
                                                ...prev,
                                                [`${m.k}Id`]: val,
                                                [`${m.k}Cost`]: opt?.cost || 0
                                            }));
                                        }}
                                        placeholder={`Select ${m.k}`}
                                        className="w-full"
                                        displayFormat="simple"
                                    />
                                    {(values[`${m.k}Cost` as keyof typeof values] as number) > 0 && (
                                        <div className={`text-[10px] font-bold text-${m.c}-700 mt-1`}>
                                            ₹{values[`${m.k}Cost` as keyof typeof values]}/sqft
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="px-6 bg-white border-t border-gray-50 space-y-3">
                    <div className="flex justify-between items-center px-4 py-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-xs font-bold text-blue-700 uppercase">Client Billable</span>
                        <span className="text-lg font-black text-blue-900">{results.billable.toFixed(2)} <small className="text-[10px] font-normal italic">sqft</small></span>
                    </div>

                    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl text-white shadow-lg">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Price</span>
                            <div className="text-[10px] opacity-70 font-mono mt-0.5">
                                {results.billable} sqft × ₹{useBrandLibrary ? (values.plywoodCost + values.innerCost + values.outerCost) : values.rate}
                            </div>
                        </div>
                        <div className="text-3xl font-black tracking-tighter">₹{results.totalPrice.toLocaleString('en-IN')}</div>
                    </div>

                    {/* Logic Box */}
                   


                    <div className="mt-4 p-4 mb-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest flex items-center">
                             <i className="fas fa-info-circle mr-2"></i>
                             Staff Calculation Logic
                         </h4>
                         <ul className="text-[11px] space-y-1 text-gray-600 font-medium">
                             <li className="flex justify-between italic">
                                 <span>• Client Billable Sqft</span>
                                 <span className="font-bold">Length × Height</span>
                             </li>
                             <li className="flex justify-between italic">
                                 <span>• Internal Costing Sqft</span>
                                 <span className="font-bold">(L × H) + (2 × D × H)</span>
                             </li>
                         </ul>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default WardrobeCalculator;