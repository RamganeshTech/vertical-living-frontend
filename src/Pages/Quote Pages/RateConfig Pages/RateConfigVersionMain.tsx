// import React, { useEffect, useRef, useCallback, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { useGetAllItemVersions } from "../../../apiList/Quote Api/RateConfig Api/rateConfigVersionApi";

// const RateConfigVersionMain: React.FC = () => {
//     const { id: categoryId, organizationId } = useParams<{ id: string, organizationId: string }>();

//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//         error,
//     } = useGetAllItemVersions({
//         organizationId,
//         categoryId,
//         limit: 10,
//     });

//     const observerElem = useRef<HTMLDivElement | null>(null);

//     const handleObserver = useCallback(
//         (entries: IntersectionObserverEntry[]) => {
//             const [target] = entries;
//             if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
//                 fetchNextPage();
//             }
//         },
//         [fetchNextPage, hasNextPage, isFetchingNextPage]
//     );

//     useEffect(() => {
//         const element = observerElem.current;
//         const option = { threshold: 0 };

//         const observer = new IntersectionObserver(handleObserver, option);
//         if (element) observer.observe(element);

//         return () => {
//             if (element) observer.unobserve(element);
//         };
//     }, [handleObserver]);

//     // Format just the time (e.g., "4:57 PM") for the individual cards
//     const formatTime = (dateString: string) => {
//         const date = new Date(dateString);
//         return new Intl.DateTimeFormat("en-US", {
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//         }).format(date);
//     };

//     const getItemIdentifier = (itemData: Record<string, any>) => {
//         return itemData["Brand"] || itemData["brand"] || itemData["Name"] || itemData["name"] || "Unknown Item";
//     };

//     // 1. Flatten all pages into a single array of versions
//     const flattenedVersions = useMemo(() => {
//         if (!data?.pages) return [];
//         return data.pages.flatMap((page: any) => page.versions);
//     }, [data?.pages]);

//     // 2. Group versions by Date, maintaining the sorted order from the backend
//     const groupedVersions = useMemo(() => {
//         const groups: { date: string; items: any[] }[] = [];
//         let currentDate = "";

//         flattenedVersions.forEach((version: any) => {
//             // Extract just the Date part (e.g., "Apr 4, 2026")
//             const dateStr = new Intl.DateTimeFormat("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//             }).format(new Date(version.createdAt));

//             // If it's a new date, create a new group. Otherwise, add to the current group.
//             if (dateStr !== currentDate) {
//                 groups.push({ date: dateStr, items: [version] });
//                 currentDate = dateStr;
//             } else {
//                 groups[groups.length - 1].items.push(version);
//             }
//         });

//         return groups;
//     }, [flattenedVersions]);

//     // 3. Keep the Master List of keys so all columns (like Notes) show up
//     const masterDataKeys = useMemo(() => {
//         const keys = new Set<string>();
//         flattenedVersions.forEach((version: any) => {
//             Object.keys(version.data || {}).forEach(key => keys.add(key));
//         });
//         return Array.from(keys);
//     }, [flattenedVersions]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64 text-gray-500">
//                 <i className="fa-solid fa-spinner fa-spin text-3xl mr-3"></i>
//                 <span>Loading Category History...</span>
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="p-4 bg-red-50 text-red-600 rounded-md shadow-sm">
//                 <i className="fa-solid fa-triangle-exclamation mr-2"></i>
//                 Error loading history: {(error as Error).message}
//             </div>
//         );
//     }

//     const isEmpty = groupedVersions.length === 0;

//     return (
//         <div className="max-w-full mx-auto p-2 w-full">
//             {/* Header */}
//             <div className="mb-8 border-b pb-4 flex items-center">
//                 <i className="fa-solid fa-clock-rotate-left text-2xl text-blue-600 mr-3"></i>
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Category History</h2>
//                     <p className="text-sm text-gray-500">Track all changes made to items within this category over time.</p>
//                 </div>
//             </div>

//             {isEmpty ? (
//                 <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                     <i className="fa-regular fa-folder-open text-4xl text-gray-400 mb-3"></i>
//                     <p className="text-gray-500">No version history found for this category.</p>
//                 </div>
//             ) : (
//                 <div className="ml-2 md:ml-4">
//                     {groupedVersions.map((group, groupIndex) => (
//                         <div key={groupIndex} className="mb-10">
//                             {/* Date Header (Shows only once per day) */}
//                             <div className="flex items-center mb-6 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-2">
//                                 <span className="bg-gray-100 text-gray-700 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center">
//                                     <i className="fa-regular fa-calendar-days mr-2 text-blue-500"></i>
//                                     {group.date}
//                                 </span>
//                                 <div className="flex-grow ml-4 border-t border-gray-200"></div>
//                             </div>

