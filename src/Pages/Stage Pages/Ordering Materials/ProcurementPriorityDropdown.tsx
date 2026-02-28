// import  { useState, useRef, useEffect } from 'react';
// import { useOrderHistorySendToProcurementNewVersion } from '../../../apiList/Stage Api/orderMaterialHistoryApi';

// export const ProcurementPriorityDropdown = ({ ele, projectId, organizationId, refetch }: any) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef:any = useRef(null);
//     const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurementNewVersion();


//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event:any) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const priorities = [
//         { label: "Speed", value: "speed", color: "bg-red-500", icon: "fa-fire" },
//         { label: "Cost Efficient", value: "cost efficient", color: "bg-yellow-500", icon: "fa-bolt" },
//         { label: "quality", value: "quality", color: "bg-blue-500", icon: "fa-faucet" },
//         { label: "General", value: "general", color: "bg-slate-500", icon: "fa-layer-group" },
//     ];

//     const handleSelect = async (priorityValue:any) => {
//         setIsOpen(false);
//         try {
//             await sendToProcurement({
//                 projectId,
//                 organizationId,
//                 orderItemId: ele._id,
//                 priority: priorityValue
//             });
//             refetch?.();
//         } catch (error) {
//             console.error("Failed to send to procurement", error);
//         }
//     };

//     return (
//         <div className="relative inline-block text-left" ref={dropdownRef}>
//             <button
//                 type="button"
//                 disabled={ele?.isSyncWithProcurement || isSending}
//                 onClick={() => setIsOpen(!isOpen)}
//                 className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 
//                     ${ele?.isSyncWithProcurement
//                         ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
//                         : "border-green-400 text-green-700 hover:bg-green-50 active:scale-95 shadow-sm"}`}
//             >
//                 {isSending ? (
//                     <i className="fas fa-spinner fa-spin"></i>
//                 ) : ele?.isSyncWithProcurement ? (
//                     <i className="fas fa-check-circle"></i>
//                 ) : (
//                     <i className="fas fa-paper-plane"></i>
//                 )}
//                 <span>{ele?.isSyncWithProcurement ? "Sent to Procurement" : "Send To Procurement"}</span>
//                 {!ele?.isSyncWithProcurement && <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>}
//             </button>

//             {/* Dropdown Menu */}
//             {isOpen && (
//                 <div className="absolute  right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 !z-[999] overflow-hidden animate-in fade-in zoom-in duration-200">
//                     <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
//                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Vendor Priority</span>
//                     </div>
//                     <div className="py-1">
//                         {priorities.map((item) => (
//                             <button
//                                 key={item.value}
//                                 onClick={() => handleSelect(item.value)}
//                                 className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition-colors group"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
//                                     <span className="font-medium group-hover:text-blue-600">{item.label}</span>
//                                 </div>
//                                 <i className={`fas ${item.icon} text-gray-300 group-hover:text-blue-400 text-xs`}></i>
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };



// SECOND VERSION

// import { useState, useRef, useEffect } from 'react';
// import { useOrderHistorySendToProcurementNewVersion } from '../../../apiList/Stage Api/orderMaterialHistoryApi';
// import { useGetVendorForDropDown } from '../../../apiList/Department Api/Accounting Api/vendorAccApi';
// import { toast } from '../../../utils/toast';
// // import { toast } from '../../../utils/toast';

// export const ProcurementPriorityDropdown = ({ ele, projectId, organizationId, refetch }: any) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef: any = useRef(null);

//     const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
//     const [view, setView] = useState<string>("")
//     const [dropUp, setDropUp] = useState(false);
//     const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurementNewVersion();

//     // HOOK 1: For Priority Filtered Vendors
//     // Fetch vendors based on organization and selected priority
//     const { data: priorityVendors, isLoading: isLoadingPriorityVendors } = useGetVendorForDropDown(
//         organizationId,
//         !!selectedPriority,
//         selectedPriority || ""
//     ); // Only fetch if priority is selected



//     useEffect(() => {
//         if (isOpen && dropdownRef.current) {
//             const rect = dropdownRef.current.getBoundingClientRect();
//             if (window.innerHeight - rect.bottom < 450) setDropUp(true);
//             else setDropUp(false);
//         }
//     }, [isOpen]);


//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: any) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const priorities = [
//         { label: "Speed", value: "speed", color: "bg-red-500", icon: "fa-fire" },
//         { label: "Cost Efficient", value: "cost_efficient", color: "bg-yellow-500", icon: "fa-bolt" },
//         { label: "quality", value: "quality", color: "bg-blue-500", icon: "fa-faucet" },
//         { label: "General", value: "general", color: "bg-slate-500", icon: "fa-layer-group" },
//     ];

//     // const resetDropdown = () => {
//     //     setView('main');
//     //     setSelectedPriority(null);
//     // };

//     const handlePriorityClick = (priorityValue: string) => {
//         setSelectedPriority(priorityValue);
//         setView('priorities');
//     };

//     const handleVendorSelect = async (priorityValue: string | null, vendorId: string) => {
//         setIsOpen(false);
//         try {
//             await sendToProcurement({
//                 projectId,
//                 organizationId,
//                 orderItemId: ele._id,
//                 priority: priorityValue,
//                 vendorId: vendorId
//             });
//             refetch?.();
//         } catch (error) {
//             console.error("Failed to send to procurement", error);
//         }
//     };

//     return (
//         <div className="relative inline-block text-left" ref={dropdownRef}>
//             <button
//                 type="button"
//                 disabled={ele?.isSyncWithProcurement || isSending}
//                 onClick={() => setIsOpen(!isOpen)}
//                 className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 
//                     ${ele?.isSyncWithProcurement
//                         ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
//                         : "border-green-400 text-green-700 hover:bg-green-50 active:scale-95 shadow-sm"}`}
//             >
//                 {isSending ? (
//                     <i className="fas fa-spinner fa-spin"></i>
//                 ) : ele?.isSyncWithProcurement ? (
//                     <i className="fas fa-check-circle"></i>
//                 ) : (
//                     <i className="fas fa-paper-plane"></i>
//                 )}
//                 <span>{ele?.isSyncWithProcurement ? "Sent to Procurement" : "Send To Procurement"}</span>
//                 {!ele?.isSyncWithProcurement && <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>}
//             </button>

//             {isOpen && (
//                 <div className={`absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl border border-gray-200 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>

//                     <div className={`${view === 'priorities' ? 'hidden' : 'block'}`}>
//                         <div className="bg-slate-100 px-4 py-2 border-b border-gray-200">
//                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1. Select Priority Tag</span>
//                         </div>
//                         <div className="py-1">
//                             {priorities.map((item) => (
//                                 <button
//                                     key={item.value}
//                                     onClick={() => handlePriorityClick(item.value)}
//                                     className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all group
//                                         ${selectedPriority === item.value ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <span className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${item.color}`}></span>
//                                         <span className={`font-bold ${selectedPriority === item.value ? "text-white" : "text-gray-800"}`}>{item.label}</span>
//                                     </div>
//                                     <i className={`fas fa-chevron-right text-[10px] ${selectedPriority === item.value ? "text-blue-200" : "text-gray-300"}`}></i>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className={`${view === 'priorities' ? 'hidden' : 'block'} flex flex-col`}>
//                         <div className="bg-blue-700 px-4 py-3 flex items-center gap-3">
//                             <button onClick={() => setView('priorities')} className="bg-white/20 hover:bg-white/40 text-white w-7 h-7 rounded-full flex items-center justify-center transition-all">
//                                 <i className="fas fa-arrow-left text-xs"></i>
//                             </button>
//                             <div>
//                                 <div className="text-[9px] font-black text-blue-200 uppercase tracking-tighter">Choose Vendor for</div>
//                                 <div className="text-sm text-white font-bold leading-none capitalize">{selectedPriority}</div>
//                             </div>
//                         </div>

//                         <div className="relative min-h-[150px] max-h-[320px] overflow-y-auto custom-scrollbar bg-white">
//                             {isLoadingPriorityVendors ? (
//                                 <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
//                                     <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//                                     <span className="text-[10px] font-bold text-blue-600 mt-2 uppercase tracking-widest">Searching...</span>
//                                 </div>
//                             ) : null}

//                             {priorityVendors?.length > 0 ? (
//                                 priorityVendors.map((vendor: any) => (
//                                     <button
//                                         key={vendor._id}

//                                         onClick={() => {
//                                             if (!selectedPriority) {
//                                                 toast({ title: "Error", description: "Select the prioriry first", variant: "destructive" })
//                                                 return
//                                             }
//                                             handleVendorSelect(selectedPriority, vendor._id)
//                                         }
//                                         }
//                                         className="w-full text-left px-4 py-3.5 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors group"
//                                     >
//                                         <div className="text-sm font-black text-slate-800 truncate" title={vendor.vendorName}>
//                                             {vendor.vendorName}
//                                         </div>
//                                         <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
//                                             <i className="fas fa-store text-blue-400"></i>
//                                             <span className="truncate italic w-full" title={vendor.shopName}>
//                                                 {vendor.shopName || "Untitled Shop"}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center justify-between mt-2">
//                                             <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors uppercase">
//                                                 {vendor.phoneNo || "No Contact"}
//                                             </span>
//                                             <i className="fas fa-plus-circle text-transparent group-hover:text-blue-500 transition-all text-xs"></i>
//                                         </div>
//                                     </button>
//                                 ))
//                             ) : (
//                                 !isLoadingPriorityVendors && (
//                                     <div className="p-10 text-center flex flex-col items-center">
//                                         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
//                                             <i className="fas fa-search text-xl"></i>
//                                         </div>
//                                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">No Vendors found</p>
//                                     </div>
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}





//         </div>
//     );
// };






//  THIRD VERSION
// NEW VERION SENDIG TO ONLY ONE SHOP NOT TO MULTIPLE SHOPS

import { useState, useRef, useEffect } from 'react';
import { useOrderHistorySendToProcurementNewVersion } from '../../../apiList/Stage Api/orderMaterialHistoryApi';
import { useGetVendorForDropDown } from '../../../apiList/Department Api/Accounting Api/vendorAccApi';
// import { toast } from '../../../utils/toast';

export const ProcurementPriorityDropdown = ({ ele, projectId, organizationId, refetch }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef: any = useRef(null);

    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [dropUp, setDropUp] = useState(false);
    const [view, setView] = useState<'priorities' | 'vendors'>('priorities');

    const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurementNewVersion();

    // HOOK 1: For Priority Filtered Vendors
    // Fetch vendors based on organization and selected priority
    const { data: priorityVendors, isLoading: isLoadingPriority } = useGetVendorForDropDown(
        organizationId,
        !!selectedPriority,
        selectedPriority || ""
    ); // Only fetch if priority is selected

    // HOOK 2: For Direct Selection (No priority passed)
    const { data: allVendors, isLoading: isLoadingAll } = useGetVendorForDropDown(
        organizationId,
        true
    );


    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            if (window.innerHeight - rect.bottom < 450) setDropUp(true);
            else setDropUp(false);
        }
    }, [isOpen]);


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const priorities = [
        { label: "Speed", value: "speed", color: "bg-red-500", icon: "fa-fire" },
        { label: "Cost Efficient", value: "cost_efficient", color: "bg-yellow-500", icon: "fa-bolt" },
        { label: "quality", value: "quality", color: "bg-blue-500", icon: "fa-faucet" },
        { label: "General", value: "general", color: "bg-slate-500", icon: "fa-layer-group" },
    ];

    const handleVendorSelect = async (priorityValue: string | null, vendorId: string) => {
        setIsOpen(false);
        try {
            await sendToProcurement({
                projectId,
                organizationId,
                orderItemId: ele._id,
                priority: priorityValue,
                vendorId: vendorId
            });
            refetch?.();
        } catch (error) {
            console.error("Failed to send to procurement", error);
        }
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                disabled={ele?.isSyncWithProcurement || isSending}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 
                    ${ele?.isSyncWithProcurement
                        ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-green-400 text-green-700 hover:bg-green-50 active:scale-95 shadow-sm"}`}
            >
                {isSending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : ele?.isSyncWithProcurement ? (
                    <i className="fas fa-check-circle"></i>
                ) : (
                    <i className="fas fa-paper-plane"></i>
                )}
                <span>{ele?.isSyncWithProcurement ? "Sent to Procurement" : "Send To Procurement"}</span>
                {!ele?.isSyncWithProcurement && <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>}
            </button>

           {isOpen && (
                <div className={`absolute right-0 w-[600px] rounded-2xl bg-slate-50 shadow-2xl border border-blue-100 z-[9999] flex p-3 gap-3 overflow-hidden animate-in fade-in zoom-in duration-200
                    ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>

                    {/* LEFT COLUMN: PRIORITY WORKFLOW */}
                    <div className="w-1/2 flex flex-col bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden">
                        {view === 'priorities' ? (
                            <div className="flex flex-col h-full">
                                <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">1. Priority Tag</span>
                                    <i className="fas fa-tags text-blue-200 text-xs"></i>
                                </div>
                                <div className="p-2 space-y-1">
                                    {priorities.map((item) => (
                                        <button
                                            key={item.value}
                                            onClick={() => { setSelectedPriority(item.value); setView('vendors'); }}
                                            className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all group
                                                ${selectedPriority === item.value ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-slate-50"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${item.color}`}></span>
                                                <span className="font-bold">{item.label}</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-[10px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full animate-in slide-in-from-right-2 duration-200">
                                <div className="bg-blue-700 px-4 py-3 flex items-center gap-3">
                                    <button onClick={() => setView('priorities')} className="bg-white/20 hover:bg-white/40 text-white w-7 h-7 rounded-full flex items-center justify-center transition-all">
                                        <i className="fas fa-arrow-left text-xs"></i>
                                    </button>
                                    <div>
                                        <div className="text-[9px] font-black text-blue-200 uppercase tracking-tighter">Priority: {selectedPriority}</div>
                                        <div className="text-sm text-white font-bold leading-none">Choose Vendor</div>
                                    </div>
                                </div>

                                <div className="relative flex-1 min-h-[300px] max-h-[380px] overflow-y-auto custom-scrollbar bg-white p-1">
                                    {isLoadingPriority && (
                                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                            <i className="fas fa-circle-notch fa-spin text-blue-600 text-xl"></i>
                                        </div>
                                    )}
                                    {priorityVendors?.length > 0 ? (
                                        priorityVendors.map((vendor: any) => (
                                            <VendorRow key={vendor._id} vendor={vendor} onClick={() => handleVendorSelect(selectedPriority, vendor._id)} />
                                        ))
                                    ) : !isLoadingPriority && (
                                        <div className="p-10 text-center flex flex-col items-center">
                                            <i className="fas fa-store-slash text-slate-200 text-2xl mb-2"></i>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">No vendors found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: DIRECT SELECTION (Blue-Themed for Consistency) */}
                    <div className="w-1/2 flex flex-col bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden">
                        <div className="bg-blue-800 px-4 py-3 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block">Direct Select</span>
                                <div className="text-sm text-white font-bold leading-none">All Shops</div>
                            </div>
                            <i className="fas fa-store text-blue-400 text-xs"></i>
                        </div>
                        <div className="relative flex-1 min-h-[300px] max-h-[440px] overflow-y-auto custom-scrollbar p-1">
                            {isLoadingAll && (
                                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                    <i className="fas fa-circle-notch fa-spin text-blue-400 text-xl"></i>
                                </div>
                            )}
                            {allVendors?.length > 0 ? (
                                allVendors.map((vendor: any) => (
                                    <VendorRow key={vendor._id} vendor={vendor} onClick={() => handleVendorSelect(null, vendor._id)} />
                                ))
                            ) : !isLoadingAll && (
                                <div className="p-10 text-center flex flex-col items-center">
                                     <i className="fas fa-search text-slate-200 text-2xl mb-2"></i>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">No Shops Available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

// Internal Helper for Vendor Row to keep JSX clean
const VendorRow = ({ vendor, onClick }: any) => (
    <button
        onClick={onClick}
        className="w-full text-left px-4 py-3.5 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors group"
    >
        <div className="text-sm font-black text-slate-800 truncate uppercase" title={vendor.vendorName}>{vendor.vendorName}</div>
        <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5 italic">
            <i className="fas fa-store text-blue-400"></i>
            <span className="truncate w-full">{vendor.shopName || "Untitled Shop"}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">
                {vendor.phoneNo || "No Contact"}
            </span>
            <i className="fas fa-chevron-right text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-all"></i>
        </div>
    </button>
);