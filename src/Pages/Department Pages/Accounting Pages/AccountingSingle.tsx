

// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import { Card, CardContent } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/Button";
// import { Input } from "../../../components/ui/Input";
// import { useAddInstallment,  useGetSingleAccounting, usePayInstallment, useUpdateAccounting } from "../../../apiList/Department Api/Accounting Api/accountingApi";
// import { toast } from "../../../utils/toast";
// import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";
// import type { IAccounting, IInstallmentAcc } from "./AccountingMain";
// // import { loadScript } from "../../../utils/loadScript";


// const getStatusConfig = (status: string) => {
//   switch (status) {
//     case 'paid':
//       return {
//         bg: 'bg-green-100',
//         text: 'text-green-700',
//         icon: 'fa-check-circle',
//         badge: 'bg-green-100 text-green-700'
//       };
//     case 'processing':
//       return {
//         bg: 'bg-blue-100',
//         text: 'text-blue-700',
//         icon: 'fa-spinner fa-spin',
//         badge: 'bg-blue-100 text-blue-700'
//       };
//     case 'failed':
//       return {
//         bg: 'bg-red-100',
//         text: 'text-red-700',
//         icon: 'fa-times-circle',
//         badge: 'bg-red-100 text-red-700'
//       };
//     case 'cancelled':
//       return {
//         bg: 'bg-gray-100',
//         text: 'text-gray-700',
//         icon: 'fa-ban',
//         badge: 'bg-gray-100 text-gray-700'
//       };
//     default: // pending
//       return {
//         bg: 'bg-orange-100',
//         text: 'text-orange-700',
//         icon: 'fa-clock',
//         badge: 'bg-orange-100 text-orange-700'
//       };
//   }
// };


// const AccountingSingle: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { data, isLoading, refetch } = useGetSingleAccounting(id!) as { data: IAccounting, isLoading: boolean, refetch: () => any };
//   const { mutateAsync: updateRecord } = useUpdateAccounting();
//   // const { mutateAsync: createOrder } = useCreateAccountPaymentOrder();
//   // const { mutateAsync: verifyPayment } = useVerifyAccountInstallPayment();
//   const { mutateAsync: installmentAdd } = useAddInstallment();
//   const { mutateAsync: payInstallment, isPending: isPaymentLoading } = usePayInstallment();

//   const navigate = useNavigate()

//   const [formData, setFormData] = useState<any>(data || {});
//   const [editMode, setEditMode] = useState(false);
//   const [newInstallments, setNewInstallments] = useState<IInstallmentAcc[]>([]);
//   const [processingPayments, setProcessingPayments] = useState<Set<string>>(new Set());


//   const handleSave = async () => {
//     try {
//       await updateRecord({ id: id!, payload: formData });

//       toast({ title: "success", description: "shipment has generated" })
//       setEditMode(false);
//     }
//     catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Operation Failed",
//         variant: "destructive"
//       });
//     }
//   }



//   // ✅ UPDATED: Only send NEW installments to backend
//   const handleInstallmentAdd = async () => {
//     try {
//       if (newInstallments.length === 0) {
//         toast({
//           title: "Info",
//           description: "No new installments to add",
//           variant: "default"
//         });
//         return;
//       }

//       // Only send new installments (without _id)
//       await installmentAdd({
//         id: id!,
//         installments: newInstallments
//       });

//       toast({
//         title: "Success",
//         description: `${newInstallments.length} new installment(s) added successfully`
//       });

//       setEditMode(false);
//       setNewInstallments([]);
//       refetch();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Operation Failed",
//         variant: "destructive"
//       });
//     }
//   };

//   // const handleInstallmentPayment = async (accId: string, installmentId: string) => {
//   //   try {
//   //     const orderData = await createOrder({ accountingId: accId, installmentId });

//   //     const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
//   //     if (!sdkLoaded) {
//   //       toast({
//   //         title: "Error",
//   //         description: "Failed to load Razorpay SDK!",
//   //         variant: "destructive",
//   //       });
//   //       return;
//   //     }

//   //     const options = {
//   //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//   //       amount: orderData.amount,
//   //       currency: "INR",
//   //       name: "Vertical Living - Installment",
//   //       description: "Installment Payment",
//   //       order_id: orderData.orderId,

//   //       handler: async (response: any) => {
//   //         await verifyPayment({
//   //           accId,
//   //           installmentId,
//   //           razorpay_order_id: response.razorpay_order_id,
//   //           razorpay_payment_id: response.razorpay_payment_id,
//   //           razorpay_signature: response.razorpay_signature,
//   //         });

//   //         toast({
//   //           title: "Success",
//   //           description: "Installment paid successfully!",
//   //         });
//   //       },

//   //       theme: { color: "#0050b3" },
//   //     };

//   //     const rzp = new (window as any).Razorpay(options);
//   //     rzp.open();

//   //   } catch (err: any) {
//   //     toast({
//   //       title: "Error",
//   //       description: err?.response?.data?.message || err.message,
//   //       variant: "destructive",
//   //     });
//   //   }
//   // };


//   // ✅ NEW: Handle vendor payout


//   const handleVendorPayout = async (installmentId: string, amount: number) => {
//     try {
//       if (!data.upiId) {
//         toast({
//           title: "Error",
//           description: "Vendor UPI ID not configured",
//           variant: "destructive"
//         });
//         return;
//       }

//       setProcessingPayments(prev => new Set(prev).add(installmentId));

//        await payInstallment({
//         accountingId: id!,
//         installmentId
//       });

//       toast({
//         title: "Success",
//         description: `Payout of ₹${amount.toLocaleString()} initiated successfully`,
//       });

//       // Auto-refresh after 3 seconds
//       setTimeout(() => {
//         refetch();
//         setProcessingPayments(prev => {
//           const updated = new Set(prev);
//           updated.delete(installmentId);
//           return updated;
//         });
//       }, 3000);

//     } catch (error: any) {
//       setProcessingPayments(prev => {
//         const updated = new Set(prev);
//         updated.delete(installmentId);
//         return updated;
//       });

//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Payout failed",
//         variant: "destructive"
//       });
//     }
//   };


//   const preloadFormData = () => {
//     if (data) {
//       setFormData(
//         {
//           transactionType: data.transactionType,
//           fromDept: data.fromDept,
//           totalAmount: {
//             amount: data.totalAmount?.amount ?? 0,
//             taxAmount: data.totalAmount?.taxAmount ?? 0,
//           },
//           upiId: data?.upiId,
//           status: data.status,
//           dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
//           notes: data.notes ?? "",
//           installMents: data?.installMents || []
//         }
//       );
//     }
//   };

//   const handleToggleEdit = () => {
//     if (!editMode) {
//       preloadFormData(); // load latest data before entering edit mode
//     }
//     setEditMode((prev) => !prev);
//   };

//   if (isLoading) return <p className="p-6"><MaterialOverviewLoading /></p>;

//   if (!data) {
//     <div className="flex flex-col items-center  justify-center min-h-[300px] w-full bg-white rounded-xl text-center p-6">
//       <i className="fas fa-money-bill-wave text-5xl text-blue-300 mb-4" />
//       <h3 className="text-lg font-semibold text-blue-800 mb-1">No Records Found</h3>
//       {/* <p className="text-sm text-gray-500">
//                                 Looks like there are no Procurements yet for this project.<br />
//                                 Once you have <strong> generated the Pdf </strong>  items will be listed here  to get started 🚀
//                             </p> */}
//     </div>
//   }

//   return (
//     <div className="p-4 max-h-full overflow-y-auto max-w-full space-y-6">
//       <div className="flex justify-between items-center border-b border-gray-200 pb-4">
//         <div className="flex gap-3 items-center">
//           <div onClick={() => navigate(-1)}
//             className="bg-blue-50 hover:bg-slate-300 flex items-center justify-center w-8 h-8 border border-[#a6aab8] text-sm cursor-pointer rounded-md">
//             <i className="fas fa-arrow-left" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
//             Transaction: {data?.transactionNumber ?? "N/A"}
//           </h1>
//         </div>

//         {!editMode && <Button size="md" variant="primary" onClick={handleToggleEdit}>
//           <i className="fas fa-edit mr-1" />
//           {editMode ? "Cancel" : "Edit"}
//         </Button>}
//       </div>

//       <Card className="shadow-none">
//         <CardContent className="p-6 space-y-6 ">

//           {/* Amount + Tax */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Amount</h3>
//               {editMode ? (
//                 <Input
//                   value={formData?.totalAmount?.amount}
//                   type="number"
//                   onChange={(e) => {
//                     const val = +e.target.value;
//                     if (val >= 0) {
//                       setFormData((prev: any) => ({
//                         ...prev,
//                         totalAmount: {
//                           ...prev.totalAmount,
//                           amount: val || 0,
//                         },
//                       }));
//                     }
//                   }}
//                 />
//               ) : (
//                 <p className="text-lg text-gray-900 font-medium">₹ {data?.totalAmount?.amount}</p>
//               )}
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Tax</h3>
//               {editMode ? (
//                 <Input
//                   value={formData?.totalAmount?.taxAmount}
//                   type="number"
//                   onChange={(e) => {
//                     const val = +e.target.value;
//                     if (val >= 0) {
//                       setFormData((prev: any) => ({
//                         ...prev,
//                         totalAmount: {
//                           ...prev.totalAmount,
//                           taxAmount: val || 0,
//                         },
//                       }));
//                     }
//                   }}
//                 />
//               ) : (
//                 <p className="text-lg text-gray-900 font-medium">₹ {data?.totalAmount?.taxAmount}</p>
//               )}
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Upi ID</h3>
//               {editMode ? (
//                 <Input
//                   value={formData.upiId}
//                   type="text"
//                   onChange={(e) =>
//                     setFormData((prev: any) => ({
//                       ...prev,
//                       upiId: e.target.value
//                     }))
//                   }
//                 />
//               ) : (
//                 <p className="text-lg text-gray-800">{data?.upiId || "-"}</p>
//               )}
//             </div>
//           </div>

//           {/* Status */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Status</h3>
//               {editMode ? (
//                 <select
//                   value={formData.status}
//                   onChange={(e) =>
//                     setFormData((prev: any) => ({ ...prev, status: e.target.value }))
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="paid">Paid</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               ) : (
//                 <p className="text-sm font-medium text-blue-700 capitalize">{data.status}</p>
//               )}
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Due Date</h3>
//               {editMode ? (
//                 <Input
//                   value={formData?.dueDate}
//                   type="date"
//                   onChange={(e) =>
//                     setFormData((prev: any) => ({
//                       ...prev,
//                       dueDate: e.target.value
//                     }))
//                   }
//                 />
//               ) : (
//                 <p className="text-sm text-gray-800">
//                   {data?.dueDate ? new Date(data?.dueDate).toLocaleDateString() : "-"}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Notes */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
//             {editMode ? (
//               <textarea
//                 className="w-full px-3 py-2 border rounded-lg"
//                 value={formData.notes || ""}
//                 onChange={(e) =>
//                   setFormData((prev: any) => ({
//                     ...prev,
//                     notes: e.target.value,
//                   }))
//                 }
//               />
//             ) : (
//               <p className="text-sm text-gray-800">{data.notes || "-"}</p>
//             )}
//           </div>


//           {/* INSTALLMENTS */}


//           <div className="mt-8 space-y-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <i className="fas fa-calendar-check text-2xl text-blue-600"></i>
//                 <h2 className="text-2xl font-bold text-gray-800">Installments</h2>
//               </div>
//               {!editMode && (
//                 <button
//                   onClick={() => setEditMode(true)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                 >
//                   <i className="fas fa-plus"></i>
//                   Add New Installments
//                 </button>
//               )}
//             </div>

//             {/* EMPTY STATE */}
//             {!editMode && (!data?.installMents || data?.installMents?.length === 0) && (
//               <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                   <i className="fas fa-receipt text-3xl text-blue-600"></i>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">No installments created yet</h3>
//                 <p className="text-gray-600 mb-6">Start by adding installment plans for this agreement</p>
//                 <button
//                   onClick={() => setEditMode(true)}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
//                 >
//                   <i className="fas fa-plus-circle"></i>
//                   Add Installments
//                 </button>
//               </div>
//             )}

//             {/* ✅ VIEW MODE - EXISTING INSTALLMENTS */}
//             {!editMode && data?.installMents && data?.installMents?.length > 0 && (
//               <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                 {/* Table Header */}
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//                   <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-sm">
//                     <div className="col-span-1">#</div>
//                     <div className="col-span-2">
//                       <i className="fas fa-indian-rupee-sign mr-2"></i>Amount
//                     </div>
//                     <div className="col-span-2">
//                       <i className="fas fa-calendar-alt mr-2"></i>Due Date
//                     </div>
//                     <div className="col-span-2">
//                       <i className="fas fa-info-circle mr-2"></i>Status
//                     </div>
//                     <div className="col-span-2">
//                       <i className="fas fa-receipt mr-2"></i>Payment Info
//                     </div>
//                     <div className="col-span-2">
//                       <i className="fas fa-money-bill-wave mr-2"></i>UTR / Fees
//                     </div>
//                     <div className="col-span-1 text-center">
//                       <i className="fas fa-cog"></i>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Table Body */}
//                 <div className="bg-white divide-y divide-gray-200">
//                   {data.installMents.map((inst: IInstallmentAcc, index: number) => {
//                     const statusConfig = getStatusConfig(inst.status);
//                     const isProcessing = processingPayments.has(inst._id!);

//                     return (
//                       <div
//                         key={inst._id}
//                         className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
//                       >
//                         {/* Index */}
//                         <div className="col-span-1">
//                           <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${statusConfig.bg} ${statusConfig.text}`}>
//                             {index + 1}
//                           </div>
//                         </div>

//                         {/* Amount */}
//                         <div className="col-span-2">
//                           <div className="flex flex-col">
//                             <div className="flex items-center gap-2">
//                               <span className="text-blue-600 font-bold">₹</span>
//                               <span className="text-lg font-bold text-gray-900">
//                                 {inst.amount?.toLocaleString()}
//                               </span>
//                             </div>
//                             {inst.fees && inst.fees > 0 && (
//                               <span className="text-xs text-gray-500">
//                                 Fee: ₹{inst.fees.toFixed(2)}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Due Date */}
//                         <div className="col-span-2">
//                           <div className="flex flex-col gap-1">
//                             <div className="flex items-center gap-2">
//                               <i className="fas fa-calendar text-purple-600"></i>
//                               <span className="text-sm font-medium text-gray-700">
//                                 {new Date(inst.dueDate).toLocaleDateString('en-IN', {
//                                   day: '2-digit',
//                                   month: 'short',
//                                   year: 'numeric'
//                                 })}
//                               </span>
//                             </div>
//                             {inst.paidAt && (
//                               <span className="text-xs text-green-600">
//                                 <i className="fas fa-check mr-1"></i>
//                                 Paid: {new Date(inst.paidAt).toLocaleDateString('en-IN')}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Status */}
//                         <div className="col-span-2">
//                           <div className="flex flex-col gap-1">
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
//                               <i className={`fas ${statusConfig.icon} mr-2`}></i>
//                               {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
//                             </span>
//                             {inst.failureReason && (
//                               <span className="text-xs text-red-600">
//                                 {inst.failureReason}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Payment Info */}
//                         <div className="col-span-2">
//                           <div className="space-y-1">
//                             {inst.paymentId ? (
//                               <div className="text-xs">
//                                 <span className="text-gray-500">ID: </span>
//                                 <span className="font-mono bg-gray-100 px-2 py-1 rounded">
//                                   {inst.paymentId.substring(0, 10)}...
//                                 </span>
//                               </div>
//                             ) : (
//                               <span className="text-xs text-gray-400 italic">No payment ID</span>
//                             )}
//                           </div>
//                         </div>

//                         {/* UTR / Fees */}
//                         <div className="col-span-2">
//                           {inst.transactionId ? (
//                             <div className="space-y-1">
//                               <div className="text-xs">
//                                 <span className="text-gray-500">UTR: </span>
//                                 <span className="font-mono bg-green-50 text-green-700 px-2 py-1 rounded font-semibold">
//                                   {inst.transactionId}
//                                 </span>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="text-xs text-gray-400 italic">Pending</span>
//                           )}
//                         </div>

//                         {/* Actions */}
//                         <div className="col-span-1 flex justify-center">
//                           {inst.status === 'pending' && !isProcessing && (
//                             <button
//                               onClick={() => handleVendorPayout(inst._id!, inst.amount)}
//                               disabled={isPaymentLoading}
//                               className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1 disabled:opacity-50"
//                               title="Pay to Vendor"
//                             >
//                               <i className="fas fa-money-bill-wave"></i>
//                               Pay
//                             </button>
//                           )}
//                           {(inst.status === 'processing' || isProcessing) && (
//                             <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
//                               <i className="fas fa-spinner fa-spin"></i>
//                               Processing
//                             </span>
//                           )}
//                           {inst.status === 'paid' && (
//                             <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
//                               <i className="fas fa-check-double"></i>
//                               Paid
//                             </span>
//                           )}
//                           {inst.status === 'failed' && (
//                             <button
//                               onClick={() => handleVendorPayout(inst._id!, inst.amount)}
//                               className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
//                               title="Retry Payment"
//                             >
//                               <i className="fas fa-redo"></i>
//                               Retry
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Table Footer */}
//                 <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">
//                       <i className="fas fa-list-ol mr-2"></i>
//                       Total: <span className="font-semibold text-gray-800">{data.installMents.length}</span>
//                     </span>
//                     <div className="flex gap-4">
//                       <span className="text-green-600">
//                         <i className="fas fa-check-circle mr-1"></i>
//                         Paid: <span className="font-semibold">
//                           {data.installMents.filter(i => i.status === "paid").length}
//                         </span>
//                       </span>
//                       <span className="text-blue-600">
//                         <i className="fas fa-spinner mr-1"></i>
//                         Processing: <span className="font-semibold">
//                           {data.installMents.filter(i => i.status === "processing").length}
//                         </span>
//                       </span>
//                       <span className="text-orange-600">
//                         <i className="fas fa-clock mr-1"></i>
//                         Pending: <span className="font-semibold">
//                           {data.installMents.filter(i => i.status === "pending").length}
//                         </span>
//                       </span>
//                       <span className="text-red-600">
//                         <i className="fas fa-times-circle mr-1"></i>
//                         Failed: <span className="font-semibold">
//                           {data.installMents.filter(i => i.status === "failed").length}
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ✅ EDIT MODE - ADD NEW INSTALLMENTS ONLY */}
//             {editMode && (
//               <div className="space-y-4">
//                 {/* Info Banner */}
//                 <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
//                   <div className="flex items-start gap-3">
//                     <i className="fas fa-info-circle text-blue-600 mt-1"></i>
//                     <div>
//                       <h4 className="font-semibold text-blue-900 mb-1">Add New Installments</h4>
//                       <p className="text-sm text-blue-800">
//                         Existing installments cannot be edited. You can only add new installments here.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* New Installments Table */}
//                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                   {/* Header */}
//                   <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
//                     <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-sm">
//                       <div className="col-span-1">#</div>
//                       <div className="col-span-4">
//                         <i className="fas fa-indian-rupee-sign mr-2"></i>Amount
//                       </div>
//                       <div className="col-span-4">
//                         <i className="fas fa-calendar-alt mr-2"></i>Due Date
//                       </div>
//                       <div className="col-span-3 text-center">
//                         <i className="fas fa-trash-alt mr-2"></i>Action
//                       </div>
//                     </div>
//                   </div>

//                   {/* Body */}
//                   <div className="bg-white divide-y divide-gray-200">
//                     {newInstallments.length === 0 ? (
//                       <div className="text-center py-8 text-gray-500">
//                         <i className="fas fa-inbox text-4xl mb-3"></i>
//                         <p>No new installments added yet</p>
//                       </div>
//                     ) : (
//                       newInstallments.map((inst, idx) => (
//                         <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50">
//                           {/* Index */}
//                           <div className="col-span-1">
//                             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                               <span className="font-bold text-green-600 text-sm">
//                                 {(data?.installMents?.length || 0) + idx + 1}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Amount Input */}
//                           <div className="col-span-4">
//                             <div className="relative">
//                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
//                                 ₹
//                               </span>
//                               <Input
//                                 type="number"
//                                 placeholder="Enter amount"
//                                 value={inst.amount || ''}
//                                 onChange={(e) => {
//                                   const updated = [...newInstallments];
//                                   updated[idx].amount = Number(e.target.value);
//                                   setNewInstallments(updated);
//                                 }}
//                                 className="pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500"
//                               />
//                             </div>
//                           </div>

//                           {/* Due Date Input */}
//                           <div className="col-span-4">
//                             <Input
//                               type="date"
//                               value={inst.dueDate || ""}
//                               onChange={(e) => {
//                                 const updated = [...newInstallments];
//                                 updated[idx].dueDate = e.target.value;
//                                 setNewInstallments(updated);
//                               }}
//                               className="border-gray-300 focus:border-green-500 focus:ring-green-500"
//                             />
//                           </div>

//                           {/* Delete Button */}
//                           <div className="col-span-3 text-center">
//                             <button
//                               onClick={() => {
//                                 setNewInstallments(prev => prev.filter((_, i) => i !== idx));
//                               }}
//                               className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
//                             >
//                               <i className="fas fa-trash-alt"></i>
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-3 pt-4">
//                   <button
//                     onClick={() => {
//                       setNewInstallments(prev => [
//                         ...prev,
//                         {
//                           amount: 0,
//                           dueDate: "",
//                           status: "pending"
//                         }
//                       ]);
//                     }}
//                     className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 border-2 border-gray-300"
//                   >
//                     <i className="fas fa-plus-circle"></i>
//                     Add Row
//                   </button>

//                   <button
//                     onClick={handleInstallmentAdd}
//                     disabled={newInstallments.length === 0}
//                     className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <i className="fas fa-save"></i>
//                     Save {newInstallments.length} New Installment(s)
//                   </button>

//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       setNewInstallments([]);
//                     }}
//                     className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
//                   >
//                     <i className="fas fa-times"></i>
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>


//           {/* {read only fields}           */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
//             <div>
//               <span className="block font-medium text-gray-700">From Department</span>
//               <span className="text-gray-800 capitalize">{data?.fromDept || "-"}</span>
//             </div>
//             <div>
//               <span className="block font-medium text-gray-700">Paid At</span>
//               <span className="text-gray-800">{data?.paidAt ? new Date(data?.paidAt).toLocaleString() : "-"}</span>
//             </div>
//           </div>

//           {editMode && (
//             <div className="flex justify-end gap-2">


//               <Button onClick={handleSave}>
//                 <i className="fas fa-save mr-1" /> Save Changes
//               </Button>

//               <Button variant="secondary" onClick={() => setEditMode(false)}>
//                 <i className="fas fa-save mr-1" />  Cancel
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AccountingSingle;




// SECOND VERSION

// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";

// // --- Components ---
// import { Button } from "../../../components/ui/Button";
// import { Card, CardContent } from "../../../components/ui/Card";
// import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// // --- Hooks & Utils ---
// import { dateFormate } from "../../../utils/dateFormator";
// import { useGetSingleAccounting } from "../../../apiList/Department Api/Accounting Api/accountingApi";

// // --- Helper for Badge Colors ---
// const getStatusConfig = (status: string) => {
//     switch (status?.toLowerCase()) {
//         case 'paid':
//             return { bg: 'bg-green-100', text: 'text-green-700', icon: 'fa-check-circle', border: 'border-green-200' };
//         case 'processing':
//             return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'fa-spinner fa-spin', border: 'border-blue-200' };
//         case 'cancelled':
//         case 'failed':
//             return { bg: 'bg-red-100', text: 'text-red-700', icon: 'fa-times-circle', border: 'border-red-200' };
//         default: // pending
//             return { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'fa-clock', border: 'border-orange-200' };
//     }
// };

// const AccountingSingle: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     // --- Fetch Data ---
//     const { data: apiResponse, isLoading, isError, refetch } = useGetSingleAccounting(id!);



//     // --- Render Loading / Error ---
//     if (isLoading) return <div className="p-6"><MaterialOverviewLoading /></div>;

//     if (isError || !apiResponse) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl p-6 border border-red-100 m-4">
//                 <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4" />
//                 <h3 className="text-lg font-semibold text-red-800 mb-2">Could not load details</h3>
//                 <Button onClick={() => refetch()} variant="secondary">Retry</Button>
//             </div>
//         );
//     }

//     // --- Data Extraction based on your JSON structure ---
//     const summary = apiResponse.data;    // The main ledger summary
//     const raw = apiResponse.raw;         // The raw populated objects
//     const bill = raw?.bill;              // Source Document
//     const payment = raw?.payment;        // Payment Document (Can be null)

//     const statusConfig = getStatusConfig(summary?.status);

//     return (
//         <div className="p-4 h-full overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">

//             {/* --- Header --- */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
//                 <div className="flex gap-3 items-center">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-10 h-10 border border-gray-200 text-gray-600 rounded-lg transition-all"
//                     >
//                         <i className="fas fa-arrow-left" />
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                             {summary.recordNumber || 'Transaction Details'}
//                         </h1>
//                         <p className="text-sm text-gray-500">
//                             Created on {dateFormate(summary.createdAt)} via <span className="font-semibold text-blue-600 capitalize">{summary.type || 'Bill'}</span>
//                         </p>
//                     </div>
//                 </div>

//                 {summary.type !== "Invoice" && <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} capitalize flex items-center gap-2 shadow-sm`}>
//                     <i className={`fas ${statusConfig.icon}`}></i>
//                     {summary.status}
//                 </div>}
//             </div>

//             {/* --- Overview Cards --- */}
//             <div className={`grid grid-cols-1 ${summary.type !== "Invoice" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"} gap-4`}>

//                 {/* 1. Payee Details */}
//                 <Card className="shadow-sm border-gray-200">
//                     <CardContent className="p-5">
//                         <div className="flex items-center justify-between mb-2">
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payee Details</h3>
//                             <i className="fas fa-user-circle text-blue-200 text-xl"></i>
//                         </div>
//                         <div className="font-bold text-gray-800 text-lg truncate" title={summary.person?.name}>
//                             {summary.person?.name || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1 capitalize">
//                             {summary.person?.model?.replace('AccountModel', '').replace('Model', '') || 'Vendor'}
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* 2. Source Details (Bill) */}
//                 <Card className="shadow-sm border-gray-200">
//                     <CardContent className="p-5">
//                         <div className="flex items-center justify-between mb-2">
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Source Bill</h3>
//                             <i className="fas fa-file-invoice text-purple-200 text-xl"></i>
//                         </div>
//                         <div className="font-bold text-gray-800">
//                             {bill?.billNumber || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                             Date: {dateFormate(bill?.billDate)}
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* 3. Payment Details (Nullable) */}
//                 {summary.type !== "Invoice" && <Card className={`shadow-sm ${payment ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50'}`}>
//                     <CardContent className="p-5">
//                         <div className="flex items-center justify-between mb-2">
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Record</h3>
//                             <i className={`fas fa-money-check-alt text-xl ${payment ? 'text-green-500' : 'text-gray-300'}`}></i>
//                         </div>
//                         {payment ? (
//                             <>
//                                 <div className="font-bold text-gray-800">
//                                     {payment.paymentNumber}
//                                 </div>
//                                 <div className="text-xs text-gray-500 mt-1">
//                                     {payment.paymentDate ? `Paid: ${dateFormate(payment.paymentDate)}` : 'Processing...'}
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="text-sm text-gray-400 italic mt-2">
//                                 No payment record linked yet.
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>}

//                 {/* 4. Financials */}
//                 <Card className="shadow-sm border-blue-200 bg-blue-50/30">
//                     <CardContent className="p-5 flex flex-col justify-center items-end h-full">
//                         <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total Amount</h3>
//                         <div className="text-2xl font-bold text-blue-700">
//                             ₹{bill?.grandTotal?.toLocaleString('en-IN')}
//                         </div>
//                         {bill?.taxAmount > 0 && (
//                             <div className="text-xs text-blue-400 mt-1">
//                                 (Incl. ₹{bill.taxAmount} Tax)
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* --- Attachments / Proof --- */}
//             {bill?.pdfData?.url && (
//                 <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
//                             <i className="fas fa-file-pdf text-xl"></i>
//                         </div>
//                         <div>
//                             <h4 className="text-sm font-semibold text-gray-800">Original Bill Document</h4>
//                             <p className="text-xs text-gray-500 max-w-md truncate">{bill.pdfData.originalName}</p>
//                         </div>
//                     </div>
//                     <a
//                         href={bill.pdfData.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
//                     >
//                         <i className="fas fa-external-link-alt"></i> View Proof
//                     </a>
//                 </div>
//             )}

//             {/* --- Items Table Section --- */}
//             <Card className="shadow-sm border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//                     <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                         <i className="fas fa-list text-blue-500"></i>
//                         Transaction Items
//                     </h2>
//                     <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
//                         {bill?.items?.length || 0} Items
//                     </span>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
//                             <tr>
//                                 <th className="px-6 py-3 text-center w-16">S.No</th>
//                                 <th className="px-6 py-3">Item Name</th>
//                                 <th className="px-6 py-3">Unit</th>
//                                 <th className="px-6 py-3 text-center">Qty</th>
//                                 <th className="px-6 py-3 text-right">Rate</th>
//                                 <th className="px-6 py-3 text-right">Total Cost</th>
//                                 {summary.type !== "Invoice" && <><th className="px-6 py-3">Order ID</th>
//                                     <th className="px-6 py-3">Txn ID</th>
//                                     <th className="px-6 py-3 text-center">Item Status</th>
//                                 </>
//                                 }
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {(!bill?.items || bill.items.length === 0) ? (
//                                 <tr>
//                                     <td colSpan={9} className="px-6 py-8 text-center text-gray-400 italic">
//                                         No items found in the source document.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 bill.items.map((item: any, index: number) => {

//                                     // We try to find the corresponding item in the payment record if it exists
//                                     // Assuming order is preserved or mapping is possible. 
//                                     // Since both arrays usually come from the same source creation logic, index mapping is often safe here.
//                                     const paymentItem = payment?.items?.[index];

//                                     // If payment doesn't exist, status is pending. If it does, use item status.
//                                     const itemStatus = paymentItem?.status || 'pending';

//                                     return (
//                                         <tr key={item._id || index} className="hover:bg-blue-50/30 transition-colors">
//                                             {/* S.No */}
//                                             <td className="px-6 py-4 text-center text-gray-500">
//                                                 {index + 1}
//                                             </td>

//                                             {/* Item Name */}
//                                             <td className="px-6 py-4 font-medium text-gray-800">
//                                                 {item.itemName}
//                                             </td>

//                                             {/* Unit */}
//                                             <td className="px-6 py-4 text-gray-500 text-xs uppercase">
//                                                 {item.unit || '-'}
//                                             </td>

//                                             {/* Qty */}
//                                             <td className="px-6 py-4 text-center text-gray-700 font-medium">
//                                                 {item.quantity}
//                                             </td>

//                                             {/* Rate */}
//                                             <td className="px-6 py-4 text-right text-gray-600 font-mono text-xs">
//                                                 {item.rate?.toLocaleString()}
//                                             </td>

//                                             {/* Total Cost */}
//                                             <td className="px-6 py-4 text-right font-bold text-blue-700 font-mono text-xs">
//                                                 ₹{item.totalCost?.toLocaleString()}
//                                             </td>

//                                            {summary.type !=="Invoice" &&<> <td className="px-6 py-4">
//                                                 {paymentItem?.orderId || item.orderId ? (
//                                                     <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 block truncate w-24" title={paymentItem?.orderId || item.orderId}>
//                                                         {paymentItem?.orderId || item.orderId}
//                                                     </span>
//                                                 ) : (
//                                                     <span className="text-gray-300">-</span>
//                                                 )}
//                                             </td>

//                                             <td className="px-6 py-4">
//                                                 {paymentItem?.transactionId ? (
//                                                     <span className="font-mono text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 block truncate w-24" title={paymentItem.transactionId}>
//                                                         {paymentItem.transactionId}
//                                                     </span>
//                                                 ) : (
//                                                     <span className="text-xs text-gray-400 italic">Pending</span>
//                                                 )}
//                                             </td>

//                                             <td className="px-6 py-4 text-center">
//                                                 {itemStatus === 'paid' ? (
//                                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide">
//                                                         <i className="fas fa-check-double"></i> Paid
//                                                     </span>
//                                                 ) : (
//                                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wide">
//                                                         <i className="fas fa-clock"></i> Pending
//                                                     </span>
//                                                 )}
//                                             </td>

//                                             </>
//                                             }


//                                         </tr>
//                                     );
//                                 })
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>

//             {/* --- Notes Section --- */}
//             {(summary.notes || bill?.notes) && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
//                     <h4 className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
//                         <i className="fas fa-sticky-note"></i> Notes
//                     </h4>
//                     <p className="text-sm text-yellow-800/90 leading-relaxed">
//                         {summary.notes || bill?.notes}
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AccountingSingle;



// THIRD VERSION
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// --- Components ---
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import MaterialOverviewLoading from "../../Stage Pages/MaterialSelectionRoom/MaterailSelectionLoadings/MaterialOverviewLoading";

// --- Hooks & Utils ---
import { dateFormate } from "../../../utils/dateFormator";
import { useGetSingleAccounting } from "../../../apiList/Department Api/Accounting Api/accountingApi";
// import { useGetSingleAccounting } from "./hooks/accounting.hooks"; // Adjust path if needed

// --- Helper for Badge Colors ---
const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return { bg: 'bg-green-100', text: 'text-green-700', icon: 'fa-check-circle', border: 'border-green-200' };
        case 'processing':
            return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'fa-spinner fa-spin', border: 'border-blue-200' };
        case 'cancelled':
        case 'failed':
            return { bg: 'bg-red-100', text: 'text-red-700', icon: 'fa-times-circle', border: 'border-red-200' };
        default: // pending
            return { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'fa-clock', border: 'border-orange-200' };
    }
};

const AccountingSingle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // --- Fetch Data ---
    const { data: apiResponse, isLoading, isError, refetch } = useGetSingleAccounting(id!);

    // --- Render Loading / Error ---
    if (isLoading) return <div className="p-6"><MaterialOverviewLoading /></div>;

    if (isError || !apiResponse || !apiResponse.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl p-6 border border-red-100 m-4">
                <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Could not load details</h3>
                <Button onClick={() => refetch()} variant="secondary">Retry</Button>
            </div>
        );
    }

    // --- Data Extraction ---
    // We use the standardized data from the backend helper
    const record = apiResponse.data;
    const source = record.sourceDetails;
    const payment = record.paymentDetails;

    // --- Logic to determine View Mode ---
    // Check if the type string contains "Invoice" (e.g., "Invoice", "Retail Invoice")
    const isInvoiceType = record.type?.toLowerCase().includes('invoice');
    const isExpenseType = record.type?.toLowerCase().includes('expense');

    // We only show payment info for Bills, Expenses, SubContracts, etc.
    const showPaymentSection = !isInvoiceType;

    // 2. Item Table: Show for Bills and Invoices, BUT HIDE for Expenses
    const showItemTable = !isExpenseType;

    const statusConfig = getStatusConfig(record.status);

    return (
        <div className="p-4 h-full overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">

            {/* --- Header --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-10 h-10 border border-gray-200 text-gray-600 rounded-lg transition-all"
                    >
                        <i className="fas fa-arrow-left" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {record.recordNumber || 'Transaction Details'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Created on {dateFormate(record.createdAt)} via <span className="font-semibold text-blue-600 capitalize">{record.type}</span>
                        </p>
                    </div>
                </div>

                {/* Hide Status for Invoices if strictly required, otherwise show for all */}
                {showPaymentSection && (
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} capitalize flex items-center gap-2 shadow-sm`}>
                        <i className={`fas ${statusConfig.icon}`}></i>
                        {record.status}
                    </div>
                )}
            </div>

            {/* --- Overview Cards --- */}
            {/* Adjust grid columns: 3 cols for Invoice, 4 cols for Bills/Expenses */}
            <div className={`grid grid-cols-1 ${showPaymentSection ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"} gap-4`}>

                {/* 1. Payee Details */}
                <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {isInvoiceType ? "Payer Details" : "Payee Details"}
                            </h3>
                            <i className="fas fa-user-circle text-blue-200 text-xl"></i>
                        </div>
                        <div className="font-bold text-gray-800 text-lg truncate" title={record.person?.name}>
                            {record.person?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                            {record.person?.model?.replace('AccountModel', '').replace('Model', '') || 'Unknown'}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Source Details (Bill/Invoice No) */}
                <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {isInvoiceType ? "Invoice Info" : "Source Document"}
                            </h3>
                            <i className={`fas ${isInvoiceType ? 'fa-file-contract' : 'fa-file-invoice'} text-purple-200 text-xl`}></i>
                        </div>
                        <div className="font-bold text-gray-800">
                            {source?.deptNumber || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Date: {dateFormate(source?.deptGeneratedDate)}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Payment Details (Conditionally Rendered) */}
                {showPaymentSection && (
                    <Card className={`shadow-sm ${payment ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50'}`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Record</h3>
                                <i className={`fas fa-money-check-alt text-xl ${payment ? 'text-green-500' : 'text-gray-300'}`}></i>
                            </div>
                            {payment ? (
                                <>
                                    <div className="font-bold text-gray-800">
                                        {payment.number}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {payment.date ? `Paid: ${dateFormate(payment.date)}` : 'Processing...'}
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-gray-400 italic mt-2">
                                    No payment record linked yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* 4. Financials */}
                <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                    <CardContent className="p-5 flex flex-col justify-center items-end h-full">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total Amount</h3>
                        <div className="text-2xl font-bold text-blue-700">
                            ₹{source?.grandTotal?.toLocaleString('en-IN') || record.amount?.toLocaleString('en-IN')}
                        </div>
                        {/* {source?.taxAmount > 0 && (
                            <div className="text-xs text-blue-400 mt-1">
                                (Incl. ₹{source.taxAmount} Tax)
                            </div>
                        )} */}
                    </CardContent>
                </Card>
            </div>


            {isExpenseType && (
                <Card className="shadow-sm border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100 bg-pink-50/50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <i className="fas fa-info-circle text-pink-500"></i>
                            Expense Details
                        </h2>
                    </div>
                    <CardContent className="p-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Description / Purpose</h4>
                            <p className="text-gray-800 text-lg font-medium leading-relaxed">
                                {source?.notes || "No description provided for this expense."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* --- Items Table Section --- */}
            {showItemTable && (
            <Card className="shadow-sm border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-list text-blue-500"></i>
                        Transaction Items
                    </h2>
                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                        {source?.items?.length || 0} Items
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 text-center w-16">S.No</th>
                                <th className="px-6 py-3">Item Name</th>
                                <th className="px-6 py-3">Unit</th>
                                <th className="px-6 py-3 text-center">Qty</th>
                                <th className="px-6 py-3 text-right">Rate</th>
                                <th className="px-6 py-3 text-right">Total Cost</th>

                                {/* Conditional Columns for Payment Data */}
                                {showPaymentSection && (
                                    <>
                                        <th className="px-6 py-3">Order ID</th>
                                        <th className="px-6 py-3">Txn ID</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(!source?.items || source.items.length === 0) ? (
                                <tr>
                                    <td colSpan={showPaymentSection ? 9 : 6} className="px-6 py-8 text-center text-gray-400 italic">
                                        No items found in the source document.
                                    </td>
                                </tr>
                            ) : (
                                source.items.map((item: any, index: number) => {

                                    // If payment exists, try to map the item details (useful for partial payments/status)
                                    const paymentItem = payment?.items?.[index];
                                    const itemStatus = paymentItem?.status || 'pending';

                                    return (
                                        <tr key={item._id || index} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 text-center text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{item.itemName || item.name}</td>
                                            <td className="px-6 py-4 text-gray-500 text-xs uppercase">{item.unit || '-'}</td>
                                            <td className="px-6 py-4 text-center text-gray-700 font-medium">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-gray-600 font-mono text-xs">{item.rate?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-blue-700 font-mono text-xs">
                                                ₹{(item.totalCost || (item.rate * item.quantity))?.toLocaleString()}
                                            </td>

                                            {/* Conditional Cells */}
                                            {showPaymentSection && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        {paymentItem?.orderId || item.orderId ? (
                                                            <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 block truncate w-24" title={paymentItem?.orderId || item.orderId}>
                                                                {paymentItem?.orderId || item.orderId}
                                                            </span>
                                                        ) : <span className="text-gray-300">-</span>}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {paymentItem?.transactionId ? (
                                                            <span className="font-mono text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 block truncate w-24" title={paymentItem.transactionId}>
                                                                {paymentItem.transactionId}
                                                            </span>
                                                        ) : <span className="text-xs text-gray-400 italic">Pending</span>}
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        {itemStatus === 'paid' ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide">
                                                                <i className="fas fa-check-double"></i> Paid
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wide">
                                                                <i className="fas fa-clock"></i> Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            )}

            {/* --- Notes Section --- */}
            {(!isExpenseType && (source?.notes)) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
                        <i className="fas fa-sticky-note"></i> Notes
                    </h4>
                    <p className="text-sm text-yellow-800/90 leading-relaxed">
                        {source.notes}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AccountingSingle;