//                             {/* Timeline for items within this specific day */}
//                             <div className="relative border-l-2 border-blue-200 ml-4 md:ml-6 space-y-8 pb-4">
//                                 {group.items.map((version: any) => {
//                                     const itemName = getItemIdentifier(version.data || {});

//                                     return (
//                                         <div key={version._id} className="pl-8 relative group">
//                                             {/* Timeline Time Dot */}
//                                             <div className="absolute -left-[0.4rem] top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white shadow-sm transition-transform group-hover:scale-125"></div>

//                                             {/* Content Card */}
//                                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//                                                 {/* Card Header (Now showing just the TIME instead of full Date+Time) */}
//                                                 <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//                                                     <div className="flex items-center">
//                                                         <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-md text-sm">
//                                                             <i className="fa-solid fa-box-open mr-2"></i>
//                                                             {itemName}
//                                                         </span>
//                                                         {version.materialType && (
//                                                             <span className="ml-2 text-sm text-gray-500 capitalize">
//                                                                 ({version.materialType})
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     <div className="text-sm font-medium text-gray-500 flex items-center bg-white px-2.5 py-1 rounded border border-gray-200">
//                                                         <i className="fa-regular fa-clock mr-1.5 text-blue-400"></i>
//                                                         {formatTime(version.createdAt)}
//                                                     </div>
//                                                 </div>

//                                                 {/* Card Body - Data Table */}
//                                                 <div className="p-4 overflow-x-auto">
//                                                     <table className="w-full text-sm text-left border-collapse min-w-max">
//                                                         <thead>
//                                                             <tr className="bg-gray-50 text-gray-700">
//                                                                 {masterDataKeys.map((key) => (
//                                                                     <th key={key} className="px-4 py-2 font-medium border border-gray-200 whitespace-nowrap capitalize">
//                                                                         {key}
//                                                                     </th>
//                                                                 ))}
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             <tr>
//                                                                 {masterDataKeys.map((key) => {
//                                                                     const value = version.data[key];
                                                                    
//                                                                     return (
//                                                                         <td key={key} className="px-4 py-3 border border-gray-200 text-gray-600 max-w-xs truncate" title={value?.toString()}>
//                                                                             {typeof value === "boolean"
//                                                                                 ? value
//                                                                                     ? <i className="fa-solid fa-check text-green-500"></i>
//                                                                                     : <i className="fa-solid fa-xmark text-red-500"></i>
//                                                                                 : value !== null && value !== undefined
//                                                                                     ? value.toString()
//                                                                                     : <span className="text-gray-300">-</span>}
//                                                                         </td>
//                                                                     )
//                                                                 })}
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Loading Trigger / Spinner */}
//             <div ref={observerElem} className="w-full py-4 flex justify-center">
//                 {isFetchingNextPage && (
//                     <div className="text-gray-500 flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
//                         <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
//                         Loading older versions...
//                     </div>
//                 )}
//                 {!hasNextPage && !isEmpty && (
//                     <p className="text-gray-400 text-sm py-4">
//                         <i className="fa-solid fa-flag-checkered mr-2"></i>
//                         You have reached the end of the history.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RateConfigVersionMain;

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetAllItemVersions } from "../../../apiList/Quote Api/RateConfig Api/rateConfigVersionApi";

const RateConfigVersionMain: React.FC = () => {
    const { id: categoryId, organizationId } = useParams<{ id: string, organizationId: string }>();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useGetAllItemVersions({
        organizationId,
        categoryId,
        limit: 10,
    });

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

    // Format just the time (e.g., "4:57 PM") for the individual cards
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const getItemIdentifier = (itemData: Record<string, any>) => {
        return itemData["Brand"] || itemData["brand"] || itemData["Name"] || itemData["name"] || "Unknown Item";
    };

    // 1. Flatten all pages into a single array of versions
    const flattenedVersions = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page: any) => page.versions);
    }, [data?.pages]);

    // 2. Group versions by Date, maintaining the sorted order from the backend
    const groupedVersions = useMemo(() => {
        const groups: { date: string; items: any[] }[] = [];
        let currentDate = "";

        flattenedVersions.forEach((version: any) => {
            // Extract just the Date part (e.g., "Apr 4, 2026")
            const dateStr = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }).format(new Date(version.createdAt));

            // If it's a new date, create a new group. Otherwise, add to the current group.
            if (dateStr !== currentDate) {
                groups.push({ date: dateStr, items: [version] });
                currentDate = dateStr;
            } else {
                groups[groups.length - 1].items.push(version);
            }
        });

        return groups;
    }, [flattenedVersions]);

    // 3. Keep the Master List of keys so all columns (like Notes) show up
    const masterDataKeys = useMemo(() => {
        const keys = new Set<string>();
        flattenedVersions.forEach((version: any) => {
            Object.keys(version.data || {}).forEach(key => keys.add(key));
        });
        return Array.from(keys);
    }, [flattenedVersions]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <i className="fa-solid fa-spinner fa-spin text-3xl mr-3"></i>
                <span>Loading Category History...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md shadow-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                Error loading history: {(error as Error).message}
            </div>
        );
    }

    const isEmpty = groupedVersions.length === 0;

    return (
        <div className="max-w-full mx-auto p-2 w-full">
            {/* Header */}
            <div className="mb-8 border-b pb-4 flex items-center">
                <i className="fa-solid fa-clock-rotate-left text-2xl text-blue-600 mr-3"></i>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Category History</h2>
                    <p className="text-sm text-gray-500">Track all changes made to items within this category over time.</p>
                </div>
            </div>

            {isEmpty ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <i className="fa-regular fa-folder-open text-4xl text-gray-400 mb-3"></i>
                    <p className="text-gray-500">No version history found for this category.</p>
                </div>
            ) : (
                <div className="ml-2 md:ml-4">
                    {groupedVersions.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-10">
                            {/* Date Header (Shows only once per day) */}
                            <div className="flex items-center mb-6 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-2">
                                <span className="bg-gray-100 text-gray-700 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center">
                                    <i className="fa-regular fa-calendar-days mr-2 text-blue-500"></i>
                                    {group.date}
                                </span>
                                <div className="flex-grow ml-4 border-t border-gray-200"></div>
                            </div>

                            {/* Timeline for items within this specific day */}
                            <div className="relative border-l-2 border-blue-200 ml-4 md:ml-6 space-y-8 pb-4">
                                {group.items.map((version: any) => {
                                    const itemName = getItemIdentifier(version.data || {});

                                    return (
                                        <div key={version._id} className="pl-8 relative group">
                                            {/* Timeline Time Dot */}
                                            <div className="absolute -left-[0.4rem] top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white shadow-sm transition-transform group-hover:scale-125"></div>

                                            {/* Content Card */}
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                                {/* Card Header (Now showing just the TIME instead of full Date+Time) */}
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                    <div className="flex items-center">
                                                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-md text-sm">
                                                            <i className="fa-solid fa-box-open mr-2"></i>
                                                            {itemName}
                                                        </span>
                                                        {version.materialType && (
                                                            <span className="ml-2 text-sm text-gray-500 capitalize">
                                                                ({version.materialType})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-500 flex items-center bg-white px-2.5 py-1 rounded border border-gray-200">
                                                        <i className="fa-regular fa-clock mr-1.5 text-blue-400"></i>
                                                        {formatTime(version.createdAt)}
                                                    </div>
                                                </div>

                                                {/* Card Body - Data Table */}
                                                <div className="p-4 overflow-x-auto">
                                                    <table className="w-full text-sm text-left border-collapse min-w-max">
                                                        <thead>
                                                            <tr className="bg-gray-50 text-gray-700">
                                                                {masterDataKeys.map((key) => (
                                                                    <th key={key} className="px-4 py-2 font-medium border border-gray-200 whitespace-nowrap capitalize">
                                                                        {key}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                {masterDataKeys.map((key) => {
                                                                    const value = version.data[key];
                                                                    
                                                                    return (
                                                                        <td key={key} className="px-4 py-3 border border-gray-200 text-gray-600 max-w-xs truncate" title={value?.toString()}>
                                                                            {typeof value === "boolean"
                                                                                ? value
                                                                                    ? <i className="fa-solid fa-check text-green-500"></i>
                                                                                    : <i className="fa-solid fa-xmark text-red-500"></i>
                                                                                : value !== null && value !== undefined
                                                                                    ? value.toString()
                                                                                    : <span className="text-gray-300">-</span>}
                                                                        </td>
                                                                    )
                                                                })}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading Trigger / Spinner */}
            <div ref={observerElem} className="w-full py-4 flex justify-center">
                {isFetchingNextPage && (
                    <div className="text-gray-500 flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
                        <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                        Loading older versions...
                    </div>
                )}
                {!hasNextPage && !isEmpty && (
                    <p className="text-gray-400 text-sm py-4">
                        <i className="fa-solid fa-flag-checkered mr-2"></i>
                        You have reached the end of the history.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RateConfigVersionMain;