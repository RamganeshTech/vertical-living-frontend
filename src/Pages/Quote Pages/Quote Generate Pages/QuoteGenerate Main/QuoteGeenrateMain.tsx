import { useEffect, useMemo, useState } from "react";
import { useCreateMaterialQuote, useEditMaterialQuote } from "../../../../apiList/Quote Api/QuoteGenerator Api/quoteGenerateApi";
import { toast } from "../../../../utils/toast";
import { useParams } from "react-router-dom";
import type { AvailableProjetType } from "../../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useGetProjects } from "../../../../apiList/projectApi";
import { Button } from "../../../../components/ui/Button";
import FurnitureForm from "./FurnitureForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
import QuoteGenerateList from "../QuoteGenerateList";
import { useGetSingleLabourCost } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";


type CoreMaterialRow = {
    itemName: string;
    plywoodNos: { quantity: number; thickness: number };
    laminateNos: { quantity: number; thickness: number };
    carpenters: number;
    days: number;
    profitOnMaterial: number;
    profitOnLabour: number;
    rowTotal: number;
    remarks: string;
    imageUrl?: string;
    previewUrl?: string;
};

type SimpleItemRow = {
    itemName: string;
    description: string;
    quantity: number;
    cost: number;
    rowTotal: number;
};

type FurnitureBlock = {
    furnitureName: string;
    coreMaterials: CoreMaterialRow[];
    fittingsAndAccessories: SimpleItemRow[];
    glues: SimpleItemRow[];
    nonBrandMaterials: SimpleItemRow[];
    totals: {
        core: number;
        fittings: number;
        glues: number;
        nbms: number;
        furnitureTotal: number;
    };
};




const QuoteGenerateMain = () => {

    const { organizationId } = useParams() as { organizationId: string }
    const { data: projectData } = useGetProjects(organizationId);
        let { data: labourCost = 0 } = useGetSingleLabourCost(organizationId!);
    
    const projects: AvailableProjetType[] = useMemo(
        () =>
            projectData?.map((p: any) => ({
                _id: p._id,
                projectName: p.projectName,
            })) || [],
        [projectData]
    );

    const [filters, setFilters] = useState({
        projectId: "",
        projectName: "",
    });

    const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [tempFurnitureName, setTempFurnitureName] = useState("");
    const [editingId, setIsEditingId] = useState<string | null>(null)

    const [quoteType, setQuoteType] = useState<"single" | "residential" | null>(null)
    const [editQuoteNo, setEditQuoteNo] = useState<string | null>(null)

    const { mutateAsync: createQuote, isPending } = useCreateMaterialQuote();
    const { mutateAsync: editQuote, isPending: editPending } = useEditMaterialQuote();

    const handleQuoteType = (type: "single" | "residential" | null) => {
        setQuoteType(type)
    }

    const handleQuoteName = () => {
        if (quoteType === "single") {
            return "Single Quote"
        }
        else if (quoteType === "residential") {
            return "Residential Quote"
        }
        return ""
    }

    useEffect(() => {
        
        if (quoteType === "single" && !editingId) {
            setFurnitures([])
            addFurniture("Common Category")
        }
        else if (quoteType === "residential" && !editingId) {
            setFurnitures([])
            setModalOpen(true)
        }
    }, [quoteType])

    const addFurniture = (furnitureName: string) => {
        setFurnitures(prev => [
            ...prev,
            {
                furnitureName,
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

    const emptyCoreMaterial = (): CoreMaterialRow => ({
        itemName: "",
        plywoodNos: { quantity: 0, thickness: 0 },
        laminateNos: { quantity: 0, thickness: 0 },
        carpenters: 0,
        days: 0,
        profitOnMaterial: 0,
        profitOnLabour: 0,
        rowTotal: 0,
        remarks: "",
    });

    const emptySimpleItem = (): SimpleItemRow => ({
        itemName: "",
        description: "",
        quantity: 0,
        cost: 0,
        rowTotal: 0,
    });



    const grandTotal = furnitures?.reduce((sum, f) => sum + f.totals.furnitureTotal, 0);
    const handleSubmit = async () => {
        try {


            if (!filters.projectId) {
                toast({ title: "Error", description: "Please select a project", variant: "destructive" });
                return;
            }

            const formData = new FormData();

            formData.append("furnitures", JSON.stringify(
                furnitures.map((f) => {
                    return {
                        furnitureName: f.furnitureName,
                        coreMaterials: f.coreMaterials.map(cm => {
                            if (Object.values(cm).some(value => Boolean(value))) {
                                const { imageUrl, previewUrl, ...rest } = cm;
                                return rest;
                            }
                        }),
                        fittingsAndAccessories: f.fittingsAndAccessories,
                        glues: f.glues,
                        nonBrandMaterials: f.nonBrandMaterials,
                        coreMaterialsTotal: f.totals.core,
                        fittingsAndAccessoriesTotal: f.totals.fittings,
                        gluesTotal: f.totals.glues,
                        nonBrandMaterialsTotal: f.totals.nbms,
                        furnitureTotal: f.totals.furnitureTotal,
                    };
                })
            ));

            furnitures.forEach((f, fIdx) => {
                f.coreMaterials.forEach((cm, cmIdx) => {
                    if (cm.imageUrl) {
                        formData.append(`images[${fIdx}][${cmIdx}]`, cm.imageUrl);
                    }
                });
            });

            formData.append("grandTotal", grandTotal.toString());
            // formData.append("quoteNo", `Q-${Date.now()}`); // optional
            formData.append("notes", "Generated"); // optional

            await createQuote({ organizationId, projectId: filters.projectId, formData });

            toast({ title: "Success", description: "Created Successfully, Visit in Quote Generator Section" });
            setFurnitures([])
            setQuoteType(null)

        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to generate the items", variant: "destructive" });
        }
    };

    const handleEditSubmit = async () => {
        try {


            if (!filters.projectId) {
                toast({ title: "Error", description: "Please select a project", variant: "destructive" });
                return;
            }

            const payload = {
                furnitures: furnitures.map((f) => ({
                    furnitureName: f.furnitureName,
                    coreMaterials: f.coreMaterials.map((cm) => {
                        const {
                            previewUrl, // ignore
                            ...rest
                        } = cm;
                        return {
                            ...rest,
                            imageUrl: cm.imageUrl || null, // preserve uploaded image
                        };
                    }),
                    fittingsAndAccessories: f.fittingsAndAccessories,
                    glues: f.glues,
                    nonBrandMaterials: f.nonBrandMaterials,
                    coreMaterialsTotal: f.totals.core,
                    fittingsAndAccessoriesTotal: f.totals.fittings,
                    gluesTotal: f.totals.glues,
                    nonBrandMaterialsTotal: f.totals.nbms,
                    furnitureTotal: f.totals.furnitureTotal,
                })),
                grandTotal,
                notes: "Updated via frontend",
                quoteNo: editQuoteNo
            };


            if (editingId) {
                await editQuote({
                    organizationId,
                    projectId: filters.projectId,
                    formData: payload,
                    id: editingId,
                });

                toast({ title: "Updated!", description: "Quote edited successfully." });
                setFurnitures([])
                setQuoteType(null)
                setIsEditingId(null);
            }
        }
        catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to Update the Quote", variant: "destructive" });
        }
    };



    // console.log("labor cost", labourCost)

    return (
        <div className={`h-full mx-auto max-h-full ${editingId ? "overflow-y-auto" : ""} `}>


            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 border-b-1 border-[#818283]">
                <div >
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file mr-3 text-blue-600" />
                        Internal Quote Entry
                    </h1>
                   
                    {furnitures?.length > 0 &&  
                        <p className="ml-[30px] mt-[5px] block text-[15px] text-gray-800">
                           Single Labour cost:  <span className="text-black font-semibold">₹{labourCost}</span>
                            </p>}
                </div>



                <div className="flex gap-6 items-center ">

                    <div>
                        <label className="block text-sm font-medium">Select QuoteType</label>

                        <Select onValueChange={(val: any) => handleQuoteType(val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Quote" selectedValue={quoteType || ""} />
                            </SelectTrigger>
                            <SelectContent>
                                {["single", "residential"].map((option) => (
                                    <SelectItem key={option} value={option.toString()}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Select Project *</label>
                        <select
                            value={filters.projectId}
                            onChange={(e) => {
                                const sel = projects.find((p) => p._id === e.target.value);
                                if (sel) {
                                    setFilters({ projectId: sel._id, projectName: sel.projectName });
                                }
                            }}
                            className=" px-2 py-2 rounded-xl border border-blue-200 focus:border-blue-200 active:border-blue-200"
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.projectName}
                                </option>
                            ))}
                        </select>
                    </div>

                   {furnitures.length> 0 &&  <div className="text-right flex gap-2 items-center">
                        <div className="text-xs text-gray-600 uppercase tracking-widest">Grand Total</div>
                        <div className="text-xl font-semibold text-green-600">₹{grandTotal.toLocaleString("en-IN")}</div>
                    </div>
}

                 <Button className="flex items-center" onClick={() => {
                        setModalOpen(true)
                        // setQuoteType("single")
                    }}><i className="fas fa-add mr-1"> </i> Product</Button>
                </div>


            </header>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40 backdrop-blur-sm transition">
                    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md relative animate-scaleIn">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Product</h3>

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


            {/* {furnitures.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white  rounded-lg">
                        <i className="fas fa-couch text-5xl text-blue-400 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">No Products Created</h3>
                        <p className="text-sm text-gray-500">
                            Click the <strong>+ Product</strong>  to create the product<br />
                        </p>

                        <Button
                            onClick={() => setModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 flex items-center"
                        >
                            <i className="fas fa-add !mr-2"> </i>
                            Product
                        </Button>
                    </div>
                )} */}

            {furnitures.length > 0 && <section className="shadow overflow-y-auto max-h-[86%]">
               {!editingId &&  <h1 className="text-2xl text-gray-500">
                    {handleQuoteName()}
                </h1>}
                {furnitures.map((furniture, index) => (
                    <FurnitureForm
                        key={index}
                        index={index}
                        labourCost={labourCost}
                        data={furniture}
                        updateFurniture={(updated) => {
                            const updatedArr = [...furnitures];
                            updatedArr[index] = updated;
                            setFurnitures(updatedArr);
                        }}
                        removeFurniture={() => handleRemoveFurniture(index)}
                    />
                ))}
            </section>}


            {furnitures.length !== 0 && <div className="mt-1 text-right flex gap-2 justify-end">
                <Button
                    variant="primary"
                    isLoading={isPending || editPending}
                    onClick={editingId ? handleEditSubmit : handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded"
                >
                    Save Quote
                </Button>


                {!editingId && <Button
                    variant="secondary"
                    onClick={() => {
                       
                        setFurnitures([])
                        setQuoteType(null)

                    }}
                    className=""
                >
                    Cancel
                </Button>}

                {editingId && <Button
                    variant="secondary"
                    onClick={() => {
                        setIsEditingId(null)
                        setFurnitures([])
                        setQuoteType(null)
                        setEditQuoteNo(null)
                    }}
                    className=""
                >
                    Cancel
                </Button>}
            </div>}

            {(!editingId && furnitures?.length === 0) && <section className="my-4">

                {/* <h1 className="text-2xl text-gray-700  font-semibold">Quote List</h1> */}
                <QuoteGenerateList setEditQuoteNo={setEditQuoteNo} setIsEditingId={setIsEditingId} setFurnitures={setFurnitures} setQuoteType={setQuoteType}
                    setFiltersMain={setFilters} />
            </section>}
        </div>
    );
};

export default QuoteGenerateMain;
