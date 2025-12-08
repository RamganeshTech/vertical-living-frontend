// import { useEffect, useState, useMemo } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useGetProcurementItemsPublic, usePublicUpdateProcurementItemRate,  } from "../../../apiList/Department Api/Procurement Api/procurementApi";
// import { toast } from "../../../utils/toast";
// import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants";
// import { Button } from "../../../components/ui/Button";

// interface ProcurementItem {
//     _id: string;
//     subItemName: string;
//     quantity: number;
//     unit: string;
//     rate?: number;
//     totalCost?: number;
// }

// const PublicProcurementRatePage = () => {
//     const [searchParams] = useSearchParams();
//     const token = searchParams.get("token") || "";
//     const orderId = searchParams.get("orderId") || "";

//     // API Hooks
//     const { data: apiData, isLoading, isError } = useGetProcurementItemsPublic(token || "", orderId);
//     const { mutateAsync: submitRates, isPending: isSubmitting } = usePublicUpdateProcurementItemRate();

//     // Local state
//     const [items, setItems] = useState<ProcurementItem[]>([]);
//     const [isFinalized, setIsFinalized] = useState(false);

//     // Sync API data to local state
//     useEffect(() => {
//         // Based on your JSON, the actual array is inside apiData.data.selectedUnits
//         if (apiData) {
//             const fetchedItems = apiData?.selectedUnits || [];
//             setItems(fetchedItems);
//             setIsFinalized(apiData.isConfirmedRate || false);
//         }
//     }, [apiData]);

//     // Handle Rate Change & Auto-Calculate Totals
//     const handleRateChange = (id: string, newRateStr: string) => {
//         if (isFinalized) return;

//         const newRate = parseFloat(newRateStr);

//         setItems((prevItems) =>
//             prevItems.map((item) => {
//                 if (item._id === id) {
//                     const rateVal = isNaN(newRate) ? 0 : newRate;
//                     return {
//                         ...item,
//                         rate: rateVal,
//                         totalCost: (item.quantity || 0) * rateVal,
//                     };
//                 }
//                 return item;
//             })
//         );
//     };

//     // Calculate Grand Total
//     const grandTotal = useMemo(() => {
//         return items.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
//     }, [items]);

//     // Submit Handler
//     const handleSubmit = async () => {
//         try {
//             if (!token) return;

//             // Validation: Ensure valid rates
//             const missingRates = items.some(i => i.rate === undefined || i.rate === null || i.rate < 0);
//             if (missingRates) {
//                 toast({ title: "Error", description: "Please enter valid rates for all items.", variant: "destructive" });
//                 return;
//             }

//             const payload = {
//                 selectedUnits: items 
//             };

//             await submitRates({ token, payload: payload as any , orderId});
            
//             toast({ title: "Success", description: "Rates submitted successfully!" });
//             setIsFinalized(true);
//         }
//         catch (error: any) {
//             console.error(error);
//             toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || "Failed to submit rates." });
//         }
//     };

//     // --- Render Loading State ---
//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
//             </div>
//         );
//     }

//     // --- Render Error State ---
//     if (isError || !apiData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//                 <div className="text-center">
//                     <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
//                     <h2 className="text-xl font-bold text-gray-800">Invalid or Expired Link</h2>
//                     <p className="text-gray-600 mt-2">Please contact the procurement department.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 font-sans pb-24">

//             {/* --- HEADER --- */}
//             <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between py-4">
//                         <div className="flex items-center gap-4">
//                             <div className="flex-shrink-0">
//                                 <img
//                                     src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
//                                     alt="Company Logo"
//                                     className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
//                                 />
//                             </div>
//                             <div className="min-w-0">
//                                 <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
//                                     {COMPANY_DETAILS.COMPANY_NAME}
//                                 </h1>
//                                 <p className="text-sm sm:text-base text-gray-600 truncate">
//                                     Vendor Rate Submission
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* --- MAIN CONTENT --- */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//                 {/* Status Banner: Finalized */}
//                 {isFinalized && (
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
//                         <i className="fas fa-check-circle text-green-600 text-xl mt-0.5"></i>
//                         <div>
//                             <h3 className="font-semibold text-green-800">Rates Submitted Successfully</h3>
//                             <p className="text-sm text-green-700">Thank you. This order is now locked and under review.</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Status Banner: Instructions (Responsive Fix applied here) */}
//                 {!isFinalized && (
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                         <div className="flex items-start gap-3">
//                             <i className="fas fa-calculator text-blue-600 text-lg mt-1"></i>
//                             <p className="text-sm text-blue-800 leading-relaxed">
//                                 Please enter the <strong>Rate</strong> for each item below. The total cost will calculate automatically. 
//                                 Ensure you fill in rates for all items before submitting.
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* --- SCROLLABLE TABLE CONTAINER --- */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                     <div className="overflow-x-auto w-full">
//                         {/* min-w-[800px] ensures enough space for split columns on mobile */}
//                         <table className="min-w-[800px] w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[50px]">#</th>
//                                     <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[250px]">Item Details</th>
                                    
//                                     {/* Separated Quantity Column */}
//                                     <th scope="col" className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Qty</th>
                                    
//                                     {/* Separated Unit Column */}
//                                     <th scope="col" className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Unit</th>
                                    
//                                     <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[180px]">
//                                         Rate <span className="text-red-500">*</span>
//                                     </th>
//                                     <th scope="col" className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-[150px]">Total Cost</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {items.map((item, index) => (
//                                     <tr key={item._id} className="hover:bg-gray-50 transition-colors">
//                                         {/* Index */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
//                                             {index + 1}
//                                         </td>

//                                         {/* Item Name */}
//                                         <td className="px-4 py-4">
//                                             <div className="text-sm font-medium text-gray-900">{item.subItemName}</div>
//                                         </td>

//                                         {/* Quantity (Separate) */}
//                                         <td className="px-4 py-4 text-center">
//                                             <span className="text-sm font-semibold text-gray-700">
//                                                 {item.quantity}
//                                             </span>
//                                         </td>

//                                         {/* Unit (Separate) */}
//                                         <td className="px-4 py-4 text-center">
//                                             <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
//                                                 {item.unit}
//                                             </span>
//                                         </td>

//                                         {/* Rate Input */}
//                                         <td className="px-4 py-4">
//                                             <div className="relative rounded-md shadow-sm">
//                                                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                                     <span className="text-gray-500 sm:text-sm">₹</span>
//                                                 </div>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     step="0.01"
//                                                     disabled={isFinalized}
//                                                     value={item.rate === undefined || item.rate === 0 ? '' : item.rate}
//                                                     onChange={(e) => handleRateChange(item._id, e.target.value)}
//                                                     className={`block w-full rounded-md border-0 py-2 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all
//                                                         ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
//                                                     placeholder="0.00"
//                                                 />
//                                             </div>
//                                         </td>

//                                         {/* Row Total */}
//                                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                                             <div className="text-sm font-bold text-gray-700">
//                                                 {(item.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Table Footer Summary */}
//                     <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                         <div className="flex justify-end items-center gap-4">
//                             <span className="text-sm font-medium text-gray-500 uppercase">Grand Total:</span>
//                             <span className="text-2xl font-bold text-blue-700">
//                                 {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* --- BOTTOM ACTION BAR --- */}
//             {!isFinalized && (
//                 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
//                     <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
//                         <div className="text-sm text-gray-500 hidden sm:block">
//                             <i className="fas fa-info-circle mr-2"></i>
//                             Please review rates before submitting.
//                         </div>
//                         <Button
//                             onClick={handleSubmit}
//                             isLoading={isSubmitting}
//                             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
//                         >
//                             <i className="fas fa-save"></i>
//                             Submit Rates
//                         </Button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PublicProcurementRatePage;



import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    useGetProcurementItemsPublic, 
    usePublicUpdateProcurementItemRate, 
     // Keep this for the final "Confirm/Lock" action if needed
} from "../../../apiList/Department Api/Procurement Api/procurementApi";
// import { toast } from "../../../utils/toast";
import { COMPANY_DETAILS, NO_IMAGE } from "../../../constants/constants";
// import { Button } from "../../../components/ui/Button";

interface ProcurementItem {
    _id: string;
    subItemName: string;
    quantity: number;
    unit: string;
    rate?: number;
    totalCost?: number;
    // UI state for saving status
    isSaving?: boolean; 
}

const PublicProcurementRatePage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const orderId = searchParams.get("orderId") || "";

    // --- API Hooks ---
    // 1. Get Data
    const { data: apiData, isLoading, isError } = useGetProcurementItemsPublic(token || "", orderId);
    
    // 2. Single Item Update (Background Auto-Save)
    const { mutate: updateSingleItem } = usePublicUpdateProcurementItemRate();

    // 3. Bulk/Final Submit (To lock the order)
    // const { mutateAsync: finalizeOrder, isPending: isSubmitting } = useUpdateProcurementItemRate();

    // --- Local State ---
    const [items, setItems] = useState<ProcurementItem[]>([]);
    const [isFinalized, setIsFinalized] = useState(false);

    // --- Refs for Debouncing ---
    // Stores the timeout IDs for each item so we can clear them if the user keeps typing
    const debounceTimeoutRefs = useRef<{ [key: string]: any }>({});

    // Sync API data to local state
    useEffect(() => {
        if (apiData) {
            // Adjust based on your actual response structure
            const fetchedItems = apiData.selectedUnits || [];
            setItems(fetchedItems);
            setIsFinalized(apiData.isConfirmedRate || false);
        }
    }, [apiData]);

    // --- Handle Rate Change with Auto-Save (Debounced) ---
    const handleRateChange = (id: string, newRateStr: string) => {
        if (isFinalized) return;

        const newRate = parseFloat(newRateStr);
        const validRate = isNaN(newRate) ? 0 : newRate;

        // 1. Update Local State Immediately (Optimistic UI)
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item._id === id) {
                    return {
                        ...item,
                        rate: validRate,
                        totalCost: (item.quantity || 0) * validRate,
                        isSaving: true, // Show loading state for this row
                    };
                }
                return item;
            })
        );

        // 2. Debounce Logic for API Call
        // Clear existing timer for this specific item ID if it exists
        if (debounceTimeoutRefs.current[id]) {
            clearTimeout(debounceTimeoutRefs.current[id]);
        }

        // Set a new timer (e.g., 800ms wait after typing stops)
        debounceTimeoutRefs.current[id] = setTimeout(() => {
            handleSingleItemSave(id, validRate);
        }, 800);
    };

    // --- Helper: Execute the Single Item Save ---
    const handleSingleItemSave = (itemId: string, rate: number) => {
        const payload = { rate: rate }; // Matches backend req.body.rate

        updateSingleItem(
            { 
                token, 
                orderId, 
                itemId, 
                payload: payload as any 
            },
            {
                onSuccess: () => {
                    // Remove "Saving" status on success
                    setItems((prev) => prev.map(i => i._id === itemId ? { ...i, isSaving: false } : i));
                },
                onError: (error) => {
                    console.error("Failed to auto-save item", error);
                    // Optional: Show error toast or indicator
                    setItems((prev) => prev.map(i => i._id === itemId ? { ...i, isSaving: false } : i));
                }
            }
        );
    };

    // Calculate Grand Total
    const grandTotal = useMemo(() => {
        return items.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
    }, [items]);

    // --- Final Submit Handler (Locks the order) ---
    // const handleSubmit = async () => {
    //     try {
    //         if (!token) return;

    //         // Validation: Ensure valid rates
    //         const missingRates = items.some(i => i.rate === undefined || i.rate === null || i.rate < 0);
    //         if (missingRates) {
    //             toast({ title: "Error", description: "Please enter valid rates for all items.", variant: "destructive" });
    //             return;
    //         }

    //         // We send the full payload one last time to ensure consistency and trigger the "isConfirmedRate=true"
    //         const payload = {
    //             selectedUnits: items 
    //         };

    //         // await finalizeOrder({ token, payload: payload as any });
            
    //         toast({ title: "Success", description: "Quotation submitted successfully!" });
    //         setIsFinalized(true);
    //     }
    //     catch (error: any) {
    //         console.error(error);
    //         toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || "Failed to submit rates." });
    //     }
    // };

    // --- Render Loading State ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    // --- Render Error State ---
    if (isError || !apiData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
                    <h2 className="text-xl font-bold text-gray-800">Invalid or Expired Link</h2>
                    <p className="text-gray-600 mt-2">Please contact the procurement department.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 font-sans pb-24">

            {/* --- HEADER --- */}
            <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
                                    alt="Company Logo"
                                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                                    {COMPANY_DETAILS.COMPANY_NAME}
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 truncate">
                                    Vendor Rate Submission
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Status Banner: Finalized */}
                {isFinalized && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <i className="fas fa-check-circle text-green-600 text-xl mt-0.5"></i>
                        <div>
                            <h3 className="font-semibold text-green-800">Rates Submitted Successfully</h3>
                            <p className="text-sm text-green-700">Thank you. This order is now locked and under review.</p>
                        </div>
                    </div>
                )}

                {/* Status Banner: Instructions */}
                {!isFinalized && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <i className="fas fa-calculator text-blue-600 text-lg mt-1"></i>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Please enter the <strong>Rate</strong> for each item below. Changes are saved automatically.
                                {/* Click "Submit Rates" when you are finished to finalize the quotation. */}
                            </p>
                        </div>
                    </div>
                )}

                {/* --- SCROLLABLE TABLE CONTAINER --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-[800px] w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[50px]">#</th>
                                    <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[250px]">Item Details</th>
                                    <th scope="col" className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Qty</th>
                                    <th scope="col" className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Unit</th>
                                    <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[180px]">
                                        Rate <span className="text-red-500">*</span>
                                    </th>
                                    <th scope="col" className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-[150px]">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{index + 1}</td>
                                        
                                        {/* Item Name */}
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-medium text-gray-900">{item.subItemName}</div>
                                            {/* Saving Indicator */}
                                            {item.isSaving && (
                                                <span className="text-[10px] text-blue-500 italic flex items-center gap-1 mt-1">
                                                    <i className="fas fa-spinner fa-spin"></i> Saving...
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-center"><span className="text-sm font-semibold text-gray-700">{item.quantity}</span></td>
                                        <td className="px-4 py-4 text-center"><span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">{item.unit}</span></td>

                                        {/* Rate Input */}
                                        <td className="px-4 py-4">
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    disabled={isFinalized}
                                                    value={item.rate === undefined || item.rate === 0 ? '' : item.rate}
                                                    onChange={(e) => handleRateChange(item._id, e.target.value)}
                                                    className={`block w-full rounded-md border-0 py-2 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all
                                                        ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>

                                        {/* Row Total */}
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-700">
                                                {(item.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-end items-center gap-4">
                            <span className="text-sm font-medium text-gray-500 uppercase">Grand Total:</span>
                            <span className="text-2xl font-bold text-blue-700">
                                {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM ACTION BAR --- */}
            {/* {!isFinalized && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500 hidden sm:block">
                            <i className="fas fa-check-double mr-2 text-green-500"></i>
                            Changes are saved automatically.
                        </div>
                        <Button
                            onClick={handleSubmit}
                            // isLoading={isSubmitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <i className="fas fa-lock mr-2"></i>
                            Finalize & Submit
                        </Button>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default PublicProcurementRatePage;