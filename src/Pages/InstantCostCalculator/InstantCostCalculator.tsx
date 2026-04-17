

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetRole from "../../Hooks/useGetRole";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import SearchSelectNew from "../../components/ui/SearchSelectNew";

import { getApiForRole } from "../../utils/roleCheck";
import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from "../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
import { getMaterialBrand } from "../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";


interface MaterialState {
    categoryName?: string;
    brandId: string;
    brandName: string;
    rate: number | string;
    quantity: number | string;
    dimension: number | string;
    imageUrl?: string;
}

interface DimensionRow {
    name: string;
    width: number | string;
    height: number | string;
    unit: 'mm' | 'ft';
}

interface EssentialState {
    name: string;
    rate: number | string;
    quantity: number | string;
}

const InstantCostCalculation: React.FC = () => {
    const { organizationId } = useParams<{ organizationId: string }>();
    const { role } = useGetRole();
    const api = getApiForRole(role!);
    const allowedRoles = ["owner", "staff", "CTO"];

    const [activeFinish, setActiveFinish] = useState<string>("Laminate");
    const finishOptions = [
        { value: 'Laminate', label: 'Laminate Finish' },
        { value: 'PU', label: 'PU Finish' },
        { value: 'DUCO', label: 'DUCO Finish' },
        { value: 'Varnish', label: 'Varnish Finish' },
        { value: 'Paint', label: 'Paint Finish' },
    ];

    // --- 1. CORE MATERIALS STATE ---
    const [productDim, setProductDim] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const [plywood, setPlywood] = useState<MaterialState>({ categoryName: "Plywood", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 32 });
    const [innerLaminate, setInnerLaminate] = useState<MaterialState>({ categoryName: "Inner Laminate", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 32 });
    const [outerLaminate, setOuterLaminate] = useState<MaterialState>({ categoryName: "Outer Laminate", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 32 });

    const [otherFinish, setOtherFinish] = useState({ rate: 0, quantity: 1, dimension: 32 }); // For PU/DUCO/Paint/Varnish

    const [plywoodBrands, setPlywoodBrands] = useState<any[]>([]);
    const [innerLaminateBrands, setInnerLaminateBrands] = useState<any[]>([]);
    const [outerLaminateBrands, setOuterLaminateBrands] = useState<any[]>([]);

    // --- 2. FITTINGS STATE ---
    // const [fittings, setFittings] = useState<MaterialState[]>([]);
    const [fittings, setFittings] = useState<MaterialState[]>([
        { categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }
    ]);
    const [fittingBrandOptions, setFittingBrandOptions] = useState<Record<number, any[]>>({});
    const debounceTimers = useRef<Record<number, any>>({});

    // --- 3. ESSENTIALS STATE ---
    // const [essentials, setEssentials] = useState({ quantity: 1, rate: 0 });

    const [essentials, setEssentials] = useState<EssentialState[]>([
        { name: "", rate: 0, quantity: 1 }
    ]);


    // --- 4. LABOUR STATE ---
    const [labour, setLabour] = useState({ categoryId: "", categoryName: "", ratePerDay: 0, noOfLabours: 1, noOfDays: 1 });

    const { data: allLabourCategory = [] } = useGetLabourRateConfigCategories(organizationId!);
    const { data: labourCost = 0 } = useGetSingleLabourCost({ organizationId: organizationId!, categoryId: labour.categoryId });

    // --- 5. FACTORY & SQFT MODAL STATE ---
    const [factory, setFactory] = useState({ ratePerSqft: 0, totalSqft: 0 });
    const [showSqftModal, setShowSqftModal] = useState(false);
    const [dimensions, setDimensions] = useState<DimensionRow[]>([{ name: "Main Unit", width: "", height: "", unit: "mm" }]);

    // --- DATA FETCHING LOGIC ---

    // Generic fetcher for static dropdowns (Plywood, Laminates)
    const fetchStaticBrands = async (categoryName: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        if (!api || !organizationId || !categoryName) return;
        try {
            const results = await getMaterialBrand({ api, organizationId, categoryName });
            const formatted = results.map((item: any) => {
                const brandOnly = item.data?.Brand || item.data?.BrandName || item.data?.brand || item.data?.brandName || item.data?.["Brands light name"] || item.data?.["Brand "] || item.data?.["Brands "] || item.data?.["BRAND NAME "] || item.data?.["Brand Name"] || 'Unknown';
                return {
                    label: `${brandOnly} (${item.categoryName?.trim() || 'No Cat'})`,
                    value: item?._id ? String(item._id) : "",
                    rate: item.data?.Rs || item.data?.rs || item?.data?.RS || 0,
                    brandOnly: brandOnly
                };
            });
            setter(formatted);
        } catch (error) {
            console.error(`Error fetching ${categoryName}:`, error);
        }
    };

    // Load static categories on mount
    useEffect(() => {
        fetchStaticBrands("Plywood", setPlywoodBrands);
        fetchStaticBrands("Inner Laminate", setInnerLaminateBrands);
        fetchStaticBrands("Outer Laminate", setOuterLaminateBrands);
    }, [api, organizationId]);

    // Auto-select Labour Category & Sync Cost
    useEffect(() => {
        if (allLabourCategory.length > 0 && !labour.categoryId) {
            setLabour(prev => ({
                ...prev,
                categoryId: allLabourCategory[0]._id,
                categoryName: allLabourCategory[0].name
            }));
        }
    }, [allLabourCategory]);

    useEffect(() => {
        if (labourCost) {
            setLabour(prev => ({ ...prev, ratePerDay: labourCost }));
        }
    }, [labourCost]);

    // YOUR RESTORED LOGIC FOR FITTINGS DYNAMIC FETCHING
    const fetchAllCategoryItems = async (index: number, itemName: string) => {
        if (!itemName) return;
        try {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");

            const results = await getMaterialBrand({
                api,
                organizationId: organizationId!,
                categoryName: itemName
            });

            const formatted = results.map((item: any) => {
                const brandOnly =
                    item.data?.Brand || item.data?.BrandName || item.data?.brand || item.data?.brandName ||
                    item.data?.["Brands light name"] || item.data?.["Brand "] || item.data?.["Brands "] ||
                    item.data?.["BRAND NAME "] || item.data?.["Brand Name"] || 'Unknown';

                const img = item.data?.image || item.data?.Image || item.data?.img || item.data?.images || item.data?.Images || "";

                return {
                    label: `${brandOnly} (${item.categoryName?.trim() || 'No Cat'})`,
                    value: item?._id ? String(item._id) : "",
                    rate: item.data?.Rs || item.data?.rs || item?.data?.RS || 0,
                    brandOnly: brandOnly,
                    imageUrl: img
                };
            });

            setFittingBrandOptions(prev => ({ ...prev, [index]: formatted }));
        } catch (error) {
            console.error("Error fetching all category items:", error);
        }
    };



    // --- HANDLERS ---
    const handleAddFitting = () => setFittings([...fittings, { categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);


    // Replace your existing handleFittingCategoryChange and handleRemoveFitting with this logic:

    const updateFittingField = (index: number, field: keyof MaterialState, value: any) => {
        let newFittings = [...fittings];

        // Update the specific field
        newFittings[index] = { ...newFittings[index], [field]: value };

        // If category changed, reset dependent fields
        if (field === 'categoryName') {
            newFittings[index].brandId = "";
            newFittings[index].brandName = "";
            newFittings[index].rate = 0;

            if (debounceTimers.current[index]) clearTimeout(debounceTimers.current[index]);
            debounceTimers.current[index] = setTimeout(() => {
                fetchAllCategoryItems(index, value);
            }, 600);
        }

        // AUTO-ADD LOGIC:
        // If we just typed in the very last row, and it now has some text in the categoryName
        const isLastRow = index === newFittings.length - 1;
        if (isLastRow && newFittings[index].categoryName?.trim() !== "") {
            newFittings.push({ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 });
        }

        // AUTO-REMOVE LOGIC (Optional cleanup):
        // If a user deletes the text in a row, and it is NOT the last row, and all other fields are empty/zero
        // We could remove it, but generally, it's safer to let them use the delete button to avoid jumping UI.
        // We will stick to the manual delete button for removal for better UX, but auto-add is active.

        const isSecondToLastRow = index === newFittings.length - 2;
        if (isSecondToLastRow && newFittings[index].categoryName?.trim() === "") {
            const lastRow = newFittings[newFittings.length - 1];

            // Ensure the last row is completely empty before popping it to prevent accidental data loss
            if (lastRow.categoryName?.trim() === "" && !lastRow.brandId) {
                newFittings.pop(); // Removes the empty trailing row
            }
        }

        setFittings(newFittings);
    };

    const handleRemoveFitting = (index: number) => {
        // Prevent deleting the very last row if it's the ONLY row
        if (fittings.length === 1) {
            setFittings([{ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);
            return;
        }

        setFittings(fittings.filter((_, i) => i !== index));
        const newOptions = { ...fittingBrandOptions };
        delete newOptions[index];
        setFittingBrandOptions(newOptions);
    };



    // Handlers for Essentials (Auto-add and remove)
    const handleAddEssential = () => setEssentials([...essentials, { name: "", rate: 0, quantity: 1 }]);

    const updateEssentialField = (index: number, field: keyof EssentialState, value: any) => {
        let newEssentials = [...essentials];
        newEssentials[index] = { ...newEssentials[index], [field]: value };

        // AUTO-ADD LOGIC
        const isLastRow = index === newEssentials.length - 1;
        if (isLastRow && newEssentials[index].name?.trim() !== "") {
            newEssentials.push({ name: "", rate: 0, quantity: 1 });
        }

        // AUTO-REMOVE LOGIC
        const isSecondToLastRow = index === newEssentials.length - 2;
        if (isSecondToLastRow && newEssentials[index].name?.trim() === "") {
            const lastRow = newEssentials[newEssentials.length - 1];
            if (lastRow.name?.trim() === "") {
                newEssentials.pop();
            }
        }

        setEssentials(newEssentials);
    };

    const handleRemoveEssential = (index: number) => {
        if (essentials.length === 1) {
            setEssentials([{ name: "", rate: 0, quantity: 1 }]);
            return;
        }
        setEssentials(essentials.filter((_, i) => i !== index));
    };


    const handleDimensionAdd = () => setDimensions([...dimensions, { name: "", width: "", height: "", unit: "mm" }]);

    const handleDimensionChange = (index: number, field: keyof DimensionRow, value: any) => {
        const newDims = [...dimensions];
        newDims[index][field] = value as never;

        // AUTO-ADD LOGIC
        const isLastRow = index === newDims.length - 1;
        if (isLastRow && (newDims[index].name?.trim() !== "" || newDims[index].width !== "" || newDims[index].height !== "")) {
            newDims.push({ name: "", width: "", height: "", unit: "mm" });
        }

        // AUTO-REMOVE LOGIC
        const isSecondToLastRow = index === newDims.length - 2;
        if (isSecondToLastRow && newDims[index].name?.trim() === "" && newDims[index].width === "" && newDims[index].height === "") {
            const lastRow = newDims[newDims.length - 1];
            if (lastRow.name?.trim() === "" && lastRow.width === "" && lastRow.height === "") {
                newDims.pop();
            }
        }

        setDimensions(newDims);
    };

    const handleDimensionRemove = (index: number) => {
        if (dimensions.length === 1) {
            setDimensions([{ name: "", width: "", height: "", unit: "mm" }]);
            return;
        }
        setDimensions(dimensions.filter((_, i) => i !== index));
    };

    const calculateModalSqft = () => {
        let total = 0;
        dimensions.forEach(dim => {
            const w = safeNum(dim.width);
            const h = safeNum(dim.height);
            if (dim.unit === 'mm') {
                total += (w / 304.8) * (h / 304.8);
            } else {
                total += (w * h);
            }
        });
        setFactory(prev => ({ ...prev, totalSqft: Number(total.toFixed(2)) }));
        setShowSqftModal(false);
    };



    const isFormDirty = 
        Number(productDim.width) > 0 || 
        Number(productDim.height) > 0 ||
        Number(plywood.rate) > 0 || plywood.brandId !== "" ||
        Number(innerLaminate.rate) > 0 || innerLaminate.brandId !== "" ||
        Number(outerLaminate.rate) > 0 || outerLaminate.brandId !== "" ||
        Number(otherFinish.rate) > 0 ||
        fittings.length > 1 || fittings[0].categoryName !== "" ||
        essentials.length > 1 || essentials[0].name !== "" ||
        Number(factory.ratePerSqft) > 0 || Number(factory.totalSqft) > 0 ||
        Number(labour.noOfDays) > 1 || Number(labour.noOfLabours) > 1 || dimensions.length > 1;

    // 2. Function to clear everything back to defaults
    const handleReset = () => {
        if (window.confirm("Are you sure you want to clear all calculator values? This cannot be undone.")) {
            setProductDim({ width: 0, height: 0 });
            setPlywood({ categoryName: "Plywood", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 32 });
            setInnerLaminate({ categoryName: "Inner Laminate", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 32 });
            setOuterLaminate({ categoryName: "Outer Laminate", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 32 });
            setOtherFinish({ rate: 0, quantity: 1, dimension: 32 });
            setFittings([{ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);
            setEssentials([{ name: "", rate: 0, quantity: 1 }]);
            setFactory({ ratePerSqft: 0, totalSqft: 0 });
            setDimensions([{ name: "Main Unit", width: "", height: "", unit: "mm" }]);
            
            // For labour, just reset the multipliers but keep the fetched category/rate
            setLabour(prev => ({ ...prev, noOfLabours: 1, noOfDays: 1 }));
            
            // Optional: reset finish type back to default
            setActiveFinish("Laminate");
        }
    };

    
    // --- CALCULATIONS ---
    const safeNum = (val: any) => Number(val) || 0;

    const productSqft = safeNum(productDim.width) * safeNum(productDim.height);
    const plywoodTotal = safeNum(plywood.rate) * safeNum(plywood.dimension) * safeNum(plywood.quantity);
    // const innerLamTotal = safeNum(innerLaminate.rate) * safeNum(innerLaminate.dimension) * safeNum(innerLaminate.quantity);
    // const outerLamTotal = safeNum(outerLaminate.rate) * safeNum(outerLaminate.dimension) * safeNum(outerLaminate.quantity);

    const innerLamTotal = activeFinish === 'Laminate' ? 
    safeNum(innerLaminate.rate) * safeNum(innerLaminate.dimension) * safeNum(innerLaminate.quantity) : 0;
    const outerLamTotal = activeFinish === 'Laminate' ? 
    safeNum(outerLaminate.rate) * safeNum(outerLaminate.dimension) * safeNum(outerLaminate.quantity) : 0;
    const otherFinishTotal = activeFinish !== 'Laminate' ? 
    safeNum(otherFinish.rate) * safeNum(otherFinish.dimension) * safeNum(otherFinish.quantity) : 0;

    const fittingsTotal = fittings.reduce((acc, curr) => acc + (safeNum(curr.rate) * safeNum(curr.quantity)), 0);
    const essentialsTotal = essentials.reduce((acc, curr) => acc + (safeNum(curr.rate) * safeNum(curr.quantity)), 0);

    const labourTotal = safeNum(labour.ratePerDay) * safeNum(labour.noOfLabours) * safeNum(labour.noOfDays);
    const factoryTotal = safeNum(factory.ratePerSqft) * safeNum(factory.totalSqft);

    // const grandTotal = plywoodTotal + innerLamTotal + outerLamTotal + fittingsTotal + essentialsTotal + labourTotal + factoryTotal;
    const grandTotal = plywoodTotal + innerLamTotal + outerLamTotal + otherFinishTotal + fittingsTotal + essentialsTotal + labourTotal + factoryTotal;
    // const finalSqftRate = factory.totalSqft > 0 ? (grandTotal / factory.totalSqft) : 0;
    const finalSqftRate = productSqft > 0 ? (grandTotal / productSqft) : 0;


    return (
        <div className="min-h-screen bg-brand-surface px-4 custom-scrollbar overflow-y-auto pb-24 w-full">

            {/* Header */}
            <header className="flex items-center justify-between mb-6 pb-4 border-b border-ash-light">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center shadow-sm">
                            <i className="fas fa-calculator text-text-muted"></i>
                        </div>
                        {/* SqFt Rate Calculator */}
                        Instant Cost Calculator
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1.5">Modular Work Cost Estimator</p>
                </div>


                {/* Right Side: Reset Button & Finish Dropdown */}
                <div className="flex items-end gap-3 w-full sm:w-auto">
                    
                    {/* Conditionally Rendered Clear Button */}
                    {isFormDirty && (
                       <Button 
                            variant="ghost" 
                            onClick={handleReset}
                            className="h-10 px-4  font-bold text-text-muted hover:text-text-main hover:bg-brand-ash hover:border-ash-medium transition-all border border-transparent shadow-sm shrink-0"
                            title="Clear all fields"
                        >
                            <i className="fas fa-rotate-right mr-1.5"></i> Clear All
                        </Button>
                    )}

                    {/* Finish Dropdown */}
                    <div className="w-full sm:w-64 shrink-0 relative z-[120]">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Finish Type</Label>
                        <SearchSelectNew
                            options={finishOptions}
                            value={activeFinish}
                            onValueChange={(val) => setActiveFinish(val || 'Laminate')}
                            className="w-full shadow-sm text-sm h-10 !overflow-visible relative"
                            placeholder="Select Finish"
                        />
                    </div>
                </div>

            </header>

            <div className="w-full space-y-4">

                <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-lg overflow-hidden">
                    <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-end gap-4 bg-brand-ash">
                        <div className="w-full md:w-64 shrink-0 mb-2 md:mb-1">
                            <h3 className="text-sm font-bold text-text-main flex items-center">
                                <i className="fas fa-cube mr-2 text-text-muted"></i> Overall Product Size
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">
                                Used for Final Rate Calculation
                            </p>
                        </div>

                        <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                            <div>
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Width (Feet)</Label>
                                <Input
                                    type="number"
                                    value={productDim.width}
                                    onChange={(e) => setProductDim({ ...productDim, width: Math.max(Number(e.target.value), 0) })}
                                    className="bg-brand-surface border-2 !border-ash-medium focus:!ring-0  h-8 text-xs text-text-main"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Height (Feet)</Label>
                                <Input
                                    type="number"
                                    value={productDim.height}
                                    onChange={(e) => setProductDim({ ...productDim, height: Math.max(Number(e.target.value), 0) })}
                                    className="bg-brand-surface border-2 !border-ash-medium focus:!ring-0  h-8 text-xs text-text-main"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Total Area (SqFt)</Label>
                                <div className="bg-brand-ash border border-ash-medium h-8 text-xs text-text-main font-bold flex items-center justify-center rounded-md shadow-sm">
                                    {productSqft} SqFt
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 1. Core Materials (Plywood, Inner Lam, Outer Lam) - ULTRA COMPACT ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">

                    {/* Plywood Card */}
                    <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-visible flex flex-col">
                        <CardHeader className="bg-brand-ash border-b border-ash-light py-2.5 px-4">
                            <CardTitle className="text-xs font-bold text-text-main flex items-center justify-between">
                                <span><i className="fas fa-layer-group mr-2 text-text-muted"></i> Plywood</span>
                                <span className="text-action-primary text-[11px] font-bold">₹ {plywoodTotal.toLocaleString('en-IN')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-3 flex-1">
                            <div className="w-full relative">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Brand Select</Label>
                                <div className="h-8">
                                    <SearchSelectNew
                                        options={plywoodBrands}
                                        value={plywood.brandId}
                                        placeholder="Search Plywood..."
                                        className="!overflow-visible relative  text-xs h-8"
                                        onValueChange={(val) => {
                                            const selected = plywoodBrands.find(opt => String(opt.value) === String(val));
                                            if (selected) setPlywood({ ...plywood, brandId: selected.value, brandName: selected.brandOnly, rate: selected.rate });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-text-muted text-[10px]">₹</span>
                                        <Input type="number" value={plywood.rate} onChange={(e) => setPlywood({ ...plywood, rate: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium pl-6 text-text-main h-8 text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                    <Input type="number" value={plywood.quantity} onChange={(e) => setPlywood({ ...plywood, quantity: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs px-2 text-center" />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block truncate" title="Dimension SqFt">Dim SqFt</Label>
                                    <Input type="number" value={plywood.dimension} onChange={(e) => setPlywood({ ...plywood, dimension: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium text-text-muted h-8 text-xs px-2 text-center" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {activeFinish === 'Laminate' ? (
                        <>
                            {/* Inner Laminate Card */}
                            <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-visible flex flex-col">
                                <CardHeader className="bg-brand-ash border-b border-ash-light py-2.5 px-4">
                                    <CardTitle className="text-xs font-bold text-text-main flex items-center justify-between">
                                        <span><i className="fas fa-scroll mr-2 text-text-muted"></i> Inner Lam.</span>
                                        <span className="text-action-primary text-[11px] font-bold">₹ {innerLamTotal.toLocaleString('en-IN')}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex flex-col gap-3 flex-1">
                                    <div className="w-full relative">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Brand Select</Label>
                                        <div className="h-8">
                                            <SearchSelectNew
                                                options={innerLaminateBrands}
                                                value={innerLaminate.brandId}
                                                placeholder="Search Inner Lam..."
                                                className="!overflow-visible relative  text-xs h-8"
                                                onValueChange={(val) => {
                                                    const selected = innerLaminateBrands.find(opt => String(opt.value) === String(val));
                                                    if (selected) setInnerLaminate({ ...innerLaminate, brandId: selected.value, brandName: selected.brandOnly, rate: selected.rate });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-text-muted text-[10px]">₹</span>
                                                <Input type="number" value={innerLaminate.rate} onChange={(e) => setInnerLaminate({ ...innerLaminate, rate: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium pl-6 text-text-main h-8 text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                            <Input type="number" value={innerLaminate.quantity} onChange={(e) => setInnerLaminate({ ...innerLaminate, quantity: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs px-2 text-center" />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block truncate" title="Dimension SqFt">Dim SqFt</Label>
                                            <Input type="number" value={innerLaminate.dimension} onChange={(e) => setInnerLaminate({ ...innerLaminate, dimension: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium text-text-muted h-8 text-xs px-2 text-center" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Outer Laminate Card */}
                            <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-visible flex flex-col">
                                <CardHeader className="bg-brand-ash border-b border-ash-light py-2.5 px-4">
                                    <CardTitle className="text-xs font-bold text-text-main flex items-center justify-between">
                                        <span><i className="fas fa-scroll mr-2 text-text-muted"></i> Outer Lam.</span>
                                        <span className="text-action-primary text-[11px] font-bold">₹ {outerLamTotal.toLocaleString('en-IN')}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex flex-col gap-3 flex-1">
                                    <div className="w-full relative">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Brand Select</Label>
                                        <div className="h-8">
                                            <SearchSelectNew
                                                options={outerLaminateBrands}
                                                value={outerLaminate.brandId}
                                                placeholder="Search Outer Lam..."
                                                className="!overflow-visible relative text-xs h-8"
                                                onValueChange={(val) => {
                                                    const selected = outerLaminateBrands.find(opt => String(opt.value) === String(val));
                                                    if (selected) setOuterLaminate({ ...outerLaminate, brandId: selected.value, brandName: selected.brandOnly, rate: selected.rate });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-text-muted text-[10px]">₹</span>
                                                <Input type="number" value={outerLaminate.rate} onChange={(e) => setOuterLaminate({ ...outerLaminate, rate: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium pl-6 text-text-main h-8 text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                            <Input type="number" value={outerLaminate.quantity} onChange={(e) => setOuterLaminate({ ...outerLaminate, quantity: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs px-2 text-center" />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block truncate" title="Dimension SqFt">Dim SqFt</Label>
                                            <Input type="number" value={outerLaminate.dimension} onChange={(e) => setOuterLaminate({ ...outerLaminate, dimension: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium text-text-muted h-8 text-xs px-2 text-center" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )
                        : (
                            /* Alternative Finish Card (PU, DUCO, Varnish, Paint) */
                            <Card className="bg-brand-surface border border-ash-medium hover:border-action-primary/40 transition-all shadow-sm hover:shadow-md rounded-xl overflow-visible flex flex-col group">
                                <CardHeader className="bg-brand-ash border-b border-ash-light py-2.5 px-4 transition-colors group-hover:bg-brand-ash/50">
                                    <CardTitle className="text-xs font-bold text-text-main flex items-center justify-between">
                                        <span className="flex items-center"><i className="fas fa-paint-roller mr-2 text-action-primary"></i> {finishOptions.find(o => o.value === activeFinish)?.label}</span>
                                        <span className="text-action-primary text-[11px] font-bold bg-action-primary/10 px-2 py-0.5 rounded-full border border-action-primary/20">₹ {otherFinishTotal.toLocaleString('en-IN')}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex flex-col gap-4 flex-1 justify-center">
                                    {/* Only Manual Inputs, NO Brand Dropdown */}
                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-text-muted text-[10px]">₹</span>
                                                <Input type="number" value={otherFinish.rate} onChange={(e) => setOtherFinish({ ...otherFinish, rate: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 pl-6 text-text-main h-8 text-xs transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                            <Input type="number" value={otherFinish.quantity} onChange={(e) => setOtherFinish({ ...otherFinish, quantity: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 text-text-main h-8 text-xs px-2 text-center transition-all" />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block truncate" title="Dimension SqFt">Dim SqFt</Label>
                                            <Input type="number" value={otherFinish.dimension} onChange={(e) => setOtherFinish({ ...otherFinish, dimension: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border-ash-medium focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 text-text-main h-8 text-xs px-2 text-center transition-all" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted text-center bg-brand-ash/50 p-2 rounded-lg border border-ash-light border-dashed">
                                        Enter manual parameters above.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                </div>

                {/* 2. Fittings & Accessories */}
                <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-visible">
                    <CardHeader className="bg-brand-ash border-b border-ash-light py-2.5 px-4">
                        <CardTitle className="text-xs font-bold text-text-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <span><i className="fas fa-toolbox mr-2 text-text-muted"></i> Fittings & Accessories</span>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <span className="text-action-primary text-[11px] font-bold">₹ {fittingsTotal.toLocaleString('en-IN')}</span>
                                <Button variant="dark" size="sm" onClick={handleAddFitting} className="shadow-sm h-7 text-xs px-3">
                                    <i className="fas fa-plus mr-1"></i> Add Fitting
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {fittings.map((fitting, i) => {
                                // FIX: Dynamic Z-Index to prevent dropdowns from clipping under rows below them.
                                // The first row will have z-[50], second z-[49], third z-[48], etc.
                                // const rowZIndex = 50 - i;

                                return (
                                    <div key={i} className="flex flex-wrap lg:flex-nowrap items-start lg:items-end gap-3 p-3 bg-brand-ash/30 border border-ash-light rounded-lg transition-all hover:border-ash-medium relative group">

                                        <div className="w-full lg:w-1/4">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Category Search</Label>
                                            <Input
                                                placeholder="e.g., Hinges, Handles..."
                                                value={fitting.categoryName}
                                                onChange={(e) => updateFittingField(i, 'categoryName', e.target.value)}
                                                className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main"
                                            />
                                        </div>

                                        <div className="w-full lg:w-1/3 relative">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Brand (Select)</Label>
                                            <div className="h-8">
                                                <SearchSelectNew
                                                    options={fittingBrandOptions[i] || []}
                                                    value={fitting.brandId}
                                                    placeholder={fitting.categoryName ? "Select Brand" : "Type category first"}
                                                    onFocus={() => {
                                                        if (!fittingBrandOptions[i] || fittingBrandOptions[i].length <= 1) {
                                                            fetchAllCategoryItems(i, fitting.categoryName || "");
                                                        }
                                                    }}
                                                    // className="!overflow-visible relative z-[90] text-xs h-8"
                                                    className="!overflow-visible relative text-xs h-8"
                                                    // style={{ zIndex: rowZIndex + 1 }}
                                                    onValueChange={(val) => {
                                                        const options = fittingBrandOptions[i] || [];
                                                        const selected = options.find((opt: any) => String(opt.value) === String(val));
                                                        if (selected) {
                                                            let newFittings = [...fittings];
                                                            newFittings[i].brandId = selected.value;
                                                            newFittings[i].brandName = selected.brandOnly || selected.label;
                                                            newFittings[i].rate = selected.rate;
                                                            setFittings(newFittings);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 lg:w-24">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                            <Input type="number" value={fitting.rate} onChange={(e) => updateFittingField(i, 'rate', Math.max(Number(e.target.value), 0))} className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main" />
                                        </div>

                                        <div className="w-20">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                            <Input type="number" value={fitting.quantity} onChange={(e) => updateFittingField(i, 'quantity', Math.max(Number(e.target.value), 0))} className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main text-center" />
                                        </div>

                                        {/* Delete Button (Hidden if it's the very last empty row) */}
                                        {!(i === fittings.length - 1 && !fitting.categoryName) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveFitting(i)}
                                                className="h-8 w-8 p-0 rounded-lg text-text-muted hover:text-text-main hover:bg-brand-surface border border-transparent hover:border-ash-medium transition-all shrink-0 self-end lg:self-auto shadow-sm bg-brand-main"
                                            >
                                                <i className="fas fa-trash-can text-xs"></i>
                                            </Button>
                                        )}
                                    </div>
                                )

                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Minor Sections (Essentials & Labour) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="h-full">
                        {/* Nails, Glues & Essentials */}
                        <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-visible flex flex-col">
                            <CardHeader className="bg-brand-ash/50 border-b border-ash-light py-2.5 px-4 shrink-0">
                                <CardTitle className="text-xs font-bold text-text-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <span><i className="fas fa-fill-drip mr-2 text-text-muted"></i> Nails & Glues</span>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className="text-action-primary text-[11px] font-bold">₹ {essentialsTotal.toLocaleString('en-IN')}</span>
                                        <Button variant="dark" size="sm" onClick={handleAddEssential} className="shadow-sm h-7 text-xs px-3">
                                            <i className="fas fa-plus mr-1"></i> Add Item
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-1">
                                <div className="space-y-3">
                                    {essentials.map((item, i) => (
                                        <div key={i} className="flex flex-wrap lg:flex-nowrap items-end gap-3 p-3 bg-brand-ash/30 border border-ash-light rounded-lg transition-all hover:border-ash-medium group">
                                            <div className="flex-1 w-full lg:w-auto">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Item Name</Label>
                                                <Input
                                                    placeholder="e.g., Fevicol, Nails..."
                                                    value={item.name}
                                                    onChange={(e) => updateEssentialField(i, 'name', e.target.value)}
                                                    className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main w-full"
                                                />
                                            </div>
                                            <div className="w-full lg:w-24 shrink-0">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => updateEssentialField(i, 'rate', Math.max(Number(e.target.value), 0))}
                                                    className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main w-full"
                                                />
                                            </div>
                                            <div className="w-full lg:w-20 shrink-0">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateEssentialField(i, 'quantity', Math.max(Number(e.target.value), 0))}
                                                    className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main text-center w-full"
                                                />
                                            </div>

                                            {/* Delete Button (Hidden if it's the very last empty row) */}
                                            {!(i === essentials.length - 1 && !item.name) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveEssential(i)}
                                                    className="h-8 w-8 p-0 rounded-lg text-text-muted hover:text-text-main hover:bg-brand-ash border border-transparent hover:border-ash-medium transition-all shrink-0 self-end shadow-sm"
                                                >
                                                    <i className="fas fa-trash-can text-xs"></i>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-4 lg:gap-6">
                        {/* Labour Cost */}
                        <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden h-fit">
                            <CardHeader className="bg-brand-ash border-b border-ash-light py-2.5 px-4">
                                <CardTitle className="text-xs font-bold text-text-main flex items-center justify-between">
                                    <span><i className="fas fa-hard-hat mr-2 text-text-muted"></i> Labour Output</span>
                                    <span className="text-action-primary text-[11px] font-bold">₹ {labourTotal.toLocaleString('en-IN')}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate / Day (₹)</Label>
                                    <Input
                                        type="number"
                                        value={labour.ratePerDay}
                                        onChange={(e) => setLabour({ ...labour, ratePerDay: safeNum(e.target.value) })}
                                        className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">No. Workers</Label>
                                    <Input
                                        type="number"
                                        value={labour.noOfLabours}
                                        onChange={(e) => setLabour({ ...labour, noOfLabours: safeNum(e.target.value) })}
                                        className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs text-center w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">No. Days</Label>
                                    <Input
                                        type="number"
                                        value={labour.noOfDays}
                                        onChange={(e) => setLabour({ ...labour, noOfDays: safeNum(e.target.value) })}
                                        className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs text-center w-full"
                                    />
                                </div>
                            </CardContent>
                        </Card>


                        {/* 4. Factory & Final Output */}
                        <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden mt-4">
                            <CardHeader className="bg-brand-ash border-b border-ash-light py-2 px-4">
                                <CardTitle className="text-xs font-bold text-text-main flex items-center justify-between">
                                    <span><i className="fas fa-industry mr-2 text-text-muted"></i> Factory/Fabrication Cost</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Cost / SqFt (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-text-muted text-[10px]">₹</span>
                                        <Input type="number" value={factory.ratePerSqft} onChange={(e) => setFactory({ ...factory, ratePerSqft: safeNum(e.target.value) })} className="bg-brand-surface border-ash-medium text-text-main pl-6 h-8 text-xs w-full" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Total Area (SqFt)</Label>
                                    <div className="flex gap-2">
                                        <Input type="number" value={factory.totalSqft} onChange={(e) => setFactory({ ...factory, totalSqft: safeNum(e.target.value) })} className="bg-brand-surface border-ash-medium text-text-main flex-1 h-8 text-xs" />
                                        <Button variant="white" size="sm" onClick={() => setShowSqftModal(true)} className="border-ash-dark text-text-main shadow-sm shrink-0 h-8 px-3 text-xs" title="Open Calculator">
                                            <i className="fas fa-calculator text-text-muted"></i>
                                        </Button>
                                    </div>
                                </div>

                               

                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. Grand Total & Final Rate Highlight */}
                <Card className="!bg-brand-main/30 border border-ash-medium shadow-sm rounded-xl overflow-hidden mt-4 lg:mt-6 relative">
                    {/* Decorative Background Accent */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-action-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                    <CardContent className="p-5 sm:p-6 flex flex-col relative z-10">

                        {/* Main Highlight Row */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Project Cost</span>
                                <span className="text-3xl font-bold text-text-main">₹ {grandTotal.toLocaleString('en-IN')}</span>
                            </div>

                            {/* Divider for Desktop */}
                            <div className="hidden sm:block h-14 w-px bg-ash-medium"></div>

                            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto border-t border-ash-light sm:border-0 pt-4 sm:pt-0">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <i className="fas fa-chart-pie text-action-primary"></i> Final Rate (Per SqFt)
                                </span>
                                <span className="text-4xl font-bold text-action-primary leading-none">
                                    ₹ {finalSqftRate.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Visual Math Breakdown - Vertical Receipt Style */}
                        <div className="w-full mt-8 pt-6 border-t border-ash-medium/50">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-calculator text-text-muted text-sm"></i>
                                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Calculation Breakdown</span>
                            </div>

                            <div className="bg-brand-surface/50 border border-ash-light p-5 sm:p-6 rounded-xl shadow-sm">

                                {/* Addition Section */}
                                <div className="space-y-3 text-sm  text-text-muted">
                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Plywood</span>
                                        <span className="text-md">₹ {plywoodTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    {/* <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Inner Laminate</span>
                                        <span className="text-md">₹ {innerLamTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Outer Laminate</span>
                                        <span className="text-md">₹ {outerLamTotal.toLocaleString('en-IN')}</span>
                                    </div> */}

                                    {activeFinish === 'Laminate' ? (
                                        <>
                                            <div className="flex justify-between items-center hover:text-text-main transition-colors">
                                                <span className="font-poppins text-md text-text-main">Inner Laminate</span>
                                                <span>₹ {innerLamTotal.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between items-center hover:text-text-main transition-colors">
                                                <span className="font-poppins text-md text-text-main">Outer Laminate</span>
                                                <span>₹ {outerLamTotal.toLocaleString('en-IN')}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center hover:text-text-main transition-colors">
                                            <span className="font-poppins text-md text-text-main">{finishOptions.find(o => o.value === activeFinish)?.label}</span>
                                            <span>₹ {otherFinishTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Fittings & Accessories</span>
                                        <span className="text-md">₹ {fittingsTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Nails & Glues</span>
                                        <span className="text-md">₹ {essentialsTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Labour</span>
                                        <span className="text-md">₹ {labourTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Factory / Fabrication</span>
                                        <span className="text-md">₹ {factoryTotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    {/* Grand Total Sub-row */}
                                    <div className="pt-3 mt-3 border-t border-ash-medium border-dashed flex justify-between items-center font-bold text-text-main text-base">
                                        <span className="font-poppins uppercase tracking-wider text-[11px] text-text-muted">Grand Total</span>
                                        <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* Division Section */}
                                <div className="mt-6 pt-5 border-t border-ash-medium">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                        <div className="flex items-center gap-3 text-sm  text-text-muted bg-brand-ash/50 px-4 py-2 rounded-lg border border-ash-light w-fit">
                                            <span title="Grand Total">₹ {grandTotal.toLocaleString('en-IN')}</span>
                                            <span className="text-ash-dark font-poppins text-lg">÷</span>
                                            <span title="Overall Product Area">{productSqft || 0} SqFt</span>
                                        </div>

                                        <div className="flex items-center gap-3 font-bold text-action-primary text-lg">
                                            <span className="font-poppins text-[10px] uppercase tracking-wider text-text-muted">Equals:</span>
                                            <span>₹ {finalSqftRate.toLocaleString('en-IN', { maximumFractionDigits: 2 })} <span className="text-xs font-sans text-text-muted">/ SqFt</span></span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </CardContent>
                </Card>

            </div>

            {/* SQFT CALCULATOR MODAL */}
            {showSqftModal && (
                <div onClick={() => setShowSqftModal(false)} className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div onClick={(e) => e.stopPropagation()} className="bg-brand-surface border border-ash-medium rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-ash-light bg-brand-ash rounded-t-xl shrink-0">
                            <h2 className="text-base font-bold text-text-main flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-brand-surface border border-ash-medium flex items-center justify-center shadow-sm">
                                    <i className="fas fa-ruler-combined text-text-muted text-sm"></i>
                                </div>
                                <span className="hidden sm:inline">Dimension SqFt Converter</span>
                                <span className="sm:hidden">SqFt Converter</span>
                            </h2>
                            <div className="flex items-center gap-3">
                                <Button variant="dark" size="sm" onClick={handleDimensionAdd} className="shadow-sm h-8 text-xs px-3">
                                    <i className="fas fa-plus mr-1"></i> Add Part
                                </Button>
                                <button onClick={() => setShowSqftModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-surface border border-ash-medium text-text-muted hover:text-text-main hover:bg-brand-ash shadow-sm transition-all">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                                <div>
                                    <p className="text-xs font-bold text-text-main">Add dimensions to calculate total area</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">(Formula: 1ft = 304.8mm)</p>
                                </div>
                            </div>

                            <div className="border border-ash-medium rounded-xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead className="bg-brand-ash border-b border-ash-medium">
                                            <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                                <th className="p-3 w-10 text-center">#</th>
                                                <th className="p-3">Part Name</th>
                                                <th className="p-3 w-28 text-center">Width</th>
                                                <th className="p-3 w-28 text-center">Height</th>
                                                <th className="p-3 w-24 text-center">Unit</th>
                                                <th className="p-3 w-16 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-brand-surface">
                                            {dimensions.map((dim, i) => (
                                                <tr key={i} className="border-b border-ash-light last:border-0 hover:bg-brand-ash transition-colors group">
                                                    <td className="p-2 border-r border-ash-light text-center">
                                                        <span className="text-[10px] font-bold text-text-muted">{i + 1}</span>
                                                    </td>
                                                    <td className="p-2 border-r border-ash-light">
                                                        <Input
                                                            value={dim.name}
                                                            onChange={(e) => handleDimensionChange(i, 'name', e.target.value)}
                                                            placeholder="e.g., Door Panel"
                                                            className="h-8 text-xs bg-transparent border-0 focus:ring-0 shadow-none px-2 text-text-main w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-ash-light">
                                                        <Input
                                                            type="number"
                                                            value={dim.width}
                                                            onChange={(e) => handleDimensionChange(i, 'width', Math.max(Number(e.target.value), 0))}
                                                            placeholder="W"
                                                            className="h-8 text-xs bg-transparent border-0 focus:ring-0 shadow-none px-2  text-center text-text-main w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-ash-light">
                                                        <Input
                                                            type="number"
                                                            value={dim.height}
                                                            onChange={(e) => handleDimensionChange(i, 'height', Math.max(Number(e.target.value), 0))}
                                                            placeholder="H"
                                                            className="h-8 text-xs bg-transparent border-0 focus:ring-0 shadow-none px-2  text-center text-text-main w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-ash-light">
                                                        <div className="relative">
                                                            <select
                                                                value={dim.unit}
                                                                onChange={(e) => handleDimensionChange(i, 'unit', e.target.value)}
                                                                className="w-full h-8 text-xs font-bold uppercase tracking-wider bg-transparent border-0 focus:ring-0 outline-none text-text-main cursor-pointer px-2 appearance-none text-center"
                                                            >
                                                                <option value="mm">MM</option>
                                                                <option value="ft">FT</option>
                                                            </select>
                                                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                                                <i className="fa-solid fa-chevron-down text-text-muted text-[9px]"></i>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-center relative">
                                                        {/* Hide delete button if it's the very last empty row */}
                                                        {!(i === dimensions.length - 1 && !dim.name && !dim.width && !dim.height) && (
                                                            <button
                                                                onClick={() => handleDimensionRemove(i)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-main hover:bg-brand-ash border border-transparent hover:border-ash-medium transition-all mx-auto shadow-sm cursor-pointer group-hover:opacity-100"
                                                                title="Remove row"
                                                            >
                                                                <i className="fas fa-trash-can text-xs"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-ash-medium bg-brand-ash/50 rounded-b-xl flex items-center justify-end gap-3 shrink-0">
                            <Button variant="white" onClick={() => setShowSqftModal(false)} className="border-ash-medium text-text-main shadow-sm px-6">
                                Cancel
                            </Button>
                            <Button variant="dark" onClick={calculateModalSqft} className="shadow-sm px-8">
                                <i className="fas fa-check mr-2 text-action-success"></i> Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InstantCostCalculation;