import React, { useState, useEffect, useRef } from 'react';
import { useAuthCheck } from '../Hooks/useAuthCheck';
import { useDeleteTip, useGetTips, useToggleUserGuidePref, useUpsertTip } from '../apiList/Guide_Api/guideApi';
import { toast } from '../utils/toast';

interface StageGuideProps {
    organizationId: string;
    stageName: string;
}

const StageGuide: React.FC<StageGuideProps> = ({ organizationId, stageName }) => {
    // 1. Auth & Roles
    const { role, isGuideRequired  , loading:authLoading} = useAuthCheck();

    // If client, render absolutely nothing
    if (role === 'client') return null;

    const isAdmin = role === 'owner' || role === 'CTO';

    // 2. State
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTipText, setNewTipText] = useState("");
    const [editingTipId, setEditingTipId] = useState<string | null>(null);

    // 3. Data Fetching
    const { data: stageData, isLoading:tipsLoading , refetch } = useGetTips(organizationId, stageName);

    // 4. Mutations
    const { mutate: upsertTip, isPending: isSaving } = useUpsertTip();
    const { mutateAsync: deleteTip } = useDeleteTip();
    const { mutateAsync: toggleUserPref } = useToggleUserGuidePref();

       const wrapperRef = useRef<HTMLDivElement>(null);



    // 5. Logic: Auto Open
    useEffect(() => {
        // If data is loading or missing, do nothing
        // if (!stageData || isLoading || loading) return;
         if (!stageData || authLoading || tipsLoading) return;

        const hasTips = stageData.guidelines && stageData.guidelines.length > 0;

        if (isGuideRequired === undefined) return;

        // If User wants guides AND (there are tips OR user is admin)
        // We set it to true.
        // Since we are not depending on 'isOpen' in the dependency array, 
        // this will run when data loads, open the popup, and let the user close it manually.
        if (isGuideRequired === true && (hasTips || isAdmin)) {
            setIsOpen(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageData, isGuideRequired, isAdmin, authLoading, tipsLoading]);

     // ✅ 6. Logic: Click Outside to Close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If the popup is not open, do nothing
            if (!isOpen) return;

            // Check if the click target is NOT inside the wrapper (Button + Popup)
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        // Attach event listener
        document.addEventListener("mousedown", handleClickOutside);
        
        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]); // Only re-run if isOpen changes


    // 6. Handlers
    const handleSaveTip = () => {
        if (!newTipText.trim()) return;
        upsertTip({
            organizationId,
            stageName,
            tipText: newTipText,
            tipId: editingTipId || undefined
        }, {
            onSuccess: () => {
                setNewTipText("");
                setEditingTipId(null);
                setIsEditing(false);
            }
        });
    };

    const handleEditStart = (tip: any) => {
        setNewTipText(tip.tips);
        setEditingTipId(tip._id);
        setIsEditing(true);
    };

    const handleDelete = async (tipId: string) => {
        try {

            await deleteTip({ organizationId, stageName, tipId });
            refetch()
            toast({ description: 'deleted successfully', title: "Success" });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || " Failed to delete",
                variant: "destructive"
            });
        }


    };

    const handleGlobalToggle = async () => {
        // Passing organizationId as requested in your logic
        try {
            console.log("isGuideRequired", isGuideRequired)
            console.log("!isGuideRequired", !isGuideRequired)
            await toggleUserPref({ isGuideRequired: !isGuideRequired, organizationId });
            toast({ description: 'updated successfully', title: "Success" });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || " Failed to update",
                variant: "destructive"
            });
        }
    };

    return (
        <div ref={wrapperRef} className="relative  z-50 font-sans">
            {/* --- The Trigger Icon (Pulse effect to draw attention if closed) --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center !cursor-pointer justify-center w-9 h-9 rounded-full transition-all shadow-md 
                ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                title="Stage Guidelines"
            >
                {/* FontAwesome Lightbulb Icon */}
                <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-lightbulb'} text-lg`}></i>
            </button>

            {/* --- The Popup Content --- */}
            {isOpen && (
                <div className="absolute top-12 right-0 w-80 max-w-[calc(100vw-20px)] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 px-4 flex justify-between items-center text-white shadow-sm">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                            <i className="fa-solid fa-book-open"></i>
                            <span>Stage Guidelines</span>
                        </h4>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 cursor-pointer hover:text-white transition-colors"
                        >
                            <i className="fa-solid fa-times text-sm"></i>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-gray-50/50">

                        {tipsLoading && (
                            <div className="text-center text-gray-400 py-2">
                                <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Loading...
                            </div>
                        )}

                        {/* Tip List */}
                        <div className="space-y-3">
                            {stageData?.guidelines?.length > 0 ? (
                                stageData.guidelines.map((tip: any, index: number) => (
                                    <div key={tip._id || index} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm group relative hover:shadow-md transition-shadow">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5">
                                                <i className="fa-solid fa-info-circle text-blue-500 text-sm"></i>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed break-words w-full">
                                                {tip.tips}
                                            </p>
                                        </div>

                                        {/* Admin Actions (Visible on Hover) */}
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white pl-1 rounded">
                                                <button
                                                    onClick={() => handleEditStart(tip)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <i className="fa-solid fa-pen text-xs"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tip._id)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                !tipsLoading && (
                                    <div className="text-center py-6 flex flex-col items-center text-gray-400">
                                        <i className="fa-regular fa-clipboard text-2xl mb-2 opacity-50"></i>
                                        <p className="text-xs">No tips added for this stage yet.</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Add / Edit Form (Admin Only) */}
                        {isAdmin && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                {isEditing ? (
                                    <div className="space-y-2 bg-white p-2 rounded border border-blue-100">
                                        <textarea
                                            value={newTipText}
                                            onChange={(e) => setNewTipText(e.target.value)}
                                            placeholder="Enter tip guidelines..."
                                            className="w-full text-sm p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                            rows={3}
                                            autoFocus
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => { setIsEditing(false); setNewTipText(""); setEditingTipId(null); }}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveTip}
                                                disabled={isSaving}
                                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                                            >
                                                {isSaving ? (
                                                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</>
                                                ) : (
                                                    <><i className="fa-solid fa-check"></i> Save Tip</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-plus"></i> Add New Guideline
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer - Global Toggle */}
                    <div className="bg-gray-100/80 p-3 border-t border-gray-200 flex items-center justify-between backdrop-blur-sm">
                        <label className="flex items-center gap-3 cursor-pointer group w-full">
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!isGuideRequired} // Checked implies "Disabled" (Don't show)
                                    onChange={handleGlobalToggle}
                                />
                                {/* Toggle Switch UI */}
                                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:border-gray-300 after:border after:rounded-full 
                                    after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
                                </div>
                            </div>
                            <span className="text-[11px] text-gray-600 font-medium group-hover:text-blue-700 transition-colors select-none">
                                Don't show automatically
                            </span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StageGuide;