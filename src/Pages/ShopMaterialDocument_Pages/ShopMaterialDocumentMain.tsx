import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import { useDebounce } from '../../Hooks/useDebounce';
import { useGetMaterialShopDocumentInfinite } from '../../apiList/shopMaterialDocument_api/shopMaterialDocumentApi';
import { Button } from '../../components/ui/Button';
import MaterialOverviewLoading from '../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import ShopMaterialDocumentCard from './ShopMaterialDocumentCard';

const ShopMaterialDocumentMain: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const {organizationId} = useParams()

    // --- Filter State ---
    const [filters, setFilters] = useState({
        categoryName: "",
    });

    const debouncedCategory = useDebounce(filters.categoryName, 600);

    // --- Fetch Records (Infinite) ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useGetMaterialShopDocumentInfinite(organizationId!, debouncedCategory);

    // --- Infinite Scroll Logic ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Trigger when 100px from bottom
            if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const records = data?.pages.flatMap(page => page.data) || [];

    // --- Navigation Logic ---
    const isSubPage = location.pathname.includes("single") || location.pathname.includes("create");
    if (isSubPage) return <Outlet />;

    return (
        <div className="p-2 space-y-4 h-full relative">
            <header className="flex justify-between items-center pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-store mr-3 text-blue-600"></i>
                        Shop Material Documents
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Manage and organize documents received from various material shops
                    </p>
                </div>

                <div className="flex gap-2 items-center">
                    <Button variant='primary' onClick={() => navigate('create')}>
                        <i className="fas fa-plus mr-2"></i>
                        Add Category
                    </Button>
                </div>
            </header>

            {isLoading ? (
                <MaterialOverviewLoading />
            ) : isError ? (
                <div className="max-w-xl mx-auto mt-4 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                    <div className="text-red-600 font-semibold mb-2 text-xl">⚠️ Error Occurred</div>
                    <p className="text-red-500 mb-4">{(error as any)?.message || "Failed to load shop documents"}</p>
                    <Button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2">Retry</Button>
                </div>
            ) : (
                <main className="flex gap-4 h-[calc(100%-90px)]">
                    {/* --- Filter Sidebar --- */}
                    <div className="xl:w-72 w-64 flex-shrink-0 overflow-y-auto custom-scrollbar">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-filter mr-2 text-blue-600"></i>
                                    Filters
                                </h3>
                                {filters.categoryName && (
                                    <button
                                        onClick={() => setFilters({ categoryName: "" })}
                                        className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="Search by category..."
                                        value={filters.categoryName}
                                        onChange={(e) => setFilters({ categoryName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- List View --- */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {records.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 text-center p-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-file-pdf text-3xl text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">No Documents Found</h3>
                                <p className="text-sm text-gray-500">Upload your first shop receipt to see it here.</p>
                            </div>
                        ) : (
                            <div
                                ref={scrollContainerRef}
                                className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar flex flex-col"
                            >
                                {/* Sticky Table Header */}
                                <div className="sticky top-0 z-10 bg-white border-b border-blue-200 shadow-sm">
                                    <div className="grid grid-cols-10 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                        <div className="col-span-1 text-center">#</div>
                                        <div className="col-span-3">Category / File Name</div>
                                        <div className="col-span-2 text-center">No of Pdf</div>
                                        <div className="col-span-2 text-center">Created Date</div>
                                        <div className="col-span-2 text-center">Action</div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {records.map((record: any, index: number) => (
                                        <ShopMaterialDocumentCard
                                            key={record._id}
                                            data={record}
                                            index={index}
                                            onView={() => navigate(`single/${record._id}`)}
                                        />
                                    ))}
                                </div>

                                {isFetchingNextPage && (
                                    <div className="flex justify-center py-6 bg-gray-50">
                                        <i className="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
                                        <span className="text-sm">Loading more...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
};

export default ShopMaterialDocumentMain;