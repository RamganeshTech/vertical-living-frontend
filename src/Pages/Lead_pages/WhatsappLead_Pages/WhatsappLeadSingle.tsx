import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleWhatsAppLead, useUpdateWhatsAppLeadStatus } from '../../../apiList/lead_api/whatsaAppLeadApi';
// import { useGetSingleWhatsAppLead, useUpdateWhatsAppLeadStatus } from '../../../apiList/lead_api/whatsappLeadApi'; // Adjust path if needed

 const WhatsAppLeadSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch the single lead
    const { data: lead, isLoading, isError, error, refetch } = useGetSingleWhatsAppLead(id!);
    
    // Mutation to update the status
    const updateStatusMutation = useUpdateWhatsAppLeadStatus();

    // Local state for the status dropdown to provide instant visual feedback
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!id) return;

        setIsUpdating(true);
        try {
            await updateStatusMutation.mutateAsync({ id, status: newStatus });
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
        <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-text-muted hover:text-text-strong transition-colors text-sm font-medium bg-brand-surface-hover px-3 py-1.5 rounded-lg border border-brand-ash"
                >
                    <i className="fas fa-arrow-left mr-2"></i> Back to WhatsApp Leads
                </button>
                <div className="text-xs text-text-soft flex items-center bg-brand-surface-hover px-2 py-1 rounded border border-brand-ash">
                    <i className="fas fa-fingerprint mr-2"></i> ID: {lead._id}
                </div>
            </div>

            {/* Main Detail Card */}
            <div className="bg-brand-surface rounded-2xl border-2 border-ash-medium shadow-sm overflow-hidden">
                
                {/* Profile Header Section */}
                <div className="p-6 md:p-8 border-b border-brand-ash flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-brand-surface to-brand-surface-hover">
                    <div className="flex items-center gap-5">
                        {/* WhatsApp Avatar styling */}
                        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 border-2 border-[#25D366]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <i className="fab fa-whatsapp text-3xl text-[#25D366]"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-strong mb-1">
                                {lead.customerName || "Unknown Contact"}
                            </h1>
                            <div className="flex items-center text-text-muted font-medium bg-brand-surface px-2.5 py-1 rounded-md border border-brand-ash w-fit">
                                <i className="fas fa-phone-alt mr-2 text-xs"></i> 
                                {lead.phoneNumber}
                            </div>
                        </div>
                    </div>

                    {/* Status Updater */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Current Stage
                        </label>
                        <div className="relative w-full md:w-56">
                            <select
                                value={lead.status}
                                onChange={handleStatusChange}
                                disabled={isUpdating}
                                className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border font-medium outline-none transition-all shadow-sm ${getStatusBadge(lead.status)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
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
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center border-b border-brand-ash pb-2">
                                <i className="far fa-comment-dots mr-2"></i> Initial Inquiry
                            </h3>
                            
                            {/* Chat Bubble Simulation */}
                            <div className="flex flex-col gap-2 max-w-2xl">
                                <div className="bg-brand-surface-hover rounded-2xl rounded-tl-sm p-5 border border-brand-ash shadow-sm">
                                    {lead.initialInquiry ? (
                                        <p className="text-text-main text-base leading-relaxed whitespace-pre-wrap">
                                            {lead.initialInquiry}
                                        </p>
                                    ) : (
                                        <div className="flex items-center text-text-muted italic bg-brand-surface p-3 rounded-lg border border-brand-ash">
                                            <i className="fas fa-paperclip mr-2 text-action-primary"></i>
                                            User sent an attachment or media file without text.
                                        </div>
                                    )}
                                    <div className="flex justify-end mt-2">
                                        <span className="text-[11px] text-text-soft font-medium">
                                            {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Meta Data Box */}
                        {lead.waMessageId && (
                             <div className="bg-brand-surface-hover rounded-xl p-4 border border-brand-ash border-dashed inline-block">
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                    Message Reference ID
                                </span>
                                <code className="text-xs text-text-main bg-brand-surface px-2 py-1 rounded">
                                    {lead.waMessageId}
                                </code>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Metadata & Actions */}
                    <div className="space-y-8">
                        
                        {/* Timeline */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center border-b border-brand-ash pb-2">
                                <i className="far fa-clock mr-2"></i> Activity Timeline
                            </h3>
                            <div className="bg-brand-surface-hover rounded-xl p-5 border border-brand-ash space-y-5 shadow-sm relative">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-brand-ash"></div>

                                {/* First Contact */}
                                <div className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-[14px] h-[14px] rounded-full bg-brand-surface border-2 border-action-primary z-10 shadow-sm"></div>
                                    <span className="block text-xs font-bold text-text-muted uppercase mb-1">Inquiry Received</span>
                                    <div className="font-medium text-text-strong">
                                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="text-sm text-text-muted mt-0.5">
                                        {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                
                                {/* Last Update */}
                                <div className="relative pl-10 pt-2">
                                    <div className="absolute left-0 top-3 w-[14px] h-[14px] rounded-full bg-action-primary border-2 border-brand-surface shadow-sm z-10"></div>
                                    <span className="block text-xs font-bold text-text-muted uppercase mb-1">Last Updated</span>
                                    <div className="font-medium text-text-strong">
                                        {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="text-sm text-text-muted mt-0.5">
                                        {new Date(lead.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center border-b border-brand-ash pb-2">
                                <i className="fas fa-bolt mr-2"></i> Quick Actions
                            </h3>
                            <div className="space-y-3">
                                {/* Open in WhatsApp Web / App */}
                                <a 
                                    href={`https://wa.me/${lead.phoneNumber.replace(/\D/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-[#ffffff] rounded-xl hover:bg-[#20bd5a] transition-colors font-semibold shadow-sm"
                                >
                                    <i className="fab fa-whatsapp text-lg"></i> Chat on WhatsApp
                                </a>
                                
                                {/* Copy Phone Number */}
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(lead.phoneNumber);
                                        // Optional: Add a small toast notification here
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-surface text-text-main border border-brand-ash rounded-xl hover:bg-brand-surface-hover hover:border-text-muted transition-colors font-medium shadow-sm"
                                >
                                    <i className="far fa-copy text-text-muted"></i> Copy Phone Number
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


export default WhatsAppLeadSingle;