// import  { useState } from 'react';

// export const MaterialCostSection = ({ initialData, onUpdate }: any) => {
//     const [items, setItems] = useState(initialData?.items || [{ id: 1, name: '', qty: 1, rate: 0, total: 0 }]);

//     const updateItem = (id: number, field: string, value: any) => {
//         const newItems = items.map((item: any) => {
//             if (item.id === id) {
//                 const updated = { ...item, [field]: value };
//                 updated.total = (Number(updated.qty) || 0) * (Number(updated.rate) || 0);
//                 return updated;
//             }
//             return item;
//         });
//         setItems(newItems);
//         const totalMaterialCost = newItems.reduce((acc: number, curr: any) => acc + curr.total, 0);
//         onUpdate({ items: newItems, totalMaterialCost });
//     };

//     const addItem = () => setItems([...items, { id: Date.now(), name: '', qty: 1, rate: 0, total: 0 }]);

//     return (
//         <div className="p-6 animate-in fade-in">
//             <table className="w-full border-separate border-spacing-y-2">
//                 <thead>
//                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-4">
//                         <th className="pb-2 pl-4">Description</th>
//                         <th className="pb-2 w-24 text-center">Qty</th>
//                         <th className="pb-2 w-32">Rate (₹)</th>
//                         <th className="pb-2 w-32 text-right pr-4">Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {items.map((item: any) => (
//                         <tr key={item.id} className="bg-slate-50 rounded-xl overflow-hidden group">
//                             <td className="p-3 pl-4 rounded-l-xl border-y border-l border-slate-100">
//                                 <input className="bg-transparent w-full text-xs font-bold outline-none" value={item.name} placeholder="Material name..." onChange={e => updateItem(item.id, 'name', e.target.value)} />
//                             </td>
//                             <td className="p-3 border-y border-slate-100 text-center">
//                                 <input type="number" className="bg-white border rounded w-16 text-center text-xs p-1" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} />
//                             </td>
//                             <td className="p-3 border-y border-slate-100">
//                                 <input type="number" className="bg-white border rounded w-full text-xs p-1" value={item.rate} onChange={e => updateItem(item.id, 'rate', e.target.value)} />
//                             </td>
//                             <td className="p-3 pr-4 rounded-r-xl border-y border-r border-slate-100 text-right">
//                                 <span className="text-xs font-black text-slate-900">₹{item.total.toFixed(2)}</span>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <button onClick={addItem} className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
//                 <i className="fas fa-plus-circle mr-1"></i> Add Material Row
//             </button>
//         </div>
//     );
// };






import { useState } from 'react';


/**
 * Individual row in the material table
 */
export interface IMaterialItem {
    id: number;
    name: string;
    qty: number | string;
    rate: number | string;
    total: number;
}

/**
 * The object structure for the materialData field in the backend
 */
export interface IMaterialData {
    items: IMaterialItem[];
    totalMaterialCost: number;
}

interface MaterialCostSectionProps {
    // Current material state from the parent's master state
    initialData: IMaterialData;
    // Callback to update the parent's materialData object
    onUpdate: (data: any) => void;
}

export const MaterialCostSection: React.FC<MaterialCostSectionProps> = ({ initialData, onUpdate }) => {
    // Ensure at least one row exists by default
    const [items, setItems] = useState(
        initialData?.items?.length > 0
            ? initialData.items
            : [{ id: Date.now(), name: '', qty: 1, rate: 0, total: 0 }]
    );

    const updateItem = (id: number, field: string, value: any) => {
        const newItems = items.map((item: any) => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                // Calculate line total instantly
                updated.total = (Number(updated.qty) || 0) * (Number(updated.rate) || 0);
                return updated;
            }
            return item;
        });

        setItems(newItems);
        const totalMaterialCost = newItems.reduce((acc: number, curr: any) => acc + curr.total, 0);

        // Sync with the Master Orchestrator
        // onUpdate({ 
        //     materialData: { 
        //         items: newItems, 
        //         totalMaterialCost 
        //     } 
        // });

        onUpdate({ items: newItems, totalMaterialCost });

    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', qty: 1, rate: 0, total: 0 }]);
    };

    const removeItem = (id: number) => {
        // if (items.length <= 1) return; // Keep at least one row
        const newItems = items.filter((item: any) => item.id !== id);
        setItems(newItems);
        const totalMaterialCost = newItems.reduce((acc: number, curr: any) => acc + curr.total, 0);
        onUpdate({ materialData: { items: newItems, totalMaterialCost } });
    };

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-500">
            {/* TABLE CONTAINER */}
            <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-4 pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                            <th className="py-4 w-28 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                            <th className="py-4 w-40 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate (₹)</th>
                            <th className="py-4 w-40 text-right pr-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item: any) => (
                            <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                <td className="py-3 pl-6">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                                        value={item.name}
                                        placeholder="Enter material description..."
                                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="py-3 text-center">
                                    <input
                                        type="number"
                                        className="w-20 bg-white border border-slate-200 rounded-lg text-center text-sm font-bold p-2 focus:ring-2 focus:ring-blue-500/10 outline-none"
                                        value={item.qty}
                                        onChange={e => updateItem(item.id, 'qty', e.target.value)}
                                    />
                                </td>
                                <td className="py-3">
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-slate-400 text-xs font-bold">₹</span>
                                        <input
                                            type="number"
                                            className="w-full bg-white border border-slate-200 rounded-lg text-sm font-bold p-2 pl-7 focus:ring-2 focus:ring-blue-500/10 outline-none"
                                            value={item.rate}
                                            onChange={e => updateItem(item.id, 'rate', e.target.value)}
                                        />
                                    </div>
                                </td>
                                <td className="py-3 pr-6 text-right">
                                    <span className="text-sm font-black text-slate-900 tracking-tighter italic">
                                        ₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="py-3 pr-4 text-center">

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <i className="fas fa-times-circle"></i>
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex justify-between items-center">
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm"
                >
                    <i className="fas fa-plus-circle"></i> Add New Material
                </button>

                <div className="flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl shadow-xl">
                    <div className="text-right border-r border-slate-700 pr-4">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Sub-Total</p>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Material Only</span>
                    </div>
                    <p className="text-xl font-black text-white tracking-tighter italic tabular-nums">
                        ₹{items.reduce((acc: number, curr: any) => acc + curr.total, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};