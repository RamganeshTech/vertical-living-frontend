import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCategoryDimensions } from '../../apiList/Quote Api/RateConfig Api/instantCostCalculator_Api/instantCostCalculatorApi';
import { Button } from '../../components/ui/Button';
// import { useGetCategoryDimensions } from '../../Hooks/useInstantCostHooks'; // Adjust path
// import { Button } from '../ui/Button'; // Adjust path

export const InstantCostCalculatorDimentionMain: React.FC = () => {
    const navigate = useNavigate();

    // Grab the category ID from the URL and Org ID from Auth Context
    const { categoryId, organizationId } = useParams<{ categoryId: string, organizationId: string }>();
    // const location = useLocation()


    // Fetch the dimensions for this specific category
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useGetCategoryDimensions(organizationId || "", categoryId || "");

    // Safely extract the data based on our controller's response structure
    const categoryName = data?.categoryName || "Product Module";
    const dimensions = data?.data || [];

    // const isDetailView = location.pathname.includes('/single');
    // if (isDetailView) return <Outlet />;


    return (
        //   <div className="w-full h-full bg-brand-surface custom-scrollbar overflow-y-auto flex flex-col">

        //             {/* Header Section */}
        //             <header className="sticky top-0 z-20 bg-brand-surface/95 backdrop-blur-sm border-b border-ash-light px-6 py-5 shrink-0 shadow-sm">
        //                 <div className="max-w-7xl mx-auto flex items-center justify-between">
        //                     <div className="flex items-center gap-5">
        //                         <button
        //                             type="button"
        //                             onClick={() => navigate(-1)}
        //                             className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-ash border border-ash-medium text-text-muted hover:text-text-main hover:bg-ash-medium transition-all shadow-sm shrink-0 cursor-pointer"
        //                         >
        //                             <i className="fas fa-arrow-left text-sm"></i>
        //                         </button>

        //                         <div className="flex items-center gap-4">
        //                             <div className="w-12 h-12 bg-brand-ash border border-ash-medium rounded-xl flex items-center justify-center shadow-inner shrink-0">
        //                                 <i className="fas fa-ruler-combined text-xl text-action-primary"></i>
        //                             </div>
        //                             <div className="flex flex-col justify-center">
        //                                 <h1 className="text-xl sm:text-2xl font-extrabold text-text-main leading-tight tracking-tight">
        //                                     {isLoading ? "Loading Module..." : categoryName}
        //                                 </h1>
        //                                 <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">
        //                                     Select Dimension Matrix to Configure
        //                                 </p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </header>

        //             {/* Main Content Area */}
        //             <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">

        //                 <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ash-light pb-5">
        //                     <div>
        //                         <h2 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-2">
        //                             <span className="w-1.5 h-4 bg-action-primary rounded-full inline-block"></span>
        //                             Available Dimensions
        //                         </h2>
        //                         <p className="text-xs font-medium text-text-soft mt-2 pl-3.5 max-w-2xl">
        //                             These sizes were automatically extracted from the category fields. Select a dimension below to configure its specific core materials, finishes, fittings, and labour costs.
        //                         </p>
        //                     </div>
        //                     <div className="bg-brand-ash/50 border border-ash-light px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm shrink-0">
        //                         <div className="w-6 h-6 rounded-md bg-brand-surface border border-ash-medium flex items-center justify-center text-text-muted">
        //                             <i className="fas fa-hashtag text-[10px]"></i>
        //                         </div>
        //                         <span className="text-xs font-bold text-text-main">{dimensions.length} Sizes Found</span>
        //                     </div>
        //                 </div>

        //                 {/* State Handling: Loading */}
        //                 {isLoading && (
        //                     <div className="w-full h-64 flex flex-col items-center justify-center bg-brand-ash/30 rounded-2xl border border-ash-light border-dashed">
        //                         <i className="fas fa-circle-notch fa-spin text-3xl text-action-primary mb-4"></i>
        //                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted animate-pulse">Scanning Fields...</p>
        //                     </div>
        //                 )}

        //                 {/* State Handling: Error */}
        //                 {!isLoading && isError && (
        //                     <div className="w-full max-w-lg mx-auto p-8 bg-brand-surface border border-action-danger/30 rounded-2xl shadow-sm text-center">
        //                         <div className="w-16 h-16 bg-action-danger/10 text-action-danger rounded-full flex items-center justify-center mx-auto mb-4">
        //                             <i className="fas fa-exclamation-triangle text-2xl"></i>
        //                         </div>
        //                         <h3 className="text-lg font-extrabold text-text-main mb-2">Extraction Failed</h3>
        //                         <p className="text-text-muted text-xs font-medium mb-6">
        //                             {(error as any)?.message || "Unable to retrieve dimensions for this category."}
        //                         </p>
        //                         <Button onClick={() => refetch()} variant="outline" className="border-ash-dark text-text-main hover:bg-brand-ash px-8 h-10 font-bold uppercase tracking-wider text-[10px]">
        //                             Retry Connection
        //                         </Button>
        //                     </div>
        //                 )}

        //                 {/* State Handling: Empty */}
        //                 {!isLoading && !isError && dimensions.length === 0 && (
        //                     <div className="w-full h-64 flex flex-col items-center justify-center bg-brand-ash/30 rounded-2xl border border-ash-light border-dashed text-center p-6">
        //                         <div className="w-16 h-16 bg-brand-surface border border-ash-medium rounded-full flex items-center justify-center mb-4 shadow-sm">
        //                             <i className="fas fa-compress-arrows-alt text-2xl text-text-muted"></i>
        //                         </div>
        //                         <h3 className="text-base font-extrabold text-text-main mb-1">No Dimensions Detected</h3>
        //                         <p className="text-xs text-text-muted max-w-sm font-medium leading-relaxed">
        //                             We couldn't find any fields in this category formatted as a dimension (e.g., "6 x 7" or "6ft h x 7ft w"). Please update the category fields and try again.
        //                         </p>
        //                         <Button
        //                             onClick={() => navigate('/settings/categories')} // Adjust path to your actual category settings
        //                             variant="dark"
        //                             className="mt-6 h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-sm"
        //                         >
        //                             Edit Category Fields
        //                         </Button>
        //                     </div>
        //                 )}

        //                 {/* State Handling: Success Grid */}
        //                 {!isLoading && !isError && dimensions.length > 0 && (
        //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        //                         {dimensions.map((dim: any, index: number) => {
        //                             const sizeString = dim.key;

        //                             return (
        //                                 <div
        //                                     key={index}
        //                                     onClick={() => navigate(`single/${encodeURIComponent(sizeString)}`)}
        //                                     className="group bg-brand-surface border border-ash-medium hover:border-action-primary/50 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
        //                                 >
        //                                     {/* Top Accent Line on Hover */}
        //                                     <div className="absolute top-0 left-0 w-full h-1 bg-brand-ash group-hover:bg-action-primary transition-colors duration-300"></div>

        //                                     {/* Card Header (Badge & Icon) */}
        //                                     <div className="w-full flex justify-between items-center mb-6">
        //                                         <span className="bg-brand-ash/50 border border-ash-light text-text-muted text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md">
        //                                             Size Matrix
        //                                         </span>
        //                                         <div className="w-8 h-8 rounded-full bg-brand-ash/50 flex items-center justify-center text-text-muted group-hover:text-action-primary group-hover:bg-action-primary/10 transition-all duration-300">
        //                                             <i className="fas fa-cog group-hover:rotate-90 transition-transform duration-500"></i>
        //                                         </div>
        //                                     </div>

        //                                     {/* Main Typography */}
        //                                     <div className="my-4 text-center sm:text-left">
        //                                         <h3 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight group-hover:text-action-primary transition-colors">
        //                                             {sizeString}
        //                                         </h3>
        //                                     </div>

        //                                     {/* Card Footer */}
        //                                     <div className="w-full mt-auto pt-5 border-t border-ash-light/50 flex items-center justify-between">
        //                                         <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors">
        //                                             Configure Details
        //                                         </span>
        //                                         <div className="w-8 h-8 rounded-lg bg-brand-surface border border-ash-medium flex items-center justify-center text-text-muted group-hover:bg-action-primary group-hover:text-brand-surface group-hover:border-action-primary transition-all duration-300 shadow-sm">
        //                                             <i className="fas fa-arrow-right text-[10px]"></i>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             );
        //                         })}
        //                     </div>
        //                 )}
        //             </main>
        //         </div>

        <div className="w-full h-full bg-brand-surface custom-scrollbar overflow-y-auto flex flex-col">

            {/* Header Section */}
            <header className="sticky top-0 z-10 bg-brand-surface/95  border-b border-ash-light px-6 py-2 shrink-0">
                <div className="max-w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash transition-all shrink-0 cursor-pointer"
                        >
                            <i className="fas fa-arrow-left text-sm"></i>
                        </button>

                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center shrink-0">
                                <i className="fas fa-ruler-combined text-lg text-action-primary"></i>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-lg sm:text-xl font-semibold text-text-main leading-tight">
                                    {isLoading ? "Loading Module..." : categoryName}
                                </h1>
                                <p className="text-xs text-text-muted mt-0.5">
                                    Select a dimension to configure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-full mx-auto px-6 py-2">

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-main flex items-center gap-2">
                            Available Dimensions
                        </h2>
                        <p className="text-xs text-text-muted leading-4 mt-1 max-w-2xl">
                            These sizes were automatically extracted from the category fields. Select a dimension below to configure its specific core materials, finishes, fittings, and labour costs.
                        </p>
                    </div>
                    <div className="border border-ash-light bg-brand-ash/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shrink-0">
                        <i className="fas fa-hashtag text-text-muted text-[10px]"></i>
                        <span className="text-xs font-semibold text-text-main">{dimensions.length} Sizes</span>
                    </div>
                </div>

                {/* State Handling: Loading */}
                {isLoading && (
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-brand-ash/20 rounded-xl border border-ash-light border-dashed">
                        <i className="fas fa-circle-notch fa-spin text-2xl text-action-primary mb-3"></i>
                        <p className="text-xs font-medium text-text-muted">Scanning Fields...</p>
                    </div>
                )}

                {/* State Handling: Error */}
                {!isLoading && isError && (
                    <div className="w-full max-w-lg mx-auto p-6 bg-brand-surface border border-action-danger/20 rounded-xl shadow-sm text-center mt-10">
                        <div className="w-12 h-12 bg-action-danger/10 text-action-danger rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-exclamation-triangle text-lg"></i>
                        </div>
                        <h3 className="text-base font-semibold text-text-main mb-1.5">Extraction Failed</h3>
                        <p className="text-text-muted text-sm mb-5">
                            {(error as any)?.message || "Unable to retrieve dimensions for this category."}
                        </p>
                        <Button onClick={() => refetch()} variant="outline" className="border-ash-medium text-text-main hover:bg-brand-ash px-6 h-9 text-xs font-medium shadow-sm">
                            Retry Connection
                        </Button>
                    </div>
                )}

                {/* State Handling: Empty */}
                {!isLoading && !isError && dimensions.length === 0 && (
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-brand-ash/20 rounded-xl border border-ash-light border-dashed text-center p-6">
                        <div className="w-12 h-12 bg-brand-surface border border-ash-medium rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <i className="fas fa-compress-arrows-alt text-lg text-text-muted"></i>
                        </div>
                        <h3 className="text-base font-semibold text-text-main mb-1">No Dimensions Detected</h3>
                        <p className="text-sm text-text-muted max-w-sm">
                            We couldn't find any fields in this category formatted as a dimension (e.g., "6 x 7"). Please update the category fields and try again.
                        </p>
                        <Button
                            onClick={() => navigate('/settings/categories')}
                            variant="dark"
                            className="mt-5 h-9 px-6 text-xs font-medium shadow-sm"
                        >
                            Edit Category Fields
                        </Button>
                    </div>
                )}

                {/* State Handling: Success Grid */}
                {!isLoading && !isError && dimensions.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {dimensions.map((dim: any, index: number) => {
                            const sizeString = dim.key;

                            return (
                                <div
                                    key={index}
                                    onClick={() => navigate(`single/${encodeURIComponent(sizeString)}`)}
                                    className="group bg-brand-surface border border-ash-medium hover:border-action-primary/50 rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-44 relative overflow-hidden"
                                >
                                    {/* Subtle Top Accent Line on Hover */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-ash-dark transition-colors duration-300"></div>

                                    {/* Card Header (Badge & Icon) */}
                                    <div className="w-full flex justify-between items-center mb-4 pt-1">
                                        <span className="bg-brand-ash border border-ash-light text-text-muted text-[10px] font-medium px-2.5 py-0.5 rounded">
                                            Size Matrix
                                        </span>
                                        <div className="text-ash-dark group-hover:text-action-primary transition-colors">
                                            <i className="fas fa-cog text-sm group-hover:rotate-90 transition-transform duration-500"></i>
                                        </div>
                                    </div>

                                    {/* Main Typography */}
                                    <div className="my-2">
                                        <h3 className="text-xl sm:text-2xl font-bold text-text-main group-hover:text-action-primary transition-colors line-clamp-2">
                                            {sizeString}
                                        </h3>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="w-full mt-auto pt-4 border-t border-ash-light/50 flex items-center justify-between">
                                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">
                                            Configure Details
                                        </span>
                                        <div className="w-6 h-6 rounded-full bg-brand-ash/50 border border-ash-light flex items-center justify-center text-text-soft group-hover:text-action-primary transition-colors">
                                            <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InstantCostCalculatorDimentionMain;