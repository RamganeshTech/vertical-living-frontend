// import { useEffect, useMemo, useState } from "react";
// import { useCreateMaterialQuote, useEditMaterialQuote } from "../../../../apiList/Quote Api/Internal_Quote_Api/internalquoteApi";
// import { toast } from "../../../../utils/toast";
// import { Outlet, useNavigate, useParams } from "react-router-dom";
// import type { AvailableProjetType } from "../../../Department Pages/Logistics Pages/LogisticsShipmentForm";
// import { useGetProjects } from "../../../../apiList/projectApi";
// import { Button } from "../../../../components/ui/Button";
// import FurnitureForm from "./FurnitureForm";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
// import QuoteGenerateList from "../QuoteGenerateList";
// import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
// import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
// import StageGuide from "../../../../shared/StageGuide";
// // import GlassPartitionTemplate from "../../WorkData_Page/GlassPartitionTemplate";
// // import { Label } from "../../../../components/ui/Label";
// // import SearchSelectNew from "../../../../components/ui/SearchSelectNew";


// type CoreMaterialRow = {
//     itemName: string;
//     plywoodNos: { quantity: number; thickness: number };
//     laminateNos: { quantity: number; thickness: number };
//     carpenters: number;
//     days: number;
//     profitOnMaterial: number;
//     profitOnLabour: number;
//     rowTotal: number;
//     remarks: string;
//     imageUrl?: string;
//     newImageFile?: string;
//     previewUrl?: string;
// };

// type SimpleItemRow = {
//     itemName: string;
//     description: string;
//     quantity: number;
//     cost: number;
//     rowTotal: number;
// };

// type FurnitureBlock = {
//     furnitureName: string;
//     coreMaterials: CoreMaterialRow[];
//     fittingsAndAccessories: SimpleItemRow[];
//     glues: SimpleItemRow[];
//     nonBrandMaterials: SimpleItemRow[];
//     totals: {
//         core: number;
//         fittings: number;
//         glues: number;
//         nbms: number;
//         furnitureTotal: number;
//     };
// };



// export const filterValidSimpleRows = (rows: SimpleItemRow[]) => {
//     return rows.filter(row =>
//         Boolean(row.itemName?.trim()) || Boolean(row.description?.trim())
//     );
// };


// const InternalQuoteEntryMain = () => {


//     const navigate = useNavigate()
//     const { organizationId } = useParams() as { organizationId: string }
//     const { data: projectData } = useGetProjects(organizationId);


//     const [selectedLabourCategory, setSelectedLabourCategory] = useState({
//         categoryId: "",
//         categoryName: ""
//     });

//     let { data: labourCost = 0 } = useGetSingleLabourCost({ organizationId, categoryId: selectedLabourCategory.categoryId });

//     let { data: allLabourCategory = [] } = useGetLabourRateConfigCategories(organizationId);

//     // 2. AUTO-SELECT EFFECT: Set the first category as default once data arrives
//     useEffect(() => {
//         if (allLabourCategory && allLabourCategory?.length > 0 && !selectedLabourCategory.categoryId) {
//             const firstCategory = allLabourCategory[0];
//             setSelectedLabourCategory({
//                 categoryId: firstCategory._id,
//                 categoryName: firstCategory.name
//             });
//         }
//     }, [allLabourCategory]); // Runs when the list is fetched



//     // const allLabourCategoryOptions = useMemo(() => {
//     //     return (allLabourCategory || [])?.map((labour: any) => ({
//     //         value: labour._id,
//     //         label: labour.name,
//     //     }));
//     // }, [allLabourCategory]);


//     // 3. Effect for Auto-Selection
//     // useEffect(() => {
//     //     // Only run this if we have options and nothing is currently selected
//     //     if (allLabourCategoryOptions.length > 0 && !selectedLabourCategory.categoryId) {
//     //         const firstCategory = allLabourCategoryOptions[0];

//     //         setSelectedLabourCategory({
//     //             categoryId: firstCategory.value, // The _id
//     //             categoryName: firstCategory.label // The name
//     //         });
//     //     }
//     // }, [allLabourCategoryOptions, selectedLabourCategory.categoryId]);

//     const { role, permission } = useAuthCheck();
//     // const canList = role === "owner" || permission?.internalquote?.list;
//     const canCreate = role === "owner" || permission?.internalquote?.create;
//     // const canDelete = role === "owner" || permission?.internalquote?.delete;
//     const canEdit = role === "owner" || permission?.internalquote?.edit;


//     const projects: AvailableProjetType[] = useMemo(
//         () =>
//             projectData?.map((p: any) => ({
//                 _id: p._id,
//                 projectName: p.projectName,
//             })) || [],
//         [projectData]
//     );

//     const [filters, setFilters] = useState({
//         projectId: "",
//         projectName: "",
//     });

//     const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [tempFurnitureName, setTempFurnitureName] = useState("");
//     const [editingId, setIsEditingId] = useState<string | null>(null)

//     const [quoteType, setQuoteType] = useState<"single" | "residential" | null>(null)
//     const [editQuoteNo, setEditQuoteNo] = useState<string | null>(null)

//     const { mutateAsync: createQuote, isPending } = useCreateMaterialQuote();
//     const { mutateAsync: editQuote, isPending: editPending } = useEditMaterialQuote();

//     const handleQuoteType = (type: "single" | "residential" | null) => {
//         setQuoteType(type)
//     }



//     const handleQuoteName = () => {
//         if (quoteType === "single") {
//             return "Single Quote"
//         }
//         else if (quoteType === "residential") {
//             return "Residential Quote"
//         }
//         return ""
//     }

//     useEffect(() => {

//         if (quoteType === "single" && !editingId) {
//             setFurnitures([])
//             addFurniture("Common Category")
//         }
//         else if (quoteType === "residential" && !editingId) {
//             setFurnitures([])
//             setModalOpen(true)
//         }
//     }, [quoteType])



//     console.log("furnitures", furnitures)

//     const addFurniture = (furnitureName: string) => {
//         setFurnitures(prev => [
//             ...prev,
//             {
//                 furnitureName,
//                 coreMaterials: [emptyCoreMaterial()],
//                 fittingsAndAccessories: [emptySimpleItem()],
//                 glues: [emptySimpleItem()],
//                 nonBrandMaterials: [emptySimpleItem()],
//                 totals: { core: 0, fittings: 0, glues: 0, nbms: 0, furnitureTotal: 0 },
//             }
//         ]);
//     };

//     // const handleLabourCategory = (selectedId: string | null) => {
//     //     const selectedCategory = allLabourCategoryOptions.find((s: any) => s.value === selectedId);

//     //     if (selectedCategory) {
//     //         setSelectedLabourCategory({
//     //             categoryId: selectedCategory.value, // This is the _id
//     //             categoryName: selectedCategory.label // This is the name
//     //         });
//     //     } else {
//     //         setSelectedLabourCategory({ categoryId: "", categoryName: "" });
//     //     }
//     // };

//     const handleRemoveFurniture = (indexToRemove: number) => {
//         setFurnitures((prev) => prev.filter((_, i) => i !== indexToRemove));
//     };

//     const emptyCoreMaterial = (): CoreMaterialRow => ({
//         itemName: "",
//         plywoodNos: { quantity: 0, thickness: 0 },
//         laminateNos: { quantity: 0, thickness: 0 },
//         carpenters: 0,
//         days: 0,
//         profitOnMaterial: 0,
//         profitOnLabour: 0,
//         rowTotal: 0,
//         remarks: "",
//     });

//     const emptySimpleItem = (): SimpleItemRow => ({
//         itemName: "",
//         description: "",
//         quantity: 0,
//         cost: 0,
//         rowTotal: 0,
//     });



//     const grandTotal = furnitures?.reduce((sum, f) => sum + f.totals.furnitureTotal, 0);

//     const handleSubmit = async () => {
//         try {


//             if (!filters.projectId) {
//                 toast({ title: "Error", description: "Please select a project", variant: "destructive" });
//                 return;
//             }

//             const formData = new FormData();

//             formData.append("furnitures", JSON.stringify(
//                 furnitures.map((f) => {
//                     return {
//                         furnitureName: f.furnitureName,
//                         coreMaterials: f.coreMaterials.map(cm => {
//                             if (Object.values(cm).some(value => Boolean(value))) {
//                                 const { imageUrl, previewUrl, ...rest } = cm;
//                                 return rest;
//                             }
//                             return null;
//                         })
//                             .filter(Boolean),
//                         // fittingsAndAccessories: f.fittingsAndAccessories,
//                         // glues: f.glues,
//                         // nonBrandMaterials: f.nonBrandMaterials,
//                         fittingsAndAccessories: filterValidSimpleRows(f.fittingsAndAccessories),
//                         glues: filterValidSimpleRows(f.glues),
//                         nonBrandMaterials: filterValidSimpleRows(f.nonBrandMaterials),
//                         coreMaterialsTotal: f.totals.core,
//                         fittingsAndAccessoriesTotal: f.totals.fittings,
//                         gluesTotal: f.totals.glues,
//                         nonBrandMaterialsTotal: f.totals.nbms,
//                         furnitureTotal: f.totals.furnitureTotal,
//                     };
//                 })
//             ));

//             furnitures.forEach((f, fIdx) => {
//                 f.coreMaterials.forEach((cm, cmIdx) => {
//                     if (cm.imageUrl) {
//                         formData.append(`images[${fIdx}][${cmIdx}]`, cm.imageUrl);
//                     }
//                 });
//             });

//             formData.append("grandTotal", grandTotal.toString());
//             // formData.append("quoteNo", `Q-${Date.now()}`); // optional
//             formData.append("notes", "Generated"); // optional

//             await createQuote({ organizationId, projectId: filters.projectId, formData });

//             toast({ title: "Success", description: "Created Successfully, Visit in Quote Generator Section" });
//             setFurnitures([])
//             setQuoteType(null)

//         }
//         catch (error: any) {
//             toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to generate the items", variant: "destructive" });
//         }
//     };

//     const handleEditSubmit = async () => {
//         try {


//             if (!filters.projectId) {
//                 toast({ title: "Error", description: "Please select a project", variant: "destructive" });
//                 return;
//             }

//             const formData = new FormData();


//             // Prepare furnitures payload & attach new image files
//             const furnituresPayload = furnitures.map((f, fIndex) => {
//                 const coreMaterials = f.coreMaterials.map((cm, cmIndex) => {
//                     const { previewUrl, newImageFile, ...rest } = cm;

//                     // Attach new image file if present
//                     if (newImageFile) {
//                         // Field name must match backend: images[fIndex][cmIndex]
//                         formData.append(`images[${fIndex}][${cmIndex}]`, newImageFile);
//                     }

//                     return {
//                         ...rest,
//                         imageUrl: cm.imageUrl || null, // keep old image if no new file
//                     };
//                 });

//                 return {
//                     furnitureName: f.furnitureName,
//                     coreMaterials,
//                     fittingsAndAccessories: filterValidSimpleRows(f.fittingsAndAccessories),
//                     glues: filterValidSimpleRows(f.glues),
//                     nonBrandMaterials: filterValidSimpleRows(f.nonBrandMaterials),
//                     coreMaterialsTotal: f.totals.core,
//                     fittingsAndAccessoriesTotal: f.totals.fittings,
//                     gluesTotal: f.totals.glues,
//                     nonBrandMaterialsTotal: f.totals.nbms,
//                     furnitureTotal: f.totals.furnitureTotal,
//                 };
//             });

//             // Add other fields to FormData
//             formData.append("furnitures", JSON.stringify(furnituresPayload));
//             formData.append("grandTotal", grandTotal.toString());
//             formData.append("notes", "Updated via frontend");
//             if (editQuoteNo) formData.append("quoteNo", editQuoteNo);



//             // const payload = {
//             //     furnitures: furnitures.map((f) => ({
//             //         furnitureName: f.furnitureName,
//             //         coreMaterials: f.coreMaterials.map((cm) => {
//             //             const {
//             //                 previewUrl, // ignore
//             //                 ...rest
//             //             } = cm;
//             //             return {
//             //                 ...rest,
//             //                 imageUrl: cm.imageUrl || null, // preserve uploaded image
//             //             };
//             //         }),

//             //         fittingsAndAccessories: filterValidSimpleRows(f.fittingsAndAccessories),
//             //         glues: filterValidSimpleRows(f.glues),
//             //         nonBrandMaterials: filterValidSimpleRows(f.nonBrandMaterials),
//             //         coreMaterialsTotal: f.totals.core,
//             //         fittingsAndAccessoriesTotal: f.totals.fittings,
//             //         gluesTotal: f.totals.glues,
//             //         nonBrandMaterialsTotal: f.totals.nbms,
//             //         furnitureTotal: f.totals.furnitureTotal,
//             //     })),
//             //     grandTotal,
//             //     notes: "Updated via frontend",
//             //     quoteNo: editQuoteNo
//             // };


//             if (editingId) {
//                 await editQuote({
//                     organizationId,
//                     projectId: filters.projectId,
//                     // formData: payload,
//                     formData, // ✅ send FormData with only new files
//                     id: editingId,
//                 });

//                 toast({ title: "Updated!", description: "Quote edited successfully." });
//                 setFurnitures([])
//                 setQuoteType(null)
//                 setIsEditingId(null);
//             }
//         }
//         catch (error: any) {
//             toast({ title: "Error", description: error?.response?.data?.message || error?.message || "Failed to Update the Quote", variant: "destructive" });
//         }
//     };



//     const isChildRoute = location.pathname.includes("internalquotenew");

//     if (isChildRoute) return <Outlet />;


//     // console.log("labor cost", labourCost)

//     return (
//         <div className={`h-full mx-auto max-h-full ${editingId ? "overflow-y-auto" : ""} `}>


//             <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 border-b-1 border-[#818283]">
//                 <div >
//                     <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                         <i className="fas fa-file mr-3 text-blue-600" />
//                         Internal Quote Entry
//                     </h1>

//                     {furnitures?.length > 0 &&
//                         <p className="ml-[30px] mt-[5px] block text-[15px] text-gray-800">
//                             Single Labour cost:  <span className="text-black font-semibold">₹{labourCost}</span>
//                         </p>}
//                 </div>

//                 <div className="flex gap-6 items-center ">
//                     <div>
//                         <Button className="flex items-center" onClick={() => {
//                             navigate("internalquotenew")
//                             // setQuoteType("single")
//                         }}><i className="fas fa-new mr-1"> </i> New Version</Button>
//                     </div>





//                     {/* <div>
//                             <label className="block text-sm font-medium ">Select Work Category

//                             </label>

//                             <div className="space-y-2">
//                                 <Label className="text-gray-700 font-semibold flex items-center gap-2">
//                                     <i className="fas fa-user-check text-blue-600 text-xs"></i>
//                                     Select Salary Category
//                                 </Label>
//                                 <SearchSelectNew
//                                     options={allLabourCategoryOptions}
//                                     placeholder="Choose staff member"
//                                     searchPlaceholder="Search by name..."
//                                     value={selectedLabourCategory.categoryId}
//                                     onValueChange={handleLabourCategory}
//                                     searchBy="name"
//                                     displayFormat="detailed"
//                                     className="w-full"
//                                 />
//                             </div>
//                         </div> */}


//                     {canCreate && <div>
//                         <label className="block text-sm font-medium">Select QuoteType</label>

//                         <Select onValueChange={(val: any) => handleQuoteType(val)}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select Quote" selectedValue={quoteType || ""} />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {["single", "residential"].map((option) => (
//                                     <SelectItem key={option} value={option.toString()}>
//                                         {option}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>}


//                     {canCreate && <div>
//                         <label className="block text-sm font-medium">Select Project *</label>
//                         <select
//                             value={filters.projectId}
//                             onChange={(e) => {
//                                 const sel = projects.find((p) => p._id === e.target.value);
//                                 if (sel) {
//                                     setFilters({ projectId: sel._id, projectName: sel.projectName });
//                                 }
//                             }}
//                             className=" px-2 py-2 rounded-xl border border-blue-200 focus:border-blue-200 active:border-blue-200"
//                         >
//                             <option value="">Select a project</option>
//                             {projects.map((project) => (
//                                 <option key={project._id} value={project._id}>
//                                     {project.projectName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     }

//                     {furnitures.length > 0 && <div className="text-right flex gap-2 items-center">
//                         <div className="text-xs text-gray-600 uppercase tracking-widest">Grand Total</div>
//                         <div className="text-xl font-semibold text-green-600">₹{grandTotal.toLocaleString("en-IN")}</div>
//                     </div>
//                     }

//                     {canCreate && <Button className="flex items-center" onClick={() => {
//                         setModalOpen(true)
//                         // setQuoteType("single")
//                     }}><i className="fas fa-add mr-1"> </i> Create</Button>}


//                     <div className="w-full sm:w-auto flex justify-end sm:block">
//                         <StageGuide
//                             organizationId={organizationId!}
//                             stageName="materialquote"
//                         />
//                     </div>
//                 </div>


//             </header>

//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40 backdrop-blur-sm transition">
//                     <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md relative animate-scaleIn">
//                         <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Quote</h3>

//                         <input
//                             className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-400"
//                             placeholder="Enter Product Name"
//                             value={tempFurnitureName}
//                             autoFocus
//                             onChange={(e) => setTempFurnitureName(e.target.value)}
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     if (!tempFurnitureName.trim()) return;
//                                     addFurniture(tempFurnitureName);
//                                     setTempFurnitureName("");
//                                     setModalOpen(false);
//                                 }
//                             }}
//                         />

//                         <div className="flex justify-end gap-3 mt-4">
//                             <Button variant="secondary" onClick={() => setModalOpen(false)}>
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={() => {
//                                     if (!tempFurnitureName.trim()) return;
//                                     addFurniture(tempFurnitureName);
//                                     setTempFurnitureName("");
//                                     setModalOpen(false);
//                                 }}
//                             >
//                                 Create
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* s.dflskdjkl */}
//             {furnitures.length > 0 && <section className="shadow overflow-y-auto max-h-[86%]">
//                 {!editingId && <h1 className="text-2xl text-gray-500">
//                     {handleQuoteName()}
//                 </h1>}
//                 {furnitures.map((furniture, index) => (
//                     <FurnitureForm
//                         key={index}
//                         index={index}
//                         labourCost={labourCost}
//                         data={furniture}
//                         updateFurniture={(updated) => {
//                             const updatedArr = [...furnitures];
//                             updatedArr[index] = updated;
//                             setFurnitures(updatedArr);
//                         }}
//                         removeFurniture={() => handleRemoveFurniture(index)}
//                         isEditing={!!editingId}   // ✅ pass editing mode

//                     />
//                 ))}
//             </section>}


//             {furnitures.length !== 0 && <div className="mt-1 text-right flex gap-2 justify-end">
//                 {(canCreate || canEdit) && <Button
//                     variant="primary"
//                     isLoading={isPending || editPending}
//                     onClick={editingId ? handleEditSubmit : handleSubmit}
//                     className="px-6 py-2 bg-blue-600 text-white rounded"
//                 >
//                     Save Quote
//                 </Button>
//                 }

//                 {!editingId && (canCreate || canEdit) && <Button
//                     variant="secondary"
//                     onClick={() => {
//                         setFurnitures([])
//                         setQuoteType(null)
//                     }}
//                     className=""
//                 >
//                     Cancel
//                 </Button>}

//                 {editingId && <Button
//                     variant="secondary"
//                     onClick={() => {
//                         setIsEditingId(null)
//                         setFurnitures([])
//                         setQuoteType(null)
//                         setEditQuoteNo(null)
//                     }}
//                     className=""
//                 >
//                     Cancel
//                 </Button>}
//             </div>}

//             {(!editingId && furnitures?.length === 0) && <section className="my-4">

//                 {/* <h1 className="text-2xl text-gray-700  font-semibold">Quote List</h1> */}
//                 <QuoteGenerateList setEditQuoteNo={setEditQuoteNo} setIsEditingId={setIsEditingId} setFurnitures={setFurnitures} setQuoteType={setQuoteType}
//                     setFiltersMain={setFilters} />
//             </section>}
//         </div>
//     );
// };

// export default InternalQuoteEntryMain;






//  SECOND VERSION

import {   useState } from "react";
import { useCreateInternalMainQuote,
    //  useCreateMaterialQuote, useEditMaterialQuote
     } from "../../../../apiList/Quote Api/Internal_Quote_Api/internalquoteApi";
import { toast } from "../../../../utils/toast";
import { Outlet, useNavigate, useParams } from "react-router-dom";
// import type { AvailableProjetType } from "../../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useGetProjects } from "../../../../apiList/projectApi";
import { Button } from "../../../../components/ui/Button";
// import FurnitureForm from "./FurnitureForm";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
import QuoteGenerateList from "../QuoteGenerateList";
// import { useGetLabourRateConfigCategories, useGetSingleLabourCost } from "../../../../apiList/Quote Api/RateConfig Api/labourRateconfigApi";
import { useAuthCheck } from "../../../../Hooks/useAuthCheck";
import StageGuide from "../../../../shared/StageGuide";
import CreateQuoteModal from "./InternalQuote_New_Version/CreateQuoteModal";
// import GlassPartitionTemplate from "../../WorkData_Page/GlassPartitionTemplate";
// import { Label } from "../../../../components/ui/Label";
// import SearchSelectNew from "../../../../components/ui/SearchSelectNew";


// type CoreMaterialRow = {
//     itemName: string;
//     plywoodNos: { quantity: number; thickness: number };
//     laminateNos: { quantity: number; thickness: number };
//     carpenters: number;
//     days: number;
//     profitOnMaterial: number;
//     profitOnLabour: number;
//     rowTotal: number;
//     remarks: string;
//     imageUrl?: string;
//     newImageFile?: string;
//     previewUrl?: string;
// };

type SimpleItemRow = {
    itemName: string;
    description: string;
    quantity: number;
    cost: number;
    rowTotal: number;
};

// type FurnitureBlock = {
//     furnitureName: string;
//     coreMaterials: CoreMaterialRow[];
//     fittingsAndAccessories: SimpleItemRow[];
//     glues: SimpleItemRow[];
//     nonBrandMaterials: SimpleItemRow[];
//     totals: {
//         core: number;
//         fittings: number;
//         glues: number;
//         nbms: number;
//         furnitureTotal: number;
//     };
// };



export const filterValidSimpleRows = (rows: SimpleItemRow[]) => {
    return rows.filter(row =>
        Boolean(row.itemName?.trim()) || Boolean(row.description?.trim())
    );
};


const InternalQuoteEntryMain = () => {


    const navigate = useNavigate()
    const { organizationId } = useParams() as { organizationId: string }
    const { data: projectData = [] } = useGetProjects(organizationId);


    const createMutation = useCreateInternalMainQuote();


    const [formData, setFormData] = useState<{
        mainQuoteName: string;

        quoteType: string;
        quoteCategory: string;
        projectId: string | null;
    }>({
        mainQuoteName: '',
        quoteCategory: 'residential',
        quoteType: "basic",
        projectId: ''
    });





    // const allLabourCategoryOptions = useMemo(() => {
    //     return (allLabourCategory || [])?.map((labour: any) => ({
    //         value: labour._id,
    //         label: labour.name,
    //     }));
    // }, [allLabourCategory]);


    // 3. Effect for Auto-Selection
    // useEffect(() => {
    //     // Only run this if we have options and nothing is currently selected
    //     if (allLabourCategoryOptions.length > 0 && !selectedLabourCategory.categoryId) {
    //         const firstCategory = allLabourCategoryOptions[0];

    //         setSelectedLabourCategory({
    //             categoryId: firstCategory.value, // The _id
    //             categoryName: firstCategory.label // The name
    //         });
    //     }
    // }, [allLabourCategoryOptions, selectedLabourCategory.categoryId]);

    const { role, permission } = useAuthCheck();
    // const canList = role === "owner" || permission?.internalquote?.list;
    const canCreate = role === "owner" || permission?.internalquote?.create;
    // const canDelete = role === "owner" || permission?.internalquote?.delete;
    // const canEdit = role === "owner" || permission?.internalquote?.edit;


    // const projects: AvailableProjetType[] = useMemo(
    //     () =>
    //         projectData?.map((p: any) => ({
    //             _id: p._id,
    //             projectName: p.projectName,
    //         })) || [],
    //     [projectData]
    // );

    // const [filters, setFilters] = useState({
    //     projectId: "",
    //     projectName: "",
    // });

    // const [furnitures, setFurnitures] = useState<FurnitureBlock[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    // const [tempFurnitureName, setTempFurnitureName] = useState("");
    // const [editingId, setIsEditingId] = useState<string | null>(null)

    // const [quoteType, setQuoteType] = useState<"single" | "residential" | null>(null)
    // const [editQuoteNo, setEditQuoteNo] = useState<string | null>(null)

    // const handleQuoteType = (type: "single" | "residential" | null) => {
    //     setQuoteType(type)
    // }


    const handleSubmit = async () => {
        if (!formData.mainQuoteName || !formData.projectId || !formData.quoteType) {
            return toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
        }

        try {
            // if (isEditing && selectedQuoteId) {
            //     await updateMutation.mutateAsync({
            //         organizationId: organizationId, // Get from context/params
            //         projectId: formData.projectId,
            //         id: selectedQuoteId,
            //         mainQuoteName: formData.mainQuoteName, quoteCategory: formData.quoteCategory
            //     });
            //     toast({ title: "Success", description: "Quote updated successfully" });
            // } else {
                const response = await createMutation.mutateAsync({
                    organizationId: organizationId,
                    projectId: formData.projectId,
                    mainQuoteName: formData.mainQuoteName,
                    quoteType: formData.quoteType,
                    quoteCategory: formData.quoteCategory
                });

                console.log("response", response)
                // Navigate using the data._id from backend response
                navigate(`single/${response._id}/${response.quoteType}`);
            // }
            setModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const resetForm = () => {
        setFormData({ mainQuoteName: '', quoteCategory: '', quoteType: "", projectId: '' });
        
    };


    // const handleLabourCategory = (selectedId: string | null) => {
    //     const selectedCategory = allLabourCategoryOptions.find((s: any) => s.value === selectedId);

    //     if (selectedCategory) {
    //         setSelectedLabourCategory({
    //             categoryId: selectedCategory.value, // This is the _id
    //             categoryName: selectedCategory.label // This is the name
    //         });
    //     } else {
    //         setSelectedLabourCategory({ categoryId: "", categoryName: "" });
    //     }
    // };


    const isChildRoute = location.pathname.includes("internalquotenew") || location.pathname.includes("single");

    if (isChildRoute) return <Outlet />;


    // console.log("labor cost", labourCost)

    return (
        <div className={`h-full mx-auto max-h-full overflow-hidden`}>


            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 border-b-1 border-[#818283]">
                <div >
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file mr-3 text-blue-600" />
                        Internal Quote Entry
                    </h1>

                  
                </div>

                <div className="flex gap-6 items-center ">
                  
                   

                    {canCreate && <Button className="flex items-center" onClick={() => {
                        setModalOpen(true)
                        // setQuoteType("single")
                    }}><i className="fas fa-add mr-1"> </i> Create</Button>}


                    <div className="w-full sm:w-auto flex justify-end sm:block">
                        <StageGuide
                            organizationId={organizationId!}
                            stageName="materialquote"
                        />
                    </div>
                </div>


            </header>



            {/* Modal for Create/Update */}
            {isModalOpen && (
                <CreateQuoteModal
                    isEditing={false}
                    formData={formData}
                    projectsData={projectData}
                    setModalOpen={setModalOpen}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                />

            )}



            <section className="my-2 h-[100%] ">

                {/* <h1 className="text-2xl text-gray-700  font-semibold">Quote List</h1> */}
                <QuoteGenerateList
                //  setEditQuoteNo={setEditQuoteNo} 
                // setIsEditingId={setIsEditingId}
                //  setFurnitures={setFurnitures} 
                //  setQuoteType={setQuoteType}
                //     setFiltersMain={setFilters}
                     />
            </section>
        </div>
    );
};

export default InternalQuoteEntryMain;