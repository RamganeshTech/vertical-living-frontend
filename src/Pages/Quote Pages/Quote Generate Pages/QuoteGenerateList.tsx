import React, { useMemo, useState } from 'react'
import { useGetMaterialQuoteEntries } from '../../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi';
import { useParams } from 'react-router-dom';
import MaterialOverviewLoading from '../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import type { AvailableProjetType } from '../../Department Pages/Logistics Pages/LogisticsShipmentForm';
import { useGetProjects } from '../../../apiList/projectApi';
import QuoteGenerateCard from './QuoteGenerate Main/QuoteGenerateCard';
import type { FurnitureBlock } from './QuoteGenerate Main/FurnitureForm';
import { useAuthCheck } from '../../../Hooks/useAuthCheck';
import { useDebounce } from '../../../Hooks/useDebounce';
import { QUOTE_TYPE } from './QuoteGenerate Main/InternalQuote_New_Version/CreateQuoteModal';

type Props = {
    setFurnitures?: React.Dispatch<React.SetStateAction<FurnitureBlock[]>>
    setIsEditingId?: React.Dispatch<React.SetStateAction<string | null>>
    setQuoteType?: React.Dispatch<React.SetStateAction<"single" | "residential" | null>>
    setFiltersMain?: React.Dispatch<React.SetStateAction<{
        projectId: string;
        projectName: string;
    }>>
    setEditQuoteNo?: React.Dispatch<React.SetStateAction<string | null>>
}


const QuoteGenerateList: React.FC<Props> = ({
    // setFurnitures, 
    // setEditQuoteNo,
    //  setIsEditingId, 
    //  setFiltersMain, 
    //  setQuoteType 
}) => {

    const { organizationId } = useParams();
    const [filters, setFilters] = useState({
        // createdAt: "",
        projectId: "",
        projectName: "",
        startDate: '',     // Transaction Date From
        endDate: '',       // Transaction Date To
        quoteType: "",
        search: "",
    });

    // --- Debounce Hooks for High-Frequency Inputs ---
    // We debounce these to prevent API calls on every slider move or keystroke
    // const debouncedMinAmount = useDebounce(filters.minAmount, 800);
    // const debouncedMaxAmount = useDebounce(filters.maxAmount, 800);
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
    const canList = role === "owner" || permission?.internalquote?.list;
    // const canCreate = role === "owner" || permission?.internalquote?.create;
    // const canDelete = role === "owner" || permission?.internalquote?.delete;
    // const canEdit = role === "owner" || permission?.internalquote?.edit;



    const { data } = useGetProjects(organizationId!)

    const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))

    const { data: allQuotes, isLoading } = useGetMaterialQuoteEntries(organizationId!, apiFilters);



    const quotes = allQuotes?.filter((quote: any) => quote.mainQuote === null)

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


    return (
        <main className="flex gap-2 h-full !max-h-[92%] ">

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
            </div>

            {canList && <section className="w-full !max-h-full gap-2 overflow-y-auto h-full">

                {isLoading ? (
                    <MaterialOverviewLoading />
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
                                <QuoteGenerateCard
                                    // setEditQuoteNo={setEditQuoteNo} 
                                    // setFurnitures={setFurnitures} 
                                    // setIsEditingId={setIsEditingId}
                                    //  setQuoteType={setQuoteType}
                                    //   setFiltersMain={setFiltersMain} 
                                    key={quote._id} quote={quote}
                                    organizationId={organizationId!} />
                            </>
                        ))}
                    </div>
                )}
            </section>}

        </main>
    )
}

export default QuoteGenerateList