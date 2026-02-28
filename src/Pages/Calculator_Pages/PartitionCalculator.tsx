import React, { useState, useEffect } from 'react';

const PartitionCalculator = () => {
    const [values, setValues] = useState({
        length: 10,
        height: 10,
        baseRate: 1500,
        cncRate: 0, // Optional CNC charge
    });

    const [results, setResults] = useState({ area: 0, materialPrice: 0, cncPrice: 0, totalPrice: 0 });

    useEffect(() => {
        const area = values.length * values.height;
        const materialPrice = area * values.baseRate;
        const cncPrice = area * values.cncRate;
        const total = materialPrice + cncPrice;

        setResults({ area, materialPrice, cncPrice, totalPrice: total });
    }, [values]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value === "" ? 0 : Math.max(0, parseFloat(value))
        });
    };

    const inputStyle = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold";
    const labelStyle = "text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1 block";

    return (
        <div className="h-full flex items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                
                {/* Inputs */}
                <div className="p-6 border-b border-gray-50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelStyle}>Length (ft)</label>
                            <input type="number" name="length" value={values.length || ""} onChange={handleInput} className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>Height (ft)</label>
                            <input type="number" name="height" value={values.height || ""} onChange={handleInput} className={inputStyle} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`${labelStyle} text-emerald-600`}>Base Rate (₹/sqft)</label>
                            <input type="number" name="baseRate" value={values.baseRate || ""} onChange={handleInput} className={`${inputStyle} text-emerald-700 bg-emerald-50/30 border-emerald-100 font-bold`} />
                        </div>
                        <div>
                            <label className={`${labelStyle} text-amber-600`}>CNC Design Charge (₹/sqft)</label>
                            <input type="number" name="cncRate" value={values.cncRate || ""} onChange={handleInput} className={`${inputStyle} text-amber-700 bg-amber-50/30 border-amber-100 font-bold`} />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="p-6 bg-white space-y-3">
                    <div className="flex justify-between items-center px-4 py-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <span className="text-sm font-medium text-emerald-700">Total Partition Area</span>
                        <div className="text-right">
                            <span className="text-lg font-bold text-emerald-900">{results.area.toFixed(2)}</span>
                            <span className="text-xs text-emerald-400 ml-1 font-medium italic">sqft</span>
                        </div>
                    </div>

                    {results.cncPrice > 0 && (
                        <div className="flex justify-between items-center px-4 py-2 bg-amber-50/50 rounded-lg border border-amber-100">
                            <span className="text-[11px] font-bold text-amber-700 uppercase">CNC Surcharge</span>
                            <span className="text-sm font-black text-amber-800">₹{results.cncPrice.toLocaleString('en-IN')}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl shadow-lg text-white">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Project Price</span>
                            <div className="text-[10px] opacity-70 font-mono mt-1">
                                (Area × Base) + (Area × CNC)
                            </div>
                        </div>
                        <div className="text-3xl font-black tracking-tighter">
                            ₹{results.totalPrice.toLocaleString('en-IN')}
                        </div>
                    </div>

                    {/* Staff Calculation Logic */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest flex items-center">
                            <i className="fas fa-info-circle mr-2"></i>
                            Partition Calculation Logic
                        </h4>
                        <ul className="text-[11px] space-y-1 text-gray-600 font-medium">
                            <li className="flex justify-between italic">
                                <span>• Total Area</span>
                                <span className="font-bold">Length × Height</span>
                            </li>
                            <li className="flex justify-between italic">
                                <span>• Base Material Cost</span>
                                <span className="font-bold">Area × Base Rate</span>
                            </li>
                            <li className="flex justify-between italic">
                                <span>• CNC Design Charge</span>
                                <span className="font-bold">Area × CNC Rate</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartitionCalculator;