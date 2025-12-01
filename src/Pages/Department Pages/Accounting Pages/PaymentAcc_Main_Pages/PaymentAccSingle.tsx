import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSinglePayment, useSyncPaymentToAccounts } from "../../../../apiList/Department Api/Accounting Api/paymentAccApi";
import { toast } from "../../../../utils/toast";
import { Button } from "../../../../components/ui/Button";
import { dateFormate } from "../../../../utils/dateFormator";
import { Card, CardContent } from "../../../../components/ui/Card";
import InfoTooltip from "../../../../components/ui/InfoToolTip";

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

    // --- Fetch Data ---
    const { data, isLoading, isError, refetch } = useGetSinglePayment(id!);

    const { mutateAsync: syncAccountsMutation, isPending: syncAccountsLoading } = useSyncPaymentToAccounts()
    // --- Local State for interactions ---
    const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

    const handleSyncToAccounts = async () => {
        try {
            await syncAccountsMutation({
                id: id!
            });
            toast({ title: "Success", description: "Bill sent to Accounts Department" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error?.response?.data?.message || error?.message || "operation failed" });
        }
    }


    // --- Dummy Pay Function ---
    const handleItemPay = (
        itemId: string, _amount: number
    ) => {
        // if (!confirm(`Initiate dummy payment of ₹${amount}?`)) return;

        // // 1. Set loading state
        setProcessingItems(prev => new Set(prev).add(itemId));

        // // 2. Simulate API call
        // setTimeout(() => {
        //     toast({
        //         title: "Payment Initiated",
        //         description: "This is a dummy payment action.",
        //         variant: "default"
        //     });
        //     // Remove loading state
        //     setProcessingItems(prev => {
        //         const newSet = new Set(prev);
        //         newSet.delete(itemId);
        //         return newSet;
        //     });
        // }, 1500);

        toast({
            title: "Dummy Payment",
            description: "Payment integration comming soon",
            variant: "default"
        });
    };

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

    return (
        <div className="p-4 h-full overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">

            {/* --- Top Header --- */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex gap-3 items-center">
                    <div
                        onClick={() => navigate(-1)}
                        className="bg-white hover:bg-gray-100 shadow-sm flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-600 text-sm cursor-pointer rounded-lg transition-all"
                    >
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


                <div  className="flex items-center gap-3 ">
                    <div className="flex items-center space-y-1">
                        <Button
                            variant="primary"
                            isLoading={syncAccountsLoading}
                            onClick={handleSyncToAccounts}
                        >
                            Send To Accounts Dept
                        </Button>

                        <InfoTooltip
                            content="Click the button to send the payment to accounts department"
                            type="info"
                            position="bottom"
                        />
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

                    {/* 1. Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {/* Payee */}
                        <div className="md:col-span-1">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Payee Details</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{data.paymentPersonName || 'N/A'}</p>
                                    <p className="text-xs text-gray-500 capitalize">{data.paymentPersonModel?.replace('Model', '') || 'Vendor'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="md:col-span-1">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Important Dates</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Bill Date:</span>
                                    <span className="font-medium">{dateFormate(data.paymentDate)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Due Date:</span>
                                    <span className="font-medium text-red-600">{dateFormate(data.dueDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="md:col-span-2 flex flex-col items-end justify-center pl-8 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total Payable Amount</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    ₹{data.grandTotal?.toLocaleString('en-IN')}
                                </h2>
                                {data.taxAmount > 0 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        (Includes ₹{data.taxAmount} Tax)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Items Table Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 w-1 h-6 rounded-full"></div>
                                <h2 className="text-xl font-bold text-gray-800">Payment Items</h2>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                    {data.items?.length || 0}
                                </span>
                            </div>

                            {/* Global Pay Button (Optional) */}
                            {/* <Button size="sm" variant="primary">Pay All</Button> */}
                        </div>

                        {/* --- TABLE START --- */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <div className="grid grid-cols-12 gap-2 px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                                    <div className="col-span-1 text-center">S.No</div>
                                    <div className="col-span-2">Item Name</div>
                                    <div className="col-span-1">Unit</div>
                                    <div className="col-span-1 text-center">Qty</div>
                                    <div className="col-span-1 text-right">Rate</div>
                                    <div className="col-span-1 text-right">Total</div>
                                    <div className="col-span-1">Order ID</div>
                                    <div className="col-span-2">Txn ID</div>
                                    <div className="col-span-1">Due Date</div>
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
                                                className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm hover:bg-blue-50/30 transition-colors"
                                            >
                                                {/* S.No */}
                                                <div className="col-span-1 text-center text-gray-500 font-medium">
                                                    {index + 1}
                                                </div>

                                                {/* Item Name */}
                                                <div className="col-span-2 font-medium text-gray-800 truncate" title={item.itemName}>
                                                    {item.itemName}
                                                </div>

                                                {/* Unit */}
                                                <div className="col-span-1 text-gray-500 text-xs">
                                                    {item.unit || '-'}
                                                </div>

                                                {/* Qty */}
                                                <div className="col-span-1 text-center text-gray-700">
                                                    {item.quantity}
                                                </div>

                                                {/* Rate */}
                                                <div className="col-span-1 text-right text-gray-600 font-mono text-xs">
                                                    {item.rate?.toLocaleString()}
                                                </div>

                                                {/* Total Cost */}
                                                <div className="col-span-1 text-right font-bold text-blue-700 font-mono text-xs">
                                                    ₹{item.totalCost?.toLocaleString()}
                                                </div>

                                                {/* Order ID */}
                                                <div className="col-span-1">
                                                    {item.orderId ? (
                                                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-mono truncate block" title={item.orderId}>
                                                            {item.orderId.slice(-6)}..
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 text-xs">-</span>
                                                    )}
                                                </div>

                                                {/* Txn ID */}
                                                <div className="col-span-2">
                                                    {item.transactionId ? (
                                                        <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded text-[10px] font-mono truncate block" title={item.transactionId}>
                                                            {item.transactionId}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 text-xs italic">Pending</span>
                                                    )}
                                                </div>

                                                {/* Due Date (Fallback to main due date if item doesn't have one) */}
                                                <div className="col-span-1 text-xs text-gray-600">
                                                    {dateFormate(data.dueDate)}
                                                </div>

                                                {/* Pay Action */}
                                                <div className="col-span-1 text-center">
                                                    {itemStatus === 'paid' ? (
                                                        <span className="text-green-600 text-xs font-bold flex justify-center items-center gap-1">
                                                            <i className="fas fa-check-double"></i> Paid
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleItemPay(
                                                                item._id || index.toString(),
                                                                item.totalCost
                                                            )
                                                            }
                                                            disabled={isProcessing}
                                                            className={`
                                                                cursor-pointer
                                                                px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1 w-full
                                                                ${isProcessing
                                                                    ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                                    : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                                                }
                                                            `}
                                                        >
                                                            {isProcessing ? (
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <>Pay <i className="fas fa-angle-right text-[10px]"></i></>
                                                            )}
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
                        {/* --- TABLE END --- */}
                    </div>

                    {/* 3. Notes & Extra Info */}
                    {data.notes && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-yellow-800 mb-1">
                                <i className="fas fa-sticky-note mr-2"></i>Notes
                            </h4>
                            <p className="text-sm text-yellow-800/80">{data.notes}</p>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentAccSingle;