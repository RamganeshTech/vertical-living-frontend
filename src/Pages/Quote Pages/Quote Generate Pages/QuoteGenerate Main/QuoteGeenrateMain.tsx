// import React from 'react'
// import { useGetMaterialItems } from '../../../../apiList/Quote Api/QuoteGenerator Api/quoteGenerateApi';

// const QuoteGeenrateMain = () => {




// const { data: plywoodMaterials, isLoading } = useGetMaterialItems(organizationId, "68c2644157640aa271383f50");


//   return (
//     <div>

// <select onChange={(e) => setSelectedMaterialId(e.target.value)}>
//   {plywoodMaterials?.map((material:any) => (
//     <option key={material._id} value={material._id}>
//       {material.brandName} - {material.thickness} ({material.pricePerSheet} ₹/sheet)
//     </option>
//   ))}
// </select></div>
//   )
// }

// export default QuoteGeenrateMain


import  { useEffect, useMemo, useState } from "react";
import { useCreateMaterialQuote } from "../../../../apiList/Quote Api/QuoteGenerator Api/quoteGenerateApi";
import { toast } from "../../../../utils/toast";
import { useParams } from "react-router-dom";
import type { AvailableProjetType } from "../../../Department Pages/Logistics Pages/LogisticsShipmentForm";
import { useGetProjects } from "../../../../apiList/projectApi";
import { Button } from "../../../../components/ui/Button";

// // Replace with your actual prices or fetch from backend later
// const RATES = {
//     plywood: 1800,
//     laminate: 1200,
//     labour: 1200,
// };

// interface QuoteRow {
//     imageFile?: File;
//     previewUrl?: string;
//     itemName: string;
//     plywoodNos: number;
//     laminateNos: number;
//     carpenters: number;
//     days: number;
//     profitOnMaterial: number;
//     profitOnLabour: number;
//     remarks: string;
//     rowTotal: number;
// }

// const QuoteGenerateMain = () => {
//     const { organizationId } = useParams() as { organizationId: string; }
//     const [rows, setRows] = useState<QuoteRow[]>([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const { data } = useGetProjects(organizationId!)


//     const [filters, setFilters] = useState({
//         status: "",
//         projectId: "",
//         projectName: "",
//         scheduledDate: "",
//     });

//     const projects = data?.map((project: AvailableProjetType) => ({ _id: project._id, projectName: project.projectName }))


//     const { mutate: createQuote } = useCreateMaterialQuote();

//     useEffect(() => {
//         setRows([
//             {
//                 itemName: "",
//                 plywoodNos: 0,
//                 laminateNos: 0,
//                 carpenters: 0,
//                 days: 0,
//                 profitOnMaterial: 15,
//                 profitOnLabour: 10,
//                 remarks: "",
//                 rowTotal: 0,
//             },
//         ]);
//     }, []);

//     const handleChange = (index: number, key: keyof QuoteRow, value: any) => {
//         const updated: any = [...rows];

//         if (key === "imageFile") {
//             updated[index].imageFile = value;
//             updated[index].previewUrl = URL.createObjectURL(value);
//         } else {
//             updated[index][key] = value;
//         }

//         updated[index].rowTotal = calculateRowTotal(updated[index]);
//         setRows(updated);

//         if (index === rows.length - 1 && isRowFilled(updated[index])) {
//             setRows((prev) => [...prev, emptyRow()]);
//         }
//     };

//     const emptyRow = (): QuoteRow => ({
//         itemName: "",
//         plywoodNos: 0,
//         laminateNos: 0,
//         carpenters: 0,
//         days: 0,
//         profitOnMaterial: 15,
//         profitOnLabour: 10,
//         remarks: "",
//         rowTotal: 0,
//     });

//     const isRowFilled = (row: QuoteRow): boolean =>
//         row.itemName.trim() !== "" || row.plywoodNos > 0 || row.laminateNos > 0 || row.carpenters > 0 || row.days > 0;

//     const calculateRowTotal = (row: QuoteRow): number => {
//         const materialCost = row.plywoodNos * RATES.plywood + row.laminateNos * RATES.laminate;
//         const labourCost = row.carpenters * row.days * RATES.labour;

//         const finalMaterial = materialCost * (1 + row.profitOnMaterial / 100);
//         const finalLabour = labourCost * (1 + row.profitOnLabour / 100);

//         return Math.round(finalMaterial + finalLabour);
//     };

//     const grandTotal = rows.reduce((acc, row) => acc + (row.rowTotal || 0), 0);

//     const handleSubmit = () => {
//         setIsSubmitting(true);

//         const formData = new FormData();

//         const cleanRows = rows.filter(row => isRowFilled(row));

//         cleanRows.forEach((row, index) => {
//             if (row.imageFile) {
//                 formData.append(`images[${index}]`, row.imageFile);
//             }
//         });

//         formData.append("categorySections", JSON.stringify(cleanRows));
//         formData.append("plywoodTotal", String(grandTotal));
//         formData.append("fittings", JSON.stringify([])); // for now
//         formData.append("glues", JSON.stringify([])); // for now
//         formData.append("nonBrandedMaterials", JSON.stringify([])); // for now
//         formData.append("fittingsTotal", "0");
//         formData.append("glueTotal", "0");
//         formData.append("nbmTotal", "0");
//         formData.append("grandTotal", String(grandTotal));

//         createQuote(
//             { organizationId, projectId: filters.projectId, formData },
//             {
//                 onSuccess: () => {
//                     toast({ title: "Success", description: "Quote created successfully ✅" });
//                     // Reset state after success
//                     setRows([emptyRow()]);
//                     setIsSubmitting(false);
//                 },
//                 onError: (err: any) => {
//                     toast({
//                         title: "Failed to create quote ❌",
//                         description: err.message || "Something went wrong",
//                         variant: "destructive",
//                     });
//                     setIsSubmitting(false);
//                 },
//             }
//         );
//     };

//     return (
//         <div className="p-6 max-w-screen-xl mx-auto bg-white shadow-md rounded-md">
//             <h2 className="text-2xl font-semibold mb-4">Generate Plywood Quote</h2>

//             {/* Rate info */}
//             <p className="text-gray-600 mb-3">
//                 Rates: Plywood ₹{RATES.plywood} • Laminate ₹{RATES.laminate} • Labour ₹{RATES.labour}
//             </p>



//             <div>
//                 <label className="block text-md font-medium text-gray-700 mb-2">
//                     Select Project
//                 </label>

//                 <select
//                     value={filters?.projectId || ''}
//                     onChange={(e) => {
//                         const selectedProject = projects?.find(
//                             (p: AvailableProjetType) => p._id === e.target.value
//                         );
//                         if (selectedProject) {
//                             setFilters(prev => ({
//                                 ...prev,
//                                 projectId: selectedProject._id,
//                                 projectName: selectedProject.projectName, // keep name too
//                             }));
//                         }
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                     {/* <option value="">All Projects</option> */}
//                     {projects?.map((project: AvailableProjetType) => (
//                         <option key={project._id} value={project._id}>{project.projectName}</option>
//                     ))}
//                 </select>
//             </div>

//             <div className="overflow-x-auto border rounded-md">
//                 <table className="min-w-full text-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="p-2">Image</th>
//                             <th className="p-2">Item Name</th>
//                             <th className="p-2">Plywood</th>
//                             <th className="p-2">Laminate</th>
//                             <th className="p-2">Carpenters</th>
//                             <th className="p-2">Days</th>
//                             <th className="p-2">Mat %</th>
//                             <th className="p-2">Lab %</th>
//                             <th className="p-2">Remarks</th>
//                             <th className="p-2 text-right">Row Total</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {rows.map((row, index) => (
//                             <tr key={index} className="border-t bg-white">
//                                 <td className="p-2">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => handleChange(index, "imageFile", e.target.files?.[0])}
//                                     />
//                                     {row.previewUrl && (
//                                         <img src={row.previewUrl} alt="Preview" className="h-10 mt-1" />
//                                     )}
//                                 </td>
//                                 <td className="p-2">
//                                     <input
//                                         type="text"
//                                         className="w-full border px-2 py-1"
//                                         value={row.itemName}
//                                         onChange={(e) => handleChange(index, "itemName", e.target.value)}
//                                     />
//                                 </td>
//                                 {["plywoodNos", "laminateNos", "carpenters", "days", "profitOnMaterial", "profitOnLabour"].map((key) => (
//                                     <td className="p-2" key={key}>
//                                         <input
//                                             type="number"
//                                             className="w-20 border px-2 py-1"
//                                             value={Number(row[key as keyof QuoteRow])}
//                                             onChange={(e) => handleChange(index, key as keyof QuoteRow, Number(e.target.value))}
//                                         />
//                                     </td>
//                                 ))}
//                                 <td className="p-2">
//                                     <input
//                                         type="text"
//                                         className="w-full border px-2 py-1"
//                                         value={row.remarks}
//                                         onChange={(e) => handleChange(index, "remarks", e.target.value)}
//                                     />
//                                 </td>
//                                 <td className="p-2 text-right">₹{row.rowTotal}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Footer */}
//             <div className="mt-6 flex justify-between items-center">
//                 <div className="text-lg font-medium">
//                     Grand Total: ₹{grandTotal.toLocaleString("en-IN")}
//                 </div>
//                 <button
//                     className="bg-blue-600 text-white px-6 py-2 rounded"
//                     disabled={isSubmitting}
//                     onClick={handleSubmit}
//                 >
//                     {isSubmitting ? "Saving..." : "💾 Save Quote"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default QuoteGenerateMain;





// 🛠 Default Rate Constants (can be fetched from backend later)
const RATES = {
    plywood: 1800,
    laminate: 1200,
    labour: 1200,
};

// 🧱 Interfaces
interface QuoteRow {
    imageFile?: File;
    previewUrl?: string;
    itemName: string;
    plywoodNos: number;
    laminateNos: number;
    carpenters: number;
    days: number;
    profitOnMaterial: number;
    profitOnLabour: number;
    remarks: string;
    rowTotal: number;
}

interface SimpleItemRow {
    itemName: string;
    description: string;
    quantity: number;
    cost: number;
    rowTotal: number;
}

const QuoteGenerateMain = () => {

    const { organizationId } = useParams() as { organizationId: string }
    const { data: projectData } = useGetProjects(organizationId);
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

    const [plyRows, setPlyRows] = useState<QuoteRow[]>([]);
    const [fittings, setFittings] = useState<SimpleItemRow[]>([]);
    const [glues, setGlues] = useState<SimpleItemRow[]>([]);
    const [nbms, setNbms] = useState<SimpleItemRow[]>([]);

    const { mutateAsync: createQuote, isPending } = useCreateMaterialQuote();

    // Initial row
    useEffect(() => {
        setPlyRows([emptyPlyRow()]);
        setFittings([emptySimpleRow()]);
        setGlues([emptySimpleRow()]);
        setNbms([emptySimpleRow()]);
    }, []);

    const emptyPlyRow = (): QuoteRow => ({
        itemName: "",
        plywoodNos: 0,
        laminateNos: 0,
        carpenters: 0,
        days: 0,
        profitOnMaterial: 15,
        profitOnLabour: 10,
        remarks: "",
        rowTotal: 0,
    });

    const emptySimpleRow = (): SimpleItemRow => ({
        itemName: "",
        description: "",
        quantity: 0,
        cost: 0,
        rowTotal: 0,
    });

    const handlePlyChange = (index: number, key: keyof QuoteRow, value: any) => {
        const updated: any = [...plyRows];

        if (key === "imageFile") {
            updated[index].imageFile = value;
            updated[index].previewUrl = URL.createObjectURL(value);
        } else {
            updated[index][key] = value;
        }

        updated[index].rowTotal = calcPlyRowTotal(updated[index]);
        setPlyRows(updated);

        // Auto-add next
        if (index === updated.length - 1 && updated[index].itemName.trim()) {
            setPlyRows([...updated, emptyPlyRow()]);
        }

        // Auto-remove last if previous name cleared
        const prev = updated[index - 1];
        if (
            index === updated.length - 1 &&
            !prev?.itemName?.trim() &&
            updated.length > 1
        ) {
            updated.pop();
            setPlyRows(updated);
        }
    };

    const calcPlyRowTotal = (row: QuoteRow) => {
        const mat =
            row.plywoodNos * RATES.plywood + row.laminateNos * RATES.laminate;
        const labour = row.carpenters * row.days * RATES.labour;
        return Math.round(
            mat * (1 + row.profitOnMaterial / 100) +
            labour * (1 + row.profitOnLabour / 100)
        );
    };

    const handleSimpleChange = (
        kind: "fittings" | "glues" | "nbms",
        index: number,
        key: keyof SimpleItemRow,
        value: any
    ) => {
        let section = kind === "fittings" ? fittings : kind === "glues" ? glues : nbms;
        const updated: any = [...section];

        updated[index][key] = value;
        updated[index].rowTotal = updated[index].quantity * updated[index].cost;

        // Add new if itemName typed
        const shouldAdd = index === updated.length - 1 && updated[index].itemName?.trim();
        const shouldRemove = index === updated.length - 1 && updated[index - 1]?.itemName === "";

        if (shouldAdd) updated.push(emptySimpleRow());
        if (shouldRemove) updated.pop();

        if (kind === "fittings") setFittings(updated);
        if (kind === "glues") setGlues(updated);
        if (kind === "nbms") setNbms(updated);
    };

    const makeRow = (kind: "fittings" | "glues" | "nbms", rows: SimpleItemRow[]) => {

        const handleAddRow = () => {
            const updated = [...rows, emptySimpleRow()];
            if (kind === "fittings") setFittings(updated);
            if (kind === "glues") setGlues(updated);
            if (kind === "nbms") setNbms(updated);
        };
        return (
            <div className="mt-8 ">
                {/* <h3 className="font-bold text-lg capitalize">{kind.replace('nbms', 'Non-Branded Materials')}</h3> */}

                <div className="overflow-x-auto  rounded-md mt-2">
                    <table className="min-w-full text-sm bg-white shadow-sm">
                        <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
                            <tr>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Row Total</th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((row, index) => (
                                <tr
                                    key={index}
                                    className="group relative border-none !border-b-1 px-4 py-2 transition-all duration-150 hover:bg-gray-50"
                                >
                                    <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                                        <input
                                            placeholder="Item Name"
                                            type="text"
                                            className="w-full px-2 py-1 text-center outline-none"
                                            value={row.itemName}
                                            onChange={(e) =>
                                                handleSimpleChange(kind, index, "itemName", e.target.value)
                                            }
                                        />
                                    </td>

                                    <td className="px-2 border border-gray-100 text-center text-sm text-gray-700 font-medium transition-colors duration-200 group-hover:text-gray-900">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            className="w-full px-2 py-1 text-center outline-none"
                                            value={row.description}
                                            onChange={(e) =>
                                                handleSimpleChange(kind, index, "description", e.target.value)
                                            }
                                        />
                                    </td>

                                    <td className=" border border-gray-100 text-center">
                                        <input
                                            type="number"
                                            className="w-20 text-center px-2 py-1 outline-none "
                                            min={0}
                                            value={row.quantity}
                                            onChange={(e) =>
                                                handleSimpleChange(kind, index, "quantity", Number(e.target.value))
                                            }
                                        />
                                    </td>

                                    <td className="border border-gray-100 text-center">
                                        <input
                                            type="number"
                                            className="w-24 text-center px-2 py-1 outline-none "
                                            min={0}
                                            value={row.cost}
                                            onChange={(e) =>
                                                handleSimpleChange(kind, index, "cost", Number(e.target.value))
                                            }
                                        />
                                    </td>

                                    <td className="border text-center border-gray-100  px-4 text-sm font-medium text-gray-700">
                                        ₹{row.rowTotal.toLocaleString("en-IN")}
                                    </td>

                                    <td className="text-center p-4 border border-gray-100">
                                        <button
                                            className="text-white bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded text-xs"
                                            onClick={() => {
                                                const section = kind === "fittings" ? fittings :
                                                    kind === "glues" ? glues : nbms;

                                                if (section.length > 1) {
                                                    const updated = [...section];
                                                    updated.splice(index, 1);
                                                    if (kind === "fittings") setFittings(updated);
                                                    if (kind === "glues") setGlues(updated);
                                                    if (kind === "nbms") setNbms(updated);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-xmark mr-1"></i> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>
                <div className="mt-2 flex justify-end">
                    <Button
                        variant="primary"
                        onClick={handleAddRow}
                        className="px-4 py-2rounded text-sm "
                    >
                        Add Row
                    </Button>
                </div>
            </div>
        )
    }



    const totalPly = plyRows.reduce((sum, row) => sum + row.rowTotal, 0);
    const totalFittings = fittings.reduce((sum, row) => sum + row.rowTotal, 0);
    const totalGlues = glues.reduce((sum, row) => sum + row.rowTotal, 0);
    const totalNbms = nbms.reduce((sum, row) => sum + row.rowTotal, 0);

    const grandTotal = totalPly + totalFittings + totalGlues + totalNbms;
    const handleSubmit = async () => {
        try{

        
        if (!filters.projectId) {
            toast({ title: "Error", description: "Please select a project", variant: "destructive" });
            return;
        }

        const formData = new FormData();

        // Plywood data
        const filteredPly = plyRows.filter((r) => r.itemName.trim());
        filteredPly.forEach((row, index) => {
            if (row.imageFile) {
                formData.append(`images[${index}]`, row.imageFile);
            }
        });

        formData.append("categorySections", JSON.stringify(filteredPly));
        formData.append("fittings", JSON.stringify(fittings.filter((r) => r.itemName.trim())));
        formData.append("glues", JSON.stringify(glues.filter((r) => r.itemName.trim())));
        formData.append("nonBrandedMaterials", JSON.stringify(nbms.filter((r) => r.itemName.trim())));

        // const plywoodTotal = filteredPly.reduce((sum, r) => sum + r.rowTotal, 0);
        // const fitTotal = fittings.reduce((sum, r) => sum + r.rowTotal, 0);
        // const glueTotal = glues.reduce((sum, r) => sum + r.rowTotal, 0);
        // const nbmTotal = nbms.reduce((sum, r) => sum + r.rowTotal, 0);
        // const grandTotal = materialTotal + fitTotal + glueTotal + nbmTotal;



        const plywoodTotal = totalPly
        const fitTotal = totalFittings
        const glueTotal = totalGlues
        const nbmTotal = totalNbms
        const totalAmountOfAll = grandTotal
        

        formData.append("plywoodTotal", plywoodTotal.toString());
        formData.append("fittingsTotal", fitTotal.toString());
        formData.append("glueTotal", glueTotal.toString());
        formData.append("nbmTotal", nbmTotal.toString());
        formData.append("grandTotal", totalAmountOfAll.toString());

        await createQuote(
            {
                organizationId,
                projectId: filters.projectId,
                formData,
            }
            // {
            //     onSuccess: () => {
            //         toast({ title: "Success", description: "Quote Created ✔️" });
            //     },
            //     onError: (err: any) => {

            //         toast({ title: "Error", description: err.message, variant: "destructive" });

            //     },
            // }
        );

                    toast({ title: "Success", description: "Created Successfully" });

    }
    catch(error:any){
                    toast({ title: "Error", description: error?.response?.data?.message || error?.message || "failed to generate the items", variant: "destructive" });
    }
    };



    return (
        <div className="p-2  mx-auto max-h-full overflow-y-auto">


            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2 py-3 border-b-1 border-[#818283]">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="fas fa-file mr-3 text-blue-600" />
                        Internal Quote Entry
                    </h1>
                </div>

                 <div className="flex gap-6 items-center ">
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

                <div className="text-right flex gap-2 items-center">
                    <div className="text-xs text-gray-600 uppercase tracking-widest">Grand Total</div>
                    <div className="text-xl font-semibold text-green-600">₹{grandTotal.toLocaleString("en-IN")}</div>
                </div>
            </div>
            </header>

           

            {/* Plywood table (Re-use existing one) */}
             <div className="shadow-lg mt-4 rounded-xl p-4">
            <div className="flex justify-between items-center my-4">
                <h2 className="font-bold text-lg">Plywood Section</h2>
                <div className="text-lg font-semibold text-gray-600">
                    Total: ₹{totalPly.toLocaleString("en-IN")}
                </div>
            </div>

            <div className="overflow-x-auto  rounded-md">
                <table className="min-w-full text-sm bg-white shadow-sm">
                    <thead className="bg-blue-50 text-sm font-semibold text-gray-600">
                        <tr>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plywood</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Laminate</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Carpenters / Day</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days	</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % on Materials	</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit % on Labours </th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Row Total</th>
                            <th className="text-center px-6 py-3">Actions</th> {/* ✅ NEW COLUMN */}
                        </tr>
                    </thead>

                    <tbody>
                        {plyRows.map((row, index) => (
                            <tr
                                key={index}
                                className={`group relative border-none !border-b-1 px-4 py-2 transition-all duration-150 hover:bg-gray-50`}
                            >
                                {/* Image Cell with Preview */}
                                <td className="text-center p-2 border border-gray-100">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePlyChange(index, "imageFile", e.target.files?.[0])}
                                        className="w-full text-xs"
                                    />
                                    {row.previewUrl && (
                                        <img src={row.previewUrl} alt="Preview" className="h-10 mx-auto mt-1" />
                                    )}
                                </td>

                                {/* Item Name */}
                                <td className="text-center p-2 border border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Wardrobe / TV Unit"
                                        className="w-full text-center border-none outline-none"
                                        value={row.itemName}
                                        onChange={(e) => handlePlyChange(index, "itemName", e.target.value)}
                                    />
                                </td>

                                {/* Dynamic Numeric Fields */}
                                {["plywoodNos", "laminateNos", "carpenters", "days", "profitOnMaterial", "profitOnLabour"].map((key) => (
                                    <td key={key} className="text-center p-2 border border-gray-100">
                                        <input
                                            type="number"
                                            className="w-20 text-center border-none outline-none"
                                            value={Number(row[key as keyof QuoteRow])}
                                            onChange={(e) =>
                                                handlePlyChange(index, key as keyof QuoteRow, Number(e.target.value))
                                            }
                                            min={0}
                                        />
                                    </td>
                                ))}

                                {/* Remarks */}
                                <td className="text-center p-2 border border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="remarks"
                                        className="w-full text-center border-none outline-none"
                                        value={row.remarks}
                                        onChange={(e) => handlePlyChange(index, "remarks", e.target.value)}
                                    />
                                </td>

                                {/* Row Total */}
                                <td className="text-center p-2 font-semibold border border-gray-100 text-green-700">
                                    ₹{row.rowTotal.toLocaleString("en-IN")}
                                </td>

                                <td className="text-center p-2 border border-gray-100">
                                    {plyRows.length > 1 && (
                                        <button
                                            className="text-white bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded text-xs"
                                            onClick={() => {
                                                const updated = [...plyRows];
                                                updated.splice(index, 1);
                                                setPlyRows(updated);
                                            }}
                                        >
                                            <i className="fas fa-xmark "></i> Remove
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                <div className="mt-2 flex justify-end">
                    <Button
                        variant="primary"
                        onClick={() => setPlyRows(prev => [...prev, emptyPlyRow()])}
                        className="px-4 py-2rounded text-sm "
                    >
                        Add Row
                    </Button>
                </div>
            </div>
            </div>


            {/* Other sections */}
            <div className="shadow-lg mt-4 rounded-xl p-4">
                <div className="flex justify-between items-center my-4">
                    <h2 className="font-bold text-lg">Fittings</h2>
                    <div className="text-lg font-semibold text-gray-600">
                        Total: ₹{totalFittings.toLocaleString("en-IN")}
                    </div>
                </div>
                {makeRow("fittings", fittings)}
            </div>


            <div className="shadow-lg mt-4 rounded-xl p-4">
                <div className="flex justify-between items-center my-4">
                    <h2 className="font-bold text-lg">Glues</h2>
                    <div className="text-lg font-semibold text-gray-600">
                        Total: ₹{totalGlues.toLocaleString("en-IN")}
                    </div>
                </div>
                {makeRow("glues", glues)}
            </div>
            <div className="shadow-lg mt-4 rounded-xl p-4">
                <div className="flex justify-between items-center my-4">
                    <h2 className="font-bold text-lg">Non-Branded Materials</h2>
                    <div className="text-lg font-semibold text-gray-600">
                        Total: ₹{totalNbms.toLocaleString("en-IN")}
                    </div>
                </div>
                {makeRow("nbms", nbms)}
            </div>

            <div className="mt-6 text-right">
                <Button
                variant="primary"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded"
                    disabled={isPending}
                >
                    {isPending ? "Creating..." : "Save Quote"}
                </Button>
            </div>
        </div>
    );
};

export default QuoteGenerateMain;