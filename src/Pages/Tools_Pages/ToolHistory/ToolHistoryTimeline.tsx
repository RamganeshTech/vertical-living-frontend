import React, { useEffect, useRef, useCallback } from 'react';
import { useGetToolHistoryInfinite } from '../../../apiList/tools_api/toolOtpApi';
import { dateFormate, formatTime } from '../../../utils/dateFormator';
import ImageGalleryExample from '../../../shared/ImageGallery/ImageGalleryMain';
// import { useGetToolHistoryInfinite } from '../../../hooks/useToolHistory';
// import { dateFormate, formatTime } from '../../../utils/dateUtils';

interface ToolHistoryTimelineProps {
    toolId: string;
    organizationId: string;
}

const ToolHistoryTimeline: React.FC<ToolHistoryTimelineProps> = ({ toolId, organizationId }) => {
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error
    } = useGetToolHistoryInfinite(toolId, { organizationId });

    // --- MANUAL INTERSECTION OBSERVER LOGIC ---
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1, // Trigger when 10% of the element is visible
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver]);

    if (status === 'pending') return <div className="p-10 text-center"><i className="fa-solid fa-spinner fa-spin"></i> Loading...</div>;
    if (status === 'error') return <div className="p-4 text-red-500 text-center">Error: {(error as any).message}</div>;

    return (
        <section className="mt-6 border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-md font-bold text-gray-700">Tool Log History</h3>
            </div>

            <div className="p-5">
                {/* Timeline Container */}
                <div className="relative border-l-2 border-blue-100 ml-4 pb-4">
                    {data?.pages.map((page) =>
                        page.data
                            .filter((event: any) => event !== null)
                            .map((event: any, idx: number) => (
                                <>


                                    <div key={`${event.date}-${idx}`} className="mb-8 ml-8 relative group">
                                        {/* Timeline Icon Node - Enhanced with Ring effect */}
                                        <span className={`absolute -left-[41px] top-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white z-10 transition-transform group-hover:scale-110 ${event.eventType === 'ISSUE' ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-600 ring-2 ring-amber-100'
                                            }`}>
                                            <i className={`fa-solid ${event.eventType === 'ISSUE' ? 'fa-arrow-up-from-bracket' : 'fa-arrow-down-to-bracket'} text-[12px]`}></i>
                                        </span>

                                        {/* Header: Event Type & Timestamp Only */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] tracking-widest font-black px-3 py-1 rounded-lg uppercase shadow-sm border ${event.eventType === 'ISSUE'
                                                ? 'bg-emerald-50 border-emerald-200 text-ambemeralder-700'
                                                : 'bg-amber-50 border-amber-200 text-amber-700'
                                                }`}>
                                                {event.eventType}
                                            </span>

                                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-900">
                                                <span className="flex items-center gap-1.5 bg-white-100 px-2 py-1 rounded-md">
                                                    <i className="fa-regular fa-calendar-days"></i> {dateFormate(event.date)}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-white-100 px-2 py-1 rounded-md">
                                                    <i className="fa-regular fa-clock"></i> {formatTime(event.date)}
                                                </span>
                                            </div>



                                        </div>

                                        {/* Unified Grid: All details in one compact row */}
                                        <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-5 gap-4 items-center">

                                            {/* 1. Worker (The Taker) */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] uppercase font-medium text-gray-400 tracking-tighter">Worker</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <i className="fa-solid fa-user-gear text-[10px] text-gray-500"></i>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800 truncate">{event.workerName}</span>
                                                </div>
                                            </div>

                                            {/* 2. Project Location */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] uppercase font-medium text-gray-400 tracking-tighter">Project</span>
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-location-dot text-blue-400 text-[10px]"></i>
                                                    <span className="text-sm font-medium text-gray-800 truncate">{event.projectId || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* 3. Source/Room (Only for Return) */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] uppercase font-medium text-gray-400 tracking-tighter">Storage</span>
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-warehouse text-purple-400 text-[10px]"></i>
                                                    <span className="text-sm font-medium text-gray-800 truncate">
                                                        {event.eventType === "RETURN" ? (event.roomData || 'Main Room') : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 4. Handled By */}
                                            <div className="flex flex-col gap-1 border-l border-gray-50 pl-2">
                                                <span className="text-[11px] uppercase font-medium text-gray-400 tracking-tighter">Staff (Handled By)</span>
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-user-shield text-gray-800 text-[10px]"></i>
                                                    <span className="text-sm font-medium text-gray-800 truncate">{event.staffName || 'System'}</span>
                                                </div>
                                            </div>


                                            {event.eventType === 'RETURN' && <div className="flex flex-col gap-1 border-l border-gray-50 pl-2">
                                                <span className="text-[11px] uppercase font-medium text-gray-400 tracking-tighter">
                                                    Condition
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {event.eventType === 'RETURN' ? (
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${event.status === 'damaged' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {event.status?.toUpperCase()}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-user-shield text-gray-800 text-[10px]"></i>
                                                            <span className="text-sm font-medium text-gray-800 truncate">{event.staffName || 'System'}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>}



                                            {/* PHOTO SECTION: Shows only if photos exist (usually RETURN event) */}
                                            {event.photos && event.photos.length > 0 && (
                                                <div className="mt-3 ml-2 flex flex-col gap-2">
                                                    <span className="text-[11px] uppercase font-medium text-gray-400 flex items-center gap-1">
                                                        <i className="fa-solid fa-camera"></i> Damage Evidence ({event.photos.length})
                                                    </span>
                                                    {/* <div className="flex flex-wrap gap-3">
                                                        {event.photos.map((photoObj: any, pIdx: number) => (
                                                            <div
                                                                key={photoObj._id || pIdx}
                                                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-orange-500 transition-all shadow-sm group"
                                                                onClick={() => window.open(photoObj.photo?.url, '_blank')}
                                                            >
                                                                <img
                                                                    src={photoObj.photo?.url}
                                                                    alt="Tool damage"
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                                />
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                                                    <i className="fa-solid fa-magnifying-glass-plus text-white text-xs"></i>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div> */}

                                                    <ImageGalleryExample
                                                        imageFiles={event.photos?.map((photoObj: any) => photoObj.photo)}
                                                        height={60}
                                                        minWidth={100}
                                                        maxWidth={200}
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </>
                            ))
                    )}
                </div>

                {/* Target for Manual Intersection Observer */}
                <div ref={observerTarget} className="h-10 flex justify-center items-center py-4">
                    {isFetchingNextPage ? (
                        <div className="text-blue-500 text-xs font-medium">
                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Fetching records...
                        </div>
                    ) : hasNextPage ? (
                        <div className="text-gray-400 text-[10px] uppercase tracking-wider">Scroll for more</div>
                    ) : (
                        <div className="text-gray-400 text-[10px] uppercase tracking-wider">No more records</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ToolHistoryTimeline;