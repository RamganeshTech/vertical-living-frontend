// import { useParams, useNavigate } from 'react-router-dom';
// import { useGetSingleInternalQuote } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
// import { Button } from '../../../../../components/ui/Button';

// const CreateInternalQuoteNew = () => {
//     const { id, organizationId } = useParams<{ id: string, organizationId: string }>();
//     const navigate = useNavigate();

//     // Get organizationId from Redux store to satisfy the hook requirement

//     // 1. Fetch the single quote information using your hook
//     const { data: quote, isLoading, error } = useGetSingleInternalQuote(organizationId!, id!);

//     if (isLoading) return <div className="p-20 text-center"><i className="fas fa-spinner fa-spin mr-2"></i> Loading Workspace...</div>;
//     if (error) return <div className="p-20 text-center text-red-500">Error loading quote: {(error as Error).message}</div>;

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col">
//             {/* 2. DYNAMIC CONTEXT HEADER */}
//             <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
//                 <div className="flex items-center gap-6">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
//                     >
//                         <i className="fas fa-arrow-left"></i>
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-xl font-bold text-gray-900 tracking-tight">
//                                 {quote?.mainQuote?.mainQuoteName || "Untitled Quote"}
//                             </h1>
//                             <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${quote?.mainQuote?.quoteCategory === 'commercial'
//                                     ? 'bg-blue-50 text-blue-600 border-blue-100'
//                                     : 'bg-purple-50 text-purple-600 border-purple-100'
//                                 }`}>
//                                 {quote?.mainQuote?.quoteCategory}
//                             </span>
//                         </div>
//                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
//                             Project ID: <span className="text-gray-800">{quote?.projectId}</span> •
//                             Quote Ref: <span className="text-gray-800">{quote?.quoteNo || id?.slice(-6)}</span>
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                     <div className="text-right mr-4 hidden md:block">
//                         <p className="text-[10px] text-gray-400 font-bold uppercase">Grand Total</p>
//                         <p className="text-lg font-black text-gray-900">₹ {quote?.grandTotal?.toLocaleString('en-IN')}</p>
//                     </div>
//                     <Button variant="outline" className="text-xs font-bold border-gray-200">
//                         <i className="fas fa-cog mr-2"></i> Settings
//                     </Button>
//                     <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-100">
//                         <i className="fas fa-file-export mr-2"></i> Export PDF
//                     </Button>
//                 </div>
//             </header>

//             {/* 3. WORKSPACE CONTENT */}
//             <main className="flex-1 flex overflow-hidden">
//                 {/* Sidebar for Work Items (Glass, Plywood, etc.) */}
//                 <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
//                     <div className="p-6 border-b">
//                         <h3 className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-4">Specified Works</h3>
//                         <Button className="w-full justify-start gap-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl py-5 shadow-xl shadow-slate-200">
//                             <i className="fas fa-plus-circle"></i> Add Work Specification
//                         </Button>
//                     </div>

//                     {/* List of existing works within this quote */}
//                     <div className="p-4 space-y-2">
//                         {quote?.mainQuote?.works?.length > 0 ? (
//                             quote.mainQuote.works.map((work: any) => (
//                                 <div key={work._id} className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all">
//                                     <p className="text-sm font-bold text-gray-800">{work.workName}</p>
//                                     <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{work.templateName}</p>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="py-10 text-center px-4">
//                                 <p className="text-xs text-gray-400 font-medium italic">No work modules added yet. Click above to start specifying.</p>
//                             </div>
//                         )}
//                     </div>
//                 </aside>

//                 {/* Dynamic Form Editor Area */}
//                 <section className="flex-1 bg-slate-50/50 overflow-y-auto p-12">
//                     <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[3rem] opacity-50">
//                         <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
//                             <i className="fas fa-drafting-compass text-3xl text-gray-300"></i>
//                         </div>
//                         <h2 className="text-lg font-bold text-gray-800">Workspace Active</h2>
//                         <p className="text-sm text-gray-500 max-w-xs text-center mt-2 leading-relaxed">
//                             Select a work module from the left or add a new one to begin entering technical specifications.
//                         </p>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default CreateInternalQuoteNew;




//  SECOND VERSION

import { useParams } from 'react-router-dom';
import { useCreateInternalQuote } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
// import { toast } from '../../../../../utils/toast';
import InternalQuoteForm from './InternalQuoteNewForm';

 const CreateInternalQuoteNew = () => {
    const { organizationId } = useParams() as { organizationId: string;  };
    // const navigate = useNavigate();
    const createMutation = useCreateInternalQuote();

    
      

    // const handleSubmit = async (formData: any) => {
    //     try {
    //         // const res = await createMutation.mutateAsync({
    //         //     organizationId,
    //         //     ...formData
    //         // });


    //         toast({ title: "Success", description: "Quote Created" });
    //         // navigate(`../single/${res._id}`);
    //     } catch (error: any) {
    //         toast({ title: "Error", description: error.message, variant: "destructive" });
    //     }
    // };

    return (
        <InternalQuoteForm 
            mode="create"
            organizationId={organizationId}
            // onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
        />
    );
};

export default CreateInternalQuoteNew