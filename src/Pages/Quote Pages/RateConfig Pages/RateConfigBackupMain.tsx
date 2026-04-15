import React, { useEffect, useRef, useCallback, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGetRateConfigBackups, useRestoreRateConfigBackup } from "../../../apiList/Quote Api/RateConfigBackup_Api/RateConfigBackupApi";
// Adjust these imports to your actual file structure
// import { useGetRateConfigBackups, useRestoreRateConfigBackup } from "../../../apiList/Quote Api/RateConfig Api/rateConfigBackupApi";

const RateConfigBackupMain: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
const navigate = useNavigate();
    // --- Query Hooks ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useGetRateConfigBackups({
        organizationId,
        limit: 10,
    });

    const restoreMutation = useRestoreRateConfigBackup();
    const [restoringId, setRestoringId] = useState<string | null>(null);

    // --- Infinite Scroll Observer Setup ---
    const observerElem = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const element = observerElem.current;
        const option = { threshold: 0 };
        const observer = new IntersectionObserver(handleObserver, option);
        if (element) observer.observe(element);
        return () => {
            if (element) observer.unobserve(element);
        };
    }, [handleObserver]);

    // --- Helpers ---
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const handleRestore = (backupId: string, displayName: string) => {
        if (!organizationId) return;
        
        // Safety confirmation before restoring
        const confirmed = window.confirm(`Are you sure you want to restore "${displayName}"?`);
        if (!confirmed) return;

        setRestoringId(backupId);
        restoreMutation.mutate(
            { organizationId, backupId },
            {
                onSuccess: () => {
                    alert(`Successfully restored: ${displayName}`);
                    setRestoringId(null);
                },
                onError: (err: any) => {
                    alert(`Failed to restore: ${err.message}`);
                    setRestoringId(null);
                }
            }
        );
    };

    // ⭐️ CONDITIONAL RENDERING: If the URL has "single", show the child route
    if (location.pathname.includes("single")) {
        return <Outlet />;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <i className="fa-solid fa-spinner fa-spin text-3xl mr-3"></i>
                <span>Loading Recycle Bin...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg shadow-sm max-w-5xl mx-auto mt-6">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                Error loading backups: {(error as Error).message}
            </div>
        );
    }

    const pages = data?.pages || [];
    const flattenedBackups = pages.flatMap((page: any) => page.backups || []);
    const isEmpty = flattenedBackups.length === 0;

    return (
        <div className="max-w-full mx-auto p-2 w-full">
            {/* Header */}
            <div className="mb-8 border-b pb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={()=> navigate(-1)} className="bg-indigo-50 cursor-pointer text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                        <i className="fa-solid fa-arrow-left text-xl"></i>
                    </button>
                    {/* <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <i className="fa-solid fa-trash-can text-xl"></i>
                    </div> */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Recycle Bin</h2>
                        <p className="text-sm text-gray-500">Restore deleted categories and items.</p>
                    </div>
                </div>
                <div className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                    <i className="fa-solid fa-circle-info mr-2"></i>
                    Items are permanently deleted after 30 days.
                </div>
            </div>

            {isEmpty ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <i className="fa-solid fa-box-open text-5xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-700">Recycle Bin is empty</h3>
                    <p className="text-gray-500 mt-1">No deleted items found for your organization.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {flattenedBackups.map((backup: any) => {
                        const isBundle = backup.backupType === "CATEGORY_BUNDLE";
                        const isRestoring = restoringId === backup._id;

                        return (
                            <div 
                                key={backup._id} 
                                onClick={() => navigate(`single/${backup._id}`)}
                                className="bg-white cursor-pointer border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                {/* Left Section: Details */}
                                <div className="flex items-start gap-4">
                                    {/* Icon Indicator */}
                                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-inner ${isBundle ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                                        <i className={`fa-solid ${isBundle ? 'fa-layer-group' : 'fa-cube'} text-lg`}></i>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {backup.displayName}
                                            </h3>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                                                isBundle 
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {isBundle ? 'Category Bundle' : 'Single Item'}
                                            </span>
                                            {isBundle && (
                                                <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
                                                    {backup.itemCount} items
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                                            <div className="flex items-center">
                                                <i className="fa-regular fa-clock mr-1.5 text-gray-400"></i>
                                                Deleted: {formatDate(backup.createdAt)}
                                            </div>
                                            <div className="flex items-center">
                                                <i className="fa-regular fa-user mr-1.5 text-gray-400"></i>
                                                By: <span className="font-medium text-gray-700 ml-1">{backup.deletedBy?.name || 'Unknown User'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Action Button */}
                                <div className="flex-shrink-0 flex justify-end md:justify-start mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                                    <button
                                        onClick={() => handleRestore(backup._id, backup.displayName)}
                                        disabled={isRestoring || restoreMutation.isPending}
                                        className={`flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                            isRestoring
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600"
                                        }`}
                                    >
                                        {isRestoring ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                                Restoring...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-rotate-left mr-2"></i>
                                                Restore
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerElem} className="w-full py-6 flex justify-center">
                {isFetchingNextPage && (
                    <div className="text-gray-500 flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                        <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                        Loading older backups...
                    </div>
                )}
                {!hasNextPage && !isEmpty && (
                    <p className="text-gray-400 text-sm flex items-center">
                        <i className="fa-solid fa-check-double mr-2"></i>
                        You have reached the end of the recycle bin.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RateConfigBackupMain;