import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductSpecificCategories } from '../../apiList/Quote Api/RateConfig Api/instantCostCalculator_Api/instantCostCalculatorApi';
import { Button } from '../../components/ui/Button';
// import { useGetProductSpecificCategories } from '../../Hooks/useInstantCostHooks'; // Adjust path to where you saved the hooks
// import { Button } from '../ui/Button'; // Adjust path

export const InstantCostCalculatorProductConfigMain: React.FC = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();

    // Fetch only categories where isProductSpecific is true
    const {
        data: categories,
        isLoading,
        isError,
        error,
        refetch
    } = useGetProductSpecificCategories(organizationId || "", true);

    return (
      
        <div className="w-full h-full bg-brand-surface custom-scrollbar overflow-y-auto flex flex-col">

            {/* Header Section (Solid White) */}
            <header className="sticky top-0 z-10 bg-brand-surface border-b border-ash-light px-6 py-2 shrink-0 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash transition-all shadow-sm shrink-0 cursor-pointer"
                        >
                            <i className="fas fa-arrow-left text-sm"></i>
                        </button>

                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                <i className="fas fa-calculator text-lg text-text-main"></i>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-lg sm:text-xl font-semibold text-text-main leading-tight">
                                    Instant Cost Calculator
                                </h1>
                                <p className="text-xs text-text-muted mt-0.5">
                                    Configure dimensions and pricing models
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-text-main">
                        Select a Product Category
                    </h2>
                    <p className="text-sm text-text-soft mt-1.5 max-w-2xl">
                        Choose a product category below to configure its specific dimension matrices, material requirements, and labour costs.
                    </p>
                </div>

                {/* State Handling: Loading */}
                {isLoading && (
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-brand-surface rounded-xl border border-ash-light shadow-sm">
                        <i className="fas fa-circle-notch fa-spin text-2xl text-action-primary mb-3"></i>
                        <p className="text-xs font-medium text-text-muted">Loading Categories...</p>
                    </div>
                )}

                {/* State Handling: Error */}
                {!isLoading && isError && (
                    <div className="w-full max-w-lg mx-auto p-6 bg-brand-surface border border-action-danger/20 rounded-xl shadow-sm text-center mt-10">
                        <div className="w-12 h-12 bg-action-danger/10 text-action-danger rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-exclamation-triangle text-lg"></i>
                        </div>
                        <h3 className="text-base font-semibold text-text-main mb-1.5">Connection Failed</h3>
                        <p className="text-text-muted text-sm mb-5">
                            {(error as any)?.message || "Unable to retrieve product categories at this time."}
                        </p>
                        <Button onClick={() => refetch()} variant="outline" className="border-ash-medium text-text-main hover:bg-brand-ash px-6 h-9 text-xs font-medium shadow-sm">
                            Retry Connection
                        </Button>
                    </div>
                )}

                {/* State Handling: Empty */}
                {!isLoading && !isError && categories?.length === 0 && (
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-brand-surface rounded-xl border border-ash-light shadow-sm text-center p-6">
                        <div className="w-12 h-12 bg-brand-ash border border-ash-medium rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <i className="fas fa-box-open text-lg text-text-muted"></i>
                        </div>
                        <h3 className="text-base font-semibold text-text-main mb-1">No Categories Found</h3>
                        <p className="text-sm text-text-muted max-w-sm">
                            There are currently no categories marked as "Product Specific".
                        </p>
                    </div>
                )}

                {/* State Handling: Success Grid */}
                {!isLoading && !isError && categories?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categories.map((category: any) => (
                            <div
                                key={category._id}
                                onClick={() => navigate(`../instant-cost-calculator/dimention/${category._id}`)}
                                className="group bg-brand-surface border border-ash-light hover:border-ash-medium rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-36"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-brand-ash/50 border border-ash-light flex items-center justify-center text-text-muted group-hover:text-action-primary group-hover:bg-action-primary/5 transition-colors">
                                        <i className="fas fa-cubes text-lg"></i>
                                    </div>
                                    <div className="text-ash-dark group-hover:text-text-main transition-colors mt-1">
                                        <i className="fas fa-arrow-right text-xs"></i>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <h3 className="text-base font-semibold text-text-main line-clamp-1">
                                        {category.name}
                                    </h3>
                                    <div className="mt-1.5">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-action-success/10 text-action-success border border-action-success/20 inline-block">
                                            Product Specific
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InstantCostCalculatorProductConfigMain;