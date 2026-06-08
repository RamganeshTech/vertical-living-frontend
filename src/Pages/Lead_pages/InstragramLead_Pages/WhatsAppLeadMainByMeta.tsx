import React, { useState } from 'react';

// Types for Mock Data
interface WhatsAppMessage {
  id: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: string;
}

export const WhatsAppLeadMainByMeta: React.FC = () => {
  const [replyText, setReplyText] = useState('');
  
  // --- PREMIUM MOCK DATA ---
  const whatsappAccount = {
    businessName: 'Vertical Living',
    wabaId: '1307725358167687',
    phoneNumberId: '1143311518857477',
    displayNumber: '+91 93427 23420',
    qualityRating: 'High',
    messagingLimit: '1000 / day'
  };

  const [chatHistory, setChatHistory] = useState<WhatsAppMessage[]>([
    { 
      id: 'msg_1', 
      text: 'Hello! I would like to request a quotation for a 3BHK interior project.', 
      timestamp: '10:30 AM', 
      isIncoming: true 
    },
    { 
      id: 'msg_2', 
      text: 'Hi there! Thank you for contacting Vertical Living. I have attached our preliminary design catalog and pricing guide for your reference.', 
      timestamp: '10:32 AM', 
      isIncoming: false,
      status: 'read',
      attachment: 'Vertical_Living_Catalog.pdf'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: Date.now().toString(),
      text: replyText,
      timestamp: 'Just now',
      isIncoming: false,
      status: 'sent'
    };

    setChatHistory([...chatHistory, newMsg]);
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 text-slate-800">
      
      {/* ================= HEADER SECTION (Satisfies whatsapp_business_management) ================= */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-50">
              <i className="fa-brands fa-whatsapp text-3xl text-emerald-600"></i>
            </div>
            <span className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <i className="fa-solid fa-check text-white text-[10px]"></i>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{whatsappAccount.businessName} API Hub</h1>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Business
              </span>
            </div>
            <p className="text-sm font-bold text-emerald-700 mt-1">{whatsappAccount.displayNumber}</p>
            <div className="flex gap-4 mt-1 text-xs text-slate-500">
              <p><span className="font-semibold text-slate-600">WABA ID:</span> {whatsappAccount.wabaId}</p>
              <p><span className="font-semibold text-slate-600">Phone ID:</span> {whatsappAccount.phoneNumberId}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 border-l border-slate-200 pl-0 md:pl-6 w-full md:w-auto">
          <div className="text-center bg-slate-50 rounded-xl px-4 py-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Quality</p>
            <p className="text-sm font-bold text-emerald-600">{whatsappAccount.qualityRating}</p>
          </div>
          <div className="text-center bg-slate-50 rounded-xl px-4 py-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Tier Limit</p>
            <p className="text-sm font-bold text-slate-900">{whatsappAccount.messagingLimit}</p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CHAT INTERFACE (Satisfies whatsapp_business_messaging) ================= */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Chat Header */}
        <div className="bg-emerald-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              AK
            </div>
            <div>
              <h3 className="font-bold">Arjun Kapoor (Lead)</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                Active WhatsApp Session
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-emerald-100">
             <i className="fa-solid fa-file-pdf cursor-pointer hover:text-white transition-colors" title="Send Quotation PDF"></i>
             <i className="fa-solid fa-image cursor-pointer hover:text-white transition-colors" title="Send Site Image"></i>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 bg-[#efeae2] p-6 overflow-y-auto space-y-4 custom-scrollbar" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isIncoming ? 'items-start' : 'items-end'}`}>
              <div className={`p-3 rounded-lg text-sm max-w-[75%] shadow-sm relative ${
                msg.isIncoming 
                  ? 'bg-white text-slate-800 rounded-tl-none' 
                  : 'bg-[#d9fdd3] text-slate-800 rounded-tr-none'
              }`}>
                {msg.attachment && (
                  <div className="mb-2 p-2 bg-black/5 rounded flex items-center gap-2 border border-black/10">
                    <i className="fa-solid fa-file-pdf text-red-500 text-lg"></i>
                    <span className="text-xs font-semibold truncate">{msg.attachment}</span>
                  </div>
                )}
                <p>{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {!msg.isIncoming && msg.status === 'read' && <i className="fa-solid fa-check-double text-blue-500 text-[10px]"></i>}
                  {!msg.isIncoming && msg.status === 'sent' && <i className="fa-solid fa-check text-slate-400 text-[10px]"></i>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type a WhatsApp message to the client..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-xl shadow-md transition-colors flex items-center justify-center"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
};