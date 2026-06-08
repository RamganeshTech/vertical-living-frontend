import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleInstagramLeadByMeta } from '../../../../apiList/marketing_api/lead_api/instagramLeadApi';

const InstagramLeadSingleByMeta = () => {
    const { id } = useParams<{ id: string }>(); // This is the conversationId
    const navigate = useNavigate();

    // Fetch the full chat history array from Meta
    const { data: messages, isLoading, isError, error, refetch } = useGetSingleInstagramLeadByMeta(id!);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="flex flex-col items-center text-text-muted gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[#E1306C]"></i>
                    <p className="text-sm font-medium">Loading chat history from Meta...</p>
                </div>
            </div>
        );
    }

    if (isError || !messages) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-action-danger/5 border border-action-danger/20 rounded-xl text-center shadow-sm">
                <i className="fas fa-exclamation-circle text-4xl text-action-danger mb-4"></i>
                <h2 className="text-xl font-semibold text-text-strong mb-2">Thread Not Found</h2>
                <p className="text-text-muted mb-6">
                    {(error as any)?.message || "Failed to load conversation from Meta's servers."}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-brand-surface text-text-main border border-brand-ash rounded-lg hover:bg-brand-surface-hover font-medium shadow-sm"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-[#E1306C] text-white rounded-lg hover:opacity-90 font-medium shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Safely determine the customer profile from the messages array
    // We assume the non-page participant is the customer
    const customerName = messages?.length > 0 ? messages[0]?.from?.name : "Instagram User";

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 h-full flex flex-col">

            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex cursor-pointer items-center text-text-main hover:text-text-strong transition-colors text-sm font-semibold bg-brand-surface-hover px-4 py-2 rounded-lg border border-brand-ash shadow-sm"
                >
                    <i className="fas fa-arrow-left mr-2 text-text-muted"></i> Back to Inbox
                </button>
                <div className="text-xs font-medium text-text-muted flex items-center bg-brand-surface-hover px-3 py-1.5 rounded-lg border border-brand-ash shadow-sm">
                    <i className="fas fa-fingerprint mr-2 text-text-soft"></i> Thread ID: {id}
                </div>
            </div>

            {/* Main Chat Interface */}
            <div className="bg-brand-surface flex-1 rounded-2xl border-2 border-ash-medium shadow-sm overflow-hidden flex flex-col">

                {/* Profile Header Section */}
                <div className="p-6 border-b border-brand-ash flex items-center justify-between gap-6 bg-brand-surface-hover">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-0.5 flex-shrink-0 shadow-sm">
                            <div className="w-full h-full bg-brand-surface rounded-full flex items-center justify-center">
                                <i className="fab fa-instagram text-xl text-text-strong"></i>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-text-strong mb-1">
                                {customerName}
                            </h1>
                            <span className="text-xs text-[#E1306C] font-semibold bg-[#E1306C]/10 px-2 py-1 rounded-md">
                                Live Meta Connection
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chat History Section (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#fdfdfd] space-y-4">
                    {messages?.length === 0 ? (
                        <div className="text-center text-text-muted py-10">
                            No messages found in this thread.
                        </div>
                    ) : (
                        messages?.map((msg: any) => {
                            // Simple logic: If the sender name matches the customer we found earlier, it's inbound. Otherwise, outbound.
                            const isCustomer = msg.from.name === customerName;

                            return (
                                <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-text-muted">
                                            {isCustomer ? msg.from.name : 'Your Business'}
                                        </span>
                                        <span className="text-[10px] text-text-soft">
                                            {new Date(msg.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isCustomer ? 'bg-brand-surface border border-brand-ash text-text-strong rounded-tl-sm' : 'bg-[#E1306C] text-white rounded-tr-sm'}`}>
                                        {msg.message || <span className="italic opacity-80">Media attached</span>}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstagramLeadSingleByMeta;