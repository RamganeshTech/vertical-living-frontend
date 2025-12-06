import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSinglePayment, useSyncPaymentToAccounts } from "../../../../apiList/Department Api/Accounting Api/paymentAccApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { dateFormate } from "../../../../utils/dateFormator";
import { Card, CardContent } from "../../../../components/ui/Card";
import InfoTooltip from "../../../../components/ui/InfoToolTip";

// ... existing getStatusConfig function ...
const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return { bg: 'bg-green-100', text: 'text-green-700', icon: 'fa-check-circle', badge: 'bg-green-100 text-green-700' };
        case 'processing':
            return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'fa-spinner fa-spin', badge: 'bg-blue-100 text-blue-700' };
        case 'failed':
            return { bg: 'bg-red-100', text: 'text-red-700', icon: 'fa-times-circle', badge: 'bg-red-100 text-red-700' };
        default: // pending
            return { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'fa-clock', badge: 'bg-orange-100 text-orange-700' };
    }
};

const PaymentAccSingle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useGetSinglePayment(id!);
    const { mutateAsync: syncAccountsMutation, isPending: syncAccountsLoading } = useSyncPaymentToAccounts();

    const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

    const handleSyncToAccounts = async () => {
        try {
            await syncAccountsMutation({ id: id! });
            toast({ title: "Success", description: "Bill sent to Accounts Department" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }

    const handleItemPay = (itemId: string, _amount: number) => {
        setProcessingItems(prev => new Set(prev).add(itemId));
        toast({
            title: "Dummy Payment",
            description: "Payment integration coming soon",
            variant: "default"
        });
    };

    const isExpense = data?.fromSection?.toLowerCase() === 'expense';


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                    <p className="text-gray-500">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl p-6 border border-red-100">
                <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Could not load details</h3>
                <Button onClick={() => refetch()} variant="secondary">Retry</Button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(data.generalStatus);

    const expenseItemName = data.items && data.items.length > 0 ? data.items[0].itemName : "Expense Item";


    return (
        <div className="p-4 h-full overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">

            {/* --- Top Header --- */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex gap-3 items-center">
                    <div onClick={() => navigate(-1)} className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-600 text-sm cursor-pointer rounded-lg transition-all">
                        <i className="fas fa-arrow-left" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Payment: <span className="text-blue-600">{data.paymentNumber}</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Created on {dateFormate(data.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center space-y-1">
                        <Button variant="primary" isLoading={syncAccountsLoading} onClick={handleSyncToAccounts}>
                            Send To Accounts Dept
                        </Button>
                        <InfoTooltip content="Click to send the payment to accounts department" type="info" position="bottom" />
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusConfig.bg} ${statusConfig.text} border-current/20 capitalize flex items-center gap-2`}>
                        <i className={`fas ${statusConfig.icon}`}></i>
                        {data.generalStatus}
                    </div>
                </div>
            </div>

            {/* --- Main Content Card --- */}
            <Card className="shadow-sm border border-gray-200 bg-white">
                <CardContent className="p-6 space-y-8">



                    {/* --- 1. Overview Grid (Updated for Compactness) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-gray-50/80 rounded-xl border border-gray-200/60 min-h-[80px]">

                        {/* COLUMN 1: Payee Profile (Compact) */}
                        <div className="md:col-span-1 flex gap-3 items-start overflow-hidden">
                            {/* Image / Placeholder */}
                            <div className="flex-shrink-0">
                                {data.paymentPersonId?.mainImage?.url ? (
                                    <img
                                        src={data.paymentPersonId.mainImage.url}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                                        <i className="fas fa-user text-sm"></i>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col min-w-0 space-y-0.5">
                                {/* Name */}
                                <p className="font-bold text-gray-800 text-sm leading-tight truncate" title={data.paymentPersonName}>
                                    {data?.paymentPersonName}
                                </p>

                                {/* Model Type Badge (Tiny) */}
                                {data.paymentPersonModel && (
                                    <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide leading-none">
                                        {/* {data.paymentPersonModel.replace('Model', '')} */}
                                        <p className="text-xs text-gray-500 capitalize">{data.paymentPersonModel?.replace('Model', '')}</p>

                                    </span>
                                )}

                                {/* Phone */}
                                {(
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 leading-none pt-0.5">
                                        <i className="fas fa-phone-alt text-[8px]"></i>
                                        <span>{data?.paymentPersonId?.phone?.mobile || "No Ph"}</span>
                                        <span>{data?.paymentPersonId?.phone?.work}</span>
                                    </div>
                                )}

                                {/* Address (Truncated) */}
                                {(
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 leading-tight pt-0.5 truncate">
                                        <i className="fas fa-map-marker-alt text-[8px]"></i>
                                        <span className="truncate">
                                            {data?.paymentPersonId?.address ?
                                                data?.paymentPersonId?.address : "No Address"
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COLUMN 2: Reference Info (No Labels) */}
                        <div className="md:col-span-1 flex flex-col justify-center space-y-1 pl-2 md:border-l border-gray-200 border-dashed">

                            {/* From Section (Badge style) */}
                            {data.fromSection && (
                                <span className="inline-flex text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-200/50 px-1.5 rounded w-fit">
                                    {data?.fromSection}
                                </span>
                            )}

                            {/* Section Number (Big & Bold) */}
                            {data.fromSectionNumber && (
                                <div className="font-mono text-sm font-bold text-gray-800 leading-none">
                                    #{data?.fromSectionNumber}
                                </div>
                            )}

                            {/* Payment Type */}
                            {data?.paymentType && (
                                <div className="text-[10px] text-gray-500 font-medium capitalize flex items-center gap-1 pt-0.5">
                                    <i className="fas fa-credit-card text-[9px]"></i>
                                    {data?.paymentType}
                                </div>
                            )}

                            {data?.projectId?.projectName && (
                                <div className="text-[10px] text-gray-900 font-medium capitalize flex items-center gap-1 pt-0.5">
                                    <i className="fas fa-folder-open text-[9px]"></i>

                                   <span className="text-gray-500">project:</span>  {" "}
                                    {data?.projectId?.projectName}
                                </div>
                            )}
                        </div>

                        {/* COLUMN 3: Important Dates */}
                        <div className="md:col-span-1 flex flex-col justify-center space-y-1.5 pl-2 md:border-l border-gray-200 border-dashed">

                            <div className="flex items-center justify-between md:justify-start md:gap-2 text-xs">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wide w-18">Payment Date</span>
                                <span className="font-medium text-gray-700">{dateFormate(data?.paymentDate)}</span>
                            </div>


                            {data.dueDate && (
                                <div className="flex items-center justify-between md:justify-start md:gap-2 text-xs">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wide w-18">Due</span>
                                    <span className="font-medium text-red-600 bg-red-50 px-1 rounded">
                                        {dateFormate(data?.dueDate)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* COLUMN 4: Financials (Right Aligned) */}
                        <div className="md:col-span-1 flex flex-col items-end justify-center pl-4 md:border-l border-gray-200">
                            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-0.5">Payable</p>
                            <h2 className="text-2xl font-bold text-gray-900 leading-none">
                                ₹{data?.grandTotal?.toLocaleString('en-IN')}
                            </h2>
                            {data.taxAmount > 0 && (
                                <p className="text-[9px] text-gray-400 mt-1">
                                    + ₹{data?.taxAmount} Tax
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 2. Items Table Section */}

                    {isExpense ? (
                        // ==================== EXPENSE CARD VIEW ====================
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[250px]">

                            {/* Left: Details & Notes (Takes up more space) */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col">
                                {/* Header Row */}
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                        <i className="fas fa-shopping-basket text-lg"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-700 leading-tight">
                                            {expenseItemName}
                                        </h3>
                                        <p className="text-xs text-gray-400">Expense / Small Purchase</p>
                                    </div>
                                </div>

                                {/* Prominent Notes Section */}
                                <div className="flex-1 flex flex-col">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <i className="fas fa-align-left"></i> Description / Notes
                                    </label>
                                    
                                    <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100 relative group hover:border-blue-200 transition-colors">
                                        {/* Decorative quote icon */}
                                        {/* <i className="fas fa-quote-left absolute top-4 left-4 text-gray-200 text-2xl -z-0"></i> */}
                                        
                                        <div className="relative z-10">
                                            {data.notes ? (
                                                <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                                    {data.notes}
                                                </p>
                                            ) : (
                                                <p className="text-gray-400 italic">No additional details provided for this expense.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment Action Sidebar */}
                            <div className="w-full md:w-80 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col justify-center items-center text-center relative">
                                {/* Dotted separator visual for desktop */}
                                <div className="hidden md:block absolute left-0 top-6 bottom-6 w-[1px] border-l border-dashed border-gray-300/50"></div>

                                <div className="mb-6">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Total Payable</p>
                                    <h2 className="text-4xl font-bold text-blue-900 font-mono tracking-tight">
                                        ₹{data?.grandTotal?.toLocaleString('en-IN')}
                                    </h2>
                                </div>

                                {data?.generalStatus?.toLowerCase() !== 'paid' ? (
                                    <div className="w-full space-y-3">
                                        <Button
                                            onClick={() => handleItemPay(data._id, data.grandTotal)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all py-6 text-lg rounded-xl font-semibold group"
                                        >
                                            Pay Now <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                        </Button>
                                        <p className="text-[10px] text-gray-400">
                                            Clicking pay will process the full amount.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-1">
                                            <i className="fas fa-check text-3xl"></i>
                                        </div>
                                        <div className="text-green-700 font-bold text-lg">Paid Successfully</div>
                                        <p className="text-xs text-green-600/80">No further action needed.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    ) : (
                        <>
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-600 w-1 h-6 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-gray-800">Payment Items</h2>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                            {data.items?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* --- TABLE START --- */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                                    {/* 
                                CHANGED: Grid cols increased to 13 to fit the new column.
                            */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        <div className="grid grid-cols-11 gap-2 px-4 py-3 font-semibold text-xs uppercase tracking-wider items-center">
                                            <div className="col-span-1 text-center">S.No</div>
                                            <div className="col-span-2">Item Name</div>
                                            <div className="col-span-1">Unit</div>
                                            <div className="col-span-1 text-center">Qty</div>
                                            <div className="col-span-1 text-center">Rate</div>
                                            <div className="col-span-1 text-center">Total</div>
                                            <div className="col-span-1 text-center">Order ID</div>
                                            <div className="col-span-2 text-center">Txn ID</div>
                                            {/* <div className="col-span-1">Due Date</div> */}
                                            <div className="col-span-1 text-center">Pay</div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="bg-white divide-y divide-gray-100">
                                        {(!data.items || data.items.length === 0) ? (
                                            <div className="p-8 text-center text-gray-400">
                                                No items found in this payment record.
                                            </div>
                                        ) : (
                                            data.items.map((item: any, index: number) => {
                                                const isProcessing = processingItems.has(item._id || index.toString());
                                                const itemStatus = item.status || 'pending';

                                                return (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-11 gap-2 px-4 py-3 items-center text-sm hover:bg-blue-50/30 transition-colors"
                                                    >
                                                        <div className="col-span-1 text-center text-gray-500 font-medium">{index + 1}</div>
                                                        <div className="col-span-2 font-medium text-gray-800 truncate" title={item.itemName}>{item.itemName}</div>
                                                        <div className="col-span-1 text-gray-500 text-xs">{item.unit || '-'}</div>
                                                        <div className="col-span-1 text-center text-gray-700">{item.quantity}</div>
                                                        <div className="col-span-1 text-center text-gray-600 font-mono text-xs">{item.rate?.toLocaleString()}</div>

                                                        {/* Base Total (Qty * Rate) */}
                                                        <div className="col-span-1 text-center text-gray-500 font-mono text-xs">
                                                            ₹{item.totalCost?.toLocaleString()}
                                                        </div>

                                                        <div className="col-span-1 text-center">
                                                            {item.orderId ? (
                                                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-mono truncate block" title={item.orderId}>
                                                                    {item.orderId.slice(-6)}..
                                                                </span>
                                                            ) : <span className="text-gray-900 text-lg ">-</span>}
                                                        </div>

                                                        <div className="col-span-2 text-center">
                                                            {item.transactionId ? (
                                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-[10px] font-mono truncate block" title={item.transactionId}>
                                                                    {item.transactionId}
                                                                </span>
                                                            ) : <span className="text-gray-300 text-xs italic">Pending</span>}
                                                        </div>

                                                        {/* <div className="col-span-1 text-xs text-gray-600">{dateFormate(data.dueDate)}</div> */}

                                                        <div className="col-span-1 text-center">
                                                            {itemStatus === 'paid' ? (
                                                                <span className="text-green-600 text-xs font-bold flex justify-center items-center gap-1">
                                                                    <i className="fas fa-check-double"></i> Paid
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleItemPay(item._id || index.toString(), item.totalCost)}
                                                                    disabled={isProcessing}
                                                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1 w-full
                                                                ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}
                                                            `}
                                                                >
                                                                    {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-rupee-sign"></i> Pay</>}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    {/* Table Footer */}
                                    <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Showing {data.items?.length} items</span>
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Paid</span>
                                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Unpaid</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <section className="flex flex-col items-end justify-end mt-6 pt-2">
                                    {/* Summary Container */}
                                    <div className="w-full md:w-1/2 lg:w-[40%] bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-3">

                                        {/* 1. Sub Total */}
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span className="font-medium">Sub Total</span>
                                            <span className="font-mono font-semibold text-gray-800">
                                                ₹{data.totalAmount?.toLocaleString('en-IN') || 0}
                                            </span>
                                        </div>

                                        {/* 2. Discount (Conditional) */}
                                        {(data.discountAmount > 0 || (data.discountPercentage && data.discountPercentage > 0)) ? (
                                            <div className="flex justify-between items-center text-sm text-green-700">
                                                <span className="font-medium flex items-center gap-2">
                                                    Discount
                                                    {data.discountPercentage ? (
                                                        <span className="text-[10px] bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-md font-bold">
                                                            {data.discountPercentage}%
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <span className="font-mono font-semibold">
                                                    - ₹{data.discountAmount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ) : null}

                                        {/* 3. Tax (Conditional) */}
                                        {(data.taxAmount > 0 || (data.taxPercentage && data.taxPercentage > 0)) ? (
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span className="font-medium flex items-center gap-2">
                                                    Tax
                                                    {data.taxPercentage ? (
                                                        <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-bold">
                                                            {data.taxPercentage}%
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <span className="font-mono font-semibold">
                                                    + ₹{data.taxAmount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ) : null}

                                        {/* 4. Advanced Amount (Optional - Good to handle if schema has it) */}
                                        {data.advancedAmount && data.advancedAmount > 0 && (
                                            <div className="flex justify-between items-center text-sm text-blue-600">
                                                <span className="font-medium">Advanced Paid</span>
                                                <span className="font-mono font-semibold">
                                                    - ₹{data.advancedAmount?.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <div className="border-t border-dashed border-gray-300 my-3"></div>


                                        {data?.advancedAmount?.totalAmount > 0 && (
                                            <div className="flex items-center justify-between rounded-xl">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-bold text-gray-800">Advance Amount</span>
                                                </div>

                                                <div className="flex flex-col items-end gap-3">
                                                    <span className="text-2xl font-bold text-purple-700 font-mono">
                                                        ₹{data.advancedAmount.totalAmount.toLocaleString('en-IN')}
                                                    </span>

                                                    <Button
                                                        onClick={() => handleItemPay(data._id, data.advancedAmount.totalAmount)}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all w-32"
                                                        size="sm"
                                                    >
                                                        Pay Advance <i className="fas fa-arrow-right ml-2 text-xs"></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}


                                        {/* 5. Grand Total & Pay Button */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-gray-800">{data?.advancedAmount?.totalAmount ? "Remaining Amount To Pay" : "Total Amount"}</span>
                                                <span className="text-xs text-gray-400 font-medium">Total Payable</span>
                                            </div>

                                            <div className="flex flex-col items-end gap-3">
                                                <span className="text-2xl font-bold text-blue-700 font-mono">
                                                    ₹{data.amountRemaining.totalAmount?.toLocaleString('en-IN')}
                                                </span>

                                                {/* Render Pay Button Only if Not Paid */}
                                                {data?.generalStatus?.toLowerCase() !== 'paid' ? (
                                                    <Button
                                                        onClick={() => handleItemPay(data._id, data?.amountRemaining?.totalAmount)}
                                                        // disabled={isProcessing}
                                                        // variant=""
                                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all w-32"
                                                        size="sm"
                                                    >
                                                        {/* {isGlobalProcessing ? (
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                ) : ( */}
                                                        <>Pay Now <i className="fas fa-arrow-right ml-2 text-xs"></i></>
                                                        {/* )} */}
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                                                        <i className="fas fa-check-circle"></i> Fully Paid
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </section>
                                {/* --- TABLE END --- */}
                            </div>

                            {data.notes && (
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-yellow-800 mb-1">
                                        <i className="fas fa-sticky-note mr-2"></i>Notes
                                    </h4>
                                    <p className="text-sm text-yellow-800/80">{data.notes}</p>
                                </div>
                            )}
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentAccSingle;