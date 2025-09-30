import { useParams, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { useGetMaterialQuoteEntries } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

import type { AvailableProjetType } from "../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useGetProjects } from "../../../apiList/projectApi";
import { useState } from "react";
import QuoteVarientCard from "./QuoteVarientCard";

const QuoteGenerateVariantMain = () => {
    const { organizationId } = useParams();

    const [filters, setFilters] = useState({
        // status: "",
        projectId: "",
        projectName: "",
        createdAt: "",
    });

    const [searchInput, setSearchInput] = useState("");     // user typing
    const [searchTerm, setSearchTerm] = useState<string>(""); // value used for sending to the api
    const { data } = useGetProjects(organizationId!)
    // console.log("data", data)
    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))
    const navigate = useNavigate();

    const { data: quotes, isLoading } = useGetMaterialQuoteEntries(organizationId!, {
        createdAt: filters.createdAt,
        projectId: filters.projectId,
        quoteNo: searchTerm,
    });





    const location = useLocation();



    const internalQuoteNavigate = () => {
        navigate(`../internalquote`)
    }



    const clearFilters = () => {
        setFilters({
            projectId: "",
            projectName: "",
            createdAt: "",
        });
    };
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    const isChildRoute = location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;


    return (
        <div className="p-2 max-h-full overflow-y-auto  min-h-full">
            <header className="flex justify-between items-center">
                <div className="flex gap-2">
                    <i className="fas fa-file-invoice text-4xl text-blue-600" />
                    <h1 className="text-2xl font-bold mb-4">Quote Varient generator</h1>
                </div>


                {/* <div className="flex gap-2">

                    <input
                        type="text"
                        placeholder="Search by Quote No"
                        value={searchInput}
                        autoFocus
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearchTerm(searchInput);  // ✅ Only triggers on Enter
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    <Button
                        onClick={() => setSearchTerm(searchInput)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        <i className="fas fa-search"> </i>
                    </Button>
                </div> */}
            </header>


            <main className="flex gap-2 !max-h-[87%]">

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
                            {/* <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                  </label>
                                  <select
                                    value={filters.status || ''}
                                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div> */}


                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search By Quote No
                                </label>
                                <div className="flex gap-2">

                                    <input
                                        type="text"
                                        placeholder="Search and Press Enter"
                                        value={searchInput}
                                        autoFocus
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setSearchTerm(searchInput);  // ✅ Only triggers on Enter
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />

                                    <Button
                                        onClick={() => setSearchTerm(searchInput)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        <i className="fas fa-search"> </i>
                                    </Button>
                                </div>

                            </div>

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
                                Please create a quote from the
                                <span className="font-semibold text-blue-600 cursor-pointer" onClick={internalQuoteNavigate}> Internal Quote </span>
                                section to view brand-wise breakdowns here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quotes.map((quote: any) => (
                                <>
                                    <QuoteVarientCard key={quote._id} quote={quote} organizationId={organizationId!} />
                                </>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
};

export default QuoteGenerateVariantMain;