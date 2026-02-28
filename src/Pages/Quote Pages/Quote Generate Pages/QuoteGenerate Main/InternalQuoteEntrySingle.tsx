import { useEffect, useRef, useState } from 'react'
import {
    // useCreateMaterialQuote,
    useEditMaterialQuote, useGetSingleInternalResidentialVersion,
    useUpdateInternalMainQuote
} from '../../../../apiList/Quote Api/Internal_Quote_Api/internalquoteApi';
import type { CoreMaterialRow, FurnitureBlock, SimpleItemRow } from './FurnitureForm';
import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from '../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi';
import { Button } from '../../../../components/ui/Button';
import FurnitureForm, { RATES } from './FurnitureForm';
import { useAuthCheck } from '../../../../Hooks/useAuthCheck';
import { filterValidSimpleRows } from './InternalQuoteEntry';
import { toast } from '../../../../utils/toast';
import { useNavigate, useParams } from 'react-router-dom';
import MaterialOverviewLoading from '../../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading';
import CreateQuoteModal from './InternalQuote_New_Version/CreateQuoteModal';
import { useGetProjects } from '../../../../apiList/projectApi';
import SqftRateInternalWork from './SqftRateInternalwork';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { getItemsBycategoryNameForAllCategories } from '../../../../apiList/Quote Api/RateConfig Api/rateConfigApi';
// import useGetRole from '../../../../Hooks/useGetRole';
import { getApiForRole } from '../../../../utils/roleCheck';
import SearchSelectNew from '../../../../components/ui/SearchSelectNew';

const InternalQuoteEntrySingle = () => {
    const navigate = useNavigate()
    const { organizationId, id, quoteType } = useParams() as { organizationId: string, id: string, quoteType: string }

    const { data, isLoading, refetch } = useGetSingleInternalResidentialVersion({ organizationId, id })

    const [isMainModalOpen, setMainModalOpen] = useState(false);

    const { data: projectData = [] } = useGetProjects(organizationId);

    const updateMutation = useUpdateInternalMainQuote();
    const [formData, setFormData] = useState<{
        mainQuoteName: string;
        quoteCategory: string;
        quoteType: string
        projectId: string | null;
    }>({
        mainQuoteName: '',
        quoteCategory: 'residential',
        quoteType: 'basic',
        projectId: ''
    });

    const handleUpdateSubmit = async () => {
        console.log("Submitting Form Data:", formData); // CHECK THIS LOG
        if (!formData.mainQuoteName || !formData.projectId || !formData.quoteCategory) {
            return toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
        }
        try {
            console.log("Calling API..."); // IF YOU DON'T SEE THIS, VALIDATION FAILED
            await updateMutation.mutateAsync({
                organizationId: organizationId,
                id: id,
                projectId: formData.projectId,
                mainQuoteName: formData.mainQuoteName,
                quoteCategory: formData.quoteCategory,
                quoteType: formData.quoteType
            });
            // if(res?.ok){
            setMainModalOpen(false);
            // }
            toast({ title: "Success", description: "Updated successfully" });
            refetch()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };


    //  OLD VERSION OF FETCHING THE BRANDS 
    // const [commonMaterialBrands, setcommonMaterialBrands] = useState<Record<number, any[]>>({});
    // const debounceTimers = useRef<Record<number, any>>({});

    // const { role, permission } = useAuthCheck();

    // const allowedRoles = ["owner", "CTO", "staff"];

    // const api = getApiForRole(role!);



    // useEffect(() => {
    //     // Prime the options map with already saved data so labels show up on load
    //     const initialMap: Record<number, any[]> = {};

    //     data?.commonMaterials?.forEach((row: any, i: number) => {
    //         if (row.brandId && row.brandName) {
    //             initialMap[i] = [{
    //                 label: row.brandName,
    //                 value: String(row.brandId),
    //                 rate: row.cost // Use existing cost as fallback
    //             }];
    //         }
    //     });

    //     setcommonMaterialBrands(prev => ({ ...prev, ...initialMap }));


    // }, [data?.commonMaterials]);

    // const fetchFittingsBrands = async (index: number, itemName: string) => {


    //     if (!itemName) return;
    //     try {

    //         if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed to fetch this data");
    //         if (!api) throw new Error("API instance not found for role");


    //         const results = await getItemsBycategoryNameForFittings({
    //             api,
    //             organizationId,
    //             categoryName: "Accessories/Hardware",
    //             itemName: itemName
    //         });


    //         console.log("results", results)

    //         const formatted = results.map((item: any) => ({
    //             label: item.data?.Brand,
    //             // ✅ FIX: _id is at the top level, not inside item.data
    //             // value: item?._id,
    //             value: item?._id ? String(item._id) : "",
    //             rate: item.data?.Rs
    //         }));


    //         console.log("formatted", formatted)

    //         setcommonMaterialBrands(prev => ({ ...prev, [index]: formatted }));
    //     } catch (error) {
    //         console.error("Error fetching fitting brands:", error);
    //     }
    // };


    const [commonMaterialBrands, setcommonMaterialBrands] = useState<Record<number, any[]>>({});
    const debounceTimers = useRef<Record<number, any>>({});

    const { role, permission } = useAuthCheck();

    const allowedRoles = ["owner", "CTO", "staff"];

    const api = getApiForRole(role!);



    // 🆕 New fetch function for Non-Branded (Global Search)
    const fetchAllCategoryItems = async (index: number, itemName: string) => {
        if (!itemName) return;
        try {
            if (!role || !allowedRoles.includes(role)) throw new Error("Not allowed");
            if (!api) throw new Error("API instance not found");

            const results = await getItemsBycategoryNameForAllCategories({
                api,
                organizationId,
                itemName: itemName
            });

            const formatted = results.map((item: any) => {
                // ✅ FIX: Prioritize Brand so you see "Hettich" instead of "hinges"
                // ✅ This is just the Brand name (e.g., "Hettich")
                const brandOnly =
                    item.data?.Brand ||
                    item.data?.BrandName ||
                    item.data?.brand ||
                    item.data?.brandName ||
                    item.data?.["Brands light name"] ||
                    item.data?.["Brand "] ||
                    item.data?.["Brands "] ||
                    'Unknown';

                const img = item.data?.image || item.data?.Image || item.data?.img || item.data?.images || item.data?.Images || "";


                return {
                    // This will now result in "Hettich (Accessories/Hardware)"
                    label: `${brandOnly} (${item.categoryName?.trim() || 'No Cat'})`,
                    value: item?._id ? String(item._id) : "",
                    rate: item.data?.Rs || item.data?.rs || item?.data?.RS || 0,
                    brandOnly: brandOnly,
                    imageUrl: img // 🆕 Extracted image
                };
            });

            setcommonMaterialBrands(prev => ({ ...prev, [index]: formatted }));
        } catch (error) {
            console.error("Error fetching all category items:", error);
        }
    };

    useEffect(() => {
        // Prime the options map with already saved data so labels show up on load
        const initialMap: Record<number, any[]> = {};


        // 2. Prime common materials Materials & Trigger Silent Fetch
        data?.commonMaterials?.forEach((row: any, i: number) => {
            if (row.brandId && row.brandName) {

                // Set the initial label (Brand Name only since Category is missing)
                initialMap[i] = [{
                    label: row.brandName,
                    value: String(row.brandId),
                    brandOnly: row.brandName,
                    rate: row.cost,
                    imageUrl: row.imageUrl // 🆕 Preserve saved image
                }];

                // ✅ Trigger fetchAllCategoryItems immediately for existing rows
                // This will overwrite initialNbmMap[i] with the "Brand (Category)" label once finished
                if (row.itemName) {
                    fetchAllCategoryItems(i, row.itemName);
                }

            }
        });

        setcommonMaterialBrands(prev => ({ ...prev, ...initialMap }));


    }, []);








    useEffect(() => {
        // if (quoteType === "null" || quoteType === null || quoteType === "residential" || quoteType === "basic") {
        if (quoteType === "basic") {
            //   if(data?.furnitures) setFurnitures(data?.furnitures)

            if (data?.furnitures && Array.isArray(data.furnitures)) {

                // Transform the API data to match your local FurnitureBlock type
                const transformedFurnitures: FurnitureBlock[] = data.furnitures.map((item: any) => ({
                    ...item,
                    coreMaterials: item.coreMaterials.map((cm: any) => ({
                        ...cm,
                        // If API returns old 'laminateNos', map it to outer as a default
                        innerLaminate: cm.innerLaminate || { quantity: 0, thickness: 0 },
                        outerLaminate: cm.outerLaminate || { quantity: 0, thickness: 0 },
                    })),
                    totals: {
                        core: item.coreMaterialsTotal || 0,
                        fittings: item.fittingsAndAccessoriesTotal || 0,
                        glues: item.gluesTotal || 0,
                        nbms: item.nonBrandMaterialsTotal || 0,
                        furnitureTotal: item.furnitureTotal || 0,
                    }
                }));

                setFurnitures(transformedFurnitures);
            }
        }

    }, [data])

    // Inside InternalQuoteEntrySingle
    const [globalTransportation, setGlobalTransportation] = useState<number>(
        // data?.globalTransportation || 0
        0
    );
    const [globalProfitPercent, setGlobalProfitPercent] = useState<number>(
        // data?.globalProfitPercent || 0
        0
    );



    useEffect(() => {
        if (data) {
            setGlobalTransportation(data?.globalTransportation || 0);
            setGlobalProfitPercent(data?.globalProfitPercent || 0);
            setCommonProfitOverride(data?.commonProfitOverride || 0)
        }
    }, [data]); // This resets the overheads if a different quote is loaded



    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [tempFurnitureName, setTempFurnitureName] = useState("");




    // 1. Add this state at the top of your component
    const [commonMaterials, setCommonMaterials] = useState<SimpleItemRow[]>([]);
    const [commonProfitOverride, setCommonProfitOverride] = useState<number>(0);

    // 2. Add this helper to initialize or handle API data for common items
    useEffect(() => {
        if (data?.commonMaterials) {
            setCommonMaterials(data.commonMaterials);
        }
    }, [data]);

    // Handler for the Common Material Profit Input
    const handleCommonProfitOverride = (newProfit: number) => {
        setCommonProfitOverride(newProfit);
        // The useEffect will catch this if we add it to dependencies, 
        // or we can trigger a manual recalculation if needed.

        // 2. ✅ RESET: Map through common materials and wipe individual row profits
        setCommonMaterials(prev => prev.map(item => ({
            ...item,
            profitOnMaterial: 0
        })));
    };


    // 3. Update the Row Count logic to include Common Items
    const getTotalRowCount = () => {
        const furnitureRows = furnitures.reduce((acc, f) => {
            return acc + f.coreMaterials.length + f.fittingsAndAccessories.length + f.glues.length + f.nonBrandMaterials.length;
        }, 0);
        // Add common items to the total count for transport splitting
        return furnitureRows + commonMaterials.length;
    };




    // Handler for Common Items
    const handleCommonItemChange = (i: number, key: keyof SimpleItemRow, value: any) => {
        // const updated = [...commonMaterials];
        // updated[i] = { ...updated[i], [key]: value };

        // // Calculate rowTotal immediately for local feedback
        // const base = (Number(updated[i].quantity) || 0) * (Number(updated[i].cost) || 0);
        // const localProfitMultiplier = 1 + ((Number(updated[i].profitOnMaterial) || 0) / 100);
        // const globalMultiplier = 1 + (globalProfitPercent / 100);

        // // Note: Transport will be applied accurately by the useEffect automatically
        // updated[i].rowTotal = base * localProfitMultiplier * globalMultiplier;

        // // 👉 Auto-add new row on typing in last row
        // const isLastRow = i === updated.length - 1;
        // if (isLastRow && (updated[i].itemName || updated[i].cost)) {
        //     updated.push(emptySimpleItem());
        // }

        // console.log("updated", updated)

        // setCommonMaterials(updated);


        // ✅ Use the functional updater (prev) to ensure we always have the latest data
        setCommonMaterials((prev) => {
            const updated = [...prev];

            // Use updated[i] as the base to merge the new key/value
            const currentRow = { ...updated[i], [key]: value };

            // Recalculate rowTotal using current values
            const qty = Number(currentRow.quantity) || 0;
            const cost = Number(currentRow.cost) || 0;
            const profit = Number(currentRow.profitOnMaterial) || 0;

            const base = qty * cost;
            const localProfitMultiplier = 1 + (profit / 100);
            const globalMultiplier = 1 + (globalProfitPercent / 100);

            currentRow.rowTotal = base * localProfitMultiplier * globalMultiplier;

            // Update the array with the merged row
            updated[i] = currentRow;

            // 👉 Auto-add new row logic
            const isLastRow = i === updated.length - 1;
            if (isLastRow && (currentRow.itemName || currentRow.cost > 0)) {
                // Only add if the last row isn't already empty
                updated.push(emptySimpleItem());
            }


            console.log("updated", updated)
            console.log("State updated successfully for:", key, value);
            return updated;
        });
    };

    const removeCommonItem = (index: number) => {
        setCommonMaterials(prev => prev.filter((_, i) => i !== index));
    };



    const rendercommonMaterialsTable = () => (
        <div className="overflow-x-auto rounded-md  pb-[200px] -mb-[200px] !overflow-y-visible">
            <table className="min-w-full text-sm bg-white shadow-sm border-separate border-spacing-0 !overflow-visible">
                <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
                    <tr>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Item Name</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Brand</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Quantity</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Cost</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Profit %</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Total</th>
                        <th className="text-center px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="!overflow-visible">
                    {(commonMaterials.length > 0 ? commonMaterials : [emptySimpleItem()]).map((row, i) => (
                        <tr key={i}
                            // className="hover:bg-gray-50 border-b border-gray-100"
                            className="group relative border-none !border-b-1 px-4 !py-2 transition-all duration-150 hover:bg-gray-50 hover:z-[100] focus-within:z-[100]"


                        >
                            <td className="p-2 border-r border-gray-100">
                                <input
                                    value={row.itemName || ""}
                                    // onChange={(e) => {
                                    //     handleCommonItemChange(i, "itemName", e.target.value)


                                    // }
                                    // }


                                    onChange={(e) => {
                                        const val = e.target.value;

                                        // 1. Immediate UI update for the text
                                        handleCommonItemChange(i, "itemName", val);

                                        // 2. Clear existing timer for this specific row index
                                        if (debounceTimers.current[i]) {
                                            clearTimeout(debounceTimers.current[i]);
                                        }

                                        // 3. Set new timer: Call API only after 800ms of no typing
                                        debounceTimers.current[i] = setTimeout(() => {
                                            // fetchFittingsBrands(i, val);
                                            fetchAllCategoryItems(i, val)
                                        }, 600);
                                    }}
                                    className="w-full text-center outline-none bg-transparent"
                                    placeholder="e.g. Screws"
                                />
                            </td>
                            <td className="p-2 border-r border-gray-100">
                                <input
                                    value={row.description || ""}
                                    onChange={(e) => handleCommonItemChange(i, "description", e.target.value)}
                                    className="w-full text-center outline-none bg-transparent"
                                    placeholder="details"
                                />
                            </td>

                            <td className="p-2 border border-gray-200 min-w-[200px] !static lg:!relative">
                                {/* We use a div inside the TD to create a local "anchor". 
                                  By making this overflow-visible and the SearchSelect relative/absolute, 
                                  it will float above other rows.
                                */}
                                {/* <div className="relative w-full overflow-visible z-[50]"> */}
                                <div className="relative w-full !overflow-visible z-[70]">
                                    <SearchSelectNew
                                        options={commonMaterialBrands[i] || []}
                                        value={row?.brandId || ""}
                                        placeholder={row?.itemName ? "Select Brand" : "Type item first"}
                                        onFocus={() => {
                                            if (!commonMaterialBrands[i] || commonMaterialBrands[i].length <= 1) {
                                                // fetchFittingsBrands(i, row.itemName);
                                                fetchAllCategoryItems(i, row.itemName);
                                            }
                                        }}
                                        // This ensures the dropdown menu itself is forced to the front
                                        // className="relative z-[100] w-full"
                                        className="!overflow-visible relative z-[110]"
                                        onValueChange={(val) => {
                                            const options = commonMaterialBrands[i] || [];
                                            console.log("options", options)
                                            const selected = options.find((opt: any) => String(opt.value) === String(val));

                                            console.log("selected", selected)
                                            if (selected) {
                                                const nameToStore = selected?.brandOnly || selected?.label;
                                                handleCommonItemChange(i, "brandId" as any, selected?.value);
                                                // handleCommonItemChange(i, "brandName" as any, selected?.label);
                                                handleCommonItemChange(i, "brandName" as any, nameToStore);
                                                handleCommonItemChange(i, "cost", selected?.rate);
                                                handleCommonItemChange(i, "imageUrl" as any, selected?.imageUrl || "");
                                            }
                                        }}
                                    />
                                </div>
                            </td>


                            <td className="p-2 border-r border-gray-100">
                                <input
                                    type="number"
                                    value={row.quantity || ""}
                                    onChange={(e) => handleCommonItemChange(i, "quantity", Math.max(0, Number(e.target.value)))}
                                    className="w-full text-center outline-none bg-transparent"
                                />
                            </td>
                            <td className="p-2 border-r border-gray-100">
                                <input
                                    type="number"
                                    value={row.cost || ""}
                                    onChange={(e) => handleCommonItemChange(i, "cost", Math.max(0, Number(e.target.value)))}
                                    className="w-full text-center outline-none bg-transparent"
                                />
                            </td>
                            <td className="p-2 border-r border-gray-100">
                                <input
                                    type="number"
                                    value={row.profitOnMaterial || ""}
                                    onChange={(e) => handleCommonItemChange(i, "profitOnMaterial", Math.max(0, Number(e.target.value)))}
                                    className="w-full text-center outline-none bg-transparent"
                                    placeholder="0"
                                />
                            </td>
                            <td className="p-2 border-r border-gray-100 font-bold text-gray-700 text-center">
                                ₹{row.rowTotal?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                            </td>
                            <td className="p-2 text-center">
                                <Button variant="danger" size="sm" onClick={() => removeCommonItem(i)}>
                                    {/* <i className="fas fa-trash" /> */}
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // const canList = role === "owner" || permission?.internalquote?.list;
    const canCreate = role === "owner" || permission?.internalquote?.create;
    // const canDelete = role === "owner" || permission?.internalquote?.delete;
    const canEdit = role === "owner" || permission?.internalquote?.edit;


    const [selectedLabourCategory, setSelectedLabourCategory] = useState({
        categoryId: "",
        categoryName: ""
    });

    let { data: labourCost = 0 } = useGetSingleLabourCost({ organizationId, categoryId: selectedLabourCategory.categoryId });

    let { data: allLabourCategory = [] } = useGetLabourRateConfigCategories(organizationId);

    // 2. AUTO-SELECT EFFECT: Set the first category as default once data arrives
    useEffect(() => {
        if (allLabourCategory && allLabourCategory?.length > 0 && !selectedLabourCategory.categoryId) {
            const firstCategory = allLabourCategory[0];
            setSelectedLabourCategory({
                categoryId: firstCategory._id,
                categoryName: firstCategory.name
            });
        }
    }, [allLabourCategory]); // Runs when the list is fetched



    //  used when  we chagne the global transportationa and the global profit percentage

    useEffect(() => {
        // If global values are 0, we allow FurnitureForm to handle calculations exclusively
        // if (globalTransportation === 0 && globalProfitPercent === 0) return;

        const totalRowsCount = getTotalRowCount();
        const transportPerRow = totalRowsCount > 0 ? globalTransportation / totalRowsCount : 0;
        // const globalProfitMultiplier = 1 + (globalProfitPercent / 100);

        setFurnitures(prevFurnitures => prevFurnitures.map((f) => {
            if (f.coreMaterials.length === 0) return f;

            // ✅ PRIORITY LOGIC: 
            // If Global Profit > 0, use it for everything.
            // Otherwise, use the individual Furniture Profit (furnitureProfit).
            const effectiveProfitPercent = (globalProfitPercent !== null && globalProfitPercent !== undefined)
                ? globalProfitPercent
                : (f.furnitureProfit || 0);

            // const effectiveProfitPercent = globalProfitPercent > 0
            //     ? globalProfitPercent
            //     : (f.furnitureProfit || 0);


            //  ✅ NEW LOGIC: Product Profit overrides Global Profit ( dont use this the each product percnetage value is not getting chaged if the global percentage is gettng changed)
            // If the product has a specific profit (1%), use it. 
            // Otherwise, fall back to the Global Profit (2%).
            // const effectiveProfitPercent = (f.furnitureProfit !== undefined && f.furnitureProfit > 0)
            //     ? f.furnitureProfit
            //     : globalProfitPercent;



            const profitMultiplier = 1 + (effectiveProfitPercent / 100);

            // 1. MIRROR FurnitureForm LABOUR LOGIC
            // It takes carpenters/days from the first row (index 0)
            const base = f.coreMaterials[0];
            const totalLabourBase = (base.carpenters || 0) * (base.days || 0) * labourCost;

            // Apply the local labour profit defined in the first row
            const labourWithLocalProfit = totalLabourBase * (1 + (base.profitOnLabour || 0) / 100);

            // Spread it equally across ONLY the rows of THIS furniture block
            const labourPerRow = labourWithLocalProfit / f.coreMaterials.length;

            // 2. PROCESS CORE MATERIALS
            const updatedCore = f.coreMaterials.map((cm) => {
                const plywoodCost = (cm.plywoodNos?.quantity || 0) * RATES.plywood;
                const inLamCost = (cm.innerLaminate?.quantity || 0) * RATES.innerLaminate;
                const outLamCost = (cm.outerLaminate?.quantity || 0) * RATES.outerLaminate;

                const materialBase = plywoodCost + inLamCost + outLamCost;
                const materialWithLocalProfit = materialBase * (1 + (cm.profitOnMaterial || 0) / 100);

                // Calculation: ((Material + Labour) * Global Profit) + Transport
                // Note: rowTotal remains a float for precise Grand Total summation
                return {
                    ...cm,
                    // rowTotal: ((materialWithLocalProfit + labourPerRow) * globalProfitMultiplier) + transportPerRow
                    rowTotal: ((materialWithLocalProfit + labourPerRow) * profitMultiplier) + transportPerRow
                };
            });

            // 3. PROCESS SIMPLE SECTIONS (Fittings, Glues, NBMs)
            // Glue logic mirrors your handleCoreChange: avgCoreCost calculation
            const totalCoreCost = updatedCore.reduce((sum, row) => sum + row.rowTotal, 0);
            const avgCoreCost = updatedCore.length > 0 ? totalCoreCost / updatedCore.length : 0;
            // const localMaterialProfit = base.profitOnMaterial || 0;

            const updateSection = (section: SimpleItemRow[], isGlue = false) => section.map(item => {

                // If it is Glue, the baseValue is avgCoreCost (which is already profit-inflated)
                // So we DON'T multiply by globalProfitMultiplier again.
                if (isGlue) {
                    return {
                        ...item,
                        rowTotal: avgCoreCost + transportPerRow // Just add transport
                    };
                }


                const baseValue = isGlue ? avgCoreCost : ((item.quantity || 0) * (item.cost || 0));
                const localProfit = 1 + ((item.profitOnMaterial || 0) / 100);
                // Simple items also get global profit and transport
                return {
                    ...item,
                    // rowTotal: (baseValue * localProfit * globalProfitMultiplier) + transportPerRow
                    rowTotal: (baseValue * localProfit * profitMultiplier) + transportPerRow
                };
            });

            const updatedFittings = updateSection(f.fittingsAndAccessories);
            const updatedGlues = updateSection(f.glues, true);
            const updatedNbms = updateSection(f.nonBrandMaterials);

            // 4. PRECISE TOTALS
            const coreSum = updatedCore.reduce((s, r) => s + r.rowTotal, 0);
            const fitSum = updatedFittings.reduce((s, r) => s + r.rowTotal, 0);
            const glueSum = updatedGlues.reduce((s, r) => s + r.rowTotal, 0);
            const nbmSum = updatedNbms.reduce((s, r) => s + r.rowTotal, 0);

            return {
                ...f,
                furnitureProfit: effectiveProfitPercent,
                coreMaterials: updatedCore,
                fittingsAndAccessories: updatedFittings,
                glues: updatedGlues,
                nonBrandMaterials: updatedNbms,
                totals: {
                    core: Math.round(coreSum),
                    fittings: Math.round(fitSum),
                    glues: Math.round(glueSum),
                    nbms: Math.round(nbmSum),
                    furnitureTotal: Math.round(coreSum + fitSum + glueSum + nbmSum)
                }
            };
        }));


        // --- UPDATED: Recalculate Common Items with Override Logic ---
        // ✅ Logic: Use manual override if it exists (even 0), otherwise use global.
        const effectiveCommonProfit = commonProfitOverride ?? globalProfitPercent;
        const commonMultiplier = 1 + (effectiveCommonProfit / 100);

        // --- NEW: Recalculate Common Items ---
        setCommonMaterials(prev => prev.map(item => {
            const base = (item.quantity || 0) * (item.cost || 0);
            const localProfit = 1 + ((item.profitOnMaterial || 0) / 100);

            return {
                ...item,
                // These always use Global Profit + Transport
                rowTotal: (base * localProfit * commonMultiplier) + transportPerRow
            };
        }));


        // We removed labourCost from dependencies as requested.
        // If labourCost changes, the next user input in transport/profit will catch it.
    }, [globalTransportation, globalProfitPercent, labourCost, commonProfitOverride]);

    // const { mutateAsync: createQuote, isPending } = useCreateMaterialQuote();
    const { mutateAsync: editQuote, isPending: editPending } = useEditMaterialQuote();


    const furnitureTotal =
        furnitures?.reduce(
            (sum, f) => sum + (f?.totals?.furnitureTotal || 0),
            0
        ) || 0;

    const commonTotal =
        commonMaterials?.reduce(
            (sum, item) => sum + (item?.rowTotal || 0),
            0
        ) || 0;

    const grandTotal = furnitures?.length > 0
        ? furnitureTotal + commonTotal
        : 0;

    // const grandTotal = furnitures.length > 0 ? furnitures?.reduce((sum, f) => sum + f?.totals?.furnitureTotal, 0) : 0;



    //  NOW CURRENTLY THIS CREATE (HANDLE SUBMIT IS NOT USED ONLY THE HANDLE EDIT IS USED)

    // const handleSubmit = async () => {
    //     try {


    //         if (!data.projectId) {
    //             toast({ title: "Error", description: "Please select a project", variant: "destructive" });
    //             return;
    //         }

    //         const formData = new FormData();

    //         formData.append("furnitures", JSON.stringify(
    //             furnitures.map((f) => {
    //                 return {
    //                     furnitureName: f.furnitureName,
    //                     coreMaterials: f.coreMaterials.map(cm => {
    //                         if (Object.values(cm).some(value => Boolean(value))) {
    //                             const { imageUrl, previewUrl, ...rest } = cm;
    //                             return rest;
    //                         }
    //                         return null;
    //                     })
    //                         .filter(Boolean),
    //                     // fittingsAndAccessories: f.fittingsAndAccessories,
    //                     // glues: f.glues,
    //                     // nonBrandMaterials: f.nonBrandMaterials,
    //                     fittingsAndAccessories: filterValidSimpleRows(f.fittingsAndAccessories),
    //                     glues: filterValidSimpleRows(f.glues),
    //                     nonBrandMaterials: filterValidSimpleRows(f.nonBrandMaterials),
    //                     coreMaterialsTotal: f.totals.core,
    //                     fittingsAndAccessoriesTotal: f.totals.fittings,
    //                     gluesTotal: f.totals.glues,
    //                     nonBrandMaterialsTotal: f.totals.nbms,
    //                     furnitureTotal: f.totals.furnitureTotal,
    //                 };
    //             })
    //         ));

    //         furnitures.forEach((f, fIdx) => {
    //             f.coreMaterials.forEach((cm, cmIdx) => {
    //                 if (cm.imageUrl) {
    //                     formData.append(`images[${fIdx}][${cmIdx}]`, cm.imageUrl);
    //                 }
    //             });
    //         });

    //         formData.append("grandTotal", grandTotal.toString());
    //         // formData.append("quoteNo", `Q-${Date.now()}`); // optional
    //         formData.append("notes", "Generated"); // optional

    //         await createQuote({ organizationId, projectId: data.projectId, formData });

    //         toast({ title: "Success", description: "Created Successfully, Visit in Quote Generator Section" });
    //         // setFurnitures([])
    //         // setQuoteType(null)

    //     }
    //     catch (error: any) {
    //         toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to generate the items", variant: "destructive" });
    //     }
    // };

    const handleEditSubmit = async (isManualSave: boolean = true) => {
        try {
            // if (!data?.projectId) {
            //     toast({ title: "Error", description: "Please select a project", variant: "destructive" });
            //     return;
            // }

            const formData = new FormData();

            // Prepare furnitures payload & attach new image files
            const furnituresPayload = furnitures.map((f, fIndex) => {
                const coreMaterials = f.coreMaterials.map((cm, cmIndex) => {
                    const { previewUrl, newImageFile, ...rest } = cm as any;

                    // Attach new image file if present
                    if (newImageFile) {
                        // Field name must match backend: images[fIndex][cmIndex]
                        formData.append(`images[${fIndex}][${cmIndex}]`, newImageFile);
                    }

                    return {
                        ...rest,
                        imageUrl: cm.imageUrl || null, // keep old image if no new file
                    };
                });

                return {
                    furnitureName: f.furnitureName,
                    dimention: f.dimention,
                    furnitureProfit: f.furnitureProfit,
                    coreMaterials,
                    fittingsAndAccessories: filterValidSimpleRows(f.fittingsAndAccessories),
                    glues: filterValidSimpleRows(f.glues),
                    nonBrandMaterials: filterValidSimpleRows(f.nonBrandMaterials),
                    coreMaterialsTotal: f.totals.core,
                    fittingsAndAccessoriesTotal: f.totals.fittings,
                    gluesTotal: f.totals.glues,
                    nonBrandMaterialsTotal: f.totals.nbms,
                    furnitureTotal: f.totals.furnitureTotal,
                };
            });

            // const validCommonMaterials = commonMaterials.filter(item => item.itemName || item.cost > 0);
            const validCommonMaterials = commonMaterials.filter(item =>
                item.brandId || (item.itemName && item.cost > 0)
            );




            // Add other fields to FormData
            formData.append("furnitures", JSON.stringify(furnituresPayload));
            formData.append("commonMaterials", JSON.stringify(validCommonMaterials)); // 🆕 Add this
            formData.append("commonProfitOverride", commonProfitOverride.toString()); // 🆕 Add this
            formData.append("grandTotal", grandTotal.toString());
            formData.append("notes", "Updated via frontend");
            formData.append("globalTransportation", globalTransportation.toString());
            formData.append("globalProfitPercent", globalProfitPercent.toString());
            // if (editQuoteNo) formData.append("quoteNo", editQuoteNo);

            // if (editingId) {
            await editQuote({
                organizationId,
                projectId: data.projectId,
                // formData: payload,
                formData, // ✅ send FormData with only new files
                // id: editingId,
                id: id,
            });

            if (isManualSave) {
                toast({ title: "Updated!", description: "Quote edited successfully." });
            }

            // setFurnitures([])
            // setQuoteType(null)
            // setIsEditingId(null);
            // }
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to Update the Quote", variant: "destructive" });
        }
    };





    // 1. Wrap the changing data in your custom useDebounce hook
    // We watch furnitures, commonMaterials, and global overheads
    const debouncedFurnitures = useDebounce(furnitures, 700); // 2 second delay
    const debouncedCommonMaterials = useDebounce(commonMaterials, 700);
    const debouncedGlobalTransportation = useDebounce(globalTransportation, 700);
    const debouncedGlobalProfit = useDebounce(globalProfitPercent, 700);
    const debouncedCommonProfit = useDebounce(commonProfitOverride, 700);

    // 2. Create the Auto-Save Effect
    useEffect(() => {
        // Only auto-save for this specific type
        // if (quoteType !== "sqft_rate") return;

        // // Prevent saving if the initial data is still loading or if array is empty (optional check)
        if (!data?.projectId || furnitures.length === 0) return;

        const triggerAutoSave = async () => {
            console.log("Auto-saving quote...");
            await handleEditSubmit(false);
        };

        triggerAutoSave();

        // The effect runs when debounced values stabilize
    }, [
        debouncedFurnitures,
        debouncedCommonMaterials,
        debouncedGlobalTransportation,
        debouncedGlobalProfit,
        debouncedCommonProfit
    ]);



    const addFurniture = (furnitureName: string) => {
        setFurnitures(prev => [
            ...prev,
            {
                furnitureName,
                dimention: {
                    height: 0,
                    width: 0,
                    depth: 0
                },
                coreMaterials: [emptyCoreMaterial()],
                fittingsAndAccessories: [emptySimpleItem()],
                glues: [emptySimpleItem()],
                nonBrandMaterials: [emptySimpleItem()],
                totals: { core: 0, fittings: 0, glues: 0, nbms: 0, furnitureTotal: 0 },
            }
        ]);
    };

    const handleRemoveFurniture = (indexToRemove: number) => {
        setFurnitures((prev) => prev.filter((_, i) => i !== indexToRemove));
    };


    const handleDuplicateFurniture = (index: number) => {
        const furnitureToCopy = JSON.parse(JSON.stringify(furnitures[index])); // Deep clone the product
        // const updatedArr = [...furnitures];
        // Insert the copy immediately after the original
        // updatedArr.splice(index + 1, 0, furnitureToCopy);
        // setFurnitures(updatedArr);

        setFurnitures([...furnitures, furnitureToCopy]);
    };



    const emptyCoreMaterial = (): CoreMaterialRow => ({
        itemName: "",
        materialUsed: "plywood",
        plywoodNos: { quantity: 0, thickness: 0 },
        // laminateNos: { quantity: 0, thickness: 0 },
        innerLaminate: { quantity: 0, thickness: 0 }, // New field
        outerLaminate: { quantity: 0, thickness: 0 }, // New field
        carpenters: 0,
        days: 0,
        profitOnMaterial: 0,
        profitOnLabour: 0,
        rowTotal: 0,
        remarks: "",
    });

    const emptySimpleItem = (): SimpleItemRow => ({
        itemName: "",
        brandId: "",
        brandName: "",
        description: "",
        quantity: 0,
        cost: 0,
        rowTotal: 0,
    });


    if (isLoading) return <MaterialOverviewLoading />


    return (
        <>




            {data?.quoteType === "sqft_rate" ? (
                <SqftRateInternalWork
                    data={data}
                    id={id}
                    organizationId={organizationId}
                    projectData={projectData}
                />
            )
                :
                (

                    <div className='max-h-full overflow-y-auto'>


                        <header className="flex sticky top-0 z-110 !bg-white flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 border-b-1 border-[#818283]">


                            <div className="flex items-center gap-4 ">
                                <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors">
                                    <i className="fas fa-arrow-left" />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-black text-slate-900">{data?.mainQuoteName}</h1>
                                        <button
                                            onClick={() => {
                                                setFormData(() => {
                                                    return {
                                                        mainQuoteName: data?.mainQuoteName,
                                                        quoteCategory: data?.quoteCategory,
                                                        quoteType: data?.quoteType,
                                                        projectId: data?.projectId
                                                    }
                                                })
                                                setMainModalOpen(true)
                                            }
                                            }
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                            <i className="fas fa-edit text-sm" />
                                        </button>
                                    </div>
                                    <div>

                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{data?.projectId?.projectName || "Project"}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Basic Quote • {data?.quoteNo}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-6">



                                {editPending && (
                                    <span className="text-[10px] text-blue-500 animate-pulse font-bold uppercase">
                                        <i className="fas fa-sync fa-spin mr-1" /> Auto-saving...
                                    </span>
                                )}
                                {!editPending && (
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                                        <i className="fas fa-check-circle mr-1" /> All changes saved
                                    </span>
                                )}

                                {furnitures?.length > 0 && (
                                    <div className="flex items-center gap-10">

                                        {/* Labour Cost */}
                                        <div>
                                            <p className="text-xs text-gray-500 tracking-wide">
                                                Single Labour Cost
                                            </p>
                                            <p className="text-[15px] font-semibold text-gray-900">
                                                ₹{labourCost?.toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-8 w-px bg-gray-300" />

                                        {/* Grand Total */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">
                                                Grand Total
                                            </p>
                                            <p className="text-xl font-bold text-green-600">
                                                ₹{grandTotal?.toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                    </div>
                                )}

                                {canCreate && (
                                    <Button
                                        className="flex items-center"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        <i className="fas fa-add mr-1" />
                                        Create Product
                                    </Button>
                                )}
                            </div>

                        </header>


                        {isModalOpen && (
                            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 bg-opacity-40 backdrop-blur-sm transition">
                                <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md relative animate-scaleIn">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Quote</h3>

                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Enter Product Name"
                                        value={tempFurnitureName}
                                        autoFocus
                                        onChange={(e) => setTempFurnitureName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                if (!tempFurnitureName.trim()) return;
                                                addFurniture(tempFurnitureName);
                                                setTempFurnitureName("");
                                                setModalOpen(false);
                                            }
                                        }}
                                    />

                                    <div className="flex justify-end gap-3 mt-4">
                                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (!tempFurnitureName.trim()) return;
                                                addFurniture(tempFurnitureName);
                                                setTempFurnitureName("");
                                                setModalOpen(false);
                                            }}
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}



                        {furnitures?.length === 0 &&
                            <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-white rounded-xl   text-center p-6">
                                <i className="fas fa-box-open text-5xl text-blue-300 mb-4" />
                                {/* <h3 className="text-lg font-semibold text-blue-800 mb-1">Create</h3> */}
                                <p className="text-sm text-gray-500">
                                    Cick on the Create button to start creating the quote<br />
                                    <Button onClick={() => setModalOpen(true)} className="mx-4 my-2">

                                        <i className='fas fa-plus mr-1 '></i>
                                        Create Product</Button>
                                </p>
                            </div>
                        }

                        {furnitures?.length > 0 && <section className="shadow max-h-[86%]">

                            {furnitures?.map((furniture, index) => (
                                <FurnitureForm
                                    key={index}
                                    index={index}
                                    labourCost={labourCost}
                                    data={furniture}
                                    duplicateFurniture={() => handleDuplicateFurniture(index)} // Pass the function
                                    updateFurniture={(updated) => {
                                        const updatedArr = [...furnitures];
                                        updatedArr[index] = { ...updated };
                                        setFurnitures(updatedArr);
                                    }}
                                    removeFurniture={() => handleRemoveFurniture(index)}
                                    isEditing={true}   // ✅ pass editing mode

                                />
                            ))}
                        </section>}

                        {/* --- COMMON FITTINGS & MATERIALS SECTION --- */}
                        {furnitures.length > 0 && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8 mb-6 shadow-inner">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                        <i className="fas fa-boxes mr-3 text-orange-500" />
                                        General/Common Site Materials - Total: ₹{commonMaterials.reduce((s, i) => s + (i.rowTotal || 0), 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                                    </h2>

                                    {/* ✅ NEW: Profit Override Input for Common Materials */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 shadow-sm">
                                            <label className="text-[11px] font-bold text-orange-600 uppercase tracking-tight">
                                                Common Profit Overlay
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    className="w-12 text-right font-bold bg-transparent outline-none text-orange-800"
                                                    // Show manual override if exists, else show global
                                                    value={commonProfitOverride ?? globalProfitPercent}
                                                    placeholder="0"
                                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                                    onChange={(e) => {
                                                        const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                                        handleCommonProfitOverride(val);
                                                    }}
                                                />
                                                <span className="text-orange-600 font-bold ml-1 text-sm">%</span>
                                            </div>
                                        </div>

                                        <div className="text-right text-xl text-green-700 font-bold">
                                            Total: ₹{commonMaterials.reduce((s, i) => s + (i.rowTotal || 0), 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>


                                {rendercommonMaterialsTable()}

                                <div className="mt-3 text-right">
                                    <Button onClick={() => setCommonMaterials([...commonMaterials, emptySimpleItem()])} variant="secondary" size="sm">
                                        + Add Common Item
                                    </Button>
                                </div>
                            </div>
                        )}

                        {furnitures.length !== 0 && <div className="flex items-center justify-between gap-4 bg-white border border-blue-100 p-3 rounded-xl shadow-sm">
                            <div className="flex items-center gap-4" >
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-extrabold text-blue-500 uppercase tracking-tighter">Transport Cost</label>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-1 text-sm">₹</span>
                                        <input
                                            type="number"
                                            className="w-20 font-semibold focus:outline-none text-gray-800"
                                            value={globalTransportation}
                                            onChange={(e) => setGlobalTransportation(Math.max(0, Number(e.target.value)))}
                                        />
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-gray-100" />
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-extrabold text-green-500 uppercase tracking-tighter">Global Profit Margin</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            className="w-12 text-right font-semibold focus:outline-none text-gray-800"
                                            value={globalProfitPercent}
                                            onChange={(e) => {
                                                setGlobalProfitPercent(Math.max(0, Number(e.target.value)))
                                                setCommonProfitOverride(Math.max(0, Number(e.target.value)));

                                                setFurnitures(prev => prev.map(f => ({
                                                    ...f,
                                                    furnitureProfit: 0, // Reset product level
                                                    coreMaterials: f.coreMaterials.map(r => ({ ...r, profitOnMaterial: 0, profitOnLabour: 0 })),
                                                    fittingsAndAccessories: f.fittingsAndAccessories.map(i => ({ ...i, profitOnMaterial: 0 })),
                                                    nonBrandMaterials: f.nonBrandMaterials.map(i => ({ ...i, profitOnMaterial: 0 }))
                                                })));
                                                setCommonMaterials(prev => prev.map(item => ({ ...item, profitOnMaterial: 0 })));

                                            }}
                                        />
                                        <span className="text-gray-400 ml-1 text-sm">%</span>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-1 text-right flex gap-2 justify-end">
                                {(canCreate || canEdit) && <Button
                                    variant="primary"
                                    isLoading={editPending}
                                    // onClick={editingId ? handleEditSubmit : handleSubmit}
                                    // onClick={true ? handleEditSubmit : handleSubmit}
                                    onClick={() => handleEditSubmit(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded"
                                >
                                    Save Quote
                                </Button>
                                }
                            </div>
                        </div>}


                    </div >
                )}

            {/* MOVE THE MODAL TO THE END - OUTSIDE ALL CONDITIONS */}
            {isMainModalOpen && (
                <CreateQuoteModal
                    isEditing={true}
                    formData={formData}
                    projectsData={projectData}
                    setModalOpen={setMainModalOpen}
                    setFormData={setFormData}
                    handleSubmit={handleUpdateSubmit}
                    isSubmitting={updateMutation.isPending}
                />
            )}

        </>
    )
}

export default InternalQuoteEntrySingle