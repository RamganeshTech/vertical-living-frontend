import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useCreateInternalQuote, useUpdateInternalQuote } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
import { toast } from '../../../../../utils/toast';
import { Button } from '../../../../../components/ui/Button';
import SearchSelectNew from '../../../../../components/ui/SearchSelectNew';
import { useGetProjects } from '../../../../../apiList/projectApi';
import { Label } from '../../../../../components/ui/Label';
import { useDeleteQuote, useGetMaterialQuoteEntries } from '../../../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi';
import type { AvailableProjetType } from '../../../../Department Pages/Logistics Pages/LogisticsShipmentForm';
import { useAuthCheck } from '../../../../../Hooks/useAuthCheck';
import MaterialOverviewLoading from '../../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { dateFormate, formatTime } from '../../../../../utils/dateFormator';
import { Input } from '../../../../../components/ui/Input';
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <i className="fas fa-edit text-blue-600"></i>
                            {isEditing ? 'Update Quote Details' : 'Create New Quote'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Quote Name</label>
                                <Input
                                    className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.mainQuoteName}
                                    onChange={(e) => setFormData({ ...formData, mainQuoteName: e.target.value })}
                                    placeholder="e.g. Phase 1 Glasswork"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                                {/* <select
                                    className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.quoteCategory}
                                    onChange={(e) => setFormData({ ...formData, quoteCategory: e.target.value })}
                                >
                                    <option value="commercial">Commercial</option>
                                    <option value="residential">Residential</option>
                                </select> */}

                                <SearchSelectNew
                                    options={["commercial", "residential"].map((p: string) => ({ value: p, label: p }))}
                                    placeholder="Select Quote Type..."
                                    value={formData.quoteCategory || ""}
                                    onValueChange={(val) => setFormData(p => ({ ...p, quoteCategory: val }))}
                                />
                            </div>

                            {/* <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Select Project</label>
                                <SearchSelectNew 
                                    onValueChange={(val) => setFormData({...formData, projectId: val})}
                                    // Pass project list from your query here
                                />
                            </div> */}

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black text-gray-400">Project</Label>
                                <SearchSelectNew
                                    options={projectsData.map((p: any) => ({ value: p._id, label: p.projectName }))}
                                    placeholder="Select Project..."
                                    value={formData.projectId || ""}
                                    onValueChange={(val) => setFormData(p => ({ ...p, projectId: val }))}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button className="flex-1 bg-blue-600" onClick={handleSubmit}>
                                {isEditing ? 'Update' : 'Generate Quote'}
                            </Button>
                        </div>
                    </div>
                </div>
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
        <Card
            className="w-full border-l-4 border-blue-600 shadow-md bg-white hover:shadow-lg transition-all"
        >
            <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                    <div>

                        <div className='my-1'>
                            <h3 className="text-base font-bold text-blue-700 leading-[8px] ">
                                Project: <span className='text-black'>{quote?.projectId?.projectName || "Project"}</span>
                            </h3>
                            <span className="text-[12px] font-semibold text-gray-500">
                                Quote No: <span className='text-black'>{quote.quoteNo || "N/A"}</span>
                            </span>
                        </div>


                        <p className="text-xs text-gray-500 ">
                            Created on: {dateFormate(quote.createdAt)} -  {formatTime(quote.createdAt)}
                        </p>
                    </div>
                    <i className="fas fa-file-alt text-gray-400 text-xl" />
                </div>

                {/* <p className="text-sm text-gray-600 mt-2">
                                    <strong>Grand Total:</strong> ₹{quote.grandTotal.toLocaleString("en-IN")}
                                </p> */}

                <p className="text-sm text-gray-500 italic">
                    <strong>Furnitures: </strong> {quote.furnitures?.length || 0}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                    {/* <Button
                        size="sm"
                        variant="secondary"
                    onClick={() => navigate(`single/${quote._id}`)}
                    >
                        <i className="fas fa-eye mr-1" /> View
                    </Button> */}
                    {/* <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {


                            const { furnitures} = quote;

                            const parsedFurniture = furnitures.map((f: any) => ({
                                furnitureName: f.furnitureName,
                                coreMaterials: f.coreMaterials.map((cm: any) => ({
                                    itemName: cm?.itemName || "",
                                    plywoodNos: cm?.plywoodNos || { quantity: 0, thickness: 0 },
                                    laminateNos: cm.laminateNos || { quantity: 0, thickness: 0 },
                                    carpenters: cm.carpenters || 0,
                                    days: cm.days || 0,
                                    profitOnMaterial: cm.profitOnMaterial || 0,
                                    profitOnLabour: cm.profitOnLabour || 0,
                                    rowTotal: cm.rowTotal || 0,
                                    remarks: cm.remarks || "",
                                    imageUrl: cm.imageUrl || "", // 🔁 PRESERVE image
                                    previewUrl: cm.imageUrl || "", // 🔁 preview if needed
                                })),
                                fittingsAndAccessories: f.fittingsAndAccessories || [],
                                glues: f.glues || [],
                                nonBrandMaterials: f.nonBrandMaterials || [],
                                totals: {
                                    core: f.coreMaterialsTotal || 0,
                                    fittings: f.fittingsAndAccessoriesTotal || 0,
                                    glues: f.gluesTotal || 0,
                                    nbms: f.nonBrandMaterialsTotal || 0,
                                    furnitureTotal: f.furnitureTotal || 0,
                                },
                            }));
                            console.log("parsedFurniture", parsedFurniture)
                            setEditQuoteNo(quote?.quoteNo)
                            setFurnitures(parsedFurniture)
                            setIsEditingId(quote._id)
                            setQuoteType(() => {
                                if (quote?.furnitures?.length > 1) {
                                    return "residential"
                                } else {
                                    return "single"
                                }
                            })
                            
                            setFiltersMain({
                                projectId: quote.projectId._id,
                                projectName: quote.projectId.projectName
                            })
                        }}
                    >
                        <i className="fas fa-eye mr-1" /> Edit
                    </Button> */}

                    <Button
                        size="sm"
                        isLoading={isPending}
                        variant="secondary"
                        // className="bg-red-600 text-white"
                        onClick={() => navigate(`single/${quote._id}`)}
                    >
                        <i className="fas fa-eye mr-1" /> View
                    </Button>


                    {canDelete && <Button
                        size="sm"
                        isLoading={isPending}
                        variant="danger"
                        className="bg-red-600 text-white"
                        onClick={() => handleDelete(quote._id)}
                    >
                        <i className="fas fa-trash mr-1" /> Delete
                    </Button>}

                </div>
            </CardContent>
        </Card>
    )
}

