import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleInstagramLead, useUpdateInstagramLeadStatus } from '../../../apiList/marketing_api/lead_api/instagramLeadApi';
import { toast } from '../../../utils/toast';

const InstagramLeadSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch the single lead
    const { data: lead, isLoading, isError, error, refetch } = useGetSingleInstagramLead(id!);

    // Mutation to update the status
    const updateStatusMutation = useUpdateInstagramLeadStatus();

    // Local state for the status dropdown to provide instant visual feedback
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!id) return;

        setIsUpdating(true);
        try {
            await updateStatusMutation.mutateAsync({ id, status: newStatus });
            toast({ title: "Success", description: "Stage updated successfully" });
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'New': return 'bg-action-primary/10 text-action-primary border-action-primary/30';
            case 'Contacted': return 'bg-action-warning/10 text-action-warning border-action-warning/30';
            case 'Interested': return 'bg-action-success/10 text-action-success border-action-success/30';
            case 'Not Interested': return 'bg-action-danger/10 text-action-danger border-action-danger/30';
            case 'Converted': return 'bg-action-primary text-brand-surface border-action-primary';
            default: return 'bg-brand-surface-hover text-text-main border-brand-ash-dark';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="flex flex-col items-center text-text-muted gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
                    <p className="text-sm font-medium">Loading lead details...</p>
                </div>
            </div>
        );
    }

    if (isError || !lead) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-action-danger/5 border border-action-danger/20 rounded-xl text-center shadow-sm">
                <i className="fas fa-exclamation-circle text-4xl text-action-danger mb-4"></i>
                <h2 className="text-xl font-semibold text-text-strong mb-2">Lead Not Found</h2>
                <p className="text-text-muted mb-6">
                    {(error as any)?.message || "We couldn't load the details for this lead. It may have been deleted."}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-brand-surface text-text-main border border-brand-ash rounded-lg hover:bg-brand-surface-hover transition-colors font-medium shadow-sm"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-action-primary text-brand-surface rounded-lg hover:bg-action-primary-hover transition-colors font-medium shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl  mx-auto p-4 md:p-6 lg:p-8 space-y-6">

            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex cursor-pointer items-center text-text-main hover:text-text-strong transition-colors text-sm font-semibold bg-brand-surface-hover px-4 py-2 rounded-lg border border-brand-ash shadow-sm"
                >
                    <i className="fas fa-arrow-left mr-2 text-text-muted"></i> Back to Leads
                </button>
                {/* <div className="text-xs font-medium text-text-muted flex items-center bg-brand-surface-hover px-3 py-1.5 rounded-lg border border-brand-ash shadow-sm">
                    <i className="fas fa-fingerprint mr-2 text-text-soft"></i> ID: {lead.senderId}
                </div> */}
            </div>

            {/* Main Detail Card */}
            <div className="bg-brand-surface rounded-2xl border-2 border-ash-medium shadow-sm overflow-hidden">

                {/* Profile Header Section - Added bg-brand-surface-hover to give it an "Ash" tint */}
                <div className="p-6 md:p-8 border-b border-brand-ash flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-brand-surface-hover">
                    <div className="flex items-center gap-5">
                        {/* Instagram Gradient Ring */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-0.5 flex-shrink-0 shadow-sm">
                            <div className="w-full h-full bg-brand-surface rounded-full border-2 border-brand-surface flex items-center justify-center">
                                <i className="fab fa-instagram text-2xl text-text-strong"></i>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-strong mb-1">
                                {lead.fullName || "Instagram User"}
                            </h1>
                            <a
                                href={`https://instagram.com/${lead.igUsername}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-action-primary hover:text-action-primary-hover font-medium flex items-center transition-colors bg-brand-surface px-2.5 py-1 rounded-md border border-brand-ash w-fit"
                            >
                                <i className="fab fa-instagram mr-1.5 text-text-muted text-xs"></i>
                                @{lead.igUsername || lead.senderId}
                                <i className="fas fa-external-link-alt ml-2 text-[10px] text-text-soft"></i>
                            </a>
                        </div>
                    </div>

                    {/* Status Updater */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            Current Stage
                        </label>
                        <div className="relative w-full md:w-56">
                            <select
                                value={lead.status}
                                onChange={handleStatusChange}
                                disabled={isUpdating}
                                className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border font-semibold outline-none cursor-pointer transition-all shadow-sm ${getStatusBadge(lead.status)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                            >
                                <option value="New" className="text-text-main bg-brand-surface">New</option>
                                <option value="Contacted" className="text-text-main bg-brand-surface">Contacted</option>
                                <option value="Interested" className="text-text-main bg-brand-surface">Interested</option>
                                <option value="Not Interested" className="text-text-main bg-brand-surface">Not Interested</option>
                                <option value="Converted" className="text-text-main bg-brand-surface">Converted</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                                {isUpdating ? (
                                    <i className="fas fa-spinner fa-spin text-text-muted"></i>
                                ) : (
                                    <i className="fas fa-chevron-down text-text-muted text-xs"></i>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Message Context */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            {/* Darkened Header text-text-strong */}
                            <h3 className="text-sm font-bold text-text-strong uppercase tracking-wider mb-4 flex items-center border-b border-brand-ash pb-2">
                                <i className="far fa-comment-dots mr-2 text-text-muted"></i> Latest Interaction
                            </h3>
                            <div className="bg-brand-surface-hover rounded-2xl p-6 border border-brand-ash shadow-sm">
                                <p className="text-text-main text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                    {lead.lastMessageText || <span className="text-text-soft italic">No text content available for this interaction.</span>}
                                </p>
                                <div className="flex justify-end mt-3">
                                    <span className="text-[11px] text-text-soft font-medium uppercase tracking-wide">
                                        Received via Instagram DM
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metadata & Actions */}
                    <div className="space-y-8">
                        <div>
                            {/* Darkened Header text-text-strong */}
                            <h3 className="text-sm font-bold text-text-strong uppercase tracking-wider mb-4 flex items-center border-b border-brand-ash pb-2">
                                <i className="far fa-clock mr-2 text-text-muted"></i> Timeline
                            </h3>
                            <div className="bg-brand-surface-hover rounded-xl p-6 border border-brand-ash space-y-5 shadow-sm relative">

                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[31px] top-7 bottom-7 w-0.5 bg-brand-ash"></div>

                                {/* First Contact */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-brand-surface border-2 border-action-primary z-10 shadow-sm"></div>
                                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">First Contacted</span>
                                    <div className="font-semibold text-text-strong text-[15px]">
                                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="text-sm text-text-main mt-0.5 font-medium">
                                        {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="relative pl-12 pt-2">
                                    <div className="absolute left-0 top-3 w-3.5 h-3.5 rounded-full bg-action-primary border-2 border-brand-surface shadow-sm z-10"></div>
                                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Last Updated</span>
                                    <div className="font-semibold text-text-strong text-[15px]">
                                        {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="text-sm text-text-main mt-0.5 font-medium">
                                        {new Date(lead.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-sm font-bold text-text-strong uppercase tracking-wider mb-4 flex items-center border-b border-brand-ash pb-2">
                                <i className="fas fa-bolt mr-2 text-text-muted"></i> Actions
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href={`https://instagram.com/direct/t/${lead.senderId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-text-strong text-brand-surface rounded-xl hover:opacity-90 transition-colors font-semibold shadow-sm"
                                >
                                    <i className="fab fa-instagram text-lg"></i> Reply on Instagram
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InstagramLeadSingle;