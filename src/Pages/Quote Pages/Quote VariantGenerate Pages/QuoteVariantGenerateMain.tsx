import { useParams, useLocation, Outlet, useNavigate } from "react-router-dom";
// import { Button } from "../../../components/ui/Button";
import { useGetMaterialQuoteEntries } from "../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

import type { AvailableProjetType } from "../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useGetProjects } from "../../../apiList/projectApi";
import { useMemo, useState } from "react";
import QuoteVarientCard from "./QuoteVarientCard";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";
import StageGuide from "../../../shared/StageGuide";
import { useDebounce } from "../../../Hooks/useDebounce";
import { QUOTE_TYPE } from "../Quote Generate Pages/QuoteGenerate Main/InternalQuote_New_Version/CreateQuoteModal";

const QuoteGenerateVariantMain = () => {
    const { organizationId } = useParams();

    const [filters, setFilters] = useState({
        projectId: "",
        projectName: "",
        startDate: '',     // Transaction Date From
        endDate: '',       // Transaction Date To
        quoteType: "",
        search: "",
    });



    const debouncedSearch = useDebounce(filters.search, 800);
    const debouncedStartDate = useDebounce(filters.startDate, 800);
    const debouncedEndDate = useDebounce(filters.endDate, 800);


    // --- Construct Final Filter Object for API ---
    const apiFilters = useMemo(() => ({
        projectId: filters.projectId,
        startDate: debouncedStartDate, // <--- Used here
        endDate: debouncedEndDate,     // <--- Used here
        quoteType: filters.quoteType,
        // minAmount: debouncedMinAmount,
        // maxAmount: debouncedMaxAmount,
        search: debouncedSearch,
    }), [filters.projectId, filters.startDate, filters.endDate, debouncedSearch, debouncedEndDate, debouncedStartDate, filters.quoteType]);



    const { role, permission } = useAuthCheck();
    const canList = role === "owner" || permission?.quotevariant?.list;
    // const canCreate = role === "owner" || permission?.quotevariant?.create;
    // const canDelete = role === "owner" || permission?.quotevariant?.delete;
    // const canEdit = role === "owner" || permission?.quotevariant?.edit;


    // const [searchInput, setSearchInput] = useState("");     // user typing
    // const [searchTerm, setSearchTerm] = useState<string>(""); // value used for sending to the api
    const { data } = useGetProjects(organizationId!)
    // console.log("data", data)
    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))
    const navigate = useNavigate();

    const { data: allQuotes, isLoading } = useGetMaterialQuoteEntries(organizationId!, apiFilters);




    const quotes = allQuotes?.filter((quote: any) => quote.mainQuote === null && quote?.sqftRateWork && quote?.sqftRateWork?.length === 0)



    const location = useLocation();



    const internalQuoteNavigate = () => {
        navigate(`../internalquote`)
    }



    const clearFilters = () => {
        setFilters({
            projectId: "",
            projectName: "",
            // createdAt: "",
            startDate: '',     // Transaction Date From
            endDate: '',       // Transaction Date To
            quoteType: "",
            search: "",
        });
    };
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    const isChildRoute = location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;


    return (
        <div className="p-2 max-h-full overflow-y-auto  min-h-full">
            <header className="flex justify-between items-center mb-2">
                <div>
                    <div className="flex gap-2 items-center">
                        <i className="fas fa-file-invoice text-4xl text-blue-600" />
                        <div className="">
                            <h1 className="text-2xl font-bold ">Quote Variant generator</h1>
                            <p className="text-sm text-gray-500">existing quotes are from the internal quote section</p>

                        </div>
                    </div>

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



                <div className="w-full sm:w-auto flex justify-end sm:block">
                    <StageGuide
                        organizationId={organizationId!}
                        stageName="materialquote"
                    />
                </div>
            </header>



{/* kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaaaaaaaaaaaaaaaaaaaaa kkkkkkkkkkkkkkkkkkk */}

{/* kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaaaaaaaaaaaaaaaaaaaaa kkkkkkkkkkkkkkkkkkk */}

            <main className="flex gap-4 w-full h-[calc(100vh-108px)] overflow-hidden">

                <section className="xl:w-80 flex-shrink-0  h-full overflow-y-auto">
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
                                                        Created Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        onChange={(e) => setFilters((f) => ({ ...f, createdAt: e.target.value }))}
                                                        value={filters.createdAt}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div> */}


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>

                                <input
                                    type="text"
                                    placeholder="Search Quote No, Quote Name"
                                    value={filters.search}
                                    autoFocus
                                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"

                                // className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quote Type</label>
                                <select
                                    value={filters.quoteType || ''}
                                    onChange={(e) => setFilters((f) => ({ ...f, quoteType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">All Type</option>
                                    {QUOTE_TYPE.map(option => {
                                        return <option key={option} value={option}>
                                            {option === "sqft_rate" ? "Sqft Rate" :
                                                option[0].toUpperCase() + option.slice(1)}</option>
                                    })}
                                </select>
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


                            {/* 5. Date Range Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">From</span>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">To</span>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {canList && <section className="flex-1 h-full overflow-y-auto custom-scrollbar pb-10">

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
                </section>}

            </main>
        </div>
    );
};

export default QuoteGenerateVariantMain;