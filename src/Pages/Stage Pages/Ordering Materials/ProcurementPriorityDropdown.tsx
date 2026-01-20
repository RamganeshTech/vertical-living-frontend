import  { useState, useRef, useEffect } from 'react';
import { useOrderHistorySendToProcurementNewVersion } from '../../../apiList/Stage Api/orderMaterialHistoryApi';

export const ProcurementPriorityDropdown = ({ ele, projectId, organizationId, refetch }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef:any = useRef(null);
    const { mutateAsync: sendToProcurement, isPending: isSending } = useOrderHistorySendToProcurementNewVersion();


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const priorities = [
        { label: "Speed", value: "speed", color: "bg-red-500", icon: "fa-fire" },
        { label: "Cost Efficient", value: "cost efficient", color: "bg-yellow-500", icon: "fa-bolt" },
        { label: "quality", value: "quality", color: "bg-blue-500", icon: "fa-faucet" },
        { label: "General", value: "general", color: "bg-slate-500", icon: "fa-layer-group" },
    ];

    const handleSelect = async (priorityValue:any) => {
        setIsOpen(false);
        try {
            await sendToProcurement({
                projectId,
                organizationId,
                orderItemId: ele._id,
                priority: priorityValue
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

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute  right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 !z-[999] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Vendor Priority</span>
                    </div>
                    <div className="py-1">
                        {priorities.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => handleSelect(item.value)}
                                className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                                    <span className="font-medium group-hover:text-blue-600">{item.label}</span>
                                </div>
                                <i className={`fas ${item.icon} text-gray-300 group-hover:text-blue-400 text-xs`}></i>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};