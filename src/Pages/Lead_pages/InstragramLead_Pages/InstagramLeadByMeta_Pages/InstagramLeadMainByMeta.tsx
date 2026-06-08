// import { useState } from 'react';
// import { Outlet, useNavigate, useParams } from 'react-router-dom';
// import { useGetInstagramLeadsByMeta } from '../../../../apiList/marketing_api/lead_api/instagramLeadApi';

// const InstagramLeadMainByMeta = () => {
//     const navigate = useNavigate();
//     const { organizationId } = useParams() as { organizationId: string };

//     const [filters, setFilters] = useState({ search: '' });

//     // Queries & Mutations (Direct from Meta API)
//     const {
//         data: leadsResponse,
//         isLoading,
//         isError,
//         error,
//         refetch
//     } = useGetInstagramLeadsByMeta({ organizationId });

//     // Meta API returns a direct array, not infinite scroll pages
//     const leads = leadsResponse || [];

//     // Client-side search filter against Meta's data structure
//     const filteredLeads = leads.filter((lead: any) =>
//         lead.customer?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
//         lead.lastMessage?.toLowerCase().includes(filters.search.toLowerCase())
//     );

//     const isChildRoute = location.pathname.includes("single");
//     if (isChildRoute) return <Outlet />;

//     return (
//         <div className="space-y-0 h-full max-h-full overflow-y-auto p-2 bg-[#fdfdfd] text-text-main">
//             {/* Header */}
//             <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3 border-b border-ash-medium pb-2">
//                 <div>
//                     <h1 className="text-2xl font-semibold text-text-strong flex items-center">
//                         <i className="fab fa-instagram mr-3 text-[#E1306C]"></i>
//                         Live Instagram Inbox (Meta API)
//                     </h1>
//                 </div>

//                 <div className='flex items-center gap-3'>
//                     <button
//                         onClick={() => refetch()}
//                         className="px-4 py-2 bg-brand-surface hover:bg-brand-surface-hover text-text-main rounded-md transition-colors border border-brand-ash flex items-center shadow-sm"
//                     >
//                         <i className="fas fa-sync-alt mr-2 text-text-soft"></i> Refresh Inbox
//                     </button>
//                 </div>
//             </header>

//             {/* Loading / Error States */}
//             {isLoading ? (
//                 <div className="flex justify-center items-center py-20">
//                     <div className="flex flex-col items-center text-[#E1306C] gap-3">
//                         <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
//                     </div>
//                 </div>
//             ) : isError ? (
//                 <div className="max-w-xl mx-auto mt-10 p-6 bg-action-danger/10 border border-action-danger/30 rounded-xl text-center">
//                     <div className="text-action-danger font-semibold mb-2 text-xl">⚠️ Connection Error</div>
//                     <p className="text-text-muted mb-4">{(error as any)?.message || "Failed to load live conversations from Meta"}</p>
//                     <button onClick={() => refetch()} className="bg-action-danger text-brand-surface px-6 py-2 rounded-lg font-medium">
//                         Retry Connection
//                     </button>
//                 </div>
//             ) : (
//                 <main className="flex flex-col gap-6 min-h-[calc(100vh-120px)]">

//                     {/* Search Bar */}
//                     <div className="w-full bg-brand-surface rounded-xl shadow-sm p-4 border border-brand-ash">
//                         <div className="relative">
//                             <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-soft"></i>
//                             <input
//                                 type="text"
//                                 placeholder="Search by name or message content..."
//                                 value={filters.search}
//                                 onChange={(e) => setFilters({ search: e.target.value })}
//                                 className="w-full pl-10 px-3 py-2 border-2 border-ash-medium rounded-lg focus:ring-2 focus:ring-[#E1306C] focus:border-transparent outline-none bg-brand-surface text-text-main"
//                             />
//                         </div>
//                     </div>

//                     {/* Main Content Area */}
//                     <div className="flex-1 overflow-hidden flex flex-col min-w-0">
//                         {filteredLeads.length === 0 ? (
//                             <div className="flex-1 flex flex-col items-center justify-center bg-[#fefefe] rounded-xl border-2 border-ash-medium p-8 shadow-sm">
//                                 <i className="fab fa-instagram text-5xl text-brand-ash-dark mb-4" />
//                                 <h3 className="text-xl font-semibold text-text-strong mb-2">No Active Conversations</h3>
//                                 <p className="text-text-muted text-center max-w-md">
//                                     Your Instagram inbox is currently empty.
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="flex-1 overflow-y-auto bg-brand-surface rounded-xl border-2 border-ash-medium shadow-sm">
//                                 {/* Table Header */}
//                                 <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-brand-surface-hover border-b border-brand-ash font-semibold text-text-strong text-sm sticky top-0 z-10 shadow-sm">
//                                     <div className="col-span-1 text-center">S.No</div>
//                                     <div className="col-span-3">Instagram User</div>
//                                     <div className="col-span-5">Latest Message</div>
//                                     <div className="col-span-3 text-right pr-4">Last Active</div>
//                                 </div>

//                                 {/* Table Body */}
//                                 <div className="divide-y divide-brand-ash">
//                                     {filteredLeads.map((lead: any, index: number) => (
//                                         <div
//                                             key={lead.conversationId}
//                                             onClick={() => navigate(`single/${lead.conversationId}`)}
//                                             className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-brand-surface-hover transition-colors cursor-pointer text-sm bg-brand-surface"
//                                         >
//                                             <div className="col-span-1 text-center font-medium text-text-muted">
//                                                 {index + 1}
//                                             </div>

//                                             <div className="col-span-3 flex flex-col truncate pr-2">
//                                                 <span className="font-semibold text-text-strong truncate">
//                                                     {lead.customer?.name || "Unknown Profile"}
//                                                 </span>
//                                                 <span className="text-text-muted text-xs flex items-center truncate mt-0.5">
//                                                     <i className="fab fa-instagram mr-1.5 text-text-soft"></i>
//                                                     ID: {lead.customer?.id}
//                                                 </span>
//                                             </div>

//                                             <div className="col-span-5 text-text-main truncate pr-4">
//                                                 {lead.lastMessage || <span className="text-text-soft italic">Attachment/Media</span>}
//                                             </div>

//                                             <div className="col-span-3 flex flex-col text-xs text-text-muted items-end pr-4">
//                                                 <span className="font-medium text-text-main">
//                                                     {new Date(lead.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                                                 </span>
//                                                 <span className="mt-0.5">
//                                                     {new Date(lead.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </main>
//             )}
//         </div>
//     );
// };

// export default InstagramLeadMainByMeta;



// SECOND VERSION FOR SCREEN RECORDING IN THE META APP

import React, { useState } from 'react';
import { SidePanel } from '../../../../shared/SidePanel/SidePanel';
import { COMPANY_DETAILS } from '../../../../constants/constants';

// Types for Mock Data
interface MockMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    isIncoming: boolean;
}

interface MockComment {
    id: string;
    username: string;
    text: string;
    postTitle: string;
    timestamp: string;
}

interface InstagramLead {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    source: 'DM' | 'Comment';
    campaign: string;
    status: string;
    latestInteraction: string;
    messages?: MockMessage[];
    comments?: MockComment[];
}

const InstagramLeadMainByMeta: React.FC = () => {
    // --- STATE FOR MOCKUP ACTIONS ---
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<InstagramLead | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'dms' | 'comments'>('all');
    const [replyText, setReplyText] = useState('');
    const [chatHistory, setChatHistory] = useState<MockMessage[]>([
        { id: '1', sender: 'Priya Sharma', text: "Hi, I saw your post regarding the luxury modular kitchen installation. Could you share the premium material choices and estimated execution timeline?", timestamp: '5 mins ago', isIncoming: true },
        { id: '2', sender: 'Vertical Living', text: "Hello Priya! Thank you for reaching out. We specialize in high-end modular designs using premium marine ply and acrylic finishes. Let me pull up our design manual for you.", timestamp: '3 mins ago', isIncoming: false }
    ]);

    // --- PREMIUM REALISTIC DUMMY DATA ---
    const instagramProfile = {
        username: 'living.vertical',
        name: 'Vertical Living',
        id: 'ig_biz_947617496628199',
        // avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', // Premium geometric abstract placeholder
        avatar: COMPANY_DETAILS.COMPANY_LOGO,
        // avatar: 'https://instagram.fixm4-1.fna.fbcdn.net/v/t51.2885-19/433030303_1531224034094081_3971020117588774453_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby43OTQuYzIifQ&_nc_ht=instagram.fixm4-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gE70U_LtMnWwuLROk55gCiiLeHgITQh0Mc01Sxpg4yryMo1vkam78RCE2vvZMSebGKIAgE9oIgzVNtNVV8fpq1l&_nc_ohc=IDkel6q3sjIQ7kNvwFavnJS&_nc_gid=PZB5Ka-JX7xgaUjEcxYxGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Af_KQVt_jV-YQgxI8Hpv41M8i4i18GhuvQtqys9UlaBw3A&oe=6A23535D&_nc_sid=8b3546', // Premium geometric abstract placeholder
        followers: '21K'
    };

    const leadsData: InstagramLead[] = [
        {
            id: 'L-8942',
            name: 'Priya Sharma',
            handle: '@priya_architects',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
            source: 'DM',
            campaign: 'Premium Living Spaces 2026',
            status: 'High Intent',
            latestInteraction: 'Inquired about modular kitchen material costs.',
            messages: chatHistory
        },
        {
            id: 'L-8943',
            name: 'Rohan Malhotra',
            handle: '@rohan_design_studio',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
            source: 'Comment',
            campaign: 'Minimalist Penthouse Campaign',
            status: 'New Lead',
            latestInteraction: 'Commented: "Stunning choice of ambient lighting! Is this custom designed?"',
            comments: [
                { id: 'c1', username: '@rohan_design_studio', text: 'Stunning choice of ambient lighting! Is this custom designed or sourced?', postTitle: 'Minimalist Living Room Canvas', timestamp: '12 mins ago' }
            ]
        }
    ];

    const handleOpenLeadDetails = (lead: InstagramLead) => {
        setSelectedLead(lead);
        if (lead.messages) {
            setChatHistory(lead.messages);
        }
        setIsPanelOpen(true);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newMsg: MockMessage = {
            id: Date.now().toString(),
            sender: 'Vertical Living',
            text: replyText,
            timestamp: 'Just now',
            isIncoming: false
        };

        setChatHistory([...chatHistory, newMsg]);
        setReplyText('');
    };

    const filteredLeads = leadsData.filter(lead => {
        if (activeTab === 'dms') return lead.source === 'DM';
        if (activeTab === 'comments') return lead.source === 'Comment';
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-6 text-slate-800">

            {/* ================= HEADER SECTION (Satisfies instagram_business_basic) ================= */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={instagramProfile.avatar}
                            alt="IG Profile"
                            className="w-16 h-16 rounded-full ring-4 ring-blue-50 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-1.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                            <i className="fa-brands fa-instagram text-white text-[10px]"></i>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">{instagramProfile.name}</h1>
                            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
                                Connected
                            </span>
                        </div>
                        <p className="text-sm font-medium text-blue-600 mt-0.5">@{instagramProfile.username}</p>
                        <p className="text-xs text-slate-400 mt-1">
                            <span className="font-semibold text-slate-500">Meta Asset ID:</span> {instagramProfile.id}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 border-l border-slate-100 pl-0 md:pl-6 w-full md:w-auto">
                    <div className="text-center bg-slate-50 rounded-xl px-4 py-2 min-w-[100px]">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audience</p>
                        <p className="text-lg font-bold text-slate-900">{instagramProfile.followers}</p>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl px-4 py-2 min-w-[100px]">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sync Mode</p>
                        <p className="text-sm font-bold text-blue-900 flex items-center justify-center gap-1 h-7">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Webhook
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= MAIN INTERFACE CONTROLS ================= */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT & CENTER COLUMNS: LEADS OVERVIEW BOARD */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                        {/* Inner Dashboard Nav */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <i className="fa-solid fa-bolt text-blue-600"></i> Interactive Lead Stream
                            </h2>
                            <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    All Channels
                                </button>
                                <button
                                    onClick={() => setActiveTab('dms')}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'dms' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Direct Messages
                                </button>
                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'comments' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Post Comments
                                </button>
                            </div>
                        </div>

                        {/* Interactive Lead Feed */}
                        <div className="divide-y divide-slate-100">
                            {filteredLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    onClick={() => handleOpenLeadDetails(lead)}
                                    className="p-6 hover:bg-slate-50/80 cursor-pointer transition-all flex items-start justify-between gap-4 group"
                                >
                                    <div className="flex gap-4 items-start">
                                        <img src={lead.avatar} alt={lead.name} className="w-11 h-11 rounded-full object-cover shadow-inner" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.name}</h3>
                                                <span className="text-xs font-medium text-slate-400">{lead.handle}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-1">{lead.latestInteraction}</p>

                                            {/* Meta Tracking Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${lead.source === 'DM' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-pink-50 text-pink-700 border border-pink-100'
                                                    }`}>
                                                    <i className={`fa-solid ${lead.source === 'DM' ? 'fa-envelope' : 'fa-comment'}`}></i>
                                                    {lead.source === 'DM' ? 'Direct Message' : 'Ad Comment'}
                                                </span>
                                                <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                                                    <i className="fa-solid fa-bullseye text-[9px]"></i> {lead.campaign}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                                            {lead.status}
                                        </span>
                                        <span className="text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            View Action Panel <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: REAL-TIME GRAPHQL CONTEXT BOX */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-xl font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                Meta Gateway Webhook Listener
                            </span>
                            <span className="text-slate-500">v20.0</span>
                        </div>
                        <p className="text-slate-400 mb-2">// Latest verified inbound sync payload</p>
                        <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 overflow-x-auto border border-slate-800 shadow-inner">
                            {`{
  "object": "instagram",
  "entry": [{
    "id": "${instagramProfile.id}",
    "time": ${Math.floor(Date.now() / 1000)},
    "messaging": [{
      "sender": { "id": "user_892410" },
      "message": { "text": "Timeline query" }
    }]
  }]
}`}
                        </pre>
                        <div className="mt-4 pt-3 border-t border-slate-800 text-slate-500 text-[11px] flex justify-between">
                            <span>Status: Listening for mutations</span>
                            <span className="text-blue-400">Rams Tech Circle</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/*   SLIDING COMPLIANCE SIDEPANEL (Satisfies Manage Messages & Manage Comments) */}
            {/* ========================================================================= */}
            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={selectedLead ? `Channel Action: ${selectedLead.name}` : 'Lead Operations'}
            >
                {selectedLead && (
                    <div className="space-y-6">

                        {/* Top Identity Block */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                            <img src={selectedLead.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-base">{selectedLead.name}</h4>
                                <p className="text-xs font-semibold text-blue-600">{selectedLead.handle}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Tracking ID: {selectedLead.id} • via {selectedLead.campaign}</p>
                            </div>
                        </div>

                        {/* INTERACTION PIPELINE MODULE */}
                        {selectedLead.source === 'DM' ? (
                            /* DIRECT MESSAGES FLOW SCREENSHOT MODULE */
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-comments text-purple-600"></i> Active Instagram Thread Lifecycle
                                </h5>

                                {/* Chat window viewport */}
                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3 max-h-[300px] overflow-y-auto">
                                    {chatHistory.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.isIncoming ? 'items-start' : 'items-end'}`}>
                                            <div className={`p-3 rounded-xl text-sm max-w-[85%] shadow-sm ${msg.isIncoming
                                                    ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                                    : 'bg-blue-600 text-white rounded-tr-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Form to submit response on screen layout */}
                                <form onSubmit={handleSendMessage} className="space-y-2">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type an instant response via Meta Graph API Messenger..."
                                        className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                                        rows={3}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-paper-plane text-xs"></i> Send Reply via Instagram API
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* AD / POST COMMENTS INSTAGRAM MODULE */
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-comment-dots text-pink-600"></i> Instagram Public Comment Handlers
                                </h5>

                                {selectedLead.comments?.map((comment) => (
                                    <div key={comment.id} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm space-y-3">
                                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase">Context Target Object</p>
                                            <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                                                <i className="fa-solid fa-photo-film text-[10px] text-blue-500"></i> {comment.postTitle}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-pink-50/40 rounded-xl border border-pink-100/50">
                                            <p className="text-xs font-bold text-pink-700">{comment.username}</p>
                                            <p className="text-sm text-slate-800 mt-1 font-medium">"{comment.text}"</p>
                                            <p className="text-[10px] text-slate-400 mt-2">{comment.timestamp}</p>
                                        </div>

                                        {/* Interactive Action Triggers for Review Video */}
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => alert('Comment marked as processed in database.')}
                                                className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2 rounded-lg transition-colors"
                                            >
                                                <i className="fa-solid fa-check text-emerald-500 mr-1"></i> Resolve Lead
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => alert('Automated layout message dispatched.')}
                                                className="bg-slate-900 text-white hover:bg-black font-bold text-xs py-2 rounded-lg transition-colors"
                                            >
                                                <i className="fa-solid fa-reply mr-1"></i> Send Reply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LEADS RETRIEVAL / CONVERSION MAPPING */}
                        <div className="border-t border-slate-100 pt-5 space-y-3">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-solid fa-database text-emerald-600"></i> Leads Retrieval Mapping Structure
                            </h5>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 font-medium text-slate-600">
                                <div className="flex justify-between"><span className="text-slate-400">Assigned CRM Owner:</span> <span className="text-slate-800">Vertical Living Design Team</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Marketing Pipeline Route:</span> <span className="text-slate-800">{selectedLead.campaign}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">DB Synchronization:</span> <span className="text-emerald-600 font-bold">Synced via Webhook Response</span></div>
                            </div>
                        </div>

                    </div>
                )}
            </SidePanel>

        </div>
    );
};


export default InstagramLeadMainByMeta