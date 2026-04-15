// import React, { useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetSingleRateConfigBackup, useRestoreRateConfigBackup } from "../../../apiList/Quote Api/RateConfigBackup_Api/RateConfigBackupApi";
// // Adjust imports to match your project
// // import { useGetSingleRateConfigBackup, useRestoreRateConfigBackup } from "../../../apiList/Quote Api/RateConfig Api/rateConfigBackupApi";

// const RateConfigBackupSingle: React.FC = () => {
//     const { organizationId, backupId } = useParams<{ organizationId: string; backupId: string }>();
//     const navigate = useNavigate();

//     const { data: backup, isLoading, isError, error } = useGetSingleRateConfigBackup({
//         backupId,
//     });

//     const restoreMutation = useRestoreRateConfigBackup();

//     // --- Render Helpers ---
//     const formatDate = (dateString: string) => {
//         return new Intl.DateTimeFormat("en-US", {
//             month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
//         }).format(new Date(dateString));
//     };

//     const handleRestore = () => {
//         if (!organizationId || !backupId || !backup) return;

//         const confirmed = window.confirm(`Are you sure you want to restore "${backup.displayName}"?`);
//         if (!confirmed) return;

//         restoreMutation.mutate(
//             { organizationId, backupId },
//             {
//                 onSuccess: () => {
//                     alert(`Successfully restored: ${backup.displayName}`);
//                     navigate(-1); // Go back to the recycle bin list after restoring
//                 },
//                 onError: (err: any) => {
//                     alert(`Failed to restore: ${err.message}`);
//                 }
//             }
//         );
//     };

//     // Calculate columns dynamically if it's a bundle with multiple items
//     const tableColumns = useMemo(() => {
//         if (backup?.backupType === "CATEGORY_BUNDLE" && backup.snapshotData?.items) {
//             const keys = new Set<string>();
//             backup.snapshotData.items.forEach((item: any) => {
//                 Object.keys(item.data || {}).forEach(key => keys.add(key));
//             });
//             return Array.from(keys);
//         }
//         return [];
//     }, [backup]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64 text-gray-500">
//                 <i className="fa-solid fa-spinner fa-spin text-3xl mr-3"></i>
//                 <span>Loading backup details...</span>
//             </div>
//         );
//     }

//     if (isError || !backup) {
//         return (
//             <div className="p-4 bg-red-50 text-red-600 rounded-lg max-w-5xl mx-auto mt-6">
//                 <i className="fa-solid fa-triangle-exclamation mr-2"></i>
//                 Error loading backup: {(error as Error)?.message || "Not found"}
//             </div>
//         );
//     }

//     const isBundle = backup.backupType === "CATEGORY_BUNDLE";

//     return (
//         <div className="max-w-[90%] p-4 md:p-6 w-[100%]">
//             {/* Top Navigation */}
//             <button
//                 onClick={() => navigate(-1)}
//                 className="mb-6 text-gray-500 hover:text-blue-600 flex items-center transition-colors text-sm font-medium"
//             >
//                 <i className="fa-solid fa-arrow-left mr-2"></i>
//                 Back to Recycle Bin
//             </button>

//             {/* Header Card */}
//             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
//                 <div>
//                     <div className="flex items-center gap-3 mb-2">
//                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner ${isBundle ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
//                             <i className={`fa-solid ${isBundle ? 'fa-layer-group' : 'fa-cube'} text-xl`}></i>
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-800">{backup.displayName}</h1>
//                             <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isBundle ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
//                                 }`}>
//                                 {isBundle ? 'Category Bundle' : 'Single Item Backup'}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                         <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
//                             <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Deleted By</p>
//                             <div className="font-medium flex items-center">
//                                 <i className="fa-regular fa-user mr-2 text-gray-400"></i>
//                                 {backup.deletedBy?.name}
//                             </div>
//                         </div>
//                         <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
//                             <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Date Deleted</p>
//                             <div className="font-medium flex items-center">
//                                 <i className="fa-regular fa-calendar-xmark mr-2 text-gray-400"></i>
//                                 {formatDate(backup.createdAt)}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex-shrink-0">
//                     <button
//                         onClick={handleRestore}
//                         disabled={restoreMutation.isPending}
//                         className="w-full md:w-auto flex items-center justify-center px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-300"
//                     >
//                         {restoreMutation.isPending ? (
//                             <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Restoring...</>
//                         ) : (
//                             <><i className="fa-solid fa-rotate-left mr-2"></i> Restore Data</>
//                         )}
//                     </button>
//                     <p className="text-center text-xs text-gray-400 mt-2">
//                         Expires: {formatDate(backup.expiresAt)}
//                     </p>
//                 </div>
//             </div>

//             {/* Content Payload Section */}
//             <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
//                 <i className="fa-solid fa-file-invoice mr-2 text-gray-400"></i>
//                 Backup Contents
//             </h3>

//             {isBundle ? (
//                 /* CATEGORY BUNDLE VIEW */
//                 <div className="space-y-6">
//                     {/* Category Info */}
//                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
//                         <h4 className="font-semibold text-gray-700 mb-2">Category Configuration</h4>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                             <div>
//                                 <span className="block text-gray-400 text-xs">Name</span>
//                                 <span className="font-medium">{backup.snapshotData.category?.name || '-'}</span>
//                             </div>
//                             <div>
//                                 <span className="block text-gray-400 text-xs">Product Specific</span>
//                                 <span className="font-medium">{backup.snapshotData.category?.isProductSpecific ? 'Yes' : 'No'}</span>
//                             </div>
//                             <div className="col-span-2">
//                                 <span className="block text-gray-400 text-xs">Configured Fields</span>
//                                 <span className="font-medium text-gray-600">
//                                     {backup.snapshotData.category?.fields?.map((f: any) => f.key).join(", ") || 'None'}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Items Table */}
//                     <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//                         <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
//                             <h4 className="font-semibold text-gray-700">Associated Items</h4>
//                             <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
//                                 {backup.itemCount} Total
//                             </span>
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm text-left border-collapse min-w-max">
//                                 <thead>
//                                     <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
//                                         {tableColumns.map((key) => (
//                                             <th key={key} className="px-4 py-3 font-medium capitalize">{key}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100">
//                                     {backup.snapshotData.items?.map((item: any, idx: number) => (
//                                         <tr key={idx} className="hover:bg-gray-50">
//                                             {tableColumns.map((key) => {
//                                                 const val = item.data?.[key];
//                                                 return (
//                                                     <td key={key} className="px-4 py-3 text-gray-600 max-w-xs truncate" title={val?.toString()}>
//                                                         {typeof val === 'boolean'
//                                                             ? (val ? <i className="fa-solid fa-check text-green-500"></i> : <i className="fa-solid fa-xmark text-red-500"></i>)
//                                                             : (val !== undefined && val !== null ? val.toString() : '-')}
//                                                     </td>
//                                                 );
//                                             })}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 /* SINGLE ITEM VIEW */
//                 <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//                     <div className="bg-gray-50 px-4 py-3 border-b">
//                         <h4 className="font-semibold text-gray-700">Item Data</h4>
//                     </div>
//                     <div className="p-0">
//                         <table className="w-full text-sm text-left">
//                             <tbody className="divide-y divide-gray-100">
//                                 {Object.entries(backup.snapshotData.singleItem?.data || {}).map(([key, value]) => (
//                                     <tr key={key} className="hover:bg-gray-50">
//                                         <td className="px-4 py-3 font-medium text-gray-700 w-1/3 bg-gray-50/50 capitalize border-r">{key}</td>
//                                         <td className="px-4 py-3 text-gray-600">
//                                             {typeof value === 'boolean'
//                                                 ? (value ? <span className="text-green-600 font-medium">Yes</span> : <span className="text-red-600 font-medium">No</span>)
//                                                 : (value !== undefined && value !== null ? (value as any).toString() : '-')}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RateConfigBackupSingle;


import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleRateConfigBackup, useRestoreRateConfigBackup } from "../../../apiList/Quote Api/RateConfigBackup_Api/RateConfigBackupApi";

const RateConfigBackupSingle: React.FC = () => {
    const { organizationId, backupId } = useParams<{ organizationId: string; backupId: string }>();
    const navigate = useNavigate();

    const { data: backup, isLoading, isError, error } = useGetSingleRateConfigBackup({
        backupId,
    });

    const restoreMutation = useRestoreRateConfigBackup();

    // --- Render Helpers ---
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short", day: "numeric", year: "numeric", 
            hour: "numeric", minute: "2-digit", hour12: true,
        }).format(new Date(dateString));
    };

    const handleRestore = () => {
        if (!organizationId || !backupId || !backup) return;

        const confirmed = window.confirm(`Are you sure you want to restore "${backup.displayName}"?`);
        if (!confirmed) return;

        restoreMutation.mutate(
            { organizationId, backupId },
            {
                onSuccess: () => {
                    alert(`Successfully restored: ${backup.displayName}`);
                    navigate(-1);
                },
                onError: (err: any) => {
                    alert(`Failed to restore: ${err.message}`);
                }
            }
        );
    };

    // Calculate columns dynamically if it's a bundle with multiple items
    const tableColumns = useMemo(() => {
        if (backup?.backupType === "CATEGORY_BUNDLE" && backup.snapshotData?.items) {
            const keys = new Set<string>();
            backup.snapshotData.items.forEach((item: any) => {
                Object.keys(item.data || {}).forEach(key => keys.add(key));
            });
            return Array.from(keys);
        }
        return [];
    }, [backup]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
                <span className="font-medium">Decrypting Vault Contents...</span>
            </div>
        );
    }

    if (isError || !backup) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl max-w-5xl mx-auto mt-8 flex items-start shadow-sm">
                <i className="fa-solid fa-triangle-exclamation text-2xl mr-4 mt-0.5"></i>
                <div>
                    <h3 className="font-bold text-lg">Unable to load backup data</h3>
                    <p className="text-sm mt-1">{(error as Error)?.message || "The requested backup record could not be found or has expired."}</p>
                    <button onClick={() => navigate(-1)} className="mt-4 text-sm font-medium text-red-800 hover:underline">
                        &larr; Return to Recycle Bin
                    </button>
                </div>
            </div>
        );
    }

    const isBundle = backup.backupType === "CATEGORY_BUNDLE";

    return (
        <div className="max-w-full mx-auto w-full max-h-full overflow-y-auto">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-sm font-medium text-gray-500 mb-6">
                <button onClick={() => navigate(-1)} className="hover:text-blue-600 cursor-pointer transition-colors">
                    Recycle Bin
                </button>
                <i className="fa-solid fa-chevron-right text-[10px] mx-3 text-gray-400"></i>
                <span className="text-gray-800 truncate max-w-[200px] md:max-w-md">
                    {backup.displayName}
                </span>
            </nav>

            {/* Main Header Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gray-50 rounded-full opacity-50 pointer-events-none"></div>

                <div className="z-10 flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-inner flex-shrink-0 ${isBundle ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
                            <i className={`fa-solid ${isBundle ? 'fa-layer-group' : 'fa-cube'} text-2xl`}></i>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                {backup.displayName}
                            </h1>
                            <div className="flex items-center mt-2 gap-3">
                                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${isBundle ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                    {isBundle ? 'Category Bundle' : 'Single Item'}
                                </span>
                                {isBundle && (
                                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                                        {backup.itemCount} Items Inside
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-y-4 gap-x-8 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Deleted By</p>
                            <div className="font-medium text-gray-800 flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-500 text-xs">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                {backup.deletedBy?.name}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Timestamp</p>
                            <div className="font-medium text-gray-800 flex items-center h-6">
                                <i className="fa-regular fa-calendar-xmark mr-2 text-red-400"></i>
                                {formatDate(backup.createdAt)}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Auto-Deletes On</p>
                            <div className="font-medium text-gray-800 flex items-center h-6">
                                <i className="fa-solid fa-stopwatch mr-2 text-orange-400"></i>
                                {formatDate(backup.expiresAt)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex-shrink-0 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 pt-6 lg:pt-0 border-gray-100">
                    <button
                        onClick={handleRestore}
                        disabled={restoreMutation.isPending}
                        className="w-full lg:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 hover:shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed group"
                    >
                        {restoreMutation.isPending ? (
                            <><i className="fa-solid fa-circle-notch fa-spin mr-3"></i> Restoring Data...</>
                        ) : (
                            <>
                                <i className="fa-solid fa-rotate-left mr-3 group-hover:-rotate-45 transition-transform duration-300"></i> 
                                Restore to Live Database
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Detailed Content Section */}
            <div className="mb-6 flex items-center">
                <h3 className="text-xl font-bold text-gray-800">
                    Vault Contents
                </h3>
                <div className="flex-grow ml-4 border-t border-gray-200"></div>
            </div>

            {isBundle ? (
                /* CATEGORY BUNDLE VIEW */
                <div className="space-y-8">
                    {/* Category Configuration Panel */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200">
                            <h4 className="font-bold text-gray-800 flex items-center">
                                <i className="fa-solid fa-sliders mr-2 text-gray-400"></i>
                                Category Settings
                            </h4>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Base Name</span>
                                <span className="font-semibold text-gray-800 text-base">{backup.snapshotData.category?.name || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Product Specific</span>
                                {backup.snapshotData.category?.isProductSpecific ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-50 text-green-700 font-semibold border border-green-200">
                                        <i className="fa-solid fa-check mr-1.5"></i> Yes
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold border border-gray-200">
                                        <i className="fa-solid fa-minus mr-1.5"></i> No
                                    </span>
                                )}
                            </div>
                            <div className="md:col-span-3">
                                <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Configured Data Fields</span>
                                <div className="flex flex-wrap gap-2">
                                    {backup.snapshotData.category?.fields?.length > 0 ? (
                                        backup.snapshotData.category.fields.map((f: any, idx: number) => (
                                            <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-semibold flex items-center">
                                                {f.key}
                                                <span className="ml-2 opacity-50 font-normal">({f.type})</span>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No custom fields defined.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Associated Items Table */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h4 className="font-bold text-gray-800 flex items-center">
                                <i className="fa-solid fa-table-list mr-2 text-gray-400"></i>
                                Associated Items Data
                            </h4>
                            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                                {backup.snapshotData.items?.length || 0} Rows
                            </span>
                        </div>
                        
                        {backup.snapshotData.items?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-200">
                                            {tableColumns.map((key) => (
                                                <th key={key} className="px-5 py-3.5 font-bold text-gray-600 capitalize bg-gray-50/50">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {backup.snapshotData.items.map((item: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                                                {tableColumns.map((key) => {
                                                    const val = item.data?.[key];
                                                    return (
                                                        <td key={key} className="px-5 py-3 text-gray-700 max-w-[200px] truncate" title={val?.toString()}>
                                                            {typeof val === 'boolean'
                                                                ? (val ? <i className="fa-solid fa-check text-green-500"></i> : <i className="fa-solid fa-xmark text-gray-300"></i>)
                                                                : (val !== undefined && val !== null && val !== "" ? val.toString() : <span className="text-gray-300">-</span>)}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fa-regular fa-folder-open text-3xl mb-3 text-gray-300"></i>
                                <p>This category was empty when it was deleted.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* SINGLE ITEM VIEW */
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-3xl">
                    <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200">
                        <h4 className="font-bold text-gray-800 flex items-center">
                            <i className="fa-solid fa-file-lines mr-2 text-gray-400"></i>
                            Item Properties
                        </h4>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-sm text-left">
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(backup.snapshotData.singleItem?.data || {}).length > 0 ? (
                                    Object.entries(backup.snapshotData.singleItem?.data || {}).map(([key, value]) => (
                                        <tr key={key} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3.5 font-bold text-gray-600 w-1/3 bg-gray-50/50 capitalize border-r border-gray-100">
                                                {key}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-800 font-medium">
                                                {typeof value === 'boolean'
                                                    ? (value ? <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">Yes</span> : <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">No</span>)
                                                    : (value !== undefined && value !== null && value !== "" ? (value as any).toString() : <span className="text-gray-300 italic">Empty</span>)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="p-6 text-center text-gray-500 italic">No data properties found for this item.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RateConfigBackupSingle;