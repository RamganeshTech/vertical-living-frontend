// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//     useCreateProcurement,
//     useGetOrderMateiralRefPdfId
// } from "../../../apiList/Department Api/Procurement Api/procurementApi"; // Adjust path
// // import { useGetProjects } from "../../../apiList/Department Api/Project Api/projectApi"; // Adjust path
// import { Button } from "../../../components/ui/Button";
// import { Input } from "../../../components/ui/Input";
// import { Card, CardContent } from "../../../components/ui/Card";
// import { Label } from "../../../components/ui/Label"; // Assuming you have a Label component
// import { toast } from "../../../utils/toast";
// import { useGetProjects } from "../../../apiList/projectApi";
// import type { AvailableProjetType } from "../Logistics Pages/LogisticsShipmentForm";

// // Interface for Item Row
// interface ItemInput {
//     subItemName: string;
//     quantity: number | "";
//     unit: string;
// }


// type OrderRefPdfId = {
//     refUniquePdf: string
//     fromDeptRefId: string
// }

// const CreateProcurementPage = () => {
//     const navigate = useNavigate();
//     const { organizationId } = useParams() as { organizationId: string }

//     // --- Unified Form State ---
//     const [formData, setFormData] = useState({
//         projectId: "" as string,
//         projectName: "" as string,
//         fromDeptNumber: "" as string, // This stores the Order Material Ref ID
//         fromDeptRefId: null,

//         shopDetails: {
//             shopName: "",
//             contactPerson: "",
//             phoneNumber: "",
//             address: "",
//             upiId: ""
//         },

//         deliveryLocationDetails: {
//             siteName: "",
//             siteSupervisor: "",
//             phoneNumber: "",
//             address: ""
//         },

//         items: [{ subItemName: "", quantity: "" as number | "", unit: "" }] as ItemInput[]
//     });

//     // --- API Hooks ---

//     // 1. Get Projects
//     // const { data: projectData } = useGetProjects(organizationId);
//     // // Adjust based on your actual API response structure (e.g. projectData.data or just projectData)
//     // const projects = projectData?.data || [];


//     const { data: projectData } = useGetProjects(organizationId!);
//     const projects = projectData?.map((project: AvailableProjetType) => ({
//         _id: project._id,
//         projectName: project.projectName
//     }));



//     // 2. Get Order Material Refs (Dependent on projectId)
//     const { data: refIdsData, isLoading: isLoadingRefs } = useGetOrderMateiralRefPdfId(formData.projectId);
//     const orderMaterialRefs = refIdsData || [];

//     // 3. Create Mutation
//     const { mutateAsync: createProcurement, isPending } = useCreateProcurement();


//     // --- Handlers ---

//     // 1. Project Selection Handler (As per your request)
//     const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedValue = e.target.value;
//         const selectedProject = projects?.find((p: any) => p._id === selectedValue);

//         if (selectedProject) {
//             setFormData(prev => ({
//                 ...prev,
//                 projectId: selectedProject._id,
//                 projectName: selectedProject.projectName,
//                 fromDeptNumber: "", // Reset Ref ID when project changes
//                 fromDeptRefId: null // Reset Ref ID when project changes
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 projectId: "",
//                 projectName: "",
//                 fromDeptNumber: "",
//                 fromDeptRefId: null // Reset Ref ID when project changes

//             }));
//         }
//     };

//     // 2. Generic Input Handler for Nested Objects (Shop/Delivery)
//     const handleNestedChange = (section: 'shopDetails' | 'deliveryLocationDetails', field: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [field]: value
//             }
//         }));
//     };

//     // 3. Items Handlers
//     const addItem = () => {
//         setFormData(prev => ({
//             ...prev,
//             items: [...prev.items, { subItemName: "", quantity: "", unit: "" }]
//         }));
//     };

//     const removeItem = (index: number) => {
//         setFormData(prev => ({
//             ...prev,
//             items: prev.items.filter((_, i) => i !== index)
//         }));
//     };

//     const handleItemChange = (index: number, field: keyof ItemInput, value: any) => {
//         const updatedItems = [...formData.items];
//         updatedItems[index] = { ...updatedItems[index], [field]: value };
//         setFormData(prev => ({ ...prev, items: updatedItems }));
//     };

//     // --- Submit Handler ---
//     const handleSubmit = async () => {
//         try {
//             // Validation
//             if (!formData.projectId) {
//                 toast({ variant: "destructive", title: "Missing Field", description: "Please select a Project." });
//                 return;
//             }
//             if (!formData.fromDeptNumber) {
//                 toast({ variant: "destructive", title: "Missing Field", description: "Please select an Order Material Reference." });
//                 return;
//             }
//             if (formData.items.length === 0 || formData.items.some(i => !i.subItemName || !i.quantity || !i.unit)) {
//                 toast({ variant: "destructive", title: "Incomplete Items", description: "Please fill in all item details (Name, Qty, Unit)." });
//                 return;
//             }

//             // Construct Payload
//             const payload = {
//                 projectId: formData.projectId,
//                 fromDeptNumber: formData.fromDeptNumber, // Selected Ref ID
//                 fromDeptName: "Order Material",

//                 shopDetails: formData.shopDetails,
//                 deliveryLocationDetails: formData.deliveryLocationDetails,

//                 // Map items (Rate & Total Cost = 0 initially)
//                 selectedUnits: formData.items.map(item => ({
//                     subItemName: item.subItemName,
//                     quantity: Number(item.quantity),
//                     unit: item.unit,
//                     rate: 0,
//                     totalCost: 0
//                 }))
//             };

//             await createProcurement({ payload });

//             toast({ title: "Success", description: "Procurement Order Created Successfully!" });
//             navigate(-1);
//         } catch (error: any) {
//             console.error(error);
//             toast({ variant: "destructive", title: "Error", description: error.message || "Failed to create procurement." });
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 font-sans pb-24">
//             <div className="max-w-6xl mx-auto space-y-6">

//                 {/* Header */}
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Create Procurement Order</h1>
//                         <p className="text-sm text-gray-500">Initiate a new order for vendor pricing.</p>
//                     </div>
//                     <Button variant="outline" onClick={() => navigate(-1)}>
//                         Cancel
//                     </Button>
//                 </div>

//                 {/* --- SECTION 1: PROJECT & REFERENCE --- */}
//                 <Card className="bg-white border-blue-100 shadow-sm">
//                     <CardContent className="p-6">
//                         <h3 className="text-md font-bold text-blue-800 mb-4 flex items-center gap-2">
//                             <i className="fas fa-file-contract"></i> Project & Reference
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                             {/* Project Selection */}
//                             <div className="space-y-1">
//                                 <Label>Project <span className="text-red-500">*</span></Label>
//                                 <select
//                                     value={formData.projectId}
//                                     onChange={handleProjectChange}
//                                     className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
//                                 >
//                                     <option value="">Select Project</option>
//                                     {projects.map((proj: any) => (
//                                         <option key={proj._id} value={proj._id}>{proj.projectName}</option>
//                                     ))}
//                                 </select>
//                             </div>




//                             {/* Order Material Ref Selection */}
//                             <div className="space-y-1">
//                                 <Label>Order Material Ref No <span className="text-red-500">*</span></Label>
//                                 <select
//                                     value={formData.fromDeptNumber}
//                                     onChange={(e) => {

//                                         const selectedFromDeptRefId = orderMaterialRefs.find((ord: OrderRefPdfId) => ord?.refUniquePdf === e.target.value)

//                                         setFormData(prev => ({ ...prev, fromDeptNumber: e.target.value, fromDeptRefId: selectedFromDeptRefId }))

//                                     }}
//                                     disabled={!formData.projectId}
//                                     className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
//                                 >
//                                     <option value="">
//                                         {isLoadingRefs ? "Loading..." : formData.projectId ? "Select Ref No" : "Select Project First"}
//                                     </option>
//                                     {orderMaterialRefs.map((ref: OrderRefPdfId, idx: number) => {
//                                         // Handle based on your API response (assuming refUniquePdf holds the value)
//                                         const value = ref.refUniquePdf;
//                                         return <option key={idx} value={value}>{value}</option>;
//                                     })}
//                                 </select>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>


//                 {/* --- SECTION 2: SHOP & DELIVERY DETAILS --- */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//                     {/* Shop Details */}
//                     <Card className="bg-white border-gray-200 shadow-sm">
//                         <CardContent className="p-6 space-y-4">
//                             <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
//                                 <i className="fas fa-store text-blue-600"></i> Shop Details
//                             </h3>
//                             <div className="grid grid-cols-1 gap-3">
//                                 <Input
//                                     placeholder="Shop Name"
//                                     value={formData.shopDetails.shopName}
//                                     onChange={(e) => handleNestedChange('shopDetails', 'shopName', e.target.value)}
//                                 />
//                                 <Input
//                                     placeholder="Contact Person"
//                                     value={formData.shopDetails.contactPerson}
//                                     onChange={(e) => handleNestedChange('shopDetails', 'contactPerson', e.target.value)}
//                                 />
//                                 <Input
//                                     placeholder="Phone Number"
//                                     maxLength={10}
//                                     value={formData.shopDetails.phoneNumber}
//                                     onChange={(e) => {
//                                         if (/^\d*$/.test(e.target.value)) handleNestedChange('shopDetails', 'phoneNumber', e.target.value);
//                                     }}
//                                 />
//                                 <Input
//                                     placeholder="UPI ID (Optional)"
//                                     value={formData.shopDetails.upiId}
//                                     onChange={(e) => handleNestedChange('shopDetails', 'upiId', e.target.value)}
//                                 />
//                                 <Input
//                                     placeholder="Shop Address"
//                                     value={formData.shopDetails.address}
//                                     onChange={(e) => handleNestedChange('shopDetails', 'address', e.target.value)}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Delivery Details */}
//                     <Card className="bg-white border-gray-200 shadow-sm">
//                         <CardContent className="p-6 space-y-4">
//                             <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
//                                 <i className="fas fa-truck text-orange-600"></i> Delivery Location
//                             </h3>
//                             <div className="grid grid-cols-1 gap-3">
//                                 <Input
//                                     placeholder="Site Name"
//                                     value={formData.deliveryLocationDetails.siteName}
//                                     onChange={(e) => handleNestedChange('deliveryLocationDetails', 'siteName', e.target.value)}
//                                 />
//                                 <Input
//                                     placeholder="Site Supervisor"
//                                     value={formData.deliveryLocationDetails.siteSupervisor}
//                                     onChange={(e) => handleNestedChange('deliveryLocationDetails', 'siteSupervisor', e.target.value)}
//                                 />
//                                 <Input
//                                     placeholder="Site Phone Number"
//                                     maxLength={10}
//                                     value={formData.deliveryLocationDetails.phoneNumber}
//                                     onChange={(e) => {
//                                         if (/^\d*$/.test(e.target.value)) handleNestedChange('deliveryLocationDetails', 'phoneNumber', e.target.value);
//                                     }}
//                                 />
//                                 <Input
//                                     placeholder="Site Address"
//                                     value={formData.deliveryLocationDetails.address}
//                                     onChange={(e) => handleNestedChange('deliveryLocationDetails', 'address', e.target.value)}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* --- SECTION 3: ITEMS LIST --- */}
//                 <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
//                     <CardContent className="p-0">
//                         <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
//                             <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
//                                 <i className="fas fa-list text-purple-600"></i> Selected Units
//                             </h3>
//                             <Button size="sm" onClick={addItem} className="bg-blue-600 text-white hover:bg-blue-700">
//                                 <i className="fas fa-plus mr-1"></i> Add Item
//                             </Button>
//                         </div>

//                         <div className="overflow-x-auto">
//                             <table className="w-full min-w-[600px] text-sm text-left">
//                                 <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
//                                     <tr>
//                                         <th className="px-4 py-3 w-[50px]">#</th>
//                                         <th className="px-4 py-3">Item Name</th>
//                                         <th className="px-4 py-3 w-[150px]">Quantity</th>
//                                         <th className="px-4 py-3 w-[150px]">Unit</th>
//                                         <th className="px-4 py-3 w-[80px] text-center">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100">
//                                     {formData.items.map((item, index) => (
//                                         <tr key={index} className="group hover:bg-gray-50">
//                                             <td className="px-4 py-2 text-gray-400 font-mono">{index + 1}</td>
//                                             <td className="px-4 py-2">
//                                                 <Input
//                                                     placeholder="Item Description"
//                                                     value={item.subItemName}
//                                                     onChange={(e) => handleItemChange(index, "subItemName", e.target.value)}
//                                                     className="border-gray-200 focus:border-blue-500"
//                                                 />
//                                             </td>
//                                             <td className="px-4 py-2">
//                                                 <Input
//                                                     type="number"
//                                                     placeholder="0"
//                                                     min="0"
//                                                     value={item.quantity}
//                                                     onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                                                     className="border-gray-200 focus:border-blue-500"
//                                                 />
//                                             </td>
//                                             <td className="px-4 py-2">
//                                                 <Input
//                                                     placeholder="e.g. Kg, Nos"
//                                                     value={item.unit}
//                                                     onChange={(e) => handleItemChange(index, "unit", e.target.value)}
//                                                     className="border-gray-200 focus:border-blue-500"
//                                                 />
//                                             </td>
//                                             <td className="px-4 py-2 text-center">
//                                                 {formData.items.length > 1 && (
//                                                     <button
//                                                         onClick={() => removeItem(index)}
//                                                         className="text-gray-400 hover:text-red-600 transition-colors p-2"
//                                                         title="Remove Item"
//                                                     >
//                                                         <i className="fas fa-trash-alt"></i>
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* --- FOOTER ACTIONS --- */}
//                 <div className="flex justify-end gap-4">
//                     <Button variant="outline" onClick={() => navigate(-1)} className="w-32">
//                         Cancel
//                     </Button>
//                     <Button
//                         onClick={handleSubmit}
//                         isLoading={isPending}
//                         className="w-40 text-white"
//                     >
//                         <i className="fas fa-save mr-2"></i> Create Order
//                     </Button>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default CreateProcurementPage;




import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useCreateProcurement,
    useGetOrderMateiralRefPdfId
} from "../../../apiList/Department Api/Procurement Api/procurementApi";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
// import { Card, CardContent } from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { toast } from "../../../utils/toast";
// import { useGetProjects } from "../../../apiList/Department Api/Project Api/projectApi"; // Adjusted path based on context
import type { AvailableProjetType } from "../Logistics Pages/LogisticsShipmentForm";
import { useGetProjects } from "../../../apiList/projectApi";
import { ORDERMATERIAL_UNIT_OPTIONS } from "../../Stage Pages/Ordering Materials/OrderMaterialOverview";
import { useAuthCheck } from "../../../Hooks/useAuthCheck";


// Interface for Item Row
interface ItemInput {
    subItemName: string;
    quantity: number | "";
    unit: string;
}

type OrderRefPdfId = {
    refUniquePdf: string;
    fromDeptRefId: string;
    id?: string;
}

const CreateProcurementPage = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams() as { organizationId: string };

    // --- Unified Form State ---
    const [formData, setFormData] = useState({
        projectId: "" as string,
        projectName: "" as string,
        fromDeptNumber: "" as string,
        fromDeptRefId: null as OrderRefPdfId | null,

        shopDetails: {
            shopName: "",
            contactPerson: "",
            phoneNumber: "",
            address: "",
            upiId: ""
        },

        deliveryLocationDetails: {
            siteName: "",
            siteSupervisor: "",
            phoneNumber: "",
            address: ""
        },

        // Start with one empty row
        items: [{ subItemName: "", quantity: "" as number | "", unit: "" }] as ItemInput[]
    });

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


    const { role, permission } = useAuthCheck();


    const canCreate = role === "owner" || permission?.procurement?.create;



    // --- API Hooks ---
    const { data: projectData } = useGetProjects(organizationId!);

    // Map project data safely
    const projects = projectData?.data ? projectData.data : (Array.isArray(projectData) ? projectData.map((project: AvailableProjetType) => ({
        _id: project._id,
        projectName: project.projectName
    })) : []);

    // Get Order Material Refs (Dependent on projectId)
    // Ensure your hook uses queryKey: ["ordermaterial", "refId", formData.projectId]
    const { data: refIdsData, isLoading: isLoadingRefs } = useGetOrderMateiralRefPdfId(formData.projectId);
    const orderMaterialRefs = refIdsData || [];


    // --- Effects ---

    // 1. Default Project Selection
    useEffect(() => {
        if (projects && projects.length > 0 && !formData.projectId) {
            const firstProject = projects[0];
            setFormData(prev => ({
                ...prev,
                projectId: firstProject._id,
                projectName: firstProject.projectName
            }));
        }
    }, [projects]);



    // Create Mutation
    const { mutateAsync: createProcurement, isPending } = useCreateProcurement();



    // --- Handlers ---

    // 1. Project Selection Handler
    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedProject = projects?.find((p: any) => p._id === selectedValue);

        if (selectedProject) {
            setFormData(prev => ({
                ...prev,
                projectId: selectedProject._id,
                projectName: selectedProject.projectName,
                fromDeptNumber: "", // Reset Ref ID
                fromDeptRefId: null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                projectId: "",
                projectName: "",
                fromDeptNumber: "",
                fromDeptRefId: null
            }));
        }
    };

    // 2. Generic Input Handler for Nested Objects
    const handleNestedChange = (section: 'shopDetails' | 'deliveryLocationDetails', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // 3. Items Handlers (Auto-Add Logic)
    const handleItemChange = (index: number, field: keyof ItemInput, value: any) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        const isLastRow = index === updatedItems.length - 1;


        // Logic: If typing in 'subItemName' of the LAST row, and it's not empty, add a new empty row
        if (
            field === "subItemName" &&
            index === updatedItems.length - 1 &&
            value.trim() !== ""
        ) {
            updatedItems.push({ subItemName: "", quantity: "", unit: "" });
        }

        // --- AUTO REMOVE LOGIC ---
        // If it is NOT the last row, and the row becomes completely empty -> Remove it
        if (!isLastRow) {
            const currentItem = updatedItems[index];

            // Check if everything is empty
            const isNameEmpty = !currentItem.subItemName || currentItem.subItemName.toString().trim() === "";
            const isQtyEmpty = !currentItem.quantity || currentItem.quantity === 0;
            const isUnitEmpty = !currentItem.unit || currentItem.unit === "";

            if (isNameEmpty && isQtyEmpty && isUnitEmpty) {
                updatedItems.splice(index, 1);
            }
        }



        setFormData(prev => ({ ...prev, items: updatedItems }));


        // --- ⭐ MOVE FOCUS TO NEXT ROW AFTER UNIT SELECTION ⭐ ---
        if (field === "unit") {
            setTimeout(() => {
                const nextIndex = index + 1;
                const nextInput = inputRefs.current[nextIndex];
                nextInput?.focus();
            }, 50);
        }
    };

    const addItem = () => {
        // Prevent removing the only row if desired, or just allow it and show validation on submit
        setFormData(prev => ({ ...prev, items: [...prev.items, { subItemName: "", quantity: "", unit: "" }] }));
    };


    const removeItem = (index: number) => {
        // Prevent removing the only row if desired, or just allow it and show validation on submit
        if (formData.items.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };



    // --- Submit Handler (Cleanup Logic) ---
    const handleSubmit = async () => {
        try {
            // 1. Basic Field Validation
            if (!formData.projectId) {
                toast({ variant: "destructive", title: "Missing Field", description: "Please select a Project." });
                return;
            }
            if (!formData.fromDeptNumber) {
                toast({ variant: "destructive", title: "Missing Field", description: "Please select an Order Material Reference." });
                return;
            }

            // 2. Filter & Cleanup Items
            // Remove rows where subItemName is empty
            const validItems = formData.items.filter(item => item.subItemName.trim() !== "");

            // 3. Item Validation
            if (validItems.length === 0) {
                toast({ variant: "destructive", title: "No Items", description: "Please add at least one valid item." });
                return;
            }

            // Check if valid items have Quantity and Unit
            const hasIncompleteItems = validItems.some(i => !i.quantity || !i.unit);
            if (hasIncompleteItems) {
                toast({ variant: "destructive", title: "Incomplete Details", description: "All items must have a Quantity and Unit selected." });
                return;
            }

            // 4. Construct Payload
            const payload = {
                organizationId: organizationId,
                projectId: formData.projectId,
                fromDeptNumber: formData.fromDeptNumber,
                fromDeptRefId: formData.fromDeptRefId,
                fromDeptName: "Order Material",

                shopDetails: formData.shopDetails,
                deliveryLocationDetails: formData.deliveryLocationDetails,

                // Map cleaned items
                selectedUnits: validItems.map(item => ({
                    subItemName: item.subItemName,
                    quantity: Number(item.quantity),
                    unit: item.unit,
                    rate: 0,
                    totalCost: 0
                }))
            };

            // 5. Submit
            await createProcurement({ payload });

            toast({ title: "Success", description: "Procurement Order Created Successfully!" });
            // navigate(-1);
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Failed to create procurement." });
        }
    };

    if (!canCreate) {
        return
    }


    return (
        <div className="max-w-full mx-auto space-y-6 max-h-full overflow-y-auto">

            {/* --- HEADER --- */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 pb-4 pt-2 mb-3 flex justify-between items-center px-4">
                <div className='flex justify-between items-center gap-3'>
                    <button type="button" onClick={() => navigate(-1)} className='bg-blue-50 hover:bg-blue-100 flex items-center justify-center w-8 h-8 border border-blue-200 text-blue-600 text-sm cursor-pointer rounded-md transition-colors'>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-receipt mr-3 text-blue-600"></i>
                            Create Procurement
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                            Generate a new link for vendor pricing
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant='outline' type="button" onClick={() => navigate(-1)} className="hidden sm:flex border-gray-300 text-gray-700">
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} isLoading={isPending} className="bg-blue-600 text-white px-6 shadow-md hover:bg-blue-700">
                        Create Order
                    </Button>
                </div>
            </header>

            <form className="space-y-2 max-w-full mx-auto">



                {/* --- SECTION 2: SHOP & DELIVERY (Side by Side) --- */}
                <div className="bg-white rounded-xl p-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                        {/* Shop Details Column */}
                        <div className="lg:pr-6 pb-6 lg:pb-0">
                            <h2 className="text-md font-bold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-store mr-2 text-purple-600"></i> Shop Details
                            </h2>
                            <div className="">
                                <div>
                                    <Label>Shop Name</Label>
                                    <Input placeholder="Enter Shop Name" value={formData.shopDetails.shopName} onChange={(e) => handleNestedChange('shopDetails', 'shopName', e.target.value)} className="border-gray-300" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Contact Person</Label>
                                        <Input placeholder="Name" value={formData.shopDetails.contactPerson} onChange={(e) => handleNestedChange('shopDetails', 'contactPerson', e.target.value)} className="border-gray-300" />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input placeholder="10 Digits" maxLength={10} value={formData.shopDetails.phoneNumber} onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleNestedChange('shopDetails', 'phoneNumber', e.target.value); }} className="border-gray-300" />
                                    </div>
                                </div>
                                <div>
                                    <Label>UPI ID (Optional)</Label>
                                    <Input placeholder="e.g. user@okaxis" value={formData.shopDetails.upiId} onChange={(e) => handleNestedChange('shopDetails', 'upiId', e.target.value)} className="border-gray-300" />
                                </div>
                                <div>
                                    <Label>Address</Label>
                                    <Input placeholder="Shop Location" value={formData.shopDetails.address} onChange={(e) => handleNestedChange('shopDetails', 'address', e.target.value)} className="border-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details Column */}
                        <div className="lg:pl-6 pt-6 lg:pt-0">
                            <h2 className="text-md font-bold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-truck mr-2 text-orange-600"></i> Delivery Location
                            </h2>
                            <div className="">
                                <div>
                                    <Label>Site Name</Label>
                                    <Input placeholder="Enter Site Name" value={formData.deliveryLocationDetails.siteName} onChange={(e) => handleNestedChange('deliveryLocationDetails', 'siteName', e.target.value)} className="border-gray-300" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Supervisor</Label>
                                        <Input placeholder="Name" value={formData.deliveryLocationDetails.siteSupervisor} onChange={(e) => handleNestedChange('deliveryLocationDetails', 'siteSupervisor', e.target.value)} className="border-gray-300" />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input placeholder="10 Digits" maxLength={10} value={formData.deliveryLocationDetails.phoneNumber} onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleNestedChange('deliveryLocationDetails', 'phoneNumber', e.target.value); }} className="border-gray-300" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Site Address</Label>
                                    <Input placeholder="Delivery Location" value={formData.deliveryLocationDetails.address} onChange={(e) => handleNestedChange('deliveryLocationDetails', 'address', e.target.value)} className="border-gray-300" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- SECTION 1: PROJECT & REFERENCE --- */}
                <div className="bg-white rounded-xl p-3">
                    <h2 className="text-md font-bold text-gray-900 mb-4 flex items-center border-b border-gray-200 pb-2">
                        <i className="fas fa-file-contract mr-2 text-blue-600"></i> Project Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Project <span className="text-red-500">*</span></Label>
                            <select
                                value={formData.projectId}
                                onChange={handleProjectChange}
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Project</option>
                                {projects.map((proj: any) => (
                                    <option key={proj._id} value={proj._id}>{proj.projectName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Reference ID <span className="text-red-500">*</span></Label>
                            <select
                                value={formData.fromDeptNumber}
                                onChange={(e) => {
                                    const selectedFromDeptRefId = orderMaterialRefs.find((ord: OrderRefPdfId) => ord?.refUniquePdf === e.target.value)
                                    setFormData(prev => ({ ...prev, fromDeptNumber: e.target.value, fromDeptRefId: selectedFromDeptRefId?.fromDeptRefId || null }))
                                }}
                                disabled={!formData.projectId}
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {isLoadingRefs ? "Loading..." : formData.projectId ? "Select Order Material Ref" : "Select Project First"}
                                </option>
                                {orderMaterialRefs.map((ref: OrderRefPdfId, idx: number) => (
                                    <option key={idx} value={ref.refUniquePdf}>{ref.refUniquePdf}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: ITEMS --- */}
                <div className="bg-white rounded-xl p-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <i className="fas fa-list mr-2 text-blue-600"></i> Selected Units
                            <span className="text-red-500 ml-1">*</span>
                            <span className="text-xs font-normal text-gray-400 ml-2 hidden sm:inline">(Auto-adds new rows)</span>
                        </h2>
                        <Button type="button" onClick={addItem} variant='outline' size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            <i className="fas fa-plus mr-2"></i> Add Row
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 font-semibold text-sm text-gray-700 min-w-[700px]">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-6">Item Name</div>
                            <div className="col-span-2">Quantity</div>
                            <div className="col-span-2">Unit</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-gray-100 min-w-[700px]">
                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 px-4 py-2 bg-white items-center hover:bg-gray-50 transition-colors">
                                    <div className="col-span-1 text-center text-gray-400 text-sm font-mono">{index + 1}</div>

                                    <div className="col-span-6">
                                        <input
                                            ref={(el) => {
                                                inputRefs.current[index] = el;
                                            }}
                                            value={item.subItemName}
                                            onChange={(e) => handleItemChange(index, "subItemName", e.target.value)}
                                            placeholder={index === formData.items.length - 1 ? "+ Type to add new item..." : "Item Description"}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all ${index === formData.items.length - 1 ? 'bg-blue-50/30 border-blue-200 placeholder-blue-400' : 'border-gray-300'}`}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <select
                                            value={item.unit}
                                            onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm outline-none cursor-pointer"
                                        >
                                            <option value="" disabled>Unit</option>
                                            {ORDERMATERIAL_UNIT_OPTIONS.map((unitOption) => (
                                                <option key={unitOption} value={unitOption}>{unitOption}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        {index !== formData.items.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
};

export default CreateProcurementPage;