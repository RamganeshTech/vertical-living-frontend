


import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetRole from "../../Hooks/useGetRole";
import { getApiForRole } from "../../utils/roleCheck";

// API Hooks
import { getMaterialBrand } from "../../apiList/Quote Api/QuoteVariant Api/quoteVariantApi";
import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from "../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
// import { useGetCostCalculatorProduct, useUpsertCostCalculatorProduct } from "../../Hooks/useInstantCostHooks";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import SearchSelectNew from "../../components/ui/SearchSelectNew";
import { useGetCostCalculatorProduct, useUpsertCostCalculatorProduct } from "../../apiList/Quote Api/RateConfig Api/instantCostCalculatorApi";
import { toast } from "../../utils/toast";

interface MaterialState {
    categoryName?: string;
    brandId: string;
    brandName: string;
    rate: number | string;
    quantity: number | string;
    thickness?: string;
    dimension: number | string;
    imageUrl?: string;
}

interface PlywoodState {
    quantity: number | string;
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

export const InstantCostCalculatorDimentionSingle: React.FC = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();
    const { categoryId, dimensionKey } = useParams<{ categoryId: string, dimensionKey: string }>();
    const decodedDimensionKey = dimensionKey ? decodeURIComponent(dimensionKey) : "";

    const { role } = useGetRole();
    const api = getApiForRole(role!);
    // const allowedRoles = ["owner", "staff", "CTO"];

    // --- API Hooks ---
    const { data: configData, isLoading: isFetching } = useGetCostCalculatorProduct(organizationId!, categoryId!, decodedDimensionKey);
    const { mutateAsync: upsertConfig, isPending: isSaving } = useUpsertCostCalculatorProduct();

    // --- Dropdown Options ---
    const finishOptions = [
        { value: 'Laminate', label: 'Laminate Finish' },
        { value: 'PU', label: 'PU Finish' },
        { value: 'DUCO', label: 'DUCO Finish' },
        { value: 'Varnish', label: 'Varnish Finish' },
        { value: 'Paint', label: 'Paint Finish' },
    ];

    // --- State Management ---
    const [activeFinish, setActiveFinish] = useState<string>("Laminate");
    const [isFormDirty, setIsFormDirty] = useState(true);

    const [productDim, setProductDim] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    const defaultMaterial: MaterialState = { brandId: "", brandName: "", thickness: "", rate: 0, quantity: 1, dimension: 32 };

    // Core Materials
    const [plywoods, setPlywoods] = useState<PlywoodState[]>([{ quantity: 1 }]);
    const [innerLaminates, setInnerLaminates] = useState<MaterialState[]>([{ ...defaultMaterial, categoryName: "Inner Laminate" }]);
    const [outerLaminates, setOuterLaminates] = useState<MaterialState[]>([{ ...defaultMaterial, categoryName: "Outer Laminate" }]);
    const [otherFinishes, setOtherFinishes] = useState<MaterialState[]>([{ ...defaultMaterial, categoryName: "Finish" }]);

    // Static Brands Data
    const [innerLaminateBrands, setInnerLaminateBrands] = useState<any[]>([]);
    const [outerLaminateBrands, setOuterLaminateBrands] = useState<any[]>([]);
    const [innerLamRatesMap, setInnerLamRatesMap] = useState<Record<string, any[]>>({});
    const [outerLamRatesMap, setOuterLamRatesMap] = useState<Record<string, any[]>>({});

    // Fittings
    const [fittings, setFittings] = useState<MaterialState[]>([{ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);
    const [fittingBrandOptions, setFittingBrandOptions] = useState<Record<number, any[]>>({});
    const debounceTimers = useRef<Record<number, any>>({});

    // Essentials (Nails/Glues)
    const [essentials, setEssentials] = useState<EssentialState[]>([{ name: "", rate: 0, quantity: 1 }]);

    // Labour
    const [labour, setLabour] = useState({ categoryId: "", categoryName: "", ratePerDay: 0, noOfLabours: 0, noOfDays: 0 });
    const { data: allLabourCategory = [] } = useGetLabourRateConfigCategories(organizationId!);
    const { data: labourCost = 0 } = useGetSingleLabourCost({ organizationId: organizationId!, categoryId: labour.categoryId });

    // Factory & Sqft Modal
    const [factory, setFactory] = useState({ ratePerSqft: 0, totalSqft: 0 });
    const [showSqftModal, setShowSqftModal] = useState(false);
    const [dimensions, setDimensions] = useState<DimensionRow[]>([{ name: "Main Unit", width: "", height: "", unit: "mm" }]);

    // --- Auto-Extract Dimensions from Key ---
    useEffect(() => {
        if (decodedDimensionKey) {
            const nums = decodedDimensionKey.match(/(\d+(\.\d+)?)/g);
            if (nums && nums.length >= 2) {
                const h = Number(nums[0]);
                const w = Number(nums[1]);
                setProductDim({ height: h, width: w });
                setFactory(prev => ({ ...prev, totalSqft: h * w })); // Default Factory Sqft to total area
            }
        }
    }, [decodedDimensionKey]);

    // --- Fetch Static Brands ---
    const fetchStaticBrands = async (categoryName: string, setBrands: React.Dispatch<React.SetStateAction<any[]>>, setRatesMap: React.Dispatch<React.SetStateAction<any>>) => {
        if (!api || !organizationId || !categoryName) return;
        try {
            const results = await getMaterialBrand({ api, organizationId, categoryName });
            const brandMap: Record<string, { thickness: string; rs: number, id: string }[]> = {};

            results.forEach((item: any) => {
                const d = item?.data || {};
                const name = (d.Brand ?? d.BrandName ?? d.brand ?? d.brandName ?? d["Brand "] ?? d["Brands "] ?? d["BRAND NAME "] ?? d["Brand Name"] ?? d["Brands name"])?.trim();

                // const thickness = String(d["thickness (mm)"] || d.thickness || d.Thickness)?.trim();
                const thickness = String(d["thickness (mm)"] || d.thickness || d.Thickness || d["Thickness (mm)"])?.trim();

                const rs = parseFloat(d.Rs || d.rs || d.rS || d.RS || 0);

                if (name) {
                    if (!brandMap[name]) brandMap[name] = [];
                    brandMap[name].push({ thickness, rs, id: item._id ? String(item._id) : "" });
                }
            });

            setRatesMap(brandMap);
            setBrands(Object.keys(brandMap).map(name => ({ label: name, value: name })));
        } catch (error) {
            console.error(`Error fetching ${categoryName}:`, error);
        }
    };

    useEffect(() => {
        fetchStaticBrands("Inner Laminate", setInnerLaminateBrands, setInnerLamRatesMap);
        fetchStaticBrands("Outer Laminate", setOuterLaminateBrands, setOuterLamRatesMap);
    }, [api, organizationId]);

    // --- Sync Labour Cost ---
    useEffect(() => {
        if (allLabourCategory.length > 0 && !labour.categoryId) {
            setLabour(prev => ({
                ...prev,
                categoryId: allLabourCategory[0]?._id,
                categoryName: allLabourCategory[0].name
            }));
        }
    }, [allLabourCategory]);

    useEffect(() => {
        if (labourCost) {
            setLabour(prev => ({
                ...prev,
                ratePerDay: labourCost
            }));
        }
    }, [labourCost]);

    // --- Load Database Config ---
    useEffect(() => {
        if (configData) {

            // Helper to safely extract populated Object IDs AND Brand Names
            const formatMaterialArr = (arr: any[], defaultCatName: string, isFittings = false) => {
                if (!arr || arr.length === 0) return [{ ...defaultMaterial, categoryName: defaultCatName }];

                return arr.map(item => {
                    const bId = item.brandId;
                    let safeBrandId = "";
                    let extractedBrandName = item.brandName || "";
                    let extractedCatName = item.categoryName || defaultCatName;

                    // If brandId is populated (it's an object)
                    if (typeof bId === 'object' && bId !== null) {
                        safeBrandId = bId._id;

                        // Extract the Brand string from the nested data object
                        const d = bId.data || {};
                        extractedBrandName = (d.Brand ?? d.BrandName ?? d.brand ?? d.brandName ?? d["Brand "] ?? d["Brands "])?.trim() || extractedBrandName;

                        // For fittings, extract the categoryName (e.g., "Lights") so the search box populates
                        if (isFittings && bId.categoryName) {
                            extractedCatName = bId.categoryName;
                        }
                    } else {
                        // Fallback if it's just a string ID
                        safeBrandId = bId;
                    }

                    return {
                        ...defaultMaterial,
                        ...item,
                        brandId: safeBrandId || "",
                        brandName: extractedBrandName,
                        categoryName: extractedCatName
                    };
                });
            };

            // 1. Plywood
            if (configData.plywood?.length > 0) {
                setPlywoods(configData.plywood.map((p: any) => ({ quantity: p.quantity })));
            }

            // 2. Laminates
            if (configData.finishes?.laminate?.inner?.length > 0) {
                setInnerLaminates(formatMaterialArr(configData.finishes.laminate.inner, "Inner Laminate"));
            }
            if (configData.finishes?.laminate?.outer?.length > 0) {
                setOuterLaminates(formatMaterialArr(configData.finishes.laminate.outer, "Outer Laminate"));
            }

            // 3. Other Finishes
            if (configData.finishes?.pu?.length > 0) {
                setOtherFinishes(formatMaterialArr(configData.finishes.pu, "PU Finish"));
                setActiveFinish('PU');
            }
            else if (configData.finishes?.du?.length > 0) {
                setOtherFinishes(formatMaterialArr(configData.finishes.du, "DUCO Finish"));
                setActiveFinish('DUCO');
            }
            else if (configData.finishes?.paint?.length > 0) {
                setOtherFinishes(formatMaterialArr(configData.finishes.paint, "Paint Finish"));
                setActiveFinish('Paint');
            }
            else if (configData.finishes?.varnish?.length > 0) {
                setOtherFinishes(formatMaterialArr(configData.finishes.varnish, "Varnish Finish"));
                setActiveFinish('Varnish');
            }
            else {
                setActiveFinish('Laminate');
            }

            // 4. Fittings
            if (configData.fittings?.length > 0) {
                const formattedFittings = formatMaterialArr(configData.fittings, "Fittings", true);
                setFittings(formattedFittings);

                // Pre-fetch brands for existing fittings so the dropdown populates correctly
                formattedFittings.forEach((fit: any, i: number) => {
                    if (fit.categoryName) {
                        fetchAllCategoryItems(i, fit.categoryName);
                    }
                });
            }

            // 5. Essentials
            // if (configData.nailsAndGlues?.length > 0) setEssentials(configData.nailsAndGlues);

            // 5. Essentials
            if (configData.nailsAndGlues?.length > 0) {
                setEssentials(configData.nailsAndGlues.map((item: any) => ({
                    name: item.itemName || "", // Map backend 'itemName' back to frontend 'name'
                    rate: item.rate || 0,
                    quantity: item.quantity || 1
                })));
            }

            // 6. Labour
            if (configData.labour) {
                const labCat = configData.labour.categoryId;
                const safeCategoryId = (typeof labCat === 'object' && labCat !== null) ? labCat._id : labCat;

                setLabour(prev => ({
                    ...prev,
                    categoryId: safeCategoryId || "",
                    ratePerDay: configData.labour.rate || 0,
                    noOfDays: configData.labour.noOfDays || 1,
                    noOfPersons: configData.labour.noOfPersons || 1
                }));
            }

            // 7. Factory
            if (configData.fabrication) {
                setFactory({
                    ratePerSqft: configData.fabrication.sqftRate || 0,
                    totalSqft: configData.fabrication.areaSqft || 0
                });
            }
        }
    }, [configData]);

    // --- Handlers ---
    const handleAddCoreMaterialRow = () => {
        setPlywoods(prev => [...prev, { quantity: 1 }]);
        setInnerLaminates(prev => [...prev, { ...defaultMaterial, categoryName: "Inner Laminate" }]);
        setOuterLaminates(prev => [...prev, { ...defaultMaterial, categoryName: "Outer Laminate" }]);
        setOtherFinishes(prev => [...prev, { ...defaultMaterial, categoryName: "Finish" }]);
    };

    const handleRemoveCoreMaterialRow = (index: number) => {
        if (plywoods.length === 1) return;
        setPlywoods(prev => prev.filter((_, i) => i !== index));
        setInnerLaminates(prev => prev.filter((_, i) => i !== index));
        setOuterLaminates(prev => prev.filter((_, i) => i !== index));
        setOtherFinishes(prev => prev.filter((_, i) => i !== index));
    };

    const updateMaterial = (index: number, field: string, value: any, getter: any[], setter: any, ratesMap?: any) => {
        const newArr = [...getter];
        newArr[index] = { ...newArr[index], [field]: value };

        if (field === 'brandName') {
            newArr[index].brandId = "";
            newArr[index].thickness = "";
            newArr[index].rate = 0;
        }

        if (field === 'thickness' && ratesMap) {
            const brandName = newArr[index].brandName;
            const item = ratesMap[brandName]?.find((t: any) => t.thickness === value);
            newArr[index].rate = item?.rs || 0;
            newArr[index].brandId = item?.id || "";
        }
        setter(newArr);
    };

    // Fittings Logic
    const fetchAllCategoryItems = async (index: number, itemName: string) => {
        if (!itemName || !api) return;
        try {
            const results = await getMaterialBrand({ api, organizationId: organizationId!, categoryName: itemName });
            const formatted = results.map((item: any) => {
                // const brandOnly = item.data?.Brand || item.data?.BrandName || item.data?.brand || 'Unknown';
                const brandOnly =
                 item.data?.Brand || item.data?.BrandName || item.data?.brand || item.data?.brandName ||
                    item.data?.["Brands light name"] || item.data?.["Brand "] || item.data?.["Brands "] ||
                    item.data?.["BRAND NAME "] || item.data?.["Brand Name"] || 'Unknown';

                return {
                    label: `${brandOnly} (${item.categoryName?.trim() || 'No Cat'})`,
                    value: item?._id ? String(item._id) : "",
                    // rate: item.data?.Rs || item.data?.rs || 0,
                    rate: item.data?.Rs || item.data?.rs || item?.data?.RS || 0,
                    brandOnly: brandOnly,
                };
            });
            setFittingBrandOptions(prev => ({ ...prev, [index]: formatted }));
        } catch (error) {
            console.error("Error fetching category items:", error);
        }
    };

    const handleAddFitting = () => setFittings([...fittings, { categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);

    const updateFittingField = (index: number, field: keyof MaterialState, value: any) => {
        let newFittings = [...fittings];
        newFittings[index] = { ...newFittings[index], [field]: value };

        if (field === 'categoryName') {
            newFittings[index].brandId = "";
            newFittings[index].brandName = "";
            newFittings[index].rate = 0;
            if (debounceTimers.current[index]) clearTimeout(debounceTimers.current[index]);
            debounceTimers.current[index] = setTimeout(() => fetchAllCategoryItems(index, value), 600);
        }

        const isLastRow = index === newFittings.length - 1;
        if (isLastRow && newFittings[index].categoryName?.trim() !== "") {
            newFittings.push({ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 });
        }
        setFittings(newFittings);
    };

    const handleRemoveFitting = (index: number) => {
        if (fittings.length === 1) {
            setFittings([{ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);
            return;
        }
        setFittings(fittings.filter((_, i) => i !== index));
    };

    // Essentials Logic
    const handleAddEssential = () => setEssentials([...essentials, { name: "", rate: 0, quantity: 1 }]);

    const updateEssentialField = (index: number, field: keyof EssentialState, value: any) => {
        let newEssentials = [...essentials];
        newEssentials[index] = { ...newEssentials[index], [field]: value };

        const isLastRow = index === newEssentials.length - 1;
        if (isLastRow && newEssentials[index].name?.trim() !== "") {
            newEssentials.push({ name: "", rate: 0, quantity: 1 });
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

    // SqFt Modal Logic
    const handleDimensionAdd = () => setDimensions([...dimensions, { name: "", width: "", height: "", unit: "mm" }]);
    const handleDimensionChange = (index: number, field: keyof DimensionRow, value: any) => {
        const newDims = [...dimensions];
        newDims[index][field] = value as never;
        const isLastRow = index === newDims.length - 1;
        if (isLastRow && (newDims[index].name?.trim() !== "" || newDims[index].width !== "" || newDims[index].height !== "")) {
            newDims.push({ name: "", width: "", height: "", unit: "mm" });
        }
        setDimensions(newDims);
    };
    const handleDimensionRemove = (index: number) => {
        if (dimensions.length === 1) return setDimensions([{ name: "", width: "", height: "", unit: "mm" }]);
        setDimensions(dimensions.filter((_, i) => i !== index));
    };
    const calculateModalSqft = () => {
        let total = 0;
        dimensions.forEach(dim => {
            const w = safeNum(dim.width);
            const h = safeNum(dim.height);
            if (dim.unit === 'mm') total += (w / 304.8) * (h / 304.8);
            else total += (w * h);
        });
        setFactory(prev => ({ ...prev, totalSqft: Number(total.toFixed(2)) }));
        setShowSqftModal(false);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to clear all calculator values?")) {
            setProductDim({ width: 0, height: 0 });
            setPlywoods([{ quantity: 1 }]);
            setInnerLaminates([{ ...defaultMaterial, categoryName: "Inner Laminate" }]);
            setOuterLaminates([{ ...defaultMaterial, categoryName: "Outer Laminate" }]);
            setOtherFinishes([{ ...defaultMaterial, categoryName: "Finish" }]);
            setFittings([{ categoryName: "", brandId: "", brandName: "", rate: 0, quantity: 1, dimension: 1 }]);
            setEssentials([{ name: "", rate: 0, quantity: 1 }]);
            setFactory({ ratePerSqft: 0, totalSqft: 0 });
            setLabour(prev => ({ ...prev, noOfLabours: 1, noOfDays: 1 }));
            setActiveFinish("Laminate");
        }
    };

    // --- CALCULATIONS ---
    const safeNum = (val: any) => Number(val) || 0;
    const calcTotal = (arr: MaterialState[]) => arr.reduce((acc, curr) => acc + (safeNum(curr.rate) * safeNum(curr.dimension) * safeNum(curr.quantity)), 0);

    const productSqft = safeNum(productDim.width) * safeNum(productDim.height);

    const plywoodTotal = 0; // Plywood has no rate field in this specific UI
    const innerLamTotal = activeFinish === 'Laminate' ? calcTotal(innerLaminates) : 0;
    const outerLamTotal = activeFinish === 'Laminate' ? calcTotal(outerLaminates) : 0;
    const otherFinishTotal = activeFinish !== 'Laminate' ? calcTotal(otherFinishes) : 0;

    const fittingsTotal = fittings.reduce((acc, curr) => acc + (safeNum(curr.rate) * safeNum(curr.quantity)), 0);
    const essentialsTotal = essentials.reduce((acc, curr) => acc + (safeNum(curr.rate) * safeNum(curr.quantity)), 0);

    const labourTotal = safeNum(labour.ratePerDay) * safeNum(labour.noOfLabours) * safeNum(labour.noOfDays);
    const factoryTotal = safeNum(factory.ratePerSqft) * safeNum(factory.totalSqft);

    const grandTotal = plywoodTotal + innerLamTotal + outerLamTotal + otherFinishTotal + fittingsTotal + essentialsTotal + labourTotal + factoryTotal;
    const finalSqftRate = productSqft > 0 ? (grandTotal / productSqft) : 0;

    const activeFinishLabel = finishOptions.find(o => o.value === activeFinish)?.label || "Finish";

    // --- SAVE LOGIC ---
    const handleSave = async () => {
        const cleanArr = (arr: any[]) => arr.filter((item, i) => i !== arr.length - 1 || safeNum(item.rate) > 0 || safeNum(item.quantity) > 1 || item.brandName || item.name || item.itemName);

        const payload = {
            organizationId,
            categoryId,
            dimensionKey: decodedDimensionKey,
            plywood: plywoods.map(p => ({ quantity: safeNum(p.quantity) })),
            finishes: {
                laminate: {
                    inner: activeFinish === 'Laminate' ? cleanArr(innerLaminates) : [],
                    outer: activeFinish === 'Laminate' ? cleanArr(outerLaminates) : []
                },
                pu: activeFinish === 'PU' ? cleanArr(otherFinishes) : [],
                du: activeFinish === 'DUCO' ? cleanArr(otherFinishes) : [],
                paint: activeFinish === 'Paint' ? cleanArr(otherFinishes) : [],
                varnish: activeFinish === 'Varnish' ? cleanArr(otherFinishes) : []
            },
            fittings: cleanArr(fittings),
            nailsAndGlues: cleanArr(essentials).map(e => ({ itemName: e.name, rate: e.rate, quantity: e.quantity })),
            labour: { categoryId: labour.categoryId, rate: labour.ratePerDay, noOfDays: labour.noOfDays, noOfPersons: labour.noOfLabours, totalCost: labourTotal },
            fabrication: { sqftRate: factory.ratePerSqft, areaSqft: factory.totalSqft, totalCost: factoryTotal },
            totalProductAmount: grandTotal
        };

        try {
            await upsertConfig(payload);
            setIsFormDirty(false); // Optional UX reset

            toast({ title: "Success", description: "Saved Successfully" })
        } catch (error:any) {
            console.error("Save failed", error);
            toast({ title: "Error", description: error?.response?.data?.message || "something went wrong", variant:"destructive" })

        }
    };

    if (isFetching) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-brand-surface">
                <i className="fas fa-circle-notch fa-spin text-4xl text-action-primary"></i>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-surface px-4 custom-scrollbar overflow-y-auto pb-24 w-full">

            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 pt-4 border-b border-ash-light gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-3">
                        <button type="button" onClick={() => navigate(-1)} className='bg-brand-ash hover:bg-ash-medium flex items-center justify-center w-10 h-10 border border-ash-medium text-sm cursor-pointer rounded-lg text-text-muted transition-all shadow-sm shrink-0'>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div className="w-10 h-10 bg-brand-ash border border-ash-medium rounded-lg flex items-center justify-center shadow-sm">
                            <i className="fas fa-calculator text-text-muted"></i>
                        </div>
                        Instant Cost Calculator
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1.5 ml-[104px]">
                        Modular Work Cost Estimator — <span className="text-action-primary">{decodedDimensionKey}</span>
                    </p>
                </div>

                {/* Right Side: Navigation & Actions */}
                <div className="flex items-end gap-3 w-full sm:w-auto">
                    {/* <Button variant="white" size="lg" onClick={() => navigate('../../../../products')} className="py-3 px-4 font-bold text-text-muted hover:text-text-main hover:bg-brand-ash border border-ash-medium shadow-sm shrink-0" title="Products">
                        <i className="fas fa-box mr-1.5"></i> Products
                    </Button>
                     */}
                    {isFormDirty && (
                        <Button variant="ghost" onClick={handleReset} className="h-10 px-4 font-bold text-text-muted hover:text-action-danger hover:bg-action-danger/10 transition-all border border-transparent shadow-sm shrink-0" title="Clear all fields">
                            <i className="fas fa-rotate-right mr-1.5"></i> Clear All
                        </Button>
                    )}

                    {/* Finish Dropdown */}
                    <div className="w-full sm:w-56 shrink-0 relative">
                        <Label className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Finish Type</Label>
                        <SearchSelectNew options={finishOptions} value={activeFinish} onValueChange={(val) => setActiveFinish(val || 'Laminate')} className="w-full shadow-sm text-sm h-10 !overflow-visible relative" placeholder="Select Finish" />
                    </div>

                    <Button onClick={handleSave} isLoading={isSaving} variant="dark" className="h-10 px-8 shadow-sm font-black text-xs uppercase tracking-widest">
                        <i className="fas fa-save mr-2"></i> Save Matrix
                    </Button>
                </div>
            </header>

            <div className="w-full space-y-4">

                {/* Overall Product Size Card */}
                <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-end gap-4 bg-brand-ash/30">
                        <div className="w-full md:w-64 shrink-0 mb-2 md:mb-1">
                            <h3 className="text-sm font-bold text-text-main flex items-center">
                                <i className="fas fa-cube mr-2 text-text-muted"></i> Overall Product Size
                            </h3>
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1">
                                Used for Final Rate Calculation
                            </p>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                            <div>
                                <Label className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Width (Feet)</Label>
                                <Input type="number" value={productDim.width} onChange={(e) => setProductDim({ ...productDim, width: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border border-ash-medium h-9 text-xs font-bold text-text-main shadow-sm focus:border-action-primary" />
                            </div>
                            <div>
                                <Label className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Height (Feet)</Label>
                                <Input type="number" value={productDim.height} onChange={(e) => setProductDim({ ...productDim, height: Math.max(Number(e.target.value), 0) })} className="bg-brand-surface border border-ash-medium h-9 text-xs font-bold text-text-main shadow-sm focus:border-action-primary" />
                            </div>
                            <div>
                                <Label className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Total Area (SqFt)</Label>
                                <div className="bg-brand-surface border border-ash-medium h-9 text-xs text-text-main font-black flex items-center justify-center rounded-md shadow-sm">
                                    {productSqft} SqFt
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 1. Core Materials (Unified Horizontal Rows) */}
                <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl  flex flex-col group">
                    <CardHeader className="bg-brand-ash/30 border-b border-ash-light py-3 px-4 transition-colors group-hover:bg-brand-ash/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <CardTitle className="text-sm font-bold text-text-main flex items-center">
                                <i className="fas fa-layer-group mr-2 text-action-primary"></i> Core Materials
                            </CardTitle>

                            {/* Top Totals Summary Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2 bg-brand-surface border border-ash-medium/60 px-3 py-1.5 rounded-md shadow-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Plywood Total</span>
                                    <span className="text-[11px] font-black text-text-main">₹ {plywoodTotal.toLocaleString('en-IN')}</span>
                                </div>

                                {activeFinish === 'Laminate' ? (
                                    <>
                                        <div className="flex items-center gap-2 bg-brand-surface border border-ash-medium/60 px-3 py-1.5 rounded-md shadow-sm">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Inner Lam Total</span>
                                            <span className="text-[11px] font-black text-text-main">₹ {innerLamTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-brand-surface border border-ash-medium/60 px-3 py-1.5 rounded-md shadow-sm">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Outer Lam Total</span>
                                            <span className="text-[11px] font-black text-text-main">₹ {outerLamTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 bg-brand-surface border border-ash-medium/60 px-3 py-1.5 rounded-md shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Finish Total</span>
                                        <span className="text-[11px] font-black text-text-main">₹ {otherFinishTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <Button variant="dark" size="sm" onClick={handleAddCoreMaterialRow} className="h-8 text-xs px-4 shadow-sm font-black uppercase tracking-widest ml-2">
                                    <i className="fas fa-plus mr-1.5"></i> Add Row
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 flex flex-col gap-6">
                        {plywoods.map((ply, i) => {
                            const innerLam = innerLaminates[i] || defaultMaterial;
                            const outerLam = outerLaminates[i] || defaultMaterial;
                            const otherFin = otherFinishes[i] || defaultMaterial;

                            return (
                                <div key={i} className="relative border border-ash-medium/40 bg-brand-ash/20 p-4 rounded-xl shadow-sm group/row hover:border-ash-medium transition-colors">

                                    {/* Delete Row Button */}
                                    {!(plywoods.length === 1) && (
                                        <button onClick={() => handleRemoveCoreMaterialRow(i)}
                                            className="absolute -top-3 -right-3 bg-brand-surface text-text-muted hover:text-action-danger hover:bg-action-danger/10 border border-ash-medium rounded-full h-7 w-7 flex items-center justify-center transition-colors cursor-pointer shadow-md z-10">
                                            <i className="fas fa-times text-[10px]"></i>
                                        </button>
                                    )}

                                    <div className={`grid grid-cols-1 md:grid-cols-${activeFinish === 'Laminate' ? '3' : '2'} gap-4 md:gap-5`}>

                                        {/* ================= COL 1: PLYWOOD ================= */}
                                        <div className="flex flex-col bg-brand-surface border border-ash-light rounded-lg shadow-sm overflow-hidden">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main bg-brand-ash/80 px-3 py-2.5 border-b border-ash-light">
                                                <i className="fas fa-layer-group mr-1.5 text-action-primary"></i> Plywood {i + 1}
                                            </h4>
                                            <div className="p-4 flex flex-col justify-center items-center flex-1">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1.5 block">Qty (Sheets)</Label>
                                                <Input
                                                    type="number"
                                                    value={ply.quantity}
                                                    onChange={(e) => updateMaterial(i, 'quantity', Math.max(Number(e.target.value), 0), plywoods, setPlywoods)}
                                                    className="bg-brand-surface border-ash-medium focus:border-action-primary text-text-main h-10 text-sm font-black text-center transition-all w-24 shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        {/* ================= COL 2: INNER LAMINATE ================= */}
                                        {activeFinish === 'Laminate' && (
                                            <div className="flex flex-col bg-brand-surface border border-ash-light rounded-lg shadow-sm  focus-within:z-[60]">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main bg-brand-ash/80 px-3 py-2.5 border-b border-ash-light">
                                                    <i className="fas fa-scroll mr-1.5 text-action-primary"></i> Inner Lam {i + 1}
                                                </h4>
                                                <div className="p-3 flex flex-col gap-3">
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 focus-within:z-[70]">
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Brand</Label>
                                                            <SearchSelectNew
                                                                options={innerLaminateBrands}
                                                                value={innerLam.brandName}
                                                                placeholder="Search..."
                                                                className="!overflow-visible relative text-xs h-9 w-full font-bold"
                                                                onValueChange={(val) => updateMaterial(i, 'brandName', val, innerLaminates, setInnerLaminates)}
                                                            />
                                                        </div>
                                                        <div className="w-[75px] shrink-0">
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Thick.</Label>
                                                            <div className="relative">
                                                                <select
                                                                    value={innerLam.thickness}
                                                                    onChange={(e) => updateMaterial(i, 'thickness', e.target.value, innerLaminates, setInnerLaminates, innerLamRatesMap)}
                                                                    disabled={!innerLam.brandName}
                                                                    className="w-full h-9 text-[11px] font-black bg-brand-surface border border-ash-medium rounded-md px-1 outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 appearance-none disabled:opacity-50 text-text-main cursor-pointer"
                                                                >
                                                                    <option value="">Select</option>
                                                                    {innerLamRatesMap[innerLam.brandName]?.map((t, idx) => (<option key={idx} value={t.thickness}>{t.thickness} mm</option>))}
                                                                </select>
                                                                <div className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none"><i className="fa-solid fa-chevron-down text-text-muted text-[8px]"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Rate (₹)</Label>
                                                            <Input type="number" value={innerLam.rate} onChange={(e) => updateMaterial(i, 'rate', Math.max(Number(e.target.value), 0), innerLaminates, setInnerLaminates)} className="h-9 text-xs font-bold w-full focus:border-action-primary" />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block text-center">Qty</Label>
                                                            <Input type="number" value={innerLam.quantity} onChange={(e) => updateMaterial(i, 'quantity', Math.max(Number(e.target.value), 0), innerLaminates, setInnerLaminates)} className="h-9 text-xs font-bold text-center w-full focus:border-action-primary" />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block text-center truncate">Dim SqFt</Label>
                                                            <Input type="number" value={innerLam.dimension} onChange={(e) => updateMaterial(i, 'dimension', Math.max(Number(e.target.value), 0), innerLaminates, setInnerLaminates)} className="h-9 text-xs font-bold text-center w-full focus:border-action-primary" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ================= COL 3: OUTER LAM OR OTHER FINISH ================= */}
                                        {activeFinish === 'Laminate' ? (
                                            <div className="flex flex-col bg-brand-surface border border-ash-light rounded-lg shadow-sm focus-within:z-[60]">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main bg-brand-ash/80 px-3 py-2.5 border-b border-ash-light">
                                                    <i className="fas fa-scroll mr-1.5 text-action-primary"></i> Outer Lam {i + 1}
                                                </h4>
                                                <div className="p-3 flex flex-col gap-3">
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 focus-within:z-[70]">
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Brand</Label>
                                                            <SearchSelectNew
                                                                options={outerLaminateBrands}
                                                                value={outerLam.brandName}
                                                                placeholder="Search..."
                                                                className="!overflow-visible relative text-xs h-9 w-full font-bold"
                                                                onValueChange={(val) => updateMaterial(i, 'brandName', val, outerLaminates, setOuterLaminates)}
                                                            />
                                                        </div>
                                                        <div className="w-[75px] shrink-0">
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Thick.</Label>
                                                            <div className="relative">
                                                                <select
                                                                    value={outerLam.thickness}
                                                                    onChange={(e) => updateMaterial(i, 'thickness', e.target.value, outerLaminates, setOuterLaminates, outerLamRatesMap)}
                                                                    disabled={!outerLam.brandName}
                                                                    className="w-full h-9 text-[11px] font-black bg-brand-surface border border-ash-medium rounded-md px-1 outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary/20 appearance-none disabled:opacity-50 text-text-main cursor-pointer"
                                                                >
                                                                    <option value="">Select</option>
                                                                    {outerLamRatesMap[outerLam.brandName]?.map((t, idx) => (<option key={idx} value={t.thickness}>{t.thickness} mm</option>))}
                                                                </select>
                                                                <div className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none"><i className="fa-solid fa-chevron-down text-text-muted text-[8px]"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Rate (₹)</Label>
                                                            <Input type="number" value={outerLam.rate} onChange={(e) => updateMaterial(i, 'rate', Math.max(Number(e.target.value), 0), outerLaminates, setOuterLaminates)} className="h-9 text-xs font-bold w-full focus:border-action-primary" />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block text-center">Qty</Label>
                                                            <Input type="number" value={outerLam.quantity} onChange={(e) => updateMaterial(i, 'quantity', Math.max(Number(e.target.value), 0), outerLaminates, setOuterLaminates)} className="h-9 text-xs font-bold text-center w-full focus:border-action-primary" />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block text-center truncate">Dim SqFt</Label>
                                                            <Input type="number" value={outerLam.dimension} onChange={(e) => updateMaterial(i, 'dimension', Math.max(Number(e.target.value), 0), outerLaminates, setOuterLaminates)} className="h-9 text-xs font-bold text-center w-full focus:border-action-primary" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col bg-brand-surface border border-ash-light rounded-lg shadow-sm overflow-hidden">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main bg-brand-ash/80 px-3 py-2.5 border-b border-ash-light">
                                                    <i className="fas fa-paint-roller mr-1.5 text-action-primary"></i> {activeFinishLabel} {i + 1}
                                                </h4>
                                                <div className="p-4 grid grid-cols-3 gap-3 flex-1 items-center">
                                                    <div>
                                                        <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1.5 block">Rate (₹)</Label>
                                                        <Input type="number" value={otherFin.rate} onChange={(e) => updateMaterial(i, 'rate', Math.max(Number(e.target.value), 0), otherFinishes, setOtherFinishes)} className="h-10 text-xs font-bold w-full focus:border-action-primary" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1.5 block text-center">Qty</Label>
                                                        <Input type="number" value={otherFin.quantity} onChange={(e) => updateMaterial(i, 'quantity', Math.max(Number(e.target.value), 0), otherFinishes, setOtherFinishes)} className="h-10 text-xs font-bold text-center w-full focus:border-action-primary" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1.5 block text-center">Dim SqFt</Label>
                                                        <Input type="number" value={otherFin.dimension} onChange={(e) => updateMaterial(i, 'dimension', Math.max(Number(e.target.value), 0), otherFinishes, setOtherFinishes)} className="h-10 text-xs font-bold text-center w-full focus:border-action-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

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
                            {fittings.map((fitting, i) => (
                                <div key={i} className="flex flex-wrap lg:flex-nowrap items-start lg:items-end gap-3 p-3 bg-brand-ash/30 border border-ash-light rounded-lg transition-all hover:border-ash-medium relative group">

                                    <div className="w-full lg:w-1/4">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Category Search</Label>
                                        <Input
                                            placeholder="e.g., Hinges, Handles..."
                                            value={fitting.categoryName}
                                            onChange={(e) => updateFittingField(i, 'categoryName', e.target.value)}
                                            className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main focus:border-action-primary"
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
                                                className="!overflow-visible relative text-xs h-8"
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
                                        <Input type="number" value={fitting.rate} onChange={(e) => updateFittingField(i, 'rate', Math.max(Number(e.target.value), 0))} className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main focus:border-action-primary" />
                                    </div>

                                    <div className="w-20">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                        <Input type="number" value={fitting.quantity} onChange={(e) => updateFittingField(i, 'quantity', Math.max(Number(e.target.value), 0))} className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main text-center focus:border-action-primary" />
                                    </div>

                                    {/* Delete Button */}
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
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Minor Sections (Essentials & Labour) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="h-full">
                        {/* Nails, Glues & Essentials */}
                        <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-visible flex flex-col h-full">
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
                                                    className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main w-full focus:border-action-primary"
                                                />
                                            </div>
                                            <div className="w-full lg:w-24 shrink-0">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Rate (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => updateEssentialField(i, 'rate', Math.max(Number(e.target.value), 0))}
                                                    className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main w-full focus:border-action-primary"
                                                />
                                            </div>
                                            <div className="w-full lg:w-20 shrink-0">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Qty</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateEssentialField(i, 'quantity', Math.max(Number(e.target.value), 0))}
                                                    className="bg-brand-surface border-ash-medium h-8 text-xs text-text-main text-center w-full focus:border-action-primary"
                                                />
                                            </div>

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
                                        className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs w-full focus:border-action-primary"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">No. Workers</Label>
                                    <Input
                                        type="number"
                                        value={labour.noOfLabours}
                                        onChange={(e) => setLabour({ ...labour, noOfLabours: safeNum(e.target.value) })}
                                        className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs text-center w-full focus:border-action-primary"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">No. Days</Label>
                                    <Input
                                        type="number"
                                        value={labour.noOfDays}
                                        onChange={(e) => setLabour({ ...labour, noOfDays: safeNum(e.target.value) })}
                                        className="bg-brand-surface border-ash-medium text-text-main h-8 text-xs text-center w-full focus:border-action-primary"
                                    />
                                </div>
                            </CardContent>
                        </Card>


                        {/* Factory / Fabrication Cost */}
                        <Card className="bg-brand-surface border border-ash-medium shadow-sm rounded-xl overflow-hidden mt-4 lg:mt-0">
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
                                        <Input type="number" value={factory.ratePerSqft} onChange={(e) => setFactory({ ...factory, ratePerSqft: safeNum(e.target.value) })} className="bg-brand-surface border-ash-medium text-text-main pl-6 h-8 text-xs w-full focus:border-action-primary" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 block">Total Area (SqFt)</Label>
                                    <div className="flex gap-2">
                                        <Input type="number" value={factory.totalSqft} onChange={(e) => setFactory({ ...factory, totalSqft: safeNum(e.target.value) })} className="bg-brand-surface border-ash-medium text-text-main flex-1 h-8 text-xs focus:border-action-primary" />
                                        <Button variant="white" size="sm" onClick={() => setShowSqftModal(true)} className="border-ash-dark text-text-main shadow-sm shrink-0 h-8 px-3 text-xs hover:border-action-primary hover:text-action-primary" title="Open Calculator">
                                            <i className="fas fa-calculator text-current"></i>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. Grand Total & Final Rate Highlight */}
                <Card className="!bg-brand-main/30 border border-ash-medium shadow-sm rounded-xl overflow-hidden mt-4 lg:mt-6 relative">
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-action-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <CardContent className="p-5 sm:p-6 flex flex-col relative z-10">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Project Cost</span>
                                <span className="text-3xl font-bold text-text-main">₹ {grandTotal.toLocaleString('en-IN')}</span>
                            </div>

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

                        <div className="w-full mt-8 pt-6 border-t border-ash-medium/50">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-calculator text-text-muted text-sm"></i>
                                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Calculation Breakdown</span>
                            </div>

                            <div className="bg-brand-surface/50 border border-ash-light p-5 sm:p-6 rounded-xl shadow-sm">
                                <div className="space-y-3 text-sm text-text-muted">
                                    <div className="flex justify-between items-center">
                                        <span className="font-poppins text-md text-text-main">Plywood</span>
                                        <span className="text-md">₹ {plywoodTotal.toLocaleString('en-IN')}</span>
                                    </div>

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
                                            <span className="font-poppins text-md text-text-main">{activeFinishLabel}</span>
                                            {/* <span>₹ {activeFinishTotal.toLocaleString('en-IN')}</span> */}
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

                                    <div className="pt-3 mt-3 border-t border-ash-medium border-dashed flex justify-between items-center font-bold text-text-main text-base">
                                        <span className="font-poppins uppercase tracking-wider text-[11px] text-text-muted">Grand Total</span>
                                        <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-ash-medium">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 text-sm text-text-muted bg-brand-ash/50 px-4 py-2 rounded-lg border border-ash-light w-fit">
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
                                                            className="h-8 text-xs bg-transparent border-0 focus:ring-0 shadow-none px-2 text-center text-text-main w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-ash-light">
                                                        <Input
                                                            type="number"
                                                            value={dim.height}
                                                            onChange={(e) => handleDimensionChange(i, 'height', Math.max(Number(e.target.value), 0))}
                                                            placeholder="H"
                                                            className="h-8 text-xs bg-transparent border-0 focus:ring-0 shadow-none px-2 text-center text-text-main w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-ash-light">
                                                        <div className="relative">
                                                            <select
                                                                value={dim.unit}
                                                                onChange={(e) => handleDimensionChange(i, 'unit', e.target.value as any)}
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
                                                        {!(i === dimensions.length - 1 && !dim.name && !dim.width && !dim.height) && (
                                                            <button
                                                                onClick={() => handleDimensionRemove(i)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-action-danger hover:bg-action-danger/10 transition-all mx-auto cursor-pointer"
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

                        <div className="p-5 border-t border-ash-medium bg-brand-ash/50 rounded-b-xl flex items-center justify-end gap-3 shrink-0">
                            <Button variant="white" onClick={() => setShowSqftModal(false)} className="border-ash-medium text-text-main shadow-sm px-6 font-bold">
                                Cancel
                            </Button>
                            <Button variant="dark" onClick={calculateModalSqft} className="shadow-sm px-8 font-black uppercase tracking-widest text-[10px]">
                                <i className="fas fa-check mr-2 text-action-success"></i> Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InstantCostCalculatorDimentionSingle;