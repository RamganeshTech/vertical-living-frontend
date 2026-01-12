import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useCreateInternalQuote, useUpdateInternalQuote } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
import { toast } from '../../../../../utils/toast';
import { Button } from '../../../../../components/ui/Button';
// import SearchSelectNew from '../../../../../components/ui/SearchSelectNew';
import { useGetProjects } from '../../../../../apiList/projectApi';
// import { Label } from '../../../../../components/ui/Label';
import { useDeleteQuote, useGetMaterialQuoteEntries } from '../../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi';
import type { AvailableProjetType } from '../../../../Department Pages/Logistics Pages/LogisticsShipmentForm';
import { useAuthCheck } from '../../../../../Hooks/useAuthCheck';
import MaterialOverviewLoading from '../../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { dateFormate, formatTime } from '../../../../../utils/dateFormator';
// import { Input } from '../../../../../components/ui/Input';
import CreateQuoteModal from './CreateQuoteModal';
// import { Button } from '../../../components/ui/Button';
// import SearchSelectNew from '../../../components/ui/SearchSelectNew';
// import { useCreateInternalQuote, useUpdateInternalQuote } from './useInternalQuoteMutations'; // Path to your mutations
// import { toast } from '../../../utils/toast';

const InternalQuoteMainNew = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string };


    const [filters, setFilters] = useState({
        // status: "",
        projectId: "",
        projectName: "",
        createdAt: "",
    });


    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<{
        mainQuoteName: string;
        quoteCategory: string | null;
        projectId: string | null;
    }>({
        mainQuoteName: '',
        quoteCategory: 'commercial',
        projectId: ''
    });


    const { data } = useGetProjects(organizationId!)

    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))

    const { data: allQuotes, isLoading } = useGetMaterialQuoteEntries(organizationId!, {
        createdAt: filters.createdAt,
        projectId: filters.projectId,
        quoteNo: "",
    });


    const quotes = allQuotes?.filter((quote: any) => !quote.furnitures.length)


    const clearFilters = () => {
        setFilters({
            projectId: "",
            projectName: "",
            createdAt: "",
        });
    };
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;


    const createMutation = useCreateInternalQuote();
    const updateMutation = useUpdateInternalQuote();

    const { data: projectsData = [] } = useGetProjects(organizationId!);




    const handleSubmit = async () => {
        if (!formData.mainQuoteName || !formData.projectId || !formData.quoteCategory) {
            return toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
        }

        try {
            if (isEditing && selectedQuoteId) {
                await updateMutation.mutateAsync({
                    organizationId: organizationId, // Get from context/params
                    projectId: formData.projectId,
                    id: selectedQuoteId,
                    mainQuoteName: formData.mainQuoteName, quoteCategory: formData.quoteCategory
                });
                toast({ title: "Success", description: "Quote updated successfully" });
            } else {
                const response = await createMutation.mutateAsync({
                    organizationId: organizationId,
                    projectId: formData.projectId,
                    mainQuoteName: formData.mainQuoteName, quoteCategory: formData.quoteCategory
                });

                console.log("response", response)
                // Navigate using the data._id from backend response
                navigate(`create/${response._id}`);
            }
            setModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const resetForm = () => {
        setFormData({ mainQuoteName: '', quoteCategory: 'commercial', projectId: '' });
        setIsEditing(false);
        setSelectedQuoteId(null);
    };

    const isChildRoute = location.pathname.includes("create") || location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;


    return (
        <div className="p-2 h-full w-full">
            <header className="flex mb-3 flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 border-b-1 border-[#818283]">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file mr-3 text-blue-600" />
                        Internal Quote Entry <span className='text-[20px] text-blue-600 ml-4'>(In Development)</span>
                    </h1>
                </div>
                <div className="flex gap-6 items-center">
                    <Button className="flex items-center" onClick={() => {
                        resetForm();
                        setModalOpen(true);
                    }}>
                        <i className="fas fa-add mr-1" /> Create
                    </Button>
                </div>
            </header>

            {/* Modal for Create/Update */}
            {isModalOpen && (
                <CreateQuoteModal
                    isEditing={isEditing}
                    formData={formData}
                    projectsData={projectsData}
                    setModalOpen={setModalOpen}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                />

            )}


            <main className="flex gap-2 !max-h-[80vh]">

                <div className="xl:w-80 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <i className="fas fa-filter mr-2 text-blue-600"></i>
                                Filters
                            </h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear All ({activeFiltersCount})
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Created Date
                                </label>
                                <input
                                    type="date"
                                    onChange={(e) => setFilters((f) => ({ ...f, createdAt: e.target.value }))}
                                    value={filters.createdAt}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Project
                                </label>

                                <select
                                    value={filters?.projectId || ''}
                                    onChange={(e) => {
                                        const selectedProject = projects?.find(
                                            (p: AvailableProjetType) => p._id === e.target.value
                                        );
                                        if (selectedProject) {
                                            setFilters(prev => ({
                                                ...prev,
                                                projectId: selectedProject._id,
                                                projectName: selectedProject.projectName, // keep name too
                                            }));
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {/* <option value="">All Projects</option> */}
                                    {projects?.map((project: AvailableProjetType) => (
                                        <option key={project._id} value={project._id}>{project.projectName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>


                <section className="w-full max-h-full  gap-2  overflow-y-auto  min-h-full">

                    {isLoading ? (
                        <p><MaterialOverviewLoading /></p>
                    ) : !quotes?.length ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-700">
                            <i className="fas fa-file-circle-exclamation text-gray-300 text-7xl mb-4"></i>

                            <h2 className="text-2xl font-semibold mb-2">No Quotes Found</h2>

                            <p className="text-base text-gray-500 leading-relaxed max-w-md">
                                You haven't generated any quote variants yet.
                                <br />
                                Please create a quote by clicking the + Product
                                section to view brand-wise breakdowns here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quotes?.map((quote: any) => (
                                <>
                                    <QuoteGenerateCard key={quote._id} quote={quote} organizationId={organizationId!} />
                                </>
                            ))}
                        </div>
                    )}
                </section>
            </main>

        </div>
    );
};

export default InternalQuoteMainNew;





type Props = {
    quote: any
    organizationId: string
}


const QuoteGenerateCard: React.FC<Props> = ({ quote, organizationId, }) => {

    const { mutateAsync: deleteQuote, isPending } = useDeleteQuote();

    const navigate = useNavigate()
    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.materialquote?.list;
    // const canCreate = role === "owner" || permission?.materialquote?.create;
    const canDelete = role === "owner" || permission?.materialquote?.delete;
    // const canEdit = role === "owner" || permission?.materialquote?.edit;


    const handleDelete = async (id: string) => {
        try {

            await deleteQuote({
                id: id!,
                organizationId: organizationId!,
            });

            toast({
                title: "Success",
                description: "Items deleted successfully",
            });

            // refetch()
        }
        catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message ?? "Operation failed",
            });
        }
    };



    return (
        // <Card
        //     className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
        // >
        //     <CardContent className="p-4 space-y-2">
        //         <div className="flex items-start justify-between">
        //             <div>

        //                 <div className='my-1 space-y-1'>
        //                     <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase">
        //                         {quote?.mainQuote.mainQuoteName || "Untitled Quote"}
        //                     </h3>
        //                     <h3 className="text-[12px] font-bold text-blue-700 leading-[8px] ">
        //                         Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
        //                     </h3>
        //                     <span className="text-[12px] font-semibold text-gray-500">
        //                         Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
        //                     </span>
        //                 </div>


        //                 <p className="text-xs text-gray-500 ">
        //                     Created on: {dateFormate(quote.createdAt)} -  {formatTime(quote.createdAt)}
        //                 </p>
        //             </div>
        //             <i className="fas fa-file-alt text-gray-400 text-xl" />
        //         </div>


        //         {/* <p className="text-sm text-gray-500 italic">
        //             <strong>Furnitures: </strong> {quote.furnitures?.length || 0}
        //         </p> */}

        //         <div className="flex justify-end gap-2 pt-2">
        //             <Button
        //                 size="sm"
        //                 isLoading={isPending}
        //                 variant="secondary"
        //                 // className="bg-red-600 text-white"
        //                 onClick={() => navigate(`single/${quote._id}`)}
        //             >
        //                 <i className="fas fa-eye mr-1" /> View
        //             </Button>


        //             {canDelete && <Button
        //                 size="sm"
        //                 isLoading={isPending}
        //                 variant="danger"
        //                 className="bg-red-600 text-white"
        //                 onClick={() => handleDelete(quote._id)}
        //             >
        //                 <i className="fas fa-trash mr-1" /> Delete
        //             </Button>}

        //         </div>
        //     </CardContent>
        // </Card>



        //  second version (old)
        <Card
    className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
>
    <CardContent className="p-5 space-y-4"> {/* Increased padding for better breathability */}
        <div className="flex items-start justify-between">
            <div className="space-y-3"> {/* Standardized vertical spacing between blocks */}
                
                <div className='space-y-1.5'> {/* Consistent spacing between header lines */}
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase">
                        {quote?.mainQuote.mainQuoteName || "Untitled Quote"}
                    </h3>
                    
                    <div className="space-y-0.5"> {/* Tighter grouping for metadata */}
                        <h3 className="text-[12px] font-bold text-blue-700 leading-normal">
                            Project: <span className='text-black font-semibold'>{quote?.projectId?.projectName || "Project"}</span>
                        </h3>
                        
                        <p className="text-[12px] font-semibold text-gray-500 leading-normal">
                            Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
                        </p>
                    </div>
                </div>

                <div className="pt-1">
                    <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                        <i className="far fa-clock text-[10px]" />
                        Created on: {dateFormate(quote.createdAt)} — {formatTime(quote.createdAt)}
                    </p>
                </div>
            </div>

            {/* Icon remains exact same color/size */}
            <div className="pt-1">
                <i className="fas fa-file-alt text-gray-300 text-xl" />
            </div>
        </div>

        {/* Action Row - Added a very light border to separate actions from data */}
        <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
            <Button
                size="sm"
                isLoading={isPending}
                variant="secondary"
                className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider"
                onClick={() => navigate(`single/${quote._id}`)}
            >
                <i className="fas fa-eye mr-1.5" /> View
            </Button>

            {canDelete && (
                <Button
                    size="sm"
                    isLoading={isPending}
                    variant="danger"
                    className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white"
                    onClick={() => handleDelete(quote._id)}
                >
                    <i className="fas fa-trash mr-1.5" /> Delete
                </Button>
            )}
        </div>
    </CardContent>
</Card>


        //  SECOND VERSION (NEW)
        // <Card className="w-full  shadow-sm hover:shadow-md transition-all duration-300 bg-white group overflow-hidden border-l-4 border-l-blue-600">
        //     <CardContent className="p-5">
        //         <div className="flex justify-between items-start mb-4">
        //             <div className="space-y-1">
        //                 {/* Main Quote Name */}
        //                 <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase">
        //                     {quote?.mainQuote.mainQuoteName || "Untitled Quote"}
        //                 </h3>

        //                 {/* Project Name as a Tag */}
        //                 <div className="flex items-center gap-2">
        //                     <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
        //                         {quote?.projectId?.projectName || "General Project"}
        //                     </span>
        //                     <span className="text-slate-300 text-xs">|</span>
        //                     <span className="text-[11px] font-bold text-slate-500 uppercase">
        //                         ID: {quote.quoteNo || "N/A"}
        //                     </span>
        //                 </div>
        //             </div>

        //             {/* Visual Document Icon */}
        //             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
        //                 <i className="fas fa-file-invoice text-slate-400 group-hover:text-white transition-colors" />
        //             </div>
        //         </div>

        //         <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
        //             {/* Items/Furniture Count */}
        //             {(quote.furnitures && quote.furnitures?.length > 0) && <div className="flex items-center gap-2">
        //                 <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs">
        //                     <i className="fas fa-couch" />
        //                 </div>
        //                 <div>
        //                     <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Items</p>
        //                     <p className="text-sm font-bold text-slate-700">{quote.furnitures?.length || 0} Units</p>
        //                 </div>
        //             </div>}

        //             {(quote.mainQuote && quote.mainQuote.works && quote.mainQuote.works?.length > 0) && <div className="flex items-center gap-2">
        //                 <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs">
        //                     <i className="fas fa-couch" />
        //                 </div>
        //                 <div>
        //                     <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Works</p>
        //                     <p className="text-sm font-bold text-slate-700">{quote.mainQuote.works?.length || 0} Units</p>
        //                 </div>
        //             </div>}

        //             {/* Date Information */}
        //             <div className="flex items-center gap-2">
        //                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 text-xs">
        //                     <i className="fas fa-calendar-alt" />
        //                 </div>
        //                 <div>
        //                     <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Created</p>
        //                     <p className="text-[11px] font-bold text-slate-700">
        //                         {dateFormate(quote.createdAt)}
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="flex items-center justify-end pt-4">
        //             {/* Timestamp footer */}
        //             {/* <p className="text-[10px] text-slate-400 font-medium">
        //                 Last Modified: {formatTime(quote.createdAt)}
        //             </p> */}

        //             <div className="flex gap-2">
        //                 <Button
        //                     size="sm"
        //                     variant="secondary"
        //                     className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 border-none"
        //                     onClick={() => navigate(`single/${quote._id}`)}
        //                 >
        //                     <i className="fas fa-expand mr-1.5" /> Open
        //                 </Button>

        //                 {canDelete && (
        //                     <Button
        //                         size="sm"
        //                         isLoading={isPending}
        //                         variant='danger'
        //                         className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider hover:bg-red-600 text-red-600 hover:text-white border-none transition-all"
        //                         onClick={() => handleDelete(quote._id)}
        //                     >
        //                         <i className="fas fa-trash-alt mr-1.5" /> Delete
        //                     </Button>
        //                 )}
        //             </div>
        //         </div>
        //     </CardContent>
        // </Card>



    )
}

