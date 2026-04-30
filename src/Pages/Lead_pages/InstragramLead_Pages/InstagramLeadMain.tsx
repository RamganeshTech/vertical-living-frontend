import React, { useState, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useGetInstagramLeads, useUpdateInstagramLeadStatus } from '../../../apiList/lead_api/instagramLeadApi';
// import { useGetInstagramLeads, useUpdateInstagramLeadStatus } from './hooks/useGetInstagramLeads'; // Adjust path

// Pre-defined stages for the Kanban Board
const STAGES = ['New', 'Contacted', 'Interested', 'Not Interested', 'Converted'];

const InstagramLeadsPage = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string };

    // View State: 'list' or 'kanban'
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Queries & Mutations
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetInstagramLeads({
        organizationId,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: 30 // Slightly higher limit helps Kanban look fuller
    });

    const updateStatusMutation = useUpdateInstagramLeadStatus();

    // Flatten pages to get a single array of leads
    const leads = data?.pages.flatMap(page => page.data) || [];

    // Client-side search filter
    const filteredLeads = leads.filter(lead =>
        lead.igUsername?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.fullName?.toLowerCase().includes(filters.search.toLowerCase())
    );

    const activeFiltersCount = Object.values(filters).filter(val => val !== '').length;

    const clearFilters = () => {
        setFilters({ search: '', status: '', startDate: '', endDate: '' });
    };

    // Infinite Scroll Handler (Mainly for List View)
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current || viewMode !== 'list') return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, viewMode]);

    // Drag and Drop Handlers for Kanban
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('text/plain', id);
        setDraggedLeadId(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        setDraggedLeadId(null);

        if (id) {
            // Find current lead to prevent redundant API calls
            const lead = filteredLeads.find(l => l._id === id);
            if (lead && lead.status !== newStatus) {
                await updateStatusMutation.mutateAsync({ id, status: newStatus });
            }
        }
    };
    const isChildRoute = location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;

    return (
        <div className="space-y-0 h-full max-h-full overflow-y-auto p-2 bg-[#fdfdfd] text-text-main">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3 border-b border-ash-medium">
                <div>
                    <h1 className="text-2xl font-semibold text-text-strong flex items-center">
                        <i className="fab fa-instagram mr-3 text-action-primary"></i>
                        Instagram Leads
                    </h1>
                </div>

                <div className='flex items-center gap-3'>
                    {/* View Switcher */}
                    <div className="flex bg-brand-surface-hover rounded-lg border border-brand-ash p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-brand-surface shadow-sm text-action-primary border border-brand-ash' : 'text-text-muted hover:text-text-main'}`}
                        >
                            <i className="fas fa-list mr-2"></i> List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-brand-surface shadow-sm text-action-primary border border-brand-ash' : 'text-text-muted hover:text-text-main'}`}
                        >
                            <i className="fas fa-columns mr-2"></i> Kanban
                        </button>
                    </div>

                    {/* <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-brand-surface hover:bg-brand-surface-hover text-text-main rounded-md transition-colors border border-brand-ash flex items-center shadow-sm"
                    >
                        <i className="fas fa-sync-alt mr-2 text-text-soft"></i> Refresh
                    </button> */}
                </div>
            </header>

            {/* Loading / Error States */}
            {isLoading ? (
                // <div className="flex justify-center items-center py-20">
                //     <i className="fas fa-spinner fa-spin text-action-primary text-4xl"></i>
                // </div>

                <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center text-action-primary gap-3">
                        <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
                        {/* <p className="text-sm font-medium text-text-muted animate-pulse">Setting up your experience...</p> */}
                    </div>
                </div>
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-10 p-6 bg-action-danger/10 border border-action-danger/30 rounded-xl text-center">
                    <div className="text-action-danger font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-text-muted mb-4">{(error as any)?.message || "Failed to load leads"}</p>
                    <button onClick={() => refetch()} className="bg-action-danger text-brand-surface px-6 py-2 rounded-lg font-medium">
                        Retry
                    </button>
                </div>
            ) : (
                <main className="flex flex-col sm:flex-row gap-6 min-h-[calc(100vh-120px)] sm:h-[calc(100vh-120px)]">

                    {/* Filters Sidebar */}
                    <div className="w-full sm:w-80 flex-shrink-0 h-auto lg:h-full overflow-y-auto">
                        <div className="bg-brand-surface rounded-xl shadow-sm p-5 border border-brand-ash">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-text-main flex items-center">
                                    <i className="fas fa-filter mr-2 text-text-main"></i>
                                    Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-sm text-action-primary hover:text-action-primary-hover font-medium">
                                        Clear ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-5">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-2">
                                        <i className="fas fa-search text-text-soft mr-2"></i> Search Leads
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Username or Name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full px-3 py-2 border-2 border-ash-medium rounded-lg focus:ring-2 focus:ring-action-primary focus:border-transparent outline-none bg-brand-surface text-text-main placeholder-text-soft"
                                    />
                                </div>

                                {/* Status Filter (Only useful in List View) */}
                                {viewMode === 'list' && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-2">
                                            <i className="fas fa-tasks text-text-soft mr-2"></i> Stage
                                        </label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                                            className="w-full px-3 py-2 border-2 border-ash-medium rounded-lg focus:ring-2 focus:ring-action-primary outline-none bg-brand-surface text-text-main"
                                        >
                                            <option value="">All Stages</option>
                                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* Date Filters */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">From</label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                            className="w-full px-2 py-2 border-2 border-ash-medium rounded-lg focus:ring-1 focus:ring-action-primary outline-none bg-brand-surface text-sm text-text-main"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">To</label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full px-2 py-2 border-2 border-ash-medium rounded-lg focus:ring-1 focus:ring-action-primary outline-none bg-brand-surface text-sm text-text-main"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area (List or Kanban) */}
                    <div className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
                        {filteredLeads.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-[#fefefe] rounded-xl border-2 border-ash-medium p-8 shadow-sm">
                                <i className="fab fa-instagram text-5xl text-brand-ash-dark mb-4" />
                                <h3 className="text-xl font-semibold text-text-strong mb-2">No Leads Found</h3>
                                <p className="text-text-muted text-center max-w-md">
                                    {activeFiltersCount > 0
                                        ? 'No leads match your current filter criteria. Try adjusting your search or dates.'
                                        : 'Your inbox is clear. Waiting for new Instagram inquiries to arrive.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {viewMode === 'list' ? (
                                    /* ================= LIST VIEW ================= */
                                    <div
                                        ref={scrollContainerRef}
                                        onScroll={handleScroll}
                                        className="flex-1 overflow-y-auto bg-brand-surface rounded-xl border-2 border-ash-medium shadow-sm"
                                    >
                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-brand-surface-hover border-b border-brand-ash font-semibold text-text-strong text-sm sticky top-0 z-10 shadow-sm">
                                            <div className="col-span-1 text-center">S.No</div>
                                            <div className="col-span-3">Profile</div>
                                            <div className="col-span-4">Last Message</div>
                                            <div className="col-span-2">Date</div>
                                            <div className="col-span-2 text-center">Stage</div>
                                        </div>

                                        {/* Table Body */}
                                        <div className="divide-y divide-brand-ash">
                                            {filteredLeads.map((lead, index) => (
                                                <LeadListRow
                                                    key={lead._id}
                                                    lead={lead}
                                                    index={index}
                                                    onClick={() => navigate(`single/${lead._id}`)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    /* ================= KANBAN VIEW ================= */
                                    <div className="flex-1 overflow-x-auto h-full pb-4">
                                        <div className="flex gap-4 h-full min-w-max">
                                            {STAGES.map(stage => {
                                                const stageLeads = filteredLeads.filter(l => l.status === stage);
                                                return (
                                                    <div
                                                        key={stage}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, stage)}
                                                        className="w-80 flex flex-col bg-brand-surface-hover rounded-xl border border-brand-ash h-full"
                                                    >
                                                        {/* Column Header */}
                                                        <div className="p-4 border-b border-brand-ash flex justify-between items-center bg-brand-surface rounded-t-xl">
                                                            <h3 className="font-semibold text-text-strong">{stage}</h3>
                                                            <span className="px-2 py-0.5 bg-brand-ash text-text-muted text-xs font-medium rounded-full">
                                                                {stageLeads.length}
                                                            </span>
                                                        </div>

                                                        {/* Column Body (Scrollable) */}
                                                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                                            {stageLeads.map(lead => (
                                                                <KanbanCard
                                                                    key={lead._id}
                                                                    lead={lead}
                                                                    onDragStart={handleDragStart}
                                                                    isDragging={draggedLeadId === lead._id}
                                                                    onClick={() => navigate(`single/${lead._id}`)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Infinite Scroll Loading Indicator */}
                                {isFetchingNextPage && (
                                    <div className="flex justify-center py-4 bg-brand-surface border-t border-brand-ash rounded-b-xl">
                                        <div className="flex items-center gap-2 text-action-primary">
                                            <i className="fas fa-spinner fa-spin text-lg"></i>
                                            <span className="text-sm font-medium">Loading older leads...</span>
                                        </div>
                                    </div>
                                )}
                                {!hasNextPage && filteredLeads.length > 0 && viewMode === 'list' && (
                                    <div className="flex justify-center py-2 bg-brand-surface border-t border-brand-ash rounded-b-xl">
                                        <p className="text-text-soft text-xs font-medium">
                                            <i className="fas fa-check-circle mr-1"></i> All leads loaded
                                        </p>
                                    </div>
                                )}
                                {/* Kanban specific Load More button if needed */}
                                {hasNextPage && viewMode === 'kanban' && !isFetchingNextPage && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={() => fetchNextPage()}
                                            className="px-6 py-2 bg-brand-surface border border-brand-ash text-text-main text-sm font-medium rounded-full hover:bg-brand-surface-hover shadow-sm"
                                        >
                                            Load More Leads
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};


export default InstagramLeadsPage;
// ==========================================
// Helpers & Sub-components
// ==========================================

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'New': return 'bg-action-primary/10 text-action-primary border-action-primary/30';
        case 'Contacted': return 'bg-action-warning/10 text-action-warning border-action-warning/30';
        case 'Interested': return 'bg-action-success/10 text-action-success border-action-success/30';
        case 'Not Interested': return 'bg-action-danger/10 text-action-danger border-action-danger/30';
        case 'Converted': return 'bg-action-primary text-brand-surface border-action-primary';
        default: return 'bg-brand-ash text-text-main border-brand-ash-dark';
    }
};

// --- List View Row ---
const LeadListRow = ({ lead, index, onClick }: { lead: any, index: number, onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-brand-surface-hover transition-colors cursor-pointer text-sm bg-brand-surface"
        >
            <div className="col-span-1 text-center font-medium text-text-muted">
                {index + 1}
            </div>

            <div className="col-span-3 flex flex-col truncate pr-2">
                <span className="font-semibold text-text-strong truncate">
                    {lead.fullName || "Instagram User"}
                </span>
                <span className="text-text-muted text-xs flex items-center truncate mt-0.5">
                    <i className="fab fa-instagram mr-1.5 text-text-soft"></i>
                    @{lead.igUsername || lead.senderId}
                </span>
            </div>

            <div className="col-span-4 text-text-main truncate pr-4">
                {lead.lastMessageText || <span className="text-text-soft italic">No text content</span>}
            </div>

            <div className="col-span-2 flex flex-col text-xs text-text-muted">
                <span className="font-medium text-text-main">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="mt-0.5">
                    {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div className="col-span-2 flex justify-center">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(lead.status)}`}>
                    {lead.status}
                </span>
            </div>
        </div>
    );
};

// --- Kanban Card ---
const KanbanCard = ({ lead, onDragStart, isDragging, onClick }: { lead: any, onDragStart: any, isDragging: boolean, onClick: () => void }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead._id)}
            onClick={onClick}
            className={`p-4 rounded-xl border bg-brand-surface cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${isDragging ? 'opacity-50 border-action-primary border-dashed' : 'border-brand-ash shadow-sm'}`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 truncate">
                    <div className="w-8 h-8 rounded-full bg-brand-ash flex items-center justify-center flex-shrink-0">
                        <i className="fab fa-instagram text-text-muted text-sm"></i>
                    </div>
                    <div className="truncate">
                        <h4 className="text-sm font-semibold text-text-strong truncate">{lead.fullName || "Instagram User"}</h4>
                        <p className="text-xs text-text-muted truncate">@{lead.igUsername || lead.senderId}</p>
                    </div>
                </div>
            </div>

            <div className="bg-brand-surface-hover rounded-lg p-2.5 mb-3 border border-brand-ash">
                <p className="text-xs text-text-main line-clamp-2 leading-relaxed">
                    {lead.lastMessageText || <span className="text-text-soft italic">No message preview</span>}
                </p>
            </div>

            <div className="flex justify-between items-center text-xs">
                <span className="text-text-soft font-medium flex items-center">
                    <i className="far fa-clock mr-1.5"></i>
                    {new Date(lead.updatedAt || lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>

                {/* Visual Indicator of Draggability */}
                <i className="fas fa-grip-horizontal text-text-soft/50 hover:text-text-muted"></i>
            </div>
        </div>
    );
};