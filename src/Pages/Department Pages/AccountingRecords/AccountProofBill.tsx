

// import React from 'react';
// import { dateFormate } from '../../../utils/dateFormator'; // Adjust path as needed

// interface AccountProofBillProps {
//     record: any;
// }

// const AccountProofBill: React.FC<AccountProofBillProps> = ({ record }) => {
//     if (!record) return null;

//     const {
//         sourceDetails,
//         paymentDetails,
//         logisticsDetails,
//         materialArrivalDetails,
//         finalPaymentDetails
//     } = record;

//     // 🛠️ Highly compact and tight UI block for each department
//     const DeptBlock = ({ 
//         deptName, 
//         icon, 
//         refNumber, 
//         status, 
//         details 
//     }: { 
//         deptName: string, icon: string, refNumber: string, status?: string, details?: {label: string, value: any}[] 
//     }) => (
//         <div className="p-3 border-b border-ash-medium last:border-0 bg-brand-surface hover:bg-brand-ash transition-colors">
//             {/* Block Header */}
//             <div className="flex justify-between items-start mb-2">
//                 <div>
//                     <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
//                         <i className={`fas ${icon}`}></i> {deptName}
//                     </div>
//                     <div className="text-sm font-bold text-text-main truncate max-w-[200px]" title={refNumber}>
//                         {refNumber || 'N/A'}
//                     </div>
//                 </div>
//                 {status && (
//                     <span className="text-[8px] font-bold uppercase border border-ash-light bg-brand-ash px-1.5 py-0.5 rounded text-text-strong shadow-sm shrink-0">
//                         {status}
//                     </span>
//                 )}
//             </div>

//             {/* Block Details Grid (Tighter spacing) */}
//             {details && details.length > 0 && (
//                 <div className="grid grid-cols-2 gap-y-2 gap-x-2 bg-brand-ash/40 p-2 rounded border border-ash-light mt-1">
//                     {details.map((d, idx) => (
//                         <div key={idx} className="flex flex-col">
//                             <span className="text-[8px] text-text-muted font-bold uppercase tracking-wide">{d.label}</span>
//                             <span className="text-[11px] font-medium text-text-strong truncate" title={String(d.value || '-')}>
//                                 {d.value || '-'}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );

//     return (
//         // Added mx-auto and max-w-sm to keep it centered and perfectly sized like a bill
//         <div className="bg-brand-surface border border-ash-dark rounded-xl shadow-sm flex flex-col max-h-[80vh] mx-auto w-full max-w-sm overflow-hidden">

//             {/* --- Main Centered Header --- */}
//             <div className="bg-brand-ash border-b border-ash-dark p-4 flex flex-col items-center justify-center sticky top-0 z-10 text-center">
//                 <h2 className="text-text-strong text-base font-black uppercase tracking-widest flex items-center gap-2 mb-1">
//                     <i className="fas fa-file-invoice text-text-muted"></i>
//                     Audit Ledger
//                 </h2>
//                 <p className="text-text-main text-xs font-mono font-bold">
//                     {record.recordNumber || "N/A"}
//                 </p>
//                 <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-surface border border-ash-medium rounded-full text-[9px] font-bold text-text-main uppercase tracking-widest shadow-sm">
//                     <span className="w-1.5 h-1.5 rounded-full bg-text-strong"></span>
//                     STATUS: {record.status}
//                 </div>
//             </div>

//             {/* --- Scrollable Lifecycle Blocks --- */}
//             <div className="flex-1 overflow-y-auto custom-scrollbar">

//                 {/* 1. ORDER MATERIAL BLOCK */}
//                 {/* Adjust the variable mapping here based on exactly how Order Material is sent from the backend */}
//                 <DeptBlock 
//                     deptName="1. Order Material"
//                     icon="fa-clipboard-list"
//                     refNumber={sourceDetails?.deptFrom === "Order Material" ? sourceDetails.deptNumber : "Requested via Site"} 
//                     // status="Approved"
//                 />

//                 {/* 2. PROCUREMENT BLOCK */}
//                 {sourceDetails && (
//                     <DeptBlock 
//                         deptName="2. Procurement"
//                         icon="fa-shop"
//                         refNumber={sourceDetails.deptFrom === "Procurement" ? sourceDetails.deptNumber : sourceDetails.deptNumber}
//                         details={[
//                             { label: "Generated Date", value: dateFormate(sourceDetails.deptGeneratedDate) },
//                             { label: "Grand Total", value: `₹${sourceDetails.grandTotal?.toLocaleString('en-IN')}` },
//                             { label: "Total Items", value: `${sourceDetails.items?.length || 0} Items` },
//                             { label: "Tax Applied", value: `₹${sourceDetails.taxAmount || 0}` }
//                         ]}
//                     />
//                 )}

//                 {/* 3. ADVANCE PAYMENT BLOCK */}
//                 {paymentDetails && (
//                     <DeptBlock 
//                         deptName="3. Advance Payment"
//                         icon="fa-money-check-dollar"
//                         refNumber={paymentDetails.paymentDeptNumber || paymentDetails.number}
//                         status={paymentDetails.status}
//                         details={[
//                             { label: "Payment Date", value: dateFormate(paymentDetails.paymentDate || paymentDetails.date) },
//                             { label: "Amount Paid", value: `₹${paymentDetails.grandTotal?.toLocaleString('en-IN')}` },
//                             { label: "Transaction ID", value: paymentDetails.transactionId || 'Pending' }
//                         ]}
//                     />
//                 )}

//                 {/* 4. LOGISTICS BLOCK */}
//                 {logisticsDetails && (
//                     <DeptBlock 
//                         deptName="4. Logistics & Transit"
//                         icon="fa-truck-fast"
//                         refNumber={logisticsDetails.logisticsDeptNumber || logisticsDetails.shipmentNumber}
//                         status={logisticsDetails.status}
//                         details={[
//                             { label: "Origin", value: logisticsDetails.origin?.address || 'Vendor Site' },
//                             { label: "Destination", value: logisticsDetails.destination?.address || 'Project Site' },
//                         ]}
//                     />
//                 )}

//                 {/* 5. SITE VERIFICATION BLOCK */}
//                 {materialArrivalDetails && (
//                     <DeptBlock 
//                         deptName="5. Site Verification"
//                         icon="fa-clipboard-check"
//                         refNumber={materialArrivalDetails.materialArrivalDeptNumber || materialArrivalDetails.arrivalNumber}
//                         status="Verified"
//                         details={[
//                             { label: "Items Checked", value: `${materialArrivalDetails.items?.length || 0} Items` },
//                             { label: "Proof Uploads", value: `${materialArrivalDetails.orderedImages?.length || 0} Attachments` },
//                         ]}
//                     />
//                 )}

//                 {/* 6. FINAL SETTLEMENT BLOCK */}
//                 {finalPaymentDetails && (
//                     <DeptBlock 
//                         deptName="6. Final Settlement"
//                         icon="fa-handshake"
//                         refNumber={finalPaymentDetails.paymentDeptNumber || finalPaymentDetails.number}
//                         status={finalPaymentDetails.generalStatus}
//                         details={[
//                             { label: "Payment Date", value: dateFormate(finalPaymentDetails.paymentDate || finalPaymentDetails.date) },
//                             { label: "Amount Paid", value: `₹${finalPaymentDetails.grandTotal?.toLocaleString('en-IN')}` },
//                             { label: "Transaction ID", value: finalPaymentDetails.transactionId || 'Pending' },
//                             { label: "Remaining Balance", value: `₹${finalPaymentDetails.amountRemaining?.totalAmount || 0}` }
//                         ]}
//                     />
//                 )}

//                 {/* Empty State Fallback */}
//                 {!sourceDetails && !paymentDetails && (
//                     <div className="p-8 text-center text-text-muted">
//                         <i className="fas fa-folder-open text-2xl mb-2 opacity-50"></i>
//                         <p className="text-xs font-medium uppercase tracking-widest">No Records Yet</p>
//                     </div>
//                 )}
//             </div>

//             {/* --- Footer Summary (Compact) --- */}
//             <div className="bg-brand-ash border-t border-ash-dark p-3">
//                 <div className="flex justify-between items-center bg-brand-surface border border-ash-medium px-3 py-2 rounded shadow-sm">
//                     <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
//                         <i className="fas fa-calculator"></i> Total Value
//                     </span>
//                     <span className="text-text-strong text-base font-mono font-black">
//                         ₹{sourceDetails?.grandTotal?.toLocaleString('en-IN') || record.amount?.toLocaleString('en-IN') || 0}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AccountProofBill;

// SECOND VERSION

import React from 'react';
import { dateFormate } from '../../../utils/dateFormator'; // Adjust path as needed

interface AccountProofBillProps {
    record: any;
}

const AccountProofBill: React.FC<AccountProofBillProps> = ({ record }) => {
    if (!record) return null;

    const {
        orderMaterialDetails,
        procurementDetails,
        paymentDetails,
        logisticsDetails,
        materialArrivalDetails,
        finalPaymentDetails,
        sourceDetails // Fallback just in case it's a direct Bill/Expense
    } = record;

    // 🛠️ Highly compact UI block for each department
    const DeptBlock = ({
        deptName,
        icon,
        refNumber,
        status,
        details
    }: {
        deptName: string, icon: string, refNumber: string, status?: string, details?: { label: string, value: any }[]
    }) => (
        <div className="p-3 border-b border-ash-medium last:border-0 bg-brand-surface hover:bg-brand-ash transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
                        <i className={`fas ${icon}`}></i> {deptName}
                    </div>
                    <div className="text-sm font-bold text-text-main truncate max-w-[200px]" title={refNumber}>
                        {refNumber || 'N/A'}
                    </div>
                </div>
                {status && (
                    <span className="text-[8px] font-bold uppercase border border-ash-light bg-brand-ash px-1.5 py-0.5 rounded text-text-strong shadow-sm shrink-0">
                        {status}
                    </span>
                )}
            </div>

            {details && details.length > 0 && (
                <div className="grid grid-cols-2 gap-y-2 gap-x-2 bg-brand-ash/40 p-2 rounded border border-ash-light mt-1">
                    {details.map((d, idx) => (
                        <div key={idx} className="flex flex-col">
                            <span className="text-[8px] text-text-muted font-bold uppercase tracking-wide">{d.label}</span>
                            <span className="text-[11px] font-medium text-text-strong truncate" title={String(d.value || '-')}>
                                {d.value || '-'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Determine the master "Total Value" to display at the bottom
    const masterTotal = procurementDetails?.grandTotal || sourceDetails?.grandTotal || record.amount || 0;

    return (
        <div className="bg-brand-surface border border-ash-dark rounded-xl shadow-sm flex flex-col max-h-[80vh] mx-auto w-full max-w-sm overflow-hidden">

            {/* --- Main Centered Header --- */}
            <div className="bg-brand-ash border-b border-ash-dark p-4 flex flex-col items-center justify-center sticky top-0 z-10 text-center">
                <h2 className="text-text-strong text-base font-black uppercase tracking-widest flex items-center gap-2 mb-1">
                    <i className="fas fa-file-invoice text-text-muted"></i>
                    Audit Ledger
                </h2>
                <p className="text-text-main text-xs font-mono font-bold">
                    {record.recordNumber || "N/A"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-surface border border-ash-medium rounded-full text-[9px] font-bold text-text-main uppercase tracking-widest shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-strong"></span>
                    STATUS: {record.status}
                </div>
            </div>

            {/* --- Scrollable Lifecycle Blocks --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">

                {/* 1. ORDER MATERIAL */}
                {orderMaterialDetails && (
                    <DeptBlock
                        deptName="1. Order Material"
                        icon="fa-clipboard-list"
                        refNumber={orderMaterialDetails.orderMaterialDeptNumber}
                        details={[
                            { label: "Date", value: dateFormate(orderMaterialDetails.createdAt) },
                            { label: "Priority", value: orderMaterialDetails.priority || 'Normal' },
                            { label: "Total Items", value: `${orderMaterialDetails.items?.length || 0} Items` },
                            { label: "Site Req", value: orderMaterialDetails.deliveryLocationDetails?.siteSupervisor || 'N/A' }
                        ]}
                    />
                )}

                {/* 2. PROCUREMENT */}
                {procurementDetails && (
                    <DeptBlock
                        deptName="2. Procurement"
                        icon="fa-shop"
                        refNumber={procurementDetails.procurementDeptNumber}
                        details={[
                            { label: "Date", value: dateFormate(procurementDetails.createdAt) },
                            { label: "Grand Total", value: `₹${procurementDetails.grandTotal?.toLocaleString('en-IN')}` },
                            { label: "Vendor", value: procurementDetails.shopDetails?.shopName || 'N/A' },
                            { label: "Total Items", value: `${procurementDetails.items?.length || 0} Items` }
                        ]}
                    />
                )}

                {/* 3. ADVANCE PAYMENT */}
                {paymentDetails && (
                    <DeptBlock
                        deptName="3. Advance Payment"
                        icon="fa-money-check-dollar"
                        refNumber={paymentDetails.paymentDeptNumber}
                        status={paymentDetails.status}
                        details={[
                            { label: "Payment Date", value: dateFormate(paymentDetails.paymentDate) },
                            { label: "Amount Paid", value: `₹${paymentDetails.grandTotal?.toLocaleString('en-IN')}` },
                            { label: "Transaction ID", value: paymentDetails.transactionId || 'Pending' }
                        ]}
                    />
                )}

                {/* 4. LOGISTICS */}
                {logisticsDetails && (
                    <DeptBlock
                        deptName="4. Logistics & Transit"
                        icon="fa-truck-fast"
                        refNumber={logisticsDetails.logisticsDeptNumber}
                        status={logisticsDetails.status}
                        details={[
                            { label: "Origin", value: logisticsDetails.origin?.address || 'Vendor Site' },
                            { label: "Destination", value: logisticsDetails.destination?.address || 'Project Site' },
                        ]}
                    />
                )}

                {/* 5. SITE VERIFICATION */}
                {materialArrivalDetails && (
                    <DeptBlock
                        deptName="5. Site Verification"
                        icon="fa-clipboard-check"
                        refNumber={materialArrivalDetails.materialArrivalDeptNumber}
                        status="Verified"
                        details={[
                            { label: "Items Checked", value: `${materialArrivalDetails.items?.length || 0} Items` },
                            { label: "Proof Uploads", value: `${materialArrivalDetails.orderedImages?.length || 0} Attachments` },
                        ]}
                    />
                )}

                {/* 6. FINAL SETTLEMENT */}
                {finalPaymentDetails && (
                    <DeptBlock
                        deptName="6. Final Settlement"
                        icon="fa-handshake"
                        refNumber={finalPaymentDetails.paymentDeptNumber}
                        status={finalPaymentDetails.generalStatus}
                        details={[
                            { label: "Payment Date", value: dateFormate(finalPaymentDetails.paymentDate) },
                            { label: "Amount Paid", value: `₹${finalPaymentDetails.grandTotal?.toLocaleString('en-IN')}` },
                            { label: "Transaction ID", value: finalPaymentDetails.transactionId || 'Pending' },
                            { label: "Remaining Balance", value: `₹${finalPaymentDetails.amountRemaining?.totalAmount || 0}` }
                        ]}
                    />
                )}

                {/* Fallback Block (Just in case it's a standalone Bill/Invoice with no order material) */}
                {!orderMaterialDetails && !procurementDetails && sourceDetails && (
                    <DeptBlock
                        deptName={`Source: ${sourceDetails.deptFrom}`}
                        icon="fa-file-invoice"
                        refNumber={sourceDetails.deptNumber}
                        details={[
                            { label: "Date", value: dateFormate(sourceDetails.deptGeneratedDate) },
                            { label: "Grand Total", value: `₹${sourceDetails.grandTotal?.toLocaleString('en-IN')}` },
                        ]}
                    />
                )}

                {/* Empty State Fallback */}
                {!orderMaterialDetails && !procurementDetails && !sourceDetails && !paymentDetails && (
                    <div className="p-8 text-center text-text-muted">
                        <i className="fas fa-folder-open text-2xl mb-2 opacity-50"></i>
                        <p className="text-xs font-medium uppercase tracking-widest">No Records Yet</p>
                    </div>
                )}
            </div>

            {/* --- Footer Summary (Compact) --- */}
            <div className="bg-brand-ash border-t border-ash-dark p-3 rounded-b-xl">
                <div className="flex justify-between items-center bg-brand-surface border border-ash-medium px-3 py-2 rounded shadow-sm">
                    <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fas fa-calculator"></i> Total Value
                    </span>
                    <span className="text-text-strong text-base font-mono font-black">
                        ₹{masterTotal?.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AccountProofBill